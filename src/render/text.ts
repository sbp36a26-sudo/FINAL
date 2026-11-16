import { findNumbers } from '../numbers.js';

export const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface SourceRef { source: string; base: string }

/** Numbered notes for one spread. Same source + base -> same number. */
export class Notes {
  list: SourceRef[] = [];
  add(r: SourceRef): number {
    const i = this.list.findIndex((x) => x.source === r.source && x.base === r.base);
    if (i >= 0) return i + 1;
    this.list.push(r);
    return this.list.length;
  }
}

export interface NumberSource { value: number; unit: string; ref: SourceRef }

export interface TextCtx {
  notes: Notes;
  /** Figures and chart rows on this spread, so a number in text can cite them. */
  numberSources: NumberSource[];
}

export const sourceLine = (r: SourceRef) => `Source: ${r.source}. Base: ${r.base}.`;
export const refHtml = (n: number) => `<sup class="ref" data-note="${n}">${n}</sup>`;

/**
 * Escapes text and inserts a superscript note reference after every number.
 * `own` is the source + base given next to this text field; otherwise numbers are matched
 * against figures and chart rows on the spread. Unmatched numbers are left bare (validation reports them).
 */
export function richText(text: string, ctx: TextCtx, own?: Partial<SourceRef>): string {
  const nums = findNumbers(text);
  let out = '';
  let last = 0;
  let lastRef = 0;
  for (const n of nums) {
    let ref: SourceRef | undefined;
    if (own?.source && own?.base) ref = own as SourceRef;
    else ref = ctx.numberSources.find((s) => s.value === n.value && (s.unit === n.unit || !n.unit))?.ref;
    const end = n.index + n.raw.length;
    out += esc(text.slice(last, end));
    last = end;
    if (ref) {
      const id = ctx.notes.add(ref);
      if (own?.source) { lastRef = id; continue; } // one ref at the end of the text for an own source
      out += refHtml(id);
    }
  }
  out += esc(text.slice(last));
  if (lastRef) out += refHtml(lastRef);
  return out;
}

export const paragraphs = (text: string) => String(text ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
