# Readiness check: return visits, value and trust

*18 Nov 2026. Decision paper before the next build. Nothing has been built from it yet.*

**In one line:** the check should not chase "retention". It should be right the first time, hand the hotel a page worth forwarding, and make the second pass before signing quick and visibly different from the first.

## How this was produced

| Step | Who | Output |
|---|---|---|
| Research | 4 researchers: retention mechanisms, customer journey, trust, value and feasibility | `research_notes/Readiness check retention and trust/*.md` |
| Trials in the live tool | 3 simulated users: independent GM, chain CIO, F&B director plus owner's asset manager | `…/trials/*.md` |
| Challenge | 3 critics: sceptic, hotel operator's advocate, method/legal/privacy auditor | `…/challenge/critic_*.md` |
| Rebuttal | Each critic answered the other two and ruled on five disputes | `…/challenge/rebuttal_*.md` |

**Limits to keep in mind**

- **Outside sources were not opened.** This session could not load outside web pages, so every outside figure comes from search summaries. They steer design here; none may go into a deliverable before the original is read.
- **The trial users are AI personas, not hoteliers.** They are reliable for bugs, unclear questions and scoring faults. They are weak evidence for what a real hotel would want or do.
- **Platform facts were read from the platform's definitions and the tool's code,** not tested inside claude.ai.

## 1. What the trials found

| Trial | Result the tool gave | Mark for valuable insight (trial agent's own rating) |
|---|---|---|
| Independent GM, guest chatbot | 19/100, "Build foundations first" | 5/10 |
| F&B director, on a phone | 23/100; she could answer 13 of 21 questions | 6/10 |
| Asset manager reading her PDF | "Do not buy yet" and a conditions list | 3/10 |
| Chain CIO, dynamic pricing, well prepared | 98/100, "Ready to scale" | 3/10 |

All three trials agree on these faults:

1. **"Not sure" is scored as "No".** The check measures what the person filling it in knows, not what the hotel has. Technology scored 0% for the F&B director because those answers sit with IT.
2. **Nothing shows progress on a return visit.** Saved checks are overwritten. Fixing two gaps moved 19 to 25 with the same label, the same date and no before and after.
3. **The result repeats answers instead of advising.** About three points were new to the GM. The PDF has no author, no ask, no cost and no responsible person, and leaves out the proof notes the hotel typed.
4. **Several must-haves cannot be true before a vendor is chosen,** so a hotel that is still choosing is marked down for it.
5. **First-minute bugs:** searching "chatbot" (the search box's own example) finds nothing; typing is lost when moving between start fields; 15 of the 90 tools show a blank question ("Do you have what this tool needs here: —?").

## 2. The scoring can be shown wrong

The auditor re-ran these against the tool's own scoring code. All are confirmed.

| Input | Result |
|---|---|
| Every answer Yes, proof text "x", on an AI recruiting tool | 100, "Ready to scale" |
| Must-haves Yes, everything else "Does not apply", the AI Act question No | 96, "Ready to scale" |
| One must-have unmet (area average 98) | 39 |
| Eight must-haves unmet (area average 83) | 39 |
| "Not sure" on a question | Same points as "No" |

Two more findings:

- **The 0–100 number decides nothing.** The verdict comes from the must-haves and the weakest area; the number is worked out afterwards.
- **The verdict sentence is fixed per level,** so it can tell a hotel to "name an owner, set a budget" when both are done.

The existing 13 tests pass and cover none of these cases. This is the largest risk to credibility: a reproducible wrong verdict under HFTP's name.

## 3. What the tool says about the law

The tool contradicts the team's own law work (`reports/EU AI Act hospitality deep dive.md`) in three places:

- It treats high-risk duties as current. They start on 2 Dec 2027.
- It presents the data protection impact assessment as an AI Act duty. It is a GDPR duty.
- It tells the hotel to disclose a chatbot as AI. Under Art. 50(1) that notice is the provider's duty; the hotel's job is to check it is switched on.

Also: the country field has no effect, so Swiss and UK hotels get EU text; and "informed or consulted" understates what a works council can require in some countries. National labour-law statements in the CIO trial are unverified and should not be used.

## 4. Privacy and access

- **Saved checks have no access rule.** Anyone the hub is shared with could read every hotel's answers and proof notes; contributors could overwrite or delete them. The team page has no gate and a working delete button.
- **No notice or consent** is shown before the first question, although the tool stores a contact name, proof notes and budget lines.
- **Who is responsible for the data is undecided** (EHL, the team or HFTP). The notice cannot be finished until it is.

No real hotel should use the hub before the lock, the notice and opt-in sharing are in place.

## 5. What brings a hotel back

**What the research says.** Assessment tools that people repeat are repeated because something outside the tool requires it: an expiring certificate, a programme rule, a fixed reporting rhythm. A free voluntary check has none of these. No return-rate figure for a tool like this was found anywhere.

**Where the critics ended up.** All three agree the realistic pattern is one check per tool decision plus a second pass before signing. Success is measured by decisions, not visits:

- the hotel finishes without help;
- the verdict matches what an interviewer would say about that hotel;
- the page gets forwarded;
- must-haves are closed between the first and second pass.

**The journey that is real**

| Step | What triggers it | What the tool must do |
|---|---|---|
| 1. First check, after a demo | A vendor has shown a tool | Give a verdict, and split what is open by who can answer it |
| 2. Collect answers | Colleagues and the vendor reply | Hand over questions as copy-ready text, by person |
| 3. Second pass, before signing | The contract is on the desk | Open on the open items only; show "since 18 Nov: 2 of 7 must-haves closed" |
| 4. Owner approval | The owner asks for the page | A first page that states the ask and the open conditions |

Pilot review, a yearly review, a portfolio view and AI Act dates as reminders were judged not real yet for this tool.

**What the platform cannot do:** send email, issue calendar files, or let people outside the team's organisation save to the hub. A hotel's history therefore lives in its own browser and in a file it downloads and can load again. Reminders, accounts and a member login would need a hosted app, which is beyond D1–D10 and would be a recommendation to HFTP.

## 6. What makes it trusted

Before any hotel sees it:

1. Privacy notice before question 1; collect less (role instead of name, no exact budgets in shared copies).
2. Remove every verdict that can be shown wrong (section 2).
3. A short "how this works" panel: where the questions come from, how the verdict is reached.
4. Say plainly what each statement rests on: law text, official guidance, or team judgement. Use this on legal items and thresholds only.
5. Say who made it: a student project for HFTP, with version and date on every output.
6. Print the hotel's proof notes, labelled "self-declared".

Words not to use until earned: "validated", "piloted", "benchmark", "Ready to scale".

**Cheapest real test:** after each interview, a team member writes down their own verdict for that hotel and tool before seeing the tool's. Compare the two. This adds no question to any interview guide. It can start with the Accor interview on 19 Nov.

## 7. Where the critics disagreed, and how it settled

| Dispute | Outcome |
|---|---|
| Keep the 0–100 number? | **Drop it.** All three. Show the verdict, "5 of 8 must-haves met", and area bars. |
| Verdict when answers are unknown | **Conditional, one way only.** A known "No" on a must-have settles "do not sign yet". A positive verdict needs every must-have known and met. Otherwise: "Not enough information yet: 5 answers open", with the list by person. The proposed "75% answered" rule was withdrawn. |
| "Ready to scale" | **Remove now.** Top verdict becomes "Ready to pilot". It returns only with questions written from a real pilot. |
| Owner page and vendor sheet in the next build | **Yes, minimal.** Owner fields on PDF page 1 and vendor questions as one copy-ready block. The tool supplies no cost or benefit figures. |
| "My checks" and carrying answers to a second tool | **Not now.** Risk of stale answers; no hotel has checked a second tool yet. |
| Stage question (before choosing / before signing) | **Yes.** The sceptic first called it theatre, then conceded it is a correctness fix. |

Still open between them: whether the owner page carries a benefit line at all, and whether pilot questions should be written before any hotel has piloted.

## 8. Proposed next build

This merges the eight changes approved after the earlier review with the results above.

| # | Item | Why |
|---|---|---|
| 1 | Lock access to saved checks; gate the team page; sharing with the team is opt-in; notice before question 1; collect less | No hotel can use it before this |
| 2 | First minute: fix search, the lost-typing bug, the 15 blank questions | Users give up here |
| 3 | Replace "Not sure" with "to find out" plus who to ask; unknowns never score 0% | Stops the check measuring the person |
| 4 | One opening question on stage; vendor-dependent items become "to confirm before signing" | Stops marking down hotels that are still choosing |
| 5 | Drop the number and "Ready to scale"; verdict text built from the actual open items; conditional verdict rule | Removes the verdicts that can be shown wrong |
| 6 | Close the "Does not apply" and proof holes; high-risk legal item becomes a must-have; proof printed as "self-declared" | Stops gaming |
| 7 | Legal rewording as "items to check", one honest sentence on country, no article numbers on client pages until D7 signs off | Matches the team's own law work |
| 8 | Approved content work: rewritten questions, tick lists, every gap as an action by person with a vendor question | Already approved |
| 9 | Vendor questions as one copy-ready block; "copy questions for IT / finance"; owner fields on PDF page 1 | Makes the result worth forwarding |
| 10 | Dated snapshots with rules version; "since last time"; re-check opens on open items only | The return visit |
| 11 | Hotel file: download and load again | The hotel owns its history |
| 12 | Tests for every scoring case in section 2; blind verdict comparison after each interview | Proof the fixes hold |

**Not now:** "My checks" and carry-over between tools, pilot questions, portfolio view, link to the AI Register.

**Not on this platform:** email reminders, accounts, benchmarks, badges, a calculated return on investment.

## 9. Sign-offs needed

| What | Who |
|---|---|
| Law labels and any article numbers | D7 owner in the team |
| Any national labour-law statement | A qualified lawyer; otherwise leave out |
| Notice text, who is responsible for the data, deletion date | EHL data protection contact |
| HFTP's name beyond "student project for HFTP" | Coach and HFTP |
| Sending the hub link to any hotel | After item 1 is live and tested |
