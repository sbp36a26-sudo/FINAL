// The built page (index.html): its data is read at build time from the catalogue, the workbook-generated questions and the
// AI Register's files, never copied by hand; counts are computed. Run: node tools/readiness-3/tests/build.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, data, tester } from './load.mjs';
import { catalogueModel, rcModel, tqModel } from '../build.mjs';
const { C, L, F, RC } = load();
const { ok, done } = tester('build');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const html = rd('index.html'), D = data();
const labels = JSON.parse(rd('../register/data/uc-labels.json')), ref = JSON.parse(rd('../register/data/reference.json'));

ok(eq(D.cat, catalogueModel(rd('../use-case-catalogue/index.html'), labels)), 'the inlined catalogue equals the catalogue now (rebuild after it changes)');
ok(D.cat.nUses === 99 && D.cat.nDepts === 15 && D.cat.cats.length === 4 && D.cat.depts.reduce((a, d) => a + d.uses.length, 0) === D.cat.nUses, '4 areas, 15 departments, 99 use cases, counted');
D.cat.depts.forEach(d => d.uses.forEach((u, i) => ok(u.id === d.id + '-' + (i + 1), 'use-case id is <dept>-<n>: ' + u.id)));
ok(eq(D.tq, tqModel(JSON.parse(rd('data/usecase-questions.json')), labels)), 'the inlined tailored questions equal data/usecase-questions.json (with the register\'s high-risk list, v2.1)');
ok(eq(Object.keys(D.tq.uses), D.cat.depts.flatMap(d => d.uses.map(u => u.id))), 'every catalogue use case has tailored questions (all 99 selectable)');
ok(D.cat.depts.flatMap(d => d.uses).filter(u => u.notTool).map(u => u.id).join() === 'lg-4', 'lg-4 is flagged as a document, not a tool (from the register labels)');
// the same build inputs as the readiness check for vendor questions and the provisional label
const rcHtml = rd('../readiness-check/index.html'), rcD = JSON.parse(rcHtml.match(/<script type="application\/json" id="d-data">([\s\S]*?)<\/script>/)[1]);
ok(eq(D.rc.reg, rcD.reg), 'the AI Register data embedded here is identical to what the readiness check embeds (labels, items, switches, vendor questions)');
ok(eq(D.rc, rcModel(rd('../readiness/index.html'), labels, ref)) && !D.rc.reg.labourNotes.CH && !D.rc.reg.labourNotes.GB && !/to\s+verify/i.test(JSON.stringify(D.rc.reg.labourNotes)), 'rules v4 cuts kept: no Swiss or UK labour notes, nothing marked "to verify"');
const M = RC.model({ rdy: D.rc.rdy, cat: D.cat, reg: D.rc.reg }), M0 = RC.model(rcD);
ok(M.USES.length === 98 && M0.USES.length === 98, 'the readiness check\'s model knows 98 tools here and there (all but lg-4)');
let same = 0;
M0.USES.forEach(x0 => { const x = M.UI[x0.id]; ['France', 'Switzerland', 'United Kingdom', 'Other', ''].forEach(country => { if (eq(RC.legal(M, x, { country }), RC.legal(M0, x0, { country })) && eq(RC.vendorQs(M, x, { actions: [{ group: 'vendor', q: { code: 'T1' } }] }), RC.vendorQs(M0, x0, { actions: [{ group: 'vendor', q: { code: 'T1' } }] }))) same++; }); });
ok(same === 98 * 5, 'for every tool and country type, the legal panel and the vendor questions equal the readiness check\'s own (' + same + ' of 490)');
// the page
ok(/<title>Do you need AI\? v3\.0<\/title>/.test(html) && html.includes("window.R2_STANDALONE = true") && !/fonts\.googleapis/.test(html) && html.includes('id="app" data-state="start"'), 'title and the data-state root');
ok(html.includes('Student prototype, not legal advice.') && html.includes('as of 24 Nov 2026'), 'student-prototype footer with the content date');
ok(html.includes('root.RCLogic = api') && html.includes('root.RCStore = api') && html.includes('window.Readiness3 = {') && html.includes('id="r2-font"') && /jsPDF/.test(html), 'the readiness check\'s rules and store, jsPDF and the PDF font are inlined');
ok(!/AIHA|AI Hospitality Alliance|wikipedia/i.test(html.replace(/<script>[\s\S]*?jsPDF[\s\S]*?<\/script>/, '')), 'no banned source named anywhere in the page');
['src/content.js', 'src/logic.js', 'src/flow.js', 'src/pdf.js', 'src/app.js', 'src/style.css'].forEach(f => ok(html.includes(rd(f).replace(/<\/script/gi, '<\\/script').slice(0, 400)), 'index.html is built from ' + f + ' as it is now'));
ok(!/\b(P1|F1|F2|T1|D5|O1|G2s)\b/.test(JSON.stringify(D.tq.uses) + JSON.stringify(C.MUSTS.map(m => [m.name, m.q, m.why, m.good, m.act, m.gloss, m.ev]))), 'internal checklist codes are not in any hotel-facing text');
ok(D.builtOn && /^\d{4}-\d{2}-\d{2}$/.test(D.builtOn), 'build date');
done();
