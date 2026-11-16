// Reusable JSON Schema fragments. Limits (maxLength, maxItems) are added by scripts/measure.ts.
export const str = { type: 'string', minLength: 1 };
export const sourced = { source: str, base: str };
export const figure = {
  type: 'object', additionalProperties: false, required: ['value', 'label', 'source', 'base'],
  properties: { value: { type: 'number' }, unit: { enum: ['%', '€', 'x', ''] }, label: str, ...sourced },
};
export const chart = {
  type: 'object', additionalProperties: false, required: ['title', 'rows', 'source', 'base'],
  properties: {
    title: str, unit: { enum: ['%', '€', 'x', ''] },
    rows: { type: 'array', minItems: 2, items: { type: 'object', additionalProperties: false, required: ['label', 'value'], properties: { label: str, value: { type: 'number' }, highlight: { type: 'boolean' } } } },
    ...sourced,
  },
};
export const table = {
  type: 'object', additionalProperties: false, required: ['head', 'rows'],
  properties: { head: { type: 'array', items: { type: 'string' } }, rows: { type: 'array', items: { type: 'array', items: { type: ['string', 'number'] } } } },
};
export const bodyItem = {
  type: 'object', additionalProperties: false,
  properties: { kicker: str, heading: str, text: str, table, ...sourced },
};
export const body = { type: 'array', minItems: 1, items: bodyItem };
export const image = {
  type: 'object', additionalProperties: false, required: ['src', 'credit'],
  properties: { src: str, caption: str, credit: str, alt: str },
};
/** Top-level text fields may carry an adjacent source: e.g. lead + lead_source + lead_base. */
const SOURCEABLE = ['title', 'lead', 'quote'];
export const base = (props: Record<string, any>, required: string[]) => {
  const adj: Record<string, any> = {};
  for (const k of SOURCEABLE) if (k in props) { adj[`${k}_source`] = str; adj[`${k}_base`] = str; }
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object', additionalProperties: false,
    required: ['layout', 'section', ...required],
    properties: { layout: { type: 'string' }, section: { type: 'string' }, ...props, ...adj },
  };
};
/** The adjacent source of a top-level field, for richText(). */
export const adjacent = (c: any, k: string) => ({ source: c[`${k}_source`], base: c[`${k}_base`] });
