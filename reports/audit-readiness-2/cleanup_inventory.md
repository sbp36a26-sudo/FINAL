# Readiness 2.0: clean-up inventory and decisions (steps 1 and 2 only)

23 Nov 2026. Skill: `.claude/skills/clean-up/SKILL.md`, steps 1 (Inventory) and 2 (Decide). Read-only: nothing in `tools/` was changed.

**What was audited:** a snapshot of `tools/readiness-2/` taken at 13:37. At that time `index.html` was a fresh build of `src/`, and this was checked.

**Changes since the snapshot:** another agent has since started adding a PDF download. That work adds `src/pdf.js`, the BRIDGE and DOWNLOAD machines, and shared summary helpers in `logic.js`. Those two machines are listed in section 1 but were not audited.

**How the findings were checked:**
- Every finding marked "confirmed" was reproduced.
- Node probes loaded `content.js`, `logic.js` and `flow.js` the way `tests/load.mjs` does.
- Playwright drove a served copy of `tools/` (hub included) at 127.0.0.1:8810.
- The existing tests pass: logic 5,273, flow 13,936 and catalogue 131 checks, all green.

The probe scripts and their output are in the scratchpad, outside the project:
- `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/r2clean/node_probe.mjs`
- `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/r2clean/browser_probe.cjs`
- `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/r2clean/run4.txt`

## Verdict on the builder's claims (CLEANUP.md / README.md)

| Claim | Result |
|---|---|
| Nothing past 1a is reachable while Q1 = No: not through Next, history, a saved record or `send()` | **Holds.** Tried migrate × every step, `pop` × every target, every FLOW event, browser Back/Forward, a localStorage edit to `step: 'summary'` plus reload, and `send('pop','summary')`. Every one lands on `stop` or `q`. |
| A department outside its category or a use case outside its department is refused, from a click or from storage | **Holds.** A department change clears the use case. Forward after that change is placed back on `where`. |
| Reload returns to the same step; Back/forward moves between steps | **Partly.** Reload holds. Back/forward disagrees with the in-app Back (bug 2). Any hash change throws the person back to the start screen (bug 1). |
| Junk values are dropped from storage | **Partly.** A date that matches the pattern but does not exist is kept and printed as "45 undefined 2026" (bug 4). |
| A newer version is read for the fields this build understands | **True but lossy.** The record is then saved back as v1, and the unknown fields are dropped (bug 6). |
| A change in another tab is followed | **True.** The followed state is not written into history (minor: `history.state` says `needs` while the screen shows `start`). |
| Corrupt storage → fresh start | **True.** No console error. The corrupt value is overwritten by the first action, which is fine. |
| "None of these fits" → hand-over disabled with a reason | **True.** The button is disabled, and `send('check-one')` is refused. |
| Hand-over inside the hub, with the Readiness check tab not loaded yet | **Works.** The frame is created at `#use=fo-3`. Back returns to Readiness 2.0. |
| Hand-over while the Readiness check holds another check (gx-2) | **Works.** A new fo-3 check starts and the gx-2 check stays in its list (checks 1 → 2). No data is lost. |
| 390 px | **Holds.** No horizontal scroll on start, q, where, needs, summary (copy box open) or stop. No console errors. |
| Blocked storage: "the page still works, nothing is kept" | **True, but invisible to the person** (bug 3). The skill requires a visible "saved / not saved" state. |

## 1. Inventory

There are 18 machines. The first 16 were audited; numbers 17 and 18 are being built now and were not audited.

| # | Machine | Where | States | Events (who triggers them) | Impossible or stuck states today |
|---|---|---|---|---|---|
| 1 | **FLOW** (step), including the Q1 hard stop | `src/flow.js` `FLOW`, `flowNext`, `reachable`, `placeStep`, `reduce`; `src/app.js` `send` | `start`, `q`, `stop`, `where`, `needs`, `success`, `summary` | `begin`, `next`, `back`, `change`, `edit`, `restart` (buttons, AX `send`); `pop` (popstate) | None found. The Q1 stop is airtight (see the table above). |
| 2 | **Choice cascade**: area › department › use case, or "none" | `flow.js` `reduce` cases `cat`, `dept`, `use`; `ctxOf().whereDone` | `cat ∈ CATS ∪ ''`, `dept ⊂ cat`, `use ⊂ dept ∪ {'none', ''}` | Tile and radio clicks (step `where` only) | No impossible state. One oddity: "None" stays selected after an area and department are picked (P5). This is allowed by design. **Identity risk:** see bug 5 (ids are positions). |
| 3 | **Answers and Planned dates** (`Q`, `A`, `By`) | `flow.js` `reduce` cases `answer`, `by`; `migrate` | Each `Q` is `y`/`n`/`u`/unset. Each `A` is `y`/`pl`/`p`/`n`/`k`/unset. `By[id]` exists only while `A[id]` is `pl`. | Radio `change`, date `change` (own step only) | `By` accepts any `\d{4}-\d{2}-\d{2}`: `2026-02-31`, `2026-13-45` and `0000-00-00` are kept and printed (bug 4). |
| 4 | **RECORD persistence, version and migration** | `flow.js` `migrate`, `blank`, `copy`; `app.js` `load`, `save` | Absent → blank; v1; v missing (read as v1); v > 1 (downgraded); invalid (null → blank) | Page load; every accepted event saves | v2 is silently rewritten as v1 and its extra fields are lost (bug 6). `v: "1"` as a string is discarded. |
| 5 | **Storage availability** | `app.js` `storage` (`'ok'`/`'blocked'`), set in `load`/`save` | `ok`, `blocked` | Exceptions from localStorage | `blocked` is shown nowhere. The start screen still says "Your answers stay in this browser" (bug 3). |
| 6 | **History sync** (pushState/popstate) | `app.js` `afterMove` (push), `send('pop')`, the popstate listener, the initial `replaceState` | `history.state.r2 ∈ STEPS`, or null | Every step change pushes, **including in-app Back and Start again**. popstate → `pop` | (a) `state == null` (any hash edit, or a hub `open` with a hash) → `pop('start')`, which is then saved. (b) In-app Back pushes a new entry, so browser Back goes forward again (bug 2). |
| 7 | **Cross-tab follow** | `app.js` `storage` event listener | Following / not following | Another tab writes `hftp-readiness2-v1` | History is not replaced, so it can disagree with the screen. A `removeItem` in another tab is ignored. A page restored from bfcache misses events and can overwrite newer data (not reproduced; needs two tabs and bfcache). |
| 8 | **CONFIRM** (restart) | `flow.js` `confirmNext`; `app.js` `send` | `null`, `'restart'` | `restart`, `restart-yes`, `restart-no`; navigation and the storage follow close it | None. A stale yes is refused. |
| 9 | **Missing pointer** | `app.js` `ui.missing`, `firstOpen` | `null`, a question or item id, `'where'` | A refused Next; cleared by `answer`/`use` or by moving | None. |
| 10 | **Copy summary** (clipboard → toast, or copy box) | `app.js` `copySummary`, `ui.copy`, `toast` (3.5 s timer, display only) | `closed`, `toast`, `copybox` | `#copy`; navigation closes the box | None. The fallback works in headless and at 390 px. |
| 11 | **Folds** | `app.js` `ui.open` and the `toggle` listener | Open set | The user | None (display only). |
| 12 | **Progress bar** (derived) | `app.js` `header()` | `done`, `now`, empty per segment | Derived from the step | The current step shows as `done` on `where`, `needs` and `success`. Only `q` ever gets `now` (bug 7). |
| 13 | **Hand-over to the Readiness check** (cross-tool) | `app.js` `canCheck`, `checkHref`, `onClick` `check-one`; `hub/hub-bar.html` bridge `open` and `OPENABLE`; `readiness-check/src/check.js` `fromHash` | `disabled` (none or notTool), `link` (standalone), `message` (`IN_HUB`) | `#check-one` | Framed by a page that is not the hub (another origin): `postMessage` is dropped silently, so the click does nothing and nothing happens (bug 8). Use-case id drift sends the wrong tool (bug 5). |
| 14 | **Link to the catalogue** (cross-tool) | `app.js` `catLink`, `onClick` `catalogue`; catalogue `CatalogueRoute.parse` | `link` (new tab), `message` | "Sources in the Use-Case Catalogue" | Same dead click as bug 8. The `catch` is `/* ignore */`, with no link fallback. |
| 15 | **Hotel profile read** | `app.js` `hotelName` | Name or `''` | Read at render | Not refreshed when the profile changes in another tab (trivial). It is never written: confirmed. |
| 16 | **Page data load** | `app.js` top `try`/`catch` → `data-state="error"` | `ok`, `error` | Page load | None. |
| 17 | **BRIDGE** (hub ping/pong) | `flow.js` `bridgeNext`; `app.js` `host` | `none`, `pending`, `yes`, `no` | ping/pong, 12 s timeout as an event | **Not audited.** Being built by another agent. |
| 18 | **DOWNLOAD** (PDF) | `flow.js` `dlNext`; `app.js` `dlSend`, `saveFile` | `idle`, `making`, `waiting`, `saving` | `#pdf`, hub `download-result`, 2-minute timeout | **Not audited.** Being built. Fixed by that work: "Start with these one" became `firstLabel()`. |

### Confirmed bugs, with reproductions

1. **A hash change sends the person to the start screen, and it is saved** (Med).
   - Repro: seed a summary record and reload. Run `location.hash = 'x'`. The step becomes `start`, and after a reload it is still `start`.
   - Cause: the popstate listener maps `e.state == null` to `'start'`.
   - The same thing would happen to any hub `{hub:'open', tool:'readiness-2', hash}`: the hub allows it and nobody sends it today.
2. **In-app Back and browser Back disagree** (Med).
   - Repro: Start, five times Yes, Next (`where`), in-app **Back** (`q`), then browser Back. The page goes to `where`, which is forward.
   - `history.length` grows from 5 to 9 after three Next/Back cycles. Inside the hub, every one of those entries must be backed through before Back leaves the tab.
3. **Blocked storage is invisible** (Med).
   - Repro: make `Storage.prototype.getItem`/`setItem` throw `SecurityError`. `state().storage === 'blocked'`, yet no text anywhere says answers will not be kept, and the start screen still promises "Your answers stay in this browser".
4. **Impossible dates are accepted and printed** (Low).
   - Repro: `migrate({…, A:{b1:'pl'}, By:{b1:'2026-13-45'}})` → the action reads "(planned by 45 undefined 2026)".
   - `0000-00-00` → "0 undefined 0000".
   - `reduce('by', {date:'2026-02-31'})` is accepted → "31 Feb 2026".
5. **Use-case ids are positions (`<dept>-<n>`), so a catalogue insert re-points saved choices silently** (Med; cross-tool contract).
   - Repro: insert one use case at the top of Front Office. A saved `fo-3` ("Biometric face verification at check-in") then restores as "AI room assignment", the summary stays reachable, and **Check one tool in detail hands the wrong tool to the Readiness check**.
   - Removing a use case or moving a department is handled: the person is placed back on `where`.
6. **A newer record is downgraded on its first save** (Low).
   - Repro: a v2 record with `notes` → after one answer the stored record is `v: 1` and has no `notes`.
7. **The progress bar never marks the current step 2 or 3** (Low).
   - Repro: on `needs` the segments are `["done","done",""]`; on `where` they are `["done","",""]`.
8. **Dead hand-over click when the page is framed by a non-hub page** (Low).
   - Repro: a wrapper on another origin frames `readiness-2/index.html`. `inHub` is true. Clicking `#check-one` does nothing: the frame URL is unchanged and there is no error.
   - The catalogue link behaves the same way.
   - It does not happen in the published hub, but `IN_HUB = parent !== window` is too loose.

## 2. Decide

| # | Machine | Action | Reason |
|---|---|---|---|
| 1 | FLOW and Q1 stop | **Leave** | Already explicit: table, guards, one writer, exhaustive tests. The adversarial probes found no leak. |
| 2 | Choice cascade | **Name only** (+ fix 5) | Explicit in `reduce`. Only the identity of a saved use case is weak. |
| 3 | Answers and dates | **Leave** (+ fix 4) | Explicit. Needs a real calendar check only. |
| 4 | RECORD, version and migration | **Name only** (+ fix 6) | `migrate` exists. Add a "newer than me: read-only, don't overwrite" rule. |
| 5 | Storage availability | **Name only + visible state** (fix 3) | Two states, stable, but the user cannot see one of them. |
| 6 | History sync | **Make explicit** (fix 1 and 2) | Implicit, spread over `afterMove`, popstate and the initial replace. Two confirmed bugs. It interacts with the hub's joint history. |
| 7 | Cross-tab follow | **Name only** | Works. Document it, replace the history state on follow, and handle `pageshow` (persisted). |
| 8 | CONFIRM | **Leave** | Explicit and tested. |
| 9 | Missing pointer | **Leave** | Small and correct. |
| 10 | Copy | **Leave** | Correct. The timer is display only. |
| 11 | Folds | **Leave** | Display only. |
| 12 | Progress bar | **Leave** (+ fix 7) | Derived. A one-line fix. |
| 13 | Hand-over to the Readiness check | **Name only** (+ fixes 5 and 8) | A cross-tool contract. Already documented in `hub/CONTRACTS.md`. Needs an identity check and a fallback. |
| 14 | Link to the catalogue | **Name only** (+ fix 8) | Same as 13. |
| 15 | Hotel profile read | **Leave** | Read-only and harmless. |
| 16 | Page data load | **Leave** | Has an error state. |
| 17–18 | BRIDGE and DOWNLOAD | **Audit after that work lands** | They are explicit tables already. Check them against `readiness-check`'s identical machines, the hub `download` contract, and what happens when someone navigates away during `saving`. |

## Prioritised fix list

### High

None. The owner's hard rule (Q1 No stops) and data integrity within one catalogue version hold.

### Medium

**M1. History machine (bugs 1 and 2)**

The change, in `app.js`:
- Keep `history.state = { r2: step, d: depth }`.
- In-app **Back**: when the previous entry is that step (`d > 0`), call `history.back()` and let popstate run `pop`. Otherwise use `replaceState`.
- **Start again**: use `replaceState` (no push).
- popstate with a `null` or foreign state: ignore it, re-assert with `replaceState({ r2: rec.step, d })`, and do **not** move to `start`.
- Put the pure part (`histAction(ev, depth) → 'push' | 'back' | 'replace'`) in `flow.js`.

Acceptance:
- (a) Next to `where`, in-app Back, browser Back: the page leaves `q` for `start` and never returns to `where`.
- (b) Three Next/Back cycles do not grow `history.length`.
- (c) On the summary, `location.hash = 'x'` leaves the step on `summary`, and after a reload it is still `summary`.
- (d) In the hub: after the walk, one Back from the Readiness check returns to Readiness 2.0, and Back from the start of Readiness 2.0 leaves the tab.
- (e) The Q1 No probes still land on `stop` or `q`.
- (f) The existing walk stays green.

**M2. Use-case identity check (bug 5)**

The change:
- Save `useName` (the catalogue name) beside `use`.
- In `migrate`, if `CAT` has the id but the name differs, clear `use` (keep `cat` and `dept`) and place the person on `where`. Show a one-line notice: "The catalogue changed: please pick your use case again."
- Add `useName` to the record. The version stays 1: the field is optional, so this needs no migration.
- Long term: the catalogue, register and readiness check should move to stable ids (contract change in `hub/CONTRACTS.md`; their owners decide).

Acceptance:
- A Node test with a catalogue that has one use inserted at Front Office index 0: a saved `fo-3` with the old name restores to step `where` with `use: ''`, and the hand-over button is not offered.
- A saved record with the matching name is unchanged.

**M3. Visible "not saved" state (bug 3)**

The change:
- When `storage === 'blocked'`, show a persistent line in the header: "This browser is not keeping your answers. Use Copy summary or Print before you close the page."
- Hide "Your answers stay in this browser" on the start screen.
- Set `#app[data-storage]`.

Acceptance:
- With localStorage throwing `SecurityError`: the line is visible on every step, `data-storage="blocked"`, and the start screen does not make the promise.
- With normal storage the line is absent.

### Low

**L1. Real date check (bug 4)**

The change:
- In `flow.js`, add `validDate(s)`: the pattern plus a month of 1–12 and a day that exists in that month (`new Date(Date.UTC(y, m-1, d))` round-trip), and a year from 2000 to 2100.
- Use it in `reduce('by')` and `migrate`.
- Make `fmtDate` return `''` on an invalid date.

Acceptance:
- `2026-02-31`, `2026-13-45` and `0000-00-00` are refused by `reduce` and dropped by `migrate`.
- `2026-12-01` is kept and prints "1 Dec 2026".

**L2. Do not downgrade newer records (bug 6)**

The change:
- If the raw `v` is greater than `V`, set `readOnly`: show the record and do not save it.
- Show the line "This summary was saved by a newer version; changes here are not kept."
- Alternatively, write it under a separate key.

Acceptance: a v2 record with an extra field is still byte-identical in storage after one answer.

**L3. Progress bar (bug 7)**

The change:
- Segment `i === n` gets `now` on `q`, `where`, `needs` and `success`.
- All segments get `done` only on `summary`.

Acceptance: on `needs` the classes are `["done","now",""]`; on the summary they are `["done","done","done"]`.

**L4. Stricter in-hub test and fallbacks (bug 8)**

The change:
- `IN_HUB` becomes true only after the hub answers `ping`/`pong` (reuse BRIDGE: `yes`/`no` means hub, `timeout` means not hub). Until then, and on timeout, `check-one` and the catalogue link behave as plain links.
- The catalogue `catch` falls back to `window.open(href)`.

Acceptance:
- Framed by a page on another origin: `#check-one` navigates to `../readiness-check/index.html#use=fo-3` within 12 s, or immediately once BRIDGE is `no`.
- In the hub the behaviour does not change: the walk stays green.

**L5. Cross-tab follow keeps history in step (machine 7)**

The change:
- On a storage follow, call `replaceState({ r2: rec.step, d })`.
- On `pageshow` with `persisted`, re-read the record.

Acceptance:
- Two tabs: after tab B restarts, tab A's `history.state.r2 === 'start'`.
- A page restored from bfcache shows the other tab's newer answers.

## Not changed and not a bug

- The Readiness check replacing its open check on `#use=` from Readiness 2.0: the earlier check stays in its list (checks went from 1 to 2).
- "None" staying selected while a department is picked: it is allowed, and the summary is consistent.
- Print has no state.
