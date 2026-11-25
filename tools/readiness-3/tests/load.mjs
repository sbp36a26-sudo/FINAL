// Loads the page's pure scripts into one Node context, in the page's order (src/page.html), plus helpers shared by the tests.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export function load(withPdf) {
  const ctx = { self: {} }; ctx.globalThis = ctx.self;
  let jspdf = null;
  if (withPdf) { const j = { atob, btoa, console, TextEncoder, TextDecoder }; j.self = j; j.globalThis = j; vm.runInNewContext(readFileSync(join(root, '../assessment/lib/jspdf.umd.min.js'), 'utf8'), j, { filename: 'jspdf.js' }); jspdf = j.jspdf; }
  for (const f of ['data3.js', 'rules3.js', 'store3.js', 'result3.js', 'pdf3.js']) vm.runInNewContext(readFileSync(join(root, 'src', f), 'utf8'), ctx, { filename: f });
  return { R3D: ctx.self.R3Data, R3: ctx.self.R3Rules, S: ctx.self.R3Store, RES: ctx.self.R3Result, P: ctx.self.R3Pdf, jspdf };
}
/* The JSON blocks the built page carries. */
export function pageBlock(id) {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const m = html.match(new RegExp('<script type="application/json" id="' + id + '">([\\s\\S]*?)</script>'));
  return m ? JSON.parse(m[1]) : null;
}
export function tester(name) {
  let pass = 0, fail = 0;
  const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
  const done = () => { console.log(name + ': ' + pass + ' passed, ' + fail + ' failed'); if (fail) process.exit(1); };
  return { ok, done, count: () => ({ pass, fail }) };
}
/* A record for a golden case (spec/golden_cases_v3.json), built the way spec/golden_v3.py builds the inputs: "other answers" Yes. */
export function goldenRecord(S, R3, D, g) {
  const r = S.blank('gold' + String(g.name).replace(/\W/g, '').slice(0, 20));
  r.hotel = { name: 'Hotel Golden', type: 'independent', role: 'gm', country: 'France' };
  r.step2 = Object.assign({ s1: 'yes', s2: 'yes', s3: 'yes', s4: 'yes', s5: 'yes' }, g.step2 || {});
  D.must_haves.forEach(m => { r.mh[m.id] = 'yes'; }); Object.assign(r.mh, g.must_haves_changed || {});
  r.use = g.use_case;
  const gk = g.use_case === 'none' ? 'none' : g.use_case;
  r.gates[gk] = Object.assign({}, g.gates || {});
  const vis = R3.visible(D, g.use_case, r.gates[gk]);
  vis.forEach(q => { r.qa[q.id] = 'yes'; });
  Object.assign(r.qa, g.questions_changed || {});
  if (g.continued_after_soft_stop) r.cont = S.stopKey(D, r);
  r.step = 'result';
  return r;
}
