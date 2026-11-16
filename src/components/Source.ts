// Numbered footnotes: superscript reference after the number (see render/text.ts),
// source and base in numbered notes at the page foot. The runtime moves each note
// to the foot of the page where its first reference lands.
import { esc, sourceLine, type Notes } from '../render/text.js';

export const css = `
.ref { font-family: var(--font-body); font-size: var(--fs-caption); line-height: 0; vertical-align: super; color: var(--color-muted); }
.page__notes { flex: none; }
.page__notes:empty { display: none; }
.footnotes { margin: 0; padding: calc(var(--u) * 2) 0 0; list-style: none; border-top: var(--hairline) solid var(--color-rule); }
.footnotes li { display: flex; gap: calc(var(--u) * 2); font-size: var(--fs-caption); line-height: var(--lh-caption); color: var(--color-muted); }
.footnotes__n { flex: none; }
.on-fill .ref, .on-fill .footnotes li { color: var(--color-white); }
.on-fill .footnotes { border-top-color: var(--color-white); }
`;

/** Hidden store of all notes on a spread; the runtime copies them to page feet. */
export function store(notes: Notes): string {
  const items = notes.list.map((r, i) => `<li data-note="${i + 1}"><span class="footnotes__n">${i + 1}</span><span>${esc(sourceLine(r))}</span></li>`).join('');
  return `<template data-notes>${items}</template>`;
}
/** Where a page's notes go. */
export const slot = () => `<div class="page__notes"></div>`;
