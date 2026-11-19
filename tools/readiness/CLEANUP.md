# Clean-up: Hotel AI Readiness Tool (legacy, 19 Nov 2026)

This page is legacy. The team page still links to it (`readiness-check/src/team.js`). The guided client check that replaces it is in `tools/readiness-check/`. So the full inventory is below, but only real impossible or stuck states were fixed, with minimal changes. The `<script id="cat">` and `<script id="rdy">` blocks (read by `tools/readiness-check/build.mjs`) are unchanged, byte for byte. No visible wording changed.

## Inventory

| Machine | Where | States | Action | Why |
|---|---|---|---|---|
| Route / view | `render()`, `go()` | start, usecases, dept-X, uc-X, assess, assess-X, framework, type-aN, areas, area-X, companies, companies-X, hotels, sources, src-K; invalid = `location.replace('#start')` | Leave | Already validated and replace-based (no Back trap). Tested for Back/forward, reload and invalid hashes |
| Current assessment | `CUR` | null or a use-case id | Name only | `#assess` shows the last `CUR`; on reload it falls back to the most recent assessed use case. This is a sensible state, not a stuck one |
| Stored answers | `STORE`, key `hotel-ai-readiness-v1` | per use case `{a:{code:y/p/n/na}, t}` | **Restore check added** | A damaged entry (for example `{t:5}` without `a`) made `setAns` throw on the first answer; invalid answer values were counted as answered |
| Reset confirmation | `resetArm` | not armed, armed for use case X | **Fixed** | Confirmation could be skipped (below) |
| Use-case filters | `F` + `syncFilters()` | dept, type, text, intensity set, add-on set | Leave | One object, one sync function; the dept is in the hash, the rest stays while you are in the view |
| Open use-case cards | `OPEN` set | ids | Leave | Local; it only affects which cards are expanded |
| Radio un-select | `downOn` (mousedown, then click) | none, pressed-on-checked | Leave | Local and correct |
| Downloads bridge | `DL` | unknown, available, unavailable | Leave | Buttons stay hidden until available; on failure they hide again with a message |
| Companies / hotel-group filters, pop-up | DOM selects, `pop` | as in the catalogue | Leave | Legacy copy of the catalogue views; the catalogue's router fix was not ported, to keep changes minimal |

## Bugs found and fixed

1. **Reset could clear all answers with one click.** Reproduction on the old page: open `#assess-rm-1` with answers, click Reset answers (label changes to "Click again to clear all answers"), change any answer (the result panel re-renders and the button reads "Reset answers" again), click Reset answers once: all answers were gone. Also: arm Reset on one use case, open another within 4 s, click Reset once: the other use case was cleared. Now the arm is tied to the use case (`{id, at}`) and any re-render of the result disarms it.
2. **Damaged saved data could crash answering.** Entries without an answer object, or with values other than y/p/n/na, are cleaned when the page loads. Valid data from the old version restores unchanged, and the cleaned data is saved on the next change.

## AX handles

No new handles (legacy). Existing stable hooks: `data-tab` (routes above), `data-uc`, `data-q`, ids `#breset`, `#bcopy`, `#apick`, radio names `q-<code>`.

## Tests

Browser (Playwright, desktop and 390 px): 53 checks covering every tab, department filter and hash, opening a use case, assessing, the result, Back/forward, reload with answers kept, an invalid hash, a source link, the companies deep link, the reset confirmation (both reproductions above now keep the answers, and a real double click still clears), restore from old-version data with damaged entries, and no horizontal scroll. No console errors. External requests: only Google Fonts, which the page already loaded. The same reset script fails on the old page (both reproductions). `tools/readiness-check/build.mjs` still builds.
