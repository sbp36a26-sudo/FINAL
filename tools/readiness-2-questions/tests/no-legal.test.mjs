// v2.7.0 (owner, 25 Nov 2026): the tool contains no legal content (prompt §4.4 and §7 test 5).
// Searches, case-insensitive and on whole words, for the owner's banned terms in:
//   1. the built index.html (everything: markup, inlined scripts and their comments, the data block, the font block);
//   2. the text of generated PDFs: every line drawn by jsPDF (spied) for the Result and the Answers PDF of many checks, the stop PDF,
//      and every page footer;
//   3. a saved file (the "Save as file" JSON, as fileDoc builds it) and the exported plan text (the "Copy for …" lists, vendor list).
// Allowed: only the disclaimer and the sensitive-area flag (the data file's fixed_texts). Excluded, with reason: inside jsPDF, the
// paper-size table entries `legal:[612,1008],"junior-legal":[576,360]` (code: US paper sizes, never shown), twice in the minified file.
// Also: no EU AI Act section on the result page or in the PDF; the disclaimer on the cover, the result and every PDF footer;
// the sensitive flag only for the 12 sensitive use cases.
// Run: node tools/readiness-2-questions/tests/no-legal.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { root, load, data, tester, finished } from './load.mjs';
const { C, L, F, P } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('no-legal');
const rd = p => readFileSync(join(root, p), 'utf8');
const Q = JSON.parse(rd('data/usecase_questions_only.json')), FX = Q.fixed_texts;
export const BANNED = ['AI Act', 'Article', 'Art.', 'Annex', 'high-risk', 'transparency obligation', 'prohibited', 'DPIA', 'GDPR', 'FADP', 'CE mark', 'works council', 'PCI', 'consent', 'legal basis', 'law', 'laws', 'regulation', 'compliance', 'legal', 'not legal advice'];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RE = () => new RegExp('(?<![A-Za-z0-9_])(' + BANNED.map(esc).join('|') + ')(?![A-Za-z0-9_])', 'gi'); // whole words ("Art." ends in a dot)
const ALLOWED = [FX.disclaimer, FX.sensitive_flag];
const JSPDF_SPAN = 'legal:[612,1008],"junior-legal":[576,360]';
function hits(text, opt) {
  let t = String(text);
  ALLOWED.forEach(a => { t = t.split(a).join(' '); });
  if (opt && opt.jspdf) t = t.split(JSPDF_SPAN).join(' ');
  const out = [], re = RE(); let m;
  while ((m = re.exec(t))) out.push(m[0] + ' … ' + t.slice(Math.max(0, m.index - 50), m.index + 30).replace(/\s+/g, ' '));
  return out;
}

// ---------- the fixed texts are the data file's ----------
ok(C.DISCLAIMER === FX.disclaimer && C.SENSITIVE_FLAG === FX.sensitive_flag && C.SENSITIVE_HOLD === FX.sensitive_hold_reason, 'disclaimer, sensitive flag and hold reason are the data file\'s fixed_texts, verbatim');
ok(L.MUST.m5.name === FX.must_have_5.title && L.MUST.m5.q === FX.must_have_5.text && F.MUST_IDS[4] === 'm5', 'must-have 5: title and text from fixed_texts, id m5 kept');
ok(hits(JSON.stringify(L.MUST.m5)).length === 0, 'must-have 5 carries no banned term in any of its help texts');

// ---------- 1. the built page ----------
const html = rd('index.html');
ok(html.split(JSPDF_SPAN).length - 1 === 2 && rd('../assessment/lib/jspdf.umd.min.js').split(JSPDF_SPAN).length - 1 === 2, 'the excluded jsPDF span occurs exactly twice, both inside jsPDF');
const h1 = hits(html, { jspdf: true });
ok(h1.length === 0, 'built index.html: 0 hits (' + h1.length + '): ' + h1.slice(0, 5).join(' | '));
ok(html.split(FX.disclaimer).length - 1 >= 2, 'the disclaimer is in the page (content and footer)');
ok(!/EU AI Act|AI Register|AI Act guide/i.test(html), 'no AI Act section, AI Register or AI Act guide anywhere in the page');
const noLib = html.replace(/<script>\s*\/\*\* @license[\s\S]*?<\/script>/, '');
ok(noLib.length < html.length - 100000 && !/https?:\/\/fonts\.|<link[^>]+stylesheet|<script[^>]+src=/i.test(noLib), 'no external font, stylesheet or script (outside the jsPDF library text)');

// ---------- 2. the PDFs ----------
const jctx = { atob, btoa, console, TextEncoder, TextDecoder }; jctx.self = jctx; jctx.globalThis = jctx;
vm.runInNewContext(rd('../assessment/lib/jspdf.umd.min.js'), jctx);
const font = { regular: readFileSync(join(root, '../register/fonts/rs-regular.ttf')).toString('base64'), bold: readFileSync(join(root, '../register/fonts/rs-bold.ttf')).toString('base64') };
function drawnText(m) {
  const log = [];
  const spy = { jsPDF: function (o) { const d = new jctx.jspdf.jsPDF(o), t = d.text.bind(d); d.text = function (s, x, y, op) { (Array.isArray(s) ? s : [s]).forEach(l => log.push(l)); return t(s, x, y, op); }; return d; } };
  const r = P.draw(m, spy, font);
  return { text: log.join('\n'), footers: r.footers, pages: r.pages };
}
const env = { cat: D.cat, TQ, ex: D.ex, today: '2026-11-25' };
const mix = (use, k) => { const r = finished(F, D, use); const w = ['y', 'pl', 'n', 'k']; F.MUST_IDS.forEach((id, i) => { r.A[id] = w[(i + k) % 4]; }); if (use !== 'none') TQ.uses[use].qs.forEach((q, i) => { r.T[q.id] = w[(i + k + 1) % 4]; }); r.Q.q3 = k % 2 ? 'u' : 'y'; return r; };
let pdfHits = 0, pdfs = 0, footOk = 0, footN = 0;
const uses = Object.keys(TQ.uses);
uses.forEach((use, i) => {
  for (const rec of [finished(F, D, use), mix(use, i)]) for (const kind of ['result', 'answers']) {
    const m = P.model(rec, env, kind), d = drawnText(m), h = hits(d.text + '\n' + d.footers.join('\n'));
    pdfs++; if (h.length) { pdfHits += h.length; console.log('PDF hit', use, kind, h[0]); }
    d.footers.forEach(f => { footN++; if (f.startsWith(FX.disclaimer)) footOk++; });
    if (kind === 'result') ok(!m.blocks.some(b => /AI Act|provisional label/i.test(b.t || '')), use + ': no AI Act section in the result PDF');
  }
});
const stop = finished(F, D, 'gx-2'); stop.Q.q1 = 'y'; stop.step = 'stop';
{ const d = drawnText(P.model(stop, env)); pdfs++; pdfHits += hits(d.text + d.footers.join('\n')).length; d.footers.forEach(f => { footN++; if (f.startsWith(FX.disclaimer)) footOk++; }); }
ok(pdfHits === 0, 'PDF text: 0 hits over ' + pdfs + ' PDFs (every use case, Result and Answers, all-Yes and mixed answers, the stop PDF)');
ok(footOk === footN && footN > pdfs, 'every page footer of every PDF starts with the disclaimer (' + footOk + ' of ' + footN + ')');

// ---------- 3. a saved file and the exported plan ----------
let fileHits = 0, planHits = 0;
uses.forEach((use, i) => {
  const rec = mix(use, i);
  const doc = { kind: 'hftp-do-you-need-ai', v: F.V, rules: L.RULES, savedAt: '2026-11-25T10:00:00.000Z', check: F.forFile(rec) }; // the shape of app.js fileDoc()
  fileHits += hits(JSON.stringify(doc, null, 1)).length;
  const m = L.resultModel(rec, env);
  const plan = m.people.map(p => L.personText(m, p, '· ' + m.useName)).join('\n\n') + '\n' + m.vendor.join('\n');
  planHits += hits(plan).length;
});
ok(fileHits === 0, 'saved files: 0 hits over 99 use cases');
ok(planHits === 0, 'exported plan and vendor texts: 0 hits over 99 use cases');

// ---------- the result page ----------
const SENS = Q.use_cases.filter(u => u.sensitive).map(u => u.id).sort();
ok(SENS.length === 12, '12 sensitive use cases in the data');
uses.forEach(use => {
  const m = L.resultModel(finished(F, D, use), env);
  ok(!('legal' in m) && !('legalNote' in m) && !('law' in m), use + ': the result model has no legal block');
  ok((m.flag === FX.sensitive_flag) === SENS.includes(use) && m.disclaimer === FX.disclaimer, use + ': sensitive flag only where the data says, disclaimer always');
});
const app = rd('src/app.js');
ok(/id="cover-disclaimer"/.test(app) && /id="result-disclaimer"/.test(app) && /id="foot-disclaimer"/.test(rd('src/page.html')), 'the disclaimer is drawn on the cover, on the result and in the page footer');
ok(!/m\.legal|EU AI Act|to-register/.test(app), 'app.js draws no AI Act fold and no AI Register link');
done();
