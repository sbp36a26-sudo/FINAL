// The review findings (spec/MASTER_PROMPT.md §1, §8): one check per finding, so every row of REVIEW_RESPONSE.md names a test.
// No review.md was supplied with the spec; the findings are the ones §1 and §8 list. Checks the data the page carries (runtime JSON),
// the full JSON's change log (spec/usecase_questions_v3.json, read only) and the rules (src/rules3.js).
// Run: node tools/readiness-3/tests/review.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, tester, goldenRecord } from './load.mjs';
import { loadV3, goldenCases } from '../lib/data3.mjs';
import { scan, pageText } from '../lib/banned.mjs';
const { ok, done } = tester('review');
const { R3, S } = load();
const { runtime: D, full: F } = loadV3();
const html = readFileSync(join(root, 'index.html'), 'utf8');
const app = readFileSync(join(root, 'src', 'app3.js'), 'utf8');
const G = goldenCases();
const gate = id => /\.[A-Z_]+$/.test(id);
const allQ = D.use_cases.flatMap(u => u.questions.map(q => Object.assign({ use: u.id }, q)));
const shown = [].concat(allQ.map(q => q.text), D.must_haves.map(m => m.text), D.step2.map(s => s.text), Object.values(D.gate_questions).map(q => q.text),
  D.none_fits.questions.map(q => q.text), D.use_cases.flatMap(u => u.gates.map(g => g.text)), Object.values(D.gate_library).map(g => g.text));
const none = re => shown.filter(t => re.test(t));
const run = (n) => R3.evaluate(D, S.answers(D, goldenRecord(S, R3, D, G[n - 1])));

/* T1 "or confirmed possible" → Don't know yet and the Planned help */
ok(!none(/confirmed possible/i).length && app.includes("If your vendor has confirmed it in writing but it isn\\'t set up yet, answer Planned.") && D.answers.check.map(a => a.label).join('|') === "Yes|Planned|No|Don't know yet", 'T1: no "or confirmed possible"; answers Yes / Planned / No / Don\'t know yet with the Planned help');
/* T2 "digital, up to date and ready" */
ok(!none(/digital, up to date|up to date and ready/i).length, 'T2: no "digital, up to date and ready"');
/* T3 cost questions: nice to have, hidden when already paid */
const paidUses = D.use_cases.filter(u => u.gates.some(g => g.id === 'G_PAID' && g.asked));
ok(paidUses.length > 0 && paidUses.every(u => R3.visible(D, u.id, { G_PAID: 'yes' }).every(q => q.area !== 'fi' || gate(q.id))), 'T3: G_PAID = already paid hides the Money questions in all ' + paidUses.length + ' use cases that ask it');
ok(allQ.filter(q => q.area === 'fi' && /cost|fee|price|budget/i.test(q.text)).every(q => q.weight !== 'B'), 'T3: no cost question is a blocker');
/* T4 "in charge of" → must-have 1 or specific */
ok(!allQ.filter(q => /in charge of/i.test(q.text)).length && /in charge of/i.test(D.must_haves[0].text), 'T4: no use-case question asks "in charge of"; it is must-have 1 only (' + D.must_haves[0].title + ')');
/* T5 "know enough" → concrete */
ok(!none(/know enough/i).length, 'T5: no "know enough"');
/* T6 the impact-assessment question removed (term itself is on the banned list) */
ok(!none(/impact assessment/i).length && shown.every(t => !scan(t).length), 'T6: no impact-assessment question; no shown question holds a banned term');
/* T7 copy-paste questions: originals repeated across use cases vs v3 */
const rep = list => { const c = {}; list.forEach(t => { c[t] = (c[t] || 0) + 1; }); return Object.values(c).filter(n => n > 1).length; };
const origRep = rep(F.use_cases.flatMap(u => u.original_questions.map(o => o.current))), v3Rep = rep(allQ.filter(q => !gate(q.id)).map(q => q.text));
ok(v3Rep < origRep && v3Rep <= 9, 'T7: texts repeated across use cases ' + origRep + ' (v2.6.1) → ' + v3Rep + ' (v3; shared cost and card-security wording only)');
/* T8 duplicates within a use case */
ok(D.use_cases.every(u => new Set(u.questions.map(q => q.text)).size === u.questions.length), 'T8: no duplicate question inside a use case');
/* T9 duplicates across steps */
const stepTexts = new Set(D.must_haves.map(m => m.text).concat(D.step2.map(s => s.text)));
ok(allQ.every(q => !stepTexts.has(q.text)), 'T9: no use-case question repeats a must-have or a step-2 question');
/* T10 add-on wording drift */
const addOn = allQ.filter(q => /add-on/i.test(q.text));
ok(addOn.length === 14 && addOn.every(q => q.area === 'fi' && q.weight === 'N' && /^Do you know /.test(q.text)) && !none(/\badd on\b|addon/i).length, 'T10: one wording for add-ons (' + addOn.length + ' questions, Money, nice to have, "Do you know …")');
/* T11 no "what does it do" question → the gates */
ok(D.use_cases.every(u => u.gates.some(g => g.asked)), 'T11: every use case asks 1–2 How it works questions first');
ok(D.use_cases.every(u => { const n = u.gates.filter(g => g.asked).length; return n >= 1 && n <= 2; }), 'T11: 1–2 per use case');

/* L1 blockers in the use-case step */
ok(D.use_cases.every(u => R3.visible(D, u.id, {}).some(q => q.weight === 'B') || u.questions.some(q => q.weight === 'B')) && run(2).verdict === 'Not ready', 'L1: every use case has blockers; golden 2 (one tailored blocker No) is Not ready');
/* L2 sensitive flag driven by gate answers */
const cond = D.use_cases.filter(u => u.gates.some(g => (g.options || []).some(o => o.effects && o.effects.sensitive_flag)));
ok(cond.length >= 13 && run(19).sensitive && !run(20).sensitive, 'L2: ' + cond.length + ' use cases raise the flag from a How it works answer; golden 19 flagged, 20 not');
/* L3 Doesn't apply on m2/m4 with help, contradiction */
ok(D.must_haves.filter(m => m.na).map(m => m.id).join() === 'm2,m4' && D.must_haves.filter(m => m.na).every(m => m.na_help && m.contradiction_note) && run(14).verdict === 'Ready' && run(15).verdict === 'Almost ready' && run(15).contradictions.length === 1, 'L3: Doesn\'t apply only on m2 and m4, help text, gate contradiction (golden 14 Ready, 15 Almost ready with the note)');
/* L4 soft stop after "not worth it"; L5 Q1 polarity and soft stop */
ok(run(12).verdictKey === 'stop' && run(9).verdictKey === 'stop' && run(10).verdict === 'Almost ready' && run(11).verdict === 'Ready', 'L4/L5: s2 No and s1 No are soft stops (golden 12, 9); Continue anyway caps (10); s1 Yes means towards AI (11)');
/* L6 reason before %, % last: the result's section order (src/app3.js vResult) */
const order = ['id="reason"', 'id="top-h"', 'id="areas"', 'id="plan"', 'id="vendor"', 'id="all-qa"', 'id="method"', 'id="score"', 'id="disclaimer"'].map(s => app.indexOf(s, app.indexOf('function vResult')));
ok(order.every((x, i) => x > 0 && (i === 0 || x > order[i - 1])), 'L6: the result draws reason, top 3, … and the readiness score last before the disclaimer');

/* the 7 Wrong use cases, fully rewritten */
const WRONG = ['hr-5', 'hr-1', 'hk-6', 'res-8', 'it-4', 'fo-7', 'hr-6'];
WRONG.forEach(id => {
  const u = F.use_cases.find(x => x.id === id), orig = new Set(u.original_questions.map(o => o.current));
  ok(u.review_verdict === 'Wrong' && u.questions.every(q => !orig.has(q.text)) && u.gates.some(g => g.asked), 'Wrong ' + id + ': rewritten (' + u.treatment + '), no v2.6.1 text kept, How it works asked');
});
ok(F.use_cases.filter(u => u.review_verdict === 'Wrong').map(u => u.id).sort().join() === WRONG.slice().sort().join(), 'exactly these 7 use cases were Wrong');

/* the action counts: 661/661 originals accounted for */
const want = { keep: 395, fix: 105, rewrite: 28, split: 44, merge: 65, remove: 24 }, got = {};
F.use_cases.forEach(u => u.original_questions.forEach(o => { got[o.action] = (got[o.action] || 0) + 1; }));
Object.entries(want).forEach(([k, n]) => ok(got[k] === n && F.counts.actions[k] === n, 'count ' + k + ': ' + got[k] + ' (expected ' + n + ')'));
const added = allQ.filter(q => /\.n\d+$/.test(q.id)).length;
ok(F.counts.actions.add === 56 && added === 56, 'count add (new questions): ' + added + ' (expected 56)');
ok(Object.values(got).reduce((a, b) => a + b, 0) === 661 && F.counts.original_accounted === 661, '661/661 originals accounted for');
ok(allQ.length === 794 && allQ.filter(q => gate(q.id)).length === 122, '794 v3 use-case questions, 122 added by How it works');
const ids = new Set(allQ.map(q => q.id));
ok(F.use_cases.every(u => u.original_questions.every(o => ['merge', 'remove'].includes(o.action) || (o.new_ids || []).some(n => ids.has(n)))), 'every kept, fixed, rewritten and split original maps to a v3 question');
/* top-10 #2 superseded: no legal answer anywhere */
ok(scan(pageText(html)).length === 0, 'top-10 #2: no legal answers as blockers (no legal content in the page)');
done();
