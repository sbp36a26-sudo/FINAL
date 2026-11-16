export const css = `
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--color-paper); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.spread { position: relative; width: var(--spread-w); height: var(--spread-h); overflow: hidden; background: var(--color-paper); color: var(--color-ink); font-family: var(--font-body); font-weight: var(--weight-body); font-size: var(--fs-body); line-height: var(--lh-body); break-after: page; font-kerning: normal; text-rendering: optimizeLegibility; }
.page { position: absolute; top: 0; width: var(--page-w); height: var(--page-h); }
.page--left { left: 0; }
.page--right { left: var(--page-w); }
.page__content { position: absolute; top: var(--margin-top); width: var(--content-w); height: var(--content-h); display: flex; flex-direction: column; gap: var(--gap); }
.page--left .page__content { left: var(--margin-outer); }
.page--right .page__content { left: var(--margin-inner); }
.region { flex: none; display: flex; flex-direction: column; gap: var(--gap); min-height: 0; overflow: hidden; }
.grow { flex: 1 1 0; min-height: 0; }
.anchor { position: absolute; top: 0; left: 0; }
`;
