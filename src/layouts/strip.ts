// Strip of three: three square photos in a row on the column grid, with short captions.
// Left page: title and lead, photos 1 and 2. Right page: text in two columns,
// photo 3, and the text continues beside it.
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
  id: 'strip',
  name: 'Strip of three',
  description: 'Three photos in a row with short captions. For cases or examples.',
  css: `
.layout-strip .strip-row { flex: none; height: calc(var(--col-w) + var(--u) * 2 + var(--lh-caption) * 3); display: flex; gap: var(--gutter); }
.layout-strip .strip-row > * { width: var(--col-w); flex: none; }
.layout-strip .strip-photo { width: var(--col-w); height: var(--col-w); }
.layout-strip .image__caption { height: calc(var(--lh-caption) * 3); overflow: hidden; }
.layout-strip .side { display: flex; flex-direction: column; gap: var(--gap); min-height: 0; }
.layout-strip .side .flow-box { flex: 1 1 0; }
.layout-strip .intro .page__notes { margin-top: auto; }
`,
  schema: S.base({ title: S.str, lead: S.str, body: S.body, photos: { type: 'array', minItems: 3, maxItems: 3, items: { ...S.image, required: ['src', 'caption', 'credit'] } } }, ['title', 'lead', 'body', 'photos']),
  ratios: { 'photos[]': '1:1' },
  measure: [
    { kind: 'text', path: 'title' },
    { kind: 'text', path: 'lead' },
    { kind: 'text', path: 'photos[].caption' },
    { kind: 'text', path: 'body[].kicker' },
    { kind: 'text', path: 'body[].heading' },
    { kind: 'flow', path: 'body' },
    { kind: 'items', path: 'body' },
  ],
  furniture: { tab: true, strip: [true, true], folio: ['ink', 'ink'] },
  sample: {
    layout: 'strip',
    section: '2 Key findings',
    title: SAMPLE.title,
    lead: SAMPLE.lead,
    ...SAMPLE.leadSource,
    body: SAMPLE.body,
    photos: [1, 2, 3].map((n) => ({ src: 'images/placeholder-1x1.png', caption: `Placeholder for case photo ${['one', 'two', 'three'][n - 1]}.`, credit: SAMPLE.placeholderCredit })),
  },
  render(c, ctx) {
    const fig = (p: any, i: number) => `<figure class="image">${Image.frame({ ...p, src: ctx.asset(p.src) }, 'strip-photo', `photos[${i}]`)}${Image.caption(p, `photos[${i}]`)}</figure>`;
    const left = `<div class="page__content">
  <div class="intro region grow">${PageTitle.render(ctx.number, richText(c.title, ctx, S.adjacent(c, 'title')))}${Lead.render(richText(c.lead, ctx, S.adjacent(c, 'lead')))}${Source.slot()}</div>
  <div class="strip-row">${fig(c.photos[0], 0)}${fig(c.photos[1], 1)}</div>
</div>`;
    const right = `<div class="page__content">
  ${BodyColumns.columns('body', 1)}
  <div class="strip-row">${fig(c.photos[2], 2)}<div class="side">${BodyColumns.box('body', 3)}${Source.slot()}</div></div>
</div>`;
    return { left, right, templates: BodyColumns.source('body', c.body, ctx.label, ctx) };
  },
};
