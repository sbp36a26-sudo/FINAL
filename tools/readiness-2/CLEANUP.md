# Do you need AI? v2: state machines

Rebuilt on 24 Nov 2026 to `.claude/skills/clean-up/SKILL.md`: one transition table per flow, one `send()`, state in `data-state`, a versioned store with a migration, tests for every transition and guard, and a browser walk at 1280 and 390 px.

## Inventory

| Machine | Where | States | Events | Action |
|---|---|---|---|---|
| FLOW (where the person is) | `src/flow.js` `FLOW`, `reachable`, `placeStep`, `flowNext` | `start`, `hotel`, `q`, `stop`, `must`, `where`, `tailored`, `result` | `begin`, `next`, `back`, `change`, `edit`, `pop(step)` | Explicit table with guards; `rec.step` has one writer (`reduce`). |
| STORE (the checks of this browser) | `src/flow.js` `reduce`, `migrate`, `cleanRec` | `{ v: 2, cur, checks, notice }` | `new`, `open`, `remove`, `import`, `preselect`, `snap`, `seen`, `profile`, `share`, `shared`, `unshared`, plus the record events `hotel`, `answer`, `by`, `cat`, `dept`, `use` | One reducer; every load goes through `migrate` (v1 → v2, junk dropped, step placed back, newer version never written over). |
| CONFIRM | `confirmNext` | `null`, `{kind:'remove', id}`, `{kind:'file'}` | `ask`, `yes`, `no`, `nav` | Explicit; `yes` fires once and only for what was asked. |
| BRIDGE (does the hub save files?) | `bridgeNext` | `none`, `pending`, `yes`, `no` | `yes`, `no`, `timeout`, `error` | The readiness check's own table; the 12 s timeout is an event. |
| DOWNLOAD (PDF or file) | `dlNext` | `idle`, `making`, `waiting`, `saving` | `start`, `made`, `bridge`, `done`, `fail` | One download at a time; both buttons disabled unless `idle`. |
| SHARE | `shareNext`, `shareSettled`, `shareSig`, `shareStale` | `idle`, `shared`, `sending`, `withdrawing` | `share`, `withdraw` | The readiness check's pattern; settled state comes from the record. |
| HISTORY | `histAction`, `histEntry`, `histRead` | entries `{ r2: step, d, prev, id }` | forward events push; in-app Back goes back or replaces; store events replace | In-app Back and browser Back agree; an entry of another check or a foreign entry is never read as a step. |
| Storage availability | `src/app.js` `storage` | `ok`, `blocked`, `newer` | set by `load` / `save` | Named; shown on every screen (`#app[data-storage]`). |
| Share store mode | `tools/readiness-check/src/store.js` (inlined) | `idle`, `probing`, `shared`, `local` | probe result, 8 s timeout | Left as is (the readiness check's, already explicit). |

## Guards (all tested)

- `hotel → q` needs "how the hotel is run".
- `q → stop` when Q1 is No, whatever the rest; `q → must` only with all five answered.
- `stop` is reachable only while Q1 is No; `must`, `where`, `tailored`, `result` never while Q1 is No (256 context combinations and an exhaustive 4-event walk from the stop screen).
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
- `.record()`, `.store()`, `.resultModel()`, `.summaryText()`, `.pdfModel()`, `.pdfName()`, `.fileDoc()`, `.openFileText(text)`, `.shareDoc()`.
- Stable ids: `#begin`, `#next`, `#back`, `#change`, `#edit`, `#new-top`, `#new-check`, `#pdf`, `#copy`, `#print`, `#save-file`, `#to-register`, `#share-btn`, `#unshare`, `#file-open`, `a-<question id>-<answer>` on every answer, `u-<use id>`, `cat-<area>`, `dept-<id>`, `h-type`, `h-name`, `h-role`, `h-country`.

## Proof

Unit: logic 7,473 · flow 5,987 · questions 913 · pdf 481 · build 120. Browser (`tests/browser/walk.cjs`): 822 checks at 1280 and 390 px, standalone and inside the hub: three full walks (guest chatbot `gx-2`, AI recruiting `hr-2` with the sensitive-data add-on, draft use case `fo-8`), "None of these fits", Q1 stop, reload mid-flow, Back/forward, saved-check list, file save/open, PDF download, v1 records, `#use=` links, old `readiness-check` link from the hub, team sharing and withdrawal, blocked storage. No console errors, no horizontal scroll, 44 px targets.
