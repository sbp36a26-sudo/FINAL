# Prompt for Claude Code: fix the live v2.7 artifact (questions, legal leftovers, UX bugs, sources) → v2.8

You are Claude Code (Opus) working in Ludo's repo. Work only in `tools/readiness-2-questions/`, the questions-only copy behind the new artifact https://claude.ai/artifact/GAn4pWAX4YTkvBFcYYwkzs.
- **Never touch** `tools/readiness-2/` or Ludo's original artifact (https://claude.ai/artifact/MWMGc2VKc6zniRn8um27eH), or any other tab.
- Commit in small steps and don't ask questions. List any choice you have to make under "Judgement calls".
- Never invent facts, sources or test results.
- **No legal content anywhere.** Keep only the fixed disclaimer and the neutral sensitive-area flag.

Your v2.7 build matched the spec exactly. These fixes come from a live review of every question, the result page and every source.

## Inputs (in `tools/readiness-2-questions/spec/review/`)
- `usecase_questions_fixed.json`: the new question data (v2.8.0). It replaces `data/usecase_questions_only.json` and is the single source of truth.
- `sources_fixes.json`: 81 source changes.
- `live_review.md` and `live_review.xlsx`: the reasons for every change. Read section 3 (bugs B1–B12) and section 5 (sources).

## 1. Questions (commit 1)
1. Swap in `usecase_questions_fixed.json`.
   - Use every `text`, `why`, `area` and `who_answers` verbatim, in the given order.
   - The `review` field (OK/Fix/Rewrite/Add) is for the report only. Don't show it.
   - Result: 98 listed use cases and 743 questions, 6–12 each, no text shared between use cases.
2. **lg-2 is removed** (`removed: true`).
   - Hide it from the step-4 list and update every count the user sees.
   - A saved check with lg-2 must still open. Show "This use case is no longer in the list" and carry on as "None fits".
3. **Saves.** Map old answers with `carry_answer_from`.
   - Rewrites have `carry_answer_from: null`, so they start unanswered.
   - Drop answers to the ids in `removed_question_ids`.
   - Keep the existing notice ("N answers kept, M questions new").
4. **Checker.** Keep the existing rules (6–12 questions, at most 20 words, one question mark, no duplicates within or across use cases). Add two new checks:
   - fail on any question containing "that person", "that team" or "that manager";
   - fail if a use case lacks any of the six pillars. lg-4 is allowed to lack Technology.
5. **Names.** Show fb-6 and it-3 with their full names, or a short name plus the rest as a subtitle.

## 2. Action texts (commit 2, bug B11)
1. Write one action per step-5 question: imperative, at most 15 words, naming who does it. Example: "Agree with a supervisor to check every change the assistant makes."
2. Store them in `data/actions_questions_only.json` keyed by question id, and use them in the action plan and the PDF.
   - Planned → "Finish by <date>: <action>".
   - Don't know yet → "Find out: <action>".
   - Remove the "Make this a Yes:" and "Finish: <question>?" prefixes.
3. Test: every question id has an action, and no action ends with "?".
4. List all the actions in the report under "Texts I wrote".

## 3. Result page and logic (commit 3). Scoring formula and verdict rules stay the same.
- **B2:** If step 2 gives "Probably not worth it", or any step-2 answer is No, add a line to the verdict box: "Also: the first questions suggest this may not be worth doing with AI (<name>: No)", and make it the first action.
  - Test: step-2 No with everything else Yes gives Almost ready, and the line shows.
- **B3:** Label the score "Score: X% of points from all questions". Put the must-haves line first, in bold.
- **B4:** Show the sensitive hold once in the verdict box: "Almost ready: everything is in place, but this area needs an adviser's view first."
  - Show the flag box once.
  - Action 1 is "Ask an adviser before a pilot" (owner GM). Don't repeat the hold text in the actions.
  - If nothing else is open, say "Nothing else to fix."
- **B5:** The step-2 table shows the condition (Met / Not met / To find out), with "Your answer: …" underneath. Q1 = No must show Met.
- **B8:** Use "Don't know yet" everywhere, including step 2, badges, result text, PDF and help. Map old "Not sure" answers to it.
- **B9:** Work out the use-case count from the data. Never hard-code "90" or "99".
- **B10:** Remove "C-R-I-S-P". Use the heading "Should this problem be solved by AI?" and the five plain names.
- **Version:** show one version string: "v2.8 (rules unchanged since v2.6)". Remove the "rules v2.5" mention.

## 4. Saving, new check, export (commit 4)
- **B1: downloads give no file in the artifact frame.**
  - Use the artifact downloads capability if it is available.
  - Always offer "Copy plan" and "Copy saved check" (clipboard) and "Open printable page" (print view; the user prints with Ctrl+P).
  - If a download is blocked, say: "Your browser blocked the download. Use Copy or Print instead."
- **B6: "Start a new check".** Ask "Same hotel (<name>) or a different hotel?". Same hotel keeps step 1 only.
- **B7: saved checks.**
  - Save the moment a use case is picked.
  - Name checks "<hotel> · <use case> · <date>". For step-2 stops, use "Stopped at step 2: not suitable for AI".
  - Unfinished checks show "Not finished: step N".
  - Never delete a check automatically.
  - Storage: `window.storage` when present, then `localStorage` inside try/catch, then memory with a "Use Save as file" banner.
  - Test: create 3 checks, reload, all 3 are still listed.

## 5. Sources (commit 5)
Apply `sources_fixes.json` by its `action`:
- `remove`: delete the entry from that use case.
- `replace` or `add`: add the given text and URL exactly. These were checked live; don't add any others.
- `edit_text`: apply the `detail` to the text shown. For steps 1–3 this means deleting internal notes ("Later that day question 1 was turned round…", "PDF not re-opened in the audit", "to confirm against the ISO text") and rewording "14 EU allergens" to "common allergens".
- `add_url`: steps 1–3 citations get their verified URL. Make all source URLs clickable links that open in a new tab, and keep "Copy address".
- `needs_source` or `review`: change nothing in the data. List them in the report under "Still needs a source".

Also:
- Remove the duplicate EyeFeelIt entry (fo-7).
- Remove the 8 smoking-fee and smoking-sensor sources from hk-4, along with the dangling "see the Minut entry below".
- Remove the legal-type sources: the ICO order (hr-6), ISO 20380 (it-4), OneTrust (lg-2) and the KITRO "regulatory push" item (kc-1).
- me-6: add the line "No hotel example found; included because vendors offer it."
- Step 3:
  - MH8: drop the Eurostat "lack of expertise 70%" evidence (move it to the skills or training must-have if one fits).
  - MH9: reword the 9% line to "Only 9% of hotels surveyed had a formal AI strategy, a sign that written AI rules are rare too".
  - MH3 (OECD): add "manufacturing and ICT firms, not hotels".
  - MH5: word the 52% line as "concerns about personal data", with no legal framing.
  - Write "needed for n of the 90 use cases analysed (of 98)".

## 6. Tests (all must pass)
1. Every listed use case shows exactly its questions from the data file: text, order, why, area, who answers. Check this through `window.Readiness2.state()` and the DOM.
2. The checker passes, with counts 6–12 and 743 questions in total.
3. Scoring is unchanged: the v2.6.1 worked examples and the existing logic tests still pass. Add tests for B2 and B4.
4. The banned-term scan over the built `index.html`, a generated PDF's text and an exported file finds 0 hits. Add these words to the list: "delete", "deleted", "kept for", "retention", "consent", "regulator", "ISO", "regulatory".
5. Migration: a v2.7 save and a v2.6.1 save open, and an lg-2 save opens as "None fits".
6. Sources:
   - no source in `sources_fixes.json` marked `remove` is shown;
   - every URL in the built file starts with https;
   - no use case shows an empty source box (fa-6 and lg-3 now have sources; fa-7 shows "No working source yet").
7. Playwright at 1280×800 and 360×740:
   - run hr-1 all Yes (hold shown once);
   - run rm-2 mostly No;
   - stop at step 2 on Q1;
   - Copy and Print fallbacks work;
   - "Start a new check" offers the same-hotel choice;
   - 3 checks survive a reload.
8. `git diff --stat` shows changes only in `tools/readiness-2-questions/`.

## 7. Publish and report
- Bump to 2.8.0 and update CHANGELOG.md.
- Publish `tools/readiness-2-questions/index.html` as a **new** artifact titled "Do you need AI? (use-case questions v2.8)". Never use an existing artifact URL. If publishing isn't available, stop and give Ludo the steps.
- Report:
  - artifact URL or the reason it wasn't published;
  - file size and sha256;
  - commits;
  - test results (one line each);
  - Texts I wrote;
  - Still needs a source;
  - anything legal you found but did not remove;
  - Judgement calls.


---

# PART 2: SOURCES (do after Part 1, same session)

Use `spec/review/use_case_sources_corrected.json` as the sources input. It is the audited, corrected version (192 sources; 2 wrong and 34 minor errors already fixed; see `spec/review/source_audit.md`). Copy its contents word for word; do not edit quotes, figures, authors or years.

# Add-on prompt: swap in the new use-case sources (sources_v2)

Work only in `tools/readiness-2-questions/` and publish the result as a **new artifact**. Do not touch `tools/readiness-2/` or the existing artifacts (MWMGc2VKc6zniRn8um27eH, GAn4pWAX4YTkvBFcYYwkzs). Keep the flow order, the answers (Yes / Planned / No / Don't know yet) and the scoring exactly as they are. Do not add legal or regulatory content.

Input: `spec/review/use_case_sources_corrected.json` (copy it next to the tool's data). Its `use_cases` object is keyed by use-case id, and each id has:
- `examples_and_sources`: a list of `{text, score, fit, replaces, url}`;
- `gap`.

1. **Add the entries.** For each use case, append the `text` of every entry to that use case's "Examples and sources (N)" list. Keep the existing format, `Org: summary (type, date; caveats) | URL`, and update N. Sort the list: score 7+ with `fit: "direct"` first, then 7+ partial, then the rest.
2. **Swap the broken links.** Where `replaces` names an old source, remove that old source:
   - Oracle Barceló (fo-5);
   - justt.ai/hospitality (fa-7);
   - the Juniper citizenM link (it-5).

   Also apply the earlier `sources_fixes.json` removals if they are not done yet.
3. **Do not re-word quotes, figures, sample bases or dates.** Copy `text` as given. Every quote has been checked against the abstract, PDF page or web page (25 Nov 2026).
4. **Show the credibility bar.** Add a small badge or label to each source: "Credible (7+)" or "Below 7". Add a "Partial" label when `fit` is `partial`.
   - Eurostat rows are always "partial": they show EU accommodation adoption of the AI technology type, not the exact use case.
5. **Show gaps honestly.** If a use case has no `fit: "direct"` entry at 7+, add the line "Evidence that this exact use case is used in hotels is still thin." under its sources. Do not invent or add other sources.
6. **Check your work.**
   - All URLs open. DOI links resolve to publisher pages, and some of those block bots; that is fine.
   - The source counts in the UI match the JSON.
   - Nothing outside the sources lists changed (run the existing question/score diff checks).
   - Bump the version label.

   Then publish as a new artifact and report its link.
