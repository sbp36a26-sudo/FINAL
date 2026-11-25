# Clean-up inventory v1: "Do you need AI?" v3.0.0 (`tools/readiness-3/`)

*25 Nov 2026. Clean-up skill, step 1 only (inventory, read-only). No repo code was changed and nothing was committed. Reproductions are kept outside the repo in the session scratchpad (`cleanup3/unit_repro.mjs`, `cleanup3/browser_repro.cjs`, with their output in `unit_repro.out` and `browser_repro.out`).*

Read first: `README.md`, `CHANGELOG.md`, `REVIEW_RESPONSE.md`, `LEGAL_LEFTOVERS.md`, `spec/MASTER_PROMPT.md`, `spec/sim_v3.py`, every file in `src/`, `build.mjs`, `lib/`, `tests/`. `tools/readiness-3/` has no `CLAUDE.md` of its own; the repo `CLAUDE.md` applies.

**Parity rule.** `src/rules3.js` must stay identical to `spec/sim_v3.py` (golden 33/33, sweep 26,935 / 0). **None of the fixes below changes a verdict or a score for any input that the rules accept** (answers from the data's answer sets). Only H3 touches a value the rules read: it rejects answers that are not in the answer sets (today they produce `NaN`). That input lies outside `sim_v3.py`'s domain, so the sweep and golden cases do not move. The one existing difference from the reference, "Continue anyway caps only when there is a soft stop" (`rules3.js:118`), is already documented and cannot occur in the app, because `R3Store.continued()` is only true while a soft stop stands.

## 1. Current test results (all green)

| Suite | Result |
|---|---|
| `node build.mjs` | 898 KB, 99 use cases, 794 questions, schema valid, banned-term grep 0 (`index.html` byte-identical to the committed one) |
| `tests/banned.test.mjs` | 11 / 0 |
| `tests/build.test.mjs` | 25 / 0 |
| `tests/data3.test.mjs` | 42 / 0 |
| `tests/result3.test.mjs` | 556 / 0 |
| `tests/review.test.mjs` | 37 / 0 |
| `tests/rules3.test.mjs` | 71 / 0: golden 33/33; sweep 26,935 runs, 0 verdict, score, caps or row-key diffs, byte-identical |
| `tests/store3.test.mjs` | 31 / 0 |
| `tests/browser/ui.cjs` (1280 and 360 px, `R3_SHOTS=0`) | 376 / 0 |
| `tests/browser/a11y.cjs` | 402 / 0 |
| `tests/browser/questions.cjs` | 170,046 / 0 (1,636 combinations × 2 widths) |

Browser suites ran against `python3 -m http.server 8873 --bind 127.0.0.1` with `R3_BASE=http://127.0.0.1:8873/`. The server was stopped afterwards.

The existing suites pass, but they cover none of the bugs below. Every bug has its own reproduction in the scratchpad: **7 unit reproductions and 17 browser reproductions currently fail as expected.** One extra check passed: 360 px with the copy box open has no horizontal scroll.

## 2. Implicit state machines

| # | Machine | Where | States | Events (who fires them) | Impossible or stuck states today | Action |
|---|---|---|---|---|---|---|
| M1 | Screen flow | `rec.step`; `store3.js` `next`, `back`, `place`, `firstOpen`; `app3.js` `send`, `go`, the `goto-mh` click handler | start, hotel, s2, stop, must, where, use, result | begin, resume, next, back, change, continue, goto, goto-mh, new, open-check, openText, boot | **`goto-mh` writes `rec.step` directly** and skips `go()`/`place()`. That is safe today, because a soft stop cannot stand on `use` or `result`, but it is a second writer. **`open-check`, `openText` and `remove-check` re-render without resetting `ui`** (M2), which leaves stale `dept` and `copy` (B5, H1). Resume always returns to step 1 (L9). | Make explicit: one `send()` transition table holding the `next`/`back` maps, where `goto-mh`, `open-check` and `openText` become events that pass through `place()` and a shared `resetUi()`. |
| M2 | Transient UI | `app3.js` `ui` (`warned`, `why`, `dept`, `copy`, `fileErr`, `focus`, `toTop`, `mark`) | 8 independent fields | many handlers | `copy` set on screens that never draw it (H1); `dept` kept across checks (M4); `focus` falls back to `<body>` when the control it held is removed (L5). | Make explicit: `resetUi()` on every change of check; each screen declares which `ui` fields it shows. |
| M3 | Unanswered-items gate | `ui.warned`, `openNote`, `send('next')` | not warned, warned (per step) | next ×2, first-open | None found. A second Next goes on, as specified. | Name only. |
| M4 | Soft stop | `rec.step2` plus `rec.cont`; `store3.js` `stopKey`, `continued`, `stopped`, `place` | none, stopped, continued(key) | answer s1/s2, continue, change | None found. A new stop key needs a new Continue anyway. A stale `cont` (s1 → Yes → No again) counts as still continued: a judgement call, documented in `store3.js:11`. | Name only (document the stale-`cont` behaviour as intended). |
| M5 | Gates, visibility, contradictions, not-fit | `rules3.js` `askedGates`, `effects`, `visible`, `contradictions`; `app3.js` `gateCard`, `vMust`, `vResult`; per-use `rec.gates[use]` | per gate: unanswered, option, dk; per m2/m4: na, contradicted na | answer gate, answer mh, Change my answer, Choose another use case | None found. Visibility, re-checking and kept hidden answers match `sim_v3` across 1,636 combinations. | Leave (pure, fully tested). |
| M6 | Persistence | `app3.js` `ST` (`kind`: artifact, local, memory), `save`/`flush` (120 ms debounce), `idx { v, cur, ids }`, one record per check | artifact, local, memory; saved, pending, not saved | init, set fail, answer, flush, boot | Two tabs overwrite each other's index and records (M1, M2). A failed index read at boot writes an empty index over the real one (L1). A pending save is lost on reload or close (L2). The boot import is not written (L3). Boot has no error state (L4). Nothing visible says "saved" or "not saved yet". | Make explicit: a storage state plus an index merge-on-write, a `pagehide` flush, and boot with a `.catch` and a fallback state. |
| M7 | Checks list | `idx.ids`, `hasAnswers`, `drawMyChecks`, `remove-check`, `newCheck` | listed, not listed | flush, remove, new | Blank new checks are listed (L6). Remove deletes with no confirmation (M3). | Make explicit: listed = has a real answer; Remove goes through the confirm dialog. |
| M8 | Confirm dialog | `#confirm`, `askNew`, `closeConfirm` | closed, open (new) | new, new-yes, new-no, Esc | It asks on an untouched new check (L6). | Name only; reuse it for Remove and for opening a file over a newer check. |
| M9 | File open | `openText`, `S.readFile`, `fromV2`, `clean`, `ui.fileErr` | idle, error, opened (v3), opened (migrated) | file input, paste, FileReader error | An older file silently replaces newer answers in the same check (H2). A newer file gets the generic error (L7). Odd answer values become `NaN` (H3). | Make explicit: a result union (`opened`, `migrated`, `newer`, `bad`, `conflict`). |
| M10 | Migration | `store3.js` `fromV2`, `fromV2Store`; boot import from `hftp-readiness2-v1` | — | boot, file | The import is not persisted (L3). "N new questions" counts every unanswered item (L8). In production, a new artifact has its own origin, so readiness-2's `localStorage` is never visible there (D1). | Name only, with the fixes below. |
| M11 | Downloads | `downloads()` (memoised `dlP`), `offer`, `downloadPdf`, `saveFile` | unknown, available, unavailable; per save: pending, saved, declined, busy, fallback | Download (PDF), Save as file | No pending state while `use()` waits (up to 10 s on a host that does not answer) (L10). A synchronous throw from `save()` is unhandled and shows nothing (L11). | Make explicit: a per-button state (`idle`, `waiting`, `saved`, `declined`, `fallback`) with `aria-busy`. |
| M12 | Copy fallback | `copyText`, `showCopy`, `ui.copy` | none, copy box open | copy, copy-person, copy-box, copy-close, clipboard reject | The box is drawn only on stop and result (H1). Focus is lost on Close (L5). | Covered by H1 and L5. |
| M13 | Print folds | `beforeprint`/`afterprint` with `data-was` | normal, printing | print events | None (double `beforeprint` handled). | Leave. |
| M14 | Import banner | `rec.imported.seen` | shown, seen | imported-ok | Focus is lost on OK (L5). | Leave, apart from L5. |

AX today: `#app[data-state]` holds the step; `data-storage`; `window.Readiness3.state()` and `send()`. Missing: the save state (saved, pending, memory), the download state, the file-open result and the copy-box state.

## 3. Confirmed bugs

Severity: **High** = answers lost or the user stuck with no feedback; **Medium** = wrong or confusing state with a way out; **Low** = rare, cosmetic, a11y polish or wrong wording.

### High

**H1. With storage blocked and no downloads, "Save as file" in the banner does nothing on the cover and on steps 1–5.**
- **Repro:** `browser_repro.cjs` B1. Block `localStorage` (the banner says "Use Save as file"), go to step 2, press **Save as file** in the banner. `offer()` falls back to `showCopy()`, which sets `ui.copy`, but only `vStop`/`vResult` draw `copyBox()`. Nothing appears, focus does not move, and there is no toast. The answers are lost when the tab closes, and this is the very mode in which the tool tells users to use this button. The stale `ui.copy` is also drawn later if a check is opened straight onto a result (`open-check`/`openText` do not clear `ui.copy`).
- **Fix:** draw `copyBox()` on every screen, right under `#banner` (or in the banner), and clear `ui.copy` in a shared `resetUi()` that is called by `go`, `open-check`, `openText` and `remove-check`.
- **Acceptance test:** `ui.cjs` with storage blocked and no `window.claude`: on cover, hotel, s2, must, where and use, pressing the banner's Save as file shows `#copybox` containing a valid `hftp-do-you-need-ai` v4 document, and that document re-opens through the paste box with the same answers.

**H2. Opening an older saved file of the same check silently overwrites newer answers.**
- **Repro:** B4. Save the check as a file (s1 answered), answer s2 and s3, then open the file. `openText` keeps the file's `id`, so `save()` writes over `hftp-readiness3-v1_c_<id>`. s2 and s3 are gone from memory and from storage, with no dialog.
- **Fix:** in `openText`, if `idx.ids` already holds `r.rec.id` (or it is `rec.id`) and the stored record's `updated` is later than the file's, open the file as a copy: give it a new id via `S.newId()` and say "Opened as a copy: this browser has a newer version of this check". Alternatively, ask through `#confirm` with "Replace" or "Open as a copy". A newer or equal file may replace without asking.
- **Acceptance test:** a store3 or app test: file `updated` < stored `updated` → both records exist afterwards and the stored one is unchanged. Browser: B4 shows s2 and s3 still stored.

**H3. Answer values named after `Object.prototype` members pass the answer whitelists, and the score becomes `NaN`.**
- **Repro:** `unit_repro.mjs` U1. A v4 file with `mh.m1: "constructor"` (or `qa: "toString"`, `step2.s3: "valueOf"`) passes `clean()`, because `CHK_OK[a]` and `S2_OK[a]` read inherited members. `evaluate()` then gives `score NaN` and the verdict "Almost ready", and the result shows "Readiness score: NaN%". `fromV2` stores *functions* as answers (`OLD['toString']`). Rules `ANS[raw]` and `Fc[a]` have the same gap.
- **Fix:** look values up with `own(CHK_OK, a)` and `own(S2_OK, a)` in `clean`, and `own(OLD, x)` and `own(OLD_S2, x)` in `fromV2`. Defence in `rules3.js`: `Object.prototype.hasOwnProperty.call(ANS, raw)`. This does not change parity, because every accepted value gives the same result as before.
- **Acceptance test:** U1a–d fail today and pass after the fix. `rules3.test.mjs` golden and sweep stay 33/33 and 26,935 / 0.

*(H3 is ranked High because the visible output is wrong (`NaN%`, a verdict computed from `NaN`), even though it needs a corrupt or hand-edited file.)*

### Medium

**M1. Two tabs, two checks: each tab writes its own index, so the other tab's check disappears from "Your checks".**
- **Repro:** B2. Open tabs A and B, start a check in each, and the index lists 1 of 2 stored records. The orphaned record stays in storage but can never be opened or removed.
- **Fix:** in `flush()`, read the stored index first and merge it (union of `ids`, minus ids removed in this tab, tracked in a `removed` set). Listen to `storage` events (in `localStorage` mode) and re-read `idx`, then redraw the list on the cover.
- **Acceptance test:** B2 lists 2 of 2.

**M2. The same check open in two tabs: the last writer replaces the whole record.**
- **Repro:** B3. Tab C answers s3 and tab E answers s4. After a reload only s4 is there.
- **Fix (smallest):** on a `storage` event for the open record's key, reload `rec` if the stored `updated` is newer and the tab has no pending save. If it has a pending save, show the banner "This check was changed in another tab" with a Reload button. A field merge is not needed.
- **Acceptance test:** B3: tab C's answer survives, or tab E shows the banner before overwriting.

**M3. Remove deletes a check with one click: no confirmation and no undo.**
- **Repro:** B6. The skill requires that confirmations for destructive actions cannot be skipped.
- **Fix:** route `remove-check` through `#confirm` ("Remove this check? It cannot be brought back. Save it as a file first if you may need it.") with Remove and Cancel, and return focus to the list afterwards.
- **Acceptance test:** clicking Remove opens the dialog. Cancel keeps the record; Remove deletes it. Focus is on the next list item, or on the "Open a saved file" heading.

**M4. Stale department after opening another check.**
- **Repro:** B5. `ui.dept` survives `openText` and `open-check`. The opened check uses hr-1, but step 4 shows "Revenue Management", so the chosen use case is not in the list and its radio is not visible.
- **Fix:** `resetUi()` (see H1) clears `ui.dept`, `ui.why`, `ui.warned`, `ui.mark` and `ui.copy` whenever `rec` is replaced (`open-check`, `openText`, `remove-check` of the current check).
- **Acceptance test:** B5 shows the department of hr-1 with the hr-1 radio checked.

### Low

| # | Bug | Repro | Exact fix | Acceptance test |
|---|---|---|---|---|
| L1 | A failed read of the index (or of the current record) at boot is treated as "no data". A fresh index is then written over the real one, and earlier checks are orphaned. Only on the `window.storage` path, whose API is not in the artifact contract 0.2.99, so it is likely absent in production. | B8 (fake `window.storage` whose `get` rejects once): 1 listed, 2 stored | In `ST.get`, distinguish "missing" from "failed": a rejection that is not not-found → `ST.fail()` (memory, with the banner), and do not write the index this session. | B8 keeps 2 listed |
| L2 | The 120 ms debounce: an answer followed by a reload or close within the delay is lost. | B9 | `pagehide` and `visibilitychange` (hidden) → `flush()` | B9 keeps s2 |
| L3 | The first-visit import of readiness-2 checks is not written to the v3 index. Until the user answers something, every load re-imports, and the "imported once" claim does not hold. | B10a (`localStorage[hftp-readiness3-v1]` is `null` after import) | After the import's `Promise.all`, write `ST.set(KEY, JSON.stringify(idx))` | Index present after the first load |
| L4 | Boot has no `.catch` and no timeout. If the storage probe or a read never settles (or throws), the page stays blank (`ready=false`, empty view). | B13 (`window.storage.set` pending) | Race `ST.init()` and the first `get` against a 3 s timer → memory; `.catch` → memory and render | B13 renders the cover with the memory banner |
| L5 | Focus falls to `<body>` after Close on the copy box, OK on the import banner, and Remove. | B11a, B11b, B11c | Close → focus the button that opened the box (store its id in `ui.copy.from`); OK → `#h`; Remove → the next list item or `#mine-h` | `document.activeElement` is not `BODY` after each of the three |
| L6 | "Start a new check" carries the hotel name, so `hasAnswers()` is true for an untouched check. It is listed under Your checks (3 listed after 1 real check and 2 new ones), and the next "Start a new check" asks for confirmation for nothing. | B12a, B12b, U3 | Split `hasAnswers` into `hasAnswers` (step 2, must-haves, use, qa, gates) and `hasContent` (also the hotel name). Use `hasAnswers` for the index, the list and `askNew` | B12: 1 listed, no dialog on the untouched check |
| L7 | A file from a newer version (v > 4) gets "This file isn't a saved check from this tool." | U2 | `readFile` returns `{ newer: true }`. Message: "This file was saved with a newer version of this tool. Open it there." | Unit: v 5 → `newer` |
| L8 | The import banner says "please answer N new questions", but N counts every unanswered item (an empty v2 check reports 24: step 2, must-haves, gates, questions). | U4 | Count only ids that did not exist in v2.6.1 (m11, gates, `n*`, gate-added, unmapped), or reword to "N questions still need an answer". This is wording only; scores do not change. | Unit: an empty v2 check reports only the new ids |
| L9 | "Continue this check" always returns to step 1 (`resume` → `hotel` when `rec.step` is `start`). It should go to the first screen with something to answer. | Read: `app3.js:341` | `resume` → `go(S.firstOpen(D, rec))` (or the last step kept in `rec.lastStep`) | ui: Back to the cover from step 5, then Continue → step 5 |
| L10 | Downloads: no pending state while `claude.use('downloads')` or `save()` waits (a host that never answers resolves `null` only after 10 s). Repeated clicks pile up `save()` calls, and the second gets `rate_limited`. | B7b | Per-button state: `aria-busy="true"`, disabled, label "Preparing…" until settled; ignore clicks while busy | B7b: busy shown, one `save` call |
| L11 | Downloads: a synchronous throw from `save()` becomes an unhandled rejection; no copy box, no message. | B7a (pageerror "TypeError: detached") | Wrap the call: `Promise.resolve().then(() => dl.save(...))`, and add a final `.catch(() => fallback(T.noDl))` in `offer` | B7a shows the copy box |
| L12 | A `save()` error other than `declined` or `rate_limited` (for example `too_large`, `host_unavailable`, `bad_request`) says "Downloads are not available here" even though the capability exists. | Read: `app3.js:403-408` | Keep the Copy fallback, with the message "The file couldn't be saved here. Use Copy instead." for codes other than `unavailable`, `not_granted` and `capability_*` | Unit-level fake per code |

Checked with no bug found: Back on every screen keeps answers; soft stop, Change my answers and Continue anyway; a second soft stop needs a new Continue; Doesn't apply contradictions on step 3, step 5 and the result, with "Change my answer"; the not-fit note and "Choose another use case"; recomputing visibility when a gate changes (hidden answers kept and not counted); the top 3 being identical across screen, Copy and PDF; storage blocked → banner; PDF failure → its message and Copy; clipboard blocked → copy box; downloads null → Copy; `declined` → toast; good v4, v2/v3 (readiness-2) and bad files; v2 store migration; keyboard-only run; 360 px (including the open copy box); print (folds open and close).

## 4. Dead code and stale text to delete

| Item | Where | Why |
|---|---|---|
| D1 First-visit import from `hftp-readiness2-v1` | `app3.js:16`, `:486-490`; README "On a first visit, checks of readiness-2 in the same browser are imported once" | A new artifact has its own origin, so readiness-2's `localStorage` (hub artifact origin) is never visible in production. **Owner decision:** delete it (the file migration remains the real path) or keep it for local or same-origin use, fix L3, and correct the README. |
| D2 `window.storage` branch | `app3.js:34-64` | Not part of the artifact runtime contract 0.2.99 (only `window.claude.use`). The spec asks for a feature check, so keep it but label it "optional, untested in the viewer". Fix L1 and L4 if it stays. |
| D3 `var ok = false` and `if (!ok)` | `app3.js` `copyText` (lines 386-388) | `ok` is never set; the line is always true. |
| D4 `R3Rules.answerOptions` | `rules3.js:90-94` | Used only by tests. `app3.js` `vMust`/`qCard` duplicate the choice (`m.na ? check_da : check`). Either use it in the app or delete it and point the test at the data. |
| D5 `R3Rules.notFit`, `R3Rules.task` (exports) | `rules3.js:82-84`, `:223` | No caller outside `rules3.js` (`evaluate` computes not-fit inline). |
| D6 `R3Data.label`, `IX.S2` | `data3.js:18-19`, `:32` | `label` is used only by `data3.test.mjs`; `S2` is never read. |
| D7 `R3Store.V` | `store3.js:19`, `:177` | Unused (the index carries its own `v: 1` in `app3.js`). |
| D8 Stale comment | `pdf3.js:1` "tests/pdf3.test.mjs" | That file does not exist; the PDF is tested in `result3.test.mjs` and `banned.test.mjs`. |
| D9 `R3Result.ansLabel` export | `result3.js:120` | Internal only. |

There is no hub bridge, `postMessage`, `#use=`, legal code or v2 answer set (Partly, Doesn't apply on questions) left in `src/` (`build.test.mjs` asserts this). The data's answer sets are only `step2` (yes, no, dk), `check` (yes, planned, no, dk) and `check_da` (adds na). The CSS has no unused selectors: `v-hi`, `v-md`, `v-lo` and `v-na` are built from `m.tone`.

**Stale tests:** none fail and none encode a bug. The browser tests default to port 8861; using `R3_BASE` works. `ui.cjs` writes screenshots into `reports/readiness-3-screens/` unless `R3_SHOTS=0`, so remember that flag in audit runs.

## 5. Suggested order of work

1. **H1, M4 and L5 together:** `resetUi()`, the copy box on every screen, and focus return.
2. **H2, then L7:** the file-open result union and opening as a copy.
3. **H3:** own-property checks. Re-run rules3 golden and sweep to confirm 33/33 and 26,935 / 0.
4. **M3 and L6:** the confirm dialog for Remove, and `hasAnswers` without the hotel name.
5. **M1, M2, L2, L3:** index merge-on-write, the `storage` event, the `pagehide` flush, and persisting the import.
6. **L10, L11, L12:** the download button state.
7. **L1, L4, D1, D2:** the storage-path decisions.
8. **Dead code D3–D9.**
9. Add the scratchpad reproductions as tests: unit ones to `store3.test.mjs`, browser ones to `ui.cjs`.

After each step, run every readiness-3 suite. None of these steps may change `rules3.js` behaviour for valid answers.
