# "Do you need AI?" v2.0: clean-up inventory and decisions (steps 1 and 2 only)

*24 Nov 2026. Scope: `tools/readiness-2/` (v2.0, rebuilt 24 Nov 2026), its hub wiring (`tools/hub/hub-bar.html`, `tools/hub/CONTRACTS.md`) and the team page (`tools/readiness-check/src/team.js`). Read-only audit: nothing in `tools/` was changed. Skill: `.claude/skills/clean-up/SKILL.md`, steps 1 (Inventory) and 2 (Decide).*

## How this was checked

- Read: `README.md`, `CLEANUP.md`, `CHANGELOG.md`, `src/*`, `build.mjs`, `data/*`, `tests/*`, the hub bar, the contracts, `team.js`, the readiness check's `store.js`.
- Existing tests, all green: logic 7,473 · flow 5,987 · questions 913 · pdf 481 · build 120; `data/check-questions.mjs`: 99 use cases, 661 questions, 0 flagged.
- Node: the pure scripts loaded as `tests/load.mjs` does (scoring edge cases over 99 use cases × 15 answer mixes, `migrate`, `reduce`, guards).
- Browser: the built pages driven with Playwright (Chromium) at 1280 px and 390 px, served from `tools/` on `127.0.0.1:8816`; standalone, inside the hub (`tools/index.html`) and the team page.
- Repro ids below (A1, B3, …) are the log lines of the scripts in the session scratchpad (`dyn2clean/logic.mjs`, `data.mjs`, `a.cjs` … `e.cjs`). The scratchpad is temporary; each repro is written out so it can be redone by hand.

## Summary

- **18 state machines** found (9 are in the builder's `CLEANUP.md`; 9 are not listed there).
- **23 confirmed faults**: 2 High, 8 Medium, 13 Low. One more is unverified (print).
- **What held under attack:** the Q1 stop, the must-haves gate, tailored answers on a change of use case, the score arithmetic (no NaN, no division by zero), double-clicks on share / remove / PDF / team delete, the 390 px layout, the hub alias, v1 migration.
- **Builder's claims that do not hold:** "One download at a time" (false for *Save as file*, L1); "SHARE: settled state comes from the record" (a sent copy can be missing from the record, M2); the HISTORY row's "In-app Back and browser Back agree" is true step by step, but Back goes dead after every store event (M4).

---

## Step 1. Inventory

### 1. FLOW (where the person is in one check)

- **Lives in:** `src/flow.js` `FLOW`, `reachable`, `placeStep`, `flowNext`; written only by `reduce`; drawn by `src/app.js` `render` (`VIEWS`).
- **States:** `start` (cover) · `hotel` · `q` · `stop` · `must` · `where` · `tailored` · `result`.
- **Events:** `begin`, `next`, `back`, `change` (stop → q), `edit` (result → q), `pop(step)`.
- **Triggers:** buttons `#begin`, `#next`, `#back`, `#change`, `#edit`; `popstate`; `Readiness2.send()`.
- **Attacks that failed (good):**
  - Q1 stop: browser Back goes to `q`, Forward returns to `stop` (A2, A3). `send('pop', must|where|tailored|result)` stays on `stop` (A4). `next`, `edit`, `begin`, `back` are refused (A5). An answer to a must-have is refused on `stop` (A6). Storage edited to `step:'result'` with Q1 still No reloads on `stop` (A7). A file with Q1 No and `step:'result'` opens on `stop` (J8). `#use=` on the stop screen starts a *new* blank check; the stopped one stays stopped (A9).
  - Must-haves gate: with one must-have open, `next` is refused, `pop result` lands on `must`, a stored `step:'result'` reloads on `must` (Node).
- **Faults today:**
  - **L10.** From `stop` reached through *Change answers from the start*, browser Back shows `q`, then the stop screen four times, then `q` again (A13: `q → stop → stop → stop → stop → q → hotel → start`). The four old entries (`result`, `tailored`, `where`, `must`) are each placed on `stop`.

### 2. Hotel form and shared hotel profile

- **Lives in:** `src/app.js` `vHotel`, `readProfile`, `adoptProfile`, `writeProfile`; `flow.js` `reduce` cases `hotel`, `profile`. Shared key `localStorage['hftp-hotel-profile-v1']` (AI Register, AI Act guide).
- **States (implicit):** each of name / type / role / country is empty or set; the profile is absent, present, or disagreeing with the check.
- **Events:** `hotel {k, v}` (only on step `hotel`), `profile` (fills empty fields on load and after every store event), `save()` → `writeProfile` (writes non-empty fields only).
- **Faults today:**
  - **L2.** An optional field cannot be emptied. Repro (F1, F2): step 1, type "Hotel Secret" and choose France; clear the name and set Country back to "Choose"; reload. The record shows `name: "Hotel Secret", country: "France"` again. Cause: `writeProfile` never clears, `adoptProfile` refills empty fields.
  - Not a fault, but unnamed: country "Other" has no code, so the profile keeps the previous country.

### 3. Use-case selection and `#use=` preselect

- **Lives in:** `flow.js` `reduce` cases `cat`, `dept`, `use`, `preselect`; `app.js` `vWhere`, `fromHash` (load, `hashchange`, and first thing in `popstate`).
- **States:** nothing chosen · area · area + department · use case chosen · "None of these fits" (`use: 'none'`). Preselect: no hash · hash for a known use · hash for the open check's own use (no-op) · unknown id (ignored).
- **Events:** `cat`, `dept`, `use` (only on step `where`), `preselect` (any step).
- **Attacks that failed (good):** changing use case clears the tailored answers (`T`, `TBy`): Node `use rm-1 → rm-2` gives `T = {}`. Stale answers cannot reach the new score.
- **Faults today:**
  - **L3.** The cover says "You came here for: … It is already chosen in step 4" for a use case the person chose themselves. Repro (COV1): choose `rm-1` in step 4, go on to step 5, press Back five times.
  - **L9.** Every old link with a new use id adds a listed check that reads "Not finished: not started". Repro (T4): open `#use=fo-1`, `#use=fo-2`, `#use=fo-3` → five rows in "Your checks".
  - Mid-check behaviour (T1, L1): on step 5 of `rm-1`, a link `#use=hr-2` puts the person on the cover of a new check; the old check is kept with its answers. Works as designed; the only explanation is the "You came here for" line.
  - `#use=lg-4` ("a document, not an AI tool") is accepted (T6); the result then has no register link and no AI Act label. Name only.

### 4. Answers and "Planned" dates

- **Lives in:** `flow.js` `reduce` cases `answer`, `by`; `validDate`; `app.js` `radios`, `byField`.
- **States per question:** blank · `y` · `pl` (with or without a date) · `p` · `n` · `k` · `na` (tailored only).
- **Events:** `answer {id, value}`, `by {id, date}`; accepted only on the question's own step.
- **Good:** an impossible date is refused (`2026-02-31`, Node); the date is dropped when the answer leaves "Planned" (S2, S3).
- **Faults today:**
  - **L5.** A date in the past is accepted and printed. Repro (S1, S4): must-have 1 "Planned", date 2001-01-01 → the result's first task ends "(planned by 1 Jan 2001)". The input has no `min`.
  - **M5 (contract).** Tailored question ids are positions per area (`pe1`, `sk1`, `fi1` …), the same ids in all 99 use cases, and a saved check carries no version of its questions. Repro (Node): change the text of `rm-1` question `pe1` and load a finished check → the old "Yes" now answers the new question, the check stays on `result`, nothing is said. A question added → the check is put back on step 5, also without a word.

### 5. Scoring and verdict (derived, no stored state)

- **Lives in:** `src/logic.js` `evaluate`, `pctOf`, `areaWord`, cut-offs in `T`; words in `resultModel`, `method`.
- **States:** `noinfo` · `notready` · `almost` · `ready`; score `null` or 0–100.
- **Edge cases run (Node, `rm-1`):**

| Answers | Verdict | Score shown |
|---|---|---|
| all Yes | Ready to start a pilot | 100% ready |
| must-haves Yes, tailored all "Doesn't apply" | Ready to start a pilot | 100% ready (10 of 10) |
| must-haves Yes, tailored all "Don't know yet" | Almost ready | **100% ready** |
| must-haves all "Don't know yet", tailored all "Doesn't apply" | Not enough information yet | No score yet |
| everything "Don't know yet" | Not enough information yet | No score yet |
| 1 must-have Yes, 9 "Don't know yet", tailored "Doesn't apply" | Not enough information yet | **100% ready** (from 1 of 10) |
| 1 must-have No, all else Yes | Not ready yet | **93% ready** |
| 1 must-have Planned, all else Yes | Almost ready | 96% ready |
| "None of these fits", must-haves Yes | Ready to start a pilot | 100% ready |

- **Good:** no NaN, `undefined` or Infinity in the result, the copy text or the PDF model across 99 use cases × 15 answer mixes; zero known answers gives "No score yet", never a division by zero.
- **Faults today:**
  - **H2 (content).** The headline can contradict itself, because the score is labelled "% ready". Repro (V1): one must-have No, all else Yes → "Not ready yet · 93% ready", with the line "Too much is still missing to start". Repro (V2): one Yes, nine "Don't know yet" → "Not enough information yet · 100% ready". The same pair shows in "Your checks" (V3), the PDF and the copy text. The reason (`ev.why`) only appears inside the closed "How this was worked out" fold.
  - **M6.** "None of these fits" with all must-haves Yes gives "Ready to start a pilot" with the line "…most of what **this use case** needs is there" although no use case was chosen (O4).

### 6. STORE: saved checks, several records, current id

- **Lives in:** `flow.js` `reduce` cases `new`, `open`, `remove`, `import`, `preselect`; `listed`; `app.js` `myChecks`, `checkLine`, `listedIds`. Key `localStorage['hftp-readiness2-v1']`, `{ v: 2, cur, checks, notice }`.
- **States:** the store has 1..n checks; exactly one is `cur`; a check is listed or not (untouched checks are dropped).
- **Events:** `new`, `open id`, `remove id` (through CONFIRM), `import rec`, `preselect useId`.
- **Faults today:**
  - **L4.** More than 50 checks: a reload drops the newest ones, including the open one. Repro (AB4, AB5): 52 listed checks, open check on step 2 → reload → 50 listed, the open check is gone, a blank cover shows. Cause: `migrate` keeps the first 50 keys (the oldest), and nothing caps the store when a check is added.
  - See M3 (two tabs) and M4 (Back after a store event).

### 7. CONFIRM (remove a check, replace from a file)

- **Lives in:** `flow.js` `confirmNext`; `app.js` `send` (`remove`, `remove-yes`, `import-yes`, `confirm-no`), `ui.confirm`, `ui.file`.
- **States:** `null` · `{kind:'remove', id}` · `{kind:'file'}`. **Events:** `ask`, `yes`, `no`, `nav`.
- **Good:** double-click on "Remove for good" removes once (B4); double-click on "Replace with the file" imports once (J7).
- **Faults today:** the remove text sends the person to a page that may not exist, see H1.

### 8. File save and open

- **Lives in:** `app.js` `fileDoc`, `saveRecord`, `loadRecord`, `openFileText`; `flow.js` `cleanRec`.
- **States:** no file · file read · waiting for "replace?" (`ui.file`) · imported · refused.
- **Events:** `#save-file`, `#file-open` change, `import`, `import-yes`, `confirm-no`.
- **Good:** a file from the old readiness check and a v1-shaped record are refused (J1, J2); a tampered file cannot pass the Q1 stop (J8).
- **Faults today:**
  - **L1.** Double-click on "Save as file" saves two files (J4: 2 downloads). The JSON path runs `start → made → saving → done` in one tick, so the button is enabled again before the second click. "Download (PDF)" is safe (J5: 1 download).
  - **M5.** A file whose use case was renamed or removed opens on step 4 with nothing chosen and **no notice** (J9, J10): `openFileText` throws the `info` object away. From storage, a *renamed* use case shows "The catalogue changed…" (H2 in the log), a *removed* id shows nothing (H1 in the log).
  - **L11.** The file carries `sharedAt`, `sharedMode`, `sharedSig`. Opened in another browser it reads "shared 1 Nov 2026, out of date" although that browser never shared (J11).
  - **L8.** The message for an old readiness-check file is the generic "That file is not a check saved from this page" (J1). Since the hub no longer has that tab, the person has nowhere to open it.

### 9. Since last time (snapshots)

- **Lives in:** `app.js` `takeSnap` (in `afterMove` and on load); `flow.js` `reduce` case `snap`, `cleanSnap`; `logic.js` `snapshot`, `sameSnap`, `since`.
- **States:** 0 snapshots (first visit) · 1 · 2..20 ("Since last time" shown).
- **Events:** arriving on `result` with a result that differs from the last snapshot.
- **Faults today:**
  - **M1.** Snapshots survive a change of use case, so the panel compares two different use cases. Repro (D1–D3): finish `rm-1` with all Yes (100%); Back twice; choose `rm-2`; answer its questions No; result shows "Since last time: Score 100% → 55%. Questions you could answer: 16 of 16 → 18 of 18. Verdict: Ready to start a pilot → Almost ready". The same history goes to the team in the shared copy (`snaps`).

### 10. DOWNLOAD and BRIDGE (PDF, hub download bridge)

- **Lives in:** `flow.js` `DL`, `dlNext`, `BRIDGE`, `bridgeNext`; `app.js` `dlSend`, `hostSend`, `saveFile`, `downloadPdf`; hub side `onDownload`.
- **States:** DOWNLOAD `idle` · `making` · `waiting` · `saving`. BRIDGE `none` · `pending` · `yes` · `no`.
- **Events:** `start`, `made`, `bridge`, `done`, `fail`; `yes`, `no`, `timeout` (12 s), `error`. Hub answer timeout 120 s.
- **Good:** PDF on `result`, on `stop` (X5) and for "None of these fits" (O2) downloads once; refused on other steps.
- **Faults today:** L1 (the file path). **L7:** the PDF title is "Do you need AI? Readiness score and verdict" also on the stop PDF, which has neither (X4); the screen and the copy text say "Do you need AI? Result".

### 11. Copy and print

- **Lives in:** `app.js` `copyText`, `ui.copy`, `ui.copyText`, `toast` (3.8 s timer), `window.print`.
- **States:** copy box closed · open (clipboard refused). Toast hidden · shown.
- **Good:** with the clipboard refused the copy box opens with the text selected (Y2); in print no button is visible (Y1).
- **Unverified:** in print, the folds "Questions for the vendor", "EU AI Act", "Every question and your answer", "How this was worked out" are closed unless the person opened them (Y1). Whether their content prints was not confirmed.

### 12. SHARE (opt-in copy to the team) and share-store mode

- **Lives in:** `flow.js` `SHARE`, `shareNext`, `shareSettled`, `shareSig`, `shareStale`, `reduce` cases `share`, `shared`, `unshared`; `app.js` `shareSend`, `sharePanel`, `shareDoc`, `ui.share`; `readiness-check/src/store.js` mode `idle` · `probing` · `shared` · `local`.
- **States:** `idle` · `sending` · `shared` · `shared stale` · `withdrawing`.
- **Events:** `share`, `withdraw`, tick "also send our hotel name".
- **Good:** double-click on "Share a copy" sends once (Z1); changing an answer marks the copy "out of date" (Z2); blocked storage gives a clear toast (N3).
- **Faults today:**
  - **H1.** A shared copy cannot be withdrawn or updated once the check is no longer on its result page, although the panel promises "you can withdraw your copy at any time with the button below". Repro (Z1, B1–B4): share on the result (copy says Ready, 100%); *Change answers from the start*; Q1 = No; Next. The stop screen has no share panel and no withdraw button; `shareSend` refuses off `result`. The team still holds "ready 100%, Q1 = Yes". Removing the check says "withdraw that copy first from its result page", a page that cannot be reached; after removal the copy is orphaned (B4: 1 copy left). The same holds whenever the result is unreachable (use case removed from the catalogue, a question added).
  - **M2.** A copy can reach the team without the check knowing. Repro (C1–C3, with the save slowed to 1.5 s as on a slow network): press "Share a copy", open another check from "Your checks" before it finishes, come back. `sharedAt` is null, the button reads "Share a copy", there is no withdraw button, and the copy is in the team store. Cause: `patch()` returns when `rec.id !== id`. Same result when storage is `newer` (AB2: shared in memory, not saved, copy with the team).
  - `reduce` accepts `shared` and `unshared` on any step, without a guard (Node). Reachable only through `Readiness2.send`.

### 13. HISTORY (Back / forward)

- **Lives in:** `flow.js` `histAction`, `histEntry`, `histRead`; `app.js` `hist`, `histWrite`, `histMove`, `histAssert`, the `popstate` handler.
- **States:** entry `{ r2: step, d, prev, id }`; action `push` · `back` · `replace`.
- **Good:** in-app Back then browser Back agree and add no entries (W1: `where → must → q`, `history.length` 6 → 6).
- **Faults today:**
  - **M4.** After any store event the older entries belong to another check, and each Back press on them does nothing. Repro (G1): finish a check, press "Start a new check", press browser Back: six presses stay on the cover, the seventh leaves the page. Same after a `#use=` link mid-check (T2, T3) and inside the hub (L5: `q → hotel → start → start → start → start → start → start → AI Assessment`).

### 14. Storage availability, version and migration from v1

- **Lives in:** `app.js` `load`, `save`, `storage`; `flow.js` `migrate`, `fromV1`, `cleanRec`, `V1_STEP`.
- **States:** `ok` · `blocked` · `newer`; store version 1 (old record) · 2 · above 2; notice `v1` shown · read.
- **Good:** all four v1.3 fixtures load with the notice and keep the five answers and the use case (I); a v1 record with Q1 No lands on step 1 and reaches `stop` again after step 2; a newer store is shown and never written (AB1); blocked storage shows its line on every screen (N1, N2).
- **Faults today:**
  - **L6.** With storage blocked the cover still says "None yet. Each check you start is kept here until you remove it" (N1), and the share panel says "Outside the project hub this keeps a test copy in this browser only" just before failing (N3).
  - **L12.** Corrupt JSON in the key starts a blank store with no notice; the first save overwrites it (AB3).

### 15. Two tabs of one browser (`follow`)

- **Lives in:** `app.js` `follow`, the `storage` and `pageshow` listeners.
- **States:** this tab's store is its own · replaced by another tab's.
- **Faults today:**
  - **M3.** The open check (`cur`) is part of the shared store, so two tabs cannot hold two checks. Repro (E1–E3): tab A on step 5 of `rm-1`; tab B presses "Start a new check" → tab A jumps to the cover of B's blank check, with no message; B walks to step 3 and A follows. Inside the hub this is one frame, but a hub tab plus a bookmark of the tool, or two hub windows, hit it.

### 16. Hub tab machine, alias `readiness-check` → `readiness-2`, hash passing

- **Lives in:** `hub-bar.html` `hubNext`, `HUB_ALIAS`, `hubTool`, `OPENABLE`, the `message` handler (`open`), `nextSrc`; contract in `CONTRACTS.md`.
- **States:** `{ tool, access, pending }`. **Events:** `select`, `access`, a frame's `{ hub: 'open', tool, hash }`.
- **Good:** an `open` for `readiness-check` with `use=hr-2` lands on "Do you need AI?" with that use case preselected and clears the hash (L1); `select readiness-check` and a stored `hubTool = readiness-check` both resolve to `readiness-2` (L2, L3); the same link while that use case is open changes nothing (L4). The bar shows no "Readiness check" tab (L0).
- **Faults today:** M4 inside the hub (L5). **L8:** the old page `readiness-check/index.html` is still served under the name "AI readiness check" with no pointer to the new tool (L6).

### 17. Team page (both record kinds)

- **Lives in:** `readiness-check/src/team.js` `load`, `isDyn`, `dynRec`, `detailDyn`, `detail`, `listPanel`, `flowCard`; `RCFlow.teamNext` (`phase` `loading` · `ready` · `empty` · `error`; `del` `null` · `confirm` · `deleting`).
- **Good:** `kind:'dyn'` copies list and open with the recomputed score ("100% ready from 13 of 14 questions", the same words as the hotel's screen, P3); the page's inlined rules and questions are identical to the tool's (P6); double-click on "Delete copy" deletes once (P7); "None of these fits" copies show (P2).
- **Faults today:**
  - **M7a.** The card "Where the data goes" describes only the old check ("stage", "check-first… X1, X2a/b, XG, XL", "No 0–100 score") above copies that show a percentage (P5).
  - **M7b.** A "Do you need AI?" copy whose use case id no longer exists is counted as "1 in the old v2 format not shown" (P1).
  - The list row shows the level and score the hotel saw; the detail shows the recomputed ones. They can differ; only the detail says so (`#differs`). Name only.

### 18. Page-only flags

- **Lives in:** `app.js` `ui.missing` (refused Next), `ui.notice` (`useChanged`), `ui.open` (folds), `ui.dlKind`, `host.pong`, `toastT`.
- Small, local, reset in `afterMove`. No fault found.

### Content consistency

- **Counts across screen, PDF, copy and team page agree** for one check: "from 13 of 14 questions you could answer" (screen, PDF, team), "You could answer 13 of 14 questions (1 "Don't know yet"; 2 "Doesn't apply", not counted)", per-area lines identical on screen and in the copy text (Q1). The fold title "Every question and your answer (16)" counts the two "Doesn't apply" as well; it is right but reads as a third number.
- **Questions per use case:** 6 (50 use cases), 7 (32), 8 (16), 9 (1). None below 6 or above 10. **L13:** the cover says "Six to ten questions" and `README.md` says "6 to 10"; the data and `CHANGELOG.md` say 6 to 9.
- **Duplicates:** none. No pair of questions inside one use case shares 60% or more of its words; no tailored question repeats a must-have (50% threshold); no repeated action text.
- **Internal codes in question text:** none in the 661 questions, actions and help texts.
- **M8. Internal codes on screen elsewhere:** the "Why this matters" fold of 35 of 99 use cases prints "Evidence rows in the team's D6 evidence pack: HYB-098-04, NEX-401-06, FAC-255-11" (X1, X2). A hotel cannot open these rows, so this is a code, not a source. "D6" and "D4 × D6" appear in 7 lines of that step.
- **Three totals of use cases:** 99 (catalogue, cover and step 4), 90 ("needed for n of 90 use cases", sources note "90 catalogue use cases coded"), 91 + 8 drafts (questions from the workbook). The screen never says why 90 is not 99. Part of L13.
- **Old names shown to users:** "Readiness 2.0" and "AI starting point": none. "Readiness check": the sources note under the must-haves says "The wording follows the hub's earlier readiness check"; the team tab is still "Team: readiness results" (kept on purpose); the old page itself (L8).
- **For the source auditor:** four figures cite "State of Hotel AI, Fall 2026" with base and dates but no publisher. `CLAUDE.md` bans one publisher by name; confirm who publishes this survey and name them next to the figure.

---

## Step 2. Decide

### Action per machine

| # | Machine | Action | Reason |
|---|---|---|---|
| 1 | FLOW | **Leave** | Explicit table, guards tested, every attack on the stop and the gate failed. Only L10 (Back from stop), fixed in HISTORY. |
| 2 | Hotel form + profile | **Name only** | Small and stable, but a cross-tool contract with one real fault (L2). Document "empty means cleared" and add the clear path. |
| 3 | Use-case selection + preselect | **Name only** | Rules are right; add a `rec.from: 'link'` marker so the cover line and the list tell a preselected check from a chosen one (L3, L9). |
| 4 | Answers + Planned dates | **Make explicit (versioning only)** | Positional question ids with no version is the one place saved data can silently change meaning (M5). |
| 5 | Scoring / verdict | **Name only** | Pure function, already one block of cut-offs. The fault is wording (H2, M6), not state. |
| 6 | STORE / saved checks | **Leave**, one guard | One reducer already. Add the cap at write time (L4). |
| 7 | CONFIRM | **Leave** | Correct and tested. |
| 8 | File save / open | **Name only** | Pass `info` through; strip share fields; better refusal text (M5, L11, L8). |
| 9 | Since last time | **Make explicit** | Snapshots need a key (use case + rules) or they compare unlike things (M1). |
| 10 | DOWNLOAD + BRIDGE | **Leave**, one fix | Table is right; the file path skips the async tick (L1). |
| 11 | Copy / print | **Leave** | Trivial; check print of closed folds once. |
| 12 | SHARE | **Make explicit** | Async, 4+ states, privacy promise, two real faults (H1, M2). Share state must belong to the check id, not to the screen. |
| 13 | HISTORY | **Make explicit (one more rule)** | Store events must reset the stack position, or Back goes dead (M4, L10). |
| 14 | Storage / migration | **Leave**, wording | Works; fix the two contradictory lines (L6) and say when a corrupt store was dropped (L12). |
| 15 | Two tabs | **Make explicit** | `cur` per tab, or a visible "this check was changed in another tab" state (M3). |
| 16 | Hub alias + hash | **Leave** | Explicit, tested, held. |
| 17 | Team page | **Name only** | `teamNext` is fine; fix the card and the "old format" count (M7). |
| 18 | Page-only flags | **Leave** | Local and reset on every move. |

### Prioritised fix list

**High**

- **H1. Withdraw and update a shared copy from anywhere.**
  - Change: in `app.js`, let `shareSend('withdraw')` run on any step; show "Withdraw shared copy" (and the shared date) in the check's row in "Your checks" and on the stop screen whenever `rec.sharedAt` is set; in the remove dialog replace the sentence with a real button "Withdraw the shared copy and remove". When a shared check reaches `stop`, show "The team still has your earlier result: withdraw it or send the new one".
  - Test: share on result → edit → Q1 No → stop: `#unshare` exists, clicking it empties the team store and sets `sharedAt` to null. Remove a shared check with the new button: 0 copies left.
- **H2. Stop the headline contradicting itself.**
  - Change (wording, owner to confirm): label the number "Score: 93%" instead of "93% ready" (`logic.js` `scoreHead`); show `ev.why` as a visible line under the verdict ("Not ready yet because 1 must-have is answered No"); when the verdict is `noinfo`, show "No score yet" instead of a percentage built from under half the questions.
  - Test: the three rows marked bold in the table of machine 5 never show the word "ready" twice with opposite meaning; screen, PDF, copy text, "Your checks" and the team page all read the same string.

**Medium**

- **M1. Key the snapshots.** Add `use` and `rules` to each snapshot (`logic.js` `snapshot`, `flow.js` `cleanSnap`); `since()` compares only snapshots with the same `use`; clear nothing. Test: `rm-1` at 100%, switch to `rm-2`, result → no "Since last time" panel; switch back to `rm-1` with one answer changed → panel compares the two `rm-1` results.
- **M2. Record a finished share against its check id.** In `shareSend`, `patch` applies `shared` / `unshared` to `store.checks[id]` even when another check is open (a new `reduce` argument `{id}`), and when storage is `newer` keeps it in memory with a warning. Test: slow `RCStore.save` by 1.5 s, share, open another check, return → `sharedAt` set, withdraw button present.
- **M3. Two tabs.** Keep `cur` per tab (`sessionStorage`, falling back to the store's `cur`), and in `follow()` merge `checks` only; if the open check itself changed elsewhere, show a line "This check was changed in another tab" with a reload button. Test: tab A on step 5 of `rm-1`, tab B starts a new check → A stays on step 5 of `rm-1`; both checks are listed in both tabs.
- **M4. No dead Back.** After a store event (`new`, `open`, `remove`, `import`, `preselect`) set `hist.d = 0`; in `popstate`, when the entry belongs to another check, call `history.go(-(entries left))` once, or mark such entries so one Back leaves the tool. Simplest: on a foreign-check entry, `history.back()` again until an own or non-tool entry is reached (bounded by the entry's `d`). Test: finish a check, "Start a new check", one browser Back leaves the tool (standalone) or returns to the previous hub tab (hub); from stop after "Change answers", Back shows `q` then `hotel`, never `stop` again.
- **M5. Version the questions and say what was dropped.** Store with each check `tqSig` = a short hash of the chosen use case's question texts (built in `build.mjs`); in `cleanRec`, a different `tqSig` clears `T`/`TBy` and sets `info.useChanged`; set `info.useChanged` also when the use id no longer exists; pass `info` through `openFileText` to `ui.notice`. Reword the notice: "The questions for this use case changed since you answered. Please answer step 5 again." Test: change one question text and rebuild → a saved finished check reopens on step 5 with the notice; a file with an unknown use id opens on step 4 with the notice.
- **M6. "None of these fits" wording.** In `resultModel`, when `ev.mustOnly`, use a level line without "this use case" ("Every must-have is in place. No use case was chosen, so nothing else was checked."), and name the top verdict's limit. Test: none + all Yes → the level line does not contain "use case needs".
- **M7. Team page.** (a) Give `flowCard()` a second block for "Do you need AI?" copies (steps, points, the four verdicts, the percentage), or show the card that matches the selected copy's kind. (b) Count a `dyn` copy with an unknown use id as "1 whose use case is no longer in the catalogue", and still list it with its stored level. Test: a `dyn` copy with `useId: 'zz-9'` appears in the list; the header no longer says "old v2 format" for it; with a `dyn` copy selected the card mentions the score.
- **M8. No evidence-row codes on screen.** In `logic.js` `tailWhy`, replace the code list with "Evidence: N rows in the team's evidence file" or the row's source name; keep the codes in the JSON for the team. Test: no text matching `[A-Z]{3}-\d{3}-\d{2}` anywhere in the page with all folds open, for all 99 use cases.

**Low**

- **L1.** `saveRecord`: put `dlSend('made'); saveFile(...)` in a `setTimeout(…, 30)` as the PDF does (or ignore clicks within 600 ms). Test: double-click "Save as file" → 1 download.
- **L2.** `writeProfile`: when the person empties a field on step 1, delete it from the profile (`hotel` event with `v: ''` → remove `p.name` / `p.country`). Test: clear name and country, reload → both empty.
- **L3 / L9.** Mark preselected checks (`rec.from = 'link'`); show "You came here for…" only then; do not list a preselected check until something is answered. Test: self-chosen use + Back to cover → no line; three old links → one unlisted check at a time.
- **L4.** In `reduce` (`new`, `import`, `preselect`): when the store would exceed 50 listed checks, refuse with a message, or drop the oldest by `updated`; in `migrate` always keep `raw.cur` and the 50 newest. Test: 52 checks, reload → the open check is still open.
- **L5.** `byField`: `min` = today; `reduce` `by`: refuse a past date; show past saved dates as "was planned by …, overdue". Test: 2001-01-01 is refused.
- **L6.** With storage not `ok`: "Your checks" says "This browser is not keeping checks"; the share panel hides the "test copy in this browser" line. Test: blocked storage → neither sentence on screen.
- **L7.** One title: `pdf.js` `TITLE` = "Do you need AI? Result"; on the stop PDF "Do you need AI? Not suitable for AI". Test: `pdfModel().blocks[0].t` on stop has no "score".
- **L8.** Old readiness-check files: message "This file is from the earlier Readiness check. It cannot be opened here; open it at …/readiness-check/index.html" (the page stays published); add one line on that old page: "This check was replaced by Do you need AI? on 24 Nov 2026". Reword the sources note to "the team's earlier readiness check". Test: J1 shows the new message.
- **L10.** Covered by M4.
- **L11.** `fileDoc()`: leave `sharedAt`, `sharedMode`, `sharedSig` out; `openFileText`: ignore them. Test: J11 opens as "not shared".
- **L12.** `load()`: on corrupt JSON keep the raw text under `hftp-readiness2-v1-corrupt` and show a one-time line. Test: AB3 shows the line; the raw text is still in storage.
- **L13.** Cover and README: "Six to nine questions" (or let the cover read the min and max from `TQ`). Add to the must-haves sources note why 90 is not 99 ("the analysis covers 90 of the catalogue's 99 use cases; 8 were added later as drafts, 1 …"). Test: the cover's range equals the data's min and max.
- **Unverified.** Print with folds closed: check on paper or PDF print that vendor questions, AI Act label, answers and the working-out are printed; if not, open all `details.fold` in a `beforeprint` handler.

### Order of work suggested

1. H1 and M2 together (one SHARE change, keyed by check id).
2. H2 and M6 (wording; needs the owner's yes on "Score: n%").
3. M5 and M1 (what a saved check means: question signature, snapshot key).
4. M4 and M3 (history and tabs).
5. M7, M8, then the Low list.
