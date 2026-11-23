// Loads the page's pure scripts (content, logic, flow, pdf) into one Node context, the way the page does.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export function load() {
  const ctx = { self: {} };
  for (const f of ['content.js', 'logic.js', 'flow.js', 'pdf.js']) vm.runInNewContext(readFileSync(join(root, 'src', f), 'utf8'), ctx, { filename: f });
  return { C: ctx.self.R2Content, L: ctx.self.R2Logic, F: ctx.self.R2Flow, P: ctx.self.R2Pdf };
}
export function catalogue() {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  return JSON.parse(html.match(/<script type="application\/json" id="r2-data">([\s\S]*?)<\/script>/)[1]).cat;
}
export function tester(name) {
  let pass = 0, fail = 0;
  const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
  const done = () => { console.log(name + ': ' + pass + ' passed, ' + fail + ' failed'); if (fail) process.exit(1); };
  return { ok, done };
}
