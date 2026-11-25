/* Do you need AI? v2 (folder tools/readiness-2): every word a hotel reads about the five questions and the must-haves.
   Sources: research_notes/AI starting point/research.md (23 Nov 2026) for the five questions and the sourced figures;
   the owner's workbook "AI Use Cases: Resources Needed per Use Case (D4 x D6)" for which must-haves and for the tailored
   questions (those are generated: data/usecase-questions.json).
   Rules kept (CLAUDE.md): no source the project bans; every figure carries its source and base; only sources the research
   marks [opened] are listed or quoted. Internal codes (P1, F1 ...) stay in this file and never reach the screen. */
(function (root) {
  'use strict';

  /* ---------- Step 2: is this an AI problem? (research A). v2 (owner, 24 Nov 2026): simpler wording, one short sentence each;
     Q2 is the owner's wording of 23 Nov and stays.
     v2.6 (owner, 24 Nov 2026): question 1 is asked the other way round ("Can each case be fixed with an if-then rule?"): Yes now
     means fixed rules can do it, so Yes is the stop answer (stopOn: 'y'); for every other question No is the answer that holds.
     Questions 3 and 4 are new (Brynjolfsson & Mitchell 2017: large digital sets of examples; a task that tolerates errors).
     Records saved before v2.6 are turned round on load (R2Logic.legacyQ; record field qv). ---------- */
  var QUESTIONS = [
    { id: 'q1', short: 'Needs judgement, not fixed rules', title: 'Complex judgement', stopOn: 'y',
      yesIf: 'You could write it down as fixed rules, like “send an email 3 days before arrival” or “reorder towels when stock falls below 200”.',
      noIf: 'Every case is different, like guest emails, photos or tomorrow’s demand.',
      q: 'Can each case be fixed with an “if this, then that” rule?',
      hint: 'Yes if you could write it down as fixed rules, like “send an email 3 days before arrival” or “reorder towels when stock falls below 200”. No if every case is different, like guest emails, photos or tomorrow’s demand.',
      guard: 'Think about the job itself, not how you do it today. If you use rules now only because nothing better existed (for example price rules), answer Not sure.', // v1.2, council BUILD NOW 1
      whyShort: 'AI only helps when a job needs judgement. If fixed rules can do the job, ordinary software is cheaper and more reliable.', // v1.3 (owner): the first line of the "Why this matters" fold (`short` is already the to-find-out label)
      why: 'Software that only follows rules written by people is not AI, and a simpler tool is cheaper, easier to explain and easier to fix.',
      yes: 'Sending a pre-arrival email three days before arrival, or alerting when a room is not cleaned by 14:00.',
      no: 'Reading guest emails in five languages and drafting replies.',
      outcome: 'Not suitable for AI: rules or ordinary automation will do it.', // v1.2 (owner B2): was "Not an AI problem: …"
      who: 'the vendor or IT' },
    { id: 'q2', short: 'Worth real money or hours', title: 'Return', yesIf: 'It happens often or costs a lot, for example many cases a week, or many staff hours or much revenue involved.', noIf: 'It is rare or small, so doing it better would save little.',
      q: 'Is this task frequent or costly enough to be worth improving?',
      hint: '',
      whyShort: 'AI costs money to set up, run and check, so a rare or small job will not pay that back.', // v1.3 (owner): the first line of the "Why this matters" fold (`short` is already the to-find-out label)
      why: 'AI tools have set-up, subscription, checking and training costs. A rare or small task seldom repays them.',
      yes: 'About 400 guest emails a week at front office.',
      no: 'A 12-room guesthouse with 10 email enquiries a week.',
      outcome: 'Probably not worth it.', add: 'Look again if the volume grows, or if a tool you already pay for adds it.',
      who: 'the GM or finance' },
    /* v2.6 (owner): new question 3. Brynjolfsson & Mitchell 2017, criterion 2 ("large (digital) data sets ... containing input-output pairs"). */
    { id: 'q3', short: 'Past examples to learn from', title: 'Information to learn from', yesIf: 'You have hundreds of past cases stored digitally.', noIf: 'It happens rarely, or nothing was ever recorded.',
      q: 'Are there past examples of this task, such as emails, bookings, or past photos, that show what a good result looks like?',
      hint: '',
      whyShort: 'AI learns from examples; without many past cases it has nothing to learn from.',
      why: 'Machine learning works best where many past cases are stored digitally, each with the result that was right for it. A tool bought from a vendor may have learned from other hotels’ cases: ask the vendor what it learned from.',
      yes: 'Two years of guest emails and the replies staff sent, kept in the mailbox.',
      no: 'A special request that comes up a few times a year and was never written down.',
      outcome: 'Too few examples to learn from.', add: 'Start keeping these cases digitally, or ask the vendor what examples its tool learned from. Then ask again.',
      who: 'IT or the department head' },
    /* v2.6 (owner): new question 4. Brynjolfsson & Mitchell 2017, criterion 6 ("a tolerance for error"). Checking results is must-have 6. */
    { id: 'q4', short: 'Mistakes can be caught', title: 'Safety net', yesIf: 'A wrong answer now and then can be caught or does little harm.', noIf: 'Every single result must be exactly right, for example a safety decision.', // v2.7.0: two words removed (owner: nothing on rules from authorities in this tool)
      q: 'If the tool makes an occasional mistake, can it be caught or fixed before it causes harm?',
      hint: '',
      whyShort: 'AI is never right every time; if no mistake is acceptable, a rule-based tool or a person is the better choice.',
      why: 'AI works on probabilities, so it is never right every time. It suits a task where an occasional wrong result can be caught or does little harm.',
      yes: 'Draft replies to reviews that a manager approves before they go out.',
      no: 'Answering guests’ allergen questions on its own.',
      outcome: 'A rule-based tool or a person is the better choice.', // v2.7.0: the line pointing to another hub tab is removed
      who: 'the department head' },
    { id: 'q5', short: 'Success has a number', title: 'Proof', yesIf: 'You can name one number and know today’s figure, such as reply time, hours spent or revenue per room.', noIf: 'You only have a general aim, like “be more innovative”.',
      q: 'Have you chosen what result should improve, and do you know where it stands today?',
      hint: 'Examples: reply time, hours spent, revenue per room, kilos of food thrown away.',
      whyShort: 'Without today’s figure you cannot tell later whether the tool worked, so keeping it becomes guesswork.', // v1.3 (owner): the first line of the "Why this matters" fold (`short` is already the to-find-out label)
      why: 'Without a starting figure nobody can tell whether the tool worked, and the decision to keep or stop it turns into opinion.',
      yes: '“Average reply time to email enquiries: 9 hours today; target under 1 hour.”',
      no: '“We want to be more innovative.”',
      outcome: 'Define success first.', add: 'Write down the number and today’s figure, then come back.',
      who: 'the GM' }
  ];
  /* v2.6: above the questions when a saved check lost its answers to the old questions 3 and 4 (rec.Qnew). */
  var Q_CHANGED = 'Step 2 changed on 24 Nov 2026: question 1 is now asked the other way round (your answer was turned round with it, so it means the same), and questions 3 and 4 are new. Please answer questions 3 and 4.';
  var Q_NEW_LINE = 'New question: please choose an answer.';
  var Q_ANSWERS = [['y', 'Yes'], ['n', 'No'], ['u', 'Not sure']];

  /* The stop screen (owner's hard rule: the stop answer to Q1 ends the journey; since v2.6 that answer is Yes). Reads: headline, why, instead, then the "Not sure" line.
     v1.2 (owner B2): the headline was "This is not an AI problem."; unsure: council BUILD NOW 2. */
  var STOP = {
    head: 'This is not suitable for AI.',
    why: 'The job follows rules a person can write down, so rules or ordinary automation will do it, and a simpler tool is cheaper, easier to explain and easier to fix.',
    instead: 'Instead: set up a rule, a report or an automatic message in the software you already have, or change the process. Ask your current software vendor whether a rule or report can do it.',
    unsure: 'If a vendor offers you an AI tool for this job, ask what the AI does that a rule could not. If you are unsure, change your answer to Not sure: it becomes something to find out.'
  };

  /* Verdict headlines (research A, "Verdict logic"). */
  var VERDICT = {
    stop: STOP.head,
    worth: 'Probably not worth it.',
    data: 'Too few examples to learn from.', // v2.6: the new question 3's outcome
    exact: 'A rule-based tool or a person is the better choice.', // v2.6: the new question 4's outcome (replaces "assist")
    success: 'Define success first.',
    find: 'Find out first.',
    go: 'Worth exploring with AI. Next: the must-haves.',
    goDone: 'Worth exploring with AI.' // the same verdict on the summary, where "where it sits" is already answered
  };

  /* ---------- Must-haves and tailored questions: the readiness check's answer scale ---------- */
  /* v2.3 (owner, 24 Nov 2026): four answers only, in this order. "Partly" and "Doesn't apply" are no longer offered. */
  var ANSWERS = [['y', 'Yes'], ['pl', 'Planned, not done yet'], ['n', 'No'], ['k', 'Don’t know yet']];
  /* Answers that records saved before v2.3 may still hold. Never offered; shown as unanswered with OLD_LINE until the person picks again. */
  var OLD_ANSWER = { p: 'Partly', na: 'Doesn’t apply' };
  var OLD_LINE = 'Your earlier answer was {a}; this answer is no longer offered, please choose again.';
  var ANSWER_WORD = { y: 'Yes', pl: 'Planned, not done yet', n: 'No', k: 'Don’t know yet' }; // v2.5: an old p / na is named by R2Logic.answerWord (audit v3 L2)

  /* ---------- Step 3: the must-haves (at most 10; they apply to every AI installation) ----------
     Chosen from the workbook's Framework matrix and the six D6 gates its README names (P1, F1, F2, T1, D5, O1), worded so a
     hotel can answer before a vendor is chosen. Order: the gates first, then by the share of use cases needing the block.
     blocks: the matrix building blocks behind the item (their counts are read from the workbook at build time, never typed here).
     gate: the D6 gate code(s), for the team and the tests only. who: the readiness check's roles (R2Content.WHO). */
  var MUSTS = [
    { id: 'm1', gate: 'P1', name: 'A named owner with time', who: 'gm',
      q: 'Is there a named person in charge of this AI project, with agreed hours each week for it?',
      why: 'Without one person who owns it, nobody watches the results, deals with the vendor or decides on changes.',
      good: 'A named role with weekly hours written into a job description or the project plan.',
      blocks: ['Named owner with time set aside'],
      ev: [['“Roles and responsibilities and lines of communication related to mapping, measuring, and managing AI risks are documented and are clear to individuals and teams throughout the organization.”', 'NIST AI Risk Management Framework 1.0, GOVERN 2.1 (Jan 2023).']],
      act: 'Name the person in charge of this AI project and agree the hours they will spend on it.' },
    { id: 'm2', gate: 'F1', name: 'Budget for the full first year', who: 'fin',
      q: 'Is there a written budget for the first 12 months that covers the full cost, not only the subscription?',
      why: 'AI keeps costing money after launch: the subscription, fees based on use, connecting it to your systems, training, and staff time to check results.',
      good: 'A budget line covering subscription, set-up and connection to your systems, training and running costs.',
      blocks: ['Recurring subscription or usage budget'],
      ev: [['41% of EU accommodation businesses that had considered AI but did not use it said the costs seem too high.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['35% of hotels named high set-up costs as a barrier.', 'HES-SO Valais-Wallis survey, news of 9 Jul 2025. Base: over 1,500 hotels in Austria, France, Germany, Greece, Italy and Switzerland, Jan–Apr 2025.']],
      act: 'Write a 12-month budget line for the full cost (subscription, set-up, connection, training, running costs).' },
    { id: 'm3', gate: 'F2, O1', name: 'A number to improve, approved', who: 'owner',
      q: 'Has the person who approves spending agreed the number (KPI) this tool must improve, with today’s figure and the target?',
      gloss: 'KPI: the one number that shows success, for example reply time or revenue per room. In a managed or franchised hotel the owner approves it.',
      why: 'Without today’s figure and a target, nobody can tell later whether the tool worked, and keeping it becomes a matter of opinion.',
      good: 'The number (KPI), today’s figure and the target, approved in writing and dated.',
      blocks: ['KPI baseline and scale/stop rule', 'Approved goal and clear approval path'],
      ev: [['“Lack of senior management buy-in in many companies also appears problematic.”', 'OECD, The Adoption of Artificial Intelligence in Firms, May 2025. Base: survey of 840 enterprises in G7 countries, 2022–23, plus interviews.'],
           ['Only 14% of hotel company leaders credited executive mandates for their AI success, against 34% for experimentation: light written backing, not a top-down order.', 'State of Hotel AI, Fall 2026, commissioned by Destination AI (research by Josiah Mackenzie, Actabl). Base: 107 hotel company leaders, worldwide, Aug–Sep 2026; global survey, vendor-linked; not comparable with the European figures.']],
      act: 'Agree the KPI this tool must improve, today’s figure and the target, and get them approved by the person who decides on spending.' },
    { id: 'm4', gate: 'T1', name: 'Systems that can connect', who: 'it', ex: true,
      q: 'Can new AI tools easily be plugged in to your existing infrastructure?',
      gloss: 'PMS: the property management system, the booking system that holds reservations, rooms and guest records.',
      why: 'An AI tool that cannot read from and write back to your hotel systems leaves staff copying data by hand.',
      good: 'For each system you want to connect, its provider has confirmed that other software can connect to the version you use.',
      blocks: ['Two-way link to core systems (PMS, CRS, POS, accounting)'],
      ev: [['46% of EU accommodation businesses that had considered AI but did not use it named incompatibility with their existing equipment, software or systems as a reason.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['29% of hotel company leaders named systems integration as a barrier to getting value from AI.', 'State of Hotel AI, Fall 2026, commissioned by Destination AI (research by Josiah Mackenzie, Actabl). Base: 107 hotel company leaders, worldwide, Aug–Sep 2026; global survey, vendor-linked; not comparable with the European figures.']],
      act: 'Ask the provider of each system you want to connect (for example {ex}) whether other software can read from it and write back to it.' },
    /* v2.7.0 (owner): title and question from the data file's fixed_texts (must_have_5), id and scoring kept. why, good and act
       rewritten; the gloss, the second evidence line and the building block are removed (they were about rules from authorities). */
    { id: 'm5', gate: 'D5', name: 'Personal data known', who: 'dept',
      q: 'Do you know which guest or staff personal data the tool would use?',
      why: 'Guest and staff data needs extra care. Knowing which data the tool would use tells you what to protect and what to ask the vendor.',
      good: 'You can list the guest or staff data the tool would use and where it comes from.',
      blocks: [],
      ev: [['52% of EU accommodation businesses that had considered AI but did not use it named concerns about data protection and privacy.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.']],
      act: 'List which guest or staff personal data the tool would use, and where it comes from.' },
    { id: 'm6', name: 'A person who checks the AI', who: 'dept',
      q: 'Is there a named person who will check the AI’s results and can overrule them?',
      why: 'AI is never right every time. Someone must be able to catch a wrong result and put it right before it is used.',
      good: 'A named role that checks the results, knows which results must be checked before they are used, and can stop or correct the tool.',
      blocks: ['Human reviewer who checks or overrides AI output'],
      ev: [], // v2.7.0: its only evidence line is removed (it was about rules from authorities)
      act: 'Name the person who checks the AI’s results, and decide which results they must check before they count.' },
    { id: 'm7', name: 'Data you can reach and keep correct', who: 'dept',
      q: 'Is each piece of data this tool needs held in a system, with a named person who keeps it correct?',
      why: 'AI works from your data. If the facts are on paper, out of date or spread over systems that disagree, the tool gives wrong answers that sound sure.',
      good: 'You can name where each piece of data sits, and a named person checks it at set times.',
      blocks: ['Historical operational data', 'Curated knowledge and hotel content (FAQ, SOPs, menus, policies)'],
      ev: [['43% of EU accommodation businesses that had considered AI but did not use it named difficulties with the availability or quality of the data.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['42% of hotel company leaders were confident their data is ready for their AI goals; 48% were not.', 'State of Hotel AI, Fall 2026, commissioned by Destination AI (research by Josiah Mackenzie, Actabl). Base: 107 hotel company leaders, worldwide, Aug–Sep 2026; global survey, vendor-linked; not comparable with the European figures.']],
      act: 'List the data the tool needs and the system each piece sits in, and name who keeps it right.' },
    { id: 'm8', name: 'Staff told, and able to report errors', who: 'dept',
      q: 'Have the staff involved been told about the plan, and do they know who to tell when the tool gets something wrong?',
      why: 'Staff who were not told work around a tool, and errors nobody reports are never fixed.',
      good: 'The staff involved have heard the plan from their manager, and one named person collects what goes wrong.',
      blocks: ['Frontline adoption and change support'],
      ev: [['70% of EU accommodation businesses that had considered AI but did not use it named a lack of relevant expertise, the most common reason.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['35% of hotel company leaders named change management as a barrier to getting value from AI, the most often cited.', 'State of Hotel AI, Fall 2026, commissioned by Destination AI (research by Josiah Mackenzie, Actabl). Base: 107 hotel company leaders, worldwide, Aug–Sep 2026; global survey, vendor-linked; not comparable with the European figures.']],
      act: 'Tell the staff concerned about the plan, and name the person they tell when the tool gets something wrong.' },
    { id: 'm9', name: 'Rules for staff on AI tools', who: 'gm',
      q: 'Do you have written rules telling staff what they must not type into AI tools?',
      gloss: 'For example guest data, staff data or contracts.',
      why: 'Without a rule, guest or company data ends up in tools nobody has checked.',
      good: 'One page every member of staff has seen, saying what must never go into an AI tool.',
      blocks: ['AI-use policy and use-case risk review'],
      ev: [['Only 9% of the hotels surveyed had a formal AI strategy document.', 'Britz & Schegg, From Awareness to Action: AI Readiness in Hotels, HES-SO Valais-Wallis, Oct 2025. Base: hoteliers surveyed Jul–Sep 2025, median 37.5 rooms; the authors warn the sample is likely more digitally aware than average.']],
      act: 'Write one page of rules on what staff must not put into AI tools.' },
    { id: 'm10', name: 'A way to work when the tool is down', who: 'dept',
      q: 'If the tool stops working for a day, is there a written way to do the job without it?',
      why: 'Tools fail and vendors change. The work still has to be done that day.',
      good: 'A short written backup plan for each task the tool does, which the shift leaders know.',
      blocks: ['Fallback if the tool or vendor fails'],
      ev: [], // v2.7.0: the NIST quote is removed (its wording names a risk class from rules by authorities)
      act: 'Write down how the job gets done if the tool stops working, and walk the shift leaders through it.' }
  ];

  /* Who usually does it: the readiness check's roles and words (tools/readiness-check/src/logic.js, WHO), in its order. */
  var WHO = { gm: 'General manager', owner: 'Owner or head office', fin: 'Finance', it: 'IT', vendor: 'The vendor',
    dpo: 'Data protection contact', hr: 'HR', dept: 'Head of the department using it', staff: 'Staff who will use it', other: 'Someone else' };
  var WHO_ORDER = ['gm', 'owner', 'fin', 'it', 'vendor', 'dpo', 'hr', 'dept', 'staff', 'other'];

  /* ---------- Step 1: about your hotel (the readiness check's own lists) ---------- */
  var TYPES = [['independent', 'Independent hotel'], ['group', 'Part of a group, run by the group'], ['managed', 'Managed or franchised']];
  var ROLES = [['gm', 'General manager'], ['owner', 'Owner or asset manager'], ['dept', 'Head of a department'], ['it', 'IT or CIO'], ['fin', 'Finance'], ['other', 'Other']];
  var COUNTRIES = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Other'];
  var COUNTRY_LABEL = { Other: 'Other (outside the EU)' };
  /* Shared hotel profile (hftp-hotel-profile-v1) keeps the country as a code. */
  var CC = { AT: 'Austria', BE: 'Belgium', HR: 'Croatia', CY: 'Cyprus', CZ: 'Czechia', DK: 'Denmark', FI: 'Finland', FR: 'France', DE: 'Germany', GR: 'Greece', HU: 'Hungary', IE: 'Ireland', IT: 'Italy', LU: 'Luxembourg', MT: 'Malta', NL: 'Netherlands', PL: 'Poland', PT: 'Portugal', ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', GB: 'United Kingdom', BG: 'Bulgaria', EE: 'Estonia', LV: 'Latvia', LT: 'Lithuania', RO: 'Romania', SK: 'Slovakia', SI: 'Slovenia' };

  /* ---------- typical systems by department (v1.3, owner): the examples under the systems must-have ---------- */
  var SYSTEMS = {
    rm: 'your PMS (booking system), revenue management system and channel manager',
    res: 'your PMS (booking system), channel manager, booking engine and phone system',
    sm: 'your CRM (guest database), email marketing tool, website and booking engine',
    fo: 'your PMS (booking system), door locks and guest messaging',
    gx: 'your PMS (booking system), guest messaging, CRM (guest database) and review sites',
    fb: 'your POS (tills), table reservations, sales and catering system and PMS (booking system)',
    hk: 'your PMS (booking system and room status), housekeeping app and staff messaging',
    me: 'your building management system (heating, cooling, energy) and maintenance work orders',
    kc: 'your POS (tills), inventory and recipe costing',
    pr: 'your purchasing system, inventory, accounting system and supplier catalogues',
    fa: 'your accounting system, PMS (booking system) and bank feeds',
    hr: 'your payroll, HR records and staff scheduling',
    gm: 'your PMS (booking system), accounting system, reporting dashboards and shared documents',
    it: 'your network and firewall, email system, staff accounts and security cameras',
    lg: 'your energy and utility meters, accounting system, HR records and contract files'
  };
  var SYSTEMS_FALLBACK = 'your PMS (booking system), POS (tills), accounting or HR systems';

  /* ---------- the result: verdict names and the lines under them ---------- */
  var LEVELS = {
    ready: { name: 'Ready to start a pilot', line: 'Every must-have is in place and most of what this use case needs is there. Start small, with the KPI and its target in front of you.' },
    almost: { name: 'Almost ready', line: 'Nothing you answered blocks a start, but points are still open. Close the ones below before you sign anything.' }, // v2.1, council item 4
    notready: { name: 'Not ready yet', line: 'The list below shows what to do first.' },
    noinfo: { name: 'Not enough information yet', line: 'Find out first, then come back: the list below says whom to ask.' }
  };
  /* v2.1: the line under "Almost ready" when the top verdict was held back (a sensitive use case, a No or a Not sure in step 2).
     v2.5: "None of these fits" can no longer reach the top verdict (owner O4), so the v2.1 READY_NONE line is gone. */
  var ALMOST_HELD = 'Your answers would otherwise allow a start. Settle what is named above before you sign anything.';
  /* v2.7.0 (owner, 25 Nov 2026): these three texts are the data file's fixed_texts, verbatim (data/usecase_questions_only.json;
     the banned-term test checks they match). */
  var DISCLAIMER = 'This check does not cover legal requirements. Check those with your adviser before you start.';
  var SENSITIVE_FLAG = 'This area involves people\'s personal data or jobs and has extra rules. Ask an adviser before a pilot.';
  var SENSITIVE_HOLD = 'Held back: this area involves people\'s personal data or jobs. Ask an adviser before a pilot.';
  /* ---------- v2.5 (24 Nov 2026): reports/Council - Do you need AI v2.4.md, BUILD NOW items and owner decisions O1 to O5 (copy as given there) ---------- */
  /* BUILD NOW 1: under "Not ready yet" when no must-have is No but fewer than half are Yes (O1: "Almost ready" needs at least half). {n}: Yes, {m}: must-haves. */
  var ALMOST_FEW_MUST = 'No must-have is at No, but only {n} of {m} are in place. “Planned” is not done yet: finish these before you talk to vendors.';
  /* BUILD NOW 2: under "Almost ready" when every must-have is Yes but fewer than half the tailored questions are (O1). */
  var READY_FEW_TAIL = 'Every must-have is in place. For this use case, {y} of {n} questions are Yes and {p} are planned: finish the planned ones before the pilot starts.';
  /* O4: "None of these fits" reaches "Almost ready" at best. */
  var NONE_ALMOST = 'No use case chosen: the must-haves are in place, but nothing was checked for a particular tool.';
  /* BUILD NOW 3: a held verdict lists its hold as item 1 of "Start with". */
  var HOLD = {
    carried: 'Settle this first: in step 2 you answered No to “{title}”. {outcome}',
    sensitive: SENSITIVE_HOLD, // v2.7.0: the data file's sensitive_hold_reason, verbatim
    notsure: 'Settle this first: you answered Not sure to {titles} in step 2. {find}',
    none: 'Settle this first: no use case chosen. The must-haves are in place, but nothing was checked for a particular tool.'
  };
  /* O5: one short line in the verdict box, only for "Not ready yet" and a held verdict. */
  var BOX = { held: 'Held back: {why}.', sensitive: 'this area involves people\'s personal data or jobs', carried: 'a No in step 2', notsure: 'Not sure in step 2', tail: 'fewer than half the questions for this use case are Yes', none: 'no use case chosen' };
  /* BUILD NOW 11: under the top verdict. No source gives a pilot length for hotels, so the weeks are marked as the team's suggestion. */
  var PILOT_GLOSS = 'A pilot: a trial with one team or one outlet, for a set time (for example 8 to 12 weeks, the team’s suggestion), measured against the number from must-have 3.';
  /* BUILD NOW 7: under must-haves 3 and 7 when step 2 says otherwise (no blocking). */
  var CONSIST = {
    m3: 'In step 2 you said you do not yet know the number to improve. If that has changed, go back and change it there too.'
    /* v2.6: the must-have 7 line is gone: the new question 3 asks about past examples, not whether the data is digital and current */
  };
  /* Audit v3 H1: the replace question, when the check in this browser has a shared copy. */
  var FILE_KEEPS_SHARE = 'The project team’s copy of this check stays shared; you can still withdraw it.';
  var AREAS_HEAD = 'What is in place, by area'; // v2.1, council item 6: counts, not percentages
  var AREA_WORD = { strong: 'Strong', gaps: 'Gaps to close', weak: 'Weak', thin: 'Too little to say' };
  var SCORE_NOTE = 'Your own answers; nobody checked them. The cut-offs are the team’s judgement, not tested with hotels.'; // v2.1, council item 1
  /* v2.1, council items 5 and 9 (final copy). {N}: the number of use cases in the team's analysis, read from the workbook at build time. */
  var MUST_INTRO = 'Ten things to have in place before an AI project starts. Think of the project you have in mind. Under each one you can see how many of the {N} use cases in the team’s analysis need it.';
  var MUST_COVER = 'Ten things to have in place before an AI project starts, such as an owner with time and a budget for the full first year.';
  var TAIL_TODAY = 'Answer for today. If something can only exist once the tool is running (for example its conversation logs), choose “Planned, not done yet”.';
  var GET_SCORE = ['A verdict and a score:', 'one of four verdicts, and the share of points from your own answers, with how both were worked out.']; // cover bullet, council item 1
  var MUST_ONLY = 'No use case was chosen (“None of these fits”), so this result rests on the must-haves only.';
  var DRAFT = 'Draft questions: team to review';
  /* v2.7.0: vendor questions, four of the register's list left out (who the maker is, the data agreement, the marking and
     registration question, the AI notice question). The readiness check's own list and order: a demo, the register's general questions, cost, data back,
     then one question per open item (systems, a person who checks, personal data, card payments). */
  var VENDOR = {
    first: 'Can you show the tool working on our own systems and data, not a standard demo?',
    all: ['Does it rank, score or monitor individual staff, read emotions, or recognise people by face or voice? Can those features be switched off?',
      'Do you train your models on our data or our guests\' data, and can we opt out?'],
    pricing: 'Do your pricing or revenue recommendations use other hotels\' non-public data, or share ours with them?',
    last: ['What does the full cost for the first 12 months add up to (subscription, set-up, connection, training)?', 'If we stop using the tool, how do we get all our data back, and in what format?'],
    ask: { m4: 'Can you confirm in writing that the tool reads from and writes back to our systems, and show it on our own system?',
      m6: 'How can our staff overrule or switch off the tool, and is every action it takes logged?',
      m5: 'Which guest or staff data does the tool need, and for what purpose?',
      pay: 'Can you share your security certifications and the result of your latest security test?' }
  };

  /* ---------- "Where this comes from" per step: opened sources only, with dates ---------- */
  var SOURCES = {
    q: [
      'UK Government (DSIT), AI Playbook for the UK Government (10 Feb 2025).',
      'GOV.UK, Assessing if artificial intelligence is the right solution (10 Jun 2019).',
      'NIST, AI Risk Management Framework 1.0, NIST AI 100-1 (Jan 2023).',
      'Google PAIR, People + AI Guidebook, “User Needs + Defining Success” (undated page, read 23 Nov 2026).',
      'Brynjolfsson, E. & Mitchell, T. (2017), “What can machine learning do? Workforce implications”, Science 358(6370), 1530–1534 (questions 3 and 4).'
    ],
    qNote: 'The five questions, the order of the outcomes and the examples are the project team’s, built from these sources on 23 Nov 2026 and reworded more simply on 24 Nov 2026. Later that day question 1 was turned round and questions 3 and 4 replaced (owner; Brynjolfsson & Mitchell). Question 1 asks whether the job needs AI.',
    must: [
      'The project team’s resource analysis: “AI Use Cases: Resources Needed per Use Case (D4 × D6)”, Nov 2026. {N} catalogue use cases coded against 20 building blocks; the coding is team judgement, not a survey.',
      'Eurostat, Use of AI in enterprises, ICT usage survey of early 2025, dataset isoc_eb_ain2 (updated 15 Jun 2026; queried 23 Nov 2026).',
      'Eurostat shares are rounded to whole numbers on screen. Exact shares, among EU accommodation businesses with 10+ persons employed that had considered AI but did not use it: lack of relevant expertise 69.89%, data protection and privacy 52.36%, incompatibility with existing equipment, software or systems 45.91%, availability or quality of the data 42.61%, costs seem too high 40.95%.',
      'HES-SO Valais-Wallis, “How AI is (and isn’t) transforming European hospitality”, survey news (9 Jul 2025).',
      'Britz & Schegg, From Awareness to Action: AI Readiness in Hotels, HES-SO Valais-Wallis (Oct 2025).',
      'State of Hotel AI, Fall 2026 (29 Sep 2026), commissioned by Destination AI, research by Josiah Mackenzie (Actabl, a hotel software company): a global survey, vendor-linked, not comparable with the European figures.',
      'OECD, The Adoption of Artificial Intelligence in Firms (May 2025).',
      'NIST, AI Risk Management Framework 1.0 (Jan 2023).'
    ],
    mustNote: 'The ten must-haves are the team’s choice: the six gates of its readiness checklist and the building blocks that most use cases need, in its resource analysis. Where a share is shown (“needed for n of {N} use cases”), it is that analysis, not a survey. The analysis covers {N} of the catalogue’s {U} use cases: {D} were added to the catalogue later, and “AI use policies and governance” is a document, not a tool, so it is left out of the count. The wording follows the team’s earlier readiness check. Typical systems (the examples under the systems question): the team’s own list, based on the catalogue’s use cases.',
    where: [],
    whereNote: 'The departments and use cases come from the project team’s Use-Case Catalogue (read when this page was built). “How common” is the catalogue’s rating (High, Medium, Low, Very low), built from the sources listed there for each use case.',
    tailored: [
      'The project team’s questions for each use case (25 Nov 2026), built on its resource analysis “AI Use Cases: Resources Needed per Use Case (D4 × D6)”, Nov 2026.'
    ],
    tailoredNote: 'Each use case has its own questions, about its systems, data, staff and guests. They are the team’s judgement, not a survey; no source gives costs or staffing per use case for European hotels.',
    result: [],
    resultNote: 'The score and the verdict are worked out from your own answers with the rules shown under “How this was worked out”. The score is the share of points from your answers; it does not measure readiness and is not meant for comparing hotels. The cut-offs are the team’s judgement and have not been tested with hotels.'
  };

  var HONEST = 'Nobody checks your answers. An answer that isn’t true only hides a problem you will meet later.';
  var AS_OF = '25 Nov 2026';
  var USE_CHANGED = 'The catalogue changed: please pick your use case again.';
  var QUESTIONS_CHANGED = 'The questions for this use case changed since you answered. Please answer step 5 again.'; // v2.1 (audit M5)
  var CORRUPT = 'The checks saved in this browser could not be read, so this page started fresh. The unreadable data was set aside, not deleted.'; // v2.1 (audit L12)
  var NO_KEEP = 'This browser is not keeping checks. Save a file to keep one.'; // v2.1 (audit L6)
  var TOO_MANY = 'This browser keeps at most 50 checks. Remove one you no longer need first.'; // v2.1 (audit L4)
  var OLD_FILE = 'This file is from the earlier Readiness check. It cannot be opened here.'; // v2.1 (audit L8)
  var ELSEWHERE = { changed: 'This check was changed in another tab.', removed: 'This check was removed in another tab. It is kept here while you work on it.' }; // v2.1 (audit M3)
  var NOT_SAVED = 'This browser is not keeping your answers. Use Download result (PDF), Download answers (PDF) or Save as file before you close the page.';
  var NEWER = 'This was saved by a newer version of this page. Changes here are not kept.';
  var FROM_V1 = 'This tool has changed. Your use case and your answers to questions 1, 2 and 5 of step 2 were kept (question 1 is now asked the other way round, and your answer with it). The other answers were not: the questions are new.'; // v2.6

  root.R2Content = { QUESTIONS: QUESTIONS, Q_ANSWERS: Q_ANSWERS, STOP: STOP, VERDICT: VERDICT, ANSWERS: ANSWERS, OLD_ANSWER: OLD_ANSWER, OLD_LINE: OLD_LINE, ANSWER_WORD: ANSWER_WORD, MUSTS: MUSTS,
    WHO: WHO, WHO_ORDER: WHO_ORDER, TYPES: TYPES, ROLES: ROLES, COUNTRIES: COUNTRIES, COUNTRY_LABEL: COUNTRY_LABEL, CC: CC,
    LEVELS: LEVELS, AREA_WORD: AREA_WORD, SCORE_NOTE: SCORE_NOTE, MUST_ONLY: MUST_ONLY, DRAFT: DRAFT, VENDOR: VENDOR, DISCLAIMER: DISCLAIMER, SENSITIVE_FLAG: SENSITIVE_FLAG, SENSITIVE_HOLD: SENSITIVE_HOLD,
    ALMOST_HELD: ALMOST_HELD, AREAS_HEAD: AREAS_HEAD, MUST_INTRO: MUST_INTRO, MUST_COVER: MUST_COVER, TAIL_TODAY: TAIL_TODAY, GET_SCORE: GET_SCORE,
    QUESTIONS_CHANGED: QUESTIONS_CHANGED, CORRUPT: CORRUPT, NO_KEEP: NO_KEEP, TOO_MANY: TOO_MANY, OLD_FILE: OLD_FILE, ELSEWHERE: ELSEWHERE,
    SOURCES: SOURCES, HONEST: HONEST, AS_OF: AS_OF, USE_CHANGED: USE_CHANGED, NOT_SAVED: NOT_SAVED, NEWER: NEWER, FROM_V1: FROM_V1,
    SYSTEMS: SYSTEMS, SYSTEMS_FALLBACK: SYSTEMS_FALLBACK,
    ALMOST_FEW_MUST: ALMOST_FEW_MUST, READY_FEW_TAIL: READY_FEW_TAIL, NONE_ALMOST: NONE_ALMOST, HOLD: HOLD, BOX: BOX, PILOT_GLOSS: PILOT_GLOSS, Q_CHANGED: Q_CHANGED, Q_NEW_LINE: Q_NEW_LINE, CONSIST: CONSIST, FILE_KEEPS_SHARE: FILE_KEEPS_SHARE };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.R2Content;
})(typeof self !== 'undefined' ? self : globalThis);
