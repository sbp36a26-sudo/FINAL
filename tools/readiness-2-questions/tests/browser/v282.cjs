// v2.8.2 end-to-end (owner, 26 Nov 2026). Serve tools/ first: python3 -m http.server <port> --bind 127.0.0.1, then
//   R2_BASE=http://127.0.0.1:<port>/ R2_PAGE=public/index.html node readiness-2-questions/tests/browser/v282.cjs
// 1. every use case with all Yes, all No, all Don't know yet and all Planned (steps 2, 3 and 5; question 1 No, or Don't know yet in the
//    Don't-know set): the result page and the use case's side panel are scanned; the sensitive use cases never above "Almost ready";
//    a No in step 2 always says so in the verdict box; repeats; version; hidden text.
// 2. the question 1 stop, driven by clicks; 3. each must-have at No on its own; 4. every screen (cover, steps 1 to 5, stop, data notice);
// 5. "Change answers from the start" opens step 1 with every answer kept; 6. the favicon (no 404).
const { chromium } = require('playwright');
const path = require('path');
const BASE = process.env.R2_BASE || 'http://127.0.0.1:8891/';
const PAGE = process.env.R2_PAGE || 'public/index.html';
const URL0 = BASE + 'readiness-2-questions/' + PAGE;
const ROOT = path.join(__dirname, '..', '..');
let pass = 0, fail = 0; const fails = [];
const ok = (c, n, extra) => { if (c) pass++; else { fail++; if (fails.length < 60) fails.push(n + (extra !== undefined ? '  -> ' + JSON.stringify(extra).slice(0, 400) : '')); } };
const DISC = 'This check does not cover legal requirements. Check those with your adviser before you start.';
const WORDS = ['AI Act', 'GDPR', 'high-risk', 'consent', 'regulator', 'compliance', 'retention', 'DPIA', 'ISO', 'legal', 'law', 'extra rules', 'Held back', 'score', 'abstract only'];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RE = new RegExp('(?<![A-Za-z0-9_])(' + WORDS.map(esc).join('|') + ')(?![A-Za-z0-9_])', 'gi');
/* The tool's own result score ("Score: 75% of points from all questions", "No score yet", the method lines) is the scoring the owner
   keeps unchanged; it is reported apart. Anything else is a hit. */
const OWN_SCORE = /(Score: \d+%|No score (yet|is shown|given)|the score is|the score (is )?below|score of \d+%|a score|share of points|Your points|the score|The score|score cut-offs|0 points each)/i;
function hits(text) {
  const t = String(text).split(DISC).join(' '), out = []; let m; RE.lastIndex = 0;
  while ((m = RE.exec(t))) {
    const ctx = t.slice(Math.max(0, m.index - 60), m.index + 40).replace(/\s+/g, ' ');
    if (/^score$/i.test(m[0]) && OWN_SCORE.test(t.slice(Math.max(0, m.index - 25), m.index + 30))) { ownScore.add(ctx.trim().slice(0, 90)); continue; }
    /* "score" as a thing the AI makes (a risk score, a lead score) in the owner's use-case texts and questions, kept as written; only
       an internal grade ("score 8/10") is a hit */
    if (/^score$/i.test(m[0]) && !/score \d+\/10/i.test(t.slice(m.index, m.index + 14))) { contentScore.add(ctx.trim().slice(0, 90)); continue; }
    out.push(m[0] + ' … ' + ctx);
  }
  return out;
}
const ownScore = new Set(), contentScore = new Set(), srcHits = new Set();
const count = (t, s) => t.split(s).length - 1;

async function visibleText(p, sel) {
  return p.evaluate(s => { const el = document.querySelector(s); return el ? el.innerText : ''; }, sel);
}
/* every text node that is not visible and not inside a closed <details>, a closed <dialog>, a <script>, <style> or <template> */
async function hiddenText(p) {
  return p.evaluate(() => {
    const out = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const t = n.textContent.trim(); if (!t) continue;
      const el = n.parentElement; if (!el || el.closest('script,style,template,noscript,select')) continue; // a closed dropdown's options are a normal collapsed control
      const d = el.closest('details'); if (d && !d.open && !el.closest('summary')) continue;
      const dl = el.closest('dialog'); if (dl && !dl.open) continue;
      const tst = el.closest('#toast'); if (tst) continue; // the toast shows only for a moment
      const r = el.getClientRects(), cs = getComputedStyle(el);
      const vis = r.length && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0 && !(r[0].width <= 1 && r[0].height <= 1);
      if (!vis) out.push(t.slice(0, 80));
    }
    return out;
  });
}

let KEY, V, recs = {}, D, FX;
async function prep() {
  const { load, data, finished } = await import(path.join(ROOT, 'tests', 'load.mjs'));
  process.env.R2_HTML = PAGE;
  const { F, C } = load(); D = data(); KEY = F.KEY; V = F.V;
  const sets = { yes: ['y', 'y', 'y'], no: ['n', 'n', 'n'], dk: ['u', 'k', 'k'], pl: ['pl', 'pl', 'pl'] };
  const uses = D.cat.depts.flatMap(d => d.uses.map(u => u.id));
  uses.forEach(u => Object.entries(sets).forEach(([k, s]) => {
    const r = finished(F, D, u, { id: 'e' + u.replace(/\W/g, '') + k });
    r.hotel.name = 'Hotel Spoonbill';
    r.Q = { q1: k === 'dk' ? 'u' : 'n', q2: s[0], q3: s[0], q4: s[0], q5: s[0] };
    F.MUST_IDS.forEach(id => { r.A[id] = s[1]; });
    D.tq.uses[u].qs.forEach(q => { r.T[q.id] = s[2]; });
    recs[u + ':' + k] = r;
  }));
  FX = { finished, F, C };
  return uses;
}
async function seed(p, rec, step) {
  const r = JSON.parse(JSON.stringify(rec)); if (step) r.step = step;
  await p.evaluate(([k, v]) => { localStorage.clear(); localStorage.setItem(k, v); }, [KEY, JSON.stringify({ v: V, cur: r.id, checks: { [r.id]: r } })]);
  await p.reload(); await p.waitForSelector('#app[data-state]');
}

(async () => {
  const uses = await prep();
  const SENS = Object.keys(D.tq.uses).filter(k => D.tq.uses[k].sensitive);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route(/script\.google\.com/, r => r.fulfill({ status: 200, body: 'ok' })); // nothing reaches the owner's Sheet
  const p = await ctx.newPage(); const errs = [], bad = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
  await p.goto(URL0); await p.waitForSelector('#app[data-state]');
  ok(await p.$eval('link[rel="icon"]', e => !!e.href).catch(() => false), 'favicon: a link rel=icon is in the page');
  ok(!bad.some(x => /favicon/.test(x)), 'favicon: no favicon.ico 404', bad);

  // ---------- 1. every use case × four answer sets ----------
  const level = {}, panelDone = new Set();
  for (const u of uses) for (const k of ['yes', 'no', 'dk', 'pl']) {
    const tag = u + ':' + k;
    await seed(p, recs[tag]);
    const st = await p.evaluate(() => window.Readiness2.state());
    ok(st.step === 'result', tag + ' opens on the result', st.step);
    const all = await p.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('.dsrcs').forEach(x => x.remove()); return document.body.innerText.length ? (function () { const keep = []; document.querySelectorAll('.dsrcs li').forEach(li => { if (li.innerText.trim()) keep.push(li.innerText); }); let t = document.body.innerText; keep.forEach(k => { t = t.split(k).join(' '); }); return t; })() : ''; });
    (await p.$$eval('.dsrcs li', L => L.map(li => li.innerText))).forEach(t => hits(t).forEach(h => srcHits.add(u + ': ' + h.slice(0, 120))));
    const res = await visibleText(p, '#view');
    const h = hits(all); ok(!h.length, tag + ': no listed word on the result page', h.slice(0, 3));
    const lv = await p.$eval('#result', e => e.dataset.level), pct = await p.$eval('#result', e => e.dataset.pct);
    level[tag] = lv;
    if (SENS.includes(u)) ok(lv !== 'ready', tag + ': a sensitive use case is never above Almost ready', lv);
    ok(count(res, 'Define success first.') <= 1, tag + ': "Define success first." at most once', count(res, 'Define success first.'));
    ok(count(res, 'Ask an adviser before a pilot') <= (SENS.includes(u) ? 1 : 0) && (!SENS.includes(u) || count(res, 'Ask an adviser before a pilot') === 1), tag + ': "Ask an adviser before a pilot" once for a sensitive use case, never otherwise', count(res, 'Ask an adviser before a pilot'));
    ok(count(all, DISC) === 1, tag + ': the disclaimer once on the result page', count(all, DISC));
    ok(!/held back/i.test(all), tag + ': no "Held back"');
    ok(/2\.8\.2/.test(await p.textContent('#foot-version')), tag + ': version 2.8.2 in the footer');
    ok((await p.textContent('#hdr')).includes('Hotel Spoonbill'), tag + ': the hotel name in the result header');
    if (k === 'no') {
      const box = await p.$eval('#result', e => e.innerText);
      ok(/Step 2 suggests this may not be worth doing with AI \(Return: No/.test(box), tag + ': a No in step 2 is said in the verdict box', box.slice(0, 300));
    }
    const hid = await hiddenText(p); ok(!hid.length, tag + ': no hidden text on the result page', hid.slice(0, 5));
    if (!panelDone.has(u)) { // the side panel (detail layer), once per use case
      panelDone.add(u);
      await p.click('#dr-' + u); await p.waitForSelector('dialog#detail[open]');
      const srcT = await p.$$eval('dialog#detail .dsrcs li', L => L.map(li => li.innerText));
      srcT.forEach(t => hits(t).forEach(h => srcHits.add(u + ': ' + h.slice(0, 120))));
      let dt = await visibleText(p, 'dialog#detail'); srcT.filter(k => k.trim()).forEach(k => { dt = dt.split(k).join(' '); });
      const hd = hits(dt); ok(!hd.length, u + ': no listed word in the side panel', hd.slice(0, 3));
      ok(!/score \d+\/10|abstract only|below credibility|credib/i.test(dt), u + ': no internal grading in the side panel');
      const links = await p.$$eval('dialog#detail .dsrcs li', L => L.map(li => ({ n: li.querySelectorAll('a').length, t: li.innerText })));
      ok(links.every(x => x.n <= 1), u + ': at most one link per source', links.filter(x => x.n > 1).slice(0, 2));
      ok(links.every(x => !/https?:\/\/\S{60,}/.test(x.t)), u + ': no long address printed', links.filter(x => /https?:\/\/\S{60,}/.test(x.t)).slice(0, 2));
      const hd2 = await hiddenText(p); ok(!hd2.length, u + ': no hidden text with the side panel open', hd2.slice(0, 5));
      await p.keyboard.press('Escape');
    }
  }
  const sensAbove = SENS.filter(u => ['yes', 'no', 'dk', 'pl'].some(k => level[u + ':' + k] === 'ready'));
  ok(!sensAbove.length, 'no sensitive use case reaches "Ready to start a pilot"', sensAbove);
  console.log('levels (all Yes):', Object.entries(level).filter(([t]) => t.endsWith(':yes')).reduce((a, [, v]) => (a[v] = (a[v] || 0) + 1, a), {}),
    '· sensitive all Yes:', SENS.map(u => u + '=' + level[u + ':yes']).join(' '));

  // ---------- 2. the question 1 stop (clicks) ----------
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForSelector('#app[data-state]');
  await p.click('#begin'); await p.selectOption('#h-type', 'independent'); await p.fill('#h-name', 'Hotel Heron'); await p.dispatchEvent('#h-name', 'input');
  const s1 = await visibleText(p, 'body'); ok(!hits(s1).length, 'step 1: no listed word', hits(s1)); ok(!(await hiddenText(p)).length, 'step 1: no hidden text', await hiddenText(p));
  await p.click('#next');
  const q1opts = await p.$$eval('#f-q1 .opt', L => L.map(x => x.innerText.trim())), q2opts = await p.$$eval('#f-q2 .opt', L => L.map(x => x.innerText.trim()));
  ok(JSON.stringify(q1opts) === JSON.stringify(['Yes', 'No', 'Don’t know yet']), 'question 1 offers Yes / No / Don’t know yet', q1opts);
  ok(JSON.stringify(q2opts) === JSON.stringify(['Yes', 'Planned', 'No', 'Don’t know yet']), 'questions 2 to 5 offer Yes / Planned / No / Don’t know yet', q2opts);
  const s2 = await visibleText(p, 'body'); ok(!hits(s2).length && !/Not sure/.test(s2), 'step 2: no listed word, no "Not sure"', hits(s2));
  await p.click('label[for="a-q1-y"]'); await p.waitForTimeout(150);
  let st = await p.evaluate(() => window.Readiness2.state());
  if (st.step !== 'stop') { await p.click('#next').catch(() => {}); await p.waitForTimeout(150); st = await p.evaluate(() => window.Readiness2.state()); }
  ok(st.step === 'stop', 'question 1 Yes stops the check', st.step);
  const stopT = await visibleText(p, 'body'); ok(!hits(stopT).length, 'stop screen: no listed word', hits(stopT)); ok(!(await hiddenText(p)).length, 'stop screen: no hidden text', await hiddenText(p));
  ok(/This is not suitable for AI\./.test(stopT), 'stop screen headline');

  // ---------- 3. each must-have at No on its own ----------
  for (const m of FX.F.MUST_IDS) {
    const r = JSON.parse(JSON.stringify(recs['fo-1:yes'])); r.id = 'mno' + m; r.A[m] = 'n';
    await seed(p, r);
    const lv = await p.$eval('#result', e => e.dataset.level), box = await p.$eval('#result', e => e.innerText);
    ok(lv === 'notready', m + ' No alone: Not ready yet', lv);
    ok(/1 must-have is No/.test(box), m + ' No alone: the verdict box says why', box.slice(0, 200));
  }

  // ---------- 4. every screen: steps 3, 4, 5 of a check, the cover, the data notice ----------
  for (const step of ['must', 'where', 'tailored']) {
    await seed(p, recs['hr-1:yes'], step);
    const t = await visibleText(p, 'body'); ok(!hits(t).length, 'step ' + step + ': no listed word', hits(t).slice(0, 3));
    ok(!/Not sure|Planned, not done yet/.test(t), 'step ' + step + ': old answer words gone');
    ok(!(await hiddenText(p)).length, 'step ' + step + ': no hidden text', (await hiddenText(p)).slice(0, 4));
    if (step !== 'where') { const o = await p.$$eval('.qa .opts', L => L.map(x => Array.from(x.querySelectorAll('.opt')).map(o => o.innerText.trim()).join('/'))); ok(o.length && o.every(x => x === 'Yes/Planned/No/Don’t know yet'), 'step ' + step + ': four answers on every question', o.slice(0, 2)); }
    if (step === 'must') { const intro = await p.textContent('#must-intro'); ok(/how many of the 90 use cases your team analysed \(out of 98 in this tool\) need it/.test(intro), 'step 3 count line', intro); }
    if (step === 'tailored') { // open each fold once so its text is scanned too
      await p.$$eval('details', L => L.forEach(d => { d.open = true; }));
      const t2 = await visibleText(p, 'body'); ok(!hits(t2).length, 'step 5 with every fold open: no listed word', hits(t2).slice(0, 3));
    }
  }
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForSelector('#app[data-state]');
  const cov = await visibleText(p, 'body'); ok(!hits(cov).length, 'cover: no listed word', hits(cov)); ok(count(cov, DISC) === 1, 'cover: the disclaimer once', count(cov, DISC));
  ok(!(await hiddenText(p)).length, 'cover: no hidden text', await hiddenText(p));
  const more = await p.$('[data-act="data-more"], #data-more, button:has-text("What is sent, and why")');
  if (more) { await more.click(); await p.waitForTimeout(200); const dn = await visibleText(p, 'body'); ok(!hits(dn).length, 'data notice: no listed word', hits(dn)); }
  else ok(false, 'data notice button found');

  // ---------- 5. Change answers from the start ----------
  await seed(p, recs['gx-1:yes']);
  await p.click('#edit'); await p.waitForTimeout(200);
  st = await p.evaluate(() => window.Readiness2.state());
  ok(st.step === 'hotel', '"Change answers from the start" opens step 1', st.step);
  ok(st.hotel.name === 'Hotel Spoonbill' && st.Q.q2 === 'y', 'with every answer kept', st);
  for (let i = 0; i < 4; i++) { await p.click('#next'); await p.waitForTimeout(120); }
  st = await p.evaluate(() => window.Readiness2.state());
  ok(st.step === 'tailored' || st.step === 'result', 'Next carries on through the kept answers', st.step);

  ok(!errs.length, 'no page error', errs.slice(0, 3));
  await b.close();
  console.log('source entries carrying a listed word (catalogue text, shown as given):', [...srcHits]);
  console.log('"score" as a use-case word (owner texts, kept):', [...contentScore].slice(0, 12));
  console.log('own result score wording seen (kept, it is the tool\'s scoring):', [...ownScore].slice(0, 6));
  fails.forEach(f => console.log('FAIL  ' + f));
  console.log('v282 e2e: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
