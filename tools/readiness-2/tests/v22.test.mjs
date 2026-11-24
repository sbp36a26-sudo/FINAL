// "Do you need AI?" v2.2 (24 Nov 2026): the team's plain wording (data/wording.json) and the use-case explainer (data/explain.json).
// The browser proof (the "What does this do?" button and panel) was run with a Playwright script outside the repo; screenshots in reports/readiness-2-screens/wording/.
// Run: node tools/readiness-2/tests/v22.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, envOf, tester, finished, root } from './load.mjs';
import { tqSig, explainModel } from '../build.mjs';
import { generate, inputs, applyWording } from '../data/build-questions.mjs';
const { C, L, F, P, RC } = load();
const D = data(), TQ = D.tq, ENV = envOf(D, F);
const { ok, done } = tester('v22');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const W = JSON.parse(rd('data/wording.json')), E = JSON.parse(rd('data/explain.json')), J = JSON.parse(rd('data/usecase-questions.json'));
const src = inputs(), G = generate({ ...src, wording: null });
const ids = D.cat.depts.flatMap(d => d.uses.map(u => u.id));

// ---------- 1. wording: every key applied ----------
ok(Object.keys(W.names).length === 99 && Object.keys(W.qs).length === 661 && Object.keys(W.core).length === 21, 'wording.json: 99 names, 661 questions, 21 core fields');
Object.entries(W.names).forEach(([id, t]) => ok(J.uses[id].plain === t && TQ.uses[id].plain === t, 'name applied (file and page): ' + id));
Object.entries(W.qs).forEach(([k, t]) => { const [id, qid] = k.split('|'); ok(J.uses[id].qs.find(q => q.id === qid).q === t && TQ.uses[id].qs.find(q => q.id === qid).q === t, 'question applied (file and page): ' + k); });
Object.entries(W.core).forEach(([k, t]) => { const [id, f] = k.split('.'); const it = (id[0] === 'q' ? C.QUESTIONS : C.MUSTS).find(x => x.id === id); ok(it && it[f] === t, 'core field applied in src/content.js: ' + k); });
ok(J.uses['rm-1'].name === D.cat.depts[0].uses[0].n && D.cat.depts[0].uses[0].n !== J.uses['rm-1'].plain, 'the catalogue name stays as name (and in the catalogue model); the plain name is separate');
// nothing but the text changed
let same = 0, all = 0;
ids.forEach(id => G.uses[id].qs.forEach((g, i) => { const q = J.uses[id].qs[i]; all++; if (q.id === g.id && q.a === g.a && q.who === g.who && q.act === g.act && q.from === g.from && q.kind === g.kind && !!q.worded === (q.q !== g.q)) same++; }));
ok(same === all && all === 661, 'ids, areas, who, act, kind and from unchanged; worded marks exactly the changed texts (' + same + ' of ' + all + ')');
ok(J.uses['gx-2'].qs.every(q => typeof q.from === 'string') && TQ.uses['gx-2'].qs.every(q => 'from' in q), 'the from field is kept');
// unknown keys stop the build
const throws = (w, re) => { try { generate({ ...src, wording: w }); return false; } catch (e) { return re.test(e.message); } };
ok(throws({ names: { 'zz-1': 'X' }, qs: {} }, /names\.zz-1/), 'an unknown use id under names stops the build');
ok(throws({ names: {}, qs: { 'rm-1|zz9': 'X?' } }, /qs\.rm-1\|zz9/), 'an unknown question under qs stops the build');
ok(throws({ names: {}, qs: { 'zz-1|pe1': 'X?' } }, /qs\.zz-1\|pe1/), 'a question of an unknown use stops the build');
ok(throws({ names: { 'rm-1': ' ' }, qs: {} }, /names\.rm-1/), 'an empty name stops the build');
let threw = false; try { applyWording({ 'rm-1': { qs: [{ id: 'pe1', q: 'A?' }] } }, { qs: { 'rm-1|pe1': 'B?', 'rm-1|pe2': 'C?' } }); } catch (e) { threw = /rm-1\|pe2/.test(e.message); } ok(threw, 'applyWording names every key that matches nothing');
ok(eq(generate(src), J), 'the generator (with the wording, applied last) makes exactly data/usecase-questions.json');

// ---------- 1b. a wording-only change keeps saved answers ----------
ok(ids.every(id => J.uses[id].sig === tqSig(G.uses[id].qs) && TQ.uses[id].sig === J.uses[id].sig), 'the signature is taken before the wording: the same as v2.1 built (wording-only change keeps answers)');
const r0 = finished(F, D, 'gx-2'); r0.tqSig = tqSig(G.uses['gx-2'].qs); let info = {};
const c0 = F.cleanRec(JSON.parse(JSON.stringify(r0)), ENV, info);
ok(Object.keys(c0.T).length === TQ.uses['gx-2'].qs.length && !info.questionsChanged && c0.step === 'result', 'a v2.1 check of gx-2 opens with every tailored answer');
const r1 = finished(F, D, 'rm-1'); r1.useName = D.cat.depts[0].uses[0].n; info = {};
const c1 = F.cleanRec(JSON.parse(JSON.stringify(r1)), ENV, info);
ok(c1.use === 'rm-1' && !info.useChanged && c1.useName === D.cat.depts[0].uses[0].n, 'a saved check keeps its use case: the record still stores the catalogue name');
const fx = JSON.parse(rd('tests/fixtures/v2.0-store.json')); info = {};
const m = F.migrate(fx, ENV, info);
ok(m && Object.keys(m.checks.dynmwuiu56n115l5.T).length === 6 && Object.keys(m.checks.dynmwuiu5ee2e47l.T).length === 7 && !info.questionsChanged && !info.useChanged, 'the v2.0 fixture store opens with its tailored answers (rm-1: 6, hr-2: 7)');

// ---------- 1c. the plain name is what a person reads ----------
const env = { cat: D.cat, TQ, RC, M: RC.model({ rdy: D.rc.rdy, cat: D.cat, reg: D.rc.reg }), ex: D.ex, today: '2026-11-24' };
const rm = L.resultModel(finished(F, D, 'rm-1'), env);
ok(rm.path.endsWith(W.names['rm-1']) && rm.useName === W.names['rm-1'] && rm.catName === 'Catalogue name: ' + D.cat.depts[0].uses[0].n, 'result: plain name in "Where it sits", catalogue name in small text');
ok(rm.useTask === 'What it does: ' + E['rm-1'].does && rm.useHow === 'How the AI works: ' + E['rm-1'].how && rm.useLevel === L.useLevelLine(D.cat.depts[0].uses[0]), 'result: what it does and how the AI works replace the catalogue task text');
ok(L.summaryText(rm).includes('Where it sits: ' + rm.path), 'summary: the plain name');
const pt = P.model(finished(F, D, 'rm-1'), env).blocks.map(b => b.t).join('\n');
ok(pt.includes(rm.useTask) && pt.includes(rm.useHow) && pt.includes(rm.catName) && pt.includes(rm.path), 'PDF: plain name, what it does, how it works, catalogue name');
const rmNoEx = L.resultModel(finished(F, D, 'rm-1'), Object.assign({}, env, { ex: null }));
ok(rmNoEx.useTask === 'What AI does: ' + D.cat.depts[0].uses[0].task && rmNoEx.useHow === '', 'without explainer data the catalogue task line comes back');
const app = rd('src/app.js');
ok(!/esc\(u\.n\)|esc\(pre\.n\)|USE\[rec\.use\]\.n\b|useName: u \? u\.n/.test(app), 'app.js: no catalogue name shown where the plain one belongs (picker, header, result, share copy, copy texts)');

// ---------- 2. the explainer data ----------
ok(eq(Object.keys(D.ex), ids) && ids.every(id => D.ex[id].does === E[id].does && D.ex[id].how === E[id].how && D.ex[id].does.length > 20 && D.ex[id].how.length > 20), 'explainer data for all 99, inlined as in data/explain.json');
ok(/14 EU allergens \(EU Regulation 1169\/2011, Annex II\)/.test(D.ex['kc-2'].does), 'kc-2: the 14 EU allergens carry their source');
ok(!/AIHA|AI Hospitality Alliance|wikipedia/i.test(JSON.stringify(E)), 'no banned source in the explainer');
threw = false; try { explainModel({ ...E, 'rm-1': { does: 'x', how: '' } }, ids); } catch (e) { threw = /rm-1/.test(e.message); } ok(threw, 'an empty explainer entry stops the build');
threw = false; try { const e2 = { ...E }; delete e2['hk-3']; explainModel(e2, ids); } catch (e) { threw = /hk-3/.test(e.message); } ok(threw, 'a missing explainer entry stops the build');
threw = false; try { explainModel({ ...E, 'zz-9': { does: 'x', how: 'y' } }, ids); } catch (e) { threw = /zz-9/.test(e.message); } ok(threw, 'a left-over explainer entry stops the build');
ok(L.explain(D.ex, 'gx-2').does === 'What it does: ' + E['gx-2'].does && L.explain(null, 'gx-2') === null, 'L.explain');
ok(ids.filter(id => TQ.uses[id].draft).length === 8, 'eight draft use cases, whose panels carry the draft note');
done();
