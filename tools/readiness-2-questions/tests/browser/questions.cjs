// Browser proof for "Do you need AI?" v2.7.0, updated for v2.8.0 (98 use cases, 743 questions; the Copy fallback is now the always-
// offered Copy buttons with the "blocked" line; sources are left out of the banned-word scan by their [data-sources] container).
// (questions-only, standalone, no legal content). Prompt §7 tests 1 and 7, the owner's
// additions A to D (25 Nov 2026), the migration in a real page, and the screenshots.
//   1. exact questions: for all 99 use cases, step 5 shows exactly the data file's questions (state and DOM: text, why, area, who answers)
//   7. smoke at 1280×800 and 360×740: full runs for rm-1, gx-2 and hr-1 by clicks (all Yes, then one No); Back keeps answers; a reload
//      resumes; Save as file, then open it again; both PDFs are generated (pdftotext: disclaimer in the footer, no AI Act section,
//      0 banned terms); no horizontal scroll at 360 px on any step
//   A. links: the detail layer is this page's own dialog; every source name is <a target="_blank" rel="noopener"> to http(s)
//   B. the step 2 heading reads "Should this problem be solved by AI?" (step title, header line, cover list, result card)
//   C. the result page offers exactly the two report downloads; in the claude.ai viewer (window.claude.use stubbed) they go through the
//      downloads capability; when it resolves null, the Copy fallback opens (plan text; Save as file: the check as JSON)
//   M. migration: a v2.6.1 store under the old key opens with its answers carried, the notice, and focus on the first unanswered question
// Serve tools/ first:  python3 -m http.server 8891 --bind 127.0.0.1   (R2_BASE for another address). Run: node readiness-2-questions/tests/browser/questions.cjs
// Screenshots (deviceScaleFactor 2) to reports/readiness-2-questions-screens/.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8891/';
const URL0 = BASE + 'readiness-2-questions/' + (process.env.R2_PAGE || 'index.html');
const PUBLIC = /^public\//.test(process.env.R2_PAGE || ''); // the public build never uses window.claude: the capability cases check the link route instead // v2.8.1: R2_PAGE=public/index.html runs the public build
const ROOT = path.join(__dirname, '..', '..');
const SHOTS = path.join(ROOT, '..', '..', 'reports', 'readiness-2-questions-screens', 'v28'); // v2.8.0: this run's screenshots, prefix q-
const SHOOT = process.env.SHOTS === '1'; // v2.8.1 (inventory S4): screenshots only with SHOTS=1, so a test run changes no tracked file
if (SHOOT) fs.mkdirSync(SHOTS, { recursive: true });
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'r2q-'));
const Q = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'usecase_questions_only.json'), 'utf8'));
const QU = Object.fromEntries(Q.use_cases.map(u => [u.id, u])), LQ = Q.use_cases.filter(u => !u.removed);
const DISCLAIMER = Q.fixed_texts.disclaimer, FLAG = Q.fixed_texts.sensitive_flag, HEAD2 = 'Should this problem be solved by AI?';
const BANNED = ['AI Act', 'Article', 'Art.', 'Annex', 'high-risk', 'transparency obligation', 'prohibited', 'DPIA', 'GDPR', 'FADP', 'CE mark', 'works council', 'PCI', 'consent', 'legal basis', 'law', 'laws', 'regulation', 'compliance', 'legal', 'not legal advice', 'delete', 'deleted', 'kept for', 'retention', 'regulator', 'ISO', 'regulatory'];
/* v2.8.0 (owner decision 2): the page's text without the source entries ([data-sources] containers) */
const toolText = (p, sel) => p.evaluate(s => { const n = document.querySelector(s || 'body').cloneNode(true); n.querySelectorAll('[data-sources], script, style').forEach(x => x.remove()); n.querySelectorAll('details').forEach(d => { if (!d.open) d.querySelectorAll(':scope > :not(summary)').forEach(x => x.remove()); }); return n.textContent; }, sel);
const bannedHits = t => { t = String(t).split(DISCLAIMER).join(' ').split(FLAG).join(' '); const re = new RegExp('(?<![A-Za-z0-9_])(' + BANNED.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![A-Za-z0-9_])', 'gi'); return t.match(re) || []; };
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const tally = {};
const count = (k, c) => { tally[k] = tally[k] || [0, 0]; tally[k][1]++; if (c) tally[k][0]++; };

async function mk(b, vp, init) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, acceptDownloads: true, hasTouch: vp.width < 500, isMobile: vp.width < 500 });
  if (init) await ctx.addInitScript(init.fn, init.arg);
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') p._errs.push(m.text()); });
  await p.goto(URL0);
  try { await p.waitForSelector(init && init.wait || '#begin', { timeout: 15000 }); } catch (e) { console.log('NO COVER', p._errs, await p.evaluate(() => document.getElementById('app').getAttribute('data-state') + ' ' + location.href)); throw e; }
  return { ctx, p };
}
const st = p => p.evaluate(() => window.Readiness2.state());
const noHScroll = p => p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
const shot = async (p, name) => { if (!SHOOT) return; await p.waitForTimeout(600); return p.screenshot({ path: path.join(SHOTS, 'q-' + name + '.png'), fullPage: false }); };
const pdftext = f => execFileSync('pdftotext', ['-layout', f, '-']).toString();
async function click(p, sel) { await p.locator(sel).first().scrollIntoViewIfNeeded(); await p.locator(sel).first().click(); }
async function answer(p, id, v) { await click(p, 'label[for="a-' + id + '-' + v + '"]'); }

/* A full run by clicks. tailFn(i) gives the answer for step-5 question i. Checks no horizontal scroll on each step (360 px). */
async function run(p, use, tailFn, tag) {
  const scroll = [];
  await click(p, '#begin'); scroll.push(await noHScroll(p));
  await p.selectOption('#h-type', 'independent'); await click(p, '#next'); scroll.push(await noHScroll(p));
  await answer(p, 'q1', 'n'); for (const q of ['q2', 'q3', 'q4', 'q5']) await answer(p, q, 'y'); await click(p, '#next'); scroll.push(await noHScroll(p));
  for (let i = 1; i <= 10; i++) await answer(p, 'm' + i, 'y'); await click(p, '#next'); scroll.push(await noHScroll(p));
  const u = QU[use], dept = use.split('-')[0];
  const cat = await p.evaluate(d => window.Readiness2 && JSON.parse(document.getElementById('r2-data').textContent).cat.depts.find(x => x.id === d).cat, dept);
  await click(p, '#cat-' + cat.toLowerCase().replace(/[^a-z]/g, '')); await click(p, '#dept-' + dept); await p.locator('#u-' + use).check({ force: true }); await click(p, '#next'); scroll.push(await noHScroll(p));
  ok((await st(p)).step === 'tailored', tag + ': on step 5');
  for (let i = 0; i < u.questions.length; i++) await answer(p, u.questions[i].id, tailFn(i));
  await click(p, '#next'); scroll.push(await noHScroll(p));
  ok(scroll.every(Boolean), tag + ': no horizontal scroll on any step (' + scroll.join(',') + ')');
  return st(p);
}

(async () => {
  const b = await chromium.launch();
  /* v2.8.1: never let a test reach the owner's collect address (public build): every request to Apps Script is answered here */
  { const nc = b.newContext.bind(b); b.newContext = async o => { const c = await nc(o); await c.route(/^https:\/\/script\.google(usercontent)?\.com\//, r => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })); return c; }; }
  // ===================== 1. exact questions for all 99 (state and DOM) =====================
  {
    const { ctx, p } = await mk(b, { width: 1280, height: 800 });
    let exact = 0;
    for (const u of LQ) {
      const s = await p.evaluate(use => {
        const R = window.Readiness2, D = JSON.parse(document.getElementById('r2-data').textContent), d = D.cat.depts.find(x => x.uses.some(y => y.id === use));
        R.send('new', { same: false }); R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('next');
        R.send('answer', { id: 'q1', value: 'n' }); ['q2', 'q3', 'q4', 'q5'].forEach(id => R.send('answer', { id, value: 'y' })); R.send('next');
        for (let i = 1; i <= 10; i++) R.send('answer', { id: 'm' + i, value: 'y' }); R.send('next');
        R.send('cat', d.cat); R.send('dept', d.id); R.send('use', use); R.send('next');
        const dom = [...document.querySelectorAll('#view fieldset[data-q]')].map(f => ({ id: f.getAttribute('data-q'), text: f.querySelector('.qtext').textContent, why: f.querySelector('[data-why]').textContent, item: f.querySelector('.itemname').textContent, who: f.getAttribute('data-who'), whyLine: f.querySelector('.whyarea').textContent }));
        const out = { state: R.state(), dom, name: document.getElementById('tail-use').textContent };
        R.send('remove', out.state.id); R.send('remove-yes', out.state.id); // stay under the 50-check cap
        return out;
      }, u.id);
      const want = u.questions.map(q => ({ id: q.id, text: q.text, why: q.why, area: q.area, who: q.who_answers }));
      const sOk = s.state.step === 'tailored' && JSON.stringify(s.state.questions) === JSON.stringify(want);
      const dOk = s.dom.length === want.length && s.dom.every((d, i) => d.id === want[i].id && d.text === want[i].text && d.why === want[i].why && d.item === want[i].area + ' · ' + want[i].who && d.who === want[i].who && d.whyLine === 'Area: ' + want[i].area + '. Who answers: ' + want[i].who + '.');
      ok(sOk, u.id + ': state shows exactly its questions'); ok(dOk, u.id + ': the DOM shows exactly its questions (text, why, area, who answers)');
      const i0 = u.name.indexOf(': '), nm = i0 > 0 ? u.name.slice(0, i0) + u.name.charAt(i0 + 2).toUpperCase() + u.name.slice(i0 + 3) : u.name;
      ok(s.name === nm, u.id + ': the use case is named as in the data file (v2.8.0 B12: a long name as short name + subtitle)');
      if (sOk && dOk) exact++;
    }
    ok(exact === 98, 'exact questions ' + exact + '/98'); count('exact', exact === 98);
    ok(!p._errs.length, 'no page errors (98 use cases): ' + p._errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  // ===================== 7. smoke, desktop and mobile =====================
  for (const [vpName, vp] of [['desktop', { width: 1280, height: 800 }], ['mobile', { width: 360, height: 740 }]]) {
    for (const use of ['rm-1', 'gx-2', 'hr-1']) {
      const { ctx, p } = await mk(b, vp); const tag = vpName + ' ' + use;
      let s = await run(p, use, () => 'y', tag + ' all Yes');
      const wantLevel = QU[use].sensitive ? 'almost' : 'ready';
      let c1 = s.step === 'result' && s.level === wantLevel && s.pct === 100;
      ok(c1, tag + ': all Yes → ' + wantLevel + ' at 100% (got ' + s.level + ' ' + s.pct + ')');
      const flag = await p.locator('#sensitive-flag').count();
      ok((flag === 1) === !!QU[use].sensitive, tag + ': sensitive flag only for a sensitive use case');
      if (QU[use].sensitive) ok((await p.textContent('#box-reason')).trim() === 'Almost ready: everything is in place, but this area needs an adviser’s view first.' && !(await p.locator('#reason').count()), tag + ': the hold is said once, in the verdict box (v2.8.0 B4)');
      // the result page: exactly two downloads (plus Start a new check), disclaimer, no AI Act fold
      const btns = await p.$$eval('#actions button', bs => bs.map(x => x.id));
      ok(JSON.stringify(btns) === JSON.stringify(['pdf', 'pdf-answers', 'new-check']) && !(await p.locator('#actions #save-file').count()), tag + ': result row: Download result (PDF), Download answers (PDF), Start a new check; Save as file is in Your checks');
      ok(await p.locator('#result-disclaimer').isVisible() && (await p.textContent('#result-disclaimer')).trim() === DISCLAIMER, tag + ': the disclaimer on the result');
      ok(!(await p.locator('#legal, #to-register, #share').count()), tag + ': no AI Act fold, register link or share panel');
      ok((await p.textContent('#sum-ai h3')).trim() === HEAD2, tag + ': result card heading (owner B)');
      { const bh = bannedHits(await toolText(p)); ok(bh.length === 0, tag + ': result page text (sources excluded): 0 banned terms ' + bh.join(',')); }
      // Back keeps answers; one No; result again
      await click(p, '#back'); s = await st(p);
      const allY = QU[use].questions.every(q => s.T[q.id] === 'y');
      ok(s.step === 'tailored' && allY, tag + ': Back keeps every answer');
      await answer(p, QU[use].questions[0].id, 'n'); await click(p, '#next'); s = await st(p);
      ok(s.step === 'result' && s.T[QU[use].questions[0].id] === 'n' && s.pct < 100, tag + ': one No → result with a lower score (' + s.level + ' ' + s.pct + ')');
      if (vpName === 'desktop' && use === 'rm-1') {
        // reload resumes
        const id = s.id; await p.reload(); await p.waitForSelector('#result'); const r = await st(p);
        ok(r.step === 'result' && r.id === id && r.T[QU[use].questions[0].id] === 'n', tag + ': a reload resumes on the result');
      }
      // PDFs (plain browser: the blob-link route)
      ok((await st(p)).downloadRoute === 'link', tag + ': outside claude.ai the files download through a link');
      for (const [btn, suffix, kind] of [['#pdf', '_result.pdf', 'result'], ['#pdf-answers', '_answers.pdf', 'answers']]) {
        const [dl] = await Promise.all([p.waitForEvent('download'), click(p, btn)]);
        const f = path.join(TMP, vpName + '-' + use + suffix); await dl.saveAs(f);
        const t = pdftext(f), pages = (t.match(/\f/g) || []).length;
        const tNoSrc = t.split(/Examples and sources \(\d+\)/)[0]; // v2.8.0: the sources section closes the Result PDF and is left out of the scan
        const okPdf = dl.suggestedFilename().endsWith(suffix) && t.includes(DISCLAIMER.slice(0, 40)) && !/EU AI Act|provisional label/i.test(t) && bannedHits(tNoSrc.replace(/\s+/g, ' ')).length === 0;
        ok(okPdf, tag + ': ' + kind + ' PDF generated (' + dl.suggestedFilename() + '), disclaimer in it, no AI Act, 0 banned terms');
        if (kind === 'answers') ok(t.includes(HEAD2), tag + ': the answers PDF carries the new step 2 heading');
        if (QU[use].sensitive && kind === 'result') ok(t.replace(/\s+/g, ' ').includes('This area involves people'), tag + ': the sensitive flag in the result PDF');
        await p.waitForFunction(() => window.Readiness2.state().download === 'idle');
      }
      // save as file, then open it again
      const [dlf] = await Promise.all([p.waitForEvent('download'), click(p, '#save-file')]);
      const ff = path.join(TMP, vpName + '-' + use + '.json'); await dlf.saveAs(ff);
      const doc = JSON.parse(fs.readFileSync(ff, 'utf8'));
      ok(doc.kind === 'hftp-do-you-need-ai' && doc.v === 4 && doc.version === '2.8.1' && doc.check.use === use && bannedHits(JSON.stringify(doc)).length === 0, tag + ': Save as file: a v4 file of this check, 0 banned terms');
      const before = await st(p);
      await click(p, '#new-check'); await click(p, '#new-same'); await p.locator('#file-open').setInputFiles(ff);
      await p.waitForSelector('#import-yes'); await click(p, '#import-yes');
      await p.waitForFunction(id => window.Readiness2.state().id === id, before.id);
      const after = await st(p);
      ok(after.step === 'result' && JSON.stringify(after.T) === JSON.stringify(before.T) && JSON.stringify(after.A) === JSON.stringify(before.A), tag + ': the file opens again with the same answers');
      ok(await noHScroll(p), tag + ': no horizontal scroll on the result');
      ok(!p._errs.length, tag + ': no page errors: ' + p._errs.slice(0, 2).join(' | '));
      count('smoke ' + vpName, c1 && !p._errs.length);
      await ctx.close();
    }
  }
  // ===================== B, A and screenshots =====================
  for (const [vpName, vp] of [['1280', { width: 1280, height: 800 }], ['360', { width: 360, height: 740 }]]) {
    const { ctx, p } = await mk(b, vp);
    ok((await p.textContent('#intro-how .journey li:nth-child(2) b')).trim() === HEAD2, vpName + ': cover list carries the new step 2 heading');
    ok(await p.locator('#cover-disclaimer').isVisible() && (await p.textContent('#cover-disclaimer')).trim() === DISCLAIMER, vpName + ': the disclaimer on the cover');
    await shot(p, 'cover-' + vpName);
    await click(p, '#begin'); await p.selectOption('#h-type', 'independent'); await click(p, '#next');
    ok((await p.textContent('#q-head')).trim() === HEAD2 && (await p.textContent('.hdrline')).includes(HEAD2), vpName + ': step 2 title and header line');
    await shot(p, 'step2-header-' + vpName);
    await answer(p, 'q1', 'n'); for (const q of ['q2', 'q3', 'q4', 'q5']) await answer(p, q, 'y'); await click(p, '#next');
    for (let i = 1; i <= 10; i++) await answer(p, 'm' + i, 'y'); await click(p, '#next');
    await click(p, '#cat-guestfacing'); await click(p, '#dept-gx');
    // A: the detail layer with sources (gx-2)
    await click(p, '#dt-gx-2'); await p.waitForSelector('dialog#detail[open]');
    const links = await p.$$eval('#detail-srcs a', as => as.map(a => ({ href: a.getAttribute('href'), t: a.target, rel: a.rel })));
    ok(links.length > 0 && links.every(l => /^https?:\/\//.test(l.href) && l.t === '_blank' && l.rel === 'noopener'), vpName + ': detail layer: ' + links.length + ' source links, each <a target="_blank" rel="noopener">');
    ok(bannedHits(await toolText(p, '#detail')).length === 0, vpName + ': detail layer text (sources excluded): 0 banned terms');
    await shot(p, 'detail-layer-' + vpName);
    await click(p, '#detail-close');
    await p.locator('#u-gx-2').check({ force: true }); await click(p, '#next');
    await p.locator('#f-gx-2\\.pe1b').scrollIntoViewIfNeeded().catch(() => {});
    await p.evaluate(() => window.scrollTo(0, 0));
    await shot(p, 'step5-' + vpName);
    for (const q of QU['gx-2'].questions) await answer(p, q.id, 'y');
    await click(p, '#next'); await p.waitForSelector('#result'); await p.evaluate(() => window.scrollTo(0, 0));
    await shot(p, 'result-downloads-' + vpName);
    ok(await noHScroll(p), vpName + ': no horizontal scroll on the result');
    ok(!p._errs.length, vpName + ': no page errors: ' + p._errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  // ===================== C. the downloads capability (stubbed window.claude) and the Copy fallback =====================
  const toResult = p => p.evaluate(() => { const R = window.Readiness2; R.send('begin'); R.send('hotel', { k: 'type', v: 'independent' }); R.send('next'); R.send('answer', { id: 'q1', value: 'n' }); ['q2', 'q3', 'q4', 'q5'].forEach(id => R.send('answer', { id, value: 'y' })); R.send('next'); for (let i = 1; i <= 10; i++) if (i !== 5) R.send('answer', { id: 'm' + i, value: 'y' }); R.send('next'); R.send('cat', 'Commercial'); R.send('dept', 'rm'); R.send('use', 'rm-1'); R.send('next'); R.state().tailored.forEach(id => R.send('answer', { id, value: 'y' })); R.send('next'); });
  {
    const { ctx, p } = await mk(b, { width: 1280, height: 800 }, { fn: () => { window.__saved = []; window.claude = { use: name => Promise.resolve(name === 'downloads' ? { save: req => { window.__saved.push({ filename: req.filename, size: req.data && req.data.size, type: Object.prototype.toString.call(req.data) }); return Promise.resolve({ status: 'saved' }); } } : null) }; } });
    await toResult(p);
    if (PUBLIC) { ok((await st(p)).downloadRoute === 'link' && !p._errs.length, 'public build: window.claude is ignored, ordinary downloads'); count('capability', true); await ctx.close(); }
    else {
    ok((await st(p)).downloadRoute === 'capability', 'capability: the viewer route is taken when window.claude.use exists');
    await click(p, '#pdf'); await p.waitForFunction(() => window.__saved.length === 1);
    await p.waitForFunction(() => window.Readiness2.state().download === 'idle');
    await click(p, '#pdf-answers'); await p.waitForFunction(() => window.__saved.length === 2);
    await p.waitForFunction(() => window.Readiness2.state().download === 'idle');
    await click(p, '#save-file'); await p.waitForFunction(() => window.__saved.length === 3);
    const saved = await p.evaluate(() => window.__saved);
    ok(saved[0].filename.endsWith('_result.pdf') && saved[1].filename.endsWith('_answers.pdf') && saved[2].filename.endsWith('.json') && saved.every(x => x.size > 100 && x.type === '[object Blob]'), 'capability: dl.save({ filename, data }) for both PDFs and the file: ' + saved.map(x => x.filename).join(', '));
    count('capability', saved.length === 3);
    ok(!p._errs.length, 'capability: no page errors');
    await ctx.close();
    }
  }
  {
    const { ctx, p } = await mk(b, { width: 1280, height: 800 }, { fn: () => { window.claude = { use: () => Promise.resolve(null) }; try { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('blocked')) } }); } catch (e) {} } });
    await toResult(p);
    if (!PUBLIC) { // the public build has no capability route: the Copy fallback is checked on its own
    await click(p, '#pdf'); await p.waitForSelector('#dl-blocked');
    ok((await p.textContent('#dl-blocked')).trim() === 'Your browser blocked the download. Use Copy or Print instead.', 'null capability: the blocked line (v2.8.0 B1)');
    await p.waitForFunction(() => window.Readiness2.state().download === 'idle'); }
    await click(p, '#copy-plan'); await p.waitForSelector('#copybox[data-from="plan"]');
    const t = await p.inputValue('#copytext');
    ok(/Head of the department using it:|General manager:|Finance:|IT:/.test(t) && t.includes('Questions for the vendor:') && t.includes(DISCLAIMER) && bannedHits(t).length === 0, 'clipboard refused: Copy plan opens the copy box with the plan text');
    await click(p, '#copy-saved'); await p.waitForSelector('#copybox[data-from="saved"]');
    const j = JSON.parse(await p.inputValue('#copytext'));
    ok(j.kind === 'hftp-do-you-need-ai' && j.check.use === 'rm-1' && j.version === '2.8.1', 'clipboard refused: Copy saved check opens the copy box with the check as JSON');
    count('copy fallback', true);
    ok(!p._errs.length, 'copy fallback: no page errors: ' + p._errs.join(' | '));
    await ctx.close();
  }
  // ===================== M. migration: the v2.6.1 store under the old key =====================
  {
    const FX = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'fixtures', 'v2.6.1-store.json'), 'utf8'));
    const { ctx, p } = await mk(b, { width: 1280, height: 800 }, { fn: s => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('hftp-readiness2-v1', s); } }, arg: JSON.stringify(FX.store), wait: '#older-list' });
    const s = await st(p), cur = FX.store.cur;
    const use = FX.store.checks[cur].use, want = QU[use].questions;
    const kept = want.filter(q => q.carry_answer_from && ['y', 'pl', 'n'].includes(FX.store.checks[cur].T[q.carry_answer_from])).length; // v2.7.1: a stored "k" is not an answer
    ok(s.id === cur && s.step === 'tailored' && s.older && s.older.kept === kept && s.older.fresh === want.length - kept, 'old key: the open check migrates, step 5, ' + kept + ' kept, ' + (want.length - kept) + ' new');
    const line = (await p.textContent('#older-list')).replace(/\s*OK$/, '').trim();
    ok(line === 'This check was made with an older question list. ' + (kept === 1 ? '1 answer was' : kept + ' answers were') + ' kept, ' + (want.length - kept === 1 ? '1 question is' : (want.length - kept) + ' questions are') + ' new.', 'the notice: ' + line);
    const first = want.find(q => !s.T[q.id]);
    ok(await p.evaluate(id => document.activeElement && document.activeElement.closest('fieldset') && document.activeElement.closest('fieldset').getAttribute('data-q') === id, first.id), 'focus is on the first unanswered step-5 question (' + first.id + ')');
    await p.waitForTimeout(100);
    ok(await p.evaluate(() => !!localStorage.getItem('hftp-readiness2q-v1') && !!localStorage.getItem('hftp-readiness2-v1')), 'saved under the new key; the old key is left as it was');
    await shot(p, 'migration-notice-1280');
    // the v2.6.1 file
    const FF = path.join(ROOT, 'tests', 'fixtures', 'v2.6.1-file.json'), file = JSON.parse(fs.readFileSync(FF, 'utf8')).file, ftmp = path.join(TMP, 'v261-file.json');
    fs.writeFileSync(ftmp, JSON.stringify(file));
    await p.evaluate(() => window.Readiness2.send('new', { same: false })); await p.waitForSelector('#mychecks'); // v2.8.0: files open from "Your checks" (the cover)
    await p.evaluate(t => window.Readiness2.openFileText(t), JSON.stringify(file));
    if (await p.locator('#import-yes').count()) await click(p, '#import-yes'); // the store above holds the same check: replace it with the file
    await p.waitForFunction(id => window.Readiness2.state().id === id, file.check.id);
    const f = await st(p);
    ok(f.step === 'tailored' && f.older && f.older.kept === 7 && f.older.fresh === 5 && f.T['gx-2.ACT_OFF'] === 'pl' && f.TBy['gx-2.ACT_OFF'] === '2027-04-15', 'v2.6.1 file: opens on step 5, 7 kept, 5 new (v2.7.1: a stored "k" is not kept), dates carried');
    ok(!p._errs.length, 'migration: no page errors: ' + p._errs.join(' | '));
    count('migration', true);
    await ctx.close();
  }
  await b.close();
  console.log('Summary: ' + Object.entries(tally).map(([k, v]) => k + ' ' + v[0] + '/' + v[1]).join(' · '));
  console.log('questions (browser): ' + pass + ' passed, ' + fail + ' failed');
  fs.rmSync(TMP, { recursive: true, force: true });
  if (fail) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
