/* Do you need AI? v3 (tools/readiness-3): the page. Draws each screen from the record (R3Store), the rules (R3Rules) and the
   result model (R3Result); every hotel-facing string from the question data is used verbatim. Chrome text written here is plain
   English and passes the banned-term grep (lib/banned.mjs).
   Storage: window.storage (artifact storage, personal scope; optional, its API is not part of the artifact runtime contract and is
   untested in the viewer) when the viewer offers it, else localStorage, else memory (with a banner). Key hftp-readiness3-v1 holds
   the index { v, cur, ids }; each check is one record under hftp-readiness3-v1_c_<id>.
   Downloads (PDF, saved file) go only through the artifact downloads capability (window.claude.use("downloads")); when it is not
   there, Copy is offered instead. No page-started download links.

   State machines (clean-up v1 and v2, reports/audit-readiness-3/cleanup_inventory_v1.md and _v2.md):
   - Screen flow: rec.step = start | hotel | s2 | stop | must | where | use | result. The only writer is setStep() (a known step,
     then R3Store.place), used by go(), boot, opening a file, taking another tab's version and Remove. Events, all through send():
     begin, resume, next, back, change, continue, goto <step>, goto-mh <id>, new, answer, hotel, use, area, dept, search. send()
     checks every event against one guard table (okSend) and returns false, changing nothing, for a step, id or value the page
     cannot draw (clean-up v2, N8). Replacing the open check (new, open a check, open a file, remove) goes through replaceRec(),
     which also resets the transient UI (resetUi).
   - Step 4 levels: areas (four tiles) → departments of the area (tiles) → the department's use cases (radios); the search box
     above shows matches from any level. ui.area / ui.dept: null = follow the chosen use case, '' = the level above.
   - Storage: ST.kind = artifact | local | memory; save state = pending (a save waits, 120 ms) | saved | memory (not saved). A
     failed read (not "not found") or write moves to memory with the banner. Boot settles within 3 s or falls back to memory.
     save() = a real change (an answer, the hotel details, Continue anyway, the import seen, Keep my answers): it stamps
     rec.updated, then persists; moving between screens and session timing only persist() (clean-up v2, N15).
     The index is merged with the stored one on every write (two tabs keep both checks).
   - Conflict: none | held(other). A record changed elsewhere while this tab has unsaved answers raises the banner and holds the
     write; a further change elsewhere refreshes the other version (N2). While held, nothing may replace the open check (new,
     open, file, remove): focus goes to the banner (N3). A removal elsewhere: gone (banner, nothing written back until Keep it
     here, N14).
   - Downloads: per button (pdf, save-file) idle | busy (aria-busy, "Preparing…", further clicks ignored); results saved |
     declined | busy | fallback (Copy box) | moved (the user left the screen: a toast, N12). Only a real capability is
     remembered (N16).
   - Copy box (ui.copy): closed | open { kind: save | plan | text, msg, label, text, from }; a save box draws the saved check
     live from the record (N4); drawn under the banner on every screen without its own place.
   - File open: bad | newer | opened | opened as a copy (this browser holds a newer version of the same check, or a readiness-2
     file over a check made from it) | migrated.
   AX: #app[data-state] = the step, #app[data-storage] = ST.kind; window.Readiness3.state() adds saved, copy, busy, conflict,
   gone, fileErr, where and session; window.Readiness3.send(event, arg) drives the flow and returns false when it refuses.
   Session timing (council v3.0, BUILD NOW 8; v3.0.1, BUILD NOW 7 and 8): with ?session=1 in the URL (or #session in the
   address), rec.timing = { <step>: [first enter, last leave, ms] } (time with the page hidden is not counted) and
   rec.searches = [{ q, at }] (search words of 3 or more letters that found nothing for 1.5 s) are kept in the record and in saved
   files. Nothing is shown and nothing is sent anywhere.
   Test and agent API: window.Readiness3 (state, record, model, send, pdfModel, pdfBytes, fileDoc, openText, flush). */
(function () {
  'use strict';
  var R = window.R3Rules, S = window.R3Store, RES = window.R3Result, X3 = window.R3Data;
  function $(id) { return document.getElementById(id); }
  function json(id) { var e = $(id); if (!e) return null; try { return JSON.parse(e.textContent); } catch (err) { return null; } }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  var D = json('r3-data'), EX = json('r3-ex') || {}, CAT = json('r3-cat') || { areas: [], deptArea: {}, uc: {} }, MIG = json('r3-mig'), FONT = json('r3-font');
  var IX = X3.index(D);
  var KEY = 'hftp-readiness3-v1', OLD_KEY = 'hftp-readiness2-v1', REC = KEY + '_c_';
  var BOOT_MS = 3000, DL_MS = 10000;
  var SESSION = (function () { try { return /[?&]session=1(&|$)/.test(window.location.search) || /^#(.*&)?session(=1)?(&|$)/.test(window.location.hash); } catch (e) { return false; } })();
  var STEP_NAMES = ['About your hotel', 'Is this an AI problem?', 'Must-haves', 'Where in the hotel?', 'Questions for this use case'];
  var TYPES = [['independent', 'Independent hotel'], ['group', 'Part of a group, run by the group'], ['managed', 'Managed or franchised']];
  var ROLES = [['gm', 'General manager'], ['owner', 'Owner or asset manager'], ['dept', 'Head of a department'], ['it', 'IT or technology lead'], ['fin', 'Finance'], ['other', 'Other']];
  var COUNTRIES = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Other'];
  var PLANNED_HELP = 'If your vendor has confirmed it in writing but it isn\'t set up yet, answer Planned.';
  /* council v3.0.1, BUILD NOW 2: the consequence of Don't know yet on How it works, said on screen (UI copy; the rule is unchanged) */
  var HIW_HELP = 'No tool chosen yet? Answer Don\'t know yet, or ask the vendor. You can change it on this screen later. With Don\'t know yet here, the result stays at Almost ready at best until you know.';
  var T = {
    noStore: 'Your answers can\'t be saved in this browser. Use Save as file.',
    badFile: 'This file isn\'t a saved check from this tool.',
    newerFile: 'This file was saved with a newer version of this tool. Open it there.',
    pdfFail: 'The PDF couldn\'t be made. Use Copy instead.',
    noDl: 'Downloads are not available here. Use Copy instead.',
    saveFail: 'The file couldn\'t be saved here. Use Copy instead.',
    copyOpened: 'Opened as a copy: this browser has a newer version of this check.',
    conflict: 'This check was changed in another tab or window. Your latest answers are not saved yet.',
    held: 'Choose Keep my answers or Use the other version first.',
    gone: 'This check was removed in another tab.'
  };
  var DL_LABEL = { pdf: 'Download (PDF)', 'save-file': 'Save as file' };

  var rec = S.blank(), idx = { v: 1, cur: rec.id, ids: [] }, ready = false;
  var ui = { warned: '', why: {}, area: null, dept: null, q: '', copy: null, fileErr: '', focus: null, toTop: false, mark: '', busy: {}, conflict: null, gone: false, listFocus: null, confirmBack: '', tStep: '', tRec: '', tAt: 0, tPaused: false, sTimer: null };
  /* The transient UI of one check: cleared whenever the open check is replaced (clean-up H1, M4). */
  function resetUi() { ui.warned = ''; ui.why = {}; ui.area = null; ui.dept = null; ui.q = ''; ui.copy = null; ui.fileErr = ''; ui.mark = ''; ui.conflict = null; ui.gone = false; }

  /* ---------- storage ---------- */
  var mem = {}, removed = {}, base = null; /* base: the "updated" stamp of the open check as last read from or written to storage */
  var MISSING = /not.?found|missing|no such|does ?n[o']?t exist|no value|unknown key/i;
  function isMissing(e) { return !e || MISSING.test(String((e && (e.code || e.message)) || e)); }
  var ST = {
    kind: 'memory', locked: false,
    init: function () {
      var self = this;
      function local() { if (self.locked) return; try { localStorage.setItem(KEY + '_probe', '1'); localStorage.removeItem(KEY + '_probe'); self.kind = 'local'; } catch (e) { self.kind = 'memory'; } }
      try {
        if (window.storage && typeof window.storage.get === 'function' && typeof window.storage.set === 'function') {
          return Promise.resolve(window.storage.set(KEY + '_probe', '1', false)).then(function () { if (self.locked) return; self.kind = 'artifact'; try { window.storage.delete(KEY + '_probe', false); } catch (e) {} }, local);
        }
      } catch (e) {}
      local(); return Promise.resolve();
    },
    /* resolves the stored text, or null when the key is not there; rejects when the read failed (clean-up L1) */
    get: function (k) {
      if (this.kind === 'artifact') return Promise.resolve().then(function () { return window.storage.get(k, false); }).then(function (r) { return r && typeof r.value === 'string' ? r.value : null; }, function (e) { if (isMissing(e)) return null; throw e; });
      return Promise.resolve(this.peek(k));
    },
    /* synchronous read for localStorage and memory; undefined for artifact storage (async only) */
    peek: function (k) {
      if (this.kind === 'local') { try { return localStorage.getItem(k); } catch (e) { return null; } }
      if (this.kind === 'memory') return own(mem, k) ? mem[k] : null;
      return undefined;
    },
    set: function (k, v) {
      var self = this;
      if (self.kind === 'artifact') return Promise.resolve().then(function () { return window.storage.set(k, v, false); }).then(function () { return true; }, function () { self.fail(); mem[k] = v; return false; });
      return Promise.resolve(self.setNow(k, v));
    },
    setNow: function (k, v) {
      if (this.kind === 'local') { try { localStorage.setItem(k, v); return true; } catch (e) { this.fail(); } }
      mem[k] = v; return false;
    },
    del: function (k) {
      delete mem[k];
      if (this.kind === 'artifact') return Promise.resolve().then(function () { return window.storage.delete(k, false); }).catch(function () {});
      if (this.kind === 'local') { try { localStorage.removeItem(k); } catch (e) {} }
      return Promise.resolve();
    },
    fail: function () { this.locked = true; if (this.kind !== 'memory') { this.kind = 'memory'; if (ready) drawBanner(); } }
  };
  function parseRec(t) { try { return t ? S.clean(D, JSON.parse(t)) : null; } catch (e) { return null; } }
  function parseIdx(t) { var I = null; try { I = t ? JSON.parse(t) : null; } catch (e) { I = null; } return I && Array.isArray(I.ids) ? { v: 1, cur: typeof I.cur === 'string' ? I.cur : '', ids: I.ids.filter(function (x) { return typeof x === 'string'; }) } : null; }
  var saveTimer = null, flushQ = Promise.resolve();
  /* save(): a real change, stamped; persist(): write what is there (screen moves, timing), no stamp (clean-up v2, N15). */
  function stamp() { rec.updated = new Date().toISOString(); }
  function persist() { clearTimeout(saveTimer); saveTimer = setTimeout(flush, 120); }
  function save() { stamp(); persist(); }
  /* A check removed in another tab is neither listed nor written back here until Keep it here (clean-up v2, N14). */
  function listIt(r) { if (removed[r.id]) idx.ids = idx.ids.filter(function (x) { return x !== r.id; }); else if (S.hasAnswers(r) && idx.ids.indexOf(r.id) < 0) idx.ids.push(r.id); idx.cur = r.id; }
  /* Merge the stored index into this tab's (clean-up M1): ids another tab listed are kept; ids removed here stay removed; with
     localStorage, ids whose record is gone (removed in another tab) are dropped. */
  function mergeIdx(t) {
    var I = parseIdx(t);
    if (I) I.ids.forEach(function (id) { if (!removed[id] && idx.ids.indexOf(id) < 0) idx.ids.push(id); });
    if (ST.kind === 'local') idx.ids = idx.ids.filter(function (id) { return (id === rec.id && !removed[id]) || ST.peek(REC + id) !== null; });
  }
  /* A stored record of the open check that differs from the one this tab last read or wrote: changed elsewhere (clean-up M2). */
  function changedElsewhere(stored) { return !!stored && stored.updated !== base; }
  function flush() {
    clearTimeout(saveTimer); saveTimer = null;
    if (ST.kind !== 'artifact') { flushNow(); return Promise.resolve(); }
    flushQ = flushQ.then(flushAsync, flushAsync); return flushQ;
  }
  function flushNow() {
    var r = rec; listIt(r);
    if (ST.kind === 'local' && !removed[r.id]) {
      var stored = parseRec(ST.peek(REC + r.id));
      if (!ui.conflict && changedElsewhere(stored)) { ui.conflict = stored; if (ready) drawBanner(); }
      if (!ui.conflict && ST.setNow(REC + r.id, JSON.stringify(r))) base = r.updated;
      if (ST.kind === 'local') mergeIdx(ST.peek(KEY));
    }
    else if (ST.kind === 'local') mergeIdx(ST.peek(KEY));
    if (ST.kind === 'memory') mem[REC + r.id] = JSON.stringify(r);
    ST.setNow(KEY, JSON.stringify(idx));
  }
  function flushAsync() {
    var r = rec; listIt(r);
    if (removed[r.id]) return ST.get(KEY).then(function (t) { mergeIdx(t); return ST.set(KEY, JSON.stringify(idx)); }).catch(function () {});
    return ST.get(REC + r.id).then(function (t) {
      if (r === rec && !ui.conflict && changedElsewhere(parseRec(t))) { ui.conflict = parseRec(t); if (ready) drawBanner(); }
      if (r === rec && ui.conflict) return null;
      return ST.set(REC + r.id, JSON.stringify(r)).then(function (done) { if (done && r === rec) base = r.updated; });
    }).then(function () { return ST.kind === 'artifact' ? ST.get(KEY) : null; }).then(function (t) { mergeIdx(t); return ST.set(KEY, JSON.stringify(idx)); })
      .catch(function () { ST.fail(); mem[REC + r.id] = JSON.stringify(r); mem[KEY] = JSON.stringify(idx); });
  }
  function loadRec(id) { return ST.get(REC + id).then(parseRec, function () { return null; }); }
  function listChecks() {
    return Promise.all(idx.ids.map(function (id) { return id === rec.id ? Promise.resolve(rec) : loadRec(id); })).then(function (rs) { return rs.filter(Boolean); });
  }
  /* Replace the open check (new, open a check, open a file, remove). b: the stored "updated" stamp of r, or null if r is not stored. */
  function replaceRec(r, b) {
    var old = rec;
    if (old.id !== r.id && !S.hasAnswers(old) && idx.ids.indexOf(old.id) < 0) ST.del(REC + old.id); /* an untouched check is not kept */
    rec = r; idx.cur = r.id; base = b == null ? null : b; resetUi();
  }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function toast(t) { var e = $('toast'); e.textContent = t; clearTimeout(toast.t); toast.t = setTimeout(function () { e.textContent = ''; }, 4200); }
  function today() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
  function A() { return S.answers(D, rec); }
  function model() { return RES.model(D, rec, EX, today()); }
  function uid(s) { return String(s).replace(/[^A-Za-z0-9_-]/g, '_'); }
  function gloss(texts) {
    var g = X3.acronyms(D, texts);
    return g.length ? '<p class="gloss" id="gloss">Words on this page: ' + g.map(function (x) { return '<b>' + esc(x.abbr) + '</b> means ' + esc(x.full); }).join('; ') + '.</p>' : '';
  }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* one radio group; kind: s2 | mh | q | gate */
  function radios(kind, id, options, value, labelledby) {
    var name = 'n-' + kind + '-' + uid(id);
    return '<div class="opts' + (kind === 'gate' ? ' gate' : '') + '" role="radiogroup" aria-labelledby="' + labelledby + '">' + options.map(function (o) {
      var iid = 'r-' + kind + '-' + uid(id) + '-' + o.key;
      return '<label class="opt" for="' + iid + '"><input type="radio" id="' + iid + '" name="' + name + '" value="' + esc(o.key) + '" data-kind="' + kind + '" data-id="' + esc(id) + '"' + (value === o.key ? ' checked' : '') + '>' + esc(o.label) + '</label>';
    }).join('') + '</div>';
  }
  function whyToggle(key, text) {
    if (!text) return '';
    var id = 'why-' + uid(key), open = !!ui.why[key];
    return '<div><button type="button" class="linkbtn" data-act="why" data-id="' + esc(key) + '" aria-expanded="' + open + '" aria-controls="' + id + '">Why we ask</button><p class="why" id="' + id + '"' + (open ? '' : ' hidden') + '>' + esc(text) + '</p></div>';
  }
  function nav(backLabel, nextLabel, extra) {
    return '<div class="navrow">' + (backLabel ? '<button type="button" class="btn back" data-act="back">' + esc(backLabel) + '</button>' : '') + (extra || '') +
      (nextLabel ? '<button type="button" class="btn primary" data-act="next">' + esc(nextLabel) + '</button>' : '') + '</div>';
  }
  /* A download button (pdf, save-file) with its busy state (clean-up L10). */
  function dlBtn(act, id, cls) {
    var busy = !!ui.busy[act];
    return '<button type="button" class="btn' + (cls ? ' ' + cls : '') + '" data-act="' + act + '" id="' + id + '" data-label="' + esc(DL_LABEL[act]) + '"' + (busy ? ' aria-busy="true" aria-disabled="true"' : '') + '>' + esc(busy ? 'Preparing…' : DL_LABEL[act]) + '</button>';
  }
  /* The note after Next / See the result with questions open. It counts only what is on screen and names the button that is there
     (council v3.0.1, BUILD NOW 1; clean-up v2, N5): on a held step 5, the open How it works questions and the range that follows. */
  function nextLabel(step) { return step === 'use' ? 'See the result' : 'Next'; }
  function openNote(step) {
    if (ui.warned !== step) return '';
    var o = S.open(D, rec, step), n = o.length; if (!n) return '';
    var gOpen = o.filter(function (x) { return x.indexOf('gate:') === 0; }).length, msg;
    if (step === 'use' && gOpen) {
      var a = A(), rg = pendingRange(a.use, R.askedGates(D, a.use), a.gates), one = gOpen === 1;
      var follow = rg[1] === 0 ? '' : ' and ' + (rg[0] === rg[1] ? 'the ' + plural(rg[0], 'question', 'questions') : 'the ' + rg[0] + ' to ' + rg[1] + ' questions') + ' after ' + (one ? 'it' : 'them');
      msg = (one ? 'The How it works question has no answer yet. If you go on, it' : 'The ' + gOpen + ' How it works questions have no answer yet. If you go on, they') + follow + (one && !follow ? ' counts' : ' count') + ' as Don\'t know yet.';
    } else msg = plural(n, 'question has', 'questions have') + ' no answer yet. ' + (n === 1 ? 'It counts' : 'They count') + ' as Don\'t know yet.';
    return '<div class="note" id="open-note" role="alert"><p>' + esc(msg + ' Press ' + nextLabel(step) + ' again to go on.') + '</p>' +
      '<p><button type="button" class="linkbtn" data-act="first-open">Go to the first one</button></p></div>';
  }

  /* ---------- header, banner ---------- */
  function drawHeader() {
    var st = rec.step, n = S.NUM[st], h = '<div class="hdrtop">' + (st !== 'start' ? '<span class="brand">Do you need AI?</span>' : '') +
      (st !== 'start' ? '<button type="button" class="linkbtn" data-act="new" id="new-check">Start a new check</button>' : '') + '</div>';
    if (st !== 'start') {
      h += '<nav class="prog" aria-label="Progress"><p class="progline" id="progline">' + (n ? '<b>Step ' + n + ' of 5</b>: ' + esc(STEP_NAMES[n - 1]) : '<b>Result</b>: all five steps done') + '</p>' +
        '<ol class="bar">' + STEP_NAMES.map(function (nm, i) { var k = i + 1, c = !n || k < n ? 'done' : k === n ? 'now' : ''; return '<li class="' + c + '"' + (k === n ? ' aria-current="step"' : '') + '><span>' + esc(nm) + '</span></li>'; }).join('') + '</ol></nav>';
    }
    $('hdr').innerHTML = h;
  }
  /* The copy box has its own place on the stop screen and the result; on every other screen it stands under the banner (H1). */
  function copyInline() { return rec.step === 'result' || rec.step === 'stop'; }
  function drawBanner() {
    var h = '';
    if (ST.kind === 'memory') h += '<div class="banner warn" id="nostore" role="status"><p>' + esc(T.noStore) + '</p>' + (S.hasContent(rec) ? '<p>' + dlBtn('save-file', 'save-file-banner', 'small') + '</p>' : '') + '</div>';
    if (ui.conflict) {
      h += '<div class="banner warn" id="conflict" role="alert" tabindex="-1"><p>' + esc(T.conflict) + '</p><p class="btnrow"><button type="button" class="btn small" data-act="conflict-theirs" id="conflict-theirs">Use the other version</button>' +
        '<button type="button" class="btn small" data-act="conflict-mine" id="conflict-mine">Keep my answers</button></p></div>';
    }
    if (ui.gone) {
      h += '<div class="banner warn" id="gone" role="alert" tabindex="-1"><p>' + esc(T.gone) + ' Nothing here is saved until you keep it.</p><p class="btnrow"><button type="button" class="btn small" data-act="gone-keep" id="gone-keep">Keep it here</button>' +
        '<button type="button" class="btn small" data-act="gone-new" id="gone-new">Start a new check</button></p></div>';
    }
    if (rec.imported && !rec.imported.seen) {
      var im = rec.imported;
      h += '<div class="banner info" id="imported" role="status"><p>Imported from v' + esc(im.from) + ': ' + (im.n ? 'please answer ' + esc(plural(im.n, 'new question', 'new questions')) : 'no new questions to answer') + '.' +
        (im.dropped ? ' ' + esc(plural(im.dropped, 'earlier answer was', 'earlier answers were')) + ' not carried over, because those questions were merged into others or removed.' : '') + '</p>' +
        '<p><button type="button" class="btn small" data-act="imported-ok">OK</button></p></div>';
    }
    if (!copyInline()) h += copyBox();
    $('banner').innerHTML = h;
    $('app').setAttribute('data-storage', ST.kind);
    $('foot-keep').textContent = ST.kind === 'memory' ? '' : ' Your answers stay in this browser.';
  }

  /* ---------- screens ---------- */
  function vStart() {
    var has = S.hasAnswers(rec);
    return '<div class="stephead"><h1 tabindex="-1" id="h">Do you need AI?</h1><p class="sub">A guided check for hotel managers. Is AI the right answer for one problem in your hotel, and is your hotel ready to try it? You do not need to know anything about AI.</p>' + gloss(['AI']) + '</div>' +
      '<section class="panel" aria-labelledby="how-h"><h2 id="how-h">Five steps</h2><ol class="journey">' +
      '<li><b>About your hotel</b><span>A few details for your result. All optional.</span></li>' +
      '<li><b>Is this an AI problem?</b><span>Five questions about the job you want help with.</span></li>' +
      '<li><b>Must-haves</b><span>Eleven things to have in place before any AI project starts.</span></li>' +
      '<li><b>Where in the hotel?</b><span>Choose the use case closest to your idea: 99 use cases in 15 departments.</span></li>' +
      '<li><b>Questions for this use case</b><span>First how the tool will work in your hotel, then the questions that follow from that.</span></li></ol>' +
      '<p><b>What you get:</b> a verdict with the main reason, the three things to do first and who does them, a plan for each person, questions for the vendor, and a readiness score at the end.</p>' +
      '<p class="disc" id="disclaimer">' + esc(D.texts.disclaimer) + '</p>' +
      '<div class="btnrow">' + (has ? '<button type="button" class="btn primary" data-act="resume">Continue this check</button><button type="button" class="btn" data-act="new" id="new-cover">Start a new check</button>' : '<button type="button" class="btn primary" data-act="begin">Start</button>') + '</div></section>' +
      '<section class="panel" aria-labelledby="mine-h"><h2 id="mine-h" tabindex="-1">Your checks in this browser</h2><div id="mychecks"><p class="meta">Loading…</p></div>' +
      '<h3>Open a saved file</h3><p class="meta">A file saved with Save as file, from this tool or from the earlier version (v2.6.1).</p>' +
      '<div class="btnrow"><label class="btn" for="file-in">Open a saved file<input type="file" id="file-in" accept=".json,application/json" class="sr"></label></div>' +
      '<details class="fold"><summary>Or paste a saved check</summary><label class="fld" for="paste-in"><span>Saved check (the text from Copy saved check)</span><textarea id="paste-in"></textarea></label><div class="btnrow"><button type="button" class="btn" data-act="paste-open">Open</button></div></details>' +
      (ui.fileErr ? '<p class="banner err" role="alert" id="file-err">' + esc(ui.fileErr) + '</p>' : '') + '</section>';
  }
  function drawMyChecks() {
    var box = $('mychecks'); if (!box) return;
    listChecks().then(function (rs) {
      if (!$('mychecks') || rec.step !== 'start') return;
      rs = rs.filter(function (r) { return S.hasAnswers(r); });
      if (!rs.length) $('mychecks').innerHTML = '<p class="meta">None yet.</p>';
      else $('mychecks').innerHTML = '<ul class="checks">' + rs.map(function (r) {
        var u = S.useOf(D, r.use), nm = (r.hotel.name || 'Hotel not named') + ' · ' + (u ? u.title : r.use === 'none' ? D.none_fits.title : 'no use case yet');
        return '<li data-id="' + esc(r.id) + '"><span>' + esc(nm) + '<br><span class="meta">Last changed ' + esc((r.updated || '').slice(0, 10)) + (r.id === rec.id ? ' · open now' : '') + '</span></span><span class="btnrow">' +
          (r.id === rec.id ? '' : '<button type="button" class="btn small" data-act="open-check" data-id="' + esc(r.id) + '" id="open-' + uid(r.id) + '">Open</button>') +
          '<button type="button" class="btn small" data-act="remove-check" data-id="' + esc(r.id) + '" id="rm-' + uid(r.id) + '">Remove</button></span></li>';
      }).join('') + '</ul>';
      /* after Remove: focus the next check in the list, else the list heading (clean-up L5) */
      if (ui.listFocus != null) {
        var items = document.querySelectorAll('#mychecks li'), li = items[Math.min(ui.listFocus, items.length - 1)];
        var b = li && li.querySelector('button'); ui.listFocus = null;
        (b || $('mine-h')).focus();
      }
    });
  }
  function vHotel() {
    var H = rec.hotel;
    function opt(v, l, cur) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>'; }
    return '<div class="stephead"><h2 tabindex="-1" id="h">About your hotel</h2><p class="sub">All optional. The hotel name appears on your result.</p></div>' +
      '<section class="panel"><div class="formgrid">' +
      '<label class="fld" for="h-name"><span>Hotel name</span><input type="text" id="h-name" data-h="name" value="' + esc(H.name) + '" autocomplete="organization" maxlength="120"></label>' +
      '<label class="fld" for="h-type"><span>How the hotel is run</span><select id="h-type" data-h="type">' + opt('', 'Choose', H.type) + TYPES.map(function (t) { return opt(t[0], t[1], H.type); }).join('') + '</select></label>' +
      '<label class="fld" for="h-role"><span>Your role</span><select id="h-role" data-h="role">' + opt('', 'Choose', H.role) + ROLES.map(function (t) { return opt(t[0], t[1], H.role); }).join('') + '</select></label>' +
      '<label class="fld" for="h-country"><span>Country</span><select id="h-country" data-h="country">' + opt('', 'Choose', H.country) + COUNTRIES.map(function (c) { return opt(c, c, H.country); }).join('') + '</select></label>' +
      '</div></section>' + nav('Back', 'Next');
  }
  function vS2() {
    var texts = D.step2.map(function (s) { return s.text; });
    return '<div class="stephead"><h2 tabindex="-1" id="h">Is this an AI problem?</h2><p class="sub">Think of one job in your hotel that you want help with. These five questions earn no points. A No to question 1 or 2 means a simpler option may do the job.</p>' + gloss(texts) + '</div>' +
      D.step2.map(function (s, i) {
        return '<fieldset class="card" id="card-' + s.id + '"><legend id="lg-' + s.id + '"><span class="qtitle">Question ' + (i + 1) + ': ' + esc(s.title) + '</span><span class="qtext">' + esc(s.text) + '</span></legend>' +
          radios('s2', s.id, R.answerOptions(D, 'step2'), rec.step2[s.id], 'lg-' + s.id) + '</fieldset>';
      }).join('') + openNote('s2') + nav('Back', 'Next');
  }
  function contraFor(id) { return R.contradictions(D, A().use, A().gates, rec.mh).filter(function (c) { return c.id === id; })[0]; }
  function vMust() {
    var texts = D.must_haves.map(function (m) { return m.text + ' ' + (m.na_help || ''); });
    return '<div class="stephead"><h2 tabindex="-1" id="h">Must-haves</h2><p class="sub">Eleven things to have in place before any AI project starts.</p>' +
      '<p class="sub" id="must-help">Answer for the job you thought of in step 2. ‘The tool’ means the AI tool you have in mind; you pick the exact use case in step 4.</p>' + gloss(texts) + '</div>' +
      D.must_haves.map(function (m, i) {
        var c = rec.mh[m.id] === 'na' ? contraFor(m.id) : null;
        /* owner decision, 25 Nov 2026: no "Must be Yes" label while answering (it primes a Yes); the result names what is needed */
        return '<fieldset class="card' + (ui.mark === m.id ? ' open-mark' : '') + '" id="card-' + m.id + '"><legend id="lg-' + m.id + '"><span class="qtitle">Must-have ' + (i + 1) + ': ' + esc(m.title) + '</span><span class="qtext">' + esc(m.text) + '</span></legend>' +
          radios('mh', m.id, R.answerOptions(D, 'mh', m.id), rec.mh[m.id], 'lg-' + m.id) +
          (m.na ? '<p class="help" id="na-' + m.id + '">' + esc(m.na_help) + '</p>' : '') +
          '<p class="help">' + esc(PLANNED_HELP) + '</p>' +
          (c ? '<div class="note" role="note" id="contra-mh-' + m.id + '"><p>' + esc(c.note) + '</p></div>' : '') + '</fieldset>';
      }).join('') + openNote('must') + nav('Back', 'Next');
  }
  /* ---------- step 4: Where in the hotel? ----------
     Owner decision, 25 Nov 2026: the readiness-2 structure in v3's design. Areas (four tiles) → the area's departments (tiles) →
     the department's use cases (radios) and None of these fits; the search box above finds use cases from any level. The chosen use
     case shows what it does, how the AI works, how common it is in hotels and its examples and sources (from the use-case
     catalogue; sources whose text would hit the banned-term grep are left out at build time, see LEGAL_LEFTOVERS.md). */
  function areaOf(dept) { return own(CAT.deptArea, dept) ? CAT.deptArea[dept] : ''; }
  function deptsOf(area) { return IX.DEPTS.filter(function (d) { return areaOf(d.name) === area; }); }
  /* The level shown: { area, dept }. null in ui means "follow the chosen use case". */
  function whereLevel() {
    var u = S.useOf(D, rec.use), ua = u ? areaOf(u.department) : '';
    var area = ui.area !== null ? ui.area : ua;
    var dept = ui.dept !== null ? ui.dept : (u && area === ua ? u.department : '');
    if (dept && areaOf(dept) !== area) dept = '';
    return { area: area, dept: dept };
  }
  /* Search (council v3.0, BUILD NOW 7; v3.0.1, BUILD NOW 3): over the title, the department and "What it does"; every word must
     match, any case; a word of four or more letters loses a final "es" or "s" (reviews → review); "z" counts as "s"
     (personalization); the word "f&b" means "food & beverage". */
  function fold(t) { return String(t || '').toLowerCase().replace(/z/g, 's'); }
  function searchWords(q) {
    return fold(q).split(/\s+/).filter(Boolean).map(function (w) {
      if (w === 'f&b') return 'food & beverage';
      return w.length >= 4 ? w.replace(/es$/, '').replace(/s$/, '') : w;
    });
  }
  function searchUses(q) {
    var words = searchWords(q);
    if (!words.length) return null;
    return D.use_cases.filter(function (u) {
      var t = fold(u.title + ' ' + u.department + ' ' + ((EX[u.id] || {}).does || ''));
      return words.every(function (w) { return t.indexOf(w) >= 0; });
    });
  }
  function useRadio(x, sub) {
    var iid = 'r-use-' + uid(x.id);
    return '<label class="opt" for="' + iid + '"><input type="radio" name="n-use" id="' + iid + '" value="' + esc(x.id) + '" data-kind="use"' + (rec.use === x.id ? ' checked' : '') + '><span>' + esc(x.title) + (sub ? '<small class="ucdept">' + esc(x.department) + '</small>' : '') + '</span></label>';
  }
  function countLine(found) {
    if (!found) return '';
    return found.length ? plural(found.length, 'use case matches', 'use cases match') + ' “' + ui.q.trim() + '”.' : 'No use case matches “' + ui.q.trim() + '”. Try another word, clear the search to choose an area, or choose None of these fits.';
  }
  function tile(act, id, title, line, meta, here) {
    return '<button type="button" class="tile" data-act="' + act + '" data-id="' + esc(id) + '" id="' + act + '-' + uid(id) + '"><b>' + esc(title) + '</b>' + (line ? '<span>' + esc(line) + '</span>' : '') +
      '<span class="meta">' + esc(meta) + (here ? ' · your choice is here' : '') + '</span></button>';
  }
  function ucResults() {
    var u = S.useOf(D, rec.use), found = searchUses(ui.q), h = '';
    if (found) {
      if (found.length) h += '<fieldset class="card ucset"><legend id="lg-uc" class="qtitle">Use cases that match</legend><div class="uclist" role="radiogroup" aria-labelledby="lg-uc">' + found.map(function (x) { return useRadio(x, true); }).join('') + '</div></fieldset>' + gloss(found.map(function (x) { return x.title; }));
      return h;
    }
    var L = whereLevel(), ua = u ? areaOf(u.department) : '';
    if (!L.area) {
      return '<h3 class="lvlhead" id="lvl-h" tabindex="-1">Choose an area of the hotel</h3><div class="tiles" id="area-tiles">' + CAT.areas.map(function (a) {
        var ds = deptsOf(a.name), n = ds.reduce(function (s, d) { return s + d.uses.length; }, 0);
        return tile('area', a.name, a.name, a.line, plural(ds.length, 'department', 'departments') + ' · ' + plural(n, 'use case', 'use cases'), ua === a.name);
      }).join('') + '</div>';
    }
    var crumbs = '<p class="crumbs"><button type="button" class="linkbtn" data-act="area" data-id="" id="crumb-areas">All areas</button>' +
      (L.dept ? '<span aria-hidden="true">›</span><button type="button" class="linkbtn" data-act="dept" data-id="" id="crumb-area">' + esc(L.area) + '</button>' : '') + '</p>';
    if (!L.dept) {
      return crumbs + '<h3 class="lvlhead" id="lvl-h" tabindex="-1">' + esc(L.area) + ': choose a department</h3><div class="tiles" id="dept-tiles">' + deptsOf(L.area).map(function (d) {
        return tile('dept', d.name, d.name, '', plural(d.uses.length, 'use case', 'use cases'), !!u && u.department === d.name);
      }).join('') + '</div>';
    }
    var deptObj = IX.DEPTS.filter(function (d) { return d.name === L.dept; })[0];
    return crumbs + '<fieldset class="card ucset"><legend id="lg-uc" class="lvlhead"><span id="lvl-h" tabindex="-1">Use cases in ' + esc(deptObj.name) + '</span></legend><div class="uclist" role="radiogroup" aria-labelledby="lg-uc">' +
      deptObj.uses.map(function (x) { return useRadio(x, false); }).join('') + '</div></fieldset>' + gloss(deptObj.uses.map(function (x) { return x.title; }));
  }
  /* One source of the chosen use case: the name is the link (a new tab), a "Hotel" tag for a hotel's own example, the note, then
     the address with Copy address (the way readiness-2 shows them). */
  function sourceRow(x, i) {
    var nm = x.url ? '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.name) + '</a>' : esc(x.name);
    return '<li data-src="' + esc(x.type) + '">' + (x.type === 'h' ? '<span class="tag">Hotel</span> ' : '') + (x.type === 'l' ? nm : '<b>' + nm + '</b>') + (x.note ? ': ' + esc(x.note) : '') +
      (x.url ? '<span class="srcaddr"><span class="srcurl">' + esc(x.url) + '</span> <button type="button" class="linkbtn" data-act="copy-src" data-url="' + esc(x.url) + '" id="copy-src-' + i + '">Copy address</button></span>' : '') + '</li>';
  }
  function aboutUse(u) {
    var e = EX[u.id] || {}, c = own(CAT.uc, u.id) ? CAT.uc[u.id] : { level: '', srcs: [] }, area = areaOf(u.department);
    return '<section class="panel about" aria-labelledby="about-h" id="about"><h3 id="about-h">Your choice: ' + esc(u.title) + '</h3><dl><dt>Where</dt><dd>' + esc((area ? area + ' · ' : '') + u.department) + '</dd>' +
      (e.does ? '<dt>What it does</dt><dd>' + esc(e.does) + '</dd>' : '') + (e.how ? '<dt>How the AI works</dt><dd>' + esc(e.how) + '</dd>' : '') +
      '<dt>How common in hotels</dt><dd id="about-level">' + esc(c.level || 'Not rated') + ' (rating in the project team\'s use-case catalogue, Nov 2026)</dd></dl>' +
      '<h4 id="src-h">Examples and sources</h4>' + (c.srcs.length ? '<ul class="srcs" id="srcs" aria-labelledby="src-h">' + c.srcs.map(sourceRow).join('') + '</ul><p class="meta">A source link opens in a new browser tab.</p>' : '<p class="meta" id="srcs">No example or source is listed for this use case.</p>') +
      gloss([u.title, e.does || '', e.how || ''].concat(c.srcs.map(function (x) { return x.name + ' ' + x.note; }))) + '</section>';
  }
  function vWhere() {
    var u = S.useOf(D, rec.use), found = searchUses(ui.q);
    var h = '<div class="stephead"><h2 tabindex="-1" id="h">Where in the hotel?</h2><p class="sub">Choose the area, then the department, then the use case closest to your idea. Or search. If none is close, choose None of these fits: you then get general questions.</p></div>';
    h += '<section class="panel"><label class="fld" for="uc-search"><span>Search the ' + D.use_cases.length + ' use cases</span><input type="search" id="uc-search" value="' + esc(ui.q) + '" autocomplete="off" spellcheck="false" placeholder="For example: chat, pricing, energy"></label>' +
      '<p class="meta" id="uc-count" role="status">' + esc(countLine(found)) + '</p>' +
      '<div id="uc-results" class="ucresults">' + ucResults() + '</div>';
    h += '<div class="uclist"><label class="opt" for="r-use-none"><input type="radio" name="n-use-none" id="r-use-none" value="none" data-kind="use"' + (rec.use === 'none' ? ' checked' : '') + '>None of these fits</label></div></section>';
    if (u) h += aboutUse(u);
    else if (rec.use === 'none') h += '<section class="panel about" id="about"><h3>Your choice: None of these fits</h3><p>You get the five How it works questions and six general questions. The result can be Almost ready at best, because the questions are not tailored.</p></section>';
    return h + nav('Back', 'Next');
  }
  function gateCard(g, G) {
    var key = 'gate:' + g.id, val = G[g.id], o = (g.options || []).filter(function (x) { return x.key === val; })[0], notes = '';
    if (o && o.effects) {
      (o.effects.contradicts_na || []).forEach(function (mid) {
        if (rec.mh[mid] !== 'na') return;
        var m = IX.MH[mid];
        notes += '<div class="note" role="note" id="contra-' + mid + '"><p>' + esc(m.contradiction_note) + '</p><p><button type="button" class="linkbtn" data-act="goto-mh" data-id="' + mid + '">Change my answer</button></p></div>';
      });
      if (o.effects.not_fit) notes += '<div class="note" role="note" id="notfit"><p>' + esc(o.effects.not_fit) + '</p><p><button type="button" class="linkbtn" data-act="goto-where">Choose another use case</button></p></div>';
    }
    return '<fieldset class="card' + (ui.mark === key ? ' open-mark' : '') + '" id="card-' + uid(key) + '"><legend id="lg-' + uid(key) + '"><span class="qtext">' + esc(g.text) + '</span></legend>' + radios('gate', g.id, g.options, val, 'lg-' + uid(key)) + notes + '</fieldset>';
  }
  /* Every question card looks the same while answering (owner decision, 25 Nov 2026): no weight label; "Who answers" stays. */
  function qCard(q) {
    return '<fieldset class="card' + (ui.mark === q.id ? ' open-mark' : '') + '" id="card-' + uid(q.id) + '"><legend id="lg-' + uid(q.id) + '"><span class="qtext">' + esc(q.text) + '</span>' +
      '<span class="tags"><span class="tag">Who answers: ' + esc(D.labels.owners[q.owner] || q.owner) + '</span></span></legend>' +
      radios('q', q.id, R.answerOptions(D, 'q', q.id), rec.qa[q.id], 'lg-' + uid(q.id)) + '<p class="help">' + esc(PLANNED_HELP) + '</p>' + whyToggle(q.id, q.why) + '</fieldset>';
  }
  /* How many questions follow once the open How it works questions are answered: the smallest and largest number of visible
     questions over every answer they can still get (R3Rules.visible; the answers already given are kept). */
  function pendingRange(use, gates, G) {
    var open = gates.filter(function (g) { return !G[g.id]; }), lo = Infinity, hi = 0;
    (function walk(i, acc) {
      if (i === open.length) { var n = R.visible(D, use, acc).length; lo = Math.min(lo, n); hi = Math.max(hi, n); return; }
      open[i].options.forEach(function (o) { var nx = Object.assign({}, acc); nx[open[i].id] = o.key; walk(i + 1, nx); });
    })(0, Object.assign({}, G));
    return [lo === Infinity ? 0 : lo, hi];
  }
  function vUse() {
    var a = A(), u = S.useOf(D, a.use), gates = R.askedGates(D, a.use), G = a.gates, allG = gates.every(function (g) { return !!G[g.id]; });
    var qs = allG ? R.visible(D, a.use, G) : [], texts = [u ? u.title : ''].concat(gates.map(function (g) { return g.text + ' ' + g.options.map(function (o) { return o.label; }).join(' '); }));
    texts = texts.concat(qs.map(function (q) { return q.text + ' ' + (q.why || ''); }));
    var h = '<div class="stephead"><h2 tabindex="-1" id="h">Questions for this use case</h2><p class="sub" id="use-line">Use case: <b>' + esc(u ? u.title : D.none_fits.title) + '</b></p>' +
      (!rec.use ? '<p class="note info" id="no-use">You did not choose a use case, so these are the general questions for None of these fits.</p>' : '') + gloss(texts) + '</div>';
    h += '<section aria-labelledby="hiw-h" class="stephead" id="hiw"><h3 id="hiw-h" class="areahead">First, how will this tool work in your hotel?</h3><p class="sub">Your answers here decide which questions follow.</p>' +
      '<p class="sub" id="hiw-help">' + esc(HIW_HELP) + '</p></section>' + gates.map(function (g) { return gateCard(g, G); }).join('');
    /* council v3.0, BUILD NOW 1: the questions appear once every How it works question has an answer (Don't know yet counts). Until
       then they are not drawn; the scoring is unchanged (R3Rules.visible decides what counts, and unanswered questions count as
       Don't know yet), and this line says how many will follow. */
    if (!allG) {
      var openG = gates.filter(function (g) { return !G[g.id]; }).length, rg = pendingRange(a.use, gates, G);
      var which = gates.length === 1 ? 'the question above' : openG === 1 ? 'the other question above' : 'the questions above';
      var n = rg[0] === rg[1] ? 'the ' + plural(rg[0], 'question', 'questions') : 'the ' + rg[0] + ' to ' + rg[1] + ' questions';
      h += '<p class="note info" id="gates-first" data-min="' + rg[0] + '" data-max="' + rg[1] + '">Answer ' + which + ' to see ' + n + ' for this use case. Until then, ' + (rg[1] === 1 ? 'it counts' : 'they count') + ' as Don\'t know yet.</p>';
      return h + openNote('use') + nav('Back', 'See the result');
    }
    /* the visible questions in the data's order (R3Rules.visible = sim_v3.visible_questions; never reordered), under a plain area
       name each time the area changes */
    var last = '', seenA = {};
    qs.forEach(function (q) {
      if (q.area !== last) { h += '<h3 class="areahead"' + (seenA[q.area] ? '' : ' id="area-' + q.area + '"') + '>' + esc(D.labels.areas[q.area] || q.area) + '</h3>'; seenA[q.area] = 1; last = q.area; }
      h += qCard(q);
    });
    return h + openNote('use') + nav('Back', 'See the result');
  }
  function vStop() {
    var m = model();
    return '<section class="verdict v-accent" id="verdict" aria-labelledby="h"><p class="vkicker">Step 2 result</p><h1 tabindex="-1" id="h">' + esc(m.verdict) + '</h1><p class="reason" id="reason">' + esc(m.reason) + '</p></section>' +
      '<section class="panel" aria-labelledby="simpler-h"><h2 id="simpler-h">Simpler options to try first</h2><ul class="plain" id="simpler">' + m.simpler.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<p>If you still think AI is needed, Continue anyway. The result can then be Almost ready at best.</p>' +
      '<div class="btnrow"><button type="button" class="btn" data-act="change">Change my answers</button><button type="button" class="btn primary" data-act="continue">Continue anyway</button>' +
      dlBtn('pdf', 'pdf') + '</div>' + copyBox() + '</section>' +
      '<section class="panel" aria-labelledby="top-h"><h2 id="top-h">Top 3 actions</h2>' + top3(m) + '</section>' +
      '<p class="disc" id="disclaimer">' + esc(m.disclaimer) + '</p>' + gloss(m.simpler.concat(m.top3.map(function (a) { return a.text; })));
  }
  function top3(m) {
    if (!m.top3.length) return '<p id="top3">Nothing open.</p>';
    return '<ol class="top3" id="top3">' + m.top3.map(function (a) { return '<li>' + esc(a.text) + '<span>' + esc(a.owner) + (a.need ? ' · <b class="need">Needed before a pilot</b>' : '') + '</span></li>'; }).join('') + '</ol>';
  }
  /* A save box draws the saved check from the record on every draw, so it never goes stale while answering (clean-up v2, N4). */
  function copyBox() {
    if (!ui.copy) return '';
    var text = ui.copy.kind === 'save' ? JSON.stringify(fileDoc(), null, 1) : ui.copy.text;
    return '<div class="copybox" id="copybox" role="region" aria-labelledby="copy-msg" data-kind="' + esc(ui.copy.kind) + '"><p class="banner warn" id="copy-msg">' + esc(ui.copy.msg) + '</p>' +
      '<label class="fld" for="copy-text"><span>' + esc(ui.copy.label) + '</span><textarea id="copy-text" readonly>' + esc(text) + '</textarea></label>' +
      '<div class="btnrow"><button type="button" class="btn" data-act="copy-box" id="copy-box">Copy</button><button type="button" class="btn" data-act="copy-close" id="copy-close">Close</button></div></div>';
  }
  function vResult() {
    var m = model(), res = m.res;
    if (m.stop) return vStop();
    var h = '<section class="verdict v-' + m.tone + '" id="verdict" aria-labelledby="h"><p class="vkicker">Result for ' + esc(m.useTitle) + '</p><h1 tabindex="-1" id="h">' + esc(m.verdict) + '</h1>' +
      '<p class="reason" id="reason">' + esc(m.reason) + '</p></section>' +
      (m.flag ? '<p class="note flag" id="flag">' + esc(m.flag) + '</p>' : '') +
      m.notes.map(function (n) { return '<div class="note" id="contra-' + n.id + '"><p>' + esc(n.note) + '</p><p><button type="button" class="linkbtn" data-act="goto-mh" data-id="' + n.id + '">Change my answer</button></p></div>'; }).join('') +
      (m.notFit ? '<div class="note" id="notfit"><p>' + esc(m.notFit) + '</p><p><button type="button" class="linkbtn" data-act="goto-where">Choose another use case</button></p></div>' : '');
    h += '<section class="panel" aria-labelledby="top-h"><h2 id="top-h">Top 3 actions</h2>' + top3(m) + '</section>';
    h += '<div class="btnrow noprint" id="actions"><button type="button" class="btn" data-act="copy" id="copy">Copy the result</button>' + dlBtn('pdf', 'pdf', 'primary') +
      dlBtn('save-file', 'save-file') + '</div>' + copyBox();
    h += '<section class="panel" aria-labelledby="areas-h" id="areas"><h2 id="areas-h">Details by area</h2><ul class="areas">' + m.areas.map(function (a) {
      return '<li data-area="' + a.key + '"><b>' + esc(a.name) + '</b><span class="track" aria-hidden="true"><i style="width:' + Math.round(100 * a.yes / a.total) + '%"></i></span><span>' + esc(a.line) + '</span></li>';
    }).join('') + '</ul></section>';
    h += '<section class="panel" aria-labelledby="plan-h" id="plan"><h2 id="plan-h">Action plan by person</h2>' + (m.people.length ? m.people.map(function (p) {
      return '<div class="person" data-owner="' + esc(p.key) + '"><div class="personhead"><h3>' + esc(p.owner) + '</h3><button type="button" class="btn small" data-act="copy-person" data-id="' + esc(p.key) + '" id="copy-person-' + uid(p.key) + '">Copy for ' + esc(p.owner) + '</button></div><ul class="plain">' + p.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
    }).join('') : '<p>Nothing open.</p>') + '</section>';
    h += '<section class="panel" aria-labelledby="vendor-h" id="vendor"><h2 id="vendor-h">Questions to ask the vendor</h2>' + (m.vendor.length ? '<ul class="plain">' + m.vendor.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '<p>None: no answer is Don\'t know yet and nothing is left for the vendor.</p>') + '</section>';
    h += '<details class="panel fold" id="all-qa"><summary>Every question and your answer</summary>' + m.qa.filter(function (g) { return g.items.length; }).map(function (g) {
      return '<h3>' + esc(g.head) + '</h3><div class="qalist">' + g.items.map(function (i) { return '<div class="qarow"><span>' + (i.title ? '<small>' + esc(i.title) + '</small>' : '') + esc(i.text) + (i.weight ? '<small>' + esc(i.weight) + (i.owner ? ' · Who answers: ' + esc(i.owner) : '') + '</small>' : '') + '</span><span class="ans">' + esc(i.answer) + '</span></div>'; }).join('') + '</div>';
    }).join('') + '</details>';
    h += '<details class="panel fold" id="method"><summary>How this was worked out</summary><ul class="plain">' + m.method.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></details>';
    /* council v3.0, BUILD NOW 6: a high score under a red or grey verdict says where the verdict comes from (screen only) */
    var why = res.score >= 50 ? (m.verdictKey === 'not' ? 'The verdict comes from the questions needed before a pilot, not from the score.' : m.verdictKey === 'info' ? 'The verdict comes from the Don\'t know yet answers, not from the score.' : '') : '';
    h += '<section class="panel" aria-labelledby="score-h" id="score"><h2 id="score-h">Readiness score</h2><p class="score" id="score-val">' + esc(res.score) + '%</p>' + (why ? '<p id="score-why">' + esc(why) + '</p>' : '') + '<p class="meta">' + esc(m.scoreSub) + '</p></section>';
    h += '<p class="disc" id="disclaimer">' + esc(m.disclaimer) + '</p>';
    h += gloss([m.useTitle].concat(m.top3.map(function (a) { return a.text; }), m.vendor, [].concat.apply([], m.people.map(function (p) { return p.items; })), [].concat.apply([], m.qa.map(function (g) { return g.items.map(function (i) { return i.text; }); }))));
    return h + nav('Back', '', '<button type="button" class="btn" data-act="new" id="new-result">Start a new check</button>');
  }
  var VIEWS = { start: vStart, hotel: vHotel, s2: vS2, stop: vStop, must: vMust, where: vWhere, use: vUse, result: vResult };

  /* ---------- session timing (?session=1) ---------- */
  /* st: the step now shown, or null to close the open one (page hidden or closed, another check opened). Time with the page hidden
     is not counted (ui.tPaused; clean-up v2, N9b; council v3.0.1, BUILD NOW 7). */
  function timeStep(st) {
    if (!SESSION) return;
    var t = Date.now(), iso = new Date(t).toISOString();
    if (ui.tStep && ui.tRec === rec.id && rec.timing && rec.timing[ui.tStep]) { var e = rec.timing[ui.tStep]; e[1] = iso; if (!ui.tPaused) e[2] += t - ui.tAt; }
    ui.tAt = t;
    if (!st) return;
    if (ui.tStep === st && ui.tRec === rec.id) return;
    rec.timing = rec.timing || {};
    if (!rec.timing[st]) rec.timing[st] = [iso, '', 0];
    ui.tStep = st; ui.tRec = rec.id;
  }
  /* Session mode: a search of 3 or more letters that still finds nothing after 1.5 s is kept in rec.searches (at most 50; council
     v3.0.1, BUILD NOW 8). Nothing is shown or sent. */
  function logSearch(q) {
    if (!SESSION) return;
    clearTimeout(ui.sTimer); q = String(q || '').trim();
    if (q.length < 3) return;
    ui.sTimer = setTimeout(function () {
      if (rec.step !== 'where' || ui.q.trim() !== q) return;
      var f = searchUses(q); if (!f || f.length) return;
      rec.searches = (rec.searches || []).concat([{ q: q.slice(0, 80), at: new Date().toISOString() }]).slice(-50); persist();
    }, 1500);
  }

  function render() {
    if (!ready) return;
    var st = rec.step;
    if (SESSION && (ui.tStep !== st || ui.tRec !== rec.id)) timeStep(st);
    $('app').setAttribute('data-state', st);
    drawHeader(); drawBanner();
    var y = window.scrollY, active = document.activeElement && document.activeElement.id;
    $('view').innerHTML = VIEWS[st]();
    if (st === 'start') drawMyChecks();
    if (st === 'result' || st === 'stop') { var m = model(); $('live').textContent = 'Result: ' + m.verdict + '. ' + m.reason; } else $('live').textContent = '';
    if (ui.toTop) { ui.toTop = false; window.scrollTo(0, 0); var hh = $('h'); if (hh) hh.focus({ preventScroll: true }); }
    else { if (ui.focus && $(ui.focus)) $(ui.focus).focus({ preventScroll: true }); else if (active && $(active)) $(active).focus({ preventScroll: true }); window.scrollTo(0, y); }
    ui.focus = null;
  }
  /* The only writer of rec.step: a known step, then the nearest one that can be shown (R3Store.place). */
  function setStep(st) { rec.step = S.STEPS.indexOf(st) >= 0 ? st : 'start'; rec.step = S.place(D, rec); }
  /* A screen move: not a change of the check (persist, no stamp; clean-up v2, N15). A file error belongs to the cover (N7). */
  function go(step) {
    if (S.STEPS.indexOf(step) < 0) return false;
    setStep(step); if (rec.step !== 'start') ui.fileErr = '';
    ui.warned = ''; ui.copy = null; ui.mark = ''; ui.q = ''; ui.toTop = true; persist(); render(); return true;
  }
  function cardOf(openId) { return 'card-' + uid(openId); }
  function focusCard(id, checked) {
    var c = $(cardOf(id)); if (!c) return;
    c.scrollIntoView({ block: 'center' });
    var inp = (checked && c.querySelector('input:checked')) || c.querySelector('input'); if (inp) inp.focus({ preventScroll: true });
  }
  function markFirstOpen(step) {
    var o = S.open(D, rec, step); if (!o.length) return;
    ui.mark = o[0]; render(); focusCard(o[0]);
  }

  /* ---------- events (also the test API) ---------- */
  var HOTEL_KEYS = { name: 1, type: 1, role: 1, country: 1 };
  /* The guard table (clean-up v2, N8): an event the page cannot draw is refused (send returns false, nothing changes). */
  function okSend(ev, arg) {
    var a = A();
    switch (ev) {
      case 'begin': case 'resume': case 'next': case 'back': case 'change': case 'continue': case 'new': return true;
      case 'goto': return S.STEPS.indexOf(arg) >= 0;
      case 'goto-mh': return own(IX.MH, arg);
      case 'use': return arg === 'none' || own(IX.UC, arg);
      case 'area': return arg === '' || CAT.areas.some(function (x) { return x.name === arg; });
      case 'dept': return arg === '' || IX.DEPTS.some(function (d) { return d.name === arg; });
      case 'search': return arg == null || typeof arg === 'string';
      case 'hotel': {
        if (!arg || !own(HOTEL_KEYS, arg.k)) return false;
        var v = arg.v == null ? '' : arg.v;
        if (typeof v !== 'string') return false;
        if (arg.k === 'type') return v === '' || S.TYPES.indexOf(v) >= 0;
        if (arg.k === 'role') return v === '' || S.ROLES.indexOf(v) >= 0;
        if (arg.k === 'country') return v === '' || COUNTRIES.indexOf(v) >= 0;
        return true;
      }
      case 'answer': {
        if (!arg || typeof arg.id !== 'string' || typeof arg.value !== 'string') return false;
        var k = arg.kind, id = arg.id, val = arg.value;
        if (k === 's2') return D.step2.some(function (x) { return x.id === id; }) && R.answerOptions(D, 'step2').some(function (o) { return o.key === val; });
        if (k === 'mh') return own(IX.MH, id) && S.mhOk(IX.MH[id], val);
        if (k === 'gate') { var g = R.askedGates(D, a.use).filter(function (x) { return x.id === id; })[0]; return !!g && S.gateOk(g, val); }
        if (k === 'q') {
          var u = S.useOf(D, a.use), list = u ? u.questions : D.none_fits.questions.concat(Object.keys(D.gate_questions).map(function (x) { return { id: 'none.' + x }; }));
          return list.some(function (q) { return q.id === id; }) && R.answerOptions(D, 'q', id).some(function (o) { return o.key === val; });
        }
        return false;
      }
    }
    return false;
  }
  function allGates() { var a = A(); return R.askedGates(D, a.use).every(function (g) { return S.gateOk(g, a.gates[g.id]); }); }
  /* Returns true when the event was taken, false when it was refused. */
  function send(ev, arg) {
    if (!okSend(ev, arg)) return false;
    switch (ev) {
      case 'begin': go('hotel'); break;
      /* "Continue this check": the first screen with something to answer (clean-up L9) */
      case 'resume': go(S.firstOpen(D, rec)); break;
      case 'next': {
        var st = rec.step;
        if ((st === 's2' || st === 'must' || st === 'use') && S.open(D, rec, st).length && ui.warned !== st) { ui.warned = st; render(); var n = $('open-note'); if (n) n.scrollIntoView({ block: 'center' }); return true; }
        if (st === 'where' && !rec.use) { rec.use = 'none'; stamp(); }
        go(S.next(D, rec)); break;
      }
      case 'back': go(S.back(D, rec)); break;
      case 'change': go('s2'); break;
      case 'continue': rec.cont = S.stopKey(D, rec); stamp(); go('must'); break;
      case 'goto': go(arg); break;
      case 'goto-mh': go('must'); ui.mark = arg; render(); focusCard(arg, true); break;
      case 'hotel': {
        var had = S.hasContent(rec);
        rec.hotel[arg.k] = String(arg.v || '').slice(0, 120); save();
        if (ST.kind === 'memory' && had !== S.hasContent(rec)) drawBanner(); /* clean-up v2, N6 */
        break;
      }
      case 'answer': {
        var k = arg.kind, id = arg.id, v = arg.value, before = k === 'gate' && allGates();
        if (k === 's2') rec.step2[id] = v;
        else if (k === 'mh') rec.mh[id] = v;
        else if (k === 'q') rec.qa[id] = v;
        else if (k === 'gate') { var gk = S.gateKey(rec); rec.gates[gk] = Object.assign({}, rec.gates[gk] || {}); rec.gates[gk][id] = v; }
        if (ui.mark && S.open(D, rec, rec.step).indexOf(ui.mark) < 0) ui.mark = '';
        save(); render();
        /* council v3.0.1, BUILD NOW 5 (clean-up v2, N10): the last How it works answer draws the questions; say so */
        if (k === 'gate' && !before && allGates() && rec.step === 'use') { var nq = R.visible(D, A().use, A().gates).length; $('live').textContent = plural(nq, 'question for this use case is', 'questions for this use case are') + ' now shown below.'; }
        break;
      }
      case 'use': rec.use = arg; if (arg !== 'none') { var u = S.useOf(D, arg); if (u) { ui.dept = u.department; ui.area = areaOf(u.department); } } save(); render(); break;
      case 'area': ui.area = arg; ui.dept = ''; ui.q = ''; ui.focus = 'lvl-h'; render(); break;
      case 'dept': ui.dept = arg; if (arg) ui.area = areaOf(arg); else if (ui.area === null) ui.area = whereLevel().area; ui.q = ''; ui.focus = 'lvl-h'; render(); break;
      case 'search': {
        ui.q = String(arg || '');
        var box = $('uc-results'), cnt = $('uc-count');
        /* one status node whose text changes (clean-up v2, N11) */
        if (box && rec.step === 'where') { box.innerHTML = ucResults(); if (cnt) cnt.textContent = countLine(searchUses(ui.q)); }
        logSearch(ui.q); break;
      }
      case 'new': if (heldBlock()) return false; newCheck(); break;
    }
    return true;
  }
  /* While the conflict banner holds a write, nothing may replace the open check (clean-up v2, N3). */
  function heldBlock() {
    if (!ui.conflict) return false;
    var c = $('conflict'); if (c) c.focus();
    toast(T.held); return true;
  }
  function newCheck() {
    var h = rec.hotel;
    timeStep(null); flush();
    var nr = S.blank(); nr.hotel = { name: h.name, type: h.type, role: h.role, country: h.country };
    replaceRec(nr, null); go('hotel');
  }
  /* The confirm dialog: o = { title, text, yes, act, id, back (the id to focus on Cancel), focusYes } */
  function ask(o) {
    var d = $('confirm');
    ui.confirmBack = o.back || '';
    d.innerHTML = '<h2 id="confirm-title">' + esc(o.title) + '</h2><p>' + esc(o.text) + '</p>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="' + o.act + '-yes"' + (o.id ? ' data-id="' + esc(o.id) + '"' : '') + '>' + esc(o.yes) + '</button><button type="button" class="btn" data-act="' + o.act + '-no">Cancel</button></div>';
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    var b = d.querySelector('[data-act="' + o.act + (o.focusYes ? '-yes' : '-no') + '"]'); if (b) b.focus();
  }
  function askNew(from) {
    if (heldBlock()) return;
    if (!S.hasAnswers(rec)) { newCheck(); return; }
    ask({ title: 'Start a new check?', act: 'new', yes: 'Start a new check', back: from || 'new-check', focusYes: true,
      text: (ST.kind === 'memory' ? 'Your answers can\'t be saved in this browser. Save this check as a file first, or it will be lost.' : 'This check stays under Your checks in this browser.') + ' The hotel details carry over.' });
  }
  function askRemove(id) {
    ask({ title: 'Remove this check?', act: 'remove', yes: 'Remove', id: id, back: 'rm-' + uid(id), focusYes: false,
      text: 'It cannot be brought back. Save it as a file first if you may need it.' });
  }
  function removeCheck(id) {
    var items = [].slice.call(document.querySelectorAll('#mychecks li')), pos = items.map(function (li) { return li.getAttribute('data-id'); }).indexOf(id);
    removed[id] = 1; idx.ids = idx.ids.filter(function (x) { return x !== id; }); ST.del(REC + id);
    if (id === rec.id) { timeStep(null); replaceRec(S.blank(), null); setStep('start'); }
    flush(); ui.listFocus = pos < 0 ? 0 : pos; render();
  }
  function closeConfirm() { var d = $('confirm'); if (d.open) { if (typeof d.close === 'function') d.close(); else d.removeAttribute('open'); } }
  function confirmBack() { var b = ui.confirmBack && $(ui.confirmBack); (b || $('h') || $('view')).focus(); }

  /* ---------- copy, downloads, files ---------- */
  /* Copy through the clipboard; when it is blocked, the text box (kind text). Copy inside the box keeps the box as it is, with its
     label and instructions, and selects the text (clean-up v2, N13). */
  function copyText(text, done, from) {
    function blocked(msg) {
      if (from === 'copy-box' && ui.copy) { var t = $('copy-text'); if (t) { t.focus(); t.select(); } toast('Copying was blocked. Select the text and copy it.'); return; }
      showCopy('text', msg, 'Text to copy', text, from);
    }
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(function () { toast(done || 'Copied.'); }, function () { blocked('Copying was blocked here. Select the text below and copy it.'); }); return; } } catch (e) {}
    blocked('Select the text below and copy it.');
  }
  /* kind: save (the saved check, drawn live from the record) | plan (the plan as text) | text */
  function showCopy(kind, msg, label, text, from) { ui.copy = { kind: kind, msg: msg, label: label, text: kind === 'save' ? '' : text, from: from || (ui.copy && ui.copy.from) || '' }; render(); var t = $('copy-text'); if (t) { t.focus(); t.select(); } }
  var dlP = null;
  /* the downloads capability, or null (not offered, refused, or no answer within 10 s). Only a real capability is remembered: after
     null the next click asks the host again (clean-up v2, N16). */
  function downloads() {
    if (!dlP) {
      var p = dlP = new Promise(function (res) {
        var timer = setTimeout(function () { res(null); }, DL_MS);
        function end(v) { clearTimeout(timer); res(v || null); }
        try { var c = window.claude; if (!c || typeof c.use !== 'function') { end(null); return; } Promise.resolve(c.use('downloads')).then(end, function () { end(null); }); } catch (e) { end(null); }
      });
      p.then(function (v) { if (!v && dlP === p) dlP = null; });
    }
    return dlP;
  }
  function slug(s) { s = String(s || ''); if (s.normalize) s = s.normalize('NFKD').replace(/[̀-ͯ]/g, ''); return s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60); }
  function fileBase() { return 'Do-you-need-AI_' + (slug(rec.hotel.name) || 'check') + '_' + today(); }
  function setBusy(act, on) {
    if (on) ui.busy[act] = true; else delete ui.busy[act];
    document.querySelectorAll('[data-act="' + act + '"]').forEach(function (b) {
      if (on) { b.setAttribute('aria-busy', 'true'); b.setAttribute('aria-disabled', 'true'); b.textContent = 'Preparing…'; }
      else { b.removeAttribute('aria-busy'); b.removeAttribute('aria-disabled'); b.textContent = b.getAttribute('data-label') || b.textContent; }
    });
  }
  /* One download through the capability; act = the button (pdf | save-file). Returns 'saved' | 'declined' | 'busy' | 'fallback'. */
  function offer(act, filename, data, fallback) {
    if (ui.busy[act]) return Promise.resolve('busy');
    setBusy(act, true);
    var at = rec.step, atRec = rec.id;
    /* a fallback that arrives after the user moved on does not open a box on another screen (clean-up v2, N12) */
    function fb(msg) {
      setBusy(act, false);
      if (rec.step !== at || rec.id !== atRec) { toast(act === 'pdf' ? 'Downloads are not available here. Use Copy on the result.' : 'Downloads are not available here. Press Save as file again to copy the saved check.'); return 'moved'; }
      fallback(msg); return 'fallback';
    }
    return downloads().then(function (dl) {
      if (!dl || typeof dl.save !== 'function') return fb(T.noDl);
      return Promise.resolve().then(function () { return dl.save({ filename: filename, data: data }); }).then(function () { setBusy(act, false); toast('Saved ' + filename); return 'saved'; }, function (e) {
        var code = e && e.code;
        if (code === 'declined') { setBusy(act, false); toast('Download cancelled.'); return 'declined'; }
        if (code === 'rate_limited') { setBusy(act, false); toast('A download is already waiting for your answer.'); return 'busy'; }
        return fb(/^(unavailable|not_granted)$|^capability/.test(String(code || '')) ? T.noDl : T.saveFail);
      });
    }).catch(function () { return fb(T.saveFail); });
  }
  function fileDoc() { return S.fileDoc(rec); }
  function saveFile(from) {
    flush();
    var text = JSON.stringify(fileDoc(), null, 1);
    return offer('save-file', fileBase() + '.json', text, function (msg) { showCopy('save', msg + ' Copy saved check: keep this text, and paste it under Open a saved file to continue later.', 'Saved check', '', from); });
  }
  function pdfBytes() {
    if (!window.R3Pdf || !window.jspdf) throw new Error('no PDF library');
    return window.R3Pdf.draw(window.R3Pdf.blocks(model()), window.jspdf, FONT).doc.output('arraybuffer');
  }
  function downloadPdf() {
    var m = model(), bytes;
    try { bytes = pdfBytes(); } catch (e) { showCopy('plan', T.pdfFail, 'The plan as text', RES.planText(m), 'pdf'); return Promise.resolve('failed'); }
    return offer('pdf', fileBase() + '.pdf', bytes, function (msg) { showCopy('plan', msg, 'The plan as text', RES.planText(m), 'pdf'); });
  }
  /* Open a saved file (text). Returns false for a bad or newer file; true when it opens (synchronously, except with artifact
     storage, where the stored copy of the same check is read first). A file of a check this browser holds in a newer version opens
     as a copy (clean-up H2). */
  function openText(text) {
    if (heldBlock()) return false;
    var doc = null; try { doc = JSON.parse(text); } catch (e) { doc = null; }
    var r = doc && S.readFile(D, MIG || {}, doc);
    if (r && r.newer) { ui.fileErr = T.newerFile; render(); return false; }
    if (!r) { ui.fileErr = T.badFile; render(); return false; }
    ui.fileErr = '';
    var f = r.rec;
    function apply(stored) {
      var copy = S.openMode(f, stored, r.info) === 'copy';
      timeStep(null); flush();
      if (copy) f.id = S.newId();
      replaceRec(f, copy ? null : stored ? stored.updated : null);
      if (r.info.v3) setStep(rec.step);
      /* opening is not a change: the file's own stamp stays (clean-up v2, N15) */
      ui.toTop = true; persist(); render(); toast(copy ? T.copyOpened : 'Opened the saved check.');
    }
    if (f.id === rec.id) { apply(rec); return true; }
    var p = ST.peek(REC + f.id);
    if (p !== undefined) { apply(parseRec(p)); return true; }
    loadRec(f.id).then(apply);
    return true;
  }
  /* Take the other tab's version of this check (conflict, or a change seen while nothing is waiting to be saved here). */
  function adopt(other) {
    var st = rec.step; rec = other; setStep(st); base = other.updated; ui.conflict = null; ui.mark = ''; ui.warned = ''; render();
  }

  /* ---------- wiring ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.getAttribute('data-act'), id = t.getAttribute('data-id');
    switch (act) {
      case 'begin': case 'resume': case 'next': case 'back': case 'change': case 'continue': send(act); break;
      case 'new': askNew(t.id); break;
      case 'new-yes': closeConfirm(); newCheck(); break;
      case 'new-no': closeConfirm(); confirmBack(); break;
      case 'remove-check': if (id === rec.id && heldBlock()) break; askRemove(id); break;
      case 'remove-yes': closeConfirm(); removeCheck(id); break;
      case 'remove-no': closeConfirm(); confirmBack(); break;
      case 'why': ui.why[id] = !ui.why[id]; ui.focus = t.id || null; t.setAttribute('aria-expanded', String(!!ui.why[id])); var w = $('why-' + uid(id)); if (w) w.hidden = !ui.why[id]; break;
      case 'first-open': markFirstOpen(rec.step); break;
      case 'goto-mh': send('goto-mh', id); break;
      case 'goto-where': send('goto', 'where'); break;
      case 'imported-ok': if (rec.imported) { rec.imported.seen = true; ui.focus = 'h'; save(); render(); } break;
      case 'gone-keep': delete removed[rec.id]; ui.gone = false; ui.focus = 'h'; save(); flush(); render(); toast('This check is kept here.'); break;
      case 'gone-new': newCheck(); break;
      case 'area': send('area', id); break;
      case 'dept': send('dept', id); break;
      case 'copy-src': copyText(t.getAttribute('data-url'), 'Copied the address.', t.id); break;
      case 'conflict-theirs': if (ui.conflict) { adopt(ui.conflict); ui.focus = 'h'; render(); toast('Showing the other version of this check.'); } break;
      case 'conflict-mine': if (ui.conflict) { base = ui.conflict.updated; ui.conflict = null; save(); flush(); ui.focus = 'h'; render(); toast('Your answers are saved.'); } break;
      case 'copy': copyText(RES.summaryText(model()), 'Copied the result.', 'copy'); break;
      case 'copy-person': copyText(RES.personText(model(), id), 'Copied.', t.id); break;
      case 'copy-box': var ta = $('copy-text'); if (ta) copyText(ta.value, 'Copied.', 'copy-box'); break;
      case 'copy-close': { var from = ui.copy && ui.copy.from; ui.copy = null; ui.focus = from && from !== 'copy-box' ? from : 'h'; render(); if (document.activeElement === document.body) { var hh = $('h'); if (hh) hh.focus(); } break; }
      case 'pdf': if (!ui.busy.pdf) downloadPdf(); break;
      case 'save-file': if (!ui.busy['save-file']) saveFile(t.id); break;
      case 'paste-open': var p = $('paste-in'); if (p) openText(p.value); break;
      case 'open-check': if (heldBlock()) break; loadRec(id).then(function (r) { if (!r) { toast('This check could not be opened.'); return; } timeStep(null); flush(); replaceRec(r, r.updated); setStep(r.step); ui.toTop = true; persist(); render(); }); break;
    }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('input[type=radio][data-kind]')) {
      ui.focus = t.id;
      if (t.getAttribute('data-kind') === 'use') send('use', t.value);
      else send('answer', { kind: t.getAttribute('data-kind'), id: t.getAttribute('data-id'), value: t.value });
    } else if (t.matches('[data-h]')) send('hotel', { k: t.getAttribute('data-h'), v: t.value });
    else if (t.id === 'file-in' && t.files && t.files[0]) {
      var fr = new FileReader(); fr.onload = function () { openText(String(fr.result)); }; fr.onerror = function () { ui.fileErr = T.badFile; render(); }; fr.readAsText(t.files[0]);
    }
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.matches('input[type=text][data-h]')) send('hotel', { k: t.getAttribute('data-h'), v: t.value });
    else if (t.id === 'uc-search') send('search', t.value);
  });
  $('confirm').addEventListener('cancel', function () { setTimeout(confirmBack, 0); });
  /* print opens the folds and closes them again after; a second beforeprint before afterprint (seen when printing to PDF) keeps the first state */
  window.addEventListener('beforeprint', function () { document.querySelectorAll('details.fold').forEach(function (d) { if (!d.hasAttribute('data-was')) d.setAttribute('data-was', d.open ? '1' : ''); d.open = true; }); });
  window.addEventListener('afterprint', function () { document.querySelectorAll('details.fold[data-was]').forEach(function (d) { d.open = d.getAttribute('data-was') === '1'; d.removeAttribute('data-was'); }); });
  /* a save still waiting when the page is hidden or closed is written now (clean-up L2) */
  function leave() { if (!ready) return; if (SESSION) { timeStep(null); ui.tPaused = true; } if (saveTimer || SESSION) flush(); }
  window.addEventListener('pagehide', leave);
  /* hidden: close the step's time and pause; shown again: count from now (clean-up v2, N9b) */
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') leave(); else { ui.tAt = Date.now(); ui.tPaused = false; } });
  /* another tab changed the index or this check (localStorage only; clean-up M1, M2) */
  window.addEventListener('storage', function (e) {
    if (!ready || ST.kind !== 'local' || !e.key) return;
    if (e.key === KEY) { mergeIdx(e.newValue); if (rec.step === 'start') drawMyChecks(); return; }
    /* removed in another tab: nothing is written back until Keep it here (clean-up v2, N14) */
    if (e.key === REC + rec.id && e.newValue === null) { if (S.hasAnswers(rec)) { removed[rec.id] = 1; ui.gone = true; listIt(rec); drawBanner(); } return; }
    if (e.key === REC + rec.id && e.newValue) {
      var other = parseRec(e.newValue);
      if (!other || other.updated === base || other.updated === rec.updated) return;
      /* a held conflict takes the newer other version and stays held (clean-up v2, N2) */
      if (saveTimer || ui.conflict) { ui.conflict = other; drawBanner(); }
      else { adopt(other); toast('Updated with the answers from another tab.'); }
    }
  });

  /* ---------- start ---------- */
  /* Boot settles once: with the stored check, or (no storage answer within 3 s, or a failed read) in memory with the banner. */
  function boot() {
    var done = false, timer = null;
    function finish(r) {
      if (done) return; done = true; clearTimeout(timer);
      if (r) { rec = r; setStep(r.step); base = r.updated; } else idx.cur = rec.id;
      ready = true; render();
    }
    function toMemory() { ST.fail(); idx = { v: 1, cur: rec.id, ids: [] }; finish(null); }
    timer = setTimeout(function () { if (!done) toMemory(); }, BOOT_MS);
    Promise.resolve().then(function () { return ST.init(); }).then(function () { return done ? null : ST.get(KEY); }).then(function (t) {
      if (done) return null;
      var I = parseIdx(t);
      if (I) { idx = I; return idx.cur ? ST.get(REC + idx.cur).then(parseRec) : null; }
      /* first visit: checks of the earlier version in this browser are imported once (never written back). Only seen when this page
         shares its origin with readiness-2 (a local or same-site copy); a published artifact has its own origin. */
      var old = null; try { old = JSON.parse(localStorage.getItem(OLD_KEY) || 'null'); } catch (e) { old = null; }
      var list = old && MIG ? S.fromV2Store(D, MIG, old) : [];
      if (!list.length) return null;
      return Promise.all(list.map(function (x) { idx.ids.push(x.rec.id); return ST.set(REC + x.rec.id, JSON.stringify(x.rec)); })).then(function () {
        idx.cur = list[0].rec.id;
        return ST.set(KEY, JSON.stringify(idx)); /* clean-up L3: the import is written to the index at once */
      }).then(function () { return list[0].rec; });
    }).then(finish, toMemory);
  }
  window.Readiness3 = {
    ready: function () { return ready; },
    state: function () {
      var a = A();
      return { step: rec.step, storage: ST.kind, saved: ST.kind === 'memory' ? 'memory' : ui.conflict ? 'conflict' : saveTimer ? 'pending' : 'saved', use: rec.use,
        gates: R.askedGates(D, a.use).map(function (g) { return g.id; }), visible: R.visible(D, a.use, a.gates).map(function (q) { return q.id; }), open: S.open(D, rec, rec.step),
        imported: rec.imported, verdict: rec.step === 'result' || rec.step === 'stop' ? model().verdict : null,
        copy: !!ui.copy, busy: Object.keys(ui.busy), conflict: !!ui.conflict, gone: ui.gone, fileErr: ui.fileErr, where: whereLevel(), session: SESSION };
    },
    record: function () { return JSON.parse(JSON.stringify(rec)); },
    model: model, send: send, fileDoc: fileDoc, openText: openText, flush: flush,
    summaryText: function () { return RES.summaryText(model()); }, planText: function () { return RES.planText(model()); },
    pdfModel: function () { return window.R3Pdf ? window.R3Pdf.blocks(model()) : null; }, pdfBytes: pdfBytes, downloadPdf: downloadPdf, saveFile: saveFile
  };
  boot();
})();
