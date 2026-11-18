# Hotel AI readiness tool: how the scoring works, stress test, and a proposed 0–100 score

Primary source: `/home/user/final/tools/readiness/index.html` (read only, not modified). The data is the `<script id="rdy">` JSON on line 472. The scoring code is in the page script: `needs()` at line 541, `rel()` at 553, `RES_SKIP`/`items()` at 565–566, `VAL` at 576, `evaluate()` at 581, `gaps()` at 599, `qHTML()` at 752 and `updateResult()` at 798.
Reproduction scripts (code copied verbatim from the page, run in Node): `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/sim.js`, `profiles.js` and `mc.js`, with the data in `rdy.json` in the same folder.
In this note, "Source: tool" means the finding was read directly from that file or reproduced with those scripts.

## 1. What the current scoring logic does

### Takeaway
The verdict depends only on two things: whether any gate is answered No, and the lowest area percentage. That lowest percentage is checked against 40% and 75%. Every answered question counts equally. The core, "check if relevant" and "other" labels only change how questions are displayed and whether the result is marked provisional. The use case's intensity (Light, Moderate, Heavy) is never used in scoring. There is no "Not sure" option. N/A and blank answers are both removed from the denominator, and a gate at N/A or left blank does not block the result.

### Cited findings
- **Data.** There are 6 areas: pe, sk, fi, te, da and or. The checklist has 31 questions: pe has 5 (P1 P4 P5 P6 O6), sk 3 (P2 P3 O4), fi 5 (F1–F5), te 5 (T1–T5), da 5 (D1–D5) and or 8 (O1 O2 O3 O5 G1–G4). The data also holds 20 building blocks, 9 types of tool (A1–A9), 91 use cases and 4 risk add-ons (sens, pay, hw, auto). Source: tool, `rdy` JSON.
- **Gates.** The gates are the questions with `gate:true`: P1, F1, F2, T1, D5 and O1 (line 519). Each has a "proof" text, for example F2 "Baseline figure with date and method". Source: tool.
- **Questions shown for a use case.** `items()` (line 566) lists all 31 checklist questions for every use case. It also adds one "resource check" per area (`R-pe` … `R-or`, the question "Do you have what this use case needs here?" plus that use case's text from the sheet). The resource check is dropped only when the sheet text starts with none, n/a, "not applicable" or a dash (`RES_SKIP`). Every use case therefore has 36–37 items. All areas always contain questions: pe has 6, sk 4, fi 6, te 6, da 6 and or 9 (including R-checks). Source: tool.
- **Core, check and other (`rel()`, line 553).** A question is **core** in any of these cases:
  - it is a gate;
  - it is in the use case's `chk` ("check first") list;
  - one of its building blocks is marked `C` for that type of tool in the block's 9-character matrix string `m`, and the block's `sheet` list contains the question;
  - a risk add-on lists it in `codes`.

  It is **check** when one of its blocks is `C` or `S` for that type without the sheet condition. Otherwise it is **other**. The governance use case lg-4 has no type of tool, so it uses layer-1 blocks as `C`. All R-checks are core. Across the 91 use cases, the number of core items is 17–31 (mean 21.7). Examples: gx-2 chatbot (A2 Moderate +auto) has 28 core of 37; rm-2 pricing (A3 Moderate +auto) 22; gx-3 review replies (A1 Light) 19; kc-1 food-waste camera (A7 Moderate +hw) 24; fo-3 biometric check-in (A9 Heavy +sens) 25; lg-4 governance 17. Source: tool, `sim.js`.
- **Answer options and points.** The options are Yes = 2, Partly = 1, No = 0 and N/A (`VAL`, line 576; radio buttons in `qHTML()`, line 752). There is **no "Not sure" option**. Clicking a selected radio again clears it, so the answer becomes blank. Source: tool.
- **Area percentage (`evaluate()`, line 581).** For each area: pct = sum of points ÷ (2 × number of Yes/Partly/No answers). N/A and blank answers are left out of both the numerator and the denominator. If an area has no Yes/Partly/No answers, pct = null and the area is ignored. Core, check and other questions all carry the same weight, and so do R-checks. Source: tool.
- **Verdict.** The code applies these rules in order:
  1. `none` if nothing is answered;
  2. otherwise "Build foundations first" if any gate is `n`;
  3. otherwise "Build foundations first" if the lowest scored area is below 0.40;
  4. otherwise "Ready to scale" if the lowest area is 0.75 or more;
  5. otherwise "Ready to pilot".

  A result is flagged "provisional" when the verdict is not `none`, no gate is at No, and at least one core item is blank. Intensity (`int`) and type of tool (`arch`) never enter `evaluate()`. They only decide which questions are labelled core. Source: tool.
- **The stated rules match the code, with exceptions.** The levels say "Any gate at No, or an area below 40%", "All gates met; areas 40–74%" and "All gates met; areas 75% or more". In the code, "gates met" only means "no gate at No":
  - a gate at **Partly** passes, as the method intends ("at least Partly, with proof");
  - a gate at **N/A** passes;
  - a **blank** gate passes and only makes the result provisional.

  Source: tool, line 581 (`gNo` counts only `'n'`; `gOpen` is used only in the explanation text).
- The levels note says: "Thresholds (40% and 75%) are a team proposal, not evidence-based; they will be tested with interview hotels". The limits section repeats this. Source: tool, `levelsNote` and `limits`.
- **Proof.** The proof text is shown under gate questions ("Proof to show: …") and in the gate table. The tool has no field to record or attach proof, and proof does not affect the score. Source: tool, `qHTML()` and the gate table.

### Inferences
- The verdict is a "weakest link" rule. The overall level equals the minimum area, with a hard override from the gates.
- Because N/A and blank answers drop out of the denominator, "Not sure" effectively means "ignore this question". That tends to raise the score rather than lower it.

### Gaps
- The D6 method says gates need "at least Partly, with proof". The tool cannot check proof, so this part of the rule depends entirely on the hotel being honest.

## 2. Stress test: 18 profiles on 5 use cases

### Takeaway
On clear cases the verdicts look sensible. A chain with strong IT gets "Ready to scale" for pricing. An average hotel answering Partly everywhere gets "Ready to pilot". A hotel with no data-processing agreement gets "Build foundations first". The test also found five weaknesses:
- a gate answered N/A or left blank passes;
- leaving uncertain answers blank inflates the result from pilot to scale;
- answering only the gates gives "Ready to scale (provisional)";
- honest No answers to questions the tool itself labels "other" can drop a strong hotel a level;
- the 4-item Skills area swings 25 points per No.

### Cited findings (all from re-running the tool's own code in `profiles.js`; area order pe / sk / fi / te / da / or)

| # | Profile | Use case (type, intensity) | Area % | Gates at No | Verdict |
|---|---|---|---|---|---|
| P1 | Small independent, no data team, guest chatbot | gx-2 (A2, Moderate, auto) | 50/25/40/50/33/31 | F2 | Foundations |
| P1b | Same hotel, F2 now Partly | gx-2 | 50/25/50/50/33/31 | – | Foundations (Skills 25%) |
| P2 | Chain with strong IT, dynamic pricing autopilot | rm-2 (A3, Moderate, auto) | 83/88/83/92/92/88 | – | Scale |
| P3 | Strong everywhere, D5 No | gx-2 | 100/100/100/100/83/100 | D5 | Foundations |
| P3b | Same, D5 = N/A | gx-2 | all 100 | – | **Scale** |
| P3c | Same, D5 blank | gx-2 | all 100 | – (D5 open) | **Scale (provisional)** |
| P4 | Unsure hotel: 14 questions left blank | gx-3 (A1, Light) | 83/100/75/88/88/92 | – | **Scale (provisional, 4 core open)** |
| P4b | Same 14 answered No | gx-3 | 42/50/50/58/58/61 | – | Pilot |
| P5 | Strong in 5 areas; Skills 2 of 4 No | kc-1 (A7, Moderate, hw) | 100/50/100/100/100/100 | – | Pilot |
| P5b | Skills 3 of 4 No | kc-1 | 100/25/100/100/100/100 | – | Foundations |
| P6 | Everything Partly | rm-2 | 50 in every area | – | Pilot |
| P7 | Only the 6 gates answered, all Yes | fo-3 (A9, Heavy, sens) | 100/–/100/100/100/100 | – | **Scale (provisional, 19 core open)** |
| P8 | Gates all N/A, everything else Yes | fo-3 | all 100 | – | **Scale (not provisional)** |
| P9 | Gates Partly, everything else Yes | fo-3 | 92/100/83/92/92/94 | – | Scale |
| P10 | About 78% everywhere except Organisation | rm-2 | 83/88/75/83/83/33 | – | Foundations |
| P11 | Weak but even | rm-2 | 50/50/50/50/58/44 | – | Pilot |
| P12 | Biometric check-in, independent, middling answers | fo-3 | 60/50/42/50/58/38 | F2 | Foundations |
| P13 | Strong hotel answers No to P6, F4, F5, T4, O5 | gx-3 | 83/100/67/83/100/89 | – | Pilot |

- **How sensitive each area is to one No.** Starting from all Yes on gx-2, one No costs 100 ÷ (number of items) points: Skills 25, Organisation 11.1, the other areas 16.7. It takes 2 No answers to fall below 75% (3 in Organisation) and 3 No answers to fall below 40% in Skills (4 in the 6-item areas, 6 in Organisation). Source: tool, `mc.js`.
- **How often gates decide the verdict.** In a simulation of 20,000 random hotels on the five use cases (`mc.js`, seed 42), the verdicts were 14,455 Foundations, 3,990 Pilot and 1,555 Scale. Of the Foundations verdicts, 13,049 (90%) came from a gate at No and 1,406 from an area below 40%. Source: tool, `mc.js`.

### Inferences (flags)
1. **Gate loophole (P3b, P8).** A gate at N/A counts as met. No gate can really be "not applicable" to a use case, because every gate is core for every use case. P8 shows a biometric check-in tool reaching a full, non-provisional "Ready to scale" with all six gates at N/A. Fix: forbid N/A on gates, or treat a gate at N/A like a gate at No.
2. **Blank gate (P3c, P7).** A blank gate still allows "Ready to scale"; the result is only marked provisional. P7: answering just the 6 gates gives "Ready to scale (provisional)" for a Heavy, sensitive-data use case, with 19 core items unanswered and the Skills area unscored. Fix: show no level until all six gates are answered, and require a minimum share of core items answered (for example 80%) before showing Scale.
3. **"Not sure" inflates the result (P4 vs P4b).** The same hotel is "Scale (provisional)" when it leaves its 14 uncertain answers blank, and "Pilot" when it counts them as No. There is no "Not sure" option. Fix: add "Not sure", scored 0 (treated as No for the gaps list) and listed as an action ("find out").
4. **"Other" questions weigh as much as core ones (P13).** A strong hotel assessing a Light tool (gx-3, review replies) drops to Pilot because of honest No answers to P6 (applies to "Groups"), F5 ("Groups mainly"), O5 ("Small hotels mainly"), F4 and T4. For gx-3, all five are "check if relevant" questions, not core. Fix: score core items only, or weight core 2 and check/other 1. Also make N/A the default when a question's `ap` scope ("Groups", "Managed or franchised") does not match the hotel.
5. **Skills area is too small (P5).** With only 4 items, one No costs 25 points; two No answers move a hotel from Scale to Pilot. Organisation has 9 items, so a single answer matters less than half as much there. This is a structural imbalance, not a wrong verdict.
6. **Cliff effect (P10 vs P11).** P10 averages 74% and is strong in five areas, yet gets "Build foundations first" because Organisation is at 33%. P11 averages 50% and gets "Ready to pilot". The weakest-link rule is defensible: Organisation covers the plan, process redesign and risk review. But the verdict alone hides how far apart these two hotels are. This is the main argument for also showing an overall number.
7. **Gates at Partly (P9).** Six gates at Partly with everything else Yes gives "Ready to scale". The D6 rule allows Partly on gates for a pilot. For scale, all gates at Yes seems more consistent with the level's action text ("Roll out only if the pilot met its KPI"), which assumes a measured baseline.
8. **Intensity is ignored.** A Heavy biometric tool (fo-3) and a Light review-reply tool are held to the same 40% and 75% thresholds. The intensity only changes which questions are labelled core.

### Gaps
- The profiles are constructed, not real hotel answers. The 40% and 75% thresholds should be checked against interview hotels, as the tool itself says.

## 3. Proposed overall 0–100 score

### Takeaway
Recommended: the **"banded mean"**. It is the plain average of the six area percentages, capped so that it can never contradict the verdict. It agreed with the verdict on 18 of 18 profiles and on 100% of 20,000 simulated hotels, while still telling apart hotels that share a verdict. The mean on its own agreed only 45% of the time.

### Cited findings (agreement = the score's band <40 / 40–74 / ≥75 matches the tool's verdict; source: tool, `profiles.js` and `mc.js`)

| Candidate formula | 18 profiles | 20,000 simulated hotels |
|---|---|---|
| Mean of areas | 11/18 | 45.2% |
| Minimum area | 17/18 (fails only on gates) | 87.5% |
| Mean, capped at 39 if any gate is No | 13/18 | 80.2% |
| Weighted mean (areas weighted by number of core items for the use case), gate cap 39 | 13/18 | 80.4% |
| ½ mean + ½ minimum, gate cap 39 | 15/18 | 90.5% |
| **Banded mean** (mean, capped at 39 for Foundations and at 74 for Pilot) | **18/18** | **100%** |

- Example banded-mean scores from the profiles: P2 = 88, P6 = 50, P11 = 50, P5 = 74 (mean 92, capped because Skills is at 50%), P10 = 39 (mean 74, capped), P3 = 39 (mean 97, gate D5 at No), P1 = 38.
- The plain mean disagrees with the verdict in exactly the cases where the verdict matters most. P3 scores 97 with a gate at No. P10 scores 74 with Organisation at 33%. Source: tool, `profiles.js`.

### Recommended rule (plain wording)
> **Readiness score (0–100)** = the average of the six area percentages, rounded.
> If any gate is No (or N/A, or unanswered), or any area is below 40%, the score is capped at 39 ("Build foundations first").
> If not, and any area is below 75%, the score is capped at 74 ("Ready to pilot").
> The score is shown next to the weakest area and the gates that hold it down, e.g. "39, capped: gate D5 is No (average of areas would be 97)".

Why this formula: it cannot contradict the verdict, by construction. It ranks hotels within a level (P11 at 50 vs P6 at 50 vs P2 at 88). Showing the uncapped average next to it tells a hotel how much it is losing to the weakest area or the open gate. Intensity weighting did not improve agreement (80.4% vs 80.2% for the unweighted mean with the same cap), so it is not worth the added complexity. Intensity is better used to raise the bar: for example, require all gates at Yes for Heavy tools before "Ready to scale".

### Inferences
- If the score is added, the fixes in flags 1–3 above should be made first: gate N/A or blank counts as No, and "Not sure" scores 0. Otherwise the score inherits the same ways to game the result.

### Gaps
- No external benchmark exists to check that a score of 60 means "more ready" in practice than 50. The bands are team judgement (`levelsNote`).

## 4. Evidence and optimistic self-scoring

### Takeaway
The tool names the proof for the six gates but never asks for it, stores it or scores it. Every answer is a self-rating. Research on organisational self-assessment finds consistent overestimation, so the tool should tie Yes on gates to written proof and reward honest uncertainty instead of penalising it.

### Cited findings
- Only the 6 gates carry a "proof" text (for example D5 "Signed data-processing agreement; lawful basis recorded"; T1 "Live test on your own systems, not a demo"). The other 25 questions have none. There is no input field for proof, and `evaluate()` ignores proof. Source: tool.
- The method step says the GM, the AI owner, finance, IT or the vendor, and a frontline lead should answer "as a team". Nothing in the tool records who answered. Source: tool, `steps`.
- A survey of 2,517 managers from 120 organisations in nine countries found significant and consistent overestimation of performance in self-assessment, with about 75% of management teams rating their organisation above average. The paper links this to socially desirable reporting. — [Emerald, Benchmarking / self-assessment study](https://www.emerald.com/insight/content/doi/10.1108/14635771111166848/full/html). These details come from the search summary; the full text was not read.
- An evaluation of a quantitative IT maturity self-assessment concluded that a quantitative self-assessment alone does not describe the current state well enough, and recommended adding other methods. — [Lund University publication](https://www.lunduniversity.lu.se/lup/publication/7d7e230d-b6a3-42c7-8f2a-85a6a78622dd). Again from the abstract only.

### Inferences (recommendations)
- **Proof field on gates.** A gate can only be Yes if a short proof note is entered (owner name and hours, budget line, baseline figure and date, DPA reference, live-test date, plan date). Without a note, Yes is scored as Partly. A summary export could list the proof notes so a coach or owner can check them.
- **Behaviour-based wording.** Turn "Yes" into observable facts where possible. For example, F2 Yes = "we have a number and a date", Partly = "we know where to get it".
- **"Not sure" = 0 and a to-do.** Uncertainty then lowers the score instead of dropping out (see P4).
- **Separate answers.** Optionally, let two roles answer the gates separately (for example the GM and the AI owner) and flag disagreements.
- **Mark self-reported results.** Label results as "self-reported" in exports and the CSV. Keep "Ready to scale" only for results where the gates have proof and at least 80% of core items are answered.

### Gaps
- I found no hospitality-specific study measuring self-assessment bias in AI or digital-readiness checklists. The two sources above are general management and IT studies, and I read only their abstracts or summaries.
