# Hotel AI Register: build plan from the team's existing data and tools

Scope: what the repo at `/home/user/final` already holds that a "Hotel AI Register" (a list of every AI tool a hotel or group uses, with its AI Act label, duties, owner, evidence and status) can reuse; what is missing; a data model; architecture options on the claude.ai artifact platform and alternatives; MVP and phases; risks. All facts below were read from the files on 17 Nov 2026 (counts computed with Python over the embedded JSON). No repository files were modified. Sources are local file paths.

Short names used for sources:
- CAT = `/home/user/final/tools/use-case-catalogue/index.html` (script `#data`)
- RDY = `/home/user/final/tools/readiness/index.html` (scripts `#cat`, `#rdy`)
- ACT = `/home/user/final/tools/ai-act-explorer/ai-act-data.json`; EXP = `/home/user/final/tools/ai-act-explorer/ai-act-explorer.html`
- BOOK = `/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf` (26 pages, read with `pdftotext -layout`)
- ASM = `/home/user/final/tools/assessment/` (index.html, engine.js, report.js, README.md, HANDOFF.md)
- HUB = `/home/user/final/tools/index.html`, `/home/user/final/tools/build-hub.mjs`, `/home/user/final/tools/README.md`
- DTS = `/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/*.d.ts`

---

## Q1. What data already exists, in what shape, and what is reusable directly?

### Takeaway
Almost all reference content a register needs already exists as machine-readable JSON: the 91-use catalogue (CAT), per-use resources/architecture/add-on flags and a 31-question checklist (RDY), and a full AI Act data layer with a working classification wizard, obligations by role and tier, timeline, GDPR layer and national layer (ACT). The big exception is the per-use AI Act label from booklet A6/Part C, which exists only as PDF prose (see Q2). Use cases have no stored ID; IDs like `rm-1` are positional and only appear in RDY.

### Cited Findings

**Use-case catalogue (CAT)**
- `#data` is one JSON object with 7 top-level keys: `depts` (list, 15), `src` (dict, 43 sources), `ex` (dict, 15 department explainers with keys `how`, `a`, `s`, `n`, `g`), `head` (dict, 15 headline figures `[text, sourceCode]`), `tags` (dict, 15 space-separated strings, one tag per use: `a` automates / `s` assists / `n` adds new), `cos` (list, 152 vendors), `hg` (list, 41 hotel groups) — [CAT](/home/user/final/tools/use-case-catalogue/index.html)
- Each department has `id, name, wname, cat, use, mix, uses`. The 15 ids are `rm, res, sm, fo, gx, fb, hk, me, kc, pr, fa, hr, gm, it, lg`; `cat` is one of Commercial / Guest-facing / Operational / Administrative — [CAT](/home/user/final/tools/use-case-catalogue/index.html)
- Uses per department: rm 8, res 8, sm 7, fo 5, gx 6, fb 6, hk 6, me 7, kc 5, pr 6, fa 7, hr 5, gm 6, it 5, lg 4 = 91 — [CAT](/home/user/final/tools/use-case-catalogue/index.html)
- Each use has exactly the fields `n, task, ai, use, srcs` (all 91). **There is no `d` field and no `id` field on a use**; the department is implied by the parent object. (The task brief listed a field `d`; I could not find it on uses. `d` exists only on vendors, as a dict department-name → description.) — [CAT](/home/user/final/tools/use-case-catalogue/index.html)
- `use` (adoption level) distribution: Low 40, Medium 28, Very low 19, High 4 — [CAT](/home/user/final/tools/use-case-catalogue/index.html)
- `srcs` entries are arrays whose first element is a type code: `c` company (146), `r` research/survey (48), `h` hotel group (38), `l` (10; meaning not verified, probably literature/legal) — [CAT](/home/user/final/tools/use-case-catalogue/index.html)
- Vendors (`cos`) have fields `n, t, r, d, src` (152 entries); `d` maps department names to what the vendor offers there. Hotel groups (`hg`) have `name, hq, size, summary, own_ai, own_ai_note, strategy, initiatives, not_found, confidence` (41 entries); initiatives carry `dept, what, partner, status, scope…` — [CAT](/home/user/final/tools/use-case-catalogue/index.html)
- The page maps department names to ids with `idByName` (matches `wname` or `name`, plus a `NAMEMAP`), i.e. vendor/hotel-group links are by department name string, not id — [CAT](/home/user/final/tools/use-case-catalogue/index.html) (line ~263)

**Readiness tool (RDY)**
- `#cat` is byte-for-byte the same catalogue as CAT `#data` (parsed JSON objects compare equal) — [RDY](/home/user/final/tools/readiness/index.html)
- `#rdy` keys: `areas` (6), `q` (dict, 31), `blocks` (20), `arch` (9), `uc` (91), `addons` (4), `figs` (4), `levels` (3), `levelsNote` (string) — [RDY](/home/user/final/tools/readiness/index.html)
- `areas`: `pe` People, `sk` Skills, `fi` Financial investment, `te` Technology infrastructure, `da` Data, `or` Organisation & governance; each with `k, name, one, why, figs, needs, routes, ex, qs, inv` — [RDY](/home/user/final/tools/readiness/index.html)
- `q`: 31 questions keyed P1–P6, O1–O6, F1–F5, T1–T5, D1–D5, G1–G4; each has `a, q, ap, gate, proof`. Six are gates: P1, F1, F2, T1, D5, O1. Example P1: "Is one named person responsible for this AI use case, with time set aside for it?" proof "Name, role and hours per week in writing" — [RDY](/home/user/final/tools/readiness/index.html)
- `uc`: 91 entries with `id, int, arch, add, r, chk, ev`. Ids are `rm-1 … lg-4`, in the same order as CAT. `int` (integration effort): Moderate 56, Light 19, Heavy 16. `r` holds one text per resource area (`pe, sk, fi, te, da, or`). `chk` lists checklist codes. `ev` lists evidence ids from the master research record (e.g. "HYB-098-04") — [RDY](/home/user/final/tools/readiness/index.html)
- `arch` (9 tool types): A1 Staff GenAI assistants, A2 Guest and caller conversational agents, A3 Forecasting/pricing/optimisation, A4 Personalisation/CRM/upselling, A5 Document and transaction automation, A6 Agentic and multi-system platforms, A7 On-site devices (IoT, robotics, computer vision), A8 Monitoring/analytics/risk detection, A9 Decisions about people and identity; each with `c, n, s, what, test, vend, extra, risk, cost`. Use counts: A3 18, A1 13, A7 13, A8 13, A5 11, A2 7, A9 6, A4 5, A6 4; one use (`lg-4` "AI use policies and governance") has an empty `arch` — [RDY](/home/user/final/tools/readiness/index.html)
- `addons`: `sens` Sensitive personal data (8 uses), `pay` Payment data (3), `hw` Hardware spending (13), `auto` Acts without human sign-off (10); each with `n, tag, need, codes, blocks`. `sens.need` already states "a lawful basis, an impact assessment (DPIA), a person who takes every decision and works-council consultation where staff are affected. Legal detail in D7." — [RDY](/home/user/final/tools/readiness/index.html)
- `levels`: Build foundations first / Ready to pilot / Ready to scale; `levelsNote`: "Thresholds (40% and 75%) are a team proposal, not evidence-based; they will be tested with interview hotels." — [RDY](/home/user/final/tools/readiness/index.html)

**AI Act data layer (ACT)**
- 37 top-level sections: meta, articles, scope, tiers, crossCuttingDuty, classificationFilter, gpai, timeline, penalties, roles, highRiskProviderRequirements, obligationsByRoleAndTier, providerSwitchRoutes, switchConsequences, boundaries, hospitalityHeadline, hospitalityProvisions, notHighRisk, gdprLayer, scenarios, scenarioTimingNuance, shadowAI, glossary, openItems, wizard, sourceNote, annexIIIReference, sourceFiles, omnibusAmended, corrections, enforcementStructure, resolvedItems, draftClassificationGuidelines, interimPostures, nationalLayer, transparencyGuidelines, standards — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- `meta`: version "1.1", `factsVerifiedOn` "2026-11-10", `legalBasis` Regulation (EU) 2024/1689 as consolidated 27 July 2026 incl. Digital Omnibus (Reg. (EU) 2026/1744), `disclaimer` "Research document, not legal advice…", plus a `confidenceLegend` with five levels: settled, scheduled, judgement, draft-guidance, contested — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- `tiers` ids: `prohibited, high, transparency, minimal` (4; there is no "high-risk if…" tier and no "outside the high-risk list" tier) — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- `timeline`: 9 dated milestones (1 Aug 2024 … 2 Aug 2028), each `date, label, milestone, status, articles`; e.g. 2 Dec 2027 high-risk Annex III, 2 Aug 2028 Annex I — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- `obligationsByRoleAndTier`: 4 entries (`tier, provider, deployer`); the high-tier deployer list has 10 duties (use per instructions Art. 26, human oversight, input data, monitor/suspend, serious incidents, logs ≥ 6 months, inform workers' representatives before use Art. 26(7), inform people subject to decisions, use provider info for DPIA, right to explanation Art. 86); minimal deployer = "None (voluntary codes)". AI literacy sits separately in `crossCuttingDuty` — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- `scenarios`: 13 (D1–D7 deployer, P1–P6 provider), each with `id, role, title, tier, classification, obligations, keyRisks, consequences, aiActTier, gdprExposure, appliesFrom, articles, confidence` — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- `gdprLayer`: 9 provisions (Art. 22, Art. 35 DPIA, AI Act Art. 4a × special categories, Art. 28 processors, Arts. 44–49 transfers, Art. 88 employment, training data EDPB Opinion 28/2024, Art. 33 breach, AI Act Art. 27 FRIA) — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- `nationalLayer.focusCountries`: France, Germany, Spain, Sweden, UK, Switzerland; each country entry has `country, euMember, aiActAuthority, legalBasis, designationStatus, labourRules, hotelNote, sources, confidence` — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- `openItems`: 4, each with `affects` (e.g. oi1 high-risk guidelines still draft, affects classificationFilter, D4, D5, P2, P3) and `interimPosture` — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- The explorer HTML embeds an exact copy of the JSON in `<script id="ai-act-data">` (parsed copy equals the file) — [EXP](/home/user/final/tools/ai-act-explorer/ai-act-explorer.html)

**Booklet (BOOK)**
- A2 defines five labels with dates: Prohibited (from 2 Feb 2025), High-risk (from 2 Dec 2027), High-risk if… (2 Dec 2027; AI in regulated products 2 Aug 2028), Transparency (from 2 Aug 2026), Minimal; "plus 'outside the high-risk list' for tools the Act excludes but other law covers strictly" — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.4
- A2 marks: (draft guidance), (our reading), (contested), (proposal) — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.4–5
- A3: four maker routes (Build it, Brand it, Change it, Repurpose it) and "Seven questions for every AI vendor. Put the answers in the contract." (maker identity; ranks/scores/monitors staff, emotions, face/voice and can it be switched off; AI notice built in; data location + DPA; for high-risk: instructions, logs, CE mark, registration before 2 Dec 2027, notice of updates; training on our data and opt-out; pricing using competitors' non-public data) — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.5–6
- A4: who is usually the user by set-up: Owner-operated → operating company; Managed → management company (watch brand where standards impose a tool); Franchised → franchisee (watch brand); Leased → tenant. "[Labour] [GDPR] Duties towards staff … fall on the company that employs them, which may differ from the AI Act user." — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.6–7
- A6: "Of the 91 AI uses on our list (A1), 3 are high-risk as normally used and 13 more become high-risk depending on how they are set up; 11 of those 16 concern staff and sit in six departments… Five can become prohibited through a single feature, and 11 must tell people they are dealing with AI or label realistic AI images." The A6 table is by department group (HR; Commercial; Rooms division; F&B; Security and IT; General management; Maintenance/procurement/finance/legal), not by use id. "Everything not listed is minimal" — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.7–8
- A8: eight other-law tags: [Labour], [GDPR], [Consumer], [Competition], [Liability], [Cyber/PCI], [CH], [UK] — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.9–10
- Part C tables have three columns "Tool | Label | What changes it" (C1 HR, C2 Rooms, C3 Commercial, C4 F&B, C5 Security/IT; C6 low exposure is prose). C4 F&B rows: Ordering bots/table-booking phone agents = Transparency; Service robots that talk = Transparency if not obviously a machine; Food-waste cameras = Minimal, High-risk if footage or logs are used to rate individual cooks (draft guidance); Smart ovens/cleaning robots = Minimal for the hotel, ask the maker (gas safety component from 2 Aug 2028); Menu pricing, covers and production forecasting, recipe tools = Minimal — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.17
- The booklet itself asks for a register: "Start here" check 4 "List every AI tool in use: what it does, who supplies it, who in the hotel is responsible… head office pools the lists"; B1 "Ask the operator for the list of AI tools… its label (A2)"; B2 DO 1 "Keep a group register of AI tools, fed by each hotel's list"; B3 DO 1 "Name one person responsible for each tool on the property's AI list" — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.3, 11, 12, 13

**Assessment tool (ASM), the shared-database pattern**
- Declared capabilities: `{"db":{"rules":[{"path":"frameworks","read":"view","write":"owner"}]},"user":{"scopes":["profile"]},"downloads":{}}`; storage paths `assessments/<ID>` (ID like `20261106-K7QX`), `transcripts/<ID>`, `frameworks/v<N>`; limits stated as records up to 256 KB and up to 25,000 records — [ASM README](/home/user/final/tools/assessment/README.md)
- Code pattern: `window.claude.use('db'|'user'|'downloads')` in parallel; if `window.claude.use` is missing → `APP.mode='nostore'` banner; `user.can('data.write')` sets read-only; error codes `revoked/not_granted/capability_disabled/capability_removed` → read-only; `invalid_argument` → denied; `onSnapshot` on `frameworks` and `assessments`; local drafts in `localStorage` keyed per record; `downloads.save({filename,data})` for PDF (jsPDF 2.5.1 in report.js), CSV (semicolon-separated) and JSON backup; owner-only "Delete permanently"; framework versions with "Re-score with vN" — [ASM index.html](/home/user/final/tools/assessment/index.html) (lines ~462–504, 982–984, 1499–1565, 1679)
- Known gaps the team already lists: no import button (restore needs Claude to write records back), last-save-wins on concurrent edits (with a warning), data lives inside the owner's artifact and is deleted with it — [ASM README](/home/user/final/tools/assessment/README.md), [HANDOFF](/home/user/final/tools/assessment/HANDOFF.md)
- Engine is dependency-free and "also runs in Node", with 39 Node tests and Playwright UI tests using a `mock_platform.js` stand-in for Claude storage — [ASM README](/home/user/final/tools/assessment/README.md) (note: the `tests/` folder is not in `tools/assessment/` in this repo; not verified present)

**Hub (HUB)**
- `tools/index.html` is GENERATED by `build-hub.mjs`: it takes `assessment/index.html`, renames the title to "HFTP Tool Hub", rewrites `engine.js`, `report.js`, `lib/` paths to `assessment/…`, and injects `hub/hub-bar.html` after `<body>`. The bar opens Use-Case Catalogue and Readiness as iframes. Comment: "The Assessment tool must be the main page: saving (Claude's built-in storage) only works on an artifact's main page, not in a tab frame." Live hub: https://claude.ai/artifact/MWMGc2VKc6zniRn8um27eH — [build-hub.mjs](/home/user/final/tools/build-hub.mjs), [tools/README.md](/home/user/final/tools/README.md)

### Inferences
- Directly reusable as-is: CAT `depts/uses` (picker of 91 uses, department list), CAT `cos` (vendor picker, 152), RDY `uc` (integration effort, architecture type, add-on flags, per-area resource text, checklist codes), RDY `q` (31 questions incl. 6 gates, usable as "evidence/readiness" checklist per tool), ACT `timeline`, `obligationsByRoleAndTier`, `crossCuttingDuty`, `gdprLayer`, `nationalLayer`, `scenarios`, `wizard`, `meta.confidenceLegend`, BOOK A3 seven vendor questions (must be transcribed), BOOK A4 table (must be transcribed).
- The register should not copy these blocks into its own HTML by hand: three copies of the catalogue already exist (CAT, RDY `#cat`, hub iframes). A small build script (like `build-hub.mjs`) that inlines CAT, RDY and ACT JSON into the register page keeps one source of truth per dataset.
- `addons.sens` / `addons.auto` / `arch: A9` are good machine signals for "this use probably needs a DPIA / works-council step", but they are readiness tags, not legal labels.

### Gaps
- Meaning of `srcs` type `l` not verified. Meaning of RDY `q.ap` (e.g. "All") not checked in detail.
- RDY ids are positional (`<dept>-<index>`) and not stored in CAT. If anyone reorders or inserts a use in CAT, every `rm-1`-style key in RDY (and any register entry referencing it) silently points at a different use. No stable id exists today.

---

## Q2. Is the AI Act label of each of the 91 uses stored as data? What is needed to make it machine-readable?

### Takeaway
No. The per-use classification behind booklet A6 and Part C exists only as PDF text (and in an earlier draft outside this repo). `ai-act-data.json` classifies 13 scenarios and has a wizard, but nothing keyed to the 91 use ids. A new data file (proposed `uc-labels.json`, 91 rows) must be written by hand from BOOK A6 + Part C and reviewed by the D7 owner.

### Cited Findings
- Search of the repo for "High-risk if" finds only `ai-act-data.json` (one unrelated hit in `classificationFilter.summary`) and the explorer HTML; no JSON/CSV/MD keyed by use id (`rm-1`, `hr-1`…) other than RDY — repo grep, [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- A6 states the result of "our classification of the 91 uses against the AI Act… It covers the uses as we describe them, not named products. Several 'high-risk if…' entries rest on draft guidance" — but publishes only department-level groupings and totals (3 / 13 / 5 / 11) — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.7–8
- Part C rows group several catalogue uses under one "Tool" (e.g. "Dynamic pricing, demand forecasting, rate shopping" = Minimal; "Menu pricing, covers and production forecasting, recipe tools" = Minimal) and C6 covers maintenance, procurement, finance, legal and ESG in prose only — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.14–19
- Label vocabulary differs between sources: BOOK uses five labels plus "outside the high-risk list"; ACT `tiers` has four ids; the ACT wizard sets `tier: "minimal"` + `gdprArt9: true` for 1:1 face verification while BOOK C2 calls it "Outside the high-risk list (draft guidance)" — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.4, 15; [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json) `wizard.questions[q5-usecase]`
- `docs/d7-governance/README.md` lists provisions the booklet leaves out but the data layer covers (Art. 4a, Art. 27 FRIA, Art. 25(4), Arts. 75a–75d, Art. 99(1), Art. 17(2), Art. 60a, Art. 2(13)) — [D7 README](/home/user/final/docs/d7-governance/README.md)

Likely mapping for the clearest A6/Part C rows (my reading of BOOK vs use names; needs D7 owner sign-off):

| Use id (name) | Base label | What changes it (BOOK) |
|---|---|---|
| hr-2 AI recruiting | High-risk (+ transparency for hiring chatbot) | Reading candidates' emotions → prohibited (C1) |
| hr-5 Seasonal staff matching | High-risk (our reading) | — (C1) |
| res-8 AI call scoring | High-risk | Reading agents' emotions → prohibited (C3) |
| hr-1 Labour forecasting & scheduling | Minimal | High-risk if ranks staff on punctuality/reliability/ratings or changes regular hours/leave (C1, draft guidance) |
| hr-3 Onboarding/training/coaching | Minimal | High-risk if assessments decide pay/promotion/continued employment; prohibited if coach reads emotions and results reach HR (C1) |
| hr-4 Attrition prediction | Minimal as forecast | High-risk if used for renewals/dismissals; prohibited if infers wellbeing from face/voice (C1) |
| fo-2 / hk-6 Room assignment & cleaning plans | Minimal | High-risk if ranks attendants or reports rooms/hour per attendant (C2) |
| hk-5 Room inspection CV | Minimal if findings go only to attendant | High-risk if used to judge attendants (C2) |
| fo-3 Face verification 1:1 | Outside the high-risk list | GDPR Art. 9 (C2) |
| gx-2, gx-5 Guest chat / concierge | Transparency | — (C2) |
| gx-6 In-room voice assistant | Transparency | High-risk if reads guests' emotions (C2) |
| res-1 Voice agents | Transparency | High-risk if reads callers' emotions or voiceprint ID without active involvement (C3) |
| res-4 Booking-engine assistant | Transparency | — (C3) |
| sm-4 GenAI imagery | Transparency if realistic and could mislead | Minor edits need no label (C3) |
| sm-1 GenAI marketing text | Minimal | Transparency for health/safety/sustainability claims without human review (C3) |
| rm-1, rm-2, rm-3 pricing/forecasting | Minimal | Exploiting vulnerability → prohibited (our reading) (C3) |
| fb-2, fb-6 Ordering bots / table-booking agents | Transparency | — (C4) |
| fb-5 Service robots | Transparency if not obviously a machine | — (C4) |
| kc-1 Food-waste cameras | Minimal | High-risk if used to rate individual cooks (C4) |
| kc-3 Intelligent cooking equipment | Minimal for the hotel; ask maker | Gas-appliance safety component from 2 Aug 2028 (C4) |
| it-4 Physical security video analytics | Minimal | High-risk for remote face recognition / crowd mood; prohibited if reads staff emotions (C5) |
| it-3, fa-2 Fraud detection | Minimal | Excluded from credit scoring (C5, C6) |
| gm-1 BI dashboards | Minimal | High-risk if ranks individual staff (A6) |
| me-5 OEM predictive maintenance (lifts) | Minimal for hotel | Lift door/obstacle AI = maker's duty (A6, C6) |
| pr-4 Stock-variance / shrink | Minimal | High-risk if alerts used to judge staff (C6) |

### Inferences
- What is needed for a machine-readable mapping, per use id: `label` (enum: prohibited | high | high-if | transparency | minimal | outside-high-risk | not-ai-maybe), `labelMark` (draft-guidance | our-reading | contested | settled), `conditions[]` each with `{if, thenLabel, mark, wizardAnswers}`, `art50[]` duties, `otherLaw[]` tags from the A8 set, `appliesFrom` (derived from label via ACT `timeline`), `bookletRef` (e.g. "C4"), `scenarioIds[]` (link to ACT scenarios D1–D7/P1–P6), `notAiNote` (BOOK A2 "Is it even AI?"), `reviewedBy`, `reviewedOn`.
- A check script should assert the totals A6 publishes: exactly 3 base high-risk, 13 high-if, 5 with a prohibited condition, 11 with transparency; this is the strongest available test that the hand-made mapping matches the booklet. My draft table above reaches 3 high-risk but I did not complete all 13/5/11; the counting must be redone by the D7 owner with the original classification worksheet.
- Conditions are best stored as wizard answer overrides (see Q3), so "what changes it" becomes clickable: ticking "ranks staff on ratings" re-runs the same tier resolution the explorer uses.

### Gaps
- The original 91-row classification worksheet the booklet was built from is not in this repo (BOOK says "our classification of the 91 uses"); `PROJECT_CONTEXT.md` lists D7 docs (`D7_Booklet_Outline_v3`, `D7_Content_Inventory_v1`) that live in the claude.ai project, not here. If that worksheet exists, it should be the source instead of reverse-engineering the PDF.
- Which exact 5 uses "can become prohibited" and which 11 carry transparency could not be verified row by row from the PDF alone.

---

## Q3. Can the explorer's wizard classify a custom tool not in the catalogue? Exact structure

### Takeaway
Yes. `wizard` is pure data (8 questions, 4 outcomes, 5 deep dives) and the explorer's `walk()` / `collect()` / `resolveTier()` functions are small and generic. Lifting them into a shared `classify.js` (Node-testable, like `engine.js`) lets the register classify custom tools and store the answers as evidence of how the label was reached.

### Cited Findings
- `wizard` keys: `design`, `questions` (8), `outcomes` (4), `deepDives` (5). `design`: "Short triage that skips irrelevant branches. Most paths resolve in 5 to 6 questions… The outcome states role, tier, obligations, applicable date, fine exposure, GDPR flags and a confidence level, and links to the matching scenarios." — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- Question shape: `{id, prompt, help, articles[], type: "single"|"multi", choices[], next?, outcome?, deepDive?, confidence?}`. Choice shape: `{id, label, next?, outcome?, sets?, note?, flag?, exclusive?, articles?, confidence?, omnibusCorrection?}` — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- The 8 questions in order: q1-nexus (single: eu → q2, output-in-eu → q2, none → outcome out-of-scope-territorial); q2-role (single: vendor sets role deployer → q3; built sets role provider, route A → q4; pilot → outcome out-of-scope-prototyping); q3-switch (multi: rebrand route B, repurpose route D with flag "Most common accidental route", modify route C, none exclusive sets deployer; question-level next q4); q4-prohibited (multi: staff-emotion, exploit, scoring-scraping, intimate → outcome prohibited; none exclusive → q5); q5-usecase (multi: recruit 4(a), worker-mgmt 4(b), remote-biometric 1(a), guest-emotion 1(c), credit 5(b), insurance 5(c) → set tier high and next q6; verification sets minimal + gdprArt9 → q7; annexI sets high, annexI true, appliesFrom 2028-08-02 → q7; none exclusive sets minimal → q7); q6-filter (single, confidence draft-guidance: profiles → high, filterAvailable false; narrow → minimal, filterApplied; unsure → high, flagForReview; all → q7); q7-transparency (multi: chat 50(1), synthetic 50(2), deepfake 50(4), emotion-disclosure 50(3), none; next q8); q8-gdpr (multi: personal → processor-contract, lawful-basis; special → art9-basis, dpia; automated → art22, human-intervention; transfer → sccs, tia (contested); none; question-level outcome "assemble") — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- Outcomes: `out-of-scope-territorial`, `out-of-scope-prototyping` (related scenario P6), `prohibited` (fine Tier 1, related D7), `assemble` with `instruction`: "Resolve the tier from the highest-severity flag set (prohibited > high > transparency > minimal), then render: role and any Art. 25 switch route; tier with its applicable date; the matching obligation list from obligationsByRoleAndTier; any Art. 50 duties on top; GDPR flags; the fine exposure for that tier; the lowest confidence level touched on the path; and links to matching scenarios by role and tier." — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- Deep dives point at other sections: deep-roles→roles, deep-art25→providerSwitchRoutes, deep-art5→tiers[prohibited], deep-annexiii→hospitalityProvisions, deep-filter→classificationFilter — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- Engine in EXP: `walk()` follows answers from the first question; for `single` it takes `choice.next || q.next`; for `multi` it takes the earliest (by question index) of the chosen choices' `next` values "so no branch is skipped", else `q.next`; any chosen choice with `outcome` terminates; if no next and `q.outcome`, it returns that outcome. `collect()` accumulates role (later answers override), routes, annexIII, annexI, appliesFrom, art50, gdpr, flags, notes and confidence levels. `SEVERITY = ['minimal','transparency','high','prohibited']`; `resolveTier` takes the max; a q5 high flag whose q6 refinement sets minimal is replaced by the refinement; any Art. 50 duty adds a transparency flag — [EXP](/home/user/final/tools/ai-act-explorer/ai-act-explorer.html) (lines ~4488, 5382–5451)
- In multi questions, selecting a choice with `outcome` ends the assessment immediately (`wizChoice`) — [EXP](/home/user/final/tools/ai-act-explorer/ai-act-explorer.html) (line ~5690)

### Inferences
- Reuse plan: extract `walk`, `collect`, `resolveTier`, `lowestConf` into `classify.js` taking `(wizard, answers)` and returning `{outcome, role, routes, tier, appliesFrom, art50, gdpr, conf, flagForReview, notes}`. Store `answers` (a map `qid → [choiceIds]`) on each register entry; re-running classification after a data update shows whether a label changed.
- Catalogue uses can be expressed as pre-filled wizard answers: e.g. `hk-6` default `{q1:[eu], q2:[vendor], q3:[none], q4:[none], q5:[none], q7:[none], q8:[personal]}`; its "what changes it" condition = override `{q5:[worker-mgmt], q6:[profiles]}`. Then a register entry for a catalogue use only asks the conditions questions, while a custom tool runs the full 8-question wizard.
- Limits for a register: (1) the wizard yields four tiers, so "high-risk if…" and "outside the high-risk list" must be represented as base + condition, not as a tier; (2) role in q2 only covers vendor/built/pilot — no "group head office supplies it to the hotel" or franchise/brand-imposed route (BOOK A4), which a register needs for "who is the user"; (3) other-law tags beyond GDPR ([Labour], [Consumer], [Competition], [Liability], [Cyber/PCI], [CH], [UK]) are not wizard outputs; (4) q1 has no Swiss/UK branch beyond "output used in the EU" — BOOK Part D logic would need extra data; (5) `appliesFrom` is only set by the annexI choice; for other tiers it must be looked up from `timeline`/`tiers`.

### Gaps
- I did not run the explorer engine against test inputs; behaviour described is from reading the code.

---

## Q4. Proposed data model for the register

### Takeaway
Keep reference data (catalogue, readiness, AI Act, use-case labels) as versioned read-only JSON bundled into the page, and keep only hotel-specific facts in the database: organisation, properties, tool entries, evidence, and an append-only audit log. Every tool entry stores the reference-data version it was classified with, mirroring how the Assessment tool pins `frameworks/vN`.

### Cited Findings
- Precedent in the team's own tool: records pin the framework version they were scored with; older records show what they would score under a new version and offer "Re-score with vN" — [ASM README](/home/user/final/tools/assessment/README.md)
- Platform constraints that shape the model: documents ≤ 256 KiB and ≤ 32 levels deep; ≤ 25,000 documents per artifact database; writes are last-writer-wins; the store keeps no document history; "Don't map an unbounded, growing stream (events, log lines, messages) to one document per item — aggregate many items into one document or prune old ones" — [DTS db.d.ts](/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/db.d.ts)
- `user` capability: "STORE ONLY IDS … never a name, avatar, email or Profile object" — [DTS user.d.ts](/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/user.d.ts)
- Fields the booklet asks a hotel to hold: what the tool does, who supplies it, who is responsible, its label (Start here 4, B1, B3); who is user/maker and who pays (B1.3, A4); staff representatives consulted (B1.2, C1 DO 3); DPIA for cameras/biometrics (B3.2, C5 DO 2); vendor answers to seven questions (A3); logs ≥ 6 months for high-risk (A3); AI literacy record (A2, B2.3) — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf)

### Proposed model (JSON documents; paths for the claude.ai `db`)

```
org/main                      { name, type: group|independent, hqCountry, refDataVersion, createdBy(userId) }
properties/<propId>           { name, country (enum incl. CH, UK), operatingModel: owner-operated|managed|franchised|leased,
                                operator, brand, employer (A4 "[Labour][GDPR] employer may differ"),
                                staffReps: none|works-council|CSE|union, outlets: [{id, type: restaurant|bar|room-service|banqueting|spa|kitchen, name}],
                                gmUserId, dpoContact }
tools/<toolId>                { propIds[] | scope: group, source: catalogue|custom, useId? ("hr-2"), customDesc?,
                                deptId (CAT dept id), outletId?, vendorName (free text, optional link to CAT cos.n), productName,
                                role: deployer|provider, providerRoute?: A|B|C|D, decidedBy: property|brand|head-office,
                                wizardAnswers {qid:[choiceIds]}, conditionsAnswered {condId: yes|no|unknown},
                                result { label, tier, art50[], gdpr[], otherLaw[], appliesFrom, lowestConfidence, flagForReview },
                                refDataVersion ("acts-1.1+labels-0.1"), classifiedOn,
                                duties [{dutyId, text, source:"obligationsByRoleAndTier.high.deployer[5]", due, status: todo|done|n-a, ownerUserId}],
                                responsibleUserId, responsibleRole,
                                evidence { dpia:{status,date,link}, staffReps:{status,date,link}, staffBriefing/aiLiteracy:{date,link},
                                           vendorAnswers:{q1..q7:{answer,date}}, contractClause:{status}, aiNoticeChecked:{date}, logsRetained6m },
                                readiness { chk codes from RDY uc[].chk with yes/no }, 
                                status: proposed|pilot|live|paused|retired, goLive?, retiredOn?, notes,
                                createdBy, updatedBy, updatedAt }
audit/<toolId>-<yyyymm>       { entries: [{at, by(userId), action, field, from, to}] }   // aggregated per tool per month to respect doc caps
exports/<id>                  optional record of PDF/CSV exports given to owners or auditors
```

Reference data bundled in the page (not in db): `catalogue.json` (CAT), `readiness.json` (RDY `#rdy`), `ai-act-data.json` (ACT), new `uc-labels.json` (Q2), new `register-ref.json` (A3 seven vendor questions, A4 operating-model table, A8 tag definitions, BOOK Part D notes).

### Inferences
- With one document per tool and audit aggregated monthly, a 40-property group with ~25 tools each is ~1,000 tool docs plus a few thousand audit docs: well within 25,000.
- Duties should be generated, not typed: `obligationsByRoleAndTier[tier][role]` + `crossCuttingDuty` (AI literacy) + `art50` + GDPR flags + label conditions + RDY add-ons (`sens` → DPIA, works council). Deadlines come from `timeline` (e.g. 2 Dec 2027 for Annex III high-risk).
- F&B: model outlets on the property and an optional `outletId` on each tool, since CAT splits F&B across `fb` (service) and `kc` (kitchen) and BOOK C4 treats them together.

### Gaps
- No team decision exists on who in a hotel fills the register (GM vs department heads) or on status vocabulary; the model above is a proposal.

---

## Q5. Platform fit: claude.ai artifact vs alternatives

### Takeaway
The artifact runtime fits an internal team prototype well (it is exactly how the Assessment tool already works) and can carry a small invited pilot, but it is a poor fit for a multi-hotel HFTP member product: every user needs a claude.ai account, outside-organisation invitees are either read-only or full Editors (who can also publish page versions), public-link sharing turns invited outside Editors into read-only viewers, data lives inside one owner's artifact, and capabilities only work on the main page.

### Cited Findings
- `db`: one store per artifact, JSON docs at slash paths, realtime, "erased when the artifact is deleted"; only the owner, email-invited Editors ("only while the artifact is not also shared by a public link") and, on Team/Enterprise plans, members who can open it, may write; "Anyone else is an outside viewer: they never write" — [DTS db.d.ts](/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/db.d.ts)
- Levels: `view` (Viewer, Commenter, every signed-in outside visitor), `interact` (Contributor), `admin` (Editor or Owner; "also publishes versions and assets"), `owner` (the artifact's own owner), plus `self` for `{self}` subtrees. "Every signed-in visitor from outside the organization, by public link or email invitation" holds `view`, "except the outside Editor … while the artifact is not shared by link". "A signed-out visitor has no data at all." At most 64 rules — [DTS db.d.ts](/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/db.d.ts)
- Per-user privacy: `data/users/<id>/` is private by default, and `{self}` subtrees under any prefix are hidden from everyone incl. the owner unless a prefix rule opens them; but "`self` is a rule, not encryption… the owner or any Editor … can later publish looser rules or other code, then read or overwrite the documents already stored. Nobody is told." — [DTS db.d.ts](/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/db.d.ts)
- Availability: `await claude.use("db")` resolves null when the view cannot run it; error `not_granted` = "this view did not grant db to the frame". Served top-level on the artifact host, "every `use()` resolves `null` there for now"; a saved copy has no `window.claude` — [DTS db.d.ts](/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/db.d.ts), [DTS claude.d.ts](/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/claude.d.ts)
- Team finding: saving only works on the main page, so the hub makes the Assessment tool the main page and other tools are iframes — [build-hub.mjs](/home/user/final/tools/build-hub.mjs); "Do not also turn on public link sharing. If the tool is shared by public link, teammates can no longer save." — [ASM README](/home/user/final/tools/assessment/README.md)
- `user`: `isOwner()`, `canEdit()` (admin), `can("data.write")`; with scope `profile` names/avatars; reads never reject — [DTS user.d.ts](/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/user.d.ts)
- `downloads.save({filename, data})` asks the viewer to confirm; allowed extensions include json, csv, pdf, xlsx, docx, md, html, zip — [DTS downloads.d.ts](/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/downloads.d.ts)
- `artifact` capability: the page can publish a new version of itself; `conflict` and `not_writer` are routine failures; `{artifact:{publish:false}}` disables it — [DTS artifact.d.ts](/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/artifact.d.ts)

### Fit assessment

| Option | Good for | Trade-offs |
|---|---|---|
| (a) claude.ai artifact, team prototype | Team demo with fictional hotels; testing the data model with interview hotels in a screen-share | Proven pattern (ASM). Needs register to be the **main page**, so it cannot sit as an iframe tab in the current hub; either a separate artifact or the hub build must change which tool is main. Data dies with the artifact: JSON backup essential. |
| (b) claude.ai artifact, HFTP member pilot (3–5 hotels) | One artifact **per pilot hotel/group**, owned by the team, hotel staff invited by email as Editors, no public link | Every user needs a claude.ai login. Outside invitees are Editors = `admin`: they can also publish page versions (set `{artifact:{publish:false}}` and keep reference data paths `write: "owner"`). One shared artifact for several competing hotels is unsafe: Editors read all shared data, and `{self}` privacy is not encryption and the owner can loosen it. Data sits in a student's account: GDPR/ownership question for HFTP. |
| (c) Static site + browser storage (localStorage/IndexedDB) + export/import files | Public HFTP-member giveaway, no login, zero hosting cost, no personal data leaves the device | No sharing between GM and head office except by exporting/importing a JSON or Excel file; data lost if the browser is cleared; no audit by identity. Easy to host on HFTP's site; the same `classify.js` and JSON data run unchanged. |
| (d) Export-first: Excel/CSV template + static "classifier" page | Lowest effort for members used to spreadsheets | Classification only in the page; register lives in Excel; versioning by hand. |
| (e) Hosted web app (e.g. Supabase/Firebase + static front end) | Real product: multi-tenant per hotel group, roles (group admin, GM, department head), audit trail, SSO | Needs an owner after the student project ends (HFTP IT or a vendor), hosting cost, security review, DPA with HFTP members. Out of reach for a 1–2 week student MVP. |

### Inferences
- Recommended path: build the core as framework-free modules (`classify.js`, `duties.js`, reference JSON) that run in Node, in an artifact, and in a static page. Ship (a) for the team, and (c) as the HFTP-member deliverable; describe (e) as the scale-up path in D8/D10.
- Storing hotel-identifying records in a student-owned claude.ai artifact for real HFTP members raises a data ownership question the team should clear with the client and coach (scope changes need written validation per the project plan).

### Gaps
- Whether HFTP members could be added as organisation members (Team/Enterprise plan, which would give `interact` / Contributor) was not checked; the team's plan type is unknown.
- I did not verify the "capabilities only on the main page" finding against DTS directly beyond the `not_granted … to the frame` code; it is the team's empirical finding recorded in `build-hub.mjs`.

---

## Q6. MVP scope, later phases, keeping legal content updatable, and technical risks

### Takeaway
A 1–2 week MVP is realistic if the team limits it to: one property, add tools from the 91-use catalogue or as custom tools, auto-label via the reused wizard, generated duties and deadlines, responsible person and evidence checkboxes, PDF/CSV/JSON export. The single biggest content task is writing and reviewing `uc-labels.json` (91 rows). Legal content must stay in versioned data files with `factsVerifiedOn` and a "not legal advice" banner, as ACT already does.

### Cited Findings
- ACT already carries `meta.version` "1.1", `factsVerifiedOn` "2026-11-10", `disclaimer`, `confidenceLegend`, `corrections` (applied 2026-11-10), `resolvedItems`, `openItems` with `interimPostures`, and `omnibusAmended` — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- `sourceNote`: "Article numbers, dates and figures should be re-verified against the consolidated EUR-Lex text before external publication." — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json)
- `openItems.oi1`: high-risk classification guidelines still draft; BOOK says several "high-risk if…" entries rest on draft guidance and the Commission will adopt final guidelines "by the end of 2026" (ACT `draftClassificationGuidelines.status`) — [ACT](/home/user/final/tools/ai-act-explorer/ai-act-data.json), [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.8
- BOOK: "It describes the law and the Commission's guidance as they stood when this booklet was written; the watch list at the back names what may change… It is not legal advice." — [BOOK](/home/user/final/docs/d7-governance/AI_Governance_for_European_Hotels.pdf) p.1
- Existing test approach to copy: Node tests for the engine, Playwright UI tests with a mock platform — [ASM README](/home/user/final/tools/assessment/README.md)

### Proposed MVP (1–2 weeks, student team with Claude Code)
1. Day 1–3: `uc-labels.json` for all 91 uses (label, mark, conditions as wizard overrides, art50, otherLaw tags, bookletRef), written by the D7 owner from BOOK A6/Part C; a Node check that totals equal A6 (3 / 13 / 5 / 11). Add a stable `uid` to each use (keep `rm-1` style ids frozen in a lookup table) .
2. Day 2–4: `classify.js` extracted from EXP (`walk`, `collect`, `resolveTier`, `lowestConf`) + `duties.js` (obligations, AI literacy, art50, GDPR, add-on flags, deadline from `timeline`); Node tests using the 13 ACT scenarios as fixtures (each scenario's tier must be reproduced by some answer set).
3. Day 4–8: register page (single HTML, built by a script that inlines the JSON like `build-hub.mjs`): property setup (country, operating model with BOOK A4 hint, outlets), "Add tool" (pick department → use, or custom → full wizard), condition questions, result card (label, why, confidence, deadline, duties), responsible person, evidence checkboxes (DPIA, staff reps, staff briefing, seven vendor answers, AI notice checked), status.
4. Day 8–10: exports (PDF one-pager per property via jsPDF like ASM; CSV; JSON backup and **import**, which ASM lacks), "not legal advice" + "facts verified on" banner showing ACT `meta.factsVerifiedOn` and the label file date; publish as its own artifact with `db`, `user`, `downloads`, `{artifact:{publish:false}}`, rules `refdata write: owner`.
Out of MVP: multi-property group roll-up, Swiss/UK branches, notifications, readiness scoring.

### Phases after MVP
- Phase 2: group view (pool property lists, BOOK B2 DO 1), filters by label/deadline/department, "what changed since last data version" re-classification report, vendor directory link to CAT `cos`.
- Phase 3: Part D (CH, UK) logic and ACT `nationalLayer` labour rules per property country; readiness checklist per tool from RDY `uc[].chk`; static local-storage edition for HFTP members (option c).
- Phase 4 (post-project, owner needed): hosted multi-tenant app (option e).

### Keeping legal content updatable
- One data file per concern (`ai-act-data.json`, `uc-labels.json`, `register-ref.json`), each with `version`, `factsVerifiedOn`, `changelog[]`; the register stores `refDataVersion` per entry and flags entries classified under an older version (ASM's "Re-score with vN" pattern).
- Every label and duty carries a confidence mark (reuse ACT's five levels) and a booklet/article reference; anything resting on `openItems` shows the interim posture.
- A "not legal advice" banner on every screen and export, plus the date; re-verification against EUR-Lex before external release (ACT `sourceNote`).

### Technical risks
- **Positional ids**: RDY `uc` ids are `<dept>-<n>` with no id in CAT; any catalogue edit can misalign readiness data, labels and stored register entries. Mitigation: freeze an id table and validate on build.
- **Three copies of the catalogue** (CAT, RDY `#cat`, hub iframes) and two of the AI Act data (JSON + EXP embed): drift risk; build from single files.
- **Vocabulary mismatch** between BOOK (5 labels + outside high-risk list) and ACT (4 tiers); wizard has no brand/head-office route and no CH/UK branch.
- **Main-page constraint**: the register cannot save inside the current hub's iframe; it needs its own artifact or the hub must be rebuilt around it (only one tool can be main).
- **Platform data risks**: data erased with the artifact; last-writer-wins; no document history (audit trail must be app-written); 25,000-document cap; 256 KiB per doc; public link disables Editor saving; outside Editors can publish versions; `{self}` privacy is not encryption.
- **Legal drift**: final high-risk guidelines expected by end of 2026 may move several "high-risk if…" rows; the DPF transfer basis is contested (ACT wizard q8 `transfer`).
- **Liability perception**: a tool that outputs "Minimal" for a member's hotel can read as legal advice; wording and disclaimer must say it reflects the uses as described, not named products (BOOK A6 wording).

### Inferences
- The fastest credible demo for the client is a register prefilled with a fictional hotel (as ASM did with "Seeblick Hotels (fictional demo)"), showing F&B (C4) and HR (C1) entries where a condition flips the label.

### Gaps
- Effort estimates are my judgement, not measured.
- Whether `tools/assessment/tests/` and `mock_platform.js` exist in this repo was not verified (the README refers to them, the folder listing shows no `tests/`).
