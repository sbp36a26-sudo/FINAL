# Independent source audit – use_case_sources (sources_v2)

Audit date: 25 Nov 2026. Scope: all 192 rows in `use_case_sources.xlsx` (Sources sheet) and `use_case_sources.json`. The JSON matched the spreadsheet row for row (use case, URL, quote, score, fit). The previous checker's notes were not used. Every row was re-checked from its primary record.

## Result

| Verdict | Rows |
|---|---|
| Correct | 156 |
| Minor fix | 34 |
| Wrong | 2 |
| Unverified | 0 |

- **Existence:** all 192 resolve. That covers all 57 DOIs (doi.org 302), the 14 Eurostat API queries (200), 4 PDFs (200) and 8 web pages (200; WNW and HPE checked via WebFetch).
- **Quotes:** none was invented. Every quote was found in the stated source and, for PDFs, on the stated page. 5 quotes needed small fixes: 4 with a stray space from a PDF line break and 1 cut off mid-sentence. 1 quote was a page title and has been replaced with body text.
- **Figures:** all figures match the source. That includes all 80 Eurostat values, re-queried live, and the HES-SO chart values on p.42 and p.55, read from the page images. 4 sample-base descriptions were imprecise.
- **Metadata:** no invented or misattributed authors, and no retracted papers. 7 rows gave the online-first year instead of the issue year. 11 more rows had a wrong or shortened title (WNW ×4, Flywire), a missing hyphen in a surname (Talón-Ballestero), a mis-styled journal name (×2), or wrongly listed Britz as HES-SO staff (×3). 2 undated web pages (Stayflexi, Legora) had been given the year 2026 and are now marked n.d.
- **Peer-review labels:** correct throughout. HES-SO reports, the OECD paper and the vendor and industry items are not labelled peer-reviewed. All 64 journal items are Crossref journal articles. No theses or working papers were used.
- **Use-case fit:** 2 Eurostat indicators were attached to the wrong use case. 10 rows were marked "direct" but are only partial.
- **Legal rule:** 1 row is flagged: the Legora / Accor page about a legal team (lg-3). No paywall was bypassed.

**Effect on coverage (corrected JSON):** use cases with a credible (7+) *direct* source drop from 34 to **29**. fb-5, kc-1, kc-5, lg-4 and rm-7 lose their only direct 7+ source. 97 of the 98 use cases still have at least one 7+ source, and hr-5 still has none.

## Wrong (2)

- **#61 fo-7 – AI avatar or hologram receptionist (check-in kiosk)** · Eurostat (European Commission) (2025). Eurostat isoc_eb_ain2 – E_AI_TAR
  - Indicator E_AI_TAR ("physical movement of machines… autonomous robots, self-driving vehicles, drones", 0.93%) does not describe an on-screen avatar/hologram. Replace with E_AI_TNLG ("Enterprises using AI technologies generating written or spoken language or programming codes (natural language generation, speech synthesis)", 6.43%) – closest category (speech synthesis), fit partial.
- **#178 it-2 – AI help desk for IT problems** · Eurostat (European Commission) (2025). Eurostat isoc_eb_ain2 – E_AI_PITS
  - Indicator E_AI_PITS ("AI for ICT security", 2.8%) does not describe an IT help desk. Replace with E_AI_TNLG (6.43%) as the closest category (AI answering in written language), fit partial – or drop the Eurostat line for it-2.

## Minor fixes (34)

- **#3 rm-1** (Demand forecasting for rooms (by day, guest type and room ty) · Roland Schegg, HES-SO Valais-Wallis (2025). Artificial Intelligence in European Hotels: Adoption, Applications
  - Base → "DACH sub-sample (AT, DE, CH) of AI-using hotels, 2023 vs 2025 surveys" (the 37%→44% figure is DACH only, not the 6-country sample).
- **#5 rm-2** (Dynamic room pricing, including automatic rate publishing) · Pilar Talón Ballestero et al. – International Journal of Hospitality Management (2022). The wheel of dynamic p
  - Author: "Pilar Talón Ballestero" → "Pilar Talón-Ballestero" (hyphenated surname per Crossref).
- **#8 rm-3** (Competitor rate tracking and market insight with machine lea) · Roland Schegg, HES-SO Valais-Wallis (2025). Artificial Intelligence in European Hotels: Adoption, Applications
  - Quote: "AI- assisted" → "AI-assisted" (PDF line-break artefact; the source word is hyphenated, no space).
- **#14 rm-6** (Total revenue and budget forecasting, including function spa) · Hagen Britz & Roland Schegg (HES-SO Valais-Wallis) (2025). From Awareness to Action: AI Readiness in Hotels
  - Base: survey ran Jul–Sep 2025 (p.10); report Oct 2025. Use the corrected base. Author/org: Britz is independent, not HES-SO.
- **#15 rm-7** (Price optimisation for upsells and extras) · Basak Denizci Guillet – International Journal of Hospitality Management (2019). Online upselling: Moving beyon
  - Year 2019 → 2020 (Crossref issued/print date: IJHM vol. 84, Jan 2020; 2019 is only the online-first year from OpenAlex). Also Fit direct → partial: abstract is about online upsell/bidding programmes, not price optimisation.
- **#18 rm-7** (Price optimisation for upsells and extras) · Yao Cui et al. – Management Science (2017). Pricing of Conditional Upgrades in the Presence of Strategic Consu
  - Year 2017 → 2018 (Crossref issued/print date: Management Science vol. 64, Jul 2018; 2017 is only the online-first year from OpenAlex).
- **#34 sm-1** (AI-written marketing text and translation) · Yaozhi Zhang & Nina Katrine Prebensen – Annals of Tourism Research Empirical Insights (2024). Co-creating with
  - Fit direct → partial: two online experiments on destination marketing materials, not hotel marketing.
- **#48 fo-1** (Digital check-in with ID document scan (online, mobile or ki) · Chun Liu et al. – Journal of Hospitality Marketing & Management (2019). Determinants of self-service technolog
  - Fit direct → partial: study is about self-service technology in Chinese hotels in general (focus groups, 30 practitioners); no ID-document scanning.
- **#59 fo-5** (Upselling at check-in (desk, kiosk, before arrival)) · Basak Denizci Guillet – International Journal of Hospitality Management (2019). Online upselling: Moving beyon
  - Year 2019 → 2020 (Crossref issued/print date: IJHM vol. 84, Jan 2020; 2019 is only the online-first year from OpenAlex).
- **#77 gx-5** (Digital concierge and recommendations during the stay) · Stephanie Qing Liu et al. – Journal of service management (2024). AI concierge in the customer journey: what i
  - Journal name capitalisation: "Journal of service management" → "Journal of Service Management".
- **#78 gx-6** (In-room voice assistant) · Daniel Ruiz‐Equihua et al. – Psychology and Marketing (2023). Smart speakers and customer experience in servic
  - Journal name: "Psychology and Marketing" → "Psychology & Marketing".
- **#79 gx-6** (In-room voice assistant) · Roland Schegg, HES-SO Valais-Wallis (2025). Artificial Intelligence in European Hotels: Adoption, Applications
  - Fit direct → partial: the survey item is "Virtual assistant (e.g. Apple Siri, Amazon Alexa)" in general (text mentions Siri for guest communication), not in-room voice assistants.
- **#87 fb-5** (Robots that deliver and serve (amenities, room service, rest) · Roland Schegg, HES-SO Valais-Wallis (2025). Artificial Intelligence in European Hotels: Adoption, Applications
  - Fit direct → partial: the 3% item is "Automation of the hotel or hotel room (e.g. Andivi) and robotics (e.g. robot Pepper)" – mixes room automation with robots, not delivery/serving robots.
- **#103 me-2** (Sorting and creating repair requests, and the equipment regi) · WNW Hospitality Management (hotel operator) (2026). WNW Partners With HotelPilot to Put AI to Work
  - Title → "WNW Partners With HotelPilot: Putting AI to Work Behind the Scenes So Our People Can Focus on Guests" (sheet title is not the real title). Author → Jonathan Reiss, CEO, WNW Hospitality Management; dated 10 Nov 2026.
- **#110 kc-1** (Measuring food waste with cameras (computer vision)) · OECD (2024). Artificial Intelligence and tourism: G7/OECD policy paper (OECD Tourism Papers 2024/02)
  - Quote is cut mid-sentence; use the full sentence: "Hilton Hotels and Iberostar both use AI to track food production and categorise waste in hotels." Fit direct → partial: OECD does not say cameras/computer vision.
- **#111 kc-1** (Measuring food waste with cameras (computer vision)) · Roland Schegg, HES-SO Valais-Wallis (2025). Artificial Intelligence in European Hotels: Adoption, Applications
  - Fit direct → partial: the 8% item is "Collection and analysis of waste (waste management)" – not camera-based measurement.
- **#116 kc-4** (Forecasting kitchen production, guest numbers (covers) and b) · Konstantin Posch et al. – International Journal of Forecasting (2021). A Bayesian approach for predicting food
  - Year 2021 → 2022 (Crossref issued/print date: Int. J. Forecasting vol. 38, Jan 2022; 2021 is only the online-first year from OpenAlex).
- **#118 kc-5** (Recipe and menu creation with generative AI) · Roland Schegg, HES-SO Valais-Wallis (2025). Artificial Intelligence in European Hotels: Adoption, Applications
  - Fit direct → partial: the 4% item is "Automatic menu creation and validation (cost of menu modification, streamlining of routine validation process)" – menu costing/validation, not generative recipe creation.
- **#127 pr-2** (Forecasting demand and stock for purchasing) · Konstantin Posch et al. – International Journal of Forecasting (2021). A Bayesian approach for predicting food
  - Year 2021 → 2022 (Crossref issued/print date: Int. J. Forecasting vol. 38, Jan 2022; 2021 is only the online-first year from OpenAlex).
- **#136 fa-1** (Scanning supplier invoices and coding them to the general le) · WNW Hospitality Management (hotel operator) (2026). WNW Partners With HotelPilot to Put AI to Work
  - Title → "WNW Partners With HotelPilot: Putting AI to Work Behind the Scenes So Our People Can Focus on Guests" (sheet title is not the real title). Author → Jonathan Reiss, CEO, WNW Hospitality Management; dated 10 Nov 2026.
- **#139 fa-2** (Spotting fraud and unusual patterns in payments) · Rasha Kassem – International Journal of Hospitality Management (2023). Spotlight on fraud risk in hospitality 
  - Year 2023 → 2024 (Crossref issued/print date: IJHM vol. 116, Jan 2024; 2023 is only the online-first year from OpenAlex).
- **#140 fa-3** (Automatic reconciliation of bank, card, booking-site commiss) · WNW Hospitality Management (hotel operator) (2026). WNW Partners With HotelPilot to Put AI to Work
  - Title → "WNW Partners With HotelPilot: Putting AI to Work Behind the Scenes So Our People Can Focus on Guests" (sheet title is not the real title). Author → Jonathan Reiss, CEO, WNW Hospitality Management; dated 10 Nov 2026.
- **#147 fa-6** (Automating the night audit (end-of-day closing)) · WNW Hospitality Management (hotel operator) (2026). WNW Partners With HotelPilot to Put AI to Work
  - Title → "WNW Partners With HotelPilot: Putting AI to Work Behind the Scenes So Our People Can Focus on Guests"; author Jonathan Reiss (CEO). Fit direct → partial and "Supports" reworded: the quote only says the platform "speaks our language, from night audit to the USALI chart of accounts" – it does not say AI automates the night audit.
- **#150 fa-6** (Automating the night audit (end-of-day closing)) · Stayflexi (vendor) (2026). Night Auditor agent
  - Replace page-title "quote" with body text: "Run nightly audits at 2 AM without staff. The AI agent reconciles POS charges, validates rates, detects discrepancies, and emails reports to your team." Year 2026 → n.d. (no date on page). Location → "page body".
- **#152 fa-7** (Automatic handling of chargeback disputes (guests reversing ) · Ethoca (Mastercard) with Datos Insights (2025). The chargeback window of opportunity (2025 State of Chargeback
  - Location "PDF" → "PDF p.11" (page where the $120 figure appears; same as printed page 11).
- **#153 fa-7** (Automatic handling of chargeback disputes (guests reversing ) · Flywire (vendor-commissioned survey) (2025). New Flywire Research into Hospitality Workflows
  - Score 5 → 6 (your scale: vendor-commissioned survey = 6). Title → full: "New Flywire Research into Hospitality Workflows Provides a Blueprint for Hotel Revenue Growth".
- **#159 hr-3** (Staff induction and training (AI-made courses, AI coaching, ) · Roland Schegg, HES-SO Valais-Wallis (2025). Artificial Intelligence in European Hotels: Adoption, Applications
  - Quote: "AI- assisted" → "AI-assisted" (PDF line-break artefact; the source word is hyphenated, no space).
- **#167 gm-2** (Generative AI assistants for managers and head-office staff) · Hagen Britz & Roland Schegg (HES-SO Valais-Wallis) (2025). From Awareness to Action: AI Readiness in Hotels
  - Quote: "back- office" → "back-office" (line-break artefact). Base → fieldwork Jul–Sep 2025 (report Oct 2025), invited 408 + ~80 hotels, n not stated.
- **#181 it-4** (AI analysis of security camera video) · Roland Schegg, HES-SO Valais-Wallis (2025). Artificial Intelligence in European Hotels: Adoption, Applications
  - Quote: "AI- assisted" → "AI-assisted" (PDF line-break artefact; the source word is hyphenated, no space).
- **#182 it-5** (AI network management for guest and staff Wi-Fi) · HPE (vendor release) (2026). Aethos London Shoreditch redefines luxury hospitality with HPE self-driving netwo
  - Score 4 → 5 (your scale: press release = 5). Quote/figure correct; "90%" is a vendor claim without method.
- **#183 it-5** (AI network management for guest and staff Wi-Fi) · Eurostat (European Commission) (2025). Eurostat isoc_eb_ain2 – E_AI_PITS
  - "Supports" should say this is AI for ICT security only (the closest Eurostat purpose); Eurostat has no network-management indicator.
- **#184 it-5** (AI network management for guest and staff Wi-Fi) · Juan Pedro Mellinas & Juan Luis Nicolau – Annals of Tourism Research (2019). Let's hook up fast! Hotel reviews
  - Year 2019 → 2020 (Crossref issued/print date: Annals of Tourism Research vol. 80, Jan 2020; 2019 is only the online-first year from OpenAlex).
- **#187 lg-3** (Generative AI for reviewing contracts) · Legora (vendor) (2026). Accor customer story
  - Year 2026 → n.d. (page undated; says "joined legora, Dec 2025"). RULE 7 FLAG: page is about Accor's legal team (General Counsel, lawyers) – legal-adjacent; decide whether lg-3 keeps it under the no-legal rule.
- **#189 lg-4** (Rules and oversight for using AI) · Hagen Britz & Roland Schegg (HES-SO Valais-Wallis) (2025). From Awareness to Action: AI Readiness in Hotels
  - Base: survey ran Jul–Sep 2025. Fit direct → partial: "strategically integrated AI into long-term planning" is about strategy, not rules/oversight. Author/org: Britz is independent.

## Systemic issues

1. **Year convention.** The earlier build took OpenAlex's year, which is often the online-first year. For Elsevier and INFORMS papers this differs from the issue year (7 rows). The fix uses the Crossref issued/print year.
2. **"Direct" fit was overused for HES-SO survey items.** Several broad questionnaire items were treated as direct evidence for a narrower use case. Examples are "Collection and analysis of waste" used for camera food-waste measurement, "Automatic menu creation and validation" for GenAI recipes, "Automation of hotel room … and robotics" for serving robots, and "Virtual assistant (Siri/Alexa)" for in-room voice assistants. Check the exact wording of the questionnaire item (Annex 1, p.85) before calling a HES-SO figure direct.
3. **Eurostat mapping.** 2 indicators did not match their use case: an autonomous-robot indicator for an avatar receptionist, and an ICT-security indicator for an IT help desk. A third (ICT security for Wi-Fi management) is only a weak proxy. All Eurostat lines remain category-level ("partial") by design.
4. **PDF text artefacts.** pdftotext adds a stray space where a hyphenated word breaks across lines ("AI- assisted", "back- office"). Check quotes against the rendered page, not raw text.
5. **Score scale drift.** The workbook's own codebook gives vendor-commissioned surveys 5 and vendor press releases 4. The stated scale gives 6 and 5. 2 rows were corrected (Flywire 5→6, HPE 4→5), and neither crosses the 7+ bar. The split between "leading journal = 8" and "other = 7" is also undefined. For example, Journal of Tourism Futures, Tourism Review and Technology in Society score 8, while British Food Journal and ATR Empirical Insights score 7. A fixed list (e.g. SSCI Q1 or AJG 3+) would make this consistent. No row changes credibility status either way.
6. **Sample bases.** For HES-SO 2025, "AI-adopting hotels" as the base for the technology-use percentages is confirmed by p.5 ("74% of AI adopters"), but the report never prints n. For Britz & Schegg, fieldwork was July to September 2025, not October, and n is not stated. For journal articles, "n in full text" stays unverified because no paywall was bypassed.
7. **Abstract-only evidence.** All 64 peer-reviewed rows were verified against public abstracts (Crossref, OpenAlex or Semantic Scholar). None was read in full text.
8. **Legal-adjacent content.** #187 (Legora / Accor) is about Accor's legal team using AI. It contains no legal requirements, but it sits close to Ludo's no-legal rule, so Ludo should decide whether lg-3 keeps it. No other source is legal or regulatory.

## Files
- `source_audit.xlsx`: Audit sheet (192 rows, checks 1–7, verdict, exact correction), Corrected sources sheet (changed fields listed per row) and Method sheet.
- `use_case_sources_corrected.json`: same structure as `use_case_sources.json`, with all corrections applied. Gap notes are updated for the 5 use cases that lost their direct 7+ source.
- Working files: `audit/` (API responses, PDFs, scripts).