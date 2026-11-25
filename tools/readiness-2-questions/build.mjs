// Builds "Do you need AI?" v2.7.0 (questions-only, standalone): index.html, one self-contained file, from src/, the owner's
// questions-only data (data/usecase_questions_only.json, verbatim), data/must-meta.json, data/explain.json and the Use-Case
// Catalogue's data (read at build time from ../use-case-catalogue/index.html, never copied by hand).
// It also inlines jsPDF (tools/assessment/lib) and the "Register Sans" PDF font (tools/register/fonts, SIL OFL 1.1).
// No CDN, no external font or script. No legal content (owner, 25 Nov 2026): see BANNED below and tests/no-legal.test.mjs.
// Run after editing anything in src/ or data/, or after the catalogue changes:   node tools/readiness-2-questions/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = p => readFileSync(join(here, p), 'utf8');

/* The owner's banned terms (prompt §4.4): whole words, any case. Only the disclaimer and the sensitive-area flag may carry one. */
export const BANNED = /\b(AI Act|Article|Art\.|Annex|high-risk|transparency obligation|prohibited|DPIA|GDPR|FADP|CE mark|works council|PCI|consent|legal basis|law|laws|regulation|compliance|legal|not legal advice)\b/i;
/* The same 32-bit FNV-1a (over UTF-16 code units) as R2Flow.nameHash (src/flow.js): a saved check's catalogue name is checked by
   its hash, so the catalogue's own names (some carry banned words) are never written into the page. */
export function nameHash(s) { let h = 0x811c9dc5; const t = String(s); for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }

function catData(catHtml) {
  const m = catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('use-case-catalogue/index.html: no <script id="data"> block');
  return JSON.parse(m[1]);
}
/* Catalogue data → only what this tool shows: area (category), department and per use case its name and use level.
   v2.7.0: the names shown are the data file's (the team's plain names; lg-2 and lg-3 renamed, the department "Sustainability &
   Governance"); the catalogue's own name is kept only as a hash (alias) so checks saved earlier still match their use case; the
   catalogue's research-wording description (task) is no longer shipped (three carry legal words; "What it does" replaces it).
   Use-case ids are '<dept id>-<1-based index>', the same ids as the catalogue. Q: the questions-only data. */
export function catalogueModel(catHtml, Q) {
  const X = catData(catHtml), QU = Object.fromEntries(Q.use_cases.map(u => [u.id, u]));
  const depts = X.depts.map(d => {
    const first = QU[d.id + '-1'];
    return { id: d.id, name: first ? first.department : d.name, cat: d.cat, uses: d.uses.map((u, i) => {
      const id = d.id + '-' + (i + 1), q = QU[id];
      if (!q) throw new Error('data/usecase_questions_only.json has no use case ' + id);
      return { id, n: q.name, alias: nameHash(u.n), use: u.use || '', removed: !!q.removed };
    }).filter(u => !u.removed).map(u => { delete u.removed; return u; }) }; // v2.8.0: a use case marked removed (lg-2) is not listed; its id stays for old saves
  });
  /* The four category one-liners, from the catalogue page's own CATS constant (kept in step with it). */
  let catLines = {};
  const cm = catHtml.match(/const CATS = (\[[\s\S]*?\]\]);/);
  if (cm) { try { catLines = Object.fromEntries(new Function('return ' + cm[1])()); } catch (e) { catLines = {}; } }
  const cats = ['Commercial', 'Guest-facing', 'Operational', 'Administrative'].map(name => ({ name, line: catLines[name] || '' }));
  const known = new Set(cats.map(c => c.name));
  depts.forEach(d => { if (!known.has(d.cat)) throw new Error('catalogue department ' + d.id + ' has an unknown category: ' + d.cat); });
  const removed = Q.use_cases.filter(u => u.removed).map(u => u.id);
  return { cats, depts, nDepts: depts.length, nUses: depts.reduce((a, d) => a + d.uses.length, 0), removed };
}

/* v2.7.0 (questions-only, owner 25 Nov 2026): step 5 reads data/usecase_questions_only.json, used verbatim (text, why, area,
   who answers). The signature of one use case's questions (ids and texts) marks which question list a saved answer belongs to. */
export const AREA_KEY = { People: 'pe', Skills: 'sk', 'Financial investment': 'fi', 'Technology infrastructure': 'te', Data: 'da', 'Organisation & governance': 'or' };
export const WHO_KEY = { GM: 'gm', 'Department head': 'dept', Finance: 'fin', IT: 'it', Owner: 'owner' };
export function tqSig(qs) { return createHash('sha1').update(JSON.stringify(qs.map(q => [q.id, q.text]))).digest('hex').slice(0, 10); }
/* The step-5 questions as the page needs them. Only runtime fields are shipped: original_questions, old_name and counts are review
   records (some quote old wording) and stay out of the page; carry_answer_from is kept for opening older saves.
   meta: data/must-meta.json (the team's resource analysis: blocks and counts for the must-have share lines). */
/* v2.8.0: prev, the v2.7 signature of each use case (data/v27-sigs.json). A check saved against v2.7 carries its answers by question
   id, except for questions the review rewrote (review "Rewrite": k27 false, they start unanswered); an id the v2.8 data no longer has
   (removed_question_ids) is dropped. Removed use cases (lg-2) ship no questions. */
export function tqModel(Q, meta, prev) {
  const uses = {};
  Q.use_cases.forEach(u => {
    if (u.removed) return;
    uses[u.id] = { name: u.name, sensitive: !!u.sensitive, sig: tqSig(u.questions), prev: (prev && prev[u.id]) || '',
      qs: u.questions.map(q => {
        const a = AREA_KEY[q.area], who = WHO_KEY[q.who_answers];
        if (!a || !who) throw new Error('usecase_questions_only.json: unknown area or who answers at ' + q.id);
        const o = { id: q.id, a, q: q.text, why: q.why, who, whoLabel: q.who_answers };
        if (q.carry_answer_from) o.carry = q.carry_answer_from;
        if (q.review !== 'Rewrite' && q.review !== 'Add') o.k27 = 1; // the v2.7 answer under the same id carries (the review field itself is not shipped)
        return o;
      }) };
  });
  return { uses, areas: meta.areas, blocks: meta.blocks, matrixTotal: meta.matrixTotal, nFromWorkbook: meta.nFromWorkbook, nDraft: meta.nDraft };
}

/* The detail layer: each use case's catalogue sources, read from the catalogue page at build time: { <use id>: { srcs: [[type, name,
   note, url]] } }. Types: 'c' company, 'h' hotel, 'r' a study in the catalogue's source list (resolved), 'l' a plain link.
   v2.7.0 (owner): legal sources are not shown, and any source whose name, note or address would hit the banned-term scan is left
   out; out.dropped lists them (the build prints them, the report names them). */
export function detailModel(catHtml, removed) {
  const X = catData(catHtml), SRC = X.src || {}, out = {}, dropped = [];
  X.depts.forEach(d => d.uses.forEach((u, i) => {
    const id = d.id + '-' + (i + 1);
    if ((removed || []).includes(id)) return; // v2.8.0: a use case taken off the list ships no sources
    const srcs = (u.srcs || []).map(s => {
      if (s[0] === 'r') { const r = SRC[s[1]]; if (!r) throw new Error('catalogue source ' + s[1] + ' is not in its source list (' + id + ')'); return ['r', r[0], s[2] || '', r[1] || '']; }
      if (s[0] === 'c' || s[0] === 'h') return [s[0], s[1], s[2] || '', s[3] || ''];
      return ['l', s[1], '', s[2] || ''];
    }).filter(s => { const hit = s.join(' ').match(BANNED); if (hit) dropped.push({ id, name: s[1], word: hit[0] }); return !hit; });
    out[id] = { srcs };
  }));
  Object.defineProperty(out, 'dropped', { value: dropped, enumerable: false });
  return out;
}

/* The use-case explainer (v2.2, data/explain.json): { <use id>: { does, how } } for every catalogue use case, nothing left over. */
export function explainModel(E, ids) {
  const bad = ids.filter(id => !E[id] || typeof E[id].does !== 'string' || !E[id].does.trim() || typeof E[id].how !== 'string' || !E[id].how.trim()), extra = Object.keys(E).filter(id => !ids.includes(id));
  if (bad.length || extra.length) throw new Error('data/explain.json is out of step with the catalogue (missing or empty: ' + bad.join(' ') + '; left over: ' + extra.join(' ') + ')');
  return Object.fromEntries(ids.map(id => [id, { does: E[id].does, how: E[id].how }]));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const catHtml = read('../use-case-catalogue/index.html');
  const Q = JSON.parse(read('data/usecase_questions_only.json')), meta = JSON.parse(read('data/must-meta.json'));
  const cat = catalogueModel(catHtml, Q), detail = detailModel(catHtml, cat.removed);
  const ids = cat.depts.flatMap(d => d.uses.map(u => u.id)), qIds = Q.use_cases.filter(u => !u.removed).map(u => u.id);
  const missing = ids.filter(id => !qIds.includes(id)), extra = qIds.filter(id => !ids.includes(id));
  if (missing.length || extra.length) throw new Error('data/usecase_questions_only.json is out of step with the catalogue (missing: ' + missing.join(' ') + '; left over: ' + extra.join(' ') + ')');
  const TQ = tqModel(Q, meta, JSON.parse(read('data/v27-sigs.json')).sigs), ex = explainModel(JSON.parse(read('data/explain.json')), ids);
  const data = { cat, tq: TQ, ex, detail, builtOn: new Date().toISOString().slice(0, 10) };
  const block = `<script type="application/json" id="r2-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
  const font = { regular: readFileSync(join(here, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(here, '../register/fonts/rs-bold.ttf')).toString('base64') };
  const fontBlock = `<script type="application/json" id="r2-font">${JSON.stringify(font)}</script>`;
  const safe = s => s.replace(/<\/script/gi, '<\\/script');
  let html = read('src/page.html');
  for (const [mark, text] of [['/*__STYLE__*/', read('src/style.css')], ['<!--__DATA__-->', block + '\n' + fontBlock], ['/*__JSPDF__*/', safe(read('../assessment/lib/jspdf.umd.min.js'))],
    ['/*__CONTENT__*/', safe(read('src/content.js'))], ['/*__LOGIC__*/', safe(read('src/logic.js'))], ['/*__FLOW__*/', safe(read('src/flow.js'))], ['/*__PDF__*/', safe(read('src/pdf.js'))], ['/*__APP__*/', safe(read('src/app.js'))]]) {
    if (!html.includes(mark)) throw new Error('src/page.html: missing ' + mark);
    html = html.replace(mark, () => text);
  }
  writeFileSync(join(here, 'index.html'), html);
  console.log('wrote tools/readiness-2-questions/index.html', Math.round(html.length / 1024) + ' KB', '·', cat.nUses, 'use cases in', cat.nDepts, 'departments ·', Object.values(TQ.uses).reduce((a, u) => a + u.qs.length, 0), 'questions for the use cases');
  if (detail.dropped.length) console.log('sources left out (banned word):', detail.dropped.map(x => x.id + ' ' + JSON.stringify(x.name.slice(0, 50)) + ' [' + x.word + ']').join('; '));
}
