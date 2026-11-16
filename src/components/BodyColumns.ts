// Body text set in 284 px columns. Text is written once into a <template> and the runtime
// flows it through the column boxes in reading order (data-order), across pages if needed.
import { paragraphs, richText, type TextCtx } from '../render/text.js';
import * as Subheading from './Subheading.js';
import * as Table from './Table.js';

export const css = `
.columns { flex: 1 1 0; min-height: 0; display: flex; gap: var(--gutter); }
.flow-box { flex: none; width: var(--col-w); min-height: 0; overflow: hidden; }
.columns > .flow-box { height: 100%; }
.flow-box > p { margin: 0; font-size: var(--fs-body); line-height: var(--lh-body); color: var(--color-ink); hyphens: manual; }
.flow-box > p + p { margin-top: calc(var(--u) * 3); }
.flow-box > :first-child { margin-top: 0; }
`;

export interface BodyItem { kicker?: string; heading?: string; text?: string; table?: Table.TableData; source?: string; base?: string }

/** Two column boxes for flow `name`, numbered from `order`. */
export function columns(name: string, order: number, field = 'body'): string {
  return `<div class="columns" data-field="${field}"><div class="flow-box" data-flow="${name}" data-order="${order}"></div><div class="flow-box" data-flow="${name}" data-order="${order + 1}"></div></div>`;
}
export const box = (name: string, order: number, field = 'body') =>
  `<div class="flow-box" data-flow="${name}" data-order="${order}" data-field="${field}"></div>`;

/** The flow source: subheadings, paragraphs and tables. `label()` yields "2.1.1", "2.1.2" ... */
export function source(name: string, items: BodyItem[], label: () => string, ctx: TextCtx, field = 'body'): string {
  let html = '';
  items.forEach((it, i) => {
    const own = { source: it.source, base: it.base };
    if (it.heading || it.kicker) html += Subheading.render(label(), it.kicker, it.heading ? richText(it.heading, ctx, own) : '', `${field}[${i}].heading`);
    for (const p of paragraphs(it.text ?? '')) html += `<p data-field="${field}[${i}].text">${richText(p, ctx, own)}</p>`;
    if (it.table) html += Table.render(it.table, ctx, own, `${field}[${i}].table`);
  });
  return `<template data-flow-source="${name}">${html}</template>`;
}
