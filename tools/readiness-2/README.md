# Readiness 2.0 (prototype)

Hub tab **Readiness 2.0**, placed before **Readiness check** (tooltip "Start here: is AI the answer, and where?"). For hotel managers who know nothing about AI: is their problem one AI should solve, where does it sit in the hotel, and what must be in place. It ends with a summary and hands one chosen use case over to the Readiness check. Built 23 Nov 2026.

All content comes from `research_notes/AI starting point/research.md` (23 Nov 2026). Only sources the research marks **[opened]** are quoted or listed. Every figure shown carries its source and base. There is no score anywhere (owner's decision).

## The journey

| Screen | State | What happens |
|---|---|---|
| Start | `start` | Three steps explained, the honesty line ("Nobody checks your answers. An answer that isn't true only hides a problem you will meet later.", start screen only), **Start**. |
| 1a Is this an AI problem? | `q` | The five questions, exact research wording. Each has an example line where the research gives one, plus a closed "Why we ask, and an example" fold (why + a Yes and a No hotel example). Answers: **Yes / No / Not sure**. Once all five are answered, a live verdict shows below. **Next** needs all five answered, except when Q1 is No. |
| Stop | `stop` | **Owner's hard rule:** Q1 = No → "This is not an AI problem." One sentence why (the Q1 outcome), one line on what to do instead (a rule, a report or message in existing software, ordinary automation, a process change, ask the current vendor). Only two buttons: **Change my answers** and **Start again**. No event, history entry or saved record can move past it. |
| 1b Where in the hotel? | `where` | 4 categories → their departments → the department's use cases from the Use-Case Catalogue: name, "What AI does" (task), "How common in hotels" (catalogue rating), and the link **Sources in the Use-Case Catalogue**. Pick one, or **None of these fits my problem**. Counts are computed from the catalogue ("99 use cases in 15 departments" today). |
| 2 What you need | `needs` | Ten prerequisites (research B). The five that match readiness must-haves come first and are tagged (B1, B3, B5, B8, B9, then B2, B4, B6, B7, B10). Each has a plain explanation, a self-check question with its readiness-check code, and a closed fold with what good looks like, the other readiness questions on the point, and the evidence (source and base). |
| 3 What makes it succeed | `success` | Nine factors (research C): budget, workflow clarity, leadership, culture, workforce readiness, governance, risk, data and content, change management. Each has a definition, the self-check question, and a closed fold with what good looks like, warning signs and evidence. |
| Summary | `summary` | The 1a verdict with every carried condition and every "to find out"; where it sits (category › department › use case, or "None of these fits"); per step "n in place · n planned · n gaps · n to find out"; the overall line; **Start with these three** (the weakest, ranked as in research D); **What to do next, item by item** (one plain action and who usually does it). Buttons: **Check one tool in detail** (primary), **Copy summary**, **Print**, **Start again**. The hotel name is shown if the shared hotel profile has one. |

Steps 2 and 3 use the readiness check's scale unchanged: **Yes · Planned, not done yet · Partly · No · Don't know yet**, with an optional **By when?** date for Planned. Every item needs an answer ("Don't know yet" is fine): a refused **Next** outlines the first open item and says so. No notes are asked.

## Rules (research A and D)

- **Verdict, precedence Q1 > Q2 > Q3 > Q5; Q4 modifies; "Not sure" ranks below any No.**
  1. Q1 No → stop.
  2. Q2 No → "Probably not worth it."
  3. Q3 No → "Fix the data first." With Q5 also No, a second line reads "Then define success."
  4. Q5 No → "Define success first."
  5. Any "Not sure" → "Find out first.", naming who probably knows: Q1 the vendor or IT, Q2 the GM or finance, Q3 IT or the department head, Q4 the department head, Q5 the GM.
  6. Q4 No → "Worth exploring, as an assistant only: a person checks every result before it counts."
  7. All Yes → "Worth exploring with AI. Next: find where it sits in your hotel." On the summary this reads "Worth exploring with AI."
- **Only Q1 No stops.** A No on Q2, Q3 or Q5 lets the person go on, and that condition is carried to the summary. Conditions are carried in the order Q2, Q3, Q5, then Q4 ("AI as an assistant only", with the AI Act guide pointer for safety, health or rights). "Not sure" answers are carried as "to find out". When Q1 is "Not sure", a line also shows the other outcome.
- **Counts:** in place = Yes; planned = Planned; gaps = Partly or No; to find out = Don't know yet.
- **Weakest three**, across steps 2 and 3 together: No first, then Partly, then Don't know yet, then Planned. Ties follow a fixed order: B1, B3, B5, B8, B9, B2, B6, B7, B10, B4, then C3, C1, C2, C8, C7, C6, C5, C9, C4.
- **Overall line:**
  - Any Partly or No on B1/B3/B5/B8/B9 → "Close these before you talk to vendors."
  - Otherwise, any Don't know yet → "Find out these first."
  - Otherwise → "Good starting point. Run the readiness check for the tool you choose."

### Choices made where the research left room

- **One self-check per item.** Where the research lists several questions for an item, the first one listed is asked, unless another item already asks it. The others appear in the fold as "The readiness check also asks". The exceptions:
  - B3 asks D1, because D4 is asked by C8.
  - C1 asks F3, because F1 is asked by B9.
  - C9 asks the research's new review-date question, because XG applies to staff tools only.
  - B2's readiness question T2 has its own answer options, so B2 asks a yes/no question built from it, marked "new (from T2)".
- **Weakest three across both steps**, as the research's single tie order implies, rather than three per step.
- **Honesty line:** the owner's wording ("An answer that isn't true … later"), not the readiness check's ("A Yes … after signing").

## Hand-over and links

- **Check one tool in detail:**
  - Inside the hub it sends `{ hub: 'open', tool: 'readiness-check', hash: 'use=<id>' }`.
  - On its own it is a plain link to `../readiness-check/index.html#use=<id>`.
  - It is disabled, with the reason shown, when "None of these fits" was chosen. It is also disabled for `lg-4` ("AI use policies and governance"), which the AI Register labels a document rather than a tool, so the readiness check has no check for it.
- **Sources in the Use-Case Catalogue:**
  - In the hub it sends `{ hub: 'open', tool: 'use-case-catalogue', hash: '<dept id>' }`.
  - On its own it opens `../use-case-catalogue/index.html#<dept id>` in a new tab.
- **Hotel profile:** reads `localStorage['hftp-hotel-profile-v1'].name` only, and never writes it.

## Storage

`localStorage['hftp-readiness2-v1']` holds `{ v: 1, step, Q, cat, dept, use, A, By, updated }`.
- Every load goes through `R2Flow.migrate()`. A record without `v` is read as version 1 (the migration stub). A newer version is read for the fields this build understands. Junk values are dropped, and the step is placed on the nearest step that can be shown.
- Corrupt JSON, or storage that is blocked, means the page starts fresh.
- Reload returns to the same step.
- Back/forward moves between steps through `history.pushState({ r2: step })`.
- A change in another tab is followed through the `storage` event.

## Files and build

| File | What |
|---|---|
| `src/content.js` | All words: questions, outcomes, items, actions, evidence, sources per step. |
| `src/logic.js` | Verdict, counts, ranking, overall line, actions (pure). |
| `src/flow.js` | FLOW table, guards, `reduce()`, `migrate()`, CONFIRM (pure). |
| `src/app.js` | Rendering and events only. |
| `src/page.html`, `src/style.css` | Shell and styles (the readiness check's design tokens; print stylesheet). |
| `build.mjs` | Reads the catalogue's `<script id="data">`, plus the register's `uc-labels.json` for the "not a tool" flag, and inlines everything into `index.html`. **Run `node tools/readiness-2/build.mjs` after editing `src/` or after the catalogue changes.** The hub needs no rebuild for this: it loads the page in a frame. |

Tests:
- `node tools/readiness-2/tests/logic.test.mjs`: the verdict for all 3^5 = 243 answer combinations against an independent reading of the research, plus wording, counts, ranking, overall line and actions.
- `node tools/readiness-2/tests/flow.test.mjs`: every transition and guard, exhaustive walks proving nothing past 1a is reachable after Q1 No, Back/forward, restart, and storage round-trip and corrupt data.
- `node tools/readiness-2/tests/catalogue.test.mjs`: the inlined data equals the catalogue now (4 categories, 15 departments, 99 use cases, ids `<dept>-<n>`), and every use case except `lg-4` opens in the readiness check.
- `tests/browser/walk.cjs` (Playwright): run it with the server described in its first line.

## Still open

- Not tested with real hotel managers.
- The self-check wording that is new in the research (B2, B7, C9, and the device line in B4) has not been reviewed.
- Some evidence comes only from consultancy or industry surveys, and their bases are global. Each one's base is stated next to it.
- Not published: the claude.ai hub artifact must be republished to show this tab.
