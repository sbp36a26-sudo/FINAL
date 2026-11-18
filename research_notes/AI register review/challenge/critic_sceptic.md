# Challenge round: the sceptic

*18 Nov 2026. Positions on the Hotel AI Register prototype (`tools/register/`, data v0.2). Paths below are relative to `research_notes/AI register review/` unless stated.*

## 1. Should it exist in this form?

**Not as a product; yes as a D7 companion** (D7 = "briefing + compliance tool", `docs/PROJECT_CONTEXT.md` §2, §3a). After the final report nobody maintains it: `radar.json` "needs a named owner at HFTP", none is named, and staleness is "certain" (`market_and_value.md` §4).

The free official checkers (Commission Service Desk, BNetzA Kompass) already triage one system at a time; what they lack is hotel content (§1b). So the asset is `uc-labels.json` (109 rows: 58 "default", 35 law, 11 draft, 5 guidance), not the software shell. The CIO trial agrees: "a pre-assessment and awareness tool … not a system of record" (`trials/trial_chain_cio.md` §5).

**Its honest job:** a signed-off answer to "which of my hotel's AI uses falls where, and why", printable as a D7 appendix, with the interactive page as a demo of that table. As an interview prop only on the lawyer's terms: fictional hotel, banner on, labels as hypotheses (`trials/trial_compliance_lawyer.md` §4(i)), and never as new interview questions. **It is not a product for HFTP members**, and students should not build it as one.

## 2. Scope creep versus non-negotiable

**Scope creep (for this team, in these weeks):**
- group mode and AT/NL notes; assignable to-dos with owners, dates and evidence (CIO fixes 1, 3)
- cost and lifecycle fields, Art. 4 record, owner/insurer page, calendar text, alignment map, "since last saved" diff (`market_and_value.md` §5 items 3–8)

This is OneTrust's race (five figures a year, §1a); students should not enter it.

**Non-negotiable (errors that remove, invert or invent duties):**
- A maker loses its Art. 26 deployer items (`legal_accuracy.md` §6.1; lawyer fix 2).
- "Not an AI system" overrides a Yes on a prohibited question (CIO bug 1).
- "Minimal" is shown while prohibited questions are open, and the open-question count is wrong (`trials/trial_independent_gm.md` bugs 1–2).
- Art. 50(3) is applied to identification. The line "VIP recognition is allowed" must go, and the missing GDPR Art. 9 item must be added (legal §6.3; CIO bug 2).
- The CH/GB "not covered" statement needs qualifying, and the FRIA item is missing (legal §6.2, §6.7).
- "All checked" and "Nothing open" read as verdicts (lawyer fix 6).
- Banner and terms: "student prototype, not reviewed by a lawyer, not endorsed". Fonts must be self-hosted, because `src/page.html` loads fonts.googleapis.com.
- D7 owner sign-off.

## 3. Where the reviewers over-reach or disagree

- **The trials are AI personas.** The readiness report already ruled that personas are "reliable for bugs … weak evidence for what a real hotel would want" (`reports/Readiness check retention and trust.md`, Limits). That applies here. Katrin's "group fitness 3/10" measures a product no one asked for. Keep the bugs; discount the wishlists.
- **The lawyer's stage (iii)** (E&O cover, licence, governing law, brand review) belongs to HFTP. The students' ceiling is stage (i) plus a frozen stage (ii).
- **GM versus lawyer on detail.** The lawyer wants article references and basis tags on every chip. The GM could not parse "Annex III", "deployer" or "Differs from the booklet" (GM §1). My ruling: put the basis in plain words on the chip ("draft guidance", "our reading"). Move article numbers to a reviewer view.
- **The 15 "Differs from the booklet" rows are booklet errors.** Fix the D7 booklet, then delete the boxes the GM read as "the tool arguing with itself".
- **Both legal reviews rest on an unverified file:** the Omnibus PDF is "itself a repo file. No independent copy from EUR-Lex was fetched" (`legal_accuracy.md`, header). Every date rests on it.
- **"Return triggers" exist, but no one maintains them** (`market_and_value.md` §3c). A visit prompted by a stale watch list does more harm than no visit.

## 4. Single biggest risk if it ships as is

**False reassurance under a name that looks like HFTP's.** A hotel sees "Minimal" on CCTV with two prohibited questions open, or a group-built tool with its oversight and logging duties silently gone, files a PDF that carries neither the open flag nor a version, and nobody updates the content after hand-over. The register is already a hub tab (`PROJECT_CONTEXT.md` §5); the readiness paper's rule "no hub link to any hotel" until access controls are live (§9) must cover it too, starting with Accor on 19 Nov.

## 5. Recommended next build (in order)

1. **Banner and freeze.** Add "Student research prototype. Not reviewed by a lawyer. Not endorsed by HFTP or EHL. Law as of 17 Nov 2026" to every screen, the PDF and the CSV. Remove "All checked" and "Nothing open".
2. **Fix the four logic errors** in `src/logic.js` `classify`: maker keeps Art. 26; notAI cannot override Yes answers; an open hard prohibited question gives "Open", never "Minimal"; Art. 50(3) applies only to emotion and categorisation. Add one test per bug.
3. **Make the cheap content corrections** from legal §6 items 2–7 and 9. These are data edits.
4. **Check the Omnibus text against EUR-Lex.** It takes one hour and underpins every date.
5. **Correct the D7 booklet in the 15 diff places,** then delete the diff boxes from the hotel view.
6. **Hide m-1…m-17** (unverified search summaries) until checked at source.
7. **Get D7 owner sign-off** of `uc-labels.json`, named and dated on the page.
8. **Collapse generic items:** one staff-briefing item for the whole hotel and one vendor pack per vendor (GM fix 1). This makes the real items visible.
9. **Privacy and stamps:** self-hosted fonts, a two-line notice, "roles, not names", and the rules version stored on each entry and export.
10. **Produce a printable label table and a one-page worksheet as the D7 appendix.** Add a hand-over note for HFTP (D8/D10) covering what goes stale when, what an owner would need, and a 90-day stale banner.

**Not now:** everything listed as scope creep in §2, plus URL routes.

**Never (in this project):** accounts or shared storage holding real hotel data; real interviewee tool data entered; a score, badge or "compliant" wording; a vendor directory or live news feed; HFTP branding without HFTP counsel; students negotiating E&O cover or a licence; positioning against commercial governance platforms.

## 6. Questions for the other critics

**To the operator's advocate:**
1. Name one real hotelier, not a persona, who asked for a register. Who updates `radar.json` on 1 March 2027?
2. Elena gives up at tool 4–5 after 30–40 minutes. Why add cost, contract-end and Art. 4 fields that make every tool page longer?
3. Is a 30-hotel group mode part of D7, or a product HFTP has not requested?

*Likely objection: "A frozen table is dead on arrival; dates bring hotels back."* Answer: dates are a message for HFTP's channels, not code. A dated table plus "what changes when" is honest, and the version stamp lets a future owner re-label. Return-visit machinery on unmaintained law is a liability.

**To the legal/method auditor:**
1. Which of your conditions can students meet before the report, and which belong to HFTP?
2. With your rating of 4/10 for "safe to publish", would the work be safer if the register left the hub and the signed-off table went into the booklet?
3. Your reach and brand-mandate fixes add branching logic for edge cases. For a D7 companion, why is "outside this tool: ask counsel" not the right answer?

*Likely objection: "Freezing is not safety; a printed wrong label cannot be corrected."* Answer: the table passes D7 sign-off once, shows date and basis, and sits in a plainly student deliverable. An interactive page gives personalised output and implies currency, which is closer to advice. Static is the safer form of the same content.
