# Clean-up inventory v28: "Can AI solve your problems?" standalone v2.8.0 (`tools/readiness-2-questions/`)

25 Nov 2026. Inventory only (`.claude/skills/clean-up/SKILL.md` step 1, with decisions as recommendations). No repo code changed, nothing committed. Every bug below has a failing repro kept in the scratchpad:

- Browser repros: `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/cleanup28/repro.cjs` (run `node repro.cjs [case]` with `tools/` served on 127.0.0.1:8903). Each check asserts the correct behaviour; FAIL = the bug is present today.
- Unit proofs of dead code: `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/cleanup28/unit-dead.test.mjs`.
- Fixtures: `store-one.json`, `store-three.json`, `store-twin.json`, `store-newer.json` (made by `mkfix.mjs`) in the same folder.

**Scoring:** none of the fixes below changes points, cut-offs, holds or verdicts. D5 (the "Also:" wording) changes text only. Flagged anyway where a fix touches `evaluate()` output: none does.

## 1. Test results (current code, unchanged)

Build in a scratch copy: identical to the committed `index.html` except `builtOn`. 98 use cases, 15 departments, 743 questions, 495 sources (192 from sources_v2), 63 marked thin. `data/check-questions.mjs`: 0 flagged.

| Suite | Result |
|---|---|
| actions | 9 pass |
| build | 124 pass |
| flow | 6,075 pass |
| logic | 7,559 pass |
| migration | 48 pass |
| no-legal | 410 pass |
| pdf | 2,350 pass |
| questions | 316 pass |
| scoring | 185 pass |
| sources | 28 pass |
| v21 / v22 / v23 | 1,278 / 113 / 256 pass |
| v25 / v251 / v26 / v261 | 114 / 83 / 79 / 26 pass |
| v28 | 64 pass |
| browser `questions.cjs` | 442 pass, 0 fail |
| browser `v28.cjs` (1280 and 360 px) | 102 pass, 0 fail |
| **Node total** | **19,117 pass, 0 fail** |
| repro.cjs (new) | 12 FAIL = 12 bugs reproduced (H1 x2 modes, M1 to M3, L1, L3 to L9); L2 informational |
| unit-dead.test.mjs (new) | 5 pass (dead code confirmed) |

The browser suites were run from scratch copies so their screenshots did not overwrite `reports/readiness-2-questions-screens/`. Note: CHANGELOG v2.7.1 quotes older counts (flow 6076, logic 7539, migration 29 ...); the v2.8.0 entry gives none. Record the numbers above.

## 2. State machines

| # | Machine | Where | States | Events / writers | Status | Recommendation |
|---|---|---|---|---|---|---|
| 1 | FLOW (step) | `flow.js` `FLOW`, `reachable`, `placeStep`, `flowNext` | start, hotel, q, stop, must, where, tailored, result | begin, next, back, change, edit, pop | Explicit and tested; no fault found. Step 2 needs all five; steps 3 and 5 go on with blanks (v2.7.1) | Leave |
| 2 | STORE | `flow.js` `reduce`, `migrate`, `cleanRec` | `{v:4, cur, checks, notice}` | hotel, answer, by, cat, dept, use, pop, snap, profile, seen, new{same}, preselect, open, remove, import (+ dead share, shared, unshared) | Explicit. Saves migrate v1, v2.6.1 (carry_answer_from), v2.7 (`k27`), lg-2 (removedUse). Faults: L6 (open/reload re-dates) | Remove the dead events (D3) |
| 3 | STORAGE BACKEND | `app.js` `load`, `save`, `fromWindowStorage`, `WS` | `storage`: ok, blocked, newer (+ an implicit async "WS pending") | load, each save, the async WS.get/WS.set results | **Implicit**: three backends, `storage` written from five places, one of them asynchronous. Faults M2, M3, L3 | Make explicit: `storage` from one `storeNext(state, ev)` with `ev` = ls-ok, ls-blocked, ws-ok, ws-fail, newer; never 'ok' over 'newer' |
| 4 | DOWNLOAD | `flow.js` `DL`/`dlNext`, `app.js` `dlSend`, `saveFile` | idle, making, saving (+ unreachable waiting) | start, made, done, fail | Explicit table, but `saveFile` can leave it in 'saving' for good (H1); `dlBlocked` is a separate flag that never clears (L1) | Fix H1; fold `dlBlocked` into the machine (last outcome: none, saved, cancelled, blocked) |
| 5 | DOWNLOAD ROUTE | `app.js` `dlRoute` | capability, link | evaluated at each press | Implicit; `window.claude` without `use` goes to 'link' (L2) | Name only |
| 6 | CONFIRM | `flow.js` `confirmNext`, `app.js` | null, {remove,id}, {file}, {new} | ask, yes, no, nav | Explicit; header comment omits kind 'new'. Faults L4 (focus), L5 (closed by another tab) | Fix L4, L5 |
| 7 | NEW-CHECK CHOICE (B6) | `app.js` `send('new')`, `new-same`, `new-other` | asked / same / different | — | Works, but "different" is undone by the profile on reload or Open (M1) | Fix M1 |
| 8 | PROFILE | `app.js` `adoptProfile`, `writeProfile`, `clearProfile` | profile in localStorage `hftp-hotel-profile-v1` | load, every store event, each save | Implicit; fills any check's empty hotel fields from the last hotel typed (M1) | See M1 |
| 9 | PRINT VIEW | `app.js` `ui.print` | off, on (result or stop only) | print, print-off, any step change | Implicit flag, no history entry (L7) | Name only; fix L7 |
| 10 | COPY BOX | `app.js` `ui.copy` | null, {from: who:*, vendor, plan, saved, (dl), (file)} | copy button, clipboard refused, step change | Works; `dl` and `file` origins are dead (D6) | Leave after D6 |
| 11 | DETAIL LAYER | `app.js` `ui.layer`, `syncDetail`, `closeDetail` | null, {use, from, step, check} | detail, detail-close, Esc, backdrop, step/check change | No fault found | Leave |
| 12 | HISTORY | `flow.js` `histAction`, `histEntry`, `histSkip`; `app.js` popstate | entries `{r2, d, prev, id}` | push, back, replace; popstate | No fault found beyond L7 | Leave |
| 13 | TABS | `flow.js` `mergeTabs`, `app.js` `follow` | elsewhere: null, changed, removed | localStorage `storage` event, pageshow | Works for localStorage only; no sync for window.storage (M3); clears confirm (L5) | See M3 |
| 14 | NOTICES | `ui.older`, `ui.gone`, `ui.notice`, `ui.corrupt`, `store.notice`, `ui.fileNote`, `ui.elsewhere` | each shown/acknowledged | load, import, adopt, OK buttons, step change | Seven separate flags; no fault found | Name only (one `notices[]` list later) |
| 15 | CHECK LIST NAMING (B7) | `app.js` `checkLine`, `listedIds`, `F.listed` | listed / not listed; "Not finished: step N", stop, result | each save stamps `updated` | Faults L6, L8, L9 | Fix L6, L8, L9 |

## 3. Bugs

### High

**H1. A download can stay "Preparing / Saving the PDF…" for good.** `src/app.js` `saveFile()`: in `.then(function (dl) { ... return dl.save(...).then(...) })` an error thrown by `dl.save` (synchronously) or a `save()` that returns no promise is not caught (the second argument of the outer `.then` only catches a rejected `use()`). The DOWNLOAD machine stays in 'saving'; both PDF buttons and "Save as file" stay disabled until reload. A `save()` that never settles (viewer prompt left open) has the same effect, with no timeout.
- Repro: `repro.cjs H1`: `window.claude = { use: () => Promise.resolve({ save: () => undefined }) }` (and a second mode where `save` throws). Result: `{download: "saving", disabled: true}`, page error "Cannot read properties of undefined (reading 'then')" / "x".
- Fix: wrap the call: `return Promise.resolve().then(function () { return dl.save({ filename: name, data: blob }); }).then(ok, onErr);` and add a final `.catch(function () { copyInstead(); })` on the whole chain, so every path ends in `dlSend('done' | 'fail')`. Optionally a 60 s 'timeout' event that sends 'fail' while in 'saving' (as an event, per the skill).
- Acceptance: browser test with the two mocks above (and a `save` returning `Promise.reject({})`): after 2 s `state().download === 'idle'`, `#pdf` enabled, `#dl-blocked` shown, no page error. Unit: none needed (`dlNext` is unchanged).

### Medium

**M1. "A different hotel" is undone: the old hotel comes back on reload or Open.** `adoptProfile()` runs at every page load and every store event; it fills empty hotel fields of the open check from the shared profile, which still holds the last hotel typed. `new-other` only skips it once (`noProfile`).
- Repro: `repro.cjs M1`: type "Alpha Hotel" (independent), answer Q1, Start a new check → A different hotel (hotel blank), reload → `{name: "Alpha Hotel", type: "independent"}`. The new check, its PDFs and its list name then carry the wrong hotel.
- Fix: remember the choice in the record: `reduce('new', {same:false})` sets `r.noProfile = true` (kept by `copy`, `cleanRec`, `forFile`), and `reduce('profile')` returns `no` while `r.noProfile` is set; `hotel` events clear it once the person types a name or type. Smaller alternative: clear the profile's name/type/country on `new-other`. Recommended: the record flag (the profile still helps the next "same hotel" check).
- Acceptance: browser: the M1 steps give `hotel.name === ''` after reload and after Open of another check and back; unit (flow): `reduce(new,{same:false})` then `reduce(profile,{name:'A'})` → `ok:false`.

**M2. A store saved by a newer version in window.storage is treated as 'ok' and written over.** `fromWindowStorage()` ignores `info.newer` and sets `storage = 'ok'`; the next save overwrites the newer store (version 5 → 4). The localStorage path does this right (`load()` sets 'newer').
- Repro: `repro.cjs M2` (localStorage blocked, window.storage holds `{v:5}`): `storage: "ok"`, after one event window.storage holds `v: 4`.
- Fix: in `fromWindowStorage`, `storage = info.newer ? 'newer' : 'ok'` (best through the explicit STORAGE machine, item 3). Also run `takeSnap()`/`save()` rules as `load()` does.
- Acceptance: repro M2 passes (`storage === 'newer'`, stored v stays 5, `#not-saved` shows the NEWER line).

**M3. With window.storage only (localStorage blocked), two tabs lose each other's checks.** Each tab writes its whole store; there is no `storage` event for window.storage and no read-before-write, so the last writer wins. Matters in the claude.ai viewer when localStorage is not available, and on any host that offers only window.storage.
- Repro: `repro.cjs M3`: tabs A and B each start a check; B saves last; a third tab finds 1 check, not 2.
- Fix: in `save()` when writing to window.storage, read the current value first and merge with `F.mergeTabs(store, theirs)` (the localStorage path's rule) before `set`; or poll `WS.get` on `visibilitychange`/focus and call `follow()` with it. Recommended: read-merge-write (no timer).
- Acceptance: repro M3 passes (2 checks); the existing TABS tests stay green.

### Low

**L1. "Your browser blocked the download" never goes away.** `ui.dlBlocked` is set by `blocked()` and cleared only by store events. After a later download works, the red line stays. Repro `repro.cjs L1` (capability null, then ok): line still shown. Fix: `ui.dlBlocked = false` on `dlSend('start')`. Acceptance: repro L1 passes.

**L2. `window.claude` without `use()` takes the blob-link route, which in a sandboxed frame does nothing yet toasts "Download started".** `dlRoute()` returns 'link' (repro L2, informational: route = link). Only matters if the viewer exposes `window.claude` without `use`. Fix: route 'capability' whenever `window.claude` exists; inside, a missing `use` → `copyInstead()`. Outside claude.ai (`window.claude` undefined, the public web host) the link route stays and works (browser suite `capability` and `smoke` cases). Acceptance: mock `window.claude = {}` → `#dl-blocked` shown, no "Download started" toast.

**L3. localStorage blocked + window.storage present: the cover says nothing is kept, then flips after Start.** `load()` sets 'blocked'; only the first `save()` sets 'ok'. Repro `repro.cjs L3`: cover `storage: blocked` with the NOT_SAVED line and "This browser is not keeping checks", after Start `ok`. Fix: at load, `storage = WS ? 'ok' : 'blocked'` when localStorage is blocked (part of machine 3); also, `WS.set` rejecting turns 'blocked' and the next save turns it back to 'ok' (flicker): keep 'blocked' until a set succeeds. Acceptance: repro L3 passes.

**L4. Focus is lost after Cancel on "same or different hotel" (and after Keep on a removal).** The focused button is removed by `render()`; focus falls to `<body>`. Repro `repro.cjs L4`: `activeElement: BODY`. Fix: `confirm-no` focuses the opener (remember `ui.confirm.from`: `new-top`, `new-check`, `restart`, or the row's Remove button). Acceptance: repro L4 passes; keyboard-only walk keeps focus on the opener.

**L5. A save in another tab closes this tab's open question.** `follow()` sets `ui.confirm = null` (and drops `ui.file`) on every `storage` event. Repro `repro.cjs L5`: tab A asks "same or different hotel?", tab B answers a question, A's question is gone. Fix: keep `ui.confirm` unless its target is gone (`remove` of a check the other tab removed; `file` stays). Acceptance: repro L5 passes.

**L6. Opening or just reloading a check re-dates it.** `save()` stamps `updated` on every save, and `load` saves when the open check is on its result; `open` saves too. The date in the list name ("<hotel> · <use> · <date>") and the list order then show "last opened", not "last changed". Repro `repro.cjs L6`: fixB03 (open on reload) and fixB01 (opened) both jump from 2 and 4 Nov to 25 Nov. Fix: stamp `updated` only in `reduce` for record events that change answers (hotel, answer, by, cat, dept, use, snap optional), not in `save()`; `save()` writes the store as is. Acceptance: repro L6 passes; a changed answer still re-dates.

**L7. Browser Back from the printable page leaves the result.** `print` adds no history entry. Repro `repro.cjs L7`: result + print view, Back → `tailored`, print off. Fix: `print` pushes `{r2: step, print: 1}` and popstate of that entry sends `print-off`; or leave and say "Back to the page" in the bar (already there). Recommended: the push, it matches the skill's "Back returns to a sensible state". Acceptance: repro L7 passes (`step: result, print: false`).

**L8. A stopped check says "Stopped at step 2" twice, and before the stop screen was seen.** `checkLine` puts `C.STOPPED` in the name and in the status, and uses `verdict(Q).stop` even while the check stands on step 2. Repro `repro.cjs L8`: "Gamma · Stopped at step 2: not suitable for AI · 25 Nov 2026" + status "Stopped at step 2: not suitable for AI". Fix: name part "Not suitable for AI" (or the use case), status `C.STOPPED` only when `r.step === 'stop'`, else "Not finished: step 2". Acceptance: repro L8 passes.

**L9. Two checks for the same hotel and use case on the same day have the same name.** Repro `repro.cjs L9b` (`store-twin.json`): two identical names; statuses differ only by "open now". Fix: append the time ("· 14:05") when another listed check has the same name, or number them ("(2)"). Acceptance: repro L9b passes.

### No fault found (walked or covered by the suites)
Step flow, Back and edit (flow 6,075; browser); Q1 Yes stop, "Change my answers", Start again; B2 "Also:" line and B4 single hold (v28 unit and browser); blank handling on steps 3 and 5 (Next goes on, "N of M still not answered"); auto-listing on a use-case pick, "Not finished: step N", 3 checks over a reload (v28 browser), MAX_CHECKS refusal; file open good / bad / newer / older / v2.6.1 / v2.7 / lg-2 (migration 48, questions browser); capability present / null / rejecting / declined (questions browser `capability`, repro L1); outside claude.ai (`window.claude` undefined) the blob link; Copy plan / Copy saved check / copy box when the clipboard is refused; print view open/close and `@media print`; detail layer; 360 px without horizontal scroll (v28 browser).

## 4. Dead code and stale docs (no behaviour change)

| # | What | Where | Proof | Action |
|---|---|---|---|---|
| D1 | `catalogueName()` is '' for all 98 use cases (shown name = `u.n`, both from the data file), so `#cat-name`, `#detail-catname`, `m.catName` never render | `logic.js`, `app.js` 586, 795 | unit-dead D1 | Remove, or keep only if catalogue names return |
| D2 | DOWNLOAD state 'waiting', event 'bridge', `DL_LABEL.waiting`; BRIDGE `bridgeNext` | `flow.js` 385-399, `app.js` 640 | unit-dead D2 (`bridge` always 'none') | Remove; update flow tests that drive them |
| D3 | SHARE machine (`SHARE`, `shareSettled`, `shareNext`, `shareSig`, `shareStale`), reduce events `share`/`shared`/`unshared`, record fields `share`, `sharedAt`, `sharedMode`, `sharedSig`, `keepShare` | `flow.js` | unit-dead D3 (import nulls them; no page event sets them) | Remove from code; keep reading old fields harmlessly in `cleanRec`; tests in flow (5 refs), v21 (8), v25 (3) to drop |
| D4 | `draft`/`draftText` (result and detail layer), `#draft`, `#detail-draft` | `logic.js` 158, 573; `app.js` 583, 797 | unit-dead D4 | Remove |
| D6 | `copyFallback()`, `answersText()`, `saveFile`'s third parameter, `copyBox('dl')`, `copyBox('file')`: wired but never called since B1 (`copyInstead` calls `blocked()`) | `app.js` 663-703, 563, 399 | code read: `fallback` unused in `saveFile` | Remove (Copy plan / Copy saved check replace them) |
| D7 | `sourceRow`, `byPerson`, `answerState` (export only; used by tests, not the page) | `logic.js` | grep: 0 page uses | Remove or mark test-only |
| D8 | `migrate`: `keys` / `keys.indexOf(k) < 0` no-op | `flow.js` 242-243 | code read | Remove |
| D9 | `holdItems` 'none' item has no `whoKey` (only "Start with"), fine; `RANK` comment | — | — | Leave |
| D10 | `spec/usecase_questions_only.json` (differs from `data/`; the shipped list is `spec/review/usecase_questions_fixed.json` = `data/usecase_questions_only.json`) and `spec/review/sources_fixes.json` (= data copy) | `spec/` | `cmp` | Mark as review records in README or remove the stale spec copy |
| S1 | Stale headers: `build.mjs` line 1 and `app.js` line 1 say v2.7.0; `app.js` header lists confirm kinds without 'new' and no `print`, `dlBlocked`, `gone`; `flow.js` header says store `v: 3`, "stop (Q1 = No)", BRIDGE/SHARE; `logic.js` header names `data/usecase-questions.json` and "The Team tab reads" | src | read | Update |
| S2 | `NOTES.md` describes the base tool: hub bridge, sharing, Team tab, `standalone/index.html`, the generator (`build-questions.mjs`, `excel-rows.json`, `overrides.json`, `wording.json`, `usecase-questions.json`: none in this folder), store `v: 3`, key `hftp-readiness2-v1`, file `v: 3` | `NOTES.md` | read | Rewrite for v2.8.0 (keep the v2.8.0 section) |
| S3 | `CLEANUP.md` is the base tool's (v2.6.1 inventory: BRIDGE, SHARE, hub handles, `HFTPHub`, store v3, Team tab) | `CLEANUP.md` | read | Replace with this inventory's machine table once fixes land |
| S4 | README "Build and test" uses port 8891 and the browser tests write screenshots into `reports/` (a test run changes tracked files) | README, `tests/browser/*.cjs` | run | Note it, or write screenshots only with `SHOTS=1` |
| S5 | Tests that still name the hub, Team tab, `shareNext`, `bridgeNext`: build, flow, v21, v23, v25, v251, v26, v261 | `tests/` | grep | Drop the parts for D2/D3 when the code goes |
| S6 | CHANGELOG v2.8.0 has no test counts; v2.7.1 counts are out of date | `CHANGELOG.md` | run | Add section 1's numbers |

**D5 (wording, owner):** the B2 line reads "Also: the first questions suggest this may not be worth doing with AI (Safety net: No)" for any No on questions 2 to 5, though only question 2 is about worth (unit-dead D5). Suggest "Also: your step 2 answers point away from AI here (Safety net: No)". Text only; no scoring change.

## 5. Suggested order

1. H1 (download stuck) and L1, L2 together in `saveFile`/`dlSend`.
2. Machine 3 (STORAGE explicit): M2, L3, then M3 (read-merge-write).
3. M1 (record flag `noProfile`).
4. L6, L8, L9 (check names), then L4, L5, L7.
5. Dead code D1 to D8 and docs S1 to S6, with the tests that drove the dead parts.

None of these changes scoring, cut-offs, holds or verdict wording.
