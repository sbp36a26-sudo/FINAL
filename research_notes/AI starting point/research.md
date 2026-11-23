# AI starting point: research for the new hub tool

Research date: 23 Nov 2026. Written for the "AI starting point" tool, which is for hotel managers who are not AI experts. It covers steps 1, 3 and 4 of the tool and the answer scale. Step 2 (where the problem sits in the hotel) already exists in the catalogue.

**Rules followed.** No Wikipedia. Nothing from the AI Hospitality Alliance (AIHA): their material was not opened or used, and the AIHA/HotelLogic "PMS API Power Index" cited in an earlier team note (`research_notes/Hotel AI readiness check design/hotel_blockers_and_gates.md`) is deliberately left out. Every figure below gives its base, its date and who measured it.

**Source labels.**
- **[opened]**: I fetched the document in this session and the quote is copied from it.
- **[abstract]**: only the abstract was read, through the Crossref or OpenAlex metadata APIs.
- **[search-only]**: the host blocked the request (403 or bot check) or is outside this session's network. The wording comes from search summaries, so check it before anything is printed.

Blocked hosts: mckinsey.com, bcg.com, hospitalitynet.org, phocuswire.com, hoteltechreport.com, hftp.org, pwc.com, mdpi.com, sciencedirect.com, emerald.com, sagepub.com and traveldailynews.com, plus Springer's bot check. EUR-Lex returned an empty file.

**Readiness-check codes** used below are from `tools/readiness-check/src/logic.js` (rules v4):
- P = People
- F = Financial investment
- T = Technology infrastructure
- D = Data
- O and G = Organisation & governance
- X = add-on questions (guests, staff representatives, AI Act)

---

## A. Five questions: is this a problem AI should solve?

### How the questions were built

Each question is worded so that **Yes points towards AI**. Each one comes from guidance that says when AI is the wrong tool:

| Question idea | Main grounding |
|---|---|
| Does the job need inference, not fixed rules? | EU AI Act Art. 3(1) and recital 12; Commission guidelines C(2025) 5053, section 5.2; Google PAIR "When AI is probably not better"; NIST AI RMF MANAGE 2.1 ("viable non-AI alternative") |
| Is it worth it (volume, value)? | GOV.UK 2019 ("large scale and repetitive"); UK AI Playbook 2025 ("volume, complexity or real-time nature", cost-benefit analysis); NIST MAP 1.4, MAP 3.1, MAP 3.2 |
| Is the data there? | GOV.UK 2019 (data quality list); Brynjolfsson & Mitchell 2017 criterion 2; UK AI Playbook ("data quantity and quality") |
| Can errors be caught? | Brynjolfsson & Mitchell criterion 6; PAIR ("Minimizing costly errors"); UK AI Playbook ("fully automated decision making"); AI Act Art. 14 and Art. 26(2) |
| Is success defined? | Brynjolfsson & Mitchell criterion 3; PAIR success template; NIST MANAGE 1.1; readiness check F2 and F3 |

### Q1. Does the job need judgement on varied input that you could not write down as fixed if-then rules?

Examples of varied input: free-text messages, speech, photos, or a forecast that has to learn from past patterns.

**Why it matters.** Under EU law, software that only follows rules written by people is not AI, and a simpler tool is cheaper, easier to explain and easier to fix. AI earns its place when the tool must infer something from the input: understand a message, recognise an image, predict demand.

**If No:** "Not an AI problem: rules or ordinary automation will do it." Suggested add-on line: "Ask your current software vendor whether a rule or report can do it."

**Hotel examples**

| | Example |
|---|---|
| Yes | Reading guest emails in five languages and drafting replies. Forecasting next week's breakfast covers from bookings, events and weather. Spotting damage in photos of returned rooms. |
| No | Sending a pre-arrival email three days before arrival. Alerting when a room is not cleaned by 14:00. Flagging when an OTA price is below the direct price (a fixed rule). A daily sales dashboard. A forecast that is only "same as last Tuesday" (the guidelines treat simple averages as outside the AI definition, paras 49–51). |

**Sources**

- **EU AI Act, Regulation (EU) 2024/1689, Art. 3(1)** (regulation, OJ L 12.7.2024; local PDF `tools/ai-act-explorer/EU AI Act June 2024.pdf`) [opened]:
  > "'AI system' means a machine-based system that is designed to operate with varying levels of autonomy and that may exhibit adaptiveness after deployment, and that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments"
- **AI Act, recital 12** (same PDF) [opened]:
  > "the definition should be based on key characteristics of AI systems that distinguish it from simpler traditional software systems or programming approaches and should not cover systems that are based on the rules defined solely by natural persons to automatically execute operations. A key characteristic of AI systems is their capability to infer. … The capacity of an AI system to infer transcends basic data processing by enabling learning, reasoning or modelling."
- **Commission Guidelines on the definition of an AI system** (official guidance).
  - **Reference and dates.** The content was approved on 6 Feb 2025 as C(2025) 924 final ("Approval of the content of the draft Communication…"). That document itself says the guidelines "will be formally adopted by the Commission at a later date, when all language versions are available. It is only from that moment that these Guidelines will be applicable." The formal adoption is **C(2025) 5053 final, Brussels, 29.7.2025**. The Feb 2025 approval is at https://ec.europa.eu/newsroom/dae/redirection/document/118559 and the adopted text at https://ec.europa.eu/newsroom/dae/redirection/document/112455, both linked from https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-ai-system-definition-facilitate-first-ai-acts-rules-application. An AI Act Service Desk copy is at https://ai-act-service-desk.ec.europa.eu/sites/default/files/2026-01/guide-definition_en.pdf [search-only]. **Cite C(2025) 5053 final.** [opened]
  - Para (6) [opened]:
    > "The definition of an AI system should not be applied mechanically; each system must be assessed based on its specific characteristics."
  - Para (7) [opened]:
    > "The Guidelines are not binding."
  - Para (46), basic data processing [opened]:
    > "Basic data processing system refers to a system that follows predefined, explicit instructions or operations. These systems are developed and deployed to execute tasks based on manual inputs or rules, without any 'learning, reasoning or modelling' at any stage of the system lifecycle. … These basic data processing systems include, for example, database management systems used to sort or filter data based on specific criteria (e.g. 'find all customers who purchased a specific product in the last month'), standard spreadsheet software applications which do not incorporate AI enabled functionalities…"
  - Para (47) [opened]:
    > "systems that solely intended for descriptive analysis, hypothesis testing, and visualisation, fall outside the definition of an AI system. For instance, in software for sales report visualisation … the system does not recommend how to improve sales or which products to promote."
  - Para (48), classical heuristics [opened]:
    > "classical heuristic systems apply predefined rules or algorithms to derive solutions."
  - Para (49), simple prediction [opened]:
    > "All machine-based systems whose performance can be achieved via a basic statistical learning rule, while technically may be classified as relying on machine learning approaches fall outside the scope of the AI system definition"
  - Para (51) [opened]:
    > "trivial predictors such as demand forecasting for a store to predict how many items of a product the store will sell each day are other examples, that help to establish a baseline"
  - Para (63) [opened]:
    > "The vast majority of systems, even if they qualify as AI systems within the meaning of Article 3(1) AI Act, will not be subject to any regulatory requirements under the AI Act."
- **Google PAIR, People + AI Guidebook, "User Needs + Defining Success"** (vendor guidance, CC BY-NC-SA 4.0; https://pair.withgoogle.com/chapter/user-needs/, read 23 Nov 2026) [opened]:
  > "Often a rule or heuristic-based solution will work just as well, if not better, than an AI version. A simpler solution has the added benefit of being easier to build, explain, debug, and maintain."

  Its list "When AI is probably not better" includes "Maintaining predictability" and "Providing static or limited information". Its list "When AI is probably better" includes "Natural language understanding", "Prediction of future events" and "Recognition of an entire class of entities".
- **NIST AI RMF 1.0, NIST AI 100-1, Jan 2023** (standards body; https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf), MANAGE 2.1 [opened]:
  > "Resources required to manage AI risks are taken into account – along with viable non-AI alternative systems, approaches, or methods – to reduce the magnitude or likelihood of potential impacts."
- **UK AI Playbook for the UK Government** (official guidance, DSIT, 10 Feb 2025; https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html) [opened]:
  > "focus on use cases that can only be solved by AI or where AI offers significant advantages over existing techniques."

  and, on generative AI:

  > "Ask yourself if a non-AI solution or a traditional ML model trained for a specific purpose could work just as well."

**Wording caution.** Q1 is a "does this need AI?" test, not a legal classification. Para (6) says the definition must not be applied mechanically. A Yes does not mean AI Act duties apply (para 63); the AI Act guide tab handles that.

### Q2. Does the job come up often enough, or cost enough, that doing it better would be worth real money or staff hours every month?

**Why it matters.** AI tools have set-up, subscription, checking and training costs. Guidance asks for a cost-benefit view and points AI at large, repetitive or high-value tasks. A rare or small task seldom repays this.

**If No:** "Probably not worth it." Suggested add-on line: "Look again if the volume grows, or if a tool you already pay for adds it."

**Hotel examples**

| | Example |
|---|---|
| Yes | About 400 guest emails a week at front office. Daily rate decisions across 120 rooms and 6 channels. Food waste in a 300-cover breakfast. |
| No | A 12-room guesthouse with 10 email enquiries a week. Writing the annual budget narrative once a year. Translating a menu that changes twice a year. |

**Sources**

- **GOV.UK, "Assessing if artificial intelligence is the right solution"** (official guidance; DSIT, Centre for Data Ethics and Innovation, Office for AI; published 10 June 2019, not updated since; https://www.gov.uk/guidance/assessing-if-artificial-intelligence-is-the-right-solution) [opened]. When assessing if AI could help, consider if:
  > "the task is large scale and repetitive enough that a human would struggle to carry it out"

  and if:

  > "it would provide information a team could use to achieve outcomes in the real world"

  Caution: the same page says "Unlike a human, AI cannot infer". That uses "infer" in a different sense from AI Act Art. 3(1). **Do not quote that line in the tool.**
- **UK AI Playbook** (10 Feb 2025) [opened]:
  > "considering whether traditional solutions might be unable to handle the volume, complexity or real-time nature of the task … Evaluate the potential impact of implementing AI solutions on these problems using tools like cost-benefit analysis"
- **NIST AI RMF 1.0** [opened]:
  - MAP 1.4:
    > "The business value or context of business use has been clearly defined"
  - MAP 3.1:
    > "Potential benefits of intended AI system functionality and performance are examined and documented."
  - MAP 3.2:
    > "Potential costs, including non-monetary costs, which result from expected or realized AI errors … are examined and documented."
- **Google PAIR** [opened]. "When AI is probably not better" includes:
  > "Optimizing for high speed and low cost."

### Q3. Is the information the tool needs already kept somewhere digital and up to date?

Examples: bookings, past guest messages, rates, your hotel's facts and menus.

**Why it matters.** AI learns from data or reads your data to answer. If the facts sit on paper, in one person's head or in five systems that disagree, the tool gives wrong answers with confidence.

**If No:** "Fix the data first." Suggested add-on line: "Put the facts in one place and name who keeps them right. Then ask again."

**Hotel examples**

| | Example |
|---|---|
| Yes | Three years of PMS booking history for a demand forecast. One up-to-date fact sheet (rooms, hours, policies) for a guest chatbot. Review texts exported from the review platform. |
| No | Allergen information only in the chef's binder. Room features different on the website, the PMS and the OTA listings. Maintenance history on paper job cards. |

Note for generative-AI tools (chat, email drafting): they need far less of the hotel's own historic data than older machine learning. They still need correct, current hotel facts; this is readiness question D4. The question therefore asks about "information the tool needs", not "a large dataset".

**Sources**

- **GOV.UK 2019** [opened]. Consider if:
  > "there's data containing the information you need, even if disguised or buried"

  and:

  > "you have a large quantity of data for the model to learn from"

  It also gives a data quality list:
  > "accuracy, completeness, uniqueness, timeliness, validity, sufficiency, relevancy, representativeness, consistency"

  and adds:

  > "If your problem involves supporting an ongoing business decision process, you will need to plan to establish ongoing, up-to-date access to data."
- **Brynjolfsson, E. & Mitchell, T. (2017), "What can machine learning do? Workforce implications", *Science* 358(6370), 1530–1534, doi 10.1126/science.aap8062** (academic; author copy https://www.cs.cmu.edu/~tom/pubs/Science_WorkforceDec2017.pdf) [opened]. Criterion 2:
  > "Large (digital) data sets exist or can be created containing input-output pairs"
- **UK AI Playbook** (10 Feb 2025) [opened]:
  > "data quantity and quality: AI systems heavily rely on the quality and quantity of data to drive accuracy. Insufficient data can lead to the model failing to generalise effectively, and, similarly, poor quality, biased or noisy data can lead to inaccurate outcomes"
- **Eurostat, accommodation sector** (official statistics). Base: EU accommodation enterprises (NACE I55) with 10+ persons employed that did not use AI but had considered it; ICT usage survey, early 2025; dataset isoc_eb_ain2, unit "PC_ENT_AI_EC", updated 15 Jun 2026; API query 23 Nov 2026. [opened]
  > "Enterprises do not use AI technologies, because of difficulties with availability or quality of the necessary data": **42.61%**

### Q4. If the tool gets it wrong now and then, can the mistake be spotted and put right before it hurts a guest, a staff member or the hotel?

**Why it matters.** AI works on probabilities, so it is never right 100% of the time. Where a mistake would be costly, unsafe or unfair, AI can still help, but only as a draft or a suggestion that a person checks.

**If No:** "AI as an assistant only: a person checks every result before it counts." This refines the brief's wording "AI as an assistant only" so the manager knows what it means.

This answer does **not** stop the journey. It changes how the tool is set up, and it carries into readiness questions P5 and G3. Where the use touches safety, health or people's rights (hiring, staff evaluation), add: "Check the AI Act guide tab: this use may be high-risk."

**Hotel examples**

| | Example |
|---|---|
| Yes | Draft replies to reviews that a manager approves. A suggested housekeeping order that the supervisor can change. A rate recommendation the revenue manager accepts or overrides. |
| No | Answering guests' allergen questions on its own. Charging guests automatically for smoking on a sensor's say-so (the catalogue already carries a caution on this). Rejecting job applicants without a person reading the CV: recruitment is an AI Act Annex III high-risk area. |

**Sources**

- **Brynjolfsson & Mitchell 2017**, criterion 6 [opened]:
  > "A tolerance for error and no need for provably correct or optimal solutions. Nearly all ML algorithms derive their solutions statistically and probabilistically. As a result, it is rarely possible to train them to 100% accuracy. … Therefore, tolerance to errors of the learned system is an important criterion constraining adoption."
- **Google PAIR** [opened]:
  > "Minimizing costly errors. If the cost of errors is very high and outweighs the benefits of a small increase in success rate…"

  and:

  > "People often want to, or have to, remain in control when the stakes are high for their role"
- **UK AI Playbook** (10 Feb 2025), "Use cases to avoid" [opened]:
  > "fully automated decision making: be cautious about any use case involving significant decisions, such as those involving someone's health or safety"

  and:

  > "AI should not be used on its own in high-risk areas which could cause harm to someone's health, safety, fundamental rights or the environment"
- **AI Act** (regulation; local PDF) [opened]. These apply to high-risk systems only:
  - Art. 14(1):
    > "High-risk AI systems shall be designed and developed in such a way … that they can be effectively overseen by natural persons during the period in which they are in use."
  - Art. 26(2):
    > "Deployers shall assign human oversight to natural persons who have the necessary competence, training and authority, as well as the necessary support."
  - Timing: after the Digital Omnibus on AI, Regulation (EU) 2026/1744 of 8 July 2026 (local PDF), the Annex III high-risk duties apply from **2 December 2027**.
- **NIST AI RMF**:
  - MAP 3.5 [opened]:
    > "Processes for human oversight are defined, assessed, and documented"
  - Introduction (p. 7) [opened]:
    > "In cases where an AI system presents unacceptable negative risk levels … development and deployment should cease in a safe manner until risks can be sufficiently managed."

### Q5. Can you name the one number that should get better, and do you know today's figure?

Examples: reply time, hours spent, revenue per room, kilos of food thrown away.

**Why it matters.** Without a starting figure nobody can tell whether the tool worked, and the decision to keep or stop it turns into opinion. This is the same idea as readiness must-have F2. Asking it here, before any vendor talk, saves a wasted trial.

**If No:** "Define success first." Suggested add-on line: "Write down the number and today's figure, then come back."

**Hotel examples**

| | Example |
|---|---|
| Yes | "Average reply time to email enquiries: 9 hours today; target under 1 hour." "Breakfast food waste: 38 kg a day (scale log, October)." |
| No | "We want to be more innovative." "Guests should be happier", with no score tracked. |

**Sources**

- **Brynjolfsson & Mitchell 2017**, criterion 3 [opened]:
  > "The task provides clear feedback with clearly definable goals and metrics. ML works well when we can clearly describe the goals, even if we cannot necessarily define the best process for achieving those goals."
- **Google PAIR** [opened]:
  > "Everyone on your team should feel aligned on what both success and failure look like for your feature"

  with the template:

  > "If { specific success metric } for { your team's AI-driven feature } { drops below/goes above } { meaningful threshold } we will { take a specific action }."
- **NIST AI RMF**, MANAGE 1.1 [opened]:
  > "A determination is made as to whether the AI system achieves its intended purposes and stated objectives and whether its development or deployment should proceed."

  Also, at the end of the MAP section [opened]:
  > "After completing the MAP function, Framework users should have sufficient contextual knowledge about AI system impacts to inform an initial go/no-go decision"
- **UK AI Playbook** [opened]:
  > "accuracy: … You must be clear about what objective measures you're assessing the AI outputs against"
- **Hotel evidence: h2c AI Opportunity Study 2026** (consultancy survey, vendor-sponsored; https://h2c.de/work/research/2026-ai-opportunity-study/; published Oct 2026) [opened]:
  > "only 13% currently report measurable ROI from AI initiatives."

  Base: the page does not state it. Search summaries give 122 responses from 113 hotel chains, global [search-only].

### Verdict logic

Answers: **Yes / No / Not sure**. "Not sure" never counts as Yes.

1. **Q1 = No → "Not an AI problem: rules or ordinary automation will do it."** This overrides everything; the other answers are not shown as blockers. Reason: the rest only matters if AI is the right kind of tool.
2. **Otherwise, Q2 = No → "Probably not worth it."** This overrides Q3 to Q5.
3. **Otherwise, Q3 = No → "Fix the data first."**
4. **Otherwise, Q5 = No → "Define success first."**
   - If both Q3 and Q5 are No, show "Fix the data first" as the verdict, with "Then define success" as a second line. Data takes longer to fix; a metric can be written in a day.
5. **Q4 = No never blocks.** If the verdict is otherwise positive, it becomes **"Worth exploring, as an assistant only: a person checks every result before it counts."** With any other verdict it is shown as a note.
6. **All Yes → "Worth exploring with AI. Next: find where it sits in your hotel."** This opens step 2.
7. **Not sure:**
   - If a higher-ranked No exists, that No decides.
   - Otherwise the verdict is **"Find out first"**, naming the open questions and who probably knows: Q1 the vendor or IT, Q2 the GM or finance, Q3 IT or the department head, Q4 the department head, Q5 the GM.
   - A "Not sure" on Q1 can show both outcomes side by side.

Precedence in one line: **Q1 > Q2 > Q3 > Q5**; Q4 is a modifier; "Not sure" sits below any No.

---

## B. What a hotel needs in general to implement AI (prerequisites)

**Hotel evidence first.** Figures, each with its base:

- **Eurostat 2025, EU accommodation (NACE I55).** Base: enterprises with 10+ persons employed that had considered AI but did not use it; ICT usage survey run by national statistical offices in early 2025; dataset isoc_eb_ain2, updated 15 Jun 2026 [opened, API query 23 Nov 2026]. Reasons given:

  | Reason for not using AI | Share |
  |---|---|
  | Lack of relevant expertise | 69.89% |
  | Lack of clarity about the legal consequences | 56.80% |
  | Concerns about data protection and privacy | 52.36% |
  | Incompatibility with existing equipment, software or systems | 45.91% |
  | Difficulties with availability or quality of the necessary data | 42.61% |
  | Costs seem too high | 40.95% |
  | Ethical considerations | 37.16% |
  | AI not useful | 16.10% |

  **21.31%** of all EU accommodation enterprises (10+ persons employed) used at least one AI technology in 2025.

  The all-sector text of the Statistics Explained article "Use of artificial intelligence in enterprises" (last edited 4 Nov 2026) [opened] reads:
  > "the most common reason for not using AI technologies was the lack of relevant expertise (70.89%), followed by lack of clarity about the legal consequences (52.52%), and concerns regarding violation of data protection and privacy (48.83%)"

  The API's all-activities aggregate (C10-S951_X_K) gives slightly different values: 70.31%, 53.61% and 52.72%. Quote the article for EU-wide figures and the API for the accommodation figures.
- **HES-SO Valais-Wallis (Schegg), news of 9 Jul 2025** (academic survey; https://www.hevs.ch/en/news/how-ai-is-and-isn-t-transforming-european-hospitality-212299) [opened]. Base: "over 1,500 hotels across six European countries between January and April 2025" (Austria, France, Germany, Greece, Italy, Switzerland).
  > "The most cited barrier in our study was 'poor knowledge of available AI solutions' (39%), followed by high setup costs (35%), technical complexity (34%), and lack of technical skills (32%)."

  and:

  > "Concerns over data privacy and integration hurdles are also prominent, particularly among larger hotels with complex legacy systems."

  The earlier team note gives the base as 1,485 hotels, 82% independent, median 31 rooms (from the full report, not re-opened here).
- **h2c AI & Automation Study 2025** (consultancy survey, vendor-sponsored; https://h2c.de/work/research/2025-ai-automation-study/) [opened]:
  > "Lack of AI expertise (62%), unclear strategy (51%), and integration challenges (45%) are the top obstacles cited by hotel chains."

  and:

  > "Seamless integration with existing hotel systems … (70% …) [is among] the top three investment decision factors"

  and:

  > "Only 11% of hotel chains have dedicated AI budgets"

  Base: not on the page. Search summaries give 189 responses from 171 chains, global [search-only].
- **State of Hotel AI, Fall 2026** (industry survey; https://stateofhotelai.com/, published 29 Sep 2026) [opened]. Base: 107 hotel company leaders, fielded Aug–Sep 2026; management companies 33%, owners or investors 28%; global; research by Josiah Mackenzie (Actabl), commissioned by Destination AI.
  > "Change management (35%), data quality (34%) and systems integration (29%) are the barriers hotel company leaders most often cite to getting value from AI."

  and:

  > "42% of responding hotel company leaders are confident their data is ready to support their AI goals; 48% are not."
- **Booking.com/Statista European Accommodation Barometer 2025.**
  - Base: 1,160 executives and managers in Europe's accommodation sector. The EU Transition Pathways page (https://transition-pathways.europa.eu/tourism/news/2025-european-accommodation-barometer-reveals-confidence-amidst-challenges-hospitality) [opened] says AI adoption "varies across the sector due to cost and integration issues".
  - The figures "high implementation costs (61%) and integration complexity (58%)" are **[search-only]** (TravelDailyNews returned 403).
- **Hotel Tech Report and HFTP materials:** both hosts returned 403, so nothing was used.

### Prerequisites

Notes on the tables below:
- Self-check questions reuse the readiness check's wording where one exists; the code is named. New wording is marked *new*.
- The answer scale is the one recommended in part D.

**B1. Systems that can talk to each other (PMS openness)**

| | |
|---|---|
| Plain explanation | The AI tool must read from and write back to your booking system (PMS) and other software, or staff end up copying data by hand. |
| What good looks like | The vendor confirms in writing a two-way link to your PMS version, and you have seen it work on your own systems. |
| Self-check | T1: "Has it been confirmed in writing that the tool can read from and write back to your hotel systems?" Also T4: "Do you have a written list of the software your hotel uses that shows which ones share data?" |

Sources:
- Eurostat I55: incompatibility with existing systems **45.91%** [opened].
- h2c 2025: integration is a top barrier at 45% and the top purchase factor at 70% [opened].
- State of Hotel AI: systems integration 29% [opened].

**B2. Older systems (legacy)**

| | |
|---|---|
| Plain explanation | An older PMS installed in the hotel often has no open connection. Many AI tools then cannot plug in, or need a costly custom bridge. |
| What good looks like | You know what kind of PMS you have. If it is old, you have a plan: an interface from the vendor, an upgrade date, or a tool that works without a link. |
| Self-check | T2: "Which describes your main hotel system (PMS)?" Answers: online system other software can connect to / all-in-one system that already includes this tool / older system in the hotel, hard to connect / don't know yet. |

Sources:
- HES-SO 2025 on "larger hotels with complex legacy systems" [opened].
- GOV.UK 2019 [opened]:
  > "how your product needs to integrate with your existing infrastructure"

**B3. Data you can reach, trust and own**

| | |
|---|---|
| Plain explanation | The tool is only as good as the bookings, guest records and hotel facts it reads. Someone must keep them right, and the hotel must keep the rights to them. |
| What good looks like | You can name where each piece of data sits. One up-to-date source holds the hotel's facts. A named person checks the data at set times. The contract says the data stays yours. |
| Self-check | D1: "Can you name the system that holds each piece of data this tool needs?" D4: "Is there one up-to-date source for your hotel's facts (rooms, services, prices, house rules) that the tool can use?" D3: "Does a named person check at set times that the data this tool uses is correct and up to date?" |

Sources:
- Eurostat I55: data availability or quality **42.61%** [opened].
- State of Hotel AI: 42% confident in their data, 48% not [opened].
- GOV.UK data quality list [opened].

**B4. Internet and devices where the work happens**

| | |
|---|---|
| Plain explanation | Cloud AI tools stop when the Wi-Fi or mobile signal drops: in the kitchen, the basement laundry, a remote wing. Staff also need devices that can run the tool. |
| What good looks like | Stable connection tested in each place the tool is used, and enough tablets or phones for the shift. |
| Self-check | T3: "Where the tool will be used, does the internet connection work without regular dropouts?" Device check (*new*): "Do the staff who will use the tool have a working device for it on every shift?" |

Source: OECD, "AI adoption by small and medium-sized enterprises", discussion paper for the G7, Dec 2025 (international organisation; https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/12/ai-adoption-by-small-and-medium-sized-enterprises_9c48eae6/426399c1-en.pdf) [opened]:
> "access to fast, reliable, and affordable connectivity is a pre-condition for SMEs' digital uptake"

and, naming four enablers:

> "i) connectivity, ii) AI-enabling inputs, iii) skills, and iv) finance"

*No hotel-specific connectivity figure was found.*

**B5. Data protection paperwork**

| | |
|---|---|
| Plain explanation | If the tool handles guest or staff data, the vendor is your "processor". The GDPR requires a written contract with it, and your data protection contact must agree. |
| What good looks like | A signed data processing agreement (DPA). It covers instructions, security, sub-processors, and returning or deleting data at the end, and says whether the vendor may train on your data. You also have a written OK from your data protection contact, and a DPIA where the risk is high. |
| Self-check | D5a: "Have you signed a data processing agreement with the vendor of this tool?" D5b: "Has your data protection contact confirmed in writing that you may use guest or staff data in this tool?" G2s (sensitive data): "Has a data protection impact assessment (DPIA) been done for this tool?" |

Sources:
- **EDPB Guidelines 07/2020 on the concepts of controller and processor in the GDPR**, v2.1, adopted 7 Jul 2021 (official guidance; https://www.edpb.europa.eu/system/files/2023-10/EDPB_guidelines_202007_controllerprocessor_final_en.pdf) [opened]:
  > "Any processing of personal data by a processor must be governed by a contract or other legal act under EU or Member State law between the controller and the processor, as required by Article 28(3) GDPR."

  and:

  > "Such legal act must be in writing, including in electronic form."

  and, on Art. 28(3)(g):

  > "On termination of the processing activities, the processor must, at the choice of the controller, delete or return all the personal data to the controller and delete existing copies"
- The GDPR text itself could not be fetched (EUR-Lex returned an empty file). Cite it through the EDPB text, or check it on EUR-Lex by hand.
- Eurostat I55: data protection concerns **52.36%** [opened].

**B6. Security check of the vendor**

| | |
|---|---|
| Plain explanation | The tool gets a key to your systems and guest data. Someone must check the vendor protects it. |
| What good looks like | IT or a security contact has reviewed the vendor (certifications, where the data is held, incident contact) before access is given. |
| Self-check | G4: "Has your IT or security contact checked this vendor's security before it gets access to your systems?" |

Sources:
- EDPB 07/2020 [opened]:
  > "A controller must only use processors providing sufficient guarantees to implement appropriate technical and organisational measures"
- NIST AI RMF GOVERN 6.1 [opened]:
  > "Policies and procedures are in place that address AI risks associated with third-party entities"

**B7. Vendor support, exit and getting your data back**

| | |
|---|---|
| Plain explanation | Before you sign, know who helps when it breaks, and how you leave with your data if the tool disappoints or the vendor closes. |
| What good looks like | Support hours and a named contact in the contract. Data export in a common format. Return or deletion at the end. Notice period and exit cost known. |
| Self-check | *new*: "Does the contract say how you get your data back, in a usable format, if you stop using the tool?" This partly sits in D5a's "what counts as Yes" ("how you get it back"). |

Sources:
- European Commission, "Data Act explained" (official guidance; https://digital-strategy.ec.europa.eu/en/policies/data-act-explained; the Data Act "applies since 12 September 2025") [opened]:
  > "providers of Platform and Software as a Service must make open interfaces available and, at a minimum, export data in a commonly used and machine-readable format"

  and switching charges are removed "from 12 January 2027".
- EDPB on Art. 28(3)(g) [opened].
- GOV.UK 2019 [opened]:
  > "you should make sure you can change your mind at a later stage"

**B8. A named owner with time**

| | |
|---|---|
| Plain explanation | Someone in the hotel is responsible for the tool. They watch the results, deal with the vendor and decide on changes, with hours set aside for it. |
| What good looks like | A named role with weekly hours written into a job description or the project plan. |
| Self-check | P1: "Is there a named person in charge of this tool, with agreed hours each week for it?" |

Sources:
- NIST AI RMF GOVERN 2.1 [opened]:
  > "Roles and responsibilities and lines of communication related to mapping, measuring, and managing AI risks are documented and are clear to individuals and teams throughout the organization."
- GOV.UK 2019 [opened]:
  > "it's important to understand who is responsible if the system fails"

**B9. Budget for the running costs, not only the start**

| | |
|---|---|
| Plain explanation | AI costs continue after launch: subscription, usage-based fees, connection to your systems, training, and someone's time to check results. |
| What good looks like | A 12-month budget with all cost lines. A named payer (hotel, owner, brand fund). A monthly bill check with a spending limit if the price depends on use. |
| Self-check | F1: "Is there a written budget for the first 12 months that covers the full cost, not only the subscription?" F4: "Is it decided who pays for the tool (hotel, owner, group fund, grant or vendor package)?" F5: "Does someone check the tool's bill every month?" |

Sources:
- UK AI Playbook [opened]:
  > "Ongoing investment is needed to maintain these systems, update them with new data if required, and ensure their performance remains stable over time."
- Eurostat I55: costs too high **40.95%** [opened].
- h2c 2025: "Only 11% of hotel chains have dedicated AI budgets" [opened].
- HES-SO 2025: set-up costs 35% [opened].

**B10. A way to work when the tool is down**

| | |
|---|---|
| Plain explanation | If the tool or the vendor fails for a day, guests still check in and emails still need answers. |
| What good looks like | A short written fallback for each task the tool does, known by the shift leaders. |
| Self-check | T5: "If the tool stops working for a day, is there a written way to do the job without it?" |

Sources:
- NIST AI RMF GOVERN 6.2 [opened]:
  > "Contingency processes are in place to handle failures or incidents in third-party data or AI systems deemed to be high-risk."
- NIST MANAGE 2.3 [opened]:
  > "Procedures are followed to respond to and recover from a previously unknown risk when it is identified."

Order for the tool: B1, B3, B5, B8, B9 first. They match readiness must-haves T1, D5a/D5b, P1 and F1, plus D1/D4.

---

## C. Success factors

For each factor:
- **RC** = where the readiness check already covers it.
- **Gap** = what it does not cover yet.

### C1. Budget

**Definition.** Money set aside for the whole life of the tool, and a clear answer to who pays.

**Good in a hotel.** A 12-month cost plan agreed with the owner or brand. A trial budget with a stop date.

**Self-check.**
- F1 (above).
- F3: "Have you agreed, before starting, what result a trial must reach for you to keep the tool?"

**Warning signs.**
- "The vendor said it's €99 a month" with no set-up, connection or training cost.
- Nobody knows whether the owner or the operator pays.

**Sources.**
- h2c 2025: 11% of chains have dedicated AI budgets [opened].
- Britz & Schegg, "From Awareness to Action: AI Readiness in Hotels", HES-SO Valais-Wallis, Oct 2025 (academic survey; https://www.hotellerie.de/fileadmin/user_upload/Dokumente/Studien_und_Umfragen/Britz_Schegg_2025_AI_Readiness_in_Hotels.pdf) [opened]. Base: questionnaire to 408 hoteliers from the earlier survey plus about 80 Swiss hotels; Jul–Sep 2025; median 37.5 rooms; the authors warn the sample is "likely to be more digitally aware". The response count is not in the text; the team note says about 80.
  > "A lack of time and budget, limited technical expertise, and difficulty in evaluating suitable AI providers create a bottleneck for implementation."

**RC:** F1, F3, F4, F5.

### C2. Workflow clarity

**Definition.** Knowing step by step how the job is done today, and how it will be done with the tool: who does what, who checks.

**Good in a hotel.** A one-page before/after for the task, such as email handling, agreed with the staff who do it.

**Self-check.** O2: "Have you written down, step by step, who does what once the tool is in use?"

**Warning signs.**
- The tool is bought "to see what it can do".
- Staff run the old and the new process side by side for months.

**Sources.**
- Google PAIR [opened]:
  > "Mapping the existing workflow for accomplishing a task can be a great way to find opportunities for AI to improve the experience."
- State of Hotel AI 2026 [opened]: success credited to "workflow redesign (32%)". Base: 107 leaders.
- McKinsey, The State of AI (Nov 2025; base about 1,993 participants per summaries): workflow redesign is linked to EBIT impact, and 55% of "high performers" redesigned workflows against 20% of others **[search-only; mckinsey.com unreachable]**.

**RC:** O2.

### C3. Leadership

**Definition.** The person who decides on spending backs the project in writing, understands what AI can and cannot do, and takes responsibility for its risks.

**Good in a hotel.**
- The owner or GM signs a one-page plan.
- The GM opens the staff briefing.
- In a managed or franchised hotel, everyone who must approve is listed.

**Self-check.**
- O1: "Has the person who decides on spending approved a short written plan that says what this tool should achieve?"
- P6: "Have the people who approve this spending had a briefing on AI?"
- O3: "Do you have a written list of everyone who must approve this tool before you buy it?"

**Warning signs.**
- The project lives in one enthusiastic department.
- The owner hears about it at invoice time.

**Sources.**
- NIST AI RMF GOVERN 2.3 [opened]:
  > "Executive leadership of the organization takes responsibility for decisions about risks associated with AI system development and deployment."
- OECD, "The Adoption of Artificial Intelligence in Firms: New Evidence for Policymaking", 2025 (international organisation with BCG and INSEAD; G7 survey of 840 enterprises 2022–23 plus interviews; https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/05/the-adoption-of-artificial-intelligence-in-firms_8fab986b/f9ef33c3-en.pdf) [opened]:
  > "Lack of senior management buy-in in many companies also appears problematic."
- Counterweight: State of Hotel AI 2026 credits "Executive mandates" for AI success at only **14%**, against experimentation at 34% [opened]. This argues for light written backing, not a top-down mandate.

**RC:** O1, O3, P6.

### C4. Culture

**Definition.** A hotel where staff are allowed to try, to question the tool and to report problems without blame, and where AI is seen as help, not a threat to jobs.

**Good in a hotel.**
- Staff tried the tool before the decision.
- There is a known person to tell when it errs.
- Managers talk openly about what happens to the time saved.

**Self-check.**
- X1: "Have the staff who will use the tool tried it or watched a demo?"
- O6: "Do staff know whom to tell when the tool gets something wrong?"
- P4: "Have you told the staff concerned what they will do with the time this tool saves?"

**Warning signs.**
- Staff override every suggestion.
- Rumours about job cuts.
- Nobody reports errors.

**Sources.**
- Heo, C. Y. & Schegg, R. (2026), "Structural resources or managerial cognition? Explaining hoteliers' perceived impact of artificial intelligence in hospitality", *International Journal of Hospitality Management*, doi 10.1016/j.ijhm.2026.104788 [abstract]. Base: 747 hotel managers in five European countries.
  > "managerial cognition plays a more important role than physical scale in shaping AI awareness"
- Li, Y. (2023), "Relationship between perceived threat of artificial intelligence and turnover intention in luxury hotels", *Heliyon*, doi 10.1016/j.heliyon.2023.e18520 [abstract]:
  > "hotel managers should emphasize organizational support, especially in finance, career, and adjustment"
- Schegg & Fux, Hotel Yearbook 2025 Technology Edition, 23 Jun 2025 (https://www.hotelyearbook.com/article/122000458/…) [opened], quoting a respondent:
  > "AI is not the problem – change is."

**Weakest-sourced factor.** No large European hotel survey measures culture directly. The evidence here is two academic abstracts and one quote.

**RC:** X1, O6, P4. P5 also gives staff the power to overrule.

### C5. Workforce readiness (skills)

**Definition.** Staff and managers know enough about AI to use the tool, check its output and know its limits.

**Good in a hotel.**
- Short role-based training that includes "how to spot a wrong answer".
- Managers can name one thing the tool cannot do.

**Self-check.**
- P2: "Can the managers involved name one thing this tool cannot do reliably?"
- P3: "Is training planned that teaches staff to check the tool's results, not only to use it?"

**Warning signs.**
- Training means "read the vendor's manual".
- Only one person understands the tool.

**Sources.**
- Eurostat I55: lack of relevant expertise **69.89%**, the top reason [opened].
- AI Act Art. 4 as replaced by Regulation (EU) 2026/1744 (local PDF) [opened]:
  > "Providers and deployers of AI systems shall take measures to support the development of AI literacy of their staff … This obligation does not require providers or deployers to guarantee any specific level of AI literacy of any individual."
- Commission "AI literacy – Questions & Answers" (official guidance; https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers) [opened]:
  > "in many cases, simply relying on the AI systems' instructions for use or asking the staff to read them might be ineffective."
- h2c 2026: chains rate their internal AI knowledge "3.4 out of 10" [opened].
- OECD SME 2025 [opened]:
  > "over 50% of nearly 1 000 respondents reported lack of knowledge about how to use generative AI as a barrier"

  Base: 2025 OECD D4SME survey across six G7 countries.

**RC:** P2, P3, P6.

### C6. Governance

**Definition.** Written rules on who may use AI for what, what must not be typed into AI tools, who approves new tools, and a record of the tools in use.

**Good in a hotel.**
- A one-page AI-use rule for staff.
- A list of AI tools in use, with owner and purpose. The hub's AI Register tab does this.
- A risk check before go-live.

**Self-check.**
- G1: "Do you have written rules telling staff what they must not type into AI tools?"
- G2: "Has a written risk check been done for this tool before it goes live?"

**Warning signs.**
- Staff paste guest data into free chatbots.
- Nobody knows how many AI tools the hotel pays for.

**Sources.**
- GOV.UK 2019 [opened]:
  > "It can be useful to keep a central record of all AI technologies you use, listing: where AI is in use; what the AI is used for; who's involved; how it's assessed or checked"
- Britz & Schegg 2025 [opened]: "only 9% have a formal strategy document".
- State of Hotel AI 2026 [opened]:
  > "Among hotel companies with a defined AI strategy and governance, 70% say execution is still fragmented."

**RC:** G1, G2, O3. For high-risk uses also XL and XG.

### C7. Risk

**Definition.** Knowing in advance what could go wrong (wrong answers, data leaks, unfair treatment, legal duties) and how much risk the hotel accepts.

**Good in a hotel.**
- Outputs that need a human check are named.
- Staff can overrule the tool.
- Legal duties have been checked (GDPR, AI Act tier).

**Self-check.**
- G3: "Have you decided which of the tool's outputs a person must check before they take effect?"
- P5: "Can staff overrule the tool when it gets something wrong?"
- XL: "Has someone checked what the EU AI Act asks of your hotel for this tool?"

**Warning signs.**
- "The vendor handles compliance."
- No one has asked where guest data goes.

**Sources.**
- NIST AI RMF MAP 1.5 [opened]:
  > "Organizational risk tolerances are determined and documented."
- NIST MAP 3.2 (above).
- Eurostat I55: lack of clarity about legal consequences **56.80%** [opened].
- AI Act Art. 26(2) (above).

**RC:** G2, G2s, G3, P5, XL.

### C8. Data and content

**Definition.** Correct, current, connected data and hotel content (facts, menus, policies, images) that the tool can use.

**Good in a hotel.**
- One fact source.
- Guest profiles not duplicated.
- A named person keeps content current.

**Self-check.**
- D1, D3, D4 (above).
- D2 (guest tools): "When a returning guest books, can staff see past stays, spending and preferences in one place?"

**Warning signs.**
- The chatbot gives last season's opening hours.
- Five profiles for one guest.

**Sources.**
- State of Hotel AI: data quality 34% as a barrier; 42% confident in their data [opened].
- Eurostat I55: data availability or quality 42.61% [opened].
- Britz & Schegg 2025 [opened]:
  > "a significant gap remains when it comes to data quality and ROI"
- UK AI Playbook on data quantity and quality [opened].

**RC:** D1–D4.

### C9. Change management

**Definition.** A planned way of taking people from the old way of working to the new one: telling them why, training, listening, adjusting, and involving staff representatives where the law requires it.

**Good in a hotel.**
- Staff briefed before launch.
- A pilot with feedback.
- The works council told in time.
- A review date set.

**Self-check.**
- XG (staff tools): "Have your staff representatives (works council, staff committee or union delegates) been formally told about this tool before it is used?"
- X2b (guest tools): "Have you tested the tool with real guests or collected their feedback?"
- *new*: "Is there a date, after launch, when you will ask staff what works and change the set-up?"

**Warning signs.**
- Launch by email.
- No pilot.
- Adoption measured only by logins.

**Sources.**
- State of Hotel AI 2026: change management **35%**, the top barrier to value [opened].
- OECD 2025, "Adoption of AI in Firms" [opened]:
  > "firms often run pilots without a strong vision or business plan to scale them up and integrate them with core business processes"

  and:

  > "Successfully adopting AI will sometimes require enterprises to develop effective internal change management strategies."
- Prosci, "AI adoption" blog (consultancy, change-management method vendor; https://www.prosci.com/blog/ai-adoption; date not shown on the page) [opened]:
  > "an independent study into personal, team and organizational AI usage conducted by Prosci, surveying 1,107 professionals across multiple industries, found that 63% of organizations cite human factors as a primary challenge in AI implementation."

  The page also says "43 of respondents attributed AI adoption failure to insufficient executive sponsorship". The percent sign is missing in the source, so do not quote that line.

**RC:** XG, X1, X2b, P4. Gap: the readiness check has no review-after-launch question.

### Factors with weak or partial sourcing

- **Culture (C4):** abstracts only; no European hotel survey.
- **Change management (C9) and workflow (C2):** the strongest consultancy evidence (McKinsey, BCG "10-20-70") could not be opened, because the hosts are not allowed in this session. They are search-only and must be checked before citing. The hotel evidence (State of Hotel AI, 107 leaders, global, commissioned by an industry forum) is useful but small.
- **Leadership (C3):** sources disagree in emphasis (OECD buy-in against the State of Hotel AI 14% executive mandate). Present both.
- **Connectivity (B4):** OECD only; no hotel figure.

---

## D. Answer scale and summary (no score)

### Scale

Use the readiness check's scale unchanged for steps 3 and 4:

**Yes · Planned, not done yet · Partly · No · Don't know yet**

- Same words and order as in `logic.js` (`ANSWER`: `y`, `pl`, `p`, `n`, `k`), so a hotel moving on to the readiness check sees nothing new.
- "Doesn't apply" is not needed at this general level. Every prerequisite applies to every hotel considering AI.
- No note field is needed: this is orientation, not the per-tool check. Keep the readiness check's honesty line:
  > "Nobody checks your answers. A Yes that isn't true only hides a problem you will meet after signing."

### Summary

No 0–100 score, no percentage (the owner rejected scores). Show four counts in words, mapped as in the readiness check:

| Count | Answers |
|---|---|
| in place | Yes |
| planned | Planned, not done yet (date optional; same wording as the readiness check: "Planned: finish before you sign") |
| gaps | Partly, No |
| to find out | Don't know yet |

**Count line.** Example: "4 in place · 2 planned · 3 gaps · 1 to find out". This mirrors the readiness check's "5 of 8 must-haves done · 2 planned · 1 not in place".

**"Start with these three".** The three weakest items, ranked as follows:
- **By answer:** No, then Partly, then Don't know yet, then Planned.
  - Planned is last because the hotel already has a plan.
  - Don't know yet comes before Planned because an unknown can hide a No.
- **Ties:** broken by a fixed order of importance:
  - prerequisites B1, B3, B5, B8, B9, B2, B6, B7, B10, B4;
  - then success factors C3, C1, C2, C8, C7, C6, C5, C9, C4.

  The first five prerequisites match readiness must-haves (T1, D1/D4, D5a/D5b, P1, F1). Leadership, budget and workflow come first among the factors because the hotel surveys and the OECD tie stalled pilots to them.
- **Each item** gets a one-line task and who usually does it, in the readiness check's style. For example:
  - "Ask the vendor to confirm in writing that it reads from and writes back to your PMS (IT / vendor)."
  - "Write a 12-month budget with all costs (GM / finance)."

**Overall line** (words, not a level). Keep it softer than the readiness verdicts so the two tools do not compete:

| Situation | Line |
|---|---|
| Any gap among B1, B3, B5, B8, B9 | "Close these before you talk to vendors." |
| Otherwise, any "Don't know yet" | "Find out these first." |
| Otherwise | "Good starting point. Run the readiness check for the tool you choose." |

**Hand-over.** Each item maps to readiness codes, so the answers could be carried over later as starting answers for those codes in a hotel profile. That is a design choice for the tool owner; it is not proposed here as built.

---

## Source table

All accessed 23 Nov 2026 unless stated.

| # | Source | Type | Date | Status |
|---|---|---|---|---|
| 1 | EU AI Act, Reg. (EU) 2024/1689, Art. 3(1), recital 12, Art. 4, 14, 26 (local PDF `tools/ai-act-explorer/EU AI Act June 2024.pdf`) | regulation | OJ 12.7.2024 | opened |
| 2 | Digital Omnibus on AI, Reg. (EU) 2026/1744 (local PDF) | regulation | 8 Jul 2026, OJ 24.7.2026 | opened |
| 3 | Commission Guidelines on the definition of an AI system, C(2025) 5053 final (https://ec.europa.eu/newsroom/dae/redirection/document/112455) | official guidance | 29.7.2025 | opened |
| 4 | Approval of content of the draft guidelines, C(2025) 924 final (https://ec.europa.eu/newsroom/dae/redirection/document/118559) | official guidance | 6.2.2025 | opened |
| 5 | AI Act Service Desk copy of the guidelines (https://ai-act-service-desk.ec.europa.eu/sites/default/files/2026-01/guide-definition_en.pdf) | official guidance | 2026 | search-only |
| 6 | Google PAIR, People + AI Guidebook: User Needs + Defining Success; Data Collection (https://pair.withgoogle.com/chapter/user-needs/) | vendor guidance | undated page | opened |
| 7 | GOV.UK, Assessing if AI is the right solution (https://www.gov.uk/guidance/assessing-if-artificial-intelligence-is-the-right-solution) | official guidance | 10 Jun 2019 | opened |
| 8 | UK AI Playbook for the UK Government (https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html) | official guidance | 10 Feb 2025 | opened |
| 9 | NIST AI RMF 1.0, NIST AI 100-1 (https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | standards body | Jan 2023 | opened |
| 10 | Brynjolfsson & Mitchell, *Science* 358:1530 (https://www.cs.cmu.edu/~tom/pubs/Science_WorkforceDec2017.pdf) | academic | Dec 2017 | opened |
| 11 | EDPB Guidelines 07/2020 controller and processor, v2.1 (https://www.edpb.europa.eu/system/files/2023-10/EDPB_guidelines_202007_controllerprocessor_final_en.pdf) | official guidance | 7 Jul 2021 (v2.1 20 Sep 2022) | opened |
| 12 | GDPR text on EUR-Lex | regulation | 2016 | failed (empty response); cited through #11 |
| 13 | European Commission, Data Act explained (https://digital-strategy.ec.europa.eu/en/policies/data-act-explained) | official guidance | page as of 23 Nov 2026 | opened |
| 14 | Commission, AI literacy Q&A (https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers) | official guidance | page as of 23 Nov 2026 | opened |
| 15 | Eurostat, Use of AI in enterprises (Statistics Explained; https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Use_of_artificial_intelligence_in_enterprises) | official statistics | last edited 4 Nov 2026 | opened |
| 16 | Eurostat API isoc_eb_ai and isoc_eb_ain2 (EU27, 2025, I55 and all activities) | official statistics | updated 15 Jun 2026 | opened |
| 17 | OECD, AI adoption by SMEs, G7 discussion paper (https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/12/ai-adoption-by-small-and-medium-sized-enterprises_9c48eae6/426399c1-en.pdf) | international organisation | Dec 2025 | opened |
| 18 | OECD, The Adoption of AI in Firms (https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/05/the-adoption-of-artificial-intelligence-in-firms_8fab986b/f9ef33c3-en.pdf) | international organisation | May 2025 | opened (PDF; HTML page 403) |
| 19 | HES-SO Valais-Wallis news, Schegg 2025 survey (https://www.hevs.ch/en/news/how-ai-is-and-isn-t-transforming-european-hospitality-212299) | academic survey | 9 Jul 2025 | opened |
| 20 | Britz & Schegg, AI Readiness in Hotels (hotellerie.de PDF) | academic survey | Oct 2025 | opened |
| 21 | Schegg & Fux, Hotel Yearbook 2025 Technology Edition | academic, trade publication | 23 Jun 2025 | opened |
| 22 | h2c 2026 AI Opportunity Study page (https://h2c.de/work/research/2026-ai-opportunity-study/) | consultancy survey (vendor-sponsored) | Oct 2026 | opened (base search-only) |
| 23 | h2c 2025 AI & Automation Study page (https://h2c.de/work/research/2025-ai-automation-study/) | consultancy survey (vendor-sponsored) | Oct 2025 | opened (base search-only) |
| 24 | State of Hotel AI, Fall 2026 (https://stateofhotelai.com/) | industry survey | 29 Sep 2026 | opened |
| 25 | EU Transition Pathways, 2025 European Accommodation Barometer news | official portal summarising a vendor survey | 2025 | opened |
| 26 | Booking.com/Statista barometer figures 61% / 58% (TravelDailyNews, PhocusWire) | vendor survey | 2025 | search-only (403) |
| 27 | Prosci, AI adoption blog (https://www.prosci.com/blog/ai-adoption) | consultancy | undated | opened |
| 28 | Heo & Schegg 2026, IJHM, doi 10.1016/j.ijhm.2026.104788 | academic | 30 May 2026 | abstract (OpenAlex) |
| 29 | Li 2023, *Heliyon*, doi 10.1016/j.heliyon.2023.e18520 | academic | 23 Jul 2023 | abstract (OpenAlex) |
| 30 | Kukanja & Planinc 2025, *Tourism and Hospitality*, doi 10.3390/tourhosp6050268 (286 Slovenian hospitality firms: adoption linked more to managers' attitudes than to firm size) | academic | 6 Dec 2025 | abstract (Crossref); not used above, available for C4 |
| 31 | Parsanejad & Zokaei Kuhbanani 2026, *Information Technology & Tourism*, doi 10.1007/s40558-026-00422-x | academic | 29 Oct 2026 | metadata only (Springer bot check) |
| 32 | McKinsey, The State of AI (2025 and 2026 editions) | consultancy survey | Nov 2025 / 2026 | search-only (host unreachable) |
| 33 | BCG, AI adoption in 2024 ("10-20-70") | consultancy survey | Oct 2024 | search-only (host unreachable) |
| 34 | Hotel Tech Report, HFTP, Hospitality Net, PhocusWire, PwC hospitality AI PDF | trade / consultancy | various | failed (403); not used |
