/* Hotel AI Register: label and duty logic.
   Plain script with no dependencies. It runs in the page and in the Node tests (tests/logic.test.mjs).
   All legal wording lives in data/reference.json and data/uc-labels.json; this file only combines it. */
(function (root) {
  'use strict';

  var RANK = { notai: 0, open: 0, minimal: 1, outside: 1, transif: 2, transparency: 3, highif: 4, high: 5, prohibited: 6 };
  var AI_ACT_PACKS = ['ban', 'chat', 'image', 'text', 'notice', 'hr-user', 'product', 'literacy', 'gen'];

  function addPacks(c, list) { (list || []).forEach(function (p) { c.packs[p] = true; }); }

  /* Resolve the label, role and duty packs of one tool.
     use  = a row of uc-labels.json; tool = a register entry (answers, origin, notAI); ref = reference.json */
  function classify(use, tool, ref) {
    tool = tool || {};
    var ans = tool.answers || {};
    var c = { base: use.base, label: use.base, open: [], openHard: [], canProhibit: false, reasons: [], areas: {}, packs: {},
              chat: !!use.chat, notice: !!use.notice, transYes: false, highUnder: use.base === 'high',
              role: 'user', route: null, routePending: null, dateKey: null };
    var cur = use.base, potHigh = false, potTrans = false, potPro = false;
    if (use.base === 'high' && use.area) c.areas[use.area] = true;

    (use.switches || []).forEach(function (s) {
      var d = ref.switches[s.id];
      if (!d) return;
      var a = ans[s.id];
      if (a === 'yes') {
        if (d.yes && RANK[d.yes] > RANK[cur]) cur = d.yes;
        if (d.yes === 'transparency') c.transYes = true;
        if (d.yes === 'high') { c.highUnder = true; if (d.area) c.areas[d.area] = true; }
        if (d.route) c.route = d.route;
        addPacks(c, d.packs);
        c.reasons.push({ id: s.id, text: d.reason || d.q, prov: d.prov || '', basis: d.basis || '', effect: d.yes || null, research: s.src === 'research' });
      } else if (a !== 'no') {
        c.open.push(s.id);
        if (!s.soft) {
          c.openHard.push(s.id);
          if (d.yes === 'high') potHigh = true;
          else if (d.yes === 'transparency') potTrans = true;
          else if (d.yes === 'prohibited') potPro = true;
        }
      }
    });

    var label;
    if (cur === 'prohibited') label = 'prohibited';
    else if (cur === 'high') label = 'high';
    else if (potHigh) label = 'highif';
    else if (cur === 'transparency') label = 'transparency';
    else if (potTrans) label = 'transif';
    else label = cur;
    if (use.triage && c.openHard.length && label !== 'prohibited' && label !== 'high') label = 'open';
    c.label = label;
    c.canProhibit = potPro && label !== 'prohibited';
    c.alsoTransparency = (c.chat || c.notice || c.transYes) && RANK[label] > RANK.transparency;

    /* Maker or user (booklet A3). Brand it and Change it only bite on high-risk tools. */
    var origin = null;
    (ref.origins || []).forEach(function (o) { if (o.id === (tool.origin || 'vendor')) origin = o; });
    var oroute = origin && origin.route;
    if (oroute === 'build') { c.role = 'maker'; c.route = 'build'; }
    else if (oroute === 'brand' || oroute === 'change') {
      if (c.highUnder) { c.role = 'maker'; c.route = oroute; }
      else if (label === 'highif') c.routePending = oroute;
    }
    if (c.route === 'repurpose') c.role = 'maker';

    addPacks(c, ['basics', 'literacy']);
    addPacks(c, use.packs);
    if (label === 'prohibited') addPacks(c, ['ban']);
    if (c.chat) addPacks(c, ['chat']);
    if (c.notice) addPacks(c, ['notice']);
    if (c.highUnder) {
      var areas = Object.keys(c.areas);
      if (areas.some(function (a) { return a !== 'product'; }) || (c.areas.product && c.role === 'maker')) addPacks(c, ['hr-user']);
      if (c.areas.product && c.role !== 'maker') addPacks(c, ['product']);
    }
    if (c.role === 'maker') { addPacks(c, ['liability']); if (use.gen) addPacks(c, ['gen']); }

    c.onlyProduct = !!c.areas.product && Object.keys(c.areas).length === 1;
    if (label === 'prohibited') c.dateKey = 'bans';
    else if (label === 'high') c.dateKey = c.onlyProduct ? 'products' : 'highrisk';
    else if (label === 'transparency') c.dateKey = 'transparency';

    if (tool.notAI === 'yes' || use.base === 'notai') {
      c.label = 'notai'; c.canProhibit = false; c.alsoTransparency = false; c.highUnder = false; c.dateKey = null;
      c.role = 'user'; c.route = null; c.routePending = null;
      AI_ACT_PACKS.forEach(function (p) { delete c.packs[p]; });
      delete c.packs.liability;
    }
    return c;
  }

  /* Which of the seven vendor questions apply to this tool. */
  function vendorQuestions(use, c, ref) {
    return (ref.vendorQuestions || []).filter(function (q) {
      if (q.for === 'all') return true;
      if (q.for === 'chat') return !!c.packs.chat;
      if (q.for === 'high') return c.label === 'high' || c.label === 'highif' || c.highUnder;
      if (q.for === 'pricing') return use.dept === 'rm' || (use.switches || []).some(function (s) { return s.id === 'competitor_data'; });
      return false;
    });
  }

  function vendorDone(use, tool, c, ref) {
    var qs = vendorQuestions(use, c, ref), vq = (tool && tool.vq) || {};
    return qs.length > 0 && qs.every(function (q) { return !!vq[q.id]; });
  }

  /* The items to check for one tool, in display order: what applies now first, then by date. */
  function items(use, tool, hotel, ref, c) {
    tool = tool || {};
    c = c || classify(use, tool, ref);
    var out = [];
    (ref.items || []).forEach(function (it, idx) {
      if (!c.packs[it.pack]) return;
      if (it.role && it.role !== c.role) return;
      if (it.area && !c.areas[it.area]) return;
      var whenKey = it.when;
      if (whenKey === 'highrisk' && c.onlyProduct) whenKey = 'products';
      var note = it.note || '';
      if (it.pack === 'labour' && hotel && ref.labourNotes && ref.labourNotes[hotel.country]) {
        note = (note ? note + ' ' : '') + ref.labourNotes[hotel.country];
      }
      var done;
      if (it.auto === 'owner') done = !!(tool.owner && String(tool.owner).trim());
      else if (it.auto === 'vendor') done = vendorDone(use, tool, c, ref);
      else done = !!(tool.done && tool.done[it.id]);
      out.push({ id: it.id, text: it.text, kind: it.kind, tag: it.tag || '', who: it.who || '', ref: it.ref || '', note: note, src: it.src || '',
                 auto: it.auto || null, done: done, when: whenKey === 'now' ? null : ref.dates[whenKey], since: it.since ? ref.dates[it.since] : null, order: idx });
    });
    out.sort(function (a, b) {
      if (a.when === b.when) return a.order - b.order;
      if (a.when === null) return -1;
      if (b.when === null) return 1;
      return a.when < b.when ? -1 : 1;
    });
    return out;
  }

  /* On which kinds of source the tool's current label rests. */
  function restsOn(use, c, ref) {
    var set = {};
    if (use.basis) set[use.basis] = true;
    c.reasons.forEach(function (r) { if (r.basis) set[r.basis] = true; });
    c.openHard.forEach(function (id) { var d = ref.switches[id]; if (d && d.basis) set[d.basis] = true; });
    return set;
  }

  /* Does a watch-list entry touch this tool? Conditions are OR-ed, or AND-ed when affects.and is true. */
  function radarHitsTool(entry, use, c, ref) {
    var a = entry.affects || {};
    if (a.all) return true;
    var tests = [];
    if (a.uses) tests.push(a.uses.indexOf(use.id) >= 0);
    if (a.depts) tests.push(a.depts.indexOf(use.dept) >= 0);
    if (a.labels) tests.push(a.labels.indexOf(c.label) >= 0);
    if (a.roles) tests.push(a.roles.indexOf(c.role) >= 0);
    if (a.staff) tests.push(!!use.staff || !!c.areas.employment);
    if (a.areas) tests.push(a.areas.some(function (x) { return !!c.areas[x]; }));
    if (a.packs) tests.push(a.packs.some(function (p) { return !!c.packs[p]; }));
    if (a.basis) { var rs = restsOn(use, c, ref); tests.push(a.basis.some(function (b) { return !!rs[b]; })); }
    if (!tests.length) return false;
    return a.and ? tests.every(Boolean) : tests.some(Boolean);
  }

  function radarHitsHotel(entry, hotel) {
    var a = entry.affects || {};
    return !!(a.countries && hotel && a.countries.indexOf(hotel.country) >= 0);
  }

  var api = { RANK: RANK, classify: classify, items: items, vendorQuestions: vendorQuestions, vendorDone: vendorDone,
              restsOn: restsOn, radarHitsTool: radarHitsTool, radarHitsHotel: radarHitsHotel };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RegLogic = api;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
