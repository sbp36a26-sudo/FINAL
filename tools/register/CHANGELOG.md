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
