# Do you need AI? v3 (tools/readiness-3): changelog

The history of the tool before v3 (v1 to v2.7) is in `tools/readiness-2/CHANGELOG.md`. This file is a change log: it names what was
removed, so the banned-term grep skips it (spec §5, "excluding the change-log fields").

## 3.0.1 (25 Nov 2026)

Clean-up fixes (`reports/audit-readiness-3/cleanup_inventory_v1.md`) and the code-only BUILD NOW items of the council
(`reports/Council - Do you need AI v3.0.md`, section a). No spec JSON text, no weight, cut-off or verdict changed: golden 33/33 and the
sweep (26,935 runs, 0 verdict, score, caps or row-key diffs) still hold. Not published from this change. Every bug below has a test
that failed on 3.0.0 and passes now (unit tests in `store3`, `rules3`, `data3`; browser tests in `ui.cjs` `cleanup()`, run alone with
`R3_ONLY=cleanup`: 56 of 70 checks failed on the 3.0.0 page). Screenshots: `reports/readiness-3-screens/v301/`.

### Bugs fixed

| # | Fix | Test |
|---|---|---|
| H1 | The copy box is drawn under the banner on every screen without its own place (cover, steps 1 to 5), so the banner's Save as file works with storage blocked and no downloads; `resetUi()` clears it when the check changes | `ui.cjs` H1 (6 screens, paste back) |
| H2 | Opening a file of a check this browser holds in a newer version opens it as a copy (new id, toast "Opened as a copy: …"); an equal or newer file replaces it (`R3Store.openMode`) | `store3` H2, `ui.cjs` H2 |
| H3 | Own-property lookups in `clean()`, `fromV2()` and `R3Rules.evaluate` (`ANS`): "constructor", "toString" and the like are dropped / count as Don't know yet, never `NaN` | `store3` U1a–d, `rules3` H3 |
| M1 | The index is merged with the stored one on every write (and on `storage` events); ids removed here or in another tab stay removed | `ui.cjs` M1 |
| M2 | The same check in two tabs: a change elsewhere is taken over when nothing waits to be saved; otherwise a banner ("Use the other version" / "Keep my answers") holds the write | `ui.cjs` M2 |
| M3 | Remove asks first ("Remove this check?", Cancel focused) through the shared confirm dialog | `ui.cjs` M3 |
| M4 | Opening a check or file resets the department, search, notes and copy box (`replaceRec` → `resetUi`) | `ui.cjs` M4 |
| L1 | A failed read (not "not found") of the index or record at boot moves to memory with the banner; the stored index is never overwritten | `ui.cjs` L1 |
| L2 | `pagehide` / hidden flush writes a waiting save | `ui.cjs` L2 |
| L3 | The readiness-2 import is written to the index at once | `ui.cjs` L3 |
| L4 | Boot settles within 3 s (or on an error) in memory with the banner | `ui.cjs` L4 |
| L5 | Focus returns: Close on the copy box → the button that opened it; OK on the import banner → the heading; Remove → the next check or the list heading | `ui.cjs` L5 |
| L6 | `hasAnswers` no longer counts the hotel details (new `hasContent` for the banner's Save as file); untouched checks are not listed, not asked about and not kept | `store3` U3, `ui.cjs` L6 |
| L7 | A file of a newer version: "This file was saved with a newer version of this tool. Open it there." | `store3` U2, `ui.cjs` L7 |
| L8 | The import banner's N counts only questions new since v2.6.1 (m11, How it works, unmapped questions; s3/s4 for pre-v2.6 records); 0 says "no new questions to answer" | `store3` U4 |
| L9 | Continue this check opens the first screen with something to answer | `ui.cjs` L9 |
| L10 | Download buttons show "Preparing…" with `aria-busy`/`aria-disabled` while waiting; further clicks are ignored; no answer from the host within 10 s → Copy | `ui.cjs` L10 |
| L11 | A `save()` that throws goes to the Copy box (no unhandled rejection) | `ui.cjs` L11 |
| L12 | Save errors other than unavailable / not granted / capability: "The file couldn't be saved here. Use Copy instead." | `ui.cjs` L12 |

Dead code removed: D3 (`ok` in `copyText`), D4 (`R3Rules.answerOptions` is now used by the page), D5 (`notFit` and the `task` export),
D6 (`R3Data.label`, `IX.S2`), D7 (`R3Store.V`), D8 (stale `pdf3.test.mjs` comment), D9 (`R3Result.ansLabel` export). D1 (first-visit
import of readiness-2 checks) is kept for local and same-origin copies, with L3 fixed and the README corrected; deleting it is an owner
decision. D2 (`window.storage`) is kept and labelled optional and untested in the viewer.

Tests that encoded a bug and were updated: `store3` "N new questions = unanswered after import" (now new questions only, L8) and
"newer version → not a saved check" (now `{ newer: true }`, L7); `ui.cjs` and `questions.cjs` step 5 checks follow BUILD NOW 1.

### Council BUILD NOW (section a)

| # | Item | Status |
|---|---|---|
| 1 | Step 5 shows only the How it works questions until each has an answer; then the questions. The line says how many follow ("Answer the question above to see the 7 to 9 questions for this use case. Until then, they count as Don't know yet."; the range covers every answer still possible). Scoring unchanged (`R3Rules.visible` as before; unanswered = Don't know yet). This reverses the P5 change that showed them early | Done; `questions.cjs` checks all 1,636 combinations (988 held back, with the count from `sim_v3`) |
| 2 | The reason sentence names at most two items, then "and N more (see the plan below)" (blockers No; step 2 not Yes). Text only, verdicts and scores untouched | Done; `rules3` |
| 3 | Must-haves line: "Answer for the job you thought of in step 2. 'The tool' means the AI tool you have in mind; you pick the exact use case in step 4." | Done |
| 4 | How it works line: "No tool chosen yet? Answer Don't know yet, or ask the vendor. You can change it later." | Done |
| 5 | Sensitive flag in the information style (accent border, soft background, "i" mark), text verbatim; also in the PDF | Done; `a11y.cjs` contrast pairs updated |
| 6 | Under a score of 50% or more with Not ready: "The verdict comes from the Must be Yes questions, not from the score." Screen only. For Not enough info the council's sentence would be wrong, so it reads "The verdict comes from the Don't know yet answers, not from the score." | Done (variant for Not enough info) |
| 7 | "Search the 99 use cases" on step 4: all words, titles and departments, keyboard-operable, 44 px targets; empty search shows the department list | Done; `questions.cjs` |
| 8 | `?session=1`: `rec.timing = { <step>: [first enter, last leave, ms] }` in the record and the saved file; nothing on screen, no network; `clean()` keeps it | Done; `store3`, `ui.cjs` |

Sections (b) content changes and (c) owner decisions are not applied.

## 3.0.0 (25 Nov 2026)

A new, separate, standalone artifact built from `spec/MASTER_PROMPT.md` and `spec/usecase_questions_v3.json`. `tools/readiness-2/`
(v2.7), the hub and every other tab are unchanged. Not published from this change (the main session publishes it as a new artifact).

### What changed from v2.7

| Area | v2.7 (readiness-2) | 3.0.0 (readiness-3) |
|---|---|---|
| Where it lives | A tab of the hub, built by `build-hub.mjs`, with a bridge to the catalogue and register | One self-contained `index.html` (898 KB): data, CSS, JS, jsPDF and font inlined; no external URL, no hub bridge, no cross-links |
| Use-case questions | 661 generated from a six-area template (`data/build-questions.mjs`), reworded | 794 written per use case, used verbatim from the JSON: 395 kept, 105 fixed, 28 rewritten, 44 split, 65 merged, 24 removed, 56 new, 122 added by How it works answers |
| What the tool does | Never asked | Step 5 opens with "First, how will this tool work in your hotel?": 1–2 How it works questions per use case decide which questions follow |
| Blockers | Step-5 answers could never block | Every question has a weight (Must be Yes / Important / Nice to have); any visible blocker No gives Not ready |
| Question 1 | Yes meant "rules can do it" and ended in a hard stop | Yes means towards AI; question 1 or 2 No is a soft stop with Change my answers, Continue anyway (capped at Almost ready) and Download (PDF) |
| Must-haves | 10, none could be "Doesn't apply" | 11 (m11 staff shown the tool, new); m2 and m4 offer Doesn't apply with help text, checked against the How it works answers (contradiction note, "Change my answer") |
| Sensitive uses | A legal label | A plain flag (always for 10 use cases, from a How it works answer in 13 more): fixed text, Almost ready at best, "Ask an adviser before a pilot." as action 1 |
| Verdict | Score first | Verdict word and colour, one-sentence reason, flag, top 3 actions with owner, then details; readiness score last |
| Legal content | AI Act label and section, register hand-over, legal questions, notes and sources | None: only the disclaimer and the sensitive-area text (verbatim); build and tests fail on any banned term |
| Answers | Yes / Planned / No / Don't know yet | The same, plus Doesn't apply on m2 and m4 only; "Don't know yet" is the only uncertainty term |
| Saving | `hftp-readiness2-v1`, file v3 | `hftp-readiness3-v1`, one record per check, `window.storage` then `localStorage` then memory; file `{kind, v: 4, rules: "3.0", app: "3.0.0", savedAt, check}`; v2.6.1 / v2.7 checks and files migrate |
| Downloads | Two PDFs through the hub's download bridge | PDF and saved file through the artifact downloads capability; Copy fallbacks when it is not offered |

### Per phase

- **P0** `0e492d8 readiness-3: scaffold from v2.6.1` — copy of readiness-2 v2.7, new id, keys and title, `spec/` added.
- **P1** `8e0cbed readiness-3: v3 question data` — the runtime JSON inlined and validated with the schema in the build and the tests.
- **P2** `d91bf7f readiness-3: v3 rules` — `src/rules3.js`, 33/33 golden cases, sweep parity 26,935 runs / 0 diffs, invariants.
- **P3** `fa0b459 readiness-3: remove legal content` — removed: the EU AI Act label and its result section, "Add to the AI Register",
  the AI Register and readiness-check data and code inlined by the v2 build (labels, articles, items to check, country and
  labour notes, legal vendor questions), the legal warning, "not legal advice" footers (now the disclaimer), the catalogue's
  source lists in "Details and sources", the v2 question generator and its workbook data (with DPIA, works council, CE marking,
  consent, allergen law, PCI DSS wording), every cross-link to other hub tabs (`#use=`, `postMessage`, hub bridge, detail layer).
  Five legal phrases cut from the copy of `data/explain.json` (list in `LEGAL_LEFTOVERS.md`). The page is now built on the v3
  data and rules only. Banned-term grep in `build.mjs` (fails the build) and `tests/banned.test.mjs`: 0 matches.
- **P4** `23fe8f8 readiness-3: v3 UX, PDF, migration` — screenshot review fixes (step kicker duplicated the progress line; brand line
  on the cover; the sensitive reason repeated the flag, now "Held at Almost ready: …" with the flag under the verdict box; fold
  markers; area bars of equal length; glossary on the cover, picker and stop screen), new tests `store3.test.mjs` (flow, files,
  migration with real v2.7 store and file fixtures and readiness-2's v2.5 fixture) and `result3.test.mjs` (33 golden cases: §9
  usefulness rules, Copy = PDF top 3, PDF page 1, footer, section order), browser test `tests/browser/ui.cjs` (358 checks at
  1280×800 and 360×740), screenshots in `reports/readiness-3-screens/`.
- **P5** `0d8092e readiness-3: tests and self-review` — new browser tests `tests/browser/questions.cjs` (1,636 use case × How it works
  combinations at 1280 and 360 px: the cards shown = `R3Rules.visible` = `sim_v3.visible_questions`, ids and order; every card verbatim
  with "Who answers", weight label, Planned help and a collapsed "Why we ask"; no horizontal scroll; all 99 use cases reachable in the
  picker) and `tests/browser/a11y.cjs` (manual accessibility checks, axe-core not in the repo); `ui.cjs` adds Copy through the
  clipboard. Defects fixed: step 5 grouped questions by area, which reordered them against the data in 668 of 1,636 combinations, and
  hid them until every How it works question was answered (unanswered ones still counted): now always shown, in the data's order, an
  area name above each run; the use-case picker's list items sat in a list whose role was changed (now plain labels in the radio
  group); the confirm dialog's label pointed at a missing element when closed; printing to PDF fired beforeprint twice and left the
  folds open after; a code comment said "unknown".
- **P6** `readiness-3: v3.0.0` — version 3.0.0 on the page footer ("Version 3.0.0."), in the PDF footer ("Do you need AI? 3.0.0"),
  in saved files (`app: "3.0.0"`, `R3Store.APP`) and in the README; `tests/review.test.mjs` (one check per review finding, the 7
  Wrong use cases and the action counts, 661/661); `REVIEW_RESPONSE.md`; final build.
