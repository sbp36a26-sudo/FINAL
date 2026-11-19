---
name: clean-up
description: >
  Find every implicit state machine in an app (boolean flags, step strings, nullable fields and
  scattered mutations that together encode "where the user is" or "what is happening") and turn the
  ones that matter into explicit, tested state machines, without breaking anything. Each decision is
  judged on UX (users never see impossible or stuck states), DX (one place to read and change a flow)
  and AX (agents and tests can read and drive the state reliably). Use when the user says "clean up",
  "/clean-up", "find the implicit state machines", or asks to make an app's flows more robust.
argument-hint: "[app, folder or tool to clean up; default: the whole app]"
---

# Clean up: make implicit state machines explicit

Goal: every flow in the app has one named, visible, tested state, and no combination of flags can put a user somewhere the designers never meant. Raise UX, DX and AX together; never trade one away silently. Never break working behaviour.

## 1. Inventory (read-only)

For each page or module, list every implicit state machine. Look for:
- **Step or mode strings** (`step = 'start'`, `ui.view`, `tab`) changed from many places.
- **Boolean clusters** that combine into states (`loading`, `error`, `confirmDel`, `saved`, `showDone`), especially pairs that should be exclusive.
- **Nullable fields that mean a state** (`submittedAt == null` = draft, `sharedAt` set = shared, `pending` = import awaiting confirm).
- **Async lifecycles** without explicit idle / loading / ready / error / empty (fetches, db, downloads, bridges, timeouts).
- **Confirm dialogs and toasts** handled by ad-hoc flags.
- **Persisted state** (localStorage, files, db) without a version or migration, or restored into an impossible state.
- **Navigation**: Back/forward, hash routes, iframes and history that can disagree with the in-memory state.
- **Cross-tool contracts** (postMessage, shared storage keys, hash links) that are state machines spread over two apps.

For each machine record: where it lives (file:function), its states, its events, who triggers each transition, and **impossible or stuck states** that can occur today (with a reproduction).

## 2. Decide (per machine)

Score each on user harm today (stuck, wrong, lost data), change frequency, and risk of the change. Pick one action:
- **Make explicit**: a single `state` value (string union), a transition table `{state: {event: nextState}}`, guards, and one `send(event)` function that is the only writer. Use for anything with 3+ states, async, or reported bugs.
- **Name only**: keep the code, add a documented state list and invariant checks. Use for small, stable flows.
- **Leave**: state is local and trivially correct. Say why.

Prefer the smallest change that removes impossible states. No framework or library unless the project already uses one; plain code is fine.

## 3. Build, raising all three

- **UX:** every state the user can be in has a visible, plain-language screen, including loading, empty, error and "saved / not saved". No dead ends: every state has a way forward or back. Back and reload return to a sensible state. Confirmations cannot be skipped or double-fired.
- **DX:** one transition table per flow, near the top of the file, with a comment listing states and events. Pure transition functions that run in Node. Persisted state carries a version and a migration; restore validates and falls back to a safe state.
- **AX:** expose state without scraping the DOM: `data-state` on the flow's root element, a read-only `window.<App>.state()` snapshot, and documented events (`send('next')`). Deterministic: no hidden timers that change state without an event; any timeout is an event. Stable ids or data attributes on controls agents press.

## 4. Prove nothing broke

- Add tests for every transition, every guard, and each previously possible impossible state (now rejected). Keep all existing tests green; update one only when the old expectation encoded a bug, and say so.
- Run the app in a browser (desktop and 390 px phone): walk each flow, Back/forward, reload mid-flow, the error path, and restore from saved data written by the **old** version.
- No new console errors or network requests.

## 5. Report

Write `CLEANUP.md` next to each app: the inventory table (machine, states, action taken, why), bugs found and fixed with reproductions, what was left alone and why, and the AX handles (`data-state` values, `state()` shape, events). Commit per app with a message that names the machines made explicit.
