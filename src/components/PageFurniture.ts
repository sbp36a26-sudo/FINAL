// Top-left tab (section number and name, white on section colour, caption size, capitals)
// plus a vertical section strip on each outer edge for navigation (notes.furn), and the page number.
import { sections, type Section } from '../brand.js';
import { esc } from '../render/text.js';

export const css = `
.tab { z-index: 2; position: absolute; top: 0; left: var(--margin-outer); padding: calc(var(--u) * 4) calc(var(--u) * 3) calc(var(--u) * 2); background: var(--sec-fill); color: var(--color-white); font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-caption); line-height: var(--lh-caption); letter-spacing: var(--tracking-kicker); text-transform: uppercase; }
.strip { z-index: 2; position: absolute; top: var(--margin-top); height: var(--content-h); width: calc(var(--u) * 6); display: flex; flex-direction: column; gap: calc(var(--u) * 3); }
.page--left .strip { left: 0; align-items: flex-start; }
.page--right .strip { right: 0; align-items: flex-end; }
.strip__seg { flex: 1 1 0; width: calc(var(--u) * 2); display: flex; align-items: center; justify-content: center; text-decoration: none; }
.strip__seg--current { width: calc(var(--u) * 6); color: var(--color-white); font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-caption); line-height: var(--lh-caption); }
.folio { z-index: 2; position: absolute; top: calc(var(--margin-top) + var(--content-h) + var(--u) * 8); font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-caption); line-height: var(--lh-caption); color: var(--color-muted); }
.page--left .folio { left: var(--margin-outer); }
.page--right .folio { right: var(--margin-outer); }
.folio--on-fill { color: var(--color-white); }
${sections.map((s) => `.strip__seg--${s.number} { background: var(--color-${s.cls}); }\n.strip__seg--${s.number}.strip__seg--current { background: var(--color-${s.cls}-fill); }`).join('\n')}
`;

export const tab = (s: Section) => `<div class="tab">${s.number}&nbsp;&nbsp;${esc(s.name)}</div>`;

/** `current` section number (0 for none). Segments link to each section's divider or first spread. */
export const strip = (current: number) =>
  `<nav class="strip" aria-label="Sections">${sections.map((s) => `<a class="strip__seg strip__seg--${s.number}${s.number === current ? ' strip__seg--current' : ''}" href="#section-${s.number}" title="${esc(s.label)}">${s.number === current ? s.number : ''}</a>`).join('')}</nav>`;

export const folio = (n: number, onFill = false) => `<div class="folio${onFill ? ' folio--on-fill' : ''}">${n}</div>`;
