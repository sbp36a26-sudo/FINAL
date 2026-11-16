// Photo with caption and credit. The frame size comes from the layout; the image covers it.
import { esc } from '../render/text.js';

export const css = `
.image { margin: 0; display: flex; flex-direction: column; gap: calc(var(--u) * 2); }
.image__frame { position: relative; overflow: hidden; background: var(--color-rule); }
.image__frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.image__caption { margin: 0; font-size: var(--fs-caption); line-height: var(--lh-caption); color: var(--color-muted); }
.image__credit { color: var(--color-muted); }
.on-fill .image__caption, .on-fill .image__credit { color: var(--color-white); }
.bleed { position: absolute; inset: 0; }
`;

export interface ImageData { src: string; caption?: string; credit: string; alt?: string }

export const frame = (img: ImageData, cls = '', field = 'image') =>
  `<div class="image__frame ${cls}" data-field="${field}"><img src="${esc(img.src)}" alt="${esc(img.alt ?? img.caption ?? '')}"></div>`;

export const caption = (img: ImageData, field = 'image', prefix = '') =>
  `<p class="image__caption" data-field="${field}.caption">${prefix ? esc(prefix) + ' ' : ''}${img.caption ? esc(img.caption) + ' ' : ''}<span class="image__credit">${esc(img.credit)}</span></p>`;

/** Frame + caption below, for in-column use. */
export const render = (img: ImageData, cls = '', field = 'image') =>
  `<figure class="image">${frame(img, cls, field)}${caption(img, field)}</figure>`;
