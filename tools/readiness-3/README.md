# Do you need AI? v3 (tools/readiness-3)

**v3.0 in progress (25 Nov 2026).** A new, separate, standalone artifact. It started as a copy of `tools/readiness-2/` v2.7, which is
only read from here, never edited. Tool id `readiness-3`, storage key `hftp-readiness3-v1`, page title "Do you need AI? v3.0".
The owner's spec and data are in `spec/` (source of truth: `spec/MASTER_PROMPT.md`, `spec/usecase_questions_v3.json`).

`node tools/readiness-3/build.mjs` writes ONE self-contained `index.html`: no external URLs, no CDN, no web fonts, no hub bridge.
The tool holds no legal content (spec §5): the only two texts about rules are the disclaimer and the sensitive-area note, both
verbatim from the data. The build fails on any banned term (below); what could not be removed is listed in `LEGAL_LEFTOVERS.md`.

## Files

| File | What |
|---|---|
| `spec/` | The owner's files (read only): question data, schema, golden cases, the reference rules `sim_v3.py` and its sweep. |
| `lib/data3.mjs`, `lib/schema.mjs` | Load both JSON files and validate them against the schema (build and tests). |
| `lib/banned.mjs` | The banned-term grep: the terms of §5, case-insensitive and word-bounded, allowlist = the two exact texts. |
| `data/explain.json` | "What it does" and "How the AI works" per use case, shown on step 4 for the chosen use case. A copy from readiness-2 with five legal phrases taken out (`LEGAL_LEFTOVERS.md`). |
| `src/data3.js` | `R3Data`: indexes the data, glossary lookup (each acronym is spelled out once per screen). |
| `src/rules3.js` | `R3Rules`: gates, visible questions, contradictions, soft stop, score, verdict, caps, reason, actions, top 3 (parity with `sim_v3.py`). |
| `src/store3.js` | `R3Store`: one check as a record, the flow between screens, saved files, migration of readiness-2 checks. |
| `src/result3.js` | `R3Result`: every word of the result in the §6.4 order; the Copy texts. |
| `src/pdf3.js` | `R3Pdf`: the A4 PDF from the same model (page 1 = summary; footer = disclaimer and "page n of N"). |
| `src/app3.js` | The page: screens, storage, downloads, files. Test API `window.Readiness3`. |
| `src/page.html`, `src/style.css` | Page shell and styles (the project's tokens; no external fonts). |

## The journey

Cover → 1 About your hotel → 2 Is this an AI problem? (five questions, not scored; question 1 or 2 No = soft stop screen with
Change my answers, Continue anyway, Download (PDF)) → 3 Must-haves (11, all "Must be Yes"; m2 and m4 also offer "Doesn't apply"
with their help line) → 4 Where in the hotel? (department, then one of 99 use cases, or None of these fits; no choice = None of
these fits) → 5 Questions for this use case ("First, how will this tool work in your hotel?": the 1–2 How it works questions, then
the questions they unlock, in the data's order, with the area name above each run of one area) → Result (verdict, reason, sensitive-area note, notes, top 3 actions, Copy / Download
(PDF) / Save as file, details by area, action plan by person, questions for the vendor, every question and answer, how this was
worked out, readiness score, disclaimer). Back keeps every answer. Next with unanswered questions says how many and that they
count as Don't know yet; a second Next goes on.

## Storage, files, migration

- `window.storage` (personal, `shared: false`) when the viewer offers it, else `localStorage`, else memory with the banner "Your
  answers can't be saved in this browser. Use Save as file." Index `hftp-readiness3-v1` = `{ v, cur, ids }`; one record per check
  under `hftp-readiness3-v1_c_<id>`.
- Save as file / Open a saved file: `{ kind: "hftp-do-you-need-ai", v: 4, rules: "3.0", savedAt, check }`. Files of version 2 and 3
  (readiness-2) are migrated. A paste box takes the text of "Copy saved check".
- Migration (§6.6, table built at build time from `original_questions[].new_ids`): hotel kept; "Not sure" → Don't know yet; q1
  turned round for v2.6+ checks; must-haves 1–10 → m1–m10; m11 and How it works start empty; kept, fixed, rewritten and split
  questions carry their answer; merged and removed ones are dropped and counted. Banner: "Imported from v2.6.1: please answer N new
  questions", and the check opens on the first screen with something to answer. On a first visit, checks of readiness-2 in the
  same browser are imported once (the old store is never written).
- Downloads: only through the artifact downloads capability (`window.claude.use("downloads")` → `save({ filename, data })`).
  When it is not offered, Copy is shown instead (the plan as text, or the saved check as text).

## Tests

```
node tools/readiness-3/build.mjs
for t in tools/readiness-3/tests/*.test.mjs; do node $t; done
#   data3 (schema, counts), rules3 (golden 33/33, visibility, sweep 26,935 runs, invariants), store3 (flow, files, migration),
#   result3 (33 golden results, Copy and PDF), banned (page, sources, exports, PDF text), build (the page, migration table)
# browser (serve tools/ first: python3 -m http.server 8861 --bind 127.0.0.1), from tools/:
node readiness-3/tests/browser/ui.cjs          # the journey, files, migration, downloads, Copy (clipboard)
node readiness-3/tests/browser/questions.cjs   # every use case × How it works combination (1,636): shown = R3Rules.visible = sim_v3, verbatim cards; 99 use cases in the picker
node readiness-3/tests/browser/a11y.cjs        # contrast (tokens and rendered, light and dark), focus, names, aria-live, reduced motion, print, 44 px targets
```

`ui.cjs` walks golden cases 1, 2, 9, 10, 14, 15, 19 and 28 by clicking, golden 1 by keyboard only, Back, reload, Start a new check,
the contradiction note, files, migration, both download paths (a fake `window.claude` and none), blocked storage and
`window.storage`; screenshots of golden 1, 9, 15 and 19 go to `reports/readiness-3-screens/` (`R3_SHOTS=0` to skip).
