# Do you need AI? (formerly "AI starting point", "Readiness 2.0"): changelog

## v2.7 (25 Nov 2026): two PDFs on the result page, no sources in either. Rules v2.6 unchanged. Not committed, not published.

Owner: "there should be two different things to download. First is a document including: Result, Start with these three, Action plan by person, Questions for the vendor, EU AI Act. Then another document that has all the questions and the answers provided. Sources shouldn't be in the downloaded files."

- **Result PDF** (`_result.pdf`, button **Download result (PDF)**, `#pdf`, primary): the redesigned layout, header and footer; only Result (summary block, verdict box, reason, points and honesty line, the verdict's line, "Since last time" when there is one), Start with these three (with the law, cap, must-haves-only and draft notes), Action plan by person, Questions for the vendor, EU AI Act (label, not-legal-advice note, items). Removed: the five-answers card, Where it sits, areas, every answer table, how it was worked out, all source lists.
- **Answers PDF** (`_answers.pdf`, **Download answers (PDF)**, `#pdf-answers`): summary (hotel, use case, filled in by, date, "Result: verdict · score"), the first three lines of the scoring method (they fit page 1), then a two-column table Question | Your answer: step 2 (five), step 3 (ten, "Planned (planned by <date>)"), step 5 (the use case's tailored questions and add-ons, one band per area; none for "None of these fits"). An answer saved before v2.3 and no longer offered reads "Not answered". The answer column is 50 mm wide so a planned date stays on one line. No sources, links or evidence lines.
- **Stop screen**: still one "Download (PDF)" (`#pdf`), the one-page version; its source list is gone too.
- **Result page top row**: Download result (PDF) · Download answers (PDF) · Start a new check. Cover "What you get" says two PDFs and a file; the "not keeping your answers" notice names both buttons.
- **Download machine**: unchanged states; `ui.dlKind` is now 'pdf' | 'answers' | 'file'. A press while a download runs is refused before it can overwrite `dlKind`; while one runs both PDF buttons and Save as file are disabled and only the pressed button says "Preparing the PDF…". The hub bridge, the `dl` states, toasts and the plain-link fallback serve both. `R2Pdf.model(rec, env, kind)`, `R2Pdf.fileName(hotel, today, kind)` ('result' | 'answers' | 'file': no suffix, the JSON file's base name, unchanged). Layout: a lead with a tone (the AI Act label) and the AI Act note now stay with what follows; table text of step 5 rows is regular weight.

**Changed expectations** (each because of the two documents): `pdf.test.mjs` (section list; sameWords reads the Result PDF only and checks that nothing from the other sections or any source or link is in it; no 'page', 'q', 'area', 'src' blocks in it; new answersDoc checks; stop headings without "Sources"; page counts result 1 to 4 / answers 2 to 6; both kinds drawn and laid out; file names with `_result` / `_answers`; orphan check only for lines at heading indent), `v21.test.mjs` (item 6: no areas section in the PDF; L13: no source text in the PDF), `v22.test.mjs` (the PDF has "Use case: <plain name>", not Where it sits / what it does / catalogue name), `v251.test.mjs` (the Answers PDF carries the five answers; the Result PDF has no five-answers card), `v26.test.mjs` (Q1 No tone read from the Answers PDF's first row), `flow.test.mjs` (a start is refused in every busy state), `walk.cjs` / `v23.cjs` (top row ids and texts; PDF words: no areas or method; both downloads, names, hub), `v21.cjs` (double-click on both buttons: one file each), `v26.cjs` (the five answers are read from page 1 of the Answers PDF). New: `tests/browser/v27.cjs` (48).
Screenshots of both PDFs for three cases (Ready, Not ready with Planned dates, None of these fits): `reports/readiness-2-screens/pdf2/`.

## v2.6.1 (24 Nov 2026): clean-up inventory v4. Rules v2.6 unchanged. Not committed, not published.

Clean-up skill on v2.6 (commit `eebd0d9`), its hub glue and the Team tab reader: `reports/audit-readiness-2/cleanup_inventory_v4.md`. No wording, question, scoring or design change. Ids, `data-*` / `data-state` hooks, the storage key, store and file version (3) and the hub message shapes are unchanged.

**Fixed (each first proved by a test that failed on v2.6):**
- **B1 (high)** The hub's detail layer stayed open over the tool after the tool's own step or check changed (browser or phone Back, a `#use=` link, another tab removing the check): `closeDetail()` dropped the layer state without telling the hub. The stale layer then covered the new step, Esc went to the frame and no longer reached it, and only its Close button got the person out. Now every drop the hub did not start sends `{ hub: 'detail-close' }` (`closeDetail(moved, noFocus, fromHub)`).
- **B2 (low)** The hub's layer stayed up when the tool's frame reloaded under it. The hub now closes it (quietly, focus into the frame) when that frame pings again.
- **B3 (medium)** A page open while another tab saved a **newer** store merged it and wrote its own older store back (`follow()` never looked at the version). It now turns read-only (`storage = 'newer'`, the existing "newer version" line), as on load.
- **B4 (medium)** A v2.5 page already open in another tab writes the store back as version 2 without `qv`; this page then turned question 1 round a second time and dropped questions 3 and 4 on every check it held. `F.migrate` now reports `info.older`, and `F.mergeTabs(mine, theirs, { older })` keeps this tab's own version of every check it holds and takes only checks it does not know (read once in the old meaning).

**Dead code and stale docs:** the register's `host.hub` flag (left from the removed link bridge; register rebuilt); README (assistant-only rule, must-have 7 line, file `v: 3`, the claim that an open older tab never writes back, the test list), `tools/hub/CONTRACTS.md` bridge row (no `link`; the detail messages) and detail section, `CLEANUP.md` (store version 3, Q1 Yes stops, v2.6.1 section), `tools/hub/CLEANUP.md`, app.js and logic.js comments, `tests/v251.test.mjs` header.

**Tests:** new `tests/v261.test.mjs` (26) and `tests/browser/v261.cjs` (45: B1 to B4 at 1280 and 390 px, plus a guard that `detail-close`, `ping` and `detail` from another hub frame change nothing). Changed expectation: `tests/v26.test.mjs` reads the hub's close with the new third argument. Guard: every one of the 99 layers passes the hub's own `hubDetail` check (G1).

## v2.6 (24 Nov 2026): question 1 turned round, new questions 3 and 4, source links that open in the hub. Rules v2.6. Not committed, not published.

Owner decisions of 24 Nov 2026 (A, B, C) and the coordinator's change to C after the owner's test in the claude.ai viewer.

**A. Question 1** now reads "Can each case be fixed with an “if this, then that” rule?". **Yes** (fixed rules can do it) is the stop screen ("This is not suitable for AI.", "Because you answered Yes to: …"); No goes on; Not sure unchanged. Yes-if / No-if, hint, examples, the Not-sure line ("If question 1 turns out to be Yes …") and the step 2 intro ("a No to question 1 and a Yes to the others point towards AI") follow; the "Why this matters" boxes take their colour from the meaning (for Q1 the Yes box is red). The result card's and the PDF's colour per answer now follow its meaning (`aiMeaning().good`), so Q1 No reads "Met: every case is different …" in green. `q.stopOn: 'y'`, `ctx.q1Stop` (was `q1No`).
**Migration (decision: ids q1 to q5 kept).** Every record now carries `qv: 2`. A record without it (browser store, saved file, v1 record, the other tab's store) is read once through `R2Logic.legacyQ`: Q1 Yes ↔ No, Not sure stays, old Q3/Q4 answers dropped and listed in `Qnew`; step 2 then says "Step 2 changed …" and marks questions 3 and 4 ("New question: please choose an answer."). Store and file version 3 (`F.V`), so a v2.5 page in another tab treats the store as newer and never writes it back without `qv`. Team copies get `qv: 2`; the Team tab reads a copy without it through `legacyQ`. Keeping the ids is clean because the conversion is versioned per record and runs in the one reader every path uses (`cleanRec`); new ids would have needed the same versioning for Q1 anyway. A check that stood on its result now opens on step 2 until questions 3 and 4 are answered; a stop stays a stop.

**B. Questions 3 and 4** replaced (C-R-I-S-P letters kept): "Information to learn from" ("Are there many past examples of this task …?") and "Some mistakes are acceptable" ("Is it acceptable if the result is right most of the time, but not every time?"), with the owner's Yes-if, No-if and why; outcomes "Too few examples to learn from." and "A rule-based tool or a person is the better choice.". Source: Brynjolfsson & Mitchell (2017), *Science* 358(6370), 1530–1534, in "Where this comes from" and in `research_notes/AI starting point/research.md` (added note). Rules v2.6: a No on Q3 or Q4 holds the top verdict like Q2/Q5 (order Q2 > Q3 > Q4 > Q5); `Q4_NO_HOLDS_TOP`, the "assistant only" verdict and line (`ASSIST_LINE`, `#assist`) and the must-have 7 consistency line (old Q3 meaning) are gone. wording.json core: 30 keys (9 added, 3 changed). The session kit quotes no question text: unchanged.

**C. Source links.** The source's name is the hyperlink; the address and "Copy address" stay under it; no "Open the source"; no click interception in this tool, the catalogue or the register. Inside the hub (owner's test: links in a frame never open, links on the main page do) "Details and sources" / "More detail" send `{ hub: 'detail', id, data }` (`R2Logic.detailData`, the same JSON the page's own dialog is drawn from); the hub validates it (`hubDetail`) and draws the layer on its main page over exactly the frame's area, in this tool's look; Esc, Close and the dimmed area close it and give focus back to the opener (`detail-closed`); another hub tab closes it. Standalone the page keeps its own dialog. The catalogue and the register keep plain hyperlinks (too many link places to move: open, owner). The hub's `link` message and bottom panel are removed. Cache-busting: `build-hub.mjs` writes each frame page's content hash; frames load as `<page>?v=<hash>`. Name links wrap as text (the old `inline-block` 44 px line broke long names); the target keeps 44 px through padding.

**Tests** (unit: v26 new, 100; browser: v26.cjs new, 91). Changed expectations, each because of A, B or C: `finished()` answers Q1 No; Q1 stop tests use Yes; store/file version 3; v1/v2.0/v2.4 fixtures open on step 2 with Q1 turned round and old Q3/Q4 dropped (their Partly/share tests give step 2 in the v2.6 meaning first); question texts, titles, word limits (Q3 22, Q4 16 words, the owner's texts); the 3^5 oracle (Q1 Yes stops, `exact`); pattern I is "Almost ready, Held back: a No in step 2"; JUDGEMENT without `Q4_NO_HOLDS_TOP`; no m7 line; v2.0 share copy reads out of date after conversion; `sourceRow` without `data-ext`; the link-bridge tests (hub, v251) replaced by detail-layer and plain-link tests; v23.cjs proves the in-frame layer standalone only.

## PDF redesign (24 Nov 2026). Not committed, not published.

Owner: "the PDF needs to have better output and look more appealing". Only `src/pdf.js` and `tests/pdf.test.mjs` changed; words, rules, storage and the screen are unchanged.

**What was poor (before, `reports/readiness-2-screens/pdf/before/`):** everything in one grey; the verdict was a bold body line, no stronger than the reason under it; page 1 ran straight into the five questions; areas, the action plan and the legal items were dash lists (nothing to tick); every answer took three stacked lines (two pages for 18 questions); seven sizes of type; no running header; the footer on one line; headings kept with "about 24 mm", not with their content.

**Now (`after/`):** A4, 20 mm side margins, four sizes (title 20, heading 12.5, body 9.5, small 8; the verdict word 17), Register Sans, the tool's colours. Page 1 is the summary: hotel, use case (new label "Use case:"; the use case's name, or "None of these fits"), date, the verdict box in the verdict's colour (soft fill, a coloured edge: verdict, score, the box's short reason line as on screen, the must-haves line), the reason and the points under it, then "Start with". The five questions start on page 2 as a card (answer in a coloured tag, its meaning under it); areas as a table with bars; the action plan by person with tick boxes; numbered vendor questions; the AI Act label in the accent colour, its items with tick boxes; every answer as a two-column table ("Question" / "Your answer", the head repeated on each page, the answer in its colour); method and sources in small type. Running header (tool, hotel, date) from page 2; footer "Do you need AI? · student prototype, not legal advice" left, "page n of N" right. Each block is measured before it is drawn: no block splits, a heading keeps its first block with it, the areas table stays whole; the stop version stays one page (tighter gaps).

**Fixed:** the box's short reason line (`#box-reason`) was missing from the PDF; it is now in the box.

**Tests** (`tests/pdf.test.mjs`, 482 → 714): changed expectations: the verdict block is `k: 'verdict'` (name, score, box, must-haves line, colour); `texts()` reads `box`; the words check includes the box line; margins 20 mm. New: page 1 is the summary (one page break, before the five questions); the running header and the footer on every page; no line past the margins or the bottom margin; no heading, sub-heading or table head as a page's last line (fails 10 times with keep-with-next off); page count 4 to 9 over 33 use cases; stop with five No answers still one page. All suites and browser walks green (walk 860, v21 610, v23 144, v25 137, v251 54).

## v2.5.1 (24 Nov 2026): sources open in the hub; the "Is this an AI problem?" card explains every answer. Not committed, not published.

Two owner-reported problems in the published hub. Rules (v2.5), storage, file format, ids and the existing hub messages are unchanged.

**1. "None of the sources open."**
- Data: the bundle (`build.mjs` `detailModel`) already resolved the catalogue's shapes at build time ('c'/'h' `[type, name, note, url]`, 'l' `[type, text, url]`, 'r' `[type, refKey, note]` through the catalogue's `src` table, only the referenced entries) into one shape `[type, name, note, url]`. The renderer now goes through the pure `R2Logic.sourceRow` / `sourceItem`, which reads both the bundled shape and the catalogue's raw shapes, prints a readable name (a study by its citation, never its key), its note and exactly one "Open the source" link per http(s) URL; a URL is never printed as text, a non-http(s) URL is never a link; plain links ('l') are no longer set in bold. New unit test `tests/v251.test.mjs`: all 325 sources of the 99 use cases (174 c, 38 h, 48 r, 65 l), bundled and raw.
- Opening: inside the claude.ai artifact sandbox a `target="_blank"` link in the hub's nested frame does not open. New hub message `{ hub: 'link', url }` (frame to hub, no reply; `tools/hub/CONTRACTS.md`). Once the hub has answered the ping, a click on an external http(s) link is sent to the hub, which checks the url (`hubLinkUrl`: http/https only, at most 2048 characters, no spaces or control characters, no user name or password, only from its own frames) and opens it from the top page with a real `<a target="_blank" rel="noopener noreferrer">` clicked in the message handler (`window.open` if that throws). On its own the page keeps ordinary links. The same bridge was added to the Use-Case Catalogue (new ping, its source links) and the AI Register (the watch list's law links); the AI Act guide has no external links.

**2. The result's "Is this an AI problem?" card.** Under the verdict word ("Find out first.", "Worth exploring with AI." ...) it now lists all five questions: title, the answer (Yes / No / Not sure) and what it means, from the questions' own words (`R2Logic.aiMeaning`): Yes = "Met: <Yes-if test>"; No = the defined consequence (outcome and its follow-up; Q4 No = assistant only); Not sure = "To find out: yes if ...; no if ...", whom to ask, and what a No would mean (Q1: the existing sentence). The card spans the full width and "Where it sits" stacks under it, each as tall as its content (no empty box). The PDF's section says the same under each answer ("Your five answers and what each means"; the separate carried / to-find-out lists were folded into it). The "Copy" texts do not include this section.

Tests: new `tests/v251.test.mjs` (85) and `tests/browser/v251.cjs` (52: link bridge in the hub for readiness-2, catalogue and register, bad urls ignored, standalone links, the card on desktop and phone); hub tests +5 (26). Changed expectations: `tests/pdf.test.mjs` (the PDF must carry each answer's meaning instead of `m.ai.carried` / `m.ai.find` / `m.ai.q1Unsure` as separate lines; its text helper reads the new `m` field of a question block). Screenshots `reports/readiness-2-screens/v25/v251-*.png`.

## v2.5 (24 Nov 2026): the council on v2.4, the owner's decisions O1 to O9, clean-up inventory v3. Rules v2.5. Not committed, not published.

Inputs: `reports/Council - Do you need AI v2.4.md` (section 5, BUILD NOW 1 to 12, owner decisions O1 to O9) and `reports/audit-readiness-2/cleanup_inventory_v3.md` (H1, M1 to M5, L1 to L5, dead code, stale tests). The owner said "do everything now" and took the council's recommendation on each decision. Storage key, store version (2), file format, hub message shapes, ids, `data-*` and `data-state` hooks are unchanged. Records saved by v2.0 to v2.4 open: new fixture `tests/fixtures/v2.4-saved.json`, saved by the committed v2.4 page in a real browser before any change (a shared check, a "None of these fits" check, a saved file, the team's test copy).

**Rules v2.5 (team judgement, not tested with hotels; each named in `JUDGEMENT` in `src/logic.js` and in "How this was worked out"). Points unchanged: Yes 2, Planned 1, No 0, Don't know yet 0.**
- O1 (c) `ALMOST_MIN_MUST_YES: 50`: "Almost ready" needs at least half the must-haves at Yes; below that, "Not ready yet" ("Planned" is not done yet). `READY_MIN_TAIL_YES: 50`: "Ready to start a pilot" needs at least half the tailored questions that were answered at Yes; otherwise the top verdict is held back.
- O2 (b) `NOT_SURE_HOLDS_TOP: true`: any "Not sure" in step 2 holds the top verdict ("Because you answered Not sure to “Complex judgement” in step 2. …").
- O3 (b) `Q4_NO_HOLDS_TOP: false`: a No on question 4 no longer holds the top verdict; the result shows "Use it as an assistant only: a person checks every result before it counts." (`#assist`). `CARRIED_NO_HOLDS_TOP` covers questions 2, 3 and 5.
- O4 (b) `NONE_BEST_ALMOST: true`: with "None of these fits" the best verdict is "Almost ready", with "No use case chosen: the must-haves are in place, but nothing was checked for a particular tool."
- Results kept under rules v2 to v2.3 show "worked out with earlier rules" and are not compared line by line (fixture check).

**Owner decisions on the page.** O5 (b): one short line in the verdict box (`#box-reason`) only for "Not ready yet" ("Because 1 must-have is No.", "Because only 0 of 10 must-haves are Yes.", "Because the score is below 50%.") and a held verdict ("Held back: legal items to check.", "… a No in step 2", "… Not sure in step 2", "… fewer than half the questions for this use case are Yes", "… no use case chosen"); otherwise the box stays verdict, score, must-haves line; the top verdict keeps its name. O6 (a): see BUILD NOW 5; `act` stays in the data for the later wording pass. O7 (b): `SHARING_DEFAULT = false` in `src/app.js`: no share fold and no "Share a copy" on a new result, in the hub too; a check that already has a copy keeps its panel ("Sharing with the project team is switched off.") with its withdraw button, and the header line, "Your checks" and the remove dialog still withdraw. **To switch sharing back on:** set `SHARING_DEFAULT = true` in `src/app.js`, run `node tools/readiness-2/build.mjs` and `node tools/build-hub.mjs`. O8 no change (decide after the test). O9 must-have 4 wording kept.

**Council BUILD NOW (copy as given in the report).**
1. Under "Not ready yet" when no must-have is No but fewer than half are Yes: "No must-have is at No, but only {n} of 10 are in place. “Planned” is not done yet: finish these before you talk to vendors." (With O1 this case is "Not ready yet", not "Almost ready"; the old "Almost ready" line stays when half or more are Yes.)
2. Under the held verdict when fewer than half the tailored questions are Yes: "Every must-have is in place. For this use case, {y} of {n} questions are Yes and {p} are planned: finish the planned ones before the pilot starts."
3. Never "Nothing open." under a held verdict: the hold is item 1 of "Start with" ("Settle this first: in step 2 you answered No to “{title}”. {outcome}", "Settle this first: this use has legal items to check (see “EU AI Act” below). A named person must check them before a pilot."; for O2 and O4 the same frame with the step 2 "Not sure" and the "no use case chosen" line). A hold names no person; the PDF prints it without one.
4. Superseded by O3 (b): question 4 no longer holds.
5. A tailored item's task is the team-worded question: "Make this a Yes: {question}", "Finish: {question}" (+ "(planned by …)"), "Find out: “{question}”"; on screen, in "Start with", the copy-per-person text, the PDF and the Team tab. Must-have actions unchanged.
6. "Copy for IT" (the role's display name, never lower-cased; only a leading "The" reads "the"); the toast too.
7. Step 3 lines under must-haves 3 and 7 when step 2 says otherwise (`#consist-m3`, `#consist-m7`); no blocking.
8. Detail layer: the "AI technique" research notes are gone (no longer bundled: 99 entries, `srcs` only); "The catalogue’s own description (research wording)" under "For the detail-minded". Kept: what it does, how the AI works, how common, catalogue name, examples and sources.
9. Sources: "State of Hotel AI, Fall 2026" now names its commissioner and researcher, from the team's opened source (`research_notes/AI starting point/research.md`: "research by Josiah Mackenzie (Actabl), commissioned by Destination AI"), and its base adds "global survey, vendor-linked; not comparable with the European figures" (four figures, must-haves 3, 4, 7, 8). Eurostat shares are whole numbers on screen (70%, 57%, 52%, 46%, 43%, 41%; the cover's 70% and 46%); the exact shares are listed in "Where this comes from" under the must-haves.
10. Docs and screenshots: README journey table, this entry and the `7e0530e` entry above, `docs/PROJECT_CONTEXT.md`; `reports/readiness-2-screens/wording/` retaken (same file names; the "picker-panel-open" shots now show the detail layer, the button they showed is gone).
11. Under the top verdict (`#pilot-gloss`, PDF): "A pilot: a trial with one team or one outlet, for a set time (for example 8 to 12 weeks, the team’s suggestion), measured against the number from must-have 3." No source gives a pilot length for hotels, so the weeks are marked as the team's suggestion.
12. Session kit (no code): `reports/Do you need AI - session kit.md`, built from section 5 (c) of the council report.

**Clean-up inventory v3** (each reproduction is now a test that failed on v2.4 and passes: `tests/v25.test.mjs`, `tests/browser/v25.cjs`).
- H1: replacing a shared check with a saved file keeps its share fields (`F.keepShare` in `reduce('import')`); the replace question adds "The project team’s copy of this check stays shared; you can still withdraw it."; the copy can be withdrawn afterwards (R5, with sharing off).
- M1, M2, M3: the detail layer is one state, `ui.layer = { use, from, step, check }`, closed by any step or check change (browser Back, a `#use=` link, a store event; focus to `#view`) and only by a click outside the drawer's box; `#app[data-layer]`. The minimum fix for phone Back is in place; Back closing only the sheet was not built.
- M4: two tabs: this tab keeps its answers and takes the store's share fields.
- M5: the copy box opens next to its button (after the person's list, inside the vendor fold).
- L1, L2: an old Partly reads "Answer again: …" and "Not answered (earlier answer: Partly, no longer offered)" in "Start with", the action plan and the Team tab (one helper `L.answerState`).
- L3: snapshots carry the question signature; other questions are "asked with other questions, not compared line by line".
- L4: README, comments, CLEANUP (stable ids without `#copy`, `#print`), the `7e0530e` entry, hub-bar comment.
- L5: `ui.dlKind`, `ui.fileInfo` declared, cleared on "Keep the one here" and any move, in `state()`.
- Dead code removed: `summaryText` (logic and AX), `SYSTEMS_NOTE`, `READY_NONE`, `p`/`na` in `ANSWER_WORD`, the old explainer CSS, `catLink` (now `detailButton(u)`). The hub's `'use-case-catalogue'` open entry is kept (comment fixed).

**Changed test expectations (each because the old one encoded a rule or a feature the owner changed, or a bug fixed here):**
- logic: the independent arithmetic follows rules v2.5; "exactly 75% → Ready" uses a set with 3 of 4 answered tailored questions at Yes (the old set, 3 of 8, is now held: new assertion); "exactly 50% → Almost ready" uses 5 must-haves at Yes (all Planned is now "Not ready yet": new assertion); "exactly half unknown" is "not Not enough information yet" (it is now "Not ready yet", 1 of 10 must-haves Yes); "None of these fits" all Yes is "Almost ready" (O4); the Copy summary check reads the PDF.
- pdf: a hold in "Start with" has no person.
- v21: rules v2.5; `JUDGEMENT` has the five new constants; B6 no longer lists question 4 (O3) and "Not sure" now holds (O2); the method line names questions 2, 3, 5; M6 "None of these fits" is "Almost ready" with the O4 line; the copy-text halves now read the PDF.
- v22: header (the explainer browser proof no longer exists); the summary check reads the PDF.
- v23: rules v2.5; the gone-use copy names an old answer with `answerWord` (L2); the bundled detail has `srcs` only (BUILD NOW 8).
- browser walk: the verdict box may hold `#box-reason` (O5); a hold in "Start with" has no person; sharing paths run with the test switch on (O7).
- browser v21: "None of these fits" is "Almost ready"; rules v2.5 in the share document, file and Team tab rules card; the copy text is gone; test switch on.
- browser v23: the layer shows "The catalogue’s own description (research wording)" and no "AI technique"; the no-explainer check reads the words and counts one button per row.

**Proof.** Unit: logic 7,477 · flow 5,987 · questions 917 · pdf 482 · build 120 · v21 1,203 · v22 809 · v23 264 · v25 116 (failed 70 of 116 on v2.4). Browser (1280 and 390 px, standalone and hub): walk 860 · v21 610 · v23 144 · v25 137. Hub 21; readiness-check flow 101, logic 35, mustfirst 22, planned 49, v4 81, browser mustfirst 238, planned 86; register 143 + 64; AI Act guide 2,644; catalogue 328; assessment 12. Screenshots: `reports/readiness-2-screens/v25/` (results for all-Planned must-haves, one must-have No, None fits, Ready; the detail layer and its sources; desktop and phone at 2x) and `wording/`.

**Headlines of the council's nine patterns on gx-2 (rules v2.5):** A all must-haves Planned: Not ready yet · Score: 72% · Because only 0 of 10 must-haves are Yes. B all tailored Planned: Almost ready · Score: 77% · Held back: fewer than half the questions for this use case are Yes. C all Yes: Ready to start a pilot · Score: 100%. D Q5 No: Almost ready · Score: 100% · Held back: a No in step 2. E Q1 Not sure: Almost ready · Score: 100% · Held back: Not sure in step 2. F tailored all Don't know yet: Almost ready · Score: 55%. G None of these fits: Almost ready · Score: 100% · Held back: no use case chosen. H one must-have No: Not ready yet · Score: 94% · Because 1 must-have is No. I Q4 No: Ready to start a pilot · Score: 100%, with the assistant-only condition.

**Still open:** the five timed manager sessions; controller, deletion date and contact for shared copies (then O7 can be switched back); the wording pass on the 661 actions (O6 b); O8 (order of steps); D7 and lawyer sign-off of the provisional AI Act label; phone Back closing only the detail sheet.

## v2.4, owner change of 24 Nov 2026 (commit `7e0530e`)

The "What does this do?" button on each use-case row of step 4 was removed: "Details and sources" opens the same content in the detail layer. "Start a new check" moved from the very bottom of the result to the top row, beside Download (PDF). Screens refreshed in `eb2f956`.

## v2.3 / v2.4 (24 Nov 2026): four answers, a quieter result page, the detail layer. Rules v2.3. Committed (`a918c13`, `7e0530e`), not published.

Three owner decisions of 24 Nov 2026.

**1. Four answers (rules v2.3).** Steps 3 (must-haves) and 5 (tailored questions) offer only Yes / Planned, not done yet / No / Don't know yet, in that order. "Partly" and "Doesn't apply" are gone, also the DPIA question's "Checked: not required (confirmed in writing)" (it was that question's "Doesn't apply"). Points: Yes 2, Planned 1, No 0, Don't know yet 0 (B2 switch, still "to find out"). The "By when?" date for Planned stays. The five C-R-I-S-P questions keep Yes / No / Not sure: they are judgement questions where "Planned" makes no sense.
- Old records (localStorage, saved files, team copies) holding `p` or `na` open without error. The answer is kept in the record as it was (never turned into another answer) but counts as not answered: no option is checked, the line "Your earlier answer was Partly; this answer is no longer offered, please choose again." (or "…Doesn't apply…") stands under the question (`.oldans`, `#old-<id>`, `data-old`), the step is not done, and a check that stood on its result opens on that step. The score treats it like a blank. Results kept under earlier rules show as "worked out with earlier rules". The Team tab names it: "Not answered (earlier answer: Partly, no longer offered)", 0 / 2.
- Wording: "How this was worked out", the score note, the PDF ("Every question is answered Yes."), the Team tab's rules card and the README no longer mention Partly or Doesn't apply.

**2. Result page (owner).** The verdict box shows only the verdict, "Score: n%" (or "No score yet: …") and the must-haves line. The reason, the law line, the cap line, the must-haves-only and draft notes head "Start with …"; the points sentence with its honesty text and the verdict's line moved into "How this was worked out" (same ids); the footer carries the honesty line ("the answers are your own and nobody checks them"). The hotel line stays in the PDF and in "Your checks". The top row holds only Download (PDF). Copy summary and Print are removed (the PDF covers them). Save as file sits in "Your checks in this browser" next to Open a saved file; Add to the AI Register sits in the EU AI Act fold (hidden for "None of these fits" and for a document, as before); Start a new check is at the very bottom (the header link stays hidden on the result). PDF content unchanged.

**3. Detail layer (v2.4, owner): no leaving the tool for catalogue detail.** The links "Sources in the Use-Case Catalogue" and "See it in the Use-Case Catalogue" (`data-act="catalogue"`) are gone. "Details and sources" (each row of step 4), "More detail" (the explainer) and "More detail" (the result's "Where it sits") open a native `<dialog>` with `showModal()`: a drawer on the right on a desktop, a full-screen sheet on a phone; Close, Esc or a click on the backdrop close it, focus returns to the button that opened it, the page behind keeps its state and scroll, the open use id is `ui.detail` so it survives `render()`; never printed. It shows the plain and the catalogue name, department and area, what it does and how the AI works, the catalogue description and AI technique, how common in hotels, the catalogue's sources (name, note, link to the source in a new browser tab; "Hotel" label kept) and the draft note. `build.mjs` bundles each entry from the catalogue page's `<script id="data">` (`detailModel`: `ai` and `srcs` only; study sources resolved from the catalogue's source list as its page does). index.html: 1,077,990 bytes before the layer, 1,169,640 after (+90 KB).

**Tests.** New `tests/v23.test.mjs` (265; fixture `tests/fixtures/v2.2-old-answers.json`, written before the code) and `tests/browser/v23.cjs` (140; desktop and phone, standalone and hub). Changed expectations:
- logic: points `{ y: 2, pl: 1, n: 0 }`; edges and random sets use Planned where they used Partly; random sets now also carry old `p`/`na` and the independent arithmetic counts them as not answered; "two na" now counts them (total 18, 88%); the mixed fixture (Partly → Planned, Doesn't apply → Yes) reads 75%, 27 of 36, and "Start with" lists No, Don't know yet, Planned; method line without Partly.
- flow: Partly is refused on both steps, "Doesn't apply" on step 5 too (was: offered).
- pdf: the mixed fixture (Doesn't apply → No) reads 69%, 25 of 36 on 18 questions; no Partly or Doesn't apply in the PDF.
- v21: rules v2.3; item 1 at 69% / 25 of 36; item 3 below 50% with Planned; B2-off method line; the v2.0 records with old answers now open on step 3 or 5 (rm-1 picks again before its new snapshot; the v2.0 file opens on step 3).
- browser walk: four answers on steps 3 and 5 (were five and six); the DPIA question has no "not required" answer; the verdict box (no `#score-sub` beside the score, which moved to the fold; the "next to the score" distance check is gone); the top row is `pdf` only (was `pdf,copy,print,save-file,…,new-check`); the Copy summary check is removed; Add to the AI Register is clicked inside the opened EU AI Act fold; plans use Planned / No for Partly / Doesn't apply ("16 of 18 → 17 of 18").
- browser v21: the order check is verdict, score, must-haves, then the reason in "Start with"; points under "How this was worked out"; the v2.0 store/file checks now walk the old answers (line shown, four answers, Next refused, choosing again clears it); rules card without Partly in the v2 part; team detail names the old answers.
- v22 browser script (scratchpad): the catalogue-link check became the "More detail" layer check; the explainer-button selector excludes "Details and sources".
Screenshots: `reports/readiness-2-screens/four-answers/` (steps 3 and 5, the result "Almost ready", the layer; desktop and phone at 2x) and `v23-old-partly.png` from v21.cjs.

## v2.2 (24 Nov 2026): the team's plain wording and the use-case explainer. Not committed, not published.

- **Plain wording** (`data/wording.json`, team wording review of 24 Nov 2026): 99 plain use-case names, 661 tailored question texts (560 differ from the generated text), 21 fields of the five questions and the must-haves. Names and questions are applied by `data/build-questions.mjs` as its last step (`applyWording`), after the overrides; an unknown key or empty text stops the build. Core fields are written into `src/content.js`. Ids, areas, who, actions, scoring and `from` unchanged.
- The plain name is shown in the picker, the step 5 header, the cover's "You came here for", the result ("Where it sits", with "Catalogue name: …" in small text), the PDF, Copy summary, the copy-per-person and vendor texts, Your checks and the share copy (Team tab, also for older copies). Records still store the catalogue name, so saved checks open; "Add to the AI Register" sends the catalogue name.
- **Saved answers kept**: the question signature (`sig`, audit M5) is now taken by the generator before the wording and stored in `usecase-questions.json`; all 99 signatures equal the v2.1 ones, so no saved check loses its tailored answers. `tqSig` moved to the generator (re-exported by `build.mjs`).
- **Checker**: a team-worded question may have up to 35 words (rm-1.te1 has 31); generated text keeps the 30-word limit.
- **Explainer** on step 4: a "What does this do?" button per use case (real button, 44 px, `aria-expanded`/`aria-controls`, keyboard operable, never chooses the row) opens an inline panel: what it does, how the AI works, how common in hotels (catalogue rating), the catalogue name, the draft note, "See it in the Use-Case Catalogue". Open id kept in `ui.explain`. The result's "Where it sits" now shows "What it does" and "How the AI works" instead of the catalogue's task text. `data/explain.json` inlined as `ex`; kc-2's "14 EU allergens" now carries "(EU Regulation 1169/2011, Annex II)" next to the number.
- **Tests**: new `tests/v22.test.mjs` (809). Changed expectations: logic (five questions and the KPI must-have in the new wording; question length ≤ 15 words), questions (generator examples, add-on text and the word limit read from the pre-wording output), pdf (stop "because" line), v21 (item 10 and M5 signature against the pre-wording output), browser walk.cjs (five questions, plain names gx-2/hr-2, DPIA text) and v21.cjs (gx-2 hand-off question).

## v2.1 (24 Nov 2026): clean-up audit and council fixes. Not committed, not published.

Inputs: `reports/audit-readiness-2/cleanup_inventory_v2.md` (23 faults) and `reports/Council - Do you need AI v2.md` (BUILD NOW 1 to 10). Rules **v2.1 (24 Nov 2026)**. Storage key, store version, hub messages and the share document's shape are unchanged; records saved by v2.0 open (fixtures `tests/fixtures/v2.0-*.json`, captured from the v2.0 page before any change).

**Team judgement (three switches, one line in `src/logic.js`: `JUDGEMENT`), each also named under "How this was worked out":**
- `UNKNOWN_SCORES_ZERO` (council B2): "Don't know yet" counts as 0 points, so less knowledge never raises the score. It is still listed as "to find out".
- `LEGAL_HOLDS_TOP` (B5): no "Ready to start a pilot" for a use the AI Register labels high-risk (hr-2, hr-5, res-8) or that the team's sheet flags for sensitive personal data (fo-1, fo-3, fo-6, gx-6, hr-4, hr-6, it-4). The tool has no way to check the legal items, so for these ten uses the best verdict is "Almost ready" until the owner flips the switch (for example after D7 or a lawyer has signed). The result says why; no legal statement was added.
- `CARRIED_NO_HOLDS_TOP` (B6): a No on questions 2 to 5 of step 2 holds the top verdict back, with the reason shown.

**Council items.** 1 "Score: n%" with the points and question counts beside it, never "% ready"; cover bullet. 2 "No score yet: you answered 4 of 10 questions." under "Not enough information yet" (no percentage in the head, the list, the PDF, the history or a shared copy). 3 the reason under the verdict name, on screen, in the copy text, the PDF and on the Team tab. 4 new "Almost ready" line. 5 step 3 intro without "every". 6 "What is in place, by area": counts, a word only with two or more answers. 7 "This score does not cover the law…" on the ten flagged uses, under any verdict. 8 plain evidence line, ids on the Team tab only. 9 step 5 "Answer for today…". 10 three generator frames: "Is it agreed how you will tell …?", "Are there written … rules?" / "Is there a written … policy?" for one item whose head noun allows it (the colon frame stays for lists and for items such as "human review before sending prices"), ", and" instead of ", and also" unless a joined item has its own "and". 58 question texts changed, no id changed: rm-1.fi1, rm-1.or1, rm-4.da1, rm-5.fi1, rm-5.or1, rm-7.or1, rm-9.sk1, rm-9.or1, res-1.te1, res-1.or1, res-3.or1, res-5.or1, res-7.fi1, res-7.or1, sm-1.da1, sm-1.or1, sm-4.da1, sm-5.or2, sm-6.te1, fo-1.fi1, fo-1.or1, fo-3.fi1, fo-5.or1, fo-6.sk1, fo-6.te1, fo-6.or1, fo-7.sk1, fo-7.or1, fo-8.te1, gx-1.or1, gx-2.or1, gx-2.or2, gx-5.fi1, gx-5.or1, gx-5.or2, gx-6.te1, fb-4.or1, fb-6.or1, hk-1.or1, hk-2.or1, hk-4.or1, hk-6.da1, hk-7.te1, hk-7.da1, me-1.te1, me-1.or1, me-2.te1, me-4.or1, me-5.or1, pr-1.or1, pr-3.or1, fa-1.or1, fa-2.or2, fa-6.or1, hr-6.or1, gm-2.or1, gm-5.or1, gm-7.or1. Item 11: sharing stays on (owner); the Team tab's rules card now describes both kinds of copy.

**Audit faults.** H1 a shared copy can be withdrawn on every step, on the stop screen, from "Your checks" and with "Withdraw the shared copy and remove". H2 see items 1 to 3. M1 snapshots carry use case and rules; "Since last time" compares one use case under one rules version; a v2.0 result is listed as "worked out with earlier rules". M2 the outcome of a share is written to its own check, open or not. M3 the open check is kept per tab (`sessionStorage['hftp-readiness2-cur']`); another tab's change to the same check is said, with "Load the other tab's version". M4/L10 Back passes over entries of another check and, going back, entries that would only show a substitute screen. M5 a check carries the signature of its tailored questions; changed questions reopen step 5 with a notice; a use case that left the catalogue is said, also from a file. M6 "None of these fits" line. M7 Team tab: rules card for both kinds; a copy with an unknown use case is listed. M8 see item 8. L1 one file per double-click. L2 an emptied hotel field stays empty (also taken out of the shared profile). L3/L9 `from: 'link'`: "You came here for" only then; a link-only check is not listed. L4 50-check cap: the open check and the newest are kept on load; a 51st is refused with a message. L5 no "by when" in the past; old ones read "was planned by …, overdue". L6 no "kept here" wording while storage is blocked. L7 PDF titles. L8 old Readiness-check files get their own message and link; the old page says it was replaced. L11 files carry no share fields. L12 unreadable saved data is set aside under `hftp-readiness2-v1-corrupt` and said once. L13 "six to nine" from the data; the note says why 90 is not 99. Print: the result's folds open for printing.

**Changed test expectations** (each because the old one encoded what was fixed): score strings and the independent arithmetic (B2, items 1, 2); hr-2 all-Yes is "almost" (B5); area lines (item 6); evidence line (item 8); PDF title and headings (L7, item 6); three question frames (item 10); a link-only check is not listed (L9); "Questions you answered" in the history line; phone height of the score block (longer caveat).

**Not done:** B1, B3, B4, B7, B8, B9 and item 12 (manager sessions). On the stop screen a shared copy can be withdrawn but not replaced by a "stopped" copy. About 25 single organisation items keep the colon frame (B8, workbook wording).

Tests: logic 7,473 · flow 5,987 · questions 917 · pdf 482 · build 120 · v21 1,204; browser walk 832, `tests/browser/v21.cjs` 592.

## Design pass (24 Nov 2026): look and feel only

Spec: `reports/audit-readiness-2/design_pass_plan.md` (items 1–14 done, 15 checked). Skills used (`.claude/skills/`): Impeccable (`SKILL.md`, `reference/craft-floor.md`, `typeset.md`, `layout.md`, `polish.md`, `adapt.md`, `animate.md`), taste-skill (`references/system.md`, `motion.md`), Emil Kowalski's `emil-design-eng`, `review-animations/STANDARDS.md` and `mobile-native`. No wording, question, flow, scoring, data, token, font or hook change; print and PDF unchanged.

| Item | What changed |
|---|---|
| 1 | Side stripes gone: verdicts and the Yes / No / Not sure boxes have a full 1px border; "by when" and "Not sure?" lines lose their bar; print keeps its 4px left rule |
| 2 | Step titles 1.75rem (1.5rem on phones); C-R-I-S-P 1.25rem in ink, so the title leads |
| 3 | Small labels (step kicker, must-have names, Yes/No heads) in sentence case, no tracking |
| 4 | Focus ring on answers only for keyboard (`:has(input:focus-visible)`); a skipped question is outlined in red, not in the focus blue |
| 5 | Phones: answer scales with four or more options sit in a steady two-column grid; gap 8px |
| 6 | Hover only on mouse devices; hover on answers and use-case rows; press scales to 0.97 (off under reduced motion); no tap flash |
| 7 | Text in panels capped at 70 characters a line |
| 8 | More space between questions; reference folds on the result are a ruled list, not cards |
| 9 | Result: the verdict comes first, the actions below it; one primary (PDF), the rest quiet text buttons (same ids and `data-act`) |
| 10 | Chevrons, Back mark and the answer tick drawn in CSS (no glyphs); selection, caret, form controls and underline offset in the palette |
| 11, 12, 14 | Small text floor 14px (13px for chips and tags); use-case rows padded inside their tint; progress segments ≥3:1 against the page in both themes |
| 13 | Motion in four places: step arrival (180ms), fold opening (150ms, only when the person opens it), result bars grow once (400ms), toast entry; reduced motion: opacity only |
| 15 | IBM Plex Sans and Condensed load in the standalone page and inside the hub (checked locally; the browser tests block font requests, so their screenshots use the fallback) |

Screens before and after: `reports/readiness-2-screens/design-pass/` (before in `before/`).

## v2.0 (24 Nov 2026): new flow, tailored questions, percentage plus verdict; replaces the Readiness check tab

Owner's decision of 24 Nov 2026. Full notes: `research_notes/Do you need AI v2/build_notes.md`.

| Item | Status |
|---|---|
| Cover updated to the five steps and "a readiness score and verdict" | Done |
| 1 About your hotel (Readiness check's fields, one row, shared profile read and written) | Done |
| 2 Five questions, simpler wording (Q2 kept); "Why this matters" unchanged; Q1 No stops | Done |
| 3 Must-haves: ten, Readiness-check scale, evidence with the workbook share and sourced figures; all need an answer; cap the verdict | Done |
| 4 Where in the hotel: unchanged; all 99 selectable; `#use=<id>` preselects | Done |
| 5 Tailored questions generated from the owner's workbook (661 questions, 6 to 9 per use case), add-ons, draft marking, checker, overrides | Done |
| Result: % with base and caveat, four verdicts, per-area bars, first three, action plan by person with copy buttons, vendor questions, provisional AI Act label, PDF, copy, print, Add to the AI Register, Start a new check, Your checks, file save/open, since last time | Done |
| Hub: Readiness check tab removed; `readiness-check` is an alias of `readiness-2` (old links with `#use=` land here) | Done |
| Team sharing (opt-in, `kind: 'dyn'`); the Team tab lists and recomputes old checks and new copies | Done |
| Storage v2 (several checks) under the same key; v1 records migrate (five answers, use case) with a one-time notice | Done |

### Removed from v1

The old step 2 "What you need" (10 items) and step 3 "What makes it succeed" (9 factors), the count lines, the overall line and the hand-over to the Readiness check. Their content lives on in the ten must-haves and their evidence. "Start again" with a confirm is replaced by "Start a new check" (the old check is kept in the list; removing one asks first).

### Changed test expectations (each because the owner changed the tool)

- `tests/logic.test.mjs`: rewritten. Kept: the 243 five-question combinations against the same oracle. Changed: the wording of Q1, Q3, Q4, Q5 (simpler, owner); the all-Yes headline reads "Next: the must-haves."; the v1 counts / ranking / overall-line tests are gone with those features; new: score, verdict, cap, edges.
- `tests/flow.test.mjs`: rewritten for the new FLOW table (states `hotel`, `must`, `tailored`, `result` replace `needs`, `success`, `summary`); the v1 round-trip test became the v1 → v2 migration test; restart-with-confirm tests replaced by store tests.
- `tests/pdf.test.mjs`: rewritten: title "Do you need AI? Readiness score and verdict"; sections follow the result page.
- `tests/catalogue.test.mjs` → `tests/build.test.mjs` (same catalogue checks; the "every use case except lg-4 opens in the readiness check" check is gone with the hand-over). `tests/v12.test.mjs` and `tests/v13.test.mjs` removed: they tested v1 screens (rename, BUILD NOW items, systems examples on b1/b2); what still applies (history machine, dates, newer version, use-case identity, systems examples by department) is covered in the new suites.
- `tests/browser/walk.cjs` replaces `walk.cjs`, `pdf.cjs`, `v12.cjs`.
- `tools/hub/tests/hub.test.mjs`: `readiness-check` is no longer a hub tool or a button; the Readiness check tooltip test is removed; new tests for the alias and the open routing; the Do you need AI? tooltip has new words.


## v1.3 (23 Nov 2026): systems named by department, "Why this matters" on step 1a

Owner requests. Answers storage (`hftp-readiness2-v1`, version 1), verdict logic, counts, ranking and the overall line are unchanged; records saved by v1.1 (`tests/fixtures/v1.1-saved.json`) still open.

**Systems questions (b1 "Systems that can talk to each other", b2 "Older systems") no longer talk only about the PMS.**
- b1 asks: "Has it been confirmed in writing that the tool can read from and write back to the systems you want to connect it to?" and b2: "Do you know which systems the tool must connect to and, if one of them is old and hard to connect, is there a plan?". Each is followed on its own line by "For example: <systems>." (`#ex-b1`, `#ex-b2`).
- The examples fit the department chosen in step 1b: new `SYSTEMS` map in `content.js`, keyed by the catalogue's 15 department ids (the test checks the keys against the inlined catalogue). No department, or "None of these fits": "your PMS (booking system), POS (tills), accounting or HR systems". Marked in code and in step 2's "Where this comes from" (screen and PDF) as "typical systems by department: the team's own list, based on the catalogue's use cases, not a survey".
- b1 and b2 plain text and "What good looks like" now say "your hotel systems" / "which systems the tool must connect to". The PMS gloss shows only when "PMS" is among the examples shown (it now sits under the examples line, its first use).
- The b1/b2 actions on the summary ("Start with these three" and item by item), in Copy summary and in the PDF read "Ask the vendor to confirm in writing that the tool reads from and writes back to the systems you want to connect it to (for example …), and see it work on your own systems." and "Find out which systems the tool must connect to (for example …) and whether …". "Don't know yet" adds the examples line after the question. The PDF item block prints the examples line under the question.
- New pure functions `R2Logic.systemsFor(rec)` and `R2Logic.itemText(id, rec)`; `action()`/`actions()` take the record as an optional last argument (no record → fallback examples).
- Left as is, on purpose: the quoted readiness-check question under "The readiness check also asks" in b2's fold ("Which describes your main hotel system (PMS)? …") is the readiness check's own T2 wording, which this change does not touch; catalogue use-case texts that mention the PMS are the catalogue's.

**Step 1a: "Why this matters".** The fold under each of the five questions is now labelled "Why this matters" (was "Why we ask, and an example"; same `<details>` fold: arrow, keyboard, 44 px target). Its first line is a new one-sentence reason (`whyShort` in `content.js`, at most 25 words; the field `short` already held the "to find out" label, so it was not reused), then the longer `why`, then the Yes/No examples.

**Tests.** New `tests/v13.test.mjs` (137 checks): the table by hand per department and the fallback (also for "None of these fits" under a department, unknown ids), b1/b2 wording, the gloss only where PMS is shown, actions by hand, the PDF blocks, no PMS-only sentence in content, actions or the PDF (one documented exception: the T2 quote), and the "Why this matters" lines. `walk.cjs` checks the new fold label. Changed expectations (wording changed by the owner): `pdf.test.mjs` (b2 "find out" action now carries the Front Office examples; the random check passes the record) and `v12.test.mjs` (b1's action text holds the examples slot).

## v1.2 (23 Nov 2026): new name, the council's BUILD NOW items, eight clean-up fixes

Sources: owner decisions B1–B5 on `reports/Council - Readiness 2.0.md` (owner decisions win over the council) and the fix list in `reports/audit-readiness-2/cleanup_inventory.md` (each bug was re-checked against the v1.1 code first: all eight still applied). Tests were written first (`tests/v12.test.mjs`, `tests/browser/v12.cjs`). Before any change, four records saved by v1.1 were captured from the real page into `tests/fixtures/v1.1-saved.json`; they all open unchanged.

| # | Item | Status |
|---|---|---|
| B1 | Visible name "AI starting point" everywhere: hub tab, `<title>`, header, copy text, print line, PDF title, footer and file name (`AI-starting-point_…`), README, `CONTRACTS.md`, `tools/README.md`, `docs/PROJECT_CONTEXT.md`. Subtitle "Start here: is AI the answer, and where?" kept | Done. Folder, tool id `readiness-2`, storage key `hftp-readiness2-v1` and hub messages unchanged |
| B2 | Stop headline "This is not suitable for AI.", then the why, then the instead line; PDF stop page the same; "not an AI problem" removed from every visible string (also the Q1 outcome and the Q1 "Not sure" line) | Done |
| B3 | Steps 2 and 3 unchanged (all 19 items) | Kept as decided; council items that depend on the split skipped (merging B3/C8 and B9/C1, the "later" list, the pre-vendor rewording) |
| B5 | Tab stays before "Readiness check" | Kept |
| BN1 | Q1 hint, the council's wording | Done |
| BN2 | Stop line: "If a vendor offers you an AI tool for this job, … change your answer to Not sure: it becomes something to find out." | Done (screen and PDF) |
| BN3 | "None of these fits": **Open the readiness check** (hub `open` with no hash; plain link outside the hub) and the council's summary line, instead of a disabled button | Done. `lg-4` (a document) still has no check, with its reason |
| BN4 | Question codes (T1, D5a, "new (from T2)", "new question") hidden from screen, copy text and PDF; kept in `content.js` and the tests | Done. The step 2 sources note no longer mentions codes |
| BN5 | Visible evidence-strength note on workflow (C2), culture (C4), change management (C9), the research's "weak or partial" list; Prosci labelled a change-management consultancy | Done. No search-only figures (McKinsey, BCG) added |
| BN6 | "Your answers here are not carried over to the Readiness check yet." by the hand-over (screen, copy text, PDF) | Done |
| BN7 | One-line glosses at first use: PMS (B1), data processing agreement and DPIA (B5), staff representatives / works council (C9) | Done |
| BN8 | Screenshots retaken (`reports/readiness-2-screens/`, old file names kept, new ones added) | Done |
| BN9 | Hub tooltip on "Readiness check": "Check one AI tool in detail before you sign" | Done (`tools/hub/hub-bar.html`, hub test added) |
| M1 | HISTORY machine: in-app Back and browser Back agree; Next/Back cycles do not grow history; a hash change keeps the step; Start again replaces | Done (`histAction`, `histEntry`, `histRead` in `flow.js`) |
| M2 | Use-case identity: the record keeps the name; a mismatch clears the use case, reopens 1b and says "The catalogue changed: please pick your use case again." | Done (version stays 1; old records take the name on load) |
| M3 | Blocked storage: a visible line on every screen; the "answers stay in this browser" promises hidden; `#app[data-storage]` | Done |
| L1 | Real calendar dates only (2000–2100) in `reduce`, `migrate` and `fmtDate` | Done |
| L2 | A record from a newer version is shown with a notice and never written over | Done (byte-identical after an answer, browser-tested) |
| L3 | Progress bar marks the current step "now" on 1a, 1b, 2 and 3 | Done (`R2Flow.progress`) |
| L4 | Hub messages only after the hub's `pong`; plain links otherwise; no ping when the parent is on another origin; the catalogue link falls back to `window.open` | Done (a page framed from another origin now navigates on click) |
| L5 | Cross-tab follow also corrects the history entry; a page restored from the back-forward cache re-reads the record | Done |

### Found in the PDF / download work (not in the inventory)

- Dates on the summary, the copy text, the PDF and its file name used the UTC day, so between midnight and 01:00/02:00 in Europe they showed yesterday. They now use the local day (`R2Logic.localIso`).
- In a frame on another origin the page pinged its parent, which logs a console error and waits 12 s before a download can use the plain link. It now skips the ping when `location.ancestorOrigins` shows another origin.
- The BRIDGE and DOWNLOAD tables were checked against the readiness check's: same table, a second click is still refused, and leaving the summary during a download is harmless (the PDF is built from the record at the click). No change needed.

### Changed test expectations (each because the owner changed the wording or a bug was fixed)

- `logic.test.mjs`: stop heading and Q1 outcome wording (B2).
- `flow.test.mjs`: round-trip records now carry `useName` (M2).
- `catalogue.test.mjs`: page title "AI starting point" (B1).
- `pdf.test.mjs`: title, footers, file names (B1); the stop heading (B2); "None of these fits" next step now "Open the readiness check." (BN3).
- `browser/walk.cjs`: stop heading (B2), copied text prefix (B1), "None of these fits" button enabled (BN3), "in the hub" waits for the hub's pong (L4).
- `browser/pdf.cjs`: file-name prefix (B1).
- `hub/tests/hub.test.mjs`: the tab label "AI starting point" (B1); one test added for the Readiness check tooltip.


## v1.1 (23 Nov 2026): download the assessment as a PDF

Owner's request: "add the option to download the assessment as a PDF at the end".

| # | Item | Status |
|---|---|---|
| 1 | Summary: **Download the assessment (PDF)** next to the other actions; "Check one tool in detail" stays primary | Done |
| 2 | Stop screen: secondary **Download (PDF)**, a one-page "This is not an AI problem." PDF (why, instead, the five answers) | Done. Nothing on the stop screen moves past it (browser walk updated: three buttons now) |
| 3 | PDF content: title, hotel (shared profile, read-only), date, prototype line; sections 1–4, the three to start with, next step, sources per step; footer with page n of N; no score | Done (`src/pdf.js`), in the summary's own words through shared `R2Logic` helpers |
| 4 | Built the readiness check's / register's way: jsPDF and the "Register Sans" OFL subset inlined by `build.mjs`; hub bridge `ping` / `download` with a plain-link fallback; one download in flight | Done. No hub contract shape changed; `CONTRACTS.md` lists Readiness 2.0 as a `ping`/`download` caller |
| 5 | File name `Readiness-2.0_<hotel or assessment>_<YYYY-MM-DD>.pdf`, safe ASCII | Done |
| 6 | Tests: `tests/pdf.test.mjs` (1,110 checks); `tests/browser/pdf.cjs` (138 checks: standalone, hub with link fallback, hub with the save capability; 1280 and 390 px) | Done |

### Fixed on the way

- With exactly one weak point the summary headed it "Start with these one". It now reads "Start with this one".

## v1 (23 Nov 2026): first build

Built to the owner's spec, with all content from `research_notes/AI starting point/research.md`.

| # | Item | Status |
|---|---|---|
| 1 | Step 1a "Is this an AI problem?": the five questions in the research's exact wording, Yes / No / Not sure, a closed "Why we ask, and an example" for each, and a live verdict | Done |
| 2 | Q1 No stops on a result screen: "This is not an AI problem.", why, what to do instead, and only "Change my answers" and "Start again"; nothing can move past it | Done. Proved by an exhaustive state walk (`tests/flow.test.mjs`) and in the browser (Next, `send()`, history) |
| 3 | Q2/Q3/Q5 No do not stop: each condition is carried to the summary; Q4 No adds "AI as an assistant only"; Not sure is carried as "to find out" and ranks below any No | Done. All 243 combinations tested against an oracle written from the research |
| 4 | Step 1b "Where in the hotel?": category → department → use cases (name, what AI does, how common, link to the catalogue's sources), or "None of these fits" | Done. Data is inlined by `build.mjs` from the catalogue's `<script id="data">`; counts are computed |
| 5 | Step 2: ten prerequisites (plain explanation, what good looks like, self-check), the readiness check's answer scale, optional "By when?" for Planned | Done. B1, B3, B5, B8, B9 come first and are tagged as readiness must-haves |
| 6 | Step 3: nine success factors (definition, what good looks like, warning signs, self-check) | Done |
| 7 | Summary: verdict and conditions, where it sits, counts per step, the three weakest, actions item by item; no score | Done |
| 8 | "Check one tool in detail" → readiness check `#use=<id>` (hub `open` message, plain link outside the hub); disabled with the reason when nothing fits | Done. Also disabled for `lg-4` (a document, not a tool) |
| 9 | Copy summary (clipboard, with a copy-box fallback), Print (print stylesheet), Start again (with confirmation) | Done |
| 10 | "Where this comes from" per step (opened sources only, with dates); footer: student prototype, not legal advice, content as of 23 Nov 2026 | Done |
| 11 | Storage `hftp-readiness2-v1` (versioned, migration stub), reload to the same step, Back/forward, hotel name read from `hftp-hotel-profile-v1` (never written) | Done |
| 12 | Hub tab before "Readiness check", with tooltip; `readiness-2` and `use-case-catalogue` added to the openable tools; `CONTRACTS.md` and hub tests extended | Done. No existing contract changed; 5 hub tests added |

### Fixed during the browser review

- The summary repeated "Next: find where it sits in your hotel" under an all-Yes verdict. It now reads "Worth exploring with AI."
- A Planned item with a date ended in a doubled full stop.
- On phones, "Start again" wrapped onto its own line under the header.
- The stop screen showed "Start again" twice (header and card). The header link is now hidden there, so the stop screen has exactly two buttons.
