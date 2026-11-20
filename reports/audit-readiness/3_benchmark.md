# Readiness check audit, phase 4: benchmark against the best comparable tools

*20 Nov 2026. Competitive benchmark, written to find faults. Every outside tool below was opened on 20 Nov 2026 unless marked "not opened". Quotes are copied from the opened page. Our own check was read from `tools/readiness-check/README.md`, `src/logic.js`, `src/check.js` and `reports/Readiness check retention and trust.md`; it was not run in a browser in this phase, so its mobile and accessibility behaviour is not judged from use.*

**In one line:** the three strongest comparables beat us on speed, benchmark and institutional trust; none of them does what ours does (one tool, must-haves with proof, a decision instead of a score, tasks by person). Ours is a different product, and it currently lacks the trust layer that would let a hotel believe it.

---

## 1. The three strongest, and why these three

| | Tool | Why it is in the top three |
|---|---|---|
| A | **Cisco AI Readiness Index Assessment Tool** (general business) | The best-built vendor self-assessment found: 49 questions, a public methodology page, a peer benchmark by country, PDF, no email gate. |
| B | **dailypoint AI Readiness Check** (hotels) | The most direct competitor: hotel-specific, launched 22 Oct 2026, free, anonymous, 18 questions, about 5 minutes, instant result on a phone. |
| C | **UK ICO AI and data protection risk toolkit** (regulator, per AI system) | The only strong tool that, like ours, works on one AI system and asks for owner, status and date per item. It shows what a regulator-grade evidence trail looks like. |

Runners-up that were opened and used as side evidence: Microsoft AI Readiness Wizard, EU ALTAI web tool, UK AI Management Essentials (AIME), EU Open DMAT, AI Singapore AIRI, Cloudbeds template, HiJiffy tool, Infor checklist article.

### A. Cisco AI Readiness Index Assessment Tool

- URL: https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/assessment-tool.html (methodology: https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/methodology.html)
- Opened: yes, completed end to end in a normal headless browser. A plain `curl` request got HTTP 403; nothing was done to get around it beyond loading the page in a browser.
- Who runs it: Cisco (network and infrastructure vendor).
- What it asks: 49 single-choice questions in six pillars, counted while completing it: Strategy 5, Infrastructure 11, Data 10, Governance 12, Talent 4, Culture 7. The user may pick only some pillars ("Choose pillars for assessment"). Most questions offer "Unsure".
- Time claimed: none found on the page.
- Output: "Your score: 55", a tier ("Limited Preparedness - Follower"), a tab per pillar, a "Generate PDF" button. Tiers are published before the start: "Fully Prepared – Pacesetters: Companies that have a score higher than 86 (out of a maximum of 100)", Chasers 61–85, Followers 31–60, "Unprepared – Laggards" 0–30.
- Benchmark: yes. The result page shows "2025 Global readiness: 13% Pacesetters, 36% Chasers, 48% Followers, 3% Laggards" with a "Select market" list of 30 markets that includes France, Germany, Italy, Netherlands, Poland, Spain, Sweden, Switzerland and the UK (source: Cisco result page).
- Methodology shown: yes. "7760 senior leaders surveyed", "30 markets", "26 industries"; "an independent research partner conducted the survey double-blind: respondents didn't know Cisco commissioned it"; "six pillars, measured across 49 distinct indicators. We weight each pillar" (source: Cisco methodology page). The pillar weights themselves are not printed on that page.
- Unit: whole organisation. Sector: none (26 industries pooled). Regulation: generic governance questions; no EU AI Act label.
- Save/return: none seen; PDF only. Email gate: none. Evidence required: none, all self-declared ticks.
- Cost and model: free; brand and product pull (the result page links to Cisco reports and training).

### B. dailypoint AI Readiness Check

- URL: https://www.dailypoint.ai/ai-readiness-check (landing page https://www.dailypoint.ai/; launch notice https://www.hotel-online.com/news/dailypoint-launches-free-and-anonymous-ai-readiness-check-for-hotels)
- Opened: yes, completed end to end at phone width (390 px).
- Who runs it: dailypoint, a Munich guest-data (CRM) software vendor ("software made by Toedt, Dr. Selk & Coll. GmbH").
- What it asks: 18 single-choice questions, 3 per area, each with four answers that form a ladder from worst to best: Data foundation, Systems & integration, Data protection & governance, Processes & automation, Team & skills, Strategy & use cases. No "don't know" answer. Example: "Are there rules on which data employees may enter into AI tools such as ChatGPT? No / Only informal agreements / A written policy / A policy with training and approved tools".
- Time claimed: "18 questions · 5 minutes · anonymous". Landing page: "✓ Free ✓ Approx. 5 minutes ✓ Anonymous, no sign-up".
- Output: "33/100", a level name ("Explorer"), a radar, a percentage and one paragraph per area, "Your next steps" (the three weakest areas), "Download as PDF", "Restart the check".
- Benchmark: promised, not shown. "Your result has been stored anonymously, without any personal data, for our industry benchmark." No peer figure appeared in the result.
- Methodology shown: no. No page explains the weights or where the level cut-offs come from.
- Unit: whole hotel. Sector: hotels. Regulation: consent and an AI-use policy are asked about; no AI Act content.
- Save/return: none. Sharing: PDF. Evidence required: none.
- Email gate: none for the result. Lead capture comes after: "Discuss your result. We're happy to show you in 30 minutes how hotels with a similar profile have turned their guest data into a foundation for AI", with a form (first name, last name, business email, hotel, position) that attaches the score.
- Cost and model: free; sales funnel for the vendor's guest-data platform. 8 of the 18 questions (Q1–3 guest data, Q7 consent, Q9 guest-data owner, Q10–12 guest communication, segmentation and campaign measurement) are about guest data and marketing, which is what the vendor sells (count from the question list captured during the run).

### C. UK ICO AI and data protection risk toolkit

- URL: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/guidance-on-ai-and-data-protection/ai-and-data-protection-risk-toolkit/ (file: `ai_and_data_protection_risk_toolkit_v11.xlsx`)
- Opened: yes, page read and spreadsheet downloaded and inspected.
- Who runs it: the Information Commissioner's Office, the UK data protection regulator.
- What it asks: not a quiz. A spreadsheet of 32 risk statements with 89 practical steps (counted in the file), grouped in four lifecycle stages (Business requirements and design; Data acquisition and preparation; Training and testing; Deployment and monitoring). Each row cites the UK GDPR articles and separates "must", "should" and "could".
- Time claimed: none.
- Output: no score and no verdict. The organisation fills in, per risk: "Inherent Risk Rating" (High / Medium / Low / N/A), "Practical Steps Your Organisation Will Take", "Control Owner", "Current status" (Not yet started / In progress / Complete / N/A), "Completion date", "Residual Risk Rating (following action)".
- Benchmark: none. Methodology: the guide sheet explains use and limits: "Using the toolkit is entirely optional and you will not be penalised by the ICO for not using it"; it "can complement data protection impact assessments (DPIA) … it is not designed to replace them".
- Unit: one AI system. Sector: any. Regulation: UK GDPR only; the page carries a notice that the guidance "is under review" after the Data (Use and Access) Act. No EU AI Act.
- Save/return/share: it is a file the organisation keeps and edits. Email gate: none. Cost: free, Open Government Licence. Lead-gen: none.
- Weakness: written for teams that build or train AI ("Training and testing"); a hotel buying a chatbot would find most rows do not fit.

---

## 2. Comparison table

| Row | Our readiness check | A. Cisco | B. dailypoint | C. ICO toolkit | Plain verdict on ours |
|---|---|---|---|---|---|
| Clarity of promise | "Get a verdict and an action plan by person", for one tool (source: `src/check.js`) | "Take the test and see where you stand—and where to focus next." | "Get your score, radar and next steps." Three ticks: free, 5 minutes, anonymous | "reduce the risks to individuals' rights and freedoms" | Our promise is the most useful, but it takes more words to say, and the page does not show the result before the user invests time. |
| Time to result | "about 15 minutes" claimed (source: `src/check.js`), about 30 questions, and several answers sit with other people | No claim; 49 clicks | "5 minutes", 18 clicks | Hours to days (working document) | **Behind.** Three times the claimed time of B, and a first pass often ends in "Not enough information yet". |
| Question quality | One idea per question, concrete and checkable ("Is there a written budget for the first 12 months…"), "what counts as Yes" shown, "Don't know yet" asks who can answer | Solid but abstract, written for enterprise IT ("Do you have a strategy to deploy AI powered solutions…"); "Unsure" offered | Clear ladders, hotel language; rewards "more AI" as better; nearly half are about the vendor's field; no "don't know" | Precise legal risk statements; too technical for a hotel manager | **Ahead** for a hotel deciding on one purchase. Behind C on legal precision. |
| Evidence / proof | 8 must-haves count only with Yes plus a proof line (at least 2 words and 8 characters); self-declared | None | None | Owner, status, completion date and residual risk per item | **Ahead of A and B, behind C.** A two-word proof line is a thin bar and nobody checks it. |
| Output usefulness | Verdict, must-haves met, action plan by person, vendor questions, owner page in the PDF | Score, tier, generic paragraph per tier | Score, level, one paragraph per area, three weakest areas | A filled risk register | **Ahead.** Ours is the only one that tells named people what to do next. |
| Benchmarking | None | Global and 30-market tier shares on the result page | Promised ("for our industry benchmark"), not shown | None | **Behind A.** We have no peer data and should not invent any. |
| Trust signals | "Student prototype by EHL SBP Group 36 for HFTP"; thresholds stated as the team's judgement; data-notice placeholders and legal sign-off still open (source: README); only test users so far were AI personas (source: retention and trust report) | Global brand; methodology page with sample (7,760 leaders, 30 markets) and double-blind survey | Known hotel vendor, imprint, privacy line; no method | A regulator; legal references on every row; open licence | **Clearly behind all three.** Honest labelling is right, but "student prototype" with open sign-offs is the weakest trust position in the table. |
| Regulation | Provisional EU AI Act label per use, GDPR items (DPA, DPIA), staff representatives; awaiting legal sign-off | Generic governance pillar | Consent and AI policy only | UK GDPR in depth; under review | **Ahead on scope** for an EU hotel, behind C on authority. Until sign-off the label is a liability as much as an asset. |
| Save / return / share | Browser save, JSON file, "since last time" comparison, PDF, copy texts, opt-in sharing | PDF only | PDF only | The file itself | **Ahead.** No competitor shows progress between two visits. |
| Accessibility / mobile | 5 responsive rules in `style.css`; not tested in this phase; lives inside a hub artifact, not on a public web address | Desktop layout; worked in a 1280 px browser | Worked fully at 390 px; one question per screen | Excel file; unusable on a phone | **Unproven.** B is the standard to meet on a phone. |
| Credibility of thresholds | 40% and 75% cut-offs are "the project team's" judgement (source: `src/check.js`); no calibration against real hotels | Cut-offs published (86 / 61 / 31), tied to a 7,760-person survey; pillar weights not printed | Level cut-offs not explained | No thresholds; the user rates risk | **Behind A, level with B.** We are honest that the cut-offs are judgement; A can point to data. Our must-have rule is more defensible than any score band. |

---

## 3. Table stakes we lack (each seen on an opened page)

1. **A public "how this was built" page.** Cisco has a separate methodology page that states who was asked, how many, how answers become a score and where the tier lines sit (https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/methodology.html). Ours has one sentence saying the thresholds are the team's judgement. A hotel owner or HFTP board member who asks "why should I believe this?" has nothing to open. We need a short page: where the questions come from (D6 research, interviews), why these 8 must-haves, why 40%, what was tested and with whom, what is still unsigned.
2. **A promise strip and a preview of the result before the first question.** dailypoint puts "✓ Free ✓ Approx. 5 minutes ✓ Anonymous, no sign-up" beside the start button and lists what comes out: "Your readiness score from 0 to 100 / A radar across six areas / Concrete next steps for your hotel" (https://www.dailypoint.ai/). No example result before starting was found in our source. Ours should show a sample owner page and state time, cost and what happens to the data in one line at the start.
3. **A comparison with others at the result.** Cisco shows tier shares worldwide and per market on the result page (https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/assessment-tool.html). We cannot honestly do this yet. The honest substitute is a sourced line per must-have from our own interviews or a named survey once the team has it (for example how many interviewed hotels had a written 12-month budget), with the sample stated. Until then, say plainly that no peer data exists.

Smaller patterns worth noting: Cisco lets the user choose which pillars to answer; dailypoint shows "Question 5 of 18" on every screen; the ICO toolkit separates "must", "should" and "could" on every row, which is a cleaner way to show legal weight than our single provisional label.

---

## 4. Patterns we should not copy

| Pattern | Where seen | Why not |
|---|---|---|
| Result that ends in a sales call | dailypoint: "Discuss your result… in 30 minutes" with a contact form that attaches the score. HiJiffy: top result tells the hotel to "Schedule a demo with HiJiffy" (https://www.hijiffy.com/ai-implementation-test) | Our only asset against vendors is that we sell nothing. One contact form would destroy it. |
| Email gate before the content | Cloudbeds template: a form, then "We've sent your copy via email", with dozens of hidden tracking fields in the form (https://www.cloudbeds.com/templates/ai-readiness/) | Hotels will not give an address to a student prototype, and HFTP's name would sit on a lead form. |
| Questions that measure demand for the vendor's product | HiJiffy: 5 questions, each "How impactful would… be", with "Highly Impactful" pre-selected. dailypoint: 8 of 18 questions on guest data and marketing | It is not a readiness test. It also teaches hotels to distrust all such checks, including ours. |
| A 0–100 score and maturity names | Cisco "Laggards"; dailypoint "33/100 Explorer"; Microsoft "Your AI readiness score: 30 … Planning 26 - 37 points" after 10 questions (https://adoption.microsoft.com/en-us/ai-readiness-wizard/) | Our own stress test showed a composite score decides nothing and can be gamed (source: `reports/Readiness check retention and trust.md`, section 2). Labels like "Laggard" insult the user and give no task. |
| Benchmarks that do not match the user | Cisco's shares come from senior leaders at companies in 26 industries, not from 60-room hotels | A hotel would be compared with banks and manufacturers. A wrong benchmark is worse than none. |
| Headline figures cut loose from their sample | dailypoint landing page: "91% of hotels use AI / 13% see measurable ROI", credited "h2c Global Study 2026"; the launch notice says "91% of participating hotel chains" | The page turns chains in one study into "hotels". Our rule is the source and the sample next to every number. |
| No "don't know" | dailypoint and Microsoft force a rung on every ladder | It records what the respondent guesses. Our v3 rule (unknown is something to find out, not a No) is better and should stay. |
| "More AI is better" ladders | dailypoint Q6 and Q13 score more live AI and more staff use as higher readiness | It rewards adoption, not control. A hotel with many unmanaged tools would score well. |

---

## 5. Positioning

**The only check that takes one AI tool a European hotel is about to buy and tells named people what must be in writing before it is signed, with no score, no vendor behind it and the EU rules built in.**

What must be true for that sentence to hold: the legal label signed off, the data notice finished, a method page published, and at least a handful of real hotel managers having completed it. None of the four is done today.

---

## 6. Source table

| Tool or page | Who | URL | Opened | Date | Used for |
|---|---|---|---|---|---|
| AI Readiness Index Assessment Tool | Cisco | https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/assessment-tool.html | Yes, completed (browser; `curl` got 403) | 20 Nov 2026 | Top three |
| AI Readiness Index methodology | Cisco | https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/methodology.html | Yes | 20 Nov 2026 | Top three |
| AI Readiness Check | dailypoint | https://www.dailypoint.ai/ai-readiness-check and https://www.dailypoint.ai/ | Yes, completed at 390 px | 20 Nov 2026 | Top three |
| Launch notice for the dailypoint check | hotel-online.com (press release) | https://www.hotel-online.com/news/dailypoint-launches-free-and-anonymous-ai-readiness-check-for-hotels | Yes | 20 Nov 2026 | Launch date, sample wording |
| AI and data protection risk toolkit (page and v11 spreadsheet) | UK ICO | https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/guidance-on-ai-and-data-protection/ai-and-data-protection-risk-toolkit/ | Yes, file inspected | 20 Nov 2026 | Top three |
| AI Readiness Wizard | Microsoft | https://adoption.microsoft.com/en-us/ai-readiness-wizard/ | Yes, completed at 390 px | 20 Nov 2026 | Runner-up: 10 questions in five areas, five-step ladders, score 30 "Planning 26 - 37 points", no gate, links to Microsoft resources |
| ALTAI web tool | Insight Centre for the EU High-Level Expert Group on AI | https://altai.insight-centre.org/ and /Home/HowToComplete | Home and how-to pages yes; the tool itself **not opened** (account required: "You need to create an account to use the Assessment List") | 20 Nov 2026 | Runner-up: per AI system, seven requirements, output is "a visualisation of the self-assessed level of adherence" plus recommendations; calls itself "a prototype" |
| ALTAI page | European Commission | https://digital-strategy.ec.europa.eu/en/library/assessment-list-trustworthy-artificial-intelligence-altai-self-assessment | Yes | 20 Nov 2026 | "a piloting process where over 350 stakeholders participated" |
| AI Management Essentials (consultation and self-assessment PDF) | UK DSIT | https://www.gov.uk/government/consultations/ai-management-essentials-tool | Yes, PDF read | 20 Nov 2026 | Runner-up: organisation-level, 10 sections, yes/no and frequency questions with skip rules; based on ISO/IEC 42001, NIST AI RMF and the EU AI Act; "does not provide formal certification"; scoring not yet published in the consultation version |
| Open DMAT | European Commission, EDIH network | https://european-digital-innovation-hubs.ec.europa.eu/open-dma | Yes (start page only) | 20 Nov 2026 | Side evidence: per organisation; "only provides results of your individual company, without any comparison with others" |
| AI Readiness Index (AIRI) | AI Singapore | https://aisingapore.org/innovation/airi/ | Yes (description page only) | 20 Nov 2026 | Side evidence: five pillars, fifteen dimensions, levels from "AI Unaware"; per organisation |
| AI RMF Playbook | NIST | https://airc.nist.gov/airmf-resources/playbook/ | Yes | 20 Nov 2026 | Excluded: "The Playbook is neither a checklist nor set of steps to be followed in its entirety" |
| AI readiness framework template | Cloudbeds | https://www.cloudbeds.com/templates/ai-readiness/ | Landing page yes; the template **not opened** (email form) | 20 Nov 2026 | "A 1–5 scorecard", "A personalized AI readiness score out of 25"; data only, five dimensions |
| AI Assessment Tool for Hotels | HiJiffy | https://www.hijiffy.com/ai-implementation-test | Yes (questions and result logic read in the page; run not completed) | 20 Nov 2026 | 5 questions on expected impact; three priority levels |
| The hotel AI readiness audit | Infor (blog article) | https://www.infor.com/blog/hotel-ai-readiness-audit | Yes | 20 Nov 2026 | Article, not a tool: three prerequisites (system integration, cloud, data standardisation) |
| AI readiness assessment | Avanade | https://www.avanade.com/en-ca/services/artificial-intelligence/ai-readiness-hub/ai-readiness-assessment | Landing text only; tool **not opened** | 20 Nov 2026 | Not relied on |
| AI readiness quick check | Google Cloud | https://cloud.google.com/resources/ai-readiness-quick-check | **Not opened** (404 at the address tried) | 20 Nov 2026 | Not relied on |
| Hotel AI readiness guide | Hospitality Net | https://www.hospitalitynet.org/explainer/4134330/the-hotel-ai-readiness-guide | **Not opened** (403) | 20 Nov 2026 | Not relied on |
| IBM, Deloitte, Gartner, McKinsey, Mews, SiteMinder, Duetto, hotel association checklists | — | — | **Not opened**: no public self-assessment tool found in two searches (Mews publishes a blog and a survey, not a check) | 20 Nov 2026 | Not relied on |

**Limits.** One run per tool with middle or low answers; no tool was tested with a screen reader; Cisco's and dailypoint's scoring was not reverse-engineered. The test run of the dailypoint check stored one anonymous result on their side, as their page says it does. No Wikipedia was used.
