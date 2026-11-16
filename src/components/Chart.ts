// Labelled horizontal bars, generated as SVG from data. Direct value labels at the bar end,
// highlight bar in section colour, others rule-dark grey, no axis or grid.
// All geometry derives from brand tokens (grid unit and line heights).
import { space, lineHeight } from '../brand.js';
import { formatValue } from '../numbers.js';
import { esc, refHtml, type TextCtx } from '../render/text.js';
import * as Subheading from './Subheading.js';

export const css = `
.chart { flex: none; display: flex; flex-direction: column; gap: calc(var(--u) * 4); }
.chart__svg { display: block; overflow: visible; }
.chart__label { font-family: var(--font-body); font-size: var(--fs-body); fill: var(--color-ink); }
.chart__value { font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-body); fill: var(--color-ink); }
.chart__value--hl { fill: var(--sec-text); }
.chart__bar { fill: var(--color-rule-dark); }
.chart__bar--hl { fill: var(--sec); }
`;

export interface ChartData { title: string; unit?: string; rows: { label: string; value: number; highlight?: boolean }[]; source: string; base: string }

const U = space.u;
export const geometry = {
  labelLine: lineHeight.body, // label line above the bar
  labelGap: U,
  bar: U * 6,
  rowGap: U * 4,
  valueSpace: U * 16,
  valueGap: U * 2,
};
export const chartHeight = (n: number) => n * (geometry.labelLine + geometry.labelGap + geometry.bar) + Math.max(0, n - 1) * geometry.rowGap;

export function render(c: ChartData, width: number, number: string, ctx: TextCtx, field = 'chart'): string {
  const unit = c.unit ?? '%';
  const g = geometry;
  const max = Math.max(...c.rows.map((r) => r.value), 0) || 1;
  const hl = c.rows.findIndex((r) => r.highlight);
  const hlIndex = hl >= 0 ? hl : c.rows.findIndex((r) => r.value === max);
  const note = ctx.notes.add({ source: c.source, base: c.base });
  const barMax = width - g.valueSpace;
  let y = 0;
  let body = '';
  c.rows.forEach((r, i) => {
    const isHl = i === hlIndex;
    const w = Math.max(U, Math.round((r.value / max) * barMax / U) * U);
    // Text baseline sits a quarter line above the line box bottom, as in HTML.
    body += `<text class="chart__label" x="0" y="${y + g.labelLine - U * 2}" data-max-width="${width}" data-field="${field}.rows[${i}].label">${esc(r.label)}</text>`;
    const by = y + g.labelLine + g.labelGap;
    body += `<rect class="chart__bar${isHl ? ' chart__bar--hl' : ''}" x="0" y="${by}" width="${w}" height="${g.bar}"/>`;
    body += `<text class="chart__value${isHl ? ' chart__value--hl' : ''}" x="${w + g.valueGap}" y="${by + g.bar - U * 2}">${esc(formatValue(r.value, unit))}</text>`;
    y = by + g.bar + g.rowGap;
  });
  const h = chartHeight(c.rows.length);
  return `<figure class="chart" data-field="${field}" style="margin:0">
  ${Subheading.render(number, 'Chart', esc(c.title) + refHtml(note), `${field}.title`)}
  <svg class="chart__svg" width="${width}" height="${h}" viewBox="0 0 ${width} ${h}" role="img" aria-label="${esc(c.title)}">${body}</svg>
</figure>`;
}
