# Readiness check: user-journey review

*Reviewed 18 Nov 2026 against the built pages in `tools/readiness-check/` (rules v2). Two reader personas: (a) general manager of a 60-room independent hotel with no IT team, first use; (b) a group CIO / HFTP board member judging whether members should see it. No repository file was changed.*

**How the numbers here were produced.** Every count below comes from my own runs of the built tool on 18 Nov 2026 (Playwright, Chromium, local server), or from running `src/logic.js` over all 90 tools in the embedded data. Time-on-task figures are my estimates, not measurements with real hotel staff; the method is given in section 0. Screenshots and PDFs are in `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/review/` (temporary folder).

---

## Verdict in five lines

1. The flow is clean, fast and honest about being a prototype. It runs without errors at 1280 px and 390 px. The scoring is fully reproducible in the team view.
2. A first-time GM will get stuck twice: finding the tool (typing "chatbot", the tool's own example, returns nothing) and reading the generated "Do you have what this tool needs here: ..." questions, a quarter of all questions, many of which are not real questions.
3. The result tells the GM what is wrong but not what to do. The "gaps" are the same questions repeated back. There is no owner, no first step, no template, no Monday-morning list.
4. For the CIO: the method is visible to the team but not to the client. No sources are shown on the client page or the PDF, "Ready to scale" can be reached by typing "x" as proof, and the tool never asks whether a pilot was run. It should not go to members in this state.
5. "About 10 minutes" is true only for a GM who answers "Not sure" a lot. With 6 to 8 proofs typed honestly it is 12 to 15 minutes, and 25 to 40 if the evidence has to be looked up.

---

## 0. What was run

| Run | Width | Persona | Tool | Questions | Must-haves | Proofs typed | Result | Est. time |
|---|---|---|---|---|---|---|---|---|
| A | 1280 px | Independent, Switzerland, GM, many "Not sure" | AI chat and messaging assistant (gx-2) | 29 | 7 | 0 | 23, Build foundations first | 8 to 10 min |
| B | 390 px touch | Group, Denmark, CIO, strong answers | Dynamic pricing (rm-2) | 22 | 7 | 7 | 98, Ready to scale | 11 to 13 min; 20 to 30 with look-ups |
| B2 | 390 px touch | Same, one proof line deleted | same | 22 | 7 | 6 | 39, capped (average 96) | n/a |
| C | 1280 px | Managed, France, GM, mixed answers | AI recruiting (hr-2) | 27 | 8 | 3 | 39, capped (average 68) | 12 to 14 min; 25 to 40 with look-ups |
| E | 390 px touch | Independent, edge cases | GenAI review response (gx-3) | 21 | 5 | 5 ("x") | 100, Ready to scale | n/a |

Time estimate method: question text read at 200 words a minute (427 words in run A, 327 in B, 389 in C, counted from the page), plus 10 seconds to decide per question, plus 40 seconds per proof line, plus 1.5 to 2 minutes on the start page. "With look-ups" assumes the user opens a budget file, a contract or an email to answer the proof truthfully.

Across all 90 tools (independent hotel): 18 to 31 questions, median 21; 5 must-haves for 17 tools, 6 for 49, 7 for 20, 8 for 4. The start page always says "about 10 minutes", whether the tool has 21 or 29 questions.

---

## 1. First-time experience

**Start page.** Clear title and one-line promise. The two numbered panels make sense. The disabled button explains what is missing ("Enter the hotel name, how it is run, and pick a tool to start"). Good.

Where the GM hesitates or quits:

- **Search fails on the tool's own example.** The placeholder says "For example chatbot, pricing, rota, camera". Typing "chatbot" or "chat bot" returns "Nothing matches. Try another word." The tool is called "AI chat and messaging assistant, pre-booking and in-stay (web, WhatsApp, OTA inbox; multilingual)"; search is a plain substring match. "chat" works (7 results, the right one third). "camera" returns only food-waste measurement, not security video or room inspection. This is the single most likely quit point.
- **Tool names are analyst names, not buyer names.** "SEO / AI-search (GEO) visibility & AI-assistant distribution", "AP invoice capture & GL coding (OCR/ML)", "AI channel management / ARI distribution", "Bookable hotel apps in AI assistants (ChatGPT apps, MCP servers)". A GM thinks "the chatbot from our PMS vendor" or names a product. There is no product-name search and no "my tool is not listed" route.
- **The picker is 90 rows in a 419 px box** on a phone (scroll height 10,361 px), a scroll area inside a scrolling page. The department filter helps (6 rows for Guest Experience) but there are 15 departments and a GM of a small hotel does not think in departments such as "Reservations & Distribution" versus "Guest Experience". The team view calls it "the 91-use catalogue"; the picker offers 90.
- **"How the hotel is run"** has three options. A family-owned hotel with a soft-brand or consortium membership, or a leased hotel, does not know which to pick, and there is no hint of what the choice changes.
- **Hotel size is never asked.** A 60-room hotel and a 600-room hotel get the same questions and thresholds.
- **Why am I doing this?** Nothing says what the result is for, who sees it, or what happens to the answers until the result page says "Saved and shared with the EHL project team" (after the fact). In the hub the client's name, hotel and typed evidence go to a shared database with no notice before they start.

**Legend.** "Type of tool" is explained in one line that does not help ("what kind of AI it is"). The GM cannot act on it and does not need it to choose. "Effort" is useful, but the explanation uses PMS and CRM, and "Heavy (hardware, group platforms or high legal risk)" mixes three different things. The legend sits above the list, so it is read before the user has seen what it describes. Verdict: half understood, mostly skipped.

**The six steps.** Step header, area name and one-sentence reason are good. Chips "Must-have" and "New question" appear without explanation: "Must-have" is not defined until the result page, and "New question" means new to the team, which is meaningless to a client. The progress bar shows 0% on step 1 and 83% on step 6. "Next" stays disabled until everything is answered, with no marker on the question that was missed.

**Jargon met by the GM** (counts are appearances in question text across all 90 tools): KPI (93), PMS (35), "see D7" (14), POS (11), RMS (10), CRS, CRM, DPIA, FADP, GDPR, MCP, BMS, GL, ERP, OTA, API. Also: "use case", "baseline", "lawful basis", "open APIs", "all-in-one that includes the AI", "human oversight", "gates" (result text: "Fix the gates"), "building blocks" (team view only), "autopilot", "hand-offs", "stop rule".

**Is "about 10 minutes" true?** For run A, yes. For anyone who answers Yes to must-haves and types real evidence, no: 12 to 15 minutes, more if they look things up. On a phone each step is 1,400 to 1,600 px tall, about two screens. Suggest "10 to 15 minutes; have your budget and vendor contract to hand".

---

## 2. The questions as experienced

**Length.** Most questions are 9 to 21 words and read well. Good examples: "Is there a fallback if the tool or the vendor fails?", "Have you decided what staff will do with the time saved, and told them?"

**The generated resource questions are the weak point.** 536 of the 2,023 questions served across the 90 tools (26%) are built by gluing "Do you have what this tool needs here:" onto a note from the team sheet. Results seen in the runs:

- "Do you have what this tool needs here: often included in reputation tool?" (gx-3, Finance)
- "Do you have what this tool needs here: subscription?" (9 tools)
- "Do you have what this tool needs here: usually part of the RMS?" (res-5)
- "Do you have what this tool needs here: disclose AI to guests (AI Act Art. 50; FADP in CH – see D7); hand-off rules?" (gx-2)
- "Do you have what this tool needs here: high-risk AI under the EU AI Act (employment) – human oversight, DPIA (see D7)?" (hr-2). This is the most important legal point for a recruiting tool and it is the least readable question in the check.
- "... rMS subscription; channel-manager fees?", "... hR manager reviews every decision?", "... cRM or loyalty manager?": the first letter of an acronym is lower-cased in 56 questions.
- "see D7" (an internal deliverable number) appears in 14 questions.

These questions also cannot be answered "Does not apply" and they carry the same weight as any other question.

**Repetition between areas** (run A, chatbot): the same idea is asked three or four times.

| Idea | Asked as |
|---|---|
| A person can step in | P5 "Can staff override the AI", R-pe "staff take over hand-offs", G3 "Is the level of human oversight set", X2 "Can guests always reach a person", R-or "hand-off rules" |
| The systems connect | T1 "exchange data both ways", R-te "messaging channels plus PMS link", T2 "cloud-based with documented open APIs" |
| There is money | F1 "12-month budget", R-fi "subscription per property or per conversation" |
| Content is ready | R-da "complete, current hotel FAQ and policies", D4 "Is hotel content complete, current and structured?" |
| Staff are on board | O6 "Do staff feel able to test, question", X1 "Have the staff who will use it seen it" |
| Risk reviewed (run C) | G2 risk review with DPIA, R-or "human oversight, DPIA", G3 |

About 8 of 29 questions in run A feel like repeats. A GM who notices will start clicking the same answer down the page.

**Relevance to the tool.** Selection works: the pricing tool gets data-quality questions, the chatbot gets content and guest questions, recruiting gets staff representatives and a risk review. Misses:

- T1 "exchange data both ways" is a must-have for AI recruiting, with no "Does not apply". A careers-site screening tool may need no two-way link to hotel systems.
- For recruiting, "Can staff override the AI" is not a must-have, while the team sheet says "HR manager reviews every decision". For a high-risk employment tool this is the wrong way round.
- "Have you decided what staff will do with the time saved" for recruiting, and "Has the process been redesigned before being automated?" for nearly everything, read as generic.
- Two-part questions: "Can guests always reach a person, and have you checked that guests accept this tool?" and "Have the staff who will use it seen it, and do they expect it to help?" If one half is yes and the other no, the user picks "Partly" and the gap list cannot say which half.

**Questions a small hotel cannot answer.**

- "Is the core system cloud-based with documented open APIs, or an all-in-one that includes the AI?" Only the PMS vendor knows.
- "Can the tool exchange data both ways with the systems that hold what it needs?" with proof "Live test on your own systems, not a demo". Impossible before buying, and the check is meant to be done before buying.
- "Do you have a lawful basis and a vendor agreement ..." A signed agreement cannot exist before purchase either. Several must-haves are pre-purchase questions phrased as post-purchase facts.
- "Is each use case reviewed for business, data, security and legal risk before launch?" assumes a review process exists.
- "Do security controls cover AI tools and their vendors?", "Is the level of human oversight set for this use case?"
- "Have you measured a baseline for the KPI this AI should move" with "date and method".

In run A these all became "Not sure", which the page says "counts as No and becomes a to-do". Honest, but the to-do is the question again, with no hint of who to ask (see section 3).

**Burden of typing evidence.** The proof box is well designed: plain ask, worked example, clear warning ("until you add this line, your Yes counts as Partly"). But:

- It is 5 to 8 lines of typing, on a phone, in a 40-character field that hides long text.
- It asks for personal and commercial details (a staff member's name and hours, budget amounts, contract dates) that are then saved to the team's shared database. No notice, no consent line.
- The cost of skipping one line is extreme (98 becomes 39; see section 3), while typing "x" is accepted. The rule punishes the honest-but-hurried and does not stop the careless.
- The example text is the same whatever the tool: a hotel checking AI recruiting sees "Maria Rossi, revenue manager" and "Front-office manager can switch off auto-replies". No example exists for G2 or P5's "what good looks like" on the result page.

---

## 3. The result

**Persona A (independent, chatbot, 23).** Fair. Six red bars, seven must-haves listed, eight gaps. But the page is a wall of fifteen questions repeated back. "Do not buy yet. Fix the gates: name an owner, set a budget and baseline, check connections and data terms, agree a one-page plan" is the only action text, it is the same for every tool, and it uses "gates", a word the user has not seen. A GM with 23/100 needs: the three things to do first, who to ask (PMS vendor, owner, lawyer), how long each takes, and a one-page plan template. Seven red must-haves with no order is demotivating. Nothing says "this is normal for a hotel that has not started".

**Persona B (group, pricing, 98).** Feels good and is explained. But "Ready to scale" was reached without any question about a pilot, and the advice then says "Roll out only if the pilot met its KPI". The verdict name over-claims: the check measures preparation, not pilot results. "Ready to pilot" is the most the questions can support unless a pilot question is added.

**Persona B2 (same answers, one proof line missing, 39).** This is the result that will lose the CIO. Screen shows: 39/100, red "Build foundations first", "Do not buy yet", then six green bars at 88 to 100% above a legend saying "75% or more: ready to scale". The explanation is one grey line: "Score capped at 39 because 1 must-have not met. The average of your six areas is 96." The must-have listed is answered "Yes" with the red note "Yes without proof counts as Partly". A group that has run this pricing tool for three years is told not to buy it because a text box was left empty. The rule may be right (no proof, no credit); the presentation is not.

**Persona C (managed, recruiting, 39, average 68).** The cap is fair here: five must-haves open, including the risk review and staff representatives. But 39 for C and 39 for B2 are indistinguishable in the score, in the team list and in the copied summary, although one is one line from "scale" and the other has real legal gaps.

**Is "39, capped" useful or demotivating?** The gate idea is right and is the tool's best feature. The number is the problem: a capped score throws away the information the user just gave. Better: show the verdict as the headline, show the uncapped average as "your answers" and state "blocked by 1 must-have" as a separate, prominent line with a button that jumps to that question. Do not print 39.

**Other result issues.**

- The gap list is capped at eight with no "and 6 more".
- "What good looks like" is missing for P5, G2 and all non-must-have questions.
- "(weakest)" is put on the first of tied areas (People 88% shown as weakest while Organisation is also 88%).
- No link to anything: not to the D7 governance material, not to the use-case catalogue, not to a plan template.
- "Change answers" sends the user back to step 1 of 6; fixing one proof line takes seven clicks and the question is not highlighted.
- No comparison: "hotels like yours typically score ..." is absent (correctly, since there is no data), but nothing says so.
- The PDF is clean and fits one page, but has the same content as the screen: no next steps, no method, no sources, no thresholds explained, and none of the typed evidence (which is exactly what an owner would want to see).
- "Copy summary" gives score, verdict and area percentages only; on a cap it omits the reason.

**What the user expects and does not get:** a Monday-morning list (3 to 5 actions, each with an owner role, the document to produce and a rough time), questions to send the vendor, and a date to re-check.

---

## 4. Credibility for the CIO / HFTP persona

**What is already right.** The footer says "Self-assessment, not legal or investment advice" and that questions and thresholds "are team judgement still to be tested with hotels". The header says "prototype". The PDF footer repeats both. The team view shows every step of the arithmetic.

**What a CIO will challenge.**

1. **No sources on the client side.** Not one question on the client page or PDF carries a source. The project rule is that every figure carries its source next to it; the thresholds 40% and 75%, the caps 39 and 74 and the points 2/1/0 have none. "D6 research" and "research, 18 Nov 2026" are internal labels, not sources.
2. **Thresholds are labelled as judgement only in the footer**, in grey 12 px text. The bar legend states them as fact.
3. **Self-report with free-text proof.** Any character counts as proof ("x" on five must-haves gave 100/100, Ready to scale). The team view shows the proof text, so a reviewer can see it, but nothing flags it.
4. **"Ready to scale" over-claims** (section 3). So does a precise score out of 100 built from 2 to 9 three-level answers per area: Skills in run B is two questions, so one "Partly" moves the area from 100% to 75%; Data for recruiting is two questions.
5. **Equal weight for areas of 2 and 9 questions**, and for a generated note ("subscription?") and a legal must-have.
6. **Legal content is thin and oddly placed.** The EU AI Act high-risk status of recruiting appears only inside an unreadable generated question. The note on staff representatives cites "AI Act Art. 26(7) ... from 2 Dec 2027" in the team view only; the D7 team should confirm that date and the wording before it is shown anywhere. Country is collected and then not used: a Swiss hotel gets "AI Act Art. 50; FADP in CH" in one sentence, a UK hotel gets EU wording, and the staff-representative question does not vary by country.
7. **Not validated.** No hotel has used it. No inter-rater check (would two managers of the same hotel get the same verdict?). No link shown to established readiness or adoption frameworks, although the research notes in this folder map them.
8. **Data protection of the tool itself.** It collects a name, role, staff names and budget lines and shares them with a student team without a notice. A CIO will see that before anything else, in a tool that asks about lawful basis.
9. **Internal language leaks**: "Deliverables 4 and 6", "D6", "see D7", "New question", "Fix the gates".

**Must be fixed before members see it:** items 1, 3, 4, 8 and 9, the generated questions (section 2), the search (section 1) and the capped-score presentation (section 3). Items 5 to 7 can be handled by a visible "How this was built and what it cannot tell you" panel plus a pilot with 5 to 8 hotels.

---

## 5. The team view

**Strengths.** The seven-box "Where the data goes" strip explains the pipeline in one glance. The twelve-line working-out can be read aloud to a coach. The must-have table shows answer, proof and met/not met side by side. The answer table gives the reason each question was asked. The page recomputes with current rules and flags a change from the saved score. Delete asks for confirmation.

**Is it enough to explain a score to a client or coach?** For the arithmetic, yes. For the "why", not yet:

- "Why it was asked" gives internal labels ("D6 gate", "building block 'Operating rules'", "D6 team sheet"), not the evidence behind them. A coach asking "why is a measured baseline a must-have?" gets no answer on this page. The research tool link is one hop away, with no deep link to the question.
- No source for the thresholds and caps; no note that they are judgement.
- Step 11 reads wrongly when the average is already under the cap. Run A shows "Score capped at 39 because 7 must-haves not met: 23." The score was not capped.
- The list shows the capped score only. Nordlys (average 96, one proof missing) and Grand Hôtel du Lac (average 68, five must-haves open) both show "39/100 Build foundations first". Show the average and the number of open must-haves in the row.
- No "what would change the verdict" line (for example: "add proof for P5 and the verdict becomes Ready to scale, 96").
- No flag for weak proof (one character, or identical text on every line), no count of "Not sure", no flag for straight-lining.
- Editing a check overwrites it. Nordlys went from 98 to 39 and only the 39 remains; "last changed" is shown but not what changed. "Last changed" also appears on a check that was never edited (run A), because the two timestamps differ by milliseconds.
- No export (CSV or PDF), no filter or sort, no cross-hotel view (which must-haves fail most often), which is the finding D6 actually needs from this tool.
- No field for the team's own notes, interview date or interviewer.
- The red banner says "Team only" but the page is one URL away from the client page with no access control in the page itself (the README says the hub is private; a coach should be told that).
- On a phone the page is 8,400 to 20,000 px tall, the tables squeeze to 4 or 5 words per line, and the Points column is off-screen (table 444 px wide in a 316 px box). It scrolls sideways but nothing shows that. Treat as desktop-only or give a card layout.

---

## 6. Bugs and rough edges (exact steps)

| # | Steps | What happens | Severity |
|---|---|---|---|
| 1 | Start page, type "chatbot" in Search | "Nothing matches", although "chatbot" is the first example in the placeholder | High |
| 2 | Pick "GenAI review response", go to step 3 | Question reads "Do you have what this tool needs here: often included in reputation tool?" Same pattern on 536 questions; 9 tools ask just "... subscription?" | High |
| 3 | Pick "Dynamic pricing", step 3 and 4 | "rMS subscription", "rMS writes rates ..."; "hR manager" for recruiting. 56 questions have a lower-cased acronym (`lowerFirst` in `logic.js`) | Medium |
| 4 | Pick the chat assistant, step 6 | "(AI Act Art. 50; FADP in CH – see D7)" shown to the client; 14 questions say "see D7" | Medium |
| 5 | Complete a check with every must-have Yes and proof "x" | 100/100, Ready to scale | High (credibility) |
| 6 | Complete run B, "Change answers", clear the proof under "Can staff override the AI", click Next six times | 39/100 with six green bars; "People (weakest) 88%" while Organisation is also 88% | High (presentation) |
| 7 | Open team view for a check whose average is under 39 | Step 11: "Score capped at 39 because 7 must-haves not met: 23." | Medium |
| 8 | Hotel name "Hotel Česká Koruna Łódź Αθήνα", download PDF | PDF header "Hotel eská Koruna ód"; file name "AI-readiness-check_Hotel-esk-Koruna-d-.pdf". Czechia, Poland, Greece, Croatia and Hungary are in the country list | Medium |
| 9 | On any step press the browser Back button | Leaves the tool entirely (answers are kept and restored on return, but the user does not know that) | Medium |
| 10 | Answer some questions, Back to start, "Choose another tool", pick the same tool again | All answers and proofs are wiped with no warning | Medium |
| 11 | Finish a check, close the tab, reopen the page | Opens on the old result, not the start. "Start a new check" keeps the previous hotel name (on a shared laptop, the previous client's name) | Low |
| 12 | Leave one question unanswered on a long step (phone) | "Next" is disabled; the count says "5 of 6 answered" but the missing question is not marked | Medium |
| 13 | Step 1 and step 6 | Progress bar 0% and 83%; never reaches full | Low |
| 14 | Any tool, start page | "about 10 minutes" for 21 and for 29 questions | Low |
| 15 | Phone, tap "Download report (PDF)" | The toast sits over the middle of the area bars | Low |
| 16 | Phone, proof field | Single-line input cuts long evidence ("Maria Rossi, revenue manager, 4 hours a wee") | Low |
| 17 | Team view, run A just submitted | "last changed" shown though nothing was changed | Low |
| 18 | Team view flow strip vs picker | "91-use catalogue" vs 90 tools offered | Low |
| 19 | Team view on a phone | Points column off-screen, no scroll hint | Low (team is on desktop) |
| 20 | Result page, more than 8 gaps | Only 8 shown, no count of the rest | Low |

No JavaScript errors in any run. Draft restore after reload works. Touch targets are 44 px high. Keyboard focus is visible. No sideways page scroll at 390 px on the client page.

---

## 7. Overall verdict

### Five strengths

1. **One tool, tailored questions.** Asking about one concrete purchase, with 18 to 31 questions chosen for it, is more useful than a generic maturity survey.
2. **Must-haves with a one-line proof.** The ask-plus-example proof box is the best piece of design in the tool and gives the result weight.
3. **Honest about uncertainty.** "Not sure is fine: it counts as No and becomes a to-do", "prototype", "team judgement still to be tested".
4. **Fully reproducible scoring.** The team view shows every point, the reason for every question, and recomputes under current rules.
5. **Solid build.** Clean at both widths, no errors, drafts survive a reload, PDF on one page, plain visual style that does not look machine-made.

### Five weaknesses

1. **A quarter of the questions are generated fragments**, some meaningless, some leaking internal references, and they score the same as real questions.
2. **Finding the tool is hard**: literal search, analyst names, 90 rows, no "not listed" route.
3. **The result diagnoses but does not direct.** No ordered actions, no owners, no templates, no links.
4. **Capped score presentation.** 39 with six green bars reads as a bug; 39 means two very different things.
5. **Not yet defensible to an expert.** No sources or method on the client side, "x" passes as proof, "Ready to scale" without a pilot question, country collected but unused, no privacy notice.

### Top 10 changes, ranked by impact against effort

| Rank | Change | Impact | Effort |
|---|---|---|---|
| 1 | Fix search: match word starts and synonyms (chatbot, bot, rota, roster, CCTV, camera, pricing, RMS, hiring), add a short plain-language name per tool, add "My tool is not listed" leading to the closest type | High | Low |
| 2 | Rewrite the resource questions as real questions, or show the team-sheet note as a "This tool typically needs: ..." line under the area heading and stop scoring it. Remove "see D7"; fix the lower-cased acronyms | High | Low to medium |
| 3 | Change the capped display: verdict as headline, uncapped average shown as "your answers", a separate line "Blocked by N must-haves" with a link straight to each one. Do not show green bars under a red verdict without that line | High | Low |
| 4 | Turn the gap list into actions: for each must-have and each question a short "Do this" text with who to ask and what document to produce; show a "First three steps" box at the top of the result and in the PDF | High | Medium |
| 5 | Add a "How this works and what it cannot tell you" panel on the start and result pages and in the PDF: points, thresholds stated as team judgement, sources per question area, not validated with hotels yet | High (CIO) | Low |
| 6 | Add a short notice before the start: what is saved, who sees it, do not enter personal names if you prefer; make the proof for P1 work with a role instead of a name | High (CIO) | Low |
| 7 | Rename "Ready to scale" to something the questions support (for example "Ready to roll out after a successful pilot") or add a pilot-result question; set a minimum for proof text and flag one-character proofs in the team view | Medium to high | Low |
| 8 | Cut repetition: merge P5/G3/X2 hand-over questions, T1/T2/R-te, F1/R-fi; split the two-part questions X1 and X2; add "Does not apply" to T1 for stand-alone tools; aim for 15 to 20 questions | Medium | Medium |
| 9 | Small flow fixes: mark unanswered questions, honest time ("10 to 15 minutes"), progress bar to 100%, "Change answers" opens the step with the gap, confirm before wiping answers, handle browser Back, full character set in the PDF, fix the "capped at 39 ... : 23" line | Medium | Low |
| 10 | Team view: show average and open must-haves in the list, add "what would change the verdict", keep edit history, export CSV, add a cross-hotel table of most-failed must-haves, link each question to its source in the research tool | Medium (for D6 findings) | Medium |

After changes 1 to 7 the tool is fit to test with 5 to 8 hotels. It should be shown to HFTP members only after that test, with the test described on the page.
