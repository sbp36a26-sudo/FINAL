# Response to the review of 19 Nov 2026

The merged review brief (`claude_code_prompt.md`) and the team's own review (`reports/AI register review.md`, notes in `research_notes/AI register review/`) were worked through in four phases, one commit each. Details: `CHANGELOG.md`. Tests: 136 for the register, 34 for the Readiness check, all passing.

## Phase 1: before any external demo

| Finding | What changed | Test |
|---|---|---|
| No disclaimer on screens and exports | Banner on every screen, every PDF page and the CSV | – |
| CCTV shows "Minimal" with ban questions open; wrong "one open question" | New label "Could be banned"; every open ban question counted and named | `CCTV ... "Could be banned"`, `every open ban question is counted` |
| Guest screening never warns it could be banned | Soft ban questions now count too | `guest risk screening warns` |
| "Rules only" turns a banned tool into "Not an AI system" | Not-AI cannot override a ban or high-risk answer or open question; needs the vendor's written confirmation where the questions can make the tool banned or high-risk | four "rules only" tests |
| Prohibited tool still lists high-risk and transparency duties | Prohibited shows only stop, literacy, basics and labour items; the rest in "If you switch the banned feature off" | three "prohibited" tests |
| Group that builds or rebrands a high-risk tool loses its user duties | Maker items added, user duties kept; vendor-only checks dropped | `group-built high-risk tool`, `group-built chatbot` |
| Repurposed tool gets product liability and the QMS standard | Repurpose route: M1r "you may be treated as the provider (Art. 25(1)(c))", no Y1 or M2 | `repurposed chatbot` |
| "The brand decided" changes nothing | New item BR1 on the franchise or management agreement | `brand-mandated tool` |
| "Not sure" adds nothing | Each "Not sure" adds a "Find out" item with who can confirm | two "Not sure" tests |
| "Rests on" shows the default only | Shows the basis of the answer or open question that set the label | two "rests on" tests |
| "Recognising VIP guests is allowed" | Replaced with the GDPR Art. 9 explicit-consent wording | `no "recognising VIP guests is allowed"` |
| "All checked" reads like proof | "Items marked as reviewed by [owner] on [date]" | `no "All checked"` |
| Command-style items | All items reworded "Check whether…", with "Why:" and "Who can confirm:" | – |
| Swiss and UK reach overstated | Reach text per the brief; AI Act items "For reference (EU)"; revFADP / UK GDPR labels; CH4 revFADP Art. 21 | – |
| Art. 4 wording outdated | Omnibus wording, checked against Reg. 2026/1744 | – |

## Phase 2: legal content (checked against the two regulation PDFs in the repo)

FR1 (Art. 27), H9–H11 (Art. 26(4), (5), (9)), Art. 50(2) for group-built chatbots, legacy-tool date field and caveat (Art. 111(2) as amended), `c_chat` question for hr-2 and res-4, wider custom triage, Art. 5(1)(b) and (g) wording, bases for staff ranking and predictive maintenance, facial age estimation reworked (contested), firm ESG claims question, national notes (ES, CH, GB), EEA countries, PCI DSS as a standard, GDPR Art. 22 wording, sourced watch list. Tests: ten "phase 2" tests.

## Phase 3 and 4

De-duplicated to-do list (Barcelona case from 17 "now" items to 4 by tool plus 3 hotel-wide, one email per vendor), top 3 per tool, sorting and filter, plain catalogue text, reviewer toggle, neutral roles, search synonyms, Back button, offline PDF with full Latin font, bundled jsPDF, no web fonts, CSV escaping, vendor emails, privacy notice and terms; shared hotel profile, links both ways with the Readiness check, "since you last opened".

## Not done, or done differently, and why

- **Art. 50 guideline reference.** The booklet cites C(2026) 7702 final of 5 Nov 2026; the brief and other sources give OJ C/2026/6005 of 12 Nov 2026. EUR-Lex blocks automated reading from the build environment, so both are shown, marked "to verify".
- **References only the brief gives:** French bill no. 2518 and Commission Q&A QANDA/26/2408 are shown marked "to verify". The Paris Court of Appeal ruling of 21 May 2026 (RG 25/13232) is not added: nothing in the project files says what it concerns.
- **Removed for lack of a source:** the European Parliament resolution on algorithmic management (watch entry), "Germany has done so" (product liability), the "14-question questionnaire" of the AI Hospitality Alliance.
- **`window.claude` and postMessage code kept.** It is what lets the register save files inside the claude.ai hub; it does nothing from file://. Explained in `src/app.js`.
- **H7 for makers.** A group that built the tool does not get H7 ("ask the vendor about legacy status"), since it is the vendor; the legacy question is in M1's world instead.
- **Fonts.** Web fonts removed (system font stack). The PDF embeds an OFL-licensed Latin subset; non-Latin scripts print as "?".

## Sign-off needed before the register leaves the team

| What | Who |
|---|---|
| Labels resting on draft guidance or the team's reading (facial age estimation, predictive maintenance, brand-mandated note, Swiss/UK reach) | D7 owner |
| The Art. 50 guideline reference; QANDA/26/2408; French bill no. 2518; BGE 130 II 425; the UK ICO guidance status; AI Act status in Norway, Iceland and Liechtenstein | D7 owner, against the official sources |
| National labour and data-protection notes (DE, FR, ES, SE, CH, GB) | A qualified lawyer, or leave them out |
| Terms of use and privacy notice; any use of HFTP's name | Coach and HFTP |
