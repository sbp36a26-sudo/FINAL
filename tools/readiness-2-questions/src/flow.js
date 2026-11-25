/* Do you need AI? v2 (folder, tool id and storage key keep the name readiness-2): the explicit state machines (pure, no DOM).
   Runs in the page and in the Node tests. See CLEANUP.md for the inventory.

   1. FLOW (rec.step): where the person is in one check.
      States: 'start' (cover) | 'hotel' (1 About your hotel) | 'q' (2 Is this an AI problem?) | 'stop' (Q1 = No: the end)
              | 'must' (3 Must-haves) | 'where' (4 Where in the hotel?) | 'tailored' (5 Questions for this use case) | 'result'
      Events: begin, next, back, change (stop → q), edit (result → q), pop(step) (browser Back/forward or a restore)
      Guards (ctx from ctxOf(rec, env)):
        hotel --next--> q only when "how the hotel is run" is chosen.
        q --next--> 'stop' when Q1 is Yes (v2.6; whatever the rest); else 'must' only when all five questions are answered.
        'stop' only while Q1 is Yes; 'must', 'where', 'tailored', 'result' never while Q1 is Yes. (ctx.q1Stop; before v2.6 the
        stop answer was No.)
        must --next--> where with any must-have blank (v2.7.1: a blank is not answered yet and does not stop Next).
        where --next--> 'tailored' with a use case; straight to 'result' with "None of these fits" (no tailored questions).
        tailored --next--> result (v2.7.1: a blank tailored question does not stop Next).
   2. STORE (persisted in localStorage['hftp-readiness2q-v1']): { v: 3, cur: <check id>, checks: { <id>: rec }, notice }.
      v2.6: store and file version 3, so a page of v2.5 or earlier (another open tab) treats the store as newer and never writes
      it back without the records' qv. Each record carries qv (R2Logic.QV, the step 2 question set): a record without it is
      read once through R2Logic.legacyQ (question 1 turned round; the old questions 3 and 4 dropped and listed in Qnew).
      migrate() takes any saved value: a v2 store is validated; a v1 record (the build before 24 Nov 2026) becomes one check
      that keeps the five answers and the chosen use case, drops the rest and sets notice 'v1' (shown once).
   3. reduce(store, ev, arg, env): the only function that changes the store. Returns { store, ok }.
      Record events: 'hotel' {k, v} | 'answer' {id, value} | 'by' {id, date} | 'cat' | 'dept' | 'use' | a FLOW event | 'pop' step
      Store events: 'new' (a blank check; the hotel details carry over) | 'open' id | 'remove' id | 'import' rec (from a file)
                    | 'preselect' useId (from #use=<id>: a new check with that use case chosen) | 'snap' snapshot | 'seen' (notice read) | 'profile' {name, country, type} (shared hotel profile)
                    | 'share' {named} | 'shared' {id, at, mode, sig} | 'unshared' {id}  (id: the check the copy belongs to, open or not; v2.1)
      v2.1 (24 Nov 2026, clean-up audit): a check carries from ('link' when it was started by #use=<id>) and tqSig (the signature of
      the tailored questions it was answered against); snapshots carry their use case; the store is capped when a check is added.
   4. CONFIRM (confirmNext), BRIDGE (bridgeNext), DOWNLOAD (dlNext), SHARE (shareNext): page-only machines, never saved.
   5. HISTORY (histAction / histEntry / histRead): how each step change is written into the browser's Back/forward list. */
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
  function blank(id) { return { id: id || newId(), step: 'start', qv: QV, Qnew: [], hotel: { name: '', role: '', type: '', country: '' }, Q: {}, A: {}, By: {}, cat: '', dept: '', use: '', useName: '', from: '', tqSig: '', T: {}, TBy: {}, snaps: [], share: { named: false }, sharedAt: null, sharedMode: null, sharedSig: null, updated: '' }; }
  function copy(r) {
    return { id: r.id, step: r.step, qv: QV, Qnew: (r.Qnew || []).slice(), hotel: Object.assign({}, r.hotel), Q: Object.assign({}, r.Q), A: Object.assign({}, r.A), By: Object.assign({}, r.By), cat: r.cat, dept: r.dept, use: r.use, useName: r.useName || '', from: r.from === 'link' ? 'link' : '', tqSig: r.tqSig || '',
      T: Object.assign({}, r.T), TBy: Object.assign({}, r.TBy), snaps: (r.snaps || []).slice(), share: { named: !!(r.share && r.share.named) }, sharedAt: r.sharedAt || null, sharedMode: r.sharedMode || null, sharedSig: r.sharedSig || null, updated: r.updated || '' };
  }
  /* The check as it goes into a file: whether a copy was shared belongs to this browser, not to the file (audit L11). */
  function forFile(r) { var o = copy(r); o.sharedAt = null; o.sharedMode = null; o.sharedSig = null; return o; }
  /* Audit v3 H1, M4: one rule for every replacement of a check's answers (a file, another tab's version kept or not):
     the share fields come from the browser's own record, never from what replaces it. */
  function keepShare(to, had) { if (had) { to.sharedAt = had.sharedAt || null; to.sharedMode = had.sharedMode || null; to.sharedSig = had.sharedSig || null; } return to; }
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
     opt.file: the record comes from a file, so its share fields are ignored (audit L11). */
  function cleanRec(r, env, info, opt) {
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
    if (!o.use && typeof r.use === 'string' && r.use && info) info.useChanged = true; // the saved use case is no longer in the catalogue
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
      else if (sigThen && sigNow && sigThen !== sigNow) { if (Object.keys(Tt).length && info) info.questionsChanged = true; } // answered against other questions: step 5 again
      else tailIds(env, o.use).forEach(function (id) { if (T_OK[Tt[id]] || OLD_T[Tt[id]]) { o.T[id] = Tt[id]; if (Tt[id] === 'pl' && validDate(TBy[id])) o.TBy[id] = TBy[id]; } });
    }
    o.snaps = (Array.isArray(r.snaps) ? r.snaps : []).map(cleanSnap).filter(Boolean).slice(-MAX_SNAPS);
    o.share = { named: !!obj(r.share).named };
    o.sharedAt = typeof r.sharedAt === 'string' ? r.sharedAt.slice(0, 40) : null; o.sharedMode = r.sharedMode === 'shared' || r.sharedMode === 'local' ? r.sharedMode : null; o.sharedSig = typeof r.sharedSig === 'string' ? r.sharedSig.slice(0, 4000) : null;
    if (!o.sharedAt || (opt && opt.file)) { o.sharedAt = null; o.sharedMode = null; o.sharedSig = null; }
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
    /* At most MAX_CHECKS: the open one (info.keep: this tab's; else the store's) always, then the newest by "last changed" (audit L4). */
    var open = own(cs, info.keep) ? info.keep : raw.cur;
    var keys = Object.keys(cs).sort(function (a, b) { return (b === open) - (a === open) || String(obj(cs[b]).updated || '').localeCompare(String(obj(cs[a]).updated || '')); }).slice(0, MAX_CHECKS);
    Object.keys(cs).forEach(function (k) { if (keys.indexOf(k) < 0) return; var one = {}, c = cleanRec(cs[k], env, k === open ? info : one); if (c && c.id === k) s.checks[k] = c; });
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
  function withRec(store, r) { var s = { v: V, cur: store.cur, checks: Object.assign({}, store.checks) }; if (store.notice) s.notice = store.notice; s.checks[r.id] = r; return s; }
  function reduce(store, ev, arg, env) {
    var no = { store: store, ok: false }, rec = cur(store), r, s, to;
    function done(r2) { return { store: withRec(store, r2), ok: true }; }
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
        else if (MUST_IDS.indexOf(id) >= 0 && A_OK[v] && rec.step === 'must') { r.A[id] = v; if (v !== 'pl') delete r.By[id]; }
        else if (rec.step === 'tailored' && T_OK[v] && tailIds(env, rec.use).indexOf(id) >= 0) { r.T[id] = v; if (v !== 'pl') delete r.TBy[id]; }
        else return no;
        return done(r);
      }
      case 'by': {
        if (!arg || typeof arg.date !== 'string' || (arg.date && !validDate(arg.date))) return no;
        if (arg.date && arg.date < ((env && env.today) || localToday())) return no; // "by when" cannot lie in the past (audit L5)
        r = copy(rec);
        if (rec.step === 'must' && rec.A[arg.id] === 'pl') { if (arg.date) r.By[arg.id] = arg.date; else delete r.By[arg.id]; }
        else if (rec.step === 'tailored' && rec.T[arg.id] === 'pl') { if (arg.date) r.TBy[arg.id] = arg.date; else delete r.TBy[arg.id]; }
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
      case 'share': { if (rec.step !== 'result') return no; r = copy(rec); r.share = { named: !!(arg && arg.named) }; return done(r); }
      /* A copy belongs to its check, not to the screen: arg.id names the check, open or not, on any step (audit H1, M2). */
      case 'shared': { if (!arg || typeof arg.at !== 'string') return no; var cs1 = arg.id == null ? rec : (own(store.checks, arg.id) ? store.checks[arg.id] : null); if (!cs1) return no; r = copy(cs1); r.sharedAt = arg.at; r.sharedMode = arg.mode === 'shared' ? 'shared' : 'local'; r.sharedSig = str(arg.sig, 4000); return done(r); }
      case 'unshared': { var cs2 = !arg || arg.id == null ? rec : (own(store.checks, arg.id) ? store.checks[arg.id] : null); if (!cs2) return no; r = copy(cs2); r.sharedAt = null; r.sharedMode = null; r.sharedSig = null; return done(r); }
      case 'profile': {
        /* The shared hotel profile fills fields that are still empty (never overwrites), on any step. */
        var pf = obj(arg); r = copy(rec); var ch = false;
        if (!r.hotel.name && typeof pf.name === 'string' && pf.name) { r.hotel.name = pf.name.slice(0, 120); ch = true; }
        if (!r.hotel.country && typeof pf.country === 'string' && pf.country && (!env || !env.countries || env.countries.indexOf(pf.country) >= 0)) { r.hotel.country = pf.country; ch = true; }
        if (!r.hotel.type && TYPES.indexOf(pf.type) >= 0) { r.hotel.type = pf.type; ch = true; }
        return ch ? done(r) : no;
      }
      case 'seen': { if (!store.notice) return no; s = { v: V, cur: store.cur, checks: store.checks }; return { store: s, ok: true }; }
      case 'new': {
        if (listed(rec) && full(store, rec)) return { store: store, ok: false, full: true }; // the cap (audit L4): said, never silently dropped
        r = blank(); r.hotel = Object.assign({}, rec.hotel); // the hotel details carry over to the next check
        s = withRec(store, r); s.cur = r.id;
        if (!listed(rec)) delete s.checks[rec.id]; // an untouched check is not kept
        return { store: s, ok: true };
      }
      case 'preselect': {
        var du = deptOfUse(env, arg); if (!du) return no;
        if (rec.use === arg) return { store: store, ok: true }; // already this use case: keep the check as it is
        if (listed(rec) && full(store, rec)) return { store: store, ok: false, full: true };
        r = blank(); r.hotel = Object.assign({}, rec.hotel); r.cat = du.cat; r.dept = du.id; r.use = arg; r.useName = useName(env, du.id, arg); r.from = 'link'; r.tqSig = tailSig(env, arg);
        s = withRec(store, r); s.cur = r.id; if (!listed(rec)) delete s.checks[rec.id];
        return { store: s, ok: true };
      }
      case 'open': {
        if (!own(store.checks, arg) || arg === store.cur) return no;
        s = withRec(store, rec); s.cur = arg; if (!listed(rec)) delete s.checks[rec.id];
        var ro = copy(s.checks[arg]); ro.step = placeStep(ro.step, ctxOf(ro, env)); s.checks[arg] = ro;
        return { store: s, ok: true };
      }
      case 'remove': {
        if (!own(store.checks, arg)) return no;
        s = { v: V, cur: store.cur, checks: Object.assign({}, store.checks) }; if (store.notice) s.notice = store.notice;
        delete s.checks[arg];
        if (arg === store.cur) { var nb = blank(); nb.hotel = Object.assign({}, rec.hotel); s.checks[nb.id] = nb; s.cur = nb.id; }
        return { store: s, ok: true };
      }
      case 'import': {
        var ri = cleanRec(arg, env, {}, { file: true }); if (!ri) return no;
        /* Audit v3 H1: the share fields of a check belong to this browser and survive any replacement of its answers. A file
           replacing a check whose copy is shared keeps that copy known (shareStale() marks it out of date when the answers differ). */
        keepShare(ri, own(store.checks, ri.id) ? store.checks[ri.id] : null);
        if (!own(store.checks, ri.id) && listed(rec) && full(store, rec)) return { store: store, ok: false, full: true };
        s = withRec(store, ri); s.cur = ri.id; if (rec.id !== ri.id && !listed(rec)) delete s.checks[rec.id];
        return { store: s, ok: true };
      }
      default: {
        to = flowNext(rec.step, ev, ctxOf(rec, env)); if (to === null) return no;
        r = copy(rec); r.step = to; return done(r);
      }
    }
  }

  /* CONFIRM machine (page only, never saved): null | { kind: 'remove', id } | { kind: 'file' } (a file whose check is already here).
     ask opens it; no / nav closes it; yes fires once, and only for the kind and id that were asked. */
  function confirmNext(c, ev, kind, id) {
    if (ev === 'ask') return { c: { kind: kind, id: id || '' }, fire: false };
    if (ev === 'yes') return { c: null, fire: !!c && c.kind === kind && (c.id || '') === (id || '') };
    if (ev === 'no' || ev === 'nav') return { c: null, fire: false };
    return { c: c, fire: false };
  }

  /* BRIDGE machine (page only), the readiness check's own: does the hub bar save files for us?
     'none' (not in a frame) | 'pending' (asked the hub with ping) | 'yes' | 'no' (pong false, cannot post, or the 12 s 'timeout' event). */
  var BRIDGE = { pending: { yes: 'yes', no: 'no', timeout: 'no', error: 'no' } };
  function bridgeNext(s, ev) { var row = BRIDGE[s]; return row && row[ev] ? row[ev] : s; }

  /* DOWNLOAD machine (page only): one file at a time; the buttons are disabled in every state but 'idle'.
     idle --start--> making --made--> waiting (BRIDGE still pending) | saving --done|fail--> idle; waiting --bridge--> saving. */
  var DL = { idle: { start: 'making' }, making: { made: '@made', fail: 'idle' }, waiting: { bridge: 'saving', fail: 'idle' }, saving: { done: 'idle', fail: 'idle' } };
  function dlNext(s, ev, bridge) {
    var row = DL[s]; if (!row || !own(row, ev)) return null;
    var to = row[ev];
    if (to === '@made') to = bridge === 'pending' ? 'waiting' : 'saving';
    if (s === 'waiting' && ev === 'bridge' && bridge === 'pending') return null;
    return to;
  }

  /* SHARE machine (page only; the readiness check's): 'idle' | 'shared' (settled, from the record) | 'sending' | 'withdrawing'. */
  var SHARE = { idle: { share: 'sending' }, shared: { share: 'sending', withdraw: 'withdrawing' }, sending: {}, withdrawing: {} };
  function shareSettled(rec) { return rec && rec.sharedAt ? 'shared' : 'idle'; }
  function shareNext(phase, ev) { var row = SHARE[phase]; return row && row[ev] ? row[ev] : null; }
  /* What a shared copy was made from: when it differs from the record now, the copy is out of date. */
  function shareSig(rec) { return JSON.stringify([rec.Q, rec.A, rec.By, rec.use, rec.T, rec.TBy, rec.hotel.type, rec.hotel.role, rec.hotel.country, rec.share.named, rec.share.named ? rec.hotel.name : '']); }
  function shareStale(rec) { return !!(rec && rec.sharedAt && rec.sharedSig && rec.sharedSig !== shareSig(rec)); }

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
  function answersOf(r) { return JSON.stringify([r.hotel, r.Q, r.A, r.By, r.cat, r.dept, r.use, r.T, r.TBy, !!(r.share && r.share.named)]); }
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
    else if (answersOf(other) === answersOf(rec)) { var keep = copy(other); keep.step = rec.step; s.checks[rec.id] = keep; } // same answers: take the other tab's share state and history
    else { s.checks[rec.id] = keepShare(copy(rec), other); elsewhere = 'changed'; } // audit v3 M4: this tab's answers, the store's share fields
    return { store: s, elsewhere: elsewhere };
  }
  function histRead(st) {
    if (!st || typeof st !== 'object' || STEPS.indexOf(st.r2) < 0) return { ours: false };
    return { ours: true, step: st.r2, d: typeof st.d === 'number' && st.d >= 0 ? st.d : 0, prev: STEPS.indexOf(st.prev) >= 0 ? st.prev : null, id: typeof st.id === 'string' ? st.id : '' };
  }
  /* Progress bar: five segments for steps 1 to 5; the current one is 'now'; all done on the result; none on the cover and the stop screen. */
  function progress(step) {
    var n = { hotel: 1, q: 2, must: 3, where: 4, tailored: 5, result: 6 }[step]; if (!n) return null;
    return [1, 2, 3, 4, 5].map(function (i) { return i < n ? 'done' : i === n ? 'now' : ''; });
  }

  var api = { OLD_KEY: OLD_KEY, QV: QV, MAX_CHECKS: MAX_CHECKS, forFile: forFile, keepShare: keepShare, tailSig: tailSig, full: full, histSkip: histSkip, mergeTabs: mergeTabs, answersOf: answersOf, CUR_KEY: 'hftp-readiness2q-cur', CORRUPT_KEY: 'hftp-readiness2q-v1-corrupt',
    V: V, KEY: KEY, STEPS: STEPS, ORDER: ORDER, FLOW: FLOW, QIDS: QIDS, MUST_IDS: MUST_IDS, CATS: CATS, TYPES: TYPES, ROLES: ROLES, MAX_SNAPS: MAX_SNAPS,
    validDate: validDate, newId: newId, blank: blank, blankStore: blankStore, cur: cur, ctxOf: ctxOf, reachable: reachable, placeStep: placeStep, flowNext: flowNext, events: events,
    cleanRec: cleanRec, migrate: migrate, listed: listed, reduce: reduce, confirmNext: confirmNext, BRIDGE: BRIDGE, bridgeNext: bridgeNext, DL: DL, dlNext: dlNext,
    SHARE: SHARE, shareSettled: shareSettled, shareNext: shareNext, shareSig: shareSig, shareStale: shareStale,
    nameHash: nameHash, nameOk: nameOk, histAction: histAction, histEntry: histEntry, histRead: histRead, progress: progress, deptOfUse: deptOfUse, tailIds: tailIds };
  root.R2Flow = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
