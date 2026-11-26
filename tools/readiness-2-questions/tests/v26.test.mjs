// "Do you need AI?" v2.6 (24 Nov 2026), three owner decisions. Written before the change: it fails on v2.5.1 and passes on v2.6.
//  A. Question 1 reads "Can each case be fixed with an “if this, then that” rule?": its meaning is turned round (Yes = fixed rules
//     can do it = the stop screen). Saved records made before v2.6 (browser store, saved files, team copies) are turned round on
//     load, exactly once (record field qv), so their results do not change.
//     Fixture: tests/fixtures/v2.5-saved.json, written by the v2.5.1 code before any v2.6 change, with what v2.5.1 worked out.
//  B. Questions 3 and 4 of step 2 are replaced (Brynjolfsson & Mitchell 2017). Old answers to them are not carried over.
//  C. Source links (owner, 24 Nov 2026, after testing in the claude.ai viewer: links open only on the hub's main page): the source's
//     name is the hyperlink. Standalone the page draws its own layer; inside the hub it sends the layer as plain JSON
//     ({ hub: 'detail' }) and the hub draws it on the main page. No frame intercepts links; the hub's link panel is gone.
// Run: node tools/readiness-2/tests/v26.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, envOf, tester, finished, root, PAGE } from './load.mjs';
const { C, L, F, P } = load();
const D = data(), TQ = D.tq, ENV = envOf(D, F);
const { ok, done } = tester('v26');
const rd = p => readFileSync(join(root, p), 'utf8');
const clone = o => JSON.parse(JSON.stringify(o));
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const env = { cat: D.cat, TQ, ex: D.ex, today: '2026-11-24' };
const app = rd('src/app.js'), pdfSrc = rd('src/pdf.js'), logicSrc = rd('src/logic.js');
const FX = JSON.parse(rd('tests/fixtures/v2.5-saved.json'));
const Q = id => C.QUESTIONS.find(q => q.id === id);

// ---------- A. question 1, the other way round ----------
const q1 = Q('q1');
ok(q1.q === 'Can each case be fixed with an “if this, then that” rule?', 'A: question 1 reads exactly as the owner gave it');
ok(q1.title === 'Needs judgement', 'A: its title is the plain name (v2.8.0 B10)');
ok(q1.yesIf.startsWith('You could write it down as fixed rules, like “send an email 3 days before arrival”') && q1.noIf.startsWith('Every case is different, like guest emails, photos or tomorrow’s demand'), 'A: Yes-if and No-if swapped to the new meaning');
ok(/Yes if you could write it down as fixed rules/.test(q1.hint) && /No if every case is different/.test(q1.hint), 'A: the hint follows the new meaning');
ok(/pre-arrival email/.test(q1.yes) && /guest emails in five languages/.test(q1.no), 'A: the examples swapped');
ok(q1.stopOn === 'y' && !Q('q2').stopOn, 'A: question 1 stops on Yes (q.stopOn)');
ok(L.verdict({ q1: 'y' }).stop && L.verdict({ q1: 'y' }).key === 'stop', 'A: Q1 Yes is the stop screen');
ok(!L.verdict({ q1: 'n' }).stop && L.verdict({ q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }).key === 'go', 'A: Q1 No and the rest Yes: worth exploring');
ok(L.verdict({ q1: 'u', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }).key === 'find', 'A: Not sure unchanged');
{
  const r = F.blank('a1'); r.hotel.type = 'independent'; r.step = 'q'; r.Q = { q1: 'y' };
  const c = F.ctxOf(r, ENV); ok(c.q1Stop === true && F.flowNext('q', 'next', c) === 'stop', 'A: flow: Q1 Yes → the stop screen (ctx.q1Stop)');
  r.Q = { q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }; ok(F.flowNext('q', 'next', F.ctxOf(r, ENV)) === 'must', 'A: flow: Q1 No → the must-haves');
}
{
  const n = L.aiMeaning('q1', 'n'), y = L.aiMeaning('q1', 'y'), u = L.aiMeaning('q1', 'u');
  ok(n.line.startsWith('Met: every case is different') && n.good === true, 'A: card: Q1 No is met (needs judgement): ' + n.line);
  ok(y.line === q1.outcome && y.good === false, 'A: card: Q1 Yes gives the stop outcome');
  ok(u.ifNo === 'If question 1 turns out to be Yes, this is not suitable for AI: rules or ordinary automation will do it.', 'A: card: Q1 Not sure says what a Yes would mean');
  ok(L.aiMeaning('q2', 'y').good === true && L.aiMeaning('q2', 'n').good === false && L.aiMeaning('q2', 'u').good === null, 'A: good/bad for the other questions as before');
}
ok(/Because you answered Yes to: “' \+ esc\(L\.QBY\.q1\.q\)/.test(app) && !/Because you answered No to/.test(app), 'A: stop screen names the Yes');
ok(/Because you answered Yes to: “' \+ L\.QBY\.q1\.q/.test(pdfSrc) && !/Because you answered No to/.test(pdfSrc), 'A: stop PDF names the Yes');
{
  const r = finished(F, D, 'gx-2', { Q: { q1: 'y', q2: 'y', q3: 'y', q4: 'y', q5: 'y' } }); r.step = 'stop';
  const pm = P.model(r, env); ok(pm.stop && pm.blocks.some(b => b.t === 'Because you answered Yes to: “' + q1.q + '”'), 'A: the stop PDF');
  const g = finished(F, D, 'gx-2'); const pg = P.model(g, env, 'answers').blocks.filter(b => b.k === 'item'); // v2.7: the five answers are the first rows of the Answers PDF
  ok(pg[0].tone === 'hi' && pg[0].val === 'No (Met)', 'A: PDF: Q1 No is drawn in the good tone and reads Met (v2.8.0 B5)');
}
ok(/Question 1 is Yes\./.test(app) && !/Question 1 is No\./.test(app), 'A: step 2 says "Question 1 is Yes."');
// v2.7.0: data/wording.json is gone (its core texts live in src/content.js)

// ---------- A. migration of records saved before v2.6 (fixture) ----------
ok(F.V === 4 && F.QV === 2 && L.QV === 2, 'A: store and file version 4 (v2.7.0; 3 since v2.6); step 2 question set 2 (qv)');
ok(FX.store.v === 2 && Object.values(FX.store.checks).every(c => c.qv === undefined), 'fixture: a v2 store whose checks carry no qv');
let info = {};
const s1 = F.migrate(clone(FX.store), ENV, info), c1 = s1.checks;
ok(Object.values(c1).every(c => c.qv === 2), 'migrated: every check now carries qv 2');
ok(c1.fixstop01.Q.q1 === 'y' && c1.fixstop01.step === 'stop' && L.verdict(c1.fixstop01.Q).stop, 'migrated: the old Q1 No (stop) is now Q1 Yes, still the stop screen');
ok(c1.fixgo0001.Q.q1 === 'n' && c1.fixgo0001.Q.q2 === 'y' && c1.fixgo0001.Q.q5 === 'y' && !('q3' in c1.fixgo0001.Q) && !('q4' in c1.fixgo0001.Q), 'migrated: Q1 Yes → No; Q2 and Q5 kept; old Q3 and Q4 dropped');
ok(eq(c1.fixgo0001.Qnew, ['q3', 'q4']) && c1.fixgo0001.step === 'q', 'migrated: the dropped questions are listed (Qnew) and the check opens on step 2');
ok(c1.fixunsure.Q.q1 === 'u', 'migrated: Not sure stays Not sure');
for (const [id, q3, q4] of [['fixgo0001', 'y', 'y'], ['fixunsure', 'y', 'y'], ['fixassist', 'n', 'y']]) {
  const r = clone(c1[id]); r.Q.q3 = q3; r.Q.q4 = q4; delete r.Qnew; r.step = 'result';
  // v2.7.0: gx-2 now has 12 questions; the 8 carried answers keep theirs, the 4 new ones are answered Yes here like the rest, so the
  // verdict and holds are what v2.5.1 showed; the score is worked out on the new count (same formula)
  TQ.uses['gx-2'].qs.forEach(q => { if (!r.T[q.id]) r.T[q.id] = 'y'; });
  const v = L.verdict(r.Q), e = L.evaluate(r, TQ), was = FX.seen[id];
  ok(v.key === was.verdict && v.stop === was.stop && e.level === was.level && e.pct >= was.pct && eq(e.held, was.held) && v.q1Unsure === was.q1Unsure,
    'migrated ' + id + ': with questions 3 and 4 answered again, the result is what v2.5.1 showed (' + [v.key, e.level, e.pct, JSON.stringify(e.held)].join(' ') + ')');
}
{
  const again = F.migrate(clone(s1), ENV, {});
  ok(Object.keys(c1).every(k => eq(again.checks[k].Q, c1[k].Q) && again.checks[k].qv === 2), 'exactly once: a v2.6 store read again is not turned round again');
  const s2 = F.reduce(Object.assign(clone(s1), { cur: 'fixgo0001' }), 'answer', { id: 'q3', value: 'y' }, ENV);
  ok(s2.ok && eq(F.cur(s2.store).Qnew, ['q4']), 'answering a new question takes it off the list');
}
// files
{
  const r = F.cleanRec(clone(FX.file.check), ENV, {}, { file: true });
  ok(FX.file.v === 2 && r.Q.q1 === 'u' && !('q3' in r.Q) && r.qv === 2, 'file (v2.5.1): turned round once, old Q3/Q4 dropped');
  const g = F.cleanRec(clone(FX.store.checks.fixgo0001), ENV, {}); const f2 = F.cleanRec(clone(F.forFile(g)), ENV, {}, { file: true });
  ok(F.forFile(g).qv === 2 && f2.Q.q1 === 'n', 'file (v2.6): carries qv 2, read back without turning');
  const imp = F.reduce(F.blankStore(), 'import', clone(FX.file.check), ENV);
  ok(imp.ok && F.cur(imp.store).Q.q1 === 'u' && F.cur(imp.store).qv === 2, 'file: the import event takes an old check, turned round once');
  const imp2 = F.reduce(F.blankStore(), 'import', clone(F.forFile(g)), ENV); ok(F.cur(imp2.store).Q.q1 === 'n', 'file: a v2.6 check is not turned again');
  ok(/kind: FILE_KIND, v: F\.V/.test(app), 'file: written with the store version (3)');
}
// another tab: what it saved is read through migrate, so the merge never turns twice
{
  const mine = F.migrate(clone(FX.store), ENV, {}), theirs = F.migrate(clone(mine), ENV, {});
  ok(F.mergeTabs(mine, theirs).store.checks.fixgo0001.Q.q1 === 'n', 'tabs: the merged check keeps Q1 No');
}
// v1 records (before 24 Nov 2026) were in the old meaning too
{
  const v1 = JSON.parse(rd('tests/fixtures/v1.3-saved.json')), raw = JSON.parse(v1.records[0].raw);
  const m = F.migrate(clone(raw), ENV, {}), r = F.cur(m);
  const oldQ1 = (raw.Q || {}).q1;
  ok(r && r.qv === 2 && (!oldQ1 || r.Q.q1 === ({ y: 'n', n: 'y', u: 'u' })[oldQ1]), 'v1 record: Q1 turned round (' + oldQ1 + ' → ' + (r && r.Q.q1) + ')');
}
// team copies (the Team tab recomputes them)
{
  const team = readFileSync(join(root, '../readiness-check/src/team.js'), 'utf8');
  ok(/s\.qv === DL\.QV \? s\.Q \|\| \{\} : DL\.legacyQ\(s\.Q \|\| \{\}\)\.Q/.test(team), 'team: a copy without qv is turned round with R2Logic.legacyQ');
  ok(!/function shareDoc/.test(app), 'team (v2.7.0): no team copies any more');
  const t = FX.team, Qt = L.legacyQ(t.Q).Q;
  ok(Qt.q1 === 'n' && !('q3' in Qt) && !('q4' in Qt) && Qt.q2 === 'y', 'team: an old copy reads Q1 No, old Q3/Q4 not answered');
  ok(eq(L.legacyQ({ q1: 'y', q2: 'n', q3: 'u', q4: 'n', q5: 'u' }), { Q: { q1: 'n', q2: 'n', q5: 'u' }, dropped: ['q3', 'q4'] }) && eq(L.legacyQ({ q1: 'u' }), { Q: { q1: 'u' }, dropped: [] }) && eq(L.legacyQ({}), { Q: {}, dropped: [] }), 'legacyQ: y↔n on Q1, u stays; Q3/Q4 dropped');
}
ok(typeof C.Q_CHANGED === 'string' && /questions 3 and 4/.test(C.Q_CHANGED) && /id="q-changed"/.test(app), 'step 2: a line says the questions changed');

// ---------- B. the new questions 3 and 4 ----------
const q3 = Q('q3'), q4 = Q('q4');
ok(q3.title === 'Information to learn from' && q3.q === 'Are there past examples of this task, such as emails, bookings, or past photos, that show what a good result looks like?', 'B: Q3 title and question');
ok(q3.yesIf === 'You have hundreds of past cases stored digitally.' && q3.noIf === 'It happens rarely, or nothing was ever recorded.' && q3.whyShort === 'AI learns from examples; without many past cases it has nothing to learn from.', 'B: Q3 Yes-if, No-if, why');
ok(q4.title === 'Safety net' && q4.q === 'If the tool makes an occasional mistake, can it be caught or fixed before it causes harm?', 'B: Q4 title and question');
ok(q4.yesIf === 'A wrong answer now and then can be caught or does little harm.' && q4.noIf === 'Every single result must be exactly right, for example a safety decision.' && q4.whyShort === 'AI is never right every time; if no mistake is acceptable, a rule-based tool or a person is the better choice.', 'B: Q4 Yes-if, No-if, why (v2.7.0: "legal or" removed from No-if)');
ok(!/C-R-I-S-P/.test(readFileSync(join(root, PAGE), 'utf8')), 'B (v2.8.0 B10): no C-R-I-S-P anywhere in the page');
// v2.7.0: the wording.json core checks are retired with the file
const BM = 'Brynjolfsson, E. & Mitchell, T. (2017), “What can machine learning do? Workforce implications”, Science 358(6370), 1530–1534';
ok(C.SOURCES.q.some(s => s[0].startsWith(BM) && s[1] === 'https://doi.org/10.1126/science.aap8062'), 'B: the source stands with the other questions\' sources, with its DOI link (v2.8.0)');
ok(C.SOURCES.qNote === 'The five questions and examples are the project team’s, based on these sources (Nov 2026).', 'B (v2.8.0, live review): the note keeps only "based on these sources"; the internal history line is gone');
ok(readFileSync(join(root, '../../research_notes/AI starting point/research.md'), 'utf8').includes('v2.6 (24 Nov 2026)'), 'B: research.md carries the added note');
// verdict rules
const base = { q1: 'n', q2: 'y', q3: 'y', q4: 'y', q5: 'y' };
ok(L.verdict(Object.assign({}, base, { q3: 'n' })).key === 'data' && L.verdict(Object.assign({}, base, { q4: 'n' })).key === 'exact', 'B: Q3 No and Q4 No each give their verdict');
ok(L.verdict(Object.assign({}, base, { q2: 'n', q4: 'n' })).key === 'worth' && L.verdict(Object.assign({}, base, { q4: 'n', q5: 'n' })).key === 'exact', 'B: order Q2 > Q3 > Q4 > Q5');
ok(C.VERDICT.exact === q4.outcome && C.VERDICT.data === q3.outcome && !('assist' in C.VERDICT), 'B: the verdict words are the outcomes; no "assistant only" verdict');
for (const [k, o, held] of [['Q3 No', { q3: 'n' }, ['carried']], ['Q4 No', { q4: 'n' }, ['carried']], ['Q3 Don’t know yet', { q3: 'u' }, ['notsure']], ['Q4 Don’t know yet', { q4: 'u' }, ['notsure']]] /* v2.8.2 (owner): Not sure renamed */) {
  const m = L.resultModel(finished(F, D, 'gx-2', { Q: Object.assign({}, base, o) }), env);
  ok(m.level === 'almost' && eq(m.held, held) && (held[0] === 'carried' ? /^Step 2 suggests this may not be worth doing with AI \(.+: No\)\.$/.test(m.boxLine) && !m.alsoLine : m.boxLine === 'Some step 2 answers are Don’t know yet.' && !m.alsoLine) /* v2.8.2 (owner): the step-2 line stands in the verdict box; no "Held back" */ && /^Because /.test(m.reason), 'B: ' + k + ' holds the top verdict, reason shown (' + m.level + ' ' + JSON.stringify(m.held) + ')');
}
ok(L.resultModel(finished(F, D, 'gx-2'), env).level === 'ready', 'B: all fine: the top verdict');
ok(!('Q4_NO_HOLDS_TOP' in L.JUDGEMENT) && !C.ASSIST_LINE && !/assist/.test(pdfSrc) && !/m\.assist|id="assist"/.test(app) && !/q4No/.test(logicSrc), 'B: the assistant-only condition is gone');
ok(L.method(L.evaluate(finished(F, D, 'gx-2'), TQ)).some(t => t === 'Team judgement: a No on question 2, 3, 4 or 5 of step 2 keeps the top verdict back until it is settled.') /* v2.8.2 (owner): no "held back" wording */, 'B: How this was worked out names questions 2 to 5');
ok(!L.consistLines({ Q: { q3: 'n' }, A: { m7: 'y' } }).m7 && !C.CONSIST.m7 && !!L.consistLines({ Q: { q5: 'n' }, A: { m3: 'y' } }).m3, 'B: the must-have 7 line (old Q3 meaning) is gone; must-have 3 stays');
ok(/v2\.6/.test(rd('README.md')) && /## v2\.6/.test(rd('CHANGELOG.md')), 'B: README and CHANGELOG');

// ---------- C. plain hyperlinks ----------
{
  const row = L.sourceRow(['c', 'Vendor A', 'a note', 'https://a.com/x']);
  /* v2.8.2 (owner): one format (R2Logic.srcFmt): organisation in bold, title, year, then one plain link with a short label; no
     "Copy address", no hidden address span, no Hotel tag (was: the name is the link, the address line with Copy address, the tag) */
  ok(/^<li data-src="c"><b>Vendor A<\/b>, A note, n\.d\. <a href="https:\/\/a\.com\/x" target="_blank" rel="noopener" title="https:\/\/a\.com\/x">a\.com\/x<\/a><\/li>$/.test(row) && !/Open the source/.test(row), 'C: org, title, then one short link; no "Open the source"');
  ok(!/srcaddr|srcurl|copy-src|Copy address/.test(row), 'C: no address line and no Copy address (v2.8.2)');
  ok(/^<li data-src="h"><b>Hotel B<\/b>, n\.d\. <a href="https:\/\/h\.com\/" target="_blank" rel="noopener" title="https:\/\/h\.com\/">h\.com<\/a><\/li>$/.test(L.sourceRow(['h', 'Hotel B', '', 'https://h.com/'])), 'C: a hotel source in the same format (v2.8.2: no Hotel tag)');
  ok(/^<li data-src="c"><b>No link<\/b>, N, n\.d\.<\/li>$/.test(L.sourceRow(['c', 'No link', 'n', ''])), 'C: without a URL there is no link, only the text');
  ok(!/data-ext/.test(L.sourceRow(['c', 'A', 'b', 'https://a.com/'])), 'C: no interception marker');
}
ok(!/hub: 'link'/.test(app), 'C: readiness-2 no longer sends { hub: \'link\' }');
ok(!/hub: 'link'/.test(readFileSync(join(root, '../register/src/app.js'), 'utf8')), 'C: the register no longer sends it');
ok(!/hub: 'link'|id="hublink"/.test(readFileSync(join(root, '../use-case-catalogue/index.html'), 'utf8')), 'C: the catalogue no longer sends it');
// the hub's layer: every use case's content passes the hub's own check (hubDetail, run as is from hub-bar.html)
{
  const hubSrcTxt = readFileSync(join(root, '../hub/hub-bar.html'), 'utf8');
  const block = hubSrcTxt.slice(hubSrcTxt.indexOf('/* machine:start'), hubSrcTxt.indexOf('/* machine:end */'));
  const { hubDetail } = new Function(block + '; return { hubDetail };')();
  let n = 0, bad = [], urls = 0;
  D.cat.depts.forEach(d => d.uses.forEach(u => {
    const x = clone(L.detailData(D, u, d, TQ)); n++; // clone: what postMessage delivers
    const h = hubDetail(u.id, x); if (!h) bad.push(u.id); else { urls += h.srcs.filter(s => s.url).length; if (!eq(h.srcs.map(s => s.name), x.srcs.map(s => s.name))) bad.push(u.id + ' names'); }
  }));
  ok(n === 98, 'C (v2.7.0; v2.8.0: 98): the layer data of all listed use cases is built (the hub\'s own check is retired with the hub)');
  ok(/function detailData\(id\) \{ return L\.detailData\(/.test(app) && /L\.sourcesBox\(x, id\)/.test(app), 'C: the page\'s own dialog is drawn from the same data');
  ok(!/hubPost|host\.pong/.test(app) && /dlg\.showModal\(\)/.test(app), 'C (v2.7.0): no hub: the layer is always this page\'s own dialog');
  ok(/target="_blank" rel="noopener"/.test(rd('src/logic.js')), 'C (v2.7.0): source names are plain links that open in a new tab');
  ok(!/detail-close' \}\)/.test(app.replace("data-act=\"detail-close\"", '')), 'C (v2.7.0): no message when the layer closes');
}
{
  const hub = readFileSync(join(root, '../hub/hub-bar.html'), 'utf8'), contracts = readFileSync(join(root, '../hub/CONTRACTS.md'), 'utf8');
  ok(!/'link'|hubLinkUrl|openTop|hub-link/.test(hub), 'C: the hub\'s link panel and link message are gone');
  ok(!/### link/.test(contracts) && /### detail \/ detail-closed \/ detail-close/.test(contracts) && /cache-busting/.test(contracts), 'C: CONTRACTS.md: no link message; the detail messages and cache-busting');
}
done();
