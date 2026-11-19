# Hotel AI Register: clean-up of the page's state (19 Nov 2026)

Done with the project's `clean-up` skill. Scope: the page code (`src/app.js`, `src/page.html`). The rules in `src/logic.js` (RegLogic, also used by the AI Act guide and the Readiness check) were not changed: same outputs, same API, all 138 logic tests unchanged and passing.

The transition code is in a new file, `src/machines.js` (RegMachines, no DOM, inlined by `build.mjs`), tested by `tests/machines.test.mjs` (64 checks). `src/app.js` holds the current values and does the side effects.

## Inventory

| Machine | Where | States | Action | Why |
|---|---|---|---|---|
| Route (where the user is) | `app.js` `setRoute`, `go`, popstate, start-up; table in `machines.js` `route()` | how, hotel, todo, watch, register/list, register/pick, register/tool + tool id | **Made explicit** | Three fields written from five places; reload always went to "How it works"; Back to a deleted tool left `view: 'tool'` with no tool; clicking the current tab added history entries; the `#add=` link wrote a `null` history entry, so Forward to it showed "How it works". |
| Dialog (confirm boxes and the vendor-email copy box) | `app.js` `send`, `runEffect`; table `machines.js` `DIALOG` | none, confirm (delete, reset, example, own, import), copy | **Made explicit** | `ui.confirm`, `ui.copy` and `ui.pending` could combine (a confirm and a copy box open together; an import backup left in memory after leaving the screen). Effects now run once from one place, so a confirm cannot fire twice. |
| Download bridge (host) | `app.js` `initHost`, `hostEvent`, `saveFile`; `machines.js` `hostStart`, `hostSend` | none, pending, yes, no | **Made explicit** | In a frame of another origin the page waited 12 s with no feedback before downloading. Late events could flip a final state. |
| Stored register (`hftp-ai-register-v1`, backups) | `app.js` `load`, import; `machines.js` `readStored` | empty, ok, unreadable (damaged, newer, no version, bad shape) | **Made explicit** (version check + migration table, still `v: 1`) | A damaged or newer save was silently replaced by the example and reported as "storage blocked". |
| `#add=` link | `app.js` `fromHash`; `machines.js` `parseAddHash` | no link, add link | **Made explicit** (pure parser) | A malformed name threw and left a blank page. |
| Register replacement (own, reset, example, backup, `#add=` from the example) | `app.js` `replaceRegister` | – | **Named**: one function | "Start my own register" and "Clear everything" wrote empty hotel fields over the shared hotel profile. |
| Save status (`mem.ok`, 400 ms typing timer) | `persist`, `persistSoon`, `flushSave` | saved, typing not yet saved, storage blocked | **Named**, flush added | Typing then reloading within 400 ms lost the text. |
| Example vs own register | `state.example` | example, own | **Named** (in `replaceRegister` and `pick`) | Small. Fixed: the first own tool added to an emptied example kept the fictional hotel, which then reached the shared profile. |
| "Since you last opened" | `state.seenOn`, `sinceLast` | not seen / seen today | **Left** | One date, one writer ("Mark as seen"), correct. |
| Toast | `toast()` | hidden, shown | **Left** | Its timer only hides a message; it changes no state. |
| Reviewer toggle | `ui.reviewer` + `hftp-ai-register-reviewer` | on, off | **Left** | One boolean, one writer, saved per browser. |
| View filters | `ui.q`, `fLabel`, `pickQ`, `pickDept`, `showDone`, `whoFilter` | – | **Left** | Independent filters; any combination is valid. |
| Shared hotel profile | `hftp-hotel-profile-v1`, `adoptProfile`, `writeProfile` | – | **Left** (format unchanged) | Fixed through `replaceRegister` above. |

## Bugs found and fixed (each reproduced on the 19 Nov build before the fix)

1. **Shared hotel profile wiped.** Put `{"name":"Hotel Lac","country":"FR"}` in `hftp-hotel-profile-v1`, open the register fresh, Register AI tools → Start my own register → Start empty. Before: the profile's name and country became empty (the Readiness check lost them). Now kept, and the new register takes them. Same for "Clear everything".
2. **Typing lost on reload.** Type in "Responsible person" and reload at once. Before: lost. Now saved on `pagehide`/hidden.
3. **Reload loses the place.** Reload on a tool page. Before: "How it works". Now the same tool page (from `history.state`, checked against the register).
4. **Unreadable save overwritten.** Store `{"v":2,"tools":[…]}` under the key and open the page. Before: replaced by the example, shown as "Not saved: this browser blocks storage". Now copied to `hftp-ai-register-v1-unreadable-<time>`, with a note to download it.
5. **Blank page from a bad link.** Open `index.html#add=hr-3&name=%E0%A4%A`. Before: URIError, empty page. Now the tool is added without a name.
6. **12 s download wait in a frame of another origin.** Frame the page from another origin and press Download CSV. Before: about 10–12 s, no feedback. Now at once; inside the hub a "Preparing the download…" toast shows while waiting.
7. **History.** Back to a deleted tool left the impossible state `view: 'tool'` with no tool; a delete now replaces its history entry. Clicking the current tab no longer adds entries. Forward to a tool opened by an `#add=` link showed "How it works".
8. **Example hotel into the profile.** Delete every example tool, then add a tool: the fictional hotel was written to the shared profile. Now the hotel starts blank (filled from the profile).

Also: a tool id that is not a string, or a duplicate id in a backup, is given a new id on load (it could not be opened before). Escape closes a confirm or the copy box.

## Unchanged contracts

- Storage key `hftp-ai-register-v1`, still `v: 1`; registers saved by the 19 Nov build load (fixture `tests/fixtures/register-saved-19nov2026.json`, also restored in the browser test).
- Shared profile `hftp-hotel-profile-v1`: same fields and format.
- Hub messages: `{hub:'ping'}`, `{hub:'download', id, filename, data}`, `{hub:'open', tool:'readiness-check', hash}`; replies `pong`, `download-result`. History entries keep `{reg:[tab, view, toolId]}`.
- `#add=<use id>&name=<name>` from the Readiness check and the AI Act guide.
- `window.HotelAIRegister.state()`, `csv()`, `pdf()`.

## AX handles

- `#view` carries `data-state` (`how`, `hotel`, `todo`, `watch`, `register/list`, `register/pick`, `register/tool`), `data-tool` (tool id or empty) and `data-dialog` (`none`, `copy`, `confirm:delete|reset|example|own|import`).
- `window.HotelAIRegister.ui()` returns `{ route: {tab, view, toolId}, state, dialog, host, saved, storage, unreadable, example, tools }`.
- `window.HotelAIRegister.send(event)`: `{type:'go', tab, view, id}`, `{type:'ask', kind:'delete'|'reset'|'example'|'own', id}`, `{type:'cancel'}`, `{type:'yes'}`, `{type:'close'}`. An import can only start from a file the person chose.
- Controls keep their ids and `data-act` values (`confirm-yes`, `confirm-no`, `del`, `pick`, `open`, `export`, …).

## Checks

- `node tools/register/tests/logic.test.mjs`: 138 passed (unchanged).
- `node tools/register/tests/machines.test.mjs`: 64 passed: every transition, guard, final state, and each impossible state above.
- Playwright walk (desktop 1280 px and phone 390 px): every tab, add / open / delete a tool, each confirm cancelled and confirmed, Escape, copy box, backup download and restore, a newer backup refused, Back/forward, reload mid-flow and right after typing, a register saved by the 19 Nov build, an unreadable save, `#add=` links (fresh, repeated, by hashchange, malformed), framed by another origin and by a same-origin stand-in for the hub. 65 checks passed, no console errors, no requests outside the local server, no sideways scroll at 390 px.

## Left alone

- `ui.openAll` is read in the tool page but never set (the "Everything to check" block is always collapsed). Harmless; left for whoever owns that block.
- The 12 s hub timeout stays: inside the hub the answer comes in milliseconds.
- No commit made (the brief said not to commit).
