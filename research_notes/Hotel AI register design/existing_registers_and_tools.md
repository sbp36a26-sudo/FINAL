# Existing AI registers, inventory standards and governance tools: benchmark for a "Hotel AI Register"

*Research notes, 17 Nov 2026. Scope: EU + CH + UK, hotels including in-hotel F&B.*

**Method and limits (read first).** This session's network allowed web search but blocked page fetches for almost every site (airc.nist.gov, orrick.com, artificialintelligenceact.eu, lodgingmagazine.com all failed DNS). So most findings below come from **search-result summaries, often of secondary law-firm or vendor blogs**, not from the full primary texts. Items marked **[primary text, not re-fetched]** are cited to the official text from standing knowledge of that text and should be checked on EUR-Lex or the publisher's site before they go into the report. Nothing here comes from Wikipedia. To fetch the primary pages, eur-lex.europa.eu, airc.nist.gov, artificialintelligenceact.eu, regels.overheid.nl, gov.uk, cnil.fr and ico.org.uk need to be allowed in the session's network settings.

---

## 1. What the EU AI Act (as amended by the Digital Omnibus on AI, Reg. (EU) 2026/1744) requires or implies about inventorying AI, deployers vs providers

### Takeaway
The AI Act contains **no explicit duty for a hotel (as deployer) to keep an AI inventory**. In practice, though, a hotel cannot meet its duties without one. It has to know which systems it uses, which risk tier each falls under (prohibited / high-risk / Art. 50 transparency / minimal), and which staff use them (AI literacy). The only formal *registration* duty sits with **providers** (EU database, Art. 49/71), and with deployers only when they are **public authorities**. After the Omnibus, AI literacy is a softer "take measures to support" duty, and high-risk obligations now start on **2 Dec 2027 (Annex III)** and **2 Aug 2028 (Annex I)**.

### Cited Findings
- **Omnibus status and timing:** Regulation (EU) 2026/1744 was published in the OJ on 24 July 2026 and entered into force on 27 July 2026 ([aiacto.eu](https://www.aiacto.eu/en/blog/digital-omnibus-ai-act-report-2027); [nicfab.eu](https://www.nicfab.eu/en/posts/digital-omnibus-ai-official-journal/); [regulation-ai.eu](https://www.regulation-ai.eu/en/omnibus/)).
- **High-risk dates:** Annex III (stand-alone) high-risk obligations moved from 2 Aug 2026 to **2 Dec 2027**. Systems already on the market before that date are caught only if they are substantially modified afterwards ([Orrick, Jul 2026](https://www.orrick.com/en/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes)). Annex I (AI embedded in regulated products) moved to **2 Aug 2028** ([Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/)). Providers and deployers of AI intended for public authorities have until 2 Aug 2030 ([Orrick](https://www.orrick.com/en/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes)).
- **Conflicting source to ignore:** one vendor blog says a "four-month grace period" makes 2 Dec 2026 the effective high-risk date ([Usercentrics](https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/)). Other sources tie 2 Dec 2026 only to the **content-marking (Art. 50(2)) grace period for generative systems already on the market** ([regulation-ai.eu](https://www.regulation-ai.eu/en/omnibus/)). Treat the Usercentrics reading as an error. Many free checkers and blogs still state "2 Aug 2026 for everything" and are out of date ([search summary of checker sites, e.g. aigovhub.io](https://www.aigovhub.io/ai-act-checker)).
- **Art. 4 AI literacy after the Omnibus:** Art. 4 was replaced. Providers and deployers no longer must "ensure, to their best extent, a sufficient level" of AI literacy; they "shall take measures to support" its development, and they are not required to guarantee any level for any individual. The Commission had proposed moving the duty to the Commission and Member States, but the adopted text keeps a duty on companies ([cypheron.cz](https://cypheron.cz/en/resources/ai-act/omnibus-2026); [euai-act.com](https://www.euai-act.com/articles/eu-ai-act-digital-omnibus-2026); [ActuIA](https://www.actuia.com/en/news/ai-act-obligations-in-force-and-delays-under-omnibus-2026-1744/)). *(Secondary sources. Check the OJ wording.)*
- **Art. 49(2) registration of "Art. 6(3) non-high-risk" Annex III systems:** the Commission proposed deleting it. According to secondary comparisons, the final text **keeps** the Art. 49(2) route and only slims Annex VIII Section B (points 7 and 9 deleted). The Art. 6(3) filter itself was not substantively amended ([cypheron.cz](https://cypheron.cz/en/resources/ai-act/omnibus-2026); [aiactguide.net](https://aiactguide.net/digital-omnibus/)). This is a **provider** duty.
- **Art. 49(3) / Art. 26(8) [primary text, not re-fetched]:** deployers that are public authorities or EU bodies must register their *use* of Annex III high-risk systems in the EU database. Private deployers (hotels) have no registration duty ([Regulation (EU) 2024/1689, EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)).
- **Art. 26 deployer duties (high-risk only), which a register would track:** use the system according to the provider's instructions; assign human oversight to competent staff; make sure input data under the deployer's control is relevant and representative; monitor the system and report incidents; **keep automatically generated logs under its control for at least six months**; and **inform workers and their representatives** before putting a high-risk system into use in the workplace (Art. 26(7)) ([Taylor Wessing deployer obligations PDF](https://taylorwessing.com/-/media/taylor-wessing/files/uk/2024/eu-ai-act-obligations/2409_obligations_on_deployers.pdf); [aiactblog.nl](https://www.aiactblog.nl/en/posts/article-26-deployer-obligations-ai-act); [secureprivacy.ai](https://secureprivacy.ai/blog/eu-ai-act-article-26-deployer-obligations-and-what-enterprises-must-do-2026)). The logging duty cannot be met by pointing to the upstream supplier's documentation ([lyceum.technology](https://lyceum.technology/magazine/ai-act-article-26-deployer-logging-6-month/)).
- **Art. 50 transparency [primary text, not re-fetched]:** providers must design AI that interacts with people (e.g. a guest chatbot) so that people are told they are dealing with AI. Deployers must disclose deepfakes and AI-generated text published to inform the public, and must inform people exposed to emotion-recognition or biometric-categorisation systems ([Reg. 2024/1689, EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)). A secondary source confirms that in deployer terms this mainly means telling users they are interacting with AI ([search summary, aiactblog.nl](https://www.aiactblog.nl/en/posts/article-26-deployer-obligations-ai-act)).
- **Practitioner consensus:** "start with the inventory". A minimal inventory covers system name and vendor, core function and intended use, data inputs/outputs, and deployment context, and each system then gets a risk-tier classification ([Aguardic](https://www.aguardic.com/blog/eu-ai-act-inventory-first); [Airia checklist](https://airia.com/blog/eu-ai-act-compliance-checklist-12-steps-to-get-ready/)). These are vendor blogs, so treat them as practice, not law.

### Inferences
- For a hotel, the register's legal job is to (a) **evidence Art. 4 measures** (who uses which tool, what training they had), (b) **sort every tool into an AI Act tier**, (c) for any high-risk tool (most plausibly **HR/recruitment, worker evaluation or task allocation**, Annex III pt 4), hold the Art. 26 checklist (oversight owner, 6-month logs, worker information, instruction compliance), and (d) for guest-facing chatbots, voice agents and generated marketing content, log the **Art. 50** disclosure status.
- Most hotel AI (revenue management, chatbots, upselling, housekeeping optimisation) will be minimal-risk or Art. 50, so a hotel register mainly serves literacy, transparency and vendor oversight. The 2027 high-risk date matters for HR tools.
- A hotel that **substantially modifies** or white-labels a system can become a provider (Art. 25). The register should carry a "role" field (deployer / provider / both) and flag this.

### Gaps
- The full Omnibus text (OJ) and the Commission's AI Act Service Desk FAQs could not be fetched. The exact Art. 4 wording, the Art. 50 dates after the Omnibus, and any SME/small mid-cap relief for deployers still need checking on EUR-Lex.
- I found no Commission template for a deployer AI inventory.

---

## 2. ISO/IEC 42001, NIST AI RMF (+ Playbook), OECD: what they say about AI inventories and which fields they recommend

### Takeaway
None of the frameworks gives a mandated field list. **NIST AI RMF GOVERN 1.6** is the clearest "keep an AI inventory" outcome. **ISO/IEC 42001 Annex A** asks for documented AI system resources (data, tooling, compute, people), impact assessments and lifecycle records, which together act as a register. Across sources the core fields are: system and owner, purpose/intended use, data used, third-party/vendor origin, risk/impact, and lifecycle status including decommissioning.

### Cited Findings
- **NIST AI RMF 1.0, GOVERN 1.6:** "Mechanisms are in place to inventory AI systems and are resourced according to organizational risk priorities" ([NIST AIRC, AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)).
- According to secondary summaries of the Playbook, its suggested actions include naming the team that maintains the inventory and deciding which systems belong in it ([Kanerika](https://kanerika.com/blogs/nist-ai-rmf-playbook/)). The inventory should cover **in-house, procured and third-party SaaS** systems ([search summary, myctrl.tools](https://myctrl.tools/frameworks/nist-ai-rmf/govern-1-6)), ideally all models and at minimum high-risk ones ([search summary](https://risktemplate-site.pages.dev/blog/2026-04-17-nist-ai-rmf-govern-function-ai-risk-culture-accountability-inventory)). Every model should have an accountable owner (a person or defined role); decommissioning has no owner unless the inventory assigns one; and a change in a model's "data reach" should trigger review ([Rockcyber](https://rockcyber.com/blog/ai-model-inventory-requirements)).
- **Playbook field list [from standing knowledge of the Playbook, not re-fetched; verify]:** the GOVERN 1.6 suggested actions list inventory attributes such as system documentation, incident response plans, data dictionaries, links to implementation software or source code, and names and contacts of relevant AI actors ([NIST AI RMF Playbook, Govern](https://airc.nist.gov/airmf-resources/playbook/govern/)).
- **NIST publishes an official AI RMF ↔ ISO/IEC 42001 crosswalk** ([NIST crosswalk PDF](https://airc.nist.gov/docs/NIST_AI_RMF_to_ISO_IEC_42001_Crosswalk.pdf)).
- **ISO/IEC 42001:2023 Annex A** (38 reference controls across 9 areas, A.2–A.10, selected through a Statement of Applicability; secondary sources disagree on counts) ([SureCloud](https://www.surecloud.com/resource-hub/iso-42001-annex-a-controls); [CertPro](https://certpro.com/hub/iso-42001/controls/iso-42001-controls-list/)):
  - **A.4 Resources for AI systems:** document resources (A.4.2), data (A.4.3), tooling (A.4.4), system/compute (A.4.5) and personnel (A.4.6). Some practitioners treat A.4.2 as the "AI/agent register". Records must be updated when data, models, suppliers, infrastructure, software or responsible personnel change ([bastion.tech](https://bastion.tech/learn/iso42001/annex-a-controls); [blckalpaca](https://blckalpaca.at/en/knowledge-base/ai-agents/iso-42001-ai-management-system/annex-a-controls-iso-42001)).
  - **A.5 Impact assessment:** a repeatable process (A.5.2); documentation of scope, affected parties, assumptions, impacts, treatment decisions and review results (A.5.3); impacts on individuals/groups (A.5.4) and on society (A.5.5) ([SureCloud](https://www.surecloud.com/resource-hub/iso-42001-annex-controls)).
  - **A.6 Lifecycle:** requirements, design, testing, deployment, operation, monitoring, documentation, event logging (A.6.2.8) ([SureCloud](https://www.surecloud.com/resource-hub/iso-42001-annex-controls)).
- ISO 42001 is certifiable, which signals an enterprise-scale management system (auditor plus SoA). Several secondary sources note this.

### Inferences
- Recommended core fields for a hotel register, combining NIST GOVERN 1.6, ISO A.4/A.5/A.6 and practitioner practice: **ID; name; vendor/product; in-house vs bought vs embedded-in-SaaS; business owner (role); department; purpose/intended use; users (staff roles); affected people (guests, staff, applicants); data categories used (personal? special-category? payment?); where data is processed (EU/CH/UK/US); human oversight; risk/impact rating; AI Act tier; lifecycle status (pilot/live/retired) and review date; incidents; decommissioning owner.**
- ISO 42001 certification is unrealistic for a single independent hotel. A light "42001-aligned" register is a credible middle ground.

### Gaps
- I could not open the NIST Playbook page to quote the GOVERN 1.6 attribute list verbatim (airc.nist.gov blocked). The MAP function items (e.g. MAP 4 on third-party components) were not retrieved.
- **OECD:** no search result covered the OECD Framework for the Classification of AI Systems (2022) or the OECD AI Principles in this session. Its dimensions (People & Planet, Economic Context, Data & Input, AI Model, Task & Output) are, from standing knowledge, a usable taxonomy for register fields, but this needs verifying at [oecd.ai](https://oecd.ai/en/classification) before it is cited.
- The ISO text itself is paywalled. All ISO details come from secondary consultancies.

---

## 3. GDPR Art. 30 record of processing activities (RoPA) as a model

### Takeaway
The RoPA is the closest thing European businesses (hotels included) **already keep**, and it is the most natural "parent" for an AI register. It is a structured, per-activity table kept by the controller (and processor), shown to the DPA on request, with DPA-published templates. An AI register can copy its structure (one row per system or use, a fixed field set, owner, recipients, transfers, retention, security) and add AI-specific columns. Note the Omnibus IV proposal to raise the RoPA exemption threshold from 250 to 750 employees.

### Cited Findings
- **Art. 30(1) fields [primary text, not re-fetched]:** controller and DPO contact details; purposes of processing; categories of data subjects and of personal data; categories of recipients (including third countries); transfers to third countries and safeguards; envisaged erasure time limits; and a general description of technical and organisational security measures. Art. 30(2) gives a shorter list for processors. The record must be in writing (electronic is fine) and made available to the supervisory authority on request ([GDPR, EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj)).
- **Current SME exemption (Art. 30(5)):** organisations with fewer than 250 employees are exempt *unless* the processing is likely to create a risk, is not occasional, or includes special-category or criminal data. Payroll and customer records are "not occasional", so most small firms still need a RoPA for core processing ([Michalsons](https://www.michalsons.com/blog/proposed-gdpr-record-keeping-exemption-for-smes/78228); [nhimg.org](https://nhimg.org/data-mapping-and-ropa-guide)). Inference: a hotel's guest PMS/CRM data is continuous processing, so hotels are generally *not* exempt.
- **Omnibus IV proposal (21 May 2025):** extend the exemption to organisations with fewer than 750 employees unless the processing is likely to be *high* risk. The EDPB and EDPS (Joint Opinion 01/2025) back the simplification but warn that the register is a compliance tool ([lawandtechnology.eu](https://lawandtechnology.eu/en/records-of-processing-and-smes-the-simplification-of-article-305-gdpr-seen-by-the-edpb-and-edps/); [Eubelius](https://www.eubelius.com/en/news/the-omnibus-iv-package-the-unexpected-gdpr-simplification)). **Status is disputed:** one source reports political agreement on 7 May 2026 (under 750 employees and under €150m turnover), another says it applies from 2027 at the earliest, and another says it stalled ([compliancehive.eu](https://compliancehive.eu/en/blog/processing-register-exemption-digital-omnibus-smb); [limitedliability.solutions](https://www.limitedliability.solutions/blog/2026/07/10/gdpr-simplification-omnibus-iv-what-the-750-employee-threshold-means-for-mid-market-compliance-strategy/); [igdpr.eu](https://www.igdpr.eu/en/digital-omnibus-gdpr-changes/)). Either way, Art. 5(2) accountability remains ([search summary](https://compliancehive.eu/en/blog/processing-register-exemption-digital-omnibus-smb)).
- **DPA templates [standing knowledge, not re-fetched; verify]:** the CNIL publishes a downloadable "registre simplifié" template (spreadsheet, one sheet per processing activity) for SMEs ([CNIL](https://www.cnil.fr/fr/RGDP-le-registre-des-activites-de-traitement)). The ICO publishes controller and processor documentation templates (spreadsheets) with guidance ([ICO](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/documentation/)). Switzerland: revised FADP Art. 12 requires a record of processing activities, with an exemption for companies under 250 employees whose processing poses low risk (verify at [fedlex.admin.ch](https://www.fedlex.admin.ch/eli/cc/2022/491/en)).

### Inferences
- **What an AI register can borrow from the RoPA:** the row-per-activity structure; owner and contact; purpose; data subject categories (guests, staff, applicants); data categories; recipients/processors (the AI vendor and its sub-processors, e.g. LLM providers); third-country transfers (many hotel AI vendors route to US LLMs); retention; security measures; and a "made available on request" mindset.
- **What it should add:** AI Act tier; deployer/provider role; human oversight; transparency disclosure status (Art. 50); training/literacy of users (Art. 4); automated decision-making flag (GDPR Art. 22); DPIA needed/done (Art. 35); vendor model and version; incidents; review date.
- **Design choice:** link each AI register row to the matching RoPA entry (a "RoPA ref" field) so the hotel does not duplicate work. The Omnibus IV change would make many mid-size hotel groups RoPA-exempt, and then the AI register may become their only structured data record. This needs watching.

### Gaps
- The CNIL and ICO template pages were not fetched (blocked), so the field lists above are from standing knowledge. EDPB has no single template; national DPAs differ.
- The final legal status of the Omnibus IV 750-employee threshold as of Nov 2026 is unresolved.

---

## 4. Commercial and free AI governance / EU AI Act compliance platforms

### Takeaway
The market splits into (a) **enterprise AI-governance platforms** (Credo AI, Holistic AI, OneTrust, IBM watsonx.governance, Modulos, Saidot, trail), which are custom-priced, mostly at enterprise or mid-market level, with Saidot the only one with a quoted price of about €1,000–1,400/month, and (b) **free or cheap EU AI Act "checkers"**, which classify one system at a time through a 5–13 question wizard but do not maintain an ongoing register. **None is hospitality-specific.** None ships a pre-built catalogue of hotel tools (PMS, RMS, chatbots, guest messaging, HR scheduling, F&B forecasting).

### Cited Findings
- **Credo AI:** enterprise subscriptions by custom quote, no free or self-serve tier, sold through AWS/Microsoft marketplaces. Its inventory covers AI systems, agents **and vendors** ([Superblocks pricing comparison](https://www.superblocks.com/blog/ai-governance-platform-pricing); [Kosmoy](https://www.kosmoy.com/resources/blog/credo-ai-alternatives/)).
- **Holistic AI:** custom pricing; positioned on technical assurance (bias testing, algorithmic audit) and **shadow-AI discovery** ([Superblocks](https://www.superblocks.com/blog/ai-governance-platform); [Apono](https://www.apono.io/blog/top-ai-governance-tools-by-category/)).
- **Modulos:** bespoke pricing. A vendor-attributed claim says dedicated AI governance platforms start at about **$50,000/year** for a focused mid-market deployment ([Superblocks pricing](https://www.superblocks.com/blog/ai-governance-platform-pricing)). Modulos documents NIST AI RMF mapping ([docs.modulos.ai](https://docs.modulos.ai/frameworks/nist-ai-rmf/govern)).
- **Saidot (Finland):** one inventory for AI systems, models, agents and datasets, with EU AI Act classification. Price figures conflict: from €1,000/month (G2-based, May 2026), a €1,400/month plan, or $1,500–3,500/month; its own pricing page showed no prices in Oct 2026 ([aicompliancevendors.com](https://aicompliancevendors.com/best/eu-ai-act-compliance-tools); [setaicomply.com](https://www.setaicomply.com/resources/best-eu-ai-act-compliance-software-smes)). Saidot also built the Amsterdam and Helsinki public registers (see section 5).
- **trail:** grouped with platforms built around model inventory, risk classification and impact assessment. No pricing found ([search summary, Kosmoy MQ list](https://www.kosmoy.com/resources/blog/best-ai-governance-platforms-2026/)).
- **Free or cheap checkers (one system at a time):** euaiact.com risk calculator (no sign-up, exports a dated assessment) ([euaiact.com](https://www.euaiact.com/eu-ai-act-risk-calculator)); CheckCompliance.eu (free; 5-question scope checker and 8-question HR checker) ([checkcompliance.eu](https://www.checkcompliance.eu/)); EuroComply (free 13-question classifier that also flags Art. 4 literacy evidence) ([eurocomply.app](https://eurocomply.app/eu-ai-act-compliance-checker)); regulation-ai.eu (role-based checklist and score, no registration) ([regulation-ai.eu](https://www.regulation-ai.eu/en/tools/compliance-checklist/)); aicomplyapp.eu (free check, paid one-off report) ([aicomplyapp.eu](https://aicomplyapp.eu/)); euaiactcompliancechecker.com (free tier = 1 system) ([site](https://www.euaiactcompliancechecker.com/)). Several still show outdated 2 Aug 2026 high-risk dates and say they are not legal advice.
- **Open source:** `govai-eu` (PyPI) builds an inventory from a plain software list and sorts each tool into risk tiers. Its author calls it a starting point, not legal advice ([PyPI govai-eu](https://pypi.org/project/govai-eu/)).
- **SME-oriented comparisons exist** (e.g. [SetAIComply, "best EU AI Act software for SMEs 2026"](https://www.setaicomply.com/resources/best-eu-ai-act-compliance-software-smes)), but all vendor-comparison sources are themselves vendor blogs, so read them as directional only.

### Inferences
- Price gap: an independent hotel (often under 50 staff) will not pay €12k–50k+/year. Today it has a choice between nothing and a free one-off checker. **A free or low-cost hotel register sits in that empty middle.**
- Content gap: generic platforms ask "what is your AI system?" A hotel GM often does not know the PMS, RMS or guest-messaging tool contains AI. A **pre-populated catalogue of common hotel vendors and features with a suggested tier** would be the main added value. This is an inference, not a source finding.

### Gaps
- **OneTrust AI Governance and IBM watsonx.governance:** searches returned nothing usable, so no verified feature or pricing data. Both are widely known enterprise platforms with AI inventory / use-case modules (from standing knowledge); verify on vendor pages before citing.
- **Future of Life Institute "EU AI Act Compliance Checker"** (artificialintelligenceact.eu) was not confirmed in this session (site blocked; search did not return it). It is known to be a free interactive checker; verify, and check whether it has been updated for the Omnibus.
- **Law-firm checkers** (e.g. Taylor Wessing, Bird & Bird tools) were not covered.
- Vendor inventory field lists were not obtainable (product docs behind demos or blocked).

---

## 5. Public-sector algorithm registers and their fields

### Takeaway
Three mature public models exist: **Amsterdam/Helsinki (2020, built by Saidot)**, the **Dutch national Algoritmeregister** (about 1,000 entries, formal publication standard), and the **UK Algorithmic Transparency Recording Standard (ATRS)**. The ATRS's **two-tier design** is directly reusable for a hotel: a plain-language tier for guests and staff, and a detailed tier for owners, auditors and DPAs. The Dutch experience shows the main risk: administrative fields get filled in, but substantive fields are often incomplete.

### Cited Findings
- **Amsterdam and Helsinki** launched the first open city AI registers on 28 Sep 2020, both developed by Saidot. At launch: 5 Helsinki systems (library and 4 chatbots) and 4 Amsterdam systems. Amsterdam defines AI as software that "makes predictions, decisions, or gives advice by using data analysis, statistics, or self-learning"; Helsinki also includes simpler programs ([The Next Web](https://thenextweb.com/news/amsterdam-and-helsinki-become-first-cities-to-launch-ai-registers-explaining-how-they-use-algorithms); [ITU AI for Good](https://aiforgood.itu.int/helsinki-and-amsterdam-launch-ai-registers-to-detail-city-systems); [Helsinki/Saidot white paper, Sep 2020](https://ai.hel.fi/wp-content/uploads/White-Paper.pdf)). *Dated 2020; the registers may have changed since.*
- **Dutch Algoritmeregister** (algoritmes.overheid.nl): governed by a formal "Publicatiestandaard" maintained by Logius (consultation version v1.0.10, Nov 2024), with a handbook explaining each field and covering required vs optional fields, exemptions and privacy-preserving publication ([regels.overheid.nl](https://regels.overheid.nl/standaarden/algoritmeregister-publicatiestandaard/pdf); [algoritmes.overheid.nl](https://algoritmes.overheid.nl/en)). It grew from 123 algorithms (2023) to about 1,000 ([Tweede Kamer answer](https://zoek.officielebekendmakingen.nl/ah-tk-20222023-3133.pdf); [kst 26643-1394](https://zoek.officielebekendmakingen.nl/kst-26643-1394.html)). The Auditdienst Rijk found that administrative fields are filled in well, while substantive fields often deviate from the standard. Most municipalities do not publish their high-risk algorithms ([gemeente.nu](https://gemeente.nu/bedrijfsvoering/ai/meerderheid-gemeenten-publiceert-geen-risico-algoritmes)).
- **UK ATRS:** **Tier 1** is a plain-language summary for the public (name, short description, website link, contact email). **Tier 2** holds detail for experts, grouped into owner and responsibility (including the senior responsible owner by role), description and rationale, oversight, information on data (source data used to train and run the tool), and risks and mitigations ([GOV.UK ATRS template](https://gov.uk/government/publications/algorithmic-transparency-template); [GOV.UK data standard CSV](https://www.gov.uk/csv-preview/61a8a4118fa8f50382034ea3/Algorithmic_transparency_data_standard.csv); [OECD-OPSI copy](https://oecd-opsi.org/wp-content/uploads/2022/10/Algorithmic-Transparency-Standard-in-a-standard-format_iteration_2.pdf)). *The CSV cited is an early (2021–22) iteration; the current template may have more fields.*

### Inferences
- Borrow the **two-tier model**. Tier 1 is a "guest-facing AI notice" that a hotel can publish on its website or in-room (supports Art. 50 disclosure and trust). Tier 2 is the internal register for owner, asset manager, brand and DPA.
- Borrow Dutch-style **required vs optional fields** and keep required fields few. The Dutch completeness problem suggests a hotel tool should use drop-downs and pre-filled vendor data rather than free text.

### Gaps
- The exact current Dutch field list and current ATRS v3 field list were not retrieved (pages blocked). Amsterdam/Helsinki field lists were not visible in the search excerpts.
- I found no private-sector public AI register example in hospitality.

---

## 6. Hospitality-specific AI governance frameworks and tools

### Takeaway
Hospitality governance guidance appeared only in 2026. The **AI Hospitality Alliance (AIHA) Hospitality AI Governance Framework** (Oct 2026, free) is the main one: principles, literacy, "minimum viable governance", NIST crosswalk. The new **HFTP–HSMAI–AHLA/HTNG Global Hospitality AI Coordinating Council** and **HFTP's AI Collective** are just starting. **HOTREC** (the European hotel association) turned up nothing. I found **no hotel-specific AI register or inventory tool**.

### Cited Findings
- **AIHA framework (early Oct 2026, free):** common definitions and governance principles; AI governance literacy for employees and leaders; governance health indicators; a **minimum viable governance model**; regional regulatory context with an indicative **NIST AI RMF crosswalk**. The pillars include accountability, data security, **vendor oversight** and **AI agents**; it is meant to be applied proportionately ([Lodging Magazine](https://lodgingmagazine.com/ai-hospitality-alliance-publishes-ai-governance-framework/); [Hotel News Resource](https://www.hotelnewsresource.com/article143201.html)). These are press coverage only; the framework text was not opened. The project already has an internal review (claude/D7_AIHA_Governance_Guide_Review_2026-11-16.md) that should be checked for whether AIHA includes an inventory template.
- **Global Hospitality AI Coordinating Council:** HFTP, HSMAI and AHLA/HTNG; each keeps its own AI initiatives; first Hospitality AI Exchange planned for Feb 2027, produced by HFTP ([Hospitality Net](https://www.hospitalitynet.org/news/4135455/hftp-hsmai-and-ahlahtng-unite-to-create-global-hospitality-ai-coordinating-council); [Asian Hospitality](https://www.asianhospitality.com/hftp-hsmai-ahla-global-hospitality-ai-council/)).
- **HFTP Hospitality AI Collective:** subcommittees for AI Education & Training, AI Ethics & Governance, and Hospitality Applications. A **gap analysis** was named as the first step for governance work. The first level of an AI certification was expected in late summer 2026 ([Hospitality Net opinion](https://www.hospitalitynet.org/opinion/4133425/hftps-ai-collective-solidifies-roadmap-to-provide-industry-wide-resources)).
- **AHLA/HTNG strategic brief (v2, June 2026):** a five-layer structure (Discoverability, Experience, Protocol Rails, Hotel Systems, **Governance/Policy/Observability**), focused on agentic distribution rather than a property register ([search summary, Hotel News Resource](https://www.hotelnewsresource.com/article141656.html)).
- **HOTREC:** no result on AI governance guidance in this session.

### Inferences
- The industry now has **principles** (AIHA) and **coordination** (Council) but no **operational record-keeping tool**. A "Hotel AI Register" would be the practical layer under AIHA's minimum viable governance and could fit HFTP's AI Ethics & Governance gap analysis (a direct link to the client, HFTP).
- Most AIHA/AHLA material is US-led. EU AI Act / GDPR / FADP / UK GDPR specifics for European hotels remain a gap.

### Gaps
- The AIHA framework text was not read in this session. I could not confirm whether it contains an inventory template.
- HOTREC, national hotel associations (DEHOGA, UMIH, HotellerieSuisse, UKHospitality) and hotel tech vendors (Oracle OPERA, Mews, IDeaS, Duetto) were not checked for AI transparency/governance documentation. Next step: search these specifically.

---

## 7. Main gaps a hotel-specific register for European hotels could fill

### Takeaway
A European hotel, often an SME, independent or franchised property with no compliance staff, currently has no tool that (1) recognises the AI hidden inside the hotel software it already buys, (2) maps each tool to AI Act tier, GDPR/FADP/UK GDPR and Art. 50 duties in hotel language, (3) costs nothing or close to it, and (4) separates what the franchisor/brand, the management company and the owner are each responsible for.

### Cited Findings (evidence underpinning the gaps)
- Enterprise platforms are custom-priced or roughly $50k/yr for mid-market; Saidot is roughly €1,000+/month ([Superblocks](https://www.superblocks.com/blog/ai-governance-platform-pricing); [aicompliancevendors.com](https://aicompliancevendors.com/best/eu-ai-act-compliance-tools)).
- Free checkers assess one system at a time and several carry outdated dates ([euaiact.com](https://www.euaiact.com/eu-ai-act-risk-calculator); [euaiactcompliancechecker.com](https://www.euaiactcompliancechecker.com/)).
- Inventories must include **procured and third-party SaaS**, not only in-house AI ([search summary, myctrl.tools](https://myctrl.tools/frameworks/nist-ai-rmf/govern-1-6)). Hotels mostly procure AI.
- Art. 26 log and worker-information duties stay with the deployer and cannot be passed to the vendor ([lyceum.technology](https://lyceum.technology/magazine/ai-act-article-26-deployer-logging-6-month/); [aiactblog.nl](https://www.aiactblog.nl/en/posts/article-26-deployer-obligations-ai-act)).
- Public registers show that substantive fields go unfilled when guidance is generic ([Auditdienst Rijk via search summary](https://zoek.officielebekendmakingen.nl/kst-26643-1394.html)).
- Hospitality frameworks offer principles and a minimum viable governance model, not a register ([Lodging Magazine](https://lodgingmagazine.com/ai-hospitality-alliance-publishes-ai-governance-framework/)).

### Inferences (design gaps to fill, all inference)
1. **Hidden-AI discovery:** a pre-filled catalogue of common hotel systems by department (front office, revenue, distribution, marketing, guest messaging, housekeeping, maintenance, F&B outlets: menu engineering, demand forecasting, waste tracking, POS upsell, HR/scheduling/recruitment, finance/AP, security/CCTV/biometrics), each with a default AI Act tier and typical data. The D4 use-case catalogue (154 codes, 15 departments) can seed this.
2. **Hotel-relevant red flags:** HR/recruitment, worker monitoring and scheduling (Annex III pt 4, high-risk from 2 Dec 2027); biometric check-in or emotion recognition (prohibited in the workplace / Art. 50 / possibly high-risk); guest chatbots and voice agents (Art. 50 disclosure); AI-generated marketing images and reviews (Art. 50 / consumer law); dynamic pricing with personal data (GDPR profiling, Art. 22).
3. **Multi-party responsibility fields:** owner vs operator (management company) vs franchisor/brand-mandated tool vs vendor. Brand-standard tools are chosen centrally, but the property is still the deployer.
4. **Three-regime mapping in one row:** EU AI Act + GDPR (RoPA link, DPIA) + Swiss FADP / UK GDPR for CH and UK properties. The UK and Switzerland have no AI-Act equivalent, so the register should show "AI Act: n/a, but FADP/UK GDPR apply" instead of leaving blanks.
5. **Literacy evidence (Art. 4):** per-tool list of user roles plus training done. This is cheap and immediately in force (from 2 Feb 2025, softened by the Omnibus from 27 Jul 2026).
6. **Vendor questionnaire:** a short standard set (Does it use AI? Which model/provider? Where is data processed? Is it used to train the vendor's model? Logs available for 6 months? AI disclosure built in?), given the vendor-oversight pillar in AIHA.
7. **Two-tier output (ATRS model):** an internal register plus a public "how we use AI" guest notice.
8. **Light format:** spreadsheet or simple web form with drop-downs, about 15 required fields, and a review-date reminder. This answers the Dutch completeness lesson and SME capacity.
9. **Portfolio roll-up** for chains and asset managers (D2/D3 segmentation): the same schema aggregated across properties.

### Gaps
- No survey data found on **how many European hotels keep any AI inventory today**. Interviews (e.g. Accor, 19 Nov 2026) could ask, within the team's own guide.
- I did not verify whether any PMS/RMS vendor publishes an "AI transparency sheet" that could pre-fill a register.
- Legal confirmation is needed on whether a franchised property or the management company is the "deployer" in typical European hotel contracts.
