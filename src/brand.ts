// Single source of truth: reads brand/brand.json (verbatim guidelines) and
// brand/decisions.json (team rulings on conflicts) and derives every value
// the rest of the code may use. No other module defines a colour or a size.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brand = JSON.parse(readFileSync(path.join(ROOT, 'brand/brand.json'), 'utf8'));
const decisions = JSON.parse(readFileSync(path.join(ROOT, 'brand/decisions.json'), 'utf8'));
export { brand, decisions };

// ---------- colour maths ----------
const hexToRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgbToHex = (c: number[]) =>
  '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string): number {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
/** Mix `a` over `b` at weight t (0..1). */
export const mix = (a: string, b: string, t: number) => {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v * t + B[i] * (1 - t)));
};
/** Darken in 10% steps (each step multiplies RGB by 0.9) until `against` reaches 4.5:1. */
export function darkenUntil(hex: string, against: string, min = 4.5): { hex: string; steps: number } {
  const step = 1 - decisions.color.darken_step;
  let steps = 0;
  let cur = hex.toUpperCase();
  while (contrast(cur, against) < min) {
    steps++;
    cur = rgbToHex(hexToRgb(hex).map((v) => v * step ** steps));
  }
  return { hex: cur, steps };
}

// ---------- palette ----------
const C = brand.color;
export const WHITE: string = decisions.color.white;
export const palette = {
  ink: C.ink as string,
  paper: C.paper as string,
  muted: C.muted as string,
  rule: C.rule as string,
  ruleDark: rgbToHex(hexToRgb(C.rule).map((v) => v * (1 - decisions.color.darken_step))),
  primary: C.primary as string,
  white: WHITE,
};

export interface Section {
  number: number;
  name: string;
  label: string; // "2 Key findings"
  cls: string; // "sec-2"
  base: string; // original colour (graphics: bars, rules, strip)
  fill: string; // panel/tab colour behind white text
  text: string; // section colour as text on paper
  tint: string; // 10% tile fill
  textOnTint: string; // section colour as text on the tile
  secondaryOnTint: string; // muted, or ink if muted fails on the tile
  steps: { fill: number; text: number; textOnTint: number };
}

export const sections: Section[] = (brand.sections as string[]).map((label) => {
  const m = /^(\d+)\s+(.+)$/.exec(label)!;
  const number = Number(m[1]);
  const name = m[2];
  const base = (C.section[name] as string).toUpperCase();
  const fill = darkenUntil(base, WHITE);
  const text = darkenUntil(base, C.paper);
  const tint = mix(base, C.paper, 0.1);
  const textOnTint = darkenUntil(base, tint);
  const secondaryOnTint = contrast(C.muted, tint) >= 4.5 ? C.muted : C.ink;
  return {
    number, name, label, cls: `sec-${number}`, base, fill: fill.hex, text: text.hex, tint,
    textOnTint: textOnTint.hex, secondaryOnTint,
    steps: { fill: fill.steps, text: text.steps, textOnTint: textOnTint.steps },
  };
});

export function sectionByLabel(label: string): Section | undefined {
  return sections.find((s) => s.label === label);
}

/** Every colour that may appear in rendered output. */
export function allowedColours(): string[] {
  const set = new Set<string>(Object.values(palette).map((c) => c.toUpperCase()));
  for (const s of sections) [s.base, s.fill, s.text, s.tint, s.textOnTint].forEach((c) => set.add(c.toUpperCase()));
  return [...set];
}

// ---------- type and space ----------
export const fontSize: Record<string, number> = brand.typography.scale_px;
export const lineHeight: Record<string, number> = decisions.typography.line_height_px;
export const space = {
  u: brand.spacing.baseline_px as number,
  gutter: brand.spacing.column_gutter as number,
  gap: decisions.spacing.block_gap as number,
  marginInner: decisions.spacing.margin_inner as number,
  marginOuter: decisions.spacing.margin_outer as number,
  marginTop: decisions.spacing.margin_top as number,
  contentHeight: decisions.spacing.content_height as number,
  hairline: decisions.spacing.hairline as number,
  spreadW: brand.format.spread_px[0] as number,
  spreadH: brand.format.spread_px[1] as number,
  pageW: brand.format.page_px[0] as number,
  pageH: brand.format.page_px[1] as number,
};
export const contentWidth = space.pageW - space.marginInner - space.marginOuter; // 600
export const columnWidth = (contentWidth - space.gutter) / brand.spacing.columns_per_page; // 284

// Key-figure tile spec ("16 px padding, 6 px radius") parsed from brand.json so the number lives in one place.
const tileSpec: string = brand.components.key_figure.spec;
export const tile = {
  padding: Number(/(\d+)\s*px padding/.exec(tileSpec)![1]),
  radius: Number(/(\d+)\s*px radius/.exec(tileSpec)![1]),
  tint: 0.1,
};
export const kickerTracking = /tracked\s+([\d.]+em)/.exec(brand.components.subheading.spec)![1];
