// "Do you need AI?" v2 rules (src/logic.js): the five questions, the score in % and the verdict (rules v2.5; the v2.1 switches: tests/v21.test.mjs;
// the v2.5 caps and holds, owner O1 to O4: tests/v25.test.mjs).
// Run: node tools/readiness-2/tests/logic.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, tester, finished, root } from './load.mjs';
const { C, L, F, RC, P } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('logic');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------- The five questions: all 3^5 = 243 combinations against an independent reading of the research ----------
function oracle(q) {
  // v2.6: Q1 Yes stops (fixed rules can do it); Q4 No is its own verdict ("exact"), ordered Q2 > Q3 > Q4 > Q5; no "assist"
  if (q.q1 === 'y') return { key: 'stop', carried: [], find: [] };
  const carried = ['q2', 'q3', 'q4', 'q5'].filter(k => q[k] === 'n');
  const find = ['q1', 'q2', 'q3', 'q4', 'q5'].filter(k => q[k] === 'u');
  let key;
  if (q.q2 === 'n') key = 'worth';
  else if (q.q3 === 'n') key = 'data';
  else if (q.q4 === 'n') key = 'exact';
  else if (q.q5 === 'n') key = 'success';
  else if (find.length) key = 'find';
  else key = 'go';
  return { key, carried, find };
}
const VALS = ['y', 'n', 'u'];
let combos = 0, stops = 0;
for (const a of VALS) for (const b of VALS) for (const c of VALS) for (const d of VALS) for (const e of VALS) {
  const q = { q1: a, q2: b, q3: c, q4: d, q5: e }, v = L.verdict(q), o = oracle(q), tag = JSON.stringify(q);
  combos++;
  ok(v.key === o.key, 'verdict ' + tag + ' → ' + o.key + ' (got ' + v.key + ')');
  ok(eq(v.carried.map(x => x.id), o.carried), 'carried order ' + tag);
  ok(eq(v.find.map(x => x.id), o.find), 'to find out ' + tag);
  ok(v.complete === true, 'complete ' + tag);
  ok(v.head === C.VERDICT[o.key], 'headline wording ' + tag);
  if (a === 'y') { stops++; ok(v.stop && v.carried.length === 0 && v.find.length === 0, 'Q1 Yes stops (v2.6) ' + tag); }
  else ok(!v.stop, 'only Q1 Yes stops ' + tag);
  ok(v.second === (o.key === 'data' && q.q5 === 'n' ? 'Then define success.' : ''), 'second line only when Q3 and Q5 are No ' + tag);
  ok(v.q1Unsure === (a === 'u'), 'Q1 Not sure shows the other outcome ' + tag);
  if (Object.values(q).includes('u')) ok(v.key !== 'go', 'Not sure never counts as Yes ' + tag);
}
ok(combos === 243 && stops === 81, 'all 243 combinations checked, 81 of them stop');

// ---------- wording (owner, 24 Nov 2026) ----------
ok(eq(C.QUESTIONS.map(q => q.q), [
  'Can each case be fixed with an “if this, then that” rule?',
  'Is this task frequent or costly enough to be worth improving?',
  'Are there past examples of this task, such as emails, bookings, or past photos, that show what a good result looks like?',
  'If the tool makes an occasional mistake, can it be caught or fixed before it causes harm?',
  'Have you chosen what result should improve, and do you know where it stands today?']), 'the five questions (v2.6: Q1, Q3 and Q4 are the owner\'s new texts; Q2 is the owner\'s own; Q5 the team\'s plain wording)');
ok(eq(C.QUESTIONS.map(q => q.title), ['Complex judgement', 'Return', 'Information to learn from', 'Safety net', 'Proof']) && C.QUESTIONS.map(q => q.title[0]).join('') === 'CRISP', 'titles spell C-R-I-S-P');
C.QUESTIONS.forEach(q => { ok(q.q.split(/\s+/).length <= ({ q3: 22, q4: 17 }[q.id] || 15) && /\?$/.test(q.q) && !/\?./.test(q.q), q.id + ': one short sentence'); ok(q.whyShort && q.yesIf && q.noIf && q.yes && q.no && q.why, q.id + ': the "Why this matters" parts are all there'); });
ok(C.QUESTIONS[0].guard && !C.QUESTIONS.slice(1).some(q => q.guard), '"Not sure?" box on Q1 only');
ok(C.STOP.head === 'This is not suitable for AI.', 'stop heading');
ok(C.HONEST === 'Nobody checks your answers. An answer that isn’t true only hides a problem you will meet later.', 'honesty line');
ok(C.AS_OF === '25 Nov 2026', 'content date (v2.7.0)');
const partial = L.verdict({ q1: 'n', q2: 'y' }); ok(partial.key === 'open' && !partial.complete, 'not all answered → open');
ok(L.verdict({ q1: 'y' }).key === 'stop', 'Q1 Yes (v2.6) stops even when the rest is blank');

// ---------- must-haves ----------
ok(C.MUSTS.length === 10 && C.MUSTS.length <= 10, 'at most 10 must-haves');
ok(eq(C.MUSTS.map(m => m.id), F.MUST_IDS) && eq(L.MUST_IDS, F.MUST_IDS), 'flow and content agree on the must-have ids');
const gates = C.MUSTS.map(m => m.gate || '').join(', ').split(', ').filter(Boolean).sort();
ok(eq(gates, ['D5', 'F1', 'F2', 'O1', 'P1', 'T1']), 'the six D6 gates of the workbook\'s README are all covered: ' + gates);
C.MUSTS.forEach(m => {
  ok(/\?$/.test(m.q) && !/\?./.test(m.q) && m.q.split(/\s+/).length <= 26, m.id + ': one plain question');
  ok(m.name && m.why && m.good && m.act && C.WHO[m.who], m.id + ': title, why, what counts as Yes, action, who');
  ok((m.ev.length >= 1 || ['m6', 'm10'].includes(m.id)) && m.ev.every(e => e[0] && e[1] && /\d{4}|version/.test(e[1])), m.id + ': evidence with source (and date or version); v2.7.0: m6 and m10 lost their only evidence line (rules from authorities)');
  const sh = L.shareLines(m, TQ);
  ok(sh.length === m.blocks.length && sh.every(t => /needed for \d+ of 90 use cases in the team’s resource analysis, Nov 2026/.test(t) && /team judgement/.test(t)), m.id + ': share from the Framework matrix, labelled as the team\'s analysis');
  ok(!/\b[PFTDOG]\d\b/.test(m.q + m.name + m.why + m.good + m.act), m.id + ': no internal code in hotel-facing words');
});
ok(TQ.matrixTotal === 90 && TQ.blocks.length === 20, 'matrix: 20 blocks over 90 use cases (computed from the sheet)');
ok(L.shareLines(L.MUST.m1, TQ)[0].includes('needed for 90 of 90') && /foundation layer/.test(L.shareLines(L.MUST.m1, TQ)[0]), 'm1: 90 of 90, foundation layer');
const shareOf = id => L.MUST[id].blocks.length ? TQ.blocks.find(b => b.name === L.MUST[id].blocks[0]).n : null;
ok(eq(['m1', 'm2', 'm3', 'm4', 'm5'].map(shareOf), [90, 77, 58, 58, null]) && eq(['m6', 'm7', 'm8', 'm9', 'm10'].map(shareOf), [59, 48, 35, 30, 30]), 'order: the gates by share, then the rest by share');
ok(C.MUSTS[2].q === 'Has the person who approves spending agreed the number (KPI) this tool must improve, with today’s figure and the target?', 'KPI must-have in the team\'s plain wording (v2.2)');
ok(C.MUSTS[3].q === 'Can new AI tools easily be plugged in to your existing infrastructure?', 'systems must-have: owner wording of 24 Nov 2026');
ok(L.systemsFor({}).fallback && L.systemsFor({ dept: 'fo' }).text === C.SYSTEMS.fo && L.systemsFor({ dept: 'fo', use: 'none' }).fallback, 'systems examples: generic before the department is known, by department after');
ok(eq(Object.keys(C.SYSTEMS).sort(), D.cat.depts.map(d => d.id).sort()), 'systems examples for every catalogue department');

// ---------- score and verdict ----------
const T = L.T;
ok(eq([T.READY, T.ALMOST, T.UNKNOWN_READY, T.UNKNOWN_NOINFO], [75, 50, 25, 50]) && eq(L.POINTS, { y: 2, pl: 1, n: 0 }), 'cut-offs and points in one block');
/* Build a check from lists of answers: musts (10) and tailored (the use case's questions, in order). */
function mk(use, musts, tail) {
  const r = finished(F, D, use);
  F.MUST_IDS.forEach((id, i) => { r.A[id] = musts[i] || 'y'; });
  if (use && use !== 'none') TQ.uses[use].qs.forEach((q, i) => { r.T[q.id] = (tail && tail[i]) || 'y'; });
  return r;
}
const rep = (v, n) => Array(n).fill(v);
// independent arithmetic (rules v2.1: "Don't know yet" counts as 0 points; no score under "Not enough information yet";
// no top verdict for a use labelled high-risk or flagged for sensitive data, or with a No carried from questions 2 to 5)
function expect(rec) {
  // v2.3: Partly (p) and Doesn't apply (na) are no longer offered; a saved one counts as not answered
  const P = { y: 2, pl: 1, n: 0, k: 0 }, gone = v => v === 'p' || v === 'na' ? '' : v; let pts = 0, max = 0, total = 0, unk = 0;
  const mv = F.MUST_IDS.map(id => gone(rec.A[id])), tv = rec.use && rec.use !== 'none' ? TQ.uses[rec.use].qs.map(q => gone(rec.T[q.id])) : [];
  mv.concat(tv).forEach(v => { total++; if (v === 'k' || !v) unk++; pts += P[v || 'k']; max += 2; });
  const allYes = mv.every(v => v === 'y'), anyNo = mv.some(v => v === 'n'), ratio = max ? pts / max : null;
  const legal = !!(rec.use && rec.use !== 'none' && TQ.uses[rec.use].sensitive); // v2.7.0: the data's sensitive flag only
  // v2.6: a No on Q2 to Q5 holds (v2.5 left Q4 out, O3); any Not sure holds (O2); "Almost ready" needs half the must-haves at Yes and the top verdict
  // half the answered tailored questions at Yes (O1); "None of these fits" is "Almost ready" at best (O4)
  const carriedNo = ['q2', 'q3', 'q4', 'q5'].some(q => rec.Q[q] === 'n'), notSure = ['q1', 'q2', 'q3', 'q4', 'q5'].some(q => rec.Q[q] === 'u');
  const mustYes = mv.filter(v => v === 'y').length, tKnown = tv.filter(v => v === 'y' || v === 'pl' || v === 'n'), tailFew = tKnown.filter(v => v === 'y').length * 2 < tKnown.length;
  let level;
  if (unk / total > 0.5) level = 'noinfo';
  else if (anyNo || ratio < 0.5 || mustYes * 2 < mv.length) level = 'notready';
  else if (allYes && ratio >= 0.75 && unk / total < 0.25 && !legal && !carriedNo && !notSure && !tailFew && rec.use !== 'none') level = 'ready';
  else level = 'almost';
  return { level, pct: level === 'noinfo' ? null : Math.floor(100 * pts / max), known: total - unk, total, pts, max };
}
function same(rec, tag) { const e = L.evaluate(rec, TQ), x = expect(rec); ok(e.level === x.level && e.pct === x.pct && e.counts.known === x.known && e.counts.total === x.total, tag + ': ' + JSON.stringify(x) + ' got ' + e.level + ' ' + e.pct); return e; }
const U = 'fo-4', NQ = TQ.uses[U].qs.length; // v2.7.0: fo-4 has 8 questions, as gx-2 had in v2.6.1, so every edge keeps its numbers
ok(NQ === 8 && !TQ.uses[U].sensitive, 'fo-4 has 8 questions and no sensitive flag (fixture for the edges; gx-2 now has 12)');
let e = same(mk(U, [], []), 'all Yes'); ok(e.level === 'ready' && e.pct === 100 && !e.cap, 'all Yes → Ready to start a pilot, 100%');
// 75% edge with every must-have Yes: 18 questions, 36 points possible; 27 = 75%, 26 = 72%
// (v2.5: the top verdict also needs half the answered tailored questions at Yes, so the 75% set has 3 Yes of 4 answered)
e = same(mk(U, [], ['y', 'y', 'y', 'pl', 'k', 'k', 'k', 'k']), '27 of 36'); ok(e.pts === 27 && e.max === 36 && e.pct === 75 && e.level === 'ready', 'exactly 75% → Ready');
e = same(mk(U, [], ['n', 'n', 'n', 'n', 'pl', 'y', 'y', 'y']), '27 of 36, 3 of 8 tailored Yes'); ok(e.pct === 75 && e.level === 'almost' && e.held.join() === 'tail', 'v2.5: 75% with fewer than half the tailored questions at Yes is held back');
e = same(mk(U, [], ['n', 'n', 'n', 'n', 'n', 'y', 'y', 'y']), '26 of 36'); ok(e.pct === 72 && e.level === 'almost', '72% → Almost ready');
// display never rounds up over a cut-off: 74.x% shows 74
e = L.evaluate(mk('rm-3', [], ['n', 'n', 'n', 'n', 'y', 'y']), TQ); ok(e.pts === 24 && e.max === 32 && e.pct === 75, 'rm-3 24/32 = 75%');
e = same(mk('rm-3', ['y','y','y','y','y','y','y','y','y','y'], ['n','n','n','n','pl','pl']), 'rm-3 22/32'); ok(e.pct === 68 && e.level === 'almost', '68.75% is shown as 68%, Almost ready (v2.7.0: rm-3, 6 questions; rm-1 now has 7)');
// 50% edge (no must-have at No; v2.5: half the must-haves at Yes): 5 Yes + 5 Planned = 15 of 20; tailored 3 Planned = 3 of 16 → 18/36 = 50%
e = same(mk(U, rep('y', 5).concat(rep('pl', 5)), rep('pl', 3).concat(rep('n', 5))), '50%'); ok(e.pct === 50 && e.level === 'almost', 'exactly 50% → Almost ready');
e = same(mk(U, rep('y', 5).concat(rep('pl', 5)), rep('pl', 2).concat(rep('n', 6))), '47%'); ok(e.pct === 47 && e.level === 'notready', 'below 50% → Not ready yet');
e = same(mk(U, rep('pl', 10), rep('pl', 8)), 'all Planned, 50%'); ok(e.pct === 50 && e.level === 'notready' && e.kind === 'fewMust', 'v2.5 (O1): 50% with no must-have at Yes → Not ready yet (was Almost ready)');
// cap by must-haves
['pl', 'k'].forEach(v => { e = same(mk(U, [v], []), 'one must-have ' + v); ok(e.level === 'almost' && e.cap && e.pct === (v === 'k' ? 94 : 97), 'a must-have at ' + v + ' caps the result at Almost ready even at ' + e.pct + '%'); });
e = same(mk(U, ['n'], []), 'one must-have No'); ok(e.level === 'notready' && e.pct === 94, 'any must-have at No → Not ready yet, even at 94%');
for (let i = 0; i < 10; i++) { const m = rep('y', 10); m[i] = 'pl'; ok(L.evaluate(mk(U, m, []), TQ).level !== 'ready', 'top verdict impossible while ' + F.MUST_IDS[i] + ' is not Yes'); }
// unknown-heavy
e = same(mk(U, [], ['k', 'k', 'k', 'k', 'y', 'y', 'y', 'y']), '4 of 18 unknown'); ok(e.level === 'ready' && e.counts.unknown === 4, '4 of 18 unknown (22%) → still Ready');
e = same(mk(U, [], ['k', 'k', 'k', 'k', 'k', 'y', 'y', 'y']), '5 of 18 unknown'); ok(e.level === 'almost' && e.pct === 72 && e.pts === 26 && e.max === 36, '5 of 18 unknown (28%): 26 of 36 points = 72% (v2.1: unknown scores 0), not Ready');
e = same(mk('rm-3', [], ['k', 'k', 'k', 'k', 'y', 'y']), '4 of 16 unknown'); ok(e.level === 'almost', 'exactly a quarter unknown is not "fewer than a quarter"');
e = same(mk(U, ['y', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'], []), '9 of 18 unknown'); ok(e.level !== 'noinfo' && e.pct === 50, 'exactly half unknown is not "more than half" (v2.5: Not ready yet, 1 of 10 must-haves at Yes)');
e = same(mk(U, rep('k', 10), []), '10 of 18 unknown'); ok(e.level === 'noinfo', 'more than half unknown → Not enough information yet');
e = same(mk(U, rep('k', 10), rep('k', 8)), 'all unknown'); ok(e.level === 'noinfo' && e.pct === null && L.scoreHead(e) === 'No score yet: you answered 0 of 18 questions.', 'nothing known → no score, Not enough information yet');
e = same(mk(U, ['n'].concat(rep('k', 9)), rep('k', 8)), 'No plus unknowns'); ok(e.level === 'noinfo', 'more than half unknown comes first, even with a must-have at No');
// v2.3: a saved "Doesn't apply" is no longer left out: it counts as not answered (0 points, still asked)
e = same(mk(U, [], ['na', 'na', 'y', 'y', 'y', 'y', 'y', 'y']), 'two old na'); ok(e.counts.total === 18 && e.counts.unknown === 2 && e.pct === 88 && !('na' in e.counts), 'an old "Doesn\'t apply" counts as not answered');
e = same(mk(U, ['p'], ['p']), 'two old p'); ok(e.counts.unknown === 2 && e.pts === 32 && e.level === 'almost' && e.cap && !('partly' in e.counts), 'an old "Partly" counts as not answered and caps a must-have');
// None of these fits: must-haves only
e = same(mk('none', [], []), 'none all yes'); ok(e.mustOnly && e.counts.total === 10 && e.level === 'almost' && e.held.join() === 'none', '"None of these fits": must-haves only; v2.5 (O4): Almost ready at best (was Ready)');
e = same(mk('none', ['pl', 'pl', 'pl', 'pl', 'pl', 'n'], []), 'none with a No'); ok(e.level === 'notready' && e.mustOnly, 'none + a must-have No → Not ready yet');
ok(L.resultModel(mk('none', [], []), { cat: D.cat, TQ }).mustOnly === C.MUST_ONLY && /must-haves only/.test(C.MUST_ONLY), 'the result says it rests on the must-haves only');
// Planned scores 1 point (v2.3: Partly is gone)
ok(L.evaluate(mk(U, [], rep('pl', 8)), TQ).pts === 28 && L.POINTS.pl === 1 && !('p' in L.POINTS), 'Planned scores 1 point; there is no Partly');
// random sets against the independent arithmetic
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, pick = a => a[Math.floor(rnd() * a.length)];
const uses = Object.keys(TQ.uses); let nr = 0; const seen = {};
for (let i = 0; i < 1500; i++) {
  const use = i % 9 === 0 ? 'none' : pick(uses), w = pick([['y'], ['y', 'y', 'y', 'pl', 'pl'], ['y', 'pl', 'n', 'k'], ['k', 'k', 'k', 'y', 'n'], ['y', 'y', 'k'], ['pl', 'n']]);
  // every fourth set also carries old answers (p, na), which must count as not answered
  const r = mk(use, F.MUST_IDS.map(() => pick(w.concat(i % 4 ? [] : ['p']))), use === 'none' ? [] : TQ.uses[use].qs.map(() => pick(w.concat(i % 4 ? [] : ['na', 'p']))));
  const ev = same(r, 'random ' + i); nr++; seen[ev.level] = 1;
  ok(!(ev.level === 'ready' && !ev.must.allYes), 'random ' + i + ': never Ready with a must-have not Yes');
  ok(ev.areas.reduce((a, g) => a + g.pts, 0) === ev.pts && ev.areas.reduce((a, g) => a + g.max, 0) === ev.max, 'random ' + i + ': the area points add up to the total');
}
ok(nr === 1500 && Object.keys(seen).length === 4, '1,500 random answer sets checked; all four verdicts occurred');

// ---------- result words ----------
const env = { cat: D.cat, TQ, today: '2026-11-24' };
let r = mk(U, ['y', 'y', 'pl', 'y', 'k', 'y', 'pl', 'y', 'n', 'y'], ['y', 'k', 'y', 'y', 'pl', 'y', 'y', 'y']); r.By.m3 = '2027-01-15'; // v2.3: Partly → Planned, Doesn't apply → Yes
let m = L.resultModel(r, env);
ok(m.scoreHead === 'Score: 75%' && !/ready/.test(m.scoreHead), 'score reads "Score: 75%", never "% ready": ' + m.scoreHead);
ok(m.scoreSub === '27 of 36 points on 18 questions: 16 answered, 2 not answered yet (0 points each). Your own answers; nobody checked them. The cut-offs are the team’s judgement, not tested with hotels.', 'the points, the question counts and the caveat sit next to the score: ' + m.scoreSub);
ok(m.levelName === 'Not ready yet' && m.cap && /every must-have at Yes/.test(m.cap), 'verdict name and the must-have cap line');
ok(m.areas[0].name === 'Must-haves' && m.areas.length === 7 && m.areas.every(a => /^\S.*: \d+ of \d+ in place( · (Strong|Gaps to close|Weak))?( · \d+ not answered yet)?$/.test(a.line) && !/%/.test(a.line)), 'what is in place, by area: must-haves + six areas, counts and words, no percentage');
ok(m.first.length === 3 && m.firstLabel === 'Start with these three' && m.first[0].sub.startsWith('Must-have: Rules for staff on AI tools · your answer: No'), 'start with these three: the must-have at No first');
ok(m.first[1].sub.includes('your answer: Not answered yet') && m.first[2].sub.includes('your answer: Planned'), 'then not answered yet, then Planned');
ok(eq(m.people.map(p => p.who), C.WHO_ORDER.filter(w => m.people.some(p => p.who === w))) && m.people.every(p => p.name === C.WHO[p.who]), 'action plan by person, in the readiness check\'s order and names');
ok(m.people.find(p => p.who === 'owner').items[0].text === 'Finish by 15 Jan 2027: Agree the KPI this tool must improve, today’s figure and the target, and get them approved by the person who decides on spending.', 'Planned: "Finish by <date>: …" (v2.8.0, B11)');
ok(m.people.find(p => p.who === 'dept').items.some(a => a.text === 'Answer this: “Do you know which guest or staff personal data the tool would use?”'), 'not answered yet: "Answer this: “question”" (v2.7.0: must-have 5 "Personal data known", head of the department)');
ok(m.people.reduce((a, p) => a + p.items.length, 0) === L.open(m.ev).length && L.open(m.ev).length === 6, 'every open item is in exactly one person\'s list');
ok(eq(m.vendor, [C.VENDOR.first].concat(C.VENDOR.all, C.VENDOR.last, [C.VENDOR.ask.m5])), 'vendor questions (v2.7.0: no legal ones): demo, the general ones, cost, data back, and the personal-data question because must-have 5 is open');
ok(!('legal' in m) && !('legalNote' in m) && m.disclaimer === C.DISCLAIMER, 'v2.7.0: no AI Act label; the disclaimer instead');
const hr = L.resultModel(mk('hr-2', [], []), env); ok(hr.flag === C.SENSITIVE_FLAG && hr.held.join() === 'sensitive' && hr.reason === C.SENSITIVE_HOLD, 'hr-2 (sensitive): the flag and the hold reason, verbatim');
const rmv = L.resultModel(mk('rm-1', [], []), env); ok(rmv.vendor.includes(C.VENDOR.pricing) && !m.vendor.includes(C.VENDOR.pricing), 'the pricing vendor question for revenue management only');
ok(!('notTool' in L.resultModel(mk('lg-4', [], []), env)), 'v2.7.0: lg-4 has its own questions like every use case; no label note');
ok(m.method.some(t => /^Points per answer: Yes 2 · Planned, not done yet 1 · No 0 · Not answered yet 0\.$/.test(t)) && m.method.some(t => /^Must-haves: \d+ of 10 in place.*\(\d+ of \d+ points; \d+ of 10 answered\)\.$/.test(t)) && m.method.some(t => /^Cut-offs: /.test(t) && /75% or more/.test(t) && /50% to 74%/.test(t) && /more than half/.test(t)) && m.method.some(t => /not been tested with hotels/.test(t)), 'how this was worked out: points, per area, cut-offs, caveat');
ok(m.method.filter(t => /^(Must-haves|People|Skills|Financial investment|Technology infrastructure|Data|Organisation & governance): /.test(t)).length === 7, 'points per area, seven lines');
// v2.5 (audit v3): Copy summary and summaryText are gone; the PDF carries the same words in the same order
const pb = P.model(r, env).blocks, pi = pb.findIndex(b => b.t === m.levelName + ' · ' + m.scoreHead);
ok(pi > 0 && pb[pi + 1].t === m.reason && pb[pi + 2].t === m.scoreSub && pb.some(b => b.k === 'h' && b.t === 'Action plan by person') && pb.some(b => /as of 25 Nov 2026/.test(b.t || '')), 'the PDF carries the verdict with the score beside it, the reason, the points, and the plan');
ok(L.personText(m, m.people[0], '').startsWith('Do you need AI? (Hotel Test)\nFor: ' + m.people[0].name), 'copy-per-person text names the person');
// v2.7.0: no draft marks (the questions-only data replaces the draft rows); the why-fold is the data's own "why", area and who answers
ok(!Object.values(TQ.uses).some(u => 'draft' in u) && !L.resultModel(mk('fo-8', [], []), env).draft, 'no draft marks');
Object.keys(TQ.uses).forEach(id => TQ.uses[id].qs.forEach(q => {
  const w = L.tailWhy(TQ, id, q);
  ok(eq(w, [q.why, 'Area: ' + TQ.areas[q.a] + '.', 'Who answers: ' + q.whoLabel + '.']), q.id + ': why-fold is the data\'s why line, area and who answers');
}));
// return visits
const s1 = L.snapshot(L.evaluate(mk(U, ['k', 'k'], []), TQ), '2026-11-20T09:00:00.000Z', U), s2 = L.snapshot(L.evaluate(mk(U, [], []), TQ), '2026-11-24T09:00:00.000Z', U);
ok(L.since([s1]) === null && L.sameSnap(s1, s1) && !L.sameSnap(s1, s2), 'first visit: nothing to compare');
const sc = L.since([s1, s2]); ok(sc.head === 'Since last time (20 Nov 2026)' && sc.lines.some(t => t === 'Must-haves at Yes: 8 → 10 of 10.') && sc.lines.some(t => t === 'Verdict: Almost ready → Ready to start a pilot.'), 'since last time: score, must-haves, verdict');
done();
