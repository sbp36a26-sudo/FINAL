# User trial: independent hotel GM ("Marta")

*Trial run 18 Nov 2026 against `http://127.0.0.1:8765/readiness-check/index.html` (rules v2, 18 Nov 2026), driven in Chromium with Playwright. Laptop viewport 1366x768, phone viewport 390x844. Source code was read only after the runs. Scripts and screenshots: `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/trial-gm/` (temporary folder).*

**Persona.** Marta, general manager and co-owner, 62-room independent 4-star city hotel in Porto, 38 staff, no IT person (outside firm monthly), cloud PMS, no analyst, about EUR 15,000 a year for new tech, knows little about AI. Considering an AI chatbot for website and WhatsApp. One vendor demo, nothing signed. 15 minutes, laptop.

**One-line verdict.** A correct and honest "do not buy yet" with a usable gate list, but it reads her own answers back to her more than it teaches her, and it gives her no reason and no means to see progress when she returns. **Valuable insight: 5/10.**

---

## 1. Run 1: first visit

### Facts
| Item | Observed |
|---|---|
| Start page | 4 hotel fields + tool picker (search box, department filter, list of all tools) |
| Questions | 29 in 6 steps (People 6, Skills 4, Financial 4, Technology 5, Data 3, Organisation & governance 7). The tool says "29 questions in 6 steps, about 10 minutes" only after a tool is picked |
| Clicks | About 43: 4 hotel fields, search, pick, start, 29 answers, 5 Next, 1 See my result |
| Time | Not measured with a human. My estimate for Marta is 10 to 13 minutes, because roughly a third of the questions need re-reading. Fits her 15 minutes, just |
| Answers given | 1 Yes, 8 Partly, 13 No, 7 Not sure |
| Result | 19/100, "Build foundations first", 7 must-haves not met, 8 "next gaps" |

### Start page
- **Search fails on its own example.** The placeholder says "For example chatbot, pricing, rota, camera". Typing `chatbot` returns "Nothing matches. Try another word." So does `guest messaging`. `chat`, `whatsapp` and `messaging` work. This is Marta's first action and it fails. High risk she leaves here or picks the wrong tool.
- **Focus bug.** After typing the hotel name, the first click (or Tab) into the next field is lost: focus drops to the page, typing goes nowhere. She has to click a second time. See bug B1.
- Tool names are written for specialists: "ARI distribution", "GenAI RM copilots & BI Q&A", "MCP servers", "Agentic revenue management". The one she needs is readable: "AI chat and messaging assistant, pre-booking and in-stay (web, WhatsApp, OTA inbox; multilingual)".
- The list shows about 5 of roughly 85 tools in a scroll box. Without search she would scroll a long time.
- The "Type of tool / Effort" explainer is clear. "Moderate effort (links to your PMS or CRM, clean data)" is already a small insight.
- "EHL SBP Group 36 for HFTP · Deliverables 4 and 6 · prototype" means nothing to her.

### Question by question (what Marta could not answer confidently)
| Step | Question (tool's words) | Her answer | Problem |
|---|---|---|---|
| People | "Is one named person responsible for this AI use case, with time set aside for it?" | No | Double question (named + time). "AI use case" is jargon; say "this tool" |
| People | "Can staff override the AI and report its errors?" | Not sure | She cannot know before buying; it is a question for the vendor. Double question |
| People | "Do you have what this tool needs here: guest-service lead monitors conversations; staff take over hand-offs?" | Partly | Broken grammar. She has no "guest-service lead". "Hand-offs" is jargon |
| People | "Have you decided what staff will do with the time saved, and told them?" | No | Clear. Good question, she had not thought of it |
| People | "Do staff feel able to test, question and report problems with AI?" | Not sure | No AI in the hotel yet, so unanswerable. Triple verb |
| People | "Have the staff who will use it seen it, and do they expect it to help their work?" | No | Double question. Clear otherwise |
| Skills | "Do you have what this tool needs here: maintain knowledge base; review transcripts?" | Not sure | "Knowledge base" and "transcripts" unexplained. Reads like a note, not a question |
| Skills | "Can the managers involved explain what the tool does, its limits, and name at least one alternative on the market?" | Partly | Triple question. Good prompt (she knows no alternative) |
| Skills | "Is there a training plan covering both use of the tool and checking its output?" | No | Clear |
| Skills | "Have you tested the vendor's AI claims against your own needs (demo on your own data, references)?" | No | She saw a demo, so is that Partly? Unclear whether a standard demo counts |
| Financial | "Is there a 12-month budget covering subscription, integration, training and running costs?" | No | Clear and useful: four cost types she had not separated |
| Financial | "Have you measured a baseline for the KPI this AI should move (hours, response time, revenue)?" | No | "Baseline" and "KPI" are jargon. The bracket rescues it |
| Financial | "Do you have what this tool needs here: subscription per property or per conversation?" | Not sure | **Not answerable.** It is a pricing model, not something she has or lacks. Likely give-up point |
| Financial | "Have you set in advance when a pilot will be scaled or stopped?" | No | "Pilot", "scaled" are jargon but guessable |
| Technology | "Can the tool exchange data both ways with the systems that hold what it needs?" | Not sure | Abstract. She would ask: which systems? The vendor said "it integrates" |
| Technology | "Do you have what this tool needs here: messaging channels plus PMS link for bookings and requests?" | Partly | Two things in one. Overlaps the question above |
| Technology | "Is the core system cloud-based with documented open APIs, or an all-in-one that includes the AI?" | Partly | Worst jargon of the check. She knows "cloud", not "open APIs". Three conditions |
| Technology | "Are internet, Wi-Fi and devices reliable where the tool will be used?" | Yes | Clear |
| Technology | "Is there a fallback if the tool or the vendor fails?" | Partly | Clear. "The front desk answers" is her honest fallback |
| Data | "Do you have a lawful basis and a vendor agreement for any guest or staff data the AI processes?" | No | "Lawful basis" is GDPR jargon. Double question. Nothing is signed, so No is unavoidable at her stage |
| Data | "Do you have what this tool needs here: complete, current hotel FAQ and policies; conversation logs?" | Partly | "Conversation logs": of what? She has no chatbot yet |
| Data | "Is hotel content (rooms, services, policies) complete, current and structured?" | Partly | Near-duplicate of the question above. "Structured" unexplained |
| Org | "Has top management or the owner approved a written plan (one page is enough) linking this AI to a business goal?" | No | She is the owner; odd to ask whether she approved her own plan. "One page is enough" is a good touch |
| Org | "Do you have what this tool needs here: disclose AI to guests (AI Act Art. 50; FADP in CH – see D7); hand-off rules?" | Not sure | **Second give-up point.** Legal citations, a Swiss law irrelevant in Portugal, and "see D7", an internal project reference no user can follow |
| Org | "Has the process been redesigned before being automated?" | No | Consultant language. Which process? |
| Org | "Is there a written policy on what staff may put into AI tools?" | No | Clear and a real eye-opener |
| Org | "Is each use case reviewed for business, data, security and legal risk before launch?" | No | "Each use case" assumes she has several. Four risks in one |
| Org | "Is the level of human oversight set for this use case?" | Not sure | Abstract. No example |
| Org | "Can guests always reach a person, and have you checked that guests accept this tool?" | Partly | Double question, and the two halves have different answers for her (yes / no) |

**Summary of question quality.** 9 of 29 are clean. 6 are the template "Do you have what this tool needs here: …?", which turns internal resource notes into ungrammatical questions; these are also the only chatbot-specific ones, so the most relevant content is the worst worded. About 10 are double or triple questions. Around 12 need a term explained (KPI, baseline, open APIs, lawful basis, knowledge base, transcripts, hand-off, use case, pilot, human oversight, structured, redesigned process). There is no help text or tooltip on any question.

**What works.** One screen per area, big answer buttons, "Not sure" offered everywhere with the reassurance "'Not sure' is fine: it counts as No and becomes a to-do", a counter ("5 of 5 answered"), Back button, progress bar, answers saved as she goes. The "Must-have" badge tells her which questions matter. The one-line intro per area is good ("Less a large upfront sum than a budget for the full cost of running AI, plus a baseline to prove return.").

**A must-have Yes needs proof.** Choosing Yes on a must-have opens "Confirm your Yes in one line. Who is it, what is their role, and how much time do they have for it?" with an example. Without it "your Yes counts as Partly". This is the smartest feature in the tool: it stops her flattering herself. She only meets it in run 2, because she had no Yes on a must-have in run 1.

## 2. The result page

Full text seen (laptop):

> **19/100 · Build foundations first** · "Do not buy yet. Fix the gates: name an owner, set a budget and baseline, check connections and data terms, agree a one-page plan." · "Saved in this browser only."
>
> Your six areas: People 8% · Skills 13% · Financial investment (weakest) 0% · Technology infrastructure 50% · Data 33% · Organisation & governance 7%. "Below 40%: build foundations first · 40–74%: ready to pilot · 75% or more: ready to scale."
>
> **Must-haves not met** ("Any one of these keeps the result at 'Build foundations first', whatever the other answers."): the 7 must-have questions repeated with her answer, each with "What good looks like", for example "Name, role and hours per week in writing", "Budget line with all four cost types", "Baseline figure with date and method", "Live test on your own systems, not a demo", "Signed data-processing agreement; lawful basis recorded", "Approved plan naming the goal and KPI".
>
> **Next gaps to close, in order**: 8 more questions repeated with her answer and the area name.

Buttons: Download report (PDF), Copy summary, Change answers, Start a new check.

- **PDF**: worked locally. One page, file `AI-readiness-check_Hotel-Ribeira-Porto.pdf`. Same content as the screen. The tool name is cut off at the right edge ("…OTA inbox; multiling"). Bug B5.
- **Copy summary**: worked, toast "Summary copied." Text has score, six percentages and the must-have questions in one long sentence. It leaves out "What good looks like" and the next gaps, so the pasted text is a list of questions, not actions.
- Nothing lets her send it to herself or a co-owner apart from the PDF and paste.

### What is missing on the page
- **13 open items are hidden.** She had 13 No/Not sure answers outside the must-haves; only 8 are shown, with no "and 5 more". Missing from run 1: the whole Skills area (13%), "staff have seen it", "staff feel able to report problems". Her 8 Partly answers never appear at all.
- The gaps are **her questions echoed back**, not actions. "Has the process been redesigned before being automated? No" tells her nothing she did not just type. Only the must-haves get a "what good looks like" line; "Can staff override the AI and report its errors?" does not even get that.
- "in order": the order is not explained. It appears to be weakest area first.
- No effort, cost or time per gap; no "start with these three"; no owner or date field; no benchmark (how do similar hotels score?); no explanation of how 19 is built; nothing chatbot-specific (typical price, what to ask the vendor).
- No questions-for-your-vendor list, although 4 of her 7 unmet must-haves can only be closed by asking the vendor (override, two-way data, data agreement, live test).

## 3. Run 2: the return visit (three months later, clock set to 18 Feb 2027)

What happens, exactly:
1. Opening the URL goes **straight to the old result page**: 19/100, same lists, dated "18 Nov 2026". No welcome back, no "last checked 3 months ago", no prompt to update. Good: nothing is lost (same browser only; a different laptop or cleared browser data starts from zero, and the page does say "Saved in this browser only").
2. "Change answers" opens step 1 with **all 29 answers pre-filled**. She changes "named person" to Yes; the proof line appears. She must click Next through all six steps even to change two answers: **9 clicks, 2 typed lines**, about 2 minutes. There is no way to jump from a gap on the result page to its question.
3. If she skips the proof lines (nothing stops her): score **22/100**, both items stay under "Must-haves not met" with "Yes without proof counts as Partly". Fair, but she only finds out on the result page.
4. With proof lines ("Ines Costa, front office manager, 3 hours a week, agreed in writing"; "EUR 6,000 pilot budget for 12 months…"): score **25/100**, still "Build foundations first", 5 must-haves left. People 8% → 25%, Financial 0% → 25%.
5. **No progress is shown.** The old result is overwritten. No "19 → 25", no "2 of 7 must-haves closed", no ticked-off items, no history. The two fixed gates simply vanish from the list. She would have to remember the old number or have kept the old PDF.
6. **The date still says "18 Nov 2026"** on the updated result. Bug B2.
7. The "next gaps" list reshuffles: the two Financial gaps and the People gap disappear although she has not fixed them, and three Skills gaps appear, because the list is cut at 8 and re-sorted. It looks like gaps were closed that were not. Bug B3.
8. "Start a new check" keeps her hotel details and wipes the result with no confirmation. The old check stays in browser storage but there is **no list of past checks**, so she cannot reach it again. Bug B4.

**Net.** Three months of real work (an owner named, a budget agreed) earns +6 points, the same red label, the same sentence "Do not buy yet", and no acknowledgement. That is demotivating and gives no reason for a third visit.

## 4. Phone (390x844)

- Start page, step 1 and result all fit; no sideways scrolling. Page scrolls to top on each step.
- Answer buttons are 33 px high (below the usual 44 px touch size) but well spaced. "Does not apply" wraps to a second row.
- Result is very long (about 3,200 px, nearly 4 screens). Score and verdict are on the first screen, which is right.
- Cosmetic: the answer chips ("No", "Not sure") stretch to the full height of each row and look like tall empty boxes.
- Same search and focus problems as on laptop.

---

## 5. Verdict

### Did the result tell Marta something she did not know?
| # | Insight | Tool's words | Rating |
|---|---|---|---|
| 1 | Do not sign yet | "Do not buy yet. Fix the gates: name an owner, set a budget and baseline, check connections and data terms, agree a one-page plan." | **Valuable.** A neutral voice against the vendor's push, and five concrete things in one sentence |
| 2 | Measure before you start | "Have you measured a baseline for the KPI this AI should move (hours, response time, revenue)?" / "Baseline figure with date and method" | **Valuable.** She would not have counted today's messages and response time; without it she can never tell whether the chatbot paid off |
| 3 | A demo is not a test | "Live test on your own systems, not a demo" | **Valuable.** Directly corrects what she has done so far |
| 4 | Data contract | "Signed data-processing agreement; lawful basis recorded"; in the question step: "Proof should also cover who owns the data, how you get it back if you leave, and whether the vendor may train on it" | **Useful to valuable**, but the best part (the three contract points) is shown only during the questions and is absent from the result and PDF |
| 5 | Budget has four parts | "Budget line with all four cost types" (subscription, integration, training, running costs) | **Useful.** She was thinking of the subscription only |
| 6 | Someone needs hours, not just a name | "Name, role and hours per week in writing" | **Useful** |
| 7 | Decide the exit in advance | "Have you set in advance when a pilot will be scaled or stopped?" | **Useful**, but only as an echoed question |
| 8 | Staff AI policy | "Is there a written policy on what staff may put into AI tools?" | **Useful.** New thought; no hint what such a policy says |
| 9 | Tell guests it is AI | "disclose AI to guests (AI Act Art. 50; FADP in CH – see D7)" | **Potentially valuable, delivered unusably.** She cannot act on a citation |
| 10 | One-page plan | "Approved plan naming the goal and KPI" | **Useful** |
| 11 | Weakest area is Financial; six percentages | "Financial investment (weakest) 0%" | **Obvious.** She answered No four times a minute ago |
| 12 | Score 19/100 | | **Obvious / empty.** No comparison, no meaning beyond "low" |
| 13 | The other "next gaps" | echoed questions | **Obvious.** Her own answers repeated |

Roughly 3 valuable, 6 useful, the rest obvious. Most of the value sits in the "What good looks like" lines and the verdict sentence, about 60 words in total.

### Was the verdict believable?
- **Level: yes.** "Build foundations first" is right for a hotel with a demo and nothing else. She would not argue.
- **Score: too harsh in feel, and structurally unfair at her stage.** She is *considering* a tool. Several must-haves cannot be Yes before choosing a vendor (signed data agreement, two-way data exchange proven by live test, override in the product). The tool scores a hotel that is doing the right thing (checking before buying) the same as one that is careless. 19/100 reads like a school fail.
- **"Not sure" = No** is stated openly, which is fair, but 7 of her 20 negative answers were "I can't know yet". Those are vendor questions, not hotel weaknesses.
- **Technology 50%** feels lenient next to the rest: it came from four "Partly" guesses on questions she did not fully understand.
- **Contradictions / oddities:** "Financial investment 0%" for a hotel with EUR 15,000 a year available (the question asks about an allocated budget, which is right, but 0% says "no money"). The owner is asked whether the owner approved the plan. Two questions about hotel content are near-duplicates and count twice. The level labels "ready to pilot" and "ready to scale" mean little for a single hotel with one chatbot. A Swiss law is cited to a Portuguese hotel.
- **Not wrong anywhere in substance.** Every gate named is a sensible gate for a chatbot.

### What would she do the next morning?
Realistically two things, both from the verdict sentence and the must-have list:
1. Email the vendor three questions: can we test it on our own PMS and WhatsApp before signing; can staff take over and correct it; send the data-processing agreement.
2. Ask the front office manager to count messages and response times for two weeks (the baseline) and tell her she will own the tool.

The written plan, the budget split and the staff AI policy would go on a list and probably wait. Without the tool she would likely have signed after a second demo, so this is a real effect. But she has to translate the questions into actions herself; a less motivated manager would do nothing.

### Would she come back?
**Probably not on her own.** Nothing invites her: no date to return, no reminder, no saved link, no "re-check when you have closed 3 must-haves". And the return visit is unrewarding (section 3).

What would bring her back, concretely:
- **Before signing the contract** (weeks, not months): a "ready to sign?" pass through only the open must-haves, with a visible "5 of 7 closed" and the label turning from red to amber. That is the natural second visit and the tool does not offer it.
- **When considering a second tool**: only if her hotel-level answers (policy, staff, PMS, content) carry over so the second check takes 3 minutes, not 10.
- **A vendor-question sheet and a one-page plan template** she fills in and brings back.

### Would she trust it?
**Mostly yes, with doubts.**
- Builds trust: it tells her not to buy (no sales interest); it is a hotel school, not a vendor; the proof-line rule; the honest footer "Self-assessment, not legal or investment advice… team judgement still to be tested with hotels"; clean, calm design.
- Creates doubt: the search failing on its own example in the first 20 seconds; "prototype", "Deliverables 4 and 6", "see D7", "(research, 18 Nov 2026)", "New question" badges, which show an unfinished student project; no sources or names behind "research"; no explanation of how 19 was calculated; questions she could not understand, which make her doubt the score built on them; the footer admitting the thresholds are untested. And when hosted, the code saves checks to a shared team database: she should be told **before** she starts who can read her answers (locally it only says "Saved in this browser only").

### Top 5 fixes, ranked
1. **Turn the result into an action plan.** For every gap show the action, not the question: what to do, who does it, rough effort, what "done" looks like, and for vendor-dependent gaps the exact question to ask the vendor. Show all gaps (or "8 of 13, show all"). Put the data-contract points (ownership, exit, training on data) on the result and in the PDF. Add a top three for this week.
2. **Make the return visit show progress.** Keep each result as a dated snapshot; on return show "19 → 25, 2 of 7 must-haves closed", tick off closed items, date the update, and let her click a gap to jump to that one question. Add a "re-check only open items" path.
3. **Rewrite the questions in plain language, one idea each.** Replace the six "Do you have what this tool needs here: …?" items with real sentences; remove "see D7", article numbers and Swiss law for non-Swiss hotels; add one line of help or an example under each jargon term.
4. **Separate "not decided yet / ask the vendor" from "No".** For a hotel that has not bought, mark vendor-dependent must-haves as "to check before signing" instead of scoring them as failures, and say what the score means at the "considering" stage. Otherwise careful first-timers always get about 20/100.
5. **Fix the first minute.** Search must find "chatbot" (synonyms/keywords per tool), fix the lost-focus bug, show "29 questions, about 10 minutes" before she starts, and say up front where answers are stored and who sees them.

### Bugs (with reproduction)
| # | Bug | Steps | Expected / actual |
|---|---|---|---|
| B1 | Focus lost after editing a hotel field | Start page. Click "Hotel or group name", type a name. Click once into "Your name and role" (or press Tab). Type | Expected: text appears in the second field. Actual: focus is on the page body, nothing is typed; a second click is needed. Cause: the `change` handler for hotel fields re-renders the whole form (`check.js` line 210, `render(true)`) |
| B2 | Result date not updated | Finish a check. Later (other day) Change answers → change something → See my result | Header still shows the first date ("18 Nov 2026"). `submittedAt` is set once; `updatedAt` is stored but never shown |
| B3 | "Next gaps" silently cut at 8 and reshuffled | Answer with more than 8 non-must-have No/Not sure. Then improve one area and resubmit | Open gaps disappear from the list without being fixed; no "more" indicator. `check.js` line 106 `.slice(0, 8)` (same in PDF, line 173) |
| B4 | Earlier check unreachable; no confirm | On a result, click "Start a new check" | Result is replaced by the start page with no confirmation. The old check stays in storage but no screen lists it |
| B5 | PDF title cut off | Download the PDF for the chat assistant tool | Tool name runs off the right edge ("…multiling"); title line does not wrap |
| B6 | Search misses its own example word | Type `chatbot` (the placeholder's first example) | "Nothing matches. Try another word." Plain substring match on name, task and department; "chatbot" is in none |
| B7 | Proof not enforced or flagged at the point of entry on return | Change a must-have to Yes, leave the proof line empty, click Next | No block; she learns only on the result that "Yes without proof counts as Partly", and cannot add the line there |
| B8 | Stale toast | Click Copy summary, then at once Change answers | "Summary copied." toast floats over the question page (minor) |
| B9 | Internal wording shown to users | Any run | "see D7", "Deliverables 4 and 6", "(research, 18 Nov 2026)", "New question" badge |
| B10 | Phone: answer chips stretched | Result page at 390 px | "No"/"Not sure" chips are as tall as the whole row (cosmetic) |

Not counted as bugs: one Google Fonts request; PDF and copy both worked locally.

### Overall
**Right verdict, weak teaching, no return path.** It stops a small hotel from signing too early, which is worth something, but it mostly hands Marta her own answers back and gives her no credit when she improves. **Valuable insight: 5/10.**
