# AI Act guide: clean-up (19 Nov 2026)

What we did: we took the flows that were spread over flags and turned them into explicit state machines. Each one has a transition table and guards, and each is tested. We followed `.claude/skills/clean-up/SKILL.md`.

**Levels and plan did not change.** Before and after the change we dumped the levels, plan rows, verdict lines and owner summary for 11,060 tool, answer and origin combinations, and the two dumps are byte-identical. The owner page for the example hotel also reads the same in the old build and the new one. We did not edit any register file. `RegLogic` is still inlined from `../register/src/logic.js`, and that file is unchanged.

## Inventory

| Machine | Where | States | Action | Why |
|---|---|---|---|---|
| Screen flow | `guide.js` `NAV`/`navNext`; `app.js` `nav()` | hotel, tools, results, vendors, owner; events go / next / back / pop | **Made explicit** | Several bugs (see the list below). `nav()` is now the only place that sets the step |
| Overlay on a screen | `guide.js` `OVERLAY`/`overlayNext`; `app.js` `overlay()` | none, copy, confirmReset, confirmRestore, restoreError | **Made explicit** | Before, this was held in the ad-hoc `confirmReset` flag and the `'__owner'` copy sentinel. Confirmations could survive navigation, and the copy fallback was invisible |
| File export (PDF, backup) | `guide.js` `EXPORT`; `app.js` `exportSend()` | idle, working, done, failed; events start / done / fail / timeout | **Made explicit** | A double click gave two downloads. A hub that never answered left the export hanging |
| Vendor question | `guide.js` `setVendorStatus` / `setVendorDate` | not, asked, fine, red, plus the date asked | **Made explicit** (guarded setters) | It was possible to have "Not asked yet" with a date, or a date in the future |
| "Is it AI?" helper | `guide.js` `isAIState`, `syncIsAI` | empty, ai, unsettled, notai, notai-needs-confirmation, notai-confirmed, notai-blocked | **Made explicit** (derived) | The `notAI` value was stored and never re-derived, so a file could change a tool's level with nothing visible on screen |
| Answer status | `guide.js` `questionStatus`, `toolStatus` | question: unanswered, unsure, answered. Tool: incomplete, open, settled | **Made explicit** (derived) | Answer ids or origins that are not offered counted as answered |
| Saved data | `guide.js` `restoreState`, `SCHEMA = 1`, `MIGRATE` | v1. A newer version is refused; an older version goes through the migration table | **Made explicit** | Before, restore only checked `v === 1` and copied fields as they were |
| Autosave | `app.js` `saveState()` | saved, pending, blocked, example, empty | **Name only**, plus a flush on `pagehide` | A reload within 400 ms of typing lost the text |
| Hub bridge | `app.js` `host` | none, pending, yes, no, plus `hub` | **Name only**, plus a 30 s timeout on calls | It is small and its message shapes are unchanged |
| Welcome back | `app.js` start | shown only on a fresh visit at Hotel when own tools are saved | Name only | |
| Shared profile `hftp-hotel-profile-v1` | `app.js` | unchanged | Leave | It is a cross-tool contract; key and shape are unchanged |
| Result card open/closed, toast | `app.js` | | Leave | Local UI. Hiding the toast changes no state |

## Bugs found and fixed (with reproductions)
1. **The copy fallback showed nothing outside the Owner page.** Reproduction: on Results or Vendors, with the clipboard refused (some frames, http), press "Copy the notice". The page says "Select the text and copy it", but no box appears. Now the copy box opens at the top of the current screen.
2. **Restoring a backup silently replaced the current work.** It now asks "Replace … with the backup?" when the hotel has its own tools. A file that is not a backup gets a note that stays on screen, not a 4-second toast. A read error is handled. A file that is still being read when the person leaves the page is ignored.
3. **The reset confirmation survived Back and forward.** Reproduction: press "Start again", go Back, then Forward: the confirmation was still open. "Clear everything" could also fire twice.
4. **Reload mid-flow went back to Hotel**, even though the browser still held the Vendors history entry. Reload now stays on the same screen. Clicking the current step tab no longer adds a duplicate history entry.
5. **Invalid saved data could settle a level.** Reproduction: a backup with CCTV `mode: "bogus"` showed "Possibly high-risk" (`pending` is correct, because an answer is missing). An unknown origin did the same. A `notAI: "yes"` with no helper answers lowered a level invisibly.
6. **Vendor status:** "Not asked yet" kept its old date, and a future "date asked" was accepted. Now "not" clears the date, entering a date sets "asked", and the date field carries `max` = today.
7. **Double-clicking PDF or backup gave two downloads.** A hub that never answered left the export waiting forever. The button is now disabled while the file is made ("Preparing…").
8. **Typing and then reloading within 400 ms lost the text.** We added a flush on `pagehide` and `visibilitychange`.
9. **"Open in the AI Register" posted to any parent frame,** including a parent that is not the hub, where it did nothing. It now posts only once the hub has answered the ping, and otherwise uses a plain link.
10. **"Start again" left the hotel fields empty, but a reload refilled them** from the shared profile. Now both refill them, and the confirmation says so.
11. **Removing a tool had no way back.** The toast now offers Undo for 8 seconds.

## AX handles
- `#view[data-state]` holds the step. `#view[data-overlay]` holds the overlay. `#saved[data-state]` holds the save state. `[data-act=pdf|backup][data-state]` holds the export state.
- `.tcard` and `.wcard` carry `data-state` (incomplete / open / settled). `fieldset.qa[data-q][data-state]` holds the question status. `details.isai[data-state]` holds the helper state. `.vq[data-tool][data-vq][data-state]` holds the vendor status.
- `window.AIActGuide.state()` returns a deep-copied snapshot: `{step, overlay, save, export:{state,kind}, host, hub, welcome, example, schema, hotel, tools:[{id,type,name,tier,status,origin,questions:{id:status},isAI,vendor:{shown,summary,questions:[{status,date}]}}], data}`.
- `window.AIActGuide.send('go', step)`, `send('next')` and `send('back')` return `false` when the event is refused.

## Checks
- `node tools/ai-act-guide/tests/guide.test.mjs`: **2644 passed** (2470 before). New tests cover every transition, every guard and each impossible state that is now rejected. No existing test was changed.
- Playwright run (`scratchpad/cleanup/pw.js`, 59 checks, all passing). It covers:
  - data and a backup saved by the **old build**: loaded and restored, with the same tiers
  - the Barcelona GM case end to end, vendor statuses, the "Is it AI?" helper, remove and undo
  - the PDF (`%PDF`; a double click gives one download), save and restore with confirmation, bad file
  - Back and forward, reload mid-flow
  - inside the hub: ping, PDF, and the `open` message to the register with `#add=`
  - a 390 px phone with no horizontal scroll on every step
  - no console errors and no external requests from the guide. The hub page itself (`tools/index.html`, outside this scope) loads Google Fonts.

## Left alone
- Hash routes for the guide itself: nothing links into the guide with a hash, and history state covers Back and reload.
- Stale `done` marks for removed tools: they are harmless.
- The "Is it AI?" rule that review replies need written confirmation comes from the register (`notAIBlocked`). It is unchanged.
- `index.html` was rebuilt. It inlines the register's current CSS from `../register/src/page.html`, which another agent is editing.
