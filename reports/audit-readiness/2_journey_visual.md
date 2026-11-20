# Readiness check audit 2: journey, friction and visual design

*20 Nov 2026. Read-only audit of `tools/readiness-check/index.html` (build of 20 Nov, rules v3). Driven with Playwright (Chromium) at 1280x900 and 390x844 with touch emulation. Nothing in the tool was changed.*

Screenshots, PDFs and scripts: `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/audit-ux/` (file names below are in that folder). Naming: `a_` = persona A (knows little), `b_` = persona B (prepared), `c_` = return visit, `t_` = phone with true touch sizing, `_1280` / `_390` = viewport.

Test tool in all runs: "AI chat and messaging assistant" (30 questions, 8 must-haves), independent hotel, Switzerland.

## 1. Measurements

All counts are from the scripted runs. "Words" = words on screen across the screens the path passes through (what the person has to scan, not what they must read). Selecting from a drop-down is counted as 2 clicks.

| Path | Clicks | Fields | Words on screen | Result |
|---|---|---|---|---|
| **Fastest possible** (hotel type, first tool in list, stage, then Next through all six steps with no answer) | **12** | **2** | **6,104** | "Not enough information yet", 0 of 21 answered |
| (a) Knows little, chatbot, mostly "Don't know yet" | 49 | 38 | 7,957 | "Not ready yet", 33 open items |
| (b) Well prepared, all must-haves Yes with proof | 49 | 47 | 6,972 | "Ready to pilot", 7 open items |
| (c) Return, update 6 items | 8 | 11 | review page alone 1,640 | "Not ready yet", 33 → 27 open |

Time to first value: nothing useful appears before the result. In path (a) that is 10 screens and about 7,950 words in. At 200 words a minute that is 40 minutes if read, against the promise "about 15 minutes" (start screen and prep screen).

Page lengths (viewport heights):

| Screen | 1280x900 | 390x844 |
|---|---|---|
| Start, empty | 2.2 | 4.0 |
| Prep ("What you will need") | 3.6 | 6.7 |
| Steps 1 to 6 | 1.2 to 1.8 | 2.1 to 3.1 |
| Result, persona A | 5.7 | 10.5 |
| Result, persona B | 4.0 | 6.9 |
| Review "Only what is still open", persona A | 5.9 | 11.1 |

Other measurements:

- Tool list: 98 rows in the picker (the catalogue says 99), in a 419 px box whose content is 8,477 px tall (20 box-heights of scrolling). No count shown.
- First question on step 1 starts at y = 360 px on desktop and 498 px on phone; the first answer buttons at 452 px and 636 px. The header (title plus two intro paragraphs, 62 words) is repeated on every screen.
- Result, persona A: 10 panels, 8 h2 headings, 14 buttons, 52 grey "meta" lines, 10 chips.
- Primary (blue) buttons per screen: start 1 (2 when "Your checks" is shown), prep 1, each step 1, review 1, result 1.
- Tap targets on a touch device: buttons, answer pills, selects and text inputs are 44 px high. Below 44 px: both date inputs (21 px), the share tick box (13x13 px), "How this result was worked out" (24 px), "Remove" and "Withdraw shared copy" (40 px).
- No horizontal scroll at 390 px on any screen. No console errors apart from the blocked font request.

### Contrast (WCAG 2.x, from the CSS tokens)

| Pair | Ratio | Verdict |
|---|---|---|
| Main text `#15181D` on white / on page `#F5F4EF` | 17.8 / 16.2 | Pass |
| Secondary `#474C55` on white | 8.6 | Pass |
| Meta `#63676F` on white / on page | 5.7 / 5.2 | Pass AA, but it is 13 px and used 52 times on the result |
| Link and primary button `#1E4E8C` / white | 8.3 | Pass |
| Chip "Not met" `#A3392A` on `#F8E1DC` | 5.3 | Pass (12 px bold) |
| Chip "Ready to pilot" `#7E5700` on `#FAEFD5` | 5.7 | Pass |
| Chip "Met" `#1F6F43` on `#E1F0E7` | 5.2 | Pass |
| Chip "Not known yet" `#1E4E8C` on `#E3EBF6` | 6.9 | Pass |
| Warning line `#A3392A` on white | 6.6 | Pass |
| **Answer pill and input border `#DEDCD4` on white** | **1.4** | **Fail** (3:1 needed for control boundaries) |
| **Panel border on page** | **1.25** | Weak; panels read as one sheet |
| **Bar track `#ECEAE3` on white / progress track on page** | **1.2 / 1.1** | **Fail**; the empty part of each bar is invisible |
| Dark theme: meta `#8A8F99` on `#1C1F25` | 5.1 | Pass |

Text contrast is fine. The failures are all control and track outlines.

## 2. Findings: journey and friction

Severity: High = likely to stop or mislead a first-time general manager; Med = slows or confuses; Low = polish.

### Start screen

**J1. High. The start screen asks for work before it shows any value, and the first thing to do is 1.6 screens down on a phone.**
Evidence: `t_390_yourchecks.png`, `a_390_01_start_empty.png`, `a_1280_01_start_empty.png`. The first phone screen is entirely heading, two intro paragraphs and "Before you begin" (three blocks, 108 words). The first field appears at about y = 800 px. The page is 4.0 phone screens and 2,100 words.
Fix: cut "Before you begin" to one line under the title: "One AI tool at a time. About 15 minutes. You get a verdict and a to-do list by person." Move "Who fills it in" to a one-line hint under "Your role". Move "Come back" to the result. Put the tool picker first (see section 4).

**J2. High. The required fields are not marked, and the reason the button is grey is 1 to 3 screens away from the missing field.**
Evidence: `a_1280_01b_start_bottom_disabled.png`, `a_390_01b_start_bottom_disabled.png`. No field carries "required" (0 `required` attributes, no asterisk). "Hotel name (optional…)" is the only one labelled, so a reader infers the other three are required; in fact only "How the hotel is run" is. The hint "Choose how the hotel is run, a tool and where you are with it." never changes: after choosing the hotel type it still lists all three.
Fix: keep the button enabled. On click, scroll to the first missing item, outline it and say next to it "Choose one to continue". Make the hint list only what is missing: "Still needed: a tool · where you are with it". Label "Your role" and "Country" as "(optional)" or make them required; today they look required and are not.

**J3. High. The tool list is hard to use: 98 long rows in a small scroll box, jargon names, and a search that misses plain words.**
Evidence: `a_1280_02_toollist.png`, `a_390_02b_toollist_search.png`, `t_390_picker.png`, `gate_search_empty.png`. Measured:
- "chatbot" (the first example in the placeholder) returns 8 rows; the chatbot is third, behind "Bookable hotel apps in AI assistants (ChatGPT apps, MCP servers)" and "SEO / AI-search (GEO) visibility & AI-assistant distribution".
- "rota" (also in the placeholder) returns "AI HVAC / BMS optimisation and energy analytics (central plant)" first.
- "telephone" 0 results, "checkin" 0 ("check-in" 7), "staff schedule" 0 ("schedule" 3).
- Names a general manager will not parse: "GenAI RM copilots & BI Q&A / price explanations", "AI channel management / ARI distribution", "AP invoice capture & GL coding (OCR/ML)", "Agentic revenue management", "MCP servers", "LLMs", "GEO".
- Each row carries "Moderate effort" and "Forecast and pricing tool" in grey; the legend above ("Type of tool: what kind of AI it is. Tools of the same type need similar resources.") explains labels nobody needs in order to choose.
- On a phone the list is a scroll area inside the scrolling page (a scroll trap), about three rows visible at a time.
- There is no "my tool is not listed" route. Dead end.
Fix: (1) plain-language row titles with the catalogue name as the second line, for example "Chatbot that answers guests (website, WhatsApp)" / "AI chat and messaging assistant". (2) Rank title matches above description matches; match every word separately; add synonyms (telephone = phone = voice, rota = schedule = roster, checkin = check-in). (3) Show eight "most common" tools first, then department chips, then "Show all 98". (4) Show "98 tools · 8 match". (5) Drop the legend and the type label from the rows; keep effort as a small tag with a tooltip. (6) Add a last row "My tool is not in the list" that opens a generic check. (7) On phone, let the list grow with the page instead of scrolling inside it.

**J4. Med. After picking a tool the list disappears, the card appears, and nothing says what to do next.**
Evidence: `a_1280_02c_after_pick.png`. Focus falls to the page body (`document.activeElement` = BODY). The page does not move to step 3.
Fix: after a pick, move focus to the "Selected" card and scroll "3. Where are you with this tool?" into view.

**J5. Med. "This changes the advice, not the rules: some answers can only be known once you have a vendor."**
Where: under the stage options. The reader has not met any "rules" yet. Jargon about the tool's internals.
Fix: "We use this to tell you which questions can wait until you have a vendor."

**J6. Med. The data notice still has placeholders.**
Text on the start screen: "Responsible for shared data: [to be confirmed]. Shared copies are deleted by [date to be confirmed] or on request to [contact to be confirmed]." A hotel manager reads this as unfinished and unsafe. (Known open item in the README; it is the first trust signal on the page.)
Fix: fill in before any hotel sees it, or hide the share feature until it is filled.

**J7. Low. The title block talks to the project, not the hotel.** "EHL SBP Group 36 for HFTP · Deliverables 4 and 6 · prototype" and "Not about how AI assistants find your hotel." The first is internal; the second answers a question nobody asked.
Fix: "A student project by EHL for HFTP · prototype". Delete the second sentence.

### "What you will need" (prep)

**J8. High. The prep screen shows every question twice before the person may answer any: 1,080 words, 6.7 phone screens.**
Evidence: `a_1280_04_prep_full.png`, `a_390_04_prep_full.png`. The eight must-haves are listed in full, then all 30 questions again under "Who to ask". The impatient reader's only route is the button at the very bottom. The good idea on this page (send questions to the people who know) is buried.
Fix: make this a half-screen: "30 questions, 8 of them must-haves. You will probably need: Finance (1), IT (3), the vendor (3), data protection (2), your department head (14)." with one "Copy questions" button per person and the lists collapsed. Primary button "Start now" at the top; second button "Send the questions first". Offer the full prep list again at the end as "to find out".

**J9. Med. "Or close the page: everything is kept in this browser."** Next to the primary button. Inviting the person to leave before they have started.
Fix: delete here. Say it once, on the result.

### Question steps

**J10. High. The header pushes the first question below the fold on every step.**
Evidence: `t_390_step1_top.png`: on a phone the first answer buttons sit at y = 636 of 844. `a_1280_06_step1_answered_full.png`: 360 px of title and intro before the first question on desktop. The 62-word intro is repeated on all 10 screens (620 words of repetition in one run).
Fix: after the start screen, replace the header with one line: "AI readiness check · Chatbot · Step 1 of 6".

**J11. High. "Proof line" is not understood, and the rule behind it is contradictory on screen.**
Evidence: `a_1280_05_step1_proof_tooshort.png`, `a_1280_07_result.png`.
- The prompt is "Confirm your Yes in one line." with placeholder "Type your answer here". The word "proof" appears only later, on the result: "Proof line too short to count" and "Your proof (self-declared, not checked)". Two names for one thing.
- The warning is red before the person has typed anything: "Needed for a must-have: until you add a line of at least a few words, your Yes counts as Partly." "At least a few words" is not a rule a person can meet on purpose (the real rule is 2 words and 8 characters).
- The warning says the Yes "counts as Partly", but the result shows "Not met" in a red chip, the action plan files it under "Before anything else", and the summary counts it among "must-haves … not in place". The person said Yes and is told No.
- The step footer says "6 of 6 answered" while the Yes does not count.
- Typing "me" is rejected; typing the same sentence "Signed by GM on 12 Nov 2026" into all eight must-haves gives "8 of 8 must-haves met" and "Ready to pilot" (`b_1280_07_result_full.png`). The line is friction without assurance.
Fix: one name, "note". Prompt: "Where is this written down? (one line, for your own report)". Hint under the field, in grey until the person leaves the field: "Add a few words, for example: Revenue manager, 4 hours a week". Do not downgrade the answer: keep Yes as Yes and mark it "Yes, note missing" in amber on the result, listed under a separate heading "Add a note to confirm" instead of "Not met". Footer: "5 of 6 answered · 1 Yes needs a note".

**J12. Med. Words a hotel manager will not know, with no explanation.**
Quoted from the screens: "data processing agreement" (step 5), "data protection contact" (step 5), "PMS" (step 4, "Which describes your main hotel system (PMS)?"), "read from and write back to your hotel systems" (step 4), "Hand-off rules", "Staff take over hand-offs", "Review transcripts", "Conversation logs", "Maintain knowledge base" (tick lists), "written risk check" (step 6), "pilot" (verdict).
Fix: add a one-line plain explanation under each, as the tool already does with "What counts as Yes". Examples: "Data processing agreement: the contract that says what the vendor may do with your guests' data. Ask the vendor for their 'DPA'." "Hotel system (PMS): the software you check guests in with, such as Opera, Mews or Protel."

**J13. Med. The tick lists are noun fragments with unclear stems.**
Evidence: `a_1280_06_step1_answered_full.png`. "Who needs to be involved. Tick those who have agreed to take part:" followed by "Guest-service lead monitors conversations" with the options "In place / Not yet / Don't know / Doesn't apply". "Tick" does not match four pills, and "In place" does not answer "who has agreed". Others: "The people involved can already:" then "Maintain knowledge base"; "Agreed in writing:" then "Hand-off rules".
Fix: write each as a full question: "Has your guest-service lead agreed to check the chatbot's conversations?" with Yes / Not yet / Don't know / Doesn't apply.

**J14. Med. Five answer options plus a follow-up drop-down on most questions.**
Evidence: `a_390_06_step1_answered_full.png`. "Yes / Partly / No / Don't know yet / Doesn't apply" wraps to two rows on a phone, and "Don't know yet" opens "Who can answer?" with eight roles. In run (a) that was 38 answers for 30 questions. "Partly" has no definition.
Fix: put "Doesn't apply" behind a small "Not relevant" text link. Pre-fill "Who can answer?" (it already is) and show it as text with a "change" link: "We will put this on the list for: the vendor · change".

**J15. Med. A person looking at options is asked questions they cannot answer, and is then told "Not ready yet".**
Evidence: `a_1280_07_result.png`. Stage "Looking at options: no vendor chosen yet", yet the check asks "Have you signed a data processing agreement with the vendor of this tool?" The hint ("No vendor yet? Choose "Don't know yet" and "The vendor"") makes the person do the tool's work.
Fix: at stages "Looking at options" and "Talking to a vendor", take the vendor-only questions out of the steps and put them straight onto "Questions for the vendor". Fewer questions, and the verdict changes from "Not ready yet" to "Here is what to settle before you choose".

**J16. Low. No way to jump between steps.** "Step 1 of 6" and a 6 px bar; no step names, no way to see that Finance is step 3 without clicking through. Back from step 1 returns to the prep screen (fine).
Fix: a row of six named steps ("People · Skills · Money · Systems · Data · Rules"), each clickable, with a tick when complete.

### Result

**J17. High. The verdict cannot be understood and acted on in 10 seconds.**
Evidence: `a_1280_07_result.png`, `t_390_result_top.png`. What the first screen says, in order: a grey line with the tool name; a chip "Not ready yet"; a monospaced line "0 of 8 must-haves met · 16 of 30 questions answered · 33 open items"; "5 of the 8 must-haves are not in place. Each one on its own is reason enough to wait before you sign anything."; "3 more must-haves are not known yet."; "People and Skills and Technology infrastructure and Data and Organisation & governance are below 40% on what you told us."; five buttons.
Problems:
- Three different counts of the same thing in four lines (0 of 8 met, 5 not in place, 3 not known). The reader has to do the sum.
- "33 open items" for a person who is only looking at options. This reads as failure, not as a plan.
- The sentence with four "and" is machine-joined and names internal area labels.
- "below 40% on what you told us": a score, after the tool promised there is none.
- No next step. The five buttons are file actions (PDF, file, update, register, new). The one useful action for this person (send the questions to Finance, IT and the vendor) is 2 to 5 screens further down.
- On a phone the verdict panel fills the whole first screen and the buttons run off it.
Fix: see the exact copy in section 4. One sentence verdict, the top three things to do with a name on each, one primary button "Send the questions to the people who know".

**J18. High. The action plan is 33 items in four groups with no order of time and three different grammars.**
Evidence: `a_1280_07_result_full.png`, `a_1280_result.txt`.
- "Before anything else (5)", "Confirm with the vendor before signing (1)", "To find out (16)", "Gaps to close (11)". For a first-timer this is a wall.
- "Before anything else" items are instructions ("Write a 12-month budget line…"). "To find out" items are the original questions ("Which describes your main hotel system (PMS)?"). Tick-list items are fragments: "Find out whether these are in place: Review transcripts", "Get in place: Hand-off rules", "Get in place: Maintain knowledge base".
- The must-haves are repeated: once in "Must-haves", again in "Before anything else", again inside "To find out" as "Must-have: …".
- "Gaps to close" is not sorted by person although every item has one.
- Button label bug: **"Copy for it"** (the role "IT" lower-cased). Also "Copy for head of the department using it".
Fix: one list grouped by person, since the hand-over is the point: "You (general manager): 6 · Finance: 1 · IT: 3 · The vendor: 4 · Data protection: 2 · Department head: 17". Each group shows its must-haves first, collapses the rest behind "and 12 more", and has one "Copy for Finance" button. Write every item as an instruction. Remove the separate "Must-haves" panel from the default view. Fix the label: "Copy for IT".

**J19. Med. The wrong button is primary.** "Download report (PDF)" is the only blue button on the result. For persona A (33 open items) a PDF is not the next step. "Update open items", "Add to the AI Register" and "Start a new check" sit beside it with equal weight; "Add to the AI Register" is unexplained and leaves the tool.
Fix: primary depends on the verdict. Not ready / not enough information: "Send the questions" (opens the copy-by-person list). Ready to pilot: "Download the report for your owner". Move "Save as file", "Start a new check" and "Add to the AI Register" into a "More" row at the foot of the page, each with a six-word explanation.

**J20. Med. Progress does not show.** On return, 5 of 8 must-haves were closed; the chip is the same red "Not ready yet" and the same first sentence pattern (`c_1280_04_result_updated.png`). The blue "Since 20 Nov 2026" banner is below the buttons and says "5 must-haves now met · 3 more questions answered · open items 33 → 27."
Fix: put the change in the verdict line: "Not ready yet, but closer: 5 of 8 must-haves done (was 0)". Show the eight must-haves as eight dots, filled when met.

**J21. Med. "Your six areas" shows percentages after all.** "25% … 17% … 50%" in mono, with the footnote "Each bar: points from the questions you could answer (Yes 2, Partly 1, No 0). Below 40% holds the verdict back; 40–74% is a gap to close during a pilot. These cut-offs are the project team's judgement, still to be tested with hotels." A first-time reader cannot use this, and "Financial investment 50%" is built on 1 answered question of 3.
Fix: replace the number with words ("Weak · 4 of 6 answered", "Too little to say · 1 of 3 answered"). Do not colour a bar that rests on fewer than half of its questions. Move the points footnote into "How this result was worked out".

**J22. Med. The legal panel hedges four times in six lines and ends with an admission.** "Provisional label from the team's AI Register, awaiting legal sign-off. Not a compliance verdict and not legal advice." Then, for a Swiss hotel: "This check does not yet cover Swiss rules in detail." The chip "Transparency" means nothing on its own.
Fix: one sentence in plain words and one action: "Guests must be told they are talking to AI, in the first message. Ask the vendor whether that notice is built in. (Draft wording, not legal advice.)" For Switzerland and the UK say at the top which rules the line is based on.

**J23. Low. The share panel outside the hub.** `a_1280_08b_share_after.png`, `t_390_share.png`: after clicking "Share a copy" the toast says "Saved as a test copy in this browser only (outside the project hub)." and the panel says "Last shared 20 Nov 2026 (test copy in this browser)." Nothing was shared; the button then reads "Send updated copy".
Fix: outside the hub, disable the button and say "Sharing works only inside the project hub."

**J24. Low. "Start a new check" confirmation appears in the same row as the other buttons** (`result_newcheck_confirm.png`): "Start a new check? This one stays in "Your checks"." in small grey text between buttons. Easy to miss.
Fix: fine to keep inline, but put the confirm on its own line with the question in normal text.

### Return visit, Back and reload

**J25. Med. A returning person lands on the old result, not on "Your checks".** Reloading or reopening the page opens the last screen (result). "Your checks in this browser" is shown only on the start screen, and there is no link to the start screen from the result except "Start a new check". Nothing on the result links to the list of checks.
Fix: add "Your checks (2)" as a text link in the header on every screen.

**J26. High. "Only what is still open" was all 30 questions, and answered questions vanish while you work.**
Evidence: `c_1280_03_review_full.png`, `c_390_05_review_before_yes.png` / `c_390_05_review_after_yes.png`. For persona A the heading says "30 questions not yet answered with Yes." The screen is 5.9 desktop screens, 11.1 phone screens, 1,640 words; "Partly" and "No" answers count as open, so it is the whole questionnaire on one page. When a question is answered "Yes" it disappears from the page at once (30 → 24 after six answers), with no confirmation and no undo; keyboard focus is lost and the next Tab starts from the top of the page.
Fix: group the review by person, must-haves first, others collapsed ("Finance: 1 · IT: 3 …"). Keep an answered question in place, greyed, with a tick and "Undo", until the person leaves the screen. Heading: "8 things are still holding the verdict back. 22 smaller gaps are below."

**J27. Low. Browser Back and reload work.** Back from result goes to the review or step 6; reload mid-flow reopens the same step with the answers; Back after reload goes one step back. Not a finding, except that the result has no on-page "Back" button, only "Go through all questions" at the very bottom, which restarts at step 1 instead of the step the person wants.
Fix: on each action-plan item add "change answer", which opens that question.

### Phone, one-handed

**J28. Med. It works, but it is long and the main buttons are at the bottom left.** No horizontal scroll, 44 px targets. Problems: the scroll-inside-scroll tool list (J3); 6.7 screens of prep; the result is 10.5 screens; "Back" sits left of "Next", so the thumb of a right-handed user reaches "Back" last and "Next" is 62 px wide; date inputs are 21 px high and unstyled (`t_390_share.png`); the share tick box is 13 px.
Fix: full-width "Next" on phones with "Back" as a text link above it; style `input[type=date]` like the other inputs (it is missing from the CSS selector); make the tick-box label a 44 px row.

## 3. Findings: visual design and hierarchy

### Where the eye goes

| Screen | First | Second | Third | Right? |
|---|---|---|---|---|
| Start (`a_1280_01_start_empty.png`) | "AI readiness check" (34 px) | "Before you begin" panel | "1. About your hotel" fields | No. The eye should land on the tool question. Three blocks of small text come before any action; the primary button is 2 screens down and grey. |
| Tool list (`a_1280_02_toollist.png`) | The grey-ruled legend | Search field | First row, "Demand forecasting (rooms, by day/segment/room class)" | No. The legend explains labels before the choice. Rows are bold 15 px with two grey lines each; nothing separates departments. |
| Prep (`a_1280_04_prep_full.png`) | "What you will need" | Column of eight "Must-have" outline chips | Grid of role boxes | Partly. The chips repeat the same word eight times and say nothing. The primary button is at the very end. |
| Step (`a_1280_06_step1_answered_full.png`) | Page title again | Black selected pills | Red warning line | No. The question text (15 px semibold) is weaker than the black pills and the same weight as "What counts as Yes:". The step name "People" is larger than any question. |
| Result (`a_1280_07_result.png`) | Red "Not ready yet" chip | Blue "Download report (PDF)" button | Monospaced tally | Half right. The chip is right; the eye then jumps to a file download, past the explanation, and the mono line looks like code. |
| Your checks (`c_1280_02_your_checks.png`) | "Update open items" (blue) | Tool name | Red chip | Right. This is the clearest screen in the tool. |

### Findings

**V1. High. Panels touch each other.** The 18 px gap is set on `.wrap`, but the panels are children of `#view`, which has no gap: measured distance between panels is 0 px on every screen. Borders double up (`a_1280_03_start_filled_full.png`), and at 1.25:1 border contrast the page reads as one long sheet with hairlines.
Fix: `#view{display:flex;flex-direction:column;gap:18px}`.

**V2. High. Everything on the result has the same weight.** 10 white panels, 8 headings at 22 px, same border, same padding. Verdict, action plan, vendor questions, legal note, owner form, reminder form, sharing and method all look alike. 52 grey 13 px lines.
Fix: three levels. (1) Verdict block: full-width, tinted in the verdict colour, 28 px sentence. (2) "What to do now": the list by person, the only white card. (3) Everything else as collapsed rows: "Questions for the vendor (8)", "Legal note", "Note for your owner", "Remind me", "Share with the project team", "How this was worked out".

**V3. High. The selected answer is black; the brand accent is blue; the verdict colours are red, amber and green.** A selected "No" and a selected "Yes" look identical (`a_1280_06_step1_answered_full.png`), and black pills are the heaviest thing on each step. Unselected pills have a 1.4:1 border and vanish on a bright phone.
Fix: selected = accent blue fill with a tick; unselected border `#8A8F99` (3.5:1). Keep red, amber and green for the result only.

**V4. Med. The question is not the strongest text on its card.** Question 15 px/600; "What counts as Yes:" 14 px with bold lead-in; "Confirm your Yes in one line." bold; "Must-have" chip outlined in black on its own row. Four bold things per question.
Fix: question 18 px/600. "Must-have" as a small coloured label before the question on the same line. "What counts as Yes" in regular grey with no bold. One bold element per question.

**V5. Med. Line lengths.** The `.sub` and summary text are capped (about 83 to 86 characters), but action-plan items run to about 104 characters, and the 13 px meta lines to about 111 to 123 characters at 1280 px (`a_1280_07_result_full.png`, legal panel and must-have notes).
Fix: `max-width:68ch` on `.meta`, `ol.actions li`, `.gap .g1`, `.tight li`.

**V6. Med. Type scale is flat and small on desktop.** Body 15 px, meta 13 px, chips 12 px, h4 12 px capitals. Between 34 px title and 22 px h2 there is nothing; between 15 px and 13 px almost nothing. On phones body goes up to 16 px but pills and buttons stay 14 px.
Fix: body 16 px everywhere; question 18 px; meta 14 px; verdict sentence 28 px; drop the 12 px capital h4 in favour of 14 px/600 sentence case.

**V7. Med. The monospaced tally line** ("0 of 8 must-haves met · 16 of 30 questions answered · 33 open items", IBM Plex Mono 13 px) and mono percentages look like developer output.
Fix: set in the body face; show as three small labelled figures or drop two of them (see J17).

**V8. Med. Mixed components for the same job.**
- Choice: native selects (role, country, department, "Who can answer?"), stacked full-width pills (stage), inline pills (answers), mini pills (tick lists), a tick box (share).
- "Who to ask" boxes: the "Copy questions" button is top right in six boxes and under the heading in the seventh, because the heading wraps (`a_1280_04_prep_full.png`).
- Date inputs are unstyled browser defaults, 21 px high, next to 40 px selects (`b_1280_07_result_full.png`, "Decision needed by", "Date (optional)").
- Two names for the same list: "Open conditions" (PDF page 1) and "Action plan" (screen); "proof", "proof line", "Confirm your Yes".
Fix: one choice component (pills) for up to five options and a select above that; fix the box header to wrap the button under the title at all widths; add `input[type=date]` to the input rule; one vocabulary.

**V9. Med. Chips.** "Must-have" is a black outline chip repeated eight times on prep and on every must-have question; on the result the status chips ("Not met", "Not known yet", "Met") have different widths, so the question text starts at three different x positions in one list (`a_1280_07_result.png`).
Fix: fixed-width status column (110 px) or an icon column; replace the repeated "Must-have" chip on prep with a section heading.

**V10. Low. Progress bar.** 6 px, 1.1:1 track on the page, no step names. It reads as a decorative rule (`t_390_step1_top.png`). Also a blue focus rectangle is drawn around the whole view after each step change on touch devices (visible in `t_390_step1_top.png`).
Fix: named six-step indicator (J16); `#view:focus{outline:none}` since focus is moved by script.

**V11. Low. Area labels wrap badly in the bars.** "Financial investment · 1 of 3 answered", "Technology infrastructure · 3 of 5 answered" and "Organisation & governance · 4 of 8 answered" break onto two lines in a 190 px column while the others stay on one (`a_1280_07_result_full.png`).
Fix: put "x of y answered" in its own right-hand column.

**V12. Low. The PDF.** `a_1280_report_p-1.png`: clean and readable, Helvetica, but page 1 calls the list "Open conditions", shows hyphens as bullets, repeats the four-"and" sentence, and gives 25% bars without the caveat about how few questions they rest on. Four pages for persona A. The file name is `AI-readiness-check_hotel_gx-2_2026-11-20.pdf`: "gx-2" is an internal id.
Fix: same wording as the screen; file name from the tool's short name ("…_chatbot_2026-11-20.pdf").

**V13. Low. Does it look generic or machine-made?** Yes, in specific ways: every block is the same white rounded card with a hairline border; grey 13 px captions under almost every line; small capital letter-spaced headings ("WHO FILLS IT IN"); pastel status chips; middle dots as separators in 30+ places; machine-joined sentences ("People and Skills and Technology infrastructure and Data and…"); "Copy for it". There is no image, no brand mark and no tie to the report's look, and inside the hub the dark green bar sits on a blue-accent tool (`hub_390_readiness.png`).
Fix: fewer cards (V2); one caption per block at most; sentence-case headings; write joined lists with commas and "and"; use the hub's green as the accent so the tools look like one family.

## 4. Ideal flow

Target for the fastest useful path: 4 clicks and 0 typed fields to the first question; a first verdict after the 8 must-haves (about 10 clicks more); under 600 words on screen up to that point.

1. **Start = the tool picker.** One question on the screen.
2. **One follow-up screen:** where you are with it, and how the hotel is run (two rows of pills). Country and role move to the result ("Add details for your report"). Hotel name moves to the PDF step.
3. **Must-haves first, one per card,** with "Yes / Not yet / Don't know". "Don't know" names who will be asked. Vendor-only questions are skipped when there is no vendor and go straight to the vendor list.
4. **First result after the must-haves** (about 2 minutes): verdict sentence, what to do, who does it.
5. **Optional second round:** "Answer 22 more questions for a fuller picture (about 8 minutes)", grouped by the six areas.
6. **Hand-over:** one screen, one "Copy for …" per person, then PDF.
7. **Return:** the link in the header opens "Your checks"; "Update" shows the open must-haves first, grouped by person, with answered items staying visible until the person leaves.

### Exact copy: start screen

> **Is your hotel ready for this AI tool?**
> Pick one tool. Answer 8 questions. See what is missing and who has to do it. About 2 minutes for a first answer.
>
> **Which tool are you looking at?**
> [ Search, for example: chatbot, pricing, staff rota, phone ]
>
> Most checked
> · Chatbot that answers guests (website, WhatsApp)
> · Phone assistant that takes reservation calls
> · Room pricing that updates itself
> · Online check-in with ID scan
> · Replies to guest reviews
> · Staff rota planning
>
> [ Browse all 98 tools by department ]   ·   My tool is not listed
>
> Your answers stay in this browser. A student project by EHL for HFTP. Not legal advice.

### Exact copy: tool picker (after typing "chat")

> **3 tools match "chat"**
>
> **Chatbot that answers guests (website, WhatsApp)**
> Answers common questions day and night and passes hard ones to staff. · Guest service · Medium effort
>
> **Ordering by chat for room service and restaurants**
> Guests order by message or voice. · Food and beverage · Medium effort
>
> **Staff messaging with translation**
> Staff speak or type a task in their own language. · Housekeeping · Light effort
>
> Not here? [ Show all 98 ] · [ My tool is not listed ]

After a pick:

> **Chatbot that answers guests** · change
> **Where are you with it?**
> [ Just looking ] [ Talking to a vendor ] [ About to sign or start a trial ] [ Already using it ]
> **How is your hotel run?**
> [ Independent ] [ Part of a group ] [ Managed or franchised ]
> [ **Start: 8 questions** ]

### Exact copy: one question card

> Chatbot · Question 3 of 8 · Money
>
> **Is there a written budget for the first 12 months that covers the full cost, not only the subscription?**
> Full cost means subscription, set-up, connection to your systems, training and running it.
>
> [ **Yes** ]  [ **Not yet** ]  [ **Don't know** ]
>
> *(after "Yes")* Where is it written down? One line, for your own report.
> [ for example: 2027 budget, line "guest messaging", EUR 6,000 ]
> You can add this later. We will remind you on the result.
>
> *(after "Don't know")* We will put this on the list for: **Finance** · change
>
> ‹ Back                         [ **Next** ]

### Exact copy: first screen of the result (persona A)

> Chatbot that answers guests · Just looking · 20 Nov 2026
>
> **Not ready yet. 5 things to settle before you sign.**
> ● ○ ○ ○ ○ ○ ○ ○   1 of 8 must-haves done · 3 you could not answer yet
>
> **Do these first**
> 1. **You:** name who is in charge of the chatbot and how many hours a week they get.
> 2. **Finance:** write a 12-month budget for the full cost.
> 3. **The vendor:** confirm in writing that the chatbot connects to your booking system. Sign a data agreement before any guest data goes in.
>
> [ **Send the questions to Finance, IT and the vendor** ]
> See all 33 items by person · Download the report (PDF)
>
> Come back when the answers arrive: this page keeps your check in this browser.

For persona B:

> **Ready for a trial.** All 8 must-haves are in place. 7 smaller gaps to close during the trial.
> [ **Download the report for your owner** ]   See the 7 gaps by person

## 5. Top fixes by effort

| # | Fix | Effort |
|---|---|---|
| 1 | `#view` gap (V1), `input[type=date]` style (V8), "Copy for IT" (J18), `#view:focus` outline (V10) | Minutes |
| 2 | Shorten the header after the start screen (J10) | Minutes |
| 3 | Gating: enabled button, scroll to the missing item, hint lists only what is missing (J2) | 1 hour |
| 4 | Proof line: one name, no red before typing, "Yes, note missing" instead of "Not met" (J11) | 2 hours (touches the rules; needs the logic tests) |
| 5 | Search ranking, word-by-word match, synonyms, result count (J3) | 2 hours |
| 6 | Result first screen: one sentence, three actions, verdict-dependent primary button (J17, J19) | Half a day |
| 7 | Action plan and review grouped by person; answered items stay visible (J18, J26) | Half a day |
| 8 | Plain tool names and "most checked" list (J3) | Half a day of writing for 98 names |
| 9 | Must-haves-first flow with an early result (section 4) | 1 to 2 days |

## 6. Limits of this audit

- No real hotel manager was observed. Confusion points are a designer's reading of the screens, backed by measurements; the "impatient general manager" is a role-play.
- Reading time uses 200 words a minute on words displayed, which overstates what a skimmer reads.
- One tool (chatbot, 30 questions) was walked in full; the fastest path used "Demand forecasting" (21 questions). Other tools have different question counts.
- Touch sizes were measured under Chromium touch emulation, not on a phone. Full-page screenshots in the scratch folder named `a_390_*_full.png` and `b_390_*_full.png` were taken after the emulation dropped the touch setting and show 39 px buttons; the `t_390_*.png` files show the true touch sizes.
- The hub embed was checked only for loading and layout (`hub_1280_readiness.png`, `hub_390_readiness.png`); sharing inside the hub was not tested.
