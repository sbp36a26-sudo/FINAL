# AI starting point (formerly Readiness 2.0): state machines (built explicit from the start)

Built to `.claude/skills/clean-up/SKILL.md`. Every flow has one transition table, there is one `send()`, the state is exposed in `data-state`, the record is versioned, and tests cover the flows. There was no earlier code, so there are no old bugs. The table lists the impossible states that were designed out.

## Inventory

| Machine | Where | States | Action | Why |
|---|---|---|---|---|
| FLOW | `src/flow.js` (`FLOW`, `flowNext`, `reachable`, `placeStep`) | `start`, `q`, `stop`, `where`, `needs`, `success`, `summary` | Explicit, with guards | 7 states, a hard stop rule, history and restore |
| RECORD | `src/flow.js` (`reduce`, `migrate`, `blank`) | `{ v, step, Q, cat, dept, use, A, By }` | Explicit: `reduce()` is the only writer; `migrate()` runs on every load | Persisted; a choice must stay consistent with its parent (dept ⊂ cat, use ⊂ dept) |
| CONFIRM | `src/flow.js` (`confirmNext`) | `null`, `'restart'` | Explicit | A destructive action needs a confirmation that cannot be double-fired or left stale |
| BRIDGE | `src/flow.js` (`bridgeNext`, v1.1) | `none`, `pending`, `yes`, `no` | Explicit, the readiness check's table | Does the hub save files for us; the 12 s timeout is an event |
| DOWNLOAD | `src/flow.js` (`dlNext`, v1.1) | `idle`, `making`, `waiting`, `saving` | Explicit | Async, two save paths, and a double click must not make two files |
| Missing pointer | `src/app.js` (`ui.missing`) | `null`, or the id of the first open item | Named only | Derived after a refused Next and cleared on navigation or when answered |
| Copy box | `src/app.js` (`ui.copy`) | `false`, `true` | Named only | Shown only when the clipboard refuses; closed on navigation |
| Folds | `src/app.js` (`ui.open`) | which `details` are open | Left | Display only; kept across re-renders |
| HISTORY (v1.2) | `src/flow.js` (`histAction`, `histEntry`, `histRead`); `src/app.js` (`hist`, `histWrite`, popstate) | entries `{ r2, d, prev }`; actions `push`, `back`, `replace` | Explicit | Was implicit in `afterMove`, popstate and the first replace; two confirmed bugs (M1) |
| Storage availability (v1.2) | `src/app.js` (`storage`) | `ok`, `blocked`, `newer` | Named, now visible (`#app[data-storage]`, `#not-saved`) | `blocked` was invisible (M3); `newer` records were downgraded (L2) |
| Use-case identity (v1.2) | `src/flow.js` (`migrate` with `info`, `reduce('use')`) | `use` + `useName`; `info.useChanged` | Named | Ids are positions; a catalogue insert re-pointed saved choices (M2) |
| Hub presence (v1.2) | `src/app.js` (`host.pong`, `FOREIGN_PARENT`) | unknown, hub (pong), not hub | Named | "In a frame" was taken for "in the hub": dead clicks in a foreign frame (L4) |
| Notice (v1.2) | `src/app.js` (`ui.notice`) | `null`, `'useChanged'` | Named only | Set by a restore, cleared by a pick or by leaving step 1b |

## FLOW table

| From | Event | To | Guard |
|---|---|---|---|
| start | begin | q | |
| q | next | stop | Q1 = No (whatever the rest) |
| q | next | where | all five answered, Q1 ≠ No |
| q | back | start | |
| stop | change | q | |
| where | next | needs | a use case of the chosen department, or "none" |
| where / needs / success / summary | back | the step before | |
| needs | next | success | all ten answered |
| success | next | summary | all nine answered |
| summary | edit | q | |
| any but start | restart | start | only after CONFIRM yes; clears the record |
| any | pop(step) | `placeStep(step)` | Back/forward or restore: the step itself if reachable; any step after 1a while Q1 is No → `stop`; else the nearest reachable step before it |

Reachability:
- `stop` only while Q1 = No.
- `where` only when Q1 ≠ No and all five questions are answered.
- `needs` also needs the 1b choice; `success` also needs all of step 2; `summary` also needs all of step 3.

Designed out (each is tested):
- Reaching 1b, 2, 3 or the summary with Q1 = No, through Next, history, a saved record or `send()`. An exhaustive walk over 1,024 answer states × 3 choice states, and a walk over 30,000 event sequences with `reduce()`, test this.
- The stop screen while Q1 ≠ No (after "Change my answers" and a change to Yes, Back lands on 1a).
- Answers changed from a step that does not show them. `answer` is accepted only on its own step, so the screen being shown can never become unreachable.
- A department outside the chosen category, or a use case outside the chosen department, from a click or from storage.
- A "By when?" date without a Planned answer, or a malformed date.
- A stale restart confirmation that fires later.
- Two PDF downloads at once (v1.1): `start` is refused in every state but `idle`, and the buttons are disabled there; 3,000 random walks never hold two and always return to `idle`.

## v1.2 clean-up (23 Nov 2026): the eight bugs of `reports/audit-readiness-2/cleanup_inventory.md`

Each was re-checked against the v1.1 code (all eight still applied), given a failing test first, then fixed. Records saved by v1.1 (`tests/fixtures/v1.1-saved.json`, captured from the real page) open unchanged.

| Bug | Reproduction (before) | Fix | Proof |
|---|---|---|---|
| 1 Hash change → start screen, saved | `location.hash = 'x'` on the summary → `start`, still after reload | popstate reads only our own entries (`histRead`); a foreign entry keeps the step and is marked as ours | `v12.test.mjs`; `browser/v12.cjs` (standalone and in the hub frame) |
| 2 In-app Back vs browser Back | Next, in-app Back, browser Back → went forward to 1b; history grew by 4 per 3 cycles | HISTORY machine: in-app Back uses `history.back()` when the entry below is that step and nothing was pushed since, else replaces; Start again replaces | simulated in Node; in the browser: Back → start, 3 cycles add 0 entries; in the hub Back from the start leaves the tab |
| 3 Blocked storage invisible | `getItem`/`setItem` throwing: no text said so, the page promised to keep answers | `NOT_SAVED` line on every screen, promises hidden, `data-storage` | `browser/v12.cjs` |
| 4 Impossible dates | `2026-13-45` printed "45 undefined 2026" | `validDate` / `realDate`: a real day, 2000–2100, in `reduce`, `migrate`, `fmtDate` | `v12.test.mjs`, browser |
| 5 Use-case ids are positions | a catalogue insert sent the wrong tool to the readiness check | `useName` saved; mismatch → use case cleared, 1b, notice | Node (shifted catalogue), browser |
| 6 Newer record downgraded | a v2 record with `notes` was rewritten as v1 | `storage = 'newer'`: shown, never saved | browser: byte-identical after an answer |
| 7 Progress bar | step 2 showed `["done","done",""]` | `R2Flow.progress` | Node and browser on every step |
| 8 Dead click in a foreign frame | framed from another origin, `#check-one` did nothing | hub messages only after the pong; no ping to a foreign parent | browser, framed from `localhost` |
| L5 Cross-tab history | after a restart in tab B, tab A's history said `needs` | follow also replaces the history entry; `pageshow` (persisted) re-reads | browser, two tabs |

Also found: dates used the UTC day (now local), and a foreign frame was pinged (console error, 12 s wait). BRIDGE and DOWNLOAD audited against the readiness check's tables: unchanged, correct.

## AX handles

- v1.2: `#app[data-storage]` (`ok`, `blocked`, `newer`); `state()` adds `handover` (`use`, `search`, `blocked` on the summary), `notice`, `history { d, prev }`, `inFrame`; `inHub` is now true only after the hub's pong. New ids: `#guard-q1`, `#stop-unsure`, `#gloss-<item>`, `#weak-<item>`, `#carry-note`, `#not-saved`, `#use-changed`; `#handover[data-handover]`.
- `#app[data-dl]` holds the DOWNLOAD state and `#app[data-bridge]` the BRIDGE state (v1.1).
- `#app[data-state]` holds the FLOW state; `#app[data-verdict]` holds the 1a verdict key (`stop`, `worth`, `data`, `success`, `find`, `assist`, `go` or `open`).
- `window.Readiness2.state()` returns `{ step, Q, verdict, carried, find, cat, dept, use, A, By, ctx: { q1No, qDone, whereDone, needsDone, successDone }, events, confirm, missing, copyBox, storage, inHub, canCheck, download, bridge, counts, weakest }`.
- `window.Readiness2.send(event, arg)` takes the same events the page uses:
  - `begin`, `next`, `back`, `change`, `edit`
  - `restart`, then `restart-yes` or `restart-no`
  - `answer {id, value}`, `by {id, date}`
  - `cat <name>`, `dept <id>`, `use <id | 'none'>`
  - `pop <step>`
- `window.Readiness2.record()` returns a copy of the saved record; `summaryText()` returns the copied text; `pdfModel()` returns the PDF's blocks and `pdfName()` its file name (v1.1).
- Stable ids:
  - Navigation and the stop screen: `#begin`, `#next`, `#back`, `#change`, `#restart`, `#restart-top`, `#restart-yes`, `#restart-no`.
  - Summary actions: `#check-one`, `#pdf`, `#copy`, `#print`, `#edit` (`#pdf` is also on the stop screen).
  - Step 1b: `#cat-commercial`, `#cat-guestfacing`, `#cat-operational`, `#cat-administrative`, `#dept-<id>`, `#u-<use id>`, `#u-none`.
  - Answers: `label[for="a-<item>-<value>"]`.
  - Summary sections: `#verdict` (1a), `#stop-head`, `#sum-verdict`, `#count-needs`, `#count-success`, `#overall[data-overall]`, `#first3`, `#todo`.
- Timers: one hides the toasts. For the PDF, a 30 ms pause lets the disabled button paint before jsPDF runs, then sends `made`; the bridge's 12 s and the hub's 2-minute limits arrive as `timeout` / `fail` events.

## Proof

- `tests/logic.test.mjs` (5,273 checks).
- `tests/flow.test.mjs` (13,936 checks).
- `tests/catalogue.test.mjs` (131 checks).
- `tests/pdf.test.mjs` (1,110 checks, v1.1).
- `tests/v12.test.mjs` (100 checks, v1.2) and `tests/browser/v12.cjs` (172 checks, v1.2: standalone, in the hub and framed from another origin; 1280 and 390 px).
- Browser PDF proof `tests/browser/pdf.cjs` (138 checks, v1.1): download from the summary and the stop screen, standalone and inside the hub (link fallback and the hub's save path), 1280 and 390 px; PDF words equal the summary screen; one file for a double click; no external requests; no console errors.
- Browser walk `tests/browser/walk.cjs` (161 checks):
  - At 1280 px and 390 px.
  - The stop screen and its two buttons, and that nothing moves past it.
  - A full path through Guest-facing › Front Office to a use case, with mixed answers.
  - Reload mid-step and Back/forward.
  - Print view.
  - Copy, and the copy-box fallback.
  - Corrupt storage.
  - "None of these fits".
  - Inside the hub: the tab, the catalogue link switching tabs to `#fo`, and "Check one tool in detail" switching to the Readiness check with the use case loaded.
  - No console errors, no horizontal scroll, and 44 px targets throughout.
