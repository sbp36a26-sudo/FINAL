/* Hotel AI Register: page code (state, views, exports). All legal wording comes from the embedded data. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function data(id) { return JSON.parse($(id).textContent); }
  var REF = data('d-ref'), LAB = data('d-labels'), RADAR = data('d-radar'), CAT = data('d-cat'), NAT = data('d-national');
  var L = window.RegLogic, M = window.RegMachines;
  var USES = {}; LAB.uses.forEach(function (u) { USES[u.id] = u; });
  var DEPTS = {}; CAT.depts.forEach(function (d) { DEPTS[d.id] = d; });
  var COUNTRY = {}; REF.countries.forEach(function (c) { COUNTRY[c[0]] = c[1]; });
  var KEY = 'hftp-ai-register-v1';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var LABEL_ORDER = ['prohibited', 'banif', 'high', 'highif', 'transparency', 'transif', 'minimal', 'outside', 'notai', 'open'];
  var TODAY = isoDay(new Date());

  // ---------- small helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function isoDay(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function fmtDate(iso) { if (!iso) return ''; var p = iso.split('-'); return (+p[2]) + ' ' + MONTHS[+p[1] - 1] + ' ' + p[0]; }
  function daysUntil(iso) { var a = iso.split('-'), b = TODAY.split('-'); return Math.round((Date.UTC(+a[0], +a[1] - 1, +a[2]) - Date.UTC(+b[0], +b[1] - 1, +b[2])) / 86400000); }
  function away(iso) { var d = daysUntil(iso); return d > 0 ? d + ' day' + (d === 1 ? '' : 's') + ' away' : ''; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function regNo(t) { return 'R-' + pad(t.no || 0); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  function opt(v, label, cur) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(label) + '</option>'; }
  function chip(label, big) { var d = REF.labels[label] || REF.labels.open; return '<span class="lb lb-' + label + (big ? ' big' : '') + '">' + esc(d.name) + '</span>'; }
  function kindChip(it) {
    var k = REF.kinds[it.kind] || { name: it.kind }, name = k.name;
    if (nonEU() && (it.kind === 'duty' || it.kind === 'maker')) name = 'For reference (EU)';
    return '<span class="kd kd-' + esc(it.kind) + '">' + esc(name) + (it.kind === 'law' && it.tag ? ' · ' + esc(it.tag) : '') + '</span>';
  }
  function refText(r) {
    if (!r || (state.hotel.country !== 'CH' && state.hotel.country !== 'GB') || !/^GDPR/.test(r)) return r;
    return (state.hotel.country === 'CH' ? 'revFADP' : 'UK GDPR') + ' (EU ' + r + ' where GDPR Art. 3(2) applies)';
  }
  function diffBox(d) {
    if (!d || !ui.reviewer) return '';
    return '<div class="diff"><p><span class="kd kd-diff">Differs from the booklet</span></p><p><strong>Booklet:</strong> ' + esc(d.booklet) + '</p><p><strong>AI Act text:</strong> ' + esc(d.law) + '</p></div>';
  }
  function basisName(b) { return (REF.basis[b] || { name: '' }).name; }

  // ---------- state ----------
  var mem = { ok: true };
  var REVIEWER_KEY = 'hftp-ai-register-reviewer';
  /* ui.route and ui.dialog are the two explicit machines of this page (src/machines.js, CLEANUP.md).
     Only setRoute() writes ui.route and only send() writes ui.dialog. The other ui fields are view filters. */
  var ui = { reviewer: (function () { try { return window.localStorage.getItem(REVIEWER_KEY) === '1'; } catch (e) { return false; } })(), whoFilter: '', q: '', fLabel: '', pickQ: '', pickDept: '', showDone: false,
             route: M.route('how'), dialog: { name: 'none' }, unreadable: null };
  function isConfirm(kind) { return ui.dialog.name === 'confirm' && ui.dialog.kind === kind; }
  var state;

  function blank() { return { v: 1, example: false, hotel: { name: '', country: '', model: '', group: '', reps: '', size: '', outlets: [], keeper: '' }, tools: [], checks: {}, seq: 0, updatedAt: null, seenOn: '' }; }
  function newTool(s, useId) {
    var u = USES[useId] || USES.custom;
    return { id: 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7), no: ++s.seq, useId: u.id, name: u.triage ? '' : u.name.replace(/\s*\(.*$/, ''),
             vendor: '', dept: u.dept || '', where: '', origin: 'vendor', decided: '', owner: '', since: '', notes: '', answers: {}, done: {}, vq: {}, notAI: '', notAIConfirmed: '', createdAt: new Date().toISOString() };
  }
  function normalise(o) {
    var s = blank(), k;
    s.example = !!o.example; s.seq = +o.seq || 0; s.updatedAt = o.updatedAt || null; s.seenOn = typeof o.seenOn === 'string' ? o.seenOn : ''; s.checks = o.checks && typeof o.checks === 'object' ? o.checks : {};
    for (k in s.hotel) if (o.hotel && o.hotel[k] != null) s.hotel[k] = o.hotel[k];
    if (!Array.isArray(s.hotel.outlets)) s.hotel.outlets = [];
    (o.tools || []).forEach(function (t) {
      if (!t || typeof t !== 'object') return;
      var mv = (LAB.meta.moved || {})[t.useId]; if (mv && !USES[t.useId]) t.useId = mv;
      var n = newTool({ seq: 0 }, USES[t.useId] ? t.useId : 'custom');
      for (k in n) if (t[k] != null && k !== 'useId') n[k] = t[k];
      /* ids are compared as strings (data-id); a number or a duplicate would make a tool impossible to open */
      if (typeof n.id !== 'string' || !n.id || s.tools.some(function (x) { return x.id === n.id; })) n.id = newTool({ seq: 0 }, 'custom').id;
      ['answers', 'done', 'vq'].forEach(function (f) { if (!n[f] || typeof n[f] !== 'object') n[f] = {}; });
      if (!n.no) n.no = ++s.seq; else if (n.no > s.seq) s.seq = n.no;
      s.tools.push(n);
    });
    return s;
  }
  /* Start-up read. A register this build cannot read (damaged, or saved by a newer version) is copied to its own key
     and shown in a note, so the example that replaces it never overwrites it silently. */
  function load() {
    var raw;
    try { raw = window.localStorage.getItem(KEY); } catch (e) { mem.ok = false; return null; }
    var r = M.readStored(raw);
    if (r.status === 'ok') return normalise(r.data);
    if (r.status === 'unreadable') {
      var keep = KEY + '-unreadable-' + Date.now();
      try { window.localStorage.setItem(keep, raw); } catch (e) { keep = ''; }
      ui.unreadable = { key: keep, raw: raw, reason: r.reason };
    }
    return null;
  }
  function unreadableNote() {
    var u = ui.unreadable; if (!u) return '';
    return '<div class="note stop" id="unreadable"><p><strong>A register saved in this browser could not be opened</strong> (' + (u.reason === 'newer' ? 'it was made by a newer version of this page' : 'the saved data is damaged') + '). ' +
      (u.key ? 'It is kept unchanged in this browser. ' : '') + 'Download it before you go on, and send it to the project team if you need it back.</p>' +
      '<div class="btnrow"><button type="button" class="btn" data-act="unreadable-save">Download it</button><button type="button" class="btn sm" data-act="unreadable-hide">Hide</button></div></div>';
  }
  var saveTimer = null;
  /* One hotel profile shared with the Readiness check in this browser (key hftp-hotel-profile-v1).
     The register keeps country as a code and the operating model; the readiness check derives its own "how the hotel is run". */
  var PROFILE = 'hftp-hotel-profile-v1';
  function readProfile() { try { return JSON.parse(window.localStorage.getItem(PROFILE) || 'null'); } catch (e) { return null; } }
  function writeProfile() {
    var H = state.hotel; if (state.example) return;
    var p = readProfile() || {};
    ['name', 'country', 'model', 'group', 'reps', 'size'].forEach(function (k) { if (H[k] != null) p[k] = H[k]; });
    p.type = H.model === 'managed' || H.model === 'franchised' ? 'managed' : H.group === 'yes' ? 'group' : H.model ? 'independent' : p.type || '';
    p.updatedAt = new Date().toISOString(); p.from = 'register';
    try { window.localStorage.setItem(PROFILE, JSON.stringify(p)); } catch (e) { /* ignore */ }
  }
  function adoptProfile(s) {
    var p = readProfile(); if (!p || s.example) return false;
    var H = s.hotel, took = false;
    ['name', 'country', 'model', 'group', 'reps', 'size'].forEach(function (k) { if (!H[k] && p[k]) { H[k] = p[k]; took = true; } });
    if (!H.model && p.type === 'managed') { H.model = 'managed'; took = true; }
    if (!H.group && p.type === 'group') { H.group = 'yes'; took = true; }
    return took;
  }
  function persist() {
    clearTimeout(saveTimer); saveTimer = null;
    state.updatedAt = new Date().toISOString();
    writeProfile();
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); mem.ok = true; } catch (e) { mem.ok = false; }
    paintSaved();
  }
  function persistSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(persist, 400); }
  /* Typing is saved 400 ms after the last key; leaving or reloading the page saves at once. */
  function flushSave() { if (saveTimer) persist(); }
  /* Every replacement of the whole register (start empty, clear, example, backup, #add= link) goes through here.
     A real register first takes the shared hotel profile's filled fields, so persist() never writes blanks over them. */
  function replaceRegister(next) {
    clearTimeout(saveTimer); saveTimer = null;
    if (!next.example) adoptProfile(next);
    state = next; persist();
  }

  function example() {
    var s = blank(); s.example = true;
    s.hotel = { name: 'Seeblick Hotel (fictional example)', country: 'DE', model: 'managed', group: 'yes', reps: 'yes', outlets: ['restaurant', 'bar', 'kitchen', 'banqueting'], keeper: 'General manager' };
    function add(useId, name, o) { var t = newTool(s, useId), k; t.name = name; for (k in o) t[k] = o[k]; s.tools.push(t); }
    add('gx-2', 'Guest chat on the website and WhatsApp', { vendor: 'Example vendor A', owner: 'Front office manager', where: 'Front office', answers: { card_data: 'no' }, done: { C1: 1, L1: 1 }, vq: { 1: 1, 2: 1, 3: 1, 4: 1, 6: 1 } });
    add('res-1', 'Phone agent for reservation calls', { vendor: 'Example vendor B', owner: 'Reservations manager', answers: { emo_guest: 'no', voiceprint: 'no', card_data: 'yes' }, done: { C1: 1 } });
    add('rm-2', 'Revenue management system', { vendor: 'Example vendor C', owner: 'Revenue manager', decided: 'brand', answers: { exploit_price: 'no', personal_price: 'no', competitor_data: 'unsure' }, done: { L1: 1 } });
    add('hr-1', 'Rota and shift planning', { vendor: 'Example vendor D', owner: 'HR manager', answers: { rank_staff: 'yes', hours_leave: 'no' } });
    add('hr-2', 'Recruiting and CV screening', { vendor: 'Example vendor E', owner: 'HR manager', decided: 'brand', answers: { emo_staff: 'no' }, done: { GA1: 1 } });
    add('hk-6', 'Housekeeping room assignment', { vendor: 'Example vendor F', origin: 'bundled' });
    add('res-8', 'Call scoring for the reservations team', { vendor: 'Example vendor B', owner: 'Reservations manager', origin: 'update', answers: { emo_staff: 'yes' } });
    add('kc-1', 'Food-waste camera in the main kitchen', { vendor: 'Example vendor G', owner: 'Executive chef', where: 'Kitchen', answers: { judge_staff: 'no' }, done: { LB1: 1, GD1: 1, L1: 1 } });
    add('fb-6', 'Table-booking phone agent for the restaurant', { vendor: 'Example vendor H', owner: 'F&B manager', where: 'Restaurant', answers: { card_data: 'no' } });
    add('gm-2', 'General AI assistant used by staff', { origin: 'shadow', answers: { paste_data: 'yes' } });
    add('sm-4', 'AI images for marketing', { vendor: 'Example agency', owner: 'Marketing manager', answers: { ai_image: 'no' } });
    return s;
  }

  function toolById(id) { for (var i = 0; i < state.tools.length; i++) if (state.tools[i].id === id) return state.tools[i]; return null; }
  function ctx(t) {
    var u = USES[t.useId] || USES.custom, c = L.classify(u, t, REF), items = L.items(u, t, state.hotel, REF, c);
    /* AI literacy is one hotel-wide measure: ticking it under "Five things to do now" (S5) covers every tool. */
    if (state.checks && state.checks.S5) items.forEach(function (it) { if (it.id === 'L1') it.done = true; });
    return { t: t, u: u, c: c, items: items };
  }
  function isNow(it) { return !it.when || it.when <= TODAY; }
  function nonEU() { return ['CH', 'GB', 'NO', 'IS', 'LI'].indexOf(state.hotel.country) >= 0; }

  // ---------- header bits ----------
  function paintSaved() {
    var el = $('saved'); if (!el) return;
    if (!mem.ok) { el.className = 'bad'; el.textContent = 'Not saved: this browser blocks storage. Download a backup to keep your work.'; return; }
    el.className = '';
    var t = state.updatedAt ? new Date(state.updatedAt) : null;
    el.textContent = 'Saved in this browser only' + (t ? ' · ' + pad(t.getHours()) + ':' + pad(t.getMinutes()) : '') + '. Download a backup to keep or share it.';
  }
  var toastTimer = null;
  function toast(msg) { var el = $('toast'); el.textContent = msg; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 4200); }

  // ---------- view: register list ----------
  function summary(rows) {
    var by = {}, now = 0, later = {}, open = 0, seen = {};
    rows.forEach(function (x) {
      by[x.c.label] = (by[x.c.label] || 0) + 1;
      if (x.c.open.length) open++;
      x.items.forEach(function (it) {
        if (it.done) return;
        /* hotel-wide items count once; vendor items once per vendor */
        var key = it.scope === 'hotel' ? 'h:' + it.id : it.scope === 'vendor' ? 'v:' + ((x.t.vendor || '').trim() || x.t.id) + ':' + it.id : null;
        if (key) { if (seen[key]) return; seen[key] = 1; }
        if (isNow(it)) now++; else later[it.when] = (later[it.when] || 0) + 1;
      });
    });
    return { by: by, now: now, later: later, open: open };
  }
  function summaryText(s) {
    var parts = [plural(s.now, 'item') + ' to check now'];
    Object.keys(s.later).sort().forEach(function (d) { parts.push(s.later[d] + ' before ' + fmtDate(d) + ' (' + away(d) + ')'); });
    if (s.open) parts.push(plural(s.open, 'tool') + ' with open questions');
    return parts.join(' · ');
  }
  function hotelLine() {
    var H = state.hotel, bits = [];
    if (H.country) bits.push(COUNTRY[H.country] || H.country);
    REF.operatingModels.forEach(function (m) { if (m.id === H.model) bits.push(m.name); });
    if (H.outlets.length) bits.push(H.outlets.map(function (o) { var n = o; REF.outlets.forEach(function (d) { if (d.id === o) n = d.name; }); return n; }).join(', '));
    return bits.join(' · ');
  }
  function exampleNote() {
    if (!state.example) return '';
    if (isConfirm('own')) return confirmBox('own', 'Remove the example hotel and start with an empty register?', 'Start empty');
    return '<div class="note"><p><strong>This is an example.</strong> Seeblick Hotel is fictional and its tools are made up, so you can see how the register works. Nothing here describes a real hotel or vendor.</p>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="start-own">Start my own register</button></div></div>';
  }
  function reachNote() {
    if (!nonEU()) return '';
    return '<div class="note warn"><p>' + esc(REF.countryChecks[state.hotel.country].reach) + '</p></div>';
  }
  function confirmBox(kind, text, yes) {
    if (!isConfirm(kind)) return '';
    return '<div class="note stop" id="confirm"><p>' + esc(text) + '</p><div class="btnrow"><button type="button" class="btn warn" data-act="confirm-yes" id="confirm-yes">' + esc(yes) + '</button><button type="button" class="btn" data-act="confirm-no">Cancel</button></div></div>';
  }
  function copyBox() {
    if (ui.dialog.name !== 'copy') return '';
    return '<div class="panel copybox"><div class="ph"><h3>' + esc(ui.dialog.title) + '</h3><button type="button" class="btn sm" data-act="copy-close">Close</button></div><p class="meta">Select all of the text and copy it.</p><textarea id="copy-text" readonly>' + esc(ui.dialog.text) + '</textarea></div>';
  }
  function exportBar() {
    return '<div class="btnrow" role="group" aria-label="Download"><button type="button" class="btn" data-act="export" data-kind="pdf">Download PDF</button><button type="button" class="btn" data-act="export" data-kind="csv">Download CSV</button><button type="button" class="btn" data-act="export" data-kind="json">Download backup</button></div>';
  }

  function vList() {
    var H = state.hotel, rows = state.tools.map(ctx), s = summary(rows), h = sinceBox();
    h += exampleNote();
    if (!rows.length) {
      h += '<section class="panel empty"><h2>Start your register</h2><ol class="steps">' +
        '<li><strong>Describe your hotel.</strong> Country and operating model decide which national rules and contract notes you see.</li>' +
        '<li><strong>Add the AI tools you use.</strong> Pick each one from 99 hotel use cases in 15 departments, or describe your own.</li>' +
        '<li><strong>Work through the items to check.</strong> Each tool gets its label, what to check and by when, and a named person.</li></ol>' +
        '<div class="btnrow"><button type="button" class="btn primary" data-act="add">Add your first tool</button><button type="button" class="btn" data-act="tab" data-tab="hotel">Describe your hotel</button><button type="button" class="btn" data-act="example">Load the example hotel</button></div>' +
        confirmBox('example', 'Replace the current register with the fictional example hotel?', 'Load the example') + '</section>';
      return h;
    }
    h += '<section class="band"><div class="who"><h2>' + esc(H.name || 'Your hotel') + '</h2><p class="meta">' +
      (hotelLine() ? esc(hotelLine()) + ' · ' : 'Country and operating model not set · ') + '<button type="button" class="linkbtn" data-act="tab" data-tab="hotel">' + (hotelLine() ? 'Edit' : 'Describe your hotel') + '</button></p></div>' +
      '<div class="counts" role="group" aria-label="Filter by label">';
    LABEL_ORDER.forEach(function (lb) {
      if (!s.by[lb]) return;
      h += '<button type="button" class="lb lb-' + lb + '" data-act="flt" data-label="' + lb + '" aria-pressed="' + (ui.fLabel === lb) + '">' + esc(REF.labels[lb].name) + '<span class="n">' + s.by[lb] + '</span></button>';
    });
    h += '</div></section>';
    h += reachNote();
    h += '<p class="sub"><strong>' + plural(rows.length, 'tool') + '.</strong> ' + esc(summaryText(s)) + '.</p>';
    h += '<div class="bar"><button type="button" class="btn primary" data-act="add">Add a tool</button>' +
      '<label class="grow"><span class="sr">Search the register</span><input type="search" id="q-list" data-q="list" placeholder="Search by tool, vendor or person" value="' + esc(ui.q) + '"></label>' + exportBar() + '</div>';
    h += copyBox();
    var q = ui.q.trim().toLowerCase();
    var shown = rows.filter(function (x) {
      if (ui.fLabel && x.c.label !== ui.fLabel) return false;
      if (!q) return true;
      return [x.t.name, x.u.name, x.t.vendor, x.t.owner, x.t.where, (DEPTS[x.t.dept] || {}).name].join(' ').toLowerCase().indexOf(q) >= 0;
    });
    h += '<section class="panel flush"><div class="row head" aria-hidden="true"><div>Tool</div><div>Label</div><div>Your role</div><div>Responsible</div><div>To check</div></div><ul class="rows">';
    shown.forEach(function (x) { h += listRow(x); });
    h += '</ul>';
    if (!shown.length) h += '<p class="meta" style="padding:16px 18px">No tool matches. <button type="button" class="linkbtn" data-act="clear-flt">Show all tools</button></p>';
    h += '</section>';
    if (ui.fLabel || q) h += '<p class="meta">Showing ' + shown.length + ' of ' + rows.length + '. <button type="button" class="linkbtn" data-act="clear-flt">Show all tools</button></p>';
    return h;
  }
  function labelCell(x) {
    var c = x.c, h = chip(c.label);
    if (c.alsoTransparency) h += chip('transparency');
    if (c.canProhibit) h += '<span class="flagc">Can become prohibited</span>';
    if (x.u.provisional) h += '<span class="kd kd-practice">Provisional</span>';
    if (x.u.diff && ui.reviewer) h += '<span class="kd kd-diff">Differs from booklet</span>';
    return h;
  }
  function listRow(x) {
    var t = x.t, open = x.items.filter(function (i) { return !i.done; }), now = open.filter(isNow).length;
    var todo = open.length ? plural(open.length, 'item') + ' open' + (now ? ', ' + now + ' now' : '') : reviewedText(x);
    if (x.c.open.length) todo += ' · ' + plural(x.c.open.length, 'question') + ' open';
    var sub = [];
    if (DEPTS[t.dept]) sub.push(DEPTS[t.dept].name);
    if (t.vendor) sub.push(t.vendor);
    return '<li class="row"><div class="c-tool"><span class="no">' + regNo(t) + '</span><button type="button" class="linkbtn name" data-act="open" data-id="' + esc(t.id) + '">' + esc(t.name || 'Unnamed tool') + '</button><span class="meta">' + esc(sub.join(' · ')) + '</span></div>' +
      '<div class="c-label">' + labelCell(x) + '</div>' +
      '<div data-l="Your role">' + (x.c.label === 'notai' ? '<span class="meta">n/a</span>' : x.c.role === 'maker' ? 'Maker' : 'User') + '</div>' +
      '<div data-l="Responsible">' + (t.owner ? esc(t.owner) : '<span class="miss">Not named</span>') + '</div>' +
      '<div data-l="To check">' + esc(todo) + '</div></li>';
  }

  function reviewedText(x) {
    var last = ''; Object.keys(x.t.done || {}).forEach(function (k) { var v = x.t.done[k]; if (typeof v === 'string' && v > last) last = v; });
    return 'Items marked as reviewed' + (x.t.owner ? ' by ' + x.t.owner : '') + (last ? ' on ' + fmtDate(last) : '');
  }

  /* Everyday words people search with, mapped to the words the catalogue uses. */
  var SYN = { 'channel manager': ['channel'], 'smart alert': ['video', 'camera', 'sensor', 'alert'], 'smart alerts': ['video', 'camera', 'sensor', 'alert'],
    chatgpt: ['gpt', 'genai', 'general ai assistant', 'copilot'], copilot: ['assistant', 'copilot', 'genai'], rota: ['schedul', 'rota', 'roster', 'shift'], roster: ['schedul', 'roster', 'shift'],
    camera: ['video', 'cctv', 'camera'], cctv: ['video', 'cctv', 'camera'], pms: ['pms', 'front-desk', 'front desk', 'property management', 'check-in'], chatbot: ['chat', 'messag', 'assistant'],
    whatsapp: ['whatsapp', 'messag', 'chat'], cv: ['recruit', 'cv', 'applicant'], hiring: ['recruit', 'hiring', 'applicant'], pricing: ['pric', 'rate', 'revenue'], 'food waste': ['waste'] };
  function searchTerms(q) {
    var terms = [];
    Object.keys(SYN).forEach(function (k) { if (k.indexOf(' ') > 0 && q.indexOf(k) >= 0) { terms.push(SYN[k]); q = q.replace(k, ' '); } });
    q.split(/\s+/).filter(Boolean).forEach(function (w) { terms.push([w].concat(SYN[w] || [])); });
    return terms;
  }

  // ---------- view: add a tool ----------
  function vPick() {
    var q = ui.pickQ.trim().toLowerCase(), have = {};
    state.tools.forEach(function (t) { have[t.useId] = true; });
    function match(u) {
      if (u.picker === false) return false;
      if (ui.pickDept && u.dept !== ui.pickDept) return false;
      if (!q) return true;
      var cu = CAT.uses[u.id] || {};
      var hay = [u.name, u.kw || '', cu.task || '', (DEPTS[u.dept] || {}).name || ''].join(' ').toLowerCase();
      return searchTerms(q).every(function (alts) { return alts.some(function (w) { return hay.indexOf(w) >= 0; }); });
    }
    function row(u) {
      var cu = CAT.uses[u.id] || {}, c = L.classify(u, {}, REF);
      return '<button type="button" class="pick" data-act="pick" data-id="' + esc(u.id) + '"><span class="pn">' + esc(u.name) + '</span>' +
        '<span class="pr">' + chip(c.label) + (have[u.id] ? '<span class="meta">In your register</span>' : '') + '</span>' +
        '<span class="meta">' + esc(cu.taskPublic || u.why || '') + (cu.use ? ' · How common in hotels (team estimate, Nov 2026): ' + esc(cu.use.toLowerCase()) : '') + '</span></button>';
    }
    var h = '<p><button type="button" class="linkbtn" data-act="back">← Back to the register</button></p>' +
      '<div class="band"><div class="who"><h2>Add a tool</h2><p class="sub">Pick the closest match. You can rename it afterwards, and the questions on the next page settle its label.</p></div>' +
      '<button type="button" class="btn" data-act="pick" data-id="custom">My tool is not in the list</button></div>' +
      '<div class="bar"><label class="grow"><span class="sr">Search use cases</span><input type="search" id="q-pick" data-q="pick" placeholder="Search, for example chatbot, rota, camera, pricing, ChatGPT" value="' + esc(ui.pickQ) + '"></label>' +
      '<label><span class="sr">Department</span><select id="pick-dept" data-pick="dept">' + opt('', 'All departments', ui.pickDept) + CAT.depts.map(function (d) { return opt(d.id, d.name, ui.pickDept); }).join('') + '</select></label></div>';
    var any = false, body = '';
    CAT.depts.forEach(function (d) {
      var us = LAB.uses.filter(function (u) { return u.n && u.dept === d.id && match(u); });
      if (!us.length) return;
      any = true;
      body += '<div class="pickg"><h3>' + esc(d.name) + '</h3>' + us.map(row).join('') + '</div>';
    });
    var ex = LAB.uses.filter(function (u) { return u.provisional && match(u); });
    if (ex.length) {
      any = true;
      body += '<div class="pickg"><h3>Also seen in the market, not yet in the catalogue</h3><p class="meta" style="padding:0 18px 10px">Found by desk research on 17 Nov 2026 in vendor material and trade press. Their labels are provisional and not yet reviewed by the team.</p>' + ex.map(row).join('') + '</div>';
    }
    if (!any) body = '<p class="meta" style="padding:18px">Nothing matches. Try another word, or use "My tool is not in the list".</p>';
    return h + '<section class="panel flush">' + body + '</section>';
  }

  // ---------- view: one tool ----------
  function dateLine(c) {
    var D = REF.dates;
    if (c.label === 'prohibited') return 'Banned since ' + fmtDate(D.bans);
    if (c.label === 'high') { var d = c.onlyProduct ? D.products : D.highrisk; return daysUntil(d) > 0 ? 'Duties apply from ' + fmtDate(d) + ' (' + away(d) + ')' : 'Duties apply since ' + fmtDate(d); }
    if (c.label === 'highif') return 'If it is high-risk, duties apply from ' + fmtDate(D.highrisk);
    if (c.label === 'transparency') return 'Applies since ' + fmtDate(D.transparency);
    return '';
  }
  function roleText(x) {
    var c = x.c, t = x.t, h = '';
    if (c.label === 'notai') return '';
    if (c.role === 'maker') {
      var r = REF.makerRoutes[c.route] || {};
      h += '<p><strong>Your role: maker</strong> (the law says "provider"). ' + esc(r.name ? r.name + ': ' : '') + esc(r.text || '') + (c.highUnder ? ' The maker rules for high-risk tools apply from ' + fmtDate(REF.dates.highrisk) + '.' : '') + '</p>';
    } else {
      h += '<p><strong>Your role: user</strong> (the law says "deployer"). The tool\'s maker carries most of the duties.</p>';
      if (c.routePending) h += '<p class="meta">If this tool turns out to be high-risk: ' + esc(REF.makerRoutes[c.routePending].text) + '</p>';
    }
    if (t.decided === 'brand') {
      h += '<p class="meta">Head office or the brand chose this tool. The brand may also be a user (deployer) of it, or its provider if the tool carries the brand\'s name. The franchise or management agreement should say who carries which duty (our reading).</p>';
    }
    return h;
  }
  function radios(name, cur, attr) {
    return '<div class="opts">' + [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']].map(function (o) {
      return '<label class="opt' + (cur === o[0] ? ' on' : '') + '"><input type="radio" name="' + name + '" id="' + name + '-' + o[0] + '" value="' + o[0] + '" ' + attr + (cur === o[0] ? ' checked' : '') + '>' + o[1] + '</label>';
    }).join('') + '</div>';
  }
  function effectText(d) {
    if (d.yes === 'prohibited') return 'Yes makes it prohibited';
    if (d.yes === 'high') return 'Yes makes it high-risk';
    if (d.yes === 'transparency') return 'Yes adds a transparency duty';
    return 'Does not change the label';
  }
  function questions(x) {
    var t = x.t, u = x.u, h = '';
    (u.switches || []).forEach(function (s) {
      var d = REF.switches[s.id]; if (!d) return;
      h += '<fieldset class="qa"><legend>' + esc(d.q) + '</legend>' + radios('sw-' + s.id, t.answers[s.id] || '', 'data-sw="' + esc(s.id) + '"') +
        (d.help ? '<p class="meta">' + esc(d.help) + '</p>' : '') +
        '<p class="qmeta"><span>' + esc(effectText(d)) + '</span>' + (d.prov ? '<span class="cite">' + esc(d.prov) + '</span>' : '') + (d.yes ? '<span>' + esc(basisName(d.basis)) + '</span>' : '') +
        (s.src === 'research' ? '<span class="kd kd-practice">Added from desk research, pending team review</span>' : '') + '</p></fieldset>';
    });
    if (u.base !== 'notai') {
      h += '<fieldset class="qa"><legend>Does the tool only execute rules that people wrote, with no learning or inference of its own (Art. 3(1); recital 12)?</legend>' + radios('notai', t.notAI || '', 'data-notai="1"') +
        (t.notAI === 'yes' ? '<label class="chk"><input type="checkbox" id="f-notaiok" data-notaiok="1"' + (t.notAIConfirmed === 'yes' ? ' checked' : '') + '> The vendor confirmed this in writing</label>' : '') +
        (x.c.notAIBlocked === 'blocked' ? '<p class="warnline">Not applied: an answer or an open question above can make this tool banned or high-risk, and that cannot be set aside by calling it "not AI". Settle those questions first.</p>' :
         x.c.notAIBlocked === 'needs-confirmation' ? '<p class="warnline">Not applied yet: for a tool whose questions can make it banned or high-risk, tick that the vendor confirmed it in writing.</p>' : '') +
        '<p class="meta">' + (u.mayNotBeAI ? 'Tools of this kind are often not AI. ' : '') + 'Software that runs only on hand-written rules, fixed thresholds or simple averages is not an AI system. Ask the vendor how the tool works before treating it as AI; a vendor\'s letter alone does not bind an authority.</p>' +
        '<p class="qmeta"><span>Yes means the AI Act does not apply</span><span class="cite">Art. 3(1)</span><span>' + esc(basisName('guidance')) + '</span></p></fieldset>';
    }
    return h;
  }
  function itemRow(it, id, attrs) {
    var since = it.since && it.since <= TODAY ? 'since ' + fmtDate(it.since) : '';
    return '<div class="item' + (it.done ? ' done' : '') + '"><input type="checkbox" id="' + id + '" ' + attrs + (it.done ? ' checked' : '') + (it.auto ? ' disabled' : '') + ' aria-labelledby="' + id + '-t">' +
      '<div class="itx"><span class="itt" id="' + id + '-t">' + esc(it.text) + '</span>' +
      '<span class="itm">' + kindChip(it) + (it.who ? '<span>Who can confirm: ' + esc(it.who) + '</span>' : '') + (it.ref ? '<span class="cite">' + esc(refText(it.ref)) + '</span>' : '') + (since ? '<span>' + since + '</span>' : '') + '</span>' +
      (it.note ? '<span class="itn">' + esc(/^Why:/.test(it.note) ? it.note : 'Why: ' + it.note) + '</span>' : '') +
      (it.auto === 'owner' ? '<span class="itn">Ticks itself when you name a responsible person.</span>' : it.auto === 'vendor' ? '<span class="itn">Ticks itself when every vendor question below is ticked.</span>' : '') +
      '</div></div>';
  }
  function groupItems(list) {
    var groups = [], cur = null;
    list.forEach(function (it) {
      var key = isNow(it) ? 'now' : it.when;
      if (!cur || cur.key !== key) { cur = { key: key, items: [] }; groups.push(cur); }
      cur.items.push(it);
    });
    return groups;
  }
  function groupTitle(key) { return key === 'now' ? 'Now' : 'Before ' + fmtDate(key) + ' <span class="meta">' + esc(away(key)) + '</span>'; }

  function vTool(t) {
    var x = ctx(t), u = x.u, c = x.c, lab = REF.labels[c.label] || REF.labels.open;
    var h = '<p><button type="button" class="linkbtn" data-act="back">← Back to the register</button></p>';
    h += '<div class="thead"><div class="t1"><span class="no">' + regNo(t) + '</span><label class="grow" style="flex:1"><span class="sr">Tool name</span><input type="text" class="title" id="f-name" data-f="name" value="' + esc(t.name) + '" placeholder="Name this tool"></label></div>' +
      '<p class="meta">' + esc(u.triage ? 'A tool that is not in the list' : u.name) + (DEPTS[u.dept] ? ' · ' + esc(DEPTS[u.dept].name) : '') + '</p>' +
      (u.n ? '<p><button type="button" class="linkbtn" data-act="to-readiness" data-id="' + esc(t.id) + '">Check whether the hotel is ready for this tool (Readiness check) →</button></p>' : '') + '</div>';
    h += '<div class="detail"><div>';

    // label
    if (L.maybeLegacy(t, c, REF)) h += '<div class="note legacy"><p><strong>May be a legacy tool.</strong> In use since ' + esc(fmtDate(t.since)) + ', before ' + esc(fmtDate(REF.dates.highrisk)) + ': high-risk duties apply only after a significant design change (Art. 111(2) as amended). Ask the vendor whether this model was on the market before that date and whether updates change its design.</p></div>';
    h += '<section class="panel"><h4>Label under the EU AI Act</h4><div class="lbrow">' + chip(c.label, true) + (c.alsoTransparency ? chip('transparency', true) : '') + (dateLine(c) ? '<span class="meta">' + esc(dateLine(c)) + '</span>' : '') + '</div>';
    h += '<p>' + esc(lab.short) + '</p>';
    if (c.label !== 'notai' && u.why) h += '<p>' + esc(u.why) + '</p>';
    else if (c.label === 'minimal' && !u.why) h += '<p>The briefing booklet does not name this use; everything it does not list is minimal.</p>';
    if (c.label === 'notai' && u.base === 'notai') h += '<p>' + esc(u.why) + '</p>';
    if (c.reasons.filter(function (r) { return r.effect; }).length) {
      h += '<ul class="reasons">' + c.reasons.filter(function (r) { return r.effect; }).map(function (r) {
        return '<li>' + esc(r.text) + ' <span class="cite">' + esc(r.prov) + '</span> <span class="meta">' + esc(basisName(r.basis)) + (r.research ? ' · added from desk research, pending team review' : '') + '</span></li>';
      }).join('') + '</ul>';
    }
    if (c.canProhibit) h += '<p class="flagc" style="white-space:normal">' + (c.openBan.length === 1 ? 'One open question below could make this tool prohibited' : plural(c.openBan.length, 'open question') + ' below could make this tool prohibited') + ': ' + esc(c.openBan.map(function (id) { return REF.switches[id].q; }).join(' / ')) + ' Answer ' + (c.openBan.length === 1 ? 'it' : 'them') + ' first.</p>';
    if (c.open.length && c.label !== 'notai') h += '<p class="meta">' + plural(c.open.length, 'question is', 'questions are') + ' open. "Not sure" keeps the label open and adds a "find out" item: ask the vendor.</p>';
    if (c.alsoTransparency) h += '<p class="meta">The transparency duty applies as well, whatever the answers.</p>';
    if (u.provisional) h += '<p class="meta"><span class="kd kd-practice">Provisional</span> This use is not in the team\'s catalogue of 99. It was found in vendor material and trade press on 17 Nov 2026; the label is not yet reviewed by the team.</p>';
    h += diffBox(u.diff);
    var lb = L.labelBasis(u, c, REF);
    h += '<p class="meta">Rests on: ' + esc(basisName(lb.basis)) + (lb.prov ? ' <span class="cite">' + esc(lb.prov) + '</span>' : '') + (lb.from === 'answer' ? ' (your answer)' : lb.from === 'question' ? ' (the open question)' : '') + (u.booklet ? ' · Booklet ' + esc(u.booklet) : '') + '</p>';
    h += roleText(x);
    if (nonEU()) h += '<p class="meta">' + esc(REF.countryChecks[state.hotel.country].reach) + '</p>';
    h += '</section>';

    // questions
    h += '<section class="panel"><div class="ph"><h3>Questions that decide the label</h3><span class="meta">Ask the vendor if you are not sure</span></div><div>' + questions(x) + '</div></section>';

    // items
    var done = x.items.filter(function (i) { return i.done; }).length;
    var top = x.items.filter(function (i) { return !i.done && isNow(i); }).slice(0, 3);
    h += '<section class="panel top3"><div class="ph"><h3>Top 3 for this tool</h3><span class="meta">' + done + ' of ' + x.items.length + ' items done</span></div>' +
      (top.length ? top.map(function (it) { return itemRow(it, 'top-' + it.id, 'data-item="' + esc(it.id) + '" data-tool="' + esc(t.id) + '"'); }).join('') : '<p class="meta">Nothing open for now.' + (x.items.some(function (i) { return !i.done; }) ? ' Later items are listed below.' : '') + '</p>') + '</section>';
    h += '<section class="panel"><details' + (ui.openAll ? ' open' : '') + '><summary><h3 style="display:inline">Everything to check for this tool</h3> <span class="meta">' + plural(x.items.length, 'item') + '</span></summary>';
    groupItems(x.items).forEach(function (g) {
      h += '<div class="grp"><h3>' + groupTitle(g.key) + '</h3>' + g.items.map(function (it) { return itemRow(it, 'it-' + it.id, 'data-item="' + esc(it.id) + '" data-tool="' + esc(t.id) + '"'); }).join('') + '</div>';
    });
    h += '</details></section>';
    if (c.packsIfOff) {
      var off = L.items(u, t, state.hotel, REF, c, c.packsIfOff).filter(function (it) { return it.pack !== 'ban'; });
      h += '<section class="panel"><details><summary>If you switch the banned feature off, these apply instead <span class="meta">' + plural(off.length, 'item') + '</span></summary>' +
        off.map(function (it) { return itemRow(it, 'off-' + it.id, 'disabled'); }).join('') + '</details></section>';
    }

    // vendor questions
    var vqs = L.vendorQuestions(u, c, REF);
    h += '<section class="panel"><div class="ph"><h3>Questions for the vendor</h3><span class="meta">Tick each one once the answer is in the contract</span></div><div>';
    vqs.forEach(function (q) {
      h += '<div class="item' + (t.vq[q.id] ? ' done' : '') + '"><input type="checkbox" id="vq-' + q.id + '" data-vq="' + q.id + '"' + (t.vq[q.id] ? ' checked' : '') + ' aria-labelledby="vq-' + q.id + '-t"><div class="itx"><span class="itt" id="vq-' + q.id + '-t">' + esc(q.q) + '</span></div></div>';
    });
    h += '</div><div class="btnrow"><button type="button" class="btn sm" data-act="vmail" data-id="' + esc(t.id) + '">Write these as an email to the vendor</button></div><p class="meta">From the briefing booklet, section A3.</p></section>' + copyBox();

    h += '</div><div>';

    // record
    h += '<section class="panel"><h3>Register entry</h3>' +
      '<label class="fld"><span>Responsible person</span><input type="text" id="f-owner" data-f="owner" value="' + esc(t.owner) + '" placeholder="Name or role"></label>' +
      '<label class="fld"><span>Vendor</span><input type="text" id="f-vendor" data-f="vendor" value="' + esc(t.vendor) + '"></label>' +
      '<label class="fld"><span>Department</span><select id="f-dept" data-f="dept">' + opt('', 'Choose', t.dept) + CAT.depts.map(function (d) { return opt(d.id, d.name, t.dept); }).join('') + '</select></label>' +
      '<label class="fld"><span>Where in the hotel</span><input type="text" id="f-where" data-f="where" value="' + esc(t.where) + '" placeholder="For example restaurant and bar"></label>' +
      '<label class="fld"><span>How the hotel got it</span><select id="f-origin" data-f="origin">' + REF.origins.map(function (o) { return opt(o.id, o.name, t.origin || 'vendor'); }).join('') + '</select></label>' +
      '<label class="fld"><span>Who decided to use it</span><select id="f-decided" data-f="decided">' + opt('', 'Choose', t.decided) + REF.deciders.map(function (o) { return opt(o.id, o.name, t.decided); }).join('') + '</select></label>' +
      '<label class="fld"><span>In use since</span><input type="date" id="f-since" data-f="since" value="' + esc(/^\d{4}-\d{2}-\d{2}$/.test(t.since || '') ? t.since : '') + '"></label>' +
      '<label class="fld"><span>Notes</span><textarea id="f-notes" data-f="notes">' + esc(t.notes) + '</textarea></label></section>';

    // watch list hits
    var hits = RADAR.entries.filter(function (e) { return L.radarHitsTool(e, u, c, REF); });
    if (hits.length) {
      h += '<section class="panel"><div class="ph"><h3>On the watch list</h3><button type="button" class="linkbtn" data-act="tab" data-tab="watch">See all</button></div><p class="meta">Changes that may affect this tool.</p><ul class="reasons">' +
        hits.map(function (e) { return '<li>' + esc(e.title) + ' <span class="meta">' + esc(e.when) + '</span></li>'; }).join('') + '</ul></section>';
    }

    h += '<section class="panel"><h3>Remove</h3>' + (isConfirm('delete') ? confirmBox('delete', 'Delete "' + (t.name || 'this tool') + '" from the register? This cannot be undone.', 'Delete tool') : '<div><button type="button" class="btn warn" data-act="del">Delete this tool</button></div>') + '</section>';
    h += '</div></div>';
    return h;
  }

  // ---------- view: to do ----------
  function vTodo() {
    var rows = state.tools.map(ctx), h = sinceBox() + exampleNote();
    h += '<section class="panel"><div class="ph"><h2>Five things to do now</h2><span class="meta">From the briefing booklet</span></div><div>';
    REF.hotelChecks.forEach(function (hc) {
      var auto = hc.auto === 'tools', done = auto ? state.tools.length > 0 : !!state.checks[hc.id];
      h += itemRow({ id: hc.id, text: hc.text, kind: hc.kind, who: hc.who, note: hc.note + (auto ? ' ' + plural(state.tools.length, 'tool') + ' listed so far.' : ''), done: done, auto: null }, 'hc-' + hc.id, 'data-hc="' + esc(hc.id) + '"' + (auto ? ' disabled' : '')) + diffBox(hc.diff);
    });
    var reps = state.hotel.reps === 'yes';
    h += '</div><p class="meta"><span class="kd kd-law">Other law · Labour</span> Before introducing any tool that schedules, scores or watches staff, involve the works council or staff representatives where you have them.' + (reps ? ' Your hotel has staff representatives.' : '') +
      (REF.labourNotes[state.hotel.country] ? ' ' + esc(REF.labourNotes[state.hotel.country]) : '') + '</p></section>';
    if (nonEU()) {
      var cc = REF.countryChecks[state.hotel.country];
      h += '<section class="panel"><h2>What applies in ' + esc(COUNTRY[state.hotel.country]) + '</h2><p class="sub">' + esc(cc.reach) + '</p><div>';
      cc.items.forEach(function (ci) { h += itemRow({ id: ci.id, text: ci.text, kind: 'law', tag: 'National', who: ci.who, done: !!state.checks[ci.id] }, 'hc-' + ci.id, 'data-hc="' + esc(ci.id) + '"'); });
      h += '</div></section>';
    }
    // items that apply to the whole hotel: once, covering every tool
    var hotelItems = {}, vendors = {};
    rows.forEach(function (x) {
      x.items.forEach(function (it) {
        if (it.scope === 'hotel' && it.id === 'L1') return; /* shown once as S5 above */
        if (it.scope === 'hotel') { var hi = hotelItems[it.id] = hotelItems[it.id] || { it: it, tools: [], open: 0 }; hi.tools.push(x.t); if (!it.done) hi.open++; }
        if (it.scope === 'vendor') { var vk = (x.t.vendor || '').trim() || 'Vendor not named: ' + (x.t.name || regNo(x.t)); var v = vendors[vk] = vendors[vk] || { name: vk, items: [], tools: [] }; v.tools.push(x); v.items.push(it); }
      });
    });
    var hk = Object.keys(hotelItems);
    if (hk.length) {
      h += '<section class="panel"><div class="ph"><h2>For the whole hotel</h2><span class="meta">Once, not per tool</span></div>';
      hk.forEach(function (k) { var hi = hotelItems[k], it = Object.assign({}, hi.it, { text: hi.it.id === 'R1' ? 'Check whether each AI tool has one person in the hotel named as responsible for it.' : hi.it.text, done: hi.open === 0, note: (hi.it.note ? hi.it.note + ' ' : '') + 'Covers ' + plural(hi.tools.length, 'tool') + ': ' + hi.tools.map(function (t) { return t.name || regNo(t); }).join(', ') + '.' });
        if (ui.showDone || !it.done) h += itemRow(it, 'hl-' + k, 'data-bulk="' + esc(k) + '"'); });
      h += '</section>';
    }
    var vk2 = Object.keys(vendors).sort();
    if (vk2.length) {
      h += '<section class="panel"><div class="ph"><h2>Per vendor</h2><span class="meta">One conversation per vendor</span></div>';
      vk2.forEach(function (k) {
        var v = vendors[k], open = v.items.filter(function (i) { return !i.done; }).length;
        h += '<div class="toolh"><strong>' + esc(v.name) + '</strong><span class="meta">' + esc(v.tools.map(function (x) { return x.t.name || regNo(x.t); }).join(', ')) + '</span>' + (open ? '<span class="meta">' + plural(open, 'tool') + ' with questions open</span>' : '<span class="meta">Answers recorded</span>') + '</div>' +
          '<div class="btnrow"><button type="button" class="btn sm" data-act="vmail" data-vendor="' + esc(k) + '">Write the questions as one email</button></div>';
      });
      h += '</section>' + copyBox();
    }
    var whos = {};
    rows.forEach(function (x) { x.items.forEach(function (it) { if (it.scope === 'tool' && it.who) whos[it.who] = true; }); });
    var all = [];
    rows.forEach(function (x) { x.items.forEach(function (it) { if (it.scope !== 'tool') return; if (ui.whoFilter && it.who !== ui.whoFilter) return; if (ui.showDone || !it.done) all.push({ x: x, it: it }); }); });
    h += '<section class="panel"><div class="ph"><h2>By tool</h2><div class="btnrow"><label><span class="sr">Responsible person</span><select id="f-who" data-whofilter="1">' + opt('', 'Everyone', ui.whoFilter) + Object.keys(whos).sort().map(function (w) { return opt(w, w, ui.whoFilter); }).join('') + '</select></label><label class="checks"><input type="checkbox" id="show-done" data-showdone="1"' + (ui.showDone ? ' checked' : '') + '> <span>Show completed items</span></label></div></div>';
    if (!rows.length) h += '<p class="meta">No tools yet. <button type="button" class="linkbtn" data-act="add">Add a tool</button></p>';
    else if (!all.length) h += '<p class="meta">Nothing open. Every item is ticked.</p>';
    var keys = {};
    all.forEach(function (a) { var k = isNow(a.it) ? 'now' : a.it.when; (keys[k] = keys[k] || []).push(a); });
    Object.keys(keys).sort(function (a, b) { return a === 'now' ? -1 : b === 'now' ? 1 : a < b ? -1 : 1; }).forEach(function (k) {
      h += '<div class="grp"><h3>' + groupTitle(k) + ' <span class="meta">' + plural(keys[k].filter(function (a) { return !a.it.done; }).length, 'open item') + '</span></h3>';
      var last = null;
      keys[k].forEach(function (a) {
        if (last !== a.x.t.id) {
          last = a.x.t.id;
          h += '<div class="toolh"><span class="no">' + regNo(a.x.t) + '</span><button type="button" class="linkbtn" data-act="open" data-id="' + esc(a.x.t.id) + '"><strong>' + esc(a.x.t.name || 'Unnamed tool') + '</strong></button>' + chip(a.x.c.label) + (a.x.t.owner ? '<span class="meta">' + esc(a.x.t.owner) + '</span>' : '<span class="meta miss">No responsible person</span>') + '</div>';
        }
        h += itemRow(a.it, 'td-' + a.x.t.id + '-' + a.it.id, 'data-item="' + esc(a.it.id) + '" data-tool="' + esc(a.x.t.id) + '"');
      });
      h += '</div>';
    });
    h += '</section>';
    return h;
  }

  // ---------- view: your hotel ----------
  function vHotel() {
    var H = state.hotel, h = exampleNote();
    h += '<section class="panel"><h2>Your hotel</h2><p class="sub">These answers decide which country notes and contract notes the register shows. They stay in this browser.</p><div class="formgrid">' +
      '<label class="fld"><span>Hotel or group name</span><input type="text" id="h-name" data-h="name" value="' + esc(H.name) + '"></label>' +
      '<label class="fld"><span>Country</span><select id="h-country" data-h="country">' + opt('', 'Choose', H.country) + REF.countries.map(function (c) { return opt(c[0], c[1], H.country); }).join('') + '</select></label>' +
      '<label class="fld"><span>Operating model</span><select id="h-model" data-h="model">' + opt('', 'Choose', H.model) + REF.operatingModels.map(function (m) { return opt(m.id, m.name, H.model); }).join('') + '</select></label>' +
      '<label class="fld"><span>Part of a group or brand</span><select id="h-group" data-h="group">' + opt('', 'Choose', H.group) + opt('yes', 'Yes', H.group) + opt('no', 'No, independent', H.group) + '</select></label>' +
      '<label class="fld"><span>Rooms</span><select id="h-size" data-h="size">' + opt('', 'Choose', H.size) + [['s', 'Under 50'], ['m', '50 to 149'], ['l', '150 to 299'], ['xl', '300 or more']].map(function (o) { return opt(o[0], o[1], H.size); }).join('') + '</select></label>' +
      '<label class="fld"><span>Works council or staff representatives</span><select id="h-reps" data-h="reps">' + opt('', 'Choose', H.reps) + opt('yes', 'Yes', H.reps) + opt('no', 'No', H.reps) + opt('unsure', 'Not sure', H.reps) + '</select></label>' +
      '<label class="fld"><span>Who keeps this register</span><input type="text" id="h-keeper" data-h="keeper" value="' + esc(H.keeper) + '" placeholder="Name or role"></label></div>' +
      '<div class="fld"><span>Food, beverage and other outlets inside the hotel</span><div class="checks">' + REF.outlets.map(function (o) {
        return '<label><input type="checkbox" id="o-' + o.id + '" data-outlet="' + o.id + '"' + (H.outlets.indexOf(o.id) >= 0 ? ' checked' : '') + '> <span>' + esc(o.name) + '</span></label>';
      }).join('') + '</div></div><div class="btnrow"><button type="button" class="btn primary" data-act="tab" data-tab="register">Next: register AI tools</button></div></section>';

    var model = null; REF.operatingModels.forEach(function (m) { if (m.id === H.model) model = m; });
    h += '<div class="detail"><div>';
    h += '<section class="panel"><h3>Who is usually the user of your AI tools</h3>';
    if (model) {
      h += '<dl class="kv"><dt>Set-up</dt><dd>' + esc(model.name) + '</dd><dt>Usually the user</dt><dd>' + esc(model.user) + '</dd>' + (model.watch ? '<dt>Watch</dt><dd>' + esc(model.watch) + '</dd>' : '') + '</dl>';
    } else h += '<p class="meta">Choose an operating model above.</p>';
    h += '<p class="meta">The user\'s duties fall on whoever decides to use a tool and how it is used, not on whoever owns the building or pays the invoice. The law gives no answer for each hotel set-up; this is our reading, and the contracts decide in practice. Duties towards staff (consultation, data protection) fall on the company that employs them, which may differ from the AI Act user.</p></section>';

    var nat = NAT[H.country];
    h += '<section class="panel"><h3>Who would contact you</h3>';
    if (!H.country) h += '<p class="meta">Choose a country above.</p>';
    else if (nat) {
      h += '<dl class="kv"><dt>AI Act authority</dt><dd>' + esc(nat.aiActAuthority) + '</dd><dt>Status</dt><dd>' + esc(nat.designationStatus) + '</dd><dt>Labour rules</dt><dd>' + esc(nat.labourRules) + '</dd>' + (nat.hotelNote ? '<dt>For hotels</dt><dd>' + esc(nat.hotelNote) + '</dd>' : '') + '</dl>' +
        '<p class="meta">From the project\'s national research (' + esc(NAT._researchedOn ? fmtDate(NAT._researchedOn) : 'November 2026') + '). Check the status before relying on it.</p>';
    } else {
      h += '<p>Each EU country designates its own authorities to supervise the AI Act; data protection authorities stay in charge of the GDPR.</p><p class="meta">The project has researched Germany, France, Spain, Sweden, Switzerland and the United Kingdom so far. ' + esc(COUNTRY[H.country]) + ' is not yet covered.</p>';
    }
    h += '</section></div><div>';
    h += '<section class="panel"><h3>Does the EU AI Act reach you</h3>';
    if (!H.country) h += '<p class="meta">Choose a country above.</p>';
    else if (nonEU()) h += '<p>' + esc(REF.countryChecks[H.country].reach) + '</p>';
    else h += '<p>Yes. Your hotel is in the EU, so the Act applies to the AI tools it uses, whatever its size. The Act has no special rules for hotels: a tool counts as high-risk because of what it does, not because a hotel uses it.</p>';
    h += '</section>';
    if (H.reps === 'yes' || REF.labourNotes[H.country]) {
      h += '<section class="panel"><h3>Staff representatives</h3><p>Before introducing any tool that schedules, scores or watches staff, involve the works council or staff representatives where you have them.</p>' + (REF.labourNotes[H.country] ? '<p class="meta">' + esc(REF.labourNotes[H.country]) + '</p>' : '') + '</section>';
    }
    h += '</div></div>';
    return h;
  }

  // ---------- view: watch list ----------
  function vWatch() {
    var rows = state.tools.map(ctx), h = '';
    var es = RADAR.entries.slice().sort(function (a, b) {
      function grp(e) { return e.date && e.date < TODAY && e.status === 'dated' ? 2 : e.date ? 0 : 1; }
      var ga = grp(a), gb = grp(b);
      if (ga !== gb) return ga - gb;
      if (a.date && b.date) return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      return 0;
    });
    h += '<div class="band"><div class="who"><h2>What is still moving</h2><p class="sub">Rules and guidance that may change what the register tells you. Each entry names its source and the tools in your register it touches.</p></div>' +
      '<p class="meta">Last checked ' + fmtDate(RADAR.meta.lastChecked) + '</p></div>';
    h += '<section class="panel flush">';
    es.forEach(function (e) {
      var passed = e.status === 'dated' && e.date && e.date < TODAY;
      var st = passed ? 'Passed' : e.status === 'done' ? 'Published' : e.status === 'dated' ? 'Date set' : e.status === 'expected' ? 'Expected' : e.status === 'proposal' ? 'Proposal' : 'Pending';
      var hits = rows.filter(function (x) { return L.radarHitsTool(e, x.u, x.c, REF); });
      var hotelHit = L.radarHitsHotel(e, state.hotel);
      h += '<article class="wcard"><div class="wl"><span class="st st-' + (passed ? 'passed' : e.status) + '">' + st + '</span><strong>' + esc(e.when) + '</strong>' + (e.date && !passed && daysUntil(e.date) > 0 && e.status === 'dated' ? '<span class="meta">' + esc(away(e.date)) + '</span>' : '') + '</div>' +
        '<div class="wr"><h3>' + esc(e.title) + '</h3><p>' + esc(e.what) + '</p><p><strong>Why it matters:</strong> ' + esc(e.why) + '</p>' +
        '<p class="meta">Who should watch: ' + esc(e.who) + '</p>';
      if (hits.length) {
        h += '<p class="meta">In your register: ' + hits.slice(0, 8).map(function (x) { return '<button type="button" class="linkbtn" data-act="open" data-id="' + esc(x.t.id) + '">' + esc(x.t.name || regNo(x.t)) + '</button>'; }).join(', ') + (hits.length > 8 ? ' and ' + (hits.length - 8) + ' more' : '') + '</p>';
      } else if (hotelHit) h += '<p class="meta">Applies to hotels in ' + esc(COUNTRY[state.hotel.country]) + '.</p>';
      h += '<p class="meta">Source: ' + esc(e.source) + ' · ' + (e.basis === 'law' ? 'law text' : 'project material') + (e.verify ? ' · <strong>to verify</strong>' : '') + '</p>' +
        (e.links && e.links.length ? '<p class="meta">' + e.links.map(function (l) { return '<a href="' + esc(l.u) + '" target="_blank" rel="noopener">' + esc(l.t) + '</a>'; }).join(' · ') + '</p>' : '') + '</div></article>';
    });
    h += '</section><p class="meta">' + esc('Kept by: ' + RADAR.meta.maintainer + '.') + ' This is a dated list, not a live news feed: an entry is added only after it is checked at its source.</p>';
    return h;
  }

  // ---------- view: how it works ----------
  function vHow() {
    var h = '';
    h += '<section class="panel"><h2>How the register works</h2><p class="sub">Three steps: describe your hotel, add the AI tools it uses, then work through what to check. An example hotel is loaded so you can look around first.</p><ol class="steps">' +
      '<li><strong>Each tool starts from a hotel use case.</strong> The list holds the 99 use cases of the project\'s Hotel AI Use-Case Catalogue, plus 7 uses found in the market that the catalogue does not have yet.</li>' +
      '<li><strong>Each use case carries a label under the AI Act text.</strong> The labels are prohibited, high-risk, high-risk if…, transparency and minimal, plus "outside the high-risk list" and "not an AI system". They start from the briefing booklet; where a check of the law on 17 Nov 2026 found the booklet says more or less than the law, the register follows the law and shows the booklet\'s wording next to it.</li>' +
      '<li><strong>Your answers settle the label.</strong> For many tools one feature or one use decides. "Not sure" keeps the label open.</li>' +
      '<li><strong>The label, your role and your country produce the items to check.</strong> Each item says who should do it, by when, and what it rests on.</li></ol>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="tab" data-tab="hotel">Register your hotel</button><button type="button" class="btn" data-act="tab" data-tab="register">See the example register</button></div></section>';
    h += '<div class="detail"><div><section class="panel"><h3>What each item is</h3><dl class="kv">' + Object.keys(REF.kinds).map(function (k) { return '<dt><span class="kd kd-' + k + '">' + esc(REF.kinds[k].name) + '</span></dt><dd>' + esc(REF.kinds[k].desc) + '</dd>'; }).join('') + '</dl></section>' +
      '<section class="panel"><h3>What a label rests on</h3><dl class="kv">' + Object.keys(REF.basis).map(function (k) { return '<dt>' + esc(REF.basis[k].name) + '</dt><dd>' + esc(REF.basis[k].desc) + '</dd>'; }).join('') + '</dl></section></div>' +
      '<div><section class="panel"><h3>Limits</h3><ul class="reasons">' +
      '<li>It is a prototype. The labels and wording are waiting for review by the project team.</li>' +
      '<li>Where it says "Differs from the booklet", the register follows the law text. Some of these points rest on Commission guidance the research could not open in full.</li>' +
      '<li>It is not legal advice and gives no verdict that a hotel complies.</li>' +
      '<li>Several labels rest on the Commission\'s draft guidelines of 19 May 2026 and may change.</li>' +
      '<li>It covers the EU AI Act and points to other laws. It does not replace a data protection or labour law review.</li>' +
      '<li>Your entries are saved in this browser only. Clearing site data removes them, so download a backup.</li></ul></section>' +
      '<section class="panel" id="privacy"><h3>Your data and terms of use</h3><p><strong>All data stays in your browser.</strong> Nothing you enter is sent to the project team or anyone else; there are no accounts and no tracking. A file leaves your device only when you download a backup, CSV or PDF yourself.</p>' +
      '<p class="meta"><strong>Terms of use.</strong> A free student prototype (EHL SBP Group 36, prepared for HFTP), provided as is. It lists items to check and never states that a hotel or tool complies. It is not legal advice and has not been reviewed by a lawyer; get advice before relying on it. Neither the students, EHL nor HFTP accept liability for decisions taken on the basis of it.</p></section>' +
      '<section class="panel"><h3>For reviewers</h3><p class="meta">Shows where the register differs from the briefing booklet, and the full label table.</p><label class="chk"><input type="checkbox" id="f-reviewer" data-reviewer="1"' + (ui.reviewer ? ' checked' : '') + '> Show booklet comparison and the label table</label></section>' +
      '<section class="panel"><h3>Backup and reset</h3><div class="btnrow"><button type="button" class="btn" data-act="export" data-kind="json">Download a backup</button><label class="btn" for="f-import">Restore from a backup</label><input type="file" id="f-import" class="sr" accept=".json,application/json">' +
      '<button type="button" class="btn" data-act="example">Load the example hotel</button><button type="button" class="btn warn" data-act="reset">Clear everything</button></div>' +
      confirmBox('reset', 'Clear the whole register in this browser? This cannot be undone.', 'Clear everything') +
      confirmBox('example', 'Replace the current register with the fictional example hotel?', 'Load the example') +
      confirmBox('import', isConfirm('import') ? 'Replace the current register with the backup (' + plural(ui.dialog.payload.tools.length, 'tool') + ')?' : '', 'Restore backup') + '</section></div></div>';

    // label table (reviewers only)
    if (!ui.reviewer) return h;
    var T = LAB.meta.bookletTotals, rows = LAB.uses.filter(function (u) { return u.n && u.n <= 91; });
    function regCount(k) {
      return rows.filter(function (u) {
        var c = L.classify(u, {}, REF), lb = c.labelUnder || c.label;
        if (k === 'high') return lb === 'high';
        if (k === 'highif') return lb === 'highif';
        if (k === 'transp') return c.label === 'transparency' || c.label === 'transif' || c.alsoTransparency;
        return c.canProhibitHard || c.label === 'prohibited';
      }).length;
    }
    h += '<section class="panel"><div class="ph"><h2>The label of every use case</h2><span class="meta">For review by the project team</span></div>' +
      '<p class="sub">The briefing booklet counts ' + T.high + ' high-risk uses, ' + T.highif + ' that are high-risk depending on set-up, ' + T.transp + ' with a transparency duty and ' + T.prohib + ' that one feature can make prohibited (booklet page A6, own classification of the 91 uses). Following the law text, the register gives ' + regCount('high') + ', ' + regCount('highif') + ', ' + regCount('transp') + ' and ' + regCount('prohib') + '. ' + plural(rows.filter(function (u) { return u.diff; }).length, 'use case differs', 'use cases differ') + ' from the booklet; they are marked below.</p>';
    function table(us) {
      return '<div class="tblw"><table><thead><tr><th>No.</th><th>Use case</th><th>Label before answers</th><th>Deciding questions</th><th>Rests on</th><th>Booklet</th><th>Differs from the booklet</th><th>Review note</th></tr></thead><tbody>' + us.map(function (u) {
        var c = L.classify(u, {}, REF);
        return '<tr><td class="num">' + (u.n || esc(u.id)) + '</td><td>' + esc(u.name) + '</td><td>' + chip(c.label) + (c.alsoTransparency ? ' ' + chip('transparency') : '') + (c.canProhibit ? ' <span class="flagc">Can become prohibited</span>' : '') + '</td><td class="num">' + (u.switches.length || '') + '</td><td>' + esc(basisName(u.basis)) + '</td><td>' + esc(u.booklet) + '</td><td>' + (u.diff ? esc(u.diff.law) : '') + '</td><td>' + esc(u.review || '') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    }
    CAT.depts.forEach(function (d) {
      var us = rows.filter(function (u) { return u.dept === d.id; });
      h += '<details><summary>' + esc(d.name) + ' <span class="meta">' + plural(us.length, 'use') + '</span></summary>' + table(us) + '</details>';
    });
    var added = LAB.uses.filter(function (u) { return u.n > 91; });
    if (added.length) h += '<details><summary>Added to the catalogue after the booklet <span class="meta">' + plural(added.length, 'use') + ', 19 and 20 Nov 2026, not yet reviewed</span></summary>' + table(added) + '</details>';
    var ex = LAB.uses.filter(function (u) { return u.provisional; });
    h += '<details><summary>Seen in the market, not yet in the catalogue <span class="meta">' + plural(ex.length, 'use') + ', provisional</span></summary>' + table(ex) + '</details></section>';

    h += '<section class="panel"><h3>Sources</h3><ul class="reasons">' + REF.meta.sources.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '<p class="meta">Legal basis: ' + esc(REF.meta.legalBasis) + '. Law as of ' + fmtDate(REF.meta.lawAsOf) + '. Data version ' + esc(REF.meta.version) + '.</p></section>';
    return h;
  }

  // ---------- render ----------
  function render(keep) {
    var act = document.activeElement, fid = keep && act && act.id ? act.id : null, sel = null;
    if (fid) { try { if (act.selectionStart != null) sel = [act.selectionStart, act.selectionEnd]; } catch (e) { sel = null; } }
    var html, t = ui.route.view === 'tool' ? toolById(ui.route.toolId) : null;
    if (ui.route.tab === 'register') html = ui.route.view === 'pick' ? vPick() : t ? vTool(t) : vList();
    else if (ui.route.tab === 'todo') html = vTodo();
    else if (ui.route.tab === 'hotel') html = vHotel();
    else if (ui.route.tab === 'watch') html = vWatch();
    else html = vHow();
    if (ui.route.tab === 'how' || (ui.route.tab === 'register' && ui.route.view === 'list')) html = unreadableNote() + html;
    var v = $('view');
    v.innerHTML = html;
    /* AX: the current state, readable without scraping the page */
    v.setAttribute('data-state', M.routeName(ui.route)); v.setAttribute('data-tool', ui.route.toolId || ''); v.setAttribute('data-dialog', M.dialogName(ui.dialog));
    ['register', 'todo', 'hotel', 'watch', 'how'].forEach(function (k) { if (ui.route.tab === k) $('tab-' + k).setAttribute('aria-current', 'page'); else $('tab-' + k).removeAttribute('aria-current'); });
    try { var cur = $('tab-' + ui.route.tab); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* ignore */ }
    paintSaved();
    if (fid) { var el = $(fid); if (el) { el.focus(); if (sel && el.setSelectionRange) { try { el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* not a text field */ } } } }
  }
  // ---------- the two machines: route and dialog (transition tables in src/machines.js) ----------
  function exists(id) { return !!toolById(id); }
  /* The only writer of ui.route. history: 'push' (a click), 'replace' (after a delete, an #add= link, start-up), 'none' (Back/forward).
     A click on the route you are already on adds no history entry. Moving closes any open dialog. */
  function setRoute(r, history) {
    var same = M.sameRoute(r, ui.route);
    ui.route = r; ui.dialog = M.dialogSend(ui.dialog, { type: 'navigate' }).dialog;
    try {
      if (history === 'replace' || (history === 'push' && same)) window.history.replaceState(M.historyEntry(r), '');
      else if (history === 'push') window.history.pushState(M.historyEntry(r), '');
    } catch (e) { /* ignore */ }
  }
  function go(tab, view, id, history) {
    setRoute(M.route(tab, view, id, exists), history || 'push');
    render(false);
    try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
    $('view').focus({ preventScroll: true });
  }
  /* The only writer of ui.dialog. Runs a confirmed effect once; returns false when the event was ignored. */
  function send(ev) {
    if (ev && ev.type === 'ask' && !M.dialogHome(ev.kind, ui.route)) {
      /* a confirm is drawn on its home screen only: the backup prompt lives under How it works */
      if (ev.kind === 'import' || ev.kind === 'reset') setRoute(M.route('how'), 'push'); else return false;
    }
    var r = M.dialogSend(ui.dialog, ev);
    if (r.ignored) return false;
    ui.dialog = r.dialog;
    if (r.effect) runEffect(r.effect); else render(false);
    if (ui.dialog.name === 'confirm') focusConfirm();
    else if (ui.dialog.name === 'copy') { var ta = $('copy-text'); if (ta) { ta.focus(); ta.select(); } }
    return true;
  }
  function runEffect(e) {
    if (e.kind === 'delete') { state.tools = state.tools.filter(function (x) { return x.id !== e.id; }); persist(); go('register', 'list', null, 'replace'); toast('Tool deleted.'); }
    else if (e.kind === 'reset') { replaceRegister(blank()); go('register', 'list'); toast('Register cleared.'); }
    else if (e.kind === 'example') { replaceRegister(example()); go('register', 'list'); }
    else if (e.kind === 'own') { replaceRegister(blank()); go('register', 'list'); toast('Empty register ready. You can load the example again under How it works.'); }
    else if (e.kind === 'import') { replaceRegister(e.payload); go('register', 'list'); toast('Backup restored.'); }
  }

  // ---------- exports ----------
  /* host.state is the download-bridge machine (src/machines.js: hostStart, hostSend): none | pending | yes | no. */
  function parentSameOrigin() { try { return window.parent.location.origin === window.location.origin; } catch (e) { return false; } }
  var host = { state: M.hostStart(window.parent !== window, window.parent !== window && parentSameOrigin()), waiters: [], seq: 0, calls: {}, direct: null };
  function hostEvent(ev) {
    var was = host.state; host.state = M.hostSend(host.state, ev);
    if (was === 'pending' && host.state !== 'pending') host.waiters.splice(0).forEach(function (f) { f(); });
  }
  /* Kept on purpose: inside the claude.ai hub this page runs in a frame and cannot save files itself, so it asks
     the hub page (postMessage, same origin only) or the artifact's downloads capability (window.claude) to do it.
     Opened from file:// or a plain web server, neither exists and the page falls back to an ordinary download link. */
  function initHost() {
    if (window.claude && typeof window.claude.use === 'function') {
      window.claude.use('downloads').then(function (d) { host.direct = d || null; }).catch(function () { host.direct = null; });
    }
    if (host.state !== 'pending') return;
    window.addEventListener('message', function (e) {
      if (e.source !== window.parent || !e.data || typeof e.data !== 'object') return;
      var m = e.data;
      if (m.hub === 'pong') hostEvent({ type: 'pong', downloads: !!m.downloads });
      else if (m.hub === 'download-result' && host.calls[m.id]) { var cb = host.calls[m.id]; delete host.calls[m.id]; cb(m); }
    });
    try { window.parent.postMessage({ hub: 'ping' }, window.location.origin); } catch (e) { hostEvent({ type: 'timeout' }); }
    setTimeout(function () { hostEvent({ type: 'timeout' }); }, 12000);
  }
  function whenHostKnown(fn) { if (host.state === 'pending') { toast('Preparing the download…'); host.waiters.push(fn); } else fn(); }
  function saveFile(name, content, mime) {
    function viaLink() {
      try {
        var blob = content instanceof Blob ? content : new Blob([content], { type: mime });
        var url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        toast('Download started: ' + name);
      } catch (e) { toast('This browser could not save the file.'); }
    }
    function fail(code) { toast(code === 'declined' ? 'Download cancelled.' : 'The file could not be saved here.'); }
    if (host.direct) { host.direct.save({ filename: name, data: content }).then(function () { toast('Saved ' + name); }).catch(function (e) { fail(e && e.code); }); return; }
    whenHostKnown(function () {
      if (host.state !== 'yes') { viaLink(); return; }
      var id = 'd' + (++host.seq);
      host.calls[id] = function (m) { if (m.ok) toast('Saved ' + name); else fail(m.code); };
      window.parent.postMessage({ hub: 'download', id: id, filename: name, data: content }, window.location.origin);
    });
  }
  function csvCell(v) { v = String(v == null ? '' : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function buildCsv() {
    var head = ['No.', 'Tool', 'Use case', 'Department', 'Where', 'Vendor', 'Label', 'Also transparency', 'Open questions', 'Your role', 'Responsible', 'How the hotel got it', 'In use since', 'Items open now', 'Items open later', 'Items done', 'Notes'];
    var lines = [[REF.meta.banner + ' Items to check, not a compliance verdict.'], head].concat(state.tools.map(function (t) {
      var x = ctx(t), open = x.items.filter(function (i) { return !i.done; }), origin = '';
      REF.origins.forEach(function (o) { if (o.id === (t.origin || 'vendor')) origin = o.name; });
      return [regNo(t), t.name, x.u.triage ? '' : x.u.name, (DEPTS[t.dept] || {}).name || '', t.where, t.vendor, REF.labels[x.c.label].name, x.c.alsoTransparency ? 'yes' : '', x.c.openHard.length,
        x.c.label === 'notai' ? '' : x.c.role === 'maker' ? 'Maker' : 'User', t.owner, origin, t.since, open.filter(isNow).length, open.length - open.filter(isNow).length, x.items.length - open.length, t.notes];
    }));
    return lines.map(function (r) { return r.map(csvCell).join(';'); }).join('\r\n');
  }
  function loadScript(src) {
    return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { s.remove(); rej(new Error('load ' + src)); }; document.head.appendChild(s); });
  }
  /* jsPDF is bundled into this page at build time, so the PDF works offline and from file://. */
  function getJsPDF() {
    if (window.jspdf) return Promise.resolve(window.jspdf.jsPDF);
    return Promise.reject(new Error('jsPDF not bundled'));
  }
  /* The embedded "Register Sans" font covers Latin-1, Latin Extended-A and -B, so names like Łucja or Ørsted print as typed.
     Anything outside that set (for example CJK) is replaced by "?" rather than silently dropped. */
  var PDF_FONT = null;
  function pdfFont(doc) {
    var f = PDF_FONT || (PDF_FONT = (function () { try { return JSON.parse($('d-font').textContent); } catch (e) { return null; } })());
    if (!f) return 'helvetica';
    doc.addFileToVFS('rs-regular.ttf', f.regular); doc.addFont('rs-regular.ttf', 'RegisterSans', 'normal');
    doc.addFileToVFS('rs-bold.ttf', f.bold); doc.addFont('rs-bold.ttf', 'RegisterSans', 'bold');
    return 'RegisterSans';
  }
  function pdfSafe(s) {
    return String(s == null ? '' : s).replace(/[^\u0000-\u024F\u2010-\u205E\u20AC\u2122\u2190-\u2193]/g, '?');
  }
  function makePdf() {
    return getJsPDF().then(function (JsPDF) {
      var doc = new JsPDF({ unit: 'mm', format: 'a4' }), W = 210, H = 297, M = 14, y = 19;
      var rows = state.tools.map(ctx), s = summary(rows), FACE = pdfFont(doc);
      function need(h) { if (y + h > H - 18) { doc.addPage(); y = 19; return true; } return false; }
      function font(style, size, grey) { doc.setFont(FACE, style); doc.setFontSize(size); doc.setTextColor(grey || 20); }
      font('bold', 8.5, 160); doc.setTextColor(163, 57, 42); doc.text(pdfSafe(REF.meta.banner), M, 10);
      font('bold', 17); doc.text('Hotel AI register', M, y);
      font('normal', 9, 100); doc.text(pdfSafe('Printed ' + fmtDate(TODAY)), W - M, y, { align: 'right' });
      y += 7; font('bold', 11); doc.text(pdfSafe(state.hotel.name || 'Hotel not named'), M, y);
      y += 5; font('normal', 9, 100); doc.text(pdfSafe(hotelLine() || 'Country and operating model not set'), M, y);
      y += 6; font('normal', 9.5);
      var counts = LABEL_ORDER.filter(function (l) { return s.by[l]; }).map(function (l) { return s.by[l] + ' ' + REF.labels[l].name.toLowerCase(); }).join(', ');
      doc.splitTextToSize(pdfSafe(plural(rows.length, 'tool') + ': ' + counts + '. ' + summaryText(s) + '.'), W - 2 * M).forEach(function (ln) { doc.text(ln, M, y); y += 4.6; });
      y += 3;
      var cols = [['No.', 12], ['Tool', 58], ['Label', 34], ['Role', 14], ['Responsible', 32], ['To check', 32]];
      function header() {
        font('bold', 8, 110); var x = M;
        cols.forEach(function (c) { doc.text(c[0].toUpperCase(), x, y); x += c[1]; });
        y += 2; doc.setDrawColor(170); doc.setLineWidth(0.2); doc.line(M, y, W - M, y); y += 4.5;
      }
      header();
      rows.forEach(function (x) {
        var t = x.t, open = x.items.filter(function (i) { return !i.done; }), now = open.filter(isNow).length;
        var cells = [regNo(t), (t.name || 'Unnamed tool') + (t.vendor ? '\n' + t.vendor : ''), REF.labels[x.c.label].name + (x.c.alsoTransparency ? '\n+ Transparency' : '') + (x.c.openHard.length ? '\n' + plural(x.c.openHard.length, 'question') + ' open' : ''),
          x.c.label === 'notai' ? '-' : x.c.role === 'maker' ? 'Maker' : 'User', t.owner || 'Not named', open.length ? open.length + ' open' + (now ? ', ' + now + ' now' : '') : reviewedText(x)];
        font('normal', 9);
        var lines = cells.map(function (c, i) { return doc.splitTextToSize(pdfSafe(c), cols[i][1] - 2.5); });
        var hgt = Math.max.apply(null, lines.map(function (l) { return l.length; })) * 4.1 + 3;
        if (need(hgt)) header();
        var xx = M;
        lines.forEach(function (l, i) { font(i === 1 ? 'bold' : 'normal', 9, i === 0 ? 110 : 20); doc.text(l, xx, y); xx += cols[i][1]; });
        y += hgt - 2; doc.setDrawColor(225); doc.line(M, y - 1.2, W - M, y - 1.2); y += 2;
      });
      y += 4; need(14); font('bold', 12); doc.text('To check now', M, y); y += 6;
      var anyOpen = false;
      rows.forEach(function (x) {
        var open = x.items.filter(function (i) { return !i.done && isNow(i); });
        if (!open.length && !x.c.open.length) return;
        anyOpen = true; need(10); font('bold', 9.5); doc.text(pdfSafe(regNo(x.t) + '  ' + (x.t.name || 'Unnamed tool') + (x.t.owner ? '  (' + x.t.owner + ')' : '')), M, y); y += 4.6;
        function line(txt, ind, st) { font(st || 'normal', 9); var ls = doc.splitTextToSize(pdfSafe(txt), W - 2 * M - ind); need(ls.length * 4.1 + 1); doc.text(ls, M + ind, y); y += ls.length * 4.1 + 0.8; }
        if (L.maybeLegacy(x.t, x.c, REF)) line('May be a legacy tool (in use since ' + fmtDate(x.t.since) + '): high-risk duties apply only after a significant design change (Art. 111(2) as amended). Ask the vendor.', 3);
        if (x.c.open.length) { line('Open questions that can change the label:', 3, 'bold'); x.c.open.forEach(function (id) { var d = REF.switches[id]; if (d) line('? ' + d.q + (x.t.answers[id] === 'unsure' ? ' (Not sure)' : ' (not answered)'), 6); }); }
        open.forEach(function (it) {
          font('normal', 9);
          var ls = doc.splitTextToSize(pdfSafe('- ' + it.text + ' [' + REF.kinds[it.kind].name + (it.tag ? ', ' + it.tag : '') + (it.ref ? '; ' + it.ref : '') + ']'), W - 2 * M - 4);
          need(ls.length * 4.1 + 1); doc.text(ls, M + 3, y); y += ls.length * 4.1 + 0.8;
        });
        y += 2;
      });
      if (!anyOpen) { font('normal', 9.5); doc.text('Nothing open.', M, y); }
      var n = doc.getNumberOfPages();
      for (var i = 1; i <= n; i++) {
        doc.setPage(i); font('normal', 7.5, 120);
        if (i > 1) { doc.setTextColor(163, 57, 42); doc.text(pdfSafe(REF.meta.banner), M, 10); doc.setTextColor(120); }
        doc.text(pdfSafe('Hotel AI Register (prototype), EHL SBP Group 36 for HFTP. Items to check, not a compliance verdict. Not legal advice. Law as of ' + fmtDate(REF.meta.lawAsOf) + '.'), M, H - 9);
        doc.text('Page ' + i + ' of ' + n, W - M, H - 9, { align: 'right' });
      }
      return doc.output('blob');
    });
  }
  function doExport(kind) {
    var stamp = TODAY;
    if (kind === 'csv') saveFile('hotel-ai-register_' + stamp + '.csv', '﻿' + buildCsv(), 'text/csv;charset=utf-8');
    else if (kind === 'json') saveFile('hotel-ai-register-backup_' + stamp + '.json', JSON.stringify(state, null, 2), 'application/json');
    else if (kind === 'pdf') { toast('Preparing the PDF…'); makePdf().then(function (blob) { saveFile('hotel-ai-register_' + stamp + '.pdf', blob, 'application/pdf'); }).catch(function () { toast('The PDF could not be made here. Use the CSV table instead.'); }); }
  }

  // ---------- events ----------
  /* Back/forward: the entry's route, checked again (the tool may have been deleted since). An entry without one means "How it works". */
  window.addEventListener('popstate', function (e) {
    var r = M.routeFromHistory(e.state, exists) || M.route('how');
    go(r.tab, r.view, r.toolId, 'none');
    var hs = e.state && e.state.reg;
    if (hs && hs[1] === 'tool' && r.view !== 'tool') { try { window.history.replaceState(M.historyEntry(r), ''); } catch (e2) { /* ignore */ } }
  });
  function vendorEmail(vendor, xs) {
    var lines = ['Subject: Questions about ' + xs.map(function (x) { return x.t.name || x.u.name; }).join(', '), '', 'Dear ' + (/^Vendor not named/.test(vendor) ? 'vendor' : vendor) + ' team,', '',
      'As part of our hotel\'s AI register we are checking the AI tools we use. Could you answer the following questions, and confirm that the answers can be put in our contract?', ''];
    var seen = {}, n = 0;
    xs.forEach(function (x) { L.vendorQuestions(x.u, x.c, REF).forEach(function (q) { if (seen[q.id]) return; seen[q.id] = 1; lines.push((++n) + '. ' + q.q); }); });
    lines.push('', 'Kind regards,', state.hotel.name || '[hotel name]');
    return lines.join('\n');
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!b) return;
    var a = b.getAttribute('data-act'), id = b.getAttribute('data-id'), t;
    if (a === 'tab') go(b.getAttribute('data-tab'));
    else if (a === 'add') { ui.pickQ = ''; ui.pickDept = ''; go('register', 'pick'); }
    else if (a === 'back') go('register', 'list');
    else if (a === 'open') go('register', 'tool', id);
    else if (a === 'pick') {
      /* the first own tool in an emptied example register: the fictional hotel goes, so it never reaches the shared profile */
      if (state.example && !state.tools.length) { state.example = false; state.hotel = blank().hotel; adoptProfile(state); }
      t = newTool(state, id); state.tools.push(t); persist(); go('register', 'tool', t.id);
      toast('Added to the register as ' + regNo(t) + '. Answer the questions to settle its label.');
      var nm = $('f-name'); if (nm && !t.name) nm.focus();
    }
    else if (a === 'flt') { var lb = b.getAttribute('data-label'); ui.fLabel = ui.fLabel === lb ? '' : lb; render(false); }
    else if (a === 'clear-flt') { ui.fLabel = ''; ui.q = ''; render(false); }
    else if (a === 'export') doExport(b.getAttribute('data-kind'));
    else if (a === 'copy-close') send({ type: 'close' });
    else if (a === 'unreadable-hide') { ui.unreadable = null; render(false); }
    else if (a === 'unreadable-save' && ui.unreadable) saveFile('hotel-ai-register-unreadable_' + TODAY + '.json', ui.unreadable.raw, 'application/json');
    else if (a === 'seen') { state.seenOn = TODAY; persist(); render(false); }
    else if (a === 'to-readiness') {
      var tr = toolById(id), hash = 'use=' + (tr ? tr.useId : '');
      if (window.parent !== window) { try { window.parent.postMessage({ hub: 'open', tool: 'readiness-check', hash: hash }, window.location.origin); } catch (e3) { /* ignore */ } }
      else window.location.href = '../readiness-check/index.html#' + hash;
    }
    else if (a === 'vmail') {
      var vn = b.getAttribute('data-vendor'), xs;
      if (vn) { xs = state.tools.map(ctx).filter(function (x) { return ((x.t.vendor || '').trim() || 'Vendor not named: ' + (x.t.name || regNo(x.t))) === vn; }); }
      else { t = toolById(id); xs = t ? [ctx(t)] : []; vn = (t && t.vendor) || 'Vendor not named'; }
      send({ type: 'copy', title: 'Email to ' + vn, text: vendorEmail(vn, xs) });
    }
    else if (a === 'del') send({ type: 'ask', kind: 'delete', id: ui.route.toolId });
    else if (a === 'reset') send({ type: 'ask', kind: 'reset' });
    else if (a === 'start-own') send({ type: 'ask', kind: 'own' });
    else if (a === 'example') {
      if (state.tools.length && !state.example) send({ type: 'ask', kind: 'example' });
      else { replaceRegister(example()); go('register', 'list'); }
    }
    else if (a === 'confirm-no') send({ type: 'cancel' });
    else if (a === 'confirm-yes') send({ type: 'yes' });
  });
  /* Escape closes an open confirm or copy box (same as Cancel / Close). */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || ui.dialog.name === 'none') return;
    send({ type: ui.dialog.name === 'copy' ? 'close' : 'cancel' });
  });
  function focusConfirm() { var el = $('confirm-yes'); if (el) { el.focus(); try { el.scrollIntoView({ block: 'center' }); } catch (e) { /* ignore */ } } }

  document.addEventListener('input', function (e) {
    var el = e.target, t;
    if (el.getAttribute('data-q') === 'list') { ui.q = el.value; render(true); return; }
    if (el.getAttribute('data-q') === 'pick') { ui.pickQ = el.value; render(true); return; }
    if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio' || el.type === 'file') return;
    if (el.hasAttribute('data-f')) { t = toolById(ui.route.toolId); if (t) { t[el.getAttribute('data-f')] = el.value; persistSoon(); } }
    else if (el.hasAttribute('data-h')) { state.hotel[el.getAttribute('data-h')] = el.value; persistSoon(); }
  });
  document.addEventListener('change', function (e) {
    var el = e.target, t = toolById(ui.route.toolId), tt;
    if (el.hasAttribute('data-sw') && t) { t.answers[el.getAttribute('data-sw')] = el.value; persist(); render(true); }
    else if (el.hasAttribute('data-notai') && t) { t.notAI = el.value; persist(); render(true); }
    else if (el.hasAttribute('data-notaiok') && t) { t.notAIConfirmed = el.checked ? 'yes' : ''; persist(); render(true); }
    else if (el.hasAttribute('data-item')) {
      tt = toolById(el.getAttribute('data-tool'));
      if (tt) { if (el.checked) tt.done[el.getAttribute('data-item')] = TODAY; else delete tt.done[el.getAttribute('data-item')]; persist(); render(true); }
    }
    else if (el.hasAttribute('data-vq') && t) { if (el.checked) t.vq[el.getAttribute('data-vq')] = TODAY; else delete t.vq[el.getAttribute('data-vq')]; persist(); render(true); }
    else if (el.hasAttribute('data-hc')) { if (el.checked) state.checks[el.getAttribute('data-hc')] = TODAY; else delete state.checks[el.getAttribute('data-hc')]; persist(); render(true); }
    else if (el.hasAttribute('data-showdone')) { ui.showDone = el.checked; render(true); }
    else if (el.hasAttribute('data-whofilter')) { ui.whoFilter = el.value; render(true); }
    else if (el.hasAttribute('data-reviewer')) { ui.reviewer = el.checked; try { window.localStorage.setItem(REVIEWER_KEY, el.checked ? '1' : '0'); } catch (e2) { /* ignore */ } render(true); }
    else if (el.hasAttribute('data-bulk')) {
      var bk = el.getAttribute('data-bulk');
      state.tools.forEach(function (tt) { var has = ctx(tt).items.some(function (i) { return i.id === bk; }); if (!has) return; if (el.checked) tt.done[bk] = TODAY; else delete tt.done[bk]; });
      persist(); render(true);
    }
    else if (el.hasAttribute('data-pick')) { ui.pickDept = el.value; render(true); }
    else if (el.hasAttribute('data-outlet')) {
      var o = el.getAttribute('data-outlet'), i = state.hotel.outlets.indexOf(o);
      if (el.checked && i < 0) state.hotel.outlets.push(o); else if (!el.checked && i >= 0) state.hotel.outlets.splice(i, 1);
      persist();
    }
    else if (el.hasAttribute('data-f') && t) { t[el.getAttribute('data-f')] = el.value; persist(); if (el.tagName === 'SELECT' || el.type === 'date') render(true); else if (el.getAttribute('data-f') === 'owner') setTimeout(function () { render(true); }, 0); }
    else if (el.hasAttribute('data-h')) { state.hotel[el.getAttribute('data-h')] = el.value; persist(); if (el.tagName === 'SELECT') render(true); }
    else if (el.id === 'f-import' && el.files && el.files[0]) {
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var r = M.readStored(String(fr.result));
          if (r.status !== 'ok') { toast(r.reason === 'newer' ? 'This backup was made by a newer version of the register and cannot be opened here.' : 'That file is not a register backup. Choose a file made with "Backup".'); return; }
          send({ type: 'ask', kind: 'import', payload: normalise(r.data) });
        } catch (err) { toast('That file is not a register backup. Choose a file made with "Backup".'); }
      };
      fr.onerror = function () { toast('The file could not be read.'); };
      fr.readAsText(el.files[0]);
    }
  });

  // ---------- start ----------
  state = load();
  /* "Since you last opened this register": watch-list entries added since, and dates that have passed. */
  function sinceLast() {
    var last = state.seenOn; if (!last || last >= TODAY) return null;
    var added = RADAR.entries.filter(function (e) { return e.added && e.added > last && e.added <= TODAY; });
    var passed = Object.keys(REF.dates).filter(function (k) { var d = REF.dates[k]; return d > last && d <= TODAY; }).map(function (k) { return REF.dates[k]; });
    var newly = 0;
    state.tools.forEach(function (t) { ctx(t).items.forEach(function (it) { if (!it.done && it.when && it.when > last && it.when <= TODAY) newly++; }); });
    if (!added.length && !passed.length && !newly) return null;
    return { last: last, added: added, passed: passed.filter(function (d, i, a) { return a.indexOf(d) === i; }).sort(), newly: newly };
  }
  function sinceBox() {
    var s2 = sinceLast(); if (!s2) return '';
    var bits = [];
    if (s2.added.length) bits.push(plural(s2.added.length, 'new watch-list entry', 'new watch-list entries') + ': ' + s2.added.map(function (e) { return e.title; }).join('; '));
    if (s2.passed.length) bits.push('date' + (s2.passed.length > 1 ? 's' : '') + ' passed: ' + s2.passed.map(fmtDate).join(', '));
    if (s2.newly) bits.push(plural(s2.newly, 'item') + ' now apply');
    return '<div class="note warn"><p><strong>Since you last opened this register (' + esc(fmtDate(s2.last)) + '):</strong> ' + esc(bits.join(' · ')) + '.</p><button type="button" class="btn sm" data-act="seen">Mark as seen</button></div>';
  }
  if (!state) { state = example(); try { window.localStorage.setItem(KEY + '-probe', '1'); window.localStorage.removeItem(KEY + '-probe'); } catch (e) { mem.ok = false; } }
  $('asof').textContent = fmtDate(REF.meta.preparedOn);
  $('footlaw').textContent = 'Legal basis: ' + REF.meta.legalBasis + '. Law as of ' + fmtDate(REF.meta.lawAsOf) + '. Prepared by EHL Hospitality Business School students for HFTP.';
  if (adoptProfile(state)) persist();
  if (!state.seenOn) { state.seenOn = TODAY; persist(); }
  /* Coming from the Readiness check or the AI Act guide: #add=<use id>&name=<tool name> adds the tool (once) and opens it.
     The hash is then removed and the history entry holds the tool route, so Back, forward and reload agree with the page. */
  function fromHash() {
    var h = M.parseAddHash(location.hash); if (!h || !USES[h.useId]) return false;
    var t = state.tools.filter(function (x) { return x.useId === h.useId; })[0];
    if (!t) {
      var next = state.example ? blank() : state;
      t = newTool(next, h.useId); if (h.name) t.name = h.name; next.tools.push(t);
      if (next !== state) replaceRegister(next); else persist();
    }
    ui.route = M.route('register', 'tool', t.id, exists); ui.dialog = { name: 'none' };
    try { history.replaceState(M.historyEntry(ui.route), '', location.pathname + location.search); } catch (e) { /* ignore */ }
    return true;
  }
  /* Reload keeps the place: history.state survives a reload, so start from the route it names (checked against the register). */
  if (!fromHash()) {
    var startRoute = null; try { startRoute = M.routeFromHistory(window.history.state, exists); } catch (e) { startRoute = null; }
    ui.route = startRoute || M.route('how');
    try { window.history.replaceState(M.historyEntry(ui.route), ''); } catch (e) { /* ignore */ }
  }
  window.addEventListener('hashchange', function () { if (fromHash()) { render(false); try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } } });
  window.addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flushSave(); });
  initHost();
  render(false);
  /* AX: read-only snapshots and the documented events. state() is the saved register (unchanged); ui() is where the page is.
     send({type:'go', tab, view, id}) | {type:'ask', kind:'delete'|'reset'|'example'|'own'} | {type:'cancel'} | {type:'yes'} | {type:'close'} */
  function snapshot() {
    return { route: { tab: ui.route.tab, view: ui.route.view, toolId: ui.route.toolId }, state: M.routeName(ui.route), dialog: M.dialogName(ui.dialog),
             host: host.state, saved: mem.ok && !saveTimer, storage: mem.ok, unreadable: !!ui.unreadable, example: !!state.example, tools: state.tools.length };
  }
  window.HotelAIRegister = { state: function () { return state; }, ui: snapshot, csv: buildCsv, pdf: makePdf,
    send: function (ev) {
      if (!ev || typeof ev !== 'object') return false;
      if (ev.type === 'go') { go(ev.tab, ev.view, ev.id); return true; }
      if (ev.type === 'ask' && ev.kind === 'import') return false; /* a backup comes only from a file the person chose */
      return send(ev);
    } };
})();
