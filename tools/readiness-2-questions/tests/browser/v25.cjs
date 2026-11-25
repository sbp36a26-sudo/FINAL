// Browser proof for "Do you need AI?" v2.5 (24 Nov 2026), desktop 1280 and phone 390:
// 1. the clean-up inventory v3 reproductions as tests (R1 to R6 of its repro.cjs / repro2.cjs, T1 and T2 of repro3.cjs):
//    the detail layer across Back, a #use= link and an inside click; the copy box by its button; a shared check replaced with
//    its file; two tabs; the Team tab's wording of old answers;
// 2. the council's BUILD NOW items on the running page: the nine answer patterns (headline, box line, "Start with"), the pilot
//    gloss, the assistant-only condition, "Copy for IT", the step 3 consistency lines, the detail layer without research notes,
//    sharing off (O7) with the withdraw path still working;
// 3. screenshots (deviceScaleFactor 2) to reports/readiness-2-screens/v25/ and a retake of reports/readiness-2-screens/wording/.
// Serve tools/ first:  python3 -m http.server 8831 --bind 127.0.0.1   (R2_BASE sets another address)
// Run from tools/ so playwright resolves:  node readiness-2/tests/browser/v25.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8831/';
const SCREENS = path.join(__dirname, '..', '..', '..', '..', 'reports', 'readiness-2-screens');
const OUT = process.env.R2_SHOTS || path.join(SCREENS, 'v25'), WORDING = process.env.R2_SHOTS ? path.join(OUT, 'wording') : path.join(SCREENS, 'wording');
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(WORDING, { recursive: true });
const FX = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'v2.4-saved.json'), 'utf8'));
/* v2.6: the v2.4 checks hold step 2 in the old meaning and would wait on step 2 (proved in tests/v25.test.mjs and v26.test.mjs).
   To prove the share paths (H1, R5) on the result, step 2 is given here as answered in the v2.6 meaning (qv 2); the store as v3. */
const asV26 = c => Object.assign(c, { qv: 2, Q: { q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: c.Q && c.Q.q5 ? c.Q.q5 : 'y' } });
Object.values(FX.store.checks).forEach(asV26); FX.store.v = 3; asV26(FX.file.check); FX.file.v = 3;
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const TEAM = 'hftp-readiness-checks-v1', KEY = 'hftp-readiness2-v1';

async function mk(b, w, touch, init, h) {
  const ctx = await b.newContext({ viewport: { width: w, height: h || (touch ? 844 : 900) }, hasTouch: touch, isMobile: touch, deviceScaleFactor: 2 });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  if (init) await ctx.addInitScript(init.fn, init.arg);
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  return { ctx, p };
}
const open = async p => { await p.goto(BASE + 'readiness-2/index.html'); await p.waitForFunction(() => window.Readiness2); };
const st = f => f.evaluate(() => window.Readiness2.state());
const txt = (f, s) => f.$eval(s, e => e.textContent.replace(/\s+/g, ' ').trim()).catch(() => null);
const active = f => f.evaluate(() => document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : null);
const noHScroll = f => f.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
/* o: { Q: {id: v}, A: v or {id: v}, use, T: v (every tailored) or {id: v} } → drives the page to its result (or to step 4 with where: true). */
async function fill(f, o) {
  await f.evaluate(o => {
    const R = window.Readiness2;
    R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('hotel', { k: 'name', v: 'Hotel Fixture' }); R.send('next');
    const Q = Object.assign({ q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }, o.Q || {}); /* v2.6: Q1 No goes on */ Object.keys(Q).forEach(id => R.send('answer', { id, value: Q[id] })); R.send('next');
    for (let i = 1; i <= 10; i++) { const id = 'm' + i; R.send('answer', { id, value: typeof o.A === 'string' ? o.A : (o.A && o.A[id]) || 'y' }); }
    if (o.stay === 'must') return;
    R.send('next');
    const use = o.use || 'gx-2', D = { 'gx-2': ['Guest-facing', 'gx'], 'hk-5': ['Operational', 'hk'], 'hr-2': ['Administrative', 'hr'] }[use] || ['Operational', 'hk'];
    R.send('cat', D[0]); R.send('dept', D[1]); R.send('use', use);
    if (o.where) return;
    R.send('next');
    if (use !== 'none') { R.state().tailored.forEach((id, i) => R.send('answer', { id, value: typeof o.T === 'string' ? o.T : (o.T && (o.T[id] || o.T[i])) || 'y' })); R.send('next'); }
  }, o);
  await f.waitForTimeout(80);
}
async function shot(p, name, dir, view) { await p.screenshot({ path: path.join(dir || OUT, name + '.png'), fullPage: !view }); } // view: the viewport only (the modal layer is fixed to it)

(async () => {
  const b = await chromium.launch({ args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessRespectPreflightResults'] });

  // ---------- R1: browser Back while the layer is open (minimum fix: the layer closes with the step change, focus on #view) ----------
  for (const [w, touch, tag] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    const { ctx, p } = await mk(b, w, touch); await open(p);
    await fill(p, { where: true });
    await p.click('#dt-gx-2'); await p.waitForSelector('#detail[open]');
    ok((await st(p)).detail === 'gx-2' && (await p.getAttribute('#app', 'data-layer')) === 'gx-2', tag + ' R1: layer open on step 4 (state().detail, #app[data-layer])');
    await p.goBack(); await p.waitForTimeout(300);
    const s = await st(p), isOpen = await p.evaluate(() => document.querySelector('#detail').open);
    ok(s.step === 'must' && !isOpen && s.detail === null && !(await p.getAttribute('#app', 'data-layer')), tag + ' R1: after Back the step is must and the layer is closed (open=' + isOpen + ', detail=' + s.detail + ')');
    ok((await active(p)) === 'view', tag + ' R1: focus on #view, not lost (' + (await active(p)) + ')');
    ok(!p._errs.length, tag + ' R1: no console errors ' + p._errs.join(' | '));
    await ctx.close();
  }
  // ---------- R2: a #use= link while the layer is open on the result ----------
  {
    const { ctx, p } = await mk(b, 1280, false); await open(p);
    await fill(p, {});
    await p.click('#dr-gx-2'); await p.waitForSelector('#detail[open]');
    const id0 = (await st(p)).id;
    await p.evaluate(() => location.replace(location.pathname + '#use=hr-2')); await p.waitForTimeout(300);
    const s = await st(p), isOpen = await p.evaluate(() => document.querySelector('#detail').open);
    ok(s.id !== id0 && s.use === 'hr-2' && s.step === 'start' && !isOpen && s.detail === null, 'R2: the link starts a new check and the layer is closed (open=' + isOpen + ', detail=' + s.detail + ')');
    ok((await active(p)) === 'view', 'R2: focus on the new check\'s cover (#view)');
    await ctx.close();
  }
  // ---------- R3: a click inside the drawer below short content keeps it open; the backdrop still closes it ----------
  for (const [w, h, tag] of [[1280, 900, '1280x900'], [1440, 1100, '1440x1100']]) {
    const { ctx, p } = await mk(b, w, false, null, h); await open(p);
    await fill(p, { use: 'hk-5', where: true });
    await p.click('#dt-hk-5'); await p.waitForSelector('#detail[open]');
    const g = await p.evaluate(() => { const d = document.querySelector('#detail'), r = d.getBoundingClientRect(), c = d.querySelector('.dbody').getBoundingClientRect(); return { left: r.left, right: r.right, bottom: r.bottom, cb: c.bottom }; });
    ok(g.cb < g.bottom - 20, tag + ' R3: hk-5 leaves empty room under its content (content ' + Math.round(g.cb) + ', drawer ' + Math.round(g.bottom) + ')');
    await p.mouse.click(Math.round((g.left + g.right) / 2), Math.round(g.bottom - 10)); await p.waitForTimeout(150);
    ok(await p.evaluate(() => document.querySelector('#detail').open), tag + ' R3: a click inside the drawer below the content keeps it open');
    await p.mouse.click(100, Math.round(h / 2)); await p.waitForTimeout(150);
    ok(!(await p.evaluate(() => document.querySelector('#detail').open)) && (await active(p)) === 'dt-hk-5', tag + ' R3: a click on the backdrop closes it and focus returns to #dt-hk-5');
    await ctx.close();
  }
  // ---------- R4: the copy box opens next to the button pressed; "Copy for IT" ----------
  {
    const init = { fn: () => { try { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('blocked')) } }); } catch (e) {} } };
    const { ctx, p } = await mk(b, 1280, false, init); await open(p);
    await fill(p, { T: ['n', 'k', 'n', 'n', 'k', 'n', 'k', 'n'] });
    ok((await txt(p, '#copy-it')) === 'Copy for IT', 'BUILD NOW 6: "Copy for IT" (got "' + (await txt(p, '#copy-it')) + '")');
    const labels = await p.$$eval('#plan [data-act="copy-who"]', e => e.map(x => x.textContent));
    ok(labels.every(l => !/Copy for (it|general manager|finance|head of)/.test(l)), 'BUILD NOW 6: no lower-cased role names: ' + labels.join(' | '));
    for (const sel of ['#copy-it', '#plan [data-act="copy-who"]']) {
      const btn = await p.$(sel); await btn.scrollIntoViewIfNeeded(); await p.waitForTimeout(50);
      const y0 = await p.evaluate(() => scrollY), by = await btn.evaluate(e => e.getBoundingClientRect().bottom + scrollY);
      await btn.click(); await p.waitForTimeout(200);
      const r = await p.evaluate(() => { const c = document.querySelector('#copybox'), ta = document.querySelector('#copytext'); return c ? { y: c.getBoundingClientRect().top + scrollY, scroll: scrollY, inActions: !!c.closest('#actions') || (c.previousElementSibling && c.previousElementSibling.id === 'actions'), sel: ta && ta.selectionEnd - ta.selectionStart === ta.value.length && ta.value.length > 0 } : null; });
      ok(r && r.y >= by - 5 && r.y - by <= 300 && Math.abs(r.scroll - y0) <= 900 && !r.inActions && r.sel, 'M5 ' + sel + ': box ' + (r && Math.round(r.y - by)) + ' px below the button, scroll moved ' + (r && Math.round(r.scroll - y0)) + ', text selected');
    }
    await p.click('details[data-fold="vendor"] > summary'); const vb = await p.$('#copy-vendor'); await vb.click(); await p.waitForTimeout(200); const vy = await p.$eval('#copy-vendor', e => e.getBoundingClientRect().bottom + scrollY); // after the click: the earlier box above it is gone
    const vr = await p.evaluate(() => { const c = document.querySelector('#copybox'); return c ? { y: c.getBoundingClientRect().top + scrollY, inVendor: !!c.closest('#vendor, details[data-fold="vendor"]') } : null; });
    ok(vr && vr.inVendor && vr.y - vy <= 300 && vr.y >= vy - 5, 'M5: the vendor copy box sits inside the vendor fold ' + JSON.stringify(vr) + ' button ' + Math.round(vy));
    ok((await st(p)).copyBox === true && /^vendor$/.test((await st(p)).copyFrom || ''), 'M5: state() names where the copy box is');
    await ctx.close();
  }
  // ---------- O7: sharing off; R5 (H1): a shared check replaced with its file can still be withdrawn ----------
  {
    const { ctx, p } = await mk(b, 1280, false); await open(p);
    await fill(p, {});
    let s = await st(p);
    ok(s.sharingOn === false && !(await p.$('details[data-fold="share"]')) && !(await p.$('#share-btn')), 'O7: sharing is off: no share fold, no share button on the result');
    await p.evaluate(() => window.Readiness2.send('share', { named: true })); ok(!(await st(p)).sharedAt, 'O7: nothing is sent');
    await ctx.close();
  }
  {
    const c1 = FX.seen.check1.id;
    const init = { fn: a => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('hftp-readiness2-v1', a.store); localStorage.setItem('hftp-readiness-checks-v1', a.team); sessionStorage.setItem('hftp-readiness2-cur', a.cur); sessionStorage.setItem('seeded', '1'); } }, arg: { store: JSON.stringify(FX.store), team: JSON.stringify(FX.team), cur: c1 } };
    const { ctx, p } = await mk(b, 1280, false, init); await open(p);
    let s = await st(p);
    ok(s.id === c1 && s.step === 'result' && s.sharedAt && s.rules === 'v2.6 (24 Nov 2026)', 'v2.4 store: the shared check opens on its result under rules v2.6 (step 2 given in the v2.6 meaning)');
    ok(/worked out with earlier rules/.test((await txt(p, '#since')) || ''), 'v2.4 store: the earlier result is marked "worked out with earlier rules"');
    ok(await p.isVisible('#unshare') && /switched off/.test((await txt(p, '#share')) || ''), 'O7: with sharing off the shared check still shows its withdraw button');
    await p.evaluate(t => window.Readiness2.openFileText(t), JSON.stringify(FX.file)); await p.waitForSelector('#import-yes');
    ok(/The project team’s copy of this check stays shared; you can still withdraw it\./.test((await txt(p, '[data-confirm="file"]')) || ''), 'H1: the replace question says the copy stays shared');
    await p.click('#import-yes'); await p.waitForTimeout(200);
    s = await st(p);
    ok(s.id === c1 && !!s.sharedAt, 'H1 (R5): after "Replace with the file" the check still knows its copy (sharedAt ' + s.sharedAt + ')');
    ok(await p.isVisible('#unshare'), 'H1 (R5): the withdraw button is still on the result');
    await p.evaluate(id => window.Readiness2.send('remove', id), c1); await p.waitForTimeout(100);
    ok(!!(await p.$('#rm-withdraw')), 'H1 (R5b): the remove dialog offers "Withdraw the shared copy and remove"');
    await p.click('#rm-withdraw'); await p.waitForFunction(id => !window.Readiness2.store().checks[id], c1, { timeout: 15000 });
    const left = await p.evaluate(k => Object.keys(JSON.parse(localStorage.getItem(k) || '{}')), TEAM);
    ok(!left.includes(c1), 'H1: withdrawing removed the test copy from ' + TEAM + ' (left: ' + left.join() + ')');
    ok(!p._errs.length, 'H1: no console errors ' + p._errs.join(' | '));
    await ctx.close();
  }
  // ---------- R6 (M4): two tabs; the other tab's share is kept when this tab keeps its own answers ----------
  {
    const { ctx, p: A } = await mk(b, 1280, false); await open(A);
    await fill(A, {}); const id = (await st(A)).id;
    const B = await ctx.newPage(); await B.addInitScript(i => { try { sessionStorage.setItem('hftp-readiness2-cur', i); } catch (e) {} }, id);
    await open(B); ok((await st(B)).id === id, 'R6: tab B opened the same check');
    await A.evaluate(() => { const R = window.Readiness2; R.send('edit'); R.send('answer', { id: 'q4', value: 'n' }); }); await A.waitForTimeout(150);
    /* Tab B's share, as it lands in the store: tab B saves its own version (the old answers) with the share fields. Sharing is off
       in this build, so the save a share makes is written directly from tab B's own store (window.Readiness2.store()). */
    await B.evaluate(([i, k, tk]) => { const s = window.Readiness2.store(); s.checks[i].sharedAt = '2026-11-24T12:00:00.000Z'; s.checks[i].sharedMode = 'local'; s.checks[i].sharedSig = 'b'; localStorage.setItem(k, JSON.stringify(s)); const t = JSON.parse(localStorage.getItem(tk) || '{}'); t[i] = { kind: 'dyn', v: 2 }; localStorage.setItem(tk, JSON.stringify(t)); }, [id, KEY, TEAM]);
    await A.waitForTimeout(300);
    ok((await st(A)).elsewhere === 'changed', 'R6: tab A is told the check changed in another tab');
    await A.evaluate(() => window.Readiness2.send('answer', { id: 'q4', value: 'y' })); await A.waitForTimeout(150);
    const saved = await A.evaluate(([i, k]) => JSON.parse(localStorage.getItem(k)).checks[i].sharedAt, [id, KEY]);
    ok(saved === '2026-11-24T12:00:00.000Z', 'M4 (R6): after tab A\'s next answer the store still holds the share (' + saved + ')');
    ok(await A.isVisible('#shared-line') && await A.isVisible('#unshare'), 'M4 (R6): tab A shows the shared line with "Withdraw shared copy"');
    await ctx.close();
  }
  // ---------- T1, T2 (L1, L2): the Team tab names old answers ----------
  {
    const docs = {
      dyngone01: { kind: 'dyn', v: 2, rules: 'v2.1 (24 Nov 2026)', useId: 'zz-9', useName: 'Old use', dept: '', cat: '', role: 'gm', type: 'independent', country: 'France', Q: { q1: 'y', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }, answers: { m1: 'p', m2: 'y' }, tailored: {}, by: {}, tby: {}, level: 'almost', pct: 80, known: 10, total: 10, met: 9, gates: 10, open: 1, reason: 'x', held: [], snaps: [], sharedAt: '2026-11-23T10:00:00Z', named: false },
      dynpartly1: { kind: 'dyn', v: 2, rules: 'v2.1 (24 Nov 2026)', useId: 'none', useName: '', dept: '', cat: '', role: 'gm', type: 'independent', country: 'France', Q: { q1: 'y', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }, answers: { m1: 'y', m2: 'y', m3: 'p', m4: 'y', m5: 'y', m6: 'y', m7: 'y', m8: 'y', m9: 'y', m10: 'y' }, tailored: {}, by: {}, tby: {}, level: 'almost', pct: 95, known: 10, total: 10, met: 9, gates: 10, open: 1, reason: 'x', held: [], snaps: [], sharedAt: '2026-11-23T11:00:00Z', named: false }
    };
    const init = { fn: d => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('hftp-readiness-checks-v1', d); sessionStorage.setItem('seeded', '1'); } }, arg: JSON.stringify(docs) };
    const { ctx, p } = await mk(b, 1280, false, init);
    await p.goto(BASE + 'readiness-check/team.html'); await p.waitForSelector('.sub-row[data-id="dyngone01"]', { timeout: 15000 });
    await p.click('.sub-row[data-id="dyngone01"]'); await p.waitForTimeout(200);
    const t1 = (await p.textContent('body')).replace(/\s+/g, ' ');
    ok(/A named owner with time: Not answered \(earlier answer: Partly, no longer offered\)/.test(t1) && !/A named owner with time: Partly/.test(t1), 'L2 (T1): a gone-use copy names the old answer');
    await p.click('.sub-row[data-id="dynpartly1"]'); await p.waitForTimeout(200);
    const plan = await p.evaluate(() => { const h = [...document.querySelectorAll('h3')].find(x => /Their action plan/.test(x.textContent)); return h ? h.parentElement.textContent.replace(/\s+/g, ' ') : ''; });
    ok(/Answer again: “/.test(plan) && !/Find out: “Has the person who approves/.test(plan), 'L1 (T2): the Team tab\'s action plan says "Answer again": ' + plan.slice(0, 120));
    ok(!p._errs.length, 'Team tab: no console errors ' + p._errs.join(' | '));
    await ctx.close();
  }

  // ---------- the council's nine answer patterns on the running page, with screenshots ----------
  const PAT = [
    ['A', 'all-planned-must-haves', { A: 'pl' }, 'Not ready yet', 'Score: 72%', 'Because none of the 10 must-haves is Yes.'],
    ['B', 'tailored-all-planned', { T: 'pl' }, 'Almost ready', 'Score: 77%', 'Held back: fewer than half the questions for this use case are Yes.'],
    ['C', 'ready', {}, 'Ready to start a pilot', 'Score: 100%', ''],
    ['D', 'q5-no', { Q: { q5: 'n' } }, 'Almost ready', 'Score: 100%', 'Held back: a No in step 2.'],
    ['E', 'q1-not-sure', { Q: { q1: 'u' } }, 'Almost ready', 'Score: 100%', 'Held back: Not sure in step 2.'],
    ['F', 'tailored-dont-know', { T: 'k' }, 'Almost ready', 'Score: 55%', ''],
    ['G', 'none-fits', { use: 'none' }, 'Almost ready', 'Score: 100%', 'Held back: no use case chosen.'],
    ['H', 'one-must-have-no', { A: { m4: 'n' } }, 'Not ready yet', 'Score: 94%', 'Because 1 must-have is No.'],
    ['I', 'q4-no', { Q: { q4: 'n' } }, 'Almost ready', 'Score: 100%', 'Held back: a No in step 2.'] // v2.6: was Ready with the assistant-only line
  ];
  const SHOOT = { A: 1, C: 1, G: 1, H: 1 };
  const heads = [];
  for (const [w, touch, wt] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    for (const [k, name, o, level, score, box] of PAT) {
      if (wt === 'phone' && !SHOOT[k]) continue;
      const { ctx, p } = await mk(b, w, touch); await open(p);
      await fill(p, o);
      const s = await st(p), lv = await txt(p, '#level-name'), sc = await txt(p, '#score'), bx = (await txt(p, '#box-reason')) || '', fl = await txt(p, '#first h2');
      if (wt === 'desktop') heads.push(k + ': ' + lv + ' · ' + sc + (bx ? ' · ' + bx : '') + ' | ' + fl);
      ok(s.step === 'result' && lv === level && sc === score && bx === box, wt + ' ' + k + ': "' + lv + ' · ' + sc + (bx ? ' · ' + bx : '') + '"');
      ok(bx ? !!(await p.$('#result #box-reason')) : !(await p.$('#box-reason')), wt + ' ' + k + ': the box line sits in the verdict box only when it is due (O5)');
      ok(fl !== 'Nothing open' || level === 'Ready to start a pilot', wt + ' ' + k + ': no "Nothing open" under a held verdict');
      ok(level === 'Ready to start a pilot' ? /^A pilot: a trial with one team or one outlet/.test((await txt(p, '#pilot-gloss')) || '') : !(await p.$('#pilot-gloss')), wt + ' ' + k + ': pilot gloss only under the top verdict');
      if (k === 'I') ok(!(await p.$('#assist')) && /Safety net/.test((await txt(p, '#first ol li')) || ''), wt + ' I (v2.6): no assistant-only line; the No on question 4 is item 1');
      if (k === 'D') ok(/^Settle this first: in step 2 you answered No to “Proof”/.test((await txt(p, '#first ol li')) || ''), wt + ' D: the hold is item 1');
      if (k === 'F' || k === 'B') { const plan = (await txt(p, '#plan')) || ''; ok(/Finish: |Find out: /.test(plan) && !/Agree in writing: hand-off rules|Train or brief the people involved:/.test(plan), wt + ' ' + k + ': the action plan shows the team-worded question, not the workbook action'); }
      ok(await noHScroll(p), wt + ' ' + k + ': no horizontal scroll');
      ok(!p._errs.length, wt + ' ' + k + ': no console errors ' + p._errs.join(' | '));
      if (SHOOT[k]) await shot(p, wt + '-result-' + name);
      await ctx.close();
    }
  }
  // ---------- BUILD NOW 7: step 3 consistency lines ----------
  for (const [w, touch, wt] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    const { ctx, p } = await mk(b, w, touch); await open(p);
    await fill(p, { Q: { q5: 'n', q3: 'u' }, stay: 'must' });
    ok((await txt(p, '#consist-m3')) === 'In step 2 you said you do not yet know the number to improve. If that has changed, go back and change it there too.', wt + ' BUILD NOW 7: line under must-have 3');
    ok(!(await p.$('#consist-m7')), wt + ' BUILD NOW 7 (v2.6): no line under must-have 7 any more (question 3 now asks about past examples)');
    await p.evaluate(() => window.Readiness2.send('answer', { id: 'm3', value: 'pl' })); ok(!(await p.$('#consist-m3')), wt + ' BUILD NOW 7: gone when must-have 3 is not Yes');
    ok(((await st(p)).events || []).includes('next'), wt + ' BUILD NOW 7: no blocking');
    await ctx.close();
  }
  // ---------- BUILD NOW 8: the detail layer, and the wording/ retake ----------
  for (const [w, touch, wt] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    const { ctx, p } = await mk(b, w, touch); await open(p);
    await fill(p, { stay: 'must' }); await p.evaluate(() => window.Readiness2.send('edit')); await p.waitForTimeout(80);
    await shot(p, wt + '-five-questions', WORDING);
    await p.evaluate(() => { const R = window.Readiness2; R.send('next'); R.send('next'); R.send('cat', 'Guest-facing'); R.send('dept', 'gx'); R.send('use', 'gx-2'); }); await p.waitForTimeout(80);
    await p.click('#dt-gx-2'); await p.waitForSelector('#detail[open]'); await p.waitForTimeout(150);
    const body = (await txt(p, '#detail')) || '';
    ok(!/AI technique/.test(body) && /The catalogue’s own description \(research wording\):/.test(body) && /What it does:/.test(body) && /How the AI works:/.test(body) && /How common in hotels:/.test(body) && /Examples and sources/.test(body) && !/fact-check|moved to Unclear/.test(body), wt + ' BUILD NOW 8: the layer shows what a manager can use, no research notes');
    ok(!/Catalogue description:/.test(body), wt + ' BUILD NOW 8: retitled');
    await shot(p, wt + '-detail-layer', null, true); await shot(p, wt + '-picker-panel-open', WORDING, true);
    await p.evaluate(() => { const d = document.querySelector('#detail'); d.scrollTop = d.scrollHeight; }); await p.waitForTimeout(100);
    await shot(p, wt + '-detail-layer-sources', null, true);
    await p.click('#detail-close'); await p.evaluate(() => window.Readiness2.send('next')); await p.waitForTimeout(80);
    await shot(p, wt + '-tailored-questions', WORDING);
    await p.evaluate(() => { const R = window.Readiness2; R.state().tailored.forEach(id => R.send('answer', { id, value: 'y' })); R.send('next'); }); await p.waitForTimeout(80);
    await (await p.$('#sum-where')).screenshot({ path: path.join(WORDING, wt + '-result-where-it-sits.png') });
    ok(!p._errs.length, wt + ' detail and wording walk: no console errors ' + p._errs.join(' | '));
    await ctx.close();
  }
  // the hub picker with the layer open (wording/ retake)
  {
    const { ctx, p } = await mk(b, 1280, false);
    await p.goto(BASE + 'index.html'); await p.click('#hubBar button[data-tool="readiness-2"]');
    await p.waitForSelector('#hubFrame iframe[title="readiness-2"]'); const f = await (await p.$('#hubFrame iframe[title="readiness-2"]')).contentFrame();
    await f.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 15000 });
    await fill(f, { where: true }); await f.click('#dt-gx-2'); await p.waitForSelector('#hub-detail[open]'); await p.waitForTimeout(150); // v2.6: the hub draws the layer on its main page
    ok((await f.evaluate(() => window.Readiness2.state().sharingOn)) === false && !(await f.$('#share-btn')), 'hub: sharing is off in the hub too');
    await shot(p, 'desktop-hub-picker-panel-open', WORDING, true);
    await ctx.close();
  }
  await b.close();
  console.log('Headlines on the page (desktop):'); heads.forEach(h => console.log('  ' + h));
  console.log('v25 browser: ' + pass + ' passed, ' + fail + ' failed');
  if (fail) process.exit(1);
})();
