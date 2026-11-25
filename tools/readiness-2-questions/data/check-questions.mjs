// Checks data/usecase_questions_only.json, the step-5 questions (v2.8.0: the owner's corrected data after the live review, used verbatim).
// Flags: fewer than 6 or more than 12 questions in a use case, a question over 20 words, not exactly one question mark (at the end),
// a duplicate within a use case, a question text that appears in two use cases, an unknown area or "who answers", an empty "why".
// v2.8.0 adds: a question that leans on the one before it ("that person", "that team", "that manager"), and a use case that lacks
// one of the six areas (pillars); lg-4 "Rules and oversight for using AI" may lack Technology infrastructure (it is about rules, not a tool).
// A use case marked removed (lg-2) carries no questions and is not checked.
// Run:   node tools/readiness-2-questions/data/check-questions.mjs        (exit code 1 when anything is flagged)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const MIN_Q = 6, MAX_Q = 12, MAX_WORDS = 20;
export const AREAS = [['pe', 'People'], ['sk', 'Skills'], ['fi', 'Financial investment'], ['te', 'Technology infrastructure'], ['da', 'Data'], ['or', 'Organisation & governance']];
/* "who answers" (the data's labels) → the tool's role keys (R2Content.WHO). */
export const WHO = { GM: 'gm', 'Department head': 'dept', Finance: 'fin', IT: 'it', Owner: 'owner' };
export const DANGLING = /\bthat (person|team|manager)\b/i;
export const MAY_LACK = { 'lg-4': ['Technology infrastructure'] };
export const words = s => String(s).trim().split(/\s+/).filter(Boolean).length;
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function check(D) {
  const flags = [], f = (id, m) => flags.push(id + ': ' + m), where = new Map();
  D.use_cases.forEach(u => {
    if (u.removed) { if (u.questions.length) f(u.id, 'removed, but still has questions'); return; }
    const n = u.questions.length;
    AREAS.forEach(a => { if (!u.questions.some(q => q.area === a[1]) && !(MAY_LACK[u.id] || []).includes(a[1])) f(u.id, 'no question in the area ' + a[1]); });
    if (n < MIN_Q) f(u.id, 'only ' + n + ' questions');
    if (n > MAX_Q) f(u.id, n + ' questions');
    const seen = new Set(), ids = new Set();
    u.questions.forEach(q => {
      if (ids.has(q.id)) f(q.id, 'duplicate question id'); ids.add(q.id);
      if (!q.id.startsWith(u.id + '.')) f(q.id, 'id does not start with the use case id');
      if (words(q.text) > MAX_WORDS) f(q.id, words(q.text) + ' words: ' + q.text);
      if ((q.text.match(/\?/g) || []).length !== 1 || !/\?$/.test(q.text)) f(q.id, 'not exactly one question mark, at the end: ' + q.text);
      const k = norm(q.text);
      if (seen.has(k)) f(q.id, 'duplicate question in the use case: ' + q.text); seen.add(k);
      if (where.has(k) && where.get(k) !== u.id) f(q.id, 'also asked in ' + where.get(k) + ': ' + q.text); where.set(k, u.id);
      if (!AREAS.some(a => a[1] === q.area)) f(q.id, 'unknown area ' + q.area);
      if (!WHO[q.who_answers]) f(q.id, 'unknown who answers ' + q.who_answers);
      if (!String(q.why || '').trim()) f(q.id, 'no why line');
      if (DANGLING.test(q.text)) f(q.id, 'leans on the question before it ("' + q.text.match(DANGLING)[0] + '"): ' + q.text);
    });
  });
  return flags;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const D = JSON.parse(readFileSync(join(here, 'usecase_questions_only.json'), 'utf8'));
  const flags = check(D);
  flags.forEach(x => console.log('FLAG  ' + x));
  const listed = D.use_cases.filter(u => !u.removed), per = listed.map(u => u.questions.length), n = per.reduce((a, b) => a + b, 0);
  console.log(listed.length + ' use cases listed (' + (D.use_cases.length - listed.length) + ' removed), ' + n + ' questions (' + Math.min(...per) + ' to ' + Math.max(...per) + ' each), ' + flags.length + ' flagged');
  if (flags.length) process.exit(1);
}
