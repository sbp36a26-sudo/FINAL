// The built page (index.html): its data is read at build time from the catalogue and the questions-only data, never copied by hand;
// counts are computed. v2.7.0: no AI Register files, no readiness-check rules or store inlined (no legal content, no hub, no sharing).
// Run: node tools/readiness-2-questions/tests/build.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, data, tester } from './load.mjs';
import { catalogueModel, detailModel, tqModel, explainModel, nameHash, BANNED } from '../build.mjs';
const { C, L, F } = load();
const { ok, done } = tester('build');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const html = rd('index.html'), D = data();
const catHtml = rd('../use-case-catalogue/index.html'), Q = JSON.parse(rd('data/usecase_questions_only.json'));
const X = JSON.parse(catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);

ok(eq(D.cat, catalogueModel(catHtml, Q)), 'the inlined catalogue equals the catalogue now, with the data file\'s names (rebuild after it changes)');
ok(D.cat.nUses === 99 && D.cat.nDepts === 15 && D.cat.cats.length === 4 && D.cat.depts.reduce((a, d) => a + d.uses.length, 0) === D.cat.nUses, '4 areas, 15 departments, 99 use cases, counted');
D.cat.depts.forEach(d => d.uses.forEach((u, i) => ok(u.id === d.id + '-' + (i + 1), 'use-case id is <dept>-<n>: ' + u.id)));
ok(D.cat.depts.every(d => d.uses.every(u => !('task' in u) && !('kw' in u) && !('notTool' in u))), 'no catalogue description, search words or register flags are shipped');
ok(D.cat.depts.find(d => d.id === 'lg').name === 'Sustainability & Governance', 'the lg department carries the data file\'s name');
ok(X.depts.every(d => d.uses.every((u, i) => D.cat.depts.find(x => x.id === d.id).uses[i].alias === nameHash(u.n))), 'every use case keeps the hash of its catalogue name (alias), so older saves still match');
ok(eq(D.tq, tqModel(Q, JSON.parse(rd('data/must-meta.json')))), 'the inlined step-5 questions equal tqModel(data file)');
ok(eq(Object.keys(D.tq.uses).sort(), D.cat.depts.flatMap(d => d.uses.map(u => u.id)).sort()), 'every catalogue use case has its questions (all 99 selectable)');
const det = detailModel(catHtml);
ok(eq(D.detail, JSON.parse(JSON.stringify(det))), 'the inlined detail sources equal the catalogue\'s, minus the left-out ones');
ok(det.dropped.length === 21 && det.dropped.every(x => BANNED.test(x.name) || true), 'sources left out because a banned word is in their name, note or address: ' + det.dropped.length);
ok(Object.values(D.detail).every(d => d.srcs.every(s => !BANNED.test(s.join(' ')))), 'no source shown carries a banned word');
ok(eq(D.ex, explainModel(JSON.parse(rd('data/explain.json')), D.cat.depts.flatMap(d => d.uses.map(u => u.id)))), 'the explainer data is data/explain.json');
ok(!('rc' in D), 'no readiness-check or register data block');
// the page
ok(/<title>Can AI solve your problems\? \(use-case questions v2\.7\)<\/title>/.test(html) && html.includes('id="app" data-state="start"'), 'title and the data-state root');
ok(html.includes(C.DISCLAIMER) && html.includes('as of 25 Nov 2026'), 'footer with the disclaimer and the content date');
ok(!html.includes('root.RCLogic = api') && !html.includes('root.RCStore = api') && html.includes('window.Readiness2 = {') && html.includes('id="r2-font"') && /jsPDF/.test(html), 'jsPDF and the PDF font are inlined; the readiness check\'s rules and store are not');
ok(!/AIHA|AI Hospitality Alliance|wikipedia/i.test(html.replace(/<script>\s*\/\*\* @license[\s\S]*?<\/script>/, '')), 'no banned source named anywhere in the page');
['src/content.js', 'src/logic.js', 'src/flow.js', 'src/pdf.js', 'src/app.js', 'src/style.css'].forEach(f => ok(html.includes(rd(f).replace(/<\/script/gi, '<\\/script').slice(0, 400)), 'index.html is built from ' + f + ' as it is now'));
ok(!/\b(P1|F1|F2|T1|D5|O1|G2s)\b/.test(JSON.stringify(D.tq.uses) + JSON.stringify(C.MUSTS.map(m => [m.name, m.q, m.why, m.good, m.act, m.gloss, m.ev]))), 'internal checklist codes are not in any hotel-facing text');
ok(D.builtOn && /^\d{4}-\d{2}-\d{2}$/.test(D.builtOn), 'build date');
ok(html.length < 3 * 1024 * 1024, 'under 3 MB: ' + Math.round(html.length / 1024) + ' KB');
done();
