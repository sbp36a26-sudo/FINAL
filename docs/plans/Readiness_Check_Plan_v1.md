# Readiness check: one-page plan (v1, for team approval)

*EHL SBP Group 36 for HFTP · D4 × D6 · 18 Nov 2026 · draft before building. Points marked **[research]** will be confirmed or changed by the research running now.*

## Goal
Turn the 8-tab readiness tool into **one guided check** a first-time user finishes in about 5 minutes: pick an AI tool, answer short steps, get a score, a verdict and a report. The research and framework move to a **team-only page**.

## Two pages, one data file

| | **Readiness check** (public) | **Readiness engine** (team only) |
|---|---|---|
| Who | Hotel managers, owners, HFTP members | EHL team, coach |
| What | The guided check only | Today's full tool: framework, 20 building blocks, resource needs per use case, companies, hotel groups, sources and method, plus a new **"How the score is worked out"** view |
| Where | New hub tab "Readiness check" (can later be shared on its own) | Stays in the private hub as "Readiness engine (team)" |

Both read the same data, so a change to a question or threshold updates both.

## The user's flow

**1 · Start.** One line: *"Pick an AI tool, answer a few short steps, and get your readiness score and report. About 5 minutes."* Choose a department, then the use case. The use case is shown in plain words, with no codes: *"Demand forecasting · Forecasting and pricing tool · Moderate effort"*. A two-line legend sits under the picker:
> **Type of tool:** what kind of AI it is. Tools of the same type need similar resources.
> **Effort:** Light (a subscription, little set-up) · Moderate (links to your PMS or CRM, clean data) · Heavy (hardware, group platforms or high legal risk).

Optional: hotel name and country (only used in the report).

**2 · Questions, one area per step.** People → Skills → Money → Technology → Data → Organisation. Each step shows only the questions that matter for this type of tool **[research: how many per use case]**. Answers: **Yes · Partly · No · Not sure** (today "N/A"; "Not sure" counts as "No" for gates). Gate questions are marked "Must-have". A progress bar ("Step 3 of 6"), Back and Next, answers kept if you leave.

**3 · Result.**
- **Verdict:** *Build foundations first* · *Ready to pilot* · *Ready to scale*, with one sentence on what to do.
- **Readiness score 0–100 [research: formula]**, capped so that a failed must-have can never show a high score.
- **Six bars**, one per area, with the weakest marked.
- **Must-haves not met**, listed first.
- **Gaps to fix, in order**, each with one action and who usually owns it.

**4 · Report.** "Download report (PDF)": tool, date, score, verdict, area bars, gaps and next steps, and the line *"Self-assessment, not legal or investment advice."* Also "Copy summary".

## Scoring (kept from the D6 rules)
- **Build foundations first:** any must-have answered No (or Not sure), or any area below 40%.
- **Ready to pilot:** all must-haves met, every area 40–74%.
- **Ready to scale:** all must-haves met, every area at 75% or more.
- The six must-haves today: a named owner; a 12-month budget; a measured KPI baseline; two-way data exchange with core systems; a lawful basis and vendor agreement for personal data; a one-page plan approved by management. **[research: right set? anything missing, e.g. staff representatives consulted?]**

## Links to the other tools
- AI Register: a **"Check readiness"** button on each tool opens the check for that use case. Later the verdict can show in the register.
- Catalogue: "What this tool does" link from the use case.

## Out of scope for v1
Comparing several tools at once; peer benchmark (needs interview data first); saving results for a team (needs a shared, saved version).

## Decisions for the team
1. Audience: hotels (recommended) or interview use.
2. Score: verdict + 0–100 + area bars (recommended), or verdict + bars only.
3. One use case per check (recommended).
4. Hotel name in the report: optional (recommended).
5. Rename "N/A" to "Not sure", counted as No for must-haves (recommended).
