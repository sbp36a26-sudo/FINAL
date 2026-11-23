// Readiness 2.0 rules (src/logic.js) against the research (research_notes/AI starting point/research.md, parts A and D).
// Run: node tools/readiness-2/tests/logic.test.mjs
import { load, tester } from './load.mjs';
const { C, L } = load();
const { ok, done } = tester('logic');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------- Verdict: all 3^5 = 243 combinations against an independent reading of the research ----------
/* Oracle written from the research text, not from logic.js:
   1. Q1 No → stop (overrides everything).  2. else Q2 No → worth.  3. else Q3 No → data (+ "Then define success" if Q5 No).
   4. else Q5 No → success.  5. else any Not sure → find.  6. else Q4 No → assist.  7. else (all Yes) → go.
   Carried conditions (owner): every No of Q2, Q3, Q5, Q4 in that order (precedence, then the modifier); Not sure → to find out. */
function oracle(q) {
  if (q.q1 === 'n') return { key: 'stop', carried: [], find: [] };
  const carried = ['q2', 'q3', 'q5', 'q4'].filter(k => q[k] === 'n');
  const find = ['q1', 'q2', 'q3', 'q4', 'q5'].filter(k => q[k] === 'u');
  let key;
  if (q.q2 === 'n') key = 'worth';
  else if (q.q3 === 'n') key = 'data';
  else if (q.q5 === 'n') key = 'success';
  else if (find.length) key = 'find';
  else if (q.q4 === 'n') key = 'assist';
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
  if (a === 'n') { stops++; ok(v.stop && v.carried.length === 0 && v.find.length === 0, 'Q1 No stops and shows nothing else as a blocker ' + tag); }
  else ok(!v.stop, 'only Q1 No stops ' + tag);
  ok(v.second === (o.key === 'data' && q.q5 === 'n' ? 'Then define success.' : ''), 'second line only when Q3 and Q5 are No ' + tag);
  ok(v.q1Unsure === (a === 'u'), 'Q1 Not sure shows the other outcome ' + tag);
  // "Not sure" never counts as Yes: replacing a Yes by Not sure never improves the verdict to 'go'.
  if (Object.values(q).includes('u')) ok(v.key !== 'go' && v.key !== 'assist', 'Not sure never counts as Yes ' + tag);
}
ok(combos === 243 && stops === 81, 'all 243 combinations checked, 81 of them stop');

// Wording comes straight from the research
ok(C.VERDICT.worth === 'Probably not worth it.' && C.VERDICT.data === 'Fix the data first.' && C.VERDICT.success === 'Define success first.', 'verdict words from the research');
ok(C.VERDICT.assist === 'Worth exploring, as an assistant only: a person checks every result before it counts.', 'Q4 modifier wording');
ok(C.VERDICT.go === 'Worth exploring with AI. Next: find where it sits in your hotel.', 'all-Yes wording');
ok(C.STOP.head === 'This is not an AI problem.', 'stop heading (owner)');
ok(C.QUESTIONS[0].outcome === 'Not an AI problem: rules or ordinary automation will do it.', 'Q1 outcome wording');
ok(C.QUESTIONS[3].outcome.startsWith('AI as an assistant only'), 'Q4 No adds "AI as an assistant only"');
ok(C.QUESTIONS.map(q => q.q).join('|') === [
  'Is this job too varied to write down as fixed rules (if this, then that)?',
  'Does the job come up often enough, or cost enough, that doing it better would be worth real money or staff hours every month?',
  'Is the information the tool needs already kept somewhere digital and up to date?',
  'If the tool gets it wrong now and then, can the mistake be spotted and put right before it hurts a guest, a staff member or the hotel?',
  'Can you name the one number that should get better, and do you know today’s figure?'].join('|'), 'exact question wording');
ok(eq(C.QUESTIONS.map(q => q.who), ['the vendor or IT', 'the GM or finance', 'IT or the department head', 'the department head', 'the GM']), 'who probably knows (research A.7)');

// Partial answers: a No that decides is shown at once; otherwise 'open' until all five are answered
ok(L.verdict({}).key === 'open' && !L.verdict({}).complete, 'nothing answered: open');
ok(L.verdict({ q1: 'n' }).key === 'stop', 'Q1 No alone stops');
ok(L.verdict({ q1: 'y', q2: 'n' }).key === 'worth', 'a deciding No shows before the rest is answered');
ok(L.verdict({ q1: 'y', q2: 'y', q3: 'y', q4: 'y' }).key === 'open', 'four Yes, one blank: open');
ok(L.verdict({ q1: 'x', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }).key === 'open', 'junk answers count as blank');

// ---------- Scale ----------
ok(eq(C.ANSWERS.map(a => a[1]), ['Yes', 'Planned, not done yet', 'Partly', 'No', 'Don’t know yet']), 'answer scale = the readiness check’s, same order');
ok(eq(C.ANSWERS.map(a => a[0]), ['y', 'pl', 'p', 'n', 'k']), 'answer codes = the readiness check’s');
ok(eq(C.Q_ANSWERS.map(a => a[1]), ['Yes', 'No', 'Not sure']), 'step 1a scale');

// ---------- Items ----------
ok(C.NEEDS.length === 10 && C.FACTORS.length === 9, 'ten prerequisites, nine success factors');
ok(eq(C.NEEDS.slice(0, 5).map(x => x.id), ['b1', 'b3', 'b5', 'b8', 'b9']) && C.NEEDS.slice(0, 5).every(x => x.key) && C.NEEDS.slice(5).every(x => !x.key), 'B1, B3, B5, B8, B9 first and marked');
ok(eq(C.FACTORS.map(x => x.name), ['Budget', 'Workflow clarity', 'Leadership', 'Culture', 'Workforce readiness', 'Governance', 'Risk', 'Data and content', 'Change management']), 'the nine factors named in the spec');
[...C.NEEDS, ...C.FACTORS].forEach(x => ok(x.check && x.act && x.who && x.rc && (x.plain || x.def) && x.good, 'item complete: ' + x.id));
C.FACTORS.forEach(x => ok(Array.isArray(x.warn) && x.warn.length >= 2, 'warning signs: ' + x.id));
const checks = [...C.NEEDS, ...C.FACTORS].map(x => x.check);
ok(new Set(checks).size === checks.length, 'no self-check question is asked twice');
ok(eq([...C.TIE_ORDER].sort(), [...L.NEED_IDS, ...L.FACTOR_IDS].sort()), 'tie order covers every item once');
// Every figure carries its source and base
[...C.NEEDS, ...C.FACTORS].forEach(x => (x.ev || []).forEach(e => {
  ok(e[1] && e[1].length > 20, 'evidence has a source: ' + x.id);
  if (/\d+(\.\d+)?%/.test(e[0])) ok(/Base:/.test(e[1]), 'a figure names its base: ' + x.id + ' ' + e[0].slice(0, 40));
}));
const allText = JSON.stringify(C);
ok(!/wikipedia/i.test(allText), 'no Wikipedia');
ok(!/AIHA|Hospitality Alliance/i.test(allText), 'no AIHA');
ok(!/h2c|McKinsey|BCG|Booking\.com|Heo|Li, Y/.test(allText), 'no search-only, abstract-only or unopened-base sources are cited');
ok(C.HONEST === 'Nobody checks your answers. An answer that isn’t true only hides a problem you will meet later.', 'honesty line (owner’s wording)');

// ---------- Counts ----------
const all = v => Object.fromEntries([...L.NEED_IDS, ...L.FACTOR_IDS].map(id => [id, v]));
ok(eq(L.counts(all('y'), L.NEED_IDS), { inPlace: 10, planned: 0, gaps: 0, find: 0, total: 10 }), 'all Yes: 10 in place');
ok(eq(L.counts(all('pl'), L.FACTOR_IDS), { inPlace: 0, planned: 9, gaps: 0, find: 0, total: 9 }), 'Planned counts as planned');
ok(L.counts(all('p'), L.NEED_IDS).gaps === 10 && L.counts(all('n'), L.NEED_IDS).gaps === 10, 'Partly and No are gaps');
ok(L.counts(all('k'), L.NEED_IDS).find === 10 && L.counts({}, L.NEED_IDS).find === 10, 'Don’t know yet (and blank) are to find out');
const mixed = { b1: 'y', b3: 'pl', b5: 'p', b8: 'n', b9: 'k', b2: 'y', b4: 'y', b6: 'n', b7: 'pl', b10: 'k' };
ok(eq(L.counts(mixed, L.NEED_IDS), { inPlace: 3, planned: 2, gaps: 3, find: 2, total: 10 }), 'mixed counts');
ok(L.countLine(L.counts(mixed, L.NEED_IDS)) === '3 in place · 2 planned · 3 gaps · 2 to find out', 'count line like the research example');
ok(L.countLine({ inPlace: 4, planned: 2, gaps: 1, find: 1 }) === '4 in place · 2 planned · 1 gap · 1 to find out', 'singular gap');
// Counts always add up (random answer sets)
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (let i = 0; i < 500; i++) {
  const A = {}; [...L.NEED_IDS, ...L.FACTOR_IDS].forEach(id => { const r = rnd(); if (r > 0.05) A[id] = ['y', 'pl', 'p', 'n', 'k'][Math.floor(rnd() * 5)]; });
  for (const ids of [L.NEED_IDS, L.FACTOR_IDS]) { const c = L.counts(A, ids); ok(c.inPlace + c.planned + c.gaps + c.find === ids.length, 'counts add up #' + i); }
  // ranking: No < Partly < Don't know < Planned, ties by the fixed order; never a Yes
  const r = L.ranked(A), rank = { n: 0, p: 1, k: 2, pl: 3 };
  ok(r.every(x => x.v !== 'y'), 'ranking never lists a Yes #' + i);
  ok(r.every((x, j) => j === 0 || rank[r[j - 1].v] < rank[x.v] || (rank[r[j - 1].v] === rank[x.v] && C.TIE_ORDER.indexOf(r[j - 1].id) < C.TIE_ORDER.indexOf(x.id))), 'ranking order #' + i);
  ok(eq(L.weakest(A, 3), r.slice(0, 3)), 'weakest three = top of the ranking #' + i);
  ok(L.actions(A, {}).length === r.length, 'one action per item not in place #' + i);
}

// ---------- Weakest three (research D examples) ----------
ok(eq(L.weakest(all('y')), []), 'all Yes: nothing to start with');
ok(eq(L.weakest(all('n')).map(x => x.id), ['b1', 'b3', 'b5']), 'all No: ties by order, prerequisites first');
ok(eq(L.weakest(Object.assign(all('y'), { c4: 'n', b4: 'p', b1: 'k', b3: 'pl' })).map(x => x.id), ['c4', 'b4', 'b1']), 'No beats Partly beats Don’t know beats Planned, whatever the step');
ok(eq(L.weakest(Object.assign(all('y'), { c3: 'pl', b10: 'pl', c1: 'pl', b4: 'pl' })).map(x => x.id), ['b10', 'b4', 'c3']), 'ties: B10 before B4, prerequisites before factors');
ok(eq(L.weakest(Object.assign(all('y'), { c9: 'n', c3: 'n', c1: 'n', c2: 'n' })).map(x => x.id), ['c3', 'c1', 'c2']), 'factors tie order: leadership, budget, workflow');

// ---------- Overall line ----------
ok(L.overall(all('y')).key === 'good' && L.overall(all('y')).text === 'Good starting point. Run the readiness check for the tool you choose.', 'all Yes: good');
ok(L.overall(Object.assign(all('y'), { b5: 'p' })).key === 'close', 'a gap in B1/B3/B5/B8/B9: close these first');
ok(L.overall(Object.assign(all('y'), { b2: 'n' })).key === 'good', 'a gap outside the five keys does not trigger "close"');
ok(L.overall(Object.assign(all('y'), { b2: 'n', c4: 'k' })).key === 'find', 'otherwise any Don’t know: find out');
ok(L.overall(Object.assign(all('y'), { b9: 'n', c4: 'k' })).key === 'close', '"close" beats "find"');
ok(L.overall(Object.assign(all('y'), { b9: 'pl' })).key === 'good', 'Planned on a key item is not a gap');

// ---------- Actions ----------
ok(L.action('b9', 'n').text === 'Write a 12-month budget with all costs and agree who pays.' && L.action('b9', 'n').who === 'GM / finance', 'research example wording (budget)');
ok(L.action('b1', 'pl', '2026-12-15').text.startsWith('Finish: ') && L.action('b1', 'pl', '2026-12-15').text.endsWith('systems (planned by 15 Dec 2026).'), 'Planned: "Finish:" plus the date');
ok(!/planned by/.test(L.action('b1', 'pl', 'soon').text), 'a malformed date is not shown');
ok(L.action('c5', 'k').text === 'Find out: “' + C.FACTORS[4].check + '”', 'Don’t know yet: find out the question');
ok(L.action('zz', 'n') === null, 'unknown item: no action');
done();
