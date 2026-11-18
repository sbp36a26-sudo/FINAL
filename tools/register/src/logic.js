/* Hotel AI Register: label and duty logic.
   Plain script with no dependencies. It runs in the page and in the Node tests (tests/logic.test.mjs).
   All legal wording lives in data/reference.json and data/uc-labels.json; this file only combines it. */
(function (root) {
  'use strict';

  var RANK = { notai: 0, open: 0, minimal: 1, outside: 1, transif: 2, transparency: 3, highif: 4, high: 5, banif: 5.5, prohibited: 6 };
  var KEEP_WHEN_BANNED = ['ban', 'literacy', 'basics', 'labour'];
  /* Order inside a date group: what can change the label, then AI Act duties, other law, standards, the maker's duties to check, good practice. */
  var KIND_ORDER = { open: 0, duty: 1, law: 2, standard: 3, maker: 4, practice: 5 };
  var AI_ACT_PACKS = ['ban', 'chat', 'image', 'text', 'notice', 'hr-user', 'product', 'literacy', 'gen'];

  function addPacks(c, list) { (list || []).forEach(function (p) { c.packs[p] = true; }); }

  /* Resolve the label, role and duty packs of one tool.
     use  = a row of uc-labels.json; tool = a register entry (answers, origin, notAI); ref = reference.json */
  function classify(use, tool, ref) {
    tool = tool || {};
    var ans = tool.answers || {};
    var c = { base: use.base, label: use.base, open: [], openHard: [], canProhibit: false, reasons: [], areas: {}, packs: {},
              chat: !!use.chat, notice: !!use.notice, transYes: false, highUnder: use.base === 'high',
              role: 'user', route: null, routePending: null, dateKey: null, openBan: [], unsure: [], notAIBlocked: false, packsIfOff: null };
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
        if (a === 'unsure') c.unsure.push(s.id);
        if (d.yes === 'prohibited') c.openBan.push(s.id);
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
    /* Rule 1: an unanswered or "Not sure" ban question beats every lower label (soft questions included). */
    c.labelUnder = label;
    if (c.openBan.length && label !== 'prohibited') label = 'banif';
    c.label = label;
    c.canProhibit = (potPro || c.openBan.length > 0) && label !== 'prohibited';
    c.canProhibitHard = potPro && label !== 'prohibited';
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
    if (tool.decided === 'brand') addPacks(c, ['brandmandate']);
    if (c.unsure.length) addPacks(c, ['unsure']);
    addPacks(c, use.packs);
    if (label === 'prohibited') addPacks(c, ['ban']);
    if (c.chat) addPacks(c, ['chat']);
    if (c.notice) addPacks(c, ['notice']);
    if (c.highUnder) {
      var areas = Object.keys(c.areas);
      if (areas.some(function (a) { return a !== 'product'; }) || (c.areas.product && c.role === 'maker')) addPacks(c, ['hr-user']);
      if (c.areas.product && c.role !== 'maker') addPacks(c, ['product']);
    }
    /* Rule 5: a repurposed general tool (e.g. a chatbot used to rank CVs) does not bring product liability or the QMS standard. */
    if (c.role === 'maker') { if (c.route !== 'repurpose') addPacks(c, ['liability']); if (use.gen || c.packs.chat) addPacks(c, ['gen']); }

    c.onlyProduct = !!c.areas.product && Object.keys(c.areas).length === 1;
    if (label === 'prohibited') c.dateKey = 'bans';
    else if (label === 'high') c.dateKey = c.onlyProduct ? 'products' : 'highrisk';
    else if (label === 'transparency') c.dateKey = 'transparency';

    /* Rule 2: "rules only, not AI" can never override a ban or high-risk answer, or an open ban or high-risk question.
       For a use whose questions can make it banned or high-risk, it also needs the vendor's written confirmation. */
    var risky = (use.switches || []).some(function (s) { var d = ref.switches[s.id]; return d && (d.yes === 'prohibited' || d.yes === 'high'); }) || use.base === 'high';
    var blocks = c.label === 'prohibited' || c.label === 'high' || c.label === 'highif' || c.label === 'banif' || c.openBan.length > 0;
    var notAI = use.base === 'notai' || (tool.notAI === 'yes' && !blocks && (!risky || tool.notAIConfirmed === 'yes'));
    if (tool.notAI === 'yes' && !notAI && use.base !== 'notai') c.notAIBlocked = blocks ? 'blocked' : 'needs-confirmation';
    if (notAI) {
      c.label = 'notai'; c.canProhibit = false; c.alsoTransparency = false; c.highUnder = false; c.dateKey = null;
      c.role = 'user'; c.route = null; c.routePending = null;
      AI_ACT_PACKS.forEach(function (p) { delete c.packs[p]; });
      delete c.packs.liability; delete c.packs.unsure;
    }
    /* Rule 3: prohibited means stop. Only the stop item, AI literacy, basics and labour items stay; the rest is shown
       separately as "if you switch the banned feature off". */
    if (c.label === 'prohibited') {
      c.packsIfOff = {};
      Object.keys(c.packs).forEach(function (p) { if (p !== 'ban') c.packsIfOff[p] = true; });
      var kept = {}; KEEP_WHEN_BANNED.forEach(function (p) { if (c.packs[p]) kept[p] = true; });
      c.packs = kept;
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
  function items(use, tool, hotel, ref, c, packsOverride) {
    tool = tool || {};
    c = c || classify(use, tool, ref);
    var packs = packsOverride || c.packs, out = [];
    (ref.items || []).forEach(function (it, idx) {
      if (!packs[it.pack]) return;
      /* Rule 4: maker items only for makers; user duties stay for a maker that also uses the tool,
         except checks that only make sense against an outside vendor. */
      if (it.role === 'maker' && c.role !== 'maker') return;
      if (c.role === 'maker' && (it.vendorOnly || (it.role === 'user' && it.kind === 'maker'))) return;
      if (it.onlyRoute && it.onlyRoute.indexOf(c.route || '') < 0) return;
      if (it.notRoute && it.notRoute.indexOf(c.route || '') >= 0) return;
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
      out.push({ id: it.id, scope: it.scope || 'tool', text: it.text, kind: it.kind, tag: it.tag || '', who: it.who || '', ref: it.ref || '', note: note, src: it.src || '',
                 auto: it.auto || null, done: done, when: whenKey === 'now' ? null : ref.dates[whenKey], since: it.since ? ref.dates[it.since] : null, order: idx });
    });
    /* Rule 6: every "Not sure" answer becomes something to find out. */
    if (packs.unsure) c.unsure.forEach(function (id, k) {
      var d = ref.switches[id]; if (!d) return;
      var who = /staff|hr|career|hours|rank|judge|coach|job|repurpose/.test(id) ? 'HR or the vendor' : /face|bio|voice|card|paste|sensitive|scan|med/.test(id) ? 'Data protection contact or the vendor' : 'The vendor';
      out.push({ id: 'Q-' + id, text: 'Find out: ' + d.q, kind: 'open', tag: 'Open question', who: who, ref: d.prov || '', note: d.yes ? 'Why: if the answer is yes, the label becomes ' + (((ref.labels || {})[d.yes] || {}).name || d.yes) + '.' : '', src: '',
                auto: null, done: !!(tool.done && tool.done['Q-' + id]), when: null, since: null, order: -100 + k });
    });
    out.sort(function (a, b) {
      if (a.when === b.when) return (KIND_ORDER[a.kind] - KIND_ORDER[b.kind]) || (a.order - b.order);
      if (a.when === null) return -1;
      if (b.when === null) return 1;
      return a.when < b.when ? -1 : 1;
    });
    return out;
  }

  /* The basis behind the current label: the answer or open question that set it, else the use case's default. */
  function labelBasis(use, c, ref) {
    var best = null;
    c.reasons.forEach(function (r) { if (r.effect && (r.effect === c.label || (c.label === 'high' && r.effect === 'high') || (c.label === 'prohibited' && r.effect === 'prohibited')) && (!best || RANK[r.effect] > RANK[best.effect])) best = r; });
    if (best) return { basis: best.basis || use.basis, prov: best.prov || '', from: 'answer', id: best.id };
    var want = c.label === 'banif' ? 'prohibited' : c.label === 'highif' ? 'high' : c.label === 'transif' ? 'transparency' : null;
    var ids = c.label === 'banif' ? c.openBan : c.openHard;
    if (want) for (var i = 0; i < ids.length; i++) { var d = ref.switches[ids[i]]; if (d && d.yes === want) return { basis: d.basis || use.basis, prov: d.prov || '', from: 'question', id: ids[i] }; }
    return { basis: use.basis, prov: use.prov || '', from: 'default', id: null };
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

  /* Art. 111(2) as amended: a high-risk tool already in use before the high-risk date may be a legacy tool. */
  function maybeLegacy(tool, c, ref) {
    var since = String((tool || {}).since || '');
    if (!/^\d{4}-\d{2}/.test(since)) return false;
    return (c.label === 'high' || c.highUnder) && since < ref.dates.highrisk;
  }

  var api = { RANK: RANK, KIND_ORDER: KIND_ORDER, maybeLegacy: maybeLegacy, classify: classify, items: items, vendorQuestions: vendorQuestions, vendorDone: vendorDone,
              restsOn: restsOn, labelBasis: labelBasis, radarHitsTool: radarHitsTool, radarHitsHotel: radarHitsHotel };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RegLogic = api;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
