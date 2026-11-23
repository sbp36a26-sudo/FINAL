// AI starting point v1.2 browser proof (Playwright): owner decisions B1/B2, the council's BUILD NOW items and the eight clean-up
// fixes, standalone and inside the hub, at 1280 and 390 px. Serve tools/ with: python3 -m http.server 8811 --bind 127.0.0.1
// (R2_BASE sets another address; the not-hub frame test uses the same server under "localhost" as a second origin).
// Screenshots go to OUT (env R2_SHOTS, default ./shots-v12).
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8811/', OUT = process.env.R2_SHOTS || __dirname + '/shots-v12';
fs.mkdirSync(OUT, { recursive: true });
const FIX = JSON.parse(fs.readFileSync(process.env.R2_FIXTURE || __dirname + '/../fixtures/v1.1-saved.json', 'utf8')).records;
let pass = 0, fail = 0; const fails = [];
const ok = (c, n) => { if (c) pass++; else { fail++; fails.push(n); console.log('FAIL  ' + n); } };
const CODE = /\b(T[1-5]|D[1-5][ab]?|G[1-4]s?|F[1-5]|P[1-5]|O[1-6]|X[12]b?|XG)\b|new \(from T2\)|new question/;
const KEY = 'hftp-readiness2-v1';
const ALLA = v => Object.fromEntries(['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'].map(k => [k, v]));
const ALLQ = v => ({ q1: v, q2: v, q3: v, q4: v, q5: v });

async function mk(b, w, touch, init) {
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch, acceptDownloads: true });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  if (init) await ctx.addInitScript(init);
  const p = await ctx.newPage(); p._errs = []; p._ext = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  p.on('request', r => { const u = r.url(); if (!/^https?:\/\/(127\.0\.0\.1|localhost):8811\//.test(u) && !/^(blob|data|about):/.test(u) && !/fonts\.(googleapis|gstatic)/.test(u)) p._ext.push(u); });
  return { ctx, p };
}
const st = f => f.evaluate(() => window.Readiness2.state());
const text = f => f.evaluate(() => document.body.innerText);
const noH = f => f.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
async function seed(p, rec, raw) { await p.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, raw || JSON.stringify(rec)]); await p.reload(); await p.waitForFunction(() => window.Readiness2); }
async function toSummary(f, o) {
  await f.evaluate(o => {
    const R = window.Readiness2; if (R.state().step !== 'start') { R.send('restart'); R.send('restart-yes'); }
    R.send('begin'); Object.entries(o.Q).forEach(([id, value]) => R.send('answer', { id, value })); R.send('next');
    R.send('cat', o.cat); if (o.dept) R.send('dept', o.dept); R.send('use', o.use); R.send('next');
    Object.entries(o.A).filter(([k]) => k[0] === 'b').forEach(([id, value]) => R.send('answer', { id, value })); R.send('next');
    Object.entries(o.A).filter(([k]) => k[0] === 'c').forEach(([id, value]) => R.send('answer', { id, value })); R.send('next');
  }, o);
}
async function shot(p, name, full = true) { await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: full }); }

(async () => {
  const b = await chromium.launch({ args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessChecks'] }); // the second origin (localhost) is a test harness need only
  for (const [w, touch] of [[1280, false], [390, true]]) {
    const dev = w === 1280 ? 'desktop' : 'phone';
    // ================= standalone =================
    {
      const { ctx, p } = await mk(b, w, touch); const T = dev + ' standalone';
      await p.goto(BASE + 'readiness-2/index.html');
      // B1 name
      ok((await p.title()) === 'AI starting point', T + ': B1 page title');
      ok((await p.textContent('#hdr h1')) === 'AI starting point' && (await p.textContent('#hdr')).includes('Start here: is AI the answer, and where?'), T + ': B1 header and the kept subtitle');
      ok(!/Readiness 2\.0/.test(await text(p)), T + ': B1 no "Readiness 2.0" on the start screen');
      ok((await p.getAttribute('#app', 'data-storage')) === 'ok' && !(await p.$('#not-saved')) && (await text(p)).includes('Your answers stay in this browser'), T + ': M3 storage ok: no warning, the promise is kept');
      await shot(p, dev + '-0-start');
      // 1a with the Q1 hint
      await p.click('#begin');
      ok(await p.isVisible('#guard-q1') && (await p.textContent('#guard-q1')).startsWith('Judge the job, not how you handle it today.'), T + ': BUILD NOW 1 Q1 hint visible');
      ok(JSON.stringify(await p.$$eval('.steps3 span', s => s.map(x => x.className))) === '["now","",""]', T + ': L3 progress on 1a');
      await shot(p, dev + '-1-questions');
      // M1 (a) and (b): Next, in-app Back, browser Back
      for (const q of ['q1', 'q2', 'q3', 'q4', 'q5']) await p.click(`label[for="a-${q}-y"]`);
      const len0 = await p.evaluate(() => history.length);
      for (let k = 0; k < 3; k++) { await p.click('#next'); ok((await st(p)).step === 'where', T + ': next → 1b #' + k); ok(JSON.stringify(await p.$$eval('.steps3 span', s => s.map(x => x.className))) === '["now","",""]', T + ': L3 progress on 1b'); await p.click('#back'); await p.waitForTimeout(120); ok((await st(p)).step === 'q', T + ': in-app back → 1a #' + k); }
      ok((await p.evaluate(() => history.length)) === len0 + 1, T + ': M1 (b) three Next/Back cycles do not grow history (' + len0 + ' → ' + (await p.evaluate(() => history.length)) + ')');
      await p.goBack(); await p.waitForTimeout(150);
      ok((await st(p)).step === 'start', T + ': M1 (a) browser Back after in-app Back → start (never forward to 1b): ' + (await st(p)).step);
      await p.goForward(); await p.waitForTimeout(150);
      ok((await st(p)).step === 'q', T + ': forward → 1a');
      // stop screen
      await p.click('label[for="a-q1-n"]'); await p.click('#next');
      ok((await p.textContent('#stop-head')) === 'This is not suitable for AI.', T + ': B2 stop headline');
      const paras = await p.$$eval('#stopcard > p', ps => ps.map(x => x.textContent));
      ok(paras[0].startsWith('The job follows rules') && paras[1].startsWith('Instead:') && paras[2].startsWith('If a vendor offers you an AI tool for this job') && paras[2].includes('change your answer to Not sure'), T + ': B2 + BUILD NOW 2: headline, why, instead, then the "Not sure" line');
      ok(!/not an AI problem/i.test(await text(p)), T + ': B2 "not an AI problem" appears nowhere on the stop screen');
      ok((await p.textContent('#hdr')).includes('Not suitable for AI'), T + ': stop header line');
      ok(await noH(p), T + ': stop: no horizontal scroll');
      await shot(p, dev + '-2-stop');
      // stop PDF (model) carries the new headline and line
      const sm = await p.evaluate(() => window.Readiness2.pdfModel());
      ok(sm.stop && sm.blocks.some(x => x.t === 'This is not suitable for AI.') && sm.blocks.some(x => /change your answer to Not sure/.test(x.t || '')) && !/not an AI problem/i.test(JSON.stringify(sm)), T + ': B2 stop PDF');
      await p.click('#change');
      // where: None of these fits
      await p.click('label[for="a-q1-y"]'); await p.click('#next');
      await p.click('#cat-operational'); await p.click('label[for="u-none"]');
      await shot(p, dev + '-3b-where-nonefits');
      await p.click('#next');
      // needs: codes hidden, glosses, progress
      ok(JSON.stringify(await p.$$eval('.steps3 span', s => s.map(x => x.className))) === '["done","now",""]', T + ': L3 progress on step 2');
      await p.$$eval('details', ds => ds.forEach(d => { d.open = true; }));
      const tn = await text(p);
      ok(!CODE.test(tn), T + ': BUILD NOW 4 no question codes on step 2, folds open ' + (tn.match(CODE) || [''])[0]);
      ok(await p.isVisible('#gloss-b1') && (await p.textContent('#gloss-b1')).startsWith('PMS:') && await p.isVisible('#gloss-b5') && /DPIA/.test(await p.textContent('#gloss-b5')), T + ': BUILD NOW 7 PMS, DPA and DPIA glossed');
      ok(tn.indexOf('PMS') >= tn.indexOf('PMS:') - 400, T + ': the PMS gloss sits at its first use on the page');
      for (const id of ['b1', 'b3', 'b5', 'b8', 'b9', 'b2', 'b4', 'b6', 'b7', 'b10']) await p.click(`label[for="a-${id}-k"]`);
      await p.click('label[for="a-b1-pl"]');
      ok((await p.evaluate(() => window.Readiness2.send('by', { id: 'b1', date: '2026-02-31' }))) === false && !(await st(p)).By.b1, T + ': L1 an impossible date is refused');
      await p.click('#next');
      // success: weak evidence notes, works council gloss, codes hidden
      ok(JSON.stringify(await p.$$eval('.steps3 span', s => s.map(x => x.className))) === '["done","done","now"]', T + ': L3 progress on step 3');
      for (const id of ['c2', 'c4', 'c9']) ok(await p.isVisible('#weak-' + id) && /^Evidence here is thin/.test(await p.textContent('#weak-' + id)), T + ': BUILD NOW 5 evidence note visible on ' + id);
      ok((await p.$$('.weak')).length === 3, T + ': only three evidence notes');
      ok(await p.isVisible('#gloss-c9') && /works council/.test(await p.textContent('#gloss-c9')), T + ': BUILD NOW 7 works council glossed');
      await p.$$eval('details', ds => ds.forEach(d => { d.open = true; }));
      ok(!CODE.test(await text(p)), T + ': BUILD NOW 4 no codes on step 3');
      ok((await text(p)).includes('Prosci, a change-management consultancy'), T + ': Prosci labelled');
      await p.click('label[for="a-c4-y"]'); await p.$$eval('details', ds => ds.forEach(d => { d.open = false; }));
      await shot(p, dev + '-5-success-evidence');
      for (const id of ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9']) await p.click(`label[for="a-${id}-y"]`);
      await p.click('#next');
      // summary for none fits: working route
      ok((await st(p)).step === 'summary' && (await st(p)).handover === 'search', T + ': none fits summary');
      ok(JSON.stringify(await p.$$eval('.steps3 span', s => s.map(x => x.className))) === '["done","done","done"]', T + ': L3 progress on the summary');
      ok((await p.textContent('#check-one')) === 'Open the readiness check' && !(await p.isDisabled('#check-one')), T + ': BUILD NOW 3 working button');
      ok((await p.textContent('#carry-note')) === 'Your answers here are not carried over to the Readiness check yet.', T + ': BUILD NOW 6 hand-over line');
      ok(!CODE.test(await text(p)), T + ': no codes on the summary');
      const copy = await p.evaluate(() => window.Readiness2.summaryText());
      ok(copy.startsWith('AI starting point: summary') && copy.includes('not carried over') && !CODE.test(copy), T + ': copy text renamed, hand-over line, no codes');
      await shot(p, dev + '-6b-summary-nonefits');
      await p.click('#check-one');
      await p.waitForFunction(() => window.ReadinessCheck, null, { timeout: 8000 });
      ok(/readiness-check\/index\.html$/.test(p.url()) && !(await p.evaluate(() => window.ReadinessCheck.state().useId)), T + ': none fits opens the readiness check with no use case ' + p.url());
      await p.goBack(); await p.waitForFunction(() => window.Readiness2, null, { timeout: 8000 });
      ok((await st(p)).step === 'summary', T + ': Back returns to the summary');
      // a real use case: summary screenshot, hash change, reload
      await toSummary(p, { Q: { q1: 'y', q2: 'y', q3: 'n', q4: 'n', q5: 'u' }, cat: 'Guest-facing', dept: 'fo', use: 'fo-3',
        A: { b1: 'y', b3: 'pl', b5: 'n', b8: 'y', b9: 'p', b2: 'k', b4: 'y', b6: 'y', b7: 'n', b10: 'y', c1: 'y', c2: 'p', c3: 'n', c4: 'k', c5: 'y', c6: 'pl', c7: 'y', c8: 'y', c9: 'n' } });
      ok((await st(p)).step === 'summary' && (await st(p)).handover === 'use' && (await p.textContent('#check-one')) === 'Check one tool in detail' && (await p.isVisible('#carry-note')), T + ': summary with a use case, hand-over line');
      ok((await p.evaluate(() => window.Readiness2.record().useName)) === (await p.evaluate(() => document.querySelector('#sum-where .pathline').textContent.split(' › ').pop())), T + ': M2 the record carries the use case name');
      await shot(p, dev + '-6-summary');
      await p.evaluate(() => { location.hash = 'x'; }); await p.waitForTimeout(200);
      ok((await st(p)).step === 'summary', T + ': M1 (c) a hash change keeps the summary');
      await p.reload(); await p.waitForFunction(() => window.Readiness2);
      ok((await st(p)).step === 'summary', T + ': M1 (c) …and so does the reload');
      await p.goBack(); await p.waitForTimeout(200);
      ok((await st(p)).step === 'summary' || (await st(p)).step === 'success', T + ': Back after a hash change stays sensible: ' + (await st(p)).step);
      ok(await noH(p), T + ': summary: no horizontal scroll');
      ok(p._errs.length === 0, T + ': no console errors ' + p._errs.join(' | '));
      ok(p._ext.length === 0, T + ': no external requests ' + p._ext.join(' '));
      await ctx.close();
    }
    // ================= storage, versions, fixtures, catalogue moves =================
    if (w === 1280) {
      // M3 blocked storage
      const { ctx, p } = await mk(b, w, touch, () => { const thr = () => { const e = new Error('blocked'); e.name = 'SecurityError'; throw e; }; Storage.prototype.getItem = thr; Storage.prototype.setItem = thr; });
      await p.goto(BASE + 'readiness-2/index.html');
      ok((await p.getAttribute('#app', 'data-storage')) === 'blocked' && await p.isVisible('#not-saved'), 'M3 blocked: data-storage and the line on the start screen');
      ok((await p.textContent('#not-saved')) === 'This browser is not keeping your answers. Use Copy summary, Print or Download before you close the page.', 'M3 wording');
      ok(!(await text(p)).includes('Your answers stay in this browser'), 'M3 blocked: no promise to keep the answers (start screen and footer)');
      await p.click('#begin'); ok(await p.isVisible('#not-saved'), 'M3 blocked: the line on 1a');
      for (const q of ['q1', 'q2', 'q3', 'q4', 'q5']) await p.click(`label[for="a-${q}-y"]`); await p.click('#next'); ok(await p.isVisible('#not-saved'), 'M3 blocked: the line on 1b');
      await shot(p, 'desktop-m3-not-saved', false);
      ok(p._errs.length === 0, 'M3: no console errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    if (w === 1280) {
      const { ctx, p } = await mk(b, w, touch);
      await p.goto(BASE + 'readiness-2/index.html');
      // fixtures saved by v1.1 open
      for (const f of FIX) {
        await seed(p, null, f.raw);
        const s = await st(p);
        ok(s.step === f.state.step && s.verdict === f.state.verdict && s.use === f.state.use && !s.notice, 'fixture ' + f.name + ': opens on ' + f.state.step + ' with its answers');
        ok((await p.getAttribute('#app', 'data-storage')) === 'ok', 'fixture ' + f.name + ': storage ok');
      }
      // L1 impossible dates from storage are dropped
      await seed(p, { v: 1, step: 'needs', Q: ALLQ('y'), cat: 'Operational', use: 'none', A: { b1: 'pl', b3: 'pl' }, By: { b1: '2026-13-45', b3: '2027-02-28' } });
      ok(!('b1' in (await st(p)).By) && (await st(p)).By.b3 === '2027-02-28', 'L1 a stored impossible date is dropped, a real one kept');
      // M2 catalogue moved: name differs
      await seed(p, { v: 1, step: 'summary', Q: ALLQ('y'), cat: 'Guest-facing', dept: 'fo', use: 'fo-3', useName: 'A use case that moved', A: ALLA('y'), By: {} });
      let s = await st(p);
      ok(s.step === 'where' && s.use === '' && s.dept === 'fo' && s.notice === 'useChanged' && await p.isVisible('#use-changed'), 'M2 a moved use case reopens on 1b with the notice');
      ok((await p.textContent('#use-changed')) === 'The catalogue changed: please pick your use case again.', 'M2 notice wording');
      await shot(p, 'desktop-m2-use-changed', false);
      await p.click('label[for="u-fo-2"]');
      ok(!(await p.$('#use-changed')) && (await st(p)).use === 'fo-2', 'M2 picking again clears the notice');
      // L2 newer version: byte-identical after an answer
      const v2 = JSON.stringify({ v: 2, step: 'q', Q: { q1: 'u' }, notes: 'kept', future: [1, 2] });
      await seed(p, null, v2);
      ok((await st(p)).storage === 'newer' && await p.isVisible('#not-saved') && (await p.textContent('#not-saved')).startsWith('This was saved by a newer version'), 'L2 newer record: shown with the notice');
      await p.click('label[for="a-q2-y"]');
      ok((await p.evaluate(k => localStorage.getItem(k), KEY)) === v2, 'L2 the newer record is byte-identical after an answer');
      // L5 cross-tab follow keeps history in step
      await seed(p, { v: 1, step: 'needs', Q: ALLQ('y'), cat: 'Operational', use: 'none', A: {}, By: {} });
      const p2 = await ctx.newPage(); await p2.goto(BASE + 'readiness-2/index.html'); await p2.waitForFunction(() => window.Readiness2);
      await p2.evaluate(() => { window.Readiness2.send('restart'); window.Readiness2.send('restart-yes'); });
      await p.waitForFunction(() => window.Readiness2.state().step === 'start', null, { timeout: 3000 }).catch(() => {});
      ok((await st(p)).step === 'start' && (await p.evaluate(() => history.state && history.state.r2)) === 'start', 'L5 the other tab restarted: this tab shows start and its history entry says start');
      ok(p._errs.length === 0, 'storage: no console errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ================= L4: framed by a page that is not the hub (another origin) =================
    {
      const { ctx, p } = await mk(b, w, touch); const T = dev + ' foreign frame';
      const other = BASE.replace('127.0.0.1', 'localhost');
      await ctx.route(other + 'wrap.html', r => r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>wrap</title><iframe id="f" src="' + BASE + 'readiness-2/index.html" style="width:100%;height:95vh;border:0"></iframe>' }));
      await p.goto(other + 'wrap.html');
      let f; for (let i = 0; i < 50 && !(f && await f.evaluate(() => !!window.Readiness2).catch(() => false)); i++) { f = p.frames().find(x => x.url().includes('readiness-2/index.html')); await p.waitForTimeout(100); }
      ok((await st(f)).inFrame === true && (await st(f)).inHub === false, T + ': framed, not taken for the hub');
      await toSummary(f, { Q: ALLQ('y'), cat: 'Guest-facing', dept: 'fo', use: 'fo-3', A: ALLA('y') });
      ok((await f.getAttribute('a[data-act="check-one"]', 'href')) === '../readiness-check/index.html#use=fo-3', T + ': plain link');
      await f.click('#check-one');
      let rf; for (let i = 0; i < 80 && !rf; i++) { rf = p.frames().find(x => /readiness-check\/index\.html/.test(x.url())); if (!rf) await p.waitForTimeout(100); }
      ok(!!rf, T + ': L4 the click navigates at once (was a dead click)');
      if (rf) { await rf.waitForFunction(() => window.ReadinessCheck && window.ReadinessCheck.state().useId, null, { timeout: 8000 }).catch(() => {}); ok((await rf.evaluate(() => window.ReadinessCheck.state().useId).catch(() => '')) === 'fo-3', T + ': …to the readiness check with fo-3'); }
      ok(p._errs.length === 0, T + ': no console errors ' + p._errs.join(' | '));
      await ctx.close();
    }
    // ================= inside the hub =================
    {
      const { ctx, p } = await mk(b, w, touch); const T = dev + ' hub';
      await p.goto(BASE + 'index.html');
      ok((await p.textContent('#hubBar button[data-tool="readiness-2"]')).trim() === 'AI starting point' && (await p.getAttribute('#hubBar button[data-tool="readiness-2"]', 'title')) === 'Start here: is AI the answer, and where?', T + ': B1 tab label, tooltip kept');
      ok((await p.getAttribute('#hubBar button[data-tool="readiness-check"]', 'title')) === 'Check one AI tool in detail before you sign', T + ': BUILD NOW 9 Readiness check tooltip');
      const order = await p.$$eval('#hubBar nav button', els => els.map(e => e.dataset.tool));
      ok(order.indexOf('readiness-2') + 1 === order.indexOf('readiness-check'), T + ': B5 tab stays before the Readiness check');
      ok(!/Readiness 2\.0/.test(await p.textContent('#hubBar')), T + ': no "Readiness 2.0" in the bar');
      const len0 = await p.evaluate(() => history.length);
      await p.click('#hubBar button[data-tool="readiness-2"]');
      let fr; for (let i = 0; i < 50 && !fr; i++) { fr = p.frames().find(x => /readiness-2\/index\.html/.test(x.url())); if (!fr) await p.waitForTimeout(100); }
      await fr.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 5000 });
      ok(true, T + ': in the hub after the pong');
      // M1 (d): in-app Back twice, then browser Back leaves the tab
      await fr.click('#begin'); for (const q of ['q1', 'q2', 'q3', 'q4', 'q5']) await fr.click(`label[for="a-${q}-y"]`); await fr.click('#next');
      await fr.click('#back'); await p.waitForTimeout(150); await fr.click('#back'); await p.waitForTimeout(150);
      ok((await st(fr)).step === 'start', T + ': in-app Back twice → start');
      await p.goBack(); await p.waitForTimeout(300);
      ok((await p.evaluate(() => window.HFTPHub.state().tool)) === 'assessment' && (await st(fr)).step === 'start', T + ': M1 (d) browser Back from the start leaves the tab: ' + (await p.evaluate(() => window.HFTPHub.state().tool)));
      ok((await p.evaluate(() => history.length)) <= len0 + 3, T + ': history stays short (' + len0 + ' → ' + (await p.evaluate(() => history.length)) + ')');
      await p.goForward(); await p.waitForTimeout(300);
      // none fits → the readiness check's start screen through the hub, no hash
      await p.evaluate(() => window.HFTPHub.send({ type: 'select', tool: 'readiness-2' }));
      await toSummary(fr, { Q: ALLQ('y'), cat: 'Operational', use: 'none', A: ALLA('k') });
      ok((await st(fr)).handover === 'search', T + ': none fits in the hub');
      await p.screenshot({ path: `${OUT}/${dev}-hub-summary-nonefits.png` });
      await fr.click('#check-one');
      await p.waitForFunction(() => window.HFTPHub.state().tool === 'readiness-check', null, { timeout: 5000 }).catch(() => {});
      ok((await p.evaluate(() => window.HFTPHub.state().tool)) === 'readiness-check', T + ': BUILD NOW 3 "Open the readiness check" switches to the Readiness check tab');
      let rf; for (let i = 0; i < 50 && !rf; i++) { rf = p.frames().find(x => /readiness-check\/index\.html/.test(x.url())); if (!rf) await p.waitForTimeout(100); }
      await rf.waitForFunction(() => window.ReadinessCheck, null, { timeout: 8000 });
      ok(!/#use=/.test(rf.url()) && !(await rf.evaluate(() => window.ReadinessCheck.state().useId)), T + ': …on its start screen, no use case passed ' + rf.url());
      ok((await rf.evaluate(() => document.body.innerText)).length > 50, T + ': the readiness check shows its start screen');
      await p.screenshot({ path: `${OUT}/${dev}-hub-readiness-check-start.png` });
      // back to the summary; a use case hands over with #use=
      await p.goBack(); await p.waitForFunction(() => window.HFTPHub.state().tool === 'readiness-2', null, { timeout: 5000 }).catch(() => {});
      await toSummary(fr, { Q: ALLQ('y'), cat: 'Guest-facing', dept: 'fo', use: 'fo-3', A: ALLA('y') });
      await fr.click('#check-one');
      await p.waitForFunction(() => window.HFTPHub.state().tool === 'readiness-check', null, { timeout: 5000 }).catch(() => {});
      await rf.waitForFunction(() => window.ReadinessCheck && window.ReadinessCheck.state().useId === 'fo-3', null, { timeout: 8000 }).catch(() => {});
      ok((await rf.evaluate(() => window.ReadinessCheck.state().useId)) === 'fo-3', T + ': a use case still hands over with #use=fo-3');
      await p.goBack(); await p.waitForFunction(() => window.HFTPHub.state().tool === 'readiness-2', null, { timeout: 5000 }).catch(() => {});
      ok((await p.evaluate(() => window.HFTPHub.state().tool)) === 'readiness-2' && (await st(fr)).step === 'summary', T + ': M1 (d) one Back from the Readiness check returns to the summary');
      // hash change inside the hub frame
      await fr.evaluate(() => { location.hash = 'y'; }); await p.waitForTimeout(200);
      ok((await st(fr)).step === 'summary', T + ': M1 (c) a hash change in the frame keeps the summary');
      ok(p._errs.length === 0, T + ': no console errors ' + p._errs.join(' | '));
      ok(p._ext.length === 0, T + ': no external requests ' + p._ext.join(' '));
      await ctx.close();
    }
  }
  await b.close();
  console.log(`\nv1.2 browser: ${pass} passed, ${fail} failed`); if (fails.length) console.log(fails.join('\n'));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
