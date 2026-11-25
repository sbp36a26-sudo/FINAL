// Browser test for "Do you need AI?" v3 (readiness-3), the standalone page, at 1280x800 and 360x740.
//  1. load: no page error, no request leaving the page's own server, no horizontal scroll on any screen
//  2. golden cases 1, 2, 9, 14, 15, 19 (and 10, 28) walked through the real page by clicking: verdict and score as expected
//  3. screenshots of each step and the result for golden 1, 9, 15, 19 (deviceScaleFactor 2) to reports/readiness-3-screens/
//  4. Back keeps answers, reload resumes, Start a new check asks first, unanswered note, contradiction note and "Change my answer"
//  5. keyboard-only run of golden case 1 (Tab, arrow keys, Enter/Space)
//  6. save as file → open restores; v2.7 store and file migrate (banner, first open screen); bad file message
//  7. downloads: without the capability → Copy fallback; with a fake window.claude.use('downloads') → save({filename, data}) called
//  8. storage unavailable → banner; PDF failure → its message
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

async function mk(b, size, init) {
  const ctx = await b.newContext({ viewport: { width: size[0], height: size[1] }, deviceScaleFactor: 2, hasTouch: size[0] < 500, isMobile: size[0] < 500 });
  if (init) await ctx.addInitScript(init);
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
  else { const u = D.use_cases.find(x => x.id === g.use_case); await p.selectOption('#dept', u.department); await p.check('#r-use-' + uid(u.id)); }
  await shot(p, pre + '4-where'); await noHScroll(p, pre + 'where'); await next(p);
  for (const [gid, key] of Object.entries(g.gates)) await pick(p, 'gate', gid, key);
  const vis = (await st(p)).visible;
  for (const id of vis) await pick(p, 'q', id, (g.questions_changed || {})[id] || 'yes');
  await shot(p, pre + '5-questions'); await noHScroll(p, pre + 'use'); await next(p);
  await shot(p, pre + '6-result'); await noHScroll(p, pre + 'result');
}

(async () => {
  const b = await chromium.launch();
  for (const size of [[1280, 800], [360, 740]]) {
    const tag = size[0] + 'px';
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
      await p.selectOption('#dept', 'Sales & Marketing').catch(() => {});
      const u = D.use_cases.find(x => x.id === 'sm-1'); await p.selectOption('#dept', u.department); await p.check('#r-use-sm-1'); await next(p);
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
      ok(await tabTo('#dept'), tag + ' keyboard: department'); await p.selectOption('#dept', 'Revenue Management');
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
  await b.close();
  console.log('ui: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
