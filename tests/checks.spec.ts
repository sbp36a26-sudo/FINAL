// The render checks must catch each kind of violation. Each case breaks one sample spread.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { renderChecks } from '../src/report.js';

const GALLERY = 'file://' + path.resolve('out/gallery.html');

const cases: [string, string, RegExp][] = [
  ['colour not in tokens', `el.style.color = 'rgb(255, 0, 0)'`, /colour: text colour #FF0000 is not a brand token/],
  ['text below caption size', `el.style.fontSize = '9px'`, /type: text at 9 px is below the caption size/],
  ['size not in the scale', `el.style.fontSize = '16px'`, /type: font size 16 px is not in the type scale/],
  ['contrast under 4.5:1', `el.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-rule-dark')`, /contrast: .* under WCAG AA 4\.5:1/],
  ['overflow', `el.textContent = el.textContent.repeat(40)`, /overflow/],
];

for (const [name, mutate, expected] of cases) {
  test(`render check: ${name}`, async ({ page }) => {
    await page.goto(GALLERY);
    await page.waitForFunction(() => (window as any).__ready === true);
    await page.evaluate(`(() => { const el = document.querySelector('.spread[data-file="gallery: lead2col"] .lead'); ${mutate}; })()`);
    const issues = await renderChecks(page);
    expect(issues.map((i) => i.message).join('\n')).toMatch(expected);
  });
}

test('render checks pass on the untouched gallery', async ({ page }) => {
  await page.goto(GALLERY);
  await page.waitForFunction(() => (window as any).__ready === true);
  expect(await renderChecks(page)).toEqual([]);
});
