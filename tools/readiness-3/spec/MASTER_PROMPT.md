# MASTER PROMPT — "Do you need AI?" v2.6.1 → v3.0 (for Claude Code)

You are Claude Code, working in Ludo's repository `sbp36a26-sudo/FINAL`. Work autonomously and in phases. Commit after each phase. Do not stop to ask questions: where this prompt leaves room, make the most conservative choice and record it under "Judgement calls" in your report. **Never invent facts.** That covers hotel facts, vendor facts, legal facts, numbers and test results. If you can't verify something, say so.

## 0. Files that come with this prompt

Ludo has copied the folder `master_prompt/` into the repo at `tools/readiness-3/spec/`. If it isn't there, stop and say which files are missing.

| File | What it is | How you use it |
|---|---|---|
| `usecase_questions_v3.json` | **The heart of the upgrade.** All 99 use cases with gates, the v3 questions, the weights, a "why it matters" line for each question, sensitive flags, and the fate of every one of the 661 v2.6.1 questions. It also holds step 2, the 11 must-haves, the gate library, the scoring rules and the fixed texts. | **Single source of truth.** Use every string verbatim. Don't reword, shorten, merge or reorder anything. |
| `usecase_questions_v3.runtime.json` | The same data with the change-log fields removed (about 300 KB, 44 KB gzipped). | This is what you inline into the app. |
| `usecase_questions_v3.schema.json` | JSON Schema (draft 2020-12). | Validate both JSON files in the build and in tests. If validation fails, the build fails. |
| `usecase_questions_v3.md` / `.xlsx` | Readable copies for people. | For reading only. Never parse them. |
| `golden_cases_v3.json` | 33 golden cases with exact inputs and expected results. | Port them to tests unchanged. |
| `sim_v3.py`, `sweep_v3.py` | A reference implementation of the v3 rules, plus the full sweep (26,935 runs, 0 problems, 0 dead questions). | Your JavaScript must give the same verdict and score as `sim_v3.py` on every golden case and every sweep run. Export your results to CSV and diff them against `sweep_v3_runs.csv`. |
| `../readiness-2/` | The current tool, v2.6.1. | **Read-only.** Copy from it. Never edit it. |
| `review.md` (if present) | The review that this upgrade answers. | Source for `REVIEW_RESPONSE.md`. |

## 1. Role, context, goal

**Role:** a senior front-end engineer and UX writer who ships carefully tested, self-contained tools.

**Context:** "Do you need AI?" is a guided self-check for European hotel managers who know nothing about AI. It has been one tab in Ludo's hub artifact (https://claude.ai/artifact/MWMGc2VKc6zniRn8um27eH), built from `tools/readiness-2/` as plain HTML, CSS and vanilla JS with everything inlined. A review found these problems:
- the use-case questions were a generic six-area template, reworded;
- nothing asked what the tool actually does;
- step-5 answers could never block;
- Q1 had reversed polarity and ended in a hard stop;
- must-haves 2 and 4 could not be marked "Doesn't apply";
- seven use cases were wrong.

Ludo has also decided that **the tool will contain no legal content at all.**

**Goal:** build v3.0 as a **new, separate, standalone artifact**. It must score 10/10 on question quality, tailoring, logic accuracy, usefulness and UX, using the acceptance criteria in §9.

**Non-goals:**
- no legal advice, labels, articles or duties;
- no changes to the existing hub artifact, to `tools/readiness-2/`, `tools/index.html` or `tools/build-hub.mjs`, or to any other tab;
- no new features beyond this prompt;
- no backend;
- no new npm dependencies;
- no external CDNs or fonts.

## 2. Ground rules

1. **New artifact, never the old one.**
   - Work only in `tools/readiness-3/`, a new folder. Start it as a copy of `tools/readiness-2/` and change tool id, storage keys and titles to `readiness-3`.
   - Never pass the existing artifact URL to the Artifact tool, never attach it with `/artifacts`, and never republish the hub.
   - The final publish must create a **new** artifact. Claude Code creates a new artifact when no existing artifact URL is given in the session.
2. **Self-contained single file.** Output one `tools/readiness-3/index.html`, UTF-8, with the data, the CSS, the JS, the PDF library and the font all inlined.
   - No `<script src>`, `<link href>`, `fetch` or `@import` pointing at anything outside the page. Use no CDN, even though the artifact CSP allows five. Use no Google Fonts.
   - The file must stay under 3 MB. The artifact limit is 16 MiB rendered, but keep it small.
   - Never make Claude write the file by hand in chat. It is produced by `node tools/readiness-3/build.mjs`.
3. **Keep the app working at every commit.** Every unit and browser test passes before each commit.
4. **Storage, PDF and export keep working, and old saves migrate** (see §6.6).
5. **Version:**
   - set it to `3.0.0`;
   - add `tools/readiness-3/CHANGELOG.md`;
   - add `tools/readiness-3/REVIEW_RESPONSE.md`, mapping **every** review finding to the change and the commit that answers it (§8).
6. **Plain English everywhere.**
   - Use "Don't know yet" as the only uncertainty term in the UI, the PDF, exports and code labels. Never use "Not sure" or "Unknown".
   - Spell out each acronym once per screen. The glossary is in the JSON.
7. **No legal content** (§5). Exactly two texts about rules are allowed, verbatim:
   - Disclaimer (landing, result, PDF footer): "This check does not cover legal requirements. Check those with your adviser before you start."
   - Sensitive-area flag (result and PDF, only when raised): "This area involves people's personal data or jobs and has extra rules. Ask an adviser before a pilot."

## 3. The questions are the heart of this upgrade

Ludo: *"the main thing is to get the use case questions right per use case."* The JSON gives each of the 99 use cases:
- 1–2 "How it works" gate questions, asked before anything else about the use case;
- automatic rules for use cases that are always guest-facing, always act on their own, or always decide about people. These are not asked; their effects simply apply;
- use-case-specific questions. Each one has an area, who answers it, a weight (B blocker, I important, N nice to have), a text of 20 words or fewer, a one-line "why it matters", and optionally `show_if` / `hidden_when` gate conditions;
- a record of what happened to each of the 661 v2.6.1 questions:

  | Action | Count |
  |---|---|
  | keep | 395 |
  | fix | 105 |
  | rewrite | 28 |
  | split | 44 |
  | merge | 65 |
  | remove | 24 |
  | new questions added | 56 |

  That gives 794 v3 use-case questions in total, 122 of them added by gates.

Rules for you:
- **Use the JSON verbatim.** If you think a question is wrong, don't edit it. List it under "Suggested content changes" in the report, with the reason.
- Show each question's "why it matters" line behind a small "Why we ask" toggle, collapsed by default.
- Show "Who answers" as a small label (General manager, Department head, Finance, IT, Owner, Vendor (ask them), HR, Staff who use it), so a GM can forward the question.
- Answer help shown under every scored question: "If your vendor has confirmed it in writing but it isn't set up yet, answer Planned."
- Old question IDs are kept where meaning is kept (`rm-1.te1`). Split parts get `a`/`b`. New questions are `n1`, `n2`, … and gate questions use the gate question key (`rm-2.ACT_LIMITS`). Migration depends on these IDs (§6.6).
- `review_verdict` and `treatment` are for reports only and never shown. The 7 Wrong use cases (res-8, fo-7, hk-6, hr-1, hr-5, hr-6, it-4) are fully rewritten in the JSON.
- **Tests (required):**
  - For every use case and every gate combination, the visible question list must equal what `sim_v3.visible_questions` gives (same IDs, same order).
  - Every question must render with its exact text, weight label, owner and why line.
  - Every answer must change the score and verdict exactly as the reference does.

## 4. Logic spec (exact; also in `scoring` in the JSON)

**Flow (same order as v2.6.1; do not reorder):** Cover → **Step 1** About your hotel → **Step 2** the five questions (not scored) → **Step 3** the 11 must-haves → **Step 4** pick the use case (99 in 15 departments, or "None of these fits") → **Step 5** questions for this use case: the 1–2 "How it works" gates at the top of the step, then the use-case questions they unlock → Result.

The must-haves come **before** the use case, so "Doesn't apply" can't wait for the gates. It is resolved like this:
- m2 and m4 always offer **Doesn't apply** as a fifth answer, with the help text from the JSON (`na_help`):
  - m2: "Choose Doesn't apply if the tool is free or already paid for, so no new budget is needed."
  - m4: "Choose Doesn't apply if it is a ready-made tool that needs no connection to your hotel systems."
- Doesn't apply is excluded from the score.
- A later gate answer can **contradict** it (`contradicts_na`, also in `na_contradicted_by`): `G_PAID` = "No, it needs new money" contradicts m2, and `G_LINK` = "Yes" contradicts m4. When that happens:
  - that must-have counts as **Don't know yet**;
  - the `contradiction_note` text shows on the gate screen right after the answer, and again on the result;
  - the note offers a "Change my answer" link back to the must-have.
- Gates that agree with Doesn't apply (`G_PAID` = yes, `G_LINK` = no) only hide that use case's Money or Technology questions (`hide_area`).
- If the use case has no matching gate, Doesn't apply stands as answered.
- No other must-have offers Doesn't apply. A stored `na` on any other must-have counts as Don't know yet.

**Answers:**
- Step 2: Yes / No / Don't know yet.
- Must-haves and use-case questions: Yes / Planned / No / Don't know yet.
- m2 and m4 also offer Doesn't apply (see above).

**Step 2:**
- `s1` (needs judgement) and `s2` (worth it) answered **No** give a **soft stop**. The short result shows the stop message from the JSON and "Simpler options to try first", with buttons **Change my answers**, **Continue anyway** and **Download (PDF)**.
- "Continue anyway" carries on, and the final verdict is capped at Almost ready with the reason "You said rules may do this job" or "You said the gain may be small".
- **Q1 polarity:** Yes now means towards AI.
- `s3`–`s5` answered No or Don't know yet do not stop. They cap the verdict at Almost ready and add a top action.

**Gates** (library in `gate_library`, per-use-case in `use_cases[].gates`). Effects:

| Effect | What it does |
|---|---|
| `add` | Shows the listed gate questions (blockers or important) |
| `sensitive_flag` | Raises the flag |
| `cap_almost` | Caps at Almost ready |
| `action` | Adds a top action |
| `contradicts_na` | Turns a Doesn't apply answer on the listed must-have into Don't know yet and shows its `contradiction_note` |
| `hide_area` | Hides that area's questions in this use case; gate-added questions are never hidden |
| `not_fit` | Shows a "This may not fit" note with a link back to the picker; continuing caps the verdict |

- Gates answered Don't know yet always cap and add their action.
- "None of these fits" asks all five library gates, then the six fallback questions, and is capped.

**Score:**
- weights B = 3, I = 2, N = 1;
- factors Yes = 1, Planned = 0.5, No = 0, Don't know yet = 0, Doesn't apply = excluded;
- scored items are the 11 must-haves (all B) plus the **visible** use-case questions; step 2 and gates are not scored;
- unanswered counts as Don't know yet.

```
score = floor(100 * Σ(weight × factor) / Σ(weight))        over visible, applicable items
dk    = (# Don't know yet) / (# visible applicable items)
```

**Verdict, checked in this order (first match wins):**
1. **Soft stop:** s1 or s2 is No and the user has not continued.
2. **Not enough info:** dk > 0.5.
3. **Not ready:** any visible blocker is No, **or** score < 50, **or** fewer than half of the visible applicable blockers are Yes.
4. **Ready:** every visible blocker is Yes or Doesn't apply, **and** score ≥ 75, **and** dk < 0.25, **and** s3–s5 are all Yes, **and** a listed use case is chosen, **and** every asked gate is answered with something other than Don't know yet, **and** there is no sensitive flag and no cap.
5. **Almost ready:** everything else.

**Sensitive flag:**
- always on for 10 use cases (`sensitive.always`): hr-2, hr-4, hr-5, hr-6, res-8, it-4, fo-3, fo-6, gx-4, sm-3;
- on when a listed gate answer is given in 13 more (`sensitive.when`);
- when raised it shows the fixed flag text, caps the verdict at Almost ready, and makes "Ask an adviser before a pilot." top action #1 (owner: General manager).

**Top 3 actions** (each with an owner), built in this order and de-duplicated:
1. sensitive flag;
2. blockers answered No, in question order;
3. gate actions (Don't know yet / cap);
4. step-2 caps;
5. blockers answered Planned or Don't know yet;
6. important questions answered No.

The action text is the question turned into a task: "Make sure: <question without '?'>" for No/Planned, and "Find out: …" for Don't know yet. Gate actions use their own `action` text.

## 5. Legal content: remove it all

Remove from `tools/readiness-3/` (code, data, PDF, exports, tests, copy):
- EU AI Act labels (provisional, high-risk, transparency, prohibited);
- the "EU AI Act" result section and "Add to the AI Register";
- legal-duty questions (AI notice as a legal duty, DPIA, works council, CE marking, consent, allergen law, working-time law, PCI DSS naming);
- country legal notes and "items to check";
- legal vendor questions;
- the legal warning;
- "not legal advice" footers (replace with the disclaimer);
- article numbers;
- legal sources in "Details and sources".

Where a legal question had a practical core, the JSON already keeps that core without the legal framing. Examples:
- "tell guests they are talking to a computer" (a guest-trust question);
- allergen checks (food safety);
- "card-security requirements of your payment provider";
- "staff told and asked for feedback".

**Cross-links to the catalogue and register:**
- v3 is standalone, so drop links to other hub tabs ("Open the AI Register", "AI Act guide", `postMessage` `open`, `#use=`).
- If the inlined catalogue data for the use-case picker and the "Where it sits" panel carries legal fields (labels, articles, register notes), strip those fields **in the v3 copy only**. Keep the plain description and "how the AI works".
- Never edit the hub's catalogue, the register or other tabs. That is how "without breaking other tabs" is guaranteed.

**Banned-term test:**
- Run a build-time and test-time grep over `index.html`, the generated PDF text, all exports and all v3 sources, excluding `spec/` and the change-log fields.
- The match is case-insensitive and word-bounded on: `AI Act`, `Article`, `Art.`, `Annex`, `high-risk`, `DPIA`, `GDPR`, `FADP`, `prohibited`, `CE mark`, `works council`, `PCI`, `consent`, `legal basis`, `law`, `laws`, `regulation`, `compliance`, `EU`, `not legal advice`.
- Allowlist: only the exact disclaimer and flag strings.
- The test must find 0 matches.
- Put every legal item you found but did **not** remove in the report, with file, line and reason, for example a comment in a vendored library.

## 6. UX spec

1. **Progress:** a 5-segment bar (1 About your hotel, 2 Is this an AI problem?, 3 Must-haves, 4 Where in the hotel?, 5 Questions for this use case) showing "Step n of 5", the same steps as v2.6.1. Every screen has **Back**, which keeps the answers. "Start a new check" is always available, and asks for confirmation if there are answers.
2. **One question per card,** big tap targets (≥ 44 px), answers as a radio group, keyboard-operable (arrow keys inside the group, Tab between groups). Each card shows the question, "Who answers", answer buttons, the "Planned" help line, and the "Why we ask" toggle. Questions are grouped by area under plain area names (People, Skills, Money, Technology, Data, Rules and controls), and blockers are marked "Must be Yes".
3. **Step 5 opens with "How it works":** heading "First, how will this tool work in your hotel?", the 1–2 gates, a one-line explanation that the answers decide which questions follow. Changing a gate later re-computes the visible questions and re-checks any must-have contradiction. Answers to hidden questions are kept but don't count.
4. **Result layout, in this order:**
   1. verdict word and colour (Ready green, Almost ready amber, Not ready red, Not enough info grey, Soft stop blue);
   2. **one-sentence main reason** (for example "2 blockers are No: …");
   3. the sensitive flag if raised;
   4. **Top 3 actions** with owner;
   5. Copy and Download (PDF);
   6. details by area (n of m in place);
   7. action plan by person (copy per person);
   8. questions to ask the vendor (generated from Don't know yet and Vendor-owned questions);
   9. every question and answer;
   10. "How this was worked out" (the formula in plain words);
   11. **score % last**, labelled "Readiness score".
   12. disclaimer.
   No legal section.
5. **Empty and error states:** no use case chosen leads to the fallback. If storage is unavailable, show the banner "Your answers can't be saved in this browser. Use Save as file." If a file fails to open, show "This file isn't a saved check from this tool." If the PDF fails, show "The PDF couldn't be made. Use Copy instead."
6. **Save and resume, and migration:**
   - Store under a new key `hftp-readiness3-v1`, in a single record per check.
   - Feature-detect `window.storage` (artifact storage, async, try/catch, personal scope `shared:false`). Fall back to `localStorage` in try/catch, then to memory.
   - "Save as file" and "Open a saved file" use `{kind:"hftp-do-you-need-ai", v:4, rules:"3.0", savedAt, check}`.
   - **Migration of v3 store files and v2.6.1 files:**
     - keep the hotel profile;
     - map "Not sure" to Don't know yet;
     - map old must-have IDs 1–10 to m1–m10 (m5 is reworded and its old answer is kept as-is);
     - m11 and the gates start empty;
     - map old question answers by ID: kept/fixed/rewritten IDs map directly; split parts both take the old answer; merged and removed answers are dropped and counted;
     - flip old Q1: old Yes becomes new No and old No becomes new Yes;
     - show "Imported from v2.6.1: please answer N new questions" and open the first unanswered screen.
   - Use the `original_questions[].new_ids` mapping in the full JSON to build a small migration table at build time.
7. **Downloads:** the claude.ai viewer blocks page-started downloads, including `data:` and `blob:` links. Build PDF and file download buttons with the artifact **downloads capability** that the Artifact tool declares at publish. Keep **Copy** fallbacks for the plan and the saved check (clipboard JSON). Test both paths.
8. **Mobile and accessibility:**
   - Works at 360 px wide with no horizontal scroll.
   - WCAG 2.2 AA contrast; verdict colour never on its own (always the word as well).
   - Visible focus.
   - `aria-live` for the result.
   - Labels on all controls.
   - Reduced motion respected.
   - Prints cleanly.
9. **Terms:** use "Don't know yet", "Doesn't apply", "Planned", "blocker" (shown to users as "Must be Yes"), "Readiness score". Never use "Not sure", "Unknown" or "N/A".
10. **PDF:** A4, page 1 has hotel, use case, date, verdict, reason, flag and top 3 actions; the rest follows the result order; footer "page n of N" plus the disclaimer; no legal section.

## 7. Phases and commits

| Phase | Work | Commit message |
|---|---|---|
| P0 | Copy `readiness-2` to `readiness-3`, rename ids and keys, add `spec/`, build passes, old tests run against the copy | `readiness-3: scaffold from v2.6.1` |
| P1 | Data layer: load the inlined runtime JSON, validate it with the schema in build and tests, glossary | `readiness-3: v3 question data` |
| P2 | Logic: gates inside step 5, visibility, score, verdict, caps, actions; port the golden cases; parity with `sim_v3.py` | `readiness-3: v3 rules` |
| P3 | Legal removal, plus the banned-term test at 0 | `readiness-3: remove legal content` |
| P4 | UX (§6), PDF, save/resume, migration, downloads | `readiness-3: v3 UX, PDF, migration` |
| P5 | Full sweep parity, Playwright smoke, accessibility checks, self-review | `readiness-3: tests and self-review` |
| P6 | CHANGELOG, REVIEW_RESPONSE, version 3.0.0, final build, publish as a **new** artifact | `readiness-3: v3.0.0` |

## 8. `REVIEW_RESPONSE.md`

Make one row per finding: finding, what changed, where (file and function), test, commit. It must cover:
- **T1–T11** (template problems):
  - T1 "or confirmed possible": replaced by Don't know yet / Planned help;
  - T2 "digital, up to date and ready";
  - T3 cost questions: kept as nice-to-have and hidden when already paid;
  - T4 "in charge of": merged into m1 or made specific;
  - T5 "know enough": made concrete;
  - T6 DPIA: removed;
  - T7 copy-paste questions;
  - T8 duplicates within a use case;
  - T9 duplicates across steps;
  - T10 add-on wording drift;
  - T11 no "what does it do" question: the gates.
- **L1–L6** (logic):
  - L1 blockers in the use-case step;
  - L2 sensitive flag driven by gate answers;
  - L3 "Doesn't apply" for m2/m4, offered directly with help text, gate contradiction check;
  - L4 soft stop after "not worth it";
  - L5 Q1 polarity and soft stop;
  - L6 reason before %, % last.
- **The 7 Wrong use cases:** hr-5, hr-1, hk-6, res-8, it-4, fo-7, hr-6.
- **The top 10 fixes.** #2 ("legal answers as blockers") is answered as: *superseded by the decision to remove legal content; practical blockers and the sensitive flag replace it.*
- Row per action count from §3 (`counts` in the JSON), with the note "661/661 originals accounted for".

## 9. Acceptance criteria: 10/10 means all of these are true

**Question quality**
- 100% of shown strings come verbatim from the JSON (test: render every use case × gate combination and compare).
- Every question is 20 words or fewer, has one question mark and one idea, and has no unexplained acronym.

**Tailoring**
- Every use case shows its own gates first.
- Every question shown for a use case is the one in that use case's JSON list, including split, new and gate-added questions.
- No generic six-area template text remains.

**Logic accuracy**
- All 33 golden cases pass.
- The full sweep matches `sim_v3.py` on verdict and score for all 26,935 runs.
- The invariants hold:
  - no dead question (each one is visible under some gate combination);
  - every blocker answered No gives Not ready;
  - a single non-blocker No never gives Not ready;
  - a blocker answered Planned or Don't know yet never gives Ready;
  - Doesn't apply is offered only on m2 and m4. When accepted, it never changes the verdict compared with Yes. When a gate contradicts it, it counts as Don't know yet, can never give Ready, and always shows the note.

**Usefulness**
- Every non-Ready result has a reason sentence and 1–3 actions with owners.
- Every Don't know yet becomes a "Find out" action or a vendor question.
- The PDF and Copy contain the same top 3.

**UX**
- Playwright smoke test passes on desktop (1280×800) and mobile (360×740): a full run for golden cases 1, 2, 9, 14, 15 and 19, Back keeps answers, reload resumes, save-as-file then open restores, migration of the v2.6.1 fixture works, PDF generates, keyboard-only run of golden case 1.
- axe-core (from devDependencies already in the repo only; if it isn't there, do manual checks and list them) reports 0 serious or critical issues.
- No horizontal scroll at 360 px.
- Banned-term grep finds 0.

**Golden cases** (from `golden_cases_v3.json`; "other answers" are all Yes; Step 2 is all Yes unless shown):

| # | Case | Use case | Step 2 changes | Gates | Must-haves changed | Questions changed | Expected verdict | Score | What it checks |
|---|---|---|---|---|---|---|---|---|---|
| 1 | All Yes, suggests only | rm-1 | — | G_ACT=suggests | — | — | **Ready** | 100 | Clean Ready path. |
| 2 | One tailored blocker No | rm-1 | — | G_ACT=suggests | — | te1=no | **Not ready** | 93 | Any blocker No gives Not ready (fixes L1: tailored questions could not block). |
| 3 | Acts by itself, switch-off No | rm-1 | — | G_ACT=acts | — | ACT_OFF=no | **Not ready** | 94 | Gate-added blocker shows and blocks. |
| 4 | Acts by itself, all Yes | rm-1 | — | G_ACT=acts | — | — | **Ready** | 100 | Gate-added blockers answered Yes keep Ready. |
| 5 | Nice-to-have No only | rm-1 | — | G_ACT=suggests | — | fi1=no | **Ready** | 97 | A single nice-to-have No does not block. |
| 6 | One blocker Planned | rm-1 | — | G_ACT=suggests | — | da1=planned | **Almost ready** | 96 | Planned blocker caps at Almost ready. |
| 7 | All tailored questions No | rm-1 | — | G_ACT=suggests | — | all 7 visible use-case questions = no | **Not ready** | 68 | Fixes v2.6 bug where all tailored No still gave Almost ready. |
| 8 | Everything Don't know yet | rm-1 | — | G_ACT=suggests | all 11 = dk | all 7 visible use-case questions = dk | **Not enough info** | 0 | More than 50% Don't know yet. |
| 9 | Step 2 Q1 No | rm-1 | s1=no | G_ACT=suggests | — | — | **Soft stop** | — | Q1 No (rules would do) is a soft stop, not a hard stop. |
| 10 | Step 2 Q1 No, continue anyway | rm-1 | s1=no (then Continue anyway) | G_ACT=suggests | — | — | **Almost ready** | 100 | Continuing after a soft stop caps at Almost ready. |
| 11 | Step 2 Q1 Yes means towards AI | gx-3 | — | G_PAID=no | — | — | **Ready** | 100 | Polarity flip: Yes no longer ends the check. |
| 12 | Step 2 Q2 No | gx-3 | s2=no | G_PAID=no | — | — | **Soft stop** | — | "Probably not worth it" soft stop, no full plan. |
| 13 | Step 2 Q3 Don't know yet | gx-3 | s3=dk | G_PAID=no | — | — | **Almost ready** | 100 | Step 2 uncertainty holds Ready back. |
| 14 | Free ChatGPT-style writing tool | sm-1 | — | G_PAID=yes, G_LINK=no | m2=na, m4=na | — | **Ready** | 100 | Must-haves 2 and 4 at Doesn't apply are excluded, not failed; fi and te questions hidden. |
| 15 | Doesn't apply contradicted by a gate | sm-1 | — | G_PAID=no, G_LINK=yes | m2=na | — | **Almost ready** | 93 | Must-have 2 Doesn't apply, then the gate says new money is needed: m2 counts as Don't know yet and the contradiction note shows. Note shown: "You said no new budget is needed, but you also said this tool needs new money. Must-have 2 now counts as Don't know yet." |
| 16 | Connections Doesn't apply contradicted | sm-1 | — | G_PAID=yes, G_LINK=yes | m2=na, m4=na | — | **Almost ready** | 92 | m4 Doesn't apply but the gate says it must connect: m4 becomes Don't know yet with a note; m2 stays excluded. Note shown: "You said no connections are needed, but you also said this tool must connect to your hotel systems. Must-have 4 now counts as Don't know yet." |
| 17 | Doesn't apply with no matching gate | gx-3 | — | G_PAID=yes | m4=na | — | **Ready** | 100 | m4 Doesn't apply is accepted when no gate contradicts it. |
| 18 | Must-have 11 (staff shown) No | sm-1 | — | G_PAID=no, G_LINK=yes | m11=no | — | **Not ready** | 93 | New staff-training must-have is a blocker. |
| 19 | Shift planning per person | hr-1 | — | G_LINK=yes, hr1-person=yes | — | — | **Almost ready** | 100 | Per-person allocation raises the sensitive flag and holds at Almost ready. |
| 20 | Shift planning by demand only | hr-1 | — | G_LINK=yes, hr1-person=no | — | — | **Ready** | 100 | Plain demand-based rota is not sensitive and can be Ready. |
| 21 | Shift planning, final decision No | hr-1 | — | G_LINK=yes, hr1-person=yes | — | n1=no | **Not ready** | 95 | Use-case-specific human-decision blocker blocks. |
| 22 | Recruiting, all Yes | hr-2 | — | hr2-mode=screen | — | — | **Almost ready** | 100 | Hiring is always sensitive: Almost ready with adviser action. |
| 23 | Guest chat, staff hand-over No | gx-2 | — | G_ACT=suggests | — | GUEST_STAFF=no | **Not ready** | 95 | Guest-facing blocker from the automatic guest rule blocks (replaces the old disclosure blocker test). |
| 24 | Gate answered Don't know yet | gx-2 | — | G_ACT=dk | — | — | **Almost ready** | 100 | Unknown gate caps at Almost ready with a vendor action. |
| 25 | Face check searches stored faces | fo-3 | — | fo3-match=no | — | — | **Almost ready** | 100 | Gate option with cap. |
| 26 | Card payments on voice line, check No | res-1 | — | G_ACT=suggests, res1-pay=yes | — | n1=no | **Not ready** | 94 | Conditional blocker shown only when payments are taken. |
| 27 | Linen forecasting only | hk-3 | — | hk3-type=forecast | — | — | **Ready** | 100 | Tag-tracking questions hidden; Ready possible without them. |
| 28 | Group platform for a single hotel | gm-4 | — | gm4-group=one | — | — | **Almost ready** | 100 | Not-a-fit redirect; continuing caps at Almost ready. |
| 29 | Personalised prices per guest | rm-2 | — | G_ACT=acts, rm2-personal=yes | — | — | **Almost ready** | 100 | Conditional sensitive flag. |
| 30 | Many Planned, no No | rm-1 | — | G_ACT=suggests | all 11 = planned | — | **Not ready** | 65 | Fewer than half of blockers Yes gives Not ready even with no No. |
| 31 | Camera video, face recognition | it-4 | — | it4-face=yes, it4-staff=no | — | — | **Almost ready** | 100 | Sensitive always; face recognition adds adviser action. |
| 32 | None fits, all Yes | none | — | G_ACT=suggests, G_GUEST=staff, G_PEOPLE=no, G_LINK=yes, G_PAID=no | — | — | **Almost ready** | 100 | None fits is capped at Almost ready. |
| 33 | Kiosk avatar, all Yes | fo-7 | — | fo7-camera=no | — | — | **Ready** | 100 | Automatic guest and acts-by-itself blockers always shown. |

## 10. Self-review before you report

Check each item and give evidence (command output, test name or file and line):
- [ ] `readiness-2/`, `tools/index.html`, `build-hub.mjs` and other tabs are unchanged (`git diff --stat` on those paths is empty).
- [ ] One `index.html`, under 3 MB, no external URLs (grep `http` and list every hit, which should only be text links that open nothing, or none).
- [ ] Schema validation runs in the build and in the tests.
- [ ] All 99 use cases are reachable in the picker. Each gate combination renders the expected list.
- [ ] Golden cases pass, the sweep has 0 differences, and the invariants pass.
- [ ] Banned-term grep finds 0. Legal leftovers are listed.
- [ ] "Don't know yet" is the only uncertainty term (grep "Not sure", "Unknown", "N/A").
- [ ] Flow order is hotel → 5 questions → must-haves → use case → gates + use-case questions, the same as v2.6.1.
- [ ] Result order: verdict → reason → flag → top 3 → … → % last.
- [ ] Migration fixtures pass (v2.6.1 store record and saved file).
- [ ] Downloads work through the capability, and Copy fallbacks work.
- [ ] CHANGELOG, REVIEW_RESPONSE and the version are 3.0.0.
- [ ] Then score yourself 0–10 on each of the five dimensions, giving the evidence for each score. Any score below 10 must list what is missing.

## 11. Publish as a new artifact, then report

1. `node tools/readiness-3/build.mjs` → `tools/readiness-3/index.html`.
2. Open it locally with Playwright for a last smoke run.
3. Use the Artifact tool to publish **`tools/readiness-3/index.html` as a new artifact** titled "Do you need AI? v3.0". Give no existing artifact URL. If the tool says it would update an existing artifact, stop and report instead.
4. Print the new private URL. Ludo shares it from the page header (Share). Note: on Pro/Max/Ultra, artifacts are private until shared. Storage: new artifacts can store up to 100 MB and 25,000 records. Downloads need the account's downloads capability.
5. If publishing is not available in this session (no claude.ai login, API-key session, Bedrock/Vertex/Foundry), don't work around it. Report that publishing was not available, and give Ludo these steps: open Claude Code signed in with `/login` → `cd` to the repo → ask "Publish tools/readiness-3/index.html as a new artifact titled 'Do you need AI? v3.0'" → share from the page header.

**Report format (return exactly this):**
```
## Result
New artifact URL: … (or "not published: <reason>")
Output file: tools/readiness-3/index.html (<size> KB, sha256 …)
Commits: <hash> <message> (one per phase)
## Tests
golden: n/33 · sweep: n runs, 0 diffs · invariants: … · banned-term grep: 0 · Playwright: desktop x/y, mobile x/y · axe: …
## Self-assessment (0–10, with evidence)
Question quality … · Tailoring … · Logic accuracy … · Usefulness … · UX …
## Legal leftovers not removed
file:line, text, reason (or "none")
## Suggested content changes (not applied)
question id, issue, suggestion
## Judgement calls
…
## Known limits
…
```
