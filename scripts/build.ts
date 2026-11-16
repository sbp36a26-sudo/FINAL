// npm run build: validate every spread in content/report.yaml, render PNGs (2x) and one vector PDF.
import path from 'node:path';
import { space } from '../src/brand.js';
import { plan, ensureOut, writeDocument, openPage, load, renderChecks, printProblems, toInput, OUT } from '../src/report.js';

const p = plan();
ensureOut();
const inputs = p.spreads.map((s) => toInput(s, p.toc));
const html = path.join(OUT, 'report.html');
await writeDocument(html, inputs, p.title);
const { browser, page } = await openPage();
await load(page, html);
const problems = [...p.problems, ...(await renderChecks(page))];
const spreads = page.locator('.spread');
for (let i = 0; i < p.spreads.length; i++) {
  const name = `${String(i + 1).padStart(2, '0')}-${path.basename(p.spreads[i].file, '.yaml').replace(/[^\w-]+/g, '-')}.png`;
  await spreads.nth(i).screenshot({ path: path.join(OUT, 'png', name) });
}
await page.pdf({ path: path.join(OUT, 'report.pdf'), width: `${space.spreadW}px`, height: `${space.spreadH}px`, printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`Rendered ${p.spreads.length} spreads (${p.spreads.length * 2} pages): out/report.pdf, out/png/`);
if (problems.length) {
  printProblems(problems);
  console.error(`\nBuild failed: ${problems.length} problem(s). The PDF and PNGs above are for review only.`);
  process.exit(1);
}
console.log('✔ All checks passed.');
