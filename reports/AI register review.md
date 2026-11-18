# AI Register: review and recommendation

*19 Nov 2026. Two researchers, three consultant trials (independent GM in Barcelona, 30-hotel group CIO, EU tech lawyer) and three critics (sceptic, operator's advocate, legal auditor). Notes: `research_notes/AI register review/`. Trials are AI personas: reliable for bugs and legal checks, weak evidence for what real hoteliers want. Outside sources were seen in search summaries only.*

## Scores

| Reviewer | Score |
|---|---|
| Independent GM: usefulness | 6/10 |
| Group CIO: overall / group fitness | 6/10 / 3/10 |
| Lawyer: safe to publish | 4/10 |

## What holds

- All seven deadline dates match the amended AI Act (Regulation 2026/1744) in the repo.
- Most labels are right: banned staff emotion reading, high-risk CV screening with user duties, chatbot notice on the vendor, the in-house model making the group a maker.
- The GM found the most valuable items: the staff ChatGPT rule, the Spanish labour notes, the emotion ban.
- No comparable tool was found that combines a hotel catalogue, hotel roles and a free price (search summaries only).

## Logic errors (all reproduced in code; none caught by the 99 tests)

1. A group that builds, rebrands or changes a high-risk tool loses all its duties as a user of that tool.
2. "Follows rules only" turns a tool with a ban answer into "Not an AI system".
3. CCTV with ban questions still open shows "Minimal" ("One open question" when two are open).
4. On guest screening, unanswered ban questions are treated as soft: the tool never warns it could be banned.
5. "Not sure" answers add no item.

## Legal content errors

- Swiss and UK hotels: "a stand-alone hotel is not covered" ignores that the Act reaches AI whose output is used in the EU (Art. 2(1)(c)).
- Missing duties: fundamental-rights impact assessment for credit scoring (Art. 27); incident reporting and other user duties (Art. 26(4), (5), (9)); marking of AI-made content for a group's own chatbot (Art. 50(2), from 2 Dec 2026).
- Face recognition: "recognising VIP guests is allowed" is misleading; GDPR Art. 9 almost always blocks it.
- Overstatements: Spanish labour note (the right belongs to the works council), biometric time clocks, PCI DSS tagged as law, facial age estimation shown as settled.
- Watch list: no primary-source links; two case or proposal numbers dropped; one unsourced claim.
- Wording: "All checked" in exports reads like proof of compliance; command-style items read like legal advice; no privacy notice or terms.

## Usability

- Noise: 12 of the GM's 17 "do now" items are the same two lines repeated per tool.
- The rule that tools already in use before 2 Dec 2027 escape the high-risk duties is buried in the last item.
- Roles assume a chain; "Differs from the booklet" boxes make the tool look like it argues with itself.
- Search misses common words ("channel manager", "smart alerts"); Back leaves the tool; PDF drops letters like "Ł" and omits the open questions.

## Where the critics landed

- **Honest job now:** a companion to D7 and a tool the team uses in interviews, not a product for HFTP members. The label content (109 rows) is the real asset and should also appear as a table in the report.
- **Not now:** group mode for 30 hotels, alerts, assignable to-dos, cost and contract fields.
- **Agreed first:** fix the five logic errors with tests, the Swiss/UK wording, the face-recognition text, "All checked", and add a "student prototype, not reviewed by a lawyer" banner. The auditor says this should happen before the Accor interview, because Accor builds AI in-house and would hit error 1.
- **Next:** de-duplicate the to-do list (hotel-level, per vendor, per tool), put the legacy rule up front, and link the register and the readiness check through one hotel profile.

## Proposed build order

1. Banner: student prototype, not reviewed by a lawyer, not legal advice.
2. Fix logic errors 1–5 with precedence rules as tests: an open ban question beats any lower label; "not AI" cannot override an open ban or high-risk question; maker status adds duties and never removes user duties; "Not sure" always adds an item.
3. Swiss/UK reach wording, face-recognition text, remove "All checked", item wording as "Check whether… Why… Who can confirm".
4. Add the missing duties: Art. 27, Art. 26(4)/(5)/(9), Art. 50(2) for own tools.
5. De-duplicated to-do list, with the legacy rule shown first on high-risk tools.
6. Correct the national notes, PCI DSS tag, facial age estimation; source links on the watch list.
7. Small fixes: search synonyms, Back button, PDF letters and open questions, phone overflow.
8. Link with the readiness check and share one hotel profile.

## Sign-offs

| What | Who |
|---|---|
| Labels resting on draft guidance or the team's reading, Art. 111(2) note, Swiss/UK wording | D7 owner |
| National labour and data protection notes | A qualified lawyer, or leave out |
| HFTP's name, terms of use, privacy notice | Coach and HFTP |
