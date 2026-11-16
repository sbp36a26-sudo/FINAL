// Contents spread: generated from report.yaml with real page numbers. Not written by hand.
import * as PageTitle from '../components/PageTitle.js';
import * as Lead from '../components/Lead.js';
import * as BodyColumns from '../components/BodyColumns.js';
import * as Subheading from '../components/Subheading.js';
import { esc } from '../render/text.js';
import type { Layout } from './types.js';

export const layout: Layout = {
  id: 'contents',
  name: 'Contents',
  description: 'Generated contents spread: every section and spread with its page number.',
  css: `
.toc-group { break-inside: avoid; }
.flow-box > .toc-group:not(:first-child) { margin-top: calc(var(--u) * 6); }
.toc-entry { display: flex; gap: calc(var(--u) * 3); padding: var(--u) 0 calc(var(--u) - var(--hairline)); border-bottom: var(--hairline) solid var(--color-rule); line-height: var(--lh-body); }
.toc-entry a { display: contents; color: inherit; text-decoration: none; }
.toc-entry__num { flex: none; width: calc(var(--u) * 10); font-family: var(--font-display); font-weight: var(--weight-display); color: var(--sec-text); }
.toc-entry__title { flex: 1; }
.toc-entry__page { flex: none; font-family: var(--font-display); font-weight: var(--weight-display); }
.toc-group .subheading { margin-bottom: calc(var(--u) * 2); }
.toc-group .subheading__heading a { color: inherit; text-decoration: none; }
`,
  schema: { type: 'object' },
  ratios: {},
  measure: [],
  furniture: { tab: false, strip: [true, true], folio: ['ink', 'ink'] },
  sample: { layout: 'contents', section: 'Contents', title: 'AI in European Hospitality: The Playbook for Hospitality Stakeholders' },
  render(c, ctx) {
    const groups = (ctx.toc ?? []).map((t) => `<div class="toc-group ${t.section.cls}">
  ${Subheading.render(`Section ${t.section.number}`, undefined, `<a href="#${t.anchor}">${esc(t.section.name)}</a>`, 'contents')}
  ${t.entries.map((e) => `<div class="toc-entry"><a href="#${e.anchor}"><span class="toc-entry__num">${esc(e.number)}</span><span class="toc-entry__title">${esc(e.title)}</span><span class="toc-entry__page">${e.page}</span></a></div>`).join('')}
</div>`).join('');
    const left = `<div class="page__content">
  ${PageTitle.render(null, 'Contents')}
  ${Lead.render(esc(c.title ?? ''))}
  ${BodyColumns.columns('toc', 1, 'contents')}
</div>`;
    const right = `<div class="page__content">${BodyColumns.columns('toc', 3, 'contents')}</div>`;
    return { left, right, templates: `<template data-flow-source="toc">${groups}</template>` };
  },
};
