/* Readiness check v4: question selection, verdict, action plan and the full working-out.
   Plain script, no dependencies; runs in both pages and in the Node tests.
   Rules v4 (20 Nov 2026) follow the build ruling in reports/Council - readiness check audit.md, section A
   (audit findings F01-F41 in reports/audit-readiness/1_fact_logic.md). CHANGES below lists them in plain words.
   Data: D6 readiness data (areas, 31 questions, building blocks, 9 types of tool, add-ons, 98 tools),
   the AI Register label file (provisional legal labels), and the changes from:
   - reports/Hotel AI readiness check design.md (18 Nov 2026)
   - research_notes/Hotel AI readiness check design/review_*.md (question wording, result, journey)
   - reports/Readiness check retention and trust.md (18 Nov 2026): no composite score, unknown is not No,
     stages, verdict built from open items, no "scale" verdict until there are pilot questions. */
(function (root) {
  'use strict';

  var RULES = 'v4 (20 Nov 2026)';
  var AK = ['pe', 'sk', 'fi', 'te', 'da', 'or'];
  var LOW = 0.40, HIGH = 0.75;

  var STAGES = {
    explore: { name: 'Looking at options', long: 'Looking at options: no vendor chosen yet' },
    choose: { name: 'Talking to a vendor', long: 'Talking to a vendor: nothing signed yet' },
    sign: { name: 'About to sign or start a trial', long: 'About to sign a contract or start a trial' },
    live: { name: 'Already in use', long: 'Already in use at the hotel' }
  };
  /* The name of the top verdict is the report owner's decision (ruling B1). To change it, edit these two lines.
     The level KEY stays 'pilot' (saved checks and shared copies store the key, never the name). */
  var PILOT_NAME = 'No blocker found: you can start a pilot';
  var PILOT_NAME_LIVE = 'No blocker found for continued use';
  var LEVELS = {
    stop: { name: 'Not ready yet', chip: 'found' },
    open: { name: 'Not enough information yet', chip: 'open' },
    pilot: { name: PILOT_NAME, nameLive: PILOT_NAME_LIVE, chip: 'scale' }
  };
  function levelName(level, stage) { var l = LEVELS[level]; return !l ? String(level || '') : (stage === 'live' && l.nameLive) || l.name; }
  var WHO = {
    gm: 'General manager', owner: 'Owner or head office', fin: 'Finance', it: 'IT', vendor: 'The vendor',
    dpo: 'Data protection contact', hr: 'HR', dept: 'Head of the department using it', staff: 'Staff who will use it', other: 'Someone else'
  };
  var KIND = { decide: 'a decision', doc: 'a short document', vendor: 'a step with the vendor', project: 'a project' };

  /* Answers. Points: Yes 2, Partly 1, No 0. "Don't know yet" and "Doesn't apply" are left out of the points:
     an unknown answer is something to find out, not a No (challenge round, 18 Nov 2026). */
  var ANSWER = { y: 'Yes', p: 'Partly', n: 'No', k: "Don't know yet", na: "Doesn't apply", none: "Doesn't apply (see note)" };
  /* The words for one stored answer; the way-out answer ('none') reads as the option the hotel chose. */
  function answerText(q, a) { return a === 'none' ? (q && q.none) || ANSWER.none : a === 'y2' ? 'Yes' : ANSWER[a] || ''; }
  var STALE = 'This answer is no longer offered for this tool. Please answer again.';
  var NO_DATA = 'This tool uses no personal data (guests, staff, job candidates, callers)';
  var NO_ACT = 'We have checked: the EU AI Act does not apply to us';
  var NOT_REQ = 'Checked: not required (confirmed in writing)';
  var HUMAN = 'The team treats human control as a must-have for high-risk uses.';
  var POINTS = { y: 2, p: 1, n: 0 };

  /* Question wording v3: one idea per question, plain words, "what counts as Yes" shown before the answer.
     Source: review_question_wording.md (18 Nov 2026). Codes without an entry keep the D6 text. */
  var W = {
    P1: { short: "the person in charge", q: 'Is there a named person in charge of this tool, with agreed hours each week for it?', yes: 'A named role with hours set aside, for example in a job description.',
          ask: 'Which role, and how many hours a week?', ex: 'Revenue manager, 4 hours a week, in her job description', who: 'gm', kind: 'decide',
          act: 'Name the person in charge of this tool and agree the hours they will spend on it.' },
    P4: { q: 'Have you told the staff concerned what they will do with the time this tool saves?', who: 'gm', kind: 'decide', act: 'Decide what staff will do with the time saved, and tell them.' },
    P5: { short: "how staff can overrule the tool", q: 'Can staff overrule the tool when it gets something wrong?', yes: 'A named role can stop or correct it, and knows how.', vendor: true,
          ask: 'Who can overrule or stop it, and how?', ex: 'Front-office manager can switch off auto-replies in the admin screen', who: 'dept', kind: 'vendor',
          act: 'Agree with the vendor how staff can overrule or switch off the tool, and show the people concerned.' },
    P6: { q: 'Have the people who approve this spending had a briefing on AI?', who: 'gm', kind: 'decide', act: 'Give the people who approve the spending a short briefing on what AI can and cannot do.' },
    O6: { q: 'Do staff know whom to tell when the tool gets something wrong?', who: 'dept', kind: 'decide', act: 'Name the person staff tell when the tool gets something wrong.' },
    X1: { q: 'Have the staff who will use the tool tried it or watched a demo?', who: 'dept', kind: 'decide', act: 'Show the tool to the staff who will use it and ask what they think.' },
    P2: { q: 'Can the managers involved name one thing this tool cannot do reliably?', who: 'dept', kind: 'decide', act: 'Ask the vendor where the tool is weak, and brief the managers involved.' },
    P3: { q: "Is training planned that teaches staff to check the tool's results, not only to use it?", who: 'dept', kind: 'doc', act: "Plan training that covers checking the tool's results." },
    O4: { q: "Have you seen the tool work on your own hotel's data?", who: 'vendor', kind: 'vendor', vendor: true, act: 'Ask the vendor for a test on your own data, not a standard demo.' },
    F1: { short: "the 12-month budget", q: 'Is there a written budget for the first 12 months that covers the full cost, not only the subscription?', yes: 'A budget line covering subscription, set-up and connection to your systems, training and running costs.',
          ask: 'Where is it written down? The amount is optional.', ex: 'Line in the 2027 budget approved by the owner', who: 'fin', kind: 'doc',
          act: 'Write a 12-month budget line for the full cost (subscription, set-up, connection, training, running costs).' },
    F2: { short: "today's figure for the number to improve", q: 'Have you written down today\'s figure for the one number this tool should improve?', help: 'For example hours spent, reply time, revenue per room, kilos of food thrown away.',
          yes: 'One number, measured now, with the date.', ask: 'Which number, and what is it today?', ex: 'Average reply time to guest emails: 9 hours (measured in October)', who: 'dept', kind: 'doc',
          act: 'Pick the one number this tool should improve and measure it now, before you start.' },
    F3: { q: 'Have you agreed, before starting, what result a trial must reach for you to keep the tool?', who: 'gm', kind: 'decide', act: 'Write down the result a trial must reach for you to keep the tool, and the date you will decide.' },
    F4: { q: 'Is it decided who pays for the tool (hotel, owner, group fund, grant or vendor package)?', who: 'fin', kind: 'decide', act: 'Decide who pays for the tool.' },
    F5: { q: "Does someone check the tool's bill every month?", who: 'fin', kind: 'decide', act: "Name who checks the tool's bill each month, and agree a spending limit if the price depends on use." },
    T1: { short: "the two-way link to your systems", q: 'Has it been confirmed in writing that the tool can read from and write back to your hotel systems?', help: 'For example your hotel booking system (PMS).', vendor: true,
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
    D5a: { q: 'Have you signed a data processing agreement with the vendor of this tool?', yes: 'Signed agreement that says the data stays yours, how you get it back, and whether the vendor may train on it.', vendor: true, none: NO_DATA, short: 'the data processing agreement',
           ask: 'When was it signed, and does it say the data stays yours?', ex: 'Signed 3 Oct; data stays ours, can be exported, no training on it', who: 'vendor', kind: 'vendor',
           act: 'Sign a data processing agreement with the vendor before any guest or staff data goes into the tool.' },
    D5b: { q: 'Has your data protection contact confirmed in writing that you may use guest or staff data in this tool?', yes: 'A short written note from your data protection contact.', none: NO_DATA, short: 'the data protection confirmation',
           help: 'If you have no data protection officer, this is whoever handles data protection for you, often an outside adviser.',
           ask: 'Who confirmed it, and when?', ex: 'Our data protection officer confirmed by email on 5 Nov', who: 'dpo', kind: 'doc',
           act: 'Ask your data protection contact to confirm in writing that you may use this data in the tool.' },
    O1: { short: "the approved one-page plan", q: 'Has the person who decides on spending approved a short written plan that says what this tool should achieve?', help: 'One page is enough. In a managed or franchised hotel this is the owner.',
          yes: 'A one-page plan, approved, with the date.', ask: 'Who approved it, and when?', ex: 'One-page plan approved by the owner on 12 Nov', who: 'owner', kind: 'doc',
          act: 'Write a one-page plan (goal, number to improve, cost, person in charge) and get it approved.' },
    O2: { q: 'Have you written down, step by step, who does what once the tool is in use?', who: 'dept', kind: 'doc', act: 'Write down who does what once the tool is in use.' },
    O3: { q: 'Do you have a written list of everyone who must approve this tool before you buy it?', help: 'For example owner, brand, management company.', who: 'gm', kind: 'doc', act: 'List everyone who must approve the tool (owner, brand, management company).' },
    O5: { q: 'Do you have a named contact outside the vendor whom you can ask for independent advice?', who: 'gm', kind: 'decide', act: 'Find an independent contact (association, adviser or a hotel that uses the tool).' },
    G1: { q: 'Do you have written rules telling staff what they must not type into AI tools?', help: 'For example guest data or contracts.', who: 'gm', kind: 'doc', act: 'Write one page of rules on what staff must not put into AI tools.' },
    G2: { q: 'Has a written risk check been done for this tool before it goes live?', help: 'It should cover data protection, security, legal duties and business risk.', who: 'dpo', kind: 'doc',
          act: 'Do a written risk check for this tool before it goes live.' },
    G2s: { q: 'Has a data protection impact assessment (DPIA) been done for this tool?', help: 'A DPIA (data protection impact assessment) is a written assessment that data protection law requires before processing that is likely to put people at high risk. Your data protection contact decides whether this tool needs one.',
           none: NOT_REQ, noneNote: true, noneAsk: 'Who confirmed it, and when?', short: 'the DPIA',
           yes: 'A completed DPIA, with the date and who did it.', ask: 'When was it done, and by whom?', ex: 'DPIA completed by our data protection officer on 5 Nov', who: 'dpo', kind: 'doc',
           act: 'Ask your data protection contact whether this tool needs a data protection impact assessment (DPIA), and have it done before the tool goes live if it does.' },
    G3: { q: "Have you decided which of the tool's outputs a person must check before they take effect?", who: 'dept', kind: 'decide', short: 'which outputs a person must check',
          yes: 'A short written list of the outputs a named role checks before they take effect.', ask: 'Which outputs, and who checks them?', ex: 'HR manager reviews every shortlist before candidates are contacted', act: 'Decide which outputs a person must check before they take effect.' },
    G4: { q: "Has your IT or security contact checked this vendor's security before it gets access to your systems?", who: 'it', kind: 'vendor', vendor: true, act: "Have IT check the vendor's security before giving access." },
    X2a: { q: 'Can a guest who does not want to use the tool reach a staff member instead?', who: 'dept', kind: 'decide', act: 'Make sure guests can always reach a person instead of the tool.' },
    X2b: { q: 'Have you tested the tool with real guests or collected their feedback?', who: 'dept', kind: 'project', act: 'Test the tool with a small group of guests and collect their feedback.' },
    XG: { short: "telling your staff representatives", q: 'Have your staff representatives (works council, staff committee or union delegates) been formally told about this tool before it is used?',
          help: 'Whether they must also be consulted, or must agree, depends on your country: check with a labour lawyer.', none: 'We have no staff representatives',
          yes: 'The date they were told, and how.', ask: 'When were they told, and how?', ex: 'Works council told at its meeting on 20 Oct; minutes on file', who: 'hr', kind: 'decide',
          act: 'Tell your staff representatives about the tool before it is used, and ask a labour lawyer whether they must also agree.' },
    XL: { q: 'Has someone checked what the EU AI Act asks of your hotel for this tool?', help: 'This kind of use is on the AI Act\'s high-risk list. Duties for hotels that use such tools apply from 2 Dec 2027. The AI Register tab lists the items to check.', short: 'the EU AI Act check', noneAsk: 'Who checked it, and when?',
          yes: 'A named person went through the items to check, with the date.', ask: 'Who checked it, and when?', ex: 'Our data protection officer went through the AI Register items on 5 Nov', who: 'dpo', kind: 'doc',
          act: 'Go through the AI Act items to check for this tool (AI Register tab) with your data protection contact.' }
  };

  /* Where "Doesn't apply" is never offered: must-haves and items that protect people or the hotel. */
  var NO_NA = { P5: 1, G2: 1, G2s: 1, G3: 1, G4: 1, X2a: 1, XL: 1, T2: 1 };

  /* Tick lists replace the generated resource questions (review: 73% of them read badly). One stem per area. */
  var STEM = {
    pe: 'What this tool needs: people',
    sk: 'What this tool needs: skills',
    te: 'What this tool needs: systems',
    da: 'What this tool needs: data',
    or: 'What this tool needs: written agreements'
  };
  var LEGAL_RE = /AI Act|GDPR|FADP|DPIA|Art\.\s?\d|see D7|high-risk|special-category|lawful basis|disclose AI|tell (callers|guests).*AI/i;

  function cleanItem(s) {
    s = String(s || '').replace(/\((?:[^()]*see D7[^()]*)\)/gi, '').replace(/\s*\(often\s+missing\)/gi, '').replace(/[–-]\s*see D7/gi, '').replace(/\s+/g, ' ').trim().replace(/[.;,:]$/, '');
    if (!s || /^(none|n\/a|not applicable|—|-)$/i.test(s) || LEGAL_RE.test(s)) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function tickItems(note) {
    return String(note || '').split(/;\s*/).map(cleanItem).filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  /* Build the data model once from the embedded data. */
  function model(D) {
    var R = D.rdy, M = { R: R, AK: AK, AREA: {}, Q: {}, BL: R.blocks, ADD: R.addons, ARCH: {}, ACODES: [], QB: {}, USES: [], EXCL: [], DEPTS: D.cat.depts.length, UI: {}, REG: D.reg || null };
    R.areas.forEach(function (a) { M.AREA[a.k] = a; });
    Object.keys(R.q).forEach(function (c) { var q = R.q[c]; M.Q[c] = { code: c, a: q.a, q0: q.q, ap: q.ap, gate: !!q.gate, proof: q.proof || '' }; });
    R.arch.forEach(function (a) { M.ARCH[a.c] = a; M.ACODES.push(a.c); });
    R.blocks.forEach(function (b, i) { b.codes.forEach(function (c) { (M.QB[c] = M.QB[c] || []).push(i); }); });
    var rdyUc = {}; R.uc.forEach(function (u) { rdyUc[u.id] = u; });
    var lab = {}; if (M.REG) M.REG.uses.forEach(function (u) { lab[u.id] = u; });
    D.cat.depts.forEach(function (d) {
      d.uses.forEach(function (u, i) {
        var id = d.id + '-' + (i + 1), r = rdyUc[id];
        if (u.notTool) { M.EXCL.push(u.n); return; }
        if (!r) return;
        var x = { id: id, name: u.n, task: u.task, level: u.use || '', dept: d.id, deptName: d.name, int: r.int, arch: r.arch, add: r.add || [], r: r.r || {}, chk: r.chk || [], staff: !!u.staff, kw: u.kw || '', label: lab[id] || null };
        M.USES.push(x); M.UI[id] = x;
      });
    });
    return M;
  }

  function mk(code, a, gate, reasons, extra) {
    var w = W[code] || {};
    var o = { code: code, a: a, q: w.q, help: w.help || '', gate: !!gate, yes: w.yes || '', ask: w.ask || '', ex: w.ex || '', who: w.who || 'gm', kind: w.kind || 'decide',
              act: w.act || '', vendor: !!w.vendor, none: w.none || '', noneNote: !!w.noneNote, noneAsk: w.noneAsk || '', short: w.short || '', opts: w.opts || null, reasons: reasons || [], note: '' };
    if (extra) Object.keys(extra).forEach(function (k) { o[k] = extra[k]; });
    o.noNa = !!(o.gate || NO_NA[code]);
    return o;
  }

  /* Countries where the EU AI Act does not apply directly: the AI Act must-have gets a way out (rules v4, F06). */
  var NON_EU = { Switzerland: 1, 'United Kingdom': 1, Other: 1 };
  function outsideEU(hotel) { return !!NON_EU[(hotel || {}).country]; }
  /* Does the tool need any link to the hotel's systems? "None" in the D6 sheet means no (rules v4, F19). */
  function noTech(x) { return /^\s*none\b/i.test(String((x.r || {}).te || '')); }
  /* Guest-facing is decided by the tool, not by its department (rules v4, F18):
     a guest conversation or personalisation tool, or a tool the AI Register labels as talking to people. */
  function guestFacing(x) { var l = x.label || {}; return ['A2', 'A4'].indexOf(x.arch) >= 0 || !!l.chat || l.base === 'transparency'; }
  /* May the hotel say "this tool uses no personal data"? Not for tools that plainly do (rules v4, F01). */
  function personalData(x) { var l = x.label || {}; return x.add.indexOf('sens') >= 0 || !!l.chat || l.base === 'high'; }

  /* Which questions a tool gets, and why. */
  function selectQuestions(M, x, hotel) {
    hotel = hotel || {};
    var ai = x.arch ? M.ACODES.indexOf(x.arch) : -1, out = [];
    var groupish = hotel.type === 'group' || hotel.type === 'managed';
    var sens = x.add.indexOf('sens') >= 0, high = !!(x.label && x.label.base === 'high'), pd = personalData(x), light = noTech(x);
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
        if (high && (c === 'P5' || c === 'G3')) why.push(HUMAN);
        if (!why.length) return;
        if (q.ap === 'Groups' && !groupish) return;
        if (/^Managed or franchised/.test(q.ap) && hotel.type !== 'managed') return;
        if (/^Guest-facing/.test(q.ap) && !guestFacing(x)) return;
        var gate = q.gate;
        if (c === 'T1' && light) { gate = false; }
        if (c === 'P5' && x.add.indexOf('auto') >= 0) { gate = true; why.push('The tool acts on its own, so a person must be able to overrule it'); }
        if (high && (c === 'P5' || c === 'G3')) gate = true;
        if (c === 'D5') {
          var ex = pd ? { none: '', noneGone: true } : null;
          out.push(mk('D5a', a, true, why.slice(), ex));
          out.push(mk('D5b', a, true, why.slice(), ex));
          return;
        }
        if (c === 'G2' && sens) { out.push(mk('G2s', a, true, why.concat('This tool handles sensitive personal data, so ask your data protection contact whether this tool needs a DPIA'))); return; }
        var o = mk(c, a, gate, dedupe(why));
        if (c === 'T1' && light) o.note = 'Not a must-have for tools that need no link to your hotel systems.';
        if (c === 'O1' && hotel.type === 'managed') o.note = 'In a managed or franchised hotel, the owner approves the plan.';
        if (c === 'F1' && x.r.fi) o.note = 'How this tool is usually paid for: ' + paidFor(x) + ' (team\'s D6 resource sheet, not a price quote).';
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
    if (high) {
      var xl = mk('XL', 'or', true, ['This use is on the EU AI Act high-risk list (AI Register label, provisional)']);
      if (outsideEU(hotel)) { xl.none = NO_ACT; xl.noneNote = true; }
      else if (!hotel.country) xl.note = 'If your hotel is outside the EU, choose your country on the start screen: this question then offers one more answer.';
      out.push(xl);
    }
    var order = {}; AK.forEach(function (a, i) { order[a] = i; });
    out.sort(function (p, q) { return order[p.a] - order[q.a] || (q.gate - p.gate) || ((p.list ? 1 : 0) - (q.list ? 1 : 0)); });
    return out;
  }
  function paidFor(x) { return String((x.r || {}).fi || '').replace(/\s*\(see D7\)/gi, '').replace(/[.\s]+$/, ''); }
  function dedupe(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }

  /* Note for a must-have Yes: any text counts. A length rule could not stop "hello goodbye", so the tool does not
     pretend to check: the note is printed on the report as written and labelled self-declared (owner, 20 Nov 2026).
     (Stored under P / proofs; the word on screen is "note".) */
  function proofOk(s) { return String(s || '').trim().length > 0; }

  /* One answer → its state, and its points (null when left out of the points).
     States: 'yes' (in place) | 'unconf' (a must-have Yes or way out still without its note) | 'gap' (No or Partly)
             | 'unknown' (blank or "Don't know yet") | 'partknown' (tick list: all known items in place, some unknown) | 'na'.
     done = counts as answered (Yes, Partly, No or Doesn't apply); a tick list is done when no item is blank or "Don't know". */
  function score(q, A, P) {
    A = A || {}; P = P || {};
    if (q.list) {
      var st = q.items.map(function (_, i) { return A[q.code + '#' + i] || ''; });
      var yes = st.filter(function (v) { return v === 'y'; }).length, no = st.filter(function (v) { return v === 'n'; }).length;
      var unk = st.filter(function (v) { return v !== 'y' && v !== 'n' && v !== 'na'; }).length, na = st.filter(function (v) { return v === 'na'; }).length;
      if (na === st.length) return { state: 'na', pts: null, ans: 'na', open: 0, done: true };
      if (!yes && !no) return { state: 'unknown', pts: null, ans: 'k', open: unk, done: false };
      /* Points = 2 × in place ÷ (in place + not yet). "Don't know" and "Doesn't apply" items are left out. */
      return { state: no ? 'gap' : unk ? 'partknown' : 'yes', pts: Math.round(2 * yes / (yes + no) * 100) / 100, ans: !no ? 'y' : yes ? 'p' : 'n', open: unk, done: !unk, yes: yes, no: no };
    }
    var a = A[q.code] || '';
    if (a === '' || a === 'k') return { state: 'unknown', pts: null, ans: a || '', done: false };
    /* "Doesn't apply" where this tool does not offer it (a must-have or a protective question, for example after a rules change): asked again. */
    if (a === 'na' && q.noNa) return { state: 'unknown', pts: null, ans: '', done: false, flag: STALE, stale: true };
    if (a === 'na') return { state: 'na', pts: null, ans: a, done: true };
    if (a === 'none') {
      /* The way out: met as a must-have, left out of the points. Not valid where this tool no longer offers it. */
      if (!q.none) return { state: 'unknown', pts: null, ans: '', done: false, flag: STALE, stale: true };
      if (q.noneNote && !proofOk(P[q.code])) return { state: 'unconf', pts: null, ans: a, done: true, flag: 'Note missing' };
      return { state: 'yes', pts: null, ans: a, done: true };
    }
    if (a === 'y2') return { state: 'yes', pts: 2, ans: 'y', done: true };
    if (q.gate && a === 'y' && !proofOk(P[q.code])) return { state: 'unconf', pts: 2, ans: 'y', done: true, flag: 'Yes, note missing' };
    if (POINTS[a] == null) return { state: 'unknown', pts: null, ans: '', done: false };
    return { state: a === 'y' ? 'yes' : 'gap', pts: POINTS[a], ans: a, done: true };
  }

  /* Has the question an answer the page still offers? "Don't know yet" counts; blank, a stale answer (no longer
     offered) or an unknown value does not. Used by the must-haves step (Next needs one on every must-have) and when a
     saved check reopens. Not used for scoring. */
  function hasAnswer(q, A, P) {
    A = A || {};
    if (q.list) return q.items.every(function (_, i) { return !!A[q.code + '#' + i]; });
    var a = A[q.code] || ''; if (!a) return false;
    if (a === 'k') return true;
    return score(q, A, P).state !== 'unknown';
  }

  /* Words for an area instead of a percentage (rules v4, J21). */
  function areaWord(r, low) {
    if (!r.max) return r.todo ? { word: 'Too little to say', tone: 'na' } : { word: "Doesn't apply", tone: 'na' };
    if (low) return { word: 'Weak', tone: 'lo' };
    if (r.known * 2 < r.asked - r.na) return { word: 'Too little to say', tone: 'na' };
    return r.pct < LOW ? { word: 'Weak', tone: 'lo' } : r.pct < HIGH ? { word: 'Gaps to close', tone: 'md' } : { word: 'Strong', tone: 'hi' };
  }
  function early(stage) { return stage === 'explore' || stage === 'choose'; }
  /* Who an open question goes to when the hotel has not said: the vendor for vendor questions before a vendor is chosen. */
  function defaultWho(q, stage) { return q.vendor && early(stage) ? 'vendor' : q.who; }
  function joinAnd(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  function n_(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }

  /* Evaluate one check. stage changes the wording and who is asked, not the rules. */
  function evaluate(M, x, hotel, A, P, Who, stage) {
    A = A || {}; P = P || {}; Who = Who || {};
    var qs = selectQuestions(M, x, hotel), area = {}, gates = [], steps = [];
    AK.forEach(function (a) { area[a] = { a: a, name: M.AREA[a].name, pts: 0, max: 0, items: [], pct: null, asked: 0, known: 0, answered: 0, na: 0, todo: 0 }; });
    qs.forEach(function (q) {
      var s = score(q, A, P), r = area[q.a];
      r.asked++;
      if (s.pts !== null) { r.pts += s.pts; r.max += 2; r.known++; }
      if (s.done) r.answered++; else r.todo++;
      if (s.state === 'na') r.na++;
      r.items.push({ q: q, s: s });
      if (q.gate) gates.push({ q: q, s: s, met: s.state === 'yes', unconf: s.state === 'unconf', known: s.state !== 'unknown' });
    });
    var scored = [], thin = [], out = [];
    AK.forEach(function (a) {
      var r = area[a]; if (!r.asked) return;
      r.pts = Math.round(r.pts * 100) / 100;
      if (r.max) { r.pct = r.pts / r.max; scored.push(r); }
      else if (r.todo) thin.push(r);   /* no known answer, and at least one question blank or "Don't know yet" */
      else out.push(r);                /* every answer "Doesn't apply" (or a way out): left out of the verdict */
    });
    var unmet = gates.filter(function (g) { return g.known && !g.met && !g.unconf; });
    var unconf = gates.filter(function (g) { return g.unconf; });
    var unknownGates = gates.filter(function (g) { return !g.known; });
    /* An area holds the verdict back only when it is below 40% and at least two of its questions have a known answer. */
    var low = scored.filter(function (r) { return r.pct < LOW && r.known >= 2; });
    var level = unmet.length || low.length ? 'stop' : unknownGates.length || unconf.length || thin.length ? 'open' : 'pilot';
    var mid = scored.filter(function (r) { return r.pct >= LOW && r.pct < HIGH; });
    AK.forEach(function (a) { var r = area[a]; if (!r.asked) return; var w = areaWord(r, low.indexOf(r) >= 0); r.word = w.word; r.tone = w.tone; });
    var met = gates.length - unmet.length - unconf.length - unknownGates.length;
    var names = function (l) { return joinAnd(l.map(function (r) { return r.name; })); };
    steps.push('Tool "' + x.name + '": ' + (x.arch ? M.ARCH[x.arch].s : 'other') + ' tool, ' + x.int.toLowerCase() + ' effort' + (x.add.length ? ', add-ons: ' + x.add.map(function (k) { return M.ADD[k].tag.toLowerCase(); }).join(', ') : '') + '. Stage: ' + (STAGES[stage] ? STAGES[stage].name : 'not given') + '.');
    steps.push(qs.length + ' questions (' + gates.length + ' must-haves). Yes 2 points, Partly 1, No 0; "Don\'t know yet", "Doesn\'t apply" and the stated ways out are left out of the points. A list of what the tool needs scores 2 × (in place) ÷ (in place + not yet).');
    AK.forEach(function (a) { var r = area[a]; if (!r.asked) return; steps.push(r.name + ': ' + (r.max ? r.pts + ' of ' + r.max + ' points = ' + Math.round(r.pct * 100) + '% (' + r.word.toLowerCase() + ')' : r.todo ? 'no known answers' : 'every answer "Doesn\'t apply": left out') + ', ' + r.answered + ' of ' + r.asked + ' answered.'); });
    steps.push('Must-haves: ' + met + ' in place, ' + unconf.length + ' Yes without a note, ' + unmet.length + ' not in place, ' + unknownGates.length + ' not known yet.');
    steps.push(level === 'stop' ? 'Not ready yet because ' + [unmet.length ? n_(unmet.length, 'must-have is', 'must-haves are') + ' not in place' : '', low.length ? names(low) + (low.length > 1 ? ' are' : ' is') + ' below 40% with at least two known answers' : ''].filter(Boolean).join(' and ') + '.'
      : level === 'open' ? 'Not enough information yet: ' + [unknownGates.length ? n_(unknownGates.length, 'must-have') + ' not known' : '', unconf.length ? n_(unconf.length, 'must-have') + ' answered Yes without a note' : '', thin.length ? names(thin) + ' with no known answer' : ''].filter(Boolean).join('; ') + '. A known No would settle it; the top verdict needs every must-have known, in place and with its note.'
      : levelName('pilot', stage) + ': every must-have in place with a note (the hotel\'s own answers, not checked), and no area below 40%.' + (mid.length ? ' ' + names(mid) + ' between 40% and 74%: gaps to close.' : ''));
    var ev = { qs: qs, area: area, scored: scored, thin: thin, out: out, gates: gates, unmet: unmet, unconf: unconf, unknownGates: unknownGates, low: low, mid: mid, level: level, steps: steps, stage: stage || '' };
    ev.actions = actions(ev, Who, A, stage);
    var answered = 0; AK.forEach(function (a) { answered += area[a].answered; });
    var oq = {}; ev.actions.forEach(function (a) { oq[a.q.code] = 1; });
    /* One definition everywhere: answered = Yes, Partly, No or Doesn't apply; everything else is "to find out". */
    ev.counts = { asked: qs.length, answered: answered, find: qs.length - answered, known: answered, met: met, note: unconf.length, unmet: unmet.length, unknown: unknownGates.length, gates: gates.length, open: ev.actions.length, openQs: Object.keys(oq).length };
    return ev;
  }

  /* Every open item as an action: who, what, which group. Nothing is cut off; a must-have is listed once.
     Groups: must (must-have not in place), note (must-have Yes still without its note), vendor (to confirm with the vendor),
     find (to find out, by person), close (gaps to close). Each group is sorted by person. */
  var WHO_ORDER = ['gm', 'owner', 'fin', 'it', 'vendor', 'dpo', 'hr', 'dept', 'staff', 'other'];
  function actions(ev, Who, A, stage) {
    var out = [], seen = {};
    var areas = ev.scored.slice().sort(function (a, b) { return a.pct - b.pct; }).concat(ev.thin);
    function push(o) { if (!seen[o.key]) { seen[o.key] = 1; out.push(o); } }
    ev.unmet.forEach(function (g) { push({ key: g.q.code, group: 'must', q: g.q, who: g.q.who, text: g.q.act, ans: g.s.ans, flag: g.s.flag || '', must: true }); });
    ev.unconf.forEach(function (g) { push({ key: g.q.code, group: 'note', q: g.q, who: 'you', text: 'Add a note on ' + (g.q.short || 'this must-have') + '. ' + ((g.s.ans === 'none' ? g.q.noneAsk : g.q.ask) || 'Where is this written down?'), ans: g.s.ans, flag: g.s.flag || '', must: true }); });
    areas.forEach(function (r) {
      r.items.forEach(function (it) {
        var q = it.q, s = it.s, who = Who[q.code] || defaultWho(q, stage);
        if (q.list) {
          var unk = [], miss = [];
          q.items.forEach(function (t, i) { var v = A[q.code + '#' + i] || ''; if (v === 'n') miss.push(t); else if (v !== 'y' && v !== 'na') unk.push(t); });
          if (unk.length) push({ key: q.code + ':find', group: who === 'vendor' ? 'vendor' : 'find', q: q, who: who, text: (unk.length > 1 ? 'Find out whether these are in place: ' : 'Find out whether this is in place: ') + unk.join('; '), area: r.name });
          if (miss.length) push({ key: q.code, group: 'close', q: q, who: q.who, text: 'Put in place: ' + miss.join('; '), ans: s.ans, area: r.name });
          return;
        }
        if (s.state === 'unknown') push({ key: q.code + ':find', group: who === 'vendor' ? 'vendor' : 'find', q: q, who: who, text: q.q, must: q.gate, area: r.name, flag: s.flag || '' });
        else if (s.state === 'gap' && !q.gate) push({ key: q.code, group: 'close', q: q, who: q.who, text: q.act, ans: s.ans, area: r.name });
      });
    });
    var go = { must: 0, note: 1, vendor: 2, find: 3, close: 4 };
    return out.map(function (a, i) { a.i = i; return a; }).sort(function (a, b) { return go[a.group] - go[b.group] || WHO_ORDER.indexOf(a.who) - WHO_ORDER.indexOf(b.who) || a.i - b.i; });
  }
  function whoName(w) { return w === 'you' ? 'You' : WHO[w] || WHO.other; }

  /* "Do these first": up to three items. Must-haves not in place, then Yes without a note, then must-haves not known,
     then gaps in weak areas, then the rest. Each as { who, text }. */
  function first3(ev) {
    var lowNames = ev.low.map(function (r) { return r.name; }), a = ev.actions;
    var pick = [].concat(a.filter(function (o) { return o.group === 'must'; }), a.filter(function (o) { return o.group === 'note'; }),
      a.filter(function (o) { return (o.group === 'find' || o.group === 'vendor') && o.must; }),
      a.filter(function (o) { return o.group === 'close' && lowNames.indexOf(o.area) >= 0; }),
      a.filter(function (o) { return (o.group === 'find' || o.group === 'vendor') && !o.must; }), a.filter(function (o) { return o.group === 'close' && lowNames.indexOf(o.area) < 0; }));
    return pick.slice(0, 3).map(function (o) { return { who: o.who, person: whoName(o.who), group: o.group, text: (o.group === 'find' || o.group === 'vendor') && !o.q.list ? 'Find out: ' + o.text : o.text, code: o.q.code }; });
  }

  function beforeWords(stage) { return stage === 'live' ? 'before you go on using it' : stage === 'sign' ? 'before you sign or start the trial' : 'before you sign'; }
  /* The verdict in one sentence (result page, PDF, owner note). */
  function verdict(ev, stage) {
    var c = ev.counts, live = stage === 'live';
    if (ev.level === 'stop') { var n = c.unmet + ev.low.length; return 'Not ready yet. ' + n_(n, 'thing') + ' to settle ' + (live ? 'before you go on using it' : 'before you sign') + '.'; }
    if (ev.level === 'open') {
      var bits = [c.unknown ? n_(c.unknown, 'must-have') + ' to find out' : '', c.note ? c.note + ' to confirm with a note' : ''].filter(Boolean);
      return 'Not enough information yet. ' + (bits.length ? bits.join(', ') + '.' : 'Answer at least one question in ' + joinAnd(ev.thin.map(function (r) { return r.name; })) + '.');
    }
    var g = ev.actions.length;
    return levelName('pilot', stage) + '. All ' + c.gates + ' must-haves are in place (your own answers, not checked). ' + (g ? n_(g, 'smaller gap') + ' to close ' + (live ? 'while you use it' : 'during the pilot') + '.' : 'No gaps are open.');
  }
  /* One count line: "{met} of {M} must-haves done · {c} need a note · {k} to find out" (zero parts left out). */
  function countLine(ev, was) {
    var c = ev.counts;
    return [c.met + ' of ' + c.gates + ' must-haves done' + (was != null && was !== c.met ? ' (was ' + was + ')' : ''), c.unmet ? c.unmet + ' not in place' : '', c.note ? c.note + (c.note === 1 ? ' needs a note' : ' need a note') : '', c.unknown ? c.unknown + ' to find out' : ''].filter(Boolean).join(' · ');
  }

  /* Plain-words summary built from what is actually open (never a fixed sentence per level). No percentages. */
  function summary(ev, stage) {
    var n = ev.unmet.length, u = ev.unknownGates.length, c = ev.unconf.length, out = [], live = stage === 'live';
    var before = beforeWords(stage), names = function (l) { return joinAnd(l.map(function (r) { return r.name; })); };
    var wayOut = ev.gates.some(function (g) { return g.met && g.s.ans === 'none'; });
    if (ev.level === 'stop') {
      if (n) out.push(n + ' of the ' + ev.gates.length + ' must-haves ' + (n > 1 ? 'are' : 'is') + ' not in place. Each one on its own is reason enough to wait ' + before + '.');
      if (u) out.push(n_(u, 'must-have is', 'must-haves are') + ' not known yet.');
      if (c) out.push(n_(c, 'must-have needs', 'must-haves need') + ' a note to confirm.');
      if (ev.low.length) out.push(names(ev.low) + (ev.low.length > 1 ? ' are' : ' is') + ' weak on what you told us, which also holds the verdict back.');
    } else if (ev.level === 'open') {
      out.push('On what you told us, nothing rules this tool out yet.');
      if (u) out.push(n_(u, 'must-have is', 'must-haves are') + ' not known yet.');
      if (c) out.push(n_(c, 'must-have needs', 'must-haves need') + ' a note to confirm.');
      if (ev.thin.length) out.push('Answer at least one question in ' + names(ev.thin) + '.');
      if ((u || c) && !ev.thin.length) out.push('Once ' + (u + c > 1 ? 'these are' : 'this is') + ' settled with a Yes and a note, the verdict becomes “' + levelName('pilot', stage) + '”.');
    } else {
      out.push('You answered Yes to every must-have' + (wayOut ? ' that applies to you' : '') + ' and added a note. Nobody has checked the notes.');
      out.push(live ? (ev.mid.length ? 'Close the gaps in ' + names(ev.mid) + ' while you use the tool.' : 'Keep the number you measured as the yardstick.')
        : ev.mid.length ? 'Run a time-limited pilot and close the gaps in ' + names(ev.mid) + ' while it runs.' : 'Run a time-limited pilot with the number you measured as the yardstick.');
    }
    var strong = ev.scored.filter(function (r) { return r.word === 'Strong' && r.known >= 2; });
    if (strong.length && strong.length === ev.scored.length && strong.length > 2) out.push('Every area you could answer is strong.');
    else if (strong.length) out.push('Strongest: ' + names(strong) + '.');
    return out.filter(Boolean);
  }

  /* Difference between two snapshots (same rules version only). */
  function compare(prev, cur) {
    if (!prev || prev.rules !== cur.rules) return null;
    var closed = cur.metCodes.filter(function (c) { return prev.metCodes.indexOf(c) < 0; });
    var reopened = prev.metCodes.filter(function (c) { return cur.metCodes.indexOf(c) < 0; });
    return { since: prev.at, closed: closed, reopened: reopened, knownGain: cur.known - prev.known, from: prev.level, to: cur.level, openBefore: prev.open, openNow: cur.open, metBefore: prev.met };
  }
  function snapshot(ev, at) {
    return { at: at, rules: RULES, level: ev.level, met: ev.counts.met, gates: ev.counts.gates, known: ev.counts.answered, asked: ev.counts.asked, open: ev.actions.length, note: ev.counts.note,
             metCodes: ev.gates.filter(function (g) { return g.met; }).map(function (g) { return g.q.code; }),
             areas: ev.scored.reduce(function (o, r) { o[r.a] = Math.round(r.pct * 100); return o; }, {}) };
  }

  /* Legal flag from the AI Register label file (provisional until D7 sign-off). Nothing unverified reaches a hotel:
     no article or annex numbers, no text marked as still to be verified, no Swiss or UK labour notes, no single authority's view (rules v4, F08, F34, F35). */
  var CC = { Germany: 'DE', France: 'FR', Spain: 'ES', Sweden: 'SE', Switzerland: 'CH', 'United Kingdom': 'GB' };
  var PAREN_REF = /\s*\((?:[^()]|\([^()]*\))*(?:Art\.|Arts\.|Annex|Ordinance|BGE)(?:[^()]|\([^()]*\))*\)/g;
  function cleanLegal(t) {
    t = String(t || ''); if (/to\s+verify/i.test(t)) return '';
    t = t.replace(PAREN_REF, '');
    /* Drop any sentence that still carries a reference or one authority's unverified view. */
    t = t.split(/(?<=[.!?])\s+/).filter(function (s) { return !/Art\.\s?\d|Arts\.|Annex|AEPD|Spanish data protection authority/i.test(s); }).join(' ');
    return t.replace(/\s+([;.,])/g, '$1').replace(/\s+/g, ' ').trim();
  }
  var OUTSIDE = 'The EU AI Act reaches hotels outside the EU only in some cases. Ask your legal adviser whether it applies to you.';
  function legal(M, x, hotel) {
    var G = M.REG, l = x.label; if (!G || !l) return null;
    var lab = G.labels[l.base] || { name: 'Not labelled', short: '' };
    var packs = (l.packs || []).slice(); if (l.chat) packs.push('chat'); if (l.base === 'high') packs.push('hr-user');
    var items = G.items.filter(function (i) { return packs.indexOf(i.pack) >= 0 && i.role !== 'maker' && !/^C1m/.test(i.id); })
      .map(function (i) { return { text: cleanLegal(i.text), who: i.who, from: i.since && G.dates[i.since] ? G.dates[i.since] : '' }; }).filter(function (i) { return i.text; });
    var could = (l.switches || []).map(function (s) { var sw = G.switches[s.id]; return sw ? { q: sw.q, to: (G.labels[sw.yes] || {}).name || '' } : null; }).filter(Boolean);
    var c = (hotel || {}).country || '', cc = CC[c] || '';
    var country = cc === 'CH' ? 'Switzerland is not in the EU. ' + OUTSIDE + ' The Swiss Data Protection Act and labour law apply to AI directly. This check does not yet cover Swiss rules in detail.'
      : cc === 'GB' ? 'The United Kingdom is not in the EU. ' + OUTSIDE + ' UK data protection and employment law apply to AI directly. This check does not yet cover UK rules in detail.'
      : c === 'Other' ? OUTSIDE
      : c ? 'The EU AI Act applies in ' + c + '. National rules, for example on staff consultation, differ by country and are not checked here.' : 'The EU AI Act applies in EU countries. Swiss and UK rules are not checked here.';
    var labour = x.staff && cc !== 'CH' && cc !== 'GB' && G.labourNotes[cc] ? cleanLegal(G.labourNotes[cc]) : '';
    return { name: lab.name, short: cleanLegal(lab.short), why: cleanLegal(l.why || ''), base: l.base, items: items, could: could, country: country, labour: labour,
             applies: l.base === 'high' && G.dates.highrisk ? G.dates.highrisk : '', itemsHead: items.length && outsideEU(hotel) ? 'If the EU AI Act applies to you' : '' };
  }

  /* Vendor questions for this tool: the register's list, filtered, plus the hotel's own open vendor items. */
  var PROVIDER_Q = 'Who counts as the provider of this tool under the EU AI Act, you or a third party, and does the contract say so?';
  function vendorQs(M, x, ev) {
    var G = M.REG, l = x.label || {}, out = [];
    out.push('Can you show the tool working on our own systems and data, not a standard demo?');
    if (G) G.vendorQuestions.forEach(function (v) {
      if (v.for === 'all' || (v.for === 'chat' && l.chat) || (v.for === 'high' && l.base === 'high') || (v.for === 'pricing' && x.dept === 'rm')) out.push(/^Who is the maker of this tool/.test(v.q) ? PROVIDER_Q : v.q);
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

  /* Tool search (start page): every word must match somewhere; a match in the tool's name or search words ranks
     above a match in its description. Plain words hotels use are mapped to the catalogue's words. */
  var SYN = [['chatbot', 'chat', 'bot', 'messaging', 'whatsapp'], ['telephone', 'phone', 'voice', 'call', 'calls', 'voicebot'], ['rota', 'roster', 'schedule', 'scheduling', 'shift', 'shifts'],
    ['checkin', 'check-in', 'arrival'], ['pricing', 'price', 'prices', 'rate', 'rates'], ['cv', 'recruiting', 'hiring', 'recruitment', 'applicant'], ['review', 'reviews'], ['camera', 'cctv', 'video'],
    ['invoice', 'invoices'], ['housekeeping', 'cleaning'], ['email', 'emails'], ['kitchen', 'food'], ['upsell', 'upselling'], ['forecast', 'forecasting'], ['staff', 'employee', 'labour']];
  var STOP = { a: 1, an: 1, the: 1, 'for': 1, of: 1, and: 1, to: 1, my: 1, our: 1, 'in': 1, with: 1, ai: 1, tool: 1 };
  function norm(s) { return String(s || '').toLowerCase().replace(/check[\s-]?in/g, 'checkin').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function search(M, q, dept) {
    var toks = norm(q).split(' ').filter(function (t) { return t && !STOP[t]; });
    var list = M.USES.filter(function (u) { return !dept || u.dept === dept; });
    if (!toks.length) return list;
    var res = [];
    list.forEach(function (u, i) {
      var name = ' ' + norm(u.name) + ' ', kw = ' ' + norm(u.kw) + ' ', rest = ' ' + norm(u.task + ' ' + u.deptName) + ' ', total = 0;
      var all = toks.every(function (t) {
        var alts = [t]; SYN.forEach(function (g) { if (g.indexOf(t) >= 0) alts = alts.concat(g.map(norm)); });
        if (t.length > 4 && /s$/.test(t)) alts.push(t.slice(0, -1));
        var best = 0;
        alts.forEach(function (w, j) {
          var own = j === 0 ? 1 : 0, sc = 0;
          if (kw.indexOf(' ' + w + ' ') >= 0) sc = 60 + own * 10;
          else if (name.indexOf(' ' + w + ' ') >= 0) sc = 50 + own * 10;
          else if (name.indexOf(' ' + w) >= 0 || kw.indexOf(' ' + w) >= 0) sc = 40 + own * 5;
          else if (rest.indexOf(' ' + w + ' ') >= 0) sc = 20 + own * 2;
          else if (rest.indexOf(' ' + w) >= 0) sc = 10 + own;
          if (sc > best) best = sc;
        });
        total += best; return best > 0;
      });
      if (all) res.push({ u: u, s: total, i: i });
    });
    res.sort(function (a, b) { return b.s - a.s || a.i - b.i; });
    return res.map(function (r) { return r.u; });
  }
  /* A short name for headers and file names: the tool's name up to its first bracket, comma or colon. */
  function shortName(x) { var s = String(x.name).replace(/\s*[(:,].*$/, '').trim(); return s.length > 44 ? s.slice(0, 42).replace(/\s+\S*$/, '') + '…' : s; }

  /* Changed in rules v4 (20 Nov 2026), in plain words. Shown in "How this was worked out" and in the README. */
  var CHANGES = [
    'An area where every answer is “Doesn\'t apply” is left out of the verdict. Before, it kept the verdict at “Not enough information yet” with nothing left to do.',
    'An area holds the verdict back only when it is below 40% and at least two of its questions have a known answer. Before, a single answer in a one-question area could decide.',
    'The answers “This tool uses no personal data” and “We have no staff representatives” count as in place for the must-have but give no points. Before, they gave full points.',
    '“This tool uses no personal data” is no longer offered for tools that handle sensitive data, talk to guests or callers, or are on the high-risk list. A saved check that used it there is asked again.',
    'A must-have answered Yes without a note stays a Yes, shown as “Yes, note missing”. It no longer counts as not in place, but the top verdict still needs the note.',
    'Any note counts. There is no minimum length any more: a length rule could not tell a real note from “hello goodbye”, so the note is printed on your report as you wrote it and nobody checks it.',
    'Lists of what the tool needs: points are the share of items in place among those in place or not yet. “Don\'t know” items are left out of the points and the list counts as “to find out” until every item has an answer.',
    '“Answered” means Yes, Partly, No or Doesn\'t apply, on every screen. “Don\'t know yet” is counted on its own as “to find out”.',
    'Before a vendor is chosen, a vendor question answered “Don\'t know yet” goes on the vendor\'s list straight away.',
    'Outside the EU (Switzerland, United Kingdom, other), the EU AI Act check has one more answer: “We have checked: the EU AI Act does not apply to us”, with a note saying who checked.',
    'For uses the AI Register labels high-risk, “Can staff overrule the tool?” and “Which outputs must a person check?” are must-haves. This is the team\'s judgement.',
    'The written two-way link to your systems is a must-have for every tool that needs a link. Only tools that need no link are exempt. Before, all “Light” tools were exempt.',
    'The two guest questions (reaching a person, guest feedback) are asked for tools that deal with guests directly, not for every front-office or guest-experience tool.',
    'The data protection impact assessment question has one more answer: “Checked: not required (confirmed in writing)”, with a note.',
    'The top verdict has a new name that says what was found, not what the hotel is. Results worked out with earlier rules stay in your history and are not compared line by line.'
  ];

  var api = { RULES: RULES, AK: AK, STAGES: STAGES, LEVELS: LEVELS, WHO: WHO, KIND: KIND, ANSWER: ANSWER, POINTS: POINTS, LOW: LOW, HIGH: HIGH, W: W, CHANGES: CHANGES, STALE: STALE,
    model: model, selectQuestions: selectQuestions, evaluate: evaluate, score: score, hasAnswer: hasAnswer, proofOk: proofOk, summary: summary, verdict: verdict, countLine: countLine, first3: first3, compare: compare, snapshot: snapshot,
    legal: legal, vendorQs: vendorQs, tickItems: tickItems, levelName: levelName, answerText: answerText, whoName: whoName, defaultWho: defaultWho, search: search, shortName: shortName, joinAnd: joinAnd,
    paidFor: paidFor, beforeWords: beforeWords, outsideEU: outsideEU, cleanLegal: cleanLegal };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RCLogic = api;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
