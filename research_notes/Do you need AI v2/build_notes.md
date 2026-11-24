# Do you need AI? v2: build notes (24 Nov 2026)

Built from the owner's flow of 24 Nov 2026. Not committed, not pushed, not published. Code: `tools/readiness-2/`. How to run and test: its `README.md`.

## 1. The five questions (C-R-I-S-P), as worded

| # | Title | Question | Status |
|---|---|---|---|
| 1 | Complex judgement | Is this task too varied for fixed rules (if this, then that)? | owner's proposal, kept |
| 2 | Return | Is this task frequent or costly enough to be worth improving? | owner-approved on 23 Nov, unchanged |
| 3 | Information ready | Is the information it needs digital and up to date? | owner's proposal, kept |
| 4 | Safety net | Can mistakes be caught before they harm anyone? | owner's proposal, kept |
| 5 | Proof | Can you name the number that should improve, and today’s figure? | owner's proposal, kept |

Answers Yes / No / Not sure. "Why this matters" is unchanged in structure and text. Q1 No stops with "This is not suitable for AI."; other No answers are carried to the result as conditions.

## 2. The ten must-haves and their evidence

Chosen from the workbook's Framework matrix and the six gates its README names (P1, F1, F2, T1, D5, O1). Order: the gates by share, then the others by share. The share is computed from the sheet at build time and shown to the hotel as "needed for n of 90 use cases in the team's resource analysis, Nov 2026 (… layer; team judgement, not a survey)". The sourced figures are those `research_notes/AI starting point/research.md` marks as opened.

1. **A named owner with time** (gate P1). Is there a named person in charge of this AI project, with agreed hours each week for it?
   - Workbook share: Named owner with time set aside: 90 of 90 (Foundation).
   - “Roles and responsibilities and lines of communication related to mapping, measuring, and managing AI risks are documented and are clear to individuals and teams throughout the organization.” Source: NIST AI Risk Management Framework 1.0, GOVERN 2.1 (Jan 2023).
2. **Budget for the full first year** (gate F1). Is there a written budget for the first 12 months that covers the full cost, not only the subscription?
   - Workbook share: Recurring subscription or usage budget: 77 of 90 (Common).
   - 40.95% of EU accommodation businesses that had considered AI but did not use it said the costs seem too high. Source: Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.
   - 35% of hotels named high set-up costs as a barrier. Source: HES-SO Valais-Wallis survey, news of 9 Jul 2025. Base: over 1,500 hotels in Austria, France, Germany, Greece, Italy and Switzerland, Jan–Apr 2025.
3. **A number to improve, approved** (gate F2, O1). Has the person who decides on spending approved the KPI this tool must improve, with today’s figure and the target?
   - Workbook share: KPI baseline and scale/stop rule: 58 of 90 (Common); Approved goal and clear approval path: 53 of 90 (Common).
   - “Lack of senior management buy-in in many companies also appears problematic.” Source: OECD, The Adoption of Artificial Intelligence in Firms, May 2025. Base: survey of 840 enterprises in G7 countries, 2022–23, plus interviews.
   - Only 14% of hotel company leaders credited executive mandates for their AI success, against 34% for experimentation: light written backing, not a top-down order. Source: State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.
4. **Systems that can connect** (gate T1). Can other software read from and write back to the systems you want to connect it to?
   - Workbook share: Two-way link to core systems (PMS, CRS, POS, accounting): 58 of 90 (Common).
   - 45.91% of EU accommodation businesses that had considered AI but did not use it named incompatibility with their existing equipment, software or systems as a reason. Source: Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.
   - 29% of hotel company leaders named systems integration as a barrier to getting value from AI. Source: State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.
5. **Data protection contact involved** (gate D5). Has your data protection contact been told about this plan?
   - Workbook share: Lawful basis and vendor data agreement: 22 of 90 (Specific to some archetypes).
   - 52.36% of EU accommodation businesses that had considered AI but did not use it named concerns about data protection and privacy. Source: Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.
   - “Such legal act must be in writing, including in electronic form.” (on the contract between a hotel and a vendor that processes its personal data) Source: EDPB Guidelines 07/2020 on the concepts of controller and processor, version 2.1.
6. **A person who checks the AI** (no gate). Is there a named person who will check the AI’s results and can overrule them?
   - Workbook share: Human reviewer who checks or overrides AI output: 59 of 90 (Common).
   - 56.80% of EU accommodation businesses that had considered AI but did not use it named a lack of clarity about the legal consequences. Source: Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.
7. **Data you can reach, kept right** (no gate). Do you have a system that holds each piece of data this tool needs, and a named person who keeps it right?
   - Workbook share: Historical operational data: 48 of 90 (Common); Curated knowledge and hotel content (FAQ, SOPs, menus, policies): 40 of 90 (Common).
   - 42.61% of EU accommodation businesses that had considered AI but did not use it named difficulties with the availability or quality of the data. Source: Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.
   - 42% of hotel company leaders were confident their data is ready for their AI goals; 48% were not. Source: State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.
8. **Staff told, and able to report errors** (no gate). Have the staff concerned been told about the plan, and do they know whom to tell when the tool gets something wrong?
   - Workbook share: Frontline adoption and change support: 35 of 90 (Specific to some archetypes).
   - 69.89% of EU accommodation businesses that had considered AI but did not use it named a lack of relevant expertise, the most common reason. Source: Eurostat, ICT usage survey, early 2025 (dataset isoc_eb_ain2). Base: EU accommodation enterprises with 10+ persons employed.
   - 35% of hotel company leaders named change management as a barrier to getting value from AI, the most often cited. Source: State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide, Aug–Sep 2026.
9. **Rules for staff on AI tools** (no gate). Do you have written rules telling staff what they must not type into AI tools?
   - Workbook share: AI-use policy and use-case risk review: 30 of 90 (Specific to some archetypes).
   - Only 9% of the hotels surveyed had a formal AI strategy document. Source: Britz & Schegg, From Awareness to Action: AI Readiness in Hotels, HES-SO Valais-Wallis, Oct 2025. Base: hoteliers surveyed Jul–Sep 2025, median 37.5 rooms; the authors warn the sample is likely more digitally aware than average.
10. **A way to work when the tool is down** (no gate). If the tool stops working for a day, is there a written way to do the job without it?
   - Workbook share: Fallback if the tool or vendor fails: 30 of 90 (Specific to some archetypes).
   - “Contingency processes are in place to handle failures or incidents in third-party data or AI systems deemed to be high-risk.” Source: NIST AI Risk Management Framework 1.0, GOVERN 6.2 (Jan 2023).

**To note honestly:** items 5, 8, 9 and 10 rest on blocks the matrix puts in its "specific" layer (22, 35, 30 and 30 of 90). Item 5 is a D6 gate. Items 8, 9 and 10 are in because the owner's brief named them and the sourced research supports them, not because of their share. Three "common" blocks with higher shares are **not** must-haves: operating rules and hand-offs (72 of 90), specialist skills (70 of 90), vendor evaluation (64 of 90); the tailored questions cover them per use case. See open decision 1.

## 3. Score and verdict

One constants block, `T` in `tools/readiness-2/src/logic.js`.

- Points: Yes 2, Planned 1, Partly 1, No 0. "Don't know yet": left out of the points, counted, shown. "Doesn't apply" (tailored questions only): left out altogether.
- Score = points earned ÷ points possible over must-haves + tailored questions, **rounded down**. Shown as "72% ready" with, next to it, "from 14 of 18 questions you could answer; self-reported; cut-offs are the team’s judgement, not tested with hotels".
- Verdict, checked in this order:
  1. **Not enough information yet**: more than half the questions are "Don't know yet".
  2. **Not ready yet**: any must-have at No, or a score below 50%.
  3. **Ready to start a pilot**: every must-have Yes, and 75% or more, and fewer than a quarter of the questions unknown.
  4. **Almost ready**: everything else (50 to 74%; or a must-have not Yes but none at No; or 75%+ with a quarter or more unknown).
- Areas in words: Strong 75%+, Gaps to close 50 to 74%, Weak below 50%, Too little to say (nothing known).
- "How this was worked out" on the result lists the points, the count of known answers, the total, one line per area (must-haves + six areas), the cut-offs and the reason for the verdict.

## 4. How the tailored questions are generated

`tools/readiness-2/data/build-questions.mjs`, from `excel-rows.json` (the workbook, extracted by `extract-excel.py`), the catalogue (ids) and, for the 8 use cases the workbook lacks, the draft rows in `tools/readiness/index.html`.

1. Each of the six cells is split at semicolons into items; "see D7", article numbers and "(often missing)" are removed; "—" is empty.
2. One question per cell with content. The frame depends on the area and on the kind of phrase:
   - People: "Is it agreed that the … ?" (a sentence), "Will the … be in charge of this tool?" (a role), "Will the … use this tool, and have they been shown how?" (users).
   - Skills: "Can the people involved … ?" (something to do), "Do the people involved know enough about … ?" / "… have … ?".
   - Financial investment: "Do you know what this will cost your hotel: … ?", or "Have you checked whether you already pay for this (the team’s note: …)?".
   - Technology: "Is this in place, or confirmed as possible: … ?"; "None" → "Is it confirmed that this works without a link to your hotel systems?".
   - Data: "Is this data ready, digital and up to date: … ?".
   - Organisation & governance: "Is this in place and written down: … ?", "Has this been done: … ?" (a step), "Has a named person checked what the law asks here: … ?" (a legal signpost, never stated as law).
3. A cell becomes two questions only when its one question would pass 30 words, when its items need different frames, or to reach six questions. An empty organisation cell gets the question for the type of tool (archetype).
4. Add-ons from the archetype sheet: sensitive personal data → the Readiness check's neutral DPIA question with the answer "Checked: not required (confirmed in writing)"; payment data → card-data security check; hardware → capital budget approved; acts without sign-off → written limits and who can switch it off.
5. Checker (`check-questions.mjs`): 6 to 10 questions, at most 30 words, question mark, no semicolon, no duplicate, no legal reference, every workbook cell asked, file equals the generator's output. Result: **99 use cases, 661 questions, 6 to 9 each, 0 flagged**. Hand edits only in `overrides.json`: **16**, each with its reason.
6. Under each question the fold shows the area, the workbook cell it came from, the type of tool, the resource intensity with the README's definition (labelled team judgement) and the evidence line: the D6 evidence-pack row ids where the workbook gives them, "team judgement from the catalogue description" where it gives "—", or the draft note. The evidence pack is not in the repo and none of its content is shown.

Use cases without a workbook row (drafts, marked "Draft questions: team to review"): rm-9, fo-6, fo-7, fo-8, hk-7, kc-6, hr-6, gm-7.

### Three full examples

**gx-2 AI chat and messaging assistant, pre-booking and in-stay (web, WhatsApp, OTA inbox; multilingual)** (Moderate, A2, add-ons: auto)

| Area | Workbook cell | Question |
|---|---|---|
| People | Guest-service lead monitors conversations; staff take over hand-offs | Is it agreed that the guest-service lead monitors conversations, and staff take over hand-offs? |
| Skills | Maintain knowledge base; review transcripts | Can the people involved maintain knowledge base and review transcripts? |
| Financial investment | Subscription per property or per conversation | Do you know what this will cost your hotel: subscription per property or per conversation? |
| Technology infrastructure | Messaging channels plus PMS link for bookings and requests | Is this in place, or confirmed as possible: messaging channels plus PMS link for bookings and requests? |
| Data | Complete, current hotel FAQ and policies; conversation logs | Is this data ready, digital and up to date: complete, current hotel FAQ and policies, and also conversation logs? |
| Organisation & governance | Tell guests they are dealing with AI | Has this been done: tell guests they are dealing with AI? |
| Organisation & governance | hand-off rules | Is this in place and written down: hand-off rules? |
| Organisation & governance | (addon) | Are there written limits on what the tool may do by itself, and a named person who can switch it off? |

**hr-2 AI recruiting (conversational hiring, screening, matching)** (Heavy, A9, add-ons: sens)

| Area | Workbook cell | Question |
|---|---|---|
| People | HR manager reviews every decision | Is it agreed that the HR manager reviews every decision? |
| Skills | Fair-hiring practice; check AI screening | Do the people involved know enough about fair-hiring practice, and can they check AI screening? |
| Financial investment | Subscription per hire or per seat | Do you know what this will cost your hotel: subscription per hire or per seat? |
| Technology infrastructure | Careers site, applicant tracking system | Is this in place, or confirmed as possible: careers site, applicant tracking system? |
| Data | Job descriptions; candidate data | Is this data ready, digital and up to date: job descriptions and candidate data? |
| Organisation & governance | High-risk AI under the EU AI Act (employment) – human oversight, DPIA | Has a named person checked what the EU AI Act asks of hotels that use AI in hiring, including human oversight? *(hand edit)* |
| Organisation & governance | (addon) | Has a data protection impact assessment (DPIA) been done for this tool? |

**fo-8 Lost-and-found logging and guest claim matching** (Light, A5, add-ons: none, DRAFT row)

| Area | Workbook cell | Question |
|---|---|---|
| People | Front-office or housekeeping supervisor owns the found-items log | Is it agreed that the front-office or housekeeping supervisor owns the found-items log? |
| Skills | Photograph and log items in the app; check the suggested description and any match before an item is released | Can the people involved photograph and log items in the app, and also check the suggested description and any match before an item is released? |
| Financial investment | Subscription per property or a fee on return shipping, depending on the vendor | Do you know what this will cost your hotel: subscription per property or a fee on return shipping, depending on the vendor? |
| Technology infrastructure | Staff phones or tablets; optional link to the PMS | Is this in place, or confirmed as possible: staff phones or tablets, and also optional link to the PMS? |
| Data | Photos of found items with place and time; guest claims with name, address and stay | Is this data ready, digital and up to date: photos of found items with place and time, and also guest claims with name, address and stay? |
| Organisation & governance | Retention period for photos and claims; who confirms a match and releases the item; data-processing agreement with the vendor | Is this in place and written down: retention period for photos and claims, also who confirms a match and releases the item, and also data-processing agreement with the vendor? |

**Limit:** the questions are framed, not rewritten. "Is this in place and written down: hand-off rules?" is plainer than a hand-written sentence would be, but it cannot misstate the cell. A wording pass with the team is open decision 3.

## 5. Merged from the Readiness check

Hotel form and its lists (types, roles, 27 EU countries + CH, UK, Other); shared profile read and write; the answer scale with "Planned, not done yet" and "By when?"; must-haves that all need an answer; KPI wording (O1); roles and their order for the action plan, with "Finish: … (planned by …)" and "Find out: …"; vendor questions (`vendorQs`, called from its own `logic.js`); the provisional AI Act label and items to check (`legal`, same AI Register inputs and v4 cuts: `tests/build.test.mjs` proves the output is identical for all 98 tools and 5 country types); Your checks with remove-confirm; file save and open; PDF; "since last time"; opt-in sharing through its `store.js` and the hub db bridge; Add to the AI Register.

## 6. Not built, or built differently

- **"Update open items"** (the Readiness check's review screen): not built. Answers are changed by going Back.
- **Notes on must-haves** ("Where is this written down?") and "Yes, note missing": not carried over. A must-have at Yes counts as in place.
- **"Who can answer?" per question** and the stage (looking / talking to a vendor / about to sign / in use): not carried over. Each question has one usual role.
- **The Readiness check's tool search** ("chatbot", "rota"): not carried over; the use case is picked through area › department.
- **Note for the owner, next-look date**: not carried over.
- **Old step 2 and 3** (10 prerequisites, 9 success factors): replaced by the ten must-haves. Not asked any more: older systems, internet and devices, vendor security check, exit and data return, trial stop rule, workflow written down, demo for staff, review date after launch. Several return per use case in the tailored questions.
- **Team sharing: built** and on (`SHARING_ON = true` in `src/app.js`). The Team tab lists and recomputes both kinds of copy. Its "Where the data goes" card still describes the old check's rules only. Tested locally (test copy in the browser); the claude.ai database path is the Readiness check's own code and was not exercised here.
- **AI Act guide**: no edit needed (it does not name the Readiness check in its screens). **AI Register**: one link label and its stand-alone target changed.

## 7. Open decisions for the owner

1. **Which ten must-haves.** Keep the brief's list (current), or swap staff / AI rules / fallback (30 to 35 of 90) for the higher-share blocks: written operating rules (72), specialist skills (70), testing the vendor's claims on your own data (64)?
2. **Order of the verdict rules.** "Not enough information yet" is checked before "a must-have at No". A check with one No and mostly unknowns therefore reads "Not enough information yet". Reverse it?
3. **Wording of the tailored questions.** Accept the framed style, or have the team rewrite them (through `overrides.json`, or by improving the workbook cells, which is cleaner)?
4. **Cut-offs** 75 / 50 / a quarter / a half, and rounding down: confirm, and test with hotels.
5. **"Doesn't apply"** is offered on tailored questions (not on must-haves, not as such on the DPIA question). Keep?
6. **The 8 draft use cases**: add rows to the workbook so the draft mark can go.
7. **Sharing**: who is responsible for shared data, a deletion date and a contact are still not named (same gap as the Readiness check). Leave on?
8. **Name of the top verdict**: "Ready to start a pilot" (brief) replaces the Readiness check's interim "No blocker found: you can start a pilot". Confirm.
9. **Legal sign-off** (D7 owner, lawyer) for the provisional label and the legal-signpost questions; a test with real managers; publishing the hub.
