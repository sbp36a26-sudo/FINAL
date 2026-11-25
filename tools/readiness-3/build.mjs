// Builds "Do you need AI?" v3.0 (tools/readiness-3/index.html): ONE self-contained standalone page. Run: node tools/readiness-3/build.mjs
// Inlines: the v3 question data (spec/usecase_questions_v3.runtime.json, validated with its schema in lib/data3.mjs: any error
// fails the build), the use-case explainer (data/explain.json, legal sentences taken out, see LEGAL_LEFTOVERS.md), the
// catalogue's areas, ratings and sources for step 4 (catalogueModel), the readiness-2 migration table (built here from the full
// JSON's original_questions[].new_ids), jsPDF and the PDF font, and src/.
// After writing, the banned-term grep (lib/banned.mjs, spec §5) runs over the page and every v3 source: any match fails the build.
// Nothing outside tools/readiness-3 is written; tools/readiness-2, tools/register and tools/use-case-catalogue are only read.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadV3 } from './lib/data3.mjs';
import { scan, pageText, scanSources } from './lib/banned.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const read = p => readFileSync(join(here, p), 'utf8');
export const VERSION = '3.0.2';

/* The use-case explainer for the picker's "Your choice" panel: { <use id>: { does, how } } for exactly the 99 v3 use cases. */
export function explainModel(E, ids) {
  const bad = ids.filter(id => !E[id] || typeof E[id].does !== 'string' || typeof E[id].how !== 'string'), extra = Object.keys(E).filter(id => !ids.includes(id));
  if (bad.length || extra.length) throw new Error('data/explain.json is out of step with the v3 use cases (missing: ' + bad.join(' ') + '; left over: ' + extra.join(' ') + ')');
  return Object.fromEntries(ids.map(id => [id, { does: E[id].does, how: E[id].how }]));
}

/* The migration table (§6.6): per use case, old v2.6.1 question id → new ids for keep, fix, rewrite and split (split: both parts);
   merge and remove → [] (dropped and counted). sig: the v2.6.1 signature of each use case's questions (read from
   tools/readiness-2/data/usecase-questions.json): answers saved against another signature were given to other questions. */
export function migrationModel(full, r2) {
  const map = {}, sig = {}, counts = {};
  full.use_cases.forEach(u => {
    const ids = new Set(u.questions.map(q => q.id)), m = {};
    u.original_questions.forEach(o => {
      counts[o.action] = (counts[o.action] || 0) + 1;
      if (['keep', 'fix', 'rewrite', 'split'].includes(o.action)) {
        const n = (o.new_ids || []).filter(id => ids.has(id));
        if (!n.length) throw new Error('migration: ' + u.id + '.' + o.qid + ' (' + o.action + ') maps to no v3 question');
        m[o.qid] = n;
      } else m[o.qid] = [];
    });
    map[u.id] = m;
    if (r2 && r2.uses && r2.uses[u.id] && r2.uses[u.id].sig) sig[u.id] = r2.uses[u.id].sig;
  });
  return { from: '2.6.1', map, sig, counts };
}

/* Step 4 "Where in the hotel?" (owner decision, 25 Nov 2026: back to the readiness-2 structure): the four areas of the hub's
   use-case catalogue (tools/use-case-catalogue/index.html, read only), each v3 department's area, and per use case the catalogue's
   "how common in hotels" rating and its examples and sources, resolved the way readiness-2 does it (build.mjs detailModel,
   R2Logic.sourceItem): 'r' through the catalogue's source list, 'l' [type, text, url], 'c' / 'h' [type, name, note, url]; a url
   is kept only when it is http(s); a bare link becomes { name: 'Source', url }. The v3 use cases share the catalogue's ids.
   A source whose name, note or address would hit the banned-term grep (lib/banned.mjs) is left out of v3 and listed in
   `excluded` (LEGAL_LEFTOVERS.md, "Sources left out of v3 (banned terms)"); the grep and its allowlist are not changed. */
export const AREAS = [['Commercial', 'Selling rooms and setting prices'], ['Guest-facing', 'Serving the guest before and during the stay'],
  ['Operational', 'Running the building, rooms and kitchen'], ['Administrative', 'Finance, people, management and control']];
const HTTP = /^https?:\/\/[^\s"<>]+$/i;
export function sourceItem(s, refs) {
  s = Array.isArray(s) ? s : []; const t = s[0]; let o;
  if (t === 'l' && s.length < 4) o = { name: s[1], note: '', url: s[2] };
  else if (t === 'r' && s.length < 4) { const r = (refs || {})[s[1]]; if (!r) throw new Error('catalogue source ' + s[1] + ' is not in its source list'); o = { name: r[0], note: s[2], url: r[1] }; }
  else o = { name: s[1], note: s[2], url: s[3] };
  o = { type: t, name: String(o.name || ''), note: String(o.note || ''), url: String(o.url || '').trim() };
  if (!HTTP.test(o.url)) o.url = '';
  if (!o.url && HTTP.test(o.name.trim())) { o.url = o.name.trim(); o.name = 'Source'; }
  return o;
}
export function catalogueModel(catHtml, runtime) {
  const m = catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('use-case-catalogue/index.html: no <script id="data"> block');
  const X = JSON.parse(m[1]), byId = {}, catOf = {};
  X.depts.forEach(d => { catOf[d.id] = d.cat; d.uses.forEach((u, i) => { byId[d.id + '-' + (i + 1)] = u; }); });
  const cm = catHtml.match(/const CATS = (\[[\s\S]*?\]\]);/);
  const cats = cm ? JSON.parse(cm[1].replace(/'/g, '"')) : null;
  if (JSON.stringify(cats) !== JSON.stringify(AREAS)) throw new Error('the catalogue\'s four areas changed: ' + JSON.stringify(cats));
  const deptArea = {}, uc = {}, excluded = [];
  runtime.use_cases.forEach(u => {
    const c = byId[u.id], area = catOf[u.id.replace(/-\d+$/, '')];
    if (!c || !area) throw new Error('use case ' + u.id + ' is not in the catalogue');
    if (deptArea[u.department] && deptArea[u.department] !== area) throw new Error('department ' + u.department + ' sits in two areas');
    deptArea[u.department] = area;
    const srcs = [];
    (c.srcs || []).forEach(s => {
      const o = sourceItem(s, X.src);
      if (scan([o.name, o.note, o.url].join('\n')).length || /AIHA|AI Hospitality Alliance|wikipedia/i.test(o.name + ' ' + o.note + ' ' + o.url)) excluded.push({ use: u.id, name: o.name });
      else srcs.push(o);
    });
    uc[u.id] = { level: String(c.use || ''), srcs };
  });
  return { areas: AREAS.map(([name, line]) => ({ name, line })), deptArea, uc, excluded };
}

const safe = s => s.replace(/<\/script/gi, '<\\/script');
const jsonBlock = (id, v) => `<script type="application/json" id="${id}">${JSON.stringify(v).replace(/</g, '\\u003c')}</script>`;

export function build() {
  const v3 = loadV3();
  const ids = v3.runtime.use_cases.map(u => u.id);
  const ex = explainModel(JSON.parse(read('data/explain.json')), ids);
  const r2p = join(here, '../readiness-2/data/usecase-questions.json');
  const mig = migrationModel(v3.full, existsSync(r2p) ? JSON.parse(readFileSync(r2p, 'utf8')) : null);
  const font = { regular: readFileSync(join(here, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(here, '../register/fonts/rs-bold.ttf')).toString('base64') };
  const cat = catalogueModel(readFileSync(join(here, '../use-case-catalogue/index.html'), 'utf8'), v3.runtime);
  const catBlock = { areas: cat.areas, deptArea: cat.deptArea, uc: cat.uc };
  const data = [jsonBlock('r3-data', v3.runtime), jsonBlock('r3-ex', ex), jsonBlock('r3-cat', catBlock), jsonBlock('r3-mig', mig), jsonBlock('r3-font', font)].join('\n');
  const vendor = '<script id="r3-jspdf">\n' + safe(read('../assessment/lib/jspdf.umd.min.js')) + '\n</script>';
  let html = read('src/page.html');
  for (const [mark, text] of [['/*__STYLE__*/', read('src/style.css')], ['<!--__DATA__-->', data], ['<!--__VENDOR__-->', vendor],
    ['/*__DATA3__*/', safe(read('src/data3.js'))], ['/*__RULES3__*/', safe(read('src/rules3.js'))], ['/*__STORE3__*/', safe(read('src/store3.js'))],
    ['/*__RESULT3__*/', safe(read('src/result3.js'))], ['/*__PDF3__*/', safe(read('src/pdf3.js'))], ['/*__APP3__*/', safe(read('src/app3.js'))]]) {
    if (!html.includes(mark)) throw new Error('src/page.html: missing ' + mark);
    html = html.replace(mark, () => text);
  }
  html = html.replace('<!-- GENERATED', '<!-- Do you need AI? ' + VERSION + ' · GENERATED');
  const ext = html.match(/<(?:script|link|img|iframe)\b[^>]*\b(?:src|href)\s*=\s*["']?(?:https?:)?\/\//gi) || html.match(/@import|\bfetch\s*\(/);
  if (ext) throw new Error('index.html must be self-contained: ' + ext[0]);
  return { html, v3, mig, cat };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { html, v3, mig, cat } = build();
  /* banned-term grep (§5): the page (vendored jsPDF and the font's base64 blanked, see LEGAL_LEFTOVERS.md) and every v3 source */
  const hits = scan(pageText(html)).map(h => Object.assign({ file: 'index.html' }, h)).concat(scanSources(here));
  if (hits.length) {
    hits.slice(0, 30).forEach(h => console.error(h.file + ':' + h.line + ' "' + h.term + '" … ' + h.text));
    throw new Error('banned-term grep: ' + hits.length + ' matches (spec §5). Nothing written.');
  }
  if (Buffer.byteLength(html) > 3 * 1024 * 1024) throw new Error('index.html is over 3 MB');
  writeFileSync(join(here, 'index.html'), html);
  console.log('wrote tools/readiness-3/index.html', Math.round(Buffer.byteLength(html) / 1024) + ' KB ·', v3.runtime.use_cases.length, 'use cases,',
    v3.runtime.use_cases.reduce((a, u) => a + u.questions.length, 0), 'questions, schema valid · migration table for', Object.keys(mig.map).length, 'use cases · catalogue sources', Object.values(cat.uc).reduce((a, u) => a + u.srcs.length, 0), 'kept,', cat.excluded.length, 'left out (banned terms) · banned-term grep: 0');
}
