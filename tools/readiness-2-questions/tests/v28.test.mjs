// v2.8.0 (live review, 25 Nov 2026; prompt CLAUDE_PROMPT_v2.8.md §3 and the owner's decisions of 25 Nov 2026): the result page fixes
// B2 to B5, B9, B10 and the version string. Scoring and verdict rules are unchanged (tests/scoring.test.mjs).
// Run: node tools/readiness-2-questions/tests/v28.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, data, tester, finished } from './load.mjs';
const { C, L, F, P } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('v28');
const rd = p => readFileSync(join(root, p), 'utf8');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const env = { cat: D.cat, TQ, ex: D.ex, today: '2026-11-25' };
const app = rd('src/app.js'), html = rd('index.html');
const pdfText = (r, kind) => P.model(r, env, kind || 'result').blocks.map(b => [b.t, b.sub, b.box, b.also, b.m, b.val].filter(Boolean).join(' | ')).join('\n');

// ---------- B2: a No in step 2 is said in the verdict box and is the first action ----------
for (const [q, title] of [['q2', 'Return'], ['q3', 'Information to learn from'], ['q4', 'Safety net'], ['q5', 'Proof']]) {
  const r = finished(F, D, 'gx-2'); r.Q[q] = 'n';
  const m = L.resultModel(r, env);
  ok(m.level === 'almost' && m.alsoLine === 'Also: the first questions suggest this may not be worth doing with AI (' + title + ': No).', 'B2: ' + q + ' No with everything else Yes gives Almost ready and the line: ' + m.alsoLine);
  ok(m.first[0].hold === 'carried' && /^Settle this first: in step 2 you answered No to “/.test(m.first[0].text) && m.first[0].who === 'General manager', 'B2: ' + q + ' No is the first action (General manager)');
  ok(m.people[0].who === 'gm' && m.people[0].items[0].text === m.first[0].text, 'B2: and the first item of the action plan');
  ok(pdfText(r).includes(m.alsoLine), 'B2: the line is in the Result PDF\'s verdict box');
}
{ const r = finished(F, D, 'gx-2'); r.Q.q2 = 'n'; r.Q.q5 = 'n'; F.MUST_IDS.forEach(id => { r.A[id] = 'n'; });
  const m = L.resultModel(r, env);
  ok(m.level === 'notready' && m.alsoLine === 'Also: the first questions suggest this may not be worth doing with AI (Return: No; Proof: No).' && m.first[0].hold === 'carried', 'B2: whatever the verdict (Not ready yet), both Nos named, first action'); }
{ const m = L.resultModel(finished(F, D, 'gx-2'), env); ok(!m.alsoLine && m.level === 'ready', 'B2: no line when step 2 has no No'); }
ok(/id="also-step2"/.test(app), 'B2: drawn in the verdict box (#also-step2)');

// ---------- B3: the score's label, the must-haves line first in bold ----------
{ const r = finished(F, D, 'fo-4'); F.MUST_IDS.forEach(id => { r.A[id] = 'n'; }); r.A.m1 = 'pl'; r.A.m2 = 'pl';
  const m = L.resultModel(r, env);
  ok(/^Score: \d+% of points from all questions$/.test(m.scoreHead) && m.mustLine.startsWith('0 of 10 must-haves in place'), 'B3: "Score: X% of points from all questions": ' + m.scoreHead + ' / ' + m.mustLine);
  const lv = P.model(r, env).blocks.find(b => b.id === 'level'); ok(lv.sub === m.mustLine && lv.score === m.scoreHead, 'B3: the PDF box carries both'); }
ok(/id="level-name">[^]*?id="must-line"><strong>[^]*?id="score"/.test(app.replace(/\n/g, ' ')) || app.indexOf('id="must-line"><strong>') < app.indexOf('<span class="score'), 'B3: in the verdict box the must-haves line (bold) comes before the score');
ok(/para\(b\.sub, M \+ 7, TW - 14, SZ\.body, 'bold', 'ink'\); y \+= g\(1\.2\); \/\/ v2\.8\.0 \(B3\)/.test(rd('src/pdf.js')), 'B3: the PDF draws the must-haves line first, in bold');

// ---------- B4: the sensitive hold, once ----------
for (const use of ['hr-1', 'hr-2', 'fo-3']) {
  const m = L.resultModel(finished(F, D, use), env);
  ok(m.level === 'almost' && eq(m.held, ['sensitive']) && m.boxLine === 'Almost ready: everything is in place, but this area needs an adviser’s view first.', use + ' all Yes: the hold is said once in the verdict box');
  ok(m.flag === C.SENSITIVE_FLAG && m.first.length === 1 && m.first[0].text === 'Ask an adviser before a pilot' && m.first[0].who === 'General manager' && m.nothingElse === 'Nothing else to fix.', use + ': action 1 "Ask an adviser before a pilot" (GM), "Nothing else to fix."');
  const shown = [m.boxLine, m.reasonShown, m.flag].concat(m.first.map(f => f.text), m.people.flatMap(p => p.items.map(a => a.text)));
  ok(!shown.some(t => t && t.includes(C.SENSITIVE_HOLD)) && !m.reasonShown, use + ': the hold text is not repeated (reason paragraph empty; not in the actions)');
  const t = pdfText(finished(F, D, use)); ok(t.split(C.SENSITIVE_FLAG).length - 1 === 1 && t.includes(m.boxLine) && t.includes('Nothing else to fix.'), use + ': the PDF shows the flag once, the box line and "Nothing else to fix."');
}
{ const r = finished(F, D, 'hr-1'); r.T[TQ.uses['hr-1'].qs[0].id] = 'n'; const m = L.resultModel(r, env);
  ok(m.first[0].text === 'Ask an adviser before a pilot' && m.first.length > 1 && !m.nothingElse, 'B4: with something else open, the adviser comes first and the open items follow'); }

// ---------- B5: the step-2 table shows the condition ----------
{ const m = L.resultModel(finished(F, D, 'gx-2'), env);
  ok(m.answers[0].a === 'No' && m.answers[0].cond === 'Met' && m.answers.slice(1).every(a => a.a === 'Yes' && a.cond === 'Met'), 'B5: Q1 = No shows Met (and Yes on 2 to 5 shows Met)');
  const r = finished(F, D, 'gx-2'); r.Q.q2 = 'n'; r.Q.q3 = 'u'; const m2 = L.resultModel(r, env);
  ok(m2.answers[1].cond === 'Not met' && m2.answers[2].cond === 'To find out', 'B5: No → Not met, Not sure → To find out'); }
ok(/data-cond="' \+ esc\(a\.cond\) \+ '"/.test(app) && /<p class="meta youranswer">Your answer: ' \+ esc\(a\.a\)/.test(app), 'B5: the badge is the condition, "Your answer: …" underneath');
{ const r = finished(F, D, 'gx-2'); r.Q.q1 = 'y'; const pd = P.model(r, env); const q1 = pd.blocks.find(b => b.k === 'q');
  ok(pd.stop && q1.val === 'Not met' && q1.m.startsWith('Your answer: Yes.'), 'B5: the stop PDF too: Q1 Yes reads Not met, with the answer under it'); }

// ---------- owner decision 1: "Not sure" in step 2 becomes "Find out: …"; no "Don't know" anywhere ----------
{ const r = finished(F, D, 'gx-2'); r.Q.q4 = 'u'; const m = L.resultModel(r, env);
  ok(m.first[0].text === C.QUESTIONS[3].find && /^Find out: /.test(m.first[0].text) && m.first[0].who === C.WHO.dept, 'Not sure on question 4 → "Find out: …" for the department head, item 1');
  ok(eq(C.Q_ANSWERS, [['y', 'Yes'], ['n', 'No'], ['u', 'Not sure']]) && eq(C.ANSWERS, [['y', 'Yes'], ['pl', 'Planned, not done yet'], ['n', 'No']]), 'answers: step 2 Yes / No / Not sure; steps 3 and 5 Yes / Planned, not done yet / No'); }
ok(C.QUESTIONS.every(q => /^Find out: /.test(q.find) && !/\?$/.test(q.find) && C.WHO[q.whoKey]), 'each of the five questions has a "Find out: …" action and a person');

// ---------- B9 / B10 / version ----------
ok(D.cat.nUses === 98 && /CAT\.nUses \+ ' use cases in ' \+ CAT\.nDepts/.test(app), 'B9: the use-case count comes from the data (98)');
const strs = f => (rd(f).match(/'(?:[^'\\\n]|\\.)*'/g) || []).join('\n');
ok(!['src/app.js', 'src/content.js', 'src/logic.js', 'src/pdf.js'].some(f => /\b(90|99)\b/.test(strs(f))) && !/\b(90|99) use cases\b/.test(rd('src/page.html')), 'B9: no string in the code types "90" or "99"');
ok(L.shareLines(L.MUST.m1, TQ)[0].includes('needed for 90 of the 90 use cases analysed (of 98)'), 'B9: "needed for n of the 90 use cases analysed (of 98)"');
ok(!/C-R-I-S-P|C R I S P|CRISP/.test(html) && /id="q-head">' \+ esc\(C\.STEP2_HEAD\)/.test(app) && C.STEP2_HEAD === 'Should this problem be solved by AI?' && eq(C.QUESTIONS.map(q => q.title), ['Needs judgement', 'Return', 'Information to learn from', 'Safety net', 'Proof']), 'B10: no C-R-I-S-P; the heading and the five plain names');
ok(C.VERSION === '2.8.1' && C.VERSION_LINE === 'v2.8.1 (rules unchanged since v2.6)', 'version 2.8.1, shown as "v2.8.1 (rules unchanged since v2.6)"');
{ const meth = L.method(L.evaluate(finished(F, D, 'gx-2'), TQ)).join('\n');
  ok(!/rules v2\.5|Rules v2\.6/i.test(meth) && meth.includes('Version v2.8.1 (rules unchanged since v2.6).'), 'the method shows one version string; no "rules v2.5"'); }
ok(html.includes('<title>Can AI solve your problems?</title>') && html.includes('data-version="2.8.1"') && P.LINE.includes('Version v2.8.1 (rules unchanged since v2.6).'), 'page title, footer and PDF line carry the version');
// ---------- commit 4: B1 (downloads), B6 (new check), B7 (saved checks) ----------
{ const env2 = (await import('./load.mjs')).envOf(D, F);
  let s = F.blankStore(); const id0 = s.cur;
  const run = (st, ev, arg) => { const r = F.reduce(st, ev, arg, env2); if (!r.ok) throw new Error(ev); return r.store; };
  s = run(s, 'begin'); s = run(s, 'hotel', { k: 'type', v: 'group' }); s = run(s, 'hotel', { k: 'name', v: 'Hotel A' }); s = run(s, 'next'); s = run(s, 'answer', { id: 'q1', value: 'n' });
  const same = F.reduce(s, 'new', { same: true }, env2).store, other = F.reduce(s, 'new', { same: false }, env2).store;
  ok(F.cur(same).hotel.name === 'Hotel A' && F.cur(same).hotel.type === 'group' && F.cur(same).step === 'start' && !Object.keys(F.cur(same).Q).length, 'B6: same hotel keeps step 1 only');
  ok(!F.cur(other).hotel.name && !F.cur(other).hotel.type && other.checks[id0], 'B6: a different hotel starts blank; the earlier check is kept');
  ok(F.cur(F.reduce(s, 'new', null, env2).store).hotel.name === 'Hotel A', 'B6: the store event without an answer keeps the hotel (the page asks first)');
  // three checks survive a reload
  let t = F.blankStore();
  for (const [n, use] of [['One', 'fo-4'], ['Two', 'gx-2'], ['Three', 'rm-1']]) {
    t = run(t, 'begin'); t = run(t, 'hotel', { k: 'type', v: 'independent' }); t = run(t, 'hotel', { k: 'name', v: n }); t = run(t, 'next');
    ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(q => { t = run(t, 'answer', { id: q, value: q === 'q1' ? 'n' : 'y' }); }); t = run(t, 'next'); t = run(t, 'next');
    const d = D.cat.depts.find(x => x.uses.some(u => u.id === use)); t = run(t, 'cat', d.cat); t = run(t, 'dept', d.id); t = run(t, 'use', use);
    t = run(t, 'new', { same: false });
  }
  const back = F.migrate(JSON.parse(JSON.stringify(t)), env2, {});
  ok(Object.keys(back.checks).filter(k => F.listed(back.checks[k])).length === 3, 'B7: 3 checks, reload (migrate) → all 3 are still listed');
  ok(!/\.slice\(0, MAX_CHECKS\)/.test(rd('src/flow.js')) && !/!F\.listed\(x\.store\.checks\[k\]\)\) delete/.test(app), 'B7: nothing is dropped or deleted on load'); }
ok(/data-act="copy-plan" id="copy-plan">Copy plan/.test(app) && /data-act="copy-saved" id="copy-saved">Copy saved check/.test(app) && /data-act="print" id="print-open">Open printable page/.test(app), 'B1: Copy plan, Copy saved check and Open printable page are always offered');
ok(C.DL_BLOCKED === 'Your browser blocked the download. Use Copy or Print instead.' && /id="dl-blocked"/.test(app), 'B1: the blocked line');
ok(/window\.claude\.use\('downloads'\)/.test(app), 'B1: the downloads capability is used when the viewer serves it');
ok(C.NEW_ASK === 'Start a new check: same hotel ({name}) or a different hotel?' && /id="new-same"/.test(app) && /id="new-other"/.test(app), 'B6: the question and its two answers');
ok(C.STOPPED === 'Stopped at step 2' && C.NOT_SUITABLE === 'Not suitable for AI' && /'Not finished: step ' \+ STEP_NO\[r\.step\]/.test(app) && /\[r\.hotel\.name \|\| 'Hotel not named', what, date\]\.join\(' · '\)/.test(app), 'B7: names "<hotel> · <use case> · <date>", stops and unfinished checks');
ok(/var WS = PUB \? null : \(function \(\) \{ try \{ var w = window\.storage;/.test(app) && /try \{ localStorage\.setItem\(F\.KEY, JSON\.stringify\(store\)\); lsOk = true; \} catch/.test(app) && /F\.storageNext\(storage, ev\)/.test(app) && /Save as file/.test(C.NOT_SAVED), 'B7: window.storage (not on the public build), then localStorage in try/catch, then memory with the "Save as file" line (v2.8.1: through the STORAGE machine)');
ok(/version: C\.VERSION, rules: L\.RULES/.test(app), 'the saved file carries version 2.8.0');
// ---------- owner decision 1: no "Don't know" in the tool's text (page, PDFs, exports); the vendored jsPDF error text excepted ----------
{ const DK = /don[’']t know/i, LIB = rd('../assessment/lib/jspdf.umd.min.js').replace(/<\/script/gi, '<\\/script');
  const libHits = (LIB.match(/don[’']t know[^"]{0,40}/gi) || []);
  ok(!DK.test(html.split(LIB).join(' ')) && html.includes(LIB), 'index.html: 0 "Don\'t know" outside the vendored jsPDF (jsPDF itself: ' + libHits.length + ', "' + (libHits[0] || '') + '")');
  const envD = { cat: D.cat, TQ, ex: D.ex, detail: D.detail, today: '2026-11-25' }; let n = 0, bad = [];
  Object.keys(TQ.uses).forEach((use, i) => { const r = finished(F, D, use); r.Q.q3 = 'u'; F.MUST_IDS.forEach((id, j) => { if ((i + j) % 4 === 0) Reflect.deleteProperty(r.A, id); }); TQ.uses[use].qs.forEach((q, j) => { if (j % 3 === 0) Reflect.deleteProperty(r.T, q.id); });
    for (const k of ['result', 'answers']) { n++; if (DK.test(pdfText(r, k))) bad.push(use + ' ' + k); }
    const m = L.resultModel(r, envD); if (DK.test(JSON.stringify(m.people) + JSON.stringify(m.first) + JSON.stringify({ kind: 'hftp-do-you-need-ai', check: F.forFile(r) }))) bad.push(use + ' export'); });
  ok(!bad.length, 'PDF texts (' + n + ') and exports: 0 "Don\'t know": ' + bad.slice(0, 3).join(' | ')); }
done();
