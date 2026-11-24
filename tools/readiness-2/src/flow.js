/* Do you need AI? v2 (folder, tool id and storage key keep the name readiness-2): the explicit state machines (pure, no DOM).
   Runs in the page and in the Node tests. See CLEANUP.md for the inventory.

   1. FLOW (rec.step): where the person is in one check.
      States: 'start' (cover) | 'hotel' (1 About your hotel) | 'q' (2 Is this an AI problem?) | 'stop' (Q1 = No: the end)
              | 'must' (3 Must-haves) | 'where' (4 Where in the hotel?) | 'tailored' (5 Questions for this use case) | 'result'
      Events: begin, next, back, change (stop → q), edit (result → q), pop(step) (browser Back/forward or a restore)
      Guards (ctx from ctxOf(rec, env)):
        hotel --next--> q only when "how the hotel is run" is chosen.
        q --next--> 'stop' when Q1 is No (whatever the rest); else 'must' only when all five questions are answered.
        'stop' only while Q1 is No; 'must', 'where', 'tailored', 'result' never while Q1 is No.
        must --next--> where only with every must-have answered ("Don't know yet" counts).
        where --next--> 'tailored' with a use case; straight to 'result' with "None of these fits" (no tailored questions).
        tailored --next--> result only with every tailored question answered.
   2. STORE (persisted in localStorage['hftp-readiness2-v1']): { v: 2, cur: <check id>, checks: { <id>: rec }, notice }.
      migrate() takes any saved value: a v2 store is validated; a v1 record (the build before 24 Nov 2026) becomes one check
      that keeps the five answers and the chosen use case, drops the rest and sets notice 'v1' (shown once).
   3. reduce(store, ev, arg, env): the only function that changes the store. Returns { store, ok }.
      Record events: 'hotel' {k, v} | 'answer' {id, value} | 'by' {id, date} | 'cat' | 'dept' | 'use' | a FLOW event | 'pop' step
      Store events: 'new' (a blank check; the hotel details carry over) | 'open' id | 'remove' id | 'import' rec (from a file)
                    | 'preselect' useId (from #use=<id>: a new check with that use case chosen) | 'snap' snapshot | 'seen' (notice read) | 'profile' {name, country, type} (shared hotel profile)
                    | 'share' {named} | 'shared' {at, mode, sig} | 'unshared'
   4. CONFIRM (confirmNext), BRIDGE (bridgeNext), DOWNLOAD (dlNext), SHARE (shareNext): page-only machines, never saved.
   5. HISTORY (histAction / histEntry / histRead): how each step change is written into the browser's Back/forward list. */
(function (root) {
  'use strict';
  var V = 2, KEY = 'hftp-readiness2-v1';
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
  var Q_OK = { y: 1, n: 1, u: 1 }, A_OK = { y: 1, pl: 1, p: 1, n: 1, k: 1 }, T_OK = { y: 1, pl: 1, p: 1, n: 1, k: 1, na: 1 };
  var CATS = ['Commercial', 'Guest-facing', 'Operational', 'Administrative'];
  var TYPES = ['independent', 'group', 'managed'], ROLES = ['gm', 'owner', 'dept', 'it', 'fin', 'other'];
  var MAX_SNAPS = 20, MAX_CHECKS = 50;
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

  function blank(id) { return { id: id || newId(), step: 'start', hotel: { name: '', role: '', type: '', country: '' }, Q: {}, A: {}, By: {}, cat: '', dept: '', use: '', useName: '', T: {}, TBy: {}, snaps: [], share: { named: false }, sharedAt: null, sharedMode: null, sharedSig: null, updated: '' }; }
  function copy(r) {
    return { id: r.id, step: r.step, hotel: Object.assign({}, r.hotel), Q: Object.assign({}, r.Q), A: Object.assign({}, r.A), By: Object.assign({}, r.By), cat: r.cat, dept: r.dept, use: r.use, useName: r.useName || '',
      T: Object.assign({}, r.T), TBy: Object.assign({}, r.TBy), snaps: (r.snaps || []).slice(), share: { named: !!(r.share && r.share.named) }, sharedAt: r.sharedAt || null, sharedMode: r.sharedMode || null, sharedSig: r.sharedSig || null, updated: r.updated || '' };
  }
  function blankStore() { var r = blank(); var s = { v: V, cur: r.id, checks: {} }; s.checks[r.id] = r; return s; }
  function cur(store) { return store.checks[store.cur]; }

  /* env: { cat: the catalogue model { depts: [{ id, cat, uses: [{ id, n }] }] }, tq: { <use id>: [{ id, na? }] } (tailored question ids per use case),
            countries: [names] (optional) } */
  function deptOf(env, id) { return (env && env.cat && env.cat.depts || []).filter(function (d) { return d.id === id; })[0] || null; }
  function useIn(env, deptId, useId) { var d = deptOf(env, deptId); return !!(d && d.uses.some(function (u) { return u.id === useId; })); }
  function useName(env, deptId, useId) { var d = deptOf(env, deptId), u = d && d.uses.filter(function (x) { return x.id === useId; })[0]; return u ? u.n : ''; }
  function deptOfUse(env, useId) { return (env && env.cat && env.cat.depts || []).filter(function (d) { return d.uses.some(function (u) { return u.id === useId; }); })[0] || null; }
  function tailIds(env, useId) { return ((env && env.tq && env.tq[useId]) || []).map(function (q) { return q.id; }); }

  function ctxOf(rec, env) {
    var Q = rec.Q || {}, A = rec.A || {}, Tt = rec.T || {}, ids = rec.use && rec.use !== 'none' ? tailIds(env, rec.use) : [];
    return {
      hotelDone: TYPES.indexOf((rec.hotel || {}).type) >= 0,
      q1No: Q.q1 === 'n',
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
      case 'stop': return c.hotelDone && c.q1No;
      case 'must': return c.hotelDone && !c.q1No && c.qDone;
      case 'where': return reachable('must', c) && c.mustDone;
      case 'tailored': return reachable('where', c) && c.whereDone && !c.none && c.hasTail;
      case 'result': return reachable('where', c) && c.whereDone && (c.none || !c.hasTail || c.tailDone);
    }
    return false;
  }
  /* The step a saved or historic step lands on: itself if reachable; 'stop' for any later step while Q1 is No;
     otherwise the nearest reachable step before it on the main line. Unknown values → 'start'. */
  function placeStep(step, c) {
    if (STEPS.indexOf(step) < 0) return 'start';
    if (reachable(step, c)) return step;
    if (c.q1No && c.hotelDone && step !== 'start' && step !== 'hotel') return 'stop';
    var i = ORDER.indexOf(step); if (i < 0) i = ORDER.indexOf('q');
    for (; i >= 0; i--) if (reachable(ORDER[i], c)) return ORDER[i];
    return 'start';
  }
  function flowNext(step, ev, c) {
    var row = FLOW[step]; if (!row || !own(row, ev)) return null;
    var to = row[ev];
    if (to === '@q') to = c.q1No ? 'stop' : 'must';
    else if (to === '@where') to = c.none || !c.hasTail ? 'result' : 'tailored';
    else if (to === '@result') to = c.none || !c.hasTail ? 'where' : 'tailored';
    return reachable(to, c) ? to : null;
  }
  function events(step, c) { return Object.keys(FLOW[step] || {}).filter(function (e) { return flowNext(step, e, c) !== null; }); }

  /* ---------- reading saved data ---------- */
  function cleanSnap(s) {
    s = obj(s); if (typeof s.at !== 'string' || ['ready', 'almost', 'notready', 'noinfo'].indexOf(s.level) < 0) return null;
    var n = function (v) { return typeof v === 'number' && isFinite(v) && v >= 0 ? v : 0; };
    return { at: s.at.slice(0, 40), level: s.level, pct: typeof s.pct === 'number' ? n(s.pct) : null, pts: n(s.pts), max: n(s.max), known: n(s.known), total: n(s.total), mustYes: n(s.mustYes), mustN: n(s.mustN), rules: str(s.rules, 40) };
  }
  /* One saved check → a clean record, or null. info.useChanged: the saved use case's name differs from the catalogue's now. */
  function cleanRec(r, env, info) {
    r = obj(r); if (!okId(r.id)) return null;
    var o = blank(r.id), H = obj(r.hotel), Q = obj(r.Q), A = obj(r.A), By = obj(r.By), Tt = obj(r.T), TBy = obj(r.TBy);
    o.hotel.name = str(H.name, 120); o.hotel.type = TYPES.indexOf(H.type) >= 0 ? H.type : ''; o.hotel.role = ROLES.indexOf(H.role) >= 0 ? H.role : '';
    o.hotel.country = typeof H.country === 'string' && (!env || !env.countries || env.countries.indexOf(H.country) >= 0) ? str(H.country, 40) : '';
    QIDS.forEach(function (id) { if (Q_OK[Q[id]]) o.Q[id] = Q[id]; });
    MUST_IDS.forEach(function (id) { if (A_OK[A[id]]) { o.A[id] = A[id]; if (A[id] === 'pl' && validDate(By[id])) o.By[id] = By[id]; } });
    o.cat = CATS.indexOf(r.cat) >= 0 ? r.cat : '';
    var d = deptOf(env, r.dept); o.dept = d && d.cat === o.cat ? d.id : '';
    o.use = r.use === 'none' ? 'none' : (typeof r.use === 'string' && o.dept && useIn(env, o.dept, r.use) ? r.use : '');
    if (o.use && o.use !== 'none') {
      var now = useName(env, o.dept, o.use);
      if (typeof r.useName === 'string' && r.useName && r.useName !== now) { o.use = ''; if (info) info.useChanged = true; }
      else o.useName = now;
    }
    if (o.use && o.use !== 'none') tailIds(env, o.use).forEach(function (id) { if (T_OK[Tt[id]]) { o.T[id] = Tt[id]; if (Tt[id] === 'pl' && validDate(TBy[id])) o.TBy[id] = TBy[id]; } });
    o.snaps = (Array.isArray(r.snaps) ? r.snaps : []).map(cleanSnap).filter(Boolean).slice(-MAX_SNAPS);
    o.share = { named: !!obj(r.share).named };
    o.sharedAt = typeof r.sharedAt === 'string' ? r.sharedAt.slice(0, 40) : null; o.sharedMode = r.sharedMode === 'shared' || r.sharedMode === 'local' ? r.sharedMode : null; o.sharedSig = typeof r.sharedSig === 'string' ? r.sharedSig.slice(0, 4000) : null;
    if (!o.sharedAt) { o.sharedMode = null; o.sharedSig = null; }
    o.updated = str(r.updated, 40);
    o.step = placeStep(typeof r.step === 'string' ? r.step : 'start', ctxOf(o, env));
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
    var cs = obj(raw.checks);
    Object.keys(cs).slice(0, MAX_CHECKS).forEach(function (k) { var one = {}, c = cleanRec(cs[k], env, k === raw.cur ? info : one); if (c && c.id === k) s.checks[k] = c; });
    if (raw.notice === 'v1') s.notice = 'v1';
    if (s.checks[raw.cur]) s.cur = raw.cur;
    else { var b = blank(); s.checks[b.id] = b; s.cur = b.id; }
    return s;
  }
  /* Is a check worth listing under "Your checks"? Anything answered or chosen. */
  function listed(r) { return !!(r && (Object.keys(r.Q).length || Object.keys(r.A).length || r.use || (r.snaps && r.snaps.length))); }

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
        if (QIDS.indexOf(id) >= 0 && Q_OK[v] && rec.step === 'q') r.Q[id] = v;
        else if (MUST_IDS.indexOf(id) >= 0 && A_OK[v] && rec.step === 'must') { r.A[id] = v; if (v !== 'pl') delete r.By[id]; }
        else if (rec.step === 'tailored' && T_OK[v] && tailIds(env, rec.use).indexOf(id) >= 0) { r.T[id] = v; if (v !== 'pl') delete r.TBy[id]; }
        else return no;
        return done(r);
      }
      case 'by': {
        if (!arg || typeof arg.date !== 'string' || (arg.date && !validDate(arg.date))) return no;
        r = copy(rec);
        if (rec.step === 'must' && rec.A[arg.id] === 'pl') { if (arg.date) r.By[arg.id] = arg.date; else delete r.By[arg.id]; }
        else if (rec.step === 'tailored' && rec.T[arg.id] === 'pl') { if (arg.date) r.TBy[arg.id] = arg.date; else delete r.TBy[arg.id]; }
        else return no;
        return done(r);
      }
      case 'cat': {
        if (CATS.indexOf(arg) < 0 || rec.step !== 'where') return no;
        r = copy(rec); r.cat = arg;
        var d0 = deptOf(env, r.dept); if (!d0 || d0.cat !== arg) { r.dept = ''; if (r.use !== 'none') { r.use = ''; r.useName = ''; r.T = {}; r.TBy = {}; } }
        return done(r);
      }
      case 'dept': {
        var d = deptOf(env, arg); if (!d || d.cat !== rec.cat || rec.step !== 'where') return no;
        r = copy(rec); r.dept = d.id; if (r.use !== 'none' && !useIn(env, d.id, r.use)) { r.use = ''; r.useName = ''; r.T = {}; r.TBy = {}; }
        return done(r);
      }
      case 'use': {
        if (rec.step !== 'where') return no;
        if (arg !== 'none' && !(rec.dept && useIn(env, rec.dept, arg))) return no;
        r = copy(rec);
        if (r.use !== arg) { r.T = {}; r.TBy = {}; } // the tailored questions belong to one use case
        r.use = arg; r.useName = arg === 'none' ? '' : useName(env, rec.dept, arg); return done(r);
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
      case 'shared': { if (!arg || typeof arg.at !== 'string') return no; r = copy(rec); r.sharedAt = arg.at; r.sharedMode = arg.mode === 'shared' ? 'shared' : 'local'; r.sharedSig = str(arg.sig, 4000); return done(r); }
      case 'unshared': { r = copy(rec); r.sharedAt = null; r.sharedMode = null; r.sharedSig = null; return done(r); }
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
        r = blank(); r.hotel = Object.assign({}, rec.hotel); // the hotel details carry over to the next check
        s = withRec(store, r); s.cur = r.id;
        if (!listed(rec)) delete s.checks[rec.id]; // an untouched check is not kept
        return { store: s, ok: true };
      }
      case 'preselect': {
        var du = deptOfUse(env, arg); if (!du) return no;
        if (rec.use === arg) return { store: store, ok: true }; // already this use case: keep the check as it is
        r = blank(); r.hotel = Object.assign({}, rec.hotel); r.cat = du.cat; r.dept = du.id; r.use = arg; r.useName = useName(env, du.id, arg);
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
        var ri = cleanRec(arg, env, {}); if (!ri) return no;
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
  function histRead(st) {
    if (!st || typeof st !== 'object' || STEPS.indexOf(st.r2) < 0) return { ours: false };
    return { ours: true, step: st.r2, d: typeof st.d === 'number' && st.d >= 0 ? st.d : 0, prev: STEPS.indexOf(st.prev) >= 0 ? st.prev : null, id: typeof st.id === 'string' ? st.id : '' };
  }
  /* Progress bar: five segments for steps 1 to 5; the current one is 'now'; all done on the result; none on the cover and the stop screen. */
  function progress(step) {
    var n = { hotel: 1, q: 2, must: 3, where: 4, tailored: 5, result: 6 }[step]; if (!n) return null;
    return [1, 2, 3, 4, 5].map(function (i) { return i < n ? 'done' : i === n ? 'now' : ''; });
  }

  var api = { V: V, KEY: KEY, STEPS: STEPS, ORDER: ORDER, FLOW: FLOW, QIDS: QIDS, MUST_IDS: MUST_IDS, CATS: CATS, TYPES: TYPES, ROLES: ROLES, MAX_SNAPS: MAX_SNAPS,
    validDate: validDate, newId: newId, blank: blank, blankStore: blankStore, cur: cur, ctxOf: ctxOf, reachable: reachable, placeStep: placeStep, flowNext: flowNext, events: events,
    cleanRec: cleanRec, migrate: migrate, listed: listed, reduce: reduce, confirmNext: confirmNext, BRIDGE: BRIDGE, bridgeNext: bridgeNext, DL: DL, dlNext: dlNext,
    SHARE: SHARE, shareSettled: shareSettled, shareNext: shareNext, shareSig: shareSig, shareStale: shareStale,
    histAction: histAction, histEntry: histEntry, histRead: histRead, progress: progress, deptOfUse: deptOfUse, tailIds: tailIds };
  root.R2Flow = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
