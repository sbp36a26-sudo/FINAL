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
const R = { tool: true, ready: true }, T = { tool: true, ready: false }, N = { tool: false, ready: false };
const expect = [
  ['start', 'prep', R, 'prep'], ['prep', 'back', R, 'start'], ['prep', 'begin', R, 0],
  [0, 'back', R, 'prep'], [0, 'next', R, 1], [1, 'back', R, 0], [1, 'next', R, 2], [2, 'back', R, 1], [2, 'next', R, 3], [3, 'back', R, 2], [3, 'next', R, 4], [4, 'back', R, 3], [4, 'next', R, 5], [5, 'back', R, 4], [5, 'next', R, 'result'],
  ['result', 'review', R, 'review'], ['result', 'edit', R, 0], ['result', 'new', R, 'start'],
  ['review', 'result', R, 'result'], ['review', 'edit', R, 0]
];
expect.forEach(([s, e, c, to]) => ok(F.flowNext(s, e, c) === to, `flow ${s} --${e}--> ${to}`));
// Every pair not in the table is refused (no NaN steps, no "back" from review or result).
let refused = 0, total = 0;
F.STEPS.forEach(s => ['prep', 'back', 'begin', 'next', 'review', 'result', 'edit', 'new'].forEach(e => {
  total++; const listed = expect.some(x => x[0] === s && x[1] === e);
  if (!listed) { if (F.flowNext(s, e, R) === null) refused++; else console.log('FAIL  unexpected flow ' + s + ' ' + e); }
}));
ok(refused === total - expect.length, 'every event not in the table is refused (' + refused + ')');
ok(F.flowNext('review', 'back', R) === null, 'old bug: "back" from review gave step NaN; now refused');
ok(F.flowNext('start', 'prep', T) === null, 'guard: no "what you will need" without hotel type, tool and stage');
ok(F.flowNext('prep', 'begin', N) === null && F.flowNext('result', 'review', N) === null, 'guard: no step but start without a known tool');
ok(F.flowNext('result', 'new', N) === 'start', 'start is always reachable');
ok(F.flowNext('nonsense', 'next', R) === null, 'unknown state: nothing fires');
// safeStep: restore from storage, file or history.
ok(F.safeStep('result', { tool: true }) === 'result' && F.safeStep(3, { tool: true }) === 3, 'safeStep keeps valid steps');
ok(F.safeStep('3', { tool: true }) === 3, 'safeStep reads "3" as step 3');
ok(F.safeStep(7, { tool: true }) === 'start' && F.safeStep('foo', { tool: true }) === 'start' && F.safeStep(null, { tool: true }) === 'start', 'old bug: an unknown step crashed the page; now start');
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
