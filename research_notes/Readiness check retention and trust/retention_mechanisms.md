# Retention and re-engagement mechanisms for B2B self-assessment and benchmarking tools (for the HFTP hotel AI readiness check)

State as of 18 Nov 2026.

**Read this first: source status.** Page fetches were blocked in this session (hosts `european-digital-innovation-hubs.ec.europa.eu`, `www.ncsc.gov.uk` and `bcorporation.eu` did not resolve; they would have to be allowed in the session's network settings). Every web finding below therefore rests on search-result summaries and is marked **[secondary]**. None was read in the original. Figures should be checked against the linked page before they go into a deliverable. Findings marked **[project]** come from the team's own verified AI Act notes in this repo.

---

## 1. Which mechanisms do repeat-use assessment and benchmarking products rely on?

### Takeaway
The assessment tools that are actually repeated are almost all repeated because an outside event forces or rewards it: a funding rule (EDIH DMA at T0/T1/T2), a certificate that expires (Cyber Essentials 12 months, Green Key, BREEAM In-Use 3 years, B Corp 3 years) or a data feed that arrives on a fixed rhythm (STR weekly/monthly). Free, voluntary graders with no such anchor (HubSpot Website Grader) are built for one visit and lead capture, not for return use.

### Cited Findings

**EU Digital Maturity Assessment (EDIH network): re-assessment built into a programme**
- The DMA is mandatory before any substantial EDIH intervention with an SME or public-sector organisation, and must be completed three times per substantial intervention. [secondary] — [EDIH DMA FAQ, 6 Mar 2024](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2024-03/DMA-FAQ_06-03-2024.pdf)
- Schedule: T0 just before the intervention (up to six months before support starts), T1 one year after T0 (after the intervention has ended), T2 two years after T1; the English FAQ gives T2 as 18 to 24 months after support was delivered. The windows are stated slightly differently across language versions. [secondary] — [EDIH DMA FAQ, 30 Aug 2024](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2024-08/DMAT-FAQ_30-08-2024.pdf)
- Results are designed for before/after comparison: T1 against T0 and T2 against T1 show the gain. [secondary] — [JRC DMA tool presentation, 16 Feb 2023](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2023-02/dma_tool_16.02.2023_presentation.pdf)
- A Dec 2024 JRC presentation reports that 90% of firms raise their score in the second assessment, and that a longer gap between T0 and T1 goes with higher scores. Base (number of firms with both T0 and T1) not visible in the search summary; must be read from the slides. [secondary] — [J. Stake, Digital Maturity Assessment Tool, Dec 2024](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2024-12/01_Johan%20Stake_Digital%20Maturity%20Assessment%20Tool.pdf)

**B Impact Assessment (B Lab): saved answers, improvement report, expiry**
- Certified B Corps must update the B Impact Assessment and re-verify their score every three years, or after a change of control or IPO. Since 1 July 2024 the updated assessment is due six months before the recertification date, which is shown on the BIA dashboard. [secondary] — [B Lab knowledge base, How to Recertify](https://kb.bimpactassessment.net/support/solutions/articles/43000492911-how-to-recertify-as-a-b-corp)
- In the years between certifications B Corps must publish an annual impact report. [secondary] — [B Lab UK, After you certify](https://bcorporation.uk/b-corp-certification/after-you-certify/)
- Recertification is an update of earlier answers, not a restart: "unlikely that a business will have to start the assessment from scratch". [secondary] — [B Lab UK, Recertification: demonstrating continuous improvement](https://bcorporation.uk/reinventing-business/by-b-lab-uk/recertification-demonstrating-continuous-improvement-on-the-b-corp-journey/)
- The tool includes an "Improvement Report" that lists concrete ways to raise the score. [secondary, from a B Lab Australia page] — [B Lab AU/NZ](https://bcorporation.com.au/?p=5327)
- European B Corps raised their score by 4.14 points (5.2%) on average at their most recent recertification. Base (how many B Corps, which years) not visible in the summary. [secondary] — [B Lab Europe, Behind the Journey of Continuous Improvement of B Corps](https://bcorporation.eu/blog_post/behind-the-journey-of-continuous-improvement-of-b-corps)
- The new B Lab standards add progress checkpoints at years 3 and 5. [secondary; vendor article by Sweep] — [Sweep, New B Corp standards](https://www.sweep.net/insights/new-b-corp-standards-what-businesses-need-to-know)

**Cyber Essentials (UK NCSC / IASME): free readiness tool feeding an annually expiring certificate**
- The free Cyber Essentials Readiness Tool (built and run by IASME for NCSC) ends in a downloadable "Readiness Action Plan" listing the areas to fix before applying; the user then moves on to the official self-assessment questionnaire. [secondary; summary drawn from a consultancy page describing the tool] — [GRC Solutions, IASME's Cyber Essentials Readiness Tool](https://grcsolutions.io/are-you-ready-for-cyber-essentials/); tool leaflet: [NCSC Readiness Tool leaflet](https://www.ncsc.gov.uk/files/Cyber-Essentials-Readiness-Tool-Leaflet.pdf)
- Readiness Tool usage: 8,815 uses by organisations between Aug 2025 and Sep 2026, micro organisations the largest group (3,112). [secondary] — [NCSC Annual Review 2026](https://www.ncsc.gov.uk/collection/annual-review-2026/building-strong-foundations/strong-foundations-matter). Earlier cumulative figure: 11,181 users since launch. [secondary] — [NCSC Annual Review 2021](https://www.ncsc.gov.uk/collection/ncsc-annual-review-2021/ecosystem/setting-standards-certifying-professional-practice-and-assuring-services-and-products). The two are not comparable (annual count of uses vs cumulative users).
- Certification lasts 12 months and must be renewed each year; the requirements are revised yearly. [secondary; vendor guidance] — [SureCloud, Cyber Essentials renewal](https://www.surecloud.com/resource-hub/cyber-essentials-renewal)
- Volumes: 37,298 Cyber Essentials and 11,950 Cyber Essentials Plus certifications, Apr 2024 to Mar 2025. [secondary] — [NCSC Cyber Essentials brochure](https://www.ncsc.gov.uk/files/Cyber-Essentials-brochure.pdf). A trade report gives 61,430 certificates for Jul 2025 to Jun 2026. [secondary; vendor blog] — [CyberSmart, Apr 2026](https://cybersmart.co.uk/2026/04/cyber-essentials-supply-chain-pledge-danzell-2026/). Different periods and sources; note that an article dated Apr 2026 cannot report a period ending Jun 2026, so this figure is suspect until checked.

**Hotel sustainability schemes: expiry and "more each time"**
- Green Key's process from Oct 2026: for renewal the establishment again completes application, audit and certification decision; renewal requires increased conformity with the criteria; the certificate is valid for two years. [secondary] — [Green Key, Certification Process from October 2026](https://greenkey.global/certification-process-2026-2031)
- Older Green Key material describes a one-year certificate renewed annually, with on-site audits in years one and two and then every third year, and document checks in between. [secondary] — [Keep Scotland Beautiful, Green Key](https://www.keepscotlandbeautiful.org/green-key/). This conflicts with the two-year validity above and most likely reflects the pre-Oct-2026 system.
- Green Key is one of the verifiers of Hotel Sustainability Basics; its application tool has a draft (save) function, and verification only starts once the full application is submitted. [secondary] — [Green Key, Hotel Sustainability Basics](https://greenkey.global/sustainabilitybasics)
- BREEAM In-Use Version 6 certificates are valid three years (the 2015 version was one year). [secondary] — [BREEAM In-Use fee sheet, 1 May 2025](https://byggalliansen.no/wp-content/uploads/2025/04/BREEAM-In-Use-Fee-Sheet-1-May-2025.pdf). V6 lets an asset update its mid-cycle performance and get an updated certificate. [secondary] — [BREEAM knowledge base, Recognising future performance](https://kb.breeam.com/knowledgebase/recognising-future-performance/)

**STR / CoStar benchmarking: the hotel industry's existing return habit**
- STAR reports go to participating hotels weekly, monthly and annually. [secondary] — [EHL Hospitality Insights, Hotel STAR reports and STR data](https://hospitalityinsights.ehl.edu/hotel-industry-performance)
- The sample covers more than 80,000 participating properties. [secondary] — [CoStar, How competitive sets lead hoteliers to informed business decisions](https://www.costar.com/en-gb/strategic-success-unveiled-how-competitive-sets-lead-hoteliers-informed-business-decisions)
- A competitive set needs at least three hotels (four preferred); STR needs data from at least four hotels to compute comp-set figures and otherwise falls back to submarket or class averages. Document dated 2019; thresholds should be checked against current guidelines. [secondary] — [STR, How to read a STAR report](https://str.com/sites/default/files/2019-07/how-to-read-star-report.pdf)
- Participants see only aggregated comp-set results, not individual hotels. [secondary; student course folio, weak source] — [UBC web folio](https://blogs.ubc.ca/yingyingengl301/files/2018/04/web-folio-1.pdf)

**HubSpot Website Grader: the one-shot counter-example**
- HubSpot states it has graded over 1 million unique websites since 2008. [secondary; vendor's own claim] — [HubSpot, Does Your Website Make the Grade?](https://blog.hubspot.com/marketing/does-your-website-make-the-grade). A "4 million" figure also circulates; it belongs to the separate Marketing Grader and should not be mixed in. [secondary] — [HubSpot press release via PR Newswire](https://prnewswire.com/news-releases/hubspot-launches-comprehensive-free-marketing-grader-tool-after-grading-4-million-websites-135091323.html)
- An early feature let users compare their site with other sites. [secondary] — [HubSpot blog, New compare websites feature](https://blog.hubspot.com/blog/tabid/6307/bid/2679/new-compare-websites-feature-in-website-grader.aspx)

### Inferences
- Mechanism map from the examples above (which product uses what):

| Mechanism | Seen in | What makes people come back |
|---|---|---|
| Re-assessment at fixed points (before/after) | EDIH DMA (T0/T1/T2) | A programme rule; a hub adviser asks for it |
| Saved answers, update not restart | B Impact Assessment, Green Key draft function | Lower effort on the second run |
| Action plan as the output | Cyber Essentials Readiness Tool, BIA Improvement Report | The plan is the reason to return and check off |
| Expiry date / renewal | Cyber Essentials (12 months), Green Key (2 years from Oct 2026), BREEAM In-Use V6 (3 years), B Corp (3 years) | A dated deadline with a consequence |
| Rising bar at renewal | Green Key ("increased conformity"), B Lab new standards (year 3 and 5 checkpoints) | Same score is no longer enough |
| Peer benchmark on a fixed rhythm | STR STAR (weekly/monthly) | New data arrives; it feeds revenue meetings and owner reports |
| Human support attached | EDIH (hub runs the DMA with the firm), Green Key (auditor), BREEAM (licensed assessor) | Someone outside the firm prompts the next round |
| Free grader as lead capture | HubSpot Website Grader | Nothing; built for one visit |

- The HFTP check has no certificate and no funding rule, so it sits closest to the Cyber Essentials Readiness Tool and the DMA: a free self-check whose value on a second run is "did the gaps close?". Its return hook has to come from the user's own calendar (budget, purchase, pilot end, rule dates) and from HFTP as the human prompt (chapter meetings, events, newsletter), not from the tool itself.
- A dated result ("valid as of ...; re-check after ...") borrows the working part of certification (an explicit shelf life) without claiming to certify anything.
- STR shows that hotel managers already accept a recurring benchmark when it is aggregated, anonymous and tied to a reporting rhythm. A peer benchmark in the readiness check would need the same two rules: a minimum group size before any comparison is shown (STR uses four reporting hotels) and no view of individual properties.
- The 90% DMA improvement figure should not be used as proof that re-assessment causes improvement: firms retake it after a funded intervention, and those who retake may differ from those who do not.

### Gaps
- No public figure found for how many DMA firms complete T1 or T2 as a share of those who did T0 (the real "retention rate" of the best comparable tool). The Dec 2024 JRC slides may contain it; host blocked.
- No figure found for repeat use of the Cyber Essentials Readiness Tool by the same organisation, nor whether it needs a login.
- Hotel Sustainability Basics renewal cycle not found; only Green Key's role as verifier.
- No source found on consultancy maturity assessments (e.g. Big Four or strategy-firm AI maturity checks) and how often clients repeat them.
- No data on portfolio views or multi-user input as return drivers in any of the named tools.
- No count found of companies using the B Impact Assessment without certifying.

---

## 2. What evidence exists on what drives return usage in B2B tools?

### Takeaway
Hard evidence specific to B2B assessment tools is thin. What exists is (a) habit research showing that repeated behaviour is cued by a stable context rather than by motivation, (b) product-analytics benchmarks showing that most B2B software loses most new users within three months, and (c) email-vendor data showing that triggered messages outperform scheduled broadcasts. (b) and (c) come from vendors measuring their own customers.

### Cited Findings

**Habit research (academic)**
- Habits form when a response is repeated in a particular context, creating an association between the response and recurring context cues; once formed they are brought to mind by the cue without the original goal. [secondary] — [Wood & Neal 2007, Psychological Review](https://dornsife.usc.edu/wendy-wood/wp-content/uploads/sites/183/2023/10/wood.neal_.2007psychrev_a_new_look_at_habits_and_the_interface_between_habits_and_goals.pdf)
- When the cues for existing habits are removed (new job, move), it is easier to form a new behaviour; habit formation is cited as taking 15 to 254 days, with no simple formula. [secondary; press summary of Wood's work] — [ScienceDaily, Aug 2014](https://www.sciencedaily.com/releases/2014/08/140808111931.htm)

**Deadlines and reminders (field experiments)**
- Field experiment, about 3,276 participants (described as nationally representative), short online survey: completion was lowest with a one-month deadline, higher with one week, highest with no deadline. Authors' reading: a long deadline signals permission to delay, which leads to forgetting. [secondary] — [Knowles et al., working paper](https://nzae.org.nz/wp-content/uploads/2017/01/Knowles_Stephen.pdf); summary: [Macquarie University Lighthouse, Nov 2021](https://lighthouse.mq.edu.au/article/november-2021/New-study-unlocks-secret-to-avoiding-procrastination)
- Related work cited in the same literature: reminders reduce inattention, and weekly reminders were no more effective than monthly ones (Sonntag & Zizzo 2015, charitable giving). [secondary; cited via another paper, not read] — [MPRA paper 69621](https://mpra.ub.uni-muenchen.de/69621/1/MPRA_paper_69621.pdf)
- A contrary result exists: one Games and Economic Behavior study found deadlines did not raise completion. [secondary] — [GEB paper](https://bpb-us-e1.wpmucdn.com/wp.nyu.edu/dist/c/16384/files/2021/07/1-s2.0-S0899825619301757-main.pdf)

**B2B product retention and activation benchmarks (vendor data, flagged)**
- About 30% of users are still returning to a software product three months after first use (average across products in Pendo's customer base, not B2B-only, not a median); best-in-class (90th percentile) is 57%. Vendor data. [secondary] — [Mind the Product / Pendo benchmark findings](https://mindtheproduct.com/products-on-average-retain-30-of-customers-after-3-months-product-benchmark-findings); [Pendo, user retention rate benchmarks](https://pendo.io/pendo-blog/user-retention-rate-benchmarks/)
- Median activation rate 37.04% across 62 B2B SaaS companies; the wider Userpilot 2025 report covers 547 SaaS companies. Vendor data; the year of the 37.04% figure is unconfirmed. [secondary] — [Userpilot, SaaS product metrics](https://userpilot.com/saas-product-metrics/)
- B2B SaaS day-1 activation is 35% lower than across all companies in Amplitude's benchmark set (data Sep 2023 to Sep 2024; sample size not visible). Vendor data. [secondary] — [Amplitude, B2B technology product benchmarks](https://amplitude.com/blog/b2b-technology-product-benchmarks)
- Revenue retention (paid SaaS, less relevant to a free tool): 2025 median net retention 101%, gross 91%, private B2B SaaS above $1M ARR; sample size not visible. [secondary] — [SaaS Capital 2025 retention benchmarks](https://www.saas-capital.com/research/saas-retention-benchmarks-for-private-b2b-companies/). A blog gives 106% NRR; conflicting and unsourced. [secondary; vendor blog] — [Wudpecker](https://www.wudpecker.io/blog/retention-benchmarks-for-b2b-saas-in-2025?src=feed)

**Lifecycle email (vendor data, flagged)**
- Triggered emails 4.4% click rate vs 2.3% for scheduled sends (NP Digital, Apr 2025; base not visible). Vendor blog. [secondary] — [Neil Patel / NP Digital](https://neilpatel.com/marketing-stats/trigger-based-vs-scheduled-email-performance/)
- Journey-based emails 26% open rate, 2.89x broadcast, in the travel and hospitality cut of MoEngage's 2025 Email Benchmarks Report. Vendor report; consumer travel marketing, not B2B. [secondary] — [MoEngage press release](https://prnewswire.com/news-releases/moengages-email-benchmarks-report-reveals-a-shift-in-personalization-trends-for-2025-302351715.html)
- Open rates are inflated by Apple Mail Privacy Protection, so clicks are the safer comparison. The largest sample found was MailerLite's 3.6 million campaigns across 181,000 accounts (Dec 2024 to Nov 2025), which does not split triggered from broadcast. [secondary; aggregator] — [Prospeo, Statistics on email marketing](https://prospeo.io/s/statistics-on-email-marketing)

### Inferences
- The habit literature argues against expecting a habit at all here. A readiness check used a few times a year is far below the repetition frequency habit research describes; the realistic model is "episodic tool tied to recurring occasions", like an annual budget template, not a daily product.
- The useful part of habit research for this tool is the cue: attach the re-check to a context that already recurs in a hotel (budget cycle, owner report, purchase approval) instead of sending free-floating reminders.
- The deadline experiment suggests reminders should carry a near date and a concrete reason ("your pilot ended 30 days ago") rather than a distant one ("re-check within a year").
- The product benchmarks set expectations for the team: if roughly 30% three-month return is average for software people use at work, a free occasional self-assessment should expect a much lower repeat rate. Success is better measured as "share of users who come back at least once within 12 months" than as monthly active use.
- "Jobs to be done" framing fits better than engagement framing: the job is "decide whether we are ready to buy or scale X" or "show the owner we have this under control". Each job recurs with a decision, which gives the return trigger.

### Gaps
- No independent (non-vendor) benchmark found for return rates to free B2B assessment or grader tools.
- No B2B-only median for month-3 retention confirmed; Pendo and Amplitude pages need to be opened with the B2B filter.
- No peer-reviewed meta-analysis on reminder effectiveness or planning prompts (implementation intentions) was retrieved in this session; these exist in the literature but were not found and are not cited.
- Fogg Behavior Model and "Hooked"-style habit loops: not retrieved from a primary source; both are practitioner frameworks, not evidence, and no figures are attributed to them here.
- No HBR or academic study on B2B engagement specifically was retrieved.

---

## 3. Which triggers are natural for this tool?

### Takeaway
The dated EU AI Act milestones give three fixed, credible reasons to re-check; the rest of the natural triggers are events in the hotel's own calendar (purchase, pilot end, budget, owner report, new manager), which the tool can only catch if it asks the user for the date at the end of the first run.

### Cited Findings
- The Digital Omnibus on AI, Regulation (EU) 2026/1744, was published in the Official Journal on 24 July 2026 and entered into force on 27 July 2026. [secondary] — [Lewis Silkin, The Digital Omnibus on AI enters into force today](https://www.lewissilkin.com/insights/2026/07/27/the-digital-omnibus-on-ai-enters-into-force-today-102nedo)
- New application dates: 2 December 2027 for stand-alone (Annex III) high-risk systems, 2 August 2028 for high-risk AI embedded in products (Annex I). [secondary] — [Leaseurope, New application dates for high-risk AI system rules](https://www.leaseurope.org/new-application-dates-high-risk-ai-system-rules); [FPF, AI Act implementation timeline under the AI Omnibus](https://fpf.org/blog/the-ai-act-implementation-timeline-what-changes-under-the-ai-omnibus)
- 2 December 2026: new prohibited-practice points Art. 5(1)(ba), (bb) and Art. 5(1a), (1b) apply; and generators placed on the market before 2 August 2026 must comply with the Art. 50(2) marking duty by this date (Art. 111(4)). [project; verified against the Omnibus text by the team's fact-check, not re-verified here] — `/home/user/final/research_notes/EU AI Act hospitality deep dive/challenge_fact_check.md` (rows 19, lines 147 to 149). The web search in this session did not confirm what applies on 2 Dec 2026.
- The general application date of 2 August 2026 was left unchanged by the Omnibus. [secondary] — [Shumaker client alert](https://www.shumaker.com/insight/eu-ai-act-council-gives-final-green-light-to-the-digital-omnibus-on-ai/)
- The DMA model shows the "after the intervention" re-check as an established pattern: T1 is taken once the intervention has ended. [secondary] — [EDIH DMA FAQ, 30 Aug 2024](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2024-08/DMAT-FAQ_30-08-2024.pdf)
- Life or role transitions remove old cues and make new behaviour easier to adopt. [secondary] — [ScienceDaily summary of Wood](https://www.sciencedaily.com/releases/2014/08/140808111931.htm)
- Hotels receive STAR benchmarking weekly and monthly, so a monthly reporting rhythm already exists at property level. [secondary] — [EHL Hospitality Insights](https://hospitalityinsights.ehl.edu/hotel-industry-performance)

### Inferences
Fit of each candidate trigger (my assessment, not sourced):

| Trigger | Who has the date | Fit | How the tool can use it |
|---|---|---|---|
| Before buying a tool | User | Strong: this is the tool's core job | Entry point "I am about to buy"; result framed as go / fix first |
| After a pilot ("did the gaps close?") | User | Strong: mirrors DMA T0/T1 | Ask for the pilot end date; offer a calendar entry; re-run shows before/after |
| Budget time | User (differs by hotel and group) | Strong for owners and CIOs | Ask "when is your next budget round?"; do not assume a month |
| AI Act dates (2 Dec 2026, 2 Dec 2027, 2 Aug 2028) | Fixed, public | Strong and the only triggers HFTP can time itself | Pre-set calendar entries some weeks ahead; HFTP newsletter note; only where the user's answers show the date is relevant to them |
| A new tool is considered | User | Strong; links to the AI Register in the same hub | "Check this tool" from a register entry |
| New manager joins | User | Medium: good moment (role transition) but nobody will tell the tool | Shareable summary "where this hotel stands" as a handover page |
| Owner / board reporting | User | Medium to strong: needs a one-page export with date and sources | Exportable one-pager; before/after line if a second run exists |
| Content change (new use cases, rule updates) | HFTP | Medium: only worth a message if the user's result would change | Version the question set; say "2 of your answers are affected" |

- 2 Dec 2026 is two weeks away at the time of writing, so it is a launch hook more than a reminder date. The dates that can work as planned reminders are 2 Dec 2027 and 2 Aug 2028.
- The governance dates only justify a re-check if the tool's questions actually touch what changes on those dates. A reminder that leads to an unchanged questionnaire would read as nagging.

### Gaps
- No source found on when European hotels set budgets or report to owners (timing differs by group, ownership and management contract); the table treats these as user-supplied dates for that reason.
- No evidence on which of these triggers hotel managers would actually respond to; that is a question for the team's interviews or a short test with HFTP members (not added to any interview guide here).
- Swiss and UK rule dates were out of scope of this search.

---

## 4. What should be avoided?

### Takeaway
The legal line (EU rules on deceptive design) is aimed at consumer platforms and does not bind a B2B association tool directly, but it gives a ready-made list of what a credible tool must not do; the evidence on gamification is mixed and mostly from education, and its most-reported failures involve exactly the elements (badges, leaderboards, points) that would be proposed for a "sticky" tool.

### Cited Findings
- EDPB Guidelines 03/2022 (adopted Feb 2023) define deceptive design patterns as interfaces and user journeys designed to influence users into unintended, unwilling or potentially harmful decisions, grouped in six categories; the guidance is written for social media interfaces. [secondary] — [Clifford Chance, Deceptive design patterns and where to find them (EDPB)](https://www.cliffordchance.com/insights/resources/blogs/talking-tech/en/articles/2023/03/deceptive-design-patterns-and-where-to-find-them-edpb.html)
- DSA Art. 25 prohibits online platforms from designing interfaces that deceive or manipulate users or impair free and informed decisions; practices already covered by GDPR or the Unfair Commercial Practices Directive are carved out. Scope remains contested and regulators have asked for guidelines. [secondary] — [Covington, Inside Privacy](https://www.insideprivacy.com/?p=13706); [KommAustria contribution to EDPB consultation, 31 Oct 2025](https://www.edpb.europa.eu/sites/default/files/webform/public_consultation_reply/2025-0.818.296-2-a-contribution-by-kommaustria-on-the-guidelines-3_2025-on-the-interplay-between-the-dsa-and-the-gdpr-version-1.1_31.10.2025_.pdf)
- "Persistence (micro-interruptions or nagging)" is listed as a category of deceptive design; the list is attributed to the Spanish data protection authority (AEPD), not confirmed as EDPB wording. [secondary] — [CEUR workshop paper](https://ceur-ws.org/Vol-4217/paper11.pdf)
- Systematic mapping of gamified education software: badges, leaderboards, competitions and points are the elements most often reported as causing negative effects; the most common were no effect, worse performance and demotivation. The authors note poor implementation may be the cause rather than the element itself. Education, not workplace. [secondary] — [Almeida et al. 2023, arXiv 2305.08346](https://arxiv.org/pdf/2305.08346)
- The wider evidence on gamification is divided; some studies find small positive effects, and one two-year field study at a firm found completion badges raised work activity. [secondary; journalism and business-school summaries] — [Communications of the ACM, The games people play](https://cacm.acm.org/news/the-games-people-play); [Knowledge at Wharton](https://knowledge.wharton.upenn.edu/article/people-love-games-but-does-gamification-work/)
- Weekly reminders were no more effective than monthly ones in one charitable-giving experiment. [secondary; cited via another paper] — [MPRA paper 69621](https://mpra.ub.uni-muenchen.de/69621/1/MPRA_paper_69621.pdf)
- HubSpot's grader is described as feeding the top of its sales funnel. [secondary; aggregator characterisation] — [echai.ventures](https://echai.ventures/gtm/from/growthhackers)

### Inferences
Avoid list for this tool (my judgement, built on the findings above):
- No reminders the user did not set. Every reminder should trace to a date the user gave or to a rule date that affects their answers. The reminder study suggests more frequent sends add nothing.
- No gate before the result (email required to see the score). This is the lead-capture grader pattern and would make an association tool look like a sales funnel.
- No public leaderboards, points, streaks or "level" language. The evidence on these is at best mixed, and for owners and CIOs a score that looks like a game undermines the claim that the result can go into a board paper.
- No "badge" that looks like a certificate. The schemes that issue badges (Cyber Essentials, Green Key, BREEAM, B Corp) audit or verify. A self-declared readiness badge would invite the charge of AI-washing and expose HFTP's name.
- No score inflation on re-take and no hidden change of questions between runs; a before/after comparison is only credible if the question-set version is shown on both results.
- No peer comparison on small groups. Follow the STR logic: show a benchmark only above a minimum group size and never an identifiable property.
- No false urgency around rule dates ("7 days left") where the date does not apply to that hotel's use of AI.
- No handover of answers to vendors or consultants without an explicit request by the user. If a consultant or support route exists, it should be an offer after the result, not a condition.

### Gaps
- No study found on gamification with senior managers or executives specifically; the "undermines credibility" point is a judgement, not a finding.
- EDPB's own wording on nagging not confirmed (the annex of Guidelines 03/2022 was not read).
- No source retrieved on the ePrivacy / GDPR consent rules for reminder emails from an association to members and non-members in EU, Swiss and UK settings; this needs a legal check before any email feature.
- The planned EU Digital Fairness Act (which may extend dark-pattern rules) was only mentioned in passing in a consultation reply; status not researched.

---

## 5. What retention is possible without accounts vs with accounts?

### Takeaway
No source was found that measures return rates for no-login versus login assessment tools, so this section is mostly design reasoning. The reference products show the trade-off: the tools that keep history (B Impact Assessment, Green Key application, EDIH DMA) all use accounts because a third party verifies the answers; the HFTP check has no verifier, so it can keep the user's history on the user's side.

### Cited Findings
- B Impact Assessment: recertification updates previously saved answers, and the dashboard shows the recertification date, which requires a persistent account. [secondary] — [B Lab UK, Recertification](https://bcorporation.uk/reinventing-business/by-b-lab-uk/recertification-demonstrating-continuous-improvement-on-the-b-corp-journey/); [B Lab knowledge base](https://kb.bimpactassessment.net/support/solutions/articles/43000492911-how-to-recertify-as-a-b-corp)
- Green Key's Hotel Sustainability Basics application tool has a draft function before submission. [secondary] — [Green Key, Hotel Sustainability Basics](https://greenkey.global/sustainabilitybasics)
- Cyber Essentials Readiness Tool: the output is a downloadable action plan, i.e. the user keeps the result as a file. [secondary; consultancy description] — [GRC Solutions](https://grcsolutions.io/are-you-ready-for-cyber-essentials/)
- EDIH DMA: T0, T1 and T2 results are compared per firm over up to three years, which is run through the hub and the EDIH platform rather than by the firm alone. [secondary] — [JRC DMA tool presentation, 16 Feb 2023](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2023-02/dma_tool_16.02.2023_presentation.pdf)
- STR peer benchmarks depend on continuous data submission by identified participating hotels (more than 80,000 properties). [secondary] — [CoStar](https://www.costar.com/en-gb/strategic-success-unveiled-how-competitive-sets-lead-hoteliers-informed-business-decisions)

### Inferences
What each tier can deliver (design reasoning, not sourced):

| Capability | No login | Light login (email link only) | Full account |
|---|---|---|---|
| Keep a result | Download a result file (PDF for people, data file for the tool) | Same, plus stored copy | Stored history |
| Before/after comparison | Re-import the earlier file; tool shows changes | Automatic | Automatic, with trend |
| Reminder | Calendar file (.ics) for user-chosen date and rule dates; works in Outlook, which hotel teams already use | Opt-in email on those dates | Email plus in-tool notices |
| Action plan with checkable tasks | Inside the exported file, or saved in the browser on that device only | Synced | Synced, assignable |
| Share with owner or colleague | Send the PDF; or a link that carries the answers | Shareable stored link | Roles and permissions |
| Team / multi-user input | Each person exports; one person merges (clumsy) | Possible | Natural |
| Portfolio across properties or tools | Import several files into one view | Possible | Natural |
| Peer benchmark | Only static published reference values; no live comparison unless anonymous answers are collected with consent | Possible with consent | Possible with consent |
| What HFTP learns about return use | Almost nothing (cannot tell a returning user from a new one) | Return rate per email | Full picture |

- The no-login route protects trust (nothing about a hotel's AI weaknesses sits on an association server) and costs HFTP the ability to measure retention. If the team wants a retention number for the report, the lightest honest option is an optional email-to-self of the result with an opt-in re-check reminder.
- Browser storage alone is a weak memory for this audience: managers switch devices and corporate browsers clear data, so a second visit months later may find nothing. A file the user owns is more durable.
- A link that carries the answers inside the address is convenient but can leak a hotel's self-assessment through forwarded emails and logs; a file is safer for sensitive answers.
- The re-import file is also what makes the natural triggers in section 3 work without accounts: pilot end and budget round are served by "open your last result, see what changed".
- Portfolio and team views are the features most likely to justify an account for groups and owners with several properties; single independent hotels do not need them.

### Gaps
- No comparative data on return rates for account vs no-account tools.
- No evidence on how hotel managers handle exported files or calendar invites in practice (do they re-import, do they keep the PDF); worth a short usability test with a few HFTP members.
- Whether the current readiness-check build in `tools/readiness-check/` (a claude.ai artifact) can import a saved file and issue .ics downloads was not checked; that is a build question outside this research.
- No source on HFTP's own member-portal login and whether the tool could reuse it.
