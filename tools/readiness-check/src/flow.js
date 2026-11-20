/* Readiness check: the explicit state machines (pure, no DOM). Runs in both pages and in the Node tests.
   See CLEANUP.md for the inventory. Every machine is a transition table plus a pure next() function;
   the pages hold the current value and only change it through these functions.

   1. FLOW (check page, st.step): where the hotel is in its journey.
      States: 'start' | 'prep' | 0..5 (the six steps) | 'review' (open items only) | 'result'
      Events: prep, back, begin, next, review, result, edit, new, home (v4: header link "Your checks", any screen → start)
      Guards: 'prep' needs a tool, how the hotel is run and a stage; every state but 'start' needs a known tool.
   2. CONFIRM (check page): at most one confirmation open at a time; any navigation closes it.
      States: null | {kind:'new'} | {kind:'rm', id} | {kind:'file', id}
      Events: ask(kind, id), cancel, yes, nav
   3. SHARE (check page): the opt-in copy for the project team.
      States: 'none' | 'sending' | 'shared' | 'withdrawing'   (persisted truth: sharedAt)
      Events: share, withdraw, ok, fail
   4. BRIDGE (check page): does the hub bar save files for us?
      States: 'none' (not in a frame) | 'pending' | 'yes' | 'no'
      Events: pong(downloads), timeout, error
   5. TEAM (team page): list loading and delete.
      phase: 'loading' | 'ready' | 'empty' | 'error';  del: null | 'confirm' | 'deleting'
      Events: refresh, loaded(n), failed, select, ask-del, cancel-del, yes-del, deleted, del-failed
   6. RECORD (persisted checks): migrate() validates a saved check (browser or file) and returns a
      safe record at the current record version, or null. Version 1 = everything before 19 Nov 2026
      (no rv field); version 2 adds rv and sharedSig. Nothing is removed, so older builds can still read it. */
(function (root) {
  'use strict';

  // ---------- 1. FLOW ----------
  var STEPS = ['start', 'prep', 0, 1, 2, 3, 4, 5, 'review', 'result'];
  function isStep(s) { return STEPS.indexOf(s) >= 0; }
  var FLOW = {
    start: { prep: 'prep' },
    prep: { back: 'start', begin: 0 },
    review: { result: 'result', edit: 0 },
    result: { review: 'review', edit: 0, new: 'start' }
  };
  [0, 1, 2, 3, 4, 5].forEach(function (i) { FLOW[i] = { back: i === 0 ? 'prep' : i - 1, next: i === 5 ? 'result' : i + 1 }; });
  /* 'home' (v4): the "Your checks" link in the header. From any screen but start, back to the start screen; the check is kept. */
  ['prep', 0, 1, 2, 3, 4, 5, 'review', 'result'].forEach(function (s) { FLOW[s].home = 'start'; });
  /* ctx: { tool: bool (a known tool is chosen), ready: bool (tool + hotel type + stage) }.
     Returns the next step, or null when the event is not allowed in this state. */
  function flowNext(step, ev, ctx) {
    ctx = ctx || {};
    var row = FLOW[step]; if (!row || !Object.prototype.hasOwnProperty.call(row, ev)) return null;
    var to = row[ev];
    if (ev === 'prep' && !ctx.ready) return null;
    if (to !== 'start' && !ctx.tool) return null;
    return to;
  }
  /* A step coming from storage, a file or browser history: keep it if it can be shown, else a safe one. */
  function safeStep(step, ctx) {
    ctx = ctx || {};
    if (typeof step === 'string' && /^[0-5]$/.test(step)) step = +step;
    if (!isStep(step)) return 'start';
    if (step !== 'start' && !ctx.tool) return 'start';
    return step;
  }

  // ---------- 2. CONFIRM ----------
  var CONFIRM_KINDS = { new: 1, rm: 1, file: 1 };
  /* Returns { c: next confirm state, fire: the confirmed action or null }. */
  function confirmNext(c, ev, kind, id) {
    if (ev === 'ask') return CONFIRM_KINDS[kind] ? { c: { kind: kind, id: id == null ? null : id }, fire: null } : { c: c, fire: null };
    if (ev === 'cancel' || ev === 'nav') return { c: null, fire: null };
    if (ev === 'yes') {
      if (!c || (kind && c.kind !== kind) || (id != null && c.id !== id)) return { c: null, fire: null }; // stale or forged confirm: do nothing
      return { c: null, fire: c };
    }
    return { c: c, fire: null };
  }

  // ---------- 3. SHARE ----------
  var SHARE = {
    none: { share: 'sending' },
    shared: { share: 'sending', withdraw: 'withdrawing' },
    sending: { ok: 'shared', fail: '@prev' },
    withdrawing: { ok: 'none', fail: 'shared' }
  };
  /* prev: the settled state to return to when sending fails ('none' or 'shared'). */
  function shareNext(s, ev, prev) {
    var row = SHARE[s]; if (!row || !row[ev]) return null;
    var to = row[ev]; return to === '@prev' ? (prev === 'shared' ? 'shared' : 'none') : to;
  }
  function shareSettled(rec) { return rec && rec.sharedAt ? 'shared' : 'none'; }
  /* What a shared copy depends on; when it changes the copy is out of date. */
  function shareSig(rec) {
    return JSON.stringify([rec.useId, rec.stage, rec.hotel && rec.hotel.role, rec.hotel && rec.hotel.type, rec.hotel && rec.hotel.country, sortObj(rec.A), sortObj(rec.Who), !!(rec.share && rec.share.named)]);
  }
  function sortObj(o) { var r = {}; Object.keys(o || {}).sort().forEach(function (k) { r[k] = o[k]; }); return r; }
  function shareStale(rec) { return !!(rec && rec.sharedAt && rec.sharedSig && rec.sharedSig !== shareSig(rec)); }

  // ---------- 4. BRIDGE ----------
  var BRIDGE = { pending: { yes: 'yes', no: 'no', timeout: 'no', error: 'no' } };
  function bridgeNext(s, ev) { var row = BRIDGE[s]; return row && row[ev] ? row[ev] : s; }

  // ---------- 5. TEAM ----------
  function teamNext(t, ev, n) {
    var p = t.phase, d = t.del;
    switch (ev) {
      case 'refresh': return d === 'deleting' || p === 'loading' ? null : { phase: 'loading', del: null };
      case 'loaded': return p === 'loading' ? { phase: n ? 'ready' : 'empty', del: null } : null;
      case 'failed': return p === 'loading' ? { phase: 'error', del: null } : null;
      case 'select': return p === 'ready' && d !== 'deleting' ? { phase: p, del: null } : null;
      case 'ask-del': return p === 'ready' && d === null ? { phase: p, del: 'confirm' } : null;
      case 'cancel-del': return d === 'confirm' ? { phase: p, del: null } : null;
      case 'yes-del': return d === 'confirm' ? { phase: p, del: 'deleting' } : null;
      case 'deleted': return d === 'deleting' ? { phase: 'loading', del: null } : null;
      case 'del-failed': return d === 'deleting' ? { phase: p, del: null } : null;
    }
    return null;
  }

  // ---------- 6. RECORD ----------
  var RV = 2;
  function obj(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; }
  function str(v) { return typeof v === 'string' ? v : ''; }
  function strMap(v) { var o = obj(v), r = {}; Object.keys(o).forEach(function (k) { if (typeof o[k] === 'string') r[k] = o[k]; }); return r; }
  /* r: a saved check (any version). known(useId): is the tool in this build's catalogue?
     Returns a normalised copy or null when it cannot be opened. Unknown extra fields are kept. */
  function migrate(r, known) {
    if (!r || typeof r !== 'object' || Array.isArray(r)) return null;
    if (typeof r.rv === 'number' && r.rv > RV) { /* from a newer build: read what we understand */ }
    var o = {}; Object.keys(r).forEach(function (k) { o[k] = r[k]; });
    if (!str(o.id)) return null;
    o.useId = str(o.useId);
    if (o.useId && known && !known(o.useId)) return null;
    var h = obj(o.hotel); o.hotel = { name: str(h.name), role: str(h.role), type: str(h.type), country: str(h.country) };
    o.stage = str(o.stage); o.A = strMap(o.A); o.P = strMap(o.P); o.Who = strMap(o.Who);
    var ow = obj(o.owner); o.owner = { ask: str(ow.ask), cost: str(ow.cost), by: str(ow.by) };
    var nx = obj(o.next); o.next = { when: str(nx.when), date: str(nx.date) };
    o.snaps = Array.isArray(o.snaps) ? o.snaps.filter(function (s) { return s && typeof s === 'object' && typeof s.level === 'string'; }) : [];
    var sh = obj(o.share); o.share = { on: !!sh.on, named: !!sh.named };
    o.sharedAt = str(o.sharedAt) || null;
    o.sharedSig = str(o.sharedSig) || null;
    o.sharedMode = o.sharedMode === 'shared' || o.sharedMode === 'local' ? o.sharedMode : null;
    o.step = safeStep(o.step, { tool: !!o.useId });
    o.created = str(o.created) || new Date(0).toISOString();
    if (o.rv == null || o.rv < RV) o.rv = RV;
    return o;
  }

  var api = { STEPS: STEPS, FLOW: FLOW, isStep: isStep, flowNext: flowNext, safeStep: safeStep, confirmNext: confirmNext,
    SHARE: SHARE, shareNext: shareNext, shareSettled: shareSettled, shareSig: shareSig, shareStale: shareStale,
    BRIDGE: BRIDGE, bridgeNext: bridgeNext, teamNext: teamNext, RV: RV, migrate: migrate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RCFlow = api;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
