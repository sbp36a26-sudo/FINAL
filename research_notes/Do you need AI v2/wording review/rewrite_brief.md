# Plain-language rewrite brief (hotel AI self-check tool "Do you need AI?")

Readers: hotel general managers, department heads, finance and IT people in European hotels. Many know nothing about AI or software jargon; some read English as a second language. They answer each question with: Yes / Planned, not done yet / Partly / No / Don't know yet.

Your job: for each use-case NAME and each QUESTION in your part file, write a plainer version that anyone understands at first reading, WITHOUT changing the meaning. The team will review your suggestions in a spreadsheet next to the original, so a suggestion that drifts in meaning is worse than none.

Rules
1. Same meaning, same scope. Keep every condition, number, time span, role and system the original names ("at least one year", "two-way", "real time", "by segment"). Do not add new requirements, examples or advice. Do not drop one.
2. Questions stay answerable with Yes/No. Start with a verb ("Is…", "Do…", "Have…", "Can…", "Will…").
3. Short: aim for 20 words or fewer; never more than 30. One sentence.
4. Spell out jargon once in brackets the first time it appears in a question, short form after: "revenue management system (RMS)", "property management system (PMS)", "central reservation system (CRS)", "point-of-sale system (POS)", "customer relationship management system (CRM)", "API (a link that lets two systems exchange data)". Spell out each abbreviation in every question where it appears (each question is read on its own). Replace words like "onboarding", "segment", "pickup", "unconstrained demand", "override", "literacy", "KPI" with plain words where possible, or add a 2–4 word explanation in brackets. Keep the term if the plain word would change the meaning.
5. Remove generator frames that read stiffly, e.g. "Is this in place, or confirmed as possible: X?" → "Do you have X, or has your provider confirmed it is possible?"; "Do you know what this will cost your hotel: X?" → "Do you know what X will cost your hotel?"; "Is this data ready, digital and up to date: X?" → "Is X digital, up to date and ready to use?". Keep the meaning of the frame (e.g. "or confirmed as possible" must stay).
6. Use-case names: a short noun phrase a hotel manager would recognise (max ~8 words), keeping what it does and for what. Brackets in the original that narrow the meaning ("rooms, by day/segment/room class") must survive in plain form if they change meaning; otherwise you may drop pure detail only if it is repeated in the questions — if unsure, keep it.
7. British spelling, no em dashes, no exclamation marks, no "AI-powered", no marketing words. Never mention any organisation not already in the text.
8. If the original is already plain, copy it unchanged.
9. If a question asks two separate things (e.g. "X and Y?"), keep both (do not split) but set flag "two things".
10. If you think an original is unclear, wrong or ambiguous in a way you cannot fix without changing meaning, keep your best plain version and put a short note (max 15 words) in "note".

Output: write ONE JSON file (path given in your task) exactly in this shape, covering EVERY use case and EVERY question in your part (check counts at the end with node):
{"uses":{"<use id>":{"plain":"...","note":""}},
 "qs":{"<use id>|<qid>":{"plain":"...","flag":"","note":""}}}
Do not edit any other file. Do not run anything except node to validate your JSON and counts.
