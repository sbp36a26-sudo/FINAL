/* Readiness 2.0: the rules (pure, no DOM). Runs in the page and in the Node tests (tests/logic.test.mjs).
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

  function fmtDate(iso) {
    var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); if (!m) return '';
    return (+m[3]) + ' ' + M[+m[2] - 1] + ' ' + m[1];
  }
  /* One plain task per item, by its answer, in the readiness check's style. */
  function action(id, v, by) {
    var it = ITEM[id]; if (!it) return null;
    var text = v === 'pl' ? 'Finish: ' + (fmtDate(by) ? it.act.replace(/\.$/, '') + ' (planned by ' + fmtDate(by) + ').' : it.act)
      : v === 'k' ? 'Find out: “' + it.check + '”'
      : it.act;
    return { id: id, v: v, name: it.name, step: it.step, text: text, who: it.who };
  }
  function actions(A, By, ids) { return ranked(A, ids).map(function (x) { return action(x.id, x.v, By && By[x.id]); }); }

  var api = { QIDS: QIDS, NEED_IDS: NEED_IDS, FACTOR_IDS: FACTOR_IDS, Q_OK: Q_OK, A_OK: A_OK, ITEM: ITEM, QBY: QBY,
    verdict: verdict, counts: counts, countLine: countLine, ranked: ranked, weakest: weakest, overall: overall, action: action, actions: actions, fmtDate: fmtDate };
  root.R2Logic = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
