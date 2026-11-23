/* AI starting point (formerly "Readiness 2.0"): the rules (pure, no DOM). Runs in the page and in the Node tests (tests/logic.test.mjs).
   Content and orders come from src/content.js (R2Content); the rules are research_notes/AI starting point/research.md,
   part A "Verdict logic" and part D "Summary". No score of any kind (owner's decision). */
(function (root) {
  'use strict';
  var C = root.R2Content;
  var QIDS = ['q1', 'q2', 'q3', 'q4', 'q5'];
  var Q_OK = { y: 1, n: 1, u: 1 };
  var A_OK = { y: 1, pl: 1, p: 1, n: 1, k: 1 };
  var NEED_IDS = C.NEEDS.map(function (x) { return x.id; });
  var FACTOR_IDS = C.FACTORS.map(function (x) { return x.id; });
  var ITEM = {}; C.NEEDS.forEach(function (x) { ITEM[x.id] = Object.assign({ step: 'needs' }, x); }); C.FACTORS.forEach(function (x) { ITEM[x.id] = Object.assign({ step: 'success' }, x); });
  var QBY = {}; C.QUESTIONS.forEach(function (q) { QBY[q.id] = q; });

  /* Step 1a verdict. Q: { q1..q5: 'y' | 'n' | 'u' }. Precedence Q1 > Q2 > Q3 > Q5; Q4 is a modifier; "Not sure" sits below any No.
     Returns { key, head, second, complete, stop, carried: [{id, text, add}], find: [{id, text, who}], q1Unsure }.
     key: 'stop' | 'worth' | 'data' | 'success' | 'find' | 'assist' | 'go' | 'open' (not every question answered yet, no No decides). */
  function verdict(Q) {
    Q = Q || {};
    var a = function (id) { return Q_OK[Q[id]] ? Q[id] : ''; };
    var complete = QIDS.every(function (id) { return !!a(id); });
    if (a('q1') === 'n') return { key: 'stop', head: C.VERDICT.stop, second: '', complete: complete, stop: true, carried: [], find: [], q1Unsure: false };
    /* Conditions carried to the summary, in precedence order: Q2, Q3, Q5, then the Q4 modifier. */
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

  /* Counts in words (research D): in place = Yes; planned = Planned; gaps = Partly, No; to find out = Don't know yet (and blank). */
  function counts(A, ids) {
    var c = { inPlace: 0, planned: 0, gaps: 0, find: 0, total: ids.length };
    ids.forEach(function (id) {
      var v = A && A_OK[A[id]] ? A[id] : 'k';
      if (v === 'y') c.inPlace++; else if (v === 'pl') c.planned++; else if (v === 'p' || v === 'n') c.gaps++; else c.find++;
    });
    return c;
  }
  function countLine(c) { return c.inPlace + ' in place · ' + c.planned + ' planned · ' + c.gaps + (c.gaps === 1 ? ' gap' : ' gaps') + ' · ' + c.find + ' to find out'; }

  /* Items not in place, weakest first: No, then Partly, then Don't know yet, then Planned; ties by TIE_ORDER. Yes is never listed. */
  function ranked(A, ids) {
    ids = ids || C.TIE_ORDER;
    return ids.filter(function (id) { var v = A && A_OK[A[id]] ? A[id] : 'k'; return v !== 'y'; })
      .map(function (id) { var v = A && A_OK[A[id]] ? A[id] : 'k'; return { id: id, v: v, r: C.ANSWER_RANK[v], t: C.TIE_ORDER.indexOf(id) }; })
      .sort(function (x, y) { return x.r - y.r || x.t - y.t; })
      .map(function (x) { return { id: x.id, v: x.v }; });
  }
  function weakest(A, n) { return ranked(A).slice(0, n == null ? 3 : n); }

  /* Overall line (words, softer than the readiness check's verdicts). */
  function overall(A) {
    var v = function (id) { return A && A_OK[A[id]] ? A[id] : 'k'; };
    if (C.KEY_NEEDS.some(function (id) { return v(id) === 'p' || v(id) === 'n'; })) return { key: 'close', text: C.OVERALL.close };
    if (C.TIE_ORDER.some(function (id) { return v(id) === 'k'; })) return { key: 'find', text: C.OVERALL.find };
    return { key: 'good', text: C.OVERALL.good };
  }

  /* v1.2 (clean-up L1): a real calendar day from 2000 to 2100, the same test as R2Flow.validDate; anything else prints as ''. */
  function realDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof iso === 'string' ? iso : ''); if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3], t = new Date(Date.UTC(y, mo - 1, d));
    return y >= 2000 && y <= 2100 && t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d ? { y: y, m: mo, d: d } : null;
  }
  function fmtDate(iso) {
    var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var r = realDate(iso); if (!r) return '';
    return r.d + ' ' + M[r.m - 1] + ' ' + r.y;
  }
  /* v1.2: today as the person's local day (was the UTC day, one day off around midnight in Europe). */
  function localIso(dt) {
    dt = dt || new Date(); var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return dt.getFullYear() + '-' + p(dt.getMonth() + 1) + '-' + p(dt.getDate());
  }
  /* v1.3 (owner): the systems examples for the two systems questions (b1, b2), by the department chosen in step 1b.
     No department, or "None of these fits" → the fallback. Returns { text, line: 'For example: … .', dept, fallback, pms }. */
  function systemsFor(rec) {
    var d = rec && rec.use !== 'none' && typeof rec.dept === 'string' && Object.prototype.hasOwnProperty.call(C.SYSTEMS, rec.dept) ? rec.dept : '';
    var t = d ? C.SYSTEMS[d] : C.SYSTEMS_FALLBACK;
    return { text: t, line: 'For example: ' + t + '.', dept: d, fallback: !d, pms: /\bPMS\b/.test(t) };
  }
  /* An item's words for this record: { plain, good, check, ex ('' or the "For example" line), gloss ('' unless shown), act }.
     Only b1/b2 (ex: true) change with the department; the PMS gloss shows only when "PMS" is among the examples shown. */
  function itemText(id, rec) {
    var it = ITEM[id]; if (!it) return null;
    var sy = systemsFor(rec), gloss = it.gloss || '';
    if (it.ex && /^PMS:/.test(gloss) && !sy.pms) gloss = '';
    return { plain: it.plain || it.def, good: it.good, check: it.check, ex: it.ex ? sy.line : '', gloss: gloss, act: it.act.replace('{ex}', sy.text) };
  }
  /* One plain task per item, by its answer, in the readiness check's style. rec (v1.3, optional): picks the systems examples. */
  function action(id, v, by, rec) {
    var it = ITEM[id]; if (!it) return null;
    var w = itemText(id, rec), act = w.act;
    var text = v === 'pl' ? 'Finish: ' + (fmtDate(by) ? act.replace(/\.$/, '') + ' (planned by ' + fmtDate(by) + ').' : act)
      : v === 'k' ? 'Find out: “' + it.check + '”' + (w.ex ? ' ' + w.ex : '')
      : act;
    return { id: id, v: v, name: it.name, step: it.step, text: text, who: it.who };
  }
  function actions(A, By, ids, rec) { return ranked(A, ids).map(function (x) { return action(x.id, x.v, By && By[x.id], rec); }); }

  /* ---------- shared by the summary screen, Copy summary and the PDF (src/pdf.js), so all three say the same ---------- */
  var ANS_WORD = { y: 'Yes', n: 'No', p: 'Partly', k: 'Don’t know yet', pl: 'Planned' };
  /* The 1a verdict as the summary words it. onSummary: the all-Yes headline drops "Next: find where it sits". */
  function verdictText(v, onSummary) {
    var head = onSummary && v.key === 'go' ? C.VERDICT.goDone : v.head;
    var also = v.carried.filter(function (c, i) { return !(i === 0 && C.VERDICT[{ q2: 'worth', q3: 'data', q5: 'success' }[c.id]] === v.head); });
    return { head: head, second: v.second,
      carriedLabel: v.carried.length ? (also.length < v.carried.length ? 'What this means' : 'Carried to your summary') : '',
      carried: v.carried.map(function (c) { return c.text + (c.add ? ' ' + c.add : ''); }),
      find: v.find.map(function (f) { return f.text + ': ask ' + f.who + '.'; }),
      q1Unsure: v.q1Unsure ? 'If question 1 turns out to be No, this is not suitable for AI: rules or ordinary automation will do it.' : '' };
  }
  /* "Guest-facing › Front Office › <use case>" parts, or "… › None of these fits". cat: the catalogue model. */
  function pathParts(rec, cat) {
    var p = [], d = (cat && cat.depts || []).filter(function (x) { return x.id === rec.dept; })[0], u = d && d.uses.filter(function (x) { return x.id === rec.use; })[0];
    if (rec.cat) p.push(rec.cat);
    if (d) p.push(d.name);
    if (rec.use === 'none') p.push('None of these fits');
    else if (u) p.push(u.n);
    return p;
  }
  function useOf(rec, cat) { var d = (cat && cat.depts || []).filter(function (x) { return x.id === rec.dept; })[0]; return (d && d.uses.filter(function (x) { return x.id === rec.use; })[0]) || null; }
  function useLevel(u) { return u && u.use ? u.use : 'not rated'; }
  function noneLine(nUses) { return 'None of the catalogue’s ' + nUses + ' use cases matches your problem. That is worth telling the project team; steps 2 and 3 still apply.'; }
  /* Why "Check one tool in detail" cannot run for a chosen use case, or '' when it can. */
  function checkWhyNot(rec, u) {
    if (rec.use === 'none') return HANDOVER_NONE;
    if (u && u.notTool) return '“' + u.n + '” is a document, not an AI tool, so the readiness check has no check for it.';
    if (u) return '';
    return 'Choose a use case in step 1 to check one tool in detail.';
  }
  /* v1.2: the hand-over to the readiness check, one answer for the summary screen, Copy summary and the PDF.
     mode 'use'     a use case the readiness check can check: "Check one tool in detail", hub hash 'use=<id>'
          'search'  "None of these fits" (council BUILD NOW 3): "Open the readiness check" on its start screen (tool search), no hash
          'blocked' a use case that is not a tool (lg-4), or nothing chosen: no button, the reason instead */
  var HANDOVER_NONE = 'No use case in the catalogue matches. The readiness check needs a tool: when a vendor offers you one, search for it there.';
  var HANDOVER_NOTE = 'Your answers here are not carried over to the Readiness check yet.';
  function handover(rec, u) {
    if (rec.use === 'none') return { mode: 'search', label: 'Open the readiness check', hash: '', text: HANDOVER_NONE };
    var why = checkWhyNot(rec, u);
    if (why) return { mode: 'blocked', label: 'Check one tool in detail', hash: '', text: why };
    return { mode: 'use', label: 'Check one tool in detail', hash: 'use=' + rec.use, text: 'The readiness check asks the detailed questions for “' + u.n + '” and gives a verdict and a to-do list by person.' };
  }
  function firstLabel(n) { return n === 1 ? 'Start with this one' : 'Start with these ' + (n === 3 ? 'three' : 'two'); } // v1.1: was "these one"

  var api = { systemsFor: systemsFor, itemText: itemText, handover: handover, HANDOVER_NOTE: HANDOVER_NOTE, realDate: realDate, localIso: localIso, ANS_WORD: ANS_WORD, verdictText: verdictText, pathParts: pathParts, useOf: useOf, useLevel: useLevel, noneLine: noneLine, checkWhyNot: checkWhyNot, firstLabel: firstLabel,
    QIDS: QIDS, NEED_IDS: NEED_IDS, FACTOR_IDS: FACTOR_IDS, Q_OK: Q_OK, A_OK: A_OK, ITEM: ITEM, QBY: QBY,
    verdict: verdict, counts: counts, countLine: countLine, ranked: ranked, weakest: weakest, overall: overall, action: action, actions: actions, fmtDate: fmtDate };
  root.R2Logic = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
