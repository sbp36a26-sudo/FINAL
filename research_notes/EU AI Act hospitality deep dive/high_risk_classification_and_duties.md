# High-risk AI under the EU AI Act for hotels and in-hotel F&B: classification, duties, provider switch, exits

State of the law: November 2026, i.e. Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744 (Digital Omnibus on AI, in force 27 Jul 2026). High-risk dates: **2 Dec 2027** (Annex III) and **2 Aug 2028** (Annex I) (Art. 113 third para, point (c), as replaced; Omnibus PDF p.35).

**How to read these notes**

- Source tags on every statement: **[text]** = read by me in one of the two local regulation PDFs; **[team data]** = from `ai-act-data.json` or the booklet, not re-verified by me against the Commission draft (the team's paragraph numbers for the draft guidelines are theirs); **[secondary]** = law-firm or industry commentary seen only as a web-search summary (page fetches were blocked for every site tried: faegredrinker.com, dirittobancario.it, dataprotectionreport.com); **[inference]** = my own reasoning.
- Source shorthand: **ACT** = `/home/user/final/tools/ai-act-explorer/EU AI Act June 2024.pdf` ([ELI](http://data.europa.eu/eli/reg/2024/1689/oj)); **OMNI** = `/home/user/final/tools/ai-act-explorer/Digital Omnibus July 2026.pdf` ([ELI](http://data.europa.eu/eli/reg/2026/1744/oj)); **DATA** = `/home/user/final/tools/ai-act-explorer/ai-act-data.json`; **BOOKLET** = `/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf`. Page numbers are PDF pages.
- Verdicts on exits: **SAFE** (rests on the regulation text), **CONDITIONAL** (works only if stated conditions hold, or rests on draft guidance), **FALSE** (a regulator would reject it).
- I did not read the Commission's draft guidelines themselves (no local copy in the repo; download blocked). Everything attributed to them comes from team data or search summaries.

---

## 1. Annex III, all eight areas: which hotel and in-hotel F&B uses fall in

### Takeaway
Only three Annex III areas are live for an ordinary hotel: point 4 (employment, by far the largest), point 1 (biometrics: remote identification and guest emotion recognition) and, at the margin, point 5(b) (credit scoring of individuals). Points 2, 6, 7, 8, 5(a) and 5(c) are out on the wording; point 3 (education) and point 5(d) (emergency-call triage) are out for most hotels but are less "settled" than the team data says.

### Cited Findings
- **Structure.** Annex III systems are high-risk via Art. 6(2); each sub-point is defined by what the system is "intended to be used" for. [text] — [ACT p.53 (Art. 6(2)), p.127–129 (Annex III)](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Annex III was not amended by the Omnibus** (the Omnibus touches Annexes I, VIII and adds XIV only). [text] — [OMNI p.36, points (41)–(43)](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Point 1(a) remote biometric identification.** In: identifying people "without their active involvement, typically at a distance" against a reference database (Art. 3(41)). Out by express wording: "biometric verification the sole purpose of which is to confirm that a specific natural person is the person he or she claims to be"; recital 54 adds access to a service, unlocking a device, secure access to premises. [text] — [ACT p.48 (Art. 3(35),(36),(41)), p.127, p.15 (recital 54)](http://data.europa.eu/eli/reg/2024/1689/oj). Hotel reading: lobby-camera VIP or banned-guest recognition and unprompted voiceprint recognition of callers are in; selfie-to-ID check-in is out; opt-in access control where the guest presents themselves is out. [team data, draft guidelines paras 136–144] — DATA `annexIIIReference`, `biometricFindings` b1–b3
- **Point 1(b) biometric categorisation by sensitive attributes.** The team data says this is "prohibited outright under Art. 5" (confidence "settled"). The text is narrower: Art. 5(1)(g) prohibits only inference of race, political opinions, trade-union membership, religious or philosophical beliefs, sex life or sexual orientation. Recital 54 keeps 1(b) for categorisation by Art. 9 GDPR attributes "in so far as these are not prohibited" (for example health or disability). [text] — [ACT p.52 (Art. 5(1)(g)), p.15 (recital 54)](http://data.europa.eu/eli/reg/2024/1689/oj). Age and gender estimation are not 1(b). [team data, draft p.35] — DATA `biometricFindings` b5
- **Point 1(c) emotion recognition.** Defined as inferring emotions or intentions "on the basis of their biometric data" (Art. 3(39)); text-only sentiment analysis is therefore outside. Of staff: prohibited (Art. 5(1)(f)) except "medical or safety reasons". Of guests: high-risk. [text] — [ACT p.48, p.51, p.127](http://data.europa.eu/eli/reg/2024/1689/oj). Commission worked example: call-centre AI reading customers' tone, pitch and volume is high-risk. [team data, draft p.37] — DATA `biometricFindings` b4
- **Point 2 critical infrastructure.** Wording: "safety components in the management and operation of critical digital infrastructure, road traffic, or in the supply of water, gas, heating or electricity"; "critical infrastructure" is defined by reference to Directive (EU) 2022/2557; recital 55 speaks of failure putting life and health at risk "at large scale". [text] — [ACT p.127, p.50 (Art. 3(62)), p.15 (recital 55)](http://data.europa.eu/eli/reg/2024/1689/oj). A hotel's own building-management, energy or water system consumes these utilities; it does not supply them as critical infrastructure. Out.
- **Point 3 education and vocational training.** Four limbs (admission, evaluating learning outcomes, assessing appropriate level, proctoring), all tied to "educational and vocational training institutions at all levels". [text] — [ACT p.127, p.16 (recital 56)](http://data.europa.eu/eli/reg/2024/1689/oj). A hotel school is squarely an institution. For in-house staff training the team routes the issue through point 4(b): AI assessment of training falls in 4(b) where completion conditions pay, promotion, grade or continued employment; optional training without entitlement does not. [team data, draft para 261] — DATA `employmentFindings` e6
- **Point 4 employment.** See section 4 below.
- **Point 5(a).** Only systems used "by public authorities or on behalf of public authorities" to decide eligibility for public benefits and services. [text] — [ACT p.127](http://data.europa.eu/eli/reg/2024/1689/oj). Out for hotels.
- **Point 5(b) creditworthiness.** Wording: "evaluate the creditworthiness of natural persons or establish their credit score, with the exception of AI systems used for the purpose of detecting financial fraud". The sub-point itself contains no "essential services" limit; that comes from the area heading and recital 58 ("access to financial resources or essential services such as housing, electricity, and telecommunication services"). [text] — [ACT p.127, p.16 (recital 58)](http://data.europa.eu/eli/reg/2024/1689/oj)
  - Draft guidelines: limited to essential private services; leisure and travel loans are not essential; corporate-account assessment is out even where an owner backs the loan; sole traders are natural persons; fraud detection must be the main intended use; marketing segmentation is out. [team data, draft paras 73–74, 297–309, p.88] — DATA `creditFindings` c1–c3, `horizontalFindings` g6
  - Hotel mapping: guest deposit or pre-authorisation scoring for a stay is most likely out; corporate accounts out; long-stay or serviced apartments used as a home could be "housing". [team data, marked "judgement"/"do not bank"] — DATA `annexIIIReference` 5(b), `interimPostures` oi1
- **Point 5(c).** Risk assessment and pricing "in the case of life and health insurance" only. [text] — [ACT p.127](http://data.europa.eu/eli/reg/2024/1689/oj). Room, menu and table pricing are not in Annex III. [team data] — DATA `notHighRisk`
- **Point 5(d).** "AI systems intended to evaluate and classify emergency calls by natural persons or to be used to dispatch… emergency first response services". The first limb is not restricted to public authorities. [text] — [ACT p.128](http://data.europa.eu/eli/reg/2024/1689/oj). Team data: "Not a hotel exposure", confidence "settled". — DATA `annexIIIReference` 5(d)
- **Points 6 and 7.** Every sub-point requires use "by or on behalf of" law-enforcement or competent public authorities (or Union bodies). [text] — [ACT p.128](http://data.europa.eu/eli/reg/2024/1689/oj). A hotel scanning passports or passing guest registration data to police is not such a user. Out.
- **Point 8.** Judicial authorities or "in a similar way in alternative dispute resolution"; election influence. [text] — [ACT p.128–129](http://data.europa.eu/eli/reg/2024/1689/oj). Out.
- **Team's count:** of 91 hotel AI uses, 3 are high-risk as normally used (recruiting, matching seasonal staff, scoring reservation agents' calls) and 13 more become high-risk depending on set-up; 11 of the 16 concern staff. [team data] — BOOKLET A6, p.7–8 of the booklet

### Inferences
- **Buy-now-pay-later for stays.** The entity scoring the guest is the lender, so the lender is deployer, not the hotel. The draft's two statements pull in different directions: "loans and credit lines" are financial resources (in), but "leisure and travel loans" are not essential (out). The team data does not address BNPL. [inference]
- **In-house credit to individuals** (house accounts for local regulars, membership or residence-club instalments, timeshare-style financing, wedding or event instalment plans) is closer to "credit lines" than a deposit decision is. I would treat AI scoring of individuals for these as 5(b) until the final guidelines say otherwise; it would also trigger the FRIA (Art. 27(1)). [inference]
- **5(d) is less settled than "settled".** An AI switchboard, in-room voice assistant or staff panic-button system whose stated purpose includes recognising and prioritising emergency calls could fit the first limb on its wording. An ordinary reservations voice agent that merely hands off anything unusual is not "intended to" classify emergency calls. The team did not read the draft's 5(d) section. [inference]
- **Point 2 edge:** a remote or island resort that itself operates the water or power supply for a wider community could approach "supply of water… or electricity"; an ordinary hotel cannot. [inference]
- **Point 3 edge:** hotel groups that are formal training companies in apprenticeship systems, or that run accredited academies awarding recognised qualifications, may count as "vocational training institutions". That would add point 3(b) on top of 4(b), and, if the body is a "private entity providing public services" (recital 96 names education), a FRIA duty. [inference]
- **Point 7(d)** excepts "verification of travel documents" and only covers public-authority use; hotel ID-scanning AI is outside Annex III either way, but remains GDPR-relevant. [inference]

### Gaps
- The team's `coverageCaveat` says draft-guideline sections for points 2, 3, 5(a), 5(c), 5(d), 6, 7, 8 were not read. I could not read them either. The "out" conclusions for those points rest on the regulation text only.
- No source found on whether in-company training or apprenticeship providers are "vocational training institutions" (search returned only the draft's table of contents). [secondary, search summary] — [datalawgy summary](https://datalawgy.substack.com/p/commissions-draft-guidelines-on-the)
- Final guidelines: not adopted as far as search shows; draft of 19 May 2026 remains the reference, adoption planned "by end of 2026". [secondary, search summary] — [Commission library page](https://digital-strategy.ec.europa.eu/en/library/draft-commission-guidelines-classification-high-risk-ai-systems); [Modulos tracker](https://docs.modulos.ai/frameworks/eu-ai-act/commission-guidance)

---

## 2. The Art. 6(3) filter and the profiling override

### Takeaway
The filter is a provider's tool, not a hotel's: only the provider can claim it, must document the assessment before market placement and register the system publicly. It is unusable for anything that evaluates individual people (profiling), which removes rota-ranking, candidate-scoring and call-scoring tools; it is plausibly usable for pure CV parsing, interview scheduling and report compilation.

### Cited Findings
- **Test.** An Annex III system is not high-risk "where it does not pose a significant risk of harm… including by not materially influencing the outcome of decision making", and this "shall apply where any of" four conditions holds: (a) narrow procedural task; (b) improving the result of a previously completed human activity; (c) detecting decision-making patterns or deviations, not meant to replace or influence the prior human assessment without proper human review; (d) preparatory task to an assessment. [text] — [ACT p.54 (Art. 6(3))](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Override.** "an AI system referred to in Annex III shall always be considered to be high-risk where the AI system performs profiling of natural persons". Profiling = GDPR Art. 4(4). [text] — [ACT p.54, p.49 (Art. 3(52))](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Recital 53 examples.** (a) turning unstructured into structured data, classifying incoming documents, detecting duplicate applications; (b) improving the language of a drafted document; (c) checking ex post whether a teacher deviated from their grading pattern; (d) file handling: indexing, searching, text and speech processing, linking data, translation. [text] — [ACT p.14–15](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Paperwork.** The provider "shall document its assessment before that system is placed on the market or put into service", is "subject to the registration obligation set out in Article 49(2)", and must hand the documentation to authorities on request. [text] — [ACT p.54 (Art. 6(4)), p.81 (Art. 49(2))](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Omnibus kept registration but slimmed it.** Annex VIII Section B points 7 (summary of grounds) and 9 (Member States) are deleted; recital 22 says registration "remains crucial" and the provider "remains obligated to document its assessment". [text] — [OMNI p.36 (point 42), p.8 (recital 22)](http://data.europa.eu/eli/reg/2026/1744/oj); original list at [ACT p.136](http://data.europa.eu/eli/reg/2024/1689/oj)
- **The register is public** (Art. 71(4)), so a filter claim is visible to works councils, unions and journalists. [text] — [ACT p.100](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Policing.** A market surveillance authority can re-evaluate a 6(3) claim, order compliance, and fine a provider that misclassified "in order to circumvent" the requirements. [text] — [ACT p.107 (Art. 80)](http://data.europa.eu/eli/reg/2024/1689/oj)
- **The list of conditions can change** by delegated act, in either direction. [text] — [ACT p.54 (Art. 6(6)–(8))](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Draft guidelines:** the filter is read narrowly; "narrow procedural task" excludes any value judgement on decision-relevant data; split or agentic architectures are assessed as a whole so a filter-eligible module loses the filter inside a high-risk configuration; human involvement is not a classification exit and matters only as evidence inside 6(3). [team data, draft paras 70, 72, 75, 88, 90, 92–93] — DATA `horizontalFindings` g1–g4
- **Draft examples.** Job-description generation from recruiter-defined content = narrow procedural task; attendance-record compilation with no scoring or flags = in 4(b) but filtered under 6(3)(d); a retail scheduler using punctuality, no-show history and ratings = high-risk, no filter. [team data, draft paras 245–247, p.76, p.78] — DATA `employmentFindings` e8, e10, e13
- **Commentary:** CV parsers and interview-scheduling systems are cited as 6(3) cases that still require registration; because most HR and task-allocation tools evaluate individuals, the profiling override "effectively removes a substantial proportion of HR-related AI use from the exemption". [secondary, search summaries] — [McCann FitzGerald](https://www.mccannfitzgerald.com/knowledge/data-privacy-and-cyber-risk/employment-spotlight-eu-ai-act-draft-guidelines-on-high-risk-ai-classification); [Faegre Drinker](https://www.faegredrinker.com/en/insights/publications/2026/6/draft-commission-guidelines-on-high-risk-ai-implications-for-the-workplace); [Cuatrecasas](https://www.cuatrecasas.com/en/portugal/intellectual-property/art/draft-guidelines-ai-systems)

### Inferences
Usability for the three tool types asked about:

| Tool | Filter usable? | Why | Verdict |
|---|---|---|---|
| CV parser that only extracts fields into the applicant system, no score, rank or match | Yes, 6(3)(a) | Recital 53's "unstructured into structured data"; no evaluation of the person, so no profiling | CONDITIONAL: fails the moment a match score, ranking, knock-out or "top candidates" view is added |
| Rota tool using only availability, accreditation, location, contract hours | Probably not needed, and available if needed | Draft puts objective-criteria allocation outside the task-allocation limb; no evaluation of personal aspects, so no profiling | CONDITIONAL: the draft also treats significant working-time changes and leave decisions as 4(b) "terms", so a rota generator may be in 4(b) by that limb and then depends on the filter |
| Rota tool that ranks by punctuality, reliability, ratings, shift acceptance | No | Profiling override | FALSE |
| Call scoring of individual reservation agents | No | Evaluates work performance of identified people = profiling | FALSE |
| Call analytics reported only at team or site level, with no per-agent attribution | Not in 4(b) at all if truly unattributable | No monitoring of "persons" | CONDITIONAL: small teams and shift patterns make re-identification easy |

- **A hotel that is only a deployer cannot invoke 6(3) itself.** Art. 6(4) addresses the provider. The hotel's practical check is whether the vendor has documented and registered the claim; an unregistered claim is not a valid one. [inference from Art. 6(4), 49(2)]
- **Penalty gap.** Art. 99(4) lists the fineable operator duties (Arts. 16, 22, 23, 24, 26, 31/33/34, 50, plus new (da) for Art. 25(2) and (4)); Arts. 6(4) and 49(2) are not on the list (49(1) is, via Art. 16(i)). A failure to document or register a filter claim is fineable at EU level only through Art. 80(7) (circumvention) or national rules under Art. 99(1). [inference from text] — [ACT p.115](http://data.europa.eu/eli/reg/2024/1689/oj); [OMNI p.35](http://data.europa.eu/eli/reg/2026/1744/oj)

### Gaps
- How the draft defines "profiling" for the override (whether any per-person output counts) — not available to me; the team data has no finding on it.
- Whether the final guidelines keep the registration-triggering 6(3) examples (CV parsing, scheduling) — unknown until adoption.

---

## 3. The Annex I route after the Omnibus

### Takeaway
For hotels the product route is now thin and mostly someone else's job: the product manufacturer is the provider, machinery has moved to a sectoral regime where the AI Act's high-risk chapters (including deployer duties) do not apply, and non-safety optimisation is carved out. The team's "lifts, gas appliances, pressure equipment" summary is right for mainstream hotels but omits medical devices in spas, cableways, recreational craft and the limit set by the third-party-assessment condition.

### Cited Findings
- **Two cumulative conditions:** (a) the AI is a safety component of, or is itself, an Annex I product; and (b) that product "is required to undergo a third-party conformity assessment" under the Annex I law. [text] — [ACT p.53 (Art. 6(1))](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Safety component redefined:** "fulfils a safety function… or the failure or malfunctioning of which endangers the health and safety of persons or property"; a safety function exists "where its intended purpose is to prevent or mitigate risks to health and safety of persons or property". [text] — [OMNI p.16 (Art. 3(14))](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Carve-out, Art. 6(1a):** systems "solely used for non-safety related aspects of user assistance, performance optimisation, service efficiency, automation or convenience or quality control shall not qualify as safety components". **Claw-back, Art. 6(1b):** "Notwithstanding paragraph 1a, AI systems the failure or malfunctioning of which would endanger health and safety shall qualify as safety components." **Art. 6(1c):** a product needing third-party assessment "solely due to risks other than risks to health and safety, in particular… radio spectrum or electromagnetic interference" does not meet condition (b). [text] — [OMNI p.18](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Recital 7:** the safety function is "determined by the provider"; "The mere fact that an AI system is integrated into or operates within a product… does not, in itself, mean that it fulfils a safety function." [text] — [OMNI p.3](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Machinery moved to Section B.** Annex I Section A point 1 deleted; Regulation (EU) 2023/1230 added as Section B point 21. For Section B products "only Article 6(1), Article 60a and Articles 102 to 112 shall apply". AI requirements for machinery will arrive through delegated acts amending the Machinery Regulation, to "apply by 2 August 2028". [text] — [OMNI p.36 (point 41), p.15 (Art. 2(2)), p.13 (recital 42), p.39–40 (Art. 3)](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Section A after the Omnibus** (points 2–12): toys; recreational craft; lifts; ATEX equipment; radio equipment; pressure equipment; cableways; PPE; gas appliances; medical devices; in-vitro diagnostics. **Section B** includes civil-aviation security, two/three-wheel vehicles and quadricycles, marine equipment, rail, motor vehicles, unmanned aircraft, and now machinery. [text] — [ACT p.124–125](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Who is the provider:** for Section A safety components, the product manufacturer, when the system is marketed or put into service under its name. [text] — [ACT p.67 (Art. 25(3))](http://data.europa.eu/eli/reg/2024/1689/oj)
- **No forced notified body:** classification as high-risk "does not affect the choice of the conformity assessment procedure" under the sectoral law. [text] — [OMNI p.22 (Art. 43(3)), p.7 (recital 20)](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Possible further relief, Art. 2(13):** Arts. 9–15 and 17–25 "may be limited" for Section A systems where the sectoral law gives equivalent protection; delegated acts due by 2 Aug 2027. Note the range stops at Art. 25, so deployer duties in Art. 26 are not within this relief. [text] — [OMNI p.16](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Draft Annex I guidelines:** lift door timing and obstacle detection is a safety component even if marketed for efficiency; gas-combustion optimisation can be one if failure risks CO, fire or explosion; heating-schedule optimisation is not; smart thermostats mostly out, door locks a possible exception. The draft appears to predate the machinery move. [team data, draft paras 37–49] — DATA `annexIIIReference.annexI.draftGuidelines`

### Inferences
Hotel product map (my reading; sectoral-law details are from general knowledge, not checked against those laws in this session):

| Hotel item | Annex I entry | Position |
|---|---|---|
| Lifts (door, obstacle, levelling AI) | A.4 | In. Lift maker is provider; hotel is deployer with Art. 26 duties from 2 Aug 2028 |
| Gas kitchen appliances, gas boilers | A.10 | In only if the AI is safety-relevant (flame, combustion, leak); efficiency-only AI is out unless failure endangers health (6(1b)) |
| Boilers, steam and hot-water plant | A.7 | In only for equipment in categories that require a notified body; low-category equipment fails condition (b) |
| Kitchen robots, combi-oven automation, laundry lines, automatic doors, delivery and cleaning robots, pool dosing plant | B.21 machinery | Sectoral regime. AI Act Arts. 8–27 do not apply, so **no Art. 26 deployer duties for the hotel**; safety rules come via the Machinery Regulation |
| Wi-Fi devices, smart locks, IoT sensors | A.6 radio | Out via 6(1c) unless a health-and-safety third-party assessment applies |
| Kids'-club connected toys | A.2 | Mostly out: third-party assessment is typically needed only where harmonised standards are not applied |
| Spa and medical-wellness devices with AI (diagnostic skin or body analysis; aesthetic laser or IPL equipment), AEDs | A.11 | **Missing from team data.** If the device is a medical device needing a notified body, embedded AI is high-risk; the hotel spa is a deployer |
| Resort cableways and funiculars; resort boats and jet-skis | A.8; A.3 | **Missing from team data.** Relevant to mountain and marina resorts only |
| Drones for marketing or security; autonomous shuttles, golf-cart-type quadricycles | B.20; B.14, B.18–19 | Sectoral regime, as machinery |

- **Where 6(1a) could be over-claimed:** the carve-out needs "solely" non-safety use and yields to 6(1b). Hotel systems sold as "efficiency" or "comfort" but whose failure can hurt people: ventilation control in kitchens and car parks (CO), hot-water temperature control (legionella, scalding), pool chemical dosing, lift traffic optimisation that touches door timing, gas-burner optimisation. A vendor label of "optimisation" does not decide the matter; the failure test does. [inference from Art. 6(1b), Art. 3(14)]
- **Counter-point:** even where 6(1b) bites, high-risk status still needs an Annex I product with third-party assessment. A stand-alone building-management system is usually not itself such a product, so most BMS AI stays outside regardless. [inference]
- **A hotel group becomes provider on this route** only if it builds or substantially modifies safety AI for such equipment (BOOKLET says "rare"). [team data] — BOOKLET, maintenance section

### Gaps
- Which conformity modules apply to specific hotel equipment under the lift, gas-appliance, pressure-equipment, toy and medical-device laws was not verified against those laws.
- Content of the Art. 2(13) delegated acts and the Machinery Regulation delegated acts: not yet adopted.

---

## 4. Employment (Annex III 4(a), 4(b)): where the line runs

### Takeaway
Anything that selects, ranks, evaluates or monitors identifiable workers or candidates is high-risk; anything that only schedules on objective inputs, protects property, or feeds back to the worker alone is outside on the current draft. The line is drawn by the provider's stated intended purpose, read from all its sales and technical material, so a vendor cannot disclaim HR use while selling per-employee features.

### Cited Findings
- **4(a):** "recruitment or selection of natural persons, in particular to place targeted job advertisements, to analyse and filter job applications, and to evaluate candidates". **4(b):** "make decisions affecting terms of work-related relationships, the promotion or termination of work-related contractual relationships, to allocate tasks based on individual behaviour or personal traits or characteristics or to monitor and evaluate the performance and behaviour of persons in such relationships". [text] — [ACT p.127](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Recital 57:** scope should "involve employees and persons providing services through platforms"; rationale is impact on "future career prospects, livelihoods… and workers' rights". The recital says "monitoring or evaluation" where the Annex says "monitor and evaluate". [text] — [ACT p.16](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Intended purpose** = "the use for which an AI system is intended by the provider… as specified in the information supplied by the provider in the instructions for use, promotional or sales materials and statements, as well as in the technical documentation". [text] — [ACT p.47 (Art. 3(12))](http://data.europa.eu/eli/reg/2024/1689/oj)
- **National labour law can be stricter** (Art. 2(11)). [text] — [ACT p.46](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Draft guidelines, widening points** [team data] — DATA `employmentFindings` e1–e11:
  - Scope covers freelancers, agency staff, solo self-employed and platform workers (paras 238–241).
  - "Decisions" is functional: includes a human who formally decides but significantly relies on the output; omissions count (para 258).
  - "Terms" include pay, working time, leave, rest; examples: denial of a leave request, significant change to regular hours (para 259).
  - Termination includes AI-driven non-renewal of fixed-term contracts (para 264).
  - Punctuality, responsiveness, reliability metrics and ratings are "personal traits" (para 270).
  - Monitoring stands alone; output speed and tasks completed are performance (paras 274–275).
  - 4(a) reaches targeted ads, prospecting and pre-application screening (paras 245, 247).
- **Draft guidelines, narrowing points** [team data, flagged "do not bank"] — DATA `employmentFindings` e4, e9, e12, e13:
  - Allocation on availability, required accreditation or proximity is outside the task-allocation limb (paras 271–272).
  - A significance threshold exists: break timing within an assigned shift is out (para 262).
  - AI used exclusively for legal obligations, medical or safety reasons, or to protect property is out unless also used to evaluate staff; feedback only to the worker is out (paras 277–278).
  - Flagging an expiring fixed-term contract without evaluation is out (para 266).
- **Vendor disclaimers:** if instructions, terms, marketing or documentation present a system as broadly applicable and "do not consistently limit or exclude high-risk uses", the intended purpose is deemed to include them; a terms-of-service exclusion alone is insufficient. [team data, general principles para 12] — DATA `generalPrincipleFindings` p1. Commentary agrees: "contractual carve-outs without coherent operational substance will not insulate" from provider obligations. [secondary, search summary] — [DLA Piper](https://www.dlapiper.com/en/insights/publications/2026/06/eu-commission-draft-guidelines-on-classification-of-high-risk-ai-systems-key-points)
- **Commentary examples:** shift scheduler using behavioural signals = high-risk; interview-scheduling assistant and desk-booking optimiser = out. [secondary, search summary] — [Faegre Drinker](https://www.faegredrinker.com/en/insights/publications/2026/6/draft-commission-guidelines-on-high-risk-ai-implications-for-the-workplace)

### Inferences
Line-by-line for the hotel cases asked about (all [inference] applying the text and the team's reading of the draft):

| Use | Position | Decisive fact |
|---|---|---|
| CV screening, ranking, video-interview scoring, seasonal-staff matching | High-risk, 4(a) | Always |
| Targeted job ads on social platforms | High-risk, 4(a) (named in text) | The ad-platform's targeting AI is the system; the platform is provider, the hotel is deployer |
| Writing job ads with a general chatbot | Out or filtered | Content defined by the recruiter (draft para 247) |
| Rota on availability, skills, contract hours | Outside task-allocation limb | Stays out only if no behavioural input and no significant change to regular hours decided by the AI |
| Rota or shift bidding ranked on reliability, ratings, acceptance | High-risk, 4(b) | Profiling; no filter |
| Auto-approval or refusal of leave and shift swaps | High-risk, 4(b) "terms" | Draft para 259 |
| Housekeeping room allocation by room status, floor, checkout time | Out | Objective, external criteria |
| Housekeeping allocation or inspection that scores attendants' speed or quality | High-risk, 4(b) | Performance monitoring |
| Tip-pool or service-charge distribution by a fixed formula (hours, points) | Not an AI system | Rule written by people |
| Tip or bonus distribution using AI performance scores | High-risk, 4(b) | Decision affecting pay |
| Dashboards ranking individual staff (upsell, reviews naming staff, speed) | High-risk, 4(b) | Evaluation of persons; reviews-by-name analytics is an easy way to drift in |
| Training assessment that gates pay, grade, promotion or renewal | High-risk, 4(b) | Draft para 261 |
| Voluntary training with feedback only to the learner | Out | Draft para 278 |
| Agency, extra and platform staff: AI that selects or ranks who is offered shifts | High-risk, 4(a)/4(b) | Draft paras 238–241. The deployer is whoever runs the system: the agency or platform if it selects; the hotel if it uses the tool itself |
| Attrition prediction as aggregate forecast | Out | No individual decision |
| Attrition or "flight risk" scores per person used for renewal or promotion | High-risk, 4(b) | Draft para 264 |
| Food-waste, POS-loss or CCTV analytics used only to protect stock | Out | "Exclusively" property protection |
| The same alerts used to judge a named cook or cashier | High-risk, 4(b) | Purpose drift |

- **"The vendor says it is not for HR."** Three outcomes. (1) The vendor sells per-employee features but disclaims HR use in its terms: on the draft, the intended purpose includes the high-risk use and the vendor is provider of a high-risk system. (2) The vendor genuinely and consistently excludes staff evaluation and the tool has no such features, but the hotel builds the use itself (exports data, builds per-person rankings): the hotel has changed the intended purpose and becomes provider under Art. 25(1)(c). (3) The tool only produces aggregate output: no 4(b) system exists. [inference]
- **Purpose drift is the main hotel risk.** Most "high-risk if…" rows in BOOKLET A6 are operational tools (waste cameras, room inspection, stock alerts, guest-review analytics) that become 4(b) systems when a manager starts using the output to rate individuals. [inference from team data]
- **Not-an-AI-system exit.** Many rota engines are constraint solvers or rule sets. Art. 3(1) and the Commission's AI-system-definition guidelines exclude purely human-defined rules and basic optimisation. The booklet notes this ("Is it even AI?"). Verdict CONDITIONAL: needs the vendor's technical description, and many products now add learned demand or reliability models. [inference; team data BOOKLET A2]

### Gaps
- No hospitality-specific Commission example exists; the closest is the retail/logistics scheduler (team data e10).
- Unresolved tension inside the draft between "availability-only allocation is out" (paras 271–272) and "significant change to regular working hours is a term" (para 259) for an AI that generates the whole rota. The team data notes both but no source resolves it.
- Who is deployer under hotel management agreements and franchises (owner as legal employer, operator running the system, brand mandating the tool) is not addressed by the Act, the draft or the team data.

---

## 5. Deployer duties (Arts. 26, 27, 86, 50(3)) with dates

### Takeaway
A hotel using an Annex III high-risk tool owes about ten duties from 2 Dec 2027, all addressed to the deployer personally and fineable up to EUR 15 million or 3% of worldwide turnover; no FRIA is owed for employment or biometric tools. The emotion-recognition notice (Art. 50(3)) is already in force and does not wait for 2027.

### Cited Findings
All [text] — [ACT p.67–70 (Arts. 26–27), p.82 (Art. 50(3)), p.110 (Art. 86), p.115 (Art. 99)](http://data.europa.eu/eli/reg/2024/1689/oj); dates from [OMNI p.35 (Art. 113)](http://data.europa.eu/eli/reg/2026/1744/oj)

| Duty | Provision | Applies from | Notes |
|---|---|---|---|
| Technical and organisational measures to use the system per the instructions for use | Art. 26(1) | 2 Dec 2027 (Annex III); 2 Aug 2028 (Annex I Section A) | |
| Assign human oversight to people with "competence, training and authority" and support | Art. 26(2) | same | Recital 91 links this to AI literacy |
| Input data "relevant and sufficiently representative", "to the extent the deployer exercises control" | Art. 26(4) | same | |
| Monitor operation; if a risk appears, inform provider/distributor and authority "without undue delay" and **suspend use**; report serious incidents "immediately" to provider, then importer/distributor and authority | Art. 26(5) | same | "Serious incident" includes infringement of fundamental-rights obligations (Art. 3(49)(c)), e.g. a discriminatory screening outcome |
| Keep automatically generated logs "to the extent such logs are under their control" for at least six months | Art. 26(6) | same | Subject to data-protection law |
| **Before** putting into service or using at the workplace, employers inform workers' representatives **and** the affected workers | Art. 26(7) | same | Recital 92: applies even where national information-and-consultation thresholds are not met |
| Use provider information for the GDPR DPIA | Art. 26(9) | same | |
| Inform natural persons that they are subject to an Annex III system that makes or assists decisions about them | Art. 26(11) | same | This, not 26(7), covers job candidates and guests. Recital 93: include intended purpose, type of decisions, and the right to explanation |
| Cooperate with authorities | Art. 26(12) | same | |
| Give "clear and meaningful explanations of the role of the AI system in the decision-making procedure and the main elements of the decision" on request | Art. 86(1) | In practice 2 Dec 2027 | Only for decisions with legal or similarly significant effect that the person considers adverse; yields to other Union law that already gives the right (Art. 86(3)) |
| Inform people exposed to emotion recognition or biometric categorisation | Art. 50(3) | **2 Aug 2026 (already)** | Independent of high-risk status |
| Support AI literacy of staff | Art. 4 as replaced | 2 Feb 2025 | "does not require… any specific level" — [OMNI p.16](http://data.europa.eu/eli/reg/2026/1744/oj) |
| FRIA | Art. 27 | 2 Dec 2027 | **Only** public bodies, private entities providing public services, and deployers of 5(b)/5(c) systems. May cross-refer to the DPIA; AI Office template — [OMNI p.20](http://data.europa.eu/eli/reg/2026/1744/oj) |
| Registration in EU database | Art. 49(3), 26(8) | — | Public-authority deployers only; private hotels do not register |

- **Fines:** Art. 26 breaches up to EUR 15,000,000 or 3% of worldwide annual turnover, whichever is higher; for SMEs whichever is lower (Art. 99(6)); the Omnibus adds the same "whichever is lower" rule for small mid-caps (Art. 99(6a)). [text] — [ACT p.115–116](http://data.europa.eu/eli/reg/2024/1689/oj); [OMNI p.35](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Optional bias-testing route for deployers:** Art. 4a(2) lets deployers of high-risk systems "exceptionally" process special-category data for bias detection where strictly necessary, under all six Art. 4a(1) safeguards; "This paragraph does not create any obligation". [text] — [OMNI p.17](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Team data agrees** that hotels owe no FRIA for employment systems. [team data] — DATA `gdprLayer` Art. 27 entry

### Inferences
- **None of the Art. 26 duties can be contracted out.** Each is addressed to "deployers" and fined under Art. 99(4)(e). A contract can oblige the vendor to help (log export, instructions, incident channel) but the hotel remains liable. The duties most dependent on the hotel alone: 26(2) oversight, 26(7) worker information, 26(11) notice, Art. 86 explanation. [inference from text]
- **Built-in limits that are real:** log duty only for logs "under their control" (SaaS logs sit with the vendor, so the contract must grant access or retention); input-data duty only where the hotel controls inputs. [inference from text]
- **Art. 26(7) and agency workers.** The duty falls on "deployers who are employers". Where the agency is the legal employer and the hotel runs the tool, the wording is ambiguous; Art. 26(11) applies in any case. [inference]
- **Timing of Art. 86 and Art. 43/49.** Art. 113(c) as amended delays only Chapter III Sections 1–3. Art. 86 (Chapter IX) and Arts. 40–49 (Section 5) formally apply from 2 Aug 2026, but each attaches to a "high-risk AI system", and the classification rules do not apply before 2 Dec 2027. Practical date: 2 Dec 2027. [inference from text]
- **Art. 27 and Art. 86 are not in the Art. 99(4) fine list**; penalties for them depend on national rules under Art. 99(1). [inference from text]
- **Hotel schools** (private entities providing a public service, education) deploying point 3 systems would owe a FRIA. [inference from Art. 27(1), recital 96]

### Gaps
- No guidance found on the content or format of the Art. 26(7) and 26(11) notices, or on how Art. 86 interacts with GDPR Arts. 15 and 22 in employment.
- National penalty rules for Arts. 27 and 86 in the team's focus countries were not checked here.

---

## 6. Becoming the provider (Art. 25) and the general-chatbot problem

### Takeaway
A hotel group becomes provider by building, branding, substantially modifying, or repurposing. The repurposing route (staff ranking CVs with a general chatbot) is the least settled: on the regulation text the hotel that changes the purpose is provider, on the draft guidelines the chatbot vendor remains provider unless it consistently excludes such use, and where the vendor does exclude it the hotel inherits full provider duties with no right to the vendor's documentation.

### Cited Findings
- **Build:** provider = whoever "develops an AI system… or has an AI system… developed and places it on the market or puts the AI system into service under its own name or trademark"; "putting into service" includes supply "for own use". [text] — [ACT p.46–47 (Art. 3(3), 3(11))](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Art. 25(1):** a deployer or other third party "shall be considered to be a provider of a high-risk AI system" and subject to Art. 16 where it (a) puts its name or trademark on a high-risk system, "without prejudice to contractual arrangements stipulating that the obligations are otherwise allocated"; (b) makes a substantial modification so that it remains high-risk; (c) modifies "the intended purpose of an AI system, including a general-purpose AI system, which has not been classified as high-risk… in such a way that the AI system concerned becomes a high-risk AI system". [text] — [ACT p.67](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Substantial modification** = a change "not foreseen or planned in the initial conformity assessment" that affects compliance or modifies the intended purpose (Art. 3(23)); pre-determined continuous learning is not one (recital 128). [text] — [ACT p.47, p.32](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Omnibus changes to Art. 25(2):** the initial provider is no longer provider "of that specific AI system"; its cooperation duty is now itemised: (a) technical documentation sufficient to assess Art. 16 compliance, (b) known limitations and failure modes, (c) targeted technical access including for testing and validation. Unchanged: "This paragraph shall not apply in cases where the initial provider has clearly specified that its AI system is not to be changed into a high-risk AI system". [text] — [OMNI p.19–20](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Omnibus change to Art. 25(4):** the written-agreement duty now also names suppliers of an "AI model". The open-source sentence ("shall not apply to third parties making accessible to the public tools, services, processes, or components, other than general-purpose AI models, under a free and open-source licence") **was already in the June 2024 text**. [text] — compare [ACT p.67](http://data.europa.eu/eli/reg/2024/1689/oj) with [OMNI p.20](http://data.europa.eu/eli/reg/2026/1744/oj)
- **New fine hook:** Art. 99(4)(da) for "obligations of providers and operators pursuant to Article 25(2) and (4)". [text] — [OMNI p.35](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Open-source systems** are outside the Act "unless they are placed on the market or put into service as high-risk AI systems" (Art. 2(12)). [text] — [ACT p.46](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Recital 85:** general-purpose AI systems "may be used as high-risk AI systems by themselves"; their providers should cooperate with high-risk providers. [text] — [ACT p.24](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Draft guidelines:** classification is the provider's responsibility; a general system not consistently limited is deemed intended for high-risk uses too; separate Art. 25 value-chain guidelines are in preparation. [team data, general principles paras 12–14] — DATA `generalPrincipleFindings` p1–p3
- **Commentary is split.** Some read the draft as putting the burden on "the entity determining and directing that use"; industry (BSA) objects that the draft loads residual liability on upstream developers beyond Art. 25. [secondary, search summaries] — [BSA filing](https://www.bsa.org/files/policy-filings/09072026bsaeuaicomp.pdf); [SRD Rechtsanwälte](https://www.srd-rechtsanwaelte.de/en/blog/high-risk-ai-eu-ai-act-guidelines); [DLA Piper](https://www.dlapiper.com/en/insights/publications/2026/06/eu-commission-draft-guidelines-on-classification-of-high-risk-ai-systems-key-points)
- **Provider package for a hotel group** (Annex III point 4 tool): Arts. 9–15 requirements; quality management system (Art. 17, "proportionate to the size of the provider's organisation"); documentation and logs; **internal-control conformity assessment, no notified body** (Art. 43(2)); EU declaration; CE marking; registration (Art. 49(1)); corrective action; accessibility. For biometric (point 1) systems self-assessment is available only where harmonised standards or common specifications are applied in full; otherwise a notified body (Art. 43(1)). Providers outside the EU must appoint an EU authorised representative (Art. 22). [text] — [ACT p.62 (Art. 16), p.65, p.78](http://data.europa.eu/eli/reg/2024/1689/oj); [OMNI p.19 (Art. 17(2))](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Simplifications:** simplified technical-documentation form for SMEs and small mid-caps (Art. 11(1)); simplified QMS elements for SMEs "provided that they do not have partner enterprises or linked enterprises" (Art. 63(1)); provider bias testing on special-category data under six cumulative conditions (Art. 4a(1)); Art. 10(5) deleted. [text] — [OMNI p.17, p.19, p.26](http://data.europa.eu/eli/reg/2026/1744/oj)
- **First harmonised standard:** EN 18286:2026. [team data] — BOOKLET, CIO section; DATA `standards`

### Inferences
- **Who is provider when a manager ranks CVs in a general chatbot?** Three positions:
  1. *Vendor's terms are silent or generic, product marketed for "any task":* on the draft, the vendor's intended purpose includes recruitment, so the vendor is provider of a high-risk system and the hotel is a deployer with Art. 26 duties. Vendors will resist this.
  2. *Vendor clearly and consistently forbids HR decision use:* the hotel's use changes the intended purpose, Art. 25(1)(c) makes the hotel provider, and Art. 25(2) last sentence removes the vendor's duty to cooperate or hand over documentation. The hotel then owes Arts. 9–15, conformity assessment, CE marking and registration for a system it cannot inspect. Compliance is impossible in practice; the only lawful course is to stop the use.
  3. *Textual counter-argument:* Art. 3(12) says intended purpose is set by the provider, and off-label use by a user is "reasonably foreseeable misuse" (Art. 3(13)), not a modification of the system. On that view a one-off ad-hoc prompt does not create a new provider; a standing workflow (custom GPT, saved prompt, integration into the applicant system) does, because the hotel then puts a system into service for own use.
  The team data marks this route "settled" (scenario P3, route D). It should be "draft-guidance / judgement". The booklet's wording ("our reading"; "a line in its terms of service is not enough") is more accurate than the data layer.
- **Shadow use on personal accounts.** A deployer uses a system "under its authority". Work use by staff is professional use, so the Art. 2(10) personal-use exclusion does not apply. If the hotel tolerates or benefits from the practice, attribution to the hotel is likely. A written ban plus training and an approved alternative is the hotel's evidence that the use was not under its authority. Verdict CONDITIONAL. [inference]
- **White-label (Art. 25(1)(a)).** The contract clause allocates obligations between the parties; the provision still says the brand owner "shall be considered to be a provider". Whether an authority must respect the allocation is not stated. The team's "unless the contract allocates them back to the vendor" (P4, "settled") is too firm. Verdict CONDITIONAL. [inference]
- **Group structures.** A head-office entity that builds a tool and rolls it out to hotel-operating companies is provider; each employing entity is a deployer. A Swiss or UK head office supplying EU hotels needs an EU authorised representative. A franchisor mandating a vendor tool under the brand name risks Art. 25(1)(a). [inference]
- **Retraining a vendor's high-risk model on hotel data** is a substantial modification unless the vendor's conformity assessment foresaw it (Art. 3(23)); ask the vendor in writing whether customer fine-tuning is a "pre-determined change". [inference]

### Gaps
- The Commission's Art. 25 value-chain guidelines are not published; position 1 versus position 2 above cannot be resolved until they are.
- No case law or authority decision on Art. 25(1)(c) found.

---

## 7. Art. 111 legacy systems, and the remaining structural points

### Takeaway
The legacy rule is the widest exit in the text: an Annex III system whose type and model was on the market before 2 Dec 2027 stays outside the high-risk regime, for provider and deployer alike, until its design changes significantly. It is unreliable for cloud software that updates continuously, and it does nothing against the prohibitions, Art. 50, GDPR or labour law.

### Cited Findings
- **Art. 111(2) as replaced:** "this Regulation shall apply to operators of high-risk AI systems… that have been placed on the market or put into service before the date of application of Chapter III referred to in Article 113, only if, as from that date, those systems are subject to significant changes in their designs." Public-authority systems must comply by 2 Aug 2030. "Without prejudice to the application of Article 5". [text] — [OMNI p.35](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Omnibus recital 39:** the grace period applies "where the type and model of AI system has already been placed on the market"; "other individual units of the same type and model… may continue to be placed on the market, made available or put into service… as long as the design of that high-risk AI system remains unchanged"; "Any significant change to the design… should trigger the obligation of the provider to fully comply". [text] — [OMNI p.12](http://data.europa.eu/eli/reg/2026/1744/oj)
- **Recital 177 (2024):** "significant change should be understood as equivalent in substance to the notion of substantial modification"; it speaks of changes "in their design or intended purpose". [text] — [ACT p.44](http://data.europa.eu/eli/reg/2024/1689/oj)
- **"Operators" includes deployers** (Art. 3(8) definition; the 2030 sentence names "providers and deployers"). [text] — [ACT p.46, p.121](http://data.europa.eu/eli/reg/2024/1689/oj)
- **Critics:** "a large part of high-risk AI systems that have been placed on the market before December 2027 will never have to comply". [secondary, search summary] — [Tech Policy Press](https://techpolicy.press/eus-ai-act-delays-let-highrisk-systems-dodge-oversight)
- **Team position:** do not count on it; whether a routine vendor update counts is unsettled. [team data] — BOOKLET A4; DATA `boundaries`
- **Research and pilots:** the Act does not apply to "research, testing or development activity… prior to their being placed on the market or put into service"; "Testing in real world conditions shall not be covered by that exclusion." [text] — [ACT p.46 (Art. 2(8))](http://data.europa.eu/eli/reg/2024/1689/oj)

### Inferences
- **Effect for a hotel deployer.** Read literally, an unchanged legacy recruitment or rota tool carries no Art. 26 duties (no worker notice, no log duty) and no Art. 86 right after 2 Dec 2027. Recital 39 extends this to a hotel that first buys the same type and model in 2028. The booklet's phrase "a tool bought earlier" understates this. [inference from text]
- **Why it is still unreliable.** (1) SaaS HR tools ship model and feature updates continuously; one significant change ends the status and the hotel will not know unless the vendor tells it. (2) A change of intended purpose by the hotel also ends it (recital 177). (3) "Type and model" is recital language written for product units, untested for software versions. (4) The Commission can be expected to read an exception narrowly. (5) GDPR Arts. 13–15, 22 and 35, and national works-council rules, already require most of what Art. 26(7), 26(11) and 86 would. Verdict CONDITIONAL, and worthless as a planning basis for tools under active development. [inference]
- **A pilot that scores real candidates or real staff** is no longer pre-market testing; it is putting into service or real-world testing. [inference from Art. 2(8)]

### Gaps
- No guidance on what counts as a "significant change in design" for cloud AI; the draft general-principles text still carries the superseded 2 Aug 2026 cut-off (team data `outdatedPoint`).

---

## 8. Register of exits and grey areas, with verdicts

### Takeaway
Of some thirty possible exits, the ones that rest on the regulation text are scope limits (who owes a FRIA, who registers, self-assessment, 1:1 verification, text-only sentiment, machinery's sectoral regime, dates). The popular ones (a human signs off; the vendor's terms exclude HR; splitting the system; "it is only optimisation") are false.

### Cited Findings
Provisions are cited in sections 1–7; this table consolidates. Verdicts are [inference] unless the cell says otherwise.

| # | Exit | Provision | Conditions | Hotel example | Verdict |
|---|---|---|---|---|---|
| 1 | Nothing high-risk applies yet | Art. 113(c) as amended | Until 2 Dec 2027 / 2 Aug 2028 | Any HR tool today | SAFE [text]; GDPR, labour law, Art. 5 and Art. 50 apply now |
| 2 | Not an AI system | Art. 3(1) | Human-written rules or basic optimisation only | Fixed-formula tip pool; constraint-solver rota | CONDITIONAL; needs vendor's technical description |
| 3 | Purpose not in Annex III | Annex III wording; Art. 3(12) | Provider's instructions, marketing and documentation all consistent | Revenue management, forecasting, energy | SAFE for uses with no person-level evaluation |
| 4 | Objective-criteria allocation | Draft paras 271–272 [team data] | Availability, accreditation, proximity only; no proxies | Availability-only rota | CONDITIONAL (draft; conflicts with para 259 on working time) |
| 5 | Day-to-day threshold | Draft para 262 [team data] | No material change to rights | Sequencing rooms within a shift | CONDITIONAL (draft) |
| 6 | Property protection, safety, legal duty | Draft paras 277–278 [team data] | "Exclusively"; not also used to evaluate staff | Stock-loss alerts | CONDITIONAL; lost on first use to judge a person |
| 7 | Worker-only feedback | Draft para 278 [team data] | Output never reaches the employer | Coaching tips to the attendant | CONDITIONAL; check actual data flows |
| 8 | Art. 6(3) filter | Art. 6(3)–(4), 49(2) | One of (a)–(d); no profiling; provider documents and registers | CV parser, interview scheduler | CONDITIONAL; provider-only; public register |
| 9 | Filter for tools that score people | Art. 6(3) last subpara | — | Rota ranking, call scoring | FALSE [text] |
| 10 | "A manager always signs off" | Draft paras 70, 72, 258 [team data] | — | Any HR tool | FALSE as classification exit; relevant only to Art. 14 |
| 11 | Vendor's terms exclude HR use | Art. 25(1)(c), 25(2) | — | General chatbot, analytics suite | FALSE for the hotel (it becomes provider, without vendor support); FALSE for the vendor if marketing is broad |
| 12 | Splitting into modules or agents | Draft paras 75, 90 [team data] | — | LLM + PMS + HR connectors | FALSE |
| 13 | Aggregate-only analytics | Annex III 4(b) "persons" | No per-person output; no re-identification | Team-level call quality | CONDITIONAL |
| 14 | Outsource the function | Art. 3(4) | Agency or platform truly runs the system and decides | Staffing agency screens candidates | CONDITIONAL; if hotel staff operate the tool, the hotel is deployer; GDPR roles remain |
| 15 | Legacy system | Art. 111(2); Omnibus recital 39 | On market before the date; no significant design or purpose change | 2026 rota tool, unchanged | CONDITIONAL; unreliable for SaaS |
| 16 | Pilot / R&D | Art. 2(8) | Not put into service; no real-world testing | Sandbox test on synthetic CVs | SAFE while true; FALSE once real people are scored |
| 17 | Personal-use exclusion | Art. 2(10), 3(4) | Purely personal, non-professional | Manager's private chatbot account used for work | FALSE |
| 18 | "Not under our authority" (shadow AI) | Art. 3(4) | Documented ban, training, approved alternative | Rogue CV ranking | CONDITIONAL, weak |
| 19 | 1:1 biometric verification | Annex III 1(a); recital 54 | Sole purpose is confirming a claimed identity | Selfie-to-passport check-in | SAFE [text]; GDPR Art. 9 still applies |
| 20 | Opt-in access control, one-to-many | Draft paras 138, 140 [team data] | Person consciously presents themselves | Face entry to spa for enrolled members | CONDITIONAL (draft) |
| 21 | Text-only sentiment | Art. 3(39) | No biometric data (no voice, face) | Review and chat sentiment | SAFE [text] |
| 22 | Medical or safety exception for staff emotion AI | Art. 5(1)(f) | Genuine medical or safety purpose | Fatigue detection for drivers | CONDITIONAL and narrow; if emotions are inferred it is still high-risk under 1(c) |
| 23 | Fraud-detection exception | Annex III 5(b) | Fraud detection is the main intended use | Card-fraud screening on bookings | CONDITIONAL |
| 24 | Hotel stay is not an essential service | Recital 58; draft paras 301–304 [team data] | Scoring only for stay deposits | Pre-authorisation scoring | CONDITIONAL (draft; sub-point wording has no such limit) |
| 25 | Corporate accounts | Annex III 5(b) "natural persons" | Legal entity assessed on business data | Travel-agency or corporate credit line | SAFE on text for companies; sole traders are in |
| 26 | Non-safety optimisation in products | Art. 6(1a) | "Solely" non-safety; failure would not endanger health or safety (6(1b)) | Heating schedules | CONDITIONAL; FALSE for ventilation, water-temperature, gas-combustion or door-timing control |
| 27 | No third-party assessment required | Art. 6(1)(b), 6(1c) | Sectoral law allows self-assessment; or only spectrum/EMC risks | Wi-Fi devices; low-category pressure equipment | SAFE where the sectoral fact holds (unverified here) |
| 28 | Machinery and other Section B products | Art. 2(2) | Product within Section B law | Kitchen and cleaning robots, automatic doors | SAFE [text] as to AI Act Arts. 8–27; sectoral AI rules by 2 Aug 2028 |
| 29 | Manufacturer is the provider | Art. 25(3) | Hotel does not build or modify | Lift AI | SAFE [text]; hotel still deployer for Section A |
| 30 | No FRIA | Art. 27(1) | Private hotel; system not 5(b)/5(c); not a public service | All HR and biometric tools | SAFE [text] |
| 31 | No deployer registration | Art. 49(3) | Not a public authority | All | SAFE [text] |
| 32 | Self-assessment instead of notified body | Art. 43(2) | Annex III points 2–8 | In-house CV ranker | SAFE [text]; not an exemption from Arts. 9–15 |
| 33 | SME / small mid-cap relief | Arts. 11(1), 17(2), 63(1), 99(6), 99(6a) | Size thresholds; Art. 63 needs no partner or linked enterprises | Independent hotel building a tool | SAFE but small: form and proportionality, lower fine caps; **no reduction of deployer duties**; group-owned hotels fail the Art. 63 condition |
| 34 | Open-source components | Art. 2(12), 25(4) | — | Open-source ranking library in an in-house tool | FALSE as exit: only removes the written-agreement duty towards the open-source supplier |
| 35 | Contract shifts provider role back (white-label) | Art. 25(1)(a) | Explicit allocation clause | "[Brand] Talent AI" | CONDITIONAL |
| 36 | Art. 86 limits | Art. 86(1)–(3) | No significant adverse effect; or right exists elsewhere | Minor task sequencing | CONDITIONAL; GDPR usually fills the gap |
| 37 | Log and input-data limits | Art. 26(4), 26(6) | Logs or inputs not under hotel's control | SaaS tool | SAFE [text] as to scope; contract should cover access |
| 38 | Thin EU-level fines for Arts. 6(4), 49(2), 27, 86 | Art. 99(4) list | — | — | Grey area, not an exit: national penalties under Art. 99(1); Art. 80(7) for circumvention |
| 39 | Art. 2(13) limitation | Art. 2(13) | Delegated acts by 2 Aug 2027 | Lift, gas, pressure AI | Unknown; covers Arts. 9–15 and 17–25 only, so not deployer duties |

### Inferences
**Places where the team's material looks wrong, incomplete or over-confident** (all [inference] from comparing team data with the texts):

1. **Art. 25(4) open-source carve-out is not new.** DATA (`switchConsequences.omnibusCorrection`, `omnibusAmended` point 12, scenarios P1/P5) and OMNIBUS-REVISION-LIST.md present it as an Omnibus addition. The sentence is in the June 2024 text (ACT p.67). The Omnibus only added "AI model" to the list of supplied items.
2. **Route D / scenario P3 marked "settled".** It is the least settled route (section 6). The booklet's phrasing is better than the data layer's.
3. **Scenario P4** ("unless the contract allocates them back") marked "settled": the text is ambiguous on whether the allocation binds authorities.
4. **Annex III 1(b)** "prohibited outright… settled": over-broad; Art. 5(1)(g) covers a closed list of attributes, and 1(b) keeps a residual scope.
5. **Annex III 5(d)** "Not a hotel exposure… settled": the first limb is not limited to public authorities; AI emergency-call handling in a hotel is a grey area, and the draft section was not read.
6. **Points 2, 3, 5(a), 5(c), 5(d), 6–8** are declared non-exposures without the draft sections having been read (`coverageCaveat`). Point 3 matters for hotel schools and apprenticeship-training hotels.
7. **Annex I "net hotel position"** (lifts, gas, pressure) omits medical devices (spa, AEDs), cableways, recreational craft, and Section B items (drones, vehicles). It also does not state the most practical consequence of the machinery move: no Art. 26 deployer duties for hotels using AI-enabled machinery. It does not flag that condition 6(1)(b) screens out low-category pressure equipment.
8. **Legacy rule.** Neither DATA `boundaries` nor the booklet says plainly that Art. 111(2) switches off deployer duties as well as provider duties, or that recital 39 extends it to later purchases of the same type and model. This is both a bigger exit and a bigger over-claim risk than presented.
9. **Art. 50(3) timing.** The team attaches the caller-notice duty to the guest-emotion high-risk finding (from 2 Dec 2027). The notice duty has applied since 2 Aug 2026 regardless of high-risk status.
10. **Deployer duty list** (`obligationsByRoleAndTier`) omits Art. 26(12) cooperation and the "suspend use" element of 26(5), and does not separate Art. 26(7) (workers) from 26(11) (candidates, guests). Scenario D4 says "Inform workers' representatives and candidates": candidates are covered by 26(11), not 26(7).
11. **Filter penalty gap and provider-only nature** of Art. 6(4) are not stated; a reader could think a hotel can self-declare a tool filtered.
12. **5(b)** hotel analysis covers deposits and corporate accounts but not BNPL, house accounts for individuals, or membership and residence financing.
13. **Conformity assessment:** "internal control for points 2–8" is right, but nowhere is it said that a group building a biometric tool (point 1) needs a notified body unless it applies harmonised standards in full (Art. 43(1)).
14. **Art. 63(1) relief** is described generally; the "no partner or linked enterprises" condition excludes most group-owned or branded hotel companies.

### Gaps
- I could not open the Commission draft guidelines; all paragraph-level claims about them should be re-checked against the three PDFs the team holds (the data file says local copies sit in an "EU AI Governance folder" that is not in this repository).
- Hosts that would need to be allowed in the session's network settings to verify commentary: www.faegredrinker.com, www.dirittobancario.it (hosts copies of the three draft guideline PDFs), www.dataprotectionreport.com.
- No national-authority enforcement position on any of these exits was found; the high-risk regime is not yet applicable, so there is no decision practice.
- Final high-risk guidelines and the Art. 25 value-chain guidelines are both pending; rows 4–7, 10–12, 20 and 24 of the exit table depend on them.
