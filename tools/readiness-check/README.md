# AI readiness check (prototype) and team results

Two pages, one set of rules (**v3, 19 Nov 2026**). Research behind v3: `reports/Readiness check retention and trust.md` (research, three trial runs, three critics) and the three reviews in `research_notes/Hotel AI readiness check design/`.

| Page | Hub tab | What it does |
|---|---|---|
| `index.html` | Readiness check | The hotel's journey (below). |
| `team.html` | **Team: readiness results** (red, right end; shown to Editors of the hub only) | The copies hotels chose to share, recomputed with the current rules: every question with why it was asked, the answer and points, must-haves, the verdict step by step, their action plan and their history. |

## The hotel's journey

1. **Start.** Who should fill it in (the person responsible for the tool going live, not necessarily the CIO), the data notice, hotel type, role, country, the tool, and the stage: looking at options / talking to a vendor / about to sign / already in use. Returning users see **Your checks in this browser** first.
2. **What you will need.** The tool at a glance, the must-haves with "what counts as Yes", and every question grouped by the person who usually knows (GM, owner, finance, IT, vendor, data protection, HR, department head), each with **Copy questions** to send ahead.
3. **Six steps.** One question per idea. "Don't know yet" asks **who can answer**; vendor-dependent must-haves suggest "The vendor" before a vendor is chosen. Tool-specific needs are tick lists (In place / Not yet / Don't know / Doesn't apply).
4. **Result.** Verdict, "N of M must-haves met", a summary built from what is actually open, must-haves with the hotel's own proof lines (self-declared), the **action plan** (before anything else / confirm with the vendor / to find out by person / gaps to close), six area bars with "x of y answered", vendor questions, the provisional legal flag from the AI Register, optional owner fields (printed on PDF page 1), and "when will you look at this again?".
5. **Come back.** "Since <date>": must-haves closed, questions answered, open items before → after, verdict change. **Update open items** shows only what is still open.
6. **Keep and share.** PDF (page 1 for the owner, then working pages), **Save as file** / **Open a saved file** (JSON the hotel keeps), copy texts for colleagues, the vendor and the owner. Sharing with the team is opt-in; the hotel name and proof lines only if ticked.

## Rules v3

- Answers: Yes 2 · Partly 1 · No 0. **"Don't know yet" and "Doesn't apply" are left out of the points** (an unknown is something to find out, not a No).
- A must-have counts as met only with Yes plus a proof line of a few words (at least 2 words and 8 characters), or its stated way out ("This tool uses no guest or staff data"; "We have no staff representatives").
- "Doesn't apply" is never offered on must-haves or on P5, G3, G4, X2a, XL, T2.
- **Verdict** (no 0–100 score, no "Ready to scale" until there are pilot questions):
  - **Not ready yet:** any must-have known and not met, or an area below 40% with at least two known answers.
  - **Not enough information yet:** otherwise, if a must-have is not known or an area has no known answer.
  - **Ready to pilot:** every must-have met and no area below 40%; areas at 40–74% are gaps to close during the pilot.
- Must-haves: P1, F1, F2, O1, D5a, D5b always; T1 except Light tools; P5 when the tool acts alone; G2 becomes a DPIA question (G2s) with sensitive data; XG for staff tools; **XL (AI Act check) for uses the AI Register labels high-risk**.
- Stage changes the advice, not the rules. Snapshots carry the rules version; only same-version snapshots are compared.

## Data and access

- The hotel's checks live in its own browser (`hftp-readiness-mychecks-v1`) and in the file it saves.
- A shared copy goes to the hub's database at `readiness/<viewer id>/checks/<check id>`. Rules: `readiness` read and write **admin**; `readiness/{self}` read and write **interact**. Each person can write and withdraw only their own copies; only Editors and the owner can read across people. The hub bar also refuses list and delete for non-Editors and hides the red tab from them.
- Placeholders in the data notice (who is responsible for shared data, deletion date, contact) must be filled before any hotel uses it.

```bash
node tools/readiness-check/build.mjs
```

```bash
node tools/readiness-check/tests/logic.test.mjs
```

The tests (34) include every scoring fault found in the trials of 18 Nov 2026.
