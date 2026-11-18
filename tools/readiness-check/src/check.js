/* AI readiness check: the client-facing guided flow. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var D = JSON.parse($('d-data').textContent), L = window.RCLogic, S = window.RCStore;
  var M = L.model(D), R = D.rdy;
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var COUNTRIES = ['Austria', 'Belgium', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Other'];
  var TYPES = [['independent', 'Independent hotel'], ['group', 'Part of a group, run by the group'], ['managed', 'Managed or franchised']];
  var DRAFT = 'hftp-readiness-draft-v1';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtDate(iso) { var d = new Date(iso); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  function opt(v, l, cur) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>'; }
  function pct(v) { return v == null ? '–' : Math.round(v * 100) + '%'; }
  function typeName(x) { return x.arch ? M.ARCH[x.arch].s : 'Other tool'; }
  function effort(x) { return x.int + ' effort'; }

  var st = blank();
  function blank() { return { step: 'start', hotel: { name: '', person: '', role: '', type: '', country: '' }, useId: '', A: {}, P: {}, id: null, q: '', dept: '', saved: null, submittedAt: null }; }
  try { var d = JSON.parse(localStorage.getItem(DRAFT) || 'null'); if (d && d.hotel) st = Object.assign(blank(), d); } catch (e) { /* storage blocked */ }
  function keep() { try { localStorage.setItem(DRAFT, JSON.stringify(st)); } catch (e) { /* ignore */ } }

  var toastT;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 4200); }

  // ---------- start ----------
  function vStart() {
    var H = st.hotel, x = M.UI[st.useId], q = st.q.trim().toLowerCase();
    var h = '<section class="panel"><h2>1. About your hotel</h2><div class="formgrid">' +
      '<label class="fld"><span>Hotel or group name</span><input type="text" id="h-name" data-h="name" value="' + esc(H.name) + '" autocomplete="organization"></label>' +
      '<label class="fld"><span>Your name and role (optional)</span><input type="text" id="h-person" data-h="person" value="' + esc(H.person) + '" placeholder="For example Anna Weber, General manager"></label>' +
      '<label class="fld"><span>How the hotel is run</span><select id="h-type" data-h="type">' + opt('', 'Choose', H.type) + TYPES.map(function (t) { return opt(t[0], t[1], H.type); }).join('') + '</select></label>' +
      '<label class="fld"><span>Country</span><select id="h-country" data-h="country">' + opt('', 'Choose', H.country) + COUNTRIES.map(function (c) { return opt(c, c, H.country); }).join('') + '</select></label>' +
      '</div></section>';
    h += '<section class="panel"><h2>2. Which AI tool?</h2>' +
      '<div class="legend"><p><b>Type of tool:</b> what kind of AI it is. Tools of the same type need similar resources.</p>' +
      '<p><b>Effort:</b> Light (a subscription, little set-up) · Moderate (links to your PMS or CRM, clean data) · Heavy (hardware, group platforms or high legal risk).</p></div>';
    if (x) {
      h += '<div class="panel" style="border-color:var(--accent)"><p class="meta">Selected</p><h3>' + esc(x.name) + '</h3><p class="meta">' + esc(x.deptName) + ' · ' + esc(typeName(x)) + ' tool · ' + esc(effort(x)) + '</p><p>' + esc(x.task) + '</p>' +
        '<div><button type="button" class="linkbtn" data-act="unpick">Choose another tool</button></div></div>';
    } else {
      h += '<div class="formgrid"><label class="fld"><span>Search</span><input type="search" id="q" value="' + esc(st.q) + '" placeholder="For example chatbot, pricing, rota, camera"></label>' +
        '<label class="fld"><span>Department</span><select id="dept">' + opt('', 'All departments', st.dept) + D.cat.depts.map(function (d) { return opt(d.id, d.name, st.dept); }).join('') + '</select></label></div><div class="list">';
      var shown = M.USES.filter(function (u) { return (!st.dept || u.dept === st.dept) && (!q || (u.name + ' ' + u.task + ' ' + u.deptName).toLowerCase().indexOf(q) >= 0); });
      h += shown.map(function (u) { return '<button type="button" class="pick" data-act="pick" data-id="' + u.id + '"><span class="pn">' + esc(u.name) + '</span><span class="meta">' + esc(effort(u)) + '</span><span class="meta">' + esc(u.deptName) + ' · ' + esc(typeName(u)) + ' tool</span></button>'; }).join('') || '<p class="meta" style="padding:12px 4px">Nothing matches. Try another word.</p>';
      h += '</div>';
    }
    h += '</section>';
    var ok = H.name.trim() && H.type && x;
    var n = x ? L.selectQuestions(M, x, H).length : 0;
    h += '<div class="btnrow"><button type="button" class="btn primary" data-act="begin"' + (ok ? '' : ' disabled') + '>Start the check</button><span class="meta">' + (ok ? n + ' questions in 6 steps, about 10 minutes.' : 'Enter the hotel name, how it is run, and pick a tool to start.') + '</span></div>';
    return h;
  }

  // ---------- steps ----------
  function areaQs(i) { var x = M.UI[st.useId], a = L.AK[i]; return L.selectQuestions(M, x, st.hotel).filter(function (q) { return q.a === a; }); }
  function vStep(i) {
    var x = M.UI[st.useId], a = L.AK[i], area = M.AREA[a], qs = areaQs(i);
    var done = qs.filter(function (q) { return st.A[q.code]; }).length;
    var h = '<div class="prog"><p class="meta">Step ' + (i + 1) + ' of 6 · ' + esc(x.name) + '</p><div class="bar"><i style="width:' + Math.round((i) / 6 * 100) + '%"></i></div></div>';
    h += '<section class="panel"><h2>' + esc(area.name) + '</h2><p class="sub">' + esc(area.one) + '</p><div>';
    qs.forEach(function (q) {
      var cur = st.A[q.code] || '', name = 'q-' + q.code;
      var opts = [['y', 'Yes'], ['p', 'Partly'], ['n', 'No'], ['u', 'Not sure']];
      if (!q.gate && !q.res) opts.push(['na', 'Does not apply']);
      h += '<fieldset class="qa"><legend>' + esc(q.q) + '</legend>' +
        '<div class="btnrow">' + (q.gate ? '<span class="chip c-must">Must-have</span>' : '') + (q.src === 'research' ? '<span class="chip c-new">New question</span>' : '') + '</div>' +
        '<div class="opts" role="radiogroup">' + opts.map(function (o) { return '<label class="opt' + (cur === o[0] ? ' on' : '') + '"><input type="radio" name="' + name + '" id="' + name + '-' + o[0] + '" value="' + o[0] + '" data-q="' + q.code + '"' + (cur === o[0] ? ' checked' : '') + '>' + o[1] + '</label>'; }).join('') + '</div>';
      if (q.gate && cur === 'y') {
        var ev = L.EVIDENCE[q.code] || { ask: 'What could you show if someone asked? For example a name, a document or a date.', ex: q.proof || '' };
        h += '<div class="proof"><label for="pf-' + q.code + '"><strong>Confirm your Yes in one line.</strong> ' + esc(ev.ask) + '</label>' +
          '<input type="text" id="pf-' + q.code + '" data-proof="' + q.code + '" value="' + esc(st.P[q.code] || '') + '" placeholder="Type your answer here">' +
          (ev.ex ? '<span class="meta">Example: ' + esc(ev.ex) + '</span>' : '') + '</div>';
        h += '<p class="warnline"' + (String(st.P[q.code] || '').trim() ? ' hidden' : '') + '>Needed for a must-have: until you add this line, your Yes counts as Partly.</p>';
      }
      if (q.note) h += '<p class="meta">' + esc(q.note) + '</p>';
      h += '</fieldset>';
    });
    h += '</div></section>';
    h += '<div class="btnrow"><button type="button" class="btn" data-act="back">Back</button><button type="button" class="btn primary" data-act="next"' + (done === qs.length ? '' : ' disabled') + '>' + (i === 5 ? 'See my result' : 'Next') + '</button><span class="meta">' + done + ' of ' + qs.length + ' answered. "Not sure" is fine: it counts as No and becomes a to-do.</span></div>';
    return h;
  }

  // ---------- result ----------
  function bars(ev) {
    return '<div class="bars">' + ev.scored.map(function (r) {
      var lvl = r.pct < L.LOW ? 'found' : r.pct < L.HIGH ? 'pilot' : 'scale';
      var col = lvl === 'found' ? 'var(--lo)' : lvl === 'pilot' ? 'var(--md)' : 'var(--hi)';
      return '<div class="brow' + (ev.lowest === r ? ' low' : '') + '"><span class="lbl">' + esc(r.name) + (ev.lowest === r ? ' (weakest)' : '') + '</span><span class="track" role="img" aria-label="' + esc(r.name) + ' ' + pct(r.pct) + '"><i style="width:' + Math.max(2, Math.round(r.pct * 100)) + '%;background:' + col + '"></i></span><span class="num">' + pct(r.pct) + '</span></div>';
    }).join('') + '</div><p class="meta">Below 40%: build foundations first · 40–74%: ready to pilot · 75% or more: ready to scale.</p>';
  }
  function vResult() {
    var x = M.UI[st.useId], ev = L.evaluate(M, x, st.hotel, st.A, st.P), lv = L.LEVELS[ev.level], gp = L.gaps(ev);
    var action = R.levels[{ found: 0, pilot: 1, scale: 2 }[ev.level]].action;
    var h = '<section class="panel"><p class="meta">' + esc(st.hotel.name) + ' · ' + esc(x.name) + ' · ' + (st.submittedAt ? fmtDate(st.submittedAt) : '') + '</p>' +
      '<div class="result-head"><p class="score" aria-label="Readiness score ' + ev.score + ' out of 100">' + ev.score + '<small>/100</small></p>' +
      '<div style="display:flex;flex-direction:column;gap:6px"><p><span class="chip c-' + ev.level + '" style="font-size:0.9375rem">' + esc(lv.name) + '</span></p><p>' + esc(action) + '</p>' +
      (ev.cap !== null && ev.raw > ev.score ? '<p class="meta">Score capped at ' + ev.cap + ' because ' + esc(ev.capWhy.toLowerCase()) + '. The average of your six areas is ' + ev.raw + '.</p>' : '') + '</div></div>' +
      '<p class="meta">' + esc(st.saved === 'shared' ? 'Saved and shared with the EHL project team.' : st.saved === 'local' ? 'Saved in this browser only.' : '') + '</p></section>';
    h += '<section class="panel"><h3>Your six areas</h3>' + bars(ev) + '</section>';
    if (ev.unmet.length) {
      h += '<section class="panel"><h3>Must-haves not met</h3><p class="meta">Any one of these keeps the result at "Build foundations first", whatever the other answers.</p><div>' + ev.unmet.map(function (g) {
        return '<div class="gap"><span class="chip c-must">' + esc(L.ANSWER[g.ans] || 'Not answered') + '</span><div class="g1"><span>' + esc(g.q.q) + '</span>' + (g.q.proof ? '<span class="meta">What good looks like: ' + esc(g.q.proof) + '</span>' : '') + (g.flag ? '<span class="warnline">' + esc(g.flag) + '</span>' : '') + '</div></div>';
      }).join('') + '</div></section>';
    }
    var rest = gp.filter(function (g) { return g.kind !== 'must'; }).slice(0, 8);
    if (rest.length) {
      h += '<section class="panel"><h3>Next gaps to close, in order</h3><div>' + rest.map(function (g) {
        return '<div class="gap"><span class="chip ' + (g.kind === 'partly' ? 'c-pilot' : 'c-found') + '">' + esc(L.ANSWER[g.ans] || 'Not answered') + '</span><div class="g1"><span>' + esc(g.q.q) + '</span><span class="meta">' + esc(g.area) + (g.q.proof ? ' · What good looks like: ' + esc(g.q.proof) : '') + '</span></div></div>';
      }).join('') + '</div></section>';
    }
    h += '<div class="btnrow"><button type="button" class="btn primary" data-act="pdf">Download report (PDF)</button><button type="button" class="btn" data-act="copy">Copy summary</button><button type="button" class="btn" data-act="edit">Change answers</button><button type="button" class="btn" data-act="new">Start a new check</button></div>';
    return h;
  }

  // ---------- save ----------
  function submission() {
    var x = M.UI[st.useId], ev = L.evaluate(M, x, st.hotel, st.A, st.P), areas = {};
    ev.scored.forEach(function (r) { areas[r.a] = Math.round(r.pct * 100); });
    return { v: 2, rules: 'v2 (18 Nov 2026)', hotel: st.hotel, useId: st.useId, useName: x.name, answers: st.A, proofs: st.P, score: ev.score, raw: ev.raw, level: ev.level, areas: areas, unmet: ev.unmet.map(function (g) { return g.q.code; }), submittedAt: st.submittedAt, updatedAt: new Date().toISOString() };
  }
  function save() {
    if (!st.id) st.id = 'rc' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    if (!st.submittedAt) st.submittedAt = new Date().toISOString();
    return S.save(st.id, submission()).then(function (m) { st.saved = m; keep(); render(); }, function () { st.saved = null; keep(); render(); toast('The check could not be saved. Download the report to keep it.'); });
  }

  // ---------- report ----------
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
    function go() {
      if (host.state !== 'yes') { viaLink(); return; }
      var id = 'd' + (++host.seq);
      host.calls[id] = function (m) { toast(m.ok ? 'Saved ' + name : m.code === 'declined' ? 'Download cancelled.' : 'The file could not be saved here.'); };
      window.parent.postMessage({ hub: 'download', id: id, filename: name, data: blob }, location.origin);
    }
    if (host.state === 'pending') host.waiters.push(go); else go();
  }
  function loadScript(src) { return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  function pdfSafe(s) { return String(s == null ? '' : s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/…/g, '...').replace(/[^\x00-\xFF]/g, ''); }
  function makePdf() {
    var x = M.UI[st.useId], ev = L.evaluate(M, x, st.hotel, st.A, st.P), gp = L.gaps(ev);
    var p = window.jspdf ? Promise.resolve() : loadScript('../assessment/lib/jspdf.umd.min.js').catch(function () { return loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'); });
    return p.then(function () {
      var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = 210, H = 297, Mg = 16, y = 20;
      function f(st2, sz, g) { doc.setFont('helvetica', st2); doc.setFontSize(sz); doc.setTextColor(g || 20); }
      function para(t, sz, ind) { f('normal', sz || 10); var ls = doc.splitTextToSize(pdfSafe(t), W - 2 * Mg - (ind || 0)); if (y + ls.length * 4.6 > H - 20) { doc.addPage(); y = 20; } doc.text(ls, Mg + (ind || 0), y); y += ls.length * 4.6 + 1.5; }
      f('bold', 18); doc.text('AI readiness check', Mg, y); y += 8;
      f('normal', 10, 90); doc.text(pdfSafe(st.hotel.name + (st.hotel.country ? ', ' + st.hotel.country : '') + ' | ' + fmtDate(st.submittedAt || new Date().toISOString())), Mg, y); y += 9;
      f('bold', 12); doc.text(pdfSafe(x.name), Mg, y); y += 5; para(x.deptName + ' | ' + typeName(x) + ' tool | ' + effort(x), 9);
      y += 3; f('bold', 30); doc.text(String(ev.score), Mg, y + 8); f('normal', 11, 90); doc.text('/100', Mg + 20, y + 8);
      f('bold', 13); doc.text(pdfSafe(L.LEVELS[ev.level].name), Mg + 40, y + 3); y += 6; doc.setFontSize(9.5); f('normal', 9.5);
      var act = doc.splitTextToSize(pdfSafe(R.levels[{ found: 0, pilot: 1, scale: 2 }[ev.level]].action), W - 2 * Mg - 40); doc.text(act, Mg + 40, y + 2); y += Math.max(12, act.length * 4.4 + 4);
      if (ev.cap !== null && ev.raw > ev.score) para('Score capped at ' + ev.cap + ' because ' + ev.capWhy.toLowerCase() + '. Average of the six areas: ' + ev.raw + '.', 9);
      y += 3; f('bold', 11); doc.text('Six areas', Mg, y); y += 6;
      ev.scored.forEach(function (r) {
        f('normal', 9.5); doc.text(pdfSafe(r.name), Mg, y); doc.setFillColor(230, 230, 226); doc.rect(Mg + 52, y - 3, 100, 3.6, 'F');
        var c = r.pct < L.LOW ? [163, 57, 42] : r.pct < L.HIGH ? [126, 87, 0] : [31, 111, 67]; doc.setFillColor(c[0], c[1], c[2]); doc.rect(Mg + 52, y - 3, Math.max(1, r.pct * 100), 3.6, 'F');
        doc.text(pct(r.pct), Mg + 158, y); y += 6.5;
      });
      if (ev.unmet.length) { y += 3; f('bold', 11); doc.text('Must-haves not met', Mg, y); y += 6; ev.unmet.forEach(function (g) { para('- ' + g.q.q + ' [' + (L.ANSWER[g.ans] || 'Not answered') + ']' + (g.q.proof ? ' What good looks like: ' + g.q.proof : ''), 9.5); }); }
      var rest = gp.filter(function (g) { return g.kind !== 'must'; }).slice(0, 8);
      if (rest.length) { y += 3; f('bold', 11); doc.text('Next gaps to close, in order', Mg, y); y += 6; rest.forEach(function (g) { para('- ' + g.q.q + ' [' + (L.ANSWER[g.ans] || 'Not answered') + ', ' + g.area + ']', 9.5); }); }
      var n = doc.getNumberOfPages();
      for (var i = 1; i <= n; i++) { doc.setPage(i); f('normal', 7.5, 120); doc.text(pdfSafe('AI readiness check (prototype), EHL SBP Group 36 for HFTP. Self-assessment, not legal or investment advice. Rules v2, 18 Nov 2026.'), Mg, H - 10); doc.text('Page ' + i + ' of ' + n, W - Mg, H - 10, { align: 'right' }); }
      return doc.output('blob');
    });
  }
  function summaryText() {
    var x = M.UI[st.useId], ev = L.evaluate(M, x, st.hotel, st.A, st.P);
    return 'AI readiness check: ' + st.hotel.name + ', ' + x.name + '\nScore ' + ev.score + '/100: ' + L.LEVELS[ev.level].name + '\n' + ev.scored.map(function (r) { return r.name + ' ' + pct(r.pct); }).join(' | ') + (ev.unmet.length ? '\nMust-haves not met: ' + ev.unmet.map(function (g) { return g.q.q; }).join('; ') : '');
  }

  // ---------- render and events ----------
  function render(keepFocus) {
    var act = document.activeElement, fid = keepFocus && act && act.id ? act.id : null;
    var html = st.step === 'start' ? vStart() : st.step === 'result' ? vResult() : vStep(st.step);
    $('view').innerHTML = html;
    if (fid && $(fid)) { $(fid).focus(); try { var v = $(fid).value.length; $(fid).setSelectionRange(v, v); } catch (e) { /* not text */ } }
  }
  function go(step) { st.step = step; keep(); render(); try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } $('view').focus({ preventScroll: true }); }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b || b.disabled) return;
    var a = b.getAttribute('data-act');
    if (a === 'pick') { st.useId = b.getAttribute('data-id'); st.A = {}; st.P = {}; st.id = null; st.submittedAt = null; keep(); render(); }
    else if (a === 'unpick') { st.useId = ''; keep(); render(); }
    else if (a === 'begin') go(0);
    else if (a === 'back') go(st.step === 0 ? 'start' : st.step - 1);
    else if (a === 'next') { if (st.step === 5) { go('result'); save(); } else go(st.step + 1); }
    else if (a === 'edit') go(0);
    else if (a === 'new') { var h = st.hotel; st = blank(); st.hotel = h; go('start'); }
    else if (a === 'pdf') { toast('Preparing the report…'); makePdf().then(function (blob) { saveFile('AI-readiness-check_' + (st.hotel.name || 'hotel').replace(/[^\w-]+/g, '-') + '.pdf', blob); }).catch(function () { toast('The PDF could not be made here. Use Copy summary instead.'); }); }
    else if (a === 'copy') { var t = summaryText(); if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { toast('Summary copied.'); }, function () { toast('Copying is blocked here.'); }); else toast('Copying is blocked here.'); }
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.hasAttribute('data-q')) { st.A[el.getAttribute('data-q')] = el.value; if (st.step === 'result' || st.submittedAt) st.saved = null; keep(); render(true); }
    else if (el.hasAttribute('data-h')) { st.hotel[el.getAttribute('data-h')] = el.value; keep(); render(true); }
    else if (el.id === 'dept') { st.dept = el.value; render(true); }
  });
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.id === 'q') { st.q = el.value; render(true); }
    else if (el.hasAttribute('data-h')) { st.hotel[el.getAttribute('data-h')] = el.value; keep(); var btn = document.querySelector('[data-act=begin]'); if (btn) btn.disabled = !(st.hotel.name.trim() && st.hotel.type && M.UI[st.useId]); }
    else if (el.hasAttribute('data-proof')) { st.P[el.getAttribute('data-proof')] = el.value; keep(); var w = el.closest('fieldset').querySelector('.warnline'); if (w) w.hidden = !!el.value.trim(); }
  });

  S.ready();
  render();
  window.ReadinessCheck = { state: function () { return st; }, model: M };
})();
