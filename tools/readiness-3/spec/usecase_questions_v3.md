# Do you need AI? v3.0 — use-case questions (readable copy)

Generated from `usecase_questions_v3.json` (2026-11-25). The JSON is the single source of truth; this file is for reading.

Fixed disclaimer (landing and result): "This check does not cover legal requirements. Check those with your adviser before you start."

Sensitive-area flag: "This area involves people's personal data or jobs and has extra rules. Ask an adviser before a pilot."

## Counts

- Use cases: 99
- Original v2.6.1 questions: 661 (all accounted for: 661)
- Actions on the originals: keep 395, fix 105, rewrite 28, split 44, merge 65, remove 24; new questions added: 56
- v3 use-case questions (including split parts and gate-added): 794 (gate-added 122)
- Weights: blocker 350, important 322, nice to have 122
- Sensitive: always 10, depending on a gate answer 13

## Scoring rules

- Weights {'B': 3, 'I': 2, 'N': 1}; answer factors {'yes': 1, 'planned': 0.5, 'no': 0, 'dk': 0}; Doesn't apply excluded.
- Score: floor(100 * sum(weight*factor) / sum(weight)) over visible, applicable (not Doesn't apply) scored questions
- 1 Soft stop: s1 or s2 answered No -> short result with alternatives; 'Continue anyway' resumes and caps the final verdict at Almost ready.
- 2 Not enough info: Don't know yet on more than 50% of visible applicable scored questions.
- 3 Not ready: any blocker answered No, OR score < 50, OR fewer than half of visible applicable blockers answered Yes.
- 4 Ready: every visible blocker Yes or Doesn't apply, score >= 75, Don't know yet < 25%, s3-s5 all Yes, a listed use case chosen, every asked gate answered (not Don't know yet), no sensitive flag, no cap.
- 5 Almost ready: everything else.

## Step 2 (five questions; not scored)

- **s1 Needs judgement**: Does each case need judgement that fixed "if this, then that" rules can't handle? (No → soft stop)
- **s2 Worth it**: Does this task happen often, or cost real staff hours or money? (No → soft stop)
- **s3 Has what it needs**: Does the tool have what it needs to work from: past examples or current facts (rates, menus, policies)? (No → hold)
- **s4 Safety net**: If the AI gets one wrong, will a person catch it, or is the harm small? (No → hold)
- **s5 Proof**: Do you know which number should improve, and what it is today? (No → hold)

## Must-haves (all blockers)

- **m1 A named owner with time**: Is one named person in charge of the tool, with time set aside for it?
- **m2 Budget for the first year**: Is money approved for the full first year, including set-up and staff time? — also offers Doesn't apply (Choose Doesn't apply if the tool is free or already paid for, so no new budget is needed.) Contradicted by G_PAID=no.
- **m3 A number to improve, approved**: Has the person who decides on spending approved the number this tool should improve?
- **m4 Systems that can connect**: Can other software read data from, and send data back to, the systems you want to connect it to? — also offers Doesn't apply (Choose Doesn't apply if it is a ready-made tool that needs no connection to your hotel systems.) Contradicted by G_LINK=yes.
- **m5 Personal data known**: Do you know which guest or staff personal data the tool would use?
- **m6 A person who checks the AI**: Is a person named to check the tool's results regularly?
- **m7 Data you can keep correct**: Is the data the tool uses held in one system that someone keeps correct?
- **m8 Staff told, and able to report errors**: Do staff know the tool is coming, and whom to tell when it gets something wrong?
- **m9 Rules on what not to type**: Are there written rules on what staff must never type into AI tools?
- **m10 A way to work when it is down**: Can the work carry on if the tool stops working for a day?
- **m11 Staff shown how it works**: Have the staff who use or check the tool been shown what it does and when not to trust it?

## Gate library

- **G_ACT**: When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **G_GUEST**: Who sees the tool's answers first?
  - Our staff → no change
  - Guests, directly → adds GUEST_FACTS, GUEST_STAFF
  - Don't know yet → caps at Almost ready; action: Decide whether guests will see the tool's answers directly.
- **G_PEOPLE**: Does the tool score, rank or choose between individual people?
  - Yes → adds PEOPLE_DECIDE, PEOPLE_EXPLAIN; raises sensitive flag
  - No → no change
  - Don't know yet → raises sensitive flag; caps at Almost ready; action: Ask the vendor whether the tool scores or ranks individual people.
- **G_LINK**: Does the tool need to connect to your hotel systems, such as booking, till or accounting?
  - Yes → a Doesn't apply answer on m4 becomes Don't know yet, with a note
  - No, it works on its own → hides Technology questions
  - Don't know yet → caps at Almost ready; action: Ask the vendor which hotel systems the tool must connect to.
- **G_PAID**: Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

Gate-added questions:

- **ACT_LIMITS** [B] Are the tool's limits written down, such as the biggest change it may make alone? — why: A tool that acts alone needs clear limits before it starts.
- **ACT_OFF** [B] Can one named person switch the tool off at any time? — why: When it goes wrong, someone must be able to stop it at once.
- **GUEST_FACTS** [B] Has a person checked the facts the tool gives guests, such as prices and opening times? — why: Guests act on what the tool tells them.
- **GUEST_STAFF** [B] Can guests reach a staff member at any time while using the tool? — why: Guests with problems must never be stuck with a machine.
- **PEOPLE_DECIDE** [B] Does a person make every final decision about a person? — why: Decisions about people must stay with people.
- **PEOPLE_EXPLAIN** [I] Can a person explain why the tool scored or ranked someone? — why: People accept decisions they can understand and question.

# Revenue Management

## rm-1 — Demand forecasting for rooms (by day, guest type and room type)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the revenue manager agreed to review the forecasts every week? | Forecasts drift with events and market changes; without a weekly review, errors go unnoticed. | always |
| sk1 | I | Skills | Department head | Can the revenue team spot a forecast that looks wrong and correct it? | The tool cannot know about a local event or a lost group; a person must correct it. | always |
| fi1 | N | Money | Finance | Do you know the monthly fee, often charged per room, and any set-up fee? | Revenue tools are usually priced per room, so the cost grows with hotel size. | always |
| te1 | B | Technology | IT | Does the tool receive new bookings and cancellations automatically from your booking system (PMS)? | A forecast built on bookings typed in by hand is always out of date. | always |
| da1 | B | Data | Department head | Do you have at least one year of booking and cancellation history in your booking system? | A demand forecast learns from last year's pattern; with less history it guesses. | always |
| or1 | I | Rules and controls | General manager | Is it written who may change a forecast by hand, and must they note why? | Unrecorded manual changes make it impossible to learn whether the tool or the person was wrong. | always |
| n1 | I | Data | Department head | Are big local events and group bookings for the next year entered in your systems? | Events drive demand spikes the history cannot show. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | fix | Is it agreed that the revenue manager owns the tool and reviews forecasts, and the general manager (GM) signs off strategy? | pe1 | Two ideas split: owner is must-have 1; weekly review kept; GM sign-off moved to or1. |
| sk1 | fix | Can the people involved read how accurate forecasts are, spot wrong input data and change a forecast by hand, giving a reason? | sk1 | Three skills cut to one practical skill. |
| fi1 | keep | Do you know what the revenue management system (RMS) subscription (often charged per room) and set-up fee will cost your hotel? | fi1 | Acronym removed; budget approval itself is must-have 2. |
| te1 | fix | Do you have a revenue management system (RMS) and a two-way link to your property management system (PMS) or central reservation system (CRS), or has your provider confirmed this is possible? | te1 | "Two-way link" narrowed to what forecasting needs: bookings in. |
| da1 | keep | Is at least one year of clean booking, pickup (new bookings over time) and cancellation history, by guest type, digital, up to date and ready to use? | da1 | "Digital, up to date and ready" four-part phrase removed. |
| or1 | fix | Are there written rules for when staff may change the tool's forecasts by hand? | or1 | Clarified; reason note made explicit. |

## rm-2 — Dynamic room pricing, including automatic rate publishing

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **when rm2-personal=yes**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **rm2-personal** (custom): Can prices differ for individual guests, based on their own data or booking history?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether prices can differ per individual guest.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe2 | B | People | General manager | Have the owner or general manager set the lowest and highest price the tool may publish? | Automatic pricing without limits can publish a rate far too low or too high in minutes. | always |
| sk1 | I | Skills | Department head | Can the revenue manager tell when to switch automatic pricing off, for example during a crisis? | In unusual weeks the tool's logic breaks; a person must judge when to take over. | always |
| fi1 | N | Money | Finance | Do you know the pricing-tool fee and any extra channel-manager fees? | Publishing rates to booking sites often adds a second fee. | always |
| te1 | B | Technology | IT | Can the pricing tool send new rates to your booking system and channel manager straight away? | Automatic pricing only works if new rates reach every sales channel at once. | always |
| da1a | I | Data | Department head | Are your rate plans and booking restrictions set up the same way in every system? | Messy rate plans make the tool push the wrong price to the wrong room. | always |
| da1b | I | Data | Department head | Does the tool receive competitor rates every day? | Pricing without competitor rates ignores the market. | always |
| or1 | B | Rules and controls | General manager | In a managed or franchised hotel, has the owner agreed in writing to automatic pricing? | Owners often hold the right to approve pricing strategy. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the revenue manager be in charge of this tool? | m1 | Owner is must-have 1. |
| pe2 | fix | Is it agreed that the owner or general manager (GM) sets the lowest and highest prices the tool may use in automatic mode? | pe2 | Kept; became the single limits question (overlap with or1 and x-auto removed). |
| sk1 | fix | Do the people involved know enough about pricing strategy, and can they judge when to switch off automatic pricing? | sk1 | One skill kept; "pricing strategy" knowledge dropped as vague. |
| fi1 | keep | Do you know what the revenue management system (RMS) subscription and channel manager (tool that sends rates to booking sites) fees will cost your hotel? | fi1 | Shortened; channel manager kept as it is a real extra cost. |
| te1 | fix | Does the revenue management system (RMS) send rates in real time to your property management system (PMS) or central reservation system (CRS) and channel manager, or is this confirmed possible? | te1 | Plain wording; "or confirmed possible" handled by Don't know yet. |
| da1 | split | Are forecasts and competitor rates, plus cleanly set-up rate plans and booking restrictions, digital, up to date and ready to use? | da1a, da1b | Four data items split into the two that matter. |
| or1 | fix | Are the lowest and highest allowed prices and the limits of automatic mode written down, and, in managed hotels, is the owner's approval recorded? | or1 | Limits part merged into pe2; owner approval kept. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Limits and switch-off now come from the "acts by itself" gate. |

## rm-3 — Competitor rate tracking and market insight with machine learning

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the revenue or sales manager agreed to read competitor rates at least weekly? | Rate data no one reads has no value. | always |
| sk1 | I | Skills | Department head | Has the team agreed which competitor hotels to compare with? | Comparing with the wrong hotels leads to wrong price decisions. | always |
| fi1 | N | Money | Finance | Do you know the monthly fee for the rate-tracking tool? | Rate-tracking tools are priced by number of competitors and checks per day. | hidden when G_PAID=yes |
| te1 | I | Technology | IT | Can competitor rates go straight into your pricing tool or a report? | Copying rates by hand takes hours and is soon out of date. | always |
| da1 | B | Data | Department head | Is each competitor room type matched to the closest of your room types? | A suite compared with a standard room gives a false price gap. | always |
| or1 | N | Rules and controls | General manager | Has the vendor explained how it collects competitor prices and how often? | Prices collected rarely or from one site can mislead. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | fix | Will the revenue or sales manager be in charge of this tool? | pe1 | Owner moved to must-have 1; use made specific. |
| sk1 | keep | Can the people involved choose a sensible group of competitor hotels to compare with (competitive set)? | sk1 | Jargon "competitive set" removed. |
| fi1 | keep | Do you know what the rate-shopping subscription (a tool that collects competitors' prices) will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do competitor rates feed into your revenue management system (RMS) or a dashboard, or has your provider confirmed this is possible? | te1 | Plain wording. |
| da1 | keep | Are your chosen competitor hotels (competitive set) and the matching of their room types to yours digital, up to date and ready to use? | da1 | Plain wording. |
| or1 | fix | Have you checked the terms on data scraping (automatic copying of data from websites) in the vendor contract? | or1 | Practical version kept; contract-terms angle removed. |

## rm-4 — AI assistants for revenue questions, reports and price explanations

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.
- **G_LINK** (library): Does the tool need to connect to your hotel systems, such as booking, till or accounting?
  - Yes → a Doesn't apply answer on m4 becomes Don't know yet, with a note
  - No, it works on its own → hides Technology questions
  - Don't know yet → caps at Almost ready; action: Ask the vendor which hotel systems the tool must connect to.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the revenue team been shown how to ask the assistant questions? | Vague questions get vague or wrong answers. | always |
| sk1 | B | Skills | Department head | Do staff check the assistant's numbers against your reports before acting on them? | AI assistants can state a wrong figure confidently. | always |
| fi1 | N | Money | Finance | Have you checked whether your revenue tool or reporting licence already includes this? | Many revenue tools now include an assistant at no extra cost. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Can the assistant read your revenue and booking data directly? | Without your data it can only give general advice. | hidden when G_LINK=no |
| da1 | I | Data | Department head | Are key figures, such as occupancy and revenue per room, defined the same way everywhere? | If definitions differ, the assistant mixes numbers that do not match. | always |
| n1 | I | Rules and controls | Vendor (ask them) | Can the assistant show which report or number each answer comes from? | Staff can only check an answer if they can see its source. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the revenue team use this tool, and have they been shown how? | pe1 | Shortened. |
| sk1 | fix | Do the people involved know how to ask the tool good questions (prompting), and can they check its answers against reports? | sk1 | Prompting skill dropped; check kept; overlap with or1 merged. |
| fi1 | keep | Have you checked whether you already pay for this, since the team notes it is usually an add-on to the revenue management system (RMS) or reporting (BI) licence? | fi1 | Shortened. |
| te1 | keep | Is the assistant (copilot) connected to your revenue management system (RMS) and property management system (PMS) data, or is this confirmed possible? | te1 | Jargon removed. |
| da1 | keep | Is the same data as in the revenue management system (RMS) available, with clear definitions of key figures (KPIs), digital and up to date? | da1 | Acronym removed. |
| or1 | merge | Is it in place and written down that staff must check the numbers before acting on them? | sk1 | Same control as sk1. |

## rm-5 — AI agents that watch revenue, recommend and act

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Has a senior revenue person agreed to check the agents' work every day? | Agents act on rates; daily checks catch mistakes before they cost money. | always |
| sk1 | I | Skills | Department head | Can that person set what the agents may do and review what they did? | Limits only help if someone can set and check them. | always |
| fi1 | I | Money | Finance | Do you know the usage fees and the cost of connecting the agents to your systems? | Usage-based fees can rise fast when agents run all day. | always |
| te1 | B | Technology | IT | Can the agents read and change data in your booking system and channel manager? | An agent that cannot act in your systems cannot do the job. | always |
| da1 | I | Data | Department head | Do rates and availability match across your booking system and channel manager today? | Agents copy errors faster than people do. | always |
| or1a | B | Rules and controls | General manager | Is it written which rate changes need a person's approval first? | Large rate changes should never happen without a person. | always |
| or1b | B | Rules and controls | General manager | Is every action the agents take recorded so you can check it later? | Without a record you cannot find or undo a bad change. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the senior revenue lead supervises the AI agents (tools that act by themselves) every day? | pe1 | Plain wording. |
| pe2 | merge | Is it clear which named person problems are passed up to (escalation owner)? | ACT_LIMITS, ACT_OFF | Named person who can switch it off now comes from the gate. |
| sk1 | keep | Can the people involved set what the agents are allowed to do and check what they have done? | sk1 | Shortened. |
| fi1 | fix | Do you know what the usage-based fees or premium plan, and the project to connect it to your systems, will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Does the tool have live access to read and change data in your revenue management system (RMS), property management system (PMS) and channel manager, or is this confirmed possible? | te1 | Plain wording. |
| da1 | fix | Is the data across your systems digital, reliable, available in real time and ready to use? | da1 | Four-part data question cut to the one that matters. |
| or1 | split | Is it written down that a person must approve before agents change rates, and is every agent action logged? | or1a, or1b | Two controls split. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Comes from the "acts by itself" gate. |

## rm-6 — Total revenue and budget forecasting, including function space

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have the finance and revenue leads agreed to own the forecast together? | Total-revenue forecasts cross departments; one side alone will miss half. | always |
| sk1 | N | Skills | Department head | Can the finance team build budgets from forecasts and compare different scenarios? | The value is in testing "what if" cases, not one number. | always |
| fi1 | N | Money | Finance | Do you know the cost of the reporting and forecasting tool? | Forecasting is often sold as part of a reporting licence. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Can the tool read data from rooms, meeting rooms, restaurants and bars? | Total revenue needs every outlet, not only rooms. | always |
| da1 | B | Data | Department head | Do you have at least one year of revenue history for every outlet and meeting room? | Outlets without history cannot be forecast. | always |
| or1 | I | Rules and controls | General manager | Do all departments use one agreed definition of revenue? | If F&B and rooms count revenue differently, totals are wrong. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the finance and revenue leads be in charge of this tool together? | pe1 | Shortened. |
| sk1 | keep | Do the people involved know enough about building budgets from forecasts and thinking through scenarios ('what if' cases)? | sk1 | Shortened. |
| fi1 | keep | Do you know what the business intelligence (BI, reporting) and forecasting subscription will cost your hotel? | fi1 | Acronym removed. |
| te1 | fix | Has it been confirmed that you can link your revenue management system (RMS), property management system (PMS), sales and catering system and point-of-sale system (POS)? | te1 | Acronyms removed. |
| da1 | keep | Is revenue history for all outlets and function space (meeting and event rooms) digital, up to date and ready to use? | da1 | Time span added. |
| or1 | keep | Have all departments agreed on one shared definition of revenue? | or1 | Kept. |

## rm-7 — Price optimisation for upsells and extras

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **when rm7-personal=yes**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **rm7-personal** (custom): Can offers or prices differ for individual guests, based on their profile?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether offers differ per individual guest.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the revenue or front-office manager agreed to own the upsell offers? | Offers need someone to adjust them as demand changes. | always |
| sk1 | N | Skills | Department head | Can the team read which offers guests accept and adjust them? | Offers no one accepts waste guest attention. | always |
| fi1 | N | Money | Finance | Do you know whether the tool charges commission per sale or a subscription? | Commission eats into each upsell; subscription costs even with no sales. | always |
| te1 | B | Technology | IT | Can the tool see which rooms and extras are free in your booking system? | Selling an upgrade that is not available creates angry guests. | always |
| da1 | I | Data | Department head | Are prices for room upgrades and extras up to date in one place? | The tool can only price what it can see. | always |
| or1 | B | Rules and controls | General manager | Is it written which offers the tool may price by itself? | Without a rule the tool may discount your best rooms. | always |
| n1 | N | People | Department head | Do front-desk staff know which offers guests accepted before arrival? | Staff must honour what guests bought in advance. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the revenue or front-office manager owns the offers? | pe1 | Shortened. |
| sk1 | keep | Do the people involved know enough about designing offers, and can they read how many guests accept them (conversion data)? | sk1 | Jargon removed. |
| fi1 | keep | Do you know what an upsell platform (a tool that sells upgrades and extras), paid by commission or subscription, will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is the tool linked to room stock in your property management system (PMS), the revenue management system (RMS) forecast and guest messaging, or is this confirmed possible? | te1 | Shortened. |
| da1 | fix | Are room-type stock, rate gaps (price differences between room types) and prices for extras digital, up to date and ready to use? | da1 | "Rate gaps" replaced with plain words. |
| or1 | keep | Are there written rules on which offers the tool may price by itself? | or1 | Kept. |

## rm-8 — Spa and wellness yield management and demand-based treatment prices

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have the spa manager and revenue manager agreed to own treatment pricing together? | Spa knows the therapists; revenue knows pricing. | always |
| sk1 | N | Skills | Department head | Does the spa team understand how prices that change with demand work? | Staff must explain to guests why prices differ by time. | always |
| fi1 | N | Money | Finance | Do you know the cost of the spa-system add-on? | Usually an add-on to the spa booking system. | always |
| te1 | I | Technology | IT | Is your spa booking system linked to your hotel booking system? | Hotel occupancy drives spa demand. | always |
| da1 | B | Data | Department head | Are treatment bookings, therapist schedules and no-shows recorded in the spa system? | Demand pricing needs past treatment demand. | always |
| or1a | I | Rules and controls | General manager | Are the rules for treatment prices, including lowest prices, written down? | Unlimited price swings damage trust in the spa. | always |
| or1b | I | Rules and controls | General manager | Have therapists been told how changing prices may affect their schedules? | Busy peak hours change therapist workloads. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the spa manager, together with the revenue manager, be in charge of this tool? | pe1 | Shortened. |
| sk1 | fix | Do the people involved know enough about planning spa schedules to earn the most from demand (yield thinking)? | sk1 | Jargon "yield" removed. |
| fi1 | keep | Do you know what the add-on to your spa system will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is your spa booking system linked to your property management system (PMS), or has your provider confirmed this is possible? | te1 | Acronym removed. |
| da1 | keep | Are treatment bookings, therapist schedules and no-show records digital, up to date and ready to use? | da1 | Shortened. |
| or1 | split | Are the pricing rules and their effect on staff rotas agreed and written down? | or1a, or1b | Double question split. |

## rm-9 — Rate parity checks (same price on all channels) and automatic matching

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the revenue or online sales manager agreed to own price-check alerts? | Alerts no one reads change nothing. | always |
| sk1 | I | Skills | Department head | Does that person know the price terms agreed with each booking site? | Whether a lower price breaks a deal depends on each contract. | always |
| fi1 | N | Money | Finance | Do you know the monthly fee for the price-check tool? | Usually priced per hotel. | always |
| te1 | I | Technology | IT | Can the tool read your rates from the booking engine and channel manager? | It must compare your own rates with what sites show. | always |
| da1 | I | Data | Department head | Are your own rates by channel, room type and conditions recorded in one place? | The tool needs your true price to spot differences. | always |
| or1a | B | Rules and controls | General manager | Is there a written lowest price the tool may never go below when matching? | Automatic matching can chase prices down. | always |
| or1b | I | Rules and controls | General manager | Is one person named to contact a booking site that shows a lower price? | Someone must fix the cause, not only the symptom. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the revenue or e-commerce (online sales) manager owns the alerts and the rules for matching prices? | pe1 | Rules part moved to or1. |
| sk1 | fix | Can the people involved read rate parity reports (whether prices match across channels), and do they know each channel's contract terms? | sk1 | Two ideas cut to one; "contract terms" kept as business term. |
| fi1 | keep | Do you know what the subscription, often charged per hotel, will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is the tool linked to your booking engine, channel manager and a rate-shopping feed (collected online prices), or is this confirmed possible? | te1 | Jargon removed. |
| da1 | keep | Are your own rates by channel, room type and booking conditions digital, up to date and ready to use? | da1 | Shortened. |
| or1 | split | Are there written rules for when a lower rate is matched, with a lowest allowed price, and for who follows up with the channel? | or1a, or1b | Triple question split; limits overlap with x-auto removed. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Comes from the "acts by itself" gate. |

# Reservations & Distribution

## res-1 — AI voice agents for reservation and front-desk calls (hotel and central lines)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **AUTO_GUEST** (automatic, not asked): applies G_GUEST=guests → adds GUEST_FACTS, GUEST_STAFF
- **res1-pay** (custom): Will the voice agent take card payments or deposits during the call?
  - Yes → no change
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether the voice agent handles card payments.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the reservations manager agreed to listen to a sample of calls every week? | Call quality drops unnoticed unless someone listens. | always |
| sk1 | I | Skills | Department head | Can your team update the agent's answers the same day prices or policies change? | A voice agent quoting last month's price loses bookings. | always |
| fi1 | I | Money | Finance | Do you know the set-up fee and the price per call or per minute? | Per-minute pricing makes busy months expensive. | always |
| te1a | B | Technology | IT | Can the agent connect to your phone system and transfer calls to staff? | Without transfer, guests get stuck with the agent. | always |
| te1b | B | Technology | IT | Can the agent read live availability and create bookings in your booking system? | An agent that cannot book only takes messages. | always |
| da1 | B | Data | Department head | Are your answers to common guest questions written down and current? | The agent can only answer what it has been given. | always |
| or1 | I | Rules and controls | General manager | Does the agent tell callers at the start that they are speaking to a computer? | Guests who find out later feel misled and complain. | always |
| n1 | B | Rules and controls | IT | Has IT checked the card-payment set-up meets your card provider's security requirements? | Card details read out on a call are a fraud target. | res1-pay=yes |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |
| GUEST_FACTS | B | Data | Department head | Has a person checked the facts the tool gives guests, such as prices and opening times? | Guests act on what the tool tells them. | always |
| GUEST_STAFF | B | People | Department head | Can guests reach a staff member at any time while using the tool? | Guests with problems must never be stuck with a machine. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | fix | Is it agreed that the reservations manager supervises the tool, and staff take transferred and complex calls? | pe1 | Two ideas split: hand-over to staff is now a blocker from the guest-facing rule. |
| sk1 | fix | Do the people involved know how to keep the call scripts and knowledge base up to date, and how to review calls? | sk1 | Two skills cut to one. |
| fi1 | keep | Do you know what the usage fees (per minute or per call) plus set-up will cost your hotel? | fi1 | Shortened. |
| te1 | split | Is the tool linked to your phone system (SIP) and able to read and write bookings in your property management system (PMS) or central reservation system (CRS), or confirmed possible? | te1a, te1b | Two systems split; jargon "SIP" removed. |
| da1 | keep | Are up-to-date FAQs (common guest questions) and policies, plus live rates and availability, digital and ready to use? | da1 | Shortened. |
| or1 | rewrite | Is it agreed how you will tell callers they are speaking to AI? | or1 | Legal framing removed; kept as a practical guest-trust question. |
| or2 | remove | Is consent to record calls in place and written down? | — | Legal topic (call-recording consent) out of scope; covered by the fixed disclaimer. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Comes from the "acts by itself" gate. |

## res-2 — AI handling of reservation emails and offers

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have the reservations agents agreed to review the drafts the tool writes? | Drafts save time only if agents trust and use them. | always |
| sk1 | I | Skills | Department head | Can agents spot a wrong price, date or room type in a draft? | The most costly mistakes in offers are price and dates. | always |
| fi1 | N | Money | Finance | Do you know the price per user or per email? | Email volume pricing grows with season. | always |
| te1a | B | Technology | IT | Is the tool connected to your reservations mailbox? | It must read guest emails to draft replies. | always |
| te1b | B | Technology | IT | Can the tool read live rates and availability from your booking system? | Offers with old rates must be honoured or cause disputes. | always |
| da1 | I | Data | Department head | Are rate rules, room descriptions and offer templates written down and current? | The tool copies whatever it is given. | always |
| or1 | B | Rules and controls | General manager | Does a person check every price before an offer is sent? | A sent price is a promise to the guest. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the reservations agents review the drafts the tool writes? | pe1 | Shortened. |
| sk1 | fix | Can the people involved check offers drafted by AI before they are sent? | sk1 | Made concrete. |
| fi1 | keep | Do you know what the subscription, charged per user or by email volume, will cost your hotel? | fi1 | Shortened. |
| te1 | split | Is the tool connected to your mailbox and to live availability and rates in your property management system (PMS) or central reservation system (CRS), or is this confirmed possible? | te1a, te1b | Two links split. |
| da1 | keep | Are rate rules, room descriptions and offer templates digital, up to date and ready to use? | da1 | Four-part phrase removed. |
| or1 | keep | Is it in place and written down that a person checks prices before they are sent? | or1 | Kept. |

## res-3 — AI channel management (sending rates and availability to booking channels)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | N | Skills | Department head | Does someone decide which rooms and rates go to each booking site? | The tool sends what you decide; it does not set strategy. | always |
| fi1 | N | Money | Finance | Do you know the monthly fee for the channel manager? | Often priced by number of booking sites connected. | always |
| te1 | B | Technology | IT | Does the channel manager exchange bookings and availability both ways with your booking system? | A one-way link causes double bookings. | always |
| da1 | B | Data | Department head | Is every room and rate matched to the right code on each booking site? | A wrong match sells the wrong room at the wrong price. | always |
| or1 | I | Rules and controls | General manager | Does someone check daily that prices on booking sites match what you set? | Errors on one site can run for days unnoticed. | always |
| n1 | I | Technology | Vendor (ask them) | Has the vendor shown what the tool does automatically beyond sending rates? | Many channel managers have little or no AI; know what you pay for. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the revenue or distribution manager be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | fix | Do the people involved know enough about channel strategy and checking that prices match across channels (parity)? | sk1 | Jargon "parity" removed; one idea. |
| fi1 | keep | Do you know what the channel manager subscription (tool that sends rates and availability to booking sites) will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is your channel manager connected two-way to your property management system (PMS) and revenue management system (RMS), or is this confirmed possible? | te1 | Acronyms removed. |
| da1 | keep | Is the matching of your rooms and rates to each channel's codes (mapping) clean, digital and up to date? | da1 | Jargon "mapping" removed. |
| or1 | rewrite | Are your contract terms with online travel agencies (OTAs) on rate parity (same price everywhere) written down? | or1 | Contract question was not about this tool; replaced by a daily check. |

## res-4 — AI assistant and personalisation in the website booking engine

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **when res4-personal=yes**

**Gates ("How it works")**

- **AUTO_GUEST** (automatic, not asked): applies G_GUEST=guests → adds GUEST_FACTS, GUEST_STAFF
- **res4-personal** (custom): Does the booking engine tailor offers using each guest's history or browsing?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor what guest data the booking engine uses to tailor offers.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the online sales or marketing manager agreed to own the booking-engine assistant? | Someone must keep its answers and offers current. | always |
| sk1 | N | Skills | Department head | Can that person read how many visitors book, and where others leave? | Shows whether the assistant helps or hurts bookings. | always |
| fi1 | N | Money | Finance | Do you know the cost of the booking-engine add-on? | Usually a monthly add-on or a fee per booking. | always |
| te1 | B | Technology | IT | Is the booking engine linked to your booking system for live availability? | Offering rooms that are sold out loses trust. | always |
| da1 | B | Data | Department head | Are room descriptions, photos, extras and prices on the booking engine complete and current? | The assistant answers from this content. | always |
| GUEST_FACTS | B | Data | Department head | Has a person checked the facts the tool gives guests, such as prices and opening times? | Guests act on what the tool tells them. | always |
| GUEST_STAFF | B | People | Department head | Can guests reach a staff member at any time while using the tool? | Guests with problems must never be stuck with a machine. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the e-commerce or marketing manager be in charge of this tool? | pe1 | Shortened. |
| sk1 | fix | Do the people involved know enough about analysing how many website visitors book (conversion) and keeping content up to date? | sk1 | Two skills cut to one. |
| fi1 | keep | Do you know what the add-on to your booking engine (website booking tool) will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is your booking engine linked to your property management system (PMS) and customer relationship management system (CRM), or is this confirmed possible? | te1 | CRM part dropped (only needed when personalising). |
| da1 | fix | Are hotel content, the list of extras for sale and guest behaviour data (collected with cookie consent) digital, up to date and ready to use? | da1 | Cookie part removed (legal). |
| or1 | remove | Has a named person checked what the law requires on consent for cookies and personalisation? | — | Legal topic (cookie consent) out of scope; personal-data use triggers the sensitive flag via the gate. |

## res-5 — Predicting cancellations and no-shows to set overbooking

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Has the revenue manager agreed to set the overbooking limit each day? | Too much overbooking means guests sent elsewhere. | always |
| sk1 | I | Skills | Department head | Can the team weigh the cost of moving a guest against the extra revenue? | Moving a loyal guest can cost more than the room earns. | always |
| fi1 | N | Money | Finance | Have you checked whether your revenue tool already includes this? | Usually part of the revenue management tool. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Is the forecasting tool linked to your booking system? | It needs live bookings to predict cancellations. | always |
| da1 | B | Data | Department head | Do you have cancellation and no-show history by booking site and room type? | No-show rates differ a lot between booking sites. | always |
| or1 | B | Rules and controls | General manager | Is there an agreed plan with front office for moving a guest to another hotel? | When overbooking goes wrong, the desk must act at once. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the revenue manager sets the limits for overbooking? | pe1 | Kept. |
| sk1 | keep | Can the people involved weigh the risk of having to send a guest to another hotel (walk) against the extra revenue? | sk1 | Jargon "walk" removed. |
| fi1 | keep | Have you checked whether you already pay for this, since the team notes it is usually part of the revenue management system (RMS)? | fi1 | Acronym removed. |
| te1 | keep | Is your revenue management system (RMS) linked to your property management system (PMS), or is this confirmed possible? | te1 | Acronyms removed. |
| da1 | keep | Is cancellation and no-show history by channel and room type digital, up to date and ready to use? | da1 | Shortened. |
| or1 | keep | Is there a written policy, agreed with front office, for moving guests to another hotel when overbooked (walk policy)? | or1 | Jargon removed. |

## res-6 — AI for group rooming lists, rate loading and reservation tasks

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the group reservations coordinator agreed to check the tool's work? | Group errors affect dozens of rooms at once. | always |
| sk1 | I | Skills | Department head | Does that person know your group contracts and rate codes well? | Only someone who knows the contract can spot a wrong rate. | always |
| fi1 | N | Money | Finance | Do you know whether this is a booking-system add-on or a separate tool, and its cost? | Add-ons are usually cheaper to run. | always |
| te1 | B | Technology | IT | Can the tool create group blocks and load rates in your booking system? | The value is in not typing rooming lists by hand. | always |
| da1 | I | Data | Department head | Are your rate codes and rooming-list formats tidy and the same every time? | Messy formats make the tool guess. | always |
| or1 | B | Rules and controls | General manager | Does a person check every bulk change before it is saved? | One wrong bulk change can break a whole group. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the groups or reservations coordinator checks the tool's output? | pe1 | Shortened. |
| sk1 | keep | Do the people involved know enough about group contracts and how rate codes are structured? | sk1 | Shortened. |
| fi1 | keep | Do you know what an add-on to your property management system (PMS), or a separate AI tool, will cost your hotel? | fi1 | Acronym removed. |
| te1 | keep | Can the tool make changes to group room blocks and rate plans in your property management system (PMS), or is this confirmed possible? | te1 | Shortened. |
| da1 | keep | Are a clean rate-code structure and rooming-list (group guest list) formats digital, up to date and ready to use? | da1 | Jargon explained. |
| or1 | keep | Is it in place and written down that a person checks before many bookings are changed at once? | or1 | Kept. |

## res-7 — Bookable hotel apps inside AI assistants (such as ChatGPT apps)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the online sales or distribution lead agreed to own this new sales channel? | New channels fail without someone watching results. | always |
| sk1 | N | Skills | Department head | Does that person understand how guests can book through AI assistants such as ChatGPT? | The team must know how guests will find and book you. | always |
| fi1 | I | Money | Finance | Do you know the build or vendor fee and any commission per booking? | Commission may be similar to booking sites. | always |
| te1 | B | Technology | IT | Can AI assistants read your live rates and availability through a booking link? | Without live data the assistant shows wrong prices. | always |
| da1 | B | Data | Department head | Are your hotel description, photos and rates complete and current online? | Assistants describe you from this content. | always |
| or1 | I | Rules and controls | General manager | Are your brand and pricing rules for new sales channels written down? | Stops the new channel from undercutting your own website. | always |
| n1 | I | Rules and controls | Vendor (ask them) | Do you know which company runs the booking link inside the AI assistant? | Someone must fix it when bookings fail. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the e-commerce or distribution lead be in charge of this tool? | pe1 | Shortened. |
| sk1 | fix | Do the people involved understand booking channels inside AI assistants and MCP (a standard way to connect systems to AI assistants)? | sk1 | Jargon "MCP" removed. |
| fi1 | keep | Do you know what building it or paying a provider, plus any commission, will cost your hotel? | fi1 | Shortened. |
| te1 | fix | Do you have an API (a link that lets two systems exchange data) or MCP server (the same for AI assistants) sharing live rates and availability, or confirmed possible? | te1 | Jargon "API/MCP" removed. |
| da1 | keep | Are your hotel content and rates structured, current, digital and ready to use? | da1 | Four-part phrase removed. |
| or1 | fix | Are there written brand or contract rules for new sales channels? | or1 | "Contract rules" dropped. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Comes from the "acts by itself" gate. |

## res-8 — AI scoring and analysis of reservation calls

Review verdict: **Wrong** → treatment: **full rewrite**  
Sensitive flag: **always**

**Gates ("How it works")**

- **res8-named** (custom): Will call scores be linked to named staff members?
  - Yes, scores are per person → raises sensitive flag
  - No, only team results → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether scores can be traced to individual staff.
- **res8-voice** (custom): Does the tool judge tone of voice, stress or mood from calls?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether the tool analyses tone of voice or mood.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Is it agreed that call scores are used only for coaching, not pay or discipline? | Staff accept coaching tools; they resist hidden performance ratings. | always |
| sk1 | I | Skills | Department head | Can the reservations manager turn call results into useful coaching sessions? | Scores without coaching change nothing. | always |
| fi1 | N | Money | Finance | Do you know the price per call analysed? | Busy lines make per-call pricing add up. | always |
| te1 | B | Technology | IT | Is the tool linked to your phone and call-recording systems? | It analyses recordings; no recordings, no analysis. | always |
| da1a | B | Data | Department head | Are your call standards written down, so the tool scores against them? | Without your standards, the tool scores against its own idea of a good call. | always |
| da1b | I | Data | Department head | Are calls already recorded and stored in one place? | The tool needs recordings to work. | always |
| or1 | B | Rules and controls | General manager | Have reservations staff been told about the tool and asked for feedback before it starts? | Staff who learn about call scoring late lose trust in management. | always |
| n1 | I | People | Staff who use it | Can a staff member see and question their own call scores? | People accept scores they can see and challenge. | res8-named=yes |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | fix | Is it agreed that the reservations manager uses the call scores to coach staff? | pe1 | Rewritten: use limited to coaching. |
| sk1 | keep | Do the people involved know enough about coaching staff using call data? | sk1 | Shortened. |
| fi1 | keep | Do you know what the usage fees, charged per call, will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is the tool linked to your phone and call-recording systems, or is this confirmed possible? | te1 | Shortened. |
| da1 | split | Are call recordings digital and ready to use, and are your service standards defined? | da1a, da1b | Double question split. |
| or1 | rewrite | Are rules on monitoring staff written down, has the works council (staff representatives) been consulted, and is it written that staff emotions will not be analysed? | or1 | Legal parts (works council, emotion rules) removed; practical staff step kept; emotion use now a gate. |
| x-sens | remove | Has a data protection impact assessment (DPIA, a formal privacy risk check) been done for this tool? | — | Legal topic (privacy assessment) out of scope; the sensitive-area flag tells users to ask an adviser. |

# Sales & Marketing

## sm-1 — AI-written marketing text and translation

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.
- **G_LINK** (library): Does the tool need to connect to your hotel systems, such as booking, till or accounting?
  - Yes → a Doesn't apply answer on m4 becomes Don't know yet, with a note
  - No, it works on its own → hides Technology questions
  - Don't know yet → caps at Almost ready; action: Ask the vendor which hotel systems the tool must connect to.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe2 | I | People | General manager | Has one person agreed to check that AI texts match your brand's tone? | AI text drifts towards bland, generic wording. | always |
| sk1 | I | Skills | Department head | Can the marketing team edit AI drafts so they sound like your hotel? | Editing, not prompting, is what makes the text usable. | always |
| fi1 | N | Money | Finance | Have you checked whether you already pay for an AI writing tool? | Many office licences already include one. | hidden when G_PAID=yes |
| te1 | N | Technology | IT | Have you decided whether the tool should publish straight to your website? | Direct publishing saves time but skips a check. | hidden when G_LINK=no |
| da1 | I | Data | Department head | Are your brand guidelines and approved hotel facts written down in one place? | The tool invents details when facts are missing. | always |
| n1 | B | Rules and controls | Department head | Does a person check facts such as prices, opening times and green claims before publishing? | AI writes wrong facts confidently; guests hold you to them. | always |
| n2 | N | Skills | Department head | Does a native speaker check translations for your main guest languages? | Machine translation errors look careless to guests. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the marketing staff be in charge of this tool? | m1 | Owner is must-have 1. |
| pe2 | keep | Is it agreed that one person checks that texts match the brand's tone? | pe2 | Shortened. |
| sk1 | fix | Do the people involved know enough about writing instructions for AI (prompting) and editing its drafts? | sk1 | Two skills cut to one. |
| fi1 | keep | Have you checked whether you already pay for this, since the team notes the cost is low (an AI tool licence per user)? | fi1 | Shortened. |
| te1 | fix | Have you decided whether you need the optional plug-in for your website content management system (CMS)? | te1 | Acronym "CMS" removed. |
| da1 | keep | Are your brand guidelines and approved facts about the hotel digital, up to date and ready to use? | da1 | Shortened. |
| or1 | merge | Is there a written staff policy on using AI that forbids putting guest data into public tools? | m9 | Rules on what not to type into AI tools are must-have 9. |

## sm-2 — Handling group and event enquiries and requests for proposals

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the sales manager agreed to review every proposal before it is sent? | Proposals carry prices and dates the hotel must honour. | always |
| sk1 | I | Skills | Department head | Can the sales team check the room, menu and price details in AI drafts? | The costly mistakes are wrong prices and dates. | always |
| fi1 | N | Money | Finance | Do you know the cost of the sales-platform add-on? | Often an add-on to your sales and events system. | always |
| te1a | B | Technology | IT | Can the tool read your meeting-room calendar in your sales and events system? | Offering a room already booked creates a double booking. | always |
| te1b | I | Technology | IT | Does the tool receive enquiries from your inbox and event-booking platforms? | Enquiries outside the tool get missed. | always |
| da1 | B | Data | Department head | Are meeting-room details, menus and pricing rules recorded and current? | The draft can only be as good as these facts. | always |
| or1 | B | Rules and controls | General manager | Does a person approve every price before a proposal goes out? | A sent price is a promise. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the sales manager reviews proposals? | pe1 | Shortened. |
| sk1 | fix | Do the people involved know enough about pricing proposals, and can they check what the AI produces? | sk1 | Two skills cut to one. |
| fi1 | keep | Do you know what the add-on to your sales platform will cost your hotel? | fi1 | Shortened. |
| te1 | split | Is the tool linked to your sales and catering system, inbox and Cvent, or is this confirmed possible? | te1a, te1b | Three systems cut to two clear links; brand name removed. |
| da1 | keep | Are your list of meeting and event rooms (function space), menus and pricing rules digital, up to date and ready to use? | da1 | Jargon "function space" removed. |
| or1 | keep | Is it in place and written down that a person approves prices? | or1 | Kept. |

## sm-3 — Guest grouping, predictive targeting, loyalty and personalised email campaigns

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **always**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the marketing or loyalty manager agreed to own guest campaigns? | Campaigns need someone to judge results. | always |
| sk1 | N | Skills | Department head | Can the team read campaign results and adjust guest groups? | Groups that do not respond should change. | always |
| fi1 | N | Money | Finance | Do you know the cost of the guest-database tool? | Guest databases are usually priced per guest profile. | always |
| te1 | B | Technology | IT | Is your guest database filled automatically from your booking system and restaurant tills? | Typed-in data is always incomplete. | always |
| da1a | B | Data | Department head | Are guest records merged so each guest appears only once? | Duplicates mean the same guest gets three emails. | always |
| da1b | I | Data | Department head | Is it recorded which guests have agreed to marketing emails? | Emailing guests who said no causes complaints and unsubscribes. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the customer relationship management (CRM) or loyalty manager be in charge of this tool? | pe1 | Acronym removed. |
| sk1 | keep | Do the people involved know enough about grouping guests (segmentation) and analysing campaign results? | sk1 | Jargon removed. |
| fi1 | keep | Do you know what the customer relationship management system (CRM) or customer data platform (CDP) subscription will cost your hotel? | fi1 | Acronyms removed. |
| te1 | keep | Is your customer relationship management system (CRM) fed from your property management system (PMS), booking engine and point-of-sale system (POS), or is this confirmed possible? | te1 | Acronyms removed. |
| da1 | split | Are your guest profiles combined into one per guest, free of duplicates, with marketing consent, digital and up to date? | da1a, da1b | Two ideas split; legal framing removed, practical record kept. |
| or1 | remove | Has a named person checked what data protection law (GDPR) requires for managing guest consent? | — | Legal topic (data-protection consent) out of scope; sensitive flag tells users to ask an adviser. |

## sm-4 — AI-made images and video for marketing

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.
- **sm4-real** (custom): Will the AI images look like your real hotel, rooms, food or staff?
  - Yes, they look real → no change
  - No, only mood or illustration → no change
  - Don't know yet → caps at Almost ready; action: Decide whether AI images will look like the real hotel.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe2 | I | People | General manager | Has a brand owner agreed to approve every AI image before use? | One wrong image can spread fast online. | always |
| sk1 | I | Skills | Department head | Can the team spot an AI image that makes the hotel look better than it is? | Guests who arrive to something different write bad reviews. | always |
| fi1 | N | Money | Finance | Do you know the licence cost of the image tool? | Usually a monthly licence per user. | hidden when G_PAID=yes |
| da1 | I | Data | Department head | Do you own the rights to every photo you feed into the tool? | Using others' photos as a base can lead to takedown demands. | always |
| or1 | B | Rules and controls | General manager | Is it written that no image may show something guests will not find? | The main risk is a misleading picture. | always |
| n1 | I | Rules and controls | General manager | Have you agreed how you will mark images that are AI-made? | Guests trust a hotel that is open about AI images. | sm4-real=yes |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the marketing team be in charge of this tool? | m1 | Owner is must-have 1. |
| pe2 | keep | Is it agreed that the brand owner signs off? | pe2 | Shortened. |
| sk1 | fix | Do the people involved know how to instruct AI to make images (prompting), and can they spot misleading images? | sk1 | Prompting skill dropped; one idea. |
| fi1 | keep | Do you know what the AI tool licence will cost your hotel? | fi1 | Shortened. |
| te1 | remove | Is it confirmed that this works without a link to your hotel systems? | — | No hotel-system link needed; question gave no information. |
| da1 | fix | Are your brand assets digital and up to date, and do you hold the rights to the source images? | da1 | Two ideas cut to the one that matters. |
| or1 | keep | Is it in place and written down that no images may misrepresent the hotel? | or1 | Shortened. |

## sm-5 — Optimising paid ads, metasearch and automated ad buying

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the digital marketing manager or your agency agreed to own ad spending? | Automated ad buying needs someone watching spend weekly. | always |
| sk1 | I | Skills | Department head | Can that person read how much booking revenue each ad brings in? | Without this, the tool spends on ads that do not sell rooms. | always |
| fi1 | B | Money | Finance | Is there a monthly ad-spend limit the tool cannot go above? | Automated bidding can spend a month's budget in days. | always |
| te1 | B | Technology | IT | Does your booking engine report which ads led to bookings? | The tool learns only from bookings it can see. | always |
| da1 | I | Data | Department head | Do you have at least three months of booking results from your ads? | Too little data makes the tool bid at random. | always |
| or2 | I | Rules and controls | General manager | Is there a written agreement with the agency on fees and who controls the ad accounts? | Hotels lose their ad history when an agency leaves. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the digital marketing manager or agency be in charge of this tool? | pe1 | Shortened. |
| sk1 | fix | Can the people involved read return on ad spend (ROAS), and also set budgets and targets? | sk1 | Jargon "ROAS" replaced; budgets moved to fi1. |
| fi1 | fix | Do you know what the media spend (money spent on ads) plus the agency or tool fee will cost your hotel? | fi1 | Cost question turned into the practical spend limit. |
| te1 | keep | Is conversion tracking (which ads lead to bookings) set up on your booking engine, or is this confirmed possible? | te1 | Jargon removed. |
| da1 | fix | Is conversion data (which ads lead to bookings), collected with consent, digital, up to date and ready to use? | da1 | Consent part removed (legal). |
| or1 | remove | Has a named person checked what the law requires on cookie consent? | — | Legal topic (cookie consent) out of scope. |
| or2 | keep | Is there a written contract with the agency? | or2 | Made specific. |

## sm-6 — Visibility in search engines and AI assistants (SEO, GEO)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the marketing or online sales lead agreed to own online visibility? | Visibility work never ends; someone must own it. | always |
| sk1 | N | Skills | Department head | Does that person know what makes a hotel appear in AI search answers? | The rules differ from classic search. | always |
| fi1 | N | Money | Finance | Do you know the cost of the monitoring tool and the content work? | Content work is usually the larger cost. | hidden when G_PAID=yes |
| te1 | I | Technology | IT | Does your website describe rooms, prices and location in a way search tools can read? | AI search tools quote what they can read easily. | always |
| da1 | B | Data | Department head | Are your hotel facts the same on your website and every listing? | AI tools mix sources; one wrong listing spreads. | always |
| or1 | I | Rules and controls | General manager | Does someone check each month how AI assistants describe your hotel? | You cannot fix what you never check. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the marketing or e-commerce lead be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Do the people involved understand what makes a hotel visible in AI search tools? | sk1 | Shortened. |
| fi1 | keep | Do you know what the monitoring tool subscription and the content work will cost your hotel? | fi1 | Shortened. |
| te1 | fix | Does your website have structured data (labels machines can read), and a bookable API (a link that lets systems exchange data) where used, or is this confirmed possible? | te1 | Jargon removed; booking link part dropped (that is res-7). |
| da1 | fix | Are your hotel content and reviews complete, consistent, digital and up to date? | da1 | Four-part phrase removed. |
| or1 | rewrite | Is a named person responsible for acting on each alert or report? | or1 | Generic alert question replaced with use-case-specific check. |

## sm-7 — Finding, qualifying and scoring sales leads (groups, events, companies)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the sales team agreed to work the leads the tool ranks highest? | Scores only help if sales act on them. | always |
| sk1 | I | Skills | Department head | Can sales staff question a lead score that looks wrong? | The tool cannot know relationships your team has. | always |
| fi1 | N | Money | Finance | Do you know the cost of the sales-platform add-on? | Often priced per user. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Do you have a sales system that records leads and deals? | The tool scores leads from this system. | always |
| da1 | B | Data | Department head | Do you have records of past leads, both won and lost? | It learns what a good lead looks like from your past. | always |
| or1 | I | Rules and controls | General manager | Has the vendor told you where its company contact data comes from? | Old or bought contact lists waste sales time. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the sales team be in charge of this tool? | pe1 | Made specific. |
| sk1 | fix | Can the people involved judge how promising a lead is, and question the tool's scores? | sk1 | Two ideas cut to one. |
| fi1 | keep | Do you know what the add-on to your sales platform will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a customer relationship management system (CRM) or sales system, or has your provider confirmed it is possible? | te1 | Acronym removed. |
| da1 | keep | Are past leads and records of won and lost deals digital, up to date and ready to use? | da1 | Four-part phrase removed. |
| or1 | rewrite | Have you checked where your data on potential clients comes from, under data protection law (GDPR)? | or1 | Legal framing removed; practical data-quality question kept. |

# Front Office

## fo-1 — Digital check-in with ID document scan (online, mobile or kiosk)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **when fo1-face=yes**

**Gates ("How it works")**

- **fo1-face** (custom): Does check-in also compare the guest's face with the ID photo?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether check-in compares faces with ID photos.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe2 | B | People | General manager | Can desk staff check in any guest whose scan or online check-in fails? | Guests stuck at a failed kiosk is the worst first impression. | always |
| sk1 | I | Skills | Department head | Can desk staff recognise an ID scan that looks wrong? | A false or misread ID must be caught by a person. | always |
| fi1 | N | Money | Finance | Do you know the fee per check-in and any kiosk hardware cost? | Kiosks add a hardware cost to the per-use fee. | always |
| te1a | B | Technology | IT | Does the tool send guest details straight into your booking system? | Typing scanned details again removes the time saving. | always |
| te1b | I | Technology | IT | Does the tool send guest registration details to the reporting system you use today? | Registration reporting must keep working after the change. | always |
| or1 | I | Rules and controls | General manager | Is it decided how long ID scans are kept and who can see them? | ID scans are valuable to thieves; fewer copies, less risk. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the front-office manager be in charge of this tool? | m1 | Owner is must-have 1. |
| pe2 | keep | Is it agreed that desk staff handle the cases the system cannot deal with? | pe2 | Shortened. |
| sk1 | fix | Can the people involved deal with failed scans and with ID checks? | sk1 | Two skills cut to one. |
| fi1 | keep | Do you know what the fees (per check-in or subscription), plus kiosk hardware if used, will cost your hotel? | fi1 | Shortened. |
| te1 | split | Is the tool linked to your property management system (PMS) and the police guest-reporting system, or is this confirmed possible? | te1a, te1b | Two systems split; "police" wording simplified. |
| da1 | remove | Has a named person checked that ID data is handled as national guest registration rules require? | — | Legal topic (national registration rules) out of scope; practical reporting kept in te1. |
| or1 | rewrite | Has a named person checked what the law requires on how long ID images are kept, and on the legal basis under data protection law (GDPR)? | or1 | Legal basis removed; practical retention decision kept. |
| x-sens | remove | Has a data protection impact assessment (DPIA, a formal privacy risk check) been done for this tool? | — | Legal topic (privacy assessment) out of scope. |

## fo-2 — AI room assignment

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **when fo2-personal=yes**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **fo2-personal** (custom): Will room choice use personal details such as age, nationality or health needs?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor which guest details the tool uses to choose rooms.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | I | Skills | Department head | Can desk staff judge when to keep or change the tool's room choice? | Staff know guests the tool does not. | always |
| fi1 | N | Money | Finance | Have you checked whether your booking system or upsell tool already includes this? | Often already included. | always |
| te1 | B | Technology | IT | Can the tool see free rooms and housekeeping status as they change? | Assigning a dirty room delays check-in. | always |
| da1 | I | Data | Department head | Are guest room preferences and past stays recorded in your booking system? | Good assignment depends on knowing preferences. | always |
| or1 | I | Rules and controls | General manager | Is it written that staff may change the room the tool chooses? | Staff must not feel bound by the tool. | always |
| or2 | N | Rules and controls | General manager | Is it agreed who checks the tool's room choices, and how often? | Spot checks find patterns such as always giving one floor. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the front-office manager be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | keep | Can the people involved judge when to trust the tool's room choices and when to change them? | sk1 | Shortened. |
| fi1 | keep | Have you checked whether you already pay for this, since the team notes it is usually part of the property management system (PMS) or an upsell tool? | fi1 | Acronym removed. |
| te1 | keep | Can the tool see room stock in your property management system (PMS) and the housekeeping status of rooms, or is this confirmed possible? | te1 | Plain wording. |
| da1 | keep | Are guest preferences and stay history digital, up to date and ready to use? | da1 | Shortened. |
| or1 | keep | Is it written down that staff may change the room the tool chooses? | or1 | Kept. |
| or2 | keep | Is it agreed who checks the tool's room choices, and how often? | or2 | Kept. |

## fo-3 — Biometric face check at check-in (selfie matched to ID photo)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **always**

**Gates ("How it works")**

- **fo3-match** (custom): Does the tool compare the guest's face only with their own ID photo?
  - Yes, only with their own ID photo → no change
  - No, it also searches other stored faces → caps at Almost ready; action: Ask an adviser before using a tool that searches stored faces.
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether faces are compared only with the guest's own ID photo.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe2 | B | People | General manager | Can guests who say no to the face check be checked in another way? | Some guests will refuse; they must not be stuck. | always |
| sk1 | I | Skills | Department head | Can desk staff handle a failed face match calmly and quickly? | A failed match feels like an accusation to the guest. | always |
| fi1 | N | Money | Finance | Do you know the fee per check and any kiosk hardware cost? | Per-check fees add up in busy hotels. | always |
| te1 | B | Technology | IT | Is the identity-check service linked to your check-in process? | A separate step adds time instead of saving it. | always |
| da1 | B | Data | General manager | Is it agreed that face images are deleted right after the check? | Stored face images are a lasting risk if leaked. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the front-office manager be in charge of this tool? | m1 | Owner is must-have 1. |
| pe2 | keep | Is there a way in place for staff to check in guests who refuse the face check? | pe2 | Shortened. |
| sk1 | fix | Can the people involved handle guests who refuse and faces that fail to match? | sk1 | Refusal part covered by pe2. |
| fi1 | keep | Do you know what the fee per verification, plus kiosk hardware if used, will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is an identity-checking service linked to your check-in process, or is this confirmed possible? | te1 | Plain wording. |
| da1 | rewrite | Has a named person checked what the law requires for biometric data (face data, a specially protected category)? | da1 | Legal topic removed; practical deletion rule kept. |
| or1 | merge | Has a named person checked the law on explicit consent and on offering a check-in option without biometrics? | pe2 | Alternative check-in now pe2; legal parts removed. |
| x-sens | remove | Has a data protection impact assessment (DPIA, a formal privacy risk check) been done for this tool? | — | Legal topic (privacy assessment) out of scope. |

## fo-4 — AI assistants and agents for the front desk and property management system

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have front-office staff been shown how to use the assistant in daily work? | Unused assistants are the most common failure. | always |
| pe2 | B | People | General manager | Has a supervisor agreed to check what the assistant changes in the booking system? | Changes in bookings affect guests directly. | always |
| sk1 | I | Skills | Department head | Can staff check and undo a change the assistant made in the booking system? | Mistakes must be easy to reverse. | always |
| fi1 | N | Money | Finance | Do you know the add-on or usage fee? | Often charged per user or per action. | always |
| te1 | B | Technology | IT | Can the assistant make changes in your booking system, with its own login? | Its own login shows which changes the AI made. | always |
| da1 | I | Data | Department head | Are your front-desk procedures written down and current? | The assistant answers staff from these procedures. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the front-office staff use this tool, and have they been shown how? | pe1 | Double question cut. |
| pe2 | keep | Is it agreed that a supervisor checks what the AI agents do? | pe2 | Shortened. |
| sk1 | fix | Do the people involved know how to instruct the AI (prompting), and can they check changes it makes in the property management system (PMS)? | sk1 | Prompting part dropped. |
| fi1 | keep | Do you know what the property management system (PMS) add-on or usage fee will cost your hotel? | fi1 | Acronym removed. |
| te1 | keep | Is the AI built into or connected to your property management system (PMS) with rights to make changes, or is this confirmed possible? | te1 | Made specific. |
| da1 | keep | Are your standard operating procedures (SOPs) in digital form, up to date and ready to use? | da1 | Jargon "SOPs" removed. |
| or1 | merge | Have you limited what the AI agents can change? | ACT_LIMITS, ACT_OFF | Same as the limits question from the gate. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Comes from the "acts by itself" gate. |

## fo-5 — Upselling at check-in (desk, kiosk, before arrival)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **when fo5-personal=yes**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **fo5-personal** (custom): Will offers differ for individual guests, based on their profile or past stays?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether offers differ per individual guest.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe2 | N | People | General manager | Do desk staff earn a reward for upgrades they sell? | Staff push offers harder when they share the gain. | always |
| sk1 | I | Skills | Department head | Can desk staff offer an upgrade without making the guest feel pushed? | Pushy upselling at check-in ends up in reviews. | always |
| fi1 | N | Money | Finance | Do you know whether the tool charges commission per upgrade or a subscription? | Commission lowers the gain on every sale. | always |
| te1a | B | Technology | IT | Can the tool see which upgrades are free in your booking system? | Offering a room that is not free annoys guests. | always |
| te1b | N | Technology | IT | Can the tool send offers to guests before arrival by email or message? | Pre-arrival offers sell more than desk offers. | always |
| da1 | I | Data | Department head | Are upgrade and extra prices current in your booking system? | Old prices mean lost revenue or disputes. | always |
| or1 | B | Rules and controls | General manager | Are the price rules for upgrades and extras written down, including lowest prices? | Stops the tool selling your best rooms too cheaply. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the front-office manager be in charge of this tool? | m1 | Owner is must-have 1. |
| pe2 | fix | Are incentives for staff in place? | pe2 | Plain wording. |
| sk1 | fix | Do the people involved know enough about sales technique, and can they read data on offers? | sk1 | Two skills cut to one practical skill. |
| fi1 | keep | Do you know what the commission or subscription will cost your hotel? | fi1 | Shortened. |
| te1 | split | Is the tool linked to room stock in your property management system (PMS) and to a guest messaging channel, or is this confirmed possible? | te1a, te1b | Two links split. |
| da1 | keep | Are available upgrades and prices for extras digital, up to date and ready to use? | da1 | Four-part phrase removed. |
| or1 | keep | Are there written price rules? | or1 | Made specific. |

## fo-6 — Guest risk scoring before arrival (ID, behaviour, past stays)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **always**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **fo6-outside** (custom): Does the score use data from outside your hotel, such as social media or other businesses?
  - Yes → caps at Almost ready; action: Ask an adviser before using outside data to score guests.
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor what data sources the risk score uses.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Does a manager review every flagged booking, with staff, not the score, deciding? | A score can be wrong; a refused guest is a lost guest and a bad review. | always |
| sk1 | I | Skills | Department head | Do staff know what a risk score may never be used for, such as pricing? | Scores used beyond their purpose cause unfair treatment. | always |
| fi1 | N | Money | Finance | Do you know the subscription or fee per check? | Fees per booking checked add up. | always |
| te1 | I | Technology | IT | Is the tool linked to your booking system or booking engine? | It must see bookings before arrival to be useful. | always |
| da1 | I | Data | Department head | Is your past booking and stay history recorded, including problem stays? | The score learns from past problems. | always |
| or1 | B | Rules and controls | General manager | Is it written that no guest is refused because of the score alone? | Automatic refusals cause unfair treatment and complaints. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the front-office manager reviews every flagged booking, and that staff decide, not the score? | pe1 | Kept; core control. |
| sk1 | fix | Can the people involved read a risk score, and do they know what it must not be used for? | sk1 | Two ideas cut to one. |
| fi1 | keep | Do you know what the subscription or fee per check will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is the tool linked to your property management system (PMS) or booking engine, and to ID scanning, or is this confirmed possible? | te1 | ID scanning part dropped. |
| da1 | keep | Is booking and stay history digital, up to date and ready to use? | da1 | Four-part phrase removed. |
| da2 | remove | Has a named person checked what the law requires for ID data? | — | Legal topic (ID data rules) out of scope. |
| or1 | keep | Are there written rules on when a flag may lead to refusing a guest, with no automatic refusals? | or1 | Shortened. |
| x-sens | remove | Has a data protection impact assessment (DPIA, a formal privacy risk check) been done for this tool? | — | Legal topic (privacy assessment) out of scope. |

## fo-7 — AI avatar or hologram receptionist (check-in kiosk)

Review verdict: **Wrong** → treatment: **full rewrite**  
Sensitive flag: **when fo7-camera=yes**

**Gates ("How it works")**

- **AUTO_GUEST** (automatic, not asked): applies G_GUEST=guests → adds GUEST_FACTS, GUEST_STAFF
- **AUTO_ACT** (automatic, not asked): applies G_ACT=acts → adds ACT_LIMITS, ACT_OFF
- **fo7-camera** (custom): Does the kiosk camera recognise faces or read facial expressions?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the kiosk camera does.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the front-office lead agreed to watch the kiosk every day and help stuck guests? | Kiosks fail quietly; someone must notice. | always |
| sk1 | I | Skills | Department head | Can your team update the avatar's answers and review its conversations? | The avatar repeats old answers until someone fixes them. | always |
| fi1 | N | Money | Finance | Do you know the kiosk hardware and monthly software cost? | Hardware is a one-off cost; software is monthly. | always |
| te1a | B | Technology | IT | Can the kiosk encode room key cards? | Without keys, the guest still queues at the desk. | always |
| te1b | B | Technology | IT | Can the kiosk create and update check-ins in your booking system? | Check-ins outside the booking system cause double work. | always |
| da1 | B | Data | Department head | Are your answers to common guest questions and check-in rules written down? | The avatar can only answer what it has been given. | always |
| x-hw | B | Money | Owner | Is the money approved to buy or lease, install and maintain the kiosk? | A kiosk without a maintenance budget breaks and stays broken. | always |
| n1 | I | Rules and controls | Department head | Does the avatar tell guests at the start that they are talking to a computer? | Guests who think they talked to a person feel misled. | always |
| GUEST_FACTS | B | Data | Department head | Has a person checked the facts the tool gives guests, such as prices and opening times? | Guests act on what the tool tells them. | always |
| GUEST_STAFF | B | People | Department head | Can guests reach a staff member at any time while using the tool? | Guests with problems must never be stuck with a machine. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | always |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the front-office lead monitors the kiosk, and staff take over when a guest asks? | pe1 | Hand-over part moved to gate blocker. |
| sk1 | keep | Can the people involved keep the avatar's knowledge base up to date and review its conversations? | sk1 | Jargon removed. |
| fi1 | keep | Do you know what the kiosk hardware plus software subscription will cost your hotel? | fi1 | Shortened. |
| te1 | split | Do you have the kiosk, a key-card encoder and a two-way link to your property management system (PMS), or is this confirmed possible? | te1a, te1b | Three items split into two. |
| da1 | keep | Are your hotel FAQs (common guest questions) and check-in rules complete, current, digital and ready to use? | da1 | Four-part phrase removed. |
| or1 | merge | Are rules for handing a guest over to a person written down, and can guests always reach staff? | GUEST_STAFF | Reach-staff blocker now comes from the guest-facing rule. |
| x-hw | keep | Is a capital budget approved for the equipment, covering buying or leasing, installing and maintaining it? | x-hw | Plain wording. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Kiosk acts by itself; limits and switch-off applied automatically. |

## fo-8 — Lost-and-found logging and matching guest claims

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the front-office or housekeeping supervisor agreed to own the found-items log? | Items get lost twice without one owner. | always |
| sk1a | I | Skills | Department head | Can staff photograph and log found items in the app? | Logging must be quick or staff skip it. | always |
| sk1b | B | Skills | Department head | Does a person check every match before an item is released? | Releasing an item to the wrong person is costly. | always |
| fi1 | N | Money | Finance | Do you know whether you pay per hotel or a fee on each item sent back? | Some providers earn on return shipping. | always |
| te1 | I | Technology | IT | Do staff have phones or tablets to log items where they find them? | Logging later means details get lost. | always |
| da1 | I | Data | Department head | Are found items logged with photo, place and time? | Matches depend on these details. | always |
| or1a | I | Rules and controls | General manager | Is it decided how long photos and guest claims are kept? | Keeping data forever adds risk with no gain. | always |
| or1b | I | Rules and controls | General manager | Is one person named to confirm matches and release items? | A named person stops items going to the wrong guest. | always |
| n1 | N | Rules and controls | Finance | Is it agreed what happens to items nobody claims? | Unclaimed items pile up and cause disputes. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the front-office or housekeeping supervisor owns the log of found items? | pe1 | Shortened. |
| sk1 | split | Can the people involved photograph and log items in the app, and check the suggested description and any match before an item is released? | sk1a, sk1b | Two ideas split. |
| fi1 | keep | Do you know what it will cost your hotel: a subscription per hotel or a fee on return shipping, depending on the provider? | fi1 | Shortened. |
| te1 | keep | Do staff have phones or tablets for this, with an optional link to your property management system (PMS), or is this confirmed possible? | te1 | Optional link dropped. |
| da1 | fix | Are photos of found items with place and time, and guest claims with name, address and stay details, digital and up to date? | da1 | Guest claim part merged into or1. |
| or1 | split | Are these written down: how long photos and claims are kept, who confirms a match and releases items, and a data-processing agreement with the provider? | or1a, or1b | Triple question split; contract item removed. |

# Guest Experience & Customer Service

## gx-1 — Review and guest-feedback analysis (including positive or negative tone)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **when gx1-staff=yes**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.
- **gx1-staff** (custom): Will results name individual staff members mentioned in reviews?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Decide whether review results will name individual staff.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the guest-experience or quality manager agreed to act on the results each month? | Analysis without action changes nothing for guests. | always |
| sk1 | I | Skills | Department head | Can department heads turn review themes into concrete fixes? | The value is in fixing the recurring complaint. | always |
| fi1 | N | Money | Finance | Do you know the cost of the online reputation tool? | Often priced per hotel and per review site. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Can the tool collect reviews from the main review sites and your guest surveys? | Missing sources give a one-sided picture. | always |
| da1 | I | Data | Department head | Do you get enough reviews and survey answers each month to see patterns? | A handful of reviews shows noise, not trends. | always |
| or1 | B | Rules and controls | General manager | Is there a written rule for who handles an urgent complaint flagged by the tool, and how fast? | A flagged safety or hygiene complaint needs action the same day. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the guest-experience or quality manager acts on results? | pe1 | Made specific. |
| sk1 | fix | Can the people involved turn the findings into actions? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the online reputation tool subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Has it been confirmed that you can connect review sites and guest surveys? | te1 | Plain wording. |
| da1 | fix | Are reviews and survey responses digital, up to date and ready to use? | da1 | Readiness phrase replaced with the real question: volume. |
| or1 | keep | Is there a written rule for handling urgent complaints? | or1 | Made specific. |

## gx-2 — AI chat assistant for guests in several languages, before booking and during the stay (website, WhatsApp, booking-site inbox)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **AUTO_GUEST** (automatic, not asked): applies G_GUEST=guests → adds GUEST_FACTS, GUEST_STAFF

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1a | I | People | General manager | Has the guest-service lead agreed to read a sample of conversations every week? | Weekly reading finds wrong answers before guests complain. | always |
| pe1b | B | People | General manager | Do staff take over quickly when the assistant hands a guest to them? | A hand-over that nobody picks up is worse than no assistant. | always |
| sk1 | I | Skills | Department head | Can your team update the assistant's answers when menus, prices or policies change? | The assistant repeats old answers until someone updates them. | always |
| fi1 | N | Money | Finance | Do you know the price, per hotel or per conversation? | Per-conversation pricing rises in high season. | always |
| te1a | B | Technology | IT | Is the assistant connected to the channels guests use, such as your website and WhatsApp? | Guests write where they already are. | always |
| te1b | I | Technology | IT | Can the assistant pass requests and bookings into your booking system? | Requests typed in again by hand get lost. | always |
| da1 | B | Data | Department head | Are your answers to common guest questions and hotel policies written down and current? | The assistant answers from this; gaps become made-up answers. | always |
| or1 | I | Rules and controls | General manager | Does the assistant tell guests at the start that they are chatting with a computer? | Guests who find out later feel misled. | always |
| or2 | B | Rules and controls | General manager | Is it written when the assistant must pass a guest to a staff member, for example complaints? | Complaints and emergencies need a person at once. | always |
| n1 | I | Data | Department head | Does the assistant answer in the main languages your guests speak? | Many languages is the main reason to use it. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |
| GUEST_FACTS | B | Data | Department head | Has a person checked the facts the tool gives guests, such as prices and opening times? | Guests act on what the tool tells them. | always |
| GUEST_STAFF | B | People | Department head | Can guests reach a staff member at any time while using the tool? | Guests with problems must never be stuck with a machine. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | split | Is it agreed that the guest-service lead monitors conversations, and staff take over when the assistant passes a guest to them? | pe1a, pe1b | Two ideas split. |
| sk1 | fix | Can the people involved keep the knowledge base (the answers the tool uses) up to date and review written records of conversations? | sk1 | Review part moved to pe1. |
| fi1 | keep | Do you know what the subscription will cost your hotel, per property or per conversation? | fi1 | Shortened. |
| te1 | split | Do you have messaging channels and a link to your property management system (PMS) for bookings and requests, or has your provider confirmed this is possible? | te1a, te1b | Two links split; acronyms removed. |
| da1 | fix | Are a complete, current hotel FAQ (frequently asked questions) and policies, and also conversation records, digital, up to date and ready to use? | da1 | Four-part phrase removed; conversation records not needed to start. |
| or1 | rewrite | Is it agreed how you will tell guests they are dealing with AI? | or1 | Legal framing removed; practical guest-trust question kept. |
| or2 | keep | Are there written rules for when the tool passes a guest to a staff member? | or2 | Example added. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Comes from the "acts by itself" gate. |

## gx-3 — Guest review replies drafted by AI

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the general manager or a named manager agreed to approve replies? | Public replies speak for the hotel. | always |
| sk1 | I | Skills | Department head | Can the person approving edit replies so they do not sound standard? | Copy-paste replies hurt the hotel's image. | always |
| fi1 | N | Money | Finance | Have you checked whether your online reputation tool already includes this? | Often included at no extra cost. | hidden when G_PAID=yes |
| te1 | I | Technology | IT | Do you have logins to reply on the main review sites? | Without access you still copy and paste by hand. | always |
| da1 | N | Data | Department head | Is your brand's tone of voice described in a few written lines? | The tool copies the tone you describe. | always |
| or1 | B | Rules and controls | General manager | Does a person approve each reply before it is posted? | One wrong public reply can go viral. | always |
| n1 | I | Rules and controls | General manager | Is it agreed which replies a manager must write personally, such as serious complaints? | Serious complaints need a real, personal answer. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the manager approves replies? | pe1 | Made specific. |
| sk1 | keep | Can the people involved adjust the tone of replies and make sure they do not sound standard and impersonal? | sk1 | Shortened. |
| fi1 | keep | Have you checked whether you already pay for this (team's note: often included in your online-reputation tool)? | fi1 | Shortened. |
| te1 | keep | Do you have access to the review platforms, or has your provider confirmed this is possible? | te1 | Plain wording. |
| da1 | fix | Are your reviews and your brand's tone of voice digital, up to date and ready to use? | da1 | Reviews part dropped (tool collects them). |
| or1 | keep | Is a rule that a person approves each reply before it is posted in place and written down? | or1 | Plain wording. |

## gx-4 — Guest personalisation using one combined guest profile

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **always**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the guest-experience or guest-database lead agreed to own guest profiles? | Profiles go stale without an owner. | always |
| sk1 | I | Skills | Department head | Can staff use guest preferences without making guests feel watched? | Personal touches turn creepy when overdone. | always |
| fi1 | N | Money | Finance | Do you know the cost of the guest-profile tool and the project to connect it? | Connecting systems usually costs more than the licence. | always |
| te1 | B | Technology | IT | Can your booking, restaurant, spa and messaging systems feed one guest profile? | A profile missing half the stays is not a profile. | always |
| da1 | B | Data | Department head | Are duplicate guest records merged so each guest has one profile? | Duplicates split the guest's history. | always |
| or1 | I | Rules and controls | General manager | Can a guest ask to see or delete their preferences, and is someone named to do it? | Guests trust hotels that let them control their profile. | always |
| n1 | N | Skills | Department head | Have you listed which preferences staff will actually use, such as pillow type or allergies? | Collecting data no one uses adds risk and no value. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the customer relationship management (CRM) lead or the guest-experience lead be in charge of this tool? | pe1 | Acronym removed. |
| sk1 | keep | Can the people involved use guest profiles without going too far with personalisation? | sk1 | Plain wording. |
| fi1 | keep | Do you know what a customer relationship management (CRM) or customer data platform (CDP) subscription, and the project to connect it, will cost your hotel? | fi1 | Acronyms removed. |
| te1 | keep | Do you have, or has your provider confirmed as possible, one combined guest profile across property management (PMS), point-of-sale (POS), spa, customer relationship (CRM) and messaging systems? | te1 | Acronyms removed. |
| da1 | fix | Is a single profile for each guest, with preferences and consent recorded, digital, up to date and ready to use? | da1 | Consent part removed (legal). |
| or1 | rewrite | Has a named person checked the GDPR (EU data protection law) legal basis and consent needed for building guest profiles? | or1 | Legal framing removed; practical guest-request process kept. |

## gx-5 — Digital concierge and recommendations during the stay

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **AUTO_GUEST** (automatic, not asked): applies G_GUEST=guests → adds GUEST_FACTS, GUEST_STAFF

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the concierge or guest-service lead agreed to own the recommendations? | Recommendations need a local expert. | always |
| sk1 | I | Skills | Department head | Can that person choose and update the places the tool recommends? | A closed restaurant recommended to a guest reflects on you. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost and any commission on bookings? | Commission can make some partners appear first. | always |
| te1 | I | Technology | IT | Can guests book hotel services, like spa or dinner, through the tool? | Booking in the same chat is the main value. | always |
| da1 | B | Data | Department head | Are your menus, opening hours and local partner details current? | Wrong opening hours send guests to closed doors. | always |
| or1 | I | Rules and controls | General manager | Does the tool tell guests at the start that they are using a computer assistant? | Guests feel misled if they find out later. | always |
| or2 | N | Rules and controls | General manager | Have you agreed with local partners what they pay or offer for recommendations? | Guests should get the best place, not the highest payer. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |
| GUEST_FACTS | B | Data | Department head | Has a person checked the facts the tool gives guests, such as prices and opening times? | Guests act on what the tool tells them. | always |
| GUEST_STAFF | B | People | Department head | Can guests reach a staff member at any time while using the tool? | Guests with problems must never be stuck with a machine. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the concierge or guest-service lead be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Can the people involved choose and maintain the recommendations the tool gives? | sk1 | Shortened. |
| fi1 | keep | Do you know what the subscription, and any commission on bookings, will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have messaging or an app that can book hotel services, or has your provider confirmed this is possible? | te1 | Plain wording. |
| da1 | keep | Are your menus, opening hours and local partner details digital and ready to use, and are they kept up to date? | da1 | Two parts merged into one. |
| or1 | rewrite | Is it agreed how you will tell guests they are dealing with AI? | or1 | Legal framing removed. |
| or2 | fix | Are there written partner terms? | or2 | Made specific. |

## gx-6 — In-room voice assistant

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **when gx6-mic=no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **AUTO_GUEST** (automatic, not asked): applies G_GUEST=guests → adds GUEST_FACTS, GUEST_STAFF
- **gx6-mic** (custom): Does the device listen all the time, or only after a wake word or button?
  - Only after a wake word or button → no change
  - Listens all the time → raises sensitive flag
  - Don't know yet → caps at Almost ready; action: Ask the vendor when the device listens.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the rooms division or IT lead agreed to own the in-room devices? | Devices in hundreds of rooms need one owner. | always |
| pe2 | B | People | General manager | Has housekeeping agreed to carry out requests the assistant receives? | A request nobody delivers is worse than no assistant. | always |
| sk1 | N | Skills | Department head | Can IT set up, reset and update the devices between guests? | Devices must be reset so the next guest starts fresh. | always |
| te1a | B | Technology | IT | Is in-room Wi-Fi strong enough for a voice device in every room? | Weak Wi-Fi makes the assistant fail in some rooms. | always |
| te1b | I | Technology | IT | Can the assistant send requests to your task tool and booking system? | Requests must reach staff without retyping. | always |
| da1 | I | Data | Department head | Is your list of guest services and what each device can control written down? | The assistant can only offer what it knows. | always |
| or1 | B | Rules and controls | General manager | Can guests switch the device off or have it removed from their room? | Many guests distrust a microphone in their room. | always |
| x-hw | B | Money | Owner | Is the money approved to buy, install and maintain a device in every room? | Hardware for every room is a large one-off cost. | always |
| n1 | I | Rules and controls | Department head | Does the device tell guests it is a computer assistant when they first use it? | Guests should know what they are talking to. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |
| GUEST_FACTS | B | Data | Department head | Has a person checked the facts the tool gives guests, such as prices and opening times? | Guests act on what the tool tells them. | always |
| GUEST_STAFF | B | People | Department head | Can guests reach a staff member at any time while using the tool? | Guests with problems must never be stuck with a machine. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the rooms division lead or the IT lead be in charge of this tool? | pe1 | Shortened. |
| pe2 | keep | Is it agreed that housekeeping carries out the guests' requests? | pe2 | Shortened. |
| sk1 | keep | Do the people involved know enough about setting up and managing the devices? | sk1 | Made specific. |
| fi1 | merge | Do you know what the devices for each room plus a subscription will cost your hotel? | x-hw | Device cost merged into the equipment budget question. |
| te1 | split | Do you have in-room Wi-Fi and links to your property management system (PMS), task tool and room controls, or has your provider confirmed this is possible? | te1a, te1b | Four links cut to two. |
| da1 | keep | Are your list of guest services and the room-control setup (which controls in each room the assistant operates) digital, up to date and ready to use? | da1 | Plain wording. |
| or1 | rewrite | Are a privacy notice and an opt-out (a way for guests to say no) for in-room microphones in place and written down? | or1 | Legal notice removed; practical opt-out kept. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |
| x-sens | remove | Has a data protection impact assessment (DPIA, a formal check of privacy risks) been done for this tool? | — | Legal topic (privacy assessment) out of scope. |

# Food & Beverage service

## fb-1 — AI for event and banqueting sales (enquiries, proposals, contracts)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the events or banqueting sales manager agreed to review every AI draft? | Event proposals are large and binding. | always |
| sk1 | I | Skills | Department head | Can the events team check menu prices and room set-ups in a proposal? | Wrong set-ups and prices are the costly errors. | always |
| fi1 | N | Money | Finance | Do you know the cost of the sales-platform add-on? | Usually an add-on to your events system. | always |
| te1 | B | Technology | IT | Can the tool read your events calendar and receive enquiries from your inbox? | Offering a booked room creates a double booking. | always |
| da1 | B | Data | Department head | Are your event spaces, menus and costings recorded and current? | Drafts use these facts and prices. | always |
| or1 | B | Rules and controls | General manager | Does a person approve every contract before it is sent? | A sent contract binds the hotel. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the events or banqueting sales manager be in charge of this tool? | pe1 | Made specific. |
| sk1 | fix | Do the people involved know enough about pricing proposals and checking contracts? | sk1 | Two skills cut to one. |
| fi1 | keep | Do you know what the add-on to your sales platform will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a sales and catering system and an inbox, or has your provider confirmed this is possible? | te1 | Plain wording. |
| da1 | keep | Are your list of event spaces, menus and costings digital, up to date and ready to use? | da1 | Shortened. |
| or1 | keep | Is a rule that a person approves contracts in place and written down? | or1 | Kept. |

## fb-2 — Room-service and restaurant or bar ordering through chat or voice assistants

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **AUTO_GUEST** (automatic, not asked): applies G_GUEST=guests → adds GUEST_FACTS, GUEST_STAFF
- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe2 | B | People | General manager | Do restaurant and bar staff receive the orders the assistant takes? | An order nobody receives is a hungry, angry guest. | always |
| sk1 | I | Skills | Department head | Can staff handle special requests the assistant cannot, such as changes to a dish? | Unusual orders are common in room service. | always |
| fi1 | N | Money | Finance | Do you know the cost of the messaging or voice add-on? | Usually a monthly add-on. | always |
| te1 | B | Technology | IT | Do orders go straight into your till system and kitchen screens? | Retyping orders brings back errors. | always |
| da1 | B | Data | Department head | Are your menus, prices and allergen details current in one place? | The assistant quotes them to guests. | always |
| or1 | B | Rules and controls | General manager | Does the kitchen check allergen details before the assistant uses them? | A wrong allergen answer can make a guest seriously ill. | always |
| n1 | I | Rules and controls | Department head | Does the assistant tell guests they are ordering through a computer? | Guests who think they spoke to staff feel misled. | always |
| GUEST_FACTS | B | Data | Department head | Has a person checked the facts the tool gives guests, such as prices and opening times? | Guests act on what the tool tells them. | always |
| GUEST_STAFF | B | People | Department head | Can guests reach a staff member at any time while using the tool? | Guests with problems must never be stuck with a machine. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the food and beverage (F&B) manager be in charge of this tool? | m1 | Owner is must-have 1. |
| pe2 | keep | Is it agreed that the staff in the restaurants and bars receive the orders? | pe2 | Shortened. |
| sk1 | fix | Can the people involved handle orders that do not fit the usual process? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the add-on to your messaging or voice platform will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a link to your point-of-sale system (POS) and kitchen display screens, or has your provider confirmed this is possible? | te1 | Acronym removed. |
| da1 | keep | Are your current menus, prices and allergen information digital, up to date and ready to use? | da1 | Four-part phrase removed. |
| or1 | fix | Are checks that allergen information is correct in place and written down? | or1 | Kept as practical safety, no legal reference. |

## fb-3 — Improving menus and food and drink prices (menu engineering)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have the F&B manager and the chef agreed to review menu results together? | Price and recipe decisions need both. | always |
| sk1 | N | Skills | Department head | Can the team judge dishes by both popularity and profit? | This is the core of menu engineering. | always |
| fi1 | N | Money | Finance | Do you know the cost of the analysis add-on for your till system? | Usually an add-on to the till system. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Does your till system record sales for each menu item? | Without item sales there is nothing to analyse. | always |
| da1 | B | Data | Department head | Do you have current recipe costs for every dish? | Profit per dish needs the cost per dish. | always |
| or1 | I | Rules and controls | General manager | Does the chef approve every menu or price change the tool suggests? | The tool suggests; the chef knows the kitchen. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the food and beverage (F&B) manager and the chef be in charge of this tool? | pe1 | Acronym kept once after full name in must-haves; shortened. |
| sk1 | fix | Do the people involved know the basics of menu engineering (judging dishes by popularity and profit)? | sk1 | Jargon removed. |
| fi1 | keep | Do you know what an analytics add-on to your point-of-sale system (POS) will cost your hotel? | fi1 | Acronym removed. |
| te1 | keep | Do you have a point-of-sale system (POS) that records sales for each menu item, or has your provider confirmed this is possible? | te1 | Acronym removed. |
| da1 | keep | Are sales for each menu item and recipe costs digital, up to date and ready to use? | da1 | Shortened. |
| or1 | rewrite | Are there written limits on what the tool may set by itself, and on who can overrule it? | or1 | Copied "limits" question replaced; tool recommends, it does not set. |

## fb-4 — QR code or mobile ordering, with AI suggestions of extra items and automatic menu price changes

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **AUTO_GUEST** (automatic, not asked): applies G_GUEST=guests → adds GUEST_FACTS, GUEST_STAFF
- **fb4-autoprice** (custom): Will menu prices change automatically, for example by time of day or demand?
  - Yes, prices change automatically → adds ACT_LIMITS, ACT_OFF
  - No, prices only change when staff change them → no change
  - Don't know yet → caps at Almost ready; action: Decide whether menu prices may change automatically.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the restaurant or bar manager agreed to own the mobile ordering menu? | The digital menu must change when the kitchen runs out. | always |
| sk1 | N | Skills | Department head | Can the manager read which suggested extras guests actually add? | Shows whether suggestions earn money or annoy guests. | always |
| fi1 | N | Money | Finance | Do you know the subscription or fee per order? | Per-order fees eat into small orders. | always |
| te1 | B | Technology | IT | Do mobile orders go straight into your till system and kitchen? | Retyping orders brings back errors. | always |
| da1 | B | Data | Department head | Are your digital menus, prices and allergen details current? | Guests order from what they see. | always |
| or1 | B | Rules and controls | General manager | Is the price a guest sees when ordering always the price they pay? | A higher bill than the menu showed causes disputes. | fb4-autoprice=yes |
| n1 | I | Rules and controls | Department head | Are there written lowest and highest prices for each dish? | Stops automatic changes from going too far. | fb4-autoprice=yes |
| GUEST_FACTS | B | Data | Department head | Has a person checked the facts the tool gives guests, such as prices and opening times? | Guests act on what the tool tells them. | always |
| GUEST_STAFF | B | People | Department head | Can guests reach a staff member at any time while using the tool? | Guests with problems must never be stuck with a machine. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | fb4-autoprice=yes |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | fb4-autoprice=yes |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the restaurant or bar (outlet) manager be in charge of this tool? | pe1 | Jargon "outlet" removed. |
| sk1 | keep | Can the people involved read the data on suggested extra items (upselling)? | sk1 | Jargon removed. |
| fi1 | keep | Do you know what the subscription or fee per order will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a link to your point-of-sale system (POS), or has your provider confirmed this is possible? | te1 | Acronym removed. |
| da1 | fix | Are your menus, prices and item details digital, up to date and ready to use? | da1 | Allergens added: guests order without staff. |
| or1 | fix | Are there written rules for changing prices? | or1 | Vague rule made concrete. |

## fb-5 — Robots that deliver and serve (amenities, room service, restaurants and bars)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **AUTO_ACT** (automatic, not asked): applies G_ACT=acts → adds ACT_LIMITS, ACT_OFF
- **fb5-guest** (custom): Will the robots move in areas where guests are?
  - Yes → no change
  - No, back-of-house only → no change
  - Don't know yet → caps at Almost ready; action: Decide whether the robots will run in guest areas.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe2 | B | People | General manager | Have staff agreed to load the robots and watch over their trips? | Robots still need people at both ends. | always |
| sk1 | I | Skills | Department head | Can staff restart a stuck robot and fix simple problems? | A stuck robot blocks corridors and orders. | always |
| te1a | B | Technology | IT | Is Wi-Fi strong on every floor and route the robots use? | Robots stop where Wi-Fi drops. | always |
| te1b | B | Technology | IT | Can the robots call lifts and open doors on their own? | Without lifts and doors, robots serve one floor only. | always |
| da1 | I | Data | Department head | Do you have current floor maps for every area the robots will use? | Robots navigate from these maps. | always |
| or1a | B | Rules and controls | General manager | Are there written safety rules for robots near guests, children and stairs? | A robot hitting a guest is a serious incident. | always |
| or1b | I | Rules and controls | General manager | Have staff been told what the robots will and will not do? | Staff fear robots replace them unless told. | always |
| x-hw | B | Money | Owner | Is the money approved to buy or lease, and maintain, the robots? | Robots are a large one-off cost plus servicing. | always |
| n1 | B | Rules and controls | Department head | Do the robots slow down and give way to guests in corridors and lifts? | Guests, children and wheelchairs share the same space. | fb5-guest=yes |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | always |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the operations lead be in charge of this tool? | m1 | Owner is must-have 1. |
| pe2 | keep | Is it agreed that staff load the robots and watch over them? | pe2 | Shortened. |
| sk1 | keep | Do the people involved know enough about running the robots and fixing simple problems? | sk1 | Shortened. |
| fi1 | merge | Do you know what buying or leasing the robots plus maintenance will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | split | Do you have Wi-Fi coverage and connections that let robots use lifts and doors, or has your provider confirmed this is possible? | te1a, te1b | Two needs split. |
| da1 | keep | Are floor maps digital, up to date and ready to use? | da1 | Shortened. |
| or1 | split | Are guest-safety rules and communication to staff in place and written down? | or1a, or1b | Two ideas split. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

## fb-6 — Restaurant table bookings: AI that answers calls and AI table planning

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.
- **AUTO_GUEST** (automatic, not asked): applies G_GUEST=guests → adds GUEST_FACTS, GUEST_STAFF

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | I | Skills | Department head | Can the restaurant manager set the rules for allocating tables? | The tool fills tables by the rules you give it. | always |
| fi1 | N | Money | Finance | Do you know whether you pay per booking or a subscription? | Per-booking fees rise with busy seasons. | always |
| te1a | B | Technology | IT | Can the tool answer calls from your restaurant phone line? | It must take the calls you now miss. | always |
| te1b | B | Technology | IT | Can the tool write bookings into your table-booking system? | Bookings outside the system cause double bookings. | always |
| da1 | B | Data | Department head | Are your table plan, opening hours and booking policies current? | The tool books against these. | always |
| or1 | I | Rules and controls | General manager | Does the tool tell callers at the start that they are speaking to a computer? | Callers who find out later feel misled. | always |
| n1 | I | Rules and controls | Department head | Does the tool ask callers about allergies or special needs and pass them on? | The kitchen must know before the guest arrives. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |
| GUEST_FACTS | B | Data | Department head | Has a person checked the facts the tool gives guests, such as prices and opening times? | Guests act on what the tool tells them. | always |
| GUEST_STAFF | B | People | Department head | Can guests reach a staff member at any time while using the tool? | Guests with problems must never be stuck with a machine. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the restaurant manager be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | keep | Can the people involved set the rules for allocating tables? | sk1 | Shortened. |
| fi1 | keep | Do you know what this will cost your hotel, whether paid per use or by subscription? | fi1 | Shortened. |
| te1 | split | Do you have a phone system and a table-management system, or has your provider confirmed this is possible? | te1a, te1b | Two systems split. |
| da1 | keep | Are your table plan, opening hours and policies digital, up to date and ready to use? | da1 | Four-part phrase removed. |
| or1 | rewrite | Is it agreed how you will tell callers they are dealing with AI? | or1 | Legal framing removed. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Comes from the "acts by itself" gate. |

# Housekeeping

## hk-1 — Staff tasks and messages in several languages (voice or chat turned into tasks, translation)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_LINK** (library): Does the tool need to connect to your hotel systems, such as booking, till or accounting?
  - Yes → a Doesn't apply answer on m4 becomes Don't know yet, with a note
  - No, it works on its own → hides Technology questions
  - Don't know yet → caps at Almost ready; action: Ask the vendor which hotel systems the tool must connect to.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have housekeeping supervisors agreed to act on tasks the app creates? | Tasks are useless if no one picks them up. | always |
| sk1 | I | Skills | Department head | Can supervisors show the app to staff who speak different languages? | Many housekeeping teams share no common language. | always |
| fi1 | N | Money | Finance | Do you know the monthly cost per hotel? | Usually priced per hotel or per user. | always |
| te1 | B | Technology | IT | Does the task app receive room status from your booking system? | Tasks must follow check-outs and arrivals. | hidden when G_LINK=no |
| da1 | B | Data | Department head | Is the list of rooms and public areas in the app complete? | Tasks need exact locations. | always |
| or1 | I | Rules and controls | General manager | Have you checked that translations of safety messages are correct? | A wrong safety instruction can hurt someone. | always |
| n1 | N | Skills | Staff who use it | Do all housekeeping staff have a phone or device to use the app? | No device, no tasks. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the housekeeping supervisors act on tasks? | pe1 | Shortened. |
| sk1 | fix | Can the people involved use the app and explain it to staff who speak different languages? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the operations-platform subscription per property will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a task or operations platform linked to your property management system (PMS), or has your provider confirmed this is possible? | te1 | Acronym removed. |
| da1 | keep | Are your lists of rooms and locations digital, up to date and ready to use? | da1 | Four-part phrase removed. |
| or1 | rewrite | Are there written rules on staff data and staff messaging? | or1 | Vague staff-data rule replaced with a practical check. |

## hk-2 — Self-driving floor-cleaning robots

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **AUTO_ACT** (automatic, not asked): applies G_ACT=acts → adds ACT_LIMITS, ACT_OFF
- **hk2-guest** (custom): Will the robots clean while guests are around?
  - Yes → no change
  - No, only when areas are closed or empty → no change
  - Don't know yet → caps at Almost ready; action: Decide when the robots will clean.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | I | Skills | Department head | Can staff empty, charge and do simple maintenance on the robots? | Robots left uncharged clean nothing. | always |
| te1a | B | Technology | IT | Is Wi-Fi strong in every area the robots will clean? | Robots stop where Wi-Fi drops. | always |
| te1b | I | Technology | IT | For several floors, can the robots use the lift? | Otherwise staff carry them between floors. | always |
| da1 | I | Data | Department head | Are floor maps and cleaning times written down for each area? | Robots need to know where and when to clean. | always |
| or1 | I | Rules and controls | General manager | Is there a written plan for what staff will do with the time saved? | Without a plan, savings disappear. | always |
| x-hw | B | Money | Owner | Is the money approved to buy or lease, and service, the robots? | Robots are a large one-off cost. | always |
| n1 | B | Rules and controls | Department head | Do the robots stop safely when a guest, child or bag is in the way? | Robots in busy lobbies can trip guests. | hk2-guest=yes |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | always |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the housekeeping manager be in charge of this tool? | m1 | Owner is must-have 1. |
| pe2 | merge | Is it agreed that staff move to other tasks? | or1 | Same as the time-saved plan. |
| sk1 | keep | Do the people involved know enough about handling the robots and simple maintenance? | sk1 | Shortened. |
| fi1 | merge | Do you know what buying or leasing the robots plus servicing will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | split | Do you have Wi-Fi, a lift connection (for hotels with several floors) and a central management system, or has your provider confirmed this is possible? | te1a, te1b | Three items cut to two. |
| da1 | keep | Are floor maps and cleaning schedules digital, up to date and ready to use? | da1 | Shortened. |
| or1 | keep | Is there a written plan for how staff will use the time saved? | or1 | Kept. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

## hk-3 — Linen and amenity forecasting, or linen tracking with RFID (radio) tags

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **hk3-type** (custom): Which version are you planning?
  - Forecasting linen and amenity needs only → no change
  - Tracking linen with radio tags (RFID) → no change
  - Don't know yet → caps at Almost ready; action: Decide whether you need forecasting only, or tag tracking.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the housekeeping or laundry manager agreed to own linen stock? | Linen losses are a big hidden cost. | always |
| sk1 | I | Skills | Department head | Can that person use forecasts to set how much stock to keep? | Too little linen delays rooms; too much ties up money. | always |
| fi1 | N | Money | Finance | Do you know the cost of tags, readers and the subscription? | Tags are needed for every linen item. | hk3-type=rfid |
| te1 | B | Technology | IT | Are tag readers available at the laundry and linen rooms? | Tags are useless without readers where linen moves. | hk3-type=rfid |
| da1a | B | Data | Department head | Does the tool receive your occupancy forecast? | Linen needs follow occupancy. | always |
| da1b | I | Data | Department head | Do you count linen and amenities at least monthly? | Forecasts need a correct starting count. | always |
| or1 | N | Rules and controls | General manager | Is your laundry supplier ready to change deliveries based on forecasts? | Savings come only if deliveries change. | always |
| x-hw | B | Money | Owner | Is the money approved for tags, readers and installing them? | A one-off cost for every linen item. | hk3-type=rfid |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the housekeeping or laundry manager be in charge of this tool? | pe1 | Shortened. |
| sk1 | fix | Can the people involved read forecasts of par levels (the stock you should keep on hand)? | sk1 | Jargon "par levels" removed. |
| fi1 | fix | Do you know what RFID (radio-frequency identification) tags and readers, a one-off equipment cost, plus a subscription will cost your hotel? | fi1 | Shown only for tag tracking. |
| te1 | fix | Do you have RFID (radio-frequency identification) readers and a link to the laundry and your property management system (PMS), or has your provider confirmed this is possible? | te1 | Shown only for tag tracking. |
| da1 | split | Are your occupancy forecast and linen counts digital, up to date and ready to use? | da1a, da1b | Two items split. |
| or1 | fix | Are changes to supplier or laundry contracts in place and written down? | or1 | Plain wording. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Shown only for tag tracking. |

## hk-4 — Cleaning and room status based on sensors that detect if a room is occupied

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | I | Skills | Department head | Can supervisors change the cleaning order when sensors show a room is empty? | The saving comes from cleaning rooms while guests are out. | always |
| te1 | B | Technology | IT | Does sensor or door-lock data reach the housekeeping app? | Staff must see room status on their phone. | always |
| da1 | I | Data | Department head | Have you tested that the sensors show correctly when a room is empty? | Entering an occupied room embarrasses guest and staff. | always |
| or1 | I | Rules and controls | General manager | Have you decided how guests are told the room has presence sensors? | Guests who discover sensors themselves feel watched. | always |
| x-hw | B | Money | Owner | Is the money approved to buy and install sensors in the rooms? | Sensors in every room are a one-off cost. | hidden when G_PAID=yes |
| n1 | B | Rules and controls | Department head | Will staff still knock and announce before entering, whatever the sensor shows? | Sensors can be wrong; knocking protects guest privacy. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the housekeeping manager be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | keep | Can the people involved adjust cleaning plans based on sensor data? | sk1 | Made concrete. |
| fi1 | merge | Do you know what the sensors or guest room management system (GRMS) equipment, a one-off equipment cost, will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | keep | Do you have guest room management system (GRMS) or door-lock data linked to the housekeeping app, or has your provider confirmed this is possible? | te1 | Acronym removed. |
| da1 | fix | Is room status from sensors digital, up to date and ready to use? | da1 | Readiness phrase replaced with a test. |
| or1 | fix | Is there a written privacy notice for guests about sensors that detect whether a room is occupied? | or1 | Legal "privacy notice" framing removed; practical guest information kept. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

## hk-5 — Room inspection with image recognition (computer vision)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1a | I | People | General manager | Have supervisors agreed to photograph each room after inspection? | No photos, no analysis. | always |
| pe1b | I | People | General manager | Has the housekeeping manager agreed to review the problems the tool flags? | Flags need a follow-up. | always |
| sk1 | N | Skills | Department head | Can supervisors take photos the same way every time? | Different angles confuse the tool. | always |
| fi1 | N | Money | Finance | Do you know the app subscription cost? | Usually priced per room or hotel. | hidden when G_PAID=yes |
| te1 | I | Technology | IT | Do supervisors have phones or tablets and Wi-Fi in all rooms? | Photos must upload from the room. | always |
| da1 | B | Data | Department head | Do you have photos showing how each room type should look? | The tool compares against these. | always |
| or1 | B | Rules and controls | General manager | Is it written that staff never photograph guests or their belongings? | Photos of guests' things breach their trust. | always |
| n1 | I | People | HR | Is it agreed that results are used to fix rooms, not to rate individual attendants? | Staff resist tools that look like hidden ratings. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | split | Is it agreed that supervisors take photos and the manager reviews the problems the tool flags? | pe1a, pe1b | Two roles split. |
| sk1 | keep | Do the people involved know enough about taking photos the same way every time? | sk1 | Shortened. |
| fi1 | keep | Do you know what the app subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have mobile devices and Wi-Fi, or has your provider confirmed this is possible? | te1 | Plain wording. |
| da1 | keep | Are your room standards set out as images (photos of how a room should look), digital, up to date and ready to use? | da1 | Four-part phrase removed. |
| or1 | keep | Is a rule against taking photos of guests or their belongings in place and written down? | or1 | Plain wording. |
| x-hw | remove | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | — | The tool is a phone app; no capital equipment budget needed (devices covered by te1). |

## hk-6 — Planning room-cleaning order, staff assignments and workloads

Review verdict: **Wrong** → treatment: **full rewrite**  
Sensitive flag: **when hk6-person=yes, hk6-person=dk**

**Gates ("How it works")**

- **hk6-person** (custom): Will the plan assign work to each attendant based on their speed, past performance or personal traits?
  - Yes → raises sensitive flag
  - No, only by rooms, departures and shifts → no change
  - Don't know yet → raises sensitive flag; caps at Almost ready; action: Ask the vendor how the tool assigns rooms to attendants.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe2 | I | People | General manager | Have room attendants agreed to receive their room list in the app? | Plans on paper defeat the purpose. | always |
| sk1 | I | Skills | Department head | Can the executive housekeeper judge when to change the tool's plan? | Late check-outs and VIP arrivals need human judgement. | always |
| fi1 | N | Money | Finance | Do you know the monthly cost of the planning platform? | Often part of an operations platform. | always |
| te1 | B | Technology | IT | Does the tool receive departures and room status from your booking system as they change? | Plans built on old status send staff to occupied rooms. | always |
| da1 | I | Data | Department head | Do you have a record of how long each room type takes to clean? | The plan needs realistic times per room. | always |
| or1 | B | Rules and controls | General manager | Have attendants been told about the tool and asked for feedback on workloads before start? | Workload plans affect every attendant's day. | always |
| n1 | B | People | HR | Does a supervisor make the final decision about each person's room list? | The tool must not quietly overload some attendants. | hk6-person=yes |
| n2 | I | Rules and controls | HR | Is there a daily cap on rooms or credits per attendant? | Stops plans from overloading the fastest staff. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the executive housekeeper be in charge of this tool? | m1 | Owner is must-have 1. |
| pe2 | keep | Is it agreed that the room attendants use the app? | pe2 | Plain wording. |
| sk1 | keep | Can the people involved judge when to trust the AI's plans and when to adjust them? | sk1 | Shortened. |
| fi1 | keep | Do you know what the operations-platform subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a two-way link to your property management system (PMS) for room status and departures, or has your provider confirmed this is possible? | te1 | Acronym removed. |
| da1 | fix | Are accurate real-time room status and a history of cleaning times digital, up to date and ready to use? | da1 | Real-time status part covered by te1. |
| or1 | fix | Have staff been consulted on workload rules, and is this written down? | or1 | Legal consultation removed; practical staff step kept. |

## hk-7 — Bed-bug monitoring sensors with image recognition

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1a | B | People | General manager | Is one manager named to receive bed-bug alerts at any time? | A missed alert means the next guest is bitten. | always |
| pe1b | I | People | General manager | Has your pest-control contractor agreed to respond to alerts quickly? | Detection without fast treatment helps no one. | always |
| sk1a | I | Skills | Department head | Can that manager read an alert and its photo? | False alarms must be told apart from real ones. | always |
| sk1b | B | Skills | Department head | Is there a written procedure to close, check and treat a room after an alert? | The room must not be sold again before treatment. | always |
| te1 | I | Technology | IT | Do alerts reach the manager's phone or email straight away? | A delayed alert means a guest in a room with bed bugs. | always |
| da1 | I | Data | Department head | Is it recorded which room and bed each sensor is in? | An alert you cannot place is useless. | always |
| or1 | N | Rules and controls | General manager | Is it decided how long alert records and photos are kept? | Records help prove hygiene action to guests. | always |
| x-hw | B | Money | Owner | Is the money approved for sensors in every chosen bed, plus monitoring? | A sensor in every bed adds up. | hidden when G_PAID=yes |
| n1 | I | Rules and controls | General manager | Does the tool block the room in your booking system after an alert? | Stops the room being sold before treatment. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | split | Is it agreed that the maintenance or housekeeping manager receives the alerts, and the pest-control contractor treats the room? | pe1a, pe1b | Two roles split. |
| sk1 | split | Can the people involved read an alert and its photo, and follow the procedure for closing and treating a room? | sk1a, sk1b | Two ideas split; procedure moved here from or1. |
| fi1 | merge | Do you know what sensor units for each bed plus a monitoring subscription will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | fix | Do you have sensor units in every room chosen for them and alerts sent to the hotel by e-mail, or has your provider confirmed this is possible? | te1 | Circular wording fixed. |
| da1 | keep | Are the room number for each sensor unit and the alert log with photos digital, up to date and ready to use? | da1 | Shortened. |
| or1 | fix | Are a procedure from alert to inspection and treatment, and a rule to keep alert logs as operational data for a set time, in place and written down? | or1 | Procedure part moved to sk1. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

# Maintenance & Engineering

## me-1 — AI tuning of central heating, cooling and ventilation (building management system), with energy analysis

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the chief engineer agreed to own the tool, with vendor or energy-manager support? | Building controls need a technical owner. | always |
| sk1 | I | Skills | Department head | Can the engineering team judge whether a suggested temperature change is safe? | Wrong settings can damage equipment or comfort. | always |
| fi1 | N | Money | Finance | Do you know the cost, including any share of the energy savings paid to the vendor? | Savings-share deals can cost more than a fee. | always |
| te1 | B | Technology | IT | Can your building management system be controlled by outside software? | Older systems often cannot be connected. | always |
| da1 | I | Data | Department head | Do you have at least a year of meter and sensor readings? | Savings are measured against past use. | always |
| or1 | B | Rules and controls | General manager | Are written comfort limits, such as room temperature ranges, agreed with operations? | Saving energy must not make guests cold. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the chief engineer is responsible for the tool, with support from the vendor or energy manager? | pe1 | Shortened. |
| sk1 | fix | Can the people involved read building management system (BMS) data and judge changes to target settings (setpoints)? | sk1 | Jargon removed. |
| fi1 | keep | Do you know what the subscription, connecting it to your systems and sometimes a share of the savings will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a building management system (BMS) that uses open communication standards (e.g. BACnet), and energy metering, or has your provider confirmed this is possible? | te1 | Jargon removed. |
| da1 | keep | Is the history of meter and sensor readings digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | keep | Are there written comfort limits agreed with operations? | or1 | Example added. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Comes from the "acts by itself" gate. |

## me-2 — Sorting and creating repair requests, and the equipment register

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_LINK** (library): Does the tool need to connect to your hotel systems, such as booking, till or accounting?
  - Yes → a Doesn't apply answer on m4 becomes Don't know yet, with a note
  - No, it works on its own → hides Technology questions
  - Don't know yet → caps at Almost ready; action: Ask the vendor which hotel systems the tool must connect to.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have engineers been shown how to use the repair app? | Unused apps keep repairs on paper. | always |
| sk1 | I | Skills | Department head | Can engineers keep the equipment list current in the app? | Repairs must link to the right equipment. | always |
| fi1 | N | Money | Finance | Do you know the monthly cost of the maintenance platform? | Usually per hotel or user. | always |
| te1 | B | Technology | IT | Can the app take a broken room out of sale in your booking system? | Selling a broken room means an angry guest. | hidden when G_LINK=no |
| da1 | I | Data | Department head | Is your equipment list complete, with location and age? | Sorting repairs needs to know what is where. | always |
| or1 | I | Rules and controls | General manager | Is it agreed who handles repair requests the tool cannot sort? | Unsorted requests get lost. | always |
| n1 | B | Rules and controls | Department head | Are urgent safety repairs always sent to a person at once? | Gas, water and electrical faults cannot wait in a queue. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the engineering team use this tool, and have they been shown how? | pe1 | Shortened. |
| sk1 | keep | Can the people involved use the app and keep the equipment list (asset register) up to date? | sk1 | Jargon removed. |
| fi1 | keep | Do you know what the maintenance-platform subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a mobile app and a link to your property management system (PMS) to take rooms out of sale, or has your provider confirmed this is possible? | te1 | Plain wording. |
| da1 | keep | Are your equipment list and photos digital, up to date and ready to use? | da1 | Plain wording. |
| or1 | keep | Is it agreed who handles the cases the tool cannot process? | or1 | Shortened. |

## me-3 — Digital twins (a live virtual model of the building)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have the engineering team and a specialist partner agreed to run it together? | Few hotel teams can build this alone. | always |
| sk1 | I | Skills | Department head | Does the team or partner have building-modelling and data skills? | A digital twin needs specialist skills. | always |
| fi1 | I | Money | Finance | Do you know the full project cost over several years? | This is a large, long project. | always |
| te1 | B | Technology | IT | Does your building have sensors and a building management system to feed the model? | The model is only as live as its sensors. | always |
| da1 | B | Data | Department head | Do you have current building plans and energy-use data? | The model starts from the plans. | always |
| or1 | B | Rules and controls | General manager | Has the owner committed to the project for several years in writing? | Benefits come after years, not months. | always |
| x-hw | I | Money | Owner | Is the money approved for any sensors and equipment the model needs? | Many buildings need extra sensors first. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the engineering team and a specialist partner be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Do the people involved, or the partner, have modelling and data skills? | sk1 | Leftover text removed. |
| fi1 | fix | Do you know what the whole project will cost your hotel (the team rates the cost as high)? | fi1 | Commentary removed. |
| te1 | keep | Do you have sensors, a building management system (BMS) and a data platform, or has your provider confirmed this is possible? | te1 | Acronym removed. |
| da1 | keep | Are detailed building, sensor and usage (consumption) data digital, up to date and ready to use? | da1 | Four-part phrase removed. |
| or1 | keep | Is a long-term commitment from the owner in place and written down? | or1 | Shortened. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

## me-4 — Guest-room energy management (heating, cooling and lighting adjusted to whether the room is occupied)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **AUTO_ACT** (automatic, not asked): applies G_ACT=acts → adds ACT_LIMITS, ACT_OFF
- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | I | Skills | Department head | Can engineering set how far heating or cooling may drop in empty rooms? | Too deep a setback makes rooms slow to recover. | always |
| te1 | B | Technology | IT | Do your room controls receive check-in and check-out from your booking system? | Rooms must warm up before the guest arrives. | always |
| da1 | I | Data | Department head | Do room sensors reliably show when a guest is in the room? | A wrong reading switches off a guest's air conditioning. | always |
| or1a | B | Rules and controls | General manager | Are written comfort limits set, such as the lowest temperature in an occupied room? | Saving energy must never make guests uncomfortable. | always |
| or1b | I | Rules and controls | General manager | Is it agreed how staff fix a guest's comfort complaint quickly? | A cold room at night needs a fast fix. | always |
| x-hw | B | Money | Owner | Is the money approved to buy and install room controls and sensors? | Room-control equipment is a large one-off cost. | hidden when G_PAID=yes |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | always |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the engineering manager be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | keep | Can the people involved set the energy-saving settings for empty rooms (setbacks)? | sk1 | Jargon "setbacks" removed. |
| fi1 | merge | Do you know what the room-control equipment, a one-off equipment cost, will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | keep | Do you have a guest room management system (GRMS) linked to check-in data from your property management system (PMS), or has your provider confirmed this is possible? | te1 | Acronyms removed. |
| da1 | keep | Are occupancy and check-in data digital, up to date and ready to use? | da1 | Readiness phrase replaced. |
| or1 | split | Are there written rules on guest comfort and on handling guest complaints? | or1a, or1b | Two ideas split. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

## me-5 — Predictive maintenance by the equipment maker (lifts, escalators, doors)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the engineering manager agreed to follow up alerts from the equipment maker? | The maker sees the fault; you must make sure it is fixed. | always |
| sk1 | N | Skills | Department head | Can that person hold the maker to the response times in the service contract? | Alerts are only useful if service is fast. | always |
| fi1 | N | Money | Finance | Have you checked whether your service contract already includes this? | Often included at no extra cost. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Is your lift, escalator or door equipment connected to its maker? | No connection, no prediction. | always |
| da1 | I | Data | Department head | Does the maker share fault reports and predictions with you? | Without reports you cannot check the maker's work. | always |
| or1 | I | Rules and controls | General manager | Does your contract give you access to your own equipment data? | Without access you cannot switch service provider later. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the engineering manager monitors alerts from the vendor? | pe1 | Shortened. |
| sk1 | keep | Do the people involved know enough about managing service contracts? | sk1 | Made specific. |
| fi1 | keep | Have you checked whether you already pay for this (team's note: included in the manufacturer's service contract)? | fi1 | Shortened. |
| te1 | keep | Is your equipment connected to its manufacturer, or has the manufacturer confirmed this is possible? | te1 | Shortened. |
| da1 | fix | Is the equipment data from the manufacturer digital, up to date and ready to use? | da1 | Readiness phrase replaced. |
| or1 | keep | Does your contract with the manufacturer include written terms on access to the data? | or1 | Plain wording. |

## me-6 — Predictive maintenance run by the hotel (heating, ventilation and air conditioning, kitchen, technical devices)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have the chief engineer and a data partner agreed to run it together? | Most hotels need outside data help. | always |
| sk1 | I | Skills | Department head | Can engineers read a prediction of when equipment may fail and plan a repair? | Predictions matter only if repairs are planned. | always |
| te1a | B | Technology | IT | Is your key equipment fitted with sensors that send readings online? | No readings, no predictions. | always |
| te1b | I | Technology | IT | Do you have a maintenance system that records repairs? | Predictions need repair history to learn. | always |
| da1 | B | Data | Department head | Do you have at least a year of sensor readings and repair records? | The tool learns what comes before a failure. | always |
| or1 | B | Rules and controls | General manager | Is one person named to act on each alert? | Unowned alerts get ignored. | always |
| x-hw | I | Money | Owner | Is the money approved for sensors and their installation? | Sensors are a one-off cost. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the chief engineer and a data partner be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Can the people involved read predictions of when equipment will fail? | sk1 | Shortened. |
| fi1 | merge | Do you know what the sensors, a one-off equipment cost, plus a subscription will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | split | Do you have internet-connected (IoT) sensors, a maintenance system and a data platform, or has your provider confirmed this is possible? | te1a, te1b | Three items cut to two. |
| da1 | keep | Is a history of sensor readings and repair tickets over time digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | keep | Is it written down who is responsible for acting on alerts? | or1 | Plain wording. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

## me-7 — Water leak and fault detection

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | B | Skills | Department head | Can someone respond to a leak alert at any hour, including nights? | Leaks at night cause the most damage. | always |
| te1 | B | Technology | IT | Do the meters and sensors have a reliable network connection? | A sensor that drops off cannot warn you. | always |
| da1 | I | Data | Department head | Do you have water-meter readings to compare normal use against? | Leaks show as use above normal. | always |
| or1 | I | Rules and controls | General manager | Is it agreed who maintains the sensors and what happens when one fails? | A failed sensor gives false peace of mind. | always |
| x-hw | B | Money | Owner | Is the money approved for meters, sensors and installation? | Hardware is a one-off cost. | always |
| n1 | I | Rules and controls | Department head | Does every alert say where to shut off the water? | Fast shut-off limits damage. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the engineering team be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | fix | Can the people involved respond to alerts? | sk1 | Made specific. |
| fi1 | merge | Do you know what smart meters or sensors plus a subscription will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | keep | Do you have metering and a network connection, or has your provider confirmed this is possible? | te1 | Plain wording. |
| da1 | keep | Is water-meter data digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | keep | Is it agreed who looks after the equipment and what happens when it fails? | or1 | Shortened. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

# Kitchen & Culinary Operations

## kc-1 — Measuring food waste with cameras (computer vision)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1a | I | People | General manager | Has the head chef agreed to own the waste-reduction targets? | Targets need an owner in the kitchen. | always |
| pe1b | B | People | General manager | Have kitchen staff agreed to put every waste item on the scale? | Unrecorded waste makes the data useless. | always |
| te1 | I | Technology | IT | Is there Wi-Fi and power where the waste station will stand? | The station must upload each weighing. | always |
| da1 | I | Data | Department head | Do you know your food cost per kilo, to value the waste? | Savings are shown in money, not kilos. | always |
| or1 | I | Rules and controls | General manager | Are waste results shared with the kitchen team every week? | Seeing results keeps staff recording. | always |
| x-hw | B | Money | Owner | Is the money approved for the camera, scale and installation? | Equipment is a one-off cost. | hidden when G_PAID=yes |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | split | Is it agreed that the head chef is responsible for the targets and the kitchen staff record waste? | pe1a, pe1b | Two roles split. |
| sk1 | merge | Do the people involved have the discipline to record waste every time? | pe1a, pe1b | Same as staff recording every item. |
| fi1 | merge | Do you know what the equipment (camera and scale) plus a subscription will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | keep | Do you have Wi-Fi in the kitchen and a device, or has your provider confirmed this is possible? | te1 | Plain wording. |
| da1 | keep | Are waste records and food cost data digital, up to date and ready to use? | da1 | Made specific. |
| or1 | fix | Is staff support for the tool, built through training and targets, in place and written down? | or1 | Double question cut. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

## kc-2 — Allergen handling and menu labelling

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Has the chef agreed to check every allergen label before it is used? | A wrong label can make a guest seriously ill. | always |
| sk1 | I | Skills | Department head | Does the chef know the main allergens well enough to check the tool? | The check is only as good as the checker. | always |
| fi1 | N | Money | Finance | Do you know the monthly cost? | Usually a small subscription. | hidden when G_PAID=yes |
| te1 | I | Technology | IT | Can the tool print or publish menus and labels you already use? | Copying labels by hand brings back errors. | always |
| da1 | B | Data | Department head | Are all recipes and ingredient lists, including supplier changes, current? | A supplier swap can add an allergen. | always |
| or1 | B | Rules and controls | General manager | Is a new allergen check done every time a recipe or supplier changes? | Most allergen errors come from small changes. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the chef checks labels? | pe1 | Weight raised: safety-critical. |
| sk1 | keep | Do the people involved know enough about allergens to check what the tool produces? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a menu system, or has your provider confirmed this is possible? | te1 | Plain wording. |
| da1 | keep | Are accurate recipes and ingredient lists digital, up to date and ready to use? | da1 | Supplier changes added. |
| or1 | fix | Is a rule that a person checks allergen information before it is published (food-law liability) in place and written down? | or1 | Legal reference removed; practical safety check kept. |

## kc-3 — Smart cooking equipment (ovens that recognise the food)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | I | Skills | Department head | Have cooks been trained to use the new equipment? | New ovens are misused without training. | always |
| te1 | I | Technology | IT | Can the equipment connect to your kitchen network for updates? | Programmes are updated over the network. | always |
| da1 | B | Data | Department head | Are cooking programmes set up for your main dishes? | Recognition only helps if the oven knows your dishes. | always |
| or1 | I | Rules and controls | General manager | Is it agreed who services the equipment and what to do if it fails during service? | A broken oven in service needs a plan. | always |
| x-hw | B | Money | Owner | Is the money approved to buy or lease and maintain the equipment? | A large one-off cost. | hidden when G_PAID=yes |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the chef team be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | keep | Can the people involved use new equipment? | sk1 | Plain wording. |
| fi1 | merge | Do you know what buying the equipment, a one-off equipment cost, will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | keep | Can your kitchen equipment connect to the network, or has your provider confirmed this is possible? | te1 | Plain wording. |
| da1 | keep | Are cooking programmes for each dish digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | keep | Is it agreed who looks after the equipment and what happens when it fails? | or1 | Shortened. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

## kc-4 — Forecasting kitchen production, guest numbers (covers) and breakfast buffet, including purchase quantities

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have the chef and F&B manager agreed to use forecasts for daily planning? | Forecasts help only if the kitchen uses them. | always |
| sk1 | I | Skills | Department head | Can the chef adjust preparation and orders from a forecast? | The chef turns covers into quantities. | always |
| fi1 | N | Money | Finance | Do you know the monthly cost? | Usually a subscription. | always |
| te1a | B | Technology | IT | Does the tool receive item sales from your till system? | Sales history shows what guests eat. | always |
| te1b | I | Technology | IT | Does the tool receive the occupancy forecast from your booking system? | Breakfast numbers follow occupancy. | always |
| da1 | B | Data | Department head | Do you have at least a year of covers, item sales and occupancy history? | Forecasts learn from past patterns. | always |
| or1 | I | Rules and controls | General manager | Does the chef make the final call on quantities when the forecast looks wrong? | Events and weather can break a forecast. | always |
| n1 | N | Data | Department head | Are group bookings and events with meals recorded ahead of time? | Groups change covers more than anything else. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the chef and the food and beverage (F&B) manager be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Can the people involved use forecasts to plan food preparation and orders? | sk1 | Shortened. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | split | Has it been confirmed that you can link your point-of-sale system (POS) and the occupancy forecast in your property management system (PMS)? | te1a, te1b | Two links split. |
| da1 | keep | Are histories of covers (guests served), item sales and occupancy digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | rewrite | Are there written limits on what the tool may set by itself, and on who can overrule it? | or1 | Copied "limits" question replaced; tool advises. |

## kc-5 — Recipe and menu creation with generative AI

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the chef agreed to own every recipe the tool suggests? | The chef is accountable for taste and safety. | always |
| sk1 | I | Skills | Department head | Can the chef judge recipe quality and cost per portion? | AI recipes can look good and cost too much. | always |
| fi1 | N | Money | Finance | Do you know the AI tool licence cost? | Usually a small licence. | hidden when G_PAID=yes |
| da1 | I | Data | Department head | Are your recipes and ingredient costs written down for the tool to use? | The tool costs recipes from your prices. | always |
| or1 | B | Rules and controls | General manager | Is every new recipe checked for allergens before it is served? | AI does not reliably know allergens. | always |
| n1 | I | Skills | Department head | Is every AI recipe test-cooked before it goes on the menu? | AI recipes can fail in a real kitchen. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the chef be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Can the people involved judge recipe quality and costing? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the AI tool licence will cost your hotel? | fi1 | Shortened. |
| te1 | remove | Is it confirmed that this works without a link to your hotel systems? | — | No hotel-system link needed; question gave no information. |
| da1 | keep | Are recipe and cost data digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | keep | Is an allergen check on new recipes in place and written down? | or1 | Plain wording. |

## kc-6 — Robotic cooking stations

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **AUTO_ACT** (automatic, not asked): applies G_ACT=acts → adds ACT_LIMITS, ACT_OFF
- **kc6-guest** (custom): Will guests see or stand near the robot station?
  - Yes → no change
  - No, kitchen only → no change
  - Don't know yet → caps at Almost ready; action: Decide where the robot station will stand.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the head chef agreed to be responsible for the robot station? | Food safety stays the chef's duty. | always |
| sk1 | I | Skills | Department head | Can kitchen staff load, clean and set up the robot? | Daily cleaning keeps it safe. | always |
| te1a | B | Technology | IT | Is there power, water and space at the station? | Many kitchens need building work first. | always |
| te1b | I | Technology | IT | Do you have a maintenance contract with a fast response time? | A robot down in service stops a station. | always |
| da1 | I | Data | Department head | Are recipes and portion sizes set up for the robot? | The robot cooks only what it is given. | always |
| or1a | B | Rules and controls | General manager | Are the robot's food-safety checks written down and done daily? | Cleaning and temperature errors make guests ill. | always |
| or1b | B | Rules and controls | General manager | Can staff cook the same dishes by hand when the robot fails? | Service must go on. | always |
| x-hw | B | Money | Owner | Is the money approved to buy or lease, install and maintain the robot? | A large one-off cost. | always |
| n1 | B | Rules and controls | Department head | Is the station guarded so guests cannot touch hot or moving parts? | Guests near a robot station can be hurt. | kc6-guest=yes |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | always |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the head chef is responsible for the station? | pe1 | Shortened. |
| sk1 | keep | Can the people involved load, clean and set up the robot? | sk1 | Shortened. |
| fi1 | merge | Do you know what buying or leasing the equipment will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | split | Do you have power, water and space at the station and a maintenance contract, or has your provider confirmed this is possible? | te1a, te1b | Two items split. |
| da1 | keep | Are recipes and portion data digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | split | Are food-safety checks and a backup plan for when the robot is not working in place and written down? | or1a, or1b | Two ideas split. |
| x-hw | keep | Is a capital budget (money for long-term equipment) approved for buying or leasing, installing and maintaining the equipment? | x-hw | Plain wording. |

# Procurement & Purchasing

## pr-1 — Automatic purchase suggestions and reordering

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Has the purchasing manager agreed to approve orders above an agreed amount? | Automatic orders can tie up cash in stock. | always |
| sk1 | I | Skills | Department head | Can the purchasing team check whether suggested quantities make sense? | Suggestions miss menu changes and events. | always |
| fi1 | N | Money | Finance | Do you know the monthly cost of the purchasing platform? | Usually per hotel or outlet. | always |
| te1 | B | Technology | IT | Is your purchasing system linked to your stock records and till system? | Reorders need live stock and sales. | always |
| da1a | B | Data | Department head | Do you record stock levels at least weekly in the system? | Suggestions start from current stock. | always |
| da1b | I | Data | Department head | Is a minimum stock level set for each main item? | The tool reorders when stock falls below this level. | always |
| or1 | I | Rules and controls | General manager | Can the tool order only from your approved suppliers? | Stops orders going to unapproved or more expensive suppliers. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the purchasing manager approves orders? | pe1 | Threshold made explicit. |
| sk1 | keep | Can the people involved check the suggested quantities? | sk1 | Shortened. |
| fi1 | keep | Do you know what the purchasing-platform subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a purchasing system linked to your stock records and point-of-sale system (POS), or has your provider confirmed this is possible? | te1 | Acronym removed. |
| da1 | split | Are stock levels, par levels (the standard stock to keep) and approved suppliers digital, up to date and ready to use? | da1a, da1b | Three items split into two; jargon "par levels" removed. |
| or1 | fix | Are there written rules for approving orders? | or1 | Generic approval rule made specific (amount limit is pe1). |

## pr-2 — Forecasting demand and stock for purchasing

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have the purchasing manager and the chef agreed to use the forecasts? | Forecasts need both kitchen and purchasing. | always |
| sk1 | I | Skills | Department head | Can they turn a forecast into order quantities? | Forecasts matter only when they change orders. | always |
| fi1 | N | Money | Finance | Do you know the cost of the platform add-on? | Usually an add-on. | hidden when G_PAID=yes |
| te1a | B | Technology | IT | Does the tool receive sales from your till system and stock records? | Past use drives the forecast. | always |
| te1b | I | Technology | IT | Does the tool receive the occupancy forecast from your booking system? | Occupancy drives future use. | always |
| da1 | B | Data | Department head | Do you have at least a year of use per item for each outlet? | Forecasts learn from history. | always |
| or1 | I | Rules and controls | General manager | Does a person decide the final order when the forecast looks wrong? | The forecast advises; a person orders. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the purchasing manager and the chef be in charge of this tool? | pe1 | Shortened. |
| sk1 | fix | Can the people involved read forecasts? | sk1 | Made specific. |
| fi1 | keep | Do you know what the platform add-on will cost your hotel? | fi1 | Shortened. |
| te1 | split | Do you have a link to your point-of-sale system (POS), recipes, stock records and occupancy forecast, or has your provider confirmed this is possible? | te1a, te1b | Four links cut to two. |
| da1 | keep | Is the consumption history for each outlet (restaurant, bar or other selling point) digital, up to date and ready to use? | da1 | Jargon removed. |
| or1 | rewrite | Are there written limits on what the tool may set by itself, and on who can overrule it? | or1 | Copied "limits" question replaced. |

## pr-3 — Checking invoices against purchase orders (two- or three-way) and spotting invoice errors

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the accounts payable clerk agreed to handle invoices that do not match? | Exceptions are where the savings are found. | always |
| sk1 | N | Skills | Department head | Does that person know how to settle a price or quantity difference with a supplier? | Mismatches need a follow-up, not only a flag. | always |
| fi1 | N | Money | Finance | Do you know the cost of the invoice or purchasing software? | Usually per invoice or per month. | always |
| te1 | B | Technology | IT | Are your purchasing and accounting systems linked? | Matching needs orders and invoices in one place. | always |
| da1 | B | Data | Department head | Are deliveries recorded as received in the system, item by item? | Without delivery records you cannot match invoices. | always |
| or1 | I | Rules and controls | General manager | Is it written who approves which invoices, and in what order? | Approval order stops payments slipping through. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the accounts payable clerk (who pays supplier invoices) handles exceptions (invoices that do not match)? | pe1 | Plain wording. |
| sk1 | fix | Do the people involved know enough about handling exceptions (invoices that do not match)? | sk1 | Made concrete. |
| fi1 | keep | Do you know what the subscription for accounts payable (AP, supplier invoices) or purchasing software will cost your hotel? | fi1 | Acronym removed. |
| te1 | keep | Are your purchasing and accounting systems linked, or has your provider confirmed it is possible? | te1 | Shortened. |
| da1 | keep | Are purchase orders and goods receipts (delivery records) recorded digitally, up to date and ready to use? | da1 | Plain wording. |
| or1 | keep | Is there a written approval process (who approves what, in which order)? | or1 | Shortened. |

## pr-4 — Spend analysis and detection of stock differences and losses (shrinkage)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **when pr4-staff=yes**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.
- **pr4-staff** (custom): Will losses be traced to individual named staff members?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Decide whether loss results will name individual staff.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | I | Skills | Department head | Can the team investigate a stock difference before blaming anyone? | Most differences are recording errors, not theft. | always |
| fi1 | N | Money | Finance | Do you know the cost of the platform add-on? | Usually an add-on. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Are your stock, till and accounting systems linked? | Losses show where the three disagree. | always |
| da1 | B | Data | Department head | Do you count stock regularly and record every stock movement? | No counts, no differences to find. | always |
| or1 | I | Rules and controls | General manager | Is one person named to follow up each stock difference the tool flags? | Unowned flags change nothing. | always |
| n1 | B | Rules and controls | HR | Does a manager review the facts before any action is taken against a staff member? | A wrong accusation damages trust and the team. | pr4-staff=yes |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the purchasing or finance manager be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | keep | Can the people involved investigate variances (differences between expected and actual figures)? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the platform add-on (extra module) will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Are your inventory, point-of-sale system (POS) and accounting linked, or has your provider confirmed it is possible? | te1 | Acronym removed. |
| da1 | keep | Are stock counts and stock movements digital, up to date and ready to use? | da1 | Plain wording. |
| or1 | fix | Is a named person responsible for acting on each alert or report? | or1 | Generic alert question made specific. |

## pr-5 — Supplier price comparison, market benchmarks and checks on agreed contract prices

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | I | Skills | Department head | Can the purchasing manager use price gaps to renegotiate with suppliers? | Comparison saves money only when used in talks. | always |
| fi1 | N | Money | Finance | Do you know the cost of the platform add-on? | Usually an add-on. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Do supplier invoices reach the tool automatically? | Typing invoices in defeats the purpose. | always |
| da1 | B | Data | Department head | Are your agreed contract prices recorded for every main supplier? | The tool checks invoices against these. | always |
| or1 | I | Rules and controls | General manager | Is one person named to claim back overcharges the tool finds? | Found overcharges must be recovered. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the purchasing manager be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | fix | Do the people involved know enough about contract management? | sk1 | Vague skill made concrete. |
| fi1 | keep | Do you know what the platform add-on (extra module) will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a feed of invoice data (invoices sent automatically into the tool), or has your provider confirmed it is possible? | te1 | Plain wording. |
| da1 | keep | Are your contract price lists digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | fix | Is a named person responsible for acting on each alert or report? | or1 | Generic alert question made specific. |

## pr-6 — Forecasting supplier prices to prepare negotiations

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the purchasing manager agreed to use price forecasts before negotiations? | The value comes at the negotiating table. | always |
| sk1 | N | Skills | Department head | Does that person plan negotiations around expected price changes? | Forecasts help only if used to time deals. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost? | Usually a subscription. | hidden when G_PAID=yes |
| te1 | I | Technology | IT | Can the tool read your purchasing data? | Forecasts must cover the items you buy. | always |
| da1 | B | Data | Department head | Do you have at least two years of prices for your key items? | Price forecasts need history. | always |
| or1 | N | Rules and controls | General manager | Do you compare forecasts with real prices afterwards to see if the tool is right? | Shows whether the forecasts can be trusted. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the purchasing manager be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Do the people involved know enough about planning negotiations? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is your purchasing (procurement) data available to the tool, or has your provider confirmed it is possible? | te1 | Plain wording. |
| da1 | keep | Is the price history for key items digital, up to date and ready to use? | da1 | Time span added. |
| or1 | rewrite | Are there written limits on what the tool may set by itself, and on who can overrule it? | or1 | Copied "limits" question replaced; a forecast sets nothing. |

# Finance & Accounting

## fa-1 — Scanning supplier invoices and coding them to the general ledger

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1a | I | People | General manager | Has the accounts payable team agreed to review invoices the tool cannot process? | Exceptions need a person. | always |
| pe1b | I | People | General manager | Has the financial controller agreed to own the coding rules? | Wrong codes distort the accounts. | always |
| sk1 | I | Skills | Department head | Does the team know your account codes well enough to spot a wrong one? | The tool learns from corrections. | always |
| fi1 | N | Money | Finance | Do you know the fee per invoice or the subscription? | Per-invoice fees grow with volume. | always |
| te1 | B | Technology | IT | Can the tool send coded invoices into your accounting system? | Otherwise the coding is retyped. | always |
| da1 | B | Data | Department head | Are your account codes and supplier details current and free of duplicates? | Duplicate suppliers lead to double payments. | always |
| or1 | B | Rules and controls | General manager | Are there written limits on how much each person may approve? | Automatic coding must not bypass approval. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | split | Is it agreed that the accounts payable (AP) team reviews exceptions (invoices the tool cannot process) and the financial controller owns the coding rules? | pe1a, pe1b | Double question split. |
| sk1 | fix | Do the people involved know enough about handling exceptions and about the general ledger (GL, the hotel's main accounts)? | sk1 | Two skills cut to one; jargon removed. |
| fi1 | keep | Do you know what the per-invoice fee or subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is there a link to your accounting or ERP system (main business software) and approval process, or has your provider confirmed it is possible? | te1 | Jargon "ERP" removed. |
| da1 | keep | Are your chart of accounts (list of account codes) and supplier master data (core supplier details) digital, up to date and ready to use? | da1 | Jargon removed. |
| or1 | keep | Are there written approval limits (the amounts each person may approve)? | or1 | Plain wording. |

## fa-2 — Spotting fraud and unusual patterns in payments

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the finance lead agreed to own payment-fraud checks? | Fraud alerts need fast decisions. | always |
| sk1 | B | Skills | Department head | Can staff review a flagged payment the same day? | Fraud losses grow by the hour. | always |
| fi1 | N | Money | Finance | Have you checked whether your payment provider already includes this? | Often included in provider fees. | always |
| te1 | B | Technology | IT | Is your online payment system linked to your booking system or booking engine? | Fraud shows when payments and bookings do not match. | always |
| da1 | I | Data | Department head | Do you keep past payment and booking records, including known fraud cases? | The tool learns from past fraud. | always |
| or2 | B | Rules and controls | General manager | Is it written when a payment may be blocked, and who decides? | Blocking a real guest's payment loses the booking. | always |
| x-pay | I | Rules and controls | IT | Has IT checked the tool meets your payment provider's card-security requirements? | Card data handled badly invites fraud. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the finance lead or revenue-integrity lead (who checks revenue is correctly collected) be in charge of this tool? | pe1 | Jargon removed. |
| sk1 | keep | Can the people involved review payments the tool flags as suspicious? | sk1 | Time made explicit. |
| fi1 | keep | Have you checked whether you already pay for this, as it is usually included in your payment provider's fees? | fi1 | Shortened. |
| te1 | keep | Is your payment gateway (online payment system) linked to your property management system (PMS) or booking engine, or has your provider confirmed it is possible? | te1 | Jargon removed. |
| da1 | fix | Are payment and booking data digital, up to date and ready to use? | da1 | Readiness phrase replaced. |
| or1 | merge | Has a named person checked which of your systems fall under PCI DSS (card payment security rules)? | x-pay | Duplicate of the card-security question; standard name removed. |
| or2 | keep | Are there written rules on when to block a payment? | or2 | Decider added. |
| x-pay | keep | Has your IT or security contact checked that the tool and its vendor meet the card-data security rules your payment provider requires? | x-pay | Plain wording. |

## fa-3 — Automatic reconciliation of bank, card, booking-site commission, PMS and supplier statements

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the accountant agreed to handle items the tool cannot match? | Unmatched items hide errors. | always |
| sk1 | N | Skills | Department head | Does the accountant know how your bank and booking-site payouts should match? | Matching rules come from this knowledge. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost? | Usually a subscription. | always |
| te1 | B | Technology | IT | Does the tool receive statements from your bank, card provider and booking sites automatically? | Manual downloads remove the saving. | always |
| da1 | I | Data | Department head | Do booking-site payouts show which bookings they cover? | Without booking references, matching fails. | always |
| n1 | I | Rules and controls | Finance | Does someone check the commission booking sites charge against your contracts? | Wrong commission is a common hidden loss. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the accountant handles exceptions (items the tool cannot match)? | pe1 | Plain wording. |
| sk1 | keep | Do the people involved know enough about reconciliation rules (how records are matched)? | sk1 | Jargon removed. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have data feeds from your bank, card payments, online travel agencies (OTAs), property management system (PMS) and accounting, or has your provider confirmed them? | te1 | Acronyms removed. |
| da1 | keep | Is your booking and payout data clean, digital, up to date and ready to use? | da1 | Made specific. |
| or1 | merge | Is it agreed who handles the cases the tool cannot process? | pe1 | Same as pe1. |

## fa-4 — Forecasting cash flow and profit and loss (P&L), and budgeting

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the financial controller agreed to own the cash and profit forecast? | Forecasts guide owner decisions. | always |
| sk1 | N | Skills | Department head | Can finance build budgets from the forecast? | Budgets are the main output. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost? | Usually a subscription. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Can the tool read data from accounting, your booking system and payroll? | Cash forecasts need revenue and staff costs. | always |
| da1 | B | Data | Department head | Do you have at least two years of monthly profit and loss history? | Forecasts need seasons to learn from. | always |
| n1 | I | Rules and controls | Owner | Has the owner agreed which forecast figures they want each month? | Forecasts serve owner decisions. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the financial controller be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Do the people involved know enough about building budgets from forecasts? | sk1 | Shortened. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Can the tool get data from your accounting, property management system (PMS) and payroll, or has your provider confirmed it is possible? | te1 | Acronym removed. |
| da1 | keep | Do you have several years of profit and loss (P&L) history that is digital, up to date and ready to use? | da1 | Time span added. |
| or1 | merge | Have you agreed who owns the forecast? | pe1 | Same as pe1. |

## fa-5 — Generative AI assistants for finance and agents for supplier invoices

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **AUTO_ACT** (automatic, not asked): applies G_ACT=acts → adds ACT_LIMITS, ACT_OFF
- **fa5-pay** (custom): Can the agents release payments to suppliers?
  - Yes → no change
  - No, they only prepare entries → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether the agents can release payments.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Does the finance team approve what the AI agents do before it counts? | Agents can post wrong entries fast. | always |
| sk1 | I | Skills | Department head | Can the team read the record of every action the agents took? | Checks need a full record. | always |
| fi1 | N | Money | Finance | Do you know the usage price or higher plan cost? | Usage pricing can rise quickly. | always |
| te1 | B | Technology | IT | Can the tool write entries into your accounting system? | Agents need write access to save time. | always |
| da1 | I | Data | Department head | Are supplier and account details current and free of duplicates? | Agents copy errors at speed. | always |
| or1a | B | Rules and controls | General manager | Is every entry approved by a person before it is posted? | Posted errors are hard to undo. | always |
| or1b | B | Rules and controls | General manager | Is every agent action recorded and kept? | A record lets you find and fix errors. | always |
| n1 | B | Rules and controls | Finance | Do two people approve every payment the agents prepare? | A fake supplier invoice paid by an agent is money lost. | fa5-pay=yes |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | always |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the finance team approves the actions of the AI agents (AI that carries out tasks by itself)? | pe1 | Plain wording. |
| sk1 | keep | Can the people involved supervise the AI agents and read their audit trail (record of every action taken)? | sk1 | Jargon removed. |
| fi1 | keep | Do you know what the usage-based price or premium tier (higher-priced plan) will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Can the tool write data into your accounting system (write access), or has your provider confirmed it is possible? | te1 | Jargon removed. |
| da1 | fix | Is your master data (core reference records) clean, digital, up to date and ready to use? | da1 | Jargon "master data" removed. |
| or1 | split | Is it written down that entries are approved before they are posted to the accounts, and is there an audit log (record of every action)? | or1a, or1b | Two controls split. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Agents act by themselves; limits and switch-off applied automatically. |

## fa-6 — Automating the night audit (end-of-day closing)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the night auditor or accountant agreed to own the automated closing? | Someone must check the day closed correctly. | always |
| sk1 | I | Skills | Department head | Can that person review items the tool cannot close? | Exceptions need a person. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost? | Often a booking-system add-on. | always |
| te1 | B | Technology | IT | Is your booking system linked to your accounting system? | Closing posts revenue to accounting. | always |
| da1 | I | Data | Department head | Are room charges and payments posted correctly in your booking system each day? | Automation closes whatever is there. | always |
| or1 | I | Rules and controls | General manager | Is every change during closing recorded, with time and who made it? | Lets you trace errors later. | always |
| n1 | I | Rules and controls | Department head | Is someone on duty at night who can handle problems the closing finds? | Problems at 3 a.m. still need a person. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the night auditor or accountant be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Can the people involved review exceptions (items the tool cannot process)? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Is your property management system (PMS) linked to your accounting, or has your provider confirmed it is possible? | te1 | Acronym removed. |
| da1 | fix | Is your daily revenue data digital, up to date and ready to use? | da1 | Readiness phrase replaced. |
| or1 | keep | Are there written rules for the audit trail (record of what was changed, when and by whom)? | or1 | Jargon removed. |

## fa-7 — Automatic handling of chargeback disputes (guests reversing card payments)

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the finance team agreed to own card-dispute handling? | Disputes have strict deadlines. | always |
| sk1 | I | Skills | Department head | Does someone know what evidence wins a card dispute? | Weak evidence loses the money. | always |
| fi1 | N | Money | Finance | Do you know the fee per dispute or the subscription? | Per-dispute fees can exceed small amounts. | always |
| te1 | B | Technology | IT | Can the tool read guest bills in your booking system and disputes from your payment provider? | It builds the evidence from both. | always |
| da1 | B | Data | Department head | Are signed registration cards, bills and booking terms stored for each stay? | These are the evidence that wins disputes. | always |
| x-pay | I | Rules and controls | IT | Has IT checked the tool meets your payment provider's card-security requirements? | The tool handles card data. | always |
| n1 | I | Rules and controls | Finance | Does a person check each dispute reply before it is sent? | A wrong reply loses the case. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the finance or revenue-integrity staff (who check revenue is correctly collected) be in charge of this tool? | pe1 | Jargon removed. |
| sk1 | keep | Do the people involved know enough about the rules for disputing chargebacks? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the per-dispute fee or subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Can the tool access your payment provider and the guest folios (bills) in your property management system (PMS), or has your provider confirmed it is possible? | te1 | Jargon removed. |
| da1 | keep | Are guest folios (bills) and booking evidence digital, up to date and ready to use? | da1 | Made specific. |
| or1 | merge | Has a named person checked what PCI DSS (card payment security rules) requires here? | x-pay | Duplicate of the card-security question; standard name removed. |
| x-pay | keep | Has your IT or security contact checked that the tool and its vendor meet the card-data security rules your payment provider requires? | x-pay | Plain wording. |

# Human Resources

## hr-1 — Forecasting staff needs and scheduling shifts (all departments, including room attendants)

Review verdict: **Wrong** → treatment: **full rewrite**  
Sensitive flag: **when hr1-person=yes, hr1-person=dk**

**Gates ("How it works")**

- **G_LINK** (library): Does the tool need to connect to your hotel systems, such as booking, till or accounting?
  - Yes → a Doesn't apply answer on m4 becomes Don't know yet, with a note
  - No, it works on its own → hides Technology questions
  - Don't know yet → caps at Almost ready; action: Ask the vendor which hotel systems the tool must connect to.
- **hr1-person** (custom): Will the tool give shifts to each person based on their speed, past performance or personal traits?
  - Yes → raises sensitive flag
  - No, only by demand, availability and contract hours → no change
  - Don't know yet → raises sensitive flag; caps at Almost ready; action: Ask the vendor how the tool chooses which person gets which shift.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1a | B | People | General manager | Do department heads approve every rota before it is published? | Rotas affect every employee's life. | always |
| pe1b | I | People | General manager | Has HR agreed to own the scheduling tool? | Rules and contracts need one owner. | always |
| sk1a | I | Skills | Department head | Can department heads read a forecast of how many staff they need? | The forecast is the main value. | always |
| sk1b | I | Skills | Department head | Do department heads share weekends and late shifts fairly when adjusting rotas? | Unfair rotas drive staff to leave. | always |
| fi1 | N | Money | Finance | Do you know the cost per employee per month? | Priced per employee, so cost grows with team size. | always |
| te1a | B | Technology | IT | Does the tool receive occupancy and event forecasts from your booking and sales systems? | Staff needs follow occupancy and events. | hidden when G_LINK=no |
| te1b | I | Technology | IT | Does the tool send hours to time-recording and payroll? | Hours typed again cause pay errors. | hidden when G_LINK=no |
| da1a | B | Data | Department head | Do you have staff availability and contract hours in one system? | Rotas must respect what each person can work. | always |
| da1b | I | Data | Department head | Do you have at least a year of occupancy and covers history? | Staffing forecasts learn from history. | always |
| or1 | B | Rules and controls | General manager | Can you enter each person's contract hours and rest rules into the tool? | Rotas that ignore rest times exhaust staff. | always |
| or2 | I | Rules and controls | General manager | Have staff been told about the tool and asked for feedback before it starts? | Staff trust rotas they understand. | always |
| n1 | B | People | Department head | Does a manager make the final decision on each person's shifts? | The tool must not quietly disadvantage someone. | hr1-person=yes |
| n2 | I | People | Staff who use it | Can staff swap shifts or ask for changes easily in the tool? | Flexibility is a big reason staff stay. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | split | Is it agreed that department heads approve rotas (staff schedules) and HR owns the tool? | pe1a, pe1b | Double question split. |
| sk1 | split | Can the people involved read forecasts of staff needs, and do they know enough about fair scheduling? | sk1a, sk1b | Two skills split. |
| fi1 | keep | Do you know what the workforce-management (staff scheduling software) subscription per employee will cost your hotel? | fi1 | Jargon removed. |
| te1 | split | Is the tool linked to your property management system (PMS), point-of-sale system (POS), time and attendance, and payroll, or confirmed as possible? | te1a, te1b | Four links cut to two. |
| da1 | split | Are occupancy, covers (meals served), events, staff availability and contracts data digital, up to date and ready to use? | da1a, da1b | Five items cut to two. |
| or1 | rewrite | Has a named person checked what working-time law requires here? | or1 | Legal framing removed; practical setting kept. |
| or2 | rewrite | Has the works council (elected staff representatives) been consulted, and is this written down? | or2 | Legal consultation removed; practical staff step kept. |

## hr-2 — Recruiting with AI: chatting with applicants, screening and matching

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **always**

**Gates ("How it works")**

- **AUTO_PEOPLE** (automatic, not asked): applies G_PEOPLE=yes → adds PEOPLE_DECIDE, PEOPLE_EXPLAIN; raises sensitive flag
- **hr2-mode** (custom): What will the tool do with applicants?
  - Only answer their questions and book interviews → no change
  - Screen, rank or reject applicants → no change
  - Don't know yet → caps at Almost ready; action: Decide whether the tool will only chat, or also screen applicants.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Does the HR manager make every hiring decision? | Hiring decisions must stay with a person. | always |
| sk1 | B | Skills | Department head | Can HR check why the tool ranked or rejected an applicant? | You must be able to explain every rejection. | hr2-mode=screen |
| fi1 | N | Money | Finance | Do you know the cost per hire or per user? | Per-hire fees rise in busy seasons. | always |
| te1 | I | Technology | IT | Do you have an applicant tracking system linked to your careers page? | Applications must land in one place. | always |
| da1 | I | Data | Department head | Are your job descriptions written down with the real requirements for each role? | The tool screens against these. | always |
| n1 | I | Rules and controls | HR | Do applicants get a reply from a person when they ask about a decision? | Rejected applicants deserve an answer. | always |
| n2 | I | Data | HR | Have you checked that the tool does not favour applicants by age, gender or origin? | Biased screening loses good staff. | hr2-mode=screen |
| PEOPLE_EXPLAIN | I | People | HR | Can a person explain why the tool scored or ranked someone? | People accept decisions they can understand and question. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the HR manager reviews every hiring decision? | pe1 | Plain wording. |
| sk1 | fix | Do the people involved know enough about fair hiring, and can they check the AI's screening of candidates? | sk1 | Two skills cut to one. |
| fi1 | keep | Do you know what the subscription, per hire or per user, will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a careers website and an applicant tracking system (software that manages job applications), or has your provider confirmed it is possible? | te1 | Plain wording. |
| da1 | fix | Are job descriptions and candidate data digital, up to date and ready to use? | da1 | Candidate data part dropped. |
| or1 | remove | Has a named person checked what the EU AI Act requires of hotels that use AI in hiring, including human oversight (a person checking decisions)? | — | Legal topic (AI rules for hiring) out of scope; sensitive flag tells users to ask an adviser. |
| x-sens | remove | Has a data protection impact assessment (DPIA, a formal check of privacy risks) been done for this tool? | — | Legal topic (privacy assessment) out of scope. |

## hr-3 — Staff induction and training (AI-made courses, AI coaching, short lessons)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **when hr3-score=yes**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.
- **hr3-score** (custom): Will the tool score or rank individual staff on their training results?
  - Yes → raises sensitive flag
  - No → no change
  - Don't know yet → caps at Almost ready; action: Decide whether training results will rate individual staff.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the HR or training manager agreed to own training content? | Content goes out of date without an owner. | always |
| sk1 | N | Skills | Department head | Can that person check that AI-made lessons are correct and clear? | AI lessons can contain wrong procedures. | always |
| fi1 | N | Money | Finance | Do you know the cost of the learning platform? | Usually per user. | hidden when G_PAID=yes |
| te1 | I | Technology | IT | Can staff use the lessons on their phones or a staff app? | Hotel staff rarely sit at a computer. | always |
| da1 | B | Data | Department head | Are your work instructions and handbooks written down and current? | AI lessons are built from these. | always |
| or1 | I | Rules and controls | General manager | Is one person named to approve each lesson before staff see it? | Wrong lessons teach wrong habits. | always |
| n1 | N | Skills | Staff who use it | Are lessons available in the languages your staff speak? | Many hotel teams speak several languages. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the HR or training manager be in charge of this tool? | pe1 | Shortened. |
| sk1 | fix | Do the people involved know the basics of designing training courses (instructional design)? | sk1 | Jargon removed; check is the key skill. |
| fi1 | keep | Do you know what the learning-platform (online training software) subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a staff app or a learning management system (LMS, software for online training), or has your provider confirmed it is possible? | te1 | Jargon removed. |
| da1 | keep | Are your current standard operating procedures (SOPs, written work instructions) and handbooks digital, up to date and ready to use? | da1 | Jargon removed. |
| or1 | keep | Is it agreed who keeps the training content accurate? | or1 | Made specific. |

## hr-4 — Predicting which staff may leave, and analysing staff engagement

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **always**

**Gates ("How it works")**

- **AUTO_PEOPLE** (automatic, not asked): applies G_PEOPLE=yes → adds PEOPLE_DECIDE, PEOPLE_EXPLAIN; raises sensitive flag
- **hr4-named** (custom): Will the tool show predictions about named individual staff?
  - Yes → no change
  - No, only team-level results → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether predictions can be seen per person.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | I | Skills | Department head | Can HR discuss a prediction with a manager without labelling the person? | A "likely to leave" label can become self-fulfilling. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost? | Usually per employee. | always |
| te1 | I | Technology | IT | Do you have staff records software and survey results the tool can read? | Predictions need staff history and surveys. | always |
| da1 | I | Data | Department head | Do you have at least two years of staff records, including who left? | Predictions learn from past leavers. | always |
| or2 | B | Rules and controls | General manager | Have staff been told about the tool and asked for feedback before it starts? | Secret staff predictions destroy trust. | always |
| n1 | B | Rules and controls | HR | Is it written that predictions are never used alone for promotion or dismissal? | Predictions are guesses about people. | always |
| n2 | B | Rules and controls | HR | Is it agreed who may see predictions about named staff? | A manager who sees a "likely to leave" label may treat the person differently. | hr4-named=yes |
| PEOPLE_DECIDE | B | People | HR | Does a person make every final decision about a person? | Decisions about people must stay with people. | always |
| PEOPLE_EXPLAIN | I | People | HR | Can a person explain why the tool scored or ranked someone? | People accept decisions they can understand and question. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the HR manager be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | fix | Can the people involved interpret predictions with care? | sk1 | Made concrete. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have an HR information system (HRIS, staff records software) and staff engagement data, or has your provider confirmed it is possible? | te1 | Jargon removed. |
| da1 | keep | Is your employee data over time (its history) digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | remove | Has a named person checked what the law requires on monitoring and profiling employees? | — | Legal topic out of scope; sensitive flag tells users to ask an adviser. |
| or2 | rewrite | Have the works council or staff representatives been consulted, and is this written down? | or2 | Legal consultation removed; practical staff step kept. |
| x-sens | remove | Has a data protection impact assessment (DPIA, a formal check of privacy risks) been done for this tool? | — | Legal topic (privacy assessment) out of scope. |

## hr-5 — Matching seasonal staff to hotels

Review verdict: **Wrong** → treatment: **full rewrite**  
Sensitive flag: **always**

**Gates ("How it works")**

- **AUTO_PEOPLE** (automatic, not asked): applies G_PEOPLE=yes → adds PEOPLE_DECIDE, PEOPLE_EXPLAIN; raises sensitive flag
- **hr5-auto** (custom): Will the tool place staff in hotels without a manager confirming each match?
  - Yes → caps at Almost ready; action: Make sure a manager confirms each match before it is final.
  - No, a manager confirms each match → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether matches need confirmation.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Does the HR or cluster manager check and confirm every match? | Matching decides where people live and work. | always |
| sk1 | I | Skills | Department head | Can that person spot a match that ignores a person's wishes or limits? | Bad matches lead to early quitting. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost? | Usually per user or per hotel. | always |
| te1 | I | Technology | IT | Do you have staff records software the tool can read? | Matching uses staff records. | always |
| da1 | B | Data | Department head | Are staff skills, languages and availability recorded for each person? | Matching is only as good as these records. | always |
| or1 | I | Rules and controls | General manager | Can staff see why they were matched to a hotel and ask for a change? | Staff accept matches they understand. | always |
| n1 | I | People | HR | Is housing or travel for seasonal staff arranged with each match? | Seasonal staff need a place to live. | always |
| PEOPLE_EXPLAIN | I | People | HR | Can a person explain why the tool scored or ranked someone? | People accept decisions they can understand and question. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the HR manager or cluster manager (who oversees several hotels) checks and confirms matches? | pe1 | Jargon explained. |
| sk1 | fix | Do the people involved know enough about staff planning? | sk1 | Vague skill made concrete. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have an HR information system (HRIS, staff records software), or has your provider confirmed it is possible? | te1 | Jargon removed. |
| da1 | keep | Are data on staff skills, languages and availability digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | rewrite | Has a named person checked what the law requires on employee data and consent? | or1 | Legal consent removed; practical fairness step kept. |
| x-sens | remove | Has a data protection impact assessment (DPIA, a formal check of privacy risks) been done for this tool? | — | Legal topic (privacy assessment) out of scope. |

## hr-6 — Face or fingerprint time clocks for staff attendance

Review verdict: **Wrong** → treatment: **full rewrite**  
Sensitive flag: **always**

**Gates ("How it works")**

- **hr6-store** (custom): Are face or fingerprint patterns stored only on the device or the staff card?
  - Yes, only on the device or card → no change
  - No, in a central database → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor where face or fingerprint patterns are stored.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1a | I | People | General manager | Has the HR manager agreed to own the time clocks? | Clocks affect pay. | always |
| pe1b | B | People | General manager | Can staff choose a card or PIN instead of face or fingerprint? | Many staff object to biometrics. | always |
| sk1 | I | Skills | Department head | Does IT know how to delete a person's face or fingerprint pattern when they leave? | Patterns of former staff must not stay in the system. | always |
| te1 | B | Technology | IT | Do the clocks send hours to payroll and scheduling? | Retyped hours cause pay errors. | always |
| da1 | I | Data | Department head | Are attendance records kept in one place and checked against rotas? | Attendance must match planned shifts. | always |
| or1 | I | Rules and controls | General manager | Have you written down why a card or PIN alone is not enough? | If a card works, biometrics add risk for no gain. | always |
| x-hw | B | Money | Owner | Is the money approved to buy or lease, install and maintain the clocks? | Terminals are a one-off cost. | always |
| n1 | I | People | Staff who use it | Have staff been told about the clocks and asked for feedback before they start? | Biometric clocks worry staff. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | split | Is it agreed that the HR manager owns the system and that staff are offered a card or PIN instead? | pe1a, pe1b | Two ideas split. |
| sk1 | fix | Can the people involved handle biometric data (face or fingerprint data) correctly? | sk1 | Vague skill made concrete. |
| fi1 | merge | Do you know what the terminals (clock-in devices) and subscription will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | keep | Are the terminals linked to payroll and scheduling, or has your provider confirmed it is possible? | te1 | Plain wording. |
| da1 | rewrite | Are staff biometric templates (stored face or fingerprint data) and attendance records digital, up to date and ready to use? | da1 | Nonsense "templates ready" question removed; practical record kept. |
| or1 | rewrite | Have you checked in writing that a card or PIN would not be enough, and informed staff representatives? | or1 | Legal parts removed; practical need check kept. |
| x-hw | keep | Is the money for buying or leasing, installing and maintaining the equipment approved as a capital budget (long-term investment)? | x-hw | Plain wording. |
| x-sens | remove | Has a data protection impact assessment (DPIA, a formal check of privacy risks) been done for this tool? | — | Legal topic (privacy assessment) out of scope. |

# General Management & Administration

## gm-1 — Business performance dashboards (KPIs) with AI analysis

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Have the GM and department heads agreed to use the dashboard in weekly meetings? | Dashboards help only when used to decide. | always |
| pe2 | B | People | General manager | Is one person named to decide how each key figure is calculated? | Different definitions make figures unreliable. | always |
| sk1 | I | Skills | Department head | Can managers question a figure or AI comment that looks wrong? | AI comments can sound right and be wrong. | always |
| fi1 | N | Money | Finance | Do you know the cost of the reporting software? | Usually per user. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Does the dashboard receive data from your booking, finance and till systems automatically? | Manual uploads make dashboards stale. | always |
| or1 | I | Rules and controls | General manager | Is one person named to act on each alert? | Alerts without owners change nothing. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the general manager (GM) and department heads will use it? | pe1 | Made specific. |
| pe2 | keep | Is there one named owner for how key performance indicators (KPIs) are defined? | pe2 | Jargon removed. |
| sk1 | keep | Can the people involved read dashboards and question what they show? | sk1 | Shortened. |
| fi1 | keep | Do you know what the business intelligence (BI, reporting software) subscription will cost your hotel? | fi1 | Acronym removed. |
| te1 | keep | Do you have data feeds from your property management system (PMS), finance and point-of-sale system (POS), or has your provider confirmed it is possible? | te1 | Acronyms removed. |
| da1 | merge | Do you have agreed key performance indicator (KPI) definitions and clean data that is digital, up to date and ready to use? | pe2 | Definitions covered by pe2. |
| or1 | keep | Is a named person responsible for acting on each alert or report? | or1 | Plain wording. |

## gm-2 — Generative AI assistants for managers and head-office staff

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | B | Skills | Department head | Do managers check AI answers before using them in decisions or emails? | AI assistants make up facts confidently. | always |
| fi1 | N | Money | Finance | Do you know the licence cost per user? | Usually per user per month. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Is the business version set up in your company's own account? | Business versions keep your data out of public tools. | always |
| da1 | I | Data | Department head | Are document access rights set so the assistant shows people only what they may see? | The assistant can surface documents to the wrong person. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will managers and head-office staff be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | fix | Do the people involved know how to write prompts (instructions to the AI), and can they check its answers? | sk1 | Prompting part dropped. |
| fi1 | keep | Do you know what the licence per user will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have the enterprise version set up in your company's own account (tenant), or has your provider confirmed it is possible? | te1 | Jargon "tenant" removed. |
| da1 | fix | Are company documents digital, up to date and ready to use, with access rights (who may see what) set? | da1 | Two ideas cut to one. |
| or1 | merge | Is there a written AI-use policy, and a written rule that no confidential data goes into public AI tools? | m9 | Rules on what not to type into AI tools are must-have 9. |

## gm-3 — Meeting, briefing and report automation

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| sk1 | B | Skills | Department head | Does someone check every summary or report before it is shared? | Summaries can drop or invent points. | always |
| fi1 | N | Money | Finance | Do you know the cost of the add-on? | Often an add-on to reporting. | hidden when G_PAID=yes |
| te1 | I | Technology | IT | Can the tool read data from your booking system or reports? | Briefings need daily figures. | always |
| da1 | I | Data | Department head | Are daily figures, such as arrivals and VIPs, available each morning? | Briefings use these figures. | always |
| n1 | N | Rules and controls | General manager | Is it agreed which meetings may be recorded for summaries? | Staff speak less freely when recorded. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | merge | Will the general manager (GM) and department heads be in charge of this tool? | m1 | Owner is must-have 1. |
| sk1 | keep | Can the people involved check that the summaries are correct? | sk1 | Shortened. |
| fi1 | keep | Do you know what the add-on to your property management system (PMS) or business intelligence (BI) reporting will cost your hotel? | fi1 | Acronyms removed. |
| te1 | keep | Can the tool access data in your property management system (PMS) or business intelligence (BI) reporting, or has your provider confirmed it is possible? | te1 | Acronyms removed. |
| da1 | keep | Is your daily operating data digital, up to date and ready to use? | da1 | Made specific. |
| or1 | merge | Do staff know that a person must read and correct the AI’s text before it is used? | sk1 | Same as sk1. |

## gm-4 — Company-wide AI and data platforms in hotel groups

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **gm4-group** (custom): How many hotels will share this platform?
  - Only our hotel → not-a-fit message: This use case is for hotel groups. Consider "AI assistants for managers" or "Business performance dashboards" instead.
  - Several hotels in our group → no change
  - Don't know yet → caps at Almost ready; action: Check with head office whether a group platform is planned.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Is one group AI lead named, with a central team behind them? | Three owners means no owner. | always |
| sk1 | I | Skills | Department head | Does the central team include people who connect systems and manage data? | Platforms fail on data, not AI. | always |
| fi1 | I | Money | Finance | Is a multi-year budget for the programme agreed at group level? | This is a large programme. | always |
| te1 | B | Technology | IT | Do your hotels' systems already send data to one central place? | No central data, no platform. | always |
| da1 | I | Data | Department head | Do all hotels in the group use the same definitions for key figures? | Comparing hotels needs the same definitions. | always |
| or1a | I | Rules and controls | General manager | Is there a written group plan for which AI uses come first? | Without priorities, money spreads thin. | always |
| or1b | I | Rules and controls | General manager | Is each new AI use reviewed for risk before it starts? | A central check stops repeated mistakes. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | fix | Will the group AI lead, central AI team and steering committee be in charge of this tool? | pe1 | Three owners cut to one. |
| sk1 | fix | Do the people involved know enough about data engineering, AI architecture (how AI systems are built and connected) and governance (rules and oversight)? | sk1 | Jargon removed. |
| fi1 | fix | Do you know what this will cost your hotel, given it needs a large programme budget? | fi1 | Commentary turned into a question. |
| te1 | keep | Do you have a cloud data platform and an integration layer (software connecting your systems), or has your provider confirmed it is possible? | te1 | Jargon removed. |
| da1 | keep | Is there a group-wide data model and data catalogue (shared definitions and list of data) that is digital, up to date and ready to use? | da1 | Jargon removed. |
| or1 | split | Do you have a written AI strategy, a centre of excellence (central expert team) and a risk review for each use case? | or1a, or1b | Three ideas cut to two. |

## gm-5 — Reporting to owners and asset managers

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the asset manager or finance lead agreed to own owner reports? | Owners judge the hotel on these reports. | always |
| sk1 | N | Skills | Department head | Does that person know the report format each owner expects? | Owners compare hotels in their own format. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost? | Usually per hotel. | hidden when G_PAID=yes |
| te1 | B | Technology | IT | Does the tool receive data from every operator or management company automatically? | Manual collection is the work you want to remove. | always |
| da1 | B | Data | Department head | Do all operators use the same account codes, or is there a mapping between them? | Different codes make hotels impossible to compare. | always |
| or1 | I | Rules and controls | General manager | Is there a written owner-operator agreement on what data is shared? | Operators may refuse data without it. | always |
| n1 | I | Rules and controls | Finance | Does a person check every owner report before it is sent? | Owners act on these numbers. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the asset manager or finance lead be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Do the people involved know enough about the standards for reporting to owners? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have data feeds from several operators (hotel management companies), or has your provider confirmed it is possible? | te1 | Jargon explained. |
| da1 | keep | Is one consistent chart of accounts (list of account codes) used across operators, and is it digital, up to date and ready to use? | da1 | Jargon removed. |
| or1 | keep | Is there a written agreement between owner and operator on sharing data? | or1 | Plain wording. |

## gm-6 — Assistant answering frontline staff questions on handbooks and procedures

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.
- **G_LINK** (library): Does the tool need to connect to your hotel systems, such as booking, till or accounting?
  - Yes → a Doesn't apply answer on m4 becomes Don't know yet, with a note
  - No, it works on its own → hides Technology questions
  - Don't know yet → caps at Almost ready; action: Ask the vendor which hotel systems the tool must connect to.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Have department heads agreed to keep their procedures current in the assistant? | Old procedures give staff wrong answers. | always |
| fi1 | N | Money | Finance | Do you know the cost of the staff-app add-on? | Usually per user. | hidden when G_PAID=yes |
| te1 | I | Technology | IT | Can frontline staff reach the assistant on their phones or a shared device? | Frontline staff rarely sit at a desk. | hidden when G_LINK=no |
| da1 | B | Data | Department head | Are your handbooks and work instructions written down and current? | The assistant answers from these only. | always |
| n1 | I | Skills | Department head | Does the assistant show which handbook page each answer comes from? | Staff can check answers before acting. | always |
| n2 | N | Skills | Staff who use it | Can staff ask questions in their own language? | Many frontline teams speak several languages. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that department heads keep the content up to date? | pe1 | Overlap with or1 merged here. |
| sk1 | merge | Do the people involved know enough about keeping content up to date? | pe1 | Same as pe1. |
| fi1 | keep | Do you know what the staff-app add-on will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a staff app, or has your provider confirmed it is possible? | te1 | Made specific. |
| da1 | keep | Are your handbooks and standard operating procedures (SOPs, written work instructions) up to date, digital and ready to use? | da1 | Jargon removed. |
| or1 | merge | Is it written down who updates the content? | pe1 | Same as pe1. |

## gm-7 — Internal tools built with AI coding assistants

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_LINK** (library): Does the tool need to connect to your hotel systems, such as booking, till or accounting?
  - Yes → a Doesn't apply answer on m4 becomes Don't know yet, with a note
  - No, it works on its own → hides Technology questions
  - Don't know yet → caps at Almost ready; action: Ask the vendor which hotel systems the tool must connect to.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Does each tool built this way have one named person who maintains it? | Tools without an owner break and stay broken. | always |
| pe2 | B | People | General manager | Does IT review each tool before staff use it? | Home-made tools can open security holes. | always |
| sk1 | I | Skills | Department head | Can the builders read, test and fix what the coding assistant writes? | Code no one understands cannot be maintained. | always |
| fi1 | N | Money | Finance | Do you know the cost of the coding assistant and the staff time? | Staff time is the larger cost. | always |
| te1a | I | Technology | IT | Can the tools connect to your systems through approved links? | Unapproved connections are a security risk. | hidden when G_LINK=no |
| te1b | I | Technology | IT | Is there a safe place approved by IT to run the tools? | Tools on personal laptops get lost. | hidden when G_LINK=no |
| da1 | B | Data | Department head | Does each tool use only the data it needs, with no guest or staff data unless IT agrees? | Less data means less damage if something leaks. | always |
| or1a | I | Rules and controls | General manager | Are there written rules on what staff may build? | Stops risky tools being built. | always |
| or1b | I | Rules and controls | General manager | Is it agreed who takes over a tool when its builder leaves? | Tools must outlive their builder. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Does each tool built this way have one named owner who maintains it? | pe1 | Kept. |
| pe2 | keep | Is it agreed that IT reviews each tool before it is used? | pe2 | Shortened. |
| sk1 | keep | Do the people involved have enough technical skill to read, test and maintain what the assistant writes? | sk1 | Shortened. |
| fi1 | keep | Do you know what the coding-assistant subscription and staff time will cost your hotel? | fi1 | Shortened. |
| te1 | split | Can the tools access your systems' APIs (links that let systems exchange data), and is there a safe place to run and store them, or is this confirmed as possible? | te1a, te1b | Two ideas split; jargon "APIs" removed. |
| da1 | fix | Is it written down that each tool gets only the data it needs, and no guest or staff data without an agreement? | da1 | Legal "agreement" replaced with IT approval. |
| or1 | split | Are there written rules on what staff may build, who checks security and data protection, and who maintains a tool when its builder leaves? | or1a, or1b | Triple question cut to two; data-protection wording removed. |

# IT & Security

## it-1 — AI threat detection and automatic response (network, email, computers and phones)

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the IT lead or an outside security provider agreed to watch alerts around the clock? | Attacks happen at night and weekends. | always |
| sk1 | I | Skills | Department head | Does that team know how to respond when an attack is detected? | Detection without response does not stop attacks. | always |
| fi1 | N | Money | Finance | Do you know the cost per device or per user? | Cost grows with devices. | always |
| te1 | B | Technology | IT | Does the tool cover the network, email and staff computers and phones at every site? | One unprotected site is enough for an attacker. | always |
| da1 | I | Data | Department head | Do your systems keep activity records the tool can read? | The tool spots attacks in these records. | always |
| or1 | B | Rules and controls | General manager | Do you have a written plan for what staff do when a serious alert comes in? | A clear plan cuts damage from hours to minutes. | always |
| n1 | I | Rules and controls | IT | Is it agreed which hotel systems the tool may never shut down by itself, such as door locks? | Cutting off locks or payments hurts guests. | G_ACT=acts |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the IT or security lead, or an outside managed security provider, be in charge of this tool? | pe1 | Made specific. |
| sk1 | keep | Do the people involved know enough about security operations (watching for and responding to attacks)? | sk1 | Jargon removed. |
| fi1 | keep | Do you know what the subscription per device or per user will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Does the tool cover the network, email and endpoints (computers and phones) at all your properties, or has your provider confirmed it can? | te1 | Jargon removed. |
| da1 | keep | Are logs and telemetry (records of system activity) digital, up to date and ready to use? | da1 | Jargon removed. |
| or1 | rewrite | Do you have a written incident-response plan and written duties for reporting data breaches? | or1 | Legal breach-reporting removed; practical response plan kept. |
| x-auto | merge | Are there written limits on what the tool may do by itself, and a named person who can switch it off? | ACT_LIMITS, ACT_OFF | Comes from the "acts by itself" gate. |

## it-2 — AI help desk for IT problems

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the IT team agreed to own the AI help desk? | Answers need an IT owner. | always |
| sk1 | N | Skills | Department head | Does the IT team know how to turn common problems into help-desk answers? | The AI answers from these. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost? | Usually per user. | always |
| te1 | I | Technology | IT | Do you have a system that logs IT requests? | Requests the AI cannot solve must go somewhere. | always |
| da1 | B | Data | Department head | Are common IT fixes written down in one place? | The AI gives only the fixes it has. | always |
| or1 | B | Rules and controls | General manager | Must a person approve password resets and access changes the AI suggests? | A wrong reset can let an attacker in. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the IT team be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Do the people involved know enough about how an IT service desk (help desk) works? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Do you have a ticketing system (software that logs IT requests), or has your provider confirmed it is possible? | te1 | Jargon explained. |
| da1 | keep | Is there a knowledge base of IT fixes that is digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | rewrite | Do staff know that a person must read and correct the AI’s text before it is used? | or1 | Copied text-check question replaced with the real risk. |

## it-3 — Detecting booking fraud: fake reservations, criminals posing as booking sites, online card fraud

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the revenue or IT security lead agreed to own booking-fraud checks? | Fraud attempts need fast decisions. | always |
| sk1 | I | Skills | Department head | Can staff tell a fake booking-site message from a real one? | Fake booking-site messages are a common attack on hotels. | always |
| fi1 | N | Money | Finance | Do you know the cost, or whether your payment tools already include it? | Often included in payment tools. | always |
| te1 | B | Technology | IT | Can the tool see bookings from your booking engine, booking sites and payment systems? | Fraud shows across these systems. | always |
| da1 | I | Data | Department head | Do you keep records of past fraud cases? | The tool learns from them. | always |
| or2 | I | Rules and controls | General manager | Do staff get regular training on fake emails and messages? | Most fraud starts with a fake message. | always |
| x-pay | I | Rules and controls | IT | Has IT checked the tool meets your payment provider's card-security requirements? | The tool handles card data. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the revenue-integrity lead (who checks revenue is correctly collected) or IT security lead be in charge of this tool? | pe1 | Jargon removed. |
| sk1 | keep | Do the people involved know enough about reviewing possible fraud? | sk1 | Made specific. |
| fi1 | keep | Do you know what this will cost your hotel, as a subscription or as part of your payment tools? | fi1 | Shortened. |
| te1 | keep | Can the tool link to your booking engine, online travel agency (OTA) extranet (booking sites' hotel portal) and payment systems, or is this confirmed as possible? | te1 | Jargon removed. |
| da1 | keep | Are booking and payment data digital, up to date and ready to use? | da1 | Readiness phrase replaced. |
| or1 | merge | Has a named person checked what PCI DSS (card payment security rules) requires here? | x-pay | Duplicate of the card-security question; standard name removed. |
| or2 | keep | Is staff training against phishing (fake emails and messages) in place and written down? | or2 | Jargon removed. |
| x-pay | keep | Has your IT or security contact checked that the tool and its vendor meet the card-data security rules your payment provider requires? | x-pay | Plain wording. |

## it-4 — AI analysis of security camera video

Review verdict: **Wrong** → treatment: **full rewrite**  
Sensitive flag: **always**

**Gates ("How it works")**

- **it4-face** (custom): Will the tool recognise who people are from their faces?
  - Yes → raises sensitive flag; caps at Almost ready; action: Ask an adviser before a pilot that recognises faces.
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor whether the tool recognises faces.
- **it4-staff** (custom): Will the tool analyse staff behaviour, mood or performance?
  - Yes → raises sensitive flag; caps at Almost ready; action: Ask an adviser before analysing staff behaviour on camera.
  - No → no change
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool analyses about staff.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the security manager agreed to own the camera alerts? | Alerts need an owner. | always |
| sk1 | B | Skills | Department head | Is someone available to check every alert at any hour? | Unchecked alerts give false safety. | always |
| te1 | B | Technology | IT | Are your security cameras and video storage able to run the analysis software? | Older cameras often cannot. | always |
| or1 | I | Rules and controls | General manager | Is it decided what the tool will look for, such as falls, fire or blocked exits? | A clear purpose keeps the tool from watching everything. | always |
| x-hw | B | Money | Owner | Is the money approved for any new cameras and the software? | Camera upgrades can be costly. | always |
| n1 | I | Data | IT | Is it decided how long video and alerts are kept, and who can see them? | Fewer copies, less risk. | always |
| n2 | B | Rules and controls | Department head | Does a person decide what to do about each alert, not the tool? | Wrong alerts must not lead to action against guests or staff. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the security manager be in charge of this tool? | pe1 | Shortened. |
| sk1 | fix | Can the people involved monitor alerts? | sk1 | Made specific. |
| fi1 | merge | Do you know what the camera upgrades (a capital investment) plus software will cost your hotel? | x-hw | Merged into the equipment budget question. |
| te1 | keep | Do you have a CCTV (security camera) network and video storage, or has your provider confirmed it is possible? | te1 | Jargon "CCTV" explained. |
| da1 | remove | Is your video data digital, up to date and ready to use? | — | Nonsense "video data up to date" question removed. |
| or1 | rewrite | Has a named person checked what data protection law asks for video surveillance, and whether any biometric use is allowed? | or1 | Legal parts removed; practical purpose kept. |
| x-hw | keep | Is the money for buying or leasing, installing and maintaining the equipment approved as a capital budget (long-term investment)? | x-hw | Plain wording. |
| x-sens | remove | Has a data protection impact assessment (DPIA, a formal check of privacy risks) been done for this tool? | — | Legal topic (privacy assessment) out of scope. |

## it-5 — AI network management for guest and staff Wi-Fi

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_ACT** (library): When the tool has a result, what happens next?
  - It suggests, and a person decides → no change
  - It acts by itself, within set limits → adds ACT_LIMITS, ACT_OFF
  - Don't know yet → caps at Almost ready; action: Ask the vendor what the tool can do without a person approving it.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the IT team or network provider agreed to own Wi-Fi management? | Wi-Fi is a top guest complaint. | always |
| sk1 | N | Skills | Department head | Does that team know how to read Wi-Fi performance reports? | Reports show where guests struggle. | always |
| fi1 | N | Money | Finance | Do you know the cost per Wi-Fi access point? | Priced per access point. | always |
| te1 | B | Technology | IT | Can your Wi-Fi equipment be managed centrally? | Older equipment cannot. | always |
| da1 | I | Data | Department head | Does your Wi-Fi equipment record how well the network performs? | The tool learns from these records. | always |
| or1 | I | Rules and controls | General manager | Is one person named to act on Wi-Fi alerts during busy times? | Slow Wi-Fi during conferences costs bookings. | always |
| n1 | I | Technology | IT | Are guest and staff Wi-Fi kept on separate networks? | A guest device must never reach staff systems. | always |
| ACT_LIMITS | B | Rules and controls | General manager | Are the tool's limits written down, such as the biggest change it may make alone? | A tool that acts alone needs clear limits before it starts. | G_ACT=acts |
| ACT_OFF | B | Rules and controls | General manager | Can one named person switch the tool off at any time? | When it goes wrong, someone must be able to stop it at once. | G_ACT=acts |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the IT team or network provider be in charge of this tool? | pe1 | Shortened. |
| sk1 | keep | Do the people involved know enough about network management? | sk1 | Plain wording. |
| fi1 | keep | Do you know what the subscription per access point (each Wi-Fi transmitter) will cost your hotel? | fi1 | Jargon explained. |
| te1 | keep | Do you have managed network hardware (equipment that can be controlled centrally), or has your provider confirmed it is possible? | te1 | Plain wording. |
| da1 | keep | Is network telemetry (data on how the network is performing) digital, up to date and ready to use? | da1 | Jargon removed. |
| or1 | fix | Is a named person responsible for acting on each alert or report? | or1 | Made specific. |

# Sustainability & Governance

## lg-1 — Collecting and reporting sustainability (ESG) and carbon data

Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the sustainability or engineering lead agreed to own the data and reports? | Reports need one owner. | always |
| sk1 | N | Skills | Department head | Does that person know which sustainability reports your owner, brand or lenders ask for? | Reports differ by who asks. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost, or whether a free platform is available in your country? | Free platforms exist in some countries. | hidden when G_PAID=yes |
| te1 | I | Technology | IT | Do meter and supplier data reach the tool automatically? | Typing in bills takes days each quarter. | always |
| da1 | B | Data | Department head | Do you record energy, water and waste for each hotel every month? | Reports need monthly figures. | always |
| or1 | I | Rules and controls | General manager | Is it agreed which reports must go out, to whom and by when? | Missed deadlines with owners or brands cause problems. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Will the sustainability or engineering lead be in charge of this tool? | pe1 | Shortened. |
| sk1 | fix | Do the people involved know enough about ESG (environmental, social and governance) reporting standards? | sk1 | Jargon removed; legal standards angle removed. |
| fi1 | keep | Do you know what a subscription will cost your hotel, or whether a free public platform exists in your country? | fi1 | Shortened. |
| te1 | keep | Do you have data feeds from meters and suppliers, or has your provider confirmed it is possible? | te1 | Plain wording. |
| da1 | keep | Are energy, water and waste data for each property digital, up to date and ready to use? | da1 | Readiness phrase removed. |
| or1 | rewrite | Has a named person checked which reporting duties the law sets in each country? | or1 | Legal reporting duties removed; practical report plan kept. |

## lg-2 — Tools for handling guests' requests about their personal data

Renamed from: Tools for handling personal-data requests (GDPR) and AI Act compliance  
Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_LINK** (library): Does the tool need to connect to your hotel systems, such as booking, till or accounting?
  - Yes → a Doesn't apply answer on m4 becomes Don't know yet, with a note
  - No, it works on its own → hides Technology questions
  - Don't know yet → caps at Almost ready; action: Ask the vendor which hotel systems the tool must connect to.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Is one person named to handle guests' requests about their personal data? | Requests have deadlines and need one owner. | always |
| sk1 | I | Skills | Department head | Does that person know where guest data is kept in your hotel systems? | Requests need every copy found. | always |
| fi1 | N | Money | Finance | Do you know the subscription cost? | Usually a subscription. | always |
| te1 | B | Technology | IT | Can the tool search the systems that hold guest data? | Otherwise staff search by hand. | hidden when G_LINK=no |
| da1 | B | Data | Department head | Do you have a list of every system that holds guest data? | The tool can only search systems it knows. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | fix | Will the data protection officer or legal lead be in charge of this tool? | pe1 | Legal role names removed. |
| sk1 | fix | Do the people involved know enough about privacy law? | sk1 | Legal knowledge removed; practical knowledge kept. |
| fi1 | keep | Do you know what the subscription will cost your hotel? | fi1 | Shortened. |
| te1 | keep | Can the tool link to the systems that hold guest data, or has your provider confirmed it is possible? | te1 | Plain wording. |
| da1 | keep | Is there a data map (list of where guest data is kept) covering all guest data, digital, up to date and ready to use? | da1 | Jargon "data map" explained. |
| or1 | remove | Has a named person checked what data protection law (GDPR, Swiss FADP or UK GDPR) asks of your hotel here? | — | Legal topic (data-protection law) out of scope; covered by the fixed disclaimer. |

## lg-3 — Generative AI for reviewing contracts

Renamed from: Generative AI for contract review and legal support  
Review verdict: **Good** → treatment: **polish**  
Sensitive flag: **no**

**Gates ("How it works")**

- **G_PAID** (library): Is the tool already paid for or free, so no new spending is needed?
  - Yes, no new spending → hides Money questions
  - No, it needs new money → a Doesn't apply answer on m2 becomes Don't know yet, with a note
  - Don't know yet → caps at Almost ready; action: Check whether you already pay for this tool, or what it would cost.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | B | People | General manager | Does the contracts or purchasing lead check every AI contract review? | AI can miss a risky clause. | always |
| sk1 | I | Skills | Department head | Does that person know your contract terms well enough to check the AI's review? | Checks need someone who knows your standard terms. | always |
| fi1 | N | Money | Finance | Do you know the licence cost per user? | Usually per user. | hidden when G_PAID=yes |
| da1 | I | Data | Department head | Are your contract templates and standard positions written down? | The AI compares contracts against these. | always |
| or1 | B | Rules and controls | General manager | Is it written that contracts go only into the company's approved AI tool? | Contracts in public AI tools can leak. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | keep | Is it agreed that the legal or purchasing lead checks what the tool produces? | pe1 | Plain wording. |
| sk1 | fix | Do the people involved know enough contract law to check the AI's review? | sk1 | "Contract law" replaced with "contract terms". |
| fi1 | keep | Do you know what the licence per user will cost your hotel? | fi1 | Shortened. |
| te1 | remove | Is it confirmed that this works without a link to your hotel systems? | — | No hotel-system link needed; question gave no information. |
| da1 | keep | Are your contract templates and playbook (your standard negotiating positions) digital, up to date and ready to use? | da1 | Jargon "playbook" explained. |
| or1 | keep | Is there a written rule on keeping contracts confidential when they are used in AI tools? | or1 | Plain wording. |

## lg-4 — Rules and oversight for using AI

Review verdict: **Needs fixes** → treatment: **fixes applied**  
Sensitive flag: **no**

**Gates ("How it works")**

- **lg4-scope** (custom): Who will the AI rules cover?
  - Our hotel only → no change
  - Our whole group → no change
  - Don't know yet → caps at Almost ready; action: Decide whether the rules cover one hotel or the group.

**v3 questions** (B blocker, I important, N nice to have)

| ID | W | Area | Who answers | Question | Why it matters | Shown when |
|---|---|---|---|---|---|---|
| pe1 | I | People | General manager | Has the general manager or group AI lead agreed to own the AI rules? | Rules need a senior owner. | always |
| pe2 | I | People | General manager | Have staff been asked for feedback on the draft AI rules? | Rules staff helped shape are followed. | always |
| sk1 | N | Skills | Department head | Can the owner write short, clear rules staff will read? | Long rules are ignored. | always |
| fi1 | N | Money | Finance | Is staff time set aside to write and update the rules? | Rules go stale as tools change. | always |
| da1 | B | Data | Department head | Do you have a list of every AI tool staff use, including free ones? | You cannot set rules for tools you do not know about. | always |
| or1a | I | Rules and controls | General manager | Is it agreed who approves the AI rules? | Approval gives the rules weight. | always |
| or1b | I | Rules and controls | General manager | Is it agreed how every staff member will be told the rules? | Rules no one hears about do nothing. | always |
| n1 | I | Rules and controls | General manager | Is a date set to review the rules each year? | AI tools change fast. | always |

**What happened to each original question**

| Old ID | Action | Original (workbook suggested wording) | Now | Reason |
|---|---|---|---|---|
| pe1 | fix | Will the general manager (GM) or group AI lead be in charge of this tool? | pe1 | "In charge of this tool" fixed: this is not a tool. |
| pe2 | rewrite | If you have a works council or staff representatives, have they been involved in writing the AI rules? | pe2 | Legal works-council framing removed. |
| sk1 | fix | Do the people involved have basic AI knowledge (AI literacy), and do they know enough about writing policies? | sk1 | Staff training moved to must-have 11. |
| fi1 | keep | Is staff time set aside for writing the AI rules and keeping them up to date? | fi1 | Kept. |
| da1 | keep | Is there a list of the AI tools in use that is digital, up to date and ready to use? | da1 | Free tools added. |
| or1 | split | Is it agreed who approves the AI rules and how all staff are told about them? | or1a, or1b | Two ideas split. |

# None of these fits

Asks all five library gates (exception to the 1-2 gate rule) because the use case is unknown.

Gates asked: G_ACT, G_GUEST, G_PEOPLE, G_LINK, G_PAID

- [I] Has the department that will use the tool agreed to try it? — why: Tools pushed on a team without its agreement go unused.
- [I] Can the people using it tell when its result is wrong? — why: Someone must catch mistakes before they matter.
- [N] Do you know the monthly cost and any set-up fee? — why: Hidden set-up fees often double the first-year cost.
- [B] Can the tool get the data it needs from your systems without retyping? — why: Retyping data removes most of the time saved.
- [B] Is the information the tool works from written down and current? — why: The tool repeats whatever it is given, right or wrong.
- [I] Is it written down what the tool may and may not be used for? — why: A clear purpose stops the tool drifting into risky uses.
