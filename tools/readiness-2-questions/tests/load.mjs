// Loads the page's pure scripts into one Node context, the way the page does (the readiness check's rules first, as in build.mjs).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export function load() {
  const ctx = { self: {} }; ctx.globalThis = ctx.self;
  vm.runInNewContext(readFileSync(join(root, '../readiness-check/src/logic.js'), 'utf8'), ctx, { filename: 'rc-logic.js' });
  for (const f of ['content.js', 'logic.js', 'flow.js', 'pdf.js']) vm.runInNewContext(readFileSync(join(root, 'src', f), 'utf8'), ctx, { filename: f });
  return { C: ctx.self.R2Content, L: ctx.self.R2Logic, F: ctx.self.R2Flow, P: ctx.self.R2Pdf, RC: ctx.self.RCLogic };
}
/* The data block the built page carries: { cat, tq, rc, builtOn }. */
export function data() {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  return JSON.parse(html.match(/<script type="application\/json" id="r2-data">([\s\S]*?)<\/script>/)[1]);
}
export function envOf(D, F) {
  const env = { cat: D.cat, tq: {} };
  env.sig = {};
  Object.keys(D.tq.uses).forEach(k => { env.tq[k] = D.tq.uses[k].qs.map(q => ({ id: q.id, carry: q.carry || null })); env.sig[k] = D.tq.uses[k].sig; });
  return env;
}
export function tester(name) {
  let pass = 0, fail = 0;
  const ok = (c, n) => { if (c) pass++; else { fail++; console.log('FAIL  ' + n); } };
  const done = () => { console.log(name + ': ' + pass + ' passed, ' + fail + ' failed'); if (fail) process.exit(1); };
  return { ok, done };
}
/* A finished check (v2.6 meaning: every answer points towards AI): five answers, every must-have and every tailored question answered. o overrides. */
export function finished(F, D, use, o) {
  const r = F.blank('t' + String(use).replace(/\W/g, '') + 'x');
  r.hotel = { name: 'Hotel Test', role: 'gm', type: 'independent', country: 'France' };
  r.Q = { q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }; // v2.6: question 1 No (each case needs judgement) is the answer that goes on
  F.MUST_IDS.forEach(id => { r.A[id] = 'y'; });
  if (use && use !== 'none') { const d = D.cat.depts.find(x => x.uses.some(u => u.id === use)); r.cat = d.cat; r.dept = d.id; r.use = use; r.useName = d.uses.find(u => u.id === use).n; D.tq.uses[use].qs.forEach(q => { r.T[q.id] = 'y'; }); }
  else if (use === 'none') r.use = 'none';
  r.step = 'result';
  return Object.assign(r, o || {});
}
