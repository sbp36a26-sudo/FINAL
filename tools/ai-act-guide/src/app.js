/* AI Act guide: page code (state, screens, exports). Levels and items come from RegLogic via GuideLogic. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function data(id) { return JSON.parse($(id).textContent); }
  var REF = data('d-ref'), LAB = data('d-labels'), GD = data('d-guide'), NAT = data('d-national');
  var L = window.RegLogic, G = window.GuideLogic;
  var TODAY = G.isoDay(new Date());
  var CTX = G.makeCtx(REF, LAB, GD, L, TODAY);
  var COUNTRY = {}; REF.countries.forEach(function (c) { COUNTRY[c[0]] = c[1]; });
  var KEY = 'hftp-ai-act-guide-v1', PROFILE = 'hftp-hotel-profile-v1';
  var STEPS = ['hotel', 'tools', 'results', 'vendors', 'owner'];
  var fmt = G.fmtDate;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function opt(v, label, cur) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(label) + '</option>'; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  function chip(tier, big) { var t = GD.tiers[tier]; return '<span class="lb lb-' + t.chip + (big ? ' big' : '') + '">' + esc(t.name) + '</span>'; }
  function cite(s) { return s ? ' <span class="cite">' + esc(s) + '</span>' : ''; }
  function nonEU() { return ['CH', 'GB', 'NO', 'IS', 'LI'].indexOf(state.hotel.country) >= 0; }

  // ---------- state ----------
  var mem = { ok: true };
  var ui = { step: 'hotel', copy: null, welcome: false, open: {} };
  var state;
  function blank() { return { v: 1, example: false, hotel: { name: '', country: '', size: '', model: '', group: '', reps: '' }, tools: [], done: {}, seq: 0, updatedAt: null }; }
  function newTool(type) { return { id: 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), type: type, name: '', vendor: '', origin: '', ans: {}, vq: {}, askAnyway: false, notAI: '', notAIConfirmed: '', isai: {} }; }
  function normalise(o) {
    var s = blank(), k;
    s.example = !!o.example; s.updatedAt = o.updatedAt || null; s.done = o.done && typeof o.done === 'object' ? o.done : {};
    for (k in s.hotel) if (o.hotel && typeof o.hotel[k] === 'string') s.hotel[k] = o.hotel[k];
    (o.tools || []).forEach(function (t) {
      if (!t || !CTX.types[t.type]) return;
      var n = newTool(t.type);
      for (k in n) if (t[k] != null && typeof t[k] === typeof n[k]) n[k] = t[k];
      ['ans', 'vq', 'isai'].forEach(function (f) { if (!n[f] || typeof n[f] !== 'object') n[f] = {}; });
      s.tools.push(n);
    });
    return s;
  }
  function load() {
    try { var raw = window.localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); if (o && o.v === 1 && Array.isArray(o.tools)) return normalise(o); } }
    catch (e) { mem.ok = false; }
    return null;
  }
  /* Shared hotel profile (hftp-hotel-profile-v1), also read and written by the AI Register and the Readiness check. The example hotel is never written. */
  function readProfile() { try { return JSON.parse(window.localStorage.getItem(PROFILE) || 'null'); } catch (e) { return null; } }
  function writeProfile() {
    var H = state.hotel; if (state.example) return;
    var p = readProfile() || {};
    ['name', 'country', 'model', 'group', 'reps', 'size'].forEach(function (k) { if (H[k]) p[k] = H[k]; });
    p.type = H.model === 'managed' || H.model === 'franchised' ? 'managed' : H.group === 'yes' ? 'group' : H.model ? 'independent' : p.type || '';
    p.updatedAt = new Date().toISOString(); p.from = 'ai-act-guide';
    try { window.localStorage.setItem(PROFILE, JSON.stringify(p)); } catch (e) { /* ignore */ }
  }
  function adoptProfile(s) {
    var p = readProfile(); if (!p || s.example) return false;
    var took = false;
    ['name', 'country', 'model', 'group', 'reps', 'size'].forEach(function (k) { if (!s.hotel[k] && typeof p[k] === 'string' && p[k]) { s.hotel[k] = p[k]; took = true; } });
    return took;
  }
  var saveTimer = null;
  function persist() {
    clearTimeout(saveTimer);
    state.updatedAt = new Date().toISOString();
    writeProfile();
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); mem.ok = true; } catch (e) { mem.ok = false; }
    paintSaved();
  }
  function persistSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(persist, 400); }
  function paintSaved() {
    var el = $('saved'); if (!el) return;
    if (!mem.ok) { el.className = 'bad'; el.textContent = 'Not saved: this browser blocks storage. Save a backup file on the Owner page.'; return; }
    el.className = '';
    var t = state.updatedAt ? new Date(state.updatedAt) : null;
    el.textContent = state.example ? 'Example hotel: changes are not kept as your own.' : 'Saved in this browser only' + (t ? ' · ' + ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2) : '') + '.';
  }
  var toastTimer = null;
  function toast(msg) { var el = $('toast'); el.textContent = msg; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 4200); }

  function example() {
    var s = blank(); s.example = true;
    s.hotel = { name: 'Hotel Mirador (fictional example)', country: 'ES', size: 's', model: 'owned', group: 'no', reps: 'yes' };
    function add(type, name, vendor, origin, ans) { var t = newTool(type); t.name = name; t.vendor = vendor; t.origin = origin; t.ans = ans; s.tools.push(t); }
    add('chatbot', 'WhatsApp guest chatbot', 'Example chat vendor', 'vendor', { mode: 'talks', card: 'no' });
    add('rms', 'Dynamic pricing', 'Example revenue vendor', 'vendor', { price: 'demand', comp: 'no' });
    add('reviews', 'Review replies', 'Example review vendor', 'vendor', { mode: 'text' });
    add('assistant', 'ChatGPT at reception', '', 'shadow', { mode: 'drafts', paste: 'no' });
    add('cctv', 'CCTV cameras', 'Example camera vendor', 'vendor', { mode: 'unsure', emo: 'unsure', enrol: 'no', traits: 'no', judge: 'no' });
    add('rota', 'Staff rota', 'Example rota vendor', 'vendor', { mode: 'unsure' });
    return s;
  }
  function toolById(id) { for (var i = 0; i < state.tools.length; i++) if (state.tools[i].id === id) return state.tools[i]; return null; }
  function evals() { return G.evalAll(state, CTX); }
  function hotelName() { return state.hotel.name || '[hotel name]'; }

  // ---------- screen 1: hotel ----------
  function vHotel() {
    var H = state.hotel, h = '';
    if (ui.welcome) h += '<div class="note"><p><strong>Welcome back.</strong> ' + plural(state.tools.length, 'tool') + ' saved in this browser' + (state.updatedAt ? ', last changed ' + esc(fmt(state.updatedAt.slice(0, 10))) : '') + '.</p><button type="button" class="btn primary" data-act="step" data-step="results">Continue to my results</button></div>';
    if (state.example) h += '<div class="note warn"><p>You are looking at a fictional example hotel. <strong>Start with my hotel</strong> clears it.</p><button type="button" class="btn" data-act="clear">Start with my hotel</button></div>';
    h += '<section class="panel intro"><h2>Use AI with confidence</h2>' +
      '<p>Most AI in hotels is low-risk under the EU AI Act. A few uses matter a lot: hiring and managing staff, recognising faces or reading emotions, and telling guests when they talk to an AI.</p>' +
      '<p>Tell us about the hotel and the AI tools it uses. You get each tool\'s level, a plan with who does what by when, and the questions to send each supplier. About ten minutes.</p>' +
      '<p class="meta">' + esc(GD.outOfScope) + '</p>' +
      (state.tools.length ? '' : '<div class="btnrow"><button type="button" class="btn" data-act="example">Load an example hotel</button></div>') + '</section>';
    h += '<section class="panel"><h2>Your hotel</h2><div class="formgrid">' +
      '<label class="fld"><span>Hotel name</span><input type="text" id="h-name" data-h="name" value="' + esc(H.name) + '" autocomplete="organization"></label>' +
      '<label class="fld"><span>Country</span><select id="h-country" data-h="country">' + opt('', 'Choose', H.country) + REF.countries.map(function (c) { return opt(c[0], c[1], H.country); }).join('') + '</select></label>' +
      '<label class="fld"><span>Rooms</span><select id="h-size" data-h="size">' + opt('', 'Choose', H.size) + [['s', 'Under 50'], ['m', '50 to 149'], ['l', '150 to 299'], ['xl', '300 or more']].map(function (o) { return opt(o[0], o[1], H.size); }).join('') + '</select></label>' +
      '<label class="fld"><span>How is it run?</span><select id="h-model" data-h="model">' + opt('', 'Choose', H.model) + REF.operatingModels.map(function (m) { return opt(m.id, m.name, H.model); }).join('') + '</select></label>' +
      '<label class="fld"><span>Part of a group or brand?</span><select id="h-group" data-h="group">' + opt('', 'Choose', H.group) + opt('yes', 'Yes', H.group) + opt('no', 'No, independent', H.group) + '</select></label>' +
      '<label class="fld"><span>' + esc(GD.staffReps.ask) + '</span><select id="h-reps" data-h="reps">' + opt('', 'Choose', H.reps) + opt('yes', 'Yes', H.reps) + opt('no', 'No', H.reps) + opt('unsure', 'Not sure', H.reps) + '</select></label>' +
      '</div><p class="meta">The works council question matters for any tool that plans, scores or watches staff: in most countries they must be involved before it is switched on, under labour law, not only from the AI Act\'s later dates.</p>' +
      '<div class="btnrow"><button type="button" class="btn primary" data-act="step" data-step="tools">Next: choose your AI tools</button></div></section>';
    if (H.country) h += countryPanel();
    return h;
  }
  function countryPanel() {
    var H = state.hotel, nat = NAT[H.country], h = '<section class="panel"><h3>' + esc(COUNTRY[H.country]) + ': what to know</h3>';
    if (nonEU()) h += '<p>' + esc((REF.countryChecks[H.country] || {}).reach || 'Outside the EU the AI Act reaches a hotel mainly where its AI output is used in the EU (Art. 2(1)(c)); EU duties below are shown for reference.') + '</p>';
    else h += '<p>The hotel is in the EU or EEA, so the Act applies to the AI tools it uses, whatever its size. A tool\'s level depends on what it does, not on the fact that a hotel uses it.</p>';
    h += '<dl class="kv">';
    if (nat) h += '<dt>Who supervises</dt><dd>' + esc(nat.aiActAuthority) + ' <span class="meta">(' + esc(nat.designationStatus) + ')</span></dd>';
    if (REF.labourNotes[H.country]) h += '<dt>Staff representatives</dt><dd>' + esc(REF.labourNotes[H.country]) + '</dd>';
    h += '</dl>';
    h += '<p class="meta">' + (nat ? 'From the team\'s national research (' + esc(NAT._researchedOn ? fmt(NAT._researchedOn) : 'November 2026') + '). Check the status before relying on it.' : 'The team has researched Germany, France, Spain, Sweden, Switzerland and the United Kingdom so far. For ' + esc(COUNTRY[H.country]) + ', check who supervises with your national authority.') + '</p></section>';
    return h;
  }

  // ---------- screen 2: tools ----------
  function vTools() {
    var h = '<section class="panel"><div class="ph"><h2>Which AI tools does the hotel use?</h2><span class="meta">Pick each one; add a type twice if you have two</span></div>' +
      '<p class="sub">Include tools inside systems you already have (a PMS or phone system with AI features) and tools staff started using on their own.</p><div class="typegrid">';
    GD.types.forEach(function (t) {
      var n = state.tools.filter(function (x) { return x.type === t.id; }).length;
      h += '<button type="button" class="tp" data-act="addtype" data-type="' + t.id + '" aria-pressed="' + (n > 0) + '"><span class="pn">' + esc(t.name) + '</span><span class="meta">' + esc(t.what) + '</span>' + (n ? '<span class="cnt">Added' + (n > 1 ? ' ×' + n : '') + ' · add another</span>' : '') + '</button>';
    });
    h += '</div></section>';
    h += '<details class="panel"><summary>Not sure a tool is AI at all?</summary><p>' + esc(GD.isAI.intro) + '</p><ol class="steps">' + GD.isAI.questions.map(function (q) { return '<li>' + esc(q.ask) + '</li>'; }).join('') + '</ol><p class="meta">Each tool below has these three questions under "Is it AI at all?". ' + esc(GD.isAI.basis) + '</p></details>';
    if (!state.tools.length) return h;
    var ev = evals();
    ev.forEach(function (e) { h += toolCard(e); });
    h += '<div class="btnrow"><button type="button" class="btn primary" data-act="step" data-step="results">Next: see results and plan</button></div>';
    return h;
  }
  function toolCard(e) {
    var t = e.tool, ty = e.type, h = '<article class="tcard" id="card-' + t.id + '">';
    h += '<div class="th"><div class="nm"><span class="meta">' + esc(ty.name) + '</span><label><span class="sr">Name of this tool</span><input type="text" class="title" data-t="name" data-id="' + t.id + '" value="' + esc(t.name) + '" placeholder="' + esc(ty.name) + '"></label></div>' +
      '<div class="now"><span class="meta">Level right now</span>' + chip(e.tier) + (e.badge ? '<span class="lb lb-notai">' + esc(e.badge) + '</span>' : '') + '<button type="button" class="btn sm" data-act="remove" data-id="' + t.id + '">Remove</button></div></div>';
    h += '<div class="formgrid"><label class="fld"><span>Vendor</span><input type="text" data-t="vendor" data-id="' + t.id + '" value="' + esc(t.vendor) + '" placeholder="Company that supplies it"></label>' +
      '<label class="fld"><span>How did the hotel get it?</span><select data-t="origin" data-id="' + t.id + '">' + opt('', 'Choose', t.origin) + GD.origins.map(function (o) { return opt(o.id, o.name, t.origin); }).join('') + '</select></label></div>';
    G.visibleQuestions(ty, t).forEach(function (q) {
      var name = 'q-' + t.id + '-' + q.id;
      h += '<fieldset class="qa"><legend>' + esc(q.ask) + '</legend><div class="opts">' + q.answers.map(function (a) {
        var on = t.ans[q.id] === a.id;
        return '<label class="opt' + (on ? ' on' : '') + '"><input type="radio" name="' + name + '" data-q="' + q.id + '" data-id="' + t.id + '" value="' + a.id + '"' + (on ? ' checked' : '') + '>' + esc(a.label) + '</label>';
      }).join('') + '</div></fieldset>';
    });
    if (e.unanswered) h += '<p class="meta">' + plural(e.unanswered, 'answer') + ' missing before the level is settled.</p>';
    else h += '<p class="why">' + esc(e.reason) + cite(e.basis.prov) + '</p>';
    G.stillOpenLines(e).forEach(function (l) { if (!e.unanswered) h += '<p class="open-l">' + esc(l) + '</p>'; });
    h += isAIBox(e);
    h += registerLink(e);
    return h + '</article>';
  }
  function isAIBox(e) {
    var t = e.tool, h = '<details class="isai"' + (t.isai && (t.isai.learns || t.isai.says || t.isai.rules) ? ' open' : '') + '><summary>Is it AI at all?</summary>';
    GD.isAI.questions.forEach(function (q) {
      var name = 'ai-' + t.id + '-' + q.id;
      h += '<fieldset class="qa"><legend>' + esc(q.ask) + '</legend><div class="opts">' + [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']].map(function (o) {
        var on = t.isai[q.id] === o[0];
        return '<label class="opt' + (on ? ' on' : '') + '"><input type="radio" name="' + name + '" data-isai="' + q.id + '" data-id="' + t.id + '" value="' + o[0] + '"' + (on ? ' checked' : '') + '>' + o[1] + '</label>';
      }).join('') + '</div></fieldset>';
    });
    var a = t.isai, msg = '';
    if (a.learns === 'yes' || a.says === 'yes') msg = 'Treat it as AI.';
    else if (a.rules === 'yes' && a.learns === 'no' && a.says === 'no') {
      if (e.c.notAIBlocked === 'blocked') msg = 'It cannot count as "not AI" here: a ban or high-risk question is answered yes or still open (the register\'s rule). Settle those first.';
      else if (e.c.notAIBlocked === 'needs-confirmation') msg = 'Probably not AI. Because this kind of tool can be high-risk or banned, it counts as "not AI" only with the vendor\'s written confirmation.';
      else msg = 'Probably not AI: software that only follows rules people wrote is outside the AI Act. Other laws still apply.';
    } else if (a.learns || a.says || a.rules) msg = 'Not settled. Ask the vendor: "Which features of ' + (t.name || e.type.name) + ' use AI (learning, predicting, ranking, generating or conversing)?"';
    if (msg) h += '<p class="why">' + esc(msg) + '</p>';
    if (e.c.notAIBlocked === 'needs-confirmation' || (t.notAI === 'yes' && t.notAIConfirmed === 'yes')) h += '<label class="chk"><input type="checkbox" data-notaiconf="' + t.id + '"' + (t.notAIConfirmed === 'yes' ? ' checked' : '') + '> The vendor confirmed in writing that it only follows rules we set</label>';
    return h + '</details>';
  }
  function registerLink(e) {
    if (!/^[a-z]+-\d+$/.test(e.row.id)) return '';
    var hash = 'add=' + e.row.id + '&name=' + encodeURIComponent(e.name);
    return '<p class="meta noprint"><button type="button" class="linkbtn" data-act="to-register" data-hash="' + esc(hash) + '">Open the detailed view in the AI Register</button> (adds it to your register there)</p>';
  }
  function syncIsAI(t) {
    var a = t.isai;
    t.notAI = (a.rules === 'yes' && a.learns === 'no' && a.says === 'no') ? 'yes' : '';
    if (t.notAI !== 'yes') t.notAIConfirmed = '';
  }

  // ---------- screen 3: results and plan ----------
  function verdictBox(v) {
    var h = '<section class="verdict" aria-labelledby="vh"><h2 id="vh" class="sr">The short version</h2>';
    h += '<div class="vl"><span class="vh">Do this month</span><div>' + (v.now.length || v.hotelNow.length ? '<ul>' + v.now.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') +
      (v.hotelNow.length ? '<li>For the whole hotel: ' + esc(v.hotelNow.map(function (s) { return s.replace(/\.$/, ''); }).join('; ')) + '.</li>' : '') + '</ul>' : '<p>Nothing open.</p>') + '</div></div>';
    if (v.later.length) v.later.forEach(function (l) { h += '<div class="vl"><span class="vh">Can wait until ' + esc(l.label) + '</span><div><ul>' + l.tools.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>'; });
    else h += '<div class="vl"><span class="vh">Can wait</span><p>Nothing with a later date.</p></div>';
    h += '<div class="vl"><span class="vh">Nothing to do beyond briefing staff</span><p>' + esc(v.nothing.length ? v.nothing.join(', ') : 'None of your tools.') + '</p></div>';
    if (v.pending.length) h += '<p class="meta">Not finished: ' + esc(v.pending.join(', ')) + '. <button type="button" class="linkbtn" data-act="step" data-step="tools">Answer the remaining questions</button></p>';
    return h + '</section>';
  }
  function vResults() {
    if (!state.tools.length) return '<section class="panel empty"><h2>No tools yet</h2><p>Pick the AI tools the hotel uses first.</p><button type="button" class="btn primary" data-act="step" data-step="tools">Choose my tools</button></section>';
    var ev = evals(), rows = G.plan(state, ev, CTX), v = G.verdict(state, ev, rows, CTX), h = '';
    if (state.example) h += '<div class="note warn"><p>Fictional example hotel.</p><button type="button" class="btn" data-act="clear">Start with my hotel</button></div>';
    h += verdictBox(v);
    h += '<div class="tiles" aria-label="Tools by level">' + G.tiles(ev, CTX).map(function (t) { return '<span class="tile"><span class="n">' + t.n + '</span>' + chip(t.tier) + '</span>'; }).join('') + '</div>';
    h += '<p class="meta">"Possibly" means an answer was "Not sure" or a deciding question is still open: the level is the careful one until the vendor answers. Levels from the AI Register\'s rules.</p>';
    h += '<section class="panel flush"><div class="ph" style="padding:16px 18px 6px"><h2>Your tools</h2></div>';
    ev.forEach(function (e) { h += resultCard(e); });
    h += '</section>';
    h += planSection(rows);
    h += honestBox();
    h += '<div class="btnrow"><button type="button" class="btn primary" data-act="step" data-step="vendors">Next: questions for your vendors</button></div>';
    return h;
  }
  function resultCard(e) {
    var t = e.tool, open = ui.open[t.id] != null ? ui.open[t.id] : GD.tiers[e.tier].rank > 1 || e.tier === 'pending';
    var h = '<details class="wcard" data-card="' + t.id + '"' + (open ? ' open' : '') + ' style="display:block"><summary><span class="sumline">' + esc(e.name) + ' ' + chip(e.tier) + (e.badge ? ' <span class="lb lb-notai">' + esc(e.badge) + '</span>' : '') + (t.vendor ? ' <span class="meta">' + esc(t.vendor) + '</span>' : '') + '</span></summary><div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">';
    if (e.tier === 'pending') return h + '<p>' + plural(e.unanswered, 'answer') + ' missing. <button type="button" class="linkbtn" data-act="step" data-step="tools">Finish on the Tools page</button></p></div></details>';
    var bn = (REF.basis[e.basis.basis] || {}).name;
    h += '<p class="why"><strong>Why:</strong> ' + esc(e.reason) + cite(e.basis.prov) + (bn ? ' <span class="meta">· rests on: ' + esc(bn.toLowerCase()) + '</span>' : '') + '</p>';
    var dk = e.c.dateKey;
    if (dk) { var d = REF.dates[dk]; h += '<p class="meta">' + (d <= TODAY ? 'Applies since ' : 'Applies from ') + esc(fmt(d)) + '.</p>'; }
    else if (e.tier === 'phigh') h += '<p class="meta">If it is high-risk, the hotel\'s duties apply from ' + esc(fmt(REF.dates.highrisk)) + '.</p>';
    if (e.roleText) h += '<p class="why"><strong>Your role:</strong> ' + esc(e.roleText) + '</p>';
    if (e.c.alsoTransparency) h += '<p class="meta">It also has to tell people they deal with AI (transparency).</p>';
    G.stillOpenLines(e).forEach(function (l) { h += '<p class="open-l">' + esc(l) + '</p>'; });
    if (L.maybeLegacy(t, e.c, REF)) h += '<p class="meta">May be a legacy tool: ask the vendor.</p>';
    if (e.type.chatNotice && (e.tier === 'transp' || e.tier === 'ptransp' || e.c.packs.chat) && e.role !== 'maker') h += noticeTemplate(true);
    else if (e.type.chatNotice && e.c.packs.chat) h += noticeTemplate(true);
    h += registerLink(e);
    return h + '</div></details>';
  }
  function noticeTemplate(collapsed) {
    var tp = GD.templates.chatNotice;
    return '<details' + (collapsed ? '' : ' open') + '><summary>' + esc(tp.title) + ' (template)</summary><p><span class="draft">' + esc(GD.templates.draftMark) + '</span></p><pre class="tpl">' + esc(tp.text.replace(/\{hotel\}/g, hotelName())) + '</pre>' +
      '<div class="btnrow"><button type="button" class="btn sm" data-act="copytext" data-what="notice">Copy the notice</button></div></details>';
  }
  function lawCell(r) { return '<span class="' + (/^Yes/.test(r.law) ? 'law-yes' : '') + '">' + esc(r.law) + (r.tag && r.law === 'Yes, other law' ? ' <span class="meta">(' + esc(r.tag) + ')</span>' : '') + '</span>'; }
  function planSection(rows) {
    var h = '<section class="panel flush" aria-labelledby="planh"><div class="ph" style="padding:16px 18px 6px"><h2 id="planh">Plan</h2><span class="meta">' + plural(rows.filter(function (r) { return !r.done; }).length, 'item') + ' open</span></div>';
    h += '<p class="meta" style="padding:0 18px 10px">Hotel-wide items appear once; vendor items once per vendor. "Required by law?" shows who the duty falls on; the article sits behind "Why".' + (state.hotel.size === 's' ? ' In a hotel under 50 rooms one person often covers several of these roles.' : '') + '</p>';
    if (!rows.length) return h + '<p class="meta" style="padding:0 18px 16px">Nothing yet: answer the tool questions first.</p></section>';
    var groups = {}, keys = [];
    rows.forEach(function (r) { var k = G.isNow(r, TODAY) ? 'now' : r.when; if (!groups[k]) { groups[k] = []; keys.push(k); } groups[k].push(r); });
    h += '<div class="planrow head" aria-hidden="true"><div></div><div>What to check</div><div>Who</div><div>Required by law?</div><div>Do by</div></div>';
    keys.forEach(function (k) {
      h += '<div class="pgrp">' + (k === 'now' ? 'Now' : 'By ' + esc(fmt(k))) + '<span class="meta">' + plural(groups[k].length, 'item') + '</span></div>';
      groups[k].forEach(function (r) {
        var why = (r.ref ? '<span class="cite">' + esc(r.ref) + '</span> ' : '') + esc(r.note || '') + ' Check with your adviser.';
        h += '<div class="planrow' + (r.done ? ' done' : '') + '"><div><input type="checkbox" id="p-' + esc(r.key) + '" data-plan="' + esc(r.key) + '"' + (r.done ? ' checked' : '') + ' aria-label="Done"></div>' +
          '<div><label class="pt" for="p-' + esc(r.key) + '">' + esc(r.text) + '</label>' + (r.tools.length ? '<div class="meta">' + esc(r.scope === 'hotel' ? 'Whole hotel (' + r.tools.length + ' tools)' : r.tools.join(', ')) + '</div>' : '') +
          '<details><summary>Why</summary>' + why + '</details></div>' +
          '<div data-l="Who">' + esc(r.who) + '</div><div data-l="Required by law?">' + lawCell(r) + '</div><div data-l="Do by">' + (k === 'now' ? 'Now' + (r.since && r.since <= TODAY ? '<span class="meta"> · applies since ' + esc(fmt(r.since)) + '</span>' : '') : esc(fmt(r.when))) + '</div></div>';
      });
    });
    return h + '</section>';
  }
  function honestBox() {
    var o = GD.honest, H = state.hotel, nat = NAT[H.country];
    var h = '<details class="panel honest"><summary>Good to know: dates, fines and who enforces</summary><div style="display:flex;flex-direction:column;gap:12px">';
    h += '<p>' + esc(o.picture) + '</p>';
    h += '<h3>Dates</h3><div class="tblw"><table><thead><tr><th>Date</th><th>What happens</th><th>Source</th></tr></thead><tbody>' + o.dates.map(function (d) { return '<tr><td class="num">' + esc(fmt(d[0])) + '</td><td>' + esc(d[1]) + '</td><td><span class="cite">' + esc(d[2]) + '</span></td></tr>'; }).join('') + '</tbody></table></div>';
    h += '<h3>Maximum fines</h3><div class="tblw"><table><thead><tr><th>For</th><th>Ceiling</th><th>Source</th></tr></thead><tbody>' + o.fines.map(function (f) { return '<tr><td>' + esc(f[0]) + '</td><td>' + esc(f[1]) + '</td><td><span class="cite">' + esc(f[2]) + '</span></td></tr>'; }).join('') + '</tbody></table></div>';
    h += '<ul class="steps">' + o.fineNotes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>';
    h += '<h3>Who enforces</h3><p>' + esc(o.enforcers) + (nat ? ' For ' + esc(COUNTRY[H.country]) + ': ' + esc(nat.aiActAuthority) + '.' : '') + '</p>';
    h += '<h3>Data protection</h3><p>' + esc(o.gdpr) + '</p>';
    h += '<p class="meta"><strong>To verify:</strong> ' + esc(o.guidelines) + '</p>';
    h += '<p class="meta">Sources: ' + esc(o.sources.join('; ')) + '. Rules as of ' + esc(fmt(GD.meta.rulesAsOf)) + '.</p>';
    return h + '</div></details>';
  }

  // ---------- screen 4: vendors ----------
  var STATUS = [['not', 'Not asked yet'], ['asked', 'Asked the vendor'], ['fine', 'Answered: looks fine'], ['red', 'Answered: red flag']];
  function vVendors() {
    var ev = evals().filter(function (e) { return e.tier !== 'pending'; }), h = '';
    if (!ev.length) return '<section class="panel empty"><h2>No finished tools yet</h2><p>Answer the tool questions first.</p><button type="button" class="btn primary" data-act="step" data-step="tools">Go to Tools</button></section>';
    var shown = ev.filter(function (e) { return e.vendorShown; });
    var quiet = ev.filter(function (e) { return !e.vendorShown && !e.inhouse; });
    var built = ev.filter(function (e) { return e.inhouse; });
    h += '<section class="panel"><h2>Questions for your vendors</h2><p class="sub">Only for tools above Minimal or with open questions. Send one email per vendor, then record each answer. A red-flag answer adds a follow-up to the plan.</p>' +
      '<p class="meta">The "fine answer" and "red flag" columns are the team\'s own drafts of good practice, not legal requirements.</p></section>';
    var byVendor = {}, order = [];
    shown.forEach(function (e) { var k = G.vendorKey(e); if (!byVendor[k]) { byVendor[k] = []; order.push(k); } byVendor[k].push(e); });
    order.forEach(function (k) {
      var list = byVendor[k];
      h += '<section class="panel"><div class="ph"><h2>' + esc(k) + '</h2><button type="button" class="btn sm" data-act="vmail" data-vendor="' + esc(k) + '">Copy the email to this vendor</button></div>';
      if (ui.copy && ui.copy.vendor === k) h += copyBox();
      list.forEach(function (e) {
        h += '<div class="toolh"><strong>' + esc(e.name) + '</strong>' + chip(e.tier) + '<span class="meta">' + esc(G.vendorStatus(e)) + '</span>' + (!e.vendorNeeded ? '<button type="button" class="btn sm" data-act="anyway" data-id="' + e.tool.id + '">Do not ask</button>' : '') + '</div>';
        G.stillOpenLines(e).forEach(function (l) { h += '<p class="open-l">' + esc(l) + '</p>'; });
        h += '<div class="vq head" aria-hidden="true"><div>Ask</div><div>A fine answer</div><div>A red flag</div><div>Status</div></div>';
        (e.type.vendor || []).forEach(function (q, i) {
          var st = (e.tool.vq[i] || {}).status || 'not', dt = (e.tool.vq[i] || {}).date || '';
          h += '<div class="vq"><div>' + esc(q.ask.replace(/\[product\]/g, e.name)) + '</div><div class="fine" data-l="A fine answer">' + esc(q.fine) + '</div><div class="red" data-l="A red flag">' + esc(q.red) + '</div>' +
            '<div class="ctl"><label><span class="sr">Status</span><select data-vqs="' + i + '" data-id="' + e.tool.id + '">' + STATUS.map(function (s) { return opt(s[0], s[1], st); }).join('') + '</select></label>' +
            '<label class="fld"><span>Date asked</span><input type="date" data-vqd="' + i + '" data-id="' + e.tool.id + '" value="' + esc(dt) + '"></label></div></div>';
        });
      });
      h += '</section>';
    });
    if (quiet.length) h += '<section class="panel"><h3>No questions needed</h3><p class="sub">These tools are Minimal with nothing open. Asking is optional.</p><ul class="steps">' + quiet.map(function (e) { return '<li>' + esc(e.name) + ' <button type="button" class="btn sm" data-act="anyway" data-id="' + e.tool.id + '">Ask anyway</button></li>'; }).join('') + '</ul></section>';
    if (built.length) h += '<section class="panel"><h3>Built by your hotel or group</h3><p>' + esc(built.map(function (e) { return e.name; }).join(', ')) + ': there is no vendor to ask. As the maker, your hotel or group carries the maker\'s duties; they are in the plan.</p></section>';
    h += templatesBox();
    h += '<div class="btnrow"><button type="button" class="btn primary" data-act="step" data-step="owner">Next: the owner page</button></div>';
    return h;
  }
  function copyBox() {
    return '<div class="copybox fld"><span>' + esc(ui.copy.title) + '</span><textarea id="copy-text" readonly>' + esc(ui.copy.text) + '</textarea><div class="btnrow"><button type="button" class="btn sm" data-act="copy">Copy</button><button type="button" class="btn sm" data-act="copy-close">Close</button></div></div>';
  }
  function templatesBox() {
    var tp = GD.templates, h = '<details class="panel"><summary>Templates</summary><div style="display:flex;flex-direction:column;gap:12px">';
    h += noticeTemplate(false);
    var ex = [{ ask: 'Which features of [product] use AI (learning, predicting, ranking, generating or conversing)? Please list them.' }];
    var sample = tp.supplierEmail.intro.replace(/\{to\}/g, '[vendor contact]').replace(/\{products\}/g, '[product name]').replace(/\{hotel\}/g, hotelName()) + ex.map(function (q, i) { return (i + 1) + '. ' + q.ask.replace(/\[product\]/g, '[product name]'); }).join('\n') + '\n[the questions for this tool, as listed above]\n' + tp.supplierEmail.outro.replace(/\{hotel\}/g, hotelName());
    h += '<details open><summary>' + esc(tp.supplierEmail.title) + '</summary><p><span class="draft">' + esc(tp.draftMark) + '</span> The buttons above fill it per vendor.</p><pre class="tpl">' + esc(sample) + '</pre></details>';
    h += '<p class="meta">' + esc(tp.withheld.join(' and ')) + ': ' + esc(tp.withheldNote) + '</p>';
    return h + '</div></details>';
  }

  // ---------- screen 5: owner page ----------
  function vOwner() {
    var ev = evals(), rows = G.plan(state, ev, CTX), text = G.ownerSummary(state, ev, rows, CTX), h = '';
    h += '<section class="panel owner"><div class="ph"><h2>Summary for the owner</h2><div class="btnrow"><button type="button" class="btn primary" data-act="pdf">Download PDF</button><button type="button" class="btn" data-act="copytext" data-what="owner">Copy as text</button></div></div>';
    h += '<p class="meta">One page for the owner or finance lead: tools and levels, what must be done now, vendor status and the decisions needed.</p>';
    var sec = null;
    text.split('\n').forEach(function (ln, i) {
      if (i < 3) { if (i === 2) h += '<p><strong>' + esc(ln) + '</strong></p>'; return; }
      if (!ln) { if (sec) { h += '</ul>'; sec = null; } return; }
      if (/^[A-Z][A-Z ,'\-]+$/.test(ln)) { h += '<h3>' + esc(ln.charAt(0) + ln.slice(1).toLowerCase().replace(/eu ai act/, 'EU AI Act')) + '</h3><ul>'; sec = ln; return; }
      h += '<li>' + esc(ln.replace(/^- /, '')) + '</li>';
    });
    if (sec) h += '</ul>';
    h += '</section>';
    h += '<section class="panel"><h2>Keep your work</h2><p class="sub">Everything stays in this browser. Save a backup file to keep it, move it to another computer or share it; open it here to carry on.</p>' +
      '<div class="btnrow"><button type="button" class="btn" data-act="backup">Save a backup file</button><label class="btn" for="restore">Open a backup file</label><input type="file" id="restore" accept="application/json,.json" class="sr" data-restore="1"><button type="button" class="btn warn" data-act="reset">Start again</button></div>' +
      (ui.confirmReset ? '<div class="note stop"><p>Clear every answer in this browser? Save a backup first if you may need it.</p><div class="btnrow"><button type="button" class="btn warn" data-act="reset-yes">Clear everything</button><button type="button" class="btn" data-act="reset-no">Keep it</button></div></div>' : '') + '</section>';
    if (ui.copy && ui.copy.vendor === '__owner') h += copyBox();
    return h;
  }

  // ---------- render ----------
  function render(keepScroll) {
    var y = window.scrollY, html = '';
    if (ui.step === 'hotel') html = vHotel();
    else if (ui.step === 'tools') html = vTools();
    else if (ui.step === 'results') html = vResults();
    else if (ui.step === 'vendors') html = vVendors();
    else html = vOwner();
    var active = document.activeElement, aid = active && active.id, adata = active && active.getAttribute && (active.getAttribute('data-t') ? active.getAttribute('data-t') + active.getAttribute('data-id') : null);
    $('view').innerHTML = html;
    STEPS.forEach(function (k) { var b = $('st-' + k); if (ui.step === k) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    if (keepScroll) { try { window.scrollTo(0, y); } catch (e) { /* ignore */ } }
    if (aid && $(aid)) $(aid).focus();
    else if (adata) { var el = document.querySelector('[data-t="' + active.getAttribute('data-t') + '"][data-id="' + active.getAttribute('data-id') + '"]'); if (el) el.focus(); }
  }
  function go(step) {
    ui.step = step; ui.copy = null; ui.confirmReset = false;
    if (step !== 'hotel') ui.welcome = false;
    try { window.history.pushState({ guide: step }, ''); } catch (e) { /* ignore */ }
    render(false);
    try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
    $('view').focus({ preventScroll: true });
  }
  window.addEventListener('popstate', function (e) { var s = e.state && e.state.guide; ui.step = STEPS.indexOf(s) >= 0 ? s : 'hotel'; render(false); });

  // ---------- files, PDF and the hub bridge ----------
  var host = { state: window.parent !== window ? 'pending' : 'none', waiters: [], seq: 0, calls: {}, direct: null };
  /* Inside the claude.ai hub this page runs in a frame and cannot save files itself, so it asks the hub page
     (postMessage, same origin only) or the artifact's downloads capability. From file:// it uses a plain download link. */
  function initHost() {
    if (window.claude && typeof window.claude.use === 'function') window.claude.use('downloads').then(function (d) { host.direct = d || null; }).catch(function () { host.direct = null; });
    if (host.state !== 'pending') return;
    window.addEventListener('message', function (e) {
      if (e.source !== window.parent || !e.data || typeof e.data !== 'object') return;
      var m = e.data;
      if (m.hub === 'pong') { host.state = m.downloads ? 'yes' : 'no'; host.waiters.splice(0).forEach(function (f) { f(); }); }
      else if (m.hub === 'download-result' && host.calls[m.id]) { var cb = host.calls[m.id]; delete host.calls[m.id]; cb(m); }
    });
    try { window.parent.postMessage({ hub: 'ping' }, window.location.origin); } catch (e) { host.state = 'no'; }
    setTimeout(function () { if (host.state === 'pending') { host.state = 'no'; host.waiters.splice(0).forEach(function (f) { f(); }); } }, 12000);
  }
  function whenHostKnown(fn) { if (host.state === 'pending') host.waiters.push(fn); else fn(); }
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
  var PDF_FONT = null;
  function pdfFont(doc) {
    var f = PDF_FONT || (PDF_FONT = (function () { try { return JSON.parse($('d-font').textContent); } catch (e) { return null; } })());
    if (!f) return 'helvetica';
    doc.addFileToVFS('rs-regular.ttf', f.regular); doc.addFont('rs-regular.ttf', 'RegisterSans', 'normal');
    doc.addFileToVFS('rs-bold.ttf', f.bold); doc.addFont('rs-bold.ttf', 'RegisterSans', 'bold');
    return 'RegisterSans';
  }
  function pdfSafe(s) { return String(s == null ? '' : s).replace(/[·]/g, '-').replace(/[^\u0000-ɏ‐-⁞€™←-↓]/g, '?'); }
  function makePdf() {
    if (!window.jspdf) return Promise.reject(new Error('jsPDF not bundled'));
    var ev = evals(), rows = G.plan(state, ev, CTX), lines = G.ownerSummary(state, ev, rows, CTX).split('\n');
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = 210, H = 297, M = 16, y = 22, FACE = pdfFont(doc);
    function font(style, size, grey) { doc.setFont(FACE, style); doc.setFontSize(size); doc.setTextColor(grey == null ? 20 : grey); }
    function need(h) { if (y + h > H - 18) { doc.addPage(); y = 20; } }
    font('bold', 15); doc.text(pdfSafe(GD.meta.title), M, y); y += 7;
    font('normal', 9.5, 90); doc.text(pdfSafe(lines[2]), M, y); y += 8;
    lines.slice(3).forEach(function (ln) {
      if (!ln) { y += 2; return; }
      if (/^[A-Z][A-Z ,'\-]+$/.test(ln)) { need(12); font('bold', 11); doc.text(pdfSafe(ln.charAt(0) + ln.slice(1).toLowerCase().replace(/eu ai act/, 'EU AI Act')), M, y); y += 5.5; return; }
      font('normal', 9.2); var ls = doc.splitTextToSize(pdfSafe(ln.replace(/^- /, '')), W - 2 * M - 5);
      need(ls.length * 4.2 + 1); doc.text('-', M + 1, y); doc.text(ls, M + 5, y); y += ls.length * 4.2 + 1.2;
    });
    var n = doc.getNumberOfPages();
    for (var i = 1; i <= n; i++) {
      doc.setPage(i); font('bold', 8, null); doc.setTextColor(163, 57, 42); doc.text(pdfSafe(REF.meta.banner), M, 11);
      font('normal', 7.5, 120); doc.text(doc.splitTextToSize(pdfSafe('AI Act guide (prototype), EHL SBP Group 36 for HFTP. Levels from the Hotel AI Register\'s rules. Rules as of ' + fmt(GD.meta.rulesAsOf) + '. Check with your adviser.'), W - 2 * M - 26), M, H - 11);
      doc.text('Page ' + i + ' of ' + n, W - M, H - 9, { align: 'right' });
    }
    return Promise.resolve(doc.output('blob'));
  }
  function copyText(text, title) {
    function fallback() { ui.copy = { vendor: '__owner', title: title, text: text }; render(true); var ta = $('copy-text'); if (ta) { ta.focus(); ta.select(); } toast('Select the text and copy it.'); }
    try {
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { toast('Copied.'); }, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  // ---------- events ----------
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b) return;
    var a = b.getAttribute('data-act'), id = b.getAttribute('data-id'), t;
    if (a === 'step') go(b.getAttribute('data-step'));
    else if (a === 'example') { state = example(); persist(); go('results'); }
    else if (a === 'clear') { state = blank(); adoptProfile(state); persist(); go('hotel'); }
    else if (a === 'addtype') {
      if (state.example) { state = blank(); adoptProfile(state); toast('Example cleared: this is now your hotel.'); }
      t = newTool(b.getAttribute('data-type')); state.tools.push(t); persist(); render(true);
      var card = $('card-' + t.id); if (card) { card.scrollIntoView({ block: 'start' }); var inp = card.querySelector('input.title'); if (inp) inp.focus({ preventScroll: true }); }
    }
    else if (a === 'remove') { state.tools = state.tools.filter(function (x) { return x.id !== id; }); persist(); render(true); toast('Removed.'); }
    else if (a === 'anyway') { t = toolById(id); if (t) { t.askAnyway = !t.askAnyway; persist(); render(true); } }
    else if (a === 'vmail') {
      var vn = b.getAttribute('data-vendor'), list = evals().filter(function (x) { return x.vendorShown && G.vendorKey(x) === vn; });
      ui.copy = { vendor: vn, title: 'Email to ' + vn + ' (' + GD.templates.draftMark + ')', text: G.vendorEmail(vn, list, state.hotel.name, CTX) }; render(true);
      var ta = $('copy-text'); if (ta) { ta.focus(); ta.select(); }
    }
    else if (a === 'copy') { var tx = $('copy-text'); if (tx) copyText(tx.value, ui.copy.title); }
    else if (a === 'copy-close') { ui.copy = null; render(true); }
    else if (a === 'copytext') {
      var what = b.getAttribute('data-what');
      if (what === 'notice') copyText(GD.templates.chatNotice.text.replace(/\{hotel\}/g, hotelName()), 'Guest chatbot AI notice');
      else { var ev = evals(); copyText(G.ownerSummary(state, ev, G.plan(state, ev, CTX), CTX), 'Summary for the owner'); }
    }
    else if (a === 'pdf') { toast('Preparing the PDF…'); makePdf().then(function (blob) { saveFile('ai-act-guide-owner-summary_' + TODAY + '.pdf', blob, 'application/pdf'); }).catch(function () { toast('The PDF could not be made here. Use "Copy as text" instead.'); }); }
    else if (a === 'backup') saveFile('ai-act-guide-backup_' + TODAY + '.json', JSON.stringify(state, null, 2), 'application/json');
    else if (a === 'reset') { ui.confirmReset = true; render(true); }
    else if (a === 'reset-no') { ui.confirmReset = false; render(true); }
    else if (a === 'reset-yes') { ui.confirmReset = false; state = blank(); try { window.localStorage.removeItem(KEY); } catch (e2) { /* ignore */ } paintSaved(); go('hotel'); toast('Cleared.'); }
    else if (a === 'to-register') {
      var hash = b.getAttribute('data-hash');
      if (window.parent !== window) { try { window.parent.postMessage({ hub: 'open', tool: 'register', hash: hash }, window.location.origin); } catch (e3) { /* ignore */ } }
      else window.location.href = '../register/index.html#' + hash;
    }
  });
  document.addEventListener('toggle', function (e) { var d = e.target; if (d && d.getAttribute && d.getAttribute('data-card')) ui.open[d.getAttribute('data-card')] = d.open; }, true);
  document.addEventListener('input', function (e) {
    var el = e.target, t;
    if (el.hasAttribute('data-h') && el.tagName === 'INPUT') { state.hotel[el.getAttribute('data-h')] = el.value; persistSoon(); }
    else if (el.hasAttribute('data-t') && el.tagName === 'INPUT') { t = toolById(el.getAttribute('data-id')); if (t) { t[el.getAttribute('data-t')] = el.value; persistSoon(); } }
  });
  document.addEventListener('change', function (e) {
    var el = e.target, t = el.getAttribute('data-id') ? toolById(el.getAttribute('data-id')) : null;
    /* Text fields only save on change: re-rendering there would swap the field the person is moving to. */
    if (el.hasAttribute('data-h')) { state.hotel[el.getAttribute('data-h')] = el.value; persist(); if (el.tagName === 'SELECT') render(true); }
    else if (el.hasAttribute('data-t') && t) { t[el.getAttribute('data-t')] = el.value; persist(); if (el.tagName === 'SELECT') render(true); }
    else if (el.hasAttribute('data-q') && t) {
      t.ans[el.getAttribute('data-q')] = el.value;
      /* Answers to a question that is no longer shown are dropped, so they cannot set the level. */
      var vis = G.visibleQuestions(CTX.types[t.type], t).map(function (q) { return q.id; });
      Object.keys(t.ans).forEach(function (k) { if (vis.indexOf(k) < 0) delete t.ans[k]; });
      persist(); render(true);
    }
    else if (el.hasAttribute('data-isai') && t) { t.isai[el.getAttribute('data-isai')] = el.value; syncIsAI(t); persist(); render(true); }
    else if (el.hasAttribute('data-notaiconf')) { t = toolById(el.getAttribute('data-notaiconf')); if (t) { t.notAIConfirmed = el.checked ? 'yes' : ''; persist(); render(true); } }
    else if (el.hasAttribute('data-plan')) { var k = el.getAttribute('data-plan'); if (el.checked) state.done[k] = TODAY; else delete state.done[k]; persist(); render(true); }
    else if (el.hasAttribute('data-vqs') && t) { var i = el.getAttribute('data-vqs'), q = t.vq[i] = t.vq[i] || {}; q.status = el.value; if (el.value !== 'not' && !q.date) q.date = TODAY; persist(); render(true); }
    else if (el.hasAttribute('data-vqd') && t) { var j = el.getAttribute('data-vqd'), q2 = t.vq[j] = t.vq[j] || {}; q2.date = el.value; persist(); }
    else if (el.hasAttribute('data-restore')) {
      var f = el.files && el.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try { var o = JSON.parse(rd.result); if (!o || o.v !== 1 || !Array.isArray(o.tools)) throw new Error('shape'); state = normalise(o); state.example = false; persist(); go('results'); toast('Backup opened: ' + plural(state.tools.length, 'tool') + '.'); }
        catch (err) { toast('That file is not a backup from this guide.'); }
      };
      rd.readAsText(f);
    }
  });

  // ---------- start ----------
  state = load();
  if (state && state.tools.length && !state.example) ui.welcome = true;
  if (!state) { state = blank(); try { window.localStorage.setItem(KEY + '-probe', '1'); window.localStorage.removeItem(KEY + '-probe'); } catch (e) { mem.ok = false; } }
  if (adoptProfile(state)) persist();
  $('banner').innerHTML = '<strong>' + esc(REF.meta.banner) + '</strong> It gives a first indication and items to check; it never says a tool is compliant.';
  $('asof').textContent = 'Rules as of ' + fmt(GD.meta.rulesAsOf);
  $('footlaw').textContent = 'Legal basis: ' + REF.meta.legalBasis + '. ' + GD.honest.guidelines + ' Prepared by EHL Hospitality Business School students for HFTP.';
  initHost();
  paintSaved();
  render(false);
  window.AIActGuide = { state: function () { return state; }, pdf: makePdf, evals: evals };
})();
