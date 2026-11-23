# Council: Readiness 2.0, the right tool built the right way?

Run 23 Nov 2026 under `.claude/skills/llm-council/SKILL.md`: five advisors in role, blind A–E peer review in shuffled order, Chairman verdict. All roles were written by one agent, each kept independent (a later advisor does not reuse an earlier one's points). Read-only review: nothing in `tools/` was changed (another agent is adding a PDF download to `tools/readiness-2/` at the same time).

**Read for this council:** `tools/readiness-2/README.md`, `CHANGELOG.md`, `CLEANUP.md`, `src/content.js`, `src/flow.js`; the five screenshots in `reports/readiness-2-screens/`; `research_notes/AI starting point/research.md`; `tools/readiness-check/README.md`; `tools/ai-act-guide/README.md`; the catalogue data inlined in `tools/readiness-2/index.html`; `tools/hub/hub-bar.html`; `tools/assessment/README.md`; `docs/PROJECT_CONTEXT.md`; `reports/audit-readiness/3_benchmark.md`; `reports/Council - readiness check audit.md`.

---

## Brief (given to every advisor)

**Decision.** Is Readiness 2.0 the right tool, built the right way, and what should change before hotel managers and HFTP see it?

**What it is.** A hub tab (built 23 Nov 2026, not yet tested with managers, not yet published) for hotel managers who know nothing about AI. Step 1a: five Yes/No/Not sure questions ("Is this an AI problem?"); Q1 No stops on "This is not an AI problem." Step 1b: pick a use case from the 99-use Use-Case Catalogue, or "None of these fits". Step 2: ten prerequisites. Step 3: nine success factors. Both on the readiness check's scale (Yes · Planned, not done yet · Partly · No · Don't know yet). Summary: verdict, counts, "Start with these three", actions by person, no score, hand-over of one use case to the Readiness check.

**Owner decisions (may be questioned, explicitly):** the name "Readiness 2.0"; tab placed before "Readiness check"; Q1 No stops; Q2–5 No do not stop; steps 2–3 on the readiness scale; hand-over to the readiness check; Q1 worded "Is this job too varied to write down as fixed rules (if this, then that)?".

**Constraints.** No 0–100 score. Every figure carries its source and base. No Wikipedia, never cite AIHA. The client (HFTP) wants evidence that lets people "make your own conclusions", likes useful tools, and warned that advice goes out of date fast. Readers are both AI experts and hotel people new to AI.

---

## Step 1: five advisors

### Contrarian

What fails first is the logic of steps 2 and 3, not the design. Step 2 asks "Have you signed a data processing agreement with the vendor of this tool?", "Has it been confirmed in writing that the tool can read from and write back to your hotel systems?" and "Does the contract say how you get your data back?" of a person who, one screen earlier, was asked whether their *problem* is even an AI problem. They have no vendor and no contract. Honest answers are No or Don't know yet, so almost every first-time user gets the overall line "Close these before you talk to vendors" for items that can only be closed *by* talking to vendors. The summary screenshot shows exactly this: the top three are the DPA, the exit clause and leadership. A GM reads that as a contradiction, and an HFTP reviewer will spot it in a minute.

Second failure: Q1 as the only hard stop. A revenue manager who prices with rules today ("raise 10% above 80% occupancy") answers No to "too varied to write down as fixed rules?" and is told pricing is "not an AI problem", while revenue management systems are among the most bought AI tools in hotels. The catalogue itself lists "AI rate parity monitoring" (#96) while the research uses "flagging when an OTA price is below the direct price" as Q1's No example. The tool contradicts its own catalogue.

Third: length and repetition. 5 + 1 + 19 answers, then the readiness check asks 16 of those 19 again (same codes T1, D1, D5a, P1, F1, T3, G4, T5, F3, O2, O1, X1, P2, G1, G3, D4), with nothing carried over.

**Key point:** steps 2–3 ask tool-and-contract questions before there is a tool, so the summary's advice is self-contradictory for nearly every first-time user.

### Assumption-Ripper

1. *Managers start from a problem.* Many start from a vendor pitch or a peer's tool. The start screen says "Think of one problem in your hotel"; nothing helps the person who arrives with "a vendor showed me a chatbot". Unknown how many; the manager test should find out.
2. *A non-expert can answer Q1.* Q1 is the AI Act's definition question (inference vs rules). The Commission's own guidelines, C(2025) 5053, para 6, say the definition "should not be applied mechanically; each system must be assessed based on its specific characteristics". The hardest question in the tool is the only one that can end it.
3. *Q1 judges the job.* It actually judges how the person imagines the job. Every hotel job has an SOP, so "could you write it as rules?" invites No from well-run hotels.
4. *HFTP wants a gatekeeper.* The client asked for evidence and "make your own conclusions". "This is not an AI problem." is a conclusion made for the reader, with no way to see the reasoning except "Change my answers".
5. *"Readiness 2.0" reads as "start here".* "2.0" normally means "the new version of Readiness"; a reader may assume the Readiness check is obsolete. The tooltip says "Start here", but it is the third tab, after the AI Assessment (a team-internal interview scoring tool) and the Catalogue.
6. *All nine success factors are equally evidenced.* The research says culture rests on two abstracts and one quote; change management on one 107-leader global survey commissioned by an industry forum plus a change-management vendor (Prosci). The screen shows the same layout for all nine; the warning sits in a folded note.
7. *Eurostat's barrier figures describe hotels like this one.* Their base is EU accommodation firms with 10+ staff *that considered AI and did not use it*. The text says so, correctly; keep it.

**Key point:** the one make-or-break question rests on the assumption that a non-expert can apply a legal definition the Commission itself says must not be applied mechanically.

### Expansionist

The five questions in step 1a are the most valuable thing the team has built this month, and they are hidden inside a tab. They are, almost word for word, the "identifying opportunities" and go/no-go screen that D5 (AI Decision-Making Framework) is supposed to deliver, which the project status lists as "not yet started as a doc". Lift them into D5 as the framework's first gate, with their grounding table (AI Act, Commission guidelines, UK AI Playbook, NIST, Brynjolfsson & Mitchell, Google PAIR). That turns a prototype screen into a deliverable the client can quote.

Second use: steps 2 and 3 are a ready-made D6 "self-assessment checklist". A printable one-page version (the PDF being added now) is the thing a GM can bring to an owners' meeting, and the thing HFTP can put in a newsletter (D9) or on a conference slide (D10): "Five questions before you buy AI".

Third: the catalogue link. Each of the 99 use cases could show "Run the five questions on this use" from inside the Catalogue, so the catalogue stops being a list and becomes a door.

Fourth: the "None of these fits" answers are a research signal. Opt-in only (the readiness check's sharing rule), a free-text line "What is your problem?" would show the team which problems hotels have that the catalogue misses: interview material for D2/D3.

Fifth: HFTP's warning that advice dates fast is an opportunity, not a threat: the tool already prints "as of 23 Nov 2026"; a visible "evidence reviewed every six months" promise makes it a living HFTP asset instead of a student artefact.

**Key point:** the five questions are the missing first gate of D5; put them into the deliverables, not only into a tab.

### Outsider

I opened the hub and saw six tabs: AI Assessment, Use-Case Catalogue, Readiness 2.0, Readiness check, AI Act guide, AI Register. Which do I open first? "Readiness 2.0" and "Readiness check" sound like the same thing in two versions. If 2.0 is newer, why is 1 still there?

Question 1 now asks "Is this job too varied to write down as fixed rules?" In my world "too varied" sounds like a complaint, yet here Yes is the good answer for AI. I had to read it twice. And what is "the job"? I was told to "think of one problem", then asked about "the job", then "the tool", then "this tool's vendor". Problem, job, tool, vendor: four words for what I thought was one thing.

The stop screen is clear and polite, but I could not tell whether it is a fact or an opinion. It says "This is not an AI problem." in very large type, red. If I was unsure I would feel told off.

Steps 2 and 3 have 19 questions with codes like "T1", "D5a", "new (from T2)" in small grey type next to them. Those codes mean nothing to me. Also "PMS", "DPA", "DPIA", "works council" appear without a plain gloss on the question itself.

At the end I get "5 in place · 1 planned · 3 gaps · 1 to find out" twice and a long list. What I would actually take into Monday: three tasks and who does them. That part is good. I would cut the rest behind a fold.

What does "Readiness" even mean for someone who has not chosen anything? Ready for what?

**Key point:** a newcomer cannot tell the two "readiness" tabs apart or what "ready" means before anything is chosen; name the tab after the question it answers.

### Executor

Monday, in this order:

1. **Freeze showing it.** Nobody sends the hub link with this tab to HFTP or a manager until items 2–5 are done. The screenshots in `reports/readiness-2-screens/` still show the old Q1 wording; retake them before anyone uses them.
2. **Fix the pre-vendor wording (half a day).** Every step 2–3 question that names "this tool", "the vendor" or "the contract" either becomes a question about the hotel today, or moves to a closed list "Later, for the tool you choose" that is shown, not asked. That also cuts the length.
3. **Remove the duplicates inside the tool.** Data is asked three times (Q3, B3, C8), budget twice (B9, C1), success measure twice (Q5, C1's trial target). One question each.
4. **Q1 guard.** Add one hint line about judging the job, not today's method, and one line on the stop screen pointing to "Not sure". Keep the stop itself.
5. **"None of these fits"** must not end in a disabled button. Open the readiness check's start screen (it has free tool search) instead.
6. **Hide the codes** (T1, D5a, "new (from T2)") from hotel users; keep them in the fold or the team view.
7. **Manager test (owner books it).** Three to five managers, 30 minutes each, think-aloud: one chain GM, one independent GM, one revenue manager, one F&B or front-office head. Three scripted jobs (guest emails, pricing, pre-arrival email) plus their own problem. Record time, every Q1 answer, and ask "Which tab would you open first?" and "What will you do on Monday?"
8. **Stop** adding features (beyond the PDF already in progress) until the test is back.

**Key point:** fix the pre-vendor wording and the duplicates this week, then put it in front of five managers before HFTP sees anything.

---

## Step 2: blind peer review

The five answers were relabelled for review in this shuffled order: **A = Executor, B = Outsider, C = Contrarian, D = Expansionist, E = Assumption-Ripper**. Each reviewer saw only A–E, without role names, and did not review its own answer.

### Review by the Contrarian (own answer: C)

- **Strongest:** E's point 2. Using the AI Act definition as a gate for laypeople, when the Commission says it must not be applied mechanically, is the deepest flaw; it also explains why the pricing false stop happens.
- **Weakest:** D. Lifting the five questions into D5 and the Catalogue spreads an unvalidated gate across the deliverables. If Q1 misfires in testing, the error is in four places instead of one. And a free-text "What is your problem?" field brings data-protection duties the tool now avoids.
- **Missed by all:** what happens to saved answers if steps 2–3 are restructured. `hftp-readiness2-v1` stores answers by item id; any item that moves or merges needs a migration, or returning users lose answers silently. Not published yet, so cheap now and expensive later.

### Review by the Assumption-Ripper (own answer: E)

- **Strongest:** C's observation that the catalogue lists rate parity monitoring as an AI use while the research uses the same task as Q1's No example. That is checkable evidence, not opinion, and shows Q1 judges the description, not the job.
- **Weakest:** A's step 3 assumes the duplicates are pure waste. Q3 (1a) asks whether AI makes sense at all, B3 and C8 ask what must be in place; the research put them in different sections on purpose. Merge the self-checks, but keep Q3 as a screening question.
- **Missed by all:** who the user is. The tool says "hotel managers", the summary assigns tasks to "GM / owner", "IT", "HR". In an independent 40-room hotel these are one person. Nobody asked whether the role split fits the hotels HFTP members run.

### Review by the Expansionist (own answer: D)

- **Strongest:** A, as a whole. A freeze plus a five-manager test is what turns this from a prototype into something HFTP can trust; it also produces the quotes D9 and D10 need.
- **Weakest:** B's wish to fold away most of the summary. The item-by-item list is what a department head actually uses; fold it, but do not cut it.
- **Missed by all:** the hand-over could carry answers, not just the use case. 16 of the 19 self-checks share readiness-check codes; prefilled "from your starting point, please confirm" answers would remove most of the repetition C complains about, and make the two tabs feel like one journey instead of two competing ones.

### Review by the Outsider (own answer: B)

- **Strongest:** C's DPA example. Even I, knowing nothing, can see you cannot sign a contract with a vendor you have not chosen.
- **Weakest:** E's point 4 feels like it wants to remove the stop altogether. For a newcomer a clear "no, not this" is useful; the problem is the tone and the certainty, not the stop.
- **Missed by all:** the hub's first tab is the "AI Assessment", which the team uses to score interviews. A hotel manager who opens the hub lands on a team tool. That makes the "Start here" tooltip on the third tab even more confusing. Either the hub opens elsewhere for outside readers, or they get their own link.

### Review by the Executor (own answer: A)

- **Strongest:** C's count: 16 of 19 self-checks repeat readiness-check codes with nothing carried over. That is the number to put in front of the owner, because it decides whether this is one journey or two.
- **Weakest:** D's six-monthly review promise. Nobody in a student team can own that after the project ends. Promise only the date stamp, which exists.
- **Missed by all:** what "done" means before HFTP sees it. Proposed: the pre-vendor wording fixed, the duplicates merged, the screenshots retaken, five managers tested with no Q1 false stop on the scripted pricing job, and every manager able to say which tab to open first.

---

## Step 3: Chairman's verdict

### 1. Verdict

**Go with changes.** The idea is right and the first gate is the best-grounded part of the hub, but steps 2–3 ask tool-and-contract questions before there is a tool, Q1 can stop people on mainstream AI jobs, and the name invites confusion with the Readiness check; fix these and test with five managers before HFTP sees it.

### 2. Where the council agreed

- A "before you buy" first step is missing from the hub and worth having; the five questions are well sourced and could anchor D5 (all five).
- Steps 2–3 contain questions only answerable once a vendor exists (DPA signed, written PMS confirmation, exit clause, vendor security, outputs to check, staff demo, review date). As built, almost every first-time user is told to close items before talking to vendors that need a vendor to close (Contrarian, Executor, Outsider, Assumption-Ripper's review).
- Q1 can produce false "not AI" stops: pricing done by rules today, and the catalogue's own rate-parity use (#96) against the research's No example (Contrarian, Assumption-Ripper, both reviews).
- Two "readiness" tabs confuse; "2.0" reads as a replacement version (Outsider, Assumption-Ripper, Executor).
- Too long for a first step and repetitive: data asked three times, budget and success measure twice, and 16 of 19 self-checks asked again in the readiness check (Contrarian, Executor, reviews).
- No score, sources and bases next to every figure: keep (all).
- Test with real managers before HFTP (all).

### 3. Where it disagreed, and the ruling

| Disagreement | Ruling |
|---|---|
| Keep the Q1 hard stop (Outsider review) or loosen it (Assumption-Ripper) | **Keep the stop (owner's decision stands).** Reduce false stops with a hint line and a pointer to "Not sure". The headline's certainty goes to the owner (B2): "This looks like a job for rules, not AI." states a finding, which fits the client's "make your own conclusions". |
| Merge Q3 into B3/C8 (Executor) or keep it (Assumption-Ripper review) | **Keep Q3 as a screening question; merge B3 and C8 into one self-check.** They do different jobs: Q3 asks if AI makes sense at all, B3/C8 what must be in place. |
| Spread the five questions into D5 and the Catalogue now (Expansionist) or wait (Contrarian review) | **Wait for the test, then do it.** Put them into the D5 draft as text now (cheap, reversible); no Catalogue integration before the manager test. |
| Fold most of the summary (Outsider) or keep the item list (Expansionist review) | **Keep the list, closed by default** below the verdict and "Start with these three". |
| Six-monthly evidence review promise (Expansionist) | **Do not promise it.** Keep the "as of" date. Nobody owns the review after the project ends. |
| Free-text "What is your problem?" for "None of these fits" (Expansionist) | **Not now.** It brings data-protection duties the tool avoids today. Reconsider only together with the opt-in sharing rule. |

### 4. Risks to watch

1. **False "not AI" stops.** Warning sign: in the test, any manager answers Q1 No for the scripted pricing or demand job, or anyone says "but our vendor calls it AI" on the stop screen.
2. **Two-tab confusion and fatigue.** Warning signs: a manager cannot say which tab to open first; time to the summary over about 15 minutes; drop-off in step 2; "didn't I just answer this?" in the readiness check.
3. **Credibility with HFTP and experts.** Warning signs: a reviewer asks how a DPA can be signed before choosing a vendor; an expert challenges Q1 as a legal test; old-wording screenshots in circulation; thin-evidence factors (culture, change management) read as equal to Eurostat-backed ones.

### 5. Next steps

**(a) BUILD NOW** (after the PDF work in `tools/readiness-2/` is finished, not in parallel; run `build.mjs` and all three test files after each change; update README and CHANGELOG)

1. **Q1 hint**, appended to the current hint: "Judge the job, not how you handle it today. If you use rules now only because nothing better was available, for example price rules, answer Not sure."
2. **Stop screen**, one line under "Instead": "If a vendor offers you an AI tool for this job, ask what the AI does that a rule could not. If you are unsure, change your answer to Not sure: it becomes something to find out." Headline and the two buttons unchanged.
3. **"None of these fits"**: do not disable the hand-over. Button text "Open the readiness check"; it opens the readiness check's start screen (tool search) with no use preselected. Summary line: "No use case in the catalogue matches. The readiness check needs a tool: when a vendor offers you one, search for it there."
4. **Hide question codes** (T1, D5a, "new (from T2)", "new question") from the hotel's view; keep them in the "What good looks like and evidence" fold as "Readiness check question T1".
5. **Visible evidence strength** on each success factor, one short line under the name, not only in the folded note. Culture: "Evidence: thin. No large European hotel survey measures it." Change management: "Evidence: one hotel survey (107 leaders, worldwide, commissioned by an industry forum) and a change-management consultancy." Label Prosci as "change-management consultancy" next to its figure.
6. **Hand-over honesty line** on the summary: "The readiness check asks some of these again, for the tool itself. Your answers here are not carried over yet."
7. **Glosses** on first use in a question: PMS ("your booking system"), DPA, DPIA, works council (staff representatives).
8. **Retake the screenshots** in `reports/readiness-2-screens/` (they show the old Q1 wording).
9. **Hub tooltip** for "Readiness check" (in `tools/hub/hub-bar.html`, outside the busy folder): "For one tool you are about to buy or already use".

**(b) NEEDS THE OWNER'S DECISION**

| # | Question | Options | Recommendation |
|---|---|---|---|
| B1 | Name of the tab (questions the owner's "Readiness 2.0") | (a) keep "Readiness 2.0" (b) "AI starting point" (the research's own name) (c) "Is AI the answer?" | **(b).** "2.0" suggests the Readiness check is outdated; a tab named after its question needs no tooltip. |
| B2 | Stop headline (questions the owner's wording, not the stop) | (a) keep "This is not an AI problem." (b) "This looks like a job for rules, not AI." | **(b).** Same stop, same buttons; it states a finding instead of a ruling, as the client asked. |
| B3 | Scope of steps 2–3 (questions "all 10 + 9 asked") | (a) keep 19 asked (b) ask only what a hotel can answer today, show the tool-level items as a closed list "Later, for the tool you choose: the readiness check asks these" (c) drop steps 2–3 and hand over after 1b | **(b).** Asked now: older systems (B2), data location merged with one fact source (B3+C8), connectivity (B4), named owner (B8), budget merged with trial target (B9+C1), fallback (B10), workflow (C2), leadership (C3), skills (C5), AI-use rules (C6): ten questions. Shown later: B1, B5, B6, B7, C4, C7, C9. Needs a storage migration (`hftp-readiness2-v1`), new ranking order and tests. |
| B4 | Carry answers into the readiness check | (a) no (b) prefill overlapping codes, marked "From your starting point: please confirm" | **(b), after the manager test.** It needs readiness-check changes and a hub contract. |
| B5 | Tab order and landing tab | (a) as now (b) move it before "Use-Case Catalogue" (c) also give outside readers a link that opens on it, not on the team's AI Assessment | **(b) and (c).** Step 1b uses the catalogue, and a manager should not land on a team scoring tool. |
| B6 | Order of 1a and 1b | (a) questions, then use case (b) use case first | **(a) for now; test (b)** with one or two managers who arrive with a vendor pitch. |

**(c) DO NOT DO**

- No score, percentage or maturity level (owner's decision, earlier council).
- No new questions to fill the weak-evidence factors, and no citing McKinsey or BCG figures the research could only see in search summaries.
- Do not remove the Q1 stop or let any route pass it.
- Do not merge Readiness 2.0 into the readiness check before the manager test.
- Do not show it to HFTP before the test and the BUILD NOW items.
- No free-text problem field and no six-monthly review promise.
- Never use or cite AIHA material for the gap or the evidence.

**Monday morning:** the owner decides B1–B3 (15 minutes); the builder does items 1–9 once the PDF work lands; the owner books three to five managers for a 30-minute think-aloud (chain GM, independent GM, revenue manager, front office or F&B head) with three scripted jobs (guest emails, pricing, pre-arrival email) plus their own problem. Done before HFTP means: no Q1 false stop on the pricing job, every manager can say which tab to open first, time to summary noted, and "What will you do on Monday?" answered from the summary.

### 6. Open questions

- Does HFTP want a gate ("not an AI problem") or evidence only? One line to the client would settle B2.
- How long will a GM spend on a first-step tool? Not yet timed with anyone.
- Who uses it in a 40-room independent hotel, where GM, IT, HR and finance are one person? The task-by-role lines may need an "if you are one person" view.
- Do managers arrive with a problem or with a vendor pitch? This decides B6.
- Should the D5 framework adopt the five questions as its first gate? Needs the team's agreement, not only the tool owner's.

---

## Advisors' key points

- **Contrarian:** steps 2–3 ask tool-and-contract questions before there is a tool, so the summary's advice contradicts itself for nearly every first-time user.
- **Assumption-Ripper:** the only make-or-break question asks a non-expert to apply a legal definition the Commission says must not be applied mechanically.
- **Expansionist:** the five questions are the missing first gate of D5; put them into the deliverables, not only into a tab.
- **Outsider:** a newcomer cannot tell the two "readiness" tabs apart or what "ready" means before anything is chosen.
- **Executor:** fix the pre-vendor wording and the duplicates this week, then test with five managers before HFTP sees anything.
