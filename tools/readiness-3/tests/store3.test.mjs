// R3Store: the record, the flow, saved files, and the migration of readiness-2 checks (spec §6.6).
// Fixtures: tests/fixtures/v2.7-store.json and v2.7-file.json, a real store and a real "Save as file" made with the readiness-2
// v2.7 standalone page on 25 Nov 2026 (store v3, file v3, qv 2: the same format as v2.6.1, whose code v2.7 only added PDFs to),
// and v2.5-saved.json (readiness-2's own fixture, store v2 without qv: question 1 in the v3 direction already).
// Run: node tools/readiness-3/tests/store3.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, tester, goldenRecord, pageBlock } from './load.mjs';
import { loadV3, goldenCases } from '../lib/data3.mjs';
const { ok, done } = tester('store3');
const { R3, S, RES } = load();
const { runtime: D } = loadV3();
const MIG = pageBlock('r3-mig');
const fx = n => JSON.parse(readFileSync(join(root, 'tests/fixtures', n), 'utf8'));
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* flow */
const r = S.blank('flowtest1');
const walk = [];
r.step = 'start'; for (let i = 0; i < 6; i++) { r.step = S.next(D, r); walk.push(r.step); }
ok(eq(walk, ['hotel', 's2', 'must', 'where', 'use', 'result']), 'flow order: hotel, step 2, must-haves, where, use case, result ' + walk);
r.step2 = { s1: 'no' }; r.step = 's2';
ok(S.next(D, r) === 'stop' && S.stopped(D, r), 's1 No: soft stop');
r.cont = S.stopKey(D, r); ok(!S.stopped(D, r) && S.next(D, r) === 'must', 'Continue anyway goes on');
r.step2.s2 = 'no'; ok(S.stopped(D, r), 'a new soft stop (s2 too) needs a new Continue anyway');
r.step = 'result'; ok(S.place(D, r) === 'stop', 'a result behind a soft stop that was not continued shows the stop screen');
r.step2 = { s1: 'yes', s2: 'yes' }; r.step = 'stop'; ok(S.place(D, r) === 'must', 'no stop any more: the stop screen moves on');
const back = {}; ['hotel', 's2', 'stop', 'must', 'where', 'use', 'result'].forEach(s => { r.step = s; back[s] = S.back(D, r); });
ok(eq(back, { hotel: 'start', s2: 'hotel', stop: 's2', must: 's2', where: 'must', use: 'where', result: 'use' }), 'Back from every screen');
ok(eq(S.answers(D, S.blank('x1x')).use, 'none'), 'no use case chosen counts as None of these fits (§6.5)');

/* clean: only offered answers survive; Doesn't apply only on m2 and m4; gates per use case */
const c = S.clean(D, { id: 'clean01', step: 'use', step2: { s1: 'yes', s2: 'Not sure', s3: 'u' }, mh: { m1: 'na', m2: 'na', m4: 'na', m5: 'partly' }, use: 'sm-1',
  gates: { 'sm-1': { G_PAID: 'no', G_LINK: 'maybe' }, 'xx-9': { G_ACT: 'acts' } }, qa: { 'sm-1.pe2': 'yes', 'zz.q1': 'yes', 'sm-1.sk1': 'na' } });
ok(eq(c.step2, { s1: 'yes' }) && eq(c.mh, { m2: 'na', m4: 'na' }) && eq(c.gates, { 'sm-1': { G_PAID: 'no' } }) && eq(c.qa, { 'sm-1.pe2': 'yes' }), 'clean keeps only offered answers ' + JSON.stringify([c.step2, c.mh, c.gates, c.qa]));
ok(S.clean(D, { id: '!' }) === null && S.clean(D, null) === null, 'not a record → null');
ok(eq(S.open(D, c, 'use'), ['gate:G_LINK'].concat(R3.visible(D, 'sm-1', { G_PAID: 'no' }).filter(q => q.id !== 'sm-1.pe2').map(q => q.id))), 'open items on step 5: unanswered gates first, then visible questions');

/* saved files round trip for every golden case */
let rt = 0;
goldenCases().forEach(g => {
  const rec = goldenRecord(S, R3, D, g), doc = S.fileDoc(rec, '2026-11-25T10:00:00.000Z');
  const back = S.readFile(D, MIG, JSON.parse(JSON.stringify(doc)));
  if (doc.kind === 'hftp-do-you-need-ai' && doc.v === 4 && doc.rules === '3.0' && back && back.info.v3 && eq(R3.evaluate(D, S.answers(D, back.rec)).score, R3.evaluate(D, S.answers(D, rec)).score) && eq(back.rec.qa, rec.qa)) rt++;
});
ok(rt === 33, 'save as file → open restores all 33 golden checks (' + rt + ')');
ok(S.APP === '3.0.1' && S.fileDoc(S.blank()).app === '3.0.1', 'the saved file names the tool version 3.0.1');
/* updated in 3.0.1 (clean-up L7): a newer file version was "not a saved check"; it now says it is newer */
ok(S.readFile(D, MIG, { kind: 'other', v: 4, check: {} }) === null && S.readFile(D, MIG, {}) === null, 'wrong kind, empty → not a saved check');
ok(eq(S.readFile(D, MIG, { kind: 'hftp-do-you-need-ai', v: 5, check: { id: 'abcdef' } }), { newer: true }) && eq(S.readFile(D, MIG, { kind: 'hftp-do-you-need-ai', v: 9, check: { id: 'abcd' } }), { newer: true }), 'L7 (cleanup3 U2): a file of a newer version → { newer: true }');

/* migration: the real v2.7 file */
const file = fx('v2.7-file.json'), F = S.readFile(D, MIG, file);
ok(!!F && F.info.from === '2.6.1', 'v2.7 file (v3, qv 2) is migrated');
const m = F.rec;
ok(eq(m.hotel, { name: 'Hotel Fixture', type: 'independent', role: 'gm', country: '' }), 'hotel profile kept');
ok(eq(m.step2, { s1: 'yes', s2: 'yes', s3: 'dk', s4: 'yes', s5: 'no' }), 'q1 No (v2.6: towards AI) → s1 Yes; "Not sure" → Don\'t know yet; q2–q5 → s2–s5');
ok(eq(m.mh, { m1: 'yes', m2: 'planned', m3: 'no', m4: 'dk', m5: 'yes', m6: 'yes', m7: 'yes', m8: 'yes', m9: 'planned', m10: 'yes' }) && !m.mh.m11, 'must-haves 1–10 → m1–m10 (m5 kept as is), m11 empty');
ok(m.use === 'rm-2' && !Object.keys(m.gates).length, 'use case kept; How it works starts empty');
/* each old answer by the table */
const T = file.check.T, map = MIG.map['rm-2'], OLD = { y: 'yes', pl: 'planned', n: 'no', k: 'dk' };
let carried = 0, dropped = 0, good = true;
Object.keys(T).forEach(q => { const ids = map[q]; if (ids && ids.length) { carried++; ids.forEach(id => { if (m.qa[id] !== OLD[T[q]]) good = false; }); } else dropped++; });
ok(good && carried === F.info.carried && dropped === F.info.dropped && dropped === m.imported.dropped, 'kept/fixed/rewritten/split answers carried by id, merged/removed dropped and counted (carried ' + carried + ', dropped ' + dropped + ')');
ok(Object.keys(m.qa).every(id => Object.values(map).some(a => a.includes(id))), 'no answer lands on a question that was not mapped');
/* updated in 3.0.1 (clean-up L8): N counted every unanswered item; it now counts only questions new since v2.6.1 */
ok(eq(S.newOpen(D, MIG, m, true).length, m.imported.n) && m.imported.n > 0 && m.imported.n <= S.openCount(D, m) && S.newOpen(D, MIG, m, true).includes('m11') && !S.newOpen(D, MIG, m, true).some(id => /^m(10|[1-9])$|^s\d$/.test(id)), 'N new questions = open items that did not exist in v2.6.1 (' + m.imported.n + ')');
ok(m.step === 'must', 'opens on the first screen with something to answer: must-haves (m11)');
/* a split original: both parts take the answer */
const splitUse = loadV3().full.use_cases.find(u => u.original_questions.some(o => o.action === 'split'));
const sq = splitUse.original_questions.find(o => o.action === 'split');
const old = { id: 'splitt01', qv: 2, Q: { q1: 'y' }, A: {}, T: { [sq.qid]: 'pl' }, use: splitUse.id, hotel: {} };
const sp = S.fromV2(D, MIG, old).rec;
ok(MIG.map[splitUse.id][sq.qid].length >= 2 && MIG.map[splitUse.id][sq.qid].every(id => sp.qa[id] === 'planned'), 'split: both parts take the old answer (' + splitUse.id + '.' + sq.qid + ')');
ok(sp.step2.s1 === 'no', 'q1 Yes (v2.6: fixed rules can do it) → s1 No');
/* an older question set (signature differs): tailored answers are not carried, and are counted */
const stale = S.fromV2(D, MIG, Object.assign({}, file.check, { tqSig: 'xxxxxxxxxx' }));
ok(!Object.keys(stale.rec.qa).length && stale.info.dropped === Object.keys(T).length, 'answers given to another question set are dropped and counted');
/* Partly (before v2.3) and old "Doesn't apply" are not carried */
const pt = S.fromV2(D, MIG, { id: 'partly01', qv: 2, Q: {}, A: { m1: 'p' }, T: { pe1: 'na' }, use: 'rm-1', hotel: {} });
ok(!pt.rec.mh.m1 && !Object.keys(pt.rec.qa).length, 'old Partly and Doesn\'t apply answers are not carried');

/* migration: the real v2.7 browser store */
const st = S.fromV2Store(D, MIG, fx('v2.7-store.json').store);
ok(st.length === 1 && st[0].rec.use === 'rm-2' && eq(st[0].rec.step2, m.step2), 'v2.7 store: the check with answers is migrated like its file');
/* readiness-2's v2.5 fixture: store v2, no qv (q1 asked the v3 way round then; old q3 and q4 were other questions) */
const s25 = S.fromV2Store(D, MIG, fx('v2.5-saved.json').store);
const go = s25.find(x => x.rec.id === 'fixgo0001');
ok(s25.length >= 2 && go && go.rec.step2.s1 === 'yes' && !go.rec.step2.s3 && !go.rec.step2.s4 && go.rec.step2.s2 === 'yes' && go.rec.step2.s5 === 'yes', 'v2.5 store (no qv): q1 kept, q3/q4 not carried');
const stop = s25.find(x => x.rec.id === 'fixstop01');
ok(stop && stop.rec.step2.s1 === 'no' && stop.rec.step === 's2', 'v2.5 stop record: s1 No, opens on step 2 (old q3/q4 to answer)');
ok(S.fromV2Store(D, MIG, { v: 4, checks: {} }).length === 0 && S.fromV2Store(D, MIG, null).length === 0, 'not a readiness-2 store → nothing');

/* ---------- v3.0.1 clean-up (reproductions in reports/audit-readiness-3/cleanup_inventory_v1.md, cleanup3/unit_repro.mjs) ---------- */
{ // H3 (U1a–c): answer values named after Object.prototype members are dropped by clean(), so the score is never NaN
  const g1 = goldenRecord(S, R3, D, goldenCases()[0]), doc = S.fileDoc(g1), q0 = Object.keys(doc.check.qa)[0];
  doc.check.mh.m1 = 'constructor'; doc.check.qa[q0] = 'toString'; doc.check.step2.s3 = 'valueOf'; doc.check.qa.constructor = 'yes'; doc.check.mh.m2 = '__proto__';
  const o = S.readFile(D, MIG, JSON.parse(JSON.stringify(doc))).rec;
  ok(!('m1' in o.mh) && !(q0 in o.qa) && !('s3' in o.step2) && !Object.prototype.hasOwnProperty.call(o.qa, 'constructor') && !('m2' in o.mh), 'H3 U1a: clean() drops "constructor", "toString", "valueOf", "__proto__" answers');
  const res = R3.evaluate(D, S.answers(D, o)), m = RES.model(D, o, {}, '2026-11-25');
  ok(Number.isFinite(res.score) && !/NaN/.test(m.scoreLine + m.scoreSub), 'H3 U1b/c: the score is a number and the result shows no NaN (' + m.scoreLine + ')');
}
{ // H3 (U1d): fromV2 never stores a function as an answer
  const v2 = S.fromV2(D, MIG, { id: 'proto001', qv: 2, Q: { q1: 'hasOwnProperty', q2: 'constructor' }, A: { m1: 'toString', m2: 'y' }, T: { pe1: 'valueOf' }, use: 'rm-1', hotel: {} });
  ok(!('s1' in v2.rec.step2) && !('s2' in v2.rec.step2) && !('m1' in v2.rec.mh) && v2.rec.mh.m2 === 'yes' && Object.values(v2.rec.qa).every(a => typeof a === 'string'), 'H3 U1d: fromV2 drops inherited names, keeps real answers');
}
{ // L6 (U3): a new check that only carries the hotel details has no answers (not listed, no "Start a new check?" dialog)
  const nb = S.blank('newone01'); nb.hotel.name = 'Hotel X';
  ok(!S.hasAnswers(nb) && S.hasContent(nb), 'L6 U3: hotel name only → hasAnswers false, hasContent true');
  const g = S.blank('gateonly'); g.gates = { 'rm-1': { G_ACT: 'suggests' } };
  ok(S.hasAnswers(g) && !S.hasAnswers(S.blank('empty01')) && !S.hasContent(S.blank('empty02')), 'a How it works answer counts as an answer; a blank check has neither');
}
{ // L8 (U4): the import banner counts only new questions
  const f = S.fromV2(D, MIG, { id: 'cnt00001', qv: 2, Q: {}, A: {}, T: {}, use: 'rm-1', hotel: {} });
  const oldIds = new Set(Object.values(MIG.map['rm-1']).flat());
  const want = ['m11'].concat(R3.askedGates(D, 'rm-1').map(g => 'gate:' + g.id), R3.visible(D, 'rm-1', {}).filter(q => !oldIds.has(q.id)).map(q => q.id));
  ok(f.info.n === want.length && f.rec.imported.n === want.length && f.info.n < S.openCount(D, f.rec), 'L8 U4: an empty v2 check reports only the new ids (' + f.info.n + ' = ' + want.join(' ') + '; ' + S.openCount(D, f.rec) + ' open in all)');
  const pre = S.fromV2(D, MIG, { id: 'cnt00002', Q: { q1: 'y', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }, A: {}, T: {}, use: '', hotel: {} });
  ok(pre.info.n === 3 && eq(S.newOpen(D, MIG, pre.rec, false), ['s3', 's4', 'm11']), 'a record from before v2.6: old questions 3 and 4 of step 2 are new, plus m11 (' + pre.info.n + ')');
}
{ // H2: a file of a check this browser holds in a newer version opens as a copy
  const st = S.blank('same0001'), fileRec = S.blank('same0001');
  st.updated = '2026-11-25T10:05:00.000Z'; fileRec.updated = '2026-11-25T10:00:00.000Z';
  ok(S.openMode(fileRec, st) === 'copy' && S.openMode(fileRec, null) === 'replace', 'H2: stored newer → copy; nothing stored → replace');
  st.updated = fileRec.updated; ok(S.openMode(fileRec, st) === 'replace', 'H2: as new → replace');
  st.updated = '2026-11-25T09:00:00.000Z'; ok(S.openMode(fileRec, st) === 'replace', 'H2: file newer → replace');
}
{ // BUILD NOW 8: session timing survives clean(); junk is dropped
  const c = S.clean(D, { id: 'tim00001', step: 'start', timing: { hotel: ['2026-11-25T10:00:00.000Z', '2026-11-25T10:01:00.000Z', 60000], bogus: ['x'], s2: 'no', must: ['2026-11-25T10:02:00.000Z', '', -5] } });
  ok(eq(c.timing, { hotel: ['2026-11-25T10:00:00.000Z', '2026-11-25T10:01:00.000Z', 60000], must: ['2026-11-25T10:02:00.000Z', '', 0] }), 'timing kept, junk dropped ' + JSON.stringify(c.timing));
  const c2 = S.clean(D, { id: 'tim00002' }); ok(!('timing' in c2), 'no timing unless recorded');
  ok(!('V' in S), 'clean-up D7: the unused R3Store.V is gone');
}
done();
