# Clean-up inventory v2: "Do you need AI?" v3.0.1 (`tools/readiness-3/`, commit `c1feeda`)

*25 Nov 2026. Clean-up skill, step 1 only (inventory, read-only). No repo code was changed and nothing was committed. The reproductions are kept outside the repo in the session scratchpad folder `cleanup31/`: `unit_repro.mjs` (output `unit_repro.out`) and `browser_repro.cjs` (output `browser_repro_1280.out` and `browser_repro_360.out`).*

Read first: `CLAUDE.md` (repo), `spec/MASTER_PROMPT.md`, `README.md`, `CHANGELOG.md` (3.0.1), inventory v1 (`cleanup_inventory_v1.md`), every file in `src/`, and `tests/browser/ui.cjs` `cleanup()`. `tools/readiness-3/` still has no `CLAUDE.md` of its own.

**Parity rule.** `src/rules3.js` must stay identical in behaviour to `spec/sim_v3.py` (golden 33/33, sweep 26,935 / 0). **None of the fixes below touches `rules3.js`, and none changes a verdict or a score for any input the rules accept.** N8 (rejecting invalid answers in `send`) only stops values outside the data's answer sets from entering the record; the rules already count those as Don't know yet, so results do not move. N5 is wording only. N15 changes when `updated` is stamped, not what is scored. **No fix is flagged as verdict- or score-changing.**

## 1. Current test results (all green on `c1feeda`)

| Suite | Result |
|---|---|
| `node build.mjs` | 920 KB, 99 use cases, 794 questions, schema valid, migration table for 99 use cases, banned-term grep 0; `index.html` byte-identical to the committed one |
| `tests/banned.test.mjs` | 11 / 0 (page 0, sources 0 in 33 files, exports 0, PDF text 0) |
| `tests/build.test.mjs` | 25 / 0 |
| `tests/data3.test.mjs` | 43 / 0 |
| `tests/result3.test.mjs` | 556 / 0 |
| `tests/review.test.mjs` | 37 / 0 |
| `tests/rules3.test.mjs` | 75 / 0: golden 33/33; sweep 26,935 runs (reference 26,935), 0 verdict, score, caps or row-key diffs, byte-identical |
| `tests/store3.test.mjs` | 45 / 0 |
| `tests/browser/ui.cjs` (1280 and 360 px, `R3_SHOTS=0`) | 510 / 0 (255 per width, including the 3.0.1 `cleanup()` block) |
| `tests/browser/a11y.cjs` | 438 / 0 |
| `tests/browser/questions.cjs` | 91,214 / 0 (1,636 combinations × 2 widths, 988 with How it works open) |

The browser suites ran against `python3 -m http.server 8883 --bind 127.0.0.1` with `R3_BASE=http://127.0.0.1:8883/`; the server was stopped afterwards. `git status` is clean.

**Reproductions:** `unit_repro.mjs` 5 failing checks (N1 ×2, N8 ×3) and 3 controls passing; `browser_repro.cjs` 20 failing checks at 1280 px (19 at 360 px; N16 is skipped there because it waits 10 s) and 16 controls passing at both widths. Every failing check is one of the bugs below.

## 2. Do the 3.0.1 fixes from inventory v1 hold?

| v1 # | Holds? | Evidence |
|---|---|---|
| H1 copy box on every screen | Yes | `ui.cjs` H1 on 6 screens; control C1 (stop screen, storage blocked, Close returns focus) at 1280 and 360 px. New gap: the open box goes stale (N4) |
| H2 older file opens as a copy | **Partly** | Holds for v4 files (`ui.cjs` H2). Does **not** hold for readiness-2 files: a migrated check is stamped "now", so re-opening the same old file replaces the v3 work (N1). Navigation stamps `updated`, so a file saved a moment ago opens as a needless copy (N15) |
| H3 own-property lookups | Yes | `store3` U1a–d, `rules3` H3. `send()` itself still takes any value (N8) |
| M1 index merge | Yes | `ui.cjs` M1. A check removed in another tab while open here comes back (N14) |
| M2 conflict banner | **Partly** | Holds for the first change elsewhere (control C5). A second change in the other tab after the held write is taken over silently and the answers waiting here are lost (N2). Start a new check / Open during a conflict loses them too (N3) |
| M3 Remove asks first | Yes | `ui.cjs` M3 |
| M4 reset on open | Yes | `ui.cjs` M4. `adopt()` still does not reset `ui.mark`/`ui.warned` (cosmetic, see §5) |
| L1–L4 storage boot | Yes | `ui.cjs` L1–L4 |
| L5 focus return | Yes | `ui.cjs` L5; controls C1, C5 |
| L6 untouched checks | Yes | `store3` U3, `ui.cjs` L6. Invalid values make a check "answered" (N8) |
| L7 newer file message | Yes | `store3` U2, `ui.cjs` L7. A file error stays after leaving the cover (N7) |
| L8 import count | Yes | `store3` U4 |
| L9 Continue goes to first open | Yes | `ui.cjs` L9 |
| L10–L12 downloads | Yes | `ui.cjs` L10–L12; control C7 (declined → toast, button idle). A slow first host answer disables downloads for the session (N16); a late fallback opens on the wrong screen (N12) |
| BUILD NOW 1 (hold until How it works answered) | Yes | `questions.cjs` 1,636 combinations; controls C3 (two gates, held until both, kept over Back/Next) and C4 (None fits: 5 gates). The unanswered note counts the held-back questions (N5); no announcement when they appear (N10) |
| BUILD NOW 7 (search) | Yes | Control C2: spaces only → departments; no-match message; an 80-character unbroken query does not scroll sideways at 360 px; keyboard pick and arrow keys keep focus and choice; clearing shows the chosen use case in its department. The count is not a stable live region (N11) |
| BUILD NOW 8 (`?session=1`) | Yes, with gaps | `store3`, `ui.cjs`. The last step of the previous check is never closed (N9a); hidden time is counted (N9b) |

## 3. Implicit state machines (as of 3.0.1)

| # | Machine | Where | States | Events | Impossible or stuck states today | Action |
|---|---|---|---|---|---|---|
| M1 | Screen flow | `rec.step`; `store3.js` `place/next/back/firstOpen`; `app3.js` `go`, `send` | start, hotel, s2, stop, must, where, use, result | begin, resume, next, back, change, continue, goto, goto-mh, new, open, remove | `send('goto', <any string>)` writes an unknown step and `render()` throws (N8a). `rec.step` is still written outside `go()` in `removeCheck` (551), `openText` (627), `adopt` (638) and `boot` (713), against the header comment "The only writer is go()". | Make explicit: `go()` rejects steps not in `S.STEPS`; route the four writers through one `setStep()` that calls `place()` |
| M2 | Step 5 hold | `vUse`, `pendingRange`, `openNote('use')` | gates open (line with range), all answered (questions drawn) | answer gate, back, use change | Note counts questions not drawn (N5); no live message when they appear (N10); an invalid gate value unlocks the questions while the rules treat the gate as unanswered (N8c) | Name only, with N5, N8, N10 |
| M3 | Use-case search | `ui.q`, `searchUses`, `ucResults`, `send('search')` | empty (departments), matches, no match | input, use, dept, go (clears) | Count node replaced on each key (N11). Otherwise correct | Leave, apart from N11 |
| M4 | Persistence and save state | `ST`, `save/flush/flushNow/flushAsync`, `base`, `saveTimer` | artifact, local, memory × saved, pending, conflict | answer, navigation, flush, pagehide | **Navigation is a change**: `go()` calls `save()`, which stamps `rec.updated` (N15) | Make explicit: `save({ changed })`; only answers and hotel details stamp `updated` |
| M5 | Conflict | `ui.conflict`, `storage` handler, `adopt`, conflict buttons | none, held | storage event, theirs, mine | `held` is lost when a second event arrives after the held flush (`saveTimer` is null): silent adopt (N2). New / Open / file / Remove while held drop the answers (N3). A removal elsewhere is ignored (`newValue` null) (N14) | Make explicit: states `none | held(other)`, the storage handler refreshes `held`, replacing the check is blocked while `held` |
| M6 | File open | `openText`, `S.readFile`, `S.openMode`, `fromV2` | bad, newer, opened, copy, migrated | file, paste | A migrated file always "replaces" (N1); a just-saved file opens as a copy (N15) | Make explicit: `openMode` also takes `info` (migrated + stored → copy) |
| M7 | Copy box | `ui.copy { msg, label, text, from }`, `showCopy`, `copyBox` | closed, open | save fallback, PDF fallback, clipboard reject, Close | Snapshot text goes stale while answering (N4); a late fallback opens it on another screen (N12); its own Copy button relabels it (N13) | Make explicit: `ui.copy.kind` = save | plan | text; `save` text built at draw time |
| M8 | Downloads | `downloads()` (`dlP`), `offer`, `ui.busy` | unknown, available, unavailable; per button idle, busy | click, host answer, timeout | `dlP` memoises `null` after a 10 s timeout for the whole session (N16) | Fix N16 only |
| M9 | Session timing | `timeStep`, `ui.tStep/tRec/tAt`, `leave` | off; on × step | render, hide, close, change of check | Previous check's step never closed (N9a); hidden time counted (N9b) | Name only, with N9 |
| M10 | Storage-blocked banner | `drawBanner`, `S.hasContent` | no button, Save as file | render | Not redrawn on hotel details (N6) | Fix N6 only |
| M11 | Cover file error | `ui.fileErr` | none, bad, newer | open, leave cover | Stays after leaving the cover (N7) | Fix N7 only |
| M12 | Confirm dialog, print folds, import banner, soft stop, gates/visibility | as in v1 | — | — | None found | Leave |

AX today: `#app[data-state]`, `#app[data-storage]`, `Readiness3.state()` (step, storage, saved, use, gates, visible, open, imported, verdict, copy, busy, conflict, fileErr, session), `Readiness3.send()`. Missing: `send()` validation (N8) and a way to see why a send was refused.

## 4. Confirmed bugs

Severity: **High** = answers lost with no warning; **Medium** = wrong or misleading state, or answers lost after a warning; **Low** = rare, cosmetic, a11y polish or wording. Ids continue from v1 with an N prefix.

### High

**N1. Opening the same readiness-2 (v2.x) file again after working on it in v3 silently replaces the v3 answers.**
- **Repro:** `unit_repro.mjs` N1; `browser_repro.cjs` N1. Open `v2.7-file.json`, answer m11, go to the cover, open the same file again: the toast says "Opened the saved check.", the check keeps its id, and m11 is gone from memory and from storage. Cause: `fromV2()` sets `r.updated = now()` (`store3.js:194`), so `openMode()` always returns `replace` against the stored v3 check.
- **Fix:** in `fromV2`, keep the old stamp: `r.updated = str(old.updated, 40) || str(savedAt, 40) || now()` (pass the file's `savedAt` from `readFile`). In `openText`, when `r.info.from` (migrated) and the browser already holds `f.id` with answers, open as a copy (`S.openMode(f, stored, r.info)` returns `copy`). The boot import (`fromV2Store`) is unaffected.
- **Acceptance test:** `store3`: `openMode(readFile(v2.7 file).rec, storedNewerV3) === 'copy'` and the migrated `updated` ≤ the file's; `ui.cjs`: N1 keeps m11 in the stored check and shows "Opened as a copy: …".

**N2. A held conflict is dropped when the other tab writes again: this tab takes the other version and loses the answers waiting here.**
- **Repro:** `browser_repro.cjs` N2 (synthetic `storage` events, the same events a second tab raises). Answer s3 (pending), another tab writes → the conflict banner shows and the write is held. 120 ms later the held flush has run, so `saveTimer` is null. The other tab writes again → the handler (`app3.js:702-703`) sees no `saveTimer` and calls `adopt(other)`: banner gone, toast "Updated with the answers from another tab.", s3 lost. This defeats the v1 M2 fix after the first change.
- **Fix:** in the `storage` handler: `if (saveTimer || ui.conflict) { ui.conflict = other; drawBanner(); } else { adopt(other); … }`, so a held conflict refreshes the other version instead of adopting it.
- **Acceptance test:** `ui.cjs`: N2 keeps s3 in the record and `state().conflict === true`; then "Use the other version" takes the latest other version (s4 = dk).

### Medium

**N3. While the conflict banner is up, Start a new check, Open (a listed check), Open a saved file and Remove of the open check replace the check, and the answers the banner says are not saved are lost.**
- **Repro:** `browser_repro.cjs` N3. With the conflict held, Start a new check → the dialog says "This check stays under Your checks in this browser." → Start a new check: s3 is in no stored record. `replaceRec()` calls `resetUi()`, which clears `ui.conflict`; the held answers were never written.
- **Fix:** while `ui.conflict` is set, `askNew`, `open-check`, `openText` and `remove-check` (of the open check) do not replace the check: they move focus to `#conflict` and toast "Choose Keep my answers or Use the other version first." (`saveFile` stays allowed, so the user can keep a copy.)
- **Acceptance test:** `ui.cjs`: with the conflict held, `#new-check` opens no dialog, the record still holds s3, and focus is in `#conflict`.

**N4. With storage blocked, the "Saved check" box stays open while the user keeps answering, and its text is the old snapshot.**
- **Repro:** `browser_repro.cjs` N4. Storage blocked, answer s1, press the banner's Save as file (box opens), answer s2: the box is still open and its JSON has no s2. In memory mode this text is the only way to keep the answers, so copying it later loses everything after the box was opened.
- **Fix:** give the box a kind (`ui.copy.kind = 'save' | 'plan' | 'text'`). For `save`, build the text in `copyBox()` from `S.fileDoc(rec)` on every draw instead of storing it in `showCopy()`.
- **Acceptance test:** `ui.cjs`: open the box, answer s2, the JSON in `#copy-text` has `step2.s2 === 'yes'`; the H1 paste-back test still passes.

**N15. Moving between screens counts as a change: `go()` calls `save()`, which stamps `rec.updated`.**
- **Repro:** `browser_repro.cjs` N15a/N15b. Answer s1, Save as file (or take `fileDoc()`), press Back and Next without answering: `updated` moves. Opening that file now gives "Opened as a copy: this browser has a newer version of this check." and a duplicate check in Your checks, although the answers are the same. The same stamp makes another tab see a "change": with an answer waiting there, it raises the conflict banner when this tab only changed screens.
- **Fix:** split the stamp from the write: `save()` (answers, hotel details, Continue anyway, import seen) stamps `updated`; `go()` calls `persist()` (debounced write without a new stamp). `openMode` and `changedElsewhere` then compare real changes only. `timing` writes also use `persist()`.
- **Acceptance test:** `ui.cjs`: Back + Next leave `updated` unchanged; a file saved, then Back, reopens in place ("Opened the saved check."); the existing H2, M1 and M2 checks still pass.

**N8. The agent and test API `Readiness3.send()` takes values the page cannot draw and the rules do not know.**
- **Repro:** `browser_repro.cjs` N8a–c; `unit_repro.mjs` N8. (a) `send('goto', 'bogus')` writes `rec.step = 'bogus'`, then `render()` throws `TypeError: VIEWS[st] is not a function`; the page is stuck on the old view with `data-state="bogus"`. (b) `send('answer', { kind: 'mh', id: 'm1', value: 'maybe' })` is stored: no radio is checked, `R3Store.open()` treats m1 as answered (no "no answer yet" note), `hasAnswers()` lists the check, the rules count it as Don't know yet, and a reload drops it (`clean()`). (c) An unknown How it works value draws the questions (28 radios) with no gate radio checked, while the rules treat the gate as unanswered.
- **Fix:** validate in `send()` with one guard table: `goto` only to `S.STEPS`; `answer` only to known ids (`D.step2`, `D.must_haves`, `R.askedGates(use)`, `R.visible(...)` plus the record's hidden ones) and values from `R.answerOptions` (gate: the gate's option keys); `use` only to a use-case id or `none`; `hotel` only to the four keys (type and role from their lists). A refused send returns `false` and leaves the state as it was. In `store3.js`, make `open()` and `hasAnswers()` use the same answer sets as `clean()` (an unknown value is open and not an answer). **Verdicts and scores do not change:** the rules already count these values as Don't know yet.
- **Acceptance test:** unit N8 (open and hasAnswers); `ui.cjs` N8a–c: each send returns `false`, no page error, the record is unchanged; rules3 golden and sweep unchanged.

### Low

| # | Bug | Repro | Exact fix | Acceptance test |
|---|---|---|---|---|
| N5 | Step 5, How it works open: Next shows "8 questions have no answer yet" with one card on screen. `S.open(…, 'use')` counts the questions held back. | `browser_repro` N5 (rm-1) | In `openNote('use')`, when a gate is open: count the open gates only, "1 How it works question has no answer yet. The questions that follow count as Don't know yet. Press See the result again to go on." Wording only; `S.open` and scoring unchanged | The note's number = gate cards without an answer |
| N6 | Storage blocked, step 1: after typing the hotel name or choosing a select, the banner does not offer Save as file until the next screen (`send('hotel')` and the `input` handler do not redraw the banner). | `browser_repro` N6 | After `rec.hotel[...] = …`, call `drawBanner()` when `ST.kind === 'memory'` and `hasContent` changed | `#save-file-banner` present right after `fill('#h-name')` |
| N7 | A file error ("This file isn't a saved check…") stays on the cover after Start and Back. | `browser_repro` N7 | `go()` clears `ui.fileErr` when the step changes away from `start` | `#file-err` absent after Start → Back |
| N9 | `?session=1`: (a) the step open when another check is started or opened never gets its time (`["…", "", 0]`), because `render()` only adds time when `ui.tRec === rec.id`; (b) time while the page is hidden is counted on the step (814 ms with 600 ms hidden), because nothing resets `ui.tAt` when the page is shown again. | `browser_repro` N9a, N9b | (a) `timeStep(null)` before `flush()` in `newCheck`, `open-check`, `openText` and `removeCheck`; (b) on `visibilitychange` to visible, set `ui.tAt = Date.now()`. Owner may decide hidden time should count: then document it in the README instead of (b) | N9a: s2 ms ≥ 350 after 400 ms; N9b: hotel ms < 500 |
| N10 | Step 5: when the last How it works answer draws the questions, nothing is announced (`#live` empty); a screen-reader user hears nothing appear below. | `browser_repro` N10 | When `allG` turns true in that render, set `#live` to "<n> questions follow below." | `#live` non-empty after the gate answer |
| N11 | Search: `#uc-count` (role status) is a new node on every key, so screen readers may not read the count. | `browser_repro` N11 | Keep one `<p id="uc-count" role="status">` outside `#uc-results`; `send('search')` changes its text only | Same node before and after a key |
| N12 | A download that falls back after the user moved on opens "The plan as text" box under the banner of a question screen. | `browser_repro` N12 (host answers after 400 ms, user presses Back) | Remember the step at the click; if it changed when the fallback arrives, toast "Downloads are not available here. Use Copy on the result." instead of opening the box | No `#copybox` on step 5 |
| N13 | With the clipboard blocked, Copy inside the Saved check box replaces its label ("Saved check" → "Text to copy") and its instructions (how to reopen the text). | `browser_repro` N13 | `copy-box`: on reject, keep `ui.copy`, select the text and toast "Copying was blocked. Select the text and copy it." | Label and message unchanged after Copy |
| N14 | A check removed in another tab while open here is written back and listed again on the next answer here (the `storage` event with `newValue` null is ignored). | `browser_repro` N14 | On `e.key === REC + rec.id && e.newValue === null`: set `removed[rec.id]`, show a banner "This check was removed in another tab." with Keep it here (re-save, clear `removed`) and Start a new check | Record not written back until Keep it here |
| N16 | One slow host answer (> 10 s) to `claude.use('downloads')` makes every later download in the session fall back to Copy, because `dlP` memoises `null`. | `browser_repro` N16 (first `use()` 10.5 s, second 10 ms: only 1 call) | Memoise only a real capability; on `null` from the timeout, clear `dlP` so the next click asks again | Second click calls `use()` again and saves |

Checked and found correct (controls in `browser_repro.cjs`, both widths): stop screen with storage blocked (box, focus, Close, no horizontal scroll); search empty, no match, long unbroken query at 360 px, keyboard pick, arrow keys, clearing keeps the choice; two gates held until both answered and kept over Back/Next; None fits with 5 gates; conflict banner at 360 px, "Use the other version" with focus on the heading; a change elsewhere with nothing pending is taken over; another check's file opens under its own id; `declined` → toast and idle button; print hides buttons, banners and the copy box. Also re-checked by reading: Remove confirmation (Esc and Cancel return focus), focus after re-render for radios, department select, search results and copy box.

## 5. Dead code and stale text

| Item | Where | Why |
|---|---|---|
| D10 Stale comment "The only writer is go()" / "The only writer of rec.step" | `app3.js:11`, `:476` | Four other writers (`:551`, `:627`, `:638`, `:713`). Fix with M1's `setStep()` or correct the comment |
| D11 `ui.events` | `app3.js:57`, `:491` | Pushed on every `send()` (each search key included), never read, not in `state()`: grows without bound. Delete, or expose the last N in `state()` |
| D12 Unused `R3Store` exports | `store3.js:220-223` | `FILE_KIND`, `FILE_V`, `RULES`, `STEPS`, `TYPES`, `ROLES`, `gatesOf`, `continued` have no caller outside `store3.js`; `openCount`, `stopped`, `newOpen`, `fromV2`, `APP` only in tests. `STEPS` becomes used with the N8 guard; drop the rest from `api` or mark them test-only |
| D13 `IX.UC` | `data3.js:17` | Built, never read by the page |
| D14 `adopt()` keeps stale `ui.mark` / `ui.warned` | `app3.js:638` | Not dead, but the one replace path that skips `resetUi()`-style clearing; clear `mark` and `warned` there |
| D15 README test port | `README.md` "Tests" | Still says port 8861; `R3_BASE` works. Not wrong, just note `R3_SHOTS=0` for audit runs |

No legal code, hub bridge, `postMessage` or `#use=` is left in `src/` (`build.test.mjs`, `banned.test.mjs`).

## 6. Suggested order of work

1. **N2, then N3** (conflict state: refresh while held; block replacing while held). Re-run `ui.cjs` M1/M2.
2. **N15, then N1** (stamp only real changes; migrated files open as a copy over a stored v3 check). Re-run `store3` H2/U2–U4 and `ui.cjs` H2.
3. **N4** (copy box kinds; save text drawn live), with **N12** and **N13** in the same place.
4. **N8** (one `send()` guard table; `open`/`hasAnswers` on the answer sets), with D10 (`setStep()`). Re-run rules3 golden and sweep: must stay 33/33 and 26,935 / 0.
5. **N5, N10, N11** (step 5 and search wording/announcements), **N6, N7**.
6. **N9** (timing), **N14**, **N16**.
7. Dead code D10–D15.
8. Move the scratchpad repros into the suites: unit ones into `store3.test.mjs`, browser ones into `ui.cjs` `cleanup()` (a `cleanup2()` block, `R3_ONLY=cleanup2`).

After each step run every readiness-3 suite. None of these steps may change `rules3.js` or a verdict or score for valid answers.
