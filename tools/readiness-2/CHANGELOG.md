# Do you need AI? (formerly "AI starting point", "Readiness 2.0"): changelog

## v2.3 / v2.4 (24 Nov 2026): four answers, a quieter result page, the detail layer. Rules v2.3. Not committed, not published.

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
