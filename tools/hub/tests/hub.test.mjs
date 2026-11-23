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
// Readiness 2.0 (23 Nov 2026): a new tab before the Readiness check; nothing existing changes.
t('readiness-2 is a hub tool, placed just before readiness-check; the old tools keep their order', () => {
  assert.ok(HUB_TOOLS.includes('readiness-2'));
  assert.equal(HUB_TOOLS.indexOf('readiness-2') + 1, HUB_TOOLS.indexOf('readiness-check'));
  assert.deepEqual(HUB_TOOLS.filter(x => x !== 'readiness-2'), ['assessment', 'use-case-catalogue', 'readiness-check', 'ai-act-guide', 'register', 'team']);
});
t('readiness-2 can be selected in every access state, and leaving it works', () => {
  for (const access of ['unknown', 'local', 'editor', 'viewer']) {
    assert.deepEqual(hubNext(S('assessment', access), { type: 'select', tool: 'readiness-2' }), S('readiness-2', access));
    assert.deepEqual(hubNext(S('readiness-2', access), { type: 'select', tool: 'readiness-check' }), S('readiness-check', access));
  }
});
t('the bar has the Readiness 2.0 button before the Readiness check button, with its tooltip', () => {
  const nav = src.slice(src.indexOf('<nav'), src.indexOf('</nav>'));
  const i2 = nav.indexOf('data-tool="readiness-2"'), ic = nav.indexOf('data-tool="readiness-check"');
  assert.ok(i2 > 0 && ic > i2, 'button order');
  assert.match(nav, /data-tool="readiness-2"[^>]*title="Start here: is AI the answer, and where\?"[^>]*>Readiness 2\.0</);
  const btns = [...nav.matchAll(/data-tool="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(btns, HUB_TOOLS, 'one button per hub tool, in machine order');
});
t('open messages: the old targets stay openable; readiness-2 and use-case-catalogue are added; others are not', () => {
  const m = src.match(/var OPENABLE = (\{[^}]*\});/); assert.ok(m, 'OPENABLE found');
  const OPENABLE = new Function('return ' + m[1])();
  for (const k of ['readiness-check', 'register', 'ai-act-guide', 'readiness-2', 'use-case-catalogue']) assert.ok(OPENABLE[k], k);
  for (const k of ['assessment', 'team', 'nope']) assert.ok(!OPENABLE[k], k);
});
t('the hash filter still keeps use=<id> and a bare department id', () => {
  const clean = h => h.replace(/[^\w=&%.\-]/g, '');
  assert.match(src, /m\.hash\.replace\(\/\[\^\\w=&%\.\\-\]\/g, ''\)/);
  assert.equal(clean('use=fo-3'), 'use=fo-3'); assert.equal(clean('fo'), 'fo'); assert.equal(clean('use=fo-3"><x'), 'use=fo-3x');
});
console.log(n + ' hub machine tests passed');
