# Do you need AI? v3 (tools/readiness-3): changelog

The history of the tool before v3 (v1 to v2.7) is in `tools/readiness-2/CHANGELOG.md`. This file is a change log: it names what was
removed, so the banned-term grep skips it (spec §5, "excluding the change-log fields").

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
