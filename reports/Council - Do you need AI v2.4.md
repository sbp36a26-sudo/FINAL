# Council: "Do you need AI?" v2.4, ready for a timed test with 3–5 hotel managers?

Run 24 Nov 2026 under `.claude/skills/llm-council/SKILL.md`: five advisors in role, blind A–E peer review in a new shuffled order, Chairman verdict. All roles were written by one model, each kept independent. Read-only review: nothing in `tools/` was changed and nothing was committed. This file is the only output.

**Read for this council:** `CLAUDE.md`; `tools/readiness-2/README.md` and `CHANGELOG.md` (v2.0 to v2.4); `src/logic.js` (`T`, `JUDGEMENT`, `evaluate()`, `task()`), `src/content.js` (five questions, ten must-haves with evidence, stop screen), the bundled data in `index.html` (`tq.uses`: questions and actions for rm-1, hr-6, fo-6, kc-1, hk-1, gx-2; `detail`: all 99 entries); `reports/Council - Do you need AI v2.md` and the owner's decisions recorded in the CHANGELOG; the screenshots in `reports/readiness-2-screens/four-answers/` (all 10) and `wording/` (desktop five questions, picker with panel, tailored questions, result "Where it sits"); git log (commits `a918c13`, `7e0530e`, `eb2f956`); `research_notes/Hotel AI readiness check design/hotel_blockers_and_gates.md` (State of Hotel AI base).

**Run locally for this council** (tools served on 127.0.0.1:8841, Playwright, scripts in the scratchpad, server stopped after). Nine answer patterns on gx-2 (AI chat assistant for guests), result text read in full:

| # | Answers | What the tool says |
|---|---|---|
| A | All 10 must-haves "Planned, not done yet", 8 tailored Yes | **Almost ready · Score: 72%** · "0 of 10 must-haves in place · 10 planned". "How this was worked out": "Nothing you answered blocks a start, but points are still open." |
| B | All must-haves Yes, all 8 tailored "Planned" | **Ready to start a pilot · Score: 77%**. Areas: People 0 of 1, Skills 0 of 1, … Organisation 0 of 3 "Gaps to close". Fold: "Every must-have is in place and most of what this use case needs is there." |
| C | All Yes | Ready to start a pilot · 100% |
| D | Q5 No ("Do you know which KPI should improve…?"), must-have 3 (KPI approved, today's figure, target) Yes, rest Yes | Almost ready · 100%; "Define success first. Write down the number and today's figure" beside a Yes to exactly that. "Start with" box heads **"Nothing open."** |
| E | Q1 "Not sure", rest Yes | **Ready to start a pilot · 100%**, beside "Is this an AI problem? Find out first." |
| F | Must-haves Yes, all tailored "Don't know yet" | Almost ready · 55% |
| G | "None of these fits", must-haves Yes | **Ready to start a pilot · 100%** (no use case chosen; "rests on the must-haves only") |
| H | One must-have No, rest Yes | **Not ready yet · Score: 94%** in the box; the reason sits below the buttons in "Start with" |
| I | Q4 No (safety net), rest Yes | Almost ready · 100%: "held back until that is settled", although Q4 No means "use it as an assistant only", which is a design condition, not something to settle. "Start with" heads "Nothing open." |

**Other facts the council worked from (all seen in the files or the running page):**

| Fact | Where |
|---|---|
| The action plan, the "Start with" list, the copy-per-person text and the PDF use the workbook's raw action text, not the team's plain wording: "Agree in writing: hand-off rules.", "Train or brief the people involved: Maintain knowledge base; review transcripts.", "Put in place, or get confirmed: Task/ops platform linked to PMS.", "Revenue manager owns it…; GM signs off strategy", "by segment". 119 of the 661 actions contain a semicolon. The v2.2 wording pass covered names, questions and core texts only. | bundled `tq.uses[*].qs[*].act`; case B result text |
| The IT button reads "Copy for it". | case A and F result text |
| The detail layer shows the catalogue's research notes: "AI technique: Generative AI / LLM (HiJiffy GPT-4/RAG explicit; … the 'AI claimed, unclear' vendors (Akia, Canary, STAY) were moved to Unclear in the fact-check"; 34 of 99 entries carry "claimed", "Unclear", "NOT AI", "GPT" or "RAG". The catalogue description says "100+ languages" with no source beside it. | `desktop-detail-layer.png`; bundled `detail` |
| Must-have 4 now asks "Can new AI tools easily be plugged in to your existing infrastructure?" (owner); its "what counts as Yes" still says "for each system you want to connect, its provider has confirmed…", and step 5 asks the system question again per use case. | `desktop-step3-must-haves.png`; `content.js` m4 |
| Question 5 now reads "Do you know which KPI should improve, and what it is today?" (owner); must-have 3 asks for the same KPI with today's figure and the target, approved. Contradictory answers pass silently (case D). | `desktop-five-questions.png`, case D |
| Must-haves 3 and 7 say "this tool" before the tool is chosen in step 4 (open decision B3 from the last council). | `desktop-step3-must-haves.png` |
| "State of Hotel AI, Fall 2026. Base: 107 hotel company leaders, worldwide" is cited without its publisher; the team's own notes call this family of surveys "global and vendor-linked". Must-have 6 ("A person who checks the AI") is backed only by a Eurostat figure on unclear legal consequences. | `content.js` m3, m4, m6, m7, m8; `hotel_blockers_and_gates.md` |
| README (journey table) and CHANGELOG still describe the "What does this do?" button and "Start a new check at the very bottom"; commit `7e0530e` removed the button and put Start a new check beside Download (PDF). The CHANGELOG heads v2.3/v2.4 "Not committed, not published", but the code is committed. The `wording/` screenshots still show the removed button. | README l.16, l.18; CHANGELOG; git log |
| Sharing is on; the notice says "A deletion date and a contact address are not set yet". | case B result text |
| No AIHA mention and no Wikipedia link anywhere in the bundled page. | grep over `index.html` |

**Settled owner decisions (not re-litigated):** percentage plus verdict; four answers (no Partly, no Doesn't apply); "Don't know yet" = 0 points; legal and carried-No holds on the top verdict; Q1 No stops; the verdict box holds only verdict, score, must-haves line; Download (PDF) and Start a new check on top; detail layer instead of links to the catalogue; plain wording of 99 names and 661 questions; sharing stays on; all 99 use cases selectable, 8 marked draft. Where one of these causes a real problem it is said below and put to the owner, not overruled.

---

## Brief (given to every advisor)

**Decision.** Is "Do you need AI?" v2.4 ready to put in front of 3–5 real hotel managers for a timed test, and what must change first?

**What it is.** One hub tab for hotel managers who know nothing about AI. Cover → 1 about your hotel → 2 five C-R-I-S-P questions (Yes / No / Not sure; Q1 No stops) → 3 ten must-haves (Yes / Planned, not done yet / No / Don't know yet) → 4 one of 99 use cases, with a detail layer → 5 six to nine tailored questions (same four answers) → result: box with verdict, "Score: n%", must-haves line; Download (PDF) and Start a new check on top; "Start with", areas, action plan by person, vendor questions, provisional EU AI Act label, every answer, how it was worked out, sharing. Points: Yes 2, Planned 1, No and Don't know 0. Cut-offs 75 / 50 / a quarter / a half (team judgement).

**Constraints.** Every figure with its source and base; plain words; must not look AI-made; never cite the competitor association; no Wikipedia; no lawyer or D7 sign-off yet. The test is the last council's item 12: minutes, share of "Don't know yet", the tester's own words for the score, where they stop.

**Evidence.** The two fact tables above.

---

## Step 1: five advisors

### Contrarian

The first thing to fail in the test is the word "Planned". It is now the only middle answer, so honest managers will use it a lot, and it is worth half a Yes. Ten must-haves all Planned, nothing done, gives "Almost ready, 72%" and the sentence "Nothing you answered blocks a start". Step 3 itself says these are "things to have in place before an AI project starts". The tool contradicts its own intro. Mirror case: every use-case question Planned gives "Ready to start a pilot, 77%" and "most of what this use case needs is there" over six area rows that all read 0 of 1. A sharp manager will spot that in minute two and stop trusting everything else.

Second: the top verdict can sit beside "Find out first." (Q1 Not sure) and beside "None of these fits", where there is no use case to pilot.

Third: the box. The owner moved the reason out of it. "Not ready yet · Score: 94%" is back, the exact screen the last council called the worst. The reason is one block lower, but people read boxes.

Fourth: the action plan is the part a GM forwards, and it is written in workbook shorthand: "Task/ops platform linked to PMS", "review transcripts", "Copy for it".

Fifth: real managers' answers will go into the shared copy with no named controller, deletion date or contact.

**Key point:** Planned can carry a hotel to "Almost ready" with nothing done and to "Ready" with nothing done for the use case; a tester will find it and the score loses all credibility.

### Assumption-Ripper

1. *"Planned" means progress.* It means intent. A date is optional. Scoring intent at half a Yes assumes intent predicts delivery; nothing in the research says so.
2. *The verdict and step 2 agree.* Only a No on Q2–Q5 holds the top verdict; "Not sure" does not, and Q4 No (assistant only) does, though it cannot be "settled". Both choices are assumptions nobody wrote down.
3. *Question 5 and must-have 3 ask different things.* After the owner's rewording they ask the same thing twice, and the tool accepts opposite answers.
4. *A manager can answer must-haves before choosing the tool.* "This tool" appears in must-haves 3 and 7 one step before the tool is named (open B3).
5. *"Can new AI tools easily be plugged in to your existing infrastructure?" has a checkable answer.* "Easily" and "infrastructure" invite a hopeful Yes; the Yes criterion underneath asks for written confirmation per system.
6. *The plain wording reached the manager.* It reached names and questions. Actions, the detail layer's "AI technique" and "Catalogue description" are still research notes.
7. *A Yes is a Yes for everyone.* A GM and an IT head answer must-have 4 differently; the tool records one person.
8. *The test can run with sharing on.* It assumes testers consent to data going to a team account with no deletion date.
9. *The documentation describes the tool.* README and CHANGELOG describe a button that no longer exists.

**Key point:** the scoring assumes "Planned" is half-done and that step 2 and step 3 cannot disagree; both are false on the running page.

### Expansionist

The test is the asset. Five timed sessions are the first real data this project has on how a hotel manager reads AI readiness, and they feed D6 (the self-assessment), D5 (the five questions as its first gate) and D9 (an article on "what a readiness score can and cannot tell you"). Design the session so it produces that data: a fixed script, the same two use cases for everyone plus one of their choice, and a printed answer sheet the team keeps.

The detail layer is bigger than it looks: it is the catalogue inside the decision. Clean it once (drop research notes, keep what it does, how common, sources) and it is the explainer HFTP members never had. The same cleaned entry can be the PDF's appendix page for the chosen use case.

The action plan by person is what travels. If the actions get the same plain wording pass the questions got, the copy buttons become the reason a GM forwards the tool to finance and IT, which is free distribution inside a hotel.

The "Planned" answer can become a strength: with a date it is a plan. Ask for the date, and the PDF becomes a dated to-do list the manager brings back to on the next visit ("since last time").

**Key point:** run the test as a research instrument and fix the action wording first, because the forwarded action plan is where this tool earns its keep.

### Outsider

I know nothing about hotels or AI. Walking through:

The cover is clear. The Eurostat line has its base. Why "69.89%"? Two decimals look like a machine wrote it.

"C-R-I-S-P" in capitals above the real title. I still do not know what to do with it.

Question 5 asks if I know the KPI. Two screens later I am asked again, more strictly. Did I answer wrong the first time?

"Can new AI tools easily be plugged in to your existing infrastructure?" What is my infrastructure? Easily for whom?

I open "Details and sources" and read "the 'AI claimed, unclear' vendors … were moved to Unclear in the fact-check". Who moved them? Is this for me?

On the result: "Not ready yet" and "Score: 94%" in one box. 94 is an A.

I chose "Planned" for everything because I honestly plan to. I am "Almost ready". I have done nothing.

"Nothing open." on a page that also says the top verdict is held back. So is something open or not?

"Copy for it". Copy for what?

The action "Agree in writing: hand-off rules." Hand-off of what?

"Ready to start a pilot": what is a pilot, how long, how big?

What I liked: the stop page, the "Why this matters" folds, and that every figure says who was asked.

**Key point:** the questions now read well, but the result and the actions still talk to the team, not to me.

### Executor

Before Monday's first session, in this order, each under two hours:

1. Fix the two "Planned" outcomes in copy now (the Almost-ready line and the Ready fold line become conditional); put the rule change to the owner today.
2. "Copy for IT".
3. "Nothing open." never under a held verdict: show the hold as the first item.
4. One line on step 3 when Q5 and must-have 3 disagree (same for Q3 and must-have 7).
5. Action plan: show the team-worded question in place of the raw workbook action for tailored items until the team words the actions.
6. Detail layer: hide "AI technique"; label "Catalogue description" as the catalogue's own words.
7. Name the publisher of State of Hotel AI or drop its figures.
8. Sharing for the test: off, or the three notice facts filled. Not both missing.
9. README, CHANGELOG, screenshots brought up to `7e0530e`.
10. Write the session script (below) and book the five slots.

Stop doing: rule tuning, new use cases, new features, design passes. Do not change cut-offs before the sessions.

Owner by Wednesday: Planned rule, hold on Not sure, Q4 hold, None-fits verdict, the box reason line, sharing during the test.

**Key point:** ten small fixes and six owner answers, then test; the test should measure the tool, not its known bugs.

---

## Step 2: blind peer review

Answers shuffled and relabelled: **A** = Executor, **B** = Outsider, **C** = Assumption-Ripper, **D** = Contrarian, **E** = Expansionist. Reviewers saw only the letters.

**Contrarian reviews A, B, C, E.** Strongest: C's point 2. Holding the top verdict for Q4 No but not for "Not sure" is backwards: Q4 No is a design choice the tool already handles ("assistant only"), while Not sure on Q1 is the one doubt that matters most. Weakest: E's "with a date it is a plan". A date the manager types is not a plan either; making Planned depend on a date only moves the gaming one click. Also weak: A's item 5 fallback (show the question as the task) will read odd ("To do: Is it agreed…?"); it must be worded as a task. Missed by all: Back from the result and "Change answers from the start" sit at the bottom while "Start a new check" sits at the top next to the PDF; in a timed test someone will press it by mistake.

**Assumption-Ripper reviews A, B, D, E.** Strongest: D's "Not ready yet · Score: 94%" observation: the owner's box decision quietly undid the last council's first fix; it is a real problem, not a taste point, so it goes back to the owner. Weakest: E treats five sessions as "research data" for D6 and D9. Five self-selected managers are a usability test, not a sample; no figure from them should reach a deliverable. Missed: nobody asked who in the hotel should sit the test. A GM and an IT head will read must-have 4 differently; the script should fix the role or record it.

**Expansionist reviews A, B, C, D.** Strongest: A's order. It gets to a test this week without touching rules the owner has not decided. Weakest: D says the tester will lose all trust in minute two. That assumes testers try odd patterns; most will answer a mix. The Planned problem is real but will show in the data, not necessarily in the room. Missed: the PDF. It is what leaves the room, and it carries the same workbook actions; the test should end with the tester reading their PDF aloud.

**Outsider reviews A, C, D, E.** Strongest: A's item 4, because I was the one who thought I had answered wrong. Weakest: C's list is right but ends without telling me what to do. Still unexplained after all four: "pilot". The top verdict is an instruction nobody defines, and "Ready to start a pilot" was supposed to be renamed (the last council's B9). Missed: "69.89%" style decimals, and that the step 2 title shows the acronym before the question.

**Executor reviews B, C, D, E.** Strongest: D's sharing point. Testing with real people while copies go to a team account with no deletion date is the one thing that could embarrass HFTP, and it is a one-line switch. Weakest: E's PDF appendix and article ideas: good, after the test. Missed: a test plan is not a test. Nobody named who runs the sessions, who notes, and what counts as a pass. Proposed pass line: 4 of 5 finish in 20 minutes, 4 of 5 can say in their own words what the score is and is not, no tester reads a verdict as legal clearance.

---

## Step 3: Chairman's verdict

### 1. Verdict

**Go with changes: test next week, not this week.** The flow, the wording of the questions, the stop page, the folds and the detail layer are good enough for a timed test. But the scoring gives "Almost ready" with no must-have done and "Ready to start a pilot" with nothing done for the use case, the result contradicts step 2 in three patterns, and the action plan the manager takes away is in workbook shorthand. A test now would mostly measure those known faults. Fix the BUILD NOW list (copy and small logic, about two days), get six owner answers, then run five timed sessions with sharing off or the data notice complete.

### 2. Where the council agreed

- **"Planned" is now carrying too much** (all five). With Partly gone it is the only middle answer and it scores half a Yes with or without a date. Cases A and B show it reaches "Almost ready" and "Ready" with nothing in place. The copy can stop the false sentences now; the rule is the owner's.
- **The result must not contradict step 2.** Q1 Not sure + Ready (E), Q5 No beside must-have 3 Yes (D), Q4 No "held until settled" (I), and "Nothing open." under a held verdict.
- **The action plan and the PDF need the plain wording the questions got.** They are what leaves the room.
- **The detail layer shows research notes to managers** and must show only what a manager can use.
- **"Not ready yet · Score: 94%" is a real problem caused by the owner's box decision**; one reason line in the box fixes it without undoing the simplification.
- **Sharing must not collect real managers' answers** while controller, deletion date and contact are unnamed.
- **The documentation no longer matches the tool** after `7e0530e`.
- **No cut-off tuning before the sessions.**

### 3. Where it disagreed, and the ruling

| Disagreement | Ruling |
|---|---|
| Fix "Planned" by requiring a date (Expansionist) or by capping verdicts (Contrarian) | **Cap, not date** (owner decision O1). A typed date proves nothing; a cap is honest: the top verdict needs at least half the tailored points from Yes answers, and "Almost ready" needs at least half the must-haves at Yes. Until decided, the copy fixes (BUILD NOW 1, 2) stop the false sentences. |
| Will testers ever hit the extreme patterns? (Expansionist: no; Contrarian: yes) | **Irrelevant to the fix**: the false sentences are cheap to remove and the screenshots would travel. Fix the copy before the test; let the test show how often Planned is used. |
| Use the sessions as research data for D6 / D9 (Expansionist) or only as a usability test (Assumption-Ripper) | **Usability test only.** No figure from five self-selected managers goes into a deliverable. Quotes may, with permission. |
| Interim action wording: show the question as the task (Executor) or wait for a wording pass (Contrarian) | **Interim now, wording pass after the test.** The interim must read as a task (BUILD NOW 5 gives the frame). The pass on 661 actions is owner decision O6. |
| Move "Start a new check" back down (Contrarian) | **Owner's decision stands** (beside the PDF). It keeps the old check, so a mis-press loses nothing; watch for it in the test. |

### 4. Risks to watch

| Risk | Early warning sign |
|---|---|
| The score is read as a grade and the verdict ignored | A tester says "94, that's good" on "Not ready yet"; anyone asks "what is a good score?" |
| "Planned" becomes the polite answer and lifts every result | More than a third of must-have answers in a session are Planned; testers say "well, we plan to" |
| "Ready to start a pilot" is read as permission (legal or managerial) | A tester skips the EU AI Act fold; anyone asks "so we can go ahead?"; nobody can say what a pilot is |

### 5. Next steps

Monday: BUILD NOW 1 to 4 and 8 (copy and labels, half a day); send the owner decisions O1 to O6 the same morning. Tuesday: BUILD NOW 5 to 7 and 9 to 10; rerun all suites and the browser walks. Wednesday: owner answers applied; book the five sessions (the last council suggested two after already scheduled interviews). Sessions the week after. Who: the tool's builder for BUILD NOW; the owner for O1 to O6; two team members per session (one leads, one notes, as in the interviews).

#### (a) BUILD NOW (numbered; exact change and copy)

1. **"Almost ready" line, conditional** (`logic.js` `resultModel`, the line under "How this was worked out", PDF). Keep "Nothing you answered blocks a start, but points are still open. Close the ones below before you sign anything." only when at least half the must-haves are Yes. Otherwise:
   **"No must-have is at No, but only {n} of 10 are in place. "Planned" is not done yet: finish these before you talk to vendors."**
2. **"Ready" fold line, conditional.** Replace "Every must-have is in place and most of what this use case needs is there." when fewer than half the tailored questions are Yes with:
   **"Every must-have is in place. For this use case, {y} of {n} questions are Yes and {p} are planned: finish the planned ones before the pilot starts."**
3. **Never "Nothing open." under a held verdict** (cases D, E, I). When `held` is not empty, "Start with this one" lists the hold as item 1:
   - carried No: **"Settle this first: in step 2 you answered No to "{title}". {outcome line}"**
   - legal: **"Settle this first: this use has legal items to check (see "EU AI Act" below). A named person must check them before a pilot."**
   and the heading reads "Start with this one", never "Nothing open."
4. **Q4 hold wording** (until owner decision O3): for Q4 No replace "The top verdict is held back until that is settled." with **"You said mistakes cannot be caught before they harm anyone, so use it only as an assistant: a person checks every result before it counts. The top verdict is held back for that reason."**
5. **Action wording for tailored items, interim** (`logic.js` `task()`, action plan, copy text, PDF). Do not print the workbook `act` text for tailored questions. Print the team-worded question as a task:
   - No: **"Make this a Yes: {question}"**
   - Planned: **"Finish: {question}"** (+ "(planned by {date})")
   - Don't know yet: unchanged ("Find out: "{question}"").
   Must-have actions stay as they are (already plain, hand-written). Keep `act` in the data for the Team tab.
6. **"Copy for IT"** (and any role label in a button: use the role's display name, never lower-cased).
7. **Step 3 consistency line** (`app.js`, under must-have 3 and must-have 7, only when it applies):
   - Q5 No or Not sure and must-have 3 Yes: **"In step 2 you said you do not yet know the number to improve. If that has changed, go back and change it there too."**
   - Q3 No or Not sure and must-have 7 Yes: **"In step 2 you said the information is not yet digital and up to date. Check both answers say the same."**
   No blocking; the person may go on.
8. **Detail layer for managers** (`build.mjs` `detailModel`, `app.js`): remove the "AI technique" line from the layer (34 of 99 entries carry research notes; "How the AI works" already explains it in plain words). Retitle "Catalogue description" to **"The catalogue's own description (research wording)"** and keep it under "For the detail-minded". The full notes stay in the catalogue tab and the Team tab.
9. **Sources** (`content.js` m3, m4, m7, m8): name the publisher of "State of Hotel AI, Fall 2026" in the source line, and add **"global survey, vendor-linked; not comparable with the European figures"** to its base, as the team's own notes say. If the publisher cannot be named from an opened source, drop the four figures. Eurostat percentages: round to whole numbers on screen ("70%", "46%") with the exact figure kept in "Where this comes from".
10. **Docs and screenshots to the tool as it is** (`README.md` journey table lines 16 and 18, `CHANGELOG.md` v2.4 heading and a short entry for `7e0530e`, `docs/PROJECT_CONTEXT.md` status). Retake `reports/readiness-2-screens/wording/` (they show the removed "What does this do?" button).
11. **A one-line gloss of "pilot"** under the top verdict (independent of the name, owner decision O5): **"A pilot: a trial with one team or one outlet, for a set time (for example 8 to 12 weeks), measured against the number from must-have 3."** Mark the duration as the team's suggestion if no source is attached; otherwise drop the brackets.
12. **Session kit** (no code): a one-page script, a consent line, and a note sheet (see (c)).

#### (b) Owner decisions needed

| # | Question | Options | Recommendation |
|---|---|---|---|
| O1 | How much can "Planned" carry? | (a) as now (1 point, no limit); (b) Planned scores 1 only with a date (last council's B7); (c) caps: "Almost ready" needs at least half the must-haves at Yes, the top verdict needs at least half the tailored questions at Yes | **(c)**, as rules v2.4, with (a)'s points unchanged. Keeps the four answers and the score; stops "Almost ready" with nothing done (case A) and "Ready" with nothing done for the use (case B). |
| O2 | Should "Not sure" in step 2 hold the top verdict back, as a No on Q2, Q3 and Q5 does? | (a) no, as now; (b) yes, any Not sure holds it, with the reason "you answered Not sure to … in step 2" | **(b).** "Find out first." beside "Ready to start a pilot" is the clearest self-contradiction left (case E). |
| O3 | Should Q4 No (assistant only) hold the top verdict? | (a) yes, as now; (b) no: Q4 No changes how the tool is used, shown as a condition only. The last council's B6 named data, return and proof (Q2, Q3, Q5), not Q4 | **(b).** Until decided, BUILD NOW 4 fixes the wording. |
| O4 | Verdict for "None of these fits" | (a) as now, all four verdicts; (b) best is "Almost ready" with the line "No use case chosen: the must-haves are in place, but nothing was checked for a particular tool." | **(b).** There is nothing to pilot (case G). |
| O5 | The verdict box: one reason line back? | (a) as now (verdict, score, must-haves line); (b) add one short line only for "Not ready yet" and held verdicts: "Because 1 must-have is No." / "Held back: legal items to check." | **(b).** "Not ready yet · Score: 94%" is the screen the last council ranked as the first fault; the line is six words and keeps the simple box. Also settle the name of the top verdict (last council's B9: "No blocker found: you can start a pilot"). |
| O6 | Plain wording of the 661 actions | (a) keep BUILD NOW 5's interim (question as task); (b) a team wording pass like the one on the questions, in `data/wording.json` (`acts`), starting with the use cases testers pick | **(a) for the test, (b) after it**, ordered by what testers picked. |
| O7 | Sharing during the test | (a) on as now; (b) `SHARING_ON = false` for the sessions; (c) on, after controller, deletion date and contact are named | **(b)**, unless (c) is done before the first session. Testers' answers go on the paper note sheet instead. |
| O8 | Order of steps (last council's B3, still open) | (a) as now; (b) use case before must-haves | **Decide after the test.** Ask testers at must-haves 3 and 7 what "this tool" means to them. |
| O9 | Must-have 4 wording (owner's "Can new AI tools easily be plugged in to your existing infrastructure?") | (a) keep; (b) "Has the provider of each system the tool must connect to (for example your PMS, the booking system) confirmed that other software can read from it and write back to it?" | **Test (a) as is** and note how testers answer; if most say Yes without knowing, switch to (b), which matches its own "what counts as Yes". |

#### (c) What to test with managers

**Who and how.** Five managers (mix: two GMs of independents, one group or chain property manager, one head of department, one IT or finance person), 30-minute slot, their own laptop or a team laptop, the hub tab, sharing off. One team member leads (reads the script, no help), one notes (time stamps, words, where they hesitate), as in the interviews. Same task for all: "Think of one problem in your hotel." Then one fixed use case for comparison: gx-2 (AI chat assistant for guests).

**Measure.**
1. Minutes per step and in total; where anyone stops or goes Back.
2. Share of "Planned" and "Don't know yet" on step 3 and step 5.
3. Questions read twice or asked about aloud (note the exact question id).
4. Step 2: can they say in their own words what Q1 asks? Do they notice that Q5 and must-have 3 ask about the same number?
5. Must-haves 3, 4 and 7: what do they think "this tool" and "infrastructure" mean?
6. Step 4: do they open "Details and sources"? Do they find their problem, or pick "None of these fits"?
7. Result, asked after 30 seconds on the page: "What does the score tell you?" "What does the verdict tell you?" "What would you do on Monday?" "Can you start now?" (a "yes, legally fine" on a held or high-risk use is a fail).
8. The PDF: they read their action plan aloud. Every word they stumble on is noted.
9. Would they forward it, and to whom?

**Pass line (team judgement).** 4 of 5 finish in 20 minutes; 4 of 5 describe the score as "my own answers, not a measured grade"; no tester reads a verdict as legal clearance; fewer than one in five tailored answers is "Don't know yet". Below that line, change the tool before any HFTP member sees it.

**Do not** report any figure from the five sessions in a deliverable; quotes only with permission.

### 6. Open questions

- Is v2.4 in the published hub, or only committed? The brief says published; the CHANGELOG says "not committed, not published"; the code is committed (`7e0530e`). Testers must use the version that was reviewed here.
- Who publishes "State of Hotel AI", and is it a vendor survey?
- Does the owner want a percentage shown to testers at all, or would the test learn more with the score hidden for half of them? (A/B with five people is weak; only worth it if O5 stays (a).)
- What do the D7 owner and a lawyer say about the provisional AI Act label beside a verdict? Still open since the last council.
- Controller, deletion date and contact for shared copies: still unnamed.

---

## Advisors' key points in one line

- **Contrarian:** "Planned" carries a hotel to "Almost ready" with nothing done and to "Ready" with nothing done for the use case.
- **Assumption-Ripper:** the scoring assumes Planned is half-done and that step 2 and step 3 cannot disagree; both are false on the running page.
- **Expansionist:** run the test as a structured session and fix the action wording, because the forwarded action plan is where the tool earns its keep.
- **Outsider:** the questions now read well, but the result and the actions still talk to the team, not to the manager.
- **Executor:** ten small fixes and six owner answers, then test, so the test measures the tool and not its known bugs.

**Most useful review comments:** the owner's box decision undid the last council's first fix ("Not ready yet · Score: 94%"), so it goes back to the owner as O5 (Assumption-Ripper on D); holding the top verdict for Q4 No but not for "Not sure" is backwards (Contrarian on C); the PDF is what leaves the room, so the test ends with the tester reading it aloud (Expansionist).
