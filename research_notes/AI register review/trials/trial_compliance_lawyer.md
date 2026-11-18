# Hotel AI Register: review by an EU technology-law consultant

*Trial review, 18 Nov 2026. Tool reviewed: `tools/register/` (data v0.2, prepared 17 Nov 2026, "law as of 17 Nov 2026"), served at `http://127.0.0.1:8765/register/index.html`. The question: could a hotel association put its name on this?*

*This is a review of the tool's wording and logic. It is not legal advice to any hotel. Law checked against the texts in `tools/ai-act-explorer/`: Regulation (EU) 2024/1689 (OJ 12.7.2024) and Regulation (EU) 2026/1744 (Digital Omnibus on AI, OJ 24.7.2026). Other points rest on primary law (GDPR, Swiss FADP, Product Liability Directive (EU) 2024/2853) and named court decisions. No Wikipedia.*

Screenshots and script: `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/reg-law/` (`run.js`, `net.js`, `shots/*.png`, `shots/text.json`, `shots/example.pdf`, `shots/C_csv.txt`).

---

## Verdict in one line

The register is careful, well sourced, and more honest about uncertainty than most commercial tools. But it gets three structural things wrong: reach outside the EU, a group that is both maker and user, and brand-mandated tools. It is also missing two duties (FRIA, Art. 27; marking chatbot text, Art. 50(2)) and has no privacy notice or liability terms. **It is fit for interviews with a caveat. It is not yet fit for HFTP members or HFTP branding.**

**Safe to publish: 4/10** (as it stands today; about 7/10 once the top 8 fixes are made and a qualified lawyer has signed off).

---

## 1. Three test hotels

### (a) Swiss stand-alone resort (CH, owner-operated, independent, no staff reps)
Tools added: a website chatbot for guests from DE/FR/IT, AI images for EU ad campaigns, and a rota tool that ranks staff (screens A1–A6).

**How the tool treats reach.** One fixed text appears on the hotel page, on every tool page and on the To-do page:
> "The EU AI Act covers any group hotel in the EU, and makers and users outside the EU whose AI output is used in the EU. A stand-alone Swiss hotel serving guests in Switzerland is not covered (our reading). The labels below are shown for reference…"

Problems:
1. **It contradicts itself on the same page.** The "Who would contact you" panel on the hotel page says the Act "still reaches Swiss groups that place AI on the EU market or whose AI output is used in the EU (Art. 2)". A resort that runs a chatbot for guests in Germany, or places AI-made adverts in EU media, is exactly the case Art. 2(1)(c) covers: providers and deployers established in a third country "where the output produced by the AI system is used in the Union". The tool asks no question about this. Whether output shown to an EU-resident guest browsing a Swiss site counts as "used in the Union" is not settled (recital 22 frames the rule around avoiding circumvention). So "not covered" is too firm.
2. **"Any group hotel in the EU" is wrong and confusing.** Art. 2(1)(b) covers every deployer established or located in the EU, whether or not it belongs to a group.
3. **The pages still show EU duties as duties.** For the Swiss hotel the items still carry the chip "AI Act duty", e.g. "Brief the staff… AI Act Art. 4, since 2 Feb 2025". The To-do page says "Required since 2 Feb 2025 (AI Act Art. 4)". The rota tool shows eight "AI Act duty" items under Art. 26. This contradicts the claim that the hotel is "not covered".
4. **The wrong data-protection law is cited.** The Swiss hotel gets "Other law · GDPR: Run a data protection impact assessment… GDPR Art. 35" and "GDPR Art. 22". For staff data the right references are the FADP (SR 235.1): Art. 22 (impact assessment) and Art. 21 (automated individual decisions). For guest data the GDPR may in fact apply, through **Art. 3(2)(a) GDPR** (offering services to people in the EU: EU-language site, EUR prices, EU marketing). If it applies, Art. 27 GDPR may require an EU representative. The tool mentions neither point.
5. **Swiss items are tagged as law when they are not.** CH3 "Write the group's AI policy" is tagged "Other law · National". There is no Swiss legal duty to have an AI policy. CH1 "Tell guests and staff when they deal with AI" goes beyond FADP Art. 21, which covers automated individual decisions only. The rest reflects the FDPIC's stated position that the FADP applies to AI (guidance, not law).
6. **The Swiss labour note contradicts itself.** The short note says "systems meant to monitor staff behaviour are banned". The national panel correctly adds that the Federal Supreme Court (BGE 130 II 425) does not read ArGV 3 Art. 26 as a general ban. The short note should carry the nuance.
7. The vendor question "If data leaves the EU…" should read "leaves Switzerland" for a Swiss hotel (FADP Art. 16).

### (b) French managed hotel of an international brand, using brand-mandated tools (FR, managed, group, CSE)
Tools added: the brand chatbot, the brand recruiting platform (once "as supplied", once "with our name on it"), the brand RMS, and a housekeeping app (screens B1–B7).

**How the tool treats brand-mandated tools.** "Who decided: Head office or the brand" adds one fixed note:
> "Where brand standards impose a tool and its settings, the brand may share the user's duties (our reading; the contracts decide in practice)."

The hotel page adds: "a brand that only imposes it may count as a distributor instead."

Problems:
1. **The labels and items never change.** Picking "brand" has no effect on the role, the duties or the vendor questions. Brand-mandated tools are the common case for managed and franchised hotels, and they are exactly where the deployer question matters.
2. **The "distributor" reading is the weaker one and should not be given as the alternative.** The roles that fit the facts are:
   - the brand is the **provider** where it has the tool developed and supplies it to hotels under its own name (Art. 3(3), together with Art. 3(9) placing on the market and Art. 3(11) putting into service);
   - the brand is a **deployer** where it runs the tool centrally (central reservations bot, group HR platform);
   - the brand is a **distributor** only where it resells a third party's product unchanged (Art. 3(7)).
3. **"Brand it" gives the role to the wrong party.** In a managed hotel the name on the tool is usually the brand's, not the hotel's. Choosing "A vendor's tool with our name on it" made the hotel the maker: "Putting your name on a vendor's high-risk tool makes your group its maker." The text also leaves out the proviso in **Art. 25(1)(a)**: "without prejudice to contractual arrangements stipulating that the obligations are otherwise allocated". The tool needs to ask whose name is on the tool.
4. **Who "you" is stays unclear.** The person filling in the register for a managed hotel may work for the owning company, the management company or the brand. The hotel page says "Usually the user: the management company", but every tool page then says "Your role: user". Say whose role it is.
5. **The French content is good.** It covers the CSE (C. trav. L2312-8, L2312-14, L2317-1), the Paris Court of Appeal ruling of 21 May 2026, and the DGCCRF/CNIL split marked as "not yet law". Two fixes are needed:
   - GA1 "Let no tool reject, select or rate a person on its own: a trained person… reviews every decision" is tagged "GDPR Art. 22" as **law**. Art. 22 forbids decisions based solely on automated processing unless an exception and safeguards apply. Reviewing every decision is the safe practice, not the letter of Art. 22. Tag it "Good practice (GDPR Art. 22)" and cite CJEU C‑634/21 *SCHUFA* (7 Dec 2023): a score that plays a determining role can itself be a decision.
   - The recruiting platform shows "The transparency duty applies as well, whatever the answers" and "A hiring chatbot must also say it is AI". A CV-screening engine that does not chat with anyone has no Art. 50(1) duty. Make this depend on a "does it chat?" question.

### (c) Dutch hotel whose group built its own chatbot (NL, owner-operated, group, works council)
Tools added: a group-built guest chatbot (card data passes through it), a group-built staff assistant (custom tool), guest screening with credit scoring, and camera analytics with face recognition at a distance (screens C1–C7).

**How the tool treats the maker/user split.** The origin "Built by or for our group" sets **Your role: maker** ("Build it… so the group is its maker", tagged law). The chatbot then gets C1m: "the group itself must make it say it is AI" (Art. 50(1)). This is correct as far as it goes.

Problems:
1. **A maker loses all its user duties.** In `logic.js` the items H1–H8 carry `role: "user"` and are filtered out once the role is "maker". I checked this in Node: a group-built recruiting tool gets C1m, Y1, L1, R1, R2, LB1, GD1, GA1, M1 and M2, but **not** Art. 26(1), (2), (5), (6), (7), (11) or (12). A group that builds and also uses a high-risk tool is provider **and** deployer, and owes both sets of duties. Worse, the hotel company is usually a separate legal entity from the group company that develops the tool. That makes the hotel the deployer, and the group the provider that puts the tool into service by supplying it for first use (Art. 3(11)). The tool merges two companies into one role.
2. **Marking chatbot text is missing.** Art. 50(2) obliges providers of systems that generate synthetic text to mark the output as AI-made in a machine-readable way. Under Art. 111(4) (added by the Omnibus), systems already on the market before 2 Aug 2026 must comply by 2 Dec 2026. The `gen` flag is set only on sm‑1 and sm‑4, so a group-built LLM chatbot (gx‑2) never gets G1.
3. **The group-built tool still shows "Ask the vendor the questions… put the answers in the contract"**, although no vendor exists. For a built tool this should become an internal checklist.
4. **The fundamental rights impact assessment is missing.** Guest screening with "scores creditworthiness: yes" is correctly labelled high-risk (Annex III 5(b), law text). But **Art. 27(1)** requires deployers of Annex III 5(b) systems to carry out an impact assessment on fundamental rights *before* deployment, and the register has no Art. 27 item anywhere. The Omnibus amended Art. 27(4)–(5) to allow cross-references to the DPIA; it did not remove the duty. The GDPR Art. 22 item is also assigned to "HR" on a guest tool.
5. **Face recognition at a distance is presented too lightly.** The help text says "Recognising VIP guests is allowed, but as a high-risk use". The AI Act is not the binding limit here; the GDPR is. Art. 9(1) GDPR prohibits processing biometric data to identify people unless Art. 9(2) applies, and in practice that means explicit consent from every person scanned. A camera network cannot get that from passers-by. The it‑4 tool carries only the DPIA pack, with no Art. 9 item. Proposed wording: "Under the AI Act this is high-risk, not banned. Under the GDPR, recognising people by face needs an Art. 9 exception, in practice the explicit consent of every person scanned; data protection authorities treat camera-based recognition of guests as very hard to justify. Take legal advice before any trial."
6. **Netherlands is not covered, and the tool says so,** but the generic labour line does not mention the Dutch works council's **consent** right over staff-monitoring systems (WOR Art. 27(1)(l)). The country list offers 29 countries while only 6 have national notes. Mark the uncovered countries in the dropdown.
7. **The label and its basis do not match on the screening tool.** The tool shows the high-risk label from 5(b) but "Rests on: Law text Art. 5(1)(c)". The reader cannot tell what the label rests on.

---

## 2. Wording review: quote and safer wording

| # | Where | Current wording | Problem | Safer wording |
|---|---|---|---|---|
| 1 | CH/GB reach box (hotel, tool, to-do) | "A stand-alone Swiss hotel serving guests in Switzerland is not covered (our reading)." | Too certain; ignores Art. 2(1)(c); contradicts the panel next to it | "The EU AI Act can reach a Swiss hotel where it places AI on the EU market or where the AI's output is used in the EU, for example a chatbot answering guests in the EU or AI images in EU advertising (Art. 2(1)(c)). How far this reaches is not settled. If none of your tools produce output used in the EU, the Act is unlikely to apply; the items marked 'AI Act' are then shown for reference only. The GDPR may apply to guest data if you target guests in the EU (GDPR Art. 3(2))." |
| 2 | Same box | "The EU AI Act covers any group hotel in the EU" | Wrong limitation | "The EU AI Act covers every hotel in the EU that uses AI (Art. 2(1)(b))." |
| 3 | Label text, chatbot use cases | "It chats with guests, so they must be told it is AI in its first message." | Reads as the hotel's duty; the item below says it is the maker's | "It chats with guests, so the tool's maker must make it tell them it is AI, at the latest at the first interaction (Art. 50(1), (5))." |
| 4 | C1 item | "A line in the terms and conditions is not enough." | Interpretation shown untagged | add "(Commission transparency guidelines)" or "(our reading)" |
| 5 | High-risk label short text | "The maker must test, document, CE-mark and register the tool; the hotel must use it under trained human oversight." | "Must" stated today, for a label that often rests on draft guidance | Add after the chip: "Rests on draft guidance: may change" whenever basis = draft. Keep "High-risk (draft guidance)" as the chip text for those rows. |
| 6 | Recruiting / it‑4 | "The transparency duty applies as well, whatever the answers." | Not true for non-chat tools | "If the tool chats with candidates, its maker must also make it say it is AI." |
| 7 | face_distance help | "Recognising VIP guests is allowed, but as a high-risk use." | Gives a green light that GDPR Art. 9 does not | See wording in 1(c)5 above. |
| 8 | Y1 (product liability) | "…is a product it manufactures; without records a court can presume a defect." | Overstates PLD Art. 10: the presumption follows a failure to disclose evidence (Art. 9), a breach of mandatory safety requirements, an obvious malfunction, or excessive difficulty of proof. It does not follow from missing records as such. Whether in-house software "put into service" for guests is caught also needs a qualifier | "Software, including AI, is a 'product' under the new Product Liability Directive for products placed on the market or put into service from 9 Dec 2026. A group that builds AI and puts it into service may be liable as its manufacturer. If a claim is made and the group cannot disclose relevant evidence, a court may presume the product defective (Arts. 9–10). Keep design and testing records." |
| 9 | GA1 | "Let no tool reject, select or rate a person on its own: a trained person with authority reviews every decision." tagged Law · GDPR Art. 22 | Good practice, not the letter of Art. 22 | Tag "Good practice"; note "GDPR Art. 22 restricts decisions based solely on automated processing with legal or similarly significant effects; a score that plays a determining role can count (CJEU C‑634/21)." |
| 10 | M2 | "Follow EN 18286:2026, the harmonised standard for the quality-management system." | A standard gives a presumption of conformity only once its reference is published in the OJ (Art. 40). I could not verify that | "Use EN 18286 (quality management for AI providers). Check whether its reference has been published in the Official Journal; only then does following it give a presumption of conformity (Art. 40)." |
| 11 | D1 note | "Where an agency makes the content and decides how it uses AI, the agency labels it." | Reading not marked; the hotel that publishes still faces consumer law | add "(our reading: the agency is then the deployer under Art. 3(4)); the hotel stays responsible for what it publishes under consumer law." |
| 12 | D1 note | "The Commission-backed Code of Practice on marking and labelling AI content (June 2026)" | Date and status not verified at source in the register's own source list | Add it to `meta.sources` with a URL and date checked, or remove the date. |
| 13 | T1 / pub_claims | AI-written claims about "health, safety or sustainability" = Art. 50(4) "matters of public interest" (tagged guidance) | Hotel marketing claims are unlikely to be text "published with the purpose of informing the public on matters of public interest" | Tag "our reading" and say: "Hotel marketing is rarely 'informing the public on matters of public interest'; the stronger reason to check these claims is consumer law (green claims, misleading health claims)." |
| 14 | L1 / S5 | "Required since 2 Feb 2025 (AI Act Art. 4)." | Art. 4 was replaced by Reg. 2026/1744 (in force 27 Jul 2026): providers and deployers must "take measures to support the development of AI literacy"; there is no required level | "Since 2 Feb 2025 (AI Act Art. 4; reworded in July 2026): take measures to support AI literacy of staff who use AI. No specific level or certificate is required." |
| 15 | CH labour note | "systems meant to monitor staff behaviour are banned." | Leaves out the court's narrowing | "Systems whose purpose is to monitor staff behaviour are prohibited (ArGV 3 Art. 26); monitoring needed for other reasons is allowed if it is proportionate and does not harm health (BGE 130 II 425)." |
| 16 | CH3 tagged "Other law · National" | "Write the group's AI policy…" | Not a legal duty | Tag "Good practice". |
| 17 | rank_staff help | "A manager signing off does not take the tool out of high-risk." | Correct, but it needs its legal anchor | add "(Art. 6(3): an Annex III system that profiles people is always high-risk)". |
| 18 | operatingModels.watch | "a brand that only imposes it may count as a distributor instead." | Weak alternative (see 1(b)) | "Depending on the facts the brand may be the tool's provider (it is supplied under the brand's name), a deployer (it runs the tool centrally), or a distributor (it resells another maker's tool unchanged). The franchise or management agreement should say who carries which AI Act duty." |
| 19 | H7 note | "cloud tools that keep updating are unlikely to keep this status." | Reasonable, but untagged | add "(our reading of 'significant changes in design', Art. 111(2) as amended)". |
| 20 | Hotel page, EU | "Yes. Your hotel is in the EU, so the Act applies to the AI tools it uses, whatever its size." | Acceptable | add "Some duties are lighter for SMEs and small mid-caps (Reg. 2026/1744); fines for them are capped at the lower amount (Art. 99(6))." |

**Wording that is good and should be kept.** "Items to check, never a verdict". The kinds "Maker's duty, your check", "Other law" and "Good practice". The "Differs from the booklet" boxes. The Art. 111(2) legacy note. The repurpose route marked "least settled point in the law". "A vendor's letter alone does not bind an authority".

**Liability exposure for HFTP / EHL.**
- The PDF prints "All checked" against a tool, and the To-do page says "Nothing open. Every item is ticked." A hotel could show this to an authority or a court as evidence of compliance. It could then claim it relied on HFTP if a label turns out wrong. Replace with "All listed items ticked (not a compliance check)".
- Labels from draft guidance and from "our reading" appear in the same chip style as law-based labels. Only a small grey "Rests on" line tells them apart.
- Tool names, "EHL Hospitality Business School students" and "for HFTP" appear in the header, the footer and every PDF page. Without a licence or terms of use, this can read as an endorsement by HFTP and EHL.

---

## 3. Disclaimers, basis tags, version stamps, data handling

**Disclaimers.**
- Present: the footer on every screen ("Not legal advice… never a verdict"), the PDF footer on every page, and the "Limits" list on How it works.
- Missing:
  - no **limitation of liability** or "no reliance" clause;
  - no named publisher or contact for corrections;
  - no statement that it has **not been reviewed by a qualified lawyer**;
  - no statement of the unreviewed status on the tool pages, where the labels actually appear. "Waiting for review by the project team" is only on How it works.
- The **CSV export carries no disclaimer, version or date at all.**

**Basis tags** (law / Commission guidance / draft guidance / our reading / "Law text: not listed").
- The scheme is good and better than most tools. Problems:
  - the tag sits on the use case and on each question, but the **label chip does not show it**;
  - several interpretations carry no tag (quotes 4, 7, 11, 13, 19 above);
  - some items tagged "law" are good practice (GA1, CH1, CH3);
  - "Law text: not listed" for the minimal default reads as if the law confirms the tool is minimal. It only means the tool is not listed. Rename it to "Not on the Act's lists".
  - Tests check label counts, not tag consistency.

**Version and date stamps.**
- Present: header "prototype · 17 Nov 2026", footer "Law as of 17 Nov 2026", "Data version 0.2" (How it works only), watch list "Last checked 17 Nov 2026", national research "10 Nov 2026".
- Missing:
  - no version number on the PDF or CSV;
  - no per-label review date or reviewer;
  - no warning once the law date is stale (e.g. "Law last checked more than 90 days ago"). Final high-risk guidelines are expected around 31 Dec 2026 and will change many labels;
  - the watch list says "Swiss AI bill, expected 1 Apr 2027", while the national panel says a *consultation* is planned for spring 2027. Align these.

**Data handling.**
- What is stored: everything sits in `localStorage` under the key `hftp-ai-register-v1`. Nothing is written until the user edits.
- What leaves the browser: no data is sent to the project. Network calls on load were the page itself, **Google Fonts (fonts.googleapis.com / fonts.gstatic.com)** and the local jsPDF, with a fallback to cdnjs.
- Personal data entered: names of responsible persons, the register keeper, and free-text notes, which could include staff matters. Backups go out as JSON files that people will email around.
- Privacy points:
  1. **There is no privacy notice.** "Saved in this browser only" is helpful, but there is no short notice saying who (if anyone) is controller, that the project receives nothing, and that the hotel is controller of what it types (GDPR Arts. 13–14 / FADP Art. 19 where the publisher does process data).
  2. **Google Fonts loaded from Google's servers** sends the visitor's IP address to Google. LG München I, 20 Jan 2022 (3 O 17493/20) held this unlawful without consent. Self-host the fonts before an HFTP release.
  3. Add a field-level hint: "Use roles, not names. Do not enter health, disciplinary or other sensitive staff information in Notes."
  4. When the register moves to shared claude.ai storage (README "next step"), the operator becomes a processor or controller. That will need a data processing agreement, a hosting location statement and a retention period.

---

## 4. Minimum conditions

**(i) Before the student team shows it to interviewees** (research use, team present):
1. Add a banner on every screen: "Student research prototype. Not reviewed by a lawyer. Not endorsed by HFTP or EHL. Do not rely on it."
2. Fix the CH/GB reach text (quote 1) and remove the "AI Act duty" chips for non-EU hotels, or mark them "for reference".
3. Load the fictional example only; do not enter interviewees' real tool data unless they agree. If you do, do not keep the backup files.
4. Present the labels as hypotheses to test with the interviewee, not answers.

**(ii) Before HFTP members use it unaccompanied:**
1. Make all of the top 8 fixes below.
2. Get sign-off from the D7 owner, plus a review by a qualified EU lawyer (AI Act and GDPR), named and dated on the page. Get a Swiss and a UK check of the CH/GB text.
3. Add terms of use (no reliance, limitation of liability, governing law) and a privacy notice; self-host the fonts.
4. Put a version number and law date on every export, and add a stale-date warning.
5. Give a named HFTP owner for the watch list and an update cycle (the README already flags this).
6. Show the basis tag on the label chip itself; tag every "our reading" text.
7. Grey out or flag uncovered countries.

**(iii) Before HFTP brands it:**
1. Meet everything in (ii).
2. Run an HFTP legal and brand review, and agree a licence and attribution between HFTP and EHL, covering who owns and maintains it and who corrects errors.
3. Set a re-review after the final Commission high-risk guidelines (expected end 2026) and after any Swiss AI bill.
4. Hold professional liability or errors-and-omissions cover, or make an explicit decision to publish without it.
5. Add a correction and contact channel, and a change log of label changes.
6. Remove "compliance-looking" outputs ("All checked") or make the disclaimer prominent beside them.
7. Do an accessibility and plain-language check for non-expert readers.

---

## 5. Top 8 fixes, ranked

1. **Reach outside the EU (Art. 2(1)(c); GDPR Art. 3(2)).** Ask "Does any tool's output reach people or markets in the EU?" and drive the CH/GB result from the answer. Remove the "not covered" certainty and the "any group hotel" error. Stop showing "AI Act duty" chips and GDPR items as binding for non-EU hotels; use FADP Arts. 21–22 for Switzerland.
2. **A group that builds is both maker and user (Arts. 3(3), 3(11), 16, 26).** Keep the Art. 26 user items when the role is maker. Ask "Is the hotel company the same legal entity as the group company that built it?" and show both roles when it is not. Replace the vendor-questions block with an internal checklist for built tools.
3. **Brand-mandated tools (Arts. 3(3), 3(7), 25(1)(a)).** Ask whose name is on the tool and who runs it. Show provider, deployer or distributor options for the brand, add Art. 25(1)(a)'s contractual-allocation proviso, and add a vendor/brand question: "Does the franchise or management agreement allocate AI Act roles and duties?"
4. **Add the missing duties.** Art. 27 FRIA for Annex III 5(b) credit scoring. Art. 50(2) marking for any group-built generative tool, including chatbots (deadline 2 Dec 2026 under Art. 111(4) for systems on the market before 2 Aug 2026). A GDPR Art. 9 item for the face-distance and voiceprint switches.
5. **Show the basis on the label chip and tag every interpretation.** "High-risk (draft guidance)", "(our reading)". Retag GA1, CH1 and CH3 as good practice. Rename "Law text: not listed".
6. **Liability-safe outputs and terms.** Replace "All checked" and "Nothing open"; put the disclaimer, version, law date and an "unreviewed" status on the PDF, CSV and every tool page. Add terms of use with a no-reliance clause and limitation of liability, and a "Not endorsed by HFTP/EHL" line until branding is approved.
7. **Privacy.** Add a privacy notice, self-host Google Fonts, add a "use roles, not names; no sensitive staff data" hint, and plan a DPA for the shared-storage version.
8. **Fix the overstatements.** PLD presumption (Y1), "VIP recognition is allowed", "transparency applies whatever the answers", Art. 4 wording after the Omnibus, Art. 50(4) "public interest" for hotel claims, EN 18286 "harmonised", Swiss labour nuance, and the Swiss bill date.

---

## Summary

The register follows the law text well. Dates match Art. 113 as amended (2 Dec 2027 / 2 Aug 2028), Art. 111(2) and (4) and Art. 5's new bans are right, Art. 50(1) is correctly placed on providers, and differences from the booklet are shown openly. Its weak points are structural, not cosmetic:
- **reach:** a Swiss resort with an EU-facing chatbot is told it is "not covered", yet shown EU duties and GDPR items;
- **brands:** choosing a brand-mandated tool changes nothing, and "our name on it" makes the hotel the maker when the brand's name is on the tool;
- **maker/user split:** a group-built tool drops every Art. 26 user duty, and the group-built chatbot misses the Art. 50(2) marking duty;
- **missing duties:** the Art. 27 FRIA (credit scoring) and a GDPR Art. 9 warning on face recognition;
- **publishing basics:** there is no privacy notice, Google Fonts loads from Google's servers, and there are no terms or no-reliance clause.

Score for "safe to publish": 4/10.
