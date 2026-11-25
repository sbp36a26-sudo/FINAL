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
const { R3, S } = load();
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
ok(S.APP === '3.0.0' && S.fileDoc(S.blank()).app === '3.0.0', 'the saved file names the tool version 3.0.0');
ok(S.readFile(D, MIG, { kind: 'other', v: 4, check: {} }) === null && S.readFile(D, MIG, { kind: 'hftp-do-you-need-ai', v: 9, check: { id: 'abcd' } }) === null && S.readFile(D, MIG, {}) === null, 'wrong kind, newer version, empty → not a saved check');

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
ok(m.imported.n === S.openCount(D, m) && m.imported.n > 0, 'N new questions = unanswered after import (' + m.imported.n + ')');
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
done();
