// Manifest -> numbered spreads -> validation -> HTML -> PNGs, PDF and render checks.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { chromium, type Page } from 'playwright';
import { ROOT, sectionByLabel, allowedColours, fontSize, type Section } from './brand.js';
import { layouts, layoutById } from './layouts/index.js';
import type { Layout, TocSection } from './layouts/types.js';
import { validateContent, type Problem } from './validate/content.js';
import { documentHtml, prepareAssets, spreadHtml, NO_SECTION, type SpreadInput } from './render/document.js';

export const OUT = path.join(ROOT, 'out');

export interface PlannedSpread { file: string; layout: Layout; content: any; section: Section; number: string; pages: [number, number]; anchor: string; sectionAnchor?: number }

export interface Plan { title: string; spreads: PlannedSpread[]; toc: TocSection[]; problems: Problem[] }

const rel = (f: string) => path.relative(ROOT, f);

export function readSpread(file: string): { content: any; layout?: Layout; problems: Problem[] } {
  const f = rel(file);
  let content: any;
  try { content = YAML.parse(readFileSync(file, 'utf8')); } catch (e: any) { return { content: null, problems: [{ file: f, field: '(file)', message: `YAML error: ${e.message}` }] }; }
  if (content?.layout === 'contents') return { content, problems: [{ file: f, field: 'layout', message: 'the contents spread is generated; set "contents: true" in report.yaml instead.' }] };
  const layout = layoutById(content?.layout);
  if (!layout) return { content, problems: [{ file: f, field: 'layout', message: `"${content?.layout}" is not a layout. Use one of: ${layouts.filter((l) => l.id !== 'contents').map((l) => l.id).join(', ')}.` }] };
  return { content, layout, problems: validateContent(f, content, layout) };
}

/** Reads report.yaml, numbers spreads and pages, builds the contents data. */
export function plan(manifestPath = path.join(ROOT, 'content/report.yaml')): Plan {
  const m = YAML.parse(readFileSync(manifestPath, 'utf8'));
  const problems: Problem[] = [];
  const spreads: PlannedSpread[] = [];
  let index = 0;
  const pagesOf = (i: number): [number, number] => [2 * i + 1, 2 * i + 2];
  const contents = layoutById('contents');
  if (m.contents && contents) spreads.push({ file: 'contents (generated)', layout: contents, content: { layout: 'contents', section: 'Contents', title: m.title }, section: NO_SECTION, number: '', pages: pagesOf(index++), anchor: 'contents' });
  for (const group of m.sections ?? []) {
    const section = sectionByLabel(group.section);
    if (!section) { problems.push({ file: 'content/report.yaml', field: 'sections', message: `"${group.section}" is not a section in brand.json.` }); continue; }
    let n = 0;
    let first = true;
    for (const f of group.spreads ?? []) {
      const file = path.join(ROOT, 'content/pages', f);
      if (!existsSync(file)) { problems.push({ file: 'content/report.yaml', field: group.section, message: `content/pages/${f} does not exist.` }); continue; }
      const r = readSpread(file);
      problems.push(...r.problems);
      if (r.content && r.content.section !== group.section) problems.push({ file: rel(file), field: 'section', message: `is "${r.content.section}" but report.yaml lists it under "${group.section}".` });
      if (!r.layout || r.problems.some((p) => p.field === 'layout' || p.message.startsWith('YAML'))) continue;
      const isDivider = r.layout.id === 'divider';
      spreads.push({
        file: rel(file), layout: r.layout, content: r.content, section, number: isDivider ? '' : `${section.number}.${++n}`,
        pages: pagesOf(index++), anchor: `spread-${index}`, sectionAnchor: first ? section.number : undefined,
      });
      first = false;
    }
  }
  const toc: TocSection[] = [];
  for (const s of spreads) {
    if (!s.section.number) continue;
    let t = toc.find((x) => x.section.number === s.section.number);
    if (!t) toc.push((t = { section: s.section, page: s.pages[0], anchor: s.anchor, entries: [] }));
    if (s.number) t.entries.push({ number: s.number, title: s.content.title ?? s.content.quote ?? '', page: s.pages[0], anchor: s.anchor });
  }
  return { title: m.title ?? 'Report', spreads, toc, problems };
}

export const toInput = (s: PlannedSpread, toc: TocSection[], assets = 'assets'): SpreadInput => ({ ...s, toc, assets });

export async function writeDocument(file: string, spreads: SpreadInput[], title: string) {
  const used = [...new Map(spreads.map((s) => [s.layout.id, s.layout])).values()];
  writeFileSync(file, await documentHtml(spreads.map(spreadHtml).join('\n'), used, 'assets', title));
}

export async function openPage(width = 1588, scale = 2) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height: 1123 }, deviceScaleFactor: scale });
  return { browser, page };
}

export async function load(page: Page, file: string) {
  await page.goto('file://' + file);
  await page.waitForFunction(() => (window as any).__ready === true, null, { timeout: 30000 });
}

export async function renderChecks(page: Page): Promise<Problem[]> {
  const src = readFileSync(path.join(ROOT, 'src/runtime/checks.js'), 'utf8');
  const opts = { colours: allowedColours(), sizes: Object.values(fontSize), caption: fontSize.caption };
  const issues = await page.evaluate(`(${src.trim().replace(/^\/\/.*$/gm, '')})(${JSON.stringify(opts)})`);
  return (issues as any[]).map((i) => ({ file: i.file, field: i.field, message: `${i.kind}: ${i.message}` }));
}

export function printProblems(problems: Problem[]) {
  const byFile = new Map<string, Problem[]>();
  for (const p of problems) byFile.set(p.file, [...(byFile.get(p.file) ?? []), p]);
  for (const [file, ps] of byFile) {
    console.error(`\n✖ ${file}`);
    for (const p of ps) console.error(`   ${p.field}: ${p.message}`);
  }
}

export function ensureOut() { mkdirSync(path.join(OUT, 'png'), { recursive: true }); prepareAssets(OUT); }
