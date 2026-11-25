// v2.7.0, prompt §7 test 3: scoring unchanged. The v2.6.1 worked examples (the council's patterns A to I, tests/v25.test.mjs) are
// recomputed for every use case with its own question count against an independent oracle (the v2.6.1 formula, cut-offs and verdict
// precedence written out here), and with the same proportion of Yes / Planned / No / Don't know yet the verdict equals v2.6.1's.
// Run: node tools/readiness-2-questions/tests/scoring.test.mjs
import { load, data, tester, finished } from './load.mjs';
const { L, F } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('scoring');
const P = { y: 2, pl: 1, n: 0, k: 0 };
function oracle(r) {
  const mv = F.MUST_IDS.map(id => r.A[id]), tv = r.use && r.use !== 'none' ? TQ.uses[r.use].qs.map(q => r.T[q.id]) : [];
  const all = mv.concat(tv), total = all.length, unk = all.filter(v => !v || v === 'k').length, pts = all.reduce((a, v) => a + (P[v] || 0), 0), max = 2 * total;
  const mustYes = mv.filter(v => v === 'y').length, tk = tv.filter(v => v && v !== 'k'), held = [];
  let level;
  if (unk * 2 > total) level = 'noinfo';
  else if (mv.includes('n') || pts * 2 < max || mustYes * 2 < mv.length) level = 'notready';
  else if (mustYes === mv.length && pts * 4 >= 3 * max && unk * 4 < total) {
    if (TQ.uses[r.use] && TQ.uses[r.use].sensitive) held.push('sensitive');
    if (['q2', 'q3', 'q4', 'q5'].some(q => r.Q[q] === 'n')) held.push('carried');
    if (Object.values(r.Q).includes('u')) held.push('notsure');
    if (tv.length && tk.filter(v => v === 'y').length * 2 < tk.length) held.push('tail');
    if (r.use === 'none') held.push('none');
    level = held.length ? 'almost' : 'ready';
  } else level = 'almost';
  return { level, pct: level === 'noinfo' ? null : Math.floor(100 * pts / max), held };
}
const mk = (use, o) => { const r = finished(F, D, use); if (o.Q) Object.assign(r.Q, o.Q); if (o.A) F.MUST_IDS.forEach(id => { r.A[id] = o.A; }); if (o.A1) Object.assign(r.A, o.A1); if (o.T && use !== 'none') TQ.uses[use].qs.forEach((q, i) => { r.T[q.id] = typeof o.T === 'function' ? o.T(i) : o.T; }); return r; };
const PAT = { A: { A: 'pl' }, B: { T: 'pl' }, C: {}, D: { Q: { q5: 'n' } }, E: { Q: { q1: 'u' } }, F: { T: 'k' }, H: { A1: { m4: 'n' } }, I: { Q: { q4: 'n' } } };
let n = 0, same = 0;
for (const use of Object.keys(TQ.uses)) for (const [k, o] of Object.entries(PAT)) {
  const r = mk(use, o), e = L.evaluate(r, TQ), x = oracle(r); n++;
  if (e.level === x.level && e.pct === x.pct && JSON.stringify(e.held) === JSON.stringify(x.held)) same++; else console.log('differs', use, k, e.level, e.pct, e.held, x);
}
ok(same === n, 'patterns A to I for all 99 use cases equal the v2.6.1 formula, cut-offs and precedence (' + same + ' of ' + n + ')');
// v2.6.1's own headlines for gx-2 (8 questions then) are reproduced by every 8-question non-sensitive use case
const V261 = { A: ['notready', 72], B: ['almost', 77], C: ['ready', 100], D: ['almost', 100], E: ['almost', 100], F: ['almost', 55], H: ['notready', 94], I: ['almost', 100] };
const eight = Object.keys(TQ.uses).filter(u => TQ.uses[u].qs.length === 8 && !TQ.uses[u].sensitive);
eight.forEach(use => Object.entries(V261).forEach(([k, [lv, pct]]) => { const e = L.evaluate(mk(use, PAT[k]), TQ); ok(e.level === lv && e.pct === pct, use + ' ' + k + ': ' + lv + ' ' + pct + '% as v2.6.1 showed for gx-2 (got ' + e.level + ' ' + e.pct + ')'); }));
ok(eight.length >= 10, eight.length + ' eight-question use cases checked against v2.6.1\'s numbers');
// same proportion → same verdict and score, whatever the count: a two-answer cycle laid over every question asked (10 must-haves, then
// the use case's own), so the proportion over the whole set is the same at 6, 8, 10 and 12 questions (16, 18, 20, 22 in all)
const byCount = {}; Object.keys(TQ.uses).filter(u => !TQ.uses[u].sensitive).forEach(u => { const c = TQ.uses[u].qs.length; if (!byCount[c]) byCount[c] = u; });
const counts = [6, 8, 10, 12].filter(c => byCount[c]);
[['y', 'y'], ['y', 'pl'], ['y', 'k'], ['pl', 'pl'], ['y', 'n'], ['k', 'k'], ['pl', 'k']].forEach(mix => {
  const res = counts.map(c => { const use = byCount[c], r = finished(F, D, use); F.MUST_IDS.forEach((id, i) => { r.A[id] = mix[i % 2]; }); TQ.uses[use].qs.forEach((q, i) => { r.T[q.id] = mix[(10 + i) % 2]; }); const e = L.evaluate(r, TQ); return e.level + ' ' + e.pct; });
  ok(res.every(x => x === res[0]), 'mix ' + mix.join('/') + ' over every question: the same verdict and score at ' + counts.join(', ') + ' questions (' + res[0] + ')');
});
done();
