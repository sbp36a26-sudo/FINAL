# Readiness check: changelog

## New answer "Planned, not done yet" and an honesty line (20 Nov 2026, rules stay v4)

Owner's decision. Rollback: `backup-mustfirst/` (the must-haves-first build, before this change).

| # | Item | Status |
|---|---|---|
| A1 | New answer **"Planned, not done yet"** (stored code `pl`), offered wherever "Partly" is (every Yes/Partly/No question, must-haves included; not on T2's own options or the lists of what the tool needs). Order: Yes · Planned, not done yet · Partly · No · Don't know yet (· Doesn't apply / way out where offered) | **Done** (`optsFor`) |
| A2 | Scored exactly like Partly: 1 point, answered; on a must-have it is not in place, level `stop` ("Not ready yet") | **Done**: `score()` returns Partly's state and points plus a `planned` flag used only for words. Proof: 3,920 tool × hotel × answer-set comparisons in `tests/planned.test.mjs` |
| A3 | Optional **"By when?"** date when Planned is chosen; stored in a new map `By` keyed by question code; survives save/reload, the JSON file and the share payload (`by`, plain `YYYY-MM-DD` strings); old data without it opens unchanged | **Done** (`byField`, `F.migrate`, `F.plannedDates`). The date is dropped when the answer changes away from Planned |
| A4 | Words: never "not in place" for a Planned answer. "Planned: finish before you sign" (`beforeWords`, so "before you go on using it" when in use) on the must-haves list, PDF and team page; action items "Finish: <action>" plus " (planned by <date>)" | **Done** (`plannedWords`, `finish`). Also used for Planned on non-must-have questions (gaps to close) |
| A5 | Counts and sentences: "5 of 8 must-haves done · 2 planned · 1 not in place · …"; "Not ready yet. 2 things are planned: finish them before you sign."; mixed: "Not ready yet. 1 thing to settle and 2 planned things to finish before you sign."; summary "2 of the 8 must-haves are planned, not done yet. Finish them before you sign: until then they hold the verdict back." | **Done** on the page, PDF, owner note, "Your checks" list, update screen, team page. The action plan's must-have group reads "Must-haves planned, not done yet…" (or "…still to put in place, some of them planned…" when mixed) |
| A6 | Update open items: a Planned item is open; "since last time": Planned → Yes counts as now done | **Done** (no change needed in the comparison: it compares must-haves in place) |
| A7 | "How this was worked out": "“Planned, not done yet” counts like Partly: 1 point, and on a must-have it holds the verdict back until it is done." (page and PDF); one more line in the CHANGES list; points line "Yes 2, Partly 1, Planned 1, No 0" | **Done** (`L.PLANNED_LINE`) |
| B | Honesty line "Nobody checks your answers. A Yes that isn't true only hides a problem you will meet after signing." on the start screen (small, under the intro) and appended to the must-haves intro; not on each question | **Done** (`HONEST`) |
| C | Earlier owner decisions kept: no score, subtitle, "Start a new check" in the result's top row, must-haves first with an answer needed (Planned counts), "Why these 98 tools?", sharing on, legal-check questions | Kept |

**Rules not bumped** (stay `v4 (20 Nov 2026)`): saved checks have no Planned answers, so no verdict changes on reopen (proved with fixtures recorded by the must-haves-first build). Not changed: storage keys, record format (`rv: 2`, `By` is optional), file format (`v: 3`), level keys, hub messages, shared profile key, `#use=` hash.

### Old test expectations changed

`tests/browser/mustfirst.cjs`: the must-haves intro regex now ends with the honesty line (owner's item B). No Node test expectation changed; `flow`, `logic`, `mustfirst` and `v4` suites are unchanged and green.

## Flow update: must-haves first (20 Nov 2026, rules stay v4)

Owner's request: "The first question section is the must-haves, with needed answers, and then like normal before, so the person answers the hardest and most important part at the start." Rollback: `backup-v4/` (the six-step build).

| # | Item | Status |
|---|---|---|
| 1 | New step 1 **Must-haves** before the area steps: every question `selectQuestions` marks `gate` (6 to 12 by tool, conditional ones included), in area order, each with a small area tag, its "What counts as Yes", note field and behaviour; the owner's intro line | **Done** (`vStep('must')`, `.areatag`) |
| 2 | "With needed answers": Next stays enabled; with a must-have unanswered it outlines the first one, says "Answer this to continue (“Don't know yet” is fine).", scrolls to it, focuses it and does not move on. "Don't know yet" counts as an answer; a blank or an answer no longer offered does not. Other steps unchanged | **Done** (FLOW guard `mustDone`, `pointToMust()`, `L.hasAnswer`) |
| 3 | The six area steps without the must-haves; an area with no question left is skipped; "Step n of 7" (or fewer) | **Done** (`F.questionSteps`, `F.stepQuestions`). Financial investment is skipped for most tools (its questions are must-haves) |
| 4 | Scoring, verdicts, area words and results unchanged; proof for old vs new order | **Done**: `tests/mustfirst.test.mjs` walks both orders for 98 tools × 5 hotel set-ups × 10 answer sets (4,900) and finds identical evaluation, verdict, counts, summary, first three, vendor questions and snapshot; the browser walk compares the result with the six-step build for a chatbot, a high-risk HR tool and a light tool |
| 5 | Texts mentioning six steps or step numbers | **Done**: header, progress, "More" ("From the must-haves (step 1)"), one line on the order in "How this result was worked out" on the page and in the PDF. **Rules not bumped** (stay `v4 (20 Nov 2026)`): nothing in the scoring changed, and a new version would have marked every saved v4 result as "worked out with earlier rules" and stopped the "since last time" comparison. "Changed in rules v4" is unchanged for the same reason. The team page had no step text |
| 6 | Saved data | **Done**: area steps keep their internal number (area 0–5), so a check saved at area step k reopens at the same area in the new numbering; any unanswered must-have → the must-haves step; "review"/"result" unchanged; an area with no question left → the next step in use (`F.placeStep`). Fixtures written by the six-step build before any change: `tests/fixtures/storage-v4.json`, `check-v4.json`. v3 fixtures still open |
| 7 | Prep screen | **Done**: must-haves section and "Start now" kept; one sentence says the check starts with the must-haves |
| 8 | Earlier owner decisions | Kept: header subtitle, "Start a new check" in the result's top row, "Why these 98 tools?", aligned hotel fields, sharing on, no score, legal-check questions |

Also fixed: a new check (picking another tool, "Start a new check", `#use=` from the AI Register) shared the earlier check's hotel object in memory, so changing how the hotel is run in the new check also rewrote the earlier check's saved hotel (and so its questions). Each check now gets its own copy. Found while writing the fixture.

Not changed: storage keys, record format (`rv: 2`), file format (`v: 3`), answer codes, level keys, hub messages, the shared profile key, the `#use=` hash.

### Old test expectations changed (each encoded the old step order)

In `tests/flow.test.mjs`: `prep --begin-->` was `0`, now `'must'`; `0 --back-->` was `'prep'`, now `'must'`; `result --edit-->` and `review --edit-->` were `0`, now `'must'`. The "every other event is refused" loop now runs with every must-have answered, so `must --next-->` counts as a table entry. `logic.test.mjs` and `v4.test.mjs` are unchanged and green. `tests/browser/walk.cjs` encodes the six-step order; it is kept as the v4 record (run it against `backup-v4/`), and `tests/browser/mustfirst.cjs` is the new browser proof.

## v4 (20 Nov 2026)

Build pass after three audits (`reports/audit-readiness/1_fact_logic.md`, `2_journey_visual.md`, `3_benchmark.md`) and the build ruling in `reports/Council - readiness check audit.md`, section A, with the owner's overrides (sharing stays on; the header sentence stays; "Start a new check" stays in the result's top row; verdict name in one constant; legal-check questions stay). Notes for people: `reports/audit-readiness/4_build_notes.md`. Rollback: `backup-v3/`.

Not changed: storage keys, record format (`rv: 2`), file format (`v: 3`), answer codes, level keys (`stop` / `open` / `pilot`), hub messages, the shared profile key, the `#use=` hash, other tools' sources.

| # | Ruling item | Findings | Status |
|---|---|---|---|
| 0 | Safety net: `backup-v3/`, fixtures saved by the v3 build, failing tests first, `RULES = 'v4 (20 Nov 2026)'` | - | **Done** |
| 1 | An all-"Doesn't apply" area is left out of the verdict | F03 | **Done** |
| 2 | An area holds the verdict back only below 40% with at least two known answers | F04, F30 | **Done** |
| 3 | Way-out answers are in place but give no points | F02 | **Done** |
| 4 | "Uses no personal data" not offered for sensitive-data, chat or high-risk tools; new wording; stored answer asked again | F01 | **Done** |
| 5 | Three states for a must-have; Yes without a note = not confirmed, level `open` | F12, J11 | **Done.** A Yes without a note keeps its 2 points (before: 1). |
| 6 | Tick lists: 2 × in place ÷ (in place + not yet); unknown items keep the list "to find out" | F05 | **Done** |
| 7 | One definition of "answered"; "N open items in M questions" | F13, F14 | **Done** |
| 8 | "Don't know yet" on a vendor question saves "The vendor" at once | F17 | **Done.** Also applied when the result is worked out, so saved checks benefit. |
| 9 | AI Act check: way out for Switzerland, UK and Other with a note; item list headed "If the EU AI Act applies to you"; seven countries added; "Other (outside the EU)" | F06, F33 | **Done** |
| 10 | P5 and G3 are must-haves for high-risk labels | F11 | **Done** (res-8, hr-2, hr-5; not for sensitive-data tools, B7) |
| 11 | T1 exempt only when technology needs are "None"; legend corrected | F19 | **Done.** 16 tools gain T1 as a must-have; "None or CMS plug-in" (sm-1) is read as None. List in the build notes. |
| 12 | Guest-facing decided by the tool, not the department | F18 | **Done.** 8 tools lose the guest questions; no chat-labelled tool does. List in the build notes. |
| 13 | "Changed in rules v4" in "How this was worked out" and in the README | - | **Done** (14 lines) |
| 14 | "internal wording review … Not yet reviewed by outside experts or tested with hotels." | F10 | **Done** (page and footer) |
| 15 | Swiss and UK labour notes and the Spanish-authority line removed; article and annex numbers stripped; nothing marked as still to be verified is shown | F08, F34, F35 | **Done** (in the build and again in `legal()`) |
| 16 | DPIA help, reason and new answer "Checked: not required (confirmed in writing)" | F07 | **Done.** The reason line reads "…ask your data protection contact whether this tool needs a DPIA", because the ruled wording contained the string its own test bans. |
| 17 | Every high-risk item shown (eight, then "Show N more"); "applies from 2 Dec 2027" on the label line | F21, F20 | **Done** |
| 18 | Neutral sentence for hotels outside the EU | F22 | **Done** |
| 19 | Sharing and the data notice | F09, J6, J23 | **Done as the owner ruled, not as the council did:** sharing stays on (`SHARING_ON = true`); the three placeholders are replaced by one honest line; the test copy outside the hub is kept. |
| 20 | What is sent is listed in full; "No hotel name unless you tick the box"; linked to the hub account | F23 | **Done** (hotel page and team page) |
| 21 | Summary sentences; stage "already in use" never says "before you sign" or "run a pilot" | F11, F29, J17 | **Done** |
| 22 | "One must-have at No means 'Not ready yet'…" | F16 | **Done** |
| 23 | No "about 15 minutes"; question and must-have counts instead | F15 | **Done** |
| 24 | PDF legal section prints the conditions and the disclaimer; owner note lists every condition; headings follow the stage | F24, F25, F26 | **Done** |
| 25 | Neutral lead-ins for the lists; "Tick" is gone | F27 | **Done** |
| 26 | Unsourced claims cut from step subtitles and one list item | F28 (part) | **Done** (tool descriptions untouched, as ruled) |
| 27 | Small corrections | F31, F32, F36, F37, F38, F40, F41 | **Partly.** Done: paid-for source, provider question, "Nothing is open.", "at least two words", "Please reply to each line", README list, team view label, code comment, D5b help, fonts notice, PDF name warning. Not done: the hub tooltip "how the score was worked out" (it is in `tools/hub/hub-bar.html`, another tool's source). |
| 28 | One word, "note"; grey hint, red only after leaving the field; "Yes, note missing" | J11 | **Done.** The note can also be added on the result page. |
| 29 | One-line header after the start screen; "Your checks (n)"; project line | J10, J25, J7 | **Done.** The owner's sentence stays on the start screen. The link shows once a check exists. |
| 30 | "Next" always enabled, points to what is missing | J2 | **Done** |
| 31 | One-line intro, stage hint, focus after a tool pick | J1, J5, J9, J4 | **Done** |
| 32 | Prep screen collapsed, "Start now" top and bottom | J8 | **Done** |
| 33 | Search by word, name before description, synonyms, count; list grows on phones; legend removed | J3 (part) | **Done** |
| 34 | Result first screen | J17, J19, J20, V2, V7 | **Done, with three differences:** the count line also says "n not in place" so the parts add up; "Start a new check" (owner) and "Update open items" stay beside the primary button; the action plan stays an open card and the must-haves and areas are closed rows. |
| 35 | Areas in words, no percentages | J21 | **Done** |
| 36 | "Copy for IT"; groups sorted by person; list items as instructions | J18 | **Done** |
| 37 | Update page: must-haves first, answered questions stay with "Undo"; confirmation on its own line | J26, J24 | **Done** |
| 38 | Spacing, date inputs, focus outline, line lengths, 44 px targets, phone "Next" | V1, V8, V10, V5, V11, J28 | **Done** |
| 39 | Selected answer in the accent colour with a tick; control borders #8A8F99 (3.3:1 on white); track outlines | V3 | **Done** |
| 40 | Type scale, "Must-have" label on the question's line, fixed chip column, PDF wording and file name | V4, V6, V9, V12 | **Done** on the hotel page. The team page keeps its small table headings. |

Section C of the ruling: nothing built.

### Old test expectations changed (each encoded a fault the audit found)

1. `logic.test.mjs`, "proof 'x' does not count": expected `stop`, now `open` with no must-have "not in place" (F12: a Yes with a missing or too-short note is not a No).
2. `logic.test.mjs`, "Yes on must-haves and Doesn't apply elsewhere": expected "not pilot", which held only because all-"Doesn't apply" areas blocked the verdict for good (F03). Now expects the areas to be left out, and adds a check that "Doesn't apply" is not accepted on a protective question.
3. Two test labels reworded (no change of expectation) so the retired verdict name does not appear.

Added: 10 flow tests (`home`), 81 tests in `tests/v4.test.mjs`, browser scripts in `tests/browser/`.
