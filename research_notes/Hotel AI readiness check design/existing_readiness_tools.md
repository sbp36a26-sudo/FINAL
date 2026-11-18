# Existing AI and digital readiness assessment tools: benchmark for a hotel AI readiness check

*Research notes, 18 Nov 2026. Scope: how established readiness and maturity assessments work, what evidence exists on uptake and validity, and which design patterns recur. For use in redesigning a short per-use-case readiness check for hotel managers.*

**Important caveat on sourcing.** In this session every page fetch failed (hosts outside the session's allowed network: european-digital-innovation-hubs.ec.europa.eu, cisco.com, cisr.mit.edu, gartner.com, hevs.ch, hotellerie.de). All findings below come from **web search result summaries and snippets** and are marked **(secondary)**. Each one points to the primary document, which should be opened before any figure goes into the report. Items marked **(unverified, background knowledge)** are not confirmed by any source in this session. They are listed only as leads to check and must not be quoted.

---

## 1. Which AI-readiness or digital-maturity self-assessments exist, and how does each work (audience, length, dimensions, scale, scoring, output, next steps, repeatability, per-organisation vs per-project)?

### Takeaway
Ten tools are documented well enough to compare. Almost all of them assess the **whole organisation** across **5–7 dimensions** (strategy, data, infrastructure, governance, talent/skills, culture). They place the organisation in **4–5 named stages**, usually from a 0–100 score or a weighted average. None of the well-known tools assesses readiness **per use case or per project**, which is the gap a hotel per-use-case check would fill. The EU EDIH Digital Maturity Assessment is the best documented and most used public tool. It is also the only one built to be **repeated** (before and after an intervention).

### Cited Findings

**A. EU: EDIH Digital Maturity Assessment Tool (DMAT), JRC / European Commission**
- Audience: SMEs and public sector organisations (PSOs) that are customers of European Digital Innovation Hubs. Developed by the Joint Research Centre. It also serves as a policy monitoring tool for the EDIH network. (secondary) [EDIH: Overview DMAT](https://european-digital-innovation-hubs.ec.europa.eu/knowledge-hub/guidance-documents/overview-digital-maturity-assessment-tool-dmat); [Digital Skills & Jobs platform: Online DMA for EDIHs](https://digital-skills-jobs.europa.eu/en/inspiration/good-practices/online-digital-maturity-assessment-edihs)
- Format: an expert-assisted self-assessment. The SME questionnaire (v2.1, Feb 2024) is a 10-page PDF that is public. Only authorised EDIH members can use the full online tool. (secondary) [DMA Questionnaire for SMEs v2.1 (PDF)](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2024-02/DMA%20Questionnaire%20for%20SMEs_EDIH_network_EN_v2.1.pdf); [DMA FAQ](https://european-digital-innovation-hubs.ec.europa.eu/faq/dma-frequently-asked-questions-faq)
- Dimensions: six, covering Digital Business Strategy, Digital Readiness, Human-centric digitalisation, Data management, and Automation & AI. The SME questionnaire also covers cybersecurity and GDPR compliance within data. (secondary) [EDIH Overview DMAT](https://european-digital-innovation-hubs.ec.europa.eu/knowledge-hub/guidance-documents/overview-digital-maturity-assessment-tool-dmat). The sixth dimension is probably "Green digitalisation" (unverified, background knowledge; check in the questionnaire PDF). An older Feb 2023 presentation used different categories (intelligence, connectivity, flexibility, automation) and is superseded. (secondary) [DMA tool presentation, 16 Feb 2023](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2023-02/dma_tool_16.02.2023_presentation.pdf)
- Scoring: each question is rated 0–10, and each dimension is scored 0–100. The tool gives an overall score and a score per dimension. The SME and PSO versions use different scoring rules. (secondary) [EDIH Overview DMAT](https://european-digital-innovation-hubs.ec.europa.eu/knowledge-hub/guidance-documents/overview-digital-maturity-assessment-tool-dmat); [DMA Framework Guidelines for EDIHs (PDF)](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2023-11/DMA_Framework_Guidelines_for_EDIHs.pdf). The overall score is the unweighted average of the six dimensions, banded as Basic / Average / Moderately advanced / Advanced (unverified, background knowledge; check in the Framework Guidelines).
- Repeatability: the assessment is built for repeat use. It is completed at T0, before the EDIH service begins, and then at follow-ups. It should be fully completed three times for each substantial intervention. (secondary) [DMA FAQ](https://european-digital-innovation-hubs.ec.europa.eu/faq/dma-frequently-asked-questions-faq); [DMA Framework Guidelines](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2023-11/DMA_Framework_Guidelines_for_EDIHs.pdf)
- Unit: per organisation.

**B. Cisco AI Readiness Index (survey index plus self-service assessment)**
- Six pillars (Strategy, Infrastructure, Data, Governance, Talent, Culture) measured through 49 indicators. Pillars are weighted by relative importance: Infrastructure 25%, Data 20%, Strategy 15%, Governance 15%, Talent 15%, Culture 10%. The weights come from a secondary source and are confirmed by RCR Wireless for Infrastructure and Data. (secondary) [Cisco: AI Readiness Index Methodology](https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/methodology.html); [RCR Wireless, Dec 2025](https://www.rcrwireless.com/20251209/ai/cisco-ai-readiness-index-2025)
- Stages: four groups based on overall score: Pacesetters (fully prepared), Chasers (moderately prepared), Followers (limited), Laggards (unprepared). In the 2025 edition, Pacesetters are about 13%, a share that has stayed constant across the three editions. (secondary) [Cisco Global AI Readiness Index (PDF)](https://www.cisco.com/c/dam/m/en_us/solutions/ai/readiness-index/documents/cisco-global-ai-readiness-index.pdf); [CRN India, 2025](https://www.crn.in/?p=73548)
- Survey base: the 2023 edition was a double-blind survey of 8,161 senior business leaders at organisations with 500+ employees. The 2025 edition covered 8,000+ senior IT and business leaders across 30 markets and 26 industries. (secondary) [Cisco 2023 archive](https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/archive/2023-m11.html); [RCR Wireless](https://www.rcrwireless.com/20251209/ai/cisco-ai-readiness-index-2025)
- The self-service tool at cisco.com/go/aiassessment places the user on the index, giving a readiness level per pillar and a **peer benchmark** against the survey population. (secondary) [cisco.com/go/aiassessment](https://cisco.com/go/aiassessment); [Augment Code tools review](https://www.augmentcode.com/tools/ai-readiness-assessment-tools)
- Unit: per organisation. Audience: large enterprises (500+ employees).

**C. Microsoft AI Readiness Assessment (Microsoft Learn)**
- Free online assessment with 45 multiple-choice questions, described as taking about 45 minutes. (secondary, blog) [Augment Code](https://www.augmentcode.com/tools/ai-readiness-assessment-tools); [Summit Trails, 2026](https://summittrails.com/blog/best-ai-readiness-assessment-tools/)
- Seven pillars: business strategy, AI governance & security, data foundations, AI strategy & experience, organisation & culture, infrastructure for AI, model management. (secondary) [Microsoft event page](https://www.microsoft.com/en-us/thesource-developer/Event/481/ai-readiness-assessment)
- Output: a maturity score across five stages, from "exploring" to "realizing", with recommendations linked to Microsoft learning content. (secondary, blog) [Augment Code](https://www.augmentcode.com/tools/ai-readiness-assessment-tools)
- Unit: per organisation. Note that it is a vendor tool, so next steps lead to Microsoft products and training.

**D. Google Cloud AI Adoption Framework (whitepaper, not a scored tool)**
- A document-based method, not an interactive assessment. (secondary) [Augment Code](https://www.augmentcode.com/tools/ai-readiness-assessment-tools)
- Six themes (Lead, Learn, Access, Scale, Automate, Secure). Each theme is placed in one of three phases: Tactical, Strategic, Transformational. Sources disagree on the theme list. (secondary) [Google Cloud AI Adoption Framework whitepaper (PDF)](https://services.google.com/fh/files/misc/ai_adoption_framework_whitepaper.pdf). **Dated:** the whitepaper dates from about 2020–21 (pre-GenAI).

**E. Gartner AI Maturity Assessment / AI Maturity Model Toolkit**
- A guided questionnaire covering seven pillars: strategy, data, governance, engineering, operating model, culture, AI product & value. Positioned as the starting point for an AI roadmap. (secondary) [Gartner: AI Maturity Model Toolkit](https://www.gartner.com/en/chief-information-officer/research/ai-maturity-model-toolkit)
- Five stages, starting with "Foundational" (ad hoc experimentation). Third-party sources disagree on the other stage names: one gives Awareness / Active / Operational / Systemic / Transformational, the older Gartner wording. (secondary) [Gartner toolkit page](https://www.gartner.com/en/chief-information-officer/research/ai-maturity-model-toolkit); [BMC on Gartner's model](https://www.bmc.com/resources/topics/ai-maturity-models.html). Gartner also has an HR-specific version. [Gartner HR AI maturity](https://www.gartner.com/en/human-resources/research/ai-maturity-model-toolkit)
- Access: largely limited to Gartner clients (inference from the page format; not confirmed).

**F. MIT CISR Enterprise AI Maturity Model (Weill, Woerner, Sebastian, Dec 2024)**
- Four stages, based on an Oct 2022 survey of **721 companies** plus 2024 interviews with executives at nine enterprises. Stage 1 "Experiment and Prepare": **28%** of firms. Stage 2 "Build Pilots and Capabilities": **34%**. (secondary) [MIT CISR briefing](https://cisr.mit.edu/publication/2024_1201_EnterpriseAIMaturityModel_WeillWoernerSebastian); [MIT CISR press release (PDF)](https://cisr.mit.edu/sites/default/files/2024-12/EnterpriseAIMaturityModel_CISRpressrelease_121924_0.pdf)
- Firms in stages 1–2 had below-industry-average financial performance, and firms in stages 3–4 were above average. (secondary) [MIT CISR press release](https://cisr.mit.edu/content/press-release-enterprise-ai-maturity-121924)
- The data mainly reflects analytical (traditional) AI, not GenAI or agentic AI. (secondary) [MIT CISR briefing](https://cisr.mit.edu/publication/2024_1201_EnterpriseAIMaturityModel_WeillWoernerSebastian). **Dated:** survey data is from 2022.
- Stage 3 is "Develop AI Ways of Working" (31%) and Stage 4 is "Become AI Future-Ready" (7%) (unverified, background knowledge; check in the briefing).
- It is a descriptive research model, not a public self-assessment tool.

**G. Consultancy models: Deloitte, McKinsey, PwC, Accenture**
- Deloitte's State of AI in the Enterprise research segments organisations into Starters, Developers, Sophisticates and Transformers. (secondary, vendor blog) [Augment Code](https://www.augmentcode.com/tools/ai-readiness-assessment-tools)
- A McKinsey framework is described as covering five domains: strategy & operating model, data & technology, talent & culture, responsible AI, value delivery. (secondary, blog; not confirmed on mckinsey.com) [Business Plus AI](https://www.businessplusai.com/blog/ai-maturity-assessment-how-to-select-the-right-model-for-your-organisation)
- A PwC tool reportedly covers leadership, trust, business processes, technology and outcomes across five levels, and full use requires a PwC advisory engagement. An Accenture "AI Adoption Maturity Model" with CMU SEI is listed as launched in 2026. (secondary, blog) [Orbflo: 17 AI maturity frameworks compared](https://www.orbflo.com/insights/17-ai-maturity-frameworks-compared-what-each-one-measures)
- Pattern: the Big-4 and strategy-firm tools are mostly **consulting-led** (interviews, workshops), not free self-checks. Their "benchmark" is their annual survey. (secondary) [Augment Code](https://www.augmentcode.com/tools/ai-readiness-assessment-tools)

**H. Public-sector / UK / OECD-based tools**
- Oxford Insights' **Trustworthy AI Self Assessment** is free and aimed at policymakers. It has five pillars based on the OECD AI Principles, adapted to public-sector use, and each pillar is scored 0–100. (secondary) [Oxford Insights](https://oxfordinsights.com/ai-readiness/trustworthy-ai-self-assessment/)
- The UK government AI Knowledge Hub provides a **dataset-level** self-assessment checklist ("is this dataset AI-ready?"). This is closer to a per-use-case unit than an organisation score. (secondary) [ai.gov.uk: Making data ready for AI](https://ai.gov.uk/knowledge-hub/how-to/Making-data-ready-for-AI/); [DSIT: Building AI-ready datasets (PDF)](https://assets.publishing.service.gov.uk/media/696e43965a37ab534a9e23ac/Building_AI-Ready_Datasets_for_the_UK.pdf)
- The **AI Readiness Checklist** for UK health and care providers is funded by NHS England and the Health Foundation. It covers data and digital infrastructure, governance and assurance, workforce capability, ethics and equity, and strategy. (secondary) [CERSI-AI: The AI Readiness Checklist](https://www.cersi-ai.org/the-ai-readiness-checklist/)
- The Apolitical AI Readiness Check is an anonymous check for **individual** public servants, not organisations. (secondary) [GovInsider](https://govinsider.asia/intl-en/article/apolitical-develops-ai-self-assessment-tool-for-public-officers-in-diverse-roles)

**I. National SME programmes**
- Austria's **KMU.DIGITAL** (WKO and Ministry of Economy) starts with a funded "Status-Analyse" consultation. It has funded **over 25,000** consulting and implementation projects since launch on a budget of about EUR 25 million, per WKO's 2025 materials. (secondary) [WKO: kmu.digital 2025 (PDF)](https://wko.at/oe/information-consulting/kmu.digital-2025.pdf). A WKO Niederösterreich deck cites 4,882 companies funded in the consulting module, time frame unclear. (secondary) [WKO NÖ deck (PDF)](https://wko.at/noe/beratungsservice/2.kmu.digital-und-green-2025-160125.pdf)

### Inferences
- The common "template" is per-organisation, 5–7 dimensions, a 0–100 or 1–5 scale, 4–5 named stages, and a per-dimension profile. A hotel per-use-case check would differ from all the big tools on its **unit of analysis**. The closest precedents are dataset-level checklists such as the UK government's, and the gating logic in compliance tools.
- Weighting is rare and, where it exists (Cisco), it reflects the designer's judgment, not empirical calibration. The EDIH tool seems to use simple averages (to be verified).
- Tools that report heavy use (EDIH, KMU.DIGITAL) are tied to a **service or funding** step. The tool is the entry ticket to help, not a standalone quiz.

### Gaps
- No primary page could be opened. Question wording, exact counts (except Microsoft's 45), time to complete, and the scoring formula are unconfirmed for EDIH, Cisco and Gartner.
- No reliable information found on ISO/IEC 42001 self-assessments (only vendor gap checklists exist, not searched further), on Alan Turing Institute tools, or on an OECD SME digital check.
- Whether results can be saved or exported is only documented for EDIH (repeat measurement). For the other tools it is not documented in the results.

---

## 2. Is there evidence on uptake, completion or impact, and what do evaluations say about validity (optimism bias, "maturity theatre")?

### Takeaway
Usage figures exist only for public, service-linked tools (EDIH: about 9,000 SME assessments by Sep 2024). No source found reports **completion or drop-off rates** for any online readiness tool. The academic literature has criticised maturity models for weak empirical validation since de Bruin et al. (2005) and Becker et al. (2009). Studies that compare self-assessment with expert assessment find systematic **overestimation**.

### Cited Findings
- **EDIH uptake:** as of Sep 2024 the DMA tool had collected almost **9,000 SME assessments** plus about **800 PSO assessments**. Another passage in the same report says EDIHs tested 9,208 SMEs and PSOs. (secondary) [JRC, Carpentier, D'Adda, Nepelski, Stake, EUR 40272 (PDF)](https://publications.jrc.ec.europa.eu/repository/bitstream/JRC140547/JRC140547_01.pdf). **Dated:** Sep 2024. No later count found.
- **Cisco uptake:** the index is "widely cited" (secondary, blog) [Augment Code](https://www.augmentcode.com/tools/ai-readiness-assessment-tools). No usage count for the self-service tool was found.
- **Validity critique:** newly proposed maturity models are rarely tested for validity, and empirically validated ones are rare. De Bruin & Rosemann (2005) explained ambiguous results by weak testing of validity, reliability and generalisability, and by thin documentation of how models were built. Becker, Knackstedt & Pöppelbuß (2009) proposed a procedure model for designing maturity models in response to arbitrary, undocumented development. (secondary) [Maturity Models in IS Research (ResearchGate)](https://www.researchgate.net/publication/221408759_Maturity_Models_in_IS_Research); [Becker et al., Developing Maturity Models for IT Management (Semantic Scholar)](https://www.semanticscholar.org/paper/Developing-Maturity-Models-for-IT-Management-Becker-Knackstedt/0e91b3a569c938d6655904ef571fdf96f8368629); [Univ. of Liechtenstein author version](https://webdocs.uni.li/public/04046167.PDF)
- A citation analysis asks whether design procedure models actually guide maturity model design. It suggests that many models ignore the design guidance. (secondary) [HICSS paper: Do Procedure Models Actually Guide Maturity Model Design?](https://scholarspace.manoa.hawaii.edu/bitstreams/7c178b7c-3624-46b5-9c31-0d712da998fa/download)
- A 2024 systematic review of business-process maturity models lists limitations including subjectivity, citing Mettler (2011) and Becker et al. (2009). (secondary) [Information Systems Management, 2024: Limitations of BPMMs](https://www.tandfonline.com/doi/full/10.1080/10580530.2024.2332210)
- **Overestimation, SMEs:** an expert-assessment study of SME cybersecurity found SMEs' self-reports were systematically more optimistic than expert observation, especially on NIST CSF "Identify". It names optimism bias and social desirability as drivers. (secondary) [Beyond Self-Reporting (ResearchGate)](https://www.researchgate.net/publication/399959349_Beyond_Self-Reporting_Uncovering_the_Operational_Realities_of_SME_Cybersecurity_Through_Expert_Assessment)
- **Overestimation, Switzerland:** in a Swiss digital-transformation survey, 60% of establishments rated their technological state above average, which the authors call mathematically impossible and a sign of overestimation. (secondary) [Digital Transformation in Switzerland (arXiv 2412.12784)](https://arxiv.org/pdf/2412.12784)
- **Overestimation, large firms:** a Forrester survey of procurement leaders found 65% saw themselves as "advanced" in digital maturity, while Forrester judged fewer than 12% to be there. (secondary, trade press) [SupplyChainBrain](https://www.supplychainbrain.com/blogs/1-think-tank/post/29842-companies-are-wildly-overestimating-their-digital-maturity-in-supplier-management)
- Self-assessment tools are the default method for SME digitalisation in most APEC economies studied. The criticisms apply to their current design, not to the approach itself. (secondary) [APEC, What comes after SME digital transformation? (2023)](https://www.apec.org/docs/default-source/publications/2023/4/what-comes-after-sme-digital-transformation/223_sme_what-comes-after-sme-digital-transfromation.pdf)

### Inferences
- Self-rated "maturity" questions ("how advanced is your data management?") invite inflation. Factual, observable questions ("do you have a named owner for guest data?", "is the PMS reachable by API?") are less open to optimism bias. Expert-assisted use, as in EDIH, is the other main counter-measure.
- "Maturity theatre" as a named critique did not appear in sources. The underlying problem (scores that look precise but have no validation) is well documented in the IS literature above.

### Gaps
- No completion, drop-off or time-on-tool data was found for any online readiness tool.
- No study links using a readiness tool to better AI project outcomes. MIT CISR links **stage** to financial performance, which is a correlation and not evidence about the tool.
- The primary Becker et al. (2009), de Bruin et al. (2005) and Mettler (2011) papers were not opened.

---

## 3. Are there hospitality-specific readiness or digital-maturity tools?

### Takeaway
No public, scored AI-readiness self-assessment from HFTP, HOTREC, AHLA/HTNG or a national tourism body was found. The closest item is a **research survey**: HES-SO Valais (Britz & Schegg, Oct 2025) measured AI readiness in European hotels. Vendor "hotel AI readiness scores" exist but are marketing content. This is a real gap that a hotel per-use-case check could fill.

### Cited Findings
- **Britz & Schegg (2025), "AI Readiness in Hotels",** HES-SO Valais, part of the Resilient Tourism project. Survey run Jul–Sep 2025. It was sent to **408 hoteliers** who had answered the previous AI survey, and about **80 Swiss hotels** were also contacted by LinkedIn or mail. The instrument used 13 targeted questions, closed and open. (secondary) [Britz & Schegg 2025 (PDF, hotellerie.de)](https://www.hotellerie.de/fileadmin/user_upload/Britz_Schegg_2025_AI_Readiness_in_Hotels.pdf); [HES-SO copy (PDF)](https://www.hevs.ch/media/document/22/britz-schegg-2025-ai-readiness-in-hotels.pdf). The number of responses and the key results were not visible in the search snippets.
- The predecessor study (Jul 2025) covered hotels in Austria, France, Germany, Greece, Italy and Switzerland and found that **41% of surveyed hotels use AI**. Hotels are experimenting but not scaling. Smaller hotels need plug-and-play tools and training, and larger ones need data governance and change management. (secondary) [HospitalityNet: How AI is (and isn't) transforming European hospitality](https://www.hospitalitynet.org/opinion/4128078.html); [AI Adoption in European Hotels 2025 (PDF)](https://hotelinside.ch/wp-content/uploads/PDF-AI-Adoption-in-European-Hotels-2025.pdf); [HospitalityNet: How ready is Europe's hotel industry for AI?](https://www.hospitalitynet.org/article/122000458/how-ready-is-europes-hotel-industry-for-ai-insights-from-a-multi-country-survey)
- Earlier wave: Khlusevich & Schegg (Oct 2023), AI adoption in European hotels. (secondary) [PDF](https://www.hotellerie.de/fileadmin/user_upload/Dokumente/Studien_und_Umfragen/Khlusevich_Schegg_2023_AI_adoption_in_European_Hotels_October_2023.pdf)
- hotelleriesuisse offers free digital training through the typsy platform. This is training, not a self-assessment. (secondary, search summary only)
- Austrian Hotel Classification 2025–2030 (Hotelstars Union, under HOTREC patronage) awards points for self-check-in and self-check-out (1 point each). This is a classification criterion, not a readiness tool. (secondary) [WKO: Criteria Austrian Hotel Classification 2025–2030 (PDF)](https://www.wko.at/ooe/hotelsterne/criteria-austrian-hotel-classification-2025-2030.pdf)
- OECD (2021), *Preparing the tourism workforce for the digital future*, gives policy context on tourism skills and no tool. **Dated.** (secondary) [OECD (PDF)](https://www.oecd.org/content/dam/oecd/en/publications/reports/2021/06/preparing-the-tourism-workforce-for-the-digital-future_06211c0f/9258d999-en.pdf)
- A vendor page promotes a "Hotel AI Readiness Score" for GMs. It is commercial content and should not be used as evidence. (secondary) [pulse.bot](https://www.pulse.bot/hotels/news/what-is-a-hotel-ai-readiness-score-and-why-every-gm-should-know-theirs-d16c936c-e699-486d-a938-1b3b7cd47d19/)

### Inferences
- The HES-SO surveys are the best European hotel benchmark for any peer-comparison feature, if the team can get the response breakdown, for example by hotel size or country.
- A hotel tool should support small independents with plug-and-play guidance and chains with governance guidance, in line with the HES-SO segmentation finding.

### Gaps
- AHLA, HTNG and HFTP were not specifically confirmed to have no tool. Only one combined search was run, and it returned nothing from them.
- No Swiss (hotelleriesuisse, Swiss Tourism Federation) or Austrian (ÖHV, ÖW) tourism-specific digital check was found. Germany's Mittelstand-Digital "KI-Check" offerings were searched without result.
- The response count and findings of Britz & Schegg 2025 could not be read. Open the PDF.

---

## 4. Which design patterns recur in the tools that seem most used?

### Takeaway
The most-used tools share these features: **5–7 dimensions**; a **per-dimension profile** in addition to one overall score; **4–5 named stages**; a **peer benchmark** drawn from a large survey (Cisco, Deloitte) or a programme database (EDIH); and above all a **link to a next step** (an EDIH service, KMU.DIGITAL funding, vendor training). Length varies widely, from 13 research questions (HES-SO) to 45 questions / 45 minutes (Microsoft) to 49 indicators (Cisco). Explicit **gates or minimum requirements** are rare in maturity tools.

### Cited Findings
| Tool | Unit | Length | Dimensions | Scale / scoring | Result | Benchmark | Next step / repeat |
|---|---|---|---|---|---|---|---|
| EDIH DMA (EU) | Organisation (SME/PSO) | 10-page questionnaire; expert-assisted | 6 | Questions 0–10, dimensions 0–100 | Overall + per dimension | EDIH database (policy monitoring) | Linked to EDIH services; repeated T0 + follow-ups |
| Cisco AI Readiness Index | Organisation (500+ staff) | 49 indicators (survey) | 6, weighted 25/20/15/15/15/10 | Weighted score | 4 groups (Pacesetter to Laggard) | Yes, against ~8,000 respondents | Report; self-service tool |
| Microsoft AI Readiness | Organisation | 45 questions, ~45 min | 7 | Multiple choice | 5 stages | Not documented | Microsoft learning content |
| Google AI Adoption Framework | Organisation | Whitepaper | 6 themes | Qualitative | 3 phases | No | Narrative guidance |
| Gartner AI Maturity | Organisation | Guided questionnaire | 7 | Not documented | 5 stages | Gartner client data (inferred) | Roadmap |
| MIT CISR | Organisation | Research model (721 firms) | Capabilities per stage | Stage placement | 4 stages | Stage shares 28/34/... % | Capabilities to build next |
| Oxford Insights Trustworthy AI | Public body | Not documented | 5 (OECD principles) | 0–100 per pillar | Per-pillar scores | No | Not documented |
| UK DSIT data readiness | **Dataset** | Checklist | Data quality topics | Checklist | Ready / not ready | No | Fix list |
| HES-SO AI Readiness in Hotels | Hotel (research) | 13 questions | Not documented | Closed + open | Research report | Survey population | n/a |

Sources for the rows are given in section 1 above (all secondary).

- Big-firm assessments are often consulting-led, while free self-checks come mainly from tech vendors (Microsoft, Cisco). (secondary) [Augment Code](https://www.augmentcode.com/tools/ai-readiness-assessment-tools)
- Simple 1–4 descriptor scales are used in public-sector readiness tools, e.g. Zaizi's UK government assessment scores culture, skills, assurance/governance and data on 1–4 with descriptors. This is a vendor tool. (secondary) [Zaizi](https://www.zaizi.com/interactive-government-readiness-assessment/)

### Inferences (for the hotel per-use-case check)
- **Unit:** score per use case, such as "AI chatbot for guest messaging" or "RM pricing tool". No major tool does this, so it is a point of difference. It mirrors the UK dataset-level checklist and EU AI Act-style per-system thinking.
- **Length:** short. Aim for about 10–15 questions per use case (HES-SO used 13; Microsoft's 45 questions / 45 minutes is the upper bound and is aimed at IT leaders). This is a design judgment, not an evidence-based threshold.
- **Dimensions:** reuse the near-universal set (strategy/value, data, tech/integration, people/skills, governance/risk, culture/change). The team's D5/D6 criteria (value, complexity, risk, integration, readiness) map onto it.
- **Gates:** add 2–3 must-pass items, such as lawful data basis or GDPR, a named owner, and PMS integration possible. Maturity tools rarely gate, but a go/no-go per use case needs them. This is where the hotel tool can improve on maturity models.
- **Questions:** phrase them as observable facts, not self-ratings, to limit overestimation (section 2).
- **Result:** a per-dimension bar or radar plus one plain-language verdict ("Ready / Ready with fixes / Not yet"), not a numeric stage alone. Every tool gives a per-dimension profile.
- **Next steps:** give each low-scoring item a concrete action. The most-used tools tie results to a service or funding step.
- **Benchmark:** add a peer comparison only if it is honestly sourced, e.g. HES-SO's 41% adoption (base: surveyed hotels in 6 countries, 2025). Otherwise leave it out rather than invent peers.
- **Save / repeat:** allow re-running and comparison over time, following EDIH's T0-and-follow-up pattern.

### Gaps
- No evidence was found showing that any one pattern (gating, benchmark, length) **causes** higher uptake. The patterns above are inferred from which tools are used most, not tested.
