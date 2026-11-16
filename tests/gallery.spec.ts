// Visual regression: every spread in out/gallery.html against the committed baseline.
// Run "npm run test:visual"; after an intended design change, "npm run test:visual:update".
import { test, expect } from '@playwright/test';
import path from 'node:path';

const GALLERY = 'file://' + path.resolve('out/gallery.html');
const IDS = ['components', 'contents', 'divider', 'lead2col', 'cards', 'zquote', 'halfbleed', 'strip', 'quote', 'inset'];

for (const id of IDS) {
  test(`gallery: ${id}`, async ({ page }) => {
    await page.goto(GALLERY);
    await page.waitForFunction(() => (window as any).__ready === true);
    await expect(page.locator(`.spread[data-file="gallery: ${id}"]`)).toHaveScreenshot(`${id}.png`);
  });
}
