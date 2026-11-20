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

---

# v4 pass (20 Nov 2026): what changed in the machines

Scope: the build ruling in `reports/Council - readiness check audit.md`, section A. Scoring changed this time (rules v4), so `src/logic.js` is no longer "unchanged"; see `CHANGELOG.md`. The clean-up rules were followed: explicit states, one writer, tests for every transition, versioned data, browser proof.

| Machine | Change | Why |
|---|---|---|
| FLOW | New event **`home`**: from `prep`, `0`–`5`, `review`, `result` to `start` (header link "Your checks"). Still only `send()` writes `st.step`. 10 new flow tests. | A returning person could not reach the list of checks from the result (J25) |
| START GATE (was a disabled button) | **Made explicit**: `missing()` lists what is missing (`type`, `tool`, `stage`); `ui.missing` is set only by pressing "Next" with something missing and cleared by any navigation. The FLOW guard is unchanged: `prep` is still refused until ready. | The grey button never said which field was missing (J2) |
| MUST-HAVE (per question) | **Made explicit** in `score()`: `yes` (in place) / `unconf` (Yes, note missing) / `gap` (not in place) / `unknown`. Before, "Yes without a note" was folded into `gap`. | A Yes was shown as "Not met" (F12, J11) |
| ANSWER validity | A stored answer this tool no longer offers (`none` on D5a/D5b for personal-data tools; "Doesn't apply" on a protective question) is kept in storage and scored `unknown` with `stale: true`. Never deleted. | F01; rules changes must not break saved checks |
| REVIEW (update screen) | **Made explicit**: `ui.review = { id, codes, was }` is taken once on entry and dropped on any navigation; a question is `open` or `done` (greyed, "Undo" restores the entry answers). | Answered questions vanished with no undo (J26) |
| RESULT ROWS | `ui.open[row]` holds which collapsed rows are open; written only by the `toggle` listener, cleared on navigation. | Re-renders (sharing, notes) must not close what the person opened |
| NOTE FIELD | `ui.touched[code]`: the hint is grey until the field was left with too little; updated in place, never by re-rendering on blur (a re-render on blur could swallow the click on "Next"). | J11 |
| SHARE | Unchanged machine. New constant `SHARING_ON` (true): when false, `share` is refused before the machine and the panel says so; `withdraw` still works. | Owner's decision: sharing stays on, one switch for later |
| RECORD | Unchanged (`rv: 2`). Snapshots: a new one is taken when the rules version differs from the last one, so a v3 result is never shown as the current one. | Honest history after a rules change |

## AX handles added

- `ReadinessCheck.state()` also returns `missing` (on start), `sharing`, `rules`. `send('home')` is allowed from every screen but start.
- Stable ids added: `home`, `primary` (the one primary button of the result), `begin-top`, `note-save`, `undo-<code>`, `verdict` (`data-level`), `vsent`, `count`, `plan`, `send`, `mychecks`, `picked`, `pickcount`, `stepfoot`, `nh-<code>` (note hint), `stage-<key>`. Result rows: `details[data-row=must|areas|vendor|legal|owner|next|share|method]`. Action-plan groups: `.agroup[data-group=must|note|vendor|find|close]`.
- All earlier ids still exist (`go-prep`, `share-btn`, `unshare`, `new`/`new-yes`/`new-no`, `rm-yes`/`rm-no`, `file-yes`/`file-no`, `o-ask`, `o-cost`, `o-by`, `n-when`, `n-date`, `share`). `go-prep` is no longer disabled; `share-btn`, the owner fields and the reminder fields now sit inside closed rows (open the row first).

## Proof (v4)

- `tests/logic.test.mjs` 35 passed; `tests/flow.test.mjs` 80 passed; `tests/v4.test.mjs` 81 passed (65 of them fail on the v3 rules, which is the point).
- Playwright, `tests/browser/walk.cjs`: 197 checks at 1280 px and 390 px (touch): start gate, search, prep, steps, notes, result for each verdict, review with Undo, new check, return visit, a record and a file saved by the **v3 build**, share and withdraw in local mode, the fake hub frame (one `db:set` despite a double click, one `db:delete`, shapes unchanged), PDF, team page. No console errors, no horizontal scroll, no control under 44 px on the phone, the only external request is the existing Google Fonts link.
- Still left alone: two tabs overwriting each other's `mine` map.

---

# Must-haves first (20 Nov 2026): what changed in the machines

Scope: the owner's request to ask the must-haves first. Scoring unchanged (rules stay v4). The clean-up rules were followed: one table, one writer, guards tested, saved data placed by a pure function, browser proof including a check saved by the old build.

| Machine | Change | Why |
|---|---|---|
| FLOW | New state **`'must'`** (step 1) before the area states `0`–`5`. Area rows and `prep.begin`, `review.edit`, `result.edit` now resolve `@first` / `@next` / `@prev` against `ctx.steps`, the question steps in use (`questionSteps()`: `'must'` then every area that still has a question). **Guard:** `must --next-->` needs `ctx.mustDone` (every must-have has an answer; "Don't know yet" counts). `send()` is still the only writer of `st.step`. | Must-haves first, no repeats, skipped empty areas, "with needed answers" |
| MUST GATE (like the start gate) | `ui.mustMissing`: set only by pressing "Next" on the must-haves step with one unanswered, cleared by any navigation. While set, the first unanswered must-have is outlined with "Answer this to continue"; the outline moves on as answers come in. | Same pattern as the v4 start screen; Next is never a grey dead button |
| RESTORE (storage, file, history) | `F.placeStep(step, {tool, steps, mustOpen})`, used by `fromRecord` and `popstate`: an area step reopens at the same area; with any unanswered must-have → `'must'`; an area with no question left → the next step in use; `review`/`result`/`prep` unchanged; unknown → start. `render()` also re-places a step that lost its questions. | Checks saved by the six-step build; hotel details that change the questions |
| RECORD | Unchanged (`rv: 2`). No renumbering needed: area steps keep their area index. | Old JSON files open as before |

Pure helpers added to `src/flow.js`: `QSTEPS`, `stepNo`, `placeStep`, `stepQuestions`, `questionSteps`, `firstOpenMust`; to `src/logic.js` (not used for scoring): `hasAnswer(q, A, P)`.

## AX handles added

- `#view[data-state]` can be `must`. `ReadinessCheck.state()` also returns `steps` (question steps in use, e.g. `['must',0,1,3,4,5]`), `stepNo` (1-based, 0 off the question steps), `mustOpen` (code of the first unanswered must-have, on the must-haves step) and `mustMissing`. `send('next')` returns false on the must-haves step while one is unanswered.
- Stable ids: `next` (the step's Next button), `fs-<code>` (`.missing` when outlined), `.areatag` in a must-have's legend.

## Bug found and fixed

New check shared the earlier check's hotel object (pick another tool, "Start a new check", `#use=`): changing how the hotel is run in the new check rewrote the earlier check. Repro: check A for gx-2 (independent), open `#use=hr-2` in the same page, choose "Managed or franchised": A's saved hotel became managed too. Each new check now copies the hotel.

## Left alone

- A same-page hash navigation fires `popstate` (state null) before `hashchange`, so the open check is saved at "start" just before the `#use=` check replaces it. Harmless (it is listed in "Your checks"), noted.
- Two tabs overwriting each other's `mine` map (unchanged).

## Proof (must-haves first)

- `tests/flow.test.mjs` 101 passed (21 new: the must-haves step, its guard, skipped areas, step numbers, `placeStep`, the pure helpers); `tests/mustfirst.test.mjs` 22 passed (4,900 old-vs-new order comparisons, conditional must-haves, skipped Financial investment, fixtures from the six-step build); `tests/logic.test.mjs` 35 and `tests/v4.test.mjs` 81 unchanged and green.
- Playwright `tests/browser/mustfirst.cjs`: 238 checks at 1280 px and 390 px (touch) for a chatbot (gx-2), a high-risk HR tool (hr-2, managed, Switzerland) and a light tool (sm-1): must-haves first with area tags, Next blocked until each has an answer, area steps without repeats, Back/forward, reload mid-flow, result identical to the six-step build for the same answers, PDF with the order line, review, local share and team page, checks and a file saved by the six-step build. No console errors, no horizontal scroll; the only external request is the existing Google Fonts link (blocked in the test).

# "Planned, not done yet" (20 Nov 2026): what changed in the machines

Scope: the owner's decision to add the answer "Planned, not done yet" and an honesty line. Scoring unchanged in substance (Planned is scored exactly like Partly), so the rules stay `v4 (20 Nov 2026)`. No new screen, step or event: the FLOW table, the must-haves guard and every other machine are unchanged.

| Machine | Change | Why |
|---|---|---|
| ANSWER (per question) | New stored code **`pl`** (no code reused). `L.score()` returns `{state:'gap', pts:1, done:true, planned:true}`: the same state and points as Partly, plus a `planned` flag used only for words. `L.hasAnswer()` counts it as an answer, so the must-haves guard (`must --next-->`, `ctx.mustDone`) accepts it. | One source for the scoring; the flag cannot change a verdict |
| RECORD | Optional **`By`** map `{code: 'YYYY-MM-DD'}` ("By when?" dates). `F.migrate()` keeps it as a string map and gives old data `{}`; still `rv: 2` and file `v: 3` (an optional field; older builds keep unknown fields). A date is removed when the answer changes away from Planned (page) and only Planned answers' well-formed dates are sent or shown (`F.plannedDates(rec)`). `F.shareSig()` adds the dates only when there is one, so copies shared before are not marked out of date. | Dates survive storage, files and the share payload; old data opens unchanged |
| REVIEW (update open items) | `snapAnswers()` / `undo()` also keep and restore `By`. A Planned item is open (`isOpen`: state `gap`). | "Undo" must bring back the date too |

## AX handles added

- Answer radios `#q-<code>-pl`; the date field `#by-<code>` (`data-by`, only while Planned is chosen); `#honest` (start screen) and the must-haves intro (`.stephead .meta`, ends with the honesty line); `#planned-line` in "How this result was worked out".
- `ReadinessCheck.record().By`; `evaluate(...)` gives `counts.planned`, `ev.planned`, and `gates[i].planned` / `.by`; action items carry `planned: true`.

## Proof ("Planned, not done yet")

- `tests/planned.test.mjs` 49 passed: equivalence for 98 tools × 5 hotel set-ups × 8 answer sets (3,920: same verdict, area points and words, must-have states, open items, first three, vendor questions and snapshot as Partly, apart from the words), counts add up in every case, no "not in place" for a Planned answer, verdict and summary for planned-only, mixed and none, date round-trip (storage, file, share payload, old data), checks and a file saved by the must-haves-first build (`tests/fixtures/storage-mustfirst.json`, `check-mustfirst.json`, recorded with that build before any change) open with the same verdict, count line, summary and place, the must-haves step accepts Planned.
- Playwright `tests/browser/planned.cjs` (port 8807): 86 checks at 1280 px and 390 px (touch): honesty line on the start screen and in the must-haves intro, answer order, Planned with dates on two must-haves, 44 px targets, Next goes on, result wording and counts, "Finish: … (planned by …)", must-haves list, PDF text, saved file, share payload, reload, team page, update open items (Planned → Yes counts as now done), a mixed case. No console errors, no horizontal scroll. `tests/browser/mustfirst.cjs` still passes (238).
