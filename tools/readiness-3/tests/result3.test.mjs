// R3Result and R3Pdf: the result model (§6.4 order, usefulness rules of §9), the Copy texts and the PDF (§6.10).
// Run: node tools/readiness-3/tests/result3.test.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { root, load, tester, goldenRecord } from './load.mjs';
import { loadV3, goldenCases } from '../lib/data3.mjs';
const { ok, done } = tester('result3');
const { R3, S, RES, P, jspdf } = load(true);
const { runtime: D } = loadV3();
const font = { regular: readFileSync(join(root, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(root, '../register/fonts/rs-bold.ttf')).toString('base64') };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const OWNERS = new Set(Object.values(D.labels.owners));
mkdirSync(join(root, 'tests/out'), { recursive: true });

let n = 0;
goldenCases().forEach((g, i) => {
  const tag = 'golden ' + (i + 1) + ' ';
  const rec = goldenRecord(S, R3, D, g), m = RES.model(D, rec, {}, '2026-11-25');
  ok(m.verdict === g.expected_verdict && (g.expected_score == null ? m.score === null : m.score === g.expected_score), tag + 'model verdict and score');
  /* usefulness: a reason sentence and 1–3 actions with owners for every non-Ready result */
  if (m.verdictKey !== 'ready') ok(m.reason && /[.?]$/.test(m.reason) && m.top3.length >= 1 && m.top3.length <= 3 && m.top3.every(a => a.text && OWNERS.has(a.owner)), tag + 'reason and 1–3 actions with owners');
  else ok(m.reason && m.top3.length <= 3, tag + 'Ready has a reason');
  /* every Don't know yet becomes a Find out action or a vendor question */
  if (!m.stop) {
    const dk = m.res.items.filter(x => x.answer === 'dk');
    const acts = m.people.flatMap(p => p.items);
    ok(dk.every(x => acts.includes('Find out: ' + x.text.replace(/\?\s*$/, '')) || m.vendor.includes(x.text)), tag + 'every Don\'t know yet is a Find out action or a vendor question (' + dk.length + ')');
    ok(m.areas.length >= 2 && m.areas[0].name === 'Must-haves' && m.areas.every(a => a.line === a.yes + ' of ' + a.total + ' in place'), tag + 'details by area: n of m in place');
    ok(m.scoreLine === 'Readiness score: ' + m.score + '%', tag + 'score labelled Readiness score');
    ok(m.qa.length === 4 && m.qa[1].items.length === 11, tag + 'every question and answer: step 2, must-haves, How it works, questions');
  }
  if (m.flag) ok(m.flag === D.texts.sensitive_flag && m.top3[0].text === 'Ask an adviser before a pilot.' && m.top3[0].owner === 'General manager', tag + 'flag verbatim and adviser action first');
  ok(m.reason !== (m.flag || '').split('. ')[0] + '.', tag + 'the reason does not repeat the flag');
  ok(eq(m.notes.map(x => x.note), g.expected_notes), tag + 'contradiction notes as expected');
  ok(m.disclaimer === D.texts.disclaimer, tag + 'disclaimer verbatim');
  /* Copy text and PDF: the same top 3 */
  const copy = RES.summaryText(m);
  /* v3.0.2 (owner decision, 25 Nov 2026): a blocker in the top 3 reads "(<owner>; needed before a pilot)" */
  ok(m.top3.every((a, k) => copy.includes((k + 1) + '. ' + a.text + ' (' + a.owner + (a.need ? '; needed before a pilot' : '') + ')')) && copy.includes(m.verdict) && copy.includes(m.reason) && copy.includes(D.texts.disclaimer), tag + 'Copy holds verdict, reason, top 3 and disclaimer');
  ok(!/Not sure|Unknown|N\/A/.test(copy + RES.planText(m)), tag + 'terms: no "Not sure", "Unknown", "N/A"');
  const b = P.blocks(m), r = P.draw(b, jspdf, font), f = join(root, 'tests/out/result_' + (i + 1) + '.pdf');
  writeFileSync(f, Buffer.from(r.doc.output('arraybuffer')));
  const p1 = execFileSync('pdftotext', ['-f', '1', '-l', '1', f, '-']).toString().replace(/\s+/g, ' ');
  const all = execFileSync('pdftotext', [f, '-']).toString().replace(/\s+/g, ' ');
  const flat = s => s.replace(/\s+/g, ' ');
  ok(p1.includes('Do you need AI? Result') && p1.includes('Hotel Golden') && p1.includes('2026-11-25') && p1.includes(m.verdict) && p1.includes(flat(m.reason)) && (!m.flag || p1.includes(m.flag)) && (m.stop || p1.includes(m.useTitle)), tag + 'PDF page 1: hotel, use case, date, verdict, reason, flag');
  ok(m.top3.every(a => p1.includes(flat(a.text)) && p1.includes(a.owner) && (!a.need || p1.includes(a.owner + ' · Needed before a pilot'))), tag + 'PDF page 1: the same top 3 as Copy, a blocker named Needed before a pilot');
  /* owner decision, 25 Nov 2026: every blocker not at Yes in the top 3 is marked; "Must be Yes" appears nowhere in the result */
  ok(m.top3.every(a => a.need === m.res.items.some(i => i.weight === 'B' && i.answer !== 'yes' && a.text === (i.answer === 'dk' ? 'Find out: ' : 'Make sure: ') + i.text.replace(/\?\s*$/, ''))), tag + 'top 3: need = a blocker that is not Yes');
  ok(!/Must be Yes/.test(copy + RES.planText(m) + all + JSON.stringify(m)), tag + 'no "Must be Yes" in the result, Copy, plan or PDF');
  if (m.res.blockersNo.length) ok(m.reason.startsWith('Needed before a pilot: ') && /answered No/.test(m.reason) && p1.includes('Needed before a pilot:'), tag + 'blockers No: the reason names them as Needed before a pilot (screen and PDF)');
  ok(r.footers.length === r.pages && r.footers.every((t, k) => t === 'page ' + (k + 1) + ' of ' + r.pages) && (all.match(/This check does not cover legal requirements/g) || []).length === r.pages, tag + 'every page: disclaimer and page n of N (' + r.pages + ' pages)');
  if (!m.stop) {
    const heads = b.blocks.filter(x => x.k === 'h').map(x => x.t);
    ok(eq(heads, ['Top 3 actions', 'Details by area', 'Action plan by person', 'Questions to ask the vendor', 'Every question and your answer', 'How this was worked out', 'Readiness score']), tag + 'PDF sections in the result order, score last');
    ok(all.indexOf('Readiness score') > all.indexOf('How this was worked out'), tag + 'score last in the PDF');
  }
  ok(!/Source|https?:/.test(all), tag + 'no sources or links in the PDF');
  n++;
});
ok(n === 33, '33 golden cases');
done();
