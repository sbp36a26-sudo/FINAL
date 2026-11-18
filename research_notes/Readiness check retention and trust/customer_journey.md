# Customer journey for the hotel AI readiness check: how a hotel returns across the life of an AI project

*Researcher's notes, 18 Nov 2026. No repository file was changed other than this one.*

**How to read the labels.** **(team file)** = read directly in the repository on 18 Nov 2026. **(secondary)** = web search summary only: the session's network blocked every page fetch (hospitalitynet.org, costar.com, hotelbusiness.com, fieldfisher.com), so no web source below was opened in full. Check each at the original before quoting it in the report. **(inference)** = my reasoning. Most web sources on hotel technology buying are written or sponsored by vendors; this is marked where known.

---

## 1. How do hotels actually go through an AI or technology project, who is involved, and how long does it take?

### Takeaway
The project is a chain of gated decisions held by different people (GM or department head finds the tool, owner or head office releases the money, vendor and IT connect it, staff decide whether it survives the pilot), and the readiness check today serves only one moment of it. Reliable durations for European hotels do not exist: the only figures found are vendor claims and single cases, so the journey must be driven by events (demo booked, contract due, pilot end), not by a fixed calendar.

### Cited Findings

**Before the vendor call**
- Poor knowledge of the solutions on offer is the barrier European hotels name most often: 39% (France 58%). Base: HES-SO 2025, about 1,485 hotels in Austria, France, Germany, Greece, Italy and Switzerland, Jan–Apr 2025, 82% independent, median 31 rooms; number answering each question not stated (team file, secondary) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md); [PhocusWire](https://www.phocuswire.com/european-hotels-show-ai-interest-gaps-remain)
- 60% of hoteliers evaluate only two or three PMS vendors before deciding. Base: HotelTechReport 2026 PMS research, 450 "vetted hotel operators", global; HotelTechReport is a review platform that sells visibility to vendors, and the figure is about PMS, not AI tools (secondary) — [Hospitality Net](https://www.hospitalitynet.org/opinion/4129296/inside-the-hoteliers-pms-shortlist-what-really-drives-buying-decisions-in-2026)
- The same coverage says buyers research on their own first, rely on online reviews and peers, and that 25% rank ease of use as their top criterion, ahead of price and return (same base; secondary) — [Hospitality Net](https://www.hospitalitynet.org/opinion/4129296/inside-the-hoteliers-pms-shortlist-what-really-drives-buying-decisions-in-2026)
- Only 9% of mostly small hotels have a formal strategy that includes AI; 35% test tools case by case. Base: Britz & Schegg 2025, about 79–80 responses from 408 hoteliers, 71% Swiss (team file) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md)

**Who is involved**
- A hotel technology decision "might involve IT, operations, commercial leadership, revenue management, finance, procurement and ownership" (opinion piece by a hotel-tech marketing author, no base; secondary) — [Hospitality Net](https://www.hospitalitynet.org/opinion/4134605/8-ways-hotel-and-travel-tech-providers-lose-deals-even-before-the-first-sales-call)
- Integration is the top purchase criterion for 70% of chains, and only 11% have a dedicated AI budget. Base: h2c 2025, 189 responses from 171 chains, global (team file) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md)
- Meliá reviews each use case from business, technology, risk, cybersecurity and compliance angles and scales nothing without a quantified, validated return (team file, evidence FAC-199-07/-08) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md)
- Accor and IHG run central teams plus local champions (team file, HYB-070-12, SKF-033-06) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md)
- The AI Register already models four operating models (owner-operated, managed, franchised, leased) and three deciders (the hotel, head office or the brand, the owner), and records for each tool who decided and how it arrived, including "came inside a system we already had", "switched on by a vendor update" and "staff started using it themselves" (team file) — [tools/register/data/reference.json](../../tools/register/data/reference.json)

**Owner and brand approval (managed and franchised hotels)**
- Under hotel management agreements the owner usually wants advance approval for non-emergency capital expenditure, material overspend and new material contracts; brand "technology standards" can cover the software and hardware used at the hotel, and changes to brand standards can require technology upgrades (law-firm guidance, UK/international; secondary) — [Fieldfisher, management agreements](https://www.fieldfisher.com/en/services/franchising/franchise-commercial-law-blog/hotel-management-agreements-10-key-points-for-hotel-owners); [Fieldfisher, franchise agreements](https://www.fieldfisher.com/en/insights/hotel-franchise-agreements-10-key-considerations-for-hotel-owners)
- Technology requests are decided in the annual budget round, where they compete with renovation and staffing; one practitioner reports a technology proposal dying at his first annual owner budget meeting (opinion pieces, no base; secondary) — [HotelTechReport](https://hoteltechreport.com/news/lost-in-translation-how-owner-fluency-improves-budget-outcomes); [Hospitality Net](https://www.hospitalitynet.org/opinion/4135155/your-tech-budget-runs-on-a-calendar-your-hotel-doesnt)
- IHG funds major technology through the owner-financed system fund (team file, FAC-272-09) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md)
- Only 24% of respondents say AI has paid for itself, framed as a capex request "no owner would approve". Base: State of Hotel AI, fall 2026, 107 hotel company leaders, global, 33% management companies and 28% owners (team file, secondary) — [research_notes/.../hotel_blockers_and_gates.md](../Hotel%20AI%20readiness%20check%20design/hotel_blockers_and_gates.md); [HOTELS magazine](https://hotelsmag.com/news/hotels-are-using-more-ai-every-day-now-they-need-to-prove-it-pays-off/)

**Pilot, evaluation, rollout**
- More than 90% of hospitality companies pilot AI but only about 30% have embedded it (Nicolas Maynard, Accor; expert estimate, base not given; secondary) — [Skift](https://skift.com/2026/09/28/skift-data-ai-summit-europe-preview-accor-nicolas-maynard/)
- Only 13% of chains report a measurable return. Base: h2c 2026, 122 responses from 113 chains, global, vendor-sponsored (team file) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md)
- Marriott's first room-assignment pilot failed because staff overrode every assignment (team file, SKF-042-02) — [Hospitality.today](https://www.hospitality.today/article/how-marriott-is-using-ai-to-rethink-room-assignments)
- Langham announced three AI agents on 27 Nov 2025, phased across 31 properties; teams monitor stability, guest sentiment, employee use and operations over 90 days with central oversight for drift (outside columnist, Aug 2026; not a Langham statement, no results published; Asia-based group; secondary) — [CoStar](https://www.costar.com/article/386659360/inside-langhams-ai-rollout)
- A trade article for hotel CIOs advises fixing in advance a primary KPI, a margin and a date at which the pilot is shut down, and sizing the pilot so failure is survivable (opinion; secondary) — [Hotel Business](https://hotelbusiness.com/before-you-sign-a-cios-framework-for-evaluating-hotel-ai-pilots/)

**Durations found (all weak)**

| Step | Figure | Base and quality |
|---|---|---|
| Single-property PMS change, kick-off to go-live | 4–6 weeks; staff training 2–4 weeks | One PMS vendor's guide (secondary) — [WebRezPro](https://webrezpro.com/making-the-switch-changing-your-hotels-pms-is-easier-than-you-think/) |
| Basic automation shows results | 30–60 days | Opinion column, unverified (secondary) — [Hospitality Net](https://www.hospitalitynet.org/opinion/4134146/the-keys-to-hotel-revenue-with-ai-theres-no-magic-pill-only-readiness-implementation-and-operations) |
| Dynamic pricing needs live data before recommendations are reliable | about 60–90 days | Same opinion column (secondary) |
| Monitoring window after go-live | 90 days | Langham, via columnist (secondary, above) |
| Group pilot of a guest chat tool | Jul 2025–Sep 2026, over 1 million conversations | Accor (team file, secondary) — [HospitalityTech](https://hospitalitytech.com/what-accor-learned-its-1m-conversation-ai-pilot) |
| Group systems replacement before AI | about 18 months, 25–30 systems, 250 hotels | Strawberry (team file, SKF-017-16) — [hotel_blockers_and_gates.md](../Hotel%20AI%20readiness%20check%20design/hotel_blockers_and_gates.md) |

### Inferences
- Three different paths, one journey shape:

| Stage | Independent | Chain-owned | Managed or franchised |
|---|---|---|---|
| Awareness and shortlist | GM or owner-manager; peers, reviews, PMS vendor's marketplace | Central IT or digital team; department heads raise needs | Brand or management company proposes; GM may raise needs |
| Demo | GM plus the department head who will use it | Central team plus pilot property | Operator's IT plus GM |
| Business case and approval | Owner (often the same person as the GM); monthly subscription | CIO/CFO, in the annual budget | Owner approval for capex and material contracts; brand check against standards; possibly funded by a system fund |
| Contract and data terms | GM signs; nobody reviews data terms unless prompted | Legal, procurement, security review | Unclear who signs and who is the data controller |
| Pilot | Whole hotel is the pilot | One to a few properties, central monitoring | Pilot property chosen with the owner's consent |
| Evaluation and rollout | GM decides to keep or cancel | Central decision, property-by-property rollout | Operator recommends, owner and brand agree |
| Running and review | Nobody, unless a renewal or a rule change forces it | Central governance | Split between brand, operator and owner |

- Many AI tools never pass through this funnel at all: they arrive inside a PMS update or through staff. The register's "origin" field already captures this. The journey therefore needs a second entrance, "we already have it", that starts at the register and works backwards to a readiness check.
- The check's own review found that several must-haves (live integration test, signed data agreement) cannot be true before purchase ([review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md), section 2). That is the strongest argument for a staged journey: the same question has a different honest answer at shortlist, at contract and after the pilot.
- Natural return dates are: the vendor demo, the owner or budget meeting, the contract signature, pilot start, pilot end, contract renewal, and legal dates on the register's watch list.

### Gaps
- No source gives the length of a hotel technology sales cycle, the time from first interest to pilot for AI tools, or pilot length, for European hotels. Every duration above is a vendor claim, an opinion or one case.
- No European evidence on how brands mandate or approve AI tools in franchise agreements (also noted as a gap in the team's own research).
- None of the web sources could be opened; Fieldfisher, CoStar and Hotel Business wording is from search summaries only.
- The team's interviews (Accor, 19 Nov 2026, and the chain and independent guides) are the place to get real stage lengths and approvers. The interview guides must not be extended by me; this is only a note that the answers, if they come up, fill this gap.

---

## 2. What do the team's existing tools already hold, and where does the journey break today?

### Takeaway
The pieces of a lifecycle exist (catalogue to choose, check to assess, register to run, watch list to keep current) and share one use-case id, but they share no hotel, no history and no link. Each tool asks for the hotel again, with different field names, and the check overwrites itself when edited.

### Cited Findings
- The readiness check saves one document per check in the hub's shared database, collection `readiness`, or in the browser when opened outside the hub. Fields: hotel (name, person, role, type, country), tool id and name, answers, proof notes, score, uncapped average, level, area percentages, must-haves not met, submitted and updated dates, rules version (team file) — [tools/readiness-check/src/store.js](../../tools/readiness-check/src/store.js), [check.js](../../tools/readiness-check/src/check.js)
- Rules v2: 18–31 questions per tool; must-have met only with Yes plus a proof note; verdicts "Build foundations first", "Ready to pilot", "Ready to scale"; score capped at 39 or 74 (team file) — [tools/readiness-check/README.md](../../tools/readiness-check/README.md)
- The team view recomputes every saved check under current rules and flags a change from the saved result (team file) — [tools/readiness-check/README.md](../../tools/readiness-check/README.md)
- Editing a check overwrites it: one test hotel went from 98 to 39 and only the 39 remained; there is no record of what changed (team file) — [review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md), section 5
- The check never asks whether a pilot was run, yet can return "Ready to scale" (team file) — [review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md), sections 3–4
- The result has no ordered actions, owners, vendor questions, link to the catalogue or register, or re-check date; the proof notes the hotel typed are not shown again (team file) — [review_result_report.md](../Hotel%20AI%20readiness%20check%20design/review_result_report.md)
- The result review proposes a pilot card pre-filled from the hotel's own proof notes (KPI baseline, owner, budget) and a "Check again" section; it states that day counts per action and "hotels like yours score X" must not be shown because no source supports them (team file) — [review_result_report.md](../Hotel%20AI%20readiness%20check%20design/review_result_report.md), sections 2–3
- The register holds a hotel profile (name, country, operating model, group, staff representatives, outlets, keeper) and per tool: vendor, department, where used, origin, who decided, responsible person, in use since, notes, label answers, items ticked, vendor questions ticked. Saved in the visitor's browser only; exports PDF, CSV and a JSON backup that can be restored (team file) — [tools/register/src/app.js](../../tools/register/src/app.js), [README](../../tools/register/README.md)
- The register's "add a tool" list uses the 91 catalogue use cases plus 17 provisional market uses; the check's picker offers 90 tools. Both use the same ids (for example `gx-2`, `hr-2`, `rm-2`). Ids are positional and the register build fails if the catalogue order changes (team file) — [tools/register/README.md](../../tools/register/README.md); [review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md)
- The watch list has 16 dated, sourced entries, each linked to the tools it affects, with a status (date set, expected, proposal, pending) (team file) — [tools/register/data/radar.json](../../tools/register/data/radar.json)
- The register's label file still awaits sign-off by the D7 owner (team file) — [tools/register/README.md](../../tools/register/README.md)
- D5 (decision framework with go/no-go tool) and D8 (strategic planning framework) are not started as documents (team file) — [docs/PROJECT_CONTEXT.md](../../docs/PROJECT_CONTEXT.md)
- The EU's EDIH digital maturity assessment is designed to be completed three times per substantial service (before, and at follow-ups); it had almost 9,000 SME assessments by Sep 2024 (base: EDIH customers across the EU network) and is tied to a service (team file, secondary) — [existing_readiness_tools.md](../Hotel%20AI%20readiness%20check%20design/existing_readiness_tools.md)

### Inferences
- Field mismatch to resolve before anything is tied together: the check has three hotel types (independent, group, managed or franchised); the register has four operating models (owner-operated, managed, franchised, leased) plus a separate "part of a group" field. Country is a full name in the check and a two-letter code in the register. Neither asks hotel size.
- The check is on a shared database and the register on browser storage. A hotel that clears its browser loses its register; a hotel that returns to the check on another device finds nothing of its own unless it is in the hub.
- The shared tool id is the one existing bridge: a finished check can open the register's "add a tool" form with the same id, and the register can show that tool's latest check.

### Gaps
- I did not open the built catalogue page in a browser; its content is taken from the READMEs and the two reviews.
- Whether the hub database can hold several collections per hotel with access per hotel (rather than one private team space) is a platform question I did not test.

---

## 3. The lifecycle map: stage by stage

### Takeaway
Eight stages, each with its own question, its own reason to come back and one thing on screen that was not there before. Stages 2, 4 and 6 are the same check asked at three moments with different proof; that reuse is what makes returning cheap.

### Cited Findings
The map is a design proposal (inference). The facts it rests on are cited in sections 1 and 2; the specific ones are repeated in the "Evidence" column.

| # | Stage | The user's question | What brings them back | New on screen this time | Existing data or tool | Carried to the next stage | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | **Explore** | Which tool fits a hotel like ours? | A vendor email, a brand note, a peer's story | Uses by department with adoption level, effort (Light/Moderate/Heavy) and AI Act label side by side; "check my readiness for this" on every use | Catalogue (91 uses); register labels; check's effort data | Hotel profile; shortlist of one to three use ids | 39% lack knowledge of solutions (HES-SO 2025, base in section 1); shortlists of two or three (HotelTechReport, secondary) |
| 2 | **Check before buying** | Are we ready, and what do I ask at the demo? | A demo is booked | Verdict, six areas, must-haves; questions for the vendor; a one-page summary for the owner. Must-haves that cannot be true yet are asked as "planned" not "done" | Readiness check v2; register `vendorQuestions` | Check no. 1 (baseline), gap list, proof notes | Pre-purchase must-haves problem ([review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md)) |
| 3 | **Close the gaps** | Who does what before we sign? | Each open action has an owner and a date; the owner or budget meeting is on the calendar | Action list in three groups (before anything else, find out, close during pilot), tick-off, "5 of 9 done" | `gaps()` output, proof examples in `logic.js`; action wording still to be written (34 codes) | Actions with status and dates | Result review, change 1 ([review_result_report.md](../Hotel%20AI%20readiness%20check%20design/review_result_report.md)) |
| 4 | **Re-check before signing or before the pilot** | Have we moved enough to sign? | Contract or pilot start date; all "before anything else" actions ticked | Only changed or open questions are asked again; old answer shown beside each; "since 3 Dec: 3 must-haves closed, Data 40% → 75%"; contract-stage proof (signed data agreement, integration confirmed) | Saved check no. 1; team view's recompute logic | Check no. 2; pilot card | EDIH repeat pattern (team file, secondary) |
| 5 | **Pilot** | Is it working, and when do we stop? | Pilot mid-point and end date set on the card | Pilot card pre-filled from proof notes: KPI, baseline figure and date, target, end date, stop rule, owner; a place to enter the measured value | Proof notes F2, P1, F1, O1; questions F3, F5, T5 | Baseline and result figures (the hotel's own, self-reported) | Stop rule and baseline advice (Hotel Business, secondary); 90-day window (Langham, secondary); Marriott override failure (team file) |
| 6 | **Post-pilot review** | Scale, change or stop? | Pilot end date | Baseline against result against target; did staff use it or override it; did the stop rule trigger; a decision record: scale / extend / stop, with reason. Only here can "Ready to scale" be earned | Check rules; new pilot-result questions (not built); later D5 go/no-go | Decision record; check no. 3 | "Ready to scale" over-claims without a pilot ([review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md)); 13% measure a return (h2c 2026, base in section 1) |
| 7 | **Register and keep duties current** | What must we keep checking, and what has changed in the rules? | A watch-list date approaching; a vendor update; contract renewal; a new member of staff taking over the tool | The tool is added to the register pre-filled (name, vendor, responsible person, department) from the check; "changed since your last visit" on watch-list entries; items due | Register, `radar.json` (16 entries), `items` with dates | Register entry linked to the check history | Register README; origins list (tools that arrive by update) |
| 8 | **Next tool, portfolio, annual review** | What do we own, what did it deliver, what next? | Budget season; owner's annual review; the second tool | One page per hotel: every tool with stage, last verdict, open must-haves, pilot outcome, label, items due. Answers that are about the hotel, not the tool, are offered pre-filled for the next check | All of the above; later D8 planning framework | Hotel-level answers reused | Technology decided in the annual budget round (secondary); 9% of small hotels have a strategy including AI (Britz & Schegg, base in section 1) |

Second entrance: a hotel that already runs a tool (bundled, switched on by an update, started by staff) enters at stage 7 through the register and is offered a "check a tool you already use" route into stage 6.

### Inferences
- **What "progress since last time" needs.** Three things the tools do not store today: an append-only list of checks per hotel and tool (never overwrite), the answer-level difference between two checks, and the rules version of each (already stored). The difference can be computed on the spot from two saved documents.
- **Rules changes must not look like the hotel's change.** The team view already recomputes old checks under current rules. On a return visit, show "your answers changed" and "our rules changed" separately; otherwise a hotel that did nothing sees its score move and stops trusting it.
- **Stage-aware proof.** The same must-have has three honest proofs: before buying ("the vendor confirms an integration with our PMS version"), before the pilot ("signed data agreement dated ..."), after the pilot ("measured result ..."). This removes the review's finding that pre-purchase questions are phrased as post-purchase facts and gives each return visit new questions worth answering.
- **Re-check must be shorter than the first check.** If a return visit costs the same 12–15 minutes (estimate from [review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md), not measured with hotels), few will do it. Ask only open, "Not sure" and stage-changed questions.
- **No invented timings.** Return dates should be the hotel's own dates (demo, signature, pilot end, renewal), entered by the hotel. A suggested default can be offered, labelled as a suggestion; no source supports standard durations.
- **Verdict names follow the stage.** "Ready to pilot" is the most stages 2 and 4 can award. "Ready to scale" belongs to stage 6 only.

### Gaps
- Pilot-result questions, the pilot card layout, example KPIs per tool type and one action line per question code do not exist yet; they are short authored content, not research.
- D5 and D8 do not exist, so stages 6 and 8 can only reserve a place for them.
- Whether hotels will accept entering pilot figures into a student team's tool is untested.

---

## 4. What would a "hotel workspace" look like, and what is the minimum version?

### Takeaway
A workspace is one hotel record that the check, the register and later D5/D8 tools all read, plus a dated list of what happened. The minimum version needs no new tool: one shared profile, checks saved as a history instead of overwritten, and a link in each direction between the check and the register.

### Cited Findings
- Only the hub's main page can use the shared database; the check reaches it through the hub bar's bridge, collection `readiness` (team file) — [tools/readiness-check/src/store.js](../../tools/readiness-check/src/store.js)
- The register states that "a shared, saved version for a team needs the register to be its own claude.ai page with storage switched on; that is the next step" (team file) — [tools/register/README.md](../../tools/register/README.md)
- The hub is private: only people it is shared with can submit or see results; "a separate client-facing version comes later" (team file) — [tools/readiness-check/README.md](../../tools/readiness-check/README.md)
- The check collects a name, role, staff names and budget lines and shares them with the team with no notice before the start (team file) — [review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md), section 4
- The register already has a backup file (JSON) that can be downloaded and restored (team file) — [tools/register/src/app.js](../../tools/register/src/app.js)

### Inferences
**Full picture (later).**

| Part | Content |
|---|---|
| Hotel profile, asked once | Name, country, operating model (the register's four), part of a group, size band, outlets, staff representatives, who keeps the record |
| Portfolio | One row per tool: stage (exploring, checked, closing gaps, pilot, scaled, stopped, in use before any check), last verdict and date, open must-haves, AI Act label, items due, responsible person |
| Timeline | Dated events: check done, action closed, contract signed, pilot started, pilot result, decision, register entry, watch-list change |
| Per tool | Check history with differences, action list, pilot card, decision record, register page |
| Hotel-level answers | Answers that describe the hotel rather than the tool (for example security controls, AI literacy, staff representatives) offered pre-filled in the next check, each with the date it was last confirmed |
| Sharing | A read-only page or PDF for the owner; an export file the hotel keeps |

**Minimum version (four changes, all inside existing tools).**
1. **One profile.** Align the check's hotel fields with the register's (four operating models, country code, group flag) and add size. Store it once; both tools read it.
2. **History, not overwrite.** Each submit or edit of a check writes a new document linked to the previous one (hotel + tool id + sequence). The result page gains one block: "Since your last check on [date]".
3. **Two links.** Result page: "Add this tool to your AI Register" (pre-filled by tool id, vendor, responsible person). Register tool page: "Readiness: last checked [date], [verdict]" and "Check again".
4. **A return key the hotel owns.** Because the public version cannot assume a login, give the hotel a file (extend the register's existing backup to include checks) or a private link that reopens its workspace. State before the start what is saved and who sees it.

**Order of work.** Change 2 first (it is what makes a second visit show something new), then 3, then 1, then 4. A portfolio page (stage 8) is then a read of data that already exists.

**Risks.**
- Positional use-case ids: a re-ordered catalogue would silently attach old checks to the wrong tool. Stable ids are needed before histories are kept.
- Reusing hotel-level answers saves time but can carry a stale "Yes" forward for years; show the date and ask for confirmation at least at the annual review.
- A workspace holds contract dates, budgets and names. The tool asks hotels about lawful basis; it needs its own notice and a way to delete.

### Gaps
- No decision exists yet on where a client-facing version will live or how hotels will be identified; the minimum version above works inside the private hub and with a file, and would need rethinking for a public site.
- I did not test whether one artifact can serve several hotels with data kept apart.

---

## 5. Which moments create value for a second person and so spread or sustain use?

### Takeaway
Use is sustained when the output becomes somebody else's input: the owner's approval page, the vendor's question list, the brand's or consultant's portfolio view, and the team's and HFTP's anonymised findings. Tools that report heavy use are tied to a service or a next step, not offered as a standalone quiz.

### Cited Findings
- Tools with reported heavy use are entry tickets to help: EDIH (almost 9,000 SME assessments by Sep 2024, EU network customers) and Austria's KMU.DIGITAL (over 25,000 funded projects, WKO programme material 2025) (team file, secondary) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md)
- No source reports completion or drop-off rates for any online readiness tool (team file) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md)
- "Copy summary" is the text most likely to be forwarded to the owner and is three lines with no actions; the PDF does not say who answered or that it is self-reported; the typed evidence, "exactly what an owner would want to see", is missing from it (team file) — [review_result_report.md](../Hotel%20AI%20readiness%20check%20design/review_result_report.md); [review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md)
- Owners decide technology spend and proposals should be built for the specific owner (opinion, no base; secondary) — [HotelTechReport](https://hoteltechreport.com/news/lost-in-translation-how-owner-fluency-improves-budget-outcomes)
- The team view has no cross-hotel table of most-failed must-haves, "which is the finding D6 actually needs from this tool" (team file) — [review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md), section 5
- The design report suggests using the check in interviews as a validation step, comparing its verdict with what actually happened (team file) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md)
- Under the AI Act the user of the tool stays answerable even when a management company runs oversight; who the user is differs by operating model (team file; label file not yet signed off by the D7 owner) — [tools/register/data/reference.json](../../tools/register/data/reference.json)

### Inferences

| Second person | Moment | What they receive | Why it brings the first user back |
|---|---|---|---|
| Owner or asset manager | Stage 2–4 (approval), stage 6 (scale decision), stage 8 (annual review) | One page: verdict, what is asked for approval, the hotel's own proof, pilot result against baseline | The owner asks for the updated page at the next meeting |
| Vendor | Stage 2 (demo), stage 4 (contract) | The vendor question list; the integration and data-terms must-haves to confirm in writing | The vendor's answers are needed to close must-haves in the re-check |
| Department head who will run the tool | Stage 3 and 5 | Their actions with dates; the pilot card | They hold the ticks and the pilot figures |
| IT or the PMS vendor | Stage 3 | The "find out" list for questions only they can answer | "Not sure" answers turn into Yes or No |
| Brand or management company | Stage 8, across properties | Same check, several hotels: which must-haves fail where | Head office asks properties to keep it current |
| Consultant or association | Any stage | A structured file to start an engagement from, and to repeat after it | The EDIH pattern: assessment before and after a service |
| Staff representatives, data protection officer | Stage 4 for staff-facing tools | The legal items and what was decided | Their sign-off is a conditional must-have |
| Student team and HFTP | Continuous | Counts across hotels: most-failed must-haves, movement between checks, time between stages, always with the number of hotels shown | Gives D6 its findings, D9 and D10 their material, and later an honest peer comparison |

- The single most valuable shared artefact is the owner page, because approval is the step every path in section 1 has in common.
- A peer comparison is the strongest pull to return but must wait until enough checks exist and must always show its base; the result review already rules out inventing one.

### Gaps
- No evidence was found on whether hotel owners accept self-assessed pages as part of a business case.
- Whether HFTP would host or promote the check to members is a client decision, not a research finding.

---

## 6. What should be measured to know the journey works?

### Takeaway
Measure movement between stages, not visits: the share of hotels that come back for a second check, how many must-haves they closed in between, and how many reach a recorded pilot decision. Every figure must be shown with the number of hotels behind it, and none of this can be measured until checks are kept as a history.

### Cited Findings
- Saved checks already carry submitted and updated dates, the rules version, the list of must-haves not met, the level and the uncapped average (team file) — [tools/readiness-check/src/check.js](../../tools/readiness-check/src/check.js)
- Editing overwrites the previous state, so change between two checks cannot be measured today (team file) — [review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md)
- The team view shows no count of "Not sure", no flag for one-character proofs and no cross-hotel view (team file) — [review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md)
- No hotel has used the check yet; the review recommends a test with 5 to 8 hotels before members see it (team file) — [review_user_journey.md](../Hotel%20AI%20readiness%20check%20design/review_user_journey.md), section 7
- No published tool reports completion rates, so there is no outside benchmark for any of these measures (team file) — [reports/Hotel AI readiness check design.md](../../reports/Hotel%20AI%20readiness%20check%20design.md)

### Inferences

| Question | Measure | Needs |
|---|---|---|
| Do they finish? | Started checks that reach a result; step where the others stop | A record when a check is started (today only the result is saved) |
| Do they come back? | Hotels with a second check on the same tool; hotels checking a second tool | History per hotel and tool |
| Does anything improve? | Must-haves closed between checks; "Not sure" answers turned into Yes or No; areas that crossed 40% or 75% | Answer-level difference |
| Is the improvement real? | Share of must-haves with a meaningful proof note; share of returns where only answers changed with no new proof | Proof length and change flags |
| Do they act? | Actions ticked with a date; share of "before anything else" actions closed | Action list with status |
| Do they reach a pilot? | Hotels with a pilot card; days from first check to pilot start (the hotel's own dates) | Pilot card dates |
| Do pilots end in a decision? | Pilot cards with a recorded result and a scale / extend / stop decision; share stopped | Decision record |
| Does the verdict mean anything? | Do hotels judged "Ready to pilot" finish their pilots more often than those that went ahead on "Build foundations first"? | Stages 2 and 6 for the same tool |
| Does it reach a second person? | Owner pages downloaded or shared; vendor question lists exported | Export counts |
| Does the loop close? | Checked tools that end up in the register; register tools with a check; hotels returning after a watch-list change | The two links from section 4 |

- With 5 to 8 test hotels these are case observations, not rates. Report them as "3 of 6 hotels", never as percentages.
- "Share stopped" is a success measure, not a failure: a stop rule that triggers is the check working.
- The verdict-against-outcome comparison is the only measure that tests the tool's central claim, and the team's interviews are the first chance to collect it informally.
- Measuring across hotels requires the notice and consent the review found missing.

### Gaps
- No target values can be set: there is no benchmark for return rates of self-assessment tools, in hospitality or elsewhere.
- Outcome measures depend on self-reported pilot figures, which carry the same optimism risk the design report documents for self-assessment in general.
- Time-to-pilot will reflect budget seasons and vendor lead times as much as the tool; it should be read alongside the hotel type and the tool's effort level.
