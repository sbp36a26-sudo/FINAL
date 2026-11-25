// Browser proof for "Do you need AI?" v2.6 (owner decisions of 24 Nov 2026), desktop 1280 and phone 390:
// A. question 1 turned round: Yes is the stop screen; a store saved by v2.5.1 (tests/fixtures/v2.5-saved.json) opens with
//    question 1 turned round once (a reload does not turn it again), questions 3 and 4 to answer again, the line that says so;
// B. the new questions 3 and 4 on step 2 and on the result's five-answer card; the PDF's page 2;
// C. source links: standalone, the page's own layer with the source name as the link; inside the hub, the layer drawn by the
//    hub on its main page over exactly the frame's area, the source name opens its url (a popup locally), Esc / Close / the
//    dimmed area close it and give focus back to the button in the tab, another hub tab closes it, malformed messages and
//    messages not from a hub frame are ignored; the frames load as '<page>?v=<hash>' and #use= still works.
// Screenshots (deviceScaleFactor 2) to reports/readiness-2-screens/v26/ (R2_SHOTS for another folder). PDF page 2 is rendered
// with pdftoppm (poppler) at 150 dpi.
// Serve tools/ first:  python3 -m http.server 8815 --bind 127.0.0.1   (R2_BASE sets another address)
// Run from tools/ so playwright resolves:  node readiness-2/tests/browser/v26.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8815/';
const OUT = process.env.R2_SHOTS || path.join(__dirname, '..', '..', '..', '..', 'reports', 'readiness-2-screens', 'v26');
fs.mkdirSync(OUT, { recursive: true });
const FX = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'v2.5-saved.json'), 'utf8'));
const KEY = 'hftp-readiness2-v1';
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };

async function mk(b, w, touch, init) {
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch, deviceScaleFactor: 2, acceptDownloads: true });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  // External pages are never loaded: the popup still fires, which is what is tested.
  await ctx.route(u => !/^http:\/\/127\.0\.0\.1/.test(String(u)), r => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>external</title>' }));
  if (init) await ctx.addInitScript(init.fn, init.arg);
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  return { ctx, p };
}
const st = f => f.evaluate(() => window.Readiness2.state());
const txt = (f, sel) => f.$(sel).then(e => e ? e.textContent() : null);
const active = f => f.evaluate(() => document.activeElement && document.activeElement.id);
async function toQ(f) { await f.evaluate(() => { const R = window.Readiness2; R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('hotel', { k: 'name', v: 'Hotel Fixture' }); R.send('next'); }); }
async function fill(f, o) {
  await f.evaluate(o => {
    const R = window.Readiness2;
    R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('hotel', { k: 'name', v: 'Hotel Fixture' }); R.send('next');
    const Q = Object.assign({ q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }, o.Q || {}); Object.keys(Q).forEach(id => R.send('answer', { id, value: Q[id] })); R.send('next');
    for (let i = 1; i <= 10; i++) R.send('answer', { id: 'm' + i, value: o.A || 'y' });
    R.send('next'); R.send('cat', 'Guest-facing'); R.send('dept', 'gx'); R.send('use', o.use || 'gx-2');
    if (o.where) return;
    R.send('next'); R.state().tailored.forEach(id => R.send('answer', { id, value: 'y' })); R.send('next');
  }, o);
  await f.waitForTimeout(80);
}
async function hubOpen(p) {
  await p.goto(BASE + 'index.html'); await p.click('#hubBar button[data-tool="readiness-2"]');
  const h = await p.waitForSelector('#hubFrame iframe[title="readiness-2"]'); const f = await h.contentFrame();
  await f.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 15000 });
  return { h, f };
}

(async () => {
  const b = await chromium.launch({ args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessRespectPreflightResults'] });
  for (const [w, touch, wt] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    // ---------- A + B: step 2, the stop screen ----------
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(BASE + 'readiness-2/index.html'); await p.waitForFunction(() => window.Readiness2);
      await toQ(p);
      const qs = await p.$$eval('.qa .qtext', e => e.map(x => x.textContent));
      ok(qs[0] === 'Can each case be fixed with an “if this, then that” rule?' && qs[2] === 'Are there past examples of this task, such as emails, bookings, or past photos, that show what a good result looks like?' && qs[3] === 'Is it acceptable if the result is right most of the time, but not every time?', wt + ': step 2 shows the owner\'s questions 1, 3 and 4');
      ok(/Complex judgement · Return · Information to learn from · Some mistakes are acceptable · Proof/.test((await txt(p, '.crisp-key')).replace(/\s+/g, ' ')), wt + ': the C-R-I-S-P key');
      ok(/a No to question 1 and a Yes to the others point towards AI/.test(await txt(p, '.stephead .sub')), wt + ': the step says which answers point towards AI');
      await p.click('details[data-fold="why-q1"] > summary'); await p.click('details[data-fold="why-q3"] > summary'); await p.click('details[data-fold="why-q4"] > summary');
      ok((await txt(p, '#yes-q1')).includes('You could write it down as fixed rules') && (await txt(p, '#no-q1')).includes('Every case is different'), wt + ': Q1 Yes-if / No-if in the new meaning');
      ok((await txt(p, '#whyshort-q3')) === 'AI learns from examples; without many past cases it has nothing to learn from.' && (await txt(p, '#whyshort-q4')).startsWith('AI is never right every time;'), wt + ': Q3 and Q4 "Why this matters"');
      await p.click('details[data-fold="src-q"] > summary').catch(() => {});
      ok(/Brynjolfsson, E\. & Mitchell, T\. \(2017\)/.test(await txt(p, '#view')), wt + ': the source with the other questions\' sources');
      await p.evaluate(() => { const R = window.Readiness2; ['q2', 'q3', 'q4', 'q5'].forEach(id => R.send('answer', { id, value: 'y' })); R.send('answer', { id: 'q1', value: 'n' }); });
      ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), wt + ': step 2: no sideways scroll');
      await p.screenshot({ path: path.join(OUT, wt + '-step2.png'), fullPage: true });
      await p.click('label[for="a-q1-y"]');
      ok(/Question 1 is Yes\./.test(await txt(p, '#verdict')) && (await txt(p, '#next')) === 'See the result', wt + ': Q1 Yes shows the stop at once');
      await p.click('#next'); const s = await st(p);
      ok(s.step === 'stop' && (await txt(p, '#stop-head')) === 'This is not suitable for AI.' && /Because you answered Yes to: “Can each case be fixed/.test(await txt(p, '#stopcard')), wt + ': Q1 Yes → the stop screen, naming the Yes');
      await p.screenshot({ path: path.join(OUT, wt + '-stop-q1-yes.png'), fullPage: true });
      await p.click('#change'); await p.click('label[for="a-q1-n"]'); await p.click('#next');
      ok((await st(p)).step === 'must', wt + ': Q1 No → the must-haves');
      ok(!p._errs.length, wt + ' step 2: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ---------- B: the result's five-answer card, the PDF's page 2 ----------
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(BASE + 'readiness-2/index.html'); await p.waitForFunction(() => window.Readiness2);
      await fill(p, { Q: { q3: 'n', q4: 'u' } });
      const s = await st(p);
      ok(s.step === 'result' && s.level === 'almost' && (await txt(p, '#box-reason')) === 'Held back: a No in step 2; Not sure in step 2.', wt + ': Q3 No and Q4 Not sure hold the top verdict (' + (await txt(p, '#box-reason')) + ')');
      const rows = await p.$$eval('#ai-rows li', l => l.map(x => ({ q: x.getAttribute('data-q'), chip: x.querySelector('.chip').className, t: x.textContent.replace(/\s+/g, ' ').trim() })));
      ok(rows.length === 5 && /a-yes/.test(rows[0].chip) && /^Complex judgement ?No ?Met: every case is different/.test(rows[0].t), wt + ': card: Q1 No reads as met, in the good colour');
      ok(/^Information to learn from ?No ?Too few examples to learn from\./.test(rows[2].t) && /a-no/.test(rows[2].chip), wt + ': card: Q3 No gives its consequence');
      ok(/^Some mistakes are acceptable ?Not sure ?To find out: yes if a wrong answer now and then/.test(rows[3].t) && /Ask the department head\./.test(rows[3].t), wt + ': card: Q4 Not sure says what to find out');
      ok((await txt(p, '#ai-head')) === 'Too few examples to learn from.', wt + ': card: the verdict word');
      const card = await p.$('#sum-ai'); await card.scrollIntoViewIfNeeded(); await card.screenshot({ path: path.join(OUT, wt + '-result-five-answers.png') });
      if (!touch) {
        const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#pdf')]);
        const pdf = path.join(OUT, 'result.pdf'); await dl.saveAs(pdf);
        try {
          execFileSync('pdftoppm', ['-f', '2', '-l', '2', '-r', '150', '-png', '-singlefile', pdf, path.join(OUT, 'pdf-page-2')]);
          ok(fs.existsSync(path.join(OUT, 'pdf-page-2.png')), 'PDF page 2 rendered');
          const t = execFileSync('pdftotext', ['-f', '2', '-l', '2', '-layout', pdf, '-']).toString().replace(/\s+/g, ' ');
          ok(/Information to learn from/.test(t) && /Some mistakes are acceptable/.test(t) && /Too few examples to learn from/.test(t) && /Can each case be fixed/.test(t), 'PDF page 2: the five answers with the new questions');
        } catch (e) { ok(false, 'PDF page 2: ' + e.message); }
        fs.unlinkSync(pdf);
      }
      ok(!p._errs.length, wt + ' result: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ---------- A: a store saved by v2.5.1 ----------
    {
      const init = { fn: a => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('hftp-readiness2-v1', a.store); sessionStorage.setItem('hftp-readiness2-cur', a.cur); sessionStorage.setItem('seeded', '1'); } }, arg: { store: JSON.stringify(FX.store), cur: 'fixgo0001' } };
      const { ctx, p } = await mk(b, w, touch, init); await p.goto(BASE + 'readiness-2/index.html'); await p.waitForFunction(() => window.Readiness2);
      let s = await st(p);
      ok(s.id === 'fixgo0001' && s.step === 'q' && s.Q.q1 === 'n' && !s.Q.q3 && !s.Q.q4 && s.Q.q2 === 'y', wt + ' v2.5.1 store: Q1 Yes → No, old Q3/Q4 gone, on step 2 (' + JSON.stringify(s.Q) + ')');
      ok(await p.isVisible('#q-changed') && await p.isVisible('#qnew-q3') && await p.isVisible('#qnew-q4') && !(await p.$('#qnew-q1')), wt + ' v2.5.1 store: step 2 says what changed; questions 3 and 4 marked');
      if (!touch) await p.screenshot({ path: path.join(OUT, 'desktop-step2-after-migration.png'), fullPage: true });
      await p.click('label[for="a-q3-y"]'); await p.reload(); await p.waitForFunction(() => window.Readiness2); s = await st(p);
      ok(s.Q.q1 === 'n' && s.Q.q3 === 'y' && !(await p.isVisible('#qnew-q3')) && await p.isVisible('#qnew-q4'), wt + ' v2.5.1 store: after a save and reload Q1 is not turned again; only question 4 is still marked');
      ok((await p.evaluate(k => JSON.parse(localStorage.getItem(k)).v, KEY)) === 3, wt + ' v2.5.1 store: saved as version 3');
      await p.evaluate(() => window.Readiness2.send('back')); await p.evaluate(() => window.Readiness2.send('back'));
      const lines = await p.$$eval('#mychecks .mycheck', l => l.map(x => x.getAttribute('data-check') + ': ' + x.textContent.replace(/\s+/g, ' ')));
      ok(lines.some(l => /^fixstop01: .*Not suitable for AI/.test(l)), wt + ' v2.5.1 store: the old stop check is still "Not suitable for AI"');
      ok(!p._errs.length, wt + ' migration: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ---------- C: standalone layer ----------
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(BASE + 'readiness-2/index.html'); await p.waitForFunction(() => window.Readiness2);
      const msgs = []; await p.exposeFunction('__msg', m => msgs.push(m));
      await fill(p, { where: true });
      await p.click('#dt-gx-2'); await p.waitForSelector('#detail[open] #detail-srcs');
      const rows = await p.$$eval('#detail-srcs li', l => l.map(x => { const a = x.querySelector('a'); return { a: !!a, name: a ? a.textContent : '', url: a ? a.href : '', addr: (x.querySelector('.srcurl') || {}).textContent || '', copy: !!x.querySelector('.copysrc') }; }));
      ok(rows.length > 0 && rows.every(r => !r.a || (r.url === r.addr && r.copy && r.name && !/Open the source/.test(r.name))) && !(await p.$('text=Open the source')), wt + ' standalone: each source name is the link; the address and Copy address under it; no "Open the source"');
      const sel = '#detail-srcs li a', href = await p.$eval(sel, a => a.href);
      const [pop] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), p.click(sel)]);
      ok(pop && pop.url() === href, wt + ' standalone: a click on the name opens the source (' + (pop && pop.url()) + ')');
      if (pop) await pop.close().catch(() => {});
      await (await p.$('#detail')).screenshot({ path: path.join(OUT, wt + '-detail-sources-standalone.png') });
      await p.keyboard.press('Escape'); await p.waitForFunction(() => !document.querySelector('#detail[open]'));
      ok((await active(p)) === 'dt-gx-2', wt + ' standalone: Esc returns focus');
      ok(!p._errs.length, wt + ' standalone layer: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ---------- C: the hub draws the layer on its main page ----------
    {
      const { ctx, p } = await mk(b, w, touch);
      const { h, f } = await hubOpen(p);
      const src = await h.getAttribute('src'), ver = await p.evaluate(() => window.HFTPHub.state().ver);
      ok(/^readiness-2\/index\.html\?v=[0-9a-f]{10}$/.test(src) && src.endsWith(ver['readiness-2']), wt + ' hub: the frame loads with ?v=<content hash> (' + src + ')');
      await fill(f, { where: true });
      await f.click('#dt-gx-2'); await p.waitForSelector('#hub-detail[open] #hub-detail-srcs');
      ok(!(await f.evaluate(() => document.querySelector('#detail').open)) && (await f.getAttribute('#app', 'data-layer-host')) === 'hub' && (await st(f)).detail === 'gx-2', wt + ' hub: the frame keeps the state, the hub draws the layer');
      const geo = await p.evaluate(() => { const d = document.getElementById('hub-detail').getBoundingClientRect(), fr = document.getElementById('hubFrame').getBoundingClientRect(), pn = document.querySelector('#hub-detail .hd-panel').getBoundingClientRect(); return { d: [d.top, d.left, d.width, d.height].map(Math.round), f: [fr.top, fr.left, fr.width, fr.height].map(Math.round), pn: [pn.left, pn.right, pn.width, pn.height].map(Math.round), vw: innerWidth }; });
      ok(JSON.stringify(geo.d) === JSON.stringify(geo.f), wt + ' hub: the layer covers exactly the frame\'s area ' + JSON.stringify(geo));
      ok(touch ? geo.pn[2] >= geo.vw - 1 : (geo.pn[1] === geo.vw && geo.pn[2] <= 561), wt + ' hub: ' + (touch ? 'a full sheet' : 'a drawer on the right') + ' ' + JSON.stringify(geo.pn));
      ok((await p.evaluate(() => document.activeElement && document.activeElement.id)) === 'hub-detail-close', wt + ' hub: focus on Close');
      const fx = await f.evaluate(() => { const D = JSON.parse(document.getElementById('r2-data').textContent); return { plain: D.tq.uses['gx-2'].plain, n: D.detail['gx-2'].srcs.length }; });
      ok((await txt(p, '#hub-detail-title')) === fx.plain && (await p.$$('#hub-detail-srcs li')).length === fx.n, wt + ' hub: the same content (title, ' + fx.n + ' sources)');
      ok(await p.$$eval('#hub-detail-srcs li', l => l.every(x => !x.querySelector('a') || (x.querySelector('a').target === '_blank' && /noopener/.test(x.querySelector('a').rel) && x.querySelector('.srcurl').textContent === x.querySelector('a').href && x.querySelector('.copysrc')))), wt + ' hub: each source name is a real link, with its address and Copy address');
      const sel = '#hub-detail-srcs li a', href = await p.$eval(sel, a => a.href);
      const [pop] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), p.click(sel)]);
      ok(pop && pop.url() === href, wt + ' hub: one click on the source name opens it (' + (pop && pop.url()) + ')');
      if (pop) await pop.close().catch(() => {});
      await p.screenshot({ path: path.join(OUT, wt + '-detail-sources-hub.png') });
      // Esc: closed, focus back in the tab on the opener
      await p.keyboard.press('Escape'); await p.waitForFunction(() => !document.querySelector('#hub-detail[open]'));
      await f.waitForFunction(() => window.Readiness2.state().detail === null);
      ok((await p.evaluate(() => document.activeElement && document.activeElement.tagName)) === 'IFRAME' && (await active(f)) === 'dt-gx-2' && !(await f.getAttribute('#app', 'data-layer')), wt + ' hub: Esc closes; focus back on "Details and sources" in the tab');
      // Close button
      await f.click('#dt-gx-4'); await p.waitForSelector('#hub-detail[open]'); await p.click('#hub-detail-close'); await p.waitForFunction(() => !document.querySelector('#hub-detail[open]'));
      await f.waitForFunction(() => window.Readiness2.state().detail === null); ok((await active(f)) === 'dt-gx-4', wt + ' hub: Close returns focus to the opener');
      // the dimmed area
      await f.click('#dt-gx-2'); await p.waitForSelector('#hub-detail[open]');
      if (!touch) { await p.mouse.click(40, 400); await p.waitForFunction(() => !document.querySelector('#hub-detail[open]')); await f.waitForFunction(() => window.Readiness2.state().detail === null); ok(true, 'hub: a click on the dimmed area closes'); }
      else { await p.keyboard.press('Escape'); await p.waitForFunction(() => !document.querySelector('#hub-detail[open]')); }
      // another hub tab closes it
      await f.click('#dt-gx-2'); await p.waitForSelector('#hub-detail[open]');
      await p.evaluate(() => window.HFTPHub.send({ type: 'select', tool: 'register' })); await p.waitForTimeout(200);
      ok(!(await p.$('#hub-detail[open]')) && (await p.evaluate(() => window.HFTPHub.state().detail)) === null && (await st(f)).detail === null, wt + ' hub: switching tab closes the layer and the tool forgets it');
      await p.click('#hubBar button[data-tool="readiness-2"]'); await p.waitForTimeout(150);
      ok(!(await p.$('#hub-detail[open]')), wt + ' hub: back on the tab the layer stays closed');
      // malformed messages from the frame, and messages not from a hub frame, are ignored
      await f.evaluate(() => { const bad = [{ hub: 'detail', id: 'gx-2', data: { title: 'x' } }, { hub: 'detail', id: '../x', data: {} }, { hub: 'detail', id: 'gx-2', data: null },
        { hub: 'detail', id: 'gx-2', data: { title: 'T', kicker: '', catName: '', draft: '', draftText: '', does: '', how: '', level: '', task: '', foot: '', srcs: [{ type: 'c', name: 'n', note: '', url: 'javascript:alert(1)' }] } },
        { hub: 'detail', id: 'gx-2', data: { title: 'T'.repeat(201), kicker: '', catName: '', draft: '', draftText: '', does: '', how: '', level: '', task: '', foot: '', srcs: [] } }];
        bad.forEach(m => window.parent.postMessage(m, location.origin)); });
      await p.waitForTimeout(300);
      ok(!(await p.$('#hub-detail[open]')), wt + ' hub: malformed detail messages open nothing');
      await p.evaluate(() => window.postMessage({ hub: 'detail', id: 'gx-2', data: { title: 'T', kicker: '', catName: '', draft: '', draftText: '', does: '', how: '', level: '', task: '', foot: '', srcs: [] } }, location.origin)); await p.waitForTimeout(200);
      ok(!(await p.$('#hub-detail[open]')), wt + ' hub: a detail message not from a hub frame is ignored');
      ok(!(await p.$('#hub-link')), wt + ' hub: no link panel');
      ok(!p._errs.length, wt + ' hub: no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ---------- C: #use= still works with the versioned frame address (the register's "check readiness" link path) ----------
    {
      const { ctx, p } = await mk(b, w, touch); const { h, f } = await hubOpen(p);
      await f.evaluate(() => window.parent.postMessage({ hub: 'open', tool: 'readiness-check', hash: 'use=hr-2' }, location.origin));
      await p.waitForTimeout(600); const f2 = await h.contentFrame(); await f2.waitForFunction(() => window.Readiness2);
      const s = await st(f2), src = await f2.evaluate(() => location.search + location.hash);
      ok(s.use === 'hr-2' && /^\?v=[0-9a-f]{10}$/.test(src), wt + ' hub: { hub: "open", hash: "use=hr-2" } on the versioned address preselects hr-2; the page then drops the hash and keeps ?v= (' + src + ')');
      await ctx.close();
    }
  }
  await b.close();
  console.log('v2.6 browser: ' + pass + ' passed, ' + fail + ' failed');
  if (fail) process.exit(1);
})();
