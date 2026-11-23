# AI starting point (formerly "Readiness 2.0"): changelog

## v1.2 (23 Nov 2026): new name, the council's BUILD NOW items, eight clean-up fixes

Sources: owner decisions B1–B5 on `reports/Council - Readiness 2.0.md` (owner decisions win over the council) and the fix list in `reports/audit-readiness-2/cleanup_inventory.md` (each bug was re-checked against the v1.1 code first: all eight still applied). Tests were written first (`tests/v12.test.mjs`, `tests/browser/v12.cjs`). Before any change, four records saved by v1.1 were captured from the real page into `tests/fixtures/v1.1-saved.json`; they all open unchanged.

| # | Item | Status |
|---|---|---|
| B1 | Visible name "AI starting point" everywhere: hub tab, `<title>`, header, copy text, print line, PDF title, footer and file name (`AI-starting-point_…`), README, `CONTRACTS.md`, `tools/README.md`, `docs/PROJECT_CONTEXT.md`. Subtitle "Start here: is AI the answer, and where?" kept | Done. Folder, tool id `readiness-2`, storage key `hftp-readiness2-v1` and hub messages unchanged |
| B2 | Stop headline "This is not suitable for AI.", then the why, then the instead line; PDF stop page the same; "not an AI problem" removed from every visible string (also the Q1 outcome and the Q1 "Not sure" line) | Done |
| B3 | Steps 2 and 3 unchanged (all 19 items) | Kept as decided; council items that depend on the split skipped (merging B3/C8 and B9/C1, the "later" list, the pre-vendor rewording) |
| B5 | Tab stays before "Readiness check" | Kept |
| BN1 | Q1 hint, the council's wording | Done |
| BN2 | Stop line: "If a vendor offers you an AI tool for this job, … change your answer to Not sure: it becomes something to find out." | Done (screen and PDF) |
| BN3 | "None of these fits": **Open the readiness check** (hub `open` with no hash; plain link outside the hub) and the council's summary line, instead of a disabled button | Done. `lg-4` (a document) still has no check, with its reason |
| BN4 | Question codes (T1, D5a, "new (from T2)", "new question") hidden from screen, copy text and PDF; kept in `content.js` and the tests | Done. The step 2 sources note no longer mentions codes |
| BN5 | Visible evidence-strength note on workflow (C2), culture (C4), change management (C9), the research's "weak or partial" list; Prosci labelled a change-management consultancy | Done. No search-only figures (McKinsey, BCG) added |
| BN6 | "Your answers here are not carried over to the Readiness check yet." by the hand-over (screen, copy text, PDF) | Done |
| BN7 | One-line glosses at first use: PMS (B1), data processing agreement and DPIA (B5), staff representatives / works council (C9) | Done |
| BN8 | Screenshots retaken (`reports/readiness-2-screens/`, old file names kept, new ones added) | Done |
| BN9 | Hub tooltip on "Readiness check": "Check one AI tool in detail before you sign" | Done (`tools/hub/hub-bar.html`, hub test added) |
| M1 | HISTORY machine: in-app Back and browser Back agree; Next/Back cycles do not grow history; a hash change keeps the step; Start again replaces | Done (`histAction`, `histEntry`, `histRead` in `flow.js`) |
| M2 | Use-case identity: the record keeps the name; a mismatch clears the use case, reopens 1b and says "The catalogue changed: please pick your use case again." | Done (version stays 1; old records take the name on load) |
| M3 | Blocked storage: a visible line on every screen; the "answers stay in this browser" promises hidden; `#app[data-storage]` | Done |
| L1 | Real calendar dates only (2000–2100) in `reduce`, `migrate` and `fmtDate` | Done |
| L2 | A record from a newer version is shown with a notice and never written over | Done (byte-identical after an answer, browser-tested) |
| L3 | Progress bar marks the current step "now" on 1a, 1b, 2 and 3 | Done (`R2Flow.progress`) |
| L4 | Hub messages only after the hub's `pong`; plain links otherwise; no ping when the parent is on another origin; the catalogue link falls back to `window.open` | Done (a page framed from another origin now navigates on click) |
| L5 | Cross-tab follow also corrects the history entry; a page restored from the back-forward cache re-reads the record | Done |

### Found in the PDF / download work (not in the inventory)

- Dates on the summary, the copy text, the PDF and its file name used the UTC day, so between midnight and 01:00/02:00 in Europe they showed yesterday. They now use the local day (`R2Logic.localIso`).
- In a frame on another origin the page pinged its parent, which logs a console error and waits 12 s before a download can use the plain link. It now skips the ping when `location.ancestorOrigins` shows another origin.
- The BRIDGE and DOWNLOAD tables were checked against the readiness check's: same table, a second click is still refused, and leaving the summary during a download is harmless (the PDF is built from the record at the click). No change needed.

### Changed test expectations (each because the owner changed the wording or a bug was fixed)

- `logic.test.mjs`: stop heading and Q1 outcome wording (B2).
- `flow.test.mjs`: round-trip records now carry `useName` (M2).
- `catalogue.test.mjs`: page title "AI starting point" (B1).
- `pdf.test.mjs`: title, footers, file names (B1); the stop heading (B2); "None of these fits" next step now "Open the readiness check." (BN3).
- `browser/walk.cjs`: stop heading (B2), copied text prefix (B1), "None of these fits" button enabled (BN3), "in the hub" waits for the hub's pong (L4).
- `browser/pdf.cjs`: file-name prefix (B1).
- `hub/tests/hub.test.mjs`: the tab label "AI starting point" (B1); one test added for the Readiness check tooltip.


## v1.1 (23 Nov 2026): download the assessment as a PDF

Owner's request: "add the option to download the assessment as a PDF at the end".

| # | Item | Status |
|---|---|---|
| 1 | Summary: **Download the assessment (PDF)** next to the other actions; "Check one tool in detail" stays primary | Done |
| 2 | Stop screen: secondary **Download (PDF)**, a one-page "This is not an AI problem." PDF (why, instead, the five answers) | Done. Nothing on the stop screen moves past it (browser walk updated: three buttons now) |
| 3 | PDF content: title, hotel (shared profile, read-only), date, prototype line; sections 1–4, the three to start with, next step, sources per step; footer with page n of N; no score | Done (`src/pdf.js`), in the summary's own words through shared `R2Logic` helpers |
| 4 | Built the readiness check's / register's way: jsPDF and the "Register Sans" OFL subset inlined by `build.mjs`; hub bridge `ping` / `download` with a plain-link fallback; one download in flight | Done. No hub contract shape changed; `CONTRACTS.md` lists Readiness 2.0 as a `ping`/`download` caller |
| 5 | File name `Readiness-2.0_<hotel or assessment>_<YYYY-MM-DD>.pdf`, safe ASCII | Done |
| 6 | Tests: `tests/pdf.test.mjs` (1,110 checks); `tests/browser/pdf.cjs` (138 checks: standalone, hub with link fallback, hub with the save capability; 1280 and 390 px) | Done |

### Fixed on the way

- With exactly one weak point the summary headed it "Start with these one". It now reads "Start with this one".

## v1 (23 Nov 2026): first build

Built to the owner's spec, with all content from `research_notes/AI starting point/research.md`.

| # | Item | Status |
|---|---|---|
| 1 | Step 1a "Is this an AI problem?": the five questions in the research's exact wording, Yes / No / Not sure, a closed "Why we ask, and an example" for each, and a live verdict | Done |
| 2 | Q1 No stops on a result screen: "This is not an AI problem.", why, what to do instead, and only "Change my answers" and "Start again"; nothing can move past it | Done. Proved by an exhaustive state walk (`tests/flow.test.mjs`) and in the browser (Next, `send()`, history) |
| 3 | Q2/Q3/Q5 No do not stop: each condition is carried to the summary; Q4 No adds "AI as an assistant only"; Not sure is carried as "to find out" and ranks below any No | Done. All 243 combinations tested against an oracle written from the research |
| 4 | Step 1b "Where in the hotel?": category → department → use cases (name, what AI does, how common, link to the catalogue's sources), or "None of these fits" | Done. Data is inlined by `build.mjs` from the catalogue's `<script id="data">`; counts are computed |
| 5 | Step 2: ten prerequisites (plain explanation, what good looks like, self-check), the readiness check's answer scale, optional "By when?" for Planned | Done. B1, B3, B5, B8, B9 come first and are tagged as readiness must-haves |
| 6 | Step 3: nine success factors (definition, what good looks like, warning signs, self-check) | Done |
| 7 | Summary: verdict and conditions, where it sits, counts per step, the three weakest, actions item by item; no score | Done |
| 8 | "Check one tool in detail" → readiness check `#use=<id>` (hub `open` message, plain link outside the hub); disabled with the reason when nothing fits | Done. Also disabled for `lg-4` (a document, not a tool) |
| 9 | Copy summary (clipboard, with a copy-box fallback), Print (print stylesheet), Start again (with confirmation) | Done |
| 10 | "Where this comes from" per step (opened sources only, with dates); footer: student prototype, not legal advice, content as of 23 Nov 2026 | Done |
| 11 | Storage `hftp-readiness2-v1` (versioned, migration stub), reload to the same step, Back/forward, hotel name read from `hftp-hotel-profile-v1` (never written) | Done |
| 12 | Hub tab before "Readiness check", with tooltip; `readiness-2` and `use-case-catalogue` added to the openable tools; `CONTRACTS.md` and hub tests extended | Done. No existing contract changed; 5 hub tests added |

### Fixed during the browser review

- The summary repeated "Next: find where it sits in your hotel" under an all-Yes verdict. It now reads "Worth exploring with AI."
- A Planned item with a date ended in a doubled full stop.
- On phones, "Start again" wrapped onto its own line under the header.
- The stop screen showed "Start again" twice (header and card). The header link is now hidden there, so the stop screen has exactly two buttons.
