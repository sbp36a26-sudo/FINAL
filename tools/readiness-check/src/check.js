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

  function blank() { return { id: newId(), step: 'start', hotel: { name: '', role: '', type: '', country: '' }, stage: '', useId: '', A: {}, P: {}, Who: {}, owner: { ask: '', cost: '', by: '' }, next: { when: '', date: '' }, snaps: [], share: { on: false, named: false }, sharedAt: null, created: new Date().toISOString(), q: '', dept: '' }; }
  var mine = lget(MY, {});
  var st = mine[lget(CUR, '')] ? Object.assign(blank(), mine[lget(CUR, '')]) : blank();
  if (st.step !== 'start' && !M.UI[st.useId]) st.step = 'start';
  function keep() {
    st.updated = new Date().toISOString();
    if (st.useId) { var r = Object.assign({}, st); delete r.q; delete r.dept; mine[st.id] = r; lset(MY, mine); }
    lset(CUR, st.useId ? st.id : '');
  }
  function ev() { return L.evaluate(M, M.UI[st.useId], st.hotel, st.A, st.P, st.Who, st.stage); }

  var toastT;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 4200); }

  // ---------- start ----------
  function myList() {
    var ids = Object.keys(mine).filter(function (k) { var r = mine[k]; return M.UI[r.useId] && ((r.snaps && r.snaps.length) || Object.keys(r.A || {}).length); }).sort(function (a, b) { return String(mine[b].updated).localeCompare(String(mine[a].updated)); });
    if (!ids.length) return '';
    var h = '<section class="panel"><h2>Your checks in this browser</h2><p class="sub">Pick one up where you left it. "Update open items" shows only what is still open.</p><div>';
    ids.forEach(function (k) {
      var r = mine[k], x = M.UI[r.useId], e = L.evaluate(M, x, r.hotel, r.A, r.P, r.Who, r.stage), last = r.snaps && r.snaps[r.snaps.length - 1];
      h += '<div class="mycheck"><div class="g1"><strong>' + esc(x.name) + '</strong><span class="meta">' + esc([r.hotel.name, L.STAGES[r.stage] && L.STAGES[r.stage].name, 'last changed ' + fmtDate(r.updated)].filter(Boolean).join(' · ')) + '</span>' +
        '<span class="btnrow"><span class="chip c-' + L.LEVELS[e.level].chip + '">' + esc(L.LEVELS[e.level].name) + '</span><span class="meta">' + e.counts.met + ' of ' + e.counts.gates + ' must-haves met · ' + plural(e.actions.length, 'open item') + '</span></span>' +
        (r.next && r.next.when ? '<span class="meta">Planned next look: ' + esc(nextText(r.next)) + '</span>' : '') + '</div>' +
        '<div class="btnrow"><button type="button" class="btn primary" data-act="open-review" data-id="' + k + '">Update open items</button><button type="button" class="btn" data-act="open-result" data-id="' + k + '">See result</button>' +
        (confirmRm === k ? '<button type="button" class="btn warn" data-act="rm-yes" data-id="' + k + '">Remove for good</button><button type="button" class="btn" data-act="rm-no">Keep</button>' : '<button type="button" class="linkbtn" data-act="rm" data-id="' + k + '">Remove</button>') + '</div></div>';
    });
    return h + '</div></section>';
  }
  var confirmRm = null, confirmNew = false, confirmPick = null;
  function nextText(n) { var w = NEXT.filter(function (o) { return o[0] === n.when; })[0]; return (w ? w[1] : n.when) + (n.date ? ', ' + fmtDate(n.date) : ''); }

  function matches(u, q) {
    if (!q) return true;
    var hay = (u.name + ' ' + u.task + ' ' + u.deptName + ' ' + u.kw).toLowerCase();
    return q.split(/\s+/).filter(Boolean).every(function (t) { return hay.indexOf(t) >= 0 || (SYN[t] && hay.indexOf(SYN[t]) >= 0) || (t.length > 4 && hay.indexOf(t.slice(0, -1)) >= 0); });
  }

  function vStart() {
    var H = st.hotel, x = M.UI[st.useId], q = (st.q || '').trim().toLowerCase();
    var h = myList() + '<section class="panel intro"><h2>Before you begin</h2>' +
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
    if (x) {
      h += '<div class="panel" style="border-color:var(--accent)"><p class="meta">Selected</p><h3>' + esc(x.name) + '</h3><p class="meta">' + esc(x.deptName) + ' · ' + esc(typeName(x)) + ' tool · ' + esc(x.int) + ' effort</p><p>' + esc(x.task) + '</p>' +
        '<div><button type="button" class="linkbtn" data-act="unpick">Choose another tool</button></div></div>';
    } else {
      h += '<div class="formgrid"><label class="fld"><span>Search</span><input type="search" id="q" value="' + esc(st.q) + '" placeholder="For example chatbot, pricing, rota, food waste"></label>' +
        '<label class="fld"><span>Department</span><select id="dept">' + opt('', 'All departments', st.dept) + D.cat.depts.map(function (d) { return opt(d.id, d.name, st.dept); }).join('') + '</select></label></div><div class="list" id="picklist">' + pickList(q) + '</div>';
    }
    h += '</section>';
    h += '<section class="panel"><h2>3. Where are you with this tool?</h2><div class="opts stack" role="radiogroup" aria-label="Stage">' +
      Object.keys(L.STAGES).map(function (k) { return '<label class="opt' + (st.stage === k ? ' on' : '') + '"><input type="radio" name="stage" value="' + k + '" data-stage="1"' + (st.stage === k ? ' checked' : '') + '>' + esc(L.STAGES[k].long) + '</label>'; }).join('') + '</div>' +
      '<p class="meta">This changes the advice, not the rules: some answers can only be known once you have a vendor.</p></section>';
    h += notice();
    var ok = H.type && x && st.stage;
    h += '<div class="btnrow"><button type="button" class="btn primary" data-act="prep" id="go-prep"' + (ok ? '' : ' disabled') + '>Next: what you will need</button><span class="meta" id="go-hint">' + (ok ? '' : 'Choose how the hotel is run, a tool and where you are with it.') + '</span>' +
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
      '<div class="btnrow"><button type="button" class="btn primary" data-act="pdf">Download report (PDF)</button><button type="button" class="btn" data-act="file">Save as file</button><button type="button" class="btn" data-act="review">Update open items</button></div></section>';
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
    h += '<div class="btnrow"><button type="button" class="btn" data-act="edit">Go through all questions</button>' + (confirmNew ? '<span class="meta">Start a new check? This one stays in “Your checks”.</span><button type="button" class="btn warn" data-act="new-yes">Start new</button><button type="button" class="btn" data-act="new-no">Cancel</button>' : '<button type="button" class="btn" data-act="new">Start a new check</button>') + '</div>';
    return h;
  }
  function sharePanel() {
    var mode = S.mode();
    return '<section class="panel"><h2>Share with the project team (optional)</h2><p class="meta">Helps the EHL student team test the check. Sent: your role, hotel type, country, the tool, your answers and the verdict. Not sent: proof lines, owner note' + (st.share.named ? '' : ', hotel name') + '.</p>' +
      '<label class="chk"><input type="checkbox" data-share="named"' + (st.share.named ? ' checked' : '') + '> Also send our hotel name and proof lines so the team can discuss the result with us</label>' +
      '<div class="btnrow"><button type="button" class="btn" data-act="share">' + (st.sharedAt ? 'Send updated copy' : 'Share a copy') + '</button><span class="meta">' + (st.sharedAt ? 'Last shared ' + esc(fmtDate(st.sharedAt)) + (mode === 'local' ? ' (test copy in this browser)' : '') + '.' : mode === 'local' ? 'Outside the project hub this keeps a test copy in this browser only.' : '') + '</span>' +
      (st.sharedAt ? '<button type="button" class="linkbtn" data-act="unshare">Withdraw shared copy</button>' : '') + '</div></section>';
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
  var host = { state: window.parent !== window ? 'pending' : 'none', waiters: [], seq: 0, calls: {} };
  if (host.state === 'pending') {
    window.addEventListener('message', function (e) {
      if (e.source !== window.parent || !e.data) return;
      var m = e.data;
      if (m.hub === 'pong') { host.state = m.downloads ? 'yes' : 'no'; host.waiters.splice(0).forEach(function (f) { f(); }); }
      else if (m.hub === 'download-result' && host.calls[m.id]) { var cb = host.calls[m.id]; delete host.calls[m.id]; cb(m); }
    });
    try { window.parent.postMessage({ hub: 'ping' }, location.origin); } catch (e) { host.state = 'no'; }
    setTimeout(function () { if (host.state === 'pending') { host.state = 'no'; host.waiters.splice(0).forEach(function (f) { f(); }); } }, 12000);
  }
  function saveFile(name, blob) {
    function viaLink() { try { var u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); toast('Download started: ' + name); } catch (e) { toast('This browser could not save the file.'); } }
    function go2() {
      if (host.state !== 'yes') { viaLink(); return; }
      var id = 'd' + (++host.seq);
      host.calls[id] = function (m) { toast(m.ok ? 'Saved ' + name : m.code === 'declined' ? 'Download cancelled.' : 'The file could not be saved here.'); };
      window.parent.postMessage({ hub: 'download', id: id, filename: name, data: blob }, location.origin);
    }
    if (host.state === 'pending') host.waiters.push(go2); else go2();
  }
  function fileBase() { return (st.hotel.name || 'hotel').replace(/[^\w-]+/g, '-') + '_' + st.useId + '_' + new Date().toISOString().slice(0, 10); }
  function saveRecord() {
    var r = Object.assign({}, st); delete r.q; delete r.dept;
    saveFile('AI-readiness-check_' + fileBase() + '.json', new Blob([JSON.stringify({ kind: 'hftp-readiness-check', v: 3, rules: L.RULES, savedAt: new Date().toISOString(), check: r }, null, 1)], { type: 'application/json' }));
  }
  function loadRecord(file) {
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var o = JSON.parse(fr.result), r = o && o.check;
        if (!o || o.kind !== 'hftp-readiness-check' || !r || !M.UI[r.useId]) throw 0;
        st = Object.assign(blank(), r); st.step = 'result'; keep(); toast('Check opened from the file.'); go('result', true);
      } catch (e) { toast('This file is not a saved readiness check.'); }
    };
    fr.readAsText(file);
  }
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
    var html = st.step === 'start' ? vStart() : st.step === 'prep' ? vPrep() : st.step === 'review' ? vReview() : st.step === 'result' ? vResult() : vStep(st.step);
    $('view').innerHTML = html;
    if (fid && $(fid)) { $(fid).focus(); try { var v = $(fid).value.length; $(fid).setSelectionRange(v, v); } catch (e) { /* not text */ } }
  }
  function go(step, replace) {
    st.step = step; if (step === 'result') takeSnap(); else keep();
    try { history[replace ? 'replaceState' : 'pushState']({ rc: step }, ''); } catch (e) { /* ignore */ }
    render(); try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } $('view').focus({ preventScroll: true });
  }
  window.addEventListener('popstate', function (e) {
    var s = e.state && e.state.rc; if (s == null) s = 'start';
    if (s !== 'start' && !M.UI[st.useId]) s = 'start';
    st.step = s; if (s === 'result') takeSnap(); else keep(); render();
  });
  function openCheck(id, step) { var r = mine[id]; if (!r) return; st = Object.assign(blank(), r); go(step); }
  function updateStartButton() {
    var b = $('go-prep'); if (!b) return; var ok = !!(st.hotel.type && M.UI[st.useId] && st.stage);
    b.disabled = !ok; var hnt = $('go-hint'); if (hnt) hnt.textContent = ok ? '' : 'Choose how the hotel is run, a tool and where you are with it.';
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b || b.disabled) return;
    var a = b.getAttribute('data-act'), id = b.getAttribute('data-id');
    if (a === 'pick') {
      if (st.useId && st.useId !== id && Object.keys(st.A).length) { st = Object.assign(blank(), { hotel: st.hotel, stage: st.stage }); toast('New tool, new check. The earlier one stays in “Your checks”.'); }
      st.useId = id; keep(); render();
    }
    else if (a === 'unpick') { st.useId = ''; render(); }
    else if (a === 'prep') go('prep');
    else if (a === 'begin') go(0);
    else if (a === 'back') go(st.step === 'prep' ? 'start' : st.step === 0 ? 'prep' : st.step - 1);
    else if (a === 'next') go(st.step === 5 ? 'result' : st.step + 1);
    else if (a === 'to-result') go('result');
    else if (a === 'edit') go(0);
    else if (a === 'review') go('review');
    else if (a === 'open-review') openCheck(id, 'review');
    else if (a === 'open-result') openCheck(id, 'result');
    else if (a === 'rm') { confirmRm = id; render(); }
    else if (a === 'rm-no') { confirmRm = null; render(); }
    else if (a === 'rm-yes') { delete mine[id]; lset(MY, mine); confirmRm = null; if (st.id === id) st = blank(); keep(); render(); toast('Removed from this browser.'); }
    else if (a === 'new') { confirmNew = true; render(); }
    else if (a === 'new-no') { confirmNew = false; render(); }
    else if (a === 'new-yes') { confirmNew = false; var h = st.hotel; st = blank(); st.hotel = h; go('start'); }
    else if (a === 'copy-prep') { var w = b.getAttribute('data-who'), qs = byWho(L.selectQuestions(M, M.UI[st.useId], st.hotel))[w] || []; copy(prepText(w, qs), 'Questions'); }
    else if (a === 'copy-find') copy(findText(b.getAttribute('data-who')), 'Questions');
    else if (a === 'copy-vendor') copy('Questions about ' + M.UI[st.useId].name + ':\n\n' + L.vendorQs(M, M.UI[st.useId], ev()).map(function (q, i) { return (i + 1) + '. ' + q; }).join('\n'), 'Vendor questions');
    else if (a === 'copy-owner') copy(ownerText(), 'Note');
    else if (a === 'file') saveRecord();
    else if (a === 'pdf') { toast('Preparing the report…'); makePdf().then(function (blob) { saveFile('AI-readiness-check_' + fileBase() + '.pdf', blob); }).catch(function () { toast('The PDF could not be made here. Use “Copy a note for the owner” instead.'); }); }
    else if (a === 'share') { S.save(st.id, shareDoc()).then(function (m) { st.sharedAt = new Date().toISOString(); keep(); render(); toast(m === 'shared' ? 'Copy shared with the project team.' : 'Saved as a test copy in this browser only (outside the project hub).'); }, function () { toast('Sharing is not available here. Save the file and send it instead.'); }); }
    else if (a === 'unshare') { S.remove(st.id).then(function () { st.sharedAt = null; keep(); render(); toast('Shared copy withdrawn.'); }, function () { toast('Could not withdraw here. Ask the team to delete it.'); }); }
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.hasAttribute('data-q')) { var k = el.getAttribute('data-q'); st.A[k] = el.value; keep(); render(true); }
    else if (el.hasAttribute('data-stage')) { st.stage = el.value; keep(); render(true); }
    else if (el.hasAttribute('data-who')) { st.Who[el.getAttribute('data-who')] = el.value; keep(); }
    else if (el.tagName === 'SELECT' && el.hasAttribute('data-h')) { st.hotel[el.getAttribute('data-h')] = el.value; keep(); updateStartButton(); }
    else if (el.hasAttribute('data-n')) { st.next[el.getAttribute('data-n')] = el.value; keep(); }
    else if (el.hasAttribute('data-o') && el.type === 'date') { st.owner.by = el.value; keep(); }
    else if (el.hasAttribute('data-share')) { st.share.named = el.checked; keep(); render(true); }
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

  S.ready();
  try { history.replaceState({ rc: st.step }, ''); } catch (e) { /* ignore */ }
  if (st.step === 'result') takeSnap();
  render();
  window.ReadinessCheck = { state: function () { return st; }, model: M };
})();
