// "Do you need AI?" v2.1 (24 Nov 2026): one block of tests per fault of the clean-up audit
// (reports/audit-readiness-2/cleanup_inventory_v2.md: H1, H2, M1–M8, L1–L13) and per item of the council's BUILD NOW list
// (reports/Council - Do you need AI v2.md, items 1–10), plus the three "team judgement" switches (B2, B5, B6) and the records
// saved by the v2.0 build (tests/fixtures/v2.0-*.json, captured from the v2.0 page before any change).
// What needs a browser (clicks, tabs, Back, downloads, the team page) is in tests/browser/v21.cjs.
// Run: node tools/readiness-2/tests/v21.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, envOf, tester, finished, root, PAGE } from './load.mjs';
import { tqSig, tqModel } from '../build.mjs';
const Q = JSON.parse(readFileSync(join(root, 'data/usecase_questions_only.json'), 'utf8')), QBY = Object.fromEntries(Q.use_cases.map(u => [u.id, u])); // v2.7.0: the questions-only data (the generator is gone)
const { C, L, F, P, RC } = load();
const D = data(), TQ = D.tq, ENV = envOf(D, F);
const { ok, done } = tester('v21');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const SENS = Object.keys(TQ.uses).filter(k => TQ.uses[k].sensitive).sort();
const noK = o => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => v !== 'k')); // v2.7.1: a stored "k" is not an answer and is not carried
const carryT = (use, T) => { const o = {}; (TQ.uses[use] ? TQ.uses[use].qs : []).forEach(q => { if (q.carry && T && T[q.carry] != null && T[q.carry] !== 'k') o[q.id] = T[q.carry]; }); return o; }; // v2.7.0: old answers taken over by carry_answer_from
const env = { cat: D.cat, TQ, today: '2026-11-24' };
function mk(use, musts, tail, o) {
  const r = finished(F, D, use, o);
  F.MUST_IDS.forEach((id, i) => { r.A[id] = (musts && musts[i]) || 'y'; });
  if (use && use !== 'none') TQ.uses[use].qs.forEach((q, i) => { r.T[q.id] = (tail && tail[i]) || 'y'; });
  return r;
}
const rep = (v, n) => Array(n).fill(v);
const everyWord = m => [m.levelName, m.reason, m.scoreHead, m.scoreSub, m.levelLine, m.mustLine, m.law, m.cap].concat(m.method, m.areas.map(a => a.line)).join('\n');
const pdfText = rec => P.model(rec, env).blocks.map(b => [b.t, b.a, b.name, b.check, b.answer, b.sub].filter(Boolean).join(' | ')).join('\n');
const storeWith = (...recs) => { const s = { v: 2, cur: recs[0].id, checks: {} }; recs.forEach(r => { s.checks[r.id] = r; }); return s; };

// ====================================================================================================================
// H2 + council items 1, 2, 3: the headline never contradicts itself
// ====================================================================================================================
ok(L.RULES === 'v2.6 (24 Nov 2026)', 'rules version bumped (v2.1, v2.3 four answers, v2.5 owner O1 to O4, now v2.6: step 2 questions)');
{
  // the three rows the audit marked bold (machine 5), on rm-1
  const n = TQ.uses['rm-1'].qs.length;
  const cases = [
    ['one must-have No, all else Yes', mk('rm-1', ['y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'n'], []), 'notready'],
    ['1 must-have Yes, 9 "Don\'t know yet", tailored "Doesn\'t apply"', mk('rm-1', ['y'].concat(rep('k', 9)), rep('na', n)), 'noinfo'],
    ['must-haves Yes, tailored all "Don\'t know yet"', mk('rm-1', [], rep('k', n)), 'almost']
  ];
  cases.forEach(([tag, r, level]) => {
    const m = L.resultModel(r, env), pdf = pdfText(r); // v2.5: Copy summary (summaryText) is gone; the PDF is the text that leaves the page
    ok(m.level === level, tag + ': ' + level + ' (got ' + m.level + ')');
    ok(![everyWord(m), pdf].some(t => /\d+% ready/.test(t)), tag + ': "% ready" appears nowhere (screen words, PDF)');
    ok(/^(Score: \d+% of points from all questions|No score yet: you answered \d+ of \d+ questions\.)$/.test(m.scoreHead), tag + ': the score reads "Score: n% of points from all questions" (v2.8.0 B3) or "No score yet: …": ' + m.scoreHead);
    ok(m.reason.startsWith('Because ') && pdf.includes(m.reason), tag + ': the reason is a visible line, on screen and in the PDF: ' + m.reason);
    ok(pdf.includes(m.levelName + ' · ' + m.scoreHead), tag + ': the PDF carries the verdict and score string');
  });
  // item 1: the wording of the score
  // v2.3: Partly → Planned, Doesn't apply → No
  let m = L.resultModel(mk('fo-4', ['y', 'y', 'pl', 'y', 'k', 'y', 'pl', 'y', 'n', 'y'], ['y', 'k', 'y', 'y', 'pl', 'y', 'n', 'y']), env);
  ok(m.scoreHead === 'Score: 69% of points from all questions' && m.ev.pts === 25 && m.ev.max === 36 && m.ev.counts.known === 16 && m.ev.counts.total === 18, 'item 1: "Score: 69%" = 25 of 36 points (16 of 18 answered, 2 unknown at 0)');
  ok(m.scoreSub === '25 of 36 points on 18 questions: 16 answered, 2 not answered yet (0 points each). ' + C.SCORE_NOTE && C.SCORE_NOTE === 'Your own answers; nobody checked them. The cut-offs are the team’s judgement, not tested with hotels.', 'item 1: the points and the answered-question counts stand next to the score, then the caveat (final copy)');
  ok(L.scoreSub(L.evaluate(mk('fo-4', [], []), TQ)) === '36 of 36 points on the 18 questions you answered. ' + C.SCORE_NOTE, 'item 1: with nothing unknown, "36 of 36 points on the 18 questions you answered."');
  ok(eq(C.GET_SCORE, ['A verdict and a score:', 'one of four verdicts, and the share of points from your own answers, with how both were worked out.']), 'item 1: the cover bullet (final copy)');
  // item 2: no score under "Not enough information yet"
  const none = L.resultModel(mk('none', ['y', 'y', 'y', 'y'].concat(rep('k', 6)), []), env);
  ok(none.level === 'noinfo' && none.scoreHead === 'No score yet: you answered 4 of 10 questions.' && none.ev.pct === null && !/%/.test(none.scoreHead + none.scoreSub), 'item 2: "No score yet: you answered 4 of 10 questions." and no percentage (the council\'s none-6-result case)');
  ok(pdfText(mk('none', ['y', 'y', 'y', 'y'].concat(rep('k', 6)), [])).includes('Not enough information yet · No score yet: you answered 4 of 10 questions.') && !/Score: \d/.test(pdfText(mk('none', ['y', 'y', 'y', 'y'].concat(rep('k', 6)), []))), 'item 2: the same in the PDF');
  ok(L.snapshot(none.ev, '2026-11-24T10:00:00.000Z', 'none').pct === null, 'item 2: no percentage goes into the history or a shared copy either');
  // item 3: the reason in the verdict line (final copy)
  ok(L.evaluate(mk('fo-4', ['y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'n'], []), TQ).reason === 'Because 1 must-have is missing: Rules for staff on AI tools. A missing must-have outweighs the score.', 'item 3: must-have at No (final copy)');
  ok(L.evaluate(mk('fo-4', ['n', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'n'], []), TQ).reason === 'Because 2 must-haves are missing: A named owner with time; Rules for staff on AI tools. A missing must-have outweighs the score.', 'item 3: two missing must-haves are both named');
  ok(L.evaluate(mk('fo-4', rep('pl', 10), ['n'].concat(rep('pl', 7))), TQ).reason === 'Because fewer than half the points are in place.', 'item 3: below 50% (final copy)');
  const ni = L.evaluate(mk('fo-4', ['n'].concat(rep('k', 9)), rep('k', 8)), TQ);
  ok(ni.level === 'noinfo' && ni.reason === 'Because more than half the questions are still not answered yet (17 of 18). Already known: 1 must-have is missing: A named owner with time.', 'item 3: not enough information, with a must-have at No: "Already known: …"');
  ok(L.evaluate(mk('fo-4', ['pl'], []), TQ).reason === 'Because 1 must-have is not Yes yet: A named owner with time.' && /^Because the score is between 50% and 74%/.test(L.evaluate(mk('fo-4', [], ['n', 'n', 'n', 'n', 'n', 'y', 'y', 'y']), TQ).reason) && /^Because every must-have is Yes/.test(L.evaluate(mk('fo-4', [], []), TQ).reason), 'item 3: every verdict has its reason');
  m = L.resultModel(mk('fo-4', ['y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'n'], []), env);
  ok(m.method.includes('Your verdict is “Not ready yet”. ' + m.reason) && !/Too much is still missing/.test(everyWord(m)), 'item 3: the working-out repeats the same reason; "Too much is still missing" is gone from a 94% result');
}

// ====================================================================================================================
// Council items 4–9
// ====================================================================================================================
ok(C.LEVELS.almost.line === 'Nothing you answered blocks a start, but points are still open. Close the ones below before you sign anything.' && !/Most of it is there/.test(JSON.stringify(C.LEVELS)), 'item 4: the "Almost ready" line (final copy)');
ok(C.MUST_INTRO === 'Ten things to have in place before an AI project starts. Think of the project you have in mind. Under each one you can see how many of the {N} use cases in the team’s analysis need it.' && TQ.matrixTotal === 90 && !/every AI project/.test(rd('src/app.js') + rd('src/content.js')), 'item 5: the step 3 intro (final copy), 90 read from the workbook, and "every AI project" is gone from the page');
{
  // item 6: areas as counts, not percentages; a word only with two or more known answers
  const r = mk('fo-4', ['y', 'y', 'pl', 'y', 'k', 'y', 'pl', 'y', 'n', 'y'], ['y', 'k', 'y', 'y', 'pl', 'y', 'n', 'y']), m = L.resultModel(r, env); // v2.3: no p / na
  ok(m.areasHead === 'What is in place, by area' && m.areas.every(a => !/%/.test(a.line) && a.line.startsWith(a.name + ': ' + a.yes + ' of ' + a.n + ' in place')), 'item 6: "What is in place, by area", each row "<area>: n of m in place", no percentage');
  ok(m.areas[0].line === 'Must-haves: 6 of 10 in place · Gaps to close · 1 not answered yet', 'item 6: must-haves row: ' + m.areas[0].line);
  m.ev.areas.forEach(g => ok((g.known >= 2) === !!g.word, 'item 6: ' + g.name + ' has a word only with two or more known answers (' + g.known + ')'));
  const one = L.resultModel(mk('rm-3', [], ['y', 'y', 'y', 'y', 'n', 'y']), env).areas.find(a => a.k === 'da');
  ok(one.line === 'Data: 0 of 1 in place' && one.word === '', 'item 6: "Data: 0 of 1 in place", no "Weak" from one answer');
  ok(!pdfText(r).includes('What is in place, by area') && !/Score per area/.test(pdfText(r)) && !pdfText(r).includes('Must-haves: 6 of 10 in place'), 'item 6: v2.7: the result PDF has no areas section any more (the area rows are gone with it)');
  ok(m.method.filter(t => /^(Must-haves|People|Skills|Financial investment|Technology infrastructure|Data|Organisation & governance): \d+ of \d+ in place/.test(t)).length === 7 && !m.method.some(t => /^(Must-haves|People|Skills|Data)[^.]*= \d+%/.test(t)), 'item 6: the working-out lists the areas as counts with their points, no area percentage');
}
{
  // item 7 (v2.7.0, owner): the law line and the AI Act block are gone; the data file's sensitive-area flag is shown on the result
  // (and the PDF) for the 12 sensitive use cases, under any verdict
  ok(!('LAW_LINE' in C) && C.SENSITIVE_FLAG === "This area involves people's personal data or jobs and has extra rules. Ask an adviser before a pilot.", 'item 7: the sensitive flag (verbatim)');
  const sens = Object.keys(TQ.uses).filter(k => TQ.uses[k].sensitive).sort();
  ok(eq(sens, ['fo-3', 'fo-6', 'gx-4', 'hk-6', 'hr-1', 'hr-2', 'hr-4', 'hr-5', 'hr-6', 'it-4', 'res-8', 'sm-3']), 'item 7: the sensitive use cases: ' + sens);
  Object.keys(TQ.uses).forEach(id => {
    const flagged = sens.includes(id);
    [mk(id, [], []), mk(id, ['n'], []), mk(id, rep('k', 10), [])].forEach(r => { const m = L.resultModel(r, env); ok((m.flag === C.SENSITIVE_FLAG) === flagged && !('legal' in m), id + ' (' + m.level + '): the flag is shown ' + (flagged ? 'under every verdict' : 'never')); });
    if (flagged) ok(pdfText(mk(id, [], [])).includes(C.SENSITIVE_FLAG), id + ': the flag is in the PDF');
  });
  ok(L.resultModel(mk('none', [], []), env).flag === '', 'item 7: no flag without a use case');
}
{
  // item 8 / M8: no bare evidence ids on a hotel-facing screen
  let n = 0;
  Object.keys(TQ.uses).forEach(id => TQ.uses[id].qs.forEach(q => { const w = L.tailWhy(TQ, id, q).join(' '); n++; ok(!/[A-Z]{3}-\d{3}-\d{2}/.test(w) && !/D6 evidence pack|Evidence rows/.test(w), id + '.' + q.id + ': no evidence id or pack name in the "Why this matters" fold'); }));
  ok(n === 743, 'M8: all 743 folds checked (v2.8.0; v2.7.0: 723)');
  ok(!L.evidenceLine, 'item 8 (v2.7.0): the evidence line is gone with the generator; the fold shows the data\'s own why line');
  // v2.7.0: M8's evidence ids lived in the generator's file, which is gone; the page still carries none (next line)
  const html = rd(PAGE), noData = html.replace(/<script type="application\/json" id="r2-data">[\s\S]*?<\/script>/, '');
  ok(!/[A-Z]{3}-\d{3}-\d{2}/.test(noData), 'M8: no evidence id in the page outside its data block');
}
ok(C.TAIL_TODAY === 'Answer for today. If something can only exist once the tool is running (for example its conversation logs), choose “Planned, not done yet”.' && rd('src/app.js').includes('C.TAIL_TODAY'), 'item 9: the step 5 intro (final copy), on the page');
// item 10 (generator frames): retired in v2.7.0 with the generator; the questions-only data is checked in tests/questions.test.mjs

// ====================================================================================================================
// Team judgement: B2, B5, B6, each behind one named constant
// ====================================================================================================================
ok(eq(L.JUDGEMENT, { UNKNOWN_SCORES_ZERO: true, SENSITIVE_HOLDS_TOP: true, CARRIED_NO_HOLDS_TOP: true, ALMOST_MIN_MUST_YES: 50, READY_MIN_TAIL_YES: 50, NOT_SURE_HOLDS_TOP: true, NONE_BEST_ALMOST: true }), 'the three v2.1 switches, all on (v2.5 adds named constants, owner O1 to O4; v2.6 removes Q4_NO_HOLDS_TOP)');
{
  const J = L.JUDGEMENT, flip = (k, f) => { J[k] = false; try { f(); } finally { J[k] = true; } };
  // B2
  let r = mk('fo-4', [], ['k', 'k', 'k', 'k', 'y', 'y', 'y', 'y']), e = L.evaluate(r, TQ);
  ok(e.pts === 28 && e.max === 36 && e.pct === 77 && e.counts.unknown === 4 && L.mustLine(L.evaluate(mk('fo-4', ['k'], []), TQ)).includes('1 not answered yet'), 'B2 on: a question not answered yet counts as 0 points (28 of 36 = 77%) and is still shown as "not answered yet"');
  ok(L.open(e).filter(a => a.state === 'unknown').length === 4 && L.open(e).filter(a => a.state === 'unknown').every(a => a.text.startsWith('Answer this: ')), 'B2: the unknown items stay on the to-do list as "Answer this: …"');
  flip('UNKNOWN_SCORES_ZERO', () => { const e2 = L.evaluate(r, TQ); ok(e2.pts === 28 && e2.max === 28 && e2.pct === 100 && L.scoreSub(e2).startsWith('28 of 28 points on the 14 questions you answered (of 18).'), 'B2 off: unknown is left out of the points again (the council\'s item 1 wording)'); ok(L.method(e2)[0] === 'Points per answer: Yes 2 · Planned, not done yet 1 · No 0. A question not answered yet is left out of the points.' && !L.method(e2).some(t => /counts as 0 points/.test(t)), 'B2 off: the working-out says so'); });
  ok(L.method(e).some(t => t.startsWith('Team judgement: a question not answered yet counts as 0 points')), 'B2: listed in "How this was worked out" as team judgement');
  // the less you know, the lower the score: never the reverse
  for (let k = 0; k <= 8; k++) { const a = L.evaluate(mk('fo-4', [], rep('k', k)), TQ), b = L.evaluate(mk('fo-4', [], rep('k', k + 1 > 8 ? 8 : k + 1)), TQ); ok((b.pct == null ? -1 : b.pct) <= (a.pct == null ? 101 : a.pct), 'B2: one more "Don\'t know yet" never raises the score (' + k + ')'); }
  // B5
  SENS.forEach(id => { // v2.7.0: the data's 12 sensitive use cases (was: the register's high-risk list and the sens add-on)
    const e5 = L.evaluate(mk(id, [], []), TQ), m5 = L.resultModel(mk(id, [], []), env);
    ok(e5.level === 'almost' && e5.pct === 100 && eq(e5.held, ['sensitive']) && e5.must.allYes, id + ': all Yes, 100%, but no top verdict (held: sensitive, v2.7.0)');
    ok(m5.reason === C.SENSITIVE_HOLD && m5.reasonShown === '' && m5.levelLine === C.ALMOST_HELD && m5.flag === C.SENSITIVE_FLAG && m5.boxLine === C.SENS_BOX && m5.first[0].text === C.ADVISER, id + ': the result says why once (v2.8.0 B4: box line, flag, "Ask an adviser before a pilot"; the hold reason stays in the method)');
    ok(!/\b(must|requires?|applies|obliged|illegal|unlawful)\b/i.test(m5.reason + C.ALMOST_HELD), id + ': the reason makes no legal claim');
  });
  flip('SENSITIVE_HOLDS_TOP', () => { const e5 = L.evaluate(mk('hr-2', [], []), TQ); ok(e5.level === 'ready' && e5.held.length === 0 && L.resultModel(mk('hr-2', [], []), env).flag === C.SENSITIVE_FLAG && !L.method(e5).some(t => /does not get the top verdict/.test(t)), 'B5 off: the top verdict is possible again; the flag (item 7) stays'); });
  ok(Object.keys(TQ.uses).filter(id => L.evaluate(mk(id, [], []), TQ).level !== 'ready').sort().join() === SENS.join(), 'B5 (v2.7.0): with all Yes, exactly the 12 sensitive use cases miss the top verdict; the other 87 get it');
  ok(L.method(L.evaluate(mk('fo-4', [], []), TQ)).some(t => t.startsWith('Team judgement: a use case that involves people’s personal data or jobs does not get the top verdict')), 'B5: listed in "How this was worked out" as team judgement');
  ok(L.evaluate(mk('hr-2', ['n'], []), TQ).level === 'notready' && L.evaluate(mk('hr-2', ['n'], []), TQ).held.length === 0, 'B5: only the top verdict is held; a must-have No is still "Not ready yet"');
  // B6
  // v2.6 (owner): a No on any of questions 2 to 5 holds (v2.5 had left question 4 out); the new question 3 and 4 titles and outcomes
  [['q2', 'Return', 'Probably not worth it'], ['q3', 'Information to learn from', 'Too few examples to learn from'], ['q4', 'Safety net', 'A rule-based tool or a person is the better choice'], ['q5', 'Proof', 'Define success first']].forEach(([q, title, out]) => {
    const r6 = mk('fo-4', [], []); r6.Q[q] = 'n'; const e6 = L.evaluate(r6, TQ);
    ok(e6.level === 'almost' && eq(e6.held, ['carried']) && e6.pct === 100, 'B6: a No on ' + q + ' blocks the top verdict');
    ok(e6.reason === 'Because you answered No in step 2 to “' + title + '” (' + out + '). The top verdict is held back until that is settled.', 'B6: the reason is shown: ' + e6.reason);
  });
  let r6 = mk('fo-4', [], []); r6.Q.q3 = 'u';
  ok(L.evaluate(r6, TQ).level === 'almost' && eq(L.evaluate(r6, TQ).held, ['notsure']), 'B6 / v2.5 (owner O2): a "Not sure" in step 2 now holds the top verdict too (was: only a No)');
  r6 = mk('fo-4', [], []); r6.Q.q3 = 'n';
  flip('CARRIED_NO_HOLDS_TOP', () => ok(L.evaluate(r6, TQ).level === 'ready' && L.resultModel(r6, env).ai.carried.length === 1, 'B6 off: the No is carried as a condition only'));
  ok(L.method(L.evaluate(r6, TQ)).some(t => /^Team judgement: a No on question 2, 3, 4 or 5 of step 2 holds the top verdict back until it is settled\.$/.test(t)), 'B6 (v2.6 wording: question 4 holds too): listed in "How this was worked out" as team judgement');
  r6 = mk('hr-2', [], []); r6.Q.q5 = 'n'; const both = L.evaluate(r6, TQ);
  ok(eq(both.held, ['sensitive', 'carried']) && both.reason.startsWith(C.SENSITIVE_HOLD + ' Also because you answered No in step 2 to “Proof”'), 'B5 + B6 together: both reasons, in one sentence each');
  // the switches are named in the source where the owner flips them
  ok(/var JUDGEMENT = \{ UNKNOWN_SCORES_ZERO: true, SENSITIVE_HOLDS_TOP: true, CARRIED_NO_HOLDS_TOP: true,\n\s+ALMOST_MIN_MUST_YES: 50, READY_MIN_TAIL_YES: 50, NOT_SURE_HOLDS_TOP: true, NONE_BEST_ALMOST: true \};/.test(rd('src/logic.js')), 'one named constant each, in one block of src/logic.js');
  // owner decisions kept: the cap, the names, the percentage
  ok(L.evaluate(mk('fo-4', ['pl'], []), TQ).cap && C.LEVELS.ready.name === 'Ready to start a pilot' && C.STOP.head === 'This is not suitable for AI.' && C.QUESTIONS.length === 5 && C.MUSTS.length === 10 && Object.keys(TQ.uses).length === 98, 'kept: must-haves cap, verdict name, Q1 stop wording, five questions (v2.8.0 B10: no letters), ten must-haves, 98 use cases (v2.8.0)');
}

// ====================================================================================================================
// M6: "None of these fits"
// ====================================================================================================================
{
  const m = L.resultModel(mk('none', [], []), env);
  // v2.5 (owner O4): none + all Yes is "Almost ready" with the council's line (was "Ready" with the v2.1 line)
  ok(m.level === 'almost' && m.levelLine === 'No use case chosen: the must-haves are in place, but nothing was checked for a particular tool.' && !/use case needs/.test(m.levelLine) && m.mustOnly === C.MUST_ONLY, 'M6: none + all Yes: the line does not speak of "this use case"; the limit is named');
  ok(!/use case needs/.test(pdfText(mk('none', [], []))), 'M6: nor does the PDF');
}

// ====================================================================================================================
// M1: snapshots are keyed by use case and rules
// ====================================================================================================================
{
  const snap = (use, musts, tail, at) => L.snapshot(L.evaluate(mk(use, musts, tail), TQ), at, use);
  const a = snap('rm-1', [], [], '2026-11-20T09:00:00.000Z'), b = snap('rm-2', [], rep('n', 9), '2026-11-21T09:00:00.000Z'), c = snap('rm-1', ['p'], [], '2026-11-22T09:00:00.000Z');
  ok(a.use === 'rm-1' && a.rules === L.RULES && F.reduce(storeWith(mk('rm-1', [], [])), 'snap', a, ENV).store.checks.trm1x.snaps[0].use === 'rm-1', 'M1: a snapshot carries its use case and rules, and keeps them through the store');
  ok(L.since([a, b]) === null, 'M1: rm-1 at 100%, then rm-2: no "Since last time" (two different use cases are never compared)');
  const s = L.since([a, b, c]);
  ok(s && s.compared && s.head === 'Since last time (20 Nov 2026)' && s.lines.includes('Must-haves at Yes: 10 → 9 of 10.') && s.earlier.length === 1, 'M1: back on rm-1 with one answer changed: the two rm-1 results are compared, rm-2 is left out');
  ok(!L.sameSnap(a, Object.assign({}, a, { use: 'rm-2' })) && !L.sameSnap(a, Object.assign({}, a, { rules: 'v2 (24 Nov 2026)' })) && L.sameSnap(a, Object.assign({}, a)), 'M1: the same numbers for another use case or other rules are a new snapshot');
  ok(eq(L.snapsOf([a, b, c]).map(x => x.at), [a.at, c.at]), 'M1: only this use case\'s history goes into a shared copy (shareDoc uses snapsOf)');
  ok(!/shareDoc/.test(rd('src/app.js')), 'M1 (v2.7.0): no share document: the standalone tool shares nothing');
  // results kept under rules v2.0: listed, marked, never compared line by line
  const old = { at: '2026-11-24T08:00:00.000Z', level: 'almost', pct: 83, pts: 25, max: 30, known: 15, total: 17, mustYes: 7, mustN: 10, rules: 'v2 (24 Nov 2026)' };
  const now = L.snapshot(L.evaluate(mk('fo-4', ['y', 'y', 'pl', 'y', 'k', 'y', 'p'], []), TQ), '2026-11-24T12:00:00.000Z', 'fo-4');
  const so = L.since([F.reduce(storeWith(mk('fo-4', [], [])), 'snap', old, ENV).store.checks.tfo4x.snaps[0], now]);
  ok(so && !so.compared && so.head === 'Your earlier result (24 Nov 2026)' && so.lines[0] === 'It was worked out with earlier rules (v2 (24 Nov 2026)), so it is not compared line by line with today’s.' && so.lines[1] === 'Then: Almost ready, 83%, 7 of 10 must-haves at Yes.', 'v2.0 history: "worked out with earlier rules", stated, not compared');
  ok(so.earlier[0].endsWith('(worked out with earlier rules)') && !so.lines.some(t => /→/.test(t)), 'v2.0 history: marked in the list of earlier results; no arrows');
  const so2 = L.since([old, now, Object.assign({}, now, { at: '2026-11-25T09:00:00.000Z', mustYes: 9 })]);
  ok(so2.compared && so2.lines.includes('Must-haves at Yes: 7 → 9 of 10.') && so2.earlier.length === 2 && so2.earlier[1].endsWith('(worked out with earlier rules)'), 'v2.0 history: once there are two results under the new rules they are compared; the old one stays marked');
}

// ====================================================================================================================
// H1 + M2: a shared copy belongs to its check, on any step
// ====================================================================================================================
{
  /* v2.8.1 (inventory D3): sharing is gone; old share fields in a store are read harmlessly and dropped */
  const a = mk('fo-4', [], [], { id: 'chkA', sharedAt: '2026-11-24T10:00:00.000Z', sharedMode: 'shared', sharedSig: 'x', share: { named: true } }), b = mk('rm-1', [], [], { id: 'chkB' });
  const s = storeWith(a, b); s.cur = 'chkB';
  ok(['shared', 'unshared', 'share'].every(e => !F.reduce(s, e, { id: 'chkA', at: 'x' }, ENV).ok), 'D3: no share events');
  const back = F.migrate(JSON.parse(JSON.stringify(s)), ENV, {});
  ok(back && !('sharedAt' in back.checks.chkA) && !('share' in back.checks.chkA) && back.checks.chkA.use === 'fo-4', 'D3: a record with old share fields opens, without them');
  const app = rd('src/app.js');
  ok(!/withdraw that copy first from its result page/.test(app) && !/rm-withdraw|data-act="unshare"/.test(app), 'H1 (v2.7.0): no sharing, so no withdraw buttons and no dead-end sentence');
}

// ====================================================================================================================
// M5: the questions a check was answered against
// ====================================================================================================================
{
  ok(Object.keys(TQ.uses).every(k => /^[0-9a-f]{10}$/.test(TQ.uses[k].sig) && TQ.uses[k].sig === tqSig(QBY[k].questions)) && eq(D.tq, tqModel(Q, JSON.parse(rd('data/must-meta.json')), JSON.parse(rd('data/v27-sigs.json')).sigs, JSON.parse(rd('data/actions_questions_only.json')).actions)), 'M5: every use case carries the signature of its questions, built by build.mjs');
  const qs = JSON.parse(JSON.stringify(QBY['rm-1'].questions)); const before = tqSig(qs); qs[0].text = qs[0].text.replace('?', ' today?');
  ok(tqSig(qs) !== before && tqSig(qs.slice(0, -1)) !== before && tqSig(JSON.parse(JSON.stringify(QBY['rm-1'].questions))) === before, 'M5: the signature changes when a text changes or a question is dropped, and only then');
  let s = storeWith(mk('rm-1', [], [], { step: 'where' }));
  s = F.reduce(s, 'use', 'rm-2', ENV).store; ok(F.cur(s).tqSig === ENV.sig['rm-2'], 'M5: choosing a use case records its signature');
  // a finished check whose questions changed since: step 5 again, with a notice
  const done1 = mk('rm-1', [], []); done1.tqSig = ENV.sig['rm-1'];
  let info = {}; let c = F.cleanRec(JSON.parse(JSON.stringify(done1)), ENV, info);
  ok(c.step === 'result' && Object.keys(c.T).length === TQ.uses['rm-1'].qs.length && !info.questionsChanged, 'M5: same questions: the check opens on its result');
  const env2 = Object.assign({}, ENV, { sig: Object.assign({}, ENV.sig, { 'rm-1': 'ffffffffff' }) }); info = {};
  c = F.cleanRec(JSON.parse(JSON.stringify(done1)), env2, info);
  ok(c.step === 'tailored' && eq(c.T, {}) && eq(c.TBy, {}) && info.questionsChanged === true && c.tqSig === 'ffffffffff' && c.use === 'rm-1' && Object.keys(c.A).length === 10, 'M5: questions changed → the tailored answers are dropped, the check reopens on step 5, the page is told; the must-haves are kept');
  ok(C.QUESTIONS_CHANGED === 'The questions for this use case changed since you answered. Please answer step 5 again.', 'M5: the notice (the audit\'s wording)');
  info = {}; const st = F.migrate({ v: 2, cur: done1.id, checks: { [done1.id]: JSON.parse(JSON.stringify(done1)) } }, env2, info);
  ok(info.questionsChanged && F.cur(st).step === 'tailored', 'M5: the same through the store (migrate)');
  // a use case that left the catalogue, from storage and from a file
  const gone = JSON.parse(JSON.stringify(mk('rm-1', [], []))); gone.use = 'rm-77'; info = {};
  c = F.cleanRec(gone, ENV, info); ok(c.use === '' && c.step === 'where' && info.useChanged === true, 'M5: an unknown use id opens on step 4 and is said (it was silent)');
  const renamed = JSON.parse(JSON.stringify(mk('rm-1', [], []))); renamed.useName = 'An older name'; info = {};
  c = F.cleanRec(renamed, ENV, info, { file: true }); ok(c.use === '' && c.step === 'where' && info.useChanged === true, 'M5: a renamed use case from a file is said too');
  ok(/r = F\.cleanRec\(o\.check, ENV, info, \{ file: true \}\)/.test(rd('src/app.js')) && /send\('import', r, \{ notice: ui\.fileInfo, older: ui\.fileOlder, gone: ui\.fileGone \}\)/.test(rd('src/app.js')), 'M5: openFileText passes what was lost on to the notice');
  // v2.0 records carry no signature: their answers are kept
  info = {}; const v20 = JSON.parse(JSON.stringify(mk('rm-1', [], []))); delete v20.tqSig; delete v20.from;
  c = F.cleanRec(v20, ENV, info); ok(c.step === 'result' && !info.questionsChanged && c.tqSig === ENV.sig['rm-1'], 'M5: a record without a signature (v2.0) keeps its answers and takes today\'s signature');
}

// ====================================================================================================================
// M3: two tabs
// ====================================================================================================================
{
  const a = mk('rm-1', [], [], { id: 'tabA', step: 'tailored' }), fresh = F.blank('tabB');
  const mine = storeWith(a), theirs = { v: 2, cur: 'tabB', checks: { tabA: JSON.parse(JSON.stringify(a)), tabB: fresh } };
  let m = F.mergeTabs(mine, theirs);
  ok(m.store.cur === 'tabA' && F.cur(m.store).step === 'tailored' && m.elsewhere === null && !m.store.checks.tabB, 'M3: tab B starts a new check → tab A stays on step 5 of rm-1, no message; B\'s blank check is not taken over');
  const bRec = mk('fo-4', [], [], { id: 'tabB', step: 'must' }); theirs.checks.tabB = bRec;
  m = F.mergeTabs(mine, theirs); ok(m.store.cur === 'tabA' && m.store.checks.tabB && m.store.checks.tabB.use === 'fo-4' && m.elsewhere === null, 'M3: once B\'s check has answers it is listed in A as well');
  ok(F.mergeTabs(storeWith(bRec), { v: 2, cur: 'tabA', checks: { tabA: a, tabB: bRec } }).store.checks.tabA.use === 'rm-1', 'M3: and A\'s check is listed in B');
  const changed = JSON.parse(JSON.stringify(a)); changed.A.m1 = 'n';
  m = F.mergeTabs(mine, { v: 2, cur: 'tabA', checks: { tabA: changed } });
  ok(m.elsewhere === 'changed' && F.cur(m.store).A.m1 === 'y', 'M3: the open check changed in another tab → said, and this tab keeps its own answers until the person loads the other version');
  const moved = JSON.parse(JSON.stringify(a)); moved.step = 'must'; moved.snaps = [{ at: '2026-11-24T10:00:00.000Z', level: 'ready' }];
  m = F.mergeTabs(mine, { v: 2, cur: 'tabA', checks: { tabA: moved } });
  ok(m.elsewhere === null && F.cur(m.store).step === 'tailored' && F.cur(m.store).snaps.length === 1, 'M3: the same answers on another step are no change; the other tab\'s history is taken over (v2.8.1: no share state)');
  m = F.mergeTabs(mine, { v: 2, cur: 'tabB', checks: { tabB: bRec } });
  ok(m.elsewhere === 'removed' && m.store.checks.tabA && m.store.cur === 'tabA', 'M3: removed in another tab → said, kept here');
  ok(F.mergeTabs(storeWith(F.blank('tabC')), { v: 2, cur: 'tabB', checks: { tabB: bRec } }).elsewhere === null, 'M3: a blank open check that another tab dropped is no news');
  ok(C.ELSEWHERE.changed === 'This check was changed in another tab.' && F.CUR_KEY === 'hftp-readiness2q-cur' && /sessionStorage\.setItem\(F\.CUR_KEY, store\.cur\)/.test(rd('src/app.js')), 'M3: the open check is kept per tab (sessionStorage), with the audit\'s line');
  // the tab's own check wins over the store's on load
  const info = { keep: 'tabA' }; const st = F.migrate({ v: 2, cur: 'tabB', checks: { tabA: a, tabB: bRec } }, ENV, info);
  ok(st.cur === 'tabA' && F.migrate({ v: 2, cur: 'tabB', checks: { tabA: a, tabB: bRec } }, ENV, { keep: 'gone' }).cur === 'tabB' && F.migrate({ v: 2, cur: 'tabB', checks: { tabA: a, tabB: bRec } }, ENV, {}).cur === 'tabB', 'M3: migrate opens the tab\'s check when it still exists, else the store\'s');
}

// ====================================================================================================================
// M4 + L10: Back never goes dead
// ====================================================================================================================
{
  const h = (step, d, id) => F.histRead({ r2: step, d, prev: null, id });
  const at = (o) => Object.assign({ id: 'me', d: 6, step: 'start', placed: 'start', run: 0 }, o);
  ok(F.histSkip(h('result', 5, 'old'), at({ placed: 'start' })) === -1, 'M4: after "Start a new check", Back passes over the old check\'s entry');
  ok(F.histSkip(h('q', 7, 'old'), at({ placed: 'start' })) === 1, 'M4: and Forward passes over one in the other direction');
  ok(F.histSkip(h('q', 5, 'me'), at({ placed: 'q', step: 'must' })) === 0, 'M4: an entry of the open check is read as before');
  ok(F.histSkip(F.histRead(null), at({})) === 0 && F.histSkip(F.histRead({ foo: 1 }), at({})) === 0, 'M4: a foreign entry (the hub, a hash) is never passed over by this rule');
  ok(F.histSkip(h('result', 5, 'old'), at({ run: 60 })) === 0, 'M4: bounded (no endless run)');
  // walk a whole stack: finish a check, "Start a new check", press Back
  const stack = ['start', 'hotel', 'q', 'must', 'where', 'tailored'].map((s, i) => h(s, i, 'old')).concat([h('start', 6, 'me')]);
  let pos = 6, d = 6, run = 0, left = false;
  for (;;) { pos--; if (pos < 0) { left = true; break; } const dir = F.histSkip(stack[pos], { id: 'me', d, step: 'start', placed: stack[pos].step, run }); d = stack[pos].d; if (!dir) break; run++; }
  ok(left && run === 6, 'M4: one Back press runs through all six old entries and leaves the tool (it took seven presses)');
  // L10: stop reached through "Change answers from the start"
  const recStop = mk('fo-4', [], [], { id: 'me' }); recStop.Q.q1 = 'y'; const ctx = F.ctxOf(recStop, ENV);
  const st2 = ['start', 'hotel', 'q', 'must', 'where', 'tailored', 'result', 'q', 'stop'].map((s, i) => h(s, i, 'me'));
  const shown = []; pos = 8; d = 8; let step = 'stop';
  for (let press = 0; press < 4 && pos > 0; press++) {
    run = 0;
    for (;;) { pos--; if (pos < 0) break; const e = st2[pos], dir = F.histSkip(e, { id: 'me', d, step, placed: F.placeStep(e.step, ctx), run }); d = e.d; if (!dir) { step = F.placeStep(e.step, ctx); shown.push(step); break; } run++; }
  }
  ok(eq(shown, ['q', 'hotel', 'start']), 'L10: from stop after "Change answers", Back shows q, then hotel, then the cover; never the stop screen again: ' + shown);
  ok(F.histSkip(h('must', 3, 'me'), { id: 'me', d: 2, step: 'q', placed: 'stop', run: 0 }) === 0, 'L10: going forward, an unreachable step is still placed (Forward to the stop screen works as before)');
  ok(/var dir = F\.histSkip\(h, \{ id: rec\.id, d: hist\.d, step: rec\.step, placed: F\.placeStep\(h\.step, ctx\(\)\), run: run \}\);/.test(rd('src/app.js')), 'M4: the popstate handler asks histSkip');
}

// ====================================================================================================================
// M7: the team page (the page itself: tests/browser/v21.cjs)
// ====================================================================================================================
{
  const team = rd('../readiness-check/src/team.js'), built = rd('../readiness-check/team.html');
  ok(/whose use case is no longer in the catalogue/.test(team) && /function dynGone/.test(team), 'M7b: a "Do you need AI?" copy with an unknown use id has its own count and is listed');
  ok(/Do you need AI\? \(rules /.test(team) && /Earlier Readiness check \(rules /.test(team) && /Score: n%/.test(team), 'M7a: the rules card has a block for each kind of copy');
  ok(built.includes('"highRisk":["res-8","hr-2","hr-5"]') && built.includes("RULES = 'v2.6 (24 Nov 2026)'"), 'M7: the team page is rebuilt with the current rules (v2.6) and the high-risk list');
  ok(!/[A-Z]{3}-\d{3}-\d{2}/.test(rd('src/app.js')) && /Research record entries/.test(team), 'item 8: the ids are shown on the Team tab only');
}

// ====================================================================================================================
// Low
// ====================================================================================================================
{
  const app = rd('src/app.js');
  // L1
  ok(/setTimeout\(function \(\) \{ dlSend\('made'\); saveFile\(name, blob\); \}, 30\);/.test(app) && F.dlNext('making', 'start') === null, 'L1: "Save as file" goes through the same later tick as the PDF, so the second click meets a busy machine');
  // L2
  ok(/function clearProfile\(k\)/.test(app) && /if \(ev === 'hotel' && arg\.v === '' && arg\.k !== 'role'\) clearProfile\(arg\.k\);/.test(app), 'L2: an emptied field is taken out of the shared profile (browser test: clear, reload, still empty)');
  let s = storeWith(F.blank('h1')); s = F.reduce(s, 'begin', null, ENV).store; s = F.reduce(s, 'hotel', { k: 'name', v: 'Hotel Secret' }, ENV).store; s = F.reduce(s, 'hotel', { k: 'name', v: '' }, ENV).store;
  ok(F.cur(s).hotel.name === '' && !F.reduce(s, 'profile', {}, ENV).ok, 'L2: the field can be emptied in the record; an empty profile fills nothing back');
  // L3 + L9
  s = F.blankStore(); let r = F.reduce(s, 'preselect', 'fo-1', ENV); const first = r.store.cur;
  ok(r.ok && F.cur(r.store).from === 'link' && F.cur(r.store).use === 'fo-1' && !F.listed(F.cur(r.store)), 'L3/L9: a check started by a link is marked and not listed until something is answered');
  r = F.reduce(r.store, 'preselect', 'fo-2', ENV); r = F.reduce(r.store, 'preselect', 'fo-3', ENV);
  ok(Object.keys(r.store.checks).length === 1 && F.cur(r.store).use === 'fo-3' && !r.store.checks[first], 'L9: three old links leave one unlisted check, not three listed ones');
  let w = F.reduce(storeWith(mk('rm-1', [], [], { step: 'where', from: 'link' })), 'use', 'rm-2', ENV);
  ok(F.cur(w.store).from === '' && F.listed(F.cur(w.store)), 'L3: a use case the person chooses is no longer "from a link"');
  const linked = F.blank('lk1'); linked.use = 'fo-1'; linked.dept = 'fo'; linked.cat = 'Guest-facing'; linked.from = 'link'; linked.Q.q1 = 'y';
  ok(F.listed(linked) && F.cleanRec(JSON.parse(JSON.stringify(linked)), ENV, {}).from === 'link', 'L9: once something is answered it is listed; the mark survives a reload');
  ok(/var pre = rec\.from === 'link' \? USE\[rec\.use\] : null/.test(app), 'L3: "You came here for…" only for a use case that came from a link');
  // L4
  const many = { v: 2, cur: 'chk51', checks: {} };
  for (let i = 0; i < 52; i++) { const c = mk('rm-1', [], [], { id: 'chk' + i }); c.updated = '2026-11-' + String(1 + (i % 28)).padStart(2, '0') + 'T10:' + String(i).padStart(2, '0') + ':00.000Z'; many.checks[c.id] = JSON.parse(JSON.stringify(c)); }
  many.checks.chk51.step = 'hotel'; many.checks.chk51.updated = '2026-01-01T00:00:00.000Z'; // the open check is the oldest by date
  let mg = F.migrate(many, ENV, {});
  ok(Object.keys(mg.checks).length === 52 && mg.cur === 'chk51' && mg.checks.chk51.step === 'hotel', 'L4 (v2.8.0 B7): 52 checks, reload → all 52 kept (a check is never dropped automatically), and the open check is still open');
  const dropped = Object.keys(many.checks).filter(k => !mg.checks[k]).map(k => many.checks[k].updated).sort(), keptOldest = Object.keys(mg.checks).filter(k => k !== 'chk51').map(k => mg.checks[k].updated).sort()[0];
  ok(dropped.length === 0, 'L4 (v2.8.0 B7): no check is left out on load');
  const fullS = { v: 2, cur: 'chk0', checks: {} }; for (let i = 0; i < 50; i++) { fullS.checks['chk' + i] = mk('rm-1', [], [], { id: 'chk' + i }); }
  r = F.reduce(fullS, 'new', null, ENV); ok(!r.ok && r.full === true && r.store === fullS, 'L4: a 51st check is refused with a reason ("new")');
  ok(F.reduce(fullS, 'preselect', 'fo-4', ENV).full === true && F.reduce(fullS, 'import', mk('fo-4', [], [], { id: 'brandnew' }), ENV).full === true && F.reduce(fullS, 'import', mk('fo-4', [], [], { id: 'chk7' }), ENV).ok, 'L4: so are a link and a new file; a file that replaces a check here is not');
  ok(C.TOO_MANY === 'This browser keeps at most 50 checks. Remove one you no longer need first.' && /if \(r\.full\) toast\(C\.TOO_MANY\)/.test(app), 'L4: the person is told');
  // L5
  const envT = Object.assign({}, ENV, { today: '2026-11-24' });
  s = storeWith(mk('fo-4', ['pl'], [], { step: 'must' }));
  ok(!F.reduce(s, 'by', { id: 'm1', date: '2001-01-01' }, envT).ok && !F.reduce(s, 'by', { id: 'm1', date: '2026-11-23' }, envT).ok && F.reduce(s, 'by', { id: 'm1', date: '2026-11-24' }, envT).ok && F.reduce(s, 'by', { id: 'm1', date: '' }, envT).ok, 'L5: a date in the past is refused; today and later are fine; clearing is fine');
  const od = mk('fo-4', ['pl'], []); od.By.m1 = '2001-01-01';
  ok(F.cleanRec(JSON.parse(JSON.stringify(od)), ENV, {}).By.m1 === '2001-01-01', 'L5: a past date saved earlier is kept');
  const om = L.resultModel(od, env);
  ok(om.first[0].text.startsWith('Finish by 1 Jan 2001 (overdue): ') && om.itemList[0].answer === 'Planned (was planned by 1 Jan 2001, overdue)' && !/\(planned by 1 Jan 2001\)/.test(P.model(od, env).blocks.map(b => [b.t, b.sub].join(' ')).join('\n')), 'L5: and shown as overdue: "Finish by 1 Jan 2001 (overdue): …" (v2.8.0) and "was planned by 1 Jan 2001, overdue" (screen and PDF)');
  ok(/min="' \+ L\.localIso\(\) \+ '"/.test(app), 'L5: the date field has min = today');
  // L6
  ok(/if \(storage !== 'ok'\) h \+= '<p class="meta" id="no-keep">'/.test(app) && C.NO_KEEP === 'This browser is not keeping checks. Save a file to keep one.' && !/test copy in this browser/.test(app), 'L6: with storage not ok, no "kept here until you remove it" (v2.7.0: no test copies at all)');
  // L7
  const stopRec = finished(F, D, '', { Q: { q1: 'y' }, A: {}, step: 'stop' }); // v2.6: Q1 Yes stops
  ok(P.model(stopRec, env).blocks[0].t === 'Can AI solve your problems? Not suitable for AI' && !/score/i.test(P.model(stopRec, env).blocks[0].t) && P.model(mk('fo-4', [], []), env).blocks[0].t === 'Can AI solve your problems? Result' && L.resultModel(mk('fo-4', [], []), env).title === 'Can AI solve your problems? Result', 'L7: one title on the screen and in the PDF; the stop PDF has no "score" in its title');
  // L8
  ok(C.OLD_FILE === 'This file is from the earlier Readiness check. It cannot be opened here.' && /o\.kind === OLD_KIND\) old = true/.test(app) && /var OLD_KIND = 'hftp-readiness-check'/.test(app) && !/readiness-check\/index\.html/.test(app), 'L8: a file of the earlier Readiness check gets its own message (v2.7.0: no link to another tool)');
  ok(/kind: 'hftp-readiness-check'/.test(rd('../readiness-check/src/check.js')) && /This check was replaced by “Do you need AI\?” on 24 Nov 2026/.test(rd('../readiness-check/src/check.js')) && rd('../readiness-check/index.html').includes('This check was replaced by “Do you need AI?” on 24 Nov 2026'), 'L8: the old page says it was replaced, and still saves files of that kind');
  ok(C.SOURCES.mustNote.includes('The wording follows the team’s earlier readiness check.') && !/the hub’s earlier readiness check/.test(rd('src/content.js')), 'L8: the sources note says "the team\'s earlier readiness check"');
  // L11
  const sh = mk('fo-4', [], [], { sharedAt: '2026-11-01T10:00:00.000Z', sharedMode: 'shared', sharedSig: 'abc', share: { named: true } });
  const ff = F.forFile(sh);
  ok(!['sharedAt', 'sharedMode', 'sharedSig', 'share'].some(k => k in ff) && eq(ff.T, sh.T), 'L11 / BUILD NOW 9 (v2.8.1): the file carries no share fields');
  ok(!('sharedAt' in F.cleanRec(JSON.parse(JSON.stringify(sh)), ENV, {}, { file: true })) && !('sharedAt' in F.cleanRec(JSON.parse(JSON.stringify(sh)), ENV, {})), 'L11: share fields in a file or a store (v2.0 had them) are ignored on opening (v2.8.1: from storage too)');
  ok(!('sharedAt' in F.cur(F.reduce(F.blankStore(), 'import', JSON.parse(JSON.stringify(sh)), ENV).store)), 'L11: an imported check has no share fields');
  // L12
  ok(F.CORRUPT_KEY === 'hftp-readiness2q-v1-corrupt' && /localStorage\.setItem\(F\.CORRUPT_KEY, x\.corrupt\)/.test(app) && /id="corrupt"/.test(app) && C.CORRUPT.startsWith('The checks saved in this browser could not be read'), 'L12: unreadable saved data is set aside under its own key and said once');
  ok(F.migrate(5, ENV, {}) === null && F.migrate({ v: 0 }, ENV, {}) === null, 'L12: junk that parses is unreadable too');
  // L13
  ok(eq(L.tailRange(TQ), [6, 12]) && /id="cover-range" data-min="' \+ range\[0\] \+ '" data-max="' \+ range\[1\]/.test(app) && !/Six to ten questions/.test(app) && !/6 to 10 questions/.test(rd('README.md')), 'L13: the cover reads the range from the data (six to twelve since v2.7.0); README agrees');
  ok(TQ.matrixTotal === 90 && TQ.nFromWorkbook === 91 && TQ.nDraft === 8 && D.cat.nUses === 98 && C.SOURCES.mustNote.includes('The analysis covered {N} use cases; this tool lists {U}: {D} were added to the catalogue later, “AI use policies and governance” is a document, not a tool, so it was left out of the count, and one use case analysed is no longer listed.'), 'L13 (v2.8.0 B9): the must-haves note says why 90 is not 98 (90 + 8 later + 1 document − 1 no longer listed), with numbers read from the data');
  ok(!/90 of the catalogue’s 99 use cases: 8 were added/.test(pdfText(mk('fo-4', [], []))) && !/\{[NUD]\}/.test(pdfText(mk('fo-4', [], []))), 'L13: v2.7: the PDF has no sources, so no source text with the three numbers; no placeholder left');
  // print
  ok(/addEventListener\('beforeprint'/.test(app) && /details\.fold/.test(app) && /addEventListener\('afterprint'/.test(app), 'print: the result\'s folds are opened for printing and closed again');
}

// ====================================================================================================================
// Records saved by the v2.0 build still open
// ====================================================================================================================
{
  const raw = JSON.parse(rd('tests/fixtures/v2.0-store.json')), file = JSON.parse(rd('tests/fixtures/v2.0-file.json'));
  ok(raw.v === 2 && Object.keys(raw.checks).length === 5 && Object.values(raw.checks).every(c => c.tqSig === undefined && c.from === undefined), 'fixture: a v2.0 store with five checks, none with the v2.1 fields');
  const info = {}, st = F.migrate(JSON.parse(JSON.stringify(raw)), ENV, info);
  ok(st && Object.keys(st.checks).length === 5 && st.cur === raw.cur && !info.newer && !info.questionsChanged && !info.useChanged && !st.notice, 'v2.0 store: all five checks open, nothing lost, no notice');
  Object.keys(raw.checks).forEach(k => {
    const a = raw.checks[k], b = st.checks[k];
    // v2.6: step 2 is read in its old meaning: Q1 turned round, the old Q3/Q4 dropped, so a check past step 2 waits on step 2 again
    const conv = L.legacyQ(a.Q).Q, qDone = F.QIDS.every(q => conv[q]);
    const want = ['start', 'hotel'].includes(a.step) ? a.step : conv.q1 === 'y' ? (a.step === 'q' ? 'q' : 'stop') : a.step === 'q' || !qDone ? 'q' : a.step; // v2.7.1: blank and old answers do not hold a check (the step it was saved on)
    ok(b.step === want && eq(b.Q, conv) && b.qv === L.QV && eq(b.A, noK(a.A)) && eq(b.By, a.By) && eq(b.T, carryT(a.use, a.T)) && eq(b.TBy, carryT(a.use, a.TBy)) && b.use === a.use && eq(b.hotel, a.hotel) && !('sharedAt' in b) && b.snaps.length === a.snaps.length, 'v2.0 check ' + a.step + ' / ' + (a.use || 'no use') + ': step, answers, dates, hotel and history are kept (v2.8.1: the share state is dropped)');
    if (a.step === 'result') { const m = L.resultModel(b, env); /* v2.3: worked out even where the check now waits on step 3 or 5 */ ok(/^(Score: \d+%|No score yet: )/.test(m.scoreHead) && m.reason && m.method.length > 8, 'v2.0 check ' + a.use + ': the result is worked out with rules v2.1 (' + m.levelName + ', ' + m.scoreHead + ')'); }
  });
  const rm1 = Object.values(st.checks).find(c => c.use === 'rm-1');
  ok(!('sharedAt' in rm1) && rm1.snaps.length === 1 && rm1.snaps[0].rules === 'v2 (24 Nov 2026)' && rm1.snaps[0].use === '', 'v2.0 check rm-1: one snapshot under rules v2 (v2.8.1: no share state)');
  // v2.3: rm-1 holds old answers (m5 Partly, sk1 Partly, te1 Doesn't apply), so it opens on step 3; the person picks again first
  let s3 = Object.assign({}, st, { cur: rm1.id }); const go3 = (ev, arg) => { const x = F.reduce(s3, ev, arg, ENV); s3 = x.store; return x.ok; };
  ok(F.cur(s3).step === 'q' && go3('answer', { id: 'q3', value: 'y' }) && go3('answer', { id: 'q4', value: 'y' }) && go3('next') && F.cur(s3).step === 'must' && go3('answer', { id: 'm5', value: 'pl' }) && go3('next') && go3('next') && go3('answer', { id: 'rm-1.sk1', value: 'pl' }) && go3('answer', { id: 'rm-1.te1', value: 'y' }) && go3('answer', { id: 'rm-1.n1', value: 'y' }) && go3('next') && F.cur(s3).step === 'result', 'v2.0 check rm-1 (v2.3, v2.6): answers the new questions 3 and 4, picks again on steps 3 and 5, then its result');
  const sn = L.snapshot(L.evaluate(F.cur(s3), TQ), '2026-11-25T09:00:00.000Z', rm1.use), after = F.reduce(s3, 'snap', sn, ENV).store.checks[rm1.id];
  ok(!L.sameSnap(rm1.snaps[0], sn) && after.snaps.length === 2, 'v2.0 check rm-1: on its first v2.1 visit a new snapshot is kept beside the old one');
  const sc = L.since(after.snaps);
  ok(sc && !sc.compared && sc.lines[0].includes('worked out with earlier rules') && sc.earlier[0].endsWith('(worked out with earlier rules)'), 'v2.0 history is marked "worked out with earlier rules", not compared line by line');
  // the file
  ok(file.kind === 'hftp-do-you-need-ai' && file.v === 2 && file.rules === 'v2 (24 Nov 2026)' && file.check.sharedAt, 'fixture: a v2.0 file (it still carried share fields)');
  const fi = {}, fr = F.cleanRec(JSON.parse(JSON.stringify(file.check)), ENV, fi, { file: true });
  ok(fr && fr.step === 'q' && eq(fr.Q, L.legacyQ(file.check.Q).Q) && eq(fr.A, noK(file.check.A)) && eq(fr.T, carryT(file.check.use, file.check.T)) && fr.By.m3 === '2027-03-01' && !('sharedAt' in fr) && !fi.questionsChanged && !fi.useChanged, 'v2.0 file: opens with every other answer kept, on step 2 (v2.6: Q1 turned round, the new questions 3 and 4 to answer; was step 3); its share fields are ignored');
  const imp = F.reduce(F.blankStore(), 'import', fr, ENV);
  ok(imp.ok && F.cur(imp.store).step === 'q' && F.cur(imp.store).id === file.check.id && F.cur(imp.store).Q.q1 === fr.Q.q1, 'v2.0 file: imported (v2.6: on step 2, not turned twice)');
  // the copy v2.0 shared with the team still reads
  const copy = JSON.parse(JSON.parse(rd('tests/fixtures/v2.0-other-keys.json'))['hftp-readiness-checks-v1'])[rm1.id];
  ok(copy.kind === 'dyn' && copy.v === 2 && copy.rules === 'v2 (24 Nov 2026)' && copy.useId === 'rm-1' && typeof copy.pct === 'number', 'fixture: the team copy v2.0 made (message shape unchanged: kind dyn, v 2)');
  ok(!/kind: 'dyn'/.test(rd('src/app.js')), 'v2.7.0: no share document (no hub, no Team tab)');
}
// storage keys and hub messages unchanged
ok(F.KEY === 'hftp-readiness2q-v1' && F.V === 4 && /var PROFILE = 'hftp-hotel-profile-v1'/.test(rd('src/app.js')) && !/hub: '|postMessage/.test(rd('src/app.js')) && /window\.claude\.use\('downloads'\)/.test(rd('src/app.js')), 'v2.7.0: own storage key, store version 4; no hub messages at all; downloads through the artifact capability');
ok(!/AIHA|AI Hospitality Alliance/i.test(rd(PAGE).replace(/<script type="application\/json" id="r2-font">[\s\S]*?<\/script>/, '').replace(/<script>\s*\/\*\* @license[\s\S]*?<\/script>/, '')) , 'the banned source is named nowhere in the page');
done();
