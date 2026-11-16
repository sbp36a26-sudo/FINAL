// npm run lint: fails on any raw colour, px font size or off-grid spacing outside brand/tokens.css.
// 1. stylelint over every stylesheet the components and layouts ship (they live in .ts files).
// 2. A source scan of src/, scripts/ and tests/ for raw hex, px values and non-integer grid steps.
// 3. A check of tokens.css itself: every spacing token on the 4 px grid, except the team rulings.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import stylelint from 'stylelint';
import { ROOT, space } from '../src/brand.js';
import { componentCss } from '../src/render/document.js';
import { css as baseCss } from '../src/render/base.js';
import { css as sheetCss } from '../src/gallery-sheet.js';
import { layouts } from '../src/layouts/index.js';

const problems: string[] = [];

// 1. stylelint
const sheets: [string, string][] = [['base', baseCss], ['components', await componentCss()], ['gallery sheet', sheetCss], ...layouts.map((l) => [`layout ${l.id}`, l.css] as [string, string])];
const config = {
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix'],
    'unit-disallowed-list': ['px', 'pt', 'pc', 'cm', 'mm', 'in', 'q', 'rem', 'ex', 'ch'],
    'declaration-property-value-allowed-list': {
      'font-size': ['/^var\\(--fs-[a-z0-9-]+\\)$/'],
      'line-height': ['/^var\\(--lh-[a-z0-9-]+\\)$/', '0'],
      'font-family': ['/^var\\(--font-(display|body)\\)$/'],
      'font-weight': ['/^var\\(--weight-(display|body|bold)\\)$/'],
      'letter-spacing': ['/^var\\(--tracking-kicker\\)$/'],
    },
  },
};
for (const [name, code] of sheets) {
  const r = await stylelint.lint({ code, config });
  for (const res of r.results) for (const w of res.warnings) problems.push(`${name} (line ${w.line}): ${w.text}`);
}

// 2. source scan
const ALLOW_FUNCS = new Set(['src/runtime/checks.js']); // parses rgb() strings returned by the browser
const SKIP = new Set(['scripts/lint.ts', 'tests/checks.spec.ts']); // the patterns themselves / deliberate violations
const files: string[] = [];
const walk = (d: string) => { for (const f of readdirSync(d)) { const p = path.join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(ts|js|css|html)$/.test(f)) files.push(p); } };
['src', 'scripts', 'tests'].forEach((d) => { try { walk(path.join(ROOT, d)); } catch {} });
for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (SKIP.has(rel)) continue;
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    const at = `${rel}:${i + 1}`;
    if (/(^|[^&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/.test(line)) problems.push(`${at}: raw hex colour. Use a token from brand/tokens.css.`);
    if (/\b\d+(\.\d+)?px\b/.test(line)) problems.push(`${at}: raw px value. Use a token or calc(var(--u) * n).`);
    if (!ALLOW_FUNCS.has(rel) && /\b(rgba?|hsla?)\(/.test(line)) problems.push(`${at}: raw colour function. Use a token.`);
    for (const m of line.matchAll(/var\(--u\)\s*\*\s*(-?[\d.]+)/g)) if (!Number.isInteger(Number(m[1]))) problems.push(`${at}: calc(var(--u) * ${m[1]}) is off the 4 px grid.`);
  });
}

// 3. tokens.css
const tokens = readFileSync(path.join(ROOT, 'brand/tokens.css'), 'utf8');
const RULED = new Set(['margin-outer', 'spread-w', 'page-w', 'spread-h', 'page-h', 'radius', 'hairline']); // brand.json / decisions.json values
for (const m of tokens.matchAll(/--([a-z0-9-]+):\s*([\d.]+)px/g)) {
  const [, name, v] = m;
  if (name.startsWith('fs-') || RULED.has(name)) continue;
  if (Number(v) % space.u !== 0) problems.push(`brand/tokens.css: --${name}: ${v}px is off the ${space.u} px grid.`);
}

if (problems.length) {
  console.error(problems.map((p) => `✖ ${p}`).join('\n'));
  console.error(`\nLint failed: ${problems.length} problem(s).`);
  process.exit(1);
}
console.log(`✔ Lint passed: ${sheets.length} stylesheets, ${files.length} source files, tokens.css.`);
