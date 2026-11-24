/* Do you need AI? v2 (folder, tool id and storage key keep the name readiness-2): the page.
   State machines and the store live in src/flow.js (R2Flow), rules in src/logic.js (R2Logic), words in src/content.js (R2Content).
   This file only draws the current state and turns clicks into send(event).
   store = everything saved (localStorage['hftp-readiness2-v1'], version 2): the checks of this browser and which one is open.
   rec   = the open check (F.cur(store)).
   ui    = what is on screen now, never saved:
     confirm  CONFIRM machine (F.confirmNext): null | { kind: 'remove', id } | { kind: 'file' }
     missing  after a refused "Next": the id of the first unanswered question ('type' on step 1, 'where' on step 4), outlined; else null
     copy     true while the copy box (clipboard fallback) is open; copyText: what it shows
     open     which folded explanations are open (kept across re-renders)
     explain  the use case whose "What does this do?" panel is open on step 4 (v2.2), or null; one at a time, kept across re-renders
     dl       DOWNLOAD machine (F.dlNext): 'idle' | 'making' | 'waiting' | 'saving'
     share    SHARE machine (F.shareNext) while a copy is being sent or withdrawn: { phase, id }; else null (settled from the record).
              v2.1: id is the check the copy belongs to, open or not; the outcome is written to that check (F.reduce 'shared' / 'unshared' { id }),
              so a copy can be withdrawn from any step, from the stop screen and from "Your checks".
     file     a check read from a file that is waiting for the "replace?" answer; else null
     notice   'useChanged' after a restore whose use case moved in or left the catalogue (shown on step 4);
              'questionsChanged' when its tailored questions changed since it was answered (shown on step 5); else null
     elsewhere  TABS (F.mergeTabs): null | 'changed' | 'removed': another tab of this browser changed or removed the open check
     fileNote 'old' after a file from the earlier Readiness check was chosen; else null
     corrupt  true when the saved store could not be read (set aside under F.CORRUPT_KEY), until the line is read
   host.state = BRIDGE machine (F.bridgeNext): 'none' | 'pending' | 'yes' | 'no' (does the hub bar save files for us?)
   host.pong  true once the hub bar has answered our ping; only then do links become hub messages
   storage    'ok' | 'blocked' (nothing can be kept) | 'newer' (saved by a newer version: shown, never written over)
   hist       HISTORY machine (F.histAction): { d, prev, len } of the current Back/forward entry */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var C = window.R2Content, L = window.R2Logic, F = window.R2Flow, P = window.R2Pdf, RC = window.RCLogic || null, S = window.RCStore || null;
  /* Sharing a copy with the project team (opt-in, to the hub's "Team: readiness results" tab). One switch: false switches
     sharing off (withdrawing a copy that was already shared still works). */
  var SHARING_ON = true;
  var D, CAT, TQ, M = null;
  try { D = JSON.parse($('r2-data').textContent); CAT = D.cat; TQ = D.tq; if (RC && D.rc) M = RC.model({ rdy: D.rc.rdy, cat: CAT, reg: D.rc.reg }); }
  catch (e) { $('app').setAttribute('data-state', 'error'); $('view').innerHTML = '<p class="panel" role="alert">The data in this page could not be read. Reload the page; if this stays, tell the project team the page needs rebuilding.</p>'; throw e; }
  var USE = {}, DEPT = {};
  CAT.depts.forEach(function (d) { DEPT[d.id] = d; d.uses.forEach(function (u) { USE[u.id] = Object.assign({ dept: d }, u); }); });
  var ENV = { cat: CAT, tq: {}, sig: {}, countries: C.COUNTRIES };
  Object.keys(TQ.uses).forEach(function (k) { ENV.tq[k] = TQ.uses[k].qs.map(function (q) { return { id: q.id }; }); ENV.sig[k] = TQ.uses[k].sig || ''; });
  var IN_FRAME = window.parent !== window;
  var FOREIGN_PARENT = IN_FRAME && (function () { try { var a = location.ancestorOrigins; return !!(a && a.length && a[0] !== location.origin); } catch (e) { return false; } })();
  var PROFILE = 'hftp-hotel-profile-v1';
  var NAME = 'Do you need AI?';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function plural(n, a, b) { return n + ' ' + (n === 1 ? a : (b || a + 's')); }
  function opt(v, l, cur) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>'; }

  // ---------- storage (versioned store, see F.migrate) ----------
  var storage = 'ok', loadInfo = {}, corrupt = false;
  /* TABS (audit M3): which check is open belongs to the tab (sessionStorage), not to the shared store, so two tabs can hold two checks. */
  function tabCur() { try { return sessionStorage.getItem(F.CUR_KEY) || ''; } catch (e) { return ''; } }
  function setTabCur() { try { sessionStorage.setItem(F.CUR_KEY, store.cur); } catch (e) { /* blocked */ } }
  /* What is saved now → { store, info } | { blocked } | { corrupt: text } | null (nothing saved). Changes nothing. */
  function readStore(keep) {
    var s; try { s = localStorage.getItem(F.KEY); } catch (e) { return { blocked: true }; }
    if (!s) return null;
    var raw; try { raw = JSON.parse(s); } catch (e) { return { corrupt: s }; }
    var info = { keep: keep }, r = F.migrate(raw, ENV, info);
    return r ? { store: r, info: info } : { corrupt: s };
  }
  function load() {
    var x = readStore(tabCur());
    if (!x) return null;
    if (x.blocked) { storage = 'blocked'; return null; }
    if (x.corrupt != null) { // audit L12: say so and set the unreadable text aside before the first save replaces it
      corrupt = true; try { localStorage.setItem(F.CORRUPT_KEY, x.corrupt); } catch (e) { /* blocked */ }
      return null;
    }
    loadInfo = x.info;
    if (x.info.newer) storage = 'newer';
    /* Blank checks left behind by other tabs are not kept. */
    Object.keys(x.store.checks).forEach(function (k) { if (k !== x.store.cur && !F.listed(x.store.checks[k])) delete x.store.checks[k]; });
    return x.store;
  }
  function save() {
    setTabCur();
    if (storage === 'newer') return;
    try {
      var s = JSON.parse(JSON.stringify(store)); s.checks[s.cur].updated = new Date().toISOString(); store.checks[store.cur].updated = s.checks[s.cur].updated;
      localStorage.setItem(F.KEY, JSON.stringify(s)); storage = 'ok';
    } catch (e) { storage = 'blocked'; }
    writeProfile();
  }
  /* Shared hotel profile (key hftp-hotel-profile-v1), read and written exactly as the readiness check does:
     empty fields of a check are filled from it; name, country (as a code) and type are written back. */
  function readProfile() { try { var p = JSON.parse(localStorage.getItem(PROFILE) || 'null'); return p && typeof p === 'object' ? p : null; } catch (e) { return null; } }
  function adoptProfile() {
    var p = readProfile(); if (!p) return;
    var r = F.reduce(store, 'profile', { name: p.name, country: p.country ? C.CC[p.country] || 'Other' : '', type: p.type }, ENV);
    if (r.ok) apply(r);
  }
  function writeProfile() {
    var H = rec.hotel; if (!(H.name || H.country || H.type) || storage !== 'ok') return;
    var p = readProfile() || {}, code = '';
    Object.keys(C.CC).forEach(function (k) { if (C.CC[k] === H.country) code = k; });
    if (H.name) p.name = H.name; if (code) p.country = code; if (H.type) p.type = H.type;
    p.updatedAt = new Date().toISOString(); p.from = 'readiness';
    try { localStorage.setItem(PROFILE, JSON.stringify(p)); } catch (e) { /* blocked */ }
  }
  /* Audit L2: "empty means cleared". A field the person empties on step 1 is taken out of the shared profile too, so it does not
     come back on the next load. (Country "Other" has no code in the profile, so it clears the profile's country as well.) */
  function clearProfile(k) {
    if (storage !== 'ok') return;
    var p = readProfile(); if (!p || !Object.prototype.hasOwnProperty.call(p, k)) return;
    delete p[k]; p.updatedAt = new Date().toISOString(); p.from = 'readiness';
    try { localStorage.setItem(PROFILE, JSON.stringify(p)); } catch (e) { /* blocked */ }
  }

  var store = load() || F.blankStore();
  var rec = F.cur(store);
  function noticeOf(info) { return info && info.useChanged ? 'useChanged' : info && info.questionsChanged ? 'questionsChanged' : null; }
  var ui = { confirm: null, missing: null, copy: false, copyText: '', open: {}, explain: null, dl: 'idle', share: null, file: null, notice: noticeOf(loadInfo), elsewhere: null, fileNote: null, corrupt: corrupt };
  function ctx() { return F.ctxOf(rec, ENV); }
  function env() { return { cat: CAT, TQ: TQ, RC: RC, M: M, ex: D.ex, today: L.localIso() }; }
  /* v2.2: the name shown for a use case (the team's plain name; ids and the catalogue name stay in the record). */
  function uName(u) { return L.useLabel(TQ, u); }
  function recOf(id) { return Object.prototype.hasOwnProperty.call(store.checks, id) ? store.checks[id] : null; }
  function model() { return L.resultModel(rec, env()); }
  function tailQs() { return L.useQs(TQ, rec.use); }

  // ---------- send: the only way anything changes ----------
  function firstOpen(step) {
    if (step === 'hotel') return ctx().hotelDone ? null : 'type';
    if (step === 'q') return F.QIDS.filter(function (id) { return !L.Q_OK[rec.Q[id]]; })[0] || null;
    if (step === 'must') return F.MUST_IDS.filter(function (id) { return !L.A_OK[rec.A[id]]; })[0] || null;
    if (step === 'where') return ctx().whereDone ? null : 'where';
    if (step === 'tailored') return (tailQs().filter(function (q) { return !rec.T[q.id]; })[0] || {}).id || null;
    return null;
  }
  // HISTORY machine (F.histAction): the only writer of history entries
  var hist = (function () { var h = F.histRead(history.state); return { d: h.ours ? h.d : 0, prev: h.ours && h.step === rec.step && h.id === rec.id ? h.prev : null, len: history.length }; })();
  function histWrite(act, entry) {
    try {
      if (act === 'back') history.back();
      else history[act === 'push' ? 'pushState' : 'replaceState'](entry, '', location.pathname + location.search);
    } catch (e) { /* sandboxed: steps just do not join Back/forward */ }
    if (act !== 'back') { hist.d = entry.d; hist.prev = entry.prev; }
    else { hist.d = Math.max(0, hist.d - 1); hist.prev = null; }
    hist.len = history.length;
  }
  function histMove(ev, from) {
    var act = F.histAction(ev, hist, rec.step, history.length);
    histWrite(act, act === 'back' ? null : F.histEntry(act, hist, rec.step, from, rec.id));
  }
  function histAssert() { histWrite('replace', { r2: rec.step, d: hist.d, prev: hist.prev, id: rec.id }); }

  var STORE_EV = { 'new': 1, open: 1, remove: 1, 'import': 1, preselect: 1 };
  function apply(r) { store = r.store; rec = F.cur(store); }
  /* opt.quiet: save without redrawing (typing in the hotel name). */
  /* Remove a check now (the CONFIRM machine has already fired). */
  function removeNow(id, msg) {
    var prev = rec.step, prevId = rec.id, r = F.reduce(store, 'remove', id, ENV); if (!r.ok) { render(); return false; }
    apply(r); if (rec.id !== prevId) { adoptProfile(); afterMove(prev, 'remove', true); } else { save(); render(); }
    toast(msg); return true;
  }
  function send(ev, arg, opt) {
    var prev = rec.step, prevId = rec.id, c, r;
    if (ev === 'remove') { c = F.confirmNext(ui.confirm, 'ask', 'remove', arg); ui.confirm = c.c; render(); var y = $('rm-withdraw') || $('rm-yes'); if (y) y.focus(); return true; }
    if (ev === 'confirm-no') { ui.confirm = F.confirmNext(ui.confirm, 'no').c; ui.file = null; render(); return true; }
    if (ev === 'remove-yes') {
      c = F.confirmNext(ui.confirm, 'yes', 'remove', arg); ui.confirm = c.c;
      if (!c.fire) { render(); return false; }
      return removeNow(arg, 'Check removed from this browser.');
    }
    if (ev === 'remove-withdraw') {
      /* Audit H1: a real button instead of a sentence that sent the person to a page they could not reach. The copy goes first; the check only if that worked. */
      c = F.confirmNext(ui.confirm, 'yes', 'remove', arg); ui.confirm = c.c;
      if (!c.fire || !recOf(arg) || !S || ui.share) { render(); return false; }
      ui.share = { phase: 'withdrawing', id: arg }; render();
      withdrawCopy(arg).then(function () { ui.share = null; sharePatch('unshared', { id: arg }); removeNow(arg, 'Shared copy withdrawn and check removed from this browser.'); },
        function (e) { ui.share = null; render(); toast(e && e.code === 'mode' ? 'This copy was shared from the project hub: open the check there to withdraw it. The check was kept.' : 'The shared copy could not be withdrawn, so the check was kept.'); });
      return true;
    }
    if (ev === 'adopt') {
      /* TABS: take the other tab's version of the open check. */
      var x = readStore(rec.id);
      if (x && x.store && x.store.checks[rec.id]) { store.checks[rec.id] = x.store.checks[rec.id]; rec = F.cur(store); ui.notice = noticeOf(x.info); }
      ui.elsewhere = null; ui.missing = null; histAssert(); render(); return true;
    }
    if (ev === 'seen' && ui.corrupt) { ui.corrupt = false; if (!store.notice) { render(); return true; } }
    if (ev === 'import-yes') {
      c = F.confirmNext(ui.confirm, 'yes', 'file'); ui.confirm = c.c; var f = ui.file; ui.file = null;
      if (!c.fire || !f) { render(); return false; }
      return send('import', f, { notice: ui.fileInfo });
    }
    if (ev === 'next' && F.flowNext(rec.step, 'next', ctx()) === null) {
      /* Refused "Next": point at the first open question (Q1 No always goes on to the stop screen, so never here). */
      ui.missing = firstOpen(rec.step); render();
      var m = document.querySelector('.missing'); if (m) { m.scrollIntoView({ block: 'center' }); var fi = m.querySelector('input, select'); if (fi) fi.focus({ preventScroll: true }); }
      return false;
    }
    r = F.reduce(store, ev, arg, ENV);
    if (ev === 'pop') {
      apply(r);
      if (!r.ok) histWrite('replace', { r2: rec.step, d: hist.d, prev: null, id: rec.id });
      afterMove(prev, null); return r.ok;
    }
    if (!r.ok) { if (r.full) toast(C.TOO_MANY); return false; }
    apply(r);
    if (STORE_EV[ev]) {
      adoptProfile(); ui.open = {}; ui.explain = null; ui.notice = ev === 'import' && opt && opt.notice ? opt.notice : null; ui.elsewhere = null; ui.fileNote = null;
      if (ev === 'import') toast('Check opened from the file.');
      afterMove(prev, ev, true); return true;
    }
    if (ev === 'hotel' && arg.v === '' && arg.k !== 'role') clearProfile(arg.k);
    if (ev === 'hotel' && arg.k === 'country' && arg.v === 'Other') clearProfile('country');
    if (ev === 'begin' || ev === 'next') ui.corrupt = false;
    if ((ev === 'begin' || ev === 'next') && store.notice) apply(F.reduce(store, 'seen', null, ENV)); // the one-time notice has been read
    if (rec.step !== prev) { afterMove(prev, ev); return true; }
    if (ev === 'use') ui.notice = null;
    if (ui.missing && (ev === 'answer' || ev === 'use' || ev === 'hotel')) ui.missing = firstOpen(rec.step) === ui.missing ? ui.missing : null;
    save();
    if (!(opt && opt.quiet)) render();
    return true;
  }
  /* ev: the event that moved the step (written into history by the HISTORY machine), or null for a pop (already in history). */
  function afterMove(prev, ev, force) {
    ui.confirm = F.confirmNext(ui.confirm, 'nav').c; ui.missing = null; ui.copy = false; ui.file = null; skipRun = 0;
    if (rec.step !== prev || force) { ui.notice = (ui.notice === 'useChanged' && rec.step === 'where') || (ui.notice === 'questionsChanged' && rec.step === 'tailored') ? ui.notice : null; ui.elsewhere = null; ui.fileNote = null; }
    if (ev && (rec.step !== prev || force)) histMove(ev, prev);
    takeSnap();
    save(); render();
    if (rec.step !== prev || force) { window.scrollTo(0, 0); $('view').focus({ preventScroll: true }); }
    if (rec.step !== prev) arrive();
  }
  /* Design pass: a short arrival when the step changes, and the result bars grow once. Started here, at the event, because render()
     replaces #view on every answer (CSS entry animations would replay). Reduced motion: opacity only, no movement. */
  var calm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function ease(el, dy, ms) {
    if (!el || !el.animate) return;
    try { el.animate(calm.matches ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(' + dy + 'px)' }, { opacity: 1, transform: 'none' }], { duration: ms, easing: 'cubic-bezier(.23,1,.32,1)' }); } catch (e) {}
  }
  function arrive() {
    ease($('view'), 6, 180);
    if (rec.step !== 'result' || calm.matches) return;
    Array.prototype.forEach.call(document.querySelectorAll('#areas .track i'), function (i) { try { i.animate([{ transform: 'scaleX(0)', transformOrigin: 'left' }, { transform: 'scaleX(1)', transformOrigin: 'left' }], { duration: 400, easing: 'cubic-bezier(.23,1,.32,1)' }); } catch (e) {} });
  }
  /* Return visits: on the result page, keep a dated snapshot whenever the result differs from the last one kept. */
  function takeSnap() {
    if (rec.step !== 'result' || storage === 'newer') return;
    var sn = L.snapshot(L.evaluate(rec, TQ), new Date().toISOString(), rec.use), last = rec.snaps[rec.snaps.length - 1];
    if (L.sameSnap(last, sn)) return;
    var r = F.reduce(store, 'snap', sn, ENV); if (r.ok) apply(r);
  }

  // ---------- pieces ----------
  var STEP_LINE = { hotel: ['Step 1 of 5', 'About your hotel'], q: ['Step 2 of 5', 'Is this an AI problem?'], stop: ['Result', 'Not suitable for AI'], must: ['Step 3 of 5', 'Must-haves'],
    where: ['Step 4 of 5', 'Where in the hotel?'], tailored: ['Step 5 of 5', 'Questions for this use case'], result: ['Result', ''] };
  function storeLine() {
    var h = '';
    if (storage === 'blocked') h += '<p class="savewarn" id="not-saved" role="status">' + esc(C.NOT_SAVED) + '</p>';
    if (storage === 'newer') h += '<p class="savewarn" id="not-saved" role="status">' + esc(C.NEWER) + '</p>';
    if (store.notice === 'v1') h += '<p class="savewarn" id="from-v1" role="status">' + esc(C.FROM_V1) + ' <button type="button" class="linkbtn" data-act="seen" id="seen">OK</button></p>';
    if (ui.corrupt) h += '<p class="savewarn" id="corrupt" role="status">' + esc(C.CORRUPT) + ' <button type="button" class="linkbtn" data-act="seen" id="corrupt-ok">OK</button></p>';
    if (ui.elsewhere) h += '<p class="savewarn" id="elsewhere" data-elsewhere="' + ui.elsewhere + '" role="status">' + esc(C.ELSEWHERE[ui.elsewhere]) + (ui.elsewhere === 'changed' ? ' Going on here keeps this tab’s answers. <button type="button" class="linkbtn" data-act="adopt" id="adopt">Load the other tab’s version</button>' : '') + '</p>';
    return h + sharedLine();
  }
  /* Audit H1: a shared copy can be withdrawn from any step. The result has its own panel and the cover its list of checks. */
  function sharedLine() {
    if (!S || !rec.sharedAt || rec.step === 'result' || rec.step === 'start') return '';
    var ph = sharePhase(), d = L.fmtDate(rec.sharedAt);
    var text = rec.step === 'stop' ? 'The team still has your earlier result (shared ' + d + '). Withdraw it, or change your answers and send an updated copy from the result.'
      : 'A copy of this check is with the project team (shared ' + d + '). It shows your answers as they were then.';
    return '<p class="savewarn" id="shared-line" data-share-state="' + ph + '" role="status">' + esc(text) + ' ' +
      (ph === 'withdrawing' ? '<span class="meta">Withdrawing…</span>' : '<button type="button" class="linkbtn" data-act="unshare" id="unshare">Withdraw shared copy</button>') + '</p>';
  }
  function listedIds() { return Object.keys(store.checks).filter(function (k) { return F.listed(store.checks[k]); }).sort(function (a, b) { return String(store.checks[b].updated).localeCompare(String(store.checks[a].updated)); }); }
  function header() {
    if (rec.step === 'start') {
      return '<div class="hdrtop"><p class="meta">A student project by EHL for HFTP · prototype</p></div><h1>' + esc(NAME) + '</h1>' +
        '<p class="sub"><strong>Is AI the answer, and is your hotel ready for it?</strong></p>' +
        '<p class="meta honest" id="honest">' + esc(C.HONEST) + '</p>' + storeLine();
    }
    var s = STEP_LINE[rec.step], pr = F.progress(rec.step);
    var bar = pr ? '<div class="steps3 steps5" aria-hidden="true">' + pr.map(function (c) { return '<span class="' + c + '"></span>'; }).join('') + '</div>' : '';
    return '<div class="hdrtop"><p class="hdrline"><strong>' + esc(NAME) + '</strong> · ' + esc(s[0]) + (s[1] ? ' · ' + esc(s[1]) : '') + '</p>' +
      (rec.step === 'stop' || rec.step === 'result' ? '' : '<button type="button" class="linkbtn" data-act="new" id="new-top">Start a new check</button>') + '</div>' + bar + storeLine();
  }
  function fold(key, label, body) {
    return '<details class="more" data-fold="' + key + '"' + (ui.open[key] ? ' open' : '') + '><summary>' + esc(label) + '</summary><div class="morebody">' + body + '</div></details>';
  }
  function row(key, title, body, attrs) {
    return '<details class="panel fold" data-fold="' + key + '"' + (attrs || '') + (ui.open[key] ? ' open' : '') + '><summary><span>' + title + '</span></summary><div class="foldbody">' + body + '</div></details>';
  }
  function srcText(t) { return String(t).replace(/\{N\}/g, TQ.matrixTotal).replace(/\{U\}/g, CAT.nUses).replace(/\{D\}/g, TQ.nDraft); }
  function sources(step) {
    var list = C.SOURCES[step] || [], note = C.SOURCES[step + 'Note'] || '';
    var body = (note ? '<p>' + esc(srcText(note)) + (step === 'where' ? ' ' + esc(CAT.nUses + ' use cases in ' + CAT.nDepts + ' departments; page built ' + D.builtOn + '.') : '') + '</p>' : '') +
      (list.length ? '<ul>' + list.map(function (s) { return '<li>' + esc(srcText(s)) + '</li>'; }).join('') + '</ul>' : '');
    return '<section class="sources">' + fold('src-' + step, 'Where this comes from', body) + '</section>';
  }
  function evidence(ev, share) {
    var h = '';
    if (share && share.length) h += '<div class="ev" data-ev="share"><b>In the team’s own analysis</b>' + share.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>';
    if (ev && ev.length) h += '<div class="ev" data-ev="sources"><b>Evidence</b>' + ev.map(function (e) { return '<p>' + esc(e[0]) + '<span class="src">Source: ' + esc(e[1]) + '</span></p>'; }).join('') + '</div>';
    return h;
  }
  function radios(name, opts, cur) {
    return '<div class="opts" role="radiogroup" aria-labelledby="t-' + name + '">' + opts.map(function (o) {
      var on = cur === o[0], id = 'a-' + name + '-' + o[0];
      return '<label class="opt' + (on ? ' on' : '') + '" for="' + id + '"><input type="radio" name="' + name + '" id="' + id + '" value="' + o[0] + '" data-answer="' + name + '"' + (on ? ' checked' : '') + '>' + esc(o[1]) + '</label>';
    }).join('') + '</div>';
  }
  function needLine(id) { return ui.missing === id ? '<p class="needline" role="alert">Answer this to continue (“Don’t know yet” is fine).</p>' : ''; }
  function nav(backLabel, nextLabel) {
    return '<div class="navrow"><button type="button" class="btn back" data-act="back" id="back">' + esc(backLabel || 'Back') + '</button><span class="spacer"></span>' +
      '<button type="button" class="btn primary" data-act="next" id="next">' + esc(nextLabel) + '</button></div>';
  }
  function byField(id, v, by) {
    if (v !== 'pl') return '';
    var past = by && by < L.localIso(); // a date saved earlier that has passed: shown and said, a new one cannot lie in the past (audit L5)
    return '<div class="byfield"><label for="by-' + id + '">By when? (optional)</label><input type="date" id="by-' + id + '" data-by="' + id + '" min="' + L.localIso() + '" value="' + esc(by || '') + '">' +
      (past ? '<span class="meta" id="overdue-' + id + '"><strong>This date has passed (overdue).</strong> Set a new one or clear it.</span>' : '') +
      '<span class="meta">Planned is not in place yet: it stays on your to-do list until it is done.</span></div>';
  }
  function vClass(key) { return key === 'stop' ? 'v-stop' : key === 'go' || key === 'assist' ? 'v-go' : key === 'find' || key === 'open' ? 'v-open' : 'v-hold'; }
  function verdictBody(t) {
    var h = '<p class="vsent" id="verdict-head">' + esc(t.head) + '</p>' + (t.second ? '<p><strong>' + esc(t.second) + '</strong></p>' : '');
    if (t.carried.length) h += '<div><p><strong>' + esc(t.carriedLabel) + '</strong></p><ul>' + t.carried.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>';
    if (t.find.length) h += '<div><p><strong>To find out</strong></p><ul>' + t.find.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>';
    if (t.q1Unsure) h += '<p>' + esc(t.q1Unsure) + '</p>';
    return h;
  }
  var LV_CLASS = { ready: 'v-go', almost: 'v-hold', notready: 'v-stop', noinfo: 'v-open' };

  // ---------- "Your checks in this browser" and files ----------
  function checkLine(r) {
    var v = L.verdict(r.Q), u = USE[r.use];
    var name = u ? uName(u) : r.use === 'none' ? 'No use case (“None of these fits”)' : 'No use case chosen yet';
    var status;
    if (v.stop) status = 'Not suitable for AI';
    else if (F.reachable('result', F.ctxOf(r, ENV))) { var e = L.evaluate(r, TQ); status = C.LEVELS[e.level].name + ' · ' + L.scoreHead(e).replace(/\.$/, ''); }
    else status = 'Not finished: ' + (STEP_LINE[r.step] ? STEP_LINE[r.step][1].toLowerCase() : 'not started');
    return { name: name, status: status };
  }
  function fileConfirm() {
    if (!ui.confirm || ui.confirm.kind !== 'file' || !ui.file) return '';
    return '<div class="confirmline" data-confirm="file" role="group" aria-label="Replace this check?"><p><strong>This check is already in this browser.</strong> Replace it with the one from the file?</p>' +
      '<div class="btnrow"><button type="button" class="btn warn" data-act="import-yes" id="import-yes">Replace with the file</button><button type="button" class="btn" data-act="confirm-no" id="import-no">Keep the one here</button></div></div>';
  }
  function myChecks() {
    var ids = listedIds();
    var h = '<section class="panel" id="mychecks" data-count="' + ids.length + '"><h2>Your checks in this browser</h2>';
    if (storage !== 'ok') h += '<p class="meta" id="no-keep">' + esc(C.NO_KEEP) + '</p>'; // audit L6: never "kept here" while nothing is kept
    else if (!ids.length) h += '<p class="meta">None yet. Each check you start is kept here until you remove it.</p>';
    if (ids.length) h += '<div class="mylist">' + ids.map(function (k) {
      var r = store.checks[k], l = checkLine(r), isCur = k === store.cur, cRm = ui.confirm && ui.confirm.kind === 'remove' && ui.confirm.id === k;
      var ph = sharePhaseOf(k), shared = !!r.sharedAt && !!S, ownControl = isCur && rec.step === 'result'; // the result's own panel has the button for the open check
      var sharedTxt = r.sharedAt ? 'shared with the team ' + L.fmtDate(r.sharedAt) + (F.shareStale(r) ? ', out of date' : '') : '';
      return '<div class="mycheck" data-check="' + esc(k) + '"' + (r.sharedAt ? ' data-shared="1"' : '') + '><div class="g1"><strong>' + esc(l.name) + '</strong><span class="meta">' + esc([r.hotel.name, l.status, r.updated ? 'last changed ' + L.fmtDate(r.updated) : '', sharedTxt].filter(Boolean).join(' · ')) + (isCur ? ' · open now' : '') + '</span></div>' +
        '<div class="btnrow">' + (isCur ? '' : '<button type="button" class="btn" data-act="open" data-id="' + esc(k) + '">Open</button>') +
        (cRm ? (shared ? '<button type="button" class="btn warn" data-act="remove-withdraw" data-id="' + esc(k) + '" id="rm-withdraw">Withdraw the shared copy and remove</button>' : '') +
            '<button type="button" class="btn' + (shared ? '' : ' warn') + '" data-act="remove-yes" data-id="' + esc(k) + '" id="rm-yes">' + (shared ? 'Remove from this browser only' : 'Remove for good') + '</button><button type="button" class="btn" data-act="confirm-no" id="rm-no">Keep</button>'
          : (ph === 'withdrawing' ? '<span class="meta" role="status">Withdrawing…</span>' : (shared && !ownControl ? '<button type="button" class="linkbtn" data-act="unshare" data-id="' + esc(k) + '" id="unshare-' + esc(k) + '">Withdraw shared copy</button>' : '') +
            '<button type="button" class="linkbtn" data-act="remove" data-id="' + esc(k) + '">Remove</button>')) + '</div>' +
        (cRm ? '<p class="meta" data-confirm="remove">Remove this check from this browser? Files you saved are not affected.' + (shared ? ' The project team has a copy of it: “Remove from this browser only” leaves that copy with the team.' : '') + '</p>' : '') + '</div>';
    }).join('') + '</div>';
    h += fileConfirm() + (ui.fileNote === 'old' ? '<p class="savewarn" id="old-file" role="status">' + esc(C.OLD_FILE) + ' <a href="../readiness-check/index.html" target="_blank" rel="noopener">Open the earlier Readiness check</a> and use “Open a saved file” there.</p>' : '') +
      '<div class="btnrow"><label class="btn filebtn" for="file-open">Open a saved file<input type="file" id="file-open" accept="application/json,.json" class="sr"></label>' +
      (storage === 'ok' ? '<span class="meta">Checks stay in this browser only. Save a file to keep one elsewhere.</span>' : '') + '</div></section>';
    return h;
  }

  // ---------- screens ----------
  function vStart() {
    var pre = rec.from === 'link' ? USE[rec.use] : null, range = L.tailRange(TQ); // audit L3: only for a use case that came from a link
    var NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'], num = function (n) { return NUM[n] || String(n); };
    var rangeText = range[0] === range[1] ? num(range[0]) : num(range[0]) + ' to ' + num(range[1]);
    return (pre ? '<p class="pathline" id="preselected">You came here for: <b>' + esc(uName(pre)) + '</b>. It is already chosen in step 4.</p>' : '') +
      '<section class="panel intro" id="intro-why"><h2>Why this tool</h2>' +
      '<p>Hotels are offered more and more AI tools, often before anyone has checked whether AI is the right answer to the problem. This tool helps you check that first, before you spend time and money with vendors: does the job need AI at all, are the basics in place, and what does this particular use need?</p>' +
      '<p class="meta">Why it matters: among EU accommodation businesses with 10 or more staff that had considered AI but did not use it, the most common reasons were a lack of expertise (69.89%) and systems that do not fit together (45.91%). Source: Eurostat, ICT usage survey, early 2025.</p></section>' +
      '<section class="panel intro" id="intro-how"><h2>How to use it</h2>' +
      '<p>Think of <b>one problem</b> in your hotel, for example “we answer the same guest emails all day”. Then go through five steps:</p><ol class="journey">' +
      '<li><b>About your hotel</b><span>How it is run, and if you like its name, your role and the country.</span></li>' +
      '<li><b>Is this an AI problem?</b><span>Five short questions. If fixed rules can do the job, the tool says so and stops there.</span></li>' +
      '<li><b>Must-haves</b><span>' + esc(C.MUST_COVER) + '</span></li>' +
      '<li><b>Where in the hotel?</b><span>Pick the area, the department and the use case, among ' + esc(CAT.nUses + ' use cases in ' + CAT.nDepts + ' departments') + '.</span></li>' +
      '<li><b>Questions for this use case</b><span id="cover-range" data-min="' + range[0] + '" data-max="' + range[1] + '">' + esc(rangeText.charAt(0).toUpperCase() + rangeText.slice(1)) + ' questions on what this use needs: people, skills, money, technology, data and rules.</span></li></ol>' +
      '<p class="sub">Answer honestly; “Don’t know yet” is a fine answer and goes on your to-do list. Each question has a “Why this matters” link if you want more.' + (storage === 'ok' ? ' You can stop and come back: your answers stay in this browser.' : '') + '</p></section>' +
      '<section class="panel intro" id="intro-get"><h2>What you get</h2><ul class="tight">' +
      '<li><b>A clear answer:</b> is this a job for AI, for simple rules, or not yet?</li>' +
      '<li id="get-score"><b>' + esc(C.GET_SCORE[0]) + '</b> ' + esc(C.GET_SCORE[1]) + '</li>' +
      '<li><b>What is missing:</b> the three things to start with, and an action plan by person that you can copy and send.</li>' +
      '<li><b>Questions for the vendor</b> and the provisional EU AI Act label for the use case.</li>' +
      '<li><b>A PDF and a file</b> to share with your owner or team, and to come back to later.</li></ul>' +
      '<div class="navrow"><button type="button" class="btn primary" data-act="begin" id="begin">Start</button></div></section>' + myChecks();
  }
  function vHotel() {
    var H = rec.hotel, need = ui.missing === 'type';
    return '<div class="stephead"><p class="kicker">Step 1 of 5</p><h2>About your hotel</h2><p class="sub">Only “how the hotel is run” is needed. The rest is for your own report.</p></div>' +
      '<section class="panel"><div class="formgrid">' +
      '<label class="fld' + (need ? ' missing' : '') + '" id="box-type"><span>How the hotel is run</span><select id="h-type" data-h="type">' + opt('', 'Choose', H.type) + C.TYPES.map(function (t) { return opt(t[0], t[1], H.type); }).join('') + '</select>' +
      (need ? '<p class="needline" role="alert">Choose one to continue</p>' : '') + '<span class="meta">In a managed or franchised hotel the owner approves spending.</span></label>' +
      '<label class="fld"><span>Hotel name (optional)</span><input type="text" id="h-name" data-h="name" value="' + esc(H.name) + '" autocomplete="organization" maxlength="120"><span class="meta">Only for your own report.</span></label>' +
      '<label class="fld"><span>Your role (optional)</span><select id="h-role" data-h="role">' + opt('', 'Choose', H.role) + C.ROLES.map(function (t) { return opt(t[0], t[1], H.role); }).join('') + '</select></label>' +
      '<label class="fld"><span>Country (optional)</span><select id="h-country" data-h="country">' + opt('', 'Choose', H.country) + C.COUNTRIES.map(function (c) { return opt(c, C.COUNTRY_LABEL[c] || c, H.country); }).join('') + '</select><span class="meta">Used for the EU AI Act note on the result.</span></label>' +
      '</div>' + (storage === 'ok' ? '<p class="meta">These details are shared with the AI Register and the AI Act guide in this browser, so you type them once.</p>' : '') + '</section>' +
      nav('Back', 'Next: is this an AI problem?');
  }
  function vQ() {
    var v = L.verdict(rec.Q), h = '<div class="stephead"><p class="kicker">Step 2 of 5</p>' +
      '<p class="crisp" id="crisp" aria-label="C R I S P: ' + esc(C.QUESTIONS.map(function (q) { return q.title; }).join(', ')) + '">C-R-I-S-P</p>' +
      '<p class="crisp-key" aria-hidden="true">' + C.QUESTIONS.map(function (q) { return '<span><b>' + esc(q.title.charAt(0)) + '</b>' + esc(q.title.slice(1)) + '</span>'; }).join(' · ') + '</p>' +
      '<h2>Is this an AI problem?</h2>' +
      '<p class="sub">Think of one problem in your hotel. Five questions; each Yes points towards AI. If you are not sure, say so: it becomes something to find out.</p></div>';
    h += '<section class="panel">' + C.QUESTIONS.map(function (q, i) {
      return '<fieldset class="qa' + (ui.missing === q.id ? ' missing' : '') + '" id="f-' + q.id + '" aria-labelledby="t-' + q.id + '"><div class="qrow"><span class="qno" aria-hidden="true">' + (i + 1) + '</span><div class="qbody">' +
        '<p class="itemname" id="title-' + q.id + '">' + esc(q.title) + '</p>' +
        '<p class="qtext" id="t-' + q.id + '">' + esc(q.q) + '</p>' +
        radios(q.id, C.Q_ANSWERS, rec.Q[q.id]) + (ui.missing === q.id ? '<p class="needline" role="alert">Answer this to continue (“Not sure” is fine).</p>' : '') +
        fold('why-' + q.id, 'Why this matters', '<p class="whyshort" id="whyshort-' + q.id + '"><strong>' + esc(q.whyShort) + '</strong></p>' +
          '<div class="yn"><div class="yn-box yn-yes" id="yes-' + q.id + '"><p class="yn-head">Answer Yes if</p><p>' + esc(q.yesIf) + '</p><p class="yn-ex"><b>Example:</b> ' + esc(q.yes) + '</p></div>' +
          '<div class="yn-box yn-no" id="no-' + q.id + '"><p class="yn-head">Answer No if</p><p>' + esc(q.noIf) + '</p><p class="yn-ex"><b>Example:</b> ' + esc(q.no) + '</p></div></div>' +
          (q.guard ? '<div class="yn-unsure"><p class="yn-head">Not sure?</p><p id="guard-' + q.id + '">' + esc(q.guard) + '</p></div>' : '') +
          '<p class="meta yn-more">' + esc(q.why) + '</p>') +
        '</div></div></fieldset>';
    }).join('') + '</section>';
    if (v.key === 'stop') h += '<section class="verdict v-stop" id="verdict" data-verdict="stop"><p class="vsent">Question 1 is No.</p><p>Press “See the result”: there is no need to answer the rest.</p></section>';
    else if (v.complete) h += '<section class="verdict ' + vClass(v.key) + '" id="verdict" data-verdict="' + v.key + '">' + verdictBody(L.verdictText(v)) +
      (v.key !== 'go' ? '<p class="meta">You can still go on. The result keeps these conditions.</p>' : '') + '</section>';
    h += sources('q');
    h += nav('Back', v.key === 'stop' ? 'See the result' : 'Next: must-haves');
    return h;
  }
  function vStop() {
    return '<section class="verdict v-stop stopcard" id="stopcard" data-verdict="stop"><h1 id="stop-head">' + esc(C.STOP.head) + '</h1>' +
      '<p>' + esc(C.STOP.why) + '</p><p><strong>' + esc(C.STOP.instead) + '</strong></p><p id="stop-unsure">' + esc(C.STOP.unsure) + '</p>' +
      '<p class="meta">Because you answered No to: “' + esc(L.QBY.q1.q) + '”</p>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="change" id="change">Change my answers</button><button type="button" class="btn" data-act="new" id="restart">Start again</button>' +
      pdfButton('Download (PDF)') + '</div></section>' + sources('q');
  }
  function vMust() {
    var sy = L.systemsFor(rec);
    var h = '<div class="stephead"><p class="kicker">Step 3 of 5</p><h2>Must-haves</h2>' +
      '<p class="sub" id="must-intro">' + esc(srcText(C.MUST_INTRO)) + ' Each one needs an answer; “Don’t know yet” is fine and goes on your to-do list.</p>' +
      '<p class="meta honest" id="honest">' + esc(C.HONEST) + '</p>' +
      '<p class="meta" id="cap-note">The top verdict is only possible when every must-have is Yes. You can go on either way.</p></div>';
    h += '<section class="panel">' + C.MUSTS.map(function (m, i) {
      var gloss = m.gloss && !(m.ex && /^PMS:/.test(m.gloss) && !sy.pms) ? m.gloss : '';
      var more = '<p class="whyshort"><strong>' + esc(m.why) + '</strong></p><p><b>What counts as Yes:</b> ' + esc(m.good) + '</p>' +
        (m.ex ? '<p class="qex" id="ex-' + m.id + '">' + esc(sy.line) + '</p>' : '') + (gloss ? '<p class="gloss" id="gloss-' + m.id + '">' + esc(gloss) + '</p>' : '') +
        evidence(m.ev, L.shareLines(m, TQ));
      return '<fieldset class="qa' + (ui.missing === m.id ? ' missing' : '') + '" id="f-' + m.id + '" aria-labelledby="t-' + m.id + '"><div class="qrow"><span class="qno" aria-hidden="true">' + (i + 1) + '</span><div class="qbody">' +
        '<p class="itemname">' + esc(m.name) + '</p><p class="qtext" id="t-' + m.id + '">' + esc(m.q) + '</p>' +
        radios(m.id, C.ANSWERS, rec.A[m.id]) + byField(m.id, rec.A[m.id], rec.By[m.id]) + needLine(m.id) +
        fold('why-' + m.id, 'Why this matters', more) + '</div></div></fieldset>';
    }).join('') + '</section>';
    h += sources('must') + nav('Back', 'Next: where in the hotel?');
    return h;
  }
  var useLevel = L.useLevel;
  function catLink(d) {
    return '<a href="../use-case-catalogue/index.html#' + esc(d.id) + '" data-act="catalogue" data-dept="' + esc(d.id) + '"' + (host.pong ? '' : ' target="_blank" rel="noopener"') + '>Sources in the Use-Case Catalogue</a>';
  }
  /* v2.2: "What does this do?" under each use case of step 4. A real button (inside the row's label, so a click on it does not
     choose the row: the click handler cancels it), with an inline panel after the row; the open use case is ui.explain, so the
     panel survives render(). */
  function explainButton(u, open) {
    return '<button type="button" class="exbtn" data-act="explain" data-ex="' + esc(u.id) + '" id="ex-' + esc(u.id) + '" aria-expanded="' + open + '" aria-controls="exp-' + esc(u.id) + '">' + (open ? 'Hide: what does this do?' : 'What does this do?') + '</button>';
  }
  function explainPanel(u, d) {
    var x = L.explain(D.ex, u.id), tu = TQ.uses[u.id], cn = L.catalogueName(TQ, u);
    return '<div class="explain" id="exp-' + esc(u.id) + '" role="region" aria-label="' + esc('What ' + uName(u) + ' does') + '">' +
      (x ? '<p><b>What it does:</b> ' + esc(D.ex[u.id].does) + '</p><p><b>How the AI works:</b> ' + esc(D.ex[u.id].how) + '</p>' : '<p>' + esc('What AI does: ' + u.task) + '</p>') +
      '<p class="meta">' + esc(L.useLevelLine(u)) + '</p>' + (cn ? '<p class="meta">' + esc(cn) + '</p>' : '') +
      (tu && tu.draft ? '<p class="meta exdraft"><strong>' + esc(C.DRAFT) + '.</strong> Its questions in step 5 come from a draft row.</p>' : '') +
      '<p><a class="linkbtn" href="../use-case-catalogue/index.html#' + esc(d.id) + '" data-act="catalogue" data-dept="' + esc(d.id) + '"' + (host.pong ? '' : ' target="_blank" rel="noopener"') + '>See it in the Use-Case Catalogue</a></p></div>';
  }
  function vWhere() {
    var h = '<div class="stephead"><p class="kicker">Step 4 of 5</p><h2>Where in the hotel?</h2>' +
      '<p class="sub">Pick the area, then the department. If one of its use cases matches your problem, choose it: the next step asks what that use needs. If none does, say so: the result then rests on the must-haves only.</p>' +
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
        var on = rec.use === u.id, ex = ui.explain === u.id;
        return '<label class="uc' + (on ? ' on' : '') + '" for="u-' + u.id + '"><input type="radio" name="use" id="u-' + u.id + '" value="' + u.id + '" data-use="' + u.id + '"' + (on ? ' checked' : '') + '>' +
          '<span class="ucbody"><span class="ucn">' + esc(uName(u)) + '</span>' +
          '<span class="ucm">' + explainButton(u, ex) + '<span>How common in hotels: <span class="lvl">' + esc(useLevel(u)) + '</span></span>' + catLink(d) + '</span></span></label>' +
          (ex ? explainPanel(u, d) : '');
      }).join('') + '</div>';
    }
    var noneOn = rec.use === 'none';
    h += '<div class="ucs nonefits"><label class="uc' + (noneOn ? ' on' : '') + '" for="u-none"><input type="radio" name="use" id="u-none" value="none" data-use="none"' + (noneOn ? ' checked' : '') + '>' +
      '<span class="ucbody"><span class="ucn">None of these fits my problem</span><span class="uct">Step 5 is skipped. The result uses the must-haves only, and says so.</span></span></label></div>';
    if (ui.missing === 'where') h += '<p class="needline" role="alert">Choose the use case that matches your problem, or “None of these fits my problem”.</p>';
    h += '</section>';
    var p = L.pathParts(rec, CAT, TQ);
    h += '<p class="pathline" id="pathline">' + (p.length ? 'Your choice: ' + p.map(function (x, i) { return i === p.length - 1 ? '<b>' + esc(x) + '</b>' : esc(x); }).join(' › ') : 'Nothing chosen yet.') + '</p>';
    h += sources('where');
    h += nav('Back', noneOn ? 'See the result' : 'Next: questions for this use case');
    return h;
  }
  function vTailored() {
    var u = USE[rec.use], tu = TQ.uses[rec.use], qs = tu.qs;
    var h = '<div class="stephead"><p class="kicker">Step 5 of 5</p><h2>Questions for this use case</h2>' +
      '<p class="sub"><b id="tail-use">' + esc(uName(u)) + '</b>: ' + esc(plural(qs.length, 'question')) + ' on what this use needs. They come from the team’s resource analysis of this use case; the must-haves are not asked again.</p>' +
      '<p class="sub" id="tail-today">' + esc(C.TAIL_TODAY) + '</p>' +
      (ui.notice === 'questionsChanged' ? '<p class="savewarn" id="questions-changed" role="status">' + esc(C.QUESTIONS_CHANGED) + '</p>' : '') +
      (tu.draft ? '<p class="savewarn" id="draft-note" role="note"><strong>' + esc(C.DRAFT) + '.</strong> This use case was added to the catalogue after the resource analysis, so its questions come from a draft row.</p>' : '') + '</div>';
    h += '<section class="panel">' + qs.map(function (q, i) {
      var opts = C.ANSWERS.concat([['na', q.na || C.NA[1]]]), v = rec.T[q.id];
      var why = L.tailWhy(TQ, rec.use, q);
      var more = (q.help ? '<p class="gloss">' + esc(q.help) + '</p>' : '') + why.map(function (t, j) { return '<p' + (j === 0 ? ' class="whyarea"' : '') + '>' + esc(t) + '</p>'; }).join('');
      return '<fieldset class="qa' + (ui.missing === q.id ? ' missing' : '') + '" id="f-' + q.id + '" aria-labelledby="t-' + q.id + '" data-area="' + q.a + '" data-kind="' + esc(q.kind) + '"><div class="qrow"><span class="qno" aria-hidden="true">' + (i + 1) + '</span><div class="qbody">' +
        '<p class="itemname">' + esc(TQ.areas[q.a]) + '</p><p class="qtext" id="t-' + q.id + '">' + esc(q.q) + '</p>' +
        radios(q.id, opts, v) + byField(q.id, v, rec.TBy[q.id]) + needLine(q.id) +
        fold('why-' + q.id, 'Why this matters', more) + '</div></div></fieldset>';
    }).join('') + '</section>';
    h += sources('tailored') + nav('Back', 'See the result');
    return h;
  }

  // ---------- result ----------
  function hubOpen(tool, hash, href, e) {
    if (!host.pong) return; // plain link
    e.preventDefault();
    try { window.parent.postMessage(hash ? { hub: 'open', tool: tool, hash: hash } : { hub: 'open', tool: tool }, location.origin); } catch (err) { location.href = href; }
  }
  function registerHash() { var u = USE[rec.use]; return u ? 'add=' + rec.use + '&name=' + encodeURIComponent(u.n.replace(/\s*\(.*$/, '')) : ''; }
  function sharePhaseOf(id) { return ui.share && ui.share.id === id ? ui.share.phase : F.shareSettled(recOf(id)); }
  function sharePhase() { return sharePhaseOf(rec.id); }
  function sharePanel() {
    if (!S) return '';
    var mode = S.state(), ph = sharePhase(), busy = ph === 'sending' || ph === 'withdrawing', stale = F.shareStale(rec), where = rec.sharedMode || mode;
    if (rec.sharedAt && ui.open.share === undefined) ui.open.share = true; // a shared check shows its withdraw button without a click (audit H1)
    var status = ph === 'sending' ? (mode === 'probing' || mode === 'idle' ? 'Checking whether the project hub is reachable…' : 'Sending…')
      : ph === 'withdrawing' ? 'Withdrawing…'
      : rec.sharedAt ? 'Last shared ' + L.fmtDate(rec.sharedAt) + (where === 'local' ? ' (test copy in this browser)' : '') + '.' + (stale ? ' Your answers have changed since then: send an updated copy so the team sees the current ones.' : '')
      : mode === 'local' && storage === 'ok' ? 'Outside the project hub this keeps a test copy in this browser only.' : ''; // audit L6: not while this browser keeps nothing
    var withdraw = rec.sharedAt && !busy ? '<button type="button" class="linkbtn" data-act="unshare" id="unshare">Withdraw shared copy</button>' : '';
    var body = !SHARING_ON
      ? '<p>Sharing with the project team is switched off.</p><div class="btnrow"><span class="meta" role="status">' + esc(rec.sharedAt || busy ? status : '') + '</span>' + withdraw + '</div>'
      : '<p>Student prototype: a shared copy goes to the project team (EHL SBP Group 36). A deletion date and a contact address are not set yet; you can withdraw your copy at any time with the button below.</p>' +
        '<p class="meta">Helps the student team test this tool. Sent: the use case, your role, how the hotel is run, the country, every answer, the “by when” dates, the score and verdict, and the dated history of your results. Not sent: ' + (rec.share.named ? 'nothing else' : 'the hotel name') + '. The copy is linked to the account you opened the hub with.</p>' +
        '<label class="chk"><input type="checkbox" data-share="named" id="share-named"' + (rec.share.named ? ' checked' : '') + (busy ? ' disabled' : '') + '><span>Also send our hotel name so the team can discuss the result with us</span></label>' +
        '<div class="btnrow"><button type="button" class="btn" data-act="share" id="share-btn"' + (busy ? ' disabled' : '') + '>' + (rec.sharedAt ? 'Send updated copy' : 'Share a copy') + '</button><span class="meta" role="status" id="share-status">' + esc(status) + '</span>' + withdraw + '</div>';
    return row('share', 'Share with the project team (optional)' + (rec.sharedAt ? ' · shared ' + esc(L.fmtDate(rec.sharedAt)) + (stale ? ', out of date' : '') : ''), body, ' id="share" data-share-state="' + ph + (stale ? ' stale' : '') + '"');
  }
  function vResult() {
    var m = model(), ev = m.ev, u = USE[rec.use], h = '';
    var regHref = '../register/index.html#' + registerHash();
    h += '<div class="printhead"><b>' + esc(NAME) + '</b>' + (m.hotel ? ' · ' + esc(m.hotel) : '') + ' · ' + esc(m.date) + '</div>';
    var acts = '<div class="btnrow toprow noprint" id="actions">' + pdfButton('Download (PDF)') +
      '<button type="button" class="btn" data-act="copy" id="copy">Copy summary</button><button type="button" class="btn" data-act="print" id="print">Print</button>' +
      '<button type="button" class="btn" data-act="save-file" id="save-file"' + (ui.dl !== 'idle' ? ' disabled' : '') + '>Save as file</button>' +
      (u && !u.notTool ? '<a class="btn" id="to-register" data-act="to-register" href="' + esc(regHref) + '">Add to the AI Register</a>' : '') +
      '<button type="button" class="btn" data-act="new" id="new-check">Start a new check</button></div>' +
      (ui.copy ? '<div class="copybox" id="copybox"><p class="meta">Copying is blocked here. Select the text and copy it:</p><textarea id="copytext" rows="12" readonly>' + esc(ui.copyText) + '</textarea></div>' : '');
    if (m.since) h += '<section class="panel since" id="since"><h3>' + esc(m.since.head) + '</h3><ul class="tight">' + m.since.lines.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      (m.since.earlier.length > 1 ? fold('earlier', 'Earlier results', '<ul>' + m.since.earlier.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>') : '') + '</section>';
    h += '<section class="verdict result ' + LV_CLASS[m.level] + '" id="result" data-level="' + m.level + '" data-pct="' + (ev.pct == null ? '' : ev.pct) + '">' +
      (m.hotel ? '<p class="meta" id="res-hotel">' + esc(m.hotel) + (m.filledBy ? ' · filled in by: ' + esc(m.filledBy) : '') + '</p>' : '') +
      '<h1 id="level-name">' + esc(m.levelName) + '</h1>' +
      '<p class="countline" id="reason"' + (m.held.length ? ' data-held="' + m.held.join(' ') + '"' : '') + '><strong>' + esc(m.reason) + '</strong></p>' +
      '<div class="scorerow"><span class="score' + (ev.pct == null ? ' noscore' : '') + '" id="score">' + esc(m.scoreHead) + '</span><span class="scoresub" id="score-sub">' + esc(m.scoreSub) + '</span></div>' +
      '<p id="level-line">' + esc(m.levelLine) + '</p><p class="countline" id="must-line">' + esc(m.mustLine) + '</p>' +
      (m.law ? '<p id="law"><strong>' + esc(m.law) + '</strong></p>' : '') +
      (m.cap ? '<p id="cap">' + esc(m.cap) + '</p>' : '') + (m.mustOnly ? '<p id="must-only"><strong>' + esc(m.mustOnly) + '</strong></p>' : '') + (m.draft ? '<p id="draft"><strong>' + esc(m.draft) + '</strong></p>' : '') + '</section>';
    h += acts; // design pass: the verdict first, then what to do with it
    h += '<section class="panel first" id="first"><h2>' + esc(m.firstLabel) + '</h2>' + (m.first.length ? '<ol>' + m.first.map(function (f) { return '<li><b>' + esc(f.who) + ':</b> ' + esc(f.text) + '<span class="meta">' + esc(f.sub) + '</span></li>'; }).join('') + '</ol>' : '<p>Every question is answered Yes or does not apply.</p>') + '</section>';
    h += '<div class="sumgrid"><section class="panel" id="sum-ai"><h3>Is this an AI problem?</h3><div class="aiv ' + vClass(L.verdict(rec.Q).key) + '">' + verdictBody(m.ai).replace(' id="verdict-head"', ' id="ai-head"') + '</div></section>' +
      '<section class="panel" id="sum-where"><h3>Where it sits</h3><p><b id="path">' + esc(m.path) + '</b></p>' + (m.useTask ? '<p id="use-does">' + esc(m.useTask) + '</p>' + (m.useHow ? '<p id="use-how">' + esc(m.useHow) + '</p>' : '') + '<p class="meta">' + esc(m.useLevel) + '</p>' + (m.catName ? '<p class="meta" id="cat-name">' + esc(m.catName) + '</p>' : '') : '') + (m.none ? '<p>' + esc(m.none) + '</p>' : '') + '</section></div>';
    h += '<section class="panel" id="areas"><h2>' + esc(m.areasHead) + '</h2><div class="bars">' + m.areas.map(function (a) {
      return '<div class="brow" data-area="' + a.k + '"><span class="lbl">' + esc(a.name) + '</span><span class="track" aria-hidden="true"><i class="w-' + a.cls + '" style="width:' + (a.yes ? Math.max(3, a.share) : 0) + '%"></i></span><span class="pct">' + esc(a.count) + '</span><span class="word w-' + a.cls + '">' + esc([a.word, a.unknown ? a.unknown + ' to find out' : ''].filter(Boolean).join(' · ')) + '</span></div>';
    }).join('') + '</div><p class="meta">“In place” counts the questions you answered Yes, out of those asked in the area. A word (Strong, Gaps to close, Weak) is given only where an area has two or more answers.</p></section>';
    h += '<section class="panel" id="plan"><h2>Action plan by person</h2>' + (m.people.length ? '<p class="meta">One list per person. Copy it into an email or a message.</p>' + m.people.map(function (p) {
      return '<div class="person" data-who="' + p.who + '"><div class="personhead"><h3>' + esc(p.name) + ' <span class="meta">(' + p.items.length + ')</span></h3><button type="button" class="btn small" data-act="copy-who" data-who="' + p.who + '" id="copy-' + p.who + '">Copy for ' + esc(p.name.toLowerCase().replace(/^the /, 'the ')) + '</button></div><ul class="todo">' +
        p.items.map(function (a) { return '<li><span>' + esc(a.text) + '</span><span class="meta">' + esc(a.tag) + '</span></li>'; }).join('') + '</ul></div>';
    }).join('') : '<p>Nothing open.</p>') + '</section>';
    if (m.vendor.length) h += row('vendor', 'Questions for the vendor (' + m.vendor.length + ')', '<div class="btnrow"><button type="button" class="btn small" data-act="copy-vendor" id="copy-vendor">Copy all</button></div><ol class="tight" id="vendor-list">' + m.vendor.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>');
    if (m.legal) {
      var l = m.legal, it = function (i) { return '<li>' + esc(i.text) + ' <span class="meta">' + esc(i.sub) + '</span></li>'; };
      h += row('legal', 'EU AI Act: provisional label, not legal advice', '<p class="meta" id="legal-note">' + esc(m.legalNote) + '</p><p><span class="chip c-label" id="legal-label">' + esc(l.name) + '</span> ' + (l.applies ? '<span class="meta">' + esc(l.applies) + '</span> ' : '') + esc(l.why) + '</p>' +
        l.could.map(function (c) { return '<p class="meta">' + esc(c) + '</p>'; }).join('') + (l.itemsHead ? '<h4>' + esc(l.itemsHead) + '</h4>' : l.items.length ? '<h4>Items to check</h4>' : '') +
        (l.items.length ? '<ul class="tight" id="legal-items">' + l.items.map(it).join('') + '</ul>' : '') + (l.labour ? '<p class="meta">' + esc(l.labour) + '</p>' : '') + '<p class="meta">' + esc(l.country) + '</p>', ' id="legal"');
    } else if (m.notTool) h += row('legal', 'EU AI Act', '<p>“' + esc(uName(u)) + '” is a document, not an AI tool, so the AI Register has no label for it.</p>', ' id="legal"');
    var grp = '';
    h += row('answers', 'Every question and your answer (' + m.itemList.length + ')', m.itemList.map(function (itm) {
      var g = itm.grp === 'must' ? 'Must-haves' : 'Questions for this use case', head = g !== grp ? '<h4>' + g + '</h4>' : ''; grp = g;
      return head + '<div class="arow"><span class="chip a-' + itm.state + '">' + esc(itm.answer) + '</span><span><b>' + esc(itm.name) + ':</b> ' + esc(itm.q) + '</span></div>';
    }).join(''), ' id="answers"');
    h += row('method', 'How this was worked out', '<ol class="tight" id="method">' + m.method.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>', ' id="how"');
    if (SHARING_ON || rec.sharedAt) h += sharePanel();
    h += '<div class="noprint">' + myChecks() + '</div>';
    h += sources('result');
    h += '<div class="navrow noprint"><button type="button" class="btn back" data-act="back" id="back">Back</button><span class="spacer"></span><button type="button" class="linkbtn" data-act="edit" id="edit">Change answers from the start</button></div>';
    return h;
  }
  function copyText(t, what) {
    function fallback() { ui.copy = true; ui.copyText = t; render(); var ta = $('copytext'); if (ta) { ta.focus(); ta.select(); } }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast(what + ' copied.'); }, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }
  var toastT;
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 3800); }

  // ---------- downloads (PDF and file): the readiness check's way, hub bridge with a plain link outside the hub ----------
  var DL_LABEL = { making: 'Preparing the PDF…', waiting: 'Preparing the PDF…', saving: 'Saving the PDF…' };
  function pdfButton(label) {
    var busy = ui.dl !== 'idle';
    return '<button type="button" class="btn' + (rec.step === 'result' ? ' primary' : '') + '" data-act="pdf" id="pdf"' + (busy ? ' disabled aria-busy="true"' : '') + '>' + esc(busy ? DL_LABEL[ui.dl] : label) + '</button>';
  }
  function dlSend(ev) {
    var to = F.dlNext(ui.dl, ev, host.state); if (to === null) return false;
    ui.dl = to; $('app').setAttribute('data-dl', to);
    var b = $('pdf'), sf = $('save-file'); if (sf) sf.disabled = to !== 'idle';
    if (b) { b.disabled = to !== 'idle'; if (to !== 'idle') { b.setAttribute('aria-busy', 'true'); if (ui.dlKind === 'pdf') b.textContent = DL_LABEL[to]; } else render(); }
    return true;
  }
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
      if (m.hub === 'pong') { var first = !host.pong; host.pong = true; hostSend(m.downloads ? 'yes' : 'no'); if (first) render(); }
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
  function pdfName() { return P.fileName(rec.hotel.name, L.localIso()); }
  function downloadPdf() {
    if (rec.step !== 'result' && rec.step !== 'stop') return false;
    ui.dlKind = 'pdf';
    if (!dlSend('start')) { toast('A download is still being prepared.'); return false; }
    var mdl = P.model(rec, env()), name = pdfName();
    setTimeout(function () {
      var blob;
      try {
        if (!window.jspdf) throw new Error('jsPDF not bundled');
        blob = P.draw(mdl, window.jspdf, pdfFont()).doc.output('blob');
      } catch (e) { dlSend('fail'); toast('The PDF could not be made here. Use “Copy summary” or “Print” instead.'); return; }
      dlSend('made'); saveFile(name, blob);
    }, 30);
    return true;
  }
  /* The check as a file (JSON) the hotel keeps: { kind: 'hftp-do-you-need-ai', v: 2, rules, savedAt, check }. */
  var FILE_KIND = 'hftp-do-you-need-ai';
  var OLD_KIND = 'hftp-readiness-check'; // files of the earlier Readiness check (audit L8)
  function fileDoc() { return { kind: FILE_KIND, v: F.V, rules: L.RULES, savedAt: new Date().toISOString(), check: JSON.parse(JSON.stringify(F.forFile(rec))) }; }
  function saveRecord() {
    if (rec.step !== 'result') return false;
    ui.dlKind = 'file';
    if (!dlSend('start')) { toast('A download is still being prepared.'); return false; }
    var name = pdfName().replace(/\.pdf$/, '.json'), blob = new Blob([JSON.stringify(fileDoc(), null, 1)], { type: 'application/json' });
    /* Audit L1: 'made' in a later tick, as the PDF does, so the button stays disabled across a double-click. */
    setTimeout(function () { dlSend('made'); saveFile(name, blob); }, 30);
    return true;
  }
  function loadRecord(file) {
    var fr = new FileReader();
    fr.onload = function () { openFileText(String(fr.result)); };
    fr.onerror = function () { toast('That file could not be read.'); };
    fr.readAsText(file);
  }
  function openFileText(text) {
    var r = null, info = {}, old = false;
    try {
      var o = JSON.parse(text);
      if (o && o.kind === FILE_KIND && o.check && typeof o.v === 'number' && o.v <= F.V) r = F.cleanRec(o.check, ENV, info, { file: true });
      else if (o && o.kind === FILE_KIND && o.v > F.V) { toast('That file was saved by a newer version of this page.'); return false; }
      else if (o && o.kind === OLD_KIND) old = true;
    } catch (e) { r = null; }
    if (old) { ui.fileNote = 'old'; render(); toast(C.OLD_FILE); return false; }
    if (!r) { toast('That file is not a check saved from this page.'); return false; }
    ui.fileNote = null; r.tqSig = r.tqSig || ''; ui.fileInfo = noticeOf(info); // what the file's check lost on the way in (audit M5): said after it opens
    if (store.checks[r.id] && F.listed(store.checks[r.id])) { ui.file = r; ui.confirm = F.confirmNext(ui.confirm, 'ask', 'file').c; render(); var y = $('import-yes'); if (y) { y.scrollIntoView({ block: 'center' }); y.focus(); } return true; }
    return send('import', r, { notice: ui.fileInfo });
  }

  // ---------- sharing (opt-in): the readiness check's store and paths (readiness/<viewer id>/checks/<check id>) ----------
  function shareDoc() {
    var m = model(), ev = m.ev, named = rec.share.named, u = USE[rec.use];
    var d = { kind: 'dyn', v: 2, rules: L.RULES, useId: rec.use, useName: u ? uName(u) : '', dept: rec.dept, cat: rec.cat, role: rec.hotel.role, type: rec.hotel.type, country: rec.hotel.country,
      Q: Object.assign({}, rec.Q), answers: Object.assign({}, rec.A), tailored: Object.assign({}, rec.T), by: Object.assign({}, rec.By), tby: Object.assign({}, rec.TBy),
      level: ev.level, pct: ev.pct, known: ev.counts.known, total: ev.counts.total, met: ev.must.yes, gates: ev.must.n, open: L.open(ev).length,
      reason: ev.reason, held: ev.held.slice(),
      /* Audit M1: only the history of this use case goes to the team, each entry with the rules it was worked out with. */
      snaps: L.snapsOf(rec.snaps).map(function (s) { return { at: s.at, level: s.level, pct: s.pct, met: s.mustYes, rules: s.rules }; }), sharedAt: new Date().toISOString(), named: named };
    if (named) d.hotelName = rec.hotel.name;
    return d;
  }
  /* The outcome of a share or a withdrawal is written to the check it belongs to, open or not (audit M2). */
  function sharePatch(e2, arg) {
    var r = F.reduce(store, e2, arg, ENV); if (!r.ok) return false;
    apply(r); save(); return true;
  }
  /* Take a copy back from wherever it went. A test copy made outside the hub never reached the team: it is cleared from this
     browser's test list. A copy sent from the hub can only be withdrawn there (rejects { code: 'mode' }). */
  function withdrawCopy(id) {
    var r = recOf(id);
    return S.ready().then(function (mode) {
      if (r && r.sharedMode === 'shared' && mode !== 'shared') throw { code: 'mode' };
      if (r && r.sharedMode === 'local' && mode === 'shared') { try { var o = JSON.parse(localStorage.getItem('hftp-readiness-checks-v1') || '{}') || {}; delete o[id]; localStorage.setItem('hftp-readiness-checks-v1', JSON.stringify(o)); } catch (e) { /* blocked */ } return; }
      return S.remove(id);
    });
  }
  /* SHARE machine. id: the check (default: the open one). 'share' makes a copy of the open result; 'withdraw' works for any check, on any step (audit H1). */
  function shareSend(ev, id) {
    id = id || rec.id; var r0 = recOf(id);
    if (!S || !r0 || ui.share) return;
    if (ev === 'share' && (!SHARING_ON || id !== rec.id || rec.step !== 'result')) return;
    var to = F.shareNext(sharePhaseOf(id), ev); if (!to) return;
    var doc = ev === 'share' ? shareDoc() : null, sig = F.shareSig(r0);
    ui.share = { phase: to, id: id }; if (id === rec.id) ui.open.share = true; render();
    var done = function () { if (ui.share && ui.share.id === id) ui.share = null; };
    var unsaved = function () { return storage === 'ok' ? '' : ' This browser is not keeping changes, so the page will not remember this after you close it.'; };
    if (ev === 'share') {
      S.save(id, doc).then(function (mode) {
        done();
        if (!recOf(id)) { S.remove(id).then(function () {}, function () {}); render(); toast('The check was removed while its copy was being sent, so the copy was withdrawn again.'); return; }
        sharePatch('shared', { id: id, at: new Date().toISOString(), mode: mode, sig: sig }); if (id === rec.id) ui.open.share = true; render();
        toast((mode === 'shared' ? 'Copy shared with the project team.' : 'Saved as a test copy in this browser only (outside the project hub).') + unsaved());
      }, function () { done(); render(); toast('Sharing is not available here. Save the file and send it instead.'); });
    } else {
      withdrawCopy(id).then(function () { done(); sharePatch('unshared', { id: id }); render(); toast('Shared copy withdrawn.'); },
        function (e) { done(); render(); toast(e && e.code === 'mode' ? 'This copy was shared from the project hub: open the check there to withdraw it.' : 'Could not withdraw here. Ask the team to delete it.'); });
    }
  }

  // ---------- render ----------
  var VIEWS = { start: vStart, hotel: vHotel, q: vQ, stop: vStop, must: vMust, where: vWhere, tailored: vTailored, result: vResult };
  function render() {
    var a = document.activeElement, keep = a && a.id && a !== document.body ? a.id : null;
    var app = $('app');
    app.setAttribute('data-state', rec.step);
    app.setAttribute('data-verdict', L.verdict(rec.Q).key);
    app.setAttribute('data-storage', storage);
    app.setAttribute('data-check', rec.id);
    if (rec.step === 'result') app.setAttribute('data-level', L.evaluate(rec, TQ).level); else app.removeAttribute('data-level');
    var fk = $('foot-keep'); if (fk) fk.hidden = storage !== 'ok';
    $('hdr').innerHTML = header();
    $('view').innerHTML = VIEWS[rec.step]();
    if (keep && $(keep) && keep !== 'view') $(keep).focus({ preventScroll: true });
  }

  // ---------- events ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.getAttribute('data-act'), m;
    if (act === 'explain') { e.preventDefault(); var xid = t.getAttribute('data-ex'); ui.explain = ui.explain === xid ? null : xid; render(); return; } // v2.2: never chooses the row
    if (act === 'cat') send('cat', t.getAttribute('data-cat'));
    else if (act === 'dept') send('dept', t.getAttribute('data-dept'));
    else if (act === 'copy') copyText(L.summaryText(model()), 'Summary');
    else if (act === 'copy-who') { m = model(); var p = m.people.filter(function (x) { return x.who === t.getAttribute('data-who'); })[0]; if (p) copyText(L.personText(m, p, USE[rec.use] ? '· ' + uName(USE[rec.use]) : ''), 'List for ' + p.name.toLowerCase()); }
    else if (act === 'copy-vendor') { m = model(); copyText('Questions about ' + (USE[rec.use] ? uName(USE[rec.use]) : 'the tool') + ':\n\n' + m.vendor.map(function (q, i) { return (i + 1) + '. ' + q; }).join('\n'), 'Vendor questions'); }
    else if (act === 'print') window.print();
    else if (act === 'pdf') { if (!t.disabled) downloadPdf(); }
    else if (act === 'save-file') { if (!t.disabled) saveRecord(); }
    else if (act === 'share') shareSend('share');
    else if (act === 'unshare') shareSend('withdraw', t.getAttribute('data-id') || rec.id);
    else if (act === 'to-register') { if (rec.step !== 'result' || !USE[rec.use]) { e.preventDefault(); return; } hubOpen('register', registerHash(), t.getAttribute('href'), e); }
    else if (act === 'catalogue') { if (host.pong) { e.preventDefault(); try { window.parent.postMessage({ hub: 'open', tool: 'use-case-catalogue', hash: t.getAttribute('data-dept') }, location.origin); } catch (err) { window.open(t.getAttribute('href'), '_blank', 'noopener'); } } }
    else if (act === 'open' || act === 'remove' || act === 'remove-yes' || act === 'remove-withdraw') send(act, t.getAttribute('data-id'));
    else send(act);
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('input[data-answer]')) send('answer', { id: t.getAttribute('data-answer'), value: t.value });
    else if (t.matches('input[data-use]')) send('use', t.value);
    else if (t.matches('input[data-by]')) send('by', { id: t.getAttribute('data-by'), date: t.value || '' });
    else if (t.matches('select[data-h]')) send('hotel', { k: t.getAttribute('data-h'), v: t.value });
    else if (t.matches('input[data-share]')) send('share', { named: t.checked });
    else if (t.id === 'file-open') { if (t.files && t.files[0]) loadRecord(t.files[0]); t.value = ''; }
  });
  document.addEventListener('input', function (e) { var t = e.target; if (t.matches && t.matches('input[data-h="name"]')) send('hotel', { k: 'name', v: t.value }, { quiet: true }); });
  document.addEventListener('toggle', function (e) { var d = e.target; if (d && d.getAttribute && d.getAttribute('data-fold') && !d.hasAttribute('data-print-open')) { var k = d.getAttribute('data-fold'), was = !!ui.open[k]; ui.open[k] = d.open; if (d.open && !was) ease(d.querySelector(':scope > .morebody, :scope > .foldbody'), 4, 150); } }, true);
  /* Print (audit, "unverified"): a closed fold prints nothing, so the result's folds (vendor questions, AI Act label, every answer,
     the working-out) are opened for printing and closed again afterwards. */
  window.addEventListener('beforeprint', function () { [].forEach.call(document.querySelectorAll('#view details.fold'), function (d) { if (!d.open) { d.setAttribute('data-print-open', ''); d.open = true; } }); });
  window.addEventListener('afterprint', function () { [].forEach.call(document.querySelectorAll('#view details[data-print-open]'), function (d) { d.open = false; setTimeout(function () { d.removeAttribute('data-print-open'); }, 0); }); });
  /* Back/forward. Our own entry for this check → pop to its step. Anything else (a hash change, a hub entry, another check's entry) is
     not a step of this check: the step stays and the entry is marked as ours. */
  var skipRun = 0; // HISTORY: entries passed over by the Back/forward press in progress (F.histSkip)
  window.addEventListener('popstate', function (e) {
    var h = F.histRead(e.state), run = skipRun; skipRun = 0;
    if (!h.ours) {
      if (fromHash()) return; // a hash link (#use=<id>) arrives as a popstate first: handle it before the entry is rewritten without its hash
      hist.d += 1; hist.prev = rec.step; histAssert(); return;
    }
    /* v2.1 (audit M4, L10): an entry of another check, or one that would only show a substitute screen, is passed over, so Back never goes dead. */
    var dir = F.histSkip(h, { id: rec.id, d: hist.d, step: rec.step, placed: F.placeStep(h.step, ctx()), run: run });
    hist.d = h.d; hist.prev = dir ? null : h.prev; hist.len = history.length;
    if (dir) { skipRun = run + 1; try { history.go(dir); } catch (err) { skipRun = 0; } return; }
    send('pop', h.step);
  });
  /* TABS (audit M3): another tab of this browser saved the store. The open check stays this tab's own; the other checks are
     taken over; if the other tab changed or removed the open check itself, a line says so (F.mergeTabs). */
  function follow() {
    var x = readStore(store.cur); if (!x || !x.store) return;
    var m = F.mergeTabs(store, x.store);
    store = m.store; rec = F.cur(store); ui.elsewhere = m.elsewhere; ui.confirm = null; ui.file = null; render();
  }
  window.addEventListener('storage', function (e) { if (e.key === F.KEY) follow(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) follow(); });

  /* Old links and the AI Register: #use=<use id> starts a check with that use case already chosen in step 4. */
  function fromHash() {
    var m = /(?:^|[#&])use=([a-z]+-\d+)/.exec(location.hash || ''); if (!m || !USE[m[1]]) return false;
    return send('preselect', m[1]);
  }
  if (S) S.ready().then(function () { $('app').setAttribute('data-store', S.state()); if (rec.step === 'result') render(); });
  adoptProfile();
  setTabCur();
  if (!fromHash()) { histAssert(); takeSnap(); if (rec.step === 'result') save(); render(); }
  window.addEventListener('hashchange', function () { fromHash(); });

  /* AX: read the state without scraping the page; drive it with the same events the buttons send. */
  window.Readiness2 = {
    state: function () {
      var v = L.verdict(rec.Q), c = ctx(), ev = rec.step === 'result' ? L.evaluate(rec, TQ) : null;
      return { step: rec.step, id: rec.id, hotel: Object.assign({}, rec.hotel), Q: Object.assign({}, rec.Q), verdict: v.key, carried: v.carried.map(function (x) { return x.id; }), find: v.find.map(function (x) { return x.id; }),
        A: Object.assign({}, rec.A), By: Object.assign({}, rec.By), cat: rec.cat, dept: rec.dept, use: rec.use, T: Object.assign({}, rec.T), TBy: Object.assign({}, rec.TBy), tailored: tailQs().map(function (q) { return q.id; }),
        from: rec.from || '', tqSig: rec.tqSig || '', elsewhere: ui.elsewhere, fileNote: ui.fileNote, corrupt: ui.corrupt, rules: L.RULES, judgement: Object.assign({}, L.JUDGEMENT),
        reason: ev ? ev.reason : null, held: ev ? ev.held.slice() : null, score: ev ? L.scoreHead(ev) : null,
        ctx: c, events: F.events(rec.step, c), level: ev ? ev.level : null, pct: ev ? ev.pct : null, counts: ev ? ev.counts : null, must: ev ? ev.must : null,
        confirm: ui.confirm, missing: ui.missing, copyBox: ui.copy, storage: storage, notice: ui.notice, storeNotice: store.notice || null, checks: listedIds(), snaps: rec.snaps.length,
        inHub: host.pong, inFrame: IN_FRAME, download: ui.dl, bridge: host.state, share: sharePhase(), sharedAt: rec.sharedAt, shareStore: S ? S.state() : null, sharingOn: SHARING_ON,
        history: { d: hist.d, prev: hist.prev } };
    },
    record: function () { return JSON.parse(JSON.stringify(rec)); },
    store: function () { return JSON.parse(JSON.stringify(store)); },
    send: send,
    events: function () { return F.events(rec.step, ctx()); },
    resultModel: function () { var m = model(); delete m.ev; return m; },
    summaryText: function () { return L.summaryText(model()); },
    pdfModel: function () { return P.model(rec, env()); },
    pdfName: pdfName,
    fileDoc: fileDoc,
    openFileText: openFileText,
    shareDoc: shareDoc,
    catalogue: { uses: CAT.nUses, depts: CAT.nDepts }
  };
})();
