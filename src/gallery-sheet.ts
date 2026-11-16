// A spread that shows every component on its own, labelled, with the sample content.
import { sections, columnWidth } from './brand.js';
import { Notes, richText, type TextCtx } from './render/text.js';
import { collectNumberSources } from './render/document.js';
import * as PageTitle from './components/PageTitle.js';
import * as Subheading from './components/Subheading.js';
import * as Lead from './components/Lead.js';
import * as BodyColumns from './components/BodyColumns.js';
import * as KeyFigure from './components/KeyFigure.js';
import * as Source from './components/Source.js';
import * as Chart from './components/Chart.js';
import * as PullQuote from './components/PullQuote.js';
import * as Table from './components/Table.js';
import * as Card from './components/Card.js';
import * as Image from './components/Image.js';
import * as PageFurniture from './components/PageFurniture.js';
import { SAMPLE } from './layouts/sample.js';

export const css = `
.g-tag { flex: none; font-family: var(--font-display); font-weight: var(--weight-display); font-size: var(--fs-caption); line-height: var(--lh-caption); color: var(--color-muted); letter-spacing: var(--tracking-kicker); text-transform: uppercase; }
.g-item { flex: none; display: flex; flex-direction: column; gap: calc(var(--u) * 2); }
.g-pair { flex: none; display: flex; gap: var(--gutter); }
.g-pair > * { width: var(--col-w); flex: none; }
.g-sheet .flow-box { height: calc(var(--lh-body) * 3); }
.g-sheet .card { height: calc(var(--u) * 70); }
.g-sheet .g-photo { width: var(--col-w); height: calc(var(--u) * 53); }
`;

export function componentSheet(): string {
  const sec = sections[1];
  const notes = new Notes();
  const content = { figures: SAMPLE.figures, chart: SAMPLE.chart };
  const ctx: TextCtx = { notes, numberSources: collectNumberSources(content) };
  let k = 0;
  const label = () => `${sec.number}.0.${++k}`;
  const tag = (name: string) => `<div class="g-tag">${name}</div>`;
  const item = (name: string, html: string) => `<div class="g-item">${tag(name)}${html}</div>`;
  const left = `<div class="page__content g-sheet">
  ${item('PageTitle', PageTitle.render(`${sec.number}.0`, richText(SAMPLE.title, ctx)))}
  ${item('Lead', Lead.render(richText(SAMPLE.lead, ctx)))}
  <div class="g-pair">
    ${item('Subheading', Subheading.render(label(), 'Strategy', 'Strategy lags behind use'))}
    ${item('BodyColumns + Source (ref)', BodyColumns.box('g', 1, 'body'))}
  </div>
  ${item('Table', Table.render({ head: ['Hotel chains that', 'Share'], rows: [['use AI', '91%'], ['have a senior-led, company-wide AI strategy', '28%'], ['report a measurable return', '13%']] }, ctx, SAMPLE.sources.h2c))}
  ${item('PullQuote', PullQuote.render(richText(SAMPLE.quote, ctx), undefined, 'h1'))}
  <div class="grow"></div>
  ${item('Source (notes at page foot)', Source.slot())}
</div>`;
  const right = `<div class="page__content g-sheet">
  ${item('KeyFigure', KeyFigure.render(SAMPLE.figures[0], 'figure'))}
  ${item('Chart', Chart.render(SAMPLE.chart, 600, label(), ctx))}
  <div class="g-pair">
    ${item('Card', Card.render({ kicker: 'Return', title: 'A measurable return is rare', text: 'Only a minority of chains can show a measurable return.' }, 0, ctx))}
    ${item('Image', Image.render({ src: 'assets/images/placeholder-4x3.png', caption: 'Placeholder for a photo.', credit: SAMPLE.placeholderCredit }, 'g-photo'))}
  </div>
  <div class="grow"></div>
  ${Source.slot()}
</div>`;
  const flow = BodyColumns.source('g', [{ text: 'Only 28% have a senior-led, company-wide AI strategy.' }], label, ctx);
  void columnWidth;
  return `<h2 class="g-label">Components</h2><p class="g-desc">PageFurniture: tab, section strip and folios on this sheet. SectionDivider: see the divider spread.</p>
<style>${css}</style>
<div class="spread ${sec.cls}" data-file="gallery: components" id="g-components">
<section class="page page--left">${left}${PageFurniture.tab(sec)}${PageFurniture.strip(sec.number)}${PageFurniture.folio(1)}</section>
<section class="page page--right">${right}${PageFurniture.strip(sec.number)}${PageFurniture.folio(2)}</section>
${flow}${Source.store(notes)}
</div>`;
}
