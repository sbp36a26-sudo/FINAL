/* AI starting point (formerly "Readiness 2.0"; folder tools/readiness-2): every word a hotel reads about the questions, the prerequisites and the success factors.
   Source of all content: research_notes/AI starting point/research.md (23 Nov 2026). Section letters there:
   A = the five questions (step 1a here), B = prerequisites (step 2), C = success factors (step 3), D = scale and summary.
   Rules kept (CLAUDE.md): no source the project bans; every figure carries its source and base;
   only sources the research marks [opened] are listed or quoted (no [abstract] or [search-only] items).
   rc: the readiness-check question code the self-check comes from (tools/readiness-check/src/logic.js, rules v4); 'new' = wording new in the research. */
(function (root) {
  'use strict';

  /* ---------- Step 1a: is this an AI problem? (research A) ---------- */
  var QUESTIONS = [
    { id: 'q1', short: 'Needs judgement, not fixed rules',
      q: 'Is this job too varied to write down as fixed rules (if this, then that)?',
      hint: 'Yes if every case is different, like guest emails, photos or tomorrow’s demand. No if you could write it as rules, like “send an email 3 days before arrival” or “reorder towels when stock falls below 200”.',
      guard: 'Judge the job, not how you handle it today. If you use rules now only because nothing better was available, for example price rules, answer Not sure.', // v1.2, council BUILD NOW 1
      why: 'Software that only follows rules written by people is not AI, and a simpler tool is cheaper, easier to explain and easier to fix.',
      yes: 'Reading guest emails in five languages and drafting replies.',
      no: 'Sending a pre-arrival email three days before arrival, or alerting when a room is not cleaned by 14:00.',
      outcome: 'Not suitable for AI: rules or ordinary automation will do it.', // v1.2 (owner B2): was "Not an AI problem: …"
      who: 'the vendor or IT' },
    { id: 'q2', short: 'Worth real money or hours',
      q: 'Does the job come up often enough, or cost enough, that doing it better would be worth real money or staff hours every month?',
      hint: '',
      why: 'AI tools have set-up, subscription, checking and training costs. A rare or small task seldom repays them.',
      yes: 'About 400 guest emails a week at front office.',
      no: 'A 12-room guesthouse with 10 email enquiries a week.',
      outcome: 'Probably not worth it.', add: 'Look again if the volume grows, or if a tool you already pay for adds it.',
      who: 'the GM or finance' },
    { id: 'q3', short: 'Information is digital and current',
      q: 'Is the information the tool needs already kept somewhere digital and up to date?',
      hint: 'Examples: bookings, past guest messages, rates, your hotel’s facts and menus.',
      why: 'If the facts sit on paper, in one person’s head or in five systems that disagree, the tool gives wrong answers with confidence.',
      yes: 'One up-to-date fact sheet (rooms, hours, policies) for a guest chatbot.',
      no: 'Allergen information only in the chef’s binder.',
      outcome: 'Fix the data first.', add: 'Put the facts in one place and name who keeps them right. Then ask again.',
      who: 'IT or the department head' },
    { id: 'q4', short: 'Mistakes can be caught',
      q: 'If the tool gets it wrong now and then, can the mistake be spotted and put right before it hurts a guest, a staff member or the hotel?',
      hint: '',
      why: 'AI works on probabilities, so it is never right every time. Where a mistake would be costly, unsafe or unfair, AI can still help, but only as a draft a person checks.',
      yes: 'Draft replies to reviews that a manager approves before they go out.',
      no: 'Answering guests’ allergen questions on its own.',
      outcome: 'AI as an assistant only: a person checks every result before it counts.',
      add: 'If the use touches safety, health or people’s rights (hiring, staff evaluation), check the AI Act guide tab: it may be high-risk.',
      who: 'the department head' },
    { id: 'q5', short: 'Success has a number',
      q: 'Can you name the one number that should get better, and do you know today’s figure?',
      hint: 'Examples: reply time, hours spent, revenue per room, kilos of food thrown away.',
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
    go: 'Worth exploring with AI. Next: find where it sits in your hotel.',
    goDone: 'Worth exploring with AI.' // the same verdict on the summary, where "where it sits" is already answered
  };

  /* ---------- Steps 2 and 3: answer scale (research D, same as the readiness check) ---------- */
  var ANSWERS = [['y', 'Yes'], ['pl', 'Planned, not done yet'], ['p', 'Partly'], ['n', 'No'], ['k', 'Don’t know yet']];

  /* ---------- Step 2: what you need to implement AI (research B) ----------
     Order on screen: B1, B3, B5, B8, B9 first (they match readiness-check must-haves), then B2, B4, B6, B7, B10.
     key: true for those five. also: further readiness-check questions on the same point (shown folded). */
  var NEEDS = [
    { id: 'b1', key: true, name: 'Systems that can talk to each other',
      plain: 'The AI tool must read from and write back to your booking system (PMS) and other software, or staff end up copying data by hand.',
      good: 'The vendor confirms in writing a two-way link to your PMS version, and you have seen it work on your own systems.',
      check: 'Has it been confirmed in writing that the tool can read from and write back to your hotel systems?', rc: 'T1',
      gloss: 'PMS: the property management system, the booking system that holds reservations, rooms and guest records.',
      also: [['T4', 'Do you have a written list of the software your hotel uses that shows which ones share data?']],
      ev: [['45.91% of EU accommodation businesses that had considered AI but did not use it named incompatibility with their existing equipment, software or systems as a reason.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['29% of hotel company leaders named systems integration as a barrier to getting value from AI.', 'State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.']],
      act: 'Ask the vendor to confirm in writing that the tool reads from and writes back to your PMS, and see it work on your own systems.', who: 'IT / vendor' },
    { id: 'b3', key: true, name: 'Data you can reach, trust and own',
      plain: 'The tool is only as good as the bookings, guest records and hotel facts it reads. Someone must keep them right, and the hotel must keep the rights to them.',
      good: 'You can name where each piece of data sits. One up-to-date source holds the hotel’s facts. A named person checks the data at set times. The contract says the data stays yours.',
      check: 'Can you name the system that holds each piece of data this tool needs?', rc: 'D1',
      also: [['D3', 'Does a named person check at set times that the data this tool uses is correct and up to date?']],
      ev: [['42.61% of EU accommodation businesses that had considered AI but did not use it named difficulties with the availability or quality of the data.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['42% of hotel company leaders were confident their data is ready for their AI goals; 48% were not.', 'State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.']],
      act: 'List the systems that hold the data the tool needs, and name the person who checks that data at set times.', who: 'Department head / IT' },
    { id: 'b5', key: true, name: 'Data protection paperwork',
      plain: 'If the tool handles guest or staff data, the vendor works with that data for you. The GDPR requires a written contract with it, and your data protection contact must agree.',
      good: 'A signed data processing agreement (DPA) that covers instructions, security, sub-processors, returning or deleting data at the end, and whether the vendor may train on your data. A written OK from your data protection contact, and a data protection impact assessment (DPIA) where the risk is high.',
      check: 'Have you signed a data processing agreement with the vendor of this tool?', rc: 'D5a',
      gloss: 'A data processing agreement (DPA) is the contract that says what the vendor may do with your guests’ and staff’s data. A DPIA (data protection impact assessment) is a written check of the risks to people’s data.',
      also: [['D5b', 'Has your data protection contact confirmed in writing that you may use guest or staff data in this tool?'], ['G2s', 'Has a data protection impact assessment (DPIA) been done for this tool?']],
      ev: [['52.36% of EU accommodation businesses that had considered AI but did not use it named concerns about data protection and privacy.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['“Such legal act must be in writing, including in electronic form.” (on the contract between a hotel and a vendor that processes its personal data, GDPR Art. 28(3))', 'EDPB Guidelines 07/2020 on the concepts of controller and processor, version 2.1.']],
      act: 'Sign a data processing agreement with the vendor and get a written OK from your data protection contact.', who: 'GM / data protection contact' },
    { id: 'b8', key: true, name: 'A named owner with time',
      plain: 'Someone in the hotel is responsible for the tool. They watch the results, deal with the vendor and decide on changes, with hours set aside for it.',
      good: 'A named role with weekly hours written into a job description or the project plan.',
      check: 'Is there a named person in charge of this tool, with agreed hours each week for it?', rc: 'P1', also: [],
      ev: [['“Roles and responsibilities and lines of communication related to mapping, measuring, and managing AI risks are documented and are clear to individuals and teams throughout the organization.”', 'NIST AI Risk Management Framework 1.0, GOVERN 2.1.']],
      act: 'Name the person in charge of the tool and agree their weekly hours for it.', who: 'GM' },
    { id: 'b9', key: true, name: 'Budget for the running costs, not only the start',
      plain: 'AI costs continue after launch: subscription, usage-based fees, connection to your systems, training, and someone’s time to check results.',
      good: 'A 12-month budget with all cost lines. A named payer (hotel, owner, brand fund). A monthly bill check with a spending limit if the price depends on use.',
      check: 'Is there a written budget for the first 12 months that covers the full cost, not only the subscription?', rc: 'F1',
      also: [['F4', 'Is it decided who pays for the tool (hotel, owner, group fund, grant or vendor package)?'], ['F5', 'Does someone check the tool’s bill every month?']],
      ev: [['40.95% of EU accommodation businesses that had considered AI but did not use it said the costs seem too high.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['35% of hotels named high set-up costs as a barrier.', 'HES-SO Valais-Wallis survey, news of 9 Jul 2025. Base: over 1,500 hotels in Austria, France, Germany, Greece, Italy and Switzerland, Jan–Apr 2025.']],
      act: 'Write a 12-month budget with all costs and agree who pays.', who: 'GM / finance' },
    { id: 'b2', name: 'Older systems',
      plain: 'An older booking system installed in the hotel often has no open connection. Many AI tools then cannot plug in, or need a costly custom bridge.',
      good: 'You know what kind of PMS you have. If it is old, you have a plan: an interface from the vendor, an upgrade date, or a tool that works without a link.',
      check: 'Do you know what kind of booking system (PMS) you have and, if it is old and hard to connect, is there a plan?', rc: 'new (from T2)', also: [['T2', 'Which describes your main hotel system (PMS)? (online system other software can connect to / all-in-one system that already includes this tool / older system in the hotel, hard to connect)']],
      ev: [['“Concerns over data privacy and integration hurdles are also prominent, particularly among larger hotels with complex legacy systems.”', 'HES-SO Valais-Wallis survey, news of 9 Jul 2025. Base: over 1,500 hotels in six European countries, Jan–Apr 2025.']],
      act: 'Find out which PMS you run and whether other software can connect to it; if not, ask the vendor for an interface or an upgrade date.', who: 'IT' },
    { id: 'b4', name: 'Internet and devices where the work happens',
      plain: 'Cloud AI tools stop when the Wi-Fi or mobile signal drops: in the kitchen, the basement laundry, a remote wing. Staff also need devices that can run the tool.',
      good: 'A stable connection, tested in each place the tool is used, and enough tablets or phones for the shift.',
      check: 'Where the tool will be used, does the internet connection work without regular dropouts?', rc: 'T3',
      also: [['new', 'Do the staff who will use the tool have a working device for it on every shift?']],
      ev: [['“Access to fast, reliable, and affordable connectivity is a pre-condition for SMEs’ digital uptake.” No hotel-specific figure was found.', 'OECD, AI adoption by small and medium-sized enterprises, G7 discussion paper, Dec 2025.']],
      act: 'Test the connection in each place the tool will be used, and count the devices available per shift.', who: 'IT / department head' },
    { id: 'b6', name: 'Security check of the vendor',
      plain: 'The tool gets a key to your systems and guest data. Someone must check that the vendor protects it.',
      good: 'IT or a security contact has reviewed the vendor (certifications, where the data is held, incident contact) before access is given.',
      check: 'Has your IT or security contact checked this vendor’s security before it gets access to your systems?', rc: 'G4', also: [],
      ev: [['“A controller must only use processors providing sufficient guarantees to implement appropriate technical and organisational measures.”', 'EDPB Guidelines 07/2020 on the concepts of controller and processor, version 2.1.']],
      act: 'Ask your IT or security contact to review the vendor before it gets access to your systems.', who: 'IT' },
    { id: 'b7', name: 'Vendor support, exit and getting your data back',
      plain: 'Before you sign, know who helps when it breaks, and how you leave with your data if the tool disappoints or the vendor closes.',
      good: 'Support hours and a named contact in the contract. Data export in a common format. Return or deletion at the end. Notice period and exit cost known.',
      check: 'Does the contract say how you get your data back, in a usable format, if you stop using the tool?', rc: 'new', also: [],
      ev: [['Software-as-a-service providers “must make open interfaces available and, at a minimum, export data in a commonly used and machine-readable format”. The EU Data Act applies since 12 September 2025.', 'European Commission, “Data Act explained” (page as of 23 Nov 2026).']],
      act: 'Check that the contract says how you get your data back in a usable format, and what leaving costs.', who: 'GM / finance' },
    { id: 'b10', name: 'A way to work when the tool is down',
      plain: 'If the tool or the vendor fails for a day, guests still check in and emails still need answers.',
      good: 'A short written fallback for each task the tool does, known by the shift leaders.',
      check: 'If the tool stops working for a day, is there a written way to do the job without it?', rc: 'T5', also: [],
      ev: [['“Contingency processes are in place to handle failures or incidents in third-party data or AI systems deemed to be high-risk.”', 'NIST AI Risk Management Framework 1.0, GOVERN 6.2.']],
      act: 'Write a short fallback for each task the tool does, and walk the shift leaders through it.', who: 'Department head' }
  ];

  /* ---------- Step 3: what makes it succeed (research C) ---------- */
  var FACTORS = [
    { id: 'c1', name: 'Budget',
      def: 'Money set aside for the whole life of the tool, and a clear answer to who pays.',
      good: 'A 12-month cost plan agreed with the owner or brand. A trial budget with a stop date.',
      warn: ['“The vendor said it’s €99 a month”, with no set-up, connection or training cost.', 'Nobody knows whether the owner or the operator pays.'],
      check: 'Have you agreed, before starting, what result a trial must reach for you to keep the tool?', rc: 'F3',
      ev: [['“A lack of time and budget, limited technical expertise, and difficulty in evaluating suitable AI providers create a bottleneck for implementation.”', 'Britz & Schegg, From Awareness to Action: AI Readiness in Hotels, HES-SO Valais-Wallis, Oct 2025. Base: hoteliers surveyed Jul–Sep 2025, median 37.5 rooms; the authors warn the sample is likely more digitally aware than average.']],
      act: 'Agree, before any trial, the result it must reach and the date you decide to keep or stop it.', who: 'GM / owner' },
    { id: 'c2', name: 'Workflow clarity',
      def: 'Knowing step by step how the job is done today, and how it will be done with the tool: who does what, who checks.',
      good: 'A one-page before/after for the task, such as email handling, agreed with the staff who do it.',
      warn: ['The tool is bought “to see what it can do”.', 'Staff run the old and the new process side by side for months.'],
      check: 'Have you written down, step by step, who does what once the tool is in use?', rc: 'O2',
      weak: 'Evidence here is thinner: one worldwide survey of 107 hotel company leaders (State of Hotel AI, Fall 2026); no European hotel survey yet.',
      ev: [['32% of hotel company leaders credited workflow redesign for their success with AI.', 'State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.']],
      act: 'Write a one-page before/after of the task together with the staff who do it.', who: 'Department head' },
    { id: 'c3', name: 'Leadership',
      def: 'The person who decides on spending backs the project in writing, understands what AI can and cannot do, and takes responsibility for its risks.',
      good: 'The owner or GM signs a one-page plan and opens the staff briefing. In a managed or franchised hotel, everyone who must approve is listed.',
      warn: ['The project lives in one enthusiastic department.', 'The owner hears about it at invoice time.'],
      check: 'Has the person who decides on spending approved a short written plan that says what this tool should achieve?', rc: 'O1',
      ev: [['“Lack of senior management buy-in in many companies also appears problematic.”', 'OECD, The Adoption of Artificial Intelligence in Firms, May 2025. Base: survey of 840 enterprises in G7 countries, 2022–23, plus interviews.'],
           ['Only 14% of hotel company leaders credited executive mandates for their AI success, against 34% for experimentation: light written backing, not a top-down order.', 'State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.']],
      act: 'Get the person who decides on spending to approve a one-page plan for the tool.', who: 'GM / owner' },
    { id: 'c4', name: 'Culture',
      def: 'A hotel where staff may try, question the tool and report problems without blame, and where AI is seen as help, not a threat to jobs.',
      good: 'Staff tried the tool before the decision. There is a known person to tell when it errs. Managers talk openly about what happens to the time saved.',
      warn: ['Staff override every suggestion.', 'Rumours about job cuts.', 'Nobody reports errors.'],
      check: 'Have the staff who will use the tool tried it or watched a demo?', rc: 'X1',
      weak: 'Evidence here is thin: one hotelier’s quote and academic studies; no European hotel survey measures culture yet.',
      ev: [['“AI is not the problem – change is.” (a hotelier quoted by the authors). No large European hotel survey measures culture directly.', 'Schegg & Fux, Hotel Yearbook 2025 Technology Edition, 23 Jun 2025.']],
      act: 'Let the staff who will use the tool try a demo, and tell them whom to report errors to.', who: 'Department head' },
    { id: 'c5', name: 'Workforce readiness',
      def: 'Staff and managers know enough about AI to use the tool, check its output and know its limits.',
      good: 'Short role-based training that includes “how to spot a wrong answer”. Managers can name one thing the tool cannot do.',
      warn: ['Training means “read the vendor’s manual”.', 'Only one person understands the tool.'],
      check: 'Can the managers involved name one thing this tool cannot do reliably?', rc: 'P2',
      ev: [['69.89% of EU accommodation businesses that had considered AI but did not use it named a lack of relevant expertise, the most common reason.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.'],
           ['“In many cases, simply relying on the AI systems’ instructions for use or asking the staff to read them might be ineffective.”', 'European Commission, AI literacy: Questions & Answers (page as of 23 Nov 2026).']],
      act: 'Plan short training that teaches staff to spot a wrong answer, not only to use the tool.', who: 'Department head / HR' },
    { id: 'c6', name: 'Governance',
      def: 'Written rules on who may use AI for what, what must not be typed into AI tools, who approves new tools, and a record of the tools in use.',
      good: 'A one-page AI-use rule for staff. A list of AI tools in use, with owner and purpose (the AI Register tab does this). A risk check before go-live.',
      warn: ['Staff paste guest data into free chatbots.', 'Nobody knows how many AI tools the hotel pays for.'],
      check: 'Do you have written rules telling staff what they must not type into AI tools?', rc: 'G1',
      ev: [['Only 9% of the hotels surveyed had a formal AI strategy document.', 'Britz & Schegg, From Awareness to Action: AI Readiness in Hotels, HES-SO Valais-Wallis, Oct 2025. Base: hoteliers surveyed Jul–Sep 2025, median 37.5 rooms; likely more digitally aware than average.']],
      act: 'Write a one-page rule on what staff must not type into AI tools.', who: 'GM / data protection contact' },
    { id: 'c7', name: 'Risk',
      def: 'Knowing in advance what could go wrong (wrong answers, data leaks, unfair treatment, legal duties) and how much risk the hotel accepts.',
      good: 'Outputs that need a human check are named. Staff can overrule the tool. Legal duties have been checked (GDPR, AI Act risk level).',
      warn: ['“The vendor handles compliance.”', 'No one has asked where guest data goes.'],
      check: 'Have you decided which of the tool’s outputs a person must check before they take effect?', rc: 'G3',
      ev: [['56.80% of EU accommodation businesses that had considered AI but did not use it named a lack of clarity about the legal consequences.', 'Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.']],
      act: 'Decide which outputs a person must check before they count, and make sure staff can overrule the tool.', who: 'Department head / GM' },
    { id: 'c8', name: 'Data and content',
      def: 'Correct, current, connected data and hotel content (facts, menus, policies, images) that the tool can use.',
      good: 'One fact source. Guest profiles not duplicated. A named person keeps content current.',
      warn: ['The chatbot gives last season’s opening hours.', 'Five profiles for one guest.'],
      check: 'Is there one up-to-date source for your hotel’s facts (rooms, services, prices, house rules) that the tool can use?', rc: 'D4',
      ev: [['34% of hotel company leaders named data quality as a barrier to getting value from AI.', 'State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.']],
      act: 'Make one up-to-date source for your hotel’s facts and name who keeps it current.', who: 'Department head' },
    { id: 'c9', name: 'Change management',
      def: 'A planned way of taking people from the old way of working to the new one: telling them why, training, listening, adjusting, and involving staff representatives where the law requires it.',
      good: 'Staff briefed before launch. A pilot with feedback. The works council told in time. A review date set.',
      warn: ['Launch by email.', 'No pilot.', 'Adoption measured only by logins.'],
      check: 'Is there a date, after launch, when you will ask staff what works and change the set-up?', rc: 'new',
      gloss: 'Staff representatives: a works council, staff committee or union delegates, where your hotel has them.',
      weak: 'Evidence here is thinner: one worldwide survey of 107 hotel company leaders (State of Hotel AI, Fall 2026) and one change-management consultancy’s survey across industries (Prosci); no European hotel survey yet.',
      ev: [['35% of hotel company leaders named change management as a barrier to getting value from AI, the most often cited.', 'State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.'],
           ['63% of organisations cite human factors as a primary challenge in AI implementation.', 'Prosci, a change-management consultancy, AI adoption (undated page, read 23 Nov 2026). Base: 1,107 professionals across several industries, not only hotels.']],
      act: 'Set a date after launch to ask staff what works, and tell staff representatives in time where you have them.', who: 'GM / HR' }
  ];

  /* Weakest-three ranking (research D): by answer No > Partly > Don't know yet > Planned; ties by this fixed order. */
  var ANSWER_RANK = { n: 0, p: 1, k: 2, pl: 3 };
  var TIE_ORDER = ['b1', 'b3', 'b5', 'b8', 'b9', 'b2', 'b6', 'b7', 'b10', 'b4', 'c3', 'c1', 'c2', 'c8', 'c7', 'c6', 'c5', 'c9', 'c4'];
  var KEY_NEEDS = ['b1', 'b3', 'b5', 'b8', 'b9'];
  var OVERALL = {
    close: 'Close these before you talk to vendors.',
    find: 'Find out these first.',
    good: 'Good starting point. Run the readiness check for the tool you choose.'
  };

  /* ---------- "Where this comes from" per step: opened sources only, with dates (research source table) ---------- */
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
    qNote: 'The five questions, the order of the outcomes and the examples are the project team’s, built from these sources on 23 Nov 2026. Question 1 asks whether the job needs AI; it is not a legal classification (the AI Act guide tab covers that).',
    where: [],
    whereNote: 'The departments and use cases come from the hub’s Use-Case Catalogue (the project team’s catalogue, read when this page was built). “How common” is the catalogue’s rating (High, Medium, Low, Very low), built from the sources listed there for each use case.',
    needs: [
      'Eurostat, Use of AI in enterprises, ICT usage survey of early 2025, dataset isoc_eb_ain2 (updated 15 Jun 2026; queried 23 Nov 2026).',
      'HES-SO Valais-Wallis, “How AI is (and isn’t) transforming European hospitality”, survey news (9 Jul 2025).',
      'State of Hotel AI, Fall 2026 (29 Sep 2026).',
      'OECD, AI adoption by small and medium-sized enterprises, G7 discussion paper (Dec 2025).',
      'EDPB, Guidelines 07/2020 on the concepts of controller and processor in the GDPR, version 2.1 (adopted 7 Jul 2021).',
      'European Commission, “Data Act explained” (page as of 23 Nov 2026).',
      'NIST, AI Risk Management Framework 1.0 (Jan 2023).',
      'GOV.UK, Assessing if artificial intelligence is the right solution (10 Jun 2019); UK AI Playbook (10 Feb 2025).'
    ],
    needsNote: 'Most self-check questions reuse the readiness check’s wording (rules v4). A few are new in the project’s research and have not been reviewed yet.',
    success: [
      'Britz & Schegg, From Awareness to Action: AI Readiness in Hotels, HES-SO Valais-Wallis (Oct 2025).',
      'OECD, The Adoption of Artificial Intelligence in Firms (May 2025).',
      'State of Hotel AI, Fall 2026 (29 Sep 2026).',
      'Eurostat, ICT usage survey of early 2025, dataset isoc_eb_ain2 (updated 15 Jun 2026; queried 23 Nov 2026).',
      'European Commission, AI literacy: Questions & Answers (page as of 23 Nov 2026).',
      'Schegg & Fux, Hotel Yearbook 2025 Technology Edition (23 Jun 2025).',
      'Prosci (a change-management consultancy), AI adoption (undated page, read 23 Nov 2026).',
      'NIST, AI Risk Management Framework 1.0 (Jan 2023); Google PAIR, People + AI Guidebook (read 23 Nov 2026); GOV.UK (10 Jun 2019).'
    ],
    successNote: 'Culture has the weakest evidence of the nine: no large European hotel survey measures it directly. Workflow and change management rest mainly on one worldwide survey of hotel leaders. On leadership the sources differ in emphasis, so both are shown.'
  };

  var HONEST = 'Nobody checks your answers. An answer that isn’t true only hides a problem you will meet later.';
  var AS_OF = '23 Nov 2026';
  /* v1.2: notices (clean-up M2, M3, L2) and the hand-over */
  var USE_CHANGED = 'The catalogue changed: please pick your use case again.';
  var NOT_SAVED = 'This browser is not keeping your answers. Use Copy summary, Print or Download before you close the page.';
  var NEWER = 'This was saved by a newer version of this page. Changes here are not kept.';

  root.R2Content = { QUESTIONS: QUESTIONS, Q_ANSWERS: Q_ANSWERS, STOP: STOP, VERDICT: VERDICT, ANSWERS: ANSWERS, NEEDS: NEEDS, FACTORS: FACTORS,
    ANSWER_RANK: ANSWER_RANK, TIE_ORDER: TIE_ORDER, KEY_NEEDS: KEY_NEEDS, OVERALL: OVERALL, SOURCES: SOURCES, HONEST: HONEST, AS_OF: AS_OF,
    USE_CHANGED: USE_CHANGED, NOT_SAVED: NOT_SAVED, NEWER: NEWER };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.R2Content;
})(typeof self !== 'undefined' ? self : globalThis);
