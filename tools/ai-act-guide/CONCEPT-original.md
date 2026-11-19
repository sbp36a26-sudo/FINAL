# Use AI confidently: the EU AI Act for your hotel
### Concept document for the interactive prototype (`hotel-ai-act-tool.html`)

**Status:** student prototype, EHL SBP Group 36 for HFTP. **Rules as of 19 Nov 2026.** Not legal advice. Not reviewed by a lawyer.

This document describes the tool as built: the idea, the flow, the logic behind every level, the vendor questions, the plan, the templates, the honest box, and exactly which statements are verified, which are the team's reading, and which are unverified. It replaces the earlier "Hotel AI Register" as the front door; the register's data and logic carry over (see section 12).

## Contents
1. Positioning
2. Target user
3. The four levels and how a level is decided
4. The flow, screen by screen
5. The 12 tool types (plus "other")
5b. Built in-house
6. Duties by level (hotel versus vendor)
7. The plan: how tasks, owners and dates are produced
8. Templates (full text)
9. Return and engagement mechanisms
10. The honest box: enforcement, penalties, dates, GDPR pointer
11. Accuracy labels: verified, team's reading, unverified
12. What carries over from the register, and what is dropped
13. Phase 2 ideas (HFTP)
14. Open decisions for Ludo
15. Files and how the prototype was tested

## 1. Positioning

**"Use AI confidently."** The honest message is that most hotel AI is low-risk. A few things really matter, and each has a clear next step. The tool is **not** a compliance audit, a legal opinion or a register. It answers the question a GM actually has: *I use these tools, so what must I do, by when, and what do I ask my suppliers?*

Why the register felt low-value: it was a compliance inventory, and no hotel GM wakes up wanting one. Hotels almost never build AI. They buy it inside vendor products (property management, revenue management, chatbots, hiring platforms, CCTV, rota tools), so under the Act they are mainly **deployers** (users) with lighter but real duties. Most of the work is getting answers from suppliers.

Working title: *What the EU AI Act means for your hotel.* Page title in the build: *Use AI confidently: the EU AI Act for your hotel.* Alternatives: *Your Hotel's AI, Tool by Tool*; *Is It AI? A Hotel Guide to the EU AI Act*.

## 2. Target user

- **Primary:** the general manager of an independent hotel or a small group (2 to 10 hotels). About 10 minutes, one hotel.
- **Chains and franchises:** head office or the brand usually decides which systems are bought and may carry the main duties. The tool says so on the hotel screen, the plan keeps local tasks only, and the supplier email can be addressed to head office or brand IT.
- **Small hotels (under 50 rooms):** one person often covers several jobs, so every task names "GM, or whoever covers it" instead of a department head.
- **Not yet covered:** group mode for many hotels, accounts, assignable tasks with logins.

## 3. The four levels and how a level is decided

| Level | In plain words | Hotel example | Applies |
|---|---|---|---|
| Banned | Do not use it. It cannot be made compliant. | Reading staff emotions from face or voice | Since 2 Feb 2025 |
| High-risk | Allowed, with strict rules for the vendor and for you. | CV screening, ranking staff | Hotel duties from 2 Dec 2027 |
| Transparency | Allowed, but people must be told it is AI. | Guest chatbot, realistic AI images | Since 2 Aug 2026 |
| Minimal | No new duty beyond briefing your staff (AI literacy). | Room pricing, drafting menus | AI literacy applies now |

**Decision rules (as coded):**

1. Each tool has one or two questions. Each answer maps to a level, a plain reason and a footnote basis.
2. The tool's level is the **highest** level among answered questions (order: Banned > High-risk > Transparency > "Not sure yet" > Minimal).
3. **"Not sure" never reassures.** Where "not sure" is offered it maps to the more careful level and is shown as "Possibly high-risk", "Possibly banned" or "Possibly transparency". An open emotion-reading question therefore beats a lower label once answered "not sure".
4. Unanswered questions are not assumed: the badge shows the level from the questions answered so far, and says how many are still open. If nothing is answered the badge reads "Not answered yet".
5. On a tie, a firm answer beats a provisional one.
6. The result shows the deciding answer's reason, and flags "Team's reading, not settled" where that answer is labelled as such.
7. Banned results lead with "stop", not with high-risk duties.

## 4. The flow, screen by screen

**Navigation:** a row of steps (Start, 1 Hotel, 2 Tools, 2b Built in-house, 3 Results, 4 Vendors, 5 Plan, 6 Templates, Keep, Good to know). Progressive disclosure: one screen at a time, one primary button per screen, tool sections collapse.

**Start.** Positioning in three lines, the four levels at a glance, a chain note, "Start with my hotel" (primary) and "Load an example hotel". If saved progress exists: "Welcome back" with a continue button.

**1. Hotel.** Name, country (EU countries plus CH, GB, other EU, other non-EU), size (under 50, 50 to 150, over 150 rooms), how it is run (independent, small group, chain or franchise), departments. Then country-specific notes:
- CH, GB and other non-EU: a "for reference: EU rules" warning (see section 10).
- DE, FR, ES, SE: who supervises and the staff-representative rule (table below). AT, BE, DK, IE, IT, NL, PT: a "check yours" line, as no research notes exist yet. Other EU: generic line.

| Country | Who supervises | Staff representatives |
|---|---|---|
| DE | The Bundesnetzagentur is the market surveillance authority, single point of contact and complaints body. | With a works council, you cannot switch on AI that can monitor staff behaviour or performance (most rota, performance and HR tools) without its agreement. |
| FR | The DGCCRF is the single point of contact. Which regulator supervises which area (for example the CNIL for employment AI) is not yet settled in law. | With 50 or more staff, the CSE must be informed and consulted before you decide to introduce AI. Courts have suspended deployments that skipped this (team's reading). |
| ES | AESIA is the market surveillance authority and single point of contact. There is no national implementing law yet, so the set-up is provisional. | The works council has a right to be told the logic and rules of algorithms that affect working conditions, including CV screening and scheduling (team's reading). |
| SE | PTS holds an interim government mandate until 31 Dec 2026. Supplementary law is pending. | With a collective agreement, treat AI rostering or performance tools as needing union negotiation before you decide (team's reading). |
| CH | Switzerland has no AI act. A Federal Council consultation on a draft is planned for spring 2027 (date estimated). | Ordinance 3 to the Labour Act (art. 26) prohibits systems meant to monitor staff behaviour; other proportionate monitoring is allowed. This applies whatever happens with AI law (team's reading). |
| GB | The EU AI Act is not UK law, so there is no UK authority for it. | The ICO leads on AI in recruitment through data-protection law. Its guidance is under review. |

**2. Tools.** 12 tool types plus "another AI tool" as switch cards (departments you picked come first). A call-out "Built or customised an AI yourselves?" links to step 2b (section 5b); the old single "we built one ourselves" flag is gone. Then, for each picked tool, the refine questions with a live "Level right now", and a "Not bought yet: I am checking this before I buy" toggle.

**2b. Built in-house.** Add one or more AI systems the hotel built, had built or changed heavily; see section 5b. Reachable from the nav and from the Tools screen; results, plan, reminders, templates, save code and owner summary all include it.

**3. Results.** Counts per level, a "Start here" list (the top three non-minimal tools with one concrete next step each), then one collapsible card per tool: level, why, when it applies, vendor status, what the hotel does, what the vendor must do, and the basis footnote. "Good news" appears if nothing needs more than staff briefing.

**4. Vendors.** Per tool: exact questions with *A fine answer* and *A red flag* columns, a status (Not asked yet, Asked the vendor, Answered: looks fine, Answered: red flag), the date asked, a note. A red flag adds a follow-up task.

**5. Plan.** Progress bar, open-legal count, next legal date, department filter, hide-finished toggle, task table with Done, To do (with basis), Owner, Legal date, Suggested by.

**6. Templates.** Chatbot notice, staff policy, literacy checklist, supplier email, internal AI build record; each filled with the hotel name, each copyable.

**Keep.** Come-back-when reminders, save code and load, owner summary, phase 2 note.

**Good to know.** The honest box (section 10).

## 5. The 12 tool types (plus "other")

For every tool: what it is, the question(s), the answer → level mapping with the plain reason and basis, and the vendor questions with a fine answer and a red flag. "Team reading" means the label is the team's interpretation, not settled. "Possibly" means the provisional "not sure" mapping. Article numbers are footnotes only.

### 5.1 Guest chatbot or messaging assistant

*Answers guests on your website, WhatsApp or email.* Departments: Front office, Marketing. Affects staff (triggers the national labour-law task): no.

**Question:** What does it do?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Answers guests' questions itself (chat, messaging, email) | Transparency | Guests talking to an AI must be told it is an AI. The vendor has to build that in, and you check it. | Art. 50(1), (5) | Firm |
| Only drafts replies that a team member reads and sends | Minimal | A person sends the message, so guests are not talking to an AI (our reading). | Art. 50(1) | Team's reading |
| Not sure | Possibly transparency | Probably talks to guests directly. Check that it tells them it is an AI. | Art. 50(1), (5) | Possibly (provisional) |

**Question (shared emotion question):** Does it try to read emotions or mood from faces or voices (not just from the words people write)?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| No | Minimal | It does not read emotions from faces or voices. | Art. 3(39) | Firm |
| Yes, guests' or customers' | High-risk | Emotion recognition is on the high-risk list, and the people exposed must be told. | Annex III 1(c); Art. 50(3) | Firm |
| Yes, staff or job applicants' | Banned | Reading the emotions of people at work is banned, apart from a narrow medical or safety exception. | Art. 5(1)(f) | Firm |
| Not sure | Possibly banned | Could be banned if it reads staff emotions. Ask the vendor before you use that feature. | Art. 5(1)(f); Annex III 1(c) | Possibly (provisional) |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Does it tell people it is an AI at the first message or call? Can we edit that wording? | Yes by default, at first contact, with wording we can change. They can show it in a demo. | Only in the terms and conditions, switched off by default, or 'guests prefer it to feel human'. |
| How does a guest reach a person? Does it hand over on request and when it cannot help? | A 'talk to a person' route at any time, with the conversation passed on. | No human route, or the guest has to start again. |
| What data does it use, where is it stored, and do you use our data to train models for others? | EU storage or a valid transfer tool, a signed data-processing agreement, and training on our data only if we opt in. | Training on our data by default, or no data-processing agreement. |

### 5.2 Revenue management or dynamic pricing

*Suggests or sets room rates from demand.* Departments: Revenue. Affects staff (triggers the national labour-law task): no.

**Question:** Pick the most sensitive thing it does

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Prices from demand, events, competitor rates and bookings | Minimal | It prices rooms, not people, and decides nothing about a person's rights. | Not on the Act's high-risk list | Firm |
| Sets different prices for individual guests from what it knows about them | Minimal | Not high-risk under the AI Act, but personalised prices raise consumer-law and data-protection questions. Ask the vendor. | Outside the AI Act: consumer law, GDPR | Firm |
| Targets guests it sees as vulnerable (age, disability, money worries) to make them pay more | Banned | Banned if it exploits a vulnerability linked to age, disability or a social or economic situation to distort behaviour in a way that causes significant harm. | Art. 5(1)(b) | Firm |
| Not sure | Not sure yet | Find out what it prices on. Ask the vendor. | none | Firm |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Does anything price or target individual guests from personal data or a profile, rather than only from demand and bookings? | Prices come from market and demand signals. If anything is personalised, it is documented, explainable and based on consent. | Per-guest prices from device, location or inferred wealth, or targeting of 'vulnerable' segments. |
| Which features of [product] use AI (learning, predicting, ranking, generating or conversing)? Please list them. | A clear list by feature, in plain words, with what each one does. | 'It is all proprietary', 'we do not use AI' while the brochure says AI, or no list at all. |
| What data does it use, where is it stored, and do you use our data to train models for others? | EU storage or a valid transfer tool, a signed data-processing agreement, and training on our data only if we opt in. | Training on our data by default, or no data-processing agreement. |

### 5.3 PMS with AI features

*Room assignment, no-show prediction, upsell prompts, auto-replies.* Departments: Front office. Affects staff (triggers the national labour-law task): no.

**Question:** Pick the most sensitive AI feature that is switched on

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Forecasts, room assignment, upsell suggestions, drafted messages | Minimal | Ordinary operational AI. No new duty beyond a staff briefing. | Not on the Act's high-risk list | Firm |
| Sends AI-written replies to guests with no person checking | Transparency | Guests talking to an AI must be told it is an AI. | Art. 50(1) | Firm |
| Scores guests on trustworthiness, behaviour or credit and uses it to refuse or limit service | Possibly banned | Credit scoring of people is high-risk. General social scoring (rating people on behaviour and treating them worse in unrelated settings) is banned. Get advice first. | Annex III 5(b); Art. 5(1)(c) | Possibly (provisional) |
| Not sure | Not sure yet | Find out which AI features are on. Ask the vendor. | none | Firm |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Which features of [product] use AI (learning, predicting, ranking, generating or conversing)? Please list them. | A clear list by feature, in plain words, with what each one does. | 'It is all proprietary', 'we do not use AI' while the brochure says AI, or no list at all. |
| Which EU AI Act level do you give each feature (banned, high-risk, transparency or minimal), and why? Please answer in writing. | A written level per feature, with the reason, and who counts as the provider. | 'The Act does not apply to us', 'ask your lawyer', or any answer with no reasons. |
| What data does it use, where is it stored, and do you use our data to train models for others? | EU storage or a valid transfer tool, a signed data-processing agreement, and training on our data only if we opt in. | Training on our data by default, or no data-processing agreement. |

### 5.4 CV screening or candidate ranking

*Filters, scores or ranks job applicants.* Departments: HR. Affects staff (triggers the national labour-law task): yes.

**Question:** What does it do with applicants?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Filters, scores, ranks or shortlists applicants | High-risk | Selecting job applicants is on the Act's high-risk list. | Annex III 4(a) | Firm |
| Only schedules interviews or answers candidates' questions; people choose who goes forward | Transparency | The AI selects no one, but if it chats with candidates it must say it is an AI. | Art. 50(1) | Firm |
| Not sure | Possibly high-risk | Treat it as high-risk until the vendor tells you in writing what it does. | Annex III 4(a) | Possibly (provisional) |

**Question (shared emotion question):** Does it try to read emotions or mood from faces or voices (not just from the words people write)?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| No | Minimal | It does not read emotions from faces or voices. | Art. 3(39) | Firm |
| Yes, guests' or customers' | High-risk | Emotion recognition is on the high-risk list, and the people exposed must be told. | Annex III 1(c); Art. 50(3) | Firm |
| Yes, staff or job applicants' | Banned | Reading the emotions of people at work is banned, apart from a narrow medical or safety exception. | Art. 5(1)(f) | Firm |
| Not sure | Possibly banned | Could be banned if it reads staff emotions. Ask the vendor before you use that feature. | Art. 5(1)(f); Annex III 1(c) | Possibly (provisional) |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Does it score, rank or filter applicants? On which criteria? Can we see and change them, and turn ranking off? | Visible, editable criteria; a recruiter decides; ranking can be switched off. | A hidden 'fit score', criteria we cannot see, or automatic rejection. |
| Is it high-risk under the Act's employment category? Will it be CE-marked and registered by 2 December 2027, or is it a legacy product? Will you tell us before an update changes that? | A dated plan with a named contact, or a written reason why it is outside the category. | 'You are the user, not our problem', no plan, or 'we will update when required' with no date. |
| What instructions for use and human-oversight guidance do you give us? Can a reviewer see why a result came out and overrule it? | Written instructions, a screen that shows the reasons, and an override. | Black-box scores with no explanation and no way to overrule them. |
| Which logs are kept, for how long, and can we export them? We need at least six months where the logs are under our control. | Exportable logs, with retention of six months or more that we can set. | Automatic deletion after 30 days, or no export. |

### 5.5 Job-ad targeting

*Decides who sees your job ads, or drafts them.* Departments: HR, Marketing. Affects staff (triggers the national labour-law task): yes.

**Question:** What does it do?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Decides who sees our job ads (targeting, automatic placement) | High-risk | The recruitment category names placing targeted job advertisements. | Annex III 4(a) | Firm |
| Drafts job-ad text; we choose where and to whom it is posted | Minimal | It writes words. It does not select or rank anyone. | Not on the Act's high-risk list | Firm |
| Not sure | Possibly high-risk | Treat it as high-risk until you know whether it picks the audience. | Annex III 4(a) | Possibly (provisional) |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Does it decide who sees our job ads (by age, gender, location or profile)? Can we set the audience ourselves? | We set the audience; no targeting on protected traits. | Automatic optimisation by demographics that we cannot switch off. |
| Is it high-risk under the Act's employment category? Will it be CE-marked and registered by 2 December 2027, or is it a legacy product? Will you tell us before an update changes that? | A dated plan with a named contact, or a written reason why it is outside the category. | 'You are the user, not our problem', no plan, or 'we will update when required' with no date. |
| Have you tested it for bias (for example by gender, age or nationality)? Can you share a summary? | A written summary of testing, repeated after major updates. | 'AI is objective' or 'there is no bias'. |

### 5.6 Staff rota or scheduling

*Plans shifts from demand and availability.* Departments: HR, Housekeeping, F&B, Front office. Affects staff (triggers the national labour-law task): yes.

**Question:** What does it do?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Fills shifts from forecast demand and staff's stated availability | Minimal | Placing shifts by availability does not rank anyone. This split follows the Commission's draft guidance of 19 May 2026, which is not final. | Annex III 4(b); draft guidance | Team's reading |
| Ranks or scores staff, or decides who gets more or fewer hours, shifts or leave | High-risk | Evaluating staff and deciding terms of work are on the high-risk list. | Annex III 4(b) | Firm |
| Not sure | Possibly high-risk | Treat it as high-risk until the vendor says in writing what drives its shift decisions. | Annex III 4(b) | Possibly (provisional) |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Does it use anything beyond stated availability and forecast demand to decide who works when (for example performance scores, speed, sick days)? Can it decide hours or leave? | Availability, contract hours and forecast only; no individual scoring; a manager approves hours. | It ranks staff on 'reliability' or 'productivity' and allocates shifts from that. |
| Which EU AI Act level do you give each feature (banned, high-risk, transparency or minimal), and why? Please answer in writing. | A written level per feature, with the reason, and who counts as the provider. | 'The Act does not apply to us', 'ask your lawyer', or any answer with no reasons. |
| What instructions for use and human-oversight guidance do you give us? Can a reviewer see why a result came out and overrule it? | Written instructions, a screen that shows the reasons, and an override. | Black-box scores with no explanation and no way to overrule them. |

### 5.7 Staff performance or productivity monitoring

*Housekeeping productivity, call scoring, sales rankings.* Departments: HR, Housekeeping, Front office, F&B. Affects staff (triggers the national labour-law task): yes.

**Question:** What does it do?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Tracks or scores individual staff performance or behaviour | High-risk | Monitoring and evaluating the performance and behaviour of workers is on the high-risk list. | Annex III 4(b) | Firm |
| Only shows team or process figures, with no individual scores | Minimal | No individual evaluation (our reading). Labour law on staff monitoring still applies. | Annex III 4(b) | Team's reading |
| Not sure | Possibly high-risk | Treat it as high-risk until you know whether it scores individuals. | Annex III 4(b) | Possibly (provisional) |

**Question (shared emotion question):** Does it try to read emotions or mood from faces or voices (not just from the words people write)?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| No | Minimal | It does not read emotions from faces or voices. | Art. 3(39) | Firm |
| Yes, guests' or customers' | High-risk | Emotion recognition is on the high-risk list, and the people exposed must be told. | Annex III 1(c); Art. 50(3) | Firm |
| Yes, staff or job applicants' | Banned | Reading the emotions of people at work is banned, apart from a narrow medical or safety exception. | Art. 5(1)(f) | Firm |
| Not sure | Possibly banned | Could be banned if it reads staff emotions. Ask the vendor before you use that feature. | Art. 5(1)(f); Annex III 1(c) | Possibly (provisional) |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Does it score or rank individuals, or only show team and process figures? Can individual scoring be switched off? | Team-level by default; individual scoring is optional and documented. | Always-on individual scores or leaderboards. |
| Does any feature infer emotions, mood or personality from faces, voices or body language? Can it be switched off? | No such feature, or a separate module that is off for EU customers. Text-only sentiment is explained as such. | 'Mood' or 'engagement' scores from video or voice switched on by default, or 'sentiment' with no source named. |
| Is it high-risk under the Act's employment category? Will it be CE-marked and registered by 2 December 2027, or is it a legacy product? Will you tell us before an update changes that? | A dated plan with a named contact, or a written reason why it is outside the category. | 'You are the user, not our problem', no plan, or 'we will update when required' with no date. |

### 5.8 CCTV, face identification or access control

*Cameras with analytics, face recognition, door access.* Departments: Security & IT. Affects staff (triggers the national labour-law task): yes.

**Question:** What does it do?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Records or detects intrusion, objects or crowding, without identifying people by face | Minimal | Not high-risk. Data-protection law still applies to filming people. | Not on the Act's high-risk list; GDPR | Firm |
| Matches a person's face to their own ID or key (1:1), for example at check-in | Minimal | Checking someone against their own ID is verification, which the biometric high-risk category excludes. Strict GDPR rules on biometric data still apply. | Annex III 1(a); GDPR Art. 9 | Firm |
| Recognises or identifies guests or staff by face in the camera feed | High-risk | Identifying people at a distance by their biometric data is high-risk. This label is the team's reading of draft guidance. Building a face database from camera footage is banned. | Annex III 1(a); Art. 5(1)(e) | Team's reading |
| Not sure | Possibly high-risk | Treat it as high-risk until the vendor says what it identifies. | Annex III 1(a) | Possibly (provisional) |

**Question (shared emotion question):** Does it try to read emotions or mood from faces or voices (not just from the words people write)?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| No | Minimal | It does not read emotions from faces or voices. | Art. 3(39) | Firm |
| Yes, guests' or customers' | High-risk | Emotion recognition is on the high-risk list, and the people exposed must be told. | Annex III 1(c); Art. 50(3) | Firm |
| Yes, staff or job applicants' | Banned | Reading the emotions of people at work is banned, apart from a narrow medical or safety exception. | Art. 5(1)(f) | Firm |
| Not sure | Possibly banned | Could be banned if it reads staff emotions. Ask the vendor before you use that feature. | Art. 5(1)(f); Annex III 1(c) | Possibly (provisional) |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Does it identify people by face (one against many) or only match a person to their own ID (one to one)? Where are face templates stored and for how long? | One-to-one only, with opt-in consent, an alternative for guests, and templates deleted after a short, stated period. | A face database built from camera footage, no consent step, or unlimited retention. |
| Does any feature infer emotions, mood or personality from faces, voices or body language? Can it be switched off? | No such feature, or a separate module that is off for EU customers. Text-only sentiment is explained as such. | 'Mood' or 'engagement' scores from video or voice switched on by default, or 'sentiment' with no source named. |
| What data does it use, where is it stored, and do you use our data to train models for others? | EU storage or a valid transfer tool, a signed data-processing agreement, and training on our data only if we opt in. | Training on our data by default, or no data-processing agreement. |

### 5.9 AI-generated marketing content or images

*Text, images, video or audio for ads, social media and the website.* Departments: Marketing. Affects staff (triggers the national labour-law task): no.

**Question:** Pick the most sensitive thing it makes

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Text for ads, social posts and the website, checked by a person | Minimal | Ordinary drafting. No new duty beyond a staff briefing. | Not on the Act's high-risk list | Firm |
| Images, video or audio that could pass for real people, places or events | Transparency | AI-made content that looks real must be disclosed as AI-made. The Act's definition of a deep fake includes existing places, so an AI image of your own hotel can count. | Art. 3(60); Art. 50(4) | Firm |
| Sustainability or corporate reports that you publish | Possibly transparency | AI-written text published to inform the public on matters of public interest must be labelled, unless a person reviewed it and holds editorial responsibility. Whether your text counts is for you to check against the Commission's Art. 50 guidelines. | Art. 50(4); C/2026/6005 | Possibly (provisional); Team's reading |
| Not sure | Possibly transparency | Probably needs a label if it looks real. Check what it makes. | Art. 50(4) | Possibly (provisional) |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Does it mark generated images, video and audio as AI-made in a machine-readable way (for example metadata or a watermark)? | Yes, built in, documented, and it survives export. | No marking, or 'you can add a watermark yourself'. |
| Which EU AI Act level do you give each feature (banned, high-risk, transparency or minimal), and why? Please answer in writing. | A written level per feature, with the reason, and who counts as the provider. | 'The Act does not apply to us', 'ask your lawyer', or any answer with no reasons. |
| What data does it use, where is it stored, and do you use our data to train models for others? | EU storage or a valid transfer tool, a signed data-processing agreement, and training on our data only if we opt in. | Training on our data by default, or no data-processing agreement. |

### 5.10 Review responses and sentiment analysis

*Drafts replies to reviews, sorts reviews by topic and mood.* Departments: Marketing, Front office. Affects staff (triggers the national labour-law task): no.

**Question:** What does it analyse?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Only the written text of reviews | Minimal | Mood read from written words is not emotion recognition, which is about faces and voices (our reading). | Art. 3(39) | Team's reading |
| Also guests' voice or video recordings, to detect mood | High-risk | Emotion recognition from voice or face is high-risk, and the people exposed must be told. | Annex III 1(c); Art. 50(3) | Firm |
| Not sure | Not sure yet | Find out what data it analyses. Ask the vendor. | none | Firm |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Which features of [product] use AI (learning, predicting, ranking, generating or conversing)? Please list them. | A clear list by feature, in plain words, with what each one does. | 'It is all proprietary', 'we do not use AI' while the brochure says AI, or no list at all. |
| Does any feature infer emotions, mood or personality from faces, voices or body language? Can it be switched off? | No such feature, or a separate module that is off for EU customers. Text-only sentiment is explained as such. | 'Mood' or 'engagement' scores from video or voice switched on by default, or 'sentiment' with no source named. |
| What data does it use, where is it stored, and do you use our data to train models for others? | EU storage or a valid transfer tool, a signed data-processing agreement, and training on our data only if we opt in. | Training on our data by default, or no data-processing agreement. |

### 5.11 Upsell and personalisation

*Offers and messages tailored to each guest.* Departments: Revenue, Marketing, Front office. Affects staff (triggers the national labour-law task): no.

**Question:** What does it use to tailor offers?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Stay history and preferences you already hold | Minimal | Personalised offers are not high-risk under the Act. GDPR rules on profiling and consent still apply. | Not on the Act's high-risk list; GDPR | Firm |
| It pushes offers at guests it sees as vulnerable (age, disability, money worries) | Banned | Banned if it exploits a vulnerability to distort behaviour in a way that causes significant harm. | Art. 5(1)(b) | Firm |
| Not sure | Not sure yet | Find out what data it tailors on. Ask the vendor. | none | Firm |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Does anything price or target individual guests from personal data or a profile, rather than only from demand and bookings? | Prices come from market and demand signals. If anything is personalised, it is documented, explainable and based on consent. | Per-guest prices from device, location or inferred wealth, or targeting of 'vulnerable' segments. |
| Which features of [product] use AI (learning, predicting, ranking, generating or conversing)? Please list them. | A clear list by feature, in plain words, with what each one does. | 'It is all proprietary', 'we do not use AI' while the brochure says AI, or no list at all. |
| What data does it use, where is it stored, and do you use our data to train models for others? | EU storage or a valid transfer tool, a signed data-processing agreement, and training on our data only if we opt in. | Training on our data by default, or no data-processing agreement. |

### 5.12 Voice and phone AI

*Reservation line, in-room voice, call analytics.* Departments: Front office. Affects staff (triggers the national labour-law task): yes.

**Question:** What does it do?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Answers or makes calls with a synthetic voice | Transparency | People talking to an AI by voice must be told it is an AI. | Art. 50(1), (5) | Firm |
| Only transcribes or translates calls | Minimal | Transcription and translation are not 'interacting' with people under the Commission's Art. 50 guidelines. | Art. 50(1); C/2026/6005 | Firm |
| Scores agents' or staff members' calls | High-risk | Evaluating individual staff is on the high-risk list. | Annex III 4(b) | Firm |
| Not sure | Possibly transparency | Probably talks to callers. Check that it tells them it is an AI. | Art. 50(1), (5) | Possibly (provisional) |

**Question (shared emotion question):** Does it try to read emotions or mood from faces or voices (not just from the words people write)?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| No | Minimal | It does not read emotions from faces or voices. | Art. 3(39) | Firm |
| Yes, guests' or customers' | High-risk | Emotion recognition is on the high-risk list, and the people exposed must be told. | Annex III 1(c); Art. 50(3) | Firm |
| Yes, staff or job applicants' | Banned | Reading the emotions of people at work is banned, apart from a narrow medical or safety exception. | Art. 5(1)(f) | Firm |
| Not sure | Possibly banned | Could be banned if it reads staff emotions. Ask the vendor before you use that feature. | Art. 5(1)(f); Annex III 1(c) | Possibly (provisional) |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Does it tell people it is an AI at the first message or call? Can we edit that wording? | Yes by default, at first contact, with wording we can change. They can show it in a demo. | Only in the terms and conditions, switched off by default, or 'guests prefer it to feel human'. |
| Does any feature infer emotions, mood or personality from faces, voices or body language? Can it be switched off? | No such feature, or a separate module that is off for EU customers. Text-only sentiment is explained as such. | 'Mood' or 'engagement' scores from video or voice switched on by default, or 'sentiment' with no source named. |
| What data does it use, where is it stored, and do you use our data to train models for others? | EU storage or a valid transfer tool, a signed data-processing agreement, and training on our data only if we opt in. | Training on our data by default, or no data-processing agreement. |

### 5.13 Another AI tool

*Something not listed here. Two quick questions.* Departments: Management. Affects staff (triggers the national labour-law task): no.

**Question:** What does it mainly do?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| Talks with people (chat, voice, email) | Transparency | People talking to an AI must be told it is an AI. | Art. 50(1), (5) | Firm |
| Ranks, scores, evaluates or decides about staff, applicants or customers | Possibly high-risk | Decisions about people's jobs, pay, hours, credit or access to services are often on the high-risk list. Check the exact use. | Annex III 4, 5 | Possibly (provisional) |
| Identifies people by face, voice or another biometric trait | Possibly high-risk | Biometric identification is often high-risk, and GDPR is strict. Get advice. | Annex III 1(a) | Possibly (provisional) |
| Makes realistic images, video or audio | Transparency | AI-made content that looks real must be disclosed as AI-made. | Art. 50(4) | Firm |
| Forecasts, summarises, translates or drafts for staff, with a person checking | Minimal | Ordinary support AI. No new duty beyond a staff briefing. | Not on the Act's high-risk list | Firm |
| Not sure | Not sure yet | Find out what it does. Ask the vendor. | none | Firm |

**Question (shared emotion question):** Does it try to read emotions or mood from faces or voices (not just from the words people write)?

| Answer | Level | Why (plain) | Basis | Label |
|---|---|---|---|---|
| No | Minimal | It does not read emotions from faces or voices. | Art. 3(39) | Firm |
| Yes, guests' or customers' | High-risk | Emotion recognition is on the high-risk list, and the people exposed must be told. | Annex III 1(c); Art. 50(3) | Firm |
| Yes, staff or job applicants' | Banned | Reading the emotions of people at work is banned, apart from a narrow medical or safety exception. | Art. 5(1)(f) | Firm |
| Not sure | Possibly banned | Could be banned if it reads staff emotions. Ask the vendor before you use that feature. | Art. 5(1)(f); Annex III 1(c) | Possibly (provisional) |

**Vendor questions**

| Ask | A fine answer | A red flag |
|---|---|---|
| Which features of [product] use AI (learning, predicting, ranking, generating or conversing)? Please list them. | A clear list by feature, in plain words, with what each one does. | 'It is all proprietary', 'we do not use AI' while the brochure says AI, or no list at all. |
| Which EU AI Act level do you give each feature (banned, high-risk, transparency or minimal), and why? Please answer in writing. | A written level per feature, with the reason, and who counts as the provider. | 'The Act does not apply to us', 'ask your lawyer', or any answer with no reasons. |
| What data does it use, where is it stored, and do you use our data to train models for others? | EU storage or a valid transfer tool, a signed data-processing agreement, and training on our data only if we opt in. | Training on our data by default, or no data-processing agreement. |

## 5b. Built in-house: AI the hotel built or changed (new)

**Why.** Hotels now build AI themselves: a chatbot on a general AI service under the hotel's name, a CV-sorting script, a pricing model. Then the hotel may be the **provider**, not only a user, and the provider carries the heavier duties. The earlier single flag ("we built one ourselves") became this step.

**What the user adds, per system:** name; what it is (Guest chatbot on a general-purpose AI model, under our hotel's name; Internal assistant for staff; Our own pricing or forecasting model; CV-screening script or automation; AI-generated marketing content workflow; Face or camera analytics; Something else); who built it (Our own staff built it; An agency or freelancer built it for us; A vendor's tool that we changed heavily); whether it carries the hotel's name or brand (Yes: guests or staff meet it under our hotel's name, logo or brand / No: it carries no brand of ours, or the agency's or vendor's name / Not sure); whether a vendor system was changed substantially or used for another purpose (No: we only use or configure it as delivered / Yes: we changed how it works substantially (rebuilt, retrained, added features beyond settings) / Yes: we use it for a different job than its maker intended (for example a general chatbot to rank CVs) / Not sure); the kind-specific questions of the matching tool type from section 5; who it is used on (Internal only: it decides nothing about people / Guests or the public talk to it or see what it makes / Used on staff or job candidates: assessing, ranking, monitoring or deciding / Not sure); and, for chat, staff-assistant, content and other systems, whether they trained or fine-tuned a model (No: we use a model through a service or API / Yes: we fine-tuned or retrained a model ourselves / Not sure). Unanswered counts as "not sure".

**Level.** Same four-level logic and same `levelOf`: the matching tool type's questions plus a "who it is used on" question. Used on staff or candidates counts as *possibly high-risk* until firmed up (Annex III 4(a), (b)). "Not sure" stays cautious. Own kinds map to: chatbot, CV screening, content, camera (CCTV), pricing (revenue management), other; "internal assistant for staff" has its own question (drafts / answers staff / assesses staff / not sure).

**Role (provider or user) logic, as implemented**

| Situation | Result | Basis | Status |
|---|---|---|---|
| Built in-house or by an agency, and carries the hotel's name or brand | Likely provider | Art. 3(3); putting into service includes supply for own use, Art. 3(11) | read from the text |
| Built in-house or by an agency, no brand or not sure | Possibly a provider (agency may be the provider if it supplies it under its own name) | Art. 3(3), 3(11), 3(4) | team's reading: whether an internal tool is "under its own name" is not settled |
| Vendor tool, purpose changed so it becomes high-risk | Likely provider of a high-risk system | Art. 25(1)(c) | read from the text (if the high-risk level is only provisional: "possibly") |
| Vendor high-risk tool with the hotel's name or trademark put on it | Likely provider | Art. 25(1)(a) | read from the text |
| Vendor high-risk tool changed substantially | Possibly a provider (applies if it was already high-risk and stays so) | Art. 25(1)(b) | read from the text; whether the vendor system was high-risk is for the user to check |
| Vendor non-high-risk tool with the hotel's brand, or changed heavily | Possibly a provider | Art. 3(3); Art. 25(1) covers high-risk only | team's reading |
| Vendor tool, not changed, no brand | Probably a user only | Art. 3(4) | read from the text |
| Not sure on brand or modification | Possibly a provider | cautious default | team's reading |

The hotel is a user as well wherever it uses the system, so user duties stay on top. Art. 25(2) and (4) (as amended): the initial provider and third-party suppliers cooperate, and a high-risk provider agrees in writing with suppliers of the models, tools and components built in. Art. 2(8): research, testing and development before putting into service is outside the Act, but real-world testing is not covered by that exclusion.

**Risk summary (Low / Watch / Serious: get legal advice), as implemented.** Serious: banned practice involved, or high-risk use where the hotel is or may be the provider. Watch: high-risk use as a user only; transparency level; not enough answers or open questions; used by guests or the public; used on staff or candidates. Low: minimal level, internal, no open questions. A prompt to act, not a verdict.

**Provider duties shown (only when the role is likely or possible).**

### Example A: branded guest chatbot on a general AI service

Role: **Likely provider**. Level: **Transparency**. Risk summary: **Watch**.

Provider duties (Art. 50(1), (2), (5); Applies since 2 Aug 2026.):

- Design it so people are told they are dealing with an AI, unless that is obvious.
- Give that notice clearly, at the latest at the first interaction.
- Art. 50(2) marking may also reach generated text. How it applies to chat answers is not settled in the Regulation text: read the Commission's Art. 50 guidelines (C/2026/6005) or ask an adviser (unverified).

### Example B: vendor chatbot repurposed to rank CVs

Role: **Likely provider**. Level: **High-risk**. Risk summary: **Serious: get legal advice**.

Provider duties (Art. 16; Arts. 8 to 15, 17, 18, 20; Art. 43(2); Arts. 47 to 49; Arts. 72, 73; Art. 63(1) and Art. 17 as amended; Art. 113 as amended; Provider duties for Annex III high-risk systems apply from 2 Dec 2027. A system already in service before then and not significantly changed in design may stay outside (our reading of Art. 111(2) as amended). An in-house build you keep changing is unlikely to.):

- Risk management for the whole life of the system.
- Data governance: suitable training, validation and test data.
- Technical documentation, drawn up before it goes into service and kept up to date.
- Automatic logging, and keeping the logs.
- Instructions for use for whoever deploys it.
- Design for human oversight, so people can watch it and overrule it.
- Accuracy, robustness and cybersecurity.
- A quality management system, in proportion to your size (simplified for small firms).
- Keep the documentation for 10 years.
- Conformity assessment before use. For employment and other Annex III points 2 to 8, internal control is enough and no outside body is needed. Biometrics (point 1) follow Art. 43(1).
- EU declaration of conformity and CE marking.
- Register it in the EU database before use.
- Put your name and contact details on it or its documents.
- Watch it after launch, report serious incidents, and fix, withdraw or recall it if it does not comply.
- Show the authorities, on a reasoned request, that it complies.

Reasons shown for B:

- You use a system for a purpose its maker did not intend, and that purpose is high-risk. You then count as the provider of the high-risk system. (Art. 25(1)(c))

**The AI model underneath (GPAI).** Shown for chat, staff-assistant, content and other systems:

- Uses a model through a service or API: You use a general-purpose AI model through a service or API. The rules for the model itself stay with the company that makes it. You built an AI system on top of it, and that is what this page assesses (recital 97 separates models from systems).
- Fine-tuned a model: You fine-tuned or retrained a model. Recital 109 says that when a model is modified or fine-tuned, a model provider's duties are limited to that modification. Whether your fine-tuning makes you a provider of a general-purpose AI model is not settled in the Regulation text we checked (recitals are not binding rules). Recital 97 adds that model obligations should not apply to an own model used for purely internal processes that are not essential for a service to third parties and do not affect people's rights. Get legal advice before relying on either.
- No compute or size threshold is stated, because none was found in the Regulation text on the box. **Unverified:** whether and when fine-tuning makes the hotel a model provider.

**Practical risks, labelled "not the AI Act"** (always: data leaks through prompts, security, key-person risk; plus by kind and use: wrong answers and liability, bias in hiring and staff decisions, biometric data, personalised prices, copyright):

- **Data leaks through prompts (GDPR):** Guest, staff or payment data sent to a model may leave your control. Check the model provider's data terms, sign a data-processing agreement, and keep passport, ID and payment data out of prompts.
- **Security:** Keep API keys secret and limit what the system can read or do. A chatbot connected to your booking system can be tricked into showing or changing things.
- **Bias in hiring and staff decisions:** Anti-discrimination law applies whatever the AI Act says. Test results for different groups, keep a person as the decision maker, and ask your DPO about automated decisions and an impact assessment.
- **Key person risk:** If the one person who built it leaves, nobody may know how it works. The build record (template 4) fixes that.

**Next steps.** Each system adds plan tasks (id prefix `own-<id>-`): build record (2 weeks); answer open questions; legal advice where a provider role is possible; for a high-risk provider: decide keep / replace / limit (1 month), provider duties and the written supplier agreement (from 2 Dec 2027, Art. 16, Art. 25(4)); for a transparency system: Art. 50(1) notice or Art. 50(2) marking and Art. 50(4) labelling (since 2 Aug 2026); guest test and human route; data-flow and processor agreement; bias test for people-related use. Dated items feed "Come back when": 2 Dec 2027 for in-house high-risk provider duties, 2 Dec 2026 for marking of generated content. The staff-representative task is triggered for people-related systems.

**Save code and storage.** New field `i` (list of systems); answers live under keys `own:<id>` in the existing answers field. Version stays `v:1`. An old code with `b:true` and no `i` becomes one blank in-house system. The owner summary gets a "BUILT IN-HOUSE" block and decisions.

**Template 4 (internal AI build record / one-page system description).**

```
INTERNAL AI BUILD RECORD: EXAMPLE HOTEL WIEN (EXAMPLE)
One page per AI system we built, had built or changed heavily. Review every 6 months and after any big change. This is a working record. It is not the technical documentation the Act requires from providers of high-risk systems, though it is a good start for it.

1. System
Name: [name of the system]
Type: [type of system]
What it does, in one sentence: [ ]
Owner (named person): [name]    In use since: [date]
Built by: [who built it]
Version and last big change: [date, what, who]

2. How it works
Model or service it is built on: [name, version]
Where it runs and who hosts it: [ ]
Did we train or fine-tune a model ourselves? [did we fine-tune a model?]
Instructions and settings we gave it, and where they are kept: [ ]

3. Data
Data it receives: [guest data? staff data? CVs? payment or ID data?]
Personal data in prompts: [yes/no, which]
Where the model provider stores it: [ ]    Data-processing agreement: [yes/no, date]

4. People
Who uses it: [ ]
Who is affected by it: [who it is used on]
Who checks its output before it reaches a person: [name]
How people are told they deal with an AI: [wording and where]

5. Our assessment (draft, not legal advice)
Level and role: [level; hotel role; risk summary from step 2b]
Does it carry our name or brand? [yes/no]    Did we change a vendor system substantially or its purpose? [yes/no]
Legal advice taken: [yes/no, date, from whom]

6. Tests and limits
Tested on: [date, with what]
Known limits and wrong answers seen: [ ]
Bias or quality checks: [ ]

7. Logs and incidents
Logs kept: [what, how long, who can see them]
Incident contact: [name]    Last incident: [none / date]

8. Change log
[date] [change] [who] [Did the purpose or the system change a lot? If yes, re-check in step 2b]
```

## 6. Duties by level (hotel versus vendor)

### Banned

*When:* Banned practices apply since 2 Feb 2025.

**Your hotel does**
- Stop using that feature. Ask the vendor to switch it off, and keep their answer in writing.
- Check that no other tool you use has the same feature.
- Brief staff so nobody switches it back on.

**The vendor must**
- May not offer this use in the EU. Ask them to confirm in writing that it is off for you.

*Basis:* Art. 5; Art. 4

### Possibly banned (provisional)

*When:* Banned practices apply since 2 Feb 2025.

**Your hotel does**
- Find out first: ask the vendor in writing whether the tool has this feature. If it does, switch it off.
- Check that no other tool you use has the same feature.
- Brief staff so nobody switches it back on.

**The vendor must**
- May not offer this use in the EU. Ask them to confirm in writing that it is off for you.

*Basis:* Art. 5; Art. 4

### High-risk

*When:* Your duties apply from 2 Dec 2027. A tool already on the market and not significantly changed may stay outside them. That is our reading of Art. 111(2) as amended, so ask the vendor.

**Your hotel does**
- Use it the way the vendor's instructions say.
- Name a trained person who oversees it and can overrule it.
- If you control the data fed into it, make sure it is relevant for its purpose.
- Keep the logs you control for at least 6 months.
- Tell staff representatives and affected staff before you switch it on.
- Tell the people it is used on (candidates, staff or guests), and explain a decision about them if they ask.
- Stop and tell the vendor and the authority if it may put people's health, safety or rights at risk.

**The vendor must**
- Run the high-risk procedure: risk management, documentation, CE marking and registration.
- Give you instructions for use, including what human oversight is expected.
- Build in automatic logging.

*Basis:* Art. 26(1), (2), (4), (5), (6), (7), (11); Art. 50(3); Art. 86; Art. 111(2)

### High-risk with emotion recognition of guests (adds the inform-people duty)

*When:* Your duties apply from 2 Dec 2027. A tool already on the market and not significantly changed may stay outside them. That is our reading of Art. 111(2) as amended, so ask the vendor.

**Your hotel does**
- Use it the way the vendor's instructions say.
- Name a trained person who oversees it and can overrule it.
- If you control the data fed into it, make sure it is relevant for its purpose.
- Keep the logs you control for at least 6 months.
- Tell staff representatives and affected staff before you switch it on.
- Tell the people it is used on (candidates, staff or guests), and explain a decision about them if they ask.
- Stop and tell the vendor and the authority if it may put people's health, safety or rights at risk.
- Tell the people exposed that the system reads emotions or sorts them by a biometric trait.

**The vendor must**
- Run the high-risk procedure: risk management, documentation, CE marking and registration.
- Give you instructions for use, including what human oversight is expected.
- Build in automatic logging.

*Basis:* Art. 26(1), (2), (4), (5), (6), (7), (11); Art. 50(3); Art. 86; Art. 111(2)

### Transparency: chatbot or voice

*When:* Applies since 2 Aug 2026.

**Your hotel does**
- Check that it tells guests it is an AI at the latest at their first message or call.
- Keep a way to reach a person.
- Brief the staff who take over from it.

**The vendor must**
- Build it so people are told they are talking to an AI, unless that is obvious.

*Basis:* Art. 50(1), (5); Art. 4

### Transparency: realistic images, video, audio

*When:* Applies since 2 Aug 2026.

**Your hotel does**
- If AI-made images, video or audio could pass for real people, places or events, say they are AI-made.
- Keep a note of which content is AI-made.

**The vendor must**
- Mark generated content in a machine-readable way. Tools already on the market before 2 Aug 2026 have until 2 Dec 2026.

*Basis:* Art. 50(2), (4); Art. 111(4)

### Transparency: AI-written public-interest text

*When:* Applies since 2 Aug 2026.

**Your hotel does**
- If AI-written text is published to inform the public on a matter of public interest, say it is AI-made, unless a person reviewed it and carries editorial responsibility.

**The vendor must**
- Mark generated content in a machine-readable way.

*Basis:* Art. 50(2), (4)

### Minimal

*When:* AI literacy applies now.

**Your hotel does**
- Brief the people who use it on what it does and where it can go wrong, and keep a note.
- Send the vendor one email with the questions below.

**The vendor must**
- No specific AI Act duty for this use.

*Basis:* Art. 4 as amended

### Not sure yet

*When:* Find out first.

**Your hotel does**
- Find out what it does before you decide: send the vendor the questions below.

**The vendor must**
- Answer what the tool does, in writing.

*Basis:* none

## 7. The plan: how tasks, owners and dates are produced

Tasks are generated from the profile and answers. Each task has: text, department, owner, kind (**legal** or **suggested**), a legal date or a suggested timing (never both), a basis footnote and a priority for ordering. Owners come from the department (Management → GM; Front office → Front office manager; Revenue → Revenue manager; F&B → F&B manager; Housekeeping → Executive housekeeper; HR → HR lead; Security & IT → IT lead; Marketing → Marketing manager); for hotels under 50 rooms every owner becomes "GM, or whoever covers it".

**Always (every hotel)**
- Brief people who use AI tools and keep a note: **legal**, already applies (Art. 4 as amended; no certificate or set level needed).
- Write down every AI tool in use, including ones staff use on their own: suggested, within 2 weeks.
- Share the one-page staff AI policy: suggested, within 1 month.
- Run any new AI tool through this checker before buying: suggested, at every purchase.

**Per picked tool**
- *Send the supplier questions* (or "Before you sign: …" if not bought yet): suggested, within 2 weeks or before signing. Ticks itself once the vendor status is anything but "not asked yet".
- Red-flag answer → *follow up* in writing or plan a replacement: suggested, within 1 week.
- **Banned / possibly banned:** switch off the feature (or find out first) and get written confirmation: **legal**, banned since 2 Feb 2025.
- **High-risk:** ask the vendor (high-risk? legacy? CE-marked and registered by 2 Dec 2027?) — suggested, now; name a trained overseer who can overrule — legal, from 2 Dec 2027 (Art. 26(2)); tell staff representatives, affected staff and the people it is used on — legal, from 2 Dec 2027 (Art. 26(7), (11)); keep controlled logs for at least 6 months — legal, from 2 Dec 2027 (Art. 26(6)); check data-protection rules with the DPO — suggested, before first use (GDPR, outside the AI Act).
- **Transparency, chat or voice:** check the tool tells guests it is an AI at first message or call — legal, since 2 Aug 2026 (Art. 50(1) is the vendor's duty, checking is the hotel's); put the notice on site — suggested, within 2 weeks.
- **Transparency, media:** label realistic AI images, video, audio — legal, since 2 Aug 2026 (Art. 50(4)); ask how the vendor marks output — suggested, before 2 Dec 2026 (vendor duty, Art. 50(2); older tools by 2 Dec 2026).
- **Transparency, public-interest text:** label unless a person reviewed and is editorially responsible — legal, since 2 Aug 2026 (Art. 50(4)).
- **High-risk with emotion recognition of guests:** tell people exposed — legal, since 2 Aug 2026 (Art. 50(3)).
- **Not sure yet:** find out what it does using the supplier questions: suggested, now.

**Cross-cutting**
- Any picked tool that affects staff (and has an answer): *involve staff representatives before switching on* — **legal** under national labour law, "not the AI Act", using the country note (DE works council, FR CSE, ES works council information right, SE union negotiation, CH ArGV 3 art. 26, GB ICO guidance; generic text elsewhere).
- Built in-house systems (section 5b) add their own tasks, prefixed by system, under the same legal / suggested split.
**Display:** progress = done / total (supplier tasks auto-count); the plan counter on the nav shows open tasks; the table has separate "Legal date" and "Suggested by" columns, with "None, not a legal date" or "None" in the other.

## 8. Templates (full text)

Shown here with the example hotel "Example Hotel Wien (example)". In the tool the hotel name and the picked tools are filled in live. Replace everything in [brackets]; have a lawyer or the DPO check before wide use.

### 8.1 Guest chatbot AI notice

```text
AI NOTICE FOR EXAMPLE HOTEL WIEN (EXAMPLE): GUEST CHATBOT
(Place it in the chat window and on the page that hosts the chatbot.)

1. First message from the assistant
"Hello, I'm the AI assistant of Example Hotel Wien (example). I'm not a person, and I can make mistakes. I can help with rooms, rates, the restaurant and directions. To speak to our team at any time, call [phone] or write to [email]."

2. Line under the chat window
"This assistant uses artificial intelligence. Please check important details such as prices, dates and allergies with our team. Please do not share passport or payment details in the chat."

3. If you also have a voice assistant, open the call with
"Hello, this is the automated AI assistant of Example Hotel Wien (example). For a person, say 'team member'."

Check before you publish: the notice appears at the first message or call, not only in the terms and conditions.
```

### 8.2 One-page staff AI policy

```text
AI POLICY FOR STAFF: EXAMPLE HOTEL WIEN (EXAMPLE)
Owner: [GM name]    Valid from: [date]    Next review: [date, in 6 months]

1. Why
We use AI to save time and serve guests better. We stay in charge: AI helps, people decide.

2. The AI tools we use
- Guest chatbot or messaging assistant
- Revenue management or dynamic pricing
- CV screening or candidate ranking
Only use other AI tools for work after asking [name].

3. Rules
- A person checks AI output before it reaches a guest or is published.
- Never put guests' passport or ID data, payment data, or staff health or personal data into a public AI tool.
- AI never makes the final decision on hiring, discipline, pay, hours or leave. A named manager decides.
- We do not use AI to read the emotions of staff, applicants or guests from their face or voice.
- If a chat or voice assistant talks to guests, it says it is an AI and offers a way to reach a person.
- AI-made images or video that could pass for real are labelled as AI-made.

4. Hiring and scheduling
If AI helps with hiring or rotas, we tell candidates and staff, and staff representatives where they exist, and a person reviews every decision.

5. Problems
If an AI tool gives a wrong, biased or worrying result, tell [name] the same day.

Signed: [GM]    Read by staff: [list or attach sign-off sheet]
```

### 8.3 AI literacy training checklist

```text
AI LITERACY BRIEFING CHECKLIST: EXAMPLE HOTEL WIEN (EXAMPLE)
(About 15 minutes. No certificate is required. A short note of who attended is enough.)

[ ] Which AI tools we use and what each one does: Guest chatbot or messaging assistant; Revenue management or dynamic pricing; CV screening or candidate ranking
[ ] What AI gets wrong: made-up facts, bias, out-of-date answers
[ ] What never goes into a public AI tool: guest ID and payment data, staff personal data
[ ] Who checks AI output before guests see it
[ ] AI never decides alone on hiring, discipline, pay, hours or leave
[ ] How we tell guests they are talking to an AI
[ ] Who to tell when something goes wrong: [name]
[ ] Date: [date]   Trainer: [name]   Attendees: [names]
[ ] Repeat for new staff, and when we add or change a tool
```

### 8.4 Supplier question email (example: CV screening)

```text
To: [vendor contact]
Subject: Questions about AI in [product name]

Dear [vendor contact],

We use [product name] (cv screening or candidate ranking) at Example Hotel Wien (example). We are checking the AI tools we use under the EU AI Act. Please answer in writing:

1. Does it score, rank or filter applicants? On which criteria? Can we see and change them, and turn ranking off?
2. Is it high-risk under the Act's employment category? Will it be CE-marked and registered by 2 December 2027, or is it a legacy product? Will you tell us before an update changes that?
3. What instructions for use and human-oversight guidance do you give us? Can a reviewer see why a result came out and overrule it?
4. Which logs are kept, for how long, and can we export them? We need at least six months where the logs are under our control.

Please reply by [date, suggested: 14 days from today]. If a question does not apply, please say so and why.

Kind regards,
[Name, role]
Example Hotel Wien (example)
```

The email is generated per tool from that tool's vendor questions. For chains it is addressed to the vendor "or our head office or brand IT, if they manage this tool".

## 9. Return and engagement mechanisms

The prototype has no backend and no accounts. Everything stays in the browser.

- **Autosave:** progress is saved in the browser's localStorage after every change (key `hotelAiActTool.v1`) and restored on the next visit, with a "Welcome back" banner and a continue button.
- **Save code:** a copyable JSON text (profile, picked tools, answers, vendor statuses and dates, notes, ticked tasks) that can be pasted back to restore everything on another browser or device. A bad code gives a friendly error.
- **Come back when:** a dated list of upcoming legal dates that matter for the picked tools (2 Dec 2026 marking and new bans if media tools; 2 Dec 2027 if any high-risk tool), vendor answers due 14 days after the "asked" date (suggested), and a prompt to add the date if missing; plus triggers for re-checking (new tool, vendor update that adds ranking, scoring, identifying or talking features; a review every 6 months, suggested).
- **Status per tool:** not asked yet, asked the vendor, answered: looks fine, answered: red flag.
- **Before-you-buy mode:** the "not bought yet" toggle changes the task to "Before you sign…", and the result tells the GM to get the answers in writing and put key ones into the contract.
- **Owner summary:** a copyable one-page text: tools and levels, vendor status, progress, open legal items, next dates and decisions needed from the owner.
- **Progress bar and per-department plan** with ticking.
- **Not possible without a backend:** reminders by email, shared team tasks, benchmarks (see phase 2).

## 10. The honest box

**The honest picture.** Most hotel AI is minimal-risk. The real weight sits in hiring and staff management, in anything that identifies people by face or reads emotions, and in telling guests when they talk to an AI.

### Who enforces
Each EU country names its own authorities and sets its own penalty rules. Anyone can complain to the national authority (Art. 85). Set-ups are still moving: France's split between regulators is not yet law, and Sweden's mandate is interim to 31 Dec 2026 (team research, 10 Nov 2026). The tool shows the authority for the chosen country where researched (table in section 4).

### What is at stake (penalty tiers, Art. 99, as in Reg. (EU) 2024/1689 and the amending Reg. (EU) 2026/1744)

| What | Maximum fine |
|---|---|
| Banned practices | Up to EUR 35 million or 7% of worldwide annual turnover, whichever is higher |
| Most other duties, including a deployer's high-risk duties and the transparency duties | Up to EUR 15 million or 3% of worldwide annual turnover, whichever is higher |
| Wrong, incomplete or misleading information given to authorities | Up to EUR 7.5 million or 1% of worldwide annual turnover, whichever is higher |

- For SMEs the **lower** of the two amounts applies (Art. 99(6)). Small mid-caps get the same rule for the second and third rows (Art. 99(6a)).
- These are ceilings. Authorities weigh gravity, duration, harm and size (Art. 99(7)).
- The AI literacy duty (Art. 4) is not in the list of fined provisions in Art. 99(4), but countries set their own penalty rules (Art. 99(1)), so check yours.

### Where data protection bites (a pointer, not a GDPR tool)
- **Hiring:** decisions made solely by automated means with a significant effect are restricted, and a data-protection impact assessment is usually wise.
- **CCTV and face recognition:** face data is special-category data. It almost always needs explicit consent, and guests need an alternative.
- **Staff monitoring:** speak to your data-protection officer before switching it on.
- Basis: GDPR Art. 22, Art. 9, Art. 35. Outside the AI Act. Ask your DPO or adviser.

### Reach: do not overstate
A stand-alone hotel in Switzerland, the UK or another non-EU country is probably not covered by the EU AI Act for on-site use (our reading). It can be covered where its AI output is used in the EU, for example a chatbot answering EU guests or AI-made ads aimed at EU markets (Art. 2(1)(c)). The tool therefore labels the duties "for reference". Switzerland has no AI act; a Federal Council consultation on a draft is planned for spring 2027 (date estimated). Data-protection law still applies: revFADP in Switzerland, UK GDPR in the UK, EU GDPR where it reaches the hotel.

### Dates (as of 19 Nov 2026)

| Date | What happens |
|---|---|
| 2 Feb 2025 | Bans apply, including emotion recognition of staff |
| 27 Jul 2026 | Amending Reg. (EU) 2026/1744 in force. AI literacy rule (Art. 4) rewritten |
| 2 Aug 2026 | Transparency rules (Art. 50) apply |
| 12 Nov 2026 | Commission publishes final Art. 50 guidelines, C/2026/6005 |
| 2 Dec 2026 | Two new bans (Art. 5(1)(ba), (bb)). Marking deadline for older generative tools (Art. 111(4)) |
| 2 Dec 2027 | High-risk duties for the Annex III list, including a hotel's own duties |
| 2 Aug 2028 | High-risk duties for AI in regulated products (Annex I). Rarely relevant to hotels |

Sources: AI Act, Reg. (EU) 2024/1689 (https://eur-lex.europa.eu/eli/reg/2024/1689/oj); Reg. (EU) 2026/1744 (https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng); Commission guidelines on Art. 50, C/2026/6005, 12 Nov 2026 (https://publications.europa.eu/resource/cellar/caabe0cd-de39-11f1-ba80-01aa75ed71a1.0006.01/DOC_1); draft high-risk classification guidelines, 19 May 2026 (https://digital-strategy.ec.europa.eu/en/library/draft-commission-guidelines-classification-high-risk-ai-systems); team research for the HFTP Hotel AI Register, national notes dated 10 Nov 2026.

## 11. Accuracy labels: verified, team's reading, unverified

**Checked against the Regulation text held on the box** (the 2024/1689 text and the amending 2026/1744 text; not re-checked on live EUR-Lex):
- Art. 99(3), (4), (5), (6), (6a), (7) fine tiers and the SME rule; Art. 99(4) lists Art. 26 and Art. 50 but not Art. 4.
- Art. 50(1) to (5) wording (providers' duty to inform and mark; deployers' duty for emotion recognition, deep fakes and public-interest text; timing "at the latest at the time of the first interaction or exposure").
- Annex III 4(a) wording, including "to place targeted job advertisements".
- Art. 5(1)(f) wording (workplace and education, narrow medical or safety exception); Art. 26(7).
- Art. 4 as replaced (no specific level of AI literacy required); Art. 111(2) as amended; Art. 111(4); Art. 113 dates (2 Dec 2026, 2 Dec 2027, 2 Aug 2028).
- Country notes for DE, FR, ES, SE, CH, GB and the dates of the Art. 50 guidelines and the draft high-risk guidelines come from the team's earlier verified research (national notes dated 10 Nov 2026; FR, ES, SE and CH notes are marked "team's reading" in that research).

**Labelled "team's reading" in the tool**
- **Legacy tools (Art. 111(2) as amended):** a high-risk tool already on the market before 2 Dec 2027 may stay outside the duties until significantly changed. The amended text says the Regulation applies to operators of such systems "only if … subject to significant changes in their designs", but how that applies to a hotel as user is our reading. Ask the vendor.
- **Rota tools:** the split between minimal (fills shifts from availability) and high-risk (ranks staff, decides hours or leave) follows the Commission's **draft** guidance of 19 May 2026, not final. The law text covers task allocation "based on individual behaviour or personal traits" (Annex III 4(b)).
- **Face identification from camera feeds** (1:n): high-risk on the team's reading of draft guidance (Annex III 1(a)). 1:1 matching to the person's own ID is treated as verification, outside the high-risk category, but GDPR still applies strictly.
- **Emotion reading of job applicants as banned:** our reading that recruitment counts as "the workplace".
- **Staff performance, team-level only = minimal:** our reading.
- **Mood from the written text of reviews is not emotion recognition:** our reading.
- **Chatbot that only drafts replies a person sends = minimal:** our reading.
- **Sustainability or corporate reports:** whether a hotel's text counts as public-interest text is for the hotel to check against the Commission's Art. 50 guidelines (C/2026/6005). Provisional.
- **Built in-house (section 5b):** the Art. 25(1)(a) and (c) routes for high-risk systems are read from the text. Everything else in the role logic (own use as putting into service "under its own name"; white label of a non-high-risk vendor system; heavy modification of a non-high-risk system; the agency case) is the team's reading. The tool says "possibly a provider" rather than decide. Get legal advice.
- **Swiss and UK reach** (Art. 2(1)(c)): "probably not covered for on-site use".
- **Possibly banned for guest scoring / social scoring** (Art. 5(1)(c), Annex III 5(b)): provisional; get advice.

**Unverified or drafted by the team, not from a source**
- **In-house section (5b), checked against the box text:** Art. 3(3), 3(4), 3(11) definitions; Art. 25(1)(a) to (c), (2), (4) as amended; Art. 16, 18, 20, 43(2), 47 to 49, 72, 73; Arts. 8 to 15; Art. 17 and 63(1) as amended; Art. 2(8); Art. 6(3), (4); Annex III 4(a), (b); Recitals 97 and 109 (recitals are not binding rules).
- **In-house section, unverified:** whether fine-tuning a model makes the hotel a model provider (no threshold stated); how Art. 50(2) marking applies to chat answers (the tool tells the user to check the Commission's Art. 50 guidelines C/2026/6005, which were not read for this); Art. 111(2) legacy treatment of an in-house system (team's reading); the scenario table's team's-reading rows.
- The **vendor questions and the "fine answer" / "red flag" descriptions** are our own drafts of good practice, not legal requirements.
- **Template wording** (chatbot notice, staff policy, literacy checklist, supplier email) and **all "suggested" dates** (2 weeks, 14 days, 1 month, 6 months) are suggestions.
- **GDPR pointers** (Art. 22, 9, 35) are general knowledge, outside the AI Act and not re-checked here; ask a DPO.
- Art. 85 (right to complain) and Art. 70 (national authorities) come from the team's national notes, not re-read for this tool.
- Art. 5(1)(b), (c), (e), Annex III 1(a), 1(c), 5(b) and Art. 3(60) are taken from the team's register research, not re-read for this tool.
- **Country notes** exist only for DE, FR, ES, SE, CH and GB. Other countries show "check yours". The OFCOM date for the Swiss non-binding code is left out because it could not be confirmed.
- **Never tested with real hotel managers.** The levels are a first indication from the team's research, not a verdict; a tool's real level depends on what the feature does, so the tool always says "ask the vendor".
- No claim is made that any named vendor's product is or is not in any level. Tool types are generic.

## 12. What carries over from the register, and what is dropped

**Carries over**
- The use-case catalogue (91 entries) as the knowledge base behind the 12 tool types.
- The classification logic, with the fixes from both reviews (open ban questions first; "not AI" cannot override a prohibited answer; "not sure" adds a to-do).
- The duties and dates (hotel duties, AI literacy, chatbot, notices) and the legacy-tool caveat.
- Vendor questions, national notes and the watch list (watch list not yet in the new tool).
- The saved record, now as save code, localStorage and the owner summary (PDF and CSV export are not in the HTML tool yet).
- Corrected wording: Art. 4 as amended, Swiss and UK reach, C/2026/6005.

**Dropped or demoted**
- Legal labels as the main output: now a one-line reason with a footnote.
- Long question lists: two to four vendor questions per tool, shown step by step.
- Article-heavy text: article numbers are footnotes only.
- Research notes in user-facing text; wording that sounds like proof of compliance ("All checked").
- The fictional hotel as main content: it is now a "Load an example hotel" button.

## 13. Phase 2 ideas (for HFTP; none of it exists yet)

- **Supplier scorecard and shared vendor database:** vendors answer one standard questionnaire; members see the results. Needs vendor consent and a clear data rule.
- **Anonymised AI map:** which tools hotels use, with no hotel names.
- **Benchmarks against similar hotels:** needs enough users and a privacy notice first.
- **Owner report** as a shared, printable page.
- **Relevant-only regulatory updates:** "new chatbot guidance; it affects 2 of your 5 tools".
- **Free and member tiers:** for example the first screens free; plan, templates and report for members.
These need accounts and a backend, which the prototype deliberately does not have.

## 14. Open decisions for Ludo

1. **Main user:** independent GM first (suggested), or group lead with many hotels (out of scope for now)?
2. **Free or HFTP member tier?** For example screens 1 to 3 free, plan, templates and owner summary for members. Ask HFTP.
3. **Build new or rework the register?** The HTML prototype is a new front end on the existing knowledge; decide before the Claude Code prompt whether the register's code is reworked or this replaces it.
4. **Which templates first?** Chatbot notice and supplier email need the least legal review and give the most value (suggested).
5. **Lawyer review:** who signs off the "team's reading" items and the template wording before any external use, and the use of HFTP's name.

## 15. Files and how the prototype was tested

- `hotel-ai-act-tool.html`: single self-contained file, no external scripts, fonts or requests; system fonts; works offline; light and dark mode follow the system.
- `hotel-ai-act-concept.md`: this document (generated from the same data as the tool, so the questions, levels and templates match).
- Screenshots: `screenshot-desktop-*.png`, `screenshot-mobile-*.png` (390 px wide).
- Automated test (headless Chrome, `test.js`): load, load example hotel, every step, change a tool answer and watch the level update, tick a plan item, copy a template, save code and localStorage restore, bad-code error, a Swiss chain hotel with banned and before-you-buy cases, the in-house section (add a system, role and risk change with the answers, "not sure" stays cautious, Art. 25(1)(c) route, plan, reminders, owner summary, template, save code and localStorage restore, old-code migration), mobile overflow, no console errors and no external requests.
