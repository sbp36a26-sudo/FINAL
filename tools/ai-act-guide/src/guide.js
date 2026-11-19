/* AI Act guide: plain-language front door to the AI Register.
   Pure logic, no DOM. Runs in the page and in Node (tests/guide.test.mjs).
   Every level, reason, role and item comes from RegLogic (tools/register/src/logic.js) and the register's data;
   this file only maps the guide's answers onto a register row and arranges the register's output. */
(function (root) {
  'use strict';

  var ANSWER_RANK = { no: 0, unsure: 1, yes: 2 };
  /* Plan column "Required by law?" from the register's item kinds. */
  var LAW_COL = { duty: 'Yes, AI Act', law: 'Yes, other law', maker: "Vendor's duty, you check", practice: 'No, good practice', standard: 'No, contract or industry standard', open: 'Find out first' };

  function isoDay(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(iso) { if (!iso) return ''; var p = iso.split('-'); return (+p[2]) + ' ' + MONTHS[+p[1] - 1] + ' ' + p[0]; }

  /* ================= State machines (see CLEANUP.md) =================
     Pure transition functions; app.js holds the current values and is the only caller. A function returns null
     when the event is not allowed in that state, so the caller ignores it (no impossible or double-fired states).

     1. Screen flow  STEPS: hotel -> tools -> results -> vendors -> owner.
        Events: go(step) (step tabs and buttons), pop(step) (browser Back/forward), next, back.
        Any step is reachable from any other through the tabs; next/back follow the straight path. */
  var STEPS = ['hotel', 'tools', 'results', 'vendors', 'owner'];
  var NAV = { hotel: { next: 'tools' }, tools: { next: 'results', back: 'hotel' }, results: { next: 'vendors', back: 'tools' }, vendors: { next: 'owner', back: 'results' }, owner: { back: 'vendors' } };
  function navNext(step, ev) {
    if (ev.type === 'go') return STEPS.indexOf(ev.step) >= 0 ? ev.step : null;
    if (ev.type === 'pop') return STEPS.indexOf(ev.step) >= 0 ? ev.step : 'hotel'; /* an entry this page did not write: start */
    return (NAV[step] && NAV[step][ev.type]) || null;
  }
  /* 2. Overlay on the current screen (one at a time; every screen change returns it to "none").
        none | copy (copy box) | confirmReset | confirmRestore (backup read, waiting for "replace?") | restoreError.
        confirm/cancel exist only in the two confirm states, so a confirmation cannot be skipped or fired twice. */
  var OPENERS = { copy: 'copy', askReset: 'confirmReset', restoreAsk: 'confirmRestore', restoreFail: 'restoreError' };
  var OVERLAY = {
    none: OPENERS,
    copy: Object.assign({ close: 'none' }, OPENERS),
    restoreError: Object.assign({ close: 'none' }, OPENERS),
    confirmReset: Object.assign({ cancel: 'none', confirm: 'none' }, OPENERS),
    confirmRestore: Object.assign({ cancel: 'none', confirm: 'none' }, OPENERS)
  };
  function overlayNext(s, ev) { return (OVERLAY[s] && OVERLAY[s][ev]) || null; }
  /* 3. File export (PDF and backup): idle | working | done | failed. "start" is refused while working (no double download);
        a bridge that never answers ends in "timeout", so the button cannot stay stuck. */
  var EXPORT = { idle: { start: 'working' }, done: { start: 'working' }, failed: { start: 'working' }, working: { done: 'done', fail: 'failed', timeout: 'failed' } };
  function exportNext(s, ev) { return (EXPORT[s] && EXPORT[s][ev]) || null; }
  /* 4. One vendor question: status not | asked | fine | red, plus the date asked.
        Invariants: "not" has no date; any other status has a date (today when first set); no date in the future. */
  var VQ_STATUS = ['not', 'asked', 'fine', 'red'];
  var ISO = /^\d{4}-\d{2}-\d{2}$/;
  function setVendorStatus(vq, status, today) {
    if (VQ_STATUS.indexOf(status) < 0) return null;
    var date = (vq && vq.date) || '';
    if (status === 'not') date = ''; else if (!date) date = today;
    return { status: status, date: date };
  }
  function setVendorDate(vq, date, today) {
    if (date && (!ISO.test(date) || date > today)) return null;
    var status = (vq && VQ_STATUS.indexOf(vq.status) >= 0) ? vq.status : 'not';
    if (date && status === 'not') status = 'asked'; /* a date asked means it was asked */
    if (!date && status !== 'not') date = (vq && vq.date) || today; /* asked stays dated */
    return { status: status, date: date };
  }
  /* 5. "Is it AI?" helper, derived from the three answers and the register's not-AI rule:
        empty | ai | unsettled | notai | notai-needs-confirmation | notai-confirmed | notai-blocked.
        tool.notAI is always derived from tool.isai (syncIsAI), never set on its own. */
  function isAIRules(a) { return !!a && a.rules === 'yes' && a.learns === 'no' && a.says === 'no'; }
  function syncIsAI(tool) {
    tool.notAI = isAIRules(tool.isai) ? 'yes' : '';
    if (tool.notAI !== 'yes') tool.notAIConfirmed = '';
    return tool;
  }
  function isAIState(tool, c) {
    var a = tool.isai || {};
    if (a.learns === 'yes' || a.says === 'yes') return 'ai';
    if (isAIRules(a)) {
      if (c.notAIBlocked === 'blocked') return 'notai-blocked';
      if (c.notAIBlocked === 'needs-confirmation') return tool.notAIConfirmed === 'yes' ? 'notai-confirmed' : 'notai-needs-confirmation';
      return 'notai';
    }
    return (a.learns || a.says || a.rules) ? 'unsettled' : 'empty';
  }
  /* 6. Answer status of one question (unanswered | unsure | answered) and of one tool:
        incomplete (an answer or "how did the hotel get it" missing) | open (settled level, but something is "not sure"
        or still open with the vendor) | settled. */
  function questionStatus(q, tool) {
    var a = findAnswer(q, (tool.ans || {})[q.id]);
    return !a ? 'unanswered' : a.id === 'unsure' ? 'unsure' : 'answered';
  }
  function toolStatus(e) {
    if (e.unanswered) return 'incomplete';
    return (e.stillOpen.length || (e.origin && e.origin.unsure)) ? 'open' : 'settled';
  }
  /* 7. Saved data (localStorage and backup files). Schema version 1 is the only version so far; restoreState validates
        every field and drops what this build cannot use (unknown types, answers that are not offered or not shown,
        unknown origins, broken vendor statuses), so a file can never put a tool in a state the screens cannot reach. */
  var SCHEMA = 1;
  function blankState() { return { v: SCHEMA, example: false, hotel: { name: '', country: '', size: '', model: '', group: '', reps: '' }, tools: [], done: {}, seq: 0, updatedAt: null }; }
  function newTool(type, id) { return { id: id || 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), type: type, name: '', vendor: '', origin: '', ans: {}, vq: {}, askAnyway: false, notAI: '', notAIConfirmed: '', isai: {} }; }
  var MIGRATE = { /* 1: current. Add "1: function (o) { ...; o.v = 2; return o; }" here when the schema changes. */ };
  function restoreState(o, ctx) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return { ok: false, error: 'not-a-guide-file' };
    if (typeof o.v !== 'number' || !Array.isArray(o.tools)) return { ok: false, error: 'not-a-guide-file' };
    if (o.v > SCHEMA) return { ok: false, error: 'newer-version' };
    while (o.v < SCHEMA) { if (!MIGRATE[o.v]) return { ok: false, error: 'not-a-guide-file' }; o = MIGRATE[o.v](o); }
    var s = blankState(), ref = ctx.ref, k, seen = {};
    var allowed = { country: ref.countries.map(function (c) { return c[0]; }), size: ['s', 'm', 'l', 'xl'], model: ref.operatingModels.map(function (m) { return m.id; }), group: ['yes', 'no'], reps: ['yes', 'no', 'unsure'] };
    s.example = o.example === true;
    s.updatedAt = typeof o.updatedAt === 'string' ? o.updatedAt : null;
    s.seq = typeof o.seq === 'number' ? o.seq : 0;
    if (o.done && typeof o.done === 'object') for (k in o.done) if (typeof o.done[k] === 'string') s.done[k] = o.done[k];
    for (k in s.hotel) if (o.hotel && typeof o.hotel[k] === 'string' && (!allowed[k] || allowed[k].indexOf(o.hotel[k]) >= 0)) s.hotel[k] = o.hotel[k];
    o.tools.forEach(function (t) {
      if (!t || typeof t !== 'object' || !ctx.types[t.type]) return;
      var type = ctx.types[t.type], n = newTool(t.type);
      if (typeof t.id === 'string' && /^[\w-]{1,40}$/.test(t.id) && !seen[t.id]) n.id = t.id;
      seen[n.id] = 1;
      ['name', 'vendor'].forEach(function (f) { if (typeof t[f] === 'string') n[f] = t[f]; });
      if (typeof t.origin === 'string' && ctx.origins[t.origin]) n.origin = t.origin;
      n.askAnyway = t.askAnyway === true;
      /* answers: in question order, only offered answers to questions shown given the earlier answers */
      var ans = t.ans && typeof t.ans === 'object' ? t.ans : {};
      type.questions.forEach(function (q) {
        if (q.when && q.when['in'].indexOf(n.ans[q.when.q]) < 0) return;
        if (findAnswer(q, ans[q.id])) n.ans[q.id] = ans[q.id];
      });
      var vq = t.vq && typeof t.vq === 'object' ? t.vq : {};
      (type.vendor || []).forEach(function (q, i) {
        var x = vq[i]; if (!x || typeof x !== 'object') return;
        var st = setVendorStatus({ date: ISO.test(x.date) && x.date <= ctx.today ? x.date : '' }, x.status, ctx.today);
        if (st && st.status !== 'not') n.vq[i] = st;
      });
      var ia = t.isai && typeof t.isai === 'object' ? t.isai : {};
      ['learns', 'says', 'rules'].forEach(function (f) { if (['yes', 'no', 'unsure'].indexOf(ia[f]) >= 0) n.isai[f] = ia[f]; });
      n.notAIConfirmed = t.notAIConfirmed === 'yes' ? 'yes' : '';
      syncIsAI(n);
      s.tools.push(n);
    });
    return { ok: true, state: s, dropped: o.tools.length - s.tools.length };
  }

  /* ctx = { ref, labels (uc-labels.json), guide, L (RegLogic), today } */
  function makeCtx(ref, labels, guide, L, today) {
    var uses = {}; labels.uses.forEach(function (u) { uses[u.id] = u; });
    var types = {}; guide.types.forEach(function (t) { types[t.id] = t; });
    var origins = {}; guide.origins.forEach(function (o) { origins[o.id] = o; });
    return { ref: ref, uses: uses, types: types, origins: origins, guide: guide, L: L, today: today || isoDay(new Date()) };
  }

  function visibleQuestions(type, tool) {
    var ans = (tool && tool.ans) || {};
    return type.questions.filter(function (q) { return !q.when || q.when['in'].indexOf(ans[q.when.q]) >= 0; });
  }
  function findAnswer(q, id) { for (var i = 0; i < q.answers.length; i++) if (q.answers[i].id === id) return q.answers[i]; return null; }

  /* Two questions can set the same register question; the more careful answer wins (yes > not sure > no). */
  function merge(into, set) {
    Object.keys(set || {}).forEach(function (k) {
      if (!(k in into) || ANSWER_RANK[set[k]] > ANSWER_RANK[into[k]]) into[k] = set[k];
    });
  }

  /* The register row and register answers behind one guide tool. */
  function toRegister(tool, ctx) {
    var type = ctx.types[tool.type], qs = visibleQuestions(type, tool), useId = type.use, set = {}, implied = false, asked = {};
    qs.forEach(function (q) {
      var a = findAnswer(q, (tool.ans || {})[q.id]);
      if (!a) return;
      Object.keys(a.set || {}).forEach(function (k) { asked[k] = true; });
      if (a.use) useId = a.use;
      merge(set, a.set);
      if (a.implied === 'no') implied = true;
    });
    var base = ctx.uses[useId];
    if (!base) throw new Error('Unknown register use ' + useId + ' for type ' + tool.type);
    /* A question the guide asks in plain words but the chosen row does not carry is attached to the row,
       using the register's own definition (reference.json); see README "Pending D7 sign-off". */
    var have = {}; (base.switches || []).forEach(function (s) { have[s.id] = true; });
    var added = Object.keys(asked).filter(function (k) { return !have[k] && ctx.ref.switches[k]; });
    var row = added.length ? Object.assign({}, base, { switches: (base.switches || []).concat(added.map(function (k) { return { id: k, guide: true }; })) }) : base;
    if (implied) (row.switches || []).forEach(function (s) { if (!(s.id in set)) set[s.id] = 'no'; });
    var o = ctx.origins[tool.origin] || null;
    var reg = { answers: set, origin: o ? o.reg : 'vendor', notAI: tool.notAI || '', notAIConfirmed: tool.notAIConfirmed || '' };
    return { row: row, reg: reg, added: added, origin: o };
  }

  function tierOf(label, ctx) { return (ctx.guide.levelMap[label] || { tier: 'unknown' }).tier; }

  function evalTool(tool, hotel, ctx) {
    var L = ctx.L, ref = ctx.ref, type = ctx.types[tool.type];
    var m = toRegister(tool, ctx), qs = visibleQuestions(type, tool);
    /* an answer that is not one of the question's own answers counts as missing (it sets nothing) */
    var unanswered = qs.filter(function (q) { return !findAnswer(q, (tool.ans || {})[q.id]); }).length + (ctx.origins[tool.origin] ? 0 : 1);
    var c = L.classify(m.row, m.reg, ref);
    var items = L.items(m.row, m.reg, { country: hotel.country }, ref, c);
    var lm = ctx.guide.levelMap[c.label] || {};
    var tier = unanswered ? 'pending' : tierOf(c.label, ctx);
    var basis = L.labelBasis(m.row, c, ref);
    var reason = '';
    if (basis.from === 'answer') c.reasons.forEach(function (r) { if (r.id === basis.id) reason = r.text; });
    else if (basis.from === 'question') reason = 'Could be ' + ctx.guide.tiers[tierOf(ref.switches[basis.id].yes, ctx)].name.toLowerCase() + ' if the answer to this is yes: ' + ref.switches[basis.id].q;
    if (!reason) reason = m.row.why || (ref.labels[c.label] || {}).short || '';
    if (c.label === 'notai') reason = ref.labels.notai.short;
    var stillOpen = c.open.map(function (id) { return { id: id, q: ref.switches[id].q, unsure: (m.reg.answers[id] === 'unsure') }; });
    var inhouse = !!(m.origin && m.origin.inhouse);
    var above = ctx.guide.tiers[tier] && ctx.guide.tiers[tier].rank > ctx.guide.tiers.minimal.rank;
    var vendorNeeded = !inhouse && (above || stillOpen.length > 0 || (m.origin && m.origin.unsure));
    var vendorShown = !inhouse && (vendorNeeded || !!tool.askAnyway);
    var role = 'user', roleText;
    if (c.label === 'notai') roleText = '';
    else if (c.role === 'maker') { role = 'maker'; roleText = ref.makerRoutes[c.route] ? ref.makerRoutes[c.route].text : 'Your hotel or group is its maker.'; }
    else if (c.routePending) roleText = 'You use it. If it turns out high-risk, ' + (c.routePending === 'brand' ? 'having your name on it' : 'changing it substantially') + ' would make your group its maker (Art. 25(1)).';
    else roleText = inhouse ? '' : "You use it; the vendor is its maker. You carry the user's duties, the vendor the maker's.";
    return { tool: tool, type: type, row: m.row, reg: m.reg, added: m.added, origin: m.origin, c: c, items: items, tier: tier, badge: unanswered ? '' : (lm.badge || ''),
             unanswered: unanswered, reason: reason, basis: basis, stillOpen: stillOpen, vendorNeeded: vendorNeeded, vendorShown: vendorShown,
             inhouse: inhouse, role: role, roleText: roleText, name: tool.name || type.name };
  }

  function evalAll(state, ctx) { return state.tools.map(function (t) { return evalTool(t, state.hotel, ctx); }); }

  function vendorKey(e) { return (e.tool.vendor || '').trim() || ('Vendor of ' + e.name); }

  /* The plan: RegLogic.items for every tool, hotel-wide items once, vendor items once per vendor (as in the register's To do). */
  function plan(state, evals, ctx) {
    var ref = ctx.ref, g = ctx.guide, rows = {}, order = [];
    var nonEU = ['CH', 'GB', 'NO', 'IS', 'LI'].indexOf(state.hotel.country) >= 0;
    function add(key, r, e) {
      if (!rows[key]) { r.key = key; r.tools = []; rows[key] = r; order.push(key); }
      if (e && rows[key].tools.indexOf(e.name) < 0) rows[key].tools.push(e.name);
    }
    var anyStaff = false;
    evals.forEach(function (e) {
      if (e.tier === 'pending') return;
      e.items.forEach(function (it) {
        if (it.id === 'R2' && !e.vendorShown) return; /* vendor questions only where they are needed (or asked anyway) */
        var key = it.scope === 'hotel' ? 'h:' + it.id : it.scope === 'vendor' ? 'v:' + vendorKey(e) + ':' + it.id : 't:' + e.tool.id + ':' + it.id;
        var note = it.note || '';
        if (it.id === 'LB1') {
          anyStaff = true;
          var reps = state.hotel.reps;
          note = (reps === 'yes' ? g.staffReps.yes : reps === 'no' ? g.staffReps.no : '') + (note ? ' ' + note : '');
        }
        var text = it.text;
        if (it.id === 'R2') text = 'Check whether ' + vendorKey(e) + ' has answered the questions on the Vendors page, and whether the answers are in the contract.';
        if (it.id === 'L1') text = 'Take measures so that staff and contractors who use AI tools understand what each one does and where it can go wrong (for example a short briefing), and keep a note.';
        if (it.id === 'R1') text = 'Check whether each AI tool has one person in the hotel named as responsible for it.';
        add(key, { id: it.id, text: text, who: it.who, kind: it.kind, law: nonEU && (it.kind === 'duty' || it.kind === 'maker') ? 'EU rule, for reference' : LAW_COL[it.kind] || '', tag: it.tag || '',
                   ref: it.ref || '', note: note, when: it.when, since: it.since, scope: it.scope || 'tool', order: it.order }, e);
      });
      if (e.origin && e.origin.unsure) add('t:' + e.tool.id + ':ORIG', { id: 'ORIG', text: 'Find out: ' + g.originUnsure.text, who: g.originUnsure.who, kind: 'open', law: LAW_COL.open, ref: 'AI Act Arts. 3(3), 25(1)', note: '', when: null, scope: 'tool', order: -50 }, e);
      /* A red-flag answer from the vendor becomes a follow-up. */
      if (e.vendorShown) (e.type.vendor || []).forEach(function (q, i) {
        var st = ((e.tool.vq || {})[i] || {}).status;
        if (st === 'red') add('t:' + e.tool.id + ':RF' + i, { id: 'RF' + i, text: g.redFlag.text.replace('{vendor}', vendorKey(e)).replace('{ask}', q.ask.replace(/\[product\]/g, e.name)), who: g.redFlag.who, kind: 'practice', law: LAW_COL.practice, ref: '', note: 'The fine answer and the red flag are the team\'s own drafts of good practice, not legal requirements.', when: null, scope: 'tool', order: -40 }, e);
      });
    });
    if (anyStaff && (state.hotel.reps === 'unsure' || !state.hotel.reps)) {
      add('h:REPS', { id: 'REPS', text: 'Find out: ' + g.staffReps.unsure.text, who: g.staffReps.unsure.who, kind: 'open', law: LAW_COL.open, ref: g.staffReps.unsure.ref, note: '', when: null, scope: 'hotel', order: -60 });
    }
    if (nonEU && ref.countryChecks[state.hotel.country] && evals.some(function (e) { return e.tier !== 'pending'; })) {
      ref.countryChecks[state.hotel.country].items.forEach(function (ci) { add('h:' + ci.id, { id: ci.id, text: ci.text, who: ci.who, kind: 'law', law: 'Yes, national law', ref: '', note: ref.countryChecks[state.hotel.country].reach, when: null, scope: 'hotel', order: -30 }); });
    }
    var done = state.done || {};
    var out = order.map(function (k) { var r = rows[k]; r.done = !!done[k]; return r; });
    var KO = ctx.L.KIND_ORDER;
    out.sort(function (a, b) {
      if (a.when !== b.when) { if (!a.when) return -1; if (!b.when) return 1; return a.when < b.when ? -1 : 1; }
      return (KO[a.kind] - KO[b.kind]) || (a.order - b.order);
    });
    return out;
  }
  function isNow(r, today) { return !r.when || r.when <= today; }

  /* Three-line verdict: this month / can wait until <date> / nothing beyond briefing staff. */
  function verdict(state, evals, rows, ctx) {
    var today = ctx.today, now = [], later = {}, nothing = [], pending = [];
    evals.forEach(function (e) {
      if (e.tier === 'pending') { pending.push(e.name); return; }
      var mine = rows.filter(function (r) { return r.scope !== 'hotel' && r.tools.indexOf(e.name) >= 0 && !r.done; });
      var nowRows = mine.filter(function (r) { return isNow(r, today); });
      var laterRows = mine.filter(function (r) { return !isNow(r, today); });
      if (nowRows.length) {
        var asks = nowRows.filter(function (r) { return r.kind === 'open'; }).length;
        var first = nowRows.filter(function (r) { return r.kind !== 'open'; })[0];
        var bits = [];
        if (asks) bits.push('find out ' + asks + ' thing' + (asks > 1 ? 's' : '') + ' from the vendor');
        if (first) bits.push(lower(shorten(first.text)) + (nowRows.length - asks > 1 ? ' (and ' + plural(nowRows.length - asks - 1, 'more item') + ')' : ''));
        now.push(e.name + ': ' + bits.join('; '));
      }
      var dates = laterRows.map(function (r) { return r.when; });
      if (e.tier === 'phigh') dates.push(ctx.ref.dates.highrisk);
      dates.filter(function (d, i, a) { return a.indexOf(d) === i; }).forEach(function (d) {
        (later[d] = later[d] || []).push(e.name + (e.tier === 'phigh' && !laterRows.length ? ' (high-risk duties, if the vendor confirms it is high-risk)' : e.tier === 'high' ? ' (high-risk duties)' : ''));
      });
      if (!nowRows.length && !dates.length) nothing.push(e.name);
    });
    var hw = rows.filter(function (r) { return r.scope === 'hotel' && !r.done && isNow(r, today); });
    return {
      now: now, hotelNow: hw.map(function (r) { return r.text; }),
      later: Object.keys(later).sort().map(function (d) { return { date: d, label: fmtDate(d), tools: later[d] }; }),
      nothing: nothing, pending: pending
    };
  }
  function shorten(s) { s = String(s).replace(/^Check whether /, 'check whether ').split(/(?<=\.)\s/)[0]; return s.length > 150 ? s.slice(0, 147).replace(/\s+\S*$/, '') + '…' : s.replace(/\.$/, ''); }
  function plural(n, one) { return n + ' ' + (n === 1 ? one : one.replace(/item$/, 'items')); }
  function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function verdictLines(v) {
    var out = [];
    out.push('Do this month: ' + (v.now.length ? v.now.join(' · ') : 'nothing tool-specific') + (v.hotelNow.length ? ' · For the whole hotel: ' + v.hotelNow.length + ' item' + (v.hotelNow.length > 1 ? 's' : '') + ', starting with briefing staff on AI' : '') + '.');
    if (v.later.length) v.later.forEach(function (l) { out.push('Can wait until ' + l.label + ': ' + l.tools.join(' · ') + '.'); });
    else out.push('Can wait until a later date: nothing.');
    out.push('Nothing to do beyond briefing staff: ' + (v.nothing.length ? v.nothing.join(' · ') : 'none of your tools') + '.');
    return out;
  }

  /* Summary tiles: "possibly" counted apart from the firm tier. */
  function tiles(evals, ctx) {
    var by = {};
    evals.forEach(function (e) { by[e.tier] = (by[e.tier] || 0) + 1; });
    return Object.keys(ctx.guide.tiers).sort(function (a, b) { return ctx.guide.tiers[b].rank - ctx.guide.tiers[a].rank; })
      .filter(function (k) { return by[k]; }).map(function (k) { return { tier: k, name: ctx.guide.tiers[k].name, n: by[k] }; });
  }

  /* "Still open" lines on a tool card: each unsure or unanswered register question, phrased as a question for the vendor. */
  function stillOpenLines(e) {
    if (e.stillOpen.length > 6) return ['Still open: ask the vendor what the tool does. ' + e.stillOpen.length + ' questions decide its level; they are listed in the AI Register.'];
    var out = e.stillOpen.map(function (s) { return 'Still open: ask the vendor: ' + s.q; });
    if (e.origin && e.origin.unsure) out.push('Still open: ask the vendor: Who is the maker of this tool under the AI Act, and does the contract say so?');
    return out;
  }

  function vendorStatus(e) {
    var qs = e.type.vendor || [], vq = e.tool.vq || {}, n = { not: 0, asked: 0, fine: 0, red: 0 };
    qs.forEach(function (q, i) { var s = (vq[i] || {}).status || 'not'; n[s] = (n[s] || 0) + 1; });
    if (!qs.length) return 'No questions';
    if (n.red) return n.red + ' red flag' + (n.red > 1 ? 's' : '');
    if (n.fine === qs.length) return 'Answered: looks fine';
    if (n.asked || n.fine) return 'Asked, waiting for answers';
    return 'Not asked yet';
  }

  function vendorEmail(vendor, list, hotelName, ctx) {
    var t = ctx.guide.templates.supplierEmail, hotel = hotelName || '[hotel name]';
    var products = list.map(function (e) { return e.name; }).join(', ');
    var to = /^Vendor of /.test(vendor) ? '[vendor contact]' : vendor;
    var lines = [t.intro.replace(/\{to\}/g, to).replace(/\{products\}/g, products).replace(/\{hotel\}/g, hotel)];
    var seen = {}, n = 0;
    list.forEach(function (e) {
      (e.type.vendor || []).forEach(function (q) {
        var txt = q.ask.replace(/\[product\]/g, e.name);
        if (seen[txt]) return; seen[txt] = 1;
        lines.push((++n) + '. ' + (list.length > 1 && !/\[product\]/.test(q.ask) ? '(' + e.name + ') ' : '') + txt);
      });
      stillOpenLines(e).forEach(function (s) { var txt = s.replace(/^Still open: ask the vendor: /, ''); if (/^Still open/.test(txt) || seen[txt]) return; seen[txt] = 1; lines.push((++n) + '. (' + e.name + ') ' + txt); });
    });
    lines.push(t.outro.replace(/\{hotel\}/g, hotel));
    return lines.join('\n');
  }

  /* Decisions the owner or finance lead has to take, from the results. */
  function decisions(state, evals, ctx) {
    var d = [];
    evals.forEach(function (e) {
      if (e.tier === 'banned') d.push('Stop ' + e.name + ', or have the vendor switch the banned feature off in writing. Decide on a replacement if it cannot be switched off.');
      if (e.tier === 'pbanned') d.push('Keep ' + e.name + ' only if the vendor confirms in writing that the feature in question is not there or is off.');
      if (e.role === 'maker') d.push('Decide who in the ' + (e.origin && e.origin.id === 'built-group' ? 'group' : 'hotel') + ' carries the maker\'s duties for ' + e.name + ', and whether to take legal advice.');
      if (e.tier === 'high' || e.tier === 'phigh') d.push('Budget time and training for trained human oversight of ' + e.name + ' before ' + fmtDate(ctx.ref.dates.highrisk) + (e.tier === 'phigh' ? ', if it turns out high-risk' : '') + '.');
      (e.type.vendor || []).forEach(function (q, i) { if (((e.tool.vq || {})[i] || {}).status === 'red' && e.vendorShown) d.push('Decide whether to keep ' + e.name + ': the vendor gave a red-flag answer.'); });
    });
    if (state.hotel.reps === 'unsure') d.push('Confirm whether the hotel has a works council or staff representatives.');
    d.push('Approve one person responsible for each AI tool, and the staff briefing on AI.');
    return d.filter(function (x, i, a) { return a.indexOf(x) === i; });
  }

  function ownerSummary(state, evals, rows, ctx) {
    var g = ctx.guide, H = state.hotel, v = verdict(state, evals, rows, ctx), out = [];
    out.push(g.meta.title.toUpperCase() + ': SUMMARY FOR THE OWNER');
    out.push(ctx.ref.meta.banner);
    out.push((H.name || 'Hotel not named') + (H.countryName ? ', ' + H.countryName : '') + '. Rules as of ' + fmtDate(g.meta.rulesAsOf) + '. Prepared ' + fmtDate(ctx.today) + '.');
    out.push('');
    out.push('THE SHORT VERSION');
    verdictLines(v).forEach(function (l) { out.push('- ' + l); });
    out.push('');
    out.push('TOOLS AND THEIR LEVEL UNDER THE EU AI ACT');
    evals.forEach(function (e) {
      out.push('- ' + e.name + (e.tool.vendor ? ' (' + e.tool.vendor + ')' : '') + ': ' + g.tiers[e.tier].name + (e.badge ? ', ' + e.badge.toLowerCase() : '') + (e.role === 'maker' ? '; you are its maker' : '') + '.' + (e.tier !== 'pending' ? ' Vendor: ' + (e.inhouse ? 'built in-house' : e.vendorShown ? vendorStatus(e) : 'no questions needed') + '.' : ''));
    });
    out.push('');
    out.push('MUST BE DONE NOW');
    var nowRows = rows.filter(function (r) { return !r.done && isNow(r, ctx.today) && r.kind !== 'practice' && r.kind !== 'standard'; });
    if (!nowRows.length) out.push('- Nothing open.');
    nowRows.forEach(function (r) { out.push('- ' + r.text + ' [' + r.law + (r.ref ? '; ' + r.ref : '') + '] ' + (r.tools.length ? '(' + r.tools.join(', ') + ')' : '') + ' Who: ' + r.who + '.'); });
    out.push('');
    out.push('DECISIONS NEEDED FROM THE OWNER');
    decisions(state, evals, ctx).forEach(function (x) { out.push('- ' + x); });
    return out.join('\n');
  }

  var api = { LAW_COL: LAW_COL, makeCtx: makeCtx, visibleQuestions: visibleQuestions, toRegister: toRegister, evalTool: evalTool, evalAll: evalAll, plan: plan, isNow: isNow,
              verdict: verdict, verdictLines: verdictLines, tiles: tiles, stillOpenLines: stillOpenLines, vendorStatus: vendorStatus, vendorKey: vendorKey, vendorEmail: vendorEmail,
              decisions: decisions, ownerSummary: ownerSummary, fmtDate: fmtDate, isoDay: isoDay,
              /* state machines */
              STEPS: STEPS, NAV: NAV, navNext: navNext, OVERLAY: OVERLAY, overlayNext: overlayNext, EXPORT: EXPORT, exportNext: exportNext,
              VQ_STATUS: VQ_STATUS, setVendorStatus: setVendorStatus, setVendorDate: setVendorDate, syncIsAI: syncIsAI, isAIState: isAIState,
              questionStatus: questionStatus, toolStatus: toolStatus, SCHEMA: SCHEMA, blankState: blankState, newTool: newTool, restoreState: restoreState };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.GuideLogic = api;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
