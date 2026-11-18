# Hotel AI Register: changelog

Changes that alter what the register says. Each has a test in `tests/logic.test.mjs`.

## Phase 1 (19 Nov 2026): before any external demo

Brief: `claude_code_prompt.md` (merged review of 19 Nov 2026); review notes in `research_notes/AI register review/`.

- **Banner** on every screen, the PDF (every page) and the CSV: "Student prototype (EHL SBP Group 36). Not reviewed by a lawyer. Not legal advice."
- **New label "Could be banned"** (`banif`). An unanswered or "Not sure" ban question now beats every lower label, soft questions included. The label underneath is kept as `labelUnder` and used for the booklet comparison table. Data meaning change: tools such as CCTV analytics, recruiting and guest screening now open as "Could be banned" until their ban questions are answered.
- **"Not AI" cannot override** a ban or high-risk answer, or an open ban or high-risk question. For a use whose questions can make it banned or high-risk, it also needs the box "The vendor confirmed this in writing". Question reworded to Art. 3(1) and recital 12.
- **Prohibited = stop.** Only the stop item, AI literacy, basics and labour items stay; the other duties move to a collapsed block "If you switch the banned feature off, these apply instead".
- **Maker adds, never removes.** A group that builds, brands, changes or repurposes a tool keeps every user duty (H1–H6, H8); only checks against an outside vendor (C1, H7, R2) drop out.
- **Repurpose route** (a general tool used for a high-risk purpose): no product-liability item (Y1), no QMS standard (M2); new item M1r "you may be treated as the provider (Art. 25(1)(c)), get legal advice, check the vendor's terms".
- **Brand-mandated tools** get item BR1 (who carries which duty under the franchise or management agreement) and a role note for every operating model.
- **"Not sure" adds a "find out" item** naming who can confirm.
- **"Rests on"** shows the basis of the answer or open question that set the label, else the use case default.
- **Wording:** every item rewritten as "Check whether…" with "Why:" and "Who can confirm:"; Art. 4 literacy text updated to the Omnibus wording; GDPR Art. 22 item limited to decisions with legal or similarly significant effects; Spanish biometric clocks: "the AEPD considers them unlawful in most cases"; PCI DSS is a contract / industry standard, not law; "recognising VIP guests is allowed" removed; "All checked" replaced by "Items marked as reviewed by [owner] on [date]".
- **Switzerland and UK:** reach text now says a stand-alone hotel is probably not covered for on-site use but can be under Art. 2(1)(c); AI Act items show "For reference (EU)"; GDPR references show revFADP / UK GDPR; new Swiss item CH4 (revFADP Art. 21).
- **CSV:** cells starting with = + - @ are escaped.
- **Not verified (TODO-VERIFY):** the reference of the final Art. 50 guidelines. The booklet cites C(2026) 7702 final of 5 Nov 2026; other sources give OJ C/2026/6005 of 12 Nov 2026. EUR-Lex could not be read from the build environment, so both are shown.

## Phase 2 (19 Nov 2026): legal content

Every article below was checked against the two regulation PDFs in `tools/ai-act-explorer/` (Reg. 2024/1689 and Reg. 2026/1744).

- **New items:** FR1 fundamental rights impact assessment when a tool scores creditworthiness (Art. 27(1); may cross-refer to the DPIA, Art. 27(4) as amended); H9 input data (Art. 26(4)); H10 monitoring and serious-incident reporting (Art. 26(5)); H11 using the maker's information for the DPIA (Art. 26(9)).
- **Art. 50(2) marking** now also applies to a group's own chatbot (text generation), not only image and text generators; G1 reworded with the Art. 111(4) deadline.
- **"In use since" is a date.** A high-risk tool in use before 2 Dec 2027 shows "May be a legacy tool" at the top (Art. 111(2) as amended); the same caveat added to H7, S3 and the watch entry for 2 Dec 2027.
- **Chat is a question, not assumed,** for AI recruiting (hr-2) and the booking-engine assistant (res-4): `c_chat`. res-4 now opens as minimal.
- **Custom tool triage** also asks social scoring, crime prediction, sensitive traits, face databases, exploitative pricing, biometric sorting, auto-replies and the academy question.
- **Question wording:** exploitative pricing now says "a specific social or economic situation" (Art. 5(1)(b)); sensitive traits now list race, political opinions, trade union membership, religion and sexual orientation, inferred from biometric data (Art. 5(1)(g)).
- **Bases:** staff ranking and judging rest on the law text (Annex III 4(b) "monitor and evaluate the performance and behaviour"); predictive maintenance (me-5, me-6) on the team's reading.
- **Facial age estimation (m-12):** now "High-risk if…" with an "ancillary or not" question, marked our reading and contested; "age is not a sensitive attribute" removed (recital 16; Annex III 1(b)).
- **ESG (lg-1):** the published-claims question is now firm; marked as differing from the booklet. sm-1 cites the final Art. 50 guidelines (reference to verify).
- **National notes:** Spain (works council right, Workers' Statute Art. 64.4(d)); Switzerland (OLL 3 Art. 26; BGE 130 II 425, to verify); UK note marked to verify. Norway, Iceland and Liechtenstein added as EEA countries with a reach note (AI Act incorporation into the EEA Agreement to verify).
- **Watch list:** source links on every entry; Latombe v Commission (C-703/25 P) restored; DFA wording fixed (fake scarcity claims, personalised prices aimed at minors or vulnerable consumers; COM(2026) 1100); QANDA/26/2408 and French bill no. 2518 added as "to verify" (only the review cites them); GDPR entry linked to the data-protection items; Swiss date marked estimated; new "Published" entry for the final Art. 50 guidelines (reference to verify); the entry on a possible EU law on AI at work removed (no source for the European Parliament resolution); "Germany has done so" removed from the product-liability entry (no source).
- **Removed:** "the AI Hospitality Alliance's framework has a 14-question vendor questionnaire" (not verified).
- **Not done:** the Paris Court of Appeal ruling of 21 May 2026 (RG 25/13232) named in the review; nothing in the project files says what it concerns, so no entry was written. Listed for the D7 owner.

## Phase 3 (19 Nov 2026): use and customer journey

- **De-duplicated To do.** Three sections: "For the whole hotel" (once, covering every tool: staff AI tools, a responsible person per tool; AI literacy is the S5 check above and ticking it covers every tool), "Per vendor" (one conversation per vendor, with a ready email of all its questions) and "By tool" (only tool-specific items). The headline count counts hotel-wide items once and vendor items once per vendor. Barcelona test case (6 tools, 5 vendors): 17 "now" items before, now 4 by tool plus 3 hotel-wide, and one email per vendor.
- **Sort and filter.** Inside each date group: "to find out" first, then AI Act duties, other law, standards, the maker's duties to check, good practice. "By tool" filters by responsible person.
- **Top 3 for this tool** strip on every tool page; the full list is collapsed below it.
- **Plain text for users.** The picker shows one plain sentence from the catalogue (`taskPublic`) and "How common in hotels (team estimate, Nov 2026)"; the rest of the catalogue note is kept for reviewers (`taskResearch`).
- **For reviewers toggle** (How it works): the "Differs from the booklet" boxes, chips and the label table now show only when it is on.
- **Neutral roles:** "Head office (CIO)" now reads "IT lead (head office or CIO in a group)".
- **Search synonyms:** channel manager, smart alerts, ChatGPT, Copilot, rota, roster, camera, CCTV, PMS, chatbot, WhatsApp, CV, hiring, pricing, food waste.
- **Back button** stays inside the tool (browser history per view).
- **PDF:** embedded font "Register Sans" (OFL subset of Liberation Sans, `fonts/`) prints every European letter; characters outside it show as "?" instead of disappearing. Each tool lists its open questions and the legacy note. jsPDF is bundled into the page.
- **No internet needed:** Google Fonts removed (system font stack); jsPDF and the font are embedded. The page works from file://.
- **CSV:** UTF-8 BOM kept; banner row first; formula-like cells escaped (phase 1).
- **Vendor questions as an email** per tool and per vendor.
- **Privacy notice and terms of use** in How it works: all data stays in the browser, no accounts, no tracking; provided as is, not legal advice, no liability.
- **Phone:** citations wrap, so the To do tab no longer overflows at 390 px.
- **Kept on purpose:** the `window.claude` and postMessage code. It is what lets the page save files inside the claude.ai hub, and it is inert from file:// (comment in `src/app.js`).
