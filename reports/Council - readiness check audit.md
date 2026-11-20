# Council: readiness check audit, what to build now

*20 Nov 2026. LLM Council run as defined in `.claude/skills/llm-council/SKILL.md`: five advisors, blind peer review of answers A–E in shuffled order, Chairman ruling. All roles written by one model, each kept to its role. Nothing in the tool was changed; this file is the only output.*

*Inputs read in full: `reports/audit-readiness/1_fact_logic.md` (F01–F41), `2_journey_visual.md` (J1–J28, V1–V13, proposed flow and copy), `3_benchmark.md`, `tools/readiness-check/README.md` and `CLEANUP.md`, `docs/PROJECT_CONTEXT.md`. Finding ids below refer to those files. Code facts checked in `src/logic.js` and `src/check.js` (rules string `v3 (19 Nov 2026)`, file format `v: 3`, snapshots store the level key and the rules string).*

**Decision:** which of the audit findings on the hotel AI readiness check do we build now, in what order, and which need a human decision first?

---

## Brief (given to every advisor)

The readiness check (`tools/readiness-check/`, rules v3) is a student prototype by EHL SBP Group 36 for HFTP. A hotel picks one AI tool, answers 17–33 questions (audit 1), and gets a verdict and an action plan by person. Three audits on 20 Nov 2026 found 41 fact and logic faults (F01–F41), 41 journey and visual faults (J1–J28, V1–V13) and a benchmark gap on speed and trust. One engineer-agent has one build pass today.

Fixed: no 0–100 score; the questions on whether the hotel has checked legal items (AI Act, DPA, DPIA, staff representatives) stay; nothing on AI-search visibility; sharing is opt-in. No lawyer has reviewed the legal wording and D7 sign-off is open, so a wrong legal statement is corrected conservatively or removed, never replaced by a new unverified one. The data-notice placeholders (controller, deletion date, contact) cannot be invented. Saved checks from the current version must keep working; scoring changes need tests and an explanation in "How this was worked out". The client asked for evidence that lets people "make your own conclusions", likes tools useful to hoteliers, and warned that advice dates fast.

Open: no real hotel manager has used the tool (audit 2, limits).

---

## Step 1: five advisors

### Contrarian

What fails first is the build pass itself. Eighty-two findings, one agent, one day: if the agent takes the journey redesign (audit 2 puts must-haves-first at "1 to 2 days") it will finish half of it and leave the logic faults in. Then the tool looks better and still tells an AI recruiting tool it is "Ready to pilot, 10 of 10 must-haves met" (F01).

Second failure: scoring fixes break saved checks. F02, F04, F05 and F12 all move points. A hotel that saw one verdict yesterday sees another today with no explanation. Snapshots only compare within one rules version, so if the version is not raised, "since last time" will report changes the hotel never made.

Third: fixing legal wording by writing better legal wording. F07, F20 and F22 each come with a neat replacement sentence. None has been read by a lawyer. Several sources in audit 1 are marked "not verified at source". Swapping a wrong sentence for an unreviewed one is the same risk with a fresh date on it.

Fourth: the placeholders (F09). Someone will be tempted to type a plausible name and date. That is an invented data controller on a page that asks hotels whether they have a signed data agreement.

Fifth: renaming the verdict silently. Tests, PDF, team page and README all carry "Ready to pilot".

Sixth: visual changes (V3, V6) alter every screen and can hide regressions in the 54 Playwright checks.

**Most important point:** do the verdict and statement fixes first, behind a new rules version, and treat every proposed legal sentence as a removal unless the text is already in the tool.

### Assumption-Ripper

Assumption 1: the audits are right. Audit 2 says itself that no hotel manager was observed and the "impatient general manager" is a role-play. Its severity labels are a designer's opinion. Audit 1's repros are real runs, so logic findings are solid; its legal corrections are one reader's reading.

Assumption 2: shorter is better. The benchmark praises an 18-question, 5-minute check and then lists why that check is worse. The owner's value is must-haves with proof. Cutting questions to chase 5 minutes may cut the product.

Assumption 3: a proof line proves something. "aaaa bbbb" passes (F11). Renaming it "note" is honest; pretending it is evidence is not.

Assumption 4: "Ready to pilot" is the tool's to say. The client asked for evidence and "make your own conclusions". A verdict is a conclusion. The least presumptuous wording says what was found, not what the hotel is.

Assumption 5: must-haves are known. Adding P5 and G3 as must-haves (F11) is one more team judgement, untested with hotels.

Assumption 6: the 40% line means something. It is "the team's judgement" (README). F04 shows one tick can trip it. Should areas block at all? Unknown; at least stop one answer deciding.

Assumption 7: sharing is needed now. No hotel has used the tool, so switching it off costs nothing today.

Assumption 8: "one build pass" can carry rule changes safely. Only if each has a test written before the change.

**Most important point:** build what the repros prove, hold what rests on opinion or on untested legal reading, and say in the tool which is which.

### Expansionist

The benchmark's last line is the prize: no comparable tool takes one AI tool and tells named people what must be in writing before signing. That position is real only if a hotel believes the result. So the upside is in three places.

First, the result's opening screen. If it reads as one sentence plus three named tasks and a "send the questions" button (J17, J19), the tool becomes something a general manager forwards. Every forward is a new reader for HFTP.

Second, the "Yes, note missing" state (J11, F12). It turns the proof line from a punishment into a paper trail, which is the one feature only the regulator's spreadsheet has.

Third, the method section. The benchmark says a public "how this was built" page is table stakes. "How this was worked out" already exists; with honest wording after F10 it becomes that page, and feeds D6 and D9 (an article on why the check has no score).

Bigger moves I would not lose: must-haves first with a result after 8 questions; a "my tool is not listed" route; a sample owner page on the start screen. Each raises completion, and completion is what gives the team its own sourced peer data later, which is the only honest benchmark.

Also: the team view becomes interview material once real hotels share. That needs the data notice finished, so chase it today.

**Most important point:** spend the pass on the result's first screen and the "note missing" state, because they are what make the tool worth forwarding.

### Outsider

I do not run a hotel or know AI law. Reading the findings, these are the things I would not understand or would not trust.

"Ready to pilot." Ready according to whom? I typed Yes eight times. If nobody checked, say "we found nothing stopping you", not "you are ready".

Why does my Yes become "Not met" (J11)? I said Yes. Telling me No makes me think the tool is broken.

"[to be confirmed]" on the first page. I would close the tab. If you do not know who looks after my data, do not offer to take it.

"After expert review" (F10). Which experts? If they were not people, that is a false statement, however small.

"(to verify)" printed in my report (F08). That is your note to yourselves.

Fifteen minutes. The audit says 40 if read. Either time it or do not give a number as fact.

"Below 40%" after "there is no score". That is a score.

Words: DPA, PMS, DPIA, proof line, pilot. One plain line each would do.

The tool list: I type "chatbot" and it is third; I type "rota" and get air conditioning (J3). I would assume my tool is not covered.

A grey button that never tells me which field is missing (J2).

Naive question: why does a Swiss hotel get an EU law as a must-have with no way to say "not us" (F06)?

And: why are there 82 problems in a tool that passed 104 tests? What do the tests test?

**Most important point:** fix every place where the tool says something untrue about itself or about my answer before making it prettier.

### Executor

Order for today, one agent.

1. Write failing tests from the audit 1 repros (F01–F06, F12, F17). 30 minutes. No rule change without its test.
2. Raise the rules string to v4. Keep file `v: 3` and every storage key. Old snapshots stay, labelled, not compared.
3. Logic fixes in dependency order: F03, F04, F02, F01, F12, F05, F13/F14, F17, F06, F19, F18.
4. Text removals and corrections, a single sweep through `check.js`, `logic.js`, `reference.json`: F10, F08, F07, F16, F23, F24–F27, F29, F31, F37, F38, F40.
5. Sharing: one flag off until the data notice is filled; withdraw still works.
6. Minutes-level CSS: V1, date inputs, `#view:focus`, "Copy for IT", pill colour, borders.
7. Journey, cheapest first: J10 header, J2 gating, J9, J5, J8 collapse, J3 search ranking, then the result's first screen (J17/J19/J21), then review screen (J26).
8. Update "How this was worked out", README, team card. Run 34 + 70 tests plus new ones, rebuild, open a v3 saved file.

Stop doing: plain names for 98 tools, must-haves-first restructure, peer benchmark, font embedding, any new legal sentence.

Owners: the engineer-agent builds; the report owner answers four questions today (verdict name, data notice, time wording, shorten or not); D7 owner gets the list of removed legal lines.

Cut line: if time runs out, stop after step 6. Steps 1–6 are the pass that must ship.

**Most important point:** tests first, rules v4, logic then text then CSS then journey, and a hard cut line after the CSS.

---

## Step 2: blind peer review

Answers relabelled in shuffled order: **A** = "Order for today…", **B** = "I do not run a hotel…", **C** = "What fails first…", **D** = "The benchmark's last line…", **E** = "Assumption 1…". Reviewers saw only the letters.

### Review by the Contrarian (own answer: C)

Strongest: A's cut line after the CSS step. It is the only answer that says what ships if the pass runs short, which is the likeliest failure.

Weakest: D. "Chase the data notice today" and "sample owner page" assume people and designs that do not exist today; and treating "How this was worked out" as a trust page while the legal sign-off is open invites the over-claim F10 just removed.

Also weak: E's "should areas block at all?" opens a rule debate in the middle of a build.

All missed: the shared copies. If rules change, `team.html` recomputes old shared copies under new rules, so the team sees verdicts hotels never saw. It must show the rules version each copy was made with. Also nobody named a rollback: keep the v3 build file.

### Review by the Assumption-Ripper (own answer: E)

Strongest: B's question "what do the tests test?". 104 passing tests and 82 findings means the tests encode the builder's assumptions. New tests must come from the audit's repros, not from the fix.

Weakest: A's step 3 lists F18 and F19 as plain fixes. Both change which questions or must-haves a tool gets, on data nobody has reviewed tool by tool. They are judgement, not bug fixes; they need a printed before/after list.

D assumes forwarding happens. No evidence.

C assumes removal is always safe. Removing the Swiss example (F22) leaves "only in some cases" with nothing; that is acceptable only if the line tells the reader whom to ask.

All missed: F12 hides a decision. Does a Yes without a note block the verdict or not? Somebody must own that.

### Review by the Expansionist (own answer: D)

Strongest: B's "fix every place where the tool says something untrue about itself or about my answer". It joins F10, F08, F09, J11 and "below 40%" into one trust job, and trust is the benchmark's biggest gap.

Also strong: C's rules-version point; it is what makes "since last time" survive, and return visits are our lead over every comparable.

Weakest: A's stop list is too wide. Search ranking and a result count for the tool list are two hours (audit 2) and decide whether anyone starts. A did keep them, but "stop plain names" should be "defer", with the catalogue owner named.

E risks arguing the product away: a verdict is why the tool is useful to hoteliers, which the client also asked for.

All missed: once the notice is filled, the first five real hotels are worth more than any further audit.

### Review by the Outsider (own answer: B)

Strongest: C on legal sentences. I cannot tell a right legal sentence from a wrong one, and neither can the team without a lawyer, so "remove, do not rewrite" is the only rule a newcomer can check.

Also clear: A. I could follow it with no background.

Weakest: E's point 2 and D's "must-haves first" pull in opposite directions and neither says what the person on the page sees today. As a reader I only want to know how long it takes and why my Yes was refused.

Confusing in A: "rules v4" and "file v: 3". Two version numbers; say in the tool only one thing: "worked out with earlier rules".

All missed: after the fixes, will the page still say "prototype, not checked by a lawyer" once, clearly, at the top? Four hedges in six lines (J22) reads as nervous; one line reads as honest.

### Review by the Executor (own answer: A)

Strongest: C's "treat every proposed legal sentence as a removal unless the text is already in the tool". It is a rule an agent can apply line by line without judgement.

Useful: E's "test written before the change" matches my step 1.

Weakest: D gives no order and no stop. "Spend the pass on the result's first screen" would put half a day of layout ahead of a wrong verdict.

B is right on content, but it is a list, not a plan.

All missed: acceptance has to be runnable. Every logic item needs a named tool id and answer set (audit 1 gives them: `hr-2`, `rm-2`, `pr-5`, `fo-4`). Every copy item needs a grep: the strings "expert review", "to verify", "to be confirmed", "Copy for it", "Anonymous" must return zero hits in the built `index.html`. And the PDF and the team page must be opened once after the rename.

---

## Step 3: Chairman's BUILD RULING

**Verdict: go with changes.** Build the correctness and statement fixes first under rules v4, then the result's first screen and the cheap journey and visual fixes; hold everything that needs a lawyer, a named data controller, real hotel data or catalogue renaming.

**Where the council agreed:** tests from the audit's repros before any rule change; a new rules version so saved checks and "since last time" stay honest; legal wording is removed or made conservative, never rewritten into new claims; no invented placeholders; the must-haves-first restructure and plain names for 98 tools are not for today.

**Where it disagreed, and the ruling:**
- *Result screen now or later?* Expansionist: first. Executor: last, behind a cut line. **Ruling:** it is built, after A1, A2 and the minutes-level A4 items; the cut line stands.
- *F18 and F19 as plain fixes?* Executor: yes. Assumption-Ripper: judgement. **Ruling:** built, but the agent must print the before/after list of affected tools for the team to read.
- *Remove or replace the Swiss example (F22)?* **Ruling:** remove the example and say whom to ask.
- *Rename the verdict today?* Outsider and Assumption-Ripper: yes. Contrarian: not silently. **Ruling:** the less-claiming name is the safe interim; the final name is the owner's (B1).
- *Should areas block the verdict at all?* Not reopened today; only F03 and F04 are fixed.

### A. BUILD NOW (in this order)

**Step 0 (before anything): safety net.** Copy the current built `index.html` and `team.html` to `tools/readiness-check/backup-v3/`. Save one check from the current build as a fixture (`tests/fixtures/check-v3.json`, plus the raw `hftp-readiness-mychecks-v1` value). Write failing tests from the audit 1 repros for items 1–13. Set `RULES = 'v4 (20 Nov 2026)'`. Do **not** change the file format (`kind: 'hftp-readiness-check', v: 3`), any storage key, any answer code, or the level keys `stop` / `open` / `pilot`. Snapshots made under v3 stay in the history, labelled "worked out with earlier rules", and are not compared (existing behaviour). `team.html` shows the rules version each shared copy was made with.
*Test:* the v3 fixture opens on the new build with the same answers, notes and history; no console error; 34 + 70 existing tests pass apart from assertions on wording this ruling changes on purpose.

#### A1. Correctness and logic

1. **F03.** An area counts as "no known answer" only if at least one of its questions is blank or "Don't know yet". An area where every answer is "Doesn't apply" is left out of the verdict and its bar reads "Doesn't apply".
   *Test:* `rm-2`, all Yes with notes, both Skills questions "Doesn't apply" → level `pilot`, not `open`.
2. **F04, F30.** Remove `|| r.known === r.asked`. An area holds the verdict back only when it is below 40% **and** at least two of its questions have a known answer. Same sentence in README, team card and "How this was worked out".
   *Test:* `pr-5`, all Yes with notes, the one Skills item "Not yet" → not `stop`; the item appears as a gap.
3. **F02.** The way-out answer (`none`) returns `{state:'yes', pts:null}`: met as a must-have, left out of the points.
   *Test:* `rm-2`, all "Doesn't apply" / "Don't know", D5a and D5b = way out → Data is not 100% and not named "Strongest".
4. **F01.** Do not offer the way out on D5a / D5b when the tool has the `sens` add-on, a `chat` label or a `high` label. Elsewhere the option reads: **"This tool uses no personal data (guests, staff, job candidates, callers)"**. A saved check that holds `none` on such a tool keeps its stored answer but scores as "not known yet", with the line: "This answer is no longer offered for this tool. Please answer again."
   *Test:* `hr-2`, all Yes, D5a = D5b = XG = `none` → not `pilot`; fixture with `none` loads without error.
5. **F12, J11 (rule part).** Three states for a must-have: **met** (Yes + note, or way out) / **not confirmed** (Yes without a valid note) / **not met** (No or Partly). "Not confirmed" keeps the answer as Yes, gives no `stop`, and gives level `open`. Partly on a must-have stays "not met" (unchanged). The note rule (2 words, 8 characters) is unchanged.
   *Test:* `rm-2`, all Yes, no notes → level `open`, summary "8 must-haves need a note to confirm", zero items under "Before anything else".
6. **F05.** Tick lists: points = 2 × (in place) ÷ (in place + not yet); "Don't know" and "Doesn't apply" items are left out; a list with any blank or "Don't know" item counts as "to find out", not as answered.
   *Test:* `fo-4` R-pe `y,k` → 2 of 2 points but counted as to find out; five items `y,n,n,n,n` → 0.4, `y,y,y,y,n` → 1.6.
7. **F13, F14.** One definition everywhere: answered = Yes, Partly, No or Doesn't apply. "Don't know yet" is its own count. Display: "14 answered · 8 to find out". Open items: "9 open items in 5 questions" on result and update page.
   *Test:* all "Don't know" → steps and result both show "0 of 22 answered · 22 to find out".
8. **F17.** When "Don't know yet" is chosen on a vendor question at stage `explore` or `talk`, save `Who[code] = 'vendor'` at once.
   *Test:* `rm-2`, stage `explore`, P5 = `k`, box untouched → action sits under "Confirm with the vendor" and its vendor question is listed.
9. **F06, F33.** XL stays a must-have for high-risk uses in every country (owner's decision). When the country is Switzerland, United Kingdom or "Other", add the way-out answer **"We have checked: the EU AI Act does not apply to us"** (needs a note: who checked). Head the item list **"If the EU AI Act applies to you"** for those countries. Add Bulgaria, Estonia, Latvia, Lithuania, Romania, Slovakia, Slovenia to the country list; relabel "Other" as "Other (outside the EU)" with the stored value unchanged. No statement about EEA states.
   *Test:* `hr-2`, Switzerland, way-out chosen with a note → XL met; Germany → way out not offered.
10. **F11 (rule part).** For tools the AI Register labels high-risk, P5 ("Can staff overrule the tool…") and G3 ("…which outputs a person must check…") are must-haves. Reason line: "The team treats human control as a must-have for high-risk uses." Not extended to `sens` tools (B7).
    *Test:* `hr-2`, all else met, P5 = No → `stop`.
11. **F19.** T1 is exempt only when the tool's technology needs are "None". Legend: "Heavy (hardware, group platforms, agents acting across systems)"; remove "high legal risk" and "little set-up". Print the list of tools whose must-haves change into the build notes.
    *Test:* `rm-9` and `fa-7` have T1 as a must-have.
12. **F18.** Guest-facing = `arch` A2 or A4, or a `chat` / `transparency` label. Remove the department test. Answers stored for questions no longer asked are ignored, not deleted. Print the list of tools that gain or lose X2a.
    *Test:* `gx-1`, `gx-3`, `fo-2`, `fo-6`, `fo-8` do not get X2a; the chatbot `gx-2` still does. If any `chat`-labelled tool loses X2a, stop and report instead of shipping this item.
13. **"How this was worked out".** Add a "Changed in rules v4" list with one line per item 1–12, in plain words.
    *Test:* each of the 12 rule changes has a line; README "Rules" section matches.

#### A2. Wrong or misleading statements

14. **F10.** Both places: **"reworded after an internal wording review on 18 Nov 2026. Not yet reviewed by outside experts or tested with hotels."**
    *Test:* "expert review" has zero hits in the built pages.
15. **F08, F34, F35.** Remove the Swiss and UK labour notes and the Spanish-authority line on biometric clocks from hotel-facing pages and the PDF until verified. Strip article and annex numbers from labour notes and label reasons. `legal()` drops any text containing "to verify". Extend the test to `labour` and `why`.
    *Test:* "to verify", "Art.", "Annex" have zero hits in `legal()` output for all tools × all countries.
16. **F07.** Help text: **"A DPIA (data protection impact assessment) is a written assessment that data protection law requires before processing that is likely to put people at high risk. Your data protection contact decides whether this tool needs one."** Reason line: **"This tool handles sensitive personal data, so ask your data protection contact whether a DPIA is needed."** New answer: **"Checked: not required (confirmed in writing)"**, which counts as met with a note. Remove "the GDPR requires" and "a DPIA is needed"; name no national law.
    *Test:* `fo-1`, G2s = "Checked: not required" + note → met; the strings "a DPIA is needed" and "GDPR requires" have zero hits.
17. **F21, F20.** Show every high-risk item: the first eight, then "Show N more". Print "applies from 2 Dec 2027" (already in the tool, checked in audit 1) on the label line. No new sentence on tools already on the market; the existing item that covers it becomes visible again.
    *Test:* `hr-2` shows all 13–14 items; the date is on the label line.
18. **F22.** Replace the Swiss / UK example with: **"The EU AI Act reaches hotels outside the EU only in some cases. Ask your legal adviser whether it applies to you."**
19. **F09, J6, J23 (interim, see B2).** One flag `SHARE_READY = false`. Remove the placeholder sentence from the start page. The share panel reads: **"Sharing with the project team is switched off until the team has named who is responsible for shared data."** Outside the hub: **"Sharing works only inside the project hub."** No test copy is written. Withdrawing an existing shared copy still works.
    *Test:* "to be confirmed" has zero hits; no `db:set` is sent; withdraw works on the fixture.
20. **F23 (text ready for when sharing is on).** Replace "Anonymous" with "No hotel name unless you tick the box". List what is sent: tool, stage, role, hotel type, country, every answer, who you named for open questions, which must-haves have a note, the dated history of results. Add: "The copy is linked to the account you opened the hub with."
21. **F11, F29, J17 (wording).** Summary for the top level: **"You answered Yes to every must-have and added a note. Nobody has checked the notes."** Fix: "8 must-haves are not known yet."; "Answer at least one question in Skills."; lists joined with commas and one "and". Stage `live` never says "before you sign" or "Run a time-limited pilot".
22. **F16.** **"One must-have at No means 'Not ready yet', so get those answers first. Weak areas can also hold the verdict back."**
23. **F15 (interim, see B3).** Remove "about 15 minutes" in every place. Show: **"{N} questions, {M} of them must-haves. You will probably need to ask colleagues or the vendor."**
    *Test:* "15 minutes" has zero hits.
24. **F24, F25, F26.** PDF legal section prints the "label becomes … if" conditions and "Not a compliance verdict and not legal advice". Owner note: all conditions, or "and N more (see report)". Headings follow the stage ("before signing" / "before you go on using it").
25. **F27.** Tick-list lead-ins: "What this tool needs: people", "…skills", "…systems", "…data", "…written agreements". Options unchanged. The word "Tick" is gone.
26. **F28 (part).** Remove "most hotels are not there yet" and "integration is the bottleneck" from step subtitles and "(often missing)" from the tick item. Tool descriptions are not touched (C).
27. **F31, F32, F37, F38, F40, F41, F36 (interim).**
    - "How this tool is usually paid for: … (team's D6 resource sheet, not a price quote)".
    - Vendor question: "Who counts as the provider of this tool under the EU AI Act, you or a third party, and does the contract say so?"
    - "Nothing is open." / "at least two words" / "Please reply to each line".
    - README: add G2 and G2s to the no-"Doesn't apply" list; team view "Part of a group, run by the group"; hub tooltip "how the result was worked out"; code comment "98 tools".
    - D5b help: "If you have no data protection officer, this is whoever handles data protection for you, often an outside adviser."
    - Notice: "This page loads its fonts from Google and, for the PDF, a library from cdnjs. Both see your IP address."
    - PDF: if characters in the hotel name cannot be printed, say so next to the field before download.

#### A3. Journey and result page

28. **J11 (copy).** One word, "note", on every screen, PDF and team page (stored field names unchanged). Prompt: **"Where is this written down? One line, for your own report."** Hint in grey, red only after the person leaves the field with too little: **"Add at least two words, for example: Revenue manager, 4 hours a week"**. Result chip **"Yes, note missing"** (amber) under the heading **"Add a note to confirm"**. Step footer: "5 of 6 answered · 1 Yes needs a note".
    *Test:* no red text before typing; "proof" has zero hits on hotel-facing screens.
29. **J10, J25, J7 (part).** After the start screen the header is one line: "AI readiness check · {tool short name} · Step 1 of 6", with the text link "Your checks ({n})" on every screen. Project line: "A student project by EHL for HFTP · prototype".
    *Test:* first answer buttons above y = 420 px at 390×844.
30. **J2.** "Start" is always enabled. On click with something missing: scroll to the first missing item, outline it, show "Choose one to continue". Hint lists only what is missing ("Still needed: a tool · where you are with it"). "Your role" and "Country" are labelled "(optional)".
31. **J1 (part), J5, J9, J4.** "Before you begin" becomes one line: **"One AI tool at a time. You get a verdict and a to-do list by person."** Stage hint: **"We use this to tell you which questions can wait until you have a vendor."** Delete "Or close the page…" on prep. After a tool pick, focus moves to the "Selected" card and the stage question scrolls into view.
32. **J8.** Prep screen: summary line ("{N} questions, {M} of them must-haves. You will probably need: Finance (1), IT (3), …"), one "Copy questions" button per person, lists collapsed, primary button **"Start now"** at the top and the bottom.
    *Test:* prep is at most 2 screens at 390×844 with lists closed.
33. **J3 (part).** Search matches each word separately, ranks name matches above description matches, treats telephone = phone = voice, rota = roster = schedule, checkin = check-in, and shows "98 tools · 8 match". On phones the list grows with the page. The legend above the list is removed.
    *Test:* "chatbot" returns the chat assistant first; "rota" returns staff scheduling first; "telephone" and "checkin" return results.
34. **J17, J19, J20, V2, V7. Result first screen**, in this order:
    - Line 1 (grey): {tool} · {stage} · {date}.
    - Verdict sentence (28 px, tinted block):
      - `stop`: **"Not ready yet. {n} thing(s) to settle before you {sign / go on using it}."**
      - `open`: **"Not enough information yet. {k} must-have(s) to find out, {c} to confirm with a note."** (zero parts left out)
      - `pilot`: **"{verdict name, see B1}. All {M} must-haves are in place (your own answers, not checked). {g} smaller gap(s) to close during the pilot."**
    - One count line in the body typeface: "{met} of {M} must-haves done · {c} need a note · {k} to find out". On a return visit add "(was {old})".
    - **"Do these first"**: up to three items, unmet must-haves, then unconfirmed, then unknown, each as "**{Person}:** {instruction}".
    - Primary button: `stop` / `open` → **"Send the questions to the people who know"** (opens the copy-by-person list); `pilot` → **"Download the report for your owner (PDF)"**. Text links: "See all {N} items by person · Download the report (PDF)".
    - Vendor questions, legal note, owner note, reminder, sharing and method become collapsed rows. "Save as file", "Start a new check" and "Add to the AI Register" move to a "More" row at the foot, each with a short explanation.
    *Test:* at 1280×900 and 390×844 the verdict sentence, the count line and the primary button are on the first screen; exactly one primary button; every existing stable id still exists.
35. **J21.** Area bars show words, no percentages: "Strong" (75% or more), "Gaps to close" (40–74%), "Weak" (below 40%), "Too little to say" (fewer than half answered, no colour), each with "x of y answered". The points footnote moves into "How this was worked out". The summary never prints "below 40%".
    *Test:* no "%" on the result outside "How this was worked out".
36. **J18.** "Copy for IT" (role names are never lower-cased). Every group in the action plan is sorted by person. A must-have is listed once. Tick-list items read as instructions ("Put in place: …", "Find out whether this is in place: …").
37. **J26, J24.** Update page: must-haves first; an answered question stays in place, greyed, with a tick and "Undo", until the person leaves the screen. Heading: "{n} things are still holding the verdict back. {m} smaller gaps are below." The "Start a new check?" confirmation gets its own line.

**Cut line:** if the pass runs short, ship after item 27 plus A4 item 38. Items 28–37 and 39–40 go to the next pass in this order.

#### A4. Visual

38. **V1, V8, V10, V5, V11, J28 (minutes).** `#view{display:flex;flex-direction:column;gap:18px}`; `input[type=date]` styled like the other inputs; `#view:focus{outline:none}`; `max-width:68ch` on `.meta`, `ol.actions li`, `.gap .g1`, `.tight li`; "x of y answered" in its own right-hand column; share tick-box label as a 44 px row; "How this result was worked out", "Remove" and "Withdraw" at least 44 px high; on phones "Next" is full width with "Back" as a text link above it.
    *Test:* measured gap between panels is 18 px; no control under 44 px at 390 px with touch; no horizontal scroll.
39. **V3, contrast.** Selected answer = accent fill with a tick, not black. Unselected pill and input borders `#8A8F99`. Bar and progress tracks get a 1 px `#8A8F99` outline. Red, amber and green only on the result.
    *Test:* control borders at least 3:1 on white.
40. **V4, V6, V9, V12.** Question text 18 px / 600 and the only bold element on its card; "Must-have" as a small label on the question's own line; body 16 px, meta 14 px; 12 px capital headings become 14 px / 600 sentence case; status chips in a fixed-width column; PDF uses the screen's wording ("Action plan") and its file name uses the tool's short name instead of the internal id.

### B. NEEDS A HUMAN DECISION

| # | Question | Options | Council recommends | Safe interim built today |
|---|---|---|---|---|
| B1 | What is the top verdict called? (F11) | (a) "Ready to pilot" (b) "No blocker found: you can start a pilot" (c) "Ready for a trial" | **(b)**; for tools already in use "No blocker found for continued use". It states what was found and leaves the conclusion to the hotel, which fits the client's "make your own conclusions". | (b), set in one constant (`LEVELS.pilot.name`) so the owner can switch back in one line. The level key stays `pilot`. |
| B2 | Data notice: who is the controller, when are shared copies deleted, whom to contact? (F09, J6) | (a) the team supplies the three facts (b) sharing stays off | **(a)** before any hotel sees the tool; the facts come from the team with coach or HFTP, not from the agent. | Sharing off behind one flag; placeholder sentence removed; final notice text ready (item 20). |
| B3 | What does the tool say about time? (F15) | (a) no time, question count only (b) "About 10–20 minutes if you have the answers to hand (our estimate, not yet timed with hotels)" (c) time it with 3–5 managers, then state it | **(c)**, with (a) until then. An untimed figure is an unsourced number. | (a): question and must-have counts, plus "you will probably need to ask colleagues or the vendor". |
| B4 | Shorten the check? | (a) keep all questions (b) must-haves first with a result after 6–10 questions and the rest optional (audit 2, section 4) (c) drop vendor-only questions at early stages (J15) (d) cut questions (e) ask P6 / O5 by hotel type (F39) | **(b)** as the next pass, after 3–5 real managers have tried today's build; **(c)** with it; not (d) or (e) without hotel evidence. | All questions kept; shorter header, collapsed prep, a result that opens with three tasks. Start page says: "How the hotel is run only adds the owner-approval question for managed hotels." |
| B5 | Legal wording for D7 owner and lawyer (F07, F08, F20, F22, F35, J22) | Per line: restore after checking at source, reword, or leave out | Send the D7 owner the removed lines: Swiss and UK labour notes; Spanish view on biometric clocks; the rule for tools already on the market; the non-EU example; national law names for the DPIA; the plain-words legal sentence of J22. Restore each only once signed off. | Removed or made neutral (items 15–18); one line "Provisional label, awaiting legal sign-off. Not legal advice." stays. |
| B6 | Does a Yes without a note hold the verdict back? And is Partly on a must-have a stop? (F12, J11, F11b) | (a) note required for the top verdict (b) note optional, shown as "self-declared" (c) stricter proof (document name, date) | **(a)**: nobody checks the note, but it is the paper trail the hotel keeps. Decide after hotel tests whether Partly should be "not confirmed" instead of "not met". | Yes without a note = "not confirmed" → "Not enough information yet", never "Not met". Partly unchanged. |
| B7 | Extra must-haves for sensitive-data tools (P5, G3 for `sens`)? (F11) | (a) high-risk only (b) high-risk and sensitive | **(a)** until tested with hotels; each added must-have is a team judgement. | (a). |
| B8 | Tool names and descriptions (J3, F28) | (a) keep catalogue names (b) plain first line plus catalogue name, written by the catalogue owner (c) add "My tool is not listed" with a generic check | **(b)**, done in the catalogue so all hub tools match; (c) only with its own question set. | Better search, result count, legend removed; names and descriptions untouched. |
| B9 | Keep the start-page sentence "Not about how AI assistants find your hotel."? (J7) | keep / delete | Delete: it answers a question nobody asked. The owner's rule is only that nothing on that topic is added. | Left as it is. |

### C. DO NOT BUILD

| Finding | Ruling | Reason |
|---|---|---|
| Peer benchmark at the result (audit 3, table stake 3) | Rejected for now | No peer data exists; a benchmark from another sector would mislead. Say nothing rather than invent. |
| 0–100 score, maturity names, email gate, sales contact form (audit 3, section 4) | Rejected | Owner's decision and the tool's one advantage: it sells nothing. |
| Must-haves-first flow with an early result (audit 2, section 4; J15) | Deferred, B4 | 1 to 2 days (audit 2); changes the journey's state machine and which questions a stage asks. Too large for one pass with saved checks at stake. |
| Plain names for 98 tools, "Most checked" list, department chips (J3) | Deferred, B8 | Needs catalogue renaming across the hub; "most checked" has no usage data behind it. |
| "My tool is not in the list" generic check (J3) | Deferred | Needs a new question set and must-haves that nobody has written or tested. |
| Rewriting every tick-list item as a full question (J13) | Deferred | Dozens of items to write and check against D6; neutral lead-ins (item 25) fix the mismatch today. |
| Rewriting tool descriptions without outcome claims (F28, rest) | Deferred | Text belongs to the catalogue; each claim needs a source or removal there. |
| New legal sentences: tools already on the market (F20), non-EU example (F22), national law names (F07), plain legal line (J22) | Not built, B5 | Unreviewed legal claims; no lawyer and no D7 sign-off. |
| Asking P6 and O5 by hotel type (F39) | Deferred, B4 | Adds questions while the open decision is whether to shorten. |
| "Doesn't apply" behind a link, "Who can answer?" as text (J14); named clickable steps (J16); "change answer" on each action (J27) | Deferred | Useful, not urgent; each touches the flow tests. |
| Embedding a Unicode PDF font (F36); self-hosting fonts (F41) | Deferred | Page size and build changes; a warning and a notice line cover it today. |
| Hub green as the tool's accent (V13) | Deferred | A colour decision for all hub tools at once, not for one. |
| Sample result on the start screen; separate method page (audit 3) | Deferred | Do after this pass, from the new result screen and the updated "How this was worked out". |
| Stricter proof validation (F11b) | Rejected for now | No rule can tell a true note from a false one; honest labelling is the fix (B6). |
| Pricing vendor question for "any pricing tool" (F32, second half) | Deferred | No field marks a pricing tool yet. |
| Two tabs overwriting each other (CLEANUP, left alone) | Unchanged | Rare; not in the audits. |

### D. Top 5 improvements, ranked

1. The verdict stops being wrong or stuck: no "ready" with the personal-data way out on a recruiting tool, no dead end with zero open items, no single tick deciding (F01–F06, F11).
2. The tool stops saying untrue things about itself: "expert review", printed "to verify" notes, the DPIA rule, the placeholder data notice, "about 15 minutes" (F07–F10, F15).
3. A Yes stays a Yes: "Yes, note missing" instead of "Not met" (F12, J11).
4. The result opens with one sentence, three named tasks and the right button, with no percentages (J17, J19, J21).
5. People reach the first question: enabled Start with a pointer to what is missing, one-line header, collapsed prep, a search that finds "chatbot" (J2, J10, J8, J3).

### E. Risks of this build pass, and how to check for them

| Risk | Early warning sign | Check |
|---|---|---|
| A saved check breaks or silently changes verdict | Console error on load; "since last time" reports changes the hotel did not make | Open the v3 fixture (browser record and JSON file) on the new build; answers, notes and history identical; v3 snapshots labelled and not compared; old build kept in `backup-v3/`. |
| A rule change has a side effect on other tools | Tools change must-have count without being listed | Run all 98 tools × 3 hotel types before and after; diff question count, must-have count and the verdict for all-Yes and all-No; attach the diff to the build notes; a person reads the F18 and F19 lists. |
| A new legal claim slips in with a fix | New sentence containing "must", "requires", "applies" that was not in v3 | Diff every string returned by `legal()` and every help text, old against new; each new sentence must be listed in this ruling; send the diff to the D7 owner. |
| A removed statement survives somewhere (PDF, team page, copy texts) | Hit in a grep | Grep the built `index.html` and `team.html` for: "expert review", "to verify", "to be confirmed", "15 minutes", "Copy for it", "Anonymous", "a DPIA is needed", "Ready to pilot" (if B1 = b). Generate one PDF per verdict level and read page 1. |
| The result redesign breaks flows or ids | Flow tests or Playwright checks fail | 70 flow tests and the 54 Playwright checks from CLEANUP at 1280 px and 390 px; all stable ids present; one primary button per screen. |
| Sharing is off but a copy is still sent, or withdraw stops working | A `db:set` message in the hub frame test | Fake hub frame test: no `db:set`; withdraw of an existing copy sends `db:delete` once. |
| The pass runs out of time half-way through the result screen | Items 28–37 partly done | Respect the cut line; ship only whole items; list what was not built at the top of the build notes. |
| The tool still has not met a real hotel manager | No date for a test | After the build: paper or screen test with 3–5 managers (also open for the AI Act guide); time it; this settles B3, B4 and B6. |

**Open questions that would change the ruling:** whether real managers finish the check as it is (B4); who the data controller is (B2); what the D7 owner and a lawyer say about the removed lines (B5); whether the client wants a verdict word at all or only the list of what is open (B1).

---

## Advisors' key points

- **Contrarian:** verdict and statement fixes first, behind a new rules version; every proposed legal sentence is a removal unless the text is already in the tool.
- **Assumption-Ripper:** build what the repros prove, hold what rests on opinion or untested legal reading.
- **Expansionist:** the result's first screen and the "note missing" state are what make the tool worth forwarding.
- **Outsider:** fix every place where the tool says something untrue about itself or about my answer before making it prettier.
- **Executor:** tests first, rules v4, logic then text then CSS then journey, with a hard cut line.

**Most useful review comments:** shared copies must show the rules version they were made with, and the v3 build must be kept as a rollback (Contrarian); 104 passing tests alongside 82 findings means new tests must come from the audit's repros, not from the fixes (Assumption-Ripper); acceptance must be runnable, a named tool id and answer set for each rule and a zero-hit grep for each removed string (Executor).
