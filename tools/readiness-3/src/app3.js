/* Do you need AI? v3 (tools/readiness-3): the page. Draws each screen from the record (R3Store), the rules (R3Rules) and the
   result model (R3Result); every hotel-facing string from the question data is used verbatim. Chrome text written here is plain
   English and passes the banned-term grep (lib/banned.mjs).
   Storage: window.storage (artifact storage, personal scope) when the viewer offers it, else localStorage, else memory (with a
   banner). Key hftp-readiness3-v1 holds the index { v, cur, ids }; each check is one record under hftp-readiness3-v1_c_<id>.
   Downloads (PDF, saved file) go only through the artifact downloads capability (window.claude.use("downloads")); when it is not
   there, Copy is offered instead. No page-started download links.
   Test and agent API: window.Readiness3 (state, record, model, send, pdfModel, pdfBytes, fileDoc, openText). */
(function () {
  'use strict';
  var R = window.R3Rules, S = window.R3Store, RES = window.R3Result, X3 = window.R3Data;
  function $(id) { return document.getElementById(id); }
  function json(id) { var e = $(id); if (!e) return null; try { return JSON.parse(e.textContent); } catch (err) { return null; } }
  var D = json('r3-data'), EX = json('r3-ex') || {}, MIG = json('r3-mig'), FONT = json('r3-font');
  var IX = X3.index(D);
  var KEY = 'hftp-readiness3-v1', OLD_KEY = 'hftp-readiness2-v1', REC = KEY + '_c_';
  var STEP_NAMES = ['About your hotel', 'Is this an AI problem?', 'Must-haves', 'Where in the hotel?', 'Questions for this use case'];
  var TYPES = [['independent', 'Independent hotel'], ['group', 'Part of a group, run by the group'], ['managed', 'Managed or franchised']];
  var ROLES = [['gm', 'General manager'], ['owner', 'Owner or asset manager'], ['dept', 'Head of a department'], ['it', 'IT or technology lead'], ['fin', 'Finance'], ['other', 'Other']];
  var COUNTRIES = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Other'];
  var PLANNED_HELP = 'If your vendor has confirmed it in writing but it isn\'t set up yet, answer Planned.';
  var T = {
    noStore: 'Your answers can\'t be saved in this browser. Use Save as file.',
    badFile: 'This file isn\'t a saved check from this tool.',
    pdfFail: 'The PDF couldn\'t be made. Use Copy instead.',
    noDl: 'Downloads are not available here. Use Copy instead.'
  };

  var rec = S.blank(), idx = { v: 1, cur: rec.id, ids: [] }, ready = false;
  var ui = { warned: '', why: {}, dept: '', copy: null, fileErr: '', focus: null, toTop: false, mark: '', events: [] };

  /* ---------- storage ---------- */
  var mem = {};
  var ST = {
    kind: 'memory',
    init: function () {
      var self = this;
      function local() { try { localStorage.setItem(KEY + '_probe', '1'); localStorage.removeItem(KEY + '_probe'); self.kind = 'local'; } catch (e) { self.kind = 'memory'; } }
      try {
        if (window.storage && typeof window.storage.get === 'function' && typeof window.storage.set === 'function') {
          return Promise.resolve(window.storage.set(KEY + '_probe', '1', false)).then(function () { self.kind = 'artifact'; try { window.storage.delete(KEY + '_probe', false); } catch (e) {} }, local);
        }
      } catch (e) {}
      local(); return Promise.resolve();
    },
    get: function (k) {
      var self = this;
      if (self.kind === 'artifact') return Promise.resolve().then(function () { return window.storage.get(k, false); }).then(function (r) { return r && typeof r.value === 'string' ? r.value : null; }, function () { return null; });
      if (self.kind === 'local') { try { return Promise.resolve(localStorage.getItem(k)); } catch (e) { return Promise.resolve(null); } }
      return Promise.resolve(Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null);
    },
    set: function (k, v) {
      var self = this;
      if (self.kind === 'artifact') return Promise.resolve().then(function () { return window.storage.set(k, v, false); }).then(function () { return true; }, function () { self.fail(); mem[k] = v; return false; });
      if (self.kind === 'local') { try { localStorage.setItem(k, v); return Promise.resolve(true); } catch (e) { self.fail(); } }
      mem[k] = v; return Promise.resolve(false);
    },
    del: function (k) {
      if (this.kind === 'artifact') return Promise.resolve().then(function () { return window.storage.delete(k, false); }).catch(function () {});
      if (this.kind === 'local') { try { localStorage.removeItem(k); } catch (e) {} }
      delete mem[k]; return Promise.resolve();
    },
    fail: function () { if (this.kind !== 'memory') { this.kind = 'memory'; drawBanner(); } }
  };
  var saveTimer = null;
  function save() {
    rec.updated = new Date().toISOString();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 120);
  }
  function flush() {
    clearTimeout(saveTimer); saveTimer = null;
    var r = rec;
    if (S.hasAnswers(r) && idx.ids.indexOf(r.id) < 0) idx.ids.push(r.id);
    idx.cur = r.id;
    return ST.set(REC + r.id, JSON.stringify(r)).then(function () { return ST.set(KEY, JSON.stringify(idx)); });
  }
  function loadRec(id) { return ST.get(REC + id).then(function (t) { try { return t ? S.clean(D, JSON.parse(t)) : null; } catch (e) { return null; } }); }
  function listChecks() {
    return Promise.all(idx.ids.map(function (id) { return id === rec.id ? Promise.resolve(rec) : loadRec(id); })).then(function (rs) { return rs.filter(Boolean); });
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
  function openNote(step) {
    if (ui.warned !== step) return '';
    var n = S.open(D, rec, step).length; if (!n) return '';
    return '<div class="note" id="open-note" role="alert"><p>' + esc(plural(n, 'question has', 'questions have')) + ' no answer yet. ' + (n === 1 ? 'It counts' : 'They count') + ' as Don\'t know yet. Press Next again to go on.</p>' +
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
  function drawBanner() {
    var h = '';
    if (ST.kind === 'memory') h += '<div class="banner warn" id="nostore" role="status"><p>' + esc(T.noStore) + '</p>' + (S.hasAnswers(rec) ? '<p><button type="button" class="btn small" data-act="save-file">Save as file</button></p>' : '') + '</div>';
    if (rec.imported && !rec.imported.seen) {
      var im = rec.imported;
      h += '<div class="banner info" id="imported" role="status"><p>Imported from v' + esc(im.from) + ': please answer ' + esc(plural(im.n, 'new question', 'new questions')) + '.' +
        (im.dropped ? ' ' + esc(plural(im.dropped, 'earlier answer was', 'earlier answers were')) + ' not carried over, because those questions were merged into others or removed.' : '') + '</p>' +
        '<p><button type="button" class="btn small" data-act="imported-ok">OK</button></p></div>';
    }
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
      '<div class="btnrow">' + (has ? '<button type="button" class="btn primary" data-act="resume">Continue this check</button><button type="button" class="btn" data-act="new">Start a new check</button>' : '<button type="button" class="btn primary" data-act="begin">Start</button>') + '</div></section>' +
      '<section class="panel" aria-labelledby="mine-h"><h2 id="mine-h">Your checks in this browser</h2><div id="mychecks"><p class="meta">Loading…</p></div>' +
      '<h3>Open a saved file</h3><p class="meta">A file saved with Save as file, from this tool or from the earlier version (v2.6.1).</p>' +
      '<div class="btnrow"><label class="btn" for="file-in">Open a saved file<input type="file" id="file-in" accept=".json,application/json" class="sr"></label></div>' +
      '<details class="fold"><summary>Or paste a saved check</summary><label class="fld" for="paste-in"><span>Saved check (the text from Copy saved check)</span><textarea id="paste-in"></textarea></label><div class="btnrow"><button type="button" class="btn" data-act="paste-open">Open</button></div></details>' +
      (ui.fileErr ? '<p class="banner err" role="alert" id="file-err">' + esc(ui.fileErr) + '</p>' : '') + '</section>';
  }
  function drawMyChecks() {
    var box = $('mychecks'); if (!box) return;
    listChecks().then(function (rs) {
      if (!$('mychecks')) return;
      rs = rs.filter(function (r) { return S.hasAnswers(r); });
      if (!rs.length) { $('mychecks').innerHTML = '<p class="meta">None yet.</p>'; return; }
      $('mychecks').innerHTML = '<ul class="checks">' + rs.map(function (r) {
        var u = S.useOf(D, r.use), nm = (r.hotel.name || 'Hotel not named') + ' · ' + (u ? u.title : r.use === 'none' ? D.none_fits.title : 'no use case yet');
        return '<li><span>' + esc(nm) + '<br><span class="meta">Last changed ' + esc((r.updated || '').slice(0, 10)) + (r.id === rec.id ? ' · open now' : '') + '</span></span><span class="btnrow">' +
          (r.id === rec.id ? '' : '<button type="button" class="btn small" data-act="open-check" data-id="' + esc(r.id) + '">Open</button>') +
          '<button type="button" class="btn small" data-act="remove-check" data-id="' + esc(r.id) + '">Remove</button></span></li>';
      }).join('') + '</ul>';
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
          radios('s2', s.id, D.answers.step2, rec.step2[s.id], 'lg-' + s.id) + '</fieldset>';
      }).join('') + openNote('s2') + nav('Back', 'Next');
  }
  function contraFor(id) { return R.contradictions(D, A().use, A().gates, rec.mh).filter(function (c) { return c.id === id; })[0]; }
  function vMust() {
    var texts = D.must_haves.map(function (m) { return m.text + ' ' + (m.na_help || ''); });
    return '<div class="stephead"><h2 tabindex="-1" id="h">Must-haves</h2><p class="sub">Eleven things to have in place before any AI project starts. Each one must be Yes for a Ready result.</p>' + gloss(texts) + '</div>' +
      D.must_haves.map(function (m, i) {
        var c = rec.mh[m.id] === 'na' ? contraFor(m.id) : null;
        return '<fieldset class="card must' + (ui.mark === m.id ? ' open-mark' : '') + '" id="card-' + m.id + '"><legend id="lg-' + m.id + '"><span class="qtitle">Must-have ' + (i + 1) + ': ' + esc(m.title) + '</span><span class="qtext">' + esc(m.text) + '</span>' +
          '<span class="tags"><span class="tag mustyes">Must be Yes</span></span></legend>' +
          radios('mh', m.id, m.na ? D.answers.check_da : D.answers.check, rec.mh[m.id], 'lg-' + m.id) +
          (m.na ? '<p class="help" id="na-' + m.id + '">' + esc(m.na_help) + '</p>' : '') +
          '<p class="help">' + esc(PLANNED_HELP) + '</p>' +
          (c ? '<div class="note" role="note" id="contra-mh-' + m.id + '"><p>' + esc(c.note) + '</p></div>' : '') + '</fieldset>';
      }).join('') + openNote('must') + nav('Back', 'Next');
  }
  function vWhere() {
    var u = S.useOf(D, rec.use), dept = ui.dept || (u ? u.department : '');
    var deptObj = IX.DEPTS.filter(function (d) { return d.name === dept; })[0];
    var h = '<div class="stephead"><h2 tabindex="-1" id="h">Where in the hotel?</h2><p class="sub">Choose the use case closest to your idea. If none is close, choose None of these fits: you then get general questions.</p></div>';
    h += '<section class="panel"><label class="fld" for="dept"><span>Department</span><select id="dept"><option value="">Choose a department</option>' +
      IX.DEPTS.map(function (d) { return '<option value="' + esc(d.name) + '"' + (d.name === dept ? ' selected' : '') + '>' + esc(d.name) + ' (' + d.uses.length + ')</option>'; }).join('') + '</select></label>';
    if (deptObj) {
      h += '<fieldset class="card" style="border:0;padding:0"><legend id="lg-uc" class="qtitle">Use cases in ' + esc(deptObj.name) + '</legend><ul class="uclist" role="radiogroup" aria-labelledby="lg-uc">' + deptObj.uses.map(function (x) {
        var iid = 'r-use-' + uid(x.id);
        return '<li><label class="opt" for="' + iid + '"><input type="radio" name="n-use" id="' + iid + '" value="' + esc(x.id) + '" data-kind="use"' + (rec.use === x.id ? ' checked' : '') + '>' + esc(x.title) + '</label></li>';
      }).join('') + '</ul></fieldset>';
    }
    if (deptObj) h += gloss(deptObj.uses.map(function (x) { return x.title; }));
    h += '<div class="uclist"><label class="opt" for="r-use-none"><input type="radio" name="n-use-none" id="r-use-none" value="none" data-kind="use"' + (rec.use === 'none' ? ' checked' : '') + '>None of these fits</label></div></section>';
    if (u) {
      var e = EX[u.id] || {};
      h += '<section class="panel about" aria-labelledby="about-h" id="about"><h3 id="about-h">Your choice: ' + esc(u.title) + '</h3><dl><dt>Department</dt><dd>' + esc(u.department) + '</dd>' +
        (e.does ? '<dt>What it does</dt><dd>' + esc(e.does) + '</dd>' : '') + (e.how ? '<dt>How the AI works</dt><dd>' + esc(e.how) + '</dd>' : '') + '</dl>' + gloss([u.title, e.does || '', e.how || '']) + '</section>';
    } else if (rec.use === 'none') h += '<section class="panel about" id="about"><h3>Your choice: None of these fits</h3><p>You get the five How it works questions and six general questions. The result can be Almost ready at best, because the questions are not tailored.</p></section>';
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
  function qCard(q) {
    var B = q.weight === 'B';
    return '<fieldset class="card' + (B ? ' must' : '') + (ui.mark === q.id ? ' open-mark' : '') + '" id="card-' + uid(q.id) + '"><legend id="lg-' + uid(q.id) + '"><span class="qtext">' + esc(q.text) + '</span>' +
      '<span class="tags"><span class="tag">Who answers: ' + esc(D.labels.owners[q.owner] || q.owner) + '</span>' + (B ? '<span class="tag mustyes">Must be Yes</span>' : '<span class="tag">' + esc(D.labels.weights[q.weight]) + '</span>') + '</span></legend>' +
      radios('q', q.id, D.answers.check, rec.qa[q.id], 'lg-' + uid(q.id)) + '<p class="help">' + esc(PLANNED_HELP) + '</p>' + whyToggle(q.id, q.why) + '</fieldset>';
  }
  function vUse() {
    var a = A(), u = S.useOf(D, a.use), gates = R.askedGates(D, a.use), G = a.gates, allG = gates.every(function (g) { return !!G[g.id]; });
    var qs = R.visible(D, a.use, G), texts = [u ? u.title : ''].concat(gates.map(function (g) { return g.text + ' ' + g.options.map(function (o) { return o.label; }).join(' '); }));
    if (allG) texts = texts.concat(qs.map(function (q) { return q.text + ' ' + (q.why || ''); }));
    var h = '<div class="stephead"><h2 tabindex="-1" id="h">Questions for this use case</h2><p class="sub" id="use-line">Use case: <b>' + esc(u ? u.title : D.none_fits.title) + '</b></p>' +
      (!rec.use ? '<p class="note info" id="no-use">You did not choose a use case, so these are the general questions for None of these fits.</p>' : '') + gloss(texts) + '</div>';
    h += '<section aria-labelledby="hiw-h" class="stephead" id="hiw"><h3 id="hiw-h" class="areahead">First, how will this tool work in your hotel?</h3><p class="sub">Your answers here decide which questions follow.</p></section>' + gates.map(function (g) { return gateCard(g, G); }).join('');
    if (!allG) h += '<p class="note info" id="gates-first">Answer ' + (gates.length === 1 ? 'the question above' : 'the questions above') + ' to see the questions for this use case.</p>';
    else {
      var order = Object.keys(D.labels.areas), groups = {};
      qs.forEach(function (q) { (groups[q.area] = groups[q.area] || []).push(q); });
      order.forEach(function (k) { if (!groups[k]) return; h += '<h3 class="areahead" id="area-' + k + '">' + esc(D.labels.areas[k]) + '</h3>' + groups[k].map(qCard).join(''); });
    }
    return h + openNote('use') + nav('Back', 'See the result');
  }
  function vStop() {
    var m = model();
    return '<section class="verdict v-accent" id="verdict" aria-labelledby="h"><p class="vkicker">Step 2 result</p><h1 tabindex="-1" id="h">' + esc(m.verdict) + '</h1><p class="reason" id="reason">' + esc(m.reason) + '</p></section>' +
      '<section class="panel" aria-labelledby="simpler-h"><h2 id="simpler-h">Simpler options to try first</h2><ul class="plain" id="simpler">' + m.simpler.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<p>If you still think AI is needed, Continue anyway. The result can then be Almost ready at best.</p>' +
      '<div class="btnrow"><button type="button" class="btn" data-act="change">Change my answers</button><button type="button" class="btn primary" data-act="continue">Continue anyway</button>' +
      '<button type="button" class="btn" data-act="pdf" id="pdf">Download (PDF)</button></div>' + copyBox() + '</section>' +
      '<section class="panel" aria-labelledby="top-h"><h2 id="top-h">Top 3 actions</h2>' + top3(m) + '</section>' +
      '<p class="disc" id="disclaimer">' + esc(m.disclaimer) + '</p>' + gloss(m.simpler.concat(m.top3.map(function (a) { return a.text; })));
  }
  function top3(m) {
    if (!m.top3.length) return '<p id="top3">Nothing open.</p>';
    return '<ol class="top3" id="top3">' + m.top3.map(function (a) { return '<li>' + esc(a.text) + '<span>' + esc(a.owner) + '</span></li>'; }).join('') + '</ol>';
  }
  function copyBox() {
    if (!ui.copy) return '';
    return '<div class="copybox" id="copybox" role="region" aria-labelledby="copy-msg"><p class="banner warn" id="copy-msg">' + esc(ui.copy.msg) + '</p>' +
      '<label class="fld" for="copy-text"><span>' + esc(ui.copy.label) + '</span><textarea id="copy-text" readonly>' + esc(ui.copy.text) + '</textarea></label>' +
      '<div class="btnrow"><button type="button" class="btn" data-act="copy-box">Copy</button><button type="button" class="btn" data-act="copy-close">Close</button></div></div>';
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
    h += '<div class="btnrow noprint" id="actions"><button type="button" class="btn" data-act="copy" id="copy">Copy the result</button><button type="button" class="btn primary" data-act="pdf" id="pdf">Download (PDF)</button>' +
      '<button type="button" class="btn" data-act="save-file" id="save-file">Save as file</button></div>' + copyBox();
    h += '<section class="panel" aria-labelledby="areas-h" id="areas"><h2 id="areas-h">Details by area</h2><ul class="areas">' + m.areas.map(function (a) {
      return '<li data-area="' + a.key + '"><b>' + esc(a.name) + '</b><span class="track" aria-hidden="true"><i style="width:' + Math.round(100 * a.yes / a.total) + '%"></i></span><span>' + esc(a.line) + '</span></li>';
    }).join('') + '</ul></section>';
    h += '<section class="panel" aria-labelledby="plan-h" id="plan"><h2 id="plan-h">Action plan by person</h2>' + (m.people.length ? m.people.map(function (p) {
      return '<div class="person" data-owner="' + esc(p.key) + '"><div class="personhead"><h3>' + esc(p.owner) + '</h3><button type="button" class="btn small" data-act="copy-person" data-id="' + esc(p.key) + '">Copy for ' + esc(p.owner) + '</button></div><ul class="plain">' + p.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
    }).join('') : '<p>Nothing open.</p>') + '</section>';
    h += '<section class="panel" aria-labelledby="vendor-h" id="vendor"><h2 id="vendor-h">Questions to ask the vendor</h2>' + (m.vendor.length ? '<ul class="plain">' + m.vendor.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '<p>None: no answer is Don\'t know yet and nothing is left for the vendor.</p>') + '</section>';
    h += '<details class="panel fold" id="all-qa"><summary>Every question and your answer</summary>' + m.qa.filter(function (g) { return g.items.length; }).map(function (g) {
      return '<h3>' + esc(g.head) + '</h3><div class="qalist">' + g.items.map(function (i) { return '<div class="qarow"><span>' + (i.title ? '<small>' + esc(i.title) + '</small>' : '') + esc(i.text) + (i.weight ? '<small>' + esc(i.weight) + (i.owner ? ' · Who answers: ' + esc(i.owner) : '') + '</small>' : '') + '</span><span class="ans">' + esc(i.answer) + '</span></div>'; }).join('') + '</div>';
    }).join('') + '</details>';
    h += '<details class="panel fold" id="method"><summary>How this was worked out</summary><ul class="plain">' + m.method.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></details>';
    h += '<section class="panel" aria-labelledby="score-h" id="score"><h2 id="score-h">Readiness score</h2><p class="score" id="score-val">' + esc(res.score) + '%</p><p class="meta">' + esc(m.scoreSub) + '</p></section>';
    h += '<p class="disc" id="disclaimer">' + esc(m.disclaimer) + '</p>';
    h += gloss([m.useTitle].concat(m.top3.map(function (a) { return a.text; }), m.vendor, [].concat.apply([], m.people.map(function (p) { return p.items; })), [].concat.apply([], m.qa.map(function (g) { return g.items.map(function (i) { return i.text; }); }))));
    return h + nav('Back', '', '<button type="button" class="btn" data-act="new">Start a new check</button>');
  }
  var VIEWS = { start: vStart, hotel: vHotel, s2: vS2, stop: vStop, must: vMust, where: vWhere, use: vUse, result: vResult };

  function render() {
    if (!ready) return;
    var st = rec.step;
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
  function go(step) { rec.step = step; rec.step = S.place(D, rec); ui.warned = ''; ui.copy = null; ui.mark = ''; ui.toTop = true; save(); render(); }
  function cardOf(openId) { return 'card-' + uid(openId); }
  function markFirstOpen(step) {
    var o = S.open(D, rec, step); if (!o.length) return;
    ui.mark = o[0]; render();
    var c = $(cardOf(o[0])); if (c) { c.scrollIntoView({ block: 'center' }); var inp = c.querySelector('input'); if (inp) inp.focus({ preventScroll: true }); }
  }

  /* ---------- events (also the test API) ---------- */
  function send(ev, arg) {
    ui.events.push(ev);
    switch (ev) {
      case 'begin': go('hotel'); break;
      case 'resume': go(rec.step === 'start' ? 'hotel' : rec.step); break;
      case 'next': {
        var st = rec.step;
        if ((st === 's2' || st === 'must' || st === 'use') && S.open(D, rec, st).length && ui.warned !== st) { ui.warned = st; render(); var n = $('open-note'); if (n) n.scrollIntoView({ block: 'center' }); return; }
        if (st === 'where' && !rec.use) rec.use = 'none';
        go(S.next(D, rec)); break;
      }
      case 'back': go(S.back(D, rec)); break;
      case 'change': go('s2'); break;
      case 'continue': rec.cont = S.stopKey(D, rec); go('must'); break;
      case 'goto': go(arg); break;
      case 'hotel': rec.hotel[arg.k] = String(arg.v || '').slice(0, 120); save(); break;
      case 'answer': {
        var k = arg.kind, id = arg.id, v = arg.value;
        if (k === 's2') rec.step2[id] = v;
        else if (k === 'mh') rec.mh[id] = v;
        else if (k === 'q') rec.qa[id] = v;
        else if (k === 'gate') { var gk = S.gateKey(rec); rec.gates[gk] = Object.assign({}, rec.gates[gk] || {}); rec.gates[gk][id] = v; }
        if (ui.mark && S.open(D, rec, rec.step).indexOf(ui.mark) < 0) ui.mark = '';
        save(); render(); break;
      }
      case 'use': rec.use = arg; if (arg !== 'none') { var u = S.useOf(D, arg); if (u) ui.dept = u.department; } save(); render(); break;
      case 'dept': ui.dept = arg; render(); break;
      case 'new': newCheck(); break;
      default: break;
    }
  }
  function newCheck() {
    var h = rec.hotel;
    flush();
    rec = S.blank(); rec.hotel = { name: h.name, type: h.type, role: h.role, country: h.country };
    idx.cur = rec.id; ui.dept = ''; go('hotel');
  }
  function askNew() {
    if (!S.hasAnswers(rec)) { newCheck(); return; }
    var d = $('confirm');
    d.innerHTML = '<h2 id="confirm-title">Start a new check?</h2><p>' + (ST.kind === 'memory' ? 'Your answers can\'t be saved in this browser. Save this check as a file first, or it will be lost.' : 'This check stays under Your checks in this browser.') + ' The hotel details carry over.</p>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="new-yes">Start a new check</button><button type="button" class="btn" data-act="new-no">Cancel</button></div>';
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    var b = d.querySelector('[data-act="new-yes"]'); if (b) b.focus();
  }
  function closeConfirm() { var d = $('confirm'); if (d.open) { if (typeof d.close === 'function') d.close(); else d.removeAttribute('open'); } }

  /* ---------- copy, downloads, files ---------- */
  function copyText(text, done) {
    var ok = false;
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(function () { toast(done || 'Copied.'); }, function () { showCopy('Copying was blocked here. Select the text below and copy it.', 'Text to copy', text); }); return; } } catch (e) {}
    if (!ok) showCopy('Select the text below and copy it.', 'Text to copy', text);
  }
  function showCopy(msg, label, text) { ui.copy = { msg: msg, label: label, text: text }; render(); var t = $('copy-text'); if (t) { t.focus(); t.select(); } }
  var dlP = null;
  function downloads() {
    if (!dlP) dlP = new Promise(function (res) {
      try { var c = window.claude; if (!c || typeof c.use !== 'function') { res(null); return; } Promise.resolve(c.use('downloads')).then(function (d) { res(d || null); }, function () { res(null); }); } catch (e) { res(null); }
    });
    return dlP;
  }
  function slug(s) { s = String(s || ''); if (s.normalize) s = s.normalize('NFKD').replace(/[̀-ͯ]/g, ''); return s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60); }
  function fileBase() { return 'Do-you-need-AI_' + (slug(rec.hotel.name) || 'check') + '_' + today(); }
  function offer(filename, data, fallback) {
    return downloads().then(function (dl) {
      if (!dl || typeof dl.save !== 'function') { fallback(T.noDl); return 'fallback'; }
      return Promise.resolve(dl.save({ filename: filename, data: data })).then(function () { toast('Saved ' + filename); return 'saved'; }, function (e) {
        var code = e && e.code;
        if (code === 'declined') { toast('Download cancelled.'); return 'declined'; }
        if (code === 'rate_limited') { toast('A download is already waiting for your answer.'); return 'busy'; }
        fallback(T.noDl); return 'fallback';
      });
    });
  }
  function fileDoc() { return S.fileDoc(rec); }
  function saveFile() {
    flush();
    var text = JSON.stringify(fileDoc(), null, 1);
    return offer(fileBase() + '.json', text, function (msg) { showCopy(msg + ' Copy saved check: keep this text, and paste it under Open a saved file to continue later.', 'Saved check', text); });
  }
  function pdfBytes() {
    if (!window.R3Pdf || !window.jspdf) throw new Error('no PDF library');
    return window.R3Pdf.draw(window.R3Pdf.blocks(model()), window.jspdf, FONT).doc.output('arraybuffer');
  }
  function downloadPdf() {
    var m = model(), bytes;
    try { bytes = pdfBytes(); } catch (e) { showCopy(T.pdfFail, 'The plan as text', RES.planText(m)); return Promise.resolve('failed'); }
    return offer(fileBase() + '.pdf', bytes, function (msg) { showCopy(msg, 'The plan as text', RES.planText(m)); });
  }
  function openText(text) {
    var doc = null; try { doc = JSON.parse(text); } catch (e) { doc = null; }
    var r = doc && S.readFile(D, MIG || {}, doc);
    if (!r) { ui.fileErr = T.badFile; render(); return false; }
    ui.fileErr = '';
    flush();
    rec = r.rec; idx.cur = rec.id;
    if (r.info.v3) rec.step = S.place(D, rec);
    ui.toTop = true; save(); render(); toast('Opened the saved check.');
    return true;
  }

  /* ---------- wiring ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.getAttribute('data-act'), id = t.getAttribute('data-id');
    switch (act) {
      case 'begin': case 'resume': case 'next': case 'back': case 'change': case 'continue': send(act); break;
      case 'new': askNew(); break;
      case 'new-yes': closeConfirm(); newCheck(); break;
      case 'new-no': closeConfirm(); var nb = $('new-check'); if (nb) nb.focus(); break;
      case 'why': ui.why[id] = !ui.why[id]; ui.focus = t.id || null; t.setAttribute('aria-expanded', String(!!ui.why[id])); var w = $('why-' + uid(id)); if (w) w.hidden = !ui.why[id]; break;
      case 'first-open': markFirstOpen(rec.step); break;
      case 'goto-mh': ui.mark = id; rec.step = 'must'; ui.warned = ''; ui.copy = null; save(); render(); var c = $('card-' + id); if (c) { c.scrollIntoView({ block: 'center' }); var inp = c.querySelector('input:checked') || c.querySelector('input'); if (inp) inp.focus({ preventScroll: true }); } break;
      case 'goto-where': send('goto', 'where'); break;
      case 'imported-ok': if (rec.imported) { rec.imported.seen = true; save(); render(); } break;
      case 'copy': copyText(RES.summaryText(model()), 'Copied the result.'); break;
      case 'copy-person': copyText(RES.personText(model(), id), 'Copied.'); break;
      case 'copy-box': var ta = $('copy-text'); if (ta) copyText(ta.value, 'Copied.'); break;
      case 'copy-close': ui.copy = null; render(); break;
      case 'pdf': downloadPdf(); break;
      case 'save-file': saveFile(); break;
      case 'paste-open': var p = $('paste-in'); if (p) openText(p.value); break;
      case 'open-check': loadRec(id).then(function (r) { if (!r) { toast('This check could not be opened.'); return; } flush(); rec = r; idx.cur = r.id; ui.toTop = true; save(); render(); }); break;
      case 'remove-check': idx.ids = idx.ids.filter(function (x) { return x !== id; }); ST.del(REC + id); if (id === rec.id) { rec = S.blank(); idx.cur = rec.id; } ST.set(KEY, JSON.stringify(idx)); render(); break;
    }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('input[type=radio][data-kind]')) {
      ui.focus = t.id;
      if (t.getAttribute('data-kind') === 'use') send('use', t.value);
      else send('answer', { kind: t.getAttribute('data-kind'), id: t.getAttribute('data-id'), value: t.value });
    } else if (t.id === 'dept') { ui.focus = 'dept'; send('dept', t.value); }
    else if (t.matches('[data-h]')) send('hotel', { k: t.getAttribute('data-h'), v: t.value });
    else if (t.id === 'file-in' && t.files && t.files[0]) {
      var fr = new FileReader(); fr.onload = function () { openText(String(fr.result)); }; fr.onerror = function () { ui.fileErr = T.badFile; render(); }; fr.readAsText(t.files[0]);
    }
  });
  document.addEventListener('input', function (e) { var t = e.target; if (t.matches('input[type=text][data-h]')) { rec.hotel[t.getAttribute('data-h')] = t.value.slice(0, 120); save(); } });
  $('confirm').addEventListener('cancel', function () { setTimeout(function () { var nb = $('new-check'); if (nb) nb.focus(); }, 0); });
  window.addEventListener('beforeprint', function () { document.querySelectorAll('details.fold').forEach(function (d) { d.setAttribute('data-was', d.open ? '1' : ''); d.open = true; }); });
  window.addEventListener('afterprint', function () { document.querySelectorAll('details.fold').forEach(function (d) { d.open = d.getAttribute('data-was') === '1'; }); });

  /* ---------- start ---------- */
  function boot() {
    return ST.init().then(function () { return ST.get(KEY); }).then(function (t) {
      var I = null; try { I = t ? JSON.parse(t) : null; } catch (e) { I = null; }
      if (I && Array.isArray(I.ids)) { idx = { v: 1, cur: String(I.cur || ''), ids: I.ids.filter(function (x) { return typeof x === 'string'; }) }; return idx.cur ? loadRec(idx.cur) : null; }
      /* first visit: checks of the earlier version in this browser are imported once (never written back) */
      var old = null; try { old = JSON.parse(localStorage.getItem(OLD_KEY) || 'null'); } catch (e) { old = null; }
      var list = old && MIG ? S.fromV2Store(D, MIG, old) : [];
      if (!list.length) return null;
      return Promise.all(list.map(function (x) { idx.ids.push(x.rec.id); return ST.set(REC + x.rec.id, JSON.stringify(x.rec)); })).then(function () { idx.cur = list[0].rec.id; return list[0].rec; });
    }).then(function (r) {
      if (r) { rec = r; rec.step = S.place(D, rec); } else { idx.cur = rec.id; }
      ready = true; render();
    });
  }
  window.Readiness3 = {
    ready: function () { return ready; },
    state: function () { var a = A(); return { step: rec.step, storage: ST.kind, use: rec.use, gates: R.askedGates(D, a.use).map(function (g) { return g.id; }), visible: R.visible(D, a.use, a.gates).map(function (q) { return q.id; }), open: S.open(D, rec, rec.step), imported: rec.imported, verdict: rec.step === 'result' || rec.step === 'stop' ? model().verdict : null }; },
    record: function () { return JSON.parse(JSON.stringify(rec)); },
    model: model, send: send, fileDoc: fileDoc, openText: openText, flush: flush,
    summaryText: function () { return RES.summaryText(model()); }, planText: function () { return RES.planText(model()); },
    pdfModel: function () { return window.R3Pdf ? window.R3Pdf.blocks(model()) : null; }, pdfBytes: pdfBytes, downloadPdf: downloadPdf, saveFile: saveFile
  };
  boot();
})();
