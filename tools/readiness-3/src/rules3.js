/* Do you need AI? v3 (tools/readiness-3): the v3.0 rules (spec/MASTER_PROMPT.md §4 and `scoring` in the question data). Pure, no DOM.
   The reference is spec/sim_v3.py: on every golden case and every sweep run this gives the same verdict, score, caps and notes
   (tests/rules3.test.mjs). Every hotel-facing string from the data is used verbatim; the few sentences built here (reasons, the
   "Make sure:" / "Find out:" actions) follow §4.

   D is the parsed runtime data (spec/usecase_questions_v3.runtime.json). A check's answers, as evaluate() takes them:
     { use: '<use-case id>' | 'none' | null (no use case chosen: the "None of these fits" fallback),
       step2: { s1..s5: 'yes'|'no'|'dk' }, gates: { <gate id>: <option key> }, mh: { m1..m11: 'yes'|'planned'|'no'|'dk'|'na' },
       qa: { <question id>: 'yes'|'planned'|'no'|'dk' }, continued: true once "Continue anyway" was pressed after a soft stop }
   Anything unanswered (or a value the rules do not know) counts as Don't know yet. Doesn't apply counts only on m2 and m4 (§4); a stored
   Doesn't apply anywhere else counts as Don't know yet. Answers to questions that are not visible are kept by the page but never count.

   Main functions:
     askedGates(D, use)            the "How it works" questions step 5 opens with (1-2 per use case; the five library gates for None fits)
     visible(D, use, gates)        the use-case questions shown under those answers, in order (equals sim_v3.visible_questions)
     contradictions(D, use, gates, mh)  [{ id: 'm2'|'m4', note }] a Doesn't apply that a gate answer contradicts (§4)
     softStop(D, step2)            { ids: ['s1'|'s2'], messages: [...] } when s1 or s2 is No, else null
     evaluate(D, answers)          the result: verdict, score, dk share, caps, notes, sensitive flag, reason sentence, actions, top 3
     answerOptions(D, kind, id)    the answer buttons (data labels) for 'step2', a must-have id, or a use-case question */
(function (root) {
  'use strict';
  var RULES = '3.0';
  var VERDICT = { stop: 'Soft stop', info: 'Not enough info', not: 'Not ready', ready: 'Ready', almost: 'Almost ready' };
  var ANS = { yes: 1, planned: 1, no: 1, dk: 1 };
  var MH_OWNER = 'GM', GATE_OWNER = 'GM', STEP2_OWNER = 'GM'; // the data names no owner for these (NOTES_suggested_content_changes.md)

  function useOf(D, use) { if (!use || use === 'none') return null; for (var i = 0; i < D.use_cases.length; i++) if (D.use_cases[i].id === use) return D.use_cases[i]; return null; }
  function isNone(D, use) { return !useOf(D, use); }
  function opt(g, key) { var o = (g.options || []).filter(function (x) { return x.key === key; }); return o.length ? o[0] : null; }
  function libGate(D, id) { var g = D.gate_library[id]; return { id: id, kind: 'library', asked: true, text: g.text, options: g.options }; }

  /* The gates step 5 asks, in order. */
  function askedGates(D, use) {
    var u = useOf(D, use);
    if (!u) return D.none_fits.gates.map(function (id) { return libGate(D, id); });
    return u.gates.filter(function (g) { return g.asked; });
  }

  /* [{ gate, key (null when unanswered or not an option), effects }] for every gate that has effects now: automatic gates always,
     asked gates once answered with one of their options (sim_v3.gate_effects; for None fits, the library gates in none_fits order). */
  function effects(D, use, gates) {
    gates = gates || {};
    var u = useOf(D, use), out = [];
    var list = u ? u.gates : D.none_fits.gates.map(function (id) { return libGate(D, id); });
    list.forEach(function (g) {
      if (!g.asked) { out.push({ gate: g, key: null, effects: g.effects || {} }); return; }
      var o = opt(g, gates[g.id]);
      if (o) out.push({ gate: g, key: o.key, effects: o.effects || {} });
    });
    return out;
  }
  function upperKey(id) { var k = String(id).split('.')[1] || ''; return /[A-Z]/.test(k) && k === k.toUpperCase(); }

  /* The visible use-case questions, in order (sim_v3.visible_questions; for None fits, sim_v3.evaluate's list). */
  function visible(D, use, gates) {
    gates = gates || {};
    var u = useOf(D, use);
    if (!u) {
      var qs = D.none_fits.questions.slice();
      effects(D, use, gates).forEach(function (e) {
        (e.effects.add || []).forEach(function (k) { var q = Object.assign({}, D.gate_questions[k]); q.id = 'none.' + k; qs.push(q); });
        if (e.effects.hide_area) qs = qs.filter(function (q) { return q.area !== e.effects.hide_area || upperKey(q.id); });
      });
      return qs;
    }
    return u.questions.filter(function (q) {
      if (q.show_if) { var p = q.show_if.split('='); if (gates[p[0]] !== p[1]) return false; }
      return !(q.hidden_when || []).some(function (h) { var p = h.split('='); return gates[p[0]] === p[1]; });
    });
  }

  function contradicted(D, use, gates) {
    var set = {};
    effects(D, use, gates).forEach(function (e) { (e.effects.contradicts_na || []).forEach(function (m) { set[m] = true; }); });
    return set;
  }
  function contradictions(D, use, gates, mh) {
    var c = contradicted(D, use, gates); mh = mh || {};
    return D.must_haves.filter(function (m) { return m.na && mh[m.id] === 'na' && c[m.id]; }).map(function (m) { return { id: m.id, note: m.contradiction_note }; });
  }
  function softStop(D, step2) {
    step2 = step2 || {};
    var ids = D.step2.filter(function (s) { return s.no_effect === 'soft_stop' && step2[s.id] === 'no'; });
    return ids.length ? { ids: ids.map(function (s) { return s.id; }), messages: ids.map(function (s) { return s.no_message; }) } : null;
  }
  function answerOptions(D, kind, id) {
    if (kind === 'step2') return D.answers.step2;
    if (kind === 'mh') { var m = D.must_haves.filter(function (x) { return x.id === id; })[0]; return m && m.na ? D.answers.check_da : D.answers.check; }
    return D.answers.check;
  }

  function noQ(t) { return String(t).replace(/\?\s*$/, ''); }
  function task(text, a) { return (a === 'dk' ? 'Find out: ' : 'Make sure: ') + noQ(text); }
  function ownerLabel(D, k) { return D.labels.owners[k] || k; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  /* A list in the reason sentence names at most two items, then "; and N more (see the plan below)" (council v3.0, BUILD NOW 2;
     council v3.0.1, BUILD NOW 4: "; " also before "and", so a title with its own comma reads as one item). tail: what follows in
     brackets (", answered No" and the like), kept inside the same brackets as "see the plan below". */
  function firstTwo(list, tail) {
    if (list.length <= 2) return list.join('; ') + (tail ? ' (' + tail + ')' : '');
    return list.slice(0, 2).join('; ') + '; and ' + (list.length - 2) + ' more (' + (tail ? tail + '; ' : '') + 'see the plan below)';
  }
  /* Owner decision, 25 Nov 2026: the cards no longer say which questions are blockers; the result names a blocker that is not Yes
     as "Needed before a pilot: …". */
  var NEED = 'Needed before a pilot';

  /* The result. Follows sim_v3.evaluate exactly for verdict, score, dk, caps and notes. */
  function evaluate(D, A) {
    A = A || {};
    var step2 = A.step2 || {}, gates = A.gates || {}, mhA = A.mh || {}, qa = A.qa || {};
    var u = useOf(D, A.use), none = !u;
    var stop = softStop(D, step2);
    var res = { rules: RULES, use: u ? u.id : 'none', none: none, stop: stop, continued: !!(stop && A.continued) };
    var caps = [], notes = [], contra = [];
    var acts = { sens: [], blockNo: [], gate: [], step2: [], blockSoft: [], impNo: [], rest: [] };

    if (stop && !A.continued) {
      res.verdictKey = 'stop'; res.verdict = VERDICT.stop; res.score = null; res.dk = null; res.caps = []; res.notes = []; res.contradictions = [];
      res.sensitive = false; res.items = []; res.blockersNo = []; res.notFit = '';
      res.reason = stop.messages.join(' ');
      stop.ids.forEach(function (id) { var s = D.step2.filter(function (x) { return x.id === id; })[0]; acts.step2.push({ text: task(s.text, 'no'), owner: STEP2_OWNER, from: id }); });
      return finish(D, res, acts);
    }
    /* Continue anyway caps only when there is a soft stop to continue from (judgement call: sim_v3 caps on the flag alone). */
    if (stop && A.continued) caps.push('soft stop continued');

    var eff = effects(D, A.use, gates), qs = visible(D, A.use, gates);
    var gateList = askedGates(D, A.use);
    var sens = u ? !!u.sensitive.always : false, contraSet = {}, nf = '';
    if (none) caps.push('None fits chosen');
    eff.forEach(function (e) {
      (e.effects.contradicts_na || []).forEach(function (m) { contraSet[m] = true; });
      if (e.effects.sensitive_flag) sens = true;
      if (e.effects.cap_almost) caps.push('gate cap');
      if (e.effects.not_fit) { caps.push('not a fit (continued)'); if (!nf) nf = e.effects.not_fit; }
    });
    gateList.forEach(function (g) {
      var k = gates[g.id], o = opt(g, k);
      if (!o || o.key === 'dk') caps.push('gate unanswered or dk');
      /* gate actions: the chosen option's action; an unanswered gate counts as Don't know yet and takes that option's action */
      var ao = o || opt(g, 'dk');
      if (ao && ao.effects && ao.effects.action) acts.gate.push({ text: ao.effects.action, owner: GATE_OWNER, from: g.id });
    });
    if (nf) acts.gate.push({ text: nf, owner: GATE_OWNER, from: 'not_fit' });
    if (none) acts.gate.push({ text: 'Compare your idea with the listed use cases, and ask the vendor which one it is closest to.', owner: GATE_OWNER, from: 'none' });
    if (sens) caps.push('sensitive');
    var s2held = [];
    D.step2.forEach(function (s) {
      if (s.no_effect === 'soft_stop') { if (res.continued && step2[s.id] === 'no') acts.step2.push({ text: task(s.text, 'no'), owner: STEP2_OWNER, from: s.id }); return; }
      if (step2[s.id] !== 'yes') { caps.push('step2 ' + s.id); s2held.push(s); acts.step2.push({ text: task(s.text, step2[s.id] === 'no' ? 'no' : 'dk'), owner: STEP2_OWNER, from: s.id }); }
    });

    var items = [];
    D.must_haves.forEach(function (m) {
      var raw = mhA[m.id], a = raw === 'na' ? 'na' : own(ANS, raw) ? raw : 'dk';
      if (a === 'na' && !m.na) a = 'dk';
      if (a === 'na' && contraSet[m.id]) { a = 'dk'; notes.push(m.contradiction_note); contra.push({ id: m.id, note: m.contradiction_note }); }
      items.push({ id: m.id, kind: 'mh', weight: 'B', raw: raw, answer: a, text: m.text, title: m.title, owner: MH_OWNER });
    });
    qs.forEach(function (q) {
      var raw = qa[q.id], a = own(ANS, raw) ? raw : 'dk'; // Doesn't apply is not offered on use-case questions: counts as Don't know yet
      items.push({ id: q.id, kind: 'q', weight: q.weight, raw: raw, answer: a, text: q.text, area: q.area, owner: q.owner });
    });
    var W = D.scoring.weights, Fc = D.scoring.factors;
    var app = items.filter(function (i) { return i.answer !== 'na'; });
    var sw = 0, sc = 0, ndk = 0;
    app.forEach(function (i) { sw += W[i.weight]; sc += W[i.weight] * Fc[i.answer]; if (i.answer === 'dk') ndk++; });
    var score = sw ? Math.floor(100 * sc / sw) : 0, dk = ndk / app.length;
    var blockers = app.filter(function (i) { return i.weight === 'B'; });
    var bNo = blockers.filter(function (i) { return i.answer === 'no'; }), bYes = blockers.filter(function (i) { return i.answer === 'yes'; });
    var key;
    if (dk > 0.5) key = 'info';
    else if (bNo.length || score < 50 || bYes.length < blockers.length / 2) key = 'not';
    else if (bYes.length === blockers.length && score >= 75 && dk < 0.25 && !caps.length) key = 'ready';
    else key = 'almost';

    res.verdictKey = key; res.verdict = VERDICT[key]; res.score = score; res.dk = dk; res.nItems = app.length; res.nDk = ndk;
    res.caps = caps.filter(function (c, i) { return caps.indexOf(c) === i; }).sort();
    res.notes = notes; res.contradictions = contra; res.sensitive = sens; res.flag = sens ? D.texts.sensitive_flag : '';
    res.notFit = nf; res.items = items; res.blockersNo = bNo.map(function (i) { return i.id; });
    res.blockers = { total: blockers.length, yes: bYes.length, no: bNo.length };

    /* actions, §4 order */
    if (sens) acts.sens.push({ text: 'Ask an adviser before a pilot.', owner: 'GM', from: 'sensitive' });
    items.forEach(function (i) {
      var t = { text: task(i.text, i.answer), owner: i.owner, from: i.id, need: i.weight === 'B' };
      if (i.answer === 'yes' || i.answer === 'na') return;
      if (i.weight === 'B' && i.answer === 'no') acts.blockNo.push(t);
      else if (i.weight === 'B') acts.blockSoft.push(t);
      else if (i.weight === 'I' && i.answer === 'no') acts.impNo.push(t);
      else acts.rest.push(t);
    });

    /* one-sentence main reason */
    var label = function (i) { return i.kind === 'mh' ? i.title : noQ(i.text); };
    var softB = blockers.filter(function (i) { return i.answer !== 'yes'; });
    if (key === 'info') res.reason = 'More than half of your answers are Don\'t know yet (' + ndk + ' of ' + app.length + ').';
    else if (key === 'not') {
      if (bNo.length) res.reason = NEED + ': ' + firstTwo(bNo.map(label), 'answered No') + '.';
      else if (score < 50) res.reason = 'Too few answers are Yes: fewer than half of the possible points.';
      else res.reason = 'Fewer than half of the questions needed before a pilot are Yes (' + bYes.length + ' of ' + blockers.length + ').';
    } else if (key === 'ready') res.reason = 'Every question needed before a pilot is Yes, and nothing holds the check back.';
    else {
      var soft = softB.length;
      if (res.continued) res.reason = stop.ids[0] === 's1' ? 'You said rules may do this job.' : 'You said the gain may be small.';
      else if (sens) res.reason = D.texts.sensitive_flag.split('. ')[0] + '.';
      else if (soft) res.reason = NEED + ': ' + firstTwo(softB.map(label), 'not Yes yet') + '.';
      else if (nf) res.reason = 'This use case may not fit your hotel.';
      else if (res.caps.indexOf('gate unanswered or dk') >= 0 || res.caps.indexOf('gate cap') >= 0) res.reason = 'A question about how the tool works is answered Don\'t know yet.';
      else if (s2held.length) res.reason = 'In step 2 you did not answer Yes to: ' + firstTwo(s2held.map(function (s) { return s.title; })) + '.';
      else if (none) res.reason = 'None of the listed use cases fits, so the questions are general.';
      else if (dk >= 0.25) res.reason = 'A quarter or more of your answers are Don\'t know yet.';
      else res.reason = 'Some answers are not Yes yet.';
    }
    return finish(D, res, acts);
  }

  /* Full ordered action list (§4 order, de-duplicated by text), with owner labels; top 3 from groups 1-6, falling back to the rest. */
  function finish(D, res, acts) {
    var seen = {}, main = [], all = [];
    function add(list, a) { if (seen[a.text]) return; seen[a.text] = true; a.ownerLabel = ownerLabel(D, a.owner); list.push(a); }
    ['sens', 'blockNo', 'gate', 'step2', 'blockSoft', 'impNo'].forEach(function (g) { acts[g].forEach(function (a) { add(main, a); }); });
    all = main.slice(); acts.rest.forEach(function (a) { add(all, a); });
    res.actions = all;
    res.top3 = (main.length ? main : all).slice(0, 3);
    return res;
  }

  root.R3Rules = { RULES: RULES, VERDICT: VERDICT, NEED: NEED, askedGates: askedGates, effects: effects, visible: visible, contradictions: contradictions,
    softStop: softStop, evaluate: evaluate, answerOptions: answerOptions };
})(typeof self !== 'undefined' ? self : this);
