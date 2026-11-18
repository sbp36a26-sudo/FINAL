# Hotel AI Register: market, value and positioning

*18 Nov 2026. Researcher notes for the register review. Nothing in the tool was changed.*

**Evidence marks.** **[V]** read in the team's own files or the legal text as recorded in them. **[S] secondary**: seen only in a search-engine summary (page fetches were blocked); open the page before quoting. **[I]** my inference or proposal. No Wikipedia used.

**What was read first:** `tools/register/README.md`, `reports/Hotel AI register design.md` (17 Nov), `docs/PROJECT_CONTEXT.md`, `reports/Readiness check retention and trust.md`, the earlier benchmark `research_notes/Hotel AI register design/existing_registers_and_tools.md`, `reports/EU AI Act hospitality deep dive.md` (Art. 4, Art. 26, Art. 111(2)), and the register code (`src/app.js`, `data/*.json`) to see which fields exist. This file adds to the 17 Nov benchmark; it does not repeat it. New searches covered OneTrust, IBM, trail, the FLI checker, the Commission's Service Desk, the German Bundesnetzagentur tool, HOTREC, HOTELSTARS, AIHA, ISO 42001 in hospitality, insurers and hotel vendors.

---

## 1. Comparable tools (as of Nov 2026)

### 1a. Enterprise AI governance platforms

| Tool | Who it is for | What it does | Cost class | What a hotel would lack |
|---|---|---|---|---|
| **OneTrust AI Governance** | Large firms already on OneTrust for privacy/consent | Central registry of models, datasets, agents and vendors with owner and lifecycle status; detects AI use via integrations with model registries/MLOps; ready-made EU AI Act, NIST AI RMF and ISO 42001 assessment templates classifying into prohibited/high/limited/minimal ([OneTrust AI governance](https://onetrust.com/products/ai-governance/); [AI discovery and registry](https://www.onetrust.com/solutions/ai-governance/ai-discovery-and-registry/)) **[S, vendor marketing]**. Claims "Visionary" in Gartner's 2026 Magic Quadrant for AI Governance Platforms **[S, vendor claim]** | Enterprise, by quote **[S]** | Discovery assumes in-house models and MLOps; hotels buy AI inside SaaS (PMS, chatbot). No hotel uses, no operating-model (brand/manager/owner) logic, no hotel language |
| **IBM watsonx.governance** | Enterprises building and running models | Use-case and model inventory, risk scorecards, workflow, issue management, an "EU AI Risk Assessment" capability ([IBM pricing page](https://www.ibm.com/products/watsonx-governance/pricing); [IBM community blog 2024](https://community.ibm.com/community/user/watsonx/blogs/holly-vatter1/2024/06/19/what-the-eu-ai-act-means-for-you-and-how-to-prepar)) **[S]** | Essentials tier capped at 3 use cases and 1 inventory; paid figures conflict ($0.60 per resource unit; ~$38k/yr for 5 use cases on AWS Marketplace; $3,500–6,450/month per module) ([IBM pricing](https://www.ibm.com/products/watsonx-governance/pricing); [Superblocks](https://www.superblocks.com/blog/ai-governance-platform-pricing); [Fitgap](https://us.fitgap.com/products/017045/ibm-watsonx-governance)) **[S, do not quote]** | Same as OneTrust; the free tier's 3-use-case cap is below what a hotel runs (the register's own example hotel holds more) |
| **Credo AI, Holistic AI, Modulos** | Enterprise / mid-market | Inventory, policy packs, bias testing, shadow-AI discovery | Custom quote; "about $50,000/yr" for focused mid-market (vendor-attributed) ([Superblocks](https://www.superblocks.com/blog/ai-governance-platform-pricing)) **[S]**, already in the 17 Nov benchmark | Price, no hotel content |
| **Saidot** (FI) | Mid-market, public sector (built Amsterdam/Helsinki registers) | Inventory of systems, models, agents, datasets with AI Act classification | Only quoted prices in the market, conflicting: from ~€1,000/month to $1,500–3,500/month ([aicompliancevendors.com](https://aicompliancevendors.com/best/eu-ai-act-compliance-tools); [setaicomply.com](https://www.setaicomply.com/resources/best-eu-ai-act-compliance-software-smes)) **[S]** | €12k+/yr is far above an independent hotel's spend; no hotel content |
| **trail** (DE) | Enterprises; GRC teams | "AI Registry" for use cases, models, vendors, agents; EU AI Act, ISO 42001, NIST mapping; a free self-assessment for one use case on its site ([Capterra](https://www.capterra.com/p/10050355/trail-ML/); [OECD.AI catalogue](https://oecd.ai/en/catalogue/tools/trail)) **[S]**. One directory says it was acquired by Collibra on 5 Oct 2026 ([Legal Technology Hub](https://www.legaltechnologyhub.com/vendors/trail-by-collibra/)) **[S, single source, unverified]** | No public price; enterprise | As above |
| **SME-priced tools** (SetAIComply, ActReady, others) | SMEs, start-ups | Light register + classification | SetAIComply starter listed at 39/month for up to 5 AI systems ([GetApp](https://www.getapp.com/all-software/a/setaicomply/)) **[S]**; market range "EUR 5,000–30,000/yr for focused tools, EUR 100,000+ for enterprise GRC" (law-firm vendor blog) ([Legiscope](https://www.legiscope.com/blog/ai-act-compliance-software.html)) **[S]** | Generic; "5 AI systems" caps; vendor-owned data; no hotel catalogue |

**Reading [I]:** the enterprise products are built around *AI the company builds*; their discovery features plug into MLOps, which hotels do not have. Hotels' AI arrives inside bought software, and the register's real competitor at that price point is a spreadsheet.

### 1b. Free checkers

| Tool | Who it is for | What it does | What a hotel would lack |
|---|---|---|---|
| **Commission AI Act Service Desk: Compliance Checker** (part of the Single Information Platform, launched 8 Oct 2025, legal basis Art. 62(3)(b)) | Any operator | Interactive questionnaire: in scope? which duties? Plus the AI Act Explorer (article summaries, recitals) and a question form to the Service Desk ([Commission news](https://digital-strategy.ec.europa.eu/en/news/commission-launches-ai-act-service-desk-and-single-information-platform-support-ai-act); [Service Desk](https://ai-act-service-desk.ec.europa.eu)) **[S]**. Commentators call it "beta", "light on decision support", unable to account for a specific business model ([ZwillGen](https://www.zwillgen.com/artificial-intelligence/the-eus-ai-act-compliance-checker-explorer-whats-useful-today-whats-still-come/)) **[S]**. Launched in EN/FR/DE with 24 languages planned "early 2026"; current state not confirmed **[S]** | One system at a time; no list, no owner, no dates per tool, no follow-up; generic examples. **It is the authoritative free reference, so the register should link to it, not compete with it [I]** |
| **Future of Life Institute "EU AI Act Compliance Checker"** (artificialintelligenceact.eu) | SMEs, start-ups | Simplified, self-described work-in-progress questionnaire; FAQ says no API, cannot be embedded, seek legal advice ([FLI checker](https://artificialintelligenceact.eu/assessment/eu-ai-act-compliance-checker/)) **[S]**. Whether it reflects Reg. (EU) 2026/1744 was not confirmed **[S gap]** | Same as above |
| **Bundesnetzagentur "KI-Compliance-Kompass"** (DE market surveillance authority) | German SMEs | Free click-path, "under 15 minutes", covers prohibited/high-risk/transparency; part of the BNetzA AI Service Desk launched Jul 2025; BNetzA became the central AI Act authority in Germany from 29 Jul 2026 ([BNetzA Kompass](https://www.bundesnetzagentur.de/DE/Fachthemen/Digitales/KI/2_Risiko/kompass/start.html); [BNetzA press release 29 Jul 2026](https://bundesnetzagentur.de/SharedDocs/Pressemitteilungen/EN/2026/20260729_KI_VO.html); [IHK Hannover](https://www.ihk.de/hannover/hauptnavigation/innovation/innovation/technologien-trends/industrie-4-0-und-ki2/ki-verordnung-bundesnetzagentur-bietet-tool-zur-orientierung-6798440)) **[S]** | German only; one system; no inventory. **For German hotels a national authority's tool is the more defensible "second opinion"; the register should point to it per country [I]** |
| **European DIGITAL SME Alliance "AI Act Conformity Tool"** | Tech SMEs (mainly providers) | Conformity orientation ([DIGITAL SME](https://www.digitalsme.eu/ai-act-conformity-tool/)) **[S, not opened]** | Provider-oriented |
| **Other free checkers** (euaiact.com, checkcompliance.eu, eurocomply.app, regulation-ai.eu, aicomplyapp.eu, euaiactcompliancechecker.com) | Anyone | 5–13 questions, one system; several still showed pre-Omnibus high-risk dates (17 Nov benchmark) **[S]** | Out-of-date dates; no register |
| **govai-eu** (PyPI, open source) | Developers | Builds an inventory from a software list and tiers it ([PyPI](https://pypi.org/project/govai-eu/)) **[S]** | Not usable by a GM |

### 1c. ISO/IEC 42001 inventory practice

- 42001 Annex A asks organisations to document AI system resources (A.4.2–A.4.6), impact assessments (A.5) and lifecycle records including event logs (A.6); practitioners treat A.4.2 as the "AI register", updated when data, models, suppliers or responsible people change (17 Nov benchmark, [SureCloud](https://www.surecloud.com/resource-hub/iso-42001-annex-a-controls); [bastion.tech](https://bastion.tech/learn/iso42001/annex-a-controls)) **[S, standard is paywalled]**.
- **No hotel group was found with 42001 certification.** In hospitality the certificates found are vendors: Lolly (UK hospitality tech, Feb 2026, "first UK hospitality technology company") and AltexSoft (travel tech consultancy, Aug 2026) ([Eat Drink Sleep](https://eat-drink-sleep.com/2026/02/19/lolly-achieves-iso42001-first-uk-hospitality-technology-company-to-achieve-new-accreditation-for-ai-management/); [AltexSoft](https://altexsoft.com/news/altexsoft-renews-isoiec-270012022-and-earns-isoiec-420012023-certification-for-ai-management/)) **[S]**. An Oct 2026 preprint proposes a 42001-based governance framework using Hilton, Marriott, IHG and Wyndham as illustrations ([Preprints.org](https://www.preprints.org/manuscript/202610.0910)) **[S]**.
- **[I]** For hotels 42001 matters mainly *upstream*: "is the vendor 42001-certified?" is a cheap vendor question, and a register row that lines up with A.4/A.6 fields lets a chain's register feed a later 42001 programme. The register should say "aligned with", never "conforms to".

### 1d. Hospitality-specific

| Body / source | What exists | Inventory tool? |
|---|---|---|
| **AI Hospitality Alliance (AIHA)** governance framework, v1, 4 Oct 2026 | 5 pillars, 26 capabilities; pillar 1 = know what AI you use, assess risk, assign accountability; supporting tools include a "minimum viable governance model" and a vendor due-diligence questionnaire; proportionate, simplified records for small/independent operators; voluntary, standards-neutral, not legal advice ([Hospitality Net](https://www.hospitalitynet.org/news/4134775/hospitality-leads-the-way-with-a-first-of-its-kind-ai-governance-framework); [Lodging](https://lodgingmagazine.com/ai-hospitality-alliance-publishes-ai-governance-framework/)) **[S]** | Says *what* to inventory; no tool found, no AI Act label per hotel use. **Nearest neighbour; the register can be presented as "how to do AIHA pillar 1 in Europe" [I]**. Check the team's own `claude/D7_AIHA_Governance_Guide_Review_2026-11-16.md` for whether a template exists |
| **HFTP** | AI Collective with an Ethics and Governance subcommittee, an AI portal "in development"; Global Hospitality AI Coordinating Council with HSMAI and AHLA/HTNG (13 Nov 2026); Inntelo AI agents on HFTP channels (design report) **[S]** | None found; US-led, no AI Act content |
| **HOTREC** | Advocacy: asked Parliament to drop the legislative annex on AI at work; argues AI Act + GDPR + labour law already apply and SMEs need implementation support ([Journal des Palaces](https://www.journaldespalaces.com/en/pressrelease-76860-calling-for-a-balanced-and-non-legislative-approach-on-ai-at-work.html)) **[S]** | None found. **HOTREC's own "support, not new law" line is an opening: a free implementation tool is exactly what it asks for [I]** |
| **Hotelstars Union** | Criteria 2025–2030 (239 criteria) add digital alternatives (self check-in, kiosks); HSU launched its own GPT and AI bot in Dec 2025 and works on "AI visibility" of star ratings ([HSU press](https://www.hotelstars.eu/news/press-releases-hsu/article/artificial-intelligence-enhances-the-visibility-of-classified-hotels-hotelstars-union-has-launched-its-own-gpt-and-new-ai-bot-on-hotelstarseu); [Tageskarte](https://www.tageskarte.io/hotellerie/detail/neue-kriterien-fuer-hotelsterne-mehr-digitalisierung-und-nachhaltigkeit.html)) **[S]** | No AI governance criterion found. Next criteria cycle is a long-term route for "keeps an AI list" **[I]** |
| **DEHOGA, national associations** | No DEHOGA AI guide found in this search **[S gap]**; UMIH, HotellerieSuisse, UKHospitality not searched | — |
| **Hotel tech vendors** | HiJiffy publishes an AI Act explainer saying a hotel using its chatbot is a deployer whose job is to use it "properly and transparently" ([HiJiffy](https://www.hijiffy.com/resources/articles/eu-ai-act)) **[S, vendor framing; note the deep dive finds the Art. 50(1) chatbot notice is the provider's duty]**. No AI Act trust-centre page found for Mews or Oracle OPERA **[S gap]**. Oracle added AI to OPERA Cloud for existing customers at no cost, 16 Jun 2026 (design report) **[S]** | Vendor content is marketing; no neutral cross-vendor list |
| **Law-firm and trade guides** | compound.law hospitality AI Act guide (DE), Bird & Bird hotel-chain note (2024), Hotelinking practical AI guide (May 2026), Tageskarte articles (some with outdated dates) ([compound.law](https://compound.law/en-DE/ai-act/hospitality/); [Bird & Bird](https://cm.twobirds.com/en/insights/2024/global/deploying-ai-in-a-hotel-chain-how-to-mitigate-privacy-and-digital-regulatory-risk); [Hotelinking PDF](https://www.hotelinking.com/docs/PracticalGuideAI.pdf)) **[S]** | Prose, no record-keeping |

**Bottom line for Q1 [I]:** across ~20 tools and bodies, nothing found combines (a) a list of many tools, (b) hotel uses pre-filled, (c) an AI Act label with dates per tool, (d) hotel operating-model roles, (e) free and vendor-neutral. The absence is from searches, not proof.

---

## 2. What a hotel actually needs from a register

### 2a. Legal duty: is keeping an inventory required?

| Source of duty | What it requires | Does it require an inventory? |
|---|---|---|
| **AI Act Art. 4** (as replaced by Reg. 2026/1744, in force 27 Jul 2026) | Deployers "shall take measures to support the development of AI literacy" of staff using AI; no guaranteed level; not in the Art. 99(4) fine list ([deep dive](../../reports/EU%20AI%20Act%20hospitality%20deep%20dive.md), quoting Omnibus p.16) **[V in team files]**. Commission Q&A: no certificate; organisations "can keep an internal record of trainings" ([DLA Piper on the Q&A](https://www.dlapiper.com/insights/publications/2025/05/eu-ai-act-update-ai-literacy-questions-and-answers)) **[S]** | **No.** But you cannot target literacy measures without knowing who uses which tool. |
| **AI Act Art. 26** (high-risk only, from 2 Dec 2027 Annex III / 2 Aug 2028 Annex I) | Use per instructions, trained human oversight, keep logs ≥ 6 months, inform workers' representatives (design report) **[V]** | **No** explicit list, but impossible to meet without knowing which tools are high-risk. |
| **Art. 49 / 26(8)** | Registration in the EU database: providers, and public-authority deployers only **[V in team files]** | **No** for private hotels. |
| **Art. 111(2) legacy relief** | A high-risk tool genuinely in service before 2 Dec 2027 and not significantly changed escapes high-risk duties, if the hotel can prove go-live date and version (deep dive, row 14) **[V in team files]** | **No**, but only a dated record proves it. Strong practical reason to log "in use since" and version *now* [I]. |
| **Art. 99(7)** | Fines weigh negligence and steps taken (deep dive) **[V]** | A register is evidence of diligence. |
| **GDPR Art. 30** | Record of processing activities for controllers; derogation below 250 staff unless processing is not occasional or is risky (most hotels process guest data routinely) **[V for article]**. Omnibus IV proposal (21 May 2025) would lift the threshold to 750; adoption status in Nov 2026 not found ([Eubelius](https://www.eubelius.com/en/news/the-omnibus-iv-package-the-unexpected-gdpr-simplification); [EDPB-EDPS opinion](https://www.edps.europa.eu/system/files/2025-07/EDPS-EDPB-Press-Release_GDPR-Simplification_EN.pdf)) **[S]** | **Yes for processing**, and most AI tools in a hotel process personal data, so each AI tool should already appear in the RoPA. The register is the AI view of an existing legal file [I]. |
| **Labour law** (e.g. German works council co-decision on monitoring-capable devices; French CSE consultation) | Prior consultation before introducing a tool (design report, booklet) **[V that the team files say this]** | No list, but you need one to know what to consult on. |

**Honest summary [I]:** no law makes a private hotel keep an "AI register". The register is the cheapest way to *show* Art. 4 measures, sort tools before 2 Dec 2027, preserve Art. 111(2) evidence, and keep the GDPR record complete. The tool already says "items to check, not a verdict"; it should also say plainly "the AI Act does not require this list; here is why you want it anyway".

### 2b. Practical uses by role

| Role | Main use | What it needs from the register | Today in the prototype? (code read 18 Nov) |
|---|---|---|---|
| **Independent GM** | Find out what AI is already running; know what to do this year | Pre-filled list by department, plain label, 3–5 actions, one page to file | Yes: catalogue, labels, To do, PDF |
| **Chain CIO / DPO** | Approved-vendor list, roll-out to properties, vendor due diligence, link to RoPA and DPIA | Central vs property tier, vendor questions, RoPA reference, export to their GRC tool | Partly: vendor questions, "decided by brand/head office", CSV. No RoPA link field, no multi-property |
| **Owner / asset manager** | Risk and cost per asset; due diligence at sale, re-brand, operator change; who pays for compliance | One-page extract per property: high-risk count, open items, cost, contract end, who decided | Partly: PDF summary. **No cost, contract end, status or review date fields** (tool entries hold name, vendor, dept, owner, origin, decided, since, notes) |
| **HR / department heads** | Know which tools touch staff; works-council timing | Filter by "affects staff", consultation step per country | Labels and country notes yes; no filter view |
| **Training lead** | Art. 4 measures | Users per tool, briefing done/date | Literacy appears as a generic item; **no per-tool "who uses it / briefed on" record** |
| **Insurance / broker** | Renewal questionnaires increasingly ask about AI use; carriers have filed AI exclusions; underwriters want "a systematic approach" ([Insurance Business](https://www.insurancebusinessmag.com/us/news/sme/ai-liability-emerges-as-the-new-cyber-for-smes-571240.aspx); [IT Brew](https://www.itbrew.com/stories/2025/12/18/how-to-prepare-as-cyberinsurers-incorporate-ai-risks)) **[S, trade press; Delinea "42% have AI exclusions" has no visible base, do not quote]** | Exportable list of AI tools with data and autonomy flags | CSV yes; no "acts without sign-off" or "touches card data" column in the export |
| **Brand standards** | Brands control core systems via approved lists and waivers (IHG–OPERA Cloud, US FDDs; design report) **[S]** | "Imposed by brand" flag; waiver moment = new entry | Flag yes |
| **Regulator scrutiny** | Trade press reports regulators looking at guest-data sharing, vendor oversight, automated decisions; the UK CMA probe into Hilton, IHG, Marriott and CoStar over pricing data shared through an analytics tool ([Hotel Management Network, 27 Apr 2026](https://www.hotelmanagement-network.com/news/regulators-turn-attention-to-hotel-ai-governance/); [Foster Garvey](https://www.foster.com/newsroom/blog/duff-on-hospitality-law/ai-commerce-hits-a-reality-check-as-regulators-circle-the-travel-industry/)) **[S]** | Competition-law tag on pricing/benchmarking tools | Booklet has a Competition tag; check it reaches the register's RM entries |

---

## 3. The gap, the HFTP reference position, and return visits

### 3a. The gap [I]
1. **Content, not software.** The 91 hotel uses with a label, deciding questions and dates are what no competitor has. The enterprise platforms have better software and no hotel content; the free checkers have authority and no list.
2. **Roles in hotel set-ups.** Owner / manager / franchisee / brand / employer are separate fields here; nowhere else.
3. **Price and data ownership.** Free, no login, data stays in the hotel's browser or file. This matches HOTREC's "implementation support for SMEs" ask and the owners' privacy concern (Wyndham owner survey, 46% data privacy first, base 325 North American owners; design report) **[S]**.
4. **Honest dating.** Several free checkers and trade articles still show the wrong high-risk date (17 Nov benchmark) **[S]**; a tool that shows "law as of" and a dated watch list is differentiated by being right.

### 3b. What would make it a reference HFTP could put its name on [I]
- **Signed-off content with a named reviewer**: D7 owner sign-off now; a qualified lawyer's review of the label file before HFTP branding (the Readiness check report already lists this sign-off chain).
- **Visible method and provenance**: each label shows its basis (law text / Commission guidance / draft / team reading), already partly in `uc-labels.json`; plus a link to the Commission Compliance Checker and the national authority tool for a second opinion. Pointing *to* official tools is what makes a neutral association's tool credible.
- **Alignment statements**: "maps to AIHA pillar 1", "fields line up with GDPR Art. 30 and ISO 42001 A.4/A.6". Gives chains a reason to use it and lets HFTP sit alongside AIHA rather than compete.
- **Versioned releases with a changelog** and "last checked" date that turns into a warning when stale (design report proposed 90 days).
- **A named maintainer and a funding line** (see 4c). Without it, HFTP should not brand it.
- **No vendor logos, examples only** (HFTP "no-sales" stance; design report) **[S]**.

### 3c. What brings hotels back [I, consistent with the Readiness check findings]
The Readiness report's lesson holds: voluntary tools are revisited only when something outside forces it. For a register there are real outside triggers, which the readiness check lacked:

| Trigger | Date / frequency | What the register must do |
|---|---|---|
| New prohibitions and content-marking | 2 Dec 2026 **[V in radar.json]** | Flag affected entries on open |
| Final high-risk classification guidelines | Expected end 2026, may slip **[V in radar.json]** | Re-label "draft guidance" rows; show "2 of your tools affected since your last visit" |
| Annex III high-risk duties | 2 Dec 2027 **[V]** | Countdown on HR/staff tools; Art. 111(2) evidence prompt before the date |
| Annex I products | 2 Aug 2028 **[V]** | Kitchen/engineering entries |
| Vendor update switches on AI | Unscheduled (e.g. OPERA Cloud June 2026) **[S]** | "How it arrived: vendor update" + quarterly "check release notes" item |
| New tool purchase / brand waiver | Per decision | Add-a-tool flow is the entry point |
| Contract renewal | Per tool | **Needs a contract-end field** |
| Annual RoPA / budget / owner report | Yearly | Yearly review date per tool; owner extract |
| Insurance renewal | Yearly | Export with data/autonomy flags |
| Works-council or staff change | Ad hoc | Consultation item per country |

Mechanically, since the platform cannot email (Readiness report §5), return visits rely on (a) the hotel's own calendar: offer each date as copy-ready text, not an .ics; (b) a "since your file was saved" diff on load, which needs each entry to store the rules version it was labelled with (not done today: `REF.meta.version` is shown globally but not stored per entry); (c) HFTP's channels announcing each watch-list change, which is a distribution job for HFTP, not code.

---

## 4. Risks

| Risk | How bad | Mitigation in place | Gap / proposal [I] |
|---|---|---|---|
| **False confidence from a label.** "Minimal" reads as "no duty"; Art. 50(1) chatbot notice being the provider's duty reads as "nothing to do"; legacy relief misread | High | "Items to check, not a verdict", "not legal advice", law-as-of date, differs-from-booklet markers, basis per row | Say on every label what it does *not* cover (GDPR, labour, consumer, competition still apply; the deep dive finds those are the laws with a hospitality fining record). Put "Minimal for the AI Act ≠ no legal duty" in the label text itself. Never show a green tick/score (lesson from the Readiness check's 0–100 failure) |
| **Liability for an association-branded tool** | Medium–high for HFTP's reputation; legal exposure depends on jurisdiction and terms (not researched; needs counsel) | Prototype says "EHL students for HFTP" | Keep "prepared for HFTP by EHL SBP Group 36" until HFTP's counsel approves; add terms of use (informational, no reliance, no advice) reviewed by HFTP counsel; version and date on every export; no wording that implies certification or endorsement ("HFTP-approved", "compliant") |
| **Law going stale after the project** | Certain, not possible: final high-risk guidelines and Art. 2(13) delegated acts are due within a year | Dated `radar.json`, `lastChecked`, maintainer note | Staleness banner after 90 days; freeze as "as at hand-over" if no owner named; hand-over pack: source list, monthly routine, est. time (~2–4 h/month is my guess, unmeasured); candidate owner = HFTP AI Collective Ethics & Governance subcommittee, or a recurring EHL student project / EHL faculty partner |
| **Privacy of a hotel's tool list** | Medium: a list of tools, vendors, owners' names and open items is commercially sensitive and could feel like self-incriminating evidence | Browser-only storage, file backup, no server | Keep it that way for the member edition. Responsible-person field: suggest role, not name. Before any shared/team version, the Readiness report's four conditions apply (access lock, notice, opt-in sharing, named controller). Never pool hotel data into HFTP "benchmarks" without a separate consent design |
| **Content error in the 91 labels** | High | 99 tests, booklet comparison, D7 sign-off pending | Lawyer review sample; publish the label table openly (already in "How it works") so errors are found |
| **Positional IDs** (`hr-2`) break saved files if the catalogue changes | Medium | Build fails on order change | Freeze stable IDs before any hotel saves a file |
| **Unverified "17 market uses"** from search summaries | Low–medium | Marked provisional | Keep marked; verify before HFTP release |

---

## 5. Recommended improvements, ranked by value

Cost: **cheap** = hours to ~2 days in the current code/data; **medium** = several days or needs sign-off from others; **expensive** = needs hosting, accounts, counsel or ongoing staff.

| # | Improvement | Why (value) | Cost | Where |
|---|---|---|---|---|
| 1 | **D7 sign-off of `uc-labels.json`, then an external legal review of a sample and a "basis" chip on every label** (law text / guidance / draft / team reading) | Nothing else matters if a label is wrong under HFTP's name | Medium (people, not code) | Sign-off: prototype. Lawyer review: before HFTP release |
| 2 | **Per-label "what this does not cover" line** ("Minimal under the AI Act; GDPR record, works council and consumer law may still apply") and link out to the Commission Compliance Checker and the country's authority tool (e.g. BNetzA Kompass) | Cuts false confidence; borrows official authority; costs almost nothing | Cheap | Prototype |
| 3 | **Store the rules version and date on each entry; on opening a saved file show "since you last saved: 2 tools affected by changes"** linked to `radar.json` | The single real return-visit mechanism; no competitor does it | Cheap–medium | Prototype |
| 4 | **Money and lifecycle fields: status (proposed/pilot/live/retired), annual cost, contract end, next review date, version in use** | Owners and controllers (HFTP's core audience) get their view; contract end and review date are the natural return triggers; version + "in use since" preserve Art. 111(2) legacy evidence | Cheap | Prototype |
| 5 | **Per-tool Art. 4 record: who uses it (roles), briefed yes/date** and a "GDPR record ref / DPIA done" field | Turns the register into evidence for the one AI Act duty in force for every hotel and links to the legal file hotels already keep | Cheap | Prototype |
| 6 | **Owner/insurer one-pager**: page 1 of the PDF shows count by label, high-risk countdown to 2 Dec 2027, open items, total cost, tools touching staff/card data/acting without sign-off | Makes the output worth forwarding (Readiness lesson) and answers insurer and owner questions | Cheap–medium | Prototype |
| 7 | **"Dates for your calendar" block**: each upcoming date affecting *this* hotel's tools as copy-ready text; quarterly "check vendor release notes for new AI features" item | Return triggers without email; catches AI arriving by update | Cheap | Prototype |
| 8 | **Alignment statement and field map**: AIHA pillar 1, GDPR Art. 30, ISO 42001 A.4/A.6, NIST GOVERN 1.6, with "aligned with, not certified" wording; CSV columns named to import into a chain's GRC tool | Lets chains adopt it and lets HFTP position it beside AIHA, not against it | Cheap (text) / medium (verified mapping) | Text: prototype. Verified mapping: HFTP product |
| 9 | **Governance pack for hand-over**: terms of use reviewed by HFTP counsel, named maintainer, monthly source-check routine, staleness banner after 90 days, frozen-mode if no owner | Decides whether HFTP can brand it at all | Medium (prototype: banner + hand-over note) / Expensive (counsel + maintainer time) | Banner and note: prototype. Counsel and maintainer: HFTP |
| 10 | **Group/portfolio edition with accounts**: central approved list + property tier, multi-property roll-up for chains and asset managers, shared storage with access control | Chains and owners need it, but it needs hosting, security review, a data controller and data agreements | Expensive | Later HFTP product (D8/D10 recommendation) |

Not recommended now [I]: a numeric compliance score or traffic-light "compliant" badge (Readiness check showed scores can be gamed and read as verdicts); a live news feed (cannot be verified; the free checkers' wrong dates show the risk); a vendor-rated directory (conflicts with HFTP's no-sales stance).

---

## 6. Open items and gaps in this research

- All market facts are **secondary**. Before any figure reaches a deliverable, open: Commission Service Desk checker page (current languages, Omnibus update), FLI checker, BNetzA Kompass, OneTrust and IBM pricing pages, AIHA framework PDF (does it contain an inventory template?).
- Legal exposure of an association publishing a free compliance aid was **not researched**; needs HFTP's counsel (US nonprofit; EU users).
- Omnibus IV GDPR Art. 30 threshold (250 → 750): adoption status unknown in Nov 2026.
- No survey found on how many European hotels keep any AI inventory; the team's interviews (Accor 19 Nov) can observe this within existing guides without adding questions.
- Not searched: UMIH, HotellerieSuisse, UKHospitality, Mews/Oracle trust centres in depth, law-firm checkers (Taylor Wessing, Bird & Bird).
