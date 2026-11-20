// Must-haves first (20 Nov 2026): step 1 asks every must-have, then the six areas without them.
// Proves (1) every question is asked exactly once, (2) scoring is identical to the six-step order for every tool and many
// answer sets, (3) checks saved by the six-step build (v4) and the v3 build reopen where they should.
// Run after building: node tools/readiness-check/tests/mustfirst.test.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const D = JSON.parse(html.match(/<script type="application\/json" id="d-data">([\s\S]*?)<\/script>/)[1]);
const ctx = { self: {} }; vm.runInNewContext(readFileSync(join(root, 'src/logic.js'), 'utf8'), ctx);
const fctx = { self: {} }; vm.runInNewContext(readFileSync(join(root, 'src/flow.js'), 'utf8'), fctx);
const L = ctx.self.RCLogic, F = fctx.self.RCFlow, M = L.model(D);
let pass = 0, fail = 0;
const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const sortKeys = o => JSON.stringify(Object.keys(o).sort().map(k => [k, o[k]]));

// ---- the two orders ----
const oldSteps = qs => L.AK.map(a => qs.filter(q => q.a === a));                       // six-step build (v4)
const newSteps = qs => F.questionSteps(qs, L.AK).map(s => F.stepQuestions(qs, s, L.AK)); // must-haves first
// Seeded answer generator; each answer set is a function of the question code only, so both orders give the same answers.
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const SINGLE = ['y', 'p', 'n', 'k', 'na', 'none', '', 'y2'];
const PROOFS = ['Revenue manager, four hours weekly', 'x', '', 'Owner email 3 Nov'];
function answerFor(seed, q, r) {
  if (seed === 0) return q.list ? 'y' : 'y';
  if (seed === 1) return q.list ? 'n' : 'n';
  if (seed === 2) return q.list ? 'k' : 'k';
  if (seed === 3) return q.list ? 'na' : 'na';
  return q.list ? ['y', 'n', 'k', 'na', ''][Math.floor(r() * 5)] : SINGLE[Math.floor(r() * SINGLE.length)];
}
// Walks the steps in the given order, writing answers as the page does (st.A / st.P / st.Who, F17 vendor rule on "Don't know yet").
function walk(steps, seed, stage) {
  const A = {}, P = {}, Who = {}; const seen = [];
  steps.forEach(group => group.forEach(q => {
    seen.push(q.code);
    const r = rng(seed * 7919 + [...q.code].reduce((s, c) => s * 31 + c.charCodeAt(0), 7));
    if (q.list) { q.items.forEach((_, i) => { const v = answerFor(seed, q, r); if (v) A[q.code + '#' + i] = v; }); return; }
    const v = answerFor(seed, q, r); if (!v) return;
    A[q.code] = v;
    if (v === 'k' && !Who[q.code] && L.defaultWho(q, stage) === 'vendor') Who[q.code] = 'vendor';
    if (q.gate && (v === 'y' || v === 'none')) { const p = PROOFS[Math.floor(r() * PROOFS.length)]; if (p) P[q.code] = p; }
  }));
  return { A, P, Who, seen };
}
const HOTELS = [{ type: 'independent', country: 'Portugal' }, { type: 'managed', country: 'Switzerland' }, { type: 'group', country: 'United Kingdom' }, { type: 'independent', country: '' }, { type: 'managed', country: 'Other' }];
const STAGES = ['explore', 'choose', 'sign', 'live'];
let combos = 0, sameQs = 0, sameEval = 0, onceEach = 0, mustFirst = 0, stepCountOk = 0;
M.USES.forEach((x, ui) => HOTELS.forEach((h, hi) => {
  const qs = L.selectQuestions(M, x, h), codes = qs.map(q => q.code).sort().join();
  const steps = F.questionSteps(qs, L.AK);
  if (steps[0] === 'must' && F.stepQuestions(qs, 'must', L.AK).length === qs.filter(q => q.gate).length) mustFirst++;
  if (steps.length >= 2 && steps.length <= 7) stepCountOk++;
  for (let seed = 0; seed < 10; seed++) {
    const stage = STAGES[(ui + hi + seed) % 4];
    const o = walk(oldSteps(qs), seed, stage), n = walk(newSteps(qs), seed, stage);
    combos++;
    if (o.seen.slice().sort().join() === codes && n.seen.slice().sort().join() === codes) sameQs++;
    if (new Set(n.seen).size === n.seen.length && n.seen.length === qs.length) onceEach++;
    const eo = L.evaluate(M, x, h, o.A, o.P, o.Who, stage), en = L.evaluate(M, x, h, n.A, n.P, n.Who, stage);
    const so = L.snapshot(eo, 'T'), sn = L.snapshot(en, 'T');
    const same = sortKeys(o.A) === sortKeys(n.A) && JSON.stringify(eo) === JSON.stringify(en) && JSON.stringify(so) === JSON.stringify(sn) &&
      L.verdict(eo, stage) === L.verdict(en, stage) && L.countLine(eo) === L.countLine(en) && JSON.stringify(L.summary(eo, stage)) === JSON.stringify(L.summary(en, stage)) &&
      JSON.stringify(L.first3(eo)) === JSON.stringify(L.first3(en)) && JSON.stringify(L.vendorQs(M, x, eo)) === JSON.stringify(L.vendorQs(M, x, en)) &&
      L.AK.every(a => eo.area[a].pct === en.area[a].pct && eo.area[a].word === en.area[a].word);
    if (same) sameEval++; else if (fail < 5) console.log('  differs: ' + x.id + ' ' + JSON.stringify(h) + ' seed ' + seed);
  }
}));
const T = M.USES.length * HOTELS.length;
ok(combos === T * 10 && combos > 4000, 'order proof covers every tool × 5 hotels × 10 answer sets (' + combos + ')');
ok(sameQs === combos, 'old and new order ask the same questions (' + sameQs + '/' + combos + ')');
ok(onceEach === combos, 'new order asks every question exactly once: no must-have repeated in its area (' + onceEach + '/' + combos + ')');
ok(sameEval === combos, 'identical verdict, counts, areas, action plan, first three, vendor questions and snapshot in both orders (' + sameEval + '/' + combos + ')');
ok(mustFirst === T, 'step 1 is the must-haves and holds every must-have, for every tool and hotel (' + mustFirst + '/' + T + ')');
ok(stepCountOk === T, '2 to 7 steps for every tool and hotel');
// The must-haves are in area order (people, skills, money, technology, data, governance).
ok(M.USES.every(x => { const g = F.stepQuestions(L.selectQuestions(M, x, HOTELS[1]), 'must', L.AK).map(q => L.AK.indexOf(q.a)); return g.every((v, i) => !i || g[i - 1] <= v); }), 'must-haves in the order of their areas');
// Conditional must-haves are on step 1 when they apply.
const mustCodes = (id, h) => F.stepQuestions(L.selectQuestions(M, M.UI[id], h), 'must', L.AK).map(q => q.code);
ok(['XL', 'XG', 'G2s', 'P5', 'G3', 'D5a', 'D5b'].every(c => mustCodes('hr-2', HOTELS[1]).includes(c)), 'high-risk HR tool: XL, XG, G2s, P5, G3, D5a, D5b on the must-haves step (' + mustCodes('hr-2', HOTELS[1]).join(' ') + ')');
ok(mustCodes('gx-2', HOTELS[0]).length >= 6 && mustCodes('sm-1', HOTELS[0]).length >= 6, 'chatbot and light tool: their must-haves on step 1 (' + mustCodes('gx-2', HOTELS[0]).join(' ') + ' / ' + mustCodes('sm-1', HOTELS[0]).join(' ') + ')');
// Skipped areas: Financial investment holds only must-haves for many tools.
const sm = F.questionSteps(L.selectQuestions(M, M.UI['sm-1'], HOTELS[0]), L.AK);
ok(sm.indexOf(2) < 0 && sm[0] === 'must', 'light tool: Financial investment (only must-haves) is skipped: ' + sm.join(','));
// hasAnswer: "Don't know yet" counts, blank and stale do not.
const d5a = L.selectQuestions(M, M.UI['hr-2'], HOTELS[0]).find(q => q.code === 'D5a');
ok(L.hasAnswer(d5a, { D5a: 'k' }) && L.hasAnswer(d5a, { D5a: 'n' }) && !L.hasAnswer(d5a, {}) && !L.hasAnswer(d5a, { D5a: 'none' }) && !L.hasAnswer(d5a, { D5a: 'na' }), 'hasAnswer: Don\'t know yet counts; blank and a stale "no personal data" (not offered for HR) do not');
ok(L.hasAnswer(d5a, { D5a: 'y' }, {}), 'hasAnswer: a Yes without a note is an answer (the note is asked, not required to go on)');

// ---- reopening saved checks (the page's place(): selectQuestions → questionSteps → placeStep) ----
const known = u => !!M.UI[u];
function place(r) {
  const m = F.migrate(JSON.parse(JSON.stringify(r)), known); if (!m) return null;
  if (!M.UI[m.useId]) return m.step;
  const qs = L.selectQuestions(M, M.UI[m.useId], m.hotel);
  return F.placeStep(m.step, { tool: true, steps: F.questionSteps(qs, L.AK), mustOpen: !!F.firstOpenMust(qs, q => L.hasAnswer(q, m.A, m.P)) });
}
const s4 = JSON.parse(readFileSync(join(here, 'fixtures/storage-v4.json'), 'utf8')), mine = JSON.parse(s4.storage['hftp-readiness-mychecks-v1']);
const recA = mine[s4.seenInV4.A.id], recB = mine[s4.seenInV4.B.id];
ok(recA && recA.step === 3 && recB && recB.step === 2 && JSON.parse(s4.storage['hftp-readiness-current-v1']) === recB.id, 'fixture: saved by the six-step build: A at area step 3, B at area step 2 (current)');
ok(place(recA) === 3 && M.AREA[L.AK[3]].name === 'Technology infrastructure', 'v4 check at area step 3 (all must-haves answered) reopens at the same area, Technology infrastructure');
const stA = F.questionSteps(L.selectQuestions(M, M.UI[recA.useId], recA.hotel), L.AK);
ok(F.stepNo(3, stA) === stA.indexOf(3) + 1 && F.stepNo(3, stA) >= 4, 'it is shown as "Step ' + F.stepNo(3, stA) + ' of ' + stA.length + '" in the new numbering');
ok(place(recB) === 'must', 'v4 check with unanswered must-haves (saved at area step 2) reopens at the must-haves step');
ok(place(Object.assign({}, recB, { step: 'review' })) === 'review' && place(Object.assign({}, recB, { step: 'result' })) === 'result', 'review and result unchanged even with must-haves open');
ok(place(Object.assign({}, recA, { step: 'prep' })) === 'prep' && place(Object.assign({}, recA, { step: '5' })) === 5, 'prep unchanged; a step stored as a string still works');
const eA = L.evaluate(M, M.UI[recA.useId], recA.hotel, recA.A, recA.P, recA.Who, recA.stage);
ok(L.verdict(eA, recA.stage) === s4.seenInV4.A.result.verdict && L.countLine(eA) === s4.seenInV4.A.result.count, 'v4 check: same verdict and count line as the six-step build showed (' + s4.seenInV4.A.result.verdict + ')');
const f4 = JSON.parse(readFileSync(join(here, 'fixtures/check-v4.json'), 'utf8'));
ok(f4.kind === 'hftp-readiness-check' && f4.v === 3 && place(f4.check) === 'result', 'file saved by the six-step build opens (format unchanged) at the result');
const f3 = JSON.parse(readFileSync(join(here, 'fixtures/check-v3.json'), 'utf8'));
ok(place(f3.check) === 'result' && place(Object.assign({}, f3.check, { step: 4 })) === 'must', 'file saved by the v3 build still opens; at an area step with open must-haves it reopens at the must-haves');
// A step this build does not know (from a newer or damaged record) → start.
ok(place(Object.assign({}, recA, { step: 'later' })) === 'start', 'unknown step → start');
console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
