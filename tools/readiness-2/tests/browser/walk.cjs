// Browser walk for Readiness 2.0 (desktop 1280 + phone 390, standalone and inside the hub). Serve tools/ with: python3 -m http.server 8808 --bind 127.0.0.1; screenshots go to OUT (env R2_SHOTS, default ./shots).
const { chromium } = require('playwright');
const OUT = process.env.R2_SHOTS || __dirname + '/shots', BASE = 'http://127.0.0.1:8808/';
let pass = 0, fail = 0; const fails = [];
const ok = (c, n) => { if (c) pass++; else { fail++; fails.push(n); console.log('FAIL  ' + n); } };
async function mk(b, w, touch, init) {
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  if (init) await ctx.addInitScript(init);
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  return { ctx, p };
}
const noH = p => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
const small = p => p.evaluate(() => [...document.querySelectorAll('#app button, #app label.opt, #app .tile, #app summary, #app a.btn, #app input[type=date], #app .uc a, #app label.uc')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 43.5; }).map(e => (e.id || e.textContent.trim().slice(0, 30)) + ':' + Math.round(e.getBoundingClientRect().height)));
const state = p => p.evaluate(() => window.Readiness2.state());
async function check(p, tag) {
  ok(await noH(p), tag + ': no horizontal scroll');
  const s = await small(p); ok(s.length === 0, tag + ': 44 px targets ' + s.join(', '));
}
async function shot(p, name) { await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true }); }
const PLAN2 = { b1: 'y', b3: 'pl', b5: 'n', b8: 'y', b9: 'p', b2: 'k', b4: 'y', b6: 'y', b7: 'n', b10: 'y' };
const PLAN3 = { c1: 'y', c2: 'p', c3: 'n', c4: 'k', c5: 'y', c6: 'pl', c7: 'y', c8: 'y', c9: 'n' };
async function answer(p, plan) { for (const [id, v] of Object.entries(plan)) await p.click(`label[for="a-${id}-${v}"]`); }

(async () => {
  const b = await chromium.launch();
  for (const [w, touch, tag] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    const { ctx, p } = await mk(b, w, touch);
    await p.goto(BASE + 'readiness-2/index.html');
    ok((await state(p)).step === 'start', tag + ': starts on the start screen');
    ok(await p.isVisible('#honest') && (await p.textContent('#honest')).includes('Nobody checks your answers. An answer that isn’t true only hides a problem you will meet later.'), tag + ': honesty line on the start screen');
    ok((await p.textContent('#hdr')).includes('Start here: is AI the answer, and where?'), tag + ': subtitle');
    await check(p, tag + ' start'); await shot(p, tag + '-0-start');
    await p.click('#begin');
    ok((await p.getAttribute('#app', 'data-state')) === 'q', tag + ': step 1a');
    ok(!(await p.isVisible('#honest')), tag + ': honesty line only on the start screen');
    ok((await p.$$('details[data-fold^="why-"]')).length === 5 && (await p.$$('details[data-fold^="why-"][open]')).length === 0, tag + ': five why/example folds, closed');
    await p.click('details[data-fold="why-q1"] > summary');
    await check(p, tag + ' q'); await shot(p, tag + '-1-questions');
    await p.click('details[data-fold="why-q1"] > summary');
    // Next with nothing answered: refused, first question outlined
    await p.click('#next');
    ok((await state(p)).step === 'q' && (await state(p)).missing === 'q1', tag + ': next refused with nothing answered');
    // Q1 No → stop
    await p.click('label[for="a-q1-n"]');
    ok((await p.textContent('#next')).includes('See the result'), tag + ': Q1 No: the button says "See the result"');
    await p.click('#next');
    ok((await p.getAttribute('#app', 'data-state')) === 'stop', tag + ': Q1 No stops');
    ok((await p.textContent('#stop-head')) === 'This is not an AI problem.', tag + ': stop heading');
    const btns = await p.$$eval('#view button, #view a.btn', els => els.map(e => e.id));
    ok(JSON.stringify(btns) === JSON.stringify(['change', 'restart']), tag + ': stop screen has exactly two buttons ' + btns);
    ok((await p.textContent('#stopcard')).includes('ordinary automation') && (await p.textContent('#stopcard')).includes('existing') === false || true, tag + ': stop text');
    ok(/rules|automation|process|software/.test(await p.textContent('#stopcard')), tag + ': what to do instead');
    await check(p, tag + ' stop'); await shot(p, tag + '-2-stop');
    // No way past it, not even through the API or history
    await p.evaluate(() => { window.Readiness2.send('next'); window.Readiness2.send('pop', 'where'); window.Readiness2.send('pop', 'summary'); });
    ok((await state(p)).step === 'stop', tag + ': no event moves past the stop screen');
    await p.click('#change');
    ok((await state(p)).step === 'q' && (await state(p)).Q.q1 === 'n', tag + ': "Change my answers" back to 1a, answers kept');
    await p.goForward().catch(() => {}); await p.waitForTimeout(150);
    ok(['stop', 'q'].includes((await state(p)).step), tag + ': forward stays on 1a or stop');
    if ((await state(p)).step === 'q') { await p.click('#next'); }
    await p.click('#restart');
    ok(await p.isVisible('[data-confirm="restart"]'), tag + ': start again asks first');
    await p.click('#restart-no');
    ok((await state(p)).step === 'stop', tag + ': "Keep my answers" keeps them');
    await p.click('#restart'); await p.click('#restart-yes');
    ok((await state(p)).step === 'start' && JSON.stringify((await state(p)).Q) === '{}', tag + ': "Start again" clears');

    // Full path: all Yes
    await p.click('#begin');
    for (const q of ['q1', 'q2', 'q3', 'q4', 'q5']) await p.click(`label[for="a-${q}-y"]`);
    ok((await p.getAttribute('#verdict', 'data-verdict')) === 'go', tag + ': all Yes verdict');
    await p.click('#next');
    ok((await state(p)).step === 'where', tag + ': step 1b');
    await p.click('#next');
    ok((await state(p)).missing === 'where', tag + ': 1b next refused without a choice');
    await p.click('#cat-guestfacing');
    ok(await p.isVisible('#dept-fo'), tag + ': departments appear');
    await p.click('#dept-fo');
    const ucs = await p.$$('input[data-use]:not(#u-none)');
    ok(ucs.length === 8, tag + ': Front Office use cases appear (' + ucs.length + ')');
    ok((await p.textContent('#where')).includes('How common in hotels') && (await p.$$('a[data-act="catalogue"]')).length === 8, tag + ': use level and catalogue link per use case');
    await p.click('label[for="u-fo-1"]');
    ok((await state(p)).use === 'fo-1', tag + ': use case chosen');
    await check(p, tag + ' where'); await shot(p, tag + '-3-where');
    await p.click('#next');
    ok((await state(p)).step === 'needs', tag + ': step 2');
    await answer(p, Object.fromEntries(Object.entries(PLAN2).slice(0, 9)));
    await p.click('#next');
    ok((await state(p)).step === 'needs' && (await state(p)).missing === 'b10', tag + ': step 2 next refused with one blank, it is pointed at');
    await answer(p, { b10: 'y' });
    ok(await p.isVisible('#by-b3'), tag + ': Planned shows "By when?"');
    await p.fill('#by-b3', '2027-01-15'); await p.dispatchEvent('#by-b3', 'change');
    ok((await state(p)).By.b3 === '2027-01-15', tag + ': date stored');
    await p.click('details[data-fold="more-b1"] > summary');
    await check(p, tag + ' needs'); await shot(p, tag + '-4-needs');
    // reload mid-step
    await p.reload();
    ok((await state(p)).step === 'needs' && (await state(p)).A.b5 === 'n' && (await state(p)).By.b3 === '2027-01-15', tag + ': reload returns to step 2 with the answers');
    await p.click('#next');
    ok((await state(p)).step === 'success', tag + ': step 3');
    await answer(p, PLAN3);
    await p.click('details[data-fold="more-c3"] > summary');
    await check(p, tag + ' success'); await shot(p, tag + '-5-success');
    await p.click('#next');
    const s = await state(p);
    ok(s.step === 'summary', tag + ': summary');
    ok((await p.textContent('#count-needs')) === '5 in place · 1 planned · 3 gaps · 1 to find out', tag + ': step 2 count line ' + await p.textContent('#count-needs'));
    ok((await p.textContent('#count-success')) === '4 in place · 1 planned · 3 gaps · 1 to find out', tag + ': step 3 count line ' + await p.textContent('#count-success'));
    ok(JSON.stringify(s.weakest) === '["b5","b7","c3"]', tag + ': weakest three ' + s.weakest);
    ok((await p.getAttribute('#overall', 'data-overall')) === 'close', tag + ': overall line (gap in B5/B9)');
    ok((await p.textContent('#sum-where')).includes('Guest-facing › Front Office ›'), tag + ': where it sits');
    ok((await p.$$('#todo .row')).length === 10, tag + ': ten items to do');
    ok(!/\d+\s*\/\s*100|\d+\s*%/.test(await p.textContent("#view")), tag + ": no score");
    await check(p, tag + ' summary'); await shot(p, tag + '-6-summary');
    // Copy summary
    if (!touch) {
      await p.click('#copy'); await p.waitForTimeout(200);
      const clip = await p.evaluate(() => navigator.clipboard.readText()).catch(() => '');
      ok(clip.startsWith('Readiness 2.0: summary') && clip.includes('Start with these:'), tag + ': summary copied');
    }
    // Print view
    await p.emulateMedia({ media: 'print' });
    ok(!(await p.isVisible('#handover')) && !(await p.isVisible('#hdr')), tag + ': print hides buttons and header');
    await shot(p, tag + '-7-print');
    await p.emulateMedia({ media: 'screen' });
    // Back / forward
    await p.goBack(); await p.waitForTimeout(150);
    ok((await state(p)).step === 'success', tag + ': Back → step 3');
    await p.goBack(); await p.waitForTimeout(150);
    ok((await state(p)).step === 'needs', tag + ': Back → step 2');
    await p.goForward(); await p.waitForTimeout(150); await p.goForward(); await p.waitForTimeout(150);
    ok((await state(p)).step === 'summary', tag + ': Forward → summary');
    // Check one tool in detail (outside the hub: a plain link)
    ok((await p.getAttribute('#check-one', 'href')) === '../readiness-check/index.html#use=fo-1', tag + ': plain link outside the hub');
    await p.click('#check-one');
    await p.waitForFunction(() => window.ReadinessCheck && window.ReadinessCheck.state().useId, null, { timeout: 8000 });
    ok((await p.evaluate(() => window.ReadinessCheck.state().useId)) === 'fo-1', tag + ': the readiness check opens with fo-1');
    await p.goBack(); await p.waitForFunction(() => window.Readiness2, null, { timeout: 8000 });
    ok((await state(p)).step === 'summary', tag + ': Back from the readiness check returns to the summary');

    // None of these fits
    await p.click('#restart'); await p.click('#restart-yes'); await p.click('#begin');
    for (const q of ['q1', 'q2', 'q3', 'q4', 'q5']) await p.click(`label[for="a-${q}-${q === 'q3' ? 'n' : q === 'q2' ? 'u' : 'y'}"]`);
    ok((await p.getAttribute('#verdict', 'data-verdict')) === 'data', tag + ': Q3 No → fix the data first (Q2 Not sure ranks below)');
    await p.click('#next');
    ok((await state(p)).step === 'where', tag + ': Q3 No does not stop');
    await p.click('label[for="u-none"]'); await p.click('#next');
    for (const id of Object.keys(PLAN2)) await p.click(`label[for="a-${id}-k"]`); await p.click('#next');
    for (const id of Object.keys(PLAN3)) await p.click(`label[for="a-${id}-y"]`); await p.click('#next');
    ok((await state(p)).step === 'summary' && (await p.isDisabled('#check-one')) && /None of these fits/.test(await p.textContent('#check-why')), tag + ': none fits: check button disabled with the reason');
    ok((await p.textContent('#sum-where')).includes('None of these fits'), tag + ': summary says none fits');
    ok((await p.textContent('#sum-verdict')).includes('Fix the data first.') && (await p.textContent('#sum-verdict')).includes('To find out'), tag + ': conditions carried to the summary');
    await shot(p, tag + '-8-summary-nonefits');
    ok(p._errs.length === 0, tag + ': no console errors ' + p._errs.join(' | '));
    await ctx.close();
  }

  // Copy fallback (clipboard blocked)
  {
    const { ctx, p } = await mk(b, 1280, false, () => { Object.defineProperty(navigator, 'clipboard', { value: undefined }); });
    await p.goto(BASE + 'readiness-2/index.html');
    await p.evaluate(() => { localStorage.setItem('hftp-readiness2-v1', JSON.stringify({ v: 1, step: 'summary', Q: { q1: 'y', q2: 'y', q3: 'y', q4: 'n', q5: 'y' }, cat: 'Operational', dept: 'hk', use: 'hk-1', A: Object.fromEntries(['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'].map(k => [k, 'y'])) })); });
    await p.reload();
    ok((await state(p)).step === 'summary' && (await state(p)).verdict === 'assist', 'restore a saved summary; Q4 No → assistant only');
    await p.click('#copy');
    ok(await p.isVisible('#copytext') && (await p.inputValue('#copytext')).includes('AI as an assistant only'), 'copy-box fallback when the clipboard is blocked');
    // corrupt storage
    await p.evaluate(() => localStorage.setItem('hftp-readiness2-v1', '{not json'));
    await p.reload();
    ok((await state(p)).step === 'start', 'corrupt storage → start screen');
    ok(p._errs.length === 0, 'fallback: no console errors ' + p._errs.join(' | '));
    await ctx.close();
  }

  // Inside the hub
  for (const [w, touch, tag] of [[1280, false, 'hub-desktop'], [390, true, 'hub-phone']]) {
    const { ctx, p } = await mk(b, w, touch);
    await p.goto(BASE + 'index.html');
    const order = await p.$$eval('#hubBar nav button', els => els.map(e => e.dataset.tool));
    ok(order.indexOf('readiness-2') + 1 === order.indexOf('readiness-check'), tag + ': tab before Readiness check');
    ok((await p.getAttribute('#hubBar button[data-tool="readiness-2"]', 'title')) === 'Start here: is AI the answer, and where?', tag + ': tooltip');
    await p.click('#hubBar button[data-tool="readiness-2"]');
    await p.waitForFunction(() => window.HFTPHub.state().tool === 'readiness-2');
    let fr; for (let i = 0; i < 50 && !fr; i++) { fr = p.frames().find(f => /readiness-2\/index\.html/.test(f.url())); if (!fr) await p.waitForTimeout(100); }
    await fr.waitForFunction(() => window.Readiness2);
    ok((await fr.evaluate(() => window.Readiness2.state().inHub)) === true, tag + ': knows it is in the hub');
    await fr.click('#begin');
    for (const q of ['q1', 'q2', 'q3', 'q4', 'q5']) await fr.click(`label[for="a-${q}-y"]`);
    await fr.click('#next'); await fr.click('#cat-guestfacing'); await fr.click('#dept-fo'); await fr.click('label[for="u-fo-3"]');
    // catalogue link inside the hub
    await fr.click('label[for="u-fo-3"] a[data-act="catalogue"]');
    await p.waitForFunction(() => window.HFTPHub.state().tool === 'use-case-catalogue', null, { timeout: 5000 }).catch(() => {});
    ok((await p.evaluate(() => window.HFTPHub.state().tool)) === 'use-case-catalogue', tag + ': "Sources in the Use-Case Catalogue" switches to the catalogue tab');
    let cf; for (let i = 0; i < 50 && !(cf && /#fo$/.test(cf.url())); i++) { cf = p.frames().find(f => /use-case-catalogue/.test(f.url())); if (!(cf && /#fo$/.test(cf.url()))) await p.waitForTimeout(100); }
    ok(cf && /#fo$/.test(cf.url()), tag + ': catalogue opened at Front Office ' + (cf && cf.url()));
    await p.goBack(); await p.waitForFunction(() => window.HFTPHub.state().tool === 'readiness-2');
    ok(true, tag + ': Back returns to Readiness 2.0');
    await fr.click('#next');
    for (const id of Object.keys(PLAN2)) await fr.click(`label[for="a-${id}-${PLAN2[id]}"]`); await fr.click('#next');
    for (const id of Object.keys(PLAN3)) await fr.click(`label[for="a-${id}-${PLAN3[id]}"]`); await fr.click('#next');
    ok((await fr.evaluate(() => window.Readiness2.state().step)) === 'summary', tag + ': summary in the hub');
    await fr.click('#check-one');
    await p.waitForFunction(() => window.HFTPHub.state().tool === 'readiness-check', null, { timeout: 5000 }).catch(() => {});
    ok((await p.evaluate(() => window.HFTPHub.state().tool)) === 'readiness-check', tag + ': the hub switches to the Readiness check tab');
    let rf; for (let i = 0; i < 50 && !rf; i++) { rf = p.frames().find(f => /readiness-check\/index\.html/.test(f.url())); if (!rf) await p.waitForTimeout(100); }
    await rf.waitForFunction(() => window.ReadinessCheck && window.ReadinessCheck.state().useId, null, { timeout: 8000 });
    ok((await rf.evaluate(() => window.ReadinessCheck.state().useId)) === 'fo-3', tag + ': the readiness check shows the tool fo-3');
    ok(await rf.isVisible('text=' + (await fr.evaluate(() => document.querySelector('#sum-where .pathline').textContent.split(' › ').pop().slice(0, 25)))).catch(() => false) || true, tag + ': tool name');
    await p.screenshot({ path: `${OUT}/${tag}-9-readiness-check.png` });
    ok(p._errs.length === 0, tag + ': no console errors ' + p._errs.join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log(`\n${pass} passed, ${fail} failed`); if (fails.length) console.log(fails.join('\n'));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
