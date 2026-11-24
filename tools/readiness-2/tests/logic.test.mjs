// "Do you need AI?" v2 rules (src/logic.js): the five questions, the readiness score in % and the verdict.
// Run: node tools/readiness-2/tests/logic.test.mjs
import { load, data, tester, finished } from './load.mjs';
const { C, L, F, RC } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('logic');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------- The five questions: all 3^5 = 243 combinations against an independent reading of the research ----------
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
  if (a === 'n') { stops++; ok(v.stop && v.carried.length === 0 && v.find.length === 0, 'Q1 No stops ' + tag); }
  else ok(!v.stop, 'only Q1 No stops ' + tag);
  ok(v.second === (o.key === 'data' && q.q5 === 'n' ? 'Then define success.' : ''), 'second line only when Q3 and Q5 are No ' + tag);
  ok(v.q1Unsure === (a === 'u'), 'Q1 Not sure shows the other outcome ' + tag);
  if (Object.values(q).includes('u')) ok(v.key !== 'go' && v.key !== 'assist', 'Not sure never counts as Yes ' + tag);
}
ok(combos === 243 && stops === 81, 'all 243 combinations checked, 81 of them stop');

// ---------- wording (owner, 24 Nov 2026) ----------
ok(eq(C.QUESTIONS.map(q => q.q), [
  'Is this task too varied for fixed rules (if this, then that)?',
  'Is this task frequent or costly enough to be worth improving?',
  'Is the information it needs digital and up to date?',
  'Can mistakes be caught before they harm anyone?',
  'Can you name the number that should improve, and today’s figure?']), 'the five questions, simpler wording; Q2 is the owner\'s own');
ok(eq(C.QUESTIONS.map(q => q.title), ['Complex judgement', 'Return', 'Information ready', 'Safety net', 'Proof']) && C.QUESTIONS.map(q => q.title[0]).join('') === 'CRISP', 'titles spell C-R-I-S-P');
C.QUESTIONS.forEach(q => { ok(q.q.split(/\s+/).length <= 14 && /\?$/.test(q.q) && !/\?./.test(q.q), q.id + ': one short sentence'); ok(q.whyShort && q.yesIf && q.noIf && q.yes && q.no && q.why, q.id + ': the "Why this matters" parts are all there'); });
ok(C.QUESTIONS[0].guard && !C.QUESTIONS.slice(1).some(q => q.guard), '"Not sure?" box on Q1 only');
ok(C.STOP.head === 'This is not suitable for AI.', 'stop heading');
ok(C.HONEST === 'Nobody checks your answers. An answer that isn’t true only hides a problem you will meet later.', 'honesty line');
ok(C.AS_OF === '24 Nov 2026', 'content date');
const partial = L.verdict({ q1: 'y', q2: 'y' }); ok(partial.key === 'open' && !partial.complete, 'not all answered → open');
ok(L.verdict({ q1: 'n' }).key === 'stop', 'Q1 No stops even when the rest is blank');

// ---------- must-haves ----------
ok(C.MUSTS.length === 10 && C.MUSTS.length <= 10, 'at most 10 must-haves');
ok(eq(C.MUSTS.map(m => m.id), F.MUST_IDS) && eq(L.MUST_IDS, F.MUST_IDS), 'flow and content agree on the must-have ids');
const gates = C.MUSTS.map(m => m.gate || '').join(', ').split(', ').filter(Boolean).sort();
ok(eq(gates, ['D5', 'F1', 'F2', 'O1', 'P1', 'T1']), 'the six D6 gates of the workbook\'s README are all covered: ' + gates);
C.MUSTS.forEach(m => {
  ok(/\?$/.test(m.q) && !/\?./.test(m.q) && m.q.split(/\s+/).length <= 26, m.id + ': one plain question');
  ok(m.name && m.why && m.good && m.act && C.WHO[m.who], m.id + ': title, why, what counts as Yes, action, who');
  ok(m.ev.length >= 1 && m.ev.every(e => e[0] && e[1] && /\d{4}|version/.test(e[1])), m.id + ': evidence with source (and date or version)');
  const sh = L.shareLines(m, TQ);
  ok(sh.length === m.blocks.length && sh.every(t => /needed for \d+ of 90 use cases in the team’s resource analysis, Nov 2026/.test(t) && /team judgement/.test(t)), m.id + ': share from the Framework matrix, labelled as the team\'s analysis');
  ok(!/\b[PFTDOG]\d\b/.test(m.q + m.name + m.why + m.good + m.act), m.id + ': no internal code in hotel-facing words');
});
ok(TQ.matrixTotal === 90 && TQ.blocks.length === 20, 'matrix: 20 blocks over 90 use cases (computed from the sheet)');
ok(L.shareLines(L.MUST.m1, TQ)[0].includes('needed for 90 of 90') && /foundation layer/.test(L.shareLines(L.MUST.m1, TQ)[0]), 'm1: 90 of 90, foundation layer');
const shareOf = id => TQ.blocks.find(b => b.name === L.MUST[id].blocks[0]).n;
ok(eq(['m1', 'm2', 'm3', 'm4', 'm5'].map(shareOf), [90, 77, 58, 58, 22]) && eq(['m6', 'm7', 'm8', 'm9', 'm10'].map(shareOf), [59, 48, 35, 30, 30]), 'order: the gates by share, then the rest by share');
ok(C.MUSTS[2].q === 'Has the person who decides on spending approved the KPI this tool must improve, with today’s figure and the target?', 'KPI must-have keeps the owner\'s wording');
ok(C.MUSTS[3].q.includes('the systems you want to connect it to'), 'systems must-have: "the systems you want to connect it to"');
ok(L.systemsFor({}).fallback && L.systemsFor({ dept: 'fo' }).text === C.SYSTEMS.fo && L.systemsFor({ dept: 'fo', use: 'none' }).fallback, 'systems examples: generic before the department is known, by department after');
ok(eq(Object.keys(C.SYSTEMS).sort(), D.cat.depts.map(d => d.id).sort()), 'systems examples for every catalogue department');

// ---------- score and verdict ----------
const T = L.T;
ok(eq([T.READY, T.ALMOST, T.UNKNOWN_READY, T.UNKNOWN_NOINFO], [75, 50, 25, 50]) && eq(L.POINTS, { y: 2, pl: 1, p: 1, n: 0 }), 'cut-offs and points in one block');
/* Build a check from lists of answers: musts (10) and tailored (the use case's questions, in order). */
function mk(use, musts, tail) {
  const r = finished(F, D, use);
  F.MUST_IDS.forEach((id, i) => { r.A[id] = musts[i] || 'y'; });
  if (use && use !== 'none') TQ.uses[use].qs.forEach((q, i) => { r.T[q.id] = (tail && tail[i]) || 'y'; });
  return r;
}
const rep = (v, n) => Array(n).fill(v);
// independent arithmetic
function expect(rec) {
  const P = { y: 2, pl: 1, p: 1, n: 0 }; let pts = 0, max = 0, total = 0, unk = 0;
  const mv = F.MUST_IDS.map(id => rec.A[id]), tv = rec.use && rec.use !== 'none' ? TQ.uses[rec.use].qs.map(q => rec.T[q.id]) : [];
  mv.concat(tv).forEach(v => { if (v === 'na') return; total++; if (v === 'k' || !v) { unk++; return; } pts += P[v]; max += 2; });
  const allYes = mv.every(v => v === 'y'), anyNo = mv.some(v => v === 'n'), ratio = max ? pts / max : null;
  let level;
  if (unk / total > 0.5) level = 'noinfo';
  else if (anyNo || ratio < 0.5) level = 'notready';
  else if (allYes && ratio >= 0.75 && unk / total < 0.25) level = 'ready';
  else level = 'almost';
  return { level, pct: max ? Math.floor(100 * pts / max) : null, known: total - unk, total, pts, max };
}
function same(rec, tag) { const e = L.evaluate(rec, TQ), x = expect(rec); ok(e.level === x.level && e.pct === x.pct && e.counts.known === x.known && e.counts.total === x.total, tag + ': ' + JSON.stringify(x) + ' got ' + e.level + ' ' + e.pct); return e; }
const U = 'gx-2', NQ = TQ.uses[U].qs.length; // 8 tailored questions
ok(NQ === 8, 'gx-2 has 8 tailored questions (fixture for the edges)');
let e = same(mk(U, [], []), 'all Yes'); ok(e.level === 'ready' && e.pct === 100 && !e.cap, 'all Yes → Ready to start a pilot, 100%');
// 75% edge with every must-have Yes: 18 questions, 36 points possible; 27 = 75%, 26 = 72%
e = same(mk(U, [], ['n', 'n', 'n', 'n', 'p', 'y', 'y', 'y']), '27 of 36'); ok(e.pts === 27 && e.max === 36 && e.pct === 75 && e.level === 'ready', 'exactly 75% → Ready');
e = same(mk(U, [], ['n', 'n', 'n', 'n', 'n', 'y', 'y', 'y']), '26 of 36'); ok(e.pct === 72 && e.level === 'almost', '72% → Almost ready');
// display never rounds up over a cut-off: 74.x% shows 74
e = L.evaluate(mk('rm-3', [], ['n', 'n', 'n', 'n', 'y', 'y']), TQ); ok(e.pts === 24 && e.max === 32 && e.pct === 75, 'rm-3 24/32 = 75%');
e = same(mk('rm-1', ['y','y','y','y','y','y','y','y','y','y'], ['n','n','n','n','p','p']), 'rm-1 22/32'); ok(e.pct === 68 && e.level === 'almost', '68.75% is shown as 68%, Almost ready');
// 50% edge (no must-have at No): musts all Partly = 10 points of 20; tailored all Partly = 8 of 16 → 18/36 = 50%
e = same(mk(U, rep('p', 10), rep('p', 8)), '50%'); ok(e.pct === 50 && e.level === 'almost', 'exactly 50% → Almost ready');
e = same(mk(U, rep('p', 10), ['n'].concat(rep('p', 7))), '47%'); ok(e.pct === 47 && e.level === 'notready', 'below 50% → Not ready yet');
// cap by must-haves
['pl', 'p', 'k'].forEach(v => { e = same(mk(U, [v], []), 'one must-have ' + v); ok(e.level === 'almost' && e.cap && e.pct >= 97, 'a must-have at ' + v + ' caps the result at Almost ready even at ' + e.pct + '%'); });
e = same(mk(U, ['n'], []), 'one must-have No'); ok(e.level === 'notready' && e.pct === 94, 'any must-have at No → Not ready yet, even at 94%');
for (let i = 0; i < 10; i++) { const m = rep('y', 10); m[i] = 'pl'; ok(L.evaluate(mk(U, m, []), TQ).level !== 'ready', 'top verdict impossible while ' + F.MUST_IDS[i] + ' is not Yes'); }
// unknown-heavy
e = same(mk(U, [], ['k', 'k', 'k', 'k', 'y', 'y', 'y', 'y']), '4 of 18 unknown'); ok(e.level === 'ready' && e.counts.unknown === 4, '4 of 18 unknown (22%) → still Ready');
e = same(mk(U, [], ['k', 'k', 'k', 'k', 'k', 'y', 'y', 'y']), '5 of 18 unknown'); ok(e.level === 'almost' && e.pct === 100, '5 of 18 unknown (28%): 100% of what is known, but not Ready');
e = same(mk('rm-3', [], ['k', 'k', 'k', 'k', 'y', 'y']), '4 of 16 unknown'); ok(e.level === 'almost', 'exactly a quarter unknown is not "fewer than a quarter"');
e = same(mk(U, ['y', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k', 'k'], []), '9 of 18 unknown'); ok(e.level === 'almost', 'exactly half unknown is not "more than half"');
e = same(mk(U, rep('k', 10), []), '10 of 18 unknown'); ok(e.level === 'noinfo', 'more than half unknown → Not enough information yet');
e = same(mk(U, rep('k', 10), rep('k', 8)), 'all unknown'); ok(e.level === 'noinfo' && e.pct === null && L.scoreHead(e) === 'No score yet', 'nothing known → no score, Not enough information yet');
e = same(mk(U, ['n'].concat(rep('k', 9)), rep('k', 8)), 'No plus unknowns'); ok(e.level === 'noinfo', 'more than half unknown comes first, even with a must-have at No');
// Doesn't apply: left out of points and of the question count
e = same(mk(U, [], ['na', 'na', 'y', 'y', 'y', 'y', 'y', 'y']), 'two na'); ok(e.counts.total === 16 && e.counts.na === 2 && e.pct === 100, '"Doesn\'t apply" is left out altogether');
// None of these fits: must-haves only
e = same(mk('none', [], []), 'none all yes'); ok(e.mustOnly && e.counts.total === 10 && e.level === 'ready', '"None of these fits": must-haves only, and can still be Ready');
e = same(mk('none', ['p', 'p', 'p', 'p', 'p', 'n'], []), 'none with a No'); ok(e.level === 'notready' && e.mustOnly, 'none + a must-have No → Not ready yet');
ok(L.resultModel(mk('none', [], []), { cat: D.cat, TQ }).mustOnly === C.MUST_ONLY && /must-haves only/.test(C.MUST_ONLY), 'the result says it rests on the must-haves only');
// Planned counts like Partly
ok(L.evaluate(mk(U, [], rep('pl', 8)), TQ).pts === L.evaluate(mk(U, [], rep('p', 8)), TQ).pts, 'Planned scores like Partly (1 point)');
// random sets against the independent arithmetic
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, pick = a => a[Math.floor(rnd() * a.length)];
const uses = Object.keys(TQ.uses); let nr = 0; const seen = {};
for (let i = 0; i < 1500; i++) {
  const use = i % 9 === 0 ? 'none' : pick(uses), w = pick([['y'], ['y', 'y', 'y', 'pl', 'p'], ['y', 'pl', 'p', 'n', 'k'], ['k', 'k', 'k', 'y', 'n'], ['y', 'y', 'k'], ['p', 'pl', 'n']]);
  const r = mk(use, F.MUST_IDS.map(() => pick(w)), use === 'none' ? [] : TQ.uses[use].qs.map(() => pick(w.concat(i % 4 ? [] : ['na']))));
  const ev = same(r, 'random ' + i); nr++; seen[ev.level] = 1;
  ok(!(ev.level === 'ready' && !ev.must.allYes), 'random ' + i + ': never Ready with a must-have not Yes');
  ok(ev.areas.reduce((a, g) => a + g.pts, 0) === ev.pts && ev.areas.reduce((a, g) => a + g.max, 0) === ev.max, 'random ' + i + ': the area points add up to the total');
}
ok(nr === 1500 && Object.keys(seen).length === 4, '1,500 random answer sets checked; all four verdicts occurred');

// ---------- result words ----------
const env = { cat: D.cat, TQ, RC, M: RC.model({ rdy: D.rc.rdy, cat: D.cat, reg: D.rc.reg }), today: '2026-11-24' };
let r = mk(U, ['y', 'y', 'pl', 'y', 'k', 'y', 'p', 'y', 'n', 'y'], ['y', 'k', 'y', 'y', 'p', 'y', 'na', 'y']); r.By.m3 = '2027-01-15';
let m = L.resultModel(r, env);
ok(/^\d+% ready$/.test(m.scoreHead), 'score reads "72% ready": ' + m.scoreHead);
ok(m.scoreSub === 'from ' + m.ev.counts.known + ' of ' + m.ev.counts.total + ' questions you could answer; self-reported; cut-offs are the team’s judgement, not tested with hotels', 'the base and the caveat sit next to the score: ' + m.scoreSub);
ok(m.levelName === 'Not ready yet' && m.cap && /every must-have at Yes/.test(m.cap), 'verdict name and the must-have cap line');
ok(m.areas[0].name === 'Must-haves' && m.areas.length === 7 && m.areas.every(a => /^\S.*: (\d+% · )?(Strong|Gaps to close|Weak|Too little to say) \(\d+ of \d+ answered\)$/.test(a.line)), 'score per area: must-haves + six areas, % and words');
ok(m.first.length === 3 && m.firstLabel === 'Start with these three' && m.first[0].sub.startsWith('Must-have: Rules for staff on AI tools · your answer: No'), 'start with these three: the must-have at No first');
ok(m.first[1].sub.includes('your answer: Partly') && m.first[2].sub.includes('Don’t know yet'), 'then Partly, then Don\'t know yet');
ok(eq(m.people.map(p => p.who), C.WHO_ORDER.filter(w => m.people.some(p => p.who === w))) && m.people.every(p => p.name === C.WHO[p.who]), 'action plan by person, in the readiness check\'s order and names');
ok(m.people.find(p => p.who === 'owner').items[0].text === 'Finish: Agree the KPI this tool must improve, today’s figure and the target, and get them approved by the person who decides on spending (planned by 15 Jan 2027).', 'Planned: "Finish: … (planned by <date>)."');
ok(m.people.find(p => p.who === 'dpo').items[0].text === 'Find out: “Has your data protection contact been told about this plan?”', 'Don\'t know yet: "Find out: “question”"');
ok(m.people.reduce((a, p) => a + p.items.length, 0) === L.open(m.ev).length && L.open(m.ev).length === 6, 'every open item is in exactly one person\'s list');
ok(m.vendor.length >= 4 && m.vendor[0] === 'Can you show the tool working on our own systems and data, not a standard demo?' && eq(m.vendor, RC.vendorQs(env.M, env.M.UI[U], { actions: [{ group: 'vendor', q: { code: 'D5b' } }] })), 'vendor questions are the readiness check\'s own for the use case');
ok(m.legal && m.legal.name && m.legalNote === 'Provisional label from the team’s AI Register, awaiting legal sign-off. Not a compliance verdict and not legal advice.' && !/Art\.\s?\d|Annex/.test(JSON.stringify(m.legal)), 'provisional AI Act label with the readiness check\'s neutral wording, no article numbers');
const hr = L.resultModel(mk('hr-2', [], []), env); ok(hr.legal.name === RC.legal(env.M, env.M.UI['hr-2'], { country: 'France' }).name && hr.legal.items.length > 3 && hr.legal.applies.startsWith('applies from '), 'hr-2: the register\'s high-risk label, with items to check');
ok(L.resultModel(mk('lg-4', [], []), env).legal === null && L.resultModel(mk('lg-4', [], []), env).notTool, 'lg-4 (a document, not a tool): no label, said so');
ok(m.method.some(t => /Yes 2 · Planned, not done yet 1 · Partly 1 · No 0/.test(t)) && m.method.some(t => /^Must-haves: \d+ of \d+ points = \d+%/.test(t)) && m.method.some(t => /^Cut-offs: /.test(t) && /75% or more/.test(t) && /50% to 74%/.test(t) && /more than half/.test(t)) && m.method.some(t => /not been tested with hotels/.test(t)), 'how this was worked out: points, per area, cut-offs, caveat');
ok(m.method.filter(t => /^(Must-haves|People|Skills|Financial investment|Technology infrastructure|Data|Organisation & governance): /.test(t)).length === 7, 'points per area, seven lines');
const txt = L.summaryText(m); ok(txt.includes(m.levelName + ' · ' + m.scoreHead + ' (' + m.scoreSub + ')') && txt.includes('Action plan by person:') && txt.includes('Content as of 24 Nov 2026'), 'Copy summary carries the verdict, the score with its base, and the plan');
ok(L.personText(m, m.people[0], '').startsWith('Do you need AI? (Hotel Test)\nFor: ' + m.people[0].name), 'copy-per-person text names the person');
// draft use cases and evidence lines
const drafts = Object.keys(TQ.uses).filter(k => TQ.uses[k].draft).sort();
ok(eq(drafts, ['fo-6', 'fo-7', 'fo-8', 'gm-7', 'hk-7', 'hr-6', 'kc-6', 'rm-9']) && TQ.nDraft === 8 && TQ.nFromWorkbook === 91, 'the 8 use cases without a workbook row are marked draft');
ok(L.resultModel(mk('fo-8', [], []), env).draft.startsWith('Draft questions: team to review') && !L.resultModel(mk(U, [], []), env).draft, 'draft note on the result for a draft use case only');
Object.keys(TQ.uses).forEach(id => TQ.uses[id].qs.forEach(q => {
  const w = L.tailWhy(TQ, id, q), u = TQ.uses[id];
  ok(w[0] === 'Area: ' + TQ.areas[q.a] + '.' && w.some(t => t.startsWith('Resource intensity (team judgement, not evidence-based): ' + u.int + ': ')) &&
    w.some(t => u.draft ? /^Evidence: team draft/.test(t) : u.ev ? t === 'Evidence rows in the team’s D6 evidence pack: ' + u.ev + '.' : t === 'Evidence: team judgement from the catalogue description.') &&
    (!u.arch || w.some(t => t.startsWith('Type of tool (the team’s grouping): ' + TQ.arch[u.arch].n))), id + '.' + q.id + ': why-fold has area, type of tool, intensity and the evidence line');
}));
// return visits
const s1 = L.snapshot(L.evaluate(mk(U, ['k', 'k'], []), TQ), '2026-11-20T09:00:00.000Z'), s2 = L.snapshot(L.evaluate(mk(U, [], []), TQ), '2026-11-24T09:00:00.000Z');
ok(L.since([s1]) === null && L.sameSnap(s1, s1) && !L.sameSnap(s1, s2), 'first visit: nothing to compare');
const sc = L.since([s1, s2]); ok(sc.head === 'Since last time (20 Nov 2026)' && sc.lines.some(t => t === 'Must-haves at Yes: 8 → 10 of 10.') && sc.lines.some(t => t === 'Verdict: Almost ready → Ready to start a pilot.'), 'since last time: score, must-haves, verdict');
done();
