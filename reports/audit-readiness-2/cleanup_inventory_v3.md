# "Do you need AI?" v2.4: clean-up inventory v3 (read-only)

*24 Nov 2026. Scope: `tools/readiness-2/` at commit `eb2f956` (v2.4 plus the owner change of `7e0530e`: no "What does this do?" button, Start a new check next to Download (PDF)): `src/*.js`, `src/page.html`, `src/style.css`, `build.mjs`, `data/build-questions.mjs`, `tests/`; its hub glue (`tools/hub/hub-bar.html`, `CONTRACTS.md`) and the Team tab's reading of its copies (`tools/readiness-check/src/team.js`). Skill: `.claude/skills/clean-up/SKILL.md`, step 1 (Inventory) and step 2 (Decide) only. Nothing in `tools/` was changed and nothing was committed.*

## How this was checked

- Read: `CLAUDE.md`, the tool's `README.md`, `CHANGELOG.md` (v2.1 to v2.4), `CLEANUP.md`, `reports/audit-readiness-2/cleanup_inventory_v2.md` (the 23 faults fixed in v2.1), and every source file in scope, plus the diffs of `a918c13` (v2.3/v2.4) and `7e0530e`.
- Built a copy of `tools/` in the scratchpad: `index.html`, `readiness-check/index.html` and `team.html` came out byte-identical to the committed files, so the pages are fresh.
- Every bug below has a reproduction kept in the scratchpad (not in the repo): `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/cleanup24/` → `repro.cjs`, `repro2.cjs`, `repro3.cjs` (Playwright, `tools/` served on 127.0.0.1:8843) and `unit.mjs` (Node, reads the repo's pure scripts and data). The servers were stopped afterwards; `git status` is clean.

## 1. Machines found

The v2.1 table in `CLEANUP.md` still holds for FLOW, STORE, CONFIRM, BRIDGE, DOWNLOAD, SHARE, HISTORY, TABS and storage. New or changed since v2.2:

| # | Machine | Where | States | Events / who triggers | Impossible or stuck states today | Decision |
|---|---|---|---|---|---|---|
| 1 | **DETAIL layer** (new in v2.4, implicit) | `app.js` `ui.detail`, `ui.detailFrom`, `syncDetail`, `openDetail`, `closeDetail`; the `<dialog>`'s own `open` and `data-use` | closed · open(use id, opener id) | open: `[data-act=detail]` (step 4 row `dt-<id>`, result `dr-<id>`); close: Close, Esc (`cancel`), backdrop click, `close`; `render()` re-syncs | Open over a step or a check it does not belong to after browser Back (M1) or a `#use=` link (M2); closes on a click inside the drawer (M3); focus lost when the opener is gone (M1). Four fields encode one state; no `data-` handle on `#app` (only `state().detail`) | **Make explicit**: `ui.layer = null | { use, from, step, check }`; close on any step or check change; one close path |
| 2 | **Old answer per question** (v2.3, implicit) | `flow.js` `A_OK`/`OLD_A`/`OLD_T`; `logic.js` `oldOf`, `questions()` (`it.old`), `answerWord`; `app.js` `oldLine` | answered (y/pl/n/k) · old (p, or na on step 5) · blank | `answer` replaces; load keeps old as is; `placeStep` sends a finished check back to its step | Correct on the hotel's own screens. Elsewhere the old state collapses into "Don't know yet": the Team tab's action plan says "Find out" (L1) and a gone-use copy says "Partly" with no note (L2) | **Name only**: one helper `L.answerState(raw)` → `'yes'|'planned'|'no'|'unknown'|'old'|'blank'` used by `open()`, `resultModel().first` and `team.js` |
| 3 | **Copy fallback box** | `app.js` `ui.copy`, `ui.copyText`, `copyText()`; box drawn inside `#actions` | hidden · shown(text) | `copy-who`, `copy-vendor` when the clipboard refuses; cleared only by `afterMove` | Since Copy summary left the top row (v2.3) the box opens at the top of the result, far from the button pressed, and the page jumps there (M5) | **Make explicit**: `ui.copy = null | { from: 'who:<k>' | 'vendor', text }`, drawn next to its button |
| 4 | **Share record vs. replacement** (part of SHARE/STORE/TABS) | `flow.js` `reduce('import')` + `cleanRec(..., {file:true})`; `mergeTabs` (`elsewhere: 'changed'`) | check knows its copy (`sharedAt` set) · check forgot it | "Replace with the file"; another tab saving while this tab holds other answers | **Stuck**: the team still has a copy, the browser no longer offers any way to withdraw it (H1, M4) | **Make explicit**: one rule "the share fields of a check belong to this browser and survive any replacement of its answers" in `reduce('import')` and `mergeTabs` |
| 5 | **Since last time** | `logic.js` `snapshot`, `sameSnap`, `snapsOf`, `since` | none · compared (same use + rules) · earlier rules | `takeSnap()` in `afterMove` and on load at the result | Two results of one use under one rules version but different question sets (after "questions changed") are compared line by line (L3) | **Name only**: add the question signature to the key |
| 6 | Folds and print | `ui.open`, `toggle` handler, `beforeprint`/`afterprint` with `data-print-open` | per fold open/closed; print-opened | person, print | None found (v21.cjs print checks pass) | Leave |
| 7 | File import | `ui.file`, `ui.fileInfo`, `ui.fileNote`, CONFIRM `file` | none · waiting for "replace?" · old-file note | file chooser, `import-yes`, `confirm-no`, `afterMove` | `ui.fileInfo` (and `ui.dlKind`) are not declared in `ui` and `fileInfo` survives "Keep the one here" (harmless today; L5) | Name only (declare) |
| 8 | Notices | `store.notice`, `ui.notice`, `ui.corrupt`, `ui.elsewhere`, `ui.fileNote` | as in v2.1 | as in v2.1 | None new | Leave |
| 9 | Hub open bridge | `hub-bar.html` `OPENABLE`, `HUB_ALIAS`; `app.js` `hubOpen` | as in `CONTRACTS.md` | `{ hub: 'open' }` | `use-case-catalogue` stays openable although no frame sends it since v2.4 (dead entry, comment says the opposite) | Leave the bridge; fix the comment (dead code list) |
| 10 | Team tab copy kinds | `team.js` `isDyn`, `dynGone`, `detailDyn`, `detailGone` | v3 copy · dyn copy · dyn copy of a gone use | list, select | Old answers worded inconsistently (L1, L2) | Name only (see 2) |

FLOW, HISTORY, CONFIRM, BRIDGE, DOWNLOAD, the five questions and the four-answer score: 20,000 random answer sets with old `p`/`na` and blanks mixed in (`unit.mjs` U2) found no break of the verdict invariants (top verdict only with every must-have Yes, 75%+ and under a quarter unknown; any must-have No gives "Not ready yet" unless "Not enough information yet"; no score exactly under "Not enough information yet"; an old answer never earns points).

## 2. Confirmed bugs

Counts: **High 1 · Medium 5 · Low 5.**

### High

**H1. Replacing a shared check with a saved file loses the shared copy; it can no longer be withdrawn.** (Left from v2.1 L11, not caught by its tests.) `forFile()` strips `sharedAt/sharedMode/sharedSig` (correct for the file) but `reduce('import')` → `cleanRec(..., {file:true})` then **overwrites the check already in the browser** with a record that has none. The team keeps its copy; the result's withdraw button, the "Your checks" withdraw link and "Withdraw the shared copy and remove" all disappear. The share panel promises "you can withdraw your copy at any time with the button below".
- Reproduction: `repro2.cjs` R5 / R5b, and `unit.mjs` U3. Result: `before: sharedAt=2026-11-24T13:01:57Z, team copies ["dyn…"]; after "Replace with the file": same check id true, sharedAt=null, team copy still there: true, withdraw controls on the page: 0`; the remove dialog no longer offers `#rm-withdraw`.
- Fix (`src/flow.js`, `reduce` case `'import'`), after `var ri = cleanRec(...)`:
  ```js
  var had = own(store.checks, ri.id) ? store.checks[ri.id] : null;
  if (had && had.sharedAt) { ri.sharedAt = had.sharedAt; ri.sharedMode = had.sharedMode; ri.sharedSig = had.sharedSig; } // the copy belongs to this browser, not to the file
  ```
  `shareStale()` then marks the copy "out of date" when the file's answers differ, which is true. Add one line to the replace confirm: "The project team's copy of this check stays shared; you can still withdraw it."
- Acceptance: unit: import of `forFile(r)` over a shared `r` keeps `sharedAt`, `sharedMode`, `sharedSig`; a file of a check that is *not* in the browser still opens unshared (v2.1 L11 unchanged). Browser: R5 ends with `sharedAt` set, `#unshare` on the result and `#rm-withdraw` in the remove dialog; withdrawing removes the test copy from `hftp-readiness-checks-v1`.

### Medium

**M1. Browser or phone Back while the detail layer is open changes the step behind it; the layer stays open and focus is lost on close.** `popstate` → `send('pop')` → `afterMove` never touches `ui.detail`, and `render()` → `syncDetail()` keeps the dialog open. On a phone the Back gesture is the natural way to close a full-screen sheet.
- Reproduction: `repro.cjs` R1 (1280 and 390 px): open "Details and sources" on gx-2, `page.goBack()` → `step=must, dialog open=true, state().detail=gx-2`; Esc → `document.activeElement` is `BODY` (the opener `#dt-gx-2` no longer exists).
- Fix (minimum, `src/app.js` `afterMove`): first line `if (ui.detail && (rec.step !== prev || force)) closeDetail();` (before `render()`; the existing `$('view').focus()` then takes focus). Recommended for phones (owner to confirm): opening the layer pushes a history entry `{ r2: rec.step, d: hist.d + 1, prev: rec.step, id: rec.id, layer: 1 }`; in the `popstate` handler, `if (ui.detail) { closeDetail(); return; }` before anything else; Close/Esc/backdrop call `history.back()` when the top entry is the layer's.
- Acceptance: R1 → after Back the dialog is closed, `state().detail === null`, and either the step is `must` with focus on `#view` (minimum fix) or the step is still `where` with focus on `#dt-gx-2` (recommended fix). No step change ever leaves `#detail[open]`.

**M2. A `#use=` link (the hub's "Check whether the hotel is ready" from the AI Register, or any hash change) while the layer is open starts a new check under the old layer.** The hub replaces the frame's location with a new hash while the frame is hidden; the dialog is modal only inside the frame, so the hub bar stays clickable. `STORE_EV` handling clears `ui.open`, `ui.notice`, … but not `ui.detail`.
- Reproduction: `repro.cjs` R2: on the gx-2 result, open "More detail", then `location.replace('#use=hr-2')` (what the hub does) → `new check dyn… (use hr-2, step start) but the layer is still open on "AI chat assistant for guests…" (state().detail=gx-2)`.
- Fix: the M1 line in `afterMove` covers it (store events call `afterMove(prev, ev, true)`). Also clear in `follow()` when `m.elsewhere === 'removed'`.
- Acceptance: R2 → after the hash change `#detail` is closed and `state().detail === null`; the cover of the new check has focus.

**M3. A click on the empty part of the drawer closes it.** The backdrop test is `e.target === dlg`; with `padding:0` and `height:100dvh`, the area under short content is the dialog element itself.
- Reproduction: `repro2.cjs` R3: hk-5 (one source) at 1280×900 and 1440×1100: content ends at y=588, a click at y=890/1090 inside the drawer hits `#detail` and closes it. On a phone the same happens wherever a short entry leaves the sheet's lower part empty.
- Fix (`src/app.js`, the backdrop listener):
  ```js
  dlg.addEventListener('click', function (e) { if (e.target !== dlg) return; var r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDetail(); });
  ```
  (or wrap the content in one `<div class="dwrap">` with `min-height:100%` and keep the target test).
- Acceptance: R3 → the drawer stays open after a click inside it below the content; a click at x=100 (backdrop, desktop) still closes it and returns focus to `#dt-hk-5`.

**M4. Two tabs on one check: the other tab's share is forgotten when this tab keeps its own answers.** `mergeTabs` with `elsewhere: 'changed'` keeps this tab's record whole, including `sharedAt: null`; this tab's next save writes it back over the store, so the copy the other tab shared can no longer be withdrawn (same stuck state as H1).
- Reproduction: `repro2.cjs` R6: tab A finishes gx-2, tab B opens the same check (`sessionStorage` cur), tab A changes q4, tab B shares; tab A shows `elsewhere=changed`; after tab A's next answer the store holds `sharedAt=null` while the test copy is still in `hftp-readiness-checks-v1`.
- Fix (`src/flow.js` `mergeTabs`, `else` branch): `var mineK = copy(rec); mineK.sharedAt = other.sharedAt; mineK.sharedMode = other.sharedMode; mineK.sharedSig = other.sharedSig; s.checks[rec.id] = mineK;` (also in `send('adopt')` nothing changes: it already takes the other version).
- Acceptance: unit: `mergeTabs(mine, theirs)` with different answers and `theirs` shared → result keeps this tab's answers and `theirs`' share fields; R6 → after tab A's answer the store still has `sharedAt`, and tab A shows the shared line with "Withdraw shared copy" (marked out of date).

**M5. With the clipboard refused, "Copy for …" and "Copy all" open the text box at the top of the result and the page jumps there.** The box is drawn inside `#actions` (it belonged to the removed Copy summary); `ta.focus()` scrolls to it.
- Reproduction: `repro.cjs` R4 (clipboard stubbed to reject, as in a sandboxed frame): button at y=1789 (page scrolled to 1361); the box opens at y=335 right after `#actions`; page scrolled to 0.
- Fix: `ui.copy = { from: 'who:' + who | 'vendor', text }`; draw `copyBox()` right after the person's list (`.person[data-who]`) or inside the vendor fold, and remove it from `acts`; clear it on the next copy or `afterMove` as now.
- Acceptance: R4 → the box's top is within 300 px below the pressed button, `scrollY` stays within one screen of where it was, the textarea is selected; no box in `#actions`.

### Low

**L1. An old Partly answer is worded as "Don't know yet" / "Find out" outside the answers list.** `open()` and `resultModel().first` read `it.state` ('unknown') and `STATE_WORD`, not `answerWord(it)`. Visible on the Team tab ("Their action plan: Find out: “Has the person who approves spending agreed…”") right under a table that says "Not answered (earlier answer: Partly, no longer offered)". Repro: `repro3.cjs` T2; `unit.mjs` U1 (`first[].sub` = "your answer: Don’t know yet").
Fix: carry `old` in `open()` items; `task()`: `it.old ? 'Answer again: “' + it.q + '” (the earlier answer “' + OLD[it.old] + '” is no longer offered)' : …`; `first`/`people` tags use `answerWord(it)`. Acceptance: U1 sub reads "your answer: Not answered (earlier answer: Partly, no longer offered)"; T2 plan line starts "Answer again".

**L2. Team tab, copy of a use that left the catalogue: an old answer reads plainly "Partly".** `detailGone` uses `DC.ANSWER_WORD[A[m.id]]`. Repro: `repro3.cjs` T1 ("A named owner with time: Partly"). Fix: `esc(A[m.id] ? DL.answerWord({ old: DL.oldOf(A[m.id]), state: { y: 'yes', pl: 'planned', n: 'no', k: 'unknown' }[A[m.id]] }) : 'Not answered')`. Acceptance: T1 reads "Not answered (earlier answer: Partly, no longer offered)".

**L3. "Since last time" compares results made on different question sets of one use.** After "questions changed" (M5 of v2.1) the old and the new snapshot share `use` and `rules`. Repro: `unit.mjs` U4 ("Questions you answered: 18 of 18 → 17 of 17", "Verdict unchanged"). Fix: `snapshot(..., use, sig)` stores `sig: TQ.uses[use].sig`; `snapsOf`/`since` treat a different `sig` like earlier rules ("asked with other questions, not compared line by line"); `sameSnap` includes `sig`. Acceptance: U4 → `compared === false` with the new line.

**L4. Documentation and comments describe removed features.** README step 4 row (the "What does this do?" button, `ui.explain`) and result row ("Start a new check at the very bottom"); `app.js` lines 545–546 (same); `logic.js` header ("summaryText … kept for tests and the Team tab": the Team tab does not use it); `CHANGELOG.md` has no entry for `7e0530e`; `CLEANUP.md` has no v2.3/v2.4 section (no DETAIL machine, no old-answer rule) and still lists `#copy` and `#print` as stable ids; `tests/v22.test.mjs` header describes the explainer browser proof; `hub-bar.html` comment "Do you need AI? links to a department's sources". Fix: update the texts. Acceptance: `grep -n "What does this do\|very bottom\|#copy\b\|#print" tools/readiness-2/{README,CLEANUP}.md tools/readiness-2/src/app.js` finds only history notes.

**L5. Undeclared page state.** `ui.dlKind` and `ui.fileInfo` are written but not in the `ui` literal or its comment; `fileInfo` survives "Keep the one here". Fix: declare both (null), clear `fileInfo` in `confirm-no` and `afterMove`. Acceptance: `Object.keys(ui)` lists them; after "Keep the one here" `ui.fileInfo === null` (AX: add to `state()`).

Not proven (no bug claimed): the layer with no `dialog.showModal` (old browsers) leaves `state().detail` set with nothing shown; a toast fired while the layer is open sits under the backdrop. Neither reproduces in the Chromium used here.

## 3. Dead code to delete

| What | Where | Why dead |
|---|---|---|
| `.uc .ucm .exbtn[aria-expanded="true"]{…}` and the block comment "v2.2 … use-case explainer ("What does this do?")" | `src/style.css` lines 341, 344 | no `.exbtn` carries `aria-expanded` since `7e0530e`; rename the comment to "Details and sources button" |
| `catLink(d, u)` (name and unused `d`) | `src/app.js` line 456 | it no longer links to the catalogue: rename `detailButton(u)` |
| `L.summaryText` and the AX `Readiness2.summaryText` | `src/logic.js` 396–412, `src/app.js` 895 | Copy summary was removed (v2.3); no page calls it. Delete, and move its test assertions to the PDF text (they already compare both) |
| `C.SYSTEMS_NOTE` | `src/content.js` 212, 290 | read nowhere (`unit.mjs` U5) |
| `p`/`na` in `C.ANSWER_WORD` | `src/content.js` 90 | only `team.js` `detailGone` reads them; dead after L2 |
| `'use-case-catalogue'` in `OPENABLE` (optional) | `tools/hub/hub-bar.html` 96–98, `CONTRACTS.md` 121/126 | no frame sends it since v2.4; keep only if the owner wants the bridge open for later (then fix the comment) |

Not dead: the copy box (used by Copy for … / Copy all), `.printhead` and the `beforeprint`/`afterprint` handlers (browser print still works), `L.explain` and `data/explain.json` (the layer and "Where it sits" read them).

## 4. Tests that no longer test what their names say

- `tests/logic.test.mjs:177` "Copy summary carries the verdict…": there is no Copy summary; it tests the dead `summaryText`.
- `tests/v21.test.mjs:45, 47, 48, 60, 86, 98, 167` and `tests/browser/v21.cjs:93` "… in the copy text and the PDF": the "copy text" half tests the dead `summaryText`. Keep the PDF half; rename.
- `tests/browser/v23.cjs:97` "no 'What does this do?' button on the row" only checks that `#ex-gx-2` is absent (the `ex-` prefix is also used by the must-have examples, `#ex-m4`). Check the text instead: `!(await f.$('text=What does this do?'))` and `$$('#where .uc button').length === 1` per row.
- `tests/v22.test.mjs` header: the "browser proof (the 'What does this do?' button and panel)" no longer exists; the data checks below it still apply.
- No test covers the DETAIL machine across a step change, a store event, an inside click or a second tab (M1 to M3), the share fields across a file replace or a tab merge (H1, M4), or the copy box position (M5): add R1–R6 as `tests/browser/v24.cjs` and U1/U3/U4 as unit tests when fixing.

## 5. Test-suite results (24 Nov 2026, repo unchanged)

| Suite | Result |
|---|---|
| readiness-2 `logic.test.mjs` | 7,473 passed, 0 failed |
| readiness-2 `questions.test.mjs` | 917 passed, 0 failed |
| readiness-2 `flow.test.mjs` | 5,987 passed, 0 failed |
| readiness-2 `pdf.test.mjs` | 482 passed, 0 failed |
| readiness-2 `build.test.mjs` | 120 passed, 0 failed |
| readiness-2 `v21.test.mjs` | 1,205 passed, 0 failed |
| readiness-2 `v22.test.mjs` | 809 passed, 0 failed |
| readiness-2 `v23.test.mjs` | 265 passed, 0 failed |
| readiness-2 browser `walk.cjs` (port 8815) | 860 passed, 0 failed |
| readiness-2 browser `v21.cjs` (port 8817) | 610 passed, 0 failed |
| readiness-2 browser `v23.cjs` (port 8815) | 144 passed, 0 failed |
| hub `hub.test.mjs` | 21 passed |
| readiness-check `flow` · `logic` · `mustfirst` · `planned` · `v4` | 101 · 35 · 22 · 49 · 81 passed, 0 failed |
| readiness-check browser `mustfirst.cjs` · `planned.cjs` (port 8843) | 238 · 86 passed, 0 failed |

Browser screenshots went to the scratchpad (`R2_SHOTS`, `SP`), not to `reports/`. The built pages equal a fresh build. All suites are green; every bug above passes them, which is the point of section 4.

## Order of work suggested

1. H1 and M4 together (one rule: share fields survive any replacement of a check's answers), with unit tests first.
2. M1, M2, M3: make the DETAIL machine explicit (`ui.layer`), closed on every step or check change, one close path, coordinate backdrop test; decide with the owner whether phone Back closes the sheet.
3. M5 (copy box by its button).
4. L1, L2 (one `answerState` helper for the hotel page and the Team tab), L3, L5.
5. Dead code and L4 documentation, then rename or replace the tests in section 4 and add `v24.cjs`.
