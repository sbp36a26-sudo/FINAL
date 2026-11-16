// Card grid: six cards for use cases, departments or countries.
// Left page: title and lead in the top half, two cards below. Right page: four cards (2 x 2).
import * as PageTitle from '../components/PageTitle.js';
import * as Lead from '../components/Lead.js';
import * as Card from '../components/Card.js';
import * as Source from '../components/Source.js';
import { richText } from '../render/text.js';
import * as S from './schema-parts.js';
import type { Layout } from './types.js';
import { SAMPLE } from './sample.js';

const { h2c, schegg } = SAMPLE.sources;
const card = {
  type: 'object', additionalProperties: false, required: ['title', 'text'],
  properties: { kicker: S.str, title: S.str, text: S.str, figure: S.figure, ...S.sourced },
};

export const layout: Layout = {
  id: 'cards',
  name: 'Card grid',
  description: 'Six cards in a grid: for use cases, departments or countries.',
  css: `
.layout-cards .cards-row { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: var(--col-w) var(--col-w); grid-auto-rows: minmax(0, 1fr); gap: var(--gutter); }
.layout-cards .page--right .cards-row { grid-template-rows: minmax(0, 1fr) minmax(0, 1fr); row-gap: var(--gap); }
.layout-cards .intro { flex: 1 1 0; }
`,
  schema: S.base({ title: S.str, lead: S.str, cards: { type: 'array', minItems: 6, maxItems: 6, items: card } }, ['title', 'lead', 'cards']),
  ratios: {},
  measure: [
    { kind: 'text', path: 'title' },
    { kind: 'text', path: 'lead' },
    { kind: 'text', path: 'cards[].kicker' },
    { kind: 'text', path: 'cards[].title' },
    { kind: 'text', path: 'cards[].figure.label' },
    { kind: 'text', path: 'cards[].text' },
  ],
  furniture: { tab: true, strip: [true, true], folio: ['ink', 'ink'] },
  sample: {
    layout: 'cards',
    section: '2 Key findings',
    title: SAMPLE.title,
    lead: SAMPLE.lead,
    ...SAMPLE.leadSource,
    cards: [
      { kicker: 'Adoption', title: 'Chains have adopted AI', text: 'Use is almost universal among hotel chains.', figure: { value: 91, unit: '%', label: 'of hotel chains use AI', ...h2c } },
      { kicker: 'Strategy', title: 'Few chains lead AI from the top', text: 'A senior-led, company-wide AI strategy is the exception.', figure: { value: 28, unit: '%', label: 'have a senior-led, company-wide strategy', ...h2c } },
      { kicker: 'Return', title: 'A measurable return is rare', text: 'Only a minority of chains can show a measurable return.', figure: { value: 13, unit: '%', label: 'report a measurable return', ...h2c } },
      { kicker: 'Knowledge', title: 'Know-how is the first barrier', text: 'Independent hotels name lack of knowledge most often.', figure: { value: 39, unit: '%', label: 'name lack of knowledge', ...schegg } },
      { kicker: 'Cost', title: 'Set-up cost holds hotels back', text: 'The cost of setting up AI is the second barrier.', figure: { value: 35, unit: '%', label: 'name set-up cost', ...schegg } },
      { kicker: 'Integration', title: 'Systems do not connect easily', text: 'Integration with existing systems is the third barrier.', figure: { value: 34, unit: '%', label: 'name integration', ...schegg } },
    ],
  },
  render(c, ctx) {
    const cards = (c.cards as Card.CardData[]).map((x, i) => Card.render(x, i, ctx));
    const left = `<div class="page__content notes-sync">
  <div class="intro region">${PageTitle.render(ctx.number, richText(c.title, ctx, S.adjacent(c, 'title')))}${Lead.render(richText(c.lead, ctx, S.adjacent(c, 'lead')))}</div>
  <div class="cards-row">${cards.slice(0, 2).join('')}</div>
  ${Source.slot()}
</div>`;
    const right = `<div class="page__content notes-sync">
  <div class="cards-row">${cards.slice(2).join('')}</div>
  ${Source.slot()}
</div>`;
    return { left, right };
  },
};
