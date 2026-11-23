/* Readiness 2.0: the page. State machines and the record live in src/flow.js (R2Flow), rules in src/logic.js (R2Logic),
   words in src/content.js (R2Content). This file only draws the current state and turns clicks into send(event).
   rec = the record (saved in localStorage['hftp-readiness2-v1']); ui = what is on screen now, never saved:
     confirm  CONFIRM machine: null | 'restart'
     missing  after a refused "Next": the id of the first unanswered question ('where' on step 1b), outlined; else null
     copy     true while the copy box (clipboard fallback) is open
     open     which folded explanations are open (kept across re-renders) */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var C = window.R2Content, L = window.R2Logic, F = window.R2Flow;
  var D, CAT;
  try { D = JSON.parse($('r2-data').textContent); CAT = D.cat; }
  catch (e) { $('app').setAttribute('data-state', 'error'); $('view').innerHTML = '<p class="panel" role="alert">The catalogue data in this page could not be read. Reload the page; if this stays, tell the project team the page needs rebuilding.</p>'; throw e; }
  var USE = {}, DEPT = {};
  CAT.depts.forEach(function (d) { DEPT[d.id] = d; d.uses.forEach(function (u) { USE[u.id] = Object.assign({ dept: d }, u); }); });
  var IN_HUB = window.parent !== window;
  var PROFILE = 'hftp-hotel-profile-v1';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function plural(n, a, b) { return n + ' ' + (n === 1 ? a : (b || a + 's')); }

  // ---------- storage (versioned record, see F.migrate) ----------
  var storage = 'ok'; // 'ok' | 'blocked' (private window, blocked site data: the page still works, nothing is kept)
  function load() {
    try { var s = localStorage.getItem(F.KEY); if (!s) return null; return F.migrate(JSON.parse(s), CAT); }
    catch (e) { if (e && e.name === 'SecurityError') storage = 'blocked'; return null; }
  }
  function save() {
    try { var r = JSON.parse(JSON.stringify(rec)); r.updated = new Date().toISOString(); localStorage.setItem(F.KEY, JSON.stringify(r)); storage = 'ok'; }
    catch (e) { storage = 'blocked'; }
  }
  function hotelName() { try { var p = JSON.parse(localStorage.getItem(PROFILE) || 'null'); return p && typeof p.name === 'string' ? p.name.trim().slice(0, 120) : ''; } catch (e) { return ''; } }

  var rec = load() || F.blank();
  var ui = { confirm: null, missing: null, copy: false, open: {} };
  function ctx() { return F.ctxOf(rec, CAT); }

  // ---------- send: the only way anything changes ----------
  function firstOpen(step) {
    if (step === 'q') return F.QIDS.filter(function (id) { return !L.Q_OK[rec.Q[id]]; })[0] || null;
    if (step === 'where') return ctx().whereDone ? null : 'where';
    var ids = step === 'needs' ? C.NEEDS.map(function (x) { return x.id; }) : step === 'success' ? F.FACTOR_IDS : [];
    return ids.filter(function (id) { return !L.A_OK[rec.A[id]]; })[0] || null;
  }
  function send(ev, arg) {
    var prev = rec.step, c;
    if (ev === 'restart') { c = F.confirmNext(ui.confirm, 'ask'); ui.confirm = c.c; render(); var y = $('restart-yes'); if (y) y.focus(); return true; }
    if (ev === 'restart-no') { ui.confirm = F.confirmNext(ui.confirm, 'no').c; render(); return true; }
    if (ev === 'restart-yes') {
      c = F.confirmNext(ui.confirm, 'yes'); ui.confirm = c.c;
      if (!c.fire) { render(); return false; }
      var rr = F.reduce(rec, 'restart', null, CAT); if (!rr.ok) { render(); return false; }
      rec = rr.rec; ui.open = {}; afterMove(prev, true); return true;
    }
    if (ev === 'next' && F.flowNext(rec.step, 'next', ctx()) === null) {
      /* Refused "Next": point at the first open question (Q1 No always goes on to the stop screen, so never here). */
      ui.missing = firstOpen(rec.step); render();
      var m = document.querySelector('.missing'); if (m) { m.scrollIntoView({ block: 'center' }); var f = m.querySelector('input'); if (f) f.focus({ preventScroll: true }); }
      return false;
    }
    var r = F.reduce(rec, ev, arg, CAT);
    if (ev === 'pop') { rec = r.rec; if (!r.ok) { try { history.replaceState({ r2: rec.step }, ''); } catch (e) { /* ignore */ } } afterMove(prev, false); return r.ok; }
    if (!r.ok) return false;
    rec = r.rec;
    if (rec.step !== prev) { afterMove(prev, true); return true; }
    if (ui.missing && (ev === 'answer' || ev === 'use')) ui.missing = firstOpen(rec.step) === ui.missing ? ui.missing : null;
    save(); render();
    return true;
  }
  function afterMove(prev, push) {
    ui.confirm = F.confirmNext(ui.confirm, 'nav').c; ui.missing = null; ui.copy = false;
    if (push && rec.step !== prev) { try { history.pushState({ r2: rec.step }, ''); } catch (e) { /* sandboxed */ } }
    save(); render();
    if (rec.step !== prev) { window.scrollTo(0, 0); $('view').focus({ preventScroll: true }); }
  }

  // ---------- pieces ----------
  var STEP_LINE = { q: ['Step 1 of 3', 'Is this an AI problem?'], stop: ['Result', 'Not an AI problem'], where: ['Step 1 of 3', 'Where in the hotel?'],
    needs: ['Step 2 of 3', 'What you need'], success: ['Step 3 of 3', 'What makes it succeed'], summary: ['Summary', ''] };
  function header() {
    if (rec.step === 'start') {
      return '<div class="hdrtop"><p class="meta">A student project by EHL for HFTP · prototype</p></div><h1>Readiness 2.0</h1>' +
        '<p class="sub"><strong>Start here: is AI the answer, and where?</strong></p>' +
        '<p class="meta honest" id="honest">' + esc(C.HONEST) + '</p>';
    }
    var s = STEP_LINE[rec.step], n = { q: 1, where: 1, needs: 2, success: 3 }[rec.step] || (rec.step === 'summary' ? 4 : 0);
    var bar = rec.step === 'stop' ? '' : '<div class="steps3" aria-hidden="true">' + [1, 2, 3].map(function (i) { return '<span class="' + (i < n ? 'done' : i === n ? (rec.step === 'q' ? 'now' : 'done') : '') + '"></span>'; }).join('') + '</div>';
    return '<div class="hdrtop"><p class="hdrline"><strong>Readiness 2.0</strong> · ' + esc(s[0]) + (s[1] ? ' · ' + esc(s[1]) : '') + '</p>' +
      (rec.step === 'stop' ? '' : '<button type="button" class="linkbtn" data-act="restart" id="restart-top">Start again</button>') + '</div>' + bar; // the stop screen has its own two buttons only
  }
  function confirmBox() {
    if (ui.confirm !== 'restart') return '';
    return '<div class="confirmline" data-confirm="restart" role="group" aria-label="Start again?"><p><strong>Clear all your answers and start again?</strong> This cannot be undone.</p>' +
      '<div class="btnrow"><button type="button" class="btn warn" data-act="restart-yes" id="restart-yes">Yes, clear and start again</button><button type="button" class="btn" data-act="restart-no" id="restart-no">Keep my answers</button></div></div>';
  }
  function fold(key, label, body) {
    return '<details class="more" data-fold="' + key + '"' + (ui.open[key] ? ' open' : '') + '><summary>' + esc(label) + '</summary><div class="morebody">' + body + '</div></details>';
  }
  function sources(step) {
    var list = C.SOURCES[step] || [], note = C.SOURCES[step + 'Note'] || '';
    var body = (note ? '<p>' + esc(note) + '</p>' : '') + (list.length ? '<ul>' + list.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' : '');
    if (step === 'where') body = '<p>' + esc(note) + ' ' + esc(CAT.nUses + ' use cases in ' + CAT.nDepts + ' departments; page built ' + D.builtOn + '.') + '</p>';
    return '<section class="sources noprint-not">' + fold('src-' + step, 'Where this comes from', body) + '</section>';
  }
  function evidence(ev) {
    if (!ev || !ev.length) return '';
    return '<div class="ev"><b>Evidence</b>' + ev.map(function (e) { return '<p>' + esc(e[0]) + '<span class="src">Source: ' + esc(e[1]) + '</span></p>'; }).join('') + '</div>';
  }
  function radios(name, opts, cur) {
    return '<div class="opts" role="radiogroup" aria-labelledby="t-' + name + '">' + opts.map(function (o) {
      var on = cur === o[0], id = 'a-' + name + '-' + o[0];
      return '<label class="opt' + (on ? ' on' : '') + '" for="' + id + '"><input type="radio" name="' + name + '" id="' + id + '" value="' + o[0] + '" data-answer="' + name + '"' + (on ? ' checked' : '') + '>' + esc(o[1]) + '</label>';
    }).join('') + '</div>';
  }
  function needLine(id) { return ui.missing === id ? '<p class="needline" role="alert">Answer this to continue (“Don’t know yet” is fine).</p>' : ''; }
  function nav(backLabel, nextLabel, nextId) {
    return '<div class="navrow"><button type="button" class="btn back" data-act="back" id="back">' + esc(backLabel || 'Back') + '</button><span class="spacer"></span>' +
      '<button type="button" class="btn primary" data-act="next" id="' + (nextId || 'next') + '">' + esc(nextLabel) + '</button></div>';
  }
  function vClass(key) { return key === 'stop' ? 'v-stop' : key === 'go' || key === 'assist' ? 'v-go' : key === 'find' || key === 'open' ? 'v-open' : 'v-hold'; }
  /* onSummary: the all-Yes headline drops its "Next: find where it sits" (already done by then). */
  function verdictBody(v, onSummary) {
    var h = '<p class="vsent" id="verdict-head">' + esc(onSummary && v.key === 'go' ? C.VERDICT.goDone : v.head) + '</p>' + (v.second ? '<p><strong>' + esc(v.second) + '</strong></p>' : '');
    var also = v.carried.filter(function (c, i) { return !(i === 0 && C.VERDICT[{ q2: 'worth', q3: 'data', q5: 'success' }[c.id]] === v.head); });
    if (v.carried.length) h += '<div><p><strong>' + (also.length < v.carried.length ? 'What this means' : 'Carried to your summary') + '</strong></p><ul>' + v.carried.map(function (c) { return '<li>' + esc(c.text) + (c.add ? ' ' + esc(c.add) : '') + '</li>'; }).join('') + '</ul></div>';
    if (v.find.length) h += '<div><p><strong>To find out</strong></p><ul>' + v.find.map(function (f) { return '<li>' + esc(f.text) + ': ask ' + esc(f.who) + '.</li>'; }).join('') + '</ul></div>';
    if (v.q1Unsure) h += '<p>If question 1 turns out to be No, this is not an AI problem: rules or ordinary automation will do it.</p>';
    return h;
  }

  // ---------- screens ----------
  function vStart() {
    return '<section class="panel"><h2>Three steps, then a summary</h2><ol class="journey">' +
      '<li><b>Where is the problem?</b><span>Five yes/no questions: is AI the right kind of tool for it? Then find where it sits in your hotel among ' + esc(CAT.nUses + ' use cases in ' + CAT.nDepts + ' departments') + '.</span></li>' +
      '<li><b>What you need to implement AI</b><span>Ten things every hotel needs in place, such as systems that can talk to each other and the data protection paperwork.</span></li>' +
      '<li><b>What makes it succeed</b><span>Nine factors, from budget and leadership to change management.</span></li></ol>' +
      '<p class="sub">The summary has no score. It shows what is in place, the three weakest points and what to do next. Your answers stay in this browser.</p>' +
      '<div class="navrow"><button type="button" class="btn primary" data-act="begin" id="begin">Start</button></div></section>';
  }
  function vQ() {
    var v = L.verdict(rec.Q), h = '<div class="stephead"><p class="kicker">Step 1 · Part 1 of 2</p><h2>Is this an AI problem?</h2>' +
      '<p class="sub">Think of one problem in your hotel. Five questions; each Yes points towards AI. If you are not sure, say so: it becomes something to find out.</p></div>';
    h += '<section class="panel">' + C.QUESTIONS.map(function (q, i) {
      return '<fieldset class="qa' + (ui.missing === q.id ? ' missing' : '') + '" id="f-' + q.id + '" aria-labelledby="t-' + q.id + '"><div class="qrow"><span class="qno" aria-hidden="true">' + (i + 1) + '</span><div class="qbody">' +
        '<p class="qtext" id="t-' + q.id + '">' + esc(q.q) + '</p>' + (q.hint ? '<p class="qhint">' + esc(q.hint) + '</p>' : '') +
        radios(q.id, C.Q_ANSWERS, rec.Q[q.id]) + needLine(q.id) +
        fold('why-' + q.id, 'Why we ask, and an example', '<p>' + esc(q.why) + '</p><p><b>Yes, for example:</b> ' + esc(q.yes) + '</p><p><b>No, for example:</b> ' + esc(q.no) + '</p>') +
        '</div></div></fieldset>';
    }).join('') + '</section>';
    if (v.key === 'stop') h += '<section class="verdict v-stop" id="verdict" data-verdict="stop"><p class="vsent">Question 1 is No.</p><p>Press “See the result”: there is no need to answer the rest.</p></section>';
    else if (v.complete) h += '<section class="verdict ' + vClass(v.key) + '" id="verdict" data-verdict="' + v.key + '">' + verdictBody(v) +
      (v.key !== 'go' ? '<p class="meta">You can still go on. The summary keeps these conditions.</p>' : '') + '</section>';
    h += sources('q');
    h += nav('Back', v.key === 'stop' ? 'See the result' : 'Next: where in the hotel?');
    return h;
  }
  function vStop() {
    var q1 = L.QBY.q1;
    return '<section class="verdict v-stop stopcard" id="stopcard" data-verdict="stop"><h1 id="stop-head">' + esc(C.STOP.head) + '</h1>' +
      '<p>' + esc(C.STOP.why) + '</p><p><strong>' + esc(C.STOP.instead) + '</strong></p>' +
      '<p class="meta">Because you answered No to: “' + esc(q1.q) + '”</p>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="change" id="change">Change my answers</button><button type="button" class="btn" data-act="restart" id="restart">Start again</button></div></section>' +
      sources('q');
  }
  function useLevel(u) { return u.use ? u.use : 'not rated'; }
  function catLink(d) {
    return '<a href="../use-case-catalogue/index.html#' + esc(d.id) + '" data-act="catalogue" data-dept="' + esc(d.id) + '"' + (IN_HUB ? '' : ' target="_blank" rel="noopener"') + '>Sources in the Use-Case Catalogue</a>';
  }
  function vWhere() {
    var h = '<div class="stephead"><p class="kicker">Step 1 · Part 2 of 2</p><h2>Where in the hotel?</h2>' +
      '<p class="sub">Pick the area, then the department. If one of its use cases matches your problem, choose it. If none does, say so: steps 2 and 3 still apply.</p>' +
      '<p class="meta">' + esc(CAT.nUses + ' use cases in ' + CAT.nDepts + ' departments, from the hub’s Use-Case Catalogue.') + '</p></div>';
    h += '<section class="panel' + (ui.missing === 'where' ? ' missing' : '') + '" id="where"><h3>1. Area</h3><div class="tiles" role="group" aria-label="Area">' + CAT.cats.map(function (c) {
      var ds = CAT.depts.filter(function (d) { return d.cat === c.name; }), n = ds.reduce(function (a, d) { return a + d.uses.length; }, 0);
      return '<button type="button" class="tile" data-act="cat" data-cat="' + esc(c.name) + '" id="cat-' + esc(c.name.toLowerCase().replace(/[^a-z]/g, '')) + '" aria-pressed="' + (rec.cat === c.name) + '"><b>' + esc(c.name) + '</b>' +
        (c.line ? '<span>' + esc(c.line) + '</span>' : '') + '<span>' + esc(plural(ds.length, 'department') + ' · ' + plural(n, 'use case')) + '</span></button>';
    }).join('') + '</div>';
    if (rec.cat) {
      h += '<h3>2. Department</h3><div class="tiles" role="group" aria-label="Department">' + CAT.depts.filter(function (d) { return d.cat === rec.cat; }).map(function (d) {
        return '<button type="button" class="tile" data-act="dept" data-dept="' + esc(d.id) + '" id="dept-' + esc(d.id) + '" aria-pressed="' + (rec.dept === d.id) + '"><b>' + esc(d.name) + '</b><span>' + esc(plural(d.uses.length, 'use case')) + '</span></button>';
      }).join('') + '</div>';
    }
    var d = DEPT[rec.dept];
    if (d && d.cat === rec.cat) {
      h += '<h3>3. Use case</h3><p class="meta">Choose the one that matches your problem. “How common” is the catalogue’s rating of how widely hotels use it.</p><div class="ucs" role="radiogroup" aria-label="Use case">' + d.uses.map(function (u) {
        var on = rec.use === u.id;
        return '<label class="uc' + (on ? ' on' : '') + '" for="u-' + u.id + '"><input type="radio" name="use" id="u-' + u.id + '" value="' + u.id + '" data-use="' + u.id + '"' + (on ? ' checked' : '') + '>' +
          '<span class="ucbody"><span class="ucn">' + esc(u.n) + '</span><span class="uct">What AI does: ' + esc(u.task) + '</span>' +
          '<span class="ucm"><span>How common in hotels: <span class="lvl">' + esc(useLevel(u)) + '</span></span>' + catLink(d) + '</span></span></label>';
      }).join('') + '</div>';
    }
    var noneOn = rec.use === 'none';
    h += '<div class="ucs nonefits"><label class="uc' + (noneOn ? ' on' : '') + '" for="u-none"><input type="radio" name="use" id="u-none" value="none" data-use="none"' + (noneOn ? ' checked' : '') + '>' +
      '<span class="ucbody"><span class="ucn">None of these fits my problem</span><span class="uct">The summary will say so. Steps 2 and 3 still apply.</span></span></label></div>';
    if (ui.missing === 'where') h += '<p class="needline" role="alert">Choose the use case that matches your problem, or “None of these fits my problem”.</p>';
    h += '</section>';
    h += '<p class="pathline" id="pathline">' + pathText(true) + '</p>';
    h += sources('where');
    h += nav('Back', 'Next: what you need');
    return h;
  }
  /* "Guest-facing › Front Office › <use case>" or "… › None of these fits". */
  function pathParts() {
    var p = [];
    if (rec.cat) p.push(rec.cat);
    if (rec.dept && DEPT[rec.dept]) p.push(DEPT[rec.dept].name);
    if (rec.use === 'none') p.push('None of these fits');
    else if (USE[rec.use]) p.push(USE[rec.use].n);
    return p;
  }
  function pathText(html) {
    var p = pathParts();
    if (!p.length) return html ? 'Nothing chosen yet.' : 'Nothing chosen.';
    return html ? 'Your choice: ' + p.map(function (x, i) { return i === p.length - 1 ? '<b>' + esc(x) + '</b>' : esc(x); }).join(' › ') : p.join(' › ');
  }
  function byField(id) {
    if (rec.A[id] !== 'pl') return '';
    return '<div class="byfield"><label for="by-' + id + '">By when? (optional)</label><input type="date" id="by-' + id + '" data-by="' + id + '" value="' + esc(rec.By[id] || '') + '">' +
      '<span class="meta">Planned is not in place yet: it stays on your to-do list until it is done.</span></div>';
  }
  function itemBlock(it, isFactor) {
    var more = isFactor
      ? '<p><b>What it means:</b> ' + esc(it.def) + '</p><p><b>What good looks like:</b> ' + esc(it.good) + '</p><div><b>Warning signs</b><ul>' + it.warn.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>'
      : '<p><b>What good looks like:</b> ' + esc(it.good) + '</p>' + (it.also.length ? '<div><b>The readiness check also asks</b><ul>' + it.also.map(function (a) { return '<li>' + esc(a[1]) + ' <span class="rc">' + esc(a[0]) + '</span></li>'; }).join('') + '</ul></div>' : '');
    more += evidence(it.ev);
    return '<fieldset class="qa' + (ui.missing === it.id ? ' missing' : '') + '" id="f-' + it.id + '" aria-labelledby="t-' + it.id + '"><h3>' + esc(it.name) + (it.key ? ' <span class="keytag">Must-have in the readiness check</span>' : '') + '</h3>' +
      '<p class="qhint">' + esc(isFactor ? it.def : it.plain) + '</p>' +
      '<p class="qtext" id="t-' + it.id + '">' + esc(it.check) + ' <span class="rc" title="Readiness check question code">' + esc(it.rc === 'new' ? 'new question' : it.rc) + '</span></p>' +
      radios(it.id, C.ANSWERS, rec.A[it.id]) + byField(it.id) + needLine(it.id) +
      fold('more-' + it.id, isFactor ? 'What good looks like, warning signs and evidence' : 'What good looks like and evidence', more) + '</fieldset>';
  }
  function vNeeds() {
    return '<div class="stephead"><p class="kicker">Step 2 of 3</p><h2>What you need to implement AI</h2>' +
      '<p class="sub">Ten things every hotel needs before an AI tool can work, whatever the tool. The first five matter most: they are must-haves in the readiness check. Answer each for the problem you have in mind (“Don’t know yet” is fine).</p></div>' +
      '<section class="panel">' + C.NEEDS.map(function (it) { return itemBlock(it, false); }).join('') + '</section>' + sources('needs') + nav('Back', 'Next: what makes it succeed');
  }
  function vSuccess() {
    return '<div class="stephead"><p class="kicker">Step 3 of 3</p><h2>What makes it succeed</h2>' +
      '<p class="sub">Nine factors that decide whether an AI project works once it starts. Answer each (“Don’t know yet” is fine).</p></div>' +
      '<section class="panel">' + C.FACTORS.map(function (it) { return itemBlock(it, true); }).join('') + '</section>' + sources('success') + nav('Back', 'See the summary');
  }

  // ---------- summary ----------
  var ANS_WORD = { n: 'No', p: 'Partly', k: 'Don’t know yet', pl: 'Planned' };
  function canCheck() { var u = USE[rec.use]; return !!(u && !u.notTool); }
  function checkWhyNot() {
    if (rec.use === 'none') return 'You chose “None of these fits”. The readiness check looks at one specific tool, so pick a use case in step 1 (Back) to use it.';
    var u = USE[rec.use]; if (u && u.notTool) return '“' + u.n + '” is a document, not an AI tool, so the readiness check has no check for it.';
    return 'Choose a use case in step 1 to check one tool in detail.';
  }
  function checkHref() { return '../readiness-check/index.html#use=' + encodeURIComponent(rec.use); }
  function vSummary() {
    var v = L.verdict(rec.Q), name = hotelName(), A = rec.A;
    var cN = L.counts(A, L.NEED_IDS), cF = L.counts(A, L.FACTOR_IDS), ov = L.overall(A), top = L.weakest(A, 3);
    var h = '<div class="printhead"><p class="meta">Readiness 2.0 · summary · printed ' + esc(L.fmtDate(new Date().toISOString().slice(0, 10))) + '</p></div>';
    h += '<div class="stephead"><h2>Your summary' + (name ? ': ' + esc(name) : '') + '</h2><p class="sub">No score: what you said, what is missing and what to do next.</p></div>';
    h += '<section class="verdict ' + vClass(v.key) + '" id="sum-verdict" data-verdict="' + v.key + '"><p class="kicker">Is this an AI problem?</p>' + verdictBody(v, true) + '</section>';
    var u = USE[rec.use];
    h += '<section class="panel" id="sum-where"><h3>Where it sits</h3><p class="pathline">' + esc(pathText(false)) + '</p>' +
      (u ? '<p class="sub">What AI does: ' + esc(u.task) + '</p><p class="meta">How common in hotels: ' + esc(useLevel(u)) + ' (Use-Case Catalogue rating).</p>'
        : '<p class="sub">None of the catalogue’s ' + esc(CAT.nUses) + ' use cases matches your problem. That is worth telling the project team; steps 2 and 3 still apply.</p>') + '</section>';
    h += '<section class="panel" id="sum-counts"><div class="sumgrid"><div><h3>What you need (step 2)</h3><p class="countline" id="count-needs">' + esc(L.countLine(cN)) + '</p></div>' +
      '<div><h3>What makes it succeed (step 3)</h3><p class="countline" id="count-success">' + esc(L.countLine(cF)) + '</p></div></div>' +
      '<p id="overall" data-overall="' + ov.key + '"><strong>' + esc(ov.text) + '</strong></p></section>';
    if (top.length) {
      h += '<section class="panel first" id="first3"><h3>Start with these ' + (top.length === 3 ? 'three' : top.length === 2 ? 'two' : 'one') + '</h3><ol>' + top.map(function (x) {
        var a = L.action(x.id, x.v, rec.By[x.id]);
        return '<li data-item="' + x.id + '">' + esc(a.text) + '<span>' + esc(a.name + ' · your answer: ' + ANS_WORD[x.v] + ' · usually: ' + a.who) + '</span></li>';
      }).join('') + '</ol></section>';
    }
    var all = L.actions(A, rec.By);
    h += '<section class="panel" id="todo"><h3>What to do next, item by item</h3>' + (all.length ? ['needs', 'success'].map(function (step) {
      var rows = all.filter(function (a) { return a.step === step; }); if (!rows.length) return '';
      return '<p class="meta">' + (step === 'needs' ? 'What you need' : 'What makes it succeed') + '</p><div class="todo">' + rows.map(function (a) {
        return '<div class="row" data-item="' + a.id + '"><div><span class="nm">' + esc(a.name) + ' <span class="chip a-' + a.v + '">' + esc(ANS_WORD[a.v]) + '</span></span>' + esc(a.text) + '</div><span class="who">' + esc(a.who) + '</span></div>';
      }).join('') + '</div>';
    }).join('') : '<p>Everything in steps 2 and 3 is in place.</p>') + '</section>';
    h += '<section class="panel handover noprint" id="handover"><h3>Next: check one tool in detail</h3>' +
      (canCheck() ? '<p class="sub">The readiness check asks the detailed questions for “' + esc(u.n) + '” and gives a verdict and a to-do list by person.</p>' : '<p class="sub" id="check-why">' + esc(checkWhyNot()) + '</p>') +
      '<div class="btnrow">' + (canCheck() ? '<a class="btn primary" id="check-one" data-act="check-one" href="' + esc(checkHref()) + '">Check one tool in detail</a>'
        : '<button type="button" class="btn primary" id="check-one" disabled aria-describedby="check-why">Check one tool in detail</button>') +
      '<button type="button" class="btn" data-act="copy" id="copy">Copy summary</button><button type="button" class="btn" data-act="print" id="print">Print</button>' +
      '<button type="button" class="btn" data-act="restart" id="restart">Start again</button></div>' +
      (ui.copy ? '<div class="copybox" id="copybox"><label for="copytext" class="meta">Copying is blocked here. Select the text and copy it yourself:</label><textarea id="copytext" readonly>' + esc(summaryText()) + '</textarea></div>' : '') + '</section>';
    h += '<div class="navrow noprint"><button type="button" class="btn back" data-act="back" id="back">Back</button><span class="spacer"></span><button type="button" class="linkbtn" data-act="edit" id="edit">Change answers from the start</button></div>';
    return h;
  }
  /* The summary as plain text (Copy summary). */
  function summaryText() {
    var v = L.verdict(rec.Q), A = rec.A, name = hotelName(), out = [];
    out.push('Readiness 2.0: summary' + (name ? ' for ' + name : '') + ' (' + L.fmtDate(new Date().toISOString().slice(0, 10)) + ')');
    out.push('', 'Is this an AI problem? ' + (v.key === 'go' ? C.VERDICT.goDone : v.head) + (v.second ? ' ' + v.second : ''));
    v.carried.forEach(function (c) { out.push('- ' + c.text + (c.add ? ' ' + c.add : '')); });
    v.find.forEach(function (f) { out.push('- To find out: ' + f.text + ' (ask ' + f.who + ')'); });
    out.push('', 'Where it sits: ' + pathText(false));
    out.push('', 'What you need (step 2): ' + L.countLine(L.counts(A, L.NEED_IDS)));
    out.push('What makes it succeed (step 3): ' + L.countLine(L.counts(A, L.FACTOR_IDS)));
    out.push(L.overall(A).text);
    var top = L.weakest(A, 3);
    if (top.length) { out.push('', 'Start with these:'); top.forEach(function (x, i) { var a = L.action(x.id, x.v, rec.By[x.id]); out.push((i + 1) + '. ' + a.text + ' (' + a.who + ')'); }); }
    var all = L.actions(A, rec.By);
    if (all.length) { out.push('', 'What to do next, item by item:'); all.forEach(function (a) { out.push('- ' + a.name + ' [' + ANS_WORD[a.v] + ']: ' + a.text + ' (' + a.who + ')'); }); }
    out.push('', 'Student prototype by EHL SBP Group 36 for HFTP, not legal advice. Content as of ' + C.AS_OF + '.');
    return out.join('\n');
  }
  function copySummary() {
    var t = summaryText();
    function fallback() { ui.copy = true; render(); var ta = $('copytext'); if (ta) { ta.focus(); ta.select(); } }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast('Summary copied.'); }, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }
  var toastT;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 3500); }

  // ---------- render ----------
  var VIEWS = { start: vStart, q: vQ, stop: vStop, where: vWhere, needs: vNeeds, success: vSuccess, summary: vSummary };
  function render() {
    var a = document.activeElement, keep = a && a.id && a !== document.body ? a.id : null;
    $('app').setAttribute('data-state', rec.step);
    $('app').setAttribute('data-verdict', L.verdict(rec.Q).key);
    $('hdr').innerHTML = header();
    $('view').innerHTML = confirmBox() + VIEWS[rec.step]();
    if (keep && $(keep) && keep !== 'view') $(keep).focus({ preventScroll: true });
  }

  // ---------- events ----------
  function onClick(e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.getAttribute('data-act');
    if (act === 'cat') send('cat', t.getAttribute('data-cat'));
    else if (act === 'dept') send('dept', t.getAttribute('data-dept'));
    else if (act === 'copy') copySummary();
    else if (act === 'print') window.print();
    else if (act === 'check-one') {
      if (!canCheck()) { e.preventDefault(); return; }
      if (IN_HUB) { e.preventDefault(); try { window.parent.postMessage({ hub: 'open', tool: 'readiness-check', hash: 'use=' + rec.use }, location.origin); } catch (err) { location.href = checkHref(); } }
    } else if (act === 'catalogue') {
      if (IN_HUB) { e.preventDefault(); try { window.parent.postMessage({ hub: 'open', tool: 'use-case-catalogue', hash: t.getAttribute('data-dept') }, location.origin); } catch (err) { /* ignore */ } }
    } else send(act);
  }
  document.addEventListener('click', onClick);
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('input[data-answer]')) send('answer', { id: t.getAttribute('data-answer'), value: t.value });
    else if (t.matches('input[data-use]')) send('use', t.value);
    else if (t.matches('input[data-by]')) send('by', { id: t.getAttribute('data-by'), date: t.value || '' });
  });
  document.addEventListener('toggle', function (e) { var d = e.target; if (d && d.getAttribute && d.getAttribute('data-fold')) ui.open[d.getAttribute('data-fold')] = d.open; }, true);
  window.addEventListener('popstate', function (e) { var s = e.state && typeof e.state.r2 === 'string' ? e.state.r2 : 'start'; send('pop', s); });
  /* Another tab of this browser changed the saved record: follow it, so two tabs never overwrite each other silently. */
  window.addEventListener('storage', function (e) { if (e.key !== F.KEY) return; var r = load(); if (r) { rec = r; ui.confirm = null; ui.missing = null; render(); } });

  try { history.replaceState({ r2: rec.step }, ''); } catch (e) { /* ignore */ }
  render();

  /* AX: read the state without scraping the page; drive it with the same events the buttons send. */
  window.Readiness2 = {
    state: function () {
      var v = L.verdict(rec.Q), c = ctx();
      return { step: rec.step, Q: Object.assign({}, rec.Q), verdict: v.key, carried: v.carried.map(function (x) { return x.id; }), find: v.find.map(function (x) { return x.id; }),
        cat: rec.cat, dept: rec.dept, use: rec.use, A: Object.assign({}, rec.A), By: Object.assign({}, rec.By), ctx: c, events: F.events(rec.step, c),
        confirm: ui.confirm, missing: ui.missing, copyBox: ui.copy, storage: storage, inHub: IN_HUB, canCheck: canCheck(),
        counts: rec.step === 'summary' ? { needs: L.counts(rec.A, L.NEED_IDS), success: L.counts(rec.A, L.FACTOR_IDS) } : null,
        weakest: rec.step === 'summary' ? L.weakest(rec.A, 3).map(function (x) { return x.id; }) : null };
    },
    record: function () { return JSON.parse(JSON.stringify(rec)); },
    send: send,
    summaryText: summaryText,
    catalogue: { uses: CAT.nUses, depts: CAT.nDepts }
  };
})();
