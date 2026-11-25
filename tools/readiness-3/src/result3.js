/* Do you need AI? v3 (tools/readiness-3): every word of the result, in the order of spec/MASTER_PROMPT.md §6.4, built once and used
   by the result screen, Copy and the PDF (so they always say the same, and the top 3 are the same everywhere). Pure, no DOM.
     model(D, rec, EX, today) → { stop, verdictKey, verdict, tone, reason, flag, notes, notFit, top3, areas, people, vendor, qa,
                                  method, score, scoreLine, scoreSub, disclaimer, hotel, useTitle, department, date, ... }
     summaryText(m)  the Copy text: header, verdict, reason, flag, notes, top 3, readiness score, disclaimer
     personText(m, owner)  one person's actions, for "Copy for <person>"
   Strings from the question data are used verbatim; the sentences written here are plain chrome and pass the banned-term grep. */
(function (root) {
  'use strict';
  var R = root.R3Rules, S = root.R3Store;
  var TONE = { ready: 'hi', almost: 'md', not: 'lo', info: 'na', stop: 'accent' };
  var WEIGHT = { B: 'Must be Yes', I: 'Important', N: 'Nice to have' };
  function ansLabel(D, kind, a) {
    if (!a) return 'No answer (counts as Don\'t know yet)';
    var list = kind === 'step2' ? D.answers.step2 : D.answers.check_da;
    for (var i = 0; i < list.length; i++) if (list[i].key === a) return list[i].label;
    return a;
  }
  function gateLabel(g, k) { for (var i = 0; i < g.options.length; i++) if (g.options[i].key === k) return g.options[i].label; return 'No answer (counts as Don\'t know yet)'; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  function model(D, rec, EX, today) {
    var A = S.answers(D, rec), res = R.evaluate(D, A), u = S.useOf(D, A.use);
    var m = { rules: R.RULES, res: res, stop: res.verdictKey === 'stop', verdictKey: res.verdictKey, verdict: res.verdict, tone: TONE[res.verdictKey],
      hotel: rec.hotel.name || '', hotelLine: rec.hotel.name || 'Not named', useTitle: u ? u.title : D.none_fits.title, department: u ? u.department : '',
      date: today, disclaimer: D.texts.disclaimer, flag: res.flag || '', notFit: res.notFit || '', none: !u };
    m.notes = (res.contradictions || []).map(function (c) { return { id: c.id, note: c.note }; });
    m.top3 = res.top3.map(function (a) { return { text: a.text, owner: a.ownerLabel }; });

    if (m.stop) {
      m.stopTitles = res.stop.ids.map(function (id) { return D.step2.filter(function (s) { return s.id === id; })[0].title; });
      m.reason = 'You answered No to: ' + m.stopTitles.join('; ') + '.';
      m.simpler = res.stop.messages.slice();
      m.qa = [{ head: 'Step 2: Is this an AI problem?', items: D.step2.map(function (s) { return { id: s.id, title: s.title, text: s.text, answer: ansLabel(D, 'step2', rec.step2[s.id]), a: rec.step2[s.id] || '' }; }) }];
      m.score = null; m.scoreLine = 'No readiness score: the check stopped at step 2.'; m.scoreSub = '';
      m.areas = []; m.people = []; m.vendor = []; m.method = method(D, res);
      return m;
    }
    m.reason = res.reason;
    /* the rules' reason for a held sensitive use case is the first sentence of the flag, which stands right under it: say why it is held instead */
    if (res.verdictKey === 'almost' && res.sensitive && res.reason === D.texts.sensitive_flag.split('. ')[0] + '.') m.reason = 'Held at Almost ready: this use case involves people\'s personal data or jobs.';

    /* details by area: Yes of the visible, applicable items ("n of m in place"); the must-haves first */
    var order = ['mh'].concat(Object.keys(D.labels.areas)), byArea = {};
    res.items.forEach(function (i) { if (i.answer === 'na') return; var k = i.kind === 'mh' ? 'mh' : i.area; (byArea[k] = byArea[k] || { yes: 0, total: 0 }); byArea[k].total++; if (i.answer === 'yes') byArea[k].yes++; });
    m.areas = order.filter(function (k) { return byArea[k]; }).map(function (k) { return { key: k, name: k === 'mh' ? 'Must-haves' : D.labels.areas[k], yes: byArea[k].yes, total: byArea[k].total, line: byArea[k].yes + ' of ' + byArea[k].total + ' in place' }; });

    /* action plan by person, in the data's owner order */
    var people = {};
    res.actions.forEach(function (a) { (people[a.owner] = people[a.owner] || []).push(a.text); });
    m.people = Object.keys(D.labels.owners).filter(function (k) { return people[k]; }).map(function (k) { return { key: k, owner: D.labels.owners[k], items: people[k] }; })
      .concat(Object.keys(people).filter(function (k) { return !D.labels.owners[k]; }).map(function (k) { return { key: k, owner: k, items: people[k] }; }));

    /* questions for the vendor: use-case questions answered Don't know yet or owned by the vendor and not Yes, then the
       "Ask the vendor" actions of How it works answers */
    var vend = [], seen = {};
    function addV(t) { if (!seen[t]) { seen[t] = 1; vend.push(t); } }
    res.items.forEach(function (i) { if (i.kind === 'q' && (i.answer === 'dk' || (i.owner === 'VEN' && i.answer !== 'yes'))) addV(i.text); });
    res.actions.forEach(function (a) { if (/^Ask the vendor\b/.test(a.text)) addV(a.text); });
    m.vendor = vend;

    /* every question and answer */
    var gates = R.askedGates(D, A.use), G = A.gates;
    m.qa = [
      { head: 'Step 2: Is this an AI problem?', items: D.step2.map(function (s) { return { id: s.id, title: s.title, text: s.text, answer: ansLabel(D, 'step2', rec.step2[s.id]), a: rec.step2[s.id] || '' }; }) },
      { head: 'Step 3: Must-haves', items: res.items.filter(function (i) { return i.kind === 'mh'; }).map(function (i) {
        var counted = i.raw === 'na' && i.answer === 'dk' ? ' (counts as Don\'t know yet)' : '';
        return { id: i.id, title: i.title, text: i.text, answer: ansLabel(D, 'check', i.raw) + counted, a: i.answer, weight: WEIGHT.B };
      }) },
      { head: 'Step 5: How it works', items: gates.map(function (g) { return { id: g.id, text: g.text, answer: gateLabel(g, G[g.id]), a: G[g.id] || '' }; }) },
      { head: 'Step 5: Questions for this use case', items: res.items.filter(function (i) { return i.kind === 'q'; }).map(function (i) { return { id: i.id, text: i.text, answer: ansLabel(D, 'check', i.raw), a: i.answer, weight: WEIGHT[i.weight], area: D.labels.areas[i.area], owner: D.labels.owners[i.owner] || i.owner }; }) }
    ];
    m.method = method(D, res);
    m.score = res.score;
    m.scoreLine = 'Readiness score: ' + res.score + '%';
    var pts = 0, max = 0; res.items.forEach(function (i) { if (i.answer === 'na') return; max += D.scoring.weights[i.weight]; pts += D.scoring.weights[i.weight] * D.scoring.factors[i.answer]; });
    m.points = pts; m.maxPoints = max;
    m.scoreSub = fmt(pts) + ' of ' + max + ' points on ' + plural(res.nItems, 'question', 'questions') + '; ' + plural(res.nDk, 'answer is', 'answers are') + ' Don\'t know yet.';
    return m;
  }
  function fmt(n) { return (Math.round(n * 10) / 10).toString(); }

  function method(D, res) {
    var W = D.scoring.weights;
    return [
      'Every must-have and every question shown for this use case counts. Points: Must be Yes ' + W.B + ', Important ' + W.I + ', Nice to have ' + W.N + '.',
      'Yes earns all the points, Planned half, No and Don\'t know yet none. Doesn\'t apply is left out. A question with no answer counts as Don\'t know yet. Step 2 and the How it works questions earn no points.',
      'Readiness score = points earned divided by points possible, as a percentage, rounded down.',
      'The verdict is checked in this order. Soft stop: question 1 or 2 of step 2 is No and you did not continue. Not enough info: more than half of the answers are Don\'t know yet. Not ready: a Must be Yes question is No, or the score is under 50%, or fewer than half of the Must be Yes questions are Yes. Ready: every Must be Yes question is Yes or Doesn\'t apply, the score is 75% or more, fewer than a quarter of the answers are Don\'t know yet, and nothing below holds it back. Almost ready: everything else.',
      'These hold a result at Almost ready at best: the note about personal data or jobs, a How it works answer of Don\'t know yet or one that limits the use case, Continue anyway after a soft stop, an answer other than Yes to questions 3 to 5 of step 2, and None of these fits.',
      'The cut-offs are the project team\'s judgement and are not yet tested with hotels. Your answers are your own; nobody checks them.'
    ];
  }

  function summaryText(m) {
    var L = ['Do you need AI? Result', 'Hotel: ' + m.hotelLine, 'Use case: ' + (m.stop ? 'not chosen (the check stopped at step 2)' : m.useTitle), 'Date: ' + m.date, '',
      'Verdict: ' + m.verdict, m.reason];
    if (m.flag) L.push(m.flag);
    m.notes.forEach(function (n) { L.push(n.note); });
    if (m.notFit) L.push(m.notFit);
    if (m.simpler) { L.push('', 'Simpler options to try first:'); m.simpler.forEach(function (t) { L.push('- ' + t); }); }
    L.push('', 'Top 3 actions:');
    if (!m.top3.length) L.push('Nothing open.');
    m.top3.forEach(function (a, i) { L.push((i + 1) + '. ' + a.text + ' (' + a.owner + ')'); });
    L.push('', m.scoreLine, '', m.disclaimer);
    return L.join('\n');
  }
  function personText(m, key) {
    var p = m.people.filter(function (x) { return x.key === key; })[0]; if (!p) return '';
    return ['Do you need AI? Actions for ' + p.owner, 'Hotel: ' + m.hotelLine, 'Use case: ' + m.useTitle, 'Date: ' + m.date, ''].concat(p.items.map(function (t) { return '- ' + t; })).concat(['', m.disclaimer]).join('\n');
  }
  /* Every action by person, for Copy when downloads are not available ("Copy the plan"). */
  function planText(m) {
    var L = [summaryText(m), '', 'Action plan by person'];
    m.people.forEach(function (p) { L.push('', p.owner + ':'); p.items.forEach(function (t) { L.push('- ' + t); }); });
    if (m.vendor.length) { L.push('', 'Questions to ask the vendor:'); m.vendor.forEach(function (t) { L.push('- ' + t); }); }
    return L.join('\n');
  }

  root.R3Result = { TONE: TONE, WEIGHT: WEIGHT, model: model, summaryText: summaryText, personText: personText, planText: planText };
})(typeof self !== 'undefined' ? self : this);
