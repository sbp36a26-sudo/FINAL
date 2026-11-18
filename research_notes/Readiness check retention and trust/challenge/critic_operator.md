# Critic: the hotel operator's advocate

*18 Nov 2026. Sources: GM, FB, CIO = the three files in `trials/`; CJ = `customer_journey.md`; RM = `retention_mechanisms.md`; VF = `value_and_feasibility.md`; TC = `trust_and_credibility.md`. "Approved" = in the earlier review's 8 changes.*

**My position in one line.** The tool has one job that pays: stop a hotel signing too early and hand it the paper that gets the purchase approved properly. Build for the two visits that are real (before choosing, before signing).

## 1. The journey: what is real, what is wishful

| Step | Real? | Trigger (no email available, VF B1) |
|---|---|---|
| 1. First check after a demo or quote | Real. Marta has one demo and nothing signed (GM) | The vendor's push. Entry line: "Had a demo? Check before you sign." |
| 2. Collect answers from finance, IT, vendor (days) | Real. Sophie could answer 13 of 21 (FB) | The result itself: a list per colleague she must chase |
| 3. Re-check before signing (weeks) | Real, and the strongest return (GM section 5) | The contract on the desk, plus the owner asking for the updated page (CJ section 5). Printed on the PDF: "Bring this back before you sign" |
| 4. Owner approval | Real, but the owner never opens the tool (FB section 8) | The PDF is the product here, not the page |
| 5. Pilot review | Half real. Only if the stop date was written down in a pilot card at step 3 | The hotel's own date, shown as text to copy into a calendar (VF B2; no .ics inside claude.ai) |
| 6. Second tool | Real for groups and keen GMs, only if hotel-level answers carry over so it takes 3 minutes (GM) | A new demo |
| 7. Register entry | Wishful as a habit for an independent. Real once, as a link at signing | "Add this tool to your AI Register" on the result (CJ section 4) |
| 8. Annual review, AI Act date re-checks, portfolio for independents | Wishful. A reminder to an unchanged questionnaire is nagging (RM section 3) | None. Do not build for it now |

Browser storage will not survive months (RM section 5), so step 5 onward depends on a file the hotel keeps.

## 2. Three things that make the first result worth forwarding

Henrik sent it back: no ask, no cost, no owner, no dates (FB section 3).

1. **A decision block at the top, in the owner's terms.** "Sophie Keller, F&B director, asks for CHF 40,000 for kitchen demand forecasting to cut food waste. Verdict: not yet. Approve on four conditions: (a) food-cost baseline measured, (b) budget covers subscription, set-up, training, running, (c) live test on our POS and PMS, (d) signed data agreement." Cost and benefit are optional fields the hotel types; the tool supplies no figure. Proof lines printed (FB B4, CIO B9).
2. **Who does what by when.** Every open item as an action, grouped by person (you, finance, IT, vendor, owner), with a name and date field and "top three this week". All gaps, not 8 of 13 (GM B3).
3. **A vendor sheet ready to send.** Four of Marta's seven unmet must-haves can only be closed by the vendor (GM section 2). One page: test on our own systems before signing; can staff take over and correct it; send the data agreement; who owns the data, how do we get it back, may you train on it (the best line in the tool per CIO, absent from the result). The vendor's reply brings her back.

## 3. Nobody knows all the answers

- Replace "Not sure" with two honest answers: **"I don't know: ask a colleague"** (pick Finance, IT, HR/Legal, GM/Owner) and **"Can't know until we choose a vendor"**. Keep "No" for "we don't have it".
- Never print 0% for an area made of unknowns (FB: Technology 0% on a luxury resort). Show "13 of 21 answered, 8 to confirm" and the verdict as "not yet known" for that area.
- **Staged, by one opening question**: "Looking / vendor chosen / about to sign / in pilot". Before a vendor is chosen, vendor-dependent must-haves read "to confirm before signing", not failed (GM fix 4; CJ "stage-aware proof").
- **Hand-over: text first, file second, no link.** A "copy the questions for IT" button gives a short message to paste into email or WhatsApp. The colleague replies; the first user enters the answers. A JSON file covers another device. A share link is not possible on this platform and leaks answers (VF B2, RM section 5). No multi-user roles now: that needs a hosted app, and Sophie's workaround works (FB section 7).

## 4. The first five seconds of a return visit

> **Welcome back. Chatbot for website and WhatsApp, Hotel Ribeira.**
> Since 18 Nov: **2 of 7 must-haves closed** (owner named, budget agreed). **5 open**: 3 are waiting for the vendor, 1 for IT, 1 for you.
> Verdict then: Not yet. Verdict now: Not yet, 5 conditions left before signing.
> **[Update the 5 open items: about 3 minutes]** · [See all answers] · [Check another tool]
> *Our rules have not changed since then.*

Count must-haves, not points. "19 to 25" after three months of real work is demotivating (GM section 3); "2 of 7 closed" is not.

## 5. The chain that scored 98

Say it openly: "Built for hotels deciding on their first AI tools. Well-prepared groups will find little new here." Jonas rated it 3/10 (CIO). Country-by-country works-council law is the Register's and D7's job.

For him:
- **A standard pre-purchase form for his GMs** (his own words: a decent gate, CIO section 7): "the form your hotels fill in before they ask you for budget", result file sent to head office.
- **"My checks" and CSV/JSON export** for his own spreadsheet. A portfolio view is later (VF Phase 2).
- **At 98, the next stage, not applause**: a pilot card (KPI, baseline, target, stop date). Drop "Ready to scale": nothing asks about a pilot (TC section 5).

## 6. "CRM" ideas to avoid

- Email required before the result; any account wall (RM section 4).
- Reminders the user did not set; "7 days left" urgency on AI Act dates that do not touch their tool.
- Badges, levels, streaks, "readiness certificate" (RM section 4).
- A benchmark from a handful of hotels; a score that moves because our rules changed (CJ section 3).
- Re-asking the 29 questions, or the hotel details, on return.
- Answers and proof lines (names, budgets) shared with the team without being told first (FB section 5); anything passed to vendors.

## 7. Recommended next build (in order)

| # | Item | Benefit to the user |
|---|---|---|
| 1 | First minute: search finds "chatbot" and "food waste", focus bug, time and "who sees this" stated before question 1 (approved) | She does not leave in 20 seconds |
| 2 | Plain one-idea questions; tick lists replace "Do you have what this tool needs here" (approved) | She can answer without re-reading |
| 3 | Stage question + "ask a colleague" / "can't know before a vendor"; no 0% from unknowns | A careful first-timer is not marked as a failure |
| 4 | Result as conditions: verdict from open items, "N of M must-haves open", all gaps as actions grouped by person, top three (approved, sharpened) | She knows what to do Monday |
| 5 | Vendor sheet, with the data-contract points, as copy text and PDF page | One email to the vendor closes four gates |
| 6 | Owner page first in the PDF: who asks, for what, cost, benefit, conditions, proof lines, date | The owner can decide in five minutes |
| 7 | "Copy questions for IT / finance" | Unknowns get answered without a new system |
| 8 | History instead of overwrite; return banner; "update open items only"; jump to a question; updated date | A second visit takes 3 minutes and shows credit |
| 9 | "My checks" list; hotel-level answers carry to a second tool; confirm before "Start a new check" | The second tool is quick |
| 10 | The hotel's file: JSON export and re-import; CSV of actions | Works on another laptop and for head office |

**Later:** pilot card and pilot review; link to the Register; portfolio from imported files; country-specific labour-law wording; benchmark with n shown; hosted app with accounts, reminders and roles (a recommendation to HFTP, outside D1-D10, VF B3).

## 8. Questions to the other critics

**To the sceptic**
1. If retention is not the goal, what is? Marta would have signed after a second demo (GM). The before-signing re-check is where the tool prevents a bad contract. If you cut item 8, what does her second visit show?
2. Henrik rejected the report for its missing business case, not its score (FB). Which of the owner-page fields would you cut and still call it forwardable?

**To the auditor**
3. Jonas listed eleven legal faults (CIO section 2). Which of them changes what a 62-room hotel in Porto does on Monday? Would you hold back the action plan until the German co-determination wording is right, or ship "agreement may be required; ask your labour lawyer" now?
