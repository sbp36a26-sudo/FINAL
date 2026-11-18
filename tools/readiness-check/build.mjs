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
// Provisional legal labels from the AI Register (awaiting D7 sign-off). Only what the check shows.
const reg = {
  labels: ref.labels, dates: ref.dates, switches: ref.switches, labourNotes: ref.labourNotes, vendorQuestions: ref.vendorQuestions,
  items: ref.items.map(i => ({ id: i.id, pack: i.pack, role: i.role, since: i.since, who: i.who, text: i.text })),
  uses: labels.uses.map(u => ({ id: u.id, base: u.base, chat: !!u.chat, staff: !!u.staff, why: u.why, packs: u.packs || [], switches: u.switches || [] }))
};
const data = { rdy, cat, reg, builtOn: new Date().toISOString().slice(0, 10) };
const block = `<script type="application/json" id="d-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
const safe = s => s.replace(/<\/script/gi, '<\\/script');
const style = read('src/style.css');

for (const [page, script, out] of [['src/check.html', 'src/check.js', 'index.html'], ['src/team.html', 'src/team.js', 'team.html']]) {
  let html = read(page);
  for (const [mark, text] of [['/*__STYLE__*/', style], ['<!--__DATA__-->', block], ['/*__STORE__*/', safe(read('src/store.js'))], ['/*__LOGIC__*/', safe(read('src/logic.js'))], ['/*__APP__*/', safe(read(script))]]) {
    if (!html.includes(mark)) throw new Error(page + ': missing ' + mark);
    html = html.replace(mark, () => text);
  }
  writeFileSync(join(here, out), html);
  console.log('wrote tools/readiness-check/' + out, Math.round(html.length / 1024) + ' KB');
}
