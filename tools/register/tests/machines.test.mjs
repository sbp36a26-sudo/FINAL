// Checks the register page's state machines (src/machines.js). Run: node tools/register/tests/machines.test.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const ctx = { self: {} };
vm.runInNewContext(readFileSync(join(here, '..', 'src/machines.js'), 'utf8'), ctx);
const M = ctx.self.RegMachines;

let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log('FAIL  ' + name); } };
const eq = (a, b, name) => ok(JSON.stringify(a) === JSON.stringify(b), name + '  (got ' + JSON.stringify(a) + ', expected ' + JSON.stringify(b) + ')');
const has = id => id === 't1' || id === 't2';

// ---- 1. route ----
eq(M.route('how'), { tab: 'how', view: 'list', toolId: null }, 'route: plain tab');
eq(M.route('register', 'pick'), { tab: 'register', view: 'pick', toolId: null }, 'route: picker');
eq(M.route('register', 'tool', 't1', has), { tab: 'register', view: 'tool', toolId: 't1' }, 'route: tool that exists');
eq(M.route('register', 'tool', 'gone', has), { tab: 'register', view: 'list', toolId: null }, 'route: deleted tool falls back to the list (was view "tool" with no tool)');
eq(M.route('register', 'tool', null, has), { tab: 'register', view: 'list', toolId: null }, 'route: tool view without an id is impossible');
eq(M.route('register', 'tool', 5, () => true), { tab: 'register', view: 'list', toolId: null }, 'route: a non-string id is rejected');
eq(M.route('todo', 'tool', 't1', has), { tab: 'todo', view: 'list', toolId: null }, 'route: views other than list only on the register tab');
eq(M.route('register', 'list', 't1', has), { tab: 'register', view: 'list', toolId: null }, 'route: list carries no tool id');
eq(M.route('nonsense', 'pick'), { tab: 'how', view: 'list', toolId: null }, 'route: unknown tab falls back to How it works');
eq(M.route('register', 'weird'), { tab: 'register', view: 'list', toolId: null }, 'route: unknown view falls back to the list');
ok(M.TABS.every(t => M.route(t).tab === t), 'route: every tab is reachable');
eq(M.historyEntry(M.route('register', 'tool', 't2', has)), { reg: ['register', 'tool', 't2'] }, 'history entry keeps the phase 3 shape');
eq(M.routeFromHistory({ reg: ['register', 'tool', 't2'] }, has), { tab: 'register', view: 'tool', toolId: 't2' }, 'history: round trip');
eq(M.routeFromHistory({ reg: ['register', 'tool', 'gone'] }, has), { tab: 'register', view: 'list', toolId: null }, 'history: Back to a deleted tool shows the list');
ok(M.routeFromHistory(null, has) === null && M.routeFromHistory({ other: 1 }, has) === null && M.routeFromHistory({ reg: 'x' }, has) === null, 'history: foreign or empty entries give no route');
ok(M.sameRoute(M.route('watch'), M.route('watch')) && !M.sameRoute(M.route('watch'), M.route('todo')) && !M.sameRoute(null, M.route('todo')), 'sameRoute');
eq(['how', 'register/list', 'register/tool'].join(), [M.routeName(M.route('how')), M.routeName(M.route('register')), M.routeName(M.route('register', 'tool', 't1', has))].join(), 'routeName (data-state values)');

// ---- 2. dialog ----
const none = { name: 'none' };
const ask = (kind, extra) => Object.assign({ type: 'ask', kind }, extra || {});
let r = M.dialogSend(none, ask('reset'));
eq([r.dialog.name, r.dialog.kind, r.effect], ['confirm', 'reset', null], 'dialog: none --ask--> confirm');
const confirmReset = r.dialog;
r = M.dialogSend(confirmReset, { type: 'cancel' });
eq([r.dialog.name, r.effect], ['none', null], 'dialog: confirm --cancel--> none, no effect');
r = M.dialogSend(confirmReset, { type: 'yes' });
eq([r.dialog.name, r.effect && r.effect.kind], ['none', 'reset'], 'dialog: confirm --yes--> none with the effect');
const again = M.dialogSend(r.dialog, { type: 'yes' });
ok(again.ignored && again.effect === null, 'dialog: a second "yes" is ignored (no double delete or double import)');
ok(M.dialogSend(none, { type: 'cancel' }).ignored && M.dialogSend(none, { type: 'close' }).ignored, 'dialog: cancel and close do nothing when nothing is open');
ok(M.dialogSend(none, ask('delete')).ignored, 'dialog guard: delete needs a tool id');
r = M.dialogSend(none, ask('delete', { id: 't1' }));
r = M.dialogSend(r.dialog, { type: 'yes' });
eq([r.effect.kind, r.effect.id], ['delete', 't1'], 'dialog: delete effect names the tool asked about');
ok(M.dialogSend(none, ask('import')).ignored && M.dialogSend(none, ask('import', { payload: { tools: 'x' } })).ignored, 'dialog guard: import needs a register read from the backup');
const reg = { v: 1, tools: [{ id: 'a' }] };
r = M.dialogSend(M.dialogSend(none, ask('import', { payload: reg })).dialog, { type: 'yes' });
ok(r.effect.kind === 'import' && r.effect.payload === reg, 'dialog: import effect carries the backup');
r = M.dialogSend(M.dialogSend(none, ask('import', { payload: reg })).dialog, { type: 'cancel' });
ok(r.dialog.name === 'none' && !r.dialog.payload, 'dialog: cancelling an import drops the backup (no pending import left behind)');
ok(M.dialogSend(none, ask('format-disk')).ignored, 'dialog guard: unknown confirm kinds are ignored');
r = M.dialogSend(none, { type: 'copy', title: 'Email to A', text: 'hello' });
eq([r.dialog.name, r.dialog.title, r.dialog.text], ['copy', 'Email to A', 'hello'], 'dialog: none --copy--> copy');
ok(M.dialogSend(r.dialog, { type: 'yes' }).ignored, 'dialog: "yes" does nothing on a copy box');
eq(M.dialogSend(r.dialog, { type: 'close' }).dialog.name, 'none', 'dialog: copy --close--> none');
eq(M.dialogSend(r.dialog, ask('delete', { id: 't1' })).dialog.kind, 'delete', 'dialog: copy --ask--> confirm (only one box open at a time)');
eq(M.dialogSend(confirmReset, { type: 'copy', title: 'x' }).dialog.name, 'copy', 'dialog: confirm --copy--> copy (the confirm closes)');
eq(M.dialogSend(confirmReset, ask('example')).dialog.kind, 'example', 'dialog: a newer confirm replaces the older one');
ok(['none', 'confirm', 'copy'].every(n => M.dialogSend(n === 'none' ? none : n === 'copy' ? { name: 'copy', title: 't' } : confirmReset, { type: 'navigate' }).dialog.name === 'none'), 'dialog: navigating closes any box');
ok(M.dialogSend({ name: 'bogus' }, { type: 'cancel' }).dialog.name === 'none', 'dialog: an unknown state is treated as none');
eq(M.dialogName(confirmReset) + ' ' + M.dialogName(none) + ' ' + M.dialogName({ name: 'copy' }), 'confirm:reset none copy', 'dialogName (data-dialog values)');
ok(M.dialogHome('delete', M.route('register', 'tool', 't1', has)) && !M.dialogHome('delete', M.route('register')), 'dialog home: delete only on a tool page');
ok(M.dialogHome('import', M.route('how')) && !M.dialogHome('import', M.route('todo')) && M.dialogHome('reset', M.route('how')), 'dialog home: backup and reset under How it works');
ok(M.dialogHome('own', M.route('todo')) && M.dialogHome('own', M.route('hotel')) && M.dialogHome('own', M.route('register')) && !M.dialogHome('own', M.route('watch')), 'dialog home: "start my own" wherever the example note shows');
ok(M.dialogHome('example', M.route('how')) && M.dialogHome('example', M.route('register')), 'dialog home: example');
// table completeness: every state has navigate; every event in the table leads to a known state
ok(Object.keys(M.DIALOG).every(s => M.DIALOG[s].navigate === 'none' && Object.values(M.DIALOG[s]).every(n => n in M.DIALOG)), 'dialog table: closed and complete');

// ---- 3. host (download bridge) ----
eq([M.hostStart(false, false), M.hostStart(true, true), M.hostStart(true, false)], ['none', 'pending', 'no'], 'host start: no frame / hub frame / other-origin frame (was 12 s wait)');
eq(M.hostSend('pending', { type: 'pong', downloads: true }), 'yes', 'host: pending --pong(yes)--> yes');
eq(M.hostSend('pending', { type: 'pong', downloads: false }), 'no', 'host: pending --pong(no)--> no');
eq(M.hostSend('pending', { type: 'timeout' }), 'no', 'host: pending --timeout--> no');
eq([M.hostSend('yes', { type: 'timeout' }), M.hostSend('no', { type: 'pong', downloads: true }), M.hostSend('none', { type: 'pong', downloads: true })], ['yes', 'no', 'none'], 'host: final states ignore late events (a late timeout cannot undo "yes")');
eq(M.hostSend('pending', { type: 'nonsense' }), 'pending', 'host: unknown events ignored');

// ---- 4. stored register ----
eq(M.readStored(null).status, 'empty', 'stored: nothing saved');
eq(M.readStored('').status, 'empty', 'stored: empty string');
const good = M.readStored(JSON.stringify({ v: 1, tools: [], hotel: {} }));
ok(good.status === 'ok' && Array.isArray(good.data.tools), 'stored: v1 register loads');
eq([M.readStored('{oops').status, M.readStored('{oops').reason], ['unreadable', 'damaged'], 'stored: damaged JSON is unreadable, not "storage blocked"');
eq(M.readStored(JSON.stringify({ v: 2, tools: [] })).reason, 'newer', 'stored: a newer version is not overwritten as if empty');
eq(M.readStored(JSON.stringify({ tools: [] })).reason, 'version', 'stored: no version');
eq(M.readStored(JSON.stringify({ v: 1, tools: 'x' })).reason, 'shape', 'stored: tools must be a list');
eq(M.readStored('[1,2]').reason, 'shape', 'stored: an array is not a register');
eq(M.readStored({ v: 1, tools: [] }).status, 'ok', 'stored: accepts an object too');
ok(M.VERSION === 1 && Object.keys(M.MIGRATE).length === 0, 'stored: version 1, no migrations yet');
const fixture = join(here, 'fixtures/register-saved-19nov2026.json');
const fx = M.readStored(readFileSync(fixture, 'utf8'));
ok(fx.status === 'ok' && fx.data.tools.length === 2 && fx.data.tools[0].useId === 'hr-2', 'stored: a register saved by the 19 Nov 2026 build still loads');

// ---- 5. #add= link ----
eq(M.parseAddHash('#add=hr-1&name=Rota%20planner'), { useId: 'hr-1', name: 'Rota planner' }, 'hash: id and name');
eq(M.parseAddHash('#add=gx-2'), { useId: 'gx-2', name: '' }, 'hash: id only');
eq(M.parseAddHash('#add=hr-3&name=%E0%A4%A'), { useId: 'hr-3', name: '' }, 'hash: a malformed name is ignored (was URIError and a blank page)');
eq(M.parseAddHash('#foo=1&add=kc-1'), { useId: 'kc-1', name: '' }, 'hash: add after another parameter');
ok(M.parseAddHash('') === null && M.parseAddHash('#use=hr-1') === null && M.parseAddHash('#add=HR-1') === null, 'hash: anything else is not an add link');

console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
