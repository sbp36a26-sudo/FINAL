// "Do you need AI?" v2.3 (24 Nov 2026, owner): four answers only on step 3 (must-haves) and step 5 (tailored questions):
// Yes, Planned, not done yet, No, Don't know yet. "Partly" and "Doesn't apply" are no longer offered.
// Old records (localStorage, saved files, shared team copies) that hold "p" or "na" open without error; such an answer is shown
// as unanswered with a short line, is not turned into another answer, and counts as not answered until the person picks again.
// Fixture: tests/fixtures/v2.2-old-answers.json (written before the code change).
// Run: node tools/readiness-2/tests/v23.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, envOf, tester, finished, root } from './load.mjs';
import { BANNED, nameHash } from '../build.mjs';
const { C, L, F, P } = load();
const D = data(), TQ = D.tq, ENV = envOf(D, F);
const { ok, done } = tester('v23');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const FX = JSON.parse(rd('tests/fixtures/v2.2-old-answers.json'));
const clone = o => JSON.parse(JSON.stringify(o));
const LINE_P = 'Your earlier answer was Partly; this answer is no longer offered, please choose again.';
const LINE_NA = 'Your earlier answer was Doesn’t apply; this answer is no longer offered, please choose again.';

// ---------- 1. what is offered ----------
ok(eq(C.ANSWERS, [['y', 'Yes'], ['pl', 'Planned, not done yet'], ['n', 'No']]), 'the three answers, in the owner\'s order (v2.7.1: no fourth answer)');
ok(eq(C.Q_ANSWERS, [['y', 'Yes'], ['n', 'No'], ['u', 'Not sure']]), 'the five C-R-I-S-P questions keep Yes / No / Not sure');
ok(!('NA' in C) || C.NA == null, 'no "Doesn\'t apply" option left in the content');
ok(eq(Object.keys(L.A_OK).sort(), ['n', 'pl', 'y']), 'logic accepts only the three answers (v2.7.1)');
ok(L.POINTS.y === 2 && L.POINTS.pl === 1 && L.POINTS.n === 0 && !('p' in L.POINTS), 'points: Yes 2, Planned 1, No 0; no Partly');
ok(L.RULES === 'v2.6 (24 Nov 2026)', 'rules version bumped (v2.3, v2.5, now v2.6): ' + L.RULES);
const app = rd('src/app.js');
ok(!/C\.NA\b|\['na'/.test(app), 'app.js: step 5 no longer adds a "Doesn\'t apply" option');
ok(/radios\(m\.id, C\.ANSWERS,/.test(app) && /radios\(q\.id, C\.ANSWERS,/.test(app), 'app.js: steps 3 and 5 render C.ANSWERS (the four) and nothing else');

// ---------- 2. answering: p and na cannot be set any more ----------
let s = F.blankStore(); const id0 = s.cur;
const go = (ev, arg) => { const r = F.reduce(s, ev, arg, ENV); if (r.ok) s = r.store; return r.ok; };
go('begin'); go('hotel', { k: 'type', v: 'independent' }); go('next'); F.QIDS.forEach(id => go('answer', { id, value: id === 'q1' ? 'n' : 'y' })); go('next'); // v2.6: Q1 No goes on
ok(F.cur(s).step === 'must', 'walked to step 3');
ok(!go('answer', { id: 'm1', value: 'p' }) && !go('answer', { id: 'm1', value: 'na' }), 'step 3: Partly and Doesn\'t apply are refused');
['y', 'pl', 'n'].forEach(v => ok(go('answer', { id: 'm1', value: v }) && F.cur(s).A.m1 === v, 'step 3: ' + v + ' is accepted'));
ok(!go('answer', { id: 'm1', value: 'k' }), 'step 3: a stored "k" is refused (v2.7.1)');
F.MUST_IDS.forEach(id => go('answer', { id, value: 'y' })); go('next'); go('cat', 'Commercial'); go('dept', 'rm'); go('use', 'rm-1'); go('next');
ok(F.cur(s).step === 'tailored', 'walked to step 5');
ok(!go('answer', { id: 'rm-1.pe1', value: 'p' }) && !go('answer', { id: 'rm-1.pe1', value: 'na' }), 'step 5: Partly and Doesn\'t apply are refused');
['y', 'pl', 'n'].forEach(v => ok(go('answer', { id: 'rm-1.pe1', value: v }) && F.cur(s).T['rm-1.pe1'] === v, 'step 5: ' + v + ' is accepted'));
ok(!go('answer', { id: 'rm-1.pe1', value: 'k' }), 'step 5: a stored "k" is refused (v2.7.1)');
ok(F.cur(s).id === id0, 'same check throughout');

// ---------- 3. the old saved store (localStorage) ----------
let info = {};
/* v2.6: these records were saved before step 2 changed, so they would wait on step 2 (questions 3 and 4 are new; tests/v26.test.mjs).
   To test the Partly / Doesn't apply mechanism on its own, step 2 is given as answered in the v2.6 meaning (qv 2). */
const asV26 = r => Object.assign(r, { qv: 2, Q: { q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' } });
const FXS = clone(FX.store); Object.values(FXS.checks).forEach(asV26);
const st = F.migrate(FXS, ENV, info);
ok(st && Object.keys(st.checks).length === 2 && st.cur === 'dynoldmust01' && !info.newer && !info.questionsChanged && !info.useChanged, 'old store: opens, both checks kept, no notice');
const a = st.checks.dynoldmust01, b = st.checks.dynoldtail02;
ok(a.A.m5 === 'p' && a.T['rm-1.sk1'] === 'p' && a.T['rm-1.te1'] === 'na' && b.T['rm-1.te1'] === 'na', 'old answers are kept as they were (not turned into another answer)');
ok(a.A.m3 === 'pl' && a.By.m3 === '2027-03-01' && a.T['rm-1.or1'] === 'n' && !('rm-1.fi1' in a.T), 'the other answers and the Planned date are kept (v2.7.1: a stored "k" is blank and not kept)');
ok(a.step === 'tailored', 'v2.7.1: this v2.2 record has questions with no carried answer, so it reopens on step 5 (v2.7.0), not on step 3: its old must-have answer no longer holds it: ' + a.step);
ok(b.step === 'tailored', 'the same reopen on step 5 (v2.7.0): ' + b.step);
let ca = F.ctxOf(a, ENV), cb = F.ctxOf(b, ENV);
ok(!ca.mustDone && !ca.tailDone && cb.mustDone && !cb.tailDone, 'an old answer counts as not answered for the step guards');
ok(F.reachable('result', ca) && F.reachable('result', cb) && F.reachable('where', ca), 'v2.7.1: the result is reached without picking again (old answers count as not answered, like blanks)');
// the line shown on the question
ok(L.oldLine('p') === LINE_P && L.oldLine('na') === LINE_NA && L.oldLine('y') === '' && L.oldLine('') === '' && L.oldLine(undefined) === '', 'the short line, for Partly and Doesn\'t apply only');
ok(/data-old=/.test(app) && /L\.oldLine\(/.test(app), 'app.js shows the line under a question whose saved answer is no longer offered');
// the score: exactly as if the question were not answered
const strip = r => { const o = clone(r); Object.keys(o.A).forEach(k => { if (o.A[k] === 'p' || o.A[k] === 'na') delete o.A[k]; }); Object.keys(o.T).forEach(k => { if (o.T[k] === 'p' || o.T[k] === 'na') delete o.T[k]; }); return o; };
for (const [tag, r] of [['must + tailored', a], ['tailored only', b]]) {
  const e1 = L.evaluate(r, TQ), e2 = L.evaluate(strip(r), TQ);
  ok(eq([e1.pts, e1.max, e1.pct, e1.level, e1.counts, e1.must], [e2.pts, e2.max, e2.pct, e2.level, e2.counts, e2.must]), tag + ': the score treats an old answer as not answered');
  ok(e1.items.every(it => it.state !== 'partly' && it.state !== 'na'), tag + ': no Partly or Doesn\'t apply state is left');
}
const ia = L.evaluate(a, TQ).items;
ok(ia.find(it => it.key === 'm5').v === '' && ia.find(it => it.key === 'm5').old === 'p' && ia.find(it => it.key === 'rm-1.te1').old === 'na' && ia.find(it => it.key === 'm1').old === '', 'items carry the old answer separately (v empty, old p / na)');
ok(L.evaluate(a, TQ).counts.total === 17, 'every question asked is counted (10 must-haves + 7 for rm-1 since v2.7.0), none left out as "Doesn\'t apply"');
// picking again
s = { v: 2, cur: a.id, checks: { [a.id]: a } };
ok(go('back') && go('back') && F.cur(s).step === 'must', 'to pick again: Back from step 5 to step 3 (step 4, then step 3)');
ok(!go('answer', { id: 'm5', value: 'p' }), 'Partly cannot be chosen again');
ok(go('answer', { id: 'm5', value: 'pl' }) && F.cur(s).A.m5 === 'pl', 'choosing Planned replaces the old Partly');
ok(go('next') && F.cur(s).step === 'where' && go('next') && F.cur(s).step === 'tailored', 'then Next goes on from step 3 to step 5 (v2.7.1: blanks do not stop Next)');
ok(!F.ctxOf(F.cur(s), ENV).tailDone, 'step 5 still holds two old answers');
ok(go('answer', { id: 'rm-1.sk1', value: 'n' }) && go('answer', { id: 'rm-1.te1', value: 'y' }) && go('answer', { id: 'rm-1.n1', value: 'y' }) && go('next') && F.cur(s).step === 'result', 'after picking again the result is reached');
// results computed under earlier rules
const ev3 = L.evaluate(F.cur(s), TQ), snaps = F.cur(s).snaps.concat([L.snapshot(ev3, '2026-11-24T12:00:00.000Z', 'rm-1')]);
const sn = L.since(snaps);
ok(sn && !sn.compared && sn.lines[0].includes(L.EARLIER_RULES) && sn.lines[0].includes('v2.1 (24 Nov 2026)'), 'the result kept under rules v2.1 shows as "worked out with earlier rules"');
ok(sn.earlier.length === 1 && sn.earlier[0].endsWith('(' + L.EARLIER_RULES + ')'), 'and is marked in the list');

// ---------- 4. a saved file ----------
info = {};
const fr = F.cleanRec(asV26(clone(FX.file.check)), ENV, info, { file: true });
ok(fr && fr.A.m1 === 'p' && fr.T['rm-1.pe1'] === 'na' && fr.step === 'tailored' && !info.questionsChanged, 'old file: reopens on step 5 (v2.7.0), old answers kept as they were');
const imp = F.reduce(F.blankStore(), 'import', asV26(clone(FX.file.check)), ENV);
ok(imp.ok && F.cur(imp.store).id === 'dynoldfile03' && F.cur(imp.store).step === 'tailored', 'old file: the import event takes it');
const ef = L.evaluate(fr, TQ);
ok(ef.items.find(it => it.key === 'm1').old === 'p' && ef.items.find(it => it.key === 'rm-1.pe1').old === 'na' && ef.counts.total === 17, 'old file: both old answers count as not answered');

// ---------- 5. (v2.7.0) the Team tab section is gone: the standalone tool has no hub, no sharing and no Team tab ----------
// ---------- 6. the wording that explains the score ----------
const fin = finished(F, D, 'rm-1'); fin.A.m2 = 'pl'; fin.T['rm-1.sk1'] = 'n'; fin.T['rm-1.fi1'] = 'k';
const env = { cat: D.cat, TQ, today: '2026-11-24' };
const m = L.resultModel(fin, env), meth = m.method.join('\n'), pdfT = P.model(fin, env).blocks.map(x => x.t).join('\n');
ok(m.method[0] === 'Points per answer: Yes 2 · Planned, not done yet 1 · No 0 · Not answered yet 0.', 'how this was worked out: the three answers and their points: ' + m.method[0]);
for (const [tag, t] of [['method', meth], ['PDF', pdfT], ['score note', m.scoreSub + ' ' + C.SCORE_NOTE]]) ok(!/Partly|partly|Doesn’t apply|does not apply|Doesn't apply/.test(t), tag + ': no Partly or Doesn\'t apply');
const all = L.resultModel(finished(F, D, 'rm-1'), env);
ok(P.model(finished(F, D, 'rm-1'), env).blocks.some(x => x.t === 'Every question is answered Yes.'), 'PDF: "Every question is answered Yes." (no "or does not apply")');
ok(all.level === 'ready', 'all Yes is still Ready');

// ---------- 7. v2.4 (third owner decision): the detail layer, bundled from the catalogue at build time ----------
{
  const catHtml = readFileSync(join(root, '../use-case-catalogue/index.html'), 'utf8');
  const X = JSON.parse(catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  const ids = []; let nSrc = 0; const FIX = JSON.parse(rd('data/sources_fixes.json')), EDITS = JSON.parse(rd('data/sources_edits.json'));
  X.depts.forEach(d => d.uses.forEach((u, i) => {
    const id = d.id + '-' + (i + 1), b = D.detail[id]; if (id === 'lg-2') return; ids.push(id); // v2.8.0: lg-2 removed
    /* v2.8.0: every catalogue source is still there (by its address), unless the review removed it (sources_fixes / sources_edits) or
       an audited sources_v2 entry replaces it; nothing is left out for a banned word any more (owner decision 2) */
    const urlOf = s => s[0] === 'r' ? X.src[s[1]][1] || '' : s[0] === 'l' ? s[2] || '' : s[3] || '';
    const gone = new Set(FIX.filter(f => f.use_case === id && ['remove', 'replace'].includes(f.action)).map(f => f.url).concat(EDITS.edits.filter(e => e.use === id && (e.remove || (e.set && e.set.url))).map(e => e.url)).concat(id === 'fa-7' ? ['https://justt.ai/hospitality'] : []));
    const want = (u.srcs || []).map(urlOf).filter(x => x && !gone.has(x));
    nSrc += want.length;
    ok(b && !('ai' in b) && want.every(x => b.srcs.some(e => e.u === x)), id + ': every catalogue source not removed by the review is bundled (' + want.length + '; v2.5: no technique notes, council BUILD NOW 8)');
    const cu = D.cat.depts.find(x => x.id === d.id).uses.find(y => y.id === id); ok(cu.alias === nameHash(u.n) && !('task' in cu) && (cu.use || '') === (u.use || ''), id + ': rating from the catalogue, its name kept as a hash (v2.7.0: the data file\'s name is shown, no task text)');
  }));
  ok(ids.length === 98 && eq(Object.keys(D.detail).sort(), ids.slice().sort()), 'detail for all 98 listed use cases, none left over (v2.8.0: lg-2 removed)');
  ok(Object.values(D.detail).every(x => eq(Object.keys(x), ['srcs', 'thin', 'note', 'nV2'])), 'only the fields the layer needs are bundled (v2.8.0: srcs, thin, note, nV2; no technique notes, council BUILD NOW 8)');
  ok(Object.values(D.detail).every(x => x.srcs.every(s => ['c', 'h', 'r', 'l', 'v'].includes(s.t) && (s.n || s.x) && /^https:\/\//.test(s.u))), 'every source has a type, a name or text, and an https link (' + nSrc + ' catalogue sources checked)');
  ok(!/data-act="catalogue"|use-case-catalogue\/index\.html/.test(app), 'app.js: no link or hub message to the catalogue tab is left');
  ok((app.match(/data-act="detail"/g) || []).length === 2 && /Details and sources/.test(app) && (app.match(/>More detail</g) || []).length === 1 && !/data-act="explain"/.test(app), 'two buttons open the layer: step 4 row and the result (owner 24 Nov 2026: no "What does this do?" button)');
  ok(/showModal\(\)/.test(app) && /dialog id="detail"/.test(rd('src/page.html')) && /@media print\{ dialog\.detail\{display:none!important\} \}/.test(rd('src/style.css')), 'a native dialog, opened modal, never printed');
  ok(!/AIHA|AI Hospitality Alliance|wikipedia/i.test(JSON.stringify(D.detail)), 'no banned source in the bundled detail');
}
done();
