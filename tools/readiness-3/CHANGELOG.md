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
- **P4** `readiness-3: v3 UX, PDF, migration` — see the commit and README.
