# Challenge round: the sceptic

*18 Nov 2026. Files are in this note's parent folder unless stated; "trials" = the three files in `trials/`.*

**Position.** Retention is the wrong goal. The tool is used once per tool decision and perhaps once more before signing. Make that visit correct and forwardable, add three cheap return aids, and stop.

## 1. Is retention the right goal?

No. The research says so itself, then plans for retention anyway.

- Repeated assessments are repeated because a funding rule, an expiring certificate or a data feed forces it; free voluntary graders are "built for one visit" (`retention_mechanisms.md` §1 takeaway). The check has none of the three.
- "The habit literature argues against expecting a habit at all here" (`retention_mechanisms.md` §2 inferences).
- No return-rate evidence exists for any readiness self-check (`value_and_feasibility.md` A2 gaps; `customer_journey.md` §6 gaps).

Honest frequency (my estimate, no data): one check per tool under consideration, a second pass days or weeks later when finance, IT or the vendor have answered (the return both Sophie and Marta describe in the trials), possibly a third after a pilot. For an independent hotel, a handful of sessions a year.

Success: (a) a hotelier finishes without help; (b) the verdict matches what the interviewing team member would have said; (c) the page is forwarded to an owner or the gap list to a vendor; (d) at least one hotel does a "before signing" second pass. Report as "3 of 6 hotels", never a rate (`customer_journey.md` §6).

## 2. Theatre, out of reach, and worth building

**Out of reach on this platform** (`value_and_feasibility.md` B1 and B2):
- Email or push reminders: no capability sends them.
- Calendar file: `.ics` is not an allowed download.
- Workspace, roles, multi-respondent hand-over, share links: outside viewers cannot write to the database at all.
- Even the "feasible now" table is read from type files, "not tested in a browser" (B1 gaps).

**Theatre:**
- Benchmarks. There is no data, and the earlier review already forbids "hotels like yours score X" (`value_and_feasibility.md` A1, citing `review_result_report.md`).
- Portfolio and 45-hotel view: requested by the one persona who would not use the tool for his own decisions (CIO trial §8).
- Eight-stage lifecycle with stage-aware proof (`customer_journey.md` §3), though §1 admits reliable durations "do not exist".
- AI Act dates as return triggers: honest only if the questions change on those dates (`retention_mechanisms.md` §3); they do not.

**Worth building now (three only):**
1. Dated snapshots with "since last time: 2 of 7 must-haves closed". All three trials found the overwrite.
2. An "open items only" re-check, jumping from a gap to its question. Marta needed 9 clicks through six steps to change two answers.
3. Export and re-import of the hotel's own file: the register has the pattern, and it is the only cross-device route (`value_and_feasibility.md` B2).

## 3. Where the research over-reaches

- Three of four notes state up front that every web finding is a search summary, never opened (`retention_mechanisms.md` line 5; `trust_and_credibility.md` line 5; `value_and_feasibility.md` line 8). None of those figures can go into the report unchecked.
- EDIH analogy does not transfer. The DMA is mandatory, tied to funded support, and "filled in through an authorised hub, not directly by the SME" (`trust_and_credibility.md` §1). The "90% improve" figure has no visible base and the note itself warns against using it (`retention_mechanisms.md` §1).
- Certificate analogies (Cyber Essentials, Green Key, BREEAM, B Corp) rest on audit and expiry. A "valid as of, re-check after" date borrows the look of a certificate for a tool that verifies nothing.
- Vendor benchmarks (Pendo, Userpilot, Amplitude, email click rates; `retention_mechanisms.md` §2) describe software used daily; no bearing here.
- Invented timings. "12 to 15 minutes" is computed from 200 words a minute plus fixed seconds per question (`Hotel AI readiness check design/review_user_journey.md` line 29), not measured. Marta's time was "not measured with a human". Budget and owner-reporting rhythms have no European source (`retention_mechanisms.md` §3 gaps).
- The "credible minimum before an association puts its name on it" is the researcher's judgement (`trust_and_credibility.md` §4 gaps).

## 4. The trials

**Agreement (treat as established):** lost focus after the hotel name; search failing on "chatbot" and "food waste"; a fixed verdict sentence that contradicts the answers; result overwritten with the old date; proof notes missing from result and PDF; no notice before answers go to the team; the "What good looks like" lines carry the value.

**Where they may be wrong or unrepresentative:**
- "Would come back if..." is a stated preference from an AI persona: the weakest evidence in the folder, and the basis of most return features.
- Agents finish. A real GM may leave when search fails in the first 20 seconds; completion is untested.
- The "x" proof exploit came from an adversarial tester. A hotelier has little reason to cheat a free self-check; it matters because the page is forwarded, so the fix is printing the proof, not policing it.
- The CIO's legal table is "the persona's expert reading, not legal advice" (CIO trial §11); hard-coding it would repeat the fault it criticises.
- All runs were local; the hosted save path was "not tested here" (F&B trial §5).

## 5. The single biggest risk

A reproducible wrong verdict carrying HFTP's name. Today: "100, Ready to scale" for a high-risk recruiting tool with "x" as proof; 96 with the AI Act question answered No (CIO trial §3); "Technology 0%" on a luxury resort because the F&B director did not know (F&B trial §3); "name an owner, set a budget" told to hotels that have both. Thresholds are still "team judgement" (`trust_and_credibility.md` §5).

Every return feature multiplies this. "19 to 25" is a change on an unvalidated scale that looks like measurement; history, comparison and portfolio views spread the error across more screens.

## 6. Recommended next build (10 items, in order)

The eight approved changes are the core; this list orders them and adds only what the trials force.

1. **Notice before the first question; lock the `readiness` collection and the team page.** The tool asks about lawful basis and has none (`value_and_feasibility.md` B1 inferences).
2. **"Not sure" becomes "to find out", not No.** No 0% bar from unknowns; show "13 of 21 answered, 8 to confirm". Otherwise the score measures the respondent.
3. **Verdict text built from the open items; headline "N of M must-haves open", not a capped 39.** Removes the contradiction all three trials saw.
4. **Drop "Ready to scale".** No question asks about a pilot (CIO trial §6).
5. **High-risk tools: the legal item becomes a must-have and a flag that says "get this checked", with no article numbers until D7 signs off.** Vague is safer than wrong.
6. **Print proof notes and who answered, labelled "self-declared".** This is the honest answer to gaming.
7. **Approved content work: 34 rewritten questions, tick lists, action and vendor question per gap, all gaps shown.**
8. **Dated snapshots with "since last time" in must-haves closed, not points.**
9. **Open-items-only re-check and jump to question.**
10. **Hotel file export and import; plus a half-day sensitivity run on thresholds and a verdict-against-interview comparison** (`trust_and_credibility.md` §4, steps 3 and 5).

**Not now**
- Join with the AI Register / per-tool file: waits for D7 label sign-off.
- Separate client-facing artifact: until then hotels do the check with a team member.
- Two-tool comparison, carried-over hotel answers, pilot card: second order; nobody has run a pilot through it.
- Country-specific legal wording: needs a lawyer, not a build.
- Owner business-case template with cost fields: page 1 of the approved PDF first; see if anyone forwards it.

**Never (in this project)**
- Benchmarks or "hotels like yours": no data, small-number risk.
- Email reminders, calendar files, team-sent nudges: platform cannot, and nobody owns them after the project ends.
- Accounts, workspace, roles, portfolio: a hosted product; a recommendation to HFTP in D8, not a build.
- Badges, levels, certificates, "valid until": self-declared answers cannot carry them.
- Calculated ROI, or an email gate before the result: no source for the first; the second turns an association tool into a funnel.

## 7. Questions to the other critics

**To the hotel-operator advocate**
1. Which return feature would you still defend if the only evidence allowed were what a real hotelier did, not what AI personas said?
2. Henrik never opens the tool. Why is the answer a workspace and not one better page of PDF?
3. If only one fits before the next interviews, "Not sure is not No" or history with comparison: which, and why?

**To the method, legal and privacy auditor**
1. Expert panel, hotel pilot, paired respondents, sensitivity run: which one step do you keep if the team has one week?
2. Is naming German and Austrian co-determination paragraphs from an unverified persona reading more defensible than "staff representatives: get legal advice in your country"?
3. Provenance chips on every question: evidence that business users read them, or decoration that lets a wrong verdict stand with a footnote?
