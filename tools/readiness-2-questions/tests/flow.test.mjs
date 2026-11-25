// "Do you need AI?" v2 state machines (src/flow.js): every transition and guard, the stop that cannot be passed, the must-haves
// that need answers, the store (several checks), v1 → v2 migration, files, history, confirm, share, download.
// Run: node tools/readiness-2/tests/flow.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, data, envOf, tester, finished } from './load.mjs';
const { C, L, F } = load();
const D = data(), env = envOf(D, F); env.countries = C.COUNTRIES;
const { ok, done } = tester('flow');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function drive(store, evs) { let ok2 = true; for (const [ev, arg] of evs) { const r = F.reduce(store, ev, arg, env); ok2 = r.ok; store = r.store; } return { store, ok: ok2, rec: F.cur(store) }; }
const sendAll = (s, ev, ids, v) => ids.reduce((st, id) => F.reduce(st, ev, { id, value: v }, env).store, s);

// ---------- table ----------
ok(eq(F.STEPS, ['start', 'hotel', 'q', 'stop', 'must', 'where', 'tailored', 'result']) && F.V === 3 && F.KEY === 'hftp-readiness2-v1', 'states, version 3 (v2.6: was 2), same storage key');
ok(eq(Object.keys(F.FLOW), F.STEPS) && eq(F.FLOW.start, { begin: 'hotel' }) && eq(F.FLOW.stop, { change: 'q' }), 'one row per state; the stop screen only goes back to the questions');
const full = { hotelDone: true, q1Stop: false, qDone: true, mustDone: true, whereDone: true, none: false, hasTail: true, tailDone: true };
const EXPECT = { 'start.begin': 'hotel', 'hotel.back': 'start', 'hotel.next': 'q', 'q.back': 'hotel', 'q.next': 'must', 'must.back': 'q', 'must.next': 'where', 'where.back': 'must', 'where.next': 'tailored', 'tailored.back': 'where', 'tailored.next': 'result', 'result.back': 'tailored', 'result.edit': 'q', 'stop.change': 'q' };
F.STEPS.forEach(s => ['begin', 'next', 'back', 'change', 'edit', 'nope'].forEach(e => {
  const to = F.flowNext(s, e, full), want = EXPECT[s + '.' + e] || null;
  ok(to === want, 'transition ' + s + ' --' + e + '--> ' + want + ' (got ' + to + ')');
}));
ok(F.flowNext('where', 'next', { ...full, none: true }) === 'result' && F.flowNext('result', 'back', { ...full, none: true }) === 'where', '"None of these fits" skips step 5 both ways');
ok(F.flowNext('q', 'next', { ...full, q1Stop: true, qDone: false }) === 'stop' && F.flowNext('stop', 'change', { ...full, q1Stop: true }) === 'q', 'Q1 Yes (v2.6) → stop; stop → change → q');
// ---------- guards ----------
ok(F.flowNext('hotel', 'next', { ...full, hotelDone: false }) === null, 'hotel: "how the hotel is run" is required');
ok(F.flowNext('q', 'next', { ...full, qDone: false }) === null, 'q: all five answered');
ok(F.flowNext('must', 'next', { ...full, mustDone: false }) === null, 'must-haves: every one needs an answer');
ok(F.flowNext('where', 'next', { ...full, whereDone: false }) === null, 'where: a choice is needed');
ok(F.flowNext('tailored', 'next', { ...full, tailDone: false }) === null, 'tailored: every question needs an answer');
// every combination of context: nothing past the questions is reachable while Q1 is No; reachable implies its predecessors
const keys = Object.keys(full); let combos = 0;
for (let m = 0; m < 1 << keys.length; m++) {
  const c = {}; keys.forEach((k, i) => { c[k] = !!(m & (1 << i)); }); combos++;
  if (c.q1Stop) ok(!['must', 'where', 'tailored', 'result'].some(s => F.reachable(s, c)), 'Q1 No: nothing past the questions is reachable ' + m);
  ok(!F.reachable('stop', c) || (c.q1Stop && c.hotelDone), 'stop only while Q1 is No ' + m);
  ok(!F.reachable('result', c) || (c.mustDone && c.qDone && c.whereDone && c.hotelDone), 'result needs hotel, five answers, must-haves and a choice ' + m);
  ok(!F.reachable('where', c) || c.mustDone, 'where needs every must-have answered ' + m);
  F.STEPS.forEach(s => { const p = F.placeStep(s, c); ok(F.reachable(p, c), 'placeStep(' + s + ') lands on a reachable step ' + m); if (F.reachable(s, c)) ok(p === s, 'a reachable step stays ' + s + ' ' + m); });
  F.STEPS.forEach(s => F.events(s, c).forEach(e => ok(F.reachable(F.flowNext(s, e, c), c), 'every accepted event leads to a reachable step')));
}
ok(combos === 256, '256 context combinations');
ok(F.placeStep('nonsense', full) === 'start' && F.placeStep('result', { ...full, q1Stop: true }) === 'stop' && F.placeStep('result', { ...full, mustDone: false }) === 'must' && F.placeStep('result', { ...full, hotelDone: false }) === 'hotel', 'placeStep: unknown → start; Q1 No → stop; missing must-haves → must; no hotel type → hotel');

// ---------- a full walk through reduce ----------
let s = F.blankStore(), r;
ok(F.cur(s).step === 'start' && eq(Object.keys(s.checks), [s.cur]), 'a blank store has one blank check on the cover');
r = F.reduce(s, 'next', null, env); ok(!r.ok && r.store === s, 'the cover has no "next"; a refused event returns the same store');
s = F.reduce(s, 'begin', null, env).store; ok(F.cur(s).step === 'hotel', 'begin → hotel');
ok(!F.reduce(s, 'next', null, env).ok, 'hotel: Next refused without the type');
ok(!F.reduce(s, 'hotel', { k: 'type', v: 'castle' }, env).ok && !F.reduce(s, 'hotel', { k: 'role', v: 'king' }, env).ok && !F.reduce(s, 'hotel', { k: 'country', v: 'Narnia' }, env).ok && !F.reduce(s, 'hotel', { k: 'x', v: 'y' }, env).ok, 'hotel: junk values refused');
s = drive(s, [['hotel', { k: 'type', v: 'managed' }], ['hotel', { k: 'name', v: 'Hotel Alpenblick' }], ['hotel', { k: 'role', v: 'gm' }], ['hotel', { k: 'country', v: 'Switzerland' }], ['next']]).store;
ok(F.cur(s).step === 'q' && eq(F.cur(s).hotel, { name: 'Hotel Alpenblick', role: 'gm', type: 'managed', country: 'Switzerland' }), 'hotel filled → q');
ok(!F.reduce(s, 'answer', { id: 'm1', value: 'y' }, env).ok && !F.reduce(s, 'hotel', { k: 'type', v: 'group' }, env).ok && !F.reduce(s, 'use', 'none', env).ok, 'answers only on their own step');
ok(!F.reduce(s, 'next', null, env).ok, 'q: Next refused with nothing answered');
ok(!F.reduce(s, 'answer', { id: 'q1', value: 'k' }, env).ok, 'q: "Don\'t know yet" is not an answer to the five questions');
// Q1 No: the stop cannot be passed by any event
let st = drive(s, [['answer', { id: 'q1', value: 'y' }], ['next']]).store;
ok(F.cur(st).step === 'stop', 'Q1 Yes (v2.6) + Next → stop, with the other four blank');
['begin', 'next', 'back', 'edit', 'snap', 'share'].forEach(e => ok(!F.reduce(st, e, e === 'snap' ? { at: 'x', level: 'ready' } : null, env).ok, 'stop: "' + e + '" refused'));
['must', 'where', 'tailored', 'result'].forEach(p => { const x = F.reduce(st, 'pop', p, env); ok(!x.ok && F.cur(x.store).step === 'stop', 'stop: Back/forward to "' + p + '" lands on stop'); });
ok(!F.reduce(st, 'answer', { id: 'q1', value: 'y' }, env).ok && !F.reduce(st, 'answer', { id: 'm1', value: 'y' }, env).ok, 'stop: no answer can be changed on the stop screen');
/* exhaustive: from the stop screen, any sequence of up to 4 navigation events never reaches a step past the questions while Q1 is No */
(function walk(store, depth) {
  const rec = F.cur(store);
  ok(!(rec.Q.q1 === 'y' && ['must', 'where', 'tailored', 'result'].includes(rec.step)), 'never past the stop while Q1 is No');
  if (depth === 0) return;
  [['begin'], ['next'], ['back'], ['change'], ['edit'], ['pop', 'result'], ['pop', 'where'], ['pop', 'must'], ['answer', { id: 'q2', value: 'y' }], ['answer', { id: 'm1', value: 'y' }], ['use', 'none'], ['cat', 'Commercial']].forEach(([e, a]) => { const x = F.reduce(store, e, a, env); if (x.ok || e === 'pop') walk(x.store, depth - 1); });
})(st, 4);
st = F.reduce(st, 'change', null, env).store; ok(F.cur(st).step === 'q' && F.cur(st).Q.q1 === 'y', 'Change my answers → back on the questions');
// go on with all Yes
s = sendAll(s, 'answer', F.QIDS, 'y'); s = F.reduce(s, 'answer', { id: 'q1', value: 'n' }, env).store; s = F.reduce(s, 'next', null, env).store; ok(F.cur(s).step === 'must', 'five answers (Q1 No, v2.6) → must-haves');
ok(!F.reduce(s, 'next', null, env).ok, 'must-haves: Next refused with none answered');
s = sendAll(s, 'answer', F.MUST_IDS.slice(0, 9), 'y'); ok(!F.reduce(s, 'next', null, env).ok, 'must-haves: Next refused with one unanswered');
ok(!F.reduce(s, 'answer', { id: 'm10', value: 'na' }, env).ok && !F.reduce(s, 'answer', { id: 'm10', value: 'p' }, env).ok, 'must-haves: "Doesn\'t apply" and (v2.3) "Partly" are not offered');
s = F.reduce(s, 'answer', { id: 'm10', value: 'k' }, env).store; ok(F.reduce(s, 'next', null, env).ok, '"Don\'t know yet" counts as an answer');
s = F.reduce(s, 'answer', { id: 'm3', value: 'pl' }, env).store;
ok(!F.reduce(s, 'by', { id: 'm3', date: '2026-02-31' }, env).ok && !F.reduce(s, 'by', { id: 'm1', date: '2027-01-15' }, env).ok, 'By when: real dates only, and only for a Planned answer');
s = F.reduce(s, 'by', { id: 'm3', date: '2027-01-15' }, env).store; ok(F.cur(s).By.m3 === '2027-01-15', 'By when kept');
ok(!F.cur(F.reduce(s, 'answer', { id: 'm3', value: 'y' }, env).store).By.m3, 'changing a Planned answer drops its date');
s = F.reduce(s, 'next', null, env).store; ok(F.cur(s).step === 'where', 'must-haves answered → where');
ok(!F.reduce(s, 'next', null, env).ok && !F.reduce(s, 'use', 'gx-2', env).ok && !F.reduce(s, 'dept', 'gx', env).ok && !F.reduce(s, 'cat', 'Nope', env).ok, 'where: nothing chosen, no Next; a use case needs its department; a department its area');
s = drive(s, [['cat', 'Guest-facing'], ['dept', 'gx'], ['use', 'gx-2']]).store;
ok(F.cur(s).use === 'gx-2' && F.cur(s).useName === D.cat.depts.find(d => d.id === 'gx').uses[1].n, 'use case chosen, name kept');
s = F.reduce(s, 'next', null, env).store; ok(F.cur(s).step === 'tailored', 'a use case → tailored questions');
const tids = F.tailIds(env, 'gx-2');
ok(!F.reduce(s, 'next', null, env).ok && !F.reduce(s, 'answer', { id: 'zz1', value: 'y' }, env).ok, 'tailored: Next refused; an unknown question id refused');
s = sendAll(s, 'answer', tids, 'y'); ok(!F.reduce(s, 'answer', { id: tids[0], value: 'na' }, env).ok && !F.reduce(s, 'answer', { id: tids[0], value: 'p' }, env).ok && F.cur(s).T[tids[0]] === 'y', 'tailored (v2.3): "Doesn\'t apply" and "Partly" are not offered');
s = F.reduce(s, 'next', null, env).store; ok(F.cur(s).step === 'result', 'tailored answered → result');
ok(!F.reduce(s, 'answer', { id: 'm1', value: 'n' }, env).ok && !F.reduce(s, 'next', null, env).ok, 'result: no answers, no Next');
ok(F.cur(F.reduce(s, 'back', null, env).store).step === 'tailored' && F.cur(F.reduce(s, 'edit', null, env).store).step === 'q', 'result: Back → tailored; edit → q');
// changing the use case clears the tailored answers; "None" skips step 5
let s2 = drive(s, [['back'], ['back'], ['use', 'gx-1']]).store; ok(eq(F.cur(s2).T, {}) && F.cur(s2).use === 'gx-1', 'another use case: its tailored answers start empty');
ok(eq(F.cur(drive(s, [['back'], ['back'], ['use', 'gx-2']]).store).T, F.cur(s).T), 'the same use case again keeps the answers');
s2 = drive(s, [['back'], ['back'], ['use', 'none'], ['next']]).store; ok(F.cur(s2).step === 'result' && eq(F.cur(s2).T, {}), '"None of these fits" → straight to the result');
ok(F.cur(F.reduce(s2, 'back', null, env).store).step === 'where', 'and Back from that result → where');
// Q1 changed to No from the result: later steps close
s2 = drive(s, [['edit'], ['answer', { id: 'q1', value: 'y' }]]).store; ok(F.cur(F.reduce(s2, 'pop', 'result', env).store).step === 'stop' && F.cur(F.reduce(s2, 'next', null, env).store).step === 'stop', 'Q1 changed to Yes (v2.6): the result is closed, Next goes to stop');
// all 99 use cases can be walked to a result
D.cat.depts.forEach(d => d.uses.forEach(u => { const f = finished(F, D, u.id); f.step = 'where'; const x = F.cleanRec(f, env, {}); ok(x.step === 'where' && F.flowNext('where', 'next', F.ctxOf(x, env)) === 'tailored' && F.placeStep('result', F.ctxOf(x, env)) === 'result', u.id + ': selectable, has tailored questions, reaches the result'); }));

// ---------- snapshots (return visits) ----------
const sn = L.snapshot(L.evaluate(F.cur(s), D.tq), '2026-11-24T10:00:00.000Z');
r = F.reduce(s, 'snap', sn, env); ok(r.ok && F.cur(r.store).snaps.length === 1 && F.cur(r.store).snaps[0].level === sn.level, 'snap on the result');
ok(!F.reduce(s, 'snap', { at: 'x', level: 'great' }, env).ok && !F.reduce(drive(s, [['back']]).store, 'snap', sn, env).ok, 'snap: junk refused; only on the result');
let many = s; for (let i = 0; i < 30; i++) many = F.reduce(many, 'snap', { ...sn, at: '2026-11-' + String(i).padStart(2, '0') }, env).store; ok(F.cur(many).snaps.length === F.MAX_SNAPS, 'at most ' + F.MAX_SNAPS + ' snapshots are kept');

// ---------- the store: several checks ----------
const idA = s.cur;
r = F.reduce(s, 'new', null, env); ok(r.ok && r.store.cur !== idA && r.store.checks[idA] && F.cur(r.store).step === 'start' && eq(F.cur(r.store).hotel, F.cur(s).hotel), 'new check: the old one is kept, the hotel details carry over');
const s3 = r.store, idB = s3.cur;
r = F.reduce(s3, 'new', null, env); ok(Object.keys(r.store.checks).length === 2 && !r.store.checks[idB], 'an untouched check is not kept when another is started');
ok(F.listed(s3.checks[idA]) && !F.listed(s3.checks[idB]), 'listed: only checks with something in them');
r = F.reduce(s3, 'open', idA, env); ok(r.ok && r.store.cur === idA && F.cur(r.store).step === 'result' && !r.store.checks[idB], 'open a saved check: back on its result');
ok(!F.reduce(s3, 'open', 'nope', env).ok && !F.reduce(s3, 'open', idB, env).ok, 'open: unknown id or the open check refused');
r = F.reduce(s3, 'remove', idA, env); ok(r.ok && !r.store.checks[idA] && r.store.cur === idB, 'remove another check');
r = F.reduce(s, 'remove', idA, env); ok(r.ok && !r.store.checks[idA] && F.cur(r.store).step === 'start' && F.cur(r.store).hotel.type === 'managed', 'remove the open check: a blank one takes its place');
ok(!F.reduce(s, 'remove', 'nope', env).ok, 'remove: unknown id refused');
// preselect (#use=<id>)
r = F.reduce(F.blankStore(), 'preselect', 'hr-2', env); let pr = F.cur(r.store);
ok(r.ok && pr.use === 'hr-2' && pr.dept === 'hr' && pr.cat === 'Administrative' && pr.step === 'start' && Object.keys(r.store.checks).length === 1, '#use=hr-2: a check with the use case chosen, on the cover');
ok(!F.reduce(F.blankStore(), 'preselect', 'zz-9', env).ok && !F.reduce(F.blankStore(), 'preselect', 'none', env).ok, 'preselect: unknown ids refused');
r = F.reduce(s, 'preselect', 'gx-2', env); ok(r.ok && r.store === s, 'preselect of the use case already chosen keeps the check');
r = F.reduce(s, 'preselect', 'hr-2', env); ok(r.ok && r.store.cur !== idA && r.store.checks[idA] && F.cur(r.store).use === 'hr-2', 'preselect of another use case starts a new check and keeps the old one');
pr = drive(F.reduce(F.blankStore(), 'preselect', 'hr-2', env).store, [['begin'], ['hotel', { k: 'type', v: 'group' }], ['next']].concat(F.QIDS.map(id => ['answer', { id, value: id === 'q1' ? 'n' : 'y' }]), [['next']], F.MUST_IDS.map(id => ['answer', { id, value: 'y' }]), [['next']])).rec;
ok(pr.step === 'where' && pr.use === 'hr-2' && F.flowNext('where', 'next', F.ctxOf(pr, env)) === 'tailored', 'the preselected use case is still chosen when step 4 is reached');
// shared hotel profile
r = F.reduce(F.blankStore(), 'profile', { name: 'Hotel Meridian', country: 'France', type: 'group' }, env); ok(r.ok && eq(F.cur(r.store).hotel, { name: 'Hotel Meridian', role: '', type: 'group', country: 'France' }), 'profile fills empty hotel fields');
ok(!F.reduce(s, 'profile', { name: 'Other', country: 'France', type: 'group' }, env).ok, 'profile never overwrites what is there');
// share fields
r = F.reduce(s, 'share', { named: true }, env); ok(r.ok && F.cur(r.store).share.named === true, 'share: the name tick is kept');
r = F.reduce(s, 'shared', { at: '2026-11-24T10:00:00Z', mode: 'shared', sig: F.shareSig(F.cur(s)) }, env); ok(F.shareSettled(F.cur(r.store)) === 'shared' && !F.shareStale(F.cur(r.store)), 'shared: settled, not stale');
ok(F.shareStale(F.cur(drive(r.store, [['back'], ['answer', { id: tids[1], value: 'n' }]]).store)), 'an answer changed after sharing → the copy is out of date');
ok(F.shareSettled(F.cur(F.reduce(r.store, 'unshared', null, env).store)) === 'idle', 'unshared → idle');
ok(F.shareNext('idle', 'share') === 'sending' && F.shareNext('shared', 'withdraw') === 'withdrawing' && F.shareNext('idle', 'withdraw') === null && F.shareNext('sending', 'share') === null && F.shareNext('withdrawing', 'withdraw') === null, 'SHARE machine: one send or withdrawal at a time');

// ---------- saved data: v2 round trip, junk, newer ----------
const raw = JSON.parse(JSON.stringify(s)); let info = {};
ok(eq(F.migrate(raw, env, info), s) && !info.fromV1 && !info.newer, 'a v2 store round-trips unchanged');
[null, 7, 'x', [], { v: 0 }, { v: 'two' }].forEach(j => ok(F.migrate(j, env, {}) === null, 'junk → null: ' + JSON.stringify(j)));
let mg = F.migrate({ v: 2, cur: 'gone', checks: { bad: { id: 'other' }, 'a b': {}, ok1: { id: 'ok1', step: 'result', Q: { q1: 'y', q9: 'y', q2: 'maybe' }, A: { m1: 'y', m2: 'na', zz: 'y' }, By: { m1: '2027-01-01' }, hotel: { type: 'castle', name: 5 }, T: { pe1: 'y' }, snaps: [{ at: 'x' }, 5], extra: 1 } } }, env, {});
ok(mg && F.cur(mg).step === 'start' && eq(mg.checks.ok1.Q, { q1: 'n' }) && eq(mg.checks.ok1.A, { m1: 'y' }) && eq(mg.checks.ok1.By, {}) && mg.checks.ok1.hotel.type === '' && eq(mg.checks.ok1.T, {}) && mg.checks.ok1.snaps.length === 0 && mg.checks.ok1.step === 'hotel' && !mg.checks.bad && !('extra' in mg.checks.ok1), 'a damaged v2 store: junk dropped, impossible step placed back, a missing current check replaced by a blank one');
info = {}; mg = F.migrate({ v: 4, cur: idA, checks: raw.checks, future: 1 }, env, info); // v2.6: this build is v3 ok(info.newer && F.cur(mg).step === 'result', 'a newer version is read for what this build understands, and flagged');
info = {}; const moved = JSON.parse(JSON.stringify(s)); moved.checks[idA].useName = 'An older name'; mg = F.migrate(moved, env, info);
ok(info.useChanged && F.cur(mg).use === '' && F.cur(mg).step === 'where' && eq(F.cur(mg).T, {}), 'the catalogue moved under a saved use case: cleared, back on step 4');

// ---------- v1 → v2: records saved by the builds before 24 Nov 2026 ----------
for (const file of ['v1.3-saved.json', 'v1.1-saved.json']) {
  const fx = JSON.parse(readFileSync(join(root, 'tests/fixtures', file), 'utf8'));
  ok(fx.records.length >= 4, file + ': fixture has records');
  fx.records.forEach(x => {
    const old = JSON.parse(x.raw), inf = {}; let m2 = null, threw = false;
    try { m2 = F.migrate(old, env, inf); } catch (e) { threw = true; }
    const tag = file + ' ' + x.name;
    ok(!threw && m2 && m2.v === 3 && Object.keys(m2.checks).length === 1, tag + ': opens without an error, as one check');
    if (!m2) return;
    const c = F.cur(m2), ctx = F.ctxOf(c, env);
    ok(eq(c.Q, L.legacyQ(old.Q).Q) && c.qv === L.QV, tag + ': v2.6: Q1 turned round, Q2 and Q5 kept, the old Q3 and Q4 dropped (were: the five answers are kept)');
    ok(c.use === old.use && c.dept === (old.use === 'none' ? (old.dept || '') : old.dept) && c.cat === old.cat, tag + ': the chosen use case is kept (' + (old.use || 'none yet') + ')');
    ok(eq(c.A, {}) && eq(c.By, {}) && eq(c.T, {}), tag + ': the old step 2 and 3 answers are dropped (the questions are new)');
    ok(F.reachable(c.step, ctx) && c.step === 'start' === (old.step === 'start') && (c.step === 'start' || c.step === 'hotel'), tag + ': lands on a step that can be shown (' + c.step + ': the hotel question is new)');
    ok(inf.fromV1 === true && m2.notice === 'v1', tag + ': the one-time notice is set');
    /* with the hotel type known (the shared profile), the record continues where its answers allow */
    const withType = F.reduce(m2, 'profile', { type: 'independent' }, env).store, c2 = F.cur(F.reduce(withType, 'pop', { start: 'start', q: 'q', stop: 'stop' }[old.step] || 'must', env).store);
    const want = old.step === 'start' ? 'start' : c.Q.q1 === 'y' ? (old.step === 'q' ? 'q' : 'stop') : old.step === 'q' || !F.QIDS.every(k => c.Q[k]) ? 'q' : 'must'; // v2.6: the converted answers
    ok(c2.step === want, tag + ': with the hotel type filled it continues at "' + want + '" (got ' + c2.step + ')');
    ok(eq(F.migrate(JSON.parse(JSON.stringify(m2)), env, {}), m2), tag + ': the converted store round-trips');
    const seen = F.reduce(m2, 'seen', null, env); ok(seen.ok && !seen.store.notice && !F.reduce(seen.store, 'seen', null, env).ok, tag + ': the notice is shown once');
  });
}
ok(F.migrate({ step: 'q', Q: { q1: 'y' } }, env, {}).v === 3, 'a record without a version is read as v1');
info = {}; ok(F.migrate({ v: 1, step: 'start', Q: {}, A: {}, cat: '', dept: '', use: '' }, env, info) && !info.fromV1, 'an empty v1 record: no notice (nothing was kept or lost)');

// ---------- files ----------
const fileRec = JSON.parse(JSON.stringify(F.cur(s)));
r = F.reduce(F.blankStore(), 'import', fileRec, env); ok(r.ok && r.store.cur === idA && eq(F.cur(r.store), F.cur(s)) && Object.keys(r.store.checks).length === 1, 'import: the check from a file opens as saved');
ok(!F.reduce(s, 'import', { id: '!!' }, env).ok && !F.reduce(s, 'import', null, env).ok, 'import: junk refused');
r = F.reduce(s3, 'import', { ...fileRec, id: 'fromfile1' }, env); ok(r.ok && r.store.checks[idA] && r.store.checks.fromfile1 && r.store.cur === 'fromfile1', 'import with another id: added next to the saved checks');

// ---------- page-only machines ----------
let c = F.confirmNext(null, 'ask', 'remove', 'a1'); ok(eq(c.c, { kind: 'remove', id: 'a1' }) && !c.fire, 'confirm: ask');
ok(F.confirmNext(c.c, 'yes', 'remove', 'a1').fire && !F.confirmNext(c.c, 'yes', 'remove', 'b2').fire && !F.confirmNext(c.c, 'yes', 'file').fire && !F.confirmNext(null, 'yes', 'remove', 'a1').fire, 'confirm: yes fires once, only for what was asked');
ok(F.confirmNext(c.c, 'no').c === null && F.confirmNext(c.c, 'nav').c === null && eq(F.confirmNext(c.c, 'other').c, c.c), 'confirm: no and navigation close it');
ok(F.bridgeNext('pending', 'yes') === 'yes' && F.bridgeNext('pending', 'timeout') === 'no' && F.bridgeNext('none', 'yes') === 'none' && F.bridgeNext('yes', 'no') === 'yes', 'BRIDGE: only pending moves');
ok(['making', 'waiting', 'saving'].every(s => F.dlNext(s, 'start', 'yes') === null) && F.dlNext('idle', 'start') === 'making' && F.dlNext('making', 'start') === null && F.dlNext('making', 'made', 'pending') === 'waiting' && F.dlNext('making', 'made', 'yes') === 'saving' && F.dlNext('waiting', 'bridge', 'pending') === null && F.dlNext('waiting', 'bridge', 'no') === 'saving' && F.dlNext('saving', 'done') === 'idle' && F.dlNext('saving', 'start') === null, 'DOWNLOAD: one at a time');
ok(F.histAction('next', { d: 0 }, 'q', 1) === 'push' && F.histAction('back', { d: 2, prev: 'q', len: 5 }, 'q', 5) === 'back' && F.histAction('back', { d: 2, prev: 'q', len: 5 }, 'q', 6) === 'replace' && F.histAction('back', { d: 0, prev: null, len: 5 }, 'q', 5) === 'replace', 'HISTORY: forward pushes; Back goes back only onto the step below');
['new', 'open', 'remove', 'import', 'preselect'].forEach(e => ok(F.histAction(e, { d: 3, prev: 'q', len: 2 }, 'start', 2) === 'replace', 'HISTORY: "' + e + '" replaces'));
ok(eq(F.histEntry('push', { d: 1 }, 'must', 'q', 'a1'), { r2: 'must', d: 2, prev: 'q', id: 'a1' }) && eq(F.histRead({ r2: 'must', d: 2, prev: 'q', id: 'a1' }), { ours: true, step: 'must', d: 2, prev: 'q', id: 'a1' }) && !F.histRead(null).ours && !F.histRead({ hubTool: 'x' }).ours && !F.histRead({ r2: 'needs' }).ours, 'HISTORY entries; an old v1 entry ("needs") is not read as a step');
ok(eq(F.progress('must'), ['done', 'done', 'now', '', '']) && eq(F.progress('result'), ['done', 'done', 'done', 'done', 'done']) && F.progress('start') === null && F.progress('stop') === null, 'progress bar: five steps');
done();
