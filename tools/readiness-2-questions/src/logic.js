/* Do you need AI? v2: the rules (pure, no DOM). Runs in the page and in the Node tests (tests/logic.test.mjs).
   Words come from src/content.js (R2Content); the tailored questions from data/usecase-questions.json (TQ below).
   1. verdict(Q): the five questions (unchanged from v1; research_notes/AI starting point/research.md, part A).
   2. evaluate(rec, TQ): the score in % and the verdict (owner, 24 Nov 2026: "percentage plus verdict").
      Every cut-off sits in T, one block, and is the team's judgement, not tested with hotels.
      Rules v2.1 (24 Nov 2026, after the clean-up audit and the council on v2.0): the three switches in JUDGEMENT.
      Rules v2.3 (24 Nov 2026, owner): three answers on steps 3 and 5 (Yes, Planned, No; v2.7.1 removed the fourth: a blank is not answered yet). "Partly" (p) and
      "Doesn't apply" (na) are gone; a saved one counts as not answered and is carried as it.old so the page can say so.
      Rules v2.5 (24 Nov 2026, owner decisions O1 to O4 of reports/Council - Do you need AI v2.4.md): two caps on "Planned" and three
      holds, each a named constant in JUDGEMENT; points unchanged.
      Rules v2.6 (24 Nov 2026, owner): question 1 is asked the other way round (Yes = fixed rules can do it = stop); questions 3
      and 4 are new, and a No on either holds the top verdict like a No on 2 or 5 (the "assistant only" condition is gone).
   3. resultModel(rec, env): every word of the result page. The screen and the PDF read it, so they agree. The Team tab reads
      evaluate(), method(), open() and answerWord(). */
(function (root) {
  'use strict';
  var C = root.R2Content;
  var RULES = 'v2.6 (24 Nov 2026)';
  var QIDS = ['q1', 'q2', 'q3', 'q4', 'q5'];
  var Q_OK = { y: 1, n: 1, u: 1 };
  var Q1_UNSURE = 'If question 1 turns out to be Yes, this is not suitable for AI: rules or ordinary automation will do it.';
  /* v2.6: the answer to a step 2 question that holds (stopOn for question 1: 'y'; 'n' for the others). */
  function badAns(id) { return (QBY[id] && QBY[id].stopOn) || 'n'; }
  /* ---------- v2.6: the step 2 question set (QV) and records saved before it ----------
     QV 2: since v2.6 (question 1 turned round, questions 3 and 4 new). A record, a file's check or a team copy without qv === QV
     holds its step 2 answers in the old meaning. legacyQ(Q) turns question 1 round (Yes ↔ No; Not sure stays) and drops the old
     questions 3 and 4 (they asked something else; their answers are not carried over). dropped: the ids that had an answer.
     Used once per record: R2Flow.cleanRec sets qv, the Team tab reads qv on each copy. */
  var QV = 2;
  function legacyQ(Q) {
    Q = Q && typeof Q === 'object' ? Q : {}; var out = {}, dropped = [];
    QIDS.forEach(function (id) {
      var a = Q[id]; if (!Q_OK[a]) return;
      if (id === 'q3' || id === 'q4') { dropped.push(id); return; }
      out[id] = id === 'q1' ? ({ y: 'n', n: 'y', u: 'u' })[a] : a;
    });
    return { Q: out, dropped: dropped };
  }
  var A_OK = { y: 1, pl: 1, n: 1 }; // v2.7.1: a blank is not answered yet; a stored 'k' is read as blank
  var OLD = C.OLD_ANSWER; // answers saved before v2.3 ({ p: 'Partly', na: 'Doesn’t apply' }): kept in the record, never scored
  var MUST_IDS = C.MUSTS.map(function (x) { return x.id; });
  var MUST = {}; C.MUSTS.forEach(function (x) { MUST[x.id] = x; });
  var QBY = {}; C.QUESTIONS.forEach(function (q) { QBY[q.id] = q; });
  var AK = ['pe', 'sk', 'fi', 'te', 'da', 'or'];

  /* ---------- THE CUT-OFFS (one block; team judgement, not tested with hotels) ---------- */
  var T = {
    READY: 75,          // "Ready to start a pilot": score of 75% or more ...
    ALMOST: 50,         // "Almost ready": 50% to 74%; below 50%: "Not ready yet"
    UNKNOWN_READY: 25,  // ... and fewer than 25% of the questions not answered yet
    UNKNOWN_NOINFO: 50, // "Not enough information yet": more than 50% of the questions not answered yet
    STRONG: 75, GAPS: 50 // an area in words: Strong (75% or more), Gaps to close (50 to 74%), Weak (below 50%)
  };
  var POINTS = { y: 2, pl: 1, n: 0 }; // not answered yet: see JUDGEMENT.UNKNOWN_SCORES_ZERO (v2.3: no Partly, no "Doesn't apply")

  /* ---------- TEAM JUDGEMENT (rules v2.1): three switches the owner can flip. Each is named in "How this was worked out". ----------
     UNKNOWN_SCORES_ZERO   (council B2) true: a question not answered yet counts as 0 points, so the score is the share of everything asked
                           that is in place. false: it is left out of the points (rules v2). Either way it is listed as "not answered yet".
     SENSITIVE_HOLDS_TOP   (council B5; v2.7.0, owner) true: no "Ready to start a pilot" for a use case the data file marks
                           sensitive (people's personal data or jobs: 12 use cases). The best verdict is "Almost ready" and the
                           result says why (the data file's sensitive_hold_reason). false: the flag line only.
     CARRIED_NO_HOLDS_TOP  (council B6) true: a No on questions 2 to 5 of step 2 (C-R-I-S-P) holds back the top verdict, with
                           the reason shown. false: it is carried as a condition only (rules v2). (v2.5 left question 4 out
                           with its own switch, Q4_NO_HOLDS_TOP; v2.6, owner: the new question 4 holds like the others and the
                           switch is gone.)
     Rules v2.5 (24 Nov 2026), owner decisions on the council of v2.4 (team judgement, not tested with hotels):
     ALMOST_MIN_MUST_YES   (O1 c) "Almost ready" needs at least this share (%) of the must-haves at Yes; below it the verdict is
                           "Not ready yet", because "Planned" is not done yet. 0 switches the cap off.
     READY_MIN_TAIL_YES    (O1 c) "Ready to start a pilot" needs at least this share (%) of the tailored questions that were
                           answered (Yes, Planned or No) at Yes; otherwise the top verdict is held back. 0 switches it off.
     NOT_SURE_HOLDS_TOP    (O2 b) true: any "Not sure" in step 2 holds the top verdict back, with the reason shown.
     NONE_BEST_ALMOST      (O4 b) true: with "None of these fits" the best verdict is "Almost ready" (nothing to pilot). */
  var JUDGEMENT = { UNKNOWN_SCORES_ZERO: true, SENSITIVE_HOLDS_TOP: true, CARRIED_NO_HOLDS_TOP: true,
    ALMOST_MIN_MUST_YES: 50, READY_MIN_TAIL_YES: 50, NOT_SURE_HOLDS_TOP: true, NONE_BEST_ALMOST: true };
  /* v2.7.0: is the chosen use case sensitive (the data file's flag: people's personal data or jobs)? */
  function sensitiveOf(TQ, useId) { var u = TQ && TQ.uses && useId ? TQ.uses[useId] : null; return !!(u && u.sensitive); }

  /* ---------- the five questions ----------
     v2.6: Precedence Q1 > Q2 > Q3 > Q4 > Q5; "Not sure" sits below any No. Only Q1 Yes stops (fixed rules can do it).
     (Before v2.6 Q1 No stopped and Q4 No was a modifier, "assistant only".) */
  function verdict(Q) {
    Q = Q || {};
    var a = function (id) { return Q_OK[Q[id]] ? Q[id] : ''; };
    var complete = QIDS.every(function (id) { return !!a(id); });
    if (a('q1') === badAns('q1')) return { key: 'stop', head: C.VERDICT.stop, second: '', complete: complete, stop: true, carried: [], find: [], q1Unsure: false };
    var carried = ['q2', 'q3', 'q4', 'q5'].filter(function (id) { return a(id) === 'n'; }).map(function (id) { return { id: id, text: QBY[id].outcome, add: QBY[id].add || '' }; });
    var find = QIDS.filter(function (id) { return a(id) === 'u'; }).map(function (id) { return { id: id, text: QBY[id].short, who: QBY[id].who }; });
    var key, second = '';
    if (a('q2') === 'n') key = 'worth';
    else if (a('q3') === 'n') { key = 'data'; if (a('q5') === 'n') second = 'Then define success.'; }
    else if (a('q4') === 'n') key = 'exact';
    else if (a('q5') === 'n') key = 'success';
    else if (find.length) key = 'find';
    else if (!complete) key = 'open';
    else key = 'go';
    return { key: key, head: key === 'open' ? 'Answer all five questions to see the verdict.' : C.VERDICT[key], second: second, complete: complete, stop: false,
      carried: carried, find: find, q1Unsure: a('q1') === 'u' };
  }
  /* The verdict as the result words it. onResult: the all-Yes headline drops its "Next: ...". */
  function verdictText(v, onResult) {
    var head = onResult && v.key === 'go' ? C.VERDICT.goDone : v.head;
    var also = v.carried.filter(function (c, i) { return !(i === 0 && C.VERDICT[{ q2: 'worth', q3: 'data', q4: 'exact', q5: 'success' }[c.id]] === v.head); });
    return { head: head, second: v.second,
      carriedLabel: v.carried.length ? (also.length < v.carried.length ? 'What this means' : 'Conditions carried forward') : '',
      carried: v.carried.map(function (c) { return c.text + (c.add ? ' ' + c.add : ''); }),
      find: v.find.map(function (f) { return f.text + ': ask ' + f.who + '.'; }),
      q1Unsure: v.q1Unsure ? Q1_UNSURE : '' };
  }

  /* v2.5.1 (owner, 24 Nov 2026): what each of the five answers means for this decision, for the result's "Is this an AI problem?"
     card and the PDF. Only the questions' own words (yesIf, noIf, outcome, add, who; Q1 Not sure: the existing q1Unsure sentence).
     Returns { state: 'y' | 'n' | 'u' | '', answer, line, ask, ifNo, good: true | false | null }:
       the good answer (No for question 1 since v2.6, Yes for the others)  line = "Met: <its test>", good true
       the other answer   line = the consequence already defined (outcome + add), good false
       Not sure  line = "To find out: yes if ...; no if ...", ask = "Ask <who>.", ifNo = what the holding answer would mean, good null */
  function lcFirst(t) { t = String(t || ''); return /^[A-Z](?:[a-z]|\s)/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t; }
  function noStop(t) { return String(t || '').replace(/[.\s]+$/, ''); }
  function aiMeaning(id, ans) {
    var q = QBY[id], a = Q_OK[ans] ? ans : '';
    var o = { state: a, answer: ({ y: 'Yes', n: 'No', u: 'Not sure' })[a] || 'Not answered', line: '', ask: '', ifNo: '', good: null };
    if (!q) return o;
    var bad = badAns(id);
    if (a === 'y' || a === 'n') {
      o.good = a !== bad;
      o.line = o.good ? 'Met: ' + lcFirst(a === 'y' ? q.yesIf : q.noIf) : q.outcome + (q.add ? ' ' + q.add : '');
    }
    else if (a === 'u') {
      o.line = 'To find out: yes if ' + lcFirst(noStop(q.yesIf)) + '; no if ' + lcFirst(noStop(q.noIf)) + '.';
      o.ask = 'Ask ' + q.who + '.';
      o.ifNo = id === 'q1' ? Q1_UNSURE : 'If it turns out to be No, then ' + lcFirst(q.outcome);
    } else o.line = 'Not answered yet.';
    return o;
  }
  /* One line of plain text per question (PDF sub-line, copy texts). */
  function aiMeaningText(x) { return [x.line, x.ask, x.ifNo].filter(Boolean).join(' '); }

  /* ---------- v2.5.1: one source of the detail layer ----------
     build.mjs bundles the catalogue's sources as [type, name, note, url] ('r' resolved through the catalogue's source list, 'l' moved
     to that shape). sourceItem also reads the catalogue's raw shapes, so a raw entry can never print a URL as text or a bare key:
       'c' / 'h' [type, name, note, url] · 'l' [type, text, url] · 'r' [type, refKey, note] with refs[refKey] = [citation, url, ...]
     Returns { type, name, note, url } with url '' unless it is http(s). */
  var HTTP = /^https?:\/\/[^\s"<>]+$/i;
  function sourceItem(s, refs) {
    s = Array.isArray(s) ? s : []; var t = s[0], o;
    if (t === 'l' && s.length < 4) o = { name: s[1], note: '', url: s[2] };
    else if (t === 'r' && s.length < 4) { var r = (refs || {})[s[1]] || []; o = { name: r[0] || s[1], note: s[2], url: r[1] }; }
    else o = { name: s[1], note: s[2], url: s[3] };
    o.type = t; o.name = String(o.name || ''); o.note = String(o.note || ''); o.url = HTTP.test(String(o.url || '').trim()) ? String(o.url).trim() : '';
    if (!o.url && HTTP.test(o.name.trim())) { o.url = o.name.trim(); o.name = 'Source'; } // a bare link: the link, never the URL as text
    return o;
  }
  /* v2.6: the detail layer's content as plain JSON (title, kicker, catName, draft, draftText, does, how, level, srcs, foot),
     one source for the page's own dialog and the hub's layer on the main page ({ hub: 'detail' }, tools/hub/CONTRACTS.md).
     D: the page's data block (ex, detail); u: the catalogue use; d: its department. Strings only, except srcs. */
  function detailData(D, u, d, TQ) {
    var id = u.id, dt = (D.detail || {})[id] || { srcs: [] }, tu = TQ.uses[id], x = explain(D.ex, id); d = d || {};
    return { title: useLabel(TQ, u), kicker: [d.name, d.cat].filter(Boolean).join(' · '), catName: catalogueName(TQ, u), draft: '', draftText: '',
      does: x ? D.ex[id].does : '', how: x ? D.ex[id].how : '', level: useLevelLine(u),
      srcs: dt.srcs.map(function (s) { var o = sourceItem(s); return { type: o.type, name: o.name, note: o.note, url: o.url }; }),
      foot: 'From the project team’s Use-Case Catalogue, as of ' + C.AS_OF + '. A source link opens in a new browser tab.' };
  }
  function escH(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* The list item the detail layer shows (v2.6, owner: plain hyperlinks): the source's name is itself the link, opened by the browser
     (no frame interception); a "Hotel" tag for 'h'; the note; then the address, selectable, with "Copy address". */
  function sourceRow(s, refs) { return sourceRowItem(sourceItem(s, refs)); }
  /* x: { type, name, note, url } (sourceItem, or the layer's plain JSON). */
  function sourceRowItem(x) {
    x = x || {}; x = { type: x.type, name: String(x.name || ''), note: String(x.note || ''), url: HTTP.test(String(x.url || '').trim()) ? String(x.url).trim() : '' };
    var nm = x.url ? '<a href="' + escH(x.url) + '" target="_blank" rel="noopener">' + escH(x.name) + '</a>' : escH(x.name);
    /* a plain link ('l') is a sentence, not a name: not set in bold */
    return '<li data-src="' + escH(x.type) + '">' + (x.type === 'h' ? '<span class="tag">Hotel</span> ' : '') + (x.type === 'l' ? nm : '<b>' + nm + '</b>') + (x.note ? ': ' + escH(x.note) : '') +
      (x.url ? '<span class="srcaddr"><span class="srcurl">' + escH(x.url) + '</span> <button type="button" class="linkbtn copysrc" data-act="copy-src" data-url="' + escH(x.url) + '">Copy address</button></span>' : '') + '</li>';
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
     { key, grp: 'must' | 'tail', a: 'must' | area key, name, q, who, act, v: answer or '', by, old: 'p' | 'na' | '' }
     old: an answer saved before v2.3 that is no longer offered; v is then '' (not answered). */
  function oldOf(raw) { return typeof raw === 'string' && Object.prototype.hasOwnProperty.call(OLD, raw) ? raw : ''; }
  /* The line under a question whose saved answer is no longer offered ('' otherwise). */
  function oldLine(raw) { var o = oldOf(raw); return o ? C.OLD_LINE.replace('{a}', OLD[o]) : ''; }
  function questions(rec, TQ) {
    var sy = systemsFor(rec), out = [];
    C.MUSTS.forEach(function (m) {
      var v = rec.A && A_OK[rec.A[m.id]] ? rec.A[m.id] : '';
      out.push({ key: m.id, grp: 'must', a: 'must', name: m.name, q: m.q, who: m.who, act: m.act.replace('{ex}', sy.text), v: v, by: v === 'pl' ? (rec.By || {})[m.id] || '' : '', old: v ? '' : oldOf((rec.A || {})[m.id]) });
    });
    useQs(TQ, rec.use).forEach(function (t) {
      var raw = (rec.T || {})[t.id], v = A_OK[raw] ? raw : '';
      out.push({ key: t.id, grp: 'tail', a: t.a, name: TQ.areas[t.a], q: t.q, why: t.why, who: t.who, whoLabel: t.whoLabel, act: actText(t.act), v: v, by: v === 'pl' ? (rec.TBy || {})[t.id] || '' : '', old: v ? '' : oldOf(raw) });
    });
    return out;
  }
  function pctOf(pts, max) { return max ? Math.floor(100 * pts / max) : null; } // floor: "Score: 75%" is never shown below the 75% cut-off
  function areaWord(pts, max) { return !max ? 'thin' : pts * 100 >= T.STRONG * max ? 'strong' : pts * 100 >= T.GAPS * max ? 'gaps' : 'weak'; }
  var AREA_WORD_MIN = 2; // an area gets a word (Strong / Gaps to close / Weak) only with two or more known answers (council, item 6)

  /* The score and the verdict (rules v2.5).
     Score = points earned / points possible over every question asked (must-haves + tailored). An answer that is no longer
     offered (it.old) counts as not answered, like a blank. A question not answered yet counts as 0 points (JUDGEMENT.UNKNOWN_SCORES_ZERO) and is still counted and shown as "not answered yet".
     No score is shown under "Not enough information yet" (ev.pct is null there; ev.pts and ev.max keep the sum).
     Verdict, in this order:
       noinfo    more than half the questions unknown
       notready  any must-have at No, the score below 50%, or (v2.5, O1) fewer than half the must-haves at Yes
       ready     every must-have Yes, the score 75% or more, and fewer than a quarter of the questions unknown,
                 unless a switch in JUDGEMENT holds the top verdict back: a sensitive use case (v2.7.0); a No carried from step 2
                 (questions 2 to 5, v2.6); a Not sure in step 2 (v2.5, O2); fewer than half the answered tailored questions at Yes
                 (v2.5, O1); "None of these fits" (v2.5, O4)
       almost    everything else (50 to 74%; a must-have not Yes but none at No; 75%+ with a quarter or more unknown; a held top verdict)
     ev.reason: the plain sentence that heads "Start with" ("Because ..."). ev.held: what held the top verdict back, in this order:
     'sensitive', 'carried', 'notsure', 'tail', 'none'. ev.box: the one short line in the verdict box (O5), '' unless the verdict is
     "Not ready yet" or held. ev.kind: why the verdict is what it is (for the line under it). */
  function evaluate(rec, TQ) {
    var items = questions(rec, TQ), c = { total: 0, known: 0, unknown: 0, yes: 0, planned: 0, no: 0 }, pts = 0, max = 0;
    var must = { n: 0, yes: 0, planned: 0, no: 0, unknown: 0 }, tail = { n: 0, known: 0, yes: 0, planned: 0, no: 0 }, area = {}, zero = JUDGEMENT.UNKNOWN_SCORES_ZERO;
    items.forEach(function (it) {
      var g = area[it.a] = area[it.a] || { k: it.a, name: it.a === 'must' ? 'Must-haves' : it.name, n: 0, known: 0, yes: 0, unknown: 0, pts: 0, max: 0 };
      c.total++; g.n++;
      if (it.grp === 'must') must.n++; else tail.n++;
      if (!it.v) { c.unknown++; g.unknown++; it.state = 'unknown'; if (it.grp === 'must') must.unknown++; if (zero) { max += 2; g.max += 2; } return; }
      c.known++; g.known++; pts += POINTS[it.v]; max += 2; g.pts += POINTS[it.v]; g.max += 2; if (it.v === 'y') g.yes++;
      var w = { y: 'yes', pl: 'planned', n: 'no' }[it.v]; c[w]++; it.state = w;
      if (it.grp === 'must') must[w]++; else { tail.known++; tail[w]++; }
    });
    must.allYes = must.yes === must.n; must.anyNo = must.no > 0;
    var areas = ['must'].concat(AK).filter(function (k) { return area[k] && area[k].n > 0; }).map(function (k) {
      var g = area[k]; g.word = g.known >= AREA_WORD_MIN ? areaWord(g.pts, g.max) : ''; return g;
    });
    var manyUnknown = c.unknown * 100 > T.UNKNOWN_NOINFO * c.total, fewUnknown = c.unknown * 100 < T.UNKNOWN_READY * c.total;
    var namesOf = function (st) { return items.filter(function (it) { return it.grp === 'must' && (st === 'open' ? it.state !== 'yes' : it.state === st); }).map(function (it) { return it.name; }).join('; '); };
    var missing = n_(must.no, 'must-have is', 'must-haves are') + ' missing: ' + namesOf('no') + '.';
    var v = verdict(rec.Q), sens = sensitiveOf(TQ, rec.use), none = rec.use === 'none', held = [];
    var carried = v.carried; // v2.6: every No on questions 2 to 5
    var level, why, reason, kind, box = '';
    var fewMust = must.yes * 100 < JUDGEMENT.ALMOST_MIN_MUST_YES * must.n;
    if (c.total === 0 || manyUnknown) {
      level = 'noinfo'; kind = 'noinfo'; why = 'more than half the questions are not answered yet (' + c.unknown + ' of ' + c.total + ')';
      reason = 'Because more than half the questions are still not answered yet (' + c.unknown + ' of ' + c.total + ').' + (must.anyNo ? ' Already known: ' + missing : '');
    }
    else if (must.anyNo) { level = 'notready'; kind = 'mustNo'; why = n_(must.no, 'must-have is', 'must-haves are') + ' answered No'; reason = 'Because ' + missing + ' A missing must-have outweighs the score.'; box = 'Because ' + n_(must.no, 'must-have is', 'must-haves are') + ' No.'; }
    else if (pts * 100 < T.ALMOST * max) {
      level = 'notready'; kind = 'score'; why = 'the score is below ' + T.ALMOST + '%'; box = 'Because the score is below ' + T.ALMOST + '%.';
      reason = 'Because fewer than half the points are in place.' + (zero && c.unknown ? ' A question not answered yet counts as 0 points.' : '');
    }
    else if (fewMust) {
      level = 'notready'; kind = 'fewMust'; why = 'only ' + must.yes + ' of ' + must.n + ' must-haves are Yes (“' + C.LEVELS.almost.name + '” needs at least half)';
      var mYes = must.yes === 0 ? 'none of the ' + must.n + ' must-haves is' : 'only ' + must.yes + ' of ' + must.n + ' must-haves ' + (must.yes === 1 ? 'is' : 'are');
      reason = 'Because ' + mYes + ' Yes, and “' + C.LEVELS.almost.name + '” needs at least half of them at Yes.';
      box = 'Because ' + mYes + ' Yes.';
    }
    else if (must.allYes && pts * 100 >= T.READY * max && fewUnknown) {
      if (JUDGEMENT.SENSITIVE_HOLDS_TOP && sens) held.push('sensitive');
      if (JUDGEMENT.CARRIED_NO_HOLDS_TOP && carried.length) held.push('carried');
      if (JUDGEMENT.NOT_SURE_HOLDS_TOP && v.find.length) held.push('notsure');
      if (JUDGEMENT.READY_MIN_TAIL_YES && tail.n && tail.yes * 100 < JUDGEMENT.READY_MIN_TAIL_YES * tail.known) held.push('tail');
      if (JUDGEMENT.NONE_BEST_ALMOST && none) held.push('none');
      if (held.length) {
        level = 'almost'; kind = 'held'; var parts = [];
        if (held.indexOf('carried') >= 0) parts.push('you answered No in step 2 to ' + carried.map(function (x) { return '“' + QBY[x.id].title + '” (' + x.text.replace(/\.$/, '') + ')'; }).join(' and ') + '. The top verdict is held back until that is settled.');
        if (held.indexOf('notsure') >= 0) parts.push('you answered Not sure to ' + notSureTitles(v) + ' in step 2. The top verdict is held back until that is found out.');
        if (held.indexOf('tail') >= 0) parts.push('only ' + tail.yes + ' of the ' + n_(tail.known, 'question', 'questions') + ' you answered for this use case ' + (tail.yes === 1 ? 'is' : 'are') + ' Yes. The top verdict needs at least half of them at Yes.');
        if (held.indexOf('none') >= 0) parts.push('no use case was chosen: the must-haves are in place, but nothing was checked for a particular tool.');
        /* v2.7.0: the sensitive hold reads as the data file's sensitive_hold_reason, verbatim; any other hold follows it */
        reason = held.indexOf('sensitive') >= 0 ? C.SENSITIVE_HOLD + (parts.length ? ' Also because ' + parts.join(' Also because ') : '') : 'Because ' + parts.join(' Also because ');
        why = held.map(function (h) { return { sensitive: 'the use case involves people’s personal data or jobs', carried: 'a No from step 2 is still open', notsure: 'a Not sure from step 2 is still open', tail: 'fewer than half the questions for this use case are Yes', none: 'no use case was chosen' }[h]; }).join(', and ') + ' (every must-have is Yes and the score is ' + T.READY + '% or more)';
        box = C.BOX.held.replace('{why}', held.map(function (h) { return C.BOX[h]; }).join('; '));
      } else {
        level = 'ready'; kind = 'ready'; why = 'every must-have is Yes, the score is ' + T.READY + '% or more, and fewer than a quarter of the questions are unknown';
        reason = 'Because every must-have is Yes, the score is ' + T.READY + '% or more, and fewer than a quarter of the questions are not answered yet.';
      }
    }
    else {
      level = 'almost'; kind = 'almost';
      if (!must.allYes) { why = n_(must.n - must.yes, 'must-have is', 'must-haves are') + ' not Yes yet (none is No)'; reason = 'Because ' + n_(must.n - must.yes, 'must-have is', 'must-haves are') + ' not Yes yet: ' + namesOf('open') + '.'; }
      else if (pts * 100 < T.READY * max) { why = 'the score is between ' + T.ALMOST + '% and ' + (T.READY - 1) + '%'; reason = 'Because the score is between ' + T.ALMOST + '% and ' + (T.READY - 1) + '%. The top verdict needs ' + T.READY + '% or more.'; }
      else { why = 'a quarter or more of the questions are still not answered yet (' + c.unknown + ' of ' + c.total + ')'; reason = 'Because a quarter or more of the questions are still not answered yet (' + c.unknown + ' of ' + c.total + ').'; }
    }
    return { items: items, counts: c, pts: pts, max: max, pct: level === 'noinfo' ? null : pctOf(pts, max), must: must, tail: tail, areas: areas, level: level, kind: kind, why: why, reason: reason, held: held, box: box,
      sensitive: sens, carried: carried.map(function (x) { return x.id; }), notSure: v.find.map(function (x) { return x.id; }),
      mustOnly: !useQs(TQ, rec.use).length, cap: !must.allYes };
  }
  /* “Complex judgement” and “Proof”: the titles of the questions answered Not sure in step 2. */
  function notSureTitles(v) { return v.find.map(function (x) { return '“' + QBY[x.id].title + '”'; }).join(' and '); }
  function n_(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---------- to-do: one plain task per open item ---------- */
  var RANK = { no: 0, unknown: 2, planned: 3 };
  /* v2.8.0 (B11, live review 25 Nov 2026): a step-5 question's task is its own action text (data/actions_questions_only.json: imperative,
     at most 15 words, naming who does it), not the question with a prefix. The data names the person first ("Finance: get ..."); the
     plan already shows that person, so the prefix is left out on screen and in the PDF. Must-haves keep their hand-written actions.
       No                → the action
       Planned           → "Finish by <date>: <action>" ("Finish: <action>" without a date; an overdue date says so)
       not answered yet  → "Answer this: “<question>”"
       an answer that is no longer offered → "Answer again: …" (audit v3 L1) */
  var WHO_PREFIX = /^(GM|Department head|Finance|IT|Owner): /;
  function actText(a) { a = String(a || ''); var m = WHO_PREFIX.exec(a); if (m) a = a.slice(m[0].length); return a.charAt(0).toUpperCase() + a.slice(1); }
  function task(it) {
    var d = fmtDate(it.by);
    if (it.old) return 'Answer again: “' + it.q + '” (the earlier answer “' + OLD[it.old] + '” is no longer offered)';
    if (it.state === 'unknown') return 'Answer this: “' + it.q + '”';
    if (it.state === 'planned') return (d ? 'Finish by ' + d + (it.overdue ? ' (overdue)' : '') : 'Finish') + ': ' + it.act;
    return it.act;
  }
  /* Open items, weakest first: must-haves before tailored questions; within each No, not answered yet, Planned; then the order asked. */
  function open(ev) {
    return ev.items.map(function (it, i) { return { it: it, i: i }; }).filter(function (x) { return RANK[x.it.state] != null; })
      .sort(function (x, y) { return (x.it.grp === 'must' ? 0 : 1) - (y.it.grp === 'must' ? 0 : 1) || RANK[x.it.state] - RANK[y.it.state] || x.i - y.i; })
      .map(function (x) { var it = x.it; return { key: it.key, must: it.grp === 'must', who: it.who, name: it.name, state: it.state, old: it.old, word: answerWord(it), text: task(it), q: it.q }; });
  }
  /* "planned by 15 Jan 2027", or "was planned by 1 Jan 2001, overdue" once the date has passed (it.overdue is set by resultModel). */
  function plannedBy(it) { var d = fmtDate(it.by); return !d ? '' : it.overdue ? 'was planned by ' + d + ', overdue' : 'planned by ' + d; }
  function firstLabel(n) { return n === 1 ? 'Start with this one' : 'Start with these ' + (n === 3 ? 'three' : 'two'); }
  /* The action plan by person, in the readiness check's order of roles. */
  function byPerson(ev) {
    var by = {}; open(ev).forEach(function (a) { (by[a.who] = by[a.who] || []).push(a); });
    return C.WHO_ORDER.filter(function (w) { return by[w]; }).map(function (w) { return { who: w, name: C.WHO[w], items: by[w] }; });
  }
  var STATE_WORD = { yes: 'Yes', planned: 'Planned', no: 'No', unknown: 'Not answered yet' };
  /* An item's answer in words; an answer saved before v2.3 that is no longer offered is named as such (Team tab). */
  function answerWord(it) { return it.old ? 'Not answered (earlier answer: ' + OLD[it.old] + ', no longer offered)' : STATE_WORD[it.state]; }
  /* Audit v3 L1: one name for every saved answer of steps 3 and 5, used by the page and the Team tab.
     'yes' | 'planned' | 'no' | 'old' (Partly or Doesn't apply, no longer offered) | 'blank' (not answered yet; a stored 'k' too). */
  function answerState(raw) { return oldOf(raw) ? 'old' : { y: 'yes', pl: 'planned', n: 'no' }[raw] || 'blank'; }
  /* v2.5 (council BUILD NOW 7): step 3 lines where an answer there and one in step 2 disagree. No blocking. { m3? } (v2.6: the must-have 7 line is gone) */
  function consistLines(rec) {
    var Q = (rec && rec.Q) || {}, A = (rec && rec.A) || {}, o = {};
    if ((Q.q5 === 'n' || Q.q5 === 'u') && A.m3 === 'y') o.m3 = C.CONSIST.m3;
    return o;
  }

  /* ---------- where it sits ---------- */
  /* v2.2: the name this tool shows for a use case: the team's plain name (TQ.uses[id].plain, data/wording.json) or the catalogue's.
     Records, links and the hub keep the id and the catalogue name (u.n); only what a person reads changes. */
  /* v2.8.0 (B12): a long name with a colon ("Restaurant table bookings: AI that answers calls ...") is shown as a short name with
     the rest as a subtitle; the full name stays in the data and in the record. */
  function nameParts(name) { name = String(name || ''); var i = name.indexOf(': '); return i > 0 ? { main: name.slice(0, i), sub: name.charAt(i + 2).toUpperCase() + name.slice(i + 3) } : { main: name, sub: '' }; }
  function useLabel(TQ, u) { var t = u && TQ && TQ.uses && TQ.uses[u.id]; return (t && t.name) || (u ? u.n : ''); }
  /* "Catalogue name: …" in small text where the plain name differs (result, PDF, the explainer), so the catalogue entry is easy to find. */
  function catalogueName(TQ, u) { return u && useLabel(TQ, u) !== u.n ? 'Catalogue name: ' + u.n : ''; }
  function useLevelLine(u) { return 'How common in hotels: ' + useLevel(u) + ' (Use-Case Catalogue rating).'; }
  /* The use-case explainer (data/explain.json): "What it does" and "How the AI works", or null when the page carries none. */
  function explain(ex, id) { var x = ex && id && ex[id]; return x ? { does: 'What it does: ' + x.does, how: 'How the AI works: ' + x.how } : null; }
  function pathParts(rec, cat, TQ) {
    var p = [], d = (cat && cat.depts || []).filter(function (x) { return x.id === rec.dept; })[0], u = d && d.uses.filter(function (x) { return x.id === rec.use; })[0];
    if (rec.use === 'none') { if (rec.cat) p.push(rec.cat); if (d) p.push(d.name); p.push('None of these fits'); return p; }
    if (rec.cat) p.push(rec.cat);
    if (d) p.push(d.name);
    if (u) p.push(useLabel(TQ, u));
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
  /* v2.7.0: the fold under a step-5 question: the data file's "why" line, its area and who answers (all verbatim from the data). */
  function tailWhy(TQ, useId, t) { return [t.why, 'Area: ' + TQ.areas[t.a] + '.', 'Who answers: ' + t.whoLabel + '.']; }
  /* The smallest and the largest number of tailored questions over all use cases (the cover's "six to nine questions"). */
  function tailRange(TQ) { var n = Object.keys(TQ.uses).map(function (k) { return TQ.uses[k].qs.length; }); return [Math.min.apply(null, n), Math.max.apply(null, n)]; }
  function lc(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }

  /* ---------- return visit: snapshots of the result ---------- */
  /* A snapshot belongs to one use case and one rules version (use: the use id, 'none', or '' in snapshots kept by rules v2,
     which did not record it). Only snapshots of the same use and the same rules are compared line by line. */
  /* Audit v3 L3: sig, the signature of the use case's tailored questions at the time (TQ.uses[use].sig; '' before v2.5). */
  function snapshot(ev, at, use, sig) { return { at: at, level: ev.level, pct: ev.pct, pts: ev.pts, max: ev.max, known: ev.counts.known, total: ev.counts.total, mustYes: ev.must.yes, mustN: ev.must.n, rules: RULES, use: use || '', sig: sig || '' }; }
  function sameSnap(a, b) { return !!a && !!b && ['level', 'pts', 'max', 'known', 'total', 'mustYes', 'mustN', 'rules', 'use', 'sig'].every(function (k) { return (a[k] == null ? '' : a[k]) === (b[k] == null ? '' : b[k]); }); }
  /* Were two snapshots of one use case asked with other questions? Only when both carry a signature. */
  function otherQs(a, b) { return !!(a.sig && b.sig && a.sig !== b.sig); }
  var EARLIER_RULES = 'worked out with earlier rules';
  var OTHER_QS = 'asked with other questions, not compared line by line'; // audit v3 L3
  /* The snapshots that belong to the last one's use case: the same use, or a v2 snapshot that carries none. */
  function snapsOf(snaps) {
    var b = snaps && snaps[snaps.length - 1]; if (!b) return [];
    return snaps.filter(function (s) { return (s.use || '') === (b.use || '') || (!s.use && s.rules !== b.rules); });
  }
  /* "Since last time": the last result against the one before it for the same use case and rules. A result kept by earlier
     rules is listed and marked, never compared line by line. null on a first visit. */
  function since(snaps) {
    var mine = snapsOf(snaps); if (mine.length < 2) return null;
    var b = mine[mine.length - 1], before = mine.slice(0, -1), same = before.filter(function (s) { return s.rules === b.rules && !otherQs(s, b); }), a = same[same.length - 1];
    var pc = function (s) { return s.pct == null ? 'no score' : s.pct + '%'; };
    var row = function (s) { return fmtDate(s.at) + ': ' + C.LEVELS[s.level].name + ', ' + pc(s) + ', ' + s.mustYes + ' of ' + s.mustN + ' must-haves' + (s.rules !== b.rules ? ' (' + EARLIER_RULES + ')' : otherQs(s, b) ? ' (' + OTHER_QS + ')' : ''); };
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
      lines.push(o.rules !== b.rules ? 'It was ' + EARLIER_RULES + ' (' + (o.rules || 'not recorded') + '), so it is not compared line by line with today’s.' : 'It was ' + OTHER_QS + '.');
      lines.push('Then: ' + C.LEVELS[o.level].name + ', ' + pc(o) + ', ' + o.mustYes + ' of ' + o.mustN + ' must-haves at Yes.');
    }
    return { head: head, lines: lines, compared: !!a, earlier: before.slice().reverse().map(row) };
  }

  /* ---------- how it was worked out ---------- */
  function method(ev) {
    var c = ev.counts, out = [], zero = JUDGEMENT.UNKNOWN_SCORES_ZERO;
    out.push(zero ? 'Points per answer: Yes 2 · Planned, not done yet 1 · No 0 · Not answered yet 0.'
      : 'Points per answer: Yes 2 · Planned, not done yet 1 · No 0. A question not answered yet is left out of the points.');
    out.push('You answered ' + c.known + ' of ' + c.total + ' questions (' + c.unknown + ' not answered yet).');
    out.push(ev.pct != null ? 'Your points: ' + ev.pts + ' of ' + ev.max + ' possible = ' + ev.pct + '% (rounded down).'
      : 'No score is shown while more than half the questions are not answered yet' + (ev.max ? ' (your points so far: ' + ev.pts + ' of ' + ev.max + ')' : '') + '.');
    ev.areas.forEach(function (g) { out.push(areaLine(g) + ' (' + g.pts + ' of ' + g.max + ' points; ' + g.known + ' of ' + g.n + ' answered).'); });
    out.push('Cut-offs: “' + C.LEVELS.ready.name + '” needs every must-have at Yes, a score of ' + T.READY + '% or more, and fewer than a quarter of the questions are not answered yet. “' + C.LEVELS.almost.name + '”: ' + T.ALMOST + '% to ' + (T.READY - 1) + '%, or a must-have that is not Yes yet but none at No. “' + C.LEVELS.notready.name + '”: below ' + T.ALMOST + '%, or any must-have at No' + (JUDGEMENT.ALMOST_MIN_MUST_YES ? ', or fewer than half the must-haves at Yes' : '') + '. “' + C.LEVELS.noinfo.name + '”: more than half the questions are not answered yet.');
    out.push('Areas in words, only where an area has two or more answers: Strong (' + T.STRONG + '% or more of its points), Gaps to close (' + T.GAPS + '% to ' + (T.STRONG - 1) + '%), Weak (below ' + T.GAPS + '%).');
    if (zero) out.push('Team judgement: a question not answered yet counts as 0 points, so the score is the share of everything asked that is in place. It is still listed as not answered yet.');
    if (JUDGEMENT.SENSITIVE_HOLDS_TOP) out.push('Team judgement: a use case that involves people’s personal data or jobs does not get the top verdict here. Ask an adviser before a pilot.');
    if (JUDGEMENT.CARRIED_NO_HOLDS_TOP) out.push('Team judgement: a No on question 2, 3, 4 or 5 of step 2 holds the top verdict back until it is settled.');
    if (JUDGEMENT.ALMOST_MIN_MUST_YES) out.push('Team judgement (rules v2.5): “' + C.LEVELS.almost.name + '” needs at least half the must-haves at Yes, because “Planned” is not done yet. Below that the verdict is “' + C.LEVELS.notready.name + '”.');
    if (JUDGEMENT.READY_MIN_TAIL_YES) out.push('Team judgement (rules v2.5): “' + C.LEVELS.ready.name + '” needs at least half the questions for this use case that you answered at Yes.');
    if (JUDGEMENT.NOT_SURE_HOLDS_TOP) out.push('Team judgement (rules v2.5): a “Not sure” in step 2 holds the top verdict back until it is found out.');
    if (JUDGEMENT.NONE_BEST_ALMOST) out.push('Team judgement (rules v2.5): with “None of these fits” the best verdict is “' + C.LEVELS.almost.name + '”, because nothing was checked for a particular tool.');
    out.push('Your verdict is “' + C.LEVELS[ev.level].name + '”. ' + ev.reason);
    if (ev.mustOnly) out.push(C.MUST_ONLY);
    out.push('The answers are your own and nobody checks them. The cut-offs are the team’s judgement and have not been tested with hotels. Rules ' + RULES + '.');
    return out;
  }
  /* "Data: 0 of 1 in place", with the word only when the area has two or more known answers, and how many are not answered yet. */
  function areaLine(g) {
    return g.name + ': ' + g.yes + ' of ' + g.n + ' in place' + (g.word ? ' · ' + C.AREA_WORD[g.word] : '') + (g.unknown ? ' · ' + g.unknown + ' not answered yet' : '');
  }
  function mustLine(ev) {
    var m = ev.must, p = [m.yes + ' of ' + m.n + ' must-haves in place'];
    if (m.planned) p.push(m.planned + ' planned'); if (m.no) p.push(m.no + ' not in place'); if (m.unknown) p.push(m.unknown + ' not answered yet');
    return p.join(' · ');
  }
  /* The score is never worded as "% ready" (council, items 1 and 2): "Score: 83%", or no score at all under "Not enough information yet". */
  function scoreHead(ev) { return ev.pct == null ? 'No score yet: you answered ' + ev.counts.known + ' of ' + ev.counts.total + ' questions.' : 'Score: ' + ev.pct + '%'; }
  /* The points and the question counts that stand next to the score, then the caveat. */
  function scoreSub(ev) {
    var c = ev.counts;
    if (ev.pct == null) return C.SCORE_NOTE;
    var base = !JUDGEMENT.UNKNOWN_SCORES_ZERO ? ev.pts + ' of ' + ev.max + ' points on the ' + n_(c.known, 'question', 'questions') + ' you answered' + (c.unknown ? ' (of ' + c.total + ')' : '') + '.'
      : c.unknown ? ev.pts + ' of ' + ev.max + ' points on ' + n_(c.total, 'question', 'questions') + ': ' + c.known + ' answered, ' + c.unknown + ' not answered yet (0 points each).'
      : ev.pts + ' of ' + ev.max + ' points on the ' + n_(c.known, 'question', 'questions') + ' you answered.';
    return base + ' ' + C.SCORE_NOTE;
  }

  /* The line under the verdict (in "How this was worked out"), v2.5: BUILD NOW 1 and 2, O4. */
  function levelLine(ev) {
    if (ev.kind === 'fewMust') return C.ALMOST_FEW_MUST.replace('{n}', ev.must.yes).replace('{m}', ev.must.n);
    if (ev.kind !== 'held') return C.LEVELS[ev.level].line;
    var h = ev.held;
    if (h.indexOf('sensitive') >= 0 || h.indexOf('carried') >= 0 || h.indexOf('notsure') >= 0) return C.ALMOST_HELD;
    if (h.indexOf('tail') >= 0) return C.READY_FEW_TAIL.replace('{y}', ev.tail.yes).replace('{n}', ev.tail.n).replace('{p}', ev.tail.planned);
    return C.NONE_ALMOST;
  }
  /* "Settle this first: ..." for each hold that needs its own line (BUILD NOW 3; O2, O4). A 'tail' hold needs none: its
     planned and missing questions are already the open items. */
  function holdItems(ev, v) {
    var out = [], h = ev.held;
    if (h.indexOf('carried') >= 0) ev.carried.forEach(function (id) { var q = QBY[id]; out.push({ who: '', text: C.HOLD.carried.replace('{title}', q.title).replace('{outcome}', q.outcome + (q.add ? ' ' + q.add : '')), sub: 'Step 2: ' + C.STEP2_HEAD, hold: 'carried' }); });
    if (h.indexOf('notsure') >= 0) out.push({ who: '', text: C.HOLD.notsure.replace('{titles}', notSureTitles(v)).replace('{find}', v.find.map(function (f) { return f.text + ': ask ' + f.who + '.'; }).join(' ')), sub: 'Step 2: ' + C.STEP2_HEAD, hold: 'notsure' });
    if (h.indexOf('sensitive') >= 0) out.push({ who: '', text: C.HOLD.sensitive, sub: 'Step 4: Where in the hotel?', hold: 'sensitive' });
    if (h.indexOf('none') >= 0) out.push({ who: '', text: C.HOLD.none, sub: 'Step 4: Where in the hotel?', hold: 'none' });
    return out;
  }

  /* v2.7.0: the vendor questions (C.VENDOR), with one more question for each of four open items: must-haves 4
     (systems), 6 (a person who checks) and 5 (personal data), and a card-payment question of the use case (id ending .x-pay). */
  function vendorQs(rec, ev) {
    var V = C.VENDOR, out = [V.first].concat(V.all);
    if (rec.dept === 'rm') out.push(V.pricing);
    out = out.concat(V.last);
    var open = function (pred) { return ev.items.some(function (it) { return pred(it) && it.state && it.state !== 'yes'; }); };
    if (open(function (it) { return it.key === 'm4'; })) out.push(V.ask.m4);
    if (open(function (it) { return it.key === 'm6'; })) out.push(V.ask.m6);
    if (open(function (it) { return it.key === 'm5'; })) out.push(V.ask.m5);
    if (open(function (it) { return /\.x-pay$/.test(it.key); })) out.push(V.ask.pay);
    return out.filter(function (q, i, a) { return a.indexOf(q) === i; });
  }
  /* ---------- the whole result, in words ----------
     env: { cat (catalogue model), TQ, ex, today } */
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
      /* v2.5.1: each answer also carries what it means (aiMeaning): state, line, ask, ifNo. */
      answers: C.QUESTIONS.map(function (q, i) { var x = aiMeaning(q.id, (rec.Q || {})[q.id]); return { n: i + 1, id: q.id, title: q.title, q: q.q, a: x.answer, state: x.state, good: x.good, line: x.line, ask: x.ask, ifNo: x.ifNo }; }),
      path: pathParts(rec, cat, TQ).join(' › ') || 'Nothing chosen.',
      /* v2.2: "What it does" and "How the AI works" from the explainer replace the catalogue's task text where the page carries them. */
      useTask: u && explain(env.ex, u.id) ? explain(env.ex, u.id).does : '', useHow: u && explain(env.ex, u.id) ? explain(env.ex, u.id).how : '',
      useLevel: u ? useLevelLine(u) : '', catName: catalogueName(TQ, u), useName: u ? useLabel(TQ, u) : '',
      none: rec.use === 'none' ? noneLine(cat.nUses) : '',
      levelName: C.LEVELS[ev.level].name,
      levelLine: levelLine(ev),
      reason: ev.reason, held: ev.held.slice(), flag: ev.sensitive ? C.SENSITIVE_FLAG : '', disclaimer: C.DISCLAIMER,
      boxLine: ev.box, pilot: ev.level === 'ready' ? C.PILOT_GLOSS : '',
      scoreHead: scoreHead(ev), scoreSub: scoreSub(ev), mustLine: mustLine(ev),
      cap: ev.cap ? 'The top verdict needs every must-have at Yes: ' + n_(ev.must.n - ev.must.yes, 'is', 'are') + ' still open.' : '',
      mustOnly: ev.mustOnly ? C.MUST_ONLY : '', draft: '',
      areasHead: C.AREAS_HEAD,
      areas: ev.areas.map(function (g) { return { k: g.k, name: g.name, yes: g.yes, n: g.n, unknown: g.unknown, count: g.yes + ' of ' + g.n, share: g.n ? Math.round(100 * g.yes / g.n) : 0, word: g.word ? C.AREA_WORD[g.word] : '', cls: g.word || 'none', line: areaLine(g) }; }),
      method: method(ev), since: since(rec.snaps) };
    /* BUILD NOW 3: a held verdict lists what holds it as item 1 (who: '': the line names the step it comes from). */
    var holds = holdItems(ev, v), all = open(ev);
    o.first = holds.concat(all.map(function (a) { return { who: C.WHO[a.who], text: a.text, sub: (a.must ? 'Must-have: ' : '') + a.name + ' · your answer: ' + a.word }; })).slice(0, 3);
    o.firstLabel = o.first.length ? firstLabel(o.first.length) : 'Nothing open';
    o.people = byPerson(ev).map(function (p) { return { who: p.who, name: p.name, items: p.items.map(function (a) { return { text: a.text, tag: (a.must ? 'Must-have · ' : '') + a.name + ' · ' + a.word, must: a.must, state: a.state }; }) }; });
    o.itemList = ev.items.map(function (it) { return { key: it.key, grp: it.grp, name: it.name, q: it.q, answer: answerWord(it) + (it.state === 'planned' && fmtDate(it.by) ? ' (' + plannedBy(it) + ')' : ''), state: it.state }; });
    o.vendor = u ? vendorQs(rec, ev) : [];
    return o;
  }
  /* One person's list as plain text (the "Copy for …" buttons). v2.5: Copy summary's summaryText was removed (audit v3, dead code). */
  function personText(m, p, useName) {
    return 'Do you need AI?' + (useName ? ' ' + useName : '') + (m.hotel ? ' (' + m.hotel.split(' · ')[0] + ')' : '') + '\nFor: ' + p.name + '\nCould you help with these?\n\n' +
      p.items.map(function (a, i) { return (i + 1) + '. ' + a.text + (a.must ? ' (must-have)' : ''); }).join('\n');
  }
  var api = { QV: QV, legacyQ: legacyQ, badAns: badAns, RULES: RULES, JUDGEMENT: JUDGEMENT, AREA_WORD_MIN: AREA_WORD_MIN, EARLIER_RULES: EARLIER_RULES, sensitiveOf: sensitiveOf, vendorQs: vendorQs, tailRange: tailRange, areaLine: areaLine, plannedBy: plannedBy, snapsOf: snapsOf,
    T: T, POINTS: POINTS, QIDS: QIDS, MUST_IDS: MUST_IDS, MUST: MUST, QBY: QBY, AK: AK, Q_OK: Q_OK, A_OK: A_OK, STATE_WORD: STATE_WORD, OLD: OLD, oldOf: oldOf, oldLine: oldLine, answerWord: answerWord,
    verdict: verdict, verdictText: verdictText, aiMeaning: aiMeaning, aiMeaningText: aiMeaningText, sourceItem: sourceItem, sourceRow: sourceRow, sourceRowItem: sourceRowItem, detailData: detailData, realDate: realDate, fmtDate: fmtDate, localIso: localIso, systemsFor: systemsFor,
    useQs: useQs, questions: questions, evaluate: evaluate, open: open, byPerson: byPerson, task: task, actText: actText, firstLabel: firstLabel,
    pathParts: pathParts, nameParts: nameParts, useOf: useOf, useLevel: useLevel, useLabel: useLabel, catalogueName: catalogueName, useLevelLine: useLevelLine, explain: explain, noneLine: noneLine, shareLines: shareLines, tailWhy: tailWhy,
    snapshot: snapshot, sameSnap: sameSnap, since: since, method: method, mustLine: mustLine, scoreHead: scoreHead, scoreSub: scoreSub,
    resultModel: resultModel, personText: personText, answerState: answerState, consistLines: consistLines, levelLine: levelLine, holdItems: holdItems, OTHER_QS: OTHER_QS };
  root.R2Logic = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
