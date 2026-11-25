// Browser smoke test for "Do you need AI?" v3 (readiness-3), standalone page only (no hub).
// Loads index.html at 1280x800 and 360x740, fails on any page error or any request that leaves the page's own server,
// and walks one check from the cover to the result through the page's test API (window.Readiness3).
// Serve tools/ first:  python3 -m http.server 8861 --bind 127.0.0.1   (R3_BASE for another address)
// Run from tools/:  node readiness-3/tests/browser/smoke.cjs
const { chromium } = require('playwright');
const BASE = process.env.R3_BASE || 'http://127.0.0.1:8861/';
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };

(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1280, 800], [360, 740]]) {
    const tag = w + 'px';
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage(); const errs = [], outside = [];
    p.on('pageerror', e => errs.push(String(e)));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('request', r => { if (!r.url().startsWith(BASE) && !/^(data|blob|about):/.test(r.url())) outside.push(r.url()); });
    await p.goto(BASE + 'readiness-3/index.html');
    await p.waitForFunction(() => window.Readiness3 && window.Readiness3.state);
    ok(await p.title() === 'Do you need AI? v3.0', tag + ': title');
    const st = await p.evaluate(() => {
      const R = window.Readiness3;
      R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('hotel', { k: 'name', v: 'Hotel Smoke' }); R.send('next');
      ['q2', 'q3', 'q4', 'q5'].forEach(id => R.send('answer', { id, value: 'y' })); R.send('answer', { id: 'q1', value: 'n' }); R.send('next');
      for (let i = 1; i <= 10; i++) R.send('answer', { id: 'm' + i, value: 'y' });
      R.send('next'); R.send('cat', 'Commercial'); R.send('dept', 'rm'); R.send('use', 'rm-1'); R.send('next');
      R.state().tailored.forEach(id => R.send('answer', { id, value: 'y' })); R.send('next');
      return R.state();
    });
    ok(st.step === 'result', tag + ': the walk reaches the result (' + st.step + ')');
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), tag + ': no horizontal scroll');
    ok(errs.length === 0, tag + ': no page errors ' + errs.join(' | '));
    ok(outside.length === 0, tag + ': no request outside the page ' + outside.join(' '));
    await ctx.close();
  }
  await b.close();
  console.log('smoke: ' + pass + ' passed, ' + fail + ' failed'); if (fail) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
