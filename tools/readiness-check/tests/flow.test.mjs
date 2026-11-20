// Checks the explicit state machines of the readiness check (src/flow.js). Run: node tools/readiness-check/tests/flow.test.mjs
// Each machine: every transition, every guard, and the impossible states found in the clean-up (CLEANUP.md).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..');
const ctx = { self: {} }; vm.runInNewContext(readFileSync(join(root, 'src/flow.js'), 'utf8'), ctx);
const F = ctx.self.RCFlow;
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------- 1. FLOW ----------
// Must-haves first (20 Nov 2026): 'must' (step 1) comes before the six area steps; areas with no question left are skipped.
// ctx.steps lists the question steps in use (default: all seven); ctx.mustDone = every must-have has an answer.
const R = { tool: true, ready: true }, T = { tool: true, ready: false }, N = { tool: false, ready: false };
const RM = { tool: true, ready: true, mustDone: true };
const expect = [
  ['start', 'prep', R, 'prep'], ['prep', 'back', R, 'start'], ['prep', 'begin', R, 'must'],
  ['must', 'back', R, 'prep'], ['must', 'next', RM, 0],
  [0, 'back', R, 'must'], [0, 'next', R, 1], [1, 'back', R, 0], [1, 'next', R, 2], [2, 'back', R, 1], [2, 'next', R, 3], [3, 'back', R, 2], [3, 'next', R, 4], [4, 'back', R, 3], [4, 'next', R, 5], [5, 'back', R, 4], [5, 'next', R, 'result'],
  ['result', 'review', R, 'review'], ['result', 'edit', R, 'must'], ['result', 'new', R, 'start'],
  ['review', 'result', R, 'result'], ['review', 'edit', R, 'must']
];
expect.forEach(([s, e, c, to]) => ok(F.flowNext(s, e, c) === to, `flow ${s} --${e}--> ${to}`));
// Every pair not in the table is refused (no NaN steps, no "back" from review or result).
let refused = 0, total = 0;
F.STEPS.forEach(s => ['prep', 'back', 'begin', 'next', 'review', 'result', 'edit', 'new'].forEach(e => {
  total++; const listed = expect.some(x => x[0] === s && x[1] === e);
  if (!listed) { if (F.flowNext(s, e, RM) === null) refused++; else console.log('FAIL  unexpected flow ' + s + ' ' + e); }
}));
ok(refused === total - expect.length, 'every event not in the table is refused (' + refused + ')');
// v4: 'home' (header link "Your checks") leads to start from every other screen, with or without a tool; not from start itself.
['prep', 'must', 0, 1, 2, 3, 4, 5, 'review', 'result'].forEach(s => ok(F.flowNext(s, 'home', R) === 'start' && F.flowNext(s, 'home', N) === 'start', `flow ${s} --home--> start`));
ok(F.flowNext('start', 'home', R) === null, 'home from start: nothing to do');
ok(F.flowNext('review', 'back', R) === null, 'old bug: "back" from review gave step NaN; now refused');
ok(F.flowNext('start', 'prep', T) === null, 'guard: no "what you will need" without hotel type, tool and stage');
ok(F.flowNext('prep', 'begin', N) === null && F.flowNext('result', 'review', N) === null, 'guard: no step but start without a known tool');
ok(F.flowNext('result', 'new', N) === 'start', 'start is always reachable');
ok(F.flowNext('nonsense', 'next', R) === null, 'unknown state: nothing fires');
// Must-haves first: the guard and skipped areas.
ok(F.flowNext('must', 'next', R) === null && F.flowNext('must', 'next', Object.assign({}, RM, { mustDone: false })) === null, 'guard: "next" from the must-haves is refused while a must-have has no answer');
ok(F.flowNext('must', 'back', R) === 'prep' && F.flowNext('must', 'home', R) === 'start', 'guard: back and home from the must-haves are always allowed');
ok(F.flowNext(3, 'next', R) === 4 && F.flowNext(0, 'back', Object.assign({}, R, { mustDone: false })) === 'must', 'guard only on the must-haves step: area steps keep allowing unanswered questions');
const SK = { tool: true, ready: true, mustDone: true, steps: ['must', 0, 1, 3, 4, 5] }; // Financial investment (2) has no question left
ok(F.flowNext(1, 'next', SK) === 3 && F.flowNext(3, 'back', SK) === 1, 'skipped area: next and back jump over it');
ok(F.flowNext('must', 'next', Object.assign({}, SK, { steps: ['must', 3, 5] })) === 3 && F.flowNext(5, 'next', Object.assign({}, SK, { steps: ['must', 3, 5] })) === 'result' && F.flowNext(3, 'back', Object.assign({}, SK, { steps: ['must', 3, 5] })) === 'must', 'several skipped areas');
ok(F.flowNext(2, 'next', SK) === 3 && F.flowNext(2, 'back', SK) === 1, 'standing on a step that is no longer in use: next/back still lead to the neighbours in use');
ok(F.flowNext('prep', 'begin', Object.assign({}, SK, { steps: [0, 1] })) === 0 && F.flowNext(0, 'back', Object.assign({}, SK, { steps: [0, 1] })) === 'prep', 'a tool without must-haves (none today) starts at its first area');
ok(F.stepNo('must', SK.steps) === 1 && F.stepNo(3, SK.steps) === 4 && SK.steps.length === 6 && F.stepNo(2, SK.steps) === 0, 'step numbers: "Step n of N" counts only the steps in use');
// Pure helpers: which questions go on which step.
const QS = [{ code: 'P1', a: 'pe', gate: true }, { code: 'P2', a: 'pe' }, { code: 'F1', a: 'fi', gate: true }, { code: 'T1', a: 'te', gate: true }, { code: 'T2', a: 'te' }, { code: 'D5a', a: 'da', gate: true }, { code: 'O1', a: 'or', gate: true }, { code: 'O2', a: 'or' }, { code: 'S1', a: 'sk' }];
const AK = ['pe', 'sk', 'fi', 'te', 'da', 'or'];
ok(eq(F.questionSteps(QS, AK), ['must', 0, 1, 3, 5]), 'questionSteps: must-haves first, areas with no question left are skipped');
ok(eq(F.stepQuestions(QS, 'must', AK).map(q => q.code), ['P1', 'F1', 'T1', 'D5a', 'O1']) && eq(F.stepQuestions(QS, 3, AK).map(q => q.code), ['T2']) && eq(F.stepQuestions(QS, 2, AK), []), 'stepQuestions: must-haves in area order; an area step without its must-haves');
const all = [].concat(...F.questionSteps(QS, AK).map(s => F.stepQuestions(QS, s, AK))).map(q => q.code);
ok(all.length === QS.length && new Set(all).size === QS.length, 'every question is asked exactly once (no repeats, none lost)');
ok(F.firstOpenMust(QS, q => q.code !== 'T1' && q.code !== 'O1') === 'T1' && F.firstOpenMust(QS, () => true) === null, 'firstOpenMust: the first must-have without an answer, in screen order');
// placeStep: where a restored check (storage, file, history) reopens.
const P = { tool: true, steps: ['must', 0, 1, 3, 4, 5], mustOpen: false };
ok(F.placeStep(3, P) === 3 && F.placeStep('3', P) === 3 && F.placeStep(0, P) === 0, 'placeStep: an area step reopens at the same area');
ok(F.placeStep(3, Object.assign({}, P, { mustOpen: true })) === 'must' && F.placeStep(0, Object.assign({}, P, { mustOpen: true })) === 'must', 'placeStep: any unanswered must-have → the must-haves step');
ok(F.placeStep('review', Object.assign({}, P, { mustOpen: true })) === 'review' && F.placeStep('result', Object.assign({}, P, { mustOpen: true })) === 'result' && F.placeStep('prep', P) === 'prep', 'placeStep: review, result and prep unchanged');
ok(F.placeStep(2, P) === 3 && F.placeStep(5, Object.assign({}, P, { steps: ['must', 0, 1] })) === 1, 'placeStep: an area with no question left → the next step in use, else the last one');
ok(F.placeStep('must', P) === 'must' && F.placeStep('must', Object.assign({}, P, { steps: [0, 1] })) === 0, 'placeStep: must-haves step kept (or the first step if there are none)');
ok(F.placeStep(9, P) === 'start' && F.placeStep(3, { tool: false, steps: P.steps }) === 'start', 'placeStep: unknown step or no tool → start');
// safeStep: restore from storage, file or history.
ok(F.safeStep('result', { tool: true }) === 'result' && F.safeStep(3, { tool: true }) === 3 && F.safeStep('must', { tool: true }) === 'must', 'safeStep keeps valid steps');
ok(F.safeStep('3', { tool: true }) === 3, 'safeStep reads "3" as step 3');
ok(F.safeStep(7, { tool: true }) === 'start' && F.safeStep(6, { tool: true }) === 'start' && F.safeStep('foo', { tool: true }) === 'start' && F.safeStep(null, { tool: true }) === 'start', 'old bug: an unknown step crashed the page; now start');
ok(F.safeStep('result', { tool: false }) === 'start', 'no tool: start');

// ---------- 2. CONFIRM ----------
let r = F.confirmNext(null, 'ask', 'rm', 'a');
ok(eq(r.c, { kind: 'rm', id: 'a' }) && r.fire === null, 'confirm: ask opens it');
ok(F.confirmNext(r.c, 'yes', 'rm', 'a').fire.id === 'a' && F.confirmNext(r.c, 'yes', 'rm', 'a').c === null, 'confirm: yes fires once and closes');
ok(F.confirmNext(r.c, 'yes', 'rm', 'b').fire === null, 'confirm: yes for another check does nothing');
ok(F.confirmNext(r.c, 'yes', 'new').fire === null, 'confirm: yes of another kind does nothing');
ok(F.confirmNext(null, 'yes', 'rm', 'a').fire === null, 'confirm: yes without ask does nothing (no double fire)');
ok(F.confirmNext(r.c, 'cancel').c === null && F.confirmNext(r.c, 'nav').c === null, 'confirm: cancel and any navigation close it');
ok(eq(F.confirmNext(r.c, 'ask', 'new').c, { kind: 'new', id: null }), 'confirm: only one open at a time (old bug: "Remove?" and "Start new?" both open)');
ok(F.confirmNext(null, 'ask', 'bogus').c === null, 'confirm: unknown kind refused');
ok(F.confirmNext(F.confirmNext(null, 'ask', 'file', 'x').c, 'yes', 'file', 'x').fire.kind === 'file', 'confirm: file replace');

// ---------- 3. SHARE ----------
ok(F.shareNext('none', 'share') === 'sending' && F.shareNext('sending', 'ok') === 'shared', 'share: none → sending → shared');
ok(F.shareNext('sending', 'fail', 'none') === 'none' && F.shareNext('sending', 'fail', 'shared') === 'shared', 'share: failure returns to where it was');
ok(F.shareNext('shared', 'withdraw') === 'withdrawing' && F.shareNext('withdrawing', 'ok') === 'none' && F.shareNext('withdrawing', 'fail') === 'shared', 'share: withdraw');
ok(F.shareNext('shared', 'share') === 'sending', 'share: send an updated copy');
ok(F.shareNext('sending', 'share') === null && F.shareNext('withdrawing', 'withdraw') === null && F.shareNext('sending', 'withdraw') === null, 'share: no double send or withdraw while in flight');
ok(F.shareNext('none', 'withdraw') === null, 'share: nothing to withdraw');
ok(F.shareSettled({ sharedAt: '2026-11-19' }) === 'shared' && F.shareSettled({ sharedAt: null }) === 'none', 'share: settled state from sharedAt');
const rec = { useId: 'rm-2', stage: 'choose', hotel: { role: 'gm', type: 'independent', country: 'Portugal', name: 'X' }, A: { P1: 'y' }, Who: {}, share: { named: false }, sharedAt: '2026-11-19' };
rec.sharedSig = F.shareSig(rec);
ok(!F.shareStale(rec), 'share: fresh copy not stale');
ok(F.shareSig(Object.assign({}, rec, { A: { P1: 'y' } })) === rec.sharedSig, 'share: signature ignores object identity');
ok(F.shareStale(Object.assign({}, rec, { A: { P1: 'n' } })), 'share: changed answer makes the copy out of date');
ok(!F.shareStale(Object.assign({}, rec, { hotel: Object.assign({}, rec.hotel, { name: 'Y' }) })) , 'share: hotel name alone (not sent unless named) does not');
ok(!F.shareStale(Object.assign({}, rec, { sharedSig: null })), 'share: copies shared before the clean-up are not called stale');

// ---------- 4. BRIDGE ----------
ok(F.bridgeNext('pending', 'yes') === 'yes' && F.bridgeNext('pending', 'no') === 'no', 'bridge: pong');
ok(F.bridgeNext('pending', 'timeout') === 'no' && F.bridgeNext('pending', 'error') === 'no', 'bridge: timeout and error are events');
ok(F.bridgeNext('yes', 'timeout') === 'yes' && F.bridgeNext('no', 'yes') === 'no' && F.bridgeNext('none', 'yes') === 'none', 'bridge: settled states are final (late pong or timer ignored)');

// ---------- 5. TEAM ----------
let t = { phase: 'loading', del: null };
ok(eq(F.teamNext(t, 'loaded', 3), { phase: 'ready', del: null }) && eq(F.teamNext(t, 'loaded', 0), { phase: 'empty', del: null }) && eq(F.teamNext(t, 'failed'), { phase: 'error', del: null }), 'team: loading → ready / empty / error');
ok(F.teamNext(t, 'refresh') === null, 'team: no second load while loading');
const rd = { phase: 'ready', del: null };
ok(eq(F.teamNext(rd, 'ask-del'), { phase: 'ready', del: 'confirm' }), 'team: ask to delete');
const cf = { phase: 'ready', del: 'confirm' };
ok(eq(F.teamNext(cf, 'cancel-del'), rd) && eq(F.teamNext(cf, 'yes-del'), { phase: 'ready', del: 'deleting' }), 'team: cancel / confirm delete');
ok(eq(F.teamNext(cf, 'refresh'), { phase: 'loading', del: null }) && eq(F.teamNext(cf, 'select'), rd), 'team: refresh or another check closes the confirm (old bug: it stayed open)');
const dl = { phase: 'ready', del: 'deleting' };
ok(F.teamNext(dl, 'yes-del') === null && F.teamNext(dl, 'refresh') === null && F.teamNext(dl, 'select') === null, 'team: no double delete, no refresh mid-delete');
ok(eq(F.teamNext(dl, 'deleted'), { phase: 'loading', del: null }) && eq(F.teamNext(dl, 'del-failed'), rd), 'team: delete answered');
ok(F.teamNext({ phase: 'empty', del: null }, 'ask-del') === null && F.teamNext({ phase: 'error', del: null }, 'ask-del') === null, 'team: nothing to delete when empty or failed');
ok(eq(F.teamNext({ phase: 'error', del: null }, 'refresh'), { phase: 'loading', del: null }), 'team: retry after error');

// ---------- 6. RECORD ----------
const known = u => u === 'rm-2';
// A record exactly as the build of 18 Nov 2026 saved it (no rv, no sharedSig).
const v1 = { id: 'rcabc', step: 'result', hotel: { name: 'Casa', role: 'gm', type: 'independent', country: 'Portugal' }, stage: 'choose', useId: 'rm-2', A: { P1: 'y', 'T3#0': 'n' }, P: { P1: 'Revenue manager, four hours weekly' }, Who: { F2: 'fin' },
  owner: { ask: 'Trial', cost: '', by: '' }, next: { when: 'sign', date: '' }, snaps: [{ at: '2026-11-18T10:00:00Z', rules: 'v3 (19 Nov 2026)', level: 'open', met: 1, gates: 6, known: 3, asked: 20, open: 9, metCodes: ['P1'] }], share: { on: false, named: false }, sharedAt: null, created: '2026-11-18T09:00:00Z', updated: '2026-11-18T10:00:00Z', extra: 'kept' };
const m1 = F.migrate(JSON.parse(JSON.stringify(v1)), known);
ok(m1 && m1.rv === F.RV && m1.step === 'result' && m1.A.P1 === 'y' && m1.A['T3#0'] === 'n' && m1.P.P1 === v1.P.P1 && m1.snaps.length === 1 && m1.extra === 'kept', 'record: a check saved by the current build opens unchanged, gains rv');
ok(eq(F.migrate(JSON.parse(JSON.stringify(m1)), known), m1), 'record: migrate is idempotent');
ok(F.migrate(Object.assign({}, v1, { useId: 'gone-9' }), known) === null, 'record: tool not in this catalogue → not opened (left in storage by the page)');
ok(F.migrate(Object.assign({}, v1, { id: '' }), known) === null && F.migrate(null, known) === null && F.migrate([], known) === null, 'record: damaged → null');
const bad = F.migrate(Object.assign({}, v1, { step: 9, A: { P1: 3, P2: 'y' }, snaps: 'x', hotel: null, share: null, owner: 5 }), known);
ok(bad && bad.step === 'start' && eq(bad.A, { P2: 'y' }) && eq(bad.snaps, []) && bad.hotel.name === '' && bad.share.named === false && bad.owner.ask === '', 'record: bad fields fall back to safe values');
ok(F.migrate(Object.assign({}, v1, { useId: '' }), known).step === 'start', 'record: no tool → start');
ok(F.migrate(Object.assign({}, v1, { sharedMode: 'weird' }), known).sharedMode === null, 'record: unknown share mode dropped');

console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
