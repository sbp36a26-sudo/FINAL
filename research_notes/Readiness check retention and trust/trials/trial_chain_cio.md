# User trial: chain CIO ("Jonas")

*Trial run 18 Nov 2026 against `http://127.0.0.1:8765/readiness-check/index.html` (rules v2, 18 Nov 2026), driven in headless Chromium with Playwright at 1280 x 900. Source code was read only after the first full runs. Scripts and screenshots: `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/trial-cio/` (temporary folder).*

**Persona.** Jonas, CIO of a 45-hotel midscale and upscale group in Germany, Austria and Switzerland (about 6,800 rooms), 14-person IT team, central data warehouse, data protection officer, works councils in Germany. Expert in hotel tech, well read on the EU AI Act, sceptical of scorecards.

**One-line verdict.** A tidy checklist that confirms what a prepared CIO already knows, catches the works council and impact-assessment gaps but describes them too loosely for German law, and can be pushed to "100, Ready to scale" on a high-risk recruiting tool by typing "x" eight times.

**Score for valuable insight: 3 / 10.**

---

## 1. What was run

| Run | Tool picked | Answers | Result |
|---|---|---|---|
| A | Dynamic pricing & rate optimisation (incl. autopilot publishing) | Well prepared, 7 realistic proof notes, one "Partly" (process redesign) | **98, Ready to scale** |
| B1 | AI recruiting (conversational hiring, screening, matching) | Strong on budget, tech and data; works council = No; risk review / DPIA = No; AI Act need = No | **39, Build foundations first** (2 must-haves not met; area average 80) |
| B2 | Labour demand forecasting and scheduling | Same gaps | **39, Build foundations first** (1 must-have not met; area average 75) |

The tool offers 90 use cases in 15 departments. For "a tool that affects staff" the closest are AI recruiting (CV screening), labour scheduling, retention and attrition prediction, and AI call scoring (performance monitoring). Searching "rota" and "CV" finds the right tools; "performance" finds only RM copilots and meeting automation, not call scoring or attrition; "works council" finds nothing.

Flow: hotel details, pick a tool, six steps (People, Skills, Financial investment, Technology infrastructure, Data, Organisation & governance), 22 questions for pricing, 26 for recruiting, 23 for scheduling. Each run took about 5 minutes for someone who knows the answers.

---

## 2. Does it catch the staff and legal issues?

**Yes, at headline level.** For recruiting it adds three things that the pricing run did not have:

- A must-have: "Have staff representatives (works council or staff committee) been informed or consulted before the tool is used on staff?"
- A must-have: "Is each use case reviewed for business, data, security and legal risk before launch?" with the note "Must-have because the tool handles sensitive personal data: include a data protection impact assessment (research, 18 Nov 2026)."
- A scored question: "Do you have what this tool needs here: high-risk AI under the EU AI Act (employment) – human oversight, DPIA (see D7)?"

Either unmet must-have caps the score at 39. That is the right instinct. An expert would still mark the following as wrong or too vague.

| # | What the tool says | Problem for an expert |
|---|---|---|
| L1 | "informed or consulted"; proof example "Works council informed on 20 Oct; minutes on file" | In Germany, software able to monitor staff behaviour or performance falls under co-determination (BetrVG § 87(1) no. 6): the works council must agree, normally through a works agreement. Selection guidelines for hiring, including AI-made ones, need consent under § 95. Austria has a comparable works-agreement requirement (ArbVG §§ 96, 96a). "Informed, minutes on file" passes the tool's gate and would not pass a German labour court. The gate is set below the legal bar in the country Jonas selected. |
| L2 | "before the tool is used on staff" (on the recruiting tool) | Recruiting acts on candidates, not staff. The tool never mentions the duties owed to candidates: telling people they are subject to a high-risk system (AI Act Art. 26(11)), the right to an explanation (Art. 86), automated decisions under GDPR Art. 22, or equal-treatment law. |
| L3 | "high-risk AI under the EU AI Act (employment) – human oversight, DPIA (see D7)" | Three faults in one line. (a) A DPIA is a GDPR Art. 35 duty, not an AI Act duty. (b) The deployer duties in Art. 26 are reduced to "human oversight": missing are use according to the provider's instructions, competent and trained oversight staff, input-data relevance, monitoring and incident reporting, keeping logs at least six months, informing workers and their representatives (Art. 26(7)), and AI literacy (Art. 4). (c) "(see D7)" is internal project jargon; there is no link and a user cannot know what D7 is. |
| L4 | Same question is an ordinary scored item, not a must-have | Answering "No" to the AI Act question while passing the gates gave **96, Ready to scale** (test T5). A tool the checklist itself labels high-risk can be "ready to scale" with the legal duties unmet. |
| L5 | No article, no annex point, no date anywhere on the client pages | The source code holds a reason line, "AI Act Art. 26(7) adds a duty for high-risk staff tools from 2 Dec 2027", but the user never sees it. An expert needs Annex III point 4(a)/(b), Art. 26, and the application date with its source, on the page. |
| L6 | Scheduling tool: only "working-time law; works-council consultation" | No word on the AI Act. Annex III 4(b) covers task allocation "based on individual behaviour or personal traits or characteristics". Demand-based rota forecasting is probably outside; a scheduler that ranks staff by past performance is inside. The tool should ask that one differentiating question. It does not. No DPIA gate either, although rota data is employee data. |
| L7 | Country field | Has no effect. With Switzerland or United Kingdom selected, the recruiting questions are word for word the same, still citing the EU AI Act. One country only, so a DACH group cannot describe itself. |
| L8 | Which tools get the works-council must-have | Applied to BI dashboards and spend analytics, but **not** to physical security video analytics, GenAI copilots for staff, staff messaging or the frontline knowledge assistant (checked in the source after the trial). Video analytics of staff areas is a textbook § 87(1) no. 6 case. Arguably the RMS itself logs user actions and is covered too. |
| L9 | Human override on recruiting | "Can staff override the AI and report its errors?" is a must-have for pricing (acts alone) but optional, with "Does not apply" offered, for recruiting. "Is the level of human oversight set for this use case?" also offers "Does not apply". For a high-risk system human oversight is a statutory duty. |
| L10 | Fundamental-rights impact assessment | Not mentioned. For a private hotel group it mostly does not apply (Art. 27 targets public bodies and a few private cases), but an expert expects the tool to say so, since "impact assessment" is ambiguous between DPIA and FRIA. |
| L11 | Dynamic pricing | No legal question at all beyond the data-processing agreement. Missing: competition-law risk of shared pricing algorithms and competitor-rate inputs, disclosure of personalised pricing under EU consumer law, rate-parity and brand floor rules. |

---

## 3. Break tests

| Test | What happened | Sensible? |
|---|---|---|
| Skip questions | "Next" stays disabled until every question on the step is answered; counter reads "1 of 6 answered". | Yes. |
| All Yes, no proof (pricing) | 39. "Score capped at 39 because 7 must-haves not met. The average of your six areas is 85." Each line flagged "Yes without proof counts as Partly". | Yes, clear. |
| All Yes, proof = "x" (recruiting) | **100 / 100, Ready to scale.** | **No. Fully gamed.** Any non-blank text is accepted. |
| All Yes, proof = one space | 39, 8 must-haves not met. | Yes (trimmed). |
| All "Not sure" | 0 / 100; all 8 must-haves listed with "What good looks like". | Yes, and the to-do list is the most useful output of the tool. |
| All "No" | 0 / 100. Identical to all "Not sure". | Acceptable. |
| All "Partly" | 39 (area average 50, capped). | Acceptable. |
| Must-haves Yes + "x", every optional question "Does not apply", AI Act need = No | **96, Ready to scale.** | **No.** "Does not apply" removes a question from the denominator with no reason asked. |
| Reload mid-way | Returns to the same step with answers and proof text kept. | Yes, good. |
| In-app Back | Earlier step, answers and proof kept. | Yes. |
| Browser Back button | Leaves the tool entirely (the steps are not in browser history). Reopening the address restores the draft. | Tolerable, but an expert user will hit it. |
| Different tool half-way | "Back" from step 1, "Choose another tool", pick another: **all answers and proof notes wiped without warning**, including questions that are identical across tools (owner, budget, plan). | Poor. No confirmation, no carry-over. |
| Change answers after a result | Re-opens step 1; result updates and overwrites the saved check (no version kept). | Fine; no history of the change. |
| Start a new check | Hotel details kept, tool and answers cleared. The first check is still in browser storage but **nowhere visible**. | Poor for comparing. |
| PDF | Downloaded locally: `AI-readiness-check_Alpenrhein-Hotels-Group.pdf`, one page. | Works. |
| Copy summary | Clipboard gets four lines: name, score, six area percentages, must-have questions. | Works. |
| 390 px width | No sideways scroll. | Fine. |

**Scoring behaviour worth knowing** (from the source, confirms what was seen): Yes 2, Partly 1, No and Not sure 0; each area is a percentage; the score is the plain average of the six areas; any unmet must-have or an area under 40% caps at 39; an area under 75% caps at 74.

- The cap is flat. One unmet must-have (B2) and seven unmet must-haves (all Yes, no proof) both show **39**. The number carries no information below the cap.
- Areas have 2 to 8 questions but equal weight. In the recruiting run one Data question is worth 1/12 of the score and one Governance question 1/48. In the pricing run Skills has 2 questions, so a single "No" puts Skills at 50% and caps the whole result at 74.
- The verdict sentence is fixed per level. B1 and B2 failed only on works council and risk review, yet were told: "Do not buy yet. Fix the gates: name an owner, set a budget and baseline, check connections and data terms, agree a one-page plan." All five of those were already met with proof.

---

## 4. Side by side

| | A: Dynamic pricing | B1: AI recruiting |
|---|---|---|
| Score, verdict | 98, Ready to scale | 39, Build foundations first |
| Questions | 22 (7 must-haves) | 26 (8 must-haves) |
| Extra must-haves | Human override (acts alone) | Risk review incl. DPIA; staff representatives |
| Tool-specific questions | 6, e.g. "revenue manager; owner or GM sets floors and ceilings for autopilot" | 6, e.g. "hR manager reviews every decision", "fair-hiring practice; check AI screening" |
| Advice text | Generic "Roll out only if the pilot met its KPI…" | Generic "Do not buy yet. Fix the gates: name an owner…" (wrong for this case) |
| Gaps list | 1 line: process redesign | 2 must-haves + 8 gaps, all restated questions |

**Does it differentiate?** In the questions, partly: about a quarter are tool-specific and the must-haves shift with risk. In the result, the numbers differ but the page is the same template. The gaps are the user's own answers read back; there is no "do this next, by whom, by when", no legal reference, no benchmark. The recruiting result reads like the pricing result with two extra lines.

**Portfolio view.** None. One check at a time, no list of past checks, no comparison, no way to hold both in view except two PDFs. The README shows a separate "Team: readiness results" page for the project team; the hotel user gets nothing like it.

---

## 5. Did either result tell Jonas anything he did not know?

| # | Insight | Tool's words | Rating |
|---|---|---|---|
| 1 | Works council must be handled before a staff tool goes live | "Have staff representatives (works council or staff committee) been informed or consulted before the tool is used on staff?" | **Obvious** to a German CIO, and under-stated (L1). Useful only as a reminder to GMs. |
| 2 | Risk review with DPIA is a gate for sensitive-data tools | "Must-have because the tool handles sensitive personal data: include a data protection impact assessment" | **Obvious.** His DPO already knows. |
| 3 | Recruiting is high-risk under the AI Act | "high-risk AI under the EU AI Act (employment) – human oversight, DPIA (see D7)" | **Obvious**, and imprecise (L3). |
| 4 | Vendor contract should cover exit and training rights | "Proof should also cover who owns the data, how you get it back if you leave, and whether the vendor may train on it" | **Useful.** A concrete clause check he can hand to procurement. Best line in the tool. |
| 5 | Proof discipline: a Yes needs a named owner, hours, a budget line, a dated baseline | "Needed for a must-have: until you add this line, your Yes counts as Partly." | **Useful** as a template for GMs, not new to him. |
| 6 | Process redesign before automation | "Has the process been redesigned before being automated?" | **Obvious.** |
| 7 | Staff acceptance as its own question | "Have the staff who will use it seen it, and do they expect it to help their work?" | **Useful**, mildly. Good prompt, no guidance behind it. |
| 8 | Autopilot pricing needs written floors, ceilings and an override | "written floors/ceilings and autopilot scope; owner approval in managed hotels" | **Obvious** for a group strong in RM. |

Nothing rated **valuable**. The pricing result (98, one generic gap) told him nothing. The recruiting result told him two things he walked in knowing.

---

## 6. Is the method defensible? What Jonas would challenge

1. **Evidence is not checked.** "x" is evidence. Any board member can reproduce 100/100 in two minutes. Self-assessment with free text is fine, but then the score must be labelled as self-declared and the proof notes must appear in the report so a reviewer can judge them. Today the PDF omits them.
2. **Thresholds 40 and 75, and caps 39 and 74.** Where do they come from? The footer says "team judgement still to be tested with hotels". Honest, but not something to put in front of a board.
3. **Equal weight per area, unequal questions per area.** Question weights vary by a factor of four inside one check and nobody chose them.
4. **Must-have list.** Why is a KPI baseline a hard gate for every tool, while AI Act deployer duties for a high-risk tool are not? Why is two-way integration a gate for recruiting?
5. **Sources.** The page cites "research, 18 Nov 2026" and "D6" and "D7". No published source, no legal article, no sample size, no named hotels. For a statistic-free tool that is acceptable; for must-haves framed as research findings it is not.
6. **No benchmark.** A score means nothing without "groups like yours score X on this tool".
7. **"Ready to scale" without ever asking about a pilot.** The verdict says "Roll out only if the pilot met its KPI" but no question asks whether a pilot ran or what it showed.
8. **Bundled questions.** "working-time law; works-council consultation?" and "high-risk AI under the EU AI Act (employment) – human oversight, DPIA" each pack two to three separate duties into one Yes / Partly / No.

**To trust it and show it to his board he would need:** the full working-out on the result page (which questions, why asked, points, cap rule; the team page already has this), proof notes printed in the report, legal references with dates per country, a visible rule set and change log, named reviewers (a labour lawyer and a DPO for the staff questions), and pilot data from real hotels behind the thresholds.

---

## 7. Would he use it across 45 hotels or give it to GMs?

**As it stands, no for the group; maybe as a pre-read for GMs.** The discipline of "name, hours, budget line, baseline, signed plan" is a decent gate to put in front of a GM who wants to buy a chatbot. The vocabulary is plain enough. But for a group it lacks:

- **Multi-property.** One hotel name, one country. No property list, no brand or cluster level, no split between what the group provides centrally (data warehouse, DPA, security review) and what each hotel must do.
- **Roles.** One respondent. No way for the DPO to answer the data step, HR the works-council step and the GM the rest; no sign-off.
- **Portfolio.** No list of checks, no comparison across tools or hotels, no heat map, no tracking over time.
- **Export.** One-page PDF and a four-line text summary. No CSV or JSON, no proof notes, no answers table. No API, no link to the AI register the same project is building.
- **Persistence.** "Saved in this browser only." A cleared cache loses everything. In the hosted hub version the code saves to a shared database and shows "Saved and shared with the EHL project team" only after submission; nothing on the start page says that budget figures and staff names typed as proof will be shared. That needs a notice before the first question.
- **Country logic.** DE, AT and CH differ sharply on works councils and the AI Act does not apply directly in Switzerland; the tool treats all countries the same.

## 8. Would he return?

Not for his own decisions. He would return if it gave him something he cannot build in a spreadsheet in an hour:

1. A group view: 45 hotels by N tools, with must-haves outstanding and owners.
2. Country-specific legal steps for staff tools (DE co-determination, AT works agreement, CH consultation and monitoring rules), with article references and dates, signed off by a named lawyer.
3. Benchmarks from the project's interviews: what comparable groups answered.
4. A re-check that shows movement since last time and a to-do list with owners and dates.
5. Export into his governance tooling and the AI register.

---

## 9. Top 5 fixes, ranked

1. **Close the gaming holes.** Minimum useful proof (length, a date or a name), print proof notes in the PDF, label the score "self-declared", require a reason for "Does not apply" and remove that option from human oversight on high-risk tools. Make the AI Act question a must-have for tools the catalogue labels high-risk.
2. **Fix the legal layer for staff tools.** Split "informed" from "consulted" from "agreed"; make the wording depend on the country field; cite Annex III 4(a)/(b), Art. 26 deployer duties, Art. 26(7), Art. 4, GDPR Art. 35 separately; add candidate duties for recruiting; add the task-allocation question for scheduling; extend the staff must-have to video analytics and staff copilots. Remove "(see D7)" or link it.
3. **Make the result say something.** Verdict text built from the actual unmet items (not the fixed "name an owner, set a budget…"), an action per gap with owner and what good looks like, and a score that still differentiates below the cap (for example "2 of 8 must-haves open").
4. **Show the working.** Why each question was asked, points per area, the cap rule, rule-set version and sources on the client result page and in the PDF.
5. **Portfolio and group basics.** A "My checks" list with side-by-side comparison, keep shared answers when switching tools, multi-country and multi-property fields, CSV / JSON export.

---

## 10. Bugs, with reproduction steps

| # | Severity | Bug | Steps |
|---|---|---|---|
| B1 | High | Typing is lost and focus drops after the hotel name | Open the start page. Click "Hotel or group name", type a name, press Tab (or click "Your name and role"). Focus lands on the page body, not the next field; what you type next goes nowhere. You must click the field a second time. Cause: the `change` handler re-renders the whole view while focus is moving. |
| B2 | High | Junk proof passes every must-have | Pick "AI recruiting", answer Yes everywhere, type "x" in each proof line. Result: 100 / 100, Ready to scale. |
| B3 | High | "Does not apply" plus a No on the AI Act question still scales | Pick "AI recruiting"; must-haves Yes with any text; every question that offers "Does not apply" set to it; "high-risk AI under the EU AI Act…" = No. Result: 96, Ready to scale. |
| B4 | Medium | Verdict text contradicts the result | Run B1 above (all generic gates met, works council = No). Text reads "Fix the gates: name an owner, set a budget and baseline, check connections and data terms, agree a one-page plan", none of which is open. |
| B5 | Medium | Switching tool wipes answers silently | Answer step 1, click Back to the start, "Choose another tool", pick any tool, Start. All answers and proof notes are gone; no warning. |
| B6 | Medium | Earlier checks cannot be reopened | Finish a check, click "Start a new check". The first check stays in browser storage but no screen lists it. |
| B7 | Low | Lower-cased first letters | "Do you have what this tool needs here: hR manager reviews every decision?", "…: rMS subscription; channel-manager fees?", "…: rMS writes rates to PMS/CRS…". The first letter of the need is lower-cased even for acronyms. |
| B8 | Low | Internal references shown to users | "(see D7)", "research, 18 Nov 2026", header "Deliverables 4 and 6", chip "New question". |
| B9 | Low | Proof notes and respondent missing from the PDF and the summary | Download the PDF after run A: none of the seven proof lines nor the name and role appear. |
| B10 | Low | Country has no effect | Select Switzerland or United Kingdom with "AI recruiting": identical questions citing the EU AI Act. |
| B11 | Low | Browser Back leaves the tool | On any step press the browser Back button: the previous site loads. Draft is restored on return. |
| B12 | Low | Tool-type label reads oddly | Scheduling is tagged "Forecast and pricing tool"; "Agentic platforms tool". Progress bar is not full on step 6 of 6. |
| B13 | Low | Unreachable example for a group | Proof prompt "When were staff representatives informed, or do you have none?" lets a 45-hotel German group answer Yes with "none". |

Not bugs: PDF and copy both worked in the local browser.

---

## 11. Evidence

- Result texts quoted above were read from full-page screenshots and page text of each run: `a_result.png`, `b_rec_result.png`, `b_sch_result.png`, `c2_result.png`, `c3_result.png`, `c4_na_game.png`, `d5.png`, plus step screenshots `a_step1…6.png`, `b_rec_step1…6.png`.
- PDF checked: `b_rec_report.pdf` (one page).
- Source read after the trial to explain behaviour: `tools/readiness-check/src/logic.js` (question selection, scoring, caps), `src/check.js` (result page, PDF, events), `src/store.js` (saving), `README.md`.
- Legal remarks in section 2 are the persona's expert reading, not legal advice; article numbers should be confirmed against the D7 briefing before any of this goes into the tool.
