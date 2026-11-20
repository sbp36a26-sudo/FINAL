# Source check: catalogue gap candidates (9 new uses + 6 extensions)

Checked 20 Nov 2026. Catalogue: `tools/use-case-catalogue/index.html` (95 uses, 15 departments). Same evidence standard as `research_notes/AI register review/catalogue_additions_source_check.md`: a source counts as **verified** only if its page was loaded and read in this session. Search-engine summaries are **leads only** and never count as verification. Vendor pages can confirm "vendor offers X", not results. No AIHA, no Wikipedia.

## Read this first: most sources could not be opened

This session could open almost nothing, so most verdicts below are **provisional**.

- **WebFetch** fails for every host outside the environment allowlist ("ENOTFOUND"): skift.com, phocuswire.com, cendyn.com, rategain.com, cartstack.com, revinate.com, hotelchamp.com, hotelmanagement.net, hotel-online.com, lodgingmagazine.com, sec.gov, web.archive.org all failed.
- **Cloudflare challenge (HTTP 403)** on www.hospitalitynet.org and hoteltechreport.com, even though both are on the allowlist. (Same as on 18 Nov.)
- **Context.dev scraper:** out of credits (0 left; refill 11 Dec 2026). Not used.
- **What did load:** hotelsmag.com (HOTELS magazine, trade press) and www.unifocus.com. Every "yes" in the Loaded column below is one of these pages, read with curl from this session.
- To finish the check, these hosts must be allowed in the environment's network settings (or the pages opened in a browser): hospitalitynet.org (needs a browser), hoteltechreport.com (needs a browser), skift.com, phocuswire.com, hotelmanagement.net, lodgingmagazine.com, revinate.com, cendyn.com, rategain.com, triptease.com, hotelchamp.com, cartstack.com, customer-alliance.com, actabl.com, sec.gov, superb-ai.com.

Lead URLs below came from search results. Nothing was invented, but none of the leads were opened, so check the claim and date on the page before using them.

## Verdict table

| # | Candidate | Verdict | Department | Adoption | Verified sources |
|---|---|---|---|---|---|
| 1 | AI rate parity monitoring | **Add (provisional)**, new row or folded into "Competitor rate shopping" | Revenue Management | Low | 0 (5 leads) |
| 2 | Abandoned direct-booking recovery | **Add as extension** of "Booking-engine AI assistant & personalisation" | Reservations & Distribution | Low | 1 (no AI claim) |
| 3 | Channel content accuracy monitoring | **Add as extension** of "SEO / AI-search (GEO) visibility" | Sales & Marketing | Very low | 2 (vendor + CIO quote) |
| 4 | Sister-property recommendation when sold out | **Drop** | – | – | 0 |
| 5 | Group displacement and meeting-space optimisation | **Add as extension** of "Revenue, budget & total-revenue forecasting (incl. function space)" | Revenue Management | Low | 3 (vendor offers) |
| 6 | Hotels building internal tools with AI coding assistants | **Gaps section** (no hotel example found) | General Management | – | 0 |
| 7 | Guest data clean-up / profile de-duplication | **Add as extension** of "Guest personalisation from unified guest profile" (or new row) | Guest Experience (or Sales & Marketing) | Low | 1 (context only) |
| 8 | AI staff performance evaluation and coaching | **Gaps section** | Human Resources | – | 0 |
| 9 | Vision AI queue / crowd monitoring | **Drop as a row**; one line under "Physical security video analytics" once a lead is opened | IT & Security | Very low | 0 |
| E1 | Deposit / payment-guarantee chasing | **Drop** (rules-based automation, not AI) | – | – | 0 |
| E2 | GPS / geofenced attendance | **Add as extension** of "Biometric staff time clocks" as the non-AI, lower-risk alternative | Human Resources | – | 2 (vendor) |
| E3 | Measured portfolio water and energy savings | **Hold**: no AI-attributed, verified result opened | Maintenance & Engineering | – | 0 |
| E4 | Asset register from photos | **Add as extension** of "Work-order triage, creation and asset register" (provisional) | Maintenance & Engineering | Very low | 0 for the feature (1 for the vendor) |
| E5 | Lost demand / regrets and conversion analytics | **Drop** for now | – | – | 1 (no AI or regrets claim) |
| E6 | Automated post-stay review requests | **Add as extension** of "Review analysis and sentiment" | Guest Experience | Medium (requests), Low (AI part) | 2 (trade press) |

---

## 1. AI rate parity monitoring

**What it is:** a tool checks the hotel's direct rate against OTA and wholesale rates for the same stay, flags any channel that undercuts it, and sometimes matches the lower price on the hotel's own website. The "AI" part is detecting and grouping undercuts (for example, finding wholesale rates leaking to OTAs). Shopping and comparing prices is mostly rules-based.

**Overlap:** close to "Competitor rate shopping & market intelligence with ML" (Revenue Management, Medium). The difference is that parity monitoring checks the hotel's own rate across channels, while rate shopping compares against competitors.

| id | URL | Loaded | Date | Claim (as summarised in search, NOT verified) | Type |
|---|---|---|---|---|---|
| 1-a | https://www.hospitalitynet.org/news/4133147/lighthouse-and-bowerbird-technologies-give-hotels-the-first-end-to-end-solution-to-rate-parity | no (Cloudflare) | 2026 (exact date not seen) | Lighthouse combines "AI-powered" parity monitoring across "hundreds of distribution channels" with Bowerbird copyright enforcement. A **Radisson Hotel Group pilot** reportedly gave "25% parity loss reduction and 20% improvement in parity meet rates". | Vendor press release; the hotel-group figure is self-reported |
| 1-b | https://cendyn.com/rate-match | no (host blocked) | – | Rate Match "automatically shops your hotel's stay dates in real time, mimicking your guests' searches and locations", revealing OTA parity violations. | Vendor offer |
| 1-c | https://hoteltechreport.com/news/hotelchamp-launches-free-trials-for-ratebeat | no (Cloudflare) | – | Hotelchamp (NL) RateBeat scans OTA prices in real time and generates a matching offer when an OTA undercuts. | Vendor news |
| 1-d | https://www.paratytech.com/en/news/the-best-online-price-isnt-given-away-its-protected.html | no | – | Paraty Tech (ES) Parity Maker acts automatically on disparities based on the hotel's own rules. Rate Check hides the OTA price when the OTA undercuts and alerts the revenue team. | Vendor offer |
| 1-e | https://rategain.com/blog/ai‑powered-rate‑parity-monitoring/ | no | – | RateGain blog on AI parity monitoring. | Vendor blog |

- **Vendors:** Lighthouse (formerly OTA Insight), Cendyn Rate Match, Triptease Parity, Hotelchamp RateBeat, Paraty Tech, RateGain.
- **Hotel groups:** Radisson Hotel Group (pilot, lead only).
- **Adoption: Low.** Parity monitoring itself is common, but no survey was opened. The AI-specific detection is new (2026 launches). Raise to Medium only if a survey is found.
- **AI Act:** minimal risk (pricing and channel data, no decisions about people). Main legal context is competition law: wide parity clauses are banned for Booking.com under the EU Digital Markets Act and in several countries (our reading; check with D7).
- **Before adding:** open 1-a. The Radisson pilot is the only hotel-group evidence.

## 2. Abandoned direct-booking recovery

**What it is:** when a guest leaves the hotel's booking engine before paying, the hotel follows up by email or SMS. Most tools run on fixed rules (send after X hours). AI is used, if at all, for personalising the content and choosing when to send.

| id | URL | Loaded | Date | What the page says | Type |
|---|---|---|---|---|---|
| 2-a | https://hotelsmag.com/news/4-trends-hotel-revenue-managers-need-to-pay-attention-to-in-2024/ | **yes** | 15 Mar 2024 | "Hotels can quickly improve their online conversion by implementing email cart abandonment functions that automatically follow-up with prospective guests and offer them assistance with making the booking." The page does not call this AI. | Trade press (guest contributor) |
| 2-b | https://www.hospitalitynet.org/casestudy/4120592/how-ovolo-hotels-realized-52x-roi-with-revinate-shopping-cart-abandonment-within-2-months | no (Cloudflare) | – | Lead: Ovolo Hotels (Hong Kong/Australia, not Europe) turned 600 abandoned-cart leads into 92 reservations, with "52x ROI" in 2 months. | Vendor case study |
| 2-c | https://www.hotelchamp.com/blog/case-study-eden-hotels-converting-leaving-booking-engine-guests | no | – | Lead: Eden Hotels, The Manor Amsterdam, captured guests leaving the booking engine. No outcome figure in the search excerpt. | Vendor case study (European hotel) |
| 2-d | https://www.cartstack.com/rezrecover | no | – | Lead: RezRecover follows up abandoned bookings by email, SMS and push, with booking-engine data injected into the reminders. | Vendor offer |

- **Vendors:** Revinate, CartStack RezRecover, Hotelchamp, Triptease, Mirai, D-EDGE.
- **Hotel groups:** Ovolo (outside Europe, lead); Eden Hotels Amsterdam (lead).
- **Adoption: Low.** The only verified source does not describe it as AI.
- **AI Act:** minimal. **GDPR/ePrivacy matters more:** capturing an email address before the booking is complete and then sending marketing needs a lawful basis or consent. Flag for D7.
- **Why an extension:** the AI part is thin. As a separate row it would overstate AI.

## 3. Channel content management and accuracy monitoring

**What it is:** checking that the hotel's descriptions, photos, amenities and facts are the same and correct on OTAs, metasearch and, more and more, in AI assistants.

| id | URL | Loaded | Date | What the page says | Type |
|---|---|---|---|---|---|
| 3-a | https://hotelsmag.com/news/ai-powered-agentic-hospitality-launches-to-help-hotels-drive-visibility-and-direct-bookings/ | **yes** | 20 Aug 2025 | Launch of Agentic Hospitality. Its "Schema Adapter: Converts hotel content and availability, rates and inventory (ARI) into structured, Schema.org machine-readable data for all distribution channels, ensuring discoverability and competitiveness across Google, OTAs, and emerging AI-native surfaces." Built on Google Vertex AI / Gemini Pro. | Vendor launch (vendor claims) |
| 3-b | https://hotelsmag.com/news/how-ai-is-rewriting-hotel-distribution-one-booking-at-a-time/ | **yes** | 29 Sep 2026 | Michael Leidinger (SVP and CIO, Hilton) at Destination AI Summit 2026: Hilton is "focusing heavily on the content it controls", making "property descriptions, imagery and other information easily accessible to the large language models". "You're feeding the LLMs, the crawlers." | Hotel group (US), trade press |
| 3-c | https://uno.rategain.com/?p=1064 | no | – | Lead: RateGain UNO "scores your hotel" and benchmarks media, amenities and descriptions against competitors on OTAs. | Vendor offer |
| 3-d | https://oer.lib.polyu.edu.hk/concern/works/tx31qj14d | no | – | Lead: PolyU teaching case on HotelPORT PropertyVIEW, which checks listings across platforms with AI/ML and gives content accuracy scores. | Teaching case (vendor material) |

- **Vendors:** RateGain (UNO), HotelPORT PropertyVIEW, Agentic Hospitality (all from the leads above; none verified as deployed in Europe).
- **Hotel groups:** Hilton (strategy statement, not a monitoring tool).
- **Adoption: Very low** (no survey; vendor offers only).
- **AI Act:** minimal. Art. 50 transparency applies only if AI-generated images are published as real photos (deep-fake rule covers images "that would falsely appear to a person to be authentic"; our reading). Consumer law (UCPD) applies to misleading listings either way.
- **Why an extension:** the existing GEO/AI-search row already covers "how AI and channels see your hotel". A separate row would repeat it.

## 4. Sister-property / alternative hotel when sold out

- **No source found** showing a chain CRS or booking engine using AI to recommend a sister hotel when one is sold out. Search results only covered brand AI planners (the Hilton AI Planner steers guests towards Hilton hotels; lead: https://www.hospitality.today/article/hilton-built-an-ai-concierge-to-keep-guests-it-admits-are-already-leaving, not opened).
- **Loaded:** https://hotelsmag.com/news/4-trends-hotel-revenue-managers-need-to-pay-attention-to-in-2024/ (15 Mar 2024) says bookings are lost when the website "didn't offer alternative dates if the requested dates in a search were unavailable". This is about alternative **dates**, not alternative properties, and it is not AI.
- Multi-property booking engines usually do this with fixed rules (same city, same brand).
- **Verdict: drop.** It could be raised at the Accor interview (19 Nov), but no questions are added to the guide.

## 5. Group displacement analysis and meeting-space allocation

**What it is:** the RMS weighs a group request (rooms, meeting space, F&B) against the transient business it would push out on the same dates, and prices or allocates function space by expected total profit.

**Overlap:** the existing row "Revenue, budget & total-revenue forecasting (incl. function space, beyond rooms)" covers the forecasting side. "Group/MICE enquiry intake & RFP" covers intake.

| id | URL | Loaded | Date | What the page says | Type |
|---|---|---|---|---|---|
| 5-a | https://hotelsmag.com/news/ideas-presents-new-commercial-strategy-solutions-as-hotels-expand-beyond-traditional-revenue-management/ | **yes** | 16 Jun 2026 | IDeaS at HITEC 2026: "Group and event space strategies with Function Space, helping hotels maximize the value of high-demand function and event inventory." | Vendor offer (trade press) |
| 5-b | https://hotelsmag.com/news/on-rate-hotels-magazines-top-5-revenue-management-companies/ | **yes** | 8 Nov 2024 | Duetto "created OpenSpace and pricing for Functions Space". CEO quote: "pricing transient, group and function space … within a single system significantly impacts total profitability." | Vendor offer (trade press) |
| 5-c | https://hotelsmag.com/news/amadeus-adds-ai-booking-and-workflow-tools-to-hospitality-portfolio/ | **yes** | 16 Jun 2026 | "Within Amadeus Delphi and Amadeus MeetingBroker, Amadeus Max will automate sales workflows and assess group and event RFPs." Note "will": announced, not live. | Vendor announcement |
| 5-d | https://hoteltechreport.com/news/roompricegenie-rms-announces-a-new-group-displacement-calculator | no (Cloudflare) | – | Lead: RoomPriceGenie group displacement calculator (aimed at independents). | Vendor news |
| 5-e | https://www.hospitalitynet.org/explainer/4134223/how-to-conduct-an-effective-hotel-displacement-analysis | no (Cloudflare) | – | Lead: explainer on displacement analysis. | Trade explainer |

- **Vendors:** IDeaS (Function Space, G3 group pricing), Duetto (OpenSpace / function space), Amadeus (Delphi, MeetingBroker, Max), RoomPriceGenie, Lighthouse.
- **Hotel groups:** none named on opened pages.
- **Adoption: Low.** Mostly vendor offers. Function-space RM is mainly used by large convention and full-service hotels.
- **AI Act:** minimal.
- **Why an extension:** it fits the function-space row already in Revenue Management. Rename that row "… incl. function space and group displacement" and add 5-a, 5-b and 5-c.

## 6. Hotels building their own tools with AI coding assistants

- **No verified hotel or hotel-group example** of staff building internal tools with Claude Code, Codex, Cursor or similar.
- Leads (not opened):
  - Skift, 20 Apr 2026, https://skift.com/2026/04/20/hyatt-chatgpt-enterprise-roll-out/: Hyatt rolls out ChatGPT Enterprise; the search summary says employees get access to tools "including GPT-5.4 and Codex". This shows **access**, not tools actually built. US-based group.
  - Hospitality Net, https://www.hospitalitynet.org/news/4132983 ("Your Training Manager Just Became a Developer"): content unknown. Open it first; it is the most promising lead.
  - PhocusWire opinion, https://www.phocuswire.com/opinion/technology/why-hoteliers-should-not-vibe-code-own-software: argues against it (owners become responsible for the system "indefinitely"). Useful for the gaps text.
  - Not hotels: loveholidays (OTA, Codex); Virgin Voyages (cruise, Superblocks); Travelers (insurance, Claude, https://claude.com/customers/travelers).
- **Verdict: gaps section** ("hotels do not yet show public examples of building their own tools with AI coding assistants; the obstacles are maintenance, security and GDPR responsibility"). Move it to a row only if 4132983 or the Hyatt piece shows a real internal build.
- **AI Act:** depends on what is built. The hotel becomes the **provider** of any AI system it builds and puts into service (Art. 3(3)), not only a deployer. This is the main governance point for D7.

## 7. Guest data clean-up / profile de-duplication

**What it is:** a CDP or CRM uses ML to match and merge duplicate guest records across PMS, booking engine, POS and OTAs (for example masked OTA emails, name typos) into one "golden profile".

| id | URL | Loaded | Date | What the page says | Type |
|---|---|---|---|---|---|
| 7-a | https://hotelsmag.com/news/ai-wont-fix-bad-data-hoteliers-say-the-foundation-comes-first-webinar/ | **yes** | 27 Jul 2026 | Roundtable. Nick Clark (SVP operations, Remington Hospitality, US): "We've got more [data] now than we've ever had." Conclusion: AI "will require clean, connected data, integrated technology systems, clear accountability". No product named, no de-duplication claim. | Trade press (context only) |
| 7-b | https://www.revinate.com/blog/identity-resolution/ | no | – | Lead: identity resolution "powered by machine learning … identifies and merges duplicate guest profiles, even when data varies across systems"; masked OTA emails named as a main cause of duplicates. | Vendor |
| 7-c | https://hoteltechreport.com/news/advanced-profile-synthesis | no (Cloudflare) | – | Lead: Revinate Advanced Profile Synthesis works in three steps: standardisation, clustering and learning. | Vendor news |
| 7-d | https://support.cdp.trustyou.com/hc/en-us/articles/31321323726493 | no | – | Lead: TrustYou CDP de-duplication engine builds a "golden profile" and uses only channels with verified consent. | Vendor help page |

- **Vendors:** Revinate, TrustYou CDP, Cendyn, Shiji (Customer Data Platform), Amperity (cross-industry), Mews (not checked).
- **Hotel groups:** none verified.
- **Adoption: Low.**
- **AI Act:** minimal. **GDPR is central:** the accuracy principle (Art. 5(1)(d)) supports clean-up, but merging records builds richer profiles, so check purpose limitation and transparency. A wrong merge can expose one guest's data to another (data breach risk).
- **Why an extension:** it is the step that makes "Guest personalisation from unified guest profile" possible. If the team wants a back-office row, put it in Sales & Marketing as "Guest data clean-up and identity resolution".

## 8. AI staff performance evaluation and coaching (beyond call scoring)

- **No real hotel deployment found.** Leads:
  - HSMAI Foundation report (https://www.hospitalitynet.org/news/4128652.html, not opened): the case behind the coaching figures ("83% of managers said ZRA improved their ability to coach") is **Expedia Group's sales team**, not a hotel.
  - Earlier check (18 Nov, M6-b, verified): Unifocus housekeeping productivity data feeds "Employee performance reviews", but the page does not call it AI.
- Opened: none relevant. The HOTELS magazine search found only patents and academic papers.
- **Verdict: gaps section.** Suggested wording: "Tools that score staff or coach them (beyond call scoring) are sold but have no public hotel deployment; productivity data already flows into performance reviews without AI."
- **AI Act:** **high-risk** under Annex III point 4(b) if AI is used "to monitor and evaluate the performance and behaviour" of workers or to decide on promotion, termination or task allocation. Emotion recognition at work is **prohibited** (Art. 5(1)(f)). Works-council consultation applies in DE/AT/NL/FR (our reading).

## 9. Vision AI queue / crowd monitoring (MAYBE)

- **No named hotel deployment found.** Leads (not opened):
  - Superb AI, https://superb-ai.com/en/resources/blog/ai-crowd-analysis-in-hotels: two-week proof of concept at an **unnamed luxury hotel** using existing CCTV. Vendor claims 25% shorter waits at the breakfast restaurant and pool and 18% higher breakfast use.
  - V-Count, https://v-count.com/hotels: front-desk queue length and wait-time alerts.
  - Vaidio, https://www.vaidio.ai/solutions/hotels: occupancy and queue management on existing IP cameras.
- **Verdict: drop as a row.** If the Superb AI page is opened and confirmed, add one line under "Physical security video analytics" (Very low): "vendor proof of concept, hotel not named".
- **AI Act:** minimal if it only counts people anonymously. GDPR still applies to CCTV processing. It would become prohibited or high-risk only with biometric identification (our reading).

---

## Extensions to existing rows

### E1. Deposit / payment-guarantee chasing → **drop (not AI)**
- Leads only (not opened): Stayntouch "Payment Link For Deposit Requests" [in pilot] (https://stayntouch.freshdesk.com/support/solutions/articles/24000102331--in-pilot-payment-link-for-deposit-requests); Exely auto-cancels unpaid bookings after a due date (https://exely.com/help/281589); Canary payment links (https://www.canarytechnologies.com/website/payment-links).
- All describe **scheduled, rules-based** payment links and reminders. No AI claim was seen. Mention it only as non-AI automation, if at all, so the AI count is not inflated.

### E2. GPS / geofenced attendance → **add as extension of "Biometric staff time clocks" (labelled not AI)**
| id | URL | Loaded | Date | What the page says | Type |
|---|---|---|---|---|---|
| E2-a | https://www.unifocus.com/en/time-attendance-software | **yes** | no date shown | "Our platform supports multiple time capture methods, including geofenced mobile clock-ins, biometric readers, and shared kiosks — all designed for hotel environments." Key differentiator: "Mobile clock-ins with GPS/geofencing". | Vendor offer |
| E2-b | https://www.unifocus.com/en/time-attendance-software/attendance-tracking | **yes** | no date shown | "Mobile Clock-In: GPS-enabled clock-ins with optional geofencing … Configure geofenced locations to limit punch radius"; example: "Housekeepers use mobile clock-in from service hallways". | Vendor offer |
- Other vendors (leads): Connecteam, Deputy, 7shifts (7punches), Planday (not checked for geofencing).
- **Not AI.** It is still worth one line because it is the lower-risk alternative to biometric clocks. Biometric data is special-category data under GDPR Art. 9; location tracking of staff still needs a legal basis and limits (our reading). AI Act: not an AI system.

### E3. Portfolio water + energy savings with measured results → **hold**
- No opened source gives a **verified** saving that is attributed to **AI** across a portfolio.
- Leads:
  - Hilton LightStay: "$1.38 billion in verified utility savings since 2008" across 5,700+ properties, verified by KEMA/DEKRA (per vendor ei3, https://ei3.com/?p=41939, not opened). LightStay is a measurement system, so the saving is not shown to come from AI.
  - Hilton 10-K FY2019 (https://www.sec.gov/Archives/edgar/data/1585689/000158568920000013/hlt-20191231.htm, sec.gov blocked): 22% water and 26% energy reduction per m², per the search summary. Not AI.
  - HITEK case study on Kempinski (https://www.hitek.ai/case-studies/kempinski-hotels/, not opened).
- Keep the existing HVAC/BMS row as it is. Add only if Hilton's Travel with Purpose report or the Kempinski case is opened and the AI part is clear.

### E4. Asset register from photos → **add as extension of "Work-order triage, creation and asset register" (provisional)**
- Leads (not opened): Actabl "AI Asset Setup" for hotel engineering teams. Engineers photograph equipment and its labels, and AI fills in the asset profile (https://lodgingmagazine.com/actabl-debuts-ai-asset-setup-to-support-hotel-engineering-teams/; https://www.hotelmanagement.net/tech/actabl-launches-ai-based-asset-data-collection-platform). Cross-industry: AkitaBox Capture (OCR of nameplates, https://home.akitabox.com/software/ai/); JLL (https://www.jll.com/en-sea/guides/quality-data-is-key-for-maximising-asset-performance).
- Loaded (vendor context only): https://hotelsmag.com/news/harnessing-data-is-the-easy-part-unlocking-it-is-the-key-here-are-5-companies-opening-the-data-door/ (24 Apr 2026). Actabl's "four products … labor optimization, business intelligence, operations management, asset and CapEx management"; "Actabl is using AI to help operators get to insights faster". This page does **not** mention photo-based asset setup.
- Adoption: Very low. AI Act: minimal. The launch date still needs to be confirmed from Lodging or Hotel Management.

### E5. Lost demand / regrets and booking-conversion analytics → **drop for now**
- Loaded: https://hotelsmag.com/news/losing-bookings-with-strategic-digital-insights-not-everything-is-lost/ (27 May 2025, guest contributor). Advises using booking-engine analytics "to identify where users abandon the booking process". It does not mention AI, regrets or denials.
- Leads: a Hospitality Net piece on regrets and denials in forecasting (https://www.hospitalitynet.org/external/750651806.html, Cloudflare). Unconstrained-demand estimation inside an RMS is already part of "Demand forecasting" (High).
- No separate AI use found. If anything, add one line to the demand-forecasting row: "RMS estimate unconstrained demand, including denials".

### E6. Automated post-stay review requests → **add as extension of "Review analysis and sentiment"**
| id | URL | Loaded | Date | What the page says | Type |
|---|---|---|---|---|---|
| E6-a | https://hotelsmag.com/news/how-ai-is-automating-the-entire-hotel-guest-journey/ | **yes** | 18 Jan 2024 | "After guests have departed, virtual assistants continue the communication thread by sending follow-up messages, requesting feedback and offering incentives for future stays. They can also prompt guests to leave online reviews." | Trade press (general, no hotel named) |
| E6-b | https://hotelsmag.com/news/guests-are-increasingly-asking-ai-where-to-stay-will-it-recommend-your-hotel/ | **yes** | 20 Aug 2026 | Advice: "proactively ask guests directly to review your hotel, particularly guests who seem impressed by a specific amenity or service", because reviews naming specifics help hotels "show up when travelers ask about those exact things" in AI answers. | Trade press (advice) |
| E6-c | https://hoteltechreport.com/nl/success-stories/marketing/guestrevu/the-cottage-hotel-hope-cove | no (Cloudflare) | – | Lead: The Cottage Hotel, Hope Cove (UK). A GuestRevu review link in post-stay emails gave "63% increase in online reviews" (GM-reported, verified by HTR per the search summary). | Hotel (Europe), vendor-platform story |
| E6-d | https://www.customer-alliance.com/en/?p=60885 | no | – | Lead: My Arbor, South Tyrol (IT), Customer Alliance + Re:Guest. "55% rise in Google reviews"; "70% of 2025 Tripadvisor reviews" came from the automated post-stay flow. | Vendor case study (Europe) |
- **Vendors:** GuestRevu, Customer Alliance, TrustYou, Shiji ReviewPro, Revinate, Re:Guest.
- **Adoption: Medium** for automated review requests (standard feature of reputation tools; no survey opened). **Low** for the AI part (AI-chosen timing or wording).
- **AI Act:** minimal. **Consumer-law flag:** sending review requests only to happy guests ("review gating") goes against Google's policy and may count as misleading under the UCPD, as amended by the Omnibus Directive on consumer reviews (our reading; check with D7).

---

## Still to verify before anything goes into the catalogue
1. Open 1-a (Lighthouse/Radisson parity pilot): decides whether #1 becomes a row.
2. Open Hospitality Net 4132983 and the Skift Hyatt piece: decides whether #6 stays in gaps.
3. Open E6-c and E6-d: European hotel results for review requests.
4. Open 7-b/7-c (Revinate) and the Actabl launch (E4): vendor confirmation and launch date.
5. Open the Superb AI page (#9) and the Hilton/Kempinski energy sources (E3).
Opening these needs the hosts listed at the top allowed in the environment, or a browser.
