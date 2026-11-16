// Pull-quote spread: text with a large pull quote breaking across the spread.
// Reading order is a Z: title and lead top left, text top right, the quote across both pages,
// then text bottom left and bottom right.
import * as PageTitle from '../components/PageTitle.js';
import * as Lead from '../components/Lead.js';
import * as BodyColumns from '../components/BodyColumns.js';
import * as PullQuote from '../components/PullQuote.js';
import * as Source from '../components/Source.js';
import { richText } from '../render/text.js';
import * as S from './schema-parts.js';
import type { Layout } from './types.js';
import { SAMPLE } from './sample.js';

export const layout: Layout = {
  id: 'zquote',
  name: 'Pull-quote spread',
  description: 'Text with a large pull quote breaking across the spread.',
  css: `
.layout-zquote .z-top { flex: none; height: calc(var(--u) * 104); }
.layout-zquote .z-band { flex: none; height: calc(var(--u) * 56); }
.layout-zquote .z-quote { position: absolute; top: calc(var(--margin-top) + var(--u) * 104 + var(--gap)); left: var(--margin-outer); width: calc(var(--spread-w) - var(--margin-outer) * 2); height: calc(var(--u) * 56); overflow: hidden; }
`,
  schema: S.base({ title: S.str, lead: S.str, quote: S.str, attribution: S.str, body: S.body }, ['title', 'lead', 'quote', 'body']),
  ratios: {},
  measure: [
    { kind: 'text', path: 'title' },
    { kind: 'text', path: 'lead' },
    { kind: 'text', path: 'quote' },
    { kind: 'text', path: 'attribution' },
    { kind: 'text', path: 'body[].kicker' },
    { kind: 'text', path: 'body[].heading' },
    { kind: 'flow', path: 'body' },
    { kind: 'items', path: 'body' },
  ],
  furniture: { tab: true, strip: [true, true], folio: ['ink', 'ink'] },
  sample: {
    layout: 'zquote',
    section: '2 Key findings',
    title: SAMPLE.title,
    lead: SAMPLE.lead,
    ...SAMPLE.leadSource,
    quote: SAMPLE.quote,
    body: SAMPLE.body,
  },
  render(c, ctx) {
    const left = `<div class="page__content">
  <div class="z-top region">${PageTitle.render(ctx.number, richText(c.title, ctx, S.adjacent(c, 'title')))}${Lead.render(richText(c.lead, ctx, S.adjacent(c, 'lead')))}</div>
  <div class="z-band"></div>
  ${BodyColumns.columns('body', 3)}
  ${Source.slot()}
</div>`;
    const right = `<div class="page__content">
  <div class="z-top">${BodyColumns.columns('body', 1).replace('class="columns"', 'class="columns" style="height:100%"')}</div>
  <div class="z-band"></div>
  ${BodyColumns.columns('body', 5)}
  ${Source.slot()}
</div>`;
    const spread = `<div class="z-quote">${PullQuote.render(richText(c.quote, ctx, S.adjacent(c, 'quote')), c.attribution, 'display')}</div>`;
    return { left, right, spread, templates: BodyColumns.source('body', c.body, ctx.label, ctx) };
  },
};
