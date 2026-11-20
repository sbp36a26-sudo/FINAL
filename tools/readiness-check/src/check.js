/* AI readiness check v3: the client-facing guided flow.
   Journey: start (who fills it in, privacy, hotel, tool, stage) → what you will need (preparation list by person)
   → six steps → result (verdict, action plan by person, vendor questions, legal flag, owner note) → come back:
   "since last time" and a re-check of open items only. History lives in this browser and in a file the hotel keeps. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var D = JSON.parse($('d-data').textContent), L = window.RCLogic, S = window.RCStore;
  var M = L.model(D);
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var COUNTRIES = ['Austria', 'Belgium', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Other'];
  var TYPES = [['independent', 'Independent hotel'], ['group', 'Part of a group, run by the group'], ['managed', 'Managed or franchised']];
  var ROLES = [['gm', 'General manager'], ['owner', 'Owner or asset manager'], ['dept', 'Head of a department'], ['it', 'IT or CIO'], ['fin', 'Finance'], ['other', 'Other']];
  var NEXT = [['vendor', 'When the vendor has replied'], ['sign', 'Before signing'], ['trial', 'At the end of the trial'], ['budget', 'At budget time'], ['other', 'Another moment']];
  var SYN = { chatbot: 'chat', bot: 'chat', whatsapp: 'messag', 'food': 'food', waste: 'waste', rota: 'schedul', roster: 'schedul', shifts: 'schedul', pricing: 'pric', price: 'pric', cv: 'recruit', hiring: 'recruit', camera: 'camera', energy: 'energy', reviews: 'review', upsell: 'upsell', voice: 'voice', phone: 'call', email: 'email', housekeeping: 'housekeep', kitchen: 'kitchen', forecast: 'forecast', fraud: 'fraud', invoice: 'invoice' };
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
           file     a check read from a file, waiting for the 'file' confirmation */
  var F = window.RCFlow;
  function known(u) { return !!M.UI[u]; }
  function blank() { return { id: newId(), rv: F.RV, step: 'start', hotel: { name: '', role: '', type: '', country: '' }, stage: '', useId: '', A: {}, P: {}, Who: {}, owner: { ask: '', cost: '', by: '' }, next: { when: '', date: '' }, snaps: [], share: { on: false, named: false }, sharedAt: null, sharedSig: null, sharedMode: null, created: new Date().toISOString(), q: '', dept: '' }; }
  /* A saved record, validated and migrated (F.migrate), as a working check; null if it cannot be opened. */
  function fromRecord(r) { var m = F.migrate(r, known); return m ? Object.assign(blank(), m) : null; }
  var mine = lget(MY, {}); if (!mine || typeof mine !== 'object' || Array.isArray(mine)) mine = {};
  /* Records that cannot be opened by this build (tool no longer in the catalogue, damaged) stay in storage untouched. */
  function openable(k) { var r = mine[k]; return !!(r && r.id === k && F.migrate(r, known) && M.UI[r.useId]); }
  var ui = { confirm: null, share: null, choosing: false, pdf: false, file: null };
  var st = (openable(lget(CUR, '')) && fromRecord(mine[lget(CUR, '')])) || blank();
  /* Shared hotel profile (key hftp-hotel-profile-v1), also used by the AI Register in this browser. */
  var PROFILE = 'hftp-hotel-profile-v1';
  var CC = { AT: 'Austria', BE: 'Belgium', HR: 'Croatia', CY: 'Cyprus', CZ: 'Czechia', DK: 'Denmark', FI: 'Finland', FR: 'France', DE: 'Germany', GR: 'Greece', HU: 'Hungary', IE: 'Ireland', IT: 'Italy', LU: 'Luxembourg', MT: 'Malta', NL: 'Netherlands', PL: 'Poland', PT: 'Portugal', ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', GB: 'United Kingdom' };
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

  // ---------- start ----------
  function myList() {
    var ids = Object.keys(mine).filter(function (k) { var r = mine[k]; return openable(k) && ((r.snaps && r.snaps.length) || Object.keys(r.A || {}).length); }).sort(function (a, b) { return String(mine[b].updated).localeCompare(String(mine[a].updated)); });
    if (!ids.length) return '';
    var h = '<section class="panel"><h2>Your checks in this browser</h2><p class="sub">Pick one up where you left it. "Update open items" shows only what is still open.</p><div>';
    ids.forEach(function (k) {
      var r = F.migrate(mine[k], known), x = M.UI[r.useId], e = L.evaluate(M, x, r.hotel, r.A, r.P, r.Who, r.stage), cRm = ui.confirm && ui.confirm.kind === 'rm' && ui.confirm.id === k;
      h += '<div class="mycheck"><div class="g1"><strong>' + esc(x.name) + '</strong><span class="meta">' + esc([r.hotel.name, L.STAGES[r.stage] && L.STAGES[r.stage].name, 'last changed ' + fmtDate(r.updated)].filter(Boolean).join(' · ')) + '</span>' +
        '<span class="btnrow"><span class="chip c-' + L.LEVELS[e.level].chip + '">' + esc(L.LEVELS[e.level].name) + '</span><span class="meta">' + e.counts.met + ' of ' + e.counts.gates + ' must-haves met · ' + plural(e.actions.length, 'open item') + '</span></span>' +
        (r.next && r.next.when ? '<span class="meta">Planned next look: ' + esc(nextText(r.next)) + '</span>' : '') + '</div>' +
        '<div class="btnrow"><button type="button" class="btn primary" data-act="open-review" data-id="' + k + '">Update open items</button><button type="button" class="btn" data-act="open-result" data-id="' + k + '">See result</button>' +
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

  function matches(u, q) {
    if (!q) return true;
    var hay = (u.name + ' ' + u.task + ' ' + u.deptName + ' ' + u.kw).toLowerCase();
    return q.split(/\s+/).filter(Boolean).every(function (t) { return hay.indexOf(t) >= 0 || (SYN[t] && hay.indexOf(SYN[t]) >= 0) || (t.length > 4 && hay.indexOf(t.slice(0, -1)) >= 0); });
  }

  function vStart() {
    var H = st.hotel, x = M.UI[st.useId], q = (st.q || '').trim().toLowerCase();
    var h = fileConfirm() + myList() + '<section class="panel intro"><h2>Before you begin</h2>' +
      '<div class="cols3"><div><h4>Who fills it in</h4><p>The person who will be <b>responsible for the tool going live</b>: in an independent hotel usually the general manager; in a group, the head of the department that will use it, with IT. Not necessarily the CIO.</p></div>' +
      '<div><h4>How it works</h4><p>1. See the list of what you will need and who knows it. 2. Answer, about 15 minutes; leave open what you do not know. 3. Get a verdict and an action plan by person.</p></div>' +
      '<div><h4>Come back</h4><p>Your check is kept in this browser. Come back when answers arrive or before signing: you see what changed and update only what is open.</p></div></div></section>';
    h += '<section class="panel"><h2>1. About your hotel</h2><div class="formgrid">' +
      '<label class="fld"><span>Hotel name (optional, for your own report)</span><input type="text" id="h-name" data-h="name" value="' + esc(H.name) + '" autocomplete="organization"></label>' +
      '<label class="fld"><span>Your role</span><select id="h-role" data-h="role">' + opt('', 'Choose', H.role) + ROLES.map(function (t) { return opt(t[0], t[1], H.role); }).join('') + '</select></label>' +
      '<label class="fld"><span>How the hotel is run</span><select id="h-type" data-h="type">' + opt('', 'Choose', H.type) + TYPES.map(function (t) { return opt(t[0], t[1], H.type); }).join('') + '</select></label>' +
      '<label class="fld"><span>Country</span><select id="h-country" data-h="country">' + opt('', 'Choose', H.country) + COUNTRIES.map(function (c) { return opt(c, c, H.country); }).join('') + '</select></label>' +
      '</div></section>';
    h += '<section class="panel"><h2>2. Which AI tool?</h2>' +
      '<div class="legend"><p><b>Type of tool:</b> what kind of AI it is. Tools of the same type need similar resources.</p>' +
      '<p><b>Effort:</b> Light (a subscription, little set-up) · Moderate (links to your PMS or CRM, clean data) · Heavy (hardware, group platforms or high legal risk).</p></div>';
    if (x && !ui.choosing) {
      h += '<div class="panel" style="border-color:var(--accent)"><p class="meta">Selected</p><h3>' + esc(x.name) + '</h3><p class="meta">' + esc(x.deptName) + ' · ' + esc(typeName(x)) + ' tool · ' + esc(x.int) + ' effort</p><p>' + esc(x.task) + '</p>' +
        '<div><button type="button" class="linkbtn" data-act="unpick">Choose another tool</button></div></div>';
    } else {
      if (x) h += '<p class="meta">Now chosen: <b>' + esc(x.name) + '</b>.' + (Object.keys(st.A).length ? ' Picking another tool starts a new check; this one stays in “Your checks”.' : '') + ' <button type="button" class="linkbtn" data-act="keep-tool">Keep this tool</button></p>';
      h += '<div class="formgrid"><label class="fld"><span>Search</span><input type="search" id="q" value="' + esc(st.q) + '" placeholder="For example chatbot, pricing, rota, food waste"></label>' +
        '<label class="fld"><span>Department</span><select id="dept">' + opt('', 'All departments', st.dept) + D.cat.depts.map(function (d) { return opt(d.id, d.name, st.dept); }).join('') + '</select></label></div><div class="list" id="picklist">' + pickList(q) + '</div>';
    }
    h += '</section>';
    h += '<section class="panel"><h2>3. Where are you with this tool?</h2><div class="opts stack" role="radiogroup" aria-label="Stage">' +
      Object.keys(L.STAGES).map(function (k) { return '<label class="opt' + (st.stage === k ? ' on' : '') + '"><input type="radio" name="stage" value="' + k + '" data-stage="1"' + (st.stage === k ? ' checked' : '') + '>' + esc(L.STAGES[k].long) + '</label>'; }).join('') + '</div>' +
      '<p class="meta">This changes the advice, not the rules: some answers can only be known once you have a vendor.</p></section>';
    h += notice();
    var ok = flowCtx().ready;
    h += '<div class="btnrow"><button type="button" class="btn primary" data-act="prep" id="go-prep"' + (ok ? '' : ' disabled') + '>Next: what you will need</button><span class="meta" id="go-hint">' + (ok ? '' : START_HINT) + '</span>' +
      '<span class="spacer"></span><label class="btn" for="loadfile">Open a saved file</label><input type="file" id="loadfile" accept=".json,application/json" class="sr"></div>';
    return h;
  }
  function pickList(q) {
    var shown = M.USES.filter(function (u) { return (!st.dept || u.dept === st.dept) && matches(u, q); });
    return shown.map(function (u) { return '<button type="button" class="pick" data-act="pick" data-id="' + u.id + '"><span class="pn">' + esc(u.name) + '</span><span class="meta">' + esc(u.int) + ' effort</span><span class="meta">' + esc(u.deptName) + ' · ' + esc(typeName(u)) + ' tool</span></button>'; }).join('') ||
      '<p class="meta" style="padding:12px 4px">Nothing matches. Try a shorter word, or pick a department.</p>';
  }
  function notice() {
    return '<section class="panel notice"><h3>Your data</h3><p>Your answers stay in this browser. Nothing is sent unless you choose “Share with the project team” at the end, and then only what you tick. Use roles, not people\'s names, in your answers. Student prototype by EHL SBP Group 36 for HFTP. Responsible for shared data: <i>[to be confirmed]</i>. Shared copies are deleted by <i>[date to be confirmed]</i> or on request to <i>[contact to be confirmed]</i>.</p></section>';
  }

  // ---------- preparation ----------
  function byWho(qs) { var g = {}; qs.forEach(function (q) { var w = st.Who[q.code] || q.who; (g[w] = g[w] || []).push(q); }); return g; }
  function prepText(who, qs) {
    var x = M.UI[st.useId];
    return 'AI readiness check: ' + x.name + (st.hotel.name ? ' (' + st.hotel.name + ')' : '') + '\nQuestions for: ' + L.WHO[who] + '\n\n' + qs.map(function (q) {
      return '- ' + (q.list ? q.q + ' ' + q.items.join('; ') : q.q) + (q.gate ? ' [must-have]' + (q.yes ? ' What counts as Yes: ' + q.yes : '') : '');
    }).join('\n') + '\n\nPlease reply with Yes / Partly / No, and for must-haves one line of proof (a date, a document or a role).';
  }
  function vPrep() {
    var x = M.UI[st.useId], qs = L.selectQuestions(M, x, st.hotel), gates = qs.filter(function (q) { return q.gate; }), g = byWho(qs);
    var early = st.stage === 'explore' || st.stage === 'choose';
    var h = '<div class="prog"><p class="meta">Getting ready · ' + esc(x.name) + '</p><div class="bar"><i style="width:4%"></i></div></div>';
    h += '<section class="panel"><h2>What you will need</h2><p class="sub">' + qs.length + ' questions, about 15 minutes. The <b>' + gates.length + ' must-haves</b> decide the verdict, so get those answers first. Copy the questions for each person and send them now; your answers are kept in this browser while you wait.</p></section>';
    h += '<section class="panel"><h3>This tool at a glance</h3><dl class="kv"><dt>What it does</dt><dd>' + esc(x.task) + '</dd><dt>Type</dt><dd>' + esc(x.arch ? M.ARCH[x.arch].n : 'Other') + ' · ' + esc(x.int) + ' effort</dd>' +
      (x.r.fi ? '<dt>Usually paid for</dt><dd>' + esc(String(x.r.fi).replace(/\s*\(see D7\)/gi, '')) + '</dd>' : '') + (x.level ? '<dt>How common in hotels</dt><dd>' + esc(x.level) + ' (team\'s use-case catalogue)</dd>' : '') + '</dl></section>';
    h += '<section class="panel"><h3>The must-haves</h3><div>' + gates.map(function (q) {
      return '<div class="gap"><span class="chip c-must">Must-have</span><div class="g1"><span>' + esc(q.q) + '</span>' + (q.yes ? '<span class="meta">What counts as Yes: ' + esc(q.yes) + '</span>' : '') +
        '<span class="meta">Usually known by: ' + esc(L.WHO[q.who]) + (q.vendor && early ? ' · Can only be confirmed once you have a vendor' : '') + '</span></div></div>';
    }).join('') + '</div></section>';
    h += '<section class="panel"><h3>Who to ask</h3><p class="meta">Grouped by the person who usually knows. You can change who to ask while answering.</p><div class="whogrid">' + Object.keys(L.WHO).filter(function (w) { return g[w]; }).map(function (w) {
      return '<div class="whobox"><div class="btnrow" style="justify-content:space-between"><h4>' + esc(L.WHO[w]) + '</h4><button type="button" class="btn small" data-act="copy-prep" data-who="' + w + '">Copy questions</button></div><ul>' +
        g[w].map(function (q) { return '<li>' + (q.gate ? '<b>' : '') + esc(q.list ? q.q.replace(/\. Tick those who have agreed to take part:|:$/, '').replace(/:$/, '') + ': ' + q.items.join('; ') : q.q) + (q.gate ? '</b>' : '') + '</li>'; }).join('') + '</ul></div>';
    }).join('') + '</div></section>';
    h += '<div class="btnrow"><button type="button" class="btn" data-act="back">Back</button><button type="button" class="btn primary" data-act="begin">Start the questions</button><span class="meta">Or close the page: everything is kept in this browser.</span></div>';
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
  function qBlock(q) {
    var early = st.stage === 'explore' || st.stage === 'choose', h;
    if (q.list) {
      h = '<fieldset class="qa"><legend>' + esc(q.q) + '</legend><div class="items">';
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
    var cur = st.A[q.code] || '', name = 'q-' + q.code;
    h = '<fieldset class="qa" id="fs-' + q.code + '"><legend>' + esc(q.q) + '</legend>' +
      (q.gate ? '<div class="btnrow"><span class="chip c-must">Must-have</span></div>' : '') +
      (q.help ? '<p class="meta">' + esc(q.help) + '</p>' : '') +
      (q.gate && q.yes ? '<p class="yesline"><b>What counts as Yes:</b> ' + esc(q.yes) + '</p>' : '') +
      '<div class="opts" role="radiogroup">' + optsFor(q).map(function (o) { return '<label class="opt' + (cur === o[0] ? ' on' : '') + '"><input type="radio" name="' + name + '" id="' + name + '-' + o[0] + '" value="' + o[0] + '" data-q="' + q.code + '"' + (cur === o[0] ? ' checked' : '') + '>' + esc(o[1]) + '</label>'; }).join('') + '</div>';
    if (q.vendor && early && !cur) h += '<p class="meta hint">No vendor yet? Choose “Don\'t know yet” and “The vendor”: it goes on your list of questions for the vendor.</p>';
    if (cur === 'k') h += whoSel(q.code, q.vendor && early ? 'vendor' : q.who);
    if (q.gate && cur === 'y') {
      var ok = L.proofOk(st.P[q.code]);
      h += '<div class="proof"><label for="pf-' + q.code + '"><strong>Confirm your Yes in one line.</strong> ' + esc(q.ask || 'What could you show if someone asked? A role, a document or a date.') + '</label>' +
        '<input type="text" id="pf-' + q.code + '" data-proof="' + q.code + '" value="' + esc(st.P[q.code] || '') + '" placeholder="Type your answer here">' +
        (q.ex ? '<span class="meta">Example: ' + esc(q.ex) + '</span>' : '') + '</div>' +
        '<p class="warnline"' + (ok ? ' hidden' : '') + '>Needed for a must-have: until you add a line of at least a few words, your Yes counts as Partly.</p>';
    }
    if (q.note) h += '<p class="meta">' + esc(q.note) + '</p>';
    return h + '</fieldset>';
  }
  function areaQs(a) { return L.selectQuestions(M, M.UI[st.useId], st.hotel).filter(function (q) { return q.a === a; }); }
  function answered(q) { if (q.list) return q.items.every(function (_, i) { return st.A[q.code + '#' + i]; }); return !!st.A[q.code]; }
  function vStep(i) {
    var x = M.UI[st.useId], a = L.AK[i], area = M.AREA[a], qs = areaQs(a);
    var done = qs.filter(answered).length;
    var h = '<div class="prog"><p class="meta">Step ' + (i + 1) + ' of 6 · ' + esc(x.name) + '</p><div class="bar"><i style="width:' + Math.round((i + 1) / 7 * 100) + '%"></i></div></div>';
    h += '<section class="panel"><h2>' + esc(area.name) + '</h2><p class="sub">' + esc(area.one) + '</p><div>' + qs.map(qBlock).join('') + '</div></section>';
    h += '<div class="btnrow"><button type="button" class="btn" data-act="back">Back</button><button type="button" class="btn primary" data-act="next">' + (i === 5 ? 'See my result' : 'Next') + '</button><span class="meta">' + done + ' of ' + qs.length + ' answered. Anything left open goes on your “to find out” list.</span></div>';
    return h;
  }
  function openQs() {
    var e = ev();
    return e.qs.filter(function (q) {
      var s = L.score(q, st.A, st.P);
      if (q.list) return q.items.some(function (_, i) { var v = st.A[q.code + '#' + i]; return !v || v === 'k' || v === 'n'; });
      return s.state === 'unknown' || s.state === 'gap';
    });
  }
  function vReview() {
    var x = M.UI[st.useId], qs = openQs();
    var h = '<div class="prog"><p class="meta">Update open items · ' + esc(x.name) + '</p><div class="bar"><i style="width:50%"></i></div></div>';
    h += '<section class="panel"><h2>Only what is still open</h2><p class="sub">' + plural(qs.length, 'question') + ' not yet answered with Yes. Change what has moved on since ' + esc(fmtDate(lastSnap() && lastSnap().at || st.updated)) + '; leave the rest.</p></section>';
    L.AK.forEach(function (a) { var g = qs.filter(function (q) { return q.a === a; }); if (g.length) h += '<section class="panel"><h3>' + esc(M.AREA[a].name) + '</h3><div>' + g.map(qBlock).join('') + '</div></section>'; });
    if (!qs.length) h += '<section class="panel"><p>Nothing is open: every question has a Yes.</p></section>';
    h += '<div class="btnrow"><button type="button" class="btn primary" data-act="to-result">See updated result</button><button type="button" class="btn" data-act="edit">Go through all questions</button></div>';
    return h;
  }

  // ---------- result ----------
  function lastSnap() { return st.snaps && st.snaps[st.snaps.length - 1]; }
  function takeSnap() {
    var s = L.snapshot(ev(), new Date().toISOString()), last = lastSnap();
    var same = last && last.level === s.level && last.met === s.met && last.known === s.known && last.open === s.open && JSON.stringify(last.metCodes) === JSON.stringify(s.metCodes);
    if (!same) { st.snaps = (st.snaps || []).concat(s).slice(-20); }
    keep();
  }
  function sinceBanner() {
    var n = st.snaps || []; if (n.length < 2) return '';
    var c = L.compare(n[n.length - 2], n[n.length - 1]); if (!c) return '<section class="panel banner"><p>Rules have changed since your last result (' + esc(fmtDate(n[n.length - 2].at)) + '), so the two cannot be compared line by line.</p></section>';
    var bits = [];
    if (c.closed.length) bits.push(plural(c.closed.length, 'must-have') + ' now met');
    if (c.reopened.length) bits.push(plural(c.reopened.length, 'must-have') + ' no longer met');
    if (c.knownGain > 0) bits.push(plural(c.knownGain, 'more question') + ' answered');
    bits.push('open items ' + c.openBefore + ' → ' + c.openNow);
    return '<section class="panel banner"><h3>Since ' + esc(fmtDate(c.since)) + '</h3><p>' + esc(bits.join(' · ')) + '.' + (c.from !== c.to ? ' Verdict: ' + esc(L.LEVELS[c.from].name) + ' → <b>' + esc(L.LEVELS[c.to].name) + '</b>.' : '') + '</p>' +
      (n.length > 2 ? '<details><summary>Earlier results</summary><ul>' + n.slice(0, -1).reverse().map(function (s) { return '<li>' + esc(fmtDate(s.at)) + ': ' + esc(L.LEVELS[s.level].name) + ', ' + s.met + ' of ' + s.gates + ' must-haves met, ' + s.open + ' open</li>'; }).join('') + '</ul></details>' : '') + '</section>';
  }
  function bars(e) {
    return '<div class="bars">' + L.AK.map(function (a) {
      var r = e.area[a]; if (!r.asked) return '';
      var col = r.pct == null ? 'var(--na)' : r.pct < L.LOW ? 'var(--lo)' : r.pct < L.HIGH ? 'var(--md)' : 'var(--hi)';
      return '<div class="brow"><span class="lbl">' + esc(r.name) + '<span class="meta"> · ' + r.known + ' of ' + r.asked + ' answered</span></span><span class="track" role="img" aria-label="' + esc(r.name) + ' ' + pct(r.pct) + '"><i style="width:' + (r.pct == null ? 0 : Math.max(2, Math.round(r.pct * 100))) + '%;background:' + col + '"></i></span><span class="num">' + (r.pct == null ? 'not known' : pct(r.pct)) + '</span></div>';
    }).join('') + '</div><p class="meta">Each bar: points from the questions you could answer (Yes 2, Partly 1, No 0). Below 40% holds the verdict back; 40–74% is a gap to close during a pilot. These cut-offs are the project team\'s judgement, still to be tested with hotels.</p>';
  }
  var GROUPS = [['must', 'Before anything else', 'Must-haves not in place. Each one holds the verdict back.'], ['vendor', 'Confirm with the vendor before signing', 'Use the vendor questions below.'], ['find', 'To find out', 'Questions you could not answer yet, by the person who knows.'], ['close', 'Gaps to close', '']];
  function actionPlan(e) {
    var h = '<section class="panel"><h2>Action plan</h2><p class="sub">Every open item, in order. ' + (e.level === 'pilot' ? 'Close the gaps during the pilot.' : 'Start at the top.') + '</p>';
    GROUPS.forEach(function (g) {
      var items = e.actions.filter(function (a) { return a.group === g[0]; }); if (!items.length) return;
      h += '<div class="agroup"><div class="btnrow" style="justify-content:space-between"><h3>' + esc(g[1]) + ' <span class="meta">(' + items.length + ')</span></h3>' + (g[0] === 'find' ? '' : '') + '</div>' + (g[2] ? '<p class="meta">' + esc(g[0] === 'close' && e.level === 'pilot' ? 'Close these during the pilot.' : g[2]) + '</p>' : '');
      if (g[0] === 'find') {
        var by = {}; items.forEach(function (a) { (by[a.who] = by[a.who] || []).push(a); });
        Object.keys(by).forEach(function (w) {
          h += '<div class="whobox"><div class="btnrow" style="justify-content:space-between"><h4>' + esc(L.WHO[w]) + '</h4><button type="button" class="btn small" data-act="copy-find" data-who="' + w + '">Copy for ' + esc(L.WHO[w].toLowerCase()) + '</button></div><ul>' + by[w].map(function (a) { return '<li>' + (a.must ? '<b>Must-have:</b> ' : '') + esc(a.text) + '</li>'; }).join('') + '</ul></div>';
        });
      } else {
        h += '<ol class="actions">' + items.map(function (a) { return '<li><span>' + esc(a.text) + '</span><span class="meta">' + esc(L.WHO[a.who]) + (a.area ? ' · ' + esc(a.area) : '') + (a.flag ? ' · ' + esc(a.flag) : '') + (a.ans ? ' · you answered ' + esc(L.ANSWER[a.ans] || a.ans) : '') + '</span></li>'; }).join('') + '</ol>';
      }
      h += '</div>';
    });
    if (!e.actions.length) h += '<p>Nothing open.</p>';
    return h + '</section>';
  }
  function mustCards(e) {
    return '<section class="panel"><h2>Must-haves <span class="meta">' + e.counts.met + ' of ' + e.counts.gates + ' met</span></h2><div>' + e.gates.map(function (g) {
      var q = g.q, s = g.s, p = String(st.P[q.code] || '').trim();
      var chip = g.met ? '<span class="chip c-scale">Met</span>' : g.known ? '<span class="chip c-found">Not met</span>' : '<span class="chip c-open">Not known yet</span>';
      return '<div class="gap">' + chip + '<div class="g1"><span>' + esc(q.q) + '</span>' +
        (g.met ? (st.A[q.code] === 'none' ? '<span class="meta">Doesn\'t apply: ' + esc(q.none) + '</span>' : '<span class="meta">Your proof (self-declared, not checked): “' + esc(p) + '”</span>')
          : '<span class="meta">You answered ' + esc(L.ANSWER[s.ans] || 'nothing yet') + (s.flag ? ' · ' + esc(s.flag) : '') + (q.yes ? ' · What counts as Yes: ' + esc(q.yes) : '') + '</span>') + '</div></div>';
    }).join('') + '</div></section>';
  }
  function legalPanel(x) {
    var l = L.legal(M, x, st.hotel); if (!l) return '';
    return '<section class="panel"><h2>Legal: items to check</h2><p class="meta">Provisional label from the team\'s AI Register, awaiting legal sign-off. Not a compliance verdict and not legal advice.</p>' +
      '<p><span class="chip c-label">' + esc(l.name) + '</span> ' + esc(l.why || l.short) + '</p>' +
      l.could.map(function (c) { return '<p class="meta">' + (c.to ? 'The label becomes “' + esc(c.to) + '” if: ' : 'Also check: ') + esc(c.q) + '</p>'; }).join('') +
      (l.items.length ? '<ul class="tight">' + l.items.map(function (i) { return '<li>' + esc(i.text) + ' <span class="meta">' + esc(i.who) + (i.from ? ' · from ' + esc(fmtDate(i.from)) : '') + '</span></li>'; }).join('') + '</ul>' : '') +
      (l.labour ? '<p class="meta">' + esc(l.labour) + '</p>' : '') + '<p class="meta">' + esc(l.country) + ' The AI Register tab has the full list for your hotel.</p></section>';
  }
  function vResult() {
    var x = M.UI[st.useId], e = ev(), lv = L.LEVELS[e.level], vq = L.vendorQs(M, x, e);
    var h = '<section class="panel"><p class="meta">' + esc([st.hotel.name, x.name, L.STAGES[st.stage] && L.STAGES[st.stage].name, fmtDate(lastSnap() ? lastSnap().at : st.updated)].filter(Boolean).join(' · ')) + '</p>' +
      '<p><span class="chip big c-' + lv.chip + '">' + esc(lv.name) + '</span></p>' +
      '<p class="tally">' + e.counts.met + ' of ' + e.counts.gates + ' must-haves met · ' + e.counts.known + ' of ' + e.counts.asked + ' questions answered · ' + plural(e.actions.length, 'open item') + '</p>' +
      '<div class="sumtext">' + L.summary(e, st.stage).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="pdf">Download report (PDF)</button><button type="button" class="btn" data-act="file">Save as file</button><button type="button" class="btn" data-act="review">Update open items</button><button type="button" class="btn" data-act="to-register">Add to the AI Register</button>' + newCheckCtl() + '</div></section>';
    h += sinceBanner();
    h += mustCards(e);
    h += actionPlan(e);
    h += '<section class="panel"><h2>Your six areas</h2>' + bars(e) + '</section>';
    h += '<section class="panel"><div class="btnrow" style="justify-content:space-between"><h2>Questions for the vendor</h2><button type="button" class="btn small" data-act="copy-vendor">Copy all</button></div><ol class="tight">' + vq.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol></section>';
    h += legalPanel(x);
    h += '<section class="panel"><h2>For your owner or head office</h2><p class="meta">Optional. Printed on page 1 of the PDF as entered by you; the tool adds no figures of its own.</p><div class="formgrid">' +
      '<label class="fld"><span>What you ask approval for</span><input type="text" id="o-ask" data-o="ask" value="' + esc(st.owner.ask) + '" placeholder="For example a 3-month trial of the chatbot"></label>' +
      '<label class="fld"><span>Estimated cost (your figure)</span><input type="text" id="o-cost" data-o="cost" value="' + esc(st.owner.cost) + '" placeholder="For example EUR 6,000 for 12 months"></label>' +
      '<label class="fld"><span>Decision needed by</span><input type="date" id="o-by" data-o="by" value="' + esc(st.owner.by) + '"></label></div>' +
      '<div class="btnrow"><button type="button" class="btn" data-act="copy-owner">Copy a note for the owner</button></div></section>';
    h += '<section class="panel"><h2>When will you look at this again?</h2><p class="meta">Shown here next time and printed on the report. Put it in your own calendar too: this page cannot send reminders.</p><div class="formgrid">' +
      '<label class="fld"><span>Moment</span><select id="n-when" data-n="when">' + opt('', 'Choose', st.next.when) + NEXT.map(function (o) { return opt(o[0], o[1], st.next.when); }).join('') + '</select></label>' +
      '<label class="fld"><span>Date (optional)</span><input type="date" id="n-date" data-n="date" value="' + esc(st.next.date) + '"></label></div></section>';
    h += sharePanel();
    h += '<section class="panel"><details><summary>How this result was worked out</summary><ol class="steps">' + e.steps.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>' +
      '<p class="meta">Rules ' + esc(L.RULES) + '. Questions from the project\'s D6 readiness research, reworded after expert review on 18 Nov 2026. Thresholds and must-haves are the team\'s judgement, not yet tested with hotels. Answers and proof lines are self-declared and not checked. Self-assessment, not legal or investment advice.</p></details></section>';
    h += '<div class="btnrow"><button type="button" class="btn" data-act="edit">Go through all questions</button></div>';
    return h;
  }
  // "Start a new check" sits in the top action row of the result; the confirm replaces it in place.
  function newCheckCtl() {
    var cNew = ui.confirm && ui.confirm.kind === 'new';
    return cNew ? '<span class="meta" data-confirm="new">Start a new check? This one stays in “Your checks”.</span><button type="button" class="btn warn" data-act="new-yes" id="new-yes">Start new</button><button type="button" class="btn" data-act="new-no" id="new-no">Cancel</button>' : '<button type="button" class="btn" data-act="new" id="new">Start a new check</button>';
  }
  function sharePhase() { return ui.share && ui.share.id === st.id ? ui.share.phase : F.shareSettled(st); }
  function sharePanel() {
    var mode = S.state(), ph = sharePhase(), busy = ph === 'sending' || ph === 'withdrawing', stale = F.shareStale(st), where = st.sharedMode || mode;
    var status = ph === 'sending' ? (mode === 'probing' || mode === 'idle' ? 'Checking whether the project hub is reachable…' : 'Sending…')
      : ph === 'withdrawing' ? 'Withdrawing…'
      : st.sharedAt ? 'Last shared ' + fmtDate(st.sharedAt) + (where === 'local' ? ' (test copy in this browser)' : '') + '.' + (stale ? ' Your answers have changed since then: send an updated copy so the team sees the current ones.' : '')
      : mode === 'local' ? 'Outside the project hub this keeps a test copy in this browser only.' : '';
    return '<section class="panel" id="share" data-share-state="' + ph + (stale ? ' stale' : '') + '"><h2>Share with the project team (optional)</h2><p class="meta">Helps the EHL student team test the check. Sent: your role, hotel type, country, the tool, your answers and the verdict. Not sent: proof lines, owner note' + (st.share.named ? '' : ', hotel name') + '.</p>' +
      '<label class="chk"><input type="checkbox" data-share="named"' + (st.share.named ? ' checked' : '') + (busy ? ' disabled' : '') + '> Also send our hotel name and proof lines so the team can discuss the result with us</label>' +
      '<div class="btnrow"><button type="button" class="btn' + (stale ? ' primary' : '') + '" data-act="share" id="share-btn"' + (busy ? ' disabled' : '') + '>' + (st.sharedAt ? 'Send updated copy' : 'Share a copy') + '</button><span class="meta" role="status">' + esc(status) + '</span>' +
      (st.sharedAt && !busy ? '<button type="button" class="linkbtn" data-act="unshare" id="unshare">Withdraw shared copy</button>' : '') + '</div></section>';
  }

  // ---------- text outputs ----------
  function findText(who) {
    var x = M.UI[st.useId], items = ev().actions.filter(function (a) { return (a.group === 'find' || a.group === 'vendor') && a.who === who; });
    return 'AI readiness check: ' + x.name + (st.hotel.name ? ' (' + st.hotel.name + ')' : '') + '\nCould you help with these? Please reply Yes / Partly / No, and for must-haves one line of proof (a date, a document or a role).\n\n' + items.map(function (a) { return '- ' + (a.must ? '[must-have] ' : '') + a.text; }).join('\n');
  }
  function ownerText() {
    var x = M.UI[st.useId], e = ev(), lv = L.LEVELS[e.level];
    var must = e.actions.filter(function (a) { return a.group === 'must' || a.group === 'vendor' || (a.group === 'find' && a.must); }).slice(0, 5);
    return 'AI tool: ' + x.name + (st.hotel.name ? ' – ' + st.hotel.name : '') + '\n' + (st.owner.ask ? 'Request: ' + st.owner.ask + '\n' : '') + (st.owner.cost ? 'Estimated cost (our figure): ' + st.owner.cost + '\n' : '') + (st.owner.by ? 'Decision needed by: ' + fmtDate(st.owner.by) + '\n' : '') +
      '\nReadiness check result: ' + lv.name + ' (' + e.counts.met + ' of ' + e.counts.gates + ' must-haves met)\n' + L.summary(e, st.stage).join(' ') +
      (must.length ? '\n\nOpen conditions:\n' + must.map(function (a) { return '- ' + a.text + ' (' + L.WHO[a.who] + ')'; }).join('\n') : '') +
      '\n\nSelf-assessment with the AI readiness check (student prototype, EHL SBP Group 36 for HFTP), rules ' + L.RULES + '. Answers are self-declared.';
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
  function fileBase() { return (st.hotel.name || 'hotel').replace(/[^\w-]+/g, '-') + '_' + st.useId + '_' + new Date().toISOString().slice(0, 10); }
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
    var x = M.UI[st.useId], e = ev(), lv = L.LEVELS[e.level], vq = L.vendorQs(M, x, e), lg = L.legal(M, x, st.hotel);
    var p = window.jspdf ? Promise.resolve() : loadScript('../assessment/lib/jspdf.umd.min.js').catch(function () { return loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'); });
    return p.then(function () {
      var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = 210, H = 297, Mg = 16, y = 20;
      function f(s2, sz, g) { doc.setFont('helvetica', s2); doc.setFontSize(sz); doc.setTextColor(g == null ? 20 : g); }
      function room(n) { if (y + n > H - 20) { doc.addPage(); y = 20; } }
      function para(t, sz, ind, st2, g) { f(st2 || 'normal', sz || 10, g); var ls = doc.splitTextToSize(pdfSafe(t), W - 2 * Mg - (ind || 0)); room(ls.length * 4.6); doc.text(ls, Mg + (ind || 0), y); y += ls.length * 4.6 + 1.2; }
      function head(t) { room(14); y += 3; f('bold', 12); doc.text(pdfSafe(t), Mg, y); y += 6; }
      function bullet(t, sub) { para('- ' + t, 9.5, 0); if (sub) para(sub, 8.5, 3, 'normal', 100); }
      // Page 1: for the owner
      f('bold', 18); doc.text('AI readiness check', Mg, y); y += 7;
      para([st.hotel.name, TYPES.filter(function (t) { return t[0] === st.hotel.type; }).map(function (t) { return t[1]; })[0], st.hotel.country].filter(Boolean).join(' | '), 10, 0, 'normal', 90);
      para('Filled in by: ' + ((ROLES.filter(function (r) { return r[0] === st.hotel.role; })[0] || [0, 'not given'])[1]) + ' | ' + fmtDate(lastSnap() ? lastSnap().at : new Date().toISOString()) + ' | Stage: ' + (L.STAGES[st.stage] ? L.STAGES[st.stage].name : '-'), 9, 0, 'normal', 90);
      y += 2; para(x.name, 12, 0, 'bold'); para(x.deptName + ' | ' + typeName(x) + ' tool | ' + x.int + ' effort', 9, 0, 'normal', 90);
      y += 3; f('bold', 15); doc.text(pdfSafe(lv.name), Mg, y); y += 6;
      para(e.counts.met + ' of ' + e.counts.gates + ' must-haves met | ' + e.counts.known + ' of ' + e.counts.asked + ' questions answered | ' + e.actions.length + ' open items', 9.5, 0, 'normal', 60);
      L.summary(e, st.stage).forEach(function (t) { para(t, 10); });
      if (st.owner.ask || st.owner.cost || st.owner.by) {
        head('The request (entered by the hotel)');
        if (st.owner.ask) para('Approval asked for: ' + st.owner.ask, 10);
        if (st.owner.cost) para('Estimated cost: ' + st.owner.cost, 10);
        if (st.owner.by) para('Decision needed by: ' + fmtDate(st.owner.by), 10);
      }
      var cond = e.actions.filter(function (a) { return a.group === 'must' || a.group === 'vendor' || (a.group === 'find' && a.must); });
      if (cond.length) { head('Open conditions'); cond.forEach(function (a) { bullet(a.text, L.WHO[a.who]); }); }
      head('Six areas');
      L.AK.forEach(function (a) {
        var r = e.area[a]; if (!r.asked) return; room(7);
        f('normal', 9.5); doc.text(pdfSafe(r.name), Mg, y); doc.setFillColor(230, 230, 226); doc.rect(Mg + 52, y - 3, 90, 3.6, 'F');
        if (r.pct != null) { var c = r.pct < L.LOW ? [163, 57, 42] : r.pct < L.HIGH ? [126, 87, 0] : [31, 111, 67]; doc.setFillColor(c[0], c[1], c[2]); doc.rect(Mg + 52, y - 3, Math.max(1, r.pct * 90), 3.6, 'F'); }
        doc.text(pdfSafe((r.pct == null ? 'not known' : pct(r.pct)) + '  (' + r.known + '/' + r.asked + ' answered)'), Mg + 146, y); y += 6.5;
      });
      if (st.next.when) para('Next look: ' + nextText(st.next), 9.5, 0, 'bold');
      // Page 2+: working pages
      doc.addPage(); y = 20;
      head('Action plan');
      GROUPS.forEach(function (g) {
        var items = e.actions.filter(function (a) { return a.group === g[0]; }); if (!items.length) return;
        para(g[1] + ' (' + items.length + ')', 10.5, 0, 'bold');
        items.forEach(function (a) { bullet(a.text, L.WHO[a.who] + (a.area ? ' | ' + a.area : '') + (a.must ? ' | must-have' : '')); });
        y += 1;
      });
      head('Must-haves');
      e.gates.forEach(function (g) {
        var p2 = String(st.P[g.q.code] || '').trim();
        bullet(g.q.q + ' [' + (g.met ? 'met' : g.known ? 'not met' : 'not known yet') + ']', g.met ? (st.A[g.q.code] === 'none' ? "Doesn't apply: " + g.q.none : 'Proof (self-declared): ' + p2) : 'What counts as Yes: ' + (g.q.yes || '-'));
      });
      head('Questions for the vendor'); vq.forEach(function (q, i) { para((i + 1) + '. ' + q, 9.5); });
      if (lg) {
        head('Legal: items to check (provisional)');
        para('Label from the team\'s AI Register, awaiting legal sign-off: ' + lg.name + '. ' + (lg.why || lg.short), 9.5);
        lg.items.forEach(function (i) { bullet(i.text, i.who + (i.from ? ' | from ' + fmtDate(i.from) : '')); });
        if (lg.labour) para(lg.labour, 9);
        para(lg.country, 9);
      }
      head('How this was worked out');
      e.steps.forEach(function (t) { para(t, 9); });
      para('Thresholds and must-haves are the project team\'s judgement, not yet tested with hotels. Answers and proof lines are self-declared and not checked.', 9, 0, 'normal', 90);
      var n = doc.getNumberOfPages();
      for (var i = 1; i <= n; i++) { doc.setPage(i); f('normal', 7.5, 120); doc.text(pdfSafe('AI readiness check (student prototype), EHL SBP Group 36 for HFTP. Self-assessment, not legal or investment advice.'), Mg, H - 12); doc.text(pdfSafe('Rules ' + L.RULES + '. Answers and proof lines are self-declared.'), Mg, H - 8); doc.text('Page ' + i + ' of ' + n, W - Mg, H - 8, { align: 'right' }); }
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
    var html = st.step === 'start' ? vStart() : st.step === 'prep' ? vPrep() : st.step === 'review' ? vReview() : st.step === 'result' ? vResult() : vStep(st.step);
    var v = $('view');
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
    ui.confirm = F.confirmNext(ui.confirm, 'nav').c; ui.file = null; ui.choosing = false;
    st.step = step; if (step === 'result') takeSnap(); else keep();
    try { history[replace ? 'replaceState' : 'pushState']({ rc: step, id: st.id }, ''); } catch (e) { /* ignore */ }
    render(); try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } $('view').focus({ preventScroll: true });
  }
  function flowCtx() { var t = !!M.UI[st.useId]; return { tool: t, ready: !!(t && st.hotel.type && st.stage && !ui.choosing) }; }
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
    ui.confirm = null; ui.file = null; ui.choosing = false;
    st.step = F.safeStep(rc, flowCtx()); if (st.step === 'result') takeSnap(); else keep(); render();
  });
  function openCheck(id, step) { var r = openable(id) && fromRecord(mine[id]); if (!r) { toast('This check cannot be opened here.'); return; } st = r; go(step); }
  var START_HINT = 'Choose how the hotel is run, a tool and where you are with it.';
  function updateStartButton() {
    var b = $('go-prep'); if (!b) return; var ok = flowCtx().ready;
    b.disabled = !ok; var hnt = $('go-hint'); if (hnt) hnt.textContent = ok ? '' : START_HINT;
  }
  var ACT_EVENT = { prep: 'prep', begin: 'begin', back: 'back', next: 'next', 'to-result': 'result', edit: 'edit', review: 'review' };
  function confirmed(kind, id) { var r = F.confirmNext(ui.confirm, 'yes', kind, id); ui.confirm = r.c; return r.fire; }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b || b.disabled) return;
    var a = b.getAttribute('data-act'), id = b.getAttribute('data-id');
    if (ACT_EVENT[a]) { send(ACT_EVENT[a]); return; }
    if (a === 'pick') {
      if (!M.UI[id]) return;
      if (st.useId && st.useId !== id && Object.keys(st.A).length) { st = Object.assign(blank(), { hotel: st.hotel, stage: st.stage }); toast('New tool, new check. The earlier one stays in “Your checks”.'); }
      st.useId = id; ui.choosing = false; keep(); render();
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
      if (st.id === id) { var h0 = st.hotel; st = blank(); st.hotel = h0; }
      keep(); render(); toast('Removed from this browser.');
    }
    else if (a === 'new') { if (st.step === 'result') { ui.confirm = F.confirmNext(ui.confirm, 'ask', 'new').c; render(); } }
    else if (a === 'new-yes') {
      if (!confirmed('new') || st.step !== 'result') { render(); return; }
      var h = st.hotel; st = blank(); st.hotel = h; go('start');
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
      ui.pdf = true; toast('Preparing the report…');
      var name = 'AI-readiness-check_' + fileBase() + '.pdf';
      makePdf().then(function (blob) { ui.pdf = false; saveFile(name, blob, 'pdf'); }, function () { ui.pdf = false; toast('The PDF could not be made here. Use “Copy a note for the owner” instead.'); });
    }
    else if (a === 'share') shareSend('share');
    else if (a === 'unshare') shareSend('withdraw');
  });
  /* SHARE machine (F.shareNext). The answer may arrive after the person has moved to another check, so the
     result is written to the check it was sent for (patch), not to whatever is open by then. */
  function patch(id, fn) {
    if (st.id === id) { fn(st); keep(); if (st.step === 'result') render(true); return; }
    var r = mine[id]; if (r) { fn(r); lset(MY, mine); }
  }
  function shareSend(ev) {
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
    if (el.hasAttribute('data-q')) { var k = el.getAttribute('data-q'); st.A[k] = el.value; keep(); render(true); }
    else if (el.hasAttribute('data-stage')) { st.stage = el.value; keep(); render(true); }
    else if (el.hasAttribute('data-who')) { st.Who[el.getAttribute('data-who')] = el.value; keep(); }
    else if (el.tagName === 'SELECT' && el.hasAttribute('data-h')) { st.hotel[el.getAttribute('data-h')] = el.value; keep(); updateStartButton(); }
    else if (el.hasAttribute('data-n')) { st.next[el.getAttribute('data-n')] = el.value; keep(); }
    else if (el.hasAttribute('data-o') && el.type === 'date') { st.owner.by = el.value; keep(); }
    else if (el.hasAttribute('data-share')) { if (sharePhase() === 'sending' || sharePhase() === 'withdrawing') { el.checked = st.share.named; return; } st.share.named = el.checked; keep(); render(true); }
    else if (el.id === 'dept') { st.dept = el.value; var pl = $('picklist'); if (pl) pl.innerHTML = pickList((st.q || '').trim().toLowerCase()); }
    else if (el.id === 'loadfile' && el.files && el.files[0]) loadRecord(el.files[0]);
  });
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.id === 'q') { st.q = el.value; var pl = $('picklist'); if (pl) pl.innerHTML = pickList(el.value.trim().toLowerCase()); }
    else if (el.hasAttribute('data-h')) { st.hotel[el.getAttribute('data-h')] = el.value; keep(); }
    else if (el.hasAttribute('data-o')) { st.owner[el.getAttribute('data-o')] = el.value; keep(); }
    else if (el.hasAttribute('data-proof')) { st.P[el.getAttribute('data-proof')] = el.value; keep(); var w = el.closest('fieldset').querySelector('.warnline'); if (w) w.hidden = L.proofOk(el.value); }
  });

  /* STORE machine (src/store.js): 'idle' → 'probing' → 'shared' | 'local'. The share panel says which, once known. */
  S.ready().then(function () { document.body.setAttribute('data-store', S.state()); if (st.step === 'result') render(true); });
  adoptProfile();
  /* Coming from the AI Register: #use=<use id> starts a check for that tool. */
  function fromHash() {
    var m = /(?:^|[#&])use=([a-z]+-\d+)/.exec(location.hash || ''); if (!m || !M.UI[m[1]]) return;
    if (st.useId !== m[1]) { var h0 = st.hotel; st = blank(); st.hotel = h0; adoptProfile(); st.useId = m[1]; }
    ui.confirm = null; ui.file = null; ui.choosing = false;
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
               snaps: (st.snaps || []).length, checks: Object.keys(mine).filter(openable) };
    },
    record: function () { return JSON.parse(JSON.stringify(st)); },
    send: send,
    events: function () { return Object.keys((F.FLOW[st.step] || {})).filter(function (k) { return F.flowNext(st.step, k, flowCtx()) !== null; }); },
    model: M
  };
})();
