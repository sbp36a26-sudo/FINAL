import type { Section } from '../brand.js';
import type { Notes, NumberSource } from '../render/text.js';

export interface LayoutCtx {
  section: Section;
  /** "2.1" for a content spread; "" for dividers and contents. */
  number: string;
  /** Next subheading label: "2.1.1", "2.1.2" ... */
  label: () => string;
  pages: [number, number];
  notes: Notes;
  numberSources: NumberSource[];
  asset: (src: string) => string;
  /** Filled by the report builder for dividers and the contents spread. */
  toc?: TocSection[];
}

export interface TocSection { section: Section; page: number; anchor: string; entries: { number: string; title: string; page: number; anchor: string }[] }

export interface Rendered { left: string; right: string; spread?: string; templates?: string }

export interface Furniture { tab: boolean; strip: [boolean, boolean]; folio: [false | 'ink' | 'fill', false | 'ink' | 'fill'] }

export type MeasureSpec =
  | { kind: 'text'; path: string } // a string field, or "arr[].field" for every item
  | { kind: 'items'; path: string } // max number of items (copies of the first sample item)
  | { kind: 'flow'; path: string }; // body blocks: total characters across headings and text

export interface Layout {
  id: string;
  name: string;
  description: string;
  css: string;
  /** JSON Schema without measured limits; scripts/measure.ts adds maxLength / maxItems. */
  schema: Record<string, any>;
  /** Image fields and the ratio they require, e.g. { 'image': '1:1.414' }. */
  ratios: Record<string, string>;
  measure: MeasureSpec[];
  furniture: Furniture | ((content: any) => Furniture);
  sample: Record<string, any>;
  render: (c: any, ctx: LayoutCtx) => Rendered;
}
