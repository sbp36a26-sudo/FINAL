// "Do you need AI?" v2.2 (24 Nov 2026): the use-case names a person reads and the use-case explainer (data/explain.json).
// v2.7.0 (questions-only): data/wording.json and the generator are gone. The names come from data/usecase_questions_only.json (the
// team's plain names; lg-2 and lg-3 renamed), the questions too (tests/questions.test.mjs). Section 1 (wording applied by the generator)
// is retired; the name and explainer checks stay.
// Run: node tools/readiness-2-questions/tests/v22.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, envOf, tester, finished, root } from './load.mjs';
import { explainModel } from '../build.mjs';
const { C, L, F, P, RC } = load();
const D = data(), TQ = D.tq, ENV = envOf(D, F);
const { ok, done } = tester('v22');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const Q = JSON.parse(rd('data/usecase_questions_only.json')), E = JSON.parse(rd('data/explain.json'));
const NAME = Object.fromEntries(Q.use_cases.map(u => [u.id, u.name]));
const ids = D.cat.depts.flatMap(d => d.uses.map(u => u.id));

// ---------- 1. names ----------
ids.forEach(id => ok(TQ.uses[id].name === NAME[id], 'name from the data file: ' + id));
let info = {};
const r1 = finished(F, D, 'rm-1'); r1.useName = D.cat.depts[0].uses[0].n;
const c1 = F.cleanRec(JSON.parse(JSON.stringify(r1)), ENV, info);
ok(c1.use === 'rm-1' && !info.useChanged && c1.useName === D.cat.depts[0].uses[0].n, 'a saved check keeps its use case: the record still stores the catalogue name');

// ---------- 1c. the plain name is what a person reads ----------
const env = { cat: D.cat, TQ, ex: D.ex, today: '2026-11-24' };
const rm = L.resultModel(finished(F, D, 'rm-1'), env);
ok(rm.path.endsWith(NAME['rm-1']) && rm.useName === NAME['rm-1'] && rm.catName === '', 'result: the data file\'s name in "Where it sits"; v2.7.0: no catalogue-name line (the catalogue name is no longer shipped)');
ok(rm.useTask === 'What it does: ' + E['rm-1'].does && rm.useHow === 'How the AI works: ' + E['rm-1'].how && rm.useLevel === L.useLevelLine(D.cat.depts[0].uses[0]), 'result: what it does and how the AI works replace the catalogue task text');
ok(P.model(finished(F, D, 'rm-1'), env).blocks.some(b => b.k === 'meta' && b.t === 'Use case: ' + rm.useName) && !P.model(finished(F, D, 'rm-1'), env).blocks.some(b => b.t === rm.path), 'PDF: the plain name as "Use case:" (v2.7: no "Where it sits" section)');
const pt = P.model(finished(F, D, 'rm-1'), env).blocks.map(b => b.t).join('\n');
ok(!pt.includes(rm.useTask) && !pt.includes(rm.useHow) && pt.includes(rm.useName), 'PDF (v2.7): the name only; what it does and how it works stay on the screen');
const rmNoEx = L.resultModel(finished(F, D, 'rm-1'), Object.assign({}, env, { ex: null }));
ok(rmNoEx.useTask === '' && rmNoEx.useHow === '', 'v2.7.0: without explainer data nothing is shown (the catalogue\'s research wording is not shipped)');
const app = rd('src/app.js');
ok(!/esc\(u\.n\)|esc\(pre\.n\)|USE\[rec\.use\]\.n\b|useName: u \? u\.n/.test(app), 'app.js: no catalogue name shown where the plain one belongs (picker, header, result, share copy, copy texts)');

// ---------- 2. the explainer data ----------
ok(eq(Object.keys(D.ex), ids) && ids.every(id => D.ex[id].does === E[id].does && D.ex[id].how === E[id].how && D.ex[id].does.length > 20 && D.ex[id].how.length > 20), 'explainer data for all 99, inlined as in data/explain.json');
ok(D.ex['kc-2'].does === 'Finds allergens in the menu text, labels the dishes and translates the menus.', 'kc-2 (v2.7.0): the reference to rules by authorities and the number it sourced are removed');
ok(!/AIHA|AI Hospitality Alliance|wikipedia/i.test(JSON.stringify(E)), 'no banned source in the explainer');
let threw = false; try { explainModel({ ...E, 'rm-1': { does: 'x', how: '' } }, ids); } catch (e) { threw = /rm-1/.test(e.message); } ok(threw, 'an empty explainer entry stops the build');
threw = false; try { const e2 = { ...E }; delete e2['hk-3']; explainModel(e2, ids); } catch (e) { threw = /hk-3/.test(e.message); } ok(threw, 'a missing explainer entry stops the build');
threw = false; try { explainModel({ ...E, 'zz-9': { does: 'x', how: 'y' } }, ids); } catch (e) { threw = /zz-9/.test(e.message); } ok(threw, 'a left-over explainer entry stops the build');
ok(L.explain(D.ex, 'gx-2').does === 'What it does: ' + E['gx-2'].does && L.explain(null, 'gx-2') === null, 'L.explain');
ok(ids.every(id => !TQ.uses[id].draft), 'v2.7.0: no draft marks');
done();
