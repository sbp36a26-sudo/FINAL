# What blocks or enables AI projects in European hotels, and are the readiness tool's six gates the right ones?

Research date: 18 Nov 2026. Scope: European hotels, including F&B inside hotels.

**How to read the source labels.** No web page could be opened in full: the session's network blocks hotelinside.ch, hevs.ch and hospitalitynet.org. Every web citation below therefore comes from search-engine summaries and is marked **[secondary]**. Check it against the original before it goes into the report. Local citations (`[local]`) come from the team's own files:
- the readiness tool's data block in `/home/user/final/tools/readiness/index.html`, with Evidence IDs from the D6 evidence pack (master v8_3);
- `/home/user/final/reports/EU AI Act hospitality deep dive.md`;
- `/home/user/final/reports/Hotel AI register design.md`.

Local citations are the team's own verified layer. No Wikipedia was used.

**The six gate questions.** I extracted these with a script from `<script id="rdy">`, field `q`, where `gate: true`. The tool requires each to be at least "Partly", with proof, before any pilot.

| Code | Area | Question | Proof asked |
|---|---|---|---|
| P1 | People | Is one named person responsible for this AI use case, with time set aside for it? | Name, role and hours per week in writing |
| F1 | Finance | Is there a 12-month budget covering subscription, integration, training and running costs? | Budget line with all four cost types |
| F2 | Finance | Have you measured a baseline for the KPI this AI should move (hours, response time, revenue)? | Baseline figure with date and method |
| T1 | Technology | Can the tool exchange data both ways with the systems that hold what it needs? | Live test on your own systems, not a demo |
| D5 | Data | Do you have a lawful basis and a vendor agreement for any guest or staff data the AI processes? | Signed data-processing agreement; lawful basis recorded |
| O1 | Organisation | Has top management or the owner approved a written plan (one page is enough) linking this AI to a business goal? | Approved plan naming the goal and KPI |

The other 25 questions are not gates. Several of them matter to the analysis below:
- F3: stop/scale rule set in advance
- F4: who pays
- T5: fallback if the tool or vendor fails
- P4: plan for the time saved
- P5: staff can override the AI
- O2: process redesigned before automation
- O3: owner sign-off in managed or franchised hotels
- G1–G4: AI-use policy, risk review, human oversight, security

The tool's "sensitive data" add-on already asks for a DPIA and works-council consultation, but as a core question, not a gate. Sources: `/home/user/final/tools/readiness/index.html` [local].

---

## 1. What do 2023–2026 surveys say are the main barriers and enablers for AI in European hotels?

### Takeaway
Across every survey, the first barrier is not money or technology. It is knowing what exists and having the skills to judge it. Set-up cost has fallen sharply as a barrier in Europe (61% in 2023 to 35% in 2025, HES-SO). Integration, data readiness and the lack of a strategy are what stop hotels from moving past use. The best European survey (HES-SO) covers mostly small independents. The chain surveys (h2c, State of Hotel AI) are global and vendor-linked. Figures from the two families should not be compared directly.

### Cited findings

**HES-SO Valais-Wallis (Schegg 2025)**

Base: about 1,485 hotels in Austria, France, Germany, Greece, Italy and Switzerland, surveyed Jan–Apr 2025. 82% are independent and the median size is 31 rooms. The number answering each question is not stated.

- 41% use AI. 43% do not use it at all, and 16% plan to adopt it. Chatbots are the most used tool (31%) and robotics the least (3%). [local: ASN-001, readiness `figs`; deep-dive report line 25] and [secondary: [HES-SO news](https://www.hevs.ch/en/news/how-ai-is-and-isn-t-transforming-european-hospitality-212299), [Hospitality Net summary](https://www.hospitalitynet.org/opinion/4128078.html)]
- **Barriers** (same base; the n for the barrier question is not stated):

  | Barrier | Share of hotels |
  |---|---|
  | Poor knowledge of the AI solutions on offer (most cited) | 39% (France 58%) |
  | High set-up cost | 35% (61% in the 2023 survey, which had 5 countries and no Italy) |
  | Technical complexity | 34% |
  | Integration into existing processes | 34% |
  | Lack of technical skills | 32% |
  | Employee resistance (Swiss sub-sample only) | 28% |

  [local: ASN-001-15/-16/-17/-25] and [secondary: [PhocusWire](https://www.phocuswire.com/european-hotels-show-ai-interest-gaps-remain)]
- Search summaries give the sample as "over 1,500" in Schegg's own Hospitality Net piece and 1,485 elsewhere. Use 1,485 with its base. [secondary: [Hospitality Net](https://www.hospitalitynet.org/opinion/4128078.html)]
- **Size pattern:** chain and luxury hotels lead on adoption. Small independents face a larger skills gap and more cost pressure. Schegg's advice is plug-and-play tools and training for small hotels, and data governance and change management for large ones; midsize hotels are "caught in the middle". [secondary: [HES-SO news](https://www.hevs.ch/en/news/how-ai-is-and-isn-t-transforming-european-hospitality-212299); [Hotel Yearbook, Schegg & Fux](https://www.hotelyearbook.com/article/122000458/how-ready-is-europes-hotel-industry-for-ai-insights-from-a-multicountry-survey.html)]

**HES-SO / Britz & Schegg AI readiness survey (2025)**

Base: questionnaire sent to 408 hoteliers, about 79–80 responded, 71% of them Swiss; Jul–Sep 2025.
- Main barriers: lack of time and budget, limited expertise, and difficulty evaluating AI providers. The authors call these structural and knowledge-based, not attitudinal.
- 9% have a formal strategy that includes AI, and 35% test tools case by case.
- More than half feel confident about integration and staff acceptance, but confidence is low on data quality and on evaluating ROI.
- 37% plan to invest in predictive or generative AI within two years; 41% are undecided and 23% say no.

[local: ASN-002-01/-02/-04/-06; deep-dive line 25] and [secondary: [hotellerie.de copy of Britz & Schegg 2025](https://www.hotellerie.de/fileadmin/user_upload/Dokumente/Studien_und_Umfragen/Britz_Schegg_2025_AI_Readiness_in_Hotels.pdf)]

**h2c AI Opportunity Study 2026**

Base: 122 responses from 113 hotel chains, global (including Europe), published Oct 2026. Vendor-sponsored and unweighted.
- 91% use AI.
- 28% have a company-wide AI strategy led by senior management.
- 13% report a measurable return.
- Chains rate their own AI know-how at 3.4 out of 10.

[local: FAC-302-03/-09/-11] and [secondary: [Hospitality Net](https://www.hospitalitynet.org/news/4134666/new-h2c-study-ai-adoption-is-widespread-among-hotel-chains-but-enterprise-readiness-remains-limited); [TravelDailyNews](https://www.traveldailynews.com/statistics-trends/h2c-ai-adoption-hotel-chains-2026/)]

**Conflict on the h2c 2026 barrier ranking.** The two accounts do not match.

| Barrier | Search summary of Hospitality Net | Team's D7 deep-dive (line 25), citing the same article |
|---|---|---|
| Integration with existing systems | 38% (ranked first) | not listed |
| No clear AI strategy or roadmap | 32% | not listed |
| Lack of AI expertise, training or skills | not listed | 56% (ranked first) |
| Data security and privacy | 29% | 29% |
| Data governance and access | 28% | 28% |

Both may come from different questions, for example "biggest barrier" versus "barriers to scaling". Resolve this against the original before citing. [secondary + local]

**h2c AI & Automation in Hospitality (2025)**

Base: 189 responses from 171 hotel chains, global.
- 78% use AI.
- 11% have a dedicated AI budget.
- 58% track AI ROI, and only 27% of those track it consistently.
- Integration with existing systems is the top purchase criterion for 70% of chains.
- Trust in AI is moderate, but reliance on it is low (4.7 out of 10).
- Barriers: lack of expertise 62%, unclear strategy 51%, integration 45%.
- The share with a comprehensive company-wide AI strategy is reported as 7% or 8% depending on the summary.

[local: NEX-188-05/-10/-11/-15] and [secondary: [PhocusWire](https://www.phocuswire.com/ai-adoption-hotels-independents-large-groups); [Hotel Investment Today](https://www.hotelinvestmenttoday.com/Asset-Management/Chains-struggle-with-AI-strategy-independents-see-fast-ROI)]

An op-ed citing the h2c 2025 data reports two European-only results: only 18% of European chains have a centralised data structure that can feed AI tools, and European chains rank ease of integration (79%) well above ROI potential (58%) as an investment criterion. [secondary: [Hospitality Net, "The Confidence Gap"](https://www.hospitalitynet.org/opinion/4132652/ai-in-hospitality-the-confidence-gap)]

**State of Hotel AI, fall 2026**

Base: 107 hotel company leaders, Aug–Sep 2026. Respondents are led by management companies (33%) and owners or investors (28%). Global.
- 42% are confident their data is AI-ready; 48% are not.
- Barriers to getting value: change management 35%, data quality 34%, systems integration 29%. Organisational barriers together reach 67%, against 8% for limits of the AI models.
- Success drivers: experimentation 34%, team initiative 32%, workflow redesign 32%, executive mandate only 14%.
- 70% of firms that already have an AI strategy and governance say execution is still fragmented.
- 24% say AI has paid for itself; 28% say it is too early to tell.

[local: NEX-081-14/-15/-20] and [secondary: [HOTELS magazine](https://hotelsmag.com/news/hotels-are-using-more-ai-every-day-now-they-need-to-prove-it-pays-off/); [stateofhotelai.com](https://stateofhotelai.com/); [Hotel Management](https://www.hotelmanagement.net/tech/hm-location-hotel-ai-adoption-shifts-experimentation-execution)]

**Other sources**

- **Wyndham Owner Trends 2026.** Base: 325 owners and developers in the US, Canada and the Caribbean, Nov–Dec 2025. Not European. 98% have begun using AI but only 32% have embedded it across most operations. Barriers: data privacy and security 46%, investment cost 42%, integration with legacy systems 40%. [secondary: [Wyndham release via Hospitality Net](https://www.hospitalitynet.org/news/4130597.html); [Hotel Technology News](https://hoteltechnologynews.com/2026/01/research-98-of-hotels-have-begun-using-ai-but-only-32-say-its-embedded-across-most-of-their-operations/)]
- **Eurostat 2025.** Base: EU enterprises with 10 or more staff, all sectors. 48.83% of firms that considered AI but did not adopt it cite data-protection concerns. [local: EUR-001-20]
- **Food Hotel Tech barometer 2026.** Base: 444 French hoteliers who visited the trade show, so self-selected. 39% name lack of in-house knowledge as the main obstacle, up from 18% in 2025. [local: ASN-005-06]
- **Mews survey.** Base: 500+ properties worldwide; vendor-commissioned. 41% of properties have no formal AI policy. Properties with a policy report 92% strong trust in AI, against 49% for those without guidelines. [local: NEX-037-10] and [secondary: [Hotel Management](https://www.hotelmanagement.net/tech/mews-most-hoteliers-use-ai-daily-human-touch-still-matters)]
- **Mews survey of 1,000 professionals** in the UK, US, Canada, France and Germany; vendor-commissioned. 73% of AI-using respondents got wrong or incomplete results because the AI could not reach data held in other systems. [local: FAC-143-06]
- **Otelier 2026 Hotel Operations Index.** Base: owners and operators; size not found. Only 15% are very confident their operational data is accurate and timely. [secondary: [HOTELS magazine](https://hotelsmag.com/news/2026-hotel-operations-index/)]
- **PwC Middle East 2025.** Base: regional C-suite leaders. Not European; use only as a contrast. 91–94% are piloting or experimenting, depending on the summary, but only 3% have reached enterprise-wide deployment. Legacy systems, talent gaps and data privacy hold scaling back. [secondary: [PwC PDF](https://www.pwc.com/m1/en/publications/2025/docs/ai-tourism-hospitality.pdf); [Hotel Dive](https://www.hoteldive.com/news/hospitality-stakeholders-challenges-hotel-technology-pwc/692450/)]
- **Integration survey.** Base: 250+ hotel IT decision makers, global. Only 24% of hotels report fully integrated core systems. [secondary: [Hospitality Net research](https://www.hospitalitynet.org/report/4128547/research-fewer-than-one-in-four-hotels-have-fully-integrated-core-systems)]
- **PMS openness.** The AI Hospitality Alliance (AIHA) and HotelLogic "PMS API Power Index" 2026 finds that only 7% of PMS companies provide fully public API documentation. AIHA is an industry body with its own interests. [secondary: [Hospitality Net](https://www.hospitalitynet.org/news/4134375/landmark-study-finds-only-7-pms-companies-provide-fully-public-api-documentation)]
- **Academic.** Two studies came up:
  - a 2025 *Tourism and Hospitality* (MDPI) study of micro and small hospitality firms in Slovenia, linking AI adoption to organisational traits and managers' attitudes [secondary: [doi 10.3390/tourhosp6050268](https://doi.org/10.3390/tourhosp6050268)];
  - a 2026 qualitative meta-synthesis of 10 SME studies, which finds adoption "cannot be explained by cost, readiness, or perceived usefulness alone" [secondary: [Springer, ITT](https://link.springer.com/article/10.1007/s40558-026-00422-x)].
- **Albania (local).** Base: 1,671–1,821 accommodation providers; peer-reviewed. Intention to invest did not translate into use; organisational readiness did. [local: HTC-003-16]
- **Managers' mindset (local).** Base: 747 hotel managers in five European countries. Managers' cognitive flexibility, not hotel size, was linked to higher perceived AI impact. [local: NEX-023-03/-04]

### Inferences
- **Knowledge comes before technology.** The European small-hotel base (HES-SO) puts lack of knowledge first. The chain base (h2c, State of Hotel AI) puts expertise, integration, data and change management first. Cost is no longer the top barrier in Europe.
- **The tool has no knowledge gate.** Its six gates contain nothing about knowledge, such as "can you name the alternatives and judge the vendor" (P2 and O4). Yet that is the most cited barrier. It works more as a pre-condition for answering the gates honestly than as a gate itself.
- **Organisation outweighs the model.** Workflow redesign (32%) and experimentation (34%) beat executive mandate (14%) as success drivers. This argues that O1, a top-management plan, should stay light (one page) and not grow into a formal strategy requirement.

### Gaps
- No survey limited to European chains in 2026 was found. Both h2c and State of Hotel AI are global.
- The HES-SO n per question, and its barrier split by independent versus chain, could not be checked: the PDF host is blocked.
- No HOTREC survey of AI barriers was found. HOTREC's visible AI output is policy: a Dec 2025 joint statement against new EU workplace-AI legislation, noting that 9 in 10 hospitality businesses are micro-enterprises [secondary: [Journal des Palaces](https://www.journaldespalaces.com/en/pressrelease-76860-calling-for-a-balanced-and-non-legislative-approach-on-ai-at-work.html)].
- No hotel-specific McKinsey or Deloitte figures were found in the time available. The team holds one McKinsey claim, cited by a conference speaker with no base: moving a pilot into production "can nearly quadruple" AI spend [local: WEB-004-01]. Do not use it as a headline figure.

---

## 2. What makes hotel AI pilots fail or succeed when scaling? Named cases

### Takeaway
Pilots are easy and scaling is hard. Most hotel companies pilot, but only a minority embed AI in operations. Industry estimates put the embedded share at about 30%, and only 13% of chains measure a return. The named cases point to the same success factors:
- data fixed first;
- the process redesigned rather than automated as it is;
- staff keep the right to override;
- a few priority projects with a quantified return;
- a central team plus local champions.

Regulatory blockers (works councils, GDPR) are real in Europe but rarely show up in surveys. They surface in legal sources and in the team's AI Act research.

### Cited findings

**Size of the pilot-to-scale gap**
- Accor's SVP Data Science & AI, Nicolas Maynard (the team's interviewee on 19 Nov), is quoted by Skift as saying that more than 90% of hospitality companies are piloting AI but only about 30% have embedded it into operations, "particularly across Europe's fragmented" market. He also said scaling AI is "a cultural transformation", not a technology deployment. The base of the 90%/30% figure is not given, so treat it as an expert estimate. [secondary: [Skift preview](https://skift.com/2026/09/28/skift-data-ai-summit-europe-preview-accor-nicolas-maynard/); [Skift on X](https://x.com/skift/status/2104934304526549035)]
- At a Skift summit, a Skift–Google session said pilots are easy and production is hard, with people and workflow as the barriers rather than model capability. [secondary: [letsdatascience summary](https://letsdatascience.com/news/marriott-and-google-discuss-ai-production-challenges-88683553)]

**Failure case: Marriott**
- **Staff acceptance and override.** Marriott's first room-assignment pilot failed because staff overrode every assignment. It worked only after rework, with the override kept. [local: SKF-042-02] and [secondary: [Hospitality.today](https://www.hospitality.today/article/how-marriott-is-using-ai-to-rethink-room-assignments)]
- **Data.** Marriott's early AI personalisation reportedly underperformed because the data was not structured for machine inference. Its lesson was to re-engineer processes and to start with low-risk internal cost savings. [secondary, blog-level: [Actabl](https://actabl.com/blog/the-year-of-operational-ai/); [influencers-time](https://www.influencers-time.com/hilton-marriott-bookingcom-ai-data-lessons-for-creators/)]

**Success cases**
- **Accor (Europe).**
  - Ran a year-long conversational AI pilot with more than 1 million guest conversations, Jul 2025–Sep 2026 [secondary: [HospitalityTech](https://hospitalitytech.com/what-accor-learned-its-1m-conversation-ai-pilot)].
  - Narrowed broad experimentation to two or three projects with ROI potential [local: SKF-017-13].
  - Runs a central GenAI Centre of Excellence plus regional GenAI ambassadors [local: SKF-021-03].
  - Makes reskilling central to its AI adaptation [local: FAC-394-06/-07].
- **Meliá (Spain).**
  - No AI initiative scales without a quantified, validated return [local: FAC-199-07].
  - Every use case is reviewed from business, technology, risk, cybersecurity and compliance angles [local: FAC-199-08].
  - Hotel content is kept complete and AI-readable [local: NEX-294-04].
- **IHG.**
  - A USD 12m set-up cost for a programme including AI was paid back within 12 months [local: FAC-255-01].
  - Cloud PMS rolled out in 2,000 hotels, with 4,000 targeted by end-2026 [local: FAC-255-05].
  - Major technology is funded through the owner-financed system fund [local: FAC-272-09].
  - Has an AI Steering Committee [local: ANR-007-07].
- **Club Med.** Its AI transformation began with a full rebuild of its data infrastructure [local: LNK-002-01].
- **PPHE.**
  - Migrating to an Oracle cloud PMS, with a secondary high-availability cloud for AI workloads [local: FAC-279-01/-16].
  - Brought in a business-wide policy on internal AI use in 2025, against "shadow AI" [local: FAC-279-13].
- **Strawberry (Nordics).** Replaced 25–30 systems across 250 hotels in about 18 months; the legacy systems could not support AI tools [local: SKF-017-16].

**Factor by factor**

| Factor | Evidence |
|---|---|
| Data quality and integration | 42% data-confident; 73% wrong results from unreachable data; 24% fully integrated core systems; 7% of PMS vendors publish full API documentation (all cited above). The most consistent scaling blocker. |
| Ownership and operating model | Central team plus local champions at Accor and IHG; a named owner [local: HYB-070-12, SKF-033-06]. Marriott posted 15 AI roles; Hilton shows 3 AI roles but 41 live use cases, read as delivery through vendors [local: SKF-033-01/-03, Skift analysis of c.170 job postings]. |
| Budget | 11% of chains have a dedicated AI budget [local]. Running costs grow from pilot to production [local: WEB-004-01, base not stated]. |
| KPIs and ROI | 13% of chains report a measurable return (h2c 2026); 24% say AI has paid for itself (State of Hotel AI); only 27% of chains that track ROI do so consistently [local]. |
| Staff acceptance and works councils | Germany: the works council co-determines the introduction of any technical device suitable for monitoring staff (§ 87(1) No. 6 BetrVG), whether or not monitoring is intended. Lawyers advise early involvement. A Hamburg labour-court case saw a works council demand that ChatGPT use be suspended until a group agreement was in place (not a hotel). A vendor page lists automated shift planning in hotels as needing co-determination before introduction. [secondary: [CMS](https://cms.law/de/deu/legal-updates/einfuehrung-von-ki-im-unternehmen-einbindung-des-betriebsrats); [Taylor Wessing, 24 Jun 2026](https://www.taylorwessing.com/de/insights-and-events/insights/2026/06/ki-als-arbeitsmittel-warum-die-mitbestimmung-frueh-mitdenken); [KI-Syndikat hotel use case](https://www.ki-syndikat.de/usecases/hotel/06-prognose-personalbedarf/)] Under the AI Act, Art. 26(7) obliges employers to inform workers' representatives before using a high-risk system at work, from 2 Dec 2027. Today, works councils and data protection authorities are the live enforcers. [local: deep-dive lines 102, 146, 427] No hotel-specific works-council dispute was found. |
| Vendor lock-in and exit | Commentary argues that closed or costly PMS APIs limit hotels to what the vendor builds, and that data-portability clauses (export format, retrieval time, capped fees) protect against lock-in. Mostly opinion and vendor-affiliated material. [secondary: [Hospitality Net, PMS opinion](https://www.hospitalitynet.org/opinion/4132902/the-problem-with-pmss-how-to-approach-choosing-new-hotel-tech); [Hospitality Net, AI agent trap](https://www.hospitalitynet.org/opinion/4131969/the-ai-agent-trap-why-hospitalitys-next-technology-crisis-is-already-in-motion); [Hotel-Online, data ownership](https://www.hotel-online.com/index.php/news/who-owns-the-data-and-data-taxes)] No survey on how often hotels negotiate exit terms was found. |
| Regulation and GDPR | Privacy and security rank among the top three barriers for chains (29%, h2c 2026) and first for owners (46%, Wyndham, non-European). For EU firms in general, it is the main reason for non-adoption (48.83%, Eurostat). A hotel deploying vendor AI owes four live AI Act duties today; DPIA and works-council involvement come from GDPR and labour law, not the AI Act [local: deep-dive line 43]. |

### Inferences
Scaling fails on data, integration, unclear ownership and the absence of a measured return far more often than on the AI itself. Successful groups share four habits:
- they fix data and systems first (Club Med, Strawberry, IHG, PPHE);
- they choose a few projects with a quantified return (Accor, Meliá);
- they keep human override (Marriott);
- they review each use case for risk (Meliá).

### Gaps
- No named European hotel case of a pilot stopped by a works council or a data protection authority was found.
- No figures on how much running costs grow from pilot to scale in hotels.
- No survey data on vendor exit clauses.

---

## 3. Judgement on the six gate questions

### Takeaway
All six gates are supported by evidence as things that matter. F2 (KPI baseline), D5 (lawful basis and data agreement) and P1 (named owner) are the strongest must-haves before a pilot. T1 and F1 are right in substance but too rigid as written:
- T1 is not relevant to standalone "light" tools, and its proof ("live test, not a demo") is partly what a pilot is for.
- F1 asks small hotels for a 12-month, four-part budget when they actually pay EUR 20–50 a month in subscriptions.

O1 is reasonable if it stays one page. The evidence ranks executive mandate low and workflow redesign high.

Two common real-world blockers are missing as gates:
1. Consulting staff representatives where the tool touches staff (a legal pre-condition in Germany and elsewhere).
2. Vendor data terms and exit or portability.

Both are better added as conditional gates or folded into the proof of D5, than added as universal gates.

### Gate by gate

| Gate | Evidence it is a must-have before piloting | Verdict | Too strict for small independents? |
|---|---|---|---|
| **P1** Named owner with time | The tool rates this need Moderate [local: HYB-070-12, SKF-033-06]. Accor and IHG set up central teams with local champions. Hilton delivers 41 use cases through vendors with 3 AI roles, so the owner does not need to be a specialist. | **Keep.** Cheap, and it addresses "fragmented execution" (70% of firms with a strategy, State of Hotel AI). | Slightly. "Hours per week in writing" is bureaucratic for a 31-room hotel. Accept "GM or one manager, named, with vendor support" as Yes. |
| **F1** 12-month budget, four cost types | The tool rates the full-cost budget Moderate [local]. Only 11% of chains have a dedicated AI budget, and cost as a barrier fell from 61% to 35% (HES-SO). 58.6% of French hoteliers spend at least EUR 20 a month and almost a quarter more than EUR 50 [local: ASN-005-05]. The four-part split fits Moderate and Heavy tools. | **Keep, make it proportional.** Light tools: "known monthly cost and who pays" (merge F4) is enough for Yes. Moderate and Heavy: the full four-part budget. | **Yes as written.** It would fail most independents adopting a subscription chatbot. |
| **F2** KPI baseline | Rated Strong [local: SKF-008-36, NEX-081-21, NEX-188-11, FAC-199-07]. Only 13% of chains report a measurable return, 24% say AI has paid for itself, and only 27% of ROI-tracking chains do it consistently. Meliá's rule of no scaling without a validated return depends on it. Owners want proof (State of Hotel AI framing). | **Keep. Strongest gate.** Pair it with F3 (stop/scale rule), which "Ready to pilot" already assumes. | No. A simple baseline (e.g. average email response time this month) is cheap. Give small-hotel examples. |
| **T1** Two-way data exchange | Rated Strong. 70% of chains name integration as their top purchase criterion. 73% got wrong results from unreachable data (vendor survey). 24% have fully integrated core systems; 7% of PMS vendors publish full API documentation. | **Keep for Moderate and Heavy tools; allow N/A for Light tools** that need no system link (review-reply drafting, content writing, internal GenAI). Change the proof to "vendor-certified integration with your PMS/POS version plus a sandbox or reference-site test". A full live test is the pilot itself. | Partly. All-in-one platforms solve this for small hotels. The tool's own small-hotel route says "check the connection before buying", which fits. |
| **D5** Lawful basis plus data agreement | A legal must-have under the GDPR whenever personal data is processed by a vendor. Data protection is the top non-adoption reason for EU firms (48.83%, Eurostat). Privacy is in the chains' top three (29%). Data protection authorities are the live enforcer [local deep-dive]. | **Keep, and widen the proof:** signed data-processing agreement, lawful basis recorded, **plus** clauses saying the hotel owns its data, can export it at exit, and controls whether the vendor trains models on it. DPIA where processing is high-risk (staff monitoring, biometrics, profiling). | No, it is the law. Give a plain-language checklist. |
| **O1** Approved one-page plan linking to a goal | Rated Strong as "leadership sponsorship plus written plan" [local]. Only 28% of chains and 9% of small hotels have a strategy. But executive mandate is cited as a success driver by only 14%, against 32% for workflow redesign. The Albanian study shows organisational readiness, not intention, predicts use. | **Keep, light.** It overlaps F2 (KPI) and P1 (owner). Consider making the "plan" the same page that records owner, KPI baseline and stop rule. In managed or franchised hotels, require the owner's sign-off here: fold in O3. | No if kept to one page. In an owner-run independent hotel, the GM is the approver. |

### Common blockers missing as gates

1. **Staff representatives consulted, where the tool touches staff.** Examples: scheduling, performance, monitoring, kitchen cameras, recruitment. In Germany, co-determination under § 87(1) No. 6 BetrVG applies before introduction, and without an agreement use can be unlawful [secondary: CMS, Taylor Wessing]. The AI Act adds an information duty (Art. 26(7)) for high-risk staff tools from 2 Dec 2027 [local]. Marriott's override failure shows the acceptance cost.

   **Recommendation:** make this a **conditional gate**, triggered by the "sensitive data" or staff-facing add-on. Today it is a core question only. Asking it of every hotel would be too strict, because many small hotels have no works council.

2. **Vendor contract, exit and data portability (with T5 fallback).** The evidence is mostly opinion and vendor-affiliated (secondary), plus the fact that only 7% of PMS vendors publish full API documentation.

   **Recommendation:** fold this into D5's proof (data ownership, export, training use) and T1's proof. Do not add a separate gate.

3. **GDPR DPIA.** Only for high-risk processing.

   **Recommendation:** keep it in the sensitive-data add-on, but make it gate-level when the add-on applies.

4. **Stop/scale rule (F3).** "Ready to pilot" in the tool's own levels already requires "a KPI baseline and a stop rule".

   **Recommendation:** merge F3 into F2's proof ("baseline plus target plus stop date") rather than adding a seventh gate.

5. **Human override and oversight (P5 and G3) for tools that act alone.** Marriott's case and AI Act Art. 26 (from Dec 2027 for high-risk tools) support this.

   **Recommendation:** make it a conditional gate under the "acts alone" add-on.

6. **AI literacy (Art. 4, live since 2 Feb 2025).** A legal duty, but only to "take measures"; it carries no EU-level fine [local deep-dive line 131]. Knowledge is also the most cited barrier.

   **Recommendation:** not a gate. Keep it as a core question (P2 and P3). Note in the result that doing nothing is non-compliant.

### Inferences
- **Six gates is a reasonable number.** Turning them into "universal plus conditional" gates would keep them small for light tools and strict for risky ones.
- **The threshold of "Partly" plus proof is sensible** given the evidence that hotels overstate their readiness (belief section of the tool).
- **The gate list itself is team judgement.** No external framework found validates exactly these six. The tool's `limits` already say the 40%/75% thresholds are untested, and the same applies here.

### Gaps
- No published hotel AI readiness framework with empirically validated gates was found to compare against.
- The legal statements on works councils outside Germany (France CSE, Austria, the Netherlands) were not checked in this round.

---

## 4. What differs between chains, independents and franchised or managed hotels?

### Takeaway
- **Independents** are short of knowledge and time, pay monthly subscriptions and depend on what their platform vendor builds. Some evidence says they get a faster return from narrow tools.
- **Chains** are short of data unification, integration, strategy and measured return.
- **Franchised and managed hotels** add a three-way decision and funding path (owner, brand, operator). The evidence on this is thin and mostly US-based.

### Cited findings

**Independents**
- Make up 82% of the HES-SO base, with a median of 31 rooms. Knowledge (39%) and cost (35%) are their leading barriers [local: ASN-001].
- Recommended route: plug-and-play tools plus training [secondary: [HES-SO news](https://www.hevs.ch/en/news/how-ai-is-and-isn-t-transforming-european-hospitality-212299)].
- A TakeUp survey of about 200 independent owners and managers (not European-specific; vendor) reports that 74.5% of independents using AI report positive results. Commentary claims independents get a faster return through targeted adoption [secondary: [PhocusWire](https://www.phocuswire.com/ai-adoption-hotels-independents-large-groups)].
- Routes that suit them: association or council-funded workshops [local: FAC-150-01, ASHAL Almería, 50+ owners and staff]; a free public platform (Spain, ITH) [local: FAC-179-01]; vendors digitising legacy data [local: SKF-014-04, Amenitiz].

**Chains**
- 91% use AI, 28% have a senior-led strategy, 13% have a measurable return, and they rate their own know-how at 3.4 out of 10 (h2c 2026, 113 chains) [local].
- Only 18% of European chains have a centralised data structure (h2c 2025) [secondary].
- Only 8 of 86 hotel companies use a customer data platform [local: HYB-098-05].
- Specialist roles appear only at scale [local: SKF-033].

**Franchised and managed hotels**
- Major technology is funded through the owner-financed system fund at IHG [local: FAC-272-09].
- The tool notes the need for a clear decision path including owners [local: HYB-213-01, ANR-001-04, HYB-193-08; strength Moderate].
- Owners want more guidance from brands and rank technology behind staffing, property improvements and sales and marketing: 19% prioritise technology in 2026. Base: Wyndham, 325 North American owners [secondary: [Hospitality Net](https://www.hospitalitynet.org/news/4130597.html)].
- State of Hotel AI respondents are led by management companies (33%) and owners or investors (28%). Only 24% say AI has paid for itself, framed as a capex request "no owner would approve" [secondary: [HOTELS magazine](https://hotelsmag.com/news/hotels-are-using-more-ai-every-day-now-they-need-to-prove-it-pays-off/)].
- From the team's AI Act work, AI Act duties fall on the deployer. A management company can carry out oversight while the deployer stays answerable. The register must record operator, owner and employer per property [local: deep-dive line 107; register design line 76].

### Inferences
- **For independents:** F1 and T1 should accept subscription and all-in-one routes. P1 should accept the GM as owner.
- **For managed and franchised hotels:** O1 needs the owner's approval, not only the operator's (fold in O3). F1 should accept "funded via system fund or brand programme". D5 should state who signs the data agreement and is the GDPR controller (brand, operator or owner), because this is often unclear.
- **For chains:** the gates are easy to meet at group level. The risk is meeting them centrally and not per property. The tool's rule of one assessment per use case should apply per property for scale decisions.

### Gaps
- No European survey splitting AI readiness by franchised, managed and owner-operated hotels was found. Evidence on brand mandates and franchise-agreement terms for AI is missing; it would need franchise disclosure documents or owner-association sources.
- No figures on how AI budgets or approvals flow in European managed-hotel contracts.
