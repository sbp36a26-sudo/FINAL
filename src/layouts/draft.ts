// Draft topic spread: section furniture and the numbered title only, so the team can see the
// whole report structure and fill each topic later (in Report Studio or in Canva).
// No body: a draft never carries filler text.
import * as PageTitle from '../components/PageTitle.js';
import * as S from './schema-parts.js';
import { esc } from '../render/text.js';
import type { Layout } from './types.js';

export const layout: Layout = {
  id: 'draft',
  name: 'Draft topic spread',
  description: 'Numbered title and page furniture only; the topic is still to be written.',
  css: '',
  schema: S.base({ title: S.str }, ['title']),
  ratios: {},
  measure: [{ kind: 'text', path: 'title' }],
  furniture: { tab: true, strip: [true, true], folio: ['ink', 'ink'] },
  sample: { layout: 'draft', section: '2 Key findings', title: 'Chains, independents and affiliated hotels' },
  render(c, ctx) {
    return { left: `<div class="page__content">${PageTitle.render(ctx.number, esc(c.title))}</div>`, right: '' };
  },
};
