# Council: "Do you need AI?" v3.0, ready for a timed test with 3–5 hotel managers?

*LLM council (skill `.claude/skills/llm-council/SKILL.md`), 25 Nov 2026. Five advisors, blind peer review, Chairman verdict. Run in one session (no subagent tool was available here), so the skill's rule for writing the five answers one after another applies: no later advisor reuses an earlier one's points. No code changed, nothing committed.*

## What the council looked at

- Spec and reports: `tools/readiness-3/spec/MASTER_PROMPT.md`, `README.md`, `CHANGELOG.md`, `REVIEW_RESPONSE.md`, `LEGAL_LEFTOVERS.md`, `NOTES_suggested_content_changes.md`, `CLAUDE.md`.
- Data: `spec/usecase_questions_v3.runtime.json`. 26 use cases were read question by question, covering all 15 departments: the 7 rewritten ones (res-8, fo-7, hk-6, hr-1, hr-5, hr-6, it-4) plus rm-1, rm-2, res-1, sm-1, sm-3, fo-1, fo-6, gx-2, fb-5, hk-3, me-6, kc-2, pr-3, fa-7, gm-4, gm-7, it-3, lg-2, lg-4 and hr-2. Whole-data scans checked dead gate options, conditional wording, acronyms, near-duplicates of must-haves, blockers per use case and area order.
- Rules: `src/rules3.js` and `src/result3.js` were run in Node on 13 scenarios (script at `scratchpad/council3/scen.js`).
- Page: served from `tools/` on 127.0.0.1:8871 and driven with Playwright at 360 px: hr-1 from the cover to the result, Copy, plan text, PDF bytes (92,836) and the saved-file keys. The server was stopped afterwards. Screenshots from `reports/readiness-3-screens/` (g01, g09, g15, g19) were also reviewed.
- Unit tests: all 7 suites pass (banned 11, build 25, data3 42, result3 556, review 37, rules3 71, store3 31). The working tree is clean.

### Evidence the council used (measured, not guessed)

| # | Finding | Evidence |
|---|---|---|
| E1 | **Generic must-haves fill the top 3.** On a realistic run, all three top actions come from must-haves or step 2 and are owned by "General manager". The tailored blocker answered Planned shows only further down, in the plan. | hr-1 walk: top 3 = adviser / m9 / s5. gx-2 scenario: m9 / s5 / m2 |
| E2 | **Actions read as questions with the "?" removed**, e.g. "Make sure: Is one named person in charge of the tool…", "Make sure: If the AI gets one wrong, will a person catch it…". On the soft stop: "Make sure: Does each case need judgement…" | `rules3.js` `task()`; g09 stop screenshot |
| E3 | **41 of 99 use cases change their question list when a How it works question is answered.** The questions are on screen before the How it works answers are given, so a manager can answer questions that then disappear. | scen.js count; hr-1 adds n1; G_LINK=no removes te1a/te1b |
| E4 | **Everything Planned gives Not ready (50%)**, which is golden 30. Before a tool is bought, most technical answers can only be Planned or Don't know yet. | scen.js "everything Planned" |
| E5 | **When many blockers are No, the reason sentence lists them all.** With 6 blockers No, it is a run-on sentence of 6 items. | scen.js res-1 |
| E6 | **Near-identical adviser actions repeat.** it-4 with face and staff answered Yes gives top 3 = "Ask an adviser before a pilot." plus two more "Ask an adviser before…" lines. | scen.js it-4 |
| E7 | **The vendor list includes the hotel's own questions.** "Do you have at least a year of occupancy and covers history?" goes to the vendor, because every Don't know yet question is listed. | hr-1 walk, plan text |
| E8 | **Two How it works questions have answers that change nothing.** In hr-6, "No, in a central database" changes nothing; in lg-4, "Our hotel only" and "Our whole group" both change nothing. | data scan |
| E9 | **rm-2.or1 "In a managed or franchised hotel, has the owner agreed in writing…?" is a blocker with no Doesn't apply.** An owner-run hotel that answers No gets Not ready (93%). Step 1 already records "Managed or franchised", but nothing uses it. | scen.js; `vHotel` TYPES |
| E10 | **Seven use cases ask the m8 question again** ("staff told about the tool and asked for feedback"): rm-8.or1b, res-8.or1, fb-5.or1b, hk-6.or1, hr-1.or2, hr-4.or2, hr-6.n1. | data scan |
| E11 | **33 of 99 use cases show the same area heading twice**, because the data order is kept (sm-1: Skills appears twice). | data scan; g15 screenshot |
| E12 | **Must-haves outweigh the tailored questions in the score.** The must-haves are worth 33 points. The use-case questions are worth 9 to 31 points (median 14), so the score is mostly the must-haves. | scen.js |
| E13 | **The same contradiction appears in hr-5 and hr-2.** In hr-5, the How it works answer "places staff without a manager confirming" can sit beside pe1 "manager confirms every match" = Yes. In hr-2, chat-only mode still shows "Can a person explain why the tool scored or ranked someone?" | data |
| E14 | **Wording a newcomer meets:** "Soft stop" as the headline, "Planned" defined by the vendor's written confirmation (under questions about staff agreeing), and "the tool" in the must-haves before any tool is chosen. Six terms are not in the glossary: SEO, GEO, QR, KPIs, ESG, P&L. | screens; data scan |

## Brief given to every advisor (under 200 words)

"Do you need AI?" v3.0 is a standalone self-check for European hotel managers who know nothing about AI. It runs Cover → About your hotel → five "is this an AI problem" questions (a No to Q1 or Q2 is a soft stop) → 11 must-haves (m2 and m4 can be Doesn't apply) → pick 1 of 99 use cases → 1–2 How it works questions, then 6–14 tailored questions → result. The result gives a verdict, a reason, a sensitive flag, top 3 actions, a plan per person, vendor questions, every answer, the method, the score last and a disclaimer. The PDF and Copy say the same. All tests pass, including 33 golden cases and a 26,935-run sweep matched to the reference. The owner's constraints: the spec JSON is the only source of wording (content changes are proposals), no legal content, plain English, and "Don't know yet" is the only uncertainty term. Question: is it ready for a timed test with 3–5 real managers, and what must change first? Evidence E1–E14 is attached.

## Step 1: Advisors

### Contrarian
The first thing to fail is the result page, not the logic. A manager spends 20 minutes on hr-1 and gets a top 3 made of generic must-haves (E1), written as questions with the question mark removed (E2). They will say "it told me nothing about rotas". The 99-use-case work is invisible where it matters. The second failure is in step 5. The questions show before the How it works answers. In 41 use cases a manager can answer questions that then vanish or appear (E3). In a timed test this looks like a bug, and it costs time. Third, the verdict mix. Anyone checking before buying will have Planned and Don't know yet on technical questions, so Not ready or Not enough info will be the normal result (E4). Managers who see red on a tool they have not bought yet decide the check is negative, and stop. Fourth, single questions that are wrong for some hotels: rm-2.or1 blocks an owner-run hotel (E9). If one of the 3–5 testers is independent and picks dynamic pricing, the session loses its credibility. Fifth, near-duplicates: "Ask an adviser" three times (E6), and m8 asked again (E10). With 3–5 people, one bad moment per session decides the feedback. How bad does it get? The test measures the result page's weaknesses, not whether the questions fit, and the owner learns the wrong lesson.
**Key point:** the result's top 3 must show the tailored work before managers see it, or the test judges the wrong thing.

### Assumption-Ripper
Assumptions under this plan, and how they hold up:
1. *"Tests passing = ready."* The tests prove parity with `sim_v3.py`, not that the rules suit a hotel. Golden 30 (all Planned → Not ready) is a design choice nobody has tested with a manager.
2. *"Planned is clear."* The help line defines Planned through the vendor's written confirmation, but it sits under "Has HR agreed to own the tool?" What does Planned mean there? Unknown until tested.
3. *"Managers answer must-haves about 'the tool' before choosing it."* The spec keeps this order. We assume they hold the job from step 2 in mind. Nothing on screen says so.
4. *"Owners can be General manager by default."* Must-haves and How it works actions are all given to the GM (`MH_OWNER`). The plan by person then puts nearly everything on one person, which defeats "a GM can forward the question".
5. *"The vendor list is for the vendor."* It is not (E7).
6. *"Each How it works question earns its place."* Two do not (E8). hr-2 and hr-5 have rules that assume ranking or auto-matching even when the answer says otherwise (E13).
7. *"3–5 managers can validate cut-offs."* They cannot. Five people can show confusion, time and trust. They cannot validate 75/50/25%. Say so in the test plan.
8. *"Migration matters for this test."* The testers are new users. Migration is tested in code and is not a test goal.
**Key point:** the test can answer "do managers understand it and trust the result", not "are the cut-offs right". Design the session around that.

### Expansionist
The upside nobody is using is that the tool already knows a lot about the hotel and the use case, and the result throws most of it away. Each question has an owner, an area and a "why". The top 3 could be one action per area that is blocking, with the "why" line as the explanation. That turns a list of tasks into a short brief a GM can forward. The test itself is an opportunity. Add a quiet session mode that stamps the time per step into the saved file. Then 3–5 sessions give real numbers for the cover line ("about N minutes"), and show where people stall: the use-case picker with 99 entries, or the five How it works questions in None fits. A search box over the 99 titles would also tell you, from what people type, which use cases are missing. That feeds D4's catalogue gap list. The hotel type in step 1 is collected and unused. Using it to show or hide owner-approval questions (rm-2.or1) is the first sign that the profile can tailor more. For HFTP, a clean "Ready / Almost ready" with three named actions is exactly the kind of one-page output the D9/D10 materials can quote as the framework working. The PDF's first page is the product, so design the session to test page 1 of the PDF, not just the screens.
**Key point:** use the timed test as a measurement tool (timings, search terms, PDF page 1) as well as a usability check.

### Outsider
I don't work in hotels or AI, and this is what I stumbled on. "Soft stop": stop what? It reads like a machine error. Just say what it means, e.g. "Maybe not an AI job". On the must-haves, "Is one named person in charge of **the tool**": which tool? I haven't picked one yet. On step 5, "First, how will this tool work in your hotel?": I don't know, I haven't bought it. Is "Don't know yet" OK here? Tell me it is. "Planned" with "if your vendor has confirmed it in writing": I don't have a vendor. "Must be Yes": OK, that one is clear. "Readiness score 80%" under a red "Not ready": that's confusing. 80% sounds good. Why is it red? (The answer is that one blocker is No, but I only learn that if I read the reason.) Then the pink box under the red box: is it a second failure? The top actions say "Find out: Do you know which number should improve, and what it is today". I can't do "find out: do you know". A heading appears twice on one page (Skills, then Skills again lower down). Did I miss something? What do SEO, ESG and KPIs mean? You spelled out PMS but not these. And on the soft-stop page, "Simpler options to try first" lists one vague sentence, not options.
**Key point:** every place where the screen says "the tool" or "vendor" before the manager has one needs a plain line telling them what to answer.

### Executor
Monday, in order:
1. **Owner (Ludo), 30 min:** read this council and rule on O1–O6 below. The code changes depend on O1 (action wording) and O2 (top-3 order).
2. **Builder, half a day:** BUILD NOW 1–7 (collapse step 5 until the How it works answers are in; reason cut to two items; the must-have and How it works intro lines; flag style; use-case search; session timing; vendor filter if O4 says so). Run all tests and the 1,636-combination browser test after each.
3. **Owner, 1 hour:** apply or reject content proposals C1–C12 in the spec JSON. C1, C2, C3, C5 and C9 are the ones a tester could hit. Rebuild and rerun the sweep, since C3/C5 change visibility.
4. **Team (Alban/Nicolás/Annabel), by Thursday:** book 3–5 managers, mixing independent and chain, and give each a different department. Use the existing session kit format. Fix the use case in advance for 2 of them (comparability) and leave it free for the rest (picker test).
5. **During sessions:** one leads, one notes, as the team already does. Stop the clock at each step. Write down every question re-read twice, every "what does this mean", and the verdict plus their reaction to it.
6. **Stop doing:** polishing migration and the hub routing for this test. The testers are new users.
Don't ship to HFTP before the sessions. Don't change cut-offs from 5 people.
**Key point:** one half-day code pass and one hour of content decisions, then test. Do not wait for more polish.

## Step 2: Blind peer review

The five answers were relabelled in a shuffled order: **A** = Executor, **B** = Outsider, **C** = Contrarian, **D** = Expansionist, **E** = Assumption-Ripper. Each reviewer saw only the labels.

**Contrarian reviews A, B, D, E.** Strongest: E's point that five people cannot validate the cut-offs. Without it the team will "fix" thresholds from anecdotes. Weakest: D's search box and timing mode. They are useful, but they add surface just before a test, and every new feature is a new way for a session to break. Keep timing (invisible), and make search optional. Missed by all: none of them asks what happens if a tester picks a sensitive use case (hr-, it-4, fo-6). The result is always Almost ready at best, with "Ask an adviser". That is correct, but in a 3–5 person sample it can make the tool look like it never says Ready. Assign use cases with that in mind.

**Assumption-Ripper reviews A, B, C, D.** Strongest: C's link between "Planned/Don't know yet before purchase" and a normal result of red. That is the riskiest untested assumption in the design. Weakest: A treats the content proposals as one hour of work. Changing visibility (C3, C5) changes the sweep, and the owner must regenerate `sim_v3` outputs and goldens, which is more than an hour. Missed: nobody checked whether the PDF page 1 actually fits the top 3 when the reason is long (E5). The cut to two items also protects the PDF.

**Expansionist reviews A, B, C, E.** Strongest: B's "80% under red Not ready". A one-line fix ("Not ready because a Must be Yes question is No, even with a high score") would pay off in every session. Weakest: E's point 8 (migration isn't a test goal) is right but trivial. Missed: nobody proposed letting a manager see the tailored blockers as a group ("3 things specific to rota planning"). It would show the tailoring without reordering the spec's top 3.

**Outsider reviews A, C, D, E.** Strongest: C's point that one wrong question (rm-2.or1) can sink a whole session's credibility. Weakest: A's "don't change cut-offs from 5 people" is fine, but it doesn't say what the team will do with the numbers. Missed: no one checked the start page's promise. It says "You do not need to know anything about AI", but step 5 asks whether the tool "acts by itself, within set limits". A newcomer cannot answer that without an example.

**Executor reviews B, C, D, E.** Strongest: D's session timing. It is cheap, invisible and gives the number the cover page needs. Weakest: B's "Maybe not an AI job" rename. It is good, but the spec fixes the verdict names, so it is an owner decision, not a quick fix. Missed: nobody set a pass/fail bar for the test. Proposed bar: median under 25 minutes, no tester stuck for more than 2 minutes on one screen, at least 4 of 5 say the top 3 is "something I would do", and 0 testers misread the verdict.

## Step 3: Chairman's verdict

### 1. Verdict
**Go with changes.** The logic, the tests, the no-legal rule and the per-use-case questions are sound enough to test. But the result page hides the tailoring (E1, E2) and step 5 can move questions under the manager's hands (E3). In a 3–5 person test, both would be blamed on the whole tool. Fix the code items below and the five content items a tester can hit, then test.

### 2. Where the council agreed
- The top 3 is the weakest part. It is generic, worded as questions with the "?" removed, and almost always owned by the GM (all five, plus the reviews).
- Step 5 should not show questions before the How it works answers are given (Contrarian, Outsider, Executor).
- "The tool", "vendor" and "Planned" confuse a manager who has no tool yet. Each needs one plain line (Outsider, Assumption-Ripper).
- A few data items are wrong for some hotels and must go to the owner before testing: rm-2.or1, the it-4 adviser duplicates, the dead hr-6/lg-4 options, hr-2/hr-5 contradictions (E8, E9, E13).
- 3–5 managers test understanding, time and trust, not cut-offs (Assumption-Ripper, Executor, two reviews).

### 3. Where it disagreed, and the ruling
- **Add features (search, timing) before the test, or freeze?** Ruling: add the session timing (invisible, no risk to the flow) and the use-case search (finding 1 of 99 is a known risk that the test should measure, not suffer from). Nothing else new.
- **Reorder the top 3 so tailored items come first, or keep the spec order?** This is the owner's call (O2), because the spec fixes the order. Recommendation: keep the order within each group, but list use-case blockers before must-haves inside groups 2 and 5. Must-haves are already shown as their own area in "Details by area".
- **Rename "Soft stop"?** The spec names it, so it is an owner decision (O3). Recommendation: rename it.
- **One hour or more for content?** The Assumption-Ripper is right. Changes to visibility need the owner's reference outputs regenerated. Do C1, C2, C9 and C11 (text and owner only, no visibility change) before the test. Do C3–C5 only if `sim_v3`/goldens can be regenerated the same day; otherwise steer testers away from hr-2, hr-5, hr-6 and lg-4.

### 4. Risks to watch
1. **Managers read a red verdict as "AI is not for us".** Early sign: a tester stops reading after the verdict box, or asks "so I shouldn't do it?"
2. **Step 5 confusion.** Early sign: a tester scrolls back up after answering a How it works question, or answers the questions before the How it works questions.
3. **Planned is used inconsistently.** Early sign: different testers give different answers to the same staff-agreement question, or someone asks "what if there's no vendor?"

### 5. Next steps
1. **Monday, owner:** rule on O1–O6 (below).
2. **Monday–Tuesday, builder:** BUILD NOW 1–8. After each one, rerun the unit tests, `ui.cjs`, `questions.cjs` and `a11y.cjs`. The sweep must still show 0 differences (none of the items touches scoring).
3. **Tuesday, owner:** apply C1, C2, C9 and C11 at minimum. Rebuild. Decide C3–C5 against the regeneration cost.
4. **By Thursday, team:** book 3–5 managers (at least one independent, one chain). Two get a fixed use case (rm-1 and gx-2, both able to reach Ready). Others choose freely. Avoid having only sensitive use cases.
5. **Sessions:** use the protocol in (d). Write up within 24 h, as the project's minutes rule requires.

### 6. Open questions
- Is a Not ready / Not enough info result before purchase what the owner wants (a sobering check), or should Planned count for more? This would change the verdict design, not just the wording.
- Should the step-1 hotel type tailor questions? That needs a new condition type in the schema.
- Will the sessions run inside the claude.ai viewer (downloads capability) or from a local file (Copy fallback)? Test whichever HFTP members will actually use.

---

## (a) BUILD NOW: code only (no spec JSON change, no change to scoring or verdicts; sweep parity stays 0 diffs)

1. **Step 5, show questions after How it works** (`src/app3.js` `vUse`). Until every asked How it works question has an answer (Don't know yet counts as an answer), render only the How it works cards. In place of the question cards, show "Answer the question(s) above to see the N questions for this use case." `R3Rules.visible` is unchanged. Next with How it works unanswered keeps today's open note. Update `questions.cjs` to answer the How it works questions first. Reason: E3 (41 of 99 use cases).
2. **Reason sentence capped at two items** (`src/rules3.js` evaluate, the `key === 'not'` branch with `bNo.length`). Name the first two blockers that are No, then add "and N more (see the plan below)". Same for the "In step 2 you did not answer Yes to" list. This keeps the reason to one short sentence on screen and on PDF page 1. Reason: E5.
3. **Line on the must-haves screen** (`vMust` sub-line, UI copy). Add: "Answer for the job you thought of in step 2. 'The tool' means the AI tool you have in mind; you pick the exact use case in step 4." Reason: E14, Outsider.
4. **Line under "First, how will this tool work in your hotel?"** (`vUse`). Add: "No tool chosen yet? Answer Don't know yet, or ask the vendor. You can change it later." Reason: E14.
5. **Flag box not styled as a second failure** (`src/style.css` `.note.flag`). Use a neutral information style (border and icon colour from the existing info token, not the red "lo" tone). The text stays verbatim. Recheck contrast in `a11y.cjs`. Reason: Outsider (pink box under red box).
6. **"80% but Not ready" line** (`vResult`, score panel only). When the verdict is Not ready or Not enough info and the score is 50 or higher, add under the score: "The verdict comes from the Must be Yes questions, not from the score." This keeps the score last. Reason: Outsider, Expansionist review.
7. **Search on the use-case picker** (`vWhere`). Add a text field "Search the 99 use cases" that filters titles across all departments. Data unchanged, every use case still reachable, keyboard-operable, 44 px targets. Add a test in `questions.cjs` (search "chat" finds gx-2; empty search shows the department list). Reason: Expansionist, risk of a 99-item picker in a timed test.
8. **Session timing for the test** (`src/app3.js`, `src/store3.js`). With `?session=1` in the URL, store `rec.timing = {<step>: [enterISO, leaveISO], ...}` in the record and in Save as file. Nothing is shown on screen; there is no network. Extend `clean()` so the field survives load. Reason: the cover line "about N minutes" and per-step stall data from the sessions.

## (b) Proposed content changes to the spec JSON (for the owner; not applied)

| # | id | Current text | Proposal | Reason |
|---|---|---|---|---|
| C1 | `rm-2.or1` (B) | "In a managed or franchised hotel, has the owner agreed in writing to automatic pricing?" | "Has the hotel's owner agreed in writing to automatic pricing?" (an owner-run hotel answers Yes). Later: show only when step-1 type = Managed or franchised (needs a new condition type in the schema) | E9: an owner-run hotel gets Not ready, or must answer Yes to a question that does not apply |
| C2 | `it-4` option `it4-face=yes` action; `it4-staff=yes` action | "Ask an adviser before a pilot that recognises faces." / "Ask an adviser before analysing staff behaviour on camera." | "Decide whether alerts without names are enough, so faces need not be recognised." / "Write down what the tool may and may not look at about staff." | E6: three near-identical adviser lines in the top 3; the flag already gives "Ask an adviser before a pilot." |
| C3 | `hr-6` gate `hr6-store`, option `no` ("No, in a central database") | effects `{}` | `{"action": "Ask the vendor whether patterns can stay on the device or staff card instead."}` | E8: an answer that changes nothing |
| C3b | `lg-4` gate `lg4-scope` (options hotel / group) | Both options have no effect | Drop the gate, or give "group" an effect (e.g. add "Has head office agreed who owns the group rules?") | E8: a question that changes nothing costs test time |
| C4 | `hr-2.PEOPLE_EXPLAIN` | Always shown (AUTO_PEOPLE) | `show_if: "hr2-mode=screen"` | E13: chat-only recruiting does not score or rank anyone |
| C5 | `hr-5.pe1` (B) "Does the HR or cluster manager check and confirm every match?" | Shown with `hr5-auto=yes` | `hidden_when: ["hr5-auto=yes"]` (the gate action already says "Make sure a manager confirms each match") | E13: Yes to both contradicts itself |
| C6 | rm-8.or1b, res-8.or1, fb-5.or1b, hk-6.or1, hr-1.or2, hr-4.or2, hr-6.n1 | "Have … staff been told about the tool and asked for feedback …?" | Keep only the use-case-specific part, e.g. hk-6.or1 "Have attendants been asked for feedback on workloads before start?"; drop "told about the tool" (that is m8) | E10: repeats must-have 8 (T9) |
| C7 | `gm-7.te1b` "Is there a safe place approved by IT to run the tools?" | `hidden_when: ["G_LINK=no"]` | `hidden_when: []` | Where a tool runs has nothing to do with connecting to hotel systems |
| C8 | `step2` s1, s2 (`no_message`), s3–s5 | No stop or cap action. "Simpler options to try first" is one generic sentence | Add `stop_action` / `action` per step-2 question and 2–3 concrete simpler options, e.g. s1: "A fixed rule in your booking or till system", "A checklist or template"; s2: "Keep doing it by hand and check again in six months" | E2 and Outsider: "Make sure: Does each case need judgement…" is not an action; the screen promises options |
| C9 | `must_haves[*]` and gate actions | No owner (code uses General manager) | Add `owner`: m1 OWN, m2 FIN, m3 OWN, m4 IT, m5 GM, m6 DH, m7 DH, m8 DH, m9 GM, m10 DH, m11 DH; library gate actions: G_ACT/G_LINK/G_PAID VEN-facing → IT or FIN | Assumption-Ripper: the plan by person puts almost everything on the GM |
| C10 | Order of `questions` in 33 use cases (e.g. sm-1.n2 Skills after Rules and controls; rm-1, res-1, fo-7, gx-2, fb-5 …) | n-questions appended at the end | Move each n-question into its area's run (the order is data, so only the owner can change it) | E11: the same area heading twice on one screen |
| C11 | `glossary` | No SEO, GEO, QR, KPI, ESG (P&L is spelled out in its title) | Add: SEO "search engine optimisation", GEO "being found by AI assistants (generative engine optimisation)", QR "quick response (square barcode)", KPI "key performance indicator", ESG "environmental, social and governance" | §2.6: spell out each acronym once per screen |
| C12 | `fo-1.te1b` "Does the tool send guest registration details to the reporting system you use today?" | Vague after the legal wording was taken out | "Does the tool send guest registration details to the system you already use to report guest arrivals?" | A manager asks "which reporting system?" |

Housekeeping, no rush: `res-8` and `it-4` list `sensitive.when` entries although `always` is true (harmless). The two NOTES items already on file (schema `original_questions` optional; Wi-Fi glossary) still stand.

## (c) Owner decisions

| # | Decision | Options | Recommendation |
|---|---|---|---|
| O1 | Action wording (spec §4 says "Make sure: <question without ?>") | (a) keep; (b) quote the question: `Get a Yes to: "…?"` / `Find out: "…?"` (code only, strings stay verbatim); (c) add an `action` text per blocker in the JSON (350 B items) | **(b) for the test.** Then (c) for the ~60 questions that most often reach a top 3 |
| O2 | Top-3 order (spec: blockers No in question order, so the must-haves always come first) | (a) keep; (b) within groups 2 and 5, use-case blockers before must-haves; (c) one action per area | **(b)**: shows the tailoring (E1); a code change of the ordering only, verdicts untouched |
| O3 | Verdict word "Soft stop" | (a) keep; (b) "Maybe not an AI job"; (c) "Try something simpler first" | **(b)**: plain English, says what it means |
| O4 | "Questions to ask the vendor" | (a) every Don't know yet question (today); (b) only Don't know yet questions owned by Vendor or IT, or in Technology or Money, plus the How it works vendor actions; the rest stay as "Find out" for their owner | **(b)**: E7 |
| O5 | Planned help line under every card | (a) keep under every card; (b) once at the top of steps 3 and 5, plus a second sentence: "For things inside your hotel, Planned means agreed and dated, but not done yet." | **(b)**: less noise, covers questions with no vendor involved |
| O6 | Verdict design before purchase (all Planned → Not ready, golden 30) | (a) keep and explain it on the cover ("most hotels checking before they buy get Almost ready or Not ready"); (b) let Planned count as half a Yes in the "half of blockers Yes" rule | **(a) for the test**, then decide with the sessions' evidence. Changing (b) changes goldens and the sweep |

## (d) What to test with managers

**Set-up:** 3–5 managers, at least one independent and one chain, different departments. Two get a fixed use case (rm-1 or gx-2: both can reach Ready). Others pick freely. Use the session URL with `?session=1` (BUILD NOW 8). One person leads, one takes notes. Think aloud. No help unless the manager is stuck for 2 minutes.

**Measure:**
1. Time per step and in total (target median under 25 min). Note where the clock stalls: the picker, the How it works questions, the must-haves.
2. Finding the use case: did they find theirs? How long did it take? What did they search for or say ("I'd call it…")? These words go into the D4 gap list.
3. How it works: do they understand "acts by itself, within set limits" and "who sees the answers first"? Do they use Don't know yet there?
4. Planned vs Don't know yet: ask each tester afterwards what they meant by Planned on two staff questions (e.g. m8, a use-case People question).
5. Doesn't apply: does a free-tool user find it on m2/m4? Does the contradiction note make sense, and do they use "Change my answer"?
6. Soft stop: give one tester a job where rules would do (e.g. "send a reminder email 3 days before arrival"). Do they stop, change their answers or continue? Do they understand the screen?
7. Result: after 10 seconds on the result, ask "What did it tell you?" Check that they can say the verdict, the reason and one action. Then ask whether the score under a red verdict confuses them, and whether the sensitive-area note reads as a second failure.
8. Top 3: "Would you do these this month? Who would you send each one to?" (target: at least 4 of 5 say yes to at least two actions).
9. PDF page 1 and Copy: "Would you forward this to your owner?" Does page 1 stand alone?
10. Trust: "Did any question not fit your hotel?" Note the question id (this is how C1-type problems are found).

**Do not conclude from 3–5 sessions:** the cut-offs (75/50/25%), the weights, or whether the verdicts are "right". Do conclude about wording, flow, time and whether the result is usable.
