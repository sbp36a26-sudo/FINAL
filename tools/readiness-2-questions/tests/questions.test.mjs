// v2.7.0 (questions-only): the step-5 questions come verbatim from data/usecase_questions_only.json (the owner's data, copied
// unchanged from spec/). Replaces the v2.6.1 generator tests (data/build-questions.mjs is gone). Prompt §7 tests 1 (data level) and 2.
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

ok(rd('data/usecase_questions_only.json') === rd('spec/usecase_questions_only.json'), 'the data file is the spec file, unchanged');
ok(check(Q).length === 0, 'the checker flags nothing: ' + check(Q).slice(0, 3).join(' | '));
// counts (prompt §7 test 2)
const per = {}; Q.use_cases.forEach(u => { per[u.questions.length] = (per[u.questions.length] || 0) + 1; });
ok(eq(per, { 6: 40, 7: 26, 8: 15, 9: 9, 10: 2, 11: 4, 12: 3 }), 'counts: 40×6, 26×7, 15×8, 9×9, 2×10, 4×11, 3×12: ' + JSON.stringify(per));
const total = Q.use_cases.reduce((a, u) => a + u.questions.length, 0);
ok(total === 723 && Q.use_cases.length === 99, '723 questions over 99 use cases');
const byText = new Map(); Q.use_cases.forEach(u => u.questions.forEach(q => { const k = q.text.trim().toLowerCase(); byText.set(k, (byText.get(k) || new Set()).add(u.id)); }));
ok([...byText.values()].every(s => s.size === 1) && byText.size === 723, 'no question text is shared by two use cases (and none repeats inside one)');
ok(Q.use_cases.every(u => u.questions.every(q => words(q.text) <= 20 && (q.text.match(/\?/g) || []).length === 1)), 'at most 20 words, one question mark each');
// the checker catches what it should
const bad = JSON.parse(JSON.stringify(Q)); bad.use_cases[1].questions[0].text = Q.use_cases[0].questions[0].text;
ok(check(bad).some(f => /also asked in/.test(f)), 'the checker flags a text that appears in two use cases');
const bad2 = JSON.parse(JSON.stringify(Q)); bad2.use_cases[0].questions = bad2.use_cases[0].questions.slice(0, 5);
ok(check(bad2).some(f => /only 5 questions/.test(f)), 'the checker flags fewer than 6');
const bad3 = JSON.parse(JSON.stringify(Q)); bad3.use_cases[0].questions[0].text = 'One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twentyone?';
ok(check(bad3).some(f => / words: /.test(f)), 'the checker flags more than 20 words');
// the page carries exactly these, in order, with text, why, area and who answers
const ids = D.cat.depts.flatMap(d => d.uses.map(u => u.id));
ok(eq(Object.keys(D.tq.uses).sort(), ids.slice().sort()), 'one entry per catalogue use case (99)');
ok(eq(D.tq, tqModel(Q, JSON.parse(rd('data/must-meta.json')))), 'the inlined questions equal tqModel(data file)');
let exact = 0;
Q.use_cases.forEach(u => {
  const t = D.tq.uses[u.id];
  const same = t && eq(t.qs.map(q => [q.id, q.q, q.why, D.tq.areas[q.a], q.whoLabel, q.who]), u.questions.map(q => [q.id, q.text, q.why, q.area, q.who_answers, WHO[q.who_answers]]));
  ok(same, u.id + ': the page carries exactly its questions'); if (same) exact++;
  ok(t.name === u.name && t.sensitive === !!u.sensitive, u.id + ': name and sensitive flag');
  ok(eq(t.qs.map(q => q.carry || null), u.questions.map(q => q.carry_answer_from)), u.id + ': carry_answer_from kept for older saves');
});
ok(exact === 99, 'exact questions ' + exact + '/99');
ok(D.tq.uses['lg-2'].name === "Tools for handling guests' requests about their personal data" && D.tq.uses['lg-3'].name === 'Generative AI for reviewing contracts', 'lg-2 and lg-3 show their new names');
ok(Object.keys(D.tq.uses).filter(k => D.tq.uses[k].sensitive).sort().join() === 'fo-3,fo-6,gx-4,hk-6,hr-1,hr-2,hr-4,hr-5,hr-6,it-4,res-8,sm-3', '12 sensitive use cases');
// review records are not shipped
const html = rd('index.html');
ok(!/original_questions|old_wording|"old_name"|"counts"|"origin"/.test(html), 'review records (original_questions, old_name, counts) are not inlined');
ok(Object.keys(AREA_KEY).length === 6, 'six areas');
done();
