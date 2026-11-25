// "Do you need AI?" v2.6.1 (24 Nov 2026): clean-up inventory v4 (reports/audit-readiness-2/cleanup_inventory_v4.md).
// Every check here failed on v2.6 (commit eebd0d9) and passes after the fix; the browser half is tests/browser/v261.cjs.
//  B4  a store written by an older page still open in another tab (version 2, records without qv) is merged without turning
//      question 1 round a second time on the checks this tab holds (F.mergeTabs(mine, theirs, { older })); migrate says older.
//  G1  guard: every use case's detail layer passes the hub's own check (hubDetail), so "Details and sources" never sends a
//      message the hub refuses (the frame would keep a layer nobody draws).
//  D1–D6  stale docs and comments, and the dead flag the register kept from the removed link bridge.
// Run: node tools/readiness-2/tests/v261.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, envOf, tester, root } from './load.mjs';
const { L, F } = load();
const D = data(), TQ = D.tq, ENV = envOf(D, F);
const { ok, done } = tester('v261');
const rd = p => readFileSync(join(root, p), 'utf8');
const clone = o => JSON.parse(JSON.stringify(o));

// ---------- B4: an older page writes the store in another tab ----------
{
  const FX = JSON.parse(rd('tests/fixtures/v2.5-saved.json'));
  const info0 = {}; F.migrate(clone(FX.store), ENV, info0);
  ok(info0.older === true && !info0.newer, 'B4: migrate marks a version 2 store as written by an older page');
  const i3 = {}; F.migrate({ v: 4, cur: '', checks: {} }, ENV, i3); ok(!i3.older && !i3.newer, 'B4: a version 4 store (v2.7.0) is neither older nor newer');
  const i4 = {}; F.migrate({ v: 5, cur: '', checks: {} }, ENV, i4); ok(i4.newer === true && !i4.older, 'B3: a version 5 store is newer');
  // this tab: two checks in the v2.6 meaning (fixgo0001 answered again, open: fixstop01)
  const mine = F.migrate(clone(FX.store), ENV, {}); mine.cur = 'fixstop01';
  mine.checks.fixgo0001.Q = { q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }; mine.checks.fixgo0001.Qnew = [];
  // the older tab writes it back: version 2, no qv, no Qnew, plus a check it made itself (old meaning: Q1 Yes = goes on)
  const raw = clone(mine); raw.v = 2; Object.values(raw.checks).forEach(c => { delete c.qv; delete c.Qnew; });
  raw.checks.oldtab0001 = { id: 'oldtab0001', step: 'q', hotel: { type: 'independent' }, Q: { q1: 'y', q2: 'y', q3: 'n' }, A: {}, updated: '2026-11-24T10:00:00Z' };
  const info = {}, theirs = F.migrate(raw, ENV, info);
  ok(theirs.checks.fixgo0001.Q.q1 === 'y', 'B4 (the fault): read on its own, the older page\'s copy of fixgo0001 is turned round again');
  const m = F.mergeTabs(mine, theirs, { older: info.older });
  ok(m.store.checks.fixgo0001.Q.q1 === 'n' && m.store.checks.fixgo0001.Q.q3 === 'y' && m.store.checks.fixgo0001.Q.q4 === 'y', 'B4: merged, this tab keeps its own fixgo0001 (Q1 No, Q3 and Q4 kept)');
  ok(m.store.checks.fixstop01.Q.q1 === mine.checks.fixstop01.Q.q1 && m.store.cur === 'fixstop01' && m.elsewhere === null, 'B4: the open check stays this tab\'s; no "changed elsewhere" line for a stripped copy');
  ok(m.store.checks.oldtab0001 && m.store.checks.oldtab0001.Q.q1 === 'n' && !m.store.checks.oldtab0001.Q.q3 && m.store.checks.oldtab0001.qv === 2, 'B4: a check only the older page knows is taken, read once in the old meaning');
  ok(Object.keys(mine.checks).every(k => m.store.checks[k]), 'B4: no check of this tab is lost');
  // without the flag (two v2.6 tabs) the merge is unchanged
  const m2 = F.mergeTabs(mine, F.migrate(clone(mine), ENV, {}));
  ok(m2.store.checks.fixgo0001.Q.q1 === 'n', 'B4: two current tabs merge as before');
}
// ---------- B3 / B1 / B4 in the page (the browser test drives them; here: the code paths exist) ----------
{
  const app = rd('src/app.js');
  ok(/if \(x\.info\.newer\) storage = 'newer';/.test(app.slice(app.indexOf('function follow'))), 'B3: follow() stops writing once another tab saved a newer store');
  ok(/F\.mergeTabs\(store, x\.store, \{ older: !!x\.info\.older \}\)/.test(app), 'B4: follow() passes "older" to the merge');
  ok(/if \(hubDrawn && !fromHub\) hubPost\(\{ hub: 'detail-close' \}\)/.test(app), 'B1: dropping a layer the hub drew tells the hub, unless the hub closed it');
  ok(/closeDetail\(false, m\.focus === false, true\)/.test(app), 'B1: the hub\'s own close is not echoed back');
  const hub = readFileSync(join(root, '../hub/hub-bar.html'), 'utf8');
  ok(/if \(m\.hub === 'ping' && detail\.open && detail\.win === e\.source\) closeHubDetail\(true, true\);/.test(hub), 'B2: the hub closes its layer when the page under it pings again (a reload)');
}
// ---------- G1: every use case's layer passes the hub's check ----------
{
  const src = readFileSync(join(root, '../hub/hub-bar.html'), 'utf8');
  const block = src.slice(src.indexOf('/* machine:start'), src.indexOf('/* machine:end */'));
  const { hubDetail } = new Function(block + '; return { hubDetail };')();
  const bad = [];
  for (const d of D.cat.depts) for (const u of d.uses) { const x = L.detailData(D, Object.assign({ dept: d }, u), d, TQ); if (!hubDetail(u.id, clone(x))) bad.push(u.id); }
  ok(bad.length === 0 && D.cat.depts.reduce((n, d) => n + d.uses.length, 0) === 99, 'G1: all 99 use cases pass the hub\'s check (' + bad.join(', ') + ')');
}
// ---------- D: docs, comments and dead code ----------
{
  const readme = rd('README.md'), app = rd('src/app.js'), logic = rd('src/logic.js'), cleanup = rd('CLEANUP.md');
  const contracts = readFileSync(join(root, '../hub/CONTRACTS.md'), 'utf8');
  ok(!/Q4_NO_HOLDS_TOP: false|Use it as an assistant only|assistant-only condition after/.test(readme), 'D1: README: no assistant-only rule left (gone in v2.6)');
  ok(/Save as file \/ Open a saved file\*\*: `\{ kind: 'hftp-do-you-need-ai', v: 3,/.test(readme), 'D1: README: files are version 3');
  ok(!/line under must-have 3 or 7/.test(readme), 'D1: README: no must-have 7 line');
  ok(!/hub link bridge/.test(readme), 'D1: README: no link bridge in the test list');
  ok(!/\(`ping`, `download`, `db`, `open`, `link`\)/.test(contracts) && !/`link` since v2\.5\.1\)|\(`ping`, `link`, 24 Nov 2026\)|register \(`link` too\)/.test(contracts), 'D2: CONTRACTS: the bridge row lists no link message');
  ok(/detail-close/.test(contracts.slice(contracts.indexOf('| postMessage bridge'), contracts.indexOf('| Hub tabs'))), 'D2: CONTRACTS: the bridge row lists the detail messages');
  ok(/localStorage\['hftp-readiness2q-v1'\], version 3\)/.test(app) && !/only then do links become hub messages/.test(app) && !/Q1 No always goes on to the stop screen/.test(app) && !/\{ kind: 'hftp-do-you-need-ai', v: 2,/.test(app), 'D3: app.js comments: store version 3, no link bridge, Q1 Yes stops, file version 3');
  ok(!/\{ m3\?, m7\? \}/.test(logic), 'D4: logic.js: consistLines returns m3 only');
  ok(/## v2\.6\.1/.test(cleanup) && /`\{ v: 3, cur, checks, notice \}`/.test(cleanup), 'D5: CLEANUP.md: v2.6.1 section, store version 3');
  const reg = readFileSync(join(root, '../register/src/app.js'), 'utf8');
  ok(!/host\.hub\b|hub: false, waiters/.test(reg), 'D6: register: no dead "hub answered the ping" flag left from the link bridge');
  ok(!/the link goes through the hub \(\{ hub: 'link', url \}\)/.test(rd('tests/v251.test.mjs')), 'D6: v251 test header no longer describes the link bridge');
}
done();
