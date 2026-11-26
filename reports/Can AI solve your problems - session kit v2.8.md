# "Can AI solve your problems?" v2.8: session kit for the manager tests

Kit for 3 to 5 timed sessions with real hotel managers, run by EHL SBP Group 36. Two team members per session: one **leads** (reads the script, hands over the tasks), one **notes** (times, words, where the tester hesitates). Written 26 Nov 2026.

**Tool:** the standalone "Can AI solve your problems?" (code in `tools/readiness-2-questions/`, version string 2.8.1 in `src/content.js` on 26 Nov 2026), public build hosted at https://sbp36a26-sudo.github.io/FINAL/. The public build sends each check's answers to the team's Google Sheet unless the person ticks "Don't send my answers".

**Built from:** the council on v2.8 (`reports/Council - Do you need AI v2.8.md`: Chairman's next step 4, risks to watch, open questions, sections (c) and (d)); the earlier kit (`reports/Do you need AI - session kit.md`: two-person set-up, result questions, pass line, kept where it still fits); the tool's wording in `src/content.js` and `src/app.js`; what is sent, from `src/collect.js`.

**What this kit is not:** a usability test of a student prototype, not research on hotels. With 3 to 5 people, no share or average from these sessions goes into a deliverable. Quotes only with the tester's permission. If a session runs inside an interview the team has already booked, run it as a separate block after the interview: the team's interview guides stay as they are, and nothing from this kit is added to them.

---

## 1. Goal and what we must learn

**Goal:** before the tool is called the public 1.0 (council owner decision O1), watch real managers use it alone and find what stops, confuses or misleads them.

What each session must tell us:

1. **Time.** How long a full run takes a real manager, step by step. The cover gives a question count, not minutes (council, open questions); only these sessions can give the minutes.
2. **Step 2, question 1.** Do managers read "Can each case be fixed with an “if this, then that” rule?" the right way round? Does anyone answer Yes, and get the stop screen, for a job that needs judgement? (Council, risk 3.)
3. **Unsure answers.** Steps 3 and 5 offer only Yes / Planned, not done yet / No, and a question can be left blank (owner decision, v2.7.1). When a manager does not know, what do they do: pick Planned, No, Yes, leave it blank, or ask us?
4. **Step 4.** Do they find their own problem among the 98 use cases (count: `data/usecase_questions_only.json`, "use_cases_listed") in the three-level pick (area, department, use case), or choose "None of these fits"? This feeds owner decision O4 (a search box, decided after the sessions).
5. **Score and verdict.** Do they read "Score: n% of points from all questions" as their own answers or as a measured grade? Do they read any verdict as a go-ahead, or as legal clearance? (Council: score misread is a hypothesis to watch, not to fix yet.)
6. **Trust.** Would they believe the result enough to act on it? What makes them doubt it?
7. **The action plan.** Would they forward it, and to whom? Do the two PDFs and the file arrive on their device?
8. **The data notice.** Do they notice it, understand it, and does anyone tick "Don't send my answers"?

---

## 2. Who to recruit

Aim for 5; 3 is the floor (council (d) 5: "three to five").

| Slot | Profile | Why |
|---|---|---|
| A | General manager or owner of an **independent** hotel | The tool's main reader; often no IT team |
| B | Manager in a **chain or group** property (group-run, or managed or franchised) | Different approval path (must-have 3 names "the person who approves spending") |
| C | **Revenue** or reservations manager | Knows the fixed use case rm-1 from the inside |
| D | **Front office or guest service** manager | Knows the fixed use case gx-2 from the inside |
| E | Head of a department **outside** rooms (F&B, housekeeping, maintenance, finance or HR) | Their own-choice run tests step 4 on less obvious departments |

Across the group:

- At least **one independent** and **at least one chain or group** property.
- At least **one person who knows nothing about AI**: has never chosen, bought or used an AI tool at work. Ask at recruitment: "Have you ever chosen, bought or used an AI tool at work?" Do not ask them to rate their knowledge.
- Not a team member, not an EHL coach, not anyone who has seen the tool or its screenshots.
- Ideally more than one country (step 1 asks for it), but do not let this hold up booking.

Booking: team Outlook calendar, as for the interviews. Book **60 minutes**; the session plan below uses 55.

---

## 3. Consent script (read aloud, before the tool opens)

The lead reads this word for word. It matches the tool's own data notice (`PUB` in `src/content.js`). Plain words only.

> "Thank you for helping. We are testing a tool our student team built, not you. There are no right or wrong answers, and if something is unclear, that is the tool's fault, and exactly what we want to find.
>
> Please think aloud as you go: say what you are looking at, what you expect, and what you are unsure about. I will not help you during the tasks, because we want to see how it works when you are on your own. I may ask you what you are thinking.
>
> About your answers in the tool: when you use it, your answers and the result are sent to our team, EHL SBP Group 36. That is a student project for HFTP. We use them to improve the tool and for our research on AI in hotels. Nobody else sees them.
>
> What is sent: your answers to every question, the result, how the hotel is run, your role and the country if you pick them, the hotel name only if you type one, which step you reached, the date, and a random number for each check. Not your IP address, not which browser you use, and the page sets no cookies.
>
> We keep the answers until 31 January 2027. Then they are removed.
>
> If you would rather not send them, there is a box on the first page: 'Don't send my answers'. Tick it and nothing is sent from this browser. The tool works the same. You can tick it at any time, also later.
>
> Separately, my colleague takes notes on paper: what you say and how long each step takes. We will only quote you, in the report or anywhere else, if you say we may. Is that all right? And may we quote you, with or without your name?"

Note the answers on the note sheet (quote: yes with name / yes without name / no). If the tester says no to sending answers, have them tick the box on screen themselves and carry on: the session still works, only the Sheet rows are missing.

The team decides, before the first session, how long its own paper notes are kept and where. Write it here so the lead can answer if asked: ____________________.

---

## 4. Pre-flight checklist (the day before, and 15 minutes before)

**The day before (one team member, 20 minutes)**

- [ ] The link opens: https://sbp36a26-sudo.github.io/FINAL/ shows the header "Can AI solve your problems?", the cover with "Your answers help our research" and the "Don't send my answers" box.
- [ ] The footer shows a real **contact**, not "Contact: to be added" (the text the tool shows when `contact` in `hosting.config.json` is empty; it was empty on 26 Nov 2026). If it still says "to be added", bring the team's contact address on paper for the tester.
- [ ] **The Sheet receives rows.** Do one dry run to the result with hotel name `TEST`. Within a few minutes the Sheet shows rows for that run: one `step_done` row per step left with Next (steps 1 to 5) and one `result` row. If no rows arrive, check `collectUrl` in `hosting.config.json` (it was empty on 26 Nov 2026, and the tool sends nothing when it is empty). Then do one run with "Don't send my answers" ticked and check that **no** row arrives. Untick it afterwards.
- [ ] Deep link: `https://sbp36a26-sudo.github.io/FINAL/#use=gx-2` opens with "You came here for: … It is already chosen in step 4." (used in run 2).
- [ ] **Browsers.** On the devices testers are likely to use: Chrome on a laptop, Safari on an iPhone, Chrome on Android, Firefox if anyone uses it. On each: Download result (PDF), Download answers (PDF), Save as file (on the result page), Copy plan, Copy saved check, Open printable page, and a reload that keeps the answers. Note any browser where no file arrives (council (d) 2). Also open the link once from inside WhatsApp and LinkedIn on a phone, since managers may get it that way.
- [ ] Print the note sheet (section 6), one per tester, plus a spare.
- [ ] **Print fallback.** Print one copy of a finished result page (use Open printable page, then Ctrl+P or Cmd+P) from the dry run, to show if downloads fail on the day. Have the public build file (`tools/readiness-2-questions/public/index.html`) saved on the team laptop: if the site or the Wi-Fi is down, open it locally. A local copy may not reach the Sheet; the notes then carry the session.

**15 minutes before (lead and note-taker)**

- [ ] Team laptop charged, Chrome open, the link in a fresh tab. Phone charged as a second device.
- [ ] On the team laptop: "Your checks in this browser" is **empty**. Remove the dry run and any earlier tester's checks (removing a check does not touch rows already sent, as the tool says).
- [ ] "Don't send my answers" is **not ticked** from an earlier session. The tick is kept per browser, so check it every time.
- [ ] Downloads folder open in a second window, so you can see whether files arrive.
- [ ] Stopwatch or phone timer for the note-taker; note sheet, pen, session code (S1, S2, ...).
- [ ] If the tester uses their own device: they open the link themselves. Their checks and their opt-out stay on their device; tell them they can remove the checks from "Your checks in this browser" at the end.

---

## 5. Session script, minute by minute (55 minutes)

Three runs: **rm-1** and **gx-2** are fixed, so every tester sees the same questions; the third is the tester's own problem. The tester answers every run **for their own hotel, as it is today**. If their hotel does not do that job, they answer as if they were considering it.

Question counts per run (5 in step 2, 10 must-haves, plus the use case's own questions, from `data/usecase_questions_only.json`):

| Run | Use case (tool's name) | Step-5 questions | Questions in all |
|---|---|---|---|
| 1 | rm-1 "Demand forecasting for rooms (by day, guest type and room type)", Revenue Management | 7 | 22 |
| 2 | gx-2 "AI chat assistant for guests in several languages, before booking and during the stay (website, WhatsApp, booking-site inbox)", Guest Experience & Customer Service | 12 | 27 |
| 3 | Their choice | 6 to 12 | 21 to 27 |

**Hotel name:** ask the tester to type the session code with the run (for example `S2-1`, `S2-2`, `S2-3`) as the hotel name. This keeps their real hotel name out of the Sheet and lets us match rows to the session. Say this once before run 1, then do not mention step 1 again.

**Do not lead.** During the runs the lead says nothing except the prompts below. Never explain a question, never say which answer is "right", never point at a button. If the tester asks "what does this mean?", answer: "What do you think it means?" and then "What would you do if we were not here?". If they are stuck for more than 2 minutes on one screen (team rule, to protect the time), say: "Do what you would do at your desk." The note-taker writes down every time this happens.

**Neutral think-aloud prompts** (use only when the tester goes quiet for about 20 seconds):
- "What are you thinking right now?"
- "What are you looking for?"
- "What do you expect to happen when you click that?"
- "Tell me what you just read, in your own words."

| Time | Who | What happens |
|---|---|---|
| 0:00 to 0:05 | Lead | Welcome. Consent script (section 3). Note quote permission. Start the timer only when the tool opens. |
| 0:05 to 0:07 | Tester | **Cover.** "Please read this first page as you normally would, then start." Note-taker: do they read the data notice? Do they open "What is sent, and why"? Do they tick the box? Lead says the hotel-name instruction (`Sx-1`) just before they press Start. |
| 0:07 to 0:25 | Tester | **Run 1: rm-1, full journey, found by hand.** Task card (read aloud, then leave it on the table): "Your hotel is thinking about a tool that forecasts room demand for each day. Use this page to check whether that makes sense for your hotel." The tester picks the use case in step 4 themselves. Note-taker times each step (step 1, step 2, step 3, step 4, step 5) and writes down hesitations by question number. |
| (if it happens) | Tester | **Stop screen.** If they answer Yes to question 1 and reach "This is not suitable for AI.", let them read it. Ask: "What is this telling you?" Then: "For this test, please carry on as you think best." If they do not find "Change my answers", the lead may say: "Please go back and continue", and the note-taker marks it as help given. |
| 0:25 to 0:30 | Lead | **Result, run 1.** Let them look for 30 seconds without a word. Then ask, one at a time: "What does this page tell you?" "What does the score tell you?" "What does the verdict tell you?" "What would you do on Monday?" Write their exact words. |
| 0:30 to 0:32 | Tester | **Downloads.** "Please keep a copy of this result for yourself." Do not name a button. Note which button they choose, whether a file arrives, and whether they open it. Then: "Please read me the first part of your action plan." |
| 0:32 to 0:42 | Tester | **Run 2: gx-2, through a link.** Lead opens `…/FINAL/#use=gx-2` (or sends it to their phone, if testing a phone). Task card: "Someone sent you this link about a chat assistant for guests. Check it for your hotel." Hotel name `Sx-2`. Note: do they notice the use case is already chosen? Do they mind answering steps 2 and 3 again? Time each step. |
| 0:42 to 0:44 | Lead | **Result, run 2.** "How does this compare with the first one?" Then nothing more: let them talk. |
| 0:44 to 0:50 | Tester | **Run 3: their own problem.** "Now think of one problem in your hotel that you would like to solve. Use the page for that." Hotel name `Sx-3`. Most important: step 4. Note the path they take (area, department, use case), how long it takes, and whether they end on "None of these fits". If time runs short, stop after step 4 and ask: "Is this the problem you had in mind?" |
| 0:50 to 0:55 | Lead | **Debrief** (section 7): as many questions as time allows, in order. Thank them. If they used their own device, remind them they can remove the checks from "Your checks in this browser". |
| After | Both | 10 minutes alone: the note-taker completes the sheet while it is fresh; the lead adds what they noticed. Clear the team laptop for the next tester (section 4, last block). |

If run 1 takes longer than 25 minutes, skip run 2 and go straight to run 3, step 4. The time of run 1 is itself the finding.

---

## 6. Observer note sheet (one page, one per tester)

Session code: ______ Date: ______ Lead: ______ Notes: ______ Device and browser: ____________
Tester: independent / chain or group; role: ________; AI at work before: yes / no; quote: with name / without name / no
Data box ticked: no / yes (when: ________) Opened "What is sent, and why": yes / no

**Time per step (minutes:seconds)**

| Run | Cover | Step 1 | Step 2 | Step 3 | Step 4 | Step 5 | Result read | Total |
|---|---|---|---|---|---|---|---|---|
| 1 rm-1 | | | | | | | | |
| 2 gx-2 | | | | | | | | |
| 3 own | | | | | | | | |

**Where they hesitate or misread** (write the step and question number, and their words)

| Step and question | What happened (paused / read twice / asked aloud / misread as …) |
|---|---|
| | |
| | |
| | |
| | |

**Step 2, question 1** ("Can each case be fixed with an “if this, then that” rule?"): their answer in run 1 ____ run 2 ____ run 3 ____. Their words for what it asks: ______________________. Reached the stop screen: no / yes, and then: ______________.

**When unsure on steps 3 and 5** (tick each time; one tick per question they said they did not know)

| They picked | Run 1 | Run 2 | Run 3 | Their words |
|---|---|---|---|---|
| Planned, not done yet | | | | |
| No | | | | |
| Yes | | | | |
| Left it blank | | | | |
| Asked us | | | | |

**Step 4 (run 3):** path taken ________________ found it: yes / "None of these fits" / gave up. Opened "Details and sources": yes / no.

**Score and verdict, in their words** (exact quotes)
- Verdict and score shown, run 1: ____________ run 2: ____________
- "What does the score tell you?": ______________________________
- "What does the verdict tell you?": ______________________________
- Read it as a go-ahead or as legal clearance? no / yes: "______________"

**Trust:** do they believe it? Their words: ______________________________ What made them doubt it: ______________

**Action plan:** would they forward it? no / yes, to: ______________ Read aloud without stumbling? yes / no, stumbled on: ______________

**Files:** Result PDF arrived / opened; Answers PDF arrived / opened; Save as file used; Copy plan used; no file arrived (browser: ______). "Not keeping your answers" banner shown: yes / no.

**Help given by the lead** (each time, and why): ______________________________

---

## 7. Debrief questions (open, non-leading; ask in this order)

1. "Tell me, in your own words, what this page does."
2. "What was the hardest moment for you, and why?"
3. "When you did not know an answer, what did you do?"
4. "What would you do with the result you got for your own problem?"
5. "If a colleague got this result, how would you explain the score to them?"
6. "What would make you trust this result more, or less?"
7. "Who in your hotel, if anyone, would you send this to?"
8. "Is there anything you expected to find here and did not?"

Do not ask whether they liked it, and do not suggest answers ("was the score confusing?"). Follow up only with "Tell me more" or "Can you give me an example?".

---

## 8. Reading the Google Sheet afterwards

**What a row is.** The public build sends one row per event (from `src/collect.js`; the sheet "events" written by the team's Apps Script). The fields are:

| Field | What it holds |
|---|---|
| `check_id` | A random number for one check. All rows of one run share it. |
| `event` | `step_done` (a step was left with Next) or `result` (the result or stop screen was reached) |
| `step` | For `step_done`: `1` to `5`, the step just finished. For `result`: `result` or `stop` |
| `version`, `at` | The tool version and the time the row was sent |
| `hotel_type`, `role`, `country`, `hotel_name` | From step 1; hotel name only if typed (in sessions: the session code) |
| `use_case` | The use case id, for example `rm-1`; empty before step 4 |
| `verdict`, `score` | On `result` rows only: `ready`, `almost`, `notready`, `noinfo`, or `stop`; score in %, empty for `noinfo` and `stop` |
| `step2`, `must`, `answers` | The answers so far: step 2 as Yes / No / Not sure; must-haves and step 5 as Yes / Planned / No. A question left blank is simply **missing** from these. |

How the Apps Script lays out `step2`, `must` and `answers` in the sheet (one cell of text, or one column per question) is set in the script, not in the tool: check the header row before you count.

**Rules to know before counting**

- The cover sends nothing: someone who opens the page and leaves sends no row. Someone who ticked "Don't send my answers" sends no row at all. So the Sheet never shows the full number of visitors.
- Going Back and then Next again sends the same step again. **Count each `check_id` once per step** (keep its last row).
- A stop at question 1 shows as `step_done` 2 followed by a `result` row with `step` = `stop`.
- Leave out the dry-run rows (hotel name `TEST`) and filter on `version` starting `2.8`.

**Drop-off by step** (the main use of the Sheet)

1. For each `check_id`, take the highest `step` among its `step_done` rows, and note whether it has a `result` row.
2. Count checks that left step 1, 2, 3, 4 and 5, and checks with a `result` row. A big fall between two steps shows where people give up.
3. Count the `stop` results apart: these are people the tool sent away at question 1.

**Other things the rows show**

- **Time per step** for anyone outside the sessions: the gap between a check's `at` times on consecutive `step_done` rows (step 1 has no start time, because the cover sends nothing).
- **Unsure answers:** for each `result` row, the number of must-haves and step-5 questions missing from `must` and `answers` (left blank), and the share of Planned.
- **Session rows:** match them to the note sheet by `hotel_name` (`S2-1` and so on) and use them to check the times the note-taker wrote down.

Rows from the sessions are 3 to 5 people: read them case by case. Do not turn them into shares about hotels.

---

## 9. Synthesis template (one per round of sessions)

Fill in within two days of the last session. Facts from the notes and the Sheet only; mark anything else as the team's view.

**Sessions run:** n = __ (independent __, chain or group __, no AI at work before __). Dates: ______. Devices and browsers: ______.

**Per tester**

| Code | Profile | Run 1 total time | Run 2 total time | Run 3: found use case? | Q1 stop? | Unsure answers: most often picked | Score read as own answers? | Read verdict as go-ahead or legal clearance? | Would forward to |
|---|---|---|---|---|---|---|---|---|---|
| S1 | | | | | | | | | |
| S2 | | | | | | | | | |
| S3 | | | | | | | | | |
| S4 | | | | | | | | | |
| S5 | | | | | | | | | |

**Across testers**

1. Time a full run took (fastest, slowest), and the slowest step: ______
2. Questions that two or more testers hesitated on or misread (step and number, their words): ______
3. Question 1: how many read it the wrong way round; how many reached the stop screen for a job that needs judgement: ______
4. What testers did when unsure (Planned / No / Yes / blank / asked): ______
5. Step 4: found / "None of these fits" / gave up; the departments they looked in first: ______
6. Score and verdict: exact quotes that show how they were read: ______
7. Trust: what raised it, what lowered it: ______
8. Files: any device or browser where no file arrived: ______
9. Data notice: noticed / opened / ticked: ______
10. Sheet: drop-off by step for the session checks, and whether it matches the notes: ______

**Pass line (team judgement, from the earlier kit; not a tested standard)**
- At least 4 of 5 describe the score as "my own answers", not a measured grade.
- No tester reads a verdict as legal clearance or as a go-ahead from HFTP.
- No tester reaches the stop screen, without noticing, for a job that needs judgement.
- At least 4 of 5 find a use case for their own problem in step 4, or choose "None of these fits" knowingly.

Below this line, change the tool before it goes public.

**For the owner** (council section (c))
- O1, public 1.0: ready / not yet, because ______
- O2, the "not tested with hotels" line: suggested new wording ("tried with n hotel managers, [month] 2026") ______
- O4, step-4 search box: needed / not needed, because ______
- Changes proposed (each with the session evidence behind it): ______
- Quotes cleared for use (tester code, permission given): ______
