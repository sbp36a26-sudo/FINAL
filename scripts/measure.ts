// npm run measure: derives each layout's hard limits by rendering it with long dummy text
// and finding the largest amount that fits without overflow. Writes layouts/<id>.schema.json.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, sections } from '../src/brand.js';
import { layouts } from '../src/layouts/index.js';
import type { Layout, MeasureSpec } from '../src/layouts/types.js';
import { documentHtml, spreadHtml, prepareAssets } from '../src/render/document.js';
import { openPage, renderChecks, OUT } from '../src/report.js';
import { SAMPLE } from '../src/layouts/sample.js';

const only = process.argv[2];
const CORPUS = [
  'Hotels across Europe are testing new tools in the front office, in revenue management and in guest communication. ',
  'Managers describe the work as promising but uneven, and the gains depend on data quality, staff training and clear ownership. ',
  'Independent properties often lack the time and the specialist knowledge to choose suppliers, while chains can spread the cost of integration across many sites. ',
  'Owners want evidence before they commit budget, and they ask how each tool changes the working day of reception, housekeeping and sales teams. ',
].join('');
/** Dummy text of at most n characters, cut at a word boundary, starting at a given offset. */
function dummy(n: number, offset = 0): string {
  let s = '';
  while (s.length < n + offset + 200) s += CORPUS;
  s = s.slice(offset);
  s = s.slice(s.indexOf(' ') + 1);
  s = s[0].toUpperCase() + s.slice(1);
  if (s.length <= n) return s;
  const cut = s.lastIndexOf(' ', n);
  return s.slice(0, cut > 0 ? cut : n).replace(/[,\s]+$/, '');
}

const clone = (o: any) => JSON.parse(JSON.stringify(o));
function setPath(o: any, p: string, fn: (v: any) => any) {
  const [head, ...rest] = p.split('.');
  if (head.endsWith('[]')) { const k = head.slice(0, -2); o[k] = o[k].map((it: any) => (rest.length ? (setPath(it, rest.join('.'), fn), it) : fn(it))); return; }
  if (!rest.length) { o[head] = fn(o[head]); return; }
  setPath(o[head], rest.join('.'), fn);
}
const getPath = (o: any, p: string) => p.split('.').reduce((x, k) => x?.[k.replace('[]', '')], o);
function schemaNode(schema: any, p: string) {
  let node = schema;
  for (const part of p.split('.')) {
    node = node.properties[part.replace('[]', '')];
    if (part.endsWith('[]')) node = node.items;
  }
  return node;
}

prepareAssets(OUT);
const { browser, page } = await openPage(1588, 1);
const base = path.join(OUT, 'measure.html');

async function fits(layout: Layout, content: any): Promise<boolean> {
  const section = sections.find((s) => s.label === content.section) ?? sections[1];
  const html = spreadHtml({ layout, content, file: 'measure', section, number: `${section.number}.1`, pages: [8, 9], anchor: 'm', toc: tocSample(), assets: 'assets' });
  await page.evaluate(async (h) => { document.body.innerHTML = h; await (window as any).__layout(); }, html);
  const issues = await renderChecks(page);
  return !issues.some((i) => i.message.startsWith('overflow'));
}
function tocSample() {
  return sections.map((s, i) => ({ section: s, page: 3 + i * 8, anchor: 'a', entries: [1, 2, 3].map((k) => ({ number: `${s.number}.${k}`, title: SAMPLE.title, page: 5 + i * 8 + k * 2, anchor: 'a' })) }));
}

async function maxWhere(test: (n: number) => Promise<boolean>, lo: number, hi: number): Promise<number> {
  if (!(await test(lo))) return 0;
  while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); if (await test(mid)) lo = mid; else hi = mid - 1; }
  return lo;
}

for (const layout of layouts) {
  if (only && layout.id !== only) continue;
  writeFileSync(base, await documentHtml('', [layout], 'assets', 'measure'));
  await page.goto('file://' + base);
  await page.waitForFunction(() => (window as any).__ready === true);
  if (!(await fits(layout, layout.sample))) console.warn(`! ${layout.id}: the sample content itself overflows.`);
  const schema = clone(layout.schema);
  const report: string[] = [];
  // Phase 1: line-capped text fields, others at sample length. Phase 2: item counts and flowing
  // text, with every text field at its measured maximum (worst case), so the limits hold together.
  const maxContent = clone(layout.sample);
  const ordered = [...layout.measure.filter((s) => s.kind === 'text'), ...layout.measure.filter((s) => s.kind !== 'text')];
  for (const spec of ordered) {
    let limit = 0;
    if (spec.kind === 'text') {
      // three different texts; the limit is the smallest maximum
      const results: number[] = [];
      for (const off of [0, 137, 311]) {
        results.push(await maxWhere(async (n) => { const c = clone(layout.sample); setPath(c, spec.path, () => dummy(n, off)); return fits(layout, c); }, 1, 4000));
      }
      limit = Math.min(...results);
      schemaNode(schema, spec.path).maxLength = limit;
      setPath(maxContent, spec.path, () => dummy(limit));
      report.push(`${spec.path}: ${limit} characters`);
    } else if (spec.kind === 'items') {
      const first = getPath(maxContent, spec.path)[0];
      limit = await maxWhere(async (n) => { const c = clone(maxContent); setPath(c, spec.path, () => Array.from({ length: n }, () => clone(first))); return fits(layout, c); }, 1, 40);
      schemaNode(schema, spec.path).maxItems = limit;
      report.push(`${spec.path}: ${limit} items`);
    } else if (spec.kind === 'flow') {
      const items = getPath(maxContent, spec.path) as any[];
      const k = items.length;
      const fixed = items.reduce((n, it) => n + (it.heading?.length ?? 0) + (it.kicker?.length ?? 0), 0);
      const per = await maxWhere(async (n) => {
        const c = clone(maxContent);
        setPath(c, spec.path, (arr: any[]) => arr.map((it, i) => ({ kicker: it.kicker, heading: it.heading, text: dummy(n, i * 97) })));
        return fits(layout, c);
      }, 1, 4000);
      limit = fixed + per * k;
      schemaNode(schema, spec.path)['x-maxTotalChars'] = limit;
      schemaNode(schema, spec.path + '[].text').maxLength = limit;
      report.push(`${spec.path}: ${limit} characters in total (${k} blocks)`);
    }
  }
  schema['x-measured'] = { on: new Date().toISOString().slice(0, 10), method: 'Largest amount of dummy text that renders without overflow, other fields at sample length (scripts/measure.ts).' };
  mkdirSync(path.join(ROOT, 'layouts'), { recursive: true });
  writeFileSync(path.join(ROOT, 'layouts', `${layout.id}.schema.json`), JSON.stringify(schema, null, 2) + '\n');
  console.log(`${layout.id}\n  ${report.join('\n  ')}`);
}
await browser.close();
