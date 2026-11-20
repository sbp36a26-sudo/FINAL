/* AI readiness check v4: the client-facing guided flow.
   Journey: start (who fills it in, privacy, hotel, tool, stage) → what you will need (preparation list by person)
   → must-haves (step 1) → the six areas without them (steps 2–7; an area with no question left is skipped) → result (verdict, action plan by person, vendor questions, legal flag, owner note) → come back:
   "since last time" and a re-check of open items only. History lives in this browser and in a file the hotel keeps. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var D = JSON.parse($('d-data').textContent), L = window.RCLogic, S = window.RCStore;
  var M = L.model(D);
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var COUNTRIES = ['Austria', 'Belgium', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Other'];
  /* v4 (F33): the seven EU member states that were missing. 'Other' keeps its stored value; only its label changed. */
  COUNTRIES = COUNTRIES.slice(0, -3).concat(['Bulgaria', 'Estonia', 'Latvia', 'Lithuania', 'Romania', 'Slovakia', 'Slovenia']).sort().concat(['Switzerland', 'United Kingdom', 'Other']);
  var COUNTRY_LABEL = { Other: 'Other (outside the EU)' };
  /* Sharing with the project team (opt-in). One switch: set to false to switch sharing off (withdrawing a copy still works). */
  var SHARING_ON = true;
  var SHARE_LINE = 'Student prototype: a shared copy goes to the project team (EHL SBP Group 36). A deletion date and a contact address are not set yet; you can withdraw your copy at any time ';
  var TYPES = [['independent', 'Independent hotel'], ['group', 'Part of a group, run by the group'], ['managed', 'Managed or franchised']];
  var ROLES = [['gm', 'General manager'], ['owner', 'Owner or asset manager'], ['dept', 'Head of a department'], ['it', 'IT or CIO'], ['fin', 'Finance'], ['other', 'Other']];
  var NEXT = [['vendor', 'When the vendor has replied'], ['sign', 'Before signing'], ['trial', 'At the end of the trial'], ['budget', 'At budget time'], ['other', 'Another moment']];
  var MY = 'hftp-readiness-mychecks-v1', CUR = 'hftp-readiness-current-v1';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtDate(iso) { if (!iso) return ''; var d = new Date(iso); return isNaN(d) ? '' : d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  function opt(v, l, cur) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>'; }
  function pct(v) { return v == null ? '–' : Math.round(v * 100) + '%'; }
  function typeName(x) { return x.arch ? M.ARCH[x.arch].s : 'Other'; }
  function lget(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function lset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function newId() { return 'rc' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function plural(n, a, b) { return n + ' ' + (n === 1 ? a : (b || a + 's')); }

  /* State, in two parts (machines and tables in src/flow.js, inventory in CLEANUP.md):
     st  = the check record (persisted in MY and in files): st.step is the FLOW state.
     ui  = what is happening on screen now (never persisted):
           confirm  CONFIRM machine (null | {kind:'new'|'rm'|'file', id})
           share    null when settled, else {phase:'sending'|'withdrawing', id} (SHARE machine; settled state comes from st.sharedAt)
           choosing true while the hotel is choosing another tool (the chosen one is kept until it picks)
           pdf      true while a PDF is being made
           file     a check read from a file, waiting for the 'file' confirmation
           missing  true after "Next" was pressed on the start screen with something missing (the missing items are outlined)
           mustMissing true after "Next" was pressed on the must-haves step with a must-have unanswered (the first one is outlined)
           open     which collapsed rows of the result are open (kept across re-renders)
           touched  note fields the person has left (the hint turns red only then)
           review   the update screen's list as it was on entry, so answered questions stay in place with "Undo" */
  var F = window.RCFlow;
  function known(u) { return !!M.UI[u]; }
  function blank() { return { id: newId(), rv: F.RV, step: 'start', hotel: { name: '', role: '', type: '', country: '' }, stage: '', useId: '', A: {}, P: {}, Who: {}, owner: { ask: '', cost: '', by: '' }, next: { when: '', date: '' }, snaps: [], share: { on: false, named: false }, sharedAt: null, sharedSig: null, sharedMode: null, created: new Date().toISOString(), q: '', dept: '' }; }
  /* A saved record, validated and migrated (F.migrate), as a working check; null if it cannot be opened. */
  function fromRecord(r) { var m = F.migrate(r, known); if (!m) return null; m = Object.assign(blank(), m); m.step = placeOf(m, m.step); return m; }
  /* Question steps (must-haves first, src/flow.js) for a check: which steps are in use, and is a must-have unanswered? */
  function stepCtx(r) {
    var x = M.UI[r.useId]; if (!x) return { tool: false, steps: [], mustOpen: false };
    var qs = L.selectQuestions(M, x, r.hotel);
    return { tool: true, steps: F.questionSteps(qs, L.AK), mustOpen: !!F.firstOpenMust(qs, function (q) { return L.hasAnswer(q, r.A, r.P); }) };
  }
  /* Where a restored check (storage, file, history) reopens: an area step at the same area; any unanswered must-have → 'must'. */
  function placeOf(r, step) { return F.placeStep(step, stepCtx(r)); }
  var mine = lget(MY, {}); if (!mine || typeof mine !== 'object' || Array.isArray(mine)) mine = {};
  /* Records that cannot be opened by this build (tool no longer in the catalogue, damaged) stay in storage untouched. */
  function openable(k) { var r = mine[k]; return !!(r && r.id === k && F.migrate(r, known) && M.UI[r.useId]); }
  var ui = { confirm: null, share: null, choosing: false, pdf: false, file: null, missing: false, mustMissing: false, open: {}, touched: {}, review: null, more: false };
  var st = (openable(lget(CUR, '')) && fromRecord(mine[lget(CUR, '')])) || blank();
  /* Shared hotel profile (key hftp-hotel-profile-v1), also used by the AI Register in this browser. */
  var PROFILE = 'hftp-hotel-profile-v1';
  var CC = { AT: 'Austria', BE: 'Belgium', HR: 'Croatia', CY: 'Cyprus', CZ: 'Czechia', DK: 'Denmark', FI: 'Finland', FR: 'France', DE: 'Germany', GR: 'Greece', HU: 'Hungary', IE: 'Ireland', IT: 'Italy', LU: 'Luxembourg', MT: 'Malta', NL: 'Netherlands', PL: 'Poland', PT: 'Portugal', ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', GB: 'United Kingdom', BG: 'Bulgaria', EE: 'Estonia', LV: 'Latvia', LT: 'Lithuania', RO: 'Romania', SK: 'Slovakia', SI: 'Slovenia' };
  function readProfile() { return lget(PROFILE, null); }
  function adoptProfile() {
    var p = readProfile(), H = st.hotel; if (!p) return;
    if (!H.name && p.name) H.name = p.name;
    if (!H.country && p.country) H.country = CC[p.country] || 'Other';
    if (!H.type && p.type) H.type = p.type;
  }
  function writeProfile() {
    var p = readProfile() || {}, H = st.hotel, code = '';
    Object.keys(CC).forEach(function (k) { if (CC[k] === H.country) code = k; });
    if (H.name) p.name = H.name; if (code) p.country = code; if (H.type) p.type = H.type;
    p.updatedAt = new Date().toISOString(); p.from = 'readiness';
    lset(PROFILE, p);
  }
  function keep() {
    st.updated = new Date().toISOString();
    if (st.useId) { var r = Object.assign({}, st); delete r.q; delete r.dept; mine[st.id] = r; lset(MY, mine); }
    if (st.hotel.name || st.hotel.country || st.hotel.type) writeProfile();
    lset(CUR, st.useId ? st.id : '');
  }
  function ev() { return L.evaluate(M, M.UI[st.useId], st.hotel, st.A, st.P, st.Who, st.stage); }

  var toastT;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 4200); }
  function lvName(level, stage) { return L.levelName(level, stage); }
  function chipFor(level, stage) { var lv = L.LEVELS[level] || L.LEVELS.open; return '<span class="chip c-' + lv.chip + '">' + esc(lvName(level, stage)) + '</span>'; }
  function row(id, title, body, extra) { return '<details class="panel fold" data-row="' + id + '"' + (extra || '') + (ui.open[id] ? ' open' : '') + '><summary><span>' + title + '</span></summary><div class="foldbody">' + body + '</div></details>'; }

  // ---------- header (one line after the start screen) ----------
  function listed() { return Object.keys(mine).filter(function (k) { var r = mine[k]; return openable(k) && ((r.snaps && r.snaps.length) || Object.keys(r.A || {}).length); }).sort(function (a, b) { return String(mine[b].updated).localeCompare(String(mine[a].updated)); }); }
  function header() {
    var n = listed().length, x = M.UI[st.useId];
    var link = n ? '<button type="button" class="linkbtn" data-act="home" id="home">Your checks (' + n + ')</button>' : '';
    if (st.step === 'start') {
      return '<div class="hdrtop"><p class="meta">A student project by EHL for HFTP · prototype</p>' + link + '</div><h1>AI readiness check</h1>' +
        '<p class="sub"><strong>Is your hotel ready to adopt this AI tool?</strong> Not about how AI assistants find your hotel.</p>' +
        '<p class="sub">One AI tool at a time. You get a verdict and a to-do list by person.</p>';
    }
    var where = st.step === 'prep' ? 'What you will need' : st.step === 'review' ? 'Update open items' : st.step === 'result' ? 'Result' : stepLabel(st.step);
    return '<div class="hdrtop"><p class="hdrline"><strong>AI readiness check</strong> · ' + esc(x ? L.shortName(x) : '') + ' · ' + where + '</p>' + link + '</div>';
  }

  // ---------- start ----------
  function myList() {
    var ids = listed();
    if (!ids.length) return '';
    var h = '<section class="panel" id="mychecks" tabindex="-1"><h2>Your checks in this browser</h2><p class="sub">Pick one up where you left it. "Update open items" shows only what is still open.</p><div>';
    ids.forEach(function (k) {
      var r = F.migrate(mine[k], known), x = M.UI[r.useId], e = L.evaluate(M, x, r.hotel, r.A, r.P, r.Who, r.stage), cRm = ui.confirm && ui.confirm.kind === 'rm' && ui.confirm.id === k;
      h += '<div class="mycheck"><div class="g1"><strong>' + esc(x.name) + '</strong><span class="meta">' + esc([r.hotel.name, L.STAGES[r.stage] && L.STAGES[r.stage].name, 'last changed ' + fmtDate(r.updated)].filter(Boolean).join(' · ')) + '</span>' +
        '<span class="btnrow">' + chipFor(e.level, r.stage) + '<span class="meta">' + e.counts.met + ' of ' + e.counts.gates + ' must-haves done · ' + plural(e.actions.length, 'open item') + '</span></span>' +
        (r.next && r.next.when ? '<span class="meta">Planned next look: ' + esc(nextText(r.next)) + '</span>' : '') + '</div>' +
        '<div class="btnrow"><button type="button" class="btn" data-act="open-review" data-id="' + k + '">Update open items</button><button type="button" class="btn" data-act="open-result" data-id="' + k + '">See result</button>' +
        (cRm ? '<button type="button" class="btn warn" data-act="rm-yes" data-id="' + k + '" id="rm-yes">Remove for good</button><button type="button" class="btn" data-act="rm-no" id="rm-no">Keep</button>' : '<button type="button" class="linkbtn" data-act="rm" data-id="' + k + '">Remove</button>') + '</div>' +
        (cRm ? '<p class="meta" data-confirm="rm">Remove this check from this browser? Files you saved are not affected.' + (r.sharedAt ? ' It was shared with the project team: that copy stays until you withdraw it from the result page (See result).' : '') + '</p>' : '') + '</div>';
    });
    return h + '</div></section>';
  }
  function fileConfirm() {
    if (!(ui.confirm && ui.confirm.kind === 'file' && ui.file)) return '';
    var cur = mine[ui.file.id];
    return '<section class="panel banner" data-confirm="file"><h3>This browser has a newer copy of this check</h3><p>The file was last changed ' + esc(fmtDate(ui.file.updated) || 'on an unknown date') + '; the copy in this browser ' + esc(fmtDate(cur && cur.updated)) + '. Opening the file replaces the newer copy.</p>' +
      '<div class="btnrow"><button type="button" class="btn warn" data-act="file-yes" id="file-yes">Open the file anyway</button><button type="button" class="btn" data-act="file-no" id="file-no">Keep the copy in this browser</button></div></section>';
  }
  function nextText(n) { var w = NEXT.filter(function (o) { return o[0] === n.when; })[0]; return (w ? w[1] : n.when) + (n.date ? ', ' + fmtDate(n.date) : ''); }

  /* What the start screen still needs before "Next" can go on (in screen order). */
  function missing() {
    var m = [];
    if (!st.hotel.type) m.push({ k: 'type', t: 'how the hotel is run', focus: 'h-type', box: 'box-type' });
    if (!M.UI[st.useId] || ui.choosing) m.push({ k: 'tool', t: 'a tool', focus: 'q', box: 'box-tool' });
    if (!st.stage) m.push({ k: 'stage', t: 'where you are with it', focus: 'stage-explore', box: 'box-stage' });
    return m;
  }
  function need(k) { return ui.missing && missing().some(function (m) { return m.k === k; }); }
  function needLine(k) { return need(k) ? '<p class="needline" role="alert">Choose one to continue</p>' : ''; }
  function nameWarn() {
    var n = String(st.hotel.name || '').trim(); if (!n) return '';
    var safe = pdfSafe(n).trim(), plain = n.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-');
    if (safe === plain) return '';
    return safe ? 'The PDF report cannot print some characters of this name. There it will read: ' + safe + '.' : 'The PDF report cannot print the characters of this name: it will be left out there. A name in Latin letters will print.';
  }

  function vStart() {
    var H = st.hotel, x = M.UI[st.useId], q = st.q || '';
    var h = fileConfirm() + myList();
    h += '<section class="panel"><h2>1. About your hotel</h2><div class="formgrid">' +
      '<label class="fld' + (need('type') ? ' missing' : '') + '" id="box-type"><span>How the hotel is run</span><select id="h-type" data-h="type">' + opt('', 'Choose', H.type) + TYPES.map(function (t) { return opt(t[0], t[1], H.type); }).join('') + '</select>' + needLine('type') + '<span class="meta">This only adds the owner-approval question for managed hotels.</span></label>' +
      '<label class="fld"><span>Hotel name (optional)</span><input type="text" id="h-name" data-h="name" value="' + esc(H.name) + '" autocomplete="organization"><span class="meta">Only for your own report.</span><span class="meta" id="name-warn" role="status">' + esc(nameWarn()) + '</span></label>' +
      '<label class="fld"><span>Your role (optional)</span><select id="h-role" data-h="role">' + opt('', 'Choose', H.role) + ROLES.map(function (t) { return opt(t[0], t[1], H.role); }).join('') + '</select></label>' +
      '<label class="fld"><span>Country (optional)</span><select id="h-country" data-h="country">' + opt('', 'Choose', H.country) + COUNTRIES.map(function (c) { return opt(c, COUNTRY_LABEL[c] || c, H.country); }).join('') + '</select></label>' +
      '</div></section>';
    h += '<section class="panel' + (need('tool') ? ' missing' : '') + '" id="box-tool"><h2>2. Which AI tool?</h2>' + needLine('tool');
    if (x && !ui.choosing) {
      h += '<div class="panel picked" id="picked" tabindex="-1"><p class="meta">Selected</p><h3>' + esc(x.name) + '</h3><p class="meta">' + esc(x.deptName) + ' · ' + esc(typeName(x)) + ' tool · ' + esc(x.int) + ' effort</p><p>' + esc(x.task) + '</p>' +
        '<div><button type="button" class="linkbtn" data-act="unpick">Choose another tool</button></div></div>';
    } else {
      if (x) h += '<p class="meta">Now chosen: <b>' + esc(x.name) + '</b>.' + (Object.keys(st.A).length ? ' Picking another tool starts a new check; this one stays in “Your checks”.' : '') + ' <button type="button" class="linkbtn" data-act="keep-tool">Keep this tool</button></p>';
      h += '<div class="formgrid"><label class="fld"><span>Search</span><input type="search" id="q" value="' + esc(st.q) + '" placeholder="For example chatbot, pricing, rota, phone"></label>' +
        '<label class="fld"><span>Department</span><select id="dept">' + opt('', 'All departments', st.dept) + D.cat.depts.map(function (d) { return opt(d.id, d.name, st.dept); }).join('') + '</select></label></div>' +
        '<p class="meta" id="pickcount" role="status">' + esc(pickCount(q)) + '</p>' + whyTools() + '<div class="list" id="picklist">' + pickList(q) + '</div>';
    }
    h += '</section>';
    h += '<section class="panel' + (need('stage') ? ' missing' : '') + '" id="box-stage"><h2>3. Where are you with this tool?</h2>' + needLine('stage') + '<div class="opts stack" role="radiogroup" aria-label="Stage">' +
      Object.keys(L.STAGES).map(function (k) { return '<label class="opt' + (st.stage === k ? ' on' : '') + '"><input type="radio" name="stage" id="stage-' + k + '" value="' + k + '" data-stage="1"' + (st.stage === k ? ' checked' : '') + '>' + esc(L.STAGES[k].long) + '</label>'; }).join('') + '</div>' +
      '<p class="meta">We use this to tell you which questions can wait until you have a vendor.</p></section>';
    h += notice();
    var miss = missing();
    h += '<div class="btnrow"><button type="button" class="btn primary" data-act="prep" id="go-prep">Next: what you will need</button><span class="meta" id="go-hint" role="status">' + esc(startHint(miss)) + '</span>' +
      '<span class="spacer"></span><label class="btn" for="loadfile">Open a saved file</label><input type="file" id="loadfile" accept=".json,application/json" class="sr"></div>';
    return h;
  }
  function startHint(miss) { return miss.length ? 'Still needed: ' + miss.map(function (m) { return m.t; }).join(' · ') : ''; }
  function found(q) { return L.search(M, q, st.dept); }
  /* Why these tools: where the list comes from (owner request, 20 Nov 2026). Counts are computed, not typed. */
  function whyTools() {
    var n = M.USES.length, ex = M.EXCL, total = n + ex.length;
    return '<details class="why-tools"><summary>Why these ' + n + ' tools? <span class="why-hint">Where the list comes from, and what to do if your tool is not in it</span></summary>' +
      '<p>The list is the project\'s AI use-case catalogue (the Use-Case Catalogue tab): ' + total + ' ways hotels use AI today, across ' + M.DEPTS + ' hotel departments from revenue management to housekeeping. Each entry rests on published evidence the team opened and checked: vendor product pages, hotel-group announcements, trade press and surveys.</p>' +
      (ex.length ? '<p>' + (ex.length === 1 ? 'One entry is' : ex.length + ' entries are') + ' left out because ' + (ex.length === 1 ? 'it is' : 'they are') + ' not an AI tool you buy: ' + esc(ex.join(', ')) + '.</p>' : '') +
      '<p>The list shows kinds of tool, not brands, and it is not a ranking. \u201cHow common\u201d comes from the catalogue; where no survey exists it is the team\'s estimate.</p>' +
      '<p>Your tool is not listed? Choose the closest kind. The questions depend on what the tool does (for example whether it talks to guests, uses staff data or acts on its own), not on the brand.</p></details>';
  }
  function pickCount(q) { var all = M.USES.length, n = found(q).length; return String(q || '').trim() || st.dept ? all + ' tools · ' + n + (n === 1 ? ' matches' : ' match') : all + ' tools'; }
  function pickList(q) {
    return found(q).map(function (u) { return '<button type="button" class="pick" data-act="pick" data-id="' + u.id + '"><span class="pn">' + esc(u.name) + '</span><span class="meta">' + esc(u.int) + ' effort</span><span class="meta">' + esc(u.deptName) + ' · ' + esc(typeName(u)) + ' tool</span></button>'; }).join('') ||
      '<p class="meta" style="padding:12px 4px">Nothing matches. Try a shorter word, or pick a department.</p>';
  }
  function notice() {
    return '<section class="panel notice"><h3>Your data</h3><p>Your answers stay in this browser. Nothing is sent unless you choose “Share with the project team” on the result page; that panel lists what is sent. Use roles, not people\'s names, in your answers.</p>' +
      (SHARING_ON ? '<p>' + esc(SHARE_LINE) + 'on the result page.</p>' : '') +
      '<p>This page loads its fonts from Google and, for the PDF, may load a library from cdnjs. Both then see your IP address.</p></section>';
  }

  // ---------- preparation ----------
  function byWho(qs) { var g = {}; qs.forEach(function (q) { var w = st.Who[q.code] || L.defaultWho(q, st.stage); (g[w] = g[w] || []).push(q); }); return g; }
  var REPLY = 'Please reply to each line. For a must-have, add one line saying where it is written down (a date, a document or a role).';
  function prepText(who, qs) {
    var x = M.UI[st.useId];
    return 'AI readiness check: ' + x.name + (st.hotel.name ? ' (' + st.hotel.name + ')' : '') + '\nQuestions for: ' + L.WHO[who] + '\n\n' + qs.map(function (q) {
      return '- ' + (q.list ? q.q + ': ' + q.items.join('; ') : q.q) + (q.gate ? ' [must-have]' + (q.yes ? ' What counts as Yes: ' + q.yes : '') : '');
    }).join('\n') + '\n\n' + REPLY;
  }
  function vPrep() {
    var x = M.UI[st.useId], qs = L.selectQuestions(M, x, st.hotel), gates = qs.filter(function (q) { return q.gate; }), g = byWho(qs);
    var isEarly = st.stage === 'explore' || st.stage === 'choose', whos = Object.keys(L.WHO).filter(function (w) { return g[w]; });
    var h = '<div class="prog"><div class="bar"><i style="width:4%"></i></div></div>';
    h += '<section class="panel"><h2>What you will need</h2><p class="sub"><b>' + qs.length + ' questions, ' + gates.length + ' of them must-haves.</b> You will probably need to ask colleagues or the vendor.</p>' +
      '<p class="sub">The check starts with the must-haves, because one must-have at No means “Not ready yet”. Then come the areas, without the must-haves. Weak areas can also hold the verdict back.</p>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="begin" id="begin-top">Start now</button><button type="button" class="btn" data-act="back">Back</button></div></section>';
    h += '<section class="panel"><h3>Who to ask</h3><p class="sub">You will probably need: ' + esc(whos.map(function (w) { return L.WHO[w] + ' (' + g[w].length + ')'; }).join(', ')) + '. Copy each person\'s questions and send them now.</p><div class="wholist">' + whos.map(function (w) {
      var m = g[w].filter(function (q) { return q.gate; }).length;
      return '<div class="whorow"><details class="inner"><summary><span><b>' + esc(L.WHO[w]) + '</b> <span class="meta">' + plural(g[w].length, 'question') + (m ? ', ' + plural(m, 'must-have') : '') + ' · show</span></span></summary><ul class="tight">' + g[w].map(function (q) { return '<li>' + esc(q.list ? q.q + ': ' + q.items.join('; ') : q.q) + (q.gate ? ' <span class="musttag">Must-have</span>' : '') + '</li>'; }).join('') + '</ul></details>' +
        '<button type="button" class="btn small" data-act="copy-prep" data-who="' + w + '">Copy questions</button></div>';
    }).join('') + '</div></section>';
    h += '<details class="panel fold"><summary><span>The ' + gates.length + ' must-haves, and what counts as Yes</span></summary><div class="foldbody">' + gates.map(function (q) {
      return '<div class="gap"><div class="g1"><span>' + esc(q.q) + '</span>' + (q.yes ? '<span class="meta">What counts as Yes: ' + esc(q.yes) + '</span>' : '') +
        '<span class="meta">Usually known by: ' + esc(L.WHO[q.who]) + (q.vendor && isEarly ? ' · Can only be confirmed once you have a vendor' : '') + '</span></div></div>';
    }).join('') + '</div></details>';
    h += '<details class="panel fold"><summary><span>This tool at a glance</span></summary><div class="foldbody"><dl class="kv"><dt>What it does</dt><dd>' + esc(x.task) + '</dd><dt>Type</dt><dd>' + esc(x.arch ? M.ARCH[x.arch].n : 'Other') + ' · ' + esc(x.int) + ' effort</dd>' +
      '<dt>Effort</dt><dd>Light (a subscription) · Moderate (links to your PMS or CRM, clean data) · Heavy (hardware, group platforms, agents acting across systems)</dd>' +
      (x.r.fi ? '<dt>Usually paid for</dt><dd>' + esc(L.paidFor(x)) + ' (team\'s D6 resource sheet, not a price quote)</dd>' : '') + (x.level ? '<dt>How common in hotels</dt><dd>' + esc(x.level) + ' (team\'s use-case catalogue)</dd>' : '') + '</dl></div></details>';
    h += '<div class="navrow"><button type="button" class="btn back" data-act="back">Back</button><button type="button" class="btn primary" data-act="begin">Start now</button></div>';
    return h;
  }

  // ---------- questions ----------
  function optsFor(q) {
    if (q.opts) return q.opts;
    var o = [['y', 'Yes'], ['p', 'Partly'], ['n', 'No'], ['k', "Don't know yet"]];
    if (q.none) o.push(['none', q.none]);
    else if (!q.noNa) o.push(['na', "Doesn't apply"]);
    return o;
  }
  function whoSel(code, def) {
    var cur = st.Who[code] || def;
    return '<label class="who"><span>Who can answer?</span><select data-who="' + code + '" id="who-' + code + '">' + Object.keys(L.WHO).map(function (w) { return opt(w, L.WHO[w], cur); }).join('') + '</select></label>';
  }
  /* The note for a must-have Yes (stored in st.P). Grey hint; red only once the person has left the field with too little. */
  function noteField(q, cur) {
    var ok = L.proofOk(st.P[q.code]), bad = !ok && ui.touched[q.code];
    var ask = (cur === 'none' ? q.noneAsk : q.ask) || '', ex = cur === 'none' ? 'Confirmed by our legal adviser by email on 5 Nov' : (q.ex || 'Revenue manager, 4 hours a week');
    return '<div class="proof"><label for="pf-' + q.code + '">Where is this written down? One line, for your own report.' + (ask ? ' ' + esc(ask) : '') + '</label>' +
      '<input type="text" id="pf-' + q.code + '" data-proof="' + q.code + '" value="' + esc(st.P[q.code] || '') + '" aria-describedby="nh-' + q.code + '">' +
      '<span class="notehint' + (bad ? ' bad' : '') + (ok ? ' ok' : '') + '" id="nh-' + q.code + '">' + (ok ? 'Note added.' : 'Add at least two words, for example: ' + esc(ex)) + '</span></div>';
  }
  /* opt.area: show a small tag naming the question's area (on the must-haves step and the update screen's must-haves).
     opt.need: this is the first unanswered must-have after a blocked "Next" (outlined, with a short line). */
  function qBlock(q, opt) {
    opt = opt || {};
    var isEarly = st.stage === 'explore' || st.stage === 'choose', h;
    if (q.list) {
      h = '<fieldset class="qa" id="fs-' + q.code + '"><legend><span class="qtext">' + esc(q.q) + '</span></legend><div class="items">';
      var anyK = false;
      q.items.forEach(function (t, i) {
        var k = q.code + '#' + i, cur = st.A[k] || ''; if (cur === 'k') anyK = true;
        h += '<div class="item"><span>' + esc(t) + '</span><div class="opts mini" role="radiogroup" aria-label="' + esc(t) + '">' + [['y', 'In place'], ['n', 'Not yet'], ['k', "Don't know"], ['na', "Doesn't apply"]].map(function (o) {
          return '<label class="opt' + (cur === o[0] ? ' on' : '') + '"><input type="radio" name="q-' + k + '" id="q-' + k.replace('#', '_') + '-' + o[0] + '" value="' + o[0] + '" data-q="' + k + '"' + (cur === o[0] ? ' checked' : '') + '>' + o[1] + '</label>';
        }).join('') + '</div></div>';
      });
      h += '</div>' + (anyK ? whoSel(q.code, q.who) : '') + '</fieldset>';
      return h;
    }
    var cur = st.A[q.code] || '', name = 'q-' + q.code, s = L.score(q, st.A, st.P);
    h = '<fieldset class="qa' + (q.gate ? ' must' : '') + (opt.need ? ' missing' : '') + '" id="fs-' + q.code + '"><legend>' + (q.gate ? '<span class="musttag">Must-have</span> ' : '') + (opt.area ? '<span class="areatag">' + esc(M.AREA[q.a].name) + '</span> ' : '') + '<span class="qtext">' + esc(q.q) + '</span></legend>' +
      (opt.need ? '<p class="needline" role="alert">Answer this to continue (“Don\'t know yet” is fine).</p>' : '') +
      (q.help ? '<p class="meta">' + esc(q.help) + '</p>' : '') +
      (q.gate && q.yes ? '<p class="yesline">What counts as Yes: ' + esc(q.yes) + '</p>' : '') +
      (s.stale ? '<p class="staleline" role="status">' + esc(L.STALE) + '</p>' : '') +
      '<div class="opts" role="radiogroup" aria-label="' + esc(q.q) + '">' + optsFor(q).map(function (o) { return '<label class="opt' + (cur === o[0] ? ' on' : '') + '"><input type="radio" name="' + name + '" id="' + name + '-' + o[0] + '" value="' + o[0] + '" data-q="' + q.code + '"' + (cur === o[0] ? ' checked' : '') + '>' + esc(o[1]) + '</label>'; }).join('') + '</div>';
    if (q.vendor && isEarly && !cur) h += '<p class="meta hint">No vendor yet? Choose “Don\'t know yet”: it goes on your list of questions for the vendor.</p>';
    if (cur === 'k') h += whoSel(q.code, L.defaultWho(q, st.stage));
    if (q.gate && (cur === 'y' || (cur === 'none' && q.none && q.noneNote))) h += noteField(q, cur);
    if (q.note) h += '<p class="meta">' + esc(q.note) + '</p>';
    return h + '</fieldset>';
  }
  function allQs() { return L.selectQuestions(M, M.UI[st.useId], st.hotel); }
  /* Must-haves first: the question steps in use for this check ('must', then area indexes 0..5 that still have questions). */
  function qSteps() { return F.questionSteps(allQs(), L.AK); }
  function stepQs(step) { return F.stepQuestions(allQs(), step, L.AK); }
  function stepLabel(step) { var n = qSteps(); return 'Step ' + F.stepNo(step, n) + ' of ' + n.length; }
  function firstOpenMust() { return F.firstOpenMust(allQs(), function (q) { return L.hasAnswer(q, st.A, st.P); }); }
  /* Step footer: one definition of "answered" (Yes, Partly, No or Doesn't apply), "Don't know" on its own, notes still missing. */
  function footText(qs) {
    var done = 0, k = 0, note = 0;
    qs.forEach(function (q) {
      var s = L.score(q, st.A, st.P);
      if (s.done) done++;
      else if (q.list ? q.items.some(function (_, i) { return st.A[q.code + '#' + i] === 'k'; }) : st.A[q.code] === 'k') k++;
      if (s.state === 'unconf') note++;
    });
    return [done + ' of ' + qs.length + ' answered', k ? k + ' to find out' : '', note ? note + (note === 1 ? ' Yes needs a note' : ' Yes answers need a note') : ''].filter(Boolean).join(' · ');
  }
  var MUST_INTRO = 'Start with the must-haves. These decide the verdict, so they come first. Every one needs an answer; if you do not know yet, choose “Don\'t know yet” and it goes on your list to find out.';
  /* A question step: 'must' (every must-have, with its area tag) or an area index (that area without its must-haves). */
  function vStep(step) {
    var steps = qSteps(), n = F.stepNo(step, steps), N = steps.length, qs = stepQs(step), isMust = step === 'must', last = n === N;
    var need = isMust && ui.mustMissing ? firstOpenMust() : null;
    var h = '<div class="prog"><div class="bar" role="img" aria-label="Step ' + n + ' of ' + N + '"><i style="width:' + Math.round(n / (N + 1) * 100) + '%"></i></div></div>';
    h += '<section class="panel"><div class="stephead"><h2>' + (isMust ? 'Must-haves' : esc(M.AREA[L.AK[step]].name)) + '</h2><p class="meta">' + (isMust ? esc(MUST_INTRO) : esc(M.AREA[L.AK[step]].one)) + '</p></div><div>' +
      qs.map(function (q) { return qBlock(q, { area: isMust, need: q.code === need }); }).join('') + '</div></section>';
    h += '<div class="navrow"><button type="button" class="btn back" data-act="back">Back</button><button type="button" class="btn primary" data-act="next" id="next">' + (last ? 'See my result' : 'Next') + '</button><span class="meta"><span id="stepfoot">' + esc(footText(qs)) + '</span>. ' + (isMust ? 'Every must-have needs an answer to go on.' : 'Anything left open goes on your “to find out” list.') + '</span></div>';
    return h;
  }
  /* "Next" on the must-haves step is always enabled. With a must-have unanswered it does not move on: it outlines the
     first one, says "Answer this to continue", scrolls to it and focuses its first answer (same pattern as the start screen). */
  function pointToMust() {
    var c = firstOpenMust(); if (!c) return false;
    ui.mustMissing = true; render();
    var box = $('fs-' + c), f = box && box.querySelector('input');
    try { if (box) box.scrollIntoView({ block: 'center' }); if (f) f.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    return true;
  }
  function isOpen(q) {
    var s = L.score(q, st.A, st.P);
    if (q.list) return q.items.some(function (_, i) { var v = st.A[q.code + '#' + i]; return !v || v === 'k' || v === 'n'; });
    return s.state === 'unknown' || s.state === 'gap' || s.state === 'unconf';
  }
  function openQs() { return ev().qs.filter(isOpen); }
  function snapAnswers(codes) {
    var o = { A: {}, P: {}, Who: {} };
    Object.keys(st.A).forEach(function (k) { if (codes.indexOf(k.split('#')[0]) >= 0) o.A[k] = st.A[k]; });
    codes.forEach(function (c) { if (st.P[c] != null) o.P[c] = st.P[c]; if (st.Who[c] != null) o.Who[c] = st.Who[c]; });
    return o;
  }
  /* The update screen keeps its list as it was on entry: an answered question stays in place, greyed, with "Undo". */
  function reviewList() {
    if (!ui.review || ui.review.id !== st.id) { var codes = openQs().map(function (q) { return q.code; }); ui.review = { id: st.id, codes: codes, was: snapAnswers(codes) }; }
    var by = {}; allQs().forEach(function (q) { by[q.code] = q; });
    return ui.review.codes.map(function (c) { return by[c]; }).filter(Boolean);
  }
  function undo(code) {
    if (!ui.review) return;
    var was = ui.review.was;
    Object.keys(st.A).forEach(function (k) { if (k.split('#')[0] === code) delete st.A[k]; });
    Object.keys(was.A).forEach(function (k) { if (k.split('#')[0] === code) st.A[k] = was.A[k]; });
    if (was.P[code] != null) st.P[code] = was.P[code]; else delete st.P[code];
    if (was.Who[code] != null) st.Who[code] = was.Who[code]; else delete st.Who[code];
  }
  function doneBlock(q) {
    var txt = q.list ? 'every item answered' : L.answerText(q, st.A[q.code]);
    return '<div class="qa donerow" id="fs-' + q.code + '"><p><span class="tick" aria-hidden="true">✓</span> <span class="qtext">' + esc(q.list ? q.q + ': ' + q.items.join('; ') : q.q) + '</span></p><p class="meta">Now: ' + esc(txt) + '. <button type="button" class="linkbtn" data-act="undo" data-code="' + q.code + '" id="undo-' + q.code + '">Undo</button></p></div>';
  }
  function vReview() {
    var e = ev(), list = reviewList(), must = list.filter(function (q) { return q.gate; }), rest = list.filter(function (q) { return !q.gate; });
    var n = must.filter(isOpen).length, m = rest.filter(isOpen).length;
    var h = '<div class="prog"><div class="bar"><i style="width:50%"></i></div></div>';
    h += '<section class="panel"><h2>' + (n ? plural(n, 'thing is', 'things are') + ' still holding the verdict back. ' : 'No must-have is open. ') + (m ? plural(m, 'smaller gap is', 'smaller gaps are') + ' below.' : '') + '</h2>' +
      '<p class="sub">' + plural(e.counts.open, 'open item') + ' in ' + plural(e.counts.openQs, 'question') + '. Change what has moved on since ' + esc(fmtDate(lastSnap() && lastSnap().at || st.updated)) + '; leave the rest.' + (e.low.length ? ' Weak on what you told us: ' + esc(L.joinAnd(e.low.map(function (r) { return r.name; }))) + '.' : '') + '</p>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="to-result">See updated result</button><button type="button" class="btn" data-act="edit">Go through all questions</button></div></section>';
    var blk = function (q) { return isOpen(q) ? qBlock(q, { area: q.gate }) : doneBlock(q); };
    if (must.length) h += '<section class="panel"><h3>Must-haves</h3><div>' + must.map(blk).join('') + '</div></section>';
    L.AK.forEach(function (a) { var g = rest.filter(function (q) { return q.a === a; }); if (g.length) h += '<section class="panel"><h3>' + esc(M.AREA[a].name) + ' <span class="meta">smaller gaps</span></h3><div>' + g.map(blk).join('') + '</div></section>'; });
    if (!list.length) h += '<section class="panel"><p>Nothing is open.</p></section>';
    else h += '<div class="navrow"><button type="button" class="btn" data-act="to-result">See updated result</button></div>';
    return h;
  }

  // ---------- result ----------
  function lastSnap() { return st.snaps && st.snaps[st.snaps.length - 1]; }
  function takeSnap() {
    var s = L.snapshot(ev(), new Date().toISOString()), last = lastSnap();
    var same = last && last.rules === s.rules && last.level === s.level && last.met === s.met && last.known === s.known && last.open === s.open && JSON.stringify(last.metCodes) === JSON.stringify(s.metCodes);
    if (!same) { st.snaps = (st.snaps || []).concat(s).slice(-20); }
    keep();
  }
  function snapLine(s) { return fmtDate(s.at) + ': ' + lvName(s.level, st.stage) + ', ' + s.met + ' of ' + s.gates + ' must-haves done, ' + s.open + ' open' + (s.rules !== L.RULES ? ' (worked out with earlier rules)' : ''); }
  /* The result before this one, if it was worked out with the same rules (else null: not compared). */
  function prevCompare() { var n = st.snaps || []; return n.length < 2 ? null : L.compare(n[n.length - 2], n[n.length - 1]); }
  function sinceBanner() {
    var n = st.snaps || []; if (n.length < 2) return '';
    var c = prevCompare(), earlier = n.length > 2 || !c ? '<details class="inner"><summary>Earlier results</summary><ul class="tight">' + n.slice(0, -1).reverse().map(function (s) { return '<li>' + esc(snapLine(s)) + '</li>'; }).join('') + '</ul></details>' : '';
    if (!c) return '<section class="panel banner"><p>Your result of ' + esc(fmtDate(n[n.length - 2].at)) + ' was worked out with earlier rules, so the two are not compared line by line. Your answers and notes are unchanged. What changed in the rules is listed under “How this result was worked out”.</p>' + earlier + '</section>';
    var bits = [];
    if (c.closed.length) bits.push(plural(c.closed.length, 'must-have') + ' now done');
    if (c.reopened.length) bits.push(plural(c.reopened.length, 'must-have') + ' no longer done');
    if (c.knownGain > 0) bits.push(plural(c.knownGain, 'more question') + ' answered');
    bits.push('open items ' + c.openBefore + ' → ' + c.openNow);
    return '<section class="panel banner"><h3>Since ' + esc(fmtDate(c.since)) + '</h3><p>' + esc(bits.join(' · ')) + '.' + (c.from !== c.to ? ' Verdict: ' + esc(lvName(c.from, st.stage)) + ' → <b>' + esc(lvName(c.to, st.stage)) + '</b>.' : '') + '</p>' + earlier + '</section>';
  }
  /* Areas in words, never percentages (the points are under "How this result was worked out"). */
  function bars(e) {
    return '<div class="bars">' + L.AK.map(function (a) {
      var r = e.area[a]; if (!r.asked) return '';
      var fill = r.tone === 'na' || r.pct == null ? 0 : Math.max(4, Math.round(r.pct * 100));
      return '<div class="brow"><span class="lbl">' + esc(r.name) + '</span><span class="track" aria-hidden="true"><i style="width:' + fill + '%;background:var(--' + r.tone + ')"></i></span><span class="word w-' + r.tone + '">' + esc(r.word) + '</span><span class="ans meta">' + r.answered + ' of ' + r.asked + ' answered</span></div>';
    }).join('') + '</div><p class="meta">Strong, gaps to close, weak: from the questions you could answer. “Too little to say” means fewer than half of an area\'s questions have an answer that counts.</p>';
  }
  function groupTitle(g) {
    return g === 'must' ? ['Before anything else', 'Must-haves not in place. Each one holds the verdict back.']
      : g === 'note' ? ['Add a note to confirm', 'You answered Yes. One line saying where it is written down confirms it. Nobody checks the note; it is for your own report.']
      : g === 'vendor' ? ['Confirm with the vendor ' + (st.stage === 'live' ? 'before you go on using it' : 'before signing'), 'Use the vendor questions further down.']
      : g === 'find' ? ['To find out', 'Questions you could not answer yet, by the person who knows.']
      : ['Gaps to close', ''];
  }
  var GROUPS = ['must', 'note', 'vendor', 'find', 'close'];
  function people(e) { var by = {}; e.actions.forEach(function (a) { if (a.who !== 'you') (by[a.who] = by[a.who] || []).push(a); }); return by; }
  function actionPlan(e) {
    var by = people(e), whos = Object.keys(L.WHO).filter(function (w) { return by[w]; });
    var h = '<section class="panel" id="plan" tabindex="-1"><h2>Action plan</h2><p class="sub">' + (e.actions.length ? plural(e.counts.open, 'open item') + ' in ' + plural(e.counts.openQs, 'question') + ', by person. ' + (e.level === 'pilot' ? (st.stage === 'live' ? 'Close the gaps while you use the tool.' : 'Close the gaps during the pilot.') : 'Start at the top.') : 'Nothing is open.') + '</p>';
    if (whos.length) h += '<div class="sendbox" id="send"><h3>Send the questions to the people who know</h3><p class="meta">One list per person. Copy it into an email or a message.</p><div class="btnrow">' + whos.map(function (w) {
      return '<button type="button" class="btn" data-act="copy-find" data-who="' + w + '">Copy for ' + esc(L.WHO[w]) + ' (' + by[w].length + ')</button>'; }).join('') + '</div></div>';
    GROUPS.forEach(function (g) {
      var items = e.actions.filter(function (a) { return a.group === g; }); if (!items.length) return;
      var t = groupTitle(g);
      h += '<div class="agroup" data-group="' + g + '"><h3>' + esc(t[0]) + ' <span class="meta">(' + items.length + ')</span></h3>' + (t[1] ? '<p class="meta">' + esc(g === 'close' && e.level === 'pilot' ? 'Close these during the pilot.' : t[1]) + '</p>' : '');
      if (g === 'note') {
        h += '<div>' + items.map(function (a) { return '<div class="gap"><span class="chip c-pilot">Yes, note missing</span><div class="g1"><span>' + esc(a.q.q) + '</span>' + noteField(a.q, st.A[a.q.code]) + '</div></div>'; }).join('') + '</div>' +
          '<div class="btnrow"><button type="button" class="btn" data-act="note-save" id="note-save">Save notes and update the result</button></div>';
      } else {
        h += '<ol class="actions">' + items.map(function (a) { return '<li><span><b>' + esc(L.whoName(a.who)) + ':</b> ' + (a.must && g !== 'must' ? '<span class="musttag">Must-have</span> ' : '') + esc(a.text) + '</span><span class="meta">' + esc([a.area, a.flag, a.ans ? 'you answered ' + (L.answerText(a.q, a.ans) || a.ans) : ''].filter(Boolean).join(' · ')) + '</span></li>'; }).join('') + '</ol>';
      }
      h += '</div>';
    });
    return h + '</section>';
  }
  function gateChip(g) {
    return g.met ? '<span class="chip c-scale">In place</span>' : g.unconf ? '<span class="chip c-pilot">Yes, note missing</span>' : g.known ? '<span class="chip c-found">Not in place</span>' : '<span class="chip c-open">Not known yet</span>';
  }
  function mustCards(e) {
    return e.gates.map(function (g) {
      var q = g.q, s = g.s, p = String(st.P[q.code] || '').trim(), a = st.A[q.code];
      return '<div class="gap">' + gateChip(g) + '<div class="g1"><span>' + esc(q.q) + '</span>' +
        (g.met ? (a === 'none' ? '<span class="meta">Your answer: ' + esc(q.none) + (q.noneNote ? '. Your note (self-declared, not checked): “' + esc(p) + '”' : '') + '</span>' : '<span class="meta">Your note (self-declared, not checked): “' + esc(p) + '”</span>')
          : '<span class="meta">' + esc([s.stale ? L.STALE : 'You answered ' + (L.answerText(q, s.ans) || 'nothing yet'), !s.stale && s.flag && s.flag !== 'Yes, note missing' ? s.flag : '', q.yes ? 'What counts as Yes: ' + q.yes : ''].filter(Boolean).join(' · ')) + '</span>') + '</div></div>';
    }).join('');
  }
  function legalBody(x) {
    var l = L.legal(M, x, st.hotel); if (!l) return '';
    var item = function (i) { return '<li>' + esc(i.text) + ' <span class="meta">' + esc(i.who) + (i.from ? ' · from ' + esc(fmtDate(i.from)) : '') + '</span></li>'; };
    return '<p class="meta">Provisional label from the team\'s AI Register, awaiting legal sign-off. Not a compliance verdict and not legal advice.</p>' +
      '<p><span class="chip c-label">' + esc(l.name) + '</span> ' + (l.applies ? '<span class="meta">applies from ' + esc(fmtDate(l.applies)) + '</span> ' : '') + esc(l.why || l.short) + '</p>' +
      l.could.map(function (c) { return '<p class="meta">' + (c.to ? 'The label becomes “' + esc(c.to) + '” if: ' : 'Also check: ') + esc(c.q) + '</p>'; }).join('') +
      (l.itemsHead ? '<h4>' + esc(l.itemsHead) + '</h4>' : '') +
      (l.items.length ? '<ul class="tight">' + l.items.slice(0, 8).map(item).join('') + '</ul>' : '') +
      (l.items.length > 8 ? '<details class="inner" data-row="legal-more"' + (ui.open['legal-more'] ? ' open' : '') + '><summary>Show ' + (l.items.length - 8) + ' more</summary><ul class="tight">' + l.items.slice(8).map(item).join('') + '</ul></details>' : '') +
      (l.labour ? '<p class="meta">' + esc(l.labour) + '</p>' : '') + '<p class="meta">' + esc(l.country) + ' The AI Register tab has the full list for your hotel.</p>';
  }
  function vResult() {
    var x = M.UI[st.useId], e = ev(), vq = L.vendorQs(M, x, e), c = prevCompare(), first = L.first3(e), by = people(e);
    var send = e.level !== 'pilot' && Object.keys(by).length > 0, cNew = ui.confirm && ui.confirm.kind === 'new';
    var h = '<section class="panel verdict v-' + e.level + '" id="verdict" data-level="' + e.level + '"><p class="meta">' + esc([st.hotel.name, x.name, L.STAGES[st.stage] && L.STAGES[st.stage].name, fmtDate(lastSnap() ? lastSnap().at : st.updated)].filter(Boolean).join(' · ')) + '</p>' +
      '<p class="vsent" id="vsent">' + esc(L.verdict(e, st.stage)) + '</p>' +
      '<p class="count" id="count">' + esc(L.countLine(e, c ? c.metBefore : null)) + '</p>' +
      (first.length ? '<div class="first"><h3>Do these first</h3><ol>' + first.map(function (f) { return '<li><b>' + esc(f.person) + ':</b> ' + esc(f.text) + '</li>'; }).join('') + '</ol></div>' : '') +
      '<div class="btnrow">' + (send ? '<button type="button" class="btn primary" data-act="send" id="primary">Send the questions to the people who know</button>' : '<button type="button" class="btn primary" data-act="pdf" id="primary">Download the report for your owner (PDF)</button>') +
      (e.actions.length ? '<button type="button" class="btn" data-act="review">Update open items</button>' : '') +
      (cNew ? '' : '<button type="button" class="btn" data-act="new" id="new">Start a new check</button>') + '</div>' +
      (cNew ? '<div class="confirmline" data-confirm="new"><p>Start a new check? This one stays in “Your checks”.</p><div class="btnrow"><button type="button" class="btn warn" data-act="new-yes" id="new-yes">Start new</button><button type="button" class="btn" data-act="new-no" id="new-no">Cancel</button></div></div>' : '') +
      '<p class="links">' + (e.actions.length ? '<button type="button" class="linkbtn" data-act="see-plan">' + (e.actions.length === 1 ? 'See the 1 item in the action plan' : 'See all ' + e.actions.length + ' items by person') + '</button>' : '') + (send ? '<button type="button" class="linkbtn" data-act="pdf">Download the report (PDF)</button>' : '') + '</p>' +
      '<div class="sumtext">' + L.summary(e, st.stage).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div></section>';
    h += sinceBanner();
    h += actionPlan(e);
    h += row('must', 'Must-haves: ' + e.counts.met + ' of ' + e.counts.gates + ' done', '<div>' + mustCards(e) + '</div>');
    h += row('areas', 'Your six areas: ' + e.counts.answered + ' of ' + e.counts.asked + ' answered · ' + e.counts.find + ' to find out', bars(e));
    h += row('vendor', 'Questions for the vendor (' + vq.length + ')', '<div class="btnrow"><button type="button" class="btn small" data-act="copy-vendor">Copy all</button></div><ol class="tight">' + vq.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>');
    var lg = legalBody(x); if (lg) h += row('legal', 'Legal: items to check', lg);
    h += row('owner', 'Note for your owner or head office', '<p class="meta">Optional. Printed on page 1 of the PDF as entered by you; the tool adds no figures of its own.</p><div class="formgrid">' +
      '<label class="fld"><span>What you ask approval for</span><input type="text" id="o-ask" data-o="ask" value="' + esc(st.owner.ask) + '" placeholder="For example a 3-month trial of the chatbot"></label>' +
      '<label class="fld"><span>Estimated cost (your figure)</span><input type="text" id="o-cost" data-o="cost" value="' + esc(st.owner.cost) + '" placeholder="For example EUR 6,000 for 12 months"></label>' +
      '<label class="fld"><span>Decision needed by</span><input type="date" id="o-by" data-o="by" value="' + esc(st.owner.by) + '"></label></div>' +
      '<div class="btnrow"><button type="button" class="btn" data-act="copy-owner">Copy a note for the owner</button></div>');
    h += row('next', 'When will you look at this again?', '<p class="meta">Shown here next time and printed on the report. Put it in your own calendar too: this page cannot send reminders.</p><div class="formgrid">' +
      '<label class="fld"><span>Moment</span><select id="n-when" data-n="when">' + opt('', 'Choose', st.next.when) + NEXT.map(function (o) { return opt(o[0], o[1], st.next.when); }).join('') + '</select></label>' +
      '<label class="fld"><span>Date (optional)</span><input type="date" id="n-date" data-n="date" value="' + esc(st.next.date) + '"></label></div>');
    h += sharePanel();
    h += row('method', 'How this result was worked out', '<ol class="steps">' + e.steps.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>' +
      '<p class="meta">Each area: points from the questions you could answer (Yes 2, Partly 1, No 0). Below 40% holds the verdict back once at least two questions in the area have a known answer; 40–74% is a gap to close; 75% or more is strong. There is no overall score. These cut-offs are the project team\'s judgement, still to be tested with hotels.</p>' +
      '<p class="meta">' + esc(ORDER_LINE) + '</p>' +
      '<h4>Changed in rules v4</h4><ul class="tight">' + L.CHANGES.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<p class="meta">Rules ' + esc(L.RULES) + '. Questions from the project\'s D6 readiness research, reworded after an internal wording review on 18 Nov 2026. Not yet reviewed by outside experts or tested with hotels. Must-haves are the team\'s judgement. Answers and notes are self-declared and not checked. Self-assessment, not legal or investment advice.</p>');
    h += '<section class="panel more"><h3>More</h3>' +
      '<div class="morerow"><button type="button" class="btn" data-act="file">Save as file</button><span class="meta">A copy you keep and can open again here, on any computer.</span></div>' +
      '<div class="morerow"><button type="button" class="btn" data-act="to-register">Add to the AI Register</button><span class="meta">Opens the team\'s AI Register with this tool, to list your hotel\'s AI tools.</span></div>' +
      '<div class="morerow"><button type="button" class="btn" data-act="edit">Go through all questions</button><span class="meta">From the must-haves (step 1), with your answers filled in.</span></div>' +
      '<p class="meta">Your check is kept in this browser. Come back when answers arrive: “Your checks” at the top of the page lists it.</p></section>';
    return h;
  }
  /* One line on the question order (20 Nov 2026), on the result page and in the PDF. */
  var ORDER_LINE = 'The must-haves were asked first (step 1), then each area without them. The order does not change the result: the same answers give the same verdict.';
  function sharePhase() { return ui.share && ui.share.id === st.id ? ui.share.phase : F.shareSettled(st); }
  function sharePanel() {
    var mode = S.state(), ph = sharePhase(), busy = ph === 'sending' || ph === 'withdrawing', stale = F.shareStale(st), where = st.sharedMode || mode;
    var status = ph === 'sending' ? (mode === 'probing' || mode === 'idle' ? 'Checking whether the project hub is reachable…' : 'Sending…')
      : ph === 'withdrawing' ? 'Withdrawing…'
      : st.sharedAt ? 'Last shared ' + fmtDate(st.sharedAt) + (where === 'local' ? ' (test copy in this browser)' : '') + '.' + (stale ? ' Your answers have changed since then: send an updated copy so the team sees the current ones.' : '')
      : mode === 'local' ? 'Outside the project hub this keeps a test copy in this browser only.' : '';
    var withdraw = st.sharedAt && !busy ? '<button type="button" class="linkbtn" data-act="unshare" id="unshare">Withdraw shared copy</button>' : '';
    var body = !SHARING_ON
      ? '<p>Sharing with the project team is switched off until the team has named who is responsible for shared data.</p><div class="btnrow"><span class="meta" role="status">' + esc(st.sharedAt || busy ? status : '') + '</span>' + withdraw + '</div>'
      : '<p>' + esc(SHARE_LINE) + 'with the button below.</p>' +
        '<p class="meta">Helps the EHL student team test the check. Sent: the tool, where you are with it, your role, hotel type, country, every answer, who you named for open questions, which must-haves have a note, and the dated history of your results. Not sent: the text of your notes, the note for your owner' + (st.share.named ? '' : ', the hotel name') + '. No hotel name unless you tick the box. The copy is linked to the account you opened the hub with.</p>' +
        '<label class="chk"><input type="checkbox" data-share="named" id="share-named"' + (st.share.named ? ' checked' : '') + (busy ? ' disabled' : '') + '><span>Also send our hotel name and the text of our notes so the team can discuss the result with us</span></label>' +
        '<div class="btnrow"><button type="button" class="btn" data-act="share" id="share-btn"' + (busy ? ' disabled' : '') + '>' + (st.sharedAt ? 'Send updated copy' : 'Share a copy') + '</button><span class="meta" role="status">' + esc(status) + '</span>' + withdraw + '</div>';
    return row('share', 'Share with the project team (optional)' + (st.sharedAt ? ' · shared ' + esc(fmtDate(st.sharedAt)) + (stale ? ', out of date' : '') : ''), body, ' id="share" data-share-state="' + ph + (stale ? ' stale' : '') + '"');
  }

  // ---------- text outputs ----------
  function findText(who) {
    var x = M.UI[st.useId], items = ev().actions.filter(function (a) { return a.who === who && a.group !== 'note'; });
    return 'AI readiness check: ' + x.name + (st.hotel.name ? ' (' + st.hotel.name + ')' : '') + '\nFor: ' + L.WHO[who] + '\nCould you help with these? ' + REPLY + '\n\n' + items.map(function (a) { return '- ' + (a.must ? '[must-have] ' : '') + a.text; }).join('\n');
  }
  function ownerText() {
    var x = M.UI[st.useId], e = ev();
    var must = e.actions.filter(function (a) { return a.must || a.group === 'vendor'; });
    return 'AI tool: ' + x.name + (st.hotel.name ? ' – ' + st.hotel.name : '') + '\n' + (st.owner.ask ? 'Request: ' + st.owner.ask + '\n' : '') + (st.owner.cost ? 'Estimated cost (our figure): ' + st.owner.cost + '\n' : '') + (st.owner.by ? 'Decision needed by: ' + fmtDate(st.owner.by) + '\n' : '') +
      '\nReadiness check result: ' + L.verdict(e, st.stage) + '\n' + L.countLine(e) + '\n' + L.summary(e, st.stage).join(' ') +
      (must.length ? '\n\nStill to settle (' + must.length + '):\n' + must.map(function (a) { return '- ' + a.text + ' (' + L.whoName(a.who) + ')'; }).join('\n') : '') +
      '\n\nSelf-assessment with the AI readiness check (student prototype, EHL SBP Group 36 for HFTP), rules ' + L.RULES + '. Answers and notes are self-declared and not checked.';
  }
  function copy(t, what) { if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { toast(what + ' copied.'); }, function () { toast('Copying is blocked here.'); }); else toast('Copying is blocked here.'); }

  // ---------- files and PDF ----------
  /* BRIDGE machine (F.bridgeNext): does the hub bar save files for us? 'none' (not in a frame) | 'pending' | 'yes' | 'no'.
     Events: pong (downloads yes/no), error (cannot post), timeout (12 s, an explicit event). Downloads asked for
     while 'pending' wait for the answer. Each download sent to the hub is in flight until 'download-result'
     or 2 minutes (the hub may be showing the person a dialog); the same file cannot be asked for twice meanwhile. */
  var host = { state: window.parent !== window ? 'pending' : 'none', waiters: [], seq: 0, calls: {}, busy: {} };
  function hostSend(ev) {
    var to = F.bridgeNext(host.state, ev); if (to === host.state) return;
    host.state = to; document.body.setAttribute('data-bridge', to); host.waiters.splice(0).forEach(function (f) { f(); });
  }
  if (host.state === 'pending') {
    window.addEventListener('message', function (e) {
      if (e.source !== window.parent || !e.data) return;
      var m = e.data;
      if (m.hub === 'pong') hostSend(m.downloads ? 'yes' : 'no');
      else if (m.hub === 'download-result' && host.calls[m.id]) { var cb = host.calls[m.id]; delete host.calls[m.id]; cb(m); }
    });
    try { window.parent.postMessage({ hub: 'ping' }, location.origin); } catch (e) { hostSend('error'); }
    setTimeout(function () { hostSend('timeout'); }, 12000);
  }
  function saveFile(name, blob, kind) {
    function viaLink() { try { var u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); toast('Download started: ' + name); } catch (e) { toast('This browser could not save the file.'); } }
    function go2() {
      if (host.state !== 'yes') { viaLink(); return; }
      if (host.busy[kind]) { toast('The earlier download is still waiting for your answer.'); return; }
      var id = 'd' + (++host.seq), t = setTimeout(function () { if (host.calls[id]) host.calls[id]({ ok: false, code: 'timeout' }); delete host.calls[id]; }, 120000);
      host.busy[kind] = id;
      host.calls[id] = function (m) { clearTimeout(t); delete host.busy[kind]; toast(m.ok ? 'Saved ' + name : m.code === 'declined' ? 'Download cancelled.' : m.code === 'timeout' ? 'No answer about the download. Try again.' : 'The file could not be saved here.'); };
      try { window.parent.postMessage({ hub: 'download', id: id, filename: name, data: blob }, location.origin); }
      catch (e) { host.calls[id]({ ok: false, code: 'unavailable' }); delete host.calls[id]; }
    }
    if (host.state === 'pending') { toast('Preparing the download…'); host.waiters.push(go2); } else go2();
  }
  /* File names use the tool's short name, not its internal id (v4, V12). */
  function slug(s) { return pdfSafe(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function fileBase() { return (slug(st.hotel.name) || 'hotel') + '_' + (slug(L.shortName(M.UI[st.useId])) || st.useId) + '_' + new Date().toISOString().slice(0, 10); }
  function saveRecord() {
    var r = Object.assign({}, st); delete r.q; delete r.dept;
    saveFile('AI-readiness-check_' + fileBase() + '.json', new Blob([JSON.stringify({ kind: 'hftp-readiness-check', v: 3, rules: L.RULES, savedAt: new Date().toISOString(), check: r }, null, 1)], { type: 'application/json' }), 'json');
  }
  /* Read a saved file. If this browser holds a newer copy of the same check, ask first (CONFIRM 'file'). */
  function loadRecord(file) {
    var fr = new FileReader();
    fr.onload = function () {
      var r = null;
      try { var o = JSON.parse(fr.result); if (o && o.kind === 'hftp-readiness-check' && o.check && M.UI[o.check.useId]) r = fromRecord(o.check); } catch (e) { r = null; }
      if (!r) { toast('This file is not a saved readiness check.'); return; }
      var cur = mine[r.id];
      if (cur && String(cur.updated || '') > String(r.updated || '')) { ui.file = r; ui.confirm = F.confirmNext(ui.confirm, 'ask', 'file', r.id).c; render(); try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } return; }
      openFile(r);
    };
    fr.readAsText(file);
  }
  function openFile(r) { ui.file = null; ui.confirm = null; ui.choosing = false; st = r; keep(); toast('Check opened from the file.'); go('result'); }
  function loadScript(src) { return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  function pdfSafe(s) {
    s = String(s == null ? '' : s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/…/g, '...').replace(/→/g, '->').replace(/€/g, 'EUR ');
    return s.replace(/[^\x00-\xFF]/g, function (c) { var b = c.normalize ? c.normalize('NFD').replace(/[̀-ͯ]/g, '') : ''; return /^[\x00-\xFF]+$/.test(b) ? b : ''; });
  }
  function makePdf() {
    var x = M.UI[st.useId], e = ev(), vq = L.vendorQs(M, x, e), lg = L.legal(M, x, st.hotel);
    var p = window.jspdf ? Promise.resolve() : loadScript('../assessment/lib/jspdf.umd.min.js').catch(function () { return loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'); });
    return p.then(function () {
      var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = 210, H = 297, Mg = 16, y = 20;
      function f(s2, sz, g) { doc.setFont('helvetica', s2); doc.setFontSize(sz); doc.setTextColor(g == null ? 20 : g); }
      function room(n) { if (y + n > H - 20) { doc.addPage(); y = 20; } }
      function para(t, sz, ind, st2, g) { f(st2 || 'normal', sz || 10, g); var ls = doc.splitTextToSize(pdfSafe(t), W - 2 * Mg - (ind || 0)); room(ls.length * 4.6); doc.text(ls, Mg + (ind || 0), y); y += ls.length * 4.6 + 1.2; }
      function head(t) { room(14); y += 3; f('bold', 12); doc.text(pdfSafe(t), Mg, y); y += 6; }
      function bullet(t, sub) { para('- ' + t, 9.5, 0); if (sub) para(sub, 8.5, 3, 'normal', 100); }
      // Page 1: for the owner. Same words as the result page.
      var prev = prevCompare(), first = L.first3(e), live = st.stage === 'live';
      f('bold', 18); doc.text('AI readiness check', Mg, y); y += 7;
      para([st.hotel.name, TYPES.filter(function (t) { return t[0] === st.hotel.type; }).map(function (t) { return t[1]; })[0], st.hotel.country === 'Other' ? COUNTRY_LABEL.Other : st.hotel.country].filter(Boolean).join(' | '), 10, 0, 'normal', 90);
      para('Filled in by: ' + ((ROLES.filter(function (r) { return r[0] === st.hotel.role; })[0] || [0, 'not given'])[1]) + ' | ' + fmtDate(lastSnap() ? lastSnap().at : new Date().toISOString()) + ' | Stage: ' + (L.STAGES[st.stage] ? L.STAGES[st.stage].name : '-'), 9, 0, 'normal', 90);
      y += 2; para(x.name, 12, 0, 'bold'); para(x.deptName + ' | ' + typeName(x) + ' tool | ' + x.int + ' effort', 9, 0, 'normal', 90);
      y += 3; para(L.verdict(e, st.stage), 14, 0, 'bold'); y += 1;
      para(L.countLine(e, prev ? prev.metBefore : null).replace(/ · /g, ' | '), 10, 0, 'normal', 60);
      L.summary(e, st.stage).forEach(function (t) { para(t, 10); });
      if (st.owner.ask || st.owner.cost || st.owner.by) {
        head('The request (entered by the hotel)');
        if (st.owner.ask) para('Approval asked for: ' + st.owner.ask, 10);
        if (st.owner.cost) para('Estimated cost: ' + st.owner.cost, 10);
        if (st.owner.by) para('Decision needed by: ' + fmtDate(st.owner.by), 10);
      }
      if (first.length) {
        head('Do these first');
        first.forEach(function (it, i) { para((i + 1) + '. ' + it.person + ': ' + it.text, 10); });
        para((e.counts.open === 1 ? 'The open item is' : 'All ' + e.counts.open + ' open items (in ' + plural(e.counts.openQs, 'question') + ') are') + ' in the action plan on the next page.', 9, 0, 'normal', 90);
      }
      head('Six areas, in words');
      L.AK.forEach(function (a) {
        var r = e.area[a]; if (!r.asked) return; room(7);
        f('normal', 9.5); doc.text(pdfSafe(r.name), Mg, y); doc.setDrawColor(138, 143, 153); doc.setFillColor(255, 255, 255); doc.rect(Mg + 52, y - 3, 60, 3.6, 'FD');
        if (r.pct != null && r.tone !== 'na') { var c = r.tone === 'lo' ? [163, 57, 42] : r.tone === 'md' ? [126, 87, 0] : [31, 111, 67]; doc.setFillColor(c[0], c[1], c[2]); doc.rect(Mg + 52, y - 3, Math.max(1.5, r.pct * 60), 3.6, 'F'); }
        doc.text(pdfSafe(r.word + '  (' + r.answered + ' of ' + r.asked + ' answered)'), Mg + 116, y); y += 6.5;
      });
      para('"Too little to say": fewer than half of the area\'s questions have an answer that counts. The points behind the words are under "How this was worked out".', 8.5, 0, 'normal', 100);
      if (st.next.when) para('Next look: ' + nextText(st.next), 9.5, 0, 'bold');
      // Page 2+: working pages
      doc.addPage(); y = 20;
      head('Action plan');
      if (!e.actions.length) para('Nothing is open.', 10);
      GROUPS.forEach(function (g) {
        var items = e.actions.filter(function (a) { return a.group === g; }); if (!items.length) return;
        para(groupTitle(g)[0] + ' (' + items.length + ')', 10.5, 0, 'bold');
        items.forEach(function (a) { bullet(L.whoName(a.who) + ': ' + a.text, [a.area, a.must ? 'must-have' : '', a.flag].filter(Boolean).join(' | ')); });
        y += 1;
      });
      head('Must-haves');
      e.gates.forEach(function (g) {
        var p2 = String(st.P[g.q.code] || '').trim(), a2 = st.A[g.q.code];
        bullet(g.q.q + ' [' + (g.met ? 'in place' : g.unconf ? 'Yes, note missing' : g.known ? 'not in place' : 'not known yet') + ']',
          g.met ? (a2 === 'none' ? 'Your answer: ' + g.q.none + (g.q.noneNote ? '. Note (self-declared, not checked): ' + p2 : '') : 'Note (self-declared, not checked): ' + p2) : g.s.stale ? L.STALE : 'What counts as Yes: ' + (g.q.yes || '-'));
      });
      head('Questions for the vendor'); vq.forEach(function (q, i) { para((i + 1) + '. ' + q, 9.5); });
      if (lg) {
        head('Legal: items to check (provisional)');
        para('Provisional label from the team\'s AI Register, awaiting legal sign-off. Not a compliance verdict and not legal advice.', 9, 0, 'normal', 90);
        para('Label: ' + lg.name + (lg.applies ? ' (applies from ' + fmtDate(lg.applies) + ')' : '') + '. ' + (lg.why || lg.short), 9.5);
        lg.could.forEach(function (c) { para((c.to ? 'The label becomes "' + c.to + '" if: ' : 'Also check: ') + c.q, 9); });
        if (lg.itemsHead) para(lg.itemsHead, 10, 0, 'bold');
        lg.items.forEach(function (i) { bullet(i.text, i.who + (i.from ? ' | from ' + fmtDate(i.from) : '')); });
        if (lg.labour) para(lg.labour, 9);
        para(lg.country + ' The AI Register tab of the project hub has the full list for your hotel.', 9);
      }
      head('How this was worked out');
      e.steps.forEach(function (t) { para(t, 9); });
      para(ORDER_LINE, 9);
      para('Must-haves and cut-offs are the project team\'s judgement, not yet tested with hotels. Answers and notes are self-declared and not checked. There is no overall score.', 9, 0, 'normal', 90);
      var n = doc.getNumberOfPages();
      for (var i = 1; i <= n; i++) { doc.setPage(i); f('normal', 7.5, 120); doc.text(pdfSafe('AI readiness check (student prototype), EHL SBP Group 36 for HFTP. Self-assessment, not legal or investment advice.'), Mg, H - 12); doc.text(pdfSafe('Rules ' + L.RULES + '. Answers and notes are self-declared and not checked.'), Mg, H - 8); doc.text('Page ' + i + ' of ' + n, W - Mg, H - 8, { align: 'right' }); }
      return doc.output('blob');
    });
  }

  // ---------- sharing (opt-in) ----------
  function shareDoc() {
    var x = M.UI[st.useId], e = ev(), named = st.share.named;
    var A = {}; Object.keys(st.A).forEach(function (k) { A[k] = st.A[k]; });
    var d = { v: 3, rules: L.RULES, useId: st.useId, useName: x.name, stage: st.stage, role: st.hotel.role, type: st.hotel.type, country: st.hotel.country, answers: A, who: st.Who,
              level: e.level, met: e.counts.met, gates: e.counts.gates, known: e.counts.known, asked: e.counts.asked, open: e.actions.length, snaps: (st.snaps || []).map(function (s) { return { at: s.at, level: s.level, met: s.met, open: s.open }; }),
              sharedAt: new Date().toISOString(), named: named };
    d.proofGiven = {}; Object.keys(st.P).forEach(function (k) { if (L.proofOk(st.P[k])) d.proofGiven[k] = true; });
    if (named) { d.hotelName = st.hotel.name; d.proofs = st.P; }
    return d;
  }

  // ---------- render and events ----------
  function render(keepFocus) {
    var act = document.activeElement, fid = keepFocus && act && act.id ? act.id : null;
    if (!F.isStep(st.step) || (st.step !== 'start' && !M.UI[st.useId])) st.step = 'start'; // never show an impossible screen
    else if (F.QSTEPS.indexOf(st.step) >= 0 && !F.stepNo(st.step, qSteps())) st.step = placeOf(st, st.step); // a step with no question left (hotel details changed)
    var html = st.step === 'start' ? vStart() : st.step === 'prep' ? vPrep() : st.step === 'review' ? vReview() : st.step === 'result' ? vResult() : vStep(st.step);
    var v = $('view');
    $('hdr').innerHTML = header(); $('hdr').className = st.step === 'start' ? 'hdr' : 'hdr compact';
    v.innerHTML = html;
    v.setAttribute('data-state', String(st.step));
    v.setAttribute('data-confirm', ui.confirm ? ui.confirm.kind : 'none');
    v.setAttribute('data-share-state', sharePhase() + (F.shareStale(st) ? ' stale' : ''));
    v.setAttribute('data-choosing', ui.choosing ? 'yes' : 'no');
    document.body.setAttribute('data-store', S.state());
    if (fid && $(fid)) { $(fid).focus(); try { var n = $(fid).value.length; $(fid).setSelectionRange(n, n); } catch (e) { /* not text */ } }
  }
  /* Move to a step. Only send(), openCheck(), openFile() and the confirm handlers call this; any navigation closes a confirmation. */
  function go(step, replace) {
    ui.confirm = F.confirmNext(ui.confirm, 'nav').c; ui.file = null; ui.choosing = false; ui.missing = false; ui.mustMissing = false; ui.open = {}; ui.touched = {}; ui.review = null;
    st.step = step; if (step === 'result') takeSnap(); else keep();
    try { history[replace ? 'replaceState' : 'pushState']({ rc: step, id: st.id }, ''); } catch (e) { /* ignore */ }
    render(); try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } $('view').focus({ preventScroll: true });
  }
  function flowCtx() { var t = !!M.UI[st.useId]; return { tool: t, ready: !!(t && st.hotel.type && st.stage && !ui.choosing), steps: t ? qSteps() : [], mustDone: t && !firstOpenMust() }; }
  /* The only way the journey moves: an event from the FLOW table (src/flow.js). Returns false if not allowed here. */
  function send(ev) {
    var to = F.flowNext(st.step, ev, flowCtx());
    if (to === null) return false;
    go(to); return true;
  }
  /* Back/forward: each history entry names its step and its check. Entries of another check reopen that check;
     entries of a removed check, or steps that cannot be shown, land on a safe step. */
  window.addEventListener('popstate', function (e) {
    var s = e.state || {}, rc = s.rc == null ? 'start' : s.rc;
    if (s.id && s.id !== st.id) {
      var r = openable(s.id) && fromRecord(mine[s.id]);
      if (r) st = r; else rc = 'start';
    }
    ui.confirm = null; ui.file = null; ui.choosing = false; ui.missing = false; ui.mustMissing = false; ui.open = {}; ui.touched = {}; ui.review = null;
    st.step = placeOf(st, rc); if (st.step === 'result') takeSnap(); else keep(); render();
  });
  function openCheck(id, step) { var r = openable(id) && fromRecord(mine[id]); if (!r) { toast('This check cannot be opened here.'); return; } st = r; go(step); }
  /* "Next" on the start screen is always enabled. With something missing it points to the first missing item
     (scrolls to it, outlines it, says "Choose one to continue") instead of moving on. */
  function pointToMissing() {
    var m = missing(); if (!m.length) return false;
    ui.missing = true; render();
    var box = $(m[0].box), f = $(m[0].focus);
    try { if (box) box.scrollIntoView({ block: 'center' }); if (f) f.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    return true;
  }
  function scrollToId(id, focusSel) {
    var el = $(id); if (!el) return;
    try { el.scrollIntoView({ block: 'start' }); var f = focusSel ? el.querySelector(focusSel) : el; if (f) f.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }
  var ACT_EVENT = { begin: 'begin', back: 'back', next: 'next', 'to-result': 'result', edit: 'edit', review: 'review' };
  function confirmed(kind, id) { var r = F.confirmNext(ui.confirm, 'yes', kind, id); ui.confirm = r.c; return r.fire; }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b || b.disabled) return;
    var a = b.getAttribute('data-act'), id = b.getAttribute('data-id');
    if (a === 'next' && st.step === 'must' && pointToMust()) return;
    if (ACT_EVENT[a]) { send(ACT_EVENT[a]); return; }
    if (a === 'prep') { if (!pointToMissing()) send('prep'); return; }
    if (a === 'home') { if (st.step === 'start') scrollToId('mychecks'); else if (send('home')) scrollToId('mychecks'); return; }
    if (a === 'send') { ui.open = ui.open || {}; scrollToId('send', 'button'); return; }
    if (a === 'see-plan') { scrollToId('plan'); return; }
    if (a === 'note-save') { takeSnap(); render(); scrollToId('verdict'); toast('Result updated.'); return; }
    if (a === 'undo') { var uc = b.getAttribute('data-code'); undo(uc); keep(); render(); var fs = $('fs-' + uc), fi = fs && fs.querySelector('input,select'); if (fi) fi.focus({ preventScroll: true }); return; }
    if (a === 'pick') {
      if (!M.UI[id]) return;
      if (st.useId && st.useId !== id && Object.keys(st.A).length) { st = Object.assign(blank(), { hotel: Object.assign({}, st.hotel), stage: st.stage }); toast('New tool, new check. The earlier one stays in “Your checks”.'); }
      st.useId = id; ui.choosing = false; keep(); render();
      /* Say what happened and what comes next: focus the "Selected" card, bring the stage question into view. */
      try { var pk = $('picked'), sg = $('box-stage'); if (pk) pk.focus({ preventScroll: true }); if (sg && !st.stage) sg.scrollIntoView({ block: 'center' }); else if (pk) pk.scrollIntoView({ block: 'nearest' }); } catch (e3) { /* ignore */ }
    }
    else if (a === 'unpick') { ui.choosing = true; render(); }
    else if (a === 'keep-tool') { ui.choosing = false; render(); }
    else if (a === 'open-review') openCheck(id, 'review');
    else if (a === 'open-result') openCheck(id, 'result');
    else if (a === 'rm') { ui.confirm = F.confirmNext(ui.confirm, 'ask', 'rm', id).c; render(); }
    else if (a === 'rm-no' || a === 'new-no') { ui.confirm = F.confirmNext(ui.confirm, 'cancel').c; render(); }
    else if (a === 'file-no') { ui.confirm = F.confirmNext(ui.confirm, 'cancel').c; ui.file = null; render(); toast('Kept the copy in this browser.'); }
    else if (a === 'file-yes') { var fr2 = ui.file; if (confirmed('file', fr2 && fr2.id) && fr2) openFile(fr2); else render(); }
    else if (a === 'rm-yes') {
      if (!confirmed('rm', id)) { render(); return; }
      delete mine[id]; lset(MY, mine);
      if (st.id === id) { var h0 = Object.assign({}, st.hotel); st = blank(); st.hotel = h0; }
      keep(); render(); toast('Removed from this browser.');
    }
    else if (a === 'new') { if (st.step === 'result') { ui.confirm = F.confirmNext(ui.confirm, 'ask', 'new').c; render(); } }
    else if (a === 'new-yes') {
      if (!confirmed('new') || st.step !== 'result') { render(); return; }
      var h = Object.assign({}, st.hotel); st = blank(); st.hotel = h; go('start');
    }
    else if (a === 'copy-prep') { var w = b.getAttribute('data-who'), qs = byWho(L.selectQuestions(M, M.UI[st.useId], st.hotel))[w] || []; copy(prepText(w, qs), 'Questions'); }
    else if (a === 'copy-find') copy(findText(b.getAttribute('data-who')), 'Questions');
    else if (a === 'copy-vendor') copy('Questions about ' + M.UI[st.useId].name + ':\n\n' + L.vendorQs(M, M.UI[st.useId], ev()).map(function (q, i) { return (i + 1) + '. ' + q; }).join('\n'), 'Vendor questions');
    else if (a === 'copy-owner') copy(ownerText(), 'Note');
    else if (a === 'file') saveRecord();
    else if (a === 'to-register') {
      var hh = 'add=' + st.useId + '&name=' + encodeURIComponent(M.UI[st.useId].name.replace(/\s*\(.*$/, ''));
      if (window.parent !== window) { try { window.parent.postMessage({ hub: 'open', tool: 'register', hash: hh }, location.origin); } catch (e2) { /* ignore */ } }
      else location.href = '../register/index.html#' + hh;
    }
    else if (a === 'pdf') {
      if (ui.pdf) { toast('The report is still being prepared.'); return; }
      ui.pdf = true; toast(nameWarn() ? 'Preparing the report. ' + nameWarn() : 'Preparing the report…');
      var name = 'AI-readiness-check_' + fileBase() + '.pdf';
      makePdf().then(function (blob) { ui.pdf = false; saveFile(name, blob, 'pdf'); }, function () { ui.pdf = false; toast('The PDF could not be made here. Use “Copy a note for the owner” instead.'); });
    }
    else if (a === 'share') shareSend('share');
    else if (a === 'unshare') shareSend('withdraw');
  });
  /* SHARE machine (F.shareNext). The answer may arrive after the person has moved to another check, so the
     result is written to the check it was sent for (patch), not to whatever is open by then. */
  function patch(id, fn) {
    if (st.id === id) { fn(st); keep(); if (st.step === 'result') { ui.open.share = true; render(true); } return; }
    var r = mine[id]; if (r) { fn(r); lset(MY, mine); }
  }
  function shareSend(ev) {
    if (ev === 'share' && !SHARING_ON) return; /* switched off: nothing is sent; withdrawing an existing copy still works */
    var from = sharePhase(), to = F.shareNext(from, ev); if (!to) return;
    if (ev === 'withdraw' && st.sharedMode && S.mode() && st.sharedMode !== S.mode()) {
      toast(st.sharedMode === 'shared' ? 'This copy was shared from the project hub: open the check there to withdraw it.' : 'This was only a test copy in another browser setting: nothing reached the team.');
      return;
    }
    var id = st.id, doc = ev === 'share' ? shareDoc() : null, sig = F.shareSig(st);
    ui.share = { phase: to, id: id }; render(true);
    var done = function () { if (ui.share && ui.share.id === id) ui.share = null; };
    if (ev === 'share') {
      S.save(id, doc).then(function (m) {
        done(); patch(id, function (r) { r.sharedAt = new Date().toISOString(); r.sharedMode = m; r.sharedSig = sig; });
        toast(m === 'shared' ? 'Copy shared with the project team.' : 'Saved as a test copy in this browser only (outside the project hub).');
      }, function () { done(); if (st.id === id) render(true); toast('Sharing is not available here. Save the file and send it instead.'); });
    } else {
      S.remove(id).then(function () {
        done(); patch(id, function (r) { r.sharedAt = null; r.sharedMode = null; r.sharedSig = null; });
        toast('Shared copy withdrawn.');
      }, function () { done(); if (st.id === id) render(true); toast('Could not withdraw here. Ask the team to delete it.'); });
    }
  }
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.hasAttribute('data-q')) {
      var k = el.getAttribute('data-q'), base = k.split('#')[0]; st.A[k] = el.value;
      /* F17: before a vendor is chosen, "Don't know yet" on a vendor question goes to the vendor at once (not only if the box is touched). */
      if (el.value === 'k' && !st.Who[base]) { var qq = allQs().filter(function (q) { return q.code === base; })[0]; if (qq && L.defaultWho(qq, st.stage) === 'vendor') st.Who[base] = 'vendor'; }
      keep(); render(true);
      if (st.step === 'review' && (!document.activeElement || document.activeElement === document.body) && $('undo-' + base)) $('undo-' + base).focus({ preventScroll: true });
    }
    else if (el.hasAttribute('data-stage')) { st.stage = el.value; keep(); render(true); }
    else if (el.hasAttribute('data-proof')) { ui.touched[el.getAttribute('data-proof')] = true; noteHint(el); }
    else if (el.hasAttribute('data-who')) { st.Who[el.getAttribute('data-who')] = el.value; keep(); }
    else if (el.tagName === 'SELECT' && el.hasAttribute('data-h')) { st.hotel[el.getAttribute('data-h')] = el.value; keep(); render(true); }
    else if (el.hasAttribute('data-n')) { st.next[el.getAttribute('data-n')] = el.value; keep(); }
    else if (el.hasAttribute('data-o') && el.type === 'date') { st.owner.by = el.value; keep(); }
    else if (el.hasAttribute('data-share')) { if (sharePhase() === 'sending' || sharePhase() === 'withdrawing') { el.checked = st.share.named; return; } st.share.named = el.checked; keep(); render(true); }
    else if (el.id === 'dept') { st.dept = el.value; refreshPick(); }
    else if (el.id === 'loadfile' && el.files && el.files[0]) loadRecord(el.files[0]);
  });
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.id === 'q') { st.q = el.value; refreshPick(); }
    else if (el.hasAttribute('data-h')) { st.hotel[el.getAttribute('data-h')] = el.value; keep(); var nw = $('name-warn'); if (nw) nw.textContent = nameWarn(); }
    else if (el.hasAttribute('data-o')) { st.owner[el.getAttribute('data-o')] = el.value; keep(); }
    else if (el.hasAttribute('data-proof')) { st.P[el.getAttribute('data-proof')] = el.value; keep(); noteHint(el); var sf = $('stepfoot'); if (sf && F.QSTEPS.indexOf(st.step) >= 0) sf.textContent = footText(stepQs(st.step)); }
  });
  function refreshPick() { var pl = $('picklist'), pc = $('pickcount'); if (pl) pl.innerHTML = pickList(st.q || ''); if (pc) pc.textContent = pickCount(st.q || ''); }
  /* The note hint is updated in place (no re-render while typing): grey until the field has been left with too little. */
  function noteHint(el) {
    var code = el.getAttribute('data-proof'), h = $('nh-' + code); if (!h) return;
    var ok = L.proofOk(el.value), q = allQs().filter(function (x) { return x.code === code; })[0] || {};
    h.className = 'notehint' + (ok ? ' ok' : ui.touched[code] ? ' bad' : '');
    h.textContent = ok ? 'Note added.' : 'Add at least two words, for example: ' + (st.A[code] === 'none' ? 'Confirmed by our legal adviser by email on 5 Nov' : (q.ex || 'Revenue manager, 4 hours a week'));
  }
  /* Collapsed rows of the result: remember which are open, so a re-render (sharing, notes) does not close them. */
  document.addEventListener('toggle', function (e) { var d = e.target; if (d && d.getAttribute && d.getAttribute('data-row')) ui.open[d.getAttribute('data-row')] = d.open; }, true);

  /* STORE machine (src/store.js): 'idle' → 'probing' → 'shared' | 'local'. The share panel says which, once known. */
  S.ready().then(function () { document.body.setAttribute('data-store', S.state()); if (st.step === 'result') render(true); });
  adoptProfile();
  /* Coming from the AI Register: #use=<use id> starts a check for that tool. */
  function fromHash() {
    var m = /(?:^|[#&])use=([a-z]+-\d+)/.exec(location.hash || ''); if (!m || !M.UI[m[1]]) return;
    if (st.useId !== m[1]) { var h0 = Object.assign({}, st.hotel); st = blank(); st.hotel = h0; adoptProfile(); st.useId = m[1]; }
    ui.confirm = null; ui.file = null; ui.choosing = false; ui.missing = false;
    st.step = 'start'; keep();
    return true;
  }
  fromHash();
  window.addEventListener('hashchange', function () { if (fromHash()) { try { history.replaceState({ rc: st.step, id: st.id }, '', location.pathname); } catch (e) { /* ignore */ } render(); } });
  try { history.replaceState({ rc: st.step, id: st.id }, '', location.pathname); } catch (e) { /* ignore */ }
  document.body.setAttribute('data-bridge', host.state);
  if (st.step === 'result') takeSnap();
  render();
  /* For agents and tests: a read-only snapshot of where things are, the record (a copy), and the FLOW events. */
  window.ReadinessCheck = {
    state: function () {
      return { step: st.step, id: st.id, useId: st.useId, confirm: ui.confirm ? { kind: ui.confirm.kind, id: ui.confirm.id } : null, choosing: ui.choosing,
               share: sharePhase(), shareStale: F.shareStale(st), sharedAt: st.sharedAt, store: S.state(), bridge: host.state, pdf: ui.pdf,
               snaps: (st.snaps || []).length, checks: Object.keys(mine).filter(openable), missing: st.step === 'start' ? missing().map(function (m) { return m.k; }) : [], sharing: SHARING_ON, rules: L.RULES,
               steps: M.UI[st.useId] ? qSteps() : [], stepNo: F.QSTEPS.indexOf(st.step) >= 0 ? F.stepNo(st.step, qSteps()) : 0, mustOpen: st.step === 'must' ? firstOpenMust() : null, mustMissing: ui.mustMissing };
    },
    record: function () { return JSON.parse(JSON.stringify(st)); },
    send: send,
    events: function () { return Object.keys((F.FLOW[st.step] || {})).filter(function (k) { return F.flowNext(st.step, k, flowCtx()) !== null; }); },
    model: M
  };
})();
