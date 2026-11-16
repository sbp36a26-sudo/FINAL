// Numbered chapter: accent rule, section number at display size beside a two-line title (notes.title).
import { esc } from '../render/text.js';

export const css = `
.page-title { flex: none; display: flex; flex-direction: column; gap: calc(var(--u) * 4); }
.page-title__rule { width: calc(var(--u) * 16); height: var(--u); background: var(--sec); }
.page-title__row { display: flex; gap: calc(var(--u) * 6); align-items: flex-start; }
.page-title__num { flex: none; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-display); line-height: var(--lh-display); color: var(--sec-text); }
.page-title__text { margin: 0; flex: 1; min-width: 0; height: calc(var(--lh-h1) * 2); overflow: hidden; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-h1); line-height: var(--lh-h1); color: var(--color-ink); }
.page-title__text--solo { height: auto; font-size: var(--fs-display); line-height: var(--lh-display); }
`;

/** `number` is e.g. "2.1"; pass null for an unnumbered title (contents spread). `html` is already escaped rich text. */
export function render(number: string | null, html: string): string {
  return `<header class="page-title" data-field="title">
  <div class="page-title__rule"></div>
  <div class="page-title__row">${number ? `<span class="page-title__num">${esc(number)}</span>` : ''}<h1 class="page-title__text${number ? '' : ' page-title__text--solo'}">${html}</h1></div>
</header>`;
}
