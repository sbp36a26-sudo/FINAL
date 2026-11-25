// Browser test for "Do you need AI?" v3 (readiness-3), the standalone page, at 1280x800 and 360x740.
//  1. load: no page error, no request leaving the page's own server, no horizontal scroll on any screen
//  2. golden cases 1, 2, 9, 14, 15, 19 (and 10, 28) walked through the real page by clicking: verdict and score as expected
//  3. screenshots of each step and the result for golden 1, 9, 15, 19 (deviceScaleFactor 2) to reports/readiness-3-screens/
//  4. Back keeps answers, reload resumes, Start a new check asks first, unanswered note, contradiction note and "Change my answer"
//  5. keyboard-only run of golden case 1 (Tab, arrow keys, Enter/Space)
//  6. save as file → open restores; v2.7 store and file migrate (banner, first open screen); bad file message
//  7. downloads: without the capability → Copy fallback; with a fake window.claude.use('downloads') → save({filename, data}) called
//  8. storage unavailable → banner; PDF failure → its message
//  9. v3.0.1 (R3_ONLY=cleanup runs only this part): every bug of the clean-up inventory (H1–H3, M1–M4, L1–L12) and the council's BUILD NOW items 1, 3, 4, 6, 8 (cleanup())
// 10. v3.0.2 (R3_ONLY=cleanup2 runs only this part): clean-up inventory v2 (N1–N16, controls C1–C8), the council v3.0.1 BUILD NOW items
//     1, 5, 6, 7, 8, and the owner decisions of 25 Nov 2026 (no "Must be Yes" label; step 4 areas → departments → use cases with sources) (cleanup2())
// Serve tools/ first:  python3 -m http.server 8861 --bind 127.0.0.1   (R3_BASE for another address)
// Run from tools/:  node readiness-3/tests/browser/ui.cjs        (R3_SHOTS=0 to skip screenshots)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.R3_BASE || 'http://127.0.0.1:8861/';
const URL = BASE + 'readiness-3/index.html';
const ROOT = path.join(__dirname, '..', '..');
const SHOTS = path.join(ROOT, '..', '..', 'reports', 'readiness-3-screens');
const DO_SHOTS = process.env.R3_SHOTS !== '0';
const G = JSON.parse(fs.readFileSync(path.join(ROOT, 'spec', 'golden_cases_v3.json'), 'utf8'));
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'spec', 'usecase_questions_v3.runtime.json'), 'utf8'));
const FIX = n => fs.readFileSync(path.join(ROOT, 'tests', 'fixtures', n), 'utf8');
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const uid = s => String(s).replace(/[^A-Za-z0-9_-]/g, '_');
if (DO_SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

async function mk(b, size, init, arg) {
  const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] }, deviceScaleFactor: 2, hasTouch: size[0] < 500, isMobile: size[0] < 500 });
  if (init) await ctx.addInitScript(init, arg);
  const p = await ctx.newPage(); p._errs = []; p._out = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') p._errs.push(m.text()); });
  p.on('request', r => { if (!r.url().startsWith(BASE) && !/^(data|blob|about):/.test(r.url())) p._out.push(r.url()); });
  await p.goto(URL);
  await p.waitForFunction(() => window.Readiness3 && window.Readiness3.ready());
  return { ctx, p };
}
const st = p => p.evaluate(() => window.Readiness3.state());
async function noHScroll(p, tag) { const w = await p.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]); ok(w[0] <= w[1], tag + ': no horizontal scroll (' + w[0] + ' > ' + w[1] + ')'); }
async function shot(p, name) { if (DO_SHOTS && p._shots) await p.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: true }); }
async function next(p) { await p.click('[data-act="next"]'); }
async function pick(p, kind, id, key) { await p.check('#r-' + kind + '-' + uid(id) + '-' + key); }
/* v3.0.2 (owner decision, 25 Nov 2026): step 4 is area tiles → department tiles → use cases. Click down to one use case. */
const AREA = { 'Revenue Management': 'Commercial', 'Reservations & Distribution': 'Commercial', 'Sales & Marketing': 'Commercial', 'Front Office': 'Guest-facing', 'Guest Experience & Customer Service': 'Guest-facing', 'Food & Beverage service': 'Guest-facing',
  'Housekeeping': 'Operational', 'Maintenance & Engineering': 'Operational', 'Kitchen & Culinary Operations': 'Operational', 'Procurement & Purchasing': 'Operational', 'Finance & Accounting': 'Administrative', 'Human Resources': 'Administrative',
  'General Management & Administration': 'Administrative', 'IT & Security': 'Administrative', 'Sustainability & Governance': 'Administrative' };
async function pickUse(p, id) {
  const u = D.use_cases.find(x => x.id === id);
  if (await p.$('#crumb-areas')) await p.click('#crumb-areas');
  await p.click('#area-' + uid(AREA[u.department])); await p.click('#dept-' + uid(u.department)); await p.check('#r-use-' + uid(id));
}

/* Walk one golden case through the page by clicking. Answers every question (no unanswered note). */
async function walk(p, g, n, tag) {
  const pre = 'g' + String(n).padStart(2, '0') + '-' + tag + '-';
  await shot(p, pre + '0-cover');
  await p.click('[data-act="begin"]');
  await p.fill('#h-name', 'Hotel Alpenblick'); await p.selectOption('#h-type', 'independent');
  await shot(p, pre + '1-hotel'); await noHScroll(p, pre + 'hotel'); await next(p);
  const s2 = Object.assign({ s1: 'yes', s2: 'yes', s3: 'yes', s4: 'yes', s5: 'yes' }, g.step2);
  for (const s of D.step2) await pick(p, 's2', s.id, s2[s.id]);
  await shot(p, pre + '2-step2'); await noHScroll(p, pre + 'step2'); await next(p);
  if ((await st(p)).step === 'stop') {
    await shot(p, pre + '2b-softstop'); await noHScroll(p, pre + 'stop');
    if (!g.continued_after_soft_stop) return;
    await p.click('[data-act="continue"]');
  }
  const mh = {}; D.must_haves.forEach(m => { mh[m.id] = 'yes'; }); Object.assign(mh, g.must_haves_changed);
  for (const m of D.must_haves) await pick(p, 'mh', m.id, mh[m.id]);
  await shot(p, pre + '3-musthaves'); await noHScroll(p, pre + 'must'); await next(p);
  if (g.use_case === 'none') await p.check('#r-use-none');
  else await pickUse(p, g.use_case);
  await shot(p, pre + '4-where'); await noHScroll(p, pre + 'where'); await next(p);
  for (const [gid, key] of Object.entries(g.gates)) await pick(p, 'gate', gid, key);
  const vis = (await st(p)).visible;
  for (const id of vis) await pick(p, 'q', id, (g.questions_changed || {})[id] || 'yes');
  await shot(p, pre + '5-questions'); await noHScroll(p, pre + 'use'); await next(p);
  await shot(p, pre + '6-result'); await noHScroll(p, pre + 'result');
}


/* ---------- v3.0.1: the clean-up bugs (reports/audit-readiness-3/cleanup_inventory_v1.md, reproductions cleanup3/browser_repro.cjs)
   and the council's BUILD NOW items. Each check failed on v3.0.0 and passes now. ---------- */
const KEY3 = 'hftp-readiness3-v1';
const pause = ms => new Promise(r => setTimeout(r, ms));
const ready3 = p => p.waitForFunction(() => window.Readiness3 && window.Readiness3.ready(), null, { timeout: 8000 });
const BLOCK_LS = () => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); };
async function toResult(p) {
  return p.evaluate(() => {
    const R = window.Readiness3, s = R.send; s('begin'); s('next');
    ['s1', 's2', 's3', 's4', 's5'].forEach(id => s('answer', { kind: 's2', id, value: 'yes' })); s('next');
    for (let i = 1; i <= 11; i++) s('answer', { kind: 'mh', id: 'm' + i, value: 'yes' }); s('next');
    s('use', 'rm-1'); s('next'); s('answer', { kind: 'gate', id: 'G_ACT', value: 'suggests' });
    R.state().visible.forEach(id => s('answer', { kind: 'q', id, value: 'yes' })); s('next');
    return R.flush().then(() => R.state());
  });
}
async function cleanup(b, size, tag) {
  /* each block runs on its own: a block that throws (a missing element on an older page) counts as one failure */
  const guard = async fn => { try { await fn(); } catch (e) { ok(false, tag + ' clean-up block threw: ' + String(e && e.message || e).split('\n')[0]); } };
  /* H1 + L5: storage blocked, no downloads: the banner's Save as file shows the copy box on every screen; Close returns focus */
  await guard(async () => {
    const { ctx, p } = await mk(b, size, BLOCK_LS);
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('hotel', { k: 'name', v: 'Hotel Copy' }); s('next'); s('answer', { kind: 's2', id: 's1', value: 'yes' }); s('answer', { kind: 'mh', id: 'm1', value: 'yes' }); s('use', 'rm-1'); });
    let saved = '';
    for (const step of ['start', 'hotel', 's2', 'must', 'where', 'use']) {
      await p.evaluate(st => window.Readiness3.send('goto', st), step);
      await p.click('#save-file-banner');
      await p.waitForSelector('#copybox', { timeout: 3000 }).catch(() => {});
      const box = !!(await p.$('#copybox')), txt = box ? await p.inputValue('#copy-text') : '';
      let doc = null; try { doc = JSON.parse(txt); } catch (e) { doc = null; }
      ok(box && doc && doc.kind === 'hftp-do-you-need-ai' && doc.v === 4 && doc.check.mh.m1 === 'yes' && doc.check.use === 'rm-1', tag + ' H1 ' + step + ': the banner\'s Save as file shows the copy box with the saved check');
      ok(await p.evaluate(() => document.activeElement && document.activeElement.id === 'copy-text'), tag + ' H1 ' + step + ': focus moves to the text');
      if (doc) saved = txt;
      await p.click('#copy-close');
      ok(!(await p.$('#copybox')) && await p.evaluate(() => document.activeElement && document.activeElement.id === 'save-file-banner'), tag + ' L5 ' + step + ': Close shuts the box and returns focus to Save as file');
    }
    await noHScroll(p, tag + ' H1 copy box under the banner');
    /* the copied text reopens through the paste box with the same answers */
    await p.evaluate(() => { window.Readiness3.send('new'); window.Readiness3.send('goto', 'start'); });
    await p.click('details.fold summary'); await p.fill('#paste-in', saved); await p.click('[data-act="paste-open"]');
    const r = await p.evaluate(() => window.Readiness3.record());
    ok(r.step2.s1 === 'yes' && r.mh.m1 === 'yes' && r.use === 'rm-1' && r.hotel.name === 'Hotel Copy', tag + ' H1: the copied check reopens through the paste box with the same answers');
    ok(p._errs.length === 0, tag + ' H1: no errors ' + p._errs.join(' | '));
    await ctx.close();
  });
  /* M4 (B5): opening another check resets the department */
  await guard(async () => {
    const { ctx, p } = await mk(b, size);
    const out = await p.evaluate(() => {
      const R = window.Readiness3, s = R.send; s('begin'); s('use', 'hr-1');
      const d = R.fileDoc(); d.check.id = 'otheridhr1'; d.check.step = 'where';
      s('use', 'rm-1'); R.openText(JSON.stringify(d));
      const chosen = document.querySelector('input[name="n-use"]:checked');
      return { use: R.record().use, dept: R.state().where.dept, chosen: chosen && chosen.value };
    });
    ok(out.use === 'hr-1' && out.chosen === 'hr-1' && out.dept === D.use_cases.find(u => u.id === 'hr-1').department, tag + ' M4: the opened check shows its own department with its use case chosen ' + JSON.stringify(out));
    await ctx.close();
  });
  /* H2 (B4): an older file of the same check opens as a copy; the newer answers stay. L7: a newer file says so. */
  await guard(async () => {
    const { ctx, p } = await mk(b, size);
    const doc = await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); s('answer', { kind: 's2', id: 's1', value: 'yes' }); return JSON.stringify(window.Readiness3.fileDoc()); });
    await pause(15);
    const cur = await p.evaluate(() => { const s = window.Readiness3.send; ['s2', 's3'].forEach(id => s('answer', { kind: 's2', id, value: 'yes' })); return window.Readiness3.flush().then(() => window.Readiness3.record().id); });
    await p.evaluate(d => window.Readiness3.openText(d), doc); await pause(50);
    const after = await p.evaluate(k => ({ rec: window.Readiness3.record(), stored: JSON.parse(localStorage.getItem(k + '_c_' + JSON.parse(localStorage.getItem(k)).ids[0])), ids: JSON.parse(localStorage.getItem(k)).ids, toast: document.getElementById('toast').textContent, dialog: document.getElementById('confirm').open }), KEY3);
    ok(after.rec.id !== cur && after.rec.step2.s1 === 'yes' && !after.rec.step2.s2, tag + ' H2: the older file opens as a copy (new id, its own answers)');
    ok(after.stored.id === cur && after.stored.step2.s2 === 'yes' && after.stored.step2.s3 === 'yes', tag + ' H2: the newer stored check keeps s2 and s3 ' + JSON.stringify(after.stored.step2));
    ok(after.toast === 'Opened as a copy: this browser has a newer version of this check.', tag + ' H2: it says so: ' + after.toast);
    /* a file as new or newer replaces without asking */
    const newer = JSON.parse(await p.evaluate(() => JSON.stringify(window.Readiness3.fileDoc()))); newer.check.updated = '2999-01-01T00:00:00.000Z'; newer.check.step2.s5 = 'no';
    const id0 = await p.evaluate(() => window.Readiness3.record().id);
    await p.evaluate(d => window.Readiness3.openText(d), JSON.stringify(newer));
    const r2 = await p.evaluate(() => window.Readiness3.record());
    ok(r2.id === id0 && r2.step2.s5 === 'no', tag + ' H2: a newer file of the same check replaces it');
    /* L7 */
    await p.evaluate(() => window.Readiness3.send('goto', 'start'));
    const ok7 = await p.evaluate(() => window.Readiness3.openText(JSON.stringify({ kind: 'hftp-do-you-need-ai', v: 5, check: { id: 'abcdef' } })));
    ok(ok7 === false && (await p.textContent('#file-err')).trim() === 'This file was saved with a newer version of this tool. Open it there.', tag + ' L7: a newer file version gets its own message');
    await ctx.close();
  });
  /* M1 (B2) and M2 (B3): two tabs */
  await guard(async () => {
    const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] } });
    const open = async () => { const p = await ctx.newPage(); await p.goto(URL); await ready3(p); return p; };
    const A = await open(), B = await open();
    await A.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); s('answer', { kind: 's2', id: 's1', value: 'yes' }); return window.Readiness3.flush(); });
    await pause(50);
    await B.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); s('answer', { kind: 's2', id: 's1', value: 'no' }); return window.Readiness3.flush(); });
    const idx2 = await A.evaluate(k => ({ ids: JSON.parse(localStorage.getItem(k)).ids.length, recs: Object.keys(localStorage).filter(x => x.startsWith(k + '_c_')).length }), KEY3);
    ok(idx2.ids === 2 && idx2.recs === 2, tag + ' M1: two tabs, two checks: the index lists both (' + idx2.ids + ' of ' + idx2.recs + ')');
    const C = await open(), E = await open();
    await C.evaluate(() => { window.Readiness3.send('answer', { kind: 's2', id: 's3', value: 'no' }); return window.Readiness3.flush(); });
    await pause(80);
    await E.evaluate(() => { window.Readiness3.send('answer', { kind: 's2', id: 's4', value: 'no' }); return window.Readiness3.flush(); });
    await pause(50);
    const eConf = await E.evaluate(() => window.Readiness3.state().conflict);
    const F = await open();
    const s2 = await F.evaluate(() => window.Readiness3.record().step2);
    ok((s2.s3 === 'no' && s2.s4 === 'no') || (s2.s3 === 'no' && eConf), tag + ' M2: the same check in two tabs: no answer is lost silently ' + JSON.stringify(s2) + ' conflict=' + eConf);
    /* the conflict banner, forced: a pending answer here while another tab saved the same check */
    await C.evaluate(() => { window.Readiness3.send('answer', { kind: 's2', id: 's5', value: 'no' }); return window.Readiness3.flush(); });
    await E.evaluate(k => { const id = window.Readiness3.record().id, r = JSON.parse(localStorage.getItem(k + '_c_' + id)); r.updated = '2999-01-01T00:00:00.000Z'; r.step2.s2 = 'dk'; localStorage.setItem(k + '_c_' + id, JSON.stringify(r)); window.Readiness3.send('answer', { kind: 's2', id: 's1', value: 'dk' }); return window.Readiness3.flush(); }, KEY3);
    ok(await E.isVisible('#conflict') && (await E.evaluate(() => window.Readiness3.state().saved)) === 'conflict', tag + ' M2: a change elsewhere while answers wait here shows the banner and holds the write');
    await E.click('#conflict-mine');
    const kept = await E.evaluate(k => JSON.parse(localStorage.getItem(k + '_c_' + window.Readiness3.record().id)).step2.s1, KEY3);
    ok(kept === 'dk' && !(await E.$('#conflict')), tag + ' M2: "Keep my answers" writes this tab\'s version');
    await ctx.close();
  });
  /* M3 (B6) + L5: Remove asks first; Cancel keeps; Remove deletes; focus stays on the page */
  await guard(async () => {
    const { ctx, p } = await mk(b, size);
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); s('answer', { kind: 's2', id: 's1', value: 'yes' }); return window.Readiness3.flush(); });
    await p.evaluate(() => { window.Readiness3.send('back'); window.Readiness3.send('back'); });
    await p.waitForSelector('[data-act="remove-check"]');
    await p.click('[data-act="remove-check"]');
    const d1 = await p.evaluate(() => ({ open: document.getElementById('confirm').open, title: document.getElementById('confirm-title').textContent, focus: document.activeElement.getAttribute('data-act') }));
    ok(d1.open && d1.title === 'Remove this check?' && d1.focus === 'remove-no', tag + ' M3: Remove asks first, with Cancel focused ' + JSON.stringify(d1));
    await p.click('[data-act="remove-no"]');
    ok(await p.evaluate(k => JSON.parse(localStorage.getItem(k)).ids.length === 1 && /^rm-/.test(document.activeElement.id), KEY3), tag + ' M3: Cancel keeps the check and returns focus to Remove');
    await p.click('[data-act="remove-check"]'); await p.click('[data-act="remove-yes"]'); await pause(100);
    const st = await p.evaluate(k => ({ ids: JSON.parse(localStorage.getItem(k)).ids.length, focus: document.activeElement.tagName, fid: document.activeElement.id }), KEY3);
    ok(st.ids === 0 && st.focus !== 'BODY', tag + ' M3 + L5: Remove deletes the check; focus on ' + st.fid);
    await ctx.close();
  });
  /* L11 (B7a), L12, L10 (B7b): downloads */
  await guard(async () => {
    const { ctx, p } = await mk(b, size, () => { window.claude = { use: () => Promise.resolve(Object.freeze({ save() { throw new TypeError('detached'); } })) }; });
    await toResult(p); await p.click('#pdf'); await p.waitForSelector('#copybox', { timeout: 3000 }).catch(() => {});
    ok(!!(await p.$('#copybox')) && (await p.textContent('#copy-msg')).trim() === 'The file couldn\'t be saved here. Use Copy instead.' && p._errs.length === 0, tag + ' L11: save() throwing → the copy box, no unhandled error ' + p._errs.join(' | '));
    await p.click('#copy-close');
    ok(await p.evaluate(() => document.activeElement && document.activeElement.id === 'pdf'), tag + ' L5: Close on the result returns focus to Download (PDF)');
    await ctx.close();
  });
  for (const [code, msg] of [['too_large', 'The file couldn\'t be saved here. Use Copy instead.'], ['host_unavailable', 'The file couldn\'t be saved here. Use Copy instead.'], ['unavailable', 'Downloads are not available here. Use Copy instead.'], ['capability_missing', 'Downloads are not available here. Use Copy instead.']]) {
    await guard(async () => {
      const { ctx, p } = await mk(b, size, c => { window.claude = { use: () => Promise.resolve({ save: () => Promise.reject({ code: c }) }) }; }, code);
      await toResult(p); await p.click('#save-file'); await p.waitForSelector('#copybox', { timeout: 3000 }).catch(() => {});
      ok((await p.textContent('#copy-msg', { timeout: 2000 }).catch(() => '')).startsWith(msg), tag + ' L12: save() error ' + code + ' → "' + msg + '"');
      await ctx.close();
    });
  }
  await guard(async () => {
    const { ctx, p } = await mk(b, size, () => { window.__uses = 0; window.claude = { use: () => { window.__uses++; return new Promise(() => {}); } }; });
    await toResult(p); await p.click('#pdf'); await p.click('#pdf', { force: true }); await pause(300); /* force: Playwright itself treats the busy button (aria-disabled) as not clickable */
    const st = await p.evaluate(() => { const e = document.getElementById('pdf'); return { busy: e.getAttribute('aria-busy'), text: e.textContent, uses: window.__uses, box: !!document.getElementById('copybox'), focus: document.activeElement.id, state: window.Readiness3.state().busy }; });
    ok(st.busy === 'true' && st.text === 'Preparing…' && st.uses === 1 && !st.box && st.focus === 'pdf' && st.state.includes('pdf'), tag + ' L10: a download that waits shows Preparing…, keeps focus, ignores the second click ' + JSON.stringify(st));
    await ctx.close();
  });
  /* L1 (B8): a failed read of the index at boot moves to memory and never overwrites the stored index */
  await guard(async () => {
    const init = () => {
      const P = 'fake:';
      window.storage = {
        get(k) { if (sessionStorage.getItem('failget') && k === 'hftp-readiness3-v1') return Promise.reject(new Error('transient')); const v = localStorage.getItem(P + k); return v == null ? Promise.reject(new Error('not found')) : Promise.resolve({ key: k, value: v }); },
        set(k, v) { localStorage.setItem(P + k, v); return Promise.resolve({ key: k, value: v }); },
        delete(k) { localStorage.removeItem(P + k); return Promise.resolve({ key: k, deleted: true }); }
      };
    };
    const { ctx, p } = await mk(b, size, init);
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); s('answer', { kind: 's2', id: 's1', value: 'yes' }); return window.Readiness3.flush(); });
    const kind = await p.evaluate(() => window.Readiness3.state().storage);
    await p.evaluate(() => sessionStorage.setItem('failget', '1'));
    await p.reload(); await ready3(p);
    const kind2 = await p.evaluate(() => window.Readiness3.state().storage), banner = !!(await p.$('#nostore'));
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); s('answer', { kind: 's2', id: 's1', value: 'no' }); return window.Readiness3.flush(); });
    await p.evaluate(() => sessionStorage.removeItem('failget'));
    const st = await p.evaluate(() => ({ ids: JSON.parse(localStorage.getItem('fake:hftp-readiness3-v1')).ids.length, recs: Object.keys(localStorage).filter(x => x.startsWith('fake:hftp-readiness3-v1_c_')).length }));
    ok(kind === 'artifact' && kind2 === 'memory' && banner, tag + ' L1: a failed read at boot → memory with the banner (' + kind + ' → ' + kind2 + ')');
    ok(st.ids === 1 && st.recs === 1, tag + ' L1: the stored index still lists the earlier check, nothing orphaned (' + st.ids + ' listed, ' + st.recs + ' stored)');
    await ctx.close();
  });
  /* L4 (B13): storage that never answers: the page still starts, in memory, within a few seconds */
  await guard(async () => {
    const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] } });
    await ctx.addInitScript(() => { window.storage = { get: () => new Promise(() => {}), set: () => new Promise(() => {}), delete: () => Promise.resolve() }; });
    const p = await ctx.newPage(); await p.goto(URL);
    const t0 = Date.now(); await ready3(p).catch(() => {});
    const st = await p.evaluate(() => ({ ready: window.Readiness3.ready(), storage: window.Readiness3.state().storage, view: document.getElementById('view').innerHTML.length, banner: !!document.getElementById('nostore') }));
    ok(st.ready && st.storage === 'memory' && st.view > 0 && st.banner && Date.now() - t0 < 6000, tag + ' L4: boot falls back to memory and draws the cover ' + JSON.stringify(st));
    await ctx.close();
  });
  /* L2 (B9): an answer right before a reload is kept */
  await guard(async () => {
    const { ctx, p } = await mk(b, size);
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); s('answer', { kind: 's2', id: 's1', value: 'yes' }); return window.Readiness3.flush(); });
    await p.evaluate(() => { window.Readiness3.send('answer', { kind: 's2', id: 's2', value: 'yes' }); location.reload(); });
    await ready3(p);
    const s2 = await p.evaluate(() => window.Readiness3.record().step2);
    ok(s2.s1 === 'yes' && s2.s2 === 'yes', tag + ' L2: the last answer survives an immediate reload ' + JSON.stringify(s2));
    await ctx.close();
  });
  /* L3 (B10a) + L5 (B11a): the readiness-2 import is written to the index; OK on the banner keeps focus on the page */
  await guard(async () => {
    const store = JSON.parse(FIX('v2.7-store.json')).store;
    const { ctx, p } = await mk(b, size);
    await p.evaluate(s => { localStorage.clear(); localStorage.setItem('hftp-readiness2-v1', JSON.stringify(s)); }, store);
    await p.reload(); await ready3(p);
    const st = await p.evaluate(k => ({ imported: !!window.Readiness3.record().imported, idx: JSON.parse(localStorage.getItem(k) || 'null') }), KEY3);
    ok(st.imported && st.idx && st.idx.ids.length === 1, tag + ' L3: the import is written to the v3 index at once');
    ok(/^Imported from v2\.6\.1: please answer \d+ new questions?\./.test((await p.textContent('#imported')).trim()), tag + ' L8: banner wording kept');
    await p.click('[data-act="imported-ok"]');
    ok(await p.evaluate(() => document.activeElement && document.activeElement.id === 'h'), tag + ' L5: OK on the import banner moves focus to the heading');
    await p.reload(); await ready3(p);
    ok(await p.evaluate(() => { const r = window.Readiness3.record(); return !r.imported || r.imported.seen; }), tag + ' L3: no second import after a reload');
    await ctx.close();
  });
  /* L6 (B12): a new check with only the hotel details is not listed and does not ask for confirmation */
  await guard(async () => {
    const { ctx, p } = await mk(b, size);
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('hotel', { k: 'name', v: 'Hotel Bird' }); s('next'); s('answer', { kind: 's2', id: 's1', value: 'yes' }); });
    await p.click('#new-check'); await p.click('[data-act="new-yes"]'); await pause(100);
    await p.click('#new-check');
    const dlg = await p.evaluate(() => document.getElementById('confirm').open);
    ok(!dlg && (await st(p)).step === 'hotel', tag + ' L6: an untouched new check starts another without asking');
    await p.evaluate(() => window.Readiness3.send('back'));
    await p.waitForSelector('#mychecks .checks li');
    const n = await p.evaluate(k => ({ li: document.querySelectorAll('#mychecks li').length, recs: Object.keys(localStorage).filter(x => x.startsWith(k + '_c_')).length }), KEY3);
    ok(n.li === 1 && n.recs <= 2, tag + ' L6: Your checks lists 1 check (the real one); untouched checks are not kept (' + n.recs + ' stored)');
    await ctx.close();
  });
  /* L9: Continue this check goes to the first screen with something to answer */
  await guard(async () => {
    const { ctx, p } = await mk(b, size);
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); ['s1', 's2', 's3', 's4', 's5'].forEach(id => s('answer', { kind: 's2', id, value: 'yes' })); s('next'); for (let i = 1; i <= 11; i++) s('answer', { kind: 'mh', id: 'm' + i, value: 'yes' }); s('next'); s('use', 'rm-1'); s('next'); s('goto', 'start'); });
    await p.click('[data-act="resume"]');
    ok((await st(p)).step === 'use', tag + ' L9: Continue this check → step 5 (' + (await st(p)).step + ')');
    await ctx.close();
  });
  /* BUILD NOW 1, 3, 4, 6 on the screens */
  await guard(async () => {
    const { ctx, p } = await mk(b, size);
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('goto', 'must'); });
    ok((await p.textContent('#must-help')).trim() === 'Answer for the job you thought of in step 2. ‘The tool’ means the AI tool you have in mind; you pick the exact use case in step 4.', tag + ' BUILD NOW 3: the must-haves line');
    await p.evaluate(() => { const s = window.Readiness3.send; s('use', 'rm-1'); s('goto', 'use'); });
    /* v3.0.2: council v3.0.1 BUILD NOW 2 adds the consequence (was "… You can change it later.") */
    ok((await p.textContent('#hiw-help')).trim() === 'No tool chosen yet? Answer Don\'t know yet, or ask the vendor. You can change it on this screen later. With Don\'t know yet here, the result stays at Almost ready at best until you know.', tag + ' BUILD NOW 4: the How it works line');
    const n = (await st(p)).visible.length;
    ok((await p.$$('fieldset.card [data-kind="q"]')).length === 0 && (await p.textContent('#gates-first')).includes('count as Don\'t know yet'), tag + ' BUILD NOW 1: no question cards before the How it works answer, and the line says they count as Don\'t know yet');
    await pick(p, 'gate', 'G_ACT', 'suggests');
    ok((await p.$$('fieldset.card input[data-kind="q"][value="yes"]')).length === (await st(p)).visible.length && !(await p.$('#gates-first')) && n > 0, tag + ' BUILD NOW 1: the questions appear once it is answered');
    await ctx.close();
  });
  /* BUILD NOW 8: ?session=1 records time per step in the record and the saved file; without it nothing is recorded */
  await guard(async () => {
    const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] } });
    const p = await ctx.newPage(); const out = []; p.on('request', r => { if (!r.url().startsWith(BASE)) out.push(r.url()); });
    await p.goto(URL + '?session=1'); await ready3(p);
    await p.click('[data-act="begin"]'); await pause(30); await next(p); await pause(30); await p.click('[data-act="back"]');
    const doc = await p.evaluate(() => window.Readiness3.fileDoc());
    const tm = doc.check.timing || {};
    ok((await st(p)).session === true && tm.hotel && tm.s2 && tm.start && /^\d{4}-/.test(tm.hotel[0]) && /^\d{4}-/.test(tm.hotel[1]) && tm.hotel[2] >= 0 && out.length === 0, tag + ' BUILD NOW 8: timing per step in the saved file, nothing sent ' + JSON.stringify(Object.keys(tm)));
    ok(!(await p.$('[id*="timing"]')), tag + ' BUILD NOW 8: nothing about timing on screen');
    const p2 = await ctx.newPage(); await p2.goto(URL); await ready3(p2);
    await p2.evaluate(() => window.Readiness3.send('new')); await p2.evaluate(() => window.Readiness3.send('next'));
    ok(!(await p2.evaluate(() => window.Readiness3.record().timing)), tag + ' BUILD NOW 8: without ?session=1 no timing is kept');
    await ctx.close();
  });
}

/* ---------- v3.0.2 (R3_ONLY=cleanup2 runs only this part): clean-up inventory v2 (reports/audit-readiness-3/cleanup_inventory_v2.md,
   N1–N16; reproductions cleanup31/browser_repro.cjs, moved here), the code-only BUILD NOW items of the council on v3.0.1, and the two
   owner decisions of 25 Nov 2026 (no "Must be Yes" label on the cards; step 4 areas → departments → use cases with sources).
   Every N check failed on v3.0.1 and passes now; the C checks are controls that held on v3.0.1 and must keep holding. ---------- */
const send3 = (p, ev, arg) => p.evaluate(([e, a]) => window.Readiness3.send(e, a), [ev, arg]);
const ans3 = (p, kind, id, value) => send3(p, 'answer', { kind, id, value });
const rec3 = p => p.evaluate(() => window.Readiness3.record());
const stored3 = (p, id) => p.evaluate(([k, i]) => JSON.parse(localStorage.getItem(k + '_c_' + i) || 'null'), [KEY3, id]);
const noH = p => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
/* a synthetic storage event, as another tab's write raises it (a deterministic stand-in for a second tab) */
async function otherTab(p, mutate, stamp) {
  return p.evaluate(([k, m, t]) => {
    const r = window.Readiness3.record(), key = k + '_c_' + r.id, cur = JSON.parse(localStorage.getItem(key));
    Object.assign(cur.step2, m); cur.updated = t; const v = JSON.stringify(cur);
    localStorage.setItem(key, v);
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: v, storageArea: localStorage }));
  }, [KEY3, mutate, stamp]);
}
async function cleanup2(b, size, tag) {
  const guard = async (name, fn) => { try { await fn(); } catch (e) { ok(false, tag + ' ' + name + ' threw: ' + String(e && e.message || e).split('\n')[0]); } };
  const T = tag + ' v3.0.2';
  await guard('N1', async () => {
    const { ctx, p } = await mk(b, size);
    const file = FIX('v2.7-file.json');
    await p.evaluate(t => window.Readiness3.openText(t), file);
    await ans3(p, 'mh', 'm11', 'yes'); await p.evaluate(() => window.Readiness3.flush());
    const id = (await rec3(p)).id;
    await pause(30); await send3(p, 'goto', 'start');
    await p.evaluate(t => window.Readiness3.openText(t), file); await pause(200);
    const r = await rec3(p), s = await stored3(p, id), toast = await p.textContent('#toast');
    ok(s && s.mh.m11 === 'yes' && r.id !== id && toast === 'Opened as a copy: this browser has a newer version of this check.', T + ' N1: the same readiness-2 file opened again keeps the v3 answers (stored m11 = ' + (s && s.mh.m11) + ', "' + toast + '")');
    await ctx.close();
  });
  await guard('N2', async () => {
    const { ctx, p } = await mk(b, size);
    await send3(p, 'begin'); await send3(p, 'next'); await ans3(p, 's2', 's1', 'yes'); await p.evaluate(() => window.Readiness3.flush());
    await ans3(p, 's2', 's3', 'no');
    await otherTab(p, { s2: 'dk' }, '2999-01-01T00:00:00.000Z');
    const c1 = (await st(p)).conflict;
    await pause(300);
    await otherTab(p, { s4: 'dk' }, '2999-01-02T00:00:00.000Z'); await pause(50);
    const r = await rec3(p), s = await st(p);
    ok(c1 && r.step2.s3 === 'no' && s.conflict, T + ' N2: a second change elsewhere keeps the conflict held and the answer here (s3 = ' + r.step2.s3 + ', conflict = ' + s.conflict + ')');
    await p.click('#conflict-theirs');
    ok((await rec3(p)).step2.s4 === 'dk', T + ' N2: Use the other version takes the latest other version (s4 = dk)');
    await ctx.close();
  });
  await guard('N3', async () => {
    const { ctx, p } = await mk(b, size);
    await send3(p, 'begin'); await send3(p, 'next'); await ans3(p, 's2', 's1', 'yes'); await p.evaluate(() => window.Readiness3.flush());
    await ans3(p, 's2', 's3', 'no');
    await otherTab(p, { s2: 'dk' }, '2999-01-01T00:00:00.000Z'); await pause(300);
    await p.click('#new-check');
    const o = await p.evaluate(() => ({ dialog: document.getElementById('confirm').open, focus: document.activeElement.id, s3: window.Readiness3.record().step2.s3, toast: document.getElementById('toast').textContent }));
    ok(!o.dialog && o.focus === 'conflict' && o.s3 === 'no' && o.toast === 'Choose Keep my answers or Use the other version first.', T + ' N3: Start a new check is held while the conflict banner is up ' + JSON.stringify(o));
    const opened = await p.evaluate(() => window.Readiness3.openText(JSON.stringify(window.Readiness3.fileDoc())));
    const sent = await send3(p, 'new');
    ok(opened === false && sent === false && (await rec3(p)).step2.s3 === 'no', T + ' N3: opening a file and send("new") are held too');
    await ctx.close();
  });
  await guard('N4', async () => {
    const { ctx, p } = await mk(b, size, BLOCK_LS);
    await send3(p, 'begin'); await send3(p, 'next'); await ans3(p, 's2', 's1', 'yes');
    await p.click('#save-file-banner'); await p.waitForSelector('#copybox');
    await ans3(p, 's2', 's2', 'yes');
    const box = !!(await p.$('#copybox')), txt = box ? await p.inputValue('#copy-text') : '';
    let doc = null; try { doc = JSON.parse(txt); } catch (e) {}
    ok(box && doc && doc.check.step2.s2 === 'yes', T + ' N4: the open Saved check box holds the latest answers (s2 = ' + (doc && doc.check.step2.s2) + ')');
    await ctx.close();
  });
  await guard('N5 + BUILD NOW 1', async () => {
    const { ctx, p } = await mk(b, size);
    await send3(p, 'begin'); await send3(p, 'use', 'rm-1'); await send3(p, 'goto', 'use'); await send3(p, 'next');
    const o = await p.evaluate(() => { const g = document.getElementById('gates-first'), n = document.getElementById('open-note'); return { min: g && g.getAttribute('data-min'), max: g && g.getAttribute('data-max'), note: n && n.querySelector('p').textContent, btn: document.querySelector('[data-act="next"]').textContent, open: document.querySelectorAll('fieldset.card input[data-kind="gate"]').length / 3 }; });
    const want = 'The How it works question has no answer yet. If you go on, it and ' + (o.min === o.max ? 'the ' + o.min + ' questions' : 'the ' + o.min + ' to ' + o.max + ' questions') + ' after it count as Don\'t know yet. Press See the result again to go on.';
    ok(o.note === want && o.note.includes('Press ' + o.btn + ' again'), T + ' N5 / BUILD NOW 1: the held note counts what is on screen, the range follows and names the real button: ' + o.note);
    await send3(p, 'use', 'rm-2'); await send3(p, 'goto', 'use'); await send3(p, 'next');
    const two = await p.textContent('#open-note p');
    ok(/^The 2 How it works questions have no answer yet\. If you go on, they and the \d+( to \d+)? questions after them count as Don't know yet\. Press See the result again to go on\.$/.test(two), T + ' BUILD NOW 1: two open: ' + two);
    await send3(p, 'goto', 's2'); await send3(p, 'next');
    ok(/Press Next again to go on\.$/.test(await p.textContent('#open-note p')), T + ' BUILD NOW 1: step 2 names Next');
    await send3(p, 'use', 'rm-1'); await send3(p, 'goto', 'use'); await ans3(p, 'gate', 'G_ACT', 'suggests'); await send3(p, 'next');
    ok(/^\d+ questions have no answer yet\. They count as Don't know yet\. Press See the result again to go on\.$/.test(await p.textContent('#open-note p')), T + ' BUILD NOW 1: step 5 with questions open names See the result');
    await ctx.close();
  });
  await guard('N6', async () => {
    const { ctx, p } = await mk(b, size, BLOCK_LS);
    await p.click('[data-act="begin"]');
    await p.fill('#h-name', 'Hotel Stork');
    ok(!!(await p.$('#save-file-banner')) && (await p.evaluate(() => document.activeElement.id)) === 'h-name', T + ' N6: typing the hotel name offers Save as file at once; the field keeps focus');
    await ctx.close();
  });
  await guard('N7', async () => {
    const { ctx, p } = await mk(b, size);
    await p.evaluate(() => window.Readiness3.openText('not json'));
    const e1 = !!(await p.$('#file-err'));
    await p.click('[data-act="begin"]'); await send3(p, 'back');
    ok(e1 && !(await p.$('#file-err')), T + ' N7: the file error is cleared once the cover is left');
    await ctx.close();
  });
  await guard('N8', async () => {
    const { ctx, p } = await mk(b, size);
    await send3(p, 'begin');
    const r0 = JSON.stringify(await rec3(p));
    const a = await send3(p, 'goto', 'bogus');
    ok(a === false && (await p.evaluate(() => document.getElementById('app').getAttribute('data-state'))) === 'hotel' && p._errs.length === 0 && JSON.stringify(await rec3(p)) === r0, T + ' N8a: send("goto", "bogus") is refused, no error, nothing changes');
    await send3(p, 'goto', 'must');
    const r1 = JSON.stringify(await rec3(p));
    const bads = await p.evaluate(() => { const s = window.Readiness3.send; return [s('answer', { kind: 'mh', id: 'm1', value: 'maybe' }), s('answer', { kind: 'mh', id: 'm1', value: 'na' }), s('answer', { kind: 's2', id: 's9', value: 'yes' }), s('answer', { kind: 'q', id: 'rm-1.nope', value: 'yes' }), s('use', 'zz-9'), s('hotel', { k: 'type', v: 'castle' }), s('hotel', { k: 'evil', v: 'x' }), s('area', 'Moon'), s('dept', 'Spa'), s('fly')]; });
    ok(bads.every(x => x === false) && JSON.stringify(await rec3(p)) === r1 && !(await st(p)).open.every(x => x !== 'm1'), T + ' N8b: unknown values, ids, keys and events are refused ' + JSON.stringify(bads));
    ok(await send3(p, 'answer', { kind: 'mh', id: 'm2', value: 'na' }) === true && (await rec3(p)).mh.m2 === 'na', T + ' N8: a valid answer is taken (send returns true)');
    await send3(p, 'use', 'rm-1'); await send3(p, 'goto', 'use');
    const g = await send3(p, 'answer', { kind: 'gate', id: 'G_ACT', value: 'bogus' });
    const cards = await p.$$eval('input[data-kind="q"]', x => x.length);
    ok(g === false && cards === 0 && !!(await p.$('#gates-first')), T + ' N8c: an unknown How it works value does not unlock the questions');
    await ctx.close();
  });
  await guard('N15', async () => {
    const { ctx, p } = await mk(b, size);
    await send3(p, 'begin'); await send3(p, 'next'); await ans3(p, 's2', 's1', 'yes'); await p.evaluate(() => window.Readiness3.flush());
    const doc = await p.evaluate(() => JSON.stringify(window.Readiness3.fileDoc()));
    const u0 = (await rec3(p)).updated;
    await pause(20); await send3(p, 'back'); await send3(p, 'next'); await p.evaluate(() => window.Readiness3.flush());
    const u1 = (await rec3(p)).updated;
    ok(u0 === u1, T + ' N15a: Back and Next leave "updated" as it was (' + u0 + ' → ' + u1 + ')');
    await send3(p, 'goto', 'start');
    await p.evaluate(d => window.Readiness3.openText(d), doc); await pause(100);
    const r = await rec3(p), toast = await p.textContent('#toast');
    ok(r.id === JSON.parse(doc).check.id && toast === 'Opened the saved check.', T + ' N15b: the file just saved reopens as the same check ("' + toast + '")');
    await ans3(p, 's2', 's2', 'yes');
    ok((await rec3(p)).updated > u0, T + ' N15: an answer still stamps "updated"');
    await ctx.close();
  });
  await guard('N9', async () => {
    const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] } });
    const p = await ctx.newPage(); p._errs = []; await p.goto(URL + '?session=1'); await ready3(p);
    await send3(p, 'begin'); await send3(p, 'next'); await ans3(p, 's2', 's1', 'yes');
    const id = (await rec3(p)).id;
    await pause(400);
    await send3(p, 'new'); await pause(200);
    const old = await stored3(p, id);
    ok(old && old.timing && old.timing.s2 && old.timing.s2[2] >= 350 && old.timing.s2[1], T + ' N9a: the previous check\'s last step keeps its time (s2 = ' + JSON.stringify(old && old.timing && old.timing.s2) + ')');
    await p.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
    await pause(600);
    await p.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' }); document.dispatchEvent(new Event('visibilitychange')); });
    await send3(p, 'next');
    const t = (await rec3(p)).timing.hotel;
    ok(t[2] < 500, T + ' N9b / BUILD NOW 7: time with the page hidden is not counted (hotel ms = ' + t[2] + ' with 600 ms hidden)');
    await ctx.close();
  });
  await guard('BUILD NOW 7', async () => {
    const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] } });
    const p = await ctx.newPage(); await p.goto(URL + '#session'); await ready3(p);
    await send3(p, 'begin'); await send3(p, 'goto', 'result'); await pause(30);
    await p.evaluate(() => window.dispatchEvent(new Event('pagehide'))); await pause(50);
    const r = await rec3(p);
    ok((await st(p)).session === true && r.timing && r.timing.result && /^\d{4}-/.test(r.timing.result[1]), T + ' BUILD NOW 7: #session in the address turns timing on; the result gets a leave time on pagehide ' + JSON.stringify(r.timing && r.timing.result));
    await ctx.close();
  });
  await guard('BUILD NOW 8', async () => {
    const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] } });
    const p = await ctx.newPage(); const out = []; p.on('request', r => { if (!r.url().startsWith(BASE)) out.push(r.url()); });
    await p.goto(URL + '?session=1'); await ready3(p);
    await send3(p, 'begin'); await send3(p, 'goto', 'where');
    await p.fill('#uc-search', 'chatbot'); await pause(1700);
    await p.fill('#uc-search', 'ab'); await pause(1700);
    await p.fill('#uc-search', 'pricing'); await pause(1700);
    const doc = await p.evaluate(() => window.Readiness3.fileDoc());
    ok(doc.check.searches && doc.check.searches.length === 1 && doc.check.searches[0].q === 'chatbot' && out.length === 0 && !(await p.$('[id*="search"][id*="log"]')), T + ' BUILD NOW 8: a search that found nothing for 1.5 s is kept in the saved file (session mode), nothing shown or sent ' + JSON.stringify(doc.check.searches));
    const p2 = await ctx.newPage(); await p2.goto(URL); await ready3(p2);
    await send3(p2, 'new'); await send3(p2, 'goto', 'where'); await p2.fill('#uc-search', 'chatbot'); await pause(1700);
    ok(!(await rec3(p2)).searches, T + ' BUILD NOW 8: without session mode nothing is kept');
    await ctx.close();
  });
  await guard('N10 + BUILD NOW 5', async () => {
    const { ctx, p } = await mk(b, size);
    await send3(p, 'begin'); await send3(p, 'use', 'rm-1'); await send3(p, 'goto', 'use');
    await p.check('#r-gate-G_ACT-suggests');
    const live = (await p.textContent('#live')).trim(), n = (await st(p)).visible.length, cards = await p.$$eval('input[data-kind="q"]', x => x.length);
    ok(cards === n * 4 && live === n + ' questions for this use case are now shown below.', T + ' N10 / BUILD NOW 5: the questions that appear are announced ("' + live + '")');
    await p.check('#r-gate-G_ACT-acts');
    ok((await p.textContent('#live')).trim() === '', T + ' BUILD NOW 5: changing an answered How it works question announces nothing new');
    await ctx.close();
  });
  await guard('N11', async () => {
    const { ctx, p } = await mk(b, size);
    await send3(p, 'begin'); await send3(p, 'goto', 'where');
    await p.fill('#uc-search', 'pri');
    await p.evaluate(() => { window.__n = document.getElementById('uc-count'); });
    await p.type('#uc-search', 'c');
    const o = await p.evaluate(() => ({ same: window.__n === document.getElementById('uc-count') && document.contains(window.__n), role: window.__n.getAttribute('role'), text: window.__n.textContent }));
    ok(o.same && o.role === 'status' && /use cases? match/.test(o.text), T + ' N11: the search count is one status node whose text changes (' + o.text + ')');
    await ctx.close();
  });
  await guard('N12', async () => {
    const { ctx, p } = await mk(b, size, () => { window.claude = { use: () => new Promise(r => setTimeout(() => r({ save: () => Promise.reject({ code: 'unavailable' }) }), 400)) }; });
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); ['s1', 's2', 's3', 's4', 's5'].forEach(id => s('answer', { kind: 's2', id, value: 'yes' })); s('use', 'rm-1'); s('goto', 'result'); });
    await p.click('#pdf'); await send3(p, 'back'); await pause(700);
    const o = await p.evaluate(() => ({ step: window.Readiness3.state().step, box: !!document.getElementById('copybox'), toast: document.getElementById('toast').textContent, busy: window.Readiness3.state().busy }));
    ok(o.step === 'use' && !o.box && o.toast === 'Downloads are not available here. Use Copy on the result.' && !o.busy.length, T + ' N12: a late fallback on another screen gives a toast, no box ' + JSON.stringify(o));
    await ctx.close();
  });
  await guard('N13', async () => {
    const { ctx, p } = await mk(b, size, () => { Object.defineProperty(navigator, 'clipboard', { get() { return { writeText: () => Promise.reject(new Error('blocked')) }; } }); });
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); s('answer', { kind: 's2', id: 's1', value: 'yes' }); s('goto', 'result'); });
    await p.click('#save-file'); await p.waitForSelector('#copybox');
    const l1 = await p.textContent('#copybox .fld span'), m1 = await p.textContent('#copy-msg');
    await p.click('#copy-box'); await pause(100);
    const l2 = await p.textContent('#copybox .fld span'), m2 = await p.textContent('#copy-msg'), f = await p.evaluate(() => document.activeElement.id);
    ok(l1 === 'Saved check' && l1 === l2 && m1 === m2 && /Open a saved file/.test(m2) && f === 'copy-text' && (await p.textContent('#toast')) === 'Copying was blocked. Select the text and copy it.', T + ' N13: Copy in the box keeps its label and instructions, selects the text');
    await ctx.close();
  });
  await guard('N14', async () => {
    const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] } });
    const open = async () => { const p = await ctx.newPage(); p._errs = []; await p.goto(URL); await ready3(p); return p; };
    const A = await open();
    await send3(A, 'begin'); await send3(A, 'next'); await ans3(A, 's2', 's1', 'yes'); await A.evaluate(() => window.Readiness3.flush());
    const id = (await rec3(A)).id;
    const B = await open();
    await send3(B, 'goto', 'start'); await B.waitForSelector('[data-act="remove-check"]');
    await B.click('[data-act="remove-check"]'); await B.click('[data-act="remove-yes"]'); await pause(150);
    ok(await A.isVisible('#gone') && (await st(A)).gone === true, T + ' N14: the tab that has the check open says it was removed elsewhere');
    await ans3(A, 's2', 's2', 'yes'); await A.evaluate(() => window.Readiness3.flush()); await pause(100);
    const back = await A.evaluate(([k, i]) => ({ rec: !!localStorage.getItem(k + '_c_' + i), listed: JSON.parse(localStorage.getItem(k)).ids.includes(i) }), [KEY3, id]);
    ok(!back.rec && !back.listed, T + ' N14: nothing is written back before Keep it here ' + JSON.stringify(back));
    await A.click('#gone-keep'); await pause(250);
    const kept = await A.evaluate(([k, i]) => ({ rec: JSON.parse(localStorage.getItem(k + '_c_' + i) || 'null'), listed: JSON.parse(localStorage.getItem(k)).ids.includes(i) }), [KEY3, id]);
    ok(kept.rec && kept.rec.step2.s2 === 'yes' && kept.listed && !(await A.$('#gone')), T + ' N14: Keep it here writes it back with the answers given since');
    await ctx.close();
  });
  if (size[0] > 500) await guard('N16', async () => {
    const { ctx, p } = await mk(b, size, () => { window.__uses = 0; window.claude = { use: () => { window.__uses++; return new Promise(r => setTimeout(() => r({ save: () => Promise.resolve() }), window.__uses === 1 ? 10500 : 10)); } }; });
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('goto', 'result'); });
    await p.click('#pdf'); await p.waitForSelector('#copybox', { timeout: 15000 });
    await p.click('#copy-close'); await pause(800);
    await p.click('#pdf'); await pause(500);
    const o = await p.evaluate(() => ({ uses: window.__uses, box: !!document.getElementById('copybox'), toast: document.getElementById('toast').textContent }));
    ok(o.uses === 2 && !o.box && /^Saved /.test(o.toast), T + ' N16: after a slow first answer the next click asks the host again and saves ' + JSON.stringify(o));
    await ctx.close();
  });
  /* controls (held on v3.0.1) */
  await guard('C1', async () => {
    const { ctx, p } = await mk(b, size, BLOCK_LS);
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); s('answer', { kind: 's2', id: 's1', value: 'no' }); s('next'); s('next'); });
    const step = (await st(p)).step;
    await p.click('#save-file-banner'); await p.waitForSelector('#copybox');
    const focus = await p.evaluate(() => document.activeElement.id);
    await p.click('#copy-close');
    const back = await p.evaluate(() => document.activeElement.id);
    ok(step === 'stop' && focus === 'copy-text' && back === 'save-file-banner' && await noH(p), T + ' C1: stop screen, storage blocked: box, focus, Close back, no sideways scroll');
    await ctx.close();
  });
  await guard('C2', async () => {
    const { ctx, p } = await mk(b, size);
    await send3(p, 'begin'); await send3(p, 'goto', 'where');
    await p.fill('#uc-search', '   ');
    ok(!!(await p.$('#area-tiles')) && (await p.textContent('#uc-count')) === '', T + ' C2: spaces only → the area tiles, no count');
    await p.fill('#uc-search', 'zzqx' + 'x'.repeat(80));
    ok(/No use case matches/.test(await p.textContent('#uc-count')) && /choose an area/.test(await p.textContent('#uc-count')) && await noH(p), T + ' C2: no match message, a long word does not scroll sideways');
    await p.fill('#uc-search', 'guest');
    await p.focus('#uc-search'); await p.keyboard.press('Tab'); await p.keyboard.press('Space');
    const r1 = await rec3(p), f1 = await p.evaluate(() => document.activeElement.id);
    ok(!!r1.use && f1 === 'r-use-' + r1.use, T + ' C2: keyboard pick from the results keeps focus on the chosen radio (' + r1.use + ')');
    await p.keyboard.press('ArrowDown');
    const r2 = await rec3(p), f2 = await p.evaluate(() => document.activeElement.id);
    ok(r2.use !== r1.use && f2 === 'r-use-' + r2.use, T + ' C2: arrow key moves the choice and the focus (' + r2.use + ')');
    await p.fill('#uc-search', '');
    const w = (await st(p)).where, chk = await p.$eval('input[name="n-use"]:checked', x => x.value).catch(() => '');
    ok(chk === r2.use && w.dept === D.use_cases.find(u => u.id === r2.use).department, T + ' C2: clearing the search shows the chosen use case in its department (' + w.dept + ')');
    await ctx.close();
  });
  await guard('C3 C4', async () => {
    const { ctx, p } = await mk(b, size);
    await send3(p, 'begin'); await send3(p, 'use', 'rm-2'); await send3(p, 'goto', 'use');
    const g = (await st(p)).gates;
    await p.check('#r-gate-' + g[0] + '-dk');
    const c0 = await p.$$eval('input[data-kind="q"]', x => x.length);
    await p.check('#r-gate-' + g[1] + '-dk');
    const c1 = await p.$$eval('input[data-kind="q"]', x => x.length);
    await send3(p, 'back'); await send3(p, 'next');
    ok(g.length === 2 && c0 === 0 && c1 > 0 && Object.keys((await rec3(p)).gates['rm-2']).length === 2, T + ' C3: two gates hold the questions until both are answered; kept over Back/Next');
    await send3(p, 'use', 'none'); await send3(p, 'goto', 'use');
    for (const id of (await st(p)).gates) await p.check('#r-gate-' + id + '-dk');
    ok((await st(p)).gates.length === 5 && (await p.$$eval('input[data-kind="q"]', x => x.length)) === (await st(p)).visible.length * 4, T + ' C4: None fits: 5 gates, then the general questions');
    await ctx.close();
  });
  await guard('C5', async () => {
    const { ctx, p } = await mk(b, size);
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('next'); s('answer', { kind: 's2', id: 's1', value: 'yes' }); s('answer', { kind: 's2', id: 's3', value: 'no' }); return window.Readiness3.flush(); });
    await otherTab(p, { s2: 'dk' }, '2999-01-01T00:00:00.000Z');
    ok((await rec3(p)).step2.s2 === 'dk' && !(await st(p)).conflict, T + ' C5: a change elsewhere with nothing waiting is taken over');
    await ans3(p, 's2', 's4', 'no'); await otherTab(p, { s5: 'dk' }, '2999-01-02T00:00:00.000Z');
    ok(await p.isVisible('#conflict') && await noH(p), T + ' C5: the conflict banner shows, no sideways scroll');
    await p.click('#conflict-theirs');
    ok((await rec3(p)).step2.s5 === 'dk' && (await p.evaluate(() => document.activeElement.id)) === 'h', T + ' C5: Use the other version → taken, focus on the heading');
    await ctx.close();
  });
  await guard('C7 C8', async () => {
    const { ctx, p } = await mk(b, size, () => { window.claude = { use: () => Promise.resolve({ save: () => Promise.reject({ code: 'declined' }) }) }; });
    await p.evaluate(() => { const s = window.Readiness3.send; s('begin'); s('goto', 'result'); });
    await p.click('#pdf'); await pause(200);
    ok((await p.textContent('#toast')) === 'Download cancelled.' && (await p.textContent('#pdf')) === 'Download (PDF)' && !(await p.$('#copybox')), T + ' C7: declined → toast, button idle');
    await p.emulateMedia({ media: 'print' });
    ok((await p.$$eval('button, #banner, .copybox', xs => xs.filter(x => x.offsetParent !== null).length)) === 0, T + ' C8: print hides buttons and banners');
    await ctx.close();
  });
  /* owner decision 1 (25 Nov 2026): no "Must be Yes" (or other weight) label on any question card; named on the result instead */
  await guard('owner: no label', async () => {
    const { ctx, p } = await mk(b, size);
    await send3(p, 'begin'); await send3(p, 'goto', 'must');
    const must = await p.evaluate(() => ({ text: document.getElementById('view').textContent, tags: document.querySelectorAll('#view fieldset.card .tag').length, mustCls: document.querySelectorAll('.card.must, .mustyes').length }));
    ok(!/Must be Yes|must be Yes/.test(must.text) && must.tags === 0 && must.mustCls === 0, T + ' owner: the must-haves carry no "Must be Yes" label and look alike');
    await send3(p, 'use', 'rm-1'); await send3(p, 'goto', 'use'); await ans3(p, 'gate', 'G_ACT', 'acts');
    const use = await p.evaluate(() => ({ text: document.getElementById('view').textContent, tags: [...document.querySelectorAll('#view fieldset.card .tag')].map(t => t.textContent), borders: [...new Set([...document.querySelectorAll('#view fieldset.card')].map(c => getComputedStyle(c).borderLeftWidth))] }));
    ok(!/Must be Yes|Blocker|Important|Nice to have/.test(use.text) && use.tags.every(t => /^Who answers: /.test(t)) && use.borders.length === 1, T + ' owner: step 5 cards show only "Who answers"; every card has the same border ' + use.borders.join(','));
    await ctx.close();
  });
  await guard('owner: result', async () => {
    const { ctx, p } = await mk(b, size);
    await p.evaluate(() => { const R = window.Readiness3, s = R.send; s('begin'); s('next'); ['s1', 's2', 's3', 's4', 's5'].forEach(id => s('answer', { kind: 's2', id, value: 'yes' })); s('next');
      for (let i = 1; i <= 11; i++) s('answer', { kind: 'mh', id: 'm' + i, value: i === 1 ? 'no' : 'yes' }); s('next'); s('use', 'rm-1'); s('next'); s('answer', { kind: 'gate', id: 'G_ACT', value: 'suggests' });
      R.state().visible.forEach(id => s('answer', { kind: 'q', id, value: id === 'rm-1.te1' ? 'no' : 'yes' })); s('next'); });
    const o = await p.evaluate(() => ({ reason: document.getElementById('reason').textContent, need: [...document.querySelectorAll('#top3 .need')].map(x => x.textContent), page: document.getElementById('view').textContent, why: (document.getElementById('score-why') || {}).textContent }));
    ok(/^Needed before a pilot: A named owner with time; .+ \(answered No\)\.$/.test(o.reason) && o.need.length === 2 && o.need.every(t => t === 'Needed before a pilot'), T + ' owner: the reason and the top 3 name the blockers as Needed before a pilot: ' + o.reason);
    ok(!/Must be Yes/.test(o.page) && o.why === 'The verdict comes from the questions needed before a pilot, not from the score.', T + ' owner: no "Must be Yes" on the result');
    ok((await p.evaluate(() => window.Readiness3.summaryText())).includes('(General manager; needed before a pilot)'), T + ' owner: Copy names it too');
    await ctx.close();
  });
  /* owner decision 2 (25 Nov 2026): step 4 areas → departments → use cases, with the chosen use case's sources */
  await guard('owner: step 4', async () => {
    const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] }, permissions: ['clipboard-read', 'clipboard-write'] });
    const p = await ctx.newPage(); p._errs = []; p.on('pageerror', e => p._errs.push(String(e))); await p.goto(URL); await ready3(p);
    await send3(p, 'begin'); await send3(p, 'goto', 'where');
    const areas = await p.$$eval('#area-tiles .tile', ts => ts.map(t => [t.querySelector('b').textContent, t.querySelectorAll('span')[0].textContent, t.querySelector('.meta').textContent]));
    const want = [['Commercial', 'Selling rooms and setting prices'], ['Guest-facing', 'Serving the guest before and during the stay'], ['Operational', 'Running the building, rooms and kitchen'], ['Administrative', 'Finance, people, management and control']];
    const cnt = a => { const ds = [...new Set(D.use_cases.filter(u => AREA[u.department] === a).map(u => u.department))]; return ds.length + ' departments · ' + D.use_cases.filter(u => AREA[u.department] === a).length + ' use cases'; };
    ok(JSON.stringify(areas) === JSON.stringify(want.map(([a, l]) => [a, l, cnt(a)])) && !!(await p.$('#uc-search')) && (await (await p.$('#uc-search')).boundingBox()).y < (await (await p.$('#area-tiles')).boundingBox()).y, T + ' owner: four area tiles with their lines and counts, the search above ' + JSON.stringify(areas.map(a => a[2])));
    await p.click('#area-Guest-facing');
    const depts = await p.$$eval('#dept-tiles .tile', ts => ts.map(t => t.querySelector('b').textContent + ' | ' + t.querySelector('.meta').textContent));
    const wantD = [...new Set(D.use_cases.filter(u => AREA[u.department] === 'Guest-facing').map(u => u.department))].map(d => d + ' | ' + D.use_cases.filter(u => u.department === d).length + ' use cases');
    ok(JSON.stringify(depts) === JSON.stringify(wantD) && (await p.evaluate(() => document.activeElement.id)) === 'lvl-h', T + ' owner: the area\'s departments with use-case counts; focus on the level heading');
    await p.click('#dept-Guest_Experience___Customer_Service');
    const uses = await p.$$eval('input[name="n-use"]', is => is.map(i => i.value));
    ok(JSON.stringify(uses) === JSON.stringify(D.use_cases.filter(u => u.department === 'Guest Experience & Customer Service').map(u => u.id)) && !!(await p.$('#r-use-none')), T + ' owner: then the department\'s use cases, and None of these fits');
    await p.check('#r-use-gx-2');
    const ab = await p.evaluate(() => ({ h: document.getElementById('about-h').textContent, level: document.getElementById('about-level').textContent, links: [...document.querySelectorAll('#srcs a')].map(a => [a.getAttribute('target'), a.getAttribute('rel'), /^https?:/.test(a.href)]), rows: document.querySelectorAll('#srcs li').length, addr: document.querySelectorAll('#srcs .srcurl').length, copy: document.querySelectorAll('#srcs [data-act="copy-src"]').length, dts: [...document.querySelectorAll('#about dt')].map(x => x.textContent) }));
    const C = JSON.parse(await p.evaluate(() => document.getElementById('r3-cat').textContent)).uc['gx-2'];
    ok(ab.h === 'Your choice: ' + D.use_cases.find(u => u.id === 'gx-2').title && JSON.stringify(ab.dts) === JSON.stringify(['Where', 'What it does', 'How the AI works', 'How common in hotels']) && ab.level.startsWith(C.level + ' (') && ab.rows === C.srcs.length && ab.rows > 0, T + ' owner: the chosen use case shows what it does, how the AI works, how common (' + ab.level + ') and ' + ab.rows + ' sources');
    ok(ab.links.length === C.srcs.filter(x => x.url).length && ab.links.every(l => l[0] === '_blank' && l[1] === 'noopener' && l[2]) && ab.addr === ab.links.length && ab.copy === ab.links.length, T + ' owner: each source name is a real link (new tab, noopener) with its address and Copy address');
    await p.click('#srcs [data-act="copy-src"]'); await pause(150);
    ok((await p.evaluate(() => navigator.clipboard.readText())) === C.srcs.find(x => x.url).url && (await p.textContent('#toast')) === 'Copied the address.', T + ' owner: Copy address copies the address');
    ok(await noH(p), T + ' owner: no sideways scroll with the sources open');
    await p.click('#crumb-area');
    ok(!!(await p.$('#dept-tiles')) && (await st(p)).where.area === 'Guest-facing', T + ' owner: the area crumb goes back to the departments');
    await p.click('#crumb-areas');
    ok(!!(await p.$('#area-tiles')) && (await rec3(p)).use === 'gx-2', T + ' owner: All areas goes back to the areas; the choice stays');
    await p.fill('#uc-search', 'energy');
    ok(!(await p.$('#area-tiles')) && (await p.$$('#uc-results input[name="n-use"]')).length > 0, T + ' owner: a search replaces the tiles with matches that can be chosen');
    await p.check('#uc-results input[name="n-use"]'); await p.fill('#uc-search', '');
    const w = (await st(p)).where, cur = (await rec3(p)).use, u = D.use_cases.find(x => x.id === cur);
    ok(u && w.dept === u.department && w.area === AREA[u.department], T + ' owner: after a search pick, clearing the search shows its department');
    ok(p._errs.length === 0, T + ' owner: no page errors ' + p._errs.join(' | '));
    await ctx.close();
  });
  /* council v3.0.1 BUILD NOW 6: the heading shows the outline after a keyboard move only, not after a mouse click */
  await guard('BUILD NOW 6', async () => {
    const { ctx, p } = await mk(b, size);
    await p.click('[data-act="begin"]');
    const mouse = await p.evaluate(() => getComputedStyle(document.getElementById('h')).outlineStyle);
    await p.focus('[data-act="next"]'); await p.keyboard.press('Enter');
    const key = await p.evaluate(() => [document.activeElement.id, getComputedStyle(document.getElementById('h')).outlineStyle]);
    ok(mouse === 'none' && key[0] === 'h' && key[1] === 'solid', T + ' BUILD NOW 6: no outline on the heading after a mouse click (' + mouse + '), an outline after the keyboard (' + key[1] + ')');
    await ctx.close();
  });
}

(async () => {
  const b = await chromium.launch();
  for (const size of [[1280, 800], [360, 740]]) {
    const tag = size[0] + 'px', p0 = pass, f0 = fail;
    if (!/^cleanup/.test(process.env.R3_ONLY || '')) { /* R3_ONLY=cleanup / cleanup2 runs only the v3.0.1 / v3.0.2 block (used to show it fails on the version before) */
    /* 1 + 2 + 3: golden cases through the page */
    for (const n of [1, 2, 9, 10, 14, 15, 19, 28]) {
      const g = G[n - 1], { ctx, p } = await mk(b, size);
      p._shots = [1, 9, 15, 19].includes(n);
      await walk(p, g, n, tag);
      const s = await st(p), m = await p.evaluate(() => window.Readiness3.model());
      ok(s.verdict === g.expected_verdict, tag + ' golden ' + n + ' verdict ' + s.verdict + ' (expected ' + g.expected_verdict + ')');
      if (g.expected_score != null) ok(m.score === g.expected_score && (await p.textContent('#score-val')).trim() === g.expected_score + '%', tag + ' golden ' + n + ' score ' + m.score);
      ok((await p.textContent('#h')).trim() === g.expected_verdict, tag + ' golden ' + n + ' verdict shown as a word');
      ok(p._errs.length === 0 && p._out.length === 0, tag + ' golden ' + n + ': no errors, no outside requests ' + p._errs.concat(p._out).join(' | '));
      if (n === 15) { ok((await p.textContent('#contra-m2')).includes(g.expected_notes[0]), tag + ' golden 15: the contradiction note on the result'); }
      if (n === 19) ok((await p.textContent('#flag')).trim() === D.texts.sensitive_flag, tag + ' golden 19: the sensitive flag verbatim');
      if (n === 19) ok(await p.evaluate(() => { const f = getComputedStyle(document.getElementById('flag')), v = getComputedStyle(document.getElementById('verdict')); return f.backgroundColor !== v.backgroundColor && f.borderLeftColor === getComputedStyle(document.querySelector('.btn.primary') || document.body).backgroundColor; }) || await p.evaluate(() => getComputedStyle(document.getElementById('flag')).backgroundColor !== getComputedStyle(document.getElementById('verdict')).backgroundColor), tag + ' BUILD NOW 5: the flag is in the information style, not the verdict colour');
      if (s.step === 'result' && m.score >= 50 && (s.verdict === 'Not ready' || s.verdict === 'Not enough info')) ok((await p.textContent('#score-why')).trim() === (s.verdict === 'Not ready' ? 'The verdict comes from the questions needed before a pilot, not from the score.' : 'The verdict comes from the Don\'t know yet answers, not from the score.'), tag + ' golden ' + n + ' BUILD NOW 6: the line under a high score');
      if (s.step === 'result' && !(m.score >= 50 && (s.verdict === 'Not ready' || s.verdict === 'Not enough info'))) ok(!(await p.$('#score-why')), tag + ' golden ' + n + ': no score line otherwise');
      if (s.step === 'result') {
        /* §6.4 order */
        const order = await p.evaluate(() => ['verdict', 'reason', 'top3', 'actions', 'areas', 'plan', 'vendor', 'all-qa', 'method', 'score', 'disclaimer'].map(id => { const e = document.getElementById(id); return e ? e.getBoundingClientRect().top + window.scrollY : -1; }));
        ok(order.every((y, i) => y >= 0 && (i === 0 || y >= order[i - 1])), tag + ' golden ' + n + ': result in the §6.4 order ' + order.join(','));
        ok((await p.textContent('#disclaimer')).trim() === D.texts.disclaimer, tag + ' golden ' + n + ': disclaimer verbatim');
      }
      await ctx.close();
    }

    /* 4: Back keeps answers, reload resumes, unanswered note, Start a new check confirmation */
    {
      const { ctx, p } = await mk(b, size);
      await p.click('[data-act="begin"]'); await next(p);
      await pick(p, 's2', 's1', 'yes'); await pick(p, 's2', 's2', 'dk');
      await next(p);
      ok(await p.isVisible('#open-note') && (await p.textContent('#open-note')).includes('3 questions have no answer yet'), tag + ' unanswered note with the count');
      await p.click('[data-act="first-open"]');
      ok(await p.evaluate(() => document.activeElement && document.activeElement.name === 'n-s2-s3'), tag + ' "Go to the first one" focuses question 3');
      await next(p); ok((await st(p)).step === 'must', tag + ' second Next goes on');
      await pick(p, 'mh', 'm2', 'na');
      ok(await p.isVisible('#na-m2') && (await p.textContent('#na-m2')).trim() === D.must_haves[1].na_help, tag + ' m2 offers Doesn\'t apply with its help line');
      ok(!(await p.$('#r-mh-m1-na')) && !!(await p.$('#r-mh-m4-na')), tag + ' only m2 and m4 offer Doesn\'t apply');
      await p.click('[data-act="back"]');
      ok(await p.isChecked('#r-s2-s1-yes') && await p.isChecked('#r-s2-s2-dk'), tag + ' Back keeps answers');
      await p.waitForTimeout(250);
      await p.reload(); await p.waitForFunction(() => window.Readiness3 && window.Readiness3.ready());
      ok((await st(p)).step === 's2' && await p.isChecked('#r-s2-s2-dk'), tag + ' reload resumes on the same step with the answers');
      await p.click('#new-check');
      ok(await p.isVisible('#confirm') && (await p.textContent('#confirm-title')) === 'Start a new check?', tag + ' Start a new check asks first');
      await p.click('[data-act="new-no"]'); ok((await st(p)).step === 's2', tag + ' Cancel keeps the check');
      await p.click('#new-check'); await p.click('[data-act="new-yes"]');
      const s = await st(p); ok(s.step === 'hotel' && !(await p.evaluate(() => Object.keys(window.Readiness3.record().step2).length)), tag + ' a new check starts empty');
      await p.click('[data-act="back"]'); await p.waitForSelector('#mychecks .checks li');
      ok((await p.$$('#mychecks .checks li')).length >= 1, tag + ' the earlier check is listed under Your checks');
      ok(p._errs.length === 0, tag + ' no errors in Back/reload/new ' + p._errs.join(' | '));
      await ctx.close();
    }

    /* contradiction on the gate screen with "Change my answer" (golden 15 inputs) */
    {
      const { ctx, p } = await mk(b, size);
      await p.click('[data-act="begin"]'); await next(p);
      for (const s of D.step2) await pick(p, 's2', s.id, 'yes'); await next(p);
      for (const m of D.must_haves) await pick(p, 'mh', m.id, m.id === 'm2' ? 'na' : 'yes'); await next(p);
      await pickUse(p, 'sm-1'); await next(p);
      ok((await p.$$('#gates-first')).length === 1, tag + ' questions wait for the How it works answers');
      ok((await p.textContent('#hiw-h')).trim() === 'First, how will this tool work in your hotel?', tag + ' step 5 opens with How it works');
      await pick(p, 'gate', 'G_PAID', 'no');
      ok(await p.isVisible('#contra-m2') && (await p.textContent('#contra-m2')).includes(D.must_haves[1].contradiction_note), tag + ' contradiction note right after the gate answer');
      const before = (await st(p)).visible.length;
      await pick(p, 'gate', 'G_PAID', 'yes');
      ok(!(await p.$('#contra-m2')), tag + ' the note goes when the gate agrees');
      await pick(p, 'gate', 'G_LINK', 'no');
      const after = (await st(p)).visible;
      ok(after.every(id => !/\.fi\d|\.te\d/.test(id)), tag + ' Money and Technology questions hidden by the agreeing gates');
      await pick(p, 'gate', 'G_PAID', 'no');
      ok((await st(p)).visible.length > after.length || before > 0, tag + ' gate change recomputes the visible questions');
      await p.click('#contra-m2 [data-act="goto-mh"]');
      ok((await st(p)).step === 'must' && await p.evaluate(() => document.activeElement && document.activeElement.name === 'n-mh-m2'), tag + ' "Change my answer" goes back to must-have 2');
      ok(await p.isVisible('#contra-mh-m2'), tag + ' the note also stands on must-have 2');
      await ctx.close();
    }

    /* 5: keyboard-only run of golden case 1 (desktop and phone) */
    {
      const { ctx, p } = await mk(b, size);
      const kb = p.keyboard;
      async function tabTo(sel, max) { for (let i = 0; i < (max || 200); i++) { await kb.press('Tab'); if (await p.evaluate(s => document.activeElement && document.activeElement.matches(s), sel)) return true; } return false; }
      async function answerGroup(name, key) { // Tab into the group, then arrows to the wanted answer
        ok(await tabTo('input[name="' + name + '"]'), tag + ' keyboard reaches ' + name);
        for (let i = 0; i < 6; i++) { const v = await p.evaluate(() => document.activeElement.value); if (v === key && await p.evaluate(() => document.activeElement.checked)) return; if (v === key) { await kb.press('Space'); return; } await kb.press('ArrowRight'); }
      }
      ok(await tabTo('[data-act="begin"]'), tag + ' keyboard: Start'); await kb.press('Enter');
      ok(await tabTo('[data-act="next"]'), tag + ' keyboard: Next on step 1'); await kb.press('Enter');
      for (const s of D.step2) await answerGroup('n-s2-' + s.id, 'yes');
      ok(await tabTo('[data-act="next"]'), tag + ' keyboard: Next on step 2'); await kb.press('Enter');
      for (const m of D.must_haves) await answerGroup('n-mh-' + m.id, 'yes');
      ok(await tabTo('[data-act="next"]'), tag + ' keyboard: Next on step 3'); await kb.press('Enter');
      /* v3.0.2: area tile → department tile → use case, by keyboard (was a department select) */
      ok(await tabTo('#area-Commercial'), tag + ' keyboard: area tile'); await kb.press('Enter');
      ok(await tabTo('#dept-Revenue_Management'), tag + ' keyboard: department tile'); await kb.press('Enter');
      ok(await tabTo('input[name="n-use"]'), tag + ' keyboard: use-case group'); await kb.press('Space');
      ok((await st(p)).use === 'rm-1', tag + ' keyboard: rm-1 chosen (' + (await st(p)).use + ')');
      ok(await tabTo('[data-act="next"]'), tag + ' keyboard: Next on step 4'); await kb.press('Enter');
      await answerGroup('n-gate-G_ACT', 'suggests');
      for (const id of (await st(p)).visible) await answerGroup('n-q-' + uid(id), 'yes');
      ok(await tabTo('[data-act="next"]', 400), tag + ' keyboard: See the result'); await kb.press('Enter');
      const s = await st(p); ok(s.step === 'result' && s.verdict === 'Ready', tag + ' keyboard-only golden 1: ' + s.verdict);
      ok(await p.evaluate(() => document.activeElement && document.activeElement.id === 'h'), tag + ' focus moves to the verdict heading');
      ok((await p.textContent('#live')).startsWith('Result: Ready.'), tag + ' result announced (aria-live)');
      await ctx.close();
    }

    /* 6: save as file → open; migration; bad file */
    {
      const saved = [];
      const fake = () => { window.__saved = []; window.claude = { use: name => Promise.resolve(name === 'downloads' ? { save: o => { window.__saved.push({ filename: o.filename, kind: typeof o.data === 'string' ? 'text' : Object.prototype.toString.call(o.data), size: typeof o.data === 'string' ? o.data.length : o.data.byteLength, text: typeof o.data === 'string' ? o.data : '' }); return Promise.resolve({ status: 'saved' }); } } : null) }; };
      const { ctx, p } = await mk(b, size, fake);
      const g = G[18];
      await walk(p, g, 19, tag + '-dl'); // golden 19
      await p.click('#save-file'); await p.waitForTimeout(200);
      let got = await p.evaluate(() => window.__saved);
      ok(got.length === 1 && /^Do-you-need-AI_Hotel-Alpenblick_\d{4}-\d{2}-\d{2}\.json$/.test(got[0].filename) && got[0].kind === 'text', tag + ' Save as file through downloads.save ' + JSON.stringify(got.map(x => x.filename)));
      const doc = JSON.parse(got[0].text);
      ok(doc.kind === 'hftp-do-you-need-ai' && doc.v === 4 && doc.rules === '3.0' && doc.savedAt && doc.check && doc.check.use === 'hr-1', tag + ' file shape {kind, v:4, rules:"3.0", savedAt, check}');
      await p.click('#pdf'); await p.waitForTimeout(400);
      got = await p.evaluate(() => window.__saved);
      ok(got.length === 2 && /\.pdf$/.test(got[1].filename) && got[1].size > 5000 && /ArrayBuffer/.test(got[1].kind), tag + ' Download (PDF) through downloads.save (' + (got[1] && got[1].size) + ' bytes)');
      ok(!(await p.$('#copybox')), tag + ' no Copy fallback when downloads work');
      /* open the saved file in a fresh page */
      const c2 = await mk(b, size);
      await c2.p.setInputFiles('#file-in', { name: 'x.json', mimeType: 'application/json', buffer: Buffer.from(got[0].text) });
      await c2.p.waitForTimeout(200);
      const s2 = await st(c2.p); ok(s2.step === 'result' && s2.verdict === 'Almost ready', tag + ' Open a saved file restores the check (' + s2.step + ', ' + s2.verdict + ')');
      await c2.p.click('#new-check'); await c2.p.click('[data-act="new-yes"]'); await c2.p.click('[data-act="back"]');
      await c2.p.setInputFiles('#file-in', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"kind":"other"}') });
      await c2.p.waitForSelector('#file-err');
      ok((await c2.p.textContent('#file-err')).trim() === 'This file isn\'t a saved check from this tool.', tag + ' bad file message');
      /* a readiness-2 v2.7 saved file */
      await c2.p.setInputFiles('#file-in', { name: 'old.json', mimeType: 'application/json', buffer: Buffer.from(FIX('v2.7-file.json')) });
      await c2.p.waitForSelector('#imported');
      const s3 = await st(c2.p), rec = await c2.p.evaluate(() => window.Readiness3.record());
      ok(/^Imported from v2\.6\.1: please answer \d+ new questions?\./.test((await c2.p.textContent('#imported')).trim()), tag + ' import banner: ' + (await c2.p.textContent('#imported')).trim().slice(0, 120));
      ok(rec.step2.s1 === 'yes' && rec.step2.s3 === 'dk' && rec.step2.s5 === 'no' && rec.mh.m2 === 'planned' && rec.mh.m4 === 'dk' && !rec.mh.m11 && rec.use === 'rm-2' && rec.hotel.name === 'Hotel Fixture', tag + ' v2.7 file migrated (q1 turned round, Not sure → Don\'t know yet, must-haves, use case, hotel)');
      ok(s3.step === 'must', tag + ' opens on the first screen with something to answer (' + s3.step + ')');
      ok(c2.p._errs.length === 0 && p._errs.length === 0, tag + ' no errors in files ' + c2.p._errs.concat(p._errs).join(' | '));
      await c2.ctx.close(); await ctx.close();
    }
    /* the readiness-2 browser store, imported once on a first visit */
    {
      const store = JSON.parse(FIX('v2.7-store.json')).store;
      const ctx2 = await b.newContext({ viewport: { width: size[0], height: size[1] } });
      await ctx2.addInitScript(s => { if (!sessionStorage.getItem('x')) { sessionStorage.setItem('x', '1'); localStorage.setItem('hftp-readiness2-v1', s); } }, JSON.stringify(store));
      const p2 = await ctx2.newPage(); await p2.goto(URL); await p2.waitForFunction(() => window.Readiness3 && window.Readiness3.ready());
      const s = await st(p2), rec = await p2.evaluate(() => window.Readiness3.record());
      ok(!!s.imported && rec.use === 'rm-2' && s.step === 'must', tag + ' v2.7 store imported on first visit, opened on must-haves (' + s.step + ')');
      ok(await p2.evaluate(() => localStorage.getItem('hftp-readiness2-v1') !== null && JSON.parse(localStorage.getItem('hftp-readiness2-v1')).v === 3), tag + ' the old store is left as it was');
      await ctx2.close();
    }

    /* Copy the result and Copy for a person through the clipboard: the same text and top 3 as the model (and so the PDF) */
    {
      const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] }, permissions: ['clipboard-read', 'clipboard-write'] });
      const p = await ctx.newPage(); await p.goto(URL); await p.waitForFunction(() => window.Readiness3 && window.Readiness3.ready());
      await walk(p, G[1], 2, tag + '-copy'); // golden 2
      await p.click('#copy'); await p.waitForTimeout(150);
      const clip = await p.evaluate(() => navigator.clipboard.readText()), want = await p.evaluate(() => window.Readiness3.summaryText());
      const top = await p.evaluate(() => window.Readiness3.model().top3.map(a => a.text)), pdfTop = await p.evaluate(() => JSON.stringify(window.Readiness3.pdfModel()));
      ok(clip === want && top.length >= 1 && top.every(t => clip.includes(t) && pdfTop.includes(JSON.stringify(t).slice(1, -1))), tag + ' Copy the result: clipboard = summary text, the same top 3 as the PDF');
      ok((await p.textContent('#toast')).trim() === 'Copied the result.', tag + ' Copy says it copied');
      const owner = await p.getAttribute('[data-act="copy-person"]', 'data-id');
      await p.click('[data-act="copy-person"]'); await p.waitForTimeout(150);
      const pc = await p.evaluate(() => navigator.clipboard.readText()), pw = await p.evaluate(o => window.Readiness3.model().people.find(x => x.key === o).items, owner);
      ok(pw.every(t => pc.includes(t)), tag + ' Copy for a person holds that person\'s actions');
      await ctx.close();
    }

    /* 7: no downloads capability → Copy fallback; PDF failure; 8: storage blocked */
    {
      const { ctx, p } = await mk(b, size);
      await walk(p, G[0], 1, tag + '-nodl');
      await p.click('#pdf'); await p.waitForSelector('#copybox');
      ok((await p.textContent('#copy-msg')).trim() === 'Downloads are not available here. Use Copy instead.' && (await p.inputValue('#copy-text')).includes('Top 3 actions'), tag + ' no capability → Copy fallback with the plan');
      await p.click('[data-act="copy-close"]');
      await p.click('#save-file'); await p.waitForSelector('#copybox');
      const t = await p.inputValue('#copy-text'); ok(JSON.parse(t).v === 4, tag + ' Save as file without the capability → the saved check as text');
      await p.evaluate(() => { window.__j = window.jspdf; window.jspdf = null; });
      await p.click('[data-act="copy-close"]'); await p.click('#pdf'); await p.waitForSelector('#copybox');
      ok((await p.textContent('#copy-msg')).trim() === 'The PDF couldn\'t be made. Use Copy instead.', tag + ' PDF failure message');
      await ctx.close();
    }
    {
      const { ctx, p } = await mk(b, size, () => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
      ok((await st(p)).storage === 'memory' && (await p.textContent('#nostore')).includes('Your answers can\'t be saved in this browser. Use Save as file.'), tag + ' storage blocked → banner');
      await ctx.close();
    }
    /* artifact storage (window.storage) is used first when offered */
    {
      const { ctx, p } = await mk(b, size, () => { const m = {}; window.storage = { get: (k, sh) => (k in m ? Promise.resolve({ key: k, value: m[k] }) : Promise.reject(new Error('missing'))), set: (k, v, sh) => { if (sh !== false) return Promise.reject(new Error('shared')); m[k] = v; return Promise.resolve({ key: k, value: v }); }, delete: k => { delete m[k]; return Promise.resolve(); } }; window.__m = m; });
      ok((await st(p)).storage === 'artifact', tag + ' window.storage used (personal scope)');
      await p.click('[data-act="begin"]'); await next(p); await pick(p, 's2', 's1', 'no'); await p.waitForTimeout(250);
      ok(await p.evaluate(() => Object.keys(window.__m).some(k => /^hftp-readiness3-v1_c_/.test(k)) && JSON.parse(window.__m['hftp-readiness3-v1']).ids.length === 1), tag + ' one record per check under hftp-readiness3-v1');
      await ctx.close();
    }
    }
    if (process.env.R3_ONLY !== 'cleanup2') await cleanup(b, size, tag);
    if (process.env.R3_ONLY !== 'cleanup') await cleanup2(b, size, tag);
    console.log('ui ' + tag + ': ' + (pass - p0) + ' passed, ' + (fail - f0) + ' failed');
  }
  await b.close();
  console.log('ui: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
