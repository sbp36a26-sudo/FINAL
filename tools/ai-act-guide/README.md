# AI Act guide

A plain-language front door to the Hotel AI Register for a general manager: Hotel, Tools, Results and plan, Vendors, Owner page. Built from `SPEC.md` (19 Nov 2026) and the concept in `CONCEPT-original.md`.

**It runs on the register's rules.** The build inlines `../register/src/logic.js` (RegLogic) and `../register/data/reference.json` and `uc-labels.json` unchanged. The guide's own data (`data/guide.json`) only maps each plain answer onto a register row and register answers. Every level, reason, role and plan item comes from `RegLogic.classify` and `RegLogic.items`.

## Commands
```
node tools/ai-act-guide/build.mjs              # writes index.html (self-contained, ~680 KB, works from file://)
node tools/ai-act-guide/tests/guide.test.mjs   # data and logic checks (build first for the page checks)
node tools/build-hub.mjs                        # after editing ../hub/hub-bar.html
```
Rebuild the guide after any change to the register's logic or data. The build fails if `guide.json` points at a register use or question that no longer exists.

## Files
- `data/guide.json`: tool types, questions, answer to register mapping, tier names (`levelMap`), origins, vendor questions (ask / fine answer / red flag), the two templates and the honest box. Generated once from the concept and `test2/map/mapping.json`. It is now the maintained source.
- `src/guide.js`: pure logic (GuideLogic). Covers the mapping, the plan (de-duplicated like the register's To do), the three-line verdict, tiles, "Still open" lines, vendor emails and the owner summary. It runs in Node.
- `src/app.js`: screens, autosave (`hftp-ai-act-guide-v1`), the shared hotel profile (`hftp-hotel-profile-v1`), backup file, PDF (the register's bundled jsPDF and font) and the hub bridge.
- `src/page.html`: page shell. The register's CSS tokens and components are inlined at build time.

## How a level is set
1. The answer marked with `use` picks the register row. Each answer's `set` is merged into the register answers, and when two answers set the same question, the more careful one wins (yes > not sure > no). An answer with `implied: "no"` (the "other" type and CV scheduling on the triage row) answers the row's remaining questions "no".
2. `RegLogic.classify(row, {answers, origin}, reference)` gives the register label. `levelMap` turns it into a tier: Banned, Possibly banned, High-risk, Possibly high-risk, Transparency, Possibly transparency, Minimal (also "outside the high-risk list" and "not an AI system", shown as badges) or Not known yet.
3. The plan is `RegLogic.items`. AI literacy, the responsible person and staff AI use appear once for the whole hotel. The vendor item appears once per vendor, and only where vendor questions are shown.

## Pending D7 sign-off
- **Questions attached to rows that lack them.** If a guide question sets a register question the chosen row does not carry, the guide attaches it to that row with the register's own definition from `reference.json`. Example: the emotion question on CCTV (`emo_guest` on `it-4`), or on voice transcription (`hk-1`). The register's files are not changed. The D7 owner should confirm these rows or add the questions to `uc-labels.json`.
- Vendor questions, fine answers, red flags and template wording are the team's drafts, marked "Draft wording, check with your adviser". The staff policy and literacy checklist are withheld until legal review.
- The Art. 50 guidelines reference is shown as "to verify": the booklet cites C(2026) 7702 final; other sources cite OJ C/2026/6005.

## Out of scope
One hotel in one country per run. There is no group or multi-country view.
