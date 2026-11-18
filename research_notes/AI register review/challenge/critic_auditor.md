# Critic 3: legal and method auditor

*18 Nov 2026. Each bug re-run in Node against `src/logic.js` (loaded as in `tests/logic.test.mjs`). The suite passes 99/99 and catches none of them.*

## 0. Verification

| # | Claim | Verdict | Output |
|---|---|---|---|
| a | A maker or rebrand hides the user's items | **Confirmed** | hr-2 bought: `…GA1,H1–H8,H7`. hr-2 built, branded or changed: `C1m,Y1,L1,R1,R2,LB1,GD1,GA1,M1,M2`; the Art. 26 items are lost. Cause: `items()` `if (it.role && it.role !== c.role) return;` |
| b | "Rules only" turns a prohibited tool into "Not an AI system" | **Confirmed** | A custom tool with `emo_staff:yes` gives `prohibited` with `B1,L1,R1,R2`. Adding `notAI:'yes'` gives `notai` with `R1,R2`, so B1 is gone. Cause: the reset block `tool.notAI === 'yes'` in `classify()`. |
| c | CCTV with open ban questions shows "Minimal" | **Confirmed** | it-4 answered No, No, Unsure, No, Unsure, Unsure gives `label=minimal canProhibit=true openHard=["emo_staff","face_enrol"]`. `app.js:344` still says "**One** open question". |
| d | "Not sure" adds no item | **Confirmed, and worse than claimed** | gx-2 with `card_data:unsure` gives no PC1. gm-2 with `repurpose_hr:unsure` stays `minimal` with `openHard=[]`. **m-1 with social_score, c_credit and crime_profile all unsure gives `minimal` and `canProhibit=false`**, because its ban questions are marked `soft`. |
| e | Wording for a stand-alone Swiss hotel | **Confirmed** | `countryChecks.CH.reach` says the Act "covers any group hotel in the EU" and that a stand-alone Swiss hotel "is not covered". GB says the same. A CH hotel with hr-1 rank=yes still gets H1–H8 as `duty` and GD1 as GDPR law. |
| f | No Art. 27 FRIA item for credit scoring | **Confirmed** | `c_credit:yes` gives `high` with `…H1,H2,H3,H5,H6,H8,H7`. No item in `reference.json` cites Art. 27. m-1 also shows "Rests on Art. 5(1)(c)" for a label that rests on Annex III 5(b). |

## 1. Must-fix tiers

**Before any interviewee sees it.** Accor, interviewed on 19 Nov, builds AI in-house, which is exactly the path of bug (a).
1. Fix bugs (a), (b) and (c), and remove the soft ban questions on m-1.
2. CH/GB reach text: replace "not covered" with "unlikely to apply unless the AI's output is used in the EU (Art. 2(1)(c)); not settled", and drop "any group hotel".
3. Delete "Recognising VIP guests is allowed" from the `face_distance` help text.
4. Replace "All checked" (`app.js:205`, `:671`) and "Nothing open. Every item is ticked." (`:419`).
5. Add a banner: "Student research prototype. Not reviewed by a lawyer. Not endorsed by HFTP or EHL."
6. Use the fictional example hotel only.

**Before HFTP members use it unaccompanied:**
- Add the FRIA item for credit scoring (bug f). The duty applies from 2 Dec 2027.
- Make "Not sure" produce a vendor question.
- Add G1 (Art. 50(2) marking) for generative tools the group builds itself.
- GDPR Art. 9 items on biometric questions; split `c_biometric`; Art. 26(4), (5), (9); `alsoTransparency` only for chat tools.
- Retag GA1, CH1 and CH3 as good practice, and PC1 as contract.
- Fix GT1 (Spain) and the Spanish labour note.
- For non-EU hotels, mark AI Act items "for reference" and use the FADP for staff data.
- Version and law date on PDF/CSV; privacy notice; self-hosted fonts; D7 sign-off.

**Before HFTP branding:**
- Review by a qualified EU lawyer, plus checks for CH and UK.
- Terms of use with a no-reliance clause, reviewed by counsel.
- Named maintainer, 90-day stale-law warning, changelog, correction channel, decision on errors-and-omissions cover.

## 2. Precedence rules (testable)

1. **An open ban question beats any lower label.** If any question that can make the tool prohibited is open or "unsure", the label is never minimal, outside or transparency, and the count shown on screen is correct. *Test:* it-4 with the (c) answers is not labelled minimal.
2. **No ban question is soft.** *Test:* no switch with `yes:'prohibited'` carries `soft` in `uc-labels.json`.
3. **"Unsure" is never silent.** It keeps the label open or adds an "ask the vendor" item. *Test:* gx-2 with `card_data:unsure` adds an item; gm-2 with `repurpose_hr:unsure` gives `highif`.
4. **"Not AI" cannot override a yes.** If any hard question is answered yes, that label stays and a `contradiction` flag is set. If questions are only open, show "Not AI (unconfirmed)". GDPR and labour items always remain. *Test:* bug (b) gives `prohibited`, B1 and the contradiction flag.
5. **Being the maker adds duties and never removes user duties.** *Test:* the items for hr-2 built ⊇ the items for hr-2 bought, except C1 → C1m.
6. **Duties follow the legal ground of the label.** Annex III 5(b)/(c) adds the Art. 27 FRIA, biometric identification adds GDPR Art. 9, and "Rests on" names the provision that set the label. *Test:* m-1 with `c_credit:yes` gives FRIA and a `prov` that includes 5(b).
7. **Jurisdiction downgrades a tag but never deletes or invents a duty.** For a non-EU hotel, AI Act items get kind `reference` unless "output used in the EU" is answered yes. *Test:* the CH case from bug (e) has no AI Act item of kind `duty`.
8. **The label carries its basis.** `classify()` returns `labelBasis` (law, guidance, draft or our reading), and the chip, CSV and PDF print it.

## 3. Claims I think are wrong or overstated

- **CIO trial, "Art. 50(3) is the wrong basis":** half right. `c_biometric` mixes identification with emotion reading. The fix is to split the question, not to delete N1.
- **EN 18286:** lawyer trial says unverified; `legal_accuracy.md` cites Decision 2026/2274. D7 owner checks the OJ.
- **Lawyer trial, legal-entity question:** over-engineered; rule 5 suffices.
- **Legal researcher:** Art. 25(2), Art. 99(4)(da), m-7 reasoning, Machinery Regulation, Dir. 2024/825 and lg-4 are correct but belong in the booklet or watch list, not must-fix. [Secondary] items must be opened at source. Delete "Germany has done so". m-12: open note, no label change.
- **Trials are AI personas:** legal readings are hypotheses; I count only reproduced bugs.
- **GM trial:** alarm at the manipulation question is a reason to group ban questions, not drop them. Its praised Spanish "individual information" rule is misattributed (ET 64.4(d) is a works-council right).

## 4. Wording pattern

**Check whether** [fact about this tool]. **Why:** [one-line effect] ([basis]: [reference]). **Who can confirm:** [vendor / DPO / counsel].

Example B1: "Check whether this feature is on. If it is, the AI Act bans this use (law text: Art. 5(1)(f)). Who can confirm: your counsel."

In exports, "All checked" becomes "You marked all N listed items as done. This is not a compliance check." Every export footer carries the version, the law date and "Not reviewed by a lawyer".

## 5. Sign-off

**D7 owner:** every non-law label; the 17 market rows; hr-5 downgrade; CH/GB reach; H7 legacy; operating-model and brand notes; these precedence rules; the Omnibus text against EUR-Lex.

**Qualified lawyer:** a label-file sample; Art. 25 brand/change/repurpose routes; national labour and GDPR notes; Art. 2(1)(c) reach; terms of use and privacy notice.

## 6. Next build (in order)

1. Rules 1 and 2. *Proof:* it-4 (c) is not minimal; m-1 with unsure answers gives `canProhibit`; the count on screen matches.
2. Rule 5. *Proof:* the superset test on hr-2 built, branded and changed.
3. Rule 4. *Proof:* bug (b) gives prohibited plus the contradiction flag.
4. Rule 3. *Proof:* the gx-2 and gm-2 cases.
5. Wording and export pass, plus the banner. *Proof:* grep finds no "All checked" or "Nothing open"; every item starts with "Check".
6. Rule 7 and the CH/GB reach text. *Proof:* the CH test.
7. FRIA, G1 for built tools, GDPR Art. 9 and Art. 26(5) incident reporting. *Proof:* rule 6 tests; gx-2 built gives G1.
8. Split `c_biometric`, and set the transparency flag only for tools that chat. *Proof:* identification alone gives no N1.
9. Rule 8. *Proof:* a CSV column test.
10. Store the rules version on each entry. *Proof:* a saved entry holds `ref.meta.version`.

## 7. Questions for the other critics

**To the sceptic:**
1. Every confirmed bug is in `classify()` and `items()`, not in the parts you would cut. What legal risk does cutting remove?
2. Rules 1–5 add no feature; they only stop the tool from saying less than its own data knows. Do you accept them?
3. Would you show Accor the build path tomorrow as is?

*Likely objection:* "FRIA, Art. 9, Art. 26(4)–(9) are scope creep." *Answer:* before interviews I ask only for deletions, wording and precedence. New items come later, only where an existing label triggers them; I would drop the watch-list additions.

**To the operator advocate:**
1. Does "less noise" ever justify showing "Minimal" while a ban question is open?
2. Is "Check whether… Who can confirm" less useful than "Switch it off"?
3. Contract-end and review-date fields create a dated paper trail. Will you accept roles instead of names, and no ticks that read as compliance?

*Likely objection:* "Hedged, open labels make it anxious and unusable." *Answer:* the hedge is one fixed pattern, not more text; open labels disappear as questions are answered; each "Not sure" becomes one vendor question, the action the GM trial valued most.
