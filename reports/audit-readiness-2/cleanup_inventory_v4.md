# "Do you need AI?" v2.6: clean-up inventory v4 (with fixes, v2.6.1)

*24 Nov 2026. Scope: `tools/readiness-2/` at commit `eebd0d9` (v2.6: question 1 turned round with the one-time `qv` migration, new questions 3 and 4, store and file version 3, the detail layer drawn by the hub, frames cache-busted with `?v=<hash>`); its hub glue (`tools/hub/hub-bar.html`: `#hub-detail`, `{ hub: 'detail' | 'detail-closed' | 'detail-close' }`, `HUB_VER`); the Team tab reader `tools/readiness-check/src/team.js`. Skill: `.claude/skills/clean-up/SKILL.md`, all steps including fixing. Read first: `CLAUDE.md`, the tool's `README.md`, `CHANGELOG.md` (v2.5 to v2.6), `CLEANUP.md`, `cleanup_inventory_v2.md`, `_v3.md`, `tools/hub/CONTRACTS.md`. Nothing committed, pushed or published.*

## How this was checked

- Read every source file in scope and the v2.6 diff; ran every suite on v2.6 first (all green).
- Each suspected fault became a test before any fix: unit `tools/readiness-2/tests/v261.test.mjs`, browser `tools/readiness-2/tests/browser/v261.cjs` (Playwright, `tools/` served on 127.0.0.1:8815, desktop 1280 and phone 390, standalone and inside the hub). On v2.6 the unit file failed 19 of 26 and the browser file 12 of 39 (it had to press the stale layer's Close button to go on at all). After the fixes both pass.
- Probe kept in the scratchpad (not in the repo): `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/c4/probe.mjs` (every use case's layer through the hub's `hubDetail`: all 99 pass; the longest source name is 392 of the 400 characters allowed).

## 1. Machines

The machines of `CLEANUP.md` (FLOW, STORE, CONFIRM, BRIDGE, DOWNLOAD, SHARE, HISTORY, TABS, COPY BOX, old answer per question, since last time) still hold. What v2.6 changed:

| # | Machine | Where | States | Events / who | Impossible or stuck state on v2.6 | Decision |
|---|---|---|---|---|---|---|
| 1 | **DETAIL layer across the frame boundary** (two halves of one machine) | frame: `app.js` `ui.layer = null \| { use, from, step, check, hub }`, `openDetail`, `syncDetail`, `closeDetail`; hub: `detail = { open, tool, id, win, el }`, `openHubDetail`, `closeHubDetail` | closed · open here (standalone dialog) · open in the hub | open: "Details and sources" / "More detail"; close: Close, Esc, dimmed area, hub tab switch (hub side, `detail-closed` back); step or check change (frame side) | Frame closed, hub open: after Back, a `#use=` link or another tab removing the check, the frame dropped `ui.layer` in `closeDetail()` and never sent `detail-close` (only `syncDetail` did, and it no longer saw a layer). Also hub open over a page that reloaded under it (B1, B2) | **Make explicit**: one rule on each side. Frame: every drop the hub did not start sends `detail-close`. Hub: drops on its own closes, the frame's `detail-close`, and a new `ping` from that frame |
| 2 | **STORE versions across tabs** | `flow.js` `migrate` (`info.newer`, new `info.older`), `mergeTabs`; `app.js` `follow()` | same version · newer elsewhere · older elsewhere | another tab's `storage` event, `pageshow` from the back-forward cache | A newer store from another tab was merged and written back over (B3). An older (v2.5) page that was already open writes version 2 without `qv`; this page turned question 1 round a second time and dropped questions 3 and 4 on its own checks (B4) | **Make explicit**: `follow()` turns read-only on newer; `mergeTabs(..., { older })` keeps this tab's checks |
| 3 | `qv` migration (per record) | `logic.js` `legacyQ`, `flow.js` `cleanRec` (`legacy = r.qv !== QV`), `Qnew` | old meaning · current (`qv: 2`) | load, file open, import, v1 record, other tab | None found: one reader for every path, `copy()` always writes `qv`, a migrated store read again is not turned twice, a stop stays a stop, a result reopens on step 2 | Leave |
| 4 | Team tab copy kinds | `team.js` `isDyn`, `dynRec` (`s.qv === DL.QV`), `dynGone` | v3 copy · dyn (qv) · dyn (no qv, old meaning) · dyn of a gone use | list, select | None found. A pre-v2.6 copy is recomputed with questions 3 and 4 unanswered; when the verdict moves the "hotel saw" line says so | Leave |
| 5 | Frame address (cache-busting) | `build-hub.mjs` `HUB_VER`, `hubSrc`; frame `histWrite` keeps `location.search` | — | build, `open` messages | None: `#use=` on the versioned address is a hash change; the frame's history entries keep `?v=` | Leave |
| 6 | Stop screen after Q1 Yes, PDF | `vStop`, `pdf.js` | — | — | None (stop PDF one page, "Because you answered Yes") | Leave |

## 2. Bugs (High 1 · Medium 2 · Low 1)

### High

**B1. The hub's detail layer stays open over the tool after the tool's own step or check changed; Esc no longer closes it.**
- Repro (`v261.cjs` B1, desktop and phone): in the hub, step 4, press "Details and sources" on gx-2 → `#hub-detail[open]`. Browser (or phone) Back → the tool is on step 3 and `Readiness2.state().detail === null`, but the hub's layer is still open over step 3 (`HFTPHub.state().detail = { tool: 'readiness-2', id: 'gx-2' }`). The frame took focus (`#view`), so Esc goes to the frame, not the hub's dialog; clicks on the tool are intercepted by the layer (Playwright: "`<dialog id=hub-detail>` intercepts pointer events"). The same after a `#use=hr-2` link (a new check under the old layer) and after another tab removed the open check.
- Cause: `closeDetail()` (called by `afterMove` and `follow()`) cleared `ui.layer` before `render()`, so `syncDetail()`, the only place that sent `{ hub: 'detail-close' }`, never saw a hub-drawn layer to drop.
- Fix (`src/app.js`): `closeDetail(moved, noFocus, fromHub)` sends `{ hub: 'detail-close' }` whenever the layer was hub-drawn and the hub did not start the close; the `detail-closed` handler passes `fromHub = true` (no echo). Shapes unchanged.
- Tests: `v261.cjs` B1 (Back, Forward, `#use=`, another tab removing the check; focus lands on `#view` in the frame; the layer opens again and Esc returns focus to the opener), `v261.test.mjs` B1.

### Medium

**B3. A page open while another tab saves a newer store writes its own older store over it.**
- Repro (`v261.cjs` B3): page A on step 2; page B (same browser) saves the store as version 4; A answers a question → `localStorage` is version 3 again (B's data lost), A never says its changes are not kept.
- Cause: `follow()` merged `readStore()`'s result without looking at `info.newer`; only `load()` set `storage = 'newer'`. The v2.6 note "so a v2.5 page in another tab treats the store as newer and never writes it back" was true only for pages loaded after the write.
- Fix: `follow()` sets `storage = 'newer'` (then `save()` writes nothing and `#not-saved` shows `C.NEWER`). Tests: `v261.cjs` B3, `v261.test.mjs` B3.

**B4. A v2.5 page already open in another tab turns question 1 round a second time on this tab's checks and drops their questions 3 and 4.**
- Repro (`v261.cjs` B4, `v261.test.mjs` B4): this tab holds check Y (Q1 No, Q3 and Q4 Yes, `qv: 2`) and has another check open. What an open v2.5 tab writes after it merged this store: version 2, records without `qv`/`Qnew`. This tab's `follow()` reads it through `migrate` → Y becomes `{ q1: 'y', q2: 'y', q5: 'y' }` (a stop, questions 3 and 4 gone) and the next save keeps that.
- Cause: a v2.5 page's `copy()` drops fields it does not know; a record without `qv` is indistinguishable from a genuinely old one.
- Fix: `F.migrate` reports `info.older` (store version below 3); `F.mergeTabs(mine, theirs, { older: true })` keeps every check this tab holds and takes only checks it does not know (those were made in the older page, so the one-time turn is right); no "changed elsewhere" line for a stripped copy. Not fixable from here: what the old page itself shows and saves to files (it treats v2.6 answers in the old meaning); it disappears once the old tab is reloaded (the hub's `?v=` addresses load the new page).
- Tests: `v261.test.mjs` B4 (migrate flags; merge keeps Q1 No and Q3/Q4; open check kept; a check only the old tab knows is taken and turned once; two current tabs merge as before), `v261.cjs` B4.

### Low

**B2. The hub's layer stays up when the frame under it reloads.**
- Repro (`v261.cjs` B2): hub, layer open on gx-2, the frame reloads → the new page has no layer, the hub still shows the old one (`HFTPHub.state().detail` set).
- Fix (`tools/hub/hub-bar.html`): a `ping` from the frame the layer belongs to (every page pings once on load) closes it quietly with focus back into the frame. The frame's `load` event was not used: it can fire after the person opened the layer while fonts still load.
- Test: `v261.cjs` B2; `v261.test.mjs` B2.

### Checked, no fault (guards added where cheap)

- **G1** every one of the 99 use cases' layer passes the hub's `hubDetail` (a refused message would leave the frame holding a layer nobody draws): `v261.test.mjs` G1.
- **G2** two frames: `detail-close`, `ping` and `detail` from the hidden register frame leave the readiness-2 layer as it is: `v261.cjs` G2.
- Malformed or oversized `detail` messages and messages not from a hub frame (v26.cjs), tab switch, Esc / Close / dimmed area with focus return (v26.cjs), phone sheet geometry, print (`dialog.detail` hidden; the hub's layer is never in the frame's print), the stop screen and its PDF, file version 3 refused by an older page and version 2 files turned once, the Team tab's `qv` reading.

## 3. Dead code removed and stale docs fixed

- `tools/register/src/app.js`: `host.hub` (set on `pong`, read nowhere since the v2.6 removal of the link bridge); register rebuilt.
- Already gone in v2.6 and confirmed absent in sources and built pages: the hub's link panel and `link` message, `hubLinkUrl`, the assistant-only condition (`ASSIST_LINE`, `#assist`, `Q4_NO_HOLDS_TOP`), the must-have 7 consistency line (`CONSIST.m7`, `#consist-m7`).
- Stale text: README (assistant-only rule and `Q4_NO_HOLDS_TOP: false`, the must-have 7 line, file `v: 2`, the claim about open older tabs, `rules v2.5` heading, the v251 browser test description), `tools/hub/CONTRACTS.md` (bridge row still listed `link`; the detail section now says when each side closes), `CLEANUP.md` (store `v: 2`, "Q1 is No" guards), app.js header comments (store version 2, "links become hub messages", "Q1 No goes on to the stop screen", file `v: 2`), logic.js `consistLines` comment (`m7`), `tests/v251.test.mjs` header.
- Kept on purpose: `R2Logic.sourceRow` (raw catalogue shapes; the page uses `sourceRowItem`, the v251 test still proves every raw source through it); the first-`pong` `render()`.

## 4. Changed test expectations

- `tests/v26.test.mjs`: the hub's close is read as `closeDetail(false, m.focus === false, true)` (the new third argument marks it as the hub's own, so it is not echoed). No other expectation changed.

## 5. Final test counts (all green)

See the CHANGELOG v2.6.1 entry and `CLEANUP.md`; counts below are from the final run after the rebuild (`node tools/readiness-2/build.mjs`, `node tools/register/build.mjs`, `node tools/build-hub.mjs`).

Unit: readiness-2 logic 7,477 · flow 5,986 · questions 917 · pdf 714 · build 120 · v21 1,205 · v22 818 · v23 264 · v25 115 · v251 83 · v26 90 · **v261 26** (new). Hub 30. Readiness check flow 101, logic 35, mustfirst 22, planned 49, v4 81. Register logic 143, machines 64. AI Act guide 2,644. Catalogue 328. Assessment 12.

Browser (Playwright, 1280 and 390 px, standalone and in the hub; `tools/` served on 8815, 8817 and 8831, servers stopped afterwards): readiness-2 `walk.cjs` 862 · `v21.cjs` 616 · `v23.cjs` 100 · `v25.cjs` 137 · `v251.cjs` 50 · `v26.cjs` 91 · **`v261.cjs` 45** (new). Team tab (readiness-check) `mustfirst.cjs` 238 · `planned.cjs` 86. No page errors. Screenshots the suites retake were restored to the committed files (no visual change).
