# Claude Code prompt — EU AI Act hospitality governance explorer

Paste everything below the line into Claude Code, from this folder.

---

## Task

Build a single self-contained HTML file, `ai-act-explorer.html`, that explains the EU AI Act to people with no background in it, and keeps my full research one click away for anyone who wants to dig deeper. All content comes from `ai-act-data.json` in this directory. Read that file first and completely before writing any code.

## Context

This is an EHL Student Business Project for HFTP on AI in hospitality. I own the EU AI governance workstream. The tool is used by my team and shown to our coach and to clients. Assume the reader has never heard of the AI Act: the first screen must answer **"What is the EU AI Act, and what does it mean for hotels?"** simply and visually. The depth — articles, amendments, confidence levels, open questions, the audit trail — must stay in the tool, but behind pop-ups and topic pages, never on the first screen.

Questions the overview should help answer (a direction, not a checklist to follow one by one): Does the Act differ by company size? What are the risks and consequences of non-compliance? Where is the official text and guidance? How is it monitored and enforced? What does it mean for hospitality? Which use cases are affected? Which rules are surprising?

The legal basis is Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744 (Digital Omnibus on AI). Facts verified 10 November 2026. Both regulations are in this folder as PDFs, and the data file maps every article to a page in them.

## Inputs

- **`ai-act-data.json`** — the single source of truth, 35 top-level sections. Read `omnibusAmended` and `corrections` carefully: they are correctness machinery, not commentary.
- **`EU AI Act June 2024.pdf`** — Regulation (EU) 2024/1689, Official Journal, 12.7.2024, 145 pages. The base text and the citation-link target for articles the Omnibus did not touch.
- **`Digital Omnibus July 2026.pdf`** — Regulation (EU) 2026/1744, adopted 8 July 2026, OJ 24.7.2026, 41 pages. The amending regulation and the citation-link target for amended provisions.
- **`EU AI Act at a glance.pdf`** — my own one-pager. Read it as *visual precedent only*: dashed outlines mark judgement calls, filled vs outlined dots mark past vs upcoming milestones. Both conventions should survive into this tool.
- **`AI-Act-Compliance-Checker-Flowchart-v1.0_compressed.pdf`** — Future of Life Institute, July 2025. Read it for *wizard structure only*. Its legal content predates the Omnibus and must not be used.

## The two-text problem — read before writing any citation code

Neither PDF alone is the current law. The June 2024 text is the base; the Omnibus amends **36 of its articles**, inserts 6 new ones (4a, 60a, 75a–75d), amends Annexes I and VIII and adds Annex XIV. `ai-act-data.json` carries the merged position.

`omnibusAmended` gives you everything needed to get this right:

- `supersededActArticles` — the 36 article numbers where the June 2024 PDF is no longer accurate.
- `newArticles` — articles that exist only in the Omnibus; they have no June 2024 page.
- `points` — all 43 amendment points, each with its `targets`, `type`, a plain-language `change`, a `material` boolean and an `omnibusPage`.

Citation rules that follow:

1. Article **not** in `supersededActArticles` → link to the June 2024 PDF page from `articles.byNumber[n].page`. No flag.
2. Article **in** `supersededActArticles` → link to the June 2024 page, show a visible **"Δ amended" flag** and a link to the Omnibus PDF page. The flag opens a pop-up (like a glossary definition) carrying the `change` text of every matching `points` entry. Do not print the full amendment notes inline — I found that too cluttered — but never hide the flag itself.
3. Article **in** `newArticles` → link only to the Omnibus PDF page, with a "+ new · Omnibus only" flag that opens the same kind of pop-up. Never link to the June 2024 PDF; the article is not in it.

Art. 50 is in `supersededActArticles` (Omnibus point 20 replaces Art. 50(7)), so it carries the amended flag. Keep it.

The sharpest trap is dates. Art. 113 in the June 2024 PDF still shows the original August 2026 high-risk dates. The current dates are **2 Dec 2027** (Annex III) and **2 Aug 2028** (Annex I). An August 2026 high-risk *application* date appearing anywhere in the UI is a bug.

## Hard constraints

1. **One file.** `ai-act-explorer.html`, no build step, no npm, no bundler. Opens by double-click from a OneDrive folder. Vanilla HTML/CSS/JS only. No external scripts, stylesheets, fonts or images — no CDN links. System font stack.
2. **Embed the data.** Inline the full contents of `ai-act-data.json` as a single `<script type="application/json" id="ai-act-data">` block, verbatim. `fetch()` of a local file fails under `file://`, so do not try. Keep the JSON in one clearly commented block so I can swap it when the final Commission guidelines land, without touching the rest of the file.
3. **Never invent legal content.** Every tier, date, fine, obligation, article reference and scenario must trace to the JSON. Headings and connecting sentences may be your own plain-language framing, but every legal statement must come from the data. If a view needs a fact the JSON does not have, leave a visible `TODO:` rather than filling the gap. Do not reword legal statements into something stronger or more certain than the JSON says. Do not add use cases, article numbers or deadlines from your own knowledge — this body of law changed after most training cutoffs and your priors about it are probably wrong.
4. **Works offline and in one screen width.** Usable at 1280px and legible on a phone. No horizontal scrolling of body text.
5. **The HTML must sit beside both PDFs.** Citation links are relative paths. Do not move or rename either file.

## Structure

Navigation is **overview-first**. A persistent top switch reaches four views: **Overview**, **Topics**, **Hotel scenarios**, **Check a system**. Persistent header buttons open the **Open items** panel, the **What changed and why** panel and the **Glossary**. All views share one article-reference component and one confidence-badge component.

### View 1 — Overview (landing view)

A short visual story, top to bottom, answering "What is the EU AI Act?" for a reader with no background. Be critical: for every element, ask whether a first-time reader needs it to understand the Act. If not, it belongs in a pop-up or a topic page.

**On the overview, show no article references, no amendment flags, no confidence badges and no open-item or draft-guideline markers.** Each block opens a pop-up with the full detail — sources, confidence and open questions included — plus an "Open in Topics" link to the matching topic page.

1. **Header** — what the Act is in one line; four facts: the law (Regulation (EU) 2024/1689), the amendment (Digital Omnibus, Regulation (EU) 2026/1744), in force since, who it covers (builders and buyers, from `roles`).
2. **Four levels of risk** — a pyramid from `tiers`: short name, one-line description, two `hospitalityExamples`, applicable dates. Click → pop-up with the full tier detail. Below it, two small links: `crossCuttingDuty` (applies at every level) and `gpai` (outside the levels).
3. **Who has to do what** — builder and buyer side by side from `roles`, then the builder trap from the flagged route in `providerSwitchRoutes`.
4. **When it applies** — a horizontal timeline from `timeline` with a today marker; filled = past, outlined = upcoming. Keep only milestones a newcomer needs (entry into force, the Omnibus, and milestones that activate a tier, AI literacy or the GPAI rules). Strip article references from labels.
5. **What it means for hotels** — the first sentence of `hospitalityHeadline` as a callout, then one card per exposure named in the rest of that sentence (employer, biometrics, transparency towards guests, builder trap), each with a short example from the data. Links to the scenarios and the self-assessment.
6. **Rules people don't expect** — cards built from data fields: AI literacy for everyone; staff emotion recognition banned; non-EU groups can be caught; even a low-risk chatbot must say it is AI; an AI-generated label does not fix a misleading image; dynamic room pricing is not high-risk.
7. **What happens if you get it wrong** — the three AI Act fine tiers as bars scaled to their euro caps; a card on lower caps and simplified documentation for SMEs and SMCs; a card on GDPR fines applying on top.
8. **Who checks** — the first sentence of `penalties.enforcement.summary` and `nationalLayer.keyFinding`; one card per focus country with its authority; non-EU countries visually marked as such.
9. **Where to read the official text** — the Commission's Service Desk, AI Act Explorer and high-risk guideline explorer (`meta.links`), plus both local PDFs.
10. **Go deeper** — links to Check a system, all Topics, What is still open, What changed and why.

Keep the wording "Annex III" where it appears on the overview; do not replace it.

### View 2 — Topics

The full research, **one topic at a time**, with a side menu (a horizontal row on phones). Topics: Risk levels, Timeline, Builders and buyers, Hotel provisions, GDPR and data, Fines and enforcement, Country by country, Draft guidelines, Open questions, Fine print, Annex III list, Glossary and legend. Any link elsewhere in the tool that points into a topic switches to that topic and scrolls to the target.

Content of the topics:

- **Risk levels** — `scope`, then the four-tier pyramid from `tiers`. Each tier shows name, one-line description, applicable date and confidence. Clicking a tier expands its examples, article references and the obligation split from `obligationsByRoleAndTier`. `crossCuttingDuty` (AI literacy) spans all four tiers rather than sitting inside one. `gpai` sits outside the pyramid as a separate track with its "regulates the model makers, not the hotels" framing.
- **The high-risk tier has two routes and they are asymmetric.** Route 2 (Annex III use cases) is where hotel exposure sits. Route 1 (Annex I safety components) was narrowed by the Omnibus: AI solely used for non-safety-related user assistance, performance optimisation, service efficiency, automation, convenience or quality control is not a safety component unless failure would endanger health and safety. Render that carve-out where someone meets Route 1, not buried, together with `annexIIIReference.annexI.sections.netHotelPosition`.
- **Timeline** — all milestones from `timeline`, each linking to the tiers and articles it activates.
- **Builders and buyers** — `roles` side by side with the builder/buyer shorthand; the five routes in `providerSwitchRoutes` as the builder trap, route D visibly flagged; `switchConsequences` with its enumerated cooperation limbs and the open-source carve-out; `shadowAI` as an expandable panel.
- **Hotel provisions** — `hospitalityHeadline` and `hospitalityProvisions`.
- **GDPR and data** — `gdprLayer`, with the new **Art. 4a** foregrounded on the seam between the two regimes (six conditions for using protected-characteristic data for bias testing), cross-linked from D4 and P2. The Art. 27 entry shows `whatThisMeansForHotels` and `omnibusChange`.
- **Fines and enforcement** — `penalties`, AI Act and GDPR side by side, SME/SMC lower-amount rule visible; then `enforcementStructure`, leading with the answer (the AI Office's new powers do not reach hotels) before the reasoning and the two indirect channels.
- **Country by country** — `nationalLayer`: scope note, key finding, link to the Commission list, and one card per country with AI Act authority, legal basis, status, workplace-AI labour rules, the hotel note, sources and confidence.
- **Draft guidelines** — `draftClassificationGuidelines`: status, bindingness, and the `coverageCaveat` rendered with the findings, not buried. 6 horizontal and 8 employment findings. Findings whose `hotelRelevance` starts with HIGH, VERY HIGH or MAJOR must be hard to miss. Wire every `affects` entry as a link in both directions, so a scenario or section shows the findings that touch it.
- **Open questions** — `interimPostures`: each posture with its `posture`, `trigger` and `ifItChanges`. The oi1 `adoptNow` and `doNotBank` lists render visibly differently; the oi3 `decisionRules` render as if/then conditionals. `remainingActionItems` as "still to do".
- **Fine print** — `classificationFilter`, `boundaries` and `notHighRisk` as expandable panels.
- **Annex III list** — `annexIIIReference`: all eight areas plus the Annex I route. Areas 1, 4 and 5 carry verbatim `subPoints` with a `hotelUse` gloss and their own confidence — surface those fully. The other five carry `subPoints: null`; present them visually recessed and do not expand them. Annex III was not amended, so its page link (`annexIIIPdfPage`) needs no flag — but `annexI` carries an `omnibusCorrection` about the Section A/B machinery move, which does. Render `annexI.sections` (Section A items, the machinery move, the net hotel position).
- **Glossary and legend** — `glossary` as a searchable list, with terms linked inline wherever they appear in other views; the legend for confidence badges, tiers and citation flags.

### View 3 — Hotel scenarios

All 13 scenarios from `scenarios` as filterable cards. Filters: role, tier, GDPR exposure, AI Act fine tier, confidence. `scenarioTimingNuance` sits permanently above the cards: the grandfathering misunderstanding is the one my teammates keep making.

Each card shows up front: ID, role, tier, confidence, title, any `flag` (P3), classification with its `note` next to it (D5, D6), the `becameProviderVia` route linked back to Topics, applicable date and what to do (`obligations`). Behind a "Risks, fines and legal detail" expander: verbatim Annex III sub-points it cites (D4 → 4(a), D5 → 4(b), D6 → 1(a), D3 → 5(c) as the "pricing is not listed" counterexample), key risks, consequences, fine exposure, sources, the Art. 4a cross-link and any `omnibusCorrection` (D4, P2, P1, P5). Open-item, draft-guideline and national-layer links sit as single compact lines under the card.

### View 4 — Check a system (self-assessment wizard)

Implement exactly the specification in `wizard`. Short triage, 5–6 questions on most paths, skipping branches the answers make irrelevant. Follow `questions`, their `choices`, `next`, `sets`, `outcome` and `exclusive` fields literally; do not add, remove or reorder questions.

- `exclusive: true` on a multi-select choice means selecting it clears the others.
- `type: "multi"` choices carrying their own `outcome` (q4) terminate immediately when selected.
- Resolve the final tier per `outcomes.assemble.instruction`: highest-severity flag wins (prohibited > high > transparency > minimal). A q5 choice whose `next` is q6 has its tier refined by the q6 answer — otherwise the Art. 6(3) filter could never lower a high flag. Transparency duties from q7 **stack on top** of whatever tier was resolved — a minimal-risk chatbot still owes Art. 50(1) disclosure. Getting this wrong is the most likely substantive bug.
- q5's `annexI` choice carries an `omnibusCorrection` and a `note` holding the safety-component carve-out. Both must render with the choice, before the user picks it.
- The outcome reports: role and any Art. 25 switch route; tier and its applicable date; the obligation list for that role and tier; Art. 50 duties on top; GDPR flags; fine exposure; **the lowest confidence level touched anywhere on the path**; links to matching scenarios; the draft-guideline findings that bear on the outcome; and the open items that touch it.
- Where an outcome rests on an Annex III sub-point, show that sub-point's verbatim text, not just its reference.
- Each question offers its optional deep dive from `deepDives`, sourced from the JSON section named in `source`. Deep dives expand in place; they never navigate away and lose the answers.
- Answers must be revisable without restarting. Show the path taken so someone can see why they landed where they did.

## Uncertainty is a first-class feature — outside the overview

My research contains draft guidance, pending litigation, genuine judgement calls and open items. The overview hides these to stay readable; every other view and every pop-up must show them.

- Every item carrying a `confidence` value renders a visible badge using `meta.confidenceLegend`, everywhere except the overview. The five levels are `settled`, `scheduled`, `judgement`, `draft-guidance`, `contested`.
- Confidence must be distinguishable **without colour** — border style, icon, or label. Reuse my one-pager's dashed-outline convention for `judgement` and `contested`. Colour alone never carries meaning anywhere in this tool.
- `openItems` has 4 entries and gets a persistent, always-reachable panel, with `resolvedItems` (4 entries, visibly distinguished, each with its `outcome` and a link to where the content now lives) shown below. Each open item lists what it `affects`, linked to those sections, and links to its interim posture. When someone opens a tier, scenario or wizard outcome an open item affects, that link must be visible from there too. oi5 carries an `omnibusPoint` — link it to the Omnibus PDF page.
- Where a JSON entry has a `note` qualifying a classification (D5's availability-vs-performance distinction, D6's contested call, q6's "treat as high-risk until guidance lands", q5's Annex I carve-out, 5(c)'s pricing misreading), render it next to the classification, not behind a hover or an expander.
- `meta.factsVerifiedOn` and `meta.legalBasis` show in a persistent footer on every view. Anyone reading a screenshot in six months must be able to tell how stale it is.

**Provenance:** `corrections` records 18 places where my research was corrected or explicitly checked, each with location, change and basis. Put it behind a clearly labelled "What changed and why" panel, together with all 43 Omnibus amendment points (filterable to material ones), the superseded and new articles, and the Commission explorer as a secondary consolidated-text link. Entries elsewhere carrying an `omnibusCorrection` field link to their entry. The entry recording a check that resulted in no change stays visible and is marked as such — it is evidence of verification.

## Keeping it uncluttered

The first version stacked everything on one page and repeated the same signals in every block. Avoid that:

- **Sources** collapse to one quiet line per block ("Sources: Art. 5, Art. 99(3)") that still shows "Δ n amended" / "+ n new" when relevant, and expands to the linked chips.
- **Open-item and draft-guideline links** collapse to one compact line each ("◌ 2 open questions", "✎ 3 draft-guideline findings · ⚑ 1 high relevance") that expands to the individual links.
- **Long paragraphs** (over about 320 characters) show three lines with "Show more". Never clamp classification notes, flags, corrections, amendment notes or verbatim legal text.
- **Pop-ups** open as a side panel, close with Escape, × or a click outside, and return focus to where the reader was.

## Citations

One shared component, reading the `articles` arrays, applying the three citation rules above.

- `articles.byNumber` maps all 113 base articles to a verified `title` and June 2024 `page`.
- `omnibusAmended.points[].omnibusPage` gives Omnibus page targets.
- `annexIIIReference.annexIIIPdfPage` (127) is the Annex III target.
- Link patterns are in `meta.links.localActPageLinkPattern` and `omnibusAmended.localPdfPageLinkPattern`. URL-encode the spaces in both filenames.
- Sub-paragraph references (Art. 5(1)(f), Art. 25(1)(c), Art. 99(6a)) link to the parent article's page — the PDFs have no finer anchors. Show the full sub-paragraph reference as link text anyway.
- GDPR references, Annex III point references, EDPB opinions and the Service Desk FAQ render as text with no link (Annex III point references jump to the verbatim sub-point in Topics). `meta.links.commissionExplorer` is available as a secondary "consolidated text" link; the local page links are primary.
- Compute every link target in one place, so swapping local paths for hosted URLs later is a one-line change. Say so in a code comment.

## Visual direction

Your call on the aesthetic — I have no house style to match and I would rather you make something coherent than follow a spec I invented. Non-negotiables:

- Visual first on the overview: pyramid, timeline, cards, fine bars, country cards. Little running text.
- Legible. Real line-height, real whitespace, body text that does not fight the reader.
- Colour is never the sole carrier of meaning — applies to tiers and confidence alike.
- Light and dark both work, following `prefers-color-scheme`.
- Keyboard navigable: every card, pop-up, expander, filter and wizard choice reachable by tab and operable by enter or space. Visible focus states.
- It should read as a clear explainer and a research instrument, not a compliance product. No urgency styling, no alarm colours on things merely scheduled, no fake dashboard gauges.

## Build order

1. Read `ai-act-data.json` in full, including `omnibusAmended`, `corrections`, `draftClassificationGuidelines`, `interimPostures`, `resolvedItems`, `enforcementStructure` and `nationalLayer`. Read `EU AI Act at a glance.pdf` for the visual conventions and the FLI flowchart for wizard structure. You do not need to read either regulation — the page maps, Annex III sub-points and amendment descriptions you need are already in the JSON.
2. Write the shared primitives first: the data loader, the article-reference component with its three citation rules, the confidence badge, the glossary-term linker, the pop-up panel. Test the citation component against one article of each kind — Art. 9 (unamended), Art. 25 (amended), Art. 4a (new) — before building any view.
3. Build Topics first (it holds the depth the pop-ups reuse), then the Overview, then Hotel scenarios, then Check a system. The wizard is the one with real logic — do not rush it. If you are running short, stop after a view and tell me, rather than thinning all of them.
4. Verify against the acceptance criteria below, in the browser, before telling me it is done.

## Acceptance criteria

Check each and report the result:

- [ ] Opens from `file://` with no console errors, no network requests.
- [ ] Opens on the Overview. A reader with no background can follow it top to bottom: what the Act is, four risk levels, who has duties, when it applies, what it means for hotels, surprising rules, fines (including smaller companies), who checks, where to read the text.
- [ ] The Overview shows no article references, amendment flags, confidence badges or open-item markers; every block opens a pop-up with the detail and an "Open in Topics" link.
- [ ] Present and reachable: 13 scenarios, 31 glossary terms, 9 timeline milestones, 5 provider-switch routes, 8 Annex III areas, 8 wizard questions, 4 open items, 4 resolved items, 18 corrections, 43 Omnibus amendment points, 14 draft-guideline findings, 3 interim postures, 6 national-layer countries, 12 topics.
- [ ] Every `draftClassificationGuidelines` finding is reachable from the scenarios in its `affects` array, and each of those scenarios links back to it.
- [ ] Findings with HIGH, VERY HIGH or MAJOR `hotelRelevance` (three in the current data: e1, e3, e5) are visually prominent, not uniform with the rest.
- [ ] The oi1 posture's `adoptNow` and `doNotBank` lists are rendered differently from each other.
- [ ] The oi3 posture's five decision rules render as if/then conditionals.
- [ ] `enforcementStructure` leads with the answer (the powers do not reach hotels) before the detail.
- [ ] The `coverageCaveat` on the draft-guidelines section renders with the findings.
- [ ] No legal fact appears in the UI that is not in the JSON. Spot-check five claims back to source.
- [ ] Citation rule 1: Art. 9 links to the June 2024 PDF page 56 with no amendment flag.
- [ ] Citation rule 2: Art. 25 links to June 2024 page 67, shows the "Δ amended" flag and an Omnibus page link, and the flag opens the amendment note. Art. 50 links to page 82 and carries the flag too.
- [ ] Citation rule 3: Art. 4a links only to the Omnibus PDF and never to the June 2024 PDF.
- [ ] Nowhere does an August 2026 high-risk application date appear. The dates shown are 2 Dec 2027 and 2 Aug 2028.
- [ ] The Art. 6(1a) safety-component carve-out is visible on the high-risk tier's Route 1 and on the wizard's Annex I choice, before selection.
- [ ] Art. 4a is reachable from the GDPR layer and cross-linked from D4 and P2.
- [ ] Wizard: "vendor chatbot, no HR use, no synthetic content, guest personal data" → **transparency tier, deployer, Art. 50(1), GDPR processor contract and lawful basis**, matching D1.
- [ ] Wizard: "general chatbot used to rank job applicants" → **provider via route D, high risk, Annex III 4(a), applies 2 Dec 2027, Tier 2 fine**, showing the verbatim 4(a) text and the shadow-AI flag.
- [ ] Wizard: "we analyse call-centre agents' voices for mood" terminates immediately at **prohibited, Tier 1, €35m/7%** without continuing to later questions.
- [ ] Transparency stacking: a minimal-tier system that is also a chatbot still shows the Art. 50(1) duty.
- [ ] A path touching q6's "not sure" reports confidence `draft-guidance`, not `settled`.
- [ ] Annex III areas 1, 4 and 5 show verbatim sub-points; areas 2, 3, 6, 7 and 8 show headings only, visually recessed.
- [ ] Confidence is distinguishable with colour disabled (test in greyscale).
- [ ] Open items are reachable from the sections they affect, not only from their own panel.
- [ ] Footer shows facts-verified date and legal basis on every view.
- [ ] Keyboard-only run through the full wizard works, with visible focus throughout.
- [ ] No horizontal scrolling at 375px on any view.

## Do not

- Do not put references, badges, amendment notes or open-item markers on the Overview.
- Do not take substantive content for any of the 36 articles listed in `omnibusAmended.supersededActArticles` from the June 2024 PDF. The JSON governs those.
- Do not link a `newArticles` entry to the June 2024 PDF. Those articles do not exist in it.
- Cite EUR-Lex or the Commission AI Act Service Desk as the primary text. `artificialintelligenceact.eu` carries the amended text (checked 12 Nov 2026) and may be used as a secondary source; other third-party explorers must be checked for Omnibus consolidation first.
- Do not expand Annex III areas 2, 3, 6, 7 or 8 into sub-points. The JSON stops at headings there by design.
- Do not add export, print or copy-to-clipboard features. I will ask separately.
- Do not add analytics, telemetry, localStorage persistence or any server call.
- Do not soften or omit the uncertainty markers, the `omnibusCorrection` notes or the `corrections` panel outside the Overview to make the output look more authoritative.
- Do not restructure `ai-act-data.json`. If you find an error, tell me — do not fix it silently.
- Do not rename or move either PDF; the citation links depend on their filenames.

When you are done, tell me in a few lines what you built, which acceptance criteria passed, and anything in the data layer that looked wrong or thin.
