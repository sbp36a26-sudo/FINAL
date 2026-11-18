# Rebuttal: the sceptic

*18 Nov 2026. Round 2.*

## 1. Answers

**Operator 1 (the goal; Marta's second visit).** A correct decision before signing, on a page that gets forwarded. My items 8 and 9 are your item 8. The second visit shows "2 of 7 must-haves closed, 5 open" and opens on the open items.

**Operator 2 (owner-page fields).** Keep who asks, tool, verdict, conditions, proof lines, date, and cost as an optional typed field. Cut the benefit figure. A number typed by the requester is an unsourced claim under HFTP's name. Replace it with one line: "what should improve, and the baseline measured today".

**Auditor (cut the 0–100?).** Yes. `evaluate()` in `logic.js` sets the level at lines 124–128 and computes the score after, at line 129; it decides nothing.

**Auditor (which of items 1 to 5 to drop?).** None in full. Two parts go: the 75% threshold in item 3 and the pilot questions in item 4.

**Both (anything before the stage fix?).** Only the privacy fixes.

## 2. Where I concede

- **Stage question.** I called it theatre. The auditor reproduced a 39 with an area average of 83 from three vendor-side "Not sure" answers (auditor §2). One start question and one tag per question is a correctness fix.
- **Privacy scope.** "Notice and lock" was too thin. The bridge passes `list` and `delete` to any tab (auditor §5), so opt-in sharing and collecting less come first.
- **Vendor sheet.** It regroups the approved vendor question per gap. Four of Marta's seven unmet must-haves need the vendor (GM trial §2).
- **"Copy questions for IT".** Plain text; no platform dependency.
- **"Does not apply" hole.** I missed it: 96 with the AI Act item at No (auditor §1).
- **Sensitivity run.** Dropped; the blind interview comparison is better.

## 3. Where I still disagree

1. **The 75% answered threshold (auditor).** One unvalidated cut-off replaces another; the auditor calls it "team judgement". *Settles it:* run the trial answer sets both ways; if 75% changes no verdict beyond the must-have rule, it is dead weight.
2. **"My checks" and carry-over (operator).** No real hotel has checked a second tool, and it stores more hotel data with no controller after the project ends. *Settles it:* one interviewed hotel asking to check a second tool.
3. **Pilot questions now (auditor).** Unresearched questions for a stage no user has reached. *Settles it:* one hotel with a finished pilot.

## 4. Rulings

- **(a) Number:** drop it. Verdict, "N of M must-haves met", area bars.
- **(b) Verdict under unknowns:** neither as written. An unknown must-have means no final verdict: "Not enough information yet", plus the conditional line "if these N are confirmed: Ready to pilot". No 0% from unknowns, no 75% rule.
- **(c) Owner page and vendor sheet:** next build, minimal: vendor sheet as copy text; owner page as PDF page 1, no benefit figure.
- **(d) "My checks"/carry-over:** not now.
- **(e) "Ready to scale":** remove now; top verdict is "Ready to pilot". Earn it later, with questions written from a real pilot.

## 5. Merged build list

1. Access rule, bridge gate, opt-in sharing, notice first, collect less. *All three agree.*
2. First minute: search, focus bug, the blank "—?" question (15 of 90 tools, auditor §1). *All three agree.*
3. Unknowns: "to find out, ask (role)", no 0%; conditional verdict. *All three agree; 75% threshold disputed.*
4. Stage question; vendor items "to confirm before signing". *All three agree.*
5. Drop the composite; verdict text built from `ev.unmet`. *Disputed: operator has not ruled on the number.*
6. Remove "Ready to scale". *All three agree; pilot questions disputed.*
7. Close "Does not apply" and proof holes; print proofs and role, "self-declared". *All three agree.*
8. Legal rewording as "items to check"; D7 sign-off. *All three agree.*
9. Rewritten questions, tick lists, all gaps as actions by person, vendor sheet, copy text for colleagues. *All three agree.*
10. Owner page as PDF page 1. *Disputed: benefit field.*
11. Dated snapshots, "since last time", open-items re-check, hotel file export; stored in the browser and that file only. *Disputed: auditor's controller question.*
12. Scoring tests; blind verdict comparison from the Accor interview on. *All three agree.*
