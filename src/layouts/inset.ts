// Inset in column: a smaller photo inside the text column; text continues beside it.
import * as PageTitle from '../components/PageTitle.js';
import * as Lead from '../components/Lead.js';
import * as BodyColumns from '../components/BodyColumns.js';
import * as Image from '../components/Image.js';
import * as Source from '../components/Source.js';
import { richText } from '../render/text.js';
import * as S from './schema-parts.js';
import type { Layout } from './types.js';
import { SAMPLE } from './sample.js';

export const layout: Layout = {
  id: 'inset',
  name: 'Inset in column',
  description: 'A smaller photo inside the text column; text continues beside it.',
  css: `
.layout-inset .inset-row { flex: 1 1 0; min-height: 0; display: flex; gap: var(--gutter); }
.layout-inset .inset-col { width: var(--col-w); flex: none; display: flex; flex-direction: column; gap: var(--gap); min-height: 0; }
.layout-inset .inset-col .flow-box { flex: 1 1 0; }
.layout-inset .inset-photo { width: var(--col-w); height: calc(var(--u) * 53); }
.layout-inset .image__caption { max-height: calc(var(--lh-caption) * 3); overflow: hidden; }
`,
  schema: S.base({ title: S.str, lead: S.str, body: S.body, image: { ...S.image, required: ['src', 'caption', 'credit'] } }, ['title', 'lead', 'body', 'image']),
  ratios: { image: '4:3' },
  measure: [
    { kind: 'text', path: 'title' },
    { kind: 'text', path: 'lead' },
    { kind: 'text', path: 'image.caption' },
    { kind: 'text', path: 'body[].kicker' },
    { kind: 'text', path: 'body[].heading' },
    { kind: 'flow', path: 'body' },
    { kind: 'items', path: 'body' },
  ],
  furniture: { tab: true, strip: [true, true], folio: ['ink', 'ink'] },
  sample: {
    layout: 'inset',
    section: '2 Key findings',
    title: SAMPLE.title,
    lead: SAMPLE.lead,
    ...SAMPLE.leadSource,
    body: SAMPLE.body,
    image: { src: 'images/placeholder-4x3.png', caption: 'Placeholder for an inset photo.', credit: SAMPLE.placeholderCredit },
  },
  render(c, ctx) {
    const left = `<div class="page__content">
  ${PageTitle.render(ctx.number, richText(c.title, ctx, S.adjacent(c, 'title')))}
  ${Lead.render(richText(c.lead, ctx, S.adjacent(c, 'lead')))}
  ${BodyColumns.columns('body', 1)}
  ${Source.slot()}
</div>`;
    const right = `<div class="page__content">
  <div class="inset-row" data-field="body">
    <div class="inset-col"><figure class="image">${Image.frame({ ...c.image, src: ctx.asset(c.image.src) }, 'inset-photo', 'image')}${Image.caption(c.image, 'image')}</figure>${BodyColumns.box('body', 3)}</div>
    <div class="inset-col">${BodyColumns.box('body', 4)}</div>
  </div>
  ${Source.slot()}
</div>`;
    return { left, right, templates: BodyColumns.source('body', c.body, ctx.label, ctx) };
  },
};
