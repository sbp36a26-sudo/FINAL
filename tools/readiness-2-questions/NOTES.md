# NOTES: how this tool works (read before changing anything)

"Can AI solve your problems?" v2.8.1, folder `tools/readiness-2-questions/` (rewritten 26 Nov 2026, inventory v28 S2; the base
tool's notes about the hub, sharing, the Team tab and the question generator no longer apply and were removed).

## Build
`build.mjs` (`buildPage()`) inlines into `src/page.html`: `style.css`; a JSON block `#r2-data` = `{ cat, tq, ex, detail, builtOn }`;
a JSON block `#r2-font` (Register Sans base64, SIL OFL 1.1); jsPDF (`tools/assessment/lib`); then `content.js`, `logic.js`,
`flow.js`, `pdf.js`, (public only) `collect.js`, and `app.js`. No external file of any kind.
- `node build.mjs` → `index.html`, the claude.ai artifact: window.storage and the downloads capability when the viewer has them;
  nothing is sent anywhere.
- `node build.mjs --public` → `public/index.html`, served by GitHub Pages (`.github/workflows/pages.yml`): `window.R2_PUBLIC =
  { collectUrl, contact }` from `hosting.config.json`, plus `src/collect.js`. No window.storage, no window.claude; ordinary blob
  downloads with the Copy / Print fallbacks; the data notice; events sent to the Apps Script (`hosting/`).
- `cat`: `catalogueModel()` from `../use-case-catalogue/index.html` (`<script id="data">`): per use case `id, n` (the data file's
  plain name), `alias` (hash of the catalogue's own name, for old saves), `use` (level). lg-2 is listed in `removed`.
- `tq`: `tqModel()` from `data/usecase_questions_only.json` (the owner's data, verbatim: 98 use cases, 743 questions), with
  `data/actions_questions_only.json` (one action per question), `data/must-meta.json` and `data/v27-sigs.json`.
- `ex`: `data/explain.json`. `detail`: `sourcesModel()` (catalogue sources, `data/sources_fixes.json`, `data/sources_edits.json`,
  `data/use_case_sources_v2.json`, `data/source_scores_v27.json`).
- `spec/` holds review records: `spec/review/usecase_questions_fixed.json` is the shipped data (= `data/usecase_questions_only.json`);
  `spec/usecase_questions_only.json` is an older review copy, not used by the build (inventory D10).

## Where answers are kept
Store `{ v: 4, cur, checks, notice }` under localStorage `hftp-readiness2q-v1` (a v2.6.1 store under `hftp-readiness2-v1` is read
once). The open check of each tab is in sessionStorage `hftp-readiness2q-cur`. Shared hotel profile: `hftp-hotel-profile-v1`.
On the claude.ai build, window.storage (when present) mirrors the store with read-merge-write (`F.mergeWS`). The STORAGE machine
(`F.storageNext`) says `ok`, `blocked` (memory only: banner with Copy saved check) or `newer` (never written over).
Public build only: the opt-out under `hftp-readiness2q-nosend` ('1' = do not send).

## Scoring (src/logic.js)
Rules v2.6, unchanged since 24 Nov 2026 (cut-offs in `T`, switches in `JUDGEMENT`). `evaluate()` → level, score, holds;
`resultModel()` → every word of the result page; the PDFs (`pdf.js`) read the same model.

## Page (src/app.js)
Draws the state and turns clicks into `send(event)`; `window.Readiness2.state()` is the read-only snapshot (AX). Machines and their
states: `CLEANUP.md`.

## Known limits
- The PDFs are untagged (jsPDF): the on-screen result is the accessible version (council v2.8 (d) 7).
- Outside claude.ai a blocked blob download cannot be detected; the toast says to use Copy plan or Open printable page.

## v2.8.0 (25 Nov 2026)
- Data: `usecase_questions_only.json` = the review's fixed file (lg-2 `removed`, no questions). `v27-sigs.json`: the v2.7 signatures; a
  save answered against v2.7 carries answers by question id unless the question was rewritten (`k27` in the page data). v2.6.1 saves
  still carry by `carry_answer_from`. A save of lg-2 opens as "None of these fits" (`info.removedUse`).
- `actions_questions_only.json`: one action per question; `R2Logic.task` shows it (person prefix left out, the plan names the person).
- Sources per use case: `D.detail[id] = { srcs: [{ k, t, n, o, x, u, s, f }], thin, note, nV2 }` (`build.mjs sourcesModel`), drawn by
  `R2Logic.sourcesBox` inside `[data-sources]` (detail layer, step 5, result) and as `src` blocks in the Result PDF. The banned-word scan
  leaves out exactly these (owner decision 2) and the vendored jsPDF.
- Storage: `window.storage` (if present) and localStorage, else memory; checks are never dropped on load. "Start a new check" asks same
  or different hotel (`new` with `{ same }`).
