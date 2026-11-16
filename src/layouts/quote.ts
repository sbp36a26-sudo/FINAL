// Photo + quote band: a full-width photo with a coloured band holding a pull quote.
import * as PullQuote from '../components/PullQuote.js';
import * as Image from '../components/Image.js';
import { richText } from '../render/text.js';
import * as S from './schema-parts.js';
import type { Layout } from './types.js';
import { SAMPLE } from './sample.js';

export const layout: Layout = {
  id: 'quote',
  name: 'Photo + quote band',
  description: 'A full-width photo with a coloured band holding a pull quote.',
  css: `
.layout-quote .q-photo { position: absolute; top: 0; left: 0; width: var(--spread-w); height: calc(var(--u) * 198); }
.layout-quote .q-band { position: absolute; top: calc(var(--u) * 198); left: 0; right: 0; bottom: 0; background: var(--sec-fill); }
.layout-quote .q-text { position: absolute; top: calc(var(--u) * 206); left: var(--margin-outer); width: calc(var(--spread-w) - var(--margin-outer) * 2); height: calc(var(--u) * 50); overflow: hidden; }
.layout-quote .q-caption { position: absolute; top: calc(var(--margin-top) + var(--content-h) + var(--u) * 8); left: calc(var(--page-w) + var(--margin-inner)); width: calc(var(--content-w) - var(--u) * 16); max-height: var(--lh-caption); overflow: hidden; }
`,
  schema: S.base({
    quote: { ...S.str, pattern: '^[^0-9]*$', 'x-patternMessage': 'numbers are not allowed in a photo quote band (there is no room for a source note); use the zquote layout.' },
    attribution: S.str, image: S.image,
  }, ['quote', 'image']),
  ratios: { image: '2:1' },
  measure: [
    { kind: 'text', path: 'quote' },
    { kind: 'text', path: 'attribution' },
    { kind: 'text', path: 'image.caption' },
  ],
  furniture: { tab: true, strip: [true, true], folio: ['fill', 'fill'] },
  sample: {
    layout: 'quote',
    section: '2 Key findings',
    quote: SAMPLE.quote,
    image: { src: 'images/placeholder-2x1.png', caption: 'Placeholder for a hotel photo.', credit: SAMPLE.placeholderCredit },
  },
  render(c, ctx) {
    const spread = `${Image.frame({ ...c.image, src: ctx.asset(c.image.src) }, 'q-photo', 'image')}
<div class="q-band"></div>
<div class="q-text on-fill">${PullQuote.render(richText(c.quote, ctx, S.adjacent(c, 'quote')), c.attribution, 'display')}</div>
<div class="q-caption on-fill">${Image.caption(c.image, 'image', 'Photo:')}</div>`;
    return { left: '', right: '', spread };
  },
};
