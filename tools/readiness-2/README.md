# Do you need AI? (v2.2, prototype)

Hub tab **Do you need AI?** (tooltip "Is AI the answer, and is your hotel ready for it?"). Since 24 Nov 2026 it **replaces the Readiness check tab** in the hub: one tool that asks whether the job needs AI at all, checks the must-haves, asks tailored questions for the chosen use case and ends with a **verdict and a score in %** (v2.1: worded "Score: n%", never "% ready") (owner's decision of 24 Nov 2026, overriding the earlier "no score" rule for this tool). The folder `tools/readiness-2/`, the tool id `readiness-2` and the storage key `hftp-readiness2-v1` are unchanged. `tools/readiness-check/` stays in the repo and stays published as a file, so old bookmarks open.

For hotel managers who know nothing about AI. Not yet tested with real managers. What was built, what was not, and the open decisions: `research_notes/Do you need AI v2/build_notes.md`.

## The journey

| Screen | State | What happens |
|---|---|---|
| Cover | `start` | Why this tool / How to use it (the five steps) / What you get ("a verdict and a score"), the honesty line, **Start**, and **Your checks in this browser** with **Open a saved file**. |
| 1 About your hotel | `hotel` | The Readiness check's fields in one row: how the hotel is run (required), hotel name, your role, country. Reads and writes the shared profile `hftp-hotel-profile-v1` as the Readiness check did. |
| 2 Is this an AI problem? | `q` | C-R-I-S-P: five one-sentence questions, Yes / No / Not sure, each with the "Why this matters" fold (one-line reason, "Answer Yes if" and "Answer No if" side by side with examples, "Not sure?" on Q1). |
| Stop | `stop` | Q1 = No → "This is not suitable for AI." with why, what to do instead, **Change my answers**, **Start again**, **Download (PDF)**. No event, history entry or saved record gets past it. |
| 3 Must-haves | `must` | Ten things to have in place before an AI project starts. Scale Yes / Planned, not done yet / Partly / No / Don't know yet, "By when?" for Planned. Every one needs an answer. Collapsed "Why this matters": the reason, what counts as Yes, the share from the team's resource analysis ("needed for 90 of 90 use cases …, team judgement, not a survey") and sourced figures with base and date. |
| 4 Where in the hotel? | `where` | Area › department › use case from the Use-Case Catalogue (99, all selectable), or **None of these fits my problem**. `#use=<id>` preselects a use case. Each row shows the team's plain name (v2.2) and a **What does this do?** button that opens an inline panel under the row: what it does, how the AI works, how common in hotels (catalogue rating), the catalogue name where it differs, the draft note for the 8 draft use cases, and **See it in the Use-Case Catalogue** (hub `open` bridge; a plain link outside the hub). Pressing it never chooses the row; one panel at a time (`ui.explain`). |
| 5 Questions for this use case | `tailored` | 6 to 9 questions generated from the owner's workbook row for that use case, plus the add-on questions it flags. Same scale plus "Doesn't apply". Skipped for "None of these fits". The 8 use cases without a workbook row are marked "Draft questions: team to review". |
| Result | `result` | Verdict, the reason ("Because …"), "Score: 73%" with the points and question counts next to it (or "No score yet: …"), must-have line, the law line on high-risk or sensitive-data uses, Start with these three, the AI-problem verdict and carried conditions, where it sits, what is in place by area (counts), action plan by person with a copy button each, vendor questions, the provisional AI Act label, every answer, how it was worked out, sharing (opt-in), Your checks, sources. Top row: Download (PDF), Copy summary, Print, Save as file, Add to the AI Register, Start a new check. |

## Rules

**Five questions** (unchanged): Q1 No stops. Otherwise Q2 No → "Probably not worth it."; Q3 No → "Fix the data first."; Q5 No → "Define success first."; any Not sure → "Find out first."; Q4 No → assistant only; all Yes → "Worth exploring with AI." A No on Q2 to Q5 is carried to the result as a condition.

**Score and verdict** (`src/logic.js`; cut-offs in `T`, team-judgement switches in `JUDGEMENT`; rules v2.1):
- Points: Yes 2 · Planned 1 · Partly 1 · No 0 · Don't know yet 0 (`UNKNOWN_SCORES_ZERO`, team judgement; still listed as "to find out"). "Doesn't apply" is left out.
- Score = points ÷ points possible over must-haves + tailored questions, rounded down, shown as "Score: 73%" with "25 of 34 points on 17 questions: 15 answered, 2 “Don’t know yet” (0 points each). Your own answers; nobody checked them. The cut-offs are the team's judgement, not tested with hotels."
- Verdict, in this order: **Not enough information yet** (more than half unknown; no score shown) → **Not ready yet** (any must-have at No, or below 50%) → **Ready to start a pilot** (every must-have Yes, 75% or more, fewer than a quarter unknown) → **Almost ready** (everything else).
- The top verdict is held back, with the reason shown, for a use the AI Register labels high-risk or the team's sheet flags for sensitive data (`LEGAL_HOLDS_TOP`), and when a No is carried from questions 2 to 5 (`CARRIED_NO_HOLDS_TOP`). Both are team judgement; set a switch to `false` to turn it off.
- A must-have that is not Yes caps the result. Areas: "n of m in place", with Strong / Gaps to close / Weak only where an area has two or more answers.
- Results kept under rules v2 stay in the history, marked "worked out with earlier rules", and are not compared line by line.

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

## Storage, files, sharing

- `localStorage['hftp-readiness2-v1']` = `{ v: 2, cur, checks: { <id>: check }, notice }`. Several checks per browser. A **v1 record** (builds before 24 Nov 2026) is converted on load: the five answers and the chosen use case are kept, the old step 2 and 3 answers are dropped, and a one-time notice says so (fixtures `tests/fixtures/v1.3-saved.json`, captured from the v1.3 page before any change, and `v1.1-saved.json`).
- A newer version is shown and never written over. Blocked storage is said on every screen.
- **Save as file / Open a saved file**: `{ kind: 'hftp-do-you-need-ai', v: 2, rules, savedAt, check }`.
- **Return visit**: a dated snapshot (with its use case and rules) is kept whenever the result differs from the last; "Since last time" compares the last two of the same use case and rules.
- **Tabs**: which check is open is kept per tab in `sessionStorage['hftp-readiness2-cur']`; unreadable saved data is set aside under `hftp-readiness2-v1-corrupt`.
- **Sharing (opt-in, `SHARING_ON` in `src/app.js`)**: a copy goes to `readiness/<viewer id>/checks/<check id>` through the hub's db bridge (the Readiness check's `store.js`, same message shapes), with `kind: 'dyn'`, `v: 2`. The red **Team: readiness results** tab lists and recomputes both old checks and these copies. Outside claude.ai it is a test copy in this browser. A copy can be withdrawn from any step, the stop screen and "Your checks" (v2.1).
- Hub messages, the shared profile key and other tools' keys are unchanged.
- **Names (v2.2)**: a record keeps the use id and the **catalogue** name (`useName`, checked on load); only what a person reads uses the plain name. The share copy's `useName` is the plain name, and the Team tab shows the plain name for older copies too. "Add to the AI Register" still sends the catalogue name.

## Files, build, tests

`src/content.js` (words), `src/logic.js` (rules, `resultModel()` = every word of the result), `src/flow.js` (FLOW table, store, migration, page-only machines), `src/pdf.js`, `src/app.js` (drawing and `send()`), `build.mjs` (inlines the catalogue, the generated questions, the AI Register data with the Readiness check's cuts, the Readiness check's `logic.js` and `store.js`, jsPDF and the PDF font).

```
node tools/readiness-2/build.mjs
node tools/readiness-2/tests/logic.test.mjs      # 3^5 combinations, every threshold edge, cap, unknown-heavy, none, wording
node tools/readiness-2/tests/questions.test.mjs  # generator and checker for all 99 use cases
node tools/readiness-2/tests/flow.test.mjs       # transitions, guards, stop, store, v1 → v2, files, machines
node tools/readiness-2/tests/pdf.test.mjs        # PDF text equals the result's wording; drawing; file names
node tools/readiness-2/tests/build.test.mjs      # inlined data equals its sources; same AI Register inputs as the readiness check
node tools/readiness-2/tests/v21.test.mjs        # v2.1: every audit fault, every council item, the three switches, v2.0 records
node tools/readiness-2/tests/v22.test.mjs        # v2.2: every wording key applied, unknown keys refused, saved answers kept, explainer data for all 99
node tools/readiness-2/tests/browser/walk.cjs    # Playwright; serve tools/ on 8815 first (see its first lines)
node tools/readiness-2/tests/browser/v21.cjs     # Playwright; serve tools/ on 8817 (R2_BASE for another address)
```

AX: `#app[data-state]`, `data-level`, `data-storage`, `data-dl`, `data-bridge`; `window.Readiness2.state()`, `.record()`, `.store()`, `.send(event, arg)`, `.events()`, `.resultModel()`, `.pdfModel()`. See `CLEANUP.md`.
