// v2.7.0 (prompt §5 and §7 test 6): saves made before the questions-only data still open, and step-5 answers carry over by id.
// Fixtures written by the BASE code (tools/readiness-2 at 74385fe, the version the prompt calls v2.6.1; really v2.7 with rules v2.6)
// through its own reduce / forFile / store shape: tests/fixtures/v2.6.1-file.json ("Save as file") and v2.6.1-store.json (the
// browser store under its key hftp-readiness2-v1).
// Run: node tools/readiness-2-questions/tests/migration.test.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load, data, envOf, tester, root } from './load.mjs';
const { C, L, F } = load();
const D = data(), TQ = D.tq, ENV = envOf(D, F);
const { ok, done } = tester('migration');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rd = p => readFileSync(join(root, p), 'utf8');
const clone = o => JSON.parse(JSON.stringify(o));
const Q = JSON.parse(rd('data/usecase_questions_only.json')), QU = Object.fromEntries(Q.use_cases.map(u => [u.id, u]));
const FILE = JSON.parse(rd('tests/fixtures/v2.6.1-file.json')), STORE = JSON.parse(rd('tests/fixtures/v2.6.1-store.json'));
const OK = { y: 1, pl: 1, n: 1 }; // v2.7.1: a stored "k" is not an answer and does not carry over
const noK = o => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => v !== 'k'));
/* The expected carry, worked out from the data file alone (independent of src/flow.js). */
function expectCarry(use, T, TBy) {
  const o = { T: {}, TBy: {}, kept: 0 };
  QU[use].questions.forEach(q => { const a = q.carry_answer_from && T[q.carry_answer_from]; if (OK[a]) { o.T[q.id] = a; o.kept++; if (a === 'pl' && TBy[q.carry_answer_from]) o.TBy[q.id] = TBy[q.carry_answer_from]; } });
  o.fresh = QU[use].questions.length - o.kept;
  return o;
}

// ---------- fixtures are what the base code wrote ----------
ok(FILE.file.kind === 'hftp-do-you-need-ai' && FILE.file.v === 3 && FILE.file.rules === 'v2.6 (24 Nov 2026)' && FILE.file.check.use === 'gx-2', 'file fixture: a v2.6.1-era saved file (kind, v 3, rules v2.6), gx-2');
ok(STORE.key === 'hftp-readiness2-v1' && STORE.store.v === 3 && Object.keys(STORE.store.checks).length === 2, 'store fixture: the v2.6.1 store (key hftp-readiness2-v1, v 3), two checks');
ok(Object.keys(FILE.file.check.T).every(k => !k.includes('.')), 'the old answers are keyed by the old local ids (no dot)');
ok(F.OLD_KEY === 'hftp-readiness2-v1' && F.KEY === 'hftp-readiness2q-v1' && F.V === 4, 'v2.7.0 reads the old key once, keeps its own key, store and file version 4');

// ---------- the saved file ----------
{
  const info = {}, r = F.cleanRec(clone(FILE.file.check), ENV, info, { file: true }), c = FILE.file.check, x = expectCarry('gx-2', c.T, c.TBy);
  ok(r && r.use === 'gx-2' && r.id === c.id, 'the file opens, same check and use case');
  ok(eq(r.T, x.T), 'answers carry over by id (carry_answer_from): ' + JSON.stringify(r.T));
  ok(eq(r.TBy, x.TBy) && r.TBy['gx-2.sk1'] === '2027-03-01' && r.TBy['gx-2.ACT_LIMITS'] === '2027-04-15' && r.TBy['gx-2.ACT_OFF'] === '2027-04-15', 'the "By when?" dates carry with their answers (x-auto to both limits questions)');
  ok(r.T['gx-2.pe1a'] === 'y' && r.T['gx-2.pe1b'] === 'y', 'a split question takes the old answer twice (pe1 to pe1a and pe1b)');
  ok(!Object.keys(r.T).some(k => !k.startsWith('gx-2.')) && !('gx-2.fi1' in r.T), 'answers to old ids that no longer exist are dropped (gx-2 fi1 has no carry_answer_from in the v2.8.0 data)');
  ok(QU['gx-2'].questions.filter(q => !q.carry_answer_from).every(q => !(q.id in r.T)), 'a question without carry_answer_from starts unanswered');
  ok(eq(info.olderList, { kept: x.kept, fresh: x.fresh }) && x.kept === 7 && x.fresh === 5, 'the page is told: 7 answers kept, 5 questions new (v2.7.1: a stored "k" is not an answer and is not kept)');
  ok(r.step === 'tailored', 'it opens on step 5 (its result needs the new questions first): ' + r.step);
  ok(eq(r.A, noK(c.A)) && eq(r.By, c.By) && r.A.m5 === 'pl' && r.By.m5 === '2027-02-01', 'must-have answers and dates migrate as they are; must-have 5\'s answer is kept');
  ok(eq(r.Q, c.Q) && r.qv === c.qv && eq(r.hotel, c.hotel), 'hotel profile and step 2 migrate as they are');
  ok(r.useName === QU['gx-2'].name && r.tqSig === TQ.uses['gx-2'].sig, 'the use case is recognised by its old catalogue name (hash) and takes the new name and signature');
  // the first unanswered step-5 question
  const first = TQ.uses['gx-2'].qs.find(q => !OK[r.T[q.id]]);
  ok(first && first.id === 'gx-2.da1', 'the first unanswered step-5 question is gx-2.da1 (its old answer was a stored "k")');
  // opened again (now in the new shape) nothing is carried twice and nothing is said
  const info2 = {}, r2 = F.cleanRec(clone(r), ENV, info2, { file: true });
  ok(eq(r2.T, r.T) && !info2.olderList && !info2.questionsChanged, 'a check already in the new shape opens unchanged, with no notice');
  // the notice text
  ok(C.OLDER_LIST === 'This check was made with an older question list. {n} kept, {m} new.', 'the notice template');
  const app = rd('src/app.js');
  ok(/id="older-list"/.test(app) && /'1 answer was' : o\.kept \+ ' answers were'/.test(app) && /'1 question is' : o\.fresh \+ ' questions are'/.test(app), 'app.js words it "N answers were kept, M questions are new" (singular for 1)');
  ok(/rec\.step === 'tailored'/.test(app) && /ui\.olderShown = true/.test(app), 'app.js opens the first unanswered step-5 question once');
}
// ---------- the browser store (old key) ----------
{
  const info = {}, s = F.migrate(clone(STORE.store), ENV, info);
  ok(s && Object.keys(s.checks).length === 2 && s.v === 4, 'the old store migrates: both checks, version 4');
  for (const k of ['gx2', 'rm1']) {
    const was = STORE.seen[k], c = s.checks[was.id], use = k === 'gx2' ? 'gx-2' : 'rm-1', x = expectCarry(use, was.T, was.TBy);
    ok(c && eq(c.T, x.T) && eq(c.TBy, x.TBy), use + ': answers carried by id with their dates');
    ok(c.A.m5 === 'pl' && c.By.m5 === '2027-02-01' && !('m2' in c.A), use + ': must-have answers kept; a stored "k" is not kept (v2.7.1)');
  }
  ok(eq(info.olderList, (() => { const w = STORE.seen[STORE.store.cur === STORE.seen.rm1.id ? 'rm1' : 'gx2']; const x = expectCarry(STORE.store.cur === STORE.seen.rm1.id ? 'rm-1' : 'gx-2', w.T, w.TBy); return { kept: x.kept, fresh: x.fresh }; })()), 'the open check\'s counts are reported for the notice: ' + JSON.stringify(info.olderList));
  const rm = s.checks[STORE.seen.rm1.id];
  ok(rm.T['rm-1.n1'] === undefined && rm.T['rm-1.or1'] === undefined && Object.keys(rm.T).length === 5 && rm.step === 'tailored', 'rm-1: 5 carried (its or1 answer was a stored "k"), the new question rm-1.n1 left blank, on step 5 (v2.7.0 reopen; v2.7.1 counts "k" as not carried)');
  // a store record opened as a file (the page's "Open a saved file" accepts it): its open check
  const app = rd('src/app.js');
  ok(/o\.checks\[o\.cur\]\) r = F\.cleanRec\(o\.checks\[o\.cur\], ENV, info, \{ file: true \}\)/.test(app) && /readStore\(tabCur\(\), F\.OLD_KEY\)/.test(app), 'app.js: a store record can be opened as a file, and the old key is read on a first visit');
}
// ---------- scoring after migration: the same formula over the new count ----------
{
  const r = F.cleanRec(clone(FILE.file.check), ENV, {}, { file: true });
  TQ.uses['gx-2'].qs.forEach(q => { if (!OK[r.T[q.id]]) r.T[q.id] = 'y'; }); r.step = 'result';
  const e = L.evaluate(r, TQ), pts = { y: 2, pl: 1, n: 0, k: 0 };
  const all = F.MUST_IDS.map(id => r.A[id]).concat(TQ.uses['gx-2'].qs.map(q => r.T[q.id]));
  ok(e.pts === all.reduce((a, v) => a + (pts[v] || 0), 0) && e.max === 2 * all.length && e.pct === Math.floor(100 * e.pts / e.max), 'after answering the new questions the score is the v2.6.1 formula over 22 questions: ' + e.pts + ' of ' + e.max);
}
// ---------- v2.8.0: saves made by v2.7 (fixtures written by the v2.7.1 code, commit 96468ce) ----------
{
  const S7 = JSON.parse(rd('tests/fixtures/v2.7-store.json')), F7 = JSON.parse(rd('tests/fixtures/v2.7-file.json')), G7 = JSON.parse(rd('tests/fixtures/v2.7-lg2-file.json'));
  const SIG7 = JSON.parse(rd('data/v27-sigs.json')).sigs, REMOVED = Q.removed_question_ids;
  /* expected, from the data file alone: a v2.7 answer carries by id unless the review rewrote the question (or it is new) */
  const expect7 = (use, T, TBy) => { const o = { T: {}, TBy: {}, kept: 0 }; QU[use].questions.forEach(q => { const a = T[q.id]; if (OK[a] && q.review !== 'Rewrite' && q.review !== 'Add') { o.T[q.id] = a; o.kept++; if (a === 'pl' && TBy[q.id]) o.TBy[q.id] = TBy[q.id]; } }); o.fresh = QU[use].questions.filter(q => q.review === 'Rewrite' || q.review === 'Add').length; return o; };
  ok(S7.key === 'hftp-readiness2q-v1' && S7.store.v === 4 && Object.keys(S7.store.checks).length === 3, 'v2.7 store fixture: key hftp-readiness2q-v1, version 4, three checks');
  ok(['fb-2', 'me-4', 'lg-2'].every(u => S7.seen[u].tqSig === SIG7[u]) && SIG7['me-4'] !== TQ.uses['me-4'].sig && TQ.uses['me-4'].prev === SIG7['me-4'], 'the fixtures carry the v2.7 signatures; the page knows them as prev');
  const info = {}, s = F.migrate(clone(S7.store), ENV, info);
  ok(s && Object.keys(s.checks).length === 3 && s.v === 4, 'the v2.7 store opens: all three checks');
  for (const use of ['fb-2', 'me-4']) {
    const w = S7.seen[use], c = s.checks[w.id], x = expect7(use, w.T, w.TBy);
    ok(c && c.use === use && eq(c.T, x.T) && eq(c.TBy, x.TBy), use + ': v2.7 answers carried by id, with dates (' + x.kept + ' kept)');
    ok((REMOVED[use] || []).every(id => !(id in c.T)) && (REMOVED[use] || []).some(id => id in w.T), use + ': answers to removed_question_ids are dropped');
    ok(QU[use].questions.filter(q => q.review === 'Rewrite').every(q => (q.id in w.T) && !(q.id in c.T)), use + ': a rewritten question starts unanswered even though v2.7 had an answer under its id');
    ok(c.step === 'tailored' && c.tqSig === TQ.uses[use].sig, use + ': opens on step 5 (new questions) with the v2.8 signature');
  }
  ok(S7.store.checks[S7.store.cur].use === 'lg-2' && info.removedUse === 'lg-2' && s.checks[S7.store.cur].use === 'none', 'the open check (lg-2) reports what the page must say: ' + JSON.stringify(info));
  // the me-4 file
  const fi = {}, r = F.cleanRec(clone(F7.file.check), ENV, fi, { file: true }), x = expect7('me-4', F7.file.check.T, F7.file.check.TBy);
  ok(r && eq(r.T, x.T) && eq(fi.olderList, { kept: x.kept, fresh: x.fresh }) && x.fresh === 3, 'v2.7 file (me-4): ' + x.kept + ' kept, 3 new (1 rewritten, 2 added); the notice says "' + C.OLDER_LIST.replace('{n}', x.kept).replace('{m}', x.fresh) + '"');
  const fi2 = {}, r2 = F.cleanRec(clone(r), ENV, fi2, { file: true });
  ok(eq(r2.T, r.T) && !fi2.olderList && !fi2.questionsChanged, 'opened again in the new shape: unchanged, no notice');
  // lg-2: opens as "None of these fits"
  for (const [what, rec] of [['store', s.checks[S7.seen['lg-2'].id]], ['file', F.cleanRec(clone(G7.file.check), ENV, null, { file: true })]]) {
    ok(rec && rec.use === 'none' && eq(rec.T, {}) && rec.dept === 'lg' && F.ctxOf(rec, ENV).whereDone && rec.step === 'result', 'lg-2 ' + what + ': opens as "None of these fits" on its result, its step-5 answers dropped');
  }
  const gi = {}; F.cleanRec(clone(G7.file.check), ENV, gi, { file: true });
  ok(gi.removedUse === 'lg-2' && !gi.useChanged && C.USE_REMOVED === 'This use case is no longer in the list. The check carries on as “None of these fits”.', 'lg-2: the page is told (removedUse), with its line; not "pick again"');
  const app = rd('src/app.js');
  ok(/id="use-removed"/.test(app) && /ui\.gone = /.test(app), 'app.js shows the line in the header until OK');
  // a v2.6.1-era check of lg-2 (catalogue name hash) opens the same way
  const old = clone(FILE.file.check); old.use = 'lg-2'; old.dept = 'lg'; old.cat = 'Administrative'; old.useName = 'x'; old.T = { pe1: 'y' }; const oi = {}, ro = F.cleanRec(old, ENV, oi, { file: true });
  ok(ro.use === 'none' && oi.removedUse === 'lg-2', 'a v2.6.1 check of lg-2 opens as "None of these fits" too');
}
done();
