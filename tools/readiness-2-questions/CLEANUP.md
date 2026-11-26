# "Can AI solve your problems?" v2.8.1: state machines

Replaces the base tool's inventory (v2.6.1: BRIDGE, SHARE, hub handles, Team tab), which no longer applied here (inventory v28 S3).
Source: `reports/audit-readiness-2-questions/cleanup_inventory_v28.md` (25 Nov 2026); fixes in v2.8.1 (26 Nov 2026).

## Inventory

| # | Machine | Where | States | Events | Action in v2.8.1 |
|---|---|---|---|---|---|
| 1 | FLOW (step) | `flow.js` `FLOW`, `reachable`, `placeStep`, `flowNext` | start, hotel, q, stop, must, where, tailored, result | begin, next, back, change, edit, pop | Left alone (no fault) |
| 2 | STORE | `flow.js` `reduce`, `migrate`, `cleanRec` | `{v:4, cur, checks, notice}` | hotel, answer, by, cat, dept, use, pop, snap, profile, seen, new{same}, preselect, open, remove, import | Share events and fields removed (D3); answer events date a check (L6); `noProfile` (M1) |
| 3 | STORAGE | `flow.js` `STORAGE`, `storageNext`, `storageStart`; `app.js` `storageEv`, `save`, `wsSave` | ok, blocked, newer | saved, failed, newer | **Made explicit** (M2, M3, L3): one writer; never ok over newer; window.storage read-merge-write (`mergeWS`) |
| 4 | DOWNLOAD | `flow.js` `DL`, `dlNext`; `app.js` `dlSend`, `saveFile` | idle, making, saving | start, made, done, fail, timeout | 'waiting' and BRIDGE removed (D2); every save path ends in done/fail; 60 s timeout event (H1); blocked line cleared on start (L1) |
| 5 | DOWNLOAD ROUTE | `app.js` `dlRoute` | capability, link | each press | capability whenever window.claude exists on the claude.ai build (L2); always link on the public build |
| 6 | CONFIRM | `flow.js` `confirmNext` | null, {remove,id,from}, {file,from}, {new,from} | ask, yes, no, nav | `from`: focus back to the opener (L4); kept across another tab's save unless its check is gone (L5) |
| 7 | NEW-CHECK CHOICE | `app.js` new-same / new-other | asked, same, different | — | "different" carries `rec.noProfile`; the profile never refills it (M1) |
| 8 | PROFILE | `app.js` `adoptProfile`, `writeProfile` | localStorage `hftp-hotel-profile-v1` | load, store events, saves | refused for `noProfile` checks (M1) |
| 9 | PRINT VIEW | `app.js` `ui.print` | off, on | print, print-off, popstate | own history entry `{print: 1}`; Back closes it (L7) |
| 10 | COPY BOX | `app.js` `ui.copy` | null, {from: who:*, vendor, plan, saved} | copy, refusal, step change | dead origins 'dl', 'file' removed (D6) |
| 11 | DETAIL LAYER | `app.js` `ui.layer` | null, {use, from, step, check} | detail, close, Esc, backdrop, step/check change | Left alone |
| 12 | HISTORY | `flow.js` `histAction`, `histEntry`, `histRead`, `histSkip` | entries `{r2, d, prev, id, print?}` | push, back, replace, popstate | `print` flag read (L7) |
| 13 | TABS | `flow.js` `mergeTabs`, `mergeWS`; `app.js` `follow`, `wsSave` | elsewhere: null, changed, removed | storage event, pageshow, each window.storage write | `mergeWS` for window.storage (M3) |
| 14 | NOTICES | `ui.older`, `ui.gone`, `ui.notice`, `ui.corrupt`, `store.notice`, `ui.fileNote`, `ui.elsewhere` | shown / read | load, import, OK buttons, step change | Left alone (named only) |
| 15 | CHECK LIST NAMING | `app.js` `checkLine`, `checkLines` | listed / not; Not finished: step N, Stopped at step 2, result | each answer dates a check | stop said once (L8); twins get the time, then (2) (L9) |
| 16 | DATA NOTICE (public) | `app.js` `dataNotice`, `openData`, `closeData`, `setNoSend`; `collect.js` | send / don't send; notice closed / open | the two boxes, Data link, Close, Esc, backdrop | New in v2.8.1 |

## Bugs fixed (inventory v28), with the tests that prove them

| Bug | Test (failed before, passes now) |
|---|---|
| H1 download stuck in 'saving' | `tests/browser/v281.cjs` H1 (3 modes); `tests/v281.test.mjs` |
| M1 "A different hotel" refilled | v281.cjs M1; v281.test.mjs M1 |
| M2 newer window.storage store written over | v281.cjs M2; v281.test.mjs STORAGE |
| M3 two tabs on window.storage | v281.cjs M3; v281.test.mjs M3 (`mergeWS`) |
| L1 to L9 | v281.cjs L1 to L9; v281.test.mjs |

Dead code removed: D1 `catalogueName`, D2 'waiting'/BRIDGE, D3 SHARE and share fields, D4 draft, D6 `copyFallback`/`answersText`/
`copyBox('dl'|'file')`, D7 `byPerson`/`answerState` (`sourceRow` kept, marked test-only), D8 the `migrate` no-op. D5 (the "Also:"
wording) is the owner's call: not changed.

## AX handles

`#app[data-state]` (step), `data-storage`, `data-dl`, `data-layer`, `data-data` (public notice open). `window.Readiness2.state()`:
`{ step, id, hotel, Q, A, T, use, verdict, level, pct, storage, download, downloadRoute, print, confirm, build ('artifact' | 'public'),
noSend, collectOn, dataOpen, checks, … }`; `send(event, arg)` drives it with the same events the buttons send.
