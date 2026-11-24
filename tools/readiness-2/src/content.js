/* Do you need AI? v2 (folder tools/readiness-2): every word a hotel reads about the five questions and the must-haves.
   Sources: research_notes/AI starting point/research.md (23 Nov 2026) for the five questions and the sourced figures;
   the owner's workbook "AI Use Cases: Resources Needed per Use Case (D4 x D6)" for which must-haves and for the tailored
   questions (those are generated: data/usecase-questions.json).
   Rules kept (CLAUDE.md): no source the project bans; every figure carries its source and base; only sources the research
   marks [opened] are listed or quoted. Internal codes (P1, F1 ...) stay in this file and never reach the screen. */
(function (root) {
  'use strict';

  /* ---------- Step 2: is this an AI problem? (research A). v2 (owner, 24 Nov 2026): simpler wording, one short sentence each;
     Q2 is the owner's wording of 23 Nov and stays. The "Why this matters" texts are unchanged. ---------- */
  var QUESTIONS = [
    { id: 'q1', short: 'Needs judgement, not fixed rules', title: 'Complex judgement', yesIf: 'Every case is different, like guest emails, photos or tomorrow’s demand.', noIf: 'You could write it down as fixed rules, like “send an email 3 days before arrival” or “reorder towels when stock falls below 200”.',
      q: 'Is this task too varied for fixed rules (if this, then that)?',
      hint: 'Yes if every case is different, like guest emails, photos or tomorrow’s demand. No if you could write it as rules, like “send an email 3 days before arrival” or “reorder towels when stock falls below 200”.',
      guard: 'Judge the job, not how you handle it today. If you use rules now only because nothing better was available, for example price rules, answer Not sure.', // v1.2, council BUILD NOW 1
      whyShort: 'AI only helps when a job needs judgement; if fixed rules can do it, ordinary software is cheaper and more reliable.', // v1.3 (owner): the first line of the "Why this matters" fold (`short` is already the to-find-out label)
      why: 'Software that only follows rules written by people is not AI, and a simpler tool is cheaper, easier to explain and easier to fix.',
      yes: 'Reading guest emails in five languages and drafting replies.',
      no: 'Sending a pre-arrival email three days before arrival, or alerting when a room is not cleaned by 14:00.',
      outcome: 'Not suitable for AI: rules or ordinary automation will do it.', // v1.2 (owner B2): was "Not an AI problem: …"
      who: 'the vendor or IT' },
    { id: 'q2', short: 'Worth real money or hours', title: 'Return', yesIf: 'It happens often or costs a lot: many cases a week, or real staff hours or revenue at stake.', noIf: 'It is rare or small, so doing it better would save little.',
      q: 'Is this task frequent or costly enough to be worth improving?',
      hint: '',
      whyShort: 'AI costs money to set up, run and check, so a rare or small job will not pay that back.', // v1.3 (owner): the first line of the "Why this matters" fold (`short` is already the to-find-out label)
      why: 'AI tools have set-up, subscription, checking and training costs. A rare or small task seldom repays them.',
      yes: 'About 400 guest emails a week at front office.',
      no: 'A 12-room guesthouse with 10 email enquiries a week.',
      outcome: 'Probably not worth it.', add: 'Look again if the volume grows, or if a tool you already pay for adds it.',
      who: 'the GM or finance' },
    { id: 'q3', short: 'Information is digital and current', title: 'Information ready', yesIf: 'The facts it needs are digital, in one place and kept up to date, such as bookings, past guest messages, rates or menus.', noIf: 'The facts are on paper, in one person’s head, or spread over systems that disagree.',
      q: 'Is the information it needs digital and up to date?',
      hint: 'Examples: bookings, past guest messages, rates, your hotel’s facts and menus.',
      whyShort: 'AI works from your data; if it is missing or out of date, the tool gives confident wrong answers.', // v1.3 (owner): the first line of the "Why this matters" fold (`short` is already the to-find-out label)
      why: 'If the facts sit on paper, in one person’s head or in five systems that disagree, the tool gives wrong answers with confidence.',
      yes: 'One up-to-date fact sheet (rooms, hours, policies) for a guest chatbot.',
      no: 'Allergen information only in the chef’s binder.',
      outcome: 'Fix the data first.', add: 'Put the facts in one place and name who keeps them right. Then ask again.',
      who: 'IT or the department head' },
    { id: 'q4', short: 'Mistakes can be caught', title: 'Safety net', yesIf: 'A person can check the result before it counts, or a mistake is easy to put right.', noIf: 'A mistake would reach a guest or staff member straight away and could hurt them.',
      q: 'Can mistakes be caught before they harm anyone?',
      hint: '',
      whyShort: 'AI is never right every time, so you need a way to catch mistakes before they hurt anyone.', // v1.3 (owner): the first line of the "Why this matters" fold (`short` is already the to-find-out label)
      why: 'AI works on probabilities, so it is never right every time. Where a mistake would be costly, unsafe or unfair, AI can still help, but only as a draft a person checks.',
      yes: 'Draft replies to reviews that a manager approves before they go out.',
      no: 'Answering guests’ allergen questions on its own.',
      outcome: 'AI as an assistant only: a person checks every result before it counts.',
      add: 'If the use touches safety, health or people’s rights (hiring, staff evaluation), check the AI Act guide tab: it may be high-risk.',
      who: 'the department head' },
    { id: 'q5', short: 'Success has a number', title: 'Proof', yesIf: 'You can name one number and know today’s figure, such as reply time, hours spent or revenue per room.', noIf: 'You only have a general aim, like “be more innovative”.',
      q: 'Can you name the number that should improve, and today’s figure?',
      hint: 'Examples: reply time, hours spent, revenue per room, kilos of food thrown away.',
      whyShort: 'Without today’s figure you cannot tell later whether the tool worked, so keeping it becomes guesswork.', // v1.3 (owner): the first line of the "Why this matters" fold (`short` is already the to-find-out label)
      why: 'Without a starting figure nobody can tell whether the tool worked, and the decision to keep or stop it turns into opinion.',
      yes: '“Average reply time to email enquiries: 9 hours today; target under 1 hour.”',
      no: '“We want to be more innovative.”',
      outcome: 'Define success first.', add: 'Write down the number and today’s figure, then come back.',
      who: 'the GM' }
  ];
  var Q_ANSWERS = [['y', 'Yes'], ['n', 'No'], ['u', 'Not sure']];

  /* The stop screen (owner's hard rule: Q1 No ends the journey). Reads: headline, why, instead, then the "Not sure" line.
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
    data: 'Fix the data first.',
    success: 'Define success first.',
    find: 'Find out first.',
    assist: 'Worth exploring, as an assistant only: a person checks every result before it counts.',
    go: 'Worth exploring with AI. Next: the must-haves.',
    goDone: 'Worth exploring with AI.' // the same verdict on the summary, where "where it sits" is already answered
  };

  /* ---------- Must-haves and tailored questions: the readiness check's answer scale ---------- */
  var ANSWERS = [['y', 'Yes'], ['pl', 'Planned, not done yet'], ['p', 'Partly'], ['n', 'No'], ['k', 'Don’t know yet']];

  var NA = ['na', 'Doesn’t apply'];
  var ANSWER_WORD = { y: 'Yes', pl: 'Planned, not done yet', p: 'Partly', n: 'No', k: 'Don’t know yet', na: 'Doesn’t apply' };

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
      why: 'AI costs continue after launch: subscription, fees that depend on use, connection to your systems, training, and someone’s time to check results.',
      good: 'A budget line covering subscription, set-up and connection to your systems, training and running costs.',
      blocks: ['Recurring subscription or usage budget'],
      ev: [['40.95% of EU accommodation businesses that had considered AI but did not use it said the costs seem too high.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['35% of hotels named high set-up costs as a barrier.', 'HES-SO Valais-Wallis survey, news of 9 Jul 2025. Base: over 1,500 hotels in Austria, France, Germany, Greece, Italy and Switzerland, Jan–Apr 2025.']],
      act: 'Write a 12-month budget line for the full cost (subscription, set-up, connection, training, running costs).' },
    { id: 'm3', gate: 'F2, O1', name: 'A number to improve, approved', who: 'owner',
      q: 'Has the person who decides on spending approved the KPI this tool must improve, with today’s figure and the target?',
      gloss: 'KPI: the one number that shows success, for example reply time or revenue per room. In a managed or franchised hotel the owner approves it.',
      why: 'Without today’s figure and a target, nobody can tell later whether the tool worked, and keeping it becomes a matter of opinion.',
      good: 'The KPI, today’s figure and the target, approved in writing, with the date.',
      blocks: ['KPI baseline and scale/stop rule', 'Approved goal and clear approval path'],
      ev: [['“Lack of senior management buy-in in many companies also appears problematic.”', 'OECD, The Adoption of Artificial Intelligence in Firms, May 2025. Base: survey of 840 enterprises in G7 countries, 2022–23, plus interviews.'],
           ['Only 14% of hotel company leaders credited executive mandates for their AI success, against 34% for experimentation: light written backing, not a top-down order.', 'State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.']],
      act: 'Agree the KPI this tool must improve, today’s figure and the target, and get them approved by the person who decides on spending.' },
    { id: 'm4', gate: 'T1', name: 'Systems that can connect', who: 'it', ex: true,
      q: 'Can other software read from and write back to the systems you want to connect it to?',
      gloss: 'PMS: the property management system, the booking system that holds reservations, rooms and guest records.',
      why: 'An AI tool that cannot read from and write back to your hotel systems leaves staff copying data by hand.',
      good: 'For each system you want to connect: its provider confirms that other software can connect to it, in the version you run.',
      blocks: ['Two-way link to core systems (PMS, CRS, POS, accounting)'],
      ev: [['45.91% of EU accommodation businesses that had considered AI but did not use it named incompatibility with their existing equipment, software or systems as a reason.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['29% of hotel company leaders named systems integration as a barrier to getting value from AI.', 'State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.']],
      act: 'Ask the provider of each system you want to connect (for example {ex}) whether other software can read from it and write back to it.' },
    { id: 'm5', gate: 'D5', name: 'Data protection contact involved', who: 'dpo',
      q: 'Has your data protection contact been told about this plan?',
      gloss: 'If you have no data protection officer, this is whoever handles data protection for you, often an outside adviser.',
      why: 'If the tool handles guest or staff data, data protection law asks for a written contract with the vendor and sometimes a written risk check. Your data protection contact knows what applies.',
      good: 'Your data protection contact knows which guest or staff data the tool would use and has said what is needed before you start.',
      blocks: ['Lawful basis and vendor data agreement'],
      ev: [['52.36% of EU accommodation businesses that had considered AI but did not use it named concerns about data protection and privacy.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['“Such legal act must be in writing, including in electronic form.” (on the contract between a hotel and a vendor that processes its personal data)', 'EDPB Guidelines 07/2020 on the concepts of controller and processor, version 2.1.']],
      act: 'Tell your data protection contact about the plan and ask what is needed before any guest or staff data goes into a tool.' },
    { id: 'm6', name: 'A person who checks the AI', who: 'dept',
      q: 'Is there a named person who will check the AI’s results and can overrule them?',
      why: 'AI is never right every time. Someone must be able to catch a wrong result and put it right before it counts.',
      good: 'A named role that checks the results, knows which ones must be checked before they take effect, and can stop or correct the tool.',
      blocks: ['Human reviewer who checks or overrides AI output'],
      ev: [['56.80% of EU accommodation businesses that had considered AI but did not use it named a lack of clarity about the legal consequences.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.']],
      act: 'Name the person who checks the AI’s results, and decide which results they must check before they count.' },
    { id: 'm7', name: 'Data you can reach, kept right', who: 'dept',
      q: 'Do you have a system that holds each piece of data this tool needs, and a named person who keeps it right?',
      why: 'AI works from your data. If the facts are on paper, out of date or spread over systems that disagree, the tool gives confident wrong answers.',
      good: 'You can name where each piece of data sits, and a named person checks it at set times.',
      blocks: ['Historical operational data', 'Curated knowledge and hotel content (FAQ, SOPs, menus, policies)'],
      ev: [['42.61% of EU accommodation businesses that had considered AI but did not use it named difficulties with the availability or quality of the data.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['42% of hotel company leaders were confident their data is ready for their AI goals; 48% were not.', 'State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.']],
      act: 'List the data the tool needs and the system each piece sits in, and name who keeps it right.' },
    { id: 'm8', name: 'Staff told, and able to report errors', who: 'dept',
      q: 'Have the staff concerned been told about the plan, and do they know whom to tell when the tool gets something wrong?',
      why: 'Staff who were not told work around a tool, and errors nobody reports are never fixed.',
      good: 'The staff concerned have heard the plan from their manager, and one named person collects what goes wrong.',
      blocks: ['Frontline adoption and change support'],
      ev: [['69.89% of EU accommodation businesses that had considered AI but did not use it named a lack of relevant expertise, the most common reason.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['35% of hotel company leaders named change management as a barrier to getting value from AI, the most often cited.', 'State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.']],
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
      good: 'A short written fallback for each task the tool does, known to the shift leaders.',
      blocks: ['Fallback if the tool or vendor fails'],
      ev: [['“Contingency processes are in place to handle failures or incidents in third-party data or AI systems deemed to be high-risk.”', 'NIST AI Risk Management Framework 1.0, GOVERN 6.2 (Jan 2023).']],
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
  var SYSTEMS_NOTE = 'Typical systems by department (the examples under the two systems questions): the team’s own list, based on the catalogue’s use cases, not a survey.';

  /* ---------- the result: verdict names and the lines under them ---------- */
  var LEVELS = {
    ready: { name: 'Ready to start a pilot', line: 'Every must-have is in place and most of what this use case needs is there. Start small, with the KPI and its target in front of you.' },
    almost: { name: 'Almost ready', line: 'Most of it is there. Close the open points below before you sign anything.' },
    notready: { name: 'Not ready yet', line: 'Too much is still missing to start. The list below shows what to do first.' },
    noinfo: { name: 'Not enough information yet', line: 'More than half the questions are still “Don’t know yet”. Find out first, then come back: the list below says whom to ask.' }
  };
  var AREA_WORD = { strong: 'Strong', gaps: 'Gaps to close', weak: 'Weak', thin: 'Too little to say' };
  var SCORE_NOTE = 'self-reported; cut-offs are the team’s judgement, not tested with hotels';
  var MUST_ONLY = 'No use case was chosen (“None of these fits”), so this result rests on the must-haves only.';
  var DRAFT = 'Draft questions: team to review';
  var LEGAL_NOTE = 'Provisional label from the team’s AI Register, awaiting legal sign-off. Not a compliance verdict and not legal advice.';

  /* ---------- "Where this comes from" per step: opened sources only, with dates ---------- */
  var SOURCES = {
    q: [
      'EU AI Act, Regulation (EU) 2024/1689, Art. 3(1) and recital 12 (Official Journal, 12 Jul 2024).',
      'European Commission, Guidelines on the definition of an AI system, C(2025) 5053 final (29 Jul 2025). Not binding.',
      'UK Government (DSIT), AI Playbook for the UK Government (10 Feb 2025).',
      'GOV.UK, Assessing if artificial intelligence is the right solution (10 Jun 2019).',
      'NIST, AI Risk Management Framework 1.0, NIST AI 100-1 (Jan 2023).',
      'Google PAIR, People + AI Guidebook, “User Needs + Defining Success” (undated page, read 23 Nov 2026).',
      'Brynjolfsson & Mitchell, “What can machine learning do? Workforce implications”, Science 358 (Dec 2017).'
    ],
    qNote: 'The five questions, the order of the outcomes and the examples are the project team’s, built from these sources on 23 Nov 2026 and reworded more simply on 24 Nov 2026. Question 1 asks whether the job needs AI; it is not a legal classification (the AI Act guide tab covers that).',
    must: [
      'The project team’s resource analysis: “AI Use Cases: Resources Needed per Use Case (D4 × D6)”, Nov 2026. {N} catalogue use cases coded against 20 building blocks; the coding is team judgement, not a survey.',
      'Eurostat, Use of AI in enterprises, ICT usage survey of early 2025, dataset isoc_eb_ain2 (updated 15 Jun 2026; queried 23 Nov 2026).',
      'HES-SO Valais-Wallis, “How AI is (and isn’t) transforming European hospitality”, survey news (9 Jul 2025).',
      'Britz & Schegg, From Awareness to Action: AI Readiness in Hotels, HES-SO Valais-Wallis (Oct 2025).',
      'State of Hotel AI, Fall 2026 (29 Sep 2026).',
      'OECD, The Adoption of Artificial Intelligence in Firms (May 2025).',
      'EDPB, Guidelines 07/2020 on the concepts of controller and processor in the GDPR, version 2.1 (adopted 7 Jul 2021).',
      'NIST, AI Risk Management Framework 1.0 (Jan 2023).'
    ],
    mustNote: 'The ten must-haves are the team’s choice: the six gates of its readiness checklist and the building blocks that most use cases need, in its resource analysis. Where a share is shown (“needed for n of {N} use cases”), it is that analysis, not a survey. The wording follows the hub’s earlier readiness check. Typical systems (the examples under the systems question): the team’s own list, based on the catalogue’s use cases.',
    where: [],
    whereNote: 'The departments and use cases come from the hub’s Use-Case Catalogue (the project team’s catalogue, read when this page was built). “How common” is the catalogue’s rating (High, Medium, Low, Very low), built from the sources listed there for each use case.',
    tailored: [
      'The project team’s resource analysis: “AI Use Cases: Resources Needed per Use Case (D4 × D6)”, Nov 2026, sheets “Use case resources” and “Use case archetypes”.'
    ],
    tailoredNote: 'Each question is built by a fixed rule from one cell of the team’s resource analysis for this use case (people, skills, financial investment, technology infrastructure, data, organisation and governance). The analysis is qualitative: no source gives costs or staffing per use case for European hotels. Where it names no evidence, the cell is the team’s judgement from the catalogue description. Legal points in it are signposts only.',
    result: [],
    resultNote: 'The percentage and the verdict are worked out from your own answers with the rules shown under “How this was worked out”. The cut-offs are the team’s judgement and have not been tested with hotels. The AI Act label comes from the hub’s AI Register and is provisional.'
  };

  var HONEST = 'Nobody checks your answers. An answer that isn’t true only hides a problem you will meet later.';
  var AS_OF = '24 Nov 2026';
  var USE_CHANGED = 'The catalogue changed: please pick your use case again.';
  var NOT_SAVED = 'This browser is not keeping your answers. Use Copy summary, Print, Save as file or Download before you close the page.';
  var NEWER = 'This was saved by a newer version of this page. Changes here are not kept.';
  var FROM_V1 = 'This tool has changed. Your five answers and your use case were kept. The other answers were not: the questions are new.';

  root.R2Content = { QUESTIONS: QUESTIONS, Q_ANSWERS: Q_ANSWERS, STOP: STOP, VERDICT: VERDICT, ANSWERS: ANSWERS, NA: NA, ANSWER_WORD: ANSWER_WORD, MUSTS: MUSTS,
    WHO: WHO, WHO_ORDER: WHO_ORDER, TYPES: TYPES, ROLES: ROLES, COUNTRIES: COUNTRIES, COUNTRY_LABEL: COUNTRY_LABEL, CC: CC,
    LEVELS: LEVELS, AREA_WORD: AREA_WORD, SCORE_NOTE: SCORE_NOTE, MUST_ONLY: MUST_ONLY, DRAFT: DRAFT, LEGAL_NOTE: LEGAL_NOTE,
    SOURCES: SOURCES, HONEST: HONEST, AS_OF: AS_OF, USE_CHANGED: USE_CHANGED, NOT_SAVED: NOT_SAVED, NEWER: NEWER, FROM_V1: FROM_V1,
    SYSTEMS: SYSTEMS, SYSTEMS_FALLBACK: SYSTEMS_FALLBACK, SYSTEMS_NOTE: SYSTEMS_NOTE };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.R2Content;
})(typeof self !== 'undefined' ? self : globalThis);
