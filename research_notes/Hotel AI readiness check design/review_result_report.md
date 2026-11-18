# Review of the readiness check's result and report

*Reviewer's notes, 18 Nov 2026. Read from a hotel consultant's seat. Based on `tools/readiness-check/src/check.js` (`vResult`, `makePdf`, `summaryText`), `src/logic.js` (`evaluate`, `gaps`, `EVIDENCE`), the data embedded in `index.html` (`rdy.*`, `cat`), `tools/register/data/*.json` and `reports/Hotel AI readiness check design.md`. No repository file was changed.*

## Bottom line

The check asks 18 to 31 good, tool-specific questions and then throws most of the answers away. The result is a scorecard, not advice. Almost everything a much better report needs is already in the data file or in the user's own answers and is simply not shown. About 80% of the proposed report can be built without new research; the rest is short authored text (one fix line per question, example KPIs per type of tool), not evidence gathering.

---

## 1. Verdict on today's result and report

### What works

- **The verdict logic is sound and honest.** Must-haves and the weakest area decide the level; the cap is explained with the uncapped average.
- **It is about one tool**, not "AI in general". No public tool found in the research does this.
- **Must-haves need proof**, and each shows "what good looks like".
- **Short.** A GM can read the result in one minute.

### What is weak

| # | Weakness | Where it shows |
|---|---|---|
| 1 | **The gaps are the questions repeated back.** "Have you set in advance when a pilot will be scaled or stopped? [No]" tells the manager what he already said. No fix, no owner, no effort, no order beyond the list position. | `vResult`, `makePdf` |
| 2 | **The user's own proof notes are never shown again.** The hotel typed a name, a budget line, a baseline figure. None of it reaches the result, the PDF or the summary. This is the most valuable content in the session. | `st.P` unused in all three outputs |
| 3 | **"Not sure" is mixed with "No".** The design report asked for a separate "Find out" list (change 20). A "Not sure" needs a phone call; a "No" needs work. | `gaps()` ranks `n` and `u` the same |
| 4 | **The verdict sentence is generic and can be wrong.** "Fix the gates: name an owner, set a budget and baseline…" appears even when those gates are met and the only miss is, say, staff representatives. | `rdy.levels[0].action` |
| 5 | **Nothing about the tool itself.** The use case's six resource needs (`uc.r`), type of tool (`arch.what`, `extra`, `risk`, `cost`), risk add-ons (`addons.need`) and effort rule (`rdy.rule`) are not in the result. | all unused |
| 6 | **No reasons.** `selectQuestions` records why each question was asked (`reasons`, `note`); only the team page shows it. | unused in client result |
| 7 | **Area bars without meaning.** "Skills 50%" rests on about four items, so one answer moves it 12 points. No points shown, no "what good looks like", no route for a small hotel versus a chain (`areas.routes`). | `bars()` |
| 8 | **Only 8 gaps, cut silently.** A hotel with 15 gaps never sees seven of them. The PDF also drops the "what good looks like" text the screen shows for these gaps. | `.slice(0, 8)` |
| 9 | **No legal flag.** A hotel can score "Ready to pilot" on staff call scoring, which the AI Register labels high-risk, and the report says nothing. | no link to `uc-labels.json` |
| 10 | **The PDF does not say who answered, what kind of hotel, or that it is self-reported.** Person, role and hotel type are collected and left out. No date to re-check. | `makePdf` header |
| 11 | **Missing honesty lines.** The 40% and 75% thresholds are a team proposal (`rdy.levelsNote`); 56 of 91 use cases have no evidence ID (`uc.ev` empty) and rest on team judgement. Neither is disclosed to the hotel. | unused |
| 12 | **"Copy summary" is three lines** with no actions. It is the text most likely to be forwarded to the owner. | `summaryText` |

### What a GM or owner still does not know after reading it

1. **What do I do on Monday, and who does it?**
2. **How long until I can start a pilot?** One week or six months?
3. **What will this tool need from us** in money type, systems, data and people?
4. **Is this legal, and what must I check?** Especially for staff tools, cameras, biometrics, guest chat.
5. **What do I ask the vendor** before I sign?
6. **What does 39/100 mean?** A hotel with a raw average of 85 and one missing proof note sees 39. Without a plain explanation this reads as an insult and the report gets binned.
7. **If I am "Ready to pilot", what is a pilot?** Which KPI, what baseline, how long, when do I stop?
8. **Is my result normal?** No context at all, although sourced survey figures sit in the data file.
9. **(Owner) What am I being asked to approve or pay for?**

Blunt summary: today's report tells the hotel *how it scored*. It does not tell it *what to do, in what order, with whom, and what to watch out for*. A consultant who delivered this page would not be invited back.

---

## 2. Proposed report structure

Order follows the reader's questions: where am I, why, what do I do, what does the tool need, what could go wrong, what next. Field names are from the embedded data unless marked **NEW**.

| # | Section | What it says | Existing data that feeds it | New content needed |
|---|---|---|---|---|
| 1 | **Summary in plain words** (page 1) | Four sentences built from the result: verdict; the one thing that decides it; the weakest and strongest area; the first three actions. Then hotel, tool, who answered, date, "self-reported". | `ev.level`, `ev.unmet`, `ev.lowest`, `ev.scored`, `gaps()` top 3, `st.hotel.*`, `st.submittedAt`, `cat` use `task` (what the tool does, one line) | Sentence templates per case: must-have missing / area below 40% / area below 75% / scale. About 6 templates. |
| 2 | **What the score means** | Raw average and capped score side by side ("Your areas average 85. The score shows 39 because one must-have has no proof"). How many questions, how many must-haves, how many answered, how many "Not sure". The three bands. One line: thresholds are the project team's proposal, to be tested with hotels. | `ev.raw`, `ev.score`, `ev.cap`, `ev.capWhy`, `ev.steps`, `ev.answered`, `ev.gates`, `rdy.levelsNote` | None. Rewrite `levels[].action` so it no longer lists gates that are met (build the sentence from `ev.unmet`). |
| 3 | **This tool at a glance** | What kind of tool it is, why it is Light/Moderate/Heavy, what it needs in each of the six areas, how it is usually paid for, its typical risk, how widely hotels use it. | `arch.n`, `arch.what`, `arch.extra`, `arch.cost`, `arch.risk`, `uc.int` + `rdy.rule`, `uc.r` (six lines), `uc.add` → `addons.need`, `cat` use `use` (High/Medium/Low/Very low), `uc.ev` | None. Where `uc.ev` is empty, print "Team judgement, not yet backed by a source". |
| 4 | **Must-haves** | One card each, met and unmet. For met: the hotel's own proof note, shown back ("You told us: Maria Rossi, revenue manager, 4 h a week"). For unmet: what is missing, what a good answer looks like with an example, why it is a must-have for *this* tool, who usually does it. | `ev.gates` (not only `ev.unmet`), `st.P`, `q.proof`, `EVIDENCE[code].ask` and `.ex`, `q.reasons`, `q.note`, `g.flag` | **NEW:** one "how to fix" line and a usual owner per must-have (9 codes). Short authoring. |
| 5 | **Area by area** (six blocks) | Points and percent ("5 of 8 points"); each question with the answer; the tool's resource need for this area as the headline of "what good looks like for this tool"; the route that fits the hotel type; one sourced figure for context; one named example. | `ev.area[a].items`, `pts`, `max`; `uc.r[a]`; `areas.one`; `areas.needs` (with `strength`); `areas.routes.small` or `.chain` chosen by `st.hotel.type`; `areas.figs` (value, label, base, id); `areas.ex` | A rule for which route to show for managed/franchised hotels. Optional: one "what this means" sentence per band per area (18 short lines). |
| 6 | **Action plan** | Every open item, not eight. Three groups: **Before anything else** (unmet must-haves), **Find out** ("Not sure" and unanswered), **Close during the pilot** ("No", then "Partly", weakest area first). Each line: action, who, effort class, proof that it is done. Suggested order as 30/60/90 days, clearly labelled as a suggestion. | `gaps()` order and `kind`; `q.proof`; `EVIDENCE`; `areas.routes`; `uc.int` (Heavy tools: say the timeline depends on vendor and capital approval) | **NEW:** per question code (34 codes): action wording as an instruction, usual owner role, effort class (a decision / a document / a vendor step / a project). No day counts: no source supports them. |
| 7 | **Legal flags and items to check** | The AI Register label for this use case, the reason, the questions that can change the label, the items to check with who and from when, the national staff-consultation note for the hotel's country. Link to the AI Register tab. | `uc-labels.json` (same ids): `base`, `why`, `prov`, `basis`, `switches`, `packs`, `staff`; `reference.json`: `labels[].short`, `items` (text, who, when, ref), `dates`, `labourNotes`, `countryChecks` | None for content. Needs the label file bundled at build and the D7 sign-off it is waiting for. Until then print "Provisional label, items to check, not a compliance verdict". |
| 8 | **Questions for the vendor** | Six to ten questions chosen for this tool: integration proof, data terms, who the maker is, training on the hotel's data, type-specific test, what happens if the vendor fails. | `reference.vendorQuestions` (filtered by `for`), `arch.test`, `q.proof` for T1 and D5 and the D5 `note`, O4 text, `addons.need`, `uc.r.te`, `uc.r.or` | Two or three more questions per add-on (pay, hardware, acts alone) would help. Short authoring. |
| 9 | **What to do next** (by verdict) | *Foundations:* the short list that unlocks a pilot, and "do not sign yet". *Pilot:* a one-page pilot card pre-filled with the hotel's own KPI baseline, owner and budget notes, with blanks for target, length and stop rule. *Scale:* roll-out conditions and what to monitor. | `levels[].action`; `st.P.F2`, `st.P.P1`, `st.P.F1`, `st.P.O1`; F3, F5, T5 answers; `areas.needs` for finance ("no roll-out without a validated return") | **NEW:** example KPIs per type of tool (9 rows, examples only, no target values). Pilot card layout. |
| 10 | **Check again** | Suggested re-check date, the three things that will move the score most, and how the saved result can be compared. | `st.submittedAt`, `gaps()` top items, saved record (`submission()`), team page already recomputes | A rule for the date (for example after the 30-day items, and at pilot end). Later: show change since last check. |
| 11 | **How this was worked out, and sources** | Scoring in five lines, limits, source list with survey bases. | `ev.steps`, `rdy.limits`, `rdy.d6sources`, `rdy.method`, `rdy.belief.intro` | None. |

Two points on wording:

- **Show strengths.** List the areas at 75% or more and the must-haves met. A report that shows only gaps discourages the people who must act on it.
- **Use `rdy.belief` once, near the score**, as a short "why we ask for proof" box. It explains the proof rule with sourced examples and fits the story.

---

## 3. Numbers and benchmarks

### Can be shown, with source and base beside the figure

All of these are already in the data file with value, base and evidence ID. Show at most one per area, the one closest to the hotel's gap.

| Figure | Where | Caution |
|---|---|---|
| Barriers named by European hotels: knowledge 39%, set-up cost 35% (61% in 2023), complexity 34% | `rdy.figs`, `areas.figs`; HES-SO 2025, 1,485 hotels in six countries, 82% independent, median 31 rooms | n per question not stated; say so. Best fit for independents. |
| 42% of hotel company leaders confident their data is AI-ready | State of Hotel AI 2026, 107 leaders | Global, company level. |
| 13% of chains report a measurable return; 28% have a company-wide AI strategy; know-how self-rated 3.4/10 | h2c 2026, 113 chains | Global, vendor-sponsored. Do not place next to HES-SO as if comparable. |
| 11% of chains have a dedicated AI budget | h2c 2025, 171 chains | Chains only. |
| 9% of mostly small hotels have a formal strategy including AI | HES-SO/Britz 2025, about 79 hotels, 71% Swiss | Small base; state it. |
| 41% of properties have no AI policy; 73% got wrong results because AI could not reach other systems | Mews surveys | Vendor-commissioned; label it. |
| 48.83% of EU firms that considered AI cite data protection | Eurostat 2025 | All sectors, 10+ staff, not hotels. |
| Named cases (Marriott pilot, Meliá return rule, Accor, IHG) | `areas.ex`, `areas.why` | Cases, not benchmarks. |
| How widely the use case is used: High / Medium / Low / Very low | `cat` use `use` | A level from the catalogue, not a percentage. |
| AI Act dates and the legal reference of each item | `reference.dates`, `items[].ref` | Law as checked 17 Nov 2026; label file not yet signed off. |
| The hotel's own numbers: points per area, questions answered, must-haves met, its typed baseline | `ev.*`, `st.P` | Label as self-reported. |

### Must not be invented

- **Cost in euros per tool**, set-up cost, cost per room. `rdy.limits` states that no source gives costs or staffing per use case for European hotels. Show the *type* of cost only (`arch.cost`, `uc.r.fi`).
- **Return, payback or hours saved.** No basis per use case.
- **Days or weeks per action.** Use effort classes. The 30/60/90 grouping is a suggested order, and must say so.
- **"Hotels like yours score X"** or any percentile. No reference group exists. It becomes possible only from saved checks, and only with the number of checks shown.
- **A probability of success**, or any reading of the score as a likelihood. The 40% and 75% cut-offs are team judgement.
- **A compliance verdict.** Only "items to check".
- **USD 320,000 average AI budget per hotel** (Amadeus/Opinium): vendor-commissioned, mostly non-European, flagged "use with caution" in the data. Leave it out of a hotel-facing report.
- **The h2c barrier ranking** (38% or 56%): the design report says two sources disagree. Do not cite until checked at the original.
- Evidence IDs come from master v8_3 and should be refreshed from v8_4 before figures are printed in a client PDF.

---

## 4. Length and format

**On screen: short first, detail on demand.**

1. Summary block: score with raw average beside it, verdict, the four plain sentences, first three actions.
2. Six area bars, each opening to its diagnosis (section 5).
3. Must-haves, with the hotel's proof notes.
4. Action plan in three groups, full list, with a filter by owner.
5. Collapsed: this tool at a glance, legal flags, vendor questions, method.

Nothing new should push the verdict and first actions below the first screen.

**PDF: one page for the owner, then working pages.**

| Page | Content | Reader |
|---|---|---|
| 1 | Owner summary: verdict, score and why, six bars, the three decisions or approvals needed, re-check date, who answered, "self-reported" | Owner, asset manager, head office |
| 2 | Action plan table (action, who, effort, proof), in three groups | GM and the tool's owner |
| 3–4 | Area-by-area diagnosis with the tool's needs and one sourced figure each | Department head |
| 5 | Legal flags, items to check, vendor questions | GM, purchasing, IT |
| 6 | Pilot card (or foundations list, or roll-out conditions), method, limits, sources | Team running the pilot |

Five to six pages for a Moderate or Heavy tool, three to four for a Light one; let length follow the number of open items, do not pad. Page 1 must stand alone because it is the page that gets forwarded.

**Other formats.**

- **Copy summary** should become a short email to the owner: verdict, why, three actions with owners, what approval is needed.
- **Action list as CSV** so the hotel can put it in its own task tool.
- The pilot card and the vendor questions are worth a separate one-page print each: they are used in different meetings.
- The PDF is built with plain jsPDF text. A table layout for the action plan and source lines under each figure matter more than decoration.

---

## 5. Top 8 changes, in priority order

| # | Change | Value for the hotel | Needs |
|---|---|---|---|
| 1 | **Turn gaps into an action plan**: full list, three groups (before anything else / find out / close during pilot), each with action, who, effort class and proof of done | Answers "what do I do on Monday". The single largest gain. | New: one action line and owner per question code (34). Rest from `gaps()`, `q.proof`, `EVIDENCE`. |
| 2 | **Show the hotel's own proof notes and all must-haves**, met and unmet, with example and reason | The report becomes the hotel's own record, usable with the owner and as evidence later. Rewards the effort of answering. | Existing: `st.P`, `ev.gates`, `EVIDENCE`, `reasons`, `note`. |
| 3 | **Plain-words summary and an honest score explanation**: raw and capped score side by side, verdict sentence built from what is actually missing | Stops the "39 out of 100?" reaction; an owner understands the result in 30 seconds. | Existing `ev.*`; about 6 sentence templates. |
| 4 | **"This tool at a glance"**: six resource needs, type of tool, cost type, effort level, add-ons, use level | The hotel learns what the tool needs, which is what D6 exists to tell it. | Existing: `uc.r`, `arch.*`, `addons`, `rdy.rule`, `cat.use`. |
| 5 | **Legal flag from the AI Register** with items to check and the country's staff-consultation note | Prevents the worst outcome: a "ready" verdict on a high-risk or restricted use with no warning. Connects two tools of the hub. | Existing register data; build step; D7 sign-off. |
| 6 | **Area-by-area diagnosis**: points, answers, what good looks like for this tool, the route for this hotel type, one sourced figure | Bars gain meaning; department heads see their part. | Existing: `ev.area`, `uc.r`, `areas.needs`, `routes`, `figs`, `ex`. |
| 7 | **Next step by verdict, with a pre-filled pilot card** (KPI, baseline, owner, budget from the hotel's notes; blanks for target, length, stop rule) and **vendor questions** | Makes "Ready to pilot" something a hotel can act on, and improves its position with the vendor. | Existing: `st.P`, `vendorQuestions`, `arch.test`. New: example KPIs per type (9). |
| 8 | **Report frame**: owner page first, who answered, hotel type, "self-reported", thresholds and evidence caveats, re-check date, richer copied summary, CSV of actions | Credibility with owners and HFTP readers; gives a reason to come back and measure progress. | Existing: `st.hotel`, `levelsNote`, `limits`, `d6sources`. |

Changes 2, 3, 4, 6 and 8 need no new content at all and could ship first. Change 1 needs about one page of authored text and gives the most value. Change 5 depends on the D7 owner signing off the label file.

### Small faults noticed on the way

- `rdy.levels[0].rule` still reads "Any gate at No" and `rdy.steps` still says "31 questions" and "six gates must be at least Partly": both predate rules v2. If any of this text reaches the report it will contradict the result.
- The PDF header omits the hotel type, the person and the role although all three are collected.
- An area score can rest on three or four items. Showing "x of y points" beside the percentage avoids false precision.
