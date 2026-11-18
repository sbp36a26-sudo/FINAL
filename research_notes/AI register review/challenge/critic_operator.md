# Critic: the hotel operator's advocate

*18 Nov 2026. Sources: `../` reviews and trials, `tools/register/`, `reports/Readiness check retention and trust.md`, `tools/readiness-check/README.md`.*

**Stance:** the content beats anything a hotel can buy (`market_and_value.md` §3a); order and presentation fail operators, not the law. Fix Elena's first ten minutes before adding features.

## 1. The job each reader hires it for

| Reader | Job | Realistic now? |
|---|---|---|
| Independent GM | "What runs, what could hurt me, 5 things to do, one page for my GDPR firm" | **Yes, primary user.** Found her two risks, quit at tool 4–5 (`trial_independent_gm.md` §1) |
| Department head | "Can I keep my tool; what do I tell staff?" | Only as a reader of an extract the GM forwards |
| Owner / asset manager | Risk and cost per asset; what a sale inherits | Partly, via PDF page 1 once it has counts and contract ends (`market_and_value.md` §2b) |
| Group CIO | A record for 30 hotels | **No** (group fitness 3/10, `trial_chain_cio.md`); only one-tool triage and board briefing |

## 2. De-duplicated To do

12 of Elena's 17 "now" items are L1 (brief staff) or R2 (ask vendor) repeated per tool: `logic.js items()` works per tool and `reference.json` items have no scope.

- Add a **scope** to each item:
  - `hotel` (L1, GS1, R1 as "name one AI lead"): shown once, listing the tools it covers;
  - `vendor` (R2 plus the vendor questions): one copy-ready email per vendor name;
  - `tool` (B1, C1, GD1, LB1, PC1, CO1, H-items, open ban questions): shown only where it says something specific to that tool.
- **Order by consequence:**
  1. switch off, or open ban questions;
  2. guest or staff data exposed now;
  3. hotel-wide items;
  4. vendor emails;
  5. dated items, with the legacy rule first.
- Bundled or free tools: "check settings or ask support", not "put it in the contract".

**First screen for Elena (Barcelona):**

> **6 AI tools · 7 things to do now · 1 date to note** · Items to check, not a verdict. Not legal advice.
> **Do first**
> 1. Reception and ChatGPT: give staff a work account; no guest or staff data in personal chatbots.
> 2. CCTV smart alerts: 2 open questions could make a feature banned (staff emotions, face database). Ask the camera vendor this week.
>
> **Once for the whole hotel**
> 3. Brief everyone who uses these 6 tools; keep one signed note (since 2 Feb 2025; no certificate needed).
> 4. Name one AI lead (default: you).
>
> **Send to your vendors** (one email each)
> 5. PMS vendor, WhatsApp bot: Is the AI notice on? Do card numbers pass through?
> 6. Scheduling, CCTV and channel-manager vendors: Does it score or monitor staff, read emotions or recognise faces? Can that be switched off?
>
> **Your staff, Spanish law**
> 7. Rota tool: explain its logic to staff representatives, if you have any. Not sure? Ask your labour adviser.
>
> **Date:** rota tool, high-risk duties from 2 Dec 2027, *but not for a tool already in use that does not change much.* Record "in use since" now.
> *Nothing to do under the AI Act for review replies and pricing; other law still applies.*

## 3. What brings a hotel back

Real triggers, in order: a new tool or brand waiver; contract renewal (needs a contract-end field); a vendor update switching AI on (quarterly "check release notes" item); the yearly owner or insurance report; rule changes.

Without email:
- browser storage reopening on Register, not How it works (`app.js:39`);
- a rules version per entry, with "since you last saved: 2 tools affected" on load, also from the hotel file (JSON);
- copy-ready calendar text (no .ics, readiness report §5);
- HFTP's channels announcing watch-list changes (distribution, not code).

Success: one review per tool decision and one per year.

## 4. Linking to the readiness check

Both share use-case ids (readiness builds from `register/data/uc-labels.json`) and are hub pages, so probably one browser storage; verify.
- **One hotel profile** (country, operating model, group or independent, works council) that both tools read.
- **Readiness → register:** "Add to my register" at "about to sign" or "in use" carries use id, vendor, stage, role, vendor answers.
- **Register → readiness:** "Check readiness" on each entry, before signing or at renewal.
- **One vendor question list** for both tools.
- Keep saves separate; freeze positional ids first.

## 5. Legal fixes: Monday actions vs lawyer detail

**These change what the hotel does:**
- Legacy rule (Art. 111(2)) up front, with "in use since".
- No "Minimal" while a ban question is open, and "rules only" must not erase a ban (CIO bug 1).
- A group-built tool keeps its user duties. The Art. 50(2) marking for a group-built chatbot is due 2 Dec 2026, **in 14 days**.
- Brand-mandated tools: "ask the brand who the maker is". This is the typical case for a managed or franchised HFTP member.
- A CH/GB hotel whose output reaches the EU must not read "not covered".
- Remove "VIP recognition is allowed" and add GDPR Art. 9 consent.
- Spanish biometric clocks: "hard to justify", not banned.

**Lawyer detail (fix in the data, not on screen):** Art. 50(3) vs identification, Art. 26(4)/(9), EN 18286, Art. 50(4), PLD and Art. 4 phrasing, age estimation, PCI as contract, radar case numbers. FRIA: correct, but hotels rarely credit-score guests.

## 6. Next build

Precondition: the auditor's minimum conditions (i) (`trial_compliance_lawyer.md` §4) before any interviewee sees the tool.

| # | Item | User benefit |
|---|---|---|
| 1 | Scoped, ordered To do (§2) | 17 → about 7 items; the real risks come first |
| 2 | Honest labels: open ban = never "Minimal", correct counts, flag carried into the PDF, "Minimal ≠ no duties" | No false comfort |
| 3 | "In use since" and version; legacy rule first | No fear of duties she may not owe; evidence kept |
| 4 | Independent vs group roles, "your adviser" not DPO, diffs in reviewer mode, watch list filtered | Written for her hotel |
| 5 | "Not sure" creates a "find out" item with who to ask | Unknowns become actions |
| 6 | One copy-ready email per vendor | What she actually sends on Monday |
| 7 | §5 structural legal fixes | Chains, brands and Swiss hotels get the right answer |
| 8 | §3 return mechanics; status, contract-end, review-date fields | A reason and route back |
| 9 | PDF: owner page 1, 2027 items, vendor questions, Unicode font, version | A page worth forwarding |
| 10 | Shared profile and both readiness hand-offs | One hotel, one journey |

**Later:** group mode; item owners, dates, evidence; per-item CSV; Art. 4 briefing record; RoPA/DPIA fields; cost; AT/NL labour notes; Spanish CCTV basics; FRIA; URL routing; ISO 42001/AIHA map; shared storage.

## 7. Questions and objections

**To the sceptic:** (1) Which of Elena's five next-morning actions (`trial_independent_gm.md` §6) survive your cuts? If the To do list and country notes go, so does the trial's most valuable insight (the Spanish worker-information note).

**To the auditor:** (2) Rank your top 8 by the harm to a hotel if each stays wrong. Does Art. 50(3) outrank the buried legacy rule? (3) How does a GM act on a tool that says "Do not rely on it" on every screen? Would you accept "Items to check, not a verdict; confirm with your adviser before acting on a label"?

**Sceptic's likely objection: "This turns a prototype into a product."** My ten have no group mode, accounts or hosting. Items 1, 2, 4 and 5 rewire existing data (a scope field, the `open` label, group = No); item 8 adds four inputs. Cut the To do list and you cut the only part a GM acts on.

**Auditor's likely objection: "Collapsing items and hiding the diffs loses provenance."** Each collapsed item lists its tools and keeps its reference in the "rests on" fold; precision lives in the data, not in sixfold repetition. Diffs stay in reviewer mode: a hotel has never seen the booklet and reads them as the tool arguing with itself (GM trial §6).
