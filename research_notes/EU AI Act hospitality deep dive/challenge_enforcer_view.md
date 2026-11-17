# Enforcer's challenge to the exits and "loopholes" found in the EU AI Act for hotels (state of the law, November 2026)

**What this note is.** An adversarial re-read of the exit and grey-area registers in the five research notes, taking the side of a market surveillance authority (MSA), a data protection authority (DPA), a works-council lawyer and a consumer plaintiff. Each exit rated "safe" or "conditional" gets my own verdict: **HOLDS**, **HOLDS ONLY IF…**, or **FAILS**.

**Sources and tags.**
- BASE = Regulation (EU) 2024/1689, [EU AI Act June 2024.pdf](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf). OMNI = Regulation (EU) 2026/1744, [Digital Omnibus July 2026.pdf](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf). Page numbers are PDF pages (they match the "n/144" and "n/41" footers). Both read with `pdftotext -layout`; for every article I read the base text and then checked whether OMNI replaced it.
- Notes challenged: [scope](scope_definitions_exclusions.md), [prohibited](prohibited_practices.md), [high-risk](high_risk_classification_and_duties.md), [transparency](transparency_literacy_enforcement.md), [coverage audit](hotel_use_case_coverage_audit.md).
- Tags: **[text]** = read in the regulation PDFs this session. **[notes]** = taken from a researcher's note. **[secondary]** = web search summary only (pages could not be opened). **[my inference]** = my own argument. Where an inference leans on general EU law that I did not re-read this session (GDPR, consumer directives, CJEU case law, national labour law), it says "from memory, not verified".
- Dates used throughout: high-risk rules apply from **2 Dec 2027 (Annex III)** and **2 Aug 2028 (Annex I)** [text: OMNI Art. 1(40), p.35]. Art. 5 has applied since 2 Feb 2025; Art. 50 and the penalty chapter since 2 Aug 2026.

**Overall result.** Of the exits the researchers rated "safe", I would downgrade seven to "holds only if" and I think two rest on a reading of the text an enforcer can attack directly (staff text-sentiment under Art. 5(1)(f); "rules-based = not AI"). The researchers read the articles accurately almost everywhere; the weak points are (a) exits that rest on recitals or Commission guidelines being presented as "[text]", and (b) exits that are true for the AI Act but have already been fined under GDPR.

---

## 1. The legacy rule (Art. 111(2) as replaced; OMNI recital 39; BASE recital 177)

### Takeaway
On the text, the researchers are right that Art. 111(2) switches off deployer duties as well as provider duties, because it speaks of "operators". The extension to later purchases of the same model is **recital-only** and is the weakest part: my verdict is **HOLDS ONLY IF** the hotel's own unit was in service before the date, the design is frozen, and the purpose is unchanged; for a unit bought after the date, and for any SaaS tool, an enforcer has a good argument that it **FAILS**.

### Cited Findings
- [text] Art. 111(2) as replaced: "Without prejudice to the application of Article 5 … this Regulation shall apply to operators of high-risk AI systems … that have been placed on the market or put into service before the date of application of Chapter III referred to in Article 113, only if, as from that date, those systems are subject to significant changes in their designs. In any case, the providers and deployers of high-risk AI systems intended to be used by public authorities shall take the necessary steps to comply … by 2 August 2030." — [OMNI Art. 1(39)(a), p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [text] "operator" includes the deployer: "'operator' means a provider, product manufacturer, deployer, authorised representative, importer or distributor" — [BASE Art. 3(8), p.46](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=46)
- [text] The base version said the same with a fixed date ("before 2 August 2026 … significant changes in their designs"). The words "or intended purpose" are **not** in either version of the article; they are only in BASE recital 177 ("significant changes in their design or intended purpose", "equivalent in substance to the notion of substantial modification") — [BASE Art. 111(2), p.121](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=121); [BASE recital 177, p.44](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=44)
- [text] The "type and model" extension is in OMNI recital 39 only: "if at least one individual unit of the high-risk AI system has been lawfully placed on the market or put into service before the date … other individual units of the same type and model … are subject to the grace period … and thus may continue to be placed on the market, made available or put into service … without any additional obligations … as long as the design of that high-risk AI system remains unchanged." It ends: "Any significant change to the design … should trigger the obligation of the provider to fully comply". — [OMNI recital 39, p.12](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=12)
- [text] The article's subject is the individual system: systems "that have been placed on the market or put into service". "Placing on the market" is "the first making available of an AI system"; "putting into service" is "the supply of an AI system for first use directly to the deployer or for own use" — [BASE Art. 3(9), 3(11), p.47](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=47)
- [text] "Substantial modification" is defined against "the initial conformity assessment carried out by the provider": a change "not foreseen or planned in the initial conformity assessment" that affects compliance with Chapter III Section 2 "or results in a modification to the intended purpose" — [BASE Art. 3(23), p.47](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=47)
- [text] OMNI added Art. 111(4): providers of generative systems "placed on the market before 2 August 2026 shall … comply with Article 50(2) by 2 December 2026" — [OMNI Art. 1(39)(b), p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [text] Art. 113(b) gives a different, earlier date for part of Chapter III: "Chapter III Section 4 … shall apply from 2 August 2025" — [BASE Art. 113(b), p.123](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=123)
- [notes] Researchers' position: high-risk row 15 "CONDITIONAL; unreliable for SaaS", with conditions "no significant design or purpose change"; scope G23 "CONDITIONAL; in practice FALSE for SaaS"; high-risk inference 8 says the rule "switches off deployer duties as well as provider duties" and that "recital 39 extends it to later purchases of the same type and model" — [high-risk §8](high_risk_classification_and_duties.md); [scope §4, §6](scope_definitions_exclusions.md)
- [secondary] One law-firm summary (Cuatrecasas) restates the "type and model" test; a pre-adoption commentary (Simmons & Simmons) treated the Art. 111(2) question as open; Lewis Silkin notes deployers' competence and training duties under Art. 26(2) — [Cuatrecasas](https://www.cuatrecasas.com/en/spain/intellectual-property/art/digital-omnibus-ai-has-been-published); [Simmons & Simmons](https://www.simmons-simmons.com/en/publications/cmoveo6ke00icuxskpgueb0od/ai-omnibus-update); [Lewis Silkin](https://www.lewissilkin.com/insights/2026/07/27/the-digital-omnibus-on-ai-enters-into-force-today-102nedo)

### Inferences
**Did the researchers get the text right?** Yes on the article wording and on "operators". One slip: high-risk row 15 lists "purpose change" as a condition of the article; the article says "designs" only, and "intended purpose" comes from recital 177. This matters because the enforcer's purpose argument (below) has to be built another way. [my inference from text]

**My verdict by fact pattern** [all my inference]:

| Claim | Verdict | Enforcer's argument | Caught anyway by |
|---|---|---|---|
| "Our on-premise HR tool was in service at our hotel before 2 Dec 2027 and is unchanged, so we owe no Art. 26 duties" | HOLDS ONLY IF the hotel can prove the date of first use, the version, and that nothing significant changed | A derogation is read narrowly and the party relying on it must prove its conditions. No version log, no exit | GDPR (transparency, DPIA, Art. 22 automated decisions); works-council information and co-determination rights; Art. 5; Art. 50; Art. 4 |
| "We bought another licence / opened a new hotel in 2028 with the same model, recital 39 covers it" | FAILS as a safe basis; arguable | (1) The article exempts systems "that have been placed on the market or put into service" before the date. A unit first supplied to this hotel in 2028 was put into service in 2028. (2) Only the recital says "type and model". EU courts treat recitals as interpretive aids that cannot override or widen the operative text (settled case law, from memory, not verified). (3) Recital 39 is written for the supply side ("may continue to be placed on the market, made available or put into service") and ends by naming "the obligation of the provider"; it says nothing about a new deployer's use duties. (4) The recital's own condition is stricter than the article: design "remains unchanged", not "no significant change" | Same as above |
| "It is SaaS, first sold in 2026" | FAILS in practice | Legacy systems never had an "initial conformity assessment", so no change can be "foreseen or planned" in one (Art. 3(23)). Every retraining or model swap that affects accuracy, robustness or oversight is therefore an unplanned change touching Section 2 requirements. A vendor that updates monthly cannot show a frozen design, and the hotel cannot audit it | Same; plus the vendor's own exposure makes it likely to drop the legacy claim |
| "The design is the same, we just started using it to rank staff" | FAILS | A new use is a new "putting into service … for its intended purpose" after the date (Art. 3(11)); recital 177 treats purpose change as a significant change; and the hotel becomes provider under Art. 25(1)(c) | Annex III 4(b); GDPR |
| "Legacy status also switches off Art. 50 and Art. 4 for that system" | FAILS | Art. 111(2) is addressed to operators "of high-risk AI systems" in that capacity. Art. 111(4) sets a separate transition for Art. 50(2), which would be pointless if legacy systems were outside Art. 50. Art. 4 binds "providers and deployers of AI systems" generally | Art. 50; Art. 4; consumer law |
| "A vendor placed one token unit on the market in November 2027 to grandfather the whole product line" | FAILS | Abuse of a transitional rule; recital 39 requires the unit to be "lawfully placed" and an MSA will ask for evidence of a real supply | Art. 99(5) for misleading information to authorities |

- **Art. 26 duties that are about use, not the system.** I looked for a textual hook to separate "use" duties (Art. 26(2) oversight staffing, 26(7) informing workers before use, 26(11) informing affected persons) from system duties. There is none: the article says "this Regulation shall apply to operators … only if". So where the legacy rule applies, all of Art. 26 falls away. The enforcer's route is therefore not to split Art. 26 but to deny legacy status (table above) and to use other law. [my inference from text]
- **Other law does the same job for workers.** Informing staff and their representatives before introducing a monitoring or evaluation system is already required by national labour law in most Member States, and Art. 2(11) AI Act preserves more favourable worker rules [notes: scope G11]. A works council does not need Art. 26(7). [my inference; national law from memory, not verified]
- **A minor textual hazard.** Art. 111(2) now points to "the date of application of Chapter III referred to in Article 113". Art. 113 gives three dates for parts of Chapter III (2 Aug 2025 for Section 4; 2 Dec 2027 and 2 Aug 2028 for Sections 1-3). The natural reading is the 2027/2028 pair, and recital 39 does not say otherwise, but the cut-off is less cleanly drafted than the notes suggest. [my inference from text]
- **State-linked hotels.** The 2 Aug 2030 long-stop applies to systems "intended to be used by public authorities". A state-owned hotel company or a hotel run for a public body should not assume the open-ended exemption. [my inference from text]

### Gaps
- No court or authority has interpreted "significant changes in their designs" or the "type and model" recital; none could have, since the high-risk regime is not yet applicable.
- I could not open any commentary page; the three secondary sources are search summaries.
- CJEU case law on the weight of recitals and on strict reading of derogations is cited from memory.

---

## 2. "A hotel that only deploys a vendor chatbot owes nothing under Art. 50(1)"

### Takeaway
Correct on the text of Art. 50(1), which binds providers only. But the exit is narrower than "the vendor owes it, not us": many hotels are the **provider** of their bot under Art. 3(3) because they assemble or commission it and run it under their own name, and a hidden bot is a consumer-law problem regardless. Verdict: **HOLDS ONLY IF** the bot is a vendor's finished product, used as supplied, with the vendor's notice left on.

### Cited Findings
- [text] Art. 50(1): "Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system, unless this is obvious…" — [BASE Art. 50(1), p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- [text] Art. 50(5): "The information referred to in paragraphs 1 to 4 shall be provided to the natural persons concerned in a clear and distinguishable manner at the latest at the time of the first interaction or exposure." Art. 50(6): paragraphs 1 to 4 are "without prejudice to other transparency obligations laid down in Union or national law for deployers of AI systems" — [BASE Art. 50(5)-(6), p.83](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=83)
- [text] OMNI changed only Art. 50(7) (codes of practice) — [OMNI Art. 1(20), p.22](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=22)
- [text] Provider: one that "develops an AI system … or that has an AI system … developed and places it on the market or puts the AI system into service under its own name or trademark, whether for payment or free of charge". Putting into service includes supply "for own use" — [BASE Art. 3(3), p.46; Art. 3(11), p.47](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=46)
- [text] "Downstream provider": "a provider of an AI system … which integrates an AI model, regardless of whether the AI model is provided by themselves … or provided by another entity based on contractual relations" — [BASE Art. 3(68), p.50](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=50)
- [text] Art. 25(1) applies only to high-risk systems ("shall be considered to be a provider of a high-risk AI system") — [BASE Art. 25(1), p.67](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=67)
- [text] Art. 26 is headed "Obligations of deployers of high-risk AI systems"; Art. 26(11) (inform persons subject to a high-risk system) is "Without prejudice to Article 50" — [BASE Art. 26, pp.67-69](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=67)
- [text] Fine basis: "transparency obligations for providers and deployers pursuant to Article 50", up to EUR 15 000 000 or 3 % — [BASE Art. 99(4)(g), p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- [text] The AI Act is added to the Annex of the Representative Actions Directive (EU) 2020/1828 — [BASE Art. 110, p.121](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=121)
- [notes] Transparency note: "We are only the deployer" is CONDITIONAL; white-label bots are a grey area; "a fine on a pure deployer for a missing chatbot notice has no clear legal basis" — [transparency §1, §9 row 1](transparency_literacy_enforcement.md)

### Inferences
**Did the researcher get the text right?** Yes. The transparency note is the most careful of the five on this point and already rates the exit conditional. My disagreement is about how often the condition is met. [my inference]

**Enforcer's arguments** [all my inference]:
1. **Most "hotel bots" are the hotel's own system.** If a group or its agency builds a concierge on a general-purpose model's API, with its own system prompt, knowledge base and PMS connection, the group "has an AI system developed" and puts it into service "for own use" under its own name. That is a provider under Art. 3(3) and a downstream provider under Art. 3(68). No Art. 25 switch is needed, so the fact that Art. 25 is limited to high-risk systems does not help. The same is true of a bot built on a vendor's no-code "bot builder": the builder is a tool; the thing that talks to guests is what the hotel assembled.
2. **Configuration is a spectrum.** Choosing a name, logo and FAQ content in a finished chatbot product does not make the hotel a provider. Writing the instructions that determine how it behaves, connecting it to booking tools, or giving it a human persona moves towards "developing". An MSA will look at who decided how the system behaves, not at the invoice.
3. **Art. 50(5) is written in the passive.** It requires that the information "shall be provided … at the latest at the time of the first interaction" without naming who provides it. An enforcer can argue it is a result duty that falls on whoever controls the interface. This is weaker than argument 1 but it gives Art. 99(4)(g) something to bite on.
4. **Switching the notice off.** If the vendor's product lets a hotel disable the notice, the vendor is in breach of "designed and developed in such a way". Vendors will therefore forbid it by contract; a hotel that does it anyway is in breach of contract and has created a misleading omission.
5. **High-risk bots.** A candidate-screening or interview chatbot is Annex III 4(a). From 2 Dec 2027 the hotel owes Art. 26(11) notice as deployer, and if it brands the bot it becomes provider under Art. 25(1)(a) and then owes Art. 50(1) itself.

**Other law that catches a silent bot** [my inference; directives from memory, not verified this session]:
- Unfair Commercial Practices Directive 2005/29/EC: omitting information the average consumer needs, or creating a false impression about the nature of the service or who is speaking, is a misleading practice. Enforced by consumer authorities, by competitors and trade associations in several Member States, and by representative actions.
- GDPR Arts. 5(1)(a) and 13: fair and transparent processing of the guest's chat data; Art. 22 if the bot decides something with legal or similar effect (for example refusing a booking).
- Art. 4 AI Act: staff who run the bot need appropriate AI literacy measures.
- Contract and tort: a hotel is bound by, or liable for, what its bot tells a guest about price or cancellation terms; "the vendor's bot said it" is not a defence against the guest.

**Verdict.** HOLDS ONLY IF (a) finished vendor product, (b) no behaviour-defining build by the hotel, (c) notice left on and shown in the first turn. The practical advice in the transparency note (check the notice is on; keep the vendor's confirmation) is right, but the booklet should not tell hotels that "the vendor owes the notice" as a general rule. [my inference]

### Gaps
- The final Commission transparency guidelines (5 Nov 2026) were not readable this session; I do not know whether they say when configuring a product makes the deployer a provider, or who is addressed by Art. 50(5).
- No enforcement decision under Art. 50 was found (it has applied for three months).
- I did not re-read the coverage audit's chatbot rows; I cannot say whether that note repeats the unqualified "vendor owes it" claim.

---

## 3. Machinery moved to Annex I Section B and Art. 2(2): no deployer duties for AI in kitchen, laundry, door and robot machinery?

### Takeaway
On the text, yes for one thing only: the **safety-component AI system classified as high-risk under Art. 6(1)**. For that system the hotel owes no Art. 26 duties. Verdict **HOLDS ONLY IF** the AI function really is the Art. 6(1) safety component; every other AI function in the same machine (talking, seeing people, tracking staff) stays fully inside the AI Act, and workplace-safety, product-safety and data-protection law apply to the machine as before.

### Cited Findings
- [text] Art. 2(2) as replaced: "For AI systems classified as high-risk AI systems in accordance with Article 6(1) related to products covered by the Union harmonisation legislation listed in Section B of Annex I, only Article 6(1), Article 60a and Articles 102 to 112 shall apply." — [OMNI Art. 1(1)(a), p.15](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=15)
- [text] Annex I: "in Section A, point 1 is deleted" and Section B gains "21. Regulation (EU) 2023/1230 … on machinery" — [OMNI Art. 1(41), p.36](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=36)
- [text] The recital explains the intent: application of the AI Act to those machines "should be limited to the provisions referred to in Article 2(2)", and the Commission must amend the Machinery Regulation "to reflect the relevant requirements set out in Chapter III, Section 2, and Articles 17, 19, 72 and 73" — [OMNI recital, p.13](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=13)
- [text] Section B systems "are, for most purposes, not directly subject to that Regulation" — [OMNI recital, p.9](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=9)
- [text] Art. 6(1a)-(1b): systems "solely used for non-safety related aspects of user assistance, performance optimisation, service efficiency, automation or convenience or quality control shall not qualify as safety components", but "AI systems the failure or malfunctioning of which would endanger health and safety shall qualify as safety components" — [OMNI Art. 1(8), p.18](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=18)
- [text] Annex III is a separate route: 1(a) remote biometric identification, 1(c) emotion recognition, 4(b) systems "to monitor and evaluate the performance and behaviour of persons" at work — [BASE Annex III, p.127](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=127)
- [notes] High-risk row 28: "SAFE [text] as to AI Act Arts. 8–27"; scope G14: "SAFE EXIT from AI Act Chapter III duties (including Art. 26 for the hotel) … Literal text would also switch off Arts. 4, 5 and 50 for it, which cannot be intended: grey" — [high-risk §8](high_risk_classification_and_duties.md); [scope §6](scope_definitions_exclusions.md)

### Inferences
**Did the researchers get the text right?** Yes. The mirrored requirements named in the recital (Section 2 and Arts. 17, 19, 72, 73) are all manufacturer-side; Art. 26 is not on the list, so the notes are right that no deployer duty is planned to return through the Machinery Regulation. I would not call the exit "SAFE" without the limits below. [my inference from text]

**Enforcer's arguments** [all my inference]:
1. **Art. 2(2) is about a system and a classification, not about a machine.** It shields "AI systems classified as high-risk … in accordance with Article 6(1)". A cooking robot's collision-avoidance model may be that system. Its voice interface is not (Art. 50(1) applies). Its camera feed used to score how fast cooks work is not (Annex III 4(b), high-risk from 2 Dec 2027). A door system that recognises faces is Annex III 1(a) whatever the door's CE file says. Each of these keeps the full AI Act, including Art. 26.
2. **Dual classification.** Where one system is both an Art. 6(1) safety component and an Annex III use, Art. 6(2) says Annex III systems are high-risk "in addition"; a derogation for the Art. 6(1) classification does not remove the Annex III one.
3. **Art. 5 is not switched off.** Art. 2(2) limits which provisions apply to a class of high-risk systems; Art. 5 bans practices. A robot that infers staff emotions is prohibited regardless. I agree with the scope note that the literal wording is clumsy, but no authority will read it as a licence.
4. **Non-safety AI in machines was never high-risk** (Art. 6(1a)) so Art. 2(2) is irrelevant to it; it is an ordinary AI system with Art. 4 and Art. 50 duties where relevant.

**What still applies to the hotel** [my inference; non-AI-Act instruments from memory, not verified this session]:
- Employer duties for work equipment and risk assessment under EU and national occupational safety law: a kitchen or laundry with autonomous machinery needs an updated risk assessment, training and maintenance regime.
- The Machinery Regulation itself (manufacturer duties; self-learning safety functions are in its highest-scrutiny category) and, from 2 Aug 2028, AI requirements added to it by delegated act [text for the date: OMNI recital p.13]. A hotel that modifies or retrains the machine risks becoming the manufacturer under that law.
- Product liability and ordinary negligence towards guests and staff injured by the machine.
- GDPR for every camera and sensor on the machine; works-council rights where the machine's data can show individual performance.
- Art. 4 AI literacy for staff operating it.

**Verdict.** HOLDS ONLY IF the AI function is the certified safety component and nothing else. The booklet sentence should be "the safety AI inside the machine is regulated through machinery law, not through your AI Act deployer duties", not "AI in machinery is outside the AI Act".

### Gaps
- I did not have the Machinery Regulation text locally; statements about its categories and about who becomes manufacturer after modification are from memory.
- No delegated act under the Machinery Regulation exists yet, so whether user-side duties will be added there is unknown.
- Whether any hotel kitchen or cleaning robot on sale today actually has an AI safety component requiring third-party assessment was not checked.

---

## 4. Emotion recognition exits: text-only, fatigue/pain, guest-only, voice transcribed to text

### Takeaway
The prohibition in Art. 5(1)(f) does not use the defined term "emotion recognition system" and does not contain the word "biometric"; the limit to biometric data comes from a definition, a recital and the Commission guidelines. So text-only analysis of **guest** content is safe, but text-only analysis of **staff** is safe only on the guidelines' reading, and "guest-only" voice analytics has already drawn a GDPR fine. Art. 5(1)(f) reaches the workplace, not guests as such; guests are covered by Annex III 1(c) (from 2 Dec 2027) and Art. 50(3) (now).

### Cited Findings
- [text] Art. 5(1)(f): "the use of AI systems to infer emotions of a natural person in the areas of workplace and education institutions, except where the use of the AI system is intended to be put in place or into the market for medical or safety reasons" — [BASE Art. 5(1)(f), p.51](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=51)
- [text] Defined term: "'emotion recognition system' means an AI system for the purpose of identifying or inferring emotions or intentions of natural persons on the basis of their biometric data" — [BASE Art. 3(39), p.48](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=48)
- [text] "Biometric data" in the AI Act has no identification requirement: "personal data resulting from specific technical processing relating to the physical, physiological or behavioural characteristics of a natural person" — [BASE Art. 3(34), p.48](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=48)
- [text] Recital 18: the notion "does not include physical states, such as pain or fatigue, including, for example, systems used in detecting the state of fatigue of professional pilots or drivers for the purpose of preventing accidents", nor "the mere detection of readily apparent expressions, gestures or movements, unless they are used for identifying or inferring emotions" — [BASE recital 18, p.5](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=5)
- [text] Recital 44 ties the ban to systems inferring emotions "on the basis of their biometric data" and to "the imbalance of power in the context of work or education" — [BASE recital 44, p.12](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=12)
- [text] Annex III 1(c): "AI systems intended to be used for emotion recognition" (the defined term) — [BASE Annex III, p.127](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=127)
- [text] Art. 50(3): "Deployers of an emotion recognition system or a biometric categorisation system shall inform the natural persons exposed thereto of the operation of the system, and shall process the personal data in accordance with" GDPR — [BASE Art. 50(3), p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- [secondary] Commission guidelines on prohibited practices: a call centre using webcams and voice recognition to track employees' emotions is prohibited; a call centre tracking its customers' emotions is outside Art. 5(1)(f); commentators note the provision "does not refer to 'emotion recognition systems', but only to 'AI systems to infer emotions of a natural person'"; the Commission reads intentions as covered — [FPF, Red Lines: emotion recognition](https://fpf.org/blog/red-lines-under-eu-ai-act-unpacking-the-prohibition-of-emotion-recognition-in-the-workplace-and-education-institutions/); [Lewis Silkin, 17 Feb 2025](https://www.lewissilkin.com/insights/2025/02/17/understanding-the-eu-ai-acts-prohibited-practices-key-workplace-and-advertising-102k011); [CMS, Part II](https://cms.law/en/mkd/legal-updates/eu-commission-issues-guidelines-on-prohibited-ai-practices-part-ii)
- [secondary] Enforcement precedent under GDPR, before the AI Act: the Hungarian DPA (NAIH) fined Budapest Bank HUF 250 million (sources give about EUR 653,000 to 675,675) for AI analysis of customer-service call recordings that assessed callers' emotional state and was also used to rate staff. Findings: privacy notice said nothing substantive about voice analysis; no adequate DPIA or legitimate-interest assessment; breaches of GDPR Arts. 5(1)(a), 6(1), 6(4). Who was assessed: one bank's customer-service calls; the software used speech-signal processing to detect keywords and emotion and stored results with the call for up to 45 days — [CMS, Hungary data authority fine](https://cms.law/en/hun/legal-updates/hungary-data-authority-issues-heavy-fine-for-the-use-of-ai-voice-recording-analysis); [CMS GDPR Enforcement Tracker Report, Hungary](https://cms.law/en/int/publication/gdpr-enforcement-tracker-report/hungary)
- [notes] Ratings challenged: high-risk row 21 "Text-only sentiment … SAFE [text]"; transparency row 12 "SAFE"; prohibited F1 "SAFE [text + secondary]" (with a note that "biometric" is not in Art. 5(1)(f)), F2 "CONDITIONAL", F3 "SAFE for fatigue and pain [text]", F8 guests "CONDITIONAL: not banned"; coverage D7 "Analyse the transcript text instead of the voice signal → Not emotion recognition" — [high-risk §8](high_risk_classification_and_duties.md); [transparency §9](transparency_literacy_enforcement.md); [prohibited §1](prohibited_practices.md); [coverage §4](hotel_use_case_coverage_audit.md)

### Inferences
[all my inference unless marked]

| Exit | My verdict | Enforcer's argument | Caught anyway by |
|---|---|---|---|
| Text sentiment of guest reviews, emails, chats | HOLDS | Not a workplace use; not biometric, so outside Annex III 1(c) and Art. 50(3) | GDPR (ordinary); nothing special |
| Text sentiment of **staff** messages, tickets, survey free text | HOLDS ONLY IF the guidelines' biometric reading is accepted by the authority and courts | Art. 5(1)(f) bans AI "to infer emotions of a natural person in the areas of workplace". It does not say "emotion recognition system" and does not say "biometric". The legislator used the defined term in Annex III 1(c) and Art. 50(3) and chose not to use it here. A recital cannot narrow a prohibition the article states without the limit. The guidelines are not binding on courts | Annex III 4(b) (monitoring "performance and behaviour" of workers, high-risk from 2 Dec 2027); GDPR (employee monitoring, DPIA); works-council co-determination on monitoring tools; typing-rhythm analysis is biometric in any case |
| Fatigue / pain detection for staff | HOLDS for the ban, on recital 18 and ordinary language (fatigue is not an emotion) | The product must output only the physical state. "Alertness", "stress", "engagement", "mood" outputs are emotions or intentions. Purpose must be accident prevention, not productivity | Annex III 4(b) if results reach the employer as monitoring; fatigue and pain are health data under GDPR, so a special-category basis in employment law is needed (from memory, not verified); works council |
| Guest-only emotion analysis (voice, face) | HOLDS ONLY IF staff are technically excluded | Text: the ban covers "a natural person in the areas of workplace", not "workers", so a literal reader could say a guest at reception is "in the area of" a workplace. Recital 44 (imbalance of power at work) and the guidelines point the other way, and I think the literal argument loses. The stronger attack is factual: a two-way call or a camera with waiters in frame analyses staff too | Art. 50(3) notice duty on the hotel as deployer now, fine up to EUR 15m / 3 % [text: Art. 99(4)(g)]; Annex III 1(c) high-risk from 2 Dec 2027; GDPR (the NAIH case is this exact fact pattern) |
| Voice transcribed to text, then text analysed | HOLDS ONLY IF the transcript carries words only | (1) The system takes voice in and puts an emotion score out; inserting a transcription step inside one product does not change what the inference is "on the basis of". The high-risk note itself rates "splitting into modules" FALSE (row 12). (2) Transcripts often carry pause, overlap, speaking-rate, loudness or "[laughs]" markers, which are voice characteristics. (3) For staff, the literal Art. 5(1)(f) needs no biometric data at all | Same as rows above; GDPR for call recording |

- **Does Art. 5(1)(f) reach guests?** Not as such. It reaches the workplace. Guests are protected by Annex III 1(c), Art. 50(3) and GDPR. The scope note was right to flag this as not answered by the text; the high-risk note states "Of guests: high-risk" as [text] with more confidence than the wording supports. [my inference]
- **"SAFE [text]" is the wrong label for staff text sentiment.** The article text is the problem, not the support. It should read "outside the ban on the Commission's reading; high-risk worker monitoring in any case". [my inference]
- **The prohibited note is right** that use is banned without the "for this specific purpose" qualifier that applies to placing on the market (F15), so a hotel switching on a staff-emotion module in a general analytics suite is exposed even where the vendor is not. [my inference from text]

### Gaps
- The Commission guidelines on prohibited practices were not readable; whether they address text-based inference about staff, or transcripts with paralinguistic markers, is not confirmed (search results did not cover either).
- I found no AI Act enforcement decision on Art. 5(1)(f).
- Whether the NAIH decision was appealed is unknown.

---

## 5. The Art. 6(3) filter, "allocation by availability only", and "switching a feature off"

### Takeaway
None of the three is a deployer's exit. The filter is a provider's documented self-assessment that dies on any profiling; availability-only rostering escapes one limb of Annex III 4(b) but not the "terms of work" limb; and a hotel cannot declassify a tool by configuration when the vendor's stated purpose still includes monitoring.

### Cited Findings
- [text] Art. 6(3): an Annex III system is not high-risk "where it does not pose a significant risk of harm … including by not materially influencing the outcome of decision making", if it performs "a narrow procedural task", improves "a previously completed human activity", detects decision patterns, or performs "a preparatory task". "Notwithstanding the first subparagraph, an AI system referred to in Annex III shall always be considered to be high-risk where the AI system performs profiling of natural persons." — [BASE Art. 6(3), p.54](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=54)
- [text] Art. 6(4): "A provider who considers that an AI system referred to in Annex III is not high-risk shall document its assessment before that system is placed on the market or put into service" and register it — [BASE Art. 6(4), p.54](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=54)
- [text] Art. 80 gives the MSA a procedure "for dealing with AI systems classified by the provider as non-high-risk in application of Annex III" — [BASE Art. 80, p.107](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=107)
- [text] Recital 53 example of a narrow procedural task: "an AI system that transforms unstructured data into structured data, an AI system that classifies incoming documents into categories or … detect duplicates among a large number of applications" — [BASE recital 53, p.14](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=14)
- [text] "Profiling" is the GDPR Art. 4(4) definition — [BASE Art. 3(52), p.49](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=49)
- [text] Annex III 4(a): systems "to analyse and filter job applications, and to evaluate candidates". 4(b): systems "intended to be used to make decisions affecting terms of work-related relationships, the promotion or termination of work-related contractual relationships, to allocate tasks based on individual behaviour or personal traits or characteristics or to monitor and evaluate the performance and behaviour of persons" — [BASE Annex III point 4, p.127](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=127)
- [text] "Intended purpose" is set by the provider: "the use for which an AI system is intended by the provider … as specified in the information supplied by the provider in the instructions for use, promotional or sales materials and statements, as well as in the technical documentation" — [BASE Art. 3(12), p.47](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=47)
- [text] Art. 26(1): deployers must use high-risk systems "in accordance with the instructions for use" — [BASE Art. 26(1), p.67](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=67)
- [notes] High-risk row 8 (filter: "CONDITIONAL; provider-only; public register"), row 4 (availability-only rota: "CONDITIONAL (draft; conflicts with para 259 on working time)"); coverage D1 (availability-only allocation "Outside the task-allocation limb of 4(b)"), U5-U6 (rota starts as "Minimal") and the booklet's vendor question "Can those features be switched off?" — [high-risk §8](high_risk_classification_and_duties.md); [coverage §4](hotel_use_case_coverage_audit.md)

### Inferences
[all my inference]

| Exit | My verdict | Enforcer's argument | Caught anyway by |
|---|---|---|---|
| Art. 6(3) for a CV parser | HOLDS ONLY IF it only extracts fields and nothing downstream in the same product ranks, scores, matches or filters | "Analyse and filter job applications" is named in 4(a). A parser that infers seniority, skill level or "fit" evaluates personal aspects and is profiling under GDPR Art. 4(4), so the filter is unavailable. A parser sold as part of an applicant-tracking suite is a component of a recruitment system, not a separate narrow task. The claim is the vendor's to make, document and register; a hotel cannot self-declare it, and the MSA can reclassify under Art. 80 | GDPR Art. 22 and Art. 13-15 for automated rejection; equal-treatment law; works council on selection guidelines (national law, from memory) |
| Art. 6(3) for an interview scheduler | HOLDS | Pure logistics; no evaluation of the person | None of note |
| Art. 6(3) for staff scheduling | FAILS where the tool uses any per-person history | Reliability, acceptance rate, speed and ratings are profiling; filter excluded by the last subparagraph | Annex III 4(b) |
| "Allocation by availability only" | HOLDS ONLY IF inputs are declared availability, contract hours, required certificates and location, and the tool does not set who gets how many hours | The exit addresses only the third limb ("allocate tasks based on individual behaviour or personal traits or characteristics"). The first limb, "decisions affecting terms of work-related relationships", has no such qualifier, and working hours and therefore pay are terms. A rota engine that distributes scarce or premium shifts decides income. Also, "availability" learned from past behaviour (who accepts late calls, who swaps) is "individual behaviour"; certificates and language skills are "characteristics" | Working-time law; works-council co-determination over rosters (national law, from memory); GDPR |
| "We switched the monitoring feature off" | FAILS as a classification exit | Annex III asks what the system is "intended to be used" for, and Art. 3(12) says the provider's instructions and sales material decide that. If the vendor markets per-employee monitoring, the product is a high-risk system for every customer; the hotel is the deployer of a high-risk system and owes Art. 26 (use per instructions, oversight, logs, worker information) from 2 Dec 2027 even with the module disabled. A switch that any administrator can flip back is not a different product | What the hotel actually does with the data is what GDPR and labour law judge; there, switching off does help |
| "We switched the feature on, the vendor says it is not for HR" | FAILS | Hotel becomes provider under Art. 25(1)(c) | The notes already say this (high-risk row 11, scope G22); I agree |

- **What switching off does achieve.** It reduces the GDPR and labour-law exposure and the scope of the Art. 26 duties in practice (less to oversee, fewer people to inform about). The honest booklet line is "ask the vendor for a version whose documented purpose excludes monitoring", which changes the intended purpose, rather than "switch it off". [my inference]
- **Coverage audit baseline.** Listing rota and cleaning-plan tools as "Minimal" that become high-risk only when behavioural inputs are added (U5-U6) assumes the availability-only exit is settled. It rests on draft guideline paragraphs 271-272 that the high-risk note says conflict with draft paragraph 259. The baseline should be "outside on a draft reading" not "Minimal". [my inference from notes]

### Gaps
- The draft high-risk classification guidelines were not available to me (the notes say the same); every paragraph reference to them is [notes].
- Final guidelines under Art. 6(5) are still pending, so the reach of "terms of work-related relationships" over rostering is unsettled.
- No Art. 80 reclassification practice exists yet.

---

## 6. Social scoring and guest blacklists: "property-level incident history" and loyalty tiers

### Takeaway
"Same property, same context" is not a safe harbour on the text: limb (ii) of Art. 5(1)(c) bans disproportionate treatment **without** any cross-context requirement. Pure spend-based loyalty tiers hold; AI guest scores that worsen treatment hold only if proportionate, and the recital's shelter for "lawful evaluation practices" is lost when the list breaches GDPR.

### Cited Findings
- [text] Art. 5(1)(c): AI systems "for the evaluation or classification of natural persons or groups of persons over a certain period of time based on their social behaviour or known, inferred or predicted personal or personality characteristics, with the social score leading to either or both of": "(i) detrimental or unfavourable treatment … in social contexts that are unrelated to the contexts in which the data was originally generated or collected; (ii) detrimental or unfavourable treatment … that is unjustified or disproportionate to their social behaviour or its gravity" — [BASE Art. 5(1)(c), p.51](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=51)
- [text] Recital 31: applies to "public or private actors"; the ban "should not affect lawful evaluation practices of natural persons that are carried out for a specific purpose in accordance with Union and national law" — [BASE recital 31, p.9](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=9)
- [text] Fine: up to EUR 35 000 000 or 7 % of worldwide turnover — [BASE Art. 99(3), p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- [notes] Prohibited S2: "Property-level incident history used to require a deposit: SAFE / CONDITIONAL on proportionality"; S6: loyalty tiers "SAFE", grey edge for "guest value" scores that degrade service; S1: manual list "SAFE under the AI Act"; S9 segmentation "SAFE". The note reports (secondary) that the Commission guidelines treat behaviour "when using services" as social behaviour — [prohibited §3](prohibited_practices.md)

### Inferences
[all my inference]

| Exit | My verdict | Enforcer's argument | Caught anyway by |
|---|---|---|---|
| Manual "do not rent" flag (no AI) | HOLDS for the AI Act | Nothing, unless an AI system generates or ranks the flags | GDPR: legal basis, information to the guest, retention limits, DPIA for blacklists; offence-related data has extra limits; equal-treatment law (from memory, not verified) |
| AI-scored incident history, one property, used for a deposit | HOLDS ONLY IF the response is proportionate and time-limited | Limb (ii) applies inside the same context. "Unfavourable" is a low bar: a higher deposit, refusal, or worse room is enough. One noise complaint leading to a permanent flag is "disproportionate to … its gravity". The prohibited note sees this (S3) but still labels S2 "SAFE / CONDITIONAL" | GDPR Art. 22 if the score decides refusal by itself (CJEU has treated a decisive score as an automated decision; from memory, not verified); consumer and equal-treatment law |
| Group-wide or cross-brand guest score | FAILS as a safe exit | "Hotel context" is the group's framing. A guest of a budget brand in one country and a spa resort in another did not generate data in "the same context" in any sense the guest would recognise; limb (i) is arguable and limb (ii) is easy. Pooling across separate legal entities is also a GDPR sharing problem | GDPR purpose limitation and controller-to-controller sharing; DPIA |
| Score using reviews, social media, nationality, payment history from elsewhere | FAILS | Limb (i) directly | Art. 5(1)(c); GDPR; equal-treatment law |
| Loyalty tiers on nights and spend by published rules | HOLDS | Usually not an AI system at all; favourable treatment tied to the same commercial relationship | Consumer-contract law only |
| AI "guest value" or "propensity to complain" score that decides who is walked, who waits, who gets compensation | HOLDS ONLY IF the criteria are relevant to the decision and the detriment is small | "Unfavourable" is comparative: being served worse than others because of a behavioural score is unfavourable treatment. Complaint history and refund claims are "social behaviour" on the Commission's reading. Recital 31 protects only "lawful" practices "for a specific purpose"; a score built without GDPR transparency is not lawful and loses the shelter | GDPR; unfair-commercial-practices rules |
| "A one-off check is not 'over a certain period'" | HOLDS ONLY IF nothing is stored and reused | Stored results reused at the next booking are evaluation over time (the note says this too) | GDPR |

- **Did the researcher get the text right?** Yes, and the boundary table is good. My disagreement is with the labels: S2 and S6 carry "SAFE" in the verdict cell although the note's own S3 and "grey edge" remarks undercut them. For a provision carrying the 7 % fine tier, "safe" should be reserved for the non-AI and pure-rules cases. [my inference]
- **The realistic enforcement route is GDPR.** A DPA does not need to prove a "social score". Undisclosed guest blacklists and scores fail on transparency and legal basis long before Art. 5 is reached. [my inference]

### Gaps
- Commission guidelines on Art. 5(1)(c) not readable this session; the "behaviour when using services" point is [notes, secondary].
- No decision applying Art. 5(1)(c) to a private company was found.
- National rules on shared blacklists (some DPAs require prior authorisation) were not checked.

---

## 7. "Not an AI system" claims (recital 12; rules-based tools)

### Takeaway
"Rules-based = not AI" is an over-simplification of a recital. Recital 12 excludes only rules "defined solely by natural persons to automatically execute operations" and in the same paragraph names "logic- and knowledge-based approaches" as AI techniques. Verdict: **HOLDS ONLY IF** the tool has no learned or inferential component at all, and even then GDPR treats the same automated decision the same way.

### Cited Findings
- [text] Art. 3(1): "a machine-based system that is designed to operate with varying levels of autonomy and that may exhibit adaptiveness after deployment, and that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions" — [BASE Art. 3(1), p.46](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=46)
- [text] Recital 12: the definition "should not cover systems that are based on the rules defined solely by natural persons to automatically execute operations"; inference techniques "include machine learning approaches … and logic- and knowledge-based approaches that infer from encoded knowledge or symbolic representation of the task to be solved"; inference "transcends basic data processing by enabling learning, reasoning or modelling" — [BASE recital 12, p.4](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=4)
- [text] "may exhibit adaptiveness": adaptiveness is optional, so a model that is trained once and frozen is still an AI system — [BASE Art. 3(1), p.46](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=46)
- [notes] Scope G1: rules-based tools (PMS automations, rate rules, "decision-tree chatbot", keyword CV filter) "SAFE EXIT if true; needs vendor confirmation in writing"; G2 simple statistics "CONDITIONAL"; high-risk row 2 "CONDITIONAL; needs vendor's technical description"; prohibited cross-cutting: "SAFE, but only if truly rule-based" — [scope §6](scope_definitions_exclusions.md); [high-risk §8](high_risk_classification_and_duties.md); [prohibited §9](prohibited_practices.md)

### Inferences
[all my inference]
- **The exclusion sits in a recital, and the recital cuts both ways.** A rule engine that chains human-written rules to reach conclusions the author did not enumerate (an expert system) is a "logic- and knowledge-based approach" and can be an AI system. Only fixed if-then execution is clearly out.
- **Mixed products.** A "decision-tree chatbot" almost always uses a learned language model to work out what the guest meant before it follows the tree; that component is AI, and the notes' own G3 says hybrids are assessed as a whole. A "constraint-solver rota" with a learned demand forecast or learned reliability weights is the same.
- **Vendor letters do not bind an authority.** A written vendor statement that "this is not AI" helps the hotel's good-faith position on fines (Art. 99(7) looks at negligence and the measures taken) but does not settle classification. The same vendor's marketing calling the product "AI-powered" will be put next to it.
- **Burden.** An MSA that suspects an AI system can demand documentation; a hotel relying on this exit should hold a technical description, not a label.
- **The exit does not travel.** A keyword CV filter or fixed-score blacklist that is not AI is still an automated decision and profiling under GDPR, still subject to discrimination law, and still a works-council matter. Calling it "SAFE EXIT" in a hotel booklet invites the reading "no rules apply".
- **Verdict.** HOLDS ONLY IF every decision path was written by a person and nothing is learned from data. Scope G1's "SAFE EXIT if true" and the high-risk note's "CONDITIONAL" describe the same thing; "conditional" is the right label.

### Gaps
- The Commission guidelines on the AI-system definition (February 2025) were not readable; the scope note relies on summaries for the "basic data processing / mathematical optimisation" exclusions, and those guidelines are non-binding.
- No authority decision on the boundary was found.

---

## 8. AI literacy "has no fine"

### Takeaway
True only for the EU-level fine list. After the Omnibus, Art. 4 is a softer duty ("take measures to support"), but it is still a duty, Member States must lay down penalties for "any infringement", and literacy failures feed into every other fine and into civil claims. Verdict on "no fine, so optional": **FAILS**.

### Cited Findings
- [text] Art. 4 as replaced: "Providers and deployers of AI systems shall take measures to support the development of AI literacy of their staff and other persons dealing with the operation and use of AI systems on their behalf … This obligation does not require providers or deployers to guarantee any specific level of AI literacy of any individual." — [OMNI Art. 1(5), p.16](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=16)
- [text] OMNI recital: AI literacy "should be a strategic priority, regardless of regulatory obligations and potential sanctions" — [OMNI recital, p.3](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=3)
- [text] Art. 99(4) lists Arts. 16, 22, 23, 24, 26, 31/33/34 and 50; Art. 4 is not listed; OMNI added only "(da) obligations of providers and operators pursuant to Article 25(2) and (4)" — [BASE Art. 99(4), p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115); [OMNI Art. 1(38)(b), p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [text] Art. 99(1) as replaced: Member States "shall lay down the rules on penalties and other enforcement measures, which may also include administrative fines, warnings and non-monetary measures, applicable to **any infringement** of this Regulation by operators" (base text: "applicable to infringements") — [OMNI Art. 1(38)(a), p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35); [BASE Art. 99(1), p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- [text] For operators under AI Office supervision, OMNI states that fines may be imposed for "infringement of any applicable provision of this Regulation, including those not listed in Article 99(4)" — [OMNI, p.31](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=31)
- [text] Art. 26(2): "Deployers shall assign human oversight to natural persons who have the necessary competence, training and authority, as well as the necessary support"; fined under Art. 99(4)(e) up to EUR 15 000 000 or 3 % — [BASE Art. 26(2), p.68; Art. 99(4)(e), p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=68)
- [text] Fine-setting factors include "the degree of responsibility of the operator taking into account the technical and organisational measures implemented by it" and "the intentional or negligent character of the infringement" — [BASE Art. 99(7)(g), (i), p.116](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=116)
- [text] Anyone may complain to the MSA about "an infringement of the provisions of this Regulation" — [BASE Art. 85, p.110](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=110)
- [secondary] Commentary agrees Art. 4 is absent from Art. 99(4) and that sanctions would come from national rules under Art. 99(1); some websites wrongly state an EU fine tier for Art. 4 — [EU Law Analysis, Feb 2025](https://eulawanalysis.blogspot.com/2025/02/ai-literacy-under-ai-act-assessment-of.html); [Ibec, Aug 2025](https://www.ibec.ie/connect-and-learn/insights/insights/2025/08/05/ibec-networks-eu-ai-act-and-ai-literacy)
- [notes] Transparency row 13: "CONDITIONAL: no EU-tier fine; still a binding duty, an aggravating factor and open to national measures" — [transparency §9](transparency_literacy_enforcement.md)

### Inferences
[all my inference]
- **The researcher got the text right** and the "conditional" rating is fair. I would go further on three levers:
  1. **National penalty laws.** The Omnibus changed "infringements" to "any infringement" in Art. 99(1). An MSA can argue Member States are now required to have some sanction or measure for Art. 4, even if only warnings and orders. A hotel should check each country's implementing law instead of assuming none exists.
  2. **Art. 26(2) from 2 Dec 2027.** For any high-risk tool (recruitment, staff evaluation), untrained oversight staff is a direct, fined breach. Literacy is the evidence an authority will ask for first.
  3. **Aggravation.** In any fine for Art. 5, Art. 26 or Art. 50, absence of training shows negligence and poor organisational measures under Art. 99(7).
- **Outside the AI Act.** GDPR accountability requires staff who handle personal data to be instructed; a DPA investigating an AI tool will ask for training records. In a civil claim (a rejected candidate, a guest misled by a bot), a statutory duty to train that was ignored is ready-made evidence of breach of the duty of care. Employers also owe training duties under labour law when introducing new technology. [general law from memory, not verified]
- **What the weakened wording changes.** The hotel no longer has to "ensure a sufficient level"; it must show it took measures. That is an easier duty to meet and an easier breach to prove: doing nothing is now clearly non-compliant.

### Gaps
- I did not check which Member States' implementing laws attach a sanction to Art. 4 (the transparency note has a country table; I did not re-verify it).
- No source on civil liability for missing AI literacy was found; the negligence argument is my inference.

---

## 9. SME and small mid-cap relief; "undertaking" and group turnover

### Takeaway
There is no size exemption from any duty a hotel owes as a deployer; the relief is a lower fine ceiling and lighter paperwork for providers. For hotels in a group the ceiling is likely to be calculated on the group, and the small-mid-cap cap does not apply to Art. 5 fines. Verdict on "we are small, so it does not apply": **FAILS**; on "our fine cap is lower": **HOLDS ONLY IF** the company is genuinely independent.

### Cited Findings
- [text] SME cap: "In the case of SMEs, including start-ups, each fine referred to in this Article shall be up to the percentages or amount referred to in paragraphs 3, 4 and 5, whichever thereof is lower." — [BASE Art. 99(6), p.116](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=116)
- [text] SMC cap: "In the case of SMCs, each fine referred to in paragraphs 4 and 5 shall be up to the percentages or amount referred therein, whichever is lower." Paragraph 3 (Art. 5 fines) is not mentioned — [OMNI Art. 1(38)(c), p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [text] Definitions: SME "as defined in Article 2 of the Annex to Recommendation 2003/361/EC"; SMC "as defined in point (2) of the Annex to Recommendation (EU) 2025/1099" — [OMNI Art. 1(4)(b), p.16](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=16)
- [text] Art. 63(1) as replaced: simplified quality-management system for SMEs "provided that they do not have partner enterprises or linked enterprises within the meaning of Recommendation 2003/361/EC" — [OMNI Art. 1(26), p.26](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=26)
- [text] Fines are set by reference to "an undertaking" and "its total worldwide annual turnover" — [BASE Art. 99(3)-(5), pp.115-116](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- [text] Art. 99(1) as replaced: Member States "shall take into account the interests of SMEs, including start-ups, and SMCs, and their economic viability when imposing penalties" — [OMNI Art. 1(38)(a), p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [notes] High-risk row 33: "SAFE but small … no reduction of deployer duties; group-owned hotels fail the Art. 63 condition"; scope G24: "FALSE LOOPHOLE as to scope; CONDITIONAL as to fines"; transparency row 15: "CONDITIONAL for independents; FALSE for group-owned entities; 'undertaking' may be read as the group" — [high-risk §8](high_risk_classification_and_duties.md); [scope §5-6](scope_definitions_exclusions.md); [transparency §9](transparency_literacy_enforcement.md)

### Inferences
[all my inference; competition-law and GDPR case law from memory, not verified this session]
- **Text accuracy.** All three notes read the provisions correctly. The scope note is right that the SMC cap excludes Art. 5 fines. The high-risk note's "SAFE" label is misleading next to the other two; the substance ("no reduction of deployer duties") is correct.
- **"Undertaking" will be read as the economic unit.** The term comes from EU competition law, where it covers a parent and the subsidiaries it controls. The CJEU has applied that meaning to GDPR fines, where the maximum is calculated on group turnover. An MSA will do the same under Art. 99. A single-property company owned by a fund or a chain should plan on the group figure.
- **SME status under the Recommendation counts linked and partner enterprises.** Art. 3(14a) points to "Article 2 of the Annex" (the thresholds), but the headcount and turnover figures in Article 2 are calculated under the same Annex's rules on linked and partner enterprises. An enforcer will not accept a 60-employee property company owned by a large group as an SME. Art. 63(1) makes the same point expressly for providers.
- **Management contracts.** The Recommendation treats an enterprise as linked where another has the right to exercise a dominant influence over it under a contract. A hotel-management agreement that gives the operator control of the owning company's hotel business could be argued to link the two. I have not seen this argued; it is a risk to flag, not a finding.
- **Franchisees.** A genuinely independent franchisee is usually its own enterprise and can be an SME. Its fine cap is the lower of the two figures, which for a small company makes the percentage the binding limit.
- **Proportionality is not immunity.** Art. 99(1) and (7)(d) make size a factor in the amount. Non-monetary measures (orders to stop using a system, withdrawal) are not scaled by size.

### Gaps
- Recommendations 2003/361/EC and (EU) 2025/1099 were not available locally; statements about linked enterprises and dominant influence by contract are from memory.
- No AI Act fining decision exists; the group-turnover reading is by analogy to competition law and GDPR.
- The AI Act has no recital I could find defining "undertaking"; I did not search every recital for it.

---

## 10. Exits rated "safe" that I think are not (beyond those above)

### Takeaway
Seven "safe" ratings should be "holds only if"; none is a misreading of an article, but each drops a condition that an enforcer would raise first.

### Cited Findings
- [text] Art. 27(1): a fundamental-rights impact assessment is required of "deployers that are bodies governed by public law, or are private entities providing public services", and of deployers of Annex III 5(b) and (c) systems — [BASE Art. 27(1), p.69](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=69)
- [text] Art. 26(6): deployers keep logs "to the extent such logs are under their control", at least six months; Art. 26(5): deployers "shall monitor the operation of the high-risk AI system on the basis of the instructions for use" — [BASE Art. 26(5)-(6), p.68](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=68)
- [text] Annex III 1(a) excludes "biometric verification the sole purpose of which is to confirm that a specific natural person is the person he or she claims to be"; 1(b) covers categorisation "according to sensitive or protected attributes or characteristics" — [BASE Annex III point 1, p.127](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=127)
- [text] Art. 6(1b): "AI systems the failure or malfunctioning of which would endanger health and safety shall qualify as safety components" — [OMNI Art. 1(8), p.18](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=18)
- [notes] The ratings challenged are high-risk rows 19, 30, 31, 37; scope G7, G12, pricing bullet; prohibited G1-G2 — [high-risk §8](high_risk_classification_and_duties.md); [scope §6](scope_definitions_exclusions.md); [prohibited §9](prohibited_practices.md)

### Inferences
[all my inference; non-AI-Act law from memory, not verified]

| Exit and original rating | My verdict | Why |
|---|---|---|
| No FRIA for a private hotel (high-risk row 30, "SAFE [text]") | HOLDS ONLY IF the hotel provides no public service | Hotels contracted by a state or municipality to house asylum seekers, homeless people or emergency evacuees are arguably "private entities providing public services". State-owned hotel companies may be bodies governed by public law. In any case the GDPR impact assessment covers much of the same ground and is mandatory for staff-evaluation and biometric tools |
| No deployer registration (row 31, "SAFE") | HOLDS, same public-body caveat | Art. 49(3) is limited to public authorities; state-owned operators should check |
| Logs only "to the extent under their control" (row 37, "SAFE [text] as to scope") | HOLDS ONLY IF the hotel cannot obtain them | "Control" includes what the hotel can get by contract. Art. 26(5) monitoring cannot be done without access, and a DPA expects the controller to have audit rights over its processor. A hotel that never asked for logs has organised its own lack of control |
| 1:1 biometric verification (row 19, scope G16, "SAFE") | HOLDS for the AI Act | I agree on the text. It should carry the warning that this is where DPAs are strictest: face data used to identify is special-category data, consent must be free, and a non-biometric check-in route must exist |
| Age and gender estimation "High [reliability] for the ban; open for high-risk" (prohibited G1-G2) | Ban: HOLDS. High-risk: I would not call it open | Age and sex are protected characteristics in EU equality law; Annex III 1(b) says "sensitive or protected attributes". An age-estimating kiosk is a biometric categorisation system: Art. 50(3) notice now, high-risk from 2 Dec 2027 |
| Comfort and energy AI is not a safety component (scope G12, "SAFE EXIT for comfort and energy") | HOLDS ONLY IF failure cannot endanger health | Art. 6(1b) overrides 6(1a). Energy optimisation that controls hot-water temperature, ventilation rates or kitchen extraction can create legionella, air-quality or fire risks. The notes list these exceptions; the "three exits for a plain-language box" inference then presents G12 without them |
| Pricing is outside Annex III (scope, "SAFE EXIT from high-risk") | HOLDS for classification | True on the text. The box should say what does apply: consumer law requires telling consumers when a price is personalised by automated decision-making; price differences by nationality or residence are restricted; Art. 5(1)(b) covers exploiting "specific social or economic situation" |
| Pre-launch testing (scope G7, high-risk row 16, "SAFE") | HOLDS for the AI Act | Training or testing on real historical staff or guest data is still GDPR processing needing a basis and purpose compatibility |
| "Nothing high-risk applies yet" (high-risk row 1, "SAFE [text]") | HOLDS | Correct until 2 Dec 2027 / 2 Aug 2028. Tools bought now will be judged then; only a frozen, unchanged system keeps legacy status (section 1) |

- **Pattern.** The scope note's sorting rule ("an exit holds when it is in an article, its condition is an observable fact, and the hotel can evidence it") is sound. Applied strictly, it downgrades the notes' own treatment of recital 39 (legacy, later units), recital 12 (not AI), recital 18 (fatigue) and the guidelines-based reading of Art. 5(1)(f), since none of those conditions is in an article. [my inference]

### Gaps
- I did not test every row of every register; rows rated FALSE or "exposure, not exit" were not re-examined, and the transparency note's Art. 50(2)/(4) exits (rows 3-11) were read but not challenged in depth.
- Whether accommodation under public contract counts as "providing public services" under Art. 27 has no guidance that I could find.

---

## 11. Where the researchers contradict each other

### Takeaway
I found eleven points where two or more notes give different ratings or reasons for the same exit; six of them would change what the booklet tells a hotel.

### Cited Findings
All rows compare statements in the notes [notes]; the "text says" column is from the PDFs [text], with page references given in the sections above.

| # | Exit | Note A | Note B | What the text says | Matters for the booklet? |
|---|---|---|---|---|---|
| 1 | Staff text-only sentiment | high-risk row 21 and transparency row 12: "SAFE [text]" | prohibited F1: SAFE but "rests on the guidelines' reading"; scope G17: the missing word "biometric" in Art. 5(1)(f) is a new gap | Art. 5(1)(f) has no "biometric" and does not use the defined term | Yes |
| 2 | Fatigue detection | high-risk row 22 treats it under the "medical or safety" exception: "CONDITIONAL and narrow"; scope G17: "CONDITIONAL for fatigue (safety purpose)" | prohibited F3: outside the notion of emotion altogether, "SAFE for fatigue and pain [text]" | Recital 18 excludes physical states from the notion; the exception in Art. 5(1)(f) is a separate route | Yes: the two routes have different conditions |
| 3 | Does Art. 5(1)(f) reach guests? | high-risk §1: "Of guests: high-risk" stated as [text] | scope §3 gaps: "not answered by the text"; prohibited F8: out, on guidelines para 254 [secondary], conditional on staff exclusion | Text says "a natural person in the areas of workplace" | Yes |
| 4 | Voice transcribed to text | coverage D7: "Not emotion recognition" (flat down-switch) | prohibited F2: "CONDITIONAL"; high-risk row 12: splitting a system into modules is "FALSE" | Art. 3(39) "on the basis of their biometric data" | Yes |
| 5 | Legacy rule and Art. 50 / Art. 4 | transparency §1: "[text] … limited to high-risk systems; nothing in Art. 111 exempts older chatbots" | scope §4: read literally, Art. 111(2) switches off the whole Regulation bar Art. 5 for those systems, "unresolved textual point" | Art. 111(2) says "this Regulation shall apply … only if"; Art. 111(4) presupposes Art. 50 applies to legacy systems | Minor (both reach the same advice) |
| 6 | Legacy rule conditions | high-risk row 15: "no significant design or purpose change" | scope §4 quotes the article: "designs" only | Article: "designs"; recital 177: "design or intended purpose" | Minor |
| 7 | Machinery / Section B | high-risk row 28: "SAFE [text] as to AI Act Arts. 8–27" | scope G14: literal text would also switch off Arts. 4, 5 and 50, "grey" | Art. 2(2): "only Article 6(1), Article 60a and Articles 102 to 112 shall apply" | Yes: one says what is switched off, the other says the boundary is unclear |
| 8 | Rules-based tools | scope G1: "SAFE EXIT if true"; prohibited §9: "SAFE, but only if truly rule-based" | high-risk row 2: "CONDITIONAL" | Recital 12 only | Label only |
| 9 | SME relief | high-risk row 33: "SAFE but small" | scope G24: "FALSE LOOPHOLE as to scope; CONDITIONAL as to fines"; transparency row 15: "CONDITIONAL … FALSE for group-owned" | Art. 99(6), (6a): fine caps only | Yes: "safe" and "false loophole" for the same provision |
| 10 | Availability-only rostering | coverage §4: rota is "Minimal" at baseline; D1 a clean down-switch | high-risk row 4: "CONDITIONAL (draft; conflicts with para 259 on working time)" | Annex III 4(b) first limb has no behaviour qualifier | Yes |
| 11 | Page reference | prohibited §8 cites OMNI point (39)(a) at "PDF p. 38" | scope and high-risk cite p.35 | It is on p.35 (footer "35/41") | No |

### Inferences
- Rows 1-4 are one underlying disagreement: whether the biometric limit in the definition (Art. 3(39)) is part of the prohibition (Art. 5(1)(f)). The booklet needs one position and should say it rests on the Commission's reading, not on the article. [my inference]
- Rows 8 and 9 are labelling differences over the same substance. A single vocabulary across the five notes would remove them: "safe" only where the condition is in an article and the hotel can prove it. [my inference]
- The five notes agree, and I agree, on the exits rated FALSE: human sign-off, vendor disclaimers, pilots with real people, consent to staff emotion AI, renaming features, head office outside the EU. I found no text that would rescue any of them. [my inference]

### Gaps
- The comparison covers the registers and the sections I read in full (the exit tables, Art. 5(1)(c) and (f) tables, configuration-switch table, employment line table). Body text elsewhere in the notes may contain further inconsistencies I did not see.
- The coverage audit's 91-row label table was not compared line by line with the other notes.
