// The built page (index.html): one self-contained file built from src/ and the v3 data; the migration table; no external URLs.
// Run: node tools/readiness-3/tests/build.test.mjs (after node tools/readiness-3/build.mjs)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, tester, pageBlock } from './load.mjs';
import { loadV3 } from '../lib/data3.mjs';
import { build, explainModel, migrationModel, catalogueModel, sourceItem, AREAS } from '../build.mjs';
import { scan } from '../lib/banned.mjs';
const { ok, done } = tester('build');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const html = rd('index.html'), { full, runtime } = loadV3();

ok(html === build().html, 'index.html is the output of build.mjs from the sources as they are now (rebuild after a change)');
ok(html.includes('Version 3.0.2.') && /var APP = '3\.0\.2'/.test(html) && /Do you need AI\? 3\.0\.2', M, H - 10\.5/.test(html), 'version 3.0.2 on the page footer, in the saved file and in the PDF footer');
ok(Buffer.byteLength(html) < 3 * 1024 * 1024, 'under 3 MB: ' + Math.round(Buffer.byteLength(html) / 1024) + ' KB');
ok(/<title>Do you need AI\? v3\.0<\/title>/.test(html) && html.includes('id="app" data-state="start"') && html.includes('Do you need AI? 3.0.2'), 'title, version and the data-state root');
const own = html.replace(/<script[^>]*id="r3-(jspdf|font)"[^>]*>[\s\S]*?<\/script>/g, '');
ok(!/<(script|link|img|iframe)\b[^>]*\b(src|href)\s*=/i.test(own) && !/@import|\bfetch\s*\(|fonts\.googleapis/.test(own), 'no script src, link href, @import, fetch or web font (jsPDF\'s own unused code aside)');
ok(!/postMessage|#use=|R2_STANDALONE|AI Register|Readiness2|R2Logic|RCLogic/.test(html.replace(/<script id="r3-jspdf">[\s\S]*?<\/script>/, '')), 'no hub bridge, no cross-links to other tabs, no v2 code');
ok(!/<a [^>]*download|createObjectURL/.test(html.replace(/<script id="r3-jspdf">[\s\S]*?<\/script>/, '')), 'no page-started download link (downloads go through the capability)');
ok(html.includes("window.claude") && html.includes("use('downloads')"), 'downloads through window.claude.use("downloads")');
ok(eq(pageBlock('r3-data'), runtime), 'the runtime data is inlined unchanged');
const ex = pageBlock('r3-ex');
ok(eq(ex, explainModel(JSON.parse(rd('data/explain.json')), runtime.use_cases.map(u => u.id))) && Object.keys(ex).length === 99, 'the explainer for all 99 use cases');
const r2 = JSON.parse(readFileSync(join(root, '../readiness-2/data/usecase-questions.json'), 'utf8'));
const mig = pageBlock('r3-mig');
ok(eq(mig, migrationModel(full, r2)), 'the migration table is built from original_questions[].new_ids');
const n = Object.values(mig.map).reduce((a, m) => a + Object.keys(m).length, 0);
ok(n === 661 && eq(Object.entries(mig.counts).sort(), Object.entries({ keep: 395, fix: 105, merge: 65, split: 44, rewrite: 28, remove: 24 }).sort()), '661/661 originals in the table, by action');
ok(Object.values(mig.map).every(m => Object.values(m).every(a => Array.isArray(a))) && Object.keys(mig.sig).length === 99, 'every use case has its v2.6.1 signature');
let splitOk = 0, splitN = 0;
full.use_cases.forEach(u => u.original_questions.filter(o => o.action === 'split').forEach(o => { splitN++; if (mig.map[u.id][o.qid].length >= 2) splitOk++; }));
ok(splitN === 44 && splitOk === 44, 'split originals map to both parts (' + splitOk + '/44)');
let gone = 0; full.use_cases.forEach(u => u.original_questions.filter(o => o.action === 'merge' || o.action === 'remove').forEach(o => { if (!mig.map[u.id][o.qid].length) gone++; }));
ok(gone === 89, 'merged and removed originals carry nothing (89)');
ok(pageBlock('r3-font') && pageBlock('r3-font').regular.length > 1000 && /<script id="r3-jspdf">[\s\S]*jsPDF/.test(html), 'jsPDF and the PDF font are inlined');
['src/data3.js', 'src/rules3.js', 'src/store3.js', 'src/result3.js', 'src/pdf3.js', 'src/app3.js', 'src/style.css'].forEach(f => ok(html.includes(rd(f).replace(/<\/script/gi, '<\\/script')), 'index.html carries ' + f + ' as it is now'));
ok(!/AIHA|AI Hospitality Alliance|wikipedia/i.test(html.replace(/<script id="r3-jspdf">[\s\S]*?<\/script>/, '')), 'no banned source named in the page');
ok(!/Not sure|Unknown|N\/A/.test(own), 'no "Not sure", "Unknown" or "N/A" in the page');

/* v3.0.2, owner decision of 25 Nov 2026: step 4 areas, departments and the chosen use case's rating and sources from the catalogue */
const catHtml = readFileSync(join(root, '../use-case-catalogue/index.html'), 'utf8'), cat = catalogueModel(catHtml, runtime), CB = pageBlock('r3-cat');
ok(eq(CB, { areas: cat.areas, deptArea: cat.deptArea, uc: cat.uc }), 'the page carries the catalogue block (areas, department areas, ratings and sources) as built');
ok(eq(cat.areas.map(a => [a.name, a.line]), [['Commercial', 'Selling rooms and setting prices'], ['Guest-facing', 'Serving the guest before and during the stay'], ['Operational', 'Running the building, rooms and kitchen'], ['Administrative', 'Finance, people, management and control']]) && eq(AREAS, cat.areas.map(a => [a.name, a.line])), 'the four areas with the owner\'s lines, the same as the catalogue\'s');
const depts = [...new Set(runtime.use_cases.map(u => u.department))];
ok(depts.length === 15 && depts.every(d => cat.areas.some(a => a.name === cat.deptArea[d])), 'every one of the 15 departments sits in one area');
ok(Object.keys(cat.uc).length === 99 && runtime.use_cases.every(u => ['High', 'Medium', 'Low', 'Very low'].includes(cat.uc[u.id].level)), 'all 99 use cases have the catalogue\'s rating (High, Medium, Low, Very low)');
const allSrc = Object.values(cat.uc).flatMap(u => u.srcs);
ok(allSrc.length > 250 && allSrc.every(x => ['c', 'h', 'r', 'l'].includes(x.type) && x.name && (x.url === '' || /^https?:\/\/\S+$/.test(x.url))), 'sources resolved to { type, name, note, url } with http(s) addresses only (' + allSrc.length + ' kept)');
ok(allSrc.every(x => scan([x.name, x.note, x.url].join('\n')).length === 0) && !allSrc.some(x => /AIHA|AI Hospitality Alliance|wikipedia/i.test(x.name + x.note + x.url)), 'no kept source hits the banned-term grep or names a banned source');
const raw = JSON.parse(catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]), rawN = raw.depts.reduce((a, d) => a + d.uses.reduce((b, u) => b + (u.srcs || []).length, 0), 0);
ok(allSrc.length + cat.excluded.length === rawN, 'every catalogue source is either kept or listed as left out (' + allSrc.length + ' + ' + cat.excluded.length + ' = ' + rawN + ')');
const LL = rd('LEGAL_LEFTOVERS.md'), sec = LL.slice(LL.indexOf('## 4. Sources left out of v3 (banned terms)'));
ok(LL.includes('## 4. Sources left out of v3 (banned terms)') && sec.includes('**' + cat.excluded.length + '**') && cat.excluded.every(e => sec.includes('| ' + e.use + ' | ' + e.name.replace(/\|/g, '\\|') + ' |')), 'LEGAL_LEFTOVERS.md lists every source left out (' + cat.excluded.length + ') with its use case and name');
ok(eq(sourceItem(['l', 'https://example.org/x', '']), { type: 'l', name: 'Source', note: '', url: 'https://example.org/x' }) && sourceItem(['c', 'A', 'n', 'javascript:alert(1)']).url === '' && sourceItem(['r', 'S1', 'note'], { S1: ['Cite', 'https://example.org/s'] }).name === 'Cite', 'sourceItem: a bare link is never printed as text; only http(s) addresses are kept; references resolve through the source list');
done();
