// AI starting point v1.2 (folder tools/readiness-2): owner decisions B1/B2, the council's BUILD NOW items, and the eight
// clean-up bugs from reports/audit-readiness-2/cleanup_inventory.md. Written before the fixes (tests first).
// Run: node tools/readiness-2/tests/v12.test.mjs   (after node tools/readiness-2/build.mjs)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, load, catalogue, tester } from './load.mjs';
const { C, L, F, P } = load();
const CAT = catalogue();
const { ok, done } = tester('v1.2');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const same = (a, b) => { const k = o => JSON.stringify(Object.keys(o || {}).sort().map(x => [x, o[x]])); return k(a) === k(b); };
const allQ = v => ({ q1: v, q2: v, q3: v, q4: v, q5: v });
const allA = v => Object.fromEntries([...F.NEED_IDS, ...F.FACTOR_IDS].map(id => [id, v]));
const R = o => Object.assign(F.blank(), o);
const fo = CAT.depts.find(d => d.id === 'fo');
const TODAY = '2026-11-23';

// ---------- 0. Records saved by the build before v1.2 (captured from the real page) still open ----------
{
  const fx = JSON.parse(readFileSync(join(root, 'tests/fixtures/v1.1-saved.json'), 'utf8')).records;
  ok(fx.length === 4, 'fixtures: four records saved by v1.1');
  for (const f of fx) {
    const raw = JSON.parse(f.raw), info = {}, m = F.migrate(raw, CAT, info);
    ok(m && m.step === f.state.step, 'fixture ' + f.name + ': opens on the same step (' + (m && m.step) + ')');
    ok(m && m.use === raw.use && same(m.Q, raw.Q) && same(m.A, raw.A) && same(m.By, raw.By) && m.cat === raw.cat && m.dept === raw.dept, 'fixture ' + f.name + ': answers and choices unchanged');
    ok(!info.useChanged && !info.newer, 'fixture ' + f.name + ': no catalogue-change or newer-version notice');
    const u = CAT.depts.flatMap(d => d.uses).find(x => x.id === raw.use);
    ok(m.useName === (u ? u.n : ''), 'fixture ' + f.name + ': the use case name is filled in from the catalogue (' + m.useName + ')');
    ok(L.verdict(m.Q).key === f.state.verdict, 'fixture ' + f.name + ': same verdict');
  }
}

// ---------- B1. Visible name "AI starting point" (ids and storage key unchanged) ----------
ok(F.KEY === 'hftp-readiness2-v1' && F.V === 1, 'B1: storage key and version unchanged');
ok(P.TITLE === 'AI starting point: is AI the answer, and where?', 'B1: PDF title');
ok(P.footer(2, 5) === 'AI starting point · student prototype, not legal advice · page 2 of 5', 'B1: PDF footer');
ok(P.fileName('Hôtel Les Mélèzes', TODAY) === 'AI-starting-point_Hotel-Les-Melezes_2026-11-23.pdf' && P.fileName('', TODAY) === 'AI-starting-point_assessment_2026-11-23.pdf', 'B1: PDF file name prefix');
{
  const src = ['src/app.js', 'src/pdf.js', 'src/content.js', 'src/page.html'].map(f => readFileSync(join(root, f), 'utf8')).join('\n');
  // every user-visible string: quoted text in the sources (comments are not shown)
  const strings = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').match(/'[^'\n]*'|"[^"\n]*"|>[^<]+</g) || [];
  ok(!strings.some(s => /Readiness 2\.0/.test(s)), 'B1: "Readiness 2.0" is in no visible string ' + strings.filter(s => /Readiness 2\.0/.test(s)).slice(0, 3).join(' | '));
}

// ---------- B2. Stop headline ----------
ok(C.STOP.head === 'This is not suitable for AI.' && C.VERDICT.stop === C.STOP.head, 'B2: stop headline');
{
  const m = P.model(R({ step: 'stop', Q: { q1: 'n' } }), CAT, { today: TODAY });
  const ts = m.blocks.map(b => b.t);
  ok(m.blocks.find(b => b.k === 'h').t === 'This is not suitable for AI.', 'B2: PDF stop page headline');
  const i = ts.indexOf(C.STOP.head);
  ok(ts[i + 1] === C.STOP.why && ts[i + 2] === C.STOP.instead && ts[i + 3] === C.STOP.unsure, 'B2: PDF stop page reads headline, why, instead, then the "Not sure" line');
  const all = JSON.stringify(C) + JSON.stringify(m) + JSON.stringify(L.verdictText(L.verdict({ q1: 'u', q2: 'y', q3: 'y', q4: 'y', q5: 'y' }), true));
  ok(!/not an AI problem/i.test(all), 'B2: "not an AI problem" no longer appears in any content, verdict line or PDF');
}

// ---------- BUILD NOW 1–2. Q1 hint and the stop-screen line on "Not sure" ----------
ok(C.QUESTIONS[0].guard === 'Judge the job, not how you handle it today. If you use rules now only because nothing better was available, for example price rules, answer Not sure.', 'Q1 hint (council wording)');
ok(C.STOP.unsure === 'If a vendor offers you an AI tool for this job, ask what the AI does that a rule could not. If you are unsure, change your answer to Not sure: it becomes something to find out.', 'stop line pointing to Not sure');

// ---------- BUILD NOW 3. "None of these fits" has a working route ----------
{
  const none = L.handover(R({ use: 'none' }), null);
  ok(none.mode === 'search' && none.label === 'Open the readiness check' && none.hash === '', 'none fits: "Open the readiness check", no hash');
  ok(none.text === 'No use case in the catalogue matches. The readiness check needs a tool: when a vendor offers you one, search for it there.', 'none fits: summary line');
  const u3 = fo.uses[2], one = L.handover(R({ cat: 'Guest-facing', dept: 'fo', use: u3.id }), u3);
  ok(one.mode === 'use' && one.label === 'Check one tool in detail' && one.hash === 'use=' + u3.id, 'a use case: "Check one tool in detail", #use=<id>');
  const lg = CAT.depts.find(d => d.id === 'lg').uses[3], doc = L.handover(R({ cat: 'Administrative', dept: 'lg', use: 'lg-4' }), lg);
  ok(doc.mode === 'blocked' && /is a document, not an AI tool/.test(doc.text), 'lg-4 (a document): still no check, with the reason');
  ok(L.HANDOVER_NOTE === 'Your answers here are not carried over to the Readiness check yet.', 'BUILD NOW 6: hand-over honesty line');
  const m = P.model(R({ Q: allQ('y'), cat: 'Operational', use: 'none', A: allA('y') }), CAT, { today: TODAY });
  const i = m.blocks.findIndex(b => b.k === 'h' && b.t === 'Next step');
  ok(m.blocks[i + 1].t === 'Open the readiness check.' && m.blocks[i + 2].t === none.text, 'none fits: the PDF next step says the same');
}

// ---------- BUILD NOW 4. No question codes in anything the hotel sees ----------
{
  const CODE = /\b(T[1-5]|D[1-5][ab]?|G[1-4]s?|F[1-5]|P[1-5]|O[1-6]|X[12]b?|XG)\b|new \(from T2\)|new question/;
  const recs = [R({ step: 'summary', Q: allQ('y'), cat: 'Guest-facing', dept: 'fo', use: 'fo-1', A: allA('k') }), R({ step: 'summary', Q: allQ('u'), use: 'none', A: allA('n') })];
  recs.forEach((r, i) => {
    const m = P.model(r, CAT, { today: TODAY }), t = JSON.stringify(m.blocks);
    ok(!CODE.test(t), 'PDF #' + i + ' shows no question code ' + (t.match(CODE) || [''])[0]);
  });
  ok(!CODE.test(C.SOURCES.needsNote), 'the step 2 sources note no longer promises codes');
  const app = readFileSync(join(root, 'src/app.js'), 'utf8');
  ok(!/it\.rc\b/.test(app) && !/esc\(a\[0\]\)/.test(app), 'the page no longer prints it.rc or the also-list codes');
  ok(C.NEEDS.every(x => typeof x.rc === 'string') && C.FACTORS.every(x => typeof x.rc === 'string'), 'the codes stay in the data');
}

// ---------- BUILD NOW 5. Visible evidence strength where the research marks it weak ----------
{
  const weak = C.FACTORS.filter(x => x.weak).map(x => x.id);
  ok(eq(weak, ['c2', 'c4', 'c9']), 'evidence note on workflow, culture and change management (research: weak or partial) ' + weak);
  ok(C.FACTORS.filter(x => x.weak).every(x => /^Evidence here is thin/.test(x.weak) && /no European hotel survey/.test(x.weak)), 'plain wording');
  ok(/change-management consultancy/.test(JSON.stringify(C.FACTORS.find(x => x.id === 'c9').ev)), 'Prosci labelled as a change-management consultancy');
  ok(!/McKinsey|BCG|10-20-70/.test(JSON.stringify(C)), 'no search-only figures');
}

// ---------- BUILD NOW 7. Glosses on first use ----------
{
  const g = id => (C.NEEDS.concat(C.FACTORS).find(x => x.id === id).gloss || '');
  ok(/^PMS: /.test(g('b1')), 'PMS glossed at B1 (first appearance)');
  ok(/data processing agreement/.test(g('b5')) && /DPIA/.test(g('b5')), 'DPA and DPIA glossed at B5');
  ok(/works council/.test(g('c9')) && /staff representatives/i.test(g('c9')), 'works council / staff representatives glossed at C9');
  ok(C.NEEDS.concat(C.FACTORS).filter(x => x.gloss).length === 3, 'exactly three gloss lines (first appearances only)');
}

// ---------- M1. History machine (pure part) ----------
{
  const h = (d, prev, len) => ({ d, prev, len });
  ok(F.histAction('next', h(0, null, 3), 'where', 3) === 'push' && F.histAction('begin', h(0, null, 1), 'q', 1) === 'push', 'forward events push');
  ok(F.histAction('change', h(2, 'q', 4), 'q', 4) === 'push' && F.histAction('edit', h(5, 'success', 7), 'q', 7) === 'push', 'change and edit push');
  ok(F.histAction('back', h(2, 'q', 5), 'q', 5) === 'back', 'in-app Back goes back in history when the entry before is that step and nothing else was pushed since');
  ok(F.histAction('back', h(2, 'q', 5), 'q', 6) === 'replace', '…but replaces when someone else (the hub) pushed since');
  ok(F.histAction('back', h(0, null, 5), 'start', 5) === 'replace' && F.histAction('back', h(2, 'where', 5), 'q', 5) === 'replace', '…and replaces when the entry before is not ours or another step');
  ok(F.histAction('restart', h(4, 'success', 6), 'start', 6) === 'replace', 'Start again replaces (no new entry)');
  ok(eq(F.histEntry('push', h(1, 'start', 3), 'where', 'q'), { r2: 'where', d: 2, prev: 'q' }), 'a pushed entry counts our depth and remembers where it came from');
  ok(eq(F.histEntry('replace', h(2, 'q', 3), 'q', 'where'), { r2: 'q', d: 2, prev: null }), 'a replaced entry keeps the depth and forgets the previous step');
  ok(F.histRead({ r2: 'needs', d: 3, prev: 'where' }).ours && !F.histRead(null).ours && !F.histRead({ hubTool: 'readiness-2' }).ours && !F.histRead({ r2: 'nonsense' }).ours, 'only our own entries are read as steps (a hash change or a foreign entry is not "start")');
  // simulate a browser: three Next/Back cycles do not grow the stack; Back after an in-app Back leaves to start
  const sim = () => {
    const H = { list: [{ r2: 'start', d: 0, prev: null }], i: 0 }, len = () => H.list.length;
    let rec = R({ step: 'start', Q: allQ('y') }), mem = { d: 0, prev: null, len: 1 };
    const apply = (act, entry) => {
      if (act === 'push') { H.list = H.list.slice(0, H.i + 1).concat([entry]); H.i++; }
      else if (act === 'replace') H.list[H.i] = entry;
      else if (act === 'back') { H.i--; }
      const cur = H.list[H.i]; mem = { d: cur.d, prev: cur.prev, len: len() };
    };
    const ev = e => { const from = rec.step, r = F.reduce(rec, e, null, CAT); if (!r.ok) return; rec = r.rec; const act = F.histAction(e, mem, rec.step, len()); apply(act, act === 'back' ? null : F.histEntry(act, mem, rec.step, from)); };
    const browserBack = () => { if (H.i === 0) return 'left'; H.i--; const st = F.histRead(H.list[H.i]); rec = F.reduce(rec, 'pop', st.step, CAT).rec; mem = { d: H.list[H.i].d, prev: H.list[H.i].prev, len: len() }; return rec.step; };
    return { ev, browserBack, len, step: () => rec.step };
  };
  const s = sim(); s.ev('begin'); s.ev('next'); s.ev('back');
  ok(s.step() === 'q' && s.browserBack() === 'start' && s.browserBack() === 'left', 'acceptance (a): Next, in-app Back, browser Back → start, never forward to 1b');
  const s2 = sim(); s2.ev('begin'); const L0 = s2.len(); for (let k = 0; k < 3; k++) { s2.ev('next'); s2.ev('back'); }
  ok(s2.len() === L0 + 1 && s2.step() === 'q', 'acceptance (b): three Next/Back cycles do not grow the history (' + L0 + ' → ' + s2.len() + ')');
}

// ---------- M2. Use-case identity: id plus name; a mismatch re-asks ----------
{
  const r = F.reduce(R({ step: 'where', Q: allQ('y'), cat: 'Guest-facing', dept: 'fo' }), 'use', 'fo-3', CAT).rec;
  ok(r.useName === fo.uses[2].n, 'choosing a use case saves its name too');
  ok(F.reduce(r, 'use', 'none', CAT).rec.useName === '', '"None of these fits" has no name');
  ok(F.reduce(r, 'cat', 'Operational', CAT).rec.useName === '' && F.reduce(r, 'dept', 'fd', CAT).ok === false, 'a cleared use case clears its name');
  // a catalogue with one use case inserted at the top of Front Office: fo-3 now names another tool
  const shifted = JSON.parse(JSON.stringify(CAT)), sfo = shifted.depts.find(d => d.id === 'fo');
  sfo.uses.unshift({ id: 'x', n: 'A new use case', task: 't', use: 'Low' }); sfo.uses.forEach((u, i) => { u.id = 'fo-' + (i + 1); });
  const saved = { v: 1, step: 'summary', Q: allQ('y'), cat: 'Guest-facing', dept: 'fo', use: 'fo-3', useName: fo.uses[2].n, A: allA('y'), By: {} };
  const info = {}, m = F.migrate(saved, shifted, info);
  ok(m.step === 'where' && m.use === '' && m.useName === '' && m.cat === 'Guest-facing' && m.dept === 'fo', 'acceptance: a moved use case reopens on 1b with the use case cleared, area and department kept');
  ok(info.useChanged === true, '…and says the catalogue changed');
  ok(!F.ctxOf(m, shifted).whereDone, '…so no hand-over can be offered');
  const same = {}, m2 = F.migrate(saved, CAT, same);
  ok(m2.step === 'summary' && m2.use === 'fo-3' && m2.useName === fo.uses[2].n && !same.useChanged, 'acceptance: a matching name is unchanged');
  ok(L.HANDOVER_NOTE && C.USE_CHANGED === 'The catalogue changed: please pick your use case again.', 'notice wording');
}

// ---------- M3. Storage not available: visible line (wording) ----------
ok(C.NOT_SAVED === 'This browser is not keeping your answers. Use Copy summary, Print or Download before you close the page.', 'M3: not-saved line');

// ---------- L1. Real calendar dates ----------
{
  ['2026-02-31', '2026-13-45', '0000-00-00', '2026-00-10', '2026-04-31', '1999-12-31', '2101-01-01', '2027-02-29', '2026-1-01', ''].forEach(d => ok(!F.validDate(d), 'invalid date refused: ' + JSON.stringify(d)));
  ['2026-12-01', '2028-02-29', '2027-01-31', '2000-01-01', '2100-12-31'].forEach(d => ok(F.validDate(d), 'valid date: ' + d));
  const at = R({ step: 'needs', Q: allQ('y'), use: 'none', A: { b1: 'pl' } });
  ['2026-02-31', '2026-13-45', '0000-00-00'].forEach(d => ok(F.reduce(at, 'by', { id: 'b1', date: d }, CAT).ok === false, 'reduce refuses ' + d));
  ok(F.reduce(at, 'by', { id: 'b1', date: '2026-12-01' }, CAT).rec.By.b1 === '2026-12-01', 'reduce keeps 2026-12-01');
  ['2026-02-31', '2026-13-45', '0000-00-00'].forEach(d => ok(!('b1' in F.migrate({ v: 1, step: 'needs', Q: allQ('y'), use: 'none', A: { b1: 'pl' }, By: { b1: d } }, CAT).By), 'migrate drops ' + d));
  ok(L.fmtDate('2026-12-01') === '1 Dec 2026' && L.fmtDate('2026-13-45') === '' && L.fmtDate('0000-00-00') === '' && L.fmtDate('2026-02-31') === '', 'fmtDate prints real dates only');
  ok(L.action('b1', 'pl', '2026-13-45').text === 'Finish: ' + L.ITEM.b1.act, 'an impossible date is never printed');
  ok(L.localIso(new Date(2026, 10, 23, 0, 30)) === '2026-11-23' && L.localIso(new Date(2026, 0, 5, 23, 59)) === '2026-01-05', 'dates on screen and in the PDF use the local day, not UTC');
}

// ---------- L2. A record from a newer version is not rewritten ----------
{
  const info = {}, m = F.migrate({ v: 2, step: 'q', Q: { q1: 'u' }, notes: 'x' }, CAT, info);
  ok(m.Q.q1 === 'u' && info.newer === true, 'L2: a newer record is read and flagged (the page then does not save over it)');
  const i2 = {}; F.migrate({ v: 1, step: 'q' }, CAT, i2); ok(!i2.newer, 'L2: a v1 record is not flagged');
  ok(C.NEWER === 'This was saved by a newer version of this page. Changes here are not kept.', 'L2: notice wording');
}

// ---------- L3. Progress bar ----------
ok(eq(['q', 'where', 'needs', 'success', 'summary', 'stop', 'start'].map(s => F.progress(s)), [
  ['now', '', ''], ['now', '', ''], ['done', 'now', ''], ['done', 'done', 'now'], ['done', 'done', 'done'], null, null]), 'L3: the current step is marked "now" on 1a, 1b, 2 and 3; all done on the summary');

done();
