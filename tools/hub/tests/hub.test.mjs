// Hub tab machine: every transition and guard. Run: node tools/hub/tests/hub.test.mjs
// The machine lives inline in hub/hub-bar.html between "machine:start" and "machine:end"; this test runs that block as is.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'hub-bar.html'), 'utf8');
const block = src.slice(src.indexOf('/* machine:start'), src.indexOf('/* machine:end */'));
assert.ok(block.length > 100, 'machine block found');
const { hubInitial, hubNext, HUB_TOOLS, HUB_ALIAS, hubTool, hubSrc, hubUrl, hubDetail, HUB_DETAIL } = new Function(block + '; return { hubInitial, hubNext, HUB_TOOLS, HUB_ALIAS, hubTool, hubSrc, hubUrl, hubDetail, HUB_DETAIL };')();
import { createHash } from 'node:crypto';

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
  // v2.6: srcOf is hubSrc(tool, SRC, HUB_VER); with no hashes it is the plain page (changed expectation: the hash part is tested below)
  const SRC = new Function('return ' + src.match(/var SRC = (\{[^}]*\});/)[1])();
  assert.match(src, /function srcOf\(tool\) \{ return hubSrc\(tool, SRC, HUB_VER\); \}/);
  const srcOf = tool => hubSrc(tool, SRC, {});
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
// ---------- v2.6 (24 Nov 2026): the link bridge is gone (changed expectation: its five tests are replaced by these) ----------
t('link: no link message, no link panel, no openTop, no hubLinkUrl', () => {
  assert.ok(!/'link'|hubLinkUrl|HUB_LINK_MAX|openTop|hub-link|\.hub-link/.test(src));
  for (const h of ["m.hub === 'db'", "m.hub === 'open'", "m.hub === 'ping'", "m.hub === 'download'", "m.hub === 'detail'", "m.hub === 'detail-close'"]) assert.ok(src.includes(h), h);
});
// ---------- v2.6: cache-busting ----------
t('hubSrc: the page with ?v=<hash>; the team page; no hash or a bad one gives the plain page', () => {
  const SRC = { team: 'readiness-check/team.html' }, VER = { 'readiness-2': 'abc123def0', team: '0123456789', register: 'NOT-HEX!', 'ai-act-guide': '' };
  assert.equal(hubSrc('readiness-2', SRC, VER), 'readiness-2/index.html?v=abc123def0');
  assert.equal(hubSrc('team', SRC, VER), 'readiness-check/team.html?v=0123456789');
  assert.equal(hubSrc('register', SRC, VER), 'register/index.html');
  assert.equal(hubSrc('ai-act-guide', SRC, VER), 'ai-act-guide/index.html');
  assert.equal(hubSrc('use-case-catalogue', SRC, VER), 'use-case-catalogue/index.html');
  assert.equal(hubSrc('constructor', SRC, VER), 'constructor/index.html');
  const clean = h => h.replace(/[^\w=&%.\-]/g, '');
  assert.equal(hubSrc('readiness-2', SRC, VER) + '#' + clean('use=gx-2'), 'readiness-2/index.html?v=abc123def0#use=gx-2', '#use= still works after the version');
  assert.equal(new URL(hubSrc('readiness-2', SRC, VER) + '#use=gx-2', 'https://x.test/tools/').hash, '#use=gx-2');
});
t('build-hub writes the current content hash of every frame page into the built hub', () => {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..'), built = readFileSync(join(root, 'index.html'), 'utf8');
  assert.ok(src.includes('var HUB_VER = {} /*__HUB_VER__*/;'), 'the source keeps the marker');
  const m = built.match(/var HUB_VER = (\{[^}]*\}) \/\* written by build-hub\.mjs \*\//); assert.ok(m, 'the built hub carries HUB_VER');
  const VER = JSON.parse(m[1]);
  const pages = { 'use-case-catalogue': 'use-case-catalogue/index.html', 'readiness-2': 'readiness-2/index.html', 'ai-act-guide': 'ai-act-guide/index.html', register: 'register/index.html', team: 'readiness-check/team.html' };
  for (const [tool, page] of Object.entries(pages)) assert.equal(VER[tool], createHash('sha256').update(readFileSync(join(root, page))).digest('hex').slice(0, 10), tool + ': hash of the current page (rebuild the hub after a tool)');
  assert.deepEqual(Object.keys(VER).sort(), Object.keys(pages).sort());
});
// ---------- v2.6: the detail layer drawn on the main page ----------
const good = () => ({ title: 'AI chat assistant for guests', kicker: 'Guest experience · Guest-facing', catName: 'Catalogue name: AI chat', draft: '', draftText: '', does: 'Answers guests.', how: 'A language model.', level: 'How common in hotels: High.', task: 'Research wording.', foot: 'From the catalogue.',
  srcs: [{ type: 'c', name: 'Vendor', note: 'n', url: 'https://a.com/x' }, { type: 'h', name: 'Hotel', note: '', url: '' }, { type: 'r', name: 'Study', note: 'p. 3', url: 'http://b.org/' }, { type: 'l', name: 'A link', note: '', url: 'HTTPS://C.com/a?b=1#c' }] });
t('detail: a well-formed layer passes, copied, URLs normalised', () => {
  const d = good(), x = hubDetail('gx-2', d);
  assert.ok(x && x.id === 'gx-2' && x.title === d.title && x.srcs.length === 4);
  assert.equal(x.srcs[3].url, 'https://c.com/a?b=1#c'); assert.equal(x.srcs[1].url, '');
  assert.notEqual(x.srcs, d.srcs, 'a copy, not the message object');
  assert.ok(hubDetail('gx-2', Object.assign(good(), { srcs: [] })), 'no sources is fine');
});
t('detail: bad ids and non-objects are refused', () => {
  for (const id of [undefined, null, 1, '', 'a b', '../x', '<x>', 'x'.repeat(41), {}]) assert.equal(hubDetail(id, good()), null, JSON.stringify(id));
  for (const d of [undefined, null, 'x', 1, [], [good()], new Date(), Object.create(null)]) assert.equal(hubDetail('gx-2', d), null, Object.prototype.toString.call(d));
});
t('detail: wrong types, missing or extra keys are refused', () => {
  for (const k of ['title', 'kicker', 'catName', 'draft', 'draftText', 'does', 'how', 'level', 'task', 'foot']) {
    for (const v of [1, null, undefined, {}, [], true]) { const d = good(); d[k] = v; assert.equal(hubDetail('gx-2', d), null, k + '=' + JSON.stringify(v)); }
    const d2 = good(); delete d2[k]; assert.equal(hubDetail('gx-2', d2), null, 'missing ' + k);
  }
  assert.equal(hubDetail('gx-2', Object.assign(good(), { html: '<b>x</b>' })), null, 'an extra key');
  assert.equal(hubDetail('gx-2', Object.assign(good(), { title: '' })), null, 'an empty title');
  for (const srcs of [null, 'x', {}, [null], ['x'], [{ type: 'c', name: 'a', note: '' }], [{ type: 'c', name: 'a', note: '', url: '', x: 1 }], [{ type: 'z', name: 'a', note: '', url: '' }], [{ type: 'c', name: '', note: '', url: '' }], [{ type: 'c', name: 1, note: '', url: '' }], [{ type: 'c', name: 'a', note: 2, url: '' }]])
    assert.equal(hubDetail('gx-2', Object.assign(good(), { srcs })), null, JSON.stringify(srcs));
});
t('detail: oversized data is refused (every limit, and one under it passes)', () => {
  for (const k of ['title', 'kicker', 'catName', 'draft', 'draftText', 'does', 'how', 'level', 'task', 'foot']) {
    assert.ok(hubDetail('gx-2', Object.assign(good(), { [k]: 'a'.repeat(HUB_DETAIL[k]) })), k + ' at the limit');
    assert.equal(hubDetail('gx-2', Object.assign(good(), { [k]: 'a'.repeat(HUB_DETAIL[k] + 1) })), null, k + ' over the limit');
  }
  const one = { type: 'c', name: 'a', note: '', url: '' };
  assert.ok(hubDetail('gx-2', Object.assign(good(), { srcs: Array(HUB_DETAIL.srcs).fill(one) })));
  assert.equal(hubDetail('gx-2', Object.assign(good(), { srcs: Array(HUB_DETAIL.srcs + 1).fill(one) })), null, 'too many sources');
  assert.equal(hubDetail('gx-2', Object.assign(good(), { srcs: [Object.assign({}, one, { name: 'a'.repeat(HUB_DETAIL.name + 1) })] })), null, 'long name');
  assert.equal(hubDetail('gx-2', Object.assign(good(), { srcs: [Object.assign({}, one, { note: 'a'.repeat(HUB_DETAIL.note + 1) })] })), null, 'long note');
  const base = 'https://x.com/'; assert.ok(hubUrl(base + 'a'.repeat(HUB_DETAIL.url - base.length))); assert.equal(hubUrl(base + 'a'.repeat(HUB_DETAIL.url - base.length + 1)), null);
});
t('detail: bad URLs are refused (schemes, relative, spaces, control characters, user names)', () => {
  for (const u of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,<b>x</b>', 'file:///etc/passwd', 'blob:https://x.com/1', 'mailto:a@b.c', 'ftp://x.com/', '/register/index.html', '../x', '//evil.example/x', 'https:/x.com', 'https://',
    'about:blank', ' https://x.com', 'https://x.com/a b', 'https://x.com/\n', 'https://x.com/\t', 'https://x.com/\u0000', 'https://user:pw@x.com/', 'https://user@x.com/', 1, null, undefined, {}]) {
    assert.equal(hubUrl(u), null, JSON.stringify(u));
    assert.equal(hubDetail('gx-2', Object.assign(good(), { srcs: [{ type: 'c', name: 'a', note: '', url: u }] })), null, 'in a source: ' + JSON.stringify(u));
  }
});
t('detail: only from the hub\'s own frame on screen; drawn without innerHTML; closes on another tab', () => {
  const body = src.slice(src.indexOf("addEventListener('message'"), src.indexOf('// The bar'));
  assert.ok(body.indexOf('if (!own) return;') < body.indexOf("m.hub === 'detail'"), 'own-frame check first');
  assert.match(body, /var x = hubDetail\(m\.id, m\.data\)/); assert.match(body, /if \(x && tool === S\.tool\) openHubDetail\(x, e\.source, tool\)/);
  const draw = src.slice(src.indexOf('var detail = {'), src.indexOf("addEventListener('message'"));
  assert.ok(!/innerHTML|insertAdjacentHTML|outerHTML|document\.write/.test(draw), 'textContent and createElement only');
  assert.match(draw, /name\.target = '_blank'; name\.rel = 'noopener noreferrer'/); assert.match(draw, /showModal\(\)/);
  assert.match(draw, /hub: 'detail-closed', id: id, focus: !!focus/);
  assert.match(src, /if \(detail\.open && tool !== detail\.tool\) closeHubDetail\(false\);/);
});
console.log(n + ' hub machine tests passed');
