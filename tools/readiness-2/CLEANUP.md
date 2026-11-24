# Do you need AI? v2: state machines

Rebuilt on 24 Nov 2026 to `.claude/skills/clean-up/SKILL.md`: one transition table per flow, one `send()`, state in `data-state`, a versioned store with a migration, tests for every transition and guard, and a browser walk at 1280 and 390 px.

## Inventory

| Machine | Where | States | Events | Action |
|---|---|---|---|---|
| FLOW (where the person is) | `src/flow.js` `FLOW`, `reachable`, `placeStep`, `flowNext` | `start`, `hotel`, `q`, `stop`, `must`, `where`, `tailored`, `result` | `begin`, `next`, `back`, `change`, `edit`, `pop(step)` | Explicit table with guards; `rec.step` has one writer (`reduce`). |
| STORE (the checks of this browser) | `src/flow.js` `reduce`, `migrate`, `cleanRec` | `{ v: 3, cur, checks, notice }` (version 2 before v2.6) | `new`, `open`, `remove`, `import`, `preselect`, `snap`, `seen`, `profile`, `share`, `shared`, `unshared`, plus the record events `hotel`, `answer`, `by`, `cat`, `dept`, `use` | One reducer; every load goes through `migrate` (v1 → v2, junk dropped, step placed back, newer version never written over). |
| CONFIRM | `confirmNext` | `null`, `{kind:'remove', id}`, `{kind:'file'}` | `ask`, `yes`, `no`, `nav` | Explicit; `yes` fires once and only for what was asked. |
| BRIDGE (does the hub save files?) | `bridgeNext` | `none`, `pending`, `yes`, `no` | `yes`, `no`, `timeout`, `error` | The readiness check's own table; the 12 s timeout is an event. |
| DOWNLOAD (PDF or file) | `dlNext` | `idle`, `making`, `waiting`, `saving` | `start`, `made`, `bridge`, `done`, `fail` | One download at a time; both buttons disabled unless `idle`. |
| SHARE | `shareNext`, `shareSettled`, `shareSig`, `shareStale` | `idle`, `shared`, `sending`, `withdrawing` | `share`, `withdraw` | The readiness check's pattern; settled state comes from the record. |
| HISTORY | `histAction`, `histEntry`, `histRead` | entries `{ r2: step, d, prev, id }` | forward events push; in-app Back goes back or replaces; store events replace | In-app Back and browser Back agree; an entry of another check or a foreign entry is never read as a step. |
| Storage availability | `src/app.js` `storage` | `ok`, `blocked`, `newer` | set by `load` / `save` | Named; shown on every screen (`#app[data-storage]`). |
| Share store mode | `tools/readiness-check/src/store.js` (inlined) | `idle`, `probing`, `shared`, `local` | probe result, 8 s timeout | Left as is (the readiness check's, already explicit). |

## Guards (all tested)

- `hotel → q` needs "how the hotel is run".
- `q → stop` when Q1 is Yes (v2.6; No before), whatever the rest; `q → must` only with all five answered.
- `stop` is reachable only while Q1 is Yes; `must`, `where`, `tailored`, `result` never while Q1 is Yes (v2.6; No before) (256 context combinations and an exhaustive 4-event walk from the stop screen).
- `must → where` needs every must-have answered ("Don't know yet" counts).
- `where → tailored` with a use case; `where → result` with "None of these fits".
- `tailored → result` needs every tailored question answered.
- Answers are accepted only on their own step, so no answer can make the screen being shown impossible.

## Impossible or stuck states designed out, and bugs found while building

- **A hash link lost its hash before it was read.** A `#use=<id>` navigation arrives as a `popstate` before `hashchange`; the history machine rewrote the entry without the hash, so the link did nothing inside the hub. Fixed: the `popstate` handler reads the hash first. Covered by the browser walk (old `readiness-check` link with `#use=hr-2`).
- **Old Back/forward entries** (`needs`, `success`, `summary` from v1) are not read as steps (`histRead`).
- **Tailored answers of another use case** cannot survive a change of use case: `use`, `dept` and `cat` clear them.
- **A file whose check is already in the browser** asks before replacing; a wrong or newer file is refused with a message.
- **An untouched check** is not kept when another is started or opened, so the list does not fill with blanks.
- **A snapshot per visit** would have made "since last time" compare a result with itself; a snapshot is kept only when the result differs from the last.
- **75% shown, "Almost ready" given:** the percentage is rounded down, so a score just under a cut-off never displays as the cut-off.

## Left alone, and why

- The readiness check's `store.js` and `logic.js` are inlined unchanged (vendor questions, legal panel, db bridge): one rule source, already tested there.
- The hub's capability lookups: unchanged.
- The team page's `teamNext` machine: unchanged; only the list filter and a second detail view were added.

## AX handles

- `#app[data-state]` (the step), `data-level` (on the result), `data-verdict` (five questions), `data-storage`, `data-check`, `data-dl`, `data-bridge`, `data-store`.
- `window.Readiness2.state()`: step, id, hotel, Q, verdict, A, By, cat, dept, use, T, TBy, tailored ids, ctx, events, level, pct, counts, must, confirm, missing, storage, notice, storeNotice, checks, snaps, inHub, download, bridge, share, sharedAt, shareStore, sharingOn, history.
- `window.Readiness2.send(event, arg)`: the same events the controls send; returns false when refused. `.events()` lists the navigation events accepted now.
- `.record()`, `.store()`, `.resultModel()`, `.pdfModel()`, `.pdfName()`, `.fileDoc()`, `.openFileText(text)`, `.shareDoc()` (`.summaryText()` was removed in v2.5 with Copy summary).
- Stable ids: `#begin`, `#next`, `#back`, `#change`, `#edit`, `#new-top`, `#new-check`, `#pdf`, `#save-file`, `#to-register`, `#share-btn`, `#unshare`, `#file-open`, `a-<question id>-<answer>` on every answer, `u-<use id>`, `cat-<area>`, `dept-<id>`, `h-type`, `h-name`, `h-role`, `h-country`.

## Proof

Unit: logic 7,473 · flow 5,987 · questions 913 · pdf 481 · build 120. Browser (`tests/browser/walk.cjs`): 822 checks at 1280 and 390 px, standalone and inside the hub: three full walks (guest chatbot `gx-2`, AI recruiting `hr-2` with the sensitive-data add-on, draft use case `fo-8`), "None of these fits", Q1 stop, reload mid-flow, Back/forward, saved-check list, file save/open, PDF download, v1 records, `#use=` links, old `readiness-check` link from the hub, team sharing and withdrawal, blocked storage. No console errors, no horizontal scroll, 44 px targets.

## v2.1 (24 Nov 2026): second clean-up pass

From `reports/audit-readiness-2/cleanup_inventory_v2.md` (18 machines, 23 faults). Three earlier claims above were wrong and are corrected here: "one download at a time" did not hold for *Save as file*; "SHARE: settled state comes from the record" failed when another check was opened mid-send; Back went dead after every store event.

| Machine | Action in v2.1 | What changed |
|---|---|---|
| SHARE | Made explicit by check id | `ui.share = { phase, id }`; `reduce('shared' / 'unshared', { id })` writes to that check on any step; `withdrawCopy(id)`; controls on every step (`#unshare` in the header line, the result panel, `#unshare-<id>` in the list, `#rm-withdraw` in the remove dialog). A check removed mid-send has its copy taken back. |
| HISTORY | One more rule | `F.histSkip`: entries of another check, and (going back) entries whose step is no longer reachable, are passed over; bounded at 60. |
| TABS (new name) | Made explicit | `F.mergeTabs(mine, theirs)` → `elsewhere: null / 'changed' / 'removed'`; the open check is per tab; event `adopt` loads the other tab's version. |
| Answers / questions | Versioned | `rec.tqSig` against `TQ.uses[id].sig`; `info.questionsChanged`, `info.useChanged` → `ui.notice`. |
| Since last time | Keyed | snapshots carry `use` and `rules`; `L.snapsOf`, `L.since`. |
| STORE | One guard | cap of 50 at write time (`{ ok: false, full: true }`) and on load (open check and newest kept). |
| Hotel form + profile | Named | "empty means cleared": `clearProfile(k)`. Country "Other" clears the profile's country. |
| Use-case selection | Named | `rec.from = 'link'`; `listed()` ignores a link-only use case. |
| File save / open | Named | `F.forFile`, `cleanRec(..., { file: true })`, `ui.fileNote = 'old'`. |
| Storage | Wording, one state | `ui.corrupt`; raw text kept under `F.CORRUPT_KEY`. |
| Team page | Named | `dynGone(d)`; rules card per kind of copy. |
| FLOW, CONFIRM, BRIDGE, DOWNLOAD, hub alias, page-only flags | Left | No fault, or one line (the file download now takes the same later tick as the PDF). |

New AX: `state()` adds `from`, `tqSig`, `elsewhere`, `fileNote`, `corrupt`, `rules`, `judgement`, `reason`, `held`, `score`; `#reason[data-held]`, `#elsewhere[data-elsewhere]`, `#shared-line[data-share-state]`, `.mycheck[data-shared]`; events `adopt`, `remove-withdraw`.

Note for drivers: in-app Back uses the browser's history, so two `send('back')` in one tick race with `popstate` (true before v2.1 as well); send one, then read the state.

Proof: unit logic 7,473 · flow 5,987 · questions 917 · pdf 482 · build 120 · v21 1,204. Browser: `walk.cjs` 832, `v21.cjs` 592 (1280 and 390 px, standalone and in the hub, old-version data from `tests/fixtures/v2.0-*.json`). No console errors, no horizontal scroll, 44 px targets.

## v2.3 / v2.4 (24 Nov 2026): what the third clean-up audit found

`reports/audit-readiness-2/cleanup_inventory_v3.md` (read-only, on commit `eb2f956`) listed two machines the v2.1 table above did not have: the **DETAIL layer** (v2.4: `ui.detail` and `ui.detailFrom`, four fields for one state, no `data-` handle) and the **old answer per question** (v2.3: a saved Partly or Doesn't apply kept in the record and shown as unanswered). It also listed the copy box, the share fields across a file replace or a tab merge, "Since last time" across question sets, and undeclared page state. Faults: H1, M1 to M5, L1 to L5. Fixed in v2.5.

## v2.5 (24 Nov 2026): third clean-up pass

| Machine | Action in v2.5 | What changed |
|---|---|---|
| DETAIL layer | Made explicit | `ui.layer = null | { use, from, step, check }`. Opened by `[data-act=detail]`; closed by Close, Esc, a click outside the drawer's box (`getBoundingClientRect`, M3), and by **any step or check change** in `afterMove` (M1 browser or phone Back, M2 a `#use=` link or any store event) and in `follow()` when another tab removed the check. One close path, `closeDetail(moved)`: on a move, focus goes to `#view`, otherwise back to the opener. `syncDetail()` also refuses a layer whose step or check is not the one on screen. AX: `#app[data-layer]`, `state().layer`, `state().detail` (the use id, as before). Phone Back closing only the sheet (a history entry for the layer) was not built: the inventory's minimum fix is in place and the step behind changes as Back says. |
| Share fields (SHARE / STORE / TABS) | One rule | "The share fields of a check belong to this browser and survive any replacement of its answers": `F.keepShare(to, had)`, used by `reduce('import')` (H1) and by `mergeTabs` when this tab keeps its own answers (M4). `shareStale()` then marks the copy out of date when the answers differ. The replace question says "The project team’s copy of this check stays shared; you can still withdraw it." (`#file-keeps-share`). A file of a check not in this browser still opens unshared (v2.1 L11). |
| COPY BOX | Made explicit | `ui.copy = null | { from: 'who:<role>' | 'vendor', text }`, drawn next to its button (after the person's list, inside the vendor fold), never in `#actions`; cleared by the next copy and by any move (M5). AX: `state().copyBox` (boolean, as before), `state().copyFrom`. |
| Old answer per question | Named | `L.answerState(raw)` → `'yes' | 'planned' | 'no' | 'unknown' | 'old' | 'blank'`; `open()` items carry `old` and `word`; an old answer's task reads "Answer again: “…” (the earlier answer “Partly” is no longer offered)" (L1); "Start with", the action plan and the Team tab (`goneWord`, L2) use `answerWord`. |
| Since last time | Keyed | snapshots carry `sig` (the use case's question signature); two snapshots of one use and rules but other questions are listed "asked with other questions, not compared line by line" (L3). |
| Page-only state | Declared | `ui.dlKind`, `ui.fileInfo` in the `ui` literal; `fileInfo` cleared by "Keep the one here" and any move; both in `state()` (L5). |
| Sharing switch | One constant | `SHARING_DEFAULT = false` (owner O7). Withdrawing works with sharing off: the share panel stays for a check that has a copy (with its withdraw button), and the header line, "Your checks" and the remove dialog are unchanged. The test switch `window.R2_TEST_SHARING` (set only by `walk.cjs` and `v21.cjs` before load) proves the share paths for when it is switched back on. |

Dead code removed: `L.summaryText` and `Readiness2.summaryText` (Copy summary left in v2.3; its test assertions now read the PDF), `C.SYSTEMS_NOTE`, `C.READY_NONE` (O4 makes it unreachable), `p`/`na` in `C.ANSWER_WORD`, the `.exbtn[aria-expanded]` CSS and its "What does this do?" comment, `catLink(d, u)` → `detailButton(u)`. Kept: `'use-case-catalogue'` in the hub's `OPENABLE` (the bridge stays open; its comment now says no frame sends it).

Tests renamed or replaced (audit v3 section 4): `logic.test.mjs` "Copy summary carries …" → the PDF carries the same words in the same order; `v21.test.mjs` and `browser/v21.cjs` "… in the copy text and the PDF" → "… in the PDF"; `browser/v23.cjs` checks the words "What does this do?" and one button per use-case row (not `#ex-gx-2`, a prefix the must-haves use too); `v22.test.mjs` header. The reproductions became `tests/v25.test.mjs` (U1, U3, U4, H1, M4, L1 to L5, dead code) and `tests/browser/v25.cjs` (R1 to R6, T1, T2); both failed on v2.4 (unit 70 of 116 failing; browser 26 failing before it stopped at the missing `#rm-withdraw`) and pass on v2.5.

Proof: unit logic 7,477 · flow 5,987 · questions 917 · pdf 482 · build 120 · v21 1,203 · v22 809 · v23 264 · v25 116. Browser (1280 and 390 px): `walk.cjs` 860, `v21.cjs` 610, `v23.cjs` 144, `v25.cjs` 137. Team tab: readiness-check `mustfirst.cjs` 238, `planned.cjs` 86. No console errors, no horizontal scroll.

## v2.6.1 (24 Nov 2026): fourth clean-up pass

From `reports/audit-readiness-2/cleanup_inventory_v4.md` (scope: v2.6, its hub glue and the Team tab reader). Two machines changed in v2.6 and were checked again: the **DETAIL layer**, now drawn in two places (this page's own `<dialog>` standalone, the hub's `#hub-detail` inside the hub), and the **STORE**, now `{ v: 3, cur, checks, notice }` with a per-record step 2 question set (`qv: 2`) and the one-time `R2Logic.legacyQ` migration.

| Machine | Action in v2.6.1 | What changed |
|---|---|---|
| DETAIL layer across the frame boundary | One rule, both sides | `ui.layer.hub` true means the hub draws it. `closeDetail(moved, noFocus, fromHub)` is the one way the layer drops; every drop the hub did not start sends `{ hub: 'detail-close' }` (B1: a step or check change, browser or phone Back, a `#use=` link, another tab removing the check). The hub drops its layer on Close, Esc, the dimmed area, another hub tab, the frame's `detail-close`, and a new `ping` from that frame (B2: the page under it reloaded). Message shapes unchanged (`tools/hub/CONTRACTS.md`). |
| TABS across versions | Two guards | `follow()` sets `storage = 'newer'` when another tab saved a newer store (B3: it used to merge and write its own older store back). `F.migrate` sets `info.older` for a store below version 3; `F.mergeTabs(mine, theirs, { older })` then keeps every check this tab holds and takes only the checks it does not know (B4: an already-open v2.5 tab strips `qv`, so its write-back would have turned question 1 round a second time and dropped questions 3 and 4 on this tab's checks). |
| STORE migration (`qv`) | Left | Checked: one reader (`cleanRec`) for store, file, v1 record and import; `copy()` always carries `qv`; a v2.6 store read again is not turned twice; a check that stood on its result reopens on step 2; a stop stays a stop. |
| Team tab copies | Left | `team.js` reads `qv` per copy (`dynRec`); a pre-v2.6 copy is recomputed with questions 3 and 4 unanswered and flagged by the "hotel saw" line when the verdict moved. |
| FLOW, CONFIRM, BRIDGE, DOWNLOAD, SHARE, HISTORY, COPY BOX | Left | No fault found. |

AX: unchanged handles (`#app[data-layer]`, `data-layer-host="hub"`, `state().layer.hub`, `HFTPHub.state().detail`); `state().storage` now turns `'newer'` while the page is open.

Dead code removed: the register's `host.hub` flag (set on `pong`, read nowhere since the link bridge went in v2.6). Stale docs and comments fixed: README (assistant-only rule, must-have 7 line, file version 3, the v2.6 store claim about older tabs, the v2.5.1 test list), `CONTRACTS.md` bridge row (`link` → the detail messages), app.js header (store version 3, file version 3, Q1 Yes stops), logic.js `consistLines` comment, `tests/v251.test.mjs` header; this file's guard lines (Q1 Yes stops since v2.6).

Proof: unit `tests/v261.test.mjs` (26; 19 failed on v2.6), browser `tests/browser/v261.cjs` (45 at 1280 and 390 px; 12 failed on v2.6, and the stale layer then blocked the tool so the run could not go on without pressing Close). Changed expectation: `tests/v26.test.mjs` reads the hub's close as `closeDetail(false, m.focus === false, true)` (the third argument stops the echo). All suites green: unit logic 7,477 · flow 5,986 · questions 917 · pdf 714 · build 120 · v21 1,205 · v22 818 · v23 264 · v25 115 · v251 83 · v26 90 · v261 26; browser walk 862 · v21 616 · v23 100 · v25 137 · v251 50 · v26 91 · v261 45; Team tab mustfirst 238 · planned 86; hub 30.
