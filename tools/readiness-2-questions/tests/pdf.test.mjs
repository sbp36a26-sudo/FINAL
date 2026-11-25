// The two PDFs of the result (src/pdf.js, v2.7): document 1 "Result" (Result, Start with these three, Action plan by person, Questions for
// the vendor, EU AI Act) and document 2 "Answers" (every question with the answer given); their text is the result page's own wording
// (both read R2Logic.resultModel); no sources in either; the stop version, the drawing with the real jsPDF and font, and file names.
// Run: node tools/readiness-2/tests/pdf.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { root, load, data, tester, finished } from './load.mjs';
const { C, L, F, P, RC } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('pdf');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const PG = P.PAGE;
const env = { cat: D.cat, TQ, today: '2026-11-24' };

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
const texts = m => m.blocks.map(b => [b.t, b.a, b.m, b.name, b.check, b.answer, b.sub, b.box].filter(Boolean).join(' | '));
const all = m => texts(m).join('\n');
const heads = m => m.blocks.filter(b => b.k === 'h').map(b => b.t);
function mk(use, musts, tail, o) {
  const r = finished(F, D, use, o);
  F.MUST_IDS.forEach((id, i) => { r.A[id] = (musts && musts[i]) || 'y'; });
  if (use && use !== 'none') TQ.uses[use].qs.forEach((q, i) => { r.T[q.id] = (tail && tail[i]) || 'y'; });
  return r;
}
const SRC_RE = /\bSources?\b|https?:|www\.|Where this comes from|Open the source/;
const NOT_IN_RESULT = m => [m.useTask, m.useLevel, m.areasHead].concat(m.areas.map(a => a.line).filter(x => !m.mustLine.includes(x)), m.method).filter(x => x && x !== m.mustOnly); // not tested: the question list (the action plan words a tailored item as its question), the five answers' lines (a hold quotes its outcome), the path (it is the use case line)
/* Every word of the Result document must be as the result page says it; nothing of the other sections is in it. */
function sameWords(rec, tag) {
  const m = L.resultModel(rec, env), pdf = P.model(rec, env), t = all(pdf);
  const need = [m.levelName + ' · ' + m.scoreHead, m.boxLine, m.reason, m.law, m.scoreSub, m.levelLine, m.mustLine, m.cap, m.mustOnly, m.draft, m.firstLabel]
    .concat(m.first.map(f => (f.who ? f.who + ': ' : '') + f.text), m.first.map(f => f.sub), m.people.map(p => p.name), m.people.flatMap(p => p.items.map(a => a.text)), m.people.flatMap(p => p.items.map(a => a.tag)),
      m.vendor, m.legal ? [m.legalNote, m.legal.why, m.legal.country, m.legal.labour].concat(m.legal.could, m.legal.items.map(i => i.text), m.legal.items.map(i => i.sub)) : [], m.since ? [m.since.head].concat(m.since.lines) : []).filter(Boolean);
  const missing = need.filter(x => !t.includes(x));
  ok(missing.length === 0, tag + ': every line of the result document is in the PDF, word for word (' + need.length + ' lines) ' + JSON.stringify(missing.slice(0, 2)));
  if (m.legal) ok(t.includes(m.legal.name + (m.legal.applies ? ' (' + m.legal.applies + ')' : '')), tag + ': the provisional label');
  ok(!NOT_IN_RESULT(m).some(x => x.length > 25 && t.includes(x)) && pdf.blocks.every(b => !['item', 'q', 'area', 'src', 'page'].includes(b.k)) && !SRC_RE.test(t), tag + ': nothing from the other sections, no answer table, no sources, no links');
  ok(eq(heads(pdf), ['Result', m.firstLabel, 'Action plan by person'].concat(m.vendor.length ? ['Questions for the vendor'] : [], m.legal ? ['EU AI Act: provisional label'] : [])), tag + ': sections exactly: ' + heads(pdf).join(' / '));
  return { m, pdf, t };
}
/* Document 2: every question once, with its answer. */
function answersDoc(rec, tag) {
  const m = L.resultModel(rec, env), pdf = P.model(rec, env, 'answers'), t = all(pdf), items = pdf.blocks.filter(b => b.k === 'item');
  const nTail = rec.use && rec.use !== 'none' ? TQ.uses[rec.use].qs.length : 0;
  ok(items.length === 5 + 10 + nTail && new Set(items.map(b => b.id)).size === items.length, tag + ': every question once: ' + items.length + ' = 5 + 10 + ' + nTail);
  ok(items.slice(0, 5).every((b, i) => b.name === C.QUESTIONS[i].title && b.check === C.QUESTIONS[i].q) && items.slice(5, 15).every((b, i) => b.id === F.MUST_IDS[i]) && items.slice(15).every((b, i) => b.name === TQ.uses[rec.use].qs[i].q), tag + ': in the order of the steps');
  ok(items.slice(5, 15).every(b => b.check) && m.itemList.every((it, i) => { const b = items[5 + i]; return b.val === (m.ev.items[i].old ? 'Not answered' : it.answer) && b.answer === 'Your answer: ' + b.val; }) && m.answers.every((a, i) => items[i].val === a.a), tag + ': each answer is the one given');
  ok(!SRC_RE.test(t) && !heads(pdf).some(h => /Sources|How this was worked out/.test(h)) && pdf.blocks.every(b => b.k !== 'src') && pdf.blocks[0].t === 'Do you need AI? Your answers' && pdf.blocks.some(b => b.t === 'Result: ' + m.levelName + ' · ' + m.scoreHead) && t.includes('Date: ' + m.date) && (!m.useName || t.includes('Use case: ' + m.useName)), tag + ': a summary (hotel, use case, date, verdict and score), no sources');
  ok(!/Partly|Doesn’t apply/.test(t) && !/no longer offered/.test(t), tag + ': no retired answer words');
  return { m, pdf, t, items };
}

// ---------- a guest chatbot, mixed answers ----------
let r = mk('fo-4', ['y', 'y', 'pl', 'y', 'k', 'y', 'pl', 'y', 'n', 'y'], ['y', 'k', 'y', 'y', 'pl', 'y', 'n', 'y']); r.By.m3 = '2027-01-15'; // v2.3: Partly → Planned, Doesn't apply → No
let { m, pdf, t } = sameWords(r, 'fo-4');
ok(eq(heads(pdf), ['Result', 'Start with these three', 'Action plan by person', 'Questions for the vendor']), 'sections as the owner listed them, in this order (v2.7.0: without the AI Act section)');
answersDoc(r, 'fo-4');
ok(pdf.blocks[0].t === 'Do you need AI? Result' && t.includes('Hotel: Hotel Test · Independent hotel · France') && t.includes('Filled in by: General manager') && t.includes('Date: 24 Nov 2026') && !/legal advice/i.test(t) && t.includes('as of 25 Nov 2026'), 'title, hotel, role, date, prototype line');
/* PDF redesign: page 1: the box (verdict, score, the short reason line, the must-haves line), the reason and the points under it,
   then "Start with"; a page break before "Is this an AI problem?". */
const lv = pdf.blocks.find(b => b.id === 'level'), why = pdf.blocks[pdf.blocks.indexOf(lv) + 1], sub = pdf.blocks[pdf.blocks.indexOf(lv) + 2];
ok(lv.k === 'verdict' && lv.t === 'Not ready yet · Score: 69%' && lv.name === 'Not ready yet' && lv.score === 'Score: 69%' && lv.box === 'Because 1 must-have is No.' && lv.sub === m.mustLine && lv.tone === 'lo' &&
  why.id === 'reason' && why.t === 'Because 1 must-have is missing: Rules for staff on AI tools. A missing must-have outweighs the score.' && sub.id === 'score-sub' && sub.t.startsWith('25 of 36 points on 18 questions: 16 answered, 2 “Don’t know yet” (0 points each). Your own answers; nobody checked them.'), 'the verdict box (name, score, box line, must-haves line, colour), then the reason, the points and the caveat: ' + lv.t + ' / ' + why.t + ' / ' + sub.t);
ok(pdf.run.hotel === m.hotel && pdf.run.date === m.date && pdf.blocks.some(b => b.k === 'meta' && b.t === 'Use case: ' + m.useName), 'the use case and the date in the summary; the running header\'s hotel and date');
ok(!/% ready/.test(t), 'the PDF never says "% ready" (v2.1)');
ok(t.includes('Finish: Agree the KPI this tool must improve') && t.includes('(planned by 15 Jan 2027).') && !/Partly|Doesn’t apply|does not apply/.test(t), 'planned dates are shown in the result; no Partly or Doesn\'t apply anywhere (v2.3)');
{ const a = answersDoc(r, 'gx-2 planned'); ok(a.t.includes('Your answer: Planned (planned by 15 Jan 2027)') && a.t.includes('Your answer: No') && a.t.includes('Your answer: Don’t know yet') && a.items.filter(b => b.val === 'Yes').length > 5, 'the answers document shows the planned date and every answer word'); }
ok(!/\b(m\d+|pe1|x-auto)\b/.test(t) && !/\b(P1|F1|T1|D5a|G2s)\b/.test(t), 'no internal ids or codes in the PDF');
ok(!SRC_RE.test(t) && !t.includes('90 catalogue use cases coded') && !t.includes('{N}') && !C.SOURCES.q.some(x => t.includes(x)), 'no source line of any step in the result PDF');
// ---------- the other two walks, and the special cases ----------
sameWords(mk('hr-2', [], []), 'hr-2 all Yes'); sameWords(mk('hr-2', ['n', 'k', 'k'], ['k', 'pl', 'pl', 'n', 'y', 'k', 'n']), 'hr-2 mixed');
let x = sameWords(mk('fo-8', ['pl'], []), 'fo-8'); ok(!x.t.includes('Draft questions'), 'v2.7.0: no draft note (the questions-only data replaces the draft rows)');
answersDoc(mk('fo-8', ['pl'], []), 'fo-8 draft');
x = sameWords(mk('none', ['y', 'pl'], []), 'none'); ok(x.t.includes(C.MUST_ONLY) && x.t.includes('None of these fits') && !heads(x.pdf).includes('Questions for the vendor') && !heads(x.pdf).includes('EU AI Act: provisional label'), '"None of these fits": must-haves only, said so; no vendor or label section');
{ const a = answersDoc(mk('none', ['y', 'pl'], []), 'none'); ok(a.items.length === 15 && !a.pdf.blocks.some(b => b.k === 'label' && /^Step 5/.test(b.t)) && a.t.includes('Use case: None of these fits'), '"None of these fits": 5 + 10 answers, no step 5 group'); }
x = sameWords(mk('lg-4', [], []), 'lg-4'); ok(!heads(x.pdf).includes('EU AI Act: provisional label'), 'lg-4: no label section');
x = sameWords(mk('fo-4', [], [], { Q: { q1: 'u', q2: 'n', q3: 'n', q4: 'n', q5: 'n' } }), 'carried conditions'); { const a = answersDoc(mk('fo-4', [], [], { Q: { q1: 'u', q2: 'n', q3: 'n', q4: 'n', q5: 'n' } }), 'carried'); ok(eq(a.items.slice(0, 5).map(b => b.val), ['Not sure', 'No', 'No', 'No', 'No']), 'the five step 2 answers as given (Not sure, No x4)'); }
{ /* answers saved before v2.3 (Partly, Doesn't apply) are no longer offered: "Not answered" */
  const o = mk('fo-4', [], []); o.A.m2 = 'p'; o.T[TQ.uses['fo-4'].qs[0].id] = 'na'; const a = answersDoc(o, 'retired answers'), im = a.m.ev.items;
  ok(im.filter(i => i.old).length === 2 && a.items.filter(b => b.val === 'Not answered').length >= 2 && !/earlier answer/.test(a.t), 'retired answers (Partly, Doesn\'t apply) read "Not answered"'); }
r = mk('fo-4', [], []); r.snaps = [L.snapshot(L.evaluate(mk('fo-4', ['k', 'n'], []), TQ), '2026-11-20T09:00:00.000Z', 'fo-4'), L.snapshot(L.evaluate(r, TQ), '2026-11-24T09:00:00.000Z', 'fo-4')];
x = sameWords(r, 'since last time'); ok(x.t.includes('Since last time (20 Nov 2026)') && x.t.includes('Verdict: Not ready yet → Ready to start a pilot.'), 'the return-visit lines');
x = sameWords(mk('rm-1', [], [], { hotel: { name: '', role: '', type: 'managed', country: 'Other' } }), 'no name'); ok(x.t.includes('Hotel: Managed or franchised · Other (outside the EU)') && !x.t.includes('Filled in by'), 'no hotel name, no role');
// random sets over every use case: the words always match
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, pick = a => a[Math.floor(rnd() * a.length)];
const uses = Object.keys(TQ.uses); let n = 0;
for (let i = 0; i < 220; i++) { const use = i < 99 ? uses[i] : i % 7 === 0 ? 'none' : pick(uses); const rr = mk(use, F.MUST_IDS.map(() => pick(['y', 'y', 'pl', 'pl', 'n', 'k'])), use === 'none' ? [] : TQ.uses[use].qs.map(() => pick(['y', 'y', 'pl', 'pl', 'n', 'k', 'n'])), { Q: { q1: pick(['n', 'u']), q2: pick(['y', 'n', 'u']), q3: pick(['y', 'n']), q4: pick(['y', 'n', 'u']), q5: pick(['y', 'n']) } }); sameWords(rr, 'random ' + i + ' ' + use); answersDoc(rr, 'random ' + i + ' ' + use); n++; }
ok(n === 220, '220 answer sets (every use case at least once, both documents) checked word for word');

// ---------- the stop version ----------
r = finished(F, D, '', { Q: { q1: 'y', q3: 'u' }, A: {}, step: 'stop' }); pdf = P.model(r, env); t = all(pdf); // v2.6: Q1 Yes stops
ok(pdf.stop && eq(heads(pdf), ['This is not suitable for AI.']) && !SRC_RE.test(t) && pdf.blocks.every(b => b.k !== 'src') && eq(P.model(r, env, 'answers').blocks, pdf.blocks) && t.includes(C.STOP.why) && t.includes(C.STOP.instead) && t.includes(C.STOP.unsure) && t.includes('Because you answered Yes to: “' + C.QUESTIONS[0].q + '”') && C.QUESTIONS[0].q === 'Can each case be fixed with an “if this, then that” rule?', 'stop PDF (no sources; the same for either kind): the heading, why, instead, the "Not sure" line, the because line');
ok(eq(pdf.blocks.filter(b => b.k === 'q').map(b => b.a), ['Your answer: Yes', 'Your answer: Not answered', 'Your answer: Not sure', 'Your answer: Not answered', 'Your answer: Not answered']) && !/% ready|Must-haves|[Ss]core/.test(t) && pdf.blocks[0].t === 'Do you need AI? Not suitable for AI', 'stop PDF: the five answers, no score, and a title without "score" (v2.1, audit L7)');
let d = drawn(pdf); noOverflow(d.log, 'stop'); layout(pdf, d, 'stop'); ok(d.r.pages === 1 && d.r.footers[0] === C.DISCLAIMER + ' · page 1 of 1', 'stop PDF: one page, the disclaimer in the footer (v2.7.0)');

// ---------- drawing ----------
/* PDF redesign: margins 20 mm; the body between the running header (y < 16) and the footer (y > 297 - 16). */
function noOverflow(log, tag) { const bad = log.filter(l => l.x + l.w > PG.W - PG.M + 0.6 || l.x < PG.M - 0.1 || l.y > PG.H - 8 || l.y < 10); ok(bad.length === 0, tag + ': no line runs past the margins ' + JSON.stringify(bad.slice(0, 2))); }
function body(l) { return l.y > 16 && l.y < PG.H - 16; }
function layout(mdl, d, tag) {
  const N = d.r.pages, byPage = p => d.log.filter(l => l.page === p);
  ok(d.log.filter(body).every(l => l.y <= PG.BOT + 0.5), tag + ': no body line below the bottom margin');
  let feet = 0, heads = 0;
  for (let p = 1; p <= N; p++) { const ls = byPage(p).map(l => l.line); if (ls.includes(P.FOOT_L) && ls.includes('page ' + p + ' of ' + N)) feet++; if (p > 1 && ls.some(l => l.startsWith('Do you need AI? · ') && byPage(p).find(x => x.line === l).y < 15)) heads++; }
  ok(feet === N, tag + ': the footer (prototype line, "page n of N") on every page (' + feet + ' of ' + N + ')');
  ok(heads === N - 1, tag + ': the running header (tool, hotel, date) on every page after the first');
  /* no heading, sub-heading or table head as the last line of a page */
  const hd = mdl.blocks.filter(b => P.sticky(b)).map(b => P.safe(b.t)).concat(['Question']);
  const orphans = [];
  for (let p = 1; p <= N; p++) { const ls = byPage(p).filter(body); if (!ls.length) continue; const last = ls.reduce((a, l) => l.y >= a.y ? l : a); if (last.x <= PG.M + 2.5 && hd.some(h => h === last.line || h.length > 70 && h.startsWith(last.line))) orphans.push(p + ': ' + last.line); }
  ok(orphans.length === 0, tag + ': no heading as the last line of a page ' + JSON.stringify(orphans));
  ok(mdl.stop ? N === 1 : mdl.kind === 'answers' ? byPage(1).some(l => l.line === 'Do you need AI? Your answers') && byPage(1).some(l => l.line === 'Result:') : byPage(1).some(l => l.line.startsWith(mdl.blocks.find(b => b.k === 'verdict').name)), tag + ': page 1 is the summary (verdict, or the answers\' summary)');
}
for (const [tag0, rec] of [['fo-4', mk('fo-4', ['y', 'y', 'pl', 'y', 'k', 'y', 'pl', 'y', 'n', 'y'], ['y', 'k', 'y', 'y', 'pl', 'y', 'n', 'y'])], ['hr-2', mk('hr-2', ['n', 'k', 'pl'], ['k', 'pl', 'pl', 'n', 'y', 'k', 'n'])], ['fo-8', mk('fo-8', [], [])], ['none', mk('none', ['k'], [])], ['long name', mk('it-4', [], [], { hotel: { name: 'Grand Hôtel & Résidence de la Paix – Łódź Ørestad Straße '.repeat(2).slice(0, 118), role: 'owner', type: 'group', country: 'Poland' } })]]) {
  for (const kind of ['result', 'answers']) {
  const mdl = P.model(rec, env, kind), tag = tag0 + ' ' + kind; d = drawn(mdl);
  ok(d.r.pages >= 1 && d.r.pages <= (kind === 'result' ? 4 : 6) && d.r.footers.length === d.r.pages && d.r.footers.every((f, i) => f === P.footer(i + 1, d.r.pages)), tag + ': ' + d.r.pages + ' pages, a footer with "page n of N" on each');
  noOverflow(d.log, tag); layout(mdl, d, tag);
  const printed = d.log.map(l => l.line).join(' ').replace(/\s+/g, ' ');
  ok((kind === 'result' ? ['Result', 'Action plan by person'] : ['Every question and your answer', 'Step 2: Can this problem be solved with AI?', 'Step 3: Must-haves']).every(hh => printed.includes(hh)) && printed.includes(L.resultModel(rec, env).scoreHead) && !SRC_RE.test(printed) && !/Where this comes from/.test(printed), tag + ': the headings and the score are drawn; no source or link text');
  if (kind === 'answers') { const p1 = d.log.filter(l => l.page === 1).map(l => l.line).join(' '); ok(/Points per answer/.test(p1) && /Your points|No score is shown/.test(p1), tag + ': the scoring method (three plain lines) is on page 1'); }
  ok(!/\?{2,}/.test(printed.replace(/\?”/g, '')), tag + ': no run of unprintable characters');
  ok(d.r.doc.output('arraybuffer').byteLength > 8000, tag + ': a real PDF comes out');
  }
}
// page count and layout over many answer sets
seed = 5; let pc = [], pa = [];
for (let i = 0; i < 99; i += 3) { const use = uses[i], rec = mk(use, F.MUST_IDS.map(() => pick(['y', 'pl', 'n', 'k'])), TQ.uses[use].qs.map(() => pick(['y', 'pl', 'n', 'k'])), { Q: { q1: pick(['n', 'u']), q2: pick(['y', 'n', 'u']), q3: 'y', q4: pick(['y', 'n']), q5: 'y' } });
  for (const kind of ['result', 'answers']) { const mdl = P.model(rec, env, kind); d = drawn(mdl); (kind === 'result' ? pc : pa).push(d.r.pages); noOverflow(d.log, 'layout ' + kind + ' ' + use); layout(mdl, d, 'layout ' + kind + ' ' + use); } }
ok(Math.min(...pc) >= 1 && Math.max(...pc) <= 4 && Math.min(...pa) >= 2 && Math.max(...pa) <= 6, 'page count sane over 33 use cases: result ' + Math.min(...pc) + ' to ' + Math.max(...pc) + ', answers ' + Math.min(...pa) + ' to ' + Math.max(...pa) + ' pages');
d = drawn(P.model(finished(F, D, '', { Q: { q1: 'y', q2: 'n', q3: 'n', q4: 'n', q5: 'n' }, A: {}, step: 'stop' }), env)); ok(d.r.pages === 1, 'stop PDF with Q1 Yes and four No answers (v2.6: was five No): still one page');
ok(P.safe('é ł ø € › “x” → ✓ 汉') === 'é ł ø € › “x” → ? ?', 'characters the font lacks print as "?"');
// ---------- file names ----------
ok(P.fileName('Hôtel de la Paix', '2026-11-24', 'result') === 'Do-you-need-AI_Hotel-de-la-Paix_2026-11-24_result.pdf' && P.fileName('Hôtel de la Paix', '2026-11-24', 'answers') === 'Do-you-need-AI_Hotel-de-la-Paix_2026-11-24_answers.pdf' && P.fileName('', '2026-11-24') === 'Do-you-need-AI_assessment_2026-11-24_result.pdf' && P.fileName('../../x<y>|z', '2026-11-24', 'answers') === 'Do-you-need-AI_x-y-z_2026-11-24_answers.pdf' && P.fileName('Hôtel', '2026-11-24', 'file') === 'Do-you-need-AI_Hotel_2026-11-24.pdf', 'file names: safe ASCII, _result.pdf / _answers.pdf, no suffix for the saved file\'s base name');
ok(/^Do-you-need-AI_assessment_\d{4}-\d{2}-\d{2}_answers\.pdf$/.test(P.fileName('', 'not a date', 'answers')) && P.fileName('x'.repeat(200), '2026-11-24', 'answers').length <= 15 + 60 + 16 + 8, 'file names: a bad date falls back to today; long names are cut');
done();
