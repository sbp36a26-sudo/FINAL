// v2.8.1: the public build's sender (src/collect.js): payload shape (the columns of hosting/apps-script/Code.gs), the opt-out stops
// sending at once, an empty url sends nothing, failures never throw. Also: the public build carries it, the artifact build does not.
// Run: node tools/readiness-2-questions/tests/collect.test.mjs
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { root, load, data, tester, finished } from './load.mjs';
import { buildPage, publicConfig } from '../build.mjs';
const { F, C } = load();
const D = data();
const { ok, done } = tester('collect');
const rd = p => readFileSync(join(root, p), 'utf8');
const ctx = { self: {} }; ctx.globalThis = ctx.self; vm.runInNewContext(rd('src/collect.js'), ctx, { filename: 'collect.js' });
const K = ctx.self.R2Collect;
const URL = 'https://script.google.com/macros/s/test/exec';
const memStore = () => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, m }; };
const rec = finished(F, D, 'hr-1', { id: 'dynTest01' }); rec.Q.q3 = 'u'; rec.A.m2 = 'pl'; rec.A.m3 = 'n';
const x = { step: 'result', version: '2.8.1', verdict: 'almost', score: 81, qIds: F.QIDS, mustIds: F.MUST_IDS, tailIds: D.tq.uses['hr-1'].qs.map(q => q.id), now: '2026-11-26T10:00:00.000Z' };

// ---------- payload ----------
const p = K.payload('result', rec, x);
const COLS = ['check_id', 'event', 'step', 'version', 'at', 'hotel_type', 'role', 'country', 'hotel_name', 'use_case', 'verdict', 'score', 'step2', 'must', 'answers'];
ok(JSON.stringify(Object.keys(p)) === JSON.stringify(COLS), 'payload keys are the sheet columns (received_at is added by the script)');
const gs = rd('../../hosting/apps-script/Code.gs');
ok(COLS.every(c => gs.includes("'" + c + "'")) && gs.includes("'received_at'") && /step_done: true, result: true/.test(gs), 'Code.gs has every column and accepts step_done and result');
ok(p.check_id === 'dynTest01' && p.event === 'result' && p.step === 'result' && p.version === '2.8.1' && p.at === x.now && p.verdict === 'almost' && p.score === 81, 'ids, event, step, version, time, verdict, score');
ok(p.hotel_type === 'independent' && p.role === 'gm' && p.country === 'France' && p.hotel_name === 'Hotel Test' && p.use_case === 'hr-1', 'hotel profile and use case');
ok(p.step2.q1 === 'No' && p.step2.q3 === 'Not sure' && Object.keys(p.step2).length === 5, 'step 2 in words');
ok(p.must.m1 === 'Yes' && p.must.m2 === 'Planned' && p.must.m3 === 'No' && Object.keys(p.must).length === 10, 'must-haves in words');
ok(Object.keys(p.answers).length === x.tailIds.length && Object.values(p.answers).every(v => v === 'Yes'), 'step-5 answers, by question id');
ok(K.payload('step_done', rec, { step: 'must' }).step === '3' && K.payload('step_done', rec, { step: 'hotel' }).step === '1' && K.payload('step_done', rec, { step: 'tailored' }).step === '5', 'step_done carries the step number');
{ const r2 = finished(F, D, 'hr-1', { id: 'dynTest02' }); r2.hotel.name = ''; const q = K.payload('step_done', r2, { step: 'q' }); ok(q.hotel_name === '' && q.score === null && q.verdict === '', 'no hotel name unless typed; no score or verdict before the result'); }
ok(!/ip|agent|cookie/i.test(Object.keys(p).join(' ')) && JSON.stringify(p).length < 5000, 'no IP or browser field; small (' + JSON.stringify(p).length + ' bytes)');

// ---------- sending ----------
function mk(o) {
  const calls = { fetch: [], beacon: [] };
  const c = K.make(Object.assign({ url: URL, storage: memStore(),
    fetch: (u, init) => { calls.fetch.push({ u, init }); return Promise.resolve({}); },
    beacon: (u, b) => { calls.beacon.push({ u, b }); return true; } }, o || {}));
  return { c, calls };
}
{
  const { c, calls } = mk();
  ok(c.send('result', rec, x) === true && calls.fetch.length === 1, 'sends once with fetch');
  const f = calls.fetch[0];
  ok(f.u === URL && f.init.method === 'POST' && f.init.mode === 'no-cors' && f.init.headers['Content-Type'] === 'text/plain' && f.init.credentials === 'omit' && JSON.parse(f.init.body).check_id === 'dynTest01', 'POST, no-cors, text/plain, no cookies, JSON body');
}
{
  const { c, calls } = mk(); c.setOptOut(true);
  ok(c.optedOut() && c.send('result', rec, x) === false && calls.fetch.length === 0 && calls.beacon.length === 0, 'opt-out: nothing is sent');
  c.setOptOut(false); ok(c.send('result', rec, x) === true && calls.fetch.length === 1, 'opt-out taken back: sending again at once');
}
{ const s = memStore(); K.make({ url: URL, storage: s }).setOptOut(true); ok(s.m[K.OPT_KEY] === '1' && K.make({ url: URL, storage: s }).optedOut(), 'the opt-out is remembered per browser (' + K.OPT_KEY + ')'); }
{ const bad = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } }; const c = K.make({ url: URL, storage: bad, fetch: () => Promise.resolve() }); c.setOptOut(true); ok(c.optedOut() && c.send('result', rec, x) === false, 'storage blocked: the opt-out holds in memory'); }
for (const u of ['', '   ', null, 'javascript:alert(1)']) { const { c, calls } = mk({ url: u }); ok(c.send('result', rec, x) === false && calls.fetch.length + calls.beacon.length === 0 && !c.active() === !(u && u.trim() && /^https?:/.test(u.trim())), 'no usable url (' + JSON.stringify(u) + '): nothing is sent'); }
{
  let threw = false, r;
  try {
    const t1 = mk({ fetch: () => { throw new Error('x'); } }); r = t1.c.send('result', rec, x); ok(r === true && t1.calls.beacon.length === 1, 'fetch throws: the beacon is used');
    const t2 = mk({ fetch: () => Promise.reject(new Error('net')) }); t2.c.send('result', rec, x); await new Promise(s => setTimeout(s, 10)); ok(t2.calls.beacon.length === 1, 'fetch fails: the beacon is used');
    const t3 = mk({ fetch: null }); ok(t3.c.send('result', rec, x) === true && t3.calls.beacon.length === 1, 'no fetch: the beacon');
    const t4 = mk({ fetch: () => { throw new Error('x'); }, beacon: () => { throw new Error('y'); } }); ok(t4.c.send('result', rec, x) === false, 'both throw: false, no error');
    const t5 = mk({ fetch: null, beacon: null }); ok(t5.c.send('result', rec, x) === false, 'no way to send: false');
    ok(mk().c.send('result', null, null) === true, 'a missing record is still a small, valid event (no throw)');
    const huge = finished(F, D, 'hr-1', { id: 'dynHuge1' }); huge.T = {}; const big = mk(); ok(big.c.sendRaw({ x: 'y'.repeat(K.MAX_BYTES + 1) }) === false && big.calls.fetch.length === 0, 'over 50 KB: not sent');
  } catch (e) { threw = true; console.log(e); }
  ok(!threw, 'no failure throws');
}

// ---------- the two builds ----------
const pub = buildPage({ pub: true, config: { collectUrl: URL, contact: 'team@example.org' }, builtOn: '2026-11-26' }).html, art = buildPage({ builtOn: '2026-11-26' }).html;
ok(pub.includes('window.R2_PUBLIC = {"collectUrl":"' + URL + '","contact":"team@example.org"}') && pub.includes('root.R2Collect = api'), 'public build: config and the sender');
ok(!art.includes('window.R2_PUBLIC = {') && !art.includes('root.R2Collect = api') && !/script\.google\.com/.test(art), 'artifact build: no config, no sender, no address');
ok(publicConfig({}).collectUrl === '' && publicConfig({ collectUrl: ' ' + URL + ' ' }).collectUrl === URL, 'config: empty and trimmed');
let threw = false; try { publicConfig({ collectUrl: 'http://x' }); } catch (e) { threw = true; } ok(threw, 'config: only an https address');
const cfg = JSON.parse(rd('hosting.config.json'));
ok(typeof cfg.collectUrl === 'string' && typeof cfg.contact === 'string', 'hosting.config.json holds collectUrl and contact');
ok(existsSync(join(root, 'public', 'index.html')) && rd('public/index.html').includes('window.R2_PUBLIC = ' + JSON.stringify(publicConfig(cfg))), 'public/index.html is built from hosting.config.json as it is now');
ok(C.PUB.LONG === 'Kept until 31 January 2027, then removed.' && C.PUB.WHO.includes('EHL SBP Group 36, a student project for HFTP') && C.PUB.CONTACT_NONE === 'Contact: to be added', 'notice: who, how long, contact placeholder');
done();
