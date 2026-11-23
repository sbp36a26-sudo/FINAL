/* AI starting point (folder, tool id and storage key keep the name readiness-2): the page. State machines and the record live in src/flow.js (R2Flow), rules in src/logic.js (R2Logic),
   words in src/content.js (R2Content). This file only draws the current state and turns clicks into send(event).
   rec = the record (saved in localStorage['hftp-readiness2-v1']); ui = what is on screen now, never saved:
     confirm  CONFIRM machine: null | 'restart'
     missing  after a refused "Next": the id of the first unanswered question ('where' on step 1b), outlined; else null
     copy     true while the copy box (clipboard fallback) is open
     open     which folded explanations are open (kept across re-renders)
     dl       DOWNLOAD machine (F.dlNext): 'idle' | 'making' | 'waiting' | 'saving'; the PDF buttons are disabled unless 'idle'
     notice   v1.2: 'useChanged' after a restore whose use case moved in the catalogue (cleared by a pick or by moving on); else null
   host.state = BRIDGE machine (F.bridgeNext): 'none' | 'pending' | 'yes' | 'no' (does the hub bar save files for us?)
   host.pong  v1.2 (clean-up L4): true once the hub bar has answered our ping. Only then do links become hub messages; a page
              framed by anything else (no pong) keeps plain links, so a click is never lost.
   storage    v1.2 (clean-up M3, L2): 'ok' | 'blocked' (nothing can be kept: shown on every screen) | 'newer' (saved by a newer
              version: shown, never written over)
   hist       v1.2 HISTORY machine (F.histAction): { d, prev, len } of the current Back/forward entry */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var C = window.R2Content, L = window.R2Logic, F = window.R2Flow, P = window.R2Pdf;
  var D, CAT;
  try { D = JSON.parse($('r2-data').textContent); CAT = D.cat; }
  catch (e) { $('app').setAttribute('data-state', 'error'); $('view').innerHTML = '<p class="panel" role="alert">The catalogue data in this page could not be read. Reload the page; if this stays, tell the project team the page needs rebuilding.</p>'; throw e; }
  var USE = {}, DEPT = {};
  CAT.depts.forEach(function (d) { DEPT[d.id] = d; d.uses.forEach(function (u) { USE[u.id] = Object.assign({ dept: d }, u); }); });
  var IN_FRAME = window.parent !== window; // framed; whether by the hub is known only after its pong (host.pong)
  /* A parent on another origin cannot be the hub (it is served next to this page): no ping, plain links and plain downloads.
     location.ancestorOrigins exists in Chromium and Safari; elsewhere the 12 s ping timeout decides. */
  var FOREIGN_PARENT = IN_FRAME && (function () { try { var a = location.ancestorOrigins; return !!(a && a.length && a[0] !== location.origin); } catch (e) { return false; } })();
  var PROFILE = 'hftp-hotel-profile-v1';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function plural(n, a, b) { return n + ' ' + (n === 1 ? a : (b || a + 's')); }

  // ---------- storage (versioned record, see F.migrate) ----------
  var storage = 'ok'; // 'ok' | 'blocked' (private window, blocked site data: the page still works, nothing is kept) | 'newer'
  var loadInfo = {};
  function load() {
    var s, info = {};
    try { s = localStorage.getItem(F.KEY); } catch (e) { storage = 'blocked'; return null; } // storage itself refused
    if (!s) return null;
    var raw; try { raw = JSON.parse(s); } catch (e) { return null; } // corrupt: start fresh, the first save replaces it
    var r = F.migrate(raw, CAT, info); loadInfo = info;
    if (r && info.newer) storage = 'newer'; // clean-up L2: show it, never save over it
    return r;
  }
  function save() {
    if (storage === 'newer') return;
    try { var r = JSON.parse(JSON.stringify(rec)); r.updated = new Date().toISOString(); localStorage.setItem(F.KEY, JSON.stringify(r)); storage = 'ok'; }
    catch (e) { storage = 'blocked'; }
  }
  function hotelName() { try { var p = JSON.parse(localStorage.getItem(PROFILE) || 'null'); return p && typeof p.name === 'string' ? p.name.trim().slice(0, 120) : ''; } catch (e) { return ''; } }

  var rec = load() || F.blank();
  var ui = { confirm: null, missing: null, copy: false, open: {}, dl: 'idle', notice: loadInfo.useChanged ? 'useChanged' : null };
  function ctx() { return F.ctxOf(rec, CAT); }

  // ---------- send: the only way anything changes ----------
  function firstOpen(step) {
    if (step === 'q') return F.QIDS.filter(function (id) { return !L.Q_OK[rec.Q[id]]; })[0] || null;
    if (step === 'where') return ctx().whereDone ? null : 'where';
    var ids = step === 'needs' ? C.NEEDS.map(function (x) { return x.id; }) : step === 'success' ? F.FACTOR_IDS : [];
    return ids.filter(function (id) { return !L.A_OK[rec.A[id]]; })[0] || null;
  }
  // ---------- HISTORY machine (F.histAction): the only writer of history entries ----------
  var hist = (function () { var h = F.histRead(history.state); return { d: h.ours ? h.d : 0, prev: h.ours && h.step === rec.step ? h.prev : null, len: history.length }; })();
  function histWrite(act, entry) {
    try {
      if (act === 'back') history.back(); // its popstate brings an entry of the step we already show: no change
      else history[act === 'push' ? 'pushState' : 'replaceState'](entry, '');
    } catch (e) { /* sandboxed: steps just do not join Back/forward */ }
    if (act !== 'back') { hist.d = entry.d; hist.prev = entry.prev; }
    else { hist.d = Math.max(0, hist.d - 1); hist.prev = null; }
    hist.len = history.length;
  }
  function histMove(ev, from) {
    var act = F.histAction(ev, hist, rec.step, history.length);
    histWrite(act, act === 'back' ? null : F.histEntry(act, hist, rec.step, from));
  }
  function histAssert() { histWrite('replace', { r2: rec.step, d: hist.d, prev: hist.prev }); }

  function send(ev, arg) {
    var prev = rec.step, c;
    if (ev === 'restart') { c = F.confirmNext(ui.confirm, 'ask'); ui.confirm = c.c; render(); var y = $('restart-yes'); if (y) y.focus(); return true; }
    if (ev === 'restart-no') { ui.confirm = F.confirmNext(ui.confirm, 'no').c; render(); return true; }
    if (ev === 'restart-yes') {
      c = F.confirmNext(ui.confirm, 'yes'); ui.confirm = c.c;
      if (!c.fire) { render(); return false; }
      var rr = F.reduce(rec, 'restart', null, CAT); if (!rr.ok) { render(); return false; }
      rec = rr.rec; ui.open = {}; afterMove(prev, 'restart'); return true;
    }
    if (ev === 'next' && F.flowNext(rec.step, 'next', ctx()) === null) {
      /* Refused "Next": point at the first open question (Q1 No always goes on to the stop screen, so never here). */
      ui.missing = firstOpen(rec.step); render();
      var m = document.querySelector('.missing'); if (m) { m.scrollIntoView({ block: 'center' }); var f = m.querySelector('input'); if (f) f.focus({ preventScroll: true }); }
      return false;
    }
    var r = F.reduce(rec, ev, arg, CAT);
    if (ev === 'pop') {
      rec = r.rec;
      /* Placed elsewhere than the entry says (Q1 changed, answers missing): the entry is corrected, and its "previous step" forgotten. */
      if (!r.ok) histWrite('replace', { r2: rec.step, d: hist.d, prev: null });
      afterMove(prev, null); return r.ok;
    }
    if (!r.ok) return false;
    rec = r.rec;
    if (rec.step !== prev) { afterMove(prev, ev); return true; }
    if (ev === 'use') ui.notice = null;
    if (ui.missing && (ev === 'answer' || ev === 'use')) ui.missing = firstOpen(rec.step) === ui.missing ? ui.missing : null;
    save(); render();
    return true;
  }
  /* ev: the FLOW event that moved the step (written into history by the HISTORY machine), or null for a pop (already in history). */
  function afterMove(prev, ev) {
    ui.confirm = F.confirmNext(ui.confirm, 'nav').c; ui.missing = null; ui.copy = false;
    if (rec.step !== prev) ui.notice = rec.step === 'where' ? ui.notice : null;
    if (ev && rec.step !== prev) histMove(ev, prev);
    save(); render();
    if (rec.step !== prev) { window.scrollTo(0, 0); $('view').focus({ preventScroll: true }); }
  }

  // ---------- pieces ----------
  var NAME = 'AI starting point'; // v1.2 (owner B1): the visible name
  var STEP_LINE = { q: ['Step 1 of 3', 'Is this an AI problem?'], stop: ['Result', 'Not suitable for AI'], where: ['Step 1 of 3', 'Where in the hotel?'],
    needs: ['Step 2 of 3', 'What you need'], success: ['Step 3 of 3', 'What makes it succeed'], summary: ['Summary', ''] };
  /* Storage notices (v1.2, clean-up M3 and L2): on every screen while they apply. */
  function storeLine() {
    if (storage === 'blocked') return '<p class="savewarn" id="not-saved" role="status">' + esc(C.NOT_SAVED) + '</p>';
    if (storage === 'newer') return '<p class="savewarn" id="not-saved" role="status">' + esc(C.NEWER) + '</p>';
    return '';
  }
  function header() {
    if (rec.step === 'start') {
      return '<div class="hdrtop"><p class="meta">A student project by EHL for HFTP · prototype</p></div><h1>' + esc(NAME) + '</h1>' +
        '<p class="sub"><strong>Start here: is AI the answer, and where?</strong></p>' +
        '<p class="meta honest" id="honest">' + esc(C.HONEST) + '</p>' + storeLine();
    }
    var s = STEP_LINE[rec.step], pr = F.progress(rec.step); // clean-up L3: the current step is 'now'
    var bar = pr ? '<div class="steps3" aria-hidden="true">' + pr.map(function (c) { return '<span class="' + c + '"></span>'; }).join('') + '</div>' : '';
    return '<div class="hdrtop"><p class="hdrline"><strong>' + esc(NAME) + '</strong> · ' + esc(s[0]) + (s[1] ? ' · ' + esc(s[1]) : '') + '</p>' +
      (rec.step === 'stop' ? '' : '<button type="button" class="linkbtn" data-act="restart" id="restart-top">Start again</button>') + '</div>' + bar + storeLine(); // the stop screen has its own buttons only
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
    var t = L.verdictText(v, onSummary); // the same words as Copy summary and the PDF
    var h = '<p class="vsent" id="verdict-head">' + esc(t.head) + '</p>' + (t.second ? '<p><strong>' + esc(t.second) + '</strong></p>' : '');
    if (t.carried.length) h += '<div><p><strong>' + esc(t.carriedLabel) + '</strong></p><ul>' + t.carried.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>';
    if (t.find.length) h += '<div><p><strong>To find out</strong></p><ul>' + t.find.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>';
    if (t.q1Unsure) h += '<p>' + esc(t.q1Unsure) + '</p>';
    return h;
  }

  // ---------- screens ----------
  function vStart() {
    return '<section class="panel"><h2>Three steps, then a summary</h2><ol class="journey">' +
      '<li><b>Where is the problem?</b><span>Five yes/no questions: is AI the right kind of tool for it? Then find where it sits in your hotel among ' + esc(CAT.nUses + ' use cases in ' + CAT.nDepts + ' departments') + '.</span></li>' +
      '<li><b>What you need to implement AI</b><span>Ten things every hotel needs in place, such as systems that can talk to each other and the data protection paperwork.</span></li>' +
      '<li><b>What makes it succeed</b><span>Nine factors, from budget and leadership to change management.</span></li></ol>' +
      '<p class="sub">The summary has no score. It shows what is in place, the three weakest points and what to do next.' + (storage === 'ok' ? ' Your answers stay in this browser.' : '') + '</p>' +
      '<div class="navrow"><button type="button" class="btn primary" data-act="begin" id="begin">Start</button></div></section>';
  }
  function vQ() {
    var v = L.verdict(rec.Q), h = '<div class="stephead"><p class="kicker">Step 1 · Part 1 of 2</p><h2>Is this an AI problem?</h2>' +
      '<p class="sub">Think of one problem in your hotel. Five questions; each Yes points towards AI. If you are not sure, say so: it becomes something to find out.</p></div>';
    h += '<section class="panel">' + C.QUESTIONS.map(function (q, i) {
      return '<fieldset class="qa' + (ui.missing === q.id ? ' missing' : '') + '" id="f-' + q.id + '" aria-labelledby="t-' + q.id + '"><div class="qrow"><span class="qno" aria-hidden="true">' + (i + 1) + '</span><div class="qbody">' +
        '<p class="qtext" id="t-' + q.id + '">' + esc(q.q) + '</p>' + (q.hint ? '<p class="qhint">' + esc(q.hint) + '</p>' : '') +
        (q.guard ? '<p class="qhint qguard" id="guard-' + q.id + '">' + esc(q.guard) + '</p>' : '') +
        radios(q.id, C.Q_ANSWERS, rec.Q[q.id]) + needLine(q.id) +
        fold('why-' + q.id, 'Why this matters', '<p class="whyshort" id="whyshort-' + q.id + '"><strong>' + esc(q.whyShort) + '</strong></p><p>' + esc(q.why) + '</p><p><b>Yes, for example:</b> ' + esc(q.yes) + '</p><p><b>No, for example:</b> ' + esc(q.no) + '</p>') +
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
      '<p>' + esc(C.STOP.why) + '</p><p><strong>' + esc(C.STOP.instead) + '</strong></p><p id="stop-unsure">' + esc(C.STOP.unsure) + '</p>' +
      '<p class="meta">Because you answered No to: “' + esc(q1.q) + '”</p>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="change" id="change">Change my answers</button><button type="button" class="btn" data-act="restart" id="restart">Start again</button>' +
      pdfButton('Download (PDF)') + '</div></section>' + sources('q');
  }
  var useLevel = L.useLevel;
  function catLink(d) {
    return '<a href="../use-case-catalogue/index.html#' + esc(d.id) + '" data-act="catalogue" data-dept="' + esc(d.id) + '"' + (host.pong ? '' : ' target="_blank" rel="noopener"') + '>Sources in the Use-Case Catalogue</a>';
  }
  function vWhere() {
    var h = '<div class="stephead"><p class="kicker">Step 1 · Part 2 of 2</p><h2>Where in the hotel?</h2>' +
      '<p class="sub">Pick the area, then the department. If one of its use cases matches your problem, choose it. If none does, say so: steps 2 and 3 still apply.</p>' +
      '<p class="meta">' + esc(CAT.nUses + ' use cases in ' + CAT.nDepts + ' departments, from the hub’s Use-Case Catalogue.') + '</p></div>' +
      (ui.notice === 'useChanged' ? '<p class="savewarn" id="use-changed" role="status">' + esc(C.USE_CHANGED) + '</p>' : '');
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
  function pathParts() { return L.pathParts(rec, CAT); }
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
    var w = L.itemText(it.id, rec); // v1.3: b1/b2 name the systems by the department chosen in step 1b
    var more = isFactor
      ? '<p><b>What it means:</b> ' + esc(it.def) + '</p><p><b>What good looks like:</b> ' + esc(it.good) + '</p><div><b>Warning signs</b><ul>' + it.warn.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>'
      : '<p><b>What good looks like:</b> ' + esc(w.good) + '</p>' + (it.also.length ? '<div><b>The readiness check also asks</b><ul>' + it.also.map(function (a) { return '<li>' + esc(a[1]) + '</li>'; }).join('') + '</ul></div>' : ''); // v1.2: question codes hidden (kept in content.js)
    more += evidence(it.ev);
    /* Owner, 23 Nov 2026: only the question shows; the explanation, examples, glosses and evidence notes sit in the fold. */
    var lead = (it.weak ? '<p class="weak" id="weak-' + it.id + '">' + esc(it.weak) + '</p>' : '') +
      (isFactor ? '' : '<p><b>What it means:</b> ' + esc(w.plain) + '</p>') +
      (w.ex ? '<p class="qex" id="ex-' + it.id + '">' + esc(w.ex) + '</p>' : '') + glossP(it.id, w.gloss);
    return '<fieldset class="qa' + (ui.missing === it.id ? ' missing' : '') + '" id="f-' + it.id + '" aria-labelledby="t-' + it.id + '">' +
      '<p class="itemname">' + esc(it.name) + '</p>' +
      '<p class="qtext" id="t-' + it.id + '">' + esc(w.check) + '</p>' +
      radios(it.id, C.ANSWERS, rec.A[it.id]) + byField(it.id) + needLine(it.id) +
      fold('more-' + it.id, 'More: what it means, examples and evidence', lead + more) + '</fieldset>';
  }
  function glossP(id, g) { return g ? '<p class="gloss" id="gloss-' + id + '">' + esc(g) + '</p>' : ''; }
  function vNeeds() {
    return '<div class="stephead"><p class="kicker">Step 2 of 3</p><h2>What you need to implement AI</h2>' +
      '<p class="sub">Ten things every hotel needs before an AI tool can work, whatever the tool. Answer each for the problem you have in mind (“Don’t know yet” is fine).</p></div>' +
      '<section class="panel">' + C.NEEDS.map(function (it) { return itemBlock(it, false); }).join('') + '</section>' + sources('needs') + nav('Back', 'Next: what makes it succeed');
  }
  function vSuccess() {
    return '<div class="stephead"><p class="kicker">Step 3 of 3</p><h2>What makes it succeed</h2>' +
      '<p class="sub">Nine factors that decide whether an AI project works once it starts. Answer each (“Don’t know yet” is fine).</p></div>' +
      '<section class="panel">' + C.FACTORS.map(function (it) { return itemBlock(it, true); }).join('') + '</section>' + sources('success') + nav('Back', 'See the summary');
  }

  // ---------- summary ----------
  var ANS_WORD = L.ANS_WORD;
  function canCheck() { var u = USE[rec.use]; return !!(u && !u.notTool); }
  function handover() { return L.handover(rec, USE[rec.use]); }
  function checkHref() { var h = handover(); return '../readiness-check/index.html' + (h.mode === 'use' ? '#use=' + encodeURIComponent(rec.use) : ''); }
  function vSummary() {
    var v = L.verdict(rec.Q), name = hotelName(), A = rec.A;
    var cN = L.counts(A, L.NEED_IDS), cF = L.counts(A, L.FACTOR_IDS), ov = L.overall(A), top = L.weakest(A, 3);
    var h = '<div class="printhead"><p class="meta">' + esc(NAME) + ' · summary · printed ' + esc(L.fmtDate(L.localIso())) + '</p></div>';
    h += '<div class="stephead"><h2>Your summary' + (name ? ': ' + esc(name) : '') + '</h2><p class="sub">No score: what you said, what is missing and what to do next.</p></div>';
    h += '<section class="verdict ' + vClass(v.key) + '" id="sum-verdict" data-verdict="' + v.key + '"><p class="kicker">Is this an AI problem?</p>' + verdictBody(v, true) + '</section>';
    var u = USE[rec.use];
    h += '<section class="panel" id="sum-where"><h3>Where it sits</h3><p class="pathline">' + esc(pathText(false)) + '</p>' +
      (u ? '<p class="sub">What AI does: ' + esc(u.task) + '</p><p class="meta">How common in hotels: ' + esc(useLevel(u)) + ' (Use-Case Catalogue rating).</p>'
        : '<p class="sub">' + esc(L.noneLine(CAT.nUses)) + '</p>') + '</section>';
    h += '<section class="panel" id="sum-counts"><div class="sumgrid"><div><h3>What you need (step 2)</h3><p class="countline" id="count-needs">' + esc(L.countLine(cN)) + '</p></div>' +
      '<div><h3>What makes it succeed (step 3)</h3><p class="countline" id="count-success">' + esc(L.countLine(cF)) + '</p></div></div>' +
      '<p id="overall" data-overall="' + ov.key + '"><strong>' + esc(ov.text) + '</strong></p></section>';
    if (top.length) {
      h += '<section class="panel first" id="first3"><h3>' + esc(L.firstLabel(top.length)) + '</h3><ol>' + top.map(function (x) {
        var a = L.action(x.id, x.v, rec.By[x.id], rec);
        return '<li data-item="' + x.id + '">' + esc(a.text) + '<span>' + esc(a.name + ' · your answer: ' + ANS_WORD[x.v] + ' · usually: ' + a.who) + '</span></li>';
      }).join('') + '</ol></section>';
    }
    var all = L.actions(A, rec.By, null, rec);
    h += '<section class="panel" id="todo"><h3>What to do next, item by item</h3>' + (all.length ? ['needs', 'success'].map(function (step) {
      var rows = all.filter(function (a) { return a.step === step; }); if (!rows.length) return '';
      return '<p class="meta">' + (step === 'needs' ? 'What you need' : 'What makes it succeed') + '</p><div class="todo">' + rows.map(function (a) {
        return '<div class="row" data-item="' + a.id + '"><div><span class="nm">' + esc(a.name) + ' <span class="chip a-' + a.v + '">' + esc(ANS_WORD[a.v]) + '</span></span>' + esc(a.text) + '</div><span class="who">' + esc(a.who) + '</span></div>';
      }).join('') + '</div>';
    }).join('') : '<p>Everything in steps 2 and 3 is in place.</p>') + '</section>';
    var ho = handover(); // v1.2: 'use' | 'search' ("None of these fits": the readiness check's start screen) | 'blocked'
    h += '<section class="panel handover noprint" id="handover" data-handover="' + ho.mode + '"><h3>Next: check one tool in detail</h3>' +
      '<p class="sub" id="check-why">' + esc(ho.text) + '</p>' +
      (ho.mode !== 'blocked' ? '<p class="meta" id="carry-note">' + esc(L.HANDOVER_NOTE) + '</p>' : '') +
      '<div class="btnrow">' + (ho.mode !== 'blocked' ? '<a class="btn primary" id="check-one" data-act="check-one" href="' + esc(checkHref()) + '">' + esc(ho.label) + '</a>'
        : '<button type="button" class="btn primary" id="check-one" disabled aria-describedby="check-why">' + esc(ho.label) + '</button>') +
      pdfButton('Download the assessment (PDF)') + '<button type="button" class="btn" data-act="copy" id="copy">Copy summary</button><button type="button" class="btn" data-act="print" id="print">Print</button>' +
      '<button type="button" class="btn" data-act="restart" id="restart">Start again</button></div>' +
      (ui.copy ? '<div class="copybox" id="copybox"><label for="copytext" class="meta">Copying is blocked here. Select the text and copy it yourself:</label><textarea id="copytext" readonly>' + esc(summaryText()) + '</textarea></div>' : '') + '</section>';
    h += '<div class="navrow noprint"><button type="button" class="btn back" data-act="back" id="back">Back</button><span class="spacer"></span><button type="button" class="linkbtn" data-act="edit" id="edit">Change answers from the start</button></div>';
    return h;
  }
  /* The summary as plain text (Copy summary). */
  function summaryText() {
    var v = L.verdict(rec.Q), A = rec.A, name = hotelName(), out = [];
    out.push(NAME + ': summary' + (name ? ' for ' + name : '') + ' (' + L.fmtDate(L.localIso()) + ')');
    out.push('', 'Is this an AI problem? ' + (v.key === 'go' ? C.VERDICT.goDone : v.head) + (v.second ? ' ' + v.second : ''));
    v.carried.forEach(function (c) { out.push('- ' + c.text + (c.add ? ' ' + c.add : '')); });
    v.find.forEach(function (f) { out.push('- To find out: ' + f.text + ' (ask ' + f.who + ')'); });
    out.push('', 'Where it sits: ' + pathText(false));
    out.push('', 'What you need (step 2): ' + L.countLine(L.counts(A, L.NEED_IDS)));
    out.push('What makes it succeed (step 3): ' + L.countLine(L.counts(A, L.FACTOR_IDS)));
    out.push(L.overall(A).text);
    var top = L.weakest(A, 3);
    if (top.length) { out.push('', 'Start with these:'); top.forEach(function (x, i) { var a = L.action(x.id, x.v, rec.By[x.id], rec); out.push((i + 1) + '. ' + a.text + ' (' + a.who + ')'); }); }
    var all = L.actions(A, rec.By, null, rec);
    if (all.length) { out.push('', 'What to do next, item by item:'); all.forEach(function (a) { out.push('- ' + a.name + ' [' + ANS_WORD[a.v] + ']: ' + a.text + ' (' + a.who + ')'); }); }
    var ho = handover(); out.push('', 'Next step: ' + ho.text + (ho.mode !== 'blocked' ? ' ' + L.HANDOVER_NOTE : ''));
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

  // ---------- PDF download (the readiness check's way: hub bridge, plain link outside the hub) ----------
  var DL_LABEL = { making: 'Preparing the PDF…', waiting: 'Preparing the PDF…', saving: 'Saving the PDF…' };
  function pdfButton(label) {
    var busy = ui.dl !== 'idle';
    return '<button type="button" class="btn" data-act="pdf" id="pdf"' + (busy ? ' disabled aria-busy="true"' : '') + '>' + esc(busy ? DL_LABEL[ui.dl] : label) + '</button>';
  }
  function dlSend(ev) {
    var to = F.dlNext(ui.dl, ev, host.state); if (to === null) return false;
    ui.dl = to; $('app').setAttribute('data-dl', to);
    var b = $('pdf'); if (b) { b.disabled = to !== 'idle'; if (to !== 'idle') { b.setAttribute('aria-busy', 'true'); b.textContent = DL_LABEL[to]; } else render(); }
    return true;
  }
  /* BRIDGE machine (F.bridgeNext). Each download sent to the hub is in flight until its 'download-result', or 2 minutes
     (the hub may be showing the person a save dialog), which arrives as a 'fail' event. */
  var host = { state: IN_FRAME && !FOREIGN_PARENT ? 'pending' : 'none', pong: false, waiters: [], seq: 0, calls: {} };
  function hostSend(ev) {
    var to = F.bridgeNext(host.state, ev); if (to === host.state) return;
    host.state = to; $('app').setAttribute('data-bridge', to); host.waiters.splice(0).forEach(function (f) { f(); });
  }
  $('app').setAttribute('data-bridge', host.state); $('app').setAttribute('data-dl', ui.dl);
  if (host.state === 'pending') {
    window.addEventListener('message', function (e) {
      if (e.source !== window.parent || !e.data) return;
      var m = e.data;
      if (m.hub === 'pong') { var first = !host.pong; host.pong = true; hostSend(m.downloads ? 'yes' : 'no'); if (first) render(); } // links become hub messages
      else if (m.hub === 'download-result' && host.calls[m.id]) { var cb = host.calls[m.id]; delete host.calls[m.id]; cb(m); }
    });
    try { window.parent.postMessage({ hub: 'ping' }, location.origin); } catch (e) { hostSend('error'); }
    setTimeout(function () { hostSend('timeout'); }, 12000);
  }
  function saveFile(name, blob) {
    function viaLink() {
      try { var u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); toast('Download started: ' + name); dlSend('done'); }
      catch (e) { toast('This browser could not save the file.'); dlSend('fail'); }
    }
    function go2() {
      dlSend('bridge');
      if (host.state !== 'yes') { viaLink(); return; }
      var id = 'r2d' + (++host.seq), t = setTimeout(function () { if (host.calls[id]) host.calls[id]({ ok: false, code: 'timeout' }); delete host.calls[id]; }, 120000);
      host.calls[id] = function (m) {
        clearTimeout(t);
        toast(m.ok ? 'Saved ' + name : m.code === 'declined' ? 'Download cancelled.' : m.code === 'timeout' ? 'No answer about the download. Try again.' : 'The file could not be saved here.');
        dlSend(m.ok ? 'done' : 'fail');
      };
      try { window.parent.postMessage({ hub: 'download', id: id, filename: name, data: blob }, location.origin); }
      catch (e) { var cb = host.calls[id]; delete host.calls[id]; cb({ ok: false, code: 'unavailable' }); }
    }
    if (host.state === 'pending') { toast('Preparing the download…'); host.waiters.push(go2); } else go2();
  }
  var PDF_FONT = null;
  function pdfFont() { return PDF_FONT || (PDF_FONT = (function () { try { return JSON.parse($('r2-font').textContent); } catch (e) { return null; } })()); }
  function todayIso() { return L.localIso(); } // v1.2: the local day (was UTC)
  /* Click → 'making' at once (the button is disabled and says so), then the PDF is built on the next task, so a double
     click finds the machine busy and is refused: one download at a time. */
  function downloadPdf() {
    if (rec.step !== 'summary' && rec.step !== 'stop') return false;
    if (!dlSend('start')) { toast('The PDF is still being prepared.'); return false; }
    var model = P.model(rec, CAT, { hotel: hotelName(), today: todayIso() }), name = P.fileName(hotelName(), todayIso());
    setTimeout(function () {
      var blob;
      try {
        if (!window.jspdf) throw new Error('jsPDF not bundled');
        blob = P.draw(model, window.jspdf, pdfFont()).doc.output('blob');
      } catch (e) { dlSend('fail'); toast('The PDF could not be made here. Use “Copy summary” or “Print” instead.'); return; }
      dlSend('made'); saveFile(name, blob);
    }, 30);
    return true;
  }

  // ---------- render ----------
  var VIEWS = { start: vStart, q: vQ, stop: vStop, where: vWhere, needs: vNeeds, success: vSuccess, summary: vSummary };
  function render() {
    var a = document.activeElement, keep = a && a.id && a !== document.body ? a.id : null;
    $('app').setAttribute('data-state', rec.step);
    $('app').setAttribute('data-verdict', L.verdict(rec.Q).key);
    $('app').setAttribute('data-storage', storage);
    var fk = $('foot-keep'); if (fk) fk.hidden = storage !== 'ok'; // "Your answers stay in this browser" only when they do
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
    else if (act === 'pdf') { if (!t.disabled) downloadPdf(); }
    else if (act === 'check-one') {
      var ho = handover();
      if (ho.mode === 'blocked' || rec.step !== 'summary') { e.preventDefault(); return; }
      /* Hub message only once the hub has answered (clean-up L4); else the plain link does it. 'search' sends no hash: the start screen. */
      if (host.pong) { e.preventDefault(); try { window.parent.postMessage(ho.hash ? { hub: 'open', tool: 'readiness-check', hash: ho.hash } : { hub: 'open', tool: 'readiness-check' }, location.origin); } catch (err) { location.href = checkHref(); } }
    } else if (act === 'catalogue') {
      if (host.pong) { e.preventDefault(); try { window.parent.postMessage({ hub: 'open', tool: 'use-case-catalogue', hash: t.getAttribute('data-dept') }, location.origin); } catch (err) { window.open(t.getAttribute('href'), '_blank', 'noopener'); } }
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
  /* Back/forward. Our own entry → pop to its step. Anything else (a hash change: state null; a hub entry) is not ours: the step
     stays and the entry is marked as ours (clean-up M1: it used to send the person to the start screen, and save that). */
  window.addEventListener('popstate', function (e) {
    var h = F.histRead(e.state);
    if (!h.ours) { hist.d += 1; hist.prev = rec.step; histAssert(); return; }
    hist.d = h.d; hist.prev = h.prev; hist.len = history.length;
    send('pop', h.step);
  });
  /* Another tab of this browser changed the saved record: follow it, so two tabs never overwrite each other silently.
     v1.2 (clean-up L5): the history entry follows too, and a page restored from the back-forward cache re-reads the record. */
  function follow() { var r = load(); if (!r) return; rec = r; ui.confirm = null; ui.missing = null; ui.notice = loadInfo.useChanged ? 'useChanged' : null; hist.prev = null; histAssert(); render(); }
  window.addEventListener('storage', function (e) { if (e.key === F.KEY) follow(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) follow(); });

  histAssert();
  render();

  /* AX: read the state without scraping the page; drive it with the same events the buttons send. */
  window.Readiness2 = {
    state: function () {
      var v = L.verdict(rec.Q), c = ctx();
      return { handover: rec.step === 'summary' ? handover().mode : null, notice: ui.notice, history: { d: hist.d, prev: hist.prev }, step: rec.step, Q: Object.assign({}, rec.Q), verdict: v.key, carried: v.carried.map(function (x) { return x.id; }), find: v.find.map(function (x) { return x.id; }),
        cat: rec.cat, dept: rec.dept, use: rec.use, A: Object.assign({}, rec.A), By: Object.assign({}, rec.By), ctx: c, events: F.events(rec.step, c),
        confirm: ui.confirm, missing: ui.missing, copyBox: ui.copy, storage: storage, inHub: host.pong, inFrame: IN_FRAME, canCheck: canCheck(), download: ui.dl, bridge: host.state,
        counts: rec.step === 'summary' ? { needs: L.counts(rec.A, L.NEED_IDS), success: L.counts(rec.A, L.FACTOR_IDS) } : null,
        weakest: rec.step === 'summary' ? L.weakest(rec.A, 3).map(function (x) { return x.id; }) : null };
    },
    record: function () { return JSON.parse(JSON.stringify(rec)); },
    send: send,
    summaryText: summaryText,
    pdfModel: function () { return P.model(rec, CAT, { hotel: hotelName(), today: todayIso() }); },
    pdfName: function () { return P.fileName(hotelName(), todayIso()); },
    catalogue: { uses: CAT.nUses, depts: CAT.nDepts }
  };
})();
