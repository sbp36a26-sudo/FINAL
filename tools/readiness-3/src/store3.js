/* Do you need AI? v3 (tools/readiness-3): one check as a record, the flow between screens, saved files and the migration of
   readiness-2 (v2.6.1 / v2.7) checks. Pure, no DOM; runs in the page and in the Node tests (tests/store3.test.mjs).

   Record (one per check, stored under its own key, see app3.js):
     { id, step, hotel: { name, type, role, country }, step2: { s1..s5 }, mh: { m1..m11 }, use: '' | <use id> | 'none',
       gates: { <use id or 'none'>: { <gate id>: <option key> } }, qa: { <question id>: answer }, cont: '' | 's1' | 's2' | 's1,s2',
       imported: null | { from: '2.6.1', n, dropped, seen }, timing: absent | { <step>: [enterISO, leaveISO, ms] } (only with ?session=1, see app3.js), created, updated }
   Answers: step 2 yes | no | dk; must-haves yes | planned | no | dk, and na on m2 and m4 only; use-case questions yes | planned | no | dk.
   Gates are kept per use case, so changing the use case never carries a "How it works" answer to another use case. Answers to
   questions that are hidden now are kept and never count (R3Rules.visible decides what counts).
   cont: the soft stop that "Continue anyway" was pressed for (the ids of s1/s2 answered No at that moment). A new or another
   soft stop needs a new "Continue anyway".

   Steps: start (cover) | hotel (1) | s2 (2) | stop (the soft stop screen) | must (3) | where (4) | use (5) | result.
   next/back never lose answers. A step after s2 is not reachable while a soft stop stands that was not continued. */
(function (root) {
  'use strict';
  var R = root.R3Rules;
  var FILE_KIND = 'hftp-do-you-need-ai', FILE_V = 4, RULES = '3.0';
  var APP = '3.0.1'; /* the tool version, written into saved files (app) */
  var STEPS = ['start', 'hotel', 's2', 'stop', 'must', 'where', 'use', 'result'];
  var NUM = { hotel: 1, s2: 2, stop: 2, must: 3, where: 4, use: 5 };
  var S2_OK = { yes: 1, no: 1, dk: 1 }, CHK_OK = { yes: 1, planned: 1, no: 1, dk: 1 };
  var TYPES = ['independent', 'group', 'managed'], ROLES = ['gm', 'owner', 'dept', 'it', 'fin', 'other'];

  function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; }
  function str(v, n) { return typeof v === 'string' ? v.slice(0, n || 200) : ''; }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  var seq = 0;
  function newId() { return 'c' + Date.now().toString(36) + (++seq).toString(36) + Math.random().toString(36).slice(2, 6); }
  function okId(s) { return typeof s === 'string' && /^[A-Za-z0-9_-]{3,40}$/.test(s); }
  function now() { return new Date().toISOString(); }
  function blank(id) { var t = now(); return { id: id || newId(), step: 'start', hotel: { name: '', type: '', role: '', country: '' }, step2: {}, mh: {}, use: '', gates: {}, qa: {}, cont: '', imported: null, created: t, updated: t }; }

  function useOf(D, id) { for (var i = 0; i < D.use_cases.length; i++) if (D.use_cases[i].id === id) return D.use_cases[i]; return null; }
  function gateKey(rec) { return rec.use === 'none' || !rec.use ? 'none' : rec.use; }
  function gatesOf(rec) { return obj(rec.gates[gateKey(rec)]); }
  function stopKey(D, rec) { var s = R.softStop(D, rec.step2); return s ? s.ids.join(',') : ''; }
  function continued(D, rec) { var k = stopKey(D, rec); return !!k && rec.cont === k; }
  function stopped(D, rec) { return !!stopKey(D, rec) && !continued(D, rec); }
  /* What R3Rules.evaluate takes. No use case chosen counts as "None of these fits" (§6.5: the fallback). */
  function answers(D, rec) { return { use: rec.use && rec.use !== 'none' ? rec.use : 'none', step2: rec.step2, gates: gatesOf(rec), mh: rec.mh, qa: rec.qa, continued: continued(D, rec) }; }

  /* A clean record from anything saved (null when it is not one). Values it does not know are dropped, never turned into other answers.
     Every lookup is an own-property check, so a value named after an Object.prototype member ("constructor", "toString") is dropped. */
  function clean(D, r) {
    r = obj(r); if (!okId(r.id)) return null;
    var o = blank(r.id), H = obj(r.hotel);
    o.hotel.name = str(H.name, 120); o.hotel.country = str(H.country, 60);
    o.hotel.type = TYPES.indexOf(H.type) >= 0 ? H.type : ''; o.hotel.role = ROLES.indexOf(H.role) >= 0 ? H.role : '';
    var s2 = obj(r.step2); D.step2.forEach(function (s) { if (own(S2_OK, s2[s.id])) o.step2[s.id] = s2[s.id]; });
    var mh = obj(r.mh); D.must_haves.forEach(function (m) { var a = mh[m.id]; if (own(CHK_OK, a) || (a === 'na' && m.na)) o.mh[m.id] = a; });
    o.use = r.use === 'none' ? 'none' : useOf(D, r.use) ? r.use : '';
    var G = obj(r.gates);
    Object.keys(G).forEach(function (k) {
      if (k !== 'none' && !useOf(D, k)) return;
      var list = R.askedGates(D, k), g = obj(G[k]), out = {};
      list.forEach(function (gt) { if (gt.options.some(function (x) { return x.key === g[gt.id]; })) out[gt.id] = g[gt.id]; });
      if (Object.keys(out).length) o.gates[k] = out;
    });
    var known = qIds(D), qa = obj(r.qa); Object.keys(qa).forEach(function (id) { if (own(known, id) && own(CHK_OK, qa[id])) o.qa[id] = qa[id]; });
    o.cont = typeof r.cont === 'string' && /^(s1|s2|s1,s2)$/.test(r.cont) ? r.cont : '';
    var im = r.imported && obj(r.imported);
    if (im && im.from) o.imported = { from: str(im.from, 20), n: +im.n || 0, dropped: +im.dropped || 0, seen: !!im.seen };
    o.created = str(r.created, 40) || o.created; o.updated = str(r.updated, 40) || o.updated;
    var tm = cleanTiming(r.timing); if (tm) o.timing = tm;
    o.step = STEPS.indexOf(r.step) >= 0 ? r.step : 'start';
    o.step = place(D, o);
    return o;
  }
  /* Session timing (?session=1): { <step>: [enterISO, leaveISO, ms] }; anything else is dropped. */
  function cleanTiming(t) {
    t = obj(t); var out = {}, n = 0;
    STEPS.forEach(function (k) {
      var v = t[k]; if (!Array.isArray(v) || typeof v[0] !== 'string') return;
      out[k] = [str(v[0], 40), str(v[1], 40), typeof v[2] === 'number' && isFinite(v[2]) && v[2] >= 0 ? Math.round(v[2]) : 0]; n++;
    });
    return n ? out : null;
  }
  var QIDS = null;
  /* Every question id a record may hold: the use-case questions, the fallback questions and the gate-added ones of None fits. */
  function qIds(D) {
    if (QIDS && QIDS.D === D) return QIDS.ids;
    var ids = {}; D.use_cases.forEach(function (u) { u.questions.forEach(function (q) { ids[q.id] = 1; }); });
    D.none_fits.questions.forEach(function (q) { ids[q.id] = 1; }); Object.keys(D.gate_questions).forEach(function (k) { ids['none.' + k] = 1; });
    QIDS = { D: D, ids: ids }; return ids;
  }

  /* A step that cannot be shown now moves to the nearest one that can (a stop not continued: the stop screen). */
  function place(D, rec) {
    var s = rec.step;
    if (s === 'stop' && !stopped(D, rec)) return 'must';
    if (['must', 'where', 'use', 'result'].indexOf(s) >= 0 && stopped(D, rec)) return 'stop';
    return s;
  }
  function next(D, rec) {
    switch (rec.step) {
      case 'start': return 'hotel';
      case 'hotel': return 's2';
      case 's2': return stopped(D, rec) ? 'stop' : 'must';
      case 'must': return 'where';
      case 'where': return 'use';
      case 'use': return 'result';
    }
    return rec.step;
  }
  function back(D, rec) { return { hotel: 'start', s2: 'hotel', stop: 's2', must: 's2', where: 'must', use: 'where', result: 'use' }[rec.step] || 'start'; }

  /* Unanswered items per screen, in screen order (ids). */
  function open(D, rec, step) {
    var A = answers(D, rec);
    if (step === 's2') return D.step2.filter(function (s) { return !rec.step2[s.id]; }).map(function (s) { return s.id; });
    if (step === 'must') return D.must_haves.filter(function (m) { return !rec.mh[m.id]; }).map(function (m) { return m.id; });
    if (step === 'use') {
      var g = R.askedGates(D, A.use).filter(function (x) { return !A.gates[x.id]; }).map(function (x) { return 'gate:' + x.id; });
      return g.concat(R.visible(D, A.use, A.gates).filter(function (q) { return !rec.qa[q.id]; }).map(function (q) { return q.id; }));
    }
    return [];
  }
  function openCount(D, rec) { return open(D, rec, 's2').length + open(D, rec, 'must').length + (rec.use ? open(D, rec, 'use').length : 0); }
  /* The first screen with something to answer (after an import): step 2, the must-haves, the picker, step 5, else the result. */
  function firstOpen(D, rec) {
    if (open(D, rec, 's2').length) return 's2';
    if (stopped(D, rec)) return 'stop';
    if (open(D, rec, 'must').length) return 'must';
    if (!rec.use) return 'where';
    if (open(D, rec, 'use').length) return 'use';
    return 'result';
  }
  /* hasAnswers: something was answered (step 2, a must-have, a use case, a How it works answer or a question). It decides what is
     listed under "Your checks" and whether "Start a new check" asks first. The hotel name alone does not count, because a new
     check carries it over. hasContent: also the hotel details (worth saving as a file). */
  function hasAnswers(rec) {
    if (!rec) return false;
    var g = obj(rec.gates);
    return !!(Object.keys(rec.step2).length || Object.keys(rec.mh).length || rec.use || Object.keys(rec.qa).length || Object.keys(g).some(function (k) { return Object.keys(obj(g[k])).length; }));
  }
  function hasContent(rec) { return !!(rec && (hasAnswers(rec) || rec.hotel.name || rec.hotel.type || rec.hotel.role || rec.hotel.country)); }

  /* ---------- saved files ---------- */
  function fileDoc(rec, savedAt) { return { kind: FILE_KIND, v: FILE_V, rules: RULES, app: APP, savedAt: savedAt || now(), check: JSON.parse(JSON.stringify(rec)) }; }
  /* Any parsed file → { rec, info }, { newer: true } (a file of a later version of this tool: "Open it there.") or null ("This file
     isn't a saved check from this tool."). A v4 file is a v3 check; files of version 3 and earlier come from readiness-2 (v2.x) and
     are migrated. MIG: the build-time migration table. */
  function readFile(D, MIG, doc) {
    doc = obj(doc);
    if (doc.kind !== FILE_KIND || typeof doc.v !== 'number' || !doc.check) return null;
    if (doc.v > FILE_V) return { newer: true };
    if (doc.v === FILE_V) { var r = clean(D, doc.check); return r ? { rec: r, info: { v3: true } } : null; }
    if (doc.v >= 2) return fromV2(D, MIG, doc.check);
    return null;
  }
  /* Opening a file whose check is already in this browser: 'replace' when the file is as new as the stored one or newer, 'copy' when
     this browser holds a newer version (the file then opens as a copy with a new id, and the stored check stays as it is).
     stored: the stored record or null. */
  function openMode(fileRec, stored) { return stored && String(stored.updated || '') > String(fileRec.updated || '') ? 'copy' : 'replace'; }

  /* ---------- migration of readiness-2 checks (§6.6) ---------- */
  var OLD = { y: 'yes', pl: 'planned', n: 'no', k: 'dk' }, OLD_S2 = { y: 'yes', n: 'no', u: 'dk' };
  /* old: one readiness-2 record (store or file). Returns { rec, info: { from, n, dropped, carried } } or null.
     - hotel profile kept (name, type, role, country);
     - step 2: q2..q5 → s2..s5 and the old uncertainty answer (u) → Don't know yet; q1 is turned round for a v2.6+ record (qv 2: old Yes = fixed
       rules can do it = new No); a record from before v2.6 (no qv) already asked q1 the v3 way round, so it is kept, and its old
       questions 3 and 4 (other questions then) are not carried;
     - must-haves 1-10 → m1-m10 (m5 reworded, answer kept); "Partly" (p, before v2.3) is not carried; m11 starts empty;
     - use-case answers by question id through MIG.map (kept, fixed, rewritten: same id; split: both parts take the answer);
       merged and removed questions are dropped and counted; answers given to an older set of questions (tqSig differs from the
       v2.6.1 one) are not carried either and counted;
     - the "How it works" questions start empty;
     - imported.n ("please answer N new questions") counts only questions that did not exist in v2.6.1 and are open now: m11, the
       How it works questions, use-case questions no old answer maps to (new, gate-added, None fits), and for a record from before
       v2.6, questions 3 and 4 of step 2. Old questions left unanswered are not new and are not counted. */
  function fromV2(D, MIG, old) {
    old = obj(old); if (!okId(old.id)) return null;
    var r = blank(old.id), H = obj(old.hotel), Q = obj(old.Q), A = obj(old.A), T = obj(old.T), dropped = 0, carried = 0;
    function O(x) { return own(OLD, x) ? OLD[x] : ''; }
    function O2(x) { return own(OLD_S2, x) ? OLD_S2[x] : ''; }
    r.hotel = { name: str(H.name, 120), type: TYPES.indexOf(H.type) >= 0 ? H.type : '', role: ROLES.indexOf(H.role) >= 0 ? H.role : '', country: str(H.country, 60) };
    var v26 = old.qv === 2;
    var q1 = O2(Q.q1); if (q1) r.step2.s1 = v26 ? (q1 === 'yes' ? 'no' : q1 === 'no' ? 'yes' : 'dk') : q1;
    ['q2', 'q3', 'q4', 'q5'].forEach(function (k) { if (!v26 && (k === 'q3' || k === 'q4')) return; var a = O2(Q[k]); if (a) r.step2['s' + k.slice(1)] = a; });
    for (var i = 1; i <= 10; i++) { var a = O(A['m' + i]); if (a) r.mh['m' + i] = a; }
    var use = old.use === 'none' ? 'none' : useOf(D, old.use) ? old.use : '';
    r.use = use;
    if (use && use !== 'none') {
      var m = (MIG.map || {})[use] || {}, sigOk = !old.tqSig || !MIG.sig || !MIG.sig[use] || old.tqSig === MIG.sig[use];
      Object.keys(T).forEach(function (qid) {
        var a = O(T[qid]);
        if (!a) return;
        if (!sigOk || !own(m, qid) || !m[qid].length) { dropped++; return; }
        m[qid].forEach(function (nid) { r.qa[nid] = a; }); carried++;
      });
    }
    r.updated = now();
    var n = newOpen(D, MIG, r, v26).length;
    r.imported = { from: '2.6.1', n: n, dropped: dropped, seen: false };
    r.step = firstOpen(D, r);
    return { rec: r, info: { from: '2.6.1', n: n, dropped: dropped, carried: carried } };
  }
  /* The open items of an imported check that did not exist in v2.6.1 (see fromV2). */
  function newOpen(D, MIG, r, v26) {
    var out = [];
    if (!v26) ['s3', 's4'].forEach(function (id) { if (!r.step2[id]) out.push(id); });
    if (!r.mh.m11) out.push('m11');
    if (r.use) {
      var A = answers(D, r), old = {}, m = r.use !== 'none' ? (MIG.map || {})[r.use] || {} : {};
      Object.keys(m).forEach(function (k) { m[k].forEach(function (id) { old[id] = 1; }); });
      R.askedGates(D, A.use).forEach(function (g) { if (!A.gates[g.id]) out.push('gate:' + g.id); });
      R.visible(D, A.use, A.gates).forEach(function (q) { if (!r.qa[q.id] && !own(old, q.id)) out.push(q.id); });
    }
    return out;
  }
  /* A readiness-2 browser store ({ v: 2 | 3, cur, checks }) → [{ rec, info }] for every check with answers, the open one first. */
  function fromV2Store(D, MIG, raw) {
    raw = obj(raw); if (typeof raw.v !== 'number' || raw.v < 2 || raw.v > 3) return [];
    var cs = obj(raw.checks), keys = Object.keys(cs).sort(function (a, b) { return (b === raw.cur) - (a === raw.cur); });
    return keys.map(function (k) { var c = obj(cs[k]); if (!Object.keys(obj(c.Q)).length && !Object.keys(obj(c.A)).length && !c.use) return null; return fromV2(D, MIG, c); }).filter(Boolean);
  }

  var api = { APP: APP, FILE_KIND: FILE_KIND, FILE_V: FILE_V, RULES: RULES, STEPS: STEPS, NUM: NUM, TYPES: TYPES, ROLES: ROLES,
    blank: blank, newId: newId, clean: clean, place: place, next: next, back: back, open: open, openCount: openCount, firstOpen: firstOpen,
    answers: answers, gatesOf: gatesOf, gateKey: gateKey, stopKey: stopKey, continued: continued, stopped: stopped, hasAnswers: hasAnswers, hasContent: hasContent, useOf: useOf,
    fileDoc: fileDoc, readFile: readFile, openMode: openMode, newOpen: newOpen, fromV2: fromV2, fromV2Store: fromV2Store };
  root.R3Store = api;
})(typeof self !== 'undefined' ? self : this);
