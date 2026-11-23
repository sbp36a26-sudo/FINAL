// Readiness 2.0 state machines (src/flow.js): every transition, every guard, Back/forward (pop), restart, storage.
// Run: node tools/readiness-2/tests/flow.test.mjs
import { load, catalogue, tester } from './load.mjs';
const { F } = load();
const CAT = catalogue();
const { ok, done } = tester('flow');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const allQ = v => ({ q1: v, q2: v, q3: v, q4: v, q5: v });
const allA = v => Object.fromEntries([...F.NEED_IDS, ...F.FACTOR_IDS].map(id => [id, v]));
const R = (o) => Object.assign(F.blank(), o);
const full = R({ step: 'summary', Q: allQ('y'), cat: 'Guest-facing', dept: 'fo', use: 'fo-1', A: allA('y') });

// ---------- transition table ----------
const c = F.ctxOf(full, CAT);
const table = [
  ['start', 'begin', 'q'], ['q', 'back', 'start'], ['q', 'next', 'where'], ['where', 'back', 'q'], ['where', 'next', 'needs'],
  ['needs', 'back', 'where'], ['needs', 'next', 'success'], ['success', 'back', 'needs'], ['success', 'next', 'summary'],
  ['summary', 'back', 'success'], ['summary', 'edit', 'q'],
  ['q', 'restart', 'start'], ['where', 'restart', 'start'], ['needs', 'restart', 'start'], ['success', 'restart', 'start'], ['summary', 'restart', 'start']
];
table.forEach(([s, e, to]) => ok(F.flowNext(s, e, c) === to, `${s} --${e}--> ${to}`));
const EVS = ['begin', 'next', 'back', 'change', 'edit', 'restart'];
let refused = 0;
F.STEPS.forEach(s => EVS.forEach(e => { if (!table.some(t => t[0] === s && t[1] === e) && !(s === 'stop')) { ok(F.flowNext(s, e, c) === null, 'not in the table: ' + s + ' ' + e); refused++; } }));
ok(refused >= 20, 'events outside the table are refused (' + refused + ')');
ok(F.flowNext('nonsense', 'next', c) === null, 'unknown state: nothing fires');

// ---------- Q1 No: the stop screen and nothing past it ----------
const stopCtx = F.ctxOf(R({ Q: { q1: 'n' } }), CAT);
ok(F.flowNext('q', 'next', stopCtx) === 'stop', 'Q1 No: next goes to the stop screen, even with the rest blank');
ok(F.flowNext('stop', 'change', stopCtx) === 'q' && F.flowNext('stop', 'restart', stopCtx) === 'start', 'stop: "Change my answers" and "Start again"');
['next', 'back', 'begin', 'edit'].forEach(e => ok(F.flowNext('stop', e, stopCtx) === null, 'stop: no way on with ' + e));
ok(eq(F.events('stop', stopCtx), ['change', 'restart']), 'stop screen offers exactly two events');
// Exhaustive: every combination of Q answers (blank included) × every other answer state; with Q1 No no later step is reachable
const QV = ['y', 'n', 'u', undefined];
let walked = 0;
for (const a of QV) for (const b of QV) for (const d of QV) for (const e of QV) for (const f of QV) {
  const Q = {}; [['q1', a], ['q2', b], ['q3', d], ['q4', e], ['q5', f]].forEach(([k, v]) => { if (v) Q[k] = v; });
  for (const extra of [{}, { cat: 'Guest-facing', dept: 'fo', use: 'fo-2', A: allA('y') }, { use: 'none', A: allA('k') }]) {
    const rec = R(Object.assign({ Q }, extra)), cx = F.ctxOf(rec, CAT); walked++;
    if (a === 'n') {
      ['where', 'needs', 'success', 'summary'].forEach(s => ok(!F.reachable(s, cx), 'Q1 No: ' + s + ' unreachable ' + JSON.stringify(Q)));
      ['where', 'needs', 'success', 'summary'].forEach(s => ok(F.placeStep(s, cx) === 'stop', 'Q1 No: a saved/back ' + s + ' lands on stop'));
      ok(F.flowNext('q', 'next', cx) === 'stop', 'Q1 No: next → stop');
    } else {
      ok(!F.reachable('stop', cx), 'stop only with Q1 No ' + JSON.stringify(Q));
      const allAns = [a, b, d, e, f].every(Boolean);
      ok(F.reachable('where', cx) === allAns, 'step 1b needs all five answered ' + JSON.stringify(Q));
      ok(F.flowNext('q', 'next', cx) === (allAns ? 'where' : null), 'next from 1a guarded ' + JSON.stringify(Q));
    }
  }
}
ok(walked === 4 ** 5 * 3, 'walked ' + walked + ' answer states');
// Event walk through reduce: from any reachable record, no sequence of events reaches 1b/2/3/summary while Q1 is No
{
  const evs = [['begin'], ['next'], ['back'], ['change'], ['edit'], ['restart'], ['answer', { id: 'q1', value: 'n' }], ['answer', { id: 'q1', value: 'y' }],
    ['answer', { id: 'q2', value: 'y' }], ['answer', { id: 'q3', value: 'y' }], ['answer', { id: 'q4', value: 'y' }], ['answer', { id: 'q5', value: 'u' }],
    ['cat', 'Guest-facing'], ['dept', 'fo'], ['use', 'fo-1'], ['use', 'none'], ['pop', 'summary'], ['pop', 'where'], ['pop', 'stop'],
    ...F.NEED_IDS.map(id => ['answer', { id, value: 'y' }]), ...F.FACTOR_IDS.map(id => ['answer', { id, value: 'k' }])];
  const seen = new Set(), todo = [F.blank()]; let bad = 0;
  while (todo.length && seen.size < 30000) {
    const r = todo.pop(), k = JSON.stringify(r); if (seen.has(k)) continue; seen.add(k);
    const cx = F.ctxOf(r, CAT);
    if (!F.reachable(r.step, cx)) bad++;
    if (r.Q.q1 === 'n' && ['where', 'needs', 'success', 'summary'].includes(r.step)) bad++;
    for (const [e, a] of evs) { const n = F.reduce(r, e, a, CAT); if (n.ok || e === 'pop') todo.push(n.rec); }
  }
  ok(bad === 0, 'event walk: every reached record shows a reachable step, never 1b+ with Q1 No (' + seen.size + ' records)');
  ok([...seen].some(s => JSON.parse(s).step === 'summary') && [...seen].some(s => JSON.parse(s).step === 'stop'), 'the walk reaches both the summary and the stop screen');
}

// ---------- guards on 1b, 2, 3 ----------
const at = (step, o) => R(Object.assign({ step, Q: allQ('y') }, o));
ok(F.reduce(at('where', {}), 'next', null, CAT).ok === false, '1b: next refused without a choice');
ok(F.reduce(at('where', { cat: 'Guest-facing', dept: 'fo' }), 'next', null, CAT).ok === false, '1b: a department alone is not a choice');
ok(F.reduce(at('where', { cat: 'Guest-facing', dept: 'fo', use: 'fo-3' }), 'next', null, CAT).rec.step === 'needs', '1b: a use case of the department');
ok(F.reduce(at('where', { use: 'none' }), 'next', null, CAT).rec.step === 'needs', '1b: "None of these fits" counts as a choice');
ok(F.reduce(at('needs', { use: 'none', A: Object.assign(allA('y'), { b10: undefined }) }), 'next', null, CAT).ok === false, 'step 2: next refused with an item blank');
ok(F.reduce(at('needs', { use: 'none', A: allA('k') }), 'next', null, CAT).rec.step === 'success', 'step 2: Don’t know yet counts as an answer');
ok(F.reduce(at('success', { use: 'none', A: Object.assign(allA('y'), { c9: undefined }) }), 'next', null, CAT).ok === false, 'step 3: next refused with an item blank');
ok(F.reduce(at('success', { use: 'none', A: allA('pl') }), 'next', null, CAT).rec.step === 'summary', 'step 3 → summary');

// ---------- choices on 1b ----------
let r = at('where', {});
r = F.reduce(r, 'cat', 'Guest-facing', CAT).rec; ok(r.cat === 'Guest-facing' && !r.dept, 'pick a category');
ok(F.reduce(r, 'dept', 'rm', CAT).ok === false, 'a department of another category is refused');
r = F.reduce(r, 'dept', 'fo', CAT).rec; ok(r.dept === 'fo', 'pick a department');
ok(F.reduce(r, 'use', 'rm-1', CAT).ok === false && F.reduce(r, 'use', 'fo-99', CAT).ok === false, 'a use case outside the department is refused');
r = F.reduce(r, 'use', 'fo-2', CAT).rec; ok(r.use === 'fo-2', 'pick a use case');
r = F.reduce(r, 'cat', 'Operational', CAT).rec; ok(r.cat === 'Operational' && r.dept === '' && r.use === '', 'changing the category clears department and use case');
r = F.reduce(F.reduce(r, 'use', 'none', CAT).rec, 'cat', 'Commercial', CAT).rec; ok(r.use === 'none', '"None of these fits" survives a category change');
ok(F.reduce(r, 'cat', 'Spa', CAT).ok === false, 'unknown category refused');
ok(F.reduce(at('q', {}), 'cat', 'Commercial', CAT).ok === false, 'choices only on step 1b');

// ---------- answers only on their own step ----------
ok(F.reduce(at('summary', { use: 'none', A: allA('y') }), 'answer', { id: 'q1', value: 'n' }, CAT).ok === false, 'no Q answer from the summary (it could make the screen impossible)');
ok(F.reduce(at('q', {}), 'answer', { id: 'b1', value: 'y' }, CAT).ok === false, 'no step-2 answer on step 1a');
ok(F.reduce(at('needs', {}), 'answer', { id: 'c1', value: 'y' }, CAT).ok === false, 'no step-3 answer on step 2');
ok(F.reduce(at('needs', {}), 'answer', { id: 'b1', value: 'maybe' }, CAT).ok === false, 'junk answer refused');
ok(F.reduce(at('q', {}), 'answer', { id: 'q1', value: 'pl' }, CAT).ok === false, 'step-2 scale value refused on step 1a');
// By when? only with Planned; the date goes when the answer changes
let s2 = F.reduce(at('needs', {}), 'answer', { id: 'b1', value: 'pl' }, CAT).rec;
ok(F.reduce(s2, 'by', { id: 'b1', date: '2027-01-31' }, CAT).rec.By.b1 === '2027-01-31', 'By when? stored for Planned');
ok(F.reduce(s2, 'by', { id: 'b1', date: '31/01/2027' }, CAT).ok === false, 'malformed date refused');
ok(F.reduce(s2, 'by', { id: 'b3', date: '2027-01-31' }, CAT).ok === false, 'no date without Planned');
s2 = F.reduce(s2, 'by', { id: 'b1', date: '2027-01-31' }, CAT).rec;
ok(F.reduce(s2, 'answer', { id: 'b1', value: 'y' }, CAT).rec.By.b1 === undefined, 'changing away from Planned drops the date');
ok(F.reduce(s2, 'by', { id: 'b1', date: '' }, CAT).rec.By.b1 === undefined, 'clearing the date');

// ---------- Back / forward (pop) ----------
ok(F.reduce(full, 'pop', 'needs', CAT).rec.step === 'needs' && F.reduce(full, 'pop', 'needs', CAT).ok, 'pop to an earlier step');
ok(F.reduce(R({ step: 'q' }), 'pop', 'summary', CAT).rec.step === 'q', 'forward to the summary with nothing answered lands on 1a');
ok(F.reduce(at('q', {}), 'pop', 'summary', CAT).rec.step === 'where', 'forward to the summary with only 1a answered lands on 1b');
ok(F.reduce(at('needs', { use: 'none' }), 'pop', 'summary', CAT).rec.step === 'needs', 'forward past an unanswered step lands on it');
ok(F.reduce(R({ step: 'q', Q: { q1: 'n' } }), 'pop', 'where', CAT).rec.step === 'stop', 'after changing Q1 to No, forward to 1b shows the stop screen');
ok(F.reduce(R({ step: 'q', Q: allQ('y') }), 'pop', 'stop', CAT).rec.step === 'q', 'after changing Q1 to Yes, Back to the stop screen lands on 1a');
ok(F.reduce(full, 'pop', 'garbage', CAT).rec.step === 'start', 'unknown history entry → start');
ok(F.reduce(full, 'pop', 'needs', CAT).rec.A.b1 === 'y', 'Back keeps the answers');

// ---------- restart and its confirmation ----------
ok(eq(F.reduce(full, 'restart', null, CAT).rec, F.blank()), 'restart clears everything');
ok(F.reduce(F.blank(), 'restart', null, CAT).ok === false, 'nothing to restart on the start screen');
let cf = F.confirmNext(null, 'ask'); ok(cf.c === 'restart' && !cf.fire, 'confirm: ask opens it');
ok(F.confirmNext(cf.c, 'yes').fire === true && F.confirmNext(cf.c, 'yes').c === null, 'confirm: yes fires once and closes');
ok(F.confirmNext(null, 'yes').fire === false, 'confirm: a stale yes does nothing');
ok(F.confirmNext(cf.c, 'no').c === null && F.confirmNext(cf.c, 'nav').c === null, 'confirm: no / navigation closes it');

// ---------- storage: versioned record, round trip, corrupt data ----------
ok(F.KEY === 'hftp-readiness2-v1' && F.V === 1, 'storage key and version');
const store = rec => JSON.parse(JSON.stringify(Object.assign({}, rec, { updated: '2026-11-23T10:00:00.000Z' })));
const recs = [full, F.blank(), R({ step: 'stop', Q: { q1: 'n', q2: 'u' } }), R({ step: 'where', Q: allQ('u'), cat: 'Administrative', dept: 'lg', use: 'lg-4' }),
  R({ step: 'success', Q: allQ('y'), use: 'none', A: Object.assign(allA('pl'), { c1: undefined }), By: { b1: '2027-02-01' } })];
/* v1.2 (clean-up M2): a record now carries the chosen use case's catalogue name (useName); a record saved without it
   (before v1.2) gets the name filled in on load. Records saved by this build carry it, so the round trip adds it here. */
const nameOf = id => (CAT.depts.flatMap(d => d.uses).find(u => u.id === id) || { n: '' }).n;
recs.forEach((x, i) => { const y = Object.assign({}, x, { useName: x.use && x.use !== 'none' ? nameOf(x.use) : '' }); const back = F.migrate(store(y), CAT); const want = JSON.parse(JSON.stringify(y)); ok(eq(back, want), 'round trip #' + i); });
[null, 'text', 42, [], { v: 'one' }, { v: 0 }, { v: -1 }].forEach((x, i) => ok(F.migrate(x, CAT) === null, 'corrupt value refused #' + i));
const junk = F.migrate({ v: 1, step: 'summary', Q: { q1: 'y', q2: 'maybe', q9: 'y' }, cat: 'Spa', dept: 'fo', use: 'fo-1', A: { b1: 'yes', b3: 'y', zz: 'y' }, By: { b3: '2027-01-01' }, extra: 1 }, CAT);
ok(junk && junk.Q.q1 === 'y' && !('q2' in junk.Q) && !('q9' in junk.Q), 'bad answers dropped, good ones kept');
ok(junk.cat === '' && junk.dept === '' && junk.use === '', 'a department outside its category and a use case without one are dropped');
ok(eq(junk.A, { b3: 'y' }) && eq(junk.By, {}) && !('extra' in junk), 'unknown fields and dates without Planned dropped');
ok(junk.step === 'q', 'a saved summary that cannot be shown reopens at the first open step');
ok(F.migrate({ step: 'q', Q: { q1: 'y' } }, CAT).v === 1, 'migration stub: a record without a version is read as version 1');
ok(F.migrate({ v: 2, step: 'q', Q: { q1: 'u' }, future: true }, CAT).Q.q1 === 'u', 'a newer version is read for what this build understands');
ok(F.migrate({ v: 1, step: 'needs', Q: { q1: 'n' } }, CAT).step === 'stop', 'saved past the stop with Q1 No → stop');
ok(F.migrate({ v: 1, step: 'where', Q: allQ('y'), cat: 'Guest-facing', dept: 'fo', use: 'fo-999' }, CAT).use === '', 'a use case no longer in the catalogue is dropped');
ok(F.migrate({ v: 1, step: 'needs', Q: allQ('y'), cat: 'Guest-facing', dept: 'fo', use: 'fo-999' }, CAT).step === 'where', '…and the record reopens at 1b');
ok(eq(F.events('summary', F.ctxOf(full, CAT)), ['back', 'edit', 'restart']), 'summary offers back, edit, restart');
done();
