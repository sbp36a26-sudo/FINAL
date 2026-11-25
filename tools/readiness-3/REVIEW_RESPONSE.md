# Review response: "Do you need AI?" v3.0.0

**Source of the findings.** No `review.md` was supplied with the spec (`spec/` holds none). The findings below are the ones
`spec/MASTER_PROMPT.md` lists in §1 and §8 (T1–T11, L1–L6, the 7 Wrong use cases, top-10 fix #2, the action counts). The spec names
only #2 of the review's top 10 fixes; the other nine are not in the spec, so they cannot be quoted here. The §1 problem list (six
items) stands in for them, each mapped to its rows.

Every row names a test. `tests/review.test.mjs` holds one check per finding (run: `node tools/readiness-3/tests/review.test.mjs`,
37 passed). The question texts themselves are the owner's (`spec/usecase_questions_v3.json`, used verbatim); "what changed" for
data rows means the page now carries and shows that data, and "where" names the file and function that use it.

Commits: `0e492d8` scaffold · `8e0cbed` question data · `d91bf7f` rules · `fa0b459` legal removal · `23fe8f8` UX, PDF, migration ·
`0d8092e` tests and self-review · "v3.0.0" = the commit `readiness-3: v3.0.0` that adds this file.

## Template problems (T1–T11)

| # | Finding | What changed | Where | Test | Commit |
|---|---|---|---|---|---|
| T1 | "or confirmed possible" blurred done and promised | Gone from every question. Answers are Yes / Planned / No / Don't know yet, with the help line "If your vendor has confirmed it in writing but it isn't set up yet, answer Planned." under every scored question | `src/app3.js` `PLANNED_HELP`, `qCard`, `vMust`; data `answers.check` | `review.test.mjs` T1; `browser/questions.cjs` (Planned help on 11,528 cards per width) | `8e0cbed`, `23fe8f8` |
| T2 | "digital, up to date and ready" (three ideas, vague) | Not in any v3 question; data questions name the system and the history needed | data `use_cases[].questions`; `src/rules3.js` `visible` | `review.test.mjs` T2 | `8e0cbed` |
| T3 | Cost questions treated like blockers, asked when already paid | Cost questions are Nice to have or Important, never Must be Yes; "Is this paid already?" (G_PAID = yes) hides the Money questions (`hide_area`) | `src/rules3.js` `effects`, `visible` | `review.test.mjs` T3 (all use cases that ask G_PAID); golden 14 | `8e0cbed`, `d91bf7f` |
| T4 | "in charge of" asked again in every use case | Ownership is must-have 1 only ("A named owner with time"); use-case questions name the specific person and task | data `must_haves[0]`, `use_cases[].questions` | `review.test.mjs` T4 | `8e0cbed` |
| T5 | "know enough" (not checkable) | Made concrete ("Can the revenue team spot a forecast that looks wrong and correct it?") | data `use_cases[].questions` (area Skills) | `review.test.mjs` T5 | `8e0cbed` |
| T6 | The impact-assessment question | Removed with all legal content (§5); a practical core kept where there was one | data; `lib/banned.mjs` (build and tests fail on the term) | `review.test.mjs` T6; `banned.test.mjs` | `8e0cbed`, `fa0b459` |
| T7 | Copy-paste questions across use cases | 20 texts repeated across use cases in v2.6.1 → 9 in v3 (shared cost and card-security wording only) | data `use_cases[].questions` | `review.test.mjs` T7 | `8e0cbed` |
| T8 | Duplicates within a use case | None: every use case's question texts are unique | data | `review.test.mjs` T8 | `8e0cbed` |
| T9 | Duplicates across steps (must-haves, step 2) | No use-case question repeats a must-have or step-2 question | data | `review.test.mjs` T9 | `8e0cbed` |
| T10 | Add-on wording drift | One form for the 14 add-on questions: "Do you know the cost of the … add-on?", Money, Nice to have | data | `review.test.mjs` T10 | `8e0cbed` |
| T11 | Nothing asked what the tool actually does | Step 5 opens with "First, how will this tool work in your hotel?": 1–2 How it works questions per use case (117 asked in all), whose answers add, hide, flag or cap | `src/app3.js` `vUse`, `gateCard`; `src/rules3.js` `askedGates`, `effects`, `visible` | `review.test.mjs` T11; `browser/questions.cjs` (How it works cards first, 1,636 combinations); `browser/ui.cjs` "step 5 opens with How it works" | `d91bf7f`, `23fe8f8`, `0d8092e` |

## Logic problems (L1–L6)

| # | Finding | What changed | Where | Test | Commit |
|---|---|---|---|---|---|
| L1 | Step-5 answers could never block | Every question has a weight; any visible blocker answered No gives Not ready; fewer than half of the blockers at Yes gives Not ready | `src/rules3.js` `evaluate` (verdict order, line 167) | golden 2, 3, 7, 21, 23, 26, 30 (`rules3.test.mjs`); invariant "every blocker No → Not ready"; `review.test.mjs` L1 | `d91bf7f` |
| L2 | Sensitive flag was a fixed label | Always on for 10 use cases, raised by a How it works answer in 13 more; fixed text, caps at Almost ready, "Ask an adviser before a pilot." is action 1 (General manager) | `src/rules3.js` `evaluate` (lines 123–140, 178); `src/result3.js` `model` | golden 19, 20, 22, 29, 31; `review.test.mjs` L2; `browser/ui.cjs` "the sensitive flag verbatim" | `d91bf7f`, `23fe8f8` |
| L3 | Must-haves 2 and 4 could not be "Doesn't apply" | m2 and m4 offer Doesn't apply with their help text; excluded from the score; a contradicting How it works answer turns it into Don't know yet with the note on step 5 and the result, and "Change my answer" | `src/rules3.js` `contradictions`, `evaluate`; `src/app3.js` `vMust`, `gateCard`, `vResult` | golden 14–17; invariants (Doesn't apply never changes the verdict vs Yes; contradicted never Ready, always the note); `browser/ui.cjs` contradiction block | `d91bf7f`, `23fe8f8` |
| L4 | "Probably not worth it" did not stop | s2 No is a soft stop: stop message, "Simpler options to try first", Change my answers / Continue anyway / Download (PDF) | `src/rules3.js` `softStop`; `src/app3.js` `vStop` | golden 12; `review.test.mjs` L4/L5 | `d91bf7f`, `23fe8f8` |
| L5 | Q1 had reversed polarity and ended in a hard stop | Yes now means towards AI; No is a soft stop; Continue anyway caps at Almost ready with its reason; old Q1 answers are turned round on import | `src/rules3.js` `softStop`, `evaluate`; `src/store3.js` `fromV2` | golden 9, 10, 11; `store3.test.mjs` migration; `browser/ui.cjs` golden 9 and 10 | `d91bf7f`, `23fe8f8` |
| L6 | The score came before the reason | Verdict word and colour → one-sentence reason → flag → top 3 → … → readiness score last → disclaimer | `src/app3.js` `vResult`; `src/result3.js` `model`; `src/pdf3.js` `blocks` | `browser/ui.cjs` "result in the §6.4 order"; `result3.test.mjs` section order; `review.test.mjs` L6 | `23fe8f8` |

## The 7 Wrong use cases

All seven are fully rewritten in the JSON (`review_verdict` Wrong); no v2.6.1 question text is kept, and each asks its own How it
works questions. Test for each: `review.test.mjs` "Wrong <id>", plus `browser/questions.cjs` (every combination drawn verbatim).

| Use case | What changed | Where | Test | Commit |
|---|---|---|---|---|
| hr-5 | Rewritten; always sensitive | data; `src/rules3.js` `evaluate` (`sensitive.always`) | `review.test.mjs` Wrong hr-5 | `8e0cbed`, `d91bf7f` |
| hr-1 | Rewritten (shift planning); per-person allocation raises the flag, a final-decision blocker added | data; `src/rules3.js` `effects` | golden 19, 20, 21; `review.test.mjs` Wrong hr-1 | `8e0cbed`, `d91bf7f` |
| hk-6 | Rewritten | data | `review.test.mjs` Wrong hk-6 | `8e0cbed` |
| res-8 | Rewritten; always sensitive | data; `src/rules3.js` `evaluate` | `review.test.mjs` Wrong res-8 | `8e0cbed`, `d91bf7f` |
| it-4 | Rewritten (camera video); always sensitive; face recognition adds the adviser action | data; `src/rules3.js` `evaluate` | golden 31; `review.test.mjs` Wrong it-4 | `8e0cbed`, `d91bf7f` |
| fo-7 | Rewritten (kiosk avatar); automatic guest and acts-by-itself blockers always shown | data; `src/rules3.js` `effects` (auto gates) | golden 33; `review.test.mjs` Wrong fo-7 | `8e0cbed`, `d91bf7f` |
| hr-6 | Rewritten; always sensitive | data; `src/rules3.js` `evaluate` | `review.test.mjs` Wrong hr-6 | `8e0cbed`, `d91bf7f` |

## Top 10 fixes

| # | Fix | Answer | Where | Test | Commit |
|---|---|---|---|---|---|
| 2 | Legal answers as blockers | Superseded by the decision to remove legal content; practical blockers and the sensitive flag replace it | `lib/banned.mjs`; `src/rules3.js` `evaluate`; `LEGAL_LEFTOVERS.md` | `banned.test.mjs` (page, sources, exports, PDF text: 0); `review.test.mjs` top-10 #2 | `fa0b459` |
| 1, 3–10 | Not listed in the spec (no review.md supplied) | Covered as far as the spec states them: generic template → T1–T11; nothing asked what the tool does → T11; step-5 answers could not block → L1; Q1 polarity and hard stop → L5; must-haves 2 and 4 → L3; seven Wrong use cases → table above | see those rows | see those rows | — |

## Action counts (`counts.actions` in the JSON)

661/661 originals accounted for. Each row: `review.test.mjs` "count <action>"; the migration table built from
`original_questions[].new_ids` (`build.mjs` `migrationModel`) carries kept, fixed, rewritten and split answers and drops and counts
merged and removed ones (`src/store3.js` `fromV2`; `store3.test.mjs`, `build.test.mjs`).

| Action | Count | What changed | Where | Test | Commit |
|---|---|---|---|---|---|
| keep | 395 | Same id and meaning; old answer carried on import | data; `build.mjs` `migrationModel`; `src/store3.js` `fromV2` | `review.test.mjs` count keep; `store3.test.mjs` | `8e0cbed`, `23fe8f8` |
| fix | 105 | Same id, wording fixed; old answer carried | same | `review.test.mjs` count fix | `8e0cbed`, `23fe8f8` |
| rewrite | 28 | Same id, new wording, same meaning; old answer carried | same | `review.test.mjs` count rewrite | `8e0cbed`, `23fe8f8` |
| split | 44 | Two questions `a` / `b` (88 v3 questions); both take the old answer | same | `review.test.mjs` count split | `8e0cbed`, `23fe8f8` |
| merge | 65 | Merged into another question; old answer dropped and counted in the import banner | same | `review.test.mjs` count merge | `8e0cbed`, `23fe8f8` |
| remove | 24 | Removed; old answer dropped and counted | same | `review.test.mjs` count remove | `8e0cbed`, `23fe8f8` |
| new questions added | 56 | New ids `n1`, `n2`, …; start empty after import | data | `review.test.mjs` count add | `8e0cbed` |
| added by How it works | 122 | Gate-key ids (`rm-2.ACT_LIMITS`); shown only under their answer; never hidden by `hide_area` | `src/rules3.js` `visible` | `review.test.mjs` "794 … 122"; `rules3.test.mjs` visibility; `browser/questions.cjs` | `d91bf7f` |
| **Total** | **661 originals → 794 v3 questions** | 661/661 originals accounted for | | `review.test.mjs` "661/661 originals accounted for" | `8e0cbed` |

## 3.0.1 follow-up

The clean-up inventory and the council's code-only BUILD NOW items are answered in `CHANGELOG.md` (3.0.1), one row per bug and per item,
each with its test. Two rows above change in effect: T11 (step 5 now holds the use-case questions back until the How it works
questions are answered, with a line saying how many follow; council BUILD NOW 1) and L6 (the reason sentence now names at most two
items, then "and N more"; council BUILD NOW 2). Scoring, verdicts and the question data are unchanged.
