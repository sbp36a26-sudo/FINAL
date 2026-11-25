# Do you need AI? (questions-only, v2.7.0, standalone)

**This folder (`tools/readiness-2-questions/`) is the standalone "Do you need AI?" artifact with use-case-specific questions and no legal
content.** It started as a copy of `tools/readiness-2/` (see `NOTES.md` and `CHANGELOG.md`); everything below the line is the base
tool's README and is kept for history: where it mentions the hub, sharing, the Team tab, the AI Register, the AI Act label or the
generator, that no longer applies here.

Build and test (from the repo root; browser tests from `tools/` with `python3 -m http.server 8891 --bind 127.0.0.1` running):

```
node tools/readiness-2-questions/build.mjs
node tools/readiness-2-questions/data/check-questions.mjs
for t in tools/readiness-2-questions/tests/*.test.mjs; do node $t; done
node readiness-2-questions/tests/browser/questions.cjs     # from tools/; screenshots to reports/readiness-2-questions-screens/
```

---

# Do you need AI? (v2.6.1, rules v2.6, prototype)

Hub tab **Do you need AI?** (tooltip "Is AI the answer, and is your hotel ready for it?"). Since 24 Nov 2026 it **replaces the Readiness check tab** in the hub: one tool that asks whether the job needs AI at all, checks the must-haves, asks tailored questions for the chosen use case and ends with a **verdict and a score in %** (v2.1: worded "Score: n%", never "% ready") (owner's decision of 24 Nov 2026, overriding the earlier "no score" rule for this tool). The folder `tools/readiness-2/`, the tool id `readiness-2` and the storage key `hftp-readiness2-v1` are unchanged. `tools/readiness-check/` stays in the repo and stays published as a file, so old bookmarks open.

For hotel managers who know nothing about AI. Not yet tested with real managers. What was built, what was not, and the open decisions: `research_notes/Do you need AI v2/build_notes.md`.

## The journey

| Screen | State | What happens |
|---|---|---|
| Cover | `start` | Why this tool / How to use it (the five steps) / What you get ("a verdict and a score"), the honesty line, **Start**, and **Your checks in this browser** with **Open a saved file**. |
| 1 About your hotel | `hotel` | The Readiness check's fields in one row: how the hotel is run (required), hotel name, your role, country. Reads and writes the shared profile `hftp-hotel-profile-v1` as the Readiness check did. |
| 2 Is this an AI problem? | `q` | C-R-I-S-P: five questions (v2.6: Complex judgement, Return, Information to learn from, Some mistakes are acceptable, Proof), Yes / No / Not sure, each with the "Why this matters" fold (one-line reason, "Answer Yes if" and "Answer No if" side by side with examples, "Not sure?" on Q1). |
| Stop | `stop` | Q1 = Yes (v2.6: "Can each case be fixed with an “if this, then that” rule?"; was No before v2.6) → "This is not suitable for AI." with why, what to do instead, **Change my answers**, **Start again**, **Download (PDF)** (the one-page stop PDF, no sources). No event, history entry or saved record gets past it. |
| 3 Must-haves | `must` | Ten things to have in place before an AI project starts. Scale (v2.3, owner): Yes / Planned, not done yet / No / Don't know yet, "By when?" for Planned. A saved "Partly" from before v2.3 shows as unanswered with the line "Your earlier answer was Partly; this answer is no longer offered, please choose again." Every one needs an answer. Collapsed "Why this matters": the reason, what counts as Yes, the share from the team's resource analysis ("needed for 90 of 90 use cases …, team judgement, not a survey") and sourced figures with base and date (Eurostat shares rounded on screen, exact shares in "Where this comes from"; v2.5). v2.5: a line under must-have 3 when step 2 says otherwise (Q5 No or Not sure beside a Yes here); it does not block (the must-have 7 line went with the old question 3 in v2.6). |
| 4 Where in the hotel? | `where` | Area › department › use case from the Use-Case Catalogue (99, all selectable), or **None of these fits my problem**. `#use=<id>` preselects a use case. Each row shows the team's plain name (v2.2), how common it is in hotels, and one button, **Details and sources**, that opens the detail layer (below) without choosing the row. The v2.2 "What does this do?" button was removed on 24 Nov 2026 (owner, commit `7e0530e`). |
| 5 Questions for this use case | `tailored` | 6 to 9 questions generated from the owner's workbook row for that use case, plus the add-on questions it flags. The same four answers (no "Doesn't apply" since v2.3; a saved one shows as unanswered with its line). Skipped for "None of these fits". The 8 use cases without a workbook row are marked "Draft questions: team to review". |
| Result | `result` | The verdict box holds the verdict, "Score: n%" (or "No score yet: …") and the must-haves line (owner, 24 Nov 2026); v2.5 (owner O5) adds one short line only for "Not ready yet" and a held verdict ("Because 1 must-have is No.", "Held back: legal items to check."). Under the top verdict, the pilot gloss. Then **Download result (PDF)** (primary, `#pdf`), **Download answers (PDF)** (`#pdf-answers`) and **Start a new check** side by side (owner, 25 Nov 2026; v2.7). The Result PDF holds Result, Start with these three, Action plan by person, Questions for the vendor and the EU AI Act (label, note, items); the Answers PDF a short summary and every question with the answer given (steps 2, 3 and 5). Neither PDF has sources; on screen "Where this comes from" stays. One download at a time (both buttons disabled while one runs), "Start with …" headed by the reason ("Because …"), the law, cap, must-haves-only and draft notes, and a hold as item 1 ("Settle this first: …", never "Nothing open" under a held verdict), the AI-problem verdict, where it sits (with **More detail**), what is in place by area, the action plan by person ("Copy for IT", "Copy for General manager" …; a tailored item reads as its question: "Make this a Yes: …", "Finish: …", "Find out: …"), vendor questions, the EU AI Act fold (with **Add to the AI Register**), every answer, "How this was worked out", the sharing panel only for a check that already has a copy (sharing is off, O7), **Your checks in this browser** (with **Save as file**), sources. Copy summary and Print were removed (v2.3). |

## Rules

**Five questions** (v2.6, owner 24 Nov 2026): Q1 "Can each case be fixed with an “if this, then that” rule?" — **Yes stops** (fixed rules can do it), No goes on. Otherwise Q2 No → "Probably not worth it."; Q3 No ("Are there many past examples of this task …?") → "Too few examples to learn from."; Q4 No ("Is it acceptable if the result is right most of the time, but not every time?") → "A rule-based tool or a person is the better choice."; Q5 No → "Define success first."; any Not sure → "Find out first."; otherwise "Worth exploring with AI." A No on Q2 to Q5 is carried to the result and holds the top verdict. Q3 and Q4 follow Brynjolfsson & Mitchell (2017), *Science* 358(6370). The v2.5 "assistant only" condition on Q4 is gone (checking results is must-have 6).

**Score and verdict** (`src/logic.js`; cut-offs in `T`, team-judgement switches in `JUDGEMENT`; rules v2.6):
- Points: Yes 2 · Planned 1 · No 0 · Don't know yet 0 (`UNKNOWN_SCORES_ZERO`, team judgement; still listed as "to find out"). An answer saved before v2.3 that is no longer offered counts as not answered until the person picks again.
- Score = points ÷ points possible over must-haves + tailored questions, rounded down, shown as "Score: 73%" with "25 of 34 points on 17 questions: 15 answered, 2 “Don’t know yet” (0 points each). Your own answers; nobody checked them. The cut-offs are the team's judgement, not tested with hotels."
- Verdict, in this order: **Not enough information yet** (more than half unknown; no score shown) → **Not ready yet** (any must-have at No, below 50%, or fewer than half the must-haves at Yes) → **Ready to start a pilot** (every must-have Yes, 75% or more, fewer than a quarter unknown, and at least half the answered tailored questions at Yes) → **Almost ready** (everything else).
- The top verdict is held back, with the reason shown, for a use the AI Register labels high-risk or the team's sheet flags for sensitive data (`LEGAL_HOLDS_TOP`), when a No is carried from question 2, 3, 4 or 5 (`CARRIED_NO_HOLDS_TOP`; v2.6 adds question 4), when any step 2 question is "Not sure" (`NOT_SURE_HOLDS_TOP`), when fewer than half the answered tailored questions are Yes (`READY_MIN_TAIL_YES`), and with "None of these fits" (`NONE_BEST_ALMOST`). The v2.5 switch `Q4_NO_HOLDS_TOP` and its assistant-only line are gone (v2.6). "Almost ready" needs at least half the must-haves at Yes (`ALMOST_MIN_MUST_YES`). All are team judgement (owner decisions O1 to O4 of 24 Nov 2026, `reports/Council - Do you need AI v2.4.md`), named in "How this was worked out"; set a switch to `false` (or a share to 0) to turn it off.
- A must-have that is not Yes caps the result. Areas: "n of m in place", with Strong / Gaps to close / Weak only where an area has two or more answers.
- Results kept under earlier rules (v2 to v2.3) stay in the history, marked "worked out with earlier rules", and are not compared line by line; nor are two results of one use case asked with other questions (v2.5).

## The tailored questions (`data/`)

| File | What |
|---|---|
| `data/extract-excel.py` | Reads the owner's workbook (`research_notes/Do you need AI v2/…xlsx`) into `excel-rows.json`: 91 use-case rows, the 20 framework blocks with counts, archetypes, intensity definitions. Run with `python3 -I`. |
| `data/build-questions.mjs` | Deterministic generator → `usecase-questions.json`. One question per resource cell with content; a cell is split in two only when its question would exceed 30 words, when its items need different kinds of question, or to reach six. Add-on questions from the archetype sheet. Draft rows (from `tools/readiness/index.html`) for the 8 use cases the workbook lacks. |
| `data/check-questions.mjs` | Checker: 6 to 10 per use case, at most 30 words, question mark, no semicolon, no duplicate, no article number or "see D7", every workbook cell asked, file equals the generator's output. |
| `data/overrides.json` | The only place for hand edits (16, each with a reason). |
| `data/wording.json` | v2.2: the team's plain wording (24 Nov 2026), applied by the generator **last**, after the overrides: `names` (99 plain use-case names, stored as `plain`), `qs` (661 question texts, `<use>|<qid>`; a changed text is marked `worded`), `core` (21 fields of the five questions and the must-haves, written into `src/content.js`). A key that matches nothing stops the build. Ids, areas, who, actions and `from` are unchanged. The signature `sig` is taken before the wording, so a wording-only change keeps saved answers. Team-worded questions may run to 35 words (one does: rm-1.te1, 31). |
| `data/explain.json` | v2.2: per use case `does` and `how` for the explainer; inlined by `build.mjs` as `ex` (must cover exactly the 99). |

After the catalogue or the workbook changes: `python3 -I tools/readiness-2/data/extract-excel.py` (workbook only), `node tools/readiness-2/data/build-questions.mjs`, `node tools/readiness-2/data/check-questions.mjs`, `node tools/readiness-2/build.mjs`, `node tools/readiness-check/build.mjs` (the team page carries the questions too).

## The detail layer (v2.4, v2.5, v2.6)

"Details and sources" (each use case on step 4) and "More detail" (the result's "Where it sits") open one native `<dialog id="detail">` with `showModal()` over the page: a drawer on the right on a desktop, a full-screen sheet on a phone. Close, Esc or a click outside the drawer close it; focus returns to the button that opened it; the step, state and scroll behind it stay; `ui.layer = { use, from, step, check }` keeps it open across `render()`, and any step or check change (browser Back, a `#use=` link) closes it (v2.5); `#app[data-layer]` names the open use; it is not printed. Content (v2.5, council BUILD NOW 8): plain and catalogue name, department and area, what it does / how the AI works (`data/explain.json`), how common in hotels, "The catalogue’s own description (research wording)" under "For the detail-minded", the catalogue's sources (links open the source in a new browser tab) and the draft note. The catalogue's "AI technique" research notes are no longer shown or bundled; they stay in the catalogue tab. `build.mjs` (`detailModel`) bundles `srcs` from the catalogue page's `<script id="data">`; no link to the catalogue tab is left in this tool.

**v2.6 (owner, 24 Nov 2026):** each source's **name is the hyperlink** (`<a href target="_blank" rel="noopener">`), with the address and "Copy address" under it; no "Open the source" text and no click interception. The owner found that in the claude.ai viewer a link inside a tool frame never opens, while one on the hub's main page does. So **inside the hub** (once the hub answered the ping) "Details and sources" / "More detail" send the layer's content as plain JSON (`R2Logic.detailData`, the same object the page's own dialog is drawn from) as `{ hub: 'detail', id, data }`, and the hub draws the layer on its main page over exactly the frame's area, in this tool's look; `ui.layer.hub` is true and `#app[data-layer-host="hub"]` is set; the hub's `{ hub: 'detail-closed', id, focus }` closes it here and puts focus back on the opener; any other way the layer drops here (a step or check change: browser or phone Back, a `#use=` link, another tab removing the check) sends `{ hub: 'detail-close' }` (v2.6.1, inventory v4 B1: before, only a mismatch found at render time sent it, so the hub's layer stayed up); the hub also takes its layer down when the frame loads a new page (B2). **Standalone** the page draws its own dialog. Contract: `tools/hub/CONTRACTS.md`.

## Storage, files, sharing

- `localStorage['hftp-readiness2-v1']` = `{ v: 3, cur, checks: { <id>: check }, notice }` (v2.6: version 3, so an older page opened later treats it as newer and does not write over it; files are `v: 3` too. A v2.5 page that was already open in another tab does not look again and can still write a version 2 store back: since v2.6.1 this page then keeps its own version of every check it holds and takes only the checks it does not know, read in the old meaning; inventory v4 B4). Each check carries `qv: 2` (the step 2 question set of v2.6). **Migration (v2.6):** a check without `qv` (browser store, saved file, v1 record) holds step 2 in the old meaning and is read once through `R2Logic.legacyQ`: question 1 Yes ↔ No (Not sure stays), the old questions 3 and 4 dropped and listed in `Qnew` (step 2 says so and asks them again); team copies without `qv` are read the same way on the Team tab. Fixture: `tests/fixtures/v2.5-saved.json` (written by the v2.5.1 code). Several checks per browser. A **v1 record** (builds before 24 Nov 2026) is converted on load: the five answers and the chosen use case are kept, the old step 2 and 3 answers are dropped, and a one-time notice says so (fixtures `tests/fixtures/v1.3-saved.json`, captured from the v1.3 page before any change, and `v1.1-saved.json`).
- A newer version is shown and never written over, also when another tab saves it while this page is open (v2.6.1, inventory v4 B3). Blocked storage is said on every screen.
- **Save as file / Open a saved file**: `{ kind: 'hftp-do-you-need-ai', v: 3, rules, savedAt, check }` (v2.6: version 3, as the store; files of version 2 and earlier open and are turned round once, a file of a later version is refused).
- **Return visit**: a dated snapshot (with its use case and rules) is kept whenever the result differs from the last; "Since last time" compares the last two of the same use case and rules.
- **Tabs**: which check is open is kept per tab in `sessionStorage['hftp-readiness2-cur']`; unreadable saved data is set aside under `hftp-readiness2-v1-corrupt`.
- **Sharing (opt-in; off since v2.5, owner O7: `SHARING_DEFAULT = false` in `src/app.js`, until the controller, a deletion date and a contact are named; set it to `true` and rebuild to switch it back on)**: a copy goes to `readiness/<viewer id>/checks/<check id>` through the hub's db bridge (the Readiness check's `store.js`, same message shapes), with `kind: 'dyn'`, `v: 2`. The red **Team: readiness results** tab lists and recomputes both old checks and these copies. Outside claude.ai it is a test copy in this browser. A copy can be withdrawn from any step, the stop screen and "Your checks" (v2.1), also with sharing off and after the check was replaced by a saved file (v2.5).
- Hub messages, the shared profile key and other tools' keys are unchanged.
- **Names (v2.2)**: a record keeps the use id and the **catalogue** name (`useName`, checked on load); only what a person reads uses the plain name. The share copy's `useName` is the plain name, and the Team tab shows the plain name for older copies too. "Add to the AI Register" still sends the catalogue name.

## Files, build, tests

`src/content.js` (words), `src/logic.js` (rules, `resultModel()` = every word of the result), `src/flow.js` (FLOW table, store, migration, page-only machines), `src/pdf.js`, `src/app.js` (drawing and `send()`), `build.mjs` (inlines the catalogue, the generated questions, the AI Register data with the Readiness check's cuts, the Readiness check's `logic.js` and `store.js`, jsPDF and the PDF font).

```
node tools/readiness-2/build.mjs
node tools/readiness-2/tests/logic.test.mjs      # 3^5 combinations, every threshold edge, cap, unknown-heavy, none, wording
node tools/readiness-2/tests/questions.test.mjs  # generator and checker for all 99 use cases
node tools/readiness-2/tests/flow.test.mjs       # transitions, guards, stop, store, v1 → v2, files, machines
node tools/readiness-2/tests/pdf.test.mjs        # the two PDFs: the Result PDF's text equals the result's wording, the Answers PDF lists every question once, no sources; drawing; file names (_result.pdf, _answers.pdf)
node readiness-2/tests/browser/v27.cjs           # from tools/; serve tools/ on 8815: both PDF buttons (standalone, hub, a fake hub granting downloads), one at a time, the PDF files read with pdftotext
node tools/readiness-2/tests/build.test.mjs      # inlined data equals its sources; same AI Register inputs as the readiness check
node tools/readiness-2/tests/v21.test.mjs        # v2.1: every audit fault, every council item, the three switches, v2.0 records
node tools/readiness-2/tests/v22.test.mjs        # v2.2: every wording key applied, unknown keys refused, saved answers kept, explainer data for all 99
node tools/readiness-2/tests/v23.test.mjs        # v2.3/v2.4: four answers, old Partly / Doesn't apply records (fixture), wording, bundled catalogue detail for all 99
node tools/readiness-2/tests/browser/walk.cjs    # Playwright; serve tools/ on 8815 first (see its first lines)
node tools/readiness-2/tests/browser/v21.cjs     # Playwright; serve tools/ on 8817 (R2_BASE for another address)
node readiness-2/tests/browser/v23.cjs           # from tools/; serve tools/ on 8815: four answers, result page, the detail layer; screenshots to reports/readiness-2-screens/four-answers/
node tools/readiness-2/tests/v25.test.mjs        # v2.5: the council's BUILD NOW items, rules v2.5 (O1 to O4) with its nine answer patterns, clean-up inventory v3 (H1, M4, L1 to L5), the v2.4 fixture
node tools/readiness-2/tests/v261.test.mjs       # v2.6.1: clean-up inventory v4 (an older or newer page in another tab, every layer passes the hub's check, docs)
node readiness-2/tests/browser/v261.cjs          # from tools/; serve tools/ on 8815: the hub's layer closes with the tool's step or check change and on a frame reload; tabs of a newer or older version
node tools/readiness-2/tests/v26.test.mjs        # v2.6: question 1 turned round with the migration (fixture v2.5-saved.json), new questions 3 and 4, plain source links, the hub's detail layer
node readiness-2/tests/browser/v26.cjs           # from tools/; serve tools/ on 8815: step 2, the stop screen, the result card, the detail layer standalone and drawn by the hub, Answers PDF page 1; screenshots to reports/readiness-2-screens/v26/
node readiness-2/tests/browser/v25.cjs           # from tools/; serve tools/ on 8831: R1 to R6, Team tab T1/T2, the nine patterns on the page, sharing off; screenshots to reports/readiness-2-screens/v25/ and wording/
node tools/readiness-2/tests/v251.test.mjs       # v2.5.1: every catalogue source renders with one link per URL; the five answers explained on the card and listed in the Answers PDF
node readiness-2/tests/browser/v251.cjs          # from tools/; serve tools/ on 8831: the hub-drawn detail layer and plain links (readiness-2, catalogue, register), the AI-problem card; screenshots v25/v251-*.png
```

`walk.cjs` and `v21.cjs` set `window.R2_TEST_SHARING` before load, so they still prove the share paths for when sharing is switched back on.

AX: `#app[data-state]`, `data-level`, `data-layer`, `data-storage`, `data-dl`, `data-bridge`; `window.Readiness2.state()`, `.record()`, `.store()`, `.send(event, arg)`, `.events()`, `.resultModel()`, `.pdfModel()`. See `CLEANUP.md`.
