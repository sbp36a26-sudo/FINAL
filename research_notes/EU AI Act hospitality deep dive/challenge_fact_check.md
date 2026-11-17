# Fact-check of disputed claims: EU AI Act text versus the five research notes and the team's hotel governance material

State of the law: November 2026. Verdicts on legal text rest only on the two local PDFs, both read with `pdftotext -layout`:

- **BASE** = `/home/user/final/tools/ai-act-explorer/EU AI Act June 2024.pdf` (Regulation (EU) 2024/1689, 144 pages)
- **OMNI** = `/home/user/final/tools/ai-act-explorer/Digital Omnibus July 2026.pdf` (Regulation (EU) 2026/1744, 41 pages, OJ 24.7.2026)

Team files, read for what the team says: **LIST** = `/home/user/final/docs/d7-governance/OMNIBUS-REVISION-LIST.md`; **DATA** = `/home/user/final/tools/ai-act-explorer/ai-act-data.json`; **BOOK** = `/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf`; **CAT** = `/home/user/final/tools/use-case-catalogue/index.html` (`<script id="data">`).

Page numbers are PDF pages. Verdict words: **confirmed**, **wrong**, **partly right**, **cannot be checked locally**. A verdict is on the researcher's claim, not on the team. No web research was done.

Summary of verdicts (detail and quotations in the sections below):

| # | Claim | Verdict |
|---|---|---|
| 1 | Art. 25(4) open-source carve-out predates the Omnibus | Confirmed |
| 2 | Art. 99(1) already had "warnings and non-monetary measures"; Art. 99(6) not amended | Confirmed |
| 3 | Small mid-caps: lower-of cap for Art. 99(4), (5) only | Confirmed |
| 4 | Art. 4 not in Art. 99(4); Art. 26 is; Arts. 6(4), 49(2), 27, 86 absent | Confirmed |
| 5 | Art. 50(1) is a provider duty; deployer duties are 50(3), 50(4); fineable under 99(4)(g) | Confirmed |
| 6 | Art. 50(3) notice applies from 2 Aug 2026 | Confirmed (one literal-text caveat on legacy systems) |
| 7 | Art. 111(2) covers "operators"; "type and model" is recital-only | Confirmed; one extra ambiguity found (cut-off date wording) |
| 8 | Machinery moved to Section B; Art. 2(2) limits the articles that apply | Confirmed |
| 9 | Predictive maintenance falls inside Art. 6(1a) unless 6(1b) applies | Partly right (6(1b) confirmed; "predictive maintenance" is not in the text) |
| 10 | Art. 5(1)(f) does not mention biometric data; candidates covered | First part confirmed; candidates cannot be checked locally |
| 11 | 1:1 verification is excluded in Annex III 1(a) itself | Confirmed |
| 12 | Annex III 1(b), 1(c), 3, 5(b), 5(d) wording | Confirmed (5(d) not limited to public authorities; fraud exception in text) |
| 13 | Art. 63(1) excludes SMEs with partner or linked enterprises | Confirmed |
| 14 | Art. 43(1): notified body unless harmonised standards fully applied | Confirmed |
| 15 | Art. 26(7) = workers; 26(11) = people subject to decisions | Confirmed |
| 16 | Art. 2(1)(c) "is used" vs recital 22 "intended to be used" | Confirmed |
| 17 | Arts. 25 and 26 apply only from 2 Dec 2027 (Annex III) | Confirmed |
| 18 | Penalties chapter has applied since 2 Aug 2025 | Confirmed; team wording imprecise, not flatly wrong |
| 19 | Art. 5(1)(ba), (bb) from 2 Dec 2026; Art. 111(4) says "placed on the market" | Confirmed |
| 20 | Booklet A6 counts; two of the 13 are maintenance uses that do not match the catalogue | Counts 3, 13, 11 confirmed; mismatch confirmed; only 4 "can become prohibited" entries visible in the A6 table against "Five" in the text |
| 21 | Transparency guidelines reference | Booklet prints C(2026) 7702 final, 5 Nov 2026; cannot be checked locally |

---

## 1. Value chain and penalties: what the Omnibus changed in Arts. 25 and 99 (claims 1–4)

### Takeaway
Two statements in the team's revision list and data file are wrong on the text: the Art. 25(4) open-source carve-out and the "warnings and non-monetary measures" wording were both in the June 2024 regulation. The team's penalty table itself (tiers, SME rule, small mid-cap rule limited to Art. 99(4) and (5), literacy outside Art. 99(4)) matches the text.

### Cited Findings

**Claim 1. Art. 25(4) open-source carve-out. Verdict: confirmed (the team's LIST and DATA are wrong on this point).**
- Base text, Art. 25(4), first subparagraph, last sentence: "This paragraph shall not apply to third parties making accessible to the public tools, services, processes, or components, other than general-purpose AI models, under a free and open-source licence." — [BASE p.67](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=67)
- Omnibus point (12)(b) replaces that first subparagraph. The carve-out sentence is word-for-word the same. The only change in the subparagraph is in the list of supplied items: base "supplies an AI system, tools, services, components, or processes"; Omnibus "supplies an AI system, AI model, tools, services, components, or processes". — [OMNI p.20](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=20)
- Team says: LIST line 87, "**Add the open-source carve-out.** Art. 25(4) (p.20) now provides that the written-agreement duty … does **not** apply"; DATA `switchConsequences.omnibusCorrection`: "open-source carve-out and the Art. 99(4)(da) fine hook are new"; DATA `omnibusAmended.points[11]`: "now expressly does NOT apply". — [LIST](../../docs/d7-governance/OMNIBUS-REVISION-LIST.md); [DATA](../../tools/ai-act-explorer/ai-act-data.json)
- Consolidated position: the carve-out exists and is correctly described; it is a 2024 rule, not an Omnibus addition. What is new in Art. 25 is "AI model" in 25(4), the three enumerated cooperation limbs in 25(2), and the fine hook in Art. 99(4)(da). — [OMNI pp.19–20, 35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=19)

**Claim 2. Art. 99(1), (4), (6), (6a). Verdict: confirmed.**
- Base Art. 99(1): "Member States shall lay down the rules on penalties and other enforcement measures, which may also include warnings and non-monetary measures, applicable to infringements of this Regulation by operators … They shall take into account the interests of SMEs, including start-ups, and their economic viability." — [BASE p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- Omnibus Art. 99(1) as replaced: "which may also include administrative fines, warnings and non-monetary measures, applicable to any infringement of this Regulation by operators … The Member States shall take into account the interests of SMEs, including start-ups, and SMCs, and their economic viability when imposing penalties." — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- So the Omnibus changed four things in paragraph 1: it added "administrative fines" to the list; "infringements" became "any infringement"; "and SMCs" was added; the last sentence now names the Member States and adds "when imposing penalties". "Warnings and non-monetary measures" is unchanged 2024 wording.
- Omnibus point (38)(b): "in paragraph 4, the following point is inserted: '(da) obligations of providers and operators pursuant to Article 25(2) and (4)'". Point (38)(c): "the following paragraph is inserted: '6a. In the case of SMCs, each fine referred to in paragraphs 4 and 5 shall be up to the percentages or amount referred therein, whichever is lower.'" — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- Art. 99(6) itself is not amended. Point (38) has three sub-points only: (a) paragraph 1, (b) paragraph 4 point (da), (c) new paragraph 6a. Base Art. 99(6) stands: "In the case of SMEs, including start-ups, each fine referred to in this Article shall be up to the percentages or amount referred to in paragraphs 3, 4 and 5, whichever thereof is lower." — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35); [BASE p.116](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=116)
- Team says: LIST lines 58–60, "Art. 99(1) was replaced (p.35). Two additions: Penalties may now include warnings and non-monetary measures, not only administrative fines"; DATA `penalties.omnibusCorrection` and `omnibusAmended.points[37]` say the same. This has it the wrong way round: the 2024 text had warnings and non-monetary measures and the Omnibus added the words "administrative fines". — [LIST](../../docs/d7-governance/OMNIBUS-REVISION-LIST.md); [DATA](../../tools/ai-act-explorer/ai-act-data.json)

**Claim 3. Small mid-caps and Art. 5 fines. Verdict: confirmed.**
- Art. 99(6a) refers to "paragraphs 4 and 5" only (quoted above). Art. 99(3) (Art. 5 breaches) keeps "whichever is higher" for small mid-caps: "administrative fines of up to EUR 35 000 000 or, if the offender is an undertaking, up to 7 % of its total worldwide annual turnover for the preceding financial year, whichever is higher". — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35); [BASE p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- SMEs get the lower-of rule for all three tiers, including Art. 5 (base Art. 99(6), "paragraphs 3, 4 and 5"). — [BASE p.116](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=116)
- The team's material agrees: DATA "Lower-amount rule for Art. 99(4) and (5) only, not for prohibitions"; BOOK p.9 fine table, prohibited-practice row: "SMEs: whichever is lower. Small mid-caps: whichever is higher". — [DATA](../../tools/ai-act-explorer/ai-act-data.json); [BOOK p.9](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=9)

**Claim 4. The Art. 99(4) list. Verdict: confirmed.**
- Art. 99(4) as consolidated lists: "(a) obligations of providers pursuant to Article 16; (b) obligations of authorised representatives pursuant to Article 22; (c) obligations of importers pursuant to Article 23; (d) obligations of distributors pursuant to Article 24; [(da) obligations of providers and operators pursuant to Article 25(2) and (4);] (e) obligations of deployers pursuant to Article 26; (f) requirements and obligations of notified bodies pursuant to Article 31, Article 33(1), (3) and (4) or Article 34; (g) transparency obligations for providers and deployers pursuant to Article 50." — [BASE p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115); [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- Art. 4 is not in the list. Art. 26 is (point (e)). Arts. 6(4), 27, 49(2) and 86 are not named.
- Nuance: Art. 49(1) registration is reached indirectly, because Art. 16 point (i) reads "comply with the registration obligations referred to in Article 49(1)". Art. 49(2) (registration of systems the provider has filtered out under Art. 6(3)) is not in Art. 16. — [BASE p.62](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=62)
- Art. 6(4) and Art. 49(2) are addressed to the provider only: "A provider who considers that an AI system referred to in Annex III is not high-risk shall document its assessment … Such provider shall be subject to the registration obligation set out in Article 49(2)." The Omnibus has no amendment point for Art. 6(4) or Art. 49; its recital 22 says this registration "should be simplified" while "it remains crucial … that such AI systems are registered", and point (42) deletes Annex VIII Section B points 7 and 9. — [BASE p.54](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=54); [OMNI pp.8, 36](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=8)
- Breaches outside the Art. 99(3)–(5) lists are left to national rules under Art. 99(1) ("applicable to any infringement of this Regulation by operators"). — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- Team says the same on literacy: DATA `crossCuttingDuty.penaltyNote`, "AI literacy (Art. 4) is NOT among the obligations listed in Art. 99(4)"; BOOK p.9, "AI Act: AI literacy — Set by each EU country". — [DATA](../../tools/ai-act-explorer/ai-act-data.json); [BOOK p.9](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=9)

### Inferences
- The LIST's sentence on Art. 99(1) and its "Add the open-source carve-out" heading, and the matching DATA fields (`penalties.omnibusCorrection`, `omnibusAmended.points[37]`, `switchConsequences.omnibusCorrection`, `omnibusAmended.points[11]`, `corrections.items[6]` and `[12]`, scenarios P1 and P5 `omnibusCorrection`), all need the same one-line correction: the rule exists; it is not new.
- The transparency note's remark that its own brief listed Art. 99(6) as amended is right on the text: 99(6) is untouched.

### Gaps
- Whether a Member State has set a fine for Art. 4, Art. 6(4), Art. 27 or Art. 86 cannot be checked from the two regulations.

---

## 2. Transparency: who owes what under Art. 50, and from when (claims 5, 6)

### Takeaway
Art. 50(1) and 50(2) are addressed to providers; a hotel that only uses a vendor's chatbot has no duty under 50(1). The deployer duties are 50(3) and 50(4), both fineable under Art. 99(4)(g), and all of Art. 50 has applied since 2 August 2026.

### Cited Findings

**Claim 5. Verdict: confirmed.**
- Art. 50(1): "Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system, unless this is obvious from the point of view of a natural person who is reasonably well-informed, observant and circumspect, taking into account the circumstances and the context of use." No deployer is named. — [BASE p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- Art. 50(2): "Providers of AI systems, including general-purpose AI systems, generating synthetic audio, image, video or text content, shall ensure that the outputs of the AI system are marked in a machine-readable format". — [BASE p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- Art. 50(3): "Deployers of an emotion recognition system or a biometric categorisation system shall inform the natural persons exposed thereto of the operation of the system, and shall process the personal data in accordance with Regulations (EU) 2016/679 …". — [BASE p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- Art. 50(4): "Deployers of an AI system that generates or manipulates image, audio or video content constituting a deep fake, shall disclose that the content has been artificially generated or manipulated." Second subparagraph: "Deployers of an AI system that generates or manipulates text which is published with the purpose of informing the public on matters of public interest shall disclose that the text has been artificially generated or manipulated", except where the content "has undergone a process of human review or editorial control and where a natural or legal person holds editorial responsibility". — [BASE p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- Art. 50(5) names no addressee. It sets the manner and timing for whoever holds a duty under paragraphs 1 to 4: "The information referred to in paragraphs 1 to 4 shall be provided to the natural persons concerned in a clear and distinguishable manner at the latest at the time of the first interaction or exposure. The information shall conform to the applicable accessibility requirements." — [BASE p.83](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=83)
- Fineable: Art. 99(4)(g), "transparency obligations for providers and deployers pursuant to Article 50". — [BASE p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- The Omnibus amends only Art. 50(7) (codes of practice). Paragraphs 1 to 6 are unchanged. — [OMNI p.22](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=22)
- Team data error found while checking: DATA `obligationsByRoleAndTier[2].deployer[2]` reads "Inform people exposed to emotion recognition or biometric categorisation (Art. 50(3)-(4))". That duty is Art. 50(3) only; 50(4) is deep fakes and public-interest text. — [DATA](../../tools/ai-act-explorer/ai-act-data.json)

**Claim 6. Art. 50(3) timing. Verdict: confirmed.**
- Art. 113, second paragraph, unchanged: "It shall apply from 2 August 2026." Art. 50 is Chapter IV. — [BASE pp.82, 123](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=123)
- The Omnibus postponement is limited to Chapter III: "(c) Chapter III, Sections 1, 2, and 3, with the exception of Article 6(5), shall apply from: (i) 2 December 2027 as regards AI systems classified as high-risk pursuant to Article 6(2) and Annex III; and (ii) 2 August 2028 as regards AI systems classified as high-risk pursuant to Article 6(1) and Annex I". Chapter IV is not mentioned. — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- Art. 50(6): "Paragraphs 1 to 4 shall not affect the requirements and obligations set out in Chapter III". The notice duty is separate from high-risk status. — [BASE p.83](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=83)
- Team says: DATA `biometricFindings[3].hotelRelevance`, "voice agents and call analytics with guest-emotion features are high-risk from 2 Dec 2027; deployers must inform callers (Art. 50(3))". The sentence gives one date for two duties; the notice duty date (2 Aug 2026) is not stated there. BOOK p.7 gives the general rule correctly: "the duty to tell people they deal with AI since 2 Aug 2026". — [DATA](../../tools/ai-act-explorer/ai-act-data.json); [BOOK p.7](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=7)

### Inferences
- The high-risk note's point 9 (the team attaches the caller notice to the 2 Dec 2027 finding) is fair as a criticism of one DATA sentence, not of the booklet's timeline.
- The transparency note's point 13 (for a vendor bot the hotel holds no Art. 50(1) duty) follows from the word "Providers" in 50(1). Whether a hotel that configures and brands a vendor bot becomes its provider is a separate question that the text of Art. 50 does not answer.

### Gaps
- The Commission's reading of "obvious" (BOOK: customer chatbots "do not count as obviously AI") comes from guidelines that are not in the repository; the Act's own words are the contextual test quoted above.

---

## 3. Dates and legacy systems: Arts. 111 and 113 as amended (claims 7, 17, 18, 19)

### Takeaway
The researchers' reading of the dates is right on every point checked: Arts. 25 and 26 sit in the postponed block, the penalties chapter has applied since 2 August 2025, and Art. 111(2) speaks of "operators", so it reaches deployers. The "same type and model" extension is recital-only, and the new cut-off wording ("date of application of Chapter III") is less precise than the team's "2 Dec 2027".

### Cited Findings

**Claim 7. Art. 111(2). Verdict: confirmed, with one additional textual ambiguity.**
- Base: "this Regulation shall apply to operators of high-risk AI systems, other than the systems referred to in paragraph 1 of this Article, that have been placed on the market or put into service before 2 August 2026, only if, as from that date, those systems are subject to significant changes in their designs. In any case, the providers and deployers of high-risk AI systems intended to be used by public authorities shall take the necessary steps to comply with the requirements and obligations of this Regulation by 2 August 2030." — [BASE p.121](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=121)
- Omnibus, full replacement: "2. Without prejudice to the application of Article 5 as referred to in Article 113, third paragraph, point (a), this Regulation shall apply to operators of high-risk AI systems, other than the systems referred to in paragraph 1 of this Article, that have been placed on the market or put into service before the date of application of Chapter III referred to in Article 113, only if, as from that date, those systems are subject to significant changes in their designs. In any case, the providers and deployers of high-risk AI systems intended to be used by public authorities shall take the necessary steps to comply with the requirements and obligations laid down in this Regulation by 2 August 2030." — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- "Operators" covers deployers: Art. 3(8), "'operator' means a provider, product manufacturer, deployer, authorised representative, importer or distributor". — [BASE p.46](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=46)
- Omnibus recital 39: "the grace period should apply where the type and model of AI system has already been placed on the market. This means that if at least one individual unit of the high-risk AI system has been lawfully placed on the market or put into service before the date specified in Article 111(2), other individual units of the same type and model of high-risk AI system are subject to the grace period … and thus may continue to be placed on the market, made available or put into service on the Union market without any additional obligations, requirements or the need for additional certification, as long as the design of that high-risk AI system remains unchanged." And: "Any significant change to the design of that AI system after the date specified in Article 111(2) should trigger the obligation of the provider to fully comply with all relevant provisions". — [OMNI p.12](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=12)
- Base recital 177: "only if, from that date, those systems are subject to significant changes in their design or intended purpose. It is appropriate to clarify that, in this respect, the concept of significant change should be understood as equivalent in substance to the notion of substantial modification". The recital adds "or intended purpose"; the article says only "designs". — [BASE p.44](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=44)
- Art. 5: left unaffected in express words ("Without prejudice to the application of Article 5"). Art. 50: not mentioned in Art. 111(2) either way. The only Art. 50 transition in Art. 111 is the new paragraph 4, for Art. 50(2) marking. — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- Additional ambiguity (not raised by the researchers): the article's cut-off is "the date of application of Chapter III referred to in Article 113". Art. 113 gives Chapter III more than one date: Section 4 from 2 August 2025 (point (b), base), Sections 1 to 3 from 2 December 2027 or 2 August 2028 (point (c), Omnibus), and Section 5 under the general date. Recital 39 speaks of systems placed on the market "before the relevant provisions of Regulation (EU) 2024/1689 apply", which supports reading the cut-off as 2 Dec 2027 / 2 Aug 2028. The team's "before 2 Dec 2027 (2 Aug 2028 for regulated products)" (BOOK p.7; DATA `boundaries[1]`, marked "settled") follows that reading; it is the sensible one but it is not the literal wording. — [OMNI pp.12, 35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35); [BASE p.123](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=123); [BOOK p.7](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=7)
- Team says on Art. 50: BOOK p.7, "The duty to tell people they deal with AI has no such exemption: it covers older chatbots and phone agents too.²"; DATA attributes this to the transparency guidelines. The regulation text neither states nor denies it. — [BOOK p.7](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=7)

**Claim 17. Arts. 25 and 26 application dates. Verdict: confirmed.**
- Chapter III, Section 3 is headed "Obligations of providers and deployers of high-risk AI systems and other parties" and starts at Art. 16; Arts. 25, 26 and 27 are inside it. — [BASE pp.62, 67, 69](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=62)
- Art. 113, third paragraph, point (c) as replaced (quoted in section 2): Sections 1, 2 and 3 apply from 2 December 2027 for Annex III systems and from 2 August 2028 for Annex I systems. Omnibus recital 40 confirms the intent: "the date of application of Sections 1, 2 and 3 of Chapter III is set to 2 December 2027 … and to 2 August 2028". — [OMNI pp.12, 35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- Under the base text these articles would have applied from the general date, 2 August 2026 (base point (c) delayed only "Article 6(1) and the corresponding obligations" to 2 August 2027). — [BASE p.123](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=123)
- Not postponed: Section 5 of Chapter III (Arts. 40–49, including Art. 43 conformity assessment and Art. 49 registration) is not in the amended point (c). In practice those articles only bite on systems that are high-risk under Sections 1 to 3. — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)

**Claim 18. Penalties chapter date. Verdict: confirmed; the team's timeline wording is imprecise.**
- Art. 113(b), unchanged: "Chapter III Section 4, Chapter V, Chapter VII and Chapter XII and Article 78 shall apply from 2 August 2025, with the exception of Article 101". Chapter XII is headed "Penalties" and begins with Art. 99. — [BASE pp.115, 123](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=123)
- Team says: DATA `timeline`, 2 Aug 2025: "GPAI model rules and governance apply"; 2 Aug 2026: "General application. Transparency (Art. 50) applies. Enforcement starts". — [DATA](../../tools/ai-act-explorer/ai-act-data.json)
- What supports the team's wording in part: Chapter IX ("Post-market monitoring, information sharing and market surveillance", Arts. 72–94) is not in point (b) except Art. 78, so the market surveillance powers apply from the general date, 2 August 2026. — [BASE pp.101, 123](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=123)
- Consolidated: Arts. 99 and 100 have applied since 2 August 2025; Art. 5 since 2 February 2025; market surveillance procedures since 2 August 2026. The 2 Aug 2025 timeline entry omits penalties.

**Claim 19. New prohibitions and Art. 111(4). Verdict: confirmed.**
- Art. 5(1)(ba): "the placing on the market, the putting into service or the use of an AI system that generates or manipulates realistic images, videos, audio or similar material of an identifiable natural person's intimate parts, or of an identifiable natural person engaged in sexually explicit activities, without that person's freely-given, specific, informed, unambiguous and explicit consent for that generation or manipulation". Art. 5(1)(bb): "… generates or manipulates material or performance within the meaning of Article 2, points (c) and (e), of Directive 2011/93/EU, except where a 'without right' defence applies under national law". — [OMNI p.18](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=18)
- Art. 5(1a)(b): "the use of an AI system that generates or manipulates the material … is only prohibited where the deployer uses the system for the purpose of generating or manipulating such material or performance." — [OMNI p.18](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=18)
- Date: Art. 113, third paragraph, point (a) as replaced: "Chapters I and II shall apply from 2 February 2025, with the exception of Article 5(1), first subparagraph, points (ba) and (bb), and Article 5(1a) and (1b) which shall apply from 2 December 2026". — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- Art. 111(4): "Providers of AI systems, including general-purpose AI systems, generating synthetic audio, image, video or text content, that have been placed on the market before 2 August 2026 shall take the necessary steps in order to comply with Article 50(2) by 2 December 2026." The words are "placed on the market"; "put into service" does not appear (compare Art. 111(2), which has both). Recital 38 also says "placed their systems on the market". — [OMNI pp.12, 35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- Team says: DATA timeline, "Marking deadline for synthetic-content generators already on the market"; BOOK p.12, "generators placed on the market before 2 Aug 2026 must comply by 2 Dec 2026". Both match the text. Neither addresses in-house generators that were only put into service; the text is silent on them. — [DATA](../../tools/ai-act-explorer/ai-act-data.json); [BOOK p.12](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=12)

### Inferences
- The scope note's observation that Art. 111(2), read literally, says "this Regulation shall apply … only if", and so would also switch off Art. 4 and Art. 50 for legacy high-risk systems, is a fair reading of the words. The text does not resolve it. The team's narrower position rests on Commission guidelines not held locally.
- The high-risk note's point 8 (team material does not say that Art. 111(2) reaches deployer duties, or mention "type and model") is accurate as to DATA `boundaries[1]` and BOOK p.7: both describe the rule for "a high-risk tool" without naming who is relieved, and neither mentions recital 39.

### Gaps
- What counts as a "significant change" for continuously updated software: the two texts give only recital 177's equation with "substantial modification". Cannot be settled locally.
- Whether Art. 50 applies to legacy high-risk systems covered by Art. 111(2): cannot be settled from the regulation text.

---

## 4. Product route: Annex I, Art. 2(2), Art. 6(1a)–(1c) (claims 8, 9)

### Takeaway
Machinery did move to Section B, and for Section B products only Art. 6(1), Art. 60a and Arts. 102 to 112 apply. Lifts, gas appliances and pressure equipment stay in Section A. The text does not name predictive maintenance; whether it is inside the Art. 6(1a) carve-out is a reading, limited by the Art. 6(1b) claw-back.

### Cited Findings

**Claim 8. Machinery and Art. 2(2). Verdict: confirmed.**
- Base Annex I, Section A, point 1: "Directive 2006/42/EC … on machinery". — [BASE p.124](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=124)
- Omnibus point (41): "(a) in Section A, point 1 is deleted; (b) in Section B, the following point is added: '21. Regulation (EU) 2023/1230 … on machinery …'". — [OMNI p.36](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=36)
- Base Art. 2(2): "only Article 6(1), Articles 102 to 109 and Article 112 apply. Article 57 applies only in so far as the requirements for high-risk AI systems under this Regulation have been integrated in that Union harmonisation legislation." — [BASE p.45](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=45)
- Omnibus Art. 2(2): "For AI systems classified as high-risk AI systems in accordance with Article 6(1) related to products covered by the Union harmonisation legislation listed in Section B of Annex I, only Article 6(1), Article 60a and Articles 102 to 112 shall apply. Articles 57, 58 and 59 shall apply only in so far as the requirements for high-risk AI systems under this Regulation have been integrated in that Union harmonisation legislation." — [OMNI p.15](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=15)
- Consolidated list of articles that still apply to Section B high-risk systems: Art. 6(1); Art. 60a; Arts. 102, 103, 104, 105, 106, 107, 108, 109, 110, 111 and 112; and Arts. 57, 58, 59 conditionally. Arts. 8–27 (including Art. 26 deployer duties) are not in the list.
- Recital 42 states the purpose: "the application of Regulation (EU) 2024/1689 to those machines should be limited to the provisions referred to in Article 2(2)", with AI requirements to be added to the Machinery Regulation by delegated acts that "should apply by 2 August 2028". — [OMNI pp.13, 39–40](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=13)
- Still in Section A after the Omnibus: point 4 lifts (Directive 2014/33/EU), point 7 pressure equipment (Directive 2014/68/EU), point 10 gas appliances (Regulation (EU) 2016/426), point 11 medical devices, point 2 toys. — [BASE p.124](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=124)
- Team data is internally inconsistent here, as the audit note says (its C7): DATA `annexIIIReference.annexI.hospitalityNote` still lists "lifts, machinery, automated doors, pool plant, kitchen machinery" as reachable, while `netHotelPosition` in the same object says exposure "reduces to safety-critical AI in lifts, gas appliances and pressure equipment". — [DATA](../../tools/ai-act-explorer/ai-act-data.json)

**Claim 9. Art. 6(1a)–(1c). Verdict: partly right.**
- Art. 6(1a): "For the purposes of this Regulation, including paragraph 1 of this Article, AI systems that are solely used for non-safety related aspects of user assistance, performance optimisation, service efficiency, automation or convenience or quality control shall not qualify as safety components." — [OMNI p.18](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=18)
- Art. 6(1b): "Notwithstanding paragraph 1a, AI systems the failure or malfunctioning of which would endanger health and safety shall qualify as safety components." — [OMNI p.18](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=18)
- Art. 6(1c): "A product that is required to undergo a third-party conformity assessment solely due to risks other than risks to health and safety, in particular risks relating to the distribution of radio spectrum or electromagnetic interference that do not affect health and safety, shall not be considered as fulfilling the condition in paragraph 1, point (b)." — [OMNI p.18](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=18)
- Art. 3(14) as amended adds: "for the purposes of this definition, a component fulfils a safety function where its intended purpose is to prevent or mitigate risks to health and safety of persons or property". — [OMNI p.16](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=16)
- Omnibus recital 7: "this does not include AI systems which are intended to solely fulfil functions related to user assistance, performance optimisation, service efficiency, automation, convenience, or non-safety related aspects for quality control operations. The mere fact that an AI system is integrated into or operates within a product that is subject to Union harmonisation legislation does not, in itself, mean that it fulfils a safety function." — [OMNI p.3](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=3)
- Neither regulation uses the words "predictive maintenance" or "maintenance" in Art. 6 or recital 7 (my search of both texts). So: the 6(1b) claw-back is confirmed as text; that fault prediction for lifts or gas equipment is "performance optimisation" or "service efficiency" is the audit researcher's reading, not a statement in the law. The result turns on two facts the text leaves to the case: whether the tool is "solely" used for non-safety aspects, and whether its "failure or malfunctioning … would endanger health and safety".

### Inferences
- The high-risk note's exit 28 ("SAFE [text] as to AI Act Arts. 8–27" for machinery) matches Art. 2(2) as replaced.
- Read literally, Art. 2(2) says "only" the listed articles apply to those systems, which would also leave out Arts. 4, 5 and 50 for them. No researcher relies on this and the text does not address it.

### Gaps
- Whether a given hotel product (automatic door, kitchen robot) falls under the Machinery Regulation, and whether it needs third-party conformity assessment, depends on sectoral law not held locally.
- The team's statement that lift door-timing AI is a safety component "even if its intended purpose is efficient operation" is attributed to draft guidelines (para 46) not in the repository: cannot be checked locally.

---

## 5. Biometrics and emotion recognition: Art. 5(1)(f), Art. 3(39), Annex III point 1 (claims 10, 11)

### Takeaway
The prohibition in Art. 5(1)(f) does not contain the words "biometric data"; the limit to biometric data comes from the Art. 3(39) definition and recitals 18 and 44. The exclusion of one-to-one verification is written into Annex III point 1(a) itself, so the booklet's "(draft guidance)" mark understates its footing.

### Cited Findings

**Claim 10. Verdict: confirmed on wording; "candidates" cannot be checked locally.**
- Art. 5(1)(f): "the placing on the market, the putting into service for this specific purpose, or the use of AI systems to infer emotions of a natural person in the areas of workplace and education institutions, except where the use of the AI system is intended to be put in place or into the market for medical or safety reasons". No reference to biometric data and no use of the defined term "emotion recognition system". — [BASE p.51](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=51)
- Art. 3(39): "'emotion recognition system' means an AI system for the purpose of identifying or inferring emotions or intentions of natural persons on the basis of their biometric data". — [BASE p.48](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=48)
- Recital 44 links the ban to biometric data: "AI systems identifying or inferring emotions or intentions of natural persons on the basis of their biometric data may lead to discriminatory outcomes … Therefore, the placing on the market, the putting into service, or the use of AI systems intended to be used to detect the emotional state of individuals in situations related to the workplace and education should be prohibited. That prohibition should not cover AI systems placed on the market strictly for medical or safety reasons, such as systems intended for therapeutical use." — [BASE p.12](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=12)
- Recital 18 on fatigue and pain: "It does not include physical states, such as pain or fatigue, including, for example, systems used in detecting the state of fatigue of professional pilots or drivers for the purpose of preventing accidents. This does also not include the mere detection of readily apparent expressions, gestures or movements, unless they are used for identifying or inferring emotions." — [BASE p.5](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=5)
- Recital 44 on workplaces: "Considering the imbalance of power in the context of work or education, combined with the intrusive nature of these systems". — [BASE p.12](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=12)
- Job candidates: the word "candidates" appears once in the base regulation, in Annex III point 4(a) ("to evaluate candidates"), not in Art. 5(1)(f), recital 18 or recital 44 (full-text search). Art. 5(1)(f) says "in the areas of workplace". Whether recruitment is inside "the areas of workplace" is not stated in either regulation. — [BASE pp.51, 127](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=127)
- Team says: BOOK p.4 and p.13, banned is "A tool that reads staff or job candidates' emotions from their face or voice", cited to ¹ (the Act) and ³ (Commission guidelines on prohibited practices, C(2025) 5052 final). DATA `employmentFindings[6]` says "Recital 44 grounds the workplace emotion-recognition prohibition in the structural power imbalance between employers and workers or candidates"; recital 44's own words are "the imbalance of power in the context of work or education" with no mention of candidates. — [BOOK pp.4, 13](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=13); [DATA](../../tools/ai-act-explorer/ai-act-data.json)
- The Omnibus does not amend Art. 5(1)(f) or Art. 3(39). — [OMNI pp.16, 18](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=18)

**Claim 11. Annex III point 1(a). Verdict: confirmed.**
- Annex III point 1: "Biometrics, in so far as their use is permitted under relevant Union or national law: (a) remote biometric identification systems. This shall not include AI systems intended to be used for biometric verification the sole purpose of which is to confirm that a specific natural person is the person he or she claims to be". — [BASE p.127](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=127)
- Art. 3(36): "'biometric verification' means the automated, one-to-one verification, including authentication, of the identity of natural persons by comparing their biometric data to previously provided biometric data". — [BASE p.48](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=48)
- Recital 17: "This excludes AI systems intended to be used for biometric verification, which includes authentication, the sole purpose of which is to confirm that a specific natural person is the person he or she claims to be and to confirm the identity of a natural person for the sole purpose of having access to a service, unlocking a device or having security access to premises." — [BASE p.5](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=5)
- Recital 54: "Such a classification excludes AI systems intended to be used for biometric verification, including authentication, the sole purpose of which is to confirm that a specific natural person is who that person claims to be and to confirm the identity of a natural person for the sole purpose of having access to a service, unlocking a device or having secure access to premises." — [BASE p.15](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=15)
- Team says: BOOK p.5, "Face check-in that matches a guest's selfie to their own ID document is not high-risk (draft guidance)⁸". DATA quotes the Annex text correctly in `annexIIIReference.areas[0].subPoints[0].text`. The Omnibus does not amend Annex III. — [BOOK p.5](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=5); [DATA](../../tools/ai-act-explorer/ai-act-data.json)

### Inferences
- The audit note's finding "under-claimed: the exclusion is in the text" is correct. The booklet could cite the Act (¹) for the core case and keep "(draft guidance)" for edge cases such as matching against a list of enrolled guests.
- Because Art. 5(1)(f) does not use the defined term, the text alone leaves open whether non-biometric emotion inference at work (for example from typed text) is banned. The booklet's "Analysing the text of guest reviews or messages is not emotion recognition" concerns guests, where Art. 3(39) is the relevant term, so it is not affected.

### Gaps
- Whether Art. 5(1)(f) covers job candidates and whether it is limited to biometric data: the answer the researchers and the team give comes from the Commission's prohibited-practices guidelines, which are not in the repository. Cannot be checked locally.

---

## 6. Annex III wording: points 1(b), 1(c), 3, 5(b), 5(d) (claim 12)

### Takeaway
The researchers quote the Annex correctly. The fraud-detection exception is in the text of point 5(b), and point 5(d), unlike point 5(a), is not limited to public authorities.

### Cited Findings
- Point 1(b): "AI systems intended to be used for biometric categorisation, according to sensitive or protected attributes or characteristics based on the inference of those attributes or characteristics". Point 1(c): "AI systems intended to be used for emotion recognition." — [BASE p.127](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=127)
- Point 3 (education and vocational training), four sub-points, each tied to "educational and vocational training institutions at all levels": (a) "to determine access or admission or to assign natural persons"; (b) "to evaluate learning outcomes, including when those outcomes are used to steer the learning process"; (c) "assessing the appropriate level of education that an individual will receive or will be able to access"; (d) "monitoring and detecting prohibited behaviour of students during tests". — [BASE p.127](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=127)
- Point 5(b): "AI systems intended to be used to evaluate the creditworthiness of natural persons or establish their credit score, with the exception of AI systems used for the purpose of detecting financial fraud". The fraud exception is in the text. Verdict: confirmed. — [BASE p.127](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=127)
- Point 5(d): "AI systems intended to evaluate and classify emergency calls by natural persons or to be used to dispatch, or to establish priority in the dispatching of, emergency first response services, including by police, firefighters and medical aid, as well as of emergency healthcare patient triage systems." No "public authorities" limit. Compare point 5(a), which is limited: "intended to be used by public authorities or on behalf of public authorities". Verdict: confirmed. — [BASE pp.127–128](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=127)
- The Omnibus does not amend Annex III (its annex changes are Annex I, Annex VIII and a new annex of codes). — [OMNI pp.36–38](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=36)
- Team says on 1(b): DATA `hotelUse`, "Inferring protected traits from biometrics is prohibited outright under Art. 5, not merely high-risk." Recital 54 shows 1(b) keeps its own scope: biometric categorisation "according to sensitive attributes or characteristics protected under Article 9(1) of Regulation (EU) 2016/679 on the basis of biometric data, in so far as these are not prohibited under this Regulation … should be classified as high-risk". So the high-risk note's criticism (its point 4, "over-broad") is supported by the recital. — [DATA](../../tools/ai-act-explorer/ai-act-data.json); [BASE p.15](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=15)
- Team says on fraud: BOOK p.19, "Fraud detection is excluded from the credit-scoring category.¹" Accurate as a statement of point 5(b). — [BOOK p.19](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=19)

### Inferences
- The high-risk note's point 5 (5(d) is not limited to public authorities, so "Not a hotel exposure … settled" is stronger than the text) is right on wording. Whether any hotel tool "evaluates and classifies emergency calls" is a question of fact the text does not answer.

### Gaps
- Art. 5(1)(g) (the prohibition side of biometric categorisation) was not re-read line by line for this check; the 1(b) finding rests on Annex III and recital 54.
- The team's readings of points 4(b) and 5(b) that rest on draft guideline paragraph numbers cannot be checked locally.

---

## 7. Provider-side and deployer-side duties: Arts. 63(1), 3(14a)/(14b), 43(1), 26 (claims 13, 14, 15)

### Takeaway
All three claims are confirmed. The simplified quality-management route is closed to SMEs with partner or linked enterprises, a biometric (Annex III point 1) system needs a notified body unless harmonised standards or common specifications are applied in full, and Art. 26(7) and 26(11) protect different people.

### Cited Findings

**Claim 13. Art. 63(1). Verdict: confirmed.**
- Base: "Microenterprises within the meaning of Recommendation 2003/361/EC may comply with certain elements of the quality management system required by Article 17 of this Regulation in a simplified manner, provided that they do not have partner enterprises or linked enterprises within the meaning of that Recommendation." — [BASE p.95](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=95)
- Omnibus: "SMEs, including start-ups, may comply with certain elements of the quality management system required by Article 17 in a simplified manner, provided that they do not have partner enterprises or linked enterprises within the meaning of Recommendation 2003/361/EC." Small mid-caps are not named in Art. 63(1). — [OMNI p.26](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=26)
- Art. 63(2), unchanged: paragraph 1 does not exempt "from fulfilling any other requirements or obligations laid down in this Regulation, including those established in Articles 9, 10, 11, 12, 13, 14, 15, 72 and 73". — [BASE p.95](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=95)
- Art. 3(14a): "'micro, small and medium-sized enterprise' or 'SME' means a micro, small or medium-sized enterprise as defined in Article 2 of the Annex to Recommendation 2003/361/EC". Art. 3(14b): "'small mid-cap enterprise' or 'SMC' means a small mid-cap enterprise as defined in point (2) of the Annex to Recommendation (EU) 2025/1099". — [OMNI p.16](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=16)
- Small mid-caps do get Art. 17(2) proportionality ("in particular, if the provider is an SME, including a start-up, or an SMC") and the Art. 11(1) simplified documentation form. — [OMNI p.19](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=19)

**Claim 14. Art. 43(1). Verdict: confirmed.**
- "For high-risk AI systems listed in point 1 of Annex III, where … the provider has applied harmonised standards referred to in Article 40, or, where applicable, common specifications referred to in Article 41, the provider shall opt for one of the following conformity assessment procedures based on: (a) the internal control referred to in Annex VI; or (b) the assessment of the quality management system and the assessment of the technical documentation, with the involvement of a notified body, referred to in Annex VII." — [BASE p.78](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=78)
- "the provider shall follow the conformity assessment procedure set out in Annex VII where: (a) harmonised standards referred to in Article 40 do not exist, and common specifications referred to in Article 41 are not available; (b) the provider has not applied, or has applied only part of, the harmonised standard; (c) the common specifications referred to in point (a) exist, but the provider has not applied them; (d) one or more of the harmonised standards referred to in point (a) has been published with a restriction, and only on the part of the standard that was restricted." — [BASE p.78](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=78)
- The rule makes no distinction for in-house systems. The Omnibus replaces only Art. 43(3). — [OMNI p.22](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=22)
- Team says: DATA `obligationsByRoleAndTier[1].provider[3]`, "for Annex III points 2-8, including employment, this is internal control without a notified body (Art. 43(2))". Correct, and silent on point 1, as the researcher says. — [DATA](../../tools/ai-act-explorer/ai-act-data.json)

**Claim 15. Art. 26. Verdict: confirmed.**
- Art. 26(7): "Before putting into service or using a high-risk AI system at the workplace, deployers who are employers shall inform workers' representatives and the affected workers that they will be subject to the use of the high-risk AI system." — [BASE p.68](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=68)
- Art. 26(11): "Without prejudice to Article 50 of this Regulation, deployers of high-risk AI systems referred to in Annex III that make decisions or assist in making decisions related to natural persons shall inform the natural persons that they are subject to the use of the high-risk AI system." — [BASE p.69](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=69)
- So 26(7) covers "workers' representatives and the affected workers"; candidates and guests, as natural persons subject to decisions, fall under 26(11). Art. 26(7) does not name candidates.
- Art. 26(5): "Where deployers have reason to consider that the use of the high-risk AI system in accordance with the instructions may result in that AI system presenting a risk within the meaning of Article 79(1), they shall, without undue delay, inform the provider or distributor and the relevant market surveillance authority, and shall suspend the use of that system." — [BASE p.68](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=68)
- Art. 26(12): "Deployers shall cooperate with the relevant competent authorities in any action those authorities take in relation to the high-risk AI system in order to implement this Regulation." — [BASE p.69](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=69)
- Art. 26 is not amended by the Omnibus (no amendment point between Art. 25 and Art. 27). — [OMNI pp.19–20](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=20)
- Team says: DATA scenario D4 (`scenarios[3].obligations[5]`), "Inform workers' representatives and candidates", with no article given in that line; `obligationsByRoleAndTier[1].deployer[6]` cites Art. 26(7) for workers. — [DATA](../../tools/ai-act-explorer/ai-act-data.json)

### Inferences
- The high-risk note's exit 33 ("group-owned hotels fail the Art. 63 condition") follows from the "partner enterprises or linked enterprises" condition, but whether a given hotel company has such enterprises depends on Recommendation 2003/361/EC, which is not held locally.

### Gaps
- Whether harmonised standards covering all Section 2 requirements exist in November 2026 (the team's DATA mentions "EN 18286:2026") cannot be checked locally; the notified-body consequence under Art. 43(1) depends on it.

---

## 8. Territorial scope: Art. 2(1)(c) versus recital 22 (claim 16)

### Takeaway
The mismatch is real: the article says output "is used in the Union", the recital says output "is intended to be used in the Union". The team's wording follows the article.

### Cited Findings
- Art. 2(1)(c): "providers and deployers of AI systems that have their place of establishment or are located in a third country, where the output produced by the AI system is used in the Union". Verdict: confirmed. — [BASE p.45](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=45)
- Recital 22: "this Regulation should also apply to providers and deployers of AI systems that are established in a third country, to the extent the output produced by those systems is intended to be used in the Union." — [BASE p.6](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=6)
- The Omnibus amends Art. 2(2) and 2(7) and adds 2(13); Art. 2(1) is unchanged. — [OMNI pp.15–16](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=15)
- Team says: DATA `scope.hospitalityNote`, "A non-EU hotel group whose AI output is used in the EU can therefore be in scope"; BOOK p.20, "It also covers makers and users outside the EU whose AI output is used in the EU.¹" Both track the article's wording. — [DATA](../../tools/ai-act-explorer/ai-act-data.json); [BOOK p.20](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=20)

### Inferences
- None beyond the text. Which reading prevails is not decided in either regulation.

### Gaps
- The law-firm readings cited in the scope note are secondary and were not re-checked.

---

## 9. The booklet's counts on page A6 and the maintenance entries (claim 20)

### Takeaway
The booklet's counts of 3, 13 and 11 can be reproduced from its own A6 table. Two of the 13 "high-risk if…" entries are lift-door AI and hotel-run gas or pressure safety AI, while the catalogue's two matching uses are predictive maintenance, so the audit note's mismatch claim is confirmed. The table shows four "can become prohibited" entries against "Five" in the text.

### Cited Findings
- BOOK text: "Of the 91 AI uses on our list (A1), 3 are high-risk as normally used and 13 more become high-risk depending on how they are set up; 11 of those 16 concern staff and sit in six departments, not only HR. Five can become prohibited through a single feature, and 11 must tell people they are dealing with AI or label realistic AI images." — [BOOK p.7](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=7)
- A6 table, my count of entries from the extracted text — [BOOK p.8](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=8):
  - High-risk (3): "Recruiting"; "matching seasonal staff to properties"; "Scoring reservation agents' calls". Matches.
  - High-risk if… (13): rotas that rank staff; training assessments that decide pay or promotion; attrition scores used to end contracts; phone agents that read callers' emotions or recognise them by voiceprint; room assignment that ranks attendants; room inspection that rates attendants; in-room voice assistants that read guests' emotions; food-waste cameras used to rate individual cooks; cameras that recognise guests at a distance or read crowd mood; dashboards that rank individual staff; "Lift door and obstacle AI (the lift maker's duty)"; "hotel-run safety AI for gas or pressure equipment (rare)"; stock-loss alerts used to judge staff. Matches.
  - Must say it is AI or label it (11): hiring chatbot; phone agents; booking assistant; misleading AI images; AI-written health, safety or sustainability claims; guest chat; digital concierge; in-room voice assistant; ordering bots; table-booking phone agents; robots that converse. Matches.
  - Can become prohibited: four entries are visible: "Reading candidates' emotions in video interviews"; "coaching or wellbeing tools that read staff emotions"; "Scoring reservation agents' emotions from their voice"; "Cameras that read staff emotions". The text says "Five". The A6 table as extracted does not show a fifth; elsewhere the booklet has "Pricing designed to exploit a guest's age, disability or …" (p.16) and "sensitive traits" (p.18), either of which may be the fifth. Verdict on "5": cannot be reproduced from the A6 table alone.
  - "11 of those 16 concern staff": 3 high-risk plus rotas, training, attrition, room assignment, room inspection, food-waste cameras, dashboards, stock-loss alerts = 11. Matches.
- CAT, uses 51 and 52 in catalogue order (department "Maintenance & Engineering"): #51 "Predictive maintenance - OEM-connected equipment (lifts, escalators, doors)", task "OEM remote monitoring predicts faults before breakdown and dispatches technicians"; #52 "Predictive maintenance - hotel-run across assets (HVAC, kitchen, technical devices)", task "Predict faults across hotel equipment from sensor and ticket history to move from reactive to planned work (announced only)". The catalogue holds 91 uses. No catalogue use is described as lift-door control or gas-combustion safety AI. — [CAT](../../tools/use-case-catalogue/index.html)
- BOOK p.19 describes the safety case separately from maintenance prediction: "AI that controls lift doors or gas boiler combustion can be one (draft guidance)⁸; that is the maker's duty from 2 Aug 2028". — [BOOK p.19](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=19)
- Verdict on the audit note's claim: confirmed as a mismatch between what the booklet counts (door control, gas or pressure safety AI) and what the catalogue lists (fault prediction). Whether fault prediction is outside the high-risk route is the Art. 6(1a)/(1b) question in section 4 (partly right, not settled by the text).

### Inferences
- If the 13 are meant to be counted from the 91 catalogue uses, the two maintenance entries describe a different function from the catalogue rows they stand for; the count would be 11 on a strict match, or the two rows need the condition "if the AI also controls a safety function".

### Gaps
- The catalogue has no use ids; "#51" and "#52" are positions in catalogue order (my count agrees with the audit note's numbering).
- The booklet table was read from `pdftotext -layout` output, not from the rendered page; cell boundaries were inferred from the text flow.

---

## 10. The booklet's reference for the Commission's transparency guidelines (claim 21)

### Takeaway
The booklet and the data file both print "C(2026) 7702 final", dated 5 November 2026. The transparency researcher reports web sources giving C(2026) 5054 final (published 20 July 2026) and an OJ reference C/2026/6005 (12 November 2026). This cannot be resolved from the local texts.

### Cited Findings
- BOOK reference 2, exactly as printed: "European Commission. (2026, November 5). Guidelines on the implementation of the transparency obligations for certain AI systems under Article 50 of Regulation (EU) 2024/1689 (the 'AI Act') (C(2026) 7702 final)." No URL is printed for this entry. — [BOOK p.24](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=24)
- DATA `transparencyGuidelines`: document "… C(2026) 7702 final"; `adopted`: "2026-11-05"; `status`: "Final. Not binding; only the CJEU gives the authoritative reading (para 5)."; `confidence`: "settled"; `localFile`: "../03 EU AI Act/Commission guidance/2026-11-05_EC_Art50-transparency-guidelines_C(2026)7702.pdf". — [DATA](../../tools/ai-act-explorer/ai-act-data.json)
- That local file is not in the repository: a search of `/home/user/final` for "7702", "Art50" and "transparency-guidelines" in file names returned nothing.
- Researcher's report (secondary, not re-checked by me): content published 20 July 2026 under C(2026) 5054 final; OJ reference C/2026/6005 reported for 12 November 2026; no source found for "7702". — [transparency_literacy_enforcement.md, section 11 item 2](transparency_literacy_enforcement.md)
- Neither regulation PDF mentions the guidelines by number (both predate them). Verdict: cannot be checked locally.

### Inferences
- The team's file name suggests a PDF dated 5 November 2026 exists outside the repository; the document number on its cover page is the quickest way to settle the conflict.

### Gaps
- No web search was run for this item. The document number, the adoption date and the OJ reference all remain unverified.

---

## 11. Other points found while checking

### Takeaway
Six further points came up: one page-citation error in a research note, one count that checks out, and textual details on Art. 4, Art. 3(14) and the literal breadth of two provisions.

### Cited Findings
- **Wrong page numbers in the prohibited-practices note.** It cites the amended Art. 113 point (a) and Art. 111(2) at "PDF p. 38" of the Omnibus (its lines 32, 306, 377, 394). Both are on p.35; p.38 holds the end of the new annex and the amendments to Regulation (EU) 2018/1139. The quotations themselves are accurate. — [OMNI pp.35, 38](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35); [prohibited_practices.md](prohibited_practices.md)
- **"43 amendment points" (LIST, DATA): confirmed.** Article 1 of the Omnibus runs from point (1) to point (43). — [OMNI pp.15–36](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=15)
- **Art. 4 as replaced.** Base: "shall take measures to ensure, to their best extent, a sufficient level of AI literacy of their staff". Omnibus: "shall take measures to support the development of AI literacy of their staff and other persons dealing with the operation and use of AI systems on their behalf … This obligation does not require providers or deployers to guarantee any specific level of AI literacy of any individual." BOOK p.5 matches: "hotels must support their staff … No particular level has to be reached by each person." — [BASE p.51](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=51); [OMNI p.16](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=16); [BOOK p.5](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf#page=5)
- **Art. 99(4)(da) addressees.** The new point reads "obligations of providers and operators pursuant to Article 25(2) and (4)", so it is not limited to providers. — [OMNI p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- **Art. 25(2) carve-out wording changed slightly.** Base: the initial provider "does not fall under the obligation to hand over the documentation". Omnibus: "does not fall under the obligation to cooperate with the new providers and hand over the documentation". — [BASE p.67](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=67); [OMNI p.20](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=20)
- **Art. 2(13) scope.** "the application of specific requirements or obligations laid down in Articles 9 to 15 and 17 to 25 may be limited" for Section A products, by delegated acts due "By 2 August 2027". Art. 26 is outside that range, as the high-risk note says (exit 39). — [OMNI p.16](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=16)

### Inferences
- None of the five notes was found to misquote the regulation text in the passages checked. The errors found are in the team's LIST and DATA (two "new" labels that are not new, one "Art. 50(3)-(4)" citation), one imprecise timeline label, and page numbers in one research note.

### Gaps
- Only the claims listed in the assignment and the notes' "problems in the team's material" sections and registers were checked. Register rows that rest on draft Commission guidelines (paragraph numbers given as team data) were not verified, because the drafts are not in the repository.
- The booklet was checked only on the pages cited above (pp. 4, 5, 7, 8, 9, 12, 13, 16, 18, 19, 20, 24), not page by page.
