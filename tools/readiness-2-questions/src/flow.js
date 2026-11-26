/* "Can AI solve your problems?" v2.8.1 (folder tools/readiness-2-questions, storage key hftp-readiness2q-v1): the explicit state
   machines (pure, no DOM). Runs in the page and in the Node tests. See CLEANUP.md for the inventory.

   1. FLOW (rec.step): where the person is in one check.
      States: 'start' (cover) | 'hotel' (1 About your hotel) | 'q' (2 Should this problem be solved by AI?) | 'stop' (Q1 = Yes: the end)
              | 'must' (3 Must-haves) | 'where' (4 Where in the hotel?) | 'tailored' (5 Questions for this use case) | 'result'
      Events: begin, next, back, change (stop → q), edit (result → q), pop(step) (browser Back/forward or a restore)
      Guards (ctx from ctxOf(rec, env)):
        hotel --next--> q only when "how the hotel is run" is chosen.
        q --next--> 'stop' when Q1 is Yes (whatever the rest); else 'must' only when all five questions are answered.
        'stop' only while Q1 is Yes; 'must', 'where', 'tailored', 'result' never while Q1 is Yes.
        must --next--> where with any must-have blank (a blank is not answered yet and does not stop Next).
        where --next--> 'tailored' with a use case; straight to 'result' with "None of these fits" (no tailored questions).
        tailored --next--> result (a blank tailored question does not stop Next).
   2. STORE (persisted in localStorage['hftp-readiness2q-v1'], and in window.storage on the claude.ai build): { v: 4, cur, checks, notice }.
      migrate() takes any saved value: a v2 to v4 store is validated (records without qv are read once through R2Logic.legacyQ); a
      v1 record becomes one check (notice 'v1', shown once); a newer version is shown, never written over (info.newer).
   3. reduce(store, ev, arg, env): the only function that changes the store. Returns { store, ok }.
      Record events: 'hotel' {k, v} | 'answer' {id, value} | 'by' {id, date} | 'cat' | 'dept' | 'use' | a FLOW event | 'pop' step
        v2.8.1 (inventory L6): the record events that change answers (hotel, answer, by, cat, dept, use) stamp rec.updated (env.now
        or the clock); nothing else does, so opening or reloading a check keeps its date.
      Store events: 'new' {same} (a blank check; the hotel carries over unless same is false: then rec.noProfile, inventory M1)
                    | 'open' id | 'remove' id | 'import' rec (from a file) | 'preselect' useId (from #use=<id>) | 'snap' snapshot
                    | 'seen' (notice read) | 'profile' {name, country, type} (shared hotel profile; refused while rec.noProfile)
   4. Page-only machines, never saved: CONFIRM (confirmNext), DOWNLOAD (dlNext), STORAGE (storageNext, v2.8.1).
   5. HISTORY (histAction / histEntry / histRead): how each step change is written into the browser's Back/forward list.
   6. TABS: mergeTabs (localStorage 'storage' events) and mergeWS (v2.8.1, read-merge-write on window.storage, inventory M3). */
(function (root) {
  'use strict';
  var V = 4, KEY = 'hftp-readiness2q-v1', OLD_KEY = 'hftp-readiness2-v1'; // v2.7.0: version 4 (new question ids), own key; v2.6.1's key is read once
  var LG = root.R2Logic, QV = LG.QV; // v2.6: the step 2 question set and legacyQ live with the rules
  var STEPS = ['start', 'hotel', 'q', 'stop', 'must', 'where', 'tailored', 'result'];
  var ORDER = ['start', 'hotel', 'q', 'must', 'where', 'tailored', 'result']; // the main line ('stop' is a side end)
  var FLOW = {
    start: { begin: 'hotel' },
    hotel: { back: 'start', next: 'q' },
    q: { back: 'hotel', next: '@q' },
    stop: { change: 'q' },
    must: { back: 'q', next: 'where' },
    where: { back: 'must', next: '@where' },
    tailored: { back: 'where', next: 'result' },
    result: { back: '@result', edit: 'q' }
  };
  var QIDS = ['q1', 'q2', 'q3', 'q4', 'q5'];
  var MUST_IDS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10'];
  /* v2.3 (owner, 24 Nov 2026): steps 3 and 5 offer the same four answers. OLD_A / OLD_T: answers saved before v2.3 ("Partly" on
     both steps, "Doesn't apply" on step 5). A saved one is kept in the record as it was (never turned into another answer) but is
     not an answer: the step is not done until the person picks again, so a check that stood on its result opens on that step. */
  // v2.7.1: 'k' is no longer an answer; a stored one reads as blank
  var Q_OK = { y: 1, n: 1, u: 1 }, A_OK = { y: 1, pl: 1, n: 1 }, T_OK = A_OK, OLD_A = { p: 1 }, OLD_T = { p: 1, na: 1 };
  var CATS = ['Commercial', 'Guest-facing', 'Operational', 'Administrative'];
  var TYPES = ['independent', 'group', 'managed'], ROLES = ['gm', 'owner', 'dept', 'it', 'fin', 'other'];
  var MAX_SNAPS = 20, MAX_CHECKS = 50, HIST_SKIP_MAX = 60;
  var DATE = /^\d{4}-\d{2}-\d{2}$/;
  function validDate(s) {
    if (typeof s !== 'string' || !DATE.test(s)) return false;
    var y = +s.slice(0, 4), m = +s.slice(5, 7), d = +s.slice(8, 10), t = new Date(Date.UTC(y, m - 1, d));
    return y >= 2000 && y <= 2100 && t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
  }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; }
  function str(v, n) { return typeof v === 'string' ? v.slice(0, n || 200) : ''; }
  var seq = 0;
  function newId() { return 'dyn' + Date.now().toString(36) + (++seq).toString(36) + Math.random().toString(36).slice(2, 6); }
  function okId(s) { return typeof s === 'string' && /^[\w-]{3,40}$/.test(s); }

  /* from: 'link' while the use case was preselected by #use=<id> and the person has not chosen one themselves (audit L3, L9).
     tqSig: the signature of the chosen use case's tailored questions when it was chosen ('' in records saved by v2.0) (audit M5). */
  /* v2.8.1: no share fields (the hub-era sharing is gone, inventory D3, council BUILD NOW 9); records and files saved earlier that
     carry them still open (cleanRec ignores them). noProfile (inventory M1): set by "A different hotel"; the shared hotel profile
     never fills this check (a field typed only later would otherwise bring the old hotel's other fields back). */
  function blank(id) { return { id: id || newId(), step: 'start', qv: QV, Qnew: [], hotel: { name: '', role: '', type: '', country: '' }, Q: {}, A: {}, By: {}, cat: '', dept: '', use: '', useName: '', from: '', tqSig: '', T: {}, TBy: {}, snaps: [], updated: '' }; }
  function copy(r) {
    var o = { id: r.id, step: r.step, qv: QV, Qnew: (r.Qnew || []).slice(), hotel: Object.assign({}, r.hotel), Q: Object.assign({}, r.Q), A: Object.assign({}, r.A), By: Object.assign({}, r.By), cat: r.cat, dept: r.dept, use: r.use, useName: r.useName || '', from: r.from === 'link' ? 'link' : '', tqSig: r.tqSig || '',
      T: Object.assign({}, r.T), TBy: Object.assign({}, r.TBy), snaps: (r.snaps || []).slice(), updated: r.updated || '' };
    if (r.noProfile) o.noProfile = true;
    return o;
  }
  /* The check as it goes into a file (council BUILD NOW 9: no hub-era fields). */
  function forFile(r) { return copy(r); }
  function localToday() { var dt = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return dt.getFullYear() + '-' + p(dt.getMonth() + 1) + '-' + p(dt.getDate()); }
  function blankStore() { var r = blank(); var s = { v: V, cur: r.id, checks: {} }; s.checks[r.id] = r; return s; }
  function cur(store) { return store.checks[store.cur]; }

  /* env: { cat: the catalogue model { depts: [{ id, cat, uses: [{ id, n }] }] }, tq: { <use id>: [{ id, na? }] } (tailored question ids per use case),
            countries: [names] (optional) } */
  function deptOf(env, id) { return (env && env.cat && env.cat.depts || []).filter(function (d) { return d.id === id; })[0] || null; }
  function useIn(env, deptId, useId) { var d = deptOf(env, deptId); return !!(d && d.uses.some(function (u) { return u.id === useId; })); }
  function useName(env, deptId, useId) { var d = deptOf(env, deptId), u = d && d.uses.filter(function (x) { return x.id === useId; })[0]; return u ? u.n : ''; }
  /* v2.7.0: the shown name is the data file's; a check saved earlier stored the catalogue's name, which the page keeps only as a
     hash (u.alias, the same FNV-1a 32-bit over UTF-16 code units as build.mjs nameHash). A saved name matches when it is the name
     now or its hash is the alias. */
  function nameHash(str0) { var h = 0x811c9dc5, t = String(str0); for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
  function nameOk(env, deptId, useId, saved) { var d = deptOf(env, deptId), u = d && d.uses.filter(function (x) { return x.id === useId; })[0]; return !!u && (saved === u.n || (!!u.alias && nameHash(saved) === u.alias)); }
  function deptOfUse(env, useId) { return (env && env.cat && env.cat.depts || []).filter(function (d) { return d.uses.some(function (u) { return u.id === useId; }); })[0] || null; }
  function tailIds(env, useId) { return ((env && env.tq && env.tq[useId]) || []).map(function (q) { return q.id; }); }
  /* env.tq: { <use id>: [{ id, carry }] } (carry: the v2.6.1 question id whose answer this question takes over, v2.7.0) */
  /* env.sig: { <use id>: signature of its tailored questions } (build.mjs); '' when the page carries none. */
  /* env.prev: { <use id>: the signature of its v2.7 question list } (v2.8.0, data/v27-sigs.json). env.removed: use ids taken off the list. */
  function prevSig(env, useId) { return (env && env.prev && useId && env.prev[useId]) || ''; }
  function tailSig(env, useId) { return (env && env.sig && useId && useId !== 'none' && env.sig[useId]) || ''; }

  function ctxOf(rec, env) {
    var Q = rec.Q || {}, A = rec.A || {}, Tt = rec.T || {}, ids = rec.use && rec.use !== 'none' ? tailIds(env, rec.use) : [];
    return {
      hotelDone: TYPES.indexOf((rec.hotel || {}).type) >= 0,
      q1Stop: Q.q1 === LG.badAns('q1'), // v2.6: Yes (fixed rules can do it)
      qDone: QIDS.every(function (id) { return !!Q_OK[Q[id]]; }),
      mustDone: MUST_IDS.every(function (id) { return !!A_OK[A[id]]; }),
      whereDone: rec.use === 'none' || (!!rec.use && useIn(env, rec.dept, rec.use) && deptOf(env, rec.dept).cat === rec.cat),
      none: rec.use === 'none',
      hasTail: ids.length > 0,
      tailDone: ids.every(function (id) { return !!T_OK[Tt[id]]; })
    };
  }
  function reachable(step, c) {
    switch (step) {
      case 'start': case 'hotel': return true;
      case 'q': return c.hotelDone;
      case 'stop': return c.hotelDone && c.q1Stop;
      case 'must': return c.hotelDone && !c.q1Stop && c.qDone;
      case 'where': return reachable('must', c); // v2.7.1: a blank must-have does not stop Next
      case 'tailored': return reachable('where', c) && c.whereDone && !c.none && c.hasTail;
      case 'result': return reachable('where', c) && c.whereDone; // v2.7.1: blank tailored questions do not stop Next
    }
    return false;
  }
  /* The step a saved or historic step lands on: itself if reachable; 'stop' for any later step while Q1 is Yes (v2.6);
     otherwise the nearest reachable step before it on the main line. Unknown values → 'start'. */
  function placeStep(step, c) {
    if (STEPS.indexOf(step) < 0) return 'start';
    if (reachable(step, c)) return step;
    if (c.q1Stop && c.hotelDone && step !== 'start' && step !== 'hotel') return 'stop';
    var i = ORDER.indexOf(step); if (i < 0) i = ORDER.indexOf('q');
    for (; i >= 0; i--) if (reachable(ORDER[i], c)) return ORDER[i];
    return 'start';
  }
  function flowNext(step, ev, c) {
    var row = FLOW[step]; if (!row || !own(row, ev)) return null;
    var to = row[ev];
    if (to === '@q') to = c.q1Stop ? 'stop' : 'must';
    else if (to === '@where') to = c.none || !c.hasTail ? 'result' : 'tailored';
    else if (to === '@result') to = c.none || !c.hasTail ? 'where' : 'tailored';
    return reachable(to, c) ? to : null;
  }
  function events(step, c) { return Object.keys(FLOW[step] || {}).filter(function (e) { return flowNext(step, e, c) !== null; }); }

  /* ---------- reading saved data ---------- */
  function cleanSnap(s) {
    s = obj(s); if (typeof s.at !== 'string' || ['ready', 'almost', 'notready', 'noinfo'].indexOf(s.level) < 0) return null;
    var n = function (v) { return typeof v === 'number' && isFinite(v) && v >= 0 ? v : 0; };
    return { at: s.at.slice(0, 40), level: s.level, pct: typeof s.pct === 'number' ? n(s.pct) : null, pts: n(s.pts), max: n(s.max), known: n(s.known), total: n(s.total), mustYes: n(s.mustYes), mustN: n(s.mustN), rules: str(s.rules, 40), use: /^[\w-]{0,20}$/.test(str(s.use, 20)) ? str(s.use, 20) : '', sig: /^[\w-]{0,40}$/.test(str(s.sig, 40)) ? str(s.sig, 40) : '' }; // sig: audit v3 L3
  }
  /* One saved check → a clean record, or null.
     info.useChanged: the saved use case was renamed in the catalogue or is no longer in it (the person picks again, step 4).
     info.questionsChanged: its tailored questions changed since it was answered (the answers are dropped; step 5 is asked again).
     (opt: unused since v2.8.1; kept so callers that pass { file: true } still work.) */
  function cleanRec(r, env, info, opt) { // eslint-disable-line no-unused-vars
    r = obj(r); if (!okId(r.id)) return null;
    var o = blank(r.id), H = obj(r.hotel), Q = obj(r.Q), A = obj(r.A), By = obj(r.By), Tt = obj(r.T), TBy = obj(r.TBy);
    o.hotel.name = str(H.name, 120); o.hotel.type = TYPES.indexOf(H.type) >= 0 ? H.type : ''; o.hotel.role = ROLES.indexOf(H.role) >= 0 ? H.role : '';
    o.hotel.country = typeof H.country === 'string' && (!env || !env.countries || env.countries.indexOf(H.country) >= 0) ? str(H.country, 40) : '';
    /* v2.6: a record without qv QV holds step 2 in the old meaning: turned round here, once (o.qv is set by blank()). */
    var legacy = r.qv !== QV, LQ = legacy ? LG.legacyQ(Q) : { Q: Q, dropped: [] };
    QIDS.forEach(function (id) { if (Q_OK[LQ.Q[id]]) o.Q[id] = LQ.Q[id]; });
    o.Qnew = (legacy ? LQ.dropped : (Array.isArray(r.Qnew) ? r.Qnew : [])).filter(function (id, i, a) { return (id === 'q3' || id === 'q4') && a.indexOf(id) === i && !o.Q[id]; });
    MUST_IDS.forEach(function (id) { if (A_OK[A[id]] || OLD_A[A[id]]) { o.A[id] = A[id]; if (A[id] === 'pl' && validDate(By[id])) o.By[id] = By[id]; } });
    o.cat = CATS.indexOf(r.cat) >= 0 ? r.cat : '';
    var d = deptOf(env, r.dept); o.dept = d && d.cat === o.cat ? d.id : '';
    o.use = r.use === 'none' ? 'none' : (typeof r.use === 'string' && o.dept && useIn(env, o.dept, r.use) ? r.use : '');
    /* v2.8.0: a use case taken off the list (lg-2) opens as "None of these fits", and the page says so (info.removedUse). */
    if (!o.use && typeof r.use === 'string' && env && env.removed && env.removed.indexOf(r.use) >= 0) { o.use = 'none'; if (!o.dept) { o.cat = ''; } if (info) info.removedUse = r.use; }
    else if (!o.use && typeof r.use === 'string' && r.use && info) info.useChanged = true; // the saved use case is no longer in the catalogue
    if (o.use && o.use !== 'none') {
      var now = useName(env, o.dept, o.use);
      if (typeof r.useName === 'string' && r.useName && !nameOk(env, o.dept, o.use, r.useName)) { o.use = ''; if (info) info.useChanged = true; }
      else o.useName = now;
    }
    if (o.use && o.use !== 'none') {
      var sigNow = tailSig(env, o.use), sigThen = typeof r.tqSig === 'string' ? r.tqSig : '';
      o.tqSig = sigNow; o.from = r.from === 'link' ? 'link' : '';
      /* v2.7.0 (questions-only): step-5 answers saved against the v2.6.1 question list are keyed by the old local ids (pe1, te1b,
         x-auto: no dot); the new ids are '<use id>.<id>'. Such answers are carried once by the data's carry_answer_from (the answer and
         its "By when?" date); a new question without one starts unanswered; answers to old ids that no longer exist are dropped.
         info.olderList = { kept, fresh }: what the page says after opening (kept: answers carried, fresh: questions still unanswered). */
      var olderList = Object.keys(Tt).some(function (k) { return k.indexOf('.') < 0; });
      if (olderList) {
        var kept = 0, qs = (env && env.tq && env.tq[o.use]) || [];
        qs.forEach(function (q) { var a = q.carry ? Tt[q.carry] : null; if (T_OK[a] || OLD_T[a]) { o.T[q.id] = a; if (a === 'pl' && validDate(TBy[q.carry])) o.TBy[q.id] = TBy[q.carry]; if (T_OK[a]) kept++; } });
        if (info) info.olderList = { kept: kept, fresh: qs.length - kept };
      }
      /* v2.8.0: answered against the v2.7 list (its signature is the use case's prev): each answer carries by question id, except for
         questions the review rewrote (k27 not set: they start unanswered); answers to ids the v2.8 list no longer has are dropped.
         info.olderList = { kept: answers carried, fresh: questions that are new or rewritten }. */
      else if (sigThen && sigNow && sigThen !== sigNow && prevSig(env, o.use) === sigThen) {
        var kept7 = 0, qs7 = (env && env.tq && env.tq[o.use]) || [];
        qs7.forEach(function (q) { var a = q.k27 ? Tt[q.id] : null; if (T_OK[a] || OLD_T[a]) { o.T[q.id] = a; if (a === 'pl' && validDate(TBy[q.id])) o.TBy[q.id] = TBy[q.id]; if (T_OK[a]) kept7++; } });
        if (info && Object.keys(Tt).length) info.olderList = { kept: kept7, fresh: qs7.filter(function (q) { return !q.k27; }).length };
      }
      else if (sigThen && sigNow && sigThen !== sigNow) { if (Object.keys(Tt).length && info) info.questionsChanged = true; } // answered against other questions: step 5 again
      else tailIds(env, o.use).forEach(function (id) { if (T_OK[Tt[id]] || OLD_T[Tt[id]]) { o.T[id] = Tt[id]; if (Tt[id] === 'pl' && validDate(TBy[id])) o.TBy[id] = TBy[id]; } });
    }
    o.snaps = (Array.isArray(r.snaps) ? r.snaps : []).map(cleanSnap).filter(Boolean).slice(-MAX_SNAPS);
    if (r.noProfile === true) o.noProfile = true; // inventory M1 (old share fields are not read: inventory D3)
    o.updated = str(r.updated, 40);
    o.step = placeStep(typeof r.step === 'string' ? r.step : 'start', ctxOf(o, env));
    /* v2.7.1: blank answers no longer hold a check back. The two cases that still reopen a result on step 5 are kept: its tailored
       questions changed (answers dropped), or a check from the older list has questions with no carried answer (v2.7.0, focus on them). */
    if (info && o.step === 'result' && (info.questionsChanged || (info.olderList && info.olderList.fresh > 0))) o.step = 'tailored';
    return o;
  }
  /* A record saved by the build before v2 ({ v: 1, step, Q, cat, dept, use, useName, A (b1..c9), By }): the five answers and the
     chosen use case map; the old steps 2 and 3 (b1..b10, c1..c9) have no counterpart and are dropped. */
  var V1_STEP = { start: 'start', q: 'q', stop: 'stop', where: 'must', needs: 'must', success: 'must', summary: 'must' };
  function fromV1(r, env, info) {
    var o = cleanRec({ id: newId(), step: V1_STEP[r.step] || 'start', Q: r.Q, cat: r.cat, dept: r.dept, use: r.use, useName: r.useName, updated: r.updated, hotel: {} }, env, info);
    return o;
  }
  /* Any saved value (parsed JSON) → a clean store or null. info (optional) is filled with what the page must say:
     info.fromV1 (a v1 record was converted), info.useChanged, info.newer (saved by a newer version: shown, never written over). */
  function migrate(raw, env, info) {
    info = info || {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    var v = raw.v == null ? 1 : raw.v;
    if (typeof v !== 'number' || v < 1) return null;
    var s = { v: V, cur: '', checks: {} };
    if (v === 1) {
      var r1 = fromV1(raw, env, info); if (!r1) return null;
      s.checks[r1.id] = r1; s.cur = r1.id;
      var kept = Object.keys(r1.Q).length || r1.use, lost = Object.keys(obj(raw.A)).length;
      if (kept || lost) { s.notice = 'v1'; info.fromV1 = true; }
      return s;
    }
    if (v > V) info.newer = true;
    if (v < V) info.older = true; // v2.6.1 (inventory v4 B4): saved by an older page (for a storage event: another tab still open on it)
    var cs = obj(raw.checks);
    /* v2.8.0 (B7): every saved check is kept, never dropped on load (MAX_CHECKS only refuses a new one, with a reason). */
    var open = own(cs, info.keep) ? info.keep : raw.cur;
    Object.keys(cs).forEach(function (k) { var one = {}, c = cleanRec(cs[k], env, k === open ? info : one); if (c && c.id === k) s.checks[k] = c; });
    if (raw.notice === 'v1') s.notice = 'v1';
    if (s.checks[open]) s.cur = open;
    else if (s.checks[raw.cur]) s.cur = raw.cur;
    else { var b = blank(); s.checks[b.id] = b; s.cur = b.id; }
    return s;
  }
  /* Is a check worth listing under "Your checks"? Anything answered or chosen by the person. A use case that only came from a
     link (#use=<id>) does not count until something is answered, so old links do not fill the list (audit L9). */
  function listed(r) { return !!(r && (Object.keys(r.Q).length || Object.keys(r.A).length || (r.use && r.from !== 'link') || (r.snaps && r.snaps.length))); }
  /* Would one more listed check go over the cap? (the open check is dropped first when it is not worth listing) */
  function full(store, rec, replacesId) {
    var n = Object.keys(store.checks).filter(function (k) { return k !== replacesId && listed(store.checks[k]); }).length;
    return n >= MAX_CHECKS;
  }

  /* ---------- the only writer ---------- */
  /* The record events that change what the person answered: they date the check (inventory L6). */
  var DATED = { hotel: 1, answer: 1, by: 1, cat: 1, dept: 1, use: 1 };
  function withRec(store, r) { var s = { v: V, cur: store.cur, checks: Object.assign({}, store.checks) }; if (store.notice) s.notice = store.notice; s.checks[r.id] = r; return s; }
  function reduce(store, ev, arg, env) {
    var no = { store: store, ok: false }, rec = cur(store), r, s, to;
    function done(r2) { if (DATED[ev]) r2.updated = (env && env.now) || new Date().toISOString(); return { store: withRec(store, r2), ok: true }; }
    switch (ev) {
      case 'hotel': {
        if (rec.step !== 'hotel' || !arg || ['name', 'role', 'type', 'country'].indexOf(arg.k) < 0 || typeof arg.v !== 'string') return no;
        var val = arg.v;
        if (arg.k === 'type' && val && TYPES.indexOf(val) < 0) return no;
        if (arg.k === 'role' && val && ROLES.indexOf(val) < 0) return no;
        if (arg.k === 'country' && val && env && env.countries && env.countries.indexOf(val) < 0) return no;
        r = copy(rec); r.hotel[arg.k] = arg.k === 'name' ? val.slice(0, 120) : val; return done(r);
      }
      case 'answer': {
        var id = arg && arg.id, v = arg && arg.value; r = copy(rec);
        /* Answers only on their own step, so no answer can make the screen being shown impossible. */
        if (QIDS.indexOf(id) >= 0 && Q_OK[v] && rec.step === 'q') { r.Q[id] = v; r.Qnew = r.Qnew.filter(function (x) { return x !== id; }); }
        else if (MUST_IDS.indexOf(id) >= 0 && A_OK[v] && rec.step === 'must') { r.A[id] = v; if (v !== 'pl') Reflect.deleteProperty(r.By, id); }
        else if (rec.step === 'tailored' && T_OK[v] && tailIds(env, rec.use).indexOf(id) >= 0) { r.T[id] = v; if (v !== 'pl') Reflect.deleteProperty(r.TBy, id); }
        else return no;
        return done(r);
      }
      case 'by': {
        if (!arg || typeof arg.date !== 'string' || (arg.date && !validDate(arg.date))) return no;
        if (arg.date && arg.date < ((env && env.today) || localToday())) return no; // "by when" cannot lie in the past (audit L5)
        r = copy(rec);
        if (rec.step === 'must' && rec.A[arg.id] === 'pl') { if (arg.date) r.By[arg.id] = arg.date; else Reflect.deleteProperty(r.By, arg.id); }
        else if (rec.step === 'tailored' && rec.T[arg.id] === 'pl') { if (arg.date) r.TBy[arg.id] = arg.date; else Reflect.deleteProperty(r.TBy, arg.id); }
        else return no;
        return done(r);
      }
      case 'cat': {
        if (CATS.indexOf(arg) < 0 || rec.step !== 'where') return no;
        r = copy(rec); r.cat = arg;
        var d0 = deptOf(env, r.dept); if (!d0 || d0.cat !== arg) { r.dept = ''; if (r.use !== 'none') { r.use = ''; r.useName = ''; r.from = ''; r.tqSig = ''; r.T = {}; r.TBy = {}; } }
        return done(r);
      }
      case 'dept': {
        var d = deptOf(env, arg); if (!d || d.cat !== rec.cat || rec.step !== 'where') return no;
        r = copy(rec); r.dept = d.id; if (r.use !== 'none' && !useIn(env, d.id, r.use)) { r.use = ''; r.useName = ''; r.from = ''; r.tqSig = ''; r.T = {}; r.TBy = {}; }
        return done(r);
      }
      case 'use': {
        if (rec.step !== 'where') return no;
        if (arg !== 'none' && !(rec.dept && useIn(env, rec.dept, arg))) return no;
        r = copy(rec);
        if (r.use !== arg) { r.T = {}; r.TBy = {}; } // the tailored questions belong to one use case
        r.use = arg; r.useName = arg === 'none' ? '' : useName(env, rec.dept, arg); r.from = ''; r.tqSig = tailSig(env, arg); return done(r); // chosen by the person: no longer "from a link"
      }
      case 'pop': {
        r = copy(rec); r.step = placeStep(arg, ctxOf(rec, env));
        return { store: withRec(store, r), ok: r.step === arg };
      }
      case 'snap': {
        if (rec.step !== 'result') return no;
        var sn = cleanSnap(arg); if (!sn) return no;
        r = copy(rec); r.snaps = r.snaps.concat([sn]).slice(-MAX_SNAPS); return done(r);
      }
      case 'profile': {
        /* The shared hotel profile fills fields that are still empty (never overwrites), on any step; never a check started for
           "A different hotel" (rec.noProfile, inventory M1). */
        if (rec.noProfile) return no;
        var pf = obj(arg); r = copy(rec); var ch = false;
        if (!r.hotel.name && typeof pf.name === 'string' && pf.name) { r.hotel.name = pf.name.slice(0, 120); ch = true; }
        if (!r.hotel.country && typeof pf.country === 'string' && pf.country && (!env || !env.countries || env.countries.indexOf(pf.country) >= 0)) { r.hotel.country = pf.country; ch = true; }
        if (!r.hotel.type && TYPES.indexOf(pf.type) >= 0) { r.hotel.type = pf.type; ch = true; }
        return ch ? done(r) : no;
      }
      case 'seen': { if (!store.notice) return no; s = { v: V, cur: store.cur, checks: store.checks }; return { store: s, ok: true }; }
      case 'new': {
        if (listed(rec) && full(store, rec)) return { store: store, ok: false, full: true }; // the cap (audit L4): said, never silently dropped
        /* v2.8.0 (B6): arg { same: false } starts with a blank hotel; otherwise (same hotel) step 1 carries over and steps 2 to 5 are new */
        r = blank(); if (!(arg && arg.same === false)) r.hotel = Object.assign({}, rec.hotel); else r.noProfile = true;
        s = withRec(store, r); s.cur = r.id;
        if (!listed(rec)) Reflect.deleteProperty(s.checks, rec.id); // an untouched check is not kept
        return { store: s, ok: true };
      }
      case 'preselect': {
        var du = deptOfUse(env, arg); if (!du) return no;
        if (rec.use === arg) return { store: store, ok: true }; // already this use case: keep the check as it is
        if (listed(rec) && full(store, rec)) return { store: store, ok: false, full: true };
        r = blank(); r.hotel = Object.assign({}, rec.hotel); r.cat = du.cat; r.dept = du.id; r.use = arg; r.useName = useName(env, du.id, arg); r.from = 'link'; r.tqSig = tailSig(env, arg);
        s = withRec(store, r); s.cur = r.id; if (!listed(rec)) Reflect.deleteProperty(s.checks, rec.id);
        return { store: s, ok: true };
      }
      case 'open': {
        if (!own(store.checks, arg) || arg === store.cur) return no;
        s = withRec(store, rec); s.cur = arg; if (!listed(rec)) Reflect.deleteProperty(s.checks, rec.id);
        var ro = copy(s.checks[arg]); ro.step = placeStep(ro.step, ctxOf(ro, env)); s.checks[arg] = ro;
        return { store: s, ok: true };
      }
      case 'remove': {
        if (!own(store.checks, arg)) return no;
        s = { v: V, cur: store.cur, checks: Object.assign({}, store.checks) }; if (store.notice) s.notice = store.notice;
        Reflect.deleteProperty(s.checks, arg);
        if (arg === store.cur) { var nb = blank(); nb.hotel = Object.assign({}, rec.hotel); s.checks[nb.id] = nb; s.cur = nb.id; }
        return { store: s, ok: true };
      }
      case 'import': {
        var ri = cleanRec(arg, env, {}); if (!ri) return no;
        if (!own(store.checks, ri.id) && listed(rec) && full(store, rec)) return { store: store, ok: false, full: true };
        s = withRec(store, ri); s.cur = ri.id; if (rec.id !== ri.id && !listed(rec)) Reflect.deleteProperty(s.checks, rec.id);
        return { store: s, ok: true };
      }
      default: {
        to = flowNext(rec.step, ev, ctxOf(rec, env)); if (to === null) return no;
        r = copy(rec); r.step = to; return done(r);
      }
    }
  }

  /* CONFIRM machine (page only, never saved): null | { kind: 'remove', id } | { kind: 'file' } (a file whose check is already here)
     | { kind: 'new' } ("same hotel or a different hotel?", v2.8.0 B6). from: the id of the control that opened it (focus goes back
     there on 'no', inventory L4). ask opens it; no / nav closes it; yes fires once, and only for the kind and id that were asked. */
  function confirmNext(c, ev, kind, id, from) {
    if (ev === 'ask') return { c: { kind: kind, id: id || '', from: from || '' }, fire: false };
    if (ev === 'yes') return { c: null, fire: !!c && c.kind === kind && (c.id || '') === (id || '') };
    if (ev === 'no' || ev === 'nav') return { c: null, fire: false };
    return { c: c, fire: false };
  }

  /* DOWNLOAD machine (page only): one file at a time; the buttons are disabled in every state but 'idle'.
     idle --start--> making --made--> saving --done|fail|timeout--> idle; making --fail--> idle. (v2.8.1: the hub's 'waiting' state and
     its 'bridge' event are gone, inventory D2; 'timeout' is the page's 60 s event while a viewer prompt is left open, inventory H1.) */
  var DL = { idle: { start: 'making' }, making: { made: 'saving', fail: 'idle' }, saving: { done: 'idle', fail: 'idle', timeout: 'idle' } };
  function dlNext(s, ev) { var row = DL[s]; return row && own(row, ev) ? row[ev] : null; }

  /* STORAGE machine (page only, v2.8.1, inventory item 3: M2, M3, L3): can this page keep the checks?
     'ok' (a write works: localStorage, or window.storage on the claude.ai build) | 'blocked' (nothing can be kept: this page's
     memory only) | 'newer' (the store was saved by a newer version: shown, never written over; nothing leaves it).
     Events: 'saved' (a write succeeded), 'failed' (no write could succeed), 'newer' (a newer store was read, from either backend).
     Start: storageStart(localStorage blocked?, window.storage present?, newer?). Never 'ok' over 'newer'. */
  var STORAGE = { ok: { saved: 'ok', failed: 'blocked', newer: 'newer' }, blocked: { saved: 'ok', failed: 'blocked', newer: 'newer' }, newer: {} };
  function storageNext(s, ev) { var row = STORAGE[s]; return row && own(row, ev) ? row[ev] : s; }
  function storageStart(lsBlocked, hasWS, newer) { return newer ? 'newer' : lsBlocked && !hasWS ? 'blocked' : 'ok'; }

  /* HISTORY machine. h = what the page knows of the current entry: { d, prev, len }.
       'push'    begin, next, change, edit (forward: a new Back/forward entry)
       'back'    in-app Back when the entry below is `to` and nobody (the hub, a hash change) pushed since: history.back()
       'replace' in-app Back otherwise, and every store event (new, open, remove, import, preselect) */
  var STORE_EVENTS = { 'new': 1, open: 1, remove: 1, 'import': 1, preselect: 1 };
  function histAction(ev, h, to, lenNow) {
    if (STORE_EVENTS[ev]) return 'replace';
    if (ev === 'back') return h && h.d > 0 && h.prev === to && h.len === lenNow ? 'back' : 'replace';
    return 'push';
  }
  function histEntry(act, h, to, from, id) {
    var d = h && typeof h.d === 'number' && h.d >= 0 ? h.d : 0;
    return act === 'push' ? { r2: to, d: d + 1, prev: from || null, id: id || '' } : { r2: to, d: d, prev: null, id: id || '' };
  }
  /* Should Back/forward pass over this entry instead of stopping on it (audit M4, L10)? h: histRead(entry).
     o: { id: the open check, d: the depth of the entry the page was on, step: the step on screen, placed: placeStep(h.step, ctx),
          run: how many entries this Back/forward press has passed over already }.
     Passed over: an entry of another check (after "Start a new check", "Open", a removal, a file or a #use= link); going back, an
     entry whose step is no longer reachable (it would show a substitute screen, e.g. the stop screen again); and, while passing
     over, an entry that would show the very screen the person is leaving. Returns -1 (go on back), 1 (go on forward) or 0 (stop here). */
  function histSkip(h, o) {
    if (!h || !h.ours || o.run >= HIST_SKIP_MAX) return 0;
    var dir = h.d > o.d ? 1 : -1;
    var bad = (!!h.id && h.id !== o.id) || (dir === -1 && o.placed !== h.step) || (o.run > 0 && h.step === o.step);
    return bad ? dir : 0;
  }
  /* Two tabs of one browser (audit M3). mine: this tab's store; theirs: what another tab just saved (already through migrate).
     The open check stays this tab's own; the other checks are taken from the other tab. elsewhere: 'changed' when the other
     tab holds different answers for the open check (this tab keeps its own until the person loads the other version),
     'removed' when the other tab removed it; null otherwise. */
  function answersOf(r) { return JSON.stringify([r.hotel, r.Q, r.A, r.By, r.cat, r.dept, r.use, r.T, r.TBy]); }
  /* opt.older (v2.6.1, inventory v4 B4): theirs was written by an older page still open in another tab (store version below V).
     Such a page drops the fields it does not know (qv), so a check this tab holds would come back in what looks like the old
     meaning and be turned round a second time. Then every check this tab already holds stays this tab's own; only checks this
     tab does not know are taken (they were made in the older page, so reading them in the old meaning is right). */
  function mergeTabs(mine, theirs, opt) {
    var rec = cur(mine), s = { v: V, cur: mine.cur, checks: {} }, elsewhere = null;
    if (theirs.notice) s.notice = theirs.notice;
    if (opt && opt.older) {
      Object.keys(mine.checks).forEach(function (k) { s.checks[k] = mine.checks[k]; });
      Object.keys(theirs.checks).forEach(function (k) { if (!own(mine.checks, k) && listed(theirs.checks[k])) s.checks[k] = theirs.checks[k]; });
      return { store: s, elsewhere: null };
    }
    Object.keys(theirs.checks).forEach(function (k) { if (k !== mine.cur && listed(theirs.checks[k])) s.checks[k] = theirs.checks[k]; });
    var other = theirs.checks[mine.cur];
    if (!other) { s.checks[rec.id] = rec; if (listed(rec)) elsewhere = 'removed'; }
    else if (answersOf(other) === answersOf(rec)) { var keep = copy(other); keep.step = rec.step; s.checks[rec.id] = keep; } // same answers: take the other tab's history
    else { s.checks[rec.id] = copy(rec); elsewhere = 'changed'; } // this tab's answers
    return { store: s, elsewhere: elsewhere };
  }
  /* v2.8.1 (inventory M3): window.storage has no 'storage' event, so before each write the page reads what is there and merges.
     mine: this tab's store; theirs: what window.storage holds now (through migrate); base: { <id>: JSON of the check } as this tab
     last read or wrote it (null before the first). The open check is always this tab's own. Another check: taken from theirs when
     this tab does not hold it and did not hold it at base (another tab added it), or when theirs changed it since base; dropped when
     this tab holds it unchanged since base and theirs no longer has it (another tab removed it). A check this tab removed (at base,
     not in mine) is not taken back. Returns { store, changed }. */
  function baseOf(store) { var b = {}; Object.keys(store.checks).forEach(function (k) { b[k] = JSON.stringify(store.checks[k]); }); return b; }
  function mergeWS(mine, theirs, base) {
    var s = { v: V, cur: mine.cur, checks: {} }, changed = false, B = base || {};
    if (mine.notice) s.notice = mine.notice;
    Object.keys(mine.checks).forEach(function (k) {
      if (k === mine.cur) { s.checks[k] = mine.checks[k]; return; }
      var t = theirs.checks[k], mj = JSON.stringify(mine.checks[k]);
      if (!t) { if (own(B, k) && B[k] === mj) { changed = true; return; } s.checks[k] = mine.checks[k]; return; } // removed in another tab
      var tj = JSON.stringify(t);
      if (tj !== mj && (!own(B, k) || B[k] !== tj)) { s.checks[k] = t; changed = true; } else s.checks[k] = mine.checks[k];
    });
    Object.keys(theirs.checks).forEach(function (k) {
      if (own(mine.checks, k) || own(B, k) || !listed(theirs.checks[k])) return;
      s.checks[k] = theirs.checks[k]; changed = true; // added in another tab
    });
    return { store: s, changed: changed };
  }
  /* print: the entry of the printable page (v2.8.1, inventory L7: Back from it returns to the page it was opened on). */
  function histRead(st) {
    if (!st || typeof st !== 'object' || STEPS.indexOf(st.r2) < 0) return { ours: false };
    return { ours: true, step: st.r2, d: typeof st.d === 'number' && st.d >= 0 ? st.d : 0, prev: STEPS.indexOf(st.prev) >= 0 ? st.prev : null, id: typeof st.id === 'string' ? st.id : '', print: st.print === 1 };
  }
  /* Progress bar: five segments for steps 1 to 5; the current one is 'now'; all done on the result; none on the cover and the stop screen. */
  function progress(step) {
    var n = { hotel: 1, q: 2, must: 3, where: 4, tailored: 5, result: 6 }[step]; if (!n) return null;
    return [1, 2, 3, 4, 5].map(function (i) { return i < n ? 'done' : i === n ? 'now' : ''; });
  }

  var api = { OLD_KEY: OLD_KEY, QV: QV, MAX_CHECKS: MAX_CHECKS, forFile: forFile, tailSig: tailSig, mergeWS: mergeWS, baseOf: baseOf, STORAGE: STORAGE, storageNext: storageNext, storageStart: storageStart, full: full, histSkip: histSkip, mergeTabs: mergeTabs, answersOf: answersOf, CUR_KEY: 'hftp-readiness2q-cur', CORRUPT_KEY: 'hftp-readiness2q-v1-corrupt',
    V: V, KEY: KEY, STEPS: STEPS, ORDER: ORDER, FLOW: FLOW, QIDS: QIDS, MUST_IDS: MUST_IDS, CATS: CATS, TYPES: TYPES, ROLES: ROLES, MAX_SNAPS: MAX_SNAPS,
    validDate: validDate, newId: newId, blank: blank, blankStore: blankStore, cur: cur, ctxOf: ctxOf, reachable: reachable, placeStep: placeStep, flowNext: flowNext, events: events,
    cleanRec: cleanRec, migrate: migrate, listed: listed, reduce: reduce, confirmNext: confirmNext, DL: DL, dlNext: dlNext,
    nameHash: nameHash, nameOk: nameOk, histAction: histAction, histEntry: histEntry, histRead: histRead, progress: progress, deptOfUse: deptOfUse, tailIds: tailIds };
  root.R2Flow = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
