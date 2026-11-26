// Browser proof for v2.8.0 (prompt CLAUDE_PROMPT_v2.8.md §6.7 and Part 2; owner decisions of 25 Nov 2026), at 1280×800 and 360×740:
//   hr-1 all Yes (the hold shown once); rm-2 mostly No; a stop at step 2 on Q1; the Copy and Print fallbacks; "Start a new check"
//   offers the same-hotel choice; 3 checks survive a reload; B2 and B5 on the page; the sources inside the use case (step 5, the
//   detail layer, the result), with labels; 0 banned words and 0 "Don't know" in the tool's own text ([data-sources] left out);
//   no horizontal scroll at 360 px; the v2.7 store and an lg-2 file open. Screenshots (deviceScaleFactor 2) to
//   reports/readiness-2-questions-screens/v28/.
// Serve tools/ first:  python3 -m http.server <port> --bind 127.0.0.1, then R2_BASE=http://127.0.0.1:<port>/ node readiness-2-questions/tests/browser/v28.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8891/';
const URL0 = BASE + 'readiness-2-questions/' + (process.env.R2_PAGE || 'index.html'); // v2.8.1: R2_PAGE=public/index.html runs the public build
const ROOT = path.join(__dirname, '..', '..');
const SHOTS = path.join(ROOT, '..', '..', 'reports', 'readiness-2-questions-screens', 'v28');
const SHOOT = process.env.SHOTS === '1'; // v2.8.1 (inventory S4): screenshots only with SHOTS=1, so a test run changes no tracked file
if (SHOOT) fs.mkdirSync(SHOTS, { recursive: true });
const Q = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'usecase_questions_only.json'), 'utf8'));
const QU = Object.fromEntries(Q.use_cases.map(u => [u.id, u]));
const DISCLAIMER = Q.fixed_texts.disclaimer, FLAG = Q.fixed_texts.sensitive_flag, HOLD = Q.fixed_texts.sensitive_hold_reason;
const BANNED = ['AI Act', 'Article', 'Art.', 'Annex', 'high-risk', 'transparency obligation', 'prohibited', 'DPIA', 'GDPR', 'FADP', 'CE mark', 'works council', 'PCI', 'consent', 'legal basis', 'law', 'laws', 'regulation', 'compliance', 'legal', 'not legal advice', 'delete', 'deleted', 'kept for', 'retention', 'regulator', 'ISO', 'regulatory'];
const bannedHits = t => { t = String(t).split(DISCLAIMER).join(' ').split(FLAG).join(' '); const re = new RegExp('(?<![A-Za-z0-9_])(' + BANNED.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![A-Za-z0-9_])', 'gi'); return t.match(re) || []; };
const DONTKNOW = /don[’']t know/i;
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const seen = { texts: 0, banned: [], dontknow: [] };

async function mk(b, vp, init) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: vp.width < 500, isMobile: vp.width < 500 });
  await ctx.addInitScript(() => { window.__clip = []; try { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: t => { window.__clip.push(t); return Promise.resolve(); } } }); } catch (e) {} });
  if (init) await ctx.addInitScript(init.fn, init.arg);
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') p._errs.push(m.text()); });
  await p.goto(URL0);
  await p.waitForSelector(init && init.wait || '#begin', { timeout: 15000 });
  return { ctx, p };
}
const st = p => p.evaluate(() => window.Readiness2.state());
const noHScroll = p => p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
const shot = async (p, name, full) => { if (!SHOOT) return; await p.waitForTimeout(500); return p.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: !!full }); };
async function click(p, sel) { await p.locator(sel).first().scrollIntoViewIfNeeded(); await p.locator(sel).first().click(); }
async function answer(p, id, v) { await click(p, 'label[for="a-' + id + '-' + v + '"]'); }
/* the tool's own text on screen: open parts only, the source entries ([data-sources]) left out (owner decision 2) */
const toolText = (p, sel) => p.evaluate(s => { const n = document.querySelector(s || 'body').cloneNode(true); n.querySelectorAll('[data-sources]').forEach(x => x.remove()); n.querySelectorAll('details').forEach(d => { if (!d.open) d.querySelectorAll(':scope > :not(summary)').forEach(x => x.remove()); }); n.querySelectorAll('script').forEach(x => x.remove()); return n.textContent; }, sel);
/* every text the page holds now, folds included (closed ones too), sources left out */
const allText = p => p.evaluate(() => { const n = document.body.cloneNode(true); n.querySelectorAll('[data-sources], script').forEach(x => x.remove()); return n.textContent; });
async function scan(p, tag) {
  const t = await allText(p); seen.texts++;
  const h = bannedHits(t); if (h.length) seen.banned.push(tag + ': ' + h.slice(0, 3).join(', '));
  if (DONTKNOW.test(t)) seen.dontknow.push(tag);
}
async function hscroll(p, vp, tag) {
  if (vp.width >= 500) return;
  const good = await noHScroll(p);
  const why = good ? '' : JSON.stringify(await p.evaluate(() => { const W = document.documentElement.clientWidth, o = []; document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.right > W + 1 && r.width) o.push(e.tagName + '#' + e.id + '.' + String(e.className).slice(0, 30) + ' ' + Math.round(r.right) + ' ' + (e.textContent || '').slice(0, 40)); }); return o.slice(0, 5); }));
  ok(good, tag + ': no horizontal scroll at 360 px ' + why);
}

/* By clicks: cover → step 1 (hotel name) → step 2 → step 3 → step 4 (use) → step 5 → result. o: { name, q: {q1..q5}, must: i → answer, tail: i → answer } */
async function run(p, vp, use, o, tag) {
  await click(p, '#begin'); await scan(p, tag + ' step1'); await hscroll(p, vp, tag + ' step 1');
  await p.selectOption('#h-type', 'independent'); if (o.name) await p.fill('#h-name', o.name);
  await click(p, '#next'); await hscroll(p, vp, tag + ' step 2');
  const q = Object.assign({ q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }, o.q || {});
  for (const k of ['q1', 'q2', 'q3', 'q4', 'q5']) await answer(p, k, q[k]);
  await scan(p, tag + ' step2');
  await click(p, '#next');
  if (q.q1 === 'y') return st(p);
  for (let i = 1; i <= 10; i++) await answer(p, 'm' + i, o.must ? o.must(i) : 'y');
  await scan(p, tag + ' step3'); await hscroll(p, vp, tag + ' step 3');
  await click(p, '#next');
  const dept = use.split('-')[0], cat = await p.evaluate(d => JSON.parse(document.getElementById('r2-data').textContent).cat.depts.find(x => x.id === d).cat, dept);
  await click(p, '#cat-' + cat.toLowerCase().replace(/[^a-z]/g, '')); await click(p, '#dept-' + dept); await p.locator('#u-' + use).check({ force: true });
  await scan(p, tag + ' step4'); await hscroll(p, vp, tag + ' step 4');
  await click(p, '#next');
  const qs = QU[use].questions;
  for (let i = 0; i < qs.length; i++) await answer(p, qs[i].id, o.tail ? o.tail(i) : 'y');
  await scan(p, tag + ' step5'); await hscroll(p, vp, tag + ' step 5');
  await click(p, '#next'); await p.waitForSelector('#result');
  await scan(p, tag + ' result'); await hscroll(p, vp, tag + ' result');
  return st(p);
}

(async () => {
  const b = await chromium.launch();
  for (const [vn, vp] of [['1280', { width: 1280, height: 800 }], ['360', { width: 360, height: 740 }]]) {
    // ---------- hr-1 all Yes: the hold shown once (B4), B3, B5 ----------
    {
      const { ctx, p } = await mk(b, vp); const tag = vn + ' hr-1';
      await scan(p, tag + ' cover');
      ok((await p.textContent('#foot-version')).includes('Version v2.8.1 (rules unchanged since v2.6).'), tag + ': the footer shows the version');
      const s = await run(p, vp, 'hr-1', { name: 'Hotel Alpha' }, tag);
      ok(s.step === 'result' && s.level === 'almost' && s.pct === 100 && JSON.stringify(s.held) === '["sensitive"]', tag + ': all Yes → Almost ready at 100%, held (sensitive)');
      const t = await toolText(p, '#view');
      const n = (x) => t.split(x).length - 1;
      ok(n('Almost ready: everything is in place, but this area needs an adviser’s view first.') === 1 && n(FLAG) === 1 && n(HOLD) === 0 && (await p.locator('#sensitive-flag').count()) === 1, tag + ': the hold once in the verdict box, the flag box once, the hold text nowhere else');
      ok((await p.textContent('#first ol li:first-child')).startsWith('General manager: Ask an adviser before a pilot') && (await p.textContent('#nothing-else')).trim() === 'Nothing else to fix.', tag + ': action 1 "Ask an adviser before a pilot" (GM); "Nothing else to fix."');
      const order = await p.evaluate(() => { const r = document.getElementById('result'), a = r.querySelector('#must-line'), b2 = r.querySelector('#score'); return !!(a && b2 && (a.compareDocumentPosition(b2) & Node.DOCUMENT_POSITION_FOLLOWING) && a.querySelector('strong')); });
      ok(order && /^Score: 100% of points from all questions$/.test((await p.textContent('#score')).trim()), tag + ': must-haves line first, in bold; "Score: 100% of points from all questions" (B3)');
      ok((await p.getAttribute('#ai-rows li[data-q="q1"]', 'data-cond')) === 'Met' && (await p.textContent('#ai-rows li[data-q="q1"] .chip')).trim() === 'Met' && (await p.textContent('#ai-rows li[data-q="q1"] .youranswer')).trim() === 'Your answer: No', tag + ': Q1 = No shows Met, with "Your answer: No" underneath (B5)');
      await p.evaluate(() => window.scrollTo(0, 0)); await shot(p, 'result-hr1-all-yes-' + vn);
      ok(!p._errs.length, tag + ': no page errors: ' + p._errs.slice(0, 2).join(' | '));
      await ctx.close();
    }
    // ---------- rm-2 mostly No ----------
    {
      const { ctx, p } = await mk(b, vp); const tag = vn + ' rm-2';
      const s = await run(p, vp, 'rm-2', { name: 'Hotel Beta', must: i => (i <= 7 ? 'n' : i === 8 ? 'pl' : 'y'), tail: i => (i < 6 ? 'n' : i === 6 ? 'pl' : 'y') }, tag);
      ok(s.step === 'result' && s.level === 'notready', tag + ': mostly No → Not ready yet (' + s.level + ' ' + s.pct + ')');
      const plan = await p.$$eval('#plan .todo li > span:first-child', xs => xs.map(x => x.textContent));
      ok(plan.length > 10 && plan.every(x => !/\?$/.test(x) && !/^Make this a Yes/.test(x) && !/^Finish: .*\?/.test(x)), tag + ': the action plan reads as actions (' + plan.length + ' items; none ends with "?", no "Make this a Yes:")');
      const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'actions_questions_only.json'), 'utf8')).actions, strip = a => { a = a.replace(/^(GM|Department head|Finance|IT|Owner): /, ''); return a.charAt(0).toUpperCase() + a.slice(1); };
      ok(QU['rm-2'].questions.slice(0, 6).every(q => plan.includes(strip(acts[q.id]))), tag + ': each No step-5 question shows its action text');
      ok(/^0 of 10 must-haves in place|^\d+ of 10 must-haves in place/.test((await p.textContent('#must-line')).trim()), tag + ': must-haves line');
      await p.evaluate(() => window.scrollTo(0, 0)); await shot(p, 'result-rm2-mostly-no-' + vn);
      await p.locator('#plan').scrollIntoViewIfNeeded(); await shot(p, 'action-plan-rm2-' + vn);
      ok(!p._errs.length, tag + ': no page errors: ' + p._errs.slice(0, 2).join(' | '));
      await ctx.close();
    }
    // ---------- B2: a step-2 No with everything else Yes; sources on step 5, the detail layer and the result ----------
    {
      const { ctx, p } = await mk(b, vp); const tag = vn + ' gx-2 B2';
      await click(p, '#begin'); await p.selectOption('#h-type', 'group'); await click(p, '#next');
      for (const k of ['q1', 'q2', 'q3', 'q4', 'q5']) await answer(p, k, k === 'q1' ? 'n' : k === 'q2' ? 'n' : 'y');
      ok(!(await p.locator('#crisp').count()) && !/C-R-I-S-P/.test(await p.textContent('#view')) && (await p.textContent('#q-names')).trim() === 'Needs judgement · Return · Information to learn from · Safety net · Proof', tag + ': step 2 without C-R-I-S-P, the five plain names (B10)');
      await p.evaluate(() => window.scrollTo(0, 0)); await shot(p, 'step2-' + vn);
      await click(p, '#next'); for (let i = 1; i <= 10; i++) await answer(p, 'm' + i, 'y'); await click(p, '#next');
      await click(p, '#cat-guestfacing'); await click(p, '#dept-gx');
      await click(p, '#dt-gx-2'); await p.waitForSelector('dialog#detail[open]');
      const D = await p.evaluate(() => JSON.parse(document.getElementById('r2-data').textContent).detail['gx-2']);
      const rows = await p.$$eval('#detail [data-sources] li', ls => ls.map(l => ({ badges: [...l.querySelectorAll('.badge')].map(x => x.textContent), href: (l.querySelector('a') || {}).href || '', t: l.target })));
      ok(rows.length === D.srcs.length && rows.every(r => /^https:\/\//.test(r.href) && r.badges.length >= 1 && /^(Credible \(7\+\)|Below 7|Not scored)$/.test(r.badges[0])), tag + ': detail layer: ' + rows.length + ' sources, each labelled, each an https link');
      ok((await p.textContent('#detail h3')).trim() === 'Examples and sources (' + D.srcs.length + ')' && (await p.locator('#detail .thin').count()) === (D.thin ? 1 : 0), tag + ': the count and the thin line match the data');
      await shot(p, 'detail-layer-sources-' + vn);
      await click(p, '#detail-close');
      await p.locator('#u-gx-2').check({ force: true }); await click(p, '#next');
      ok((await p.textContent('#tail-sources summary')).trim() === 'Examples and sources (' + D.srcs.length + ')', tag + ': step 5 has the use case\'s "Examples and sources" box');
      await click(p, '#tail-sources summary'); await p.locator('#tail-sources').scrollIntoViewIfNeeded();
      ok((await p.$$eval('#tail-sources [data-sources] li', ls => ls.length)) === D.srcs.length, tag + ': step 5 box lists every source');
      await shot(p, 'step5-sources-' + vn);
      for (const q of QU['gx-2'].questions) await answer(p, q.id, 'y');
      await click(p, '#next'); await p.waitForSelector('#result');
      const also = (await p.textContent('#also-step2')).trim();
      ok(also === 'Also: the first questions suggest this may not be worth doing with AI (Return: No).' && (await st(p)).level === 'almost', tag + ': step-2 No with everything else Yes → Almost ready and the "Also" line (B2)');
      ok((await p.textContent('#first ol li:first-child')).startsWith('General manager: Settle this first: in step 2 you answered No to “Return”.'), tag + ': and it is the first action');
      ok((await p.getAttribute('#ai-rows li[data-q="q2"]', 'data-cond')) === 'Not met', tag + ': Q2 No shows Not met (B5)');
      ok((await p.textContent('#sum-where summary')).trim() === 'Examples and sources (' + D.srcs.length + ')', tag + ': the result page has the box too');
      await p.evaluate(() => window.scrollTo(0, 0)); await shot(p, 'result-also-step2-' + vn);
      await scan(p, tag + ' result');
      ok(!p._errs.length, tag + ': no page errors: ' + p._errs.slice(0, 2).join(' | '));
      await ctx.close();
    }
    // ---------- stop at step 2 on Q1 ----------
    {
      const { ctx, p } = await mk(b, vp); const tag = vn + ' stop';
      const s = await run(p, vp, 'gx-2', { name: 'Hotel Gamma', q: { q1: 'y' } }, tag);
      ok(s.step === 'stop' && (await p.textContent('#stop-head')).trim() === 'This is not suitable for AI.', tag + ': Q1 Yes stops at step 2');
      ok(await p.locator('#copy-saved').isVisible() && await p.locator('#print-open').isVisible(), tag + ': the stop screen offers Copy saved check and Open printable page');
      await scan(p, tag); await hscroll(p, vp, tag);
      await shot(p, 'stop-' + vn);
      await p.goto(URL0); await p.waitForSelector('#stopcard'); await p.evaluate(() => window.Readiness2.send('new', { same: false })); await p.waitForSelector('#mychecks');
      { const mc = await p.textContent('#mychecks'); ok(mc.includes('Hotel Gamma · Not suitable for AI · ') && (mc.match(/Stopped at step 2/g) || []).length === 1, tag + ': the saved check is named "Not suitable for AI", its status "Stopped at step 2" (v2.8.1, inventory L8)'); }
      await ctx.close();
    }
    // ---------- Copy and Print fallbacks; Start a new check (same hotel); 3 checks survive a reload ----------
    {
      const { ctx, p } = await mk(b, vp); const tag = vn + ' fallbacks';
      await run(p, vp, 'fo-4', { name: 'Hotel One' }, tag + ' check 1');
      await click(p, '#copy-plan'); await p.waitForFunction(() => window.__clip.length === 1);
      const plan = await p.evaluate(() => window.__clip[0]);
      ok(plan.startsWith('Can AI solve your problems? · ') && plan.includes(DISCLAIMER) && !DONTKNOW.test(plan) && bannedHits(plan).length === 0, tag + ': Copy plan puts the plan text on the clipboard');
      await click(p, '#copy-saved'); await p.waitForFunction(() => window.__clip.length === 2);
      const saved = JSON.parse(await p.evaluate(() => window.__clip[1]));
      ok(saved.kind === 'hftp-do-you-need-ai' && saved.version === '2.8.1' && saved.check.use === 'fo-4', tag + ': Copy saved check puts the check (JSON, version 2.8.0) on the clipboard');
      await click(p, '#print-open'); await p.waitForSelector('#printbar');
      ok(await p.evaluate(() => document.getElementById('app').classList.contains('printview')) && !(await p.locator('#actions').isVisible()) && await p.evaluate(() => document.querySelector('#answers').open && document.querySelector('#how').open), tag + ': Open printable page: the print view (actions hidden, every fold open)');
      ok((await p.textContent('#printbar')).includes('press Ctrl+P (Cmd+P on a Mac)'), tag + ': it tells the person to press Ctrl+P');
      await p.evaluate(() => window.scrollTo(0, 0)); await shot(p, 'print-view-' + vn);
      await p.emulateMedia({ media: 'print' }); ok(!(await p.locator('#printbar').isVisible()), tag + ': the bar is not printed'); await p.emulateMedia({ media: 'screen' });
      await click(p, '#print-off'); ok(!(await p.evaluate(() => document.getElementById('app').classList.contains('printview'))), tag + ': back to the page');
      // Start a new check: same hotel or a different one
      await click(p, '#new-check'); await p.waitForSelector('[data-confirm="new"]');
      ok((await p.textContent('[data-confirm="new"] p')).trim() === 'Start a new check: same hotel (Hotel One) or a different hotel?' && (await p.textContent('#new-same')).trim() === 'Same hotel (Hotel One)', tag + ': "Start a new check" asks "same hotel (Hotel One) or a different hotel?" (B6)');
      await p.evaluate(() => window.scrollTo(0, 0)); await shot(p, 'new-check-question-' + vn);
      await click(p, '#new-same'); let s = await st(p);
      ok(s.step === 'start' && s.hotel.name === 'Hotel One' && s.hotel.type === 'independent' && !Object.keys(s.Q).length && !s.use, tag + ': same hotel keeps step 1 only');
      await click(p, '#begin'); await click(p, '#next');
      for (const k of ['q1', 'q2', 'q3', 'q4', 'q5']) await answer(p, k, k === 'q1' ? 'n' : 'y');
      await click(p, '#next'); await click(p, '#new-top'); await click(p, '#new-other'); s = await st(p);
      ok(!s.hotel.name && !s.hotel.type, tag + ': a different hotel starts blank');
      await click(p, '#begin'); await p.selectOption('#h-type', 'managed'); await p.fill('#h-name', 'Hotel Three'); await click(p, '#next'); await answer(p, 'q1', 'n');
      // reload: all 3 checks are listed
      await p.reload(); await p.waitForSelector('#app[data-state="q"]');
      const ids = (await st(p)).checks;
      ok(ids.length === 3, tag + ': 3 checks, reload, all 3 are still listed (' + ids.length + ')');
      await p.evaluate(() => window.Readiness2.send('new', { same: false })); await p.waitForSelector('#mychecks');
      await p.evaluate(() => window.scrollTo(0, 0));
      if (await p.locator('#mychecks').count()) {
        const t = await p.textContent('#mychecks');
        ok(t.includes('Hotel One · ' + QU['fo-4'].name.split(': ')[0]) && t.includes('Not finished: step 2') && t.includes('Hotel Three · No use case chosen yet · ') && (await p.$$eval('#mychecks .mycheck', x => x.length)) === 3, tag + ': names "<hotel> · <use case> · <date>"; unfinished "Not finished: step N"');
        await p.locator('#mychecks').scrollIntoViewIfNeeded(); await shot(p, 'your-checks-' + vn);
      } else ok(false, tag + ': Your checks list on the cover');
      ok(!p._errs.length, tag + ': no page errors: ' + p._errs.slice(0, 2).join(' | '));
      await ctx.close();
    }
  }
  // ---------- downloads blocked (capability null): the line ----------
  {
    const { ctx, p } = await mk(b, { width: 1280, height: 800 }, { fn: () => { window.claude = { use: () => Promise.resolve(null) }; } });
    await run(p, { width: 1280, height: 800 }, 'rm-1', { name: 'Hotel Delta' }, 'blocked');
    await click(p, '#pdf'); await p.waitForSelector('#dl-blocked');
    ok((await p.textContent('#dl-blocked')).trim() === 'Your browser blocked the download. Use Copy or Print instead.', 'blocked: "Your browser blocked the download. Use Copy or Print instead."');
    await p.locator('#actions').scrollIntoViewIfNeeded(); await shot(p, 'download-blocked-1280');
    await ctx.close();
  }
  // ---------- migration in the page: the v2.7 store, an lg-2 file ----------
  {
    const S7 = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'fixtures', 'v2.7-store.json'), 'utf8'));
    const st7 = JSON.parse(JSON.stringify(S7.store)); st7.cur = S7.seen['me-4'].id;
    const { ctx, p } = await mk(b, { width: 1280, height: 800 }, { fn: s => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('hftp-readiness2q-v1', s); } }, arg: JSON.stringify(st7), wait: '#older-list' });
    const s = await st(p);
    ok(s.id === S7.seen['me-4'].id && s.step === 'tailored' && s.older && s.older.fresh === 3, 'v2.7 store: me-4 opens on step 5 with "N kept, 3 new"');
    ok(/^This check was made with an older question list\. \d+ answers were kept, 3 questions are new\.$/.test((await p.textContent('#older-list')).replace(/\s*OK$/, '').trim()), 'v2.7 store: the notice');
    await p.evaluate(() => window.scrollTo(0, 0)); await shot(p, 'migration-v27-1280');
    const G7 = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'fixtures', 'v2.7-lg2-file.json'), 'utf8')).file;
    await p.evaluate(() => window.Readiness2.send('new', { same: false })); await p.waitForSelector('#mychecks'); // files are opened from "Your checks"
    const r7 = await p.evaluate(t => window.Readiness2.openFileText(t), JSON.stringify(G7));
    await p.waitForTimeout(300);
    if (await p.locator('#import-yes').count()) await click(p, '#import-yes');
    else console.log('lg-2 open:', r7, JSON.stringify((await st(p)).confirm));
    await p.waitForFunction(id => window.Readiness2.state().id === id, G7.check.id);
    const g = await st(p);
    ok(g.use === 'none' && g.step === 'result' && (await p.textContent('#use-removed')).startsWith('This use case is no longer in the list. The check carries on as “None of these fits”.'), 'lg-2 file: "This use case is no longer in the list", carries on as None fits');
    await p.evaluate(() => window.scrollTo(0, 0)); await shot(p, 'lg2-removed-1280');
    ok(!p._errs.length, 'migration: no page errors: ' + p._errs.join(' | '));
    await ctx.close();
  }
  await b.close();
  ok(seen.banned.length === 0, 'banned words in the tool\'s own text on every screen visited (' + seen.texts + ' screens, sources left out): ' + seen.banned.slice(0, 3).join(' | '));
  ok(seen.dontknow.length === 0, '"Don\'t know" nowhere in the tool\'s text on ' + seen.texts + ' screens: ' + seen.dontknow.join(' | '));
  console.log('v28 (browser): ' + pass + ' passed, ' + fail + ' failed');
  if (fail) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
