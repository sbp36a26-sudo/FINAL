// npm run gallery: every layout filled with the sample content, plus a sheet of every component,
// in out/gallery.html. Also renders out/gallery/<id>.png for review. The visual regression test
// (tests/gallery.spec.ts) screenshots this page.
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { sections } from '../src/brand.js';
import { layouts } from '../src/layouts/index.js';
import type { TocSection } from '../src/layouts/types.js';
import { documentHtml, spreadHtml, prepareAssets, NO_SECTION, componentCss } from '../src/render/document.js';
import { openPage, load, renderChecks, printProblems, OUT } from '../src/report.js';
import { SAMPLE } from '../src/layouts/sample.js';
import { componentSheet } from '../src/gallery-sheet.js';
import { writeFileSync } from 'node:fs';
import { validateContent } from '../src/validate/content.js';

prepareAssets(OUT);
mkdirSync(path.join(OUT, 'gallery'), { recursive: true });
const ids = layouts.map((l) => l.id);
// Sample contents: one spread per layout in gallery order, all in section 2 after the contents spread.
const sec = sections[1];
let n = 0;
const toc: TocSection[] = [{ section: sec, page: 3, anchor: 'g-divider', entries: [] }];
const numbered = layouts.filter((l) => l.id !== 'divider' && l.id !== 'contents');
numbered.forEach((l, i) => toc[0].entries.push({ number: `${sec.number}.${i + 1}`, title: l.sample.title ?? SAMPLE.quote, page: 5 + i * 2, anchor: `g-${l.id}` }));
const order = ['contents', 'divider', ...numbered.map((l) => l.id)];
const spreads = order.map((id, i) => {
  const l = layouts.find((x) => x.id === id)!;
  const isNumbered = id !== 'divider' && id !== 'contents';
  const html = spreadHtml({
    layout: l, content: l.sample, file: `gallery: ${l.id}`, section: id === 'contents' ? NO_SECTION : sec,
    number: isNumbered ? `${sec.number}.${++n}` : '', pages: [2 * i + 1, 2 * i + 2], anchor: `g-${l.id}`, sectionAnchor: id === 'divider' ? sec.number : undefined, toc, assets: 'assets',
  });
  return `<h2 class="g-label">${l.id} · ${l.name}</h2><p class="g-desc">${l.description}</p>${html}`;
});
const extra = `
.g-wrap { padding: calc(var(--u) * 12) 0; display: flex; flex-direction: column; align-items: center; gap: calc(var(--u) * 4); background: var(--color-rule); }
.g-label { margin: calc(var(--u) * 8) 0 0; width: var(--spread-w); font-family: var(--font-display); font-size: var(--fs-h1); line-height: var(--lh-h1); color: var(--color-ink); }
.g-desc { margin: 0; width: var(--spread-w); font-size: var(--fs-body); line-height: var(--lh-body); color: var(--color-ink); }
`;
const body = `<main class="g-wrap"><h1 class="g-label">Report Studio · gallery</h1><p class="g-desc">Every layout and component, filled with the sample content. Photos are placeholders.</p>${componentSheet()}${spreads.join('\n')}</main>`;
const file = path.join(OUT, 'gallery.html');
writeFileSync(file, await documentHtml(body, layouts, 'assets', 'Report Studio gallery', extra));
const { browser, page } = await openPage(1588 + 96 * 2, 1);
await load(page, file);
const problems = [...layouts.filter((l) => l.id !== 'contents').flatMap((l) => validateContent(`gallery: ${l.id}`, l.sample, l)), ...(await renderChecks(page))];
const loc = page.locator('.spread');
const count = await loc.count();
for (let i = 0; i < count; i++) {
  const name = (await loc.nth(i).getAttribute('data-file'))!.replace('gallery: ', '');
  await loc.nth(i).screenshot({ path: path.join(OUT, 'gallery', `${name}.png`) });
}
await browser.close();
console.log(`out/gallery.html: ${count} spreads (incl. component sheet); PNGs in out/gallery/`);
if (problems.length) { printProblems(problems); process.exit(1); }
console.log('✔ All checks passed.');
