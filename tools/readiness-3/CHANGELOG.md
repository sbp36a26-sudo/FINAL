# Do you need AI? v3 (tools/readiness-3): changelog

The history of the tool before v3 (v1 to v2.7) is in `tools/readiness-2/CHANGELOG.md`. This file is a change log: it names what was
removed, so the banned-term grep skips it (spec §5, "excluding the change-log fields").

## 3.0.0 (in progress, 25 Nov 2026)

- **P0** `readiness-3: scaffold from v2.6.1` — copy of readiness-2 v2.7, new id, keys and title, `spec/` added.
- **P1** `readiness-3: v3 question data` — the runtime JSON inlined and validated with the schema in the build and the tests.
- **P2** `readiness-3: v3 rules` — `src/rules3.js`, 33/33 golden cases, sweep parity 26,935 runs / 0 diffs, invariants.
- **P3** `readiness-3: remove legal content` — removed: the EU AI Act label and its result section, "Add to the AI Register",
  the AI Register and readiness-check data and code inlined by the v2 build (labels, articles, items to check, country and
  labour notes, legal vendor questions), the legal warning, "not legal advice" footers (now the disclaimer), the catalogue's
  source lists in "Details and sources", the v2 question generator and its workbook data (with DPIA, works council, CE marking,
  consent, allergen law, PCI DSS wording), every cross-link to other hub tabs (`#use=`, `postMessage`, hub bridge, detail layer).
  Five legal phrases cut from the copy of `data/explain.json` (list in `LEGAL_LEFTOVERS.md`). The page is now built on the v3
  data and rules only. Banned-term grep in `build.mjs` (fails the build) and `tests/banned.test.mjs`: 0 matches.
- **P4** `readiness-3: v3 UX, PDF, migration` — screenshot review fixes (step kicker duplicated the progress line; brand line
  on the cover; the sensitive reason repeated the flag, now "Held at Almost ready: …" with the flag under the verdict box; fold
  markers; area bars of equal length; glossary on the cover, picker and stop screen), new tests `store3.test.mjs` (flow, files,
  migration with real v2.7 store and file fixtures and readiness-2's v2.5 fixture) and `result3.test.mjs` (33 golden cases: §9
  usefulness rules, Copy = PDF top 3, PDF page 1, footer, section order), browser test `tests/browser/ui.cjs` (358 checks at
  1280×800 and 360×740), screenshots in `reports/readiness-3-screens/`.
