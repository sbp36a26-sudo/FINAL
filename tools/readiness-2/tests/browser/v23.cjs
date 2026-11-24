// Browser proof for "Do you need AI?" v2.3 / v2.4 (owner decisions of 24 Nov 2026), desktop 1280 + phone 390, standalone and in the hub:
// 1. steps 3 and 5 offer only Yes / Planned, not done yet / No / Don't know yet;
// 2. the result: the verdict box holds verdict, score and must-haves line; the top row only "Download (PDF)";
// 3. the detail layer (native <dialog>) replaces the links to the catalogue tab: mouse and keyboard, Esc, focus return,
//    no navigation away, survives render(), not printed. v2.6: proved standalone; inside the hub the hub draws it (v26.cjs).
// Old Partly / Doesn't apply records are proved in tests/browser/v21.cjs (the v2.0 fixture store and file).
// Serve tools/ first:  python3 -m http.server 8815 --bind 127.0.0.1   (R2_BASE sets another address)
// Screenshots (deviceScaleFactor 2): reports/readiness-2-screens/four-answers/ (R2_SHOTS for another folder).
// Run from tools/ so playwright resolves:  node readiness-2/tests/browser/v23.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8815/';
const OUT = process.env.R2_SHOTS || path.join(__dirname, '..', '..', '..', '..', 'reports', 'readiness-2-screens', 'four-answers');
fs.mkdirSync(OUT, { recursive: true });
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8').match(/<script type="application\/json" id="r2-data">([\s\S]*?)<\/script>/)[1]);
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const FOUR = 'Yes|Planned, not done yet|No|Don’t know yet';

async function mk(b, w, touch) {
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch, deviceScaleFactor: 2 });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  return { ctx, p };
}
async function hubFrame(p) {
  await p.goto(BASE + 'index.html'); await p.click('#hubBar button[data-tool="readiness-2"]');
  await p.waitForSelector('#hubFrame iframe[title="readiness-2"]'); const f = await (await p.$('#hubFrame iframe[title="readiness-2"]')).contentFrame();
  await f.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 15000 }); return f;
}
const st = f => f.evaluate(() => window.Readiness2.state());
const active = f => f.evaluate(() => document.activeElement && document.activeElement.id);
const hubTool = p => p.evaluate(() => { const h = document.querySelector('#hubBar'); return h ? h.getAttribute('data-tool') : null; });
async function shot(p, f, name) {
  if (f !== p) return; // screenshots from the standalone page only
  await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
}
async function toMust(f) {
  await f.evaluate(() => { const R = window.Readiness2; R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('hotel', { k: 'name', v: 'Hotel Fixture' }); R.send('next');
    ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(id => R.send('answer', { id, value: id === 'q1' ? 'n' : 'y' })); R.send('next'); }); // v2.6: Q1 No goes on
}

(async () => {
  const b = await chromium.launch({ args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessRespectPreflightResults'] });
  for (const [w, touch, wt] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    for (const where of ['standalone', 'hub']) {
      const tag = wt + ' ' + where, { ctx, p } = await mk(b, w, touch);
      let f = p; if (where === 'hub') f = await hubFrame(p); else { await p.goto(BASE + 'readiness-2/index.html'); await p.waitForFunction(() => window.Readiness2); }
      // ---------- step 3: four answers ----------
      await toMust(f);
      ok((await st(f)).step === 'must', tag + ': step 3');
      const m3 = await f.$$eval('#view fieldset.qa .opts', e => e.map(x => [...x.querySelectorAll('label')].map(l => l.textContent).join('|')));
      ok(m3.length === 10 && m3.every(t => t === FOUR), tag + ': all ten must-haves offer exactly the four answers, in order');
      ok(!/Partly|Doesn’t apply/.test(await f.textContent('#view')) && !(await f.$('.oldans')), tag + ': no Partly, no "Doesn\'t apply", no old-answer line on a new check');
      await f.evaluate(() => { const R = window.Readiness2; ['m1', 'm2', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10'].forEach(id => R.send('answer', { id, value: 'y' })); R.send('answer', { id: 'm3', value: 'pl' }); });
      ok(await f.isVisible('#by-m3'), tag + ': Planned keeps its "By when?" date');
      await shot(p, f, wt + '-step3-must-haves');
      await f.evaluate(() => window.Readiness2.send('next'));
      // ---------- step 4: the detail layer ----------
      await f.evaluate(() => { window.Readiness2.send('cat', 'Guest-facing'); window.Readiness2.send('dept', 'gx'); window.Readiness2.send('use', 'gx-1'); });
      ok(!(await f.$('[data-act="catalogue"]')) && !(await f.$('a[href*="use-case-catalogue"]')), tag + ': no link to the catalogue on step 4');
      const url0 = p.url(), tool0 = await hubTool(p);
      /* v2.6: inside the hub the layer is drawn by the hub on its main page (tests/browser/v26.cjs); the in-frame layer is proved standalone. */
      if (where === 'standalone') {
      // mouse: the row's "Details and sources"
      await f.click('#dt-gx-2'); await f.waitForSelector('#detail[open]');
      const y0 = await f.evaluate(() => scrollY); // the page behind, as it stood when the layer opened
      let s = await st(f);
      ok(s.detail === 'gx-2' && s.use === 'gx-1' && (await f.getAttribute('#detail', 'data-use')) === 'gx-2', tag + ': "Details and sources" opens the layer for gx-2; the row is not chosen');
      ok(p.url() === url0 && (await hubTool(p)) === tool0 && p.context().pages().length === 1, tag + ': no navigation away (same URL, same hub tab, no new tab)');
      ok((await active(f)) === 'detail-close', tag + ': focus moves to Close');
      const dt = DATA.detail['gx-2'], plain = DATA.tq.uses['gx-2'].plain, cu = DATA.cat.depts.find(d => d.id === 'gx').uses[1];
      ok((await f.textContent('#detail-title')) === plain && /^Catalogue name: /.test(await f.textContent('#detail-catname')) && /Guest/.test(await f.textContent('#detail .kicker')), tag + ': plain name, catalogue name, department and area');
      const body = await f.textContent('#detail');
      ok(body.includes('What it does: ' + DATA.ex['gx-2'].does) && body.includes('How the AI works: ' + DATA.ex['gx-2'].how) && body.includes('The catalogue’s own description (research wording): ' + cu.task) && !/AI technique/.test(body) && /How common in hotels: (High|Medium|Low) \(Use-Case Catalogue rating\)\./.test(body), tag + ': what it does, how it works, the catalogue description (research wording), how common; no AI technique notes (v2.5, BUILD NOW 8)');
      ok((await f.$$('#detail-srcs li')).length === dt.srcs.length && dt.srcs.length > 0 && (await f.$$eval('#detail-srcs a', e => e.every(a => a.target === '_blank' && /^https?:/.test(a.href) && a.rel.includes('noopener')))), tag + ': the catalogue\'s ' + dt.srcs.length + ' sources, links open in a new browser tab');
      ok((await f.$$eval('#detail-srcs li[data-src="h"] .tag', e => e.map(x => x.textContent))).every(t => t === 'Hotel'), tag + ': hotel sources keep the catalogue\'s "Hotel" label');
      const box = await f.evaluate(() => { const r = document.querySelector('#detail').getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width, h: r.height, vw: innerWidth, vh: innerHeight }; });
      ok(wt === 'phone' ? box.w >= box.vw - 1 && box.l <= 1 && box.h >= box.vh - 2 : Math.abs(box.r - box.vw) <= 1 && box.w <= 561 && box.h >= box.vh - 2, tag + ': ' + (wt === 'phone' ? 'full-screen sheet' : 'right-side drawer') + ' ' + JSON.stringify(box));
      ok(await f.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), tag + ': no horizontal scroll with the layer open');
      if (where === 'standalone') await (await p.$('#detail')).screenshot({ path: `${OUT}/${wt}-detail-layer.png` }).then(() => p.screenshot({ path: `${OUT}/${wt}-detail-layer-page.png` }));
      // a render while open keeps it open
      await f.evaluate(() => window.Readiness2.send('use', 'gx-3'));
      ok((await st(f)).detail === 'gx-2' && !!(await f.$('#detail[open]')) && (await st(f)).use === 'gx-3', tag + ': render() behind the layer keeps it open');
      // Esc closes, focus back to the button that opened it, scroll kept
      await p.keyboard.press('Escape'); await f.waitForFunction(() => !document.querySelector('#detail[open]'));
      ok((await st(f)).detail === null && (await active(f)) === 'dt-gx-2' && (await f.evaluate(() => scrollY)) === y0, tag + ': Esc closes; focus back on "Details and sources"; scroll kept ' + JSON.stringify([(await st(f)).detail, await active(f), await f.evaluate(() => scrollY), y0]));
      // keyboard open (Enter), mouse Close
      await f.focus('#dt-gx-4'); await p.keyboard.press('Enter'); await f.waitForSelector('#detail[open]');
      ok((await st(f)).detail === 'gx-4' && (await st(f)).use === 'gx-3', tag + ': Enter opens it, the row is not chosen');
      ok((await f.textContent('#detail-title')) === DATA.tq.uses['gx-4'].plain, tag + ': the layer shows the use case it was opened for');
      await f.click('#detail-close'); await f.waitForFunction(() => !document.querySelector('#detail[open]'));
      ok((await active(f)) === 'dt-gx-4', tag + ': Close returns focus');
      // keyboard Close (Enter on Close)
      await p.waitForTimeout(150); await f.focus('#dt-gx-2'); await f.waitForFunction(() => document.activeElement && document.activeElement.id === 'dt-gx-2'); await p.keyboard.press('Space'); await f.waitForSelector('#detail[open]'); /* v2.6: waits out the dialog's own focus return */ await f.waitForFunction(() => document.activeElement && document.activeElement.id === 'detail-close'); await p.waitForTimeout(100); await p.keyboard.press('Enter');
      await f.waitForFunction(() => !document.querySelector('#detail[open]')); ok((await active(f)) === 'dt-gx-2', tag + ': Space opens, Enter on Close closes, focus back');
      // owner 24 Nov 2026: no "What does this do?" button on the row; "Details and sources" is the only way in on step 4
      /* Audit v3 section 4: #ex- is also the must-haves' example prefix, so check the words and the one button per row. */
      ok(!(await f.$('text=What does this do?')) && (await f.$$eval('#where .ucs:not(.nonefits) .uc', e => e.length > 0 && e.every(x => x.querySelectorAll('button').length === 1))), tag + ': no "What does this do?" button; one button per use-case row');
      await f.click('#dt-gx-2'); await f.waitForSelector('#detail[open]');
      ok((await st(f)).detail === 'gx-2', tag + ': "Details and sources" opens the layer again');
      // not printed
      await p.emulateMedia({ media: 'print' }); ok(await f.evaluate(() => getComputedStyle(document.querySelector('#detail')).display === 'none'), tag + ': the layer is not printed'); await p.emulateMedia({ media: 'screen' });
      await p.keyboard.press('Escape'); await f.waitForFunction(() => !document.querySelector('#detail[open]'));
      // a draft use case says so
      await f.evaluate(() => { window.Readiness2.send('cat', 'Guest-facing'); window.Readiness2.send('dept', 'fo'); });
      await f.click('#dt-fo-8'); await f.waitForSelector('#detail[open]'); ok(/Draft questions/i.test(await f.textContent('#detail-draft')), tag + ': a draft use case carries the draft note');
      await p.keyboard.press('Escape'); await f.waitForFunction(() => !document.querySelector('#detail[open]'));
      await f.click('#dt-fo-1'); await f.waitForSelector('#detail[open]'); ok(!(await f.$('#detail-draft')), tag + ': a workbook use case has none');
      await p.keyboard.press('Escape'); await f.waitForFunction(() => !document.querySelector('#detail[open]'));
      }
      // ---------- step 5: four answers ----------
      await f.evaluate(() => { const R = window.Readiness2; R.send('cat', 'Guest-facing'); R.send('dept', 'gx'); R.send('use', 'gx-2'); R.send('next'); });
      ok((await st(f)).step === 'tailored', tag + ': step 5');
      const t5 = await f.$$eval('#view fieldset.qa .opts', e => e.map(x => [...x.querySelectorAll('label')].map(l => l.textContent).join('|')));
      ok(t5.length === DATA.tq.uses['gx-2'].qs.length && t5.every(t => t === FOUR) && !/Partly|Doesn’t apply/.test(await f.textContent('#view')), tag + ': every tailored question offers exactly the four answers (' + t5.length + ')');
      await shot(p, f, wt + '-step5-tailored');
      // ---------- the result (an "Almost ready" case) ----------
      await f.evaluate(() => { const R = window.Readiness2; R.state().tailored.forEach(id => R.send('answer', { id, value: 'y' })); R.send('next'); });
      s = await st(f); ok(s.step === 'result' && s.level === 'almost', tag + ': result, Almost ready (' + s.level + ')');
      const boxIds = await f.evaluate(() => [...document.querySelectorAll('#result > *')].map(e => e.id || (e.querySelector('[id]') || {}).id));
      ok(boxIds.join() === 'level-name,score,must-line' && (await f.textContent('#level-name')) === 'Almost ready' && /^Score: \d+%$/.test(await f.textContent('#score')) && /^9 of 10 must-haves in place · 1 planned$/.test(await f.textContent('#must-line')), tag + ': the box: verdict, score, must-haves line only (' + await f.textContent('#must-line') + ')');
      ok((await f.$$eval('#actions > *', e => e.map(x => x.id))).join() === 'pdf,new-check' && !(await f.$('#copy, #print')), tag + ': the top row holds Download (PDF) and Start a new check');
      ok(/^Because /.test(await f.textContent('#first #reason')) && !!(await f.$('#mychecks #save-file')) && !!(await f.$('#legal #to-register')), tag + ': reason in "Start with", Save as file in "Your checks", AI Register in the AI Act fold');
      ok(await f.evaluate(() => !!document.querySelector('#actions #new-check') && document.querySelectorAll('[data-act="new"]').length === 1) && !(await f.$('#new-top')), tag + ': Start a new check next to Download (PDF), and only there (owner 24 Nov 2026)');
      ok(!(await f.$('[data-act="catalogue"]')), tag + ': no link to the catalogue on the result');
      await shot(p, f, wt + '-result-almost-ready');
      if (where === 'standalone') {
      await f.click('#dr-gx-2'); await f.waitForSelector('#detail[open]');
      ok((await st(f)).detail === 'gx-2' && p.url() === url0 && (await hubTool(p)) === tool0, tag + ': "More detail" in "Where it sits" opens the layer, nothing navigates');
      await p.keyboard.press('Escape'); await f.waitForFunction(() => !document.querySelector('#detail[open]')); ok((await active(f)) === 'dr-gx-2', tag + ': focus back on the result\'s "More detail"');
      }
      ok(p._errs.length === 0, tag + ': no page errors ' + p._errs.join(' | '));
      await ctx.close();
    }
  }
  await b.close();
  console.log('v2.3/v2.4 browser checks: ' + pass + ' passed, ' + fail + ' failed');
  if (fail) process.exit(1);
})();
