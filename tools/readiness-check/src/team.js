/* Team view (rules v4): the copies hotels chose to share, each recomputed with the current rules, with the full working-out.
   Each copy shows the rules version the hotel's own result was made with; a different verdict under the current rules is flagged.
   Only Editors of the hub can open this tab; the hub bar refuses list and delete for anyone else. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var D = JSON.parse($('d-data').textContent), L = window.RCLogic, S = window.RCStore, M = L.model(D);
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var TYPES = { independent: 'Independent hotel', group: 'Part of a group, run by the group', managed: 'Managed or franchised' };
  var ROLES = { gm: 'General manager', owner: 'Owner or asset manager', dept: 'Head of a department', it: 'IT or CIO', fin: 'Finance', other: 'Other' };
  /* TEAM machine (src/flow.js teamNext): t.phase 'loading' | 'ready' | 'empty' | 'error'; t.del null | 'confirm' | 'deleting'.
     send(event) is the only writer of t. A list answer that arrives after a newer Refresh is ignored (seq). */
  var F = window.RCFlow;
  var subs = [], old = 0, sel = null, err = '', t = { phase: 'loading', del: null }, seq = 0;
  function send(ev, n) { var to = F.teamNext(t, ev, n); if (!to) return false; t = to; return true; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(iso) { if (!iso) return ''; var d = new Date(iso); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ', ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function pct(v) { return v == null ? '–' : Math.round(v * 100) + '%'; }
  var toastT;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 4000); }
  function title(s) { return s.named && s.hotelName ? s.hotelName : 'No hotel name · ' + (ROLES[s.role] || 'role not given') + ', ' + (TYPES[s.type] || 'type not given') + (s.country ? ', ' + s.country : ''); }

  function load() {
    var my = ++seq; err = ''; render();
    S.list().then(function (docs) {
      if (my !== seq) return;
      docs = Array.isArray(docs) ? docs : [];
      old = docs.filter(function (d) { return d && d.v !== 3; }).length;
      subs = docs.filter(function (d) { return d && d.v === 3 && M.UI[d.useId]; }).sort(function (a, b) { return String(b.sharedAt).localeCompare(String(a.sharedAt)); });
      if (!sel || !subs.some(function (s) { return s._id === sel; })) sel = subs.length ? subs[0]._id : null;
      send('loaded', subs.length); render();
    }, function (e) {
      if (my !== seq) return;
      err = e && e.code === 'not_allowed' ? 'Only Editors of the hub can see shared checks.' : 'The shared checks could not be loaded. Try Refresh list.';
      subs = []; sel = null; send('failed'); render();
    });
  }

  function flowCard() {
    return '<section class="panel"><h3>Where the data goes</h3><div class="flow">' +
      '<div><b>1 · Hotel</b><span>Role, how the hotel is run, country, tool, stage. Hotel name only if they tick it.</span></div>' +
      '<div><b>2 · Questions</b><span>Must-haves, check-first, building-block and add-on questions, tick lists of what the tool needs, plus X1, X2a/b, XG, XL.</span></div>' +
      '<div><b>3 · Points</b><span>Yes 2 · Partly 1 · No 0. “Don\'t know yet”, “Doesn\'t apply” and the ways out are left out. Lists: 2 × in place ÷ (in place + not yet). A must-have Yes needs a note (any text; nobody checks it); without one it is “Yes, note missing”.</span></div>' +
      '<div><b>4 · Verdict</b><span>A must-have at No or Partly, or an area below 40% with at least two known answers: ' + esc(L.LEVELS.stop.name) + '. A must-have unknown or without its note, or an area with no known answer: ' + esc(L.LEVELS.open.name) + '. Else: ' + esc(L.LEVELS.pilot.name) + '. An area where every answer is “Doesn\'t apply” is left out. No 0–100 score.</span></div>' +
      '<div><b>5 · Kept</b><span>In the hotel\'s browser and file. A copy reaches this page only if they press “Share a copy”.</span></div>' +
      '</div><details><summary>Changed in rules v4</summary><ul class="tight">' + L.CHANGES.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></details><p class="meta">Rules ' + esc(L.RULES) + '. Copies made with earlier rules are recomputed here; each one shows the rules it was made with. Research behind the rules: reports/Council - readiness check audit.md (20 Nov 2026) and reports/Readiness check retention and trust.md. Full D6 framework: <a href="../readiness/index.html">open the research tool</a>.</p></section>';
  }

  function listPanel() {
    var h = '<section class="panel" style="padding:0;gap:0;overflow:hidden"><div style="padding:14px 14px 10px"><h3>Shared checks</h3><p class="meta">' +
      (t.phase === 'loading' ? 'Loading…' : subs.length + ' shared' + (S.mode() === 'local' ? ' (this browser only: open the hub on claude.ai for the real list)' : '') + (old ? ' · ' + old + ' in the old v2 format not shown' : '')) + '</p></div>';
    if (err) h += '<p class="warnline" style="padding:0 14px 12px">' + esc(err) + '</p>';
    if (t.phase === 'empty') h += '<p class="meta" style="padding:0 14px 14px">Nothing shared yet. A hotel shares from the bottom of its result page.</p>';
    subs.forEach(function (s) {
      var lv = L.LEVELS[s.level] || L.LEVELS.open;
      h += '<button type="button" class="sub-row" data-act="sel" data-id="' + esc(s._id) + '" aria-current="' + (s._id === sel) + '"><strong>' + esc(title(s)) + '</strong><span class="meta">' + esc(s.useName) + '</span><span class="btnrow"><span class="chip c-' + lv.chip + '">' + esc(L.levelName(s.level, s.stage)) + '</span><span class="meta">' + esc(s.met) + '/' + esc(s.gates) + ' must-haves · ' + esc(fmt(s.sharedAt)) + (s.rules && s.rules !== L.RULES ? ' · earlier rules' : '') + '</span></span></button>';
    });
    return h + '</section>';
  }

  function ansText(q, A) {
    if (q.list) return q.items.map(function (t, i) { var v = A[q.code + '#' + i]; return t + ': ' + ({ y: 'in place', n: 'not yet', k: "don't know", na: "doesn't apply" }[v] || 'not answered'); }).join(' · ');
    return A[q.code] === 'y2' ? 'All-in-one system' : L.answerText(q, A[q.code]) || 'Not answered';
  }

  function detail(s) {
    var x = M.UI[s.useId], A = s.answers || {}, P = s.named && s.proofs ? s.proofs : Object.keys(s.proofGiven || {}).reduce(function (o, k) { o[k] = 'note given (text not shared)'; return o; }, {}), e = L.evaluate(M, x, { type: s.type, country: s.country }, A, P, s.who || {}, s.stage), lv = L.LEVELS[e.level];
    var h = '<section class="panel"><div class="btnrow" style="justify-content:space-between"><div><h2>' + esc(title(s)) + '</h2><p class="meta">' + esc([ROLES[s.role], TYPES[s.type], s.country, L.STAGES[s.stage] && L.STAGES[s.stage].name].filter(Boolean).join(' · ')) + '</p></div>' +
      '<span class="chip big c-' + lv.chip + '">' + esc(L.levelName(e.level, s.stage)) + '</span></div>' +
      '<p><strong>' + esc(x.name) + '</strong> <span class="meta">' + esc(x.deptName) + ' · ' + esc(x.arch ? x.arch + ' ' + M.ARCH[x.arch].s : 'no type') + ' · ' + esc(x.int) + ' effort' + (x.add.length ? ' · add-ons: ' + x.add.map(function (k) { return M.ADD[k].tag; }).join(', ') : '') + (x.label ? ' · register label: ' + esc((M.REG.labels[x.label.base] || {}).name || x.label.base) : '') + '</span></p>' +
      '<p><strong>' + esc(L.verdict(e, s.stage)) + '</strong></p><p>' + esc(L.countLine(e)) + ' · ' + e.counts.answered + ' of ' + e.counts.asked + ' answered, ' + e.counts.find + ' to find out · ' + e.counts.open + ' open items in ' + e.counts.openQs + ' questions</p>' +
      '<p class="meta" id="made-with">Shared ' + esc(fmt(s.sharedAt)) + ' · the hotel\'s result was made with rules ' + esc(s.rules || 'not recorded') + (s.rules && s.rules !== L.RULES ? ' (earlier rules); recomputed here with rules ' + esc(L.RULES) : '') + (s.named ? ' · name and notes shared' : ' · no hotel name, no note texts') + '</p>' +
      (s.level !== e.level ? '<p class="warnline" id="differs">Verdict the hotel saw when it shared: ' + esc(L.levelName(s.level, s.stage)) + ' (' + esc(s.met) + ' of ' + esc(s.gates) + ' must-haves). With the current rules: ' + esc(L.levelName(e.level, s.stage)) + '. The hotel has not seen the new one unless it reopened its check.</p>' : '') +
      ((s.snaps || []).length > 1 ? '<p class="meta">Their history: ' + s.snaps.map(function (h2) { return esc(fmt(h2.at).split(',')[0]) + ' ' + esc(L.levelName(h2.level, s.stage)) + ' (' + h2.met + ' done, ' + h2.open + ' open)'; }).join(' → ') + '</p>' : '') +
      '</section>';
    h += '<section class="panel"><h3>Working out, step by step</h3><ol class="steps">' + e.steps.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></section>';
    h += '<section class="panel"><h3>Must-haves</h3><div class="tblw"><table><thead><tr><th>Code</th><th>Question</th><th>Answer</th><th>Note</th><th>Status</th></tr></thead><tbody>' +
      e.gates.map(function (g) { return '<tr><td class="mono">' + esc(g.q.code) + '</td><td>' + esc(g.q.q) + '</td><td>' + esc(ansText(g.q, A)) + (A[g.q.code] === 'k' ? '<br><span class="meta">Ask: ' + esc(L.WHO[(s.who || {})[g.q.code] || g.q.who]) + '</span>' : '') + '</td><td>' + (s.named ? esc(P[g.q.code] || '') : '<span class="meta">' + (P[g.q.code] ? 'given, text not shared' : 'none') + '</span>') + '</td><td>' + (g.met ? 'In place' : g.unconf ? 'Yes, note missing' : g.known ? '<strong>Not in place</strong>' : 'Not known' + (g.s.flag ? '<br><span class="meta">' + esc(g.s.flag) + '</span>' : '')) + '</td></tr>'; }).join('') +
      '</tbody></table></div></section>';
    h += '<section class="panel"><h3>Every answer and its points</h3><div class="tblw"><table><thead><tr><th>Code</th><th>Question</th><th>Why it was asked</th><th>Answer</th><th style="text-align:right">Points</th></tr></thead><tbody>';
    L.AK.forEach(function (a) {
      var r = e.area[a]; if (!r.asked) return;
      h += '<tr class="areahead"><td colspan="4">' + esc(r.name) + ' <span class="meta">(' + r.answered + ' of ' + r.asked + ' answered, ' + r.known + ' with points)</span></td><td class="num">' + (r.max ? r.pts + ' / ' + r.max + ' = ' + pct(r.pct) + ' · ' + esc(r.word) : esc(r.word)) + '</td></tr>';
      r.items.forEach(function (it) {
        var q = it.q;
        h += '<tr><td class="mono">' + esc(q.code) + (q.gate ? '<br><span class="chip c-must">Must</span>' : '') + '</td><td>' + esc(q.q) + (q.list ? '<br><span class="meta">' + esc(q.items.join(' · ')) + '</span>' : '') + '</td><td class="meta">' + esc((q.reasons || []).join('; ')) + '</td><td>' + esc(ansText(q, A)) + (it.s.flag ? '<br><span class="warnline">' + esc(it.s.flag) + '</span>' : '') + '</td><td class="num">' + (it.s.pts == null ? 'left out' : it.s.pts + ' / 2') + '</td></tr>';
      });
    });
    h += '</tbody></table></div></section>';
    h += '<section class="panel"><h3>Their action plan</h3><ol class="steps">' + e.actions.map(function (a) { return '<li>' + esc(a.text) + ' <span class="meta">(' + esc(a.group) + ', ' + esc(L.whoName(a.who)) + ')</span></li>'; }).join('') + '</ol></section>';
    h += '<section class="panel" data-del="' + (t.del || 'none') + '"><h3>Delete</h3>' + (t.del === 'confirm' ? '<p>Delete this shared copy? The hotel keeps its own copy. This cannot be undone.</p><div class="btnrow"><button type="button" class="btn warn" data-act="del-yes" id="del-yes">Delete copy</button><button type="button" class="btn" data-act="del-no" id="del-no">Cancel</button></div>'
      : t.del === 'deleting' ? '<p class="meta" role="status">Deleting…</p>' : '<div><button type="button" class="btn warn" data-act="del" id="del">Delete this shared copy</button></div>') + '</section>';
    return h;
  }

  function render() {
    var s = t.phase === 'ready' ? subs.filter(function (d) { return d._id === sel; })[0] : null;
    $('view').setAttribute('data-state', t.phase); $('view').setAttribute('data-del', t.del || 'none'); document.body.setAttribute('data-store', S.state());
    var rb = document.querySelector('[data-act="refresh"]'); if (rb) rb.disabled = t.phase === 'loading' || t.del === 'deleting';
    $('view').innerHTML = flowCard() + '<div class="teamgrid" style="margin-top:16px">' + listPanel() + '<div style="display:flex;flex-direction:column;gap:16px;min-width:0">' + (s ? detail(s) : '<section class="panel"><p class="meta">' + (t.phase === 'loading' ? 'Loading the shared checks…' : t.phase === 'error' ? 'Nothing to show until the list loads.' : t.phase === 'empty' ? 'No shared checks yet.' : 'Select a check to see its working-out.') + '</p></section>') + '</div></div>';
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'refresh') { if (send('refresh')) load(); }
    else if (a === 'sel') { if (send('select')) { sel = b.getAttribute('data-id'); render(); } }
    else if (a === 'del') { if (send('ask-del')) { render(); var y = $('del-yes'); if (y) y.focus(); } }
    else if (a === 'del-no') { if (send('cancel-del')) render(); }
    else if (a === 'del-yes') {
      if (!send('yes-del')) return;
      var id = sel; render();
      S.remove(id).then(function () { send('deleted'); if (sel === id) sel = null; toast('Shared copy deleted.'); load(); },
        function () { send('del-failed'); render(); toast('The copy could not be deleted.'); });
    }
  });
  load();
  /* For agents and tests. */
  window.ReadinessTeam = { subs: function () { return subs; }, state: function () { return { phase: t.phase, del: t.del, selected: sel, count: subs.length, old: old, error: err, store: S.state() }; } };
})();
