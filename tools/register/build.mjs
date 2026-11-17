// Builds tools/register/index.html: one self-contained page with the data and code inlined.
// Run after editing anything in src/ or data/:   node tools/register/build.mjs
// It also checks that the label file still matches the catalogue (use-case ids are positional, so they must not drift).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = p => readFileSync(join(here, p), 'utf8');
const json = p => JSON.parse(read(p));

const ref = json('data/reference.json');
const labels = json('data/uc-labels.json');
const radar = json('data/radar.json');

// Catalogue: department list plus, per use, what it does, the kind of AI and how common it is in hotels.
const catHtml = read('../use-case-catalogue/index.html');
const cat = JSON.parse(catHtml.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const catOut = { depts: cat.depts.map(d => ({ id: d.id, name: d.name, cat: d.cat })), uses: {} };
let n = 0;
for (const d of cat.depts) {
  d.uses.forEach((u, i) => {
    const id = d.id + '-' + (i + 1), row = labels.uses[n++];
    if (!row || row.id !== id || row.name !== u.n) {
      throw new Error(`uc-labels.json is out of step with the catalogue at ${id} ("${u.n}"). Use-case ids are positional: fix the label file before building.`);
    }
    catOut.uses[id] = { task: u.task, ai: u.ai, use: u.use };
  });
}

// National layer: taken from the AI Act data file so the wording has one source.
const act = json('../ai-act-explorer/ai-act-data.json');
const nat = { _researchedOn: act.nationalLayer.researchedOn || '' };
for (const c of act.nationalLayer.countries) {
  const code = ref.nationalKeys[c.country];
  if (code) nat[code] = { aiActAuthority: c.aiActAuthority, designationStatus: c.designationStatus, labourRules: c.labourRules, hotelNote: c.hotelNote || '', confidence: c.confidence || '' };
}

const block = (id, obj) => `<script type="application/json" id="${id}">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const dataBlocks = [block('d-ref', ref), block('d-labels', labels), block('d-radar', radar), block('d-cat', catOut), block('d-national', nat)].join('\n');
const safeJs = s => s.replace(/<\/script/gi, '<\\/script');

let page = read('src/page.html');
for (const [mark, text] of [['<!--__DATA__-->', dataBlocks], ['/*__LOGIC__*/', safeJs(read('src/logic.js'))], ['/*__APP__*/', safeJs(read('src/app.js'))]]) {
  if (!page.includes(mark)) throw new Error('missing placeholder ' + mark);
  page = page.replace(mark, () => text);
}
writeFileSync(join(here, 'index.html'), page);
console.log('wrote tools/register/index.html', Math.round(page.length / 1024) + ' KB');
