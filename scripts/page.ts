// npm run page -- content/pages/<file>.yaml : validate and render one spread, then open its PNG.
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { ROOT, sectionByLabel } from '../src/brand.js';
import { plan, readSpread, ensureOut, writeDocument, openPage, load, renderChecks, printProblems, toInput, OUT, type PlannedSpread } from '../src/report.js';

const arg = process.argv[2];
if (!arg) { console.error('Usage: npm run page -- content/pages/<file>.yaml'); process.exit(2); }
const file = path.resolve(arg);
const rel = path.relative(ROOT, file);
const p = plan();
let spread: PlannedSpread | undefined = p.spreads.find((s) => s.file === rel);
let problems = p.problems.filter((x) => x.file === rel);
if (!spread) {
  // Not (yet) in report.yaml: render standalone as the first spread of its section.
  const r = readSpread(file);
  problems = r.problems;
  const section = sectionByLabel(r.content?.section);
  if (!r.layout || !section) { printProblems(problems); process.exit(1); }
  spread = { file: rel, layout: r.layout, content: r.content, section, number: r.layout.id === 'divider' ? '' : `${section.number}.1`, pages: [1, 2], anchor: 'spread-1' };
  console.log('Note: this spread is not listed in content/report.yaml; numbering and page numbers are provisional.');
}
ensureOut();
const html = path.join(OUT, 'page.html');
await writeDocument(html, [toInput(spread, p.toc)], spread.content.title ?? spread.layout.name);
const { browser, page } = await openPage();
await load(page, html);
problems.push(...(await renderChecks(page)));
const png = path.join(OUT, 'png', `${path.basename(file, '.yaml')}.png`);
await page.locator('.spread').first().screenshot({ path: png });
await browser.close();
console.log(`PNG: ${path.relative(ROOT, png)}`);
const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'explorer' : 'xdg-open';
if (!process.env.NO_OPEN && spawnSync(process.platform === 'win32' ? 'where' : 'which', [opener]).status === 0) spawn(opener, [png], { detached: true, stdio: 'ignore' }).unref();
if (problems.length) { printProblems(problems); console.error(`\n${problems.length} problem(s).`); process.exit(1); }
console.log('✔ All checks passed.');
