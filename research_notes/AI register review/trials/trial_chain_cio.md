# User trial: Hotel AI Register, persona "group CIO"

Trial date: 18 Nov 2026. Tool: `tools/register/` served at http://127.0.0.1:8765/register/index.html (data version 0.2, law as of 17 Nov 2026). Driven with Playwright (Chromium, 1280 px). Screenshots and scripts: `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/reg-cio/` (scratch, not kept).

**Persona.** Katrin, group CIO of a 30-hotel upscale group in Germany, Austria and the Netherlands, working with the group DPO. Tools: an in-house guest-preference model, a third-party RMS with autopilot, AI CV screening (works council in Germany), a reservations voice agent, a facial-recognition spa entrance (pilot, one hotel), an employee wellbeing app that reads mood from voice, and Microsoft 365 Copilot for all office staff. She is an expert, sceptical, and needs something for the board that works across 30 hotels.

---

## 1. Registering the group and the seven tools

**Hotel profile.** It takes one country, one operating model and one "part of a group" yes/no. I entered "Germany", but the group also runs hotels in Austria and the Netherlands, and the tool has nowhere to record that. "Part of a group: Yes" changes nothing visible. The register is built for one hotel: the default owners on every item are "General manager", and the five-things list says "head office pools the lists", which means the group would keep 30 copies and merge them by hand.

A first-time gotcha: the example hotel loads by default. If you start typing in "Register your hotel" before clicking "Start my own register", you are editing the example. The confirmation that follows ("Remove the example hotel and start with an empty register?") is clear.

**Tools and labels** (quoted from the tool):

| Tool | How added | Label | Key reason quoted | Verdict |
|---|---|---|---|---|
| CV screening | Catalogue "AI recruiting" | **High-risk + Transparency**, "Duties apply from 2 Dec 2027" | "Tools that screen, rank or match job applicants are on the Act's high-risk list. A hiring chatbot must also say it is AI." Rests on Annex III 4(a). First asks whether it reads emotions of candidates ("Yes makes it prohibited, Art. 5(1)(f)") | Correct. Deployer duties listed: Art. 26(1), 26(2), 26(6) (six months of logs, "where they are under your control"), 26(7) (inform staff and their representatives), 26(11) + Art. 86, 26(5), 26(12); plus GDPR Art. 22 and 35, and German works council (BetrVG s. 87(1) no. 6, s. 95(2a) on the hotel page). Good. |
| RMS autopilot | Catalogue "Dynamic pricing (incl. autopilot publishing)" | **Minimal** | "Dynamic pricing and forecasting are not on the Act's list of high-risk uses. Consumer and competition law bite harder on prices." Questions on manipulation (Art. 5(1)(a)/(b)), personalised prices, and shared competitor data ("competing hotels feeding the same tool can amount to price coordination") | Correct, and the competitor-data question is a real insight. Autopilot itself is never asked about (no oversight, kill-switch or rate-floor item). |
| Voice agent | Catalogue "AI voice agents" | **Transparency** after my answers (starts as High-risk if…) | "It talks to callers, so they must be told it is AI. Switching on an emotion or voiceprint feature would make it high-risk." Card data = yes adds a PCI DSS item | Correct, and precise that Art. 50(1) is the maker's duty ("Maker's duty, your check"). The PCI DSS link is useful. |
| In-house guest model | Catalogue "Guest personalisation", origin "Built by or for our group, under our own name" | **Minimal**, role switches to **Maker** | "Your role: maker (the law says "provider"). Build it: Your group developed the tool and uses it under its own name, so the group is its maker." Adds Product Liability Directive (EU) 2024/2853 item: "AI that a group builds for its own use and puts into use after 9 Dec 2026 is a product it manufactures; without records a court can presume a defect." | Maker vs user handled well, and the PLD date is right. But the page still says "Ask the vendor if you are not sure" and lists vendor questions for a tool with no vendor. Nothing on GDPR Art. 21/22 profiling, beyond "Treat personalisation from guest data as profiling". |
| M365 Copilot | Catalogue "GenAI copilots" | **Minimal**, "Differs from booklet" | "From 2 Dec 2027, using it to rank applicants or judge staff is a high-risk use and may make the hotel the tool's maker; this is the least settled point in the law." | Honest about the uncertainty, which is good. I answered "Not sure" to the HR-repurposing question and the label stayed plain Minimal with 0 open questions (see Bug 3). |
| Wellbeing app (mood from voice) | Custom ("not in the list"); no catalogue entry fits | **Prohibited**, "Banned since 2 Feb 2025" | "It reads the emotions of staff or job candidates from face or voice, which is banned at work. Art. 5(1)(f)". Item: "Switch this feature off, or stop using the tool… Fines… up to €35m or 7%… (Art. 99(3))." Help text: "staff wellbeing or engagement does not [count as medical], and staff consent does not either." | **Caught, and correctly**. That is the single most valuable output. But a prohibited staff tool gets no works council item and no GDPR item (special-category data, DPIA), and still tells me to "Brief the staff… on what it does" and to put vendor answers in the contract. |
| Spa facial recognition | Custom; question "Does it recognise people at a distance by face or voice, or read guests' emotions?" = Yes | **High-risk** (Annex III 1) | "It recognises people at a distance or reads their emotions." | Biometrics are caught, but crudely. (a) No question about 1:1 verification against enrolled members (excluded from Annex III 1(a)) versus 1:N identification, so a spa gate with enrolled members may be over-labelled. Oddly, the catalogue's "Biometric staff time clocks" entry does make that distinction. (b) The first item is "Tell the people exposed that the system reads emotions or sorts people by a biometric trait (Art. 50(3))", but Art. 50(3) covers emotion recognition and biometric categorisation, not identification: **wrong legal basis**. (c) No GDPR Art. 9 explicit-consent item, only a DPIA. (d) The hotel is in Vienna, but the country is set group-wide to Germany, so the German works council note applies and Austrian rules (ArbVG s. 96/96a) do not exist in the tool. |

**Scorecard against the five things I wanted caught:**
- Prohibited emotion reading at work: **yes**, with the right article, the consent point and fines.
- High-risk recruiting and its deployer duties: **yes**, a complete Art. 26 list with honest limits ("Only the logs the hotel actually controls").
- Facial recognition and biometrics: **partly**. It is labelled high-risk, but there is no verification/identification split, a wrong Art. 50(3) item, and no Art. 9.
- In-house model where the group is the provider: **yes** for role and PLD, but the vendor wording leaks in.
- Voice agent transparency: **yes**, correctly placed on the maker, with PCI DSS added.

## 2. Trying to break it

| Test | Result |
|---|---|
| Inconsistent answers: emotion reading = Yes, then "rules written by people only" = Yes | Label becomes **"Not an AI system"**, while the same box still prints "It reads the emotions of staff… which is banned at work. Art. 5(1)(f)". A vendor's "it's rules-based" claim silently wipes out a prohibition. Emotion inference from voice is practically never rule-only, so the tool should flag the contradiction. |
| Answers back and forth (Yes → Not sure → No/High → Yes) | Recomputes correctly every time. Not sure → "Not labelled yet", staff = Yes → High-risk, back to Yes → Prohibited. Stable. |
| Vague custom tool ("some AI thing marketing uses") | "Not labelled yet · Can become prohibited", 9 questions open. A safe default. |
| HTML/script injection in name and vendor (`<script>`, `<img onerror>`) | Escaped, no dialog fired. Good. |
| Special characters ä, ø, ł | Fine on screen and in CSV (UTF-8 BOM, semicolons, opens in German Excel). **PDF drops "Ł"**: "Gräfin Łucja" prints as "Gräfin ucja" (jsPDF standard font). |
| Very long name (300+ characters) | Wraps over 9 lines in the register table. There is no length limit or truncation. Cosmetic. |
| Browser Back | No history entries: Back leaves the app (in my run it went to about:blank). A tool page is not a URL, so you cannot bookmark or share "R-07". |
| Reload mid-edit | Lands on the start tab, not the tool I was on. Notes typed and reloaded within 0.4 s were lost (the save waits 400 ms, and there is no save on page exit). Unlikely in real use, but real. |
| "My tool is not in the list" then Back | Creates an "Unnamed tool" (R-09) that stays in the register, counts as a tool and shows "Can become prohibited". |
| Toasts | The "Added to the register as R-0x" toast sits over the register table and the tool page (covering R-06's label in my screenshot). |

## 3. The to-do list

**Good.**
- Every item carries a type tag (AI Act duty / Maker's duty, your check / Other law / Good practice), a legal reference (Art. 4, 26(x), 50(1), GDPR Art. 22/35, PLD, PCI DSS), a "since" date, and is grouped into "Now" and "Before 2 Dec 2027".
- "Differs from the booklet" boxes are honest and strengthen trust ("Art. 50(1) binds providers. A hotel using a vendor's bot owes it only if it is the provider").

**Not precise enough for a CIO and DPO.**
- Owners are generic roles fixed in the data ("General manager", "Department head", "IT"). The responsible person I named per tool (Group HR Director) is not carried onto the items. Items cannot be reassigned, given a due date or commented on.
- There are only two buckets, "Now" or "Before 2 Dec 2027". There is no priority, no ranking by risk (the prohibited wellbeing app sits in tool order, R-06), and no internal deadlines.
- Missing deployer points:
  - Art. 26(4), input data relevant and representative where the deployer controls it.
  - Art. 26(9), use the provider's Art. 13 information for the DPIA.
  - GDPR Art. 9 for biometrics and for health or mood data.
  - Art. 50(3) is wrongly attached to identification.
  - Labour notes exist only for DE, FR, ES, SE, CH and GB, so nothing for AT (ArbVG s. 96/96a, consent needed for control systems) or NL (WOR art. 27(1)(l), works council consent for staff monitoring systems).
- The legacy-tool note ("A tool already in use before 2 Dec 2027 stays outside these duties… until its design changes significantly") is correct on Art. 111(2), and the caveat on cloud tools that keep updating is good.
- Vague: "National labour law" as the reference, and "GDPR" with no article for profiling and for the Copilot paste item.

**Exportability.** The PDF is a clean two-page summary with the disclaimer in the footer. However:
- It lists only the "now" items, not the 2027 duties.
- It drops "Ł".
- It has no executive summary (risk heat map, counts per country or hotel, trend).

The CSV is one row per tool with counts, not one row per item, so it cannot feed a task tracker. The JSON backup is the only full export. For 30 hotels there is no consolidation, no import of several hotels, and no shared storage (the README says so: "saved in the visitor's browser only").

## 4. Watch list

It is current and well sourced:
- 2 Dec 2026, new Art. 5 bans and the Art. 111(4) marking deadline.
- 9 Dec 2026, PLD.
- End of 2026, final high-risk guidelines.
- 2 Dec 2027, Annex III.
- 11 Dec 2027, Cyber Resilience Act.
- 2 Aug 2028, Annex I.
- The Art. 25 value-chain guidance, the challenge to the EU–US Data Privacy Framework, the Digital Fairness Act, an EU law on AI at work, and GDPR changes.

Each entry has a status ("Date set / Expected / Proposal / Pending"), a countdown in days, "Who should watch", "In your register:" links to my tools, and a source tagged "law text" or "project material". "Last checked 17 Nov 2026."

The linking is the useful part. The DPF entry lists all seven tools, which is technically right but noisy: it should key on "data leaves the EU" (which vendor question 4 already asks). Would it bring Katrin back? Not on its own. There are no alerts, no "changed since your last visit" and no subscription, and the content is static data in the page, so it is only as current as the students' next build. A DPO already gets this from law-firm newsletters.

## 5. Compared with a commercial AI governance platform

Commercial platforms (OneTrust AI Governance, Credo AI, Holistic AI, Trustible, and IBM watsonx.governance at the high end) would give Katrin:
- multi-entity inventory (30 hotels × tools, one tool deployed in many hotels)
- role-based access for CIO, DPO, HR and GMs
- assignable tasks with due dates, evidence uploads and an audit trail
- DPIA/FRIA templates linked to GDPR records of processing
- vendor questionnaires sent out and tracked
- integration with procurement and SSO
- regulatory change feeds maintained by lawyers
- board dashboards
- coverage of ISO/IEC 42001 and NIST AI RMF besides the AI Act

The cost is typically five figures a year and weeks of set-up, and they are generic: none of them knows that a housekeeping room-assignment tool or a spa gate is the hotel-specific trap.

The register wins on hotel-specific content: 91+17 hotel use cases with pre-set deciding questions, plain-language reasons, honest "draft guidance / our reading" tags, and catching the wellbeing app in two clicks. It loses on everything operational. Realistically, it is a very good **pre-assessment and awareness tool**, and content a platform vendor or HFTP could license. It is not a system of record.

---

## Verdict

### Insights rated

| Insight | Rating | Quote |
|---|---|---|
| Staff emotion reading is banned, consent does not help | **Valuable** | "staff wellbeing or engagement does not, and staff consent does not either" |
| Transparency for bots is the maker's duty, not the hotel's | **Valuable** (corrects common advice and the team's own booklet) | "Art. 50(1) binds providers. A hotel using a vendor's bot owes it only if it is the provider." |
| In-house model makes the group a manufacturer under the new PLD | **Valuable** | "AI that a group builds for its own use and puts into use after 9 Dec 2026 is a product it manufactures; without records a court can presume a defect." |
| Shared competitor data in an RMS can be price coordination | **Useful** | "competing hotels feeding the same tool can amount to price coordination" |
| Legacy-tool status will not survive continuous cloud updates | **Useful** | "cloud tools that keep updating are unlikely to keep this status" |
| Copilot plus ranking applicants is the least settled point | **Useful** (honest) | "this is the least settled point in the law" |
| Logs only where under your control | **Useful** | "Only the logs the hotel actually controls, or can obtain from the vendor under the contract." |
| Voice agent with card data falls under PCI DSS | **Useful** | "card data brings the tool under the card-payment standard" |
| Recruiting is high-risk; brief staff (Art. 4); name an owner | **Obvious** | "Tools that screen, rank or match job applicants are on the Act's high-risk list." |
| Do a DPIA | **Obvious** | "Run a data protection impact assessment before the tool is switched on." |

### Legal precision: 7/10
Articles are cited item by item and are mostly right: Art. 5(1)(f), Annex III 4(a), the Art. 26 paragraphs, Art. 99(3), Art. 111(2), and the Omnibus dates. The basis is tagged honestly. The errors:
- Art. 50(3) is applied to facial identification.
- There is no verification/identification split.
- GDPR Art. 9 is missing.
- Art. 26(4) and 26(9) are missing.
- A self-declared "not AI" overrides a prohibition.
- Labour notes cover none of the AT or NL rules.

### Group fitness: 3/10
- One country per register.
- No hotel dimension: one tool cannot be used in many hotels.
- Item owners cannot be assigned or dated.
- Browser-only storage.
- The CSV is per tool, not per item.
- No consolidation for head office.
- Maker vs user and "Head office decided" are captured, but they change nothing beyond the role.

### Trust: 7/10
Disclaimers are everywhere but not obstructive, every label shows what it "Rests on", and "Differs from the booklet" boxes admit the team's own earlier errors, which raises trust a lot. Trust falls at the Art. 50(3) error and the "Not an AI system" override. A DPO who spots one wrong article checks all of them.

### Top 5 fixes, ranked
1. **Group mode.** Add a hotels list with a country per hotel; a tool links to one or more hotels; country notes and labour items follow the hotel; add a group roll-up view. Add AT and NL labour notes (ArbVG s. 96/96a; WOR art. 27(1)(l)).
2. **Fix the biometric logic.** Split 1:1 verification from 1:N identification and from categorisation and emotion. Attach Art. 50(3) only to emotion and categorisation. Add GDPR Art. 9 (explicit consent or another Art. 9(2) ground) for biometric and health or mood data.
3. **Make the to-do list an action plan.** Carry the named responsible person onto items; let each item take an owner, an internal due date and an evidence note; sort by severity (prohibited first); export one row per item as CSV.
4. **Guard against contradictions.** If any prohibited or high-risk feature is answered Yes and "rules only" is Yes, show a warning instead of "Not an AI system". Count "Not sure" on soft high-risk questions (Copilot) as open. For a banned staff tool, still show the works council and GDPR items.
5. **Export and persistence for the board.** Use a Unicode font in the PDF; include the 2027 duties and a one-page summary (counts by label and by hotel, top risks); add URL routes so Back and reload work; save on page exit; remove "Unnamed tool" ghosts; for in-house tools, replace "Ask the vendor" with internal wording.

### Bugs with reproduction steps
1. **"Not an AI system" overrides a prohibition.** Add a tool → My tool is not in the list → emotion question = Yes (Prohibited) → "rules written by people" = Yes. The label becomes "Not an AI system", yet the reason "…banned at work. Art. 5(1)(f)" is still shown. (`logic.js` `classify`: `tool.notAI === 'yes'` resets everything.)
2. **Art. 50(3) on identification.** Custom tool → "recognise people at a distance by face or voice" = Yes. Item N1: "Tell the people exposed that the system reads emotions or sorts people by a biometric trait. AI Act Art. 50(3)". The `c_biometric` switch adds pack `notice` in `data/reference.json`.
3. **"Not sure" ignored on Copilot.** Catalogue "GenAI copilots" → "rank job applicants or rate staff?" = Not sure. The label stays Minimal, the list and CSV show 0 open questions, and no "High-risk if…" appears (`repurpose_hr` is `soft: true` in `uc-labels.json`). This contradicts the on-page rule ""Not sure" keeps the label open".
4. **PDF drops Polish Ł.** Hotel name "Gräfin Łucja Ørsted" → Download PDF. The header reads "Gräfin ucja Ørsted" (jsPDF 2.5.1, standard font).
5. **Ghost tools.** Add a tool → My tool is not in the list → ← Back to the register. "Unnamed tool" is saved and counted.
6. **Back button leaves the app; reload loses the view.** Open any tool → browser Back. You leave the page, because nothing pushes history. On reload you land on the default tab.
7. **Notes lost on fast reload.** Type in Notes and reload within 400 ms: the text is lost (`persistSoon` 400 ms debounce, no `pagehide`/`beforeunload` flush).
8. **Toast overlays content.** "Added to the register as R-0x…" covers the table row and the label area for several seconds.
9. **Banned staff tool lacks labour and GDPR items.** A custom tool with emotion = Yes gets no works council or DPIA item, even though the hotel has a works council.
10. **Vendor wording for in-house tools.** With origin "Built by or for our group", the page still says "Ask the vendor if you are not sure" and shows the vendor questions and the vendor-contract item.

### One-line verdict
Sharp, honest hotel-specific AI Act triage that caught my banned wellbeing app in two clicks and corrected myths my lawyers repeat. But it is a single-hotel browser notebook with one wrong biometric article, so I would use it to brief the board, not to run 30 hotels.

### Score: 6/10
(Content and legal triage 8, group operations 3, robustness 6.)
