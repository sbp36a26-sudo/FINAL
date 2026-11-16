// Generates neutral placeholder photos (token colours only) at each ratio the layouts require,
// so the gallery and tests run before real photos exist. Replace them with real photos.
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { ROOT } from '../src/brand.js';
import { prepareAssets } from '../src/render/document.js';
import { OUT } from '../src/report.js';

const SIZES: [string, number, number, string][] = [
  ['placeholder-a4.png', 794, 1123, '1:1.414'],
  ['placeholder-4x3.png', 1200, 900, '4:3'],
  ['placeholder-1x1.png', 1000, 1000, '1:1'],
  ['placeholder-2x1.png', 1600, 800, '2:1'],
];
prepareAssets(OUT);
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, w, h, ratio] of SIZES) {
  const html = `<!doctype html><html><head><link rel="stylesheet" href="assets/tokens.css"><link rel="stylesheet" href="assets/fonts/fonts.css">
<style>body{margin:0} .ph{width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:var(--u);
background:repeating-linear-gradient(135deg,var(--color-rule) 0 calc(var(--u)*10),var(--color-rule-dark) calc(var(--u)*10) calc(var(--u)*20));
font-family:var(--font-display);font-weight:var(--weight-display);color:var(--color-ink)}
.ph span{background:var(--color-paper);padding:calc(var(--u)*2) calc(var(--u)*4);font-size:var(--fs-h1);line-height:var(--lh-h1)}</style></head>
<body><div class="ph"><span>Placeholder photo</span><span>${ratio}</span></div></body></html>`;
  const file = path.join(OUT, 'placeholder.html');
  writeFileSync(file, html);
  await page.setViewportSize({ width: w, height: h });
  await page.goto('file://' + file);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(ROOT, 'content/images', name) });
  console.log(`content/images/${name} (${w} x ${h}, ${ratio})`);
}
await browser.close();
