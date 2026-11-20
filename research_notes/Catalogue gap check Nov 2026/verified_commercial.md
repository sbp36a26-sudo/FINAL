# Verified sources: commercial candidates (#1, #2, #3, #5, #7, E6)

Checked 20 Nov 2026, second pass after `source_check.md`. Method: every page below was fetched in this session with `curl -sSL -A "Mozilla/5.0"` and read as text. "HTTP 200" means the page loaded and the quoted sentence was found in it. Search-engine summaries were used only to find URLs and never count as evidence. No AIHA, no Wikipedia. Bot-protected pages were not bypassed (no archive copies, no header tricks).

**Reading the tables.** "Says AI?" = whether the page itself uses "AI" or "machine learning" for this function (not just in the site menu). Type: V = vendor claim, HG = hotel-group statement, TP = independent trade press, TP(v) = trade press quoting or reprinting a vendor, AC = academic/teaching material, CON = consultancy.

## Summary

| # | Candidate | Verdict | Adoption | Opened sources | European hotel example | Non-vendor source |
|---|---|---|---|---|---|---|
| 1 | AI rate parity monitoring | **Add as new row** (Revenue Management): "Rate parity monitoring and automatic price matching" | Low | 9 | Radisson Hotel Group (Brussels) | Hotel Management Network; TTG Asia; Hotel Technology News |
| 2 | Abandoned-booking recovery | **Add as extension** of "Booking-engine AI assistant & personalisation", labelled "mostly rules-based" | Low (AI part: not shown) | 7 | Eden Hotels, The Manor Amsterdam (vendor case) | eHotelier (Mogelonsky); HOTELS; Horwath HTL |
| 3 | Channel content accuracy | **Add as extension** of "SEO / AI-search (GEO) visibility" | Very low | 6 | IHG (UK), content platform, not a monitoring tool | Skift; HOTELS; PolyU teaching case |
| 5 | Group displacement / meeting space | **Add as extension** of "Revenue, budget & total-revenue forecasting (incl. function space)" | Low | 10 | Get Into More clients in BE/NL (vendor testimonials only) | Lodging Magazine (interview with a vendor engineer); no fully independent source |
| 7 | Guest profile de-duplication | **Add as extension** of "Guest personalisation from unified guest profile" | Low | 6 | Radisson Hotel Group (CDP case, not PMS de-duplication) | Hospitality Upgrade; HOTELS |
| E6 | Post-stay review requests | **Add as extension** of "Review analysis and sentiment" | Medium (requests, our estimate, no survey), Low (AI part) | 5 | My Arbor (IT), The Cottage Hotel (UK), Dorint (DE/AT/CH) | HOTELS (two articles) |

No candidate is dropped and none goes to the gaps section. No adoption survey was found for any of the six, so every adoption level is our estimate from the type of evidence, not a measured share.

---

## 1. AI rate parity monitoring

| id | URL | HTTP | Date on page | Exact sentence(s) | Says AI? | Type |
|---|---|---|---|---|---|---|
| 1-A | https://www.hoteldive.com/press-release/20260622-lighthouse-and-bowerbird-technologies-give-hotels-the-first-end-to-end-solu/ | 200 | 25 Jun 2026 | "Lighthouse Parity Insight uses AI-powered detection to monitor rate parity in real time across hundreds of distribution channels. It surfaces not just isolated discrepancies but the systematic repeat offenders driving the largest share of parity loss across a portfolio." / "Radisson Hotel Group, one of the world's largest hotel companies, was among the first to put the combined solution to the test. In a pilot, all targeted unauthorized sellers were removed within scope. Parity loss dropped by ~25%. Parity Meet rates improved by +20%. Radisson has since expanded the program." | Yes | V (press release, same text as the blocked Hospitality Net lead 1-a) |
| 1-B | https://www.hotelmanagement-network.com/newsletters/lighthouse-and-bowerbird-partner-to-curb-hotel-rate-undercutting | 200 | 26 Jun 2026 | "Lighthouse's Parity Insight tool uses AI to track rate parity in real time across hundreds of distribution channels." / "In a pilot, all targeted unauthorised sellers were removed within scope and parity loss was reduced by around 25%, according to Lighthouse." | Yes | TP (reports the release, attributes the figure to Lighthouse) |
| 1-C | https://insights.ehotelier.com/global-news/2026/07/06/radisson-hotel-group-launches-hospitality-industry-leading-ai-powered-real-time-price-matching-technology/ | 200 | 6 Jul 2026 | "The new feature automatically detects lower publicly available rates for Radisson Hotel Group properties on third-party booking platforms and instantly matches them on RadissonHotels.com—removing the need for guests to submit claims, screenshots, or wait for manual approval." / "the AI-powered system automatically verifies the discrepancy and matches eligible lower publicly available rates" (both from the release text; the release also quotes Gianni Di Fede, Global Chief Commercial Officer) | Yes | HG (Radisson press release, Europe) |
| 1-D | https://www.ttgasia.com/2026/07/29/radisson-rolls-out-ai-powered-real-time-rate-matching/ | 200 | 29 Jul 2026 | "the AI checks the discrepancy in real time and automatically applies the matching rate on Radisson's website." / "the system only matches equivalent bookings with the same room type, stay dates, occupancy, cancellation policy and inclusions." / "Since its launch, the tool has delivered a 19 per cent increase in direct-channel conversions compared with a control group" | Yes | TP (quotes Velit Dundar, VP e-commerce, Radisson) |
| 1-E | https://hoteltechnologynews.com/2026/07/radisson-hotel-group-launches-ai-powered-price-matching-as-direct-booking-battle-enters-a-new-phase/ | 200 | 4 Jul 2026 | "Most major hotel groups continue to promote best-rate or price-match guarantees, but the processes still generally depend on manual claim submission and review." / "Lighthouse, meanwhile, has expanded its rate parity strategy through a partnership with Bowerbird Technologies that combines AI-powered parity monitoring with enforcement against unauthorized inventory and repeat offenders." | Yes | TP (analysis; names Triptease, 123Compare.me, Lighthouse, The Hotels Network, RateGain) |
| 1-F | https://www.paratytech.com/en/news/the-best-online-price-isnt-given-away-its-protected.html | 200 | 03/08/2026 | "long before AI became the industry's favorite buzzword, we had already solved this challenge—and we continue to do so—with Parity Maker." / "When a rate disparity matches your criteria, the tool takes action automatically." / "Rate Check hides the OTA price from the comparison and alerts your revenue team." | No (says its own tool is rule-based; calls AI a buzzword) | V (Spain) |
| 1-G | https://www.triptease.com/price-match | 200 | no date | "When an OTA undercuts you, Price Match responds automatically, on metasearch and your booking engine. You set the rules. Triptease applies only the discount needed to win." | No | V (UK) |
| 1-H | https://www.hotelchamp.com/blog/press-release-ratebeat-free-trials | 200 | 25 Feb 2026 | "Through a widget, it scans OTA prices in real time, compares them against the hotel's direct rate, and, when a lower price is detected, generates a matching offer that guests can apply instantly." | No | V (Netherlands) |
| 1-I | https://www.hotelchamp.com/product/ratebeat | 200 | no date | "RateBeat checks OTA rates in real time for the same search context (dates, guests, taxes and policies), so comparisons are relevant and reliable." | No | V |

**Figures and who measured them**
- **Radisson pilot, ~25% lower parity loss and +20% parity meet rate:** seen on 1-A (and 25% on 1-B). Reported by **Lighthouse** in its own press release. The page gives no number of hotels, no period, no baseline, and no quote from Radisson. Use only as "according to Lighthouse (vendor), pilot with Radisson Hotel Group, base and period not published".
- **Radisson, +19% direct-channel conversions vs a control group:** seen on 1-D only. TTG Asia does not say who measured it; the article is built on Radisson's statements, so treat it as **Radisson self-reported**. Period: "since its launch" (early July to 29 July 2026, about four weeks). Size of test and control groups not given. It is not in Radisson's own release (1-C).

**What this shows.** Two different things carry the "AI" label: (a) portfolio parity monitoring that finds repeat offenders (Lighthouse), and (b) real-time price matching on the hotel's own site (Radisson; also Triptease, Hotelchamp, Paraty, which do **not** call it AI). Paraty's page is useful for honesty: a vendor saying the same function has run on business rules for years.

**Verdict: add as new row**, Revenue Management, "Rate parity monitoring and automatic price matching". It is distinct from "Competitor rate shopping" (own rate across channels, not competitors' rates) and now has a European hotel group using the AI label in its own name plus three trade-press pieces.
**Adoption: Low** for the AI version (one named group, 2026 launches). Parity tools in general are widely sold, but no survey was found, so do not write Medium.
**Text for the row should say:** price matching is mostly rules-based; AI is claimed for detecting and verifying discrepancies.
**AI Act:** minimal risk (our reading). Competition-law context as in `source_check.md` (check with D7).

**Example vendors (opened):** Lighthouse Parity Insight (1-A), Triptease Price Match (1-G), Hotelchamp RateBeat (1-H, 1-I), Paraty Tech Parity Maker / Rate Check (1-F).

**Failed:** Hospitality Net 1-a and Hotel Tech Report 1-c (Cloudflare 403); cendyn.com and www.cendyn.com `/rate-match` (Cloudflare 403 "you have been blocked"); rategain.com (every path returns a "Request Rejected" firewall page, so 1-e is unverified); PhocusWire search (403).

---

## 2. Abandoned direct-booking recovery

| id | URL | HTTP | Date | Exact sentence(s) | Says AI? | Type |
|---|---|---|---|---|---|---|
| 2-A | https://hotelsmag.com/news/4-trends-hotel-revenue-managers-need-to-pay-attention-to-in-2024/ | 200 | 15 Mar 2024 | "Hotels can quickly improve their online conversion by implementing email cart abandonment functions that automatically follow-up with prospective guests and offer them assistance with making the booking." | No | TP (guest contributor) |
| 2-B | https://insights.ehotelier.com/insights/2026/05/20/beware-of-spamming-for-your-hotel-crm-marketing-journeys-in-2026/ | 200 | 20 May 2026 | "This same logic extends to cart abandonment strategies, particularly when paired with next-generation online booking engines. An online booking engine (OBE) should support a branded, discovery-oriented interface, flexible ancillary add-ons and early-stage email capture. Capturing contact information before checkout dramatically expands retargeting opportunities." | No | TP (Adam and Larry Mogelonsky, consultants) |
| 2-C | https://www.hotelchamp.com/blog/case-study-eden-hotels-converting-leaving-booking-engine-guests | 200 | 4 Jan 2023 | "Eden Hotels were looking to capture potential guests abandoning the booking engine of their luxurious The Manor, Amsterdam property's website." / "With a high click-through rate of nearly 12%, the message successfully reached the right audience" / "Over the span of one month, it generated outstanding results—converting over 22.6% of the visitors that have clicked on the message." | No | V case study (European hotel) |
| 2-D | https://www.hotelchamp.com/blog/case-study-retargeting-emails-booking-funnel | 200 | 17 May 2021 | "The technology works by automatically recognising the email entered by the guest on the check-out step. After one hour, if they haven't made a booking, the retargeted email is sent out." / "On average the retargeted emails had an open rate of 79.2% and a staggering click rate of 34.7% (weighted average)." / "to receive these emails the guest must first consent" | No (fixed one-hour rule) | V |
| 2-E | https://www.triptease.com/email | 200 | no date | "Identify guests who abandon their booking and automatically prompt them to return and complete it. Emails are ready to go and can be customized to match your brand and tone." / "Around 80% of guests who reach the booking engine leave without completing their reservation." | No | V (UK) |
| 2-F | https://www.cartstack.com/solutions/hospitality (redirect from the lead `/rezrecover`) | 200 | no date | "CartStack follows up — email, SMS and push — with the exact stay they left behind, and brings a real share of them back to book direct." | No | V (US) |
| 2-G | https://workshop.horwathhtl.com/resources/case-studies/ovolo-revinate-cart-abandonment | 200 | © 2026, no article date | "The pilot ran 2 months from April 2022 under group marketing director Stephen Howard, and targeted abandoned-cart recovery" / "600 abandoned-cart leads → 92 reservations recovered (group-wide, 2-month campaign)" / "Range across the 8 properties: 4× (Mamaka) to 52× (Woolloomooloo)" / "Cherry-picking the top-performing property's ROI (52×) is exactly what AI-washing looks like." | Page sits in an "AI workshop" library but describes two plain emails | CON (Horwath HTL, summarising Revinate's published case; APAC, not Europe) |

**Figures and who measured them**
- **Eden Hotels / The Manor Amsterdam (2-C):** ~12% click-through, 22.6% of clickers converted, one month, one hotel. Measured and published by **Hotelchamp** (vendor). No visitor counts. Note this is an exit message with a 15% voucher in the booking engine, plus e-mail capture, not an e-mail sequence.
- **Hotelchamp saved-search e-mails (2-D):** 79.2% open, 34.7% click (weighted average); range 8% to 50%. "A sample of hotels" using Hotelchamp, number and names not given, 2021. Vendor-measured.
- **Ovolo (2-G):** 600 leads to 92 reservations, 17× group ROI, 4× to 52× by hotel, 8 hotels, two months from April 2022. Figures **published by Revinate**; Horwath HTL repeats them and warns against the 52× headline. Not Europe.
- Triptease's "around 80%" abandonment figure (2-E) has no source on the page; do not use.

**What this shows.** The practice is real and has a European hotel example, but **no opened page calls it AI**. It is trigger-based automation (send after one hour, show on exit).

**Verdict: add as extension** of "Booking-engine AI assistant & personalisation", one line, worded as "abandoned-booking follow-up (mostly rules-based; AI only where the tool chooses content or timing, which no opened source demonstrates)". A separate row would overstate AI.
**Adoption: Low**, our estimate; no survey found.
**AI Act:** minimal. GDPR/ePrivacy flag stands; 2-D itself says the guest must consent before the e-mail is sent.

**Example vendors (opened):** Hotelchamp (2-C, 2-D), Triptease Email (2-E), CartStack (2-F). Revinate is named on 2-G but its own site could not be opened.

**Failed:** revinate.com (plain 403 on every path); Hospitality Net 2-b (Cloudflare); PhocusWire article on AI in the guest journey (403).

---

## 3. Channel content accuracy monitoring

| id | URL | HTTP | Date | Exact sentence(s) | Says AI? | Type |
|---|---|---|---|---|---|---|
| 3-A | https://hotelsmag.com/news/ai-powered-agentic-hospitality-launches-to-help-hotels-drive-visibility-and-direct-bookings/ | 200 | 20 Aug 2025 | "Schema Adapter: Converts hotel content and availability, rates and inventory (ARI) into structured, Schema.org machine-readable data for all distribution channels" | Yes | TP(v) (vendor launch) |
| 3-B | https://hotelsmag.com/news/how-ai-is-rewriting-hotel-distribution-one-booking-at-a-time/ | 200 | 29 Sep 2026 | "Leidinger said Hilton is focusing heavily on the content it controls, arguing that hotel companies need to make property descriptions, imagery and other information easily accessible to the large language models that increasingly influence travelers." | Yes (about LLMs reading content) | TP / HG (Hilton, US) |
| 3-C | https://skift.com/2026/02/17/ihg-overhauls-its-hotel-data-for-ai-agents/ | 200 | 17 Feb 2026 | "The most visible change is a new “digital and AI-compatible hotel content platform” that restructures hotel information into modular, machine-readable data." | Yes | TP / HG (IHG, UK-headquartered) |
| 3-D | https://uno.rategain.com/?p=1064 | 200 | 28 Sep 2024 (page metadata) | "UNO AI Scores Your hotel, Tells You What to Fix. Get detailed content score with our AI that benchmarks your hotel's content such as media, amenities, hotel description etc against competitors on specific OTAs" | Yes | V |
| 3-E | https://oer.lib.polyu.edu.hk/concern/works/tx31qj14d | 200 | 2025 | "PropertyVIEW is an advanced content monitoring tool for hotels, leveraging AI and machine learning to ensure accurate, consistent listings across digital platforms. It audits amenities, photos, and descriptions, providing detailed accuracy scores and alerts for inconsistencies. However, integration can be complex, and over-reliance on AI may result in occasional undetected errors." | Yes | AC (Hong Kong PolyU teaching case; abstract only read) |
| 3-F | https://insights.ehotelier.com/insights/2026/06/19/the-black-box-of-hotel-distribution/ | 200 | 19 Jun 2026 | "Outdated and conflicting hotel content across B2B distribution channels is becoming a credibility risk as AI search systems evaluate information from multiple sources to determine trustworthiness." / "Most hotels don't discover these issues because they are actively monitoring every downstream distribution channel." | Yes (AI search as the reason, not the tool) | V opinion in trade press (author Fred Bean, CEO of HotelPORT) |

**What this shows.** Two vendors offer AI content scoring or auditing (RateGain UNO, HotelPORT PropertyVIEW). Hotel groups (Hilton, IHG) talk about **structuring** their content for AI, which is the supply side of the same problem, not a monitoring tool. No hotel is named as a user of a monitoring tool, and no result figure exists. 3-F states plainly that most hotels do not monitor downstream channels.

**Verdict: add as extension** of "SEO / AI-search (GEO) visibility": "keeping listing content consistent across OTAs and AI assistants; AI audit tools exist, no named hotel user".
**Adoption: Very low** (two vendor offers, no deployment evidence, no survey).
**AI Act:** minimal (our reading); consumer-law note from `source_check.md` unchanged.

**Example vendors (opened):** RateGain UNO (3-D), HotelPORT PropertyVIEW (3-E, 3-F), Agentic Hospitality (3-A).

**Failed:** rategain.com main site (firewall "Request Rejected"); hospitalitytech.com "How OTAs are failing the hotel industry" (403); 10minhotel content article (404).

---

## 5. Group displacement and meeting-space optimisation

| id | URL | HTTP | Date | Exact sentence(s) | Says AI? | Type |
|---|---|---|---|---|---|---|
| 5-A | https://lodgingmagazine.com/five-advantages-for-group-sales-teams-leveraging-ai-powered-revenue-management/ | 200 | 6 Apr 2026 | "the system can instantly compare a midweek two-night pattern to a weekend three-night pattern, revealing which delivers higher total profit after accounting for displacement, ancillary spend, and space utilization. This removes hours of manual spreadsheet work." / "By forecasting unconstrained demand and applying intelligent pricing and space optimization, hotels can confidently accept the most profitable mix of business while minimizing revenue loss from displaced guests." | Yes ("AI-powered RMS") | TP(v) (LODGING interview with an IDeaS solutions engineer) |
| 5-B | https://hotelsmag.com/news/ideas-presents-new-commercial-strategy-solutions-as-hotels-expand-beyond-traditional-revenue-management/ | 200 | 16 Jun 2026 | "Group and event space strategies with Function Space, helping hotels maximize the value of high-demand function and event inventory." | Not for this feature | TP(v) |
| 5-C | https://hotelsmag.com/news/on-rate-hotels-magazines-top-5-revenue-management-companies/ | 200 | 8 Nov 2024 | "It created OpenSpace and pricing for Functions S[pace]" (Duetto; sentence re-read on the page) | Not for this feature | TP(v) |
| 5-D | https://hotelsmag.com/news/amadeus-adds-ai-booking-and-workflow-tools-to-hospitality-portfolio/ | 200 | 16 Jun 2026 | "Within Amadeus Delphi and Amadeus MeetingBroker, Amadeus Max will automate sales workflows and assess group and event RFPs." | Yes (announced, "will") | TP(v) |
| 5-E | https://www.getintomore.com/ | 200 | © 2026 | "MAX - AI. Automated Meeting & Events Revenue Management System." / "The AI is trained to predict the likelihood of receiving more profitable inquiries than the one sitting on your desk right now. The output is based on a simple traffic light principle: If you get a green light, you send out an offer." / "Hotels often overlook MICE revenue. Get Into More gave us clear insights into meeting room performance — a real game-changer!" (Priscilla Moreau, MICE & Entertainment Manager, Botanic Sanctuary Antwerp) | Yes | V (Brussels) with European hotel testimonials |
| 5-F | https://www.duettocloud.com/en-us/library/unlock-more-profit-with-every-group | 200 | 11 Jan 2019 | "BlockBuster, Duetto's group optimization app, will now display a detailed profit displacement analysis focusing on transient rooms and ancillary spend" | No | V |
| 5-G | https://www.duettocloud.com/en-us/press-releases/duettos-new-blockbuster-application-helps-hotels-casinos-book-profitable-group-business | 200 | 6 Nov 2017 | "BlockBuster allows hotels and casinos to use a more dynamic pricing structure for group business that reflects demand for all consumer segments and optimizes prices by room type" | No | V |
| 5-H | https://www.infor.com/en-au/blog/ai-hotel-commercial-engine | 200 | 28 May 2026 | "It cross-references live inventory against your revenue management system (RMS) and runs displacement calculations. Not just \"can we fit this group?\" but \"if we accept this group at $200 per night, how much higher-rated transient business are we walking away from?\"" | Yes ("AI group quotation agent") | V blog |
| 5-I | https://roompricegenie.com/group-displacement-calculator/ | 200 | no date | "Easily compare forecasted revenue from transient bookings with potential group income thanks to RoomPriceGenie's hotel Group Displacement Calculator." | No | V (Switzerland-based vendor) |
| 5-J | https://www.mews.com/en/blog/hotel-displacement-analysis | 200 | no date read | "a modern revenue management system (RMS) can automate much of the work." | No | V explainer |

**European example.** Get Into More (5-E) shows testimonials from Room Mate Hotels (Commercial Director Netherlands), Botanic Sanctuary Antwerp, Crowne Plaza Antwerp and Holiday Inn Brussels Airport. All four quotes praise the **analytics and reporting** product; none mentions the AI module (MAX) or gives a figure. So Europe has named users of meetings-and-events revenue tools, but no verified user of the AI accept/decline function.

**Non-vendor source.** None that is fully independent. 5-A is the best: a trade magazine's own article, but every substantive sentence is a quote from an IDeaS employee. Displacement analysis as a method is old and well documented (5-F is from 2019, 5-G from 2017); what is new is the AI label.

**Figures.** None used. No opened page gives a measured result.

**Verdict: add as extension** of "Revenue, budget & total-revenue forecasting (incl. function space, beyond rooms)"; rename to "... incl. function space and group displacement".
**Adoption: Low** (vendor offers from at least six suppliers; no named hotel result; no survey). Mostly relevant for hotels with meeting space.
**AI Act:** minimal (our reading).

**Example vendors (opened):** IDeaS (5-A, 5-B), Duetto BlockBuster/OpenSpace (5-C, 5-F, 5-G), Get Into More MAX (5-E), Amadeus Delphi/MeetingBroker (5-D, announced), RoomPriceGenie (5-I, calculator, no AI claim).

**Failed:** ideas.com (Cloudflare 403 on all pages; this blocks two UK success stories found in its sitemap, "Thwaites meetings & events strategy" and "The Abbey Hotel transforms events revenue strategy with SmartSpace", which would be the best European hotel evidence and should be opened in a browser); Hospitality Net explainer 5-e and Hotel Tech Report 5-d (Cloudflare); SmartBrief group article (403).

---

## 7. Guest data clean-up / profile de-duplication

| id | URL | HTTP | Date | Exact sentence(s) | Says AI? | Type |
|---|---|---|---|---|---|---|
| 7-A | https://www.hospitalityupgrade.com/magazine/summer-2026/the-golden-guest-record-why-hotels-still-struggle-with-guest-identity | 200 | Summer 2026 issue ("Jun 6, 2026" on page) | "despite decades of investment in CRM, PMS and now CDP technologies, most hotel organizations are still far from achieving it." / "duplicate profiles are one of the most persistent issues in hospitality, often caused by simple variations." / "Online travel agencies (OTAs) frequently obscure guest contact information, replacing real emails with proxy addresses." / "Without sophisticated identity resolution, these remain separate records." / "AI-driven recommendations, chatbots and agentic workflows depend on clean, unified data. Without it, AI amplifies errors instead of solving them" | AI as the reason to clean data, not as the cleaning method | TP (Mark Haley and Mark Hoare, consultants; no vendor named) |
| 7-B | https://hotelsmag.com/news/ai-wont-fix-bad-data-hoteliers-say-the-foundation-comes-first-webinar/ | 200 | 27 Jul 2026 | "It will require clean, connected data, integrated technology systems, clear accountability and organizations willing to change." | Context only | TP (US hoteliers) |
| 7-C | https://ireckonu.com/cdp/match-merge/ | 200 | 23 Aug 2024 (page metadata) | "Duplicate Elimination – Machine Learning. Identify, match, merge, and deduplicate guest data automatically or manually, to get a single, reliable profile for each guest." / "Automate the matching and de-duplication of profiles with 80% accuracy and review the rest to keep your data clean." / "\"The Match and Merge process was very important to us as a company, that we did it right, and that we didn't make mistakes.\" Duane Robinson, Director of Guest Data at Mandarin Oriental Hotel Group" | Yes | V (Amsterdam); hotel-group quote (Hong Kong group) |
| 7-D | https://my.trustyou.com/blog/single-guest-profile-hotel-cdp | 200 | 15 Apr 2026 | "A CDP uses identity resolution, matching on email, phone, booking reference, and behavioral signals, to merge these into a single profile." | No (matching described, not called ML) | V (Munich) |
| 7-E | https://tealium.com/resource/case-study/radisson-hotel-group-is-reshaping-the-future-of-intelligent-hospitality/ | 200 | 16 Apr 2026 | "A guest who clicked a campaign, browsed on the web, then completed a booking in the app often appeared as three different “customers” in three different systems." / "RHG connects data from web, mobile apps and key media platforms into unified guest profiles" / "For campaigns using CDP‑built audiences, RHG recorded a 67% increase in Return on Ad Spend and a 127% increase in Conversion Rate compared with similar campaigns that did not use CDP audiences." | Not for the matching (AI is the "roadmap" built on it) | V case study with a European hotel group |
| 7-F | https://skift.com/2026/02/17/ihg-overhauls-its-hotel-data-for-ai-agents/ | 200 | 17 Feb 2026 | "The company is also enhancing direct booking channels and loyalty programs through unified guest data and a Salesforce-based CRM system." (from the article's summary block) | No | TP |

**Figures and who measured them**
- **iReckonu "80% accuracy" (7-C):** vendor claim, no definition of accuracy, no base. Do not use as a result; at most "the vendor says about 80% of matches are automated and the rest reviewed by staff".
- **Radisson 67% ROAS / 127% conversion (7-E):** published by **Tealium** (vendor), "recorded" by RHG; paid-media campaigns using CDP audiences vs similar campaigns without; number of campaigns, markets and period not given. This measures **audience targeting**, not de-duplication, and covers web/app/media identity, not PMS records. Do not attach it to this use case as a result.

**What this shows.** Trade press confirms the problem is widespread and unsolved (7-A, 7-B). One European vendor says it uses machine learning for match-and-merge (7-C); another describes the same function without calling it ML (7-D). The only European hotel group example (Radisson, 7-E) is a marketing CDP. No opened source shows a European hotel group using ML to merge PMS guest records, and none gives a de-duplication result.

**Verdict: add as extension** of "Guest personalisation from unified guest profile": "the clean-up step: matching and merging duplicate guest records (ML in some CDPs)". Not a separate row; the evidence for AI is one vendor page.
**Adoption: Low** (our estimate; 7-A says most hotels are "still far from" a single record).
**AI Act:** minimal. GDPR points from `source_check.md` stand; 7-A itself lists consent conflicts between systems as a reason records are hard to merge.

**Example vendors (opened):** iReckonu Match & Merge+ (7-C), TrustYou CDP (7-D), Tealium (7-E, cross-industry). Revinate and Cendyn are the best-known names but neither site could be opened.

**Failed:** revinate.com (403; leads 7-b and "profile synthesis" unverified, so the "22% lift" and "1 million merged profiles" claims seen in search summaries must not be used); Hotel Tech Report 7-c (Cloudflare); support.cdp.trustyou.com 7-d (403); hsmai.eu Cendyn item (Cloudflare 403); cendyn.com (Cloudflare 403).

---

## E6. Automated post-stay review requests

| id | URL | HTTP | Date | Exact sentence(s) | Says AI? | Type |
|---|---|---|---|---|---|---|
| E6-A | https://hotelsmag.com/news/how-ai-is-automating-the-entire-hotel-guest-journey/ | 200 | 18 Jan 2024 | "They can also prompt guests to leave online reviews." (about virtual assistants after departure) | Yes | TP (general) |
| E6-B | https://hotelsmag.com/news/guests-are-increasingly-asking-ai-where-to-stay-will-it-recommend-your-hotel/ | 200 | 20 Aug 2026 | "proactively ask guests directly to review your hotel" | AI search as the reason | TP (advice) |
| E6-C | https://www.customer-alliance.com/en/casestudies/post-stay-feedback-my-arbor-hotel (the lead `?p=60885` redirects to the home page) | 200 | 02/07/2025 | "Google reviews increased by approximately 55.5% compared to the same period the year before the integration" / "In 2025, 70% of My Arbor's Tripadvisor reviews came directly from Customer Alliance's automated post-stay distribution." / "After check-out, for example, every guest receives a post-stay message sent automatically by the CRM, Re:Guest." / "The system handles this automatically, rotating between platforms week by week." | No (automation; AI appears only in the site menu) | V case study (hotel in South Tyrol, Italy; Executive Assistant Sara Priller quoted) |
| E6-D | https://www.guestrevu.com/capturing-reviews-with-guestrevu-for-the-cottage-hotels-new-website | 200 | no date; footnote "Q2 2024 vs Q2 2025" | "We now prompt guests to leave reviews by incorporating a link in our checkout emails that are sent 'post-stay'." (Dan Darcy, Revenue Manager) / "The Cottage Hotel used GuestRevu to increase the number of online reviews they receive by 63%, and in total their overall guest feedback volume has risen by 430%*." | No | V case study (hotel in Devon, UK) |
| E6-E | https://www.customer-alliance.com/en/casestudies/dorint-hotels-guest-feedback-management | 200 | 01/07/2026 | "Dorint Hotels & Resorts has been a Customer Alliance customer since 2013, using the platform to support guest feedback intelligence and reputation management across around 60 hotels in Germany, Austria, and Switzerland." | No | V case study (European hotel group) |

**Figures and who measured them**
- **My Arbor, +55.5% Google reviews; 70% of 2025 Tripadvisor reviews from the automated flow (E6-C):** published by **Customer Alliance** (vendor) with the hotel's cooperation. One 5-star hotel. Comparison: same period the year before the integration; the period itself and the absolute review counts are not given. Note the page says "approximately 55.5%", so the "55%" in the lead is a rounding.
- **The Cottage Hotel, +63% online reviews, +430% total feedback volume (E6-D):** published by **GuestRevu** (vendor). One hotel. Q2 2024 vs Q2 2025. No absolute counts. The search lead said the hotel's GM verified it on Hotel Tech Report; that page is Cloudflare-blocked, so the verification claim is **not** confirmed here. The opened page quotes the Revenue Manager, not the GM.
- Both are small-base, vendor-published, single-hotel percentages. If used, write "one hotel, vendor case study, review counts not published".

**What this shows.** Automated review requests are standard in reputation tools and have two European hotel examples with results plus a 60-hotel European group as a long-term user. **None of the hotel pages calls the request flow AI**; only the general trade article (E6-A) links it to AI assistants.

**Verdict: add as extension** of "Review analysis and sentiment": "automated post-stay review requests (standard automation; AI only for wording or timing, not evidenced)".
**Adoption: Medium for automated requests** (our estimate from it being a standard product feature with long-standing chain users; no survey found), **Low for an AI element**.
**AI Act:** minimal. Review-gating / consumer-law flag from `source_check.md` unchanged; E6-C describes sending some guests to a private survey and others to public review sites, which is the pattern D7 should look at.

**Example vendors (opened):** Customer Alliance (E6-C, E6-E), GuestRevu (E6-D), Re:Guest (named on E6-C as the CRM that sends the message).

**Failed:** Hotel Tech Report E6-c (Cloudflare). The TrustYou AI guide loaded (200) but the review-request sentence from the search summary was not found in the page text, so it is not counted.

---

## What could not be opened (all candidates)

| Host | Result | Effect |
|---|---|---|
| www.hospitalitynet.org | Cloudflare challenge 403 | Lighthouse release replaced by the identical text on Hotel Dive (1-A); Ovolo case replaced by Horwath HTL summary (2-G); displacement explainer not replaced |
| hoteltechreport.com | Cloudflare 403 | RateBeat news replaced by Hotelchamp's own release (1-H); Cottage Hotel replaced by GuestRevu's page (E6-D); Revinate profile synthesis and RoomPriceGenie news not replaced (RoomPriceGenie product page opened instead) |
| cendyn.com / www.cendyn.com | Cloudflare block 403 | Cendyn Rate Match unverified; removed from the example-vendor lists |
| www.revinate.com | 403 on every path | All Revinate claims unverified |
| rategain.com | firewall "Request Rejected" page (HTTP 200, 269 bytes) | RateGain parity blog unverified; uno.rategain.com did open (3-D) |
| ideas.com | Cloudflare 403 | Two UK function-space success stories not read |
| www.phocuswire.com, hospitalitytech.com, www.hotelmanagement.net | 403 on article and search pages tried | No evidence taken from them |
| hsmai.eu, support.cdp.trustyou.com, www.smartbrief.com | 403 | Not counted |

Open in a browser before the catalogue text is final: the two IDeaS UK success stories (#5), the Hospitality Net copy of the Lighthouse release if a second copy is wanted (#1), and the Hotel Tech Report Cottage Hotel page if the "verified by the GM" wording is to be used (E6).
