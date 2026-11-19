# AI Act guide: build spec (19 Nov 2026)

The improved version of the "Use AI confidently" concept (`CONCEPT-original.md`), as ruled by the LLM council of 19 Nov 2026 and tested with simulated managers. It is a new front door in the hub, **running on the AI Register's rules** (one source of rules), not a separate rule set.

## Sources to use
- Content: `CONCEPT-original.md` (tool types, questions, plain "why" texts, vendor questions with fine answer / red flag, templates). Parsed copy: `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/concept_parsed.json`; the prototype's own data: `.../scratchpad/test2/map/newtool_types.json`.
- Mapping to the register: `.../scratchpad/test2/map/mapping.json` and its report `.../test2/map/report.md` (63 of 75 answers agree; read the disagreements).
- Rules engine: `../register/src/logic.js` (RegLogic), data `../register/data/reference.json`, `../register/data/uc-labels.json`, `../register/data/radar.json`. Read `../register/README.md`, `CHANGELOG.md`, `REVIEW_RESPONSE.md`.
- Test findings to fix: `.../scratchpad/test2/gm/report.md` (and `.../test2/ops/report.md` when it exists).
- Hub: `../hub/hub-bar.html`, `../build-hub.mjs`; readiness check `../readiness-check/` (shared hotel profile, hub "open" message).

## Files
`tools/ai-act-guide/`: `data/guide.json` (types, questions, answer → register mapping, vendor questions, the two templates), `src/page.html`, `src/guide.js` (pure logic, runs in Node), `src/app.js`, `build.mjs` (inlines register logic + register data + guide data; same pattern as `../register/build.mjs`, including the bundled jsPDF and `fonts/` if PDF is used), `tests/guide.test.mjs`, `README.md`, generated `index.html`. Plain JS, no framework, no external requests, works from file://.

## Rules (non-negotiable)
1. **Levels come from `RegLogic.classify`** via the mapping. Show tiers: Banned, Possibly banned, High-risk, Possibly high-risk, Transparency, Possibly transparency, Minimal, Not known yet (register `open`). Use `mapping.levelMap`. "Not sure" never gives a lower tier than the register would.
2. **CCTV** also asks the register's ban questions it skipped (`face_enrol`, `sensitive_traits`) in plain words. The shared emotion question is asked only where faces or voices are involved (CCTV, voice, staff monitoring, CV/video interviews, other); not on review analysis or text chat (the register says written text is not emotion recognition).
3. **Maker/user:** follow the register (Art. 25(1) only for high-risk); no "possibly provider" for non-high-risk branded tools.
4. **Plan = `RegLogic.items`**, de-duplicated like the register's To do (hotel-wide items once: AI literacy, staff AI use, responsible person; vendor items once per vendor). No progress bar, no "legal" task label. Columns: what to check; who; **Required by law?** (Yes, AI Act / Yes, other law / Vendor's duty, you check / No, good practice); **Do by** (Now, or the date). The article sits behind a "why" disclosure with "check with your adviser".
5. **Verdict first** on the results screen, three lines: "Do this month: …", "Can wait until <date>: …", "Nothing to do beyond briefing staff: …".
6. **"Not sure" leads somewhere:** each unsure answer appears as "Still open: ask the vendor: <question>" (never "Still open: Nothing"), and becomes a find-out item.
7. **Summary tiles** count "possibly" separately (never "1 Banned" for an unsure answer).
8. **"Is it AI?" helper** on the tools screen: three plain questions (does it learn from data, predict, or write text/images? does the vendor call it AI or machine learning? or does it only follow rules you set?) with the register's not-AI rule (vendor's written confirmation needed where a ban or high-risk question exists).
9. **Vendor questions** only for tools above Minimal or with open questions (plus an optional "ask anyway"). Each with "a fine answer / a red flag", a status (not asked, asked, fine, red flag), date asked, and a copy-ready email per vendor.
10. **Templates:** only the guest chatbot AI notice and the supplier question email, filled with the hotel's name, marked "Draft wording, check with your adviser". The staff policy and literacy checklist are not shown ("awaiting legal review").
11. **Honest box:** dates, fine ceilings (Art. 99), enforcers; the Art. 50 guidelines reference is **"to verify"** (booklet: C(2026) 7702 final, 5 Nov 2026; other sources: OJ C/2026/6005, 12 Nov 2026). Every page says "Rules as of 19 Nov 2026".
12. **Banner** on every screen and export: "Student prototype (EHL SBP Group 36). Not reviewed by a lawyer. Not legal advice."
13. **Owner page:** one-page summary for the owner or finance lead (tools and tiers, what must be done now, decisions needed, vendor status), copyable; PDF if cheap via the register's bundled jsPDF and font.
14. **Keep:** shared hotel profile (`hftp-hotel-profile-v1`), localStorage autosave, save/restore file, "welcome back". Straight path: Hotel → Tools → Results and plan → Vendors → Owner page; templates and save inside.
15. **Links:** each tool card links to its detailed view in the AI Register (hub `open` message with `#add=<use id>`; plain link outside the hub). Add a hub tab "AI Act guide" before "AI Register" in `../hub/hub-bar.html`, and allow it in the hub's `SRC_OK`.

## Tests (`tests/guide.test.mjs`)
- Every type/answer in `guide.json` resolves to a register use and classifies without error.
- Tier mapping for each register label; "not sure" on a type with a ban question gives "Possibly banned".
- The Barcelona GM case (WhatsApp chatbot, pricing, review replies, ChatGPT at reception, CCTV with unsure, rota with unsure): verdict lines, no "Still open: Nothing", tiles count possibles separately, supplier questions not suggested for Minimal tools.
- No plan row labelled "legal"; the C/2026/6005 reference is marked "to verify"; banner text present in the built page.
