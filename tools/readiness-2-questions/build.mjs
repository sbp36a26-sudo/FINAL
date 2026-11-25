// Builds "Do you need AI?" v2 (index.html) from src/, data/usecase-questions.json, the Use-Case Catalogue's data and the
// AI Register's label files (the same build inputs as the readiness check, whose rules and store scripts are inlined too).
// It also inlines jsPDF (tools/assessment/lib) and the register's "Register Sans" PDF font (tools/register/fonts, OFL) for the PDF download.
// The catalogue's <script id="data"> is read here at build time, never copied by hand: rebuild after the catalogue changes.
// Run after editing anything in src/ or the catalogue:   node tools/readiness-2-questions/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
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
  const lab = Object.fromEntries((labels && labels.uses || []).map(u => [u.id, u]));
  const depts = X.depts.map(d => ({ id: d.id, name: d.name, cat: d.cat, uses: d.uses.map((u, i) => {
    const id = d.id + '-' + (i + 1), o = { id, n: u.n, task: u.task, use: u.use || '' }, l = lab[id];
    /* kw and staff: the fields the readiness check's own model reads (search words; a tool that affects staff). */
    if (l) { if (l.name !== u.n) throw new Error('register label file out of step with the catalogue at ' + id); o.kw = l.kw || ''; if (l.staff) o.staff = true; }
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

/* The readiness check's own data model for vendor questions and the provisional AI Act label (rules v4): the same inputs and
   the same cuts as tools/readiness-check/build.mjs (nothing unverified is embedded: no Swiss or UK labour notes, nothing marked
   "to verify"). tests/build.test.mjs compares this block with the one the readiness check embeds. */
export function rcModel(rdyHtml, labels, ref) {
  const rdy = JSON.parse(rdyHtml.match(/<script id="rdy" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  const labourNotes = Object.fromEntries(Object.entries(ref.labourNotes).filter(([k, v]) => k !== 'CH' && k !== 'GB' && !/to\s+verify/i.test(v)));
  const switches = Object.fromEntries(Object.entries(ref.switches).map(([k, v]) => [k, { q: v.q, yes: v.yes }]));
  const reg = {
    labels: ref.labels, dates: ref.dates, switches, labourNotes, vendorQuestions: ref.vendorQuestions,
    items: ref.items.map(i => ({ id: i.id, pack: i.pack, role: i.role, since: i.since, who: i.who, text: i.text })),
    uses: labels.uses.map(u => ({ id: u.id, base: u.base, chat: !!u.chat, staff: !!u.staff, why: u.why, packs: u.packs || [], switches: u.switches || [] }))
  };
  /* Only what RCLogic.model(), legal() and vendorQs() read. */
  const rdyUsed = { areas: rdy.areas.map(a => ({ k: a.k, name: a.name })), q: rdy.q, blocks: rdy.blocks.map(b => ({ codes: b.codes })), arch: rdy.arch.map(a => ({ c: a.c, s: a.s, n: a.n })),
    uc: rdy.uc.map(u => ({ id: u.id, int: u.int, arch: u.arch, add: u.add, r: { te: u.r.te, fi: u.r.fi }, chk: u.chk })), addons: rdy.addons };
  return { rdy: rdyUsed, reg };
}
/* v2.7.0 (questions-only, owner 25 Nov 2026): step 5 reads data/usecase_questions_only.json, used verbatim (text, why, area,
   who answers). The signature of one use case's questions (ids and texts) marks which question list a saved answer belongs to. */
export const AREA_KEY = { People: 'pe', Skills: 'sk', 'Financial investment': 'fi', 'Technology infrastructure': 'te', Data: 'da', 'Organisation & governance': 'or' };
export const WHO_KEY = { GM: 'gm', 'Department head': 'dept', Finance: 'fin', IT: 'it', Owner: 'owner' };
export function tqSig(qs) { return createHash('sha1').update(JSON.stringify(qs.map(q => [q.id, q.text]))).digest('hex').slice(0, 10); }
/* The step-5 questions as the page needs them. Only runtime fields are shipped: original_questions, old_name and counts are review
   records (some quote old wording) and stay out of the page; carry_answer_from is kept for opening older saves.
   meta: data/must-meta.json (the team's resource analysis: blocks and counts for the must-have share lines). */
export function tqModel(Q, meta) {
  const uses = {};
  Q.use_cases.forEach(u => {
    uses[u.id] = { name: u.name, sensitive: !!u.sensitive, sig: tqSig(u.questions),
      qs: u.questions.map(q => {
        const a = AREA_KEY[q.area], who = WHO_KEY[q.who_answers];
        if (!a || !who) throw new Error('usecase_questions_only.json: unknown area or who answers at ' + q.id);
        const o = { id: q.id, a, q: q.text, why: q.why, who, whoLabel: q.who_answers };
        if (q.carry_answer_from) o.carry = q.carry_answer_from;
        return o;
      }) };
  });
  return { uses, areas: meta.areas, blocks: meta.blocks, matrixTotal: meta.matrixTotal, nFromWorkbook: meta.nFromWorkbook, nDraft: meta.nDraft };
}

/* v2.4 (owner, 24 Nov 2026): the detail layer. Each use case's catalogue entry, read from the catalogue page's <script id="data">
   at build time (one source of truth, never copied by hand): { <use id>: { srcs: [[type, name, note, url]] } }.
   v2.5 (council BUILD NOW 8): the catalogue's "AI technique" research notes are no longer bundled; they stay in the catalogue tab.
   Sources keep the catalogue's types: 'c' company, 'h' hotel (the catalogue shows a "Hotel" tag), 'r' a study in the catalogue's
   source list (name and link resolved from it, as the catalogue page does), 'l' a plain link. Only the entries the catalogue shows. */
export function detailModel(catHtml) {
  const m = catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('use-case-catalogue/index.html: no <script id="data"> block');
  const X = JSON.parse(m[1]), SRC = X.src || {}, out = {};
  X.depts.forEach(d => d.uses.forEach((u, i) => {
    const srcs = (u.srcs || []).map(s => {
      if (s[0] === 'r') { const r = SRC[s[1]]; if (!r) throw new Error('catalogue source ' + s[1] + ' is not in its source list (' + d.id + '-' + (i + 1) + ')'); return ['r', r[0], s[2] || '', r[1] || '']; }
      if (s[0] === 'c' || s[0] === 'h') return [s[0], s[1], s[2] || '', s[3] || ''];
      return ['l', s[1], '', s[2] || ''];
    });
    out[d.id + '-' + (i + 1)] = { srcs };
  }));
  return out;
}

/* The use-case explainer (v2.2, data/explain.json): { <use id>: { does, how } } for every catalogue use case, nothing left over. */
export function explainModel(E, ids) {
  const bad = ids.filter(id => !E[id] || typeof E[id].does !== 'string' || !E[id].does.trim() || typeof E[id].how !== 'string' || !E[id].how.trim()), extra = Object.keys(E).filter(id => !ids.includes(id));
  if (bad.length || extra.length) throw new Error('data/explain.json is out of step with the catalogue (missing or empty: ' + bad.join(' ') + '; left over: ' + extra.join(' ') + ')');
  return Object.fromEntries(ids.map(id => [id, { does: E[id].does, how: E[id].how }]));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const labels = JSON.parse(read('../register/data/uc-labels.json'));
  const catHtml = read('../use-case-catalogue/index.html'), cat = catalogueModel(catHtml, labels), detail = detailModel(catHtml);
  const Q = JSON.parse(read('data/usecase_questions_only.json')), meta = JSON.parse(read('data/must-meta.json'));
  /* Every catalogue use case must have its tailored questions, and no question may be left over: run data/build-questions.mjs after the catalogue changes. */
  const ids = cat.depts.flatMap(d => d.uses.map(u => u.id));
  const qIds = Q.use_cases.map(u => u.id), missing = ids.filter(id => !qIds.includes(id)), extra = qIds.filter(id => !ids.includes(id));
  if (missing.length || extra.length) throw new Error('data/usecase_questions_only.json is out of step with the catalogue (missing: ' + missing.join(' ') + '; left over: ' + extra.join(' ') + ')');
  const TQ = tqModel(Q, meta);
  const rc = rcModel(read('../readiness/index.html'), labels, JSON.parse(read('../register/data/reference.json')));
  const ex = explainModel(JSON.parse(read('data/explain.json')), ids);
  const data = { cat, tq: TQ, rc, ex, detail, builtOn: new Date().toISOString().slice(0, 10) };
  const block = `<script type="application/json" id="r2-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
  /* PDF: jsPDF and the "Register Sans" OFL font subset, inlined the way the AI Register and the AI Act guide do it. */
  const font = { regular: readFileSync(join(here, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(here, '../register/fonts/rs-bold.ttf')).toString('base64') };
  const fontBlock = `<script type="application/json" id="r2-font">${JSON.stringify(font)}</script>`;
  const safe = s => s.replace(/<\/script/gi, '<\\/script');
  let html = read('src/page.html');
  for (const [mark, text] of [['/*__STYLE__*/', read('src/style.css')], ['<!--__DATA__-->', block + '\n' + fontBlock], ['/*__JSPDF__*/', safe(read('../assessment/lib/jspdf.umd.min.js'))],
    ['/*__RCLOGIC__*/', safe(read('../readiness-check/src/logic.js'))], ['/*__RCSTORE__*/', safe(read('../readiness-check/src/store.js'))], ['/*__CONTENT__*/', safe(read('src/content.js'))],
    ['/*__LOGIC__*/', safe(read('src/logic.js'))], ['/*__FLOW__*/', safe(read('src/flow.js'))], ['/*__PDF__*/', safe(read('src/pdf.js'))], ['/*__APP__*/', safe(read('src/app.js'))]]) {
    if (!html.includes(mark)) throw new Error('src/page.html: missing ' + mark);
    html = html.replace(mark, () => text);
  }
  writeFileSync(join(here, 'index.html'), html);
  /* 25 Nov 2026: the shareable single file. Same page, with the flag that hides the links to the other hub tools. */
  mkdirSync(join(here, 'standalone'), { recursive: true });
  writeFileSync(join(here, 'standalone', 'index.html'), html.replace('<title>', '<script>window.R2_STANDALONE = true;</script>\n<title>'));
  console.log('wrote tools/readiness-2-questions/index.html', Math.round(html.length / 1024) + ' KB', '·', cat.nUses, 'use cases in', cat.nDepts, 'departments ·', Object.values(TQ.uses).reduce((a, u) => a + u.qs.length, 0), 'questions for the use cases');
}
