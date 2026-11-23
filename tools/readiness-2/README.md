# AI starting point (prototype; formerly "Readiness 2.0")

Hub tab **AI starting point**, placed before **Readiness check** (tooltip "Start here: is AI the answer, and where?"). Renamed from "Readiness 2.0" in v1.2 (owner's decision B1). Only the visible name changed: the folder `tools/readiness-2/`, the tool id `readiness-2`, the storage key `hftp-readiness2-v1` and the hub messages are unchanged, so saved answers and links keep working. For hotel managers who know nothing about AI: is their problem one AI should solve, where does it sit in the hotel, and what must be in place. It ends with a summary and hands one chosen use case over to the Readiness check. Built 23 Nov 2026.

All content comes from `research_notes/AI starting point/research.md` (23 Nov 2026). Only sources the research marks **[opened]** are quoted or listed. Every figure shown carries its source and base. There is no score anywhere (owner's decision).

## The journey

| Screen | State | What happens |
|---|---|---|
| Start | `start` | Three steps explained, the honesty line ("Nobody checks your answers. An answer that isn't true only hides a problem you will meet later.", start screen only), **Start**. |
| 1a Is this an AI problem? | `q` | The five questions, exact research wording. Q1 also has the hint "Judge the job, not how you handle it today. If you use rules now only because nothing better was available, for example price rules, answer Not sure." (v1.2, council wording). Each has an example line where the research gives one, plus a closed "Why we ask, and an example" fold (why + a Yes and a No hotel example). Answers: **Yes / No / Not sure**. Once all five are answered, a live verdict shows below. **Next** needs all five answered, except when Q1 is No. |
| Stop | `stop` | **Owner's hard rule:** Q1 = No → "This is not suitable for AI." (v1.2, owner B2; was "This is not an AI problem."). Then one sentence why (the Q1 outcome), one line on what to do instead (a rule, a report or message in existing software, ordinary automation, a process change, ask the current vendor), and the line "If a vendor offers you an AI tool for this job, ask what the AI does that a rule could not. If you are unsure, change your answer to Not sure: it becomes something to find out." (v1.2). Buttons: **Change my answers**, **Start again** and, since v1.1, the secondary **Download (PDF)** (a one-page PDF). None of them moves past the stop: no event, history entry or saved record can. |
| 1b Where in the hotel? | `where` | 4 categories → their departments → the department's use cases from the Use-Case Catalogue: name, "What AI does" (task), "How common in hotels" (catalogue rating), and the link **Sources in the Use-Case Catalogue**. Pick one, or **None of these fits my problem**. Counts are computed from the catalogue ("99 use cases in 15 departments" today). |
| 2 What you need | `needs` | Ten prerequisites (research B). The five that match readiness must-haves come first and are tagged (B1, B3, B5, B8, B9, then B2, B4, B6, B7, B10). Each has a plain explanation, a self-check question, and a closed fold with what good looks like, the other readiness questions on the point, and the evidence (source and base). Since v1.2 no question code (T1, D5a, …) is shown anywhere the hotel looks (screen, copy text, PDF); the codes stay in `content.js` (`rc`, `also`) for the team and the tests. One-line glosses at first use: PMS (B1), data processing agreement and DPIA (B5). |
| 3 What makes it succeed | `success` | Nine factors (research C): budget, workflow clarity, leadership, culture, workforce readiness, governance, risk, data and content, change management. Each has a definition, the self-check question, and a closed fold with what good looks like, warning signs and evidence. Since v1.2 a visible evidence note sits under the three the research marks weak or partial: workflow (C2), culture (C4) and change management (C9), e.g. "Evidence here is thin: one hotelier’s quote and academic studies; no European hotel survey measures culture yet." Prosci is labelled a change-management consultancy. C9 glosses staff representatives (works council, staff committee or union delegates). |
| Summary | `summary` | The 1a verdict with every carried condition and every "to find out"; where it sits (category › department › use case, or "None of these fits"); per step "n in place · n planned · n gaps · n to find out"; the overall line; **Start with these three** (the weakest, ranked as in research D); **What to do next, item by item** (one plain action and who usually does it). Under the hand-over text: "Your answers here are not carried over to the Readiness check yet." (v1.2). Buttons: **Check one tool in detail** (primary; **Open the readiness check** after "None of these fits", v1.2), **Download the assessment (PDF)** (v1.1), **Copy summary**, **Print**, **Start again**. The hotel name is shown if the shared hotel profile has one. |

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
  - After "None of these fits" (v1.2, council BUILD NOW 3) it reads **Open the readiness check**: in the hub `{ hub: 'open', tool: 'readiness-check' }` with no hash, on its own a plain link to `../readiness-check/index.html`. The readiness check then opens as it does from its own tab: its start screen with the tool search for a new visitor, or "Your checks in this browser" for someone with saved checks. The summary says: "No use case in the catalogue matches. The readiness check needs a tool: when a vendor offers you one, search for it there."
  - Hub messages are sent only after the hub has answered the page's `ping` (v1.2). Until then, and in a frame that is not the hub, both links are plain links, so a click is never lost.
  - It is disabled, with the reason shown, for `lg-4` ("AI use policies and governance"), which the AI Register labels a document rather than a tool, so the readiness check has no check for it.
- **Sources in the Use-Case Catalogue:**
  - In the hub it sends `{ hub: 'open', tool: 'use-case-catalogue', hash: '<dept id>' }`.
  - On its own it opens `../use-case-catalogue/index.html#<dept id>` in a new tab.
- **Hotel profile:** reads `localStorage['hftp-hotel-profile-v1'].name` only, and never writes it.

## PDF download (v1.1)

Built the way the readiness check, the AI Register and the AI Act guide make theirs:
- **Pieces reused, nothing new loaded.** `build.mjs` inlines jsPDF (`tools/assessment/lib/jspdf.umd.min.js`) and the register's "Register Sans" font subset (`tools/register/fonts`, SIL OFL 1.1, see its README) as `<script id="r2-font">`. No request leaves the page; it works from `file://` and inside the hub frame. Characters the font lacks print as `?`; ›, “ ”, accents, ł, ø and € print as typed.
- **Content** (`src/pdf.js`, `R2Pdf.model()`): A4, plain, no score, in the summary's own words (the summary screen and the PDF share `R2Logic.verdictText`, `pathParts`, `noneLine`, `handover`, `firstLabel`). Title "AI starting point: is AI the answer, and where?", the hotel name if the shared profile has one, the date, the prototype line; 1. Is this an AI problem? (verdict, carried conditions, to find out, the five questions with the answers); 2. Where it sits (category › department › use case or "None of these fits", what AI does, how common); 3. What you need and 4. What makes it succeed (the count line, then every item with its question, the answer, any "planned by" date and the action, or "In place: nothing to do."); Start with these three (with the overall line; "In short" when nothing is weak); Next step (the readiness check, naming the use case, or why it cannot run); Sources (each step's "Where this comes from"). Footer on every page: "AI starting point · student prototype, not legal advice · page n of N".
- **Stop version:** with Q1 No the PDF is one page: "This is not suitable for AI.", the why, the instead line, the "Not sure" line, the "because" line and the five answers ("Not answered" where blank).
- **File name:** `AI-starting-point_<hotel or assessment>_<YYYY-MM-DD>.pdf` (v1.2; was `Readiness-2.0_…`), with the person's local date; the hotel part is ASCII only (accents dropped, anything else one hyphen, at most 60 characters).
- **Saving:** inside the hub the page pings the hub (`{ hub: 'ping' }`) and, when the hub can save files, sends `{ hub: 'download', id, filename, data: Blob }` and waits for `download-result` (2-minute limit); otherwise, and outside the hub, a plain download link. Shapes as in `tools/hub/CONTRACTS.md`, unchanged.
- **One at a time:** the DOWNLOAD machine (`R2Flow.dlNext`) disables both PDF buttons ("Preparing the PDF…") from the click until the file is handed over; a double click is refused.

## Storage

`localStorage['hftp-readiness2-v1']` holds `{ v: 1, step, Q, cat, dept, use, useName, A, By, updated }` (`useName` since v1.2, optional, so the version stays 1).
- Every load goes through `R2Flow.migrate()`. A record without `v` is read as version 1 (the migration stub). A newer version is read for the fields this build understands. Junk values are dropped, and the step is placed on the nearest step that can be shown.
- **Use-case identity (v1.2):** use-case ids are positions (`<dept>-<n>`), so the record also keeps the use case's name. If the catalogue's name for that id differs on load, the use case is cleared (area and department kept), the page opens on step 1b and says "The catalogue changed: please pick your use case again." A record saved before v1.2 (no name) takes the current name on load.
- **Dates (v1.2):** "By when?" accepts only real calendar days from 2000 to 2100; impossible stored dates are dropped.
- **Newer version (v1.2):** a record with `v` above 1 is shown with "This was saved by a newer version of this page. Changes here are not kept." and is never written over.
- Corrupt JSON means the page starts fresh. **Storage that is blocked** (v1.2) shows "This browser is not keeping your answers. Use Copy summary, Print or Download before you close the page." on every screen, and the "Your answers stay in this browser" lines are hidden (`#app[data-storage]`).
- Reload returns to the same step.
- **Back/forward (v1.2, HISTORY machine):** entries are `{ r2: step, d, prev }`. Next, Start, Change my answers and "Change answers from the start" push; the in-app **Back** goes back in history when the entry below is that step and nothing else was pushed since, else replaces; **Start again** replaces. So browser Back and the in-app Back agree, Next/Back cycles do not lengthen the history, and a hash change or other foreign entry no longer sends the person to the start screen.
- A change in another tab is followed through the `storage` event (and on a return from the back-forward cache); the history entry follows too.

## Files and build

| File | What |
|---|---|
| `src/content.js` | All words: questions, outcomes, items, actions, evidence, sources per step. |
| `src/logic.js` | Verdict, counts, ranking, overall line, actions (pure). |
| `src/flow.js` | FLOW table, guards, `reduce()`, `migrate()`, CONFIRM, BRIDGE, DOWNLOAD (pure). |
| `src/pdf.js` | The PDF: text builder `model()`, `fileName()`, `draw()` with jsPDF (pure apart from jsPDF). |
| `src/app.js` | Rendering and events only. |
| `src/page.html`, `src/style.css` | Shell and styles (the readiness check's design tokens; print stylesheet). |
| `build.mjs` | Reads the catalogue's `<script id="data">`, plus the register's `uc-labels.json` for the "not a tool" flag, and inlines everything (with jsPDF and the PDF font) into `index.html`. **Run `node tools/readiness-2/build.mjs` after editing `src/` or after the catalogue changes.** The hub needs no rebuild for this: it loads the page in a frame. |

Tests:
- `node tools/readiness-2/tests/logic.test.mjs`: the verdict for all 3^5 = 243 answer combinations against an independent reading of the research, plus wording, counts, ranking, overall line and actions.
- `node tools/readiness-2/tests/flow.test.mjs`: every transition and guard, exhaustive walks proving nothing past 1a is reachable after Q1 No, Back/forward, restart, and storage round-trip and corrupt data.
- `node tools/readiness-2/tests/catalogue.test.mjs`: the inlined data equals the catalogue now (4 categories, 15 departments, 99 use cases, ids `<dept>-<n>`), and every use case except `lg-4` opens in the readiness check.
- `node tools/readiness-2/tests/v12.test.mjs` (v1.2): the rename, the stop headline, the BUILD NOW items, the history machine, use-case identity, dates, newer records, the progress bar, and the four records saved by v1.1 in `tests/fixtures/v1.1-saved.json` (captured from the real page before any v1.2 change).
- `node tools/readiness-2/tests/pdf.test.mjs`: the PDF text builder against hand-worked answer sets and the summary's functions (160 random sets), the stop version, the drawing with the real jsPDF and font (pages, footers, no line past the margins), file names, and the BRIDGE and DOWNLOAD machines.
- `tests/browser/walk.cjs`, `tests/browser/pdf.cjs` and `tests/browser/v12.cjs` (Playwright): run them with the server described in their first line (`R2_BASE` sets another address). `v12.cjs` also frames the page from a second origin (`localhost`), so it launches Chromium with local-network checks off.

## Still open

- Not tested with real hotel managers.
- The self-check wording that is new in the research (B2, B7, C9, and the device line in B4) has not been reviewed.
- Some evidence comes only from consultancy or industry surveys, and their bases are global. Each one's base is stated next to it.
- Not published: the claude.ai hub artifact must be republished to show this tab.
