# Technology-adoption and organisational-readiness frameworks, mapped onto the hotel AI readiness tool

Research notes, 18 Nov 2026. Scope: what the main adoption and readiness frameworks say matters, what empirical AI studies (incl. hospitality) find significant, and how the team's readiness tool (`tools/readiness/index.html`, data block `rdy`) covers it.

**Source caveat (read first).** In this session, full-text fetching was blocked for every academic host tried (core.ac.uk, aisel.aisnet.org, pmc.ncbi.nlm.nih.gov, elsevier.es, hevs.ch, hotellerie.de, sintef.brage.unit.no). All web material below therefore comes from **search-result summaries and abstracts** and is marked **(secondary)**. Before any figure or claim goes into the report, it must be checked against the original paper (DOIs given). Items marked **(not re-verified)** are standard textbook content of the original framework that the search summaries did not confirm word for word. The tool data was read directly from the repository and is **primary**.

---

## 1. What do the frameworks say drives adoption and success?

### Takeaway
Two kinds of models exist. Firm-level models (TOE, Diffusion of Innovations, AI-readiness and AI-capability frameworks) put weight on **technology fit, management support, resources/skills, data, culture and the outside environment** (competitors, customers, regulators, vendors). Individual-level models (TAM, UTAUT/UTAUT2) and Weiner's readiness theory add **whether the people who must use the tool believe in it and feel able to use it**. A resource checklist covers the first group's internal factors well. The environment and the staff-belief side are where gaps usually appear.

### Cited Findings

**Overview / reviews**
- Oliveira & Martins (2011), "Literature Review of Information Technology Adoption Models at Firm Level", *Electronic Journal of Information Systems Evaluation* 14(1), 110–121: reviews firm-level adoption theory and singles out two dominant models, Diffusion of Innovation (DOI) and TOE. They note that most empirical firm-level studies derive from TOE and DOI (secondary) — [IHMT record](https://www.ihmt.unl.pt/publications/3741/); [Rankless entry](https://alpha.rankless.org/hit-papers/w7746228); claim about "most studies" via [arXiv 1406.1469](https://arxiv.org/pdf/1406.1469)
- In DOI at firm level, Oliveira & Martins summarise that individual (leader) characteristics, internal organisational structure and external characteristics are antecedents of organisational innovativeness (secondary) — [IHMT record](https://www.ihmt.unl.pt/publications/3741/)

**TOE (Tornatzky & Fleischer 1990, *The Processes of Technological Innovation*)**
- TOE says three contexts shape how a firm adopts and implements a technological innovation: technological, organisational and environmental (secondary, via Oliveira & Martins summary) — [IHMT record](https://www.ihmt.unl.pt/publications/3741/)
- Typical variables in each context (not re-verified): technology = relative advantage, compatibility, complexity, availability; organisation = size, top-management support, slack resources, technical competence, structure; environment = competitive pressure, trading-partner/customer pressure, government regulation and support, vendor/external support. The empirical hotel studies in section 2 use exactly these environment variables, which supports this reading.

**Diffusion of Innovations (Rogers)**
- Five perceived attributes drive adoption intention: relative advantage, compatibility (with values, needs, past experience), complexity, observability (results visible to others) and trialability (can be tried first). Moore & Benbasat (1991) later added image and voluntariness (secondary) — [search summary citing Rogers 2003 and Moore & Benbasat](https://link.springer.com/article/10.1007/s10796-017-9774-y)

**TAM (Davis 1989) and UTAUT/UTAUT2 (Venkatesh et al. 2003; 2012)**
- UTAUT unified eight earlier models (incl. TRA, TAM, TPB, IDT), adds four moderators (gender, age, experience, voluntariness), and explained about 69% of variance in usage intention in its original test, 70% in cross-validation (secondary) — [Venkatesh et al. 2003, SSRN abstract](https://papers.ssrn.com/abstract=3375136); [constructDB entry](https://verdi.cs.ucl.ac.uk/constructDB/publications/venkatesh-user-2003.html)
- The four UTAUT determinants are performance expectancy, effort expectancy, social influence and facilitating conditions; UTAUT2 adds hedonic motivation, price value and habit. TAM's two core beliefs are perceived usefulness and perceived ease of use (not re-verified; the search summary did not list them) — [Venkatesh 2003 PDF](https://eclass.hmu.gr/modules/document/file.php/DSH314/006%20%CE%97%CE%B3%CE%B5%CF%83%CE%AF%CE%B1%20%CE%BA%CE%B1%CE%B9%20%CE%B1%CE%BB%CE%BB%CE%B1%CE%B3%CE%AE%2014%20%CE%99%CE%B1%CE%BD%202026/Venkatesh%202003_UTAUT.pdf)

**Organisational readiness for change (Weiner 2009, *Implementation Science* 4:67)**
- Readiness is a shared psychological state: members are **committed** to the change (change commitment) and **confident** in their collective ability to carry it out (change efficacy) (secondary) — [Implementation Science PDF](https://implementationscience.biomedcentral.com/track/pdf/10.1186/1748-5908-4-67)
- Commitment rests on **change valence** (do people value this particular change). Efficacy rests on members' appraisal of task demands, resource availability and situational factors (secondary) — [same](https://implementationscience.biomedcentral.com/track/pdf/10.1186/1748-5908-4-67)
- Structures and resource endowments shape readiness perceptions but are not readiness itself. Higher readiness is expected to bring more effort, persistence and cooperative behaviour, so implementation works better. Shea et al. (2014) later built a reliable measure of commitment and efficacy (secondary) — [same](https://implementationscience.biomedcentral.com/track/pdf/10.1186/1748-5908-4-67); [NCCMT summary](https://www.nccmt.ca/knowledge-repositories/search/242)

**AI readiness: Jöhnk, Weißert & Wyrtki (2021), *Business & Information Systems Engineering* 63(1), 5–20, DOI 10.1007/s12599-020-00676-7**
- Built from interviews with 25 AI experts, triangulated with the literature. Result: 18 readiness factors in five categories, operationalised by 58 indicators (secondary) — [IDEAS/RePEc](https://ideas.repec.org/a/spr/binfse/v63y2021i1d10.1007_s12599-020-00676-7.html); [supplementary table](https://www.springerprofessional.de/resource/supplementary/12599_2020_676_MOESM1_ESM.pdf/18708260)
- The five categories are **strategic alignment, resources, knowledge, culture and data** (secondary) — [search summary of BISE paper](https://aisel.aisnet.org/bise/vol63/iss1/2)
- Strategic alignment = tight link between organisational priorities and processes and the AI adoption effort; resources = dedicated financial, personnel and infrastructure support; one strategic-alignment indicator concerns use-case discovery methods (secondary) — [supplementary table](https://www.springerprofessional.de/resource/supplementary/12599_2020_676_MOESM1_ESM.pdf/18708260); [AIS record](https://aisel.aisnet.org/bise/vol63/iss1/2)
- The authors call AI readiness and AI adoption research "still in its infancy" (secondary) — [Deutsche Digitale Bibliothek record](https://www.deutsche-digitale-bibliothek.de/item/RTXVAXMSSWBWHDRMQSAXSLRQBSWUIBR7)

**AI capability: Mikalef & Gupta (2021), *Information & Management* 58(3), 103434, DOI 10.1016/j.im.2021.103434**
- Grounded in the resource-based view; defines AI capability as a firm's ability to select, organise and use AI-specific resources, grouped as tangible, human and intangible; finds AI capability linked to organisational creativity and firm performance (secondary) — [NTNU record](https://ntnuopen.ntnu.no/ntnu-xmlui/handle/11250/2980958?show=full); [Frontiers paper citing it](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.884830/full)
- Commentary on the paper stresses interdepartmental coordination (so data flows and solutions match business needs), managerial as well as technical skills, and a culture that accepts risk ("risk proclivity") (secondary) — [ESCP Impact Paper / The Choice summary](https://escp.eu/thechoice/tl-dr/four-non-tech-conditions-for-ai-to-improve-performance/)
- Commonly cited breakdown (not re-verified; search did not confirm the full list): tangible = data, technology, basic resources (time, funding); human = technical skills, business (managerial) skills; intangible = interdepartmental coordination, organisational change capacity, risk proclivity.

### Inferences
- Across the frameworks there are five recurring families: (1) technology fit (advantage, compatibility, complexity, trialability), (2) leadership and strategic alignment, (3) resources, skills and data, (4) people's belief and confidence (valence, performance/effort expectancy, culture), (5) outside pressure and support (competitors, customers, regulators, vendors).
- Weiner's point matters for the tool's design: resources are an *input* to readiness. A resource checklist measures capacity but not commitment.

### Gaps
- Full texts of Jöhnk et al. (all 18 factors) and Mikalef & Gupta (exact resource list and measurement items) could not be opened; the factor lists need checking against the PDFs before being quoted.
- Tornatzky & Fleischer (1990) is a book; no accessible copy was found in this session.

---

## 2. Which factors are consistently significant in empirical studies, and which do practitioner tools often miss?

### Takeaway
In AI and hospitality studies, **top-management support** and **competitive pressure** come out significant most often, followed by **skills/knowledge**, **technology infrastructure and compatibility**, **vendor/external support** and **regulatory support**. **Cost is mixed**: hoteliers name it as a top barrier in surveys, but in at least one structural model it had no significant effect. **Employee acceptance** shows up as significant in hotel-employee studies. Reviews point out that data and management support are often missing from SME AI frameworks, and practitioner checklists tend to drop the environment entirely.

### Cited Findings

**Hospitality and tourism**
- IJCHM study of AI adoption in hospitality during COVID-19 (TOE, PLS-SEM plus neural networks; DOI 10.1108/IJCHM-04-2022-0433): perceived AI risk, management support, innovativeness, competitive pressure and regulatory support significantly affect AI adoption performance; **competitive pressure and management support are among the strongest** (secondary) — [Emerald abstract](https://emerald.com/insight/content/doi/10.1108/IJCHM-04-2022-0433)
- AL-Khatib (2024), *Management Decision*, generative AI in Jordanian hospitality (TOE): competitive pressure, government regulation support and **vendor support** significantly influence adoption; technological complexity has a negative effect; **cost has no significant effect** (secondary) — [Emerald, MD-09-2023-1525](https://www.emerald.com/insight/content/doi/10.1108/MD-09-2023-1525/full/html)
- Khlusevich & Schegg (2023), HES-SO Valais: online survey of hotels in Austria, France, Germany, Greece and Switzerland, run via hotel associations and framed with TOE; chain, higher-star and larger hotels adopt AI more readily than small ones (secondary) — [OEHV-hosted report](https://www.oehv.at/fileadmin/user_upload/MediaLibrary/Bilder/Grafiken_Presse/Khlusevich_Schegg_2023_AI_adoption_in_European_Hotels_October_2023.pdf). Search summaries give the sample as 1,115 hotels; check against the report before use.
- A related Khlusevich, Inversini & Schegg interview study (TOE) lists as brakes: lack of knowledge of AI's real benefits, too few human and financial resources, and a wish to keep the human element in service (secondary) — [same report family, search summary](https://www.oehv.at/fileadmin/user_upload/MediaLibrary/Bilder/Grafiken_Presse/Khlusevich_Schegg_2023_AI_adoption_in_European_Hotels_October_2023.pdf)
- Schegg (2025) follow-up, European hotels: top challenges are lack of awareness of available AI solutions (39%), high set-up costs (35%) and technical complexity (34%); barriers lower than in 2023 but still significant for small operators; hotels ask for trusted, vendor-neutral guidance, best practice and training (secondary; percentages from search summary, base not confirmed) — [HES-SO 2025 report](https://www.hevs.ch/media/document/22/schegg-2025-ai-adoption-in-european-hotels-03072025.pdf?cb43600d9790df7f71d3097ed265ff6b=hotelhouse); [Hospitalitynet opinion piece](https://www.hospitalitynet.org/opinion/4128078.html). A companion "AI Readiness in Hotels" report by Britz & Schegg (2025) exists — [hotellerie.de copy](https://www.hotellerie.de/fileadmin/user_upload/Britz_Schegg_2025_AI_Readiness_in_Hotels.pdf) — but could not be opened (the tool already cites HES-SO/Britz 2025 as ASN-002-04).
- Godolja, Sevrani et al. (2025), *Tourism and Hospitality* (MDPI) 6(4):187, 1,820 Albanian accommodation providers, TOE + TAM + DOI: competitive pressure in the environment strongly raised perceived usefulness (secondary) — [MDPI](https://www.mdpi.com/2673-5768/6/4/187)
- Jerez-Jerez (2024), *International Journal of Hospitality Management*: new instrument given to 1,600 employees of independent US hotels; **employee readiness and acceptance of AI significantly affect AI adoption** and also raise employee optimism, satisfaction and engagement (secondary) — [Bedfordshire research portal](https://researchportal.beds.ac.uk/en/publications/a-study-of-employee-attitudes-towards-ai-its-effect-on-sustainabl-4/)
- Gajić et al. (2024), *Sustainability* 16(8):3172, modified UTAUT with Serbian hotel employees (SEM): behavioural intention and **habit** strongly drive AI use; facilitating conditions have a smaller measurable effect; social influence, hedonic motivation, performance and effort expectancy had little influence in that sample (secondary) — [MDPI](https://mdpi.com/2071-1050/16/8/3172). The project already holds this paper's full text (claude/Lit_Gajic_2024_… docs per PROJECT_CONTEXT), so these results can be confirmed from there.
- Luxury-hotel employee study (Egypt): staff are ambivalent about AI; perceived organisational support, social influence, functional benefits, strategic advantage and usefulness drive intention to use (secondary; lower-tier journal) — [EKB journal](https://thalexu.journals.ekb.eg/article_362884.html)
- Guest side: an IJCHM study examines hotel guests' acceptance of AI acting on their behalf ("technology agency"), and an IJHM meta-UTAUT study (2025) covers guest acceptance of service robots, so guest acceptance is a researched adoption condition in its own right (secondary; findings not seen) — [IJCHM-08-2022-1041](https://emerald.com/insight/content/doi/10.1108/IJCHM-08-2022-1041/full/pdf); [Debrecen repository](https://dea.lib.unideb.hu/items/5f30ecc9-685f-46e2-99cd-81eb0719ffd0/full)

**Cross-industry SMEs**
- A systematic review/bibliometric analysis (Ayinaddis, *Journal of Innovation & Knowledge* 2025) maps ten TOE-based determinant areas for AI adoption in SMEs and large firms, including management support and market/competitive pressure (secondary) — [JIK article page](https://elsevier.es/en-revista-journal-innovation-knowledge-376-articulo-artificial-intelligence-adoption-dynamics-knowledge-S2444569X25000320)
- One review notes that a prior SME AI review found infrastructure, culture, compatibility and regulation to be key but **left out data requirements and management support** (secondary) — [search summary of reviews incl. HRMARS DOI/TOE review](https://hrmars.com/papers_submitted/24804/a-review-of-diffusion-of-innovations-theory-doi-and-technology-organization-and-environment-framework-toe-in-the-adoption-of-artificial-intelligence.pdf)
- South African custom-AI study: top-management support, technological competence, competitive pressure and external support significantly linked to adoption; Jordanian MSMEs (n=537): management support, perceived benefits and technology infrastructure affect intention (secondary) — [Wits repository](https://wiredspace.wits.ac.za/bitstreams/889e26c3-1d6b-4fc6-9e0e-e525e968f1a4/download); [F1000Research](https://f1000research.com/articles/14-1187/v1)
- Romanian study: perceived competitive pressure and customer pressure produce a "push-and-pull effect" on AI adoption (secondary) — [JBEM, Vilnius Tech](https://journals.vilniustech.lt/index.php/JBEM/article/download/23650/12836)

### Inferences
- **Consistently significant** (two or more independent AI or hospitality studies above): top-management support; competitive pressure; skills/knowledge (incl. knowing what exists); infrastructure/compatibility; external/vendor support; regulatory support; employee readiness/acceptance; complexity (negative).
- **Mixed**: cost. It is a top *stated* barrier (Schegg 2025: 35%) but not significant in AL-Khatib's model. One reading: cost matters as a hurdle for small hotels, but once firms decide to adopt, competitive pressure and management support decide outcomes. Keeping F1 as a gate is still defensible because the tool asks about a *complete* budget, not affordability.
- **Commonly missing from practitioner tools** (inferred from the review note above and from the tool itself): the environment (competitors, guests, brand/franchisor, vendor ecosystem, public support), and the commitment side of readiness (do staff value the change). Data and management support are missing from some academic SME frameworks; the team's tool does not have that gap.

### Gaps
- Effect sizes and sample details for the IJCHM-04-2022-0433 and AL-Khatib studies were not visible (abstracts only).
- I found no hospitality study in *Tourism Management* or JHTT through these searches that tests TOE for AI; this is a search limit, not proof none exists.
- No meta-analysis ranking AI-adoption factors across hospitality studies was found.

---

## 3. Mapping the team's tool onto the frameworks

### Takeaway
The tool is strong on the **internal TOE factors** and on Jöhnk's **strategic alignment, resources, knowledge and data** categories, with gates on the factors the literature rates highest (management support = O1; compatibility = T1; resources = F1; ownership = P1; data/legal = D5; measurable advantage = F2). It is weakest on the **TOE environment context** (competitors, guests, public support all missing; vendor partly) and on the **commitment/valence side** of Weiner and UTAUT (whether staff and guests believe in and accept the tool). It also has one empty building block: "Specialist skills" has no question attached.

### Cited Findings (tool data, primary: `tools/readiness/index.html`, `rdy` JSON)
- Six areas and their questions: People (P1, P4, P5, P6, O6); Skills (P2, P3, O4); Financial investment (F1–F5); Technology infrastructure (T1–T5); Data (D1–D5); Organisation & governance (O1, O2, O3, O5, G1–G4). 31 questions; gates P1, F1, F2, T1, D5, O1.
- Scoring rule: any gate at No or an area below 40% = "Build foundations first"; all gates met and areas 40–74% = "Ready to pilot"; 75%+ = "Ready to scale".
- 20 building blocks in 3 layers; block "Specialist domain or technical skills" (Skills, layer 2) has `codes: []`, i.e. no question checks it. O5 is attached to block "Vendor evaluation" but lives in area Organisation.
- Across 91 use cases, the questions flagged most often in `chk` are T1 (33 use cases), G3 (20), D3 (17), D1 (16), D5 (15); O6 (staff feel able to question AI) appears in only 4, P4 in 1.
- The People area's own evidence notes a Marriott room-assignment pilot that failed because staff overrode every assignment (SKF-042-02), and HES-SO 2025 finds 28% of Swiss hotels name employee resistance as a barrier (ASN-001-25) — i.e. the tool's own evidence base already shows acceptance matters.

### Mapping table

| Framework factor (source framework) | Tool coverage | Where |
|---|---|---|
| **Technology context** | | |
| Relative advantage / perceived benefit (DOI, TOE; "perceived benefits" Jordan MSMEs) | Covered | F2 baseline KPI (gate), O1 goal-linked plan (gate), F3 scale/stop rule |
| Compatibility with systems (DOI, TOE) | Covered | T1 two-way data (gate), T2 open APIs, T4 systems list |
| Compatibility with work practices/values (DOI) | Partly | O2 process redesigned; nothing on fit with service style ("human element", Khlusevich et al.) |
| Complexity (DOI; negative in AL-Khatib) | Partly | Intensity levels Light/Moderate/Heavy and 9 tool types describe it; no question asks whether the team can handle it |
| Trialability (DOI) | Covered | F3 pilot with stop rule; O4 demo on own data |
| Observability / peer proof (DOI) | Partly | O4 references; O5 peer hotels (small hotels mainly) |
| Perceived AI risk (IJCHM-04-2022-0433) | Covered | G2 risk review, G3 oversight level, G4 security, T5 fallback |
| Infrastructure availability (TOE; Jordan MSMEs) | Covered | T3 connectivity/devices, T2 |
| **Organisation context** | | |
| Top-management support (TOE; strongest in several studies) | Covered | O1 owner/top-management approved plan (gate); P6 board literacy (groups) |
| Strategic alignment (Jöhnk) | Covered | O1; use-case discovery not asked (tool assumes a chosen use case) |
| Champion / ownership | Covered | P1 named owner with time (gate) |
| Financial resources / slack (TOE; Jöhnk "resources") | Covered | F1 complete 12-month budget (gate), F4 who pays, F5 running-cost caps |
| Knowledge / AI literacy (Jöhnk "knowledge"; Schegg 2025 awareness 39%) | Covered | P2 explain tool and name an alternative, P3 training plan |
| Technical skills (Mikalef human resources; TOE technical competence) | **Missing as a question** | Block "Specialist skills" exists with no question |
| Business/managerial AI skills (Mikalef) | Partly | P2, P3 (checking output); P1 owner "combining business and technology understanding" is in the area text, not the question |
| Data quality and availability (Jöhnk "data"; Mikalef tangible) | Covered | D1 data located, D3 data-quality owner, D4 content, D2 guest profile |
| Interdepartmental coordination (Mikalef intangible) | Partly | O3 approval path (managed/franchised only); no question on IT–operations–department agreement |
| Culture: innovativeness, risk proclivity (Jöhnk "culture"; Mikalef; IJCHM innovativeness) | Partly | O6 staff feel able to test and question AI; no item on leadership tolerance for failed pilots (F3 partly) |
| Change capacity / redesign (Mikalef; Weiner task demands) | Covered | O2, P4 |
| **Environment context** | | |
| Competitive pressure (TOE; significant in IJCHM, AL-Khatib, Albania, South Africa) | **Missing** | — |
| Customer/guest pressure and guest acceptance (TOE trading-partner pressure; Romanian study; IJCHM/IJHM guest-acceptance studies) | **Missing** | D2 is data, not acceptance; nothing on guest reaction or route to a human |
| Brand/franchisor/owner requirements (TOE trading-partner pressure, hotel-specific) | Partly | O3 owner sign-off |
| Regulation: compliance (TOE) | Covered | D5 lawful basis + DPA (gate), G1 AI-use policy, G2 legal risk review; D7 governance briefing complements |
| Regulatory/government support (incentives, grants) (IJCHM; AL-Khatib) | Partly | F4 lists "grant" as a funding source |
| Vendor support (AL-Khatib; South Africa "external support") | Partly | O4 test vendor claims, T5 fallback if vendor fails, G4 vendor security; no question on vendor implementation/support capacity or data exit |
| External advice / industry bodies (Schegg 2025: demand for vendor-neutral guidance) | Covered | O5 outside help (association, adviser, peers) |
| **Individual / readiness-for-change** | | |
| Change valence / performance expectancy: staff believe it helps them (Weiner; UTAUT; Jerez-Jerez 2024) | **Missing** | P4 tells staff about freed time but does not ask whether they value the change |
| Change efficacy / effort expectancy / facilitating conditions (Weiner; UTAUT) | Covered | P3 training, O6, T3, P5 override; the whole checklist measures efficacy inputs |
| Social influence (UTAUT) | Partly | P6 leader literacy, O6 climate |
| Habit (UTAUT2; strongest in Gajić 2024) | Missing (by design) | Habit is a post-adoption effect; better handled by the pilot KPI (F2/F3) than by a pre-check question |
| Employee trust / override (hospitality evidence) | Covered | P5 override and report errors |

### Inferences
- The six gates line up well with the factors the literature finds most significant: O1 = top-management support/strategic alignment; T1 = compatibility; F1 = resources; P1 = champion; F2 = measurable relative advantage; D5 = regulation. That is a defensible, literature-backed core.
- The tool is a **capacity (change-efficacy) instrument**. By Weiner's logic it can say a hotel *is able*, not that its people *want* to, which is the failure mode in the tool's own Marriott example.
- The environment matters for *whether and why* to adopt (motivation), less for *whether a hotel can* deliver. So competitive pressure fits best as context in the result screen, not as a scored readiness item; guest acceptance and vendor support do affect delivery and belong in the scored check.

### Gaps
- No hotel study found tests the tool's exact construct set, so the mapping is conceptual, not validated. A team pilot (e.g. comparing tool results with interview outcomes) would be the first validation.

---

## 4. Recommended changes (max 5; keeps the check at 31–33 questions)

### Takeaway
Five small changes, each tied to a framework factor that is significant in the literature and missing or weak in the tool. Two are additions, three are rewordings or re-assignments, so the check stays short.

### Cited Findings (basis for each recommendation)
1. **Add a staff-belief question (People area, non-gate), or replace O6 with it.** Suggested wording: "Do the staff who will use it believe it will help them, and did some of them test it before the decision?" Basis: Weiner's change valence/commitment — [Implementation Science](https://implementationscience.biomedcentral.com/track/pdf/10.1186/1748-5908-4-67); employee readiness and acceptance significantly affect AI adoption in 1,600-employee hotel study (secondary) — [Jerez-Jerez 2024, IJHM](https://researchportal.beds.ac.uk/en/publications/a-study-of-employee-attitudes-towards-ai-its-effect-on-sustainabl-4/); tool's own SKF-042-02 (Marriott) and ASN-001-25 (28% resistance). Also attach it to more use cases' `chk` lists than O6's current 4.
2. **Add a guest-acceptance question (Data or Organisation area, applies to guest-facing uses, non-gate).** Suggested wording: "Have you checked how guests will react, and can a guest always reach a person?" Basis: customer pressure/acceptance in TOE and the Romanian push-pull finding — [JBEM](https://journals.vilniustech.lt/index.php/JBEM/article/download/23650/12836); guest-acceptance research in IJCHM/IJHM (secondary) — [IJCHM-08-2022-1041](https://emerald.com/insight/content/doi/10.1108/IJCHM-08-2022-1041/full/pdf); hoteliers' wish to keep the human element (secondary) — [Khlusevich & Schegg 2023](https://www.oehv.at/fileadmin/user_upload/MediaLibrary/Bilder/Grafiken_Presse/Khlusevich_Schegg_2023_AI_adoption_in_European_Hotels_October_2023.pdf).
3. **Widen O4 into a vendor-support question rather than adding one.** Suggested wording: "Have you tested the vendor's claims on your own data, and confirmed they will support integration and let you take your data with you if you leave?" Basis: vendor support significant in AL-Khatib 2024 (secondary) — [Emerald](https://www.emerald.com/insight/content/doi/10.1108/MD-09-2023-1525/full/html); external support significant in the South African study (secondary) — [Wits](https://wiredspace.wits.ac.za/bitstreams/889e26c3-1d6b-4fc6-9e0e-e525e968f1a4/download).
4. **Give the "Specialist skills" block a question, by rewording P2 or P3 rather than adding one.** E.g. extend P3: "…and do you have (in-house or from the vendor) the technical skills to set up and maintain it?" Basis: technical and business skills as separate human resources in Mikalef & Gupta 2021 (secondary) — [ESCP summary](https://escp.eu/thechoice/tl-dr/four-non-tech-conditions-for-ai-to-improve-performance/); technical competence significant in TOE studies (secondary) — [Wits](https://wiredspace.wits.ac.za/bitstreams/889e26c3-1d6b-4fc6-9e0e-e525e968f1a4/download). This also fixes the data gap where block `Specialist skills` has `codes: []`.
5. **Add an unscored "outside context" line to the result screen (not a question).** Ask once, at the start: "Are competitors, your brand or your owners pushing this?" and show it as context next to the verdict, plus mention public funding (F4 already lists grants). Also reword O1 to name the departments involved ("…approved by management, with IT and the department that will use it agreeing"), covering interdepartmental coordination. Basis: competitive pressure among the strongest determinants (secondary) — [IJCHM-04-2022-0433](https://emerald.com/insight/content/doi/10.1108/IJCHM-04-2022-0433); [AL-Khatib](https://www.emerald.com/insight/content/doi/10.1108/MD-09-2023-1525/full/html); [Godolja et al. 2025](https://www.mdpi.com/2673-5768/6/4/187); interdepartmental coordination in Mikalef & Gupta (secondary) — [ESCP](https://escp.eu/thechoice/tl-dr/four-non-tech-conditions-for-ai-to-improve-performance/).

### Inferences
- Do not add competitive pressure as a scored item: high pressure raises the *wish* to adopt but not the *ability*, and scoring it would push pressured hotels towards "ready" without the foundations, which conflicts with the tool's "build foundations first" logic.
- Do not make any of the additions a gate; the six current gates already match the strongest literature factors.
- Net effect: 31 → 33 questions (recs 1 and 2), or 32 if rec 1 replaces O6.

### Gaps
- All recommendation sources are secondary (abstracts and search summaries). Confirm IJCHM-04-2022-0433, AL-Khatib 2024, Jerez-Jerez 2024 and Jöhnk et al. 2021 from full text before citing them in the report. Allowing core.ac.uk, aisel.aisnet.org, pmc.ncbi.nlm.nih.gov, hevs.ch and emerald.com in the session network would let a follow-up check these.
