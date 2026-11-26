// "Do you need AI?" v2.5 (24 Nov 2026): every BUILD NOW item of reports/Council - Do you need AI v2.4.md (section 5) with the
// owner decisions O1 to O9, and the unit reproductions of reports/audit-readiness-2/cleanup_inventory_v3.md (U1, U3, U4, H1, M4,
// L1 to L5, dead code). Written before the fix: it failed on the v2.4 code and passes on v2.5.
// Fixture: tests/fixtures/v2.4-saved.json, saved by the committed v2.4 page (real browser) before any v2.5 change.
// Run: node tools/readiness-2/tests/v25.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, envOf, tester, finished, root } from './load.mjs';
const { C, L, F, P } = load();
const D = data(), TQ = D.tq, ENV = envOf(D, F);
const { ok, done } = tester('v25');
const rd = p => readFileSync(join(root, p), 'utf8');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const clone = o => JSON.parse(JSON.stringify(o));
const env = { cat: D.cat, TQ, ex: D.ex, today: '2026-11-24' };
const app = rd('src/app.js'), css = rd('src/style.css'), logicSrc = rd('src/logic.js'), contentSrc = rd('src/content.js');
const team = readFileSync(join(root, '../readiness-check/src/team.js'), 'utf8');
const GX = TQ.uses['fo-4'].qs; // v2.7.0: fo-4 has 8 questions as gx-2 had in v2.6.1 (gx-2 now has 12), so the patterns keep their numbers
const pdfText = r => P.model(r, env).blocks.map(b => [b.t, b.sub, b.check, b.answer].filter(Boolean).join(' ')).join('\n');

// ---------- rules v2.5 and the JUDGEMENT constants (O1 to O4) ----------
ok(L.RULES === 'v2.6 (24 Nov 2026)', 'rules version v2.6 (was v2.5): ' + L.RULES);
ok(L.POINTS.y === 2 && L.POINTS.pl === 1 && L.POINTS.n === 0, 'O1: points unchanged (Yes 2, Planned 1, No 0; Don\'t know yet 0)');
const J = L.JUDGEMENT || {};
ok(J.ALMOST_MIN_MUST_YES === 50 && J.READY_MIN_TAIL_YES === 50, 'O1 (c): the two caps are named constants in JUDGEMENT (50% each)');
ok(J.NOT_SURE_HOLDS_TOP === true, 'O2 (b): NOT_SURE_HOLDS_TOP');
ok(!('Q4_NO_HOLDS_TOP' in J), 'O3 (b) is replaced by the owner\'s v2.6 decision: Q4_NO_HOLDS_TOP is gone, a No on the new question 4 holds');
ok(J.NONE_BEST_ALMOST === true, 'O4 (b): NONE_BEST_ALMOST');
ok(J.UNKNOWN_SCORES_ZERO === true && J.SENSITIVE_HOLDS_TOP === true && !('LEGAL_HOLDS_TOP' in J) && J.CARRIED_NO_HOLDS_TOP === true, 'the v2.1 switches stay (v2.7.0: LEGAL_HOLDS_TOP renamed SENSITIVE_HOLDS_TOP)');

// ---------- the council's nine answer patterns on gx-2 (and the legal hold on hr-2) ----------
const mk = (use, o) => { const r = finished(F, D, use); if (o.Q) Object.assign(r.Q, o.Q); if (o.A) F.MUST_IDS.forEach(id => { r.A[id] = o.A; }); if (o.A1) Object.assign(r.A, o.A1); if (o.T && use !== 'none') TQ.uses[use].qs.forEach(q => { r.T[q.id] = o.T; }); return r; };
const PAT = {
  A: [mk('fo-4', { A: 'pl' }), 'notready', 72, [], /^Because none of the 10 must-haves is Yes\.$/],
  B: [mk('fo-4', { T: 'pl' }), 'almost', 77, ['tail'], /^Fewer than half the questions for this use case are Yes\.$/], // v2.8.2 (owner): no "Held back", a plain sentence,
  C: [mk('fo-4', {}), 'ready', 100, [], /^$/],
  D: [mk('fo-4', { Q: { q5: 'n' } }), 'almost', 100, ['carried'], /^Step 2 suggests this may not be worth doing with AI \(Proof: No\)\.$/], // v2.8.2 (owner): the step-2 line now stands in the verdict box
  E: [mk('fo-4', { Q: { q1: 'u' } }), 'almost', 100, ['notsure'], /^Some step 2 answers are Don’t know yet\.$/], // v2.8.2 (owner): no "Held back"; Not sure renamed,
  F: [mk('fo-4', { T: 'k' }), 'almost', 55, [], /^$/],
  G: [mk('none', {}), 'almost', 100, ['none'], /^No use case was chosen\.$/], // v2.8.2 (owner): no "Held back",
  H: [mk('fo-4', { A1: { m4: 'n' } }), 'notready', 94, [], /^Because 1 must-have is No\.$/],
  I: [mk('fo-4', { Q: { q4: 'n' } }), 'almost', 100, ['carried'], /^Step 2 suggests this may not be worth doing with AI \(Safety net: No\)\.$/], // v2.6: was ready with the assistant-only condition; v2.8.2 (owner): the step-2 line stands in the verdict box
  sensitive: [mk('hr-2', {}), 'almost', 100, ['sensitive'], /^For this area the best verdict is Almost ready\.$/] // v2.7.0: was the legal hold; v2.8.2 (owner): SENS_BOX rewritten, no "Held back"
};
const heads = {};
for (const [k, [r, level, pct, held, box]] of Object.entries(PAT)) {
  const m = L.resultModel(r, env);
  heads[k] = m.levelName + ' · ' + m.scoreHead + (m.boxLine ? ' · ' + m.boxLine : '');
  ok(m.level === level && m.ev.pct === pct, k + ': ' + level + ' at ' + pct + '% (got ' + m.level + ' ' + m.ev.pct + ')');
  ok(JSON.stringify(m.held) === JSON.stringify(held), k + ': held ' + JSON.stringify(held) + ' (got ' + JSON.stringify(m.held) + ')');
  ok(box.test(m.boxLine || ''), k + ': box line "' + m.boxLine + '"');
  ok(!(m.held.length && m.firstLabel === 'Nothing open') && !(m.held.length && !m.first.length), k + ': never "Nothing open" under a held verdict (BUILD NOW 3)');
  ok(m.level === 'ready' ? m.pilot === C.PILOT_GLOSS : !m.pilot, k + ': the pilot gloss only under the top verdict (BUILD NOW 11)');
}
// BUILD NOW 1: A (all must-haves Planned)
let mA = L.resultModel(PAT.A[0], env);
ok(mA.levelLine === 'No must-have is at No, but only 0 of 10 are in place. “Planned” is not done yet: finish these before you talk to vendors.', 'BUILD NOW 1: A line: ' + mA.levelLine);
ok(L.resultModel(PAT.F[0], env).levelLine === C.LEVELS.almost.line, 'BUILD NOW 1: the old "Almost ready" line stays when half or more must-haves are Yes');
// BUILD NOW 2: B (all tailored Planned)
ok(L.resultModel(PAT.B[0], env).levelLine === 'Every must-have is in place. For this use case, 0 of 8 questions are Yes and 8 are planned: finish the planned ones before the pilot starts.', 'BUILD NOW 2: B line');
// BUILD NOW 3: the hold is item 1
const mD = L.resultModel(PAT.D[0], env);
ok(mD.first[0]?.text === 'Settle this first: in step 2 you answered No to “Proof”. Write down the number and today’s figure, then come back.' /* v2.8.2 (owner): the carried hold item no longer repeats the outcome ("Define success first." is said once) */ && mD.firstLabel === 'Start with this one', 'BUILD NOW 3: D starts with the carried No: ' + mD.first[0]?.text);
const mL = L.resultModel(PAT.sensitive[0], env);
ok(mL.first[0]?.text === C.ADVISER && mL.first[0].who === C.WHO.gm && mL.first[0].hold === 'sensitive' && mL.nothingElse === C.NOTHING_ELSE, 'v2.8.0 (B4): the sensitive hold\'s item 1 is "Ask an adviser before a pilot" (General manager); nothing else open says so');
const mE = L.resultModel(PAT.E[0], env);
ok(mE.first[0]?.text === C.QUESTIONS[0].find && mE.first[0].hold === 'notsure' && /[Yy]ou answered Don’t know yet to “Needs judgement” in step 2\./.test(mE.reason) /* v2.8.2 (owner): Not sure renamed */, 'O2 (v2.8.0, owner): a Don’t know yet becomes "Find out: …" as item 1; the reason names it: ' + mE.reason);
const mG = L.resultModel(PAT.G[0], env);
ok(mG.levelLine === 'No use case chosen: the must-haves are in place, but nothing was checked for a particular tool.' && /^Settle this first:/.test(mG.first[0]?.text), 'O4: G line and first item');
// O3: Q4 No is a condition, not a hold
const mI = L.resultModel(PAT.I[0], env);
ok(!('assist' in mI) && mI.level === 'almost' && /“Safety net”/.test(mI.reason), 'v2.6 (replaces O3): I is held back by the No on question 4, and the reason names it');
// O5: the box line only for Not ready yet and held verdicts
ok(['C', 'F'].every(k => !L.resultModel(PAT[k][0], env).boxLine), 'O5: no box line for Ready and an unheld Almost ready');
ok(C.LEVELS.ready.name === 'Ready to start a pilot', 'O5: the top verdict keeps its name');
// method lists the team judgement (O1 to O4)
const meth = L.method(L.evaluate(PAT.C[0], TQ)).join('\n');
ok(/at least half the must-haves at Yes/.test(meth) && /at least half the questions for this use case that you answered at Yes/.test(meth) && /“Don’t know yet” or “Planned” in step 2 keeps the top verdict back/.test(meth) /* v2.8.2 (owner): renamed answers, no "held back" */ && /“None of these fits”/.test(meth) && /question 2, 3, 4 or 5/.test(meth), 'method names the v2.5 (and v2.6) team judgement');
ok(!/v2\.5/.test(meth) && meth.includes('Version v2.8.2 (rules unchanged since v2.6).') /* v2.8.2 (owner): version */, 'v2.8.0: the method shows one version string and no "rules v2.5"');

// ---------- BUILD NOW 5 / O6: tailored tasks read as the team-worded question ----------
const r5 = finished(F, D, 'fo-4'); r5.T[GX[0].id] = 'n'; r5.T[GX[1].id] = 'pl'; r5.TBy[GX[1].id] = '2027-02-01'; r5.T[GX[2].id] = 'k'; r5.T[GX[7].id] = 'pl';
const o5 = L.open(L.evaluate(r5, TQ)), t5 = k => o5.find(x => x.key === k)?.text;
ok(t5(GX[0].id) === L.actText(GX[0].act) && !/Make this a Yes/.test(t5(GX[0].id)), 'v2.8.0 (B11): No → the action text, no "Make this a Yes:" prefix');
ok(t5(GX[1].id) === 'Finish by 1 Feb 2027: ' + L.actText(GX[1].act), 'v2.8.0 (B11): Planned with a date → "Finish by <date>: <action>": ' + t5(GX[1].id));
ok(t5(GX[7].id) === 'Finish: ' + L.actText(GX[7].act), 'v2.8.0 (B11): Planned without a date → "Finish: <action>"');
// v2.8.2 (owner): "k" is Don’t know yet again (not a blank), so it reads "Find out: …"; a real blank still reads "Answer this: …"
ok(t5(GX[2].id) === 'Find out: “' + GX[2].q + '”', 'O6 (v2.8.2): a Don’t know yet question reads "Find out: {question}"');
{ const rb = finished(F, D, 'fo-4'); delete rb.T[GX[2].id]; const tb = L.open(L.evaluate(rb, TQ)).find(x => x.key === GX[2].id)?.text; ok(tb === 'Answer this: “' + GX[2].q + '”', 'O6: a blank question reads "Answer this: {question}" (v2.7.1)'); }
ok(GX.every(q => typeof q.act === 'string' && q.act && !/\?/.test(q.act)), 'O6 (v2.8.0, B11): every step-5 question carries its action text (data/actions_questions_only.json); the task is the action, not the question');
const r5m = finished(F, D, 'fo-4'); r5m.A.m1 = 'n'; ok(L.open(L.evaluate(r5m, TQ))[0]?.text === C.MUSTS[0].act, 'O6: must-have actions stay as they are');
ok(!/Agree in writing: hand-off rules|Train or brief the people involved/.test(pdfText(r5)), 'O6: the PDF carries no workbook shorthand');

// ---------- BUILD NOW 6: Copy for IT ----------
ok(!/toLowerCase\(\)\.replace\(\/\^the \//.test(app) && /function copyLabel/.test(app), 'BUILD NOW 6: the copy buttons use the role\'s display name');

// ---------- BUILD NOW 7: step 3 consistency lines ----------
ok(C.CONSIST && C.CONSIST.m3 === 'In step 2 you said you do not yet know the number to improve. If that has changed, go back and change it there too.' && !C.CONSIST.m7, 'BUILD NOW 7: copy (v2.6: the must-have 7 line is gone, question 3 now asks about past examples)');
ok(L.consistLines && L.consistLines({ Q: { q5: 'n', q3: 'u' }, A: { m3: 'y', m7: 'y' } }).m3 && !L.consistLines({ Q: { q5: 'n', q3: 'u' }, A: { m3: 'y', m7: 'y' } }).m7, 'BUILD NOW 7: the must-have 3 line when it applies (v2.6: no must-have 7 line)');
ok(L.consistLines && !L.consistLines({ Q: { q5: 'y', q3: 'y' }, A: { m3: 'y', m7: 'y' } }).m3 && !L.consistLines({ Q: { q5: 'n' }, A: { m3: 'pl' } }).m3, 'BUILD NOW 7: none otherwise');
ok(/id="consist-' \+/.test(app) || /consist-/.test(app), 'BUILD NOW 7: drawn under must-haves 3 and 7');

// ---------- BUILD NOW 8: the detail layer ----------
ok(Object.values(D.detail).every(x => !('ai' in x)) && Object.keys(D.detail).length === 98, 'BUILD NOW 8: no "AI technique" notes bundled (98 entries; v2.8.0: lg-2 removed)');
ok(!/AI technique/.test(app) && !/research wording/.test(app), 'BUILD NOW 8 (v2.7.0): the technique line and the catalogue\'s research-wording description are both gone from the layer');

// ---------- BUILD NOW 9: sources ----------
const evText = C.MUSTS.flatMap(m => m.ev.map(e => e.join(' '))).join('\n');
ok(!/\d+\.\d+%/.test(evText) && !/70% of EU accommodation/.test(evText) && /46% of EU accommodation/.test(evText), 'BUILD NOW 9: Eurostat shares rounded on screen (v2.8.0: the 70% line left must-have 8)');
ok(/69\.89%/.test(C.SOURCES.must.join(' ')) && /45\.91%/.test(C.SOURCES.must.join(' ')), 'BUILD NOW 9: the exact shares stay in "Where this comes from"');
ok((evText.match(/State of Hotel AI/g) || []).length === 4 && evText.split('\n').filter(t => /State of Hotel AI/.test(t)).every(t => /Destination AI/.test(t) && /global survey, vendor-linked; not comparable with the European figures/.test(t)), 'BUILD NOW 9: State of Hotel AI names its publisher and its base caveat');
ok(/\b70%/.test(app) && /\b46%/.test(app) && !/69\.89|45\.91/.test(app), 'BUILD NOW 9: the cover rounds too');

// ---------- O7: sharing off ----------
ok(!/SHARING_DEFAULT|SHARING_ON/.test(app), 'O7 (v2.7.0): sharing is gone, not only switched off');

// ---------- cleanup inventory v3: H1 (U3), M4: share fields (v2.8.1: sharing is gone, inventory D3) ----------
{
  const r = finished(F, D, 'gx-2'), s = { v: 2, cur: r.id, checks: { [r.id]: r } }, x = F.reduce(s, 'import', F.forFile(r), ENV);
  ok(x.ok && !('sharedAt' in x.store.checks[r.id]), 'H1 (v2.8.1): a check replaced by its file has no share fields');
  const t = clone(r); t.Q.q4 = 'n'; t.sharedAt = '2026-11-24T11:00:00Z';
  const m = F.mergeTabs(s, { v: 2, cur: r.id, checks: { [r.id]: t } });
  ok(m.elsewhere === 'changed' && m.store.checks[r.id].Q.q4 === 'y' && !('sharedAt' in m.store.checks[r.id]), 'M4: this tab keeps its answers (no share fields)');
}
// L1 (U1): an old Partly in the action plan
{
  const r = finished(F, D, 'gx-2'); r.A.m3 = 'p';
  const m = L.resultModel(r, env), o = L.open(L.evaluate(r, TQ)), f = m.first.find(x => /Must-have/.test(x.sub));
  ok(f && /your answer: Not answered \(earlier answer: Partly, no longer offered\)/.test(f.sub), 'L1: first sub names the old answer: ' + (f && f.sub));
  ok(/^Answer again: “/.test(o[0]?.text) && /\(the earlier answer “Partly” is no longer offered\)$/.test(o[0]?.text), 'L1: the task reads "Answer again": ' + o[0]?.text);
  ok(m.people.some(p => p.items.some(a => /Not answered \(earlier answer: Partly/.test(a.tag))), 'L1: the action plan tag names it too');
  ok(!('answerState' in L) && !('byPerson' in L) && L.answerWord({ old: 'p' }) === 'Not answered (earlier answer: Partly, no longer offered)', 'L1 (v2.8.1, inventory D7): answerState and byPerson are gone (unused by the page); answerWord names an old answer');
}
// L2: Team tab, copy of a gone use case
ok(/DL\.answerWord\(/.test(team.slice(team.indexOf('function goneWord'), team.indexOf('function detailDyn'))) && !/DC\.ANSWER_WORD/.test(team), 'L2: detailGone words an old answer with answerWord');
ok(!('p' in C.ANSWER_WORD) && !('na' in C.ANSWER_WORD), 'L2 / dead code: ANSWER_WORD has no p, na');
// L3 (U4): different question sets of one use are not compared line by line
{
  const s1 = L.snapshot(L.evaluate(finished(F, D, 'gx-2'), TQ), '2026-11-20T10:00:00Z', 'gx-2', 'sigA');
  const s2 = Object.assign({}, s1, { at: '2026-11-24T10:00:00Z', total: s1.total - 1, known: s1.known - 1, sig: 'sigB' });
  const sn = L.since([s1, s2]);
  ok(sn && sn.compared === false && /asked with other questions, not compared line by line/.test(sn.lines.join(' ')), 'L3: other questions are not compared: ' + (sn && sn.lines.join(' | ')));
  ok(!L.sameSnap(s1, Object.assign({}, s1, { sig: 'x' })), 'L3: sameSnap includes the signature');
  ok(F.reduce({ v: 2, cur: 'a', checks: { a: Object.assign(finished(F, D, 'gx-2'), { id: 'a' }) } }, 'snap', s1, ENV).store.checks.a.snaps[0].sig === 'sigA', 'L3: the store keeps the signature of a snapshot');
}
// L5: undeclared page state
ok(/dlKind: null/.test(app) && /fileInfo: null/.test(app), 'L5: ui declares dlKind and fileInfo');
// dead code
ok(!('summaryText' in L) && !/summaryText/.test(app), 'dead code: summaryText removed');
ok(!/SYSTEMS_NOTE/.test(contentSrc) && !('READY_NONE' in C), 'dead code: SYSTEMS_NOTE and READY_NONE removed');
ok(!/catLink/.test(app) && /function detailButton\(u\)/.test(app), 'dead code: catLink renamed detailButton(u)');
ok(!/exbtn\[aria-expanded/.test(css) && !/What does this do/.test(css), 'dead code: the old explainer CSS removed');
ok(!/What does this do|very bottom/.test(app), 'L4: app.js comments describe the page as it is');

// ---------- the v2.4 fixture (saved by the committed v2.4 page) ----------
{
  const FX = JSON.parse(rd('tests/fixtures/v2.4-saved.json'));
  const info = {}, st = F.migrate(clone(FX.store), ENV, info), c1 = st && st.checks[FX.seen.check1.id], c2 = st && st.checks[FX.seen.check2.id];
  ok(st && c1 && c2 && !info.newer && !info.questionsChanged && !info.useChanged, 'v2.4 store opens with both checks and no notice');
  ok(c1.step === 'q' && c2.step === 'q' && !('sharedAt' in c1) && eq(c1.Qnew, ['q3', 'q4']), 'v2.4 store: both wait on step 2 (v2.6: questions 3 and 4 are new; was: on their result); v2.8.1: its share state is dropped');
  const m1 = L.resultModel(c1, env), m2 = L.resultModel(c2, env);
  ok(FX.seen.check1.levelName === 'Almost ready' && m1.level === 'almost' && m1.ev.pct === 56 && eq(Object.keys(c1.T).length, 8) && c1.T['gx-2.da1'] === 'k', 'v2.4 check 1 (6 of 10 must-haves Yes) is still Almost ready; v2.7.0: its gx-2 answers carry to the new questions (pe1 to pe1a and pe1b, x-auto to both limits questions); v2.8.2 (owner): its one stored "k" is Don’t know yet again and is kept (8 carry; it scores like a blank, so still 25 of 44 points = 56%)');
  ok(FX.seen.check2.levelName === 'Ready to start a pilot' && m2.level === 'almost' && m2.held.join() === 'none', 'v2.4 check 2 (None of these fits) was Ready, is Almost ready under rules v2.5 (O4)');
  ok(m1.since && /worked out with earlier rules/.test(m1.since.lines.concat(m1.since.earlier).join(' ') + ' ' + JSON.stringify(m1.since)) || (c1.snaps.length === 1 && c1.snaps[0].rules === 'v2.3 (24 Nov 2026)'), 'v2.4 snapshot kept with rules v2.3');
  const withNew = clone(c1); withNew.snaps.push(L.snapshot(L.evaluate(c1, TQ), '2026-11-25T10:00:00Z', c1.use, TQ.uses[c1.use].sig));
  const sn = L.since(withNew.snaps);
  ok(sn && sn.compared === false && /worked out with earlier rules/.test(sn.lines.join(' ')), 'v2.4 result is shown as worked out with earlier rules: ' + (sn && sn.lines[0]));
  const fr = F.cleanRec(FX.file.check, ENV, {}, { file: true });
  ok(fr && fr.step === 'q' && fr.use === 'gx-2' && !('sharedAt' in fr) && FX.file.rules === 'v2.3 (24 Nov 2026)', 'v2.4 file opens on step 2 (v2.6: was its result), unshared');
}

console.log('Headlines (rules v2.6):'); Object.entries(heads).forEach(([k, h]) => console.log('  ' + k + ': ' + h));
done();
