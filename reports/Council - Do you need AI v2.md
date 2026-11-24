# Council: "Do you need AI?" v2.0, right as rebuilt?

Run 24 Nov 2026 under `.claude/skills/llm-council/SKILL.md`: five advisors in role, blind A–E peer review in shuffled order, Chairman verdict. All roles were written by one model, each kept independent. Read-only review: nothing in `tools/` was changed (another agent is auditing `tools/readiness-2/` at the same time). This file is the only output.

**Read for this council:** `tools/readiness-2/README.md`, `CHANGELOG.md`, `src/content.js`, `src/logic.js` (block `T`, `evaluate()`), `data/usecase-questions.json` (21 use cases read in full: rm-1, rm-9, fo-6, fo-7, fo-8, hk-1, hk-7, kc-1, kc-6, hr-2, hr-6, gm-1, gm-7, gx-1, gx-2, fb-1, sm-1, fa-1, it-1, me-1, lg-1; frame counts over all 661 questions), `data/overrides.json`; `research_notes/Do you need AI v2/build_notes.md`; the Framework blocks of the source workbook as extracted in the questions file; eleven screenshots in `reports/readiness-2-screens/` (chat-0-cover, chat-2-questions, chat-3-must-haves, chat-5-tailored, chat-6-result, hr-6-result, draft-6-result, none-6-result, phone-result, stop, hub-team); `reports/Council - Readiness 2.0.md`, `reports/Council - readiness check audit.md`, `reports/audit-readiness/3_benchmark.md`; `docs/PROJECT_CONTEXT.md`.

**Facts the council worked from (all from the files above, none invented):**

| Fact | Where it is seen |
|---|---|
| "Not ready yet" stands directly above "83% ready" (one must-have at No, 15 of 17 answered) | `chat-6-result.png` |
| "Not enough information yet" stands directly above "100% ready" (4 of 10 answered, all four Yes) | `none-6-result.png` |
| "Ready to start a pilot · 97% ready" for AI recruiting, which carries the provisional label "High-risk" and 14 legal items to check; the DPIA is "Planned" | `hr-6-result.png` |
| The verdict does not read the five questions: `evaluate()` uses must-haves and tailored answers only, so a carried "Fix the data first." can sit under "Ready to start a pilot" | `src/logic.js` |
| "Don't know yet" is left out of the points, so not knowing raises the percentage | `src/logic.js`, `none-6-result.png` |
| Planned and Partly both score 1 of 2; ten must-haves all "Planned" give 50% and "Almost ready: Most of it is there." | `src/logic.js`, `src/content.js` (`LEVELS`) |
| Step 3 says "10 things every AI project needs"; its own fold says items 5, 8, 9, 10 are needed by 22, 35, 30 and 30 of 90 use cases (team judgement, not a survey) | `chat-3-must-haves.png`, `build_notes.md` section 2 |
| Left out of the must-haves: operating rules 72 of 90, specialist skills 70 of 90, vendor evaluation 64 of 90 (same analysis) | questions file, `blocks` |
| Must-haves are asked (step 3) before the use case is chosen (step 4); must-have 4 therefore shows the fallback systems examples, not the department's | `chat-3-must-haves.png`, README |
| 50 of 99 use cases have 6 tailored questions, 32 have 7, 16 have 8, 1 has 9; so most areas rest on one question, and "Data 0%, Weak" or "Skills 50%, Gaps to close" comes from one answer | questions file, `draft-6-result.png` |
| Frames across the 661 questions: "Is this data ready, digital and up to date:" 96; "Is this in place, or confirmed as possible:" 91; "Do you know what this will cost your hotel:" 90; "Is this in place and written down:" 64; "and also" 46 | questions file |
| 56 of the 91 workbook use cases carry no evidence row id; the rest show bare ids such as "FAC-143-06, FAC-221-06, NEX-294-04"; the evidence pack is not in the repo | questions file, `chat-5-tailored.png` |
| The Team tab's "Where the data goes" card still says "No 0–100 score" and describes rules v4, next to a copy showing "83% ready" under rules v2 | `hub-team.png` |
| Sharing is on (`SHARING_ON = true`); the claude.ai database path was not exercised; controller, deletion date and contact are not named | `build_notes.md` sections 6 and 7 |
| The earlier benchmark's positioning line ends "with no score, no vendor behind it"; its stress test said a composite score "decides nothing and can be gamed" | `reports/audit-readiness/3_benchmark.md` |

---

## Brief (given to every advisor)

**Decision.** Is the rebuilt "Do you need AI?" v2.0 right (flow, must-haves, tailored questions, percentage plus verdict), and what must change before hotel managers and the client HFTP see it?

**What it is.** One hub tab for hotel managers who know nothing about AI, built 24 Nov 2026, not committed, not published, not tested with managers. Hotel form → five C-R-I-S-P questions (Q1 No stops) → ten must-haves → pick one of 99 use cases → 6 to 9 questions generated from the team's workbook → result: verdict, "x% ready", three first tasks, plan by person, vendor questions, provisional AI Act label, PDF, opt-in sharing with a team tab.

**Owner decisions (may be questioned, explicitly):** percentage plus verdict (reverses the earlier no-score rule); must-haves cap but do not stop; Q1 No stops; the tool replaces the Readiness check tab; all 99 use cases including 8 with draft questions; C-R-I-S-P naming.

**Constraints.** Every figure carries its source and base. No Wikipedia. HFTP's competitor association is never named or cited. No lawyer has signed off any legal wording; D7 sign-off is open. The client wants evidence that lets people "make your own conclusions", likes useful tools, and warned that advice dates fast. The fact table above.

---

## Step 1: five advisors

### Contrarian

The first thing to fail is the result headline. A general manager sees "Not ready yet" and, one line below in larger type than the reason, "83% ready". He will believe the number, because numbers look measured. Worse: "Not enough information yet · 100% ready" for a hotel that answered four questions. That screenshot, forwarded once, discredits the tool with HFTP.

Second: the percentage rewards ignorance. "Don't know yet" drops out of the sum, so the less a manager knows, the higher the score. All ten must-haves at "Planned" gives 50% and the sentence "Most of it is there", when nothing is there.

Third: "Ready to start a pilot, 97%" on AI hiring, a use the tool itself labels high-risk, with the impact assessment not done. The team has no legal sign-off. That is the screen a lawyer or an HFTP board member will quote back.

Fourth: the must-have cap is not defensible on the team's own numbers. A hotel fitting bed-bug sensors is "Not ready yet" because it has no rules on what staff type into AI tools, an item the fold says 30 of 90 use cases need (team's resource analysis, Nov 2026, judgement).

Fifth: the tailored questions ask for things that cannot exist yet: "Is this data ready: conversation logs?", "staff biometric templates?", "Has this been done: tell guests they are dealing with AI?". Honest users answer No and are marked down for not having bought the tool.

Sixth: sharing is switched on with an untested database path and no named controller.

I question the owner's percentage decision explicitly: the earlier council and benchmark rejected a score for reasons that still hold.

**Key point:** the headline number contradicts the verdict in two of four screenshots and rises when the manager knows less; fix that before anyone outside the team sees it.

### Assumption-Ripper

1. *A percentage of self-reported answers measures readiness.* It measures the share of answered questions marked Yes. Nothing links 75% to pilots that worked. The caveat says so in grey 12-point type beside a 28-point number.
2. *The ten must-haves are universal.* The screen says "every AI project needs"; the fold under four of them says 22 to 35 of 90 (team judgement). Both cannot be true on one screen.
3. *Must-haves can be answered before the use case is known.* "Do you have a system that holds each piece of data this tool needs?" comes one step before the manager says which tool. The order assumes the answer does not depend on the use. For "systems that can connect" it plainly does: some workbook rows say no link is needed.
4. *A workbook cell is a question.* The cells are needs written as notes. Framing them ("Is this in place and written down: hand-off rules?") assumes the manager can decode a note. 64 questions use that frame.
5. *One question can speak for an area.* Half the use cases have six questions for six areas. "Data: 0%, Weak" is one answer.
6. *The five questions and the score are one tool.* The verdict ignores the five answers. "Fix the data first." and "Ready to start a pilot" can appear together.
7. *Replacing the Readiness check loses nothing important.* It loses "update open items", the only way to return without redoing the walk, while the tool advertises return visits.
8. *Managers will finish about 25 answers.* Unknown. Nobody has timed it.
9. *Evidence ids are evidence.* A code the reader cannot open is a claim of evidence.
10. *The client wants a verdict.* The client asked for evidence and own conclusions. Unknown whether Lyle wants a percentage at all.

**Key point:** the tool assumes its must-haves are universal and its percentage means readiness, and its own screens show neither is established.

### Expansionist

The rebuild has created three assets the team is underusing.

First, the generator. 661 questions from one workbook, checked by a script, means the workbook is now a living source: fix a cell and 99 checklists improve. That is the answer to the client's warning that advice dates fast. Say so on the cover: "Questions rebuilt from the team's research on 24 Nov 2026." It also makes D6's self-assessment checklist a by-product: one printed page per use case.

Second, "How this was worked out". No comparable tool in the team's benchmark prints its sums line by line (`reports/audit-readiness/3_benchmark.md`). With the score relabelled honestly, that section is the method page the benchmark said was missing, and a D9 article: "What a readiness percentage can and cannot tell you."

Third, the plan by person with copy buttons. This is what a GM forwards. Lead the cover with it, not with the score.

Bigger versions: once sharing is tested and a controller named, opt-in copies show which must-haves hotels lack most. That is primary data for D2 and D3, and later a comparison line for members ("hotels like yours"). The "None of these fits" route is a catalogue gap finder. The five questions belong in D5 as its first gate, as the last council said.

The percentage has one real use the verdict lacks: movement. "Since last time: 61% → 78%" gives a reason to return. Keep it for that.

The 8 draft use cases are the newest ones (guest risk screening, biometric clocks). Being early on those is worth more than waiting for perfect rows.

**Key point:** the lasting value is the generator, the printed working-out and the plan by person; present the percentage as progress over time, not as a grade.

### Outsider

I run no hotel and know nothing about AI. What I saw:

"Not ready yet" and then "83% ready". Which is it? At school 83% is a good mark. And "100% ready" under "Not enough information yet" reads like a bug.

"C-R-I-S-P" in big blue letters. Is it a method I should have heard of? The five words under it are clear; the acronym tells me nothing.

Step 3 says these are ten things *every* AI project needs. Then I open one and read "needed for 30 of 90 use cases". So not every?

I am asked whether staff have been told about "the plan" and whether I have a budget for "this tool", before I have said what the tool is. What plan?

"Is this in place and written down: hand-off rules?" Hand-off of what, to whom? "Can the people involved maintain knowledge base and review transcripts?" reads like a note someone forgot to finish. "Is this data ready: conversation logs?" I have no chatbot, so how could I have its logs?

"Evidence rows in the team's D6 evidence pack: FAC-143-06". I cannot open that. Why show it to me?

Six buttons per question, 8 times, after five buttons 10 times. On the phone the result page is very long; the verdict is the only part I would read.

"Partly" and "Planned, not done yet": if I plan everything and have done nothing, am I half ready?

"Provisional label … awaiting legal sign-off" next to "Ready to start a pilot". So am I allowed to start or not?

What I liked at once: the stop page. Clear, and tells me what to do instead.

**Key point:** a newcomer reads the percentage as a school mark, so any verdict that disagrees with it looks like a mistake.

### Executor

Monday morning, in this order, none of it more than an hour or two each:

1. Result head: stop printing "x% ready". Print "Score: 83% of the points on the 15 questions you answered". Hide the score when the verdict is "Not enough information yet". Put the reason on the line directly under the verdict.
2. Switch sharing off (`SHARING_ON = false`) until someone has pressed "Share a copy" on claude.ai and seen it arrive, and the three notice facts exist. Fix the Team card that still says "No 0–100 score".
3. Step 3 intro: remove "every".
4. Hide the evidence ids from the hotel view. Keep them on the Team tab.
5. Areas: counts, not percentages ("Data: 0 of 1 in place").
6. Three frame fixes in the generator, then rerun the checker: the "Has this been done:" frame, the article-less skills frame, and a line on step 5 about things that exist only once the tool runs.
7. One line under the top verdict when the label is high-risk.
8. Book five managers. Two interview partners this week can each give 20 minutes after their interview. Time them. Ask: "What does 83% mean?" Count "Doesn't apply" and "Don't know yet" on step 5.

Stop doing: adding use cases, rewriting 661 questions by hand, tuning cut-offs without a single real answer, building benchmarks.

Leave for the owner: which items cap, whether unknown counts as zero, order of steps, the drafts. Do not reorder the flow before the test; the test will say.

Show HFTP after items 1 to 7, labelled prototype. Show hotels outside the test only after item 8.

**Key point:** eight small fixes and five timed manager sessions come before any change to rules, flow or question count.

---

## Step 2: blind peer review

Answers shuffled and relabelled: **A** = Outsider, **B** = Executor, **C** = Contrarian, **D** = Expansionist, **E** = Assumption-Ripper. Reviewers saw only the letters.

**Contrarian reviews A, B, D, E.** Strongest: E's point 6, the verdict ignores the five questions, so the tool can say "Fix the data first." and "Ready" on one page; nobody else caught that the two halves are not joined. Weakest: D's "hotels like yours" comparison. With self-reported answers from a handful of opt-in copies it would be the benchmark's "headline cut loose from its sample" fault, made by us. Also weak: B says show HFTP after seven copy fixes; the high-risk "Ready" problem needs a rule, not a line. Missed by all: Planned with no date scores like Partly, and "By when?" is optional, so the cheapest path to "Almost ready" is ten clicks on Planned.

**Assumption-Ripper reviews A, B, C, D.** Strongest: A's school-mark reading. It shows the contradiction is in the unit ("% ready"), not in the rule, so relabelling fixes most of it without touching the owner's decision. Weakest: C assumes dropping the percentage is the safe choice; the owner reversed that rule knowingly, and D gives it a legitimate job (change over time). Also B assumes "do not reorder before the test": a test of a flow with a known fault mostly measures the fault. Missed: everyone treats the workbook shares (90, 72, 30 of 90) as facts. They are one team's judgement over 90 rows; using them to pick or to attack must-haves is the same assumption both ways.

**Expansionist reviews A, B, C, E.** Strongest: B's sequencing; it gets a showable tool to the client this week. Weakest: C's wish to drop the score; it throws away the one element that makes a return visit worth it. E's "replacement loses update open items" is right and is an opportunity: it is the natural home of the progress number. Missed: the working-out section already prints every sum; nobody proposed moving one line of it ("25 of 30 points") into the headline in place of the bare percentage. Also missed: the stop page, which A praised, is the most quotable screen for D10.

**Outsider reviews B, C, D, E.** Strongest: C's "the less you know, the higher the score". I did not see why "100% ready" appeared; now it is obvious and it is wrong in plain arithmetic. Weakest: D's talk of "assets" and "generator"; as a user I do not care how questions are made, only whether I can read them. Still unclear to me after all four: what a "pilot" is. The top verdict tells me to start one and nobody explains it. Missed: nobody said what I should do if I disagree with the verdict, and nobody asked whether "Doesn't apply" should exist on must-haves when the tool needs no link to my systems.

**Executor reviews A, C, D, E.** Strongest: C's list is the bug list; four of its six are an hour each. Weakest: E's ten assumptions end in no action; half need a test nobody has booked. D's benchmark and D2/D3 data are months away and need a controller the team has not named. Useful from A: "what plan?" shows the order problem costs comprehension now, so I would at least add one sentence to step 3 ("Think of the AI project you have in mind") even if the order stays. Missed: no one named who does the wording pass on the workbook cells, or said that it should start with the use cases hotels are most likely to pick, not all 99.

---

## Step 3: Chairman's verdict

### 1. Verdict

**Go with changes: not yet.** The flow, the generator and the action plan are sound enough to keep, but the result headline contradicts itself, the percentage is mislabelled, and the top verdict can appear on a high-risk use with open legal items. Fix the BUILD NOW list, then show HFTP as a labelled prototype; hotel managers outside a test see it only after five timed sessions.

### 2. Where the council agreed

- **"x% ready" beside a contrary verdict is a contradiction, not a nuance** (all five). The fault is the word "ready" after the number and the missing reason line, more than the cap rule.
- **The percentage is defensible only as a count in another form**: points on answered questions, self-reported, with the sum shown. It is not a measure of readiness and must not be worded as one, compared between hotels, or benchmarked.
- **Leaving "Don't know yet" out of the sum is the most serious arithmetic fault**: less knowledge, higher score ("100% ready" from 4 of 10 answers, `none-6-result.png`).
- **"Every AI project needs" is contradicted by the fold beneath it** (30 to 35 of 90, team judgement).
- **The generated questions are faithful but not yet readable**, and some ask for things that exist only after the tool is running.
- **Bare evidence ids should not be shown to hotels.**
- **Sharing should not be on** until the real path is tested and the data notice is complete.
- **Nothing replaces a test with real managers**; no cut-off should be tuned before it.

### 3. Where it disagreed, and the ruling

| Disagreement | Ruling |
|---|---|
| Drop the percentage (Contrarian, questioning the owner's decision) or keep it (Expansionist) | **Keep it: the owner's decision stands.** Relabel it as a score on answered questions, never "% ready"; hide it under "Not enough information yet"; give it its real job, change since last time. The council records that the earlier reasons against a score (gameable, decides nothing) still apply and are the reason for the relabelling. |
| (1) "Not ready yet" + 83%: change the rule or the display | **Display now, rule to the owner.** The cap is right in principle (a missing must-have should outrank a sum). Print the reason in the verdict line: "Not ready yet: 1 must-have is missing". Whether items 8 to 10 may cap at all is decision B1. |
| (3) Swap staff / AI rules / fallback for operating rules, specialist skills, vendor testing | **No swap now.** The three higher-share blocks are already asked per use case (organisation and skills questions) or sit in the vendor questions. The real fault is that non-universal items cap the verdict. Recommended to the owner: all ten stay and score; only items 1 to 7 cap (B1). Both sides rest on one team-judgement matrix, so the screen must keep saying so. |
| (6) Verdict order: "Not enough information yet" before a must-have No, or the reverse | **Keep the order.** "Not ready yet" from one No and two known answers overclaims. But a known No must never be hidden: add it to the head ("Already known: 1 must-have is missing"). |
| Reorder the flow so the use case comes before the must-haves (Assumption-Ripper) or leave it for the test (Executor) | **Owner's decision (B3); the council recommends the reorder**, because must-haves 4 and 7 speak of "this tool" before it is named and the department examples from v1.3 are lost. Until decided, add one sentence to step 3 (BUILD NOW 5). |
| (5) Cut the length now or measure first | **Measure first.** 4 form fields + 5 + 10 + 6 to 9 answers is long but each part earns its place. No time promise on the cover until five sessions are timed. |
| The 8 draft use cases: keep selectable or hide | **Keep selectable, marked as now (owner's decision stands), with one limit:** fo-6 (guest risk screening) and hr-6 (biometric staff clocks) carry draft questions that touch the law without D7 review; they fall under the high-risk line in BUILD NOW 7 and under decision B5. |
| Aggregate shared results into a benchmark or D2/D3 data (Expansionist) | **Not now.** No controller, no deletion date, untested path, self-selected sample. |
| C-R-I-S-P (Outsider: means nothing) | **Owner's decision stands.** The words under it carry the meaning; make them the heading and the acronym the small line if the test shows confusion. |
| (8) What was dropped from the Readiness check | **Restore one thing, by owner decision (B4): "Update open items".** Return visits and "since last time" are promised and currently need a full walk back. Notes on must-haves, "who can answer" and the next-look date stay out. The buying stage is worth one field on the hotel form (B4b): it is the cleanest answer to "can this be answered before a vendor exists?". |

### 4. Risks to watch

| Risk | Early warning sign |
|---|---|
| **The percentage is quoted without its verdict or caveat** (in a PDF, a slide, an HFTP post) and read as a measured grade | A tester says "we got 83" or asks "what is a good score?"; anyone asks how hotels compare; the number appears in "Copy summary" text without the verdict beside it |
| **"Ready to start a pilot" is read as legal clearance** on a use with a provisional high-risk label or sensitive data | The top verdict appears on hr-2, hr-6, fo-6 or it-4 in any test; a tester skips the AI Act block; the D7 owner has still not seen the result page |
| **Managers cannot answer the tailored questions and the score becomes noise** | More than a third of step 5 answers are "Don't know yet" or "Doesn't apply"; testers read a question aloud twice; sessions run past 20 minutes; people stop at step 5 |

### 5. Next steps

#### (a) BUILD NOW (small, low-regret, in this order)

1. **Result head, wording of the score** (`content.js`, `logic.js` `resultModel`, PDF, Copy summary, Your checks, Team tab). Replace "83% ready" with:
   **"Score: 83%"** and beside it **"25 of 30 points on the 15 questions you answered (of 17). Your own answers; nobody checked them. The cut-offs are the team's judgement, not tested with hotels."**
   Cover bullet becomes: **"A verdict and a score:** one of four verdicts, and the share of points from your own answers, with how both were worked out."
2. **No score under "Not enough information yet".** Show instead: **"No score yet: you answered 4 of 10 questions."** Same in the PDF, the list of checks and the Team tab.
3. **Reason in the verdict line.** Under the verdict name, first line, same weight as the score:
   - must-have at No: **"Because 1 must-have is missing: Rules for staff on AI tools. A missing must-have outweighs the score."**
   - below 50%: **"Because fewer than half the points are in place."**
   - not enough information, with a must-have at No: add **"Already known: 1 must-have is missing: …"**
4. **"Almost ready" line.** Replace "Most of it is there." with: **"Nothing you answered blocks a start, but points are still open. Close the ones below before you sign anything."**
5. **Step 3 intro.** Replace "10 things every AI project needs, whatever the tool." with: **"Ten things to have in place before an AI project starts. Think of the project you have in mind. Under each one you can see how many of the 90 use cases in the team's analysis need it."**
6. **Areas as counts, not percentages.** "Score per area" becomes **"What is in place, by area"**; each row reads **"Data: 0 of 1 in place"**, with the word (Strong / Gaps to close / Weak) only when the area has two or more known answers; otherwise no word.
7. **Line under any verdict when the provisional label is high-risk, or the use has the sensitive-data add-on:** **"This score does not cover the law. This use has legal items to check first (see "EU AI Act" below). Do not start a pilot before a named person has checked them."** No new legal statement; it points to the existing block.
8. **Evidence line in the "Why this matters" fold.** Replace the ids with: **"Based on 3 entries in the team's research record (not yet published)."** Where there is none: **"The team's judgement from the catalogue description; no source entry."** Ids stay on the Team tab only.
9. **Step 5 intro, add:** **"Answer for today. If something can only exist once the tool is running (for example its conversation logs), choose "Planned, not done yet"."**
10. **Three generator frames** (`build-questions.mjs`, then rerun `check-questions.mjs`):
    - organisation step: "Has this been done: tell guests they are dealing with AI?" → **"Is it agreed how you will tell guests they are dealing with AI?"**
    - organisation thing: "Is this in place and written down: hand-off rules?" → **"Are there written hand-off rules?"** for a single item; keep the colon frame only for lists of two or more.
    - join word: "…, and also …" → **"…, and …"** where the joined items contain no "and" themselves.
11. **Sharing off:** `SHARING_ON = false`. **Team tab card:** replace the rules v4 text and "No 0–100 score" with the rules v2 points, cut-offs and the score wording of item 1.
12. **Book and run five timed sessions** (two this week after scheduled interviews). Record: minutes, share of "Don't know yet" / "Doesn't apply" on step 5, the tester's own words for what the score means, where they stop.

#### (b) NEEDS THE OWNER'S DECISION

| # | Question | Options | Recommendation |
|---|---|---|---|
| B1 | Which must-haves may cap the verdict? | (a) all ten, as now; (b) all ten are asked and scored, only 1 to 7 cap; (c) swap 8 to 10 for operating rules, specialist skills, vendor testing | **(b).** Keeps the owner's list, removes "Not ready yet" for a sensor project lacking staff typing rules. |
| B2 | Does "Don't know yet" count in the score? | (a) left out, as now; (b) counts as 0 points, so the score is the share of everything asked that is in place | **(b).** Ends "the less you know, the higher the score"; 83% becomes 25 of 34 = 73%. Rules v3; saved checks recompute. |
| B3 | Order of steps | (a) as now; (b) hotel → five questions → where in the hotel → must-haves → tailored | **(b)**, after the five sessions unless they show no confusion. |
| B4 | Bring back from the Readiness check | (a) nothing; (b) "Update open items" only; (c) also the buying stage as one field on the hotel form | **(b) and (c).** Not notes, not "who can answer". |
| B5 | Can the top verdict appear on a high-risk or sensitive-data use, and on a draft use? | (a) yes, with the line in BUILD NOW 7; (b) no: the best possible is "Almost ready" until the legal items are ticked / the row is reviewed | **(b)** for high-risk and sensitive-data uses until D7 or a lawyer has signed; (a) for other drafts. |
| B6 | Should a carried No from the five questions (data, return, proof) block the top verdict? | (a) no, shown as conditions only; (b) yes: "Almost ready", with the condition as the reason | **(b).** One tool should not say "Fix the data first." and "Ready" together. |
| B7 | Planned vs Partly | (a) both 1 point; (b) Planned scores 1 only with a date, otherwise 0 | **(b).** |
| B8 | Wording pass on the questions | (a) accept after BUILD NOW 10; (b) the team rewrites the workbook cells for the 15 to 20 use cases hotels pick most, then the 8 drafts | **(b)**, in the workbook, not in `overrides.json`. Name one owner. |
| B9 | Name of the top verdict | "Ready to start a pilot" / "No blocker found: you can start a pilot" | **The second.** It states what was found, fits the client's "make your own conclusions", and was the earlier council's ruling. Add a one-line gloss of "pilot". |
| B10 | Who may see it when | — | HFTP after BUILD NOW 1 to 11, as a prototype; hotels after item 12 and B5. |

#### (c) DO NOT DO

- No comparison between hotels, no "hotels like yours", no average score, no maturity names.
- No tuning of 75 / 50 / a quarter / a half before real answers exist.
- No hand rewrite of all 661 questions; no new use cases until the 8 drafts have workbook rows.
- No time promise ("about 10 minutes") on the cover before sessions are timed.
- No new legal sentence anywhere; nothing with "must", "requires" or "applies" that the D7 owner has not seen.
- No sharing on claude.ai until one real copy has been sent and read back, and controller, deletion date and contact are named.
- No evidence ids, pack names or internal gap-check sources on hotel-facing screens; the competitor association is never named.
- Do not delete `tools/readiness-check/`; old links and saved checks depend on it.

### 6. Open questions

- Does the client want a percentage at all, or only the verdict and the list? One question to Lyle with the relabelled result page would settle the largest disagreement.
- How long does a first run take, and how many tailored questions can a manager answer before a vendor exists? Unknown until the five sessions.
- Who is the controller for shared copies, what is the deletion date and the contact?
- Will the D6 evidence pack be published or added to the repo, so that "3 entries in the team's research record" can become named sources?
- What do the D7 owner and a lawyer say about the provisional label next to a verdict, and about the draft questions for fo-6 and hr-6?
- Was the claude.ai database path ever run with a `kind: 'dyn'` copy? If it fails, does the hotel see an error or silence?

---

## Advisors' key points in one line

- **Contrarian:** the headline number contradicts the verdict and rises when the manager knows less.
- **Assumption-Ripper:** "universal" must-haves and "% ready" are both assumptions the tool's own screens undercut.
- **Expansionist:** the generator, the printed working-out and the plan by person are the lasting value; use the score for progress over time.
- **Outsider:** a newcomer reads the percentage as a school mark, so a contrary verdict looks like a bug.
- **Executor:** eight small fixes and five timed sessions before any change to rules, flow or length.
