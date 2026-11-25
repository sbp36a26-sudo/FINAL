# Prompt for Claude Code: make the use-case questions unique to each use case, and remove legal content (v2.6.1 → v2.7.0)

You are Claude Code (Opus), working in Ludo's repo `sbp36a26-sudo/FINAL`. Work on your own, in small commits, and don't stop to ask questions. Where this prompt leaves a choice open, pick the most conservative option and list it under "Judgement calls". **Never invent facts or test results.**

## Goal

The step-5 questions ("Questions for this use case") in "Do you need AI?" v2.6.1 come from a generic six-area template that has been reworded per use case. Replace them with the questions in `usecase_questions_only.json`: 99 use cases, 6 to 12 questions each, 723 in total, with no question text shared by two use cases. Each question is specific to that use case's systems, data, staff and guest touchpoints.

Ludo has also decided that **the tool contains no legal content**. Remove it from the whole tool, as set out in §4.

**Everything else stays as it is:**
- the flow order (Cover → 1 Hotel → 2 the five questions → 3 must-haves → 4 use case → 5 use-case questions → Result);
- the answer options (Yes / Planned / No / Don't know yet, with "By when?" for Planned);
- the scoring formula, the verdicts, the cut-offs and the holds (except the one hold in §4.3);
- the UX, the result page layout (minus the legal parts), the PDF layout (minus the legal parts), storage and file save/open.

**Not in scope:**
- gates ("how will the tool work" questions);
- question weights or blockers;
- new answer options;
- anything else from the v3 spec.

Ludo may want those later as a follow-up. Mention it in the report and don't build it.

## 1. Hard rules

1. **Publish as a new, separate artifact. Never touch the existing one.**
   - Copy `tools/readiness-2/` to `tools/readiness-2-questions/` and work only there.
   - Don't edit `tools/readiness-2/`, `tools/index.html`, `tools/build-hub.mjs`, the hub or any other tab.
   - Never give the Artifact tool the URL https://claude.ai/artifact/MWMGc2VKc6zniRn8um27eH, and never attach it with `/artifacts`.
   - Without an existing URL, publishing creates a new artifact.
2. **One self-contained file.** `node tools/readiness-2-questions/build.mjs` writes `tools/readiness-2-questions/index.html` with everything inlined, the same way v2.6.1 does it.
   - Use no CDN and no external fonts or scripts.
   - Add no new npm dependencies.
3. **Use the question data verbatim.** Use the texts and "why it matters" lines from `usecase_questions_only.json` exactly as they are written.
   - Don't reword, merge, reorder or shorten them.
   - If you think a question is wrong, leave it in and list it under "Suggested content changes" in the report.
4. **Keep the app working.** All existing tests that don't depend on the old question texts or on legal content must pass after every commit. Update the tests that do depend on them, and say which ones you changed and why.
5. Change the tool id and the storage key to `readiness-2-questions` / `hftp-readiness2q-v1`, and the version to `2.7.0`. Add `CHANGELOG.md` there.

## 2. Read the code first (commit 1: copy only)

Before you change anything, read these and write down how they work in `tools/readiness-2-questions/NOTES.md`:
- `data/build-questions.mjs`: the generator. It turns the workbook rows and add-ons (`sens`, `pay`, `hw`, `auto`) into the 661 questions, then applies `data/overrides.json` and `data/wording.json`.
- `data/usecase-questions.json`: the generated question list.
- `data/check-questions.mjs`: the checker. It currently allows 6 to 10 questions per use case and up to 30 words.
- `data/wording.json`, `data/explain.json`.
- `src/logic.js`: scoring, holds and `JUDGEMENT`, plus `LEGAL_HOLDS_TOP` and where the AI Act label comes from.
- `src/flow.js`: storage, migration and file open/save.
- `src/app.js`: rendering, the "Why this matters" link, hub messages and downloads.
- `src/pdf.js` and `src/content.js`.

For each question, note which fields it carries, for example id, area, who answers or acts, action text and why text. Note how answers are keyed in storage and in saved files, for example `useCaseId:questionId`. Note where every piece of legal content lives.

## 3. Replace the question data (commit 2)

- Make step 5 read its questions from `data/usecase_questions_only.json`, copied in unchanged from the spec folder.
  - For each use case, in order: `id`, `text`, `why`, `area` (the v2.6.1 area names), `who_answers` (the v2.6.1 labels), `origin`, `old_id`, `carry_answer_from`.
  - The generator and the add-on questions no longer produce step-5 questions. Keep the add-on flags only where other code still reads them, and list that code in NOTES.md.
- Map each field onto the existing question shape:
  - `why` goes into the existing "Why this matters" fold;
  - `who_answers` goes into "who answers or acts".
  - If each question needs an **action text** for the action plan, reuse the tool's existing way of making it. If it can only come from per-question data, write one short imperative per question in the tool's existing style. Keep these in a separate file `data/actions_questions_only.json` and list them in the report.
- **Checker:** change it to 6–12 questions per use case and at most 20 words. Keep the other checks (one question mark, no duplicates within a use case). Add a check that **no question text appears in two use cases.**
- Use-case names: two use cases are renamed in the data (lg-2, lg-3, `old_name` given). Show the new names.
- **Ship only the runtime fields.** `original_questions`, `old_name` and `counts` are review records, and some quote the old legal wording. Don't inline them. Migration needs only `carry_answer_from`.
- **Scoring:** no change except the question count. Every step-5 question still counts the same as in v2.6.1. The hold "fewer than half the questions for this use case are Yes" stays.

## 4. Remove legal content from the whole tool (commit 3)

### 4.1 What to remove (in the copy only)
- the EU AI Act result section and the provisional label (high-risk, transparency, prohibited, minimal), plus "Add to the AI Register";
- the legal warning, country legal notes and "items to check";
- legal vendor questions, and legal-duty wording in the must-haves and the help texts;
- article numbers;
- legal sources in "Details and sources" and "How this was worked out";
- the PDF's AI Act section and the "not legal advice" footer;
- links or hub messages that open the AI Act guide or the AI Register;
- any legal text in the inlined catalogue data that this tool shows. Strip those fields in the copy and keep the plain description and "how the AI works".

### 4.2 What to put in instead (verbatim, from `fixed_texts` in the data file)
- Disclaimer on the cover, the result page and the PDF footer: "This check does not cover legal requirements. Check those with your adviser before you start."
- Must-have 5 becomes title "Personal data known" and text "Do you know which guest or staff personal data the tool would use?". Keep its id and its scoring. Rewrite or remove any of its help text that cites law.
- Sensitive-area flag, shown on the result and the PDF only for use cases with `sensitive: true` (12 of them): "This area involves people's personal data or jobs and has extra rules. Ask an adviser before a pilot."

### 4.3 The one logic change
`LEGAL_HOLDS_TOP` currently holds the top verdict when the register gives a high-risk label or the workbook flags sensitive data. That label no longer exists. The hold now applies exactly when the chosen use case has `sensitive: true`, with the reason text `sensitive_hold_reason`. Everything else about the hold (it turns Ready into Almost ready) stays as it is. Rename the switch to `SENSITIVE_HOLDS_TOP`.

### 4.4 Banned-term scan
Add `tests/no-legal.test.mjs`.
- It searches the **built `index.html`**, the text of a generated PDF and an exported plan or saved file. The search is case-insensitive and on whole words.
- Banned terms: `AI Act`, `Article`, `Art.`, `Annex`, `high-risk`, `transparency obligation`, `prohibited`, `DPIA`, `GDPR`, `FADP`, `CE mark`, `works council`, `PCI`, `consent`, `legal basis`, `law`, `laws`, `regulation`, `compliance`, `legal`, `not legal advice`.
- Only the disclaimer and the sensitive-flag strings are allowed.
- The result must be **0 hits**. If a vendored library such as jsPDF trips a term in code rather than in text, you may exclude that exact span, listed with a reason.
- In the report, list every legal item you found but did not remove.

## 5. Saves and migration (commit 4)

- Saves from v2.6.1 must still open: both the "Save as file" format and an old storage record, if one can be imported.
- Migrate step-5 answers with `carry_answer_from`:
  - the new question takes the old answer, and the "By when?" date, from that old question id in the same use case;
  - `null` means the question starts unanswered.
  - Answers to old ids that no longer exist are dropped. `original_questions` lists each one's status: removed, merged or dropped.
- After opening, show: "This check was made with an older question list. N answers were kept, M questions are new." Then open the first unanswered step-5 question.
- Hotel profile, step 2 and must-have answers migrate as they are. Must-have 5's answer is kept.
- Add fixtures: one v2.6.1 saved file and one storage record (use the existing test fixtures if there are any), and a test that answers carry over by id.

## 6. Downloads in a standalone artifact

v2.6.1 hands the PDF to the hub with `postMessage` because the viewer blocks downloads from inside frames. The new artifact has no hub.
- Use the artifact **downloads capability** for the PDF and the saved file.
- Keep a **Copy** fallback (plan text, and the saved check as JSON).
- Remove the hub-only messages that no longer apply, but keep the `ping` check harmless.

## 7. Tests (must all pass)

1. **Exact questions per use case:** for all 99 use cases, the step-5 screen shows exactly that use case's questions from the data file, in the same order and with the exact text, why line, area and who answers. Check this through `window.Readiness2.state()` and in the DOM.
2. **Counts:** every use case has 6–12 questions (data file counts: 40×6, 26×7, 15×8, 9×9, 2×10, 4×11, 3×12; 723 in total). No text is shared between use cases.
3. **Scoring unchanged:** using the existing logic tests, recompute the v2.6.1 worked examples A–F with each use case's new question count. Formula, cut-offs and verdict precedence are the same. Also show that with the same proportion of Yes / Planned / No / Don't know yet answers, the verdict is the same as v2.6.1.
4. **Sensitive hold:** a use case with `sensitive: true`, answered all Yes, gives Almost ready with the hold reason. Test hr-1, hk-6 and hr-2. A use case without it, such as rm-1 answered all Yes, gives Ready.
5. **No legal content:** `no-legal.test.mjs` finds 0 hits. There is no AI Act section on the result page or in the PDF. The disclaimer appears on the cover, the result and the PDF.
6. **Migration:** the fixtures from §5 pass.
7. **Smoke test with Playwright** at 1280×800 and 360×740:
   - a full run for rm-1, gx-2 and hr-1 (all Yes, then one No);
   - Back keeps answers, and a reload resumes;
   - save as file, then open it again;
   - the PDF is generated;
   - no horizontal scroll at 360 px.
8. **Isolation:** `git diff --stat` shows no changes outside `tools/readiness-2-questions/`.

## 8. Publish as a new artifact (last commit)

1. Build, run every test, and do a final Playwright run on the built file.
2. Use the Artifact tool to publish `tools/readiness-2-questions/index.html` as a **new** artifact titled "Do you need AI? (use-case questions v2.7)". Don't give it any existing URL. If the tool says it would update an existing artifact, stop and report.
3. Limits that apply:
   - the page must be 16 MiB or smaller (aim for under 3 MB);
   - only a few CDN hosts are allowed, and you use none;
   - page-started downloads are blocked unless the downloads capability is used;
   - artifact storage on new artifacts allows up to 100 MB.
   If the code uses `localStorage`, wrap it in try/catch and fall back to memory with a "use Save as file" banner.
4. If publishing isn't available in this session (no claude.ai login, an API-key session, or a cloud provider), don't try to work around it. Report it and give Ludo these steps: sign in with `/login`, then ask "Publish tools/readiness-2-questions/index.html as a new artifact", then share it from the page header.

## 9. Report (return exactly this)

```
## Result
New artifact URL: … (or "not published: <reason>")
Output: tools/readiness-2-questions/index.html (<KB>, sha256 …) · version 2.7.0
Commits: <hash> <message> …
## Where the question data lived / what I replaced
…
## Tests
exact questions 99/99 · counts ok · scoring unchanged … · sensitive hold … · banned terms 0 · migration … · Playwright desktop x/y, mobile x/y · isolation ok
## Legal content removed (by file) / legal content left (file:line, reason)
## Texts I wrote (action texts, migration notice, anything not in the data file)
## Suggested content changes (not applied)
## Judgement calls
## Optional follow-up for Ludo
Gates and weights from the v3 spec (not built).
```

## Files with this prompt (in `tools/readiness-2-questions/spec/`)

- `usecase_questions_only.json`: the data. It is the single source of truth.
- `usecase_questions_only.xlsx`: a readable copy (Use cases, Questions, Original 661, Summary). Don't parse it.
- `build_questions_only.py`, `flatten_rules.py`, `make_xlsx.py`: how the data was made from the v3 spec. For reference only.
