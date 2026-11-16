// Vertical bar + numbered capital label above an h2 in display font (notes.sub overrides the kicker spec).
import { esc } from '../render/text.js';

export const css = `
.subheading { flex: none; border-left: var(--u) solid var(--sec); padding-left: calc(var(--u) * 3); break-after: avoid; }
.subheading__label { max-height: var(--lh-caption); overflow: hidden; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-caption); line-height: var(--lh-caption); letter-spacing: var(--tracking-kicker); text-transform: uppercase; color: var(--sec-text); }
.subheading__heading { margin: 0; max-height: calc(var(--lh-h2) * 2); overflow: hidden; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-h2); line-height: var(--lh-h2); color: var(--color-ink); }
.flow-box > .subheading:not(:first-child) { margin-top: calc(var(--u) * 6); }
.flow-box > .subheading + * { margin-top: calc(var(--u) * 2); }
`;

/** `number` e.g. "2.1.1"; `kicker` optional word(s); `headingHtml` already escaped. */
export function render(number: string, kicker: string | undefined, headingHtml: string, field = ''): string {
  const label = [number, kicker].filter(Boolean).map(esc).join(' ');
  return `<div class="subheading" data-keep-with-next${field ? ` data-field="${field}"` : ''}><div class="subheading__label">${label}</div>${headingHtml ? `<h2 class="subheading__heading">${headingHtml}</h2>` : ''}</div>`;
}
