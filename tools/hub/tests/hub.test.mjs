// Hub tab machine: every transition and guard. Run: node tools/hub/tests/hub.test.mjs
// The machine lives inline in hub/hub-bar.html between "machine:start" and "machine:end"; this test runs that block as is.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'hub-bar.html'), 'utf8');
const block = src.slice(src.indexOf('/* machine:start'), src.indexOf('/* machine:end */'));
assert.ok(block.length > 100, 'machine block found');
const { hubInitial, hubNext, HUB_TOOLS, HUB_ALIAS, hubTool, hubLinkUrl, HUB_LINK_MAX } = new Function(block + '; return { hubInitial, hubNext, HUB_TOOLS, HUB_ALIAS, hubTool, hubLinkUrl, HUB_LINK_MAX };')();

let n = 0;
function t(name, fn) { fn(); n++; console.log('ok', n, name); }
const S = (tool, access, pending = null) => ({ tool, access, pending });

t('initial state is the assessment, access unknown', () => assert.deepEqual(hubInitial(), S('assessment', 'unknown')));
t('select every ordinary tool in any access state', () => {
  for (const access of ['unknown', 'local', 'editor', 'viewer'])
    for (const tool of HUB_TOOLS.filter(x => x !== 'team')) assert.deepEqual(hubNext(S('assessment', access), { type: 'select', tool }), S(tool, access));
});
t('unknown tool names are ignored (old sessionStorage, typos, frames)', () => {
  for (const tool of ['readiness', '', undefined, 'TEAM', '../x', 'constructor', '__proto__']) assert.deepEqual(hubNext(S('register', 'local'), { type: 'select', tool }), S('register', 'local'));
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
// 24 Nov 2026 (owner): "Do you need AI?" (tool id readiness-2) replaces the Readiness check tab. The old tool name is an alias.
// Changed expectations, each because the tab was removed on purpose: readiness-check is no longer in HUB_TOOLS or the nav;
// the Readiness check tooltip test is gone with its button; the Do you need AI? tooltip has new words.
t('readiness-2 is a hub tool; the Readiness check tab is gone; the other tools keep their order', () => {
  assert.deepEqual(HUB_TOOLS, ['assessment', 'use-case-catalogue', 'readiness-2', 'ai-act-guide', 'register', 'team']);
  assert.ok(!HUB_TOOLS.includes('readiness-check'));
});
t('readiness-2 can be selected in every access state, and leaving it works', () => {
  for (const access of ['unknown', 'local', 'editor', 'viewer']) {
    assert.deepEqual(hubNext(S('assessment', access), { type: 'select', tool: 'readiness-2' }), S('readiness-2', access));
    assert.deepEqual(hubNext(S('readiness-2', access), { type: 'select', tool: 'register' }), S('register', access));
  }
});
t('old name: selecting readiness-check (an old link, Back/forward entry or stored tab) lands on readiness-2', () => {
  assert.deepEqual(HUB_ALIAS, { 'readiness-check': 'readiness-2' });
  assert.equal(hubTool('readiness-check'), 'readiness-2'); assert.equal(hubTool('register'), 'register'); assert.equal(hubTool(undefined), undefined); assert.equal(hubTool('constructor'), 'constructor');
  for (const access of ['unknown', 'local', 'editor', 'viewer'])
    for (const from of HUB_TOOLS.filter(x => x !== 'team')) assert.deepEqual(hubNext(S(from, access), { type: 'select', tool: 'readiness-check' }), S('readiness-2', access));
  assert.deepEqual(hubNext(S('assessment', 'unknown', 'team'), { type: 'select', tool: 'readiness-check' }), S('readiness-2', 'unknown'));
});
t('the bar has one button per hub tool, in machine order; Do you need AI? has its tooltip; no Readiness check button', () => {
  const nav = src.slice(src.indexOf('<nav'), src.indexOf('</nav>'));
  assert.match(nav, /data-tool="readiness-2"[^>]*title="Is AI the answer, and is your hotel ready for it\?"[^>]*>Do you need AI\?</);
  assert.ok(!/Readiness 2\.0|AI starting point/.test(nav), 'no old name is shown');
  assert.ok(!/data-tool="readiness-check"/.test(nav) && !/>Readiness check</.test(nav), 'the Readiness check tab is removed');
  const btns = [...nav.matchAll(/data-tool="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(btns, HUB_TOOLS, 'one button per hub tool, in machine order');
  assert.match(nav, /data-tool="team" class="team"[^>]*hidden[^>]*>Team: readiness results</, 'the red team tab is still there, hidden until access is known');
});
t('open messages for readiness-check are routed to readiness-2 with the hash kept (old #use=<id> links)', () => {
  const body = src.slice(src.indexOf("if (m.hub === 'open')"), src.indexOf("if (m.hub === 'ping')"));
  assert.match(body, /if \(!OPENABLE\[m\.tool\]\) return;/);
  assert.match(body, /var to = hubTool\(m\.tool\);/);
  assert.match(body, /var path = srcOf\(to\) \+ \(hash \? '#' \+ hash : ''\);/);
  assert.match(body, /send\(\{ type: 'select', tool: to \}, \{ push: true \}\);/);
  assert.ok(!/frames\[m\.tool\]|nextSrc\[m\.tool\]|srcOf\(m\.tool\)/.test(body), 'nothing in the open handler still uses the unresolved name');
  /* the same steps, run: what the handler computes for the AI Register's message */
  const srcOf = new Function('SRC', 'return function (tool) { return SRC[tool] || (tool + "/index.html"); }')(new Function('return ' + src.match(/var SRC = (\{[^}]*\});/)[1])());
  const clean = h => h.replace(/[^\w=&%.\-]/g, '');
  const route = m => srcOf(hubTool(m.tool)) + (m.hash ? '#' + clean(m.hash) : '');
  assert.equal(route({ hub: 'open', tool: 'readiness-check', hash: 'use=hr-2' }), 'readiness-2/index.html#use=hr-2');
  assert.equal(route({ hub: 'open', tool: 'readiness-check' }), 'readiness-2/index.html');
  assert.equal(route({ hub: 'open', tool: 'readiness-2', hash: 'use=gx-2' }), 'readiness-2/index.html#use=gx-2');
  assert.equal(route({ hub: 'open', tool: 'register', hash: 'add=gx-2&name=AI%20chat' }), 'register/index.html#add=gx-2&name=AI%20chat');
  assert.equal(srcOf('team'), 'readiness-check/team.html', 'the team page stays where it is');
});
t('a stored or historic readiness-check tab starts on readiness-2', () => {
  assert.match(src, /start = hubTool\(start\);\s*\n\s*if \(HUB_TOOLS\.indexOf\(start\) < 0\) start = 'assessment';/);
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
// ---------- link bridge (24 Nov 2026): { hub: 'link', url } ----------
t('link: plain http and https links pass, normalised', () => {
  assert.equal(hubLinkUrl('https://ideas.com/science-behind-g3-rms/'), 'https://ideas.com/science-behind-g3-rms/');
  assert.equal(hubLinkUrl('http://data.europa.eu/eli/reg/2024/1689/oj'), 'http://data.europa.eu/eli/reg/2024/1689/oj');
  assert.equal(hubLinkUrl('HTTPS://Example.COM/a?b=1#c'), 'https://example.com/a?b=1#c');
  assert.equal(hubLinkUrl('https://doi.org/10.1016/j.annals.2026.104274'), 'https://doi.org/10.1016/j.annals.2026.104274');
});
t('link: other schemes are refused (javascript, data, file, blob, mailto, relative, protocol-relative)', () => {
  for (const u of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,<b>x</b>', 'file:///etc/passwd', 'blob:https://x.com/1', 'mailto:a@b.c', 'ftp://x.com/',
    '/register/index.html', '../readiness-check/index.html', '//evil.example/x', 'https:/x.com', 'https://', 'about:blank', 'chrome://settings']) assert.equal(hubLinkUrl(u), null, u);
});
t('link: non-strings, empty, too long, spaces and control characters, user names are refused', () => {
  for (const u of [undefined, null, 1, {}, [], ['https://x.com'], { href: 'https://x.com' }, '', ' https://x.com', 'https://x.com/a b', 'https://x.com/\n', 'https://x.com/\t', 'https://x.com/\u0000',
    'https://user:pw@x.com/', 'https://user@x.com/']) assert.equal(hubLinkUrl(u), null, JSON.stringify(u));
  assert.equal(HUB_LINK_MAX, 2048);
  const base = 'https://x.com/'; assert.ok(hubLinkUrl(base + 'a'.repeat(HUB_LINK_MAX - base.length)), 'exactly at the limit passes');
  assert.equal(hubLinkUrl(base + 'a'.repeat(HUB_LINK_MAX - base.length + 1)), null, 'one over the limit is refused');
});
t('link: the hub handles it only from its own frames, opens it from the top page, and sends no reply', () => {
  const body = src.slice(src.indexOf("addEventListener('message'"), src.indexOf('// The bar'));
  assert.ok(body.indexOf("if (!own) return;") < body.indexOf("m.hub === 'link'"), 'own-frame check first');
  assert.match(body, /if \(m\.hub === 'link'\) \{ var url = hubLinkUrl\(m\.url\); if \(url\) openTop\(url\); return; \}/);
  const open = src.slice(src.indexOf('function openTop'), src.indexOf("addEventListener('message'"));
  assert.match(open, /createElement\('a'\)/); assert.match(open, /a\.target = '_blank'/); assert.match(open, /noopener/); assert.match(open, /a\.click\(\)/); assert.match(open, /window\.open\(url, '_blank', 'noopener'\)/);
  assert.ok(!/postMessage/.test(open), 'no reply message');
});
t('link: the other bridge messages are unchanged', () => {
  for (const h of ["m.hub === 'db'", "m.hub === 'open'", "m.hub === 'ping'", "m.hub === 'download'"]) assert.ok(src.includes(h), h);
});
console.log(n + ' hub machine tests passed');
