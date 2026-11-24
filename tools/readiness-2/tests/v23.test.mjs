// "Do you need AI?" v2.3 (24 Nov 2026, owner): four answers only on step 3 (must-haves) and step 5 (tailored questions):
// Yes, Planned, not done yet, No, Don't know yet. "Partly" and "Doesn't apply" are no longer offered.
// Old records (localStorage, saved files, shared team copies) that hold "p" or "na" open without error; such an answer is shown
// as unanswered with a short line, is not turned into another answer, and counts as not answered until the person picks again.
// Fixture: tests/fixtures/v2.2-old-answers.json (written before the code change).
// Run: node tools/readiness-2/tests/v23.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, envOf, tester, finished, root } from './load.mjs';
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
ok(eq(C.ANSWERS, [['y', 'Yes'], ['pl', 'Planned, not done yet'], ['n', 'No'], ['k', 'Don’t know yet']]), 'the four answers, in the owner\'s order');
ok(eq(C.Q_ANSWERS, [['y', 'Yes'], ['n', 'No'], ['u', 'Not sure']]), 'the five C-R-I-S-P questions keep Yes / No / Not sure');
ok(!('NA' in C) || C.NA == null, 'no "Doesn\'t apply" option left in the content');
ok(eq(Object.keys(L.A_OK).sort(), ['k', 'n', 'pl', 'y']), 'logic accepts only the four answers');
ok(L.POINTS.y === 2 && L.POINTS.pl === 1 && L.POINTS.n === 0 && !('p' in L.POINTS), 'points: Yes 2, Planned 1, No 0; no Partly');
ok(L.RULES === 'v2.3 (24 Nov 2026)', 'rules version bumped: ' + L.RULES);
const app = rd('src/app.js');
ok(!/C\.NA\b|\['na'/.test(app), 'app.js: step 5 no longer adds a "Doesn\'t apply" option');
ok(/radios\(m\.id, C\.ANSWERS,/.test(app) && /radios\(q\.id, C\.ANSWERS,/.test(app), 'app.js: steps 3 and 5 render C.ANSWERS (the four) and nothing else');

// ---------- 2. answering: p and na cannot be set any more ----------
let s = F.blankStore(); const id0 = s.cur;
const go = (ev, arg) => { const r = F.reduce(s, ev, arg, ENV); if (r.ok) s = r.store; return r.ok; };
go('begin'); go('hotel', { k: 'type', v: 'independent' }); go('next'); F.QIDS.forEach(id => go('answer', { id, value: 'y' })); go('next');
ok(F.cur(s).step === 'must', 'walked to step 3');
ok(!go('answer', { id: 'm1', value: 'p' }) && !go('answer', { id: 'm1', value: 'na' }), 'step 3: Partly and Doesn\'t apply are refused');
['y', 'pl', 'n', 'k'].forEach(v => ok(go('answer', { id: 'm1', value: v }) && F.cur(s).A.m1 === v, 'step 3: ' + v + ' is accepted'));
F.MUST_IDS.forEach(id => go('answer', { id, value: 'y' })); go('next'); go('cat', 'Commercial'); go('dept', 'rm'); go('use', 'rm-1'); go('next');
ok(F.cur(s).step === 'tailored', 'walked to step 5');
ok(!go('answer', { id: 'pe1', value: 'p' }) && !go('answer', { id: 'pe1', value: 'na' }), 'step 5: Partly and Doesn\'t apply are refused');
['y', 'pl', 'n', 'k'].forEach(v => ok(go('answer', { id: 'pe1', value: v }) && F.cur(s).T.pe1 === v, 'step 5: ' + v + ' is accepted'));
ok(F.cur(s).id === id0, 'same check throughout');

// ---------- 3. the old saved store (localStorage) ----------
let info = {};
const st = F.migrate(clone(FX.store), ENV, info);
ok(st && Object.keys(st.checks).length === 2 && st.cur === 'dynoldmust01' && !info.newer && !info.questionsChanged && !info.useChanged, 'old store: opens, both checks kept, no notice');
const a = st.checks.dynoldmust01, b = st.checks.dynoldtail02;
ok(a.A.m5 === 'p' && a.T.sk1 === 'p' && a.T.te1 === 'na' && b.T.te1 === 'na', 'old answers are kept as they were (not turned into another answer)');
ok(a.A.m3 === 'pl' && a.By.m3 === '2027-03-01' && a.T.or1 === 'n' && a.T.fi1 === 'k', 'the other answers and the Planned date are kept');
ok(a.step === 'must', 'a check with an old must-have answer opens on step 3 (it was on its result): ' + a.step);
ok(b.step === 'tailored', 'a check with an old tailored answer only opens on step 5: ' + b.step);
let ca = F.ctxOf(a, ENV), cb = F.ctxOf(b, ENV);
ok(!ca.mustDone && !ca.tailDone && cb.mustDone && !cb.tailDone, 'an old answer counts as not answered for the step guards');
ok(!F.reachable('result', ca) && !F.reachable('result', cb) && !F.reachable('where', ca), 'the result cannot be reached until they pick again');
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
ok(ia.find(it => it.key === 'm5').v === '' && ia.find(it => it.key === 'm5').old === 'p' && ia.find(it => it.key === 'te1').old === 'na' && ia.find(it => it.key === 'm1').old === '', 'items carry the old answer separately (v empty, old p / na)');
ok(L.evaluate(a, TQ).counts.total === 16, 'every question asked is counted (10 must-haves + 6 tailored), none left out as "Doesn\'t apply"');
// picking again
s = { v: 2, cur: a.id, checks: { [a.id]: a } };
ok(!go('answer', { id: 'm5', value: 'p' }), 'Partly cannot be chosen again');
ok(go('answer', { id: 'm5', value: 'pl' }) && F.cur(s).A.m5 === 'pl', 'choosing Planned replaces the old Partly');
ok(F.ctxOf(F.cur(s), ENV).mustDone && go('next') && F.cur(s).step === 'where' && go('next') && F.cur(s).step === 'tailored', 'then step 3 is done and step 5 is next');
ok(!F.ctxOf(F.cur(s), ENV).tailDone, 'step 5 still holds two old answers');
ok(go('answer', { id: 'sk1', value: 'n' }) && go('answer', { id: 'te1', value: 'y' }) && F.ctxOf(F.cur(s), ENV).tailDone && go('next') && F.cur(s).step === 'result', 'after picking again the result is reached');
// results computed under earlier rules
const ev3 = L.evaluate(F.cur(s), TQ), snaps = F.cur(s).snaps.concat([L.snapshot(ev3, '2026-11-24T12:00:00.000Z', 'rm-1')]);
const sn = L.since(snaps);
ok(sn && !sn.compared && sn.lines[0].includes(L.EARLIER_RULES) && sn.lines[0].includes('v2.1 (24 Nov 2026)'), 'the result kept under rules v2.1 shows as "worked out with earlier rules"');
ok(sn.earlier.length === 1 && sn.earlier[0].endsWith('(' + L.EARLIER_RULES + ')'), 'and is marked in the list');

// ---------- 4. a saved file ----------
info = {};
const fr = F.cleanRec(clone(FX.file.check), ENV, info, { file: true });
ok(fr && fr.A.m1 === 'p' && fr.T.pe1 === 'na' && fr.step === 'must' && !info.questionsChanged, 'old file: opens on step 3, old answers kept as they were');
const imp = F.reduce(F.blankStore(), 'import', clone(FX.file.check), ENV);
ok(imp.ok && F.cur(imp.store).id === 'dynoldfile03' && F.cur(imp.store).step === 'must', 'old file: the import event takes it');
const ef = L.evaluate(fr, TQ);
ok(ef.items.find(it => it.key === 'm1').old === 'p' && ef.items.find(it => it.key === 'pe1').old === 'na' && ef.counts.total === 16, 'old file: both old answers count as not answered');

// ---------- 5. a shared team copy (the Team tab recomputes it with the current rules) ----------
const sh = FX.shared;
const dynRec = x => ({ Q: x.Q || {}, A: x.answers || {}, By: x.by || {}, use: x.useId || 'none', dept: x.dept || '', cat: x.cat || '', T: x.tailored || {}, TBy: x.tby || {}, hotel: { type: x.type, country: x.country, role: x.role, name: '' }, snaps: [] });
let threw = false, es; try { es = L.evaluate(dynRec(sh), TQ); L.method(es); L.open(es); L.mustLine(es); L.scoreSub(es); } catch (e) { threw = true; console.log(e); }
ok(!threw && es && es.items.filter(it => it.old).length === 3, 'shared copy: recomputed without error; three old answers marked');
ok(eq([es.pts, es.max, es.level], (() => { const e = L.evaluate(strip(dynRec(sh)), TQ); return [e.pts, e.max, e.level]; })()), 'shared copy: old answers count as not answered');
ok(L.answerWord(es.items.find(it => it.key === 'm5')) === 'Not answered (earlier answer: Partly, no longer offered)' && L.answerWord(es.items.find(it => it.key === 'te1')) === 'Not answered (earlier answer: Doesn’t apply, no longer offered)', 'shared copy: the Team tab words an old answer as not answered, naming the earlier one');
ok(L.answerWord(es.items.find(it => it.key === 'fi1')) === 'Don’t know yet' && L.answerWord(es.items.find(it => it.key === 'm1')) === 'Yes', 'other answers keep their words');
const team = readFileSync(join(root, '../readiness-check/src/team.js'), 'utf8');
ok(/DL\.answerWord\(it\)/.test(team) && !/Partly 1/.test(team.slice(team.indexOf('function dynCard'), team.indexOf('function flowCard'))), 'team.js: rows use the answer word; the v2 rules card no longer lists Partly');
ok(!/Doesn\\'t apply/.test(team.slice(team.indexOf('function dynCard'), team.indexOf('function flowCard'))), 'team.js: the v2 rules card no longer lists Doesn\'t apply');
ok(DC_word(), 'team.js: a copy whose use case is gone still names an old must-have answer');
function DC_word() { return C.ANSWER_WORD.p === 'Partly' && C.ANSWER_WORD.na === 'Doesn’t apply'; }

// ---------- 6. the wording that explains the score ----------
const fin = finished(F, D, 'rm-1'); fin.A.m2 = 'pl'; fin.T.sk1 = 'n'; fin.T.fi1 = 'k';
const env = { cat: D.cat, TQ, today: '2026-11-24' };
const m = L.resultModel(fin, env), meth = m.method.join('\n'), pdfT = P.model(fin, env).blocks.map(x => x.t).join('\n');
ok(m.method[0] === 'Points per answer: Yes 2 · Planned, not done yet 1 · No 0 · Don’t know yet 0.', 'how this was worked out: the four answers and their points: ' + m.method[0]);
for (const [tag, t] of [['method', meth], ['summary', L.summaryText(m)], ['PDF', pdfT], ['score note', m.scoreSub + ' ' + C.SCORE_NOTE]]) ok(!/Partly|partly|Doesn’t apply|does not apply|Doesn't apply/.test(t), tag + ': no Partly or Doesn\'t apply');
const all = L.resultModel(finished(F, D, 'rm-1'), env);
ok(P.model(finished(F, D, 'rm-1'), env).blocks.some(x => x.t === 'Every question is answered Yes.'), 'PDF: "Every question is answered Yes." (no "or does not apply")');
ok(all.level === 'ready', 'all Yes is still Ready');

// ---------- 7. v2.4 (third owner decision): the detail layer, bundled from the catalogue at build time ----------
{
  const catHtml = readFileSync(join(root, '../use-case-catalogue/index.html'), 'utf8');
  const X = JSON.parse(catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  const ids = []; let nSrc = 0;
  X.depts.forEach(d => d.uses.forEach((u, i) => {
    const id = d.id + '-' + (i + 1), b = D.detail[id]; ids.push(id);
    const want = (u.srcs || []).map(s => s[0] === 'r' ? ['r', X.src[s[1]][0], s[2] || '', X.src[s[1]][1] || ''] : s[0] === 'c' || s[0] === 'h' ? [s[0], s[1], s[2] || '', s[3] || ''] : ['l', s[1], '', s[2] || '']);
    nSrc += want.length;
    ok(b && b.ai === (u.ai || '') && eq(b.srcs, want), id + ': bundled detail equals the catalogue entry (technique and ' + want.length + ' sources, in its order)');
    const cu = D.cat.depts.find(x => x.id === d.id).uses[i]; ok(cu.n === u.n && cu.task === u.task && (cu.use || '') === (u.use || ''), id + ': name, task and rating from the catalogue');
  }));
  ok(ids.length === 99 && eq(Object.keys(D.detail).sort(), ids.slice().sort()), 'detail for all 99 use cases, none left over');
  ok(Object.values(D.detail).every(x => eq(Object.keys(x), ['ai', 'srcs'])), 'only the fields the layer needs are bundled');
  ok(Object.values(D.detail).every(x => x.srcs.every(s => ['c', 'h', 'r', 'l'].includes(s[0]) && s[1] && (!s[3] || /^https?:\/\//.test(s[3])))), 'every source has a type, a name and, where given, an http(s) link (' + nSrc + ' sources)');
  ok(!/data-act="catalogue"|use-case-catalogue\/index\.html/.test(app), 'app.js: no link or hub message to the catalogue tab is left');
  ok((app.match(/data-act="detail"/g) || []).length === 3 && /Details and sources/.test(app) && (app.match(/>More detail</g) || []).length === 2, 'three buttons open the layer: step 4 row, the explainer, the result');
  ok(/showModal\(\)/.test(app) && /dialog id="detail"/.test(rd('src/page.html')) && /@media print\{ dialog\.detail\{display:none!important\} \}/.test(rd('src/style.css')), 'a native dialog, opened modal, never printed');
  ok(!/AIHA|AI Hospitality Alliance|wikipedia/i.test(JSON.stringify(D.detail)), 'no banned source in the bundled detail');
}
done();
