// The banned-term grep of spec/MASTER_PROMPT.md §5: no legal content anywhere in the tool. Used by build.mjs (the build fails on a
// match) and tests/banned.test.mjs (the test fails on a match). Case-insensitive and word-bounded (a term must not touch a letter or
// digit on either side). Allowlist: only the two exact texts of §2.7, removed before the scan. Nothing else is excused.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const TERMS = ['AI Act', 'Article', 'Art.', 'Annex', 'high-risk', 'DPIA', 'GDPR', 'FADP', 'prohibited', 'CE mark', 'works council', 'PCI',
  'consent', 'legal basis', 'law', 'laws', 'regulation', 'compliance', 'EU', 'not legal advice'];
export const ALLOW = ['This check does not cover legal requirements. Check those with your adviser before you start.',
  "This area involves people's personal data or jobs and has extra rules. Ask an adviser before a pilot."];

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
export const RE = new RegExp('(?<![A-Za-z0-9])(?:' + TERMS.slice().sort((a, b) => b.length - a.length).map(esc).join('|') + ')(?![A-Za-z0-9])', 'gi');

/* [{ line, col, term, text }] for one text, after the allowlisted strings are taken out (replaced by spaces of the same length,
   so line numbers stay right). Typographic apostrophes in the allowlist are matched too. */
export function scan(text) {
  let t = String(text);
  ALLOW.forEach(a => { [a, a.replace(/'/g, '\u2019')].forEach(s => { t = t.split(s).join(' '.repeat(s.length)); }); });
  const out = [];
  t.split('\n').forEach((line, i) => { let m; RE.lastIndex = 0; while ((m = RE.exec(line))) out.push({ line: i + 1, col: m.index + 1, term: m[0], text: line.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40) }); });
  return out;
}

/* The built page with the two vendored blocks blanked: jsPDF (minified third-party code, <script id="r3-jspdf">) and the PDF font
   (base64 data, <script id="r3-font">). Their matches are not legal content (a language-code table and kerning keys in jsPDF,
   random letters in base64); they are listed in LEGAL_LEFTOVERS.md. Line numbers are kept. */
export function pageText(html) {
  return html.replace(/(<script[^>]*id="(?:r3-jspdf|r3-font)"[^>]*>)([\s\S]*?)(<\/script>)/g, (all, a, body, z) => a + body.replace(/[^\n]/g, ' ') + z);
}

/* The v3 sources: every file under tools/readiness-3 except spec/ (the owner's files, with their change-log fields), the change log,
   the leftovers list and review response (they name what was removed), tests/out/ (generated), index.html (scanned as pageText),
   this file (it holds the list) and binary files. */
export const SKIP = [/^spec\//, /^tests\/out\//, /^tests\/browser\/shots\//, /^CHANGELOG\.md$/, /^LEGAL_LEFTOVERS\.md$/, /^REVIEW_RESPONSE\.md$/, /^index\.html$/, /^lib\/banned\.mjs$/, /^\.gitignore$/, /\.(png|pdf|ttf|xlsx)$/i];
export function sourceFiles(root) {
  const out = [];
  (function walk(d) { readdirSync(d).forEach(f => { const p = join(d, f), r = relative(root, p).split('\\').join('/'); if (statSync(p).isDirectory()) { if (!SKIP.some(x => x.test(r + '/'))) walk(p); } else if (!SKIP.some(x => x.test(r))) out.push(r); }); })(root);
  return out.sort();
}
export function scanSources(root) {
  const hits = [];
  sourceFiles(root).forEach(f => scan(readFileSync(join(root, f), 'utf8')).forEach(h => hits.push(Object.assign({ file: f }, h))));
  return hits;
}
