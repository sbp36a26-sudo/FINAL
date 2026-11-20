// Checks the readiness-check rules (v3). Run after building: node tools/readiness-check/tests/logic.test.mjs
// Includes every scoring fault found in the trials of 18 Nov 2026 (reports/Readiness check retention and trust.md, section 2).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const D = JSON.parse(html.match(/<script type="application\/json" id="d-data">([\s\S]*?)<\/script>/)[1]);
const ctx = { self: {} }; vm.runInNewContext(readFileSync(join(root, 'src/logic.js'), 'utf8'), ctx);
const L = ctx.self.RCLogic, M = L.model(D);
let pass = 0, fail = 0; const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const GOOD = 'Revenue manager, four hours weekly';
// Fill every question: v for normal answers, list items get lv; proof for must-have Yes.
function fill(x, h, v, { proof = GOOD, lv = null, gateV = null } = {}) {
  const A = {}, P = {};
  L.selectQuestions(M, x, h).forEach(q => {
    if (q.list) { q.items.forEach((_, i) => A[q.code + '#' + i] = lv || (v === 'na' ? 'na' : v)); return; }
    A[q.code] = q.gate && gateV ? gateV : v;
    if (q.gate && (A[q.code] === 'y') && proof) P[q.code] = proof;
  });
  return [A, P];
}
const ind = { type: 'independent', country: 'Portugal' };
const rm2 = M.UI['rm-2'], hr2 = M.UI['hr-2'], gx2 = M.UI['gx-2'];

ok(M.USES.length === 96, '96 tool use cases (97 in the catalogue; the AI-use policy is not a tool)');
let [A, P] = fill(rm2, ind, 'y'); let e = L.evaluate(M, rm2, ind, A, P);
ok(e.level === 'pilot', 'all Yes with real proof lines: Ready to pilot');
ok(!('score' in e) && !('raw' in e), 'no 0-100 composite score');
ok(!L.LEVELS.scale, 'no "Ready to scale" verdict in v3');

// Trial fault 1: all Yes with proof "x" on a recruiting tool gave 100, Ready to scale.
[A, P] = fill(hr2, ind, 'y', { proof: 'x' }); e = L.evaluate(M, hr2, ind, A, P);
ok(e.level === 'stop', 'proof "x" does not count: not ready');
ok(!L.proofOk('x') && !L.proofOk('yes') && L.proofOk(GOOD), 'proof line needs a few words');

// Trial fault 2: must-haves Yes, everything else "Doesn't apply", AI Act item No gave 96, Ready to scale.
[A, P] = fill(hr2, ind, 'na', { gateV: 'y', lv: 'na' }); e = L.evaluate(M, hr2, ind, A, P);
ok(L.selectQuestions(M, hr2, ind).some(q => q.code === 'XL' && q.gate), 'high-risk use: AI Act check is a must-have');
ok(e.level !== 'pilot', 'Yes on must-haves and Doesn\'t apply elsewhere cannot reach Ready to pilot');
A.XL = 'n'; e = L.evaluate(M, hr2, ind, A, P);
ok(e.level === 'stop', 'AI Act check answered No: not ready');
ok(L.selectQuestions(M, hr2, ind).filter(q => q.gate || ['P5', 'G3', 'G4', 'X2a', 'XL'].includes(q.code)).every(q => q.noNa), 'no "Doesn\'t apply" on must-haves and protective items');

// Trial fault 3: "Not sure" scored as No (Technology 0% from unknowns).
[A, P] = fill(rm2, ind, 'y'); L.selectQuestions(M, rm2, ind).filter(q => q.a === 'te').forEach(q => { if (q.list) q.items.forEach((_, i) => A[q.code + '#' + i] = 'k'); else A[q.code] = 'k'; });
e = L.evaluate(M, rm2, ind, A, P);
ok(e.area.te.pct === null, 'unknown answers are left out, not scored 0');
ok(e.level === 'open', 'unknown must-have or area: Not enough information yet, not Not ready');
ok(e.actions.some(a => a.group === 'find' || a.group === 'vendor'), 'unknowns become "to find out" actions');

// A known No settles it whatever the unknowns say.
A.P1 = 'n'; e = L.evaluate(M, rm2, ind, A, P);
ok(e.level === 'stop', 'one known must-have No: not ready, even with unknowns');

// Trial fault 4: one unmet and eight unmet both showed 39. Now the count is shown.
[A, P] = fill(rm2, ind, 'y'); const g = L.selectQuestions(M, rm2, ind).filter(q => q.gate); A[g[0].code] = 'n';
const e1 = L.evaluate(M, rm2, ind, A, P); g.forEach(q => A[q.code] = 'n'); const e2 = L.evaluate(M, rm2, ind, A, P);
ok(e1.unmet.length === 1 && e2.unmet.length === g.length && e1.counts.met !== e2.counts.met, 'number of must-haves met is reported, not a flat cap');

// Trial fault 5: fixed verdict text told hotels to "name an owner" when they had one.
[A, P] = fill(rm2, ind, 'y'); A.F2 = 'n'; e = L.evaluate(M, rm2, ind, A, P);
ok(e.actions.filter(a => a.group === 'must').length === 1 && e.actions[0].q.code === 'F2', 'action list holds only what is open');
ok(!L.summary(e, 'choose').join(' ').match(/name an owner|set a budget/i), 'summary built from open items, not a fixed sentence');

// Area below 40% on known answers stops; area with a single known answer does not decide alone.
[A, P] = fill(rm2, ind, 'y'); L.selectQuestions(M, rm2, ind).filter(q => q.a === 'sk').forEach(q => { if (q.list) q.items.forEach((_, i) => A[q.code + '#' + i] = 'n'); else A[q.code] = 'n'; });
e = L.evaluate(M, rm2, ind, A, P);
ok(e.area.sk.known >= 2 && e.level === 'stop' && e.low.some(r => r.a === 'sk'), 'area below 40% with enough answers: not ready');

// Must-have ways out that count as met.
[A, P] = fill(M.UI['me-1'] || rm2, ind, 'y');
ok(L.selectQuestions(M, rm2, ind).some(q => q.code === 'D5a' && q.gate && q.none) && L.selectQuestions(M, rm2, ind).some(q => q.code === 'D5b' && q.gate), 'data question split into agreement and permission, with "no personal data" option');
const xg = L.selectQuestions(M, hr2, ind).find(q => q.code === 'XG');
ok(xg && xg.gate && xg.none === 'We have no staff representatives', 'staff tool: representatives must-have with "we have none" option');
[A, P] = fill(hr2, ind, 'y'); A.XG = 'none'; delete P.XG; e = L.evaluate(M, hr2, ind, A, P);
ok(e.gates.find(x => x.q.code === 'XG').met, '"We have no staff representatives" counts as met');

// Selection rules kept from v2.
ok(L.selectQuestions(M, rm2, ind).some(q => q.code === 'P5' && q.gate), 'tool acting alone: overrule is a must-have');
ok(!L.selectQuestions(M, M.UI['sm-1'], ind).some(q => q.code === 'T1' && q.gate), 'light tool: two-way link not a must-have');
ok(L.selectQuestions(M, gx2, ind).some(q => q.code === 'X2a') && L.selectQuestions(M, gx2, ind).some(q => q.code === 'X2b'), 'guest-facing tool: reach a person + guest feedback');

// Wording faults from the review.
const allQ = M.USES.flatMap(u => L.selectQuestions(M, u, { type: 'managed' }));
ok(allQ.every(q => q.q && !/—\?|: —/.test(q.q)), 'no blank "—?" questions');
ok(allQ.filter(q => q.list).every(q => q.items.every(t => !/see D7|AI Act|GDPR|Art\.\s?\d/.test(t) && !/^[a-z][A-Z]/.test(t))), 'tick lists: no legal shorthand, no broken first letters');
ok(!allQ.some(q => q.list && q.a === 'fi'), 'no finance tick list (vendor price notes are not something a hotel "has")');
const counts = M.USES.map(u => L.selectQuestions(M, u, ind).length);
ok(Math.max(...counts) <= 34 && Math.min(...counts) >= 14, 'question count per tool between 14 and 34 (' + Math.min(...counts) + '–' + Math.max(...counts) + ')');

// Legal and vendor panels.
const lg = L.legal(M, gx2, { country: 'Switzerland' });
ok(lg && /Switzerland is not in the EU/.test(lg.country), 'country sentence for Switzerland');
ok(lg.items.every(i => !/Art\.\s?\d/.test(i.text)), 'legal items on client pages carry no article numbers');
ok(!L.selectQuestions(M, gx2, ind).some(q => /disclose AI/i.test(q.q + (q.items || []).join(' '))), 'chatbot: no "disclose AI" duty put on the hotel');
ok(L.vendorQs(M, gx2, null).some(q => /notice built in/.test(q)), 'chatbot: vendor asked whether the AI notice is built in');

// Return visit: compare snapshots.
[A, P] = fill(rm2, ind, 'y'); A.P1 = 'n'; A.F2 = 'k';
const s1 = L.snapshot(L.evaluate(M, rm2, ind, A, P), '2026-11-18T10:00:00Z');
A.P1 = 'y'; P.P1 = GOOD; A.F2 = 'y'; P.F2 = 'Reply time 9 hours in October';
const s2 = L.snapshot(L.evaluate(M, rm2, ind, A, P), '2026-12-01T10:00:00Z'), c = L.compare(s1, s2);
ok(c && c.closed.includes('P1') && c.closed.includes('F2') && c.from === 'stop' && c.to === 'pilot', 'since last time: must-haves closed and verdict change');
ok(L.compare(Object.assign({}, s1, { rules: 'v2' }), s2) === null, 'snapshots from other rules versions are not compared');

console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
