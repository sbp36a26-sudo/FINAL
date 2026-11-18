# Hotel AI Register (prototype)

A hotel lists every AI tool it uses. For each tool the register gives its label under the EU AI Act, the items to check with dates, who is responsible, and what is still moving. It gives items to check, never a compliance verdict, and it is not legal advice.

Built on 17 Nov 2026 from the D4 catalogue, the D7 booklet and data file, and the two research reports in `reports/`.

**Labels follow the EU AI Act text** (as amended in July 2026, checked 17 Nov 2026). They start from the booklet; where the deep-dive research found the booklet says more or less than the law, the register follows the law and shows the booklet's wording next to it (`diff` in `uc-labels.json`, "Differs from the booklet" on the page). Register counts: 3 high-risk, 11 high-risk if…, 11 transparency, 6 can become prohibited (booklet: 3 / 13 / 11 / 5).

## What is in it

| Part | What it does |
|---|---|
| Register | One line per tool: label, role (user or maker), responsible person, open items. Opens with a fictional example hotel. |
| Add a tool | Pick from the 91 catalogue use cases, from 17 market uses the catalogue does not have yet (provisional), or describe your own. |
| Tool page | Questions that decide the label, items to check grouped by date, vendor questions, register entry fields. |
| To do | The booklet's five things to do now, plus every open item by tool. |
| Your hotel | Country, operating model, outlets. Drives the national notes and the "who is the user" note. |
| Watch list | Dated, sourced list of rules and guidance still moving, linked to the tools they affect. |
| How it works | Method, limits, the label of every use case (for team review), backup and restore. |
| Exports | Download PDF (summary), Download CSV (table), Download backup (JSON). |

Entries are saved in the visitor's browser only. A shared, saved version for a team needs the register to be its own claude.ai page with storage switched on; that is the next step, not part of this prototype.

## Files

| File | Role |
|---|---|
| `data/uc-labels.json` | One row per use case: label, deciding questions, basis, booklet reference, review notes. **Needs sign-off by the D7 owner.** |
| `data/reference.json` | Labels, dates, questions, items to check, vendor questions, operating models, country notes. |
| `data/radar.json` | The watch list. Add an entry only after checking it at the source. |
| `src/logic.js` | Label, role and item logic. No dependencies; also runs in Node. |
| `src/app.js`, `src/page.html` | The page. |
| `build.mjs` | Builds `index.html` (GENERATED) and checks the label file against the catalogue. |
| `tests/logic.test.mjs` | 99 checks: the booklet's A6 totals for rows that follow it, and the law-based changes. |

```bash
node tools/register/tests/logic.test.mjs
```

```bash
node tools/register/build.mjs
```

After building the register, rebuild the hub with `node tools/build-hub.mjs` only if `hub/hub-bar.html` changed.

## Known gaps

- Where the register departs from the booklet it relies on the 17 Nov text check; some of those points rest on Commission guidance the research could not open in full.
- Use-case ids are positional (`hr-2` = second HR use). The build fails if the catalogue order changes.
- The custom-tool check is a short triage, not the explorer's full wizard.
- Country research covers Germany, France, Spain, Sweden, Switzerland and the UK only.
- The 17 market uses come from search summaries of vendor and trade material, not verified at source. Three research items were left out: two hypotheses without a source, and guests' own AI agents (not a hotel tool).
