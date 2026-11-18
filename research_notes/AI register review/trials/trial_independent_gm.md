# User trial: independent boutique hotel GM ("Elena", Barcelona)

Trial date: 18 Nov 2026. Tool: Hotel AI Register prototype, data version 0.2 (http://127.0.0.1:8765/register/index.html), driven with Playwright at 1280x900 and 390x844. Screenshots and scripts: `/tmp/claude-0/-home-user-final/ae1d20bd-bcf5-54c4-94ed-b27839cdd094/scratchpad/reg-gm/` (shots/, dl/).

**Persona.** Elena is general manager and part-owner of a 48-room independent boutique hotel in Barcelona, with 30 staff. She has no IT person and no DPO; an outside firm does the GDPR paperwork. She knows nothing about the AI Act. Her AI tools: a WhatsApp guest chatbot (from the PMS vendor), dynamic pricing in the channel manager, AI review replies, reception staff using ChatGPT for emails, CCTV with "smart" alerts, and a staff scheduling tool that "suggests" rotas.

---

## 1. Walk-through: effort and friction

| Step | What happened | Clicks / inputs | Friction |
|---|---|---|---|
| Land on "How it works" | One long page: 4-step explainer, item-type legend, "What a label rests on" (Law text / Commission guidance / Draft guidance / Our reading), Limits, backup, then "The label of every use case" with 16 collapsed departments, then sources | 0 | Too dense for a GM. The two primary buttons are good, but she has to read past "deployer", "Annex III", "Digital Omnibus", "Art. 3(1)" to get there. "An example hotel is loaded" is unclear: loaded where? |
| Register your hotel | Shows the **example** German hotel "Seeblick" in the form, with a blue banner and a "Start my own register" button | 1 | She first thinks she has to overwrite the example fields. |
| Start my own register > Start empty | Confirmation, then it jumps to **Register AI tools** ("Start your register"), not back to the hotel form she came from | 2 | Disorienting: she had asked for her hotel. |
| Describe your hotel > fill | Name, Country, Operating model, Group, Works council (she chose "Not sure"), Keeper, outlets | about 10 inputs | Easy. Country panels below update at once (AESIA, Estatuto art. 64.4(d) "Rider Law"): this is the first moment of real value. |
| Next: register AI tools > Add a tool | Searchable picker of 108 use cases; placeholder "chatbot, rota, camera, pricing" | 1 + typing | Good search. Fails on her words "channel manager" (0 hits, although "AI channel management" exists) and "smart alerts" (0). "ChatGPT" gives no good match: she had to choose "GenAI copilots and enterprise assistants for managers and corporate staff". |
| Per tool page | Label card, "Questions that decide the label" (1 to 6 Yes/No/Not sure), What to check, Vendor questions, Register entry (vendor, origin, who decided...) | about 10 to 14 inputs per tool | The questions are clear and well written. Every tool carries the same question, "Does the tool follow only rules written by people, with nothing learned from data?", which is odd for ChatGPT and which she cannot answer. |
| 6 tools in total | | about 75 interactions and about 15 screens; an estimated **30 to 40 min** for a careful first pass | **Where she gives up:** at tool 4 or 5, when every tool repeats the same 3 to 4 items and the same 4 to 5 vendor questions. The CCTV page (6 questions, 3 marked "Yes makes it prohibited") is where anxiety peaks. |
| To do | "Five things to do now" (generic booklet list), then "By tool": 17 open items now, 8 before 2 Dec 2027 | 1 | The "Brief the staff..." item appears **6 times** and "Ask the vendor the questions..." **6 times**: 12 of her 17 "now" items are these two. On a phone the page is 7,600 px long. |
| Watch list | 13 dated or pending items, each with "In your register: ..." | 1 | The "In your register" links are useful. The list is not filtered to her: the Swiss AI bill, AI in lifts and gas appliances, group product liability, "Who should watch: CIO". |

Jargon she would not understand without help: deployer, provider/maker (explained, but used in a legal sense), Annex III 4(b), Art. 26(6), "Draft guidance" vs "Commission guidance" vs "Our reading", "Differs from the booklet" (which booklet? she has never seen it), CE-marked and registered, legacy tool, data protection impact assessment, Data Privacy Framework, MCP servers, ARI, GEO, "scenario D5" (German example page), Digital Omnibus.

---

## 2. What she was told, tool by tool (quoted)

| Tool | Label shown | Useful | Confusing, frightening or wrong for her |
|---|---|---|---|
| WhatsApp chatbot | **Transparency** "It chats with guests, so they must be told it is AI in its first message." | Clear. The honest split is valuable: "Maker's duty, your check ... The law puts this duty on the tool's maker ... Checking it is still sensible, and a hidden bot can breach consumer law." Vendor question: "Is the 'you are talking to AI' notice built in and switched on?" | The card-number question: she answered "Not sure" (guests do type card numbers into WhatsApp) and **got no item**. The PCI item appears only on "Yes". "Not sure" here should produce "ask the vendor". |
| Channel manager pricing | **Minimal** "Dynamic pricing and forecasting are not on the Act's list of high-risk uses. Consumer and competition law bite harder on prices." | Reassuring and correct. Competitor-data question ("competing hotels feeding the same tool can amount to price coordination") is a real insight for an independent hotel. | "Is pricing ... designed to deceive or manipulate guests ... exploit their age, disability or financial situation" with "Yes makes it prohibited": she found it alarming to be asked at all. |
| Review reply AI | **Minimal** "The briefing booklet does not name this use; everything it does not list is minimal." | "Never publish AI-written reviews as genuine." | The reason cites "the briefing booklet", which she has never seen, so it explains nothing. |
| ChatGPT at reception | **Minimal**, plus "Differs from booklet" | When she answered "Yes" to "Do staff paste guest or staff personal data into it?", she got: "Give staff an approved tool with a work account, and tell them not to paste guest or staff personal data into personal chatbots." **This is the most valuable item in the trial.** | "General manager **and head office**": she has no head office. The 4 generic vendor questions ("Who is the maker of this tool under the AI Act, and does the contract say so?") make no sense for free ChatGPT accounts, where there is no contract to negotiate. The "Differs from the booklet" box about ranking applicants is noise for her. |
| CCTV smart alerts | Starts as "High-risk if…". After her answers (No, No, Not sure, No, Not sure, Not sure) it reads **Minimal** with a red "Can become prohibited" | The questions are clear about what is banned. "Run a data protection impact assessment before the tool is switched on." | **A "Minimal" badge next to "Can become prohibited" is contradictory.** The text says "**One** open question below could make this tool prohibited" when **two** are open (staff emotions, face database). "Before the tool is switched on": it has been on for years. "with the data protection officer": she has none. Nothing on Spanish CCTV basics (AEPD signage, informing staff that cameras record them, retention), which is what an inspector would actually ask about. |
| Staff scheduling | She answered "Yes" to "Does it significantly change regular working hours, or decide leave requests?", so the label became **High-risk**, "Duties apply from 2 Dec 2027 (379 days away)", with 12 items | Spain labour note: "every employer using algorithms on staff must also inform each worker individually" and "explain the system's logic to its works council". Concrete and right for her. | Frightening: 8 future duties (Art. 26(1), (2), (5), (6), (7), (11), (12), "keep logs six months"). The single most important fact for her is buried in the **last** item: "A tool already in use before 2 Dec 2027 stays outside these duties ... until its design changes significantly ... cloud tools that keep updating are unlikely to keep this status." The question also misleads her: any rota tool "changes hours" in a lay sense, and nothing helps her tell suggesting a rota from deciding one. |

**Generic items repeated on every tool:**
- "Brief the staff and contractors who use this tool ... keep a note of who was briefed." This is correct (Art. 4, since 2 Feb 2025), but one briefing note covers all six tools.
- "Ask the vendor the questions listed below and put the answers in the contract." This is impossible for bundled PMS features and free ChatGPT: she cannot renegotiate a PMS contract over a WhatsApp add-on.

**Other wrong-for-her wording:** "General manager; head office pools the lists"; "Purchasing or IT"; "Department head"; "Who should watch: CIO". The tool knows she is independent (group = "No") but does not adapt the roles.

---

## 3. Did it catch the risky ones?

| Risk | Caught? | Notes |
|---|---|---|
| Staff scheduling affecting workers | **Yes, strongly.** High-risk on "hours" = Yes, a labour item, and the Spain individual-information rule | Overcalls the 2027 duties for a tool already in use (the legacy rule is buried). Works council "Not sure" gets no guidance on whether a 30-staff Spanish hotel has delegados de personal. |
| CCTV | **Partly** | Catches bans and the DPIA. The label display is misleading ("Minimal" with open prohibited questions). Spanish video-surveillance basics are missing. |
| Staff pasting guest data into ChatGPT | **Yes**, but only if she ticks "Yes" on that question | The item is right. The "head office" role and the contract-oriented vendor questions are wrong for her. |
| Vendor vs her job | **Mostly clear** | "Maker's duty, your check" and "Your role: user" work well. But vendor questions as contract clauses do not fit bundled or free tools. |
| By when | **Clear for dates** ("since 2 Feb 2025", "Before 2 Dec 2027, 379 days away") | All 17 "now" items carry no order of priority: a chatbot notice and a DPIA sit at the same level as "name a responsible person". |

---

## 4. Return visit, export, print

- **Reload:** the register persists (localStorage), including answers and ticks. But a reload always opens on **How it works**, which still says "An example hotel is loaded so you can look around first." She would think her work was lost until she clicks a tab.
- **What would bring her back:** the Watch list countdowns ("14 days away", "379 days away"), a vendor replying to a question, a new tool. Nothing reminds her: the data lives in one browser with no email or reminder, so in practice she would not return.
- **Download CSV:** works. 17 columns, semicolon-separated, with a BOM (opens well in Spanish Excel).
- **Download backup:** a JSON file. **Restore from a backup:** works, with a confirmation ("Replace the current register with the backup (6 tools)?").
- **Download PDF:** 2 pages, which she would print for the outside GDPR firm, but:
  - the "Before 2 Dec 2027" items are missing (only "To check now");
  - the items say "Ask the vendor the questions listed below", but **the vendor questions are not in the PDF**;
  - CCTV shows as "Minimal" without the "Can become prohibited" flag;
  - long tool names run into the Label column ("(PMS vendor)Transparency", "emailsMinimal").
- **There is no separate print view;** the PDF is the print route.

## 5. Phone (390x844)

- **First screen:** title and 5 tabs wrapped onto 2 rows. On How it works the first content is the dense explainer. Usable.
- **Register list:** cards, readable, no horizontal scroll.
- **To do:** 7,600 px of scrolling. The first screen is "Five things to do now", each with a grey "Differs from the booklet" box. **Horizontal overflow of 8 px**, caused by a `span.cite` ("AI Act Art. 50(1) (maker's duty); EU consumer law") that does not wrap.

---

## 6. Verdict

### Insights rated

| Insight (quote) | Rating |
|---|---|
| "Your hotel is in the EU, so the Act applies ... whatever its size." | Obvious, but needed |
| AESIA as authority; "Spain has no implementing law" | Useful |
| "A Spanish hotel using algorithmic scheduling ... must be able to explain the system's logic to its works council" and "every employer using algorithms on staff must also inform each worker individually" | **Valuable** |
| "Give staff an approved tool with a work account, and tell them not to paste guest or staff personal data into personal chatbots." | **Valuable** |
| "Reading staff emotions has been banned since 2 Feb 2025." plus the vendor question "Does it rank, score or monitor individual staff, read emotions, or recognise people by face or voice? Can those features be switched off?" | **Valuable** |
| Chatbot notice is the maker's duty, "your check" | Useful |
| "competing hotels feeding the same tool can amount to price coordination" | Useful |
| Brief staff, Art. 4, "No certificate is needed; an internal record is enough." | Useful (once, not six times) |
| "Never publish AI-written reviews as genuine." | Obvious |
| Legacy-tool rule for tools in use before 2 Dec 2027 | Valuable, but buried |
| Watch list: Swiss bill, lifts, group product liability | Noise for her |

### What she would do the next morning

1. Tell reception to stop pasting guest data into personal ChatGPT accounts, and look at a business account.
2. Write one AI-briefing note for staff and get signatures.
3. Email the PMS vendor: "Does the WhatsApp bot say it is AI? Can guests type card numbers in it?"
4. Email the scheduling and CCTV vendors the "rank, score, emotions, face" question.
5. Forward the PDF to the outside GDPR firm about the CCTV DPIA, and ask them whether the hotel has staff delegates.

### Would she trust it?

Half. She trusts the tone ("not legal advice", sources everywhere, honest "Our reading" labels). Two things undercut it: the "Differs from the booklet" boxes, which make the tool look like it is arguing with itself, and "Minimal / Can become prohibited". She would not show it to her lawyer as is.

### Top 5 fixes (ranked)

1. **Collapse the generic items.** Show one hotel-wide "Brief your staff on AI" item and one "Send these questions to your vendors" pack per vendor, not per tool. That cuts her 17 "now" items to about 8 and makes the real ones (ChatGPT data, chatbot notice, DPIA, works council) stand out.
2. **Put the legacy rule up front** on every high-risk tool already in use: "Already using it before 2 Dec 2027? These duties start only if the tool changes significantly; ask the vendor." Add an "In use since" check that drives it.
3. **Never show "Minimal" while a prohibited or high-risk question is open.** Show "Open: answer N questions" (the `open` label already exists for triage uses), fix the "One open question" count, and carry the flag into the PDF.
4. **Adapt roles and wording to an independent hotel.** Drop "head office", "CIO", "Department head" and "Purchasing or IT" when group = No; write "you (GM)" or "your outside data protection adviser" instead of "the data protection officer". Hide the "Differs from the booklet" boxes for hotel users (keep them in a reviewer mode). Filter the Watch list to her country.
5. **Make "Not sure" do something, and fix the PDF.** "Not sure" on card data should add "ask the vendor whether card numbers pass through". Add a "Before 2 Dec 2027" section and the vendor questions to the PDF, and stop names overlapping the Label column. Also: open the last-used tab, or Register when a register exists, on reload.

### Bugs (with reproduction)

1. **Wrong count in prohibited warning.**
   - Steps: add "Physical security video analytics". Answer No, No, Not sure, No, Not sure, Not sure.
   - Result: the label reads "Minimal" and the text says "One open question below could make this tool prohibited" although two (emotions Art. 5(1)(f) and face database Art. 5(1)(e)) are open. Source: `src/app.js:344` (fixed text); `src/logic.js:44-54` (label falls through to the base when only potPro is open).
2. **Contradictory badge.** In the same state, the register list shows "Minimal" next to "Can become prohibited", and the PDF shows only "Minimal".
3. **Misleading text on reload.**
   - Steps: build your own register, then reload.
   - Result: the page opens on How it works with "An example hotel is loaded so you can look around first." (`src/app.js:39` `ui.tab:'how'`; text at `src/app.js:515`).
4. **Wrong landing after Start empty.**
   - Steps: Register your hotel > Start my own register > Start empty.
   - Result: it lands on Register AI tools instead of the hotel form the user came from.
5. **PDF refers to missing content.** Download PDF: items say "Ask the vendor the questions listed below", but no vendor questions are printed; the "Before 2 Dec 2027" items are missing; tool names overlap the Label column (R-01, R-04).
6. **Search misses vendor terms.** Search "channel manager" gives 0 results (the use case is "AI channel management / ARI distribution"); "smart alerts" also gives 0.
7. **Phone overflow.**
   - Steps: open To do at 390 px.
   - Result: the page is 398 px wide because `span.cite` does not wrap.
8. **Minor.**
   - "AESIA (Agencia Espanola ...)" is missing the ñ.
   - The German example page refers to "scenario D5", an internal code.
   - The "Not sure" works-council answer gives no help.

### One-line verdict

A careful, honest and legally literate register that does find Elena's two real problems (staff data in ChatGPT, the rota tool and her workers). But it buries them under repeated generic items, chain-hotel roles and a running argument with "the booklet", so an independent GM would finish one session, act on two or three points, and not come back.

**Usefulness score for an independent GM: 6/10.** It could reach 8 with fixes 1 to 3.
