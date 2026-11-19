// Checks the catalogue's router (the <script id="logic"> block of index.html) against the real data.
// Run: node tools/use-case-catalogue/tests/route.test.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, '..', 'index.html'), 'utf8');
const block = id => html.match(new RegExp(`<script id="${id}"[^>]*>([\\s\\S]*?)</script>`))[1];
const X = JSON.parse(block('data'));
const ctx = { self: {} };
vm.runInNewContext(block('logic'), ctx);
const R = ctx.self.CatalogueRoute;
const RCTX = { depts: X.depts.map(d => ({ id: d.id, cat: d.cat })), src: X.src };
const P = h => R.parse(h, RCTX);

let pass = 0, fail = 0;
const eq = (a, b, msg) => { const x = JSON.stringify(a), y = JSON.stringify(b); if (x === y) pass++; else { fail++; console.error('FAIL', msg, '\n  got     ', x, '\n  expected', y); } };
const ok = (c, msg) => eq(!!c, true, msg);

// overview and empty
eq(P(''), { view: 'overview' }, 'empty hash');
eq(P('#'), { view: 'overview' }, 'bare #');
eq(P('#overview'), { view: 'overview' }, 'overview');
// sources
eq(P('#sources'), { view: 'sources', src: null }, 'sources');
const k0 = Object.keys(X.src)[0];
eq(P('#src-' + k0), { view: 'sources', src: k0 }, 'known source code');
eq(P('#src-Z99'), { view: 'invalid' }, 'unknown source code is invalid');
// every department and every area
for (const d of X.depts) {
  eq(P('#' + d.id), { view: 'area', area: d.cat, dept: d.id }, 'dept ' + d.id);
  eq(R.format(P('#' + d.id)), d.id, 'dept round trip ' + d.id);
}
const areas = [...new Set(X.depts.map(d => d.cat))];
eq(areas.length, 4, 'four areas');
for (const a of areas) {
  eq(P('#area:' + a), { view: 'area', area: a, dept: null }, 'area ' + a);
  eq(P('#' + encodeURIComponent('area:' + a)), { view: 'area', area: a, dept: null }, 'encoded area ' + a);
  const first = X.depts.find(d => d.cat === a).id;
  eq(R.areaDept(P('#area:' + a), RCTX, {}), first, 'area opens its first department ' + a);
  const other = X.depts.filter(d => d.cat === a).slice(-1)[0].id;
  eq(R.areaDept(P('#area:' + a), RCTX, { [a]: other }), other, 'area remembers the last department ' + a);
}
eq(R.areaDept(P('#area:Commercial'), RCTX, { Commercial: 'fo' }), 'rm', 'remembered department from another area is ignored');
eq(P('#area:Nowhere'), { view: 'invalid' }, 'unknown area is invalid');
eq(P('#area:'), { view: 'invalid' }, 'empty area is invalid');
// companies
eq(P('#companies'), { view: 'companies', dept: '', q: '' }, 'companies');
eq(P('#companies:'), { view: 'companies', dept: '', q: '' }, 'companies with empty suffix');
eq(P('#companies:fo'), { view: 'companies', dept: 'fo', q: '' }, 'companies by department');
eq(P('#companies:Duetto'), { view: 'companies', dept: '', q: 'Duetto' }, 'companies by name');
eq(P('#companies:fo:chat bot'), { view: 'companies', dept: 'fo', q: 'chat bot' }, 'companies by department and words');
eq(P('#companies:a:b'), { view: 'companies', dept: '', q: 'a:b' }, 'colon inside search words is kept');
for (const c of X.cos) {
  const r = { view: 'companies', dept: '', q: c.n };
  eq(P('#' + encodeURIComponent(R.format(r))), r, 'company round trip ' + c.n);
}
// hotels
eq(P('#hotels'), { view: 'hotels', dept: '', q: '' }, 'hotels');
eq(P('#hotels:hk'), { view: 'hotels', dept: 'hk', q: '' }, 'hotels by department');
for (const g of X.hg) {
  const r = { view: 'hotels', dept: '', q: g.name };
  eq(P('#' + encodeURIComponent(R.format(r))), r, 'hotel group round trip ' + g.name);
  eq(P('#hotels:' + g.name), r, 'hotel group raw link ' + g.name);
}
eq(R.format({ view: 'hotels', dept: '', q: '   ' }), 'hotels', 'blank search drops out of the hash');
// previously possible impossible states, now rejected
eq(P('#hotelsXYZ'), { view: 'invalid' }, 'prefix match no longer counts as hotels');
eq(P('#companiesfoo'), { view: 'invalid' }, 'prefix match no longer counts as companies');
eq(P('#nonsense'), { view: 'invalid' }, 'unknown hash');
eq(P('#%E0%A4%A'), { view: 'invalid' }, 'malformed percent-encoding is invalid, not a crash');
eq(P('#FO'), { view: 'invalid' }, 'department ids are case-sensitive');
eq(R.format({ view: 'invalid' }), 'overview', 'invalid formats to overview');
// same(): decoded comparison, so the same route is recognised and re-rendered
ok(R.same('#hotels:Scandic%20Hotels', 'hotels:Scandic Hotels'), 'encoded and plain hash are the same place');
ok(!R.same('#hotels:Scandic', 'hotels:Scandic Hotels'), 'different routes differ');
ok(!R.same('#%E0%A4%A', '%E0%A4%A'), 'malformed hashes are never the same');
// no two names collide with a department id (the suffix rule depends on it)
const ids = new Set(X.depts.map(d => d.id));
ok(!X.cos.some(c => ids.has(c.n)) && !X.hg.some(g => ids.has(g.name)), 'no company or group name equals a department id');

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
