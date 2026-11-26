# Council: "Can AI solve your problems?" v2.8.0: ready to be the final public version?

Run 25 Nov 2026 under `.claude/skills/llm-council/SKILL.md`: five advisors in role, blind A–E peer review in a shuffled order, Chairman verdict. No subagent tool was available in this session, so one model wrote every role in turn, each without reusing an earlier role's points. Read-only: nothing in `tools/` was changed and nothing was committed. This file is the only output.

**Read for this council:** `CLAUDE.md`, `docs/PROJECT_CONTEXT.md`; `tools/readiness-2-questions/README.md`, `NOTES.md`, `CHANGELOG.md` (v2.7.0 to v2.8.0), `spec/review/CLAUDE_PROMPT_v2.8.md`, `spec/review/live_review.md`, `spec/PROMPT_QUESTIONS_ONLY.md`; `src/page.html`, the download, storage and copy code in `src/app.js`, strings in `src/content.js`; screenshots in `reports/readiness-2-questions-screens/v28/` (cover, hr-1 result, rm-2 result, download blocked, Your checks at 360, step-5 sources at 360).

**Run locally for this council** (`tools/` served on 127.0.0.1:8901, Playwright in Chromium, scripts in the scratchpad, server stopped after). This is the route the tool takes when hosted outside claude.ai (`window.claude` absent):

| # | Run | What happened |
|---|---|---|
| 1 | 1280×800, plain tab: gx-2, step-2 Return No, must-haves 3 Yes / 3 Planned / 4 No, step-5 mixed | **Not ready yet · Score: 47%**, "Also: … (Return: No)" in the box, action 1 "Settle this first: … Return". **Download result (PDF)** (89 KB), **Download answers (PDF)** (66 KB) and **Save as file** (JSON) all arrived as files through the blob link. 0 console errors, **0 requests to any other host**. 12 links on the result page, all `https`, all `target="_blank" rel="noopener"`, none to claude.ai. |
| 2 | 360×740 with localStorage and sessionStorage throwing (strict privacy settings, some embeds) | Cover: "This browser is not keeping your answers … Use Save as file (or Copy saved check) before you close the page." The run completes to **Ready to start a pilot**; no errors. But **Save as file exists only on the result page and Copy saved check only on the result and stop pages**, so on steps 1 to 5 the banner points to buttons that are not there. |
| 3 | 360×740, Q1 Yes | Stop screen: "This is not suitable for AI." with Change my answers, Start again, Download (PDF), Copy saved check, Open printable page. Reloading the page reopens the stop screen (resume works). |
| 4 | Accessibility spot checks | `lang="en"`; every input labelled; step-2/3/5 answers are radios in `fieldset` + `role="radiogroup"` with `aria-labelledby` (no `legend`, acceptable); arrow keys move and keep focus; focus outline 2 px solid; focus goes to `#view` on each step. **Steps 1 to 5 have no `h1`** (cover and result do). Inline source links are 15–19 px tall (inline links are exempt from the 24 px target rule). No horizontal scroll at 360 px on any step. Dark mode is styled. **The PDFs are untagged** (jsPDF), so screen readers get no structure. |
| 5 | Names a stranger sees | Header "Can AI solve your problems?", but the browser tab reads "Can AI solve your problems? (use-case questions v2.8)" and the files are named **`Do-you-need-AI_Test-Hotel_2026-11-25_result.pdf`**, `…_answers.pdf`, `Do-you-need-AI_….json` (file kind `hftp-do-you-need-ai`). |
| 6 | Wording on the result (gx-2 run) | "Because 4 must-haves are missing: …" then "The top verdict needs every must-have at Yes: 7 are still open." (4 No + 3 Planned; the two numbers sit two lines apart with different words). Under "Ask an adviser before a pilot" (hr-1) the sub-line reads "Step 4: Where in the hotel?". |
| 7 | Saved file contents | `{ kind, v, version: "2.8.0", rules: "v2.6 (24 Nov 2026)", savedAt, check }`; `check` still carries the hub-era fields `share`, `sharedAt`, `sharedMode`, `sharedSig` (empty). |

**Other facts the council worked from**

| Fact | Where |
|---|---|
| Outside claude.ai the download route is the blob link; it always toasts "Download started: <name>" and cannot detect a silent block (in-app browsers such as WhatsApp, LinkedIn or Instagram webviews, some iOS cases). The "No file arrived?" row (Copy plan, Copy saved check, Open printable page) is always shown on the result page, so there is a way out. | `src/app.js` `saveFile`, `fallbackRow` |
| Inside claude.ai the page uses `window.storage` when present. Whether that store is in the browser or on Anthropic's side is not documented in the repo; the page says "Your answers stay in this browser." in both cases. | `src/app.js` l.47–51, `page.html` footer |
| Cover facts: Eurostat 70% / 46% with the dataset link; "98 use cases in 15 departments" (from the data); "Six to twelve questions"; the disclaimer; no statement of how long the check takes; no statement of who runs the page beyond "A student project by EHL for HFTP · prototype" and the footer "Student prototype by EHL SBP Group 36 for HFTP"; no contact. | cover text, footer |
| Step 4 is a three-level pick (area › department › use case) over 98 use cases, with no search; "None of these fits my problem" exists. `#use=<id>` preselects a use case. | `src/app.js` |
| Step 2 card title "Needs judgement" sits over the question "Can each case be fixed with an “if this, then that” rule?" (Yes stops). The result card now shows Met / Not met with "Your answer: …" (B5 done). | screenshot `step2-1280.png`, result text |
| Sources: badges "Credible (7+)", "Below 7", "Not scored", "Partial"; thin-evidence line on 63 use cases. Source texts are shown as given, so some entries show the URL twice (as the linked title and again after "|"), and some carry "score 8/10" inside the text beside the badge. | `step5-sources-360.png` |
| Still open from earlier councils and the project status: the five timed manager sessions; the data-notice facts; HFTP's written yes for anything public; no one outside the team has used this tool. | `docs/PROJECT_CONTEXT.md` |
| No AIHA mention, no Wikipedia link in the tool text. | grep over `index.html` |

**Settled owner decisions (not re-litigated):** no "Don't know yet" on steps 3 and 5 (step 2 keeps Yes / No / Not sure); no legal content in tool text (only the disclaimer and the sensitive-area flag); sources copied as given; the header and step-2 heading; two report downloads on the result page; question data and sources are the owner's single source of truth; scoring unchanged since v2.6. Where one of these causes a real problem it is put to the owner below, not overruled.

---

## Brief (given to every advisor)

"Can AI solve your problems?" v2.8.0 is a single 1.2 MB HTML file (no external requests) that takes a hotel manager through: hotel profile → five "should AI do this?" questions (Q1 Yes stops) → ten must-haves → pick one of 98 use cases → 6 to 12 use-case questions → a verdict (four levels), a score, "start with these three", an action plan by person, vendor questions, two PDFs and a JSON file, with Copy and Print fallbacks. Answers live in localStorage (memory if blocked). It is published as a claude.ai artifact; the owner wants v2.8.0 to be the **final** version and to host it **publicly** for external hotel managers using it alone. Built by an EHL student team for HFTP; not yet tested with any real manager. Outside claude.ai the downloads run through a blob link and worked in Chromium; Safari, Firefox, iOS and in-app browsers were not tried. Settled: the answer options, no legal content, sources as given, scoring, the two PDFs, the owner's data. Question: is v2.8.0 ready to be the final public version, and what must change first?

---

## Step 1: five advisors

### Contrarian

The first thing to fail is not code, it is the first stranger. Nobody outside the team has run this tool. Every fix since v2.0 came from councils and the team's own reviews; the five timed manager sessions have been "still open" for two days and four versions. Calling the untested version "final" freezes the guesses in: the cut-offs, the 98-item picker, the 27-question length.

Second: storage blocked is a trap. The banner says "Use Save as file (or Copy saved check)", but on steps 1 to 5 neither button exists. A manager in a hotel's locked-down browser answers 20 questions, closes the tab, and loses everything after being told how to save.

Third: downloads outside claude.ai. The blob link always says "Download started". In a WhatsApp or LinkedIn in-app browser, where a link shared by HFTP will often be opened, nothing arrives and the tool still says it started. The "No file arrived?" row helps only if they look for it.

Fourth: the names. The person downloads "Do-you-need-AI_….pdf" from a page called "Can AI solve your problems?". Two names for one tool look like two tools, or a copied file.

Fifth: a public page with HFTP's name and no contact, no publisher and no data line. If a manager asks "who is behind this and where do my answers go?", the page cannot answer, and HFTP has not said yes in writing.

How bad: not a disaster, a quiet loss of trust on first use, which is all a public tool gets.

**Key point:** the tool has never met a real user, and the storage-blocked banner sends people to buttons that are not there.

### Assumption-Ripper

1. **"The claude.ai version and the hosted version are the same tool."** False in two places: downloads (capability vs blob link) and storage (`window.storage` vs localStorage). The hosted route was tested in one browser engine only.
2. **"Your answers stay in this browser" is true.** True when hosted with localStorage. In claude.ai, `window.storage` is used when present and nobody in the repo has confirmed where it keeps data. The sentence must be true wherever the file runs.
3. **"Final means done."** The owner's data says the cut-offs are "not tested with hotels" and the footer says "prototype". A final version that calls itself a prototype is a contradiction a stranger will notice.
4. **"Strangers will find their use case."** 98 items in three levels with no search assumes the manager thinks in the catalogue's departments. "We answer the same guest emails all day" could sit under Guest Experience, Reservations or Front Office.
5. **"A single score is understood."** "Score: 47% of points from all questions" beside "Not ready yet" works because the must-haves line comes first (B3). It assumes the manager reads the bold line before the big number. Untested.
6. **"Sources as given are readable."** Shown as given, some entries repeat the URL and carry "score 8/10" inside the text beside the badge. A hotelier may read "score 8/10" as a rating of the vendor.
7. **"HFTP is fine with a public page in its name."** No written yes is recorded; the AI Act guide had the same open item.
8. **"PDFs are the deliverable."** They are untagged, so a screen-reader user gets nothing structured. Acceptable only if the on-screen result is the primary output and says so.

**Key point:** the claim "same tool, now public" rests on one browser and an unverified sentence about where answers are kept.

### Expansionist

The hard part is done: one self-contained file, no external requests, working downloads outside claude.ai, honest source labels. That is rare for a student tool and is exactly what HFTP can put in front of members.

Bigger uses this unlocks:
- **Deep links.** `#use=gx-2` already preselects a use case. Every HFTP article, the catalogue, the D4 booklet and the conference slides (D10) can link straight to "check this use case for your hotel". That turns the report into something a manager acts on.
- **The interview programme.** The team is interviewing chains, independents and start-ups now. Running this tool live in two or three of those interviews is the manager test that is still missing, at zero extra cost.
- **Data for D2 and D3.** If HFTP later wants, an opt-in "send my anonymous result to the research team" would give chain-vs-independent and tier data. Not now: sharing is off, and the data notice is not written. But design the file format so it can.
- **Vendor questions as a product.** The per-use-case vendor questions are the most reusable part: a one-page "questions to ask before you buy" per department is a natural HFTP insight-series piece (D9).
- **Versions after "final".** Treat v2.8 as "1.0 public", with a visible "last updated" and a feedback address, so later versions are improvements, not corrections.

**Key point:** the deep links and the interviews already in the diary turn this from a standalone page into the report's action layer and its missing user test.

### Outsider

I run a hotel and know nothing about AI. I open the link.

- The big title asks "Can AI solve your problems?" and the line under it asks "Is AI the answer, and is your hotel ready for it?". Fine. How long will this take? It does not say. I see "five steps" and "six to twelve questions" for step 5 only.
- Who made this? "A student project by EHL for HFTP · prototype." Is it official? Can I trust it? Who do I write to if something is wrong?
- Step 2, first card: title "Needs judgement", question "Can each case be fixed with an if this, then that rule?". The title and the question seem to point opposite ways. I answer Yes because my emails do follow rules, and I am stopped. Maybe right, but I did not see it coming.
- Step 4: 98 choices in areas and departments. I have to guess where "guest emails" sits.
- Result: "Not ready yet", "Score: 47% of points from all questions". Then "4 must-haves are missing" and, two lines later, "7 are still open". Which is it?
- "Must-haves", "pilot", "use case", "vendor": I can follow, the glosses help.
- I click Download. The file is called "Do-you-need-AI". Is that the same thing I just did?
- "Student prototype … the cut-offs are the team's judgement". Which team?

**Key point:** a stranger needs three things the page does not say: how long it takes, who stands behind it, and one consistent name.

### Executor

Monday morning, in this order:

1. **Do not call v2.8.0 final.** Call the public build v2.8.1 and plan it as "1.0 public" after the manager test.
2. **Code, one short session (owner of the build: whoever runs Claude Code):** one name everywhere (tab title, PDF and file names); fix the storage-blocked banner so the buttons it names exist on every step; change the blob-link toast so it points to Copy and Print; an `h1` on every step; the cover line with the question count from the data; the "7 still open" line split into No and Planned; drop the hub-era sharing fields from the saved file; a public build flag that skips `window.storage`, so "stays in this browser" is true.
3. **Test the hosted file in Safari (Mac and iPhone), Firefox, Chrome on Android, and a link opened from WhatsApp.** Record per browser: PDF arrives, JSON arrives, Copy works, Print works, reload keeps answers.
4. **Owner, this week:** write the three facts the page lacks: who publishes it, a contact address, and the one-line data notice. Ask HFTP for a written yes to a public page in its name.
5. **Team, next two weeks:** run three to five managers through it, timed, using the session kit that already exists. Use the interviews already booked.
6. **Pick the host:** a static host with HTTPS and a stable address (any static host works: the file makes no outside calls). Keep the claude.ai artifact as the team copy.
7. **Stop:** further content passes on questions or sources until the sessions report.

**Key point:** ship a v2.8.1 with seven small code fixes now, test it in four browsers and with three managers, then make it public.

---

## Step 2: blind peer review

Answers shuffled and labelled: **A** = Executor, **B** = Outsider, **C** = Contrarian, **D** = Expansionist, **E** = Assumption-Ripper. Each reviewer saw only A–E.

**Contrarian reviewing A, B, D, E.** Strongest: E's point 2, a page that says "stays in this browser" without knowing it is the worst kind of trust failure, because it is a promise. Weakest: D's opt-in data sharing; any talk of sending results before the data notice exists invites the exact trust problem E names. Missed by all: what happens when the owner changes a question after launch: saved files with old signatures will reopen with answers dropped, and a public user will not understand "This check was made with an older question list".

**Assumption-Ripper reviewing A, B, C, D.** Strongest: C's storage-blocked trap, because it was observed, not imagined. Weakest: A's "four browsers" is still an assumption about where managers open links; ask HFTP which channel it will use (newsletter, LinkedIn, WhatsApp) and test that one first. Missed: nobody asked whether a public "Ready to start a pilot" verdict from an untested tool exposes HFTP's name; the disclaimer covers legal requirements, not the verdict itself.

**Expansionist reviewing A, B, C, E.** Strongest: A's "1.0 public" framing; it lets the owner have a final version without pretending the guesses are tested. Weakest: C's "quiet loss of trust" is right in direction but overweights names; a file name will not stop anyone. Missed: the step-4 picker is the main point of friction and also the main upside: a search box over the 98 plain names would fix B's "where is guest email" and help deep-link users.

**Outsider reviewing A, B, C, D.** Strongest: A's list, because each item is something I would notice in the first minute. Weakest: D's vendor-question booklet; interesting, but not what I need to finish this check. Missed: a "how long" line can be honest without inventing a time: give the number of questions, and let the sessions give the minutes.

**Executor reviewing B, C, D, E.** Strongest: B's three missing facts (time, who, one name); all three are cheap. Weakest: E's point 5 (score misread) is a hypothesis only the sessions can settle; no code change should chase it now. Missed: the stop screen. A stranger stopped on Q1 has a PDF and Copy saved check but no "send this to my team" text; low priority, but it is the screen most strangers reach first if Q1 confuses them.

---

## Step 3: Chairman's verdict

### 1. Verdict

**Go with changes, but not as "final" and not public yet.** The file itself is sound for hosting outside claude.ai (no outside requests, downloads and storage work in Chromium, no horizontal scroll, labelled controls), but it has never been used by a stranger, three trust facts are missing (publisher, contact, data notice), and two small code faults would hit a public user in the first minutes (the storage-blocked banner, the two names). Ship v2.8.1 with the BUILD NOW list, test it in the browsers HFTP's readers use and with three to five managers, then publish it as the public 1.0.

### 2. Where the council agreed

- The storage-blocked banner names buttons that are not on the page (C, E, A; seen in run 2).
- One name for the tool everywhere (B, C, A; run 5).
- The page needs a publisher, a contact and a one-line data notice before it is public (B, C, E, A).
- "Stays in this browser" must be made true for the hosted build (E, A, Contrarian's review).
- The manager sessions are the missing test and the interviews already booked are the cheapest way to run them (D, A).
- Downloads outside claude.ai work in Chromium; other browsers and in-app browsers are untested (E, C, A).

### 3. Where it disagreed, and the ruling

| Disagreement | Ruling |
|---|---|
| "Final" now (owner's wish) vs "1.0 public after the test" (A, D, E) | **1.0 after the test.** The tool says itself that its cut-offs are untested; final means "the version strangers use", which the sessions should shape. The code can be frozen now except for what the sessions find. |
| Step-4 search: BUILD NOW (Expansionist review) vs after the sessions (Executor) | **After the sessions**, as owner decision O4. It is the largest UI change on the list and the sessions will show whether the picker is really the friction point. |
| Opt-in result sharing (D) vs not now (Contrarian review) | **Not now.** Sharing stays off until the data notice is written and HFTP agrees. Recorded as a later option only. |
| Score misread (E) needs a fix vs only a hypothesis (Executor review) | **Hypothesis.** Watch it in the sessions; no change now. |
| Name fix: cosmetic (Expansionist review) vs trust (C, B) | **Fix it**: it is one line in code and costs nothing. |

### 4. Risks to watch

1. **Answers lost in a locked-down browser.** Early sign: a session participant or a hotel IT department reports "it forgot everything"; the "not keeping your answers" banner appears in a session.
2. **No file in in-app browsers or on iPhone.** Early sign: in the browser test, a PDF opens as a preview that cannot be saved, or nothing happens from a WhatsApp link.
3. **A stranger stopped on Q1 who should not have been.** Early sign: in the sessions, a manager answers Yes to Q1 for a task that needs judgement (the "Needs judgement" title over a rule question).

### 5. Next steps

1. **Monday:** apply BUILD NOW 1 to 9 below as v2.8.1 (Claude Code session; owner reviews screenshots). No change to scoring or the owner's data.
2. **Monday–Tuesday:** test the v2.8.1 file served from a plain static host in Chrome (desktop, Android), Safari (Mac, iPhone), Firefox, and a link opened inside WhatsApp and LinkedIn; one table: PDF, answers PDF, JSON, Copy, Print, reload.
3. **This week, owner:** write the publisher line, the contact address and the data notice (section d); ask HFTP for a written yes.
4. **Next two weeks, team:** three to five timed manager sessions with the existing session kit (`reports/Do you need AI - session kit.md`), using the booked interviews where the interviewee agrees.
5. **After the sessions:** decide O1 to O6, apply what the sessions show, publish as the public 1.0 on the chosen host; keep the claude.ai artifact as the team copy.

### 6. Open questions

- Where does `window.storage` keep data inside claude.ai? If it is not this browser, the footer line is wrong there today.
- Which channel will HFTP use to share the link (newsletter, LinkedIn, WhatsApp, member portal)? That decides which browser must be tested first.
- Does HFTP want the page under its own domain or brand? That changes the publisher line and the written-yes request.
- How long does a run take a real manager? Only the sessions can say; until then the cover gives the question count, not minutes.

---

## (a) BUILD NOW: code and UI only

None of these changes scoring, verdict rules, the answer options, the owner's question data or the source texts.

1. **One name for the tool.**
   - `src/page.html` `<title>`: `Can AI solve your problems?` (drop "(use-case questions v2.8)").
   - PDF and file names (`P.fileName` in `src/pdf.js`, used by `pdfName` in `src/app.js`): `Can-AI-solve-your-problems_<hotel>_<date>_result.pdf`, `…_answers.pdf`, `Can-AI-solve-your-problems_<hotel>_<date>.json`.
   - Keep the file `kind` value `hftp-do-you-need-ai` (opening old files depends on it); it is not shown.
   - Update the tests that match the old file names.
2. **Storage-blocked banner points to buttons that exist.**
   - When storage is `blocked`, show a **Copy saved check** button inside the banner on every step (cover, steps 1 to 5, result, stop), using the existing `copy-saved` action.
   - Banner copy (`NOT_SAVED` in `src/content.js`): "This browser is not keeping your answers: they are only on this page until you close it. Before you close it, use Copy saved check below, or Save as file on the result page."
   - Test: with localStorage throwing, `#copy-saved` is present on steps 1 to 5.
3. **Hosted build does not use `window.storage`.**
   - Add a build flag (e.g. `PUBLIC=1 node build.mjs` writes `window.R2_PUBLIC = true`); when set, `WS` is `null`, so answers are only in localStorage or memory and the line "Your answers stay in this browser." is true.
   - The claude.ai artifact build is unchanged.
4. **Blob-link toast says what to do if nothing arrives.**
   - In `saveFile` → `viaLink` (`src/app.js`): "Download started: <name>. If no file appears, use Copy plan or Open printable page below."
5. **A heading level 1 on every step.**
   - Steps 1 to 5 and the stop screen: the step heading becomes the page's `h1` (now `h2`), with the same text and the same look (CSS keeps the size). Cover and result keep their `h1`.
6. **Cover: how much there is to answer, from the data.**
   - Under "Then go through five steps:", add: "In all, 21 to 27 questions, depending on the use case. You can stop and come back." The numbers are computed as 5 + 10 + the minimum and maximum question counts in `usecase_questions_only.json` (6 and 12), not typed in.
   - When storage is `blocked`, leave out "You can stop and come back."
7. **"Missing" and "open" on the result say the same thing.**
   - Replace "The top verdict needs every must-have at Yes: 7 are still open." with "The top verdict needs every must-have at Yes: 7 are not Yes yet (4 No, 3 planned)." (counts from `evaluate()`; drop the brackets part when one of the two is 0).
   - Same line in the Result PDF.
8. **Sub-line under "Ask an adviser before a pilot".**
   - Replace "Step 4: Where in the hotel?" with "Because of the use case you chose: <plain use-case name>".
9. **Saved file without the hub-era fields.**
   - `F.forFile` leaves out `share`, `sharedAt`, `sharedMode`, `sharedSig`; `cleanRec` still accepts them on open (old files keep opening).
   - Remove dead sharing strings that can no longer show (e.g. "The project team's copy of this check stays shared; you can still withdraw it.") after checking with a grep that no code path renders them.

Tests after the build: all Node suites and both browser scripts pass; add one browser run with storage blocked (item 2) and one with the public flag (item 3: `window.storage` stub present but unused).

## (b) Content proposals for the owner (not applied)

1. **Step 2, question 1 title.** The title "Needs judgement" sits over a question where Yes means "no judgement needed". Proposal: title "Rules can do it" (then Yes = rules can do it = stop), as the live review offered for B5. Or keep the title and add one line under the question: "Answer Yes only if a written rule could handle every case."
2. **"The team" for strangers.** Several lines say "the team's judgement", "the project team's analysis". Proposal: name it once on the cover ("the EHL student team that wrote this check, Nov 2026") and keep "the team" after that.
3. **"needed for n of the 90 use cases analysed (of 98)".** Still reads as two numbers to a stranger. Proposal: "In the team's analysis of 90 use cases, n need this."
4. **Footer "rules unchanged since v2.6".** Means nothing to a stranger. Proposal: footer "Version 2.8, 25 Nov 2026"; keep the rules version in "How this was worked out" only.
5. **Sources shown as given.** Some entries repeat the URL after "|" and carry "score 8/10" inside the text next to the badge. Proposal for the owner's data: drop the trailing "| URL" where the entry already has a link, and drop the "score n/10" text where the badge already says it. (Data change, so the owner's call; the UI could also hide a trailing "| <same URL>" without touching the data, see O5.)

## (c) Owner decisions

- **O1. "Final" or "1.0 public after the test"?** Council: publish v2.8.1 as the public 1.0 only after three to five manager sessions; freeze the code except what the sessions show.
- **O2. Keep "prototype" and "not tested with hotels" on the public page?** Council: keep both lines until the sessions are done (they are true); after the sessions, replace "not tested" with what was tested ("tried with n hotel managers, Dec 2026").
- **O3. Publisher, contact, data notice** (copy in section d). Owner to supply the name and address.
- **O4. Step-4 search box** over the 98 plain names (UI only). Council: decide after the sessions.
- **O5. Hide a trailing "| <URL>" in a source entry when it repeats the entry's own link** (display only, data unchanged). Owner decides, because the rule is "sources as given".
- **O6. Where to host** (static host, HFTP's site or the team's) and under whose name.

## (d) What must be true before public hosting

1. BUILD NOW 1 to 9 built, tests pass, and the build used for hosting is the public build (item 3).
2. **Browser table done** for the hosted file: Chrome desktop and Android, Safari Mac and iPhone, Firefox, and a link opened inside WhatsApp and LinkedIn. For each: Result PDF, Answers PDF, Save as file, Copy plan, Copy saved check, Open printable page, reload keeps answers. Any browser where no file arrives must at least show the "No file arrived?" row working.
3. **The page names its publisher and a contact**, and carries one data line that is true for the hosted build, e.g.: "Nothing you type is sent anywhere: your answers are kept only in this browser on this device until you remove them. Use Save as file to keep a copy." (Owner supplies the publisher and the address.)
4. **HFTP's written yes** to a public page in its name (scope changes need client, coach and team in writing, per the project plan).
5. **Three to five timed manager sessions done**, with the findings applied or recorded, and the time a run takes measured.
6. Hosted over HTTPS at a stable address; the file served as is (one file, no outside requests, which was checked: 0 requests in run 1).
7. Known limit stated in the hand-over notes, not on the page: the PDFs are untagged (jsPDF), so the on-screen result is the accessible version.

---

## Advisors' key points in one line

- **Contrarian:** the tool has never met a real user, and the storage-blocked banner sends people to buttons that are not there.
- **Assumption-Ripper:** "same tool, now public" rests on one browser and an unverified sentence about where answers are kept.
- **Expansionist:** deep links and the booked interviews turn this into the report's action layer and its missing user test.
- **Outsider:** a stranger needs to know how long it takes, who stands behind it, and one consistent name.
- **Executor:** ship v2.8.1 with small code fixes now, test in four browsers and with three managers, then go public.

**Most useful review comments:** ask HFTP which channel it will share the link on and test that browser first (Assumption-Ripper); a "how long" line can be honest by giving the question count and letting the sessions give the minutes (Outsider); a public "Ready to start a pilot" from an untested tool puts HFTP's name on an untested verdict, which the legal disclaimer does not cover (Assumption-Ripper).
