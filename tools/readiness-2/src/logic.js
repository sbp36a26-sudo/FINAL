/* Do you need AI? v2: the rules (pure, no DOM). Runs in the page and in the Node tests (tests/logic.test.mjs).
   Words come from src/content.js (R2Content); the tailored questions from data/usecase-questions.json (TQ below).
   1. verdict(Q): the five questions (unchanged from v1; research_notes/AI starting point/research.md, part A).
   2. evaluate(rec, TQ): the score in % and the verdict (owner, 24 Nov 2026: "percentage plus verdict").
      Every cut-off sits in T, one block, and is the team's judgement, not tested with hotels.
      Rules v2.1 (24 Nov 2026, after the clean-up audit and the council on v2.0): the three switches in JUDGEMENT.
   3. resultModel(rec, env): every word of the result page. The screen, Copy summary and the PDF all read it, so they agree. */
(function (root) {
  'use strict';
  var C = root.R2Content;
  var RULES = 'v2.1 (24 Nov 2026)';
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
  var POINTS = { y: 2, pl: 1, p: 1, n: 0 }; // "Doesn't apply" is left out; "Don't know yet": see JUDGEMENT.UNKNOWN_SCORES_ZERO

  /* ---------- TEAM JUDGEMENT (rules v2.1): three switches the owner can flip. Each is named in "How this was worked out". ----------
     UNKNOWN_SCORES_ZERO   (council B2) true: "Don't know yet" counts as 0 points, so the score is the share of everything asked
                           that is in place. false: it is left out of the points (rules v2). Either way it is listed as "to find out".
     LEGAL_HOLDS_TOP       (council B5) true: no "Ready to start a pilot" for a use the AI Register labels high-risk, or that the
                           team's sheet flags as handling sensitive personal data. The tool cannot check the legal items, so the
                           best verdict is "Almost ready" and the result says why. false: the line under the verdict only.
     CARRIED_NO_HOLDS_TOP  (council B6) true: a No on questions 2 to 5 of step 2 (C-R-I-S-P) holds back the top verdict, with
                           the reason shown. false: it is carried as a condition only (rules v2). */
  var JUDGEMENT = { UNKNOWN_SCORES_ZERO: true, LEGAL_HOLDS_TOP: true, CARRIED_NO_HOLDS_TOP: true };
  /* Does the use have legal items to check first? high: the AI Register's provisional label is High-risk (TQ.highRisk, set by
     build.mjs from the register's label file); sens: the team's sheet flags sensitive personal data (the add-on question). */
  function legalFlags(TQ, useId) {
    var u = TQ && TQ.uses && useId ? TQ.uses[useId] : null;
    var high = !!(u && TQ.highRisk && TQ.highRisk.indexOf(useId) >= 0), sens = !!(u && (u.add || []).indexOf('sens') >= 0);
    return { high: high, sens: sens, any: high || sens };
  }

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
  function pctOf(pts, max) { return max ? Math.floor(100 * pts / max) : null; } // floor: "Score: 75%" is never shown below the 75% cut-off
  function areaWord(pts, max) { return !max ? 'thin' : pts * 100 >= T.STRONG * max ? 'strong' : pts * 100 >= T.GAPS * max ? 'gaps' : 'weak'; }
  var AREA_WORD_MIN = 2; // an area gets a word (Strong / Gaps to close / Weak) only with two or more known answers (council, item 6)

  /* The score and the verdict (rules v2.1).
     Score = points earned / points possible over every question asked (must-haves + tailored). "Doesn't apply" is left out
     altogether. "Don't know yet" counts as 0 points (JUDGEMENT.UNKNOWN_SCORES_ZERO) and is still counted and shown as "to find out".
     No score is shown under "Not enough information yet" (ev.pct is null there; ev.pts and ev.max keep the sum).
     Verdict, in this order:
       noinfo    more than half the questions unknown
       notready  any must-have at No, or the score below 50%
       ready     every must-have Yes, the score 75% or more, and fewer than a quarter of the questions unknown,
                 unless a switch in JUDGEMENT holds the top verdict back (legal items to check; a No carried from step 2)
       almost    everything else (50 to 74%; a must-have not Yes but none at No; 75%+ with a quarter or more unknown; a held top verdict)
     ev.reason: the plain sentence shown under the verdict name ("Because ..."). ev.held: what held the top verdict back, if anything. */
  function evaluate(rec, TQ) {
    var items = questions(rec, TQ), c = { total: 0, known: 0, unknown: 0, na: 0, yes: 0, planned: 0, partly: 0, no: 0 }, pts = 0, max = 0;
    var must = { n: 0, yes: 0, planned: 0, partly: 0, no: 0, unknown: 0 }, area = {}, zero = JUDGEMENT.UNKNOWN_SCORES_ZERO;
    items.forEach(function (it) {
      var g = area[it.a] = area[it.a] || { k: it.a, name: it.a === 'must' ? 'Must-haves' : it.name, n: 0, known: 0, yes: 0, unknown: 0, pts: 0, max: 0 };
      if (it.v === 'na') { c.na++; it.state = 'na'; return; }
      c.total++; g.n++;
      if (it.grp === 'must') must.n++;
      if (!it.v || it.v === 'k') { c.unknown++; g.unknown++; it.state = 'unknown'; if (it.grp === 'must') must.unknown++; if (zero) { max += 2; g.max += 2; } return; }
      c.known++; g.known++; pts += POINTS[it.v]; max += 2; g.pts += POINTS[it.v]; g.max += 2; if (it.v === 'y') g.yes++;
      var w = { y: 'yes', pl: 'planned', p: 'partly', n: 'no' }[it.v]; c[w]++; it.state = w; if (it.grp === 'must') must[w]++;
    });
    must.allYes = must.yes === must.n; must.anyNo = must.no > 0;
    var areas = ['must'].concat(AK).filter(function (k) { return area[k] && area[k].n > 0; }).map(function (k) {
      var g = area[k]; g.word = g.known >= AREA_WORD_MIN ? areaWord(g.pts, g.max) : ''; return g;
    });
    var manyUnknown = c.unknown * 100 > T.UNKNOWN_NOINFO * c.total, fewUnknown = c.unknown * 100 < T.UNKNOWN_READY * c.total;
    var namesOf = function (st) { return items.filter(function (it) { return it.grp === 'must' && (st === 'open' ? it.state !== 'yes' : it.state === st); }).map(function (it) { return it.name; }).join('; '); };
    var missing = n_(must.no, 'must-have is', 'must-haves are') + ' missing: ' + namesOf('no') + '.';
    var lf = legalFlags(TQ, rec.use), carried = verdict(rec.Q).carried, held = [];
    var level, why, reason;
    if (c.total === 0 || manyUnknown) {
      level = 'noinfo'; why = 'more than half the questions are “Don’t know yet” (' + c.unknown + ' of ' + c.total + ')';
      reason = 'Because more than half the questions are still “Don’t know yet” (' + c.unknown + ' of ' + c.total + ').' + (must.anyNo ? ' Already known: ' + missing : '');
    }
    else if (must.anyNo) { level = 'notready'; why = n_(must.no, 'must-have is', 'must-haves are') + ' answered No'; reason = 'Because ' + missing + ' A missing must-have outweighs the score.'; }
    else if (pts * 100 < T.ALMOST * max) {
      level = 'notready'; why = 'the score is below ' + T.ALMOST + '%';
      reason = 'Because fewer than half the points are in place.' + (zero && c.unknown ? ' “Don’t know yet” counts as 0 points.' : '');
    }
    else if (must.allYes && pts * 100 >= T.READY * max && fewUnknown) {
      if (JUDGEMENT.LEGAL_HOLDS_TOP && lf.any) held.push('legal');
      if (JUDGEMENT.CARRIED_NO_HOLDS_TOP && carried.length) held.push('carried');
      if (held.length) {
        level = 'almost'; var parts = [];
        if (held.indexOf('legal') >= 0) parts.push('this use has legal items to check first (the “EU AI Act” part of this result lists them). This tool cannot check them, so it does not give the top verdict for this use.');
        if (held.indexOf('carried') >= 0) parts.push('you answered No in step 2 to ' + carried.map(function (x) { return '“' + QBY[x.id].title + '” (' + x.text.replace(/\.$/, '') + ')'; }).join(' and ') + '. The top verdict is held back until that is settled.');
        reason = 'Because ' + parts.join(' Also because ');
        why = held.map(function (h) { return h === 'legal' ? 'the use has legal items to check first' : 'a No from step 2 is still open'; }).join(', and ') + ' (every must-have is Yes and the score is ' + T.READY + '% or more)';
      } else {
        level = 'ready'; why = 'every must-have is Yes, the score is ' + T.READY + '% or more, and fewer than a quarter of the questions are unknown';
        reason = 'Because every must-have is Yes, the score is ' + T.READY + '% or more, and fewer than a quarter of the questions are “Don’t know yet”.';
      }
    }
    else {
      level = 'almost';
      if (!must.allYes) { why = n_(must.n - must.yes, 'must-have is', 'must-haves are') + ' not Yes yet (none is No)'; reason = 'Because ' + n_(must.n - must.yes, 'must-have is', 'must-haves are') + ' not Yes yet: ' + namesOf('open') + '.'; }
      else if (pts * 100 < T.READY * max) { why = 'the score is between ' + T.ALMOST + '% and ' + (T.READY - 1) + '%'; reason = 'Because the score is between ' + T.ALMOST + '% and ' + (T.READY - 1) + '%. The top verdict needs ' + T.READY + '% or more.'; }
      else { why = 'a quarter or more of the questions are still “Don’t know yet” (' + c.unknown + ' of ' + c.total + ')'; reason = 'Because a quarter or more of the questions are still “Don’t know yet” (' + c.unknown + ' of ' + c.total + ').'; }
    }
    return { items: items, counts: c, pts: pts, max: max, pct: level === 'noinfo' ? null : pctOf(pts, max), must: must, areas: areas, level: level, why: why, reason: reason, held: held,
      legal: lf, carried: carried.map(function (x) { return x.id; }), mustOnly: !useQs(TQ, rec.use).length, cap: !must.allYes };
  }
  function n_(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---------- to-do: one plain task per open item ---------- */
  var RANK = { no: 0, partly: 1, unknown: 2, planned: 3 };
  function task(it) {
    var d = fmtDate(it.by);
    return it.state === 'planned' ? 'Finish: ' + (d ? it.act.replace(/\.$/, '') + ' (' + plannedBy(it) + ').' : it.act)
      : it.state === 'unknown' ? 'Find out: “' + it.q + '”'
      : it.act;
  }
  /* Open items, weakest first: must-haves before tailored questions; within each No, Partly, Don't know yet, Planned; then the order asked. */
  function open(ev) {
    return ev.items.map(function (it, i) { return { it: it, i: i }; }).filter(function (x) { return RANK[x.it.state] != null; })
      .sort(function (x, y) { return (x.it.grp === 'must' ? 0 : 1) - (y.it.grp === 'must' ? 0 : 1) || RANK[x.it.state] - RANK[y.it.state] || x.i - y.i; })
      .map(function (x) { var it = x.it; return { key: it.key, must: it.grp === 'must', who: it.who, name: it.name, state: it.state, text: task(it), q: it.q }; });
  }
  /* "planned by 15 Jan 2027", or "was planned by 1 Jan 2001, overdue" once the date has passed (it.overdue is set by resultModel). */
  function plannedBy(it) { var d = fmtDate(it.by); return !d ? '' : it.overdue ? 'was planned by ' + d + ', overdue' : 'planned by ' + d; }
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
    out.push(evidenceLine(u));
    return out;
  }
  /* Council item 8: no bare ids of the team's research record on a hotel-facing screen (they stay on the Team tab). */
  function evidenceLine(u) {
    var n = u && u.ev ? String(u.ev).split(/[,;]\s*/).filter(Boolean).length : 0;
    return u && u.draft ? 'Evidence: ' + lc(String(u.draftNote).replace(/\s*\(not from the D6 evidence pack\)/, '')) + '; not yet in the team’s research record.'
      : n ? 'Based on ' + n_(n, 'entry', 'entries') + ' in the team’s research record (not yet published).'
      : 'The team’s judgement from the catalogue description; no source entry.';
  }
  /* The smallest and the largest number of tailored questions over all use cases (the cover's "six to nine questions"). */
  function tailRange(TQ) { var n = Object.keys(TQ.uses).map(function (k) { return TQ.uses[k].qs.length; }); return [Math.min.apply(null, n), Math.max.apply(null, n)]; }
  function lc(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }

  /* ---------- return visit: snapshots of the result ---------- */
  /* A snapshot belongs to one use case and one rules version (use: the use id, 'none', or '' in snapshots kept by rules v2,
     which did not record it). Only snapshots of the same use and the same rules are compared line by line. */
  function snapshot(ev, at, use) { return { at: at, level: ev.level, pct: ev.pct, pts: ev.pts, max: ev.max, known: ev.counts.known, total: ev.counts.total, mustYes: ev.must.yes, mustN: ev.must.n, rules: RULES, use: use || '' }; }
  function sameSnap(a, b) { return !!a && !!b && ['level', 'pts', 'max', 'known', 'total', 'mustYes', 'mustN', 'rules', 'use'].every(function (k) { return (a[k] == null ? '' : a[k]) === (b[k] == null ? '' : b[k]); }); }
  var EARLIER_RULES = 'worked out with earlier rules';
  /* The snapshots that belong to the last one's use case: the same use, or a v2 snapshot that carries none. */
  function snapsOf(snaps) {
    var b = snaps && snaps[snaps.length - 1]; if (!b) return [];
    return snaps.filter(function (s) { return (s.use || '') === (b.use || '') || (!s.use && s.rules !== b.rules); });
  }
  /* "Since last time": the last result against the one before it for the same use case and rules. A result kept by earlier
     rules is listed and marked, never compared line by line. null on a first visit. */
  function since(snaps) {
    var mine = snapsOf(snaps); if (mine.length < 2) return null;
    var b = mine[mine.length - 1], before = mine.slice(0, -1), same = before.filter(function (s) { return s.rules === b.rules; }), a = same[same.length - 1];
    var pc = function (s) { return s.pct == null ? 'no score' : s.pct + '%'; };
    var row = function (s) { return fmtDate(s.at) + ': ' + C.LEVELS[s.level].name + ', ' + pc(s) + ', ' + s.mustYes + ' of ' + s.mustN + ' must-haves' + (s.rules !== b.rules ? ' (' + EARLIER_RULES + ')' : ''); };
    var lines = [], head;
    if (a) {
      head = 'Since last time (' + fmtDate(a.at) + ')';
      lines.push('Score: ' + pc(a) + ' → ' + pc(b) + '.');
      lines.push('Must-haves at Yes: ' + a.mustYes + ' → ' + b.mustYes + ' of ' + b.mustN + '.');
      lines.push('Questions you answered: ' + a.known + ' of ' + a.total + ' → ' + b.known + ' of ' + b.total + '.');
      lines.push(a.level === b.level ? 'Verdict unchanged: ' + C.LEVELS[b.level].name + '.' : 'Verdict: ' + C.LEVELS[a.level].name + ' → ' + C.LEVELS[b.level].name + '.');
    } else {
      var o = before[before.length - 1];
      head = 'Your earlier result (' + fmtDate(o.at) + ')';
      lines.push('It was ' + EARLIER_RULES + ' (' + (o.rules || 'not recorded') + '), so it is not compared line by line with today’s.');
      lines.push('Then: ' + C.LEVELS[o.level].name + ', ' + pc(o) + ', ' + o.mustYes + ' of ' + o.mustN + ' must-haves at Yes.');
    }
    return { head: head, lines: lines, compared: !!a, earlier: before.slice().reverse().map(row) };
  }

  /* ---------- how it was worked out ---------- */
  function method(ev) {
    var c = ev.counts, out = [], zero = JUDGEMENT.UNKNOWN_SCORES_ZERO;
    out.push(zero ? 'Points per answer: Yes 2 · Planned, not done yet 1 · Partly 1 · No 0 · Don’t know yet 0. “Doesn’t apply” is left out.'
      : 'Points per answer: Yes 2 · Planned, not done yet 1 · Partly 1 · No 0. “Don’t know yet” and “Doesn’t apply” are left out of the points.');
    out.push('You answered ' + c.known + ' of ' + c.total + ' questions (' + c.unknown + ' “Don’t know yet”' + (c.na ? '; ' + c.na + ' “Doesn’t apply”, not counted' : '') + ').');
    out.push(ev.pct != null ? 'Your points: ' + ev.pts + ' of ' + ev.max + ' possible = ' + ev.pct + '% (rounded down).'
      : 'No score is shown while more than half the questions are “Don’t know yet”' + (ev.max ? ' (your points so far: ' + ev.pts + ' of ' + ev.max + ')' : '') + '.');
    ev.areas.forEach(function (g) { out.push(areaLine(g) + ' (' + g.pts + ' of ' + g.max + ' points; ' + g.known + ' of ' + g.n + ' answered).'); });
    out.push('Cut-offs: “' + C.LEVELS.ready.name + '” needs every must-have at Yes, a score of ' + T.READY + '% or more, and fewer than a quarter of the questions “Don’t know yet”. “' + C.LEVELS.almost.name + '”: ' + T.ALMOST + '% to ' + (T.READY - 1) + '%, or a must-have that is not Yes yet but none at No. “' + C.LEVELS.notready.name + '”: below ' + T.ALMOST + '%, or any must-have at No. “' + C.LEVELS.noinfo.name + '”: more than half the questions “Don’t know yet”.');
    out.push('Areas in words, only where an area has two or more answers: Strong (' + T.STRONG + '% or more of its points), Gaps to close (' + T.GAPS + '% to ' + (T.STRONG - 1) + '%), Weak (below ' + T.GAPS + '%).');
    if (zero) out.push('Team judgement: “Don’t know yet” counts as 0 points, so the score is the share of everything asked that is in place. It is still listed as something to find out.');
    if (JUDGEMENT.LEGAL_HOLDS_TOP) out.push('Team judgement: a use that the AI Register labels high-risk, or that the team’s sheet flags as handling sensitive personal data, does not get the top verdict here, because this tool cannot check its legal items.');
    if (JUDGEMENT.CARRIED_NO_HOLDS_TOP) out.push('Team judgement: a No on questions 2 to 5 of step 2 holds the top verdict back until it is settled.');
    out.push('Your verdict is “' + C.LEVELS[ev.level].name + '”. ' + ev.reason);
    if (ev.mustOnly) out.push(C.MUST_ONLY);
    out.push('The answers are your own and nobody checks them. The cut-offs are the team’s judgement and have not been tested with hotels. Rules ' + RULES + '.');
    return out;
  }
  /* "Data: 0 of 1 in place", with the word only when the area has two or more known answers, and what is still to find out. */
  function areaLine(g) {
    return g.name + ': ' + g.yes + ' of ' + g.n + ' in place' + (g.word ? ' · ' + C.AREA_WORD[g.word] : '') + (g.unknown ? ' · ' + g.unknown + ' to find out' : '');
  }
  function mustLine(ev) {
    var m = ev.must, p = [m.yes + ' of ' + m.n + ' must-haves in place'];
    if (m.planned) p.push(m.planned + ' planned'); if (m.partly) p.push(m.partly + ' partly'); if (m.no) p.push(m.no + ' not in place'); if (m.unknown) p.push(m.unknown + ' to find out');
    return p.join(' · ');
  }
  /* The score is never worded as "% ready" (council, items 1 and 2): "Score: 83%", or no score at all under "Not enough information yet". */
  function scoreHead(ev) { return ev.pct == null ? 'No score yet: you answered ' + ev.counts.known + ' of ' + ev.counts.total + ' questions.' : 'Score: ' + ev.pct + '%'; }
  /* The points and the question counts that stand next to the score, then the caveat. */
  function scoreSub(ev) {
    var c = ev.counts;
    if (ev.pct == null) return C.SCORE_NOTE;
    var base = !JUDGEMENT.UNKNOWN_SCORES_ZERO ? ev.pts + ' of ' + ev.max + ' points on the ' + n_(c.known, 'question', 'questions') + ' you answered' + (c.unknown ? ' (of ' + c.total + ')' : '') + '.'
      : c.unknown ? ev.pts + ' of ' + ev.max + ' points on ' + n_(c.total, 'question', 'questions') + ': ' + c.known + ' answered, ' + c.unknown + ' “Don’t know yet” (0 points each).'
      : ev.pts + ' of ' + ev.max + ' points on the ' + n_(c.known, 'question', 'questions') + ' you answered.';
    return base + ' ' + C.SCORE_NOTE;
  }

  /* ---------- the whole result, in words ----------
     env: { cat (catalogue model), TQ, RC (the readiness check's RCLogic, optional), M (its model), hotel: rec.hotel, today } */
  function resultModel(rec, env) {
    var TQ = env.TQ, cat = env.cat, v = verdict(rec.Q), ev = evaluate(rec, TQ), u = useOf(rec, cat), tu = u && TQ.uses[rec.use], H = rec.hotel || {};
    var today = env.today || localIso();
    ev.items.forEach(function (it) { it.overdue = !!(it.by && realDate(it.by) && it.by < today); }); // a "by when" date that has passed
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
      levelName: C.LEVELS[ev.level].name,
      levelLine: ev.level === 'ready' && ev.mustOnly ? C.READY_NONE : ev.level === 'almost' && ev.held.length ? C.ALMOST_HELD : C.LEVELS[ev.level].line,
      reason: ev.reason, held: ev.held.slice(), law: ev.legal.any ? C.LAW_LINE : '',
      scoreHead: scoreHead(ev), scoreSub: scoreSub(ev), mustLine: mustLine(ev),
      cap: ev.cap ? 'The top verdict needs every must-have at Yes: ' + n_(ev.must.n - ev.must.yes, 'is', 'are') + ' still open.' : '',
      mustOnly: ev.mustOnly ? C.MUST_ONLY : '', draft: tu && tu.draft ? C.DRAFT + '. These questions come from a draft row the team has not reviewed yet.' : '',
      areasHead: C.AREAS_HEAD,
      areas: ev.areas.map(function (g) { return { k: g.k, name: g.name, yes: g.yes, n: g.n, unknown: g.unknown, count: g.yes + ' of ' + g.n, share: g.n ? Math.round(100 * g.yes / g.n) : 0, word: g.word ? C.AREA_WORD[g.word] : '', cls: g.word || 'none', line: areaLine(g) }; }),
      method: method(ev), since: since(rec.snaps) };
    var all = open(ev);
    o.first = all.slice(0, 3).map(function (a) { return { who: C.WHO[a.who], text: a.text, sub: (a.must ? 'Must-have: ' : '') + a.name + ' · your answer: ' + STATE_WORD[a.state] }; });
    o.firstLabel = o.first.length ? firstLabel(o.first.length) : 'Nothing open';
    o.people = byPerson(ev).map(function (p) { return { who: p.who, name: p.name, items: p.items.map(function (a) { return { text: a.text, tag: (a.must ? 'Must-have · ' : '') + a.name + ' · ' + STATE_WORD[a.state], must: a.must, state: a.state }; }) }; });
    o.itemList = ev.items.map(function (it) { return { key: it.key, grp: it.grp, name: it.name, q: it.q, answer: STATE_WORD[it.state] + (it.state === 'planned' && fmtDate(it.by) ? ' (' + plannedBy(it) + ')' : ''), state: it.state }; });
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
    out.push('', m.levelName + ' · ' + m.scoreHead, m.reason, m.scoreSub, m.levelLine, m.mustLine);
    if (m.law) out.push(m.law);
    if (m.cap) out.push(m.cap); if (m.mustOnly) out.push(m.mustOnly); if (m.draft) out.push(m.draft);
    out.push('', 'Is this an AI problem? ' + m.ai.head + (m.ai.second ? ' ' + m.ai.second : ''));
    m.ai.carried.forEach(function (c) { out.push('- ' + c); }); m.ai.find.forEach(function (f) { out.push('- To find out: ' + f); });
    out.push('', 'Where it sits: ' + m.path);
    out.push('', m.areasHead + ':'); m.areas.forEach(function (a) { out.push('- ' + a.line); });
    if (m.first.length) { out.push('', m.firstLabel + ':'); m.first.forEach(function (f, i) { out.push((i + 1) + '. ' + f.who + ': ' + f.text); }); }
    if (m.people.length) { out.push('', 'Action plan by person:'); m.people.forEach(function (p) { out.push(p.name + ':'); p.items.forEach(function (a) { out.push('- ' + a.text + (a.must ? ' (must-have)' : '')); }); }); }
    if (m.vendor.length) { out.push('', 'Questions for the vendor:'); m.vendor.forEach(function (q, i) { out.push((i + 1) + '. ' + q); }); }
    if (m.legal) out.push('', 'EU AI Act (provisional, not legal advice): ' + m.legal.name + (m.legal.applies ? ', ' + m.legal.applies : '') + '. ' + m.legal.why);
    out.push('', 'Student prototype by EHL SBP Group 36 for HFTP, not legal advice. Content as of ' + C.AS_OF + '.');
    return out.join('\n');
  }

  var api = { RULES: RULES, JUDGEMENT: JUDGEMENT, AREA_WORD_MIN: AREA_WORD_MIN, EARLIER_RULES: EARLIER_RULES, legalFlags: legalFlags, evidenceLine: evidenceLine, tailRange: tailRange, areaLine: areaLine, plannedBy: plannedBy, snapsOf: snapsOf,
    T: T, POINTS: POINTS, QIDS: QIDS, MUST_IDS: MUST_IDS, MUST: MUST, QBY: QBY, AK: AK, Q_OK: Q_OK, A_OK: A_OK, STATE_WORD: STATE_WORD,
    verdict: verdict, verdictText: verdictText, realDate: realDate, fmtDate: fmtDate, localIso: localIso, systemsFor: systemsFor,
    useQs: useQs, questions: questions, evaluate: evaluate, open: open, byPerson: byPerson, task: task, firstLabel: firstLabel,
    pathParts: pathParts, useOf: useOf, useLevel: useLevel, noneLine: noneLine, shareLines: shareLines, tailWhy: tailWhy,
    snapshot: snapshot, sameSnap: sameSnap, since: since, method: method, mustLine: mustLine, scoreHead: scoreHead, scoreSub: scoreSub,
    resultModel: resultModel, summaryText: summaryText, personText: personText };
  root.R2Logic = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
