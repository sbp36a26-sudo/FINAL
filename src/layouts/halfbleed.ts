// Half-spread photo: one page is a full-bleed photo, the other carries the text.
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
  id: 'halfbleed',
  name: 'Half-spread photo',
  description: 'One page is a full-bleed photo, the other carries the text.',
  css: `.layout-halfbleed .image__caption { flex: none; max-height: calc(var(--lh-caption) * 2); overflow: hidden; }`,
  schema: S.base({ title: S.str, lead: S.str, body: S.body, image: S.image, photo_page: { enum: ['left', 'right'] } }, ['title', 'lead', 'body', 'image']),
  ratios: { image: '1:1.414' },
  measure: [
    { kind: 'text', path: 'title' },
    { kind: 'text', path: 'lead' },
    { kind: 'text', path: 'image.caption' },
    { kind: 'text', path: 'body[].kicker' },
    { kind: 'text', path: 'body[].heading' },
    { kind: 'flow', path: 'body' },
    { kind: 'items', path: 'body' },
  ],
  furniture: (c) => ({ tab: true, strip: [true, true], folio: c.photo_page === 'left' ? [false, 'ink'] : ['ink', false] }),
  sample: {
    layout: 'halfbleed',
    section: '2 Key findings',
    title: SAMPLE.title,
    lead: SAMPLE.lead,
    ...SAMPLE.leadSource,
    body: SAMPLE.body,
    image: { src: 'images/placeholder-a4.png', caption: 'Placeholder for a hotel photo.', credit: SAMPLE.placeholderCredit },
  },
  render(c, ctx) {
    const photoLeft = c.photo_page === 'left';
    const text = `<div class="page__content">
  ${PageTitle.render(ctx.number, richText(c.title, ctx, S.adjacent(c, 'title')))}
  ${Lead.render(richText(c.lead, ctx, S.adjacent(c, 'lead')))}
  ${BodyColumns.columns('body', 1)}
  ${Image.caption(c.image, 'image', 'Opposite:')}
  ${Source.slot()}
</div>`;
    const photo = Image.frame({ ...c.image, src: ctx.asset(c.image.src) }, 'bleed', 'image');
    return { left: photoLeft ? photo : text, right: photoLeft ? text : photo, templates: BodyColumns.source('body', c.body, ctx.label, ctx) };
  },
};
