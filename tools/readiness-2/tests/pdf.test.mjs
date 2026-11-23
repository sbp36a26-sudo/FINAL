// AI starting point (formerly Readiness 2.0) v1.1: the PDF
// v1.2 changed expectations (owner B1/B2, council BUILD NOW 3): title, footer and file-name prefix renamed to "AI starting point";
// the stop heading is "This is not suitable for AI."; "None of these fits" now has a next step (open the readiness check). of the assessment. The text builder (R2Pdf.model) against hand-worked expectations and the
// summary's own functions; the stop version; the drawing with the real jsPDF and font (pages, footer, no line wider than the
// page); file-name sanitising; and the BRIDGE and DOWNLOAD machines.
// Run: node tools/readiness-2/tests/pdf.test.mjs   (after node tools/readiness-2/build.mjs)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { root, load, catalogue, tester } from './load.mjs';
const { C, L, F, P } = load();
const cat = catalogue();
const { ok, done } = tester('pdf');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// jsPDF and the font, exactly as build.mjs inlines them
const jctx = { atob, btoa, console, TextEncoder, TextDecoder }; jctx.self = jctx; jctx.globalThis = jctx;
vm.runInNewContext(readFileSync(join(root, '../assessment/lib/jspdf.umd.min.js'), 'utf8'), jctx);
const font = { regular: readFileSync(join(root, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(root, '../register/fonts/rs-bold.ttf')).toString('base64') };
/* A jsPDF whose text() records every line with its width, so overflow can be checked. */
function spyPdf(log) {
  return { jsPDF: function (o) {
    const d = new jctx.jspdf.jsPDF(o), t = d.text.bind(d);
    d.text = function (s, x, y, opt) { (Array.isArray(s) ? s : [s]).forEach(line => log.push({ line, x, y, w: d.getTextWidth(line), page: d.getCurrentPageInfo().pageNumber })); return t(s, x, y, opt); };
    return d;
  } };
}
function drawn(m) { const log = []; const r = P.draw(m, spyPdf(log), font); return { r, log }; }
function noOverflow(log, tag) {
  const bad = log.filter(l => l.x + l.w > 210 - 18 + 0.6 || l.x < 17.9 || l.y > 297 - 8);
  ok(bad.length === 0, tag + ': no line runs past the margins ' + JSON.stringify(bad.slice(0, 2)));
}

const TODAY = '2026-11-23';
const rec = (o) => Object.assign(F.blank(), { step: 'summary' }, o);
const B = m => m.blocks;
const texts = m => B(m).map(b => [b.t, b.a, b.name, b.check, b.answer, b.action, b.sub].filter(Boolean).join(' | ')).join('\n');
const heads = m => B(m).filter(b => b.k === 'h').map(b => b.t);
const after = (m, head) => { const bs = B(m), i = bs.findIndex(b => b.k === 'h' && b.t === head); const j = bs.findIndex((b, k) => k > i && b.k === 'h'); return bs.slice(i + 1, j < 0 ? undefined : j); };
const ALLY = { q1: 'y', q2: 'y', q3: 'y', q4: 'y', q5: 'y' };
const all = v => Object.fromEntries(L.NEED_IDS.concat(L.FACTOR_IDS).map(id => [id, v]));

// ---------- 1. A mixed answer set (the browser walk's PLAN2 / PLAN3), worked by hand ----------
{
  const A = { b1: 'y', b3: 'pl', b5: 'n', b8: 'y', b9: 'p', b2: 'k', b4: 'y', b6: 'y', b7: 'n', b10: 'y',
    c1: 'y', c2: 'p', c3: 'n', c4: 'k', c5: 'y', c6: 'pl', c7: 'y', c8: 'y', c9: 'n' };
  const r = rec({ Q: { q1: 'y', q2: 'y', q3: 'n', q4: 'n', q5: 'u' }, cat: 'Guest-facing', dept: 'fo', use: 'fo-1', A, By: { b3: '2027-02-03' } });
  const m = P.model(r, cat, { hotel: 'Hôtel Les Mélèzes', today: TODAY });
  ok(m.stop === false, 'mixed: full version');
  ok(eq(B(m).slice(0, 4).map(b => b.t), ['AI starting point: is AI the answer, and where?', 'Hotel: Hôtel Les Mélèzes', 'Date: 23 Nov 2026',
    'Student prototype by EHL SBP Group 36 for HFTP. Not legal advice. Questions, rules and content as of 23 Nov 2026.']), 'mixed: title, hotel, date, prototype line');
  ok(eq(heads(m), ['1. Is this an AI problem?', '2. Where it sits', '3. What you need', '4. What makes it succeed', 'Start with these three', 'Next step', 'Sources']), 'mixed: sections in order');
  const s1 = after(m, '1. Is this an AI problem?');
  ok(s1[0].t === 'Fix the data first.', 'mixed: verdict Q3 No → Fix the data first.');
  ok(s1.some(b => b.k === 'label' && b.t === 'What this means'), 'mixed: label as on the summary (the first condition is the headline)');
  ok(s1.filter(b => b.k === 'li').map(b => b.t).join('\n') === [L.QBY.q3.outcome + ' ' + L.QBY.q3.add, L.QBY.q4.outcome + ' ' + L.QBY.q4.add, L.QBY.q5.short + ': ask the GM.'].join('\n'), 'mixed: carried Q3, Q4 and the Q5 "to find out"');
  ok(eq(s1.filter(b => b.k === 'q').map(b => b.a), ['Your answer: Yes', 'Your answer: Yes', 'Your answer: No', 'Your answer: No', 'Your answer: Not sure']), 'mixed: the five answers');
  ok(eq(s1.filter(b => b.k === 'q').map(b => b.t), C.QUESTIONS.map(q => q.q)), 'mixed: the five questions in full');
  const s2 = after(m, '2. Where it sits'), fo1 = cat.depts.find(d => d.id === 'fo').uses[0];
  ok(s2[0].t === 'Guest-facing › Front Office › ' + fo1.n, 'mixed: category › department › use case');
  ok(s2[1].t === 'What AI does: ' + fo1.task && s2[2].t === 'How common in hotels: ' + fo1.use + ' (Use-Case Catalogue rating).', 'mixed: what AI does, how common');
  const s3 = after(m, '3. What you need');
  ok(s3[0].t === '5 in place · 1 planned · 3 gaps · 1 to find out', 'mixed: step 2 counts by hand ' + s3[0].t);
  ok(s3[0].t === L.countLine(L.counts(A, L.NEED_IDS)), 'mixed: step 2 counts = the summary line');
  ok(eq(s3.filter(b => b.k === 'item').map(b => b.id), C.NEEDS.map(x => x.id)), 'mixed: every step 2 item, in screen order');
  const b3 = s3.find(b => b.id === 'b3');
  ok(b3.answer === 'Your answer: Planned, not done yet (planned by 3 Feb 2027)', 'mixed: planned-by date ' + b3.answer);
  ok(b3.action === 'To do: Finish: List the systems that hold the data the tool needs, and name the person who checks that data at set times (planned by 3 Feb 2027). Usually: Department head / IT.', 'mixed: planned action ' + b3.action);
  ok(s3.find(b => b.id === 'b1').action === 'In place: nothing to do.' && s3.find(b => b.id === 'b1').name === 'Systems that can talk to each other (must-have in the readiness check)', 'mixed: Yes item, must-have tag');
  // v1.3 (owner): b2 now names the systems, with the Front Office examples (was the PMS-only question, no examples line)
  ok(s3.find(b => b.id === 'b2').action === 'To do: Find out: “' + L.ITEM.b2.check + '” For example: your PMS (booking system), door locks and guest messaging. Usually: IT.', 'mixed: Don’t know yet → Find out');
  const s4 = after(m, '4. What makes it succeed');
  ok(s4[0].t === '4 in place · 1 planned · 3 gaps · 1 to find out', 'mixed: step 3 counts by hand ' + s4[0].t);
  ok(eq(s4.filter(b => b.k === 'item').map(b => b.id), C.FACTORS.map(x => x.id)), 'mixed: every step 3 item');
  const s5 = after(m, 'Start with these three');
  ok(s5[0].t === 'Close these before you talk to vendors.', 'mixed: overall line (b5 No, b9 Partly are must-haves)');
  ok(eq(s5.filter(b => b.k === 'num').map(b => b.t), L.weakest(A, 3).map(x => L.action(x.id, x.v).text)), 'mixed: the weakest three, as on the summary');
  ok(eq(L.weakest(A, 3).map(x => x.id), ['b5', 'b7', 'c3']), 'mixed: weakest three by hand (No first, tie order)');
  ok(s5.find(b => b.k === 'num').sub === 'Data protection paperwork · your answer: No · usually: GM / data protection contact', 'mixed: the line under each of the three');
  const s6 = after(m, 'Next step');
  ok(s6[0].t === 'Check one tool in detail in the Readiness check: “' + fo1.n + '”.', 'mixed: next step names the use case');
  const src = after(m, 'Sources').filter(b => b.k === 'src').map(b => b.t);
  ok(eq(src, C.SOURCES.q.concat(C.SOURCES.where, C.SOURCES.needs, C.SOURCES.success)), 'mixed: every opened source per step, as in "Where this comes from"');
  ok(eq(after(m, 'Sources').filter(b => b.k === 'label').map(b => b.t), ['Step 1, is this an AI problem?', 'Step 1, where in the hotel?', 'Step 2, what you need', 'Step 3, what makes it succeed']), 'mixed: sources grouped per step');
  ok(!/score|\/ ?100|\d+ ?%(?! of)/i.test(texts(m).replace(/\d+(\.\d+)?% of/g, '')), 'mixed: no score');
  const { r: d, log } = drawn(m);
  ok(d.pages >= 3 && d.footers.length === d.pages, 'mixed: drawn on ' + d.pages + ' pages, one footer each');
  ok(d.footers.every((f, i) => f === 'AI starting point · student prototype, not legal advice · page ' + (i + 1) + ' of ' + d.pages), 'mixed: footer wording and page n of N');
  noOverflow(log, 'mixed');
  ok(log.some(l => l.line.includes('›')) && log.some(l => l.line.includes('“')) && log.some(l => l.line.includes('Mélèzes')), 'mixed: ›, “ ” and accents reach the PDF unchanged');
}

// ---------- 2. All Yes ----------
{
  const r = rec({ Q: ALLY, cat: 'Commercial', dept: 'rm', use: 'rm-1', A: all('y') });
  const m = P.model(r, cat, { today: TODAY });
  ok(!B(m).some(b => b.k === 'meta' && /^Hotel:/.test(b.t)), 'all Yes: no hotel line when the profile has no name');
  ok(after(m, '1. Is this an AI problem?')[0].t === 'Worth exploring with AI.', 'all Yes: the summary’s verdict (no "Next: find where")');
  ok(after(m, '3. What you need')[0].t === '10 in place · 0 planned · 0 gaps · 0 to find out' && after(m, '4. What makes it succeed')[0].t === '9 in place · 0 planned · 0 gaps · 0 to find out', 'all Yes: counts');
  ok(heads(m).includes('In short') && !heads(m).some(h => /^Start with/.test(h)) && after(m, 'In short')[0].t === C.OVERALL.good, 'all Yes: no three to start with; overall line good');
  ok(B(m).filter(b => b.k === 'item').every(b => b.action === 'In place: nothing to do.'), 'all Yes: nothing to do anywhere');
  const { r: d, log } = drawn(m); noOverflow(log, 'all Yes'); ok(d.footers[d.pages - 1].endsWith('page ' + d.pages + ' of ' + d.pages), 'all Yes: last footer');
}

// ---------- 3. None of these fits; the "not a tool" use case; all Don't know ----------
{
  const r = rec({ Q: { q1: 'u', q2: 'n', q3: 'y', q4: 'y', q5: 'n' }, cat: 'Operational', use: 'none', A: all('k') });
  const m = P.model(r, cat, { today: TODAY });
  const s1 = after(m, '1. Is this an AI problem?');
  ok(s1[0].t === 'Probably not worth it.' && s1.some(b => b.t === 'What this means'), 'none: Q2 No verdict');
  ok(s1.some(b => b.k === 'p' && b.t.startsWith('If question 1 turns out to be No')), 'none: the Q1 "Not sure" line');
  ok(s1.some(b => b.k === 'li' && b.t === L.QBY.q1.short + ': ask the vendor or IT.'), 'none: Q1 to find out');
  const s2 = after(m, '2. Where it sits');
  ok(s2[0].t === 'Operational › None of these fits' && s2[1].t === L.noneLine(cat.nUses) && s2[1].t.includes('99 use cases'), 'none: path and the none line');
  ok(after(m, '3. What you need')[0].t === '0 in place · 0 planned · 0 gaps · 10 to find out', 'none: all to find out');
  ok(after(m, 'Start with these three')[0].t === C.OVERALL.find, 'none: overall "Find out these first."');
  ok(eq(after(m, 'Start with these three').filter(b => b.k === 'num').map(b => b.sub.split(' · ')[0]), [L.ITEM.b1.name, L.ITEM.b3.name, L.ITEM.b5.name]), 'none: weakest three by tie order');
  const s6 = after(m, 'Next step');
  ok(s6[0].t === 'Open the readiness check.' && s6[1].t.startsWith('No use case in the catalogue matches.') && s6[2].t === L.HANDOVER_NOTE, 'none: next step opens the readiness check (v1.2: was "why it cannot run yet")');
  const r2 = rec({ Q: ALLY, cat: 'Administrative', dept: 'lg', use: 'lg-4', A: Object.assign(all('y'), { c4: 'pl' }) });
  const m2 = P.model(r2, cat, { today: TODAY });
  ok(after(m2, 'Next step')[1].t.includes('is a document, not an AI tool'), 'lg-4: next step explains it is not a tool');
  ok(heads(m2).includes('Start with this one') && L.firstLabel(2) === 'Start with these two' && L.firstLabel(3) === 'Start with these three', 'lg-4: one weak point → "Start with this one"');
  ok(after(m2, '4. What makes it succeed').find(b => b.id === 'c4').answer === 'Your answer: Planned, not done yet', 'lg-4: planned without a date');
  noOverflow(drawn(m2).log, 'lg-4');
}

// ---------- 4. Stop version (Q1 No) ----------
{
  for (const [Q, tag] of [[{ q1: 'n' }, 'only Q1'], [{ q1: 'n', q2: 'y', q3: 'u', q4: 'n', q5: 'y' }, 'all five']]) {
    const r = Object.assign(F.blank(), { step: 'stop', Q });
    const m = P.model(r, cat, { hotel: 'Grand Hotel Zürich', today: TODAY });
    ok(m.stop === true, 'stop ' + tag + ': stop version');
    ok(eq(heads(m), ['This is not suitable for AI.']), 'stop ' + tag + ': one heading, no other sections');
    ok(B(m).some(b => b.t === C.STOP.why) && B(m).some(b => b.k === 'lead' && b.t === C.STOP.instead), 'stop ' + tag + ': why and the instead line');
    ok(B(m).some(b => b.t === 'Because you answered No to: “' + L.QBY.q1.q + '”'), 'stop ' + tag + ': because line as on screen');
    const qs = B(m).filter(b => b.k === 'q');
    ok(qs.length === 5 && qs[0].a === 'Your answer: No', 'stop ' + tag + ': the five answers');
    if (tag === 'only Q1') ok(qs.slice(1).every(b => b.a === 'Your answer: Not answered'), 'stop: unanswered questions say so');
    else ok(eq(qs.map(b => b.a.replace('Your answer: ', '')), ['No', 'Yes', 'Not sure', 'No', 'Yes']), 'stop: answers as given');
    ok(B(m)[1].t === 'Hotel: Grand Hotel Zürich', 'stop ' + tag + ': hotel line');
    const { r: d, log } = drawn(m);
    ok(d.pages === 1 && eq(d.footers, ['AI starting point · student prototype, not legal advice · page 1 of 1']), 'stop ' + tag + ': exactly one page with its footer');
    noOverflow(log, 'stop ' + tag);
  }
}

// ---------- 5. Many answer sets: the PDF says what the summary says ----------
{
  let seed = 7; const rnd = n => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
  const QV = ['y', 'n', 'u'], AV = ['y', 'pl', 'p', 'n', 'k'], uses = cat.depts.flatMap(d => d.uses.map(u => [d, u]));
  let pagesSeen = new Set(), checked = 0;
  for (let i = 0; i < 160; i++) {
    const Q = Object.fromEntries(L.QIDS.map(id => [id, i % 9 === 0 && id === 'q1' ? 'n' : QV[rnd(3)]]));
    if (Q.q1 === 'n' && i % 9 !== 0) Q.q1 = 'y';
    const A = Object.fromEntries(L.NEED_IDS.concat(L.FACTOR_IDS).map(id => [id, AV[rnd(5)]]));
    const By = Object.fromEntries(Object.keys(A).filter(id => A[id] === 'pl' && rnd(2)).map(id => [id, '2027-0' + (1 + rnd(9)) + '-1' + rnd(10)]));
    const [d, u] = uses[rnd(uses.length)], none = rnd(8) === 0;
    const r = rec({ Q, A, By, cat: d.cat, dept: none ? '' : d.id, use: none ? 'none' : u.id });
    const m = P.model(r, cat, { today: TODAY }), v = L.verdict(Q);
    if (v.stop) { ok(m.stop && heads(m).length === 1, 'random ' + i + ': stop version'); continue; }
    checked++;
    ok(after(m, '1. Is this an AI problem?')[0].t === L.verdictText(v, true).head, 'random ' + i + ': verdict = summary');
    ok(after(m, '3. What you need')[0].t === L.countLine(L.counts(A, L.NEED_IDS)) && after(m, '4. What makes it succeed')[0].t === L.countLine(L.counts(A, L.FACTOR_IDS)), 'random ' + i + ': counts = summary');
    const c = L.counts(A, L.NEED_IDS); ok(c.inPlace + c.planned + c.gaps + c.find === 10, 'random ' + i + ': counts add up');
    const top = L.weakest(A, 3), h = top.length ? L.firstLabel(top.length) : 'In short';
    ok(after(m, h)[0].t === L.overall(A).text && eq(after(m, h).filter(b => b.k === 'num').map(b => b.t), top.map(x => L.action(x.id, x.v, By[x.id], r).text)), 'random ' + i + ': overall and three = summary');
    const its = B(m).filter(b => b.k === 'item');
    ok(its.length === 19 && its.every(b => (A[b.id] === 'y') === (b.action === 'In place: nothing to do.')), 'random ' + i + ': 19 items, action iff not Yes');
    ok(its.every(b => !!(A[b.id] === 'pl' && By[b.id]) === / \(planned by \d{1,2} [A-Z][a-z]{2} 2027\)$/.test(b.answer)), 'random ' + i + ': planned-by iff a date');
    if (i % 8 === 1) { const { r: dd, log } = drawn(m); pagesSeen.add(dd.pages); noOverflow(log, 'random ' + i); ok(dd.footers.every((f, k) => f.endsWith('page ' + (k + 1) + ' of ' + dd.pages)), 'random ' + i + ': footers'); }
  }
  ok(checked > 100, 'random: over 100 full versions checked (' + checked + ')');
}

// ---------- 6. File names ----------
for (const [hotel, want] of [['', 'AI-starting-point_assessment_2026-11-23.pdf'], [null, 'AI-starting-point_assessment_2026-11-23.pdf'],
  ['Hôtel Les Mélèzes', 'AI-starting-point_Hotel-Les-Melezes_2026-11-23.pdf'], ['Grand Hotel Zürich', 'AI-starting-point_Grand-Hotel-Zurich_2026-11-23.pdf'],
  ['Ørsted Strand & Spa', 'AI-starting-point_Orsted-Strand-Spa_2026-11-23.pdf'], ['Hotel Łucja', 'AI-starting-point_Hotel-Lucja_2026-11-23.pdf'],
  ['../../etc/passwd', 'AI-starting-point_etc-passwd_2026-11-23.pdf'], ['a/b\\c:d*e?f"g<h>i|j', 'AI-starting-point_a-b-c-d-e-f-g-h-i-j_2026-11-23.pdf'],
  ['東京ホテル', 'AI-starting-point_assessment_2026-11-23.pdf'], ['   --- ', 'AI-starting-point_assessment_2026-11-23.pdf'], ['Straße 5', 'AI-starting-point_Strasse-5_2026-11-23.pdf']]) {
  const n = P.fileName(hotel, TODAY);
  ok(n === want, 'file name for ' + JSON.stringify(hotel) + ': ' + n);
}
{
  const n = P.fileName('A very long hotel name '.repeat(10), TODAY);
  ok(/^AI-starting-point_[A-Za-z0-9-]{1,60}_2026-11-23\.pdf$/.test(n) && !/-_/.test(n), 'file name: long names cut to 60 safe characters ' + n);
  ok(/^AI-starting-point_assessment_\d{4}-\d{2}-\d{2}\.pdf$/.test(P.fileName('', 'not a date')), 'file name: a bad date falls back to today');
  ok(P.safe('Tōkyō 東京 › “x” €') === 'Tōkyō ?? › “x” €', 'PDF text: characters the font lacks print as ?');
}

// ---------- 7. BRIDGE machine (same table as the readiness check's) ----------
{
  const BS = ['none', 'pending', 'yes', 'no'], BE = ['yes', 'no', 'timeout', 'error', 'other'];
  const want = { 'pending:yes': 'yes', 'pending:no': 'no', 'pending:timeout': 'no', 'pending:error': 'no' };
  BS.forEach(s => BE.forEach(e => ok(F.bridgeNext(s, e) === (want[s + ':' + e] || s), 'bridge ' + s + ' --' + e + '--> ' + F.bridgeNext(s, e))));
  const rc = readFileSync(join(root, '../readiness-check/src/flow.js'), 'utf8').match(/var BRIDGE = (\{[^\n]*\});/)[1];
  ok(eq(new Function('return ' + rc)(), F.BRIDGE), 'bridge: the same table as the readiness check');
}

// ---------- 8. DOWNLOAD machine ----------
{
  const S = ['idle', 'making', 'waiting', 'saving'], E = ['start', 'made', 'bridge', 'done', 'fail', 'nav'], BR = ['none', 'pending', 'yes', 'no'];
  const want = (s, e, b) => ({
    'idle:start': 'making', 'making:made': b === 'pending' ? 'waiting' : 'saving', 'making:fail': 'idle',
    'waiting:bridge': b === 'pending' ? null : 'saving', 'waiting:fail': 'idle', 'saving:done': 'idle', 'saving:fail': 'idle'
  })[s + ':' + e] ?? null;
  S.forEach(s => E.forEach(e => BR.forEach(b => ok(F.dlNext(s, e, b) === want(s, e, b), 'download ' + s + ' --' + e + '/' + b + '--> ' + F.dlNext(s, e, b)))));
  ok(S.filter(s => s !== 'idle').every(s => F.dlNext(s, 'start', 'yes') === null), 'download: a second start is refused in every busy state (one in flight)');
  // every walk from idle returns to idle and never holds two downloads
  let seed = 3; const rnd = n => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
  let stuck = 0, starts = 0;
  for (let w = 0; w < 3000; w++) {
    let s = 'idle', b = ['none', 'pending', 'yes', 'no'][rnd(4)], inFlight = 0;
    for (let k = 0; k < 12; k++) {
      const e = E[rnd(E.length)]; if (b === 'pending' && rnd(3) === 0) b = rnd(2) ? 'yes' : 'no';
      const to = F.dlNext(s, e, b); if (to === null) continue;
      if (e === 'start') { inFlight++; starts++; } if (to === 'idle') inFlight = 0;
      if (inFlight > 1) stuck++; s = to;
    }
    // the page always ends a download with done or fail
    for (const e of ['bridge', 'done', 'fail']) { const to = F.dlNext(s, e, 'yes'); if (to) s = to; }
    if (s !== 'idle') stuck++;
  }
  ok(stuck === 0 && starts > 1000, 'download: 3,000 random walks, never two in flight, always back to idle (' + starts + ' starts)');
}

// ---------- 9. The built page carries the PDF pieces and loads nothing for them ----------
{
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  ok(html.includes('id="r2-font"') && /jsPDF/.test(html) && html.includes('R2Pdf'), 'index.html inlines jsPDF, the font and src/pdf.js');
  ok(!/<script[^>]+src=/i.test(html.replace(/<script src="'\+o\+'"/, '')), 'index.html has no external script tag (apart from the string inside jsPDF below)');
  // jsPDF's own code names one CDN, only for output('pdfobjectnewwindow'), which this page never calls
  ok((html.match(/cdnjs|unpkg|jsdelivr/g) || []).length === 1 && html.includes('pdfobject/2.1.1/pdfobject.min.js') && !/pdfobjectnewwindow/.test(readFileSync(join(root, 'src/app.js'), 'utf8') + readFileSync(join(root, 'src/pdf.js'), 'utf8')), 'no CDN is used for the PDF (the one inside jsPDF is for a viewer mode this page never calls)');
  const f = JSON.parse(html.match(/<script type="application\/json" id="r2-font">([\s\S]*?)<\/script>/)[1]);
  ok(f.regular === font.regular && f.bold === font.bold, 'the inlined font is the register’s Register Sans subset');
}
done();
