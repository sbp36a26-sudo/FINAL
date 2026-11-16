// Section divider (split): colour panel with big number and chapter contents; photo opposite.
import * as SectionDivider from '../components/SectionDivider.js';
import * as Image from '../components/Image.js';
import * as S from './schema-parts.js';
import type { Layout } from './types.js';
import { SAMPLE } from './sample.js';

export const layout: Layout = {
  id: 'divider',
  name: 'Section divider',
  description: 'Left page a solid section-colour panel with a big number and the chapter contents; right page the photo.',
  css: `.layout-divider .divider-panel .image__caption { flex: none; max-height: calc(var(--lh-caption) * 2); overflow: hidden; }`,
  schema: S.base({ image: S.image }, ['image']),
  ratios: { image: '1:1.414' },
  measure: [{ kind: 'text', path: 'image.caption' }],
  furniture: { tab: false, strip: [false, true], folio: ['fill', false] },
  sample: {
    layout: 'divider',
    section: '2 Key findings',
    image: { src: 'images/placeholder-a4.png', caption: 'Placeholder for a section photo.', credit: SAMPLE.placeholderCredit },
  },
  render(c, ctx) {
    const entries = ctx.toc?.find((t) => t.section.number === ctx.section.number)?.entries ?? [];
    const r = SectionDivider.render(ctx.section, entries, c.image);
    return { left: r.left, right: Image.frame({ ...c.image, src: ctx.asset(c.image.src) }, 'bleed', 'image') };
  },
};
