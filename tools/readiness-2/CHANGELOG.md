# Readiness 2.0: changelog

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
