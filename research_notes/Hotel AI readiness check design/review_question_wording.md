# Readiness check: review of question wording

*Review date: 18 Nov 2026. Reviewer role: survey-design consultant. Scope: wording only; no repository file was changed.*

**What was reviewed and how the counts were made.** All figures below are my own counts from the built tool, not from outside sources. I extracted the embedded data from `tools/readiness-check/index.html` (`rdy.q`, `rdy.areas`, `rdy.uc`) and ran the tool's own `selectQuestions()` from `tools/readiness-check/src/logic.js` for all 90 selectable AI tools (91 use cases, one is not a tool) and the three hotel types. That gives 34 fixed questions (31 checklist + X1, X2, XG), 536 generated resource questions, and 9 evidence prompts. Pattern counts for the generated questions come from simple text rules (";", "and/plus", "or", "/", first word a verb, and so on), so they are close but not exact; the judgement "reads well" is mine after reading all 536.

---

## 0. Findings in one view

| Item | Count |
|---|---|
| Fixed questions reviewed | 34 |
| OK as written | 2 (T4, G1) |
| Double-barrelled (two or more things in one question) | 17 |
| Either-or ("A or B") | 6 |
| Vague or jargon | 9 |
| Also not answerable with Yes/No (secondary flag) | 4 (T2, F4, O6, XG) |
| Also leading (secondary flag) | 1 (O2) |
| Must-have questions with a wording problem | 9 of 9 (P1, F1, F2, T1, D5, O1, and when triggered P5, G2, XG) |
| Generated resource questions | 536 (90 tools x 6 areas, minus 4 "None") |
| Resource questions flagged by at least one text rule | 390 (73%) |
| Resource questions that list several items | 240 (45%); 118 use ";" |
| Resource questions that are empty ("... here: —?") | 15 |
| Resource questions with a broken first letter ("rMS", "pMS", "gDPR", "aI") | 61 |
| Fixed questions never selected for any tool or hotel type | 3 (P6, F4, O5); F5 is selected for 1 tool |

The owner's complaint is confirmed: 23 of 34 fixed questions (17 + 6) ask for two or more things or for "this or that", and so do about half of the generated ones.

---

## 1. All 34 fixed questions

Verdict key: **OK** / **Double** (asks two or more things) / **Either-or** (A or B) / **Vague-jargon** / **Leading** / **Not Y/N** (cannot be answered Yes or No). "Must" = must-have. Rewrites keep the meaning and keep must-haves strict. Where I propose a split, the essential part is named.

### People

| Code | Current text | Verdict | Proposed rewrite |
|---|---|---|---|
| P1 Must | Is one named person responsible for this AI use case, with time set aside for it? | Double (person + time); "use case" is team jargon | **Is there a named person in charge of this tool who has agreed hours each week for it?** One subject, one condition. The evidence line already collects name and hours. |
| P4 | Have you decided what staff will do with the time saved, and told them? | Double (decided + told) | **Have you told the staff concerned what they will do with the time this tool saves?** Telling implies deciding, so one question is enough. |
| P5 (Must when the tool acts alone) | Can staff override the AI and report its errors? | Double (override + report) | **Can staff overrule the tool when it gets something wrong?** This is the essential part and the must-have. Reporting errors moves to O6, which already covers it. |
| P6 | Have board members or owners had an AI briefing or training? | Either-or, twice (board or owners; briefing or training) | **Have the people who approve this spending had a briefing on AI?** Note: currently never selected by the rules. |
| O6 | Do staff feel able to test, question and report problems with AI? | Double (three verbs); Not Y/N (a manager cannot know how staff "feel") | **Do staff know whom to tell when the tool gets something wrong?** Observable, one thing. |
| X1 | Have the staff who will use it seen it, and do they expect it to help their work? | Double (seen + expect) | Essential: **Have the staff who will use the tool tried it or watched a demo?** Optional second question: **After seeing it, did most of them say it would help their work?** |

### Skills

| Code | Current text | Verdict | Proposed rewrite |
|---|---|---|---|
| P2 | Can the managers involved explain what the tool does, its limits, and name at least one alternative on the market? | Double (three things) | Essential: **Can the managers involved name one thing this tool cannot do reliably?** Optional second: **Did you compare at least one other product before choosing this one?** |
| P3 | Is there a training plan covering both use of the tool and checking its output? | Double | **Is training planned that teaches staff how to check the tool's results, not only how to use it?** |
| O4 | Have you tested the vendor's AI claims against your own needs (demo on your own data, references)? | Vague ("claims against your needs"); the bracket holds two different tests | Essential: **Have you seen the tool work on your own hotel's data?** Optional second: **Have you spoken to another hotel that already uses it?** |

### Financial investment

| Code | Current text | Verdict | Proposed rewrite |
|---|---|---|---|
| F1 Must | Is there a 12-month budget covering subscription, integration, training and running costs? | Double (four cost types; "Partly" could mean any mix); "integration" is jargon | **Is there a written budget for the first 12 months that covers the full cost of the tool, not only the subscription?** Helper line under it: "Full cost = subscription, set-up and connection to your systems, training, running costs." |
| F2 Must | Have you measured a baseline for the KPI this AI should move (hours, response time, revenue)? | Vague-jargon ("baseline", "KPI", "move") | **Have you written down today's figure for the one number this tool should improve (for example hours spent, reply time, revenue)?** |
| F3 | Have you set in advance when a pilot will be scaled or stopped? | Either-or (scaled or stopped); jargon ("pilot", "scaled") | **Have you agreed, before starting, what result the trial must reach for you to keep the tool?** |
| F4 | Is it clear who pays (own cash, owner, system fund, grant, vendor bundle)? | Vague ("is it clear"); Not Y/N (the real answer is one of five options) | Pick-one: **Who will pay for the tool?** Hotel / Owner / Brand or group fund / Public grant / Included in a vendor package / Not decided. "Not decided" scores as No. Note: currently never selected. |
| F5 | Are usage and running costs monitored, with caps where pricing is usage-based? | Double, with a condition | Essential: **Does someone check the tool's bill every month?** Only if the price depends on use: **Is a spending limit agreed with the vendor?** |

### Technology infrastructure

| Code | Current text | Verdict | Proposed rewrite |
|---|---|---|---|
| T1 Must (not for light tools) | Can the tool exchange data both ways with the systems that hold what it needs? | Vague-jargon; a general manager cannot tell which "systems" are meant | **Has it been confirmed in writing that the tool can read from and write back to your hotel systems (for example your booking system, the PMS)?** Name the systems from the tool's own needs where available. The team must decide the evidence standard first: see section 4. |
| T2 | Is the core system cloud-based with documented open APIs, or an all-in-one that includes the AI? | Either-or + Double + jargon; Not Y/N. The clearest case of the owner's complaint. | Pick-one: **Which describes your main hotel system (PMS)?** (a) Online system that other software can connect to; (b) All-in-one system that already includes this AI tool; (c) Older system installed in the hotel, hard to connect; (d) Not sure. Score a or b as Yes, c as No. |
| T3 | Are internet, Wi-Fi and devices reliable where the tool will be used? | Double (three things); "reliable" is vague | Essential: **Where the tool will be used, does the internet connection work without regular dropouts?** Optional second: **Do the staff who will use it have a working device (phone, tablet or PC) for it?** |
| T4 | Do you have a list of your systems showing which are connected? | OK | Small polish: **Do you have a written list of the software your hotel uses that shows which ones share data?** |
| T5 | Is there a fallback if the tool or the vendor fails? | Either-or (mild); "fallback" is jargon | **If the tool stops working for a day, is there a written way to do the job without it?** |

### Data

| Code | Current text | Verdict | Proposed rewrite |
|---|---|---|---|
| D1 | Do you know which data this use case needs and where it sits? | Double; "Do you know" invites an automatic Yes | **Can you name the system that holds each piece of data this tool needs?** |
| D2 | Is guest data held in one profile or linked across systems? | Either-or | **When a returning guest books, can staff see their past stays, spending and preferences in one place?** |
| D3 | Does someone own data quality, with a regular check? | Double; "own data quality" is jargon | **Does a named person check at set times that the data this tool uses is correct and up to date?** |
| D4 | Is hotel content (rooms, services, policies) complete, current and structured? | Double (three qualities); "structured" is vague | **Is there one up-to-date source for your hotel's facts (rooms, services, prices, house rules) that the tool can use?** |
| D5 Must | Do you have a lawful basis and a vendor agreement for any guest or staff data the AI processes? | Double (two legal things); jargon ("lawful basis") | A split is truly needed and both parts stay must-haves. D5a: **Have you signed a data processing agreement with the vendor of this tool?** D5b: **Has your data protection contact confirmed in writing that you may use guest or staff data in this tool?** Add a first option "This tool uses no guest or staff data" that counts as met (for example energy tools). |

### Organisation and governance

| Code | Current text | Verdict | Proposed rewrite |
|---|---|---|---|
| O1 Must | Has top management or the owner approved a written plan (one page is enough) linking this AI to a business goal? | Double (approved + written + linked to a goal); "or" in the subject | **Has the person who decides on spending approved a short written plan that says what this tool should achieve?** Helper line: "One page is enough. In a managed or franchised hotel this is the owner." |
| O2 | Has the process been redesigned before being automated? | Vague; Leading (assumes a redesign is always needed) | **Have you written down, step by step, who does what once the tool is in use?** |
| O3 | Is the approval path clear, including owner sign-off in managed or franchised hotels? | Vague ("clear"); the last clause repeats the filter (only managed or franchised hotels see it) | **Do you have a written list of everyone who must approve this tool before you buy it (for example owner, brand, management company)?** |
| O5 | Do you have access to outside help (association, neutral adviser, peer hotels)? | Vague ("access to") | **Do you have a named contact outside the vendor whom you can ask for independent advice on this tool?** Note: currently never selected. |
| G1 | Is there a written policy on what staff may put into AI tools? | OK | Small polish: **Do you have written rules telling staff what they must not type into AI tools (for example guest data)?** |
| G2 (Must with sensitive data) | Is each use case reviewed for business, data, security and legal risk before launch? | Double (four risks); asks about general practice ("each use case"), not this tool; when it is a must-have the text does not mention the impact assessment that the rule requires | **Has a written risk check been done for this tool before it goes live?** Helper line: "It should cover data protection, security, legal duties and business risk." For tools with sensitive data, show instead: **Has a data protection impact assessment (DPIA) been completed for this tool?** |
| G3 | Is the level of human oversight set for this use case? | Vague-jargon | **Have you decided which of the tool's outputs a person must check before they take effect?** |
| G4 | Do security controls cover AI tools and their vendors? | Vague-jargon; a general manager cannot answer it | **Has your IT or security contact checked this vendor's security before it gets access to your systems?** |
| X2 | Can guests always reach a person, and have you checked that guests accept this tool? | Double; "always" is an absolute | A split is truly needed. Essential, X2a: **Can a guest who does not want to use the tool reach a staff member instead?** X2b: **Have you tested the tool with real guests or collected their feedback on it?** |
| XG Must (staff tools) | Have staff representatives (works council or staff committee) been informed or consulted before the tool is used on staff? | Either-or ("informed or consulted" are different legal steps); Not Y/N for a hotel with no representatives, because must-haves have no "Does not apply" and the user must answer Yes to mean "we have none" | Filter first, pick-one: **Does your hotel have staff representatives (works council, staff committee or union delegates)?** If No: must-have counts as met, with a note. If Yes: **Have they been formally told about this tool before it is used?** Whether consultation or agreement is also needed depends on the country; that belongs in D7, not in the question. |

**Splits truly needed (3):** D5, X2, XG (as a filter plus one question). **Optional second questions (5):** X1, P2, O4, F5, T3. Everything else becomes one question. If length matters, drop the optional seconds; the check then grows by only 2 questions for most tools.

**Recurring wording habits to remove everywhere**
- "this AI use case" / "this use case" / "the AI": say "this tool". The user picked a tool on the previous screen.
- Passive, ownerless questions ("Is it clear…", "Is the level … set"): ask what was done and by whom.
- Brackets that carry a second question or a list of alternatives: move them to a helper line under the question.
- Trade words without a gloss: PMS, KPI, baseline, API, pilot, scale, fallback, lawful basis, DPIA, human oversight, security controls.

---

## 2. Generated resource questions

**How they are built.** For each area the tool takes the team's short note on what the use case needs and wraps it: "Do you have what this tool needs here: " + note with a lower-cased first letter + "?". The notes were written as internal shorthand, not as questions.

**Sample (30 of 536, all six areas, 23 different tools).** Text shown as the user sees it.

| # | Tool | Area | Question as shown | Problem |
|---|---|---|---|---|
| 1 | rm-1 | People | …: revenue manager owns it and reviews forecasts; GM signs off strategy? | Three things; "GM" |
| 2 | rm-3 | People | …: revenue or sales manager? | Either-or; job title only |
| 3 | kc-5 | People | …: chef? | Fragment; unclear what Yes means |
| 4 | gm-4 | People | …: group AI lead, central AI team, steering committee? | List of three |
| 5 | hr-2 | People | …: hR manager reviews every decision? | Broken first letter |
| 6 | rm-2 | Skills | …: pricing strategy; judge when to switch autopilot off? | Two things; second is an instruction |
| 7 | rm-3 | Skills | …: choose a sensible competitive set? | Instruction, not something you "have" |
| 8 | sm-5 | Skills | …: read ROAS; set budgets and targets? | Jargon; three things |
| 9 | res-7 | Skills | …: understand AI-assistant channels and MCP? | Jargon |
| 10 | kc-2 | Skills | …: allergen knowledge to verify output? | Reads acceptably |
| 11 | rm-1 | Finance | …: rMS subscription (often per room); onboarding fee? | Broken letter; two items; describes the vendor's price model |
| 12 | rm-4 | Finance | …: usually an add-on to the RMS/BI licence? | Not a question at all |
| 13 | fo-1 | Finance | …: per check-in or subscription; kiosk hardware if used? | Either-or + condition, and no "Does not apply" is offered |
| 14 | me-3 | Finance | …: project cost; high? | Fragment |
| 15 | lg-1 | Finance | …: subscription; free public platforms exist in some countries? | Second half is a remark |
| 16 | rm-1 | Technology | …: two-way PMS/CRS link; RMS? | Three acronyms; repeats must-have T1 |
| 17 | res-1 | Technology | …: telephony (SIP) integration; read/write PMS/CRS for bookings? | Jargon; two items |
| 18 | me-1 | Technology | …: bMS with open protocols (e.g. BACnet); metering? | Broken letter; jargon |
| 19 | fa-3 | Technology | …: bank, card, OTA, PMS and accounting feeds? | List of five |
| 20 | gm-6 | Technology | …: staff app? | Short but answerable |
| 21 | rm-2 | Data | …: forecasts plus competitor rates; rate plans and restrictions set up cleanly? | Four things |
| 22 | gx-4 | Data | …: single guest profile; preferences captured; consent? | Three things; repeats D2 |
| 23 | fo-3 | Data | …: biometric data: special-category data (GDPR Art. 9)? | A legal label, not a need |
| 24 | hr-1 | Data | …: occupancy, covers, events; staff availability and contracts? | List of five |
| 25 | pr-6 | Data | …: price history for key items? | Reads acceptably |
| 26 | sm-6 | Organisation | …: —? | Empty question |
| 27 | res-1 | Organisation | …: tell callers they speak to AI (EU AI Act Art. 50 – see D7); call-recording consent? | Instruction; two things; internal reference "see D7" |
| 28 | hr-2 | Organisation | …: high-risk AI under the EU AI Act (employment) – human oversight, DPIA (see D7)? | Legal statement, not a question |
| 29 | lg-2 | Organisation | …: gDPR / FADP / UK GDPR (see D7)? | Broken letter; names of three laws |
| 30 | rm-1 | Organisation | …: rules for when staff override forecasts? | Reads acceptably |

In this sample 26 of 30 read badly.

**Across all 536**

| Problem | Count | Share |
|---|---|---|
| Lists several items (";", "and", "plus", commas) | 240 | 45% |
| of which joined by ";" | 118 | 22% |
| "A or B" or "A/B" | 89 | 17% |
| Starts with a verb, so "Do you have … : read forecasts?" does not parse | 66 | 12% |
| Trade acronyms or jargon without explanation (PMS, RMS, CRS, BMS, GRMS, ROAS, MCP, PCI DSS …) | 123 | 23% |
| Broken first letter, caused by lower-casing acronyms ("rMS", "pMS", "cRM", "gDPR", "aI", "iD", "f&B", "wi-Fi") | 61 | 11% |
| Internal reference "see D7" shown to the client | 14 | 3% |
| Hedges that are remarks, not needs ("usually", "often", "if used", "claimed by vendors") | 15 | 3% |
| Empty: "Do you have what this tool needs here: —?" | 15 | 3% |
| Flagged by at least one of the rules above | 390 | 73% |

Two area-wide problems the rules do not catch:
- **Finance (90 of 90):** every note describes how the vendor charges ("subscription", "per-invoice fee", "usually part of the RMS"). A hotel that has not bought the tool cannot "have" this. The real question is whether the cost is budgeted, which F1 already asks.
- **People (50 of 90):** the note is only a job title ("chef", "purchasing manager", "sales team"). "Do you have … chef?" will always get Yes and tells nothing.

Of the 146 questions with no flag, most are still bare fragments. My reading: fewer than one in ten of the 536 reads as a natural question a manager can answer with confidence.

**Other points**
- **Double counting.** Many resource questions repeat a fixed question in the same area and are scored again: People repeats P1 (owner), Finance repeats F1, Technology repeats T1/T2, Organisation repeats G3/P5/G1/XG.
- **No "Does not apply".** The code offers it only on fixed non-must-have questions, yet resource notes contain conditions such as "kiosk hardware if used".
- **Bug behind the 15 empty questions.** The skip rule tests for a word boundary after "—", which never matches, so the dash is treated as a real need. "None" is skipped correctly (4 cases).

**Proposed pattern: a short checklist per area instead of one sentence**

1. Split each note at ";" into separate items (the team reviews the result once; about 700 short items).
2. Show them under an area-specific heading as tick boxes: "In place / Not yet / Does not apply".
3. Score the group once: all in place = Yes (2), some = Partly (1), none = No (0). This is the one place where "Partly" has an exact meaning.
4. Use a different stem per area, because one stem cannot fit a person, a skill, a cost and a rule:

| Area | Stem | Example from rm-1 |
|---|---|---|
| People | "Who needs to be involved. Tick those you have agreed with:" | The revenue manager is in charge of the tool and checks its forecasts / The general manager signs off the pricing strategy |
| Skills | "The people involved can:" | Read how accurate a forecast was / Spot wrong input data / Overrule a forecast and note why |
| Finance | "Your budget includes:" | The subscription for the revenue system (often priced per room) / A one-off set-up fee |
| Technology | "In place and working:" | A revenue system / A two-way connection between it and your booking system (PMS) |
| Data | "You have this data, complete and current:" | At least one year of booking, pickup and cancellation history by guest segment |
| Organisation | "Agreed in writing:" | When staff may overrule a forecast |

5. Clean the item texts: full nouns instead of shorthand, a small glossary for the acronyms that must stay (PMS = hotel booking system), no "see D7", no remarks. Remove items that only repeat a fixed question.
6. Minimal fix if the checklist cannot be built now: fix the "—" skip, stop lower-casing a first word whose second letter is a capital, strip "(see D7)", add "Does not apply", and change the stem to "This tool needs: <text>. Is all of this in place?".

---

## 3. Answer scale

**What works.** Four options are quick. Telling users that "Not sure" counts as No and becomes a to-do is honest and clear. No "Does not apply" on must-haves is the right default.

**What does not fit**

| Issue | Where | Fix |
|---|---|---|
| "Partly" has no stated meaning. Today it mostly means "one half of a two-part question", which hides which half is missing. | All 23 double or either-or questions | After the rewrites, relabel to "In progress" and add one line per must-have saying what counts as Yes. |
| Some questions are plain facts with no middle ground (signed or not, approved or not, informed or not). | D5a, O1, XG, G1, T4, X2a | Yes / Not yet / Not sure. |
| Yes/No cannot hold a choice between alternatives. | T2, F4, XG filter | Pick-one, scored behind the scenes. |
| No way to say a must-have does not apply. | D5 for tools without personal data; XG for hotels without staff representatives | A first option that counts as met ("uses no guest or staff data"; "we have no staff representatives"). |
| "Does not apply" missing. | All resource questions | Add it. |

**Where another format would be better, kept short.** Do not add input fields to the questions themselves. The evidence line on must-haves already collects the numbers and dates that matter (hours per week for P1, amount for F1, figure and date for F2, dates for O1, G2, XG). Only three questions should change format: T2, F4 and the XG filter become pick-one. Everything else stays on the scale.

---

## 4. Evidence prompts (EVIDENCE in logic.js)

Shown only after "Yes" on a must-have: one line of free text, a plain ask and a filled-in example. A Yes without the line counts as Partly, and the screen says so. This is proportionate: 5 to 9 lines per check, about 2 minutes.

| Code | Ask | Clear? | Comment |
|---|---|---|---|
| P1 | Who is it, what is their role, and how much time do they have for it? | Yes, but three questions in one line | Ask for role and hours only. A personal name is not needed and is saved to the shared database. |
| F1 | Where is the budget written down, and roughly how much is it for the year? | Yes | Make the amount optional; some clients will not want to state it. |
| F2 | Which number will you use to judge the tool, and what is it today? | Yes, the best of the nine | Model for the others. |
| T1 | How do you know the tool can exchange data with your systems? | Yes | The example ("vendor confirmed … tested at a reference hotel") contradicts the question's own proof standard ("Live test on your own systems, not a demo"), which is shown on the result page. Decide one standard. |
| D5 | Which agreement covers the data, and does it say who owns it? | Mostly | Does not ask for the lawful basis, which the question requires. The note under the question adds three more things (ownership, getting data back, vendor training on it). Too much for one line; follow the D5a/D5b split. |
| O1 | Who approved the plan, and when? | Yes | Good as it is. |
| P5 | Who can override or stop the tool, and how? | Yes | Fine. |
| G2 | When was the risk review (including a data protection impact assessment) done, and by whom? | Yes | The prompt asks about an impact assessment that the question text never mentions. Align them (see G2 rewrite). |
| XG | When were staff representatives informed, or do you have none? | No | Either-or. It makes a user with no representatives answer "Yes". Solved by the filter question. |

General points:
- The evidence line appears only after Yes. A user who answers Partly never sees what Yes requires. Show a short "What counts as Yes" line under every must-have before the answer.
- Two standards exist side by side: the EVIDENCE example on the question screen and the older proof text ("What good looks like") on the result page and PDF. Use one text for both.
- Any text, even one letter, counts as proof. That is acceptable for a self-check, but the result should say "stated by the hotel, not verified".
- The notes under some questions end with "(research, 18 Nov 2026)". This is a team reference and should not be shown to clients.

---

## 5. Top 10 fixes, in priority order

1. **Rewrite the 9 must-have questions** (P1, F1, F2, T1, D5, O1, P5, G2, XG). Each has a wording problem and each can cap the score at 39.
2. **Replace the either-or questions** (T2, F3, D2, P6, T5, XG): pick-one for T2, single condition for the rest.
3. **Give D5 and XG a way out when they do not apply** (no personal data; no staff representatives), counted as met.
4. **Turn the generated resource questions into a tick list per area** with area-specific stems (section 2).
5. **Fix the three template faults now:** 15 empty "—?" questions, 61 broken first letters, 14 "see D7" references.
6. **Rewrite the other 17 double-barrelled questions** to one question each (table in section 1); keep at most the 5 optional second questions.
7. **Say what counts as Yes** under each must-have before the answer, and use one proof text for the question screen and the result page (resolve the T1 contradiction).
8. **Plain words throughout:** "this tool" instead of "use case"; gloss or replace PMS, KPI, baseline, pilot, fallback, lawful basis, DPIA, human oversight, security controls.
9. **Remove overlap:** resource questions that repeat P1, F1, T1, G3; P5/O6/X1 overlap on staff. Decide what to do with P6, F4 and O5, which the rules never select, and F5, selected for one tool.
10. **Tidy the evidence prompts:** role instead of personal name (P1), amount optional (F1), rewrite XG, hide "(research, 18 Nov 2026)" from clients.

## Overall verdict

- **Strengths:** short, concrete topics that match what the research says matters; the flow per area is easy to follow; must-haves with a one-line proof and filled-in examples are a strong idea; "Not sure" is handled honestly.
- **Weaknesses:** 23 of 34 fixed questions ask two or more things or "this or that", including all the must-haves that carry more than one condition, so "Partly" is doing the work of a missing second question.
- The generated resource questions are internal shorthand inside a sentence frame: about three in four are flagged, 15 are empty and 61 start with a broken word. They are the weakest part of the tool.
- Wording assumes the team's vocabulary (use case, KPI, baseline, PMS, lawful basis, D7); a general manager with no AI background will guess on roughly a third of the items.
- The structure and rules can stay. The fix is editorial: one condition per question, three pick-one questions, a tick list for tool-specific needs, and one stated standard for "Yes".
