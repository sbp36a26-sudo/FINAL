/* Readiness check v2: question selection, scoring and the full working-out.
   Plain script, no dependencies; runs in both pages and in the Node tests.
   Data: D6 readiness data (areas, 31 questions, 20 blocks, 9 types of tool, add-ons, 91 use cases)
   plus the changes recommended by the research of 18 Nov 2026 (reports/Hotel AI readiness check design.md). */
(function (root) {
  'use strict';

  var AK = ['pe', 'sk', 'fi', 'te', 'da', 'or'];
  var POINTS = { y: 2, p: 1, n: 0, u: 0 };
  var ANSWER = { y: 'Yes', p: 'Partly', n: 'No', u: 'Not sure', na: 'Does not apply' };
  var LEVELS = {
    found: { name: 'Build foundations first', short: 'Not ready yet' },
    pilot: { name: 'Ready to pilot', short: 'Ready to pilot' },
    scale: { name: 'Ready to scale', short: 'Ready to scale' }
  };
  var LOW = 0.40, HIGH = 0.75;

  /* What to type as evidence for each must-have: a plain ask and a filled-in example. */
  var EVIDENCE = {
    P1: { ask: 'Who is it, what is their role, and how much time do they have for it?', ex: 'Maria Rossi, revenue manager, 4 hours a week, written in her job description' },
    F1: { ask: 'Where is the budget written down, and roughly how much is it for the year?', ex: 'Line in the 2027 budget: about EUR 6,000 for subscription, set-up and training' },
    F2: { ask: 'Which number will you use to judge the tool, and what is it today?', ex: 'Average reply time to guest emails: 9 hours (measured in October)' },
    T1: { ask: 'How do you know the tool can exchange data with your systems?', ex: 'Vendor confirmed two-way link with our PMS; tested at a reference hotel' },
    D5: { ask: 'Which agreement covers the data, and does it say who owns it?', ex: 'Data processing agreement signed 3 Oct; data stays ours and can be exported' },
    O1: { ask: 'Who approved the plan, and when?', ex: 'One-page plan approved by the owner on 12 Nov' },
    P5: { ask: 'Who can override or stop the tool, and how?', ex: 'Front-office manager can switch off auto-replies in the admin screen' },
    G2: { ask: 'When was the risk review (including a data protection impact assessment) done, and by whom?', ex: 'DPIA completed by our data protection officer on 5 Nov' },
    XG: { ask: 'When were staff representatives informed, or do you have none?', ex: 'Works council informed on 20 Oct; minutes on file' }
  };

  /* Questions added on 18 Nov 2026 from the research (not in the D6 checklist). */
  var EXTRA = {
    X1: { a: 'pe', q: 'Have the staff who will use it seen it, and do they expect it to help their work?', proof: 'Who saw a demo or trial, and what they said',
          why: 'Staff acceptance: adoption research (TAM/UTAUT, organisational readiness) and hotel cases such as a room-assignment pilot that failed because staff overrode it' },
    X2: { a: 'or', q: 'Can guests always reach a person, and have you checked that guests accept this tool?', proof: 'How guests reach a person; guest feedback or test results',
          why: 'Guest acceptance for guest-facing tools (adoption research)' },
    XG: { a: 'or', q: 'Have staff representatives (works council or staff committee) been informed or consulted before the tool is used on staff?', proof: 'Date of the meeting or information, or a note that the hotel has no staff representatives',
          gate: true, why: 'Labour law in several focus countries can stop a rollout that skips this step; AI Act Art. 26(7) adds a duty for high-risk staff tools from 2 Dec 2027' }
  };

  /* Build the data model once from the embedded data. */
  function model(D) {
    var R = D.rdy, M = { R: R, AK: AK, AREA: {}, Q: {}, BL: R.blocks, ADD: R.addons, ARCH: {}, ACODES: [], QB: {}, USES: [], UI: {} };
    R.areas.forEach(function (a) { M.AREA[a.k] = a; });
    Object.keys(R.q).forEach(function (c) { var q = R.q[c]; M.Q[c] = { code: c, a: q.a, q: q.q, ap: q.ap, gate: !!q.gate, proof: q.proof || '', src: 'D6' }; });
    Object.keys(EXTRA).forEach(function (c) { var q = EXTRA[c]; M.Q[c] = { code: c, a: q.a, q: q.q, ap: 'Conditional', gate: !!q.gate, proof: q.proof, src: 'research', why: q.why }; });
    R.arch.forEach(function (a) { M.ARCH[a.c] = a; M.ACODES.push(a.c); });
    R.blocks.forEach(function (b, i) { b.codes.forEach(function (c) { (M.QB[c] = M.QB[c] || []).push(i); }); });
    var rdyUc = {}; R.uc.forEach(function (u) { rdyUc[u.id] = u; });
    D.cat.depts.forEach(function (d) {
      d.uses.forEach(function (u, i) {
        var id = d.id + '-' + (i + 1), r = rdyUc[id];
        if (!r || u.notTool) return;
        var x = { id: id, name: u.n, task: u.task, dept: d.id, deptName: d.name, int: r.int, arch: r.arch, add: r.add || [], r: r.r || {}, chk: r.chk || [], staff: !!u.staff };
        M.USES.push(x); M.UI[id] = x;
      });
    });
    return M;
  }

  /* Which questions a use case gets, and why. Core questions only (research: score core questions only). */
  function selectQuestions(M, x, hotel) {
    hotel = hotel || {};
    var ai = x.arch ? M.ACODES.indexOf(x.arch) : -1, out = [];
    var groupish = hotel.type === 'group' || hotel.type === 'managed';
    AK.forEach(function (a) {
      var res = x.r[a] && !/^(none|n\/a|not applicable|—|-)\b/i.test(String(x.r[a]).trim());
      if (res) out.push({ code: 'R-' + a, a: a, res: true, q: 'Do you have what this tool needs here: ' + lowerFirst(String(x.r[a]).replace(/\.$/, '')) + '?', reasons: ['Resource need for this use case (D6 team sheet)'], gate: false, proof: '' });
      M.AREA[a].qs.forEach(function (c) {
        var q = M.Q[c], why = [];
        if (q.gate) why.push('Must-have for every AI tool (D6 gate)');
        if (x.chk.indexOf(c) >= 0) why.push('Listed to check first for this use case');
        (M.QB[c] || []).forEach(function (bi) {
          var b = M.BL[bi], m = ai >= 0 ? b.m[ai] : (b.L === 1 ? 'C' : '-');
          if (m === 'C' && b.sheet.indexOf(c) >= 0) why.push('Needed by every ' + (x.arch ? M.ARCH[x.arch].s.toLowerCase() : 'AI') + ' tool (building block "' + b.s + '")');
        });
        x.add.forEach(function (k) { if (M.ADD[k] && M.ADD[k].codes.indexOf(c) >= 0) why.push('Risk add-on: ' + M.ADD[k].tag.toLowerCase()); });
        if (!why.length) return;
        if (q.ap === 'Groups' && !groupish) return;
        if (/^Managed or franchised/.test(q.ap) && hotel.type !== 'managed') return;
        if (/^Guest-facing/.test(q.ap) && !guestFacing(x)) return;
        var gate = q.gate, note = '';
        if (c === 'T1' && x.int === 'Light') { gate = false; note = 'Not a must-have for light, stand-alone tools (research, 18 Nov 2026).'; }
        if (c === 'P5' && x.add.indexOf('auto') >= 0) { gate = true; note = 'Must-have because this tool acts without a person signing off (research, 18 Nov 2026).'; why.push('Tool acts on its own, so a person must be able to override it'); }
        if (c === 'G2' && x.add.indexOf('sens') >= 0) { gate = true; note = 'Must-have because the tool handles sensitive personal data: include a data protection impact assessment (research, 18 Nov 2026).'; }
        if (c === 'F1' && x.int === 'Light') note = 'For a low-cost subscription, a written budget line for the subscription and staff time is enough (research, 18 Nov 2026).';
        if (c === 'D5') note = 'Proof should also cover who owns the data, how you get it back if you leave, and whether the vendor may train on it (research, 18 Nov 2026).';
        if (c === 'O1' && hotel.type === 'managed') note = 'In a managed or franchised hotel, the owner signs the plan (research, 18 Nov 2026).';
        out.push({ code: c, a: a, q: q.q, gate: gate, proof: q.proof, reasons: dedupe(why), note: note, src: 'D6' });
      });
    });
    out.push(extra(M, 'X1', ['Added for every tool: staff acceptance (research, 18 Nov 2026)']));
    if (guestFacing(x)) out.push(extra(M, 'X2', ['Added for guest-facing tools: guest acceptance (research, 18 Nov 2026)']));
    if (x.staff || x.add.indexOf('sens') >= 0 && /staff|employee|hr/i.test(x.name)) out.push(extra(M, 'XG', ['Must-have because the tool affects staff (research, 18 Nov 2026)']));
    var order = {}; AK.forEach(function (a, i) { order[a] = i; });
    out.sort(function (p, q) { return order[p.a] - order[q.a] || (q.gate - p.gate) || (p.res ? -1 : q.res ? 1 : 0); });
    return out;
  }
  function extra(M, c, why) { var q = M.Q[c]; return { code: c, a: q.a, q: q.q, gate: q.gate, proof: q.proof, reasons: why, src: 'research' }; }
  function guestFacing(x) { return ['A2', 'A4'].indexOf(x.arch) >= 0 || x.dept === 'gx' || x.dept === 'fo'; }
  function lowerFirst(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function dedupe(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }

  /* Score one assessment and return every step of the working-out. */
  function evaluate(M, x, hotel, A, proofs) {
    A = A || {}; proofs = proofs || {};
    var qs = selectQuestions(M, x, hotel), steps = [], area = {}, gates = [];
    AK.forEach(function (a) { area[a] = { a: a, name: M.AREA[a].name, pts: 0, max: 0, items: [], pct: null }; });
    qs.forEach(function (q) {
      var ans = A[q.code] || '', pts = null, counted = ans in POINTS, flag = '';
      if (counted) pts = POINTS[ans];
      if (q.gate && ans === 'y' && !String(proofs[q.code] || '').trim()) { pts = 1; flag = 'Yes without proof counts as Partly'; }
      if (ans === '') flag = 'Not answered (counted as Not sure)';
      if (ans === '') { pts = 0; counted = true; }
      if (counted) { area[q.a].pts += pts; area[q.a].max += 2; }
      area[q.a].items.push({ q: q, ans: ans, pts: pts, flag: flag });
      if (q.gate) gates.push({ q: q, ans: ans, met: ans === 'y' && !!String(proofs[q.code] || '').trim(), flag: flag });
    });
    var scored = [];
    AK.forEach(function (a) { if (area[a].max) { area[a].pct = area[a].pts / area[a].max; scored.push(area[a]); } });
    var mean = scored.length ? scored.reduce(function (s, r) { return s + r.pct; }, 0) / scored.length : 0;
    var lowest = scored.reduce(function (m, r) { return !m || r.pct < m.pct ? r : m; }, null);
    var unmet = gates.filter(function (g) { return !g.met; });
    var level, cap = null, capWhy = '';
    if (unmet.length) { level = 'found'; cap = 39; capWhy = unmet.length + ' must-have' + (unmet.length > 1 ? 's' : '') + ' not met'; }
    else if (lowest && lowest.pct < LOW) { level = 'found'; cap = 39; capWhy = lowest.name + ' is below 40%'; }
    else if (lowest && lowest.pct < HIGH) { level = 'pilot'; cap = 74; capWhy = lowest.name + ' is below 75%'; }
    else level = 'scale';
    var raw = Math.round(mean * 100), score = cap !== null ? Math.min(raw, cap) : raw;
    var answered = qs.filter(function (q) { return A[q.code]; }).length;
    steps.push('Use case "' + x.name + '": type ' + (x.arch ? x.arch + ' ' + M.ARCH[x.arch].s : 'not set') + ', ' + x.int.toLowerCase() + ' effort' + (x.add.length ? ', add-ons: ' + x.add.map(function (k) { return M.ADD[k].tag.toLowerCase(); }).join(', ') : '') + '.');
    steps.push(qs.length + ' questions selected (' + gates.length + ' must-haves); ' + answered + ' answered.');
    scored.forEach(function (r) { steps.push(r.name + ': ' + r.pts + ' of ' + r.max + ' points = ' + Math.round(r.pct * 100) + '%.'); });
    steps.push('Average of the ' + scored.length + ' areas = ' + raw + '.');
    steps.push(unmet.length ? 'Must-haves not met: ' + unmet.map(function (g) { return g.q.code; }).join(', ') + '.' : 'All ' + gates.length + ' must-haves met.');
    steps.push(cap !== null ? 'Score capped at ' + cap + ' because ' + capWhy + ': ' + Math.min(raw, cap) + '.' : 'No cap: every area is 75% or more and all must-haves are met.');
    steps.push('Verdict: ' + LEVELS[level].name + '.');
    return { qs: qs, area: area, scored: scored, gates: gates, unmet: unmet, lowest: lowest, raw: raw, score: score, cap: cap, capWhy: capWhy, level: level, answered: answered, steps: steps };
  }

  /* Gaps to fix, in order: must-haves first, then the weakest areas' No / Not sure, then Partly. */
  function gaps(ev) {
    var out = [];
    ev.unmet.forEach(function (g) { out.push({ kind: 'must', q: g.q, ans: g.ans, flag: g.flag }); });
    var rank = { n: 0, u: 0, '': 0, p: 1 };
    var areas = ev.scored.slice().sort(function (a, b) { return a.pct - b.pct; });
    [0, 1].forEach(function (pass) {
      areas.forEach(function (r) {
        r.items.forEach(function (it) {
          if (it.q.gate || it.ans === 'y' || it.ans === 'na') return;
          if (rank[it.ans] === pass) out.push({ kind: pass ? 'partly' : 'missing', q: it.q, ans: it.ans, area: r.name });
        });
      });
    });
    return out;
  }

  var api = { EVIDENCE: EVIDENCE, AK: AK, POINTS: POINTS, ANSWER: ANSWER, LEVELS: LEVELS, LOW: LOW, HIGH: HIGH, EXTRA: EXTRA, model: model, selectQuestions: selectQuestions, evaluate: evaluate, gaps: gaps };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RCLogic = api;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
