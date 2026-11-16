// Lead + two columns + figures. Left page: title, lead and two text columns.
// Right page: key figures and a chart.
import { contentWidth } from '../brand.js';
import * as PageTitle from '../components/PageTitle.js';
import * as Lead from '../components/Lead.js';
import * as BodyColumns from '../components/BodyColumns.js';
import * as KeyFigure from '../components/KeyFigure.js';
import * as Chart from '../components/Chart.js';
import * as Source from '../components/Source.js';
import { richText } from '../render/text.js';
import * as S from './schema-parts.js';
import type { Layout } from './types.js';
import { SAMPLE } from './sample.js';

export const layout: Layout = {
  id: 'lead2col',
  name: 'Lead + two columns + figures',
  description: 'Left page: title, lead and two text columns. Right page: key figures and a chart.',
  css: `
.layout-lead2col .figures { flex: none; display: flex; flex-direction: column; gap: calc(var(--u) * 4); }
`,
  schema: S.base({ title: S.str, lead: S.str, body: S.body, figures: { type: 'array', minItems: 1, items: S.figure }, chart: S.chart }, ['title', 'lead', 'body', 'figures', 'chart']),
  ratios: {},
  measure: [
    { kind: 'text', path: 'title' },
    { kind: 'text', path: 'lead' },
    { kind: 'text', path: 'body[].kicker' },
    { kind: 'text', path: 'body[].heading' },
    { kind: 'flow', path: 'body' },
    { kind: 'items', path: 'body' },
    { kind: 'items', path: 'figures' },
    { kind: 'text', path: 'figures[].label' },
    { kind: 'text', path: 'chart.title' },
    { kind: 'items', path: 'chart.rows' },
    { kind: 'text', path: 'chart.rows[].label' },
  ],
  furniture: { tab: true, strip: [true, true], folio: ['ink', 'ink'] },
  sample: {
    layout: 'lead2col',
    section: '2 Key findings',
    title: SAMPLE.title,
    lead: SAMPLE.lead,
    figures: SAMPLE.figures,
    body: SAMPLE.body,
    chart: SAMPLE.chart,
  },
  render(c, ctx) {
    const left = `<div class="page__content">
  ${PageTitle.render(ctx.number, richText(c.title, ctx, S.adjacent(c, 'title')))}
  ${Lead.render(richText(c.lead, ctx, S.adjacent(c, 'lead')))}
  ${BodyColumns.columns('body', 1)}
  ${Source.slot()}
</div>`;
    const figures = (c.figures as KeyFigure.Figure[]).map((f, i) => KeyFigure.render(f, `figures[${i}]`)).join('');
    const templates = BodyColumns.source('body', c.body, ctx.label, ctx);
    const right = `<div class="page__content">
  <div class="figures" data-field="figures">${figures}</div>
  <div class="region grow" data-field="chart">${Chart.render(c.chart, contentWidth, ctx.label(), ctx)}</div>
  ${Source.slot()}
</div>`;
    return { left, right, templates };
  },
};
