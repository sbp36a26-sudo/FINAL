# Clean-up: hub shell (19 Nov 2026)

Scope: `hub/hub-bar.html` and the generated `tools/index.html` (rebuild with `node tools/build-hub.mjs`; never edit it by hand). The cross-tool contracts are written up as state machines in `hub/CONTRACTS.md`.

## Inventory

| Machine | Where | States | Action | Why |
|---|---|---|---|---|
| Visible tab | `hub-bar.html` `hubNext` / `send` | assessment, use-case-catalogue, readiness-check, ai-act-guide, register, team | **Made explicit** | Was a free `show(tool)` called from 4 places with any string; no history; stale names loaded random folders |
| Team access | same machine (`access`, `pending`) | unknown, local, editor, viewer (+ pending team) | **Made explicit** | Was a promise plus a `hidden` flag plus a sessionStorage check; team could be asked for before access was known |
| Back/forward vs tabs | `writeHist` / `popstate` | history entry carries `hubTool` | **Made explicit** | Tabs had no entries: Back left the hub |
| Frame position | `placeFrame` + `ResizeObserver` | – | Fixed | Frame top was computed once and went stale |
| Capability lookups (db, user, downloads) | `cap()` | loading, ready, missing, timeout | **Made explicit** (named states, timeout as event) | A capability that never answered left callers waiting |
| Bridge requests (ping, download, db, open) | `onDownload`, `onDb`, message listener | per request: received → rejected / waiting → replied (exactly once) | **Made explicit**, shapes unchanged | Bad messages were half-processed |
| Assessment scroll position | `assessScroll` | – | Name only | Small; restored when you come back to the assessment tab |
| Frame src for `open` | `nextSrc` | not created / created | Leave | Local and correct |

## Bugs found and fixed (reproductions are against the version in git HEAD)

1. **Back left the hub.** Open the hub, click AI Register, then Readiness check, press Back: the browser left the page (`about:blank`). Now each tab click adds an entry; Back/forward walk the tabs, then the assessment's own `#` routes. Reload keeps the entry, so Back still works after a reload.
2. **Frame covered the bar on phones after reload.** 390 px wide, open AI Register, reload: frame `top` was 190 px but the bar was 245 px, so the red team button sat under the frame (`before-phone-reload-register.png`). The team button appears after the first layout. Now a `ResizeObserver` keeps the frame under the bar.
3. **Phone bar took a third of the screen.** Tabs stacked into a 245 px block. Now one horizontally scrolling row (65 px); the active tab is scrolled into view.
4. **Stale or unknown tab name loaded the wrong tool.** `sessionStorage.hubTool = 'readiness'` (an old tab name), reload: the old D6 research tool opened in a frame with no tab pressed. Now unknown names fall back to the assessment.
5. **Team tab could be requested for a viewer before access was known** (stored `team` tab on reload). It now waits (`pending`) and opens only for local/editor.
6. **Download with no filename was saved as a file called "undefined".** `{hub:'download', id, data}` without `filename` replied ok and saved `undefined`. Now `bad_request`.
7. **Malformed db requests** (`set` with a non-object, unknown op) went through permission checks and capability lookups before failing; now `bad_request` at once. Cross-person delete ids are cleaned like own ids.
8. **No answer meant no reply.** If a capability never answered, `ping` got no `pong` and `db` waited for the frame's own timeout. Now lookups settle within 6 s (15 s for `user`) and `db` within 7 s.

## AX handles

- `#hubBar[data-tool]`, `[data-access]` (`unknown | local | editor | viewer`), `[data-pending]` (only while team waits).
- `window.HFTPHub.state()` → `{ tool, access, pending, frames, capabilities }`.
- `window.HFTPHub.send({ type: 'select', tool })` (same event as a button; guards apply), `HFTPHub.tools`, `HFTPHub.next` (the pure transition).
- Buttons: `#hubBar button[data-tool="<tool>"]`.

## Tests

- `node tools/hub/tests/hub.test.mjs`: 13 checks of every transition and guard, plus an exhaustive walk proving no reachable state shows the team tab to a viewer.
- Browser (Playwright, desktop 1280 and phone 390, local server): every tab, frame geometry, Back/forward, reload on every tab, a stale tab name, the bridge locally and with a stand-in for claude.ai (ping/pong, download, db probe/set/list, bad requests, `open` + Back, messages from non-frames ignored), viewer mode. No console errors. No new external requests (Google Fonts only, as before). 101 checks in total with the assessment checks, all passing.

## Left for later

- The `team` frame still reloads every time you go to it (kept on purpose: a fresh list).
- A hash change in the assessment (for example "Archive" finishing after you switched tabs) brings the assessment tab back. This is rare and harmless.
- On claude.ai the artifact runs in a sandboxed frame. If `pushState` is blocked there, tabs simply do not join Back/forward (caught, same as before). Check this once on the live hub after republishing.
- Republish needs `assessment/flows.js` added to the artifact's files (new file, see `assessment/CLEANUP.md`).
