# Prohibited AI practices (EU AI Act Art. 5) for hotels and in-hotel F&B: bans, boundaries and grey areas

State of the law: 17 November 2026. Consolidated reading of Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744.

**How to read these notes**

- Labels on every statement: **[text]** = read by me in the two regulation PDFs in this session; **[team data]** = from `ai-act-data.json` or the D7 booklet; **[secondary]** = commentary or Commission guidelines seen ONLY as a web-search summary (page fetches were blocked, see "Access limits"); **[my inference]** = my own reasoning, not stated in a source.
- Verdicts: **SAFE** (outside Art. 5 on the text), **CONDITIONAL** (outside only if a stated condition holds), **FALSE LOOPHOLE** (an argument a regulator would reject), **BANNED**.
- "Safe" always means "not prohibited by Art. 5". It never means lawful overall: GDPR, consumer law, labour law and the high-risk rules still apply (Art. 5(8), recital 45) [text].
- Source shorthand: **AIA** = [Regulation (EU) 2024/1689, OJ L 12.7.2024](http://data.europa.eu/eli/reg/2024/1689/oj), local file `/home/user/final/tools/ai-act-explorer/EU AI Act June 2024.pdf`. **OMN** = [Regulation (EU) 2026/1744, OJ L 24.7.2026](http://data.europa.eu/eli/reg/2026/1744/oj), local file `/home/user/final/tools/ai-act-explorer/Digital Omnibus July 2026.pdf`. **GL** = Commission guidelines on prohibited AI practices, [copy on the AI Act Service Desk](https://ai-act-service-desk.ec.europa.eu/sites/default/files/2025-08/guidelines_on_prohibited_artificial_intelligence_practices_established_by_regulation_eu_20241689_ai_act_english_ied3r5nwo50xggpcfmwckm3nuc_112367-1.PDF) (not readable in this session). **JSON** = `/home/user/final/tools/ai-act-explorer/ai-act-data.json`. **Booklet** = `/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf`.

**Access limits (important for the report writer)**

- The session network blocked every page fetch (EUR-Lex, Commission sites, law firms, FPF). The Context.dev scraping connector returned "0 credits remaining, refill 11 Dec 2026". So the Commission guidelines were NOT read in full. Everything attributed to GL comes from search-engine summaries of law-firm articles and of the Commission PDF. Paragraph numbers quoted for GL come from those summaries and may refer to the 4 Feb 2025 version; check them against the final text before printing.
- Guideline reference: approved 4 Feb 2025 as C(2025) 884 final; the booklet's reference list cites the formally adopted version as C(2025) 5052 final, 29 July 2025 [team data: Booklet, reference 3]. Third-party indexes also list "C(2025) 5052 — final" [secondary: [headlesslaw index](https://www.headlesslaw.com/ai-act/level-3/guidelines/commission-c-2025-5052-prohibited-practices)]. The guidelines are non-binding; only the CJEU gives an authoritative reading [secondary: [Privacy World, May 2025](https://www.privacyworld.blog/2025/05/the-european-commissions-guidance-on-prohibited-ai-practices-unraveling-the-ai-act/)].

---

## 1. Emotion recognition in the workplace (Art. 5(1)(f))

### Takeaway
Any AI that infers a worker's or job candidate's emotions from face, voice or other biometric signals is banned in hotels since 2 Feb 2025, and none of the usual escape routes (consent, "wellbeing", aggregate dashboards, vendor wording) hold. The reliable exits are narrow: text-only analysis, pure physical states such as fatigue, guest-only analysis with staff technically carved out, and genuine medical or safety systems.

### Cited Findings

**The rule**
- Art. 5(1)(f) bans "the placing on the market, the putting into service for this specific purpose, or the use of AI systems to infer emotions of a natural person in the areas of workplace and education institutions, except where the use of the AI system is intended to be put in place or into the market for medical or safety reasons" [text] — [AIA Art. 5(1)(f), PDF p. 51](http://data.europa.eu/eli/reg/2024/1689/oj)
- "Emotion recognition system" = "an AI system for the purpose of identifying or inferring emotions or intentions of natural persons on the basis of their biometric data" [text] — [AIA Art. 3(39), PDF p. 48](http://data.europa.eu/eli/reg/2024/1689/oj)
- "Biometric data" = "personal data resulting from specific technical processing relating to the physical, physiological or behavioural characteristics of a natural person, such as facial images or dactyloscopic data" [text] — [AIA Art. 3(34), PDF p. 48](http://data.europa.eu/eli/reg/2024/1689/oj)
- Recital 18 lists emotions: "happiness, sadness, anger, surprise, disgust, embarrassment, excitement, shame, contempt, satisfaction and amusement". It excludes "physical states, such as pain or fatigue, including, for example, systems used in detecting the state of fatigue of professional pilots or drivers for the purpose of preventing accidents". It also excludes "the mere detection of readily apparent expressions, gestures or movements, unless they are used for identifying or inferring emotions", such as "a frown or a smile" or "a raised voice or whispering" [text] — [AIA recital 18, PDF p. 5](http://data.europa.eu/eli/reg/2024/1689/oj)
- Reason for the ban: "serious concerns about the scientific basis", "limited reliability, the lack of specificity and the limited generalisability", and "the imbalance of power in the context of work or education". The exception is for systems "placed on the market strictly for medical or safety reasons, such as systems intended for therapeutical use" [text] — [AIA recital 44, PDF p. 12](http://data.europa.eu/eli/reg/2024/1689/oj)
- Outside the workplace, emotion recognition is high-risk (Annex III point 1(c)) and deployers must inform the people exposed (Art. 50(3)) [text] — [AIA Annex III(1)(c); Art. 50(3)](http://data.europa.eu/eli/reg/2024/1689/oj). High-risk duties for Annex III start 2 Dec 2027 [text] — [OMN, new Art. 113(c)(i), PDF p. 38](http://data.europa.eu/eli/reg/2026/1744/oj)

**What the Commission guidelines say (all [secondary], search summaries only)**
- Text-based inference (sentiment analysis of written text) is outside the ban because it is not based on biometric data; inferring emotions from keystrokes IS caught — [Lewis Silkin, 17 Feb 2025](https://www.lewissilkin.com/insights/2025/02/17/understanding-the-eu-ai-acts-prohibited-practices-key-workplace-and-advertising-102k011); [CMS, Part II](https://cms.law/en/gbr/legal-updates/eu-commission-issues-guidelines-on-prohibited-ai-practices-part-ii)
- "Workplace" is read broadly: any physical or virtual space where work is performed; the ban extends to candidates during recruitment and to probation periods — [Lewis Silkin](https://www.lewissilkin.com/insights/2025/02/17/understanding-the-eu-ai-acts-prohibited-practices-key-workplace-and-advertising-102k011); [FPF, Red Lines: emotion recognition](https://fpf.org/blog/red-lines-under-eu-ai-act-unpacking-the-prohibition-of-emotion-recognition-in-the-workplace-and-education-institutions/)
- Call centre using webcams and voice recognition to track employees' emotions such as anger: prohibited. A call centre tracking its CUSTOMERS' emotions (anger, impatience) is not prohibited by Art. 5(1)(f), provided employees' emotions are not tracked at the same time (GL para. 254 per the summaries) — [Inside Privacy / Covington, 4 Jun 2025](https://www.insideprivacy.com/artificial-intelligence/european-commission-guidelines-on-prohibited-ai-practices-under-the-eu-artificial-intelligence-act/); [Bird & Bird](https://www.twobirds.com/en/insights/2025/global/new-eu-ai-act-guidelines-what-are-the-implications-for-businesses)
- Personal training use: emotion recognition is allowed "if the results are not shared with HR responsible persons and cannot impact the assessment, promotion etc." — [CDT Europe, AI Act Brief pt. 4](https://cdt.org/insights/eu-ai-act-brief-pt-4-ai-at-work/) (single summary; wording to verify)
- The medical or safety exception is to be read narrowly and does not cover general wellbeing monitoring; a system meant to detect burnout or depression at work is not covered by the exception (GL point 257 according to one summary, single source) — [CMS, Part II](https://cms.law/en/gbr/legal-updates/eu-commission-issues-guidelines-on-prohibited-ai-practices-part-ii); [Praxikon](https://www.praxikon.com/en/posts/emotion-recognition-workplace-ban-ai-act)
- Because recital 18 excludes pain and fatigue, driver or pilot fatigue detection is not emotion recognition at all (GL para. 249 per summary) — [Bird & Bird](https://www.twobirds.com/en/insights/2025/global/new-eu-ai-act-guidelines-what-are-the-implications-for-businesses)

**Team positions**
- JSON scenario D7: call-centre tool scoring agents' emotions from voice = prohibited; "Text-only sentiment analysis of guest messages is NOT emotion recognition because it does not use biometric data (Art. 3(39))", marked "settled" [team data] — JSON `scenarios[D7]`
- Booklet: banned are tools reading "staff or job candidates' emotions from face or voice, including 'agent sentiment' scores on calls that reach supervisors, and wellbeing checks"; an AI coach may read emotions "only if the results stay with that person and never reach HR or managers"; guest emotion reading by voice assistants or cameras is "high-risk", not banned [team data] — Booklet sections A2, C1, C3, C5 and the "Watch for" box
- Draft high-risk classification guidelines (19 May 2026): call-centre AI reading callers' emotions from voice to route angry callers is the Commission's own high-risk example (p. 37) [team data] — JSON `hospitalityProvisions` (Annex III point 1)

**Related enforcement under data protection law**
- A data protection authority fined a bank over EUR 650,000 for AI analysis of call recordings that promised emotion detection [secondary] — [FPF, Automated Decision-Making under the GDPR, 2022](https://fpf.org/wp-content/uploads/2022/05/FPF-ADM-Report-R2-singles.pdf). The summary did not name the authority; I believe this is the Hungarian NAIH decision against Budapest Bank (2022) but could not confirm it in this session.
- EDPB facial-recognition guidelines call the use of such technology to infer emotions "highly undesirable" and say it "should be prohibited, possibly with few duly justified exceptions" [secondary] — [EDPB Guidelines 05/2022](https://www.edpb.europa.eu/system/files/2022-05/edpb-guidelines_202205_frtlawenforcement_en_1.pdf)

**Boundary table for Art. 5(1)(f)**

| # | Boundary | Provision | Condition that takes a use in or out | Hotel example | Verdict |
|---|---|---|---|---|---|
| F1 | Biometric vs text | Art. 3(39); recital 44; GL | Out if the only input is written text. In if face, voice (tone, pitch, prosody), gait, heart rate or keystroke dynamics are used | Sentiment scoring of guest reviews, emails, chat logs, staff survey free text | SAFE [text + secondary]. Note: the word "biometric" is in the definition and recital, not in Art. 5(1)(f) itself, so this rests on the guidelines' reading [my inference] |
| F2 | Speech turned into text | Art. 3(34), 3(39) | Out only if the tool analyses the transcript words alone and discards tone features | Call-scoring tool that transcribes agent calls and rates wording | CONDITIONAL [my inference]. Most "agent sentiment" products use acoustic features; ask the vendor in writing |
| F3 | Emotion vs physical state | Recital 18 | Out if it detects fatigue or pain. In if it labels stress, frustration, boredom, motivation, "engagement" | Drowsiness camera for the hotel shuttle driver; fatigue alert for a night-shift cook at a fryer | SAFE for fatigue and pain [text]. Stress and "attention" are grey [my inference] |
| F4 | Mere expression detection | Recital 18 | Out if the tool only registers a smile, raised voice or gesture and draws no emotional conclusion. In as soon as the output is used to infer mood or attitude | "Smile rate" counter on front-desk cameras used as a friendliness KPI | FALSE LOOPHOLE in practice [my inference]: a smile KPI is used as a proxy for emotional state; it is also Annex III 4(b) monitoring and a GDPR problem |
| F5 | "Emotions" vs "intentions" | Art. 5(1)(f) says "emotions"; Art. 3(39) says "emotions or intentions" | Text of the ban omits "intentions" | Camera AI claiming to detect staff "intent to steal" or "intent to quit" | Grey; treat as FALSE LOOPHOLE [my inference]. Still high-risk under Annex III 1(c) and 4(b) |
| F6 | Who is protected: candidates | Art. 5(1)(f) "areas of workplace"; GL | Recruitment and probation are inside | Video-interview tool scoring enthusiasm or nervousness of seasonal applicants | BANNED [secondary; team data agrees] |
| F7 | Who is protected: agency staff, freelancers, trainees | Art. 5(1)(f); GL broad reading of "workplace" | The text protects "a natural person in the areas of workplace", not "employees" | Outsourced housekeeping crew, agency banqueting waiters, stagiaires | Treat as BANNED [my inference from text]. The draft high-risk guidelines already read Annex III point 4 to cover freelancers, agency staff and contractors [team data: JSON `interimPostures`] |
| F8 | Guests | Art. 5(1)(f); Annex III 1(c); Art. 50(3) | Guests are not "in the workplace" as workers. Out of the ban, but notice duty now and high-risk from 2 Dec 2027 | Reception or restaurant camera rating guest satisfaction; voice bot detecting an angry caller | CONDITIONAL: not banned [secondary GL para. 254; team data], subject to F9 |
| F9 | Mixed scenes: guest tool that also captures staff | GL para. 254 (customers allowed "provided that they do not track the employees' emotions at the same time") | Out only if staff are technically excluded (separate audio channel, masked zones) | Two-way call analytics; a restaurant camera with waiters in frame | CONDITIONAL [secondary]. "We only look at the guest scores" is not a technical carve-out [my inference] |
| F10 | Medical or safety exception | Art. 5(1)(f); recital 44 ("strictly") | In the exception only for a genuine medical or safety purpose. Wellbeing, engagement, burnout and productivity do not qualify | Lone-worker device detecting distress in a housekeeper's voice during an assault | CONDITIONAL [text + secondary]. "Wellbeing app" = FALSE LOOPHOLE [secondary; team data] |
| F11 | Personal coaching | GL (per CDT summary) | Out if results stay with the worker and cannot affect assessment or promotion | Sales-call coach giving a reservation agent private feedback on tone | CONDITIONAL [secondary; team data]. Fails once a supervisor dashboard exists |
| F12 | Consent of staff | Art. 5 has no consent exception | None | Works council or individual staff "opt in" to mood tracking | FALSE LOOPHOLE [text: no such exception exists] |
| F13 | Aggregated or anonymised output | Art. 5(1)(f) "infer emotions of a natural person" | The inference is made per person before aggregation | Team-level "mood heatmap" of the kitchen brigade | FALSE LOOPHOLE [my inference] |
| F14 | Vendor naming | Art. 5(1)(f) is functional | Label is irrelevant | Feature sold as "tone analytics", "empathy score", "engagement index" | FALSE LOOPHOLE [my inference; team data flags "vendors marketing agent sentiment coaching"] |
| F15 | "For this specific purpose" (provider side) | Art. 5(1)(f) | Placing on the market is banned only "for this specific purpose"; USE is banned without that qualifier | A general voice-analytics platform with an emotion module the hotel switches on for staff | The hotel is exposed as deployer even if the vendor is not [my inference from text] |

### Inferences
- The most likely real hotel breach is not a deliberate "mood camera" but a contact-centre or conversation-intelligence product with an agent-emotion feature enabled by default [my inference; consistent with team data D7].
- Kitchen and driver fatigue detection is the cleanest lawful case because it is outside the definition altogether, so the hotel does not even need the safety exception. It can still be high-risk worker monitoring under Annex III 4(b) [my inference].
- Hospitality schools and hotel-run academies are "education institutions": emotion-reading of students in training or assessments is banned on the education limb as well [my inference from text].
- The team's "text-only is settled" position is sound but slightly overstated: the biometric limit comes from Art. 3(39), recital 44 and the guidelines, while Art. 5(1)(f) does not use the defined term [my inference].

### Gaps
- Could not read GL section 7 directly; paragraph numbers 249, 254, 257 come from summaries.
- No source found on whether "stress" detection from wearables counts as an emotion or a physical state. GL's treatment of burnout suggests it is treated as inside the ban, but this is a single-source reading.
- No source found on whether the guidelines expressly cover self-employed or agency workers under Art. 5(1)(f).
- No source found on whether inferring "intentions" of workers is within Art. 5(1)(f) despite the narrower wording.
- No AI Act enforcement decision on emotion recognition found as of Nov 2026.

---

## 2. Manipulation and exploitation of vulnerabilities (Art. 5(1)(a) and (b))

### Takeaway
Ordinary revenue management, personalisation and upselling are outside the ban; it bites only when a technique subverts choice (or exploits age, disability or a specific social or economic situation) AND is reasonably likely to cause significant harm. For most hotel pricing the harm threshold is the real protection, and consumer law, not the AI Act, is the sharper constraint; casino hotels and targeting of elderly or financially distressed guests are the exposed cases.

### Cited Findings

**The rule**
- Art. 5(1)(a): AI that "deploys subliminal techniques beyond a person's consciousness or purposefully manipulative or deceptive techniques, with the objective, or the effect of materially distorting the behaviour ... by appreciably impairing their ability to make an informed decision, thereby causing them to take a decision that they would not have otherwise taken in a manner that causes or is reasonably likely to cause ... significant harm" [text] — [AIA Art. 5(1)(a), PDF p. 51](http://data.europa.eu/eli/reg/2024/1689/oj)
- Art. 5(1)(b): AI that "exploits any of the vulnerabilities of a natural person or a specific group of persons due to their age, disability or a specific social or economic situation, with the objective, or the effect, of materially distorting the behaviour ... in a manner that causes or is reasonably likely to cause that person or another person significant harm" [text] — [AIA Art. 5(1)(b), PDF p. 51](http://data.europa.eu/eli/reg/2024/1689/oj)
- Significant harm: "in particular having sufficiently important adverse impacts on physical, psychological health or financial interests", "including harms that may be accumulated over time" [text] — [AIA recital 29, PDF pp. 8-9](http://data.europa.eu/eli/reg/2024/1689/oj)
- Intent: "it is not necessary for the provider or the deployer to have the intention to cause significant harm". But no intention to distort can be assumed where distortion "results from factors external to the AI system which are outside the control of the provider or the deployer" and are not reasonably foreseeable [text] — [AIA recital 29, PDF p. 9](http://data.europa.eu/eli/reg/2024/1689/oj)
- Vulnerable situations named: "persons living in extreme poverty, ethnic or religious minorities"; disability "within the meaning of Directive (EU) 2019/882" [text] — [AIA recital 29, PDF p. 8](http://data.europa.eu/eli/reg/2024/1689/oj)
- Safe-harbour wording: "common and legitimate commercial practices, for example in the field of advertising, that comply with the applicable law should not, in themselves, be regarded as constituting harmful manipulative AI-enabled practices" [text] — [AIA recital 29, PDF p. 9](http://data.europa.eu/eli/reg/2024/1689/oj)
- Link to consumer law: the bans are "complementary" to the Unfair Commercial Practices Directive 2005/29/EC; unfair practices causing economic harm to consumers "are prohibited under all circumstances, irrespective of whether they are put in place through AI systems or otherwise" [text] — [AIA recital 29, PDF p. 9](http://data.europa.eu/eli/reg/2024/1689/oj)

**Commission guidelines (all [secondary], search summaries)**
- Three alternative technique types under (a): subliminal, purposefully manipulative, deceptive (GL para. 63) — [The AI Act Guy, Part I](https://theaiactguy.substack.com/p/the-prohibited-practices-under-the)
- AI personalising ads on user preferences is "not inherently manipulative" if it complies with Art. 5, GDPR, consumer law and the Digital Services Act — [FPF, Red Lines: manipulation](https://fpf.org/blog/red-lines-under-the-eu-ai-act-understanding-manipulative-techniques-and-the-exploitation-of-vulnerabilities/)
- Dark patterns are manipulative or deceptive techniques "when they are likely to cause significant harm"; one summary cites AI-enabled dark patterns that push users into substantial financial commitments — [Privacy World](https://www.privacyworld.blog/2025/05/the-european-commissions-guidance-on-prohibited-ai-practices-unraveling-the-ai-act/)
- Significant harm covers physical, psychological, financial and economic harm; assessed case by case, "nuanced and context dependent" (severity, context) — [Orrick, Apr 2025](https://www.orrick.com/en/Insights/2025/04/EU-Commission-Publishes-Guidelines-on-the-Prohibited-AI-Practices-under-the-AI-Act)
- Examples under (b): AI targeting older people with deceptive personalised offers or scams; AI targeting older persons with insurance offers "by exploiting their reduced cognitive capacity"; a predictive algorithm targeting people in low-income postcodes with ads for predatory financial products; games using "personalised and unpredictable rewards through addictive reinforcement schedules and dopamine-like loops" — [Arthur Cox, Part One](https://www.arthurcox.com/knowledge/the-eu-commission-guidelines-on-prohibited-ai-practices/); [Bundesnetzagentur, Prohibited practices](https://www.bundesnetzagentur.de/EN/Areas/Digitalisation/AI/08_ProhibitedPractices/start.html)
- Gambling example under (a) (secondary source's illustration): an app that subliminally embeds frames promoting gambling platforms — [The AI Act Guy, Part I](https://theaiactguy.substack.com/p/the-prohibited-practices-under-the)
- Examples NOT likely to cause significant harm: companionship AI designed for engagement without manipulative or deceptive practices; music recommendation; subliminal cues to stop smoking — [Inside Privacy / Covington](https://www.insideprivacy.com/artificial-intelligence/european-commission-guidelines-on-prohibited-ai-practices-under-the-eu-artificial-intelligence-act/)

**Team positions**
- "Pricing or upselling designed to exploit a guest who cannot compare, or a vulnerable group. Normal demand-based pricing is not covered", marked "settled" [team data] — JSON `hospitalityProvisions`
- Scenario D3 (revenue management with dynamic pricing): "Minimal, unless manipulative or exploitative"; "AI Act Tier 1 only in the extreme exploitation case"; marked "judgement" [team data] — JSON `scenarios[D3]`
- Booklet C3: "consumer law bites harder than the AI Act on prices" [team data]

**Boundary table for Art. 5(1)(a) and (b)**

| # | Boundary | Provision | Condition | Hotel example | Verdict |
|---|---|---|---|---|---|
| M1 | Demand-based dynamic pricing | Art. 5(1)(a); recital 29 last sentence | No technique that impairs informed choice; price reacts to market, not to the person | RMS raising rates for a trade-fair week | SAFE [text + team data] |
| M2 | Personalised pricing by profile | Art. 5(1)(a),(b) | Not a ban trigger in itself. In only if it exploits age, disability or social/economic situation, or uses deception, AND significant harm is likely | Higher rate shown to a returning guest judged price-insensitive | CONDITIONAL [my inference]. The significant-harm bar is rarely met by one room-night; consumer-law disclosure and GDPR profiling rules are the live risk [team data] |
| M3 | Pricing or offers keyed to a vulnerability | Art. 5(1)(b) | In if the system identifies and exploits old age, disability, poverty or distress with likely significant harm | Engine detects an elderly or emergency traveller (stranded, hospital visit) and removes cheaper options | BANNED if harm is significant; otherwise still unfair-practice risk [my inference; GL examples on older people support] |
| M4 | "Significant harm" threshold | Recital 29 | Out if harm is minor. But harm "accumulated over time" and harm to groups count | Repeated small overcharges across a loyalty base | CONDITIONAL [text]. "It is only a few euros each" is weak where the practice is systematic [my inference] |
| M5 | Scarcity and urgency prompts | Art. 5(1)(a); UCPD | True scarcity message: out. False AI-generated scarcity: deceptive technique, but AI Act needs significant harm | "Only 1 room left", generated per visitor regardless of inventory | Outside Art. 5 in most cases, but unlawful under consumer law regardless [text recital 29 + my inference]. Not a safe practice |
| M6 | Upselling bots and voice agents | Art. 5(1)(a); Art. 50(1) | Persuasion is out. In if the bot lies, impersonates a human, or adapts pressure to detected weakness, with significant harm | Booking assistant pushing a suite upgrade; bot inventing a "manager's special" deadline | SAFE for honest upsell; CONDITIONAL for adaptive pressure [my inference] |
| M7 | "Legitimate commercial practice" shelter | Recital 29 | Only for practices "that comply with the applicable law" | Marketing argues "everyone in the industry does drip pricing" | FALSE LOOPHOLE once the practice breaches consumer law [text] |
| M8 | "No intent to harm" | Art. 5(1)(a),(b) "objective, or the effect"; recital 29 | Effect is enough | Vendor optimises conversion; nobody "meant" to exploit anyone | FALSE LOOPHOLE [text] |
| M9 | Self-learning optimiser finds the exploit itself | Recital 29 (foreseeability) | Out only if distortion comes from external factors not reasonably foreseeable | Reinforcement-learning offer engine learns that late-night, repeat-visit users accept bad deals | Grey. Conditional on monitoring; once the pattern is known, the defence is gone [my inference] |
| M10 | Casino and gaming hotels | Art. 5(1)(a),(b) | In if AI identifies compulsive or financially distressed players and times offers, credit or comps to keep them playing | Player-tracking AI sending free-room offers after heavy losses | Highest hotel exposure. Likely BANNED where loss-chasing is targeted [my inference; GL addictive-loop and predatory-finance examples point the same way] |
| M11 | Loyalty gamification | Art. 5(1)(a),(b) | Ordinary points and tiers: out. In only with addictive reinforcement design plus significant harm | Streaks, surprise rewards, "status at risk" nudges | SAFE in ordinary form [my inference] |
| M12 | Children | Art. 5(1)(b) (age) | In if a system exploits a child's credulity with likely significant harm | Kids-club app or in-room assistant nudging children to order paid content | CONDITIONAL [my inference] |
| M13 | Temporary states not listed in (b) | Art. 5(1)(b) lists age, disability, social or economic situation only | Intoxication, jet lag, grief are not listed grounds; only (a) can apply | Bar ordering kiosk upselling to visibly intoxicated guests | Grey [my inference]; outside (b) on the text, possible under (a) |
| M14 | Staff as targets | Art. 5(1)(a),(b) apply to any "person" | Not limited to consumers | Scheduling app nudging low-paid or migrant staff into unsafe extra shifts | Grey, rarely discussed [my inference] |

### Inferences
- The JSON wizard choice "Manipulates or exploits a vulnerability ... causing significant harm" merges (a) and (b). Point (a) needs no vulnerability at all; the wizard wording could lead a user to answer "no" to a deceptive bot aimed at ordinary guests [my inference on team data].
- For standard hotels the AI Act manipulation ban is a backstop. The practical test is: would the practice already be an unfair commercial practice? If yes, the recital 29 shelter is lost and only the harm threshold stands between the hotel and Art. 5 [my inference from text].
- "Guest who cannot compare" (team wording) is not a statutory vulnerability; it becomes relevant only through (a) (impaired informed decision) or where the inability stems from age, disability or economic situation [my inference].

### Gaps
- No summary confirmed that the guidelines discuss dynamic or personalised pricing, scarcity cues, hotel or travel examples, or the phrase "lawful persuasion"; I could not read GL section 3 and 4 directly.
- Whether gambling addiction counts as "disability" under Art. 5(1)(b) was not found.
- No quantitative threshold for "significant" financial harm exists in the text; none found in summaries.
- Consumer-law detail (personalised-price disclosure under the Consumer Rights Directive, blacklisted false-scarcity claims under the UCPD) was not verified in this session; another researcher should source it.

---

## 3. Social scoring (Art. 5(1)(c))

### Takeaway
The ban covers private companies and is not limited to state "citizen scores": a hotel is exposed when an AI-built guest or staff score, made over time, is used against people in an unrelated context or out of proportion to what they did. A property-level record of documented incidents, loyalty tiers and relevant fraud checks are outside; cross-brand "problem guest" scores and scores fed by off-property data are the grey zone.

### Cited Findings

**The rule**
- Art. 5(1)(c): AI systems "for the evaluation or classification of natural persons or groups of persons over a certain period of time based on their social behaviour or known, inferred or predicted personal or personality characteristics, with the social score leading to either or both of": "(i) detrimental or unfavourable treatment ... in social contexts that are unrelated to the contexts in which the data was originally generated or collected; (ii) detrimental or unfavourable treatment ... that is unjustified or disproportionate to their social behaviour or its gravity" [text] — [AIA Art. 5(1)(c), PDF p. 51](http://data.europa.eu/eli/reg/2024/1689/oj)
- Applies to "public or private actors". Typical systems use "multiple data points related to their social behaviour in multiple contexts". The ban "should not affect lawful evaluation practices of natural persons that are carried out for a specific purpose in accordance with Union and national law" [text] — [AIA recital 31, PDF p. 9](http://data.europa.eu/eli/reg/2024/1689/oj)

**Commission guidelines (all [secondary], search summaries)**
- Not a general ban on scoring. Social behaviour includes behaviour in business contexts, such as paying debts or behaviour when using services — [CMS, Part I](https://cms.law/en/gbr/legal-updates/eu-commission-issues-guidelines-on-prohibited-ai-practices-part-i); [DLA Piper, 5 Feb 2025](https://www.dlapiper.com/en-ca/insights/publications/ai-outlook/2025/european-commission-publishes-guidelines-on-prohibited-ai-practices)
- Prohibited examples: an insurer using spending and financial data to decide life-insurance eligibility; a credit agency deciding on loans from unrelated personal characteristics; a transport authority rating passengers on fare compliance plus social media posts and restricting passes; a tax authority using unrelated social habits to select returns — [FPF, Red Lines: social scoring](https://fpf.org/blog/red-lines-under-the-eu-ai-act-unpacking-social-scoring-as-a-prohibited-ai-practice/); [Orrick](https://www.orrick.com/en/Insights/2025/04/EU-Commission-Publishes-Guidelines-on-the-Prohibited-AI-Practices-under-the-AI-Act)
- Out of scope: online platforms profiling users for safety on their own service using data relevant to that purpose, where treatment is proportionate; ratings that merely average human-given scores (for example driver ratings), unless combined with other information; credit scoring, fraud and anti-money-laundering surveillance based on relevant data with proportionate treatment; targeted commercial advertising based on relevant data in line with consumer, data protection and digital services law — [FPF, Red Lines: social scoring](https://fpf.org/blog/red-lines-under-the-eu-ai-act-unpacking-social-scoring-as-a-prohibited-ai-practice/); [Norton Rose Fulbright, Inside Tech Law, Mar 2025](https://www.insidetechlaw.com/blog/2025/03/prohibited-practices-under-the-ai-act-answered-and-unanswered-questions)

**Team positions**
- The JSON lists "Social scoring" only as a general example and inside one combined wizard option; no hotel example, no boundary analysis [team data] — JSON `tiers[prohibited]`, `wizard.q4-prohibited`
- The booklet has no social-scoring hotel case in its "can become prohibited" table [team data] — Booklet A6

**Boundary table for Art. 5(1)(c)**

| # | Boundary | Provision | Condition | Hotel example | Verdict |
|---|---|---|---|---|---|
| S1 | Is it an AI system at all | Art. 5(1)(c) "AI systems"; Art. 3(1) | A manual list or fixed rule is not AI | PMS "do not rent" flag entered by the night manager after documented damage | SAFE under the AI Act [my inference]; GDPR still applies |
| S2 | Same context, specific purpose | Recital 31 last sentence | Out if data from stays is used for decisions about stays, for a defined purpose | Property-level incident history used to require a deposit | SAFE / CONDITIONAL on proportionality [text + my inference] |
| S3 | Disproportionate treatment (limb ii) | Art. 5(1)(c)(ii) | In if the consequence outweighs the behaviour, even in the same context | One noise complaint or a chargeback dispute leads to a lifetime ban at all properties | Grey; a regulator could treat as BANNED if AI-scored [my inference] |
| S4 | Cross-property or cross-brand sharing | Art. 5(1)(c)(i),(ii) | Still "hotel context", so limb (i) is arguable; limb (ii) and GDPR purpose limits bite. Risk rises with each added data source | Group-wide or industry-pooled "problem guest" score | CONDITIONAL, high risk [my inference]. Not addressed in team material |
| S5 | Data from unrelated contexts (limb i) | Art. 5(1)(c)(i) | In if the score uses social media, review-site history, credit data, nationality or other off-property behaviour to worsen treatment | Guests who post harsh reviews elsewhere get refused or downgraded | Likely BANNED [my inference; matches GL transport-authority pattern] |
| S6 | Loyalty tiers | Art. 5(1)(c) requires "detrimental or unfavourable treatment" | Rewarding spend with perks is favourable treatment tied to the same commercial relationship | Suite upgrades for top-tier members | SAFE [my inference]. Grey edge: AI "guest value" scores that actively degrade service for low scorers (walked first when overbooked) |
| S7 | Review-based ratings of guests | GL (averaged human ratings out of scope) | Out if it only averages staff or host ratings. In if AI blends them with other data and triggers sanctions | Staff rate guests 1-5 after stay; average shown at next check-in | CONDITIONAL [secondary] |
| S8 | Fraud and no-show risk scoring | GL (fraud surveillance on relevant data out of scope) | Out if based on booking and payment signals and the response is proportionate (prepayment, ID check) | Card-fraud score on an online booking | SAFE / CONDITIONAL [secondary; team data: booking fraud detection "minimal"] |
| S9 | Ordinary segmentation and CRM | Recital 31; GL on targeted advertising | Out: classification for marketing without detrimental treatment | "Business traveller", "family", "spa buyer" segments | SAFE [text + secondary] |
| S10 | Staff reliability or "trust" scores | Art. 5(1)(c); Annex III 4(b) | High-risk when based on work data. In (banned) if off-duty behaviour or personality inferences feed a score used against the worker | Score mixing punctuality with social media activity or union activity | CONDITIONAL; banned in the mixed-context version [my inference] |
| S11 | "Over a certain period of time" | Art. 5(1)(c) | A one-off check is arguably out | Single pre-arrival ID and payment verification | SAFE-ish, but a stored and reused result becomes evaluation over time [my inference] |
| S12 | Group scoring | Art. 5(1)(c) "groups of persons" | Scores on groups count | Risk score for "stag parties" or for guests of one nationality | Grey; nationality-based detriment also breaches equality law [my inference] |

### Inferences
- Social scoring is a blind spot in the team's material: neither the JSON scenarios nor the booklet table contains a guest-scoring case, although guest blacklists and "guest value" scores are common in hotel CRM and PMS products [my inference on team data].
- The practical line with ordinary segmentation has three checks: (1) does AI produce an evaluation of a person over time, (2) does it lead to worse treatment, (3) is the data from another context or the consequence out of proportion. Segmentation fails check 2; a proportionate deposit rule fails check 3 [my inference from text].
- Third-party "guest screening" services that pool data across operators would make the vendor a provider of a potentially prohibited system and the hotel its deployer; both are exposed [my inference from text].

### Gaps
- No summary confirmed that the guidelines discuss loyalty programmes, hospitality blacklists or cross-company customer databases. I recall, without being able to verify here, that the guidelines list an online shop giving privileges to customers with good purchase and returns history as out of scope; confirm before using.
- No guidance found on whether data sharing inside one hotel group counts as the "same context".
- No enforcement decision under Art. 5(1)(c) found.

---

## 4. Biometric categorisation (g), facial image scraping (e), individual crime prediction (d)

### Takeaway
Age and gender estimation at kiosks, bars or digital signage is not prohibited, but any feature that sorts individuals by ethnicity, religion, sexual orientation or political belief from their face or body is. The least noticed hotel risk is point (e): building a face database from the hotel's own CCTV of everyone who walks in is "untargeted scraping".

### Cited Findings

**Point (g): biometric categorisation of sensitive traits**
- Bans "biometric categorisation systems that categorise individually natural persons based on their biometric data to deduce or infer their race, political opinions, trade union membership, religious or philosophical beliefs, sex life or sexual orientation"; it "does not cover any labelling or filtering of lawfully acquired biometric datasets" [text] — [AIA Art. 5(1)(g), PDF p. 52](http://data.europa.eu/eli/reg/2024/1689/oj)
- Definition excludes a system that "is ancillary to another commercial service and strictly necessary for objective technical reasons" [text] — [AIA Art. 3(40), PDF p. 48](http://data.europa.eu/eli/reg/2024/1689/oj)
- Recital 16: categories "can relate to aspects such as sex, age, hair colour, eye colour, tattoos, behavioural or personality traits, language, religion, membership of a national minority, sexual or political orientation"; ancillary examples are virtual try-on filters on marketplaces and social-network photo filters [text] — [AIA recital 16, PDF p. 5](http://data.europa.eu/eli/reg/2024/1689/oj)
- Biometric categorisation "according to sensitive or protected attributes or characteristics" that is not prohibited is high-risk [text] — [AIA Annex III(1)(b)](http://data.europa.eu/eli/reg/2024/1689/oj); deployers must inform people exposed [text] — [AIA Art. 50(3)](http://data.europa.eu/eli/reg/2024/1689/oj)
- Guidelines: the ban concerns categorising individuals, not groups [secondary] — [Orrick](https://www.orrick.com/en/Insights/2025/04/EU-Commission-Publishes-Guidelines-on-the-Prohibited-AI-Practices-under-the-AI-Act)
- Booklet: "Cameras that read staff emotions or infer sensitive traits" = prohibited [team data] — Booklet C5

**Point (e): untargeted scraping of facial images**
- Bans AI systems "that create or expand facial recognition databases through the untargeted scraping of facial images from the internet or CCTV footage" [text] — [AIA Art. 5(1)(e), PDF p. 51](http://data.europa.eu/eli/reg/2024/1689/oj); rationale: "adds to the feeling of mass surveillance" [text] — [AIA recital 43, PDF p. 12](http://data.europa.eu/eli/reg/2024/1689/oj)
- Guidelines: does not cover biometric data other than faces (for example voice samples); does not apply where no AI system does the scraping; targeted scraping is not covered, but combining targeted with untargeted scraping is prohibited [secondary] — [Norton Rose Fulbright, Inside Tech Law](https://www.insidetechlaw.com/blog/2025/03/prohibited-practices-under-the-ai-act-answered-and-unanswered-questions)
- The Dutch data protection authority fined Clearview AI EUR 30.5 million under the GDPR for building a face database [secondary] — [Pinsent Masons, Out-Law](https://www.pinsentmasons.com/out-law/news/dutch-pa-fines-facial-recognition-company-gdpr-breach)

**Point (d): individual crime prediction**
- Bans AI "for making risk assessments of natural persons in order to assess or predict the risk of a natural person committing a criminal offence, based solely on the profiling of a natural person or on assessing their personality traits and characteristics"; not applicable to AI "used to support the human assessment of the involvement of a person in a criminal activity, which is already based on objective and verifiable facts directly linked to a criminal activity" [text] — [AIA Art. 5(1)(d), PDF p. 51](http://data.europa.eu/eli/reg/2024/1689/oj)
- Recital 42: people "should never be judged on AI-predicted behaviour based solely on their profiling, personality traits or characteristics, such as nationality, place of birth, place of residence, number of children, level of debt or type of car". The ban does not touch "risk analytics that are not based on the profiling of individuals", for example fraud analytics "on the basis of suspicious transactions" [text] — [AIA recital 42, PDF p. 12](http://data.europa.eu/eli/reg/2024/1689/oj)
- Guidelines: the ban mainly affects law enforcement but can catch private actors; example of a private crime-analytics vendor whose software police use; it does not outlaw crime prediction as such [secondary] — [Norton Rose Fulbright, Inside Tech Law](https://www.insidetechlaw.com/blog/2025/03/prohibited-practices-under-the-ai-act-answered-and-unanswered-questions)

**Boundary table for (g), (e), (d)**

| # | Boundary | Provision | Condition | Hotel example | Verdict |
|---|---|---|---|---|---|
| G1 | Age or gender estimation | Art. 5(1)(g) closed list | Age and sex are not on the banned list | Digital signage or kiosk adapting content to estimated age band | SAFE from the ban [text]. CONDITIONAL overall: notice under Art. 50(3); possibly high-risk under Annex III 1(b) from 2 Dec 2027 because age and sex are protected attributes [my inference] |
| G2 | Age estimation for alcohol sales | Art. 5(1)(g); Art. 3(40) | Not on the list; purpose is legal compliance | Self-service bar or minibar kiosk estimating whether a guest is over 18 | SAFE from the ban [text]; GDPR basis and a human fallback needed [my inference] |
| G3 | Ethnicity, religion, orientation from appearance | Art. 5(1)(g) | In whenever the system infers a listed trait from face, body, clothing-on-body or voice | Camera analytics "ethnicity" attribute for marketing; inferring religion from a headscarf to adapt F&B offers | BANNED [text]. Switch the attribute off and get vendor confirmation [my inference] |
| G4 | "Aggregate only" demographics | Art. 5(1)(g) "categorise individually" | Group-level statistics are produced by classifying each face first | Lobby footfall report by ethnic group | FALSE LOOPHOLE for listed traits [my inference; GL individual/group point noted] |
| G5 | Ancillary feature | Art. 3(40); recital 16 | Out only if the feature cannot technically work without the main service and is not a circumvention | Spa "virtual try-on" for treatments or uniforms | CONDITIONAL, narrow [text] |
| G6 | Non-biometric inference of sensitive traits | Art. 5(1)(g) "based on their biometric data" | Out of (g) if inferred from names, language, bookings or dietary requests | CRM tagging "likely Muslim guest" from a halal meal request | SAFE from Art. 5(1)(g) [text], but special-category processing under GDPR Art. 9 [my inference] |
| E1 | Face database from own CCTV | Art. 5(1)(e) "or CCTV footage" | In if faces of everyone passing are harvested to create or expand a recognition database | Enrolling all lobby visitors to "recognise returning guests" later | BANNED [my inference from text]. Not in team material |
| E2 | Targeted enrolment | Art. 5(1)(e) "untargeted"; GL | Out if specific persons are enrolled individually (with consent) | Opt-in VIP face enrolment at registration | SAFE from (e) [secondary]; still Annex III and GDPR explicit-consent territory |
| E3 | Pulling guest photos from the internet | Art. 5(1)(e) | Targeted look-up of a named arriving guest is not "untargeted"; bulk harvesting is | Concierge tool that auto-collects social media photos of all upcoming arrivals | Grey: bulk version likely BANNED; single look-ups fail under GDPR anyway [my inference] |
| E4 | Buying access to a scraped database | Art. 5(1)(e) | The vendor is in breach; whether the hotel "uses" a database-building system is unclear | Security team subscribes to a web-scraped face search engine | Grey on the AI Act, unlawful under GDPR in practice [my inference; Clearview fines] |
| D1 | Behaviour-based video analytics | Art. 5(1)(d) "based solely on the profiling ... or personality traits" | Out if alerts rest on observed actions, not on who the person is | Loitering, tailgating, concealment-gesture alerts in the car park or shop | SAFE from (d) [text]; may be emotion or intention inference from biometrics (Annex III 1(c)) depending on design [my inference] |
| D2 | Profile-based theft or fraud prediction | Art. 5(1)(d); recital 42 | In if a person is scored as a likely offender solely from traits such as nationality, age, residence, debt | "Likely to steal" score for new housekeeping hires; "likely fraudster" score by guest nationality | Grey to BANNED [my inference]. The text is not limited to police |
| D3 | Transaction-based fraud detection | Recital 42 | Out: based on objective, verifiable facts (card mismatches, velocity, device signals) | Booking-engine payment fraud screening | SAFE [text + team data] |
| D4 | Human-trafficking indicator tools | Art. 5(1)(d) carve-out | Out if flags rest on objective facts (cash payment, repeated short stays, many visitors) and a human assesses. In if flags rest on guest sex, age or nationality alone | AI screening of bookings for trafficking indicators | CONDITIONAL [my inference]. Not in team material |

### Inferences
- "VIP recognition" involves three separate points: enrolment (point (e) if untargeted), matching at a distance (Annex III 1(a), section 5 below) and any trait inference (point (g)). Hotels tend to consider only the matching step [my inference].
- "Shoplifting" or "suspicious behaviour" analytics in hotel retail or F&B outlets are outside Art. 5 if they flag actions. They move toward (d) when they score persons, and toward (h)/Annex III when they match faces against a list of known offenders [my inference].

### Gaps
- No summary showed the guidelines addressing age or gender estimation directly, or private-sector use of point (d) for a company's own loss prevention.
- I recall, unverified, that the guidelines say private companies profiling customers for their own business protection are not the target of point (d) unless acting for law enforcement or under a legal duty; this needs checking in GL section 5.
- Whether Annex III 1(b) covers plain age estimation is to be settled by the final high-risk classification guidelines (draft of 19 May 2026; final expected end 2026) [team data: JSON `interimPostures`].
- A Spanish data protection fine against a supermarket chain for face recognition of banned offenders (which I believe exists, 2021) could not be confirmed in this session.

---

## 5. Real-time remote biometric identification (Art. 5(1)(h)) and private hotel cameras

### Takeaway
Point (h) bans only use for law enforcement, so a hotel's own face recognition is not prohibited by Art. 5; it is high-risk under Annex III and, in practice, blocked or tightly limited by GDPR Art. 9. A hotel falls under (h) only if it runs live face matching for or on behalf of the police.

### Cited Findings
- Art. 5(1)(h) bans "the use of 'real-time' remote biometric identification systems in publicly accessible spaces for the purposes of law enforcement", with three narrow exceptions; only USE is banned, not placing on the market [text] — [AIA Art. 5(1)(h), PDF p. 52](http://data.europa.eu/eli/reg/2024/1689/oj)
- "Point (h) ... is without prejudice to Article 9 of Regulation (EU) 2016/679 for the processing of biometric data for purposes other than law enforcement" [text] — [AIA Art. 5(1), second subparagraph, PDF p. 52](http://data.europa.eu/eli/reg/2024/1689/oj)
- "Law enforcement" means activities "carried out by law enforcement authorities or on their behalf" [text] — [AIA Art. 3(46), PDF p. 49](http://data.europa.eu/eli/reg/2024/1689/oj)
- Publicly accessible space: any place "accessible to an undetermined number of natural persons"; recital 19 names "shops, restaurants, cafés", "hospitality", "swimming pools, gyms", "conference halls". Staff-only areas ("offices and workplaces that are intended to be accessed only by relevant employees and service providers") are not publicly accessible [text] — [AIA Art. 3(44), PDF p. 48; recital 19, PDF pp. 5-6](http://data.europa.eu/eli/reg/2024/1689/oj)
- Use "for purposes other than law enforcement ... should not be covered by the specific framework"; for such purposes GDPR Art. 9(1) prohibits biometric processing "subject to limited exceptions", and remote biometric identification by non-police users "has already been subject to prohibition decisions by national data protection authorities" [text] — [AIA recitals 38-39, PDF p. 11](http://data.europa.eu/eli/reg/2024/1689/oj)
- Remote identification excludes biometric verification "the sole purpose of which is to confirm that a specific natural person is the person he or she claims to be" for "access to a service, unlocking a device or having security access to premises" [text] — [AIA recital 17, PDF p. 5; Art. 3(36), 3(41)](http://data.europa.eu/eli/reg/2024/1689/oj)
- Remote biometric identification is high-risk "in so far as their use is permitted under relevant Union or national law" [text] — [AIA Annex III(1)(a)](http://data.europa.eu/eli/reg/2024/1689/oj)
- "Real-time" includes "limited short delays in order to avoid circumvention" [text] — [AIA Art. 3(42), PDF p. 48](http://data.europa.eu/eli/reg/2024/1689/oj)
- "Member States may introduce, in accordance with Union law, more restrictive laws on the use of remote biometric identification systems" [text] — [AIA Art. 5(5), PDF p. 53](http://data.europa.eu/eli/reg/2024/1689/oj)
- Guidelines include a worked example of an AI system screening all incoming visitors to a concert venue as real-time remote biometric identification [secondary; fragmentary summary of the Commission PDF] — [GL, Service Desk copy](https://ai-act-service-desk.ec.europa.eu/sites/default/files/2025-08/guidelines_on_prohibited_artificial_intelligence_practices_established_by_regulation_eu_20241689_ai_act_english_ied3r5nwo50xggpcfmwckm3nuc_112367-1.PDF)
- Team: VIP or banned-guest recognition on lobby cameras is "high-risk, also on private property", "not prohibited"; 1:1 face verification at check-in is excluded from Annex III but is special-category data (marked "contested"); a guest who steps up to an entry camera to be checked is not "at a distance" (draft guidance); voiceprint recognition of returning callers without active involvement is remote identification [team data] — JSON `hospitalityProvisions`, `wizard.q5-usecase`; Booklet C5

**Boundary table for Art. 5(1)(h)**

| # | Boundary | Provision | Condition | Hotel example | Verdict |
|---|---|---|---|---|---|
| H1 | Private purpose | Art. 5(1)(h) "for the purposes of law enforcement" | Out if the hotel uses it for its own purposes | Banned-guest or VIP face matching in the lobby | Not banned by Art. 5 [text]. CONDITIONAL in reality: high-risk from 2 Dec 2027 and needs a GDPR Art. 9 basis that is very hard to get for passers-by [text recital 39 + my inference] |
| H2 | Acting for the police | Art. 3(46) "or on their behalf" | In if police ask the hotel to run live matching against a watchlist | Police hand security a wanted-persons list to match on lobby cameras during an event | BANNED unless national law and prior authorisation exist [text] |
| H3 | Space | Art. 3(44); recital 19 | Lobby, restaurant, bar, pool, conference floor are publicly accessible; back-of-house is not | Face matching at the staff entrance | Outside (h) regardless; still Annex III 1(a) or verification, plus labour and GDPR rules [text + my inference] |
| H4 | Verification vs identification | Recital 17; Art. 3(36) | Out of remote identification if 1:1, with the person's active involvement | Face check-in kiosk comparing guest to passport photo; biometric staff clock-in | SAFE from Art. 5 and Annex III 1(a) [text]; "contested" under GDPR [team data] |
| H5 | "Short delay" trick | Art. 3(42) | A brief delay does not turn real-time into "post" | Matching with a 30-second buffer | FALSE LOOPHOLE [text]. Mostly relevant to police use |
| H6 | Stricter national law | Art. 5(5) | Member States may go further | National bans or permit schemes for private face recognition | Check per country [text] |

### Inferences
- For hotels, point (h) is the least relevant prohibition; the working constraint on cameras is GDPR Art. 9 plus national surveillance and labour law. The text itself (recital 39) tells readers that data protection authorities have already banned private remote identification [my inference from text].
- "Not prohibited" in the booklet for VIP recognition is correct for Art. 5 but could be misread as "allowed"; the Annex III wording "in so far as their use is permitted under relevant Union or national law" should travel with it [my inference on team data].

### Gaps
- No summary confirmed how the guidelines treat private operators (retail, stadiums, hotels) asked by police to share live matching; GL section 9 was not readable.
- Country-level rules on private face recognition for the focus countries were not researched here.

---

## 6. The new prohibitions: Art. 5(1)(ba) and (bb), and paragraphs 1a and 1b (apply from 2 Dec 2026)

### Takeaway
The two new bans target "nudification" and AI-generated child sexual abuse material; a hotel is exposed only if someone uses an AI tool for that purpose, or if the group builds its own image generator without safeguards. Normal AI marketing imagery, including spa, pool and beach scenes, is outside.

### Cited Findings
- Point (ba): bans AI "that generates or manipulates realistic images, videos, audio or similar material of an identifiable natural person's intimate parts, or of an identifiable natural person engaged in sexually explicit activities, without that person's freely-given, specific, informed, unambiguous and explicit consent" [text] — [OMN Art. 1, point (7)(a), PDF p. 18](http://data.europa.eu/eli/reg/2026/1744/oj)
- Point (bb): bans AI "that generates or manipulates material or performance within the meaning of Article 2, points (c) and (e), of Directive 2011/93/EU, except where a 'without right' defence applies under national law" [text] — [OMN point (7)(a), PDF p. 18](http://data.europa.eu/eli/reg/2026/1744/oj)
- Paragraph 1a(a): for providers, placing on the market is banned only where such generation "is the intended purpose" or is "a reasonably foreseeable and reproducible outcome, without requiring significant technical modification" and the system lacks "reasonable and adequate technical safety measures and other safeguards" [text] — [OMN point (7)(b), PDF p. 18](http://data.europa.eu/eli/reg/2026/1744/oj)
- Paragraph 1a(b): use "is only prohibited where the deployer uses the system for the purpose of generating or manipulating such material" [text] — [OMN point (7)(b), PDF p. 18](http://data.europa.eu/eli/reg/2026/1744/oj)
- Paragraph 1b: manipulation "that does not increase the exposure of any depicted intimate parts or alter the nature of any depicted sexually explicit activities shall not constitute manipulation" [text] — [OMN point (7)(b), PDF p. 18](http://data.europa.eu/eli/reg/2026/1744/oj)
- Recital 12: the use ban "does not cover the use of an AI system for lawful purposes ... even in cases where the AI system lacks reasonable and adequate safeguards ..., nor does it cover accidental generation". It is limited to "realistic depictions of intimate parts, notably the genitals, pubic area, anus, exposed buttocks or exposed female breasts, nipples or areolae, or of sexually explicit activity". Outside: material "that does not depict identifiable natural persons", "realistic partially nude depictions where intimate parts are not revealed", "cartoonish or physically impossible depictions", and "try-on applications" [text] — [OMN recital 12, PDF p. 5](http://data.europa.eu/eli/reg/2026/1744/oj)
- Deployer scope also includes cases where a deployer "circumvents the preventive measures or uses for such purposes lawful AI systems not intended to generate or manipulate such material" [text] — [OMN recital 12, PDF p. 5](http://data.europa.eu/eli/reg/2026/1744/oj)
- Conduct may also be criminal; Member States must respect ne bis in idem where both regimes apply [text] — [OMN recital 15, PDF p. 6](http://data.europa.eu/eli/reg/2026/1744/oj)
- Application date: points (ba), (bb) and paragraphs 1a, 1b "shall apply from 2 December 2026" [text] — [OMN point (40)(a), new Art. 113(a), PDF p. 38](http://data.europa.eu/eli/reg/2026/1744/oj)
- Team: wizard option "Generates non-consensual intimate content or child sexual abuse material ... Prohibited from 2 Dec 2026"; no hotel scenario [team data] — JSON `wizard.q4-prohibited`

**Boundary table for (ba)/(bb)**

| # | Boundary | Provision | Condition | Hotel example | Verdict |
|---|---|---|---|---|---|
| N1 | Ordinary marketing imagery | Art. 5(1a)(b); recital 12 | Out: no intimate parts, or no identifiable real person | AI-generated or retouched spa, pool and beach visuals with swimwear | SAFE [text]. Art. 50(4) deepfake labelling and consumer law still apply [team data] |
| N2 | Accidental output | Recital 12 | Out if not generated on purpose | Image tool unexpectedly returns explicit output | SAFE from Art. 5 [text]; delete and report to vendor [my inference] |
| N3 | Editing existing photos | Art. 5(1b) | Out if exposure is not increased | Colour-correcting a model shoot | SAFE [text] |
| N4 | Employee misuse of company tools | Art. 5(1a)(b); Art. 3(4) | The use ban attaches to "the deployer" using the system for that purpose. Whether a rogue employee's act is the hotel's use is unsettled | Staff member "nudifies" a colleague's or guest's photo with the hotel's licensed image tool | Grey [my inference]. Regardless: harassment, criminal and GDPR exposure. Policy, logging and tool safeguards advised |
| N5 | Chain builds its own generator | Art. 5(1a)(a)(ii) | A provider is in breach if such output is reasonably foreseeable and reproducible and safeguards are missing | In-house fine-tuned image model for marketing with no content filters | CONDITIONAL [text]. Relevant to JSON scenario P5-type builds |
| N6 | Consent | Art. 5(1)(ba) | Explicit consent of the depicted person takes the use out | Boudoir or wellness photo product | CONDITIONAL, unlikely hotel case [text] |

### Inferences
- Relevance to hotels is low and indirect; the item belongs in the acceptable-use policy for generative AI and in vendor due diligence, not in the main risk table [my inference].
- The date matters for the report: these two points are not yet applicable on 17 Nov 2026 and become applicable two weeks later [text + my inference].

### Gaps
- No updated Commission guidance on (ba)/(bb) found; no commentary specific to deployers found beyond vendor blogs.
- Attribution of an employee's unauthorised act to the employer under Art. 5 is not addressed in any source found.

---

## 7. What the Commission guidelines leave open for hotels

### Takeaway
The guidelines give clear answers for call centres, recruitment, customer emotion analysis and credit-style scoring, but (as far as the summaries show) say nothing specific to hospitality: guest blacklists, loyalty-linked treatment, personalised room pricing and casino marketing are not addressed.

### Cited Findings
- The guidelines include worked examples and exclusions for each prohibition and stress case-by-case assessment [secondary] — [Inside Privacy / Covington](https://www.insideprivacy.com/artificial-intelligence/european-commission-guidelines-on-prohibited-ai-practices-under-the-eu-artificial-intelligence-act/)
- Commentators list "answered and unanswered questions" in the guidelines [secondary] — [Norton Rose Fulbright, Inside Tech Law, Mar 2025](https://www.insidetechlaw.com/blog/2025/03/prohibited-practices-under-the-ai-act-answered-and-unanswered-questions)
- On responsibility: providers must consider reasonably foreseeable conditions of use and build in "effective and verifiable" safeguards; deployers breach Art. 5 if they use a general-purpose system for a prohibited purpose, including by bypassing guardrails; "use" includes any misuse, "reasonably foreseeable or not"; providers should also exclude prohibited uses contractually [secondary] — [Norton Rose Fulbright via Lexology](https://www.lexology.com/library/detail.aspx?g=1cad5c93-8171-443f-8f7d-466ba543fc05)
- Most systems that fall within an exception to a prohibition will be high-risk [secondary] — [Orrick](https://www.orrick.com/en/Insights/2025/04/EU-Commission-Publishes-Guidelines-on-the-Prohibited-AI-Practices-under-the-AI-Act)
- Searches for guideline passages on dynamic or personalised pricing, scarcity prompts, loyalty schemes, hospitality or travel returned nothing [secondary: absence in the search summaries cited in sections 2 and 3]

### Inferences
Open questions for hotels, in my reading [all my inference]:
1. Stress and "attention" detection for staff: emotion or physical state?
2. Voice-to-text pipelines: when does a transcript-based score stop being biometric?
3. Two-party calls and shared camera scenes: what technical separation is enough to "carve out" staff?
4. Do "intentions" fall under the workplace ban?
5. Cross-property and cross-brand guest scores: same context or unrelated context?
6. Service degradation by "guest value" score: detrimental treatment or commercial freedom?
7. Personalised pricing: when is financial harm "significant" for a travel purchase?
8. Casino player analytics: is gambling addiction a disability or a "specific social or economic situation"?
9. Own-CCTV face enrolment: "untargeted scraping"?
10. Private crime-risk scoring of guests or staff for loss prevention: inside point (d) or not?
11. Age estimation: high-risk "protected attribute" categorisation or minimal?
12. Who is the deployer in a franchise or management contract (owner, operator or brand)?
13. Employee misuse of AI tools: when is it the hotel's "use"?

### Gaps
- The guidelines themselves were not read; this section is the least well sourced. A full read of C(2025) 5052 sections 3-9 is needed to confirm what is and is not addressed.
- AI Act Service Desk FAQs on Art. 5 could not be opened.

---

## 8. Penalties and who is liable

### Takeaway
An Art. 5 breach carries the top fine tier, up to EUR 35 million or 7% of worldwide turnover, and it reaches the hotel as deployer just as it reaches the vendor as provider. SMEs get the lower of the two caps, but the new small-mid-cap relief does not extend to prohibited practices.

### Cited Findings
- "Non-compliance with the prohibition of the AI practices referred to in Article 5 shall be subject to administrative fines of up to EUR 35 000 000 or, if the offender is an undertaking, up to 7 % of its total worldwide annual turnover for the preceding financial year, whichever is higher" [text] — [AIA Art. 99(3), PDF p. 115](http://data.europa.eu/eli/reg/2024/1689/oj)
- SMEs including start-ups: each fine is capped at the percentage or amount "whichever thereof is lower" [text] — [AIA Art. 99(6), PDF p. 116](http://data.europa.eu/eli/reg/2024/1689/oj)
- New Art. 99(6a): for small mid-caps the lower-of rule applies to "paragraphs 4 and 5" only, so not to Art. 5 fines under paragraph 3 [text] — [OMN Art. 1, point (38)(c)](http://data.europa.eu/eli/reg/2026/1744/oj)
- Art. 99(1) as replaced: Member States set penalty rules, which "may also include administrative fines, warnings and non-monetary measures", and must consider the economic viability of SMEs and SMCs [text] — [OMN point (38)(a)](http://data.europa.eu/eli/reg/2026/1744/oj)
- Fining factors include nature, gravity and duration, number of affected persons, size and turnover, cooperation, "the intentional or negligent character of the infringement", and fines already imposed by other authorities for the same conduct under other law [text] — [AIA Art. 99(7), PDF p. 116](http://data.europa.eu/eli/reg/2024/1689/oj)
- Who: points (a) to (g), (ba), (bb) ban "the placing on the market, the putting into service or the use" (provider and deployer); point (h) bans only "the use" [text] — [AIA Art. 5(1), PDF pp. 51-52](http://data.europa.eu/eli/reg/2024/1689/oj)
- Timing: Art. 5 applies from 2 Feb 2025; the penalties chapter (Chapter XII) applies from 2 Aug 2025 [text] — [AIA Art. 113(a),(b), PDF p. 123](http://data.europa.eu/eli/reg/2024/1689/oj)
- No grandfathering: the legacy-system rule in Art. 111(2) is "without prejudice to the application of Article 5" [text] — [OMN point (39)(a), PDF p. 38](http://data.europa.eu/eli/reg/2026/1744/oj)
- "This Article shall not affect the prohibitions that apply where an AI practice infringes other Union law" [text] — [AIA Art. 5(8), PDF p. 53](http://data.europa.eu/eli/reg/2024/1689/oj)
- Criminal penalties may be laid down nationally under Art. 99(1) [text] — [OMN recital 15, PDF p. 6](http://data.europa.eu/eli/reg/2026/1744/oj)
- The prohibitions have direct effect, so affected persons can rely on them in national courts and seek injunctions [secondary] — [Norton Rose Fulbright via Lexology](https://www.lexology.com/library/detail.aspx?g=1cad5c93-8171-443f-8f7d-466ba543fc05)
- The Commission's enforcement page confirms the EUR 35m / 7% tier for prohibited practices [secondary] — [Commission, enforcement framework of the AI Act](https://digital-strategy.ec.europa.eu/en/policies/enforcement-ai-act)
- Team: penalty table matches the text, including "SMC relief ... not for prohibitions"; booklet A7 states small mid-caps face "whichever is higher" for prohibited practices; GDPR fines (EUR 20m / 4%) can stack [team data] — JSON `penalties`; Booklet A7
- Team: national authorities for the focus countries; Germany's Bundesnetzagentur is market surveillance authority and complaints body under the KI-MIG in force 29 July 2026; labour law (works councils) can stop staff-facing AI rollouts [team data] — JSON `nationalLayer`

### Inferences
- A hotel cannot shift Art. 5 liability to the vendor by contract: "use" is banned in its own right, and for point (f) the "for this specific purpose" qualifier protects only the provider side [my inference from text].
- "Undertaking" and "total worldwide annual turnover" point to group-level turnover for chains; for a franchised or managed hotel the basis depends on which entity is the deployer [my inference; not confirmed].
- Art. 99(7)(c) signals that one set of facts (for example staff emotion analytics) can draw both a GDPR and an AI Act fine, with the second authority required to take the first fine into account [my inference from text].
- Enforcement so far appears to come through data protection authorities and labour courts, not AI Act market surveillance [my inference from the absence of AI Act cases plus team data on national layer].

### Gaps
- No Art. 5 fine or formal decision by any market surveillance authority was found as of November 2026 (search results were mostly vendor blogs; absence is not proof).
- National penalty laws for the focus countries were not checked here.
- The PDF page of the Omnibus amendment to Art. 99 was not verified (it sits just before point (39), which is on PDF p. 38).

---

## 9. Full list of grey areas, including those the team's material does not mention

### Takeaway
The register below has 30 rows; 21 of them are absent from the team's JSON and booklet and 4 more are only partly covered. The five that matter most for hotels are: agent-emotion features in call tools, cross-property guest scoring, own-CCTV face enrolment, casino player targeting, and mixed guest/staff emotion analytics.

### Cited Findings
- The team's prohibited-tier hotel examples are two: "A hotel using cameras or voice analysis to infer staff emotions" and "Pricing designed to exploit a guest's vulnerability" [team data] — JSON `tiers[prohibited].hospitalityExamples`
- The booklet's "can become prohibited" table lists five uses: candidate emotion reading in video interviews, coaching or wellbeing tools reading staff emotions, scoring reservation agents' emotions, and cameras reading staff emotions or inferring sensitive traits; plus exploitative pricing as "our reading" [team data] — Booklet A6, C1, C3, C5
- The wizard's prohibited question has four options and omits individual crime prediction (d) and law-enforcement biometric identification (h) [team data] — JSON `wizard.q4-prohibited`
- All statutory conditions referred to below are quoted in sections 1-6 [text] — [AIA Art. 5](http://data.europa.eu/eli/reg/2024/1689/oj); [OMN point (7)](http://data.europa.eu/eli/reg/2026/1744/oj)

### Inferences
Grey-area register [classification of "in team material" is my reading of the JSON and booklet; verdicts are my inference unless marked in the section tables]:

| Ref | Grey area | Prohibition | In team material? | Reliability of the "outside the ban" argument |
|---|---|---|---|---|
| F1 | Text-only sentiment | (f) | Yes | High (safe) |
| F2 | Voice transcribed to text | (f) | No | Medium (conditional) |
| F3 | Fatigue vs stress | (f) | Partly (fatigue no; wellbeing yes) | High for fatigue; low for stress |
| F4 | Smile or tone "detection" KPIs | (f) | No | Low (false loophole) |
| F5 | Intentions instead of emotions | (f) | No | Low |
| F7 | Agency staff, freelancers | (f) | Only for high-risk, not for the ban | Low (treat as covered) |
| F8/F9 | Guest emotion with staff in frame or on the call | (f) | Partly (guest = high-risk; carve-out not discussed) | Medium (conditional on technical separation) |
| F10 | Safety exception for lone workers | (f) | Partly | Medium |
| F11 | Private coaching | (f) | Yes | Medium (conditional) |
| F12-F14 | Consent, aggregation, renaming | (f) | Renaming yes; consent and aggregation no | None (false loopholes) |
| F15 | Vendor not liable, hotel liable | (f) | No | n/a (exposure point) |
| M2-M4 | Personalised pricing and the harm bar | (a),(b) | Yes ("our reading") | Medium to high for ordinary hotels |
| M5 | False scarcity | (a) | No | Outside AI Act mostly; unlawful elsewhere |
| M9 | Self-learning optimiser | (a),(b) | No | Medium, falls once pattern is known |
| M10 | Casino hotels | (a),(b) | No | Low |
| M13 | Intoxicated or distressed guests | (a) | No | Medium |
| M14 | Staff as manipulation targets | (a),(b) | No | Unknown |
| S3-S5 | Cross-property and off-property guest scores | (c) | No | Low to medium |
| S6 | Service degradation by guest value | (c) | No | Medium |
| S10 | Staff trust scores with off-duty data | (c) | No | Low |
| G1-G2 | Age and gender estimation | (g) | No (only "sensitive traits") | High for the ban; open for high-risk |
| G4 | Aggregate ethnicity analytics | (g) | No | None (false loophole) |
| G6 | Non-biometric inference of religion | (g) | No | High for the ban; GDPR problem |
| E1 | Own-CCTV face enrolment | (e) | No | Low |
| E4 | Buying scraped face search | (e) | No | Unknown; GDPR blocks it |
| D2 | Profile-based theft prediction | (d) | No | Low to medium |
| D4 | Trafficking-indicator tools | (d) | No | Medium (conditional) |
| H1 | Private face recognition "not prohibited" | (h) | Yes | High for Art. 5; low overall (GDPR) |
| H2 | Matching on behalf of police | (h) | No | None (banned) |
| N4 | Employee misuse of image tools | (ba) | No | Unknown |

Cross-cutting boundaries [text unless marked]:
- Non-AI tools are outside the Act altogether: a manual blacklist or fixed rule is not an "AI system". SAFE, but only if truly rule-based [my inference].
- Research and testing before market or service are outside the Act (Art. 2(8)); real-world pilots on staff or guests are not [team data: JSON `boundaries`]. "It is only a pilot" is a FALSE LOOPHOLE once real people are exposed [my inference].
- Legacy systems get no grandfathering for Art. 5 (Art. 111(2) as amended) [text]. "We bought it before 2025" is a FALSE LOOPHOLE.
- Art. 5 has no consent exception anywhere except point (ba) [text].
- Passing an Art. 5 boundary usually lands the tool in high-risk (Annex III points 1 and 4) or transparency duties (Art. 50(3)), not in "minimal" [text + secondary].
- UK and Swiss hotel groups are reached when the AI output is used in the EU [team data: JSON `nationalLayer.scopeNote`].

### Gaps
- The register reflects the text and search summaries; it has not been checked against the full guidelines, which may resolve some items (notably F5, F7, D2, S6).
- No hospitality-specific regulator statement on Art. 5 was found from any EU authority.
- Items needing a consumer-law or GDPR specialist check: M2, M5, S4, G2, H1.
