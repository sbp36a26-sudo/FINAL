# Readiness check: clean-up of implicit state machines (19 Nov 2026)

Scope: `src/check.js`, `src/team.js`, `src/store.js`, the two page shells and `build.mjs`. `src/logic.js` (scoring) is unchanged; every scoring output is the same. The machines now live in **`src/flow.js`** (pure, no DOM, injected by the build at `/*__FLOW__*/` and loaded by the Node tests).

Unchanged contracts: hub messages (`{hub:'db', op:'probe'|'list'|'set'|'delete'}`, `ping`/`pong`, `download`/`download-result`, `open`), storage keys `hftp-readiness-mychecks-v1`, `hftp-readiness-current-v1`, `hftp-readiness-checks-v1`, `hftp-hotel-profile-v1`, the `#use=` hash and the saved-file format (`kind: 'hftp-readiness-check', v: 3`).

## Inventory

| Machine | Where | States | Action | Why |
|---|---|---|---|---|
| FLOW (journey) | `check.js` `st.step`, was written in 10 places | `start`, `prep`, `0`–`5`, `review`, `result` | **Made explicit**: table `FLOW` + `flowNext()`; `send(event)` is the only writer; `safeStep()` for anything restored | Core flow; impossible steps crashed the page |
| CONFIRM | `confirmRm`, `confirmNew`, unused `confirmPick` | none / `new` / `rm(id)` / `file(id)` | **Made explicit**: `confirmNext()`; one open at a time; every navigation closes it | Stale confirmations survived navigation |
| SHARE | `st.sharedAt` + store mode, no in-flight state | `none`, `sending`, `shared`, `withdrawing` (+ derived "out of date") | **Made explicit**: `shareNext()`; in-flight state is per check; result written to the check it was sent for | Double sends, no feedback while waiting |
| STORE mode | `store.js` `mode` | `idle` → `probing` → `shared` / `local` | **Named**: documented, `RCStore.state()` added; page re-renders when known | Small and correct; was invisible |
| BRIDGE (hub downloads) | `check.js` `host.state` + 12 s timer | `none`, `pending`, `yes`, `no` | **Made explicit**: `bridgeNext()`; timeout is an event; one download per kind in flight (2 min limit) | Repeated clicks opened repeated hub dialogs; no answer = silence |
| TEAM | `team.js` `loading`, `err`, `confirmDel` | phase `loading`/`ready`/`empty`/`error`; del `null`/`confirm`/`deleting` | **Made explicit**: `teamNext()`; stale list answers ignored | Confirm survived Refresh; double delete; racing loads |
| RECORD (persisted check) | `mine` map, CUR key, files | record version 1 (no `rv`) → 2 | **Versioned migration** `migrate()`: validates every field, keeps unknown fields, never deletes records it cannot open | Damaged data opened into impossible states |
| Tool choice | `unpick` cleared `st.useId` | chosen / choosing | Folded into `ui.choosing` | Data-loss bug below |
| PDF build | none | idle / making | `ui.pdf` guard | Double click built two PDFs |
| Toast timer, search box, profile sync | various | – | **Left** | Local, display-only, correct |

## Bugs found and fixed (reproductions against the build of 18 Nov)

1. **Answers carried into another tool, earlier check overwritten.** Finish a check for a tool, Back to start, "Choose another tool", pick a different tool: the old answers moved to the new tool under the same id and the earlier check disappeared. Now the chosen tool is kept while choosing; picking another one starts a new check.
2. **Crash on a damaged step.** A saved step outside the list (e.g. `42`) threw in `vStep` and left a blank page. Now `safeStep` opens on start.
3. **Confirmations left open.** "Start new?" stayed open after going to Update open items and back; "Remove?" and "Start new?" could both be pending. Now one confirm, closed by any navigation; `yes` without a matching `ask` does nothing.
4. **Older file silently replaced a newer copy.** Opening a saved file of a check this browser holds in a newer state overwrote it. Now it asks ("Open the file anyway" / "Keep the copy in this browser").
5. **Back after "Start a new check" did nothing useful** (history entries carried only the step). Entries now carry the check id; Back reopens the earlier check.
6. **Double share / double delete / racing Refresh.** Share and team delete had no in-flight state. Buttons are now disabled with "Sending…", "Withdrawing…", "Deleting…"; a list answer older than the latest Refresh is ignored; Refresh closes a delete confirm.
7. **Shared copy out of date with no sign.** After sharing, changed answers gave no hint. The panel now says so and highlights "Send updated copy" (`sharedSig`).
8. **Withdraw could claim success in the wrong store.** A copy shared from the hub, withdrawn outside it, said "withdrawn". Now refused with an explanation (`sharedMode`).
9. **Removing a shared check orphaned its copy without warning.** The remove confirm now says the shared copy stays until withdrawn.
10. **Share panel never learnt the store mode** (the first render happened before the probe answered). It now re-renders when the probe settles.

## AX handles

- `#view[data-state]`: `start | prep | 0–5 | review | result`; also `data-confirm` (`none|new|rm|file`), `data-share-state` (`none|sending|shared|withdrawing` + ` stale`), `data-choosing`. `body[data-store]` (`idle|probing|shared|local`), `body[data-bridge]` (`none|pending|yes|no`).
- `window.ReadinessCheck.state()` returns `{ step, id, useId, confirm, choosing, share, shareStale, sharedAt, store, bridge, pdf, snaps, checks }`, a snapshot copy. `record()` returns a deep copy of the check. `send(event)` takes `prep | begin | back | next | review | result | edit` and returns false if not allowed. `events()` lists the allowed events.
- `window.ReadinessTeam.state()` returns `{ phase, del, selected, count, old, error, store }`.
- Stable ids: `go-prep`, `share-btn`, `unshare`, `new`/`new-yes`/`new-no`, `rm-yes`/`rm-no`, `file-yes`/`file-no`, `del`/`del-yes`/`del-no`.

## Proof

- `node tools/readiness-check/tests/logic.test.mjs`: 34 passed (unchanged).
- `node tools/readiness-check/tests/flow.test.mjs`: 70 passed. Covers every transition, every guard, and each old impossible state.
- Playwright (Chromium; desktop 1280 px and phone 390 px; 54 checks): restored a check made by the **old build** (same id, step, answers, proofs, snapshots); walked start → prep → 6 steps → result; review; reload mid-flow; Back/forward; PDF and Save as file; open file (newer-copy confirm, bad file); share in local mode, stale, withdraw; start new (cancel/confirm); remove (keep/remove); `#use=`; damaged storage; team page list, confirm, refresh, delete; and inside a fake hub frame: shared store, one `db:set` despite a double click, one download despite a double click. No console errors and no horizontal scroll at 390 px. The only external request is the existing Google Fonts link in the page shell (blocked in the test). This was already there and is allowed by the artifact rules.

## Left alone

- Two tabs open at once can overwrite each other's `mine` map (last write wins). This is rare and needs a storage event merge; noted for later.
- Data-notice placeholders and the D7 legal wording are still open (see README).
