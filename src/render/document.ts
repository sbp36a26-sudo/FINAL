import { readFileSync, mkdirSync, copyFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, sections, type Section } from '../brand.js';
import { css as baseCss } from './base.js';
import { Notes, type NumberSource } from './text.js';
import * as Source from '../components/Source.js';
import * as PageFurniture from '../components/PageFurniture.js';
import type { Layout, LayoutCtx, TocSection } from '../layouts/types.js';

const COMPONENTS = ['PageTitle', 'Subheading', 'Lead', 'BodyColumns', 'KeyFigure', 'Source', 'Chart', 'PullQuote', 'Table', 'Card', 'Image', 'PageFurniture', 'SectionDivider'];

export async function componentCss(): Promise<string> {
  const parts = await Promise.all(COMPONENTS.map(async (n) => (await import(`../components/${n}.js`)).css as string));
  return parts.join('\n');
}

const runtime = () => readFileSync(path.join(ROOT, 'src/runtime/runtime.js'), 'utf8');

/** A full HTML document; `assets` is the relative URL of out/assets from the document. */
export async function documentHtml(body: string, layouts: Layout[], assets: string, title: string, extraCss = ''): Promise<string> {
  const css = [baseCss, await componentCss(), ...layouts.map((l) => l.css), extraCss].join('\n');
  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><title>${title}</title>
<link rel="stylesheet" href="${assets}/fonts/fonts.css">
<link rel="stylesheet" href="${assets}/tokens.css">
<style>${css}</style>
<script>${runtime()}</script>
</head><body>${body}</body></html>`;
}

/** Copies tokens, self-hosted fonts and content images into out/assets. */
export function prepareAssets(outDir: string) {
  const a = path.join(outDir, 'assets');
  mkdirSync(path.join(a, 'fonts/files'), { recursive: true });
  mkdirSync(path.join(a, 'images'), { recursive: true });
  copyFileSync(path.join(ROOT, 'brand/tokens.css'), path.join(a, 'tokens.css'));
  const faces: string[] = [];
  const font = (pkg: string, family: string, prefix: string, weights: number[]) => {
    for (const w of weights) for (const subset of ['latin', 'latin-ext']) {
      const f = `${prefix}-${subset}-${w}-normal`;
      const dir = path.join(ROOT, 'node_modules/@fontsource', pkg, 'files');
      copyFileSync(path.join(dir, `${f}.woff2`), path.join(a, 'fonts/files', `${f}.woff2`));
      const css = readFileSync(path.join(ROOT, 'node_modules/@fontsource', pkg, `${subset}-${w}.css`), 'utf8');
      const range = /unicode-range:[^;]+;/.exec(css)?.[0] ?? '';
      faces.push(`@font-face { font-family: '${family}'; font-style: normal; font-display: block; font-weight: ${w}; src: url(./files/${f}.woff2) format('woff2'); ${range} }`);
    }
  };
  font('archivo', 'Archivo', 'archivo', [700]);
  font('source-serif-4', 'Source Serif 4', 'source-serif-4', [400, 700]);
  writeFileSync(path.join(a, 'fonts/fonts.css'), `/* Self-hosted from @fontsource; no network needed. */\n${faces.join('\n')}\n`);
  const img = path.join(ROOT, 'content/images');
  if (existsSync(img)) for (const f of readdirSync(img)) copyFileSync(path.join(img, f), path.join(a, 'images', f));
}

/** Every value + unit stated in a figure or chart row, with its source. */
export function collectNumberSources(c: any): NumberSource[] {
  const out: NumberSource[] = [];
  const walk = (o: any) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) return o.forEach(walk);
    if (typeof o.value === 'number' && o.source && o.base) out.push({ value: o.value, unit: o.unit ?? '', ref: { source: o.source, base: o.base } });
    if (Array.isArray(o.rows) && o.source && o.base && o.rows.every((r: any) => typeof r?.value === 'number'))
      for (const r of o.rows) out.push({ value: r.value, unit: o.unit ?? '%', ref: { source: o.source, base: o.base } });
    Object.values(o).forEach(walk);
  };
  walk(c);
  return out;
}

export interface SpreadInput {
  layout: Layout;
  content: any;
  file: string;
  section: Section;
  number: string;
  pages: [number, number];
  anchor: string;
  sectionAnchor?: number; // adds id="section-N" for the strip links
  toc?: TocSection[];
  assets: string;
}

export const NO_SECTION: Section = { ...sections[0], number: 0, name: 'Contents', label: 'Contents', cls: 'sec-0' };

export function spreadHtml(s: SpreadInput): string {
  const notes = new Notes();
  let k = 0;
  const ctx: LayoutCtx = {
    section: s.section, number: s.number, label: () => `${s.number}.${++k}`, pages: s.pages, notes,
    numberSources: collectNumberSources(s.content), asset: (src) => `${s.assets}/${src.replace(/^(content\/)?/, '')}`, toc: s.toc,
  };
  const r = s.layout.render(s.content, ctx);
  const f = typeof s.layout.furniture === 'function' ? s.layout.furniture(s.content) : s.layout.furniture;
  const furn = (side: 0 | 1) =>
    (side === 0 && f.tab && s.section.number ? PageFurniture.tab(s.section) : '') +
    (f.strip[side] ? PageFurniture.strip(s.section.number) : '') +
    (f.folio[side] ? PageFurniture.folio(s.pages[side], f.folio[side] === 'fill') : '');
  return `<div class="spread ${s.section.cls} layout-${s.layout.id}" id="${s.anchor}" data-layout="${s.layout.id}" data-file="${s.file}">
${s.sectionAnchor ? `<a class="anchor" id="section-${s.sectionAnchor}"></a>` : ''}
<section class="page page--left">${r.left}${furn(0)}</section>
<section class="page page--right">${r.right}${furn(1)}</section>
${r.spread ?? ''}
${r.templates ?? ''}${Source.store(notes)}
</div>`;
}
