// Builds "Can AI solve your problems?" v2.8.1 (questions-only, standalone), one self-contained file per build, from src/, the owner's
// questions-only data (data/usecase_questions_only.json, verbatim), data/must-meta.json, data/explain.json and the Use-Case
// Catalogue's data (read at build time from ../use-case-catalogue/index.html, never copied by hand).
// It also inlines jsPDF (tools/assessment/lib) and the "Register Sans" PDF font (tools/register/fonts, SIL OFL 1.1).
// No CDN, no external font or script. No legal content (owner, 25 Nov 2026): see BANNED below and tests/no-legal.test.mjs.
// Two builds (v2.8.1, owner 26 Nov 2026):
//   node tools/readiness-2-questions/build.mjs            → index.html, the claude.ai artifact (sends nothing)
//   node tools/readiness-2-questions/build.mjs --public   → public/index.html, the page GitHub Pages serves: window.R2_PUBLIC from
//        hosting.config.json ({ collectUrl, contact }), src/collect.js, no window.storage, no window.claude (see README "Hosting")
// Run after editing anything in src/ or data/, or after the catalogue changes. Build both before a commit.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = p => readFileSync(join(here, p), 'utf8');

/* The owner's banned terms (prompt §4.4): whole words, any case. Only the disclaimer and the sensitive-area flag may carry one. */
export const BANNED = /\b(AI Act|Article|Art\.|Annex|high-risk|transparency obligation|prohibited|DPIA|GDPR|FADP|CE mark|works council|PCI|consent|legal basis|law|laws|regulation|compliance|legal|not legal advice)\b/i;
/* v2.8.0: the prompt's added words (delete, deleted, kept for, retention, consent, regulator, ISO, regulatory) with the old ones, for the
   list of sources to show the owner (the sources stay; owner decision 2). */
export const BANNED_SRC = /\b(AI Act|Article|Art\.|Annex|high-risk|transparency obligation|prohibited|DPIA|GDPR|FADP|CE mark|works council|PCI|consent|legal basis|law|laws|regulation|compliance|legal|not legal advice|delete|deleted|kept for|retention|regulator|ISO|regulatory)\b/i;
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
/* v2.8.0 (B11): acts, data/actions_questions_only.json { actions: { <question id>: text } }: one action per question, shown in the action
   plan and the PDF instead of the question. Every listed question needs one; none may end with a question mark. */
export function tqModel(Q, meta, prev, acts) {
  const uses = {};
  if (acts) {
    const ids = Q.use_cases.filter(u => !u.removed).flatMap(u => u.questions.map(q => q.id)), missing = ids.filter(id => !acts[id]), extra = Object.keys(acts).filter(id => !ids.includes(id)), asks = ids.filter(id => /\?\s*$/.test(acts[id] || ''));
    if (missing.length || extra.length || asks.length) throw new Error('data/actions_questions_only.json is out of step (missing: ' + missing.join(' ') + '; left over: ' + extra.join(' ') + '; ending with "?": ' + asks.join(' ') + ')');
  }
  Q.use_cases.forEach(u => {
    if (u.removed) return;
    uses[u.id] = { name: u.name, sensitive: !!u.sensitive, sig: tqSig(u.questions), prev: (prev && prev[u.id]) || '',
      qs: u.questions.map(q => {
        const a = AREA_KEY[q.area], who = WHO_KEY[q.who_answers];
        if (!a || !who) throw new Error('usecase_questions_only.json: unknown area or who answers at ' + q.id);
        const o = { id: q.id, a, q: q.text, why: q.why, who, whoLabel: q.who_answers };
        if (acts) o.act = acts[q.id];
        if (q.carry_answer_from) o.carry = q.carry_answer_from;
        if (q.review !== 'Rewrite' && q.review !== 'Add') o.k27 = 1; // the v2.7 answer under the same id carries (the review field itself is not shipped)
        return o;
      }) };
  });
  return { uses, areas: meta.areas, blocks: meta.blocks, matrixTotal: meta.matrixTotal, nFromWorkbook: meta.nFromWorkbook, nDraft: meta.nDraft };
}

/* The detail layer: each use case's catalogue sources, read from the catalogue page at build time: { <use id>: { srcs: [[type, name,
   note, url]] } }. Types: 'c' company, 'h' hotel, 'r' a study in the catalogue's source list (resolved), 'l' a plain link.
   v2.7.0 left out any source carrying a banned word; v2.8.0 (owner decision 2, 25 Nov 2026) keeps them all and only lists them
   (out.dropped stays empty; sourcesModel applies the review's removals). */
export function detailModel(catHtml, removed) {
  const X = catData(catHtml), SRC = X.src || {}, out = {}, dropped = [];
  X.depts.forEach(d => d.uses.forEach((u, i) => {
    const id = d.id + '-' + (i + 1);
    if ((removed || []).includes(id)) return; // v2.8.0: a use case taken off the list ships no sources
    const srcs = (u.srcs || []).map(s => {
      if (s[0] === 'r') { const r = SRC[s[1]]; if (!r) throw new Error('catalogue source ' + s[1] + ' is not in its source list (' + id + ')'); return ['r', r[0], s[2] || '', r[1] || '']; }
      if (s[0] === 'c' || s[0] === 'h') return [s[0], s[1], s[2] || '', s[3] || ''];
      return ['l', s[1], '', s[2] || ''];
    }); // v2.8.0 (owner decision 2): no source is left out for a banned word in its title, address or quote; the build lists them
    out[id] = { srcs };
  }));
  Object.defineProperty(out, 'dropped', { value: dropped, enumerable: false });
  return out;
}

/* v2.8.0: every use case's examples and sources, in one list (live review, 25 Nov 2026; prompt Part 1 §5 and Part 2; owner decision
   4: shown inside the use case: the detail layer, step 5's box, the result page and the Result PDF). Built from:
     the catalogue's sources (detailModel, nothing left out for a banned word since v2.8.0: owner decision 2),
     data/sources_fixes.json (remove; replace = remove the old one; add = append the given text and URL; needs_source / review: nothing),
     data/sources_edits.json (how each edit_text item is applied; the per-use notes, me-6),
     data/use_case_sources_v2.json (the audited sources_v2, appended word for word; "replaces" removes the old source it names),
     data/source_scores_v27.json (the review's credibility score and "supports" for the catalogue's sources).
   Entry: { k: 'cat' | 'v2', t: type ('c' company, 'h' hotel, 'r' study, 'l' line, 'v' sources_v2), n: name, o: note, x: the v2 text
   without its " | URL" tail, u: url, s: score or null, f: 'direct' | 'partial' | '' }. Sorted: 7+ direct, then 7+ partial, then the
   rest (each group in its order). thin: no direct entry at 7+. Eurostat rows are always partial. out.log lists what was done. */
const REPLACES = { 'fo-5': 'https://www.oracle.com/customers/barcelo-hotel-group', 'fa-7': 'https://justt.ai/hospitality', 'it-5': 'https://www.juniper.net/us/en/customers/citizenm-hotels-case-study.html' };
export function sourcesModel(catHtml, removed, fixes, edits, v2, scores) {
  const det = detailModel(catHtml, removed), out = {}, log = [], SC = {};
  (scores.rows || []).forEach(r => { SC[r.use + ' ' + r.url] = r; });
  const eurostat = u => /ec\.europa\.eu\/eurostat/.test(u);
  Object.keys(det).forEach(id => {
    out[id] = { srcs: det[id].srcs.map(s => { const r = SC[id + ' ' + s[3]], sup = r && r.supports; return { k: 'cat', t: s[0], n: s[1], o: s[2], u: s[3], s: r && typeof r.score === 'number' ? r.score : null, f: eurostat(s[3]) ? 'partial' : sup === 'Y' ? 'direct' : sup === 'partial' ? 'partial' : '' }; }), thin: false, note: '', nV2: 0 };
  });
  const find = (id, url, name) => { const L = (out[id] || { srcs: [] }).srcs, m = L.filter(e => e.k === 'cat' && e.u === url); if (m.length > 1 && name) { const n2 = m.filter(e => name.startsWith(e.n) || name.includes(e.n + ':')); if (n2.length) return n2; } return m; };
  const drop = (id, e, why) => { out[id].srcs = out[id].srcs.filter(x => x !== e); log.push(id + ' removed: ' + e.n.slice(0, 60) + ' (' + why + ')'); };
  fixes.forEach(f => {
    if (!out[f.use_case]) return;
    if (f.action === 'remove' || f.action === 'replace') { const m = find(f.use_case, f.url, f.source.replace(/^\(repeat\) /, '')); if (m.length !== 1) throw new Error('sources_fixes: ' + f.action + ' ' + f.use_case + ' matches ' + m.length + ' sources: ' + f.url); drop(f.use_case, m[0], f.action); }
    if (f.action === 'add' && f.url) { out[f.use_case].srcs.push({ k: 'cat', t: 'l', n: f.source, o: '', u: f.url, s: null, f: '' }); log.push(f.use_case + ' added: ' + f.source.slice(0, 60)); }
  });
  edits.edits.forEach(e => {
    const m = find(e.use, e.url); if (m.length !== 1) throw new Error('sources_edits: ' + e.use + ' matches ' + m.length + ' sources: ' + e.url);
    const x = m[0];
    if (e.remove) return drop(e.use, x, 'edit: ' + e.why);
    if (e.copyTo) { out[e.copyTo].srcs.push(Object.assign({}, x, { s: null, f: '' })); log.push(e.copyTo + ' added (copied from ' + e.use + '): ' + x.n); return; }
    if (e.set) { if (e.set.name) x.n = e.set.name; if (e.set.note != null) x.o = e.set.note; if (e.set.url) x.u = e.set.url; }
    if (e.prefix) x.n = e.prefix + x.n;
    if (e.suffix) x.n = x.n + e.suffix;
    log.push(e.use + ' edited: ' + x.n.slice(0, 60));
  });
  Object.entries(edits.notes || {}).forEach(([id, t]) => { out[id].note = t; });
  Object.entries(v2.use_cases).forEach(([id, u]) => {
    if (!out[id]) throw new Error('use_case_sources_v2: unknown use case ' + id);
    u.examples_and_sources.forEach(e => {
      if (/^replaces /.test(e.replaces)) { const old = out[id].srcs.find(x => x.k === 'cat' && x.u === REPLACES[id]); if (old) drop(id, old, e.replaces); }
      const tail = ' | ' + e.url; if (!e.text.endsWith(tail)) throw new Error('use_case_sources_v2: ' + id + ' text does not end with " | URL"');
      out[id].srcs.filter(x => x.k === 'cat' && x.u === e.url && x.s == null).forEach(x => drop(id, x, 'the audited sources_v2 entry for the same address replaces it'));
      out[id].srcs.push({ k: 'v2', t: 'v', n: '', o: '', x: e.text.slice(0, -tail.length), u: e.url, s: e.score, f: eurostat(e.url) ? 'partial' : e.fit });
      out[id].nV2++;
    });
  });
  /* v2.8.2 (owner, 26 Nov 2026): an audited source (sources_v2) scored below 7 is not shown; each one is logged in out.removedLow */
  const removedLow = [];
  Object.keys(out).forEach(id => { out[id].srcs = out[id].srcs.filter(e => { if (e.k === 'v2' && e.s != null && e.s < 7) { removedLow.push({ use: id, score: e.s, text: e.x, url: e.u }); log.push(id + ' removed: ' + e.x.slice(0, 60) + ' (scored ' + e.s + ', below 7)'); out[id].nV2--; return false; } return true; }); });
  Object.defineProperty(out, 'removedLow', { value: removedLow, enumerable: false });
  Object.keys(out).forEach(id => {
    const L = out[id].srcs, g = e => e.s != null && e.s >= 7 ? (e.f === 'direct' ? 0 : 1) : 2;
    out[id].srcs = L.map((e, i) => [g(e), i, e]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(a => a[2]);
    out[id].thin = !L.some(e => e.s != null && e.s >= 7 && e.f === 'direct');
  });
  Object.defineProperty(out, 'log', { value: log, enumerable: false });
  return out;
}

/* The use-case explainer (v2.2, data/explain.json): { <use id>: { does, how } } for every catalogue use case, nothing left over. */
export function explainModel(E, ids) {
  const bad = ids.filter(id => !E[id] || typeof E[id].does !== 'string' || !E[id].does.trim() || typeof E[id].how !== 'string' || !E[id].how.trim()), extra = Object.keys(E).filter(id => !ids.includes(id));
  if (bad.length || extra.length) throw new Error('data/explain.json is out of step with the catalogue (missing or empty: ' + bad.join(' ') + '; left over: ' + extra.join(' ') + ')');
  return Object.fromEntries(ids.map(id => [id, { does: E[id].does, how: E[id].how }]));
}

/* The page as text. opt: { pub: false | true, config: { collectUrl, contact } (public only) }. Pure apart from reading files. */
export function buildPage(opt) {
  opt = opt || {};
  const catHtml = read('../use-case-catalogue/index.html');
  const Q = JSON.parse(read('data/usecase_questions_only.json')), meta = JSON.parse(read('data/must-meta.json'));
  const cat = catalogueModel(catHtml, Q);
  const detail = sourcesModel(catHtml, cat.removed, JSON.parse(read('data/sources_fixes.json')), JSON.parse(read('data/sources_edits.json')), JSON.parse(read('data/use_case_sources_v2.json')), JSON.parse(read('data/source_scores_v27.json')));
  const ids = cat.depts.flatMap(d => d.uses.map(u => u.id)), qIds = Q.use_cases.filter(u => !u.removed).map(u => u.id);
  const missing = ids.filter(id => !qIds.includes(id)), extra = qIds.filter(id => !ids.includes(id));
  if (missing.length || extra.length) throw new Error('data/usecase_questions_only.json is out of step with the catalogue (missing: ' + missing.join(' ') + '; left over: ' + extra.join(' ') + ')');
  const TQ = tqModel(Q, meta, JSON.parse(read('data/v27-sigs.json')).sigs, JSON.parse(read('data/actions_questions_only.json')).actions), ex = explainModel(JSON.parse(read('data/explain.json')), ids);
  const data = { cat, tq: TQ, ex, detail: shipDetail(detail), builtOn: opt.builtOn || new Date().toISOString().slice(0, 10) };
  const block = `<script type="application/json" id="r2-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
  const font = { regular: readFileSync(join(here, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(here, '../register/fonts/rs-bold.ttf')).toString('base64') };
  const fontBlock = `<script type="application/json" id="r2-font">${JSON.stringify(font)}</script>`;
  const safe = x => x.replace(/<\/script/gi, '<\\/script');
  let pub = '', collect = '';
  if (opt.pub) {
    const c = publicConfig(opt.config);
    pub = 'window.R2_PUBLIC = ' + JSON.stringify(c).replace(/</g, '\\u003c') + '; // the public build (build.mjs --public, hosting.config.json)';
    collect = safe(read('src/collect.js'));
  }
  let html = read('src/page.html');
  for (const [mark, text] of [['/*__STYLE__*/', read('src/style.css')], ['<!--__DATA__-->', block + '\n' + fontBlock], ['/*__JSPDF__*/', safe(read('../assessment/lib/jspdf.umd.min.js'))], ['/*__PUBLIC__*/', pub],
    ['/*__CONTENT__*/', safe(read('src/content.js'))], ['/*__LOGIC__*/', safe(read('src/logic.js'))], ['/*__FLOW__*/', safe(read('src/flow.js'))], ['/*__PDF__*/', safe(read('src/pdf.js'))], ['/*__COLLECT__*/', collect], ['/*__APP__*/', safe(read('src/app.js'))]]) {
    if (!html.includes(mark)) throw new Error('src/page.html: missing ' + mark);
    html = html.replace(mark, () => text);
  }
  return { html, cat, TQ, detail };
}
/* v2.8.2 (owner): what the page carries of each source: no review score, no fit, and an audited text cut to "Org: title (year)", so the
   review's internal notes (score, "abstract only", base, type) are not in the page at all. Order and the thin flag are kept. */
export function shipDetail(detail) {
  const year = t => { const m = String(t || '').match(/\b(19[5-9]\d|20[0-4]\d)\b/); return m ? m[0] : ''; };
  const cut = x => { const i = x.indexOf(': '), rest = i > 0 ? x.slice(i + 2) : x, d = rest.indexOf(' — '), p = rest.lastIndexOf(' ('); const title = d > 0 ? rest.slice(0, d) : p > 0 ? rest.slice(0, p) : rest; const y = year((d > 0 ? rest.slice(d) : p > 0 ? rest.slice(p) : '').replace(/“[^”]*”/g, '')); return (i > 0 ? x.slice(0, i) + ': ' : '') + title + (y ? ' (' + y + ')' : ''); };
  const out = {};
  Object.entries(detail).forEach(([id, d]) => { out[id] = { srcs: d.srcs.map(e => e.k === 'v2' ? { k: 'v2', t: 'v', n: '', o: '', x: cut(e.x), u: e.u } : { k: 'cat', t: e.t, n: e.n, o: e.o, u: e.u }), thin: d.thin, note: d.note, nV2: d.nV2 }; });
  return out;
}
/* hosting.config.json → { collectUrl, contact }: strings only; collectUrl must be empty or an https address. */
export function publicConfig(c) {
  c = c && typeof c === 'object' ? c : {};
  const collectUrl = typeof c.collectUrl === 'string' ? c.collectUrl.trim() : '', contact = typeof c.contact === 'string' ? c.contact.trim().slice(0, 200) : '';
  if (collectUrl && !/^https:\/\/[^\s"'<>]+$/.test(collectUrl)) throw new Error('hosting.config.json: collectUrl must be empty or an https:// address');
  return { collectUrl, contact };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const isPub = process.argv.includes('--public');
  const config = isPub ? JSON.parse(read('hosting.config.json')) : null;
  const { html, cat, TQ, detail } = buildPage({ pub: isPub, config });
  const out = isPub ? 'public/index.html' : 'index.html';
  if (isPub) mkdirSync(join(here, 'public'), { recursive: true });
  writeFileSync(join(here, out), html);
  console.log('wrote tools/readiness-2-questions/' + out, Math.round(html.length / 1024) + ' KB', '·', cat.nUses, 'use cases in', cat.nDepts, 'departments ·', Object.values(TQ.uses).reduce((a, u) => a + u.qs.length, 0), 'questions for the use cases');
  const all = Object.values(detail).flatMap(d => d.srcs), hitW = []; Object.entries(detail).forEach(([id, d]) => d.srcs.forEach(e => { const h = [e.n, e.o, e.x, e.u].join(' ').match(BANNED_SRC); if (h) hitW.push(id + ' [' + h[0] + '] ' + (e.n || e.x).slice(0, 70)); }));
  console.log('sources:', all.length, 'entries (' + all.filter(e => e.k === 'v2').length + ' from sources_v2),', Object.values(detail).filter(d => d.thin).length, 'use cases marked thin,', Object.values(detail).filter(d => !d.srcs.length).length, 'with no source');
  if (isPub) {
    const c = publicConfig(config);
    if (!c.collectUrl) console.warn('WARNING: hosting.config.json collectUrl is empty: the public page sends nothing (see hosting/README.md).');
    if (!c.contact) console.warn('WARNING: hosting.config.json contact is empty: the data notice shows "Contact: to be added".');
  }
  if (process.env.SHOW_SOURCES) { console.log(detail.log.join('\n')); console.log('sources carrying a banned word (shown, for owner review):\n' + hitW.join('\n')); }
}
