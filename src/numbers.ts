// Number detection shared by rendering (footnote refs) and validation (source rule).
// A "number" is any run of digits, with optional € prefix and %, €, x or × suffix.
export const NUMBER_RE = /(?:€\s?)?~?\d(?:[\d,.]*\d)?(?:\s?(?:%|€|x\b|×))?/g;

export interface FoundNumber { raw: string; value: number; unit: string; index: number }

export function findNumbers(text: string): FoundNumber[] {
  const out: FoundNumber[] = [];
  for (const m of text.matchAll(NUMBER_RE)) {
    const raw = m[0];
    const unit = raw.includes('%') ? '%' : raw.includes('€') ? '€' : /[x×]$/.test(raw) ? 'x' : '';
    const value = Number(raw.replace(/[^\d.]/g, '').replace(/\.$/, '').replace(/,/g, ''));
    out.push({ raw, value, unit, index: m.index! });
  }
  return out;
}

export function formatValue(value: number, unit = ''): string {
  const n = value.toLocaleString('en-GB');
  if (unit === '€') return `€${n}`;
  return `${n}${unit}`;
}
