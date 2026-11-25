// v2.8.0: the step-5 questions come verbatim from data/usecase_questions_only.json (the owner's corrected data after the live
// review, copied unchanged from spec/review/usecase_questions_fixed.json; v2.7.0 took it from spec/usecase_questions_only.json). Replaces the v2.6.1 generator tests (data/build-questions.mjs is gone). Prompt §7 tests 1 (data level) and 2.
// Run: node tools/readiness-2-questions/tests/questions.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, data, tester } from './load.mjs';
import { check, words, WHO } from '../data/check-questions.mjs';
import { tqModel, AREA_KEY } from '../build.mjs';
const { ok, done } = tester('questions');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const Q = JSON.parse(rd('data/usecase_questions_only.json')), D = data();

ok(rd('data/usecase_questions_only.json') === rd('spec/review/usecase_questions_fixed.json'), 'the data file is the review\'s fixed file, unchanged (v2.8.0)');
const LQ = Q.use_cases.filter(u => !u.removed);
ok(check(Q).length === 0, 'the checker flags nothing: ' + check(Q).slice(0, 3).join(' | '));
// counts (prompt §7 test 2)
const per = {}; LQ.forEach(u => { per[u.questions.length] = (per[u.questions.length] || 0) + 1; });
ok(eq(per, { 6: 19, 7: 36, 8: 27, 9: 7, 10: 3, 11: 4, 12: 2 }) && eq(per, Q.counts.per_count), 'counts (v2.8.0): 19×6, 36×7, 27×8, 7×9, 3×10, 4×11, 2×12, as the data file says: ' + JSON.stringify(per));
const total = Q.use_cases.reduce((a, u) => a + u.questions.length, 0);
ok(total === 743 && LQ.length === 98 && Q.counts.questions === 743 && Q.counts.use_cases_listed === 98, '743 questions over 98 listed use cases (v2.8.0)');
ok(Q.use_cases.filter(u => u.removed).map(u => u.id).join() === 'lg-2' && Q.use_cases.find(u => u.id === 'lg-2').questions.length === 0, 'lg-2 is removed and has no questions');
const byText = new Map(); Q.use_cases.forEach(u => u.questions.forEach(q => { const k = q.text.trim().toLowerCase(); byText.set(k, (byText.get(k) || new Set()).add(u.id)); }));
ok([...byText.values()].every(s => s.size === 1) && byText.size === 743, 'no question text is shared by two use cases (and none repeats inside one)');
ok(Q.use_cases.every(u => u.questions.every(q => words(q.text) <= 20 && (q.text.match(/\?/g) || []).length === 1)), 'at most 20 words, one question mark each');
// the checker catches what it should
const bad = JSON.parse(JSON.stringify(Q)); bad.use_cases[1].questions[0].text = Q.use_cases[0].questions[0].text;
ok(check(bad).some(f => /also asked in/.test(f)), 'the checker flags a text that appears in two use cases');
const bad2 = JSON.parse(JSON.stringify(Q)); bad2.use_cases[0].questions = bad2.use_cases[0].questions.slice(0, 5);
ok(check(bad2).some(f => /only 5 questions/.test(f)), 'the checker flags fewer than 6');
const bad4 = JSON.parse(JSON.stringify(Q)); bad4.use_cases[0].questions[1].text = 'Has that team agreed to it?';
ok(check(bad4).some(f => /leans on the question before it/.test(f)), 'v2.8.0: the checker flags "that team" (also "that person", "that manager")');
const bad5 = JSON.parse(JSON.stringify(Q)); bad5.use_cases[0].questions = bad5.use_cases[0].questions.filter(q => q.area !== 'Data');
ok(check(bad5).some(f => /no question in the area Data/.test(f)), 'v2.8.0: the checker flags a use case without one of the six areas');
ok(LQ.every(u => ['People', 'Skills', 'Financial investment', 'Technology infrastructure', 'Data', 'Organisation & governance'].every(a => u.questions.some(q => q.area === a) || (u.id === 'lg-4' && a === 'Technology infrastructure'))), 'every listed use case has all six areas (lg-4 may lack Technology)');
ok(!LQ.some(u => u.questions.some(q => /\bthat (person|team|manager)\b/i.test(q.text))), 'no question says "that person", "that team" or "that manager"');
const bad3 = JSON.parse(JSON.stringify(Q)); bad3.use_cases[0].questions[0].text = 'One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twentyone?';
ok(check(bad3).some(f => / words: /.test(f)), 'the checker flags more than 20 words');
// the page carries exactly these, in order, with text, why, area and who answers
const ids = D.cat.depts.flatMap(d => d.uses.map(u => u.id));
ok(eq(Object.keys(D.tq.uses).sort(), ids.slice().sort()), 'one entry per listed use case (98)');
ok(eq(D.tq, tqModel(Q, JSON.parse(rd('data/must-meta.json')), JSON.parse(rd('data/v27-sigs.json')).sigs, JSON.parse(rd('data/actions_questions_only.json')).actions)), 'the inlined questions equal tqModel(data file)');
let exact = 0;
LQ.forEach(u => {
  const t = D.tq.uses[u.id];
  const same = t && eq(t.qs.map(q => [q.id, q.q, q.why, D.tq.areas[q.a], q.whoLabel, q.who]), u.questions.map(q => [q.id, q.text, q.why, q.area, q.who_answers, WHO[q.who_answers]]));
  ok(same, u.id + ': the page carries exactly its questions'); if (same) exact++;
  ok(t.name === u.name && t.sensitive === !!u.sensitive, u.id + ': name and sensitive flag');
  ok(eq(t.qs.map(q => q.carry || null), u.questions.map(q => q.carry_answer_from)), u.id + ': carry_answer_from kept for older saves');
});
ok(exact === 98, 'exact questions ' + exact + '/98');
ok(!D.tq.uses['lg-2'] && D.tq.uses['lg-3'].name === 'Generative AI for reviewing contracts', 'lg-2 is not shipped; lg-3 shows its name');
ok(LQ.every(u => D.tq.uses[u.id].qs.every(q => !!q.k27 === (u.questions.find(x => x.id === q.id).review !== 'Rewrite' && u.questions.find(x => x.id === q.id).review !== 'Add'))) && !/"review":/.test(rd('index.html')), 'v2.8.0: k27 marks the questions whose v2.7 answer carries (not Rewrite, not Add); the review field is not shipped');
ok(Object.keys(D.tq.uses).filter(k => D.tq.uses[k].sensitive).sort().join() === 'fo-3,fo-6,gx-4,hk-6,hr-1,hr-2,hr-4,hr-5,hr-6,it-4,res-8,sm-3', '12 sensitive use cases');
// review records are not shipped
const html = rd('index.html');
ok(!/original_questions|old_wording|"old_name"|"counts"|"origin"|"review"/.test(html), 'review records (original_questions, old_name, counts) are not inlined');
ok(Object.keys(AREA_KEY).length === 6, 'six areas');
done();
