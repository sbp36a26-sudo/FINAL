// Tinted tile: 10% section colour, 16 px padding, 6 px radius, number in section colour.
// Source and base sit small in the lower part of the tile (notes.source).
import { formatValue } from '../numbers.js';
import { esc, sourceLine } from '../render/text.js';

export const css = `
.key-figure { flex: none; display: flex; flex-direction: column; gap: calc(var(--u) * 2); padding: var(--tile-pad); border-radius: var(--radius); background: var(--sec-tint); }
.key-figure__main { display: flex; align-items: center; gap: calc(var(--u) * 4); }
.key-figure__value { flex: none; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-key-figure); line-height: var(--lh-key-figure); color: var(--sec-text-on-tint); }
.key-figure__label { flex: 1; min-width: 0; max-height: calc(var(--lh-lead) * 2); overflow: hidden; font-size: var(--fs-lead); line-height: var(--lh-lead); color: var(--color-ink); }
.key-figure__source { margin: 0; font-size: var(--fs-caption); line-height: var(--lh-caption); color: var(--sec-secondary-on-tint); }
.key-figure--stacked .key-figure__main { flex-direction: column; align-items: flex-start; gap: 0; }
.key-figure--stacked .key-figure__label { font-size: var(--fs-body); line-height: var(--lh-body); max-height: calc(var(--lh-body) * 2); }
`;

export interface Figure { value: number; unit?: string; label: string; source: string; base: string }

export function render(f: Figure, field: string, stacked = false): string {
  return `<div class="key-figure${stacked ? ' key-figure--stacked' : ''}" data-field="${field}">
  <div class="key-figure__main"><span class="key-figure__value">${esc(formatValue(f.value, f.unit))}</span><span class="key-figure__label">${esc(f.label)}</span></div>
  <p class="key-figure__source">${esc(sourceLine(f))}</p>
</div>`;
}
