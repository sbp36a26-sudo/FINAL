// Builds the readiness check (index.html) and the team engine page (team.html).
// Data comes from the readiness tool (D6 data) and the register's label file (which uses affect staff).
// Run after editing anything in src/:   node tools/readiness-check/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = p => readFileSync(join(here, p), 'utf8');
const rdyHtml = read('../readiness/index.html');
const grab = id => JSON.parse(rdyHtml.match(new RegExp(`<script id="${id}" type="application/json">([\\s\\S]*?)</script>`))[1]);
const rdy = grab('rdy'), catFull = grab('cat');
const labels = JSON.parse(read('../register/data/uc-labels.json'));
const lab = Object.fromEntries(labels.uses.map(u => [u.id, u]));

const cat = { depts: catFull.depts.map(d => ({ id: d.id, name: d.name, cat: d.cat, uses: d.uses.map((u, i) => {
  const id = d.id + '-' + (i + 1), l = lab[id];
  if (!l || l.name !== u.n) throw new Error('register label file out of step with the catalogue at ' + id);
  const o = { n: u.n, task: u.task, use: u.use, kw: l.kw || '' };
  if (l.staff) o.staff = true;
  if (l.base === 'notai') o.notTool = true;
  return o;
}) })) };
const ref = JSON.parse(read('../register/data/reference.json'));
// Rules v4 (ruling items 15 and 26): nothing unverified is embedded in the hotel-facing pages.
// Swiss and UK labour notes and anything marked "to verify" stay out until checked at source (D7 owner);
// two unsourced claims are cut from the step subtitles. The register's and the D6 tool's own files are not changed.
const labourNotes = Object.fromEntries(Object.entries(ref.labourNotes).filter(([k, v]) => k !== 'CH' && k !== 'GB' && !/to\s+verify/i.test(v)));
const switches = Object.fromEntries(Object.entries(ref.switches).map(([k, v]) => [k, { q: v.q, yes: v.yes }]));
const CUT = [['; integration is the bottleneck', ''], ['; most hotels are not there yet', '']];
rdy.areas.forEach(a => { CUT.forEach(([x, y]) => { a.one = a.one.replace(x, y); }); });
rdy.uc.forEach(u => { Object.keys(u.r || {}).forEach(k => { if (typeof u.r[k] === 'string') u.r[k] = u.r[k].replace(/\s*\(often\s+missing\)/gi, ''); }); });
// Provisional legal labels from the AI Register (awaiting D7 sign-off). Only what the check shows.
const reg = {
  labels: ref.labels, dates: ref.dates, switches, labourNotes, vendorQuestions: ref.vendorQuestions,
  items: ref.items.map(i => ({ id: i.id, pack: i.pack, role: i.role, since: i.since, who: i.who, text: i.text })),
  uses: labels.uses.map(u => ({ id: u.id, base: u.base, chat: !!u.chat, staff: !!u.staff, why: u.why, packs: u.packs || [], switches: u.switches || [] }))
};
// Only what the check uses is embedded (the D6 research tool's own level names, method notes and figures stay in that tool).
const rdyUsed = { areas: rdy.areas.map(a => ({ k: a.k, name: a.name, one: a.one, qs: a.qs })), q: rdy.q, blocks: rdy.blocks, arch: rdy.arch.map(a => ({ c: a.c, s: a.s, n: a.n })), uc: rdy.uc, addons: rdy.addons };
const data = { rdy: rdyUsed, cat, reg, builtOn: new Date().toISOString().slice(0, 10) };
const block = `<script type="application/json" id="d-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
const safe = s => s.replace(/<\/script/gi, '<\\/script');
const style = read('src/style.css');

for (const [page, script, out] of [['src/check.html', 'src/check.js', 'index.html'], ['src/team.html', 'src/team.js', 'team.html']]) {
  let html = read(page);
  for (const [mark, text] of [['/*__STYLE__*/', style], ['<!--__DATA__-->', block], ['/*__STORE__*/', safe(read('src/store.js'))], ['/*__LOGIC__*/', safe(read('src/logic.js'))], ['/*__FLOW__*/', safe(read('src/flow.js'))], ['/*__APP__*/', safe(read(script))]]) {
    if (!html.includes(mark)) throw new Error(page + ': missing ' + mark);
    html = html.replace(mark, () => text);
  }
  writeFileSync(join(here, out), html);
  console.log('wrote tools/readiness-check/' + out, Math.round(html.length / 1024) + ' KB');
}
