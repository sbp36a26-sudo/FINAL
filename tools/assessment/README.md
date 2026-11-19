# AI Assessment Tool – HFTP SBP, Group 36

A shared web tool where the group records each interview, scores the company on the 8 categories of the AI framework, and gets an automatic LOW / MEDIUM / HIGH bucket with the reasons behind it. It also produces a one-page PDF per interview and an overview of all companies.

- **Tool:** https://claude.ai/artifact/1jvE6hjkHCWHwqzDiJr5au (owner: Alexis)
- **Related docs:** Framework approval doc (https://claude.ai/artifact/F7adUoxNBQxeDKhg35hzp9) and interview question bank (https://claude.ai/artifact/C23sUCtD3smQ1oxykEg5EM)
- **Framework in use:** version 1

---

## 1. Give teammates access (once, done by Alexis)

1. Open the tool and click **Share** (top right).
2. Invite each teammate by email as an **Editor**. They must be signed in to Claude with that email.
3. **Do not also turn on public link sharing.** If the tool is shared by public link, teammates can no longer save.

| Who | Can do |
|---|---|
| Editors (teammates) | Add, score, edit and archive interviews; download PDFs; export CSV and backups |
| Alexis (owner) only | Change the framework (weights, thresholds, requirements, level wording); delete interviews permanently |

Anyone who opens the tool without Editor access sees it read-only, with a banner saying so.

## 2. After each interview: score it

1. **Overview → New interview.** From a company page, "New interview for this company" pre-fills the company name and segment fields.
2. **Interview details:** company, interviewee and position, date, interviewer, and the segment fields (industry, operator type, operating model, market tier, country, number of hotels and rooms, main purpose, who decides on AI, notes).
3. **Score the 8 categories.** For each one, drag the **range slider** (0 / 2.5 / 5 / 7.5 / 10) or click the level whose description matches the answer, then add a short note with the evidence.
   - If a topic wasn't covered, leave it unscored. It counts as **not assessed**, never as 0. Use "Clear score" to undo.
   - **AI spending:** enter the IT budget and the AI spend (the tool calculates the %), the % directly, a range, or "No AI spending".
   - **Span across departments:** mark each department Live / Pilot / None / N/A. A pilot counts half.
4. **Findings and evidence:** adoption, strengths, weaknesses, positioning, opportunities, plus up to 3 short quotes.
5. **Transcript (optional):** upload TXT, DOCX or PDF, or paste the text. It is only saved once you tick that names and personal details are removed, as the Project Plan requires. You can also store a link to the original file instead.
6. **Saving is automatic.** The status next to the score shows "Saved hh:mm". If the connection drops, changes are kept in your browser and offered back next time you open the interview.
7. **Download PDF** produces the one-page report for that interview.

Each interview has its own link (…/artifact/…#a-20261106-xxxx), so you can send a teammate straight to it.

## 3. How the score and bucket are calculated

**Pillars**
- **AI Maturity** is the average of Tech foundation, AI spending, Span across departments and Depth.
- **AI Strategy** is the average of Decision-making, Budgeting, People training and Data & measurement.
- All categories have equal weight by default.
- A pillar needs at least 3 of its 4 categories scored. Otherwise the interview shows "Not classified yet" and says what is missing.

**Overall score:** 50% Maturity + 50% Strategy, rounded to one decimal.

**Score bands:** LOW below 4.0 · MEDIUM 4.0 to 7.4 · HIGH 7.5 and above.

**Minimum requirements**, checked after the score:

| Bucket | Requirements |
|---|---|
| HIGH | AI live in at least 3 departments; at least 30% of the IT budget on AI; Depth at least 7.5; Strategy at least 5.0 |
| MEDIUM | AI live in at least 2 departments; at least 10% of the IT budget on AI |

- If a requirement isn't met, the interview drops one bucket and the tool states why. Example: "Scored 8.2 (HIGH range), but AI is live in only 2 departments; HIGH needs 3."
- Missing information can never give HIGH. MEDIUM is kept but marked **unverified** until it is confirmed.

**Category scoring rules**
- **AI spending score:** under 5% → 2.5 · 5–10% → 5 · 10–25% → 7.5 · 25% or more → 10 · no AI spending → 0. If only a range is known, it meets a spending requirement only when the whole range is at or above it. A range that straddles the requirement counts as unknown.
- **Span score:** (live departments + half the pilot departments) ÷ departments assessed × 10.
- **Depth:** score the most advanced AI that is live in daily use. Pilots don't count.
- **Data & measurement:** when data and measurement are at different levels, score the level the weaker of the two supports and note the gap.

**Recorded but not scored:** the purpose (Profit-driven, Efficiency, Competitive pressure, Guest experience) and who decides on AI.

**Several interviews with one company** are combined on the company page: category scores are averaged, and large differences between interviewees are shown.

## 4. Changing the framework (Alexis only)

**Framework → Edit**, then save as a new version (v2, v3 …).

- Interviews keep the version they were scored with, so nothing changes silently.
- Older interviews show what they would score under the new version and offer a **Re-score with vN** button.
- All earlier versions remain visible in the version history.

## 5. Exports and backups

- **Export CSV:** one row per interview currently shown, so set the filters first. It includes all details, category scores, pillars and buckets, and opens in Excel (semicolon-separated).
- **Back up (JSON):** a complete copy of all interviews. Download one after each interview day and keep it with the group's files.
- **Restoring:** there is no import button yet. To restore from a backup, ask Claude to write the records back into the tool.

## 6. Good to know

- The tool works only on claude.ai, online and signed in.
- **The data lives inside Alexis's tool.** If the tool is deleted, the data goes with it, which is why the backups matter.
- **Editing at the same time:** if two people edit the same interview at once, the last save wins. The tool warns you when a teammate has saved changes to the interview you have open, and offers to load their version.
- **Scanned PDFs** (images of text) can't be read; paste the text instead.
- **PDF font:** the report uses a standard font, so rare characters are simplified (e.g. "ł" prints as "l").
- **No AI analysis** of transcripts: scores are always set by the interviewer (group decision).
- **Notion sync** is planned for later.
- **Demo interview:** "Seeblick Hotels (fictional demo)" is an example. Archive it, or delete it permanently (owner only), once real interviews are in.

## 7. Technical notes

**Hosting:** a Claude artifact (static page) using Claude's built-in storage. No server, no API keys, no costs beyond Claude accounts.

**Files in `app/`**

| File | Purpose |
|---|---|
| `index.html` | Interface: overview, interview editor, framework settings |
| `engine.js` | Scoring and classification; no dependencies, also runs in Node |
| `report.js` | One-page A4 PDF layout |
| `flows.js` | Save and draft state machines (pure, also runs in Node; see `CLEANUP.md`) |
| `lib/` | Open-source libraries bundled with the page |

The bundled libraries are jsPDF 2.5.1 (MIT) for the PDF, pdf.js 3.11.174 (Apache-2.0) for reading PDF transcripts, and mammoth 1.6.0 (BSD-2-Clause) for reading Word transcripts.

**Storage**

| Path | Contents |
|---|---|
| `assessments/<ID>` | One record per interview, ID like `20261106-K7QX` |
| `transcripts/<ID>` | Transcript text, kept separately from the scores |
| `frameworks/v<N>` | Framework versions |

**Declared capabilities**

```json
{"db":{"rules":[{"path":"frameworks","read":"view","write":"owner"}]},"user":{"scopes":["profile"]},"downloads":{}}
```

The `frameworks` rule is what makes framework changes owner-only.

**Limits:** transcripts up to 80,000 characters; each record up to 256 KB; up to 25,000 records.

**Redeploying:** publish the `app/` folder as a Claude artifact with the capabilities above, then restore the latest JSON backup.

**Tests in `tests/`.** The browser tests need Playwright and Chrome, with `app/` served at http://127.0.0.1:8765; `mock_platform.js` stands in for Claude's storage.

| Test | Checks | How to run |
|---|---|---|
| `engine.test.js` | 39 scoring checks, incl. worked examples A–F from the framework doc | `node tests/engine.test.js` |
| `report.test.js` | One-page PDF layout | `npm install` in `tests/`, then `node tests/report.test.js` |
| `ui_test.py` | 36 checks of the full workflow (10 brief scenarios, sliders, transcripts, framework versions, exports, read-only mode) | `python3 tests/ui_test.py` |
| `save_state_test.py` | 11 checks on saving, blank new interviews and draft recovery | `python3 tests/save_state_test.py` |

**Changes**
- 06.11.2026: version 1 published with the demo interview.
- Fixes since:
  - incomplete shared records no longer break the overview;
  - the save status shows the real last-save time;
  - a blank new interview isn't saved until something is entered;
  - unsaved browser drafts are offered back.
