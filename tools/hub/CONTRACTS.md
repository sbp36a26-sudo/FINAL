# Hub contracts

The hub page (`tools/index.html`, built by `node tools/build-hub.mjs` from `assessment/index.html` + `hub/hub-bar.html`) is the AI Assessment with the hub bar on top. Every other tool runs in a same-origin `<iframe>` under the bar. Only the main page can use the artifact's capabilities on claude.ai (`window.claude.use('db' | 'user' | 'downloads')`), so the frames ask the hub page to act for them.

Four contracts cross app boundaries. Their shapes are frozen: change a shape only together with every app that uses it.

| Contract | Owner (answers) | Callers | Where |
|---|---|---|---|
| postMessage bridge (`ping`, `download`, `db`, `open`) | hub bar | register, ai-act-guide, readiness-check (`index.html`, `team.html`), readiness-2 (`open`; `ping` and `download` since v1.1, 23 Nov 2026) | `hub/hub-bar.html` (bridge section) |
| Hub tabs (which tool shows) | hub bar | user, Back/forward, `open` messages | `hub/hub-bar.html` (machine block) |
| Shared hotel profile `localStorage['hftp-hotel-profile-v1']` | nobody (shared) | register, ai-act-guide, readiness-check (read and write); readiness-2 (reads `name` only, never writes) | each app |
| Hash links `#use=` and `#add=` | the receiving app | register / readiness-2 → readiness-check, readiness-check / ai-act-guide → register | each app |

All messages are `window.postMessage(msg, location.origin)`. The hub reads a message only if `event.origin === location.origin`, `msg` is a plain object with a string `hub` field, and `event.source` is one of the hub's own frames. Frames read a reply only if `event.source === window.parent`.

---

## 1. Hub tabs

Tab order: AI Assessment · Use-Case Catalogue · **Readiness 2.0** (added 23 Nov 2026, tooltip "Start here: is AI the answer, and where?") · Readiness check · AI Act guide · AI Register · Team: readiness results. `readiness-2` loads `readiness-2/index.html` (the default `<tool>/index.html` path).

State, held only by `send()` in `hub-bar.html` (pure transition `hubNext`, tested in `hub/tests/hub.test.mjs`):

```
{ tool:    'assessment' | 'use-case-catalogue' | 'readiness-2' | 'readiness-check' | 'ai-act-guide' | 'register' | 'team',
  access:  'unknown' | 'local' | 'editor' | 'viewer',
  pending: 'team' | null }
```

| From | Event | To | Notes |
|---|---|---|---|
| any | `select(t)`, t not in the list | unchanged | stale `sessionStorage`, typos, frames |
| any | `select(t)`, t ≠ team | `tool = t`, pending cleared | |
| access local/editor | `select(team)` | `tool = team` | |
| access viewer | `select(team)` | unchanged | team list is Editors only |
| access unknown | `select(team)` | `pending = team` | shown once access is known |
| unknown | `access(local / editor)` | access set; pending team opens | |
| any | `access(viewer)` | access set; team tab or pending team → assessment | |

Who sends what:

- **Hub button** → `select(t)`, adds a Back/forward entry (`history.pushState({ hubTool: t })`, URL unchanged). Pressing the team button again reloads its list.
- **Back/forward** (`popstate`) → `select(history.state.hubTool || 'assessment')`. Entries the assessment makes with its own `#hash` routes carry no `hubTool`, so they belong to the assessment tab. Entries the tools push inside their frames move only that frame.
- **Frame `open` message** → `select(tool)` with a Back/forward entry (Back returns to the asking tab).
- **Capability answer** → `access(...)`: no `window.claude` → `local`; `user.canEdit()` true → `editor`; false, refused or no answer within 15 s → `viewer`.
- **Start / reload**: the current history entry's `hubTool`, else `sessionStorage['hubTool']`, else `assessment`; unknown names fall back to `assessment`.

Read it: `window.HFTPHub.state()` → `{ tool, access, pending, frames: [...], capabilities: { db, user, downloads: 'loading' | 'ready' | 'missing' | 'timeout' } }`, and `#hubBar[data-tool][data-access][data-pending]`. Drive it: `window.HFTPHub.send({ type: 'select', tool })`.

Layout: the frame box sits at `top = bar height`, kept right by a `ResizeObserver` on the bar (the bar changes height with the window, fonts and the team button).

---

## 2. postMessage bridge

Timeouts are events, not silent waits. The hub settles every capability lookup within 6 s (15 s for `user`) and every `db` request within 7 s, so a reply always arrives before the frames' own timeouts (ping 12 s, db 8 s). `download` is not timed out by the hub: it waits for the person's save prompt.

### ping → pong

```
frame → hub   { hub: 'ping' }
hub → frame   { hub: 'pong', downloads: true | false }
```

Frame side (register, ai-act-guide, readiness-check, readiness-2): `host = 'pending'` → `'yes'` (pong, downloads true) | `'no'` (pong false, or no pong in 12 s, or not in a frame: `'none'`). `'no'` means the frame falls back to its own download link.

Hub side: `downloads` is whether `window.claude.use('downloads')` gave a capability (false locally, false after 6 s without an answer).

### download → download-result

```
frame → hub   { hub: 'download', id: string, filename: string, data: string | Blob }
hub → frame   { hub: 'download-result', id, ok: true }
            | { hub: 'download-result', id, ok: false, code }
```

| code | meaning |
|---|---|
| `bad_request` | `filename` missing, empty or over 200 characters, or `data` missing (checked by the hub before anything else) |
| `unavailable` | no downloads capability here (local, or no answer in 6 s) |
| `declined`, `rate_limited`, … | passed through from `downloads.save()` |

States per request, hub side: `received` → `bad_request` reply | `waiting for capability` → `unavailable` reply | `saving` (person sees the save prompt) → ok / error reply. Exactly one reply per request.

### db → db-result

Used only by readiness-check (`src/store.js`): the client's own mode machine is `idle → probing → shared | local` (probe answered ok → shared; error, no hub or 8 s → local).

```
frame → hub   { hub: 'db', id: string, op: 'probe' | 'list' | 'set' | 'delete', col: 'readiness', doc?: string, data?: object }
hub → frame   { hub: 'db-result', id, ok: true }                    (probe, set, delete)
            | { hub: 'db-result', id, ok: true, docs: [ {..., _id: '<person>/<check>'} ] }   (list)
            | { hub: 'db-result', id, ok: false, code }
```

| op | doc | who may | storage path |
|---|---|---|---|
| `probe` | – | anyone | none (answers whether db + user capabilities exist) |
| `list` | – | Editors / owner / local | every `readiness/<person>/checks/*` |
| `set` | `<check id>` | anyone | `readiness/<me>/checks/<check id>` (and touches `readiness/<me>`) |
| `delete` | `<check id>` | anyone | `readiness/<me>/checks/<check id>` |
| `delete` | `<person>/<check id>` | Editors / owner | `readiness/<person>/checks/<check id>` |

Ids are cleaned to `[A-Za-z0-9_-]`. `data` must be a plain object.

| code | meaning |
|---|---|
| `bad_request` | `col` is not `readiness`, unknown `op`, `set`/`delete` without a usable id, `set` without an object |
| `not_allowed` | `list` or a cross-person `delete` by a viewer |
| `unavailable` | no db or user capability (local, or no answer in 6 s), or a db error without a code |
| `timeout` | the hub had no answer from the db within 7 s |
| other | passed through from the db |

### open (no reply)

```
frame → hub   { hub: 'open', tool: 'readiness-check' | 'register' | 'ai-act-guide' | 'readiness-2' | 'use-case-catalogue', hash?: string }
```

The hub keeps only `[A-Za-z0-9_=&%.-]` of `hash`, loads `<tool>/index.html#<hash>` in that tool's frame (creating it if needed, otherwise `location.replace` so the frame adds no history entry), and sends `select(tool)`. Other tools are ignored. Callers send `open` only when they are in a frame.

Added 23 Nov 2026 (nothing existing changed): `readiness-2` and `use-case-catalogue` are openable too. Readiness 2.0 sends `{ hub: 'open', tool: 'readiness-check', hash: 'use=<use id>' }` from its summary and `{ hub: 'open', tool: 'use-case-catalogue', hash: '<dept id>' }` from "Sources in the Use-Case Catalogue" (the catalogue's own department route, e.g. `#fo`). Outside the hub both are plain links (`../readiness-check/index.html#use=<id>`, `../use-case-catalogue/index.html#<dept id>`).

---

## 3. Shared hotel profile: `localStorage['hftp-hotel-profile-v1']`

One JSON object per browser, shared by the AI Register, the AI Act guide and the Readiness check (all same origin). Not read by the hub or the assessment.

```
{ name?, country?: 'DE' | 'CH' | … (ISO code), model?: 'owned' | 'managed' | 'franchised' | …, group?: 'yes' | 'no',
  reps?, size?, type?: 'independent' | 'group' | 'managed', updatedAt: ISO string, from: 'register' | 'readiness' | 'ai-act-guide' }
```

State machine per app: `absent` → (the app's hotel form is filled) → `written` (merge: the app writes only the fields it owns and keeps the others) → `adopted` by the next app on load, which fills only **empty** fields of its own hotel. No app deletes the key; example/demo hotels are never written. There is no version field beyond the `-v1` in the key: a breaking change needs a new key (`-v2`) and a read-once migration from `-v1` in every app.

---

## 4. Hash links

| Link | Sent by | Received by | Receiver does |
|---|---|---|---|
| `#use=<use id>` (e.g. `use=gx-2`) | AI Register (tool page: "Check readiness"), Readiness 2.0 (summary: "Check one tool in detail") | Readiness check | starts a check for that use case (keeps the hotel), then clears the hash with `history.replaceState` |
| `#add=<use id>&name=<url-encoded tool name>` | Readiness check (result page), AI Act guide | AI Register | adds the tool once (an existing tool with that use id is opened, not duplicated), opens it, clears the hash |

`<use id>` matches `[a-z]+-\d+` and must exist in the receiver's use-case list, else the link is ignored. Links arrive two ways: inside the hub through an `open` message (the hub sets the frame's hash, the receiver's `hashchange` handler runs), or as a plain URL when a tool is opened on its own.
