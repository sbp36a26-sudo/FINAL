# Hotel and in-hotel F&B AI use cases against the EU AI Act: coverage audit of the team's catalogue, booklet and explorer data

State as of 17 Nov 2026. High-risk dates used throughout: 2 Dec 2027 (Annex III) and 2 Aug 2028 (Annex I), per Art. 113 as amended by Regulation (EU) 2026/1744.

**Source keys (all local unless a web URL is given)**

- [BOOK] = `/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf` (26 pp., read in full via `pdftotext -layout`)
- [CAT] = `/home/user/final/tools/use-case-catalogue/index.html` (`<script id="data">`: 15 departments, 91 uses, 152 vendors, 41 hotel groups)
- [ACT-DATA] = `/home/user/final/tools/ai-act-explorer/ai-act-data.json` (v1.1, updated 13 Nov 2026)
- [RDY] = `/home/user/final/tools/readiness/index.html` (`<script id="rdy">`, `uc` array of 91, `arch`, `addons`)
- [AIA] = Regulation (EU) 2024/1689, `/home/user/final/tools/ai-act-explorer/EU AI Act June 2024.pdf`, http://data.europa.eu/eli/reg/2024/1689/oj
- [OMNI] = Regulation (EU) 2026/1744, `/home/user/final/tools/ai-act-explorer/Digital Omnibus July 2026.pdf`, http://data.europa.eu/eli/reg/2026/1744/oj

**Marking used on every statement**: (text) = read by me in [AIA] or [OMNI]; (team data) = stated in [BOOK], [CAT], [ACT-DATA] or [RDY]; (secondary) = web search summary, trade press or vendor page, not opened in full (the session blocks most page fetches); (my inference) = my own reading.

**Important limit.** I did not read the Commission's draft high-risk classification guidelines (19 May 2026), the final Article 50 guidelines (C(2026) 7702, 5 Nov 2026) or the final prohibited-practices guidelines (C(2025) 5052) directly. They are not in the repo. Every paragraph number for them below is quoted from [ACT-DATA] and is therefore (team data), not verified by me.

Use-case ids: I number the 91 uses 1–91 in catalogue order and give the readiness-tool id in brackets where useful (e.g. #72 = `hr-1`). Department codes: rm 1–8, res 9–16, sm 17–23, fo 24–28, gx 29–34, fb 35–40, hk 41–46, me 47–53, kc 54–58, pr 59–64, fa 65–71, hr 72–76, gm 77–82, it 83–87, lg 88–91.

---

## 1. Which AI Act label does the booklet give each of the 91 use cases, and is the label stored as data?

### Takeaway
The label exists only as prose in [BOOK] (A6 table and Part C tables); none of the three data files carries a per-use label, so the sibling note's claim is confirmed. Reconstructing it gives 3 high-risk, 13 "high-risk if…", 11 transparency and about 64 minimal-by-default uses, of which 46 are never named in the booklet at all and get their label only from the sentence "Everything not listed is minimal".

### Cited Findings

**Is the label stored as data?**

- [CAT] use objects have exactly five fields: `n`, `task`, `ai`, `use`, `srcs`. No AI Act field. The per-department `tags` strings (e.g. `"s a a s s s n s"`) are a display tag for the catalogue table, not an AI Act label (team data) — [CAT](/home/user/final/tools/use-case-catalogue/index.html)
- [RDY] `uc` entries carry `id`, `int`, `arch`, `add`, `r`. The only AI Act trace is archetype A9 "Decisions about people and identity", whose risk text reads "high-risk uses under the EU AI Act (to confirm in D7)", and the `sens` add-on (team data) — [RDY](/home/user/final/tools/readiness/index.html)
- [ACT-DATA] holds a tier for 13 scenarios (D1–D7, P1–P6) only, not for the 91 uses; no id links a scenario to a catalogue use (team data) — [ACT-DATA](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- [BOOK] A6 states the source as "our classification of the 91 uses against the AI Act and the Commission's guidelines" and gives only counts and a department table (team data) — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf)
- The sibling note `research_notes/Hotel AI register design/build_plan_existing_data.md` (Q2) reaches the same conclusion (team data) — [note](/home/user/final/research_notes/Hotel%20AI%20register%20design/build_plan_existing_data.md)

**Reconstruction of the A6 counts (my mapping; the booklet does not list ids)**

- High-risk, 3: #73 recruiting, #76 seasonal staff matching, #16 call scoring (team data, [BOOK] A2, A6, C1, C3).
- "High-risk if…", 13: #72, #74, #75 (HR); #9 (commercial); #46, #45, #34 (rooms); #54 (F&B); #86 (security); #77 (general management); #51, #52, #62 (maintenance, procurement). This is the only assignment that reproduces "13" and "11 of those 16 concern staff … in six departments" (staff ones: 73, 76, 16, 72, 74, 75, 46, 45, 54, 77, 62; departments hr, res, hk, kc, gm, pr) (my inference from [BOOK] A6).
- Transparency, 11: #73 (hiring chatbot), #9, #12, #20, #17, #30, #33, #34, #36, #40, #39 (my inference from [BOOK] A6 last column; count matches).
- "Can become prohibited", 5: the A6 column names four things (#73 emotions in video interviews; #74 coaching or wellbeing tools; #16 agents' emotions; #86 cameras reading staff emotions). The fifth is most likely #75 (C1: "prohibited if it infers wellbeing from face or voice"), but could instead be #2 (C3: exploitative pricing "would be prohibited (our reading)"). The booklet does not let a reader tell which (my inference).

**Full table.** "Where" = where the booklet states the label. "Default" = not named anywhere; label comes only from A6 "Everything not listed is minimal". "Rests on": T = law text ([AIA]/[OMNI]); F = final Commission guidance; D = draft classification guidelines; R = the team's own reading. All label cells are (team data); the "Rests on" column and the "My check" column are (my inference) unless marked.

| # | Dept | Use case (short) | Booklet label | Where | Condition that changes it (booklet) | Provision relied on | Rests on | My check |
|---|---|---|---|---|---|---|---|---|
| 1 | rm | Demand forecasting | Minimal | A2, C3 | none | not in Annex III | T | Sound |
| 2 | rm | Dynamic pricing, autopilot | Minimal | A2, C3 | Prohibited if designed to exploit age, disability or financial situation with significant harm | Art. 5(1)(b); [Consumer], [Competition], [GDPR] tags | T + R | Sound; see Q2 for nuance |
| 3 | rm | Rate shopping | Minimal | C3 | none ([Competition]) | — | T | Sound |
| 4 | rm | GenAI RM copilot | Minimal | Default | — | — | R | Sound (staff tool) |
| 5 | rm | Agentic RM | Minimal | Default (B2: agents judged as a whole) | — | draft para 75, 90 via [ACT-DATA] g4 | D | Sound |
| 6 | rm | Revenue/budget forecasting | Minimal | Default ("forecasting") | — | — | T | Sound |
| 7 | rm | Upsell price optimisation | Minimal | Default | none stated | — | R | Art. 5 switch of #2 applies equally; not stated |
| 8 | rm | Spa yield and pricing | Minimal | Default | — | — | R | Sound |
| 9 | res | Voice agents (reservations, front desk) | Transparency | A6, C3 | High-risk if reads callers' emotions or recognises them by voiceprint without active involvement | Art. 50(1); Annex III 1(c), 1(a) | T (emotion limb), D (voiceprint limb), F (notice) | Sound; Art. 50(3) notice missing from the row |
| 10 | res | Email and offer handling with LLMs | Minimal | Default | — | — | R | Doubtful where it replies or books without human review (Art. 50(1)) |
| 11 | res | Channel management | Minimal | Default | — | — | R | Sound |
| 12 | res | Booking-engine assistant | Transparency | A6, C3 | none | Art. 50(1) | T + F | Sound |
| 13 | res | Cancellation/no-show prediction, overbooking | Minimal | Default | — | — | R | Sound at aggregate; per-guest scoring is GDPR profiling |
| 14 | res | Group rooming lists | Minimal | Default | — | — | R | Sound |
| 15 | res | Bookable hotel apps in AI assistants | Minimal | Default | — | — | R | Not analysed; see Q3 (agents) |
| 16 | res | AI call scoring of reservation agents | High-risk | A2, A6, C3 | Prohibited if it reads agents' emotions from voice | Annex III 4(b); Art. 5(1)(f) | T | Sound; guest side (1(c)) not stated |
| 17 | sm | GenAI marketing text | Minimal | C3 | Transparency for health, safety or sustainability claims published without human review | Art. 50(4) second subpara | F (the "claims" reading is the guidelines', not the text) | Sound as team data; rests on guidance |
| 18 | sm | Group/MICE enquiry and proposals | Minimal | Default | — | — | R | Has voice agents: Art. 50(1) missing |
| 19 | sm | CRM segmentation, loyalty, campaigns | Minimal | Default ("campaigns"); C3 ALSO [GDPR] | — | — | R | "Agents answer replies" needs Art. 50(1) |
| 20 | sm | GenAI imagery and video | Transparency if realistic and could mislead | A6, C3 | none (minor edits need no label) | Art. 50(4), Art. 3(60) | T + F | Sound |
| 21 | sm | Paid media optimisation | Minimal | Default | — | — | R | High-risk if the same tool places targeted job ads (Annex III 4(a) text) |
| 22 | sm | SEO / AI-search visibility | Minimal | Default | — | — | R | Sound |
| 23 | sm | Lead scoring (B2B) | Minimal | Default | — | — | R | Sound (companies); lead-qualification calls need Art. 50(1) |
| 24 | fo | Digital check-in with ID capture | Minimal | C2 | none ([GDPR] retention) | — | R | Sound; see Q2 (police registration) |
| 25 | fo | AI room assignment (guest rooms) | Minimal (if by room status and availability) | C2 row "Room assignment and cleaning plans" | High-risk if it ranks attendants | — | R | Row conflates #25 (guests) with #46 (staff) |
| 26 | fo | Face verification 1:1 at check-in | Outside the high-risk list (draft guidance) | A2, C2 | none | Annex III 1(a) second sentence | T (booklet says D) | Under-claimed: the exclusion is in the text |
| 27 | fo | Front-desk copilots, PMS agents | Minimal | Default | — | — | R | Sound |
| 28 | fo | Upsell at check-in | Minimal | Default | — | — | R | Sound; same Art. 5 caveat as #2 |
| 29 | gx | Review and feedback analysis | Minimal | A2, C2, B3 | none | Art. 3(39) | T | Sound for text; two unstated switches (Q2) |
| 30 | gx | Chat and messaging assistant | Transparency | A6, C2 | none | Art. 50(1) | T + F | Sound |
| 31 | gx | GenAI review response | Minimal | Default; [Consumer] fake reviews | — | — | R | Sound (staff approve) |
| 32 | gx | Personalisation from guest profile | Minimal | Default; A8 [GDPR] | — | — | R | Sound |
| 33 | gx | In-stay digital concierge | Transparency | A6, C2 | none | Art. 50(1) | T + F | Sound |
| 34 | gx | In-room voice assistant | Transparency | A6, C2 | High-risk if it reads guests' emotions from voice | Art. 50(1); Annex III 1(c) | T | Sound |
| 35 | fb | Event and banqueting sales AI | Minimal | Default | — | — | R | Sound |
| 36 | fb | In-room dining/outlet ordering by chat or voice | Transparency | A6, C4 | none | Art. 50(1) | T + F | Sound |
| 37 | fb | Menu engineering, F&B pricing | Minimal | C4 | none | — | R | Sound |
| 38 | fb | QR/mobile ordering with AI upsell | Minimal | C4 ("menu pricing") | none | — | R | Sound; alcohol/minors caveat (Q2) |
| 39 | fb | Delivery and service robots | Transparency if not obviously a machine | A6, C4 | none | Art. 50(1) | T + F | Machinery route not mentioned (Q2) |
| 40 | fb | Table reservations: voice AI, table management | Transparency | A6, C4 | none | Art. 50(1) | T + F | Sound |
| 41 | hk | Multilingual task capture, staff messaging | Minimal | Default | — | — | R | Sound unless logs are used per attendant |
| 42 | hk | Cleaning robots | Minimal for the hotel; ask the maker | C4 row | gas-appliance sentence does not fit robots | Annex I | R | Wrong product law cited for robots (Q2) |
| 43 | hk | Linen forecasting, RFID | Minimal (may not be AI) | A2 "Is it even AI?" | — | Art. 3(1) | R | Sound |
| 44 | hk | Occupancy-sensor cleaning | Minimal | Default | — | — | R | Mostly not AI per [CAT] |
| 45 | hk | Room inspection with computer vision | Minimal if findings go only to the attendant | A6, C2 | High-risk if used to judge individual attendants | Annex III 4(b); draft paras 277–278 | D | Sound; rests on draft narrowing |
| 46 | hk | Cleaning prioritisation and assignment | Minimal if by room status and availability | A6, C2 | High-risk if it ranks attendants by speed or ratings, or reports rooms per hour per attendant | Annex III 4(b); draft paras 271–275 | D | Sound; rests on draft narrowing |
| 47 | me | HVAC/BMS optimisation | Minimal | C6 | High-risk only if failure would endanger people | Art. 6(1a), 6(1b) | T | Sound |
| 48 | me | Work-order triage | Minimal | Default | — | — | R | Sound |
| 49 | me | Digital twins | Minimal | Default | — | — | R | Sound |
| 50 | me | Guest-room energy management | Minimal | Default ("energy") | — | Art. 6(1a) | T | Sound; mostly not AI |
| 51 | me | Predictive maintenance, OEM lifts/doors | High-risk if… (lift door and obstacle AI; the lift maker's duty) | A6, C6 | — | Art. 6(1), Annex I A (lifts) | D + T | Stretch: A6 entry describes a different function from the catalogue use (Q2) |
| 52 | me | Predictive maintenance, hotel-run | High-risk if… (hotel-run safety AI for gas or pressure equipment, rare) | A6, C6 | — | Art. 6(1), Annex I A | D + R | Same stretch; catalogue says "announced only" |
| 53 | me | Water-leak detection | Minimal | Default | — | — | R | Sound |
| 54 | kc | Food-waste cameras | Minimal | A6, C4 | High-risk if footage or logs are used to rate individual cooks | Annex III 4(b); draft paras 274–278 | D | Sound |
| 55 | kc | Allergen handling and menu labelling | Minimal | C4 ("recipe tools"); [Liability] | none | — | R | Sound; allergen law not cited (Q5) |
| 56 | kc | Smart ovens | Minimal for the hotel; ask the maker | C4 | gas-appliance safety component from 2 Aug 2028 | Art. 6(1), Annex I A pt 10 | T + D | Sound |
| 57 | kc | Production and covers forecasting | Minimal | C4 | none | — | R | Sound |
| 58 | kc | Recipe and menu generation | Minimal | C4 | none | — | R | Sound |
| 59 | pr | Purchase recommendations | Minimal | Default | — | — | R | Sound |
| 60 | pr | Demand and inventory forecasting | Minimal | Default | — | — | R | Sound |
| 61 | pr | Invoice-to-PO matching | Minimal / may not be AI | A2, C6 | — | Art. 3(1) | R | Sound |
| 62 | pr | Spend analytics, shrink detection | High-risk if… alerts are used to judge individual staff | A6, C6 | — | Annex III 4(b); draft para 277 | D | Sound; rests on draft |
| 63 | pr | Supplier price comparison | Minimal | Default | — | — | R | Sound |
| 64 | pr | Supplier price forecasting | Minimal | Default | — | — | R | Sound |
| 65 | fa | AP invoice capture | Minimal | Default ("invoices") | — | — | R | Sound |
| 66 | fa | Payment fraud detection | Minimal | C5, C6 | "Fraud detection is excluded from the credit-scoring category" | Annex III 5(b) exception | T | Reasoning is beside the point (Q2) |
| 67 | fa | Reconciliation | Minimal / may not be AI | A2, C6 | — | — | R | Sound |
| 68 | fa | Cash-flow and P&L forecasting | Minimal | Default | — | — | R | Sound |
| 69 | fa | Finance copilots, AP agents | Minimal | Default | — | — | R | Sound |
| 70 | fa | Night audit automation | Minimal / may not be AI | A2, C6 | — | — | R | Sound |
| 71 | fa | Chargeback dispute automation | Minimal | C6 [Cyber/PCI] | — | — | R | Sound |
| 72 | hr | Labour forecasting and scheduling | Minimal if it forecasts demand or allocates on stated availability | A2, A6, C1 | High-risk if it ranks staff on punctuality, reliability or ratings, or significantly changes regular working hours or decides leave | Annex III 4(b); draft paras 259, 262, 270–272 | D | The minimal half is a draft narrowing of a broad text (Q2) |
| 73 | hr | AI recruiting | High-risk (+ transparency for the chatbot) | A2, A6, C1 | Prohibited if it reads candidates' emotions | Annex III 4(a); Art. 50(1); Art. 5(1)(f) | T | Sound; slightly over-inclusive for pure scheduling bots |
| 74 | hr | Onboarding, training, AI coaching | Minimal | A6, C1 | High-risk if assessments decide pay, promotion or continued employment; prohibited if the coach reads emotions and results reach HR | Annex III 4(b); draft para 261; Art. 5(1)(f) | D + F | Second high-risk route missed (Q2) |
| 75 | hr | Attrition prediction | Minimal as a forecast | A6, C1 | High-risk if used to decide renewals, promotions or dismissals; prohibited if it infers wellbeing from face or voice | Annex III 4(b); draft para 264 | D | "Minimal" is over-confident for individual-level scores (Q2) |
| 76 | hr | Seasonal staff matching | High-risk (our reading) | A2, A6, C1 | none | Annex III 4(a) or 4(b), not stated which | R | Plausible but unconditional label conflicts with #72 logic (Q2) |
| 77 | gm | BI and KPI dashboards | Minimal | A6 | High-risk if dashboards rank individual staff | Annex III 4(b) | T + D | Sound |
| 78 | gm | GenAI copilots for managers | Minimal | Default; "Start here" 2 | High-risk and maker role if used to rank applicants or judge staff | Art. 25(1)(c) | T + R | Sound |
| 79 | gm | Meeting and briefing automation | Minimal | Default ("reporting") | — | — | R | Sound unless sentiment features on staff (Q4) |
| 80 | gm | Enterprise AI and data platforms | Minimal | Default; B2 maker route | — | Art. 25, Art. 3(3) | R | Sound |
| 81 | gm | Owner reporting | Minimal | Default | — | — | R | Sound |
| 82 | gm | Frontline staff knowledge assistant | Minimal | Default | — | Art. 50(1) "obvious" exception (final guidelines para 45 via [ACT-DATA] t5) | F | Sound |
| 83 | it | Threat detection, autonomous response | Minimal | C5 | none in the table; ALSO: "tools that scan staff email are staff monitoring too (our reading)" | recital 54 last sentence; draft para 277 | T + D | Switch exists but is not in the label table (Q4) |
| 84 | it | AI IT service desk | Minimal | C5 | none | — | R | Doubtful: catalogue lists "sentiment, speech analytics" on staff calls (Q2) |
| 85 | it | Booking fraud detection | Minimal | C5 | same fraud sentence | Annex III 5(b) exception | T | As #66 |
| 86 | it | Physical security video analytics | Minimal for intrusion, objects, occupancy | A6, C5 | High-risk if it recognises guests at a distance or reads crowd mood; prohibited if it reads staff emotions or infers sensitive traits | Annex III 1(a), 1(c); Art. 5(1)(f), (g) | T + D | "Loitering" and behaviour analytics untested (Q2) |
| 87 | it | Network AIOps | Minimal | Default | — | — | R | Sound |
| 88 | lg | ESG / carbon reporting | Minimal | Default | none | — | R | Art. 50(4) text duty on published AI-written sustainability reports not carried over from #17 |
| 89 | lg | GDPR and AI Act compliance tooling | Minimal | Default | — | — | R | Mostly not AI per [CAT] |
| 90 | lg | GenAI contract review | Minimal | C6 | none (use approved tools) | — | R | Sound |
| 91 | lg | AI use policies and governance | Not an AI tool | — | — | — | — | Counted among the 91 although [CAT] says "Not an AI tool" |

- Law-text anchors I verified: Art. 5(1)(a)–(g); Annex III points 1, 3, 4, 5 verbatim; Art. 6(3)–(4) including "shall always be considered to be high-risk where the AI system performs profiling of natural persons"; Art. 50(1)–(5); Art. 3(39)–(44); recitals 17, 18, 44, 54, 57, 58 (text) — [AIA](http://data.europa.eu/eli/reg/2024/1689/oj)
- Omnibus anchors I verified: new Art. 6(1a)–(1c) (non-safety user assistance, performance optimisation, service efficiency, automation, convenience, quality control are not safety components unless failure endangers health and safety); Art. 113 third paragraph point (c) dates 2 Dec 2027 and 2 Aug 2028; Annex I Section A point 1 (machinery) deleted and Machinery Regulation (EU) 2023/1230 added as Section B point 21; Art. 2(2) limits Section B products to Art. 6(1), 60a and 102–112; new Art. 5(1)(ba), (bb) from 2 Dec 2026; Annex III itself is not amended (text) — [OMNI](http://data.europa.eu/eli/reg/2026/1744/oj)

### Inferences
- 46 of the 91 uses are labelled only by the default sentence. For a register or tool, each needs an explicit record, because several of them have a switch the booklet never states (#7, #10, #18, #19, #21, #23, #84, #88).
- Only four of the conditional labels rest on law text alone (#9 emotion limb, #34, #47, #77). The other "high-risk if…" entries (#45, #46, #54, #62, #72, #74, #75, and the voiceprint limb of #9) depend on the draft classification guidelines, which [ACT-DATA] says are due final "by the end of 2026" and "may slip". [BOOK] flags this in A6 and in "What is still moving".
- Use #91 is not an AI system, so the denominator for any "share of uses" statistic is really 90, and several more (#43, #44, #50, #61, #67, #70, #89) are described by [CAT] as rules-based or "NOT AI". A statistic such as "16 of 91" should say so.

### Gaps
- I could not confirm which use the booklet counts as the fifth "can become prohibited" use; the team should record it.
- The paragraph numbers of the draft and final Commission guidelines are taken from [ACT-DATA]; the PDFs are not in the repo ("Local copies sit in the EU AI Governance folder" per [ACT-DATA]).

---

## 2. Which labels are doubtful when tested against the text?

### Takeaway
No label is plainly wrong on the law, but one is under-claimed (face check-in is excluded by the text, not only by draft guidance), four are over-confident (#75 attrition, #76 seasonal matching, the "minimal" half of #72/#46, and the explorer's "settled" on exploitative pricing), two A6 entries do not match the catalogue use they stand for (#51, #52), and the booklet is silent on social scoring, crime-risk profiling, biometric categorisation notices, machinery, toys, medical devices and vocational training.

### Cited Findings

**A. Under-claimed**

- Face check-in (#26). [BOOK] A2 and C2 say "Outside the high-risk list (draft guidance)". Annex III 1(a) itself says remote biometric identification "shall not include AI systems intended to be used for biometric verification the sole purpose of which is to confirm that a specific natural person is the person he or she claims to be", and recitals 17 and 54 add "to confirm the identity of a natural person for the sole purpose of having access to a service, unlocking a device or having security access to premises" (text) — [AIA](http://data.europa.eu/eli/reg/2024/1689/oj). The core label is law text; only the edge cases (one-to-many matching against a list of registered guests, encrypted databases) rest on draft paras 136–140 (team data) — [ACT-DATA](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- The [ACT-DATA] wizard marks the same choice `confidence: "contested"` and tier "minimal", a third wording for one use (team data) — [ACT-DATA](/home/user/final/tools/ai-act-explorer/ai-act-data.json)

**B. Over-confident**

- Attrition prediction (#75), "Minimal as a forecast". Annex III 4(b) covers systems intended "to monitor and evaluate the performance and behaviour of persons in such relationships" (text) — [AIA](http://data.europa.eu/eli/reg/2024/1689/oj). [CAT] describes the use as "Predict which staff are likely to leave", i.e. a score per person (team data). A per-person leave-risk score shown to managers is an evaluation of individual behaviour and is profiling, which removes the Art. 6(3) filter (my inference). "Minimal" is safe only for team-level or anonymous forecasts; the booklet should say so.
- Seasonal staff matching (#76), "High-risk (our reading)" with no condition. [CAT]: ML proposes "which seasonal staff go to which property, from skills, languages and availability; people validate the choice" (team data). Two readings are possible: selection of people for a season (Annex III 4(a) "recruitment or selection") or task allocation (4(b)). Under the draft guidelines as reported in [ACT-DATA] e9, allocation on "availability indicated by workers, a required accreditation, geographical proximity" is outside the task-allocation limb, and such criteria "cannot be proxies for nationality or ethnicity" (team data). So the same logic that makes rotas "minimal if by availability" could apply here, while "languages" is exactly the kind of criterion that can proxy nationality. The label is defensible but belongs in "high-risk if…" with the criteria named, or the booklet should say it is treated as selection under 4(a) (my inference). "People validate the choice" does not help: human sign-off does not change classification (draft paras 70, 72, 258 via [ACT-DATA] g1, e2) (team data).
- Rotas and cleaning plans (#72, #46), "Minimal if it forecasts demand or allocates on stated availability". The text of 4(b) covers systems "to make decisions affecting terms of work-related relationships" and "to allocate tasks based on individual behaviour or personal traits or characteristics" (text) — [AIA](http://data.europa.eu/eli/reg/2024/1689/oj). The carve-out for availability-only allocation, the significance threshold and the "worker-only feedback" exclusion all come from the draft (paras 262, 271–272, 277–278) (team data) — [ACT-DATA](/home/user/final/tools/ai-act-explorer/ai-act-data.json). [ACT-DATA] itself warns of e12 and e13: "Narrowing readings: do not bank until final". The booklet marks the high-risk half "(draft guidance)" but prints the minimal half without the mark in C1 (it is marked in A2). A tool that builds the rota automatically also "significantly changes regular working hours" far more often than the wording suggests, since [CAT] #72 says tools "build or adjust rotas" (my inference).
- Exploitative pricing. [BOOK] C3 marks the Art. 5 switch "(our reading)". [ACT-DATA] `hospitalityProvisions` states the same point with `confidence: "settled"` and words it as "Pricing or upselling designed to exploit a guest who cannot compare" (team data). "Cannot compare" is not one of the vulnerabilities in Art. 5(1)(b), which lists "age, disability or a specific social or economic situation"; it could only fall under 5(1)(a) (manipulative or deceptive techniques) and then needs material distortion and "significant harm" (text) — [AIA](http://data.europa.eu/eli/reg/2024/1689/oj). The explorer wording is looser than the Act.

**C. A6 entries that do not match the catalogue use**

- #51 and #52 are counted among the 13 "high-risk if…" uses as "Lift door and obstacle AI (the lift maker's duty)" and "hotel-run safety AI for gas or pressure equipment (rare)" (team data) — [BOOK]. The catalogue uses are predictive maintenance: "OEM remote monitoring predicts faults before breakdown and dispatches technicians" and "Predict faults across hotel equipment … (announced only)" (team data) — [CAT]. Predicting faults is "performance optimisation" or "service efficiency" under new Art. 6(1a) and is not a safety component unless Art. 6(1b) applies (text) — [OMNI](http://data.europa.eu/eli/reg/2026/1744/oj). So two of the 13 are in the count for a function the catalogue does not describe. On the catalogue's own description both are minimal (my inference). The headline "13" is nearer 11.
- [ACT-DATA] agrees with this reading: "None of the 13 scenarios is an Annex I case … This is a completeness item, not an exposure item" (team data).

**D. Tests requested, one by one**

| Test | Text result | Booklet | Verdict |
|---|---|---|---|
| Dynamic pricing (#2), same price for all | Not in Annex III; 5(c) covers only life and health insurance pricing (text) | Minimal | Sound |
| Personalised pricing (#2, #7, #28, #38) | Art. 5(1)(b) needs exploitation of age, disability or social/economic situation, material distortion and significant harm (text) | Minimal; Art. 5 switch on #2 only; [Consumer] notice; [GDPR] profiling | Sound but the switch should attach to all pricing and upsell rows |
| Guest credit or deposit scoring | Annex III 5(b): "evaluate the creditworthiness of natural persons or establish their credit score"; heading says "essential private services"; recital 58: "access to financial resources or essential services such as housing, electricity, and telecommunication" (text) | Silent. A2 lists "credit" as a high-risk area with no hotel example | Gap. [ACT-DATA] says "most likely outside 5(b)" for hotel stays, possible "housing" for long-stay or serviced apartments (draft paras 301–304) (team data). Corporate accounts are out (legal persons); sole traders are in (draft paras 73–74) (team data) |
| Fraud detection (#66, #85) | 5(b) carves out "AI systems used for the purpose of detecting financial fraud" (text) | Minimal because "expressly excluded from the credit-scoring category" | Label right, reason beside the point: a booking-fraud tool is not a credit score in the first place. The live questions are Art. 5(1)(d), Art. 5(1)(c) and GDPR Art. 22, none addressed |
| Guest "risk" or blacklist scoring | Art. 5(1)(c): evaluation "over a certain period of time based on their social behaviour or known, inferred or predicted personal or personality characteristics" leading to detrimental treatment "in social contexts that are unrelated to the contexts in which the data was originally generated" or "unjustified or disproportionate" (text). Not limited to public authorities (text) | Silent: the words "social scoring" and "blacklist" do not appear in [BOOK] (my grep). C5 mentions "banned-guest matching" only as face recognition | Gap. A hotel's own do-not-rent list based on conduct in that hotel is same-context and can be proportionate (my inference). A shared cross-operator score built from social media, "behavioural data" and stay history, with refusal as the outcome, is the hotel-sector case closest to 5(1)(c) (my inference). The wizard does list social scoring in q4 (team data) |
| Crime-risk prediction | Art. 5(1)(d): risk assessments "to assess or predict the risk of a natural person committing a criminal offence, based solely on the profiling of a natural person" (text) | Silent | Gap. A "this guest will commit fraud/theft/damage" score built only from profiling touches the wording. Whether private operators acting for their own business are caught depends on the final prohibited-practices guidelines, which I could not read (see Gaps) |
| Age estimation at bars or kiosks | Not Annex III 1(b) per draft examples p. 35: age is not a GDPR Art. 9 attribute (team data). But Art. 3(40) defines a biometric categorisation system as "assigning natural persons to specific categories on the basis of their biometric data", and Art. 50(3) obliges deployers of "a biometric categorisation system" to "inform the natural persons exposed thereto" (text) | Silent | Gap. Provisional label: not high-risk (draft), transparency under Art. 50(3) (text + my inference). The "ancillary to another commercial service and strictly necessary for objective technical reasons" exception in 3(40) is unlikely to fit an age gate (my inference) |
| Loyalty profiling (#19, #32) | Not in Annex III; marketing segmentation outside 5(b) (draft p. 88, team data) | Minimal, [GDPR] | Sound |
| Review analysis inferring emotions (#29) | Art. 3(39): emotion recognition means inferring emotions "on the basis of their biometric data" (text) | Minimal; "analysing the text … is not emotion recognition" | Sound for text. Two unstated switches: (1) [CAT] scope includes "messages"; if voice notes or call audio are analysed for tone it becomes Annex III 1(c); (2) review tools that attribute sentiment to named employees and feed training or appraisal (#74 "link guest-review issues to training") become monitoring and evaluation under 4(b) (my inference) |
| Staff scheduling "by availability" | See B above | Minimal (draft) | Rests on draft |
| Tip or bonus allocation | 4(b) "decisions affecting terms of work-related relationships"; draft para 259 lists pay entitlements (team data) | Silent for the EU; D2 quotes the UK regulator's example of shift pay set from productivity predictions | Gap; see Q3 |
| Training assessment (#74) | 4(b) and also Annex III 3(b): "evaluate learning outcomes … in educational and vocational training institutions at all levels" (text) | High-risk only if assessments "decide pay, promotion or continued employment" | Incomplete. Under draft paras 274–275 "monitor and evaluate" is a stand-alone category "whether or not pay or hours change" (team data). An AI coach that scores each employee's role-play and reports the scores to managers evaluates performance even if nothing is "decided". And hotel schools or group academies that assess learners may fall under point 3, which [ACT-DATA] notes ("Could touch hotel schools and in-house academies") but [BOOK] omits |
| Kitchen cameras (#54) | 4(b) (text) + draft narrowing | Minimal / high-risk if rating cooks | Sound; rests on draft |
| Robots (#39, #42) and robot cooks | Machinery is now Annex I Section B point 21; for Section B only Art. 6(1), 60a and 102–112 apply, requirements arrive through delegated acts under the Machinery Regulation (text) — [OMNI](http://data.europa.eu/eli/reg/2026/1744/oj) | C4 puts "cleaning robots" in one row with ovens and cites gas appliances; glossary defines regulated products as "lifts and gas appliances" | Incomplete: robots are machinery, a different route from lifts and gas. Hotel remains user, so "ask the maker" stands (my inference) |
| Spa, wellness, health-data tools | Medical devices are Annex I Section A point 11 (text). Emotion ban exception covers "medical or safety reasons" (text) | Silent | Gap; see Q3 |
| Children's clubs | Toy safety is Annex I Section A point 2 (text). Art. 5(1)(b) names age (text). Art. 50(5) and final guidelines ask that notices account for children (team data, t4, t8) | Silent | Gap; see Q3 |
| Accessibility tools | Art. 50(5): information "shall conform to the applicable accessibility requirements" (text); translation and transcription are outside Art. 50(1) (final guidelines examples, team data t6) | Silent | Minor gap |
| Energy and building systems (#47, #50) | Art. 6(1a)–(1b) (text) | Minimal | Sound |
| Security analytics (#86) | Art. 3(39) covers "emotions or intentions"; recital 18 excludes "mere detection of readily apparent expressions, gestures or movements, unless they are used for identifying or inferring emotions" (text) | Minimal for "intrusion, objects or occupancy" | [CAT] #86 also lists "loitering, incidents". Aggression or "suspicious behaviour" analytics that infer intent from body movement or voice sit on the 1(c) line; where staff are in view the Art. 5(1)(f) question arises unless the safety exception applies (my inference). Not tested in the booklet |
| Licence-plate recognition in car parks | A plate is not biometric data (Art. 3(34) concerns physical, physiological or behavioural characteristics of a person) (text); not in Annex III (text) | Silent | Minimal under the AI Act; GDPR applies to plate data (my inference) |
| ID document checking and police registration (#24) | Annex III points 6 and 7 apply to systems used "by or on behalf of" law enforcement or migration authorities (text for point 6; point 7 heading only read) | Minimal; [GDPR] "Keep ID document scans only as long as needed" | Sound. The hotel acts under its own legal duty to register guests, not on behalf of the police, so points 6–7 do not bite (my inference). The booklet does not mention the legal basis or national retention periods for police registration |

**E. Other doubtful rows found while mapping**

- IT service desk (#84) is "Minimal" in C5, but [CAT] lists its AI type as "NLP / speech (transcription, sentiment, speech analytics)" on staff calls (team data). Sentiment inferred from staff voices is emotion recognition in the workplace, prohibited by Art. 5(1)(f) (text). This is the same switch the booklet applies to #16, missed here.
- Call scoring (#16): the booklet covers the agent side only. The same recording analyses the guest's voice; guest emotion scoring is Annex III 1(c) and triggers the Art. 50(3) notice (text; draft example p. 37 via [ACT-DATA] b4).
- ESG reporting (#88): the final Art. 50 guidelines put AI-written sustainability claims and "corporate reports on a listed company's website" inside the Art. 50(4) text duty unless substantively human-reviewed (team data, t10). [BOOK] applies this to marketing text (#17) but not to ESG reports.
- Paid media (#21): Annex III 4(a) names systems used "to place targeted job advertisements" (text). The same ad-optimisation stack used for recruitment campaigns is high-risk; not stated.
- [BOOK] C2 states that an in-room voice assistant reading guest emotions is high-risk and cites the Act (¹) only; correct on the text (Annex III 1(c)), but the Art. 50(3) duty to inform guests is mentioned only for crowd-mood cameras in C5.
- [BOOK] A2 says the hotel must use a high-risk tool "under trained human oversight" and A3 lists user duties, but omits Art. 26(11)-type duties in detail and the FRIA; the README records these omissions as possibly deliberate (team data) — [README](/home/user/final/docs/d7-governance/README.md)

### Inferences
- The booklet's frame "four places" (employer, biometrics, telling guests, accidental maker) leaves out a fifth that the hotel market now shows: scoring and refusing guests (social scoring, crime-risk profiling, credit-type scoring). It is rare in chain hotels but growing in aparthotels and short-let style operations, which are inside the project scope when they are hotels.
- The fraud sentence in C5/C6 should be reworded: the reason fraud tools are minimal is that they are not on the list, and the exception matters only when a tool also scores creditworthiness.

### Gaps
- Final prohibited-practices guidelines (C(2025) 5052): I could not open them. From memory only, they discuss whether private companies profiling customers in their ordinary business fall under Art. 5(1)(d) and give examples of acceptable and unacceptable private-sector scoring under 5(1)(c). This must be checked by the legal track before the report says anything firm on guest risk scoring.
- Draft guidelines on Annex III point 3 (education) were "Not read" by the team either ([ACT-DATA] coverageCaveat), so the in-house academy question is open.
- No regulator decision on a hotel guest-scoring tool was found (secondary; search returned vendor pages only).

---

## 3. Which hotel and F&B AI uses seen in the 2025–2026 market are missing from the 91?

### Takeaway
The catalogue covers the commercial and guest-conversation uses well (voice agents, upselling, agentic booking via assistants, messaging translation, banqueting sales and procurement are all present), but it omits about twenty uses, and the omissions cluster exactly where the AI Act and GDPR bite hardest: guest screening and scoring, biometrics beyond check-in, sensors in rooms, staff safety and tracking devices, and AI in recruitment interviews.

### Cited Findings

First, what the brief's examples already are in [CAT] (team data): agentic booking via ChatGPT-style assistants (#15, #22), AI phone agents (#9, #40), upselling engines (#7, #28, #38), guest messaging translation (#30, #41), banqueting and event sales AI (#35, #18), procurement and inventory AI (#59–#64), allergen and menu engineering (#55, #37), robots (#39, #42), occupancy sensors (#44, #50), room-attendant workload (#46). Kitchen robots are expressly noted as absent: #56 says "no source shows kitchen robots in hotels" (team data) — [CAT](/home/user/final/tools/use-case-catalogue/index.html)

Missing uses, with market evidence and a provisional label (all labels are my inference):

| # | Missing use | Market evidence (2024–2026) | Provisional AI Act label and why |
|---|---|---|---|
| M1 | Guest screening and risk scoring before arrival (ID check + behavioural and social data, traffic-light score) | SafeGuest launched a guest risk-scoring tool for short-let stays across Europe using "biometric checks, behavioural data and stay history" with a Green/Yellow/Red score (secondary, trade press) — [Europe Real Estate](https://europe-re.com/safeguest-launches-guest-risk-scoring-tool-to-tackle-problem-short-let-stays-across-europe/74353). Autohost bundles ID checks, "background and credit checks, social verification, watchlist screening" and an AI risk level per reservation (vendor claim, search summary) — [Autohost](https://autohost.ai/products/user-verification) | Minimal by default, but the nearest hotel use to Art. 5(1)(c) social scoring where data from unrelated contexts (social media, other operators) leads to refusal; Art. 5(1)(d) question if it predicts criminal conduct from profiling alone; Annex III 5(b) only if it scores creditworthiness. GDPR Art. 22 applies today. Current catalogue #85 covers only payment and account fraud |
| M2 | Shared banned-guest or "do not rent" databases | Guestscan described as a UK subscription blacklist; hotelblacklist.org announced an "accommodation industry risk assessment tool" in 2026 (secondary, press release, promotional) — [Hotels Magazine](https://hotelsmag.com/news/subscription-database-helps-uk-hotels-avoid-bad-guests/), [press release](https://www.webdisclosure.com/press-release/hotel-blacklist-launches-new-accommodation-industry-risk-assessment-tool-n1woPfx5rCS) | Often a plain database, not an AI system. If an AI score is added: as M1. Matching banned guests by face on cameras is already in the booklet (C5, high-risk) |
| M3 | AI avatar or hologram receptionist | Astral Hotels (Israel) rolling out a life-sized holographic avatar kiosk for check-in, Sept 2026; Aiden by Best Western (Denmark) pilot with RAVATAR connected to Mews, with eight of 13 CIC Hospitality sites reported in late 2024 (secondary, trade press; 2026 status unclear) — [Retail Customer Experience](https://www.retailcustomerexperience.com/news/israeli-hotel-group-deploys-ai-powered-holographic-check-in-kiosk/), [Sixteen:Nine](https://invidis.com/sixteen-nine/2024/12/30/nordic-hotel-operator-evaluating-transparent-lcd-driven-ai-avatars-to-handle-check-ins-and-guest-questions/) | Transparency, Art. 50(1). The final guidelines say realistic avatars and human-like voices never count as "obvious" (team data, t5). If the avatar is a likeness of a real employee, Art. 50(4) deep-fake disclosure. High-risk if it adds emotion reading |
| M4 | AI video or voice interviews for hiring | Hilton's use of HireVue video interviewing (vendor case study); vendors Hyring, Interviewer.ai, Edesy market AI interviews for hotel roles; Edesy says its AI evaluates "guest service orientation … and personality fit" (vendor claims, search summary) — [Best Practice AI](https://www.bestpractice.ai/ai-case-study-best-practice/hilton_hotels_and_resorts_improves_hire_rates_by_40%25_using_video_intelligence_platform_to_hire_1000s_for_their_hilton_reservations_and_customer_care), [Hyring](https://hyring.com/use-cases/hospitality) | High-risk, Annex III 4(a) (text). Prohibited if it infers emotions from face or voice, Art. 5(1)(f) (text). [BOOK] C1 mentions this as a switch on #73, but [CAT] #73 does not list interview analysis as a use |
| M5 | Staff panic buttons and location wearables | React Mobile, Flic, ProSafe; German Robiotic MaidSafe combines a panic button with room-status tracking (vendor and trade pages) — [Hospitality Net](https://www.hospitalitynet.org/news/4098907.html), [Multibel](https://multibel.eu/en/hotel-panic-button/) | Usually not AI (button + location beacon). If AI is added: outside 4(b) when used "exclusively … for safety" (draft para 277, team data); high-risk if location or dwell data is reused to evaluate attendants. [Labour] and [GDPR] apply regardless |
| M6 | Per-attendant productivity dashboards (minutes per room) | Amadeus "Attendant Productivity dashboard"; Quore Productivity Report compares each attendant's minutes per room against standard; Unifocus "Supervisor Visibility & Productivity Tracking"; Flexkeeping analytics show "rooms cleaned per housekeeper, expected versus actual cleaning time" (vendor help pages, search summary) — [Amadeus](https://help.amadeus-hospitality.com/operations/service-optimization/content/hskp-attendant-productivity-dashboard.html), [Unifocus](https://www.unifocus.com/housekeeping/productivity-tracking), [Flexkeeping](https://help.flexkeeping.com/en/support/solutions/articles/103000389938-new-analytics-dashboard) | This is the switch the booklet warns about under #46, and the evidence shows it is a standard feature, not a rare one. A plain report of timestamps may not be an AI system (Art. 3(1)); where AI predicts or scores per attendant it is Annex III 4(b) (draft paras 274–275). [CAT] #46 does not record the reporting feature |
| M7 | Biometric staff time clocks | [BOOK] B3 itself cites Serco Leisure (ICO, 2024) and the AEPD position (team data) | Not in [CAT]. 1:1 verification is outside Annex III 1(a) (text); GDPR Art. 9 decides. The booklet covers it; the catalogue does not |
| M8 | Noise, occupancy, smoking and vape sensors in rooms | Minut markets hotel sensors for "cigarette smoke, noise & over occupancy"; HALO detects vaping, smoking and THC; NoiseAware rebranded as Rest (vendor claims) — [Minut](https://www.minut.com/solutions/hotels), [HALO](https://halodetect.com/) | Minimal: no biometric identification, no Annex III area. Many are threshold devices and may not be AI. GDPR and ePrivacy (monitoring inside a private room) and consumer law on automatic fees are the real issues. Occupancy counting from sound or CO2 is not biometric (my inference) |
| M9 | AI weapon, aggression and behaviour detection on CCTV and audio | Omnilert and ZeroEyes market gun detection for hotels and casinos; a trade article reports systems that "pick up on raised voices, or angry gestures" (vendor and trade press, mostly US) — [Omnilert](https://www.omnilert.com/industries/hospitality-and-hotel-security-systems), [Security Journal Americas](https://securityjournalamericas.com/future-casino-security-surveillance/) | Object detection (weapon): minimal. Aggression or "angry gesture" detection: on the Annex III 1(c) line because Art. 3(39) covers "emotions or intentions"; recital 18 excludes "a raised voice" only as mere detection (text). No European hotel deployment found |
| M10 | AI drowning detection in pools | Lynxight claims more than 1,000 pools in 16 countries and lists hotel estates among target buyers; no named hotel deployment found (vendor claim) — [Lynxight](https://www.lynxight.com/content/which-ai-drowning-systems-do-large-public-operators-use) | Not Annex III. Safety function, so the Art. 6(1b) logic applies only if it is a safety component of an Annex I product, which a stand-alone camera system is not (my inference). Minimal under the AI Act; product liability and duty of care dominate. If lifeguards are monitored by it, [Labour] |
| M11 | Licence-plate recognition for hotel parking | Avutec parking listed on the Mews marketplace; Pair (Sweden) "Flow – ANPR for hotels"; Smart Parking (vendor pages) — [Mews marketplace](https://mews.com/en/products/marketplace/avutec-parking), [Pair](https://pair.se/business/solutions/flow) | Minimal; a plate is not biometric data. GDPR applies |
| M12 | Facial age estimation at self-service alcohol points | Yoti age estimation trialled in UK supermarkets and nightlife venues (Home Office trials 2022), Diebold Nixdorf self-checkout in Germany; no hotel bar or kiosk deployment found (trade press) — [Computer Weekly](https://www.computerweekly.com/news/252499863/UK-supermarkets-to-trial-age-estimation-tech-for-alcohol-purchases), [C-Store Dive](https://www.cstoredive.com/news/automatic-age-verification-diebold-nixdorf-germany/714949/) | Not high-risk under 1(b) (draft, age is not a sensitive attribute); biometric categorisation under Art. 3(40), so Art. 50(3) notice (text + my inference). Relevant to self-service minibars, grab-and-go shops and QR alcohol ordering (#38) |
| M13 | Spa and wellness AI: skin analysis, body scans, sleep tracking, wearables data | Hyatt–Evolt body scan partnership; hotel spas ingesting Oura, WHOOP and Apple Watch data; AI skin analysis and smart mirrors (trade press and vendor content) — [Hospitality Technology](https://hospitalitytech.com/personalized-wellness-experiences-elevate-hotel-stays), [Hospitality Net](https://www.hospitalitynet.org/news/4132554/sleep-tracking-and-longevity-claims-the-new-era-of-wellness-retreats) | Minimal unless the product is a medical device (Annex I Section A point 11), then high-risk for the maker from 2 Aug 2028. Skin or face analysis that sorts guests by biometric data is biometric categorisation (Art. 50(3)); inferring mood or stress from face or voice is Annex III 1(c). GDPR Art. 9 health data today. [CAT] #8 covers only spa pricing |
| M14 | Robot cooks and automated food stations | Leonardo Smart Vienna Airport installed a goodBytz cooking robot (Aug 2026); Hella Globe Hotel, Lippstadt, runs a goodBytz/Fanuc system since April 2026; SoftBank Robotics showed cooking robots at EquipHotel, Paris, Nov 2026 (company newsroom and trade press) — [Leonardo Hotels](https://www.leonardo-hotels.com/press/fully-automated-cooking-robot-complements-24-7-service-offering-at-the-leonardo-smart-vienna-airport), [Fanuc](https://www.fanuc.eu/eu-en/news/a-fanuc-robot-takes-lead-kitchen), [Hospitality Net](https://www.hospitalitynet.org/news/4134670/softbank-robotics-expands-ai-robotics-solutions-for-foodservice-in-emea.html) | Machinery: Annex I Section B after the Omnibus (text). Maker's matter; hotel is user: "minimal for the hotel; ask the maker". Contradicts [CAT] #56 "no source shows kitchen robots in hotels" |
| M15 | Tip pooling and gratuity distribution software | TiPJAR, Nory Tips, Evention; the search found rules-based products and "nothing on whether any product uses AI" (vendor pages) — [Nory](https://nory.ai/?p=2871), [10 Minutes News for Hoteliers](https://en.10minhotel.com/2025/09/03/modernizing-gratuity-how-technology-is-reshaping-tip-management-in-hospitality) | Today mostly not AI. If an AI model sets individual shares from performance, it makes "decisions affecting terms" (pay): Annex III 4(b), high-risk |
| M16 | Real-time translation devices and accessibility aids at the desk | Google Nest Hub interpreter mode via Volara (2020); Boostlingo AI translation "over 130 languages" including Deaf and hard-of-hearing support (vendor and trade press) — [Hotel Online](https://www.hotel-online.com/news/google-assistants-interpreter-mode-helps-international-hotel-guests-translate-across-29-languages), [Boostlingo](https://boostlingo.com/industries/travel-and-hospitality/) | Minimal: translation and transcription tools are outside Art. 50(1) (final guidelines, team data t6). No evidence found of sign-language avatars in hotels |
| M17 | Smart minibars with automatic billing | Bartech sensor minibars; no computer-vision product found (vendor and trade press) — [Hospitality Net](https://www.hospitalitynet.org/news/4128545.html) | Not AI (infrared and switch sensors). Outside the Act; consumer law on automatic charges |
| M18 | Kitchen hygiene and PPE compliance cameras (handwashing, hairnets) | Not searched; I have no source | If exclusively for legal food-safety duties: outside 4(b) (draft para 277, team data). High-risk if it scores individual cooks. Listed as a hypothesis only |
| M19 | Guest-side AI agents contacting the hotel (a traveller's assistant phones or emails the hotel to book) | [CAT] #15 and #22 cover the hotel's own app or MCP server, not inbound third-party agents (team data). No separate market search done | The agent's provider owes the notice; final guidelines say agents that make bookings "must disclose that they are AI and on whose behalf they act" (team data, t3). For the hotel: no AI Act duty, but contract and fraud questions |
| M20 | Children's club AI (toys, tablets, photo tagging of children) | Not searched; no source | AI in toys: Annex I Section A point 2 (text). Art. 5(1)(b) names age as a vulnerability (text). Hypothesis only |

- [CAT] heading statistic "2% of AI-using hotels use facial-recognition check-in" (source key S1) is the only adoption figure in the catalogue touching biometrics; the catalogue has no adoption figure for any of M1–M20 (team data) — [CAT](/home/user/final/tools/use-case-catalogue/index.html)

### Inferences
- Priority additions for the catalogue and booklet, by legal weight: M1 guest risk scoring, M4 interview analysis, M6 per-attendant productivity reporting, M3 avatar receptionists, M13 spa and wellness data, M12 age estimation. M8, M11 and M17 are worth one line each to say "not an AI Act matter, GDPR and consumer law instead".
- M14 means #56 in the catalogue needs updating: two European hotel kitchen-robot deployments are reported for 2026.
- Much of the evidence is from the US, UK or Israel. For a Europe-focused report, M3 (Denmark), M11 (Sweden, Netherlands via Mews), M14 (Austria, Germany) and M1 (pan-European launch) have European evidence; M9, M10 and M12 do not have a European hotel deployment that I could find.

### Gaps
- All market evidence is search-summary only; no vendor page or article was opened in full. Vendor figures (e.g. Lynxight "1,000 pools", Hilton "40%") are vendor claims and should not be quoted as findings.
- No adoption rates exist for any missing use. No source was found for hotel use of emotion recognition on CCTV, sign-language avatars, camera-based minibars, AI tip allocation, or age estimation in a European hotel.
- M18 and M20 are unevidenced hypotheses.

---

## 4. Configuration switches: which single-feature changes move a tool between labels?

### Takeaway
Seventeen single changes move a hotel tool up a label and nine move it down; almost all are a reporting setting, a retention setting, a data source or a use of the output, not a different product. Human sign-off is not a down-switch.

### Cited Findings

**Switches up**

| # | Tool (catalogue #) | Single change | From → to | Basis |
|---|---|---|---|---|
| U1 | Voice agent, in-room assistant (#9, #34, #36, #40) | Switch on guest emotion or "sentiment from voice" | Transparency → high-risk + Art. 50(3) notice | Annex III 1(c), Art. 50(3) (text); draft example p. 37 (team data) |
| U2 | Voice agent (#9) | Recognise returning callers by voiceprint without opt-in | Transparency → high-risk | Annex III 1(a), Art. 3(41) (text); draft paras 141, 144 (team data) |
| U3 | Call scoring, IT service desk, meeting tools, coaching (#16, #84, #79, #74) | Switch on agent or staff emotion scoring from voice or face | High-risk or minimal → prohibited | Art. 5(1)(f) (text) |
| U4 | AI coach (#74) | Send emotion-based results to HR or managers instead of only to the employee | Allowed → prohibited | [BOOK] B3, C1 citing final prohibited-practices guidelines (team data; not verified by me) |
| U5 | Rota, cleaning plan (#72, #46) | Add punctuality, reliability, shift-acceptance or guest/manager ratings as allocation inputs | Minimal → high-risk | Annex III 4(b) (text); draft para 270 and example p. 76 (team data) |
| U6 | Rota (#72) | Let the tool significantly change regular hours or approve/deny leave | Minimal → high-risk | Draft para 259 (team data) |
| U7 | Housekeeping tool (#46, M6) | Report rooms per hour or minutes per room per attendant to supervisors | Minimal → high-risk | Draft paras 274–275 (team data) |
| U8 | Room inspection, food-waste cameras, shrink alerts, BI dashboards (#45, #54, #62, #77) | Attribute results to a named person and use them to judge that person | Minimal → high-risk | Annex III 4(b) (text); draft paras 277–278 (team data) |
| U9 | Training platform (#74) | Make AI assessment gate pay, grade, promotion or continued employment | Minimal → high-risk | Draft para 261 (team data) |
| U10 | Attrition model (#75) | Use the score in renewal, promotion or dismissal decisions, including letting a fixed-term contract lapse | Minimal → high-risk | Draft para 264 (team data) |
| U11 | General chatbot (#78) | Use it to rank applicants or rate staff | Minimal → high-risk, and the hotel becomes the provider | Art. 25(1)(c) (text) |
| U12 | Vendor high-risk tool | Put the group's brand on it, or retrain it on own data | User → provider | Art. 25(1)(a), (b) (text); retraining is "(our reading)" in [BOOK] A3 |
| U13 | Security cameras (#86) | Add a watch-list or VIP face match on general CCTV | Minimal → high-risk | Annex III 1(a) (text); draft p. 24 (team data) |
| U14 | Security cameras (#86) | Infer race, religion, sexual orientation etc. from faces | → prohibited | Art. 5(1)(g) (text) |
| U15 | Marketing text, ESG reports (#17, #88) | Publish AI-written health, safety or sustainability claims without substantive human review | Minimal → transparency | Art. 50(4) (text) as read by the final guidelines paras 131–136 (team data) |
| U16 | Staff-assisted messaging (#10, #31, #27) | Let the AI send replies itself instead of a person reviewing and sending | Minimal → transparency | Art. 50(1) (text); final guidelines para 30(iii) (team data) |
| U17 | Marketing imagery (#20) | Move from retouching a real photo to generating a realistic scene that misrepresents the property | No label → transparency (deep fake) | Art. 3(60), Art. 50(4) (text); final guidelines para 116 (team data) |

Further up-switches not in the booklet (my inference): guest risk scoring that pulls in social-media or cross-operator data (minimal → Art. 5(1)(c) question); paid-media tool pointed at job advertisements (minimal → high-risk, Annex III 4(a) text); adding a facial age gate to a kiosk (nothing → Art. 50(3)); review analytics that rank named employees (minimal → 4(b)); deposit or pay-later decisions from a creditworthiness score for long-stay housing (minimal → 5(b) question); spa device with a medical purpose (minimal → Annex I).

**Switches down**

| # | Change | Effect | Basis |
|---|---|---|---|
| D1 | Allocate shifts or rooms only on stated availability, required accreditation, location, room status | Outside the task-allocation limb of 4(b) | Draft paras 271–272 (team data); narrowing, not final |
| D2 | Send inspection or coaching feedback only to the worker, never to the employer | Outside 4(b) | Draft para 278 (team data); "check the actual reporting flow" |
| D3 | Report camera, waste or stock results by team, shift or outlet, not by person | No individual evaluation | [BOOK] C4 DO 1 (team data); my inference on the law |
| D4 | Use the tool exclusively for property protection, safety or a legal duty | Outside 4(b) | Draft para 277 (team data) |
| D5 | Limit attendance tools to compiling records with no scoring or flags | In 4(b) but Art. 6(3)(d) preparatory-task filter | Draft example p. 78 (team data); unavailable if the system profiles (Art. 6(3) last subparagraph, text) |
| D6 | Replace remote face identification with opt-in verification where the guest presents themselves | High-risk → outside Annex III 1(a) | Annex III 1(a), recital 17 (text); draft paras 136–140 (team data) |
| D7 | Analyse the transcript text instead of the voice signal | Not emotion recognition | Art. 3(39) (text); draft para 124 (team data) |
| D8 | Put a person in front: staff review and send AI drafts as the main interlocutor | Outside Art. 50(1) | Final guidelines para 30(iii) (team data) |
| D9 | Keep AI to energy, comfort and efficiency, with safety functions on separate certified controls | Not a safety component | Art. 6(1a)–(1b) (text) |

- What does not move a tool down: a manager signing off each decision (draft paras 70, 72, 258, team data); a line in terms and conditions for chatbot disclosure (final guidelines, team data t4); a vendor's terms-of-service exclusion of high-risk uses (draft general principles para 12, team data p1); splitting a system into modules or agents (draft paras 75, 90, team data g4); keeping data only for the shift (this is a GDPR measure from the Amazon France Logistique ruling cited in [BOOK] A7, not an AI Act reclassification) (my inference).

### Inferences
- The booklet's vendor question 2 ("Does it rank, score or monitor individual staff, read emotions, or recognise people by face or voice? Can those features be switched off?") covers U1–U8 and U13. It does not cover U15–U17 or the guest-scoring switches.
- Retention ("keep that data for the shift, not as a history", C2 DO 1) is presented next to AI Act labels and could be read as a down-switch. It is not one under the Act.

### Gaps
- Whether "per-person reporting off" is enough when the vendor's stated intended purpose includes performance monitoring is unresolved: classification follows the provider's intended purpose (Art. 3(12), draft paras 77–78 via [ACT-DATA] g5), so a hotel switching a feature off may still be using a high-risk system. The booklet does not address this.

---

## 5. F&B specifically: tools, labels and the non-AI-Act laws the booklet tags

### Takeaway
The booklet treats F&B as low exposure with two live points (ordering bots must say they are AI; waste cameras become a staff issue), and tags [Labour], [CH], [Liability] and [Cyber/PCI]; it tags no [GDPR], [Consumer] or allergen-law line in C4, and banqueting, bar and room service are covered only indirectly.

### Cited Findings

| Area | Tools (catalogue # or missing M#) | Booklet label | Non-AI-Act law tagged in the booklet | What is not tagged |
|---|---|---|---|---|
| Restaurant | Voice AI and table management (#40); QR ordering with upsell (#38); menu engineering and pricing (#37); service robots (#39) | #40 transparency; #38, #37 minimal; #39 transparency "if not obviously a machine" | [Cyber/PCI]: "keep card payments out of the chat unless the vendor covers card security" (C4 DO 2) | [Consumer]: personalised menu prices and upsell fall under the A8 rule on personalised prices, not repeated in C4. [GDPR]: allergy and dietary data in orders are health data; the explorer wizard lists "dietary needs" as special-category data, the booklet does not |
| Bar | No dedicated use in [CAT]. Related: #38 (pool/bar ordering), M12 age estimation, M15 tips | Minimal by default | None | Age verification for alcohol; licensing law; Art. 50(3) if facial age estimation is used |
| Room service | Chat/voice ordering (#36); delivery robots (#39); in-room voice assistant (#34) | #36, #34 transparency (#34 high-risk if it reads emotions); #39 as above | [Cyber/PCI] via C4 DO 2 | Microphones and robots' cameras in private rooms ([GDPR], ePrivacy); [RDY] archetype A7 notes "microphones or cameras near guests" |
| Banqueting and events | Event sales AI (#35); MICE enquiry and proposals (#18); function-space forecasting (#6) | Minimal by default (not named in C4) | None in C4; C3 covers sales and marketing generally | Art. 50(1) for voice agents and lead-qualification calls in #18 and #23; agency and extras staffing for events falls under Annex III point 4 (draft paras 238–241, team data e1) |
| Kitchen | Food-waste cameras (#54); allergen labelling (#55); smart ovens (#56); production forecasting (#57); recipe generation (#58); cooking robots (M14) | #54 minimal / high-risk if used to rate cooks; #56 "minimal for the hotel; ask the maker"; others minimal | [Labour]: "Kitchen cameras are able to monitor staff, which triggers works-council rights in Germany"; [CH]: ban on behaviour-monitoring systems; [Liability]: a group that builds its own menu or allergen assistant "answers as manufacturer (our reading)"; Cyber Resilience Act proof for connected equipment from 11 Dec 2027 | Allergen law is not cited: C4 says only "Allergen information stays the hotel's responsibility whatever tool produces it". The EU rule is Regulation (EU) No 1169/2011 on food information to consumers (my knowledge; not in the booklet's 60 references as far as the text extraction shows). Machinery Regulation for robots |
| Procurement for F&B | #59–#64 | Minimal; #62 high-risk if alerts are used to judge staff | — | — |

- All label cells above are (team data) — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) C4, C6, A6.
- [CAT] rates F&B service use as "Low" overall, with four of six uses "Very low" or "Low", and notes for #35 "AI banquet event orders and menu costing are not shown by any source", for #37 "claimed in market, not verified", for #38 "dynamic menu pricing not evidenced" (team data) — [CAT](/home/user/final/tools/use-case-catalogue/index.html)
- [CAT] department headline: "4% of AI-using hotels use automatic menu generation" and "8% of AI-using hotels use AI waste analysis", both attributed to source key S1 (team data; the survey base is described in the catalogue's `src` list, which I did not open) — [CAT](/home/user/final/tools/use-case-catalogue/index.html)
- C4 row "Smart ovens, cooking equipment, cleaning robots" attaches the sentence "AI that controls gas appliances can be a safety component from 2 Aug 2028". Gas appliances are Annex I Section A point 10 (text) — [AIA](http://data.europa.eu/eli/reg/2024/1689/oj). Cleaning and cooking robots are machinery, now Annex I Section B (text) — [OMNI](http://data.europa.eu/eli/reg/2026/1744/oj)

### Inferences
- The allergen point deserves a firmer line: an AI tool that reads a menu and labels the 14 allergens (#55) is minimal under the AI Act, yet an error can injure a guest. The booklet handles this through [Liability] for group-built tools only. For vendor tools the hotel remains the food business operator responsible for the information, and the tool vendor's liability depends on contract and on the new Product Liability Directive (my inference).
- F&B staff are the most exposed to the "agency staff, extras, freelancers" extension of Annex III point 4 that [ACT-DATA] e1 flags as "HIGH" relevance, because banqueting relies on casual labour. The booklet states the extension in C1 but not in C4.
- Standalone restaurants are out of the project scope, so tools seen only there (drive-through voice ordering, delivery-platform algorithms) are not listed.

### Gaps
- No evidence on AI use specifically in hotel bars. No European evidence of dynamic menu pricing in hotels ([CAT] says "not evidenced").
- I did not verify the allergen regulation number against a primary source in this session; it is from my own knowledge and must be checked before citing.

---

## 6. Internal consistency: do the booklet, the explorer data and the catalogue agree?

### Takeaway
They agree on the main lines (employment and biometrics as the exposure, the two high-risk dates, pricing as minimal), but I found fourteen inconsistencies, the most important being that the catalogue, the readiness tool and the explorer do not share ids or labels, the explorer contradicts itself on guest credit scoring, and the explorer still tells Art. 6(3) users to "register the system" without the Omnibus qualification.

### Cited Findings

| # | Contradiction or mismatch | Sources | Marking |
|---|---|---|---|
| C1 | No shared key. [CAT] has no use ids; [RDY] uses `rm-1`…`lg-4`; [ACT-DATA] uses D1–D7, P1–P6; [BOOK] uses prose names that merge uses (e.g. "Room assignment and cleaning plans" = #25 + #46; "Dynamic pricing, demand forecasting, rate shopping" = #1–#3; "Smart ovens, cooking equipment, cleaning robots" = #56 + #42) | all four | team data + my inference |
| C2 | Label vocabulary differs: [BOOK] five labels plus "outside the high-risk list"; [ACT-DATA] `tiers` has four; the wizard gives 1:1 face verification `tier: "minimal"`, `confidence: "contested"`, while [BOOK] says "Outside the high-risk list (draft guidance)" and scenario D6 gives `tier: "high"` for the combined scenario | [BOOK] A2, C2; [ACT-DATA] wizard q5, D6 | team data |
| C3 | Guest credit scoring: wizard q5 choice "Credit scoring of guests" sets `annexIII: "5(b)", tier: "high"`; `annexIIIReference` 5(b) and `creditFindings` c1 say deposit or prepayment scoring for a hotel stay is "most likely outside 5(b)"; `draftClassificationGuidelines` g6 says "Scoring an individual guest … is inside it". [BOOK] is silent | [ACT-DATA] | team data |
| C4 | Exploitative pricing: [BOOK] C3 "(our reading)"; [ACT-DATA] `hospitalityProvisions` `confidence: "settled"`; scenario D3 `confidence: "judgement"` | [BOOK], [ACT-DATA] | team data |
| C5 | Scenario D3 (revenue management, tier "minimal") carries `aiActTier: 1` (the €35m fine tier) and cites "Annex III, 5(c)" among its articles, although 5(c) is cited only to say it does not apply | [ACT-DATA] | team data |
| C6 | Art. 6(3) registration: `classificationFilter` and wizard q6 say the provider must "still register the system (Art. 6(4); Art. 49(2))". Art. 6(4) in the 2024 text does say so (text). [OMNI] recital 22 says registration under Art. 49(2) "should be simplified by streamlining the content required under Annex VIII" and that "it remains crucial … that such AI systems are registered" (text), and [OMNI] deletes Annex VIII Section B points 7 and 9 (text). So the duty stands in simplified form; the explorer text is not wrong but does not show the change | [ACT-DATA]; [AIA]; [OMNI] | text + team data |
| C7 | Annex I and machinery: `annexIIIReference.annexI.hospitalityNote` lists "lifts, machinery, automated doors, pool plant, kitchen machinery" as reachable; the same file's open-items text says the hotel's Annex I exposure "reduces to safety-critical AI in lifts, gas appliances and pressure equipment" and that machinery moved to Section B. The wizard still offers "safety component of a regulated product (lifts, machinery, medical devices)". [BOOK] names lifts, gas and pressure equipment only | [ACT-DATA]; [BOOK] C6 | team data; Omnibus move verified (text) |
| C8 | Counts: [BOOK] A6 counts #51 and #52 as "high-risk if…" for lift-door and gas-safety AI; [ACT-DATA] says none of its scenarios is an Annex I case and calls it "a completeness item, not an exposure item"; [CAT] describes both as predictive maintenance | [BOOK]; [ACT-DATA]; [CAT] | team data |
| C9 | Staff exposure is invisible in [RDY]: rota #72 (`hr-1`) is archetype A3 with no add-on; cleaning assignment #46 (`hk-6`) A3, no add-on; room inspection #45 (`hk-5`) and food-waste cameras #54 (`kc-1`) carry only `hw`; training #74 (`hr-3`) is A1; dashboards #77 (`gm-1`) A8, none; shrink detection #62 (`pr-4`) A8, none. Only `res-8`, `hr-2`, `hr-4`, `hr-5`, `fo-1`, `fo-3`, `gx-6`, `it-4` carry `sens`. So 7 of the booklet's 11 staff-related exposures have no risk flag in the readiness tool | [RDY]; [BOOK] A6 | team data + my inference |
| C10 | [RDY] flags in-room voice assistant (`gx-6`) as `sens`, but voice agents (`res-1`) and ordering bots (`fb-2`) with the same emotion and voiceprint switch are not flagged | [RDY] | team data |
| C11 | Transparency coverage: [BOOK] lists 11 uses; [CAT] descriptions show direct AI-to-person contact also in #10 ("or book directly"), #18 ("voice agents"), #19 ("let agents answer replies to campaigns"), #23 ("lead qualification calls"), #84 (answers staff IT requests); [ACT-DATA] t3 says booking agents must disclose | [BOOK]; [CAT]; [ACT-DATA] | team data + my inference |
| C12 | [BOOK] A1 says the 91 are "ways hotels use AI today"; [CAT] marks several as "NOT AI", "announced only" (#52), "not shown by any source" (parts of #35, #69), and #91 as "Not an AI tool". [BOOK] A2 does say some tools "may fall" outside the AI definition, naming linen par levels, invoice matching, reconciliation and night audit, but not #44, #50, #89, #91 | [BOOK]; [CAT] | team data |
| C13 | Scenario coverage: the 13 scenarios cover chatbots, imagery, pricing, CV screening, workforce software, face check-in, call-centre emotion scoring and five provider routes. They have no scenario for: voice agents with voiceprint or guest emotion, food-waste or inspection cameras, training assessment, attrition scores, security video analytics, robots, fraud tools. The booklet has all of these | [ACT-DATA]; [BOOK] | team data |
| C14 | Dates: no file reports August 2026 as a high-risk date. [ACT-DATA] records that the draft general-principles text (para 449) still gives "before 2 August 2026" for the Art. 111(2) cut-off and marks it superseded. [BOOK] A5 gives 2 Dec 2027 and 2 Aug 2028. Consistent | [ACT-DATA]; [BOOK]; [OMNI] Art. 113 | text + team data |

- The docs README records that Art. 4a, Art. 27 FRIA, Art. 25(4), Arts. 75a–75d, Art. 99(1), Art. 17(2), Art. 60a and Art. 2(13) are in the explorer but "Not found in the booklet text", possibly on purpose (team data) — [README](/home/user/final/docs/d7-governance/README.md)
- [ACT-DATA] `employmentFindings` e1, e3, e5 each say the point was "not in the research" or "absent from the research" at the time; [BOOK] C1 now includes all three (agency staff, working hours and leave, non-renewal) (team data). The explorer's commentary is therefore stale relative to the booklet.

### Inferences
- A single label file keyed to the [RDY] ids (`rm-1` … `lg-4`), holding label, switch conditions, provision and basis (text / final / draft / reading), would remove C1, C2, C8, C9, C10 and C11 in one step, and would let the readiness tool and any register read the same value the booklet prints. The table in Q1 can seed it.
- C3 should be settled before the report mentions credit scoring: the safest wording today is "not high-risk for ordinary hotel stays on the draft guidance; open for long-stay housing".

### Gaps
- I did not open `ai-act-explorer.html`, so I cannot say whether the rendered tool shows these contradictions to a user or resolves some in code.
- I did not read the catalogue's `src` dictionary (43 sources) or the `cos` and `hg` lists, so vendor-level features (for example which housekeeping vendors report per attendant) were checked only through web search summaries.
