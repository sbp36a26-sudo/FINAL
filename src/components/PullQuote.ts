import { esc } from '../render/text.js';

export const css = `
.pull-quote { margin: 0; display: flex; flex-direction: column; gap: calc(var(--u) * 4); }
.pull-quote__rule { width: calc(var(--u) * 16); height: var(--u); background: var(--sec); }
.pull-quote__text { margin: 0; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-display); line-height: var(--lh-display); color: var(--color-ink); }
.pull-quote--h1 .pull-quote__text { font-size: var(--fs-h1); line-height: var(--lh-h1); }
.pull-quote__by { max-height: var(--lh-caption); overflow: hidden; margin-top: calc(var(--u) * -2); font-size: var(--fs-caption); line-height: var(--lh-caption); color: var(--color-muted); }
.on-fill .pull-quote__text, .on-fill .pull-quote__by { color: var(--color-white); }
.on-fill .pull-quote__rule { display: none; }
`;

/** British single quotes. `html` is already escaped rich text. */
export function render(html: string, attribution?: string, size: 'display' | 'h1' = 'display', field = 'quote'): string {
  return `<blockquote class="pull-quote pull-quote--${size}" data-field="${field}">
  <div class="pull-quote__rule"></div>
  <p class="pull-quote__text">‘${html}’</p>
  ${attribution ? `<div class="pull-quote__by">${esc(attribution)}</div>` : ''}
</blockquote>`;
}
