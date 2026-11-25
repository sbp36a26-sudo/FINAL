# Legal items not removed (spec/MASTER_PROMPT.md §5)

The banned-term grep (`lib/banned.mjs`, run by `build.mjs` and `tests/banned.test.mjs`) finds **0** matches in the page, the PDF
text, every export and every v3 source. This file lists what the grep does not look at, and why. It names legal terms, so the grep
skips this file, `CHANGELOG.md` and `REVIEW_RESPONSE.md`.

## 1. Inside the page, not legal content

| File : line | Text | Why it stays |
|---|---|---|
| `index.html:565` (the `<script id="r3-jspdf">` block; source `tools/assessment/lib/jspdf.umd.min.js:325`, col 725) | `eu:"Basque"` | jsPDF's table of language codes (ISO 639-1 "eu" = Basque). Vendored, minified third-party code; editing it would fork the library. Not legal content. |
| `index.html:565`, cols 10339, 12079, 13975, 15998, 17688, 19443, 21394, 23180 (same block; source line 325) | `}eu{4qu5ou…` and the like | Keys of jsPDF's compressed kerning tables for its built-in fonts (the PDF uses the inlined font instead). Not words. |
| `index.html:239` (`<script type="application/json" id="r3-font">`) | base64 of the PDF font | No match today. Blanked before the scan all the same, because base64 is random letters and a later font could produce a false match. |

The grep blanks only these two blocks (`pageText()` in `lib/banned.mjs`); `tests/banned.test.mjs` checks that every raw match in the
page lies inside them (9 today).

## 2. Outside the scan by rule

| Where | Matches | Why |
|---|---|---|
| `spec/` (the owner's files: `usecase_questions_v3.json` 130, its `.md` 73, `originals.json` 123, `orig_compact.txt` 127, `MASTER_PROMPT*.md` 36 each, `content_src.py` 12, `build_v3.py` 3, `core_src.py` 1) | change-log fields (`original_questions`, `reason`, `review_verdict`, `treatment`), the spec itself | §5 excludes `spec/` and the change-log fields. Read only; nothing from them reaches the page: the build inlines the runtime JSON (0 matches) and, from the full JSON, only the question-id mapping. |
| `CHANGELOG.md`, `LEGAL_LEFTOVERS.md`, `REVIEW_RESPONSE.md` | names of what was removed | Change log and reports. |
| `tools/readiness-2/data/usecase-questions.json` (read by `build.mjs`) | v2 question texts | Read only for each use case's question-set signature (`sig`), so old answers given to another question set are not carried. No text is copied. |

## 3. Removed from the v3 copy of `data/explain.json` (cut, nothing added)

| Use case | Removed |
|---|---|
| fo-1 | " required by law" (after "the police report") |
| fo-6 | "high-risk " (before "guests") |
| kc-2 | "EU " and " (EU Regulation 1169/2011, Annex II)" around "14 allergens" |
| it-4 | "Face recognition is limited by EU law; " (the next word capitalised) |
| lg-2 | "manages consent, " |

The hub's catalogue and `tools/readiness-2/data/explain.json` are unchanged.
