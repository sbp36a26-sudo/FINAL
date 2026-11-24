/* Do you need AI? v2: the rules (pure, no DOM). Runs in the page and in the Node tests (tests/logic.test.mjs).
   Words come from src/content.js (R2Content); the tailored questions from data/usecase-questions.json (TQ below).
   1. verdict(Q): the five questions (unchanged from v1; research_notes/AI starting point/research.md, part A).
   2. evaluate(rec, TQ): the readiness score in % and the verdict (owner, 24 Nov 2026: "percentage plus verdict").
      Every cut-off sits in T, one block, and is the team's judgement, not tested with hotels.
   3. resultModel(rec, env): every word of the result page. The screen, Copy summary and the PDF all read it, so they agree. */
(function (root) {
  'use strict';
  var C = root.R2Content;
  var RULES = 'v2 (24 Nov 2026)';
  var QIDS = ['q1', 'q2', 'q3', 'q4', 'q5'];
  var Q_OK = { y: 1, n: 1, u: 1 };
  var A_OK = { y: 1, pl: 1, p: 1, n: 1, k: 1 };
  var MUST_IDS = C.MUSTS.map(function (x) { return x.id; });
  var MUST = {}; C.MUSTS.forEach(function (x) { MUST[x.id] = x; });
  var QBY = {}; C.QUESTIONS.forEach(function (q) { QBY[q.id] = q; });
  var AK = ['pe', 'sk', 'fi', 'te', 'da', 'or'];

  /* ---------- THE CUT-OFFS (one block; team judgement, not tested with hotels) ---------- */
  var T = {
    READY: 75,          // "Ready to start a pilot": score of 75% or more ...
    ALMOST: 50,         // "Almost ready": 50% to 74%; below 50%: "Not ready yet"
    UNKNOWN_READY: 25,  // ... and fewer than 25% of the questions "Don't know yet"
    UNKNOWN_NOINFO: 50, // "Not enough information yet": more than 50% of the questions "Don't know yet"
    STRONG: 75, GAPS: 50 // an area in words: Strong (75% or more), Gaps to close (50 to 74%), Weak (below 50%)
  };
  var POINTS = { y: 2, pl: 1, p: 1, n: 0 }; // "Don't know yet" and "Doesn't apply" are left out of the points

  /* ---------- the five questions (v1 rules, unchanged) ----------
     Precedence Q1 > Q2 > Q3 > Q5; Q4 is a modifier; "Not sure" sits below any No. Only Q1 No stops. */
  function verdict(Q) {
    Q = Q || {};
    var a = function (id) { return Q_OK[Q[id]] ? Q[id] : ''; };
    var complete = QIDS.every(function (id) { return !!a(id); });
    if (a('q1') === 'n') return { key: 'stop', head: C.VERDICT.stop, second: '', complete: complete, stop: true, carried: [], find: [], q1Unsure: false };
    var carried = ['q2', 'q3', 'q5', 'q4'].filter(function (id) { return a(id) === 'n'; }).map(function (id) { return { id: id, text: QBY[id].outcome, add: QBY[id].add || '' }; });
    var find = QIDS.filter(function (id) { return a(id) === 'u'; }).map(function (id) { return { id: id, text: QBY[id].short, who: QBY[id].who }; });
    var key, second = '';
    if (a('q2') === 'n') key = 'worth';
    else if (a('q3') === 'n') { key = 'data'; if (a('q5') === 'n') second = 'Then define success.'; }
    else if (a('q5') === 'n') key = 'success';
    else if (find.length) key = 'find';
    else if (!complete) key = 'open';
    else if (a('q4') === 'n') key = 'assist';
    else key = 'go';
    return { key: key, head: key === 'open' ? 'Answer all five questions to see the verdict.' : C.VERDICT[key], second: second, complete: complete, stop: false,
      carried: carried, find: find, q1Unsure: a('q1') === 'u' };
  }
  /* The verdict as the result words it. onResult: the all-Yes headline drops its "Next: ...". */
  function verdictText(v, onResult) {
    var head = onResult && v.key === 'go' ? C.VERDICT.goDone : v.head;
    var also = v.carried.filter(function (c, i) { return !(i === 0 && C.VERDICT[{ q2: 'worth', q3: 'data', q5: 'success' }[c.id]] === v.head); });
    return { head: head, second: v.second,
      carriedLabel: v.carried.length ? (also.length < v.carried.length ? 'What this means' : 'Conditions carried forward') : '',
      carried: v.carried.map(function (c) { return c.text + (c.add ? ' ' + c.add : ''); }),
      find: v.find.map(function (f) { return f.text + ': ask ' + f.who + '.'; }),
      q1Unsure: v.q1Unsure ? 'If question 1 turns out to be No, this is not suitable for AI: rules or ordinary automation will do it.' : '' };
  }

  /* ---------- dates ---------- */
  function realDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof iso === 'string' ? iso : ''); if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3], t = new Date(Date.UTC(y, mo - 1, d));
    return y >= 2000 && y <= 2100 && t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d ? { y: y, m: mo, d: d } : null;
  }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(iso) { var r = realDate(String(iso || '').slice(0, 10)); return r ? r.d + ' ' + MONTHS[r.m - 1] + ' ' + r.y : ''; }
  function localIso(dt) {
    dt = dt || new Date(); var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return dt.getFullYear() + '-' + p(dt.getMonth() + 1) + '-' + p(dt.getDate());
  }

  /* ---------- systems examples (v1.3, owner): by the department chosen in "Where in the hotel?"; generic before that ---------- */
  function systemsFor(rec) {
    var d = rec && rec.use !== 'none' && typeof rec.dept === 'string' && Object.prototype.hasOwnProperty.call(C.SYSTEMS, rec.dept) ? rec.dept : '';
    var t = d ? C.SYSTEMS[d] : C.SYSTEMS_FALLBACK;
    return { text: t, line: 'For example: ' + t + '.', dept: d, fallback: !d, pms: /\bPMS\b/.test(t) };
  }

  /* ---------- the questions of one check ---------- */
  function useQs(TQ, useId) { var u = TQ && TQ.uses && useId && useId !== 'none' ? TQ.uses[useId] : null; return u ? u.qs : []; }
  /* Every question asked, in order: the must-haves, then the tailored ones for the chosen use case.
     { key, grp: 'must' | 'tail', a: 'must' | area key, name, q, who, act, v: answer or '', by, na: label or '' } */
  function questions(rec, TQ) {
    var sy = systemsFor(rec), out = [];
    C.MUSTS.forEach(function (m) {
      var v = rec.A && A_OK[rec.A[m.id]] ? rec.A[m.id] : '';
      out.push({ key: m.id, grp: 'must', a: 'must', name: m.name, q: m.q, who: m.who, act: m.act.replace('{ex}', sy.text), v: v, by: v === 'pl' ? (rec.By || {})[m.id] || '' : '', na: '' });
    });
    useQs(TQ, rec.use).forEach(function (t) {
      var raw = (rec.T || {})[t.id], v = A_OK[raw] || raw === 'na' ? raw : '';
      out.push({ key: t.id, grp: 'tail', a: t.a, name: TQ.areas[t.a], q: t.q, who: t.who, act: t.act, v: v, by: v === 'pl' ? (rec.TBy || {})[t.id] || '' : '', na: t.na || C.NA[1], kind: t.kind });
    });
    return out;
  }
  function pctOf(pts, max) { return max ? Math.floor(100 * pts / max) : null; } // floor: "75% ready" is never shown below the 75% cut-off
  function areaWord(pts, max) { return !max ? 'thin' : pts * 100 >= T.STRONG * max ? 'strong' : pts * 100 >= T.GAPS * max ? 'gaps' : 'weak'; }

  /* The score and the verdict.
     Score = points earned / points possible over every question with a known answer (must-haves + tailored).
     "Don't know yet" (and a blank) is unknown: left out of the points, counted and shown. "Doesn't apply" is left out altogether.
     Verdict, in this order:
       noinfo    more than half the questions unknown
       notready  any must-have at No, or the score below 50%
       ready     every must-have Yes, the score 75% or more, and fewer than a quarter of the questions unknown
       almost    everything else (50 to 74%; or a must-have not Yes but none at No; or 75%+ with a quarter or more unknown) */
  function evaluate(rec, TQ) {
    var items = questions(rec, TQ), c = { total: 0, known: 0, unknown: 0, na: 0, yes: 0, planned: 0, partly: 0, no: 0 }, pts = 0, max = 0;
    var must = { n: 0, yes: 0, planned: 0, partly: 0, no: 0, unknown: 0 }, area = {};
    items.forEach(function (it) {
      var g = area[it.a] = area[it.a] || { k: it.a, name: it.a === 'must' ? 'Must-haves' : it.name, n: 0, known: 0, pts: 0, max: 0 };
      if (it.v === 'na') { c.na++; it.state = 'na'; return; }
      c.total++; g.n++;
      if (it.grp === 'must') must.n++;
      if (!it.v || it.v === 'k') { c.unknown++; it.state = 'unknown'; if (it.grp === 'must') must.unknown++; return; }
      c.known++; g.known++; pts += POINTS[it.v]; max += 2; g.pts += POINTS[it.v]; g.max += 2;
      var w = { y: 'yes', pl: 'planned', p: 'partly', n: 'no' }[it.v]; c[w]++; it.state = w; if (it.grp === 'must') must[w]++;
    });
    must.allYes = must.yes === must.n; must.anyNo = must.no > 0;
    var areas = ['must'].concat(AK).filter(function (k) { return area[k] && area[k].n > 0; }).map(function (k) {
      var g = area[k]; g.pct = pctOf(g.pts, g.max); g.word = areaWord(g.pts, g.max); return g;
    });
    var manyUnknown = c.unknown * 100 > T.UNKNOWN_NOINFO * c.total, fewUnknown = c.unknown * 100 < T.UNKNOWN_READY * c.total;
    var level, why;
    if (c.total === 0 || manyUnknown) { level = 'noinfo'; why = 'more than half the questions are “Don’t know yet” (' + c.unknown + ' of ' + c.total + ')'; }
    else if (must.anyNo) { level = 'notready'; why = n_(must.no, 'must-have is', 'must-haves are') + ' answered No'; }
    else if (pts * 100 < T.ALMOST * max) { level = 'notready'; why = 'the score is below ' + T.ALMOST + '%'; }
    else if (must.allYes && pts * 100 >= T.READY * max && fewUnknown) { level = 'ready'; why = 'every must-have is Yes, the score is ' + T.READY + '% or more, and fewer than a quarter of the questions are unknown'; }
    else {
      level = 'almost';
      why = !must.allYes ? n_(must.n - must.yes, 'must-have is', 'must-haves are') + ' not Yes yet (none is No)'
        : pts * 100 < T.READY * max ? 'the score is between ' + T.ALMOST + '% and ' + (T.READY - 1) + '%'
        : 'a quarter or more of the questions are still “Don’t know yet” (' + c.unknown + ' of ' + c.total + ')';
    }
    return { items: items, counts: c, pts: pts, max: max, pct: pctOf(pts, max), must: must, areas: areas, level: level, why: why,
      mustOnly: !useQs(TQ, rec.use).length, cap: !must.allYes };
  }
  function n_(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---------- to-do: one plain task per open item ---------- */
  var RANK = { no: 0, partly: 1, unknown: 2, planned: 3 };
  function task(it) {
    var d = fmtDate(it.by);
    return it.state === 'planned' ? 'Finish: ' + (d ? it.act.replace(/\.$/, '') + ' (planned by ' + d + ').' : it.act)
      : it.state === 'unknown' ? 'Find out: “' + it.q + '”'
      : it.act;
  }
  /* Open items, weakest first: must-haves before tailored questions; within each No, Partly, Don't know yet, Planned; then the order asked. */
  function open(ev) {
    return ev.items.map(function (it, i) { return { it: it, i: i }; }).filter(function (x) { return RANK[x.it.state] != null; })
      .sort(function (x, y) { return (x.it.grp === 'must' ? 0 : 1) - (y.it.grp === 'must' ? 0 : 1) || RANK[x.it.state] - RANK[y.it.state] || x.i - y.i; })
      .map(function (x) { var it = x.it; return { key: it.key, must: it.grp === 'must', who: it.who, name: it.name, state: it.state, text: task(it), q: it.q }; });
  }
  function firstLabel(n) { return n === 1 ? 'Start with this one' : 'Start with these ' + (n === 3 ? 'three' : 'two'); }
  /* The action plan by person, in the readiness check's order of roles. */
  function byPerson(ev) {
    var by = {}; open(ev).forEach(function (a) { (by[a.who] = by[a.who] || []).push(a); });
    return C.WHO_ORDER.filter(function (w) { return by[w]; }).map(function (w) { return { who: w, name: C.WHO[w], items: by[w] }; });
  }
  var STATE_WORD = { yes: 'Yes', planned: 'Planned', partly: 'Partly', no: 'No', unknown: 'Don’t know yet', na: 'Doesn’t apply' };

  /* ---------- where it sits ---------- */
  function pathParts(rec, cat) {
    var p = [], d = (cat && cat.depts || []).filter(function (x) { return x.id === rec.dept; })[0], u = d && d.uses.filter(function (x) { return x.id === rec.use; })[0];
    if (rec.use === 'none') { if (rec.cat) p.push(rec.cat); if (d) p.push(d.name); p.push('None of these fits'); return p; }
    if (rec.cat) p.push(rec.cat);
    if (d) p.push(d.name);
    if (u) p.push(u.n);
    return p;
  }
  function useOf(rec, cat) { var d = (cat && cat.depts || []).filter(function (x) { return x.id === rec.dept; })[0]; return (d && d.uses.filter(function (x) { return x.id === rec.use; })[0]) || null; }
  function useLevel(u) { return u && u.use ? u.use : 'not rated'; }
  function noneLine(nUses) { return 'None of the catalogue’s ' + nUses + ' use cases matches your problem. That is worth telling the project team.'; }

  /* ---------- why-fold texts ---------- */
  /* "needed for 90 of 90 use cases in the team's resource analysis, Nov 2026" for a must-have, from the workbook's Framework matrix. */
  function shareLines(m, TQ) {
    return (m.blocks || []).map(function (name) {
      var b = (TQ.blocks || []).filter(function (x) { return x.name === name; })[0]; if (!b) return null;
      return '“' + b.name + '”: needed for ' + b.n + ' of ' + TQ.matrixTotal + ' use cases in the team’s resource analysis, Nov 2026 (' + b.layer.replace(/^(\w+):.*$/, '$1').toLowerCase() + ' layer; team judgement, not a survey).';
    }).filter(Boolean);
  }
  /* The fold under a tailored question: area, type of tool, resource intensity, evidence. */
  function tailWhy(TQ, useId, t) {
    var u = TQ.uses[useId], a = u.arch && TQ.arch[u.arch], out = [];
    out.push('Area: ' + TQ.areas[t.a] + '.');
    if (t.kind === 'addon') out.push(TQ.addonWhy[t.addon]);
    else if (t.kind === 'arch') out.push('The team’s sheet lists no organisation need for this use case, so this is the question for its type of tool.');
    else if (t.from) out.push('From the team’s resource sheet for this use case: “' + t.from + '”.');
    if (t.a === 'pe' && t.kind !== 'addon') out.push('The must-haves asked for a named owner. This asks who that is for this use case.');
    if (t.a === 'fi' && t.kind !== 'addon') out.push('The must-haves asked for a 12-month budget. This is the kind of cost the team expects for this use case.');
    if (a) out.push('Type of tool (the team’s grouping): ' + a.n + '. ' + a.what);
    out.push('Resource intensity (team judgement, not evidence-based): ' + u.int + ': ' + lc(TQ.intensity[u.int] || ''));
    out.push(u.draft ? 'Evidence: ' + lc(u.draftNote) + '.'
      : u.ev ? 'Evidence rows in the team’s D6 evidence pack: ' + u.ev + '.'
      : 'Evidence: team judgement from the catalogue description.');
    return out;
  }
  function lc(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }

  /* ---------- return visit: snapshots of the result ---------- */
  function snapshot(ev, at) { return { at: at, level: ev.level, pct: ev.pct, pts: ev.pts, max: ev.max, known: ev.counts.known, total: ev.counts.total, mustYes: ev.must.yes, mustN: ev.must.n, rules: RULES }; }
  function sameSnap(a, b) { return !!a && !!b && ['level', 'pts', 'max', 'known', 'total', 'mustYes', 'mustN'].every(function (k) { return a[k] === b[k]; }); }
  /* "Since last time": the last result that differs from the one before it. null on a first visit. */
  function since(snaps) {
    if (!snaps || snaps.length < 2) return null;
    var a = snaps[snaps.length - 2], b = snaps[snaps.length - 1], pc = function (s) { return s.pct == null ? 'no score' : s.pct + '%'; };
    var lines = [];
    lines.push('Score: ' + pc(a) + ' → ' + pc(b) + '.');
    lines.push('Must-haves at Yes: ' + a.mustYes + ' → ' + b.mustYes + ' of ' + b.mustN + '.');
    lines.push('Questions you could answer: ' + a.known + ' of ' + a.total + ' → ' + b.known + ' of ' + b.total + '.');
    lines.push(a.level === b.level ? 'Verdict unchanged: ' + C.LEVELS[b.level].name + '.' : 'Verdict: ' + C.LEVELS[a.level].name + ' → ' + C.LEVELS[b.level].name + '.');
    return { head: 'Since last time (' + fmtDate(a.at) + ')', lines: lines, earlier: snaps.slice(0, -1).reverse().map(function (s) { return fmtDate(s.at) + ': ' + C.LEVELS[s.level].name + ', ' + pc(s) + ', ' + s.mustYes + ' of ' + s.mustN + ' must-haves'; }) };
  }

  /* ---------- how it was worked out ---------- */
  function method(ev) {
    var c = ev.counts, out = [];
    out.push('Points per answer: Yes 2 · Planned, not done yet 1 · Partly 1 · No 0. “Don’t know yet” and “Doesn’t apply” are left out of the points.');
    out.push('You could answer ' + c.known + ' of ' + c.total + ' questions (' + c.unknown + ' “Don’t know yet”' + (c.na ? '; ' + c.na + ' “Doesn’t apply”, not counted' : '') + ').');
    out.push(ev.max ? 'Your points: ' + ev.pts + ' of ' + ev.max + ' possible = ' + ev.pct + '% (rounded down).' : 'No question has a known answer yet, so there is no score.');
    ev.areas.forEach(function (g) { out.push(g.name + ': ' + (g.max ? g.pts + ' of ' + g.max + ' points = ' + g.pct + '%, ' + C.AREA_WORD[g.word] : C.AREA_WORD[g.word]) + ' (' + g.known + ' of ' + g.n + ' answered' + (g.k === 'must' ? '; ' + ev.must.yes + ' of ' + ev.must.n + ' Yes' : '') + ').'); });
    out.push('Cut-offs: “' + C.LEVELS.ready.name + '” needs every must-have at Yes, a score of ' + T.READY + '% or more, and fewer than a quarter of the questions unknown. “' + C.LEVELS.almost.name + '”: ' + T.ALMOST + '% to ' + (T.READY - 1) + '%, or a must-have that is not Yes yet but none at No. “' + C.LEVELS.notready.name + '”: below ' + T.ALMOST + '%, or any must-have at No. “' + C.LEVELS.noinfo.name + '”: more than half the questions unknown.');
    out.push('Areas in words: Strong (' + T.STRONG + '% or more), Gaps to close (' + T.GAPS + '% to ' + (T.STRONG - 1) + '%), Weak (below ' + T.GAPS + '%).');
    out.push('Your verdict is “' + C.LEVELS[ev.level].name + '” because ' + ev.why + '.');
    if (ev.mustOnly) out.push(C.MUST_ONLY);
    out.push('The answers are your own and nobody checks them. The cut-offs are the team’s judgement and have not been tested with hotels. Rules ' + RULES + '.');
    return out;
  }
  function mustLine(ev) {
    var m = ev.must, p = [m.yes + ' of ' + m.n + ' must-haves in place'];
    if (m.planned) p.push(m.planned + ' planned'); if (m.partly) p.push(m.partly + ' partly'); if (m.no) p.push(m.no + ' not in place'); if (m.unknown) p.push(m.unknown + ' to find out');
    return p.join(' · ');
  }
  function scoreHead(ev) { return ev.pct == null ? 'No score yet' : ev.pct + '% ready'; }
  function scoreSub(ev) { return 'from ' + ev.counts.known + ' of ' + ev.counts.total + ' questions you could answer; ' + C.SCORE_NOTE; }

  /* ---------- the whole result, in words ----------
     env: { cat (catalogue model), TQ, RC (the readiness check's RCLogic, optional), M (its model), hotel: rec.hotel, today } */
  function resultModel(rec, env) {
    var TQ = env.TQ, cat = env.cat, v = verdict(rec.Q), ev = evaluate(rec, TQ), u = useOf(rec, cat), tu = u && TQ.uses[rec.use], H = rec.hotel || {};
    var type = (C.TYPES.filter(function (t) { return t[0] === H.type; })[0] || [])[1] || '', role = (C.ROLES.filter(function (t) { return t[0] === H.role; })[0] || [])[1] || '';
    var o = { rules: RULES, level: ev.level, ev: ev,
      title: 'Do you need AI? Result',
      hotel: [H.name, type, H.country === 'Other' ? C.COUNTRY_LABEL.Other : H.country].filter(Boolean).join(' · '),
      filledBy: role, date: fmtDate(env.today || localIso()),
      ai: verdictText(v, true),
      answers: C.QUESTIONS.map(function (q, i) { return { n: i + 1, title: q.title, q: q.q, a: ({ y: 'Yes', n: 'No', u: 'Not sure' })[rec.Q[q.id]] || 'Not answered' }; }),
      path: pathParts(rec, cat).join(' › ') || 'Nothing chosen.',
      useTask: u ? 'What AI does: ' + u.task : '', useLevel: u ? 'How common in hotels: ' + useLevel(u) + ' (Use-Case Catalogue rating).' : '',
      none: rec.use === 'none' ? noneLine(cat.nUses) : '',
      levelName: C.LEVELS[ev.level].name, levelLine: C.LEVELS[ev.level].line,
      scoreHead: scoreHead(ev), scoreSub: scoreSub(ev), mustLine: mustLine(ev),
      cap: ev.cap ? 'The top verdict needs every must-have at Yes: ' + n_(ev.must.n - ev.must.yes, 'is', 'are') + ' still open.' : '',
      mustOnly: ev.mustOnly ? C.MUST_ONLY : '', draft: tu && tu.draft ? C.DRAFT + '. These questions come from a draft row the team has not reviewed yet.' : '',
      areas: ev.areas.map(function (g) { return { k: g.k, name: g.name, pct: g.pct, word: C.AREA_WORD[g.word], cls: g.word, line: g.name + ': ' + (g.pct == null ? C.AREA_WORD[g.word] : g.pct + '% · ' + C.AREA_WORD[g.word]) + ' (' + g.known + ' of ' + g.n + ' answered)' }; }),
      method: method(ev), since: since(rec.snaps) };
    var all = open(ev);
    o.first = all.slice(0, 3).map(function (a) { return { who: C.WHO[a.who], text: a.text, sub: (a.must ? 'Must-have: ' : '') + a.name + ' · your answer: ' + STATE_WORD[a.state] }; });
    o.firstLabel = o.first.length ? firstLabel(o.first.length) : 'Nothing open';
    o.people = byPerson(ev).map(function (p) { return { who: p.who, name: p.name, items: p.items.map(function (a) { return { text: a.text, tag: (a.must ? 'Must-have · ' : '') + a.name + ' · ' + STATE_WORD[a.state], must: a.must, state: a.state }; }) }; });
    o.itemList = ev.items.map(function (it) { return { key: it.key, grp: it.grp, name: it.name, q: it.q, answer: STATE_WORD[it.state] + (it.state === 'planned' && fmtDate(it.by) ? ' (planned by ' + fmtDate(it.by) + ')' : ''), state: it.state }; });
    /* Vendor questions and the provisional AI Act label: the readiness check's own functions and data (rules v4 wording). */
    o.vendor = []; o.legal = null; o.notTool = !!(u && u.notTool);
    var x = env.RC && env.M && u ? env.M.UI[rec.use] : null;
    if (x) {
      var st = {}; ev.items.forEach(function (it) { st[it.key] = it.state; });
      var acts = []; [['m4', 'T1'], ['m6', 'P5'], ['m5', 'D5b'], ['x-pay', 'G4']].forEach(function (p) { if (st[p[0]] && st[p[0]] !== 'yes' && st[p[0]] !== 'na') acts.push({ group: 'vendor', q: { code: p[1] } }); });
      o.vendor = env.RC.vendorQs(env.M, x, { actions: acts });
      var l = env.RC.legal(env.M, x, H);
      if (l) o.legal = { name: l.name, applies: l.applies ? 'applies from ' + fmtDate(l.applies) : '', why: l.why || l.short, could: l.could.map(function (c) { return (c.to ? 'The label becomes “' + c.to + '” if: ' : 'Also check: ') + c.q; }),
        itemsHead: l.itemsHead || '', items: l.items.map(function (i) { return { text: i.text, sub: i.who + (i.from ? ' · from ' + fmtDate(i.from) : '') }; }), labour: l.labour || '', country: l.country + ' The AI Register tab has the full list for your hotel.' };
    }
    o.legalNote = C.LEGAL_NOTE;
    o.registerName = u ? u.n.replace(/\s*\(.*$/, '') : '';
    return o;
  }
  /* The result as plain text (Copy summary). who: optional role key → only that person's list (the copy-per-person buttons). */
  function personText(m, p, useName) {
    return 'Do you need AI?' + (useName ? ' ' + useName : '') + (m.hotel ? ' (' + m.hotel.split(' · ')[0] + ')' : '') + '\nFor: ' + p.name + '\nCould you help with these?\n\n' +
      p.items.map(function (a, i) { return (i + 1) + '. ' + a.text + (a.must ? ' (must-have)' : ''); }).join('\n');
  }
  function summaryText(m) {
    var out = [];
    out.push('Do you need AI? Result' + (m.hotel ? ' for ' + m.hotel : '') + ' (' + m.date + ')');
    out.push('', m.levelName + ' · ' + m.scoreHead + ' (' + m.scoreSub + ')', m.levelLine, m.mustLine);
    if (m.cap) out.push(m.cap); if (m.mustOnly) out.push(m.mustOnly); if (m.draft) out.push(m.draft);
    out.push('', 'Is this an AI problem? ' + m.ai.head + (m.ai.second ? ' ' + m.ai.second : ''));
    m.ai.carried.forEach(function (c) { out.push('- ' + c); }); m.ai.find.forEach(function (f) { out.push('- To find out: ' + f); });
    out.push('', 'Where it sits: ' + m.path);
    out.push('', 'Score per area:'); m.areas.forEach(function (a) { out.push('- ' + a.line); });
    if (m.first.length) { out.push('', m.firstLabel + ':'); m.first.forEach(function (f, i) { out.push((i + 1) + '. ' + f.who + ': ' + f.text); }); }
    if (m.people.length) { out.push('', 'Action plan by person:'); m.people.forEach(function (p) { out.push(p.name + ':'); p.items.forEach(function (a) { out.push('- ' + a.text + (a.must ? ' (must-have)' : '')); }); }); }
    if (m.vendor.length) { out.push('', 'Questions for the vendor:'); m.vendor.forEach(function (q, i) { out.push((i + 1) + '. ' + q); }); }
    if (m.legal) out.push('', 'EU AI Act (provisional, not legal advice): ' + m.legal.name + (m.legal.applies ? ', ' + m.legal.applies : '') + '. ' + m.legal.why);
    out.push('', 'Student prototype by EHL SBP Group 36 for HFTP, not legal advice. Content as of ' + C.AS_OF + '.');
    return out.join('\n');
  }

  var api = { RULES: RULES, T: T, POINTS: POINTS, QIDS: QIDS, MUST_IDS: MUST_IDS, MUST: MUST, QBY: QBY, AK: AK, Q_OK: Q_OK, A_OK: A_OK, STATE_WORD: STATE_WORD,
    verdict: verdict, verdictText: verdictText, realDate: realDate, fmtDate: fmtDate, localIso: localIso, systemsFor: systemsFor,
    useQs: useQs, questions: questions, evaluate: evaluate, open: open, byPerson: byPerson, task: task, firstLabel: firstLabel,
    pathParts: pathParts, useOf: useOf, useLevel: useLevel, noneLine: noneLine, shareLines: shareLines, tailWhy: tailWhy,
    snapshot: snapshot, sameSnap: sameSnap, since: since, method: method, mustLine: mustLine, scoreHead: scoreHead, scoreSub: scoreSub,
    resultModel: resultModel, summaryText: summaryText, personText: personText };
  root.R2Logic = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
