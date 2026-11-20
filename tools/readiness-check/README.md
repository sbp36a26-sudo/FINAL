# AI readiness check (prototype) and team results

Two pages, one set of rules (**v4, 20 Nov 2026**). v4 is the build pass ruled in `reports/Council - readiness check audit.md` after the three audits in `reports/audit-readiness/`; what was built item by item is in `CHANGELOG.md` and `reports/audit-readiness/4_build_notes.md`. Research behind v3: `reports/Readiness check retention and trust.md` and the three reviews in `research_notes/Hotel AI readiness check design/`. The v3 build is kept in `backup-v3/` as a rollback.

| Page | Hub tab | What it does |
|---|---|---|
| `index.html` | Readiness check | The hotel's journey (below). |
| `team.html` | **Team: readiness results** (red, right end; shown to Editors of the hub only) | The copies hotels chose to share, recomputed with the current rules: every question with why it was asked, the answer and points, must-haves, the verdict step by step, their action plan and their history. Each copy shows the rules version it was made with. |

## The hotel's journey

1. **Start.** How the hotel is run, the tool (search by plain words: "chatbot", "telephone", "rota", "check in"; "98 tools · 8 match"), and the stage: looking at options / talking to a vendor / about to sign / already in use. Name, role and country are optional. "Next" is always enabled and points to what is missing. Returning users see **Your checks in this browser** first; the header link "Your checks (n)" leads there from every screen.
2. **What you will need.** "{N} questions, {M} of them must-haves", who will probably be needed, one **Copy questions** per person, lists closed, **Start now** at the top and the bottom. No time promise (not yet timed with hotels).
3. **Six steps.** One-line header ("AI readiness check · tool · Step 1 of 6"). One question per idea. A must-have answered Yes asks for a **note** ("Where is this written down?"). "Don't know yet" asks **who can answer**; before a vendor is chosen, vendor questions go to the vendor at once. What the tool needs is a list (In place / Not yet / Don't know / Doesn't apply).
4. **Result.** One verdict sentence, one count line ("3 of 8 must-haves done · 1 needs a note · 4 to find out"), **Do these first** (three named tasks), one primary button (not ready / not enough information: "Send the questions to the people who know"; top verdict: "Download the report for your owner (PDF)"), "Update open items" and "Start a new check" beside it. Then the **action plan** by person, and closed rows: must-haves, the six areas in words, vendor questions, the provisional legal items, the note for the owner, the next look, sharing, and how the result was worked out (with "Changed in rules v4").
5. **Come back.** "Since <date>": must-haves done, questions answered, open items before → after, verdict change; the count line shows "(was n)". **Update open items** shows must-haves first; an answered question stays in place with "Undo" until the person leaves the screen. Results worked out with earlier rules stay in the history, labelled, and are not compared.
6. **Keep and share.** PDF (page 1 for the owner, same words as the screen), **Save as file** / **Open a saved file**, copy texts for colleagues, the vendor and the owner. Sharing with the team is opt-in (`SHARING_ON` in `src/check.js`); the hotel name and the text of the notes only if ticked.

## Rules v4

- Answers: Yes 2 · Partly 1 · No 0. **"Don't know yet", "Doesn't apply" and the stated ways out are left out of the points.** Lists of what the tool needs: 2 × (in place) ÷ (in place + not yet).
- **Answered** means Yes, Partly, No or Doesn't apply, everywhere. Everything else is "to find out". A list counts as answered only when no item is blank or "Don't know".
- A must-have has three states: **in place** (Yes plus a note of at least 2 words and 8 characters, or its way out), **Yes, note missing** (not confirmed) and **not in place** (No or Partly). Nobody checks the note.
- Ways out: "This tool uses no personal data (guests, staff, job candidates, callers)" on D5a / D5b, not offered for tools with sensitive data, a chat label or a high-risk label; "We have no staff representatives" (XG); "Checked: not required (confirmed in writing)" on the DPIA question (G2s), with a note; "We have checked: the EU AI Act does not apply to us" on XL for Switzerland, United Kingdom and Other, with a note.
- "Doesn't apply" is never offered on must-haves or on P5, G2, G2s, G3, G4, X2a, XL, T2. A stored answer that is no longer offered is kept but asked again.
- **Verdict** (no 0–100 score; level keys `stop` / `open` / `pilot` unchanged):
  - **Not ready yet:** a must-have at No or Partly, or an area below 40% with at least two known answers.
  - **Not enough information yet:** otherwise, if a must-have is not known or has no note, or an area has no known answer and at least one question blank or "Don't know yet".
  - **Top verdict** (name in one constant, `PILOT_NAME` in `src/logic.js`; interim "No blocker found: you can start a pilot", for tools in use "No blocker found for continued use"): every must-have in place and no area below 40%.
  - An area where every answer is "Doesn't apply" is left out. Areas are shown in words: Strong (75% or more), Gaps to close (40–74%), Weak (below 40%), Too little to say.
- Must-haves: P1, F1, F2, O1, D5a, D5b always; T1 unless the tool's technology needs are "None"; P5 when the tool acts alone; G2 becomes a DPIA question (G2s) with sensitive data; XG for staff tools; XL, P5 and G3 for uses the AI Register labels high-risk.
- Guest questions (X2a, X2b, D2) go to guest conversation and personalisation tools and to tools with a chat or transparency label, not to a whole department.
- Stage changes the advice and who is asked, not the rules. Snapshots carry the rules version; only same-version snapshots are compared.

### Changed in rules v4

The same list is shown to hotels under "How this result was worked out" (`CHANGES` in `src/logic.js`):

1. An area where every answer is “Doesn't apply” is left out of the verdict. Before, it kept the verdict at “Not enough information yet” with nothing left to do.
2. An area holds the verdict back only when it is below 40% and at least two of its questions have a known answer. Before, a single answer in a one-question area could decide.
3. The answers “This tool uses no personal data” and “We have no staff representatives” count as in place for the must-have but give no points. Before, they gave full points.
4. “This tool uses no personal data” is no longer offered for tools that handle sensitive data, talk to guests or callers, or are on the high-risk list. A saved check that used it there is asked again.
5. A must-have answered Yes without a note stays a Yes, shown as “Yes, note missing”. It no longer counts as not in place, but the top verdict still needs the note.
6. Lists of what the tool needs: points are the share of items in place among those in place or not yet. “Don't know” items are left out of the points and the list counts as “to find out” until every item has an answer.
7. “Answered” means Yes, Partly, No or Doesn't apply, on every screen. “Don't know yet” is counted on its own as “to find out”.
8. Before a vendor is chosen, a vendor question answered “Don't know yet” goes on the vendor's list straight away.
9. Outside the EU (Switzerland, United Kingdom, other), the EU AI Act check has one more answer: “We have checked: the EU AI Act does not apply to us”, with a note saying who checked.
10. For uses the AI Register labels high-risk, “Can staff overrule the tool?” and “Which outputs must a person check?” are must-haves. This is the team's judgement.
11. The written two-way link to your systems is a must-have for every tool that needs a link. Only tools that need no link are exempt. Before, all “Light” tools were exempt.
12. The two guest questions (reaching a person, guest feedback) are asked for tools that deal with guests directly, not for every front-office or guest-experience tool.
13. The data protection impact assessment question has one more answer: “Checked: not required (confirmed in writing)”, with a note.
14. The top verdict has a new name that says what was found, not what the hotel is. Results worked out with earlier rules stay in your history and are not compared line by line.

## Data and access

- The hotel's checks live in its own browser (`hftp-readiness-mychecks-v1`) and in the file it saves.
- A shared copy goes to the hub's database at `readiness/<viewer id>/checks/<check id>`. Rules: `readiness` read and write **admin**; `readiness/{self}` read and write **interact**. Each person can write and withdraw only their own copies; only Editors and the owner can read across people. The hub bar also refuses list and delete for non-Editors and hides the red tab from them.
- The data notice says what is true today: a shared copy goes to the project team; a deletion date and a contact address are not set yet; the copy can be withdrawn at any time. The team still has to name who is responsible, a deletion date and a contact (ruling B2). `SHARING_ON = false` in `src/check.js` switches sharing off; withdrawing still works.
- Unchanged in v4: storage keys, the record format (`rv: 2`), the file format (`kind: 'hftp-readiness-check', v: 3`), answer codes, level keys, hub messages, the shared profile key and the `#use=` hash.

```bash
node tools/readiness-check/build.mjs
```

```bash
node tools/readiness-check/tests/logic.test.mjs
```

```bash
node tools/readiness-check/tests/flow.test.mjs
```

```bash
node tools/readiness-check/tests/v4.test.mjs
```

The logic tests (35) include every scoring fault found in the trials of 18 Nov 2026. The flow tests (80) cover the page's state machines in `src/flow.js`; see `CLEANUP.md`. The v4 tests (81) come from the audit's repros, one or more per ruling item, plus a check saved by the v3 build (`tests/fixtures/`); run them against the old rules to see them fail: `RC_LOGIC=<v3 logic.js> RC_HTML=backup-v3/index.html node tests/v4.test.mjs`. Browser proof (197 checks at 1280 and 390 px) and the before/after measurement: `tests/browser/walk.cjs` and `measure.cjs` (Playwright; serve `tools/` on port 8805, set `SP` to a folder for screenshots).
