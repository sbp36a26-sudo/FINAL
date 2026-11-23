/* Readiness 2.0: the explicit state machines (pure, no DOM). Runs in the page and in the Node tests.
   See CLEANUP.md for the inventory.

   1. FLOW (rec.step): where the person is.
      States: 'start' | 'q' (1a: is this an AI problem?) | 'stop' (Q1 = No: the end) | 'where' (1b: where in the hotel?)
              | 'needs' (step 2) | 'success' (step 3) | 'summary'
      Events: begin, next, back, change (stop → q), edit (summary → q), restart (any → start, after the CONFIRM machine says yes),
              pop(step) (browser Back/forward or a restore: only to a reachable step, else the nearest reachable one before it)
      Guards (ctx from ctxOf(rec)):
        q --next--> 'stop' when Q1 is No (whatever the rest); else 'where' only when all five questions are answered.
        'stop' is reachable only while Q1 is No; 'where', 'needs', 'success', 'summary' never while Q1 is No.
        where --next--> needs only with a choice (a use case of the chosen department, or "None of these fits").
        needs / success --next--> only with every item answered ("Don't know yet" counts).
   2. RECORD (persisted in localStorage['hftp-readiness2-v1']): migrate() validates any saved value and returns a clean record
      at version V, or null. Unknown fields are dropped; a step that cannot be shown is placed back (placeStep).
   3. reduce(rec, ev, arg, cat): the only function that changes the record (answers, choices, navigation, restart).
      Returns { rec, ok }; ok false means the event was refused and rec is unchanged.
   4. CONFIRM (confirmNext), BRIDGE (bridgeNext) and DOWNLOAD (dlNext): page-only machines, never saved (see below). */
(function (root) {
  'use strict';
  var V = 1, KEY = 'hftp-readiness2-v1';
  var STEPS = ['start', 'q', 'stop', 'where', 'needs', 'success', 'summary'];
  var ORDER = ['start', 'q', 'where', 'needs', 'success', 'summary']; // the main line ('stop' is a side end)
  var FLOW = {
    start: { begin: 'q' },
    q: { back: 'start', next: '@q', restart: 'start' },
    stop: { change: 'q', restart: 'start' },
    where: { back: 'q', next: 'needs', restart: 'start' },
    needs: { back: 'where', next: 'success', restart: 'start' },
    success: { back: 'needs', next: 'summary', restart: 'start' },
    summary: { back: 'success', edit: 'q', restart: 'start' }
  };
  var QIDS = ['q1', 'q2', 'q3', 'q4', 'q5'];
  var NEED_IDS = ['b1', 'b3', 'b5', 'b8', 'b9', 'b2', 'b4', 'b6', 'b7', 'b10'];
  var FACTOR_IDS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];
  var Q_OK = { y: 1, n: 1, u: 1 }, A_OK = { y: 1, pl: 1, p: 1, n: 1, k: 1 };
  var CATS = ['Commercial', 'Guest-facing', 'Operational', 'Administrative'];
  var DATE = /^\d{4}-\d{2}-\d{2}$/;

  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function blank() { return { v: V, step: 'start', Q: {}, cat: '', dept: '', use: '', A: {}, By: {} }; }
  function copy(r) { return { v: V, step: r.step, Q: Object.assign({}, r.Q), cat: r.cat, dept: r.dept, use: r.use, A: Object.assign({}, r.A), By: Object.assign({}, r.By) }; }

  /* cat: the catalogue model { depts: [{ id, cat, uses: [{ id }] }] }. */
  function deptOf(cat, id) { return (cat && cat.depts || []).filter(function (d) { return d.id === id; })[0] || null; }
  function useIn(cat, deptId, useId) { var d = deptOf(cat, deptId); return !!(d && d.uses.some(function (u) { return u.id === useId; })); }

  function ctxOf(rec, cat) {
    var Q = rec.Q || {}, A = rec.A || {};
    return {
      q1No: Q.q1 === 'n',
      qDone: QIDS.every(function (id) { return !!Q_OK[Q[id]]; }),
      whereDone: rec.use === 'none' || (!!rec.use && useIn(cat, rec.dept, rec.use) && deptOf(cat, rec.dept).cat === rec.cat),
      needsDone: NEED_IDS.every(function (id) { return !!A_OK[A[id]]; }),
      successDone: FACTOR_IDS.every(function (id) { return !!A_OK[A[id]]; })
    };
  }
  /* Can this step be shown with these answers? */
  function reachable(step, c) {
    switch (step) {
      case 'start': case 'q': return true;
      case 'stop': return c.q1No;
      case 'where': return !c.q1No && c.qDone;
      case 'needs': return reachable('where', c) && c.whereDone;
      case 'success': return reachable('needs', c) && c.needsDone;
      case 'summary': return reachable('success', c) && c.successDone;
    }
    return false;
  }
  /* The step a saved or historic step lands on: itself if reachable; 'stop' for any later step while Q1 is No;
     otherwise the nearest reachable step before it on the main line. Unknown values → 'start'. */
  function placeStep(step, c) {
    if (STEPS.indexOf(step) < 0) return 'start';
    if (reachable(step, c)) return step;
    if (c.q1No && step !== 'start') return 'stop';
    var i = ORDER.indexOf(step); if (i < 0) i = ORDER.indexOf('q');
    for (; i >= 0; i--) if (reachable(ORDER[i], c)) return ORDER[i];
    return 'start';
  }
  /* Next step for a navigation event, or null when the event is not allowed here. */
  function flowNext(step, ev, c) {
    var row = FLOW[step]; if (!row || !own(row, ev)) return null;
    var to = row[ev];
    if (to === '@q') to = c.q1No ? 'stop' : 'where';
    return reachable(to, c) ? to : null;
  }
  /* The navigation events that would be accepted now (AX: what can be pressed). */
  function events(step, c) { return Object.keys(FLOW[step] || {}).filter(function (e) { return flowNext(step, e, c) !== null; }); }

  function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; }
  /* Any saved value (parsed JSON) → a clean record or null. */
  function migrate(raw, cat) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    var r = raw;
    /* Migration stub: version 1 is the first. A record without v is treated as version 1; a later version is read for what this build understands. */
    if (r.v == null) r = Object.assign({}, r, { v: 1 });
    if (typeof r.v !== 'number' || r.v < 1) return null;
    var o = blank(), Q = obj(r.Q), A = obj(r.A), By = obj(r.By);
    QIDS.forEach(function (id) { if (Q_OK[Q[id]]) o.Q[id] = Q[id]; });
    NEED_IDS.concat(FACTOR_IDS).forEach(function (id) { if (A_OK[A[id]]) o.A[id] = A[id]; });
    Object.keys(o.A).forEach(function (id) { if (o.A[id] === 'pl' && typeof By[id] === 'string' && DATE.test(By[id])) o.By[id] = By[id]; });
    o.cat = CATS.indexOf(r.cat) >= 0 ? r.cat : '';
    var d = deptOf(cat, r.dept); o.dept = d && d.cat === o.cat ? d.id : '';
    o.use = r.use === 'none' ? 'none' : (typeof r.use === 'string' && o.dept && useIn(cat, o.dept, r.use) ? r.use : '');
    o.step = placeStep(typeof r.step === 'string' ? r.step : 'start', ctxOf(o, cat));
    return o;
  }

  /* The only writer of the record. ev: 'answer' {id, value} | 'by' {id, date} | 'cat' name | 'dept' id | 'use' id or 'none'
     | a FLOW event ('begin', 'next', 'back', 'change', 'edit', 'restart') | 'pop' step. */
  function reduce(rec, ev, arg, cat) {
    var no = { rec: rec, ok: false }, r, to;
    switch (ev) {
      case 'answer': {
        var id = arg && arg.id, v = arg && arg.value;
        r = copy(rec);
        /* Answers only on their own step, so no answer can make the screen being shown impossible. */
        if (QIDS.indexOf(id) >= 0 && Q_OK[v] && rec.step === 'q') r.Q[id] = v;
        else if (A_OK[v] && ((NEED_IDS.indexOf(id) >= 0 && rec.step === 'needs') || (FACTOR_IDS.indexOf(id) >= 0 && rec.step === 'success'))) { r.A[id] = v; if (v !== 'pl') delete r.By[id]; }
        else return no;
        return { rec: r, ok: true };
      }
      case 'by': {
        if (!arg || rec.A[arg.id] !== 'pl' || (rec.step !== 'needs' && rec.step !== 'success') || typeof arg.date !== 'string' || (arg.date && !DATE.test(arg.date))) return no;
        r = copy(rec); if (arg.date) r.By[arg.id] = arg.date; else delete r.By[arg.id];
        return { rec: r, ok: true };
      }
      case 'cat': {
        if (CATS.indexOf(arg) < 0 || rec.step !== 'where') return no;
        r = copy(rec); r.cat = arg;
        var d0 = deptOf(cat, r.dept); if (!d0 || d0.cat !== arg) { r.dept = ''; if (r.use !== 'none') r.use = ''; }
        return { rec: r, ok: true };
      }
      case 'dept': {
        var d = deptOf(cat, arg); if (!d || d.cat !== rec.cat || rec.step !== 'where') return no;
        r = copy(rec); r.dept = d.id; if (r.use !== 'none' && !useIn(cat, d.id, r.use)) r.use = '';
        return { rec: r, ok: true };
      }
      case 'use': {
        if (rec.step !== 'where') return no;
        if (arg !== 'none' && !(rec.dept && useIn(cat, rec.dept, arg))) return no;
        r = copy(rec); r.use = arg; return { rec: r, ok: true };
      }
      case 'restart': {
        if (!flowNext(rec.step, 'restart', ctxOf(rec, cat))) return no;
        return { rec: blank(), ok: true };
      }
      case 'pop': {
        r = copy(rec); r.step = placeStep(arg, ctxOf(rec, cat));
        return { rec: r, ok: r.step === arg };
      }
      default: {
        to = flowNext(rec.step, ev, ctxOf(rec, cat)); if (to === null) return no;
        r = copy(rec); r.step = to; return { rec: r, ok: true };
      }
    }
  }

  /* CONFIRM machine (page only, never saved): null | 'restart'. ask opens it, no/nav closes it, yes fires the restart once. */
  function confirmNext(c, ev) {
    if (ev === 'ask') return { c: 'restart', fire: false };
    if (ev === 'yes') return { c: null, fire: c === 'restart' };
    if (ev === 'no' || ev === 'nav') return { c: null, fire: false };
    return { c: c, fire: false };
  }

  /* BRIDGE machine (page only), the readiness check's own: does the hub bar save files for us?
     'none' (not in a frame: plain download link) | 'pending' (asked the hub with ping) | 'yes' (pong, downloads true)
     | 'no' (pong false, cannot post, or no pong in 12 s: an explicit 'timeout' event). Only 'pending' moves. */
  var BRIDGE = { pending: { yes: 'yes', no: 'no', timeout: 'no', error: 'no' } };
  function bridgeNext(s, ev) { var row = BRIDGE[s]; return row && row[ev] ? row[ev] : s; }

  /* DOWNLOAD machine (page only, never saved): one PDF at a time; the buttons are disabled in every state but 'idle'.
     'idle' --start--> 'making' (jsPDF builds the file)
     'making' --made--> 'waiting' while BRIDGE is 'pending' (the hub has not answered the ping yet), else 'saving'
     'waiting' --bridge--> 'saving' (BRIDGE settled)
     'saving' --done | fail--> 'idle' (hub reply, plain link clicked, or the 2-minute hub timeout as a 'fail' event)
     'making' | 'waiting' --fail--> 'idle'.  Anything else is refused (returns null): a second click cannot start a second download. */
  var DL = { idle: { start: 'making' }, making: { made: '@made', fail: 'idle' }, waiting: { bridge: 'saving', fail: 'idle' }, saving: { done: 'idle', fail: 'idle' } };
  function dlNext(s, ev, bridge) {
    var row = DL[s]; if (!row || !own(row, ev)) return null;
    var to = row[ev];
    if (to === '@made') to = bridge === 'pending' ? 'waiting' : 'saving';
    if (s === 'waiting' && ev === 'bridge' && bridge === 'pending') return null;
    return to;
  }

  var api = { BRIDGE: BRIDGE, bridgeNext: bridgeNext, DL: DL, dlNext: dlNext, V: V, KEY: KEY, STEPS: STEPS, ORDER: ORDER, FLOW: FLOW, QIDS: QIDS, NEED_IDS: NEED_IDS, FACTOR_IDS: FACTOR_IDS, CATS: CATS,
    blank: blank, ctxOf: ctxOf, reachable: reachable, placeStep: placeStep, flowNext: flowNext, events: events, migrate: migrate, reduce: reduce, confirmNext: confirmNext };
  root.R2Flow = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
