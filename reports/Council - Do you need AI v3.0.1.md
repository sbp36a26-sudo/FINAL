# Council: "Do you need AI?" v3.0.1, ready for a timed test with 3–5 hotel managers?

*LLM council (skill `.claude/skills/llm-council/SKILL.md`), 25 Nov 2026. Five advisors, blind peer review, Chairman verdict. Run in one session (no subagent tool was available), so the skill's rule for writing the five answers one after another applies: no later advisor reuses an earlier one's points. Subject: `tools/readiness-3/` at commit `c1feeda` (v3.0.1). No code changed, nothing committed.*

Settled in the v3.0 council (`reports/Council - Do you need AI v3.0.md`) and not reopened here: the flow order, the no-legal rule, the scoring and cut-offs, "3–5 managers test understanding, time and trust, not cut-offs", and content items C1–C12 (still open, see b).

## What the council looked at

- `CLAUDE.md`, `spec/MASTER_PROMPT.md` (§0–§4), `README.md`, `CHANGELOG.md` (3.0.0 and 3.0.1), the v3.0 council, the 28 screenshots in `reports/readiness-3-screens/v301/`.
- Code: `src/app3.js` (`vWhere`, `searchUses`, `vUse`, `pendingRange`, `openNote`, `vResult`, `timeStep`, `render`), `src/rules3.js` (`firstTwo`, `evaluate`), `src/store3.js` (`open`).
- Unit tests rerun: banned 11, build 25, data3 43, result3 556, review 37, rules3 75, store3 45, all pass. Working tree clean.
- Page served from `tools/` on 127.0.0.1:8881, driven with Playwright at 1280×800 and 360×740 with `?session=1` (script `scratchpad/council31/probe.cjs`): hotel → step 2 → must-haves (mixed answers) → 58 search terms → rm-1 → step 5 held and released → result → saved-file keys. A Node scan (`scratchpad/council31/dk.cjs`) ran `R3Rules` over all 99 use cases. Server stopped afterwards. No page errors.

### Evidence (measured)

| # | Finding | Evidence |
|---|---|---|
| F1 | **BUILD NOW 1 landed.** Step 5 draws only the How it works card(s) and the line "Answer the question above to see the 7 to 9 questions for this use case…". After the answer, the questions appear below, the scroll position is kept and the first area heading is in view (y = 411 of 800; 286 of 740). | probe, screenshots 04–06 |
| F2 | **The held screen contradicts itself.** Pressing "See the result" with the How it works question open shows "8 questions have no answer yet… Press Next again to go on." The line above says "7 to 9". The 8 counts the How it works question plus 7 questions that are not on screen. The button is labelled "See the result", not Next (this mismatch is on every step 5 note). | probe; `openNote` + `S.open('use')` |
| F3 | **The new How it works hint steers into a cap.** "No tool chosen yet? Answer Don't know yet" is correct, but the spec rule "Gates answered Don't know yet always cap" means that with every other answer Yes, 99 of 99 use cases end at Almost ready at best. With the first option instead, 76 of 99 reach Ready. The screen does not say this. In 43 of 99 use cases, Don't know yet also gives the longest question list. | `dk.cjs` |
| F4 | **Search finds titles and departments only.** No hits for: chatbot, reviews (only "review" hits), complaint, rota, staff schedule, hiring, social media, cyber, personalization (US spelling), guest messaging, channel manager, f&b. The "What it does" text in `data/explain.json` would catch reviews (4), complaint (2), rota (1), social media (4), guest messaging (1). "AI" matches 47. | probe, 58 terms × 2 sizes |
| F5 | After you pick a use case, a new search keeps "Your choice: Demand forecasting…" under results that do not include it, and Next goes on with it. | probe; screenshot 03 |
| F6 | **The capped reason works but reads badly.** "9 Must be Yes questions are No: A named owner with time; A number to improve, approved and 7 more (see the plan below)." The title has its own comma, so "approved and 7 more" can be read as one item. The reason uses must-have titles, but the top 3 directly below uses the full question texts. | `dk.cjs`; screenshot 08 |
| F7 | **Sensitive flag:** the blue "i" style no longer reads as a second failure (screenshot 07). With every other answer Yes, the verdict box says "Held at Almost ready: this use case involves people's personal data or jobs", then the flag says it again, then the top 3 has one line, "Ask an adviser before a pilot." This is correct, but says the same thing three times. | screenshot 07 |
| F8 | Score line: "93%" under Not ready with "The verdict comes from the Must be Yes questions, not from the score." This is clear. | screenshot 09 |
| F9 | **Timing works locally.** `rec.timing` has start/hotel/s2/must/where/use/result with [enter, leave, ms], and the saved file holds it. Nothing shows on screen and nothing goes over the network. But: (a) it reads `window.location.search` of the page itself, and in the claude.ai viewer the page runs in a frame whose URL the tester cannot set (not verified either way); (b) the data only leaves through Save as file; (c) time with the tab hidden is counted; (d) "result" never gets a leave time. | probe; `timeStep` |
| F10 | Questions appearing after the How it works answer are not announced (the live region stays empty). A screen-reader user does not know that 7 questions were added below. | probe |
| F11 | Unchanged from v3.0, because these were owner items: the vendor list still holds the hotel's own questions ("Is it written who may change a forecast by hand…?"); the plan by person gives the GM 10 of 15 items; actions still read "Make sure: Does the tool receive…". | probe (O1, O2, O4, C9) |
| F12 | **Remove confirmation:** "Remove this check? It cannot be brought back. Save it as a file first if you may need it." Cancel has focus. This is good. **Conflict banner:** "Use the other version" / "Keep my answers" does not say what the other version holds. The risk in a one-tab session is low. | screenshots 10, 14 |
| F13 | Every new screen shows a thick blue box around its heading (programmatic focus). On a manager's laptop this may look like a text field. It is not known whether a mouse user sees it outside Playwright. | screenshots 04, 07, 08, 14 |

## Brief given to every advisor (under 200 words)

"Do you need AI?" v3.0.1 is a standalone self-check for European hotel managers who know nothing about AI: Cover → hotel → five "is this an AI problem" questions → 11 must-haves → pick 1 of 99 use cases (now with search) → step 5 (now: How it works first, the questions appear after) → result (verdict, capped reason, info-style sensitive flag, top 3, plan, vendor questions, score with an explanation line). v3.0.1 also added the must-have and How it works intro lines, a two-tab conflict banner, a remove confirmation and a hidden timing mode (`?session=1`). All tests pass; scoring equals `sim_v3.py`. Constraints: the spec JSON is the only source of wording (content changes are proposals), no legal content, "Don't know yet" is the only uncertainty term, scoring must not change. The earlier council's owner decisions O1–O6 and content items C1–C12 are still open. Question: is v3.0.1 ready for a timed test with 3–5 real managers, and what must change first? Evidence F1–F13 is attached.

## Step 1: Advisors

### Contrarian
The step-5 fix works, but it opened a new trap. The manager reads "No tool chosen yet? Answer Don't know yet". Most testers have no tool, so they will do exactly that, and then never see Ready (F3: 99 of 99). Twenty minutes later the result says Almost ready, "because you didn't know how the tool works". To them it feels like the tool punished them for following its own advice. That is the first credibility hit. The second is F2. A tester who presses "See the result" too early gets "8 questions have no answer… Press Next again". There is no Next button, and the line just above says 7 to 9. A timed session stalls right there. Third, search. Managers type their own words: "chatbot", "reviews", "rota", "upselling". Several return nothing (F4), and the empty message pushes them to None of these fits. That route can never be Ready and asks general questions, so the tailoring we want to test is skipped. Fourth, the timing mode is the measurement the test depends on, and nobody has checked it works inside the claude.ai viewer (F9). If it doesn't, the team finds out after five sessions with no data. Everything else (flag, score line, remove dialog) is fine.
**Key point:** the hint "Answer Don't know yet" plus the cap rule will make every no-tool tester land on Almost ready; say it on screen or the test measures confusion we caused.

### Assumption-Ripper
1. *"Testers will have a tool in mind."* Most hotels checking before they buy have none. The whole How it works step assumes they can say whether it "acts by itself". If they can't, F3 applies to everyone.
2. *"Search over titles is enough."* Titles are written in catalogue language ("Demand forecasting for rooms…"), not in the words a GM uses. F4 shows that the assumption fails on everyday words.
3. *"`?session=1` will reach the page."* Not verified in the viewer. If the sessions run from a local file it works, but then downloads fall back to Copy and the test is not the product HFTP members will use. Pick one and say which.
4. *"The reason sentence is short now."* It is shorter. But "A number to improve, approved and 7 more" assumes titles never contain commas. One does.
5. *"Questions appearing below is obvious."* It is with eyes on the screen (the heading lands in view). It is not for a screen reader (F10), and not for a tester who scrolled up to reread.
6. *"The flag in blue is neutral."* Yes, but the reason, the flag and action 1 now say the same thing three times (F7). We assume repetition reassures; it may read as padding.
7. *"Two tabs won't happen in a session."* Probably true, so F12's banner does not need work now.
**Key point:** before the sessions, verify that timing works where the sessions will actually run; everything the test concludes depends on it.

### Expansionist
v3.0.1 made the tool testable. Now make the test pay twice. First, the search box is a free research instrument. Every term a manager types and that gets zero hits is a use case named in their words, or a missing one. Keep the zero-hit terms in `rec.timing`'s sibling (say `rec.searches`, session mode only), and the five sessions give D4 a vocabulary list for the catalogue. Second, the How it works answers are the most interesting data in the tool. "Suggests, a person decides" against "acts by itself" is exactly what D2/D3 want to know about chains against independents. In session mode the saved files already hold them, so ask the team to pool the five files. Third, F3 is an opportunity, not only a risk. "You answered Don't know yet on how the tool works: ask the vendor these two things" turns the cap into the single most useful vendor question. The gate action already exists in the data, so it only needs to show plainly in the top 3. Fourth, the search could also match the "What it does" text already in the page (F4). That is a code change only, and it doubles what people can find without touching the spec. Later, a `keywords` field per use case (content) would let the owner add "chatbot", "rota" and the like.
**Key point:** log zero-hit search terms in session mode, so the test also feeds the D4 catalogue gap list.

### Outsider
New to all this, here is how I read it. Step 5: "Answer the question above to see the 7 to 9 questions". Fine, I understand. Then I press the big blue "See the result" because I want to see where it's going, and it tells me to "Press Next again". Where is Next? On the result: "9 Must be Yes questions are No: A named owner with time; A number to improve, approved and 7 more". Is "approved and 7 more" one thing? And why are the items in the box short titles, but the list right under it long questions? Are they the same things? The blue "i" box is calmer, good. But I am told about personal data in the verdict, again in the blue box, and again as action 1. Once was enough. The search box: I typed "chatbot" and got nothing. That made me think the tool doesn't cover chatbots, but it does ("AI chat assistant for guests"). Plural "reviews" fails but "review" works? The big blue frame around every page title looks like a box I should type in. And "The verdict comes from the Must be Yes questions": good, now I get why 93% is red.
**Key point:** every message must name the button that is actually on the screen, and the search must forgive plurals and everyday words.

### Executor
Monday, in order:
1. **Builder, 2 hours:** BUILD NOW 1–6 (held-screen note, Don't-know-yet line, search over "What it does" plus plurals, reason separator, live announcement, heading outline check). None touches `rules3.js` scoring. Rerun all unit tests, `ui.cjs`, `questions.cjs`, `a11y.cjs`, and the sweep (0 diffs).
2. **Builder, 30 min:** decide where the sessions run. Publish v3.0.1 as its own artifact (as planned) and open it in the viewer with `?session=1` on the artifact link. If `state().session` is false there, use the cover fallback from BUILD NOW 7.
3. **Owner, 30 min:** rule on O1–O9 below. O1, O2 and O4 change what the testers see on the result. O7 decides the F3 wording.
4. **Owner, 1 hour:** at least C1, C2, C9, C11 from the v3.0 council (text and owner only). Add search keywords later (C13).
5. **Team, by Thursday:** book the sessions. Brief note-takers on the three new watch points (held screen, Don't know yet on How it works, search words).
6. **Stop:** two-tab and migration polish. The testers are new users in one tab.
**Key point:** two hours of code, one verification in the real viewer, then book the managers.

## Step 2: Blind peer review

The five answers were relabelled in a shuffled order: **A** = Outsider, **B** = Executor, **C** = Assumption-Ripper, **D** = Contrarian, **E** = Expansionist.

**Contrarian reviews A, B, C, E.** Strongest: C's demand to verify timing where the sessions run. Without that, the measurement is a hope. Weakest: E's search logging. It is new data capture right before a test with real people, in a tool whose cover promises "your answers stay in this browser". It does stay local, but say so in the session consent. Missed: nobody asked what the note-taker does when the tester picks None of these fits after a failed search. Decide in advance: let them continue, and log it as a search failure.

**Assumption-Ripper reviews A, B, D, E.** Strongest: D's chain of reasoning, from the hint to Don't know yet to the cap to "punished for following advice". It is measured (F3), not guessed. Weakest: B's "2 hours" for six items. The search change needs the 99-reachable test and new search tests, and the live announcement needs `a11y.cjs`. Half a day is honest. Missed: nobody checked whether "Don't know yet" on How it works shows the most questions (43 of 99). That makes the no-tool path the longest one, which hurts the timing target.

**Expansionist reviews A, B, C, D.** Strongest: A's rule that every message names the button on screen. It is cheap and it applies everywhere. Weakest: D's "everything else is fine". The triple sensitive message (F7) is a small but real "this tool pads" signal, worth an owner decision. Missed: the result's top 3 for a dk gate already contains the gate action. Check that it shows in the top 3 and is not buried; that is the cap explained.

**Outsider reviews B, C, D, E.** Strongest: D's point that a failed search pushes people into None of these fits, which hides the tailoring under test. Weakest: E's `keywords` field. Good later, but the "What it does" search covers most cases now. Missed: the step-5 line "You can change it later." Later where? Say "on this screen".

**Executor reviews A, C, D, E.** Strongest: C's "pick one place to run the sessions and say which". It decides timing, downloads and realism together. Weakest: C's point 7. It is true, so drop it from the to-do list. Missed: a pass bar for the new pieces. Add these: at least 4 of 5 find their use case within 2 minutes without None of these fits; 0 testers stall on the held step-5 screen for more than 30 s.

## Step 3: Chairman's verdict

### 1. Verdict
**Go with changes (small).** The v3.0 BUILD NOW items landed. Step 5 no longer moves under the manager, the reason is capped, and the flag and score line read correctly. But three new problems sit exactly where testers will be. The held screen's note contradicts itself and names a button that isn't there (F2). The new hint pushes no-tool testers into a cap the screen doesn't explain (F3). Search misses everyday words (F4). Fix these (about half a day, no scoring change), check that timing works where the sessions run, then test.

### 2. Where the council agreed
- BUILD NOW 1–8 of v3.0 work as intended. No reversal is needed (all five).
- The held step-5 note must count what is on screen and name the real button (Contrarian, Outsider, Assumption-Ripper).
- F3 needs one plain line on screen, not a rule change. Whether Don't know yet should cap is an owner decision and not for 5 people to settle (Contrarian, Expansionist, reviews).
- Search must also cover the "What it does" text and plurals before the test (Contrarian, Outsider, Expansionist).
- Session timing must be verified in the place the sessions will run (Assumption-Ripper, Executor, two reviews).

### 3. Where it disagreed, and the ruling
- **Log zero-hit searches in session mode?** Ruling: yes, but only in session mode, stored in the record and the file like `timing`, and mentioned in the session consent (BUILD NOW 8). It is cheap and it feeds D4.
- **Fix the triple sensitive message now?** Ruling: no code change. The reason text and the flag are both fixed spec texts. It goes to the owner (O8).
- **Effort:** half a day, not 2 hours (Assumption-Ripper's review).
- **Conflict banner wording:** not before the test.

### 4. Risks to watch
1. **"It punished me for not knowing."** Early sign: a tester with no tool reads Almost ready and asks "what would make it Ready?"
2. **Search failure leads to None of these fits.** Early sign: two searches in a row with no hits, then the None of these fits radio.
3. **No timing data.** Early sign: `state().session` is false in the viewer, or no saved file is collected at the end of the session.

### 5. Next steps
1. **Monday, builder (half a day):** BUILD NOW 1–8. After each one, rerun the unit tests, `ui.cjs`, `questions.cjs` and `a11y.cjs`. The sweep must show 0 diffs.
2. **Monday, builder:** publish v3.0.1+ as its own artifact (new, never the hub). Open it with `?session=1` in the viewer and read `Readiness3.state().session`. Record the result in the session kit.
3. **Tuesday, owner:** rule on O1–O9. Apply C1, C2, C9 and C11 at minimum. Rebuild.
4. **By Thursday, team:** book 3–5 managers, as planned in the v3.0 council (d), with the changes in (d) below.
5. **Within 24 h of each session:** minutes, plus the saved file with timing.

### 6. Open questions
- Does `?session=1` reach the page inside the claude.ai viewer? (This decides BUILD NOW 7.)
- Should a How it works "Don't know yet" cap the verdict (spec rule) or only add the vendor action (O7)? It would change the goldens and the sweep, so not before the test.
- Do HFTP members use this in the viewer or from a file? The test should match.

---

## (a) BUILD NOW: code only (no spec JSON change, no change to `rules3.js` scoring, verdicts or caps; sweep stays at 0 diffs)

1. **Held step-5 note** (`src/app3.js` `openNote`, step `use`). When any How it works question is open, replace the count text with: "The How it works question has no answer yet. If you go on, it and the 7 to 9 questions after it count as Don't know yet. Press See the result again to go on." Use the plural "questions" when 2 are open, and take the numbers from `pendingRange`. On every step, name the real button. Steps 2–4 keep "Press Next again to go on." Step 5 (held or not) says "Press See the result again to go on." Test in `ui.cjs`: on rm-1, the note's numbers equal `#gates-first` data-min/max, and the note contains the label of `[data-act=next]`.
2. **The Don't know yet consequence, on screen** (`vUse`, `#hiw-help`). The new line is: "No tool chosen yet? Answer Don't know yet, or ask the vendor. You can change it on this screen later. With Don't know yet here, the result stays at Almost ready at best until you know." (UI copy, not spec data; the rule itself is unchanged.) Test: the text is present on all 99 use cases and on None of these fits.
3. **Search also matches "What it does" and plurals** (`searchUses`). Search over `title + department + EX[id].does`. Lower-case the query and strip a trailing "s"/"es" from each query word of four or more letters before matching. Treat "z" as "s" in both query and text (personalization → personalisation), and map the single token "f&b" to "food & beverage" (one code mapping, no content added). Keep "all words must match". Tests in `questions.cjs`: "reviews", "complaint", "social media", "personalization" each find at least 1; "chat" still finds gx-2; all 99 are still reachable; an empty search shows the department list.
4. **Reason separator** (`src/rules3.js` `firstTwo`, text only). Join with "; " and, when there are more, end with "; and N more (see the plan below)". Result: "A named owner with time; A number to improve, approved; and 7 more (see the plan below)." Update the `rules3` reason checks. Verdict, score and caps are untouched (golden 33/33, sweep 0 diffs).
5. **Announce the questions that appear** (`send('answer')` for kind `gate`). When the last open How it works question gets its answer, set `#live` to "N questions for this use case are now shown below." (N = `R.visible(...).length`). Test in `a11y.cjs`.
6. **Heading outline after a screen change** (`src/style.css`). Check in a real Chrome with mouse clicks whether `#h` shows the 3 px outline. If it does, add `#h:focus:not(:focus-visible){outline:none}` and keep `:focus-visible` for keyboard users. Update `a11y.cjs` (the keyboard run still shows the outline).
7. **Timing fallback, only if the viewer check fails** (step 2 of next steps). Also accept `#session` in the hash. If neither reaches the frame, add a team-only switch that changes no answer data: Alt+Shift+T on the cover toggles session mode, shows a 2-second toast "Session timing on" and stores the flag on the check (`rec.session = true`). Nothing else changes on screen. Also: add a leave time to "result" on `pagehide` (the existing L2 flush), and do not count time while `document.hidden` (pause in `visibilitychange`).
8. **Zero-hit search log, session mode only** (`searchUses` caller). When `SESSION` is on and a search with 3 or more characters shows 0 results for 1.5 s, push `{ q, at }` to `rec.searches` (max 50). Keep it in `clean()` and in the saved file. Nothing is shown on screen and nothing is sent. Mention it in the session consent (d).

Not built now: the conflict-banner wording (F12) and the stale "Your choice" panel during a new search (F5). Both are low risk in a one-tab session with an observer.

## (b) Content proposals for the owner (spec JSON; not applied)

The v3.0 council items **C1–C12 are all still open** (none was applied in 3.0.1). Before the test, the ones a tester can hit are C1 (rm-2 owner agreement), C2 (it-4 adviser duplicates), C9 (owners per must-have; F11: GM holds 10 of 15 plan items) and C11 (glossary: SEO, GEO, QR, KPI, ESG). New:

| # | Where | Proposal | Reason |
|---|---|---|---|
| C13 | `use_cases[].keywords` (new optional field, schema change) | Everyday words per use case for search, e.g. gx-2: "chatbot, chat bot, WhatsApp bot"; hr-1/rostering use case: "rota, roster, staff schedule"; sm-*: "social media, Instagram"; reputation use cases: "reviews, TripAdvisor, complaints"; it-*: "cyber, phishing" | F4: catalogue titles are not in managers' words; BUILD NOW 3 helps, but only data fixes "chatbot" and "hiring" |
| C14 | Must-have short titles used in the reason (`must_haves[].title`) | Remove internal commas, e.g. "A number to improve, approved" → "An approved number to improve" | F6: a comma inside a list item makes the reason ambiguous (BUILD NOW 4 masks it) |
| C15 | Gate actions for "Don't know yet" (library `G_ACT`, `G_LINK`, `G_PAID`, `G_AUD`, `G_PEOPLE`) | Make each dk action a concrete vendor question, e.g. G_ACT dk: "Ask the vendor: does the tool act by itself, or does a person approve each result?" | F3: if the cap stays, the action that lifts it must be obvious and forwardable |
| C16 | `none_fits` intro or the step-4 empty-search message source | Point to "try another word" before None of these fits (if the owner wants the message in the data; it is code copy today) | Contrarian: a failed search should not push people into None of these fits |

## (c) Owner decisions still open (merged with v3.0 O1–O6)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| O1 | Action wording ("Make sure: <question without ?>") | (a) keep; (b) quote the question: `Get a Yes to: "…?"` / `Find out: "…?"` (code only); (c) one `action` text per blocker in the JSON | **(b) before the test**, (c) later for the ~60 most frequent. Still visible on every result (F11) |
| O2 | Top-3 order | (a) keep the spec order; (b) inside groups 2 and 5, use-case blockers before must-haves | **(b)**: ordering only, no change to verdicts |
| O3 | Verdict word "Soft stop" | (a) keep; (b) "Maybe not an AI job"; (c) "Try something simpler first" | **(b)** |
| O4 | Vendor list content | (a) every Don't know yet; (b) only Vendor/IT owned or Technology/Money questions, plus the gate vendor actions | **(b)**: F11 shows the hotel's own question still listed |
| O5 | Planned help line under every card | (a) keep; (b) once at the top of steps 3 and 5, with the in-hotel sentence | **(b)** |
| O6 | Verdict before purchase (all Planned → Not ready, golden 30) | (a) keep and explain it; (b) Planned counts as half a Yes | **(a) for the test**; decide after the sessions |
| O7 | *(new)* How it works "Don't know yet" caps the verdict (spec §4) | (a) keep the cap and say it on screen (BUILD NOW 2); (b) Don't know yet adds the vendor action but does not cap (changes goldens and sweep) | **(a) for the test**; record how many testers answer Don't know yet and how they react, then decide together with O6 |
| O8 | *(new)* The sensitive message says the same thing three times (reason, flag, action 1) | (a) keep; (b) a shorter reason "Held at Almost ready: see the note below." (spec text change); (c) drop "Ask an adviser before a pilot." from the top 3 when the flag shows (spec §4 change) | **(b)**: the flag text stays verbatim and the action stays forwardable |
| O9 | *(new)* Where the sessions run | (a) the published artifact in the claude.ai viewer (real downloads; timing to verify); (b) a local file (timing certain; Copy instead of downloads) | **(a)** if `?session=1` or BUILD NOW 7 works there; otherwise (b), and note in the minutes that downloads were not tested |
| O10 | *(carried from 3.0.1, D1)* Keep the first-visit import of readiness-2 checks | (a) keep; (b) delete | **(a)** for now. It does nothing on a published artifact, and it is not a test item |

## (d) Manager-test plan: changes to the v3.0 plan

1. **Pre-flight (builder, the day before):** open the exact session link on the session laptop. Check that `Readiness3.state().session` is true, that a test run saves a file with `timing` (and `searches`), and that Download (PDF) works. If any of these fails, switch per O9.
2. **Consent line (lead, at the start):** "The page notes how long each step takes and the words you search for. It stays on this laptop and in the file we save at the end."
3. **End of each session:** the lead presses Save as file before closing the tab. Name the file `session-<n>.json` and keep it with the minutes (24 h rule).
4. **New watch points for the note-taker:**
   - Step 4: every word typed in search, whether it found their use case, and the time to choose. Pass if at least 4 of 5 find theirs within 2 minutes without None of these fits.
   - Step 5 held screen: did they answer the How it works question first, or press See the result? Note any stall over 30 s (pass: 0).
   - How it works: who answered Don't know yet, and what they said on seeing Almost ready (O7 evidence). Ask: "What would you need to know to answer this?"
   - Result: for a sensitive use case, ask "Was the note about personal data said once too often?" (O8 evidence).
5. **Use-case assignment:** keep the v3.0 plan (two fixed: rm-1 and gx-2). Tell the gx-2 tester only "a chat assistant for guests", so the search is tested with their own word.
6. **Time target:** median under 25 minutes stays. Report the How it works "Don't know yet" path separately, since it shows the most questions in 43 of 99 use cases.
7. **Do not conclude from 3–5 sessions** about the cut-offs, the weights, or whether Don't know yet should cap (O6, O7). Do conclude about wording, finding the use case, the held step-5 screen, time, and whether the result is usable.
