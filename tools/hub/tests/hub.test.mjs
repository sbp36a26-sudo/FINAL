// Hub tab machine: every transition and guard. Run: node tools/hub/tests/hub.test.mjs
// The machine lives inline in hub/hub-bar.html between "machine:start" and "machine:end"; this test runs that block as is.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'hub-bar.html'), 'utf8');
const block = src.slice(src.indexOf('/* machine:start'), src.indexOf('/* machine:end */'));
assert.ok(block.length > 100, 'machine block found');
const { hubInitial, hubNext, HUB_TOOLS } = new Function(block + '; return { hubInitial, hubNext, HUB_TOOLS };')();

let n = 0;
function t(name, fn) { fn(); n++; console.log('ok', n, name); }
const S = (tool, access, pending = null) => ({ tool, access, pending });

t('initial state is the assessment, access unknown', () => assert.deepEqual(hubInitial(), S('assessment', 'unknown')));
t('select every ordinary tool in any access state', () => {
  for (const access of ['unknown', 'local', 'editor', 'viewer'])
    for (const tool of HUB_TOOLS.filter(x => x !== 'team')) assert.deepEqual(hubNext(S('assessment', access), { type: 'select', tool }), S(tool, access));
});
t('unknown tool names are ignored (old sessionStorage, typos, frames)', () => {
  for (const tool of ['readiness', '', undefined, 'TEAM', '../x']) assert.deepEqual(hubNext(S('register', 'local'), { type: 'select', tool }), S('register', 'local'));
});
t('team opens for local and editor', () => {
  assert.equal(hubNext(S('assessment', 'local'), { type: 'select', tool: 'team' }).tool, 'team');
  assert.equal(hubNext(S('assessment', 'editor'), { type: 'select', tool: 'team' }).tool, 'team');
});
t('team never opens for a viewer', () => assert.deepEqual(hubNext(S('register', 'viewer'), { type: 'select', tool: 'team' }), S('register', 'viewer')));
t('team waits while access is unknown', () => assert.deepEqual(hubNext(S('assessment', 'unknown'), { type: 'select', tool: 'team' }), S('assessment', 'unknown', 'team')));
t('pending team opens when access says editor or local', () => {
  assert.deepEqual(hubNext(S('assessment', 'unknown', 'team'), { type: 'access', access: 'editor' }), S('team', 'editor'));
  assert.deepEqual(hubNext(S('assessment', 'unknown', 'team'), { type: 'access', access: 'local' }), S('team', 'local'));
});
t('pending team is dropped for a viewer', () => assert.deepEqual(hubNext(S('assessment', 'unknown', 'team'), { type: 'access', access: 'viewer' }), S('assessment', 'viewer')));
t('a viewer on the team tab is moved to the assessment', () => assert.deepEqual(hubNext(S('team', 'local'), { type: 'access', access: 'viewer' }), S('assessment', 'viewer')));
t('selecting another tool clears a pending team', () => assert.deepEqual(hubNext(S('assessment', 'unknown', 'team'), { type: 'select', tool: 'register' }), S('register', 'unknown')));
t('access cannot go back to unknown or to a made-up value', () => {
  assert.deepEqual(hubNext(S('register', 'editor'), { type: 'access', access: 'unknown' }), S('register', 'editor'));
  assert.deepEqual(hubNext(S('register', 'editor'), { type: 'access', access: 'admin' }), S('register', 'editor'));
});
t('unknown events and junk leave the state alone and never mutate it', () => {
  const s = S('register', 'local'); Object.freeze(s);
  assert.deepEqual(hubNext(s, { type: 'nope' }), s); assert.deepEqual(hubNext(s, null), s); assert.deepEqual(hubNext(s, 'select'), s);
});
t('no reachable state shows team to a viewer (exhaustive walk)', () => {
  const evs = HUB_TOOLS.map(tool => ({ type: 'select', tool })).concat(['local', 'editor', 'viewer'].map(access => ({ type: 'access', access })));
  const seen = new Set(), todo = [hubInitial()];
  while (todo.length) {
    const s = todo.pop(), k = JSON.stringify(s); if (seen.has(k)) continue; seen.add(k);
    assert.ok(!(s.tool === 'team' && s.access !== 'local' && s.access !== 'editor'), 'team only for local/editor: ' + k);
    assert.ok(!(s.pending && s.access !== 'unknown'), 'pending only while unknown: ' + k);
    for (const e of evs) todo.push(hubNext(s, e));
  }
  assert.ok(seen.size > 10);
});
console.log(n + ' hub machine tests passed');
