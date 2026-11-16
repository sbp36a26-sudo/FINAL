import { richText, refHtml, esc, type TextCtx, type SourceRef } from '../render/text.js';

export const css = `
.table { width: 100%; border-collapse: collapse; margin-top: calc(var(--u) * 2); }
.table th { padding: 0 0 calc(var(--u) - var(--hairline)) 0; text-align: left; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-caption); line-height: var(--lh-caption); letter-spacing: var(--tracking-kicker); text-transform: uppercase; color: var(--color-muted); border-bottom: var(--hairline) solid var(--color-ink); }
.table td { padding: var(--u) 0 calc(var(--u) - var(--hairline)); font-size: var(--fs-body); line-height: var(--lh-body); color: var(--color-ink); border-bottom: var(--hairline) solid var(--color-rule); vertical-align: top; }
.table .num { text-align: right; font-variant-numeric: tabular-nums; }
`;

export interface TableData { head: string[]; rows: (string | number)[][] }

const isNum = (v: unknown) => typeof v === 'number' || /^[€~]?\s?\d[\d,.]*\s?(%|x|€)?$/.test(String(v).trim());

export function render(t: TableData, ctx: TextCtx, own: Partial<SourceRef>, field = 'table'): string {
  const note = own.source && own.base ? ctx.notes.add(own as SourceRef) : 0;
  const head = t.head.map((h, i) => `<th${i > 0 && t.rows.every((r) => isNum(r[i])) ? ' class="num"' : ''}>${esc(h)}${note && i === t.head.length - 1 ? refHtml(note) : ''}</th>`).join('');
  const rows = t.rows.map((r) => `<tr>${r.map((c) => `<td${isNum(c) ? ' class="num"' : ''}>${richText(String(c), { ...ctx, numberSources: [] })}</td>`).join('')}</tr>`).join('');
  return `<table class="table" data-field="${field}" data-nosplit><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}
