// v2.8.0: the sources (prompt Part 1 §5 and §6.6, Part 2; owner decisions 2 and 4 of 25 Nov 2026).
//   Part 1: sources_fixes.json applied (removals, replacements, additions, text edits, step 1-3 addresses), the named removals, me-6's line.
//   Part 2: use_case_sources_corrected.json appended word for word, sorted 7+ direct / 7+ partial / rest, labels, "Partial", the thin line,
//           the broken links it replaces removed, counts in the UI equal the JSON.
// Run: node tools/readiness-2-questions/tests/sources.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, data, tester, finished, PAGE } from './load.mjs';
import { sourcesModel, shipDetail } from '../build.mjs';
const { C, L, F, P } = load();
const D = data(), TQ = D.tq;
const { ok, done } = tester('sources');
const rd = p => readFileSync(join(root, p), 'utf8');
const FIX = JSON.parse(rd('data/sources_fixes.json')), V2 = JSON.parse(rd('data/use_case_sources_v2.json')).use_cases, EDITS = JSON.parse(rd('data/sources_edits.json'));
const html = rd(PAGE), app = rd('src/app.js');
ok(rd('data/sources_fixes.json') === rd('spec/review/sources_fixes.json') && rd('data/use_case_sources_v2.json') === rd('spec/review/use_case_sources_corrected.json'), 'the inputs are the review files, unchanged (copied next to the tool\'s data)');
const USES = D.cat.depts.flatMap(d => d.uses), ids = USES.map(u => u.id);
const dd = id => L.detailData(D, USES.find(u => u.id === id), null, TQ);
/* v2.8.2: the full model the build works from (with the review's score and fit); the page ships shipDetail(DET) */
const DET = sourcesModel(rd('../use-case-catalogue/index.html'), D.cat.removed, FIX, EDITS, JSON.parse(rd('data/use_case_sources_v2.json')), JSON.parse(rd('data/source_scores_v27.json')));
const LOW = DET.removedLow;

// ---------- Part 1 ----------
/* a removed source is not shown: matched by use case, address and (where two entries share an address) its name */
let removed = 0, still = [];
FIX.filter(f => ['remove', 'replace'].includes(f.action) && f.use_case !== 'lg-2').forEach(f => {
  removed++;
  const name = f.source.replace(/^\(repeat\) /, '').split(':')[0].replace(/^Hotel /, '');
  const left = D.detail[f.use_case].srcs.filter(e => e.k === 'cat' && e.u === f.url && (e.n.startsWith(name) || name.startsWith(e.n)));
  if (left.length) still.push(f.use_case + ' ' + f.url);
});
ok(removed === 19 && !still.length, 'no source marked remove (or replaced) in sources_fixes.json is shown (' + removed + '): ' + still.join(' | '));
ok(!D.detail['lg-2'] && !ids.includes('lg-2'), 'lg-2 (and its OneTrust source) is gone with the use case');
ok(D.detail['fo-7'].srcs.filter(e => /retailcustomerexperience\.com\/news\/israeli-hotel-group/.test(e.u)).length === 1, 'fo-7: the duplicate EyeFeelIt entry is gone (one entry for that address left)');
ok(!D.detail['hk-4'].srcs.some(e => /smok|Minut|restsensor|hellowynd|Points Guy|abc15|abc7ny|checkbook/i.test([e.n, e.o, e.x, e.u].join(' '))) && !html.includes('see the Minut entry below'), 'hk-4: the 8 smoking-fee and smoking-sensor sources and the dangling "see the Minut entry below" are gone');
ok(!D.detail['hr-6'].srcs.some(e => /ico\.org\.uk/.test(e.u)) && !D.detail['it-4'].srcs.some(e => /iso-20380|genorma/.test(e.u)) && !D.detail['kc-1'].srcs.some(e => /kitro-accelerates/.test(e.u)), 'the ICO order (hr-6), ISO 20380 (it-4) and the KITRO "regulatory push" item (kc-1) are removed');
const added = FIX.filter(f => f.action === 'add' && f.url);
ok(added.every(f => D.detail[f.use_case].srcs.some(e => e.u === f.url) || LOW.some(x => x.use === f.use_case && x.url === f.url)), 'every add (fa-6, lg-3, it-5) is there, by its address, unless its audited entry scored below 7 (v2.8.2, owner: not shown)');
ok(EDITS.edits.every(e => e.remove ? !D.detail[e.use].srcs.some(x => x.u === e.url && x.k === 'cat') : e.copyTo ? D.detail[e.copyTo].srcs.some(x => x.u === e.url) : D.detail[e.use].srcs.some(x => x.u === ((e.set && e.set.url) || e.url) && (!e.set || !e.set.note || x.o === e.set.note) && (!e.set || !e.set.name || x.n === e.set.name))), 'every edit_text item is applied as data/sources_edits.json says (' + EDITS.edits.length + ')');
ok(!/PDF not re-opened in the audit|to confirm against the ISO text|Later that day question 1/.test(html), 'the internal notes are gone ("PDF not re-opened", "to confirm against the ISO text", "Later that day …")');
ok(!/14 EU allergens/.test(html) && D.detail['kc-2'].srcs.some(e => e.o === 'AI detects common allergens from the menu text, without recipes'), 'kc-2: "common allergens"');
ok(dd('me-6').srcNote === 'No hotel example found; included because vendors offer it.' && L.sourcesBox(dd('me-6'), 'me-6').includes('No hotel example found; included because vendors offer it.'), 'me-6: the line "No hotel example found; included because vendors offer it."');
ok(D.detail['pr-3'].srcs.some(e => /phacetlabs\.com\/customers\/astotel/.test(e.u)), 'pr-3: Phacet/Astotel also listed under invoice checking');
// steps 1 to 3: every citation with its checked address
const urls = FIX.filter(f => f.action === 'add_url').map(f => f.url);
const stepUrls = C.SOURCES.q.map(x => x[1]).concat(C.SOURCES.must.filter(Array.isArray).map(x => x[1]), C.MUSTS.flatMap(m => m.ev.map(e => e[2])), [C.EUROSTAT_URL]);
ok(urls.every(u => stepUrls.includes(u) || u === 'https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ain2/default/table?lang=en'), 'every add_url address is used in steps 1 to 3 (' + new Set(urls).size + ' addresses)');
ok(C.MUSTS.every(m => m.ev.every(e => /^https:\/\//.test(e[2]))) && C.SOURCES.q.every(x => /^https:\/\//.test(x[1])), 'every evidence line and step-2 citation has a link');
ok(/function linkHtml\(url\) \{ return \/\^https:/.test(app) && /target="_blank" rel="noopener" title="' \+ esc\(url\) \+ '">' \+ esc\(L\.shortLink\(url\)\) \+ '<\/a>'/.test(app) && !/srcurl" hidden/.test(app), 'v2.8.2 (owner): the step citations are one clickable link (new tab) with a short label, no hidden address');
ok(!C.MUSTS.find(m => m.id === 'm8').ev.some(e => /70%/.test(e[0])) && C.MUSTS.find(m => m.id === 'm9').ev[0][0] === 'Only 9% of hotels surveyed had a formal AI strategy, a sign that written AI rules are rare too.' && /manufacturing and ICT firms, not hotels/.test(C.MUSTS.find(m => m.id === 'm3').ev[0][1]) && /concerns about personal data\.$/.test(C.MUSTS.find(m => m.id === 'm5').ev[0][0]), 'MH8 without the 70% line; MH9, MH3 and MH5 reworded');
// every URL in the built file starts with https (the jsPDF library aside)
const LIB = rd('../assessment/lib/jspdf.umd.min.js').replace(/<\/script/gi, '<\\/script');
const page = html.split(LIB).join(' ');
const allUrls = (page.match(/https?:\/\/[^\s"'<>\\)]+/g) || []);
ok(allUrls.length > 500 && allUrls.every(u => u.startsWith('https://')), 'every URL in the built file starts with https (' + allUrls.length + '): ' + allUrls.filter(u => !u.startsWith('https://')).slice(0, 3).join(' '));
// no empty source box
ok(ids.every(id => dd(id).srcs.length > 0), 'no use case shows an empty source box (fa-6 ' + dd('fa-6').srcs.length + ', lg-3 ' + dd('lg-3').srcs.length + ', fa-7 ' + dd('fa-7').srcs.length + ', hr-5 ' + dd('hr-5').srcs.length + ')');
ok(L.sourcesBox({ srcs: [] }, 'x').includes('No working source yet.'), 'an empty list would say "No working source yet."');

// ---------- Part 2 ----------
let nV2 = 0, verbatim = 0, bad = [];
Object.entries(V2).forEach(([id, u0]) => {
  const d = DET[id], mine = d.srcs.filter(e => e.k === 'v2'), shown = u0.examples_and_sources.filter(e => !(e.score < 7)); // v2.8.2: below 7 not shown
  const u = { examples_and_sources: shown };
  nV2 += shown.length;
  if (mine.length !== shown.length || d.nV2 !== mine.length || D.detail[id].nV2 !== mine.length) bad.push(id + ' count');
  shown.forEach(e => { const m = mine.find(x => x.x + ' | ' + x.u === e.text); if (m && m.s === e.score && m.f === (/ec\.europa\.eu\/eurostat/.test(e.url) ? 'partial' : e.fit)) verbatim++; else bad.push(id + ' ' + e.url); });
  const box = L.sourcesBox(dd(id), id), head = 'Examples and sources (' + d.srcs.length + ')';
  if (!box.includes('data-v2="' + shown.length + '"') || !box.includes('data-count="' + d.srcs.length + '"')) bad.push(id + ' box counts');
  const g = e => e.s != null && e.s >= 7 ? (e.f === 'direct' ? 0 : 1) : 2, gs = d.srcs.map(g);
  if (gs.some((x, i) => i && x < gs[i - 1])) bad.push(id + ' order');
  const thin = !d.srcs.some(e => e.s != null && e.s >= 7 && e.f === 'direct');
  if (d.thin !== thin || box.includes(L.THIN) !== thin) bad.push(id + ' thin');
});
ok(nV2 === 179 && verbatim === 179 && LOW.length === 13 && nV2 + LOW.length === 192, 'v2.8.2 (owner): 179 of the 192 sources_v2 entries are kept with their score and fit in the build model; the 13 scored below 7 are not shown (' + verbatim + ', ' + LOW.length + ')');
ok(JSON.stringify([...new Set(LOW.map(x => x.use))].sort()) === JSON.stringify(['fa-1', 'fa-3', 'fa-6', 'fa-7', 'gm-2', 'hr-1', 'it-5', 'lg-3', 'lg-4', 'me-2'].sort()), 'the removed ones are in me-2, fa-1, fa-3, fa-6, fa-7, hr-1, gm-2, it-5, lg-3 and lg-4 (owner\'s list)');
ok(JSON.stringify(D.detail) === JSON.stringify(shipDetail(DET)) && Object.values(D.detail).every(d => d.srcs.every(e => !('s' in e) && !('f' in e))), 'the page ships no score and no fit for any source');
ok(!bad.length, 'counts in the UI equal the JSON; sorted 7+ direct, 7+ partial, rest; the thin line exactly where no direct 7+ entry exists: ' + bad.slice(0, 5).join(' | '));
ok(Object.values(DET).every(d => d.srcs.filter(e => /ec\.europa\.eu\/eurostat/.test(e.u)).every(e => e.f === 'partial')), 'every Eurostat row is "Partial"');
ok(!D.detail['fo-5'].srcs.some(e => /oracle\.com\/customers\/barcelo/.test(e.u)) && !D.detail['fa-7'].srcs.some(e => e.u === 'https://justt.ai/hospitality') && !D.detail['it-5'].srcs.some(e => /juniper\.net/.test(e.u)), 'replaced: Oracle Barceló (fo-5), justt.ai/hospitality (fa-7), the Juniper citizenM link (it-5)');
{ const x = { kind: 'v2', type: 'v', text: 'Org: a (b)', url: 'https://a.example/', score: 6, fit: 'partial' }, h = L.sourceRowItem(x);
  ok(!/Credible|Below 7|Not scored|>Partial<|class="badge/.test(h + L.sourceRowItem(Object.assign({}, x, { score: 8, fit: 'direct' }))), 'owner 26 Nov 2026: no credibility labels on sources'); }
const thinN = Object.values(D.detail).filter(d => d.thin).length;
ok(thinN > 50 && thinN < 98, 'the thin line shows for ' + thinN + ' of 98 use cases');
// shown inside each use case: detail layer, step 5, result page, Result PDF
ok(/L\.sourcesBox\(x, id\)/.test(app) && /id="tail-sources">' \+ fold\('srcs-tail', 'Examples and sources \(' \+ dx\.srcs\.length \+ '\)'/.test(app) && /fold\('srcs-result', 'Examples and sources \('/.test(app), 'owner decision 4: the box sits in the detail layer, on step 5 and on the result page');
{ const env = { cat: D.cat, TQ, ex: D.ex, detail: D.detail, today: '2026-11-25' }, r = finished(F, D, 'fa-6'), m = P.model(r, env, 'result');
  const src = m.blocks.filter(b => b.k === 'src'), head = m.blocks.find(b => b.srcHead);
  ok(head && head.t === 'Examples and sources (' + D.detail['fa-6'].srcs.length + ')' && src.length === D.detail['fa-6'].srcs.length && src.every(b => !b.badges && /^https:/.test(b.url)), 'the Result PDF ends with the use case\'s sources, without credibility labels (owner 26 Nov 2026), with addresses');
  ok(!P.model(r, env, 'answers').blocks.some(b => b.k === 'src'), 'the Answers PDF stays answers only'); }
done();
