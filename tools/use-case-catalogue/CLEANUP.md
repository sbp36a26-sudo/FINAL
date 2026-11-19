# Clean-up: Use-Case Catalogue (19 Nov 2026)

Scope: `index.html` only. The `<script id="data">` block (read by `tools/register/build.mjs` and its tests) is unchanged, byte for byte. No visible wording changed except one new error message (data cannot be read).

## Inventory

| Machine | Where | States | Action | Why |
|---|---|---|---|---|
| Route / view | `render()`, `go()`, hash | overview, area (+ dept), companies (+ dept, text), hotels (+ dept, text), sources (+ source row), invalid | **Made explicit** | Three reproducible bugs (below); every other flow hangs off it |
| Department memory per area | `lastInArea` | none or one dept id per area | Name only (`CatalogueRoute.areaDept`, tested) | Small and correct; now guarded so a remembered dept from another area is ignored |
| Companies filters | `#codept`, `#coq` | dept x search text | Made part of the route | Was half in the hash (dept) and half only in the DOM (search), so Back and reload disagreed with the list |
| Hotel-group filters | `#hgdept`, `#hgq`, `#hgown` | dept x text x own-AI | Dept and text in the route; own-AI left in the DOM | Own-AI is a visible select used only inside the view; links that open a group still reset it |
| Last list per tab | `lastList` (new) | last companies / hotels route | New, small | Keeps the old behaviour that a tab click returns to the list as the reader left it, now with a truthful URL |
| Citation pop-up | `showPop` / `hidePop`, `pop.dataset.k` | hidden, open for source K | Leave | Local; closes on any render, outside click and Escape |
| Data load | top of main script | ready, error | Made explicit (error) | A damaged data block left a blank page with no message |

## Router (one place)

`<script id="logic">` holds `CatalogueRoute`: pure `parse(hash, ctx)`, `format(route)`, `areaDept(route, ctx, memory)`, `same(a, b)`. The route table is the comment at the top of that block:

`'' | overview`, `sources`, `src-<K>`, `<deptId>`, `area:<Area>`, `companies[:<deptId>][:<text>]`, `hotels[:<deptId>][:<text>]`, anything else = invalid, replaced (not pushed) by `#overview`.

The page writes the hash in two ways only: `go(hash)` pushes (links, tabs, pager); `replaceRoute(route)` rewrites the current entry when a filter is typed or picked.

## Bugs found and fixed

1. **Back trap on an invalid hash.** Open `#overview`, then `#nonsense`: the page pushed `#overview` on top; Back returned to `#nonsense`, which pushed again, so Back could never leave (also inside the hub iframe). Now replaced, not pushed.
2. **`#companies:<Name>` ignored.** `#companies:Duetto` showed all 157 companies (the suffix was only read as a department id). Company links also left the name out of the URL, so reload lost it. Now the suffix is a department id or a name / search text; company links write `#companies:<Name>`.
3. **Controls and list disagreed.** On `#hotels:Scandic Hotels`, pick "Builds its own" (0 groups), then click Scandic Hotels in the table: the select reset to "All groups" but the list stayed at 0, because `go()` compared the encoded hash with the plain name, so it did not re-render. `go()` now compares decoded hashes.
4. **Malformed hash crashed render** (`#%E0%A4%A` threw "URI malformed"). Now invalid, goes to overview.
5. Smaller: `#hotelsXYZ` counted as the hotels tab (prefix match); `#src-S1` opened in a new tab went to overview instead of the source row; a bare `#hotels` kept a stale search.

## AX handles

- `body[data-state]` = `overview | area | companies | hotels | sources | error`; `body[data-area]`, `body[data-dept]`.
- `window.Catalogue.state()` returns `{view, area, dept, src, hash, filters, popup}`. `filters` is `{dept, q, shown}` (companies) or `{own, dept, q, shown}` (hotels), else null; `popup` is the open source code or null.
- `window.Catalogue.go('#fo')` navigates; `window.Catalogue.routes` is the router.
- Existing stable hooks: `data-tab`, `data-go`, `data-co`, `data-cos`, `data-hg`, `data-hgd`.

## Tests

- `node tools/use-case-catalogue/tests/route.test.mjs`: 314 checks covering every route, every department and area, area memory, every company and hotel-group name round trip, and the formerly possible bad states (prefix match, malformed, unknown area or source).
- Browser (Playwright, desktop 1280 px and phone 390 px): 196 checks covering every tab and department, the deep links above, invalid and malformed hashes, Back/forward, reload, filter typing, links from department cards, pop-up and Escape, no horizontal scroll at 390 px, and the data-error state. No console errors. External requests: only Google Fonts, which the page already loaded. The script was a one-off and is not in the repo.
- `tools/register/build.mjs` and `tools/readiness-check/build.mjs` still build; register tests pass (138).

## Left alone

Own-AI filter not in the URL (see above). Pop-up position does not follow on resize (it closes on the next click). Layout, wording and data.
