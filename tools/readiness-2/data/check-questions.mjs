// Checks data/usecase-questions.json. Flags: fewer than 6 or more than 10 questions, a question over 30 words, no question mark
// at the end (or one in the middle), a leftover semicolon, a duplicate within a use case, a legal reference that must not reach
// a hotel (article numbers, "see D7"), an empty area the workbook has content for, and a file that differs from what the generator makes now.
// Run:   node tools/readiness-2/data/check-questions.mjs         (exit code 1 when anything is flagged)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, inputs, words, MAX_WORDS, MIN_Q, MAX_Q, AREAS, items } from './build-questions.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export function check(J, src) {
  const flags = [], f = (id, m) => flags.push(id + ': ' + m);
  Object.entries(J.uses).forEach(([id, u]) => {
    if (u.qs.length < MIN_Q) f(id, 'only ' + u.qs.length + ' questions');
    if (u.qs.length > MAX_Q) f(id, u.qs.length + ' questions');
    const seen = new Set(), ids = new Set();
    u.qs.forEach(x => {
      const tag = id + '.' + x.id;
      if (ids.has(x.id)) f(tag, 'duplicate question id'); ids.add(x.id);
      if (words(x.q) > MAX_WORDS) f(tag, words(x.q) + ' words: ' + x.q);
      if (!/\?$/.test(x.q)) f(tag, 'no question mark at the end: ' + x.q);
      if (/\?./.test(x.q)) f(tag, 'question mark in the middle: ' + x.q);
      if (/;/.test(x.q)) f(tag, 'leftover semicolon: ' + x.q);
      if (/see D7|\bArt\.|\bAnnex\b/i.test(x.q + ' ' + x.act)) f(tag, 'legal reference in hotel-facing text: ' + x.q);
      if (/\s{2,}|\(\s*\)|,\s*,|: ?\?/.test(x.q)) f(tag, 'untidy text: ' + x.q);
      if (!/^[A-Z]/.test(x.q)) f(tag, 'does not start with a capital: ' + x.q);
      const key = x.q.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      if (seen.has(key)) f(tag, 'duplicate question: ' + x.q); seen.add(key);
      if (!x.act || !/\.$/.test(x.act)) f(tag, 'action missing or without a full stop: ' + x.act);
      if (!AREAS.some(a => a[0] === x.a)) f(tag, 'unknown area ' + x.a);
    });
  });
  if (src) {
    /* every workbook cell with content has at least one question in its area */
    const byName = new Map(src.X.rows.map(r => [r.name, r]));
    Object.entries(J.uses).forEach(([id, u]) => { const r = byName.get(u.name); if (!r) return; AREAS.forEach(([k]) => { if (items(r.r[k]).length && !(k === 'te' && !u.arch && /^None$/i.test(r.r[k])) && !u.qs.some(x => x.a === k && x.kind !== 'addon')) f(id, 'workbook cell without a question: ' + k); }); });
    if (JSON.stringify(generate(src)) !== JSON.stringify(J)) flags.push('usecase-questions.json is not what the generator makes now: run build-questions.mjs');
  }
  return flags;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const J = JSON.parse(readFileSync(join(here, 'usecase-questions.json'), 'utf8'));
  const flags = check(J, inputs());
  flags.forEach(x => console.log('FLAG  ' + x));
  const n = Object.values(J.uses).reduce((a, u) => a + u.qs.length, 0), per = Object.values(J.uses).map(u => u.qs.length);
  console.log(Object.keys(J.uses).length + ' use cases, ' + n + ' questions (' + Math.min(...per) + ' to ' + Math.max(...per) + ' each), ' + flags.length + ' flagged');
  if (flags.length) process.exit(1);
}
