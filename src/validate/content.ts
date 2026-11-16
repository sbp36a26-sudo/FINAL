// Content checks that need no browser: schema limits, number-has-source, Wikipedia, image ratios.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import sizeOf from 'image-size';
import { ROOT, sectionByLabel, brand } from '../brand.js';
import { findNumbers } from '../numbers.js';
import { collectNumberSources } from '../render/document.js';
import type { Layout } from '../layouts/types.js';

export interface Problem { file: string; field: string; message: string }

const ajv = new Ajv({ allErrors: true, strict: false, verbose: true });
const compiled = new Map<string, any>();

export function schemaFor(layout: Layout): Record<string, any> {
  const p = path.join(ROOT, 'layouts', `${layout.id}.schema.json`);
  if (!existsSync(p)) throw new Error(`layouts/${layout.id}.schema.json is missing. Run "npm run measure" to derive the limits.`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

const at = (path: string) => (path ? path.replace(/^\//, '').replace(/\/(\d+)/g, '[$1]').replace(/\//g, '.') : '(top level)');
const getAt = (obj: any, p: string) => p.split('/').filter(Boolean).reduce((o, k) => o?.[k], obj);

/** Text fields that are metadata, not running text. */
const EXEMPT = new Set(['layout', 'section', 'source', 'base', 'credit', 'src', 'alt', 'unit']);

export function validateContent(file: string, c: any, layout: Layout): Problem[] {
  const out: Problem[] = [];
  const add = (field: string, message: string) => out.push({ file, field, message });

  if (!sectionByLabel(c.section)) add('section', `"${c.section}" is not a section. Use one of: ${(brand.sections as string[]).map((s) => `"${s}"`).join(', ')}.`);

  // 1. Schema with measured limits
  const schema = schemaFor(layout);
  if (!compiled.has(layout.id)) compiled.set(layout.id, ajv.compile(schema));
  const validate = compiled.get(layout.id);
  if (!validate(c)) {
    for (const e of validate.errors as any[]) {
      const f = at(e.instancePath);
      const v = getAt(c, e.instancePath);
      if (e.keyword === 'maxLength') add(f, `${String(v).length} characters; ${layout.id} allows ${e.params.limit}. Cut at least ${String(v).length - e.params.limit}.`);
      else if (e.keyword === 'maxItems') add(f, `${v.length} items; ${layout.id} allows ${e.params.limit}. Cut ${v.length - e.params.limit} or split the page.`);
      else if (e.keyword === 'minItems') add(f, `${v?.length ?? 0} items; ${layout.id} needs at least ${e.params.limit}.`);
      else if (e.keyword === 'required') add(f, `missing required field "${e.params.missingProperty}".`);
      else if (e.keyword === 'additionalProperties') add(f, `unknown field "${e.params.additionalProperty}". ${layout.id} accepts: ${Object.keys(getAt(schema, e.schemaPath.replace(/^#/, '').replace(/\/additionalProperties$/, '') + '/properties') ?? {}).join(', ')}.`);
      else if (e.keyword === 'pattern' && e.parentSchema?.['x-patternMessage']) add(f, e.parentSchema['x-patternMessage']);
      else add(f, e.message);
    }
  }
  // Total length of flowing body text
  const walkSchema = (s: any, v: any, p: string) => {
    if (!s || v == null) return;
    if (s['x-maxTotalChars'] && Array.isArray(v)) {
      const total = v.reduce((n: number, it: any) => n + (it.heading?.length ?? 0) + (it.text?.length ?? 0) + (it.kicker?.length ?? 0), 0);
      if (total > s['x-maxTotalChars']) add(p, `${total} characters of text in total; ${layout.id} allows ${s['x-maxTotalChars']}. Cut at least ${total - s['x-maxTotalChars']}.`);
    }
    if (s.properties && typeof v === 'object') for (const k of Object.keys(s.properties)) walkSchema(s.properties[k], v[k], p ? `${p}.${k}` : k);
  };
  walkSchema(schema, c, '');

  // 2. Every number in a text field has a source and base
  const known = collectNumberSources(c);
  const walk = (o: any, p: string, covered: boolean) => {
    if (o == null) return;
    if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${p}[${i}]`, covered));
    if (typeof o === 'object') {
      const here = covered || (typeof o.source === 'string' && o.source.trim() !== '' && typeof o.base === 'string' && o.base.trim() !== '');
      if ('source' in o && !('base' in o)) add(p || '(top level)', `has a source but no base. Give who was asked, how many and how weighted.`);
      if ('base' in o && !('source' in o)) add(p || '(top level)', `has a base but no source.`);
      for (const [k, v] of Object.entries(o)) {
        if (EXEMPT.has(k) || /_(source|base)$/.test(k)) continue;
        const adjacent = typeof o[`${k}_source`] === 'string' && typeof o[`${k}_base`] === 'string';
        if ((`${k}_source` in o) !== (`${k}_base` in o)) add(p ? `${p}.${k}` : k, `needs both "${k}_source" and "${k}_base".`);
        walk(v, p ? `${p}.${k}` : k, here || adjacent);
      }
      return;
    }
    if (typeof o !== 'string' || covered) return;
    for (const n of findNumbers(o)) {
      if (!known.some((s) => s.value === n.value && (s.unit === n.unit || !n.unit)))
        add(p, `the number "${n.raw}" has no source and base. Add it as a figure, or give this block "source" and "base".`);
    }
  };
  walk(c, '', false);

  // 3. Wikipedia is never a source
  const walkSrc = (o: any, p: string) => {
    if (!o || typeof o !== 'object') return;
    for (const [k, v] of Object.entries(o)) {
      const q = Array.isArray(o) ? `${p}[${k}]` : p ? `${p}.${k}` : k;
      if (/(^|_)source$/.test(k) && typeof v === 'string' && /wikipedia/i.test(v)) add(q, `"${v}": Wikipedia is never a source. Find the primary source.`);
      walkSrc(v, q);
    }
  };
  walkSrc(c, '');

  // 4. Image ratios
  for (const [field, ratio] of Object.entries(layout.ratios)) {
    const imgs: [string, any][] = field.includes('[]')
      ? ((getAt(c, field.split('[]')[0]) ?? []) as any[]).map((it, i) => [`${field.split('[]')[0]}[${i}]${field.split('[]')[1]}`, getAt(it, field.split('[]')[1].replace(/^\./, ''))])
      : [[field, getAt(c, field.replace(/\./g, '/'))]];
    for (const [f, img] of imgs) {
      if (!img?.src) continue;
      const file = path.join(ROOT, 'content', img.src);
      if (!existsSync(file)) { add(`${f}.src`, `image "${img.src}" not found in content/.`); continue; }
      const d = sizeOf(readFileSync(file));
      const [a, b] = ratio.split(':').map(Number);
      const want = a / b, got = d.width! / d.height!;
      if (Math.abs(got - want) / want > 0.03) add(`${f}.src`, `image is ${d.width} x ${d.height} (ratio ${got.toFixed(3)}); ${layout.id} needs ${ratio} (${want.toFixed(3)}). Crop it to ${ratio}.`);
    }
  }
  return out;
}
