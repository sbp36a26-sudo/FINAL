# Critic 3: method, legal and privacy auditor

*18 Nov 2026. Scoring claims re-run in Node against `tools/readiness-check/src/logic.js` (rules v2), on AI recruiting (`hr-2`, 26 questions, 8 must-haves) and all 90 tools. The shipped tests pass (13 of 13) and cover none of the faults below.*

**Position.** The verdict is a rule on must-haves and the weakest area; the 0–100 number plays no part in it and is false precision. Fix the rules, drop the number, state the law as the team's own deep dive states it, and keep real hotels out of the hub until three privacy fixes ship.

## 1. Scoring integrity

| Claim | Result (source) | Smallest fix | Effect on saved results |
|---|---|---|---|
| All Yes, proof "x" = 100 | **Confirmed**: 100, Ready to scale. `evaluate()` accepts any non-blank proof | Proof needs 3+ words; print proofs in the report; label the result "self-declared". No rule verifies truth, so the label matters most | Junk-proof results fall to "foundations" |
| Must-haves Yes, rest "Does not apply" = 96 | **Confirmed**: 96, Ready to scale, with the AI Act item at No. "Does not apply" leaves the denominator (`check.js` line 65) | No "Does not apply" on risk add-on items; a one-line reason elsewhere; an area with under 3 scored questions blocks the top verdict | Heavy "Does not apply" results drop one level |
| Flat cap at 39 | **Confirmed**: 1 unmet (average 98) and 8 unmet (average 83) both show 39 | Drop the capped number. Show verdict, "7 of 8 must-haves met", six area bars | Verdicts unchanged; `raw` is already saved |
| "Not sure" = "No" | **Confirmed**: `POINTS.u = 0`; all "Not sure" = all "No" = 0 | Count unknowns separately; show a range (low = today's figure, high = unknowns as Yes) | Today's figure survives as the lower bound |
| Fixed verdict text | **Confirmed**: `check.js` lines 94 and 164 print one fixed sentence per level | Build it from `ev.unmet` and `ev.capWhy`, which exist | None |
| Weights vary fourfold | **Confirmed**: in `hr-2` one Data question moves the average 8.3 points, one Organisation question 2.1. Across the 90 tools the largest area has 1.3 to 5 times the questions of the smallest (median 2.5) | Do not reweight. Drop the composite; apply the 40/75 rule only to areas with 3+ scored questions | Verdicts change only where a 2-question area set them |

Also confirmed: 15 of 90 tools carry the blank "…needs here: —?" question (the `res` filter in `selectQuestions()` misses the dash).

**Minimum answered share: yes.** No verdict unless every must-have is known and at least 75% of all questions are; otherwise "Not enough information yet: 8 answers to confirm with finance, IT, legal". The 75% is team judgement and must be labelled so.

## 2. Stage problem

Confirmed: Yes with proof on everything except "Not sure" on data link (T1), vendor agreement (D5) and override (P5) gives 39, with an area average of 83.

Proposal, one question set:
- One start question: "Where are you?" Exploring / vendor chosen, not signed / pilot running or finished.
- One tag per question: hotel-side, vendor-dependent or pilot evidence. Split D5, which mixes lawful basis (hotel) and vendor agreement (vendor).
- Before a vendor is chosen, vendor-dependent items become unscored "Ask the vendor" items.
- The verdict names the next decision: "Ready to approach vendors", "Ready to sign a pilot", "Ready to scale".

**"Ready to scale" must not be reachable without pilot evidence.** No question asks whether a pilot ran. Add at most three pilot questions, shown only at the third stage; until then the top verdict is "Ready to pilot".

## 3. Legal accuracy

Measured against `reports/EU AI Act hospitality deep dive.md`; the Register's rule applies here too: "items to check, never a compliance verdict".

- **Dates.** High-risk duties for employment tools apply from 2 Dec 2027 (Omnibus, deep dive lines 25–39). The `hr-2` line "High-risk AI under the EU AI Act (employment) – human oversight, DPIA" reads as a present duty. Say "high-risk from 2 Dec 2027" and list the Art. 26 duties.
- **A DPIA is a GDPR Art. 35 duty that applies now**, not an AI Act duty. The tool says "likely needed, ask your data protection officer".
- **Chatbot notice.** `gx-2` and `res-1` tell the hotel to "disclose AI (AI Act Art. 50)". The deep dive (line 119) reads Art. 50(1) as the provider's duty; a hotel deploying a vendor bot "has no duty under that paragraph". Reword to "check the vendor's notice is switched on".
- **Workers.** Art. 26(7) is information only, to employers, from 2 Dec 2027 (deep dive line 102). Candidates fall under Art. 26(11), not the staff question. National labour law may demand agreement, not information. The tool says that and cites no national articles: the German and Austrian sections in the CIO trial are the persona's reading, unverified by its own note. `XG` fires for BI dashboards but not for security video analytics (`it-4`).
- **Never say:** "compliant"; "required by the AI Act" for GDPR or labour items; "see D7" (in 14 resource lines). A private hotel owes no fundamental-rights impact assessment (deep dive line 107).
- **Country.** `selectQuestions()` reads `hotel.type` and never `hotel.country`. Minimum honest wording: "Legal items refer to EU law (EU AI Act, GDPR) and are the same for every country; your country does not change the questions yet. In Switzerland and the UK other laws apply and the EU AI Act applies only in some cases. Items to check with your adviser, not legal advice." Better: reuse the Register's country notes and write none.
- **Sign-off:** the D7 owner for every law label (the Register already requires this); a qualified lawyer for any national labour statement; EHL's data protection contact for the notice and controller; coach and HFTP for any use of HFTP's name.

## 4. Trust

Of the 15 items in `trust_and_credibility.md` section 6:

- **Necessary before any real hotel:** 1 notice, 2 collect less, 3 remove wrong verdicts, 4 "how it works and what it cannot tell you", 6 who made it, 8 clean language (approved), 13 version and date.
- **Necessary before HFTP members:** 7 publish the instrument, 9 expert review, 10 pilot.
- **Over-engineering now:** 5 as six labels on every question (the Register's three, on legal items and thresholds, are enough), 11 two-respondent checks, 12 sensitivity runs, 14 benchmarks, 15 a maintenance cycle (state an end date and a deletion date instead).

**Claims to avoid:** validated, benchmark, index, certified, compliant, HFTP standard or endorsed, "research shows" without a named source, "user-tested". The three trials are simulated personas in a headless browser: sound for bugs and score reproduction, not evidence of what hotels think.

**Cheapest real validation, no guide changes:** after each interview, starting with Accor on 19 Nov, the note-taker fills the check from the notes alone and the lead writes the expected verdict blind. Report matches as a count with its base.

## 5. Privacy and access

Facts: `hub-bar.html` passes `list`, `set` and `delete` on `readiness` to any tab with no role check; `team.js` `load()` lists everything; the only notice appears after saving (`check.js` line 99); the proof examples in `logic.js` `EVIDENCE` invite a staff name and a budget figure.

**Minimum fix:**
1. A rule on `readiness`: read at editor level, write at contributor level.
2. The bridge refuses `list` and `delete`, and the team tab is hidden, unless the viewer can edit. `store.js` must stop using `list` as its probe.
3. Sharing becomes an unticked opt-in; the default is this browser only. The shared copy leaves out proof notes and the respondent's name.

**Stop collecting:** respondent name (keep role), staff names in proof (examples show roles), exact budget (bands; "EUR 6,000" is also unsourced), hotel name in the shared copy.

**Notice (59 words; bracketed items to be confirmed):** "This check is run by EHL student project Group 36 for HFTP. Your answers stay in this browser unless you tick 'Share with the project team'. If you share, only the team and its coach read them, for this research, until [date], then they are deleted. Do not name staff or guests. To delete sooner, write to [address]."

**Should a real hotel use the current hub? No.** A hub link shows every other hotel's check through the team tab. Until fixes 1 to 3 are live, hotels get the stand-alone page (browser storage, PDF).

## 6. Evidence not to rely on

- Every retention figure in `retention_mechanisms.md` lines 98–105 (vendor data, bases not visible) and its "90% improve on re-assessment" figure.
- Validity cut-offs and pilot sizes in `trust_and_credibility.md` section 4: the summaries disagree.
- Hotel buying figures in `customer_journey.md` (25% ease of use, shortlists of two or three, "90% pilot, 30% embedded"): vendor-sponsored or estimates without a base.
- National penalty laws (deep dive line 144) and all national labour-law citations.
- Platform behaviour in `value_and_feasibility.md` B1: read from type files, never run.

## 7. Next build, in order

1. Access rule, bridge gate, opt-in sharing, notice: nothing else matters if hotel data leaks.
2. Collect less.
3. Unknown handling and the minimum answered share: the largest source of wrong results.
4. Stage question and tags; top verdict needs pilot evidence.
5. Close the "Does not apply" and proof holes; print proofs; "self-declared".
6. Drop the composite number; verdict, must-haves met, area bars.
7. Verdict text built from the unmet items.
8. Legal rewording under 3, with three labels and the country sentence.
9. "How it works and what it cannot tell you" panel.
10. Tests for every case in section 1.

**Must not ship until signed off:** law labels and article references (D7 owner); national labour statements (lawyer); the notice and controller (EHL); HFTP's name beyond "student project for HFTP"; any benchmark; the words "validated" or "piloted"; emails to hotels; a hub link to any hotel.

## 8. Questions to the other critics

**To the sceptic:** A 0–100 figure the verdict never uses is scope with negative value: do you cut it? And which of my items 1 to 5 would you drop and still let a hotel in?

**To the operator advocate:** Every return feature you want (history, reminders, benchmarks, a second respondent) needs stored hotel data and a controller. Who is that after the project ends, and what do you tell a hotel whose saved check is deleted?

**To both:** A hotel that answers honestly before choosing a vendor is told "Do not buy yet". If that is an artefact, why would any feature come before the stage fix?
