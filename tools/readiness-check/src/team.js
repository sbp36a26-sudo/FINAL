/* Team view: each client's readiness check and the full working-out. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var D = JSON.parse($('d-data').textContent), L = window.RCLogic, S = window.RCStore, M = L.model(D);
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var TYPES = { independent: 'Independent hotel', group: 'Part of a group, run by the group', managed: 'Managed or franchised' };
  var subs = [], sel = null, confirmDel = false, loading = true, err = '';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(iso) { if (!iso) return ''; var d = new Date(iso); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ', ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function pct(v) { return v == null ? '–' : Math.round(v * 100) + '%'; }
  var toastT;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 4000); }

  function load() {
    loading = true; err = ''; render();
    S.list().then(function (docs) {
      subs = docs.filter(function (d) { return d && d.useId && M.UI[d.useId]; }).sort(function (a, b) { return String(b.submittedAt).localeCompare(String(a.submittedAt)); });
      if (!sel || !subs.some(function (s) { return s._id === sel; })) sel = subs.length ? subs[0]._id : null;
      loading = false; render();
    }, function () { loading = false; err = 'The saved checks could not be loaded. Try Refresh list.'; render(); });
  }

  function flowCard() {
    return '<section class="panel"><h3>Where the data goes</h3><div class="flow">' +
      '<div><b>1 · Client</b><span>Hotel name, how it is run, country, chosen AI tool.</span></div>' +
      '<div><b>2 · Use case</b><span>From the 91-use catalogue: its type of tool (A1–A9), effort and risk add-ons (D6 data).</span></div>' +
      '<div><b>3 · Questions</b><span>Must-haves, questions to check first, those every tool of the type needs, add-on questions, resource needs, and 3 added on 18 Nov.</span></div>' +
      '<div><b>4 · Points</b><span>Yes 2 · Partly 1 · No or Not sure 0 · Does not apply leaves it out. A must-have Yes without proof counts as Partly.</span></div>' +
      '<div><b>5 · Areas</b><span>Points ÷ maximum in each of the six areas.</span></div>' +
      '<div><b>6 · Verdict and score</b><span>Any must-have not met or an area below 40%: foundations (score capped at 39). Any area below 75%: pilot (capped at 74). Otherwise scale. Score = average of the areas, then the cap.</span></div>' +
      '<div><b>7 · Saved</b><span>To the hub\'s shared database when the client sees the result; listed here.</span></div>' +
      '</div><p class="meta">Full framework, building blocks, companies and sources: <a href="../readiness/index.html">open the research tool</a>. Research behind the changes: reports/Hotel AI readiness check design.md.</p></section>';
  }

  function listPanel() {
    var h = '<section class="panel" style="padding:0;gap:0;overflow:hidden"><div style="padding:14px 14px 10px"><h3>Client checks</h3><p class="meta">' +
      (loading ? 'Loading…' : subs.length + ' saved' + (S.mode() === 'local' ? ' in this browser only (not inside the hub on claude.ai)' : '')) + '</p></div>';
    if (err) h += '<p class="warnline" style="padding:0 14px 12px">' + esc(err) + '</p>';
    if (!loading && !subs.length) h += '<p class="meta" style="padding:0 14px 14px">No checks yet. Complete one in the "Readiness check" tab and it appears here.</p>';
    subs.forEach(function (s) {
      var lv = L.LEVELS[s.level] ? s.level : 'found';
      h += '<button type="button" class="sub-row" data-act="sel" data-id="' + esc(s._id) + '" aria-current="' + (s._id === sel) + '"><strong>' + esc(s.hotel && s.hotel.name || 'Unnamed hotel') + '</strong><span class="meta">' + esc(s.useName) + '</span><span class="btnrow"><span class="chip c-' + lv + '">' + esc(L.LEVELS[lv].name) + '</span><span class="mono">' + esc(s.score) + '/100</span><span class="meta">' + esc(fmt(s.submittedAt)) + '</span></span></button>';
    });
    return h + '</section>';
  }

  function detail(s) {
    var x = M.UI[s.useId], hotel = s.hotel || {}, ev = L.evaluate(M, x, hotel, s.answers || {}, s.proofs || {});
    var h = '<section class="panel"><div class="btnrow" style="justify-content:space-between"><div><h2>' + esc(hotel.name || 'Unnamed hotel') + '</h2><p class="meta">' + esc([hotel.person, TYPES[hotel.type], hotel.country].filter(Boolean).join(' · ')) + '</p></div>' +
      '<div class="btnrow"><span class="chip c-' + ev.level + '" style="font-size:0.875rem">' + esc(L.LEVELS[ev.level].name) + '</span><span class="score" style="font-size:2rem">' + ev.score + '<small>/100</small></span></div></div>' +
      '<p><strong>' + esc(x.name) + '</strong> <span class="meta">' + esc(x.deptName) + ' · ' + esc(x.arch ? x.arch + ' ' + M.ARCH[x.arch].s : 'no type') + ' · ' + esc(x.int) + ' effort' + (x.add.length ? ' · add-ons: ' + x.add.map(function (k) { return M.ADD[k].tag; }).join(', ') : '') + '</span></p>' +
      '<p class="meta">Submitted ' + esc(fmt(s.submittedAt)) + (s.updatedAt && s.updatedAt !== s.submittedAt ? ' · last changed ' + esc(fmt(s.updatedAt)) : '') + ' · rules ' + esc(s.rules || '') + '</p>' +
      (s.score !== ev.score || s.level !== ev.level ? '<p class="warnline">Saved result was ' + esc(s.score) + ' (' + esc(L.LEVELS[s.level] ? L.LEVELS[s.level].name : s.level) + '); with the current rules it is ' + ev.score + ' (' + esc(L.LEVELS[ev.level].name) + ').</p>' : '') +
      '</section>';

    h += '<section class="panel"><h3>Working out, step by step</h3><ol class="steps">' + ev.steps.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></section>';

    h += '<section class="panel"><h3>Must-haves</h3><div class="tblw"><table><thead><tr><th>Code</th><th>Question</th><th>Answer</th><th>Proof given</th><th>Met?</th></tr></thead><tbody>' +
      ev.gates.map(function (g) {
        return '<tr><td class="mono">' + esc(g.q.code) + '</td><td>' + esc(g.q.q) + (g.q.note ? '<br><span class="meta">' + esc(g.q.note) + '</span>' : '') + '</td><td>' + esc(L.ANSWER[g.ans] || 'Not answered') + '</td><td>' + esc((s.proofs || {})[g.q.code] || '') + '</td><td>' + (g.met ? 'Yes' : '<strong>No</strong>' + (g.flag ? '<br><span class="meta">' + esc(g.flag) + '</span>' : '')) + '</td></tr>';
      }).join('') + '</tbody></table></div></section>';

    h += '<section class="panel"><h3>Every answer and its points</h3><div class="tblw"><table><thead><tr><th>Code</th><th>Question</th><th>Why it was asked</th><th>Answer</th><th style="text-align:right">Points</th></tr></thead><tbody>';
    L.AK.forEach(function (a) {
      var r = ev.area[a];
      h += '<tr class="areahead"><td colspan="4">' + esc(r.name) + '</td><td class="num">' + r.pts + ' / ' + r.max + ' = ' + pct(r.pct) + '</td></tr>';
      r.items.forEach(function (it) {
        h += '<tr><td class="mono">' + esc(it.q.code) + (it.q.gate ? '<br><span class="chip c-must">Must</span>' : '') + '</td><td>' + esc(it.q.q) + ((s.proofs || {})[it.q.code] ? '<br><span class="meta">Proof: ' + esc(s.proofs[it.q.code]) + '</span>' : '') + '</td><td class="meta">' + esc((it.q.reasons || []).join('; ')) + '</td><td>' + esc(L.ANSWER[it.ans] || 'Not answered') + (it.flag ? '<br><span class="warnline">' + esc(it.flag) + '</span>' : '') + '</td><td class="num">' + (it.ans === 'na' ? 'left out' : it.pts + ' / 2') + '</td></tr>';
      });
    });
    h += '</tbody></table></div></section>';

    h += '<section class="panel"><h3>Delete</h3>' + (confirmDel ? '<p>Delete this check for ' + esc(hotel.name) + '? This cannot be undone.</p><div class="btnrow"><button type="button" class="btn warn" data-act="del-yes" id="del-yes">Delete check</button><button type="button" class="btn" data-act="del-no">Cancel</button></div>' : '<div><button type="button" class="btn warn" data-act="del">Delete this check</button></div>') + '</section>';
    return h;
  }

  function render() {
    var s = subs.filter(function (d) { return d._id === sel; })[0];
    $('view').innerHTML = flowCard() + '<div class="teamgrid" style="margin-top:16px">' + listPanel() + '<div style="display:flex;flex-direction:column;gap:16px;min-width:0">' + (s ? detail(s) : '<section class="panel"><p class="meta">Select a check to see its working-out.</p></section>') + '</div></div>';
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'refresh') load();
    else if (a === 'sel') { sel = b.getAttribute('data-id'); confirmDel = false; render(); }
    else if (a === 'del') { confirmDel = true; render(); var y = $('del-yes'); if (y) y.focus(); }
    else if (a === 'del-no') { confirmDel = false; render(); }
    else if (a === 'del-yes') { S.remove(sel).then(function () { confirmDel = false; sel = null; toast('Check deleted.'); load(); }, function () { toast('The check could not be deleted.'); }); }
  });
  load();
  window.ReadinessTeam = { subs: function () { return subs; } };
})();
