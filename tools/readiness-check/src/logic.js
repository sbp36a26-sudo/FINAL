/* Readiness check v3: question selection, verdict, action plan and the full working-out.
   Plain script, no dependencies; runs in both pages and in the Node tests.
   Data: D6 readiness data (areas, 31 questions, building blocks, 9 types of tool, add-ons, 91 use cases),
   the AI Register label file (provisional legal labels), and the changes from:
   - reports/Hotel AI readiness check design.md (18 Nov 2026)
   - research_notes/Hotel AI readiness check design/review_*.md (question wording, result, journey)
   - reports/Readiness check retention and trust.md (18 Nov 2026): no composite score, unknown is not No,
     stages, verdict built from open items, no "Ready to scale" until there are pilot questions. */
(function (root) {
  'use strict';

  var RULES = 'v3 (19 Nov 2026)';
  var AK = ['pe', 'sk', 'fi', 'te', 'da', 'or'];
  var LOW = 0.40, HIGH = 0.75;

  var STAGES = {
    explore: { name: 'Looking at options', long: 'Looking at options: no vendor chosen yet' },
    choose: { name: 'Talking to a vendor', long: 'Talking to a vendor: nothing signed yet' },
    sign: { name: 'About to sign or start a trial', long: 'About to sign a contract or start a trial' },
    live: { name: 'Already in use', long: 'Already in use at the hotel' }
  };
  var LEVELS = {
    stop: { name: 'Not ready yet', chip: 'found' },
    open: { name: 'Not enough information yet', chip: 'open' },
    pilot: { name: 'Ready to pilot', chip: 'scale' }
  };
  var WHO = {
    gm: 'General manager', owner: 'Owner or head office', fin: 'Finance', it: 'IT', vendor: 'The vendor',
    dpo: 'Data protection contact', hr: 'HR', dept: 'Head of the department using it', staff: 'Staff who will use it', other: 'Someone else'
  };
  var KIND = { decide: 'a decision', doc: 'a short document', vendor: 'a step with the vendor', project: 'a project' };

  /* Answers. Points: Yes 2, Partly 1, No 0. "Don't know yet" and "Doesn't apply" are left out of the points:
     an unknown answer is something to find out, not a No (challenge round, 18 Nov 2026). */
  var ANSWER = { y: 'Yes', p: 'Partly', n: 'No', k: "Don't know yet", na: "Doesn't apply", none: "Doesn't apply (see note)" };
  var POINTS = { y: 2, p: 1, n: 0 };

  /* Question wording v3: one idea per question, plain words, "what counts as Yes" shown before the answer.
     Source: review_question_wording.md (18 Nov 2026). Codes without an entry keep the D6 text. */
  var W = {
    P1: { q: 'Is there a named person in charge of this tool, with agreed hours each week for it?', yes: 'A named role with hours set aside, for example in a job description.',
          ask: 'Which role, and how many hours a week?', ex: 'Revenue manager, 4 hours a week, in her job description', who: 'gm', kind: 'decide',
          act: 'Name the person in charge of this tool and agree the hours they will spend on it.' },
    P4: { q: 'Have you told the staff concerned what they will do with the time this tool saves?', who: 'gm', kind: 'decide', act: 'Decide what staff will do with the time saved, and tell them.' },
    P5: { q: 'Can staff overrule the tool when it gets something wrong?', yes: 'A named role can stop or correct it, and knows how.', vendor: true,
          ask: 'Who can overrule or stop it, and how?', ex: 'Front-office manager can switch off auto-replies in the admin screen', who: 'dept', kind: 'vendor',
          act: 'Agree with the vendor how staff can overrule or switch off the tool, and show the people concerned.' },
    P6: { q: 'Have the people who approve this spending had a briefing on AI?', who: 'gm', kind: 'decide', act: 'Give the people who approve the spending a short briefing on what AI can and cannot do.' },
    O6: { q: 'Do staff know whom to tell when the tool gets something wrong?', who: 'dept', kind: 'decide', act: 'Name the person staff tell when the tool gets something wrong.' },
    X1: { q: 'Have the staff who will use the tool tried it or watched a demo?', who: 'dept', kind: 'decide', act: 'Show the tool to the staff who will use it and ask what they think.' },
    P2: { q: 'Can the managers involved name one thing this tool cannot do reliably?', who: 'dept', kind: 'decide', act: 'Ask the vendor where the tool is weak, and brief the managers involved.' },
    P3: { q: "Is training planned that teaches staff to check the tool's results, not only to use it?", who: 'dept', kind: 'doc', act: "Plan training that covers checking the tool's results." },
    O4: { q: "Have you seen the tool work on your own hotel's data?", who: 'vendor', kind: 'vendor', vendor: true, act: 'Ask the vendor for a test on your own data, not a standard demo.' },
    F1: { q: 'Is there a written budget for the first 12 months that covers the full cost, not only the subscription?', yes: 'A budget line covering subscription, set-up and connection to your systems, training and running costs.',
          ask: 'Where is it written down? The amount is optional.', ex: 'Line in the 2027 budget approved by the owner', who: 'fin', kind: 'doc',
          act: 'Write a 12-month budget line for the full cost (subscription, set-up, connection, training, running costs).' },
    F2: { q: 'Have you written down today\'s figure for the one number this tool should improve?', help: 'For example hours spent, reply time, revenue per room, kilos of food thrown away.',
          yes: 'One number, measured now, with the date.', ask: 'Which number, and what is it today?', ex: 'Average reply time to guest emails: 9 hours (measured in October)', who: 'dept', kind: 'doc',
          act: 'Pick the one number this tool should improve and measure it now, before you start.' },
    F3: { q: 'Have you agreed, before starting, what result a trial must reach for you to keep the tool?', who: 'gm', kind: 'decide', act: 'Write down the result a trial must reach for you to keep the tool, and the date you will decide.' },
    F4: { q: 'Is it decided who pays for the tool (hotel, owner, group fund, grant or vendor package)?', who: 'fin', kind: 'decide', act: 'Decide who pays for the tool.' },
    F5: { q: "Does someone check the tool's bill every month?", who: 'fin', kind: 'decide', act: "Name who checks the tool's bill each month, and agree a spending limit if the price depends on use." },
    T1: { q: 'Has it been confirmed in writing that the tool can read from and write back to your hotel systems?', help: 'For example your hotel booking system (PMS).', vendor: true,
          yes: 'Written confirmation from the vendor and, ideally, a live test on your own systems.', ask: 'Who confirmed it, and how?', ex: 'Vendor confirmed the two-way PMS link in writing; tested on our own system on 4 Nov', who: 'vendor', kind: 'vendor',
          act: 'Get written confirmation from the vendor that the tool connects both ways to your systems, and test it on your own system.' },
    T2: { q: 'Which describes your main hotel system (PMS)?', who: 'it', kind: 'decide', opts: [['y', 'Online system other software can connect to'], ['y2', 'All-in-one system that already includes this tool'], ['n', 'Older system in the hotel, hard to connect'], ['k', "Don't know yet"]],
          act: 'Find out from your PMS provider whether other software can connect to it.' },
    T3: { q: 'Where the tool will be used, does the internet connection work without regular dropouts?', who: 'it', kind: 'project', act: 'Fix the internet connection where the tool will be used.' },
    T4: { q: 'Do you have a written list of the software your hotel uses that shows which ones share data?', who: 'it', kind: 'doc', act: 'Write a list of the software you use and which ones share data.' },
    T5: { q: 'If the tool stops working for a day, is there a written way to do the job without it?', who: 'dept', kind: 'doc', act: 'Write down how the job gets done if the tool stops working.' },
    D1: { q: 'Can you name the system that holds each piece of data this tool needs?', who: 'it', kind: 'doc', act: 'List the data the tool needs and the system each piece sits in.' },
    D2: { q: 'When a returning guest books, can staff see past stays, spending and preferences in one place?', who: 'it', kind: 'project', act: 'Link guest records across your systems so one guest has one profile.' },
    D3: { q: 'Does a named person check at set times that the data this tool uses is correct and up to date?', who: 'dept', kind: 'decide', act: 'Name who checks the data this tool uses, and how often.' },
    D4: { q: "Is there one up-to-date source for your hotel's facts (rooms, services, prices, house rules) that the tool can use?", who: 'dept', kind: 'doc', act: "Put your hotel's facts in one up-to-date place the tool can use." },
    D5a: { q: 'Have you signed a data processing agreement with the vendor of this tool?', yes: 'Signed agreement that says the data stays yours, how you get it back, and whether the vendor may train on it.', vendor: true, none: 'This tool uses no guest or staff data',
           ask: 'When was it signed, and does it say the data stays yours?', ex: 'Signed 3 Oct; data stays ours, can be exported, no training on it', who: 'vendor', kind: 'vendor',
           act: 'Sign a data processing agreement with the vendor before any guest or staff data goes into the tool.' },
    D5b: { q: 'Has your data protection contact confirmed in writing that you may use guest or staff data in this tool?', yes: 'A short written note from your data protection contact.', none: 'This tool uses no guest or staff data',
           ask: 'Who confirmed it, and when?', ex: 'Our data protection officer confirmed by email on 5 Nov', who: 'dpo', kind: 'doc',
           act: 'Ask your data protection contact to confirm in writing that you may use this data in the tool.' },
    O1: { q: 'Has the person who decides on spending approved a short written plan that says what this tool should achieve?', help: 'One page is enough. In a managed or franchised hotel this is the owner.',
          yes: 'A one-page plan, approved, with the date.', ask: 'Who approved it, and when?', ex: 'One-page plan approved by the owner on 12 Nov', who: 'owner', kind: 'doc',
          act: 'Write a one-page plan (goal, number to improve, cost, person in charge) and get it approved.' },
    O2: { q: 'Have you written down, step by step, who does what once the tool is in use?', who: 'dept', kind: 'doc', act: 'Write down who does what once the tool is in use.' },
    O3: { q: 'Do you have a written list of everyone who must approve this tool before you buy it?', help: 'For example owner, brand, management company.', who: 'gm', kind: 'doc', act: 'List everyone who must approve the tool (owner, brand, management company).' },
    O5: { q: 'Do you have a named contact outside the vendor whom you can ask for independent advice?', who: 'gm', kind: 'decide', act: 'Find an independent contact (association, adviser or a hotel that uses the tool).' },
    G1: { q: 'Do you have written rules telling staff what they must not type into AI tools?', help: 'For example guest data or contracts.', who: 'gm', kind: 'doc', act: 'Write one page of rules on what staff must not put into AI tools.' },
    G2: { q: 'Has a written risk check been done for this tool before it goes live?', help: 'It should cover data protection, security, legal duties and business risk.', who: 'dpo', kind: 'doc',
          act: 'Do a written risk check for this tool before it goes live.' },
    G2s: { q: 'Has a data protection impact assessment (DPIA) been done for this tool?', help: 'A DPIA is a written assessment the GDPR requires when a tool handles sensitive personal data, such as staff or biometric data.',
           yes: 'A completed DPIA, with the date and who did it.', ask: 'When was it done, and by whom?', ex: 'DPIA completed by our data protection officer on 5 Nov', who: 'dpo', kind: 'doc',
           act: 'Have a data protection impact assessment (DPIA) done before the tool goes live.' },
    G3: { q: "Have you decided which of the tool's outputs a person must check before they take effect?", who: 'dept', kind: 'decide', act: 'Decide which outputs a person must check before they take effect.' },
    G4: { q: "Has your IT or security contact checked this vendor's security before it gets access to your systems?", who: 'it', kind: 'vendor', vendor: true, act: "Have IT check the vendor's security before giving access." },
    X2a: { q: 'Can a guest who does not want to use the tool reach a staff member instead?', who: 'dept', kind: 'decide', act: 'Make sure guests can always reach a person instead of the tool.' },
    X2b: { q: 'Have you tested the tool with real guests or collected their feedback?', who: 'dept', kind: 'project', act: 'Test the tool with a small group of guests and collect their feedback.' },
    XG: { q: 'Have your staff representatives (works council, staff committee or union delegates) been formally told about this tool before it is used?',
          help: 'Whether they must also be consulted, or must agree, depends on your country: check with a labour lawyer.', none: 'We have no staff representatives',
          yes: 'The date they were told, and how.', ask: 'When were they told, and how?', ex: 'Works council told at its meeting on 20 Oct; minutes on file', who: 'hr', kind: 'decide',
          act: 'Tell your staff representatives about the tool before it is used, and ask a labour lawyer whether they must also agree.' },
    XL: { q: 'Has someone checked what the EU AI Act asks of your hotel for this tool?', help: 'This kind of use is on the AI Act\'s high-risk list. Duties for hotels that use such tools apply from 2 Dec 2027. The AI Register tab lists the items to check.',
          yes: 'A named person went through the items to check, with the date.', ask: 'Who checked it, and when?', ex: 'Our data protection officer went through the AI Register items on 5 Nov', who: 'dpo', kind: 'doc',
          act: 'Go through the AI Act items to check for this tool (AI Register tab) with your data protection contact.' }
  };

  /* Where "Doesn't apply" is never offered: must-haves and items that protect people or the hotel. */
  var NO_NA = { P5: 1, G2: 1, G2s: 1, G3: 1, G4: 1, X2a: 1, XL: 1, T2: 1 };

  /* Tick lists replace the generated resource questions (review: 73% of them read badly). One stem per area. */
  var STEM = {
    pe: 'Who needs to be involved. Tick those who have agreed to take part:',
    sk: 'The people involved can already:',
    te: 'In place and working:',
    da: 'You have this data, complete and current:',
    or: 'Agreed in writing:'
  };
  var LEGAL_RE = /AI Act|GDPR|FADP|DPIA|Art\.\s?\d|see D7|high-risk|special-category|lawful basis|disclose AI|tell (callers|guests).*AI/i;

  function cleanItem(s) {
    s = String(s || '').replace(/\((?:[^()]*see D7[^()]*)\)/gi, '').replace(/[–-]\s*see D7/gi, '').replace(/\s+/g, ' ').trim().replace(/[.;,:]$/, '');
    if (!s || /^(none|n\/a|not applicable|—|-)$/i.test(s) || LEGAL_RE.test(s)) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function tickItems(note) {
    return String(note || '').split(/;\s*/).map(cleanItem).filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  /* Build the data model once from the embedded data. */
  function model(D) {
    var R = D.rdy, M = { R: R, AK: AK, AREA: {}, Q: {}, BL: R.blocks, ADD: R.addons, ARCH: {}, ACODES: [], QB: {}, USES: [], UI: {}, REG: D.reg || null };
    R.areas.forEach(function (a) { M.AREA[a.k] = a; });
    Object.keys(R.q).forEach(function (c) { var q = R.q[c]; M.Q[c] = { code: c, a: q.a, q0: q.q, ap: q.ap, gate: !!q.gate, proof: q.proof || '' }; });
    R.arch.forEach(function (a) { M.ARCH[a.c] = a; M.ACODES.push(a.c); });
    R.blocks.forEach(function (b, i) { b.codes.forEach(function (c) { (M.QB[c] = M.QB[c] || []).push(i); }); });
    var rdyUc = {}; R.uc.forEach(function (u) { rdyUc[u.id] = u; });
    var lab = {}; if (M.REG) M.REG.uses.forEach(function (u) { lab[u.id] = u; });
    D.cat.depts.forEach(function (d) {
      d.uses.forEach(function (u, i) {
        var id = d.id + '-' + (i + 1), r = rdyUc[id];
        if (!r || u.notTool) return;
        var x = { id: id, name: u.n, task: u.task, level: u.use || '', dept: d.id, deptName: d.name, int: r.int, arch: r.arch, add: r.add || [], r: r.r || {}, chk: r.chk || [], staff: !!u.staff, kw: u.kw || '', label: lab[id] || null };
        M.USES.push(x); M.UI[id] = x;
      });
    });
    return M;
  }

  function mk(code, a, gate, reasons, extra) {
    var w = W[code] || {};
    var o = { code: code, a: a, q: w.q, help: w.help || '', gate: !!gate, yes: w.yes || '', ask: w.ask || '', ex: w.ex || '', who: w.who || 'gm', kind: w.kind || 'decide',
              act: w.act || '', vendor: !!w.vendor, none: w.none || '', opts: w.opts || null, reasons: reasons || [], note: '' };
    if (extra) Object.keys(extra).forEach(function (k) { o[k] = extra[k]; });
    o.noNa = !!(o.gate || NO_NA[code]);
    return o;
  }

  /* Which questions a tool gets, and why. */
  function selectQuestions(M, x, hotel) {
    hotel = hotel || {};
    var ai = x.arch ? M.ACODES.indexOf(x.arch) : -1, out = [];
    var groupish = hotel.type === 'group' || hotel.type === 'managed';
    var sens = x.add.indexOf('sens') >= 0, high = !!(x.label && x.label.base === 'high');
    AK.forEach(function (a) {
      M.AREA[a].qs.forEach(function (c) {
        var q = M.Q[c], why = [];
        if (q.gate) why.push('Must-have for every AI tool');
        if (x.chk.indexOf(c) >= 0) why.push('Listed to check first for this kind of tool');
        (M.QB[c] || []).forEach(function (bi) {
          var b = M.BL[bi], m = ai >= 0 ? b.m[ai] : (b.L === 1 ? 'C' : '-');
          if (m === 'C' && b.sheet.indexOf(c) >= 0) why.push('Needed by every ' + (x.arch ? M.ARCH[x.arch].s.toLowerCase() : 'AI') + ' tool (building block "' + b.s + '")');
        });
        x.add.forEach(function (k) { if (M.ADD[k] && M.ADD[k].codes.indexOf(c) >= 0) why.push('Risk add-on: ' + M.ADD[k].tag.toLowerCase()); });
        if (!why.length) return;
        if (q.ap === 'Groups' && !groupish) return;
        if (/^Managed or franchised/.test(q.ap) && hotel.type !== 'managed') return;
        if (/^Guest-facing/.test(q.ap) && !guestFacing(x)) return;
        var gate = q.gate;
        if (c === 'T1' && x.int === 'Light') { gate = false; }
        if (c === 'P5' && x.add.indexOf('auto') >= 0) { gate = true; why.push('The tool acts on its own, so a person must be able to overrule it'); }
        if (c === 'D5') {
          out.push(mk('D5a', a, true, why.slice()));
          out.push(mk('D5b', a, true, why.slice()));
          return;
        }
        if (c === 'G2' && sens) { out.push(mk('G2s', a, true, why.concat('The tool handles sensitive personal data, so a DPIA is needed'))); return; }
        var o = mk(c, a, gate, dedupe(why));
        if (c === 'T1' && x.int === 'Light') o.note = 'Not a must-have for light, stand-alone tools.';
        if (c === 'O1' && hotel.type === 'managed') o.note = 'In a managed or franchised hotel, the owner approves the plan.';
        if (c === 'F1') o.note = 'How this tool is usually paid for: ' + String(x.r.fi || '').replace(/\s*\(see D7\)/gi, '') + '.';
        out.push(o);
      });
      if (a !== 'fi') {
        var items = tickItems(x.r[a]);
        if (items.length) out.push({ code: 'R-' + a, a: a, list: true, q: STEM[a], items: items, gate: false, who: { pe: 'gm', sk: 'dept', te: 'it', da: 'dept', or: 'gm' }[a], kind: 'decide', reasons: ['What this tool needs in this area (D6 team sheet)'], noNa: false });
      }
    });
    out.push(mk('X1', 'pe', false, ['Added for every tool: staff acceptance']));
    if (guestFacing(x)) { out.push(mk('X2a', 'or', false, ['Guest-facing tool: guests can reach a person'])); out.push(mk('X2b', 'or', false, ['Guest-facing tool: guest acceptance'])); }
    if (x.staff || sens && /staff|employee|hr/i.test(x.name)) out.push(mk('XG', 'or', true, ['The tool affects staff']));
    if (high) out.push(mk('XL', 'or', true, ['This use is on the EU AI Act high-risk list (AI Register label, provisional)']));
    var order = {}; AK.forEach(function (a, i) { order[a] = i; });
    out.sort(function (p, q) { return order[p.a] - order[q.a] || (q.gate - p.gate) || ((p.list ? 1 : 0) - (q.list ? 1 : 0)); });
    return out;
  }
  function guestFacing(x) { return ['A2', 'A4'].indexOf(x.arch) >= 0 || x.dept === 'gx' || x.dept === 'fo'; }
  function dedupe(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }

  /* Proof line: at least two words and eight characters ("x" does not count). Always printed as self-declared. */
  function proofOk(s) { s = String(s || '').trim(); return s.length >= 8 && s.split(/\s+/).length >= 2; }

  /* One answer → points (or null when left out) and its state. */
  function score(q, A, P) {
    if (q.list) {
      var st = q.items.map(function (_, i) { return A[q.code + '#' + i] || ''; });
      var known = st.filter(function (v) { return v === 'y' || v === 'n'; }), yes = st.filter(function (v) { return v === 'y'; }).length;
      var unk = st.filter(function (v) { return v === '' || v === 'k'; }).length, na = st.filter(function (v) { return v === 'na'; }).length;
      if (na === st.length) return { state: 'na', pts: null, ans: 'na' };
      if (!known.length) return { state: 'unknown', pts: null, ans: 'k', open: unk };
      return { state: yes === known.length ? (unk ? 'partknown' : 'yes') : 'gap', pts: yes === known.length ? 2 : yes ? 1 : 0, ans: yes === known.length ? 'y' : yes ? 'p' : 'n', open: unk };
    }
    var a = A[q.code] || '';
    if (a === '' || a === 'k') return { state: 'unknown', pts: null, ans: a || '' };
    if (a === 'na') return { state: 'na', pts: null, ans: a };
    if (a === 'none') return { state: 'yes', pts: 2, ans: a };
    if (a === 'y2') return { state: 'yes', pts: 2, ans: 'y' };
    if (q.gate && a === 'y' && !proofOk(P[q.code])) return { state: 'gap', pts: 1, ans: 'y', flag: String(P[q.code] || '').trim() ? 'Proof line too short to count' : 'Yes without a proof line counts as Partly' };
    return { state: a === 'y' ? 'yes' : 'gap', pts: POINTS[a], ans: a };
  }

  /* Evaluate one check. stage changes the wording only, not the rules. */
  function evaluate(M, x, hotel, A, P, Who, stage) {
    A = A || {}; P = P || {}; Who = Who || {};
    var qs = selectQuestions(M, x, hotel), area = {}, gates = [], steps = [];
    AK.forEach(function (a) { area[a] = { a: a, name: M.AREA[a].name, pts: 0, max: 0, items: [], pct: null, asked: 0, known: 0 }; });
    qs.forEach(function (q) {
      var s = score(q, A, P), r = area[q.a];
      r.asked++;
      if (s.pts !== null) { r.pts += s.pts; r.max += 2; r.known++; }
      r.items.push({ q: q, s: s });
      if (q.gate) gates.push({ q: q, s: s, met: s.state === 'yes', known: s.state !== 'unknown' });
    });
    var scored = [], thin = [];
    AK.forEach(function (a) { var r = area[a]; if (!r.asked) return; if (r.max) { r.pct = r.pts / r.max; scored.push(r); } else thin.push(r); });
    var unmet = gates.filter(function (g) { return g.known && !g.met; });
    var unknownGates = gates.filter(function (g) { return !g.known; });
    /* An area decides the verdict only when at least two of its questions have a known answer, or all of them do. */
    var low = scored.filter(function (r) { return r.pct < LOW && (r.known >= 2 || r.known === r.asked); });
    var level = unmet.length || low.length ? 'stop' : unknownGates.length || thin.length ? 'open' : 'pilot';
    var mid = scored.filter(function (r) { return r.pct >= LOW && r.pct < HIGH; });
    steps.push('Tool "' + x.name + '": ' + (x.arch ? M.ARCH[x.arch].s : 'other') + ' tool, ' + x.int.toLowerCase() + ' effort' + (x.add.length ? ', add-ons: ' + x.add.map(function (k) { return M.ADD[k].tag.toLowerCase(); }).join(', ') : '') + '. Stage: ' + (STAGES[stage] ? STAGES[stage].name : 'not given') + '.');
    steps.push(qs.length + ' questions (' + gates.length + ' must-haves). Yes 2 points, Partly 1, No 0; "Don\'t know yet" and "Doesn\'t apply" are left out of the points.');
    AK.forEach(function (a) { var r = area[a]; if (!r.asked) return; steps.push(r.name + ': ' + (r.max ? r.pts + ' of ' + r.max + ' points = ' + Math.round(r.pct * 100) + '%' : 'no known answers') + ' (' + r.known + ' of ' + r.asked + ' answered).'); });
    steps.push('Must-haves: ' + (gates.length - unmet.length - unknownGates.length) + ' met, ' + unmet.length + ' not met, ' + unknownGates.length + ' not known yet.');
    steps.push(level === 'stop' ? 'Not ready yet because ' + [unmet.length ? unmet.length + ' must-have' + (unmet.length > 1 ? 's are' : ' is') + ' not met' : '', low.length ? low.map(function (r) { return r.name; }).join(', ') + ' below 40%' : ''].filter(Boolean).join(' and ') + '.'
      : level === 'open' ? 'Not enough information yet: ' + [unknownGates.length ? unknownGates.length + ' must-have' + (unknownGates.length > 1 ? 's' : '') + ' not known' : '', thin.length ? thin.map(function (r) { return r.name; }).join(', ') + ' with no known answer' : ''].filter(Boolean).join('; ') + '. A known No would settle it; a positive verdict needs every must-have known and met.'
      : 'Ready to pilot: every must-have met with a proof line, and no area below 40%.' + (mid.length ? ' ' + mid.map(function (r) { return r.name; }).join(', ') + ' between 40% and 74%: close during the pilot.' : ''));
    var ev = { qs: qs, area: area, scored: scored, thin: thin, gates: gates, unmet: unmet, unknownGates: unknownGates, low: low, mid: mid, level: level, steps: steps, stage: stage || '' };
    ev.actions = actions(ev, Who, A);
    ev.counts = { asked: qs.length, known: qs.filter(function (q) { var s = score(q, A, P); return s.state !== 'unknown'; }).length, met: gates.length - unmet.length - unknownGates.length, gates: gates.length };
    return ev;
  }

  /* Every open item as an action: who, what, which group. Nothing is cut off.
     Groups: must (must-have not in place), vendor (to confirm with the vendor), find (to find out, by person), close (gaps to close). */
  function actions(ev, Who, A) {
    var out = [], seen = {};
    var areas = ev.scored.slice().sort(function (a, b) { return a.pct - b.pct; }).concat(ev.thin);
    function push(o) { if (!seen[o.key]) { seen[o.key] = 1; out.push(o); } }
    ev.unmet.forEach(function (g) { push({ key: g.q.code, group: 'must', q: g.q, who: g.q.who, text: g.q.act, ans: g.s.ans, flag: g.s.flag || '', must: true }); });
    areas.forEach(function (r) {
      r.items.forEach(function (it) {
        var q = it.q, s = it.s, who = Who[q.code] || q.who;
        if (q.list) {
          var unk = [], miss = [];
          q.items.forEach(function (t, i) { var v = A[q.code + '#' + i] || ''; if (v === '' || v === 'k') unk.push(t); else if (v === 'n') miss.push(t); });
          if (unk.length) push({ key: q.code + ':find', group: who === 'vendor' ? 'vendor' : 'find', q: q, who: who, text: 'Find out whether these are in place: ' + unk.join('; '), area: r.name });
          if (miss.length) push({ key: q.code, group: 'close', q: q, who: q.who, text: 'Get in place: ' + miss.join('; '), ans: s.ans, area: r.name });
          return;
        }
        if (s.state === 'unknown') push({ key: q.code + ':find', group: who === 'vendor' ? 'vendor' : 'find', q: q, who: who, text: q.q, must: q.gate, area: r.name });
        else if (s.state === 'gap' && !q.gate) push({ key: q.code, group: 'close', q: q, who: q.who, text: q.act, ans: s.ans, area: r.name });
      });
    });
    return out;
  }

  /* Plain-words summary built from what is actually open (never a fixed sentence per level). */
  function summary(ev, stage) {
    var n = ev.unmet.length, u = ev.unknownGates.length, out = [];
    var before = stage === 'live' ? 'before you rely on it further' : stage === 'sign' ? 'before you sign or start the trial' : 'before you sign anything';
    if (ev.level === 'stop') {
      out.push(n ? n + ' of the ' + ev.gates.length + ' must-haves ' + (n > 1 ? 'are' : 'is') + ' not in place. Each one on its own is reason enough to wait ' + before + '.' : '');
      if (u) out.push(u + ' more must-have' + (u > 1 ? 's are' : ' is') + ' not known yet.');
      if (ev.low.length) out.push(ev.low.map(function (r) { return r.name; }).join(' and ') + (ev.low.length > 1 ? ' are' : ' is') + ' below 40% on what you told us.');
    } else if (ev.level === 'open') {
      out.push('On what you told us, nothing rules this tool out yet. ' + (u ? u + ' must-have' + (u > 1 ? 's are' : ' is') + ' still open' : 'Some areas have no known answers') + ': confirm ' + (u > 1 ? 'them' : 'it') + ' ' + before + '.');
      if (u && !ev.thin.length) out.push('If ' + (u > 1 ? 'these ' + u + ' are' : 'this is') + ' confirmed with a Yes and a proof line, the verdict becomes "Ready to pilot".');
    } else {
      out.push('Every must-have is in place, with a proof line, and no area is below 40%.');
      out.push(ev.mid.length ? 'Run a time-limited pilot and close the gaps in ' + ev.mid.map(function (r) { return r.name; }).join(', ') + ' while it runs.' : 'Run a time-limited pilot with the number you measured as the yardstick.');
    }
    var strong = ev.scored.filter(function (r) { return r.pct >= HIGH && r.known >= 2; });
    if (strong.length && strong.length === ev.scored.length && strong.length > 2) out.push('Every area you could answer is at 75% or more.');
    else if (strong.length) out.push('Strongest: ' + strong.map(function (r) { return r.name; }).join(', ') + '.');
    return out.filter(Boolean);
  }

  /* Difference between two snapshots (same rules version only). */
  function compare(prev, cur) {
    if (!prev || prev.rules !== cur.rules) return null;
    var closed = cur.metCodes.filter(function (c) { return prev.metCodes.indexOf(c) < 0; });
    var reopened = prev.metCodes.filter(function (c) { return cur.metCodes.indexOf(c) < 0; });
    return { since: prev.at, closed: closed, reopened: reopened, knownGain: cur.known - prev.known, from: prev.level, to: cur.level, openBefore: prev.open, openNow: cur.open };
  }
  function snapshot(ev, at) {
    return { at: at, rules: RULES, level: ev.level, met: ev.counts.met, gates: ev.counts.gates, known: ev.counts.known, asked: ev.counts.asked, open: ev.actions.length,
             metCodes: ev.gates.filter(function (g) { return g.met; }).map(function (g) { return g.q.code; }),
             areas: ev.scored.reduce(function (o, r) { o[r.a] = Math.round(r.pct * 100); return o; }, {}) };
  }

  /* Legal flag from the AI Register label file (provisional until D7 sign-off). No article numbers on client pages. */
  var CC = { Germany: 'DE', France: 'FR', Spain: 'ES', Sweden: 'SE', Switzerland: 'CH', 'United Kingdom': 'GB' };
  function legal(M, x, hotel) {
    var G = M.REG, l = x.label; if (!G || !l) return null;
    var lab = G.labels[l.base] || { name: 'Not labelled', short: '' };
    var packs = (l.packs || []).slice(); if (l.chat) packs.push('chat'); if (l.base === 'high') packs.push('hr-user');
    var items = G.items.filter(function (i) { return packs.indexOf(i.pack) >= 0 && i.role !== 'maker' && !/^C1m/.test(i.id); }).slice(0, 8)
      .map(function (i) { return { text: i.text, who: i.who, from: i.since && G.dates[i.since] ? G.dates[i.since] : '' }; });
    var could = (l.switches || []).map(function (s) { var sw = G.switches[s.id]; return sw ? { q: sw.q, to: (G.labels[sw.yes] || {}).name || '' } : null; }).filter(Boolean);
    var cc = CC[(hotel || {}).country] || '';
    var country = cc === 'CH' ? 'Switzerland is not in the EU. The EU AI Act reaches Swiss hotels only in some cases (for example a group with hotels in the EU); the Swiss Data Protection Act and labour law apply to AI directly. This check does not yet cover Swiss rules in detail.'
      : cc === 'GB' ? 'The United Kingdom is not in the EU. The EU AI Act reaches UK hotels only in some cases; UK data protection and employment law apply to AI directly. This check does not yet cover UK rules in detail.'
      : (hotel || {}).country && (hotel || {}).country !== 'Other' ? 'The EU AI Act applies in ' + hotel.country + '. National rules, for example on staff consultation, differ by country and are not checked here.' : 'The EU AI Act applies in EU countries. Swiss and UK rules are not checked here.';
    return { name: lab.name, short: lab.short, why: l.why || '', base: l.base, items: items, could: could, country: country, labour: x.staff && G.labourNotes[cc] ? G.labourNotes[cc] : '' };
  }

  /* Vendor questions for this tool: the register's list, filtered, plus the hotel's own open vendor items. */
  function vendorQs(M, x, ev) {
    var G = M.REG, l = x.label || {}, out = [];
    out.push('Can you show the tool working on our own systems and data, not a standard demo?');
    if (G) G.vendorQuestions.forEach(function (v) {
      if (v.for === 'all' || (v.for === 'chat' && l.chat) || (v.for === 'high' && l.base === 'high') || (v.for === 'pricing' && x.dept === 'rm')) out.push(v.q.replace(/ under the AI Act/, ''));
    });
    out.push('What does the full cost for the first 12 months add up to (subscription, set-up, connection, training)?');
    out.push('If we stop using the tool, how do we get all our data back, and in what format?');
    var ASK = { T1: 'Can you confirm in writing that the tool reads from and writes back to our systems, and show it on our own system?',
                P5: 'How can our staff overrule or switch off the tool, and is every action it takes logged?',
                G4: 'Can you share your security certifications and the result of your latest security test?',
                D5b: 'Which guest or staff data does the tool need, and for what purpose?' };
    (ev ? ev.actions : []).forEach(function (a) { if (a.group === 'vendor' && ASK[a.q.code]) out.push(ASK[a.q.code]); });
    return dedupe(out);
  }

  var api = { RULES: RULES, AK: AK, STAGES: STAGES, LEVELS: LEVELS, WHO: WHO, KIND: KIND, ANSWER: ANSWER, POINTS: POINTS, LOW: LOW, HIGH: HIGH, W: W,
    model: model, selectQuestions: selectQuestions, evaluate: evaluate, score: score, proofOk: proofOk, summary: summary, compare: compare, snapshot: snapshot, legal: legal, vendorQs: vendorQs, tickItems: tickItems };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RCLogic = api;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
