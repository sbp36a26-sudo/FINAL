# Hotel AI Register: legal accuracy review

Reviewed 18 Nov 2026. Law as of November 2026: Regulation (EU) 2024/1689 (AI Act) as amended by Regulation (EU) 2026/1744 (Digital Omnibus on AI, OJ L 24.7.2026, in force 27 Jul 2026).

**Files reviewed:** `tools/register/` (README, `data/reference.json`, `data/uc-labels.json`, `data/radar.json`, `src/logic.js`), `reports/EU AI Act hospitality deep dive.md`, `reports/Hotel AI register design.md`, `tools/ai-act-explorer/ai-act-data.json`, and `docs/d7-governance/` (README, OMNIBUS-REVISION-LIST).

**Primary law text:** both regulation PDFs in `tools/ai-act-explorer/`, read with pdftotext. The Act citations below are to the OJ 12.7.2024 text. The Omnibus citations are to OJ 24.7.2026: Art. 1 points (5) Art. 4, (7) Art. 5, (8) Art. 6, (12) Art. 25, (13) Art. 27, (39) Art. 111, and (40) Art. 113.

**How each point is marked:**
- **[T]** means the point is confirmed in the regulation text in the repo.
- **[repo only]** means only the team's own files support it. This covers the Commission guidelines, national laws, EN 18286, court rulings and the DFA, which are cited from `ai-act-data.json` or the reports and could not be opened at source.
- **[secondary]** means the point comes from a web search summary only.
- **[I]** means it is the reviewer's own reading.

The PDF "Digital Omnibus July 2026.pdf" is itself a repo file. No independent copy from EUR-Lex was fetched.

---

## 0. Overall verdict

The register is careful. Most of the deep dive's corrections have been carried into it, including:
- the Art. 50(1) provider/deployer split;
- the present-tense "maker" warning, which is now dated 2 Dec 2027;
- 1:1 face verification resting on the law text;
- the attrition and coaching switches;
- the Art. 5(1)(d) and (e) switches;
- machinery moving to Annex I Section B.

All seven dates in `dates` are correct against the Omnibus text.

The main problems fall into five groups:
1. **A logic error removes deployer duties.** When a group builds or rebrands a high-risk tool, the register drops the hotel's deployer duties.
2. **Some duties a hotel owes are missing.** These are the Art. 27 FRIA (impact assessment) when it scores guests' credit, Art. 26(4)/(5) and (9), and GDPR Art. 9 for face recognition of VIPs.
3. **Some open points are presented as settled.** These are age estimation under Annex III 1(b), the "coach" exception, and the reach of the Act to stand-alone Swiss and UK hotels.
4. **Some non-AI-Act notes overstate the law.** These are Spain's individual information right, the "Spain: do not use biometric clocks at all" line, PCI DSS shown as "law", and GDPR Art. 22.
5. **Radar entries lack primary references.** Some entries also dropped the case and COM numbers that the design report had.

---

## 1. Label sample (40 rows)

Columns: id | current label / `prov` | problem | correct reading (article) | confidence.

"OK" means the label, `prov`, `why` and switches were checked against the text and found consistent.

| id | Current label / prov | Problem | Correct reading | Conf. |
|---|---|---|---|---|
| hr-2 AI recruiting | high / Annex III 4(a) | OK. The `why` says "A hiring chatbot must also say it is AI", but that is the provider's duty (C1 explains this). | Annex III 4(a) [T]; Art. 50(1) binds the provider [T]. | High |
| m-4 video/voice interviews | high / 4(a); emo_staff → prohibited | OK. Commission guidance covers candidates under Art. 5(1)(f) [repo only]. | Art. 5(1)(f) "areas of workplace" [T]. | High |
| hr-5 seasonal staff matching | high (unconditional) / "4(a) or 4(b)" | **Over-claim.** The deep dive (labels table) itself says this belongs in "High-risk if…". Allocation by stated availability and skills is outside 4(b) on the draft. The `diff` admits the point but the label is still unconditional. | Make it highif, with switches rank_staff / "selects applicants" (Annex III 4(a), 4(b)) [T + D]. | Medium |
| res-8 call scoring | high / 4(b); emo_staff, emo_guest(soft), card_data | OK on 4(b) only if it scores *individual* agents. Base "high" over-claims for aggregate-only analytics. | Annex III 4(b) "monitor and evaluate the performance… of persons" [T]. Consider a per-agent switch. | Medium |
| hr-1 scheduling | minimal + rank_staff, hours_leave | OK. The draft basis is flagged. | Annex III 4(b) first limb "decisions affecting terms" has no behaviour qualifier [T]. | High |
| hr-3 onboarding/coaching | minimal + rank_staff, career_decide, coach_emo, academy | `coach_emo` help says "may read emotions only if the results stay with that person". This is stated as a rule but rests on one summary of the guidelines (deep dive row 50: [G, single summary]). Art. 5(1)(f) has no such carve-out; only medical or safety reasons are exempt. | State it as "Commission guidance, not tested". Art. 5(1)(f) [T]. | Medium |
| hr-4 attrition | minimal + rank_staff (hard) → shows highif | OK. This matches the deep dive. `basis: law` is fine. | Annex III 4(b) + Art. 6(3) last subpara (profiling is always high-risk) [T]. | High |
| m-15 tip pooling | minimal + career_decide | OK. Pay counts as "terms of work-related relationships". | Annex III 4(b) [T]. | High |
| m-7 biometric time clocks | outside / Annex III 1(a) | **Reasoning partly wrong.** The `why` says "checking a worker against their own stored template is verification". Most face clocks do 1:N identification. These are outside 1(a) because they are *not remote*: the worker is actively involved. The verification carve-out does not apply to them. | Art. 3(41) "without their active involvement"; Annex III 1(a) [T]. Cite Art. 3(41) and recital 17 [I]. | High |
| fo-3 selfie-to-ID | outside / Annex III 1(a) | OK. The exclusion is in the text. | Annex III 1(a) second sentence [T]; GDPR Art. 9 still applies. | High |
| m-12 facial age estimation | transparency / Art. 50(3); `why` "Age is not a sensitive attribute, so not high-risk (draft guidance)" | **Over-confident.** Annex III 1(b) says "sensitive **or protected** attributes". Age is a protected characteristic (Charter Art. 21). The deep dive (disagreement 20, row 43) marks this OPEN. | Keep Art. 50(3) [T]. Add a switch or note "high-risk under Annex III 1(b) is disputed" [T vs draft]. | Medium-high |
| m-13 spa skin/body analysis | minimal + bio_categorise, emo_guest, med_device | bio_categorise → transparency ignores the Art. 3(40) exclusion ("ancillary to another commercial service and strictly necessary for objective technical reasons"). A skin-type recommender may fall within that exclusion. med_device → high only if the MDR requires a notified body (class IIa and above). | Art. 3(40), Art. 50(3), Art. 6(1)(b) [T]. | Medium |
| it-4 security video analytics | minimal + face_distance, crowd_mood, emo_staff, sensitive_traits, face_enrol | **Under-claim:** the `aggression` switch is missing. The catalogue lists "loitering, incidents", and the deep dive puts intent inference on the 1(c) line. | Art. 3(39) "emotions or intentions"; Annex III 1(c) [T]. | Medium |
| m-9 weapon/aggression cameras | minimal + aggression, emo_staff (soft) | OK. Note that Art. 5(1)(f) has an exception for safety reasons, which may apply to staff aggression alarms. | Art. 5(1)(f) proviso [T]. | Medium |
| face_distance switch (it-4, m-2, fo-3) | → high / Annex III 1(a) | **Misleading help text:** "Recognising VIP guests is allowed, but as a high-risk use". The AI Act lists it "in so far as permitted under Union or national law". Under GDPR Art. 9, recognising unenrolled people at a distance almost never has a legal basis. The switch adds `dpia` but no GDPR Art. 9 item (`gdpr-biometric`). | Annex III 1 chapeau; recital 39; GDPR Art. 9 [T]. Add the `gdpr-biometric` pack. | High |
| voiceprint switch (res-1) | → high / 1(a) draft | Should say that voice *verification* ("my voice is my password", 1:1) is excluded. | Annex III 1(a) second sentence [T]. | Medium |
| emo_guest (res-1, gx-6, res-8) | → high / 1(c) + Art. 50(3) | OK. The help should add that inference from text is not covered, because the definition rests on biometric data (the emo_staff help says this; emo_guest's does not). | Art. 3(39) [T]. | High |
| emo_staff (it-2, res-8, hr-*) | → prohibited / Art. 5(1)(f) | OK, including candidates [repo only, guidelines]. | Art. 5(1)(f) [T]. | High |
| sensitive_traits (it-4) | → prohibited / 5(1)(g) | OK. Note that the Art. 5(1)(g) list is closed and age and sex are not on it. | Art. 5(1)(g) [T]. | High |
| face_enrol (it-4, m-2) | → prohibited / 5(1)(e) | OK. | Art. 5(1)(e) "untargeted scraping… CCTV footage" [T]. | High |
| m-1 guest screening | minimal + social_score*, c_credit*, crime_profile* (all soft) | The three soft switches never raise "can become prohibited" or "highif" while unanswered (logic: soft = no potPro/potHigh). The label is therefore quieter than the `why` text. | Art. 5(1)(c), (d); Annex III 5(b) [T]. Make crime_profile/social_score hard on m-1. | Medium |
| m-2 banned-guest database | minimal / Art. 3(1), rec. 12, 5(1)(c) | OK. | [T] | High |
| crime_profile switch | → prohibited / 5(1)(d) | OK. It applies beyond the police. | Art. 5(1)(d) [T]. | High |
| social_score switch | → prohibited / 5(1)(c) | The question asks for "unrelated contexts **and** refusal". The law has two alternative limbs: (i) treatment in an unrelated context, **or** (ii) treatment that is unjustified or disproportionate. The help mentions (ii), but the question doesn't. | Art. 5(1)(c)(i)/(ii) [T]. Reword as "or". | Medium |
| c_credit switch (custom, m-1) | → high / Annex III 5(b) | **Under-claim of duties:** a deployer of a 5(b) system owes an **Art. 27 FRIA**, even as a private company. The register has no FRIA item. | Art. 27(1) "deployers of high-risk AI systems referred to in points 5(b) and (c)" [T]. | High |
| fa-2 / it-3 fraud detection | minimal / Annex III 5(b) | The label is right but the reason is beside the point (deep dive). Booking fraud is not credit scoring. The live questions are Art. 5(1)(c)/(d) and GDPR Art. 22 if the tool cancels bookings automatically. | Annex III 5(b) exclusion [T]; Art. 5(1)(d), recital 42 [T]. | Medium |
| exploit_price (rm-2, rm-7, fo-5, fb-4) | → prohibited / 5(1)(a),(b) | OK. "Financial situation" maps to "specific social or economic situation". | Art. 5(1)(b) [T]. | High |
| rm-2 dynamic pricing | minimal / "Not on Annex III" | OK. | [T] | High |
| personal_price switch → CP1 | consumer-price | OK in substance, but `ref` "EU consumer law" should name **CRD Art. 6(1)(ea)** (added by Directive 2019/2161). It covers distance and off-premises contracts only, so not walk-in sales. | CRD 2011/83/EU Art. 6(1)(ea) [I, from knowledge]. | High |
| res-1 voice agent | transparency / Art. 50(1); 1(a),1(c) | OK. The hotel's part is a check (C1). | Art. 50(1) [T]. | High |
| gx-2, gx-5, fb-2, fb-6, res-4 chat/voice | transparency / Art. 50(1) | OK. "First message" matches Art. 50(5). If the hotel assembled the bot on a model API it is the provider (Art. 3(3), 3(68)), but no switch asks this; the origin "built" covers only part of it. | Art. 50(1), 50(5) [T]; guidelines t1 [repo only]. | Medium |
| m-3 avatar receptionist | transparency / 50(1) + staff_likeness | OK. A clearly stylised avatar is not a deep fake (no "falsely appear authentic"). | Art. 3(60) [T]. | Medium |
| m-16 translation devices | minimal / 50(1) guidance | OK [repo only: guidelines C(2026) 7702 para 30–31]. Art. 50(2) marking still binds the provider of synthetic speech output. | Art. 50(2) [T]. | Medium |
| sm-4 GenAI imagery | minimal + ai_image → transif | OK. | Art. 50(4), 3(60) [T]. | High |
| sm-1 marketing text / pub_claims | minimal / 50(4) guidance | **Over-reach risk.** The Art. 50(4) text limb covers text "published with the purpose of informing the public on matters of public interest". Hotel sustainability claims fall there only on the guidelines' reading [repo only]. The binding rule for green claims is the **Empowering Consumers Directive (EU) 2024/825**, applying from 27 Sep 2026, which is missing. | Art. 50(4) second subpara [T]; Dir. 2024/825 [I]. | Medium |
| fb-5 delivery robots | minimal / 50(1); Annex I Sec. B | OK on the Omnibus point. **Missing:** the Machinery Regulation (EU) 2023/1230 applies from **20 Jan 2027**. | Omnibus Art. 1(2)(a), 1(41) [T]; MR 2023/1230 date [secondary]. | High |
| kc-3 smart ovens | minimal + safety_part | OK. Gas appliances stay in Section A. | Omnibus Art. 1(41)(a) deletes only machinery from Sec. A [T]. | High |
| me-1, me-5, me-6 | minimal / Art. 6(1a),(1b) | OK. | Omnibus Art. 1(8) [T]. | High |
| m-17 smart minibar | notai / Art. 3(1), rec. 12 | OK if sensor or rule-based. Add "unless it uses computer vision". | [T] | Medium |
| lg-4 AI policies | notai | Not a tool, so harmless. Better removed than labelled. | — | Low |
| gm-2 general assistant + repurpose_hr | minimal / Art. 25(1)(c) draft | OK. It is correctly dated 2 Dec 2027. | Omnibus Art. 1(40)(b) moves Sec. 3 incl. Art. 25 [T]. | High |
| hk-5, hk-6, kc-1, pr-4, m-5, m-6 staff-data switches | minimal + judge_staff / rank_staff | OK. The draft basis is flagged. | Annex III 4(b) [T]. | High |
| label "prohibited" `short` | "a narrow exception covers genuine medical or safety reasons" | Overgeneralised. That exception exists only in Art. 5(1)(f). | Art. 5(1)(f) [T]. | High |

---

## 2. Dates

| Key / item | Register | Law | Verdict |
|---|---|---|---|
| bans | 2025-02-02 | Art. 113(a) as amended: Ch. I–II from 2 Feb 2025 [T] | Correct |
| transparency | 2026-08-02 | Art. 50 not deferred; general date Art. 113 [T] | Correct |
| newbans | 2026-12-02 | Art. 5(1)(ba),(bb), (1a),(1b) from 2 Dec 2026, Omnibus Art. 1(40)(a) [T] | Correct (used only in radar) |
| liability | 2026-12-09 | PLD 2024/2853 Art. 2(1), products placed on market/put into service after 9 Dec 2026 [I, knowledge] | Correct |
| highrisk | 2027-12-02 | Art. 113(c)(i) as amended: Ch. III Sec. 1–3 for Art. 6(2)/Annex III [T] | Correct |
| products | 2028-08-02 | Art. 113(c)(ii) [T] | Correct |
| cra | 2027-12-11 | CRA Art. 71(2) [I] | Correct. Note that the reporting duties have applied since 11 Sep 2026 (maker only). |
| L1 since bans | Art. 4 since 2 Feb 2025 | Correct. The wording was softened from 27 Jul 2026 (Omnibus Art. 1(5)) [T]. The register text ("brief… keep a note") is a reasonable measure, but "keep a note" is good practice and not in Art. 4. | OK |
| G1 / w-marking | 2 Dec 2026 for generators placed on the market before 2 Aug 2026 | Art. 111(4) [T]. In-house generators that were only "put into service" are not named, so their duty arguably began on 2 Aug 2026 (deep dive). | Add that nuance |
| H5 Art. 86 | when highrisk | Art. 86 sits in Ch. IX (general date), but it depends on Annex III classification, which is deferred. Treating it as 2 Dec 2027 is sensible [I]. | OK, add a note |
| H7 legacy | "in use before 2 Dec 2027" | Art. 111(2) says "date of application of Chapter III referred to in Art. 113". The sensible reading is 2 Dec 2027 / 2 Aug 2028. The register correctly says it never covers Arts. 4, 5 and 50 (deep dive). | OK |
| meta in force | 27 Jul 2026 | Third day after OJ 24.7.2026 [T] | Correct |
| Missing date | — | Machinery Reg. 2023/1230 applies 20 Jan 2027 [secondary]; Dir. 2024/825 (green claims) from 27 Sep 2026 [I]; Platform Work Dir. 2024/2831 transposition 2 Dec 2026 [I], relevant to gig-staffing apps | Add |

**Repo only:** the Omnibus PDF is the sole source for every amended date. The Art. 50 guidelines C(2026) 7702 (5 Nov 2026), the draft high-risk guidelines (19 May 2026) and EN 18286 (Implementing Decision 2026/2274) are known only from `ai-act-data.json`.

---

## 3. Deployer vs provider

1. **Art. 50(1) is correctly placed on the provider** (C1 "maker's duty, your check"; S1 `diff`). Art. 50(3), 50(4), Art. 4 and Art. 26 are correctly the hotel's own duties [T].

2. **Logic error, high importance.** In `logic.js` `items()`, the line `if (it.role && it.role !== c.role) return;` hides H1–H8 (role "user") when `c.role === 'maker'`. A group that builds, rebrands or substantially changes a high-risk tool *and uses it in its hotels* is provider **and** deployer. Art. 3(4) defines a deployer as anyone using a system under its authority, and nothing exempts a provider. So a group-built CV screener currently gets M1/M2 but loses:
   - human oversight (Art. 26(2));
   - informing workers and their representatives (Art. 26(7));
   - informing candidates (Art. 26(11));
   - explanations (Art. 86);
   - logs (Art. 26(6)).

   **Fix:** H items apply to both roles.

3. **Missing deployer duties:**
   - **Art. 27 FRIA** for 5(b) creditworthiness (c_credit). Add a note that hotels providing public services (e.g. contracted housing of asylum seekers) may be "private entities providing public services" (deep dive) [T + I].
   - **Art. 26(4)** input data relevant and representative, where the hotel controls input [T].
   - **Art. 26(5)** monitoring on the basis of the instructions, and serious incidents reported to the provider "immediately". H6 covers suspension only [T].
   - **Art. 26(9)** use the provider's Art. 13 information for the GDPR DPIA [T].
   - The register correctly omits Art. 26(8) and Art. 49 deployer registration (public bodies only) [T].

4. **Art. 25 "maker" routes are correct on the text:**
   - build = Art. 3(3) for own use;
   - brand = 25(1)(a), high-risk only;
   - change = 25(1)(b), high-risk only, "our reading" for retraining (Art. 3(23) and pre-determined changes in Art. 43(4) matter);
   - repurpose = 25(1)(c). GPAI is expressly included, the route is correctly dated 2 Dec 2027, and the draft basis is flagged.

   **Add Omnibus Art. 25(2) as replaced:** where the original provider "clearly specified" that the system is not to be changed into high-risk, it owes no cooperation. The hotel then holds a system it cannot make compliant [T].

   **Add new Art. 99(4)(da):** obligations under Art. 25(2) and (4) are now in the 3% fine tier [T].

5. **The "built" origin and guest chatbots.** A hotel that assembles a concierge on a model API with its own prompts and booking integration may be the Art. 50(1) provider (Art. 3(3), 3(68); guidelines t1 [repo only]). The origin list has no option for "assembled on a platform/API", so these hotels will choose "vendor" and be told the notice is not their duty.

6. **Operating models** (managed or franchised: who is deployer). These are reasonable and flagged "our reading". The guidelines say deployer = "whoever decides to deploy and how it is used; technical control not needed, incl. group structures" [repo only]. That supports naming the brand as a co-deployer more strongly than the register's "may count as a distributor".

---

## 4. GDPR, labour and national notes

| Item | Issue | Correct reading | Conf. |
|---|---|---|---|
| labourNotes DE | Accurate (BetrVG §87(1) no. 6, injunction). Add "where a works council exists". | [repo only, nationalLayer; I] | High |
| labourNotes FR | "Approving a chatbot staff already use also counts as introducing it" is stated as a general rule. It rests on one Paris Court of Appeal ruling (21 May 2026) [repo only]. Attribute it. | C. trav. L2312-8, L2312-14 | Medium |
| labourNotes ES | **Wrong attribution.** ET art. 64.4(d) gives the *works council* a right to the algorithm's parameters. Individual information comes from GDPR Arts. 13–15 and 22, not from a separate Spanish duty "on every employer". | ET 64.4(d) (Ley 12/2021) [repo only]; GDPR Arts. 13–15, 22 | Medium-high |
| labourNotes SE | Add "where bound by a collective agreement (MBL §11); otherwise §13". | [repo only] | Medium |
| labourNotes CH | Fair. It reflects BGE 130 II 425 (not a general ban). | ArGV 3 Art. 26 [repo only] | High |
| labourNotes GB | This is a data-protection point placed under labour. It cites draft ICO guidance. Note that DUAA 2025 Arts. 22A–22D allow solely automated decisions with safeguards (from 5 Feb 2026 [repo only]). | — | Medium |
| GT1 biometric clocks | **"In Spain, do not use them at all" is an overstatement.** The AEPD guide (23 Nov 2023) does not prohibit them outright but makes lawful use very hard: it needs a legal basis in law, consent is invalid at work, and fines have been issued since 2024 [secondary]. "Unless staff have a real alternative" is also insufficient: in employment, consent and an alternative do not by themselves create an Art. 9(2) basis (Art. 9(2)(b) needs a member-state law or collective agreement). | GDPR Art. 9(2)(b), Art. 88 [I] | High |
| GA1 Art. 22 | "Let no tool reject, select or **rate** a person on its own" is stricter than Art. 22 in one way and looser in another. Art. 22 covers *decisions* with legal or similarly significant effect. A score counts when it plays a determining role (CJEU C-634/21 SCHUFA [I]). Art. 22(2) allows contract, law or explicit consent with safeguards (Art. 22(3)). The wording reads as legal advice. | GDPR Art. 22(1)–(3) | High |
| GB1 face check-in | Fine, and "our reading" is flagged. It could cite EDPB Opinion 11/2024 (template held by the individual) [I]. | GDPR Art. 9 | Medium |
| GD1 DPIA | "Run a DPIA before the tool is switched on" is applied to every `dpia` pack (e.g. kc-1 food-waste camera). A DPIA is required only where high risk is likely (Art. 35(1), (3); EDPB criteria). Say "check whether a DPIA is required; for staff monitoring and biometrics it usually is". | GDPR Art. 35 | Medium |
| GH1 health data | Skin analysis for cosmetic advice is not automatically health data. Sleep and body-scan data often are, and the CJEU reads special categories broadly (C-184/20). Say "likely". | GDPR Art. 4(15), 9 | Medium |
| PC1 PCI DSS | **Shown as kind "law"** under the tag "Cyber/PCI". PCI DSS is a contractual card-scheme standard, not law. Move it to "practice/contract" and cite GDPR Art. 32 for the legal part. | — | High |
| CP1 | Name CRD Art. 6(1)(ea). "Before each booking" is right for online bookings only. | — | High |
| CR1 | Correct. Cite UCPD Annex I pt 23b–c and the UK DMCC Act 2024 (fake reviews banned from 6 Apr 2025) [I]. | — | High |
| CY1 | Fine. Add that the RED cyber delegated act 2022/30 has applied to connected radio equipment since 1 Aug 2025 [I]. | — | Medium |
| countryChecks CH `reach` | "A stand-alone Swiss hotel serving guests in Switzerland is not covered" is too absolute. Art. 2(1)(c) reaches a third-country deployer "where the output… is used in the Union". A booking chatbot answering guests located in the EU, or AI marketing aimed at EU residents, is arguable. Say "mostly not, unless the AI's output is used in the EU". Same for GB. | Art. 2(1)(c) [T] | Medium-high |
| CH1–CH3 | CH1 matches FADP Art. 21 for automated individual decisions; "tell when they deal with AI" is the FDPIC's view, not statute. CH3 "write the group's AI policy" is good practice, not law. Mark both. | FADP Arts. 6, 16–17, 21 [I] | Medium |
| GB1–GB3 | Consistent with DUAA 2025, the ICO's Serco Leisure enforcement (2024) and DMCC 2024 [I/secondary]. The imperative phrasing reads as advice. | — | Medium |

**Reads as legal advice:** B1 ("Switch this feature off… cannot be made compliant"), GT1, GA1, GB1, GB2 and CP1 use imperatives with no "check with your DPO/lawyer". The README says "items to check, never a compliance verdict", and the item wording should match that.

---

## 5. Radar

| Entry | Current? | Sourced? | Dated? | Issue |
|---|---|---|---|---|
| w-highrisk-guidelines | Yes | Draft 19 May 2026 [repo only] | 2026-12-31 est. | OK. No URL. |
| w-newbans | Yes | Omnibus [T] | Yes | OK |
| w-marking | Yes | Omnibus Art. 111(4) [T] | Yes | Add the in-house "put into service" nuance |
| w-liability | Partly | PLD; "**Germany has done so**" has no source anywhere in the repo | Yes | Remove or source it |
| w-value-chain | Yes | Art. 96(1) lists Art. 25 guidelines [T] | No date | OK |
| w-annex1-relief | Yes | Art. 2(13) [T] | 2027-08-02 | OK |
| w-highrisk-start / w-products-start | Yes | Art. 113 [T] | Yes | Mention Art. 111(2) legacy |
| w-cra | Yes | CRA | Yes | OK |
| w-dpf | Yes | Only "Booklet". The design report has **Latombe v Commission, C-703/25 P**; it was dropped. | No | Add case no. and link |
| w-dfa | Yes | Only "Booklet". The design report has **COM(2026) 1100, 11 Nov 2026** [repo only]; it was dropped. | No | Add COM no. and date |
| w-ai-at-work | Unclear | Booklet only | No | Needs EP resolution reference and date |
| w-gdpr | Unclear | Booklet only; no COM number | No | `affects: {}` hits no tool, so it is dead in the UI. Add the reference (Digital Omnibus on data, Nov 2025 [I]) and links |
| w-national | Yes | ai-act-data [repo only] | Mixed | Germany KI-MIG 29 Jul 2026, France DDADUE and Spain bill lapsed are repo only. ES text "no implementing law" is fine. |
| w-swiss | Yes | Federal Council 28 Oct 2026 [repo only] | "2027-04-01" placeholder for "spring" | OK, but label the date as approximate |
| w-uk | Partly | Booklet | No | Add DUAA 2025 ADM commencement (5 Feb 2026 [repo only]) |
| Missing | — | — | — | Machinery Reg. 20 Jan 2027 [secondary]; Art. 50 guidelines C(2026) 7702 final 5 Nov 2026 and Code of Practice [repo only] (labels rest on them); Platform Work Dir. 2 Dec 2026; Dir. 2024/825 |

The design report requires each entry to carry a primary link, a verifier and a verified-on date. **No entry has a link or a verifier name.**

---

## 6. Ten most important corrections (priority order)

1. **Logic:** apply Art. 26/86 deployer items (H1–H8) to makers too. Today a group-built or rebranded high-risk tool loses its oversight, worker-information and log duties (Art. 3(4), 26).
2. **Add an Art. 27 FRIA item** for Annex III 5(b) creditworthiness (c_credit), plus a "public service" caveat (Art. 27(1)).
3. **face_distance help:** remove "Recognising VIP guests is allowed". Add GDPR Art. 9 (`gdpr-biometric`) and the Annex III 1 chapeau "in so far as permitted".
4. **m-12 age estimation:** mark Annex III 1(b) ("sensitive or protected attributes") as OPEN, not settled-by-draft.
5. **GT1:** rewrite the Spain line (AEPD guide 2023: not banned, very hard to justify) and the "alternative" condition (Art. 9(2)(b)).
6. **ES labour note:** the works council's right is ET 64.4(d); individual information comes from GDPR. **GA1:** restate Art. 22 accurately, with its exceptions and safeguards.
7. **CH/GB `reach`:** qualify "not covered" with Art. 2(1)(c) (output used in the Union).
8. **Add the missing Art. 26 items:** 26(4) input data, 26(5) monitoring and serious-incident report, 26(9) DPIA input. Add Art. 25(2) as replaced (no cooperation if the vendor excluded high-risk use) and the new Art. 99(4)(da).
9. **PC1:** PCI DSS is a contract standard, not law. **T1/pub_claims:** say the Art. 50(4) reach to sustainability claims is the guidelines' reading, and add Dir. 2024/825. Fix the "prohibited" `short` exception wording. Downgrade **hr-5** to highif.
10. **Radar:**
    - add primary references (C-703/25 P, COM(2026) 1100, the GDPR proposal reference) and a verifier for every entry;
    - fix `w-gdpr` affects;
    - source or delete "Germany has done so";
    - add Machinery Reg. 20 Jan 2027 and the final Art. 50 guidelines.

## 7. Must be signed off by the D7 owner or a lawyer before any hotel sees it

- **Every label resting on "draft", "guidance" or "reading"** (`basis` ≠ law/default). In particular:
  - the rota and housekeeping minimal halves;
  - coach_emo;
  - pub_claims;
  - the robot and translation rows;
  - Art. 25(1)(c) repurpose;
  - "Change it" for retraining;
  - the operating-model co-deployer notes.
- **The facts known only from repo files:**
  - the Omnibus text itself (check against EUR-Lex 2026/1744);
  - the Art. 50 guidelines C(2026) 7702;
  - the draft high-risk guidelines;
  - EN 18286 / Decision 2026/2274;
  - KI-MIG;
  - the Paris CA 21 May 2026 ruling;
  - DUAA commencement;
  - the Swiss timetable;
  - COM(2026) 1100.
- **Every national note** (labourNotes, countryChecks CH/GB, GT1 Spain) and the CH/GB scope statement: a local-law check per country.
- **The Art. 111(2) legacy note (H7)**, because hotels will plan around it.
- **All imperative "law" items** (B1, GA1, GT1, GB1, CP1): rewrite them as items to check, and add a visible "not legal advice; confirm with your DPO or counsel" line on each tool page.
- **The 17 market rows (m-1 … m-17):** these come from search summaries and the team has not reviewed them.

## Sources (web, secondary)
- Machinery Regulation 2023/1230 application date: [BAuA](https://www.baua.de/EN/Topics/Work-design/Machine-and-operational-safety/Machinery/Machinery-Directive-Revision), [EU-OSHA](https://osha.europa.eu/es/legislation/directive/regulation-20231230eu-machinery)
- AEPD biometric attendance guide: [AEPD press note](https://www.aepd.es/prensa-y-comunicacion/notas-de-prensa/la-aepd-publica-una-guia-sobre-la-utilizacion-de-datos), [Cuatrecasas](https://www.cuatrecasas.com/es/spain/propiedad-intelectual/art/prohibe-aepd-tratar-datos-biometricos-control-acceso), [Fieldfisher](https://www.fieldfisher.com/es-es/locations/espana/actualidad/el-control-de-presencia-mediante-el-uso-de-sistemas-de-biometria)
