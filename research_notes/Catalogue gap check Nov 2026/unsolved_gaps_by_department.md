# Unsolved gaps by department: hotel tasks with no adequate AI solution yet

Checked 20 Nov 2026. Starting point: the Use-Case Catalogue (`tools/use-case-catalogue/index.html`, 95 uses, 15 departments). This note looks for the opposite of the catalogue: recurring hotel tasks and pain points for which we found **no deployed AI product**, or only pilots, demos and vendor claims.

**How to read this note**

- **Status codes.** (a) product exists and is deployed in hotels: candidate for the catalogue. (b) emerging: pilots, demos or vendor claims only. (c) gap: we found nothing credible. (d) AI unlikely to solve it soon, with the reason.
- **"No product found" is a finding about our search, not proof that nothing exists.** Each department section lists the searches run. All searches were English or German web searches on 20 Nov 2026; a vendor that does not publish in trade press would be missed.
- **Sources** are listed once at the end with an ID (G1, G2 …), the exact claim, date, type and whether the page was **opened** in this session or is a **search result only** (a lead, not verified). Catalogue source IDs (S1, A3, P1 …) refer to the catalogue's own source list and are not repeated here.
- **AI Act level is our reading**, not legal advice. It needs D7 sign-off before use.
- **Not repeated here:** the 15 candidates already being verified in `source_check.md` (rate parity, abandoned-booking recovery, channel content, sister-property offers, group displacement, hotels building their own tools, guest-data clean-up, staff performance coaching, queue monitoring, and the six extensions), and the evidence gaps already written in each department's catalogue text.
- No AIHA and no Wikipedia. One widely quoted figure (7% of PMS vendors publish open API documentation) comes from an AIHA study and is deliberately left out.

---

## One-page summary

### The strongest gaps, ranked by strength of evidence

| # | Gap | Department | Status | Main blocker | Best evidence |
|---|---|---|---|---|---|
| 1 | Getting data out of separate hotel systems and trusting it enough to let AI use it | IT, General Management (affects all) | c/d | Integration, data quality | 58% of 1,160 European accommodation executives name integration complexity as a barrier to digital tools and AI (Booking.com/Statista barometer) [G9]. Integration is a barrier for 38% of 113 hotel chains (h2c, 2026) [G8] and 40% of Austrian hotels in the HES-SO survey [G20]. Only 42% of 107 hotel company leaders are confident their data is ready for AI [G6] |
| 2 | Cleaning the room itself: making beds, cleaning bathrooms | Housekeeping | d | Physical work (soft, heavy textiles; speed) | Hotelschool The Hague robotics researcher: bed making "remains beyond the capabilities of current robotics" [G2]; a king-size duvet is wider than any humanoid's reach [G1]. In the largest announced hotel robot rollout (772 rooms, Singapore), the company itself says humanoids cannot yet do complete housekeeping or restroom cleaning alone [G29] |
| 3 | Affordable, ready-to-use AI for small and independent hotels | General Management, Revenue Management | c | Cost, no in-house skills | 61% name high implementation cost and 53% lack of technical expertise (1,160 European executives) [G9]. Top barrier in Austria: no affordable, ready-to-use solutions, 42% [G20]. 43% of 450 revenue decision-makers have no revenue system at all (vendor survey) [G19] |
| 4 | AI agents that change bookings, folios and payments on their own | IT, Front Office, Reservations | b | Systems of record must be exact; no agreed permissions or audit trail | Today's messaging AI reads the PMS but does not write back [G30]. Only 15% of hotel chains have a standard data-access layer for AI and 52% have no plans (h2c figure as cited by a vendor; not checked at source) [G32] |
| 5 | Handling complaints and other moments that need judgement | Guest Experience, Front Office | d | Guest acceptance | 3,250 travellers in eight countries: humans preferred at all tested touchpoints; 66% want a human front-desk welcome, 72% human bar and restaurant service (Mews, vendor survey) [G15][G16]. 59% of 500+ hoteliers say check-in should be human-led [G17] |
| 6 | Proving that AI pays off | General Management, Finance | c | No measurement method, no baseline | Only 24% of 107 hotel leaders say their AI spending has paid for itself [G6]; only 13% of 113 chains report a measurable return [G8] |
| 7 | Kitchen preparation and dishwashing | Kitchen | d | Physical work, constant task switching | Robotic cooking in two European hotels handles the stove only; staff still restock and prepare (catalogue). The only dishwashing robot found handled special plates only (search result only) [G40]. Hotelschool: housekeeping and kitchen roles will be among the last automated [G1] |
| 8 | Checking deliveries at the back door: count, weight, temperature, quality | Procurement, Kitchen | b/d | Physical check; liability for what is signed | AI reads the delivery note and matches it to the order, but a person must still count and inspect (vendor guides, search results only) [G41] |
| 9 | Maintenance scheduling and payroll: hoteliers are comfortable automating them but hardly use AI for them | Maintenance, HR | b/c | Products not adopted; national rules; integration | Mews survey of 500+ properties: "low use, high comfort with full automation" for maintenance scheduling, labour scheduling/payroll and software coding [G17] |
| 10 | Keeping up with rules: licences, fire safety, tourist tax, e-invoicing, water safety | Legal & Compliance, Finance | c | Rules are local and change often; liability | Nearly half of European hoteliers report more effort to comply with government rules, 6% less; harder for small hotels (Booking.com/Statista, July 2024) [G27]. No AI compliance-calendar product for hotels found |
| 11 | Banquet event orders and setting up event rooms | F&B service | b (paper) / d (set-up) | Last-minute changes across departments; physical work | Catalogue already notes no AI banquet-event-order product was found. Our search found only generic AI templates and vendor blogs (search results only) [G42] |
| 12 | Charging guests from sensor readings (minibar, smoking) | Housekeeping, Front Office | b | False positives; guest disputes | US consumer reports of smoking-sensor fees of $250–$560 charged to non-smokers [G31]. Older automatic minibars: one hotel manager estimated up to 90% of automatic charges were wrong (2014, one hotel) [G23] |
| 13 | Knowing which marketing channel really produced a booking | Sales & Marketing | c | Tracking breaks when guests find the hotel through AI assistants | Trade commentary only, no survey (search results only) [G43] |
| 14 | Permits, housing and paperwork for seasonal workers from outside the EU | HR | c | Regulation by country; employer duties | Employers must ensure adequate accommodation for the whole stay (EU rules) [G25]. The sector is missing about 10% of its workforce (HOTREC, Jan 2026, as reported) [G10]. No tool found |
| 15 | Collecting carbon data from food and other suppliers | Legal, Compliance & ESG | c | Suppliers do not have the data | Vendor and trade commentary only (search results only) [G44] |

### Five patterns across departments

1. **The model is not the problem; the plumbing is.** 67% of 107 hotel company leaders name implementation issues (change management, data quality, integration) as the barrier to AI value, against 8% who blame the AI models [G6]. The same answer comes from European executives (58% integration complexity) [G9], hotel chains (38%) [G8] and a technology survey of 300+ hotel professionals (38% name integration as a top pain point) [G18].
2. **Small hotels are left out.** Cost (61%) and missing technical expertise (53%) lead the barrier list in Europe [G9]; 17% of independent properties offer no staff training at all, against 2% of chain hotels [G9]. In Austria the top barrier is that affordable, ready-to-use solutions do not exist (42%) [G20].
3. **Physical work stays human.** The largest departments (housekeeping, kitchen, F&B service) do work with soft, irregular or heavy objects under time pressure. Robots that exist do one narrow thing (floors, deliveries, a stove, towels in an industrial laundry) [G1][G2][G21][G29].
4. **AI advises; people act and stay liable.** AI reads, drafts, recommends and matches. The step that commits the hotel (charging a guest, signing for a delivery, changing a booking, answering an allergy question, publishing a price) stays with a person. Only 10% of 450 revenue decision-makers would let AI make most pricing decisions [G19].
5. **Guests set a limit.** Guests accept AI behind the scenes but prefer people where judgement or trust is involved [G15]; hoteliers who use AI most are the firmest that some moments stay human [G17].

A sixth, weaker pattern: **local rules.** Labour agreements, tourist taxes, e-invoicing formats, guest registration and safety rules differ by country and town, so a product built for one market does not travel. We found this in commentary and law-firm notes, not in a survey.

---

## 1. Revenue Management

Covered by the catalogue: room demand forecasting, dynamic pricing, rate shopping, copilots, agents, total-revenue and function-space forecasting, upsell pricing, spa yield. The catalogue already says AI revenue systems largely miss F&B, meeting and spa revenue.

Searches run: "total revenue management hotel F&B spa meeting space … data silos survey"; "hotel revenue management system adoption independent hotels percent no RMS spreadsheets Europe survey 2026".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Pricing for hotels that have no revenue system (owner or GM prices by hand) | c | Cost and time; pricing sits with the GM or owner, not a specialist | 43% of 450 senior revenue decision-makers have no revenue system: 14% price on instinct or fixed seasons, 29% use spreadsheets. Only 24% give a dedicated revenue manager primary responsibility for pricing. Vendor survey, Europe, North America and Asia Pacific, no European split [G19] | Partly. A spreadsheet-plus-LLM helper is feasible; a tested pricing engine is not a weekend project | Minimal |
| Collecting the information needed to price (events, competitor rates, pickup) in one place | b | Data sits in many tools | Only 30% of the same 450 say gathering pricing information is quick or easy; 47% among hotels with an established system [G19] | Partly, if the PMS and rate tools allow export | Minimal |
| Handing over the decision (letting the system publish prices alone) | d (for now) | Trust; owners want control | 53% use AI for pricing but only 10% would let it make most decisions [G19]. Matches catalogue sources P8 and P18 | No: this is a trust question, not a build question | Minimal |
| Applying revenue management to spa, restaurants, golf, parking as one decision | b | Separate systems; incentives tied to room revenue; POS sales not linked to the guest | Practitioner roundtable (HSMAI): obstacles are technology, finance practices, metrics, organisation, incentives [G14]. A 2017 Cornell survey of 381 revenue managers expected this to become common "soon" (search result only) [G45]. No recent survey found | No: needs data from several vendors' systems | Minimal |

## 2. Reservations & Distribution

Covered: voice agents, email handling, channel management, booking-engine assistants, cancellation prediction, rooming lists, AI-assistant apps, call scoring.

Searches run: "AI voice agent hotel reservations limitations complex bookings payment PCI … independent evaluation"; "hotel OTA virtual credit card processing manual front desk"; "corporate travel RFP season hotels manual process negotiated rates loading audit errors".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Independent proof of how many calls a voice agent really resolves | c (evidence gap) | Vendors score their own calls with their own definitions | Only vendor self-reports found (about 65–75% resolved without transfer); no third-party test (search results only) [G46] | n/a | Transparency (the caller must be told it is AI) |
| Taking card payment safely inside an AI phone call | c | Payment security rules; liability | Our search returned nothing on how voice agents handle card data [G46] | No: payment security certification | Transparency |
| Charging OTA virtual cards and chasing failed ones | a (not AI) | – | Robotic process automation products exist; a vendor cites one 11-hotel portfolio with $228,000 of unprocessed virtual-card balances in a month (vendor claim, search result only) [G47]. This is rules-based automation, like the "deposit chasing" item dropped in `source_check.md` | Partly | Minimal |
| Loading negotiated corporate rates correctly and auditing them | c | Many parties (hotel, buyer, travel agency, distribution systems) | Long-standing complaint in business-travel press; figures on error rates could not be verified (search results only) [G48]. No AI product for hotels found | Partly: an audit script comparing contract and loaded rates is feasible | Minimal |
| Changing or cancelling a booking end to end without staff | b | Agents may read but not write to the PMS | See IT section [G30] | No | Transparency |

## 3. Sales & Marketing

Covered: text and image generation, group/MICE enquiries, CRM and campaigns, paid media, AI-search visibility, lead scoring.

Searches run: "hotel marketing attribution direct booking measurement problem cross-channel … survey 2026"; "corporate travel RFP season hotels …".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Knowing which channel really produced a booking | c | A guest who gets a recommendation from an AI assistant and then books direct leaves no trace; OTA and analytics reports each claim the same booking | Trade commentary only; no survey with a base found (search results only) [G43] | Partly: reconciling totals against the PMS is feasible; per-guest tracking is not | Minimal |
| Checking that AI-written marketing claims are true (room features, distances, awards) | c | Liability for misleading advertising stays with the hotel | No hotel product found. Catalogue notes no source measures time saved or quality | Partly: a checklist against the hotel's own fact sheet | Minimal; transparency duties if AI images could mislead |
| Relationship selling: site visits, negotiation, key accounts | d | Human trust | Nothing found beyond drafting and lead research (already in catalogue) | No | – |

## 4. Front Office

Covered: digital check-in, room assignment, face verification, copilots and PMS agents, upsell, guest risk screening, avatar receptionist.

Searches run: "hotel overbooking walk guest relocation front desk AI tool"; "hotel lost and found AI software deployed hotels"; "hotel room smoking vaping detection sensor AI charge guests false positives".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Lost and found: logging items, matching them to guests, shipping | a | – | A product (BOUNTE) photographs an item and AI adds the description and category; integrations with a PMS and an operations platform are listed. Vendor and trade-press descriptions; a review site notes no hotel recommendations yet (search results only) [G49]. Candidate for the catalogue once a page is opened | Yes: photo-to-description with a general AI model is simple | Minimal |
| Relocating guests when the hotel is overbooked ("walking") | c | Needs live availability at other hotels and a human apology | Guidance articles only; one start-up (WalkSource) appeared in a TechCrunch article of unknown date and current status (search results only) [G50] | Partly: a helper that drafts the offer and message; finding the room still means phone calls | Minimal |
| Disputed charges at check-out (minibar, smoking, damage) | b | Sensors make errors; the guest cannot prove a negative | Consumer reports of $250–$560 smoking fees charged to non-smokers after sensor alerts (US, 2026) [G31]; minibar sensor errors (one US hotel, 2014) [G23] | No | Minimal for the sensor; consumer law matters more than the AI Act |
| Welcome, problem solving, and exceptions at the desk | d | Guest acceptance | 66% of 3,250 travellers prefer a human front-desk welcome, 58% a human for check-in and key (vendor survey) [G15]; 59% of 500+ hoteliers say check-in should be human-led [G17] | No | – |
| Luggage, keys, showing rooms | d | Physical work | Catalogue source P1: 90.8% of 202 hotel tasks hit at least one automation barrier | No | – |

## 5. Guest Experience & Customer Service

Covered: review analysis, chat assistants, review replies, personalisation, digital concierge, in-room voice.

Searches run: "hotel guest complaint handling service recovery AI … guests prefer human staff survey 2026".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Resolving a complaint (deciding the remedy, apologising, compensating) | d | Guest acceptance; authority to give money back | No survey measures complaints specifically. Nearest: humans preferred at all tested touchpoints, 75% say good hospitality depends on human staff (3,250 travellers, eight countries, vendor survey) [G15][G16]. Catalogue source P8: complaints rank highest on emotional intelligence | Partly: AI can draft and suggest a remedy for staff | Transparency if AI talks to the guest. Emotion recognition of guests would raise transparency duties |
| Passing a guest request across departments until it is done | b | Separate systems | Covered in part by task capture (Housekeeping row in catalogue). Guests' wish: 59% want AI to take repetitive tasks so staff can build trust [G15] | Partly | Minimal |
| Reliable, detailed accessibility information for guests with disabilities (room by room) | c | The data does not exist in structured form | Website accessibility is being audited (139 European hospitality sites, vendor study) [G26]; we found nothing on AI producing room-level accessibility data (search results only for the legal context) [G51] | Partly: photos and measurements to a structured fact sheet is feasible; someone must measure | Minimal |

## 6. Food & Beverage service

Covered: event sales AI, in-room dining ordering, menu engineering, QR ordering, delivery robots, table reservations.

Searches run: "banquet event order BEO automation AI hotel catering manual process"; "hotel banquet staffing event setup room turnover physical labour automation".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Banquet event orders: turning emails and changes into one current instruction sheet for kitchen, service and set-up | b | Late changes; many departments read the same sheet | Generic AI templates and a vendor "engine" exist; no hotel deployment found (search results only) [G42]. Catalogue already records "not found" | Yes, as a draft that a person checks: this is text extraction from emails | Minimal |
| Setting up and turning over meeting and banquet rooms | d | Physical work | No robot or AI product found; software only plans layouts and schedules staff (vendor pages, search results only) [G42] | No | – |
| Serving at the table, at the bar, at the buffet | d | Physical and social; guest acceptance | 72% of 3,250 travellers prefer a human for bar and restaurant service [G15]. Catalogue: waiters and bartenders barely exposed (ILO) | No | – |
| Answering allergy questions | d | Liability: the business answers for the information it gives | Law-firm and vendor commentary says final allergy answers stay with staff (search results only) [G52]. Catalogue covers allergen labelling of menus | Partly: labelling from recipes yes; the final answer to the guest no | Transparency if a bot answers; food law matters more |

## 7. Housekeeping

Covered: task capture, floor robots, linen tracking, sensor-driven cleaning status, room inspection by camera, cleaning plans.

Searches run: "hotel room cleaning robot bed making bathroom housekeeping robot pilot hotel 2026"; "Koerten Hotelschool The Hague robots hotel housekeeping"; "laundry folding robot towels hotel laundry"; "hotel minibar check automation sensors computer vision"; "bed bug detection AI monitor hotels".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Making beds, cleaning bathrooms, resetting the room | d | Physical: large soft textiles, tight spaces, speed of a trained attendant | "Making a bed … remains beyond the capabilities of current robotics" (Hotelschool The Hague) [G2]. Humanoids must also match human speed and cost; low-paid, hard jobs are automated last [G1]. Singapore rollout: humanoids are a research track only [G29] | No | – |
| Easing the physical strain of bed making | b | Research prototype | The Duvetlifter, a mechanical aid with no electronics, tested with housekeepers (Hotelschool The Hague and TU Delft). Not AI [G2] | No | – |
| Folding towels and sheets | b (industrial laundries only) | Scale: pays off only at high volume | A towel-feeding robot handles 500–600 textiles an hour at a Bavarian textile-service company, about human speed (vendor case via the robotics federation) [G21]. No hotel in-house laundry found | No | Minimal |
| Checking and refilling the minibar | b | Sensor errors; staff still check | Automatic minibars exist; error-prone in one 2014 account [G23]. Camera-based checking is a vendor claim (search result only) [G53] | No | Minimal |
| Early detection of bed bugs | a | – | A UK product (Spotta): a monitor under the mattress photographs insects and AI classifies them. Vendor-reported first year: over 91,000 room nights, guests found the bugs first in 3.3% of cases, against about 50% before (vendor claim, 2020) [G12]. Candidate for the catalogue; needs a newer, independent source | No | Minimal |

## 8. Maintenance & Engineering

Covered: central plant optimisation, work-order triage and asset register, digital twins, room energy management, predictive maintenance (OEM and hotel-run), leak detection.

Searches run: "hotel capital expenditure planning FF&E reserve asset lifecycle AI tool"; "legionella water temperature monitoring hotel automated sensors"; "hotel maintenance technician shortage Europe … predictive maintenance barrier cost sensors retrofit".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| The repair itself | d | Physical work | Catalogue: caretakers and air-conditioning mechanics barely exposed (ILO) | No | – |
| Planning preventive maintenance rounds | b/c | Low adoption; small hotels have no asset data | Hoteliers are comfortable with full automation here but hardly use AI for it (Mews, 500+ properties) [G17] | Partly: a schedule from an asset list is feasible | Minimal |
| Predictive maintenance in older buildings without sensors or a building management system | c | Cost of retrofitting sensors | Only a vendor statement that wired sensor retrofits are cost-prohibitive (search result only) [G54]. No independent European cost data found | No | Minimal |
| Capital planning: when to replace what, across a portfolio | b | Spreadsheets; data in emails | Two US products announced (one launched April 2026) that centralise capital projects and use past repairs to forecast budgets; vendor announcements, no hotel results [G22] | Partly | Minimal |
| Water-safety (legionella) temperature checks and flushing records | a (sensors, not AI) | – | Sensor systems are deployed, including one French Ibis hotel (vendor case, search result only) [G55]. Monitoring is automated; no AI claimed | No (hardware) | Minimal |

## 9. Kitchen & Culinary Operations

Covered: food-waste cameras, allergen labelling, recognising ovens, production forecasting, recipe generation, robotic cooking.

Searches run: "hotel commercial dishwashing robot kitchen pot wash automation pilot hotel"; "hotel kitchen robot vegetable prep chopping automation … limitations"; "HACCP digital food safety monitoring AI hotel kitchen"; "AI stock count kitchen inventory computer vision".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Preparation: washing, peeling, cutting, portioning | d | Irregular, soft items; constant task switching | "Chopping vegetables … grasping oddly shaped objects that can be deformable" (Hotelschool) [G1]. Kitchens often buy pre-cut ingredients instead (search result only) [G56] | No | – |
| Dishwashing and pot washing | d/b | Mixed items; cost | One robot (Dishcraft) handled only special plates and bowls, not glasses or cutlery; current status unknown (search results only, 2019–2021) [G40] | No | – |
| Food-safety records (temperatures, cleaning checks) | a (sensors, not AI) | – | Sensor logging replaces paper sheets, e.g. Four Seasons Limassol, Cyprus (vendor case, 2021) [G24]. AI checking of hygiene by camera: no deployment found | No (hardware); a digital checklist yes | Minimal; camera monitoring of staff could become high-risk if used to evaluate workers |
| Counting stock by camera | b | Kitchens are cluttered; hotel products use scales and barcodes | Camera counting is deployed at a coffee chain, not found in hotels; hotel bar tools use barcode and scales (search results only) [G57] | Partly | Minimal |
| Tasting, plating, quality judgement | d | Human senses | Nothing found | No | – |

## 10. Procurement & Purchasing

Covered: reorder recommendations, demand forecasting, invoice matching, spend analytics, price comparison, price forecasting. The catalogue already notes that ordering in Austria is still mostly on paper [A3].

Searches run: "hotel purchasing still phone email paper orders suppliers … e-procurement adoption hotels Europe survey"; "goods receiving delivery check kitchen AI photo delivery note verification weight quality".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Checking a delivery: count, weight, temperature, freshness, damage | b (paper) / d (physical) | Physical check; the signature confirms a count a person made | AI reads the delivery note and matches it to the order; a person still counts and inspects (vendor guides, search results only) [G41] | Partly: photo of delivery note to order comparison is feasible today | Minimal |
| Ordering from small local suppliers that have no digital catalogue | c | Suppliers are not digital; phone and messaging orders | No recent European survey found; older studies (Canada 2009, UK trade press 2014) describe phone and personal contact as preferred (search results only) [G58] | Yes: turning a voice note or chat into an order message is simple | Minimal |
| Autonomous ordering (the system places the order alone) | c | Trust; approval rules | Catalogue: "no autonomous ordering found" | No (policy, not technology) | Minimal |
| Supplier carbon and origin data | c | Suppliers lack the data | See Legal section [G44] | No | Minimal |

## 11. Finance & Accounting

Covered: invoice capture, fraud detection, reconciliation, forecasting, copilots and AP agents, night audit, chargeback disputes.

Searches run: "hotel month-end close USALI reporting manual spreadsheets … survey"; "hotel tourist tax city tax VAT rules multiple countries automation … e-invoicing mandate 2026"; "hotel payroll tips service charge distribution compliance automation multi-country Europe".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Trusting the daily numbers before any AI acts on them | c | "A day that balances can still be wrong" | Roundtable of 25 operators (US, Nov 2026): trusted data and a named reviewer come before automation (vendor-hosted event) [G28]. An operations survey reports few respondents with fully integrated systems and fewer with high confidence in their data; the articles we opened give no percentages or sample size [G4][G5] | Partly: daily checks and alerts on exported data | Minimal |
| Measuring whether an AI tool paid for itself | c | No baseline; benefits are time saved, not cash | 24% say AI has paid for itself, 28% too early to tell (107 hotel company leaders, Aug–Sep 2026) [G6]. 13% of 113 chains report measurable return [G8] | Partly | Minimal |
| Local taxes and invoice rules (tourist tax by town, VAT changes, e-invoicing formats) | c | Rules are local and change | Vendor blogs only (search results only) [G59]; one vendor explainer on e-invoicing opened [G34]. No AI product found | Partly: a rules table per property; someone must keep it current | Minimal |
| Tips and service-charge distribution, payroll rules by country | a (rules-based) | – | Vendors offer automated tip distribution with audit records (search results only) [G60]. Not AI | No | High-risk only if AI decided pay or evaluated workers |
| Month-end close and mapping to the uniform chart of accounts | b | Source systems do not map automatically | Vendor content only; one figure (9–14 days to close) comes from a 27-hotel vendor sample (search result only) [G61] | Partly | Minimal |

## 12. Human Resources

Covered: labour forecasting and scheduling, recruiting, onboarding and training, attrition prediction, seasonal staff matching, biometric clocks. Staff performance coaching is in `source_check.md`.

Searches run: "hotel rostering collective agreement working time compliance AI scheduling Europe … works council"; "seasonal hotel workers work permits visa third-country nationals staff accommodation housing"; "HOTREC labour shortage hospitality Europe 2026".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Rosters that respect national labour law, collective agreements and works-council rights | b/c | Regulation by country; employee consent | Hoteliers are comfortable automating scheduling and payroll but use AI little for them [G17]. In Germany and the Netherlands works councils have a say on scheduling and time-recording software (law-firm and vendor notes, search results only) [G62]. Catalogue: staff report loss of flexibility (P16, P23) | No | High-risk if the system allocates tasks based on individual behaviour or traits, or monitors and evaluates workers |
| Work permits, housing and paperwork for seasonal staff from outside the EU | c | Regulation; employer must ensure housing | EU rules: stay up to nine months in twelve; adequate accommodation required [G25]. No tool found | Partly: a document checklist and deadline tracker | Minimal for a tracker; high-risk if it screens or ranks candidates |
| Filling the staffing gap itself | d | People, not software | Sector missing about 10% of its workforce on average (HOTREC roadmap, Jan 2026, as reported by trade press) [G10]. 47% of 1,160 European executives name lack of skills as a hiring barrier [G9] | No | – |
| Training in small hotels | c | No time, no budget | 17% of independents offer no staff training at all, against 2% of chains [G9]. Catalogue covers AI training tools; the gap is reach | Yes: turning the hotel's own procedures into short lessons with a general AI tool | Minimal |
| Predictable schedules as a retention tool | b | Demand is volatile | Vendor blog citing HOTREC: volatile schedules are a top driver of attrition (vendor reading of the report) [G11] | No | See first row |

## 13. General Management & Administration

Covered: dashboards, copilots, briefings, enterprise platforms, owner reporting, staff knowledge assistant. "Hotels building their own tools" is in `source_check.md`.

Searches run: "hotel technology survey 2026 biggest challenge system integration fragmented data AI adoption"; "h2c AI automation hospitality study … barriers"; "small independent hotels AI adoption barrier cost no IT staff survey Europe 2026"; "hotel brand standards audit quality assurance inspection AI computer vision".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Turning scattered AI use into something managed | c | Skills; no owner for AI | 56% of 113 hotel chains name missing AI expertise as the top barrier; chains rate their own AI know-how 3.4 of 10; 28% have a company-wide AI strategy (h2c, 2026) [G8]. A year earlier: 62% expertise, 51% unclear strategy, 8% with a strategy (nearly 200 hotel companies) [G7]. Among organisations with an AI strategy, 70% say execution is fragmented [G6] | n/a (organisation) | – |
| Staff using public AI tools with guest or staff data | c | No approved alternative; no policy | 72% of 107 hotel leaders access AI through general tools such as ChatGPT, Gemini or Copilot [G6]. How much of this is unapproved is not measured anywhere we found | Yes: a licensed assistant with rules | Minimal; data-protection law is the issue |
| A simple, affordable starting package for a small hotel | c | Cost; nobody to set it up | See summary rows 3 and pattern 2 [G9][G20] | Partly | Minimal |
| Brand-standard and quality audits | b | Brands run audits with people | Vendor tools claim camera-based checks; no brand deployment found (search results only) [G63]. Overlaps "room inspection with computer vision" in the catalogue | Partly | Minimal; high-risk if used to evaluate individual workers |
| Decisions that carry responsibility: owner relations, crisis handling, people decisions | d | Accountability | Catalogue source P8 | No | – |

## 14. IT & Security

Covered: threat detection, IT service desk, booking fraud, video analytics, network operations.

Searches run: "legacy PMS integration API barrier AI agents hotels … survey"; "agentic AI hotels write access PMS actions autonomy … survey 2026"; "hoteliers evaluate AI vendors difficulty AI washing"; "independent hotels no dedicated IT staff cybersecurity PCI compliance".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Connecting systems so AI can read reliable data | c/d | Closed or old systems; each connection is custom | Integration: 58% (Europe) [G9], 40% (Austria) [G20], 38% (chains) [G8], 38% as a top pain point (300+ hotel professionals) [G18]. 51% plan to replace or upgrade their systems within 12–24 months [G18] | Partly: exports and simple connectors yes; real-time two-way links depend on the vendor | Minimal |
| Letting AI agents write to the PMS (change bookings, post charges) | b | Systems of record cannot be "approximately right"; no agreed standard for permissions and audit | Messaging AI pulls data from the PMS but does not write back (trade analysis) [G30]. 15% of chains have a standard AI data-access layer; 52% have no plans (h2c, as cited by a vendor; secondary) [G32] | No | Depends on the action; transparency if it talks to guests |
| Judging AI vendors and their claims | c | Buyers cannot test what they are told | Trust in AI 6.6 of 10 against reliance 4.7 (nearly 200 hotel companies, 2025) [G7]. Catalogue already cites vendor evaluation as a bottleneck (S3) and marks many vendor AI claims "unclear". No independent testing body for hotel AI found | Partly: a standard question list (our AI Act guide already has one) | – |
| Security and payment-card compliance in hotels with no IT staff | c | No in-house resources | Trade article: independents face the same risks as chains without the internal resources (guest contributor, no figures) [G33]. No survey of how many independents have an IT person found | No | Minimal |

## 15. Legal, Compliance & ESG

Covered: ESG reporting, GDPR and AI Act tooling, contract review, AI policies.

Searches run: "hotel licences permits fire safety inspections compliance calendar software … administrative burden survey"; "European Accessibility Act hotels booking website accessibility"; "hotel CSRD scope 3 supplier emissions data collection"; "hotel kitchen food allergy AI chatbot liability".

| Task | Status | Blocker | Evidence | Build it yourself? | AI Act (our reading) |
|---|---|---|---|---|---|
| Tracking which rules apply to this hotel and when each duty is due (licences, fire safety, water safety, guest registration, music rights, tourist tax) | c | Rules are national and municipal; liability for a missed duty | Nearly half of European hoteliers report rising compliance effort, 6% falling; worse for small businesses (Booking.com/Statista barometer, about 1,000 professionals, published July 2024 by Booking.com) [G27]. Catalogue: 44% of Austrian member hotels name legal complexity (A3). No hotel product found | Partly: a deadline tracker yes; knowing the rules needs a lawyer or association | Minimal |
| Collecting emissions data from suppliers | c | Suppliers lack data or resources | Vendor and trade commentary only (search results only) [G44]. Catalogue: no evidence of ML extraction in ESG tools | No | Minimal |
| Website and booking accessibility | a (testing tools) | – | Automated testing exists; a vendor reviewed 139 European hospitality sites [G26]. Fixing the booking engine depends on its vendor | Partly | Minimal |
| Legal responsibility when AI gives wrong information (allergens, prices, policies) | d | Liability stays with the hotel | Law-firm commentary (search results only) [G52] | No | Transparency |
| Proving AI Act and GDPR compliance for tools bought from vendors | c | Hotels depend on vendor documents | Catalogue: "No evidence on AI Act or GDPR compliance work." Our own AI Register and AI Act guide exist because we found no hotel product | Yes: this is what the team built | – |

---

## Candidates for the catalogue found on the way (status a)

Short list only; each needs a page opened and checked before it goes in.

- **Lost-and-found logging with photo recognition** (Front Office) [G49]: vendor and trade press, not opened (Cloudflare).
- **Bed-bug early detection** (Housekeeping) [G12]: UK product in hotels since 2019; only vendor-reported results from 2020.
- **Pool drowning detection by camera** (IT & Security or a new "safety" line): a pilot at a Leonardo hotel in Cyprus is reported; vendor claims, not opened (search results only) [G64].
- **In-room smoking and vaping sensors** (Housekeeping/Front Office) [G31]: deployed in US hotels; whether they use AI is not stated in what we opened; documented false charges. If added, add as a cautionary example.
- Not AI but relevant as the cheaper alternative: sensor logging for food safety [G24] and water safety [G55], rules-based tip distribution [G60], virtual-card automation [G47].

---

## Topics these gaps suggest are worth exploring

Topics only. The team writes its own interview questions.

**With start-ups and vendors**
- Why vendors build for the same crowded tasks (messaging, pricing, review replies) and not for the gaps above.
- What a vendor needs from a hotel's systems before its product works, and how often that is missing.
- Read-only versus write access to the PMS: what is technically possible, what vendors hold back, and who carries the risk.
- Pricing and minimum hotel size: whether a 30-room independent is a customer at all.
- How vendors measure their own results, and whether any offer independent proof.
- Where vendors draw the line on liability (allergens, charges to guests, payment data).
- Physical tasks: what robotics companies see as realistic in hotels within five years and what they do not.

**With hotel chains and independents**
- Which tasks staff still do by hand because no tool exists or the tool does not connect.
- What hotels have already built themselves, with what tools, and what stopped them.
- Where AI recommendations are accepted and where a person always re-checks, and why.
- How (and whether) the hotel measures the return on an AI tool.
- Small-hotel reality: who would set up and maintain a tool when there is no IT person.
- Local rules that make a product unusable in one country (labour agreements, taxes, registration).
- Guest-facing limits the hotel has chosen on purpose.

**With consultants, legislators and cybersecurity experts**
- Whether agent access to systems of record needs an industry standard for permissions and audit trails.
- Works-council and labour-law limits on scheduling and monitoring tools by country.
- Who is liable when a sensor or an AI system triggers a charge to a guest.
- Staff use of public AI tools with guest data: how common, how controlled.
- What a self-built hotel tool must document to stay on the right side of the AI Act.

---

## Sources

"Opened" = the page was loaded and read in this session (20 Nov 2026). "Search result only" = seen in a search summary; a lead, not verified. Vendor surveys and vendor claims are labelled.

| ID | Source and exact claim used | Date | Type | Status |
|---|---|---|---|---|
| G1 | Hotelschool The Hague, K. Koerten, "When will humanoid robots start cleaning my hotel room?" Bed making involves large, heavy, deformable objects; a king-size duvet (up to 2.5 m) exceeds any humanoid's span; robots must also match human speed; best-paid, easiest jobs are automated first. https://www.hotelschool.nl/blog/research/when-will-humanoid-robots-start-cleaning-my-hotel-room | Early 2026 (page undated) | Academic blog / expert opinion | Opened |
| G2 | Hotelschool The Hague, "Transforming hotel housekeeping with innovations for wellbeing of housekeeping employees" (Duvetlifter, master thesis I. Schneider with K. Koerten and TU Delft). "Making a bed … remains beyond the capabilities of current robotics"; the Duvetlifter contains no electronics. https://www.hotelschool.nl/blog/research/transforming-hotel-housekeeping-with-innovations-for-wellbeing-of-housekeeping-employees | 2024 thesis (page undated) | Academic blog | Opened |
| G3 | Koerten & Abbink, "Selecting Robots to Take Over Tasks in Hospitality Settings", Springer book chapter, pp. 65–86 (abstract only read; background, not quoted). https://repository.tudelft.nl/record/uuid:c7ca1f72-5930-4235-b98b-2ecad5001ad2 | 2023 | Academic | Opened (abstract) |
| G4 | LODGING Magazine, "Otelier Survey Finds Gap Between Hotel Technology Investment and Impact" (2026 Hotel Operations Index, with Agilysys and Sage). Only a small share of respondents fully integrated; fewer with high confidence in data. No percentages or sample size in the article. https://lodgingmagazine.com/otelier-survey-finds-gap-between-hotel-technology-investment-and-impact/ | 28 Jan 2026 | Trade press on a vendor survey | Opened |
| G5 | HOTELS Magazine, same report. https://hotelsmag.com/news/2026-hotel-operations-index/ (A search summary gave "11% fully integrated" and "91% still use manual reporting"; neither figure is in the two articles we opened, so they are not used.) | 28 Jan 2026 | Trade press on a vendor survey | Opened |
| G6 | HOTELS Magazine, "Hotels are adopting more AI every day. Will it pay off?" (State of Hotel AI: Fall 2026 Edition, Destination AI summit team). 107 hotel company leaders, Aug–Sep 2026; management companies 33%, owners/investors 28%. 67% cite implementation issues vs 8% model limits; change management 35%, data quality 34%, integration 29%; 42% confident data is ready; 24% say AI paid for itself, 28% too early; 72% use general-purpose tools; 70% of those with a strategy report fragmented execution. Region not stated (likely mostly US). https://hotelsmag.com/news/hotels-are-using-more-ai-every-day-now-they-need-to-prove-it-pays-off/ | 1 Oct 2026 | Trade press on an industry survey | Opened |
| G7 | Travolution, "Hotels trust AI more than they use it" (h2c Global Study: AI & Automation in Hospitality, with Profitroom). Nearly 200 hotel companies; 78% use AI; 8% have a formal strategy; trust 6.6/10 vs reliance 4.7; barriers: expertise 62%, unclear strategy 51%. https://www.travolution.com/news/hotels-trust-ai-more-than-they-use-it/ | 5 Nov 2025 | Trade press on a consultancy survey (vendor-sponsored) | Opened |
| G8 | Tageskarte, "Studie: Hotelketten nutzen KI, doch nur wenige haben eine Strategie" (h2c AI Opportunity Study 2026). 122 answers from 113 hotel chains (101 online, 21 interviews), about 8,200 hotels and 1.3 million rooms worldwide. 91% use AI; 28% company-wide strategy; 13% measurable ROI; barriers: expertise 56%, integration 38%, no roadmap 32%, data security 29%, data governance 28%, cost 22%; own know-how 3.4/10. https://www.tageskarte.io/hotellerie/detail/studie-hotelketten-nutzen-ki-doch-nur-wenige-haben-eine-strategie.html | Oct 2026 | Trade press (German) on a consultancy survey | Opened |
| G9 | Hotel Management Network, "European hotels upbeat but face staffing, tech gaps" (Booking.com and Statista, European Accommodation Barometer, fifth edition). 1,160 accommodation executives across Europe. AI/digital barriers: implementation cost 61%, integration complexity 58%, lack of technical expertise 53%; hiring: lack of skills 47%; no staff training at 17% of independents vs 2% of chains. Publication date not shown on the page (appears to be 2025; check). https://www.hotelmanagement-network.com/newsletters/european-hotels-upbeat-but-face-staffing-tech-gaps | 2025 (to confirm) | Trade press on a platform-commissioned survey | Opened |
| G10 | Hotel Management Network, "Europe's hotel industry struggles with ongoing staff shortages" (HOTREC position paper "Skills and Labour Shortages in Hospitality – A Roadmap for Action", Jan 2026). Sector missing around 10% of its workforce on average; about 10 million jobs, 2 million businesses. The HOTREC paper itself was not opened. https://www.hotelmanagement-network.com/news/europes-hotel-industry-struggles-with-ongoing-staff-shortages/ | 2026 | Trade press on an association paper | Opened |
| G11 | Unifocus blog, "Why Europe's Labour Shortage Is Now a Strategic Planning Problem". Vendor reading of the HOTREC roadmap: schedule predictability and attrition. https://www.unifocus.com/blog/why-europes-labour-shortage-is-now-a-strategic-planning-problem-not-a-hiring-one | 2 Mar 2026 | Vendor | Opened |
| G12 | eHotelier, "Spotta puts bed bugs to the test". First year: over 91,000 room nights; Spotta first to detect in 94.2% of cases; guests 3.3%; previously about 50% found by guests. https://insights.ehotelier.com/suppliers/2020/11/04/spotta-puts-bed-bugs-to-the-test/ | 4 Nov 2020 | Vendor press release in trade press | Opened |
| G13 | Hotel Dive, "Can increased AI investment in 2026 give hoteliers a competitive edge?" (Canary Technologies survey of 404 hotel IT decision-makers, three regions). Context only. https://www.hoteldive.com/news/hotel-industry-artificial-intelligence-investment-2026/815349/ | 23 Mar 2026 | Trade press on a vendor survey | Opened |
| G14 | HSMAI Americas, "Overcoming Barriers to Total Revenue Management" (roundtable notes): obstacles are technology, financial practices, metrics, organisation, willingness to change, incentives, resources. https://americas.hsmai.org/insight/overcoming-barriers-to-total-revenue-management/ | Undated | Association practitioner notes (US) | Opened |
| G15 | LODGING Magazine, "Mews Survey: Hotel Guests Don't Want AI-Led Stays". 89% want hybrid or background AI; human preferred for bar/restaurant 72%, front-desk welcome 66%, check-in and key 58%, room service 50% vs 23% AI, taxis 44% vs 28%; 75% say good hospitality depends on human staff; 59% want AI to take repetitive tasks. https://lodgingmagazine.com/mews-survey-hotel-guests-dont-want-ai-led-stays/ | 8 Oct 2026 | Trade press on a vendor survey | Opened |
| G16 | Hotel-Online, same survey: "Global survey of 3,250 travelers" (headline base). Eight countries per search summary. https://www.hotel-online.com/news/89-of-guests-want-ai-working-behind-the-scenes-not-running-the-front-desk-mews-finds | 7 Oct 2026 | Vendor press release | Opened (headline) |
| G17 | Customer Experience Dive, "Nearly all hoteliers use AI, but some experiences should be human-led: Mews". 500+ properties worldwide, Dec 2025–Mar 2026; 98% use AI; 59% say front desk and check-in should be human-led; AI involved in 11 of 19 common tasks; low-use, high-comfort tasks: maintenance scheduling, labour scheduling/payroll, software coding. https://www.customerexperiencedive.com/news/all-hoteliers-use-ai-experiences-human-led-mews/820987/ | 26 May 2026 | Trade press on a vendor survey | Opened |
| G18 | Stayntouch news, "2026 Hotel Tech Outlook Report" (NYU Tisch Center with Stayntouch and IDeaS; student capstone). 300+ hotel professionals; 38% cite integration as a top pain point; 51% plan to replace or upgrade their stack in 12–24 months; 54% of hotels with 100 rooms or fewer use all-in-one platforms. Mostly US. https://www.stayntouch.com/news/2026-hotel-tech-outlook-report/ | 5 Nov 2025 | University study with vendor sponsors | Opened |
| G19 | LODGING Magazine, "RoomPriceGenie Report: Hotels Embrace AI Pricing but Hesitate to Hand Over Control" (2026 State of Revenue Management Report). 450 senior revenue decision-makers; 53% use AI for pricing; 10% would let it make most decisions; 43% have no revenue system (14% instinct or fixed seasons, 29% spreadsheets); 30% find gathering pricing information quick or easy; 24% give a dedicated revenue manager primary pricing responsibility. https://lodgingmagazine.com/roompricegenie-report-hotels-embrace-ai-pricing-but-hesitate-to-hand-over-control/ | 21 Oct 2026 | Trade press on a vendor survey | Opened |
| G20 | WKO (Austrian Economic Chamber), "Künstliche Intelligenz in der Hotellerie", on the HES-SO Valais-Wallis survey of 1,500+ hotels in six countries (247 Austrian). Austrian barriers: no affordable ready-to-use solutions 42%, not knowing the tools 41%, integration 40%, security and data protection 37%. Same survey family as catalogue source S1. https://www.wko.at/oe/oesterreich/kuenstliche-intelligenz-in-der-hotellerie | Aug 2025 | Chamber summary of an academic survey | Opened |
| G21 | International Federation of Robotics case study, "Intelligent robots for commercial laundries" (Sewts VELUM). In use at Greif Textile Mietsysteme, Bavaria, since Nov 2022; 500–600 textiles per hour; comparable to a human operator. https://ifr.org/case-studies/intelligent-robots-for-commercial-laundries | Undated | Industry association case study (vendor-supplied) | Opened |
| G22 | Hospitality Upgrade, "OpsTechPro Introduces Hotel Capex AI". Capital planning is run through spreadsheets and email; product centralises projects, vendors and invoices. Quore CapEx (Dec 2025) seen as a search result only. https://www.hospitalityupgrade.com/news/opstechpro-introduces-hotel-capex-ai-to-modernize-capital-planning-for-hotel-portfolios | 17 Apr 2026 | Vendor announcement in trade press | Opened |
| G23 | Hotel-Online, "Hotels use sensors to bill for uneaten snacks…" (from a Milwaukee Journal Sentinel report). One hotel manager estimates up to 90% of automatic minibar charges are in error; staff check before billing. Old and anecdotal. https://www.hotel-online.com/press_releases/release/hotels-use-sensors-to-bill-for-uneaten-snacks-hit-guests-with-unexpected-ch/ | Sep 2014 | Trade press (US) | Opened |
| G24 | Kelsius, Four Seasons Limassol case: paper food-safety records replaced by sensors. https://kelsius.com/2021/04/12/ | 12 Apr 2021 | Vendor case study | Opened |
| G25 | European Union, Your Europe, "Seasonal workers from non-EU countries": employers must ensure adequate accommodation; stay limits. https://europa.eu/youreurope/business/human-resources/types-employment-arrangements/seasonal-workers-non-eu-countries/index_en.htm | Current page | Official | Opened |
| G26 | QualiBooth, "2026 Accessibility Report: The State of Hospitality Sector Accessibility in Europe" (automated review, Dec 2025; 139 sites per search summary). https://www.qualibooth.com/study/2026-accessibility-report-the-state-of-hospitality-sector-accessibility-in-europe | 2026 | Vendor study | Opened (partly) |
| G27 | Travel Tomorrow, "How tailored government policies could boost SME accommodation resilience in Europe" (written by Booking.com on the European Accommodation Barometer with Statista; "nearly a thousand" professionals). Nearly half report rising compliance effort, 6% easier; 77% of chains vs 59% of independents report a positive economic situation. https://traveltomorrow.com/how-tailored-government-policies-could-boost-sme-accommodation-resilience-in-europe/ | 22 Jul 2024 | Sponsored article on a platform-commissioned survey | Opened |
| G28 | MarketScale, "Why Otelier Optimize attendees want daily numbers before AI". 25 operators (US groups and Mandarin Oriental); trusted data and a named reviewer before automation. https://www.marketscale.com/industries/hospitality/why-hotel-operators-at-oteliers-summit-want-daily-numbers-before-ai-agents | 17 Nov 2026 | Sponsored newsroom report on a vendor event | Opened |
| G29 | MarketScale, "YYForce robots projected to cut selected costs 10% at 772-room Singapore hotels" (Novotel and Mercure Singapore on Stevens). First phase: delivery, logistics, cleaning robots; humanoids are research; training does not yet show complete housekeeping or restroom cleaning alone. Projection, not a result. Non-Europe. https://www.marketscale.com/industries/hospitality/yyforce-robots-projected-to-cut-selected-costs-10-at-772-room-singapore-hotels.md | 13 Oct 2026 | Newsroom report on a vendor announcement | Opened |
| G30 | Hospitality.today, "Why AI needs to sit beside your PMS, not inside it". Messaging AI vendors pull reservation data but do not write back to core records. https://www.hospitality.today/article/why-ai-needs-to-sit-beside-your-pms-not-inside-it | 18 May 2026 | Trade analysis (opinion) | Opened |
| G31 | Consumers' Checkbook, "Hotels' In-Room Smoking Sensors Falsely Charge Some Guests Hundreds in Fees". Fees of $250 to over $560; cases of non-smokers charged. US. https://www.checkbook.org/national/consumers-notebook/articles/Hotels-In-Room-Smoking-Sensors-Falsely-Charge-Some-Guests-Hundreds-in-Fees-7990 | 1 Jun 2026 | Consumer organisation report | Opened |
| G32 | PHPTravels blog quoting an Apaleo release that cites the h2c Hotel Chain Tech Report 2026: 15% of chains have a standard AI data-access layer; 52% no plans. Third-hand; check at h2c before use. https://phptravels.com/blog/ai-in-hospitality | 2026 | Vendor blog (secondary) | Opened |
| G33 | HOTELS Magazine, "What small hotels need to know about cybersecurity in 2026" (guest contributor). https://hotelsmag.com/news/cyberprotecting-your-hotel-matters-more-than-ever-heres-what-small-hotels-need-to-know/ | 20 Feb 2026 | Trade press (contributed) | Opened |
| G34 | Lighthouse blog, "E-invoicing for independent hoteliers in Europe" (explainer; no figures used). https://www.mylighthouse.com/resources/blog/e-invoicing-independent-hoteliers-in-europe | Undated | Vendor | Opened |
| G40 | Dishcraft dishwashing robot: Axios (2019), Hotel Business, Hotel Technology News (2021). https://www.axios.com/2019/06/18/dishcraft-robotics-dish-scrubber | 2019–2021 | Press | Search result only |
| G41 | Goods-receiving guides: https://yourpilla.com/blog/food-delivery-check ; https://www.tspoonlab.com/docs/en/articles/12571140-receive-delivery-notes-with-ai | Undated | Vendor | Search result only |
| G42 | Banquet event orders and event set-up: https://www.eventtemple.com/blog/beos-made-easy ; https://www.celayix.com/blog/banquet-scheduling-software/ | Undated | Vendor | Search result only |
| G43 | Attribution commentary: https://www.hospitality.today/article/are-hotels-paying-for-demand-they-would-have-captured-anyway ; Hospitality Net opinion "Attribution is breaking, completely" (Cloudflare, not opened) | 2026 | Trade commentary | Search result only |
| G44 | Supplier carbon data: https://finance.yahoo.com/sectors/energy/articles/uk-hotels-prepare-stricter-esg-070324223.html ; vendor blogs | 2025–2026 | Trade press / vendor | Search result only |
| G45 | Cornell 2017 survey of 381 revenue managers, via Skift: https://skift.com/2017/02/14/hotel-revenue-managers-cornell-2017-survey | Feb 2017 | Academic survey via trade press | Search result only |
| G46 | Voice-agent self-reported resolution rates (HelloShift, SendSquared): https://sendsquared.com/blog/ai-voice-agents-hotels-resorts/ ; hoteltechreport.com press release (Cloudflare) | 2026 | Vendor | Search result only |
| G47 | Virtual-card automation (RobosizeME): https://en.10minhotel.com/2026/05/11/hotels-lose-up-to-2-of-ota-revenue-monthly-robosizemes-new-automation-addresses-that-leakage/ (page loaded but the figures were not found in the text we extracted) | 11 May 2026 | Vendor announcement | Search result only for the figures |
| G48 | Corporate rate loading: https://www.businesstravelnews.com/More-News/Buyers-Boiling-Over-With-Rate-Loading-Frustration | Undated (older) | Trade press | Search result only |
| G49 | BOUNTE lost and found: https://hospitalitytech.com/bounte-debuts-low-touch-lost-and-found-system-using-ai-identify-and-return-items ; https://www.stayntouch.com/integrations/bounte | Undated | Trade press / vendor | Search result only (Cloudflare) |
| G50 | Overbooking relocation: https://costar.com/article/1992652780/how-to-walk-guests-when-a-hotel-is-overbooked ; WalkSource via TechCrunch | Undated | Trade press | Search result only |
| G51 | European Accessibility Act for hotels: https://www.hotelmanagement-network.com/newsletters/how-hotels-are-adapting-to-the-eu-and-uk-accessibility-laws | 2025 | Trade press | Search result only |
| G52 | AI and allergen liability: https://cm.twobirds.com/en/insights/2024/global/deploying-ai-in-a-hotel-chain-how-to-mitigate-privacy-and-digital-regulatory-risk ; https://webberwentzel.com/News/Pages/opportunities-and-challenges-of-ai-in-the-hospitality-sector.aspx | 2024 | Law-firm notes | Search result only |
| G53 | Camera-based minibar checks: https://www.sensfix.com/en/resources/hotels-blueprint | Undated | Vendor | Search result only |
| G54 | Sensor retrofit cost: https://oxmaint.com/industries/hospitality/state-hotel-maintenance-industry-report-technology-trends | 2026 | Vendor | Search result only |
| G55 | Water-safety sensors at an Ibis hotel in Lyon: https://www.adeunis.com/en/ibis-legionnella/ ; wattsense.com case (403) | Undated | Vendor case | Search result only |
| G56 | Kitchen prep robots: https://spectrum.ieee.org/chef-robotics-food-robots ; https://clubandresortchef.com/robots-in-the-kitchen-can-club-culinary-be-automated/ | Undated | Press | Search result only |
| G57 | Stock counting: https://en.10minhotel.com/2025/09/12/starbucks-deploys-ai-and-ar-to-speed-inventory-counts-from-hours-to-minutes ; https://www.wisk.ai/hilton | 2025 | Press / vendor | Search result only |
| G58 | Hotel e-procurement studies: https://www.torontomu.ca/content/dam/htmresearch/researchsnapshots/SnapshotProfiles/Snapshot%20PDF/canadianlodgingindustry.pdf ; https://www.thecaterer.com/news/foodservice/e-procurement-purchasing-power | 2009, 2014 | Academic snapshot / trade press | Search result only |
| G59 | Tourist tax and e-invoicing: https://www.prostay.com/blog/hotel-tourist-tax-city-tax-2026/ ; https://www.prostay.com/blog/hotel-e-invoicing-mandates-eu-2026/ | 2026 | Vendor | Search result only |
| G60 | Tips distribution: https://www.unifocus.com/blog/fair-tips-for-fair-work-understanding-the-new-tipping-law | Undated | Vendor | Search result only |
| G61 | Month-end close: https://www.prostay.com/blog/hotel-accounting-2026-night-audit-to-general-ledger-cleanup-playbook/ | 2026 | Vendor (27-hotel sample) | Search result only |
| G62 | Works councils and scheduling software: https://www.cov.com/en/news-and-insights/insights/2026/07/works-council-rights-in-ai-implementation-projects ; https://soon.works/blog/or-instemming-scheduling-software | 2026 | Law firm / vendor | Search result only |
| G63 | Brand-standard audits by camera: https://mobidev.biz/blog/quality-inspection-ai-agent-for-hotels-restaurants ; https://cloud.google.com/transform/new-hospitality-ai-for-hotel-operators-operations-loyalty-guest-experience | Undated | Vendor | Search result only |
| G64 | Pool drowning detection (Coral MYLO at Leonardo Plaza Cypria Maris, Paphos): https://hotelbusiness.com/?p=233901 ; https://www.lynxight.com/content/swimeye-or-cctv-based-ai-which-suits-your-pool-estate | Undated | Trade press / vendor | Search result only (Cloudflare) |

**Count:** 34 sources opened (G1–G34; G3, G16 and G26 only in part), 25 search-result-only leads (G40–G64).

**Could not be opened (not bypassed):** hospitalitynet.org, hoteltechreport.com, hotelmanagement.net, phocuswire.com, hospitalitytech.com, hotelbusiness.com, hotelinvestmenttoday.com, traveldailynews.com, hospitality-on.com, inkl.com (all Cloudflare or 403); mews.com press page and wattsense.com (403); the AHLA/HTNG "T100 Top Industry Technology Challenges" PDF (returned a web page, not the file). The HOTREC roadmap, the h2c reports, the Otelier index and the Booking.com/Statista barometer were read through trade-press coverage, not in the original.

**Limits of this note**
- Most survey evidence comes from vendor or platform-commissioned surveys. They show what hoteliers say, not what was measured.
- European evidence is strongest for patterns 1 and 2 (Booking.com/Statista barometer, HES-SO via WKO, HOTREC). Much of the rest is US or global.
- Several gaps (attribution, supplier carbon data, seasonal-worker paperwork, compliance calendar) rest on "we searched and found no product". Treat them as hypotheses for the interviews, not as findings.
