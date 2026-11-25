# NOTES: how the base works (read before changing anything)

Base: `tools/readiness-2/` at HEAD (commit 74385fe, 25 Nov 2026). The prompt calls it v2.6.1; it is in fact **v2.7** (two result PDFs,
"Download result (PDF)" and "Download answers (PDF)", no sources in either) with the owner's latest wording (step 2 heading "Can this
problem be solved with AI?", question 4 "Safety net"). Rules are still v2.6. This folder starts as a byte copy of the tracked files.

## Build
`build.mjs` writes `index.html` (and `standalone/index.html` with `window.R2_STANDALONE = true`). It inlines into `src/page.html`:
style.css, a JSON block `#r2-data` = `{ cat, tq, rc, ex, detail, builtOn }`, a JSON block `#r2-font` (Register Sans base64, OFL),
jsPDF (`tools/assessment/lib`), the readiness check's `logic.js` (RCLogic) and `store.js` (RCStore), then content, logic, flow, pdf, app.
`page.html` also links Google Fonts (external).
- `cat`: `catalogueModel()` from the catalogue page's `<script id="data">`: per use case `id, n` (catalogue name), `task` (catalogue
  description, research wording), `use` (level), plus `kw`, `staff`, `notTool` from the AI Register's `uc-labels.json`.
- `tq`: `tqModel()` from `data/usecase-questions.json`, plus `highRisk` (ids the register labels High-risk).
- `rc`: `rcModel()`: the readiness check's rdy model and the register's labels, dates, switches, labour notes, vendor questions, items.
- `ex`: `data/explain.json` ({does, how} per use case). `detail`: the catalogue's sources per use case `[type, name, note, url]`.

## Step-5 question data
- `data/build-questions.mjs` (generator) turns `data/excel-rows.json` (workbook, 91 rows, six resource cells each; extracted by
  `extract-excel.py`) plus draft rows from `../readiness/index.html` for 8 later use cases into 661 questions; add-ons by the workbook's
  archetype sheet: `sens` (x-sens, DPIA question), `pay` (x-pay, PCI DSS), `hw` (x-hw), `auto` (x-auto). Then `data/overrides.json`
  (16 hand edits) and `data/wording.json` (names, 661 question texts, 21 core texts) are applied last. `sig` (per use case) is a hash of
  the generated questions before wording.
- `data/usecase-questions.json` = `{ note, workbook, nUses, nFromWorkbook, nDraft, intensity, arch, areas, addonWhy, blocks, matrixTotal,
  uses: { <use id>: { name, int, arch, add, ev, draft, draftNote?, sig, plain, qs: [...] } } }`.
- Question fields: `id` (e.g. `pe1`, `te1b`, `x-sens`, local to the use case), `a` (area key pe/sk/fi/te/da/or), `q` (text), `kind`
  (pe-agreed, fi-cost, addon, arch ...), `who` (role key gm/dept/fin/it/owner), `act` (workbook action shorthand, no longer shown since
  v2.5), `from` (the workbook cell), `addon`, `help`, `na`, `worded`.
- `data/check-questions.mjs`: 6 to 10 questions per use case, at most 30 words (35 when worded), one question mark at the end, no
  semicolon, no duplicate in a use case, no "Art." / "Annex" / "see D7", generator output unchanged.
- `data/explain.json`: plain "What it does" / "How the AI works" per use case (shown in the detail layer and the result).

## Where answers are kept
- Record (`R2Flow.blank`): `{ id, step, qv, Qnew, hotel{name,role,type,country}, Q{q1..q5: y|n|u}, A{m1..m10: y|pl|n|k}, By{m*: date},
  cat, dept, use, useName (catalogue name, checked on load), from, tqSig, T{<question id>: y|pl|n|k}, TBy{<question id>: date}, snaps[],
  share{named}, sharedAt, sharedMode, sharedSig, updated }`. Step-5 answers are keyed by the **local question id** (`pe1`), not
  `useCaseId:questionId`; the use case is `rec.use`. Changing use case clears T and TBy.
- Store: `localStorage['hftp-readiness2-v1']` = `{ v: 3, cur, checks: { id: rec }, notice }`; open check per tab in sessionStorage
  `hftp-readiness2-cur`; corrupt data set aside under `hftp-readiness2-v1-corrupt`; shared hotel profile `hftp-hotel-profile-v1`.
- File (Save as file): `{ kind: 'hftp-do-you-need-ai', v: 3, rules, savedAt, check: forFile(rec) }`.
- `cleanRec` validates everything; if `r.tqSig` differs from the use case's current `sig`, the step-5 answers are dropped and
  "questionsChanged" is said on step 5. Records without `qv: 2` get step 2 turned round (`legacyQ`). v1 records are converted.

## Scoring (src/logic.js)
`evaluate()`: points Yes 2, Planned 1, No 0, Don't know 0 (`UNKNOWN_SCORES_ZERO`), over must-haves + step-5 questions; cut-offs in `T`
(75 / 50 / a quarter / a half unknown); holds in `JUDGEMENT`: `LEGAL_HOLDS_TOP` (via `legalFlags`: register High-risk label in
`TQ.highRisk`, or the `sens` add-on), `CARRIED_NO_HOLDS_TOP`, `ALMOST_MIN_MUST_YES` 50, `READY_MIN_TAIL_YES` 50 (the "fewer than half
the questions for this use case are Yes" hold), `NOT_SURE_HOLDS_TOP`, `NONE_BEST_ALMOST`. `resultModel()` builds every word of the
result page and the PDFs. The step-5 task text is the question itself ("Make this a Yes: ...", "Find out: ...", "Finish: ..."); `act`
is not used for step 5, so no per-question action text is needed. `tailWhy()` fills the step-5 "Why this matters" fold (area, workbook
cell, archetype, intensity, evidence count).

## Page (src/app.js)
Renders each step; `send()` is the only writer. Hub: a `ping` / `pong` bridge with the parent frame (`{hub:'download'}` messages for
PDFs and files, `{hub:'open'}` for "Add to the AI Register", `{hub:'detail'}` draws the detail layer on the hub's main page);
outside the hub a plain blob link downloads. Sharing with the Team tab (RCStore, off by `SHARING_DEFAULT`). Copy boxes for the
action plan and vendor questions. `window.Readiness2` exposes state/record/send/resultModel/pdfModel/fileDoc/openFileText.

## Legal content: where it lives (all removed in commit 3)
- `src/content.js`: `LAW_LINE`, `LEGAL_NOTE`, `HOLD.legal`, `BOX.legal`, `SOURCES.q` (AI Act, Commission guidelines), `SOURCES.qNote`
  ("legal classification", AI Act guide), `SOURCES.must` (EDPB/GDPR; Eurostat "legal consequences"), `SOURCES.tailoredNote` ("Legal
  points"), `SOURCES.resultNote` (AI Act label), must-have 5 (title, question, gloss, why, block "Lawful basis..."), must-have 6 evidence
  (Eurostat "legal consequences"), q4 `noIf` ("legal ... decision") and `add` (AI Act guide, high-risk).
- `src/logic.js`: `legalFlags`, `LEGAL_HOLDS_TOP`, held reason 'legal', method line, `resultModel` (`law`, `legal`, `legalNote`,
  `registerName`, vendor questions via RCLogic incl. the AI Act provider and DPA questions), `holdItems` ('EU AI Act').
- `src/app.js`: EU AI Act fold, "Add to the AI Register", country "Used for the EU AI Act note", profile line naming the AI Register and
  AI Act guide, cover bullet "provisional EU AI Act label", hub link to the earlier Readiness check.
- `src/pdf.js`: "Not legal advice" in LINE and FOOT, the "EU AI Act: provisional label" section.
- `src/page.html`: footer "Student prototype, not legal advice."
- `build.mjs`: rcModel (register labels, labour notes, items), `highRisk`; RCLogic/RCStore inlined.
- Data: `explain.json` (fo-1 "required by law", fo-6 "high-risk", kc-2 "Regulation ... Annex II", it-4 "EU law", lg-2 "consent");
  catalogue `task` (fo-6, it-4, lg-2), names (lg-2 "GDPR ... AI Act", lg-3 "legal", pr-5 "compliance"), department "Legal, Compliance &
  ESG", 21 catalogue sources whose name, note or URL carries a banned word; `wording.json` and `usecase-questions.json` (DPIA, GDPR,
  PCI DSS, works council, consent, law).
