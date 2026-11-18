# Readiness check: what makes it worth returning to, and what the current platform can build

*Researcher's notes, 18 Nov 2026. No repository file was changed except this one.*

**How to read the sources**

- **[local]** = read in full in this repository or in the platform's type files. Line numbers are approximate (counted from a combined read), file names are exact.
- **[secondary]** = seen only as a web-search summary. The three pages I tried to open in full (hospitalitynet.org, hotelsmag.com, european-digital-innovation-hubs.ec.europa.eu) could not be reached from this session: the hosts are outside the session's allowed network domains. Every web figure below must be checked at the original before it is printed in a deliverable.
- Platform files: `/tmp/claude-0/bundled-skills/2.1.326/6af6cbf41a6792a5125c3f87fffe6a7e/artifact-capabilities/0.2.96/` (shortened to `0.2.96/` below). The hub artifact runs this contract version (0.2.96), as reported by the capabilities skill in this session.

---

## A1. What GMs, owners/asset managers and CIOs need in order to decide on an AI tool, and in what format

### Takeaway
The decision document that matters is an owner-facing request: what is asked for, what it costs by type, which KPI it moves from which baseline, what the risks are, and who signed off. Today's check produces a scorecard and none of these. The project's own review already found that the most forwardable outputs (owner page, action plan, vendor questions, pilot card) can be built mostly from data the check already holds.

### Cited Findings

**From the project's own material**

- After reading today's result an owner still does not know "What am I being asked to approve or pay for?", and a GM does not know what to do on Monday, how long until a pilot, what to ask the vendor, or what a pilot is. [local: `/home/user/final/research_notes/Hotel AI readiness check design/review_result_report.md`, section 1, "What a GM or owner still does not know", lines 37–49]
- The hotel's typed proof notes (owner name, budget line, KPI baseline) never reach the result, the PDF or the copied summary; the review calls them "the most valuable content in the session" and "exactly what an owner would want to see". [local: same file, weakness 2, line 25; `review_user_journey.md` line 134]
- Proposed PDF: page 1 is an owner summary that "must stand alone because it is the page that gets forwarded": verdict, score and why, six bars, the three decisions or approvals needed, re-check date, who answered, "self-reported". Then action plan, area diagnosis, legal flags and vendor questions, pilot card. [local: `review_result_report.md` section 4, lines 124–134]
- "Copy summary" should become a short email to the owner (verdict, why, three actions with owners, what approval is needed); the action list should export as CSV; pilot card and vendor questions deserve a one-page print each "because they are used in different meetings". [local: same file, lines 136–141]
- What must not be invented: cost in euros per tool, return or payback, days per action, "hotels like yours score X", a probability of success, a compliance verdict. [local: same file, section 3, lines 98–108]
- Managed and franchised hotels add a three-way decision and funding path (owner, brand, operator). The check's plan O1 "needs owner sign-off in managed/franchised hotels"; F1 should accept "funded via system fund or brand programme"; D5 should say who signs the data agreement. Evidence on this is "thin and mostly US-based". [local: `/home/user/final/reports/Hotel AI readiness check design.md` lines 63, 117–119; `research_notes/Hotel AI readiness check design/hotel_blockers_and_gates.md` lines 289, 313–314]
- Only 24% of hotel company leaders say their AI investment has paid for itself, framed in the trade press as a capex request "no owner would approve". Base: State of Hotel AI 2026, 107 hotel company leaders, Aug–Sep 2026, global; respondents led by management companies (33%) and owners or investors (28%). [local: `hotel_blockers_and_gates.md` lines 113, 309; secondary there via [HOTELS magazine](https://hotelsmag.com/news/hotels-are-using-more-ai-every-day-now-they-need-to-prove-it-pays-off/)]
- 13% of chains report a measurable return; 58% track AI ROI and only 27% of those do so consistently; 11% have a dedicated AI budget. Base: h2c studies, 113 chains (2026) and 171 chains (2025), global, vendor-sponsored. [local: `Hotel AI readiness check design.md` line 48; `hotel_blockers_and_gates.md` lines 100–101, 202]
- European chains rank ease of integration (79%) above ROI potential (58%) as an investment criterion. Base: h2c 2025 European subset, as reported in an op-ed. [local: `hotel_blockers_and_gates.md` line 109; secondary there via [Hospitality Net](https://www.hospitalitynet.org/opinion/4132652/ai-in-hospitality-the-confidence-gap)]
- Owners rank technology behind staffing, property improvements and sales and marketing: 19% prioritise technology in 2026, and owners want more guidance from brands. Base: Wyndham Owner Trends 2026, 325 owners and developers in the US, Canada and the Caribbean, Nov–Dec 2025; not European. [local: `hotel_blockers_and_gates.md` lines 124, 308; secondary there via [Hospitality Net](https://www.hospitalitynet.org/news/4130597.html)]

**From hospitality management sources (all secondary, search summaries only)**

- A capital-request review should include strategy and risk in the justification, give the requester feedback so the request can be revised, and flag disagreements without itself recommending approval or rejection. — [Hospitality Net, "A Common Sense Review Process for Capital Investments"](https://www.hospitalitynet.org/opinion/4042286/a-common-sense-review-process-for-capital-investments) (secondary; author and date not confirmed)
- Delegation of authority decides capex approval; an authority matrix should match approval rights to the owner's vision. — [CBRE, "Opportunity cost: transforming capex investment into asset value"](https://www.cbre.com/insights/articles/opportunity-cost-transforming-capex-investment-into-asset-value) (secondary)
- Owners should first match a capital project to the asset's investment strategy (hold, renovate, sell, refinance). — [CoStar, "What hotel owners need to know about ROI projects"](https://www.costar.com/article/729680319/what-hotel-owners-need-to-know-about-roi-projects) (secondary)
- Day-to-day technology costs sit in the Information and Telecommunications Systems department of the Uniform System of Accounts for the Lodging Industry (USALI); CBRE reports this department had above-average cost growth in 2024 (base and percentage not seen). — [CBRE, "Monitoring the rise in technology expenditures"](https://www.cbre.com/insights/articles/monitoring-the-rise-in-technology-expenditures) (secondary)
- The asset manager reviews results against budget monthly, discusses significant variances with the management company, and reports to ownership in writing monthly, quarterly and annually; approval of the annual budget and capex plan is part of the role. — [HVS, "Asset Management Scope and Compensation: A Wide Spectrum"](https://www.hvs.com/article/1704-asset-management-scope-and-compensation-a-wide-spectrum) (secondary)
- Trade commentary states the approval problem directly: technology ROI timelines "don't align with traditional CapEx approval processes". Vendor-style blog; its ROI figures are unverified and are not repeated here. — [WorldVue](https://www.worldvue.com/?p=19397) (secondary, weak source)
- Vendor vetting advice in the trade press: check that the product follows HTNG standards and raise security at the demo stage; use both quantitative and qualitative evaluation; a demo usually runs on clean pre-loaded data that does not look like a live hotel. — [CoStar, "How hoteliers can vet their technology vendors"](https://www.costar.com/article/459553560/how-hoteliers-can-vet-their-technology-vendors); [CoStar, "The basics of system selection"](https://www.costar.com/article/1962953767/the-basics-of-system-selection); [Hospitality Net, "Two Tools That Turn an RMS Evaluation Into a Final Decision"](https://www.hospitalitynet.org/opinion/4132981/two-tools-that-turn-an-rms-evaluation-into-a-final-decision) (all secondary)
- A loosely defined RFP performs worse than a well-defined one, and RFP wording can lean toward one vendor. — [Hotel Tech Report, RFP guide](https://hoteltechreport.com/news/rfp-guide) (secondary; an interested party, it sells vendor leads)

### Inferences
- The decision needs differ by role, and the check already holds the raw material for each:
  - **Owner / asset manager:** a one-page request in the capex/opex frame they already work in: what is asked, cost *type* (subscription = operating cost in the USALI technology department; integration or hardware = capital), the KPI and its baseline, risks, who approved. This fits their monthly/annual reporting rhythm (HVS).
  - **GM:** the action plan (who, what, proof of done) and the pilot card.
  - **CIO / IT:** vendor questions with the vendor's answers recorded, integration and data terms, AI Act label and items to check.
- Because no source gives cost or return per use case, the business case must be a **template the hotel fills with its own numbers** (subscription quote, baseline, target), never a calculated ROI. The check can pre-fill it from the proof notes (F1, F2, P1, O1).
- The strongest "owner" artefact is therefore an **owner memo**: page 1 of the proposed PDF plus an approval block. In managed and franchised hotels it is also the proof for must-have O1 (owner sign-off), which gives the hotel a direct reason to produce it.
- Capex reviews allow the requester to revise and resubmit (Hospitality Net). A check that can be reopened, corrected and re-issued as "version 2 of the request" matches that process better than a one-off score.

### Gaps
- No template for an owner memo, capex request or technology business case from HFTP, HOTREC, AHLA/HTNG, HAMA or a hotel brand was found. The search found no HFTP or HTNG vendor-selection checklist either.
- No source on approval thresholds in European hotel management agreements, or on how AI spend is split between owner, brand and operator in Europe (already a gap in `hotel_blockers_and_gates.md` lines 318–319).
- Not verified at source: every web item in this section. The exact USALI text (current edition) was not read.
- No evidence was found on which report formats hotel decision-makers *actually reuse*. The format recommendations rest on the project's own expert review and on general asset-management practice, not on user data. The planned interviews are the place to test this (without adding questions to the team's guides: use the existing topics and the pilot itself).

---

## A2. Which recurring artefacts would give a reason to return

### Takeaway
A hotel returns when the tool holds something it needs again: its own record that changes over time. The best candidates are a living action plan, a per-tool file that joins readiness, AI Act label, vendor answers and pilot result, and a dated re-check with "change since last time". The only external precedent found for re-checks is the EU's digital maturity assessment, which is repeated because a service requires it, not because users choose to.

### Cited Findings
- The EU Digital Maturity Assessment for SMEs (JRC, used by the European Digital Innovation Hubs) is repeated on a fixed schedule: T1 one year after T0 (or once the hub's support has ended), T2 two years after T1; the hub portal keeps each SME's assessments in one place. — [JRC presentation, 16 Feb 2023](https://european-digital-innovation-hubs.ec.europa.eu/system/files/2023-02/dma_tool_16.02.2023_presentation.pdf) (secondary)
- No aggregated before-and-after (T0 to T1) results were found in that search, so whether repetition shows progress is unconfirmed. — same search (secondary)
- The project's design report draws the same lesson: "Uptake follows a service, and no tool publishes completion rates"; uptake is tied to a next step (EDIH, KMU.DIGITAL); "saving and re-running is the EDIH pattern to aim for in v2+". [local: `reports/Hotel AI readiness check design.md` lines 13, 127, 150]
- The design report's change 20 already asks for "a date to re-run after the pilot" in the result. [local: same file, line 127]
- The review proposes a "Check again" section: suggested re-check date, the three things that will move the score most, and later "show change since last check"; the team page already recomputes saved checks under current rules and flags changes. [local: `review_result_report.md` line 68; `tools/readiness-check/README.md` line 8]
- The AI Register already holds, per tool: label, role, responsible person, items to check by date, vendor questions, a watch list of rules still moving, and PDF/CSV/JSON export. It saves in the visitor's browser only. [local: `/home/user/final/tools/register/README.md` lines 13–22]
- The readiness check and the register use the same use-case ids, so a legal flag can be joined to a readiness result. [local: `review_result_report.md` line 65]
- Benchmarks: "Hotels like yours score X" must not be shown; "it becomes possible only from saved checks, and only with the number of checks shown". [local: `review_result_report.md` line 103]
- Comparing tools was put out of scope for v1 of the check. [local: `reports/Hotel AI readiness check design.md` line 150]
- AI Act duties have dates and the register lists "what is still moving". [local: `tools/register/README.md` lines 3, 18]

### Inferences
Ranked by value to the hotel against build effort (my judgement, built from the findings above):

| Artefact | Why it brings the hotel back | Trigger to return | Data needed |
|---|---|---|---|
| **Living action plan** (tick, owner, date, proof of done) | It is the hotel's own to-do list; ticking an item with proof can flip a must-have and move the verdict | Each completed action; weekly management meeting | Saved check + status per action |
| **Re-check with "since last time"** | Shows progress to the owner; answers "did the work pay off" | End of the 30-day items; pilot end; before contract signature | At least two saved checks for the same hotel and tool |
| **Per-tool file** (readiness + AI Act label and items + vendor answers + pilot card and result) | One place for everything about one tool; the register's dated items and the pilot's stop date are natural deadlines | Vendor replies; pilot milestones; AI Act dates; rule changes on the watch list | Join by use-case id; vendor answers typed by the hotel |
| **Owner memo / annual AI review** | Fits the owner's monthly and annual reporting cycle (HVS, secondary); for managed hotels it is the O1 proof | Budget season; owner meeting | Portfolio of the hotel's tool files |
| **Two-tool or two-vendor comparison** | A real purchase decision | Shortlist stage | Two saved checks side by side; same questions asked of each vendor |
| **Portfolio view across tools** | For groups and for hotels with several tools; equals the AI register | New tool added | All saved checks + register entries |
| **Shareable one-page status** | The page that gets forwarded | After each change | Current state only |
| **Benchmark** | Curiosity, weakest pull, and not yet permitted by the evidence | Only when enough checks exist, with n shown | Many consented checks |

- A rule change is also a return trigger: the team page already detects that a saved result differs under current rules. Telling the hotel "the rules changed, your verdict moved" is honest and useful.
- The readiness check and the register are two halves of the same per-tool file. Merging their saved state is the single change that turns two prototypes into something with a reason to exist after the first visit.
- Pilot results are the missing data type. A pilot card with baseline, target, stop date and then the measured result closes the loop, and is also the evidence the team and HFTP most lack (13% of chains with a measurable return, h2c 2026, base above).

### Gaps
- No evidence on return rates of any readiness self-check, in hospitality or elsewhere (the design report found none either). The ranking above is a hypothesis to test in the pilot.
- No EDIH T0-to-T1 outcome data found.
- Whether hotels would type vendor answers and pilot results into a third-party tool is untested.

---

## A3. What HFTP and the student team would gain, and what data that needs, with consent

### Takeaway
HFTP gains a member tool with a reason for repeat contact and, if hotels agree, anonymised counts of where hotels are stuck, which is direct material for D9 and D10. The team gains validation of its thresholds and questions and a structured record to bring to interviews. Both depend on a notice and consent step the prototype does not have today.

### Cited Findings
- HFTP's stated aims for the project include helping members "judge their readiness and resource needs"; deliverables D9 (Insight Series) and D10 (engagement content: presentations, conference topics, panel themes, talking points) need material for HFTP channels. [local: `/home/user/final/docs/PROJECT_CONTEXT.md` section 2]
- No public, scored AI-readiness self-assessment from HFTP, HOTREC, AHLA/HTNG or a national tourism body was found; none of ten known readiness tools scores per use case. [local: `reports/Hotel AI readiness check design.md` lines 3, 23]
- The 40% and 75% thresholds are a team proposal, to be tested with hotels; 56 of 91 use cases have no evidence id and rest on team judgement. [local: `review_result_report.md` lines 34, 60]
- Self-assessments run optimistic; this is why the check asks for proof. [local: `reports/Hotel AI readiness check design.md` line 17]
- Privacy fault today: the check collects a name, role, staff names, budget lines and contract details and saves them to the team's shared database "with no notice before they start" and "no consent line"; "A CIO will see that before anything else, in a tool that asks about lawful basis". Proposed fix: a short notice before the start and a role instead of a name for P1. [local: `research_notes/Hotel AI readiness check design/review_user_journey.md` lines 46, 108, 154, 237]
- What is saved per check: hotel (name, person, role, type, country), tool id and name, all answers, all proof notes, score, raw score, level, area percentages, unmet must-haves, timestamps. [local: `/home/user/final/tools/readiness-check/src/check.js` lines 19 and 120]
- The interview with Accor is on 19 Nov 2026 and permission to quote is still open; the team runs interviews in pairs. [local: `docs/PROJECT_CONTEXT.md` sections 3a, 3c]

### Inferences
- **HFTP gains:** (1) a tool no hospitality body offers; (2) repeat contact with members if the return mechanisms work; (3) aggregate insight for D9/D10 such as "the must-have most often missing", "share of answers that are Not sure, by area", "which tools hotels check most", "share reaching Ready to pilot", each printed with n and the note "self-selected, self-reported"; (4) conference material: a live check on stage or a panel on the most common gap.
- **Team gains:** (1) test of thresholds: do 40%/75% separate hotels the interviewer judges ready from those not ready; (2) question quality: high "Not sure" or "Does not apply" rates flag bad questions; (3) interview evidence: a filled check gives a structured record to discuss, without adding questions to the guides; (4) coverage for the 56 use cases without evidence; (5) a first reference group for a later benchmark.
- **Minimum data for the aggregate (no personal data needed):** tool id, hotel type, country, size band, answers by question code, score, level, unmet codes, rules version, month. **Not needed and best left out of any shared copy:** hotel name, person, role, free-text proof notes (they contain staff names and budget figures).
- **Consent design that fits the platform (see B):** keep the full record with the hotel (private store or file); offer a separate, optional "share an anonymised copy with the EHL team and HFTP" tick that writes only the minimum fields; state who sees it, for what, how long, and how to withdraw; show n whenever an aggregate is printed.
- A small-numbers rule is needed: with few checks per country and tool, a hotel can be recognised from "type + country + tool". Publish only cells above a floor; the floor is the team's and HFTP's decision.

### Gaps
- No source on member-engagement effects of association self-assessment tools was found. HFTP's engagement gain is a hypothesis.
- Who is the data controller for a hotel-facing version (EHL team, HFTP, or the hotel only) is undecided and is a legal question, not answered here.
- HFTP's own view on holding member data is unknown; it should be asked in the weekly client meeting.

---

## B1. Exactly what the current set-up can and cannot do

### Takeaway
The hub is a private claude.ai artifact with a shared database, viewer identity and file downloads, reached from the tool tabs through a postMessage bridge. It can store per-person private history and shared team data for people in the owner's Claude organisation at Contributor level or above. For anyone outside it (which is every hotel), the page can show but not save to the database, and the page cannot send email, notifications or calendar files at all.

### Cited Findings

**Set-up today**

- The hub is one artifact (https://claude.ai/artifact/MWMGc2VKc6zniRn8um27eH). Its main page is the AI Assessment tool with a hub bar; other tools open as iframes. "The Assessment Tool has to be the main page because saving only works on an artifact's main page." [local: `/home/user/final/tools/README.md` lines 12, 25]
- Declared capabilities of the hub: `{"db":{"rules":[{"path":"frameworks","read":"view","write":"owner"}]},"user":{"scopes":["profile"]},"downloads":{}}`. [local: `/home/user/final/tools/assessment/README.md` lines 118–122]
- The readiness check saves through the bridge to collection `readiness`; outside the hub it falls back to `localStorage` key `hftp-readiness-checks-v1`. [local: `/home/user/final/tools/readiness-check/src/store.js` lines 2–4, 7, 17–25, 44–48; `tools/readiness-check/README.md` line 10]
- The bridge accepts only collection `readiness` (`/^readiness$/`) and three operations: `list` (returns every document in the collection), `set`, `delete`. It checks the message comes from one of its own frames and the same origin. It does not pass the viewer's id, does not expose `get`, `update`, queries, subcollections or `onSnapshot`. [local: `/home/user/final/tools/hub/hub-bar.html` lines 75–91]
- Download bridge: a tab posts `{hub:'download', filename, data}` and the hub page calls `downloads.save`; a `ping` tells the tab whether downloads are available. [local: `tools/hub/hub-bar.html` lines 67, 93–98] The check falls back to a normal `<a download>` link when the bridge is absent. [local: `tools/readiness-check/src/check.js` line 141]
- A draft of the check in progress is kept in the browser (`localStorage` key `hftp-readiness-draft-v1`). [local: `check.js` lines 10, 20–21]
- Outputs today: PDF built with jsPDF, and "Copy summary" through `navigator.clipboard` (with a "Copying is blocked here" fallback). [local: `check.js` lines 154, 204–205]
- The register saves in the visitor's browser only and offers PDF, CSV and JSON backup with restore. "A shared, saved version for a team needs the register to be its own claude.ai page with storage switched on." [local: `tools/register/README.md` lines 20, 22]
- "Prototype: the hub is private, so only people it is shared with can submit or see results. A separate client-facing version comes later." [local: `tools/readiness-check/README.md` line 28]

**Identity (`user` capability)**

- With no declaration: `isOwner()`, `canEdit()`, `can(name)`. With `user: {}`: an opaque `id` (`u_...`). With scope `profile`: display name, avatar, `search()`. With scope `email`: the viewer's email, only if the viewer's organisation also allows it. Reads never reject; unavailable values come back as `""` or `null`. [local: `0.2.96/user.d.ts` lines 11–33, 118]
- The id is issued within one scope, "today the organization that owns the artifact", is stable there, and is the same for a member or an invited guest; `null` means no identity (signed out, a guest the platform gives none, or capability undeclared). [local: `user.d.ts` lines 100–105, 126–142]
- `canEdit()` = admin level (Editor or Owner in the share menu). `can("data.write")` = may write shared documents; it resolves `null` for, among others, "a viewer from outside the organization", and null is not "cannot". [local: `user.d.ts` lines 48–86]
- Store only ids, never names or emails. [local: `user.d.ts` lines 36–39]
- The hub already declares `user` with scope `profile` but not `email`. [local: `tools/assessment/README.md` line 121]

**Storage (`db` capability): who can read and write**

- Writers: "Only the owner can write, plus anyone invited by email as an editor (where the share menu offers that level, and only while the artifact is not also shared by a public link), plus, on a plan with other members (such as Team or Enterprise), the members who can open the artifact, unless their sharing level is view-only". "Anyone else is an outside viewer: they never write, and read shared data only when signed in, through a public link or an email invitation." [local: `0.2.96/db.d.ts` lines 10–17]
- Defaults: everyone admitted reads shared documents; `interact` (Contributor) and above write them; each viewer's own `data/users/<id>/` subtree is private. Root default is read `view`, write `interact`. [local: `db.d.ts` lines 19–21, 39–40]
- "Viewer and Commenter hold `view`, as does every signed-in visitor from outside the organization, by public link or email invitation, except the outside Editor". A person at Commenter "writes no data, their own `data/users/<id>/` subtree included. A signed-out visitor has no data at all." [local: `db.d.ts` lines 142–150]
- `data/users/<id>/` is private per viewer "including from the artifact's owner"; another viewer's documents there read as non-existent; a `null` id means no private subtree ("disable the per-viewer feature for that visit rather than relocating its data to a shared path"). [local: `db.d.ts` lines 275–299]
- Rules are per path with minimum levels `view` < `interact` < `admin` < `owner`, plus `self`; at most 64 rules; fixed at publish. Pattern "each writes only their own, Editors and the owner read them all": `{path:"x", read:"admin", write:"self"}, {path:"x/{self}", ...}`. [local: `db.d.ts` lines 22–41, 89–124, 298–299]
- "`self` is a rule, not encryption": the owner or any Editor can later publish looser rules or other code and read stored documents, and "nobody is told". [local: `db.d.ts` lines 112–118]
- Limits: a document is a JSON object of at most 256 KiB and 32 levels; at most 25,000 documents per artifact database; queries scan without indexes, so keep queried collections to "hundreds to low thousands"; at most 1,000 documents per query limit; 64 live subscriptions per view; writes are last-writer-wins with no transactions. [local: `db.d.ts` lines 191–203, 395–396, 487–506, 547–556] The team's own note gives the same figures. [local: `tools/assessment/README.md` line 126]
- Data survives reloads and republishes and is erased when the artifact is deleted. [local: `db.d.ts` lines 5–8]
- Claude sessions can read and write the artifact's database as the person (the `ArtifactData` tool: get, list, query, set, update, delete, batch). [local: this session's tool description and the capabilities skill at `/tmp/claude-0/bundled-skills/2.1.327/d2e7e91785af9a695d8e9e7d5a546ff1/artifact-capabilities` (SKILL text)]

**Downloads**

- `downloads.save({filename, data})` shows the viewer a confirmation; the file is saved only if they accept. Allowed extensions: `gif png jpg jpeg webp mp4 webm mov txt json md` and `docx pptx epub csv ttf html svg pdf xlsx zip fig`. Any other extension rejects `rejected_extension`. No size limit for ordinary saves (200 MiB in the Android app). [local: `0.2.96/downloads.d.ts` lines 1–8, 20–36]
- **`.ics` is not on the allowlist**, so a calendar file cannot be saved through the downloads capability. [local: `downloads.d.ts` lines 20–22]

**Email, notifications, calendar**

- The complete capability roster for this account is: `artifact`, `assets`, `comments`, `db`, `dictation`, `downloads`, `files`, `mcp`, `room`, `sample`, `self`, `tts`, `user`, plus built-in `permissions`. "Anything not listed is unavailable to this user." None sends email, push notifications or scheduled messages. [local: capabilities skill text, path above]
- `mcp` lets a page call the *viewer's own* claude.ai connectors (for example the viewer's Gmail or Google Calendar) with the viewer's consent and credentials; "outside viewers get `null`". [local: `0.2.96/mcp.d.ts` lines 1–14; capabilities skill text]
- A page can create a new Claude Doc owned by the viewer (markdown under 32 KB, no images) through `mcp`, on the viewer's click and approval. [local: `mcp.d.ts` lines 16–50]
- `sample` asks Claude from the page on "the viewer's own Claude account" and spends the viewer's usage; first call asks consent. [local: `0.2.96/sample.d.ts` lines 1–4, 46–49]
- `room` (live presence) admits only signed-in members and invited guests; a viewer "signed out, or here by a public link" cannot connect; nothing persists. [local: `0.2.96/room.d.ts` lines 51–60]
- Team-side only: this Claude Code account has scheduled tasks and a Gmail connector (tool list of this session), and the project already runs weekday-morning review agents. [local: `docs/PROJECT_CONTEXT.md` section 5]

**Where capabilities work**

- Inside a claude.ai viewer the page is framed and `window.claude.use` works. "Served top-level by the platform, as its own page on the artifact's own host ... every `use()` resolves `null` there for now"; any other copy (a saved file, another host) has no `window.claude`. Framed by a host that never answers, `use()` resolves `null` after 10 s. [local: `0.2.96/claude.d.ts` lines 16–29]
- Browser storage: each artifact has its own origin; `localStorage` survives republishes to the same URL, never reaches other viewers, devices or Claude, and can be empty or throw in private windows or when site data is blocked. [local: Artifact tool description in this session, "Browser storage"]

### Inferences
- **Privacy fault in the current rules.** The hub declares a rule only for `frameworks`. The `readiness` collection therefore inherits the root default (read `view`, write `interact`): every person the hub is shared with, at any level, can read every hotel's check including proof notes, and every Contributor can overwrite or delete any check. The bridge's `list` returns all of them to any tab. This is acceptable for a team-only hub and wrong the moment a hotel is given access.
- **Hotels cannot save to the database in practice.** A hotel contact is outside the owner's Claude organisation. By public link or email invitation they hold `view`: no shared writes, no private subtree. The only route to write is an email invitation as Editor with no public link, which gives them `admin`: they could then read all shared data and publish page versions. That is not a client-facing design. For hotels, saving means **browser storage plus file export and re-import**.
- **A claude.ai sign-in is needed for any database access.** A signed-out visitor "has no data at all"; outside viewers read shared data "only when signed in". Whether a signed-out visitor can open the page at all through a public link is not stated in the type files; what is stated is that the database, room and connectors give them nothing.
- **No email or push from the page.** A reminder cannot be sent by the tool itself. The two exceptions are narrow: (a) a viewer who is in the organisation and has their own Gmail/Calendar connector could approve a call through `mcp` (team members only); (b) the team's own Claude Code scheduled tasks could read due dates from the database and email from a team member's Gmail. Route (b) is a manual-style pilot workaround under the team's name, needs each hotel's address and consent, and is not a product feature.
- **`mailto:` links.** Nothing in the type files documents how `mailto:` or external links behave inside the artifact frame. Treat `mailto:` as unreliable (sandboxed frames commonly block it) and keep "Copy summary / copy email text" as the dependable route; it already has a blocked-clipboard fallback.
- **Calendar reminder without `.ics`.** Not possible through `downloads`. Options: show the re-check date as text to copy; or offer a web "add to calendar" link (Google Calendar or Outlook web URL with the date pre-filled), which depends on external links opening from the frame and is untested; outside claude.ai (the `<a download>` fallback path) an `.ics` blob would work, but that is not where hotels would use the hub.
- **The "main page only" constraint** is the team's own finding, consistent with the type file (the capability host answers the framed main page; a nested iframe has no host). It means every new stored feature for a tab needs a bridge operation in `hub-bar.html`, or the tool must become its own artifact with its own declaration.
- **Record size is not a constraint.** One check (hotel block, up to 31 answers and proof notes) is a few KiB against 256 KiB; 25,000 documents is far above any pilot. A per-tool file with history can still be one document if history is kept as a short array; avoid one document per event.
- **Private per-user data is invisible to the team by design.** If team members' or members' checks are stored under `data/users/<id>/`, the team page cannot list them. Anything the team or HFTP should see must be a deliberate second write to a shared, rule-protected path (the consented, anonymised copy).

### Gaps
- Not tested in a browser: any of the behaviours above. All statements are read from type definitions and source code, not from a running page.
- Not stated in the files read: whether a public-link visitor without a Claude account can view the page; how `mailto:`, `window.open`, external links and `window.print()` behave in the frame; whether `navigator.clipboard` works for all viewers (the code already handles failure).
- Whether the owner's Claude plan has other members (Team/Enterprise). On a single-person plan, "members who can open the artifact" does not apply, and teammates on separate accounts are outside viewers unless invited as Editors. `docs/PROJECT_CONTEXT.md` does not say which plan is used; the team should confirm how teammates currently write to the hub.
- Whether the organisation allows the `email` scope.
- `artifact.d.ts`, `sample.d.ts`, `room.d.ts` and `mcp.d.ts` were read at header level and by keyword search, not line by line.

---

## B2. Which return mechanisms are feasible now, which need a separate client-facing artifact, and which need a hosted app

### Takeaway
Everything that works on "the hotel's own record in its own browser, plus files" can be built now with no new infrastructure. Per-person cloud history and a team view work only for people inside the owner's Claude organisation. Email reminders, accounts for hotel staff and HFTP member login need a real hosted application.

### Cited Findings
- All platform facts used in this section are cited in B1. Additional ones:
- The register already implements JSON backup and restore, CSV and PDF export in the browser. [local: `tools/register/README.md` lines 19–20; `tools/register/src/app.js` lines 529–530]
- The team page already recomputes a saved check under current rules and flags a change. [local: `tools/readiness-check/README.md` line 8]
- Allowed download types include `pdf`, `csv`, `json`, `docx`, `xlsx`, `html`, `md`, `zip`. [local: `0.2.96/downloads.d.ts` lines 20–22]

### Inferences

**Feasible now (no new infrastructure; changes inside `tools/readiness-check/`, plus small bridge additions in `tools/hub/hub-bar.html`)**

| Mechanism | How | Works for |
|---|---|---|
| History of checks in this browser, with "compare to last" | Keep every finished check in `localStorage` (the fallback store already does this); match by hotel + tool id; show score, verdict, areas and must-haves then and now | Anyone, on the same browser and device |
| Action plan with ticks, owner, date, proof of done | Status per question code stored with the check; a tick with proof can re-run `evaluate` | Anyone (browser); cloud for org members |
| Resume and edit a check | Already there (draft key); add "open a saved check" | Anyone |
| Export and re-import the hotel's file (JSON) | Same pattern as the register's backup/restore; `json` is an allowed download | Anyone; this is the hotel's cross-device and cross-colleague route |
| Owner page / owner memo PDF, action list CSV, vendor questions and pilot card as one-page prints | jsPDF already loaded; `pdf`, `csv`, `docx` allowed | Anyone |
| "Copy as email to owner" | Clipboard, with the existing blocked fallback (show the text to select) | Anyone |
| Re-check date shown in the result and the PDF | Text only; computed from the save date | Anyone |
| Per-tool file joining readiness and the register | Bundle `uc-labels.json` at build (ids match); both tools read one saved object | Anyone (browser); needs D7 sign-off of labels |
| Two-tool comparison | Two saved checks side by side; no new data | Anyone |
| Notice and consent before the start; anonymised copy only on a tick | Page text plus a second, reduced write | Required before any hotel uses it |
| Per-person private cloud history | Bridge passes `user.id()`; store under `data/users/<id>/...` | **Only** people in the owner's organisation at Contributor or above |
| Team view of consented submissions | New collection with rule `read: "admin"`, written by a separate reduced record; lock `readiness` with a rule | Team (Editors and owner) |
| Aggregate counts for HFTP | Team page or a Claude session reading the database | Team |
| "Rules changed since your check" flag | Recompute on open, as the team page does | Anyone |

**Not feasible on the page itself, in any artifact**

- Email or push reminders sent by the tool.
- `.ics` calendar download inside claude.ai (extension not allowed).
- A share link to one hotel's status that others can open (no per-record link access; sharing is per artifact).
- Database saving for people outside the owner's organisation without making them Editors.

**Needs a separate client-facing artifact (still no new infrastructure, but a new page and a new sharing decision)**

- A readiness check (ideally with the register) as its **own artifact** whose main page declares its own capabilities and strict rules, so that (a) no bridge is needed, (b) the team's interview data in the hub is not in the same database, (c) the default-readable `readiness` collection is not exposed, (d) it can be shared by link without sharing the hub. The README already plans this. [local: `tools/readiness-check/README.md` line 28; `tools/register/README.md` line 22]
- For outside visitors this artifact still runs in "browser + files" mode. Its database is useful only for the team's seeded reference data that visitors read (signed in), and for the consented submissions if the visitor can write, which outsiders cannot. So **collecting hotel data centrally in the pilot must go through the team**: the hotel sends its exported JSON (or does the check with a team member during the interview) and the team imports it.
- If HFTP or EHL has a Claude Team/Enterprise organisation and owns the artifact, its members would get private per-person storage and could write consented copies. Whether that is the case is unknown.

**Needs a real hosted app**

- Accounts for hotel staff who have no Claude account; HFTP member login (single sign-on with HFTP's member system).
- Email reminders (re-check date, pilot stop date, AI Act dates, rule changes) and any notification.
- Central storage of hotel records under a named data controller, with deletion and export on request, retention periods and an audit trail.
- Several people in one hotel working on the same file with roles (GM, IT, owner read-only).
- Share links to a one-page status; a live benchmark with small-number protection.
- The scoring logic is already free of dependencies and runs in Node (`logic.js`; the register's `logic.js` likewise), so it can move to a hosted app unchanged. [local: `tools/register/README.md` line 31; `tools/readiness-check/README.md` lines 20–26]

### Gaps
- Whether a browser-only history is enough for hotels to return is the key unknown; shared hotel computers and cleared site data will lose it. The JSON file is the safeguard, and its use needs testing.
- The sharing set-up of the hub (who holds which level) was not inspected; it is not in the repository.
- No cost or effort estimate for a hosted app was researched.

---

## B3. Phased plan

### Takeaway
Three phases: first make the result worth keeping and the data handling defensible, with browser history, action plan and file export; then pilot with a handful of hotels through the team, as its own artifact; then, only if hotels do return, a hosted app with accounts and email.

### Cited Findings
- Review priorities: changes 2, 3, 4, 6 and 8 (proof notes shown, plain summary and honest score, tool at a glance, area diagnosis, report frame with owner page and re-check date) "need no new content at all and could ship first"; change 1 (action plan) "needs about one page of authored text and gives the most value"; change 5 (legal flag) depends on D7 sign-off. [local: `review_result_report.md` line 158]
- A notice before the start is rated high value for a CIO and low effort. [local: `review_user_journey.md` line 237]
- Scope changes must be validated in writing by client, coach and team. [local: `docs/PROJECT_CONTEXT.md` section 2, communication plan]
- Platform constraints: as cited in B1.

### Inferences

**Phase 1: next build (no new infrastructure)**

1. Notice and consent before the start; role instead of name for P1; a separate optional tick for an anonymised copy.
2. Lock the data: add a rule so `readiness` is not readable at `view` level, and write the reduced, consented record to its own admin-read collection. (This needs a republish of the hub with a full capabilities declaration; it is a configuration change, not infrastructure.)
3. Result that is worth keeping: action plan in three groups, proof notes shown back, honest score, owner page first, re-check date, "copy as email to owner", CSV of actions (the review's top 8).
4. Return mechanics in the browser: saved history, open and edit a saved check, compare to last, tick actions with proof, "rules changed" flag.
5. The hotel's file: JSON export and re-import, same pattern as the register.
6. Join with the register by use-case id: provisional label and items to check in the result, marked provisional until D7 signs off.

What to measure in Phase 1 (team use in interviews): do interviewees ask for the PDF or the owner page; which page they forward; whether proof notes are filled.

**Phase 2: pilot with hotels (a separate client-facing artifact, team in the loop)**

1. Publish the check plus register as its own artifact with its own strict rules; share by link or invitation; keep the hub team-only.
2. Hotels work in browser + file mode. The team imports the JSON a hotel chooses to send, with the consent text in the file.
3. Add the per-tool file: vendor answers, pilot card (baseline, target, stop date) and pilot result; two-tool comparison; portfolio view.
4. Reminders by hand or by a team-side scheduled task, only for hotels that asked: one message at the re-check date. State clearly that this comes from the team, not from the tool.
5. Evidence to collect: how many hotels re-open or re-send a file (with n), which artefact they reuse, threshold check against the interviewer's judgement, most-missed must-haves for D9/D10.
6. Agree with HFTP before the pilot: who holds the data, what may be published, minimum cell size.

**Phase 3: production (hosted app; only if Phase 2 shows return use)**

1. Accounts or HFTP member login; hotel workspace with roles.
2. Email reminders tied to the hotel's own dates (re-check, pilot stop, AI Act items, rule changes).
3. Central store with a named controller, deletion and export; aggregate benchmark with n and a small-number floor.
4. Share link for the one-page status; annual AI review for the owner generated from the portfolio.
5. Reuse `logic.js` and the data files unchanged; keep the rules version in every record so old checks can be recomputed.

- A hosted HFTP member tool goes beyond deliverables D1–D10 as written. If the team proposes it, it is a recommendation to HFTP (it fits D8 or D10 as a proposal), not something the project plan commits the team to build; a change of scope needs written validation.

### Gaps
- No effort estimates; the phases are ordered by dependency, not by time.
- Whether HFTP has the systems (member login, hosting, a data protection contact) for Phase 3 is unknown.
- The D7 owner's sign-off of the label file is a dependency for the legal flag in Phases 1 and 2.
- Phase 2's return rate has no benchmark to compare with: no readiness tool publishes completion or return rates (design report, line 13).
