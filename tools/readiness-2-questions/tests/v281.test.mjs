// v2.8.1: unit proofs for cleanup inventory v28 (reports/audit-readiness-2-questions/cleanup_inventory_v28.md) and the council's
// BUILD NOW items (reports/Council - Do you need AI v2.8.md, section a) that live in the pure modules. The page-level fixes are
// proven in tests/browser/v281.cjs. Run: node tools/readiness-2-questions/tests/v281.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, data, envOf, tester, finished } from './load.mjs';
const { C, L, F, P } = load();
const D = data(), TQ = D.tq, env = envOf(D, F);
const { ok, done } = tester('v281');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const app = rd('src/app.js');
const one = r => ({ v: F.V, cur: r.id, checks: { [r.id]: r } });

// ---------- M1: "A different hotel" is never filled from the shared profile ----------
{
  const a = finished(F, D, 'hr-1', { id: 'm1a01' }); a.hotel.name = 'Alpha Hotel';
  const n = F.reduce(one(a), 'new', { same: false }, env), r = F.cur(n.store);
  ok(n.ok && r.noProfile === true && r.hotel.name === '' && r.hotel.type === '', 'M1: new {same:false} starts blank and carries noProfile');
  ok(!F.reduce(n.store, 'profile', { name: 'Alpha Hotel', type: 'independent' }, env).ok, 'M1: reduce(profile) is refused for that check');
  const begun = F.reduce(n.store, 'begin', null, env).store, typed = F.reduce(begun, 'hotel', { k: 'type', v: 'group' }, env).store;
  ok(F.cur(typed).noProfile === true && !F.reduce(typed, 'profile', { name: 'Alpha Hotel' }, env).ok, 'M1: a type chosen later does not let the old name back');
  ok(F.cleanRec(JSON.parse(JSON.stringify(F.cur(typed))), env, {}).noProfile === true && F.forFile(F.cur(typed)).noProfile === true, 'M1: kept through a reload (cleanRec) and in a file');
  const same = F.cur(F.reduce(one(a), 'new', { same: true }, env).store);
  ok(!('noProfile' in same) && same.hotel.name === 'Alpha Hotel', 'M1: "Same hotel" carries the hotel and no flag');
  ok(F.reduce(F.blankStore(), 'profile', { name: 'X', type: 'group' }, env).ok, 'M1: a plain new check still takes the profile');
}
// ---------- L6: only answer changes date a check ----------
{
  const r = finished(F, D, 'fo-1', { id: 'l6a01', updated: '2026-11-02T09:00:00.000Z', step: 'q' });
  const s = one(r), e2 = Object.assign({}, env, { now: '2026-11-26T10:00:00.000Z' });
  ok(F.cur(F.reduce(s, 'answer', { id: 'q2', value: 'u' }, e2).store).updated === '2026-11-26T10:00:00.000Z', 'L6: an answer dates the check');
  ok(F.cur(F.reduce(s, 'next', null, e2).store).updated === '2026-11-02T09:00:00.000Z', 'L6: a step change does not');
  const two = { v: F.V, cur: 'l6b01', checks: { l6a01: r, l6b01: finished(F, D, 'hk-1', { id: 'l6b01' }) } };
  ok(F.reduce(two, 'open', 'l6a01', e2).store.checks.l6a01.updated === '2026-11-02T09:00:00.000Z', 'L6: Open does not');
  ok(!/s\.checks\[s\.cur\]\.updated = new Date/.test(app) && /function save\(\) \{[\s\S]{0,200}JSON\.stringify\(store\)/.test(app), 'L6: save() writes the store as it is');
}
// ---------- STORAGE machine (M2, L3) ----------
ok(F.storageStart(false, false, false) === 'ok' && F.storageStart(true, false, false) === 'blocked' && F.storageStart(true, true, false) === 'ok' && F.storageStart(false, true, true) === 'newer', 'L3: start state: blocked only without any store; newer wins');
ok(F.storageNext('ok', 'failed') === 'blocked' && F.storageNext('blocked', 'saved') === 'ok' && F.storageNext('ok', 'newer') === 'newer' && F.storageNext('newer', 'saved') === 'newer' && F.storageNext('newer', 'failed') === 'newer', 'M2: never ok over newer');
ok((app.match(/\bstorage = (?!F\.storage)/g) || []).length === 2 && /storage = to;/.test(app), 'STORAGE: written in one place (storageEv), besides its declaration and start');
// ---------- M3: read-merge-write on window.storage ----------
{
  const A = finished(F, D, 'hr-1', { id: 'tabA01' }), B = finished(F, D, 'fo-1', { id: 'tabB01' }), X = finished(F, D, 'hk-1', { id: 'tabX01' });
  const mine = { v: F.V, cur: 'tabA01', checks: { tabA01: A } };
  let m = F.mergeWS(mine, { v: F.V, cur: 'tabB01', checks: { tabB01: B } }, F.baseOf(mine));
  ok(m.changed && eq(Object.keys(m.store.checks).sort(), ['tabA01', 'tabB01']) && m.store.cur === 'tabA01', 'M3: a check another tab added is taken');
  const mine2 = { v: F.V, cur: 'tabA01', checks: { tabA01: A, tabX01: X } }, base2 = F.baseOf(mine2);
  const mineRm = { v: F.V, cur: 'tabA01', checks: { tabA01: A } };
  m = F.mergeWS(mineRm, { v: F.V, cur: 'tabA01', checks: { tabA01: A, tabX01: X } }, base2);
  ok(!m.store.checks.tabX01, 'M3: a check this tab removed is not taken back');
  m = F.mergeWS(mine2, { v: F.V, cur: 'tabA01', checks: { tabA01: A } }, base2);
  ok(!m.store.checks.tabX01 && m.changed, 'M3: a check another tab removed goes');
  const X2 = JSON.parse(JSON.stringify(X)); X2.Q.q2 = 'u';
  m = F.mergeWS(mine2, { v: F.V, cur: 'tabA01', checks: { tabA01: A, tabX01: X2 } }, base2);
  ok(m.store.checks.tabX01.Q.q2 === 'u', 'M3: a check another tab changed is taken');
  const A2 = JSON.parse(JSON.stringify(A)); A2.Q.q2 = 'n';
  ok(F.mergeWS(mine2, { v: F.V, cur: 'tabA01', checks: { tabA01: A2, tabX01: X } }, base2).store.checks.tabA01.Q.q2 === 'y', 'M3: the open check stays this tab\'s');
  ok(eq(Object.keys(F.mergeWS(mine, { v: F.V, cur: 'tabB01', checks: { tabB01: B } }, null).store.checks).sort(), ['tabA01', 'tabB01']), 'M3: no base yet: nothing dropped, others taken');
}
// ---------- H1, L1, L2: downloads ----------
ok(eq(Object.keys(F.DL), ['idle', 'making', 'saving']) && F.dlNext('saving', 'timeout') === 'idle', 'H1: a timeout event ends a save');
ok(/var r = dl\.save\(\{ filename: name, data: blob \}\); if \(!r \|\| typeof r\.then !== 'function'\) throw/.test(app) && /\.then\(null, function \(\) \{ blocked\(\); \}\);/.test(app), 'H1: save() that throws or gives no promise ends in blocked()');
ok(/if \(ev === 'start'\) ui\.dlBlocked = false;/.test(app), 'L1: a new download clears the blocked line');
ok(/function dlRoute\(\) \{ return !PUB && window\.claude \? 'capability' : 'link'; \}/.test(app), 'L2: window.claude without use() takes the capability route (artifact build); the public build always the link');
// ---------- L4, L5, L7, L8, L9 (page code; behaviour in the browser test) ----------
ok(eq(F.confirmNext(null, 'ask', 'new', '', 'new-top').c, { kind: 'new', id: '', from: 'new-top' }), 'L4: CONFIRM remembers its opener');
ok(/if \(ui\.confirm && ui\.confirm\.kind === 'remove' && !store\.checks\[ui\.confirm\.id\]\) ui\.confirm = null;/.test(app) && !/ui\.elsewhere = m\.elsewhere; ui\.confirm = null;/.test(app), 'L5: another tab\'s save keeps an open question unless its check is gone');
ok(F.histRead({ r2: 'result', d: 3, prev: 'result', id: 'x', print: 1 }).print === true && F.histRead({ r2: 'result', d: 3 }).print === false, 'L7: the printable page has its own history entry');
ok(C.STOPPED === 'Stopped at step 2' && C.NOT_SUITABLE === 'Not suitable for AI' && /if \(r\.step === 'stop'\) status = C\.STOPPED;/.test(app), 'L8: the stop said once, and only once the stop screen was reached');
ok(/function checkLines\(ids\)/.test(app) && /hhmm\(store\.checks\[k\]\.updated\)/.test(app), 'L9: twin names get the time, then a number');
// ---------- dead code ----------
ok(!('catalogueName' in L) && !('byPerson' in L) && !('answerState' in L) && !('bridgeNext' in F) && !('shareNext' in F) && !('keepShare' in F), 'D1, D2, D3, D7: removed');
ok(!/copyFallback|answersText|copyBox\('dl'\)|copyBox\('file'\)|catName|detail-draft|id="draft"/.test(app), 'D1, D4, D6: no dead page code');
ok(!/keys\.indexOf\(k\) < 0/.test(rd('src/flow.js')), 'D8: the no-op in migrate is gone');
ok(!('FILE_KEEPS_SHARE' in C) && !('DRAFT' in C), 'BUILD NOW 9: dead sharing and draft strings removed');
// ---------- BUILD NOW 1, 7, 8, 9 ----------
ok(P.fileName('Hôtel', '2026-11-26', 'result') === 'Can-AI-solve-your-problems_Hotel_2026-11-26_result.pdf' && /FILE_KIND = 'hftp-do-you-need-ai'/.test(app), 'BUILD NOW 1: one name for the files; the file kind is unchanged');
{
  const r = finished(F, D, 'gx-2'); ['m1', 'm2', 'm3', 'm4'].forEach(id => { r.A[id] = 'n'; }); ['m5', 'm6', 'm7'].forEach(id => { r.A[id] = 'pl'; });
  ok(L.resultModel(r, { cat: D.cat, TQ, ex: D.ex, detail: D.detail, today: '2026-11-26' }).cap === 'The top verdict needs every must-have at Yes: 7 are not Yes yet (4 No, 3 planned).', 'BUILD NOW 7: "7 are not Yes yet (4 No, 3 planned)"');
  const r2 = finished(F, D, 'gx-2'); r2.A.m1 = 'pl';
  ok(L.capLine(L.evaluate(r2, TQ).must) === 'The top verdict needs every must-have at Yes: 1 is not Yes yet.', 'BUILD NOW 7: no brackets with one kind');
  const pm = P.model(r, { cat: D.cat, TQ, ex: D.ex, detail: D.detail, today: '2026-11-26' }, 'result');
  ok(pm.blocks.some(b => b.t === 'The top verdict needs every must-have at Yes: 7 are not Yes yet (4 No, 3 planned).'), 'BUILD NOW 7: the same line in the Result PDF');
}
{
  const r = finished(F, D, 'hr-2'), m = L.resultModel(r, { cat: D.cat, TQ, ex: D.ex, detail: D.detail, today: '2026-11-26' });
  const f = m.first.find(x => x.hold === 'sensitive');
  ok(f && f.sub === 'Because of the use case you chose: ' + TQ.uses['hr-2'].name, 'BUILD NOW 8: the adviser line names the use case: ' + (f && f.sub));
}
{
  const r = finished(F, D, 'gx-2'); r.sharedAt = 'x'; r.share = { named: true };
  ok(!['share', 'sharedAt', 'sharedMode', 'sharedSig'].some(k => k in F.forFile(F.cleanRec(r, env, {}))), 'BUILD NOW 9: the saved file has no hub-era fields');
}
ok(C.NOT_SAVED === 'This browser is not keeping your answers: they are only on this page until you close it. Before you close it, use Copy saved check below, or Save as file on the result page.', 'BUILD NOW 2: the banner copy');
ok(C.DL_STARTED.replace('{name}', 'x.pdf') === 'Download started: x.pdf. If no file appears, use Copy plan or Open printable page below.', 'BUILD NOW 4: the toast copy');
ok(F.QIDS.length + F.MUST_IDS.length + L.tailRange(TQ)[0] === 21 && F.QIDS.length + F.MUST_IDS.length + L.tailRange(TQ)[1] === 27, 'BUILD NOW 6: 21 to 27 questions, from the data');
ok(/var PUB = window\.R2_PUBLIC/.test(app) && /var WS = PUB \? null :/.test(app), 'BUILD NOW 3: the public flag turns window.storage off');
ok(C.VERSION === '2.8.2', 'version 2.8.2'); // v2.8.2 (owner): version bumped
done();
