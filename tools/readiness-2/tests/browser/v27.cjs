// Browser proof for "Do you need AI?" v2.7 (owner, 25 Nov 2026): two PDFs on the result page, no sources in either.
//  1. the top row: Download result (PDF) #pdf (primary), Download answers (PDF) #pdf-answers, Start a new check #new-check
//  2. each button downloads its own file name (_result.pdf / _answers.pdf), standalone and in the hub (plain-link fallback)
//  3. one download at a time: while one runs both PDF buttons and Save as file are disabled, only the pressed one says it is working,
//     a click on the other one (even forced) makes no second download
//  4. through the hub bridge (a fake hub page that answers ping with downloads: true): two messages { hub: 'download' } with the right names
//  5. the PDF files themselves (pdftotext): the Result PDF has exactly the five sections, the Answers PDF every question once; neither has
//     "Source", a link or "Where this comes from"; the stop screen still has its one "Download (PDF)"
// Desktop 1280 and phone 390. Serve tools/ first:  python3 -m http.server 8815 --bind 127.0.0.1   (R2_BASE for another address)
// Run from tools/:  node readiness-2/tests/browser/v27.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8815/';
const OUT = process.env.R2_SHOTS || path.join(__dirname, 'shots');
fs.mkdirSync(OUT, { recursive: true });
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };

async function mk(b, w, touch) {
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch, acceptDownloads: true });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  return { ctx, p };
}
const st = f => f.evaluate(() => window.Readiness2.state());
async function toResult(f, use, extra) {
  await f.evaluate(([use, extra]) => {
    const R = window.Readiness2;
    R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('hotel', { k: 'name', v: 'Hôtel Alpenblick' }); R.send('next');
    ['q2', 'q3', 'q4', 'q5'].forEach(id => R.send('answer', { id, value: 'y' })); R.send('answer', { id: 'q1', value: 'n' }); R.send('next');
    for (let i = 1; i <= 10; i++) R.send('answer', { id: 'm' + i, value: 'y' });
    if (extra === 'planned') { R.send('answer', { id: 'm3', value: 'pl' }); R.send('by', { id: 'm3', date: '2027-01-15' }); }
    R.send('next');
    if (use === 'none') { R.send('cat', 'Guest-facing'); R.send('dept', 'gx'); R.send('use', 'none'); R.send('next'); }
    else { R.send('cat', 'Guest-facing'); R.send('dept', 'gx'); R.send('use', use); R.send('next'); R.state().tailored.forEach(id => R.send('answer', { id, value: 'y' })); R.send('next'); }
  }, [use, extra]);
  await f.waitForTimeout(100);
}
const txt = (file, a, z) => execFileSync('pdftotext', (a ? ['-f', String(a), '-l', String(z || a)] : []).concat(['-layout', file, '-'])).toString();
const norm = s => s.replace(/\s+/g, ' ');

// A fake hub page: same origin, answers ping with downloads: true, records every download message and says ok after a short wait.
const WRAP = '<!doctype html><title>fake hub</title><iframe id="fr" src="index.html" style="width:1200px;height:880px;border:0"></iframe><script>' +
  'window.__dl=[];window.addEventListener("message",function(e){var m=e.data;if(!m)return;' +
  'if(m.hub==="ping")e.source.postMessage({hub:"pong",downloads:true},location.origin);' +
  'else if(m.hub==="download"){window.__dl.push({name:m.filename,size:m.data&&m.data.size,type:m.data&&m.data.type});setTimeout(function(){e.source.postMessage({hub:"download-result",id:m.id,ok:true},location.origin);},400);}});</script>';

(async () => {
  const b = await chromium.launch({ args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessRespectPreflightResults'] });
  for (const [w, touch, wt] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    // ---------- standalone page ----------
    {
      const { ctx, p } = await mk(b, w, touch);
      await p.goto(BASE + 'readiness-2/standalone/index.html'); await p.waitForFunction(() => window.Readiness2);
      await toResult(p, 'gx-2', 'planned');
      ok((await st(p)).step === 'result', wt + ' standalone: on the result');
      ok((await p.$$eval('#actions > *', e => e.map(x => x.id))).join() === 'pdf,pdf-answers,new-check' && (await p.$$eval('#actions > *', e => e.map(x => x.textContent))).join('|') === 'Download result (PDF)|Download answers (PDF)|Start a new check', wt + ' 1: the top row: Download result (PDF), Download answers (PDF), Start a new check');
      ok((await p.getAttribute('#pdf', 'class')).includes('primary') && !(await p.getAttribute('#pdf-answers', 'class')).includes('primary') && (await p.getAttribute('#pdf', 'data-act')) === 'pdf' && (await p.getAttribute('#pdf-answers', 'data-act')) === 'pdf-answers', wt + ' 1: #pdf is the primary button, both keep their hooks');
      ok(!/Download \(PDF\)/.test(await p.textContent('#app')), wt + ' 1: "Download (PDF)" appears nowhere on the result');
      // one at a time
      let n = 0; p.on('download', () => { n++; });
      const dlP = p.waitForEvent('download');
      await p.click('#pdf');
      const mid = await p.evaluate(() => ({ a: document.getElementById('pdf').disabled, b: document.getElementById('pdf-answers').disabled, s: document.getElementById('save-file').disabled, ta: document.getElementById('pdf').textContent, tb: document.getElementById('pdf-answers').textContent, busyA: document.getElementById('pdf').getAttribute('aria-busy'), busyB: document.getElementById('pdf-answers').getAttribute('aria-busy'), dl: window.Readiness2.state().download, kind: window.Readiness2.state().dlKind }));
      ok(mid.a && mid.b && mid.s && mid.dl !== 'idle' && mid.kind === 'pdf' && mid.ta === 'Preparing the PDF…' && mid.tb === 'Download answers (PDF)' && mid.busyA === 'true' && mid.busyB === null, wt + ' 3: while the result PDF is made both buttons and Save as file are disabled; only the pressed one says so ' + JSON.stringify(mid));
      await p.evaluate(() => { document.getElementById('pdf-answers').click(); document.getElementById('pdf-answers').disabled = false; document.getElementById('pdf-answers').click(); });
      const dl1 = await dlP; await p.waitForFunction(() => window.Readiness2.state().download === 'idle'); await p.waitForTimeout(400);
      ok(n === 1 && /^Do-you-need-AI_Hotel-Alpenblick_\d{4}-\d{2}-\d{2}_result\.pdf$/.test(dl1.suggestedFilename()), wt + ' 3: a click on the other button meanwhile made no second download (' + n + '); ' + dl1.suggestedFilename());
      ok(await p.evaluate(() => !document.getElementById('pdf').disabled && !document.getElementById('pdf-answers').disabled && document.getElementById('pdf').textContent === 'Download result (PDF)' && document.getElementById('pdf-answers').textContent === 'Download answers (PDF)'), wt + ' 3: both buttons are back');
      // the other way round
      const [dl2] = await Promise.all([p.waitForEvent('download'), p.click('#pdf-answers')]);
      const mid2 = await p.evaluate(() => ({ a: document.getElementById('pdf').disabled, ta: document.getElementById('pdf').textContent, tb: document.getElementById('pdf-answers').textContent, kind: window.Readiness2.state().dlKind }));
      await p.waitForFunction(() => window.Readiness2.state().download === 'idle');
      ok(/_answers\.pdf$/.test(dl2.suggestedFilename()) && dl2.suggestedFilename() === dl1.suggestedFilename().replace('_result.pdf', '_answers.pdf') && mid2.kind === 'answers', wt + ' 2: the Answers PDF has its own name ' + dl2.suggestedFilename());
      const f1 = path.join(OUT, wt + '-result.pdf'), f2 = path.join(OUT, wt + '-answers.pdf'); await dl1.saveAs(f1); await dl2.saveAs(f2);
      // the files
      const t1 = norm(txt(f1)), t2 = norm(txt(f2));
      ok(!/\bSources?\b|https?:|www\.|Where this comes from/.test(t1 + ' ' + t2), wt + ' 5: neither PDF has "Source", a link or "Where this comes from"');
      const pos = ['Result', 'Start with this one', 'Action plan by person', 'Questions for the vendor', 'EU AI Act: provisional label'].map(h => t1.indexOf(h));
      ok(pos.every(x => x >= 0) && pos.every((x, i) => i === 0 || x > pos[i - 1]) && !/What is in place, by area|Where it sits|Every question and your answer|How this was worked out|Can this problem be solved with AI\?/.test(t1), wt + ' 5: the Result PDF has the five sections in order and nothing else');
      ok(/Not legal advice/.test(t1) && /student prototype, not legal advice/.test(t1) && /Score: \d+%/.test(t1), wt + ' 5: the not-legal-advice lines and the score are in the Result PDF');
      const nq = (await p.evaluate(() => window.Readiness2.pdfModel('answers').blocks.filter(b => b.k === 'item').length));
      ok(nq === 5 + 10 + (await st(p)).tailored.length && /Every question and your answer/.test(t2) && /Step 2: Can this problem be solved with AI\?/.test(t2) && /Step 3: Must-haves/.test(t2) && /Planned \(planned by 15 Jan 2027\)/.test(t2) && /Step 5: /.test(t2) && /Yes/.test(t2) && !/Where it sits|Action plan by person|Questions for the vendor/.test(t2), wt + ' 5: the Answers PDF lists all ' + nq + ' questions with their answers, no result sections');
      await p.waitForTimeout(100);
      ok(!p._errs.length, wt + ' standalone: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ---------- "None of these fits": no step 5 ----------
    {
      const { ctx, p } = await mk(b, w, touch);
      await p.goto(BASE + 'readiness-2/standalone/index.html'); await p.waitForFunction(() => window.Readiness2);
      await toResult(p, 'none'); ok((await st(p)).step === 'result' && (await st(p)).use === 'none', wt + ' none: on the result');
      ok(await p.evaluate(() => window.Readiness2.pdfModel('answers').blocks.filter(b => b.k === 'item').length) === 15, wt + ' none: 15 answers (5 + 10), no step 5');
      const [d1] = await Promise.all([p.waitForEvent('download'), p.click('#pdf-answers')]); ok(/_answers\.pdf$/.test(d1.suggestedFilename()), wt + ' none: Answers PDF downloads');
      await ctx.close();
    }
    // ---------- the stop screen keeps its one button ----------
    {
      const { ctx, p } = await mk(b, w, touch);
      await p.goto(BASE + 'readiness-2/standalone/index.html'); await p.waitForFunction(() => window.Readiness2);
      await p.evaluate(() => { const R = window.Readiness2; R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('next'); R.send('answer', { id: 'q1', value: 'y' }); R.send('next'); });
      ok((await st(p)).step === 'stop' && (await p.$$eval('#stopcard .btnrow > *', e => e.map(x => x.textContent))).join('|') === 'Change my answers|Start again|Download (PDF)' && !(await p.$('#pdf-answers')), wt + ' stop: one "Download (PDF)", no answers button');
      const [d] = await Promise.all([p.waitForEvent('download'), p.click('#pdf')]); const f = path.join(OUT, wt + '-stop.pdf'); await d.saveAs(f);
      ok(/_result\.pdf$/.test(d.suggestedFilename()) && !/\bSources?\b|https?:/.test(txt(f)) && /not suitable for AI/i.test(txt(f)), wt + ' stop: the one-page PDF, no sources');
      await ctx.close();
    }
    // ---------- in the hub (no downloads capability locally: the plain-link fallback) ----------
    {
      const { ctx, p } = await mk(b, w, touch);
      await p.goto(BASE + 'index.html'); await p.click('#hubBar button[data-tool="readiness-2"]');
      const h = await p.waitForSelector('#hubFrame iframe[title="readiness-2"]'); const f = await h.contentFrame();
      await f.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 15000 });
      await toResult(f, 'gx-2');
      const [a] = await Promise.all([p.waitForEvent('download'), f.click('#pdf')]); await f.waitForFunction(() => window.Readiness2.state().download === 'idle');
      const [c] = await Promise.all([p.waitForEvent('download'), f.click('#pdf-answers')]); await f.waitForFunction(() => window.Readiness2.state().download === 'idle');
      ok(/_result\.pdf$/.test(a.suggestedFilename()) && /_answers\.pdf$/.test(c.suggestedFilename()), wt + ' hub: both buttons download with the right names: ' + a.suggestedFilename() + ' / ' + c.suggestedFilename());
      ok(!p._errs.length, wt + ' hub: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ---------- through the bridge (a fake hub that grants downloads) ----------
    {
      const { ctx, p } = await mk(b, w, touch);
      await ctx.route(BASE + 'readiness-2/wrap.html', r => r.fulfill({ status: 200, contentType: 'text/html', body: WRAP.replace('src="index.html"', 'src="index.html"') }));
      await p.goto(BASE + 'readiness-2/wrap.html'); const fr = await (await p.waitForSelector('#fr')).contentFrame();
      await fr.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true && window.Readiness2.state().bridge === 'yes', null, { timeout: 15000 });
      await toResult(fr, 'gx-2');
      await fr.click('#pdf');
      await fr.waitForFunction(() => window.Readiness2.state().download === 'saving' || window.Readiness2.state().download === 'idle');
      const during = await fr.evaluate(() => ({ s: window.Readiness2.state().download, a: document.getElementById('pdf').disabled, b: document.getElementById('pdf-answers').disabled }));
      await fr.evaluate(() => { document.getElementById('pdf-answers').disabled = false; document.getElementById('pdf-answers').click(); }); // forced while saving: refused
      await fr.waitForFunction(() => window.Readiness2.state().download === 'idle');
      ok(during.s !== 'saving' || (during.a && during.b), wt + ' bridge: while the hub saves, both buttons are disabled');
      ok((await p.evaluate(() => window.__dl.length)) === 1, wt + ' bridge: the forced click on the other button sent nothing');
      await fr.click('#pdf-answers'); await fr.waitForFunction(() => window.Readiness2.state().download === 'idle');
      const sent = await p.evaluate(() => window.__dl);
      ok(sent.length === 2 && /_result\.pdf$/.test(sent[0].name) && /_answers\.pdf$/.test(sent[1].name) && sent.every(x => x.size > 8000 && x.type === 'application/pdf'), wt + ' bridge: two download messages, right names, real PDFs: ' + JSON.stringify(sent.map(x => x.name + ' ' + x.size)));
      ok(!p._errs.length, wt + ' bridge: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
  }
  await b.close();
  console.log('v27: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
})();
