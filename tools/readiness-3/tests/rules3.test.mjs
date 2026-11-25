// v3 rules (P2): src/rules3.js against the owner's reference spec/sim_v3.py.
//  1. golden cases: spec/golden_cases_v3.json, read unchanged; inputs built the way spec/golden_v3.py builds them ("other answers" Yes)
//  2. visibility: for every use case and every gate combination (each gate any option or unanswered), the visible ids equal
//     sim_v3.visible_questions (tests/fixtures/sim_v3_visible.json, written by tests/gen_sim_fixture.py from spec/sim_v3.py)
//  3. full sweep: the runs of spec/sweep_v3.py rebuilt here, exported to tests/out/sweep_v3_js.csv in the same format and compared
//     with spec/sweep_v3_runs.csv row by row (verdict, score, and also caps and the row keys)
//  4. the §9 invariants, the soft stop, Continue anyway, contradiction notes, sensitive flag, actions and reasons
// Run: node tools/readiness-3/tests/rules3.test.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, tester } from './load.mjs';
import { loadV3, goldenCases } from '../lib/data3.mjs';
const { ok, done } = tester('rules3');
const { R3 } = load();
const { runtime: D } = loadV3();
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const UC = Object.fromEntries(D.use_cases.map(u => [u.id, u]));
const S2_YES = { s1: 'yes', s2: 'yes', s3: 'yes', s4: 'yes', s5: 'yes' };
const MH_YES = Object.fromEntries(D.must_haves.map(m => [m.id, 'yes']));
const ids = qs => qs.map(q => q.id);
const ev = (use, step2, gates, mh, qa, continued) => R3.evaluate(D, { use, step2, gates, mh, qa, continued });

// ---------- 1. golden cases ----------
const G = goldenCases();
let gPass = 0;
G.forEach((g, n) => {
  const baseQ = g.use_case === 'none' ? Object.fromEntries(D.none_fits.questions.map(q => [q.id, 'yes'])) : Object.fromEntries(R3.visible(D, g.use_case, g.gates).map(q => [q.id, 'yes']));
  const r = ev(g.use_case, g.step2, g.gates, Object.assign({}, MH_YES, g.must_haves_changed), Object.assign({}, baseQ, g.questions_changed), g.continued_after_soft_stop);
  const exp = { v: g.expected_verdict, s: g.expected_score, c: g.expected_caps, n: g.expected_notes };
  const got = { v: r.verdict, s: r.score, c: r.caps, n: r.notes };
  const pass = eq(exp, got);
  if (pass) gPass++;
  ok(pass, 'golden ' + (n + 1) + ' ' + g.name + ': expected ' + JSON.stringify(exp) + ' got ' + JSON.stringify(got));
});
ok(G.length === 33 && gPass === 33, 'golden: ' + gPass + '/' + G.length);
console.log('golden: ' + gPass + '/' + G.length);

// ---------- 2. visibility = sim_v3.visible_questions ----------
const FX = JSON.parse(readFileSync(join(root, 'tests/fixtures/sim_v3_visible.json'), 'utf8'));
let vN = 0, vOk = 0;
Object.entries(FX).forEach(([uid, rows]) => rows.forEach(([ga, exp]) => { vN++; if (eq(ids(R3.visible(D, uid, ga)), exp)) vOk++; else console.log('  visible differs', uid, JSON.stringify(ga)); }));
ok(vN === vOk && Object.keys(FX).length === 100, 'visible questions equal sim_v3 for every use case and gate combination: ' + vOk + '/' + vN);
/* every asked gate combination of the fixture is complete: the product of (options + unanswered) */
ok(D.use_cases.every(u => FX[u.id].length === R3.askedGates(D, u.id).reduce((a, g) => a * (g.options.length + 1), 1)), 'the fixture covers every combination');

// ---------- 3. full sweep, exported and diffed ----------
function product(lists) { return lists.reduce((acc, l) => acc.flatMap(a => l.map(x => a.concat([x]))), [[]]); }
const pyJson = o => '{' + Object.entries(o).map(([k, v]) => JSON.stringify(k) + ': ' + JSON.stringify(v)).join(', ') + '}';
const csvCell = s => /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
const rows = [];
const row = (uid, ga, item, ans, r) => rows.push([uid, pyJson(ga), item, ans, r.verdict, String(r.score), r.caps.join(';')]);
const inv = { blockerNo: 0, blockerNoBad: [], nonBlockerNo: 0, nonBlockerNoBad: [], softBlocker: 0, softBlockerBad: [], naOk: 0, naBad: [], allYes: 0, allYesBad: [], actions: 0, actionsBad: [] };
const checkActions = (r, tag) => { if (r.verdictKey !== 'ready') { inv.actions++; if (!(r.reason && r.top3.length >= 1 && r.top3.length <= 3 && r.top3.every(a => a.text && a.ownerLabel))) inv.actionsBad.push(tag); } };
for (const u of D.use_cases) {
  const ag = R3.askedGates(D, u.id);
  for (const c of product(ag.map(g => g.options.map(o => o.key)))) {
    const ga = Object.fromEntries(ag.map((g, i) => [g.id, c[i]]));
    const vis = R3.visible(D, u.id, ga), qa = Object.fromEntries(vis.map(q => [q.id, 'yes']));
    const base = ev(u.id, S2_YES, ga, MH_YES, qa);
    row(u.id, ga, 'ALL', 'yes', base);
    inv.allYes++; if (base.verdict !== (base.caps.length ? 'Almost ready' : 'Ready')) inv.allYesBad.push(u.id + pyJson(ga));
    checkActions(base, u.id + pyJson(ga));
    for (const q of vis) for (const ans of ['planned', 'no', 'dk']) {
      const r = ev(u.id, S2_YES, ga, MH_YES, Object.assign({}, qa, { [q.id]: ans }));
      row(u.id, ga, q.id, ans, r); checkActions(r, u.id + ' ' + q.id + '=' + ans);
      if (q.weight === 'B' && ans === 'no') { inv.blockerNo++; if (r.verdict !== 'Not ready') inv.blockerNoBad.push(q.id); }
      if (q.weight !== 'B' && ans === 'no') { inv.nonBlockerNo++; if (r.verdict === 'Not ready') inv.nonBlockerNoBad.push(q.id); }
      if (q.weight === 'B' && ans !== 'no') { inv.softBlocker++; if (r.verdict === 'Ready') inv.softBlockerBad.push(q.id + '=' + ans); }
    }
    for (const m of D.must_haves) for (const ans of ['planned', 'no', 'dk', 'na']) {
      const r = ev(u.id, S2_YES, ga, Object.assign({}, MH_YES, { [m.id]: ans }), qa);
      row(u.id, ga, m.id, ans, r); checkActions(r, u.id + ' ' + m.id + '=' + ans);
      if (ans === 'no') { inv.blockerNo++; if (r.verdict !== 'Not ready') inv.blockerNoBad.push(m.id); }
      if (ans === 'planned' || ans === 'dk') { inv.softBlocker++; if (r.verdict === 'Ready') inv.softBlockerBad.push(m.id + '=' + ans); }
      if (ans === 'na') {
        const contra = ag.some(g => (g.options.find(o => o.key === ga[g.id]).effects.contradicts_na || []).includes(m.id));
        inv.naOk++;
        if (m.na && !contra && r.verdict !== base.verdict) inv.naBad.push(u.id + ' ' + m.id + ' accepted changed the verdict');
        if ((!m.na || contra) && r.verdict === 'Ready') inv.naBad.push(u.id + ' ' + m.id + ' rejected still Ready');
        if (contra && !(r.notes.length && r.contradictions.some(x => x.id === m.id && x.note === m.contradiction_note))) inv.naBad.push(u.id + ' ' + m.id + ' contradiction without note');
        if (!contra && r.notes.length) inv.naBad.push(u.id + ' ' + m.id + ' note without contradiction');
        if (m.na && contra && r.items.find(i => i.id === m.id).answer !== 'dk') inv.naBad.push(u.id + ' ' + m.id + ' contradicted not Don\'t know yet');
      }
    }
  }
}
{ const ng = D.none_fits.gates, ga = Object.fromEntries(ng.map(g => [g, D.gate_library[g].options[0].key]));
  const r = ev('none', S2_YES, ga, MH_YES, Object.fromEntries(D.none_fits.questions.map(q => [q.id, 'yes'])));
  row('none', ga, 'ALL', 'yes', r); checkActions(r, 'none'); }
mkdirSync(join(root, 'tests/out'), { recursive: true });
const csv = ['use_case,gates,item,answer,verdict,score,caps'].concat(rows.map(r => r.map(csvCell).join(','))).join('\r\n') + '\r\n';
writeFileSync(join(root, 'tests/out/sweep_v3_js.csv'), csv);
const ref = readFileSync(join(root, 'spec/sweep_v3_runs.csv'), 'utf8').split('\r\n').filter(Boolean);
const mine = csv.split('\r\n').filter(Boolean);
function parse(line) { const out = []; let cur = '', q = false; for (let i = 0; i < line.length; i++) { const ch = line[i]; if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; } else if (ch === '"') q = true; else if (ch === ',') { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; }
let diffV = 0, diffS = 0, diffKey = 0, diffCaps = 0;
const n = Math.max(ref.length, mine.length) - 1;
for (let i = 1; i <= n; i++) {
  const a = parse(ref[i] || ''), b = parse(mine[i] || '');
  if (a.slice(0, 4).join('|') !== b.slice(0, 4).join('|')) diffKey++;
  if (a[4] !== b[4]) diffV++;
  if (a[5] !== b[5]) diffS++;
  if (a[6] !== b[6]) diffCaps++;
  if ((a[4] !== b[4] || a[5] !== b[5]) && diffV + diffS < 6) console.log('  sweep differs at row ' + i + ': ' + ref[i] + '  vs  ' + mine[i]);
}
console.log('sweep: ' + (mine.length - 1) + ' runs (reference ' + (ref.length - 1) + '); verdict diffs ' + diffV + ', score diffs ' + diffS + ', caps diffs ' + diffCaps + ', row-key diffs ' + diffKey + '; byte-identical: ' + (csv === readFileSync(join(root, 'spec/sweep_v3_runs.csv'), 'utf8')));
ok(mine.length - 1 === 26935 && ref.length - 1 === 26935, 'sweep: 26,935 runs');
ok(diffV === 0 && diffS === 0, 'sweep: 0 differences on verdict and score');
ok(diffKey === 0 && diffCaps === 0, 'sweep: same rows in the same order, same caps');

// ---------- 3b. random mixed checks scored by sim_v3.py (tests/gen_sim_random.py) ----------
{ const RX = JSON.parse(readFileSync(join(root, 'tests/fixtures/sim_v3_random.json'), 'utf8'));
  let same = 0; RX.forEach((x, i) => { const r = ev(x.use, x.step2, x.gates, x.mh, x.qa, x.continued);
    const a = [x.verdict, x.score, x.verdict === 'Soft stop' ? [] : x.caps, x.notes], b = [r.verdict, r.score, r.caps, r.notes];
    if (eq(a, b)) same++; else if (i < 2000) console.log('  random differs #' + i, JSON.stringify(a), JSON.stringify(b)); });
  ok(same === RX.length && RX.length === 1200, 'random mixed checks equal sim_v3 on verdict, score, caps and notes: ' + same + '/' + RX.length); }

// ---------- 4. invariants (§9) ----------
ok(inv.blockerNoBad.length === 0, 'every blocker answered No gives Not ready (' + inv.blockerNo + ' runs) ' + inv.blockerNoBad.slice(0, 5));
ok(inv.nonBlockerNoBad.length === 0, 'a single non-blocker No never gives Not ready (' + inv.nonBlockerNo + ' runs) ' + inv.nonBlockerNoBad.slice(0, 5));
ok(inv.softBlockerBad.length === 0, 'a blocker answered Planned or Don\'t know yet never gives Ready (' + inv.softBlocker + ' runs) ' + inv.softBlockerBad.slice(0, 5));
ok(inv.naBad.length === 0, 'Doesn\'t apply: accepted never changes the verdict vs Yes; rejected or contradicted never Ready, contradicted counts as Don\'t know yet and always shows the note (' + inv.naOk + ' runs) ' + inv.naBad.slice(0, 5));
ok(inv.allYesBad.length === 0, 'all Yes: Ready unless capped, then Almost ready (' + inv.allYes + ' runs)');
ok(inv.actionsBad.length === 0, 'every non-Ready result has a reason and 1 to 3 actions with owners (' + inv.actions + ' runs) ' + inv.actionsBad.slice(0, 3));
/* no dead question: every question is visible under some gate combination */
const seen = {}; Object.entries(FX).forEach(([uid, rws]) => rws.forEach(([, v]) => v.forEach(id => { seen[uid + '|' + id] = 1; })));
const dead = D.use_cases.flatMap(u => u.questions.filter(q => !seen[u.id + '|' + q.id]).map(q => q.id));
ok(dead.length === 0, 'no dead question (' + D.use_cases.reduce((a, u) => a + u.questions.length, 0) + ' checked) ' + dead.slice(0, 5));
/* Doesn't apply offered only on m2 and m4 */
ok(D.must_haves.every(m => eq(R3.answerOptions(D, 'mh', m.id).map(o => o.key), m.na ? ['yes', 'planned', 'no', 'dk', 'na'] : ['yes', 'planned', 'no', 'dk'])) && ['m2', 'm4'].every(id => D.must_haves.find(m => m.id === id).na) && D.must_haves.filter(m => m.na).length === 2, 'Doesn\'t apply is offered only on m2 and m4');
ok(eq(R3.answerOptions(D, 'q', 'rm-1.te1').map(o => o.label), ['Yes', 'Planned', 'No', 'Don\'t know yet']) && eq(R3.answerOptions(D, 'step2').map(o => o.label), ['Yes', 'No', 'Don\'t know yet']), 'answer labels from the data');
/* a stored Doesn't apply anywhere else counts as Don't know yet */
{ const ga = { G_ACT: 'suggests' }, qa = Object.fromEntries(R3.visible(D, 'rm-1', ga).map(q => [q.id, 'yes']));
  const r = ev('rm-1', S2_YES, ga, Object.assign({}, MH_YES, { m1: 'na' }), Object.assign({}, qa, { 'rm-1.te1': 'na' }));
  ok(r.items.find(i => i.id === 'm1').answer === 'dk' && r.items.find(i => i.id === 'rm-1.te1').answer === 'dk' && r.verdict !== 'Ready' && r.notes.length === 0, 'Doesn\'t apply on m1 or on a use-case question counts as Don\'t know yet, without a note');
  const u = ev('rm-1', S2_YES, ga, Object.assign({}, MH_YES, { m3: 'maybe' }), qa);
  ok(u.items.find(i => i.id === 'm3').answer === 'dk', 'an unknown stored answer counts as Don\'t know yet'); }

// ---------- 5. behaviour the page relies on ----------
const Y = (use, ga) => Object.fromEntries(R3.visible(D, use, ga).map(q => [q.id, 'yes']));
{ // soft stop and Continue anyway
  const ga = { G_ACT: 'suggests' }, qa = Y('rm-1', ga);
  const s = ev('rm-1', Object.assign({}, S2_YES, { s1: 'no' }), ga, MH_YES, qa);
  ok(s.verdictKey === 'stop' && s.score === null && s.reason === D.step2[0].no_message && s.top3.length === 1, 'soft stop: no score, the stop message from the data as reason, one action');
  const s2 = ev('rm-1', Object.assign({}, S2_YES, { s2: 'no' }), ga, MH_YES, qa);
  ok(s2.reason === D.step2[1].no_message && eq(R3.softStop(D, { s1: 'no', s2: 'no' }).ids, ['s1', 's2']) && R3.softStop(D, S2_YES) === null && R3.softStop(D, { s3: 'no' }) === null, 'soft stop on s1 or s2 only');
  const c1 = ev('rm-1', Object.assign({}, S2_YES, { s1: 'no' }), ga, MH_YES, qa, true), c2 = ev('rm-1', Object.assign({}, S2_YES, { s2: 'no' }), ga, MH_YES, qa, true);
  ok(c1.verdict === 'Almost ready' && c1.reason === 'You said rules may do this job.' && c2.reason === 'You said the gain may be small.', 'Continue anyway: Almost ready with the §4 reasons');
  ok(ev('rm-1', S2_YES, ga, MH_YES, qa, true).verdict === 'Ready', 'judgement call: a stale "continued" flag without a soft stop does not cap');
  const h = ev('rm-1', Object.assign({}, S2_YES, { s4: 'dk' }), ga, MH_YES, qa);
  ok(h.verdict === 'Almost ready' && h.top3.some(a => a.from === 's4' && /^Find out: /.test(a.text)), 's3-s5 not Yes: capped, with a top action');
  const blank = ev('rm-1', {}, {}, {}, {});
  ok(blank.verdict === 'Not enough info' && blank.score === 0, 'nothing answered: Not enough info');
  ok(ev(null, S2_YES, {}, MH_YES, {}).none === true, 'no use case chosen: the None of these fits fallback');
}
{ // contradiction note and gates
  const r = ev('sm-1', S2_YES, { G_PAID: 'no', G_LINK: 'yes' }, Object.assign({}, MH_YES, { m2: 'na' }), Y('sm-1', { G_PAID: 'no', G_LINK: 'yes' }));
  ok(eq(R3.contradictions(D, 'sm-1', { G_PAID: 'no', G_LINK: 'yes' }, { m2: 'na', m4: 'na' }).map(c => c.id), ['m2', 'm4']) && eq(R3.contradictions(D, 'sm-1', { G_PAID: 'yes', G_LINK: 'no' }, { m2: 'na', m4: 'na' }), []), 'contradictions() names the must-haves a gate answer contradicts');
  ok(r.contradictions[0].note === D.must_haves[1].contradiction_note && r.top3.some(a => a.from === 'm2' && /^Find out: /.test(a.text)), 'a contradicted Doesn\'t apply shows its note and becomes a Find out action');
  ok(eq(ids(R3.askedGates(D, 'none')), D.none_fits.gates) && R3.askedGates(D, 'fo-7').length === 1 && D.use_cases.every(u => { const n = R3.askedGates(D, u.id).length; return n >= 1 && n <= 2; }), 'step 5 asks 1 or 2 gates per use case, the five library gates for None fits');
  const nfA = R3.evaluate(D, { use: 'gm-4', step2: S2_YES, gates: { 'gm4-group': 'one' } }).notFit, nfB = R3.evaluate(D, { use: 'gm-4', step2: S2_YES, gates: { 'gm4-group': 'group' } }).notFit;
  ok(nfA.startsWith('This use case is for hotel groups.') && nfB === '' && !('notFit' in R3) && !('task' in R3), 'not_fit text from the data (through evaluate; the unused notFit and task exports are gone, clean-up D5)');
  const gk = ev('gx-2', S2_YES, { G_ACT: 'dk' }, MH_YES, Y('gx-2', { G_ACT: 'dk' }));
  ok(gk.top3[0].text === D.gate_library.G_ACT.options[2].effects.action, 'a gate answered Don\'t know yet adds its own action text');
  const un = ev('gx-2', S2_YES, {}, MH_YES, Y('gx-2', {}));
  ok(un.verdict === 'Almost ready' && un.top3.some(a => a.text === D.gate_library.G_ACT.options[2].effects.action), 'an unanswered gate caps and adds the Don\'t know yet action');
}
const q_n1 = UC => UC['hr-1'].questions.find(x => x.id === 'hr-1.n1').text.replace(/\?\s*$/, '');
{ // sensitive flag, actions order, de-duplication, owners
  const r = ev('hr-1', S2_YES, { G_LINK: 'yes', 'hr1-person': 'yes' }, Object.assign({}, MH_YES, { m3: 'no' }), Object.assign(Y('hr-1', { G_LINK: 'yes', 'hr1-person': 'yes' }), { 'hr-1.n1': 'no' }));
  ok(r.sensitive && r.flag === D.texts.sensitive_flag && r.top3[0].text === 'Ask an adviser before a pilot.' && r.top3[0].ownerLabel === 'General manager', 'sensitive flag: the fixed text, and action #1 for the General manager');
  ok(r.top3[1].from === 'm3' && r.top3[2].from === 'hr-1.n1' && r.top3[1].text === 'Make sure: ' + D.must_haves[2].text.replace(/\?$/, ''), 'then blockers answered No, in question order, as "Make sure:" tasks');
  /* v3.0.2 (owner decision, 25 Nov 2026): was "2 Must be Yes questions are No: …" */
  ok(r.reason === 'Needed before a pilot: ' + D.must_haves[2].title + '; ' + q_n1(UC) + ' (answered No).', 'reason names the blockers answered No: ' + r.reason);
  const q = UC['hr-1'].questions.find(x => x.id === 'hr-1.n1');
  ok(r.top3[2].owner === q.owner && r.top3[2].ownerLabel === D.labels.owners[q.owner], 'a question\'s action carries its own owner');
  ok(new Set(r.actions.map(a => a.text)).size === r.actions.length, 'actions are de-duplicated');
  const s = ev('hr-2', S2_YES, { 'hr2-mode': 'screen' }, MH_YES, Y('hr-2', { 'hr2-mode': 'screen' }));
  ok(s.sensitive && s.verdict === 'Almost ready' && s.reason === 'This area involves people\'s personal data or jobs and has extra rules.', 'always-sensitive use case: Almost ready, the flag\'s first sentence as reason');
  const dkq = ev('rm-1', S2_YES, { G_ACT: 'suggests' }, MH_YES, Object.assign(Y('rm-1', { G_ACT: 'suggests' }), { 'rm-1.fi1': 'dk' }));
  ok(dkq.actions.some(a => a.from === 'rm-1.fi1' && /^Find out: /.test(a.text)), 'a nice-to-have Don\'t know yet still becomes a Find out action in the full list');
}
{ // v3.0.1 clean-up H3: answers named after Object.prototype members count as Don't know yet, never NaN (cleanup3 U1)
  const qa = Y('rm-1', { G_ACT: 'suggests' }), q0 = Object.keys(qa)[0];
  const bad = ev('rm-1', S2_YES, { G_ACT: 'suggests' }, Object.assign({}, MH_YES, { m1: 'constructor' }), Object.assign({}, qa, { [q0]: 'toString' }));
  const dk = ev('rm-1', S2_YES, { G_ACT: 'suggests' }, Object.assign({}, MH_YES, { m1: 'dk' }), Object.assign({}, qa, { [q0]: 'dk' }));
  ok(Number.isFinite(bad.score) && bad.score === dk.score && bad.verdict === dk.verdict && bad.dk === dk.dk, 'H3: "constructor" / "toString" answers count as Don\'t know yet (score ' + bad.score + ', ' + bad.verdict + ')');
}
{ // council v3.0 BUILD NOW 2: the reason names at most two items
  const qa = Y('res-1', {}), no = Object.assign({}, MH_YES, { m1: 'no', m3: 'no', m5: 'no', m6: 'no' });
  const r = ev('res-1', S2_YES, {}, no, qa);
  /* v3.0.2: council v3.0.1 BUILD NOW 4 ("; and N more") and the owner decision ("Needed before a pilot: …") */
  ok(r.verdict === 'Not ready' && r.reason === 'Needed before a pilot: ' + D.must_haves[0].title + '; ' + D.must_haves[2].title + '; and 2 more (answered No; see the plan below).', 'BUILD NOW 2/4: 4 blockers No → two named, "; and 2 more (answered No; see the plan below)": ' + r.reason);
  const two = ev('res-1', S2_YES, {}, Object.assign({}, MH_YES, { m1: 'no', m3: 'no' }), qa);
  ok(two.reason === 'Needed before a pilot: ' + D.must_haves[0].title + '; ' + D.must_haves[2].title + ' (answered No).', 'two blockers No: both named, no "more": ' + two.reason);
  const held = ev('rm-1', Object.assign({}, S2_YES, { s3: 'dk', s4: 'no', s5: 'dk' }), { G_ACT: 'suggests' }, MH_YES, Y('rm-1', { G_ACT: 'suggests' }));
  ok(held.reason === 'In step 2 you did not answer Yes to: ' + D.step2[2].title + '; ' + D.step2[3].title + '; and 1 more (see the plan below).', 'step-2 list capped at two, "; and 1 more": ' + held.reason);
  const nine = ev('res-1', S2_YES, {}, Object.fromEntries(D.must_haves.map((m, i) => [m.id, i < 9 ? 'no' : 'yes'])), qa);
  ok(/^Needed before a pilot: [^;]+; [^;]+; and \d+ more \(answered No; see the plan below\)\.$/.test(nine.reason) && nine.reason.includes(D.must_haves[1].title + '; and'), 'BUILD NOW 4: a title with its own comma stays one item ("…approved; and 7 more"): ' + nine.reason);
  const soft = ev('rm-1', S2_YES, { G_ACT: 'suggests' }, Object.assign({}, MH_YES, { m5: 'planned' }), Y('rm-1', { G_ACT: 'suggests' }));
  ok(soft.verdict === 'Almost ready' && soft.reason === 'Needed before a pilot: ' + D.must_haves[4].title + ' (not Yes yet).', 'owner decision: a blocker Planned is named as Needed before a pilot: ' + soft.reason);
  const ready = ev('rm-1', S2_YES, { G_ACT: 'suggests' }, MH_YES, Y('rm-1', { G_ACT: 'suggests' }));
  ok(ready.verdict === 'Ready' && !/Must be Yes/.test(JSON.stringify(ready)) && ready.top3.every(a => a.need === false || a.need === true), 'no "Must be Yes" left in the rules\' texts');
}
done();
