// Colour panel + photo: left page solid section colour with a big number, the divider title
// (capitals allowed) and the chapter contents with real page numbers; right page the photo.
import type { Section } from '../brand.js';
import { esc } from '../render/text.js';
import * as Image from './Image.js';

export const css = `
.divider-panel { position: absolute; inset: 0; background: var(--sec-fill); color: var(--color-white); }
.divider-panel .page__content { gap: var(--gap); }
.divider__num { font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-display); line-height: var(--lh-display); }
.divider__title { margin: 0; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-h1); line-height: var(--lh-h1); text-transform: uppercase; letter-spacing: var(--tracking-kicker); }
.divider__contents { flex: 1 1 0; min-height: 0; overflow: hidden; margin: 0; padding: 0; list-style: none; border-top: var(--u) solid var(--color-white); }
.divider__contents li { display: flex; gap: calc(var(--u) * 4); padding: calc(var(--u) * 3) 0 calc(var(--u) * 3 - var(--hairline)); border-bottom: var(--hairline) solid var(--color-white); font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-h2); line-height: var(--lh-h2); }
.divider__contents a { color: inherit; text-decoration: none; display: contents; }
.divider__entry-num { flex: none; width: calc(var(--u) * 12); }
.divider__entry-title { flex: 1; }
.divider__entry-page { flex: none; }
`;

export interface Entry { number: string; title: string; page: number; anchor: string }

export function render(s: Section, entries: Entry[], img: Image.ImageData): { left: string; right: string } {
  const list = entries.map((e) => `<li><a href="#${e.anchor}"><span class="divider__entry-num">${esc(e.number)}</span><span class="divider__entry-title">${esc(e.title)}</span><span class="divider__entry-page">${e.page}</span></a></li>`).join('');
  return {
    left: `<div class="divider-panel on-fill"><div class="page__content">
  <div class="divider__num">${s.number}</div>
  <h1 class="divider__title" data-field="section">${esc(s.name)}</h1>
  <ol class="divider__contents" data-field="contents">${list}</ol>
  ${Image.caption(img, 'image', 'Opposite:')}
</div></div>`,
    right: Image.frame(img, 'bleed', 'image'),
  };
}
