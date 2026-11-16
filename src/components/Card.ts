// One cell of the card grid: section rule, numbered capital label, h2, short text, optional key figure.
import { esc, richText, type TextCtx } from '../render/text.js';
import * as KeyFigure from './KeyFigure.js';

export const css = `
.card { display: flex; flex-direction: column; gap: calc(var(--u) * 2); min-height: 0; overflow: hidden; border-top: var(--u) solid var(--sec); padding-top: calc(var(--u) * 3); }
.card__label { flex: none; max-height: var(--lh-caption); overflow: hidden; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-caption); line-height: var(--lh-caption); letter-spacing: var(--tracking-kicker); text-transform: uppercase; color: var(--sec-text); }
.card__title { flex: none; margin: 0; max-height: calc(var(--lh-h2) * 2); overflow: hidden; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-h2); line-height: var(--lh-h2); color: var(--color-ink); }
.card__text { flex: 1 1 0; min-height: 0; overflow: hidden; margin: 0; font-size: var(--fs-body); line-height: var(--lh-body); color: var(--color-ink); }
.card .key-figure { margin-top: auto; }
`;

export interface CardData { kicker?: string; title: string; text: string; figure?: KeyFigure.Figure; source?: string; base?: string }

export function render(c: CardData, i: number, ctx: TextCtx): string {
  const label = [String(i + 1).padStart(2, '0'), c.kicker].filter(Boolean).map(esc).join(' ');
  return `<article class="card" data-field="cards[${i}]">
  <div class="card__label">${label}</div>
  <h2 class="card__title" data-field="cards[${i}].title">${richText(c.title, ctx, c)}</h2>
  <p class="card__text" data-field="cards[${i}].text">${richText(c.text, ctx, c)}</p>
  ${c.figure ? KeyFigure.render(c.figure, `cards[${i}].figure`, true) : ''}
</article>`;
}
