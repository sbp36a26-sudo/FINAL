// Generates the tailored questions for step 5 of "Do you need AI?" (data/usecase-questions.json).
// Deterministic: the same inputs always give the same file. No question is written by hand here;
// hand edits go in data/overrides.json only (keyed "<use id>.<question id>", each with a reason).
//
// Inputs, all read at run time:
//   data/excel-rows.json            the owner's workbook, extracted by data/extract-excel.py (91 use cases, six resource cells each)
//   ../use-case-catalogue/index.html  the catalogue (99 use cases): ids are '<dept id>-<1-based index>', names matched to the workbook
//   ../readiness/index.html <script id="rdy">  DRAFT rows for the use cases the workbook does not have, and the archetype one-liners
//   data/overrides.json
// Run:   node tools/readiness-2/data/build-questions.mjs      then   node tools/readiness-2/data/check-questions.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const AREAS = [['pe', 'People'], ['sk', 'Skills'], ['fi', 'Financial investment'], ['te', 'Technology infrastructure'], ['da', 'Data'], ['or', 'Organisation & governance']];
export const MAX_WORDS = 30, MIN_Q = 6, MAX_Q = 10;
/* Who usually does it, by area (the readiness check's roles: tools/readiness-check/src/logic.js WHO). */
const WHO = { pe: 'gm', sk: 'dept', fi: 'fin', te: 'it', da: 'dept', or: 'gm' };

/* ---------- reading a cell ---------- */
/* Legal references are signposts only (workbook README, "Legal flags"): article numbers and "see D7" never reach a hotel. */
export function clean(s) {
  return String(s || '')
    .replace(/\s*\((?:[^()]*\bsee D7\b[^()]*|[^()]*\bArt\.[^()]*)\)/gi, '')
    .replace(/\s*[–-]\s*see D7/gi, '')
    .replace(/\s*\(often\s+missing\)/gi, '').replace(/\s*\(claimed by vendors\)/gi, '').replace(/\s*\(claimed\)/gi, '')
    .replace(/^Disclose AI to (guests|callers)\b/i, 'Tell $1 they are dealing with AI').replace(/^Disclose AI$/i, 'Tell guests they are dealing with AI')
    .replace(/^Rule: /i, '').replace(/^works council$/i, 'consultation of the works council or staff representatives')
    .replace(/\s+/g, ' ').trim().replace(/[.;,:]$/, '');
}
export function items(cell) {
  const c = String(cell || '').trim();
  if (!c || /^(—|-|n\/a)$/i.test(c)) return [];
  return clean(c).split(/;\s*(?![^()]*\))/).map(clean).filter(Boolean); // a semicolon inside brackets does not start a new item
}
const KEEP_CAP = /^(Wi-Fi|Cvent|English)\b/;
/* First letter to lower case, unless the first word is an abbreviation or a name (RMS, GM, PMS/CRS, Wi-Fi, IoT, GDPR …). */
export function lower(s) {
  if (KEEP_CAP.test(s)) return s;
  const first = s.split(/[\s/,:(–]/)[0];
  if (/^[A-Z][a-z'’]+$/.test(first) || /^[A-Z][a-z]*-[a-z-]+$/.test(first)) return s.charAt(0).toLowerCase() + s.slice(1);
  return s;
}
/* An inner colon would clash with the question's own colon: "Upsell platform: commission or subscription" → "upsell platform (commission or subscription)". */
function inner(s) { const i = s.indexOf(': '); return i < 0 ? s : s.slice(0, i) + ' (' + s.slice(i + 2) + ')'; }
const busy = x => /,| and | or /.test(x);
/* "a and b" for two plain items; ", and also" when an item has its own commas or "and". */
function joinItems(list, fn) {
  const l = list.map(x => (fn || (y => inner(lower(y))))(x));
  if (l.length === 1) return l[0];
  if (l.length > 2 && !l.some(busy)) return l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1];
  if (l.length === 2) return l[0] + (l.some(x => busy(x) || words(x) > 3) ? ', and also ' : ' and ') + l[1];
  return l.slice(0, -1).join(', also ') + ', and also ' + l[l.length - 1];
}

/* ---------- shapes (what kind of phrase a cell item is) ---------- */
/* People: "<who> <does something>" (a short sentence), "<who> as users", a plain role, or something else to have in place. */
const VERBS = 'owns|own|reviews|review|signs|sets|supervises|handle|handles|approves|approve|checks|check|acts|act|monitors|monitor|uses|use|take|takes|log|logs|keep|keeps|fulfils|fulfil|receives|receive|treats|decide|validates|load|move|supports|maintains|offered';
const SENTENCE = new RegExp('^(?:[A-Za-z/&’\'-]+ ){1,5}?(?:' + VERBS + ')\\b');
const NOT_ROLE = /^(incentives|clear |staff fallback|works council)/i;
const NO_ARTICLE = new RegExp('^(?:(?:one|staff|supervisors|each|a|an|all)\\b|(?:marketing|engineering|hr|it|finance|housekeeping)(?: plus| (?:' + VERBS + ')\\b|$))', 'i');
const the = x => (NO_ARTICLE.test(x) ? '' : 'the ') + lower(x);
export function peShape(x) { return / as users$/i.test(x) ? 'users' : NOT_ROLE.test(x) ? 'thing' : SENTENCE.test(x) ? 'sentence' : 'role'; }
/* Skills: something to do ("Choose a sensible competitive set"), something to have ("Call-review skills"), or a field to know. */
const IMPERATIVE = /^(Choose|Check|Read|Set|Judge|Handle|Use|Trust|Adjust|Configure|Respond|Maintain|Edit|Turn|Curate|Qualify|Verify|Review|Investigate|Interpret|Monitor|Supervise|Understand|Load|Photograph|Follow|Know|Spot|Audit|Brief|Agree|Tell|Disclose|Limit|Keep|Link|Connect|Avoid|Challenge)\b(?!-)/i;
const isDo = x => IMPERATIVE.test(x) && !/^audit[- ](log|trail)\b/i.test(x);
export function skShape(x) { return isDo(x) ? 'do' : /^Enough\b|\b(knowledge|skills?|literacy|discipline)\b(?!-)/i.test(x) ? 'have' : 'know'; }
/* Legal signposts in the workbook: asked as "has someone checked", never as a statement about the law. */
const LEGAL = /^(GDPR|PCI DSS|High-risk AI|Working-time law|Reporting obligations|Biometric data|Biometric uses|Employee monitoring|Employee data|Cookie|Data retention|ID data|Explicit consent)\b/i;
const LEGAL_DATA = /^(Biometric data|ID data)\b/;
const PAID_ELSEWHERE = /^(Usually|Often|Included|Low\b)/;
export function orShape(x) { return LEGAL.test(x) ? 'legal' : isDo(x) ? 'do' : 'thing'; }

function peQ(list) {
  const sh = list.map(peShape);
  if (sh.every(x => x === 'sentence')) return { q: 'Is it agreed that ' + list.map(the).join(', and ') + '?', kind: 'pe-agreed' };
  if (sh.every(x => x === 'role')) return { q: 'Will ' + joinItems(list, the) + ' be in charge of this tool?', kind: 'pe-role' };
  if (sh.every(x => x === 'users')) return { q: 'Will ' + joinItems(list.map(x => x.replace(/ as users$/i, '')), the) + ' use this tool, and have they been shown how?', kind: 'pe-users' };
  if (sh.every(x => x === 'thing')) return { q: 'Is this in place: ' + joinItems(list) + '?', kind: 'pe-thing' };
  return { q: 'Is this agreed for the people involved: ' + joinItems(list) + '?', kind: 'pe-mixed' };
}
/* "Forecast literacy: read accuracy, spot bad inputs, override with reason" → the things to do after the colon. */
function skItem(x) { const i = x.indexOf(': '); return i > 0 && isDo(x.slice(i + 2)) ? x.slice(i + 2).replace(/, ([^,]*)$/, ' and $1') : x; }
function skQ(list0) {
  const list = list0.map(skItem), parts = [];
  list.forEach(x => { const s = skShape(x), last = parts[parts.length - 1]; if (last && last.s === s) last.l.push(x); else parts.push({ s, l: [x] }); });
  const START = { do: 'Can the people involved ', have: 'Do the people involved have ', know: 'Do the people involved know enough about ' };
  const MORE = { do: ', and can they ', have: ', and do they have ', know: ', and do they know enough about ' };
  return { q: parts.map((p, i) => (i ? MORE : START)[p.s] + joinItems(p.l)).join('') + '?', kind: 'sk-' + parts.map(p => p.s).join('+') };
}
function note(list) { return list.map(x => lower(x).replace(': ', ', ').replace(/\s*\(([^()]*)\)/g, ', $1')).join(', and '); }

/* One question from a list of items of one area. Returns { q, kind } (kind names the frame, for the tests and the notes). */
export function frame(area, list) {
  const first = list[0], t = joinItems(list), many = list.length > 1;
  switch (area) {
    case 'pe': return peQ(list);
    case 'sk': return skQ(list);
    case 'fi':
      return PAID_ELSEWHERE.test(first) ? { q: 'Have you checked whether you already pay for this (the team’s note: ' + note(list) + ')?', kind: 'fi-how' }
        : { q: 'Do you know what this will cost your hotel: ' + t + '?', kind: 'fi-cost' };
    case 'te': {
      if (/^None$/i.test(first) && !many) return { q: 'Is it confirmed that this works without a link to your hotel systems?', kind: 'te-none' };
      if (/^None or /i.test(first)) return { q: 'Have you decided whether you need this optional link: ' + joinItems([first.replace(/^None or /i, '')].concat(list.slice(1))) + '?', kind: 'te-optional' };
      if (/^(Link|Connect) (?!to\b)/.test(first) && !many) return { q: 'Has it been confirmed that you can ' + lower(first) + '?', kind: 'te-can' };
      const l2 = list.map(x => x.replace(/^[A-Z][a-z]+ needs? /, ''));
      return { q: 'Is this in place, or confirmed as possible: ' + joinItems(l2) + '?', kind: 'te-place' };
    }
    case 'da':
      return LEGAL_DATA.test(first) ? { q: 'Has a named person checked what the law asks for this data: ' + t + '?', kind: 'legal' } : { q: 'Is this data ready, digital and up to date: ' + t + '?', kind: 'da-ready' };
    case 'or': {
      const sh = list.map(orShape);
      if (sh[0] === 'legal') return { q: 'Has a named person checked what the law asks here: ' + t + '?', kind: 'legal' };
      return sh.every(x => x === 'do') ? { q: 'Has this been done: ' + t + '?', kind: 'or-done' } : { q: 'Is this in place and written down: ' + t + '?', kind: 'or-written' };
    }
  }
  throw new Error('unknown area ' + area);
}
/* Do the items of one cell need different kinds of question? Then they are asked apart where the 10-question limit allows. */
export function mixed(area, list) {
  if (list.length < 2) return false;
  const sh = area === 'pe' ? list.map(peShape) : area === 'or' ? list.map(orShape) : area === 'fi' ? list.map(x => PAID_ELSEWHERE.test(x)) : area === 'da' ? list.map(x => LEGAL_DATA.test(x)) : [];
  return new Set(sh).size > 1;
}
export const words = s => String(s).trim().split(/\s+/).length;

/* Organisation question by type of tool, used only where the workbook's organisation cell is empty ("—").
   Wording follows the archetype's "extra" needs in the team's sheet (tools/readiness rdy.arch). */
const ARCH_OR = {
  A1: 'Do staff know that a person must read and correct the AI’s text before it is used?',
  A2: 'Is it written down when the AI hands a guest over to a person?',
  A3: 'Are there written limits for what the tool may set by itself, and who can override it?',
  A4: 'Is it written down which offers the tool may make by itself?',
  A5: 'Is it agreed who handles the cases the tool cannot process?',
  A6: 'Are there written limits on what the AI agent may change by itself?',
  A7: 'Is it agreed who looks after the equipment and what happens when it fails?',
  A8: 'Is a named person responsible for acting on each alert or report?',
  A9: 'Does a person, not the tool, take every decision about a guest or a staff member?'
};
/* Add-on questions (workbook sheet "Use case archetypes"). sens: the readiness check's neutral DPIA wording (rules v4, G2s). */
export const ADDON = {
  sens: { a: 'or', who: 'dpo', q: 'Has a data protection impact assessment (DPIA) been done for this tool?', na: 'Checked: not required (confirmed in writing)',
    help: 'A DPIA (data protection impact assessment) is a written assessment that data protection law requires before processing that is likely to put people at high risk. Your data protection contact decides whether this tool needs one.',
    act: 'Ask your data protection contact whether this tool needs a data protection impact assessment (DPIA), and have it done before the tool goes live if it does.',
    why: 'The team’s sheet flags this use case as handling sensitive personal data (for example biometric or employee data).' },
  pay: { a: 'or', who: 'it', q: 'Has your IT or security contact checked that the tool and its vendor meet the card-data security rules your payment provider requires?',
    help: 'Card-data security rules: the payment card industry’s standard (PCI DSS). Your payment provider or bank can tell you what applies to you.',
    act: 'Ask your payment provider which card-data security rules apply, and have IT check the tool and its vendor against them.',
    why: 'The team’s sheet flags this use case as touching card or payment data.' },
  hw: { a: 'fi', who: 'owner', q: 'Is the money for the equipment approved as a capital budget: buying or leasing, installing and maintaining it?',
    help: 'In a managed or franchised hotel the owner usually approves capital spending.',
    act: 'Get the capital budget for the equipment approved (buying or leasing, installing, maintaining).',
    why: 'The team’s sheet flags this use case as needing hardware to buy or lease.' },
  auto: { a: 'or', who: 'dept', q: 'Are there written limits on what the tool may do by itself, and a named person who can switch it off?',
    help: 'For example price floors and ceilings, which guest questions it may answer, or which actions need a person’s approval first.',
    act: 'Write down what the tool may do by itself, and name who can switch it off and how.',
    why: 'The team’s sheet flags this use case as acting without a person signing off each action.' }
};

function actFor(area, kind, list) {
  const t = list.map(x => inner(x)).join('; ');
  if (kind === 'legal') return 'Ask your data protection contact or legal adviser what applies: ' + t + '.';
  if (kind === 'te-none') return 'Ask the vendor to confirm that the tool works without a link to your hotel systems.';
  if (kind === 'fi-how') return 'Check whether you already pay for this (the team’s note: ' + note(list) + ').';
  return ({ pe: 'Agree and write down: ', sk: 'Train or brief the people involved: ', fi: 'Get a price and add it to the budget: ', te: 'Put in place, or get confirmed: ', da: 'Get this data in order: ', or: 'Agree in writing: ' })[area] + t + '.';
}

/* ---------- one use case ---------- */
export function forUse(u, overrides) {
  const ov = overrides || {};
  /* The sensitive-data add-on asks the DPIA question itself: a bare "DPIA" item in a cell would ask it twice. */
  const cells = AREAS.map(([k]) => ({ k, list: items(u.r[k]).filter(x => !((u.add || []).includes('sens') && /^DPIA$/i.test(x))) }));
  /* 1. one question per cell with content */
  /* "None" under technology means no link is needed. For a tool that is worth confirming; for the one entry that is a document, not a tool (no archetype), there is nothing to ask. */
  let parts = cells.filter(c => c.list.length && !(c.k === 'te' && !u.arch && /^None$/i.test(c.list.join(';')))).map(c => ({ k: c.k, groups: [c.list] }));
  const addons = (u.add || []).filter(k => ADDON[k]);
  const count = () => parts.reduce((n, p) => n + p.groups.length, 0) + addons.length + (needArch() ? 1 : 0);
  function needArch() { return !cells.find(c => c.k === 'or').list.length && !!ARCH_OR[u.arch]; }
  const canSplit = p => p.groups.length === 1 && p.groups[0].length > 1;
  /* Split into two: by kind of question where the items differ (first run of one kind | the rest), else in the middle. */
  const split = p => {
    const l = p.groups[0]; let cut = l.length > 2 ? Math.ceil(l.length / 2) : 1;
    if (mixed(p.k, l)) { const kind = x => frame(p.k, [x]).kind; cut = 1; while (cut < l.length && kind(l[cut]) === kind(l[0])) cut++; }
    p.groups = [l.slice(0, cut), l.slice(cut)];
  };
  /* 2. forced splits: a cell whose single question would run over the word limit */
  parts.forEach(p => { if (canSplit(p) && words(frame(p.k, p.groups[0]).q) > MAX_WORDS && count() < MAX_Q) split(p); });
  /* 3. different kinds of need in one cell (a role and an agreement; a legal point and a rule): asked apart, governance and people first */
  for (const k of ['or', 'pe', 'da', 'fi']) { const p = parts.find(x => x.k === k); if (p && canSplit(p) && mixed(k, p.groups[0]) && count() < MAX_Q - 1) split(p); }
  /* 4. fewer than six questions (an empty cell): split the cells with several needs until there are six */
  for (const k of ['or', 'pe', 'da', 'te', 'sk', 'fi']) { const p = parts.find(x => x.k === k); if (p && canSplit(p) && count() < MIN_Q) split(p); }
  const qs = [];
  parts.forEach(p => p.groups.forEach((g, i) => {
    const f = frame(p.k, g), id = p.k + (i + 1);
    qs.push({ id, a: p.k, q: f.q, kind: f.kind, who: f.kind === 'legal' ? 'dpo' : WHO[p.k], act: actFor(p.k, f.kind, g), from: g.join('; ') });
  }));
  if (needArch()) qs.push({ id: 'or1', a: 'or', q: ARCH_OR[u.arch], kind: 'arch', who: 'gm', act: 'Agree and write down: ' + ARCH_OR[u.arch].replace(/\?$/, '').replace(/^(Do|Is|Are|Does) /, '').replace(/^./, c => c.toUpperCase()) + '.', from: '' });
  addons.forEach(k => { const A = ADDON[k]; qs.push({ id: 'x-' + k, a: A.a, q: A.q, kind: 'addon', addon: k, who: A.who, act: A.act, help: A.help, from: '', ...(A.na ? { na: A.na } : {}) }); });
  /* 5. hand edits, only through data/overrides.json */
  qs.forEach(x => { const o = ov[u.id + '.' + x.id]; if (o) { if (o.q) x.q = o.q; if (o.act) x.act = o.act; if (o.who) x.who = o.who; x.edited = true; } });
  const order = Object.fromEntries(AREAS.map(([k], i) => [k, i]));
  qs.sort((x, y) => (x.kind === 'addon') - (y.kind === 'addon') || order[x.a] - order[y.a] || x.id.localeCompare(y.id));
  return qs;
}

/* ---------- all use cases ---------- */
export function inputs() {
  const X = JSON.parse(readFileSync(join(here, 'excel-rows.json'), 'utf8'));
  const catHtml = readFileSync(join(here, '../../use-case-catalogue/index.html'), 'utf8');
  const cat = JSON.parse(catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  const rdy = JSON.parse(readFileSync(join(here, '../../readiness/index.html'), 'utf8').match(/<script id="rdy" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  const overrides = JSON.parse(readFileSync(join(here, 'overrides.json'), 'utf8'));
  return { X, cat, rdy, overrides };
}
export function generate({ X, cat, rdy, overrides }) {
  const byName = new Map(X.rows.map(r => [r.dept + '|' + r.name, r]));
  const rdyUc = new Map(rdy.uc.map(u => [u.id, u]));
  const uses = {}; let nExcel = 0, nDraft = 0; const used = new Set();
  cat.depts.forEach(d => d.uses.forEach((cu, i) => {
    const id = d.id + '-' + (i + 1), row = byName.get(d.name + '|' + cu.n);
    let u, draft = false, ev = '', draftNote = '';
    if (row) { u = { id, ...row }; used.add(row); ev = row.ev; nExcel++; }
    else {
      const r = rdyUc.get(id);
      if (!r) throw new Error('no workbook row and no draft row for ' + id + ' (' + cu.n + ')');
      if (!/^Team draft/.test(r.ev || '')) throw new Error(id + ': not in the workbook, and its row in tools/readiness is not marked as a team draft');
      u = { id, int: r.int, arch: r.arch, add: r.add || [], r: r.r, chk: r.chk || [] }; draft = true; draftNote = r.ev; nDraft++;
    }
    uses[id] = { name: cu.n, int: u.int, arch: u.arch || '', add: u.add || [], ev, draft, ...(draft ? { draftNote } : {}), qs: forUse(u, overrides.edits) };
  }));
  const lost = X.rows.filter(r => !used.has(r));
  if (lost.length) throw new Error('workbook rows not found in the catalogue: ' + lost.map(r => r.name).join(' | '));
  Object.keys(overrides.edits).forEach(k => { const [id, q] = k.split('.'); if (!uses[id] || !uses[id].qs.some(x => x.id === q)) throw new Error('overrides.json: no such question ' + k); });
  const arch = Object.fromEntries(rdy.arch.map(a => [a.c, { n: a.n, what: a.what }]));
  return { note: 'GENERATED by tools/readiness-2/data/build-questions.mjs. Do not edit: change the generator or data/overrides.json and run it again.',
    workbook: X.source, nUses: Object.keys(uses).length, nFromWorkbook: nExcel, nDraft, intensity: X.intensity, arch,
    areas: Object.fromEntries(AREAS), addonWhy: Object.fromEntries(Object.entries(ADDON).map(([k, v]) => [k, v.why])),
    blocks: X.blocks, matrixTotal: X.matrixTotal, uses };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const out = generate(inputs());
  writeFileSync(join(here, 'usecase-questions.json'), JSON.stringify(out, null, 1) + '\n');
  const n = Object.values(out.uses).reduce((a, u) => a + u.qs.length, 0);
  console.log('wrote data/usecase-questions.json:', out.nUses, 'use cases (' + out.nFromWorkbook + ' from the workbook, ' + out.nDraft + ' drafts),', n, 'questions');
}
