// The built page (index.html): its data is read at build time from the catalogue and the questions-only data, never copied by hand;
// counts are computed. v2.7.0: no AI Register files, no readiness-check rules or store inlined (no legal content, no hub, no sharing).
// Run: node tools/readiness-2-questions/tests/build.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, data, tester, PAGE } from './load.mjs';
import { catalogueModel, detailModel, sourcesModel, tqModel, explainModel, nameHash, BANNED } from '../build.mjs';
const { C, L, F } = load();
const { ok, done } = tester('build');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const html = rd(PAGE), D = data();
const catHtml = rd('../use-case-catalogue/index.html'), Q = JSON.parse(rd('data/usecase_questions_only.json'));
const X = JSON.parse(catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);

ok(eq(D.cat, catalogueModel(catHtml, Q)), 'the inlined catalogue equals the catalogue now, with the data file\'s names (rebuild after it changes)');
ok(D.cat.nUses === 98 && D.cat.nDepts === 15 && D.cat.cats.length === 4 && D.cat.depts.reduce((a, d) => a + d.uses.length, 0) === D.cat.nUses, '4 areas, 15 departments, 98 use cases listed (v2.8.0: lg-2 removed), counted');
ok(eq(D.cat.removed, ['lg-2']) && !D.cat.depts.some(d => d.uses.some(u => u.id === 'lg-2')), 'v2.8.0: lg-2 is not listed; its id is named as removed');
D.cat.depts.forEach(d => d.uses.forEach(u => ok(new RegExp('^' + d.id + '-\\d+$').test(u.id) && X.depts.find(x => x.id === d.id).uses[+u.id.split('-')[1] - 1], 'use-case id is <dept>-<catalogue position>: ' + u.id)));
ok(D.cat.depts.every(d => d.uses.every(u => !('task' in u) && !('kw' in u) && !('notTool' in u))), 'no catalogue description, search words or register flags are shipped');
ok(D.cat.depts.find(d => d.id === 'lg').name === 'Sustainability & Governance', 'the lg department carries the data file\'s name');
ok(X.depts.every(d => d.uses.every((u, i) => { const id = d.id + '-' + (i + 1), mine = D.cat.depts.find(x => x.id === d.id).uses.find(y => y.id === id); return id === 'lg-2' ? !mine : mine.alias === nameHash(u.n); })), 'every listed use case keeps the hash of its catalogue name (alias), so older saves still match');
ok(eq(D.tq, tqModel(Q, JSON.parse(rd('data/must-meta.json')), JSON.parse(rd('data/v27-sigs.json')).sigs, JSON.parse(rd('data/actions_questions_only.json')).actions)), 'the inlined step-5 questions equal tqModel(data file, v2.7 signatures)');
ok(eq(Object.keys(D.tq.uses).sort(), D.cat.depts.flatMap(d => d.uses.map(u => u.id)).sort()), 'every listed use case has its questions (all 98 selectable)');
const det = sourcesModel(catHtml, D.cat.removed, JSON.parse(rd('data/sources_fixes.json')), JSON.parse(rd('data/sources_edits.json')), JSON.parse(rd('data/use_case_sources_v2.json')), JSON.parse(rd('data/source_scores_v27.json')));
ok(eq(D.detail, JSON.parse(JSON.stringify(det))), 'v2.8.0: the inlined sources equal sourcesModel(catalogue, fixes, edits, sources_v2, review scores)');
ok(detailModel(catHtml, D.cat.removed).dropped.length === 0, 'v2.8.0 (owner decision 2): no catalogue source is left out for a banned word');
ok(['res-4', 'it-4', 'lg-4'].every(id => D.detail[id].srcs.some(e => BANNED.test([e.n, e.o, e.x].join(' ')))), 'v2.8.0: sources whose title or quote carries a banned word are shown as given (e.g. res-4, it-4, lg-4)');
ok(eq(D.ex, explainModel(JSON.parse(rd('data/explain.json')), D.cat.depts.flatMap(d => d.uses.map(u => u.id)))), 'the explainer data is data/explain.json');
ok(!('rc' in D), 'no readiness-check or register data block');
// the page
ok(/<title>Can AI solve your problems\?<\/title>/.test(html) && /data-version="2\.8\.1">Version v2\.8\.1 \(rules unchanged since v2\.6\)\./.test(html) && html.includes('id="app" data-state="start"'), 'title and the data-state root');
ok(html.includes(C.DISCLAIMER) && html.includes('as of 25 Nov 2026'), 'footer with the disclaimer and the content date');
ok(!html.includes('root.RCLogic = api') && !html.includes('root.RCStore = api') && html.includes('window.Readiness2 = {') && html.includes('id="r2-font"') && /jsPDF/.test(html), 'jsPDF and the PDF font are inlined; the readiness check\'s rules and store are not');
ok(!/AIHA|AI Hospitality Alliance|wikipedia/i.test(html.replace(/<script>\s*\/\*\* @license[\s\S]*?<\/script>/, '')), 'no banned source named anywhere in the page');
['src/content.js', 'src/logic.js', 'src/flow.js', 'src/pdf.js', 'src/app.js', 'src/style.css'].forEach(f => ok(html.includes(rd(f).replace(/<\/script/gi, '<\\/script').slice(0, 400)), 'index.html is built from ' + f + ' as it is now'));
ok(!/\b(P1|F1|F2|T1|D5|O1|G2s)\b/.test(JSON.stringify(D.tq.uses) + JSON.stringify(C.MUSTS.map(m => [m.name, m.q, m.why, m.good, m.act, m.gloss, m.ev]))), 'internal checklist codes are not in any hotel-facing text');
ok(D.builtOn && /^\d{4}-\d{2}-\d{2}$/.test(D.builtOn), 'build date');
ok(html.length < 3 * 1024 * 1024, 'under 3 MB: ' + Math.round(html.length / 1024) + ' KB');
done();
