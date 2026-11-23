// Builds Readiness 2.0 (index.html) from src/ and the Use-Case Catalogue's data.
// The catalogue's <script id="data"> is read here at build time, never copied by hand: rebuild after the catalogue changes.
// Run after editing anything in src/ or the catalogue:   node tools/readiness-2/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = p => readFileSync(join(here, p), 'utf8');

/* Catalogue data → only what this tool shows: category, department name, and per use case its name, task and use level.
   Use-case ids are '<dept id>-<1-based index>', the same ids as the catalogue, the readiness check and the AI Register. */
export function catalogueModel(catHtml, labels) {
  const m = catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('use-case-catalogue/index.html: no <script id="data"> block');
  const X = JSON.parse(m[1]);
  const notTool = new Set((labels && labels.uses || []).filter(u => u.base === 'notai').map(u => u.id));
  const depts = X.depts.map(d => ({ id: d.id, name: d.name, cat: d.cat, uses: d.uses.map((u, i) => {
    const id = d.id + '-' + (i + 1), o = { id, n: u.n, task: u.task, use: u.use || '' };
    if (notTool.has(id)) o.notTool = true; // e.g. "AI use policies and governance": a document, not a tool; the readiness check has no check for it
    return o;
  }) }));
  /* The four category one-liners, from the catalogue page's own CATS constant (kept in step with it). */
  let catLines = {};
  const cm = catHtml.match(/const CATS = (\[[\s\S]*?\]\]);/);
  if (cm) { try { catLines = Object.fromEntries(new Function('return ' + cm[1])()); } catch (e) { catLines = {}; } }
  const cats = ['Commercial', 'Guest-facing', 'Operational', 'Administrative'].map(name => ({ name, line: catLines[name] || '' }));
  const known = new Set(cats.map(c => c.name));
  depts.forEach(d => { if (!known.has(d.cat)) throw new Error('catalogue department ' + d.id + ' has an unknown category: ' + d.cat); });
  return { cats, depts, nDepts: depts.length, nUses: depts.reduce((a, d) => a + d.uses.length, 0) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const labels = JSON.parse(read('../register/data/uc-labels.json'));
  const cat = catalogueModel(read('../use-case-catalogue/index.html'), labels);
  const data = { cat, builtOn: new Date().toISOString().slice(0, 10) };
  const block = `<script type="application/json" id="r2-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
  const safe = s => s.replace(/<\/script/gi, '<\\/script');
  let html = read('src/page.html');
  for (const [mark, text] of [['/*__STYLE__*/', read('src/style.css')], ['<!--__DATA__-->', block], ['/*__CONTENT__*/', safe(read('src/content.js'))],
    ['/*__LOGIC__*/', safe(read('src/logic.js'))], ['/*__FLOW__*/', safe(read('src/flow.js'))], ['/*__APP__*/', safe(read('src/app.js'))]]) {
    if (!html.includes(mark)) throw new Error('src/page.html: missing ' + mark);
    html = html.replace(mark, () => text);
  }
  writeFileSync(join(here, 'index.html'), html);
  console.log('wrote tools/readiness-2/index.html', Math.round(html.length / 1024) + ' KB', '·', cat.nUses, 'use cases in', cat.nDepts, 'departments');
}
