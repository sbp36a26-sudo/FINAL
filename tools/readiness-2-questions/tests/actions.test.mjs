// v2.8.0 (live review B11, prompt §2): one action text per step-5 question, data/actions_questions_only.json, used in the action
// plan and the PDF instead of the question. Every question id has one; none ends with "?"; at most 15 words; imperative (no question
// word first); the "Make this a Yes:" and "Finish: <question>?" prefixes are gone.
// Run: node tools/readiness-2-questions/tests/actions.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, data, tester, finished } from './load.mjs';
const { L, F, P } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('actions');
const rd = p => readFileSync(join(root, p), 'utf8');
const A = JSON.parse(rd('data/actions_questions_only.json')).actions, Q = JSON.parse(rd('data/usecase_questions_only.json'));
const ids = Q.use_cases.filter(u => !u.removed).flatMap(u => u.questions.map(q => q.id));
ok(ids.length === 743 && ids.every(id => typeof A[id] === 'string' && A[id].trim()), 'every one of the 743 question ids has an action');
ok(Object.keys(A).length === 743 && Object.keys(A).every(id => ids.includes(id)), 'no action for a question that does not exist');
ok(ids.every(id => !/\?/.test(A[id])), 'no action ends with (or contains) "?"');
ok(ids.every(id => A[id].trim().split(/\s+/).length <= 15), 'at most 15 words each');
ok(ids.every(id => !/^(?:(?:GM|Department head|Finance|IT|Owner): )?(Is|Are|Do|Does|Has|Have|Can|Could|Will|Should|Who|What|When|How|Which)\b/.test(A[id])), 'imperative: none starts with a question word');
const WHOP = /^(GM|Department head|Finance|IT|Owner): /;
ok(Q.use_cases.filter(u => !u.removed).every(u => u.questions.every(q => { const m = WHOP.exec(A[q.id]); return !m || m[1] === q.who_answers; })), 'where an action starts with a person, it is the question\'s "who answers"');
ok(Object.keys(TQ.uses).every(k => TQ.uses[k].qs.every(q => q.act === A[q.id])), 'the page carries each question\'s action');
// in the plan and the PDF
const env = { cat: D.cat, TQ, ex: D.ex, today: '2026-11-25' };
let n = 0, bad = [];
Object.keys(TQ.uses).forEach((use, i) => {
  const r = finished(F, D, use); TQ.uses[use].qs.forEach((q, j) => { r.T[q.id] = ['n', 'pl', 'y'][(i + j) % 3]; if (r.T[q.id] === 'pl' && j % 2) r.TBy[q.id] = '2027-02-01'; });
  const m = L.resultModel(r, env), items = m.people.flatMap(p => p.items);
  TQ.uses[use].qs.forEach(q => {
    const v = r.T[q.id]; if (v === 'y') return; n++;
    const want = v === 'n' ? L.actText(q.act) : (r.TBy[q.id] ? 'Finish by 1 Feb 2027: ' : 'Finish: ') + L.actText(q.act);
    if (!items.some(a => a.text === want)) bad.push(q.id + ' ' + want);
  });
  const all = items.map(a => a.text).join('\n');
  if (/Make this a Yes|Finish: [^\n]*\?/.test(all)) bad.push(use + ' old prefix');
  const pdf = P.model(r, env, 'result').blocks.map(b => b.t || '').join('\n');
  if (/Make this a Yes/.test(pdf)) bad.push(use + ' PDF old prefix');
});
ok(!bad.length && n > 400, 'the action plan shows the action for every No and Planned step-5 question (' + n + ' checked): ' + bad.slice(0, 3).join(' | '));
ok(L.actText('Finance: get the fee in writing.') === 'Get the fee in writing.' && L.actText('Agree with the chef to own it.') === 'Agree with the chef to own it.', 'the person prefix is left out where the plan already names the person');
done();
