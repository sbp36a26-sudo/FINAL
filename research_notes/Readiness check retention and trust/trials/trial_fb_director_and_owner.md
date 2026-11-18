# Trial: F&B director fills in, asset manager reads

*User trial of the AI readiness check, 18 Nov 2026. Tool at `tools/readiness-check/` (rules v2, 18 Nov 2026), served locally and driven in a real browser (Chromium via Playwright), phone viewport 390x844 for Sophie. All figures below are what the tool showed in this trial; nothing is taken from outside sources. Source code was read only after the runs, to explain what was seen.*

**One-line verdict:** a clear, honest gap list for the person who fills it in, but it scores what that person knows rather than what the hotel has, and the report it hands to a second reader leaves out everything a funding decision needs.

| Persona | "Valuable insight" score |
|---|---|
| Sophie, F&B director (fills in) | 6 / 10 |
| Henrik, asset manager (reads only) | 3 / 10 |

---

## 1. Setup

- **Sophie**: F&B director, 180-room luxury resort, Switzerland, independent. Wants kitchen demand forecasting to cut food waste. Chose "Production, covers and breakfast-buffet forecasting (incl. purchasing quantities)" (Kitchen & Culinary Operations, Forecast and pricing tool, Moderate effort). The tool's description fits her need well: "Predict covers and item-level demand from occupancy and site history to set prep quantities and cut overproduction".
- **Henrik**: asset manager for the owning fund. Receives the one-page PDF and the copied summary. Decides on about CHF 40,000.

## 2. What happened, as Sophie

### Finding the tool
- Start page is clear: "Pick one AI tool your hotel is considering. Answer six short steps and get a readiness score, a verdict and a report you can share." Then "21 questions in 6 steps, about 10 minutes."
- Searching "food waste" returns "Nothing matches. Try another word." although a use called "Food-waste measurement with computer vision" exists (only "food-waste" or "waste" finds it). She found her use through the Department filter instead.
- On the phone the 91 uses sit in one long list under the form; the filter is needed.

### The 21 questions
She could honestly answer **13 of 21** herself. She answered "Not sure" to **8**, of which **3 are must-haves**:

| Question (tool's words) | Who really knows | Her answer |
|---|---|---|
| "Is there a 12-month budget covering subscription, integration, training and running costs?" (must-have) | Finance | Not sure |
| "Do you have what this tool needs here: subscription?" | Finance (and the wording is unclear) | Not sure |
| "Can the tool exchange data both ways with the systems that hold what it needs?" (must-have) | IT | Not sure |
| "Do you have what this tool needs here: link POS and PMS occupancy forecast?" | IT | Not sure |
| "Is the core system cloud-based with documented open APIs, or an all-in-one that includes the AI?" | IT | Not sure |
| "Do you have a lawful basis and a vendor agreement for any guest or staff data the AI processes?" (must-have) | Legal / GM | Not sure |
| "Is the level of human oversight set for this use case?" | Nobody at the hotel knows this phrase | Not sure |
| "Do you have what this tool needs here: —?" | Nobody: the question is blank (bug B1) | Not sure |

The whole Technology step (3 of 3) was "Not sure" for her. The tool never asks about the EU AI Act by name, which suits her; the only legal wording is "lawful basis" and "data-processing agreement".

### What "Not sure" does to the score
The footer on every step says: *"Not sure" is fine: it counts as No and becomes a to-do.* It is not fine for the score. Runs with the same hotel and the same known answers:

| Variant | Score | Area average | Technology | Verdict |
|---|---|---|---|---|
| Sophie honest (8 x Not sure) | 23/100 | 23 | 0% | Build foundations first |
| Same, Not sure changed to No | 23/100 | 23 | 0% | identical in every figure |
| Same, the 8 changed to Yes with proof (colleagues' true answers) | 39/100 (capped) | 60 | 100% | Build foundations first |
| Everything Not sure | 0/100 | 0 | 0% | Build foundations first |

So "Not sure" and "No" are the same thing to the tool. Up to 37 points of the area average, and the full swing from 0% to 100% on Technology, measure what Sophie knows, not what the hotel has. The headline verdict did not change in this case, but only because her own known gaps (no baseline, no approved plan) hold it at "Build foundations first". The area bars are what a second reader looks at, and they are wrong about the hotel.

The result does keep the label "Not sure" next to each question, which is honest. It does not say "8 of 21 answers were Not sure" or separate "we do not have this" from "I do not know".

### Handing over, saving, coming back
- **Hand part to a colleague:** not possible. No "ask finance", no "someone else knows", no link, no way to send one step.
- **Save and continue:** works silently, same browser only. Reloading and closing and reopening the browser both returned her to the same step with answers kept, including a half-finished step ("2 of 4 answered"). Nothing on screen tells her this, so she would not rely on it.
- **Another phone or laptop:** nothing there. The result says "Saved in this browser only." No link, no code, no email.
- **Browser Back button** leaves the tool (it went to a blank page); the draft survives on return.

### Reading the result on the phone
Usable, about four screens of scrolling. Order is sensible: score, verdict, six bars, "Must-haves not met", "Next gaps to close, in order", then buttons. Text is readable. One layout fault: the answer tag ("Partly", "Not sure") in the must-have list stretches into a tall empty box the height of the whole row (bug B6). "Download report (PDF)" produced a real one-page PDF on the phone viewport; "Copy summary" put four lines on the clipboard.

## 3. What happened, as Henrik (PDF and copied summary only)

What the PDF contains: hotel name, country, date, tool name, "23 /100", "Build foundations first", "Do not buy yet. Fix the gates: name an owner, set a budget and baseline, check connections and data terms, agree a one-page plan.", six bars, six unmet must-haves each with "What good looks like", eight next gaps, and the footer "AI readiness check (prototype), EHL SBP Group 36 for HFTP. Self-assessment, not legal or investment advice. Rules v2, 18 Nov 2026."

| Henrik's question | Can he tell in five minutes? |
|---|---|
| What is being asked for? | Partly. The tool name only. The one-sentence description Sophie saw is not in the PDF. No amount, no vendor, no purpose. |
| Is the hotel ready? | A clear "no": "Do not buy yet." This is the one thing he gets fast. |
| What are the risks? | Only as unanswered questions. No statement of what goes wrong if they proceed. |
| What will it cost? | Nothing. CHF 40,000 appears nowhere, even after Sophie typed it as proof on her return visit. |
| What happens next? | A list of gaps, with no owner, no date, no order of who does what. |
| Who is responsible? | Not shown. Who filled it in is not shown either (name and role are optional, and were lost: bug B2). After Sophie named herself as owner, that line is not printed. |
| What is in it for the fund? | Nothing on expected saving, food-cost baseline or payback. |

Reading "Technology infrastructure 0%" and "Organisation & governance 0%" on a luxury resort, he concludes either that the hotel is in a poor state or that the tool is crude. Neither is true: it is Sophie's "Not sure". The PDF does print "[Not sure]" beside each question, so a careful reader can work it out. The copied summary drops those labels and lists "Must-haves not met: ..." as flat failures.

Trust: he would not rely on the number. He has not heard of the tool, the PDF calls itself a "prototype", gives no method, no thresholds (the "Below 40% / 40–74% / 75% or more" line is on screen but not in the PDF), no sources and no named author at the hotel. What he would trust is the plain-language list, because each item is checkable: "Budget line with all four cost types", "Baseline figure with date and method", "Live test on your own systems, not a demo", "Signed data-processing agreement".

His likely decision: send it back. That is the right outcome for this hotel, but he reaches it from the missing business case, not from the score.

## 4. Return visit, as Sophie

- Reopening the page showed her last result straight away. "Change answers" opens step 1 with every earlier answer still selected. She does not have to start again. She does have to press Next through all six steps to reach the ones she wants.
- Answering Yes to a must-have opens a good prompt: "Confirm your Yes in one line. Where is the budget written down, and roughly how much is it for the year?" with the warning "Needed for a must-have: until you add this line, your Yes counts as Partly." This is the best trust feature in the tool. Its example, "about EUR 6,000 for subscription, set-up and training", is an unsourced figure and is in euros for a Swiss hotel.
- After finance and IT answers: 23 to 39. The tool explains "Score capped at 39 because 4 must-haves not met. The average of your six areas is 47."
- **Progress is not visible.** No "was 23, now 39", no history, no list of what was closed. The same record is overwritten. The PDF date stays the first submission date. Must-haves she has now met simply disappear from the report, with their proof lines.
- The advice line does not update: with an owner and a budget now proven, it still reads "name an owner, set a budget and baseline...".
- "Start a new check" acts at once with no confirmation and offers no way back to the earlier check. The old check stays in storage and is reachable only from the team page.

## 5. Team page seen as an outsider

- `team.html` opens with no login. Its first line is "Team only." but nothing enforces it.
- From a fresh browser it showed "0 saved in this browser only (not inside the hub on claude.ai)". From Sophie's browser it showed her check in full. So in this local setup a stranger sees nothing, because data lives in each browser's own storage.
- The page says of the hosted version: "To the hub's shared database when the client sees the result; listed here." If that is how it runs on the hub, anyone who can open the team tab sees every hotel's check: hotel name, how it is run, country, the AI tool it is considering, all 21 answers, the score, timestamps, and the free-text proof lines. In this trial those lines held a staff member's name, role and hours ("Sophie Keller, F&B Director, 3 hours a week, agreed with GM by email 20 Nov") and a budget figure ("line in 2027 F&B budget, CHF 40,000").
- The page has a working "Delete this check" button with no login.
- Sophie is never asked before her answers are shared. The source shows the only notice comes after saving: "Saved and shared with the EHL project team." Proof lines invite personal and financial detail, so consent and access control matter before this goes to real hotels. Not tested here: the hosted hub itself.

## 6. Insights gained, rated

### Sophie
| Insight | Rating | Tool's words |
|---|---|---|
| She should not buy yet | Obvious (she has no budget or plan; she knew) | "Do not buy yet." |
| Six named gates decide the verdict, regardless of everything else | Valuable | "Any one of these keeps the result at 'Build foundations first', whatever the other answers." |
| What "done" looks like for each gate, in checkable terms | Valuable | "What good looks like: Baseline figure with date and method"; "Live test on your own systems, not a demo" |
| She needs a waste or food-cost baseline before any tool | Valuable | "Have you measured a baseline for the KPI this AI should move" |
| A one-page plan approved by the owner is a gate | Useful (and it tells her what to send Henrik) | "(one page is enough)" |
| Decide in advance when to scale or stop a pilot | Useful | "Have you set in advance when a pilot will be scaled or stopped?" |
| Data terms: ownership, exit, training | Useful, though she cannot act on it alone | "who owns the data, how you get it back if you leave, and whether the vendor may train on it" |
| Her Technology score | Misleading | "Technology infrastructure (weakest) 0%" |

### Henrik
| Insight | Rating | Tool's words |
|---|---|---|
| Not ready | Useful, fast | "Build foundations first" |
| A ready-made list of conditions he can attach to funding | Useful | the six "What good looks like" lines |
| The hotel has no approved plan and he is the approver | Obvious | "Has top management or the owner approved a written plan" |
| The score and bars | Not usable | "23 /100", "0%" |

## 7. The key question

**Does it work when the person filling it in is not the person who knows the answers?** No. The tool assumes one person knows people, finance, IT, data law and governance. It accepts "Not sure" politely, then scores it as No. There is no hand-over, no shared link, no per-question "ask a colleague". Sophie's workaround is to carry the gap list to colleagues by hand and re-enter their answers, which does work in the same browser.

**Does it work when the reader is not the person who filled it in?** No. The report is a to-do list for the filler. It has no author, no ask, no cost, no benefit, no owners, no dates, no method, and it prints unknowns as near-zero bars. The proof lines, which are the only evidence in the whole check, are collected and then left out of the report.

## 8. What would bring each back, and when

- **Sophie:** after she has collected answers from finance and IT (days later), if the tool showed "was 23, now 39, 2 gates closed, 4 left". Again after the pilot, if "Ready to pilot" unlocked pilot-stage guidance. She would come back sooner if she could send the Technology step to IT from her phone and be told when it was answered.
- **Henrik:** he never opens the tool. He would ask for the report again at the funding decision and at the end of a pilot, if it were a one-page decision note: ask, cost, expected saving, conditions met and open with evidence, owner, date, and change since last time.

## 9. What made each doubt it

- **Sophie:** the blank question "Do you have what this tool needs here: —?"; the puzzling "Do you have what this tool needs here: subscription?"; being marked 0% on Technology for saying she did not know; "Saved in this browser only."; losing her typed name; search failing on "food waste".
- **Henrik:** "(prototype)"; a number with no method or source; 0% bars on a luxury resort; no name on the report; no money figure anywhere; the on-screen disclaimer "team judgement still to be tested with hotels" (honest, and it lowers trust).

## 10. Top 5 fixes, ranked

1. **Separate "do not know" from "do not have".** Score Not sure as unknown: show "13 of 21 answered; 8 to confirm with finance, IT, legal", give the score as a range or mark areas "not yet known", and never print 0% for an area made of unknowns. Change the footer line; "Not sure is fine" is not true today.
2. **Let a check be shared and finished by several people.** A link or code to reopen the check on another device, and a "who knows this?" tag per question (Finance, IT, GM, Legal) that produces a short list to forward. Group the to-do list by who must answer.
3. **Make the report a decision page for a second reader.** Add: who filled it in and their role, what is being asked for in one sentence, cost and expected benefit (two optional fields), must-haves met with their proof lines, open items with owner and date, the thresholds, and a line on how the score is built. Print proof lines; they are the evidence.
4. **Show progress on return.** Keep versions of a check, show "was 23 on 18 Nov, now 39", list gates closed since last time, update the report date, and make the advice line reflect which gates are still open. Add a "jump to step" so she need not press Next six times.
5. **Protect the team view and ask consent.** Put access control on the team page and its delete button, tell the user before saving that answers go to the project team, and warn against names in proof lines (or keep proof lines out of the shared copy).

## 11. Bugs, with reproduction steps

| # | Bug | Steps | Seen |
|---|---|---|---|
| B1 | Blank question | Start, pick Kitchen & Culinary Operations > "Production, covers and breakfast-buffet forecasting", go to step 6 | Question reads "Do you have what this tool needs here: —?". It has no "Does not apply" option, scores 0 of 2 if not Yes (an otherwise perfect check scores 96 instead of 100), and is printed in the PDF as "-?". Cause: the resource text for this area is "—" in the data and is still turned into a question (`logic.js` line 68). Other uses with an empty resource field will show the same. |
| B2 | Typed text lost when moving between start fields | Phone view. Tap "Hotel or group name", type a name, tap "Your name and role", type straight away | Focus drops to the page and the first attempt is not entered; the field stays empty. A second tap works. If she does not notice, her name is never saved, and it appears nowhere in the result anyway. Cause: the start page is redrawn when the first field changes. |
| B3 | Search misses hyphenated names | Search "food waste" | "Nothing matches. Try another word." although "Food-waste measurement with computer vision" exists. "food-waste" or "waste" finds it. |
| B4 | Proof lines and met must-haves missing from the report | Answer Yes to a must-have, type a proof line, see result, download PDF | Neither the result page nor the PDF shows the met must-have or its proof. Only the team page shows it. |
| B5 | Advice text does not follow the answers | Meet the owner and budget must-haves with proof, see result | Still says "Fix the gates: name an owner, set a budget and baseline..." |
| B6 | Answer tag stretched on phone | Open any result at 390 px wide, look at "Must-haves not met" | "Partly" / "Not sure" tag is drawn as a tall empty box the full height of the row. |
| B7 | "Start a new check" has no confirmation and no way back | On a result, tap "Start a new check" | Returns to the start page at once; the earlier check is no longer reachable from the client page. |
| B8 | Report date does not change after an update | Change answers a later time, download PDF | Date shown is the first submission date; no "updated" date. |
| B9 | Team page open to anyone, with delete | Open `team.html` directly | Full detail and "Delete this check" with no login. |
| B10 | Copy summary drops the answer labels | Tap "Copy summary", paste | Lists "Must-haves not met: ..." without "Partly" / "Not sure", so unknowns read as failures. |

Minor: "Example: ... about EUR 6,000" is an unsourced figure and in euros regardless of country; the PDF omits the score thresholds and the use description; in-tool "Back" on step 1 and the browser Back button behave differently (browser Back leaves the tool).

## 12. Evidence

Scripts, screenshots and PDFs from the trial are in the session scratchpad (`trial-owner/`), which is temporary: `01-landing.png` to `24-result-v3.png`, `report.pdf` (first result, 23/100), `report-v3.pdf` (return visit, 39/100), `30-team-stranger.png`, `31-team-sophie-browser.png`. No file in the repository was changed apart from this note.
