// v2.8.2 (owner, 26 Nov 2026): both PDFs of every use case with all Yes, all No, all Don't know yet and all Planned, and the stop PDF,
// drawn with the real jsPDF and font (every line spied): no listed word, the disclaimer once at the end, page footers without it,
// "Define success first." and "Ask an adviser before a pilot" at most once, no "Held back", version 2.8.2, the sensitive cap,
// a No in step 2 always in the verdict box, sources in one format with a short link label. Also the source removals (below 7).
// Run: R2_HTML=public/index.html node tools/readiness-2-questions/tests/v282.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { root, load, data, tester, finished } from './load.mjs';
const { C, L, F, P } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('v282');
const env = { cat: D.cat, TQ, today: '2026-11-26', detail: D.detail };
const jctx = { atob, btoa, console, TextEncoder, TextDecoder }; jctx.self = jctx; jctx.globalThis = jctx;
vm.runInNewContext(readFileSync(join(root, '../assessment/lib/jspdf.umd.min.js'), 'utf8'), jctx);
const font = { regular: readFileSync(join(root, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(root, '../register/fonts/rs-bold.ttf')).toString('base64') };
function draw(m) {
  const log = [], links = [];
  const r = P.draw(m, { jsPDF: function (o) { const d = new jctx.jspdf.jsPDF(o), t = d.text.bind(d), tl = d.textWithLink.bind(d);
    d.text = function (s, x, y, opt) { (Array.isArray(s) ? s : [s]).forEach(line => log.push(line)); return t(s, x, y, opt); };
    d.textWithLink = function (s, x, y, opt) { links.push({ s, url: opt.url }); return tl(s, x, y, opt); };
    return d; } }, font);
  return { text: log.join('\n'), lines: log, links, r };
}
const DISC = C.DISCLAIMER;
const WORDS = ['AI Act', 'GDPR', 'high-risk', 'consent', 'regulator', 'compliance', 'retention', 'DPIA', 'ISO', 'legal', 'law', 'extra rules', 'Held back', 'abstract only'];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RE = new RegExp('(?<![A-Za-z0-9_])(' + WORDS.map(esc).join('|') + ')(?![A-Za-z0-9_])', 'gi');
const hits = t => (String(t).split(DISC).join(' ').match(RE) || []);
const count = (t, s) => t.split(s).length - 1;
const grading = /score \d+\/10|\d+\/10\b|below (the )?credibility|credibility bar|abstract only/i;
const SENS = Object.keys(TQ.uses).filter(k => TQ.uses[k].sensitive);
const sets = { yes: ['y', 'y', 'y'], no: ['n', 'n', 'n'], dk: ['u', 'k', 'k'], pl: ['pl', 'pl', 'pl'] };
const srcHits = new Set();
let docs = 0;
for (const d of D.cat.depts) for (const u of d.uses) for (const [k, s] of Object.entries(sets)) {
  const r = finished(F, D, u.id, { id: 'p' + u.id + k }); r.hotel.name = 'Hotel Spoonbill';
  r.Q = { q1: k === 'dk' ? 'u' : 'n', q2: s[0], q3: s[0], q4: s[0], q5: s[0] };
  F.MUST_IDS.forEach(id => { r.A[id] = s[1]; }); TQ.uses[u.id].qs.forEach(q => { r.T[q.id] = s[2]; });
  const tag = u.id + ':' + k, m = L.resultModel(r, env);
  if (SENS.includes(u.id)) ok(m.level !== 'ready', tag + ': sensitive never above Almost ready (' + m.level + ')');
  if (k === 'no') ok(/Step 2 suggests this may not be worth doing with AI \(Return: No/.test(m.boxLine), tag + ': a No in step 2 in the verdict box');
  ok(!(m.ev.pct === 100 && !m.boxLine && m.ev.carried.length), tag + ': never 100% with an empty box while step 2 has a No');
  for (const kind of ['result', 'answers']) {
    const pm = P.model(r, env, kind), dr = draw(pm); docs++;
    const t = dr.text;
    // sources are the catalogue's text: their hits are listed apart, not counted as tool text
    const srcTxt = pm.blocks.filter(b => b.k === 'src').map(b => b.t).join('\n');
    hits(srcTxt).forEach(h => srcHits.add(u.id + ': ' + h));
    const own = t.split(srcTxt).join(' ');
    const toolT = pm.blocks.filter(b => b.k !== 'src').map(b => [b.t, b.a, b.m, b.name, b.check, b.answer, b.sub, b.box, b.also, b.val].filter(Boolean).join(' ')).join('\n');
    ok(!hits(toolT).length, tag + ' ' + kind + ' PDF: no listed word in the tool text (' + hits(toolT).slice(0, 3).join(', ') + ')');
    ok(count(t.replace(/\s+/g, ' '), DISC) === 1 && pm.blocks[pm.blocks.length - 1].t === DISC, tag + ' ' + kind + ' PDF: the disclaimer once, at the end (' + count(t.replace(/\s+/g, ' '), DISC) + ')');
    ok(dr.r.footers.every(f => /^page \d+ of \d+$/.test(f)), tag + ' ' + kind + ' PDF: footers are page numbers only');
    ok(count(toolT, 'Define success first.') <= 1, tag + ' ' + kind + ' PDF: "Define success first." at most once (' + count(toolT, 'Define success first.') + ')');
    ok(count(toolT, 'Ask an adviser before a pilot') === (SENS.includes(u.id) ? 1 : 0), tag + ' ' + kind + ' PDF: adviser line once for a sensitive use case (' + count(toolT, 'Ask an adviser before a pilot') + ')');
    ok(!/held back/i.test(t), tag + ' ' + kind + ' PDF: no "Held back"');
    ok(!grading.test(t), tag + ' ' + kind + ' PDF: no internal grading');
    ok(/v2\.8\.2/.test(t), tag + ' ' + kind + ' PDF: version 2.8.2');
    ok(!/Not sure|Planned, not done yet/.test(toolT), tag + ' ' + kind + ' PDF: old answer words gone');
    if (kind === 'result' && k === 'yes') {
      const srcB = pm.blocks.filter(b => b.k === 'src');
      ok(srcB.every(b => !b.url || (b.label && b.label.length <= 60)) && dr.links.length === srcB.filter(b => b.url).length, tag + ': every source has one short link label in the PDF');
    }
  }
}
// each step-2 question at No on its own (council: "Define success first." twice when only Proof is No), on a plain and a sensitive use case
for (const use of ['fo-1', 'hr-2']) for (const q of ['q2', 'q3', 'q4', 'q5']) for (const extra of [{}, { q3: 'pl' }, { q4: 'u' }]) {
  const r = finished(F, D, use, { id: 's' + use + q }); r.Q = Object.assign({ q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }, extra, { [q]: 'n' });
  const m = L.resultModel(r, env), t = [m.ai.head, m.answers.map(a => a.line).join(' '), m.reasonShown, m.boxLine, m.flag, m.first.map(f => f.text).join(' '), m.people.map(p => p.items.map(i => i.text).join(' ')).join(' ')].join(' \n ');
  const tag = use + ' ' + q + ' No ' + JSON.stringify(extra);
  ok(count(t, 'Define success first.') <= 1, tag + ': "Define success first." at most once on the page (' + count(t, 'Define success first.') + ')');
  ok(count(t, 'Ask an adviser before a pilot') === (use === 'hr-2' ? 1 : 0), tag + ': adviser line once only for a sensitive use case');
  ok(/Step 2 suggests this may not be worth doing with AI \(/.test(m.boxLine) && !/held back/i.test(t), tag + ': the step-2 line in the verdict box, no "Held back"');
  if (extra.q3 === 'pl' && q !== 'q3') ok(/Planned/.test(m.boxLine) && !/Don’t know yet/.test(m.boxLine) || m.level !== 'almost', tag + ': a Planned-only hold says Planned');
  for (const kind of ['result', 'answers']) { const pt = P.model(r, env, kind).blocks.filter(b => b.k !== 'src').map(b => [b.t, b.m, b.box, b.also, b.sub].filter(Boolean).join(' ')).join(' '); ok(count(pt, 'Define success first.') <= 1, tag + ' ' + kind + ' PDF: "Define success first." at most once'); }
}
// the stop PDF
const st = finished(F, D, 'fo-1', { id: 'pstop' }); st.Q = { q1: 'y' }; st.step = 'stop';
const sm = P.model(st, env), sd = draw(sm);
ok(sm.stop && sm.blocks[sm.blocks.length - 1].t === DISC && count(sd.text.replace(/\s+/g, ' '), DISC) === 1, 'stop PDF: the disclaimer once, at the end');
ok(!hits(sd.text).length && !/held back/i.test(sd.text), 'stop PDF: no listed word');
// the removed sources (owner: below 7) are not in the page
const html = readFileSync(join(root, process.env.R2_HTML || 'index.html'), 'utf8');
['wnwmanagement.com/blog/wnw-partners-with-hotelpilot', 'legora.com/customers/accor', 'stayflexi.com/agents/night-auditor', 'otelier.io/press/stonebridge', 'hs.ethoca.com', 'flywire.com/news/new-flywire-research', 'ahla.com/news/new-ahla-report-says-ai', 'aethos-london-shoreditch'].forEach(u => ok(!html.includes(u), 'removed source not in the page: ' + u));
ok(!/score \d+\/10|abstract only/.test(html.match(/id="r2-data">([\s\S]*?)<\/script>/)[1]), 'the page data carries no review score or "abstract only"');
console.log('documents drawn:', docs + 1, '· source entries carrying a listed word (catalogue text, shown as given):', [...srcHits]);
done();
