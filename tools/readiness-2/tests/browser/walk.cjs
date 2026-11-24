// Browser proof for "Do you need AI?" v2 (desktop 1280 + phone 390; standalone and inside the hub).
// Serve tools/ first:  python3 -m http.server 8815 --bind 127.0.0.1   (R2_BASE sets another address)
// Screenshots go to R2_SHOTS (default ./shots). Run:  node tools/readiness-2/tests/browser/walk.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = process.env.R2_SHOTS || path.join(__dirname, 'shots'), BASE = process.env.R2_BASE || 'http://127.0.0.1:8815/';
const ROOT = process.env.R2_ROOT || path.join(__dirname, '..', '..', '..'); // tools/
fs.mkdirSync(OUT, { recursive: true });
let pass = 0, fail = 0; const fails = [];
const ok = (c, n) => { if (c) pass++; else { fail++; fails.push(n); console.log('FAIL  ' + n); } };
const KEY = 'hftp-readiness2-v1';
async function mk(b, w, touch, opt) {
  opt = opt || {};
  const ctx = await b.newContext({ viewport: { width: w, height: touch ? 844 : 900 }, hasTouch: touch, isMobile: touch, acceptDownloads: true });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  if (opt.init) await ctx.addInitScript(opt.init);
  const p = await ctx.newPage(); p._errs = [];
  p.on('pageerror', e => p._errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) p._errs.push(m.text()); });
  return { ctx, p };
}
const SEL = '#app button, #app label.opt, #app .tile, #app summary, #app a.btn, #app input[type=date], #app label.uc, #app select, #app input[type=text], #app label.filebtn, #app label.chk';
const noH = f => f.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
const small = f => f.evaluate(sel => [...document.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 43.5; }).map(e => (e.id || e.textContent.trim().slice(0, 30)) + ':' + Math.round(e.getBoundingClientRect().height)), SEL);
const state = f => f.evaluate(() => window.Readiness2.state());
async function check(f, tag) { ok(await noH(f), tag + ': no horizontal scroll'); const s = await small(f); ok(s.length === 0, tag + ': 44 px targets ' + s.join(', ')); }
async function shot(p, name, f) {
  if (f && f !== p) { // inside the hub: the frame's own height
    const h = await f.evaluate(() => document.documentElement.scrollHeight); const vp = p.viewportSize();
    await p.setViewportSize({ width: vp.width, height: Math.min(h + 120, 7000) }); await p.screenshot({ path: `${OUT}/${name}.png` }); await p.setViewportSize(vp);
  } else await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
}
const click = (f, sel) => f.click(sel);
const answer = async (f, id, v) => { await f.click(`label[for="a-${id}-${v}"]`); };
const MUST = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10'];
const AREA = { rm: 'Commercial', res: 'Commercial', sm: 'Commercial', fo: 'Guest-facing', gx: 'Guest-facing', fb: 'Guest-facing', hk: 'Operational', me: 'Operational', kc: 'Operational', pr: 'Operational', fa: 'Administrative', hr: 'Administrative', gm: 'Administrative', it: 'Administrative', lg: 'Administrative' };

/* One full walk. f: the page or the hub's frame. plan: { use, hotel, Q, must, tail, by } */
async function walk(p, f, tag, plan, shots) {
  const S = async (n) => { if (shots) await shot(p, tag + '-' + n, f); };
  let s = await state(f);
  ok(s.step === 'start', tag + ': starts on the cover');
  ok((await f.textContent('#honest')).includes('Nobody checks your answers. An answer that isn’t true only hides a problem you will meet later.'), tag + ': honesty line on the cover');
  const cover = await f.textContent('#view');
  ok(/Why this tool/.test(cover) && /How to use it/.test(cover) && /What you get/.test(cover) && /A verdict and a score: one of four verdicts, and the share of points from your own answers/.test(cover) && !/readiness score|every AI project|Six to ten/.test(cover) && /Six to nine questions on what this use needs/.test(cover) && /Ten things to have in place before an AI project starts/.test(cover) && /About your hotel/.test(cover) && /Must-haves/.test(cover) && /Questions for this use case/.test(cover), tag + ': cover has the three panels, the five steps and "a verdict and a score" (v2.1 copy)');
  ok(/99 use cases in 15 departments/.test(cover), tag + ': counts on the cover');
  await check(f, tag + ' cover'); await S('0-cover');
  await click(f, '#begin');
  ok((await f.getAttribute('#app', 'data-state')) === 'hotel', tag + ': step 1 About your hotel');
  // required field
  if (!(await state(f)).hotel.type) { await click(f, '#next'); s = await state(f); ok(s.step === 'hotel' && s.missing === 'type' && await f.isVisible('#box-type .needline'), tag + ': Next without "how the hotel is run" is refused and points at it'); }
  const tops = await f.evaluate(() => [...document.querySelectorAll('.formgrid > .fld')].map(e => Math.round(e.getBoundingClientRect().top)));
  if ((await f.evaluate(() => innerWidth)) >= 1000) ok(tops.length === 4 && new Set(tops).size === 1, tag + ': the four hotel fields sit in one row ' + tops);
  await f.selectOption('#h-type', plan.hotel.type); await f.fill('#h-name', plan.hotel.name); await f.selectOption('#h-role', plan.hotel.role); await f.selectOption('#h-country', plan.hotel.country);
  s = await state(f); ok(s.hotel.type === plan.hotel.type && s.hotel.name === plan.hotel.name && s.hotel.country === plan.hotel.country, tag + ': hotel details kept');
  const prof = await f.evaluate(() => JSON.parse(localStorage.getItem('hftp-hotel-profile-v1') || 'null'));
  ok(prof && prof.name === plan.hotel.name && prof.type === plan.hotel.type && (plan.hotel.country === 'Other' ? !prof.country : typeof prof.country === 'string' && prof.country.length === 2) && prof.from === 'readiness', tag + ': the shared hotel profile is written (name, type, country code) as the readiness check did');
  await check(f, tag + ' hotel'); await S('1-hotel');
  await click(f, '#next');
  ok((await f.getAttribute('#app', 'data-state')) === 'q', tag + ': step 2');
  ok((await f.textContent('#crisp')) === 'C-R-I-S-P' && /Complex judgement · Return · Information ready · Safety net · Proof/.test((await f.textContent('.crisp-key')).replace(/\s+/g, ' ')), tag + ': C-R-I-S-P header and key');
  ok((await f.$$eval('.qa .qtext', e => e.map(x => x.textContent))).join('|') === ['Is this task too varied for fixed rules (if this, then that)?', 'Is this task frequent or costly enough to be worth improving?', 'Is the information it needs digital and up to date?', 'Can mistakes be caught before they harm anyone?', 'Can you name the number that should improve, and today’s figure?'].join('|'), tag + ': the five questions as worded');
  ok((await f.$$('details[data-fold^="why-"]')).length === 5 && (await f.$$('details[data-fold^="why-"][open]')).length === 0, tag + ': five "Why this matters" folds, closed: only the question shows');
  await click(f, 'details[data-fold="why-q1"] > summary');
  ok(await f.isVisible('#whyshort-q1') && await f.isVisible('#yes-q1') && await f.isVisible('#no-q1') && await f.isVisible('#guard-q1') && (await f.textContent('#yes-q1 .yn-head')) === 'Answer Yes if' && (await f.textContent('#no-q1 .yn-head')) === 'Answer No if', tag + ': Why this matters: one-line reason, Yes and No boxes with examples, "Not sure?" on Q1');
  if ((await f.evaluate(() => innerWidth)) >= 700) { const b = await f.evaluate(() => [document.querySelector('#yes-q1').getBoundingClientRect(), document.querySelector('#no-q1').getBoundingClientRect()].map(r => [Math.round(r.top), Math.round(r.left)])); ok(b[0][0] === b[1][0] && b[0][1] < b[1][1], tag + ': Yes and No side by side'); }
  ok(!(await f.$('#guard-q2')), tag + ': no "Not sure?" box on Q2');
  await click(f, '#next'); s = await state(f); ok(s.step === 'q' && s.missing === 'q1', tag + ': Next with nothing answered is refused');
  for (const [i, v] of plan.Q.entries()) await answer(f, 'q' + (i + 1), v);
  await check(f, tag + ' q'); await S('2-questions');
  await click(f, '#next');
  ok((await f.getAttribute('#app', 'data-state')) === 'must', tag + ': step 3 Must-haves');
  ok((await f.$$('#view fieldset.qa')).length === 10 && (await f.textContent('#honest')).includes('Nobody checks your answers.'), tag + ': ten must-haves, honesty line on the step');
  ok((await f.$$eval('#f-m1 .opts label', e => e.map(x => x.textContent))).join('|') === 'Yes|Planned, not done yet|Partly|No|Don’t know yet', tag + ': the readiness check\'s answer scale');
  ok((await f.$$('details[data-fold^="why-m"][open]')).length === 0, tag + ': must-have folds closed');
  await click(f, 'details[data-fold="why-m1"] > summary');
  const why1 = await f.textContent('details[data-fold="why-m1"]');
  ok(/needed for 90 of 90 use cases in the team’s resource analysis, Nov 2026/.test(why1) && /team judgement, not a survey/.test(why1) && /NIST AI Risk Management Framework 1\.0/.test(why1) && /What counts as Yes/.test(why1), tag + ': m1 why: share from the workbook, labelled, and the sourced evidence');
  await click(f, 'details[data-fold="why-m4"] > summary');
  ok((await f.textContent('#ex-m4')).startsWith('For example: your PMS (booking system), POS (tills), accounting or HR systems.') && /Eurostat, ICT usage survey, early 2025/.test(await f.textContent('details[data-fold="why-m4"]')) && /Base: EU accommodation enterprises/.test(await f.textContent('details[data-fold="why-m4"]')), tag + ': m4: generic systems examples before the department is known; figure with source and base');
  await click(f, '#next'); s = await state(f); ok(s.step === 'must' && s.missing === 'm1' && await f.isVisible('#f-m1 .needline'), tag + ': Next with must-haves unanswered is refused');
  for (const [i, v] of plan.must.entries()) await answer(f, MUST[i], v);
  if (plan.by) { for (const [id, d] of Object.entries(plan.by)) if (/^m/.test(id)) { await f.fill('#by-' + id, d); await f.dispatchEvent('#by-' + id, 'change'); } }
  s = await state(f); ok(s.ctx.mustDone, tag + ': every must-have answered');
  await check(f, tag + ' must'); await S('3-must-haves');
  await click(f, '#next');
  ok((await f.getAttribute('#app', 'data-state')) === 'where', tag + ': step 4');
  if (plan.use === 'none') { await click(f, '#cat-operational'); await click(f, 'label[for="u-none"]'); ok((await f.textContent('#next')) === 'See the result', tag + ': "None of these fits" → the button reads "See the result"'); await S('4-where-none'); await click(f, '#next'); }
  else {
    const dept = plan.use.split('-')[0];
    await click(f, `[data-cat="${AREA[dept]}"]`); await click(f, '#dept-' + dept);
    ok(await f.isVisible(`label[for="u-${plan.use}"]`), tag + ': the use case is offered');
    await click(f, `label[for="u-${plan.use}"]`);
    await check(f, tag + ' where'); await S('4-where');
    await click(f, '#next');
    ok((await f.getAttribute('#app', 'data-state')) === 'tailored', tag + ': step 5 Questions for this use case');
    s = await state(f);
    const qs = await f.$$eval('#view fieldset.qa .qtext', e => e.map(x => x.textContent));
    ok(qs.length === s.tailored.length && qs.length >= 6 && qs.length <= 10 && qs.every(q => /\?$/.test(q) && q.split(/\s+/).length <= 30), tag + ': ' + qs.length + ' tailored questions, each one sentence of at most 30 words');
    ok((await f.$$('details[data-fold^="why-"][open]')).length === 0, tag + ': tailored folds closed');
    const first = s.tailored[0];
    await click(f, `details[data-fold="why-${first}"] > summary`);
    const w = await f.textContent(`details[data-fold="why-${first}"]`);
    ok(/Area: People\./.test(w) && /Resource intensity \(team judgement, not evidence-based\): (Light|Moderate|Heavy): /.test(w) && /(Based on \d+ entr(y|ies) in the team’s research record \(not yet published\)\.|The team’s judgement from the catalogue description; no source entry\.|Evidence: team draft)/.test(w) && !/[A-Z]{3}-\d{3}-\d{2}|evidence pack/.test(w), tag + ': tailored why: area, intensity with its definition, a plain evidence line without ids (v2.1)');
    if (plan.draft) ok(await f.isVisible('#draft-note') && /Draft questions: team to review/.test(await f.textContent('#draft-note')) && /Evidence: team draft/.test(w), tag + ': draft use case is marked "Draft questions: team to review"');
    else ok(!(await f.$('#draft-note')), tag + ': no draft note');
    if (plan.addon) { ok(await f.isVisible('#f-' + plan.addon), tag + ': the add-on question ' + plan.addon); if (plan.addon === 'x-sens') { ok((await f.textContent('#t-x-sens')) === 'Has a data protection impact assessment (DPIA) been done for this tool?' && (await f.$$eval('#f-x-sens .opts label', e => e.map(x => x.textContent))).includes('Checked: not required (confirmed in writing)'), tag + ': DPIA question with the neutral wording and its "not required" answer'); } }
    ok((await f.$$eval('#f-' + first + ' .opts label', e => e.map(x => x.textContent))).join('|') === 'Yes|Planned, not done yet|Partly|No|Don’t know yet|Doesn’t apply', tag + ': tailored scale adds "Doesn\'t apply"');
    await click(f, '#next'); s = await state(f); ok(s.step === 'tailored' && s.missing === first, tag + ': Next with tailored questions unanswered is refused');
    for (const [i, id] of s.tailored.entries()) await answer(f, id, plan.tail[i] || 'y');
    await check(f, tag + ' tailored'); await S('5-tailored');
    await click(f, '#next');
  }
  s = await state(f);
  ok(s.step === 'result' && (await f.getAttribute('#app', 'data-state')) === 'result', tag + ': result');
  ok(s.level === plan.level, tag + ': verdict ' + plan.level + ' (got ' + s.level + ', ' + s.pct + '%)');
  const m = await f.evaluate(() => window.Readiness2.resultModel());
  ok((await f.textContent('#level-name')) === m.levelName && (await f.textContent('#score')) === m.scoreHead && (await f.textContent('#score-sub')) === m.scoreSub, tag + ': verdict, "' + m.scoreHead + '" and its base on the screen');
  ok((s.level === 'noinfo' ? m.scoreHead === 'No score yet: you answered ' + s.counts.known + ' of ' + s.counts.total + ' questions.' : m.scoreHead === 'Score: ' + s.pct + '%' && /^\d+ of \d+ points on /.test(m.scoreSub)) && m.scoreSub.endsWith('Your own answers; nobody checked them. The cut-offs are the team’s judgement, not tested with hotels.') && !/% ready/.test(await f.textContent('#view')), tag + ': score wording (v2.1: "Score: n%" or "No score yet", never "% ready")');
  ok((await f.textContent('#reason')) === m.reason && /^Because /.test(m.reason), tag + ': the reason stands under the verdict: ' + m.reason);
  const sr = await f.evaluate(() => { const a = document.querySelector('#score').getBoundingClientRect(), b = document.querySelector('#score-sub').getBoundingClientRect(); return [a.bottom, b.top, a.right, b.left, b.bottom - a.top]; });
  ok(sr[4] < ((await f.evaluate(() => innerWidth)) < 700 ? 230 : 140), tag + ': the points and the caveat sit right next to the score (' + Math.round(sr[4]) + ' px)');
  ok((await f.$$eval('#actions > *', e => e.map(x => x.id))).includes('new-check') && (await f.$$eval('#actions > *', e => e.map(x => x.id))).slice(0, 4).join() === 'pdf,copy,print,save-file', tag + ': top action row with Start a new check');
  ok((await f.$$('#areas .brow')).length === m.areas.length && (await f.textContent('#areas .brow[data-area="must"]')).includes('Must-haves'), tag + ': score per area bars');
  ok((await f.$$('#first li')).length === m.first.length && (await f.textContent('#first h2')) === m.firstLabel, tag + ': ' + m.firstLabel);
  ok((await f.$$('#plan .person')).length === m.people.length && (await f.$$('#plan [data-act="copy-who"]')).length === m.people.length, tag + ': action plan by person with a copy button each');
  ok((await f.textContent('#ai-head')) === m.ai.head && (await f.textContent('#path')) === m.path, tag + ': the AI-problem verdict and where it sits');
  if (plan.use === 'none') { ok(await f.isVisible('#must-only') && /must-haves only/.test(await f.textContent('#must-only')) && !(await f.$('#to-register')) && !(await f.$('#legal')), tag + ': none: result says it rests on the must-haves only; no register button, no label'); }
  else {
    ok((await f.$$('#vendor-list li')).length === m.vendor.length && m.vendor.length >= 4, tag + ': vendor questions');
    ok(/provisional/i.test(await f.textContent('#legal summary')) && /not legal advice/i.test(await f.textContent('#legal')) && (await f.textContent('#legal-label')) === m.legal.name, tag + ': provisional AI Act label "' + m.legal.name + '", not legal advice');
    ok((await f.getAttribute('#to-register', 'href')).startsWith('../register/index.html#add=' + plan.use + '&name='), tag + ': Add to the AI Register link');
  }
  if (plan.draft) ok(/Draft questions: team to review/.test(await f.textContent('#draft')), tag + ': draft said on the result');
  ok((await f.$$('#method li')).length === m.method.length && /Cut-offs:/.test(await f.textContent('#how')), tag + ': how this was worked out');
  ok(await f.isVisible('#mychecks') && s.checks.length >= 1 && s.snaps === 1, tag + ': Your checks list; one snapshot taken');
  // the PDF words equal the screen's
  const pm = await f.evaluate(() => window.Readiness2.pdfModel().blocks.map(b => [b.t, b.sub, b.check, b.answer].filter(Boolean).join(' | ')).join('\n'));
  const scr = await f.evaluate(() => ({ level: document.querySelector('#level-name').textContent, score: document.querySelector('#score').textContent, sub: document.querySelector('#score-sub').textContent, line: document.querySelector('#level-line').textContent, must: document.querySelector('#must-line').textContent,
    first: [...document.querySelectorAll('#first li')].map(li => li.childNodes[0].textContent + li.childNodes[1].textContent), todo: [...document.querySelectorAll('#plan ul.todo li span:first-child')].map(x => x.textContent), areas: [...document.querySelectorAll('#areas .brow')].map(x => x.querySelector('.lbl').textContent + ': ' + x.querySelector('.pct').textContent), method: [...document.querySelectorAll('#method li')].map(x => x.textContent) }));
  ok(pm.includes(scr.level + ' · ' + scr.score) && pm.includes(scr.sub) && pm.includes(scr.line) && pm.includes(scr.must) && scr.first.every(t => pm.includes(t)) && scr.todo.every(t => pm.includes(t)) && scr.method.every(t => pm.includes(t)) && scr.areas.every(t => t.endsWith('–') || pm.includes(t.replace(/%$/, '% ·'))), tag + ': the PDF carries the screen\'s words (verdict, score, base, first three, plan, areas, method)');
  for (const k of ['vendor', 'legal', 'answers', 'method']) { const d = await f.$(`details[data-fold="${k}"] > summary`); if (d) await d.click(); }
  await check(f, tag + ' result'); await S('6-result');
  ok(p._errs.length === 0, tag + ': no console errors ' + p._errs.slice(0, 2).join(' | '));
  return s;
}

const PLANS = {
  chat: { use: 'gx-2', addon: 'x-auto', hotel: { type: 'independent', name: 'Hotel Alpenblick', role: 'gm', country: 'Austria' }, Q: ['y', 'y', 'y', 'n', 'u'],
    must: ['y', 'y', 'pl', 'y', 'k', 'y', 'p', 'y', 'n', 'y'], by: { m3: '2027-01-15' }, tail: ['y', 'k', 'y', 'y', 'p', 'y', 'na', 'y'], level: 'notready' },
  hr: { use: 'hr-2', addon: 'x-sens', hotel: { type: 'group', name: 'Meridian Hotels', role: 'owner', country: 'France' }, Q: ['y', 'y', 'y', 'y', 'y'],
    must: ['y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y'], tail: ['y', 'y', 'y', 'y', 'y', 'y', 'pl'], level: 'almost' }, // v2.1 (B5): a high-risk use never gets the top verdict here
  draft: { use: 'fo-8', draft: true, hotel: { type: 'managed', name: 'Seehotel Bellevue', role: 'dept', country: 'Switzerland' }, Q: ['u', 'y', 'y', 'y', 'y'],
    must: ['y', 'y', 'p', 'y', 'y', 'pl', 'y', 'y', 'y', 'y'], tail: ['y', 'p', 'y', 'y', 'n', 'y'], level: 'almost' },
  none: { use: 'none', hotel: { type: 'independent', name: 'Pension Aurora', role: 'other', country: 'Other' }, Q: ['y', 'y', 'y', 'y', 'y'],
    must: ['k', 'k', 'k', 'k', 'k', 'k', 'y', 'y', 'y', 'y'], level: 'noinfo' }
};
async function hubFrame(p, tool) { await p.waitForSelector(`#hubFrame iframe[title="${tool}"]`); const h = await p.$(`#hubFrame iframe[title="${tool}"]`); const f = await h.contentFrame(); await f.waitForFunction(() => window.Readiness2 || window.Register || window.ReadinessTeam || document.readyState === 'complete'); return f; }
async function openHubTool(p) { await p.goto(BASE + 'index.html'); await p.click('#hubBar button[data-tool="readiness-2"]'); const f = await hubFrame(p, 'readiness-2'); await f.waitForFunction(() => window.Readiness2 && window.Readiness2.state().inHub === true, null, { timeout: 15000 }); return f; }

(async () => {
  const b = await chromium.launch({ args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessRespectPreflightResults'] });
  const only = process.env.R2_ONLY || '';
  for (const [w, touch, wtag] of [[1280, false, 'desktop'], [390, true, 'phone']]) {
    if (only && only !== wtag) continue;
    // ---------- standalone: three full walks + none ----------
    for (const k of ['chat', 'hr', 'draft', 'none']) {
      const { ctx, p } = await mk(b, w, touch); await p.goto(BASE + 'readiness-2/index.html');
      await walk(p, p, wtag + '-' + k, PLANS[k], true);
      if (k === 'chat') {
        // reload on the result, then Back / forward
        await p.reload(); let s = await state(p); ok(s.step === 'result' && s.snaps === 1 && s.level === 'notready', wtag + ': reload on the result stays there, no second snapshot');
        await p.goBack(); s = await state(p); ok(s.step === 'tailored', wtag + ': browser Back from the result → tailored');
        await p.goBack(); ok((await state(p)).step === 'where', wtag + ': browser Back → where');
        await p.goForward(); await p.goForward(); ok((await state(p)).step === 'result', wtag + ': browser Forward twice → result');
        await p.click('#back'); ok((await state(p)).step === 'tailored', wtag + ': in-app Back → tailored');
        await p.reload(); s = await state(p); ok(s.step === 'tailored' && Object.keys(s.T).length === 8, wtag + ': reload mid-flow keeps the step and the answers');
        // change an answer, return: since last time
        await answer(p, 'sk1', 'y'); await p.click('#next'); s = await state(p);
        ok(s.step === 'result' && s.snaps === 2 && await p.isVisible('#since') && /Since last time/.test(await p.textContent('#since')) && /Questions you answered: 15 of 17 → 16 of 17\./.test(await p.textContent('#since')), wtag + ': return visit shows "since last time"');
        await shot(p, wtag + '-chat-7-since');
        // copy summary and copy per person
        await p.click('#copy'); await p.waitForTimeout(150);
        let clip = await p.evaluate(() => navigator.clipboard.readText()).catch(() => '');
        ok(clip.startsWith('Do you need AI? Result for Hotel Alpenblick') && /Not ready yet · Score: \d+%\nBecause 1 must-have is missing: Rules for staff on AI tools\. A missing must-have outweighs the score\.\n\d+ of 34 points on 17 questions: 16 answered, 1 “Don’t know yet” \(0 points each\)\./.test(clip) && !/% ready/.test(clip) && /Action plan by person:/.test(clip), wtag + ': Copy summary');
        const who = await p.getAttribute('#plan [data-act="copy-who"]', 'data-who'); await p.click('#plan [data-act="copy-who"]'); await p.waitForTimeout(150);
        clip = await p.evaluate(() => navigator.clipboard.readText()).catch(() => '');
        ok(/^Do you need AI\? · AI chat and messaging assistant/.test(clip) && /\nFor: /.test(clip) && /Could you help with these\?/.test(clip) && !!who, wtag + ': copy per person');
        await p.click('details[data-fold="vendor"] > summary').catch(() => {}); if (!(await p.isVisible('#copy-vendor'))) await p.click('details[data-fold="vendor"] > summary');
        await p.click('#copy-vendor'); await p.waitForTimeout(150); clip = await p.evaluate(() => navigator.clipboard.readText()).catch(() => '');
        ok(/^Questions about AI chat and messaging assistant/.test(clip) && /1\. Can you show the tool working on our own systems and data/.test(clip), wtag + ': copy vendor questions');
        // PDF download
        const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#pdf')]);
        const pdfPath = path.join(OUT, wtag + '-' + dl.suggestedFilename()); await dl.saveAs(pdfPath);
        ok(/^Do-you-need-AI_Hotel-Alpenblick_\d{4}-\d{2}-\d{2}\.pdf$/.test(dl.suggestedFilename()) && fs.statSync(pdfPath).size > 30000 && fs.readFileSync(pdfPath).slice(0, 5).toString() === '%PDF-', wtag + ': PDF download ' + dl.suggestedFilename());
        await p.waitForFunction(() => window.Readiness2.state().download === 'idle');
        // file save, then open in a fresh browser
        const [dl2] = await Promise.all([p.waitForEvent('download'), p.click('#save-file')]);
        const jsonPath = path.join(OUT, wtag + '-' + dl2.suggestedFilename()); await dl2.saveAs(jsonPath);
        const doc = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        ok(/^Do-you-need-AI_Hotel-Alpenblick_\d{4}-\d{2}-\d{2}\.json$/.test(dl2.suggestedFilename()) && doc.kind === 'hftp-do-you-need-ai' && doc.v === 2 && doc.check.use === 'gx-2' && doc.check.snaps.length === 2, wtag + ': Save as file');
        await p.waitForFunction(() => window.Readiness2.state().download === 'idle');
        const o = await mk(b, w, touch); await o.p.goto(BASE + 'readiness-2/index.html');
        ok(await o.p.isVisible('#mychecks') && /None yet/.test(await o.p.textContent('#mychecks')), wtag + ': a fresh browser has no checks');
        await o.p.setInputFiles('#file-open', jsonPath); await o.p.waitForFunction(() => window.Readiness2.state().step === 'result');
        s = await state(o.p); ok(s.use === 'gx-2' && s.level === 'notready' && s.hotel.name === 'Hotel Alpenblick' && s.checks.length === 1 && s.snaps === 2, wtag + ': Open a saved file → the check with its result and history');
        // the same file again: asks before replacing
        await o.p.setInputFiles('#file-open', jsonPath); await o.p.waitForSelector('[data-confirm="file"]'); ok((await state(o.p)).confirm.kind === 'file', wtag + ': the same file again asks before replacing');
        await o.p.click('#import-no'); ok((await state(o.p)).confirm === null, wtag + ': keep the one here');
        const bad = path.join(OUT, 'not-a-check.json'); fs.writeFileSync(bad, '{"kind":"other"}'); await o.p.setInputFiles('#file-open', bad); await o.p.waitForTimeout(200);
        ok(/not a check saved from this page/.test(await o.p.textContent('#toast')) && (await state(o.p)).checks.length === 1, wtag + ': a wrong file is refused with a message');
        ok(o.p._errs.length === 0, wtag + ': file open: no console errors ' + o.p._errs.join('|')); await o.ctx.close();
        // saved-check list: start a new check, then open and remove
        await p.click('#new-check'); s = await state(p); ok(s.step === 'start' && s.checks.length === 1 && s.hotel.name === 'Hotel Alpenblick', wtag + ': Start a new check → cover; the finished check is listed; hotel details carried over');
        ok(/AI chat and messaging assistant/.test(await p.textContent('#mychecks')) && /Not ready yet · Score: \d+%/.test(await p.textContent('#mychecks')), wtag + ': Your checks shows the use case, verdict and score');
        await check(p, wtag + ' cover with checks'); await shot(p, wtag + '-8-your-checks');
        const id = s.checks[0];
        await p.click(`#mychecks [data-act="remove"][data-id="${id}"]`); ok((await state(p)).confirm.kind === 'remove' && await p.isVisible('#rm-yes'), wtag + ': Remove asks first');
        await check(p, wtag + ' remove confirm');
        await p.click('#rm-no'); s = await state(p); ok(s.confirm === null && s.checks.length === 1, wtag + ': Keep keeps it');
        await p.click(`#mychecks [data-act="open"][data-id="${id}"]`); s = await state(p); ok(s.step === 'result' && s.id === id && s.checks.length === 1, wtag + ': Open → its result; the untouched new check is not kept');
        await p.click('#new-check'); await p.click(`#mychecks [data-act="remove"][data-id="${id}"]`); await p.click('#rm-yes'); s = await state(p);
        ok(s.checks.length === 0 && s.step === 'start', wtag + ': Remove for good removes it');
        ok(p._errs.length === 0, wtag + ': list and files: no console errors ' + p._errs.join('|'));
      }
      await ctx.close();
    }
    // ---------- Q1 stop ----------
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(BASE + 'readiness-2/index.html');
      await p.click('#begin'); await p.selectOption('#h-type', 'independent'); await p.click('#next');
      await answer(p, 'q1', 'n'); ok(/Question 1 is No/.test(await p.textContent('#verdict')) && (await p.textContent('#next')) === 'See the result', wtag + ': Q1 No shows at once');
      await p.click('#next'); let s = await state(p);
      ok(s.step === 'stop' && (await p.textContent('#stop-head')) === 'This is not suitable for AI.', wtag + ': Q1 No → "This is not suitable for AI."');
      ok((await p.$$eval('#stopcard .btnrow > *', e => e.map(x => x.textContent))).join('|') === 'Change my answers|Start again|Download (PDF)', wtag + ': stop: Change my answers / Start again / Download (PDF)');
      ok(!(await p.$('#next')) && !(await p.$('#new-top')) && s.events.join() === 'change', wtag + ': stop: nothing leads past it');
      for (const e of ['next', 'begin', 'back', 'edit']) ok((await p.evaluate(ev => window.Readiness2.send(ev), e)) === false, wtag + ': stop refuses "' + e + '"');
      for (const st of ['must', 'where', 'tailored', 'result']) { await p.evaluate(x => window.Readiness2.send('pop', x), st); ok((await state(p)).step === 'stop', wtag + ': stop: pop to ' + st + ' stays on stop'); }
      await check(p, wtag + ' stop'); await shot(p, wtag + '-stop');
      const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#pdf')]); ok(/^Do-you-need-AI_assessment_/.test(dl.suggestedFilename()), wtag + ': stop PDF downloads');
      await p.waitForFunction(() => window.Readiness2.state().download === 'idle');
      await p.reload(); ok((await state(p)).step === 'stop', wtag + ': reload stays on stop');
      await p.goBack(); s = await state(p); ok(s.step === 'q', wtag + ': Back from stop → the questions');
      await p.goForward(); ok((await state(p)).step === 'stop', wtag + ': Forward → stop again');
      await p.click('#change'); await answer(p, 'q1', 'u'); for (const q of ['q2', 'q3', 'q4', 'q5']) await answer(p, q, 'y'); await p.click('#next');
      ok((await state(p)).step === 'must', wtag + ': Change my answers → Not sure → the must-haves open');
      await p.goBack(); await p.goBack(); s = await state(p); ok(s.step !== 'stop' || s.Q.q1 === 'n', wtag + ': an old stop entry in history cannot show the stop screen once Q1 is not No (' + s.step + ')');
      ok(p._errs.length === 0, wtag + ': stop: no console errors ' + p._errs.join('|')); await ctx.close();
    }
    // ---------- a record saved by the build before v2 ----------
    {
      const fx = JSON.parse(fs.readFileSync(path.join(ROOT, 'readiness-2/tests/fixtures/v1.3-saved.json'), 'utf8'));
      for (const x of fx.records) {
        const { ctx, p } = await mk(b, w, touch, { init: `if (!sessionStorage.getItem('seeded')) { localStorage.setItem('${KEY}', ${JSON.stringify(x.raw)}); sessionStorage.setItem('seeded', '1'); }` });
        await p.goto(BASE + 'readiness-2/index.html'); const s = await state(p), old = JSON.parse(x.raw);
        ok(p._errs.length === 0 && s.step === (old.step === 'start' ? 'start' : 'hotel'), wtag + ' v1 ' + x.name + ': opens without an error (on ' + s.step + ')');
        ok(JSON.stringify(Object.keys(s.Q).sort().map(k => s.Q[k])) === JSON.stringify(Object.keys(old.Q).sort().map(k => old.Q[k])) && s.use === old.use, wtag + ' v1 ' + x.name + ': five answers and use case kept');
        ok(await p.isVisible('#from-v1') && /Your five answers and your use case were kept/.test(await p.textContent('#from-v1')), wtag + ' v1 ' + x.name + ': the one-time notice');
        if (x.name === 'summary-gx-2') {
          await shot(p, wtag + '-v1-notice');
          await p.selectOption('#h-type', 'independent'); await p.click('#next');
          ok((await state(p)).step === 'q' && !(await p.$('#from-v1')), wtag + ' v1: the notice goes after the first Next');
          await p.click('#next'); ok((await state(p)).step === 'must', wtag + ' v1: the kept answers let it go on to the must-haves');
          for (const id of MUST) await answer(p, id, 'y'); await p.click('#next');
          const s2 = await state(p); ok(s2.step === 'where' && s2.use === 'gx-2' && (await p.isChecked('#u-gx-2')), wtag + ' v1: the kept use case is preselected in step 4');
          await p.reload(); ok(!(await p.$('#from-v1')) && (await p.evaluate(k => JSON.parse(localStorage.getItem(k)).v, KEY)) === 2, wtag + ' v1: saved as version 2, notice not shown again');
        }
        await ctx.close();
      }
    }
    // ---------- old #use= link, standalone ----------
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(BASE + 'readiness-2/index.html#use=hr-2');
      let s = await state(p); ok(s.step === 'start' && s.use === 'hr-2' && s.dept === 'hr' && /You came here for: AI recruiting/.test(await p.textContent('#preselected')) && !/use=/.test(p.url()), wtag + ': #use=hr-2 preselects the use case and clears the hash');
      await p.reload(); ok((await state(p)).use === 'hr-2' && (await state(p)).from === 'link' && (await state(p)).checks.length === 0, wtag + ': reload keeps it; a check that only came from a link is not listed yet (v2.1, audit L9)');
      await p.goto(BASE + 'readiness-2/index.html#use=zz-99'); ok((await state(p)).use === 'hr-2', wtag + ': an unknown use id in the hash is ignored');
      await ctx.close();
    }
    // ---------- blocked storage ----------
    {
      const { ctx, p } = await mk(b, w, touch, { init: 'Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });' });
      await p.goto(BASE + 'readiness-2/index.html'); await p.click('#begin');
      ok((await p.getAttribute('#app', 'data-storage')) === 'blocked' && await p.isVisible('#not-saved') && p._errs.length === 0, wtag + ': blocked storage: the page works and says nothing is kept');
      await ctx.close();
    }
    // ---------- inside the hub ----------
    {
      const { ctx, p } = await mk(b, w, touch); let f = await openHubTool(p);
      const nav = await p.$$eval('#hubBar nav button:not([hidden])', e => e.map(x => x.textContent));
      ok(!nav.includes('Readiness check') && nav.includes('Do you need AI?') && nav.includes('Team: readiness results'), wtag + ' hub: no Readiness check tab; Do you need AI? and the red Team tab are there: ' + nav.join(' · '));
      await walk(p, f, wtag + '-hub-chat', PLANS.chat, w === 1280);
      ok((await state(f)).inHub === true && (await p.evaluate(() => window.HFTPHub.state().tool)) === 'readiness-2', wtag + ' hub: the tool runs in the hub frame');
      ok(await noH(p), wtag + ' hub: no horizontal scroll on the hub page');
      // PDF through the hub: no downloads capability locally → plain link fallback
      const [dl] = await Promise.all([p.waitForEvent('download'), f.click('#pdf')]); ok(/^Do-you-need-AI_Hotel-Alpenblick_/.test(dl.suggestedFilename()), wtag + ' hub: PDF download');
      await f.waitForFunction(() => window.Readiness2.state().download === 'idle');
      // team sharing (local test copy outside claude.ai)
      if ((await state(f)).sharingOn) {
        await f.click('details[data-fold="share"] > summary'); await f.click('#share-btn');
        await f.waitForFunction(() => window.Readiness2.state().share === 'shared', null, { timeout: 15000 });
        let s = await state(f); ok(!!s.sharedAt && s.shareStore === 'local', wtag + ' hub: share a copy (outside claude.ai it is a local test copy)');
        ok(/Last shared/.test(await f.textContent('#share-status')), wtag + ' hub: share status shown');
        await check(f, wtag + ' hub share'); if (w === 1280) await shot(p, wtag + '-hub-share', f);
        await p.click('#hubBar button[data-tool="team"]'); const tf = await hubFrame(p, 'team'); await tf.waitForFunction(() => window.ReadinessTeam && window.ReadinessTeam.state().phase !== 'loading');
        const ts = await tf.evaluate(() => window.ReadinessTeam.state()); ok(ts.phase === 'ready' && ts.count === 1 && ts.old === 0, wtag + ' hub: the Team tab lists the shared copy');
        const tv = await tf.textContent('#view'); ok(/Do you need AI\?/.test(tv) && /AI chat and messaging assistant/.test(tv) && /Not ready yet/.test(tv) && (await tf.textContent('#dyn-score')) === 'Score: ' + s.pct + '%' && /^Because /.test(await tf.textContent('#dyn-reason')) && /Every answer and its points/.test(tv) && /Working out, step by step/.test(tv), wtag + ' hub: the Team tab recomputes it: same verdict and score');
        ok(!/Hotel Alpenblick/.test(tv), wtag + ' hub: the hotel name is not shared unless ticked');
        ok(await noH(tf), wtag + ' hub team: no horizontal scroll'); if (w === 1280) await shot(p, wtag + '-hub-team', tf);
        ok((tf._errs || []).length === 0 && p._errs.length === 0, wtag + ' hub team: no console errors ' + p._errs.join('|'));
        await p.click('#hubBar button[data-tool="readiness-2"]'); f = await hubFrame(p, 'readiness-2');
        await f.click('#unshare'); await f.waitForFunction(() => window.Readiness2.state().share === 'idle', null, { timeout: 15000 }); ok(!(await state(f)).sharedAt, wtag + ' hub: withdraw the shared copy');
        await p.click('#hubBar button[data-tool="team"]'); const tf2 = await hubFrame(p, 'team'); await tf2.waitForFunction(() => window.ReadinessTeam && window.ReadinessTeam.state().phase !== 'loading' && window.ReadinessTeam.state().count === 0, null, { timeout: 15000 }).catch(() => {});
        ok((await tf2.evaluate(() => window.ReadinessTeam.state().count)) === 0, wtag + ' hub: withdrawn → the Team tab is empty again');
        await p.click('#hubBar button[data-tool="readiness-2"]'); f = await hubFrame(p, 'readiness-2');
      }
      // Add to the AI Register
      await f.click('#to-register'); await p.waitForFunction(() => window.HFTPHub.state().tool === 'register');
      const rf = await hubFrame(p, 'register'); await rf.waitForFunction(() => /AI chat and messaging assistant/.test(document.body.textContent), null, { timeout: 15000 }).catch(() => {});
      ok(/AI chat and messaging assistant/.test(await rf.textContent('body')), wtag + ' hub: Add to the AI Register opens the register with the tool added');
      // the register's link back: an old 'readiness-check' open message with #use=<id>
      const back = await rf.$('[data-act="to-readiness"]');
      ok(!!back && /\(Do you need AI\?\)/.test(await back.textContent()), wtag + ' hub: the register\'s link names "Do you need AI?"');
      await p.evaluate(() => { const fr = [...document.querySelectorAll('#hubFrame iframe')].find(x => x.title === 'register'); fr.contentWindow.eval("window.parent.postMessage({ hub: 'open', tool: 'readiness-check', hash: 'use=hr-2' }, location.origin)"); });
      await p.waitForFunction(() => window.HFTPHub.state().tool === 'readiness-2'); f = await hubFrame(p, 'readiness-2');
      await f.waitForFunction(() => window.Readiness2.state().use === 'hr-2', null, { timeout: 15000 });
      let s = await state(f); ok(s.use === 'hr-2' && s.step === 'start' && s.from === 'link' && s.checks.length === 1 && !(await p.$('#hubFrame iframe[title="readiness-check"]')), wtag + ' hub: an old readiness-check link with #use=hr-2 lands in Do you need AI? with hr-2 preselected (the finished check is kept)');
      ok(/You came here for: AI recruiting/.test(await f.textContent('#preselected')), wtag + ' hub: the cover says what was preselected');
      if (w === 1280) await shot(p, wtag + '-hub-old-link', f);
      ok(p._errs.length === 0, wtag + ' hub: no console errors ' + p._errs.slice(0, 3).join(' | '));
      await ctx.close();
      // a fresh hub with the old link first (frame not open yet), and an old stored tab name
      const h2 = await mk(b, w, touch, { init: "try { if (location.pathname.endsWith('/index.html') && !location.pathname.includes('readiness') && !sessionStorage.getItem('s2')) { sessionStorage.setItem('hubTool', 'readiness-check'); sessionStorage.setItem('s2', '1'); } } catch (e) {}" });
      await h2.p.goto(BASE + 'index.html'); await h2.p.waitForFunction(() => window.HFTPHub && window.HFTPHub.state().tool === 'readiness-2', null, { timeout: 15000 }).catch(() => {});
      ok((await h2.p.evaluate(() => window.HFTPHub.state().tool)) === 'readiness-2', wtag + ' hub: a browser tab that last showed the Readiness check opens Do you need AI?');
      ok(h2.p._errs.length === 0, wtag + ' hub (old tab): no console errors'); await h2.ctx.close();
    }
    // ---------- the old Readiness check page still opens on its own (old bookmarks) ----------
    {
      const { ctx, p } = await mk(b, w, touch); await p.goto(BASE + 'readiness-check/index.html#use=gx-2');
      ok(/AI readiness check/i.test(await p.textContent('body')) && p._errs.length === 0, wtag + ': the old readiness-check page still opens as a file');
      await ctx.close();
    }
  }
  await b.close();
  console.log('browser walk: ' + pass + ' passed, ' + fail + ' failed');
  if (fail) { console.log(fails.join('\n')); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
