# Challenge from the hotel's side: were the five researchers too cautious about the EU AI Act, and what lawful room did they miss?

State of the law: November 2026. Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744 (Digital Omnibus on AI, in force 27 Jul 2026). High-risk dates: **2 Dec 2027** (Annex III) and **2 Aug 2028** (Annex I). This is compliance-planning research written from the position of a hotel group's general counsel. It is not legal advice, and it is not advice on hiding conduct: every exit below carries its limit.

**How to read these notes**

- Tags: **[text]** = I read the wording in one of the two regulation PDFs this session; **[notes]** = taken from one of the five research notes or the team booklet; **[secondary]** = web search summary only, page not opened; **[my inference]** = my own reading.
- Sources: **ACT** = `/home/user/final/tools/ai-act-explorer/EU AI Act June 2024.pdf` ([ELI](http://data.europa.eu/eli/reg/2024/1689/oj)); **OMNI** = `/home/user/final/tools/ai-act-explorer/Digital Omnibus July 2026.pdf` ([ELI](http://data.europa.eu/eli/reg/2026/1744/oj)). Page numbers are PDF pages. Where the Omnibus replaced a provision, the OMNI wording is quoted.
- Notes challenged (all in `/home/user/final/research_notes/EU AI Act hospitality deep dive/`): **SCOPE** = scope_definitions_exclusions.md; **PROHIB** = prohibited_practices.md; **HIGHRISK** = high_risk_classification_and_duties.md; **TRANSP** = transparency_literacy_enforcement.md; **AUDIT** = hotel_use_case_coverage_audit.md. **BOOKLET** = `/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf`.
- Ratings: **sound planning** (rests on operative text and on facts the hotel can prove); **arguable** (defensible on the text, untested, Commission guidance or a purposive reading may go against it); **evasion that fails** (depends on a label, a sham or a structure the Act was written to defeat).
- What I did not read: the Commission guidelines (final or draft). Everything said about them comes from the five notes. I read the five notes' takeaways, inference sections and exit registers in full, HIGHRISK sections 2 to 8 in full, and the booklet pages 1 to 13 and 20 to 22.

**Overall verdict.** The five notes are accurate on the text and already list most exits. Their caution shows in three habits: (1) they treat the widening points of the draft high-risk guidelines as operative and the narrowing points as "do not bank", although both are equally non-binding; (2) they describe the legacy rule (Art. 111(2)) as real but then advise against any reliance, without separating stable or in-house tools from fast-moving cloud tools, and without noticing that losing legacy status leads to ordinary compliance and not to illegality; (3) they, and the booklet more so, present prudent practice (tool lists, training records, checking the vendor's chatbot notice, CE confirmation) in the same voice as legal duties. They also missed four things in the text: the deployer partnership in real-world testing (Art. 60), the fine shield in sandboxes (Art. 57(12)), the deployer's organisational freedom (Art. 26(3)), and the fact that Art. 25 cannot make anyone a provider of a high-risk system before 2 Dec 2027.

---

## 1. Provisions favourable to a deployer hotel that no researcher used, chapter by chapter

### Takeaway
The unused or under-used provisions are mostly procedural: a hotel can take part in a supervised real-world test as the provider's partner, a group that builds its own tool can enter a sandbox and be shielded from AI Act fines, the deployer keeps freedom over how it organises oversight, and several deployer duties are narrower in the text than the notes and booklet state. None removes the high-risk regime; together they lower its cost and its fine exposure.

### Cited Findings

**Chapter I (Arts. 1–4)**
- Art. 2(1)(c) covers third-country providers and deployers "where the output produced by the AI system is used in the Union"; recital 22 says "to the extent the output produced by those systems is intended to be used in the Union" and gives the example of an EU operator contracting a service to a third-country operator. [text] — ACT p.45 (Art. 2(1)), p.6 (recital 22)
- Art. 2(6): the Act does not apply to AI systems "specifically developed and put into service for the sole purpose of scientific research and development". [text] — ACT p.46
- Art. 2(8): no application to "research, testing or development activity ... prior to their being placed on the market or put into service"; "Testing in real world conditions shall not be covered by that exclusion." [text] — ACT p.46
- Art. 3(4): deployer = a person "using an AI system under its authority". Recital 13 repeats this and adds nothing on mandating or directing someone else's use. [text] — ACT p.46, p.4
- Art. 3(57): real-world testing "does not qualify as placing the AI system on the market or putting it into service within the meaning of this Regulation, provided that all the conditions laid down in Article 57 or 60 are fulfilled". [text] — ACT p.50
- Recital 12: the AI-system definition "should not cover systems that are based on the rules defined solely by natural persons to automatically execute operations". [text] — ACT p.4
- Art. 4 as replaced: "take measures to support the development of AI literacy"; "This obligation does not require providers or deployers to guarantee any specific level of AI literacy of any individual." The Commission must publish "practical examples of how to comply". [text] — OMNI p.16
- Art. 4a(2): deployers "may exceptionally" process special-category data for bias detection; "This paragraph does not create any obligation to conduct such bias detection and correction." [text] — OMNI p.17

**Chapter III (Arts. 6–27)**
- Art. 6(3) is objective: an Annex III system "shall not be considered to be high-risk where it does not pose a significant risk of harm", and this "shall apply where any of the following conditions is fulfilled". Documentation and registration are separate duties in Art. 6(4), addressed to the provider. [text] — ACT p.54
- Art. 80: where an authority finds a system wrongly classified as non-high-risk it "shall ... require the relevant provider" to bring it into compliance; fines for circumvention fall on "the provider". No deployer duty to verify the provider's classification appears in Arts. 6, 26 or 80. [text] — ACT p.107–108
- Art. 6(6) lets the Commission add filter conditions by delegated act "where there is concrete and reliable evidence" of Annex III systems that pose no significant risk; Art. 7(3) lets it remove items from Annex III. [text] — ACT p.54–55
- Art. 25(1) applies only where the result is a "high-risk AI system"; route (a) is "without prejudice to contractual arrangements stipulating that the obligations are otherwise allocated". [text] — ACT p.67
- Art. 3(23): a substantial modification is a change "not foreseen or planned in the initial conformity assessment ... as a result of which the compliance of the AI system with the requirements set out in Chapter III, Section 2 is affected or results in a modification to the intended purpose". Art. 43(4): changes "pre-determined by the provider at the moment of the initial conformity assessment" are not substantial modifications. [text] — ACT p.47, p.78
- Art. 26(1): "appropriate technical and organisational measures" to use the system "in accordance with the instructions for use". Art. 26(3): paragraphs 1 and 2 are "without prejudice ... to the deployer's freedom to organise its own resources and activities for the purpose of implementing the human oversight measures indicated by the provider". [text] — ACT p.67–68
- Art. 26(4): input-data duty only "to the extent the deployer exercises control over the input data". Art. 26(6): logs only "to the extent such logs are under their control", for at least six months "unless provided otherwise in applicable Union or national law, in particular in Union law on the protection of personal data". [text] — ACT p.68
- Art. 26(5): monitoring is "on the basis of the instructions for use"; the duty to inform and suspend arises where the deployer has "reason to consider that the use of the high-risk AI system in accordance with the instructions may result in that AI system presenting a risk within the meaning of Article 79(1)". Art. 79(1) refers to a "product presenting a risk" under Regulation (EU) 2019/1020. [text] — ACT p.68, p.106
- Art. 26(7): "deployers who are employers shall inform workers' representatives and the affected workers"; it is an information duty, with no consultation, form or content rule. Recital 92 calls it "ancillary". [text] — ACT p.68, p.25
- Art. 26(8): the rule "they shall not use that system" if it is unregistered binds only deployers that are public authorities or Union bodies. [text] — ACT p.68
- Art. 26(11): applies to "high-risk AI systems referred to in Annex III that make decisions or assist in making decisions related to natural persons". It does not cover Annex I systems. The content (intended purpose, type of decisions, right to explanation) is in recital 93 only, with the words "where applicable". [text] — ACT p.69, p.25
- Art. 27(2): a deployer that owes an impact assessment "may, in similar cases, rely on previously conducted fundamental rights impact assessments or existing impact assessments carried out by provider"; Art. 27(4) as replaced allows cross-references to the data protection impact assessment. [text] — ACT p.70; OMNI p.20
- Art. 13(3): the provider must supply instructions for use with listed minimum content. [text] — ACT p.59

**Chapter IV (Art. 50)**
- Art. 50(1) and 50(2) bind "Providers". Art. 50(3) and 50(4) bind "Deployers". [text] — ACT p.82
- Art. 50(1) exception: "unless this is obvious from the point of view of a natural person who is reasonably well-informed, observant and circumspect, taking into account the circumstances and the context of use". [text] — ACT p.82
- Art. 50(4), public-interest text: no duty where the content "has undergone a process of human review or editorial control and where a natural or legal person holds editorial responsibility for the publication of the content". [text] — ACT p.82
- Art. 50(4), deep fakes: for "evidently artistic, creative, satirical, fictional or analogous work" the duty is limited to disclosure "in an appropriate manner that does not hamper the display or enjoyment of the work". A deep fake must resemble "existing persons, objects, places, entities or events" and "would falsely appear to a person to be authentic or truthful". [text] — ACT p.82, p.50 (Art. 3(60))
- Art. 50(5): information "at the latest at the time of the first interaction or exposure", "clear and distinguishable". No language rule and no repetition rule in the text. [text] — ACT p.83

**Chapter VI (Arts. 57–63)**
- Art. 57(1) as replaced: each Member State must have at least one sandbox "operational by 2 August 2027". [text] — OMNI p.23
- Art. 57(5) as replaced: the sandbox plan is "agreed between the providers or prospective providers and the competent authorities"; sandboxes "may include testing in real world conditions supervised therein". [text] — OMNI p.23
- Art. 57(7): the authority gives "written proof" and an exit report, which "shall be taken positively into account by market surveillance authorities and notified bodies". [text] — ACT p.88
- Art. 57(12): participants "remain liable under applicable Union and national liability law for any damage inflicted on third parties"; "However, provided that the prospective providers observe the specific plan and the terms and conditions for their participation and follow in good faith the guidance given by the national competent authority, no administrative fines shall be imposed by the authorities for infringements of this Regulation. Where other competent authorities responsible for other Union and national law were actively involved in the supervision of the AI system in the sandbox and provided guidance for compliance, no administrative fines shall be imposed regarding that law." [text] — ACT p.89
- Art. 60(2) as replaced: providers or prospective providers may test Annex III or Annex I Section A high-risk systems in real-world conditions "at any time before the placing on the market or the putting into service ... on their own or in partnership with one or more deployers or prospective deployers". [text] — OMNI p.24
- Art. 60(4) conditions include: plan submitted to and approved by the market surveillance authority, with approval deemed after 30 days of silence unless national law excludes tacit approval; registration; EU establishment or representative; at most six months, extendable once by six; an agreement between provider and deployer "specifying their roles and responsibilities"; informed consent of subjects under Art. 61; oversight by qualified persons at provider and deployer; and "the predictions, recommendations or decisions of the AI system can be effectively reversed and disregarded". [text] — ACT p.92–93
- Art. 60a: Member States may allow real-world testing for products under Annex I Section B (which now includes machinery). [text] — OMNI p.25
- Art. 62(1): Member States must give SMEs priority access to sandboxes, run awareness and training "tailored to the needs of SMEs including start-ups, deployers", and use or set up channels "to provide advice and respond to queries about the implementation of this Regulation". Art. 70(8) as replaced: national authorities "may provide guidance and advice ... in particular to SMEs, including start-ups, and SMCs". [text] — ACT p.94; OMNI p.26
- A fine waiver in sandboxes covers AI Act fines only and extends to other laws only where those authorities were actively involved. [secondary, search summary] — [Cloud Security Alliance research note, 12 Nov 2026](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-regulatory-sandbox-rules-20261112-cs/); [Mishcon de Reya AI navigator, Art. 57](https://www.mishcon.com/eu-uk-ai-navigator/article-57)

**Chapters IX–XIII (Arts. 72–113)**
- Art. 75(1) as replaced: the AI Office's exclusive competence over systems built on the provider's own general-purpose model "shall apply to the deployers of those systems only when they are also the provider or form part of the same undertaking as the provider". [text] — OMNI p.26–27
- Art. 75c(4): for operators under AI Office competence, fines at the Art. 99(4) level cover "infringement of any applicable provision of this Regulation, including those not listed in Article 99(4)". [text] — OMNI p.31
- Art. 86: the right covers a decision "taken by the deployer on the basis of the output from a high-risk AI system listed in Annex III" that "produces legal effects or similarly significantly affects that person in a way that they consider to have an adverse impact on their health, safety or fundamental rights"; what is owed is an explanation "of the role of the AI system in the decision-making procedure and the main elements of the decision taken"; it applies "only to the extent that the right ... is not otherwise provided for under Union law". [text] — ACT p.110
- Art. 95(2)–(3): codes of conduct on voluntary application of requirements "including by deployers"; they "may be drawn up by individual providers or deployers of AI systems or by organisations representing them". Art. 95(4) as replaced adds SMCs. [text] — ACT p.113; OMNI p.34
- Art. 96(1)(a) as replaced: Commission guidelines must now cover "the application of the requirements and obligations referred to in Articles 8 to 15 and in Articles 25 and 26", paying "particular attention to the needs of SMEs, including start-ups, and SMCs ... and of the sectors most likely to be affected". Art. 96(1)(c): guidelines on "substantial modification". [text] — OMNI p.34; ACT p.114
- Art. 99(1) as replaced: penalties "may also include administrative fines, warnings and non-monetary measures"; Member States "shall take into account the interests of SMEs, including start-ups, and SMCs, and their economic viability". [text] — OMNI p.35
- Art. 99(4) lists, for deployers, only "obligations of deployers pursuant to Article 26" and "transparency obligations for providers and deployers pursuant to Article 50". [text] — ACT p.115
- Art. 112(1): the Commission assesses "once a year" the need to amend Annex III and the Art. 5 list. [text] — ACT p.122

### Inferences
All [my inference]. Each item states what the notes missed, the limit, and a rating.

| # | Provision | What it gives a hotel | What the notes said | Honest limit | Rating |
|---|---|---|---|---|---|
| 1.1 | Art. 60(2), 60(4)(h), Art. 3(57) | After 2 Dec 2027 a hotel can trial a new high-risk tool on real staff or candidates as the provider's test partner. The test is not "putting into service", so Art. 26 duties do not start during it | SCOPE and HIGHRISK treat every pilot with real people as the end of the Art. 2(8) exclusion and rate "it is only a pilot" a false loophole. Neither mentions that Art. 60 makes such a pilot lawful under conditions | Only the provider or prospective provider can run it. Plan, authority approval, registration, six plus six months, reversibility, and informed consent of every subject. Consent from employees is hard to make "freely given"; a works council will have a say under national law. A pilot without these conditions is ordinary use | Sound planning for a real, time-limited trial. Evasion that fails if used as a rolling label for normal operations |
| 1.2 | Art. 57(5), (7), (12); Art. 62(1)(a) | A group that builds its own HR or guest tool can develop it in a national sandbox. If it keeps to the plan and follows the authority's guidance in good faith, no AI Act fine can be imposed, and the exit report must be "taken positively into account" later | SCOPE lists sandbox priority access as provider-side paperwork relief and marks it "No" for hotels. No note mentions Art. 57(12) | The applicant must be a provider or prospective provider; a hotel that only buys tools cannot apply alone. The shield names "prospective providers" and covers fines only, not damages. Sandboxes need not be operational before 2 Aug 2027. Data protection fines are shielded only if the data protection authority took part | Sound planning for groups building in-house tools. Not available to a pure deployer |
| 1.3 | Art. 62(1)(b)–(c), Art. 70(8) | A hotel can put a written question to the national authority through its advice channel. A dated question and answer is evidence of care and good faith | Not used | Advice is not binding and an authority may decline. The hotel must describe the tool truthfully (Art. 99(5) fines misleading information to authorities) | Sound planning |
| 1.4 | Art. 26(3) | Oversight measures are those "indicated by the provider". The hotel chooses who does it and how; no new post, certificate or headcount is required | Not cited in HIGHRISK or the booklet | The people must have "competence, training and authority" (Art. 26(2)). A named overseer with no power to stop the tool does not meet this | Sound planning |
| 1.5 | Art. 26(5) with Art. 79(1) | The suspension duty has a threshold: a risk in the product-safety sense arising from use in line with the instructions. An ordinary wrong output is not automatically such a risk | HIGHRISK lists "suspend use" without the threshold | "Serious incident" (Art. 3(49)(c), ACT p.49) includes infringement of Union fundamental-rights obligations, so a discriminatory outcome triggers the reporting limb. I did not re-read Regulation 2019/1020 | Sound planning as to the threshold; arguable at the margin |
| 1.6 | Art. 26(7), 26(11) | Both are information duties with no prescribed form. They can be met in the documents a hotel already issues (works council information, privacy notices, candidate notices). Art. 26(11) does not apply to lift or other Annex I AI | HIGHRISK separates the two correctly but does not say they can be folded into existing notices, or that 26(11) is Annex III only | The notice must reach the people and be given "before" use at work. Hiding it in a document nobody receives fails. National labour law may require consultation on top | Sound planning |
| 1.7 | Art. 6(3), 6(4), Art. 80 | A hotel may buy a tool whose provider has documented and registered a "not high-risk" assessment. Enforcement of a wrong classification runs against the provider. The hotel then has no Art. 26 duties unless and until the system is found high-risk | HIGHRISK: "an unregistered claim is not a valid one". The text does not say that; the filter is objective and registration is a separate provider duty | If the tool in fact profiles people it is high-risk whatever the register says, and Art. 26 applies objectively. The hotel must use the tool only for the registered narrow purpose; using it to rank people is a change of purpose (Art. 25(1)(c)) | Sound planning with a real, registered claim. Arguable where the claim is unregistered. Evasion that fails where the hotel knows the tool scores individuals |
| 1.8 | Art. 50(4) second subparagraph | AI-written sustainability, health or safety text needs no label if a person reviewed it and "a natural or legal person holds editorial responsibility". The hotel company itself can hold that responsibility | TRANSP makes the exception depend on "a named person, real fact-checking and a record" and says later AI edits reopen the duty. Those conditions are not in the text | The review must be real. A record is the only practical proof. Consumer and food-information law still require the content to be accurate | Sound planning |
| 1.9 | Art. 50(1) | The chatbot notice is the maker's duty. A hotel that deploys a vendor's bot has no Art. 50(1) duty and no Art. 99(4)(g) fine exposure for it | TRANSP states this clearly. The booklet's first "do now" item presents the check as "Required since 2 Aug 2026" | A hotel that built or commissioned the bot under its own name is the provider. A bot posing as a person is a misleading practice under consumer law whoever owes the AI Act notice | Sound planning as to who owes the duty. Evasion that fails if the hotel switches the vendor's notice off |
| 1.10 | Art. 75c(4), read against Art. 99(4) | The Omnibus created a catch-all fine for "any applicable provision" only for operators under the AI Office. By contrast, for nationally supervised operators such as hotels the EU fine tiers stay limited to the Art. 99(4) list, so Arts. 4, 27 and 86 carry no EU-tier fine | TRANSP and HIGHRISK note the list gap but not this supporting argument | Member States can add penalties for any infringement under Art. 99(1); Germany reportedly did for Arts. 27 and 86 up to EUR 50,000 [notes, TRANSP section 7] | Sound as a reading of EU-level fines; not an exemption from the duty |
| 1.11 | Arts. 95(2)–(3), 96(1)(a), 112(1), 6(6), 7(3) | A sector body (for example HFTP or a hotel association) can draw up a deployer code of conduct, submit hotel evidence to the pending Commission guidelines on Art. 26 and on substantial modification, and ask for filter conditions or Annex III changes | No note discusses the sector's route to shape guidance | Voluntary and slow. Unlike the GDPR, Art. 99(7) does not name code adherence as a fining factor; it counts only as an organisational measure under 99(7)(g) | Sound planning for the client (HFTP), not a compliance exit |
| 1.12 | Art. 2(6) | A system developed and used solely for a research project with a university falls outside the Act | SCOPE treats it as not relevant to hotels | "Sole purpose": the first operational decision about a real employee or guest ends it | Arguable and narrow. Evasion that fails if operations run under a research label |
| 1.13 | Art. 13(3), Art. 26(1) | The hotel's core duty is defined by the provider's instructions for use, which the provider must supply. A hotel that asked for them and did not get them has a strong mitigation argument | Not developed | Does not excuse using a tool the hotel knows is unsafe | Sound planning |

- **Machinery (Art. 2(2), Annex I Section B point 21).** HIGHRISK already found that hotels using AI-enabled machinery (kitchen robots, cleaning robots, automatic doors) owe no Art. 26 duties. I confirm the text: "only Article 6(1), Article 60a and Articles 102 to 112 shall apply" [text, OMNI p.15, p.36]. The booklet does not say this. Rating: sound planning.
- **Annex III point 1(a).** The exclusion of 1:1 verification is in the text itself ("This shall not include AI systems intended to be used for biometric verification the sole purpose of which is to confirm that a specific natural person is the person he or she claims to be") [text, ACT p.127]. The booklet marks face check-in as not high-risk "(draft guidance)". AUDIT is right that the booklet under-claims here.

### Gaps
- No source found on how national authorities will run sandbox admission for non-tech companies such as hotel groups, or whether any sandbox has admitted a hospitality project.
- The Commission's implementing act on real-world testing plans (Art. 60(1)) and the Art. 58 sandbox implementing acts were not checked; I do not know whether they exist yet.
- Regulation (EU) 2019/1020 Art. 3(19) ("product presenting a risk") was not re-read.
- The Art. 96 guidelines on Arts. 25 and 26 and on substantial modification are pending according to HIGHRISK; none of items 1.4 to 1.7 has been tested against them.

---

## 2. Where the researchers or the booklet tell hotels to do more than the AI Act requires

### Takeaway
Most of the booklet's "do now" list is good practice or another law's requirement, not an AI Act duty on a deployer hotel today. The only AI Act duties that bind a typical vendor-tool hotel in November 2026 are: do not use a prohibited practice (Art. 5), take some measures to support staff AI literacy (Art. 4), tell people exposed to emotion recognition or biometric categorisation (Art. 50(3)), and label deep fakes and unreviewed public-interest text (Art. 50(4)).

### Cited Findings
- Chapter III Sections 1, 2 and 3 (which contain Art. 6, Art. 25 and Art. 26) apply from 2 Dec 2027 for Annex III and 2 Aug 2028 for Annex I. [text] — OMNI p.35 (Art. 113, point (c))
- Booklet "Start here": (1) check every guest chatbot says it is AI, "Required since 2 Aug 2026"; (2) stop staff ranking people with a general chatbot, "Ranking applicants is a high-risk use; doing it with a general chatbot can make the hotel the tool's maker (our reading)"; (3) ask vendors about staff ranking, emotions, face and voice, "switch off what you do not need"; (4) list every AI tool; (5) brief staff "and keep a note of who was briefed", "Required since 2 Feb 2025". [notes] — BOOKLET p.3
- Booklet A3: the user "must use it as the maker instructs, put trained staff in charge of overseeing it, keep its logs for at least six months, notify staff and their representatives before using it on them, and explain its decisions to affected people on request". [notes] — BOOKLET p.5
- Booklet A4: the brand is "the user ... too, where its standards impose a tool and how it is used". [notes] — BOOKLET p.6
- Booklet A5 and B1: "do not count on this exemption"; "ask for the vendor's confirmation that the tool will be CE-marked and registered by then". [notes] — BOOKLET p.7, p.11
- Booklet B3: "customer chatbots do not count as obviously AI". [notes] — BOOKLET p.13
- HIGHRISK section 5 takeaway: "about ten duties from 2 Dec 2027, all addressed to the deployer personally and fineable up to EUR 15 million or 3%". Its own inference list then says Arts. 27 and 86 are not in the Art. 99(4) list. [notes] — HIGHRISK section 5
- HIGHRISK section 4 lists the draft guidelines' widening points as findings and labels the narrowing points "flagged 'do not bank'". [notes] — HIGHRISK section 4
- TRANSP section 5 lists seven kinds of literacy evidence and adds "None of this is prescribed by the text". [notes] — TRANSP section 5
- TRANSP section 1: notice "in the first message of each conversation", "in the guest's language", "repeat in long calls and after hand-backs". [notes] — TRANSP section 1
- SCOPE section 6: "each company that either directs the use or uses the output should assume it is a deployer". [notes] — SCOPE section 6
- Annex III point 4(b) reads "to monitor and evaluate the performance and behaviour of persons"; recital 57 reads "monitoring or evaluation". HIGHRISK reports the draft guidelines as saying "Monitoring stands alone". [text] — ACT p.127, p.16; [notes] HIGHRISK section 4

### Inferences
Sorting table. All classifications are [my inference] from the texts cited above.

| What hotels are told | Who says it | Required by the AI Act? | Required by another law? | Otherwise |
|---|---|---|---|---|
| Check that the vendor's chatbot notice is switched on | BOOKLET p.3 | No. Art. 50(1) binds the provider | Consumer law on misleading practices applies if a bot poses as a person [notes, TRANSP] | Team's caution; cheap and sensible |
| Notice in the first message, in the guest's language, repeated in long calls; customer chatbots are never "obvious" | TRANSP, BOOKLET p.13 | The text requires "clear and distinguishable" information "at the latest at the time of the first interaction". Language and repetition are not in the text; "obvious" is an open legal standard | — | Commission guidelines (non-binding) [notes] |
| Stop staff ranking CVs in a general chatbot because it is high-risk and makes the hotel the maker | BOOKLET p.3 | Not yet. Arts. 6 and 25 do not apply before 2 Dec 2027 | Yes, now: GDPR (legal basis, automated decisions, impact assessment, transfers) [notes, BOOKLET tags it] | The AI Act reason given is premature; the GDPR reason is the live one |
| Switch off staff-ranking features you do not need | BOOKLET p.3 | No | GDPR data minimisation arguably; works-council law | Team's caution |
| List every AI tool | BOOKLET p.3, p.12 | No inventory duty for deployers anywhere in the text | GDPR record of processing covers only personal-data processing | Team's caution; it is also the base for Art. 99(7)(g) evidence |
| Brief staff and keep a note; follow the Commission's "four steps" | BOOKLET p.3, p.5 | Measures: yes (Art. 4). A record, a level, the four steps: no | — | Commission Q&A (non-binding) [notes]; record is evidence, not a duty |
| Keep logs at least six months | BOOKLET p.5, p.13 | Only logs "under their control", only for high-risk tools, from 2 Dec 2027 | Data protection law may require shorter retention | Booklet drops the qualifier |
| Explain its decisions on request | BOOKLET p.5 | Narrower: the role of the AI and main elements of a decision with legal or similarly significant effect that the person considers adverse, and only where no other Union law right exists | GDPR access and automated-decision rights | Booklet over-states scope |
| Ask for the vendor's confirmation of CE mark and registration by 2 Dec 2027 | BOOKLET p.6, p.11 | No duty on a private deployer to verify (Art. 26(8) binds public bodies only). A legacy tool's vendor owes no CE mark at all | — | Procurement prudence. For tools already in service the better question is "legacy or compliant, and will you tell us when that changes?" |
| Brand is a user where its standards impose a tool | BOOKLET p.6; SCOPE section 6 ("directs the use") | Not on the wording: a deployer is the person "using" the system. A brand that mandates but does not use is not a deployer | — | Team's reading. SCOPE section 3 itself says the mandating brand "is not a deployer on the wording" |
| Involve the works council before any tool that schedules, scores or watches staff | BOOKLET p.3 | Art. 26(7) requires information only, for high-risk tools, from 2 Dec 2027 | Yes: national labour law (correctly tagged [Labour]) | — |
| Face check-in: explicit consent, alternative route, no central template store | BOOKLET p.5 | No (outside Annex III by text) | GDPR Art. 9, read through a data protection board opinion (non-binding) [notes] | Correctly marked "our reading" |
| Human review of public-interest text needs a named person, fact-check and record | TRANSP | Text: a review or editorial-control process and a natural or legal person with editorial responsibility | — | Guidelines and caution |
| Any tool that monitors staff is high-risk even without evaluation | HIGHRISK (draft para 274) | Text says "monitor and evaluate"; recital says "or" | Labour and data protection law regulate monitoring anyway | Draft guidance (non-binding) |
| Leave denial, significant hours changes, non-renewal, punctuality metrics are in 4(b) | HIGHRISK (draft paras 259–270) | The text says "decisions affecting terms of work-related relationships" and "based on individual behaviour or personal traits or characteristics"; the examples are the draft's | — | Draft guidance (non-binding) |
| Deployers should test for bias | not stated as a duty by the notes; common in vendor material | No. Art. 4a(2) "does not create any obligation" | Equal-treatment law prohibits discriminatory outcomes | — |

- **Asymmetric use of the draft guidelines.** HIGHRISK and the booklet treat the draft's widening examples as the working position and the draft's narrowing examples (availability-only allocation, significance threshold, property protection, worker-only feedback) as unsafe. Both sets come from the same non-binding draft. A hotel is entitled to rely on the text of Annex III in both directions until the final guidelines appear, and even then only the Court of Justice gives a binding reading. The honest position for the booklet is: "text says X; the draft reads it as Y, wider here, narrower there". [my inference]
- **HIGHRISK section 5 is internally inconsistent** on fines: the takeaway says all the listed duties are fineable at the 3% tier, the inferences say Arts. 27 and 86 are not on the list. Art. 4 is not on the list either. The inferences are right. [my inference from Art. 99(4)]
- **"None of the Art. 26 duties can be contracted out" (HIGHRISK)** is right about liability and wrong if read as "must be performed by the hotel's own staff". Art. 26(2) requires "natural persons" with competence, training and authority; it does not require employees. Log keeping, monitoring and oversight can be performed by a contractor or the management company on the deployer's behalf. Rating: sound planning; the deployer stays answerable. [my inference]
- **Where I would not push.** PROHIB reads Art. 5 strictly and I see no reason for a hotel to test it: the top fine tier applies, there is no legacy protection, no small mid-cap relief, and the text of Art. 5(1)(f) covers "use" as well as supply. The "medical or safety reasons" exception is in the text [ACT p.51]; everything else PROHIB calls a false loophole (consent, aggregation, renaming) I accept. [my inference]

### Gaps
- I did not read PROHIB's cited findings line by line, nor AUDIT sections 1, 3, 5 and 6; over-readings there may have been missed.
- I could not check any statement attributed to Commission guidelines against the guidelines themselves.
- Whether indemnities for administrative fines are enforceable in the team's focus countries was not researched.

---

## 3. Timing: what a hotel can lawfully do before 2 Dec 2027, and what the legacy rule really protects

### Takeaway
The legacy rule protects the hotel as well as the vendor, applies at the level of "type and model" according to the Omnibus's own recital, and ends only on a significant design change. For stable, on-premise, version-pinned or in-house tools it is a sound planning basis; for fast-moving cloud tools it is a buffer, and when it ends the hotel moves into the normal deployer regime, not into illegality. Putting a tool into real service before the date is lawful and decisive; a sham placing is not.

### Cited Findings
- Art. 111(2) as replaced: "this Regulation shall apply to operators of high-risk AI systems ... that have been placed on the market or put into service before the date of application of Chapter III referred to in Article 113, only if, as from that date, those systems are subject to significant changes in their designs." It is "Without prejudice to the application of Article 5". [text] — OMNI p.35
- "Operator" includes deployer. [text] — ACT p.46 (Art. 3(8))
- Omnibus recital 39: "if at least one individual unit of the high-risk AI system has been lawfully placed on the market or put into service before the date ... other individual units of the same type and model ... may continue to be placed on the market, made available or put into service on the Union market without any additional obligations, requirements or the need for additional certification, as long as the design of that high-risk AI system remains unchanged"; "the decisive factor is the date on which the first unit of that type and model ... was placed on the market or put into service on the Union market for the first time"; a significant change "should trigger the obligation of the provider to fully comply". [text] — OMNI p.12
- Recital 177 (2024): "significant change should be understood as equivalent in substance to the notion of substantial modification"; it speaks of changes "in their design or intended purpose", while the operative text says only "designs". [text] — ACT p.44
- Substantial modification requires that compliance with the Section 2 requirements "is affected" or the intended purpose is modified. Recital 128's example is "change of operating system or software architecture". [text] — ACT p.47 (Art. 3(23)), p.32
- "Putting into service" = "the supply of an AI system for first use directly to the deployer or for own use in the Union for its intended purpose". [text] — ACT p.47 (Art. 3(11))
- Real-world testing under Art. 60 "does not qualify as placing ... on the market or putting it into service". [text] — ACT p.50 (Art. 3(57))
- Art. 111(4): a separate transition, for Art. 50(2) marking only, to 2 Dec 2026. [text] — OMNI p.35
- Omnibus recital 40 explains the new dates as the dates of application of "Sections 1, 2 and 3 of Chapter III". [text] — OMNI p.12
- Law-firm summaries read the rule as: systems placed on the market before the new deadlines need comply only if significantly changed afterwards; public-authority systems by 2 Aug 2030. [secondary, search summary] — [Loyens & Loeff](https://www.loyensloeff.com/insights/news--events/news/eu-ai-act-key-amendments-adopted-under-digital-omnibus-package/); [SRD Rechtsanwälte](https://www.srd-rechtsanwaelte.de/en/blog/digital-omnibus-ai-what-is-changing-in-the-ai-act)
- Critics say a large share of high-risk systems placed before December 2027 will never have to comply. [secondary, search summary] — [Tech Policy Press](https://techpolicy.press/eus-ai-act-delays-let-highrisk-systems-dodge-oversight)
- HIGHRISK: "CONDITIONAL, and worthless as a planning basis for tools under active development". SCOPE: SaaS with frequent updates is a "FALSE LOOPHOLE in most cases". BOOKLET: "do not count on this exemption". [notes] — HIGHRISK section 7; SCOPE section 4; BOOKLET p.7

### Inferences
All [my inference].

**What the rule protects**
- For a legacy Annex III tool that is unchanged, a private hotel has no Art. 26 duties, no Art. 27 assessment and no Art. 86 duty after 2 Dec 2027, because each attaches to a "high-risk AI system" to which the Regulation "shall apply ... only if" the design changes. HIGHRISK section 7 reaches the same reading. Rating: sound planning on the text.
- It does not protect against Art. 5, the GDPR, labour law or consumer law. It does not suspend Art. 50: Art. 50 duties do not depend on high-risk status, and the legislator wrote a separate, narrow transition for Art. 50(2) in Art. 111(4), which would be pointless if Art. 111(2) already switched Art. 50 off. SCOPE's "literal breadth" reading is therefore weaker than TRANSP's. Rating of "legacy covers our chatbot notice or emotion-recognition notice": evasion that fails.

**Where the notes are too pessimistic**
1. *Losing legacy status is not a cliff for the deployer.* If the vendor ships a significant change, recital 39 puts the consequence on the provider (full compliance, conformity assessment). The hotel then becomes an ordinary deployer of a compliant high-risk tool and starts Art. 26 duties. The planning task is to learn of the change in time (contract notice clause) and to have the Art. 26 routine ready to switch on, not to replace tools before 2 Dec 2027.
2. *Not every update is a significant change.* The test borrowed from substantial modification asks whether compliance with the Section 2 requirements is affected or the purpose changes. Security patches, bug fixes, interface changes and capacity changes do not obviously meet it. SCOPE argues that a never-assessed legacy tool cannot use the "pre-determined change" rule, so any retraining is significant. That argument cuts both ways: if the "initial conformity assessment" limb cannot be applied to a tool that never had one, what remains is the substantive question, and that is a question of degree. Rating: arguable. New model generations, new scoring features and new data categories are the clear cases of significant change.
3. *The type-and-model reading has more weight than SCOPE gives it.* Recital 39 was adopted together with the replaced paragraph and states what the paragraph is meant to do. A recital cannot override operative text, but here it explains it. Rating of "we bought in 2028 a tool whose same version was on the EU market in 2027": arguable to sound, provided the hotel holds the vendor's dated statement of type, model and version.
4. *The operative text says "designs", not "intended purpose".* Recital 177 adds purpose. A hotel should still treat a new purpose as ending the protection, because Art. 25(1)(c) separately makes whoever changes the purpose into a high-risk system the provider.

**Lawful steps before 2 Dec 2027 (2 Aug 2028 for Annex I Section A products)**

| Step | Effect afterwards | Limit | Rating |
|---|---|---|---|
| Put the tool into real operational service at the deploying entity before the date, and keep dated proof (contract, go-live record, version identifier, vendor statement of first EU placing) | Anchors Art. 111(2) for provider and deployer | Must be genuine use "for its intended purpose". Recital 39 says "lawfully placed": a tool that breaches the GDPR or Art. 5 is not helped | Sound planning |
| For an in-house tool (group-built CV screening or rota ranking), put it into service for own use before the date | The group, as provider, owes no conformity assessment, CE mark or registration while the design is unchanged | The design is frozen: retraining on new data, new features or a new architecture risks ending it. The GDPR, equal-treatment law and works-council law apply in full, and those are where the present enforcement risk lies [notes, TRANSP section 8] | Sound planning, with a real freeze cost |
| Contract for version pinning or a "no significant change without notice and consent" clause, and a vendor duty to flag any update it regards as a substantial modification | Lets the hotel choose between staying legacy and moving to the compliant version | Binds the vendor only. An authority judges the system as it is, not as the contract describes it | Sound planning |
| Enable, before the date, the modules the hotel actually intends to use | Switching on a function that already exists in the same type and model is use within the intended purpose, not a design change | If the module is new code shipped later, it is a design change. If the hotel's use departs from the vendor's stated purpose, Art. 25(1)(c) applies | Arguable |
| Run a trial under Art. 60 before the date | None for legacy purposes: an Art. 60 test is by definition not "putting into service", so it does not anchor Art. 111(2) | — | Planning trap. A hotel that wants legacy status needs ordinary go-live, not a test regime |
| Token "launch" of a shell product, later rebuilt under the same name; or a paper go-live with no real use | None | "Type and model" and "design" will be read on substance; the later product is a new system | Evasion that fails |
| Repurpose a legacy tool for a new high-risk job | Ends the protection (recital 177; Art. 25(1)(c)) | — | Evasion that fails |

- **What cannot be created before the date.** Because Arts. 6 and 25 sit in Chapter III Sections 1 and 3, nobody is a "provider of a high-risk AI system" under Art. 25 before 2 Dec 2027. SCOPE section 4 notes this and calls it uncomfortable. It is simply the text. It means the booklet's present-tense warning that a manager ranking CVs in a chatbot "can make the hotel the tool's maker" describes the position from 2 Dec 2027; today the constraint is the GDPR.
- **Minor textual point.** Art. 111(2) refers to "the date of application of Chapter III referred to in Article 113", while Art. 113(c) gives two dates for Sections 1 to 3 and other sections of Chapter III have applied since 2025 and 2026. Read with recitals 39 and 40, the cut-off is 2 Dec 2027 for Annex III systems and 2 Aug 2028 for Annex I systems. A reading that kept the old 2 Aug 2026 cut-off would make the amendment pointless. Rating of the 2027/2028 reading: sound.
- **What the booklet should say instead of "do not count on this exemption".** "A tool in real use before 2 Dec 2027 stays outside the high-risk duties while its design is unchanged. Keep proof of the date and version, and make the vendor tell you before any change that ends this. When it ends, the normal user duties start. It never covers the bans, the AI notices, data protection or labour law."

### Gaps
- No Commission guidance on "significant change in design" for cloud software was found by HIGHRISK or by me; the Art. 96(1)(c) guidelines on substantial modification are the place to watch.
- No commentary found that addresses the deployer's position under Art. 111(2) specifically (one search; summaries only).
- Whether an authority would accept a vendor's self-declared "same type and model" across software versions is untested.

---

## 4. Role planning: staying deployer, and what contracts can and cannot do

### Takeaway
For any high-risk tool a hotel group is better off as deployer, and it stays one by avoiding three acts: its own name on the tool, a change the provider did not foresee, and a use outside the provider's stated purpose. For non-high-risk tools Art. 25 does not apply at all, so branding or building them is cheap. Contracts decide cost, information and cooperation between the parties; with one textual exception (Art. 25(1)(a)) they do not decide roles towards an authority, but they do shape the facts from which roles are read.

### Cited Findings
- Provider = whoever "develops an AI system ... or ... has an AI system ... developed and places it on the market or puts the AI system into service under its own name or trademark". [text] — ACT p.46 (Art. 3(3))
- Art. 25(1)(a)–(c) and the contractual-arrangements clause; recital 84 repeats "without prejudice to contractual arrangements stipulating that the obligations are allocated otherwise". [text] — ACT p.67, p.23
- Art. 25(2) as replaced: the initial provider "shall no longer be considered to be a provider of that specific AI system" and must cooperate, unless it "has clearly specified that its AI system is not to be changed into a high-risk AI system". [text] — OMNI p.19–20
- Art. 25(4) as replaced: written agreement between the provider of a high-risk system and suppliers of systems, models, tools, services, components or processes; breach is now fineable under Art. 99(4)(da). [text] — OMNI p.20, p.35
- Intended purpose is "the use for which an AI system is intended by the provider", as specified in instructions, promotional or sales materials and technical documentation. "Reasonably foreseeable misuse" is use "not in accordance with its intended purpose" resulting from foreseeable human behaviour. [text] — ACT p.47 (Art. 3(12), 3(13))
- Art. 26(7) addresses "deployers who are employers". [text] — ACT p.68
- Commentary agrees that Art. 26 duties cannot be shifted to the vendor by contract, and recommends clauses on log access and retention, an escalation contact for incidents, and access to the provider's technical file. [secondary, search summaries] — [Secure Privacy](https://secureprivacy.ai/blog/eu-ai-act-article-26-deployer-obligations-and-what-enterprises-must-do-2026); [sota.io](https://sota.io/blog/eu-ai-act-art-26-obligations-deployers-high-risk-ai-systems-2026); [Kovrr](https://www.kovrr.com/blog-post/eu-ai-act-deployer-liability-becoming-the-provider)
- SCOPE: the Art. 25(1)(a) clause "is the only place where a contract can move a role". HIGHRISK: the team's "unless the contract allocates them back to the vendor" is "too firm". [notes] — SCOPE section 3; HIGHRISK section 6

### Inferences
All [my inference].

**When to stay deployer, and what to avoid**

| Choice | Why it keeps the hotel a deployer | Limit | Rating |
|---|---|---|---|
| Buy high-risk tools as the vendor's standard product, under the vendor's name, with the hotel's use case inside the vendor's written intended purpose | The vendor "places on the market under its own name"; the hotel "uses" | A bespoke build that the hotel specifies, owns and runs under its own name makes the hotel the provider ("has an AI system developed") whatever the contract calls the vendor | Sound planning |
| No hotel or brand name on a high-risk tool; if branding is wanted, keep the vendor identified as provider on the product and in the documents | Avoids Art. 25(1)(a) | "Powered by" wording does not help if the brand in substance presents the system as its own | Sound planning |
| White-label a high-risk tool with an express clause leaving provider obligations with the vendor | The text of Art. 25(1)(a) yields to "contractual arrangements stipulating that the obligations are otherwise allocated"; the phrase would be redundant if it meant only cost-sharing between the parties | Art. 25(2) says the initial provider "shall no longer be considered" provider when paragraph 1 applies, which pulls the other way. Untested | Arguable. Better: do not white-label high-risk tools |
| Brand or build non-high-risk tools freely (guest chatbot, content tools) | Art. 25 applies only to high-risk systems. Provider duties for such tools are Art. 50(1)–(2) | The hotel then owes the chatbot notice and, for generators, output marking | Sound planning |
| Configure and fine-tune only within what the vendor's documentation foresees; get the vendor's written list of "pre-determined" customer changes | Changes foreseen in the provider's assessment are not substantial modifications (Art. 3(23), 43(4)) | Retraining on hotel data outside that list is a substantial modification (HIGHRISK agrees) | Sound planning |
| Keep operational tools to their stated purpose; do not export outputs to rate individual staff | Avoids Art. 25(1)(c) | The first use of stock, waste or camera alerts to judge a named employee changes the purpose (HIGHRISK "purpose drift") | Sound planning; depends on discipline and access controls |
| Replace a learned scoring model with a rule written by people (seniority order, fixed knock-out criteria, availability-only allocation) | Outside Art. 3(1) per recital 12; no AI Act duty of any kind | The rules must be "defined solely by natural persons". Rules mined by machine learning and then hard-coded are not. GDPR automated-decision rules and labour law apply regardless | Sound planning if the rules are human-authored. Evasion that fails if a learned model is relabelled as rules |
| Use aggregate-only reporting; text instead of voice for sentiment; 1:1 verification instead of watch-list matching | Each moves the tool outside Annex III on its wording (AUDIT section 4 lists nine such down-switches) | The setting must match actual use; small teams make "aggregate" figures personal | Sound planning |
| Mandate outcomes in brand standards, not a specific tool with fixed settings; let the operating entity contract and configure | The brand does not "use" the system | If the brand receives and uses per-person outputs centrally, it is a deployer | Sound planning |
| Concentrate any unavoidable provider role in one EU group entity | One quality system and one conformity assessment; affiliates remain deployers | "Undertaking" may still be read as the group for fine ceilings | Sound planning |

**Who is provider when staff rank CVs in a general chatbot.** The text supports HIGHRISK's third position best: purpose is set by the provider (Art. 3(12)), and off-label use by a user is "reasonably foreseeable misuse" (Art. 3(13)), a concept the Act uses for the provider's risk management, not as a role switch. Art. 25(1)(c) needs someone who "modif[ies] the intended purpose" of a system. A one-off prompt modifies nothing. A standing workflow that the hotel sets up and names (a configured assistant wired into the applicant system) looks like putting a system into service for own use. So: ad hoc misuse by an employee does not make the hotel a provider (arguable, and consistent with SCOPE's "route (c) wording gap"); an institutional workflow does. The team data's "settled" is wrong; the booklet's "(our reading)" is the right marking. In either case the GDPR already forbids unstructured CV ranking in a consumer chatbot, so the argument has little practical value.

**Contract terms**

| Counterparty | Term | Binds authorities? |
|---|---|---|
| Vendor | Statement of who is provider; intended-purpose statement covering the hotel's use; Art. 6(3) status and registration reference; legacy statement (type, model, version, date of first EU placing) | No, but each is evidence of the hotel's good faith and of the facts |
| Vendor | Delivery of instructions for use (Art. 13); log export or retention of at least six months (Art. 26(6)); incident and risk channel with named contact (Art. 26(5)); information for the impact assessment (Art. 26(9)); support for authority requests (Art. 26(12)) | No. They make the hotel able to perform its own duties |
| Vendor | Notice before any update the vendor regards as a substantial modification or significant change; right to stay on the prior version for a period; list of pre-determined customer changes | No |
| Vendor | Chatbot notice built in and on by default (Art. 50(1)); output marking (Art. 50(2)) | No; these are the vendor's own duties |
| Vendor | Indemnity for fines and losses caused by the vendor's breach or wrong classification | No. Enforceability of fine indemnities depends on national law (not researched) |
| White-label vendor | Express allocation of provider obligations to the vendor under Art. 25(1)(a) | Possibly: the one clause the text itself recognises. Arguable |
| Brand / franchisee | Who selects, contracts, configures and can pause each tool; who receives outputs; who gives staff and candidate notices; who pays | No. Roles follow who "uses under its authority". The clause is evidence of authority and it fixes cost |
| Management company / owner | Same, plus: who is the employer for Art. 26(7); cost of compliance and fines; reporting to the owner | No |
| Staffing agency | Agency confirms it is the deployer of its own selection tools and gives its own notices | No; the hotel becomes deployer if its staff operate the tool (HIGHRISK row 14) |

- **The employer gap in Art. 26(7).** Where the management company is the deployer and the owner is the legal employer, the wording "deployers who are employers" reaches neither cleanly. HIGHRISK and SCOPE both flag it. It is not worth planning around: national information and consultation law binds the employer, and Art. 26(11) covers Annex III decisions about people in any case. Rating: arguable on the text, no practical value.

### Gaps
- The Commission's Art. 25 value-chain guidelines are not published [notes, HIGHRISK]; the white-label and general-chatbot points depend on them.
- No authority position or case on franchise or management-contract structures was found by any researcher or by me.
- AI Office voluntary model contract terms (Art. 25(4), second subparagraph): I did not check whether they have been published.

---

## 5. Evidence that reduces fines or liability

### Takeaway
Art. 99(7) turns preparation into a legal factor: an authority must consider the operator's measures, cooperation, self-reporting, negligence and mitigation "when deciding whether to impose an administrative fine" at all. After the Omnibus, warnings and non-monetary measures are named alongside fines and economic viability must be considered for SMEs and small mid-caps.

### Cited Findings
- Art. 99(7) criteria (a) to (j): nature, gravity, duration, purpose of the system, number of persons affected and damage; fines already applied by other market surveillance authorities for the same infringement; fines already applied by other authorities under other law for the same activity; size, turnover and market share; financial benefit gained or loss avoided; "the degree of cooperation with the national competent authorities"; "the degree of responsibility of the operator taking into account the technical and organisational measures implemented by it"; "the manner in which the infringement became known ... in particular whether, and if so to what extent, the operator notified the infringement"; "the intentional or negligent character of the infringement"; "any action taken by the operator to mitigate the harm suffered by the affected persons". [text] — ACT p.116
- Art. 99(1) as replaced (warnings, non-monetary measures, SME and SMC viability). [text] — OMNI p.35
- Art. 99(5): incorrect, incomplete or misleading information to authorities is fined up to EUR 7.5 million or 1%. [text] — ACT p.116
- Art. 99(6) and (6a): lower-of cap for SMEs (all tiers) and for small mid-caps (paragraphs 4 and 5 only). [text] — ACT p.116; OMNI p.35
- Art. 99(10): procedural safeguards and judicial remedy. [text] — ACT p.116
- Art. 57(7) and (12): sandbox written proof, exit report and fine shield. [text] — ACT p.88–89
- TRANSP's worked ceilings and its list of literacy evidence. [notes] — TRANSP sections 5 and 7

### Inferences
What a hotel should be able to show, mapped to the criteria. All [my inference].

| Art. 99(7) criterion | Evidence a hotel can hold |
|---|---|
| (g) responsibility, technical and organisational measures | Tool list with owner per tool; acceptable-use rule and list of approved tools; literacy measures with dates; vendor file per tool (provider identity, intended purpose, instructions for use, classification statement, legacy statement); named overseers with authority to pause; configuration records showing which person-level features are off |
| (i) intent or negligence | Written vendor classification and, for a filter claim, the EU database entry; legal assessment on file; a dated query to the national authority's advice channel (Art. 62(1)(c)); evidence that Commission guidelines were considered. Following guidelines is strong evidence against negligence even though they do not bind |
| (f) cooperation | A single contact point; prompt, complete and accurate answers; vendor contract clause securing vendor support for authority requests |
| (h) how the infringement became known | Internal reporting line; a record of self-notification where the hotel found the problem first. Staff can report under the whistleblowing directive (Art. 87, ACT p.110), so the hotel should want to be first |
| (j) mitigation of harm | Suspension record; re-run of affected decisions by a person; notice to affected staff or candidates; correction of outputs |
| (a) gravity, duration, persons affected | Logs showing when the feature was on, for how long, and how many people were scored |
| (c) fines under other law for the same conduct | Any data protection decision on the same facts, to be put before the AI Act authority |
| (d) size; Art. 99(6), (6a) | SME or small mid-cap status worked out with linked and partner enterprises; latest accounts |
| (e) benefit gained | A simple account showing no gain from the infringement |

- **Liability outside fines.** The same file supports the hotel in civil and labour proceedings: it shows the hotel used the tool as the maker instructed, which is the content of Art. 26(1). Under the new product liability rules the booklet notes that only a group that builds its own AI is a manufacturer [notes, BOOKLET p.6]; staying deployer keeps the hotel out of that regime.
- **Limit.** Evidence created after the event, or a file that describes a configuration the tool never had, is worse than no file: it adds Art. 99(5) exposure and removes the cooperation and negligence arguments. Rating of genuine preparation: sound planning. Rating of paper compliance: evasion that fails.
- **Sandbox route.** For an in-house high-risk build, sandbox participation is the only place where the text promises no fine at all (Art. 57(12)). See 1.2 for the limits.

### Gaps
- National penalty procedure, limitation periods and leniency practice in the focus countries were not researched; several countries have no penalty law yet [notes, TRANSP section 7].
- No AI Act fine against any operator was found as of November 2026 [notes, TRANSP section 8], so there is no practice on how Art. 99(7) is applied.
- Whether "undertaking" means the group for turnover purposes is untested [notes, BOOKLET p.7; TRANSP section 7].

---

## 6. Non-EU structures: what falls outside for Swiss and UK properties and what does not

### Takeaway
A Swiss or UK company using AI for its own property, with the output used there, is outside the AI Act. Any EU entity of the group is inside, and so is any arrangement in which a non-EU entity produces AI output that is used for decisions in the EU; recital 22 was written to defeat exactly that outsourcing.

### Cited Findings
- Art. 2(1)(a): providers placing on the market or putting into service in the Union, wherever established. Art. 2(1)(b): deployers "that have their place of establishment or are located within the Union". Art. 2(1)(c): third-country providers and deployers "where the output produced by the AI system is used in the Union". Art. 2(1)(g): "affected persons that are located in the Union". [text] — ACT p.45
- Recital 22: the rule exists "To prevent the circumvention of this Regulation"; scope reaches third-country operators "to the extent the output produced by those systems is intended to be used in the Union". [text] — ACT p.6
- Art. 22: an EU authorised representative is required for third-country providers of high-risk systems. No equivalent article for third-country deployers appears in the provisions read. [text] — ACT p.65; SCOPE reaches the same finding [notes]
- Booklet D1/D2: a stand-alone Swiss hotel serving guests in Switzerland, and a UK hotel serving guests in the UK, are not covered "(our reading)"; EU group hotels are. [notes] — BOOKLET p.20
- SCOPE rates "run it from head office abroad" a false loophole; rates a Swiss chatbot answering a guest in Paris "medium, genuine grey area"; rates a Swiss hotel screening EU-resident applicants for a Swiss job "low, grey". [notes] — SCOPE section 2

### Inferences
All [my inference].

| Situation | In scope? | Reasoning | Rating of "outside" |
|---|---|---|---|
| Swiss or UK property company runs rota, HR, camera or pricing AI for its own property | No | Output used outside the Union; not established in the Union | Sound planning |
| Same company screens applicants who live in the EU for a job in Switzerland or the UK | No, on the better reading | The output (the ranking) is used by the employer outside the Union. Art. 2(1)(g) lists affected persons for their rights; the obliged operators are defined by points (a) to (f) | Arguable; SCOPE is more cautious than the text requires |
| Swiss or UK hotel's vendor chatbot answers a guest sitting in the EU | The question hardly matters for the hotel | Art. 50(1) binds the provider, not the deployer, so a non-EU deployer has no duty to breach here. The vendor, if it sells in the EU, is covered anyway | Sound as to the hotel's own duties |
| Swiss or UK hotel publishes realistic AI images of the property to EU consumers | Possibly | Art. 50(4) is a deployer duty; the image is "used in the Union" if the hotel markets to EU guests (recital 22 "intended"). Enforcement against a company with no EU presence is weak, but distribution partners and consumer law are not | Arguable; label anyway |
| Non-EU head office runs one HR or guest-scoring tool and its output is used for staff or guests of EU hotels | Yes | Recital 22's own example | Evasion that fails |
| Non-EU head office builds a tool and supplies it to EU affiliates | Yes, as provider (Art. 2(1)(a)); authorised representative needed if high-risk | — | Evasion that fails |
| EU staff decisions routed through a Swiss or UK shared-service centre | Yes | Output used in the Union | Evasion that fails |
| Separate non-EU instance of a tool, with features that are high-risk or banned in the EU enabled only there, and no output flowing into EU decisions | Non-EU instance: no. EU instance: yes | Scope follows where output is used | Sound planning, if the data flows really are separate. Group dashboards that bring non-EU per-person output into EU decisions end it. Swiss and UK law apply to the non-EU instance (staff-monitoring ban in Swiss labour law, UK data protection rules) [notes, BOOKLET p.20–21] |

- **Legacy and non-EU history.** Recital 39 fixes the legacy date by first placing or putting into service "on the Union market". Earlier use only in Switzerland or the UK does not anchor Art. 111(2) for a later EU rollout. Rating of "it was live in Zurich in 2026, so the Paris rollout in 2028 is legacy": evasion that fails, unless the same type and model was also on the EU market before the date.
- **One standard or two?** TRANSP advises one standard everywhere. That is a business choice, not a legal requirement. A group may lawfully run lighter governance for non-EU properties, subject to local law.

### Gaps
- No guidance or commentary found on Art. 2(1)(c) for hospitality marketing or cross-border recruitment (SCOPE reports the same).
- Swiss and UK substantive law was not researched here; the booklet's Part D is the team's source.

---

## 7. Where the five researchers disagree, and which reading the text supports

### Takeaway
There are nine real differences between the notes, or between the notes and the team's booklet and data. On six the more hotel-favourable reading is the better supported by the text; on two the stricter reading is right; one cannot be resolved on the text.

### Cited Findings
The provisions are quoted in sections 1 to 6. Positions of the notes are taken from their takeaways, inference sections and exit registers. [notes]

### Inferences
All [my inference].

| # | Issue | Positions | Better supported by the text | Why |
|---|---|---|---|---|
| 1 | How far to rely on the legacy rule | HIGHRISK: widest exit but "worthless as a planning basis" for active tools. SCOPE: largest real loophole; SaaS updates a false loophole in most cases. BOOKLET: do not count on it | A middle position more favourable than all three: reliable for stable, pinned or in-house tools; a buffer for cloud tools; loss leads to normal compliance | Art. 111(2) covers "operators"; recital 39; significant change equals substantial modification, which needs an effect on compliance or purpose |
| 2 | Does legacy status switch off Art. 50 (and Art. 4)? | SCOPE: literal reading says yes, prudent reading no. TRANSP: no grandfathering for Art. 50 | TRANSP (stricter) | Art. 50 duties do not depend on high-risk status; Art. 111(4) gives Art. 50(2) its own narrow transition |
| 3 | White-label allocation clause (Art. 25(1)(a)) | SCOPE: the one place a contract can move a role. HIGHRISK: unclear whether it binds authorities. Team data: settled | SCOPE, held as arguable | The clause is in the operative text and recital 84; it has no function if limited to cost-sharing. Art. 25(2) creates the doubt |
| 4 | Is a brand that mandates a tool a deployer? | BOOKLET A4 and SCOPE section 6: yes or "assume so". SCOPE section 3: not on the wording | SCOPE section 3 | Art. 3(4): "using an AI system under its authority" |
| 5 | General chatbot used to rank CVs: who is provider? | BOOKLET: hotel can become maker (our reading). Team data: settled. HIGHRISK: three positions, least settled. SCOPE: wording gap | HIGHRISK's third position for ad hoc use; hotel as provider for a standing workflow | Art. 3(12), 3(13), 25(1)(c); and no Art. 25 switch before 2 Dec 2027 |
| 6 | SME status of a group-owned hotel company | TRANSP: false loophole for owned hotels. SCOPE: drafting gap, since Art. 3(14a) cites only "Article 2 of the Annex" and Art. 63(1) alone excludes linked enterprises expressly | Unresolved; TRANSP is the safer assumption | The contrast with Art. 63(1) is a real textual argument, but the thresholds in the Recommendation are normally computed with linked enterprises (not re-read), and the percentage cap runs on the "undertaking" |
| 7 | Does monitoring without evaluation fall in Annex III 4(b)? | HIGHRISK reports the draft: monitoring stands alone | The text is narrower than the draft | Annex III: "monitor and evaluate"; recital 57: "monitoring or evaluation". The annex is operative, the recital is not. Arguable, and labour law governs monitoring anyway |
| 8 | Is an unregistered Art. 6(3) claim invalid? | HIGHRISK: "not a valid one". SCOPE and TRANSP: silent | The text does not say so | Art. 6(3) is objective; Art. 6(4) and 49(2) are separate provider duties; Art. 80 puts correction on the provider |
| 9 | When did the Art. 50(3) notice start? | Team data ties it to 2 Dec 2027; HIGHRISK and TRANSP: 2 Aug 2026 | HIGHRISK and TRANSP (stricter) | Art. 50 is in Chapter IV, outside the delayed sections |

- **Common ground I accept without challenge:** human sign-off does not change classification; splitting a system into modules does not; "it is only a pilot" does not, outside Art. 60; size is not an exemption; Art. 5 has no consent exception and no legacy protection; a vendor's terms-of-service disclaimer alone does not narrow its intended purpose (this last point is draft guidance, but it follows from Art. 3(12)'s reference to sales materials and statements).

### Gaps
- Issue 6 needs the two Commission Recommendations (2003/361/EC and (EU) 2025/1099) read in full; neither was available this session.
- Issues 3, 5 and 7 await the final high-risk guidelines and the Art. 25 guidelines.

---

## 8. Register of exits proposed here, each with its honest limit and rating

### Takeaway
Twenty-four exits or reliefs are listed. Nineteen are sound planning on stated facts, three are arguable (rows 4, 9, 14) and two sit between the two ratings depending on the tool (rows 1, 3). The register also records, for each, the evasive version that a regulator or court would reject.

### Cited Findings
Provisions are quoted in sections 1 to 6; this table consolidates. Ratings are [my inference].

| # | Exit or relief | Provision | Lawful use | Where it becomes evasion | Rating of the lawful use |
|---|---|---|---|---|---|
| 1 | Legacy tool, hotel as deployer | Art. 111(2); OMNI recital 39 | Tool in real service before 2 Dec 2027, design unchanged, dated proof, vendor change notice | Sham go-live; relabelled new product; new purpose | Sound for stable tools; arguable for cloud tools |
| 2 | Legacy in-house tool, group as provider | Art. 111(2); Art. 3(11) | Put into service for own use before the date and freeze | Continued retraining or new features while claiming "unchanged" | Sound, with freeze cost |
| 3 | Later purchase of the same type and model | OMNI recital 39 | Same version, vendor attestation | Different version sold under the same product name | Arguable to sound |
| 4 | Routine updates are not significant changes | Recital 177; Art. 3(23) | Patches, fixes, interface | New model, new scoring feature, new data categories | Arguable |
| 5 | Real-world test as deployer partner | Art. 60(2), 60(4); Art. 3(57) | Approved, registered, time-limited trial with consent and reversibility | Open-ended "pilot" in normal operations | Sound |
| 6 | Sandbox fine shield | Art. 57(12) | Group builds a tool under an agreed plan and follows guidance | Departing from the plan; using the sandbox label after exit | Sound for builders |
| 7 | Ask the authority | Art. 62(1)(c); Art. 70(8) | Truthful written query; keep the answer | Selective or misleading description (Art. 99(5)) | Sound |
| 8 | Stay deployer: vendor's name, vendor's purpose | Art. 3(3), 3(12), 25(1) | Standard product, use within stated purpose | Bespoke build dressed as a licence | Sound |
| 9 | White-label with allocation clause | Art. 25(1)(a) | Express clause; vendor remains identified as provider | Brand presents the tool as wholly its own and vendor does not perform provider duties | Arguable |
| 10 | Brand or build non-high-risk tools | Art. 25(1) (high-risk only); Art. 50 | Chatbot, content tools, with notice and marking | Adding person-ranking features later | Sound |
| 11 | Configuration within the provider's foreseen changes | Art. 3(23); Art. 43(4) | Documented, vendor-listed options | Retraining outside the list | Sound |
| 12 | Human-written rules instead of a learned model | Recital 12; Art. 3(1) | Rules authored by people | Machine-learned rules hard-coded and called "rules" | Sound |
| 13 | Down-switches (aggregate output, text-only sentiment, 1:1 verification, worker-only feedback) | Annex III points 1 and 4; Art. 3(39) | Setting matches actual use; access controls | Setting on paper, per-person use in practice | Sound; worker-only feedback and objective allocation rest partly on draft guidance |
| 14 | Monitoring without evaluation is outside 4(b) | Annex III 4(b) "and" | Access or safety logs never used to assess staff | Any use of the data in appraisal or discipline | Arguable |
| 15 | Buy a tool with a registered Art. 6(3) assessment | Art. 6(3)–(4); Art. 80 | Narrow procedural or preparatory tool, no profiling, registered | Tool that scores people; hotel uses it to rank | Sound |
| 16 | Oversight organised the hotel's way; performed by contractors | Art. 26(2)–(3) | Competent, trained people with authority to stop the tool | A name on paper with no authority | Sound |
| 17 | Logs and input-data duties limited to what the hotel controls | Art. 26(4), 26(6) | Contract for access where the vendor holds logs | Arranging not to have access in order to avoid the duty | Sound; the avoidance version is arguable at best and looks bad under Art. 99(7)(g) |
| 18 | Notices folded into existing documents | Art. 26(7), 26(11) | Clear, timely, actually received | Buried or after the fact | Sound |
| 19 | No impact assessment, no registration, no duty to verify CE mark for private hotels | Art. 27(1); Art. 26(8); Art. 49(3) | Private hotel, not credit scoring, not a public service | — | Sound [text] |
| 20 | Machinery AI: no Art. 26 duties | Art. 2(2); Annex I Section B point 21 | Kitchen and cleaning robots, automatic doors | — | Sound [text]; sectoral rules to come by 2 Aug 2028 [notes, HIGHRISK] |
| 21 | Editorial-responsibility exception for AI text | Art. 50(4) | Real review; company holds responsibility | Rubber-stamp review | Sound |
| 22 | Chatbot notice is the vendor's duty | Art. 50(1) | Unmodified vendor bot | Hotel disables the notice; hotel-built bot | Sound |
| 23 | Non-EU property outside scope | Art. 2(1)(c); recital 22 | Output used only outside the Union | Routing EU decisions through a non-EU entity | Sound |
| 24 | Lower fine exposure through evidence, SME or small mid-cap cap, warnings | Art. 99(1), (6), (6a), (7) | Genuine prior measures, cooperation, self-reporting | Back-dated files; splitting a group into "SMEs" | Sound; SME status for group-owned entities is arguable |

### Inferences
- **A simple test for the booklet.** An exit is lawful planning when the hotel would be content to describe it, in full, to the authority (Art. 26(12) requires cooperation and Art. 99(5) fines misleading answers). It is evasion when it works only if the authority does not learn how the tool is really used. [my inference]
- **Priority for a general counsel.** In value order: (1) fix the legacy position of every staff tool before 2 Dec 2027 (rows 1 to 4); (2) keep the group a deployer for anything high-risk (rows 8 to 13); (3) build the Art. 99(7) file (row 24); (4) use Art. 60 or a sandbox for new high-risk tools after the date (rows 5 and 6). [my inference]
- **What does not change.** None of these exits touches the GDPR, national labour law or consumer law, which TRANSP rates as the realistic enforcement channels for hotels in 2026 to 2028 [notes, TRANSP section 8]. A hotel that uses every AI Act exit above and ignores those laws has reduced the smaller risk. [my inference]

### Gaps
- No exit in this register has been tested before an authority or court; the high-risk regime is not yet applicable.
- Web commentary was available only as search summaries; no law-firm page was opened. I found no commentary written from the deployer's planning side on Art. 111(2), Art. 60 partnerships or Art. 57(12).
- The final Commission guidelines on high-risk classification, on Art. 25 and Art. 26, and on substantial modification could confirm or close rows 3, 4, 9, 13, 14 and 15.
