// Banned-term test (spec §5): 0 matches in index.html, the generated PDF text, every export (Copy texts, saved file) and every v3
// source (spec/ and the change-log files excluded). Case-insensitive and word-bounded; allowlist = the two exact texts only.
// Run: node tools/readiness-3/tests/banned.test.mjs (after node tools/readiness-3/build.mjs)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, load, tester, goldenRecord } from './load.mjs';
import { loadV3, goldenCases } from '../lib/data3.mjs';
import { scan, pageText, scanSources, sourceFiles, TERMS, RE } from '../lib/banned.mjs';
const { ok, done } = tester('banned');
const { R3, S, RES, P, jspdf } = load(true);
const { runtime: D } = loadV3();
const font = { regular: readFileSync(join(root, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(root, '../register/fonts/rs-bold.ttf')).toString('base64') };
const show = hs => hs.slice(0, 5).map(h => (h.file || '') + ':' + h.line + ' ' + h.term + ' … ' + h.text).join(' | ');

/* the grep itself */
ok(TERMS.length === 20, '20 terms as listed in §5');
/* the probe is made from the list itself, so this file names no term */
const probe = TERMS.join(', ');
ok(scan(probe).length === 20 && scan(probe.toUpperCase()).length === 20 && scan(probe.toLowerCase()).length === 20, 'every term is found once, in any case (20)');
ok(scan('Europe, lawn, Eurostat, outlaw, unlawful, euro, EUR, consents, articles, CE marking, lawyer').length === 0, 'word-bounded: no match inside other words');
ok(scan(D.texts.disclaimer + '\n' + D.texts.sensitive_flag).length === 0, 'the two allowed texts pass');
ok(scan('a ' + TERMS[14] + ' ' + D.texts.disclaimer).length === 1, 'the allowlist excuses only its exact text');

/* the page */
const html = readFileSync(join(root, 'index.html'), 'utf8');
const pageHits = scan(pageText(html));
ok(pageHits.length === 0, 'index.html: 0 matches (' + pageHits.length + ') ' + show(pageHits));
const vendorHits = scan(html).length;
ok(vendorHits > 0 && vendorHits === scan(html.match(/<script id="r3-jspdf">[\s\S]*?<\/script>/)[0]).length + scan(html.match(/<script type="application\/json" id="r3-font">[\s\S]*?<\/script>/)[0]).length,
  'the only raw matches in the page are inside the vendored jsPDF and the font data (' + vendorHits + ', listed in LEGAL_LEFTOVERS.md)');

/* the sources */
const files = sourceFiles(root);
ok(files.includes('src/app3.js') && files.includes('data/explain.json') && files.includes('README.md') && files.some(f => f.startsWith('tests/fixtures/')) && !files.some(f => f.startsWith('spec/')), 'sources scanned: ' + files.length + ' files (spec/ excluded)');
const srcHits = scanSources(root);
ok(srcHits.length === 0, 'v3 sources: 0 matches (' + srcHits.length + ') ' + show(srcHits));

/* exports and the PDF text, for every golden case */
mkdirSync(join(root, 'tests/out'), { recursive: true });
let exHits = [], pdfHits = [], n = 0;
goldenCases().forEach((g, i) => {
  const rec = goldenRecord(S, R3, D, g), m = RES.model(D, rec, {}, '2026-11-25');
  const texts = [RES.summaryText(m), RES.planText(m), JSON.stringify(S.fileDoc(rec))].concat(m.people.map(p => RES.personText(m, p.key)));
  texts.forEach(t => scan(t).forEach(h => exHits.push(Object.assign({ file: 'golden ' + (i + 1) }, h))));
  const doc = P.draw(P.blocks(m), jspdf, font).doc, f = join(root, 'tests/out/banned_' + (i + 1) + '.pdf');
  writeFileSync(f, Buffer.from(doc.output('arraybuffer')));
  const txt = execFileSync('pdftotext', ['-layout', f, '-']).toString();
  scan(txt).forEach(h => pdfHits.push(Object.assign({ file: 'pdf ' + (i + 1) }, h)));
  n++;
});
ok(n === 33 && exHits.length === 0, 'exports (Copy, plan, per person, saved file) of 33 golden cases: 0 matches ' + show(exHits));
ok(pdfHits.length === 0, 'PDF text of 33 golden cases: 0 matches ' + show(pdfHits));
console.log('banned-term grep: page ' + pageHits.length + ', sources ' + srcHits.length + ' (' + files.length + ' files), exports ' + exHits.length + ', PDF text ' + pdfHits.length);
done();
