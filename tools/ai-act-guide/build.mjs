// Builds tools/ai-act-guide/index.html: one self-contained page.
// It inlines the AI Register's rules (src/logic.js) and data, the register's CSS tokens, this guide's data and code,
// and the bundled jsPDF and PDF font, so the page needs nothing from the internet and works from file://.
// Run after editing anything here or in the register:   node tools/ai-act-guide/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = p => readFileSync(join(here, p), 'utf8');
const json = p => JSON.parse(read(p));

// One source of rules: the register's own files, read as they are.
const ref = json('../register/data/reference.json');
const labels = json('../register/data/uc-labels.json');
const guide = json('data/guide.json');

// Every register use the guide points at must exist (ids are positional in the register, so check on each build).
const useIds = new Set(labels.uses.map(u => u.id));
for (const t of guide.types) {
  const ids = [t.use, ...t.questions.flatMap(q => q.answers.map(a => a.use).filter(Boolean))];
  for (const id of ids) if (!useIds.has(id)) throw new Error(`guide.json type ${t.id} points at unknown register use ${id}`);
  for (const q of t.questions) for (const a of q.answers) for (const k of Object.keys(a.set || {}))
    if (!ref.switches[k]) throw new Error(`guide.json ${t.id}.${q.id}.${a.id} sets unknown register question ${k}`);
}

// National layer, from the same AI Act data file the register uses.
const act = json('../ai-act-explorer/ai-act-data.json');
const nat = { _researchedOn: act.nationalLayer.researchedOn || '' };
for (const c of act.nationalLayer.countries) {
  const code = ref.nationalKeys[c.country];
  if (code) nat[code] = { aiActAuthority: c.aiActAuthority, designationStatus: c.designationStatus, labourRules: c.labourRules };
}

const regPage = read('../register/src/page.html');
const regCss = regPage.match(/<style>([\s\S]*?)<\/style>/)[1];

const block = (id, obj) => `<script type="application/json" id="${id}">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const font = { regular: readFileSync(join(here, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(here, '../register/fonts/rs-bold.ttf')).toString('base64') };
const jspdf = read('../assessment/lib/jspdf.umd.min.js');
const safeJs = s => s.replace(/<\/script/gi, '<\\/script');
const dataBlocks = [block('d-ref', ref), block('d-labels', labels), block('d-guide', guide), block('d-national', nat), block('d-font', font)].join('\n');

let page = read('src/page.html');
for (const [mark, text] of [['/*__REGCSS__*/', regCss], ['<!--__DATA__-->', dataBlocks + '\n<script>' + safeJs(jspdf) + '</script>'],
  ['/*__LOGIC__*/', safeJs(read('../register/src/logic.js'))], ['/*__GUIDE__*/', safeJs(read('src/guide.js'))], ['/*__APP__*/', safeJs(read('src/app.js'))]]) {
  if (!page.includes(mark)) throw new Error('missing placeholder ' + mark);
  page = page.replace(mark, () => text);
}
writeFileSync(join(here, 'index.html'), page);
console.log('wrote tools/ai-act-guide/index.html', Math.round(page.length / 1024) + ' KB');
