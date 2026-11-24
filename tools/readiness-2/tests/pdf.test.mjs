// The PDF of the result (src/pdf.js): its text is the result page's own wording (both read R2Logic.resultModel), the stop
// version, the drawing with the real jsPDF and font (pages, footers, margins), and file names.
// Run: node tools/readiness-2/tests/pdf.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { root, load, data, tester, finished } from './load.mjs';
const { C, L, F, P, RC } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('pdf');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const env = { cat: D.cat, TQ, RC, M: RC.model({ rdy: D.rc.rdy, cat: D.cat, reg: D.rc.reg }), today: '2026-11-24' };

const jctx = { atob, btoa, console, TextEncoder, TextDecoder }; jctx.self = jctx; jctx.globalThis = jctx;
vm.runInNewContext(readFileSync(join(root, '../assessment/lib/jspdf.umd.min.js'), 'utf8'), jctx);
const font = { regular: readFileSync(join(root, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(root, '../register/fonts/rs-bold.ttf')).toString('base64') };
function spyPdf(log) {
  return { jsPDF: function (o) {
    const d = new jctx.jspdf.jsPDF(o), t = d.text.bind(d);
    d.text = function (s, x, y, opt) { (Array.isArray(s) ? s : [s]).forEach(line => log.push({ line, x, y, w: d.getTextWidth(line), page: d.getCurrentPageInfo().pageNumber })); return t(s, x, y, opt); };
    return d;
  } };
}
function drawn(m) { const log = []; const r = P.draw(m, spyPdf(log), font); return { r, log }; }
const texts = m => m.blocks.map(b => [b.t, b.a, b.name, b.check, b.answer, b.sub].filter(Boolean).join(' | '));
const all = m => texts(m).join('\n');
const heads = m => m.blocks.filter(b => b.k === 'h').map(b => b.t);
function mk(use, musts, tail, o) {
  const r = finished(F, D, use, o);
  F.MUST_IDS.forEach((id, i) => { r.A[id] = (musts && musts[i]) || 'y'; });
  if (use && use !== 'none') TQ.uses[use].qs.forEach((q, i) => { r.T[q.id] = (tail && tail[i]) || 'y'; });
  return r;
}
/* Every word of the result model must be in the PDF, as it is. */
function sameWords(rec, tag) {
  const m = L.resultModel(rec, env), pdf = P.model(rec, env), t = all(pdf);
  const need = [m.levelName + ' · ' + m.scoreHead, m.reason, m.law, m.scoreSub, m.levelLine, m.mustLine, m.cap, m.mustOnly, m.draft, m.ai.head, m.ai.second, m.ai.q1Unsure, m.path, m.useTask, m.useLevel, m.none, m.firstLabel]
    .concat(m.ai.carried, m.ai.find, m.areas.map(a => a.line), m.first.map(f => f.who + ': ' + f.text), m.first.map(f => f.sub), m.people.map(p => p.name), m.people.flatMap(p => p.items.map(a => a.text)), m.people.flatMap(p => p.items.map(a => a.tag)),
      m.vendor, m.method, m.answers.map(a => a.title + ': ' + a.q), m.answers.map(a => 'Your answer: ' + a.a), m.itemList.map(i => i.q), m.itemList.map(i => 'Your answer: ' + i.answer),
      m.legal ? [m.legalNote, m.legal.why, m.legal.country, m.legal.labour].concat(m.legal.could, m.legal.items.map(i => i.text), m.legal.items.map(i => i.sub)) : [], m.since ? [m.since.head].concat(m.since.lines) : []).filter(Boolean);
  const missing = need.filter(x => !t.includes(x));
  ok(missing.length === 0, tag + ': every line of the result is in the PDF, word for word (' + need.length + ' lines) ' + JSON.stringify(missing.slice(0, 2)));
  if (m.legal) ok(t.includes(m.legal.name + (m.legal.applies ? ' (' + m.legal.applies + ')' : '')), tag + ': the provisional label');
  return { m, pdf, t };
}

// ---------- a guest chatbot, mixed answers ----------
let r = mk('gx-2', ['y', 'y', 'pl', 'y', 'k', 'y', 'p', 'y', 'n', 'y'], ['y', 'k', 'y', 'y', 'p', 'y', 'na', 'y']); r.By.m3 = '2027-01-15';
let { m, pdf, t } = sameWords(r, 'gx-2');
ok(eq(heads(pdf), ['Result', 'Start with these three', 'Is this an AI problem?', 'Where it sits', 'What is in place, by area', 'Action plan by person', 'Questions for the vendor', 'EU AI Act: provisional label', 'Every question and your answer', 'How this was worked out', 'Sources']), 'sections, in the result page\'s order');
ok(pdf.blocks[0].t === 'Do you need AI? Result' && t.includes('Hotel: Hotel Test · Independent hotel · France') && t.includes('Filled in by: General manager') && t.includes('Date: 24 Nov 2026') && t.includes('Not legal advice.') && t.includes('as of 24 Nov 2026'), 'title, hotel, role, date, prototype line');
const lv = pdf.blocks.find(b => b.id === 'level'), why = pdf.blocks[pdf.blocks.indexOf(lv) + 1], sub = pdf.blocks[pdf.blocks.indexOf(lv) + 2];
ok(lv.t === 'Not ready yet · Score: 73%' && why.id === 'reason' && why.t === 'Because 1 must-have is missing: Rules for staff on AI tools. A missing must-have outweighs the score.' && sub.id === 'score-sub' && sub.t.startsWith('25 of 34 points on 17 questions: 15 answered, 2 “Don’t know yet” (0 points each). Your own answers; nobody checked them.'), 'the verdict with the score, the reason, then the points and the caveat: ' + lv.t + ' / ' + why.t + ' / ' + sub.t);
ok(!/% ready/.test(t), 'the PDF never says "% ready" (v2.1)');
ok(t.includes('Finish: Agree the KPI this tool must improve') && t.includes('(planned by 15 Jan 2027).') && t.includes('Your answer: Planned (planned by 15 Jan 2027)') && t.includes('Your answer: Doesn’t apply'), 'planned dates and "Doesn\'t apply" are shown');
ok(pdf.blocks.filter(b => b.k === 'item').length === 18 && pdf.blocks.filter(b => b.k === 'q').length === 5, '18 questions with answers, and the five questions');
ok(!/\b(m\d+|pe1|x-auto)\b/.test(t) && !/\b(P1|F1|T1|D5a|G2s)\b/.test(t), 'no internal ids or codes in the PDF');
ok(pdf.blocks.filter(b => b.k === 'src').length >= C.SOURCES.q.length + C.SOURCES.must.length && t.includes('90 catalogue use cases coded against 20 building blocks') && !t.includes('{N}'), 'sources per step, with the matrix count filled in');
// ---------- the other two walks, and the special cases ----------
sameWords(mk('hr-2', [], []), 'hr-2 all Yes'); sameWords(mk('hr-2', ['n', 'k', 'k'], ['k', 'p', 'pl', 'n', 'y', 'k', 'na']), 'hr-2 mixed');
let x = sameWords(mk('fo-8', ['p'], []), 'fo-8 draft'); ok(x.t.includes('Draft questions: team to review'), 'a draft use case says so in the PDF');
x = sameWords(mk('none', ['y', 'pl'], []), 'none'); ok(x.t.includes(C.MUST_ONLY) && x.t.includes('None of these fits') && !heads(x.pdf).includes('Questions for the vendor') && !heads(x.pdf).includes('EU AI Act: provisional label') && x.pdf.blocks.filter(b => b.k === 'item').length === 10, '"None of these fits": must-haves only, said so; no vendor or label section');
x = sameWords(mk('lg-4', [], []), 'lg-4'); ok(!heads(x.pdf).includes('EU AI Act: provisional label'), 'lg-4: no label section');
x = sameWords(mk('gx-2', [], [], { Q: { q1: 'u', q2: 'n', q3: 'n', q4: 'n', q5: 'n' } }), 'carried conditions'); ok(x.m.ai.carried.length === 4 && x.t.includes('If question 1 turns out to be No'), 'every carried condition and the Q1 "Not sure" line');
r = mk('gx-2', [], []); r.snaps = [L.snapshot(L.evaluate(mk('gx-2', ['k', 'n'], []), TQ), '2026-11-20T09:00:00.000Z', 'gx-2'), L.snapshot(L.evaluate(r, TQ), '2026-11-24T09:00:00.000Z', 'gx-2')];
x = sameWords(r, 'since last time'); ok(x.t.includes('Since last time (20 Nov 2026)') && x.t.includes('Verdict: Not ready yet → Ready to start a pilot.'), 'the return-visit lines');
x = sameWords(mk('rm-1', [], [], { hotel: { name: '', role: '', type: 'managed', country: 'Other' } }), 'no name'); ok(x.t.includes('Hotel: Managed or franchised · Other (outside the EU)') && !x.t.includes('Filled in by'), 'no hotel name, no role');
// random sets over every use case: the words always match
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, pick = a => a[Math.floor(rnd() * a.length)];
const uses = Object.keys(TQ.uses); let n = 0;
for (let i = 0; i < 220; i++) { const use = i < 99 ? uses[i] : i % 7 === 0 ? 'none' : pick(uses); sameWords(mk(use, F.MUST_IDS.map(() => pick(['y', 'y', 'pl', 'p', 'n', 'k'])), use === 'none' ? [] : TQ.uses[use].qs.map(() => pick(['y', 'y', 'pl', 'p', 'n', 'k', 'na'])), { Q: { q1: pick(['y', 'u']), q2: pick(['y', 'n', 'u']), q3: pick(['y', 'n']), q4: pick(['y', 'n', 'u']), q5: pick(['y', 'n']) } }), 'random ' + i + ' ' + use); n++; }
ok(n === 220, '220 answer sets (every use case at least once) checked word for word');

// ---------- the stop version ----------
r = finished(F, D, '', { Q: { q1: 'n', q3: 'u' }, A: {}, step: 'stop' }); pdf = P.model(r, env); t = all(pdf);
ok(pdf.stop && eq(heads(pdf), ['This is not suitable for AI.', 'Sources']) && t.includes(C.STOP.why) && t.includes(C.STOP.instead) && t.includes(C.STOP.unsure) && t.includes('Because you answered No to: “Is this task too varied for fixed rules (if this, then that)?”'), 'stop PDF: the heading, why, instead, the "Not sure" line, the because line');
ok(eq(pdf.blocks.filter(b => b.k === 'q').map(b => b.a), ['Your answer: No', 'Your answer: Not answered', 'Your answer: Not sure', 'Your answer: Not answered', 'Your answer: Not answered']) && !/% ready|Must-haves|[Ss]core/.test(t) && pdf.blocks[0].t === 'Do you need AI? Not suitable for AI', 'stop PDF: the five answers, no score, and a title without "score" (v2.1, audit L7)');
let d = drawn(pdf); ok(d.r.pages === 1 && d.r.footers[0] === 'Do you need AI? · student prototype, not legal advice · page 1 of 1', 'stop PDF: one page');

// ---------- drawing ----------
function noOverflow(log, tag) { const bad = log.filter(l => l.x + l.w > 210 - 18 + 0.6 || l.x < 17.9 || l.y > 297 - 8); ok(bad.length === 0, tag + ': no line runs past the margins ' + JSON.stringify(bad.slice(0, 2))); }
for (const [tag, rec] of [['gx-2', mk('gx-2', ['y', 'y', 'pl', 'y', 'k', 'y', 'p', 'y', 'n', 'y'], ['y', 'k', 'y', 'y', 'p', 'y', 'na', 'y'])], ['hr-2', mk('hr-2', ['n', 'k', 'p'], ['k', 'p', 'pl', 'n', 'y', 'k', 'na'])], ['fo-8', mk('fo-8', [], [])], ['none', mk('none', ['k'], [])], ['long name', mk('it-4', [], [], { hotel: { name: 'Grand Hôtel & Résidence de la Paix – Łódź Ørestad Straße '.repeat(2).slice(0, 118), role: 'owner', type: 'group', country: 'Poland' } })]]) {
  const mdl = P.model(rec, env); d = drawn(mdl);
  ok(d.r.pages >= 2 && d.r.pages <= 9 && d.r.footers.length === d.r.pages && d.r.footers.every((f, i) => f === P.footer(i + 1, d.r.pages)), tag + ': ' + d.r.pages + ' pages, a footer with "page n of N" on each');
  noOverflow(d.log, tag);
  const printed = d.log.map(l => l.line).join(' ').replace(/\s+/g, ' ');
  ok(['What is in place, by area', 'Action plan by person', 'How this was worked out'].every(hh => printed.includes(hh)) && printed.includes(L.resultModel(rec, env).scoreHead), tag + ': the headings and the score are drawn');
  ok(!/\?{2,}/.test(printed.replace(/\?”/g, '')), tag + ': no run of unprintable characters');
  ok(d.r.doc.output('arraybuffer').byteLength > 20000, tag + ': a real PDF comes out');
}
ok(P.safe('é ł ø € › “x” → ✓ 汉') === 'é ł ø € › “x” → ? ?', 'characters the font lacks print as "?"');
// ---------- file names ----------
ok(P.fileName('Hôtel de la Paix', '2026-11-24') === 'Do-you-need-AI_Hotel-de-la-Paix_2026-11-24.pdf' && P.fileName('', '2026-11-24') === 'Do-you-need-AI_assessment_2026-11-24.pdf' && P.fileName('../../x<y>|z', '2026-11-24') === 'Do-you-need-AI_x-y-z_2026-11-24.pdf', 'file names: safe ASCII');
ok(/^Do-you-need-AI_assessment_\d{4}-\d{2}-\d{2}\.pdf$/.test(P.fileName('', 'not a date')) && P.fileName('x'.repeat(200), '2026-11-24').length <= 15 + 60 + 16, 'file names: a bad date falls back to today; long names are cut');
done();
