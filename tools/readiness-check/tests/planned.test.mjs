// "Planned, not done yet" (owner decision, 20 Nov 2026; rules stay v4).
// Proves: (1) Planned scores exactly like Partly (verdict, area points, must-have state, open items) for every tool,
// 5 hotel set-ups and many answer sets; (2) the words never call a Planned answer "not in place", the counts add up and
// the verdict and summary read correctly for planned-only, mixed and no planned must-haves; (3) the "By when?" date
// survives storage, a saved file and the share payload, and old data without it; (4) checks saved by the
// must-haves-first build open unchanged; (5) the must-haves step accepts Planned as an answer; (6) the honesty line.
// Run after building: node tools/readiness-check/tests/planned.test.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..');
const html = readFileSync(join(root, 'index.html'), 'utf8'), team = readFileSync(join(root, 'team.html'), 'utf8');
const D = JSON.parse(html.match(/<script type="application\/json" id="d-data">([\s\S]*?)<\/script>/)[1]);
const ctx = { self: {} }; vm.runInNewContext(readFileSync(join(root, 'src/logic.js'), 'utf8'), ctx);
const fctx = { self: {} }; vm.runInNewContext(readFileSync(join(root, 'src/flow.js'), 'utf8'), fctx);
const L = ctx.self.RCLogic, F = fctx.self.RCFlow, M = L.model(D);
let pass = 0, fail = 0;
const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
const t = (n, f) => { let r = false; try { r = !!f(); } catch (e) { r = false; n += ' [threw: ' + e.message + ']'; } ok(r, n); };
const GOOD = 'Revenue manager, four hours weekly';
const ind = { type: 'independent', country: 'Portugal' };
const NIP = /not in place/i;

// ---- 0. The answer itself ----
t('stored code "pl", label "Planned, not done yet"', () => L.ANSWER.pl === 'Planned, not done yet' && L.answerText({}, 'pl') === 'Planned, not done yet');
t('no existing answer code reused', () => ['y', 'p', 'n', 'k', 'na', 'none', 'y2'].every(c => c !== 'pl') && L.POINTS.pl === 1 && L.POINTS.p === 1);
const q1 = L.selectQuestions(M, M.UI['gx-2'], ind).find(q => q.code === 'P1');
t('score: Planned on a must-have = Partly (gap, 1 point, answered), flagged planned', () => { const a = L.score(q1, { P1: 'pl' }), b = L.score(q1, { P1: 'p' }); return a.state === b.state && a.pts === b.pts && a.done === b.done && a.planned === true && !b.planned; });
t('score: Planned on an area question = Partly', () => { const q = L.selectQuestions(M, M.UI['gx-2'], ind).find(x => !x.gate && !x.list && !x.opts); const a = L.score(q, { [q.code]: 'pl' }), b = L.score(q, { [q.code]: 'p' }); return a.state === 'gap' && a.pts === 1 && a.done && a.state === b.state && a.pts === b.pts; });
t('dates: "2026-12-15" reads "15 Dec 2026"; nonsense reads as no date', () => L.fmtDay('2026-12-15') === '15 Dec 2026' && L.fmtDay('2026-02-30') === '' && L.fmtDay('soon') === '' && L.fmtDay('') === '' && L.fmtDay(null) === '');

// ---- 1. Scoring equivalence: 98 tools × 5 hotels × 8 answer sets ----
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const SINGLE = ['y', 'p', 'p', 'n', 'k', 'na', 'none', '', 'y2'];
function answers(x, h, seed, stage) {
  const A = {}, P = {}, Who = {};
  L.selectQuestions(M, x, h).forEach(q => {
    const r = rng(seed * 7919 + [...q.code].reduce((s, c) => s * 31 + c.charCodeAt(0), 7));
    if (q.list) { q.items.forEach((_, i) => { const v = ['y', 'n', 'k', 'na', ''][Math.floor(r() * 5)]; if (v) A[q.code + '#' + i] = v; }); return; }
    const v = seed === 0 ? 'p' : seed === 1 ? (q.gate ? 'p' : 'y') : SINGLE[Math.floor(r() * SINGLE.length)];
    if (!v) return; A[q.code] = v;
    if (v === 'k' && L.defaultWho(q, stage) === 'vendor') Who[q.code] = 'vendor';
    if (q.gate && (v === 'y' || v === 'none') && r() > 0.2) P[q.code] = GOOD;
  });
  return { A, P, Who };
}
const HOTELS = [ind, { type: 'managed', country: 'Switzerland' }, { type: 'group', country: 'United Kingdom' }, { type: 'independent', country: '' }, { type: 'managed', country: 'Other' }];
const STAGES = ['explore', 'choose', 'sign', 'live'];
const gateState = e => e.gates.map(g => [g.q.code, g.met, g.unconf, g.known, g.s.state, g.s.pts].join(':')).join('|');
const areaState = e => L.AK.map(a => { const r = e.area[a]; return [a, r.pts, r.max, r.pct, r.word, r.answered, r.todo, r.known].join(':'); }).join('|');
const actState = e => e.actions.map(a => [a.key, a.group, a.who, !!a.must].join(':')).join('|');
let combos = 0, same = 0, withPlanned = 0, wordsOk = 0, countsOk = 0;
M.USES.forEach((x, ui) => HOTELS.forEach((h, hi) => {
  for (let seed = 0; seed < 8; seed++) {
    const stage = STAGES[(ui + hi + seed) % 4], o = answers(x, h, seed, stage);
    const Apl = {}, By = {}; Object.keys(o.A).forEach(k => { Apl[k] = o.A[k] === 'p' && k.indexOf('#') < 0 ? 'pl' : o.A[k]; if (Apl[k] === 'pl' && (seed + k.length) % 2) By[k] = '2027-0' + (1 + k.length % 9) + '-1' + (k.length % 9); });
    const ep = L.evaluate(M, x, h, o.A, o.P, o.Who, stage), el = L.evaluate(M, x, h, Apl, o.P, o.Who, stage, By);
    combos++;
    const c1 = Object.assign({}, ep.counts), c2 = Object.assign({}, el.counts); delete c1.planned; delete c2.planned;
    const eq = ep.level === el.level && gateState(ep) === gateState(el) && areaState(ep) === areaState(el) && actState(ep) === actState(el) &&
      JSON.stringify(c1) === JSON.stringify(c2) && JSON.stringify(L.snapshot(ep, 'T')) === JSON.stringify(L.snapshot(el, 'T')) &&
      JSON.stringify(L.first3(ep).map(f => [f.code, f.who, f.group])) === JSON.stringify(L.first3(el).map(f => [f.code, f.who, f.group])) &&
      JSON.stringify(L.vendorQs(M, x, ep)) === JSON.stringify(L.vendorQs(M, x, el)) && ep.low.length === el.low.length && ep.unmet.length === el.unmet.length;
    if (eq) same++; else if (fail < 5) console.log('  differs: ' + x.id + ' ' + JSON.stringify(h) + ' seed ' + seed);
    const pg = el.gates.filter(g => g.planned);
    if (pg.length) withPlanned++;
    // Words: the count line adds up; a planned must-have is never "not in place" anywhere when no hard gap is left.
    const c = el.counts, parts = c.met + c.planned + (c.unmet - c.planned) + c.note + c.unknown;
    if (parts === c.gates && c.planned === pg.length) countsOk++;
    const hard = c.unmet - c.planned;
    const text = [L.verdict(el, stage), L.countLine(el)].concat(L.summary(el, stage), el.steps.slice(3)).join(' \n ');
    const planTexts = el.actions.filter(a => a.planned).map(a => a.text);
    if ((hard ? true : !NIP.test(text)) && planTexts.every(s => /^Finish: /.test(s) && !NIP.test(s))) wordsOk++;
  }
}));
ok(combos === M.USES.length * HOTELS.length * 8 && combos > 3900, 'equivalence covers every tool × 5 hotels × 8 answer sets (' + combos + ')');
ok(same === combos, 'Planned gives the same verdict, area points, must-have states, open items, first three, vendor questions and snapshot as Partly (' + same + '/' + combos + ')');
ok(withPlanned > combos / 3, 'the proof really has planned must-haves in many cases (' + withPlanned + ')');
ok(countsOk === combos, 'count parts add up to the must-haves in every case (' + countsOk + '/' + combos + ')');
ok(wordsOk === combos, 'no "not in place" for a Planned answer; every planned item starts "Finish: " (' + wordsOk + '/' + combos + ')');

// ---- 2. Wording: planned-only, mixed, none ----
const x = M.UI['gx-2'], gates = L.selectQuestions(M, x, ind).filter(q => q.gate);
function set(vals, stage = 'choose', By = {}) {
  const A = {}, P = {};
  L.selectQuestions(M, x, ind).forEach(q => { if (q.list) q.items.forEach((_, i) => A[q.code + '#' + i] = 'y'); else { A[q.code] = 'y'; if (q.gate) P[q.code] = GOOD; } });
  Object.keys(vals).forEach(k => { A[k] = vals[k]; });
  return L.evaluate(M, x, ind, A, P, {}, stage, By);
}
const [g1, g2, g3] = gates.map(q => q.code);
let e = set({ [g1]: 'pl', [g2]: 'pl' }, 'choose', { [g1]: '2026-12-15' });
t('planned only: level stop ("Not ready yet")', () => e.level === 'stop' && L.levelName(e.level) === 'Not ready yet');
t('planned only: verdict "Not ready yet. 2 things are planned: finish them before you sign."', () => L.verdict(e, 'choose') === 'Not ready yet. 2 things are planned: finish them before you sign.');
t('planned only, already in use: "…finish them before you go on using it."', () => L.verdict(set({ [g1]: 'pl', [g2]: 'pl' }, 'live'), 'live') === 'Not ready yet. 2 things are planned: finish them before you go on using it.');
t('one planned: "Not ready yet. 1 thing is planned: finish it before you sign."', () => L.verdict(set({ [g1]: 'pl' }), 'choose') === 'Not ready yet. 1 thing is planned: finish it before you sign.');
t('planned only: count line "' + gates.length + '-2 of ' + gates.length + ' must-haves done · 2 planned"', () => L.countLine(e) === (gates.length - 2) + ' of ' + gates.length + ' must-haves done · 2 planned');
t('planned only: summary names them as planned, never "not in place"', () => { const s = L.summary(e, 'choose'); return s[0] === '2 of the ' + gates.length + ' must-haves are planned, not done yet. Finish them before you sign: until then they hold the verdict back.' && !s.some(v => NIP.test(v)); });
t('planned only: action items "Finish: <action> (planned by 15 Dec 2026)." and "Finish: <action>" without a date', () => { const a = e.actions.filter(o => o.group === 'must'); const q = c => gates.find(g => g.code === c); return a.length === 2 && a.some(o => o.text === 'Finish: ' + q(g1).act.replace(/\.$/, '') + ' (planned by 15 Dec 2026).') && a.some(o => o.text === 'Finish: ' + q(g2).act) && a.every(o => o.planned); });
t('planned only: first three start with the Finish items', () => L.first3(e).filter(f => /^Finish: /.test(f.text)).length === 2);
t('planned only: working out says "planned (not done yet)", not "not in place"', () => e.steps.some(s => /^Must-haves: .*2 planned \(not done yet\)/.test(s)) && !e.steps.some(s => /\b[1-9]\d* not in place|must-haves? (is|are) not in place/.test(s)));
t('planned words follow the stage (beforeWords)', () => L.plannedWords('choose') === 'Planned: finish before you sign' && L.plannedWords('live') === 'Planned: finish before you go on using it' && L.plannedWords('sign') === 'Planned: finish before you sign or start the trial');
e = set({ [g1]: 'pl', [g2]: 'pl', [g3]: 'n' });
t('mixed: verdict "Not ready yet. 1 thing to settle and 2 planned things to finish before you sign."', () => L.verdict(e, 'choose') === 'Not ready yet. 1 thing to settle and 2 planned things to finish before you sign.');
t('mixed: count line "… done · 2 planned · 1 not in place"', () => L.countLine(e) === (gates.length - 3) + ' of ' + gates.length + ' must-haves done · 2 planned · 1 not in place');
t('mixed: summary has the not-in-place sentence for the No and the planned sentence for the two', () => { const s = L.summary(e, 'choose'); return s[0] === '1 of the ' + gates.length + ' must-haves is not in place. Each one on its own is reason enough to wait before you sign.' && s[1] === '2 of the ' + gates.length + ' must-haves are planned, not done yet. Finish them before you sign: until then they hold the verdict back.'; });
t('mixed: the No keeps its action text; the planned ones say Finish', () => { const a = e.actions.filter(o => o.group === 'must'); return a.length === 3 && a.filter(o => /^Finish: /.test(o.text)).length === 2 && a.some(o => o.text === gates.find(g => g.code === g3).act); });
t('mixed with Don\'t know and a missing note: every part counted once', () => { const e2 = set({ [g1]: 'pl', [g2]: 'k', [g3]: 'n' }); return L.countLine(e2) === (gates.length - 3) + ' of ' + gates.length + ' must-haves done · 1 planned · 1 not in place · 1 to find out'; });
e = set({ [g3]: 'n' });
t('none planned: words unchanged ("Not ready yet. 1 thing to settle before you sign.", "… · 1 not in place")', () => L.verdict(e, 'choose') === 'Not ready yet. 1 thing to settle before you sign.' && L.countLine(e) === (gates.length - 1) + ' of ' + gates.length + ' must-haves done · 1 not in place' && e.counts.planned === 0);
e = set({});
t('none open: top verdict unchanged', () => e.level === 'pilot' && e.counts.planned === 0 && !/planned/i.test(L.verdict(e, 'choose') + L.countLine(e)));
t('planned must-have plus a weak area: the area is a thing to settle', () => { const A = {}, P = {}; L.selectQuestions(M, x, ind).forEach(q => { if (q.list) q.items.forEach((_, i) => A[q.code + '#' + i] = 'n'); else { A[q.code] = q.gate ? 'y' : 'n'; if (q.gate) P[q.code] = GOOD; } }); A[g1] = 'pl'; const e3 = L.evaluate(M, x, ind, A, P, {}, 'choose'); return e3.low.length > 0 && L.verdict(e3, 'choose') === 'Not ready yet. ' + e3.low.length + ' ' + (e3.low.length === 1 ? 'thing' : 'things') + ' to settle and 1 planned thing to finish before you sign.'; });
t('Planned → Yes counts as "now done" in "since last time"', () => { const a = L.snapshot(set({ [g1]: 'pl' }), '2026-11-01'), b = L.snapshot(set({}), '2026-11-02'); const c = L.compare(a, b); return c && c.closed.indexOf(g1) >= 0 && c.metBefore === gates.length - 1; });
t('"How this was worked out" line and CHANGES entry', () => L.PLANNED_LINE === '“Planned, not done yet” counts like Partly: 1 point, and on a must-have it holds the verdict back until it is done.' && L.CHANGES.some(s => /Planned, not done yet/.test(s)));
t('rules stay v4', () => L.RULES === 'v4 (20 Nov 2026)');

// ---- 3. The date: storage, file, share payload, old data ----
const known = u => !!M.UI[u];
const rec = { id: 'rcT', useId: 'gx-2', hotel: ind, stage: 'choose', A: { [g1]: 'pl', [g2]: 'pl', [g3]: 'y' }, P: {}, Who: {}, By: { [g1]: '2026-12-15', [g3]: '2026-12-01' }, step: 'result' };
t('storage: a saved check keeps its dates (migrate)', () => { const m = F.migrate(JSON.parse(JSON.stringify(rec)), known); return m.By[g1] === '2026-12-15' && m.By[g3] === '2026-12-01'; });
t('file: the saved file (JSON) round-trips the dates', () => { const file = JSON.parse(JSON.stringify({ kind: 'hftp-readiness-check', v: 3, rules: L.RULES, check: rec })); const m = F.migrate(file.check, known); return m.By[g1] === '2026-12-15'; });
t('migrate: non-string dates are dropped, old data without By gets an empty map', () => { const m = F.migrate(Object.assign({}, rec, { By: { [g1]: 5, [g2]: '2027-01-02' } }), known), m2 = F.migrate({ id: 'old', useId: 'gx-2', A: {} }, known); return !(g1 in m.By) && m.By[g2] === '2027-01-02' && m2.By && Object.keys(m2.By).length === 0; });
t('share payload: plain date strings, only for questions answered Planned', () => { const d = F.plannedDates(rec); return JSON.stringify(d) === JSON.stringify({ [g1]: '2026-12-15' }) && typeof d[g1] === 'string'; });
t('share payload: no dates → empty object; a bad date string is left out', () => JSON.stringify(F.plannedDates({ A: { [g1]: 'pl' } })) === '{}' && JSON.stringify(F.plannedDates({ A: { [g1]: 'pl' }, By: { [g1]: 'next week' } })) === '{}');
t('shared copies made before (no dates) are not marked out of date', () => { const r0 = { useId: 'gx-2', stage: 'choose', hotel: ind, A: { P1: 'pl' }, Who: {}, share: { named: false } }; const sig = F.shareSig(r0); return sig === F.shareSig(Object.assign({}, r0, { By: {} })) && sig !== F.shareSig(Object.assign({}, r0, { By: { P1: '2026-12-01' } })); });
t('evaluate without a date map (old callers, team copies without dates) works', () => { const e4 = L.evaluate(M, x, ind, { [g1]: 'pl' }, {}, {}, 'choose'); return e4.actions.some(a => a.text === 'Finish: ' + gates[0].act); });
t('team page: the share payload\'s dates are read (s.by) and Planned has its own status', () => /s\.by/.test(team) && /Planned/.test(team));

// ---- 4. Checks saved by the must-haves-first build open unchanged ----
const sm = JSON.parse(readFileSync(join(here, 'fixtures/storage-mustfirst.json'), 'utf8')), mine = JSON.parse(sm.storage['hftp-readiness-mychecks-v1']);
const A0 = mine[sm.seenInMustFirst.A.id], B0 = mine[sm.seenInMustFirst.B.id];
function place(r) { const m = F.migrate(JSON.parse(JSON.stringify(r)), known); const qs = L.selectQuestions(M, M.UI[m.useId], m.hotel); return F.placeStep(m.step, { tool: true, steps: F.questionSteps(qs, L.AK), mustOpen: !!F.firstOpenMust(qs, q => L.hasAnswer(q, m.A, m.P)) }); }
t('fixture: written by the must-haves-first build, no Planned answers, no dates', () => A0 && B0 && !JSON.stringify(mine).includes('"pl"') && !('By' in A0) && JSON.parse(sm.storage['hftp-readiness-current-v1']) === B0.id);
t('saved check A: same verdict, count line and summary as the earlier build showed', () => { const m = F.migrate(JSON.parse(JSON.stringify(A0)), known), e5 = L.evaluate(M, M.UI[m.useId], m.hotel, m.A, m.P, m.Who, m.stage, m.By); return L.verdict(e5, m.stage) === sm.seenInMustFirst.A.verdict && L.countLine(e5) === sm.seenInMustFirst.A.count && JSON.stringify(L.summary(e5, m.stage)) === JSON.stringify(sm.seenInMustFirst.A.summary) && e5.level === sm.seenInMustFirst.A.level; });
t('saved check A reopens at the result; B (must-haves open) at the must-haves step', () => place(A0) === 'result' && place(B0) === 'must');
t('saved check: answers, notes and history unchanged by migrate', () => { const m = F.migrate(JSON.parse(JSON.stringify(A0)), known); return JSON.stringify(m.A) === JSON.stringify(A0.A) && JSON.stringify(m.P) === JSON.stringify(A0.P) && JSON.stringify(m.snaps) === JSON.stringify(A0.snaps); });
t('saved check: its last snapshot is the same as one worked out now (no new "since last time" entry)', () => { const m = F.migrate(JSON.parse(JSON.stringify(A0)), known), e5 = L.evaluate(M, M.UI[m.useId], m.hotel, m.A, m.P, m.Who, m.stage, m.By), s = L.snapshot(e5, 'T'), last = m.snaps[m.snaps.length - 1]; return last.rules === s.rules && last.level === s.level && last.met === s.met && last.known === s.known && last.open === s.open && JSON.stringify(last.metCodes) === JSON.stringify(s.metCodes); });
const fm = JSON.parse(readFileSync(join(here, 'fixtures/check-mustfirst.json'), 'utf8'));
t('file saved by the must-haves-first build opens at the result with the same verdict', () => { const m = F.migrate(fm.check, known); const e6 = L.evaluate(M, M.UI[m.useId], m.hotel, m.A, m.P, m.Who, m.stage, m.By); return fm.kind === 'hftp-readiness-check' && fm.v === 3 && place(fm.check) === 'result' && L.verdict(e6, m.stage) === sm.seenInMustFirst.A.verdict; });

// ---- 5. Must-haves step: Planned is an answer ----
t('hasAnswer: Planned counts as an answer on a must-have', () => L.hasAnswer(q1, { P1: 'pl' }));
t('must-haves step: every must-have Planned → nothing open, "next" allowed', () => { const qs = L.selectQuestions(M, x, ind), A = {}; qs.filter(q => q.gate).forEach(q => A[q.code] = 'pl'); const open = F.firstOpenMust(qs, q => L.hasAnswer(q, A, {})); const steps = F.questionSteps(qs, L.AK); return open === null && F.flowNext('must', 'next', { tool: true, steps, mustDone: !open }) === steps[1]; });
t('Planned is offered wherever Partly is (the page builds its options from the same list)', () => /\['y', 'Yes'\], \['pl', 'Planned, not done yet'\], \['p', 'Partly'\], \['n', 'No'\], \['k', "Don't know yet"\]/.test(html));

// ---- 6. Honesty line ----
const HONEST = 'Nobody checks your answers. A Yes that isn\'t true only hides a problem you will meet after signing.';
t('honesty line, exact text, in the page (start screen and must-haves intro)', () => html.includes(HONEST.replace("'", "\\'")) || html.includes(HONEST));
console.log((fail ? 'FAILED' : 'ok') + ': ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
