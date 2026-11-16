---
description: Turn pasted raw content into a finished report spread (YAML + build + PNG)
argument-hint: <paste notes, a draft paragraph, numbers with sources>
---

You are adding one spread to the SBP Group 36 / HFTP report in Report Studio. The raw content is:

<raw>
$ARGUMENTS
</raw>

The brand guidelines in `brand/brand.json` (with the rulings in `brand/decisions.json`) are law. You only write content. You never change a component, layout, token, size, colour or spacing to make content fit.

## 1. Read before writing
- `brand/brand.json`: `content_rules`, `layout_library`, `image_layouts`, `sections`.
- `layouts/<id>.schema.json` for the layout you pick. The `maxLength`, `maxItems` and `x-maxTotalChars` values are hard limits, measured by rendering.
- `content/report.yaml` and one existing file in `content/pages/` as a format example.

## 2. Choose the layout
Pick the best layout from the library and say why in one sentence:
- **lead2col**: one finding backed by headline figures (1–4) and a bar chart (2–5 rows).
- **cards**: exactly six parallel items (use cases, departments, countries).
- **zquote**: an argument in running text with one strong quote.
- **halfbleed / strip / inset / quote**: only if the user supplies photos, or agrees to placeholders. strip needs 3 square (1:1) photos; halfbleed and divider need A4 portrait (1:1.414); inset needs 4:3; quote needs 2:1. The quote band allows no numbers.

If the content is two findings, propose two spreads. Each page tells one finding: the title states it, the page proves it.

## 3. Sources: ask, never guess
Every number (digits, %, €, x) needs a **source** and a **base** (who was asked, how many, how weighted) on the same figure, on its body block (`source`/`base`), or next to the field (`lead_source`/`lead_base`, `title_source`/`title_base`, `quote_source`/`quote_base`).
- If any number is missing its source or its base, STOP before writing any YAML. List each such number and ask the user for it (use AskUserQuestion when available). Do not infer a base from the source name, and do not drop the number silently to avoid asking.
- Wikipedia is never a source. If the raw content cites it, ask for the primary source.
- Never write a figure without its source.

## 4. Write the YAML
- File: `content/pages/<section number>-<n>-<short-slug>.yaml`, with `section:` exactly as listed in brand.json (e.g. `"2 Key findings"`).
- Stay within every limit. **Cut, never pad.** Do not add words, figures or claims that are not in the raw content. Cut repetition first, then secondary detail, then whole points (the user can split the page).
- Keep a record of everything you cut, verbatim.
- British spelling. Sentence case everywhere (kickers may be one or two words). Crisp, factual consultancy tone.
- Chart rows: value as a number; unit in `chart.unit` (default "%"); mark the row to stress with `highlight: true` (otherwise the largest is highlighted).
- Add the file to `content/report.yaml` under its section, in reading order.

## 5. Build and check
1. Run `NO_OPEN=1 npm run page -- content/pages/<file>.yaml`.
2. If it reports problems, fix them by cutting content or correcting the YAML. Never by editing CSS, tokens, layouts or schemas. Re-run until "All checks passed".
3. Run `npm run build` so the PDF, the contents spread and the page numbers update.

## 6. Report back
- Show the PNG: read `out/png/<file>.png` to look at it, check it yourself (nothing cut off, the title states the finding), then give the user the path.
- Name the layout chosen and why (one line).
- **What I cut**: a bullet list of every sentence or figure removed or shortened, verbatim, so the user can restore it elsewhere.
- Any open question (missing source, photo needed).
