# Readiness check v4: build notes

*20 Nov 2026. Build pass on `tools/readiness-check/` after the three audits in this folder and the ruling in `reports/Council - readiness check audit.md`. Nothing was committed, pushed or published. Item-by-item status: `tools/readiness-check/CHANGELOG.md`.*

## Not built, at the top

- Ruling section C: nothing built (no peer benchmark, no score, no must-haves-first flow, no new tool names, no new legal sentences).
- Item 27, one line: the hub tooltip "how the score was worked out" is in `tools/hub/hub-bar.html`. Other tools' sources were off limits. Fix there: "how the result was worked out", then `node tools/build-hub.mjs`.
- Everything else in section A was built, items 0 to 40.

## What changed, in short

1. **The verdict is no longer wrong or stuck** (items 1–12). Rules v4. A check saved by the old build opens with the same answers, notes and history; its old result stays in the history, labelled "worked out with earlier rules", and is not compared.
2. **The tool no longer says untrue things about itself** (items 14–27): no "expert review", no printed internal notes, no placeholder data notice, no "about 15 minutes", a corrected DPIA text.
3. **A Yes stays a Yes** (items 5, 28): "Yes, note missing" in amber, with the note field on the result page too.
4. **The result opens with one sentence, one count line, three named tasks and one primary button** (items 34–36); areas are words, not percentages.
5. **People reach the first question sooner** (items 29–33): "Next" always works and points to what is missing; one-line header; closed prep lists; a search that finds "chatbot", "telephone", "check in" and "staff schedule".

## Owner's overrides, as built

| Override | Built |
|---|---|
| Sharing stays on | `SHARING_ON = true` in `src/check.js`. Placeholders replaced by: "Student prototype: a shared copy goes to the project team (EHL SBP Group 36). A deletion date and a contact address are not set yet; you can withdraw your copy at any time with the button below." (on the start page the last words are "on the result page"). No fact was invented. |
| Header sentence stays | "Is your hotel ready to adopt this AI tool? Not about how AI assistants find your hotel." is on the start screen. Other screens have the one-line header. |
| "Start a new check" in the top row | Beside the primary button; its confirmation is on its own line. |
| Verdict name in one constant | `PILOT_NAME` and `PILOT_NAME_LIVE` at the top of `src/logic.js`. Level key still `pilot`. |
| Legal-check questions stay | AI Act, data agreement, DPIA and staff-representative questions are all still asked. Only help texts and answer options changed, as ruled. |
| No score, no email gate, nothing on AI search | None added. |

## Measurements, before → after

Same script on both builds (`tools/readiness-check/tests/browser/measure.cjs`), 1280 px, counted as in audit 2 (a drop-down choice = 2 clicks; words = words on screen over the nine screens passed). The v3 figures for the fastest path match audit 2 exactly (12 / 2 / 6,104).

| Path | Clicks | Fields | Words on screen | Words on the result | Words before the first question |
|---|---|---|---|---|---|
| Fastest (hotel type, first tool, stage, Next through every step) | 12 → 12 | 2 → 2 | 6,104 → 4,428 | 1,409 → 867 | 2,990 → 2,217 |
| Realistic chatbot path (search "chatbot", three must-haves Yes with a note, the rest "Don't know") | 45 → 45 | 39 → 39 | 6,693 → 4,783 | 1,539 → 981 | 3,180 → 2,220 |

Clicks and fields did not move: the flow has the same screens, because shortening the check is ruling B4, not built today. About 1,800 of the words before the first question are the 98 tool names on the start screen. Other measurements at 390 x 844: first answer buttons at y = 359 px (was 636); prep screen 2.0 screens with lists closed (was 6.7); gap between panels 18 px (was 0); no control under 44 px.

## Lists for a person to read

### Item 11 (F19): tools whose must-haves change because of the two-way link (T1)

| Tool | v3 | v4 |
|---|---|---|
| rm-3 Competitor rate shopping & market intelligence with ML | not a must-have | must-have |
| rm-4 GenAI RM copilots & BI Q&A / price explanations | not a must-have | must-have |
| rm-9 AI rate parity monitoring and automatic price matching | not a must-have | must-have |
| fo-8 Lost-and-found logging and guest claim matching | not a must-have | must-have |
| gx-1 Review analysis and sentiment / guest-feedback analytics | not a must-have | must-have |
| gx-3 GenAI review response | not a must-have | must-have |
| hk-1 Multilingual task capture and staff messaging (voice/chat to task, translation) | not a must-have | must-have |
| me-2 Work-order triage, creation and asset register | not a must-have | must-have |
| me-5 Predictive maintenance - OEM-connected equipment (lifts, escalators, doors) | not a must-have | must-have |
| kc-2 Allergen handling and menu labelling | not a must-have | must-have |
| pr-5 Supplier price comparison, benchmarking & contract-price compliance | not a must-have | must-have |
| fa-7 Chargeback dispute automation | not a must-have | must-have |
| hr-3 Onboarding and training (GenAI course creation, AI coaching, microlearning) | not a must-have | must-have |
| gm-2 GenAI copilots and enterprise assistants for managers and corporate staff | not a must-have | must-have |
| gm-6 Frontline staff knowledge assistant (handbook and SOP questions) | not a must-have | must-have |
| it-2 AI IT service desk | not a must-have | must-have |

Still exempt in v4 (technology needs "None" in the D6 sheet): sm-1 GenAI marketing text content & translation; sm-4 GenAI imagery & video for marketing; kc-5 Recipe and menu generation (GenAI); lg-3 GenAI contract review and legal assistance.

### Item 12 (F18): tools that gain or lose the guest questions (X2a, X2b) and D2

| Tool | X2a/X2b v3 | X2a/X2b v4 | D2 v3 | D2 v4 |
|---|---|---|---|---|
| fo-1 Digital check-in with ID document capture (online/mobile/kiosk) | asked | - | - | - |
| fo-2 AI room assignment | asked | - | asked | - |
| fo-3 Biometric face verification at check-in (selfie-to-ID 1:1 match) | asked | - | - | - |
| fo-4 Front-desk copilots and PMS AI agents | asked | - | - | - |
| fo-6 Guest risk screening before arrival (ID, behaviour and stay-history scoring) | asked | - | - | - |
| fo-8 Lost-and-found logging and guest claim matching | asked | - | - | - |
| gx-1 Review analysis and sentiment / guest-feedback analytics | asked | - | - | - |
| gx-3 GenAI review response | asked | - | - | - |

Tools that keep the guest questions in v4: res-1, res-2, res-4, res-7, sm-3, fo-5, fo-7, gx-2, gx-4, gx-5, gx-6, fb-2, fb-4, fb-6.

### All 98 tools x 3 hotel types: every change in question count, must-haves or all-Yes / all-No verdict

| Tool (hotel type) | questions v3 → v4 | must-haves v3 → v4 | must-haves added | removed | all-Yes | all-No |
|---|---|---|---|---|---|---|
| rm-3 (independent) | 19 → 19 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| rm-4 (independent) | 21 → 21 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| rm-9 (independent) | 21 → 21 | 7 → 8 | T1 | - | pilot → pilot | stop → stop |
| res-8 (independent) | 27 → 27 | 10 → 12 | P5, G3 | - | pilot → pilot | stop → stop |
| fo-1 (independent) | 23 → 21 | 8 → 8 | - | - | pilot → pilot | stop → stop |
| fo-2 (independent) | 24 → 21 | 7 → 7 | - | - | pilot → pilot | stop → stop |
| fo-3 (independent) | 26 → 24 | 8 → 8 | - | - | pilot → pilot | stop → stop |
| fo-4 (independent) | 32 → 30 | 8 → 8 | - | - | pilot → pilot | stop → stop |
| fo-6 (independent) | 27 → 25 | 8 → 8 | - | - | pilot → pilot | stop → stop |
| fo-8 (independent) | 23 → 21 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| gx-1 (independent) | 20 → 18 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| gx-3 (independent) | 22 → 20 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| hk-1 (independent) | 21 → 21 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| me-2 (independent) | 21 → 21 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| me-5 (independent) | 19 → 19 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| kc-2 (independent) | 21 → 21 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| pr-5 (independent) | 17 → 17 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| fa-7 (independent) | 21 → 21 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| hr-2 (independent) | 26 → 26 | 10 → 12 | P5, G3 | - | pilot → pilot | stop → stop |
| hr-3 (independent) | 21 → 21 | 7 → 8 | T1 | - | pilot → pilot | stop → stop |
| hr-5 (independent) | 27 → 27 | 10 → 12 | P5, G3 | - | pilot → pilot | stop → stop |
| gm-2 (independent) | 20 → 20 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| gm-6 (independent) | 21 → 21 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |
| it-2 (independent) | 19 → 19 | 6 → 7 | T1 | - | pilot → pilot | stop → stop |

72 of 294 tool x hotel-type combinations changed (rows for group and managed hotels are listed only where they differ from the independent row). Unchanged: 222.

Must-have counts (combinations): v3 {"6":54,"7":159,"8":66,"9":6,"10":9}, v4 {"6":12,"7":195,"8":72,"9":6,"12":9}. Question counts: v3 17–33, v4 17–32.

### Legal panel and help texts: every string that is new in v4

- NEW: Switzerland is not in the EU. The EU AI Act reaches hotels outside the EU only in some cases. Ask your legal adviser whether it applies to you. The Swiss Data Protection Act and labour law apply to AI directly. This check does not yet cover Swiss rules in detail.
- NEW: The United Kingdom is not in the EU. The EU AI Act reaches hotels outside the EU only in some cases. Ask your legal adviser whether it applies to you. UK data protection and employment law apply to AI directly. This check does not yet cover UK rules in detail.
- NEW: The EU AI Act reaches hotels outside the EU only in some cases. Ask your legal adviser whether it applies to you.
- NEW: Check whether the data protection impact assessment uses the information the maker supplies with the tool (its instructions and documentation).
- NEW: Check whether someone can answer the authorities' questions about the tool.
- NEW: Check with the vendor whether the tool is a legacy tool or will be CE-marked and registered by 2 Dec 2027, and ask to be told before an update changes that.
- NEW: Spain: the works council has the right to be told the parameters, rules and instructions of algorithms or AI that affect working conditions; individual workers also have GDPR information rights.
- NEW: Minimal for the hotel; ask the maker. AI that controls the safety of a gas appliance can be a safety component from 2 Aug 2028. Other kitchen machinery is regulated by machinery law.
- NEW: Matching applicants to properties selects and evaluates candidates; allocating existing staff by their behaviour or personal traits is task allocation. Either way it is high-risk.
- NEW: Check whether staff have a real non-biometric alternative to the time clock.
- NEW: This tool uses no personal data (guests, staff, job candidates, callers)
- NEW: If you have no data protection officer, this is whoever handles data protection for you, often an outside adviser.
- NEW: A DPIA (data protection impact assessment) is a written assessment that data protection law requires before processing that is likely to put people at high risk. Your data protection contact decides whether this tool needs one.
- NEW: Ask your data protection contact whether this tool needs a data protection impact assessment (DPIA), and have it done before the tool goes live if it does.
- NEW: Checked: not required (confirmed in writing)
- NEW: A short written list of the outputs a named role checks before they take effect.
- NEW: Which outputs, and who checks them?
- NEW: HR manager reviews every shortlist before candidates are contacted

### Strings shown in v3 and gone in v4

- GONE: Switzerland is not in the EU. The EU AI Act reaches Swiss hotels only in some cases (for example a group with hotels in the EU); the Swiss Data Protection Act and labour law apply to AI directly. This check does not yet cover Swiss rules in detail.
- GONE: The United Kingdom is not in the EU. The EU AI Act reaches UK hotels only in some cases; UK data protection and employment law apply to AI directly. This check does not yet cover UK rules in detail.
- GONE: Spain: the works council has the right to be told the parameters, rules and instructions of algorithms or AI that affect working conditions (Workers' Statute Art. 64.4(d)); individual workers also have GDPR information rights.
- GONE: Switzerland: systems meant to monitor staff behaviour are banned (Ordinance 3 to the Labour Act, Art. 26). Other proportionate monitoring is allowed, with staff involved in planning it (Federal Supreme Court, BGE 130 II 425; to verify).
- GONE: United Kingdom: human involvement counts only if a trained person with authority reviews each decision; spot checks are not enough (regulator's draft guidance). [To verify: ICO guidance status.]
- GONE: Minimal for the hotel; ask the maker. AI that controls the safety of a gas appliance can be a safety component from 2 Aug 2028 (gas appliances stay in Annex I Section A). Other kitchen machinery is regulated by machinery law.
- GONE: Matching applicants to properties selects and evaluates candidates (Annex III 4(a)); allocating existing staff by their behaviour or personal traits is task allocation (Annex III 4(b)). Either way it is high-risk.
- GONE: Check whether staff have a real non-biometric alternative to the time clock. The Spanish data protection authority (AEPD) considers biometric time clocks unlawful in most cases.
- GONE: This tool uses no guest or staff data
- GONE: A DPIA is a written assessment the GDPR requires when a tool handles sensitive personal data, such as staff or biometric data.
- GONE: Have a data protection impact assessment (DPIA) done before the tool goes live.

### What to look at in these lists

- **fo-1 (digital check-in with ID capture) and fo-3 (face verification at check-in)** lose "Can a guest who does not want to use the tool reach a staff member instead?". Guests do use these two tools themselves. The ruled definition (guest conversation or personalisation tool, or a chat / transparency label) does not catch them. Suggested: a `guestFacing` flag in the label file for these two, decided by the catalogue owner.
- **16 "Light" tools now have the two-way link as a must-have.** For some of them "read from and write back to your hotel systems" is a stretch (gx-3 review replies: "Review platforms"; it-2 IT service desk: "Ticketing system"; me-5 lift maintenance: "OEM connectivity"). The ruling's rule was applied as written. A person should say whether the D6 sheet's technology column should read "None" for any of them.
- **sm-1** ("None or CMS plug-in") is read as "None" and stays exempt.

## Decisions still open (ruling section B), and what is built meanwhile

| # | Question | Built today |
|---|---|---|
| B1 | Name of the top verdict | "No blocker found: you can start a pilot"; for tools in use "No blocker found for continued use". One line to change. |
| B2 | Who is responsible for shared data, deletion date, contact | Sharing is on (owner). The notice says the date and contact are not set yet. The team must still supply the three facts before a real hotel shares. |
| B3 | What the tool says about time | No time. Question and must-have counts. To settle: time it with 3–5 managers. |
| B4 | Shorten the check | All questions kept. Start page says how the hotel is run "only adds the owner-approval question for managed hotels". |
| B5 | Legal wording for the D7 owner and a lawyer | Removed from hotel pages, to restore only after checking at source: the Swiss labour note; the UK labour note; the Spanish authority's view on biometric time clocks; the example for hotels outside the EU; article and annex numbers in labour notes and label reasons. Not added: the rule for tools already on the market (the existing AI Register item on legacy tools is now visible), national law names for the DPIA, a plain-words legal line. New help texts are listed above under "every string that is new in v4": please send that list to the D7 owner. |
| B6 | Does a Yes without a note hold the verdict back | Yes: "Not enough information yet", never "not in place". Partly on a must-have is still "not in place". |
| B7 | Extra must-haves for sensitive-data tools | High-risk labels only. |
| B8 | Tool names and descriptions | Untouched. Better search and a count. |
| B9 | The start-page sentence | Kept (owner). |

## Small choices made while building (say if you want them otherwise)

- The count line adds "n not in place" when there is one, so the four parts add up to the number of must-haves.
- A must-have Yes without a note keeps its 2 points; only its must-have status waits for the note.
- "Doesn't apply" stored on a question that no longer offers it (for example G3 on a high-risk tool) is kept and asked again, like the personal-data way out.
- The ruling's check for the string "to verify" in the built pages was narrowed to the two internal-note forms ("; to verify", "[To verify"), because three catalogue items legitimately say "…to verify output". The legal panel is tested for the plain string across all tools and countries.
- The fonts notice says the PDF library "may" load from cdnjs: it loads from the project's own copy first.
- The page now embeds only the D6 data it uses, which removes the D6 tool's own level names and method notes from the hotel page. Page size is unchanged (about 275 KB).

## Proof

- Node: readiness-check logic 35, flow 80, v4 81; register logic 143, machines 64; AI Act guide 2,644; catalogue route 328; hub 13; assessment 12. All pass.
- Browser (Playwright, Chromium, 1280 and 390 px): 197 checks pass. Screenshots: `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/v4/`.
- Not done: a test with real hotel managers (also open for the AI Act guide). It settles B3, B4 and B6.
