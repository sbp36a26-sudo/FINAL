# Live review: "Do you need AI?" v2.7 (use-case questions), 25 Nov 2026

Artifact checked: https://claude.ai/artifact/GAn4pWAX4YTkvBFcYYwkzs (the new artifact, not Ludo's original). Source: browser capture of every use case's step-5 questions (`questions_seen.md`), 3 test runs with screenshots, compared with `usecase_questions_only.json`. Sources: browser capture of every "Details and sources" box and the step 1–3 citations (`sources_seen.md`); every URL checked (section 5).

## 1. Summary

- **99 use cases and 723 live questions checked one by one.** Claude Code built it exactly to spec. Every question, its order, pillar, answerer and department match the data file word for word. The only differences are 2 shortened use-case names (fb-6, it-3). **So the problems below are in our spec, not in Claude's build.**
- **Verdicts:** 625 OK (86%), 51 Fix, 14 Rewrite, 33 Remove. 65 of 99 use cases have at least one issue. **53 questions are missing** across 44 use cases.
- **Issue types:** legal or data-protection framing 28; needs the previous question to make sense ("that person") 22; duplicate within the use case 17; wrong pillar 15; two ideas in one 3; grammar 3; hard to answer Yes/No 3; feature check: better asked of the vendor 3; wrong answerer 2; design choice, not readiness 2.
- **After the fixes:** 98 use cases (lg-2 removed), 743 questions, 6 to 12 each, no text repeated across use cases, every use case has all six pillars (lg-4 has no technology question, which is right for an AI-rules use case).
- **Sources (section 5):** 248 unique URLs. 3 are broken, 45 block bots (unverified, the samples were live). 4 use cases have no working source, 44 have thin evidence, 15 sources do not support their use case, and 6 legal-type sources plus 3 internal audit notes need removing.

### Top 10 problems

1. **Legal content is still there (28 questions + 1 use case).** It comes in three forms: "tells guests it is a computer" in 7 guest-facing use cases (res-1, gx-2, gx-5, gx-6, fo-7, fb-2, fb-6), which comes from AI disclosure rules; retention and deletion questions (ID scans fo-1, face images fo-3, lost-and-found fo-8, bed-bug photos hk-7, video it-4, guest data gx-4, biometric patterns hr-6); and consent, rights and labelling (sm-3 marketing consent, sm-4 photo rights and AI labels, hk-4 sensor notice, hr-6 "why a PIN is not enough", gm-3 meeting recording). **lg-2 (guests' requests about their personal data) is a legal use case as a whole.** We kept these as "guest trust" in the spec; Ludo's rule says remove them.
2. **The answers can't be saved or exported.** The PDF and Save-as-file buttons give no file and no error (B1). This may be the sandbox, but the user is left with nothing and no Copy or Print fallback.
3. **The action plan reads badly:** "Finish: Has a supervisor agreed…?" and "Make this a Yes: Do you know…?" (B11). Every step-5 question needs a short action text.
4. **Obvious questions are missing in 26 use cases.** There is no owner (People) question in res-3 channel manager, fo-2 room assignment, hk-2 floor robots, hk-4 sensors, me-4 room energy, me-7 leaks, kc-3 smart ovens, pr-4 and pr-5, and gm-3. There is no cost question in gx-2 chat assistant or hr-1 scheduling, and no rules (governance) question in res-4, sm-3, gm-2 and gm-6.
5. **22 questions say "that person", "that team" or "they".** They only make sense right after the question before, so out of context (action plan, PDF) they mean nothing. Name the role instead.
6. **17 questions repeat another one in the same use case.** Examples: fa-5 asks three times about approval and the action record; hr-1 Q1 and Q11; me-4 Q1 and Q7; gx-3 Q1 and Q6; hr-2, hr-4 and hr-5 each ask the same "explain" or "decide" twice.
7. **Step-2 warnings are buried.** "Probably not worth it" and safety net No don't show in the verdict box (B2). The step-2 table also shows "Complex judgement: No" as Met, the reverse of what it looks like (B5).
8. **The result page contradicts itself.** "Held back" appears 3 times next to "Almost ready + 100%" (B4), and "0 of 10 must-haves" sits next to "Score: 2%" (B3).
9. **Saved checks are unreliable.** Checks disappear, unfinished ones stay, labels are confusing, and "Start a new check" silently keeps the hotel (B6, B7).
10. **Some questions are design choices or feature checks, not readiness checks.** "Have you decided whether the tool should publish straight to your website?" (sm-1), "Do desk staff earn a reward…" (fo-5), and robot or leak features a department head can't confirm without the vendor (fb-5, hk-2, me-7). The rest is smaller wording: "Not sure" vs "Don't know yet", "90 use cases", "C-R-I-S-P", 15 wrong pillar tags, 3 two-ideas-in-one.

### Scores (out of 10)

| Dimension | v2.6.1 | v2.7 live | After these fixes | Why |
|---|---|---|---|---|
| Question quality | 6 | **7.5** | 9 | 86% of questions are fine as written: plain, one idea, answerable. Lost points for the legal leftovers, the dangling "that person" questions and the duplicates. |
| Tailoring to the use case | 5 | **8** | 9 | No text is shared between use cases, and questions name the real systems, roles and touchpoints (key cards, lifts, laundry, till, channel manager). But 26 use cases miss an obvious pillar. |
| Logic accuracy | 5 | **6** | 8 | Scoring and the sensitive hold work as specified, and no question is dead. But the hero box hides the step-2 signal, the Q1 badge shows the reverse, and 2%/100% next to the verdict mislead. Step-5 questions still only count as points (no gates or weights, as agreed). |
| Usefulness for hotels | 7 | **7** | 8.5 | The questions are now what a GM would really need to check. That is undone by no export and an action plan that repeats questions instead of saying what to do. |
| Sources (extra, not scored before) | – | **6** | 8 | Honest labels and mostly live links. But the evidence is vendor-heavy (only 14% credible 7+), 4 use cases have no working source, 44 are thin, and some sources are off topic. |
| UX | 6 | **5** | 8 | Flow and layout are fine. Downloads give nothing and no error, saved checks are unreliable, the hold text repeats, and the terms are mixed. |

These are honest judgements from one browser run plus the full question list. Downloads (B1) and storage (B7) should be retested in a normal signed-in Chrome before treating them as code bugs.

## 2. Live vs spec (deviations)

- Questions: 723/723 identical (text, order, pillar, answerer). Departments: 99/99 as in the spec. Counts: as in the spec (40×6 … 3×12).
- Names: fb-6 shows "Restaurant table bookings" and it-3 shows "Detecting booking fraud" (the spec gives the full names). Minor.
- Not as asked in the spec: per-question action texts (spec §3) were not written, and fixed prefixes are used instead. No working download or Copy fallback was seen (spec §6). Step 2 still uses "Not sure", which the spec left unchanged, so that is not a deviation.
- No legal labels (AI Act section, high-risk etc.) were seen on the result pages; the disclaimer shows on cover and result. The remaining legal wording sits inside the question data we supplied.

## 3. Logic and UX issues

| ID | Issue | Assessment | Fix | Severity |
|---|---|---|---|---|
| B1 | "Download result (PDF)", "Download answers (PDF)" and "Save as file" produce no file. | Most likely the artifact sandbox blocks downloads that the page starts itself. It may work in a normal signed-in Chrome, so retest there first. Either way the user gets no feedback, which is a bug. | Use the artifact downloads capability if it exists in this build. Always add a fallback: (1) "Copy plan" and "Copy saved check" buttons that put text or JSON on the clipboard, and (2) "Open printable page", which opens the result in a print view the user prints with Ctrl+P. If a download fails or is blocked, show "Your browser blocked the download. Use Copy or Print instead." Test in a normal browser and in the box browser. | High |
| B2 | Step-2 warnings ("Probably not worth it", safety net No) do not show in the verdict box. | v2.6.1 by design only lets a step-2 No block "Ready" (a hold). A GM reads the hero box and misses the strongest signal: the task may not need AI at all. | Keep the rules. If step 2 gives "Probably not worth it", or any step-2 answer is No, add a second line in the hero box: "Also: the first questions suggest this may not be worth doing with AI (Return: No)." Make it the first action. Add a test that a step-2 No with everything else Yes gives Almost ready and shows the line. | High |
| B3 | 0 of 10 must-haves gives "Score: 2%". | The formula is correct (the score counts every question, and two Planned answers give a few points). But next to "0 of 10 must-haves" a GM reads 2% as a bug. | Keep the formula. Label it "Score: 2% of points from all questions", and show the must-haves line first in bold. Optional: when the verdict is Not ready because of must-haves, show the score smaller, under the must-haves line. | Medium |
| B4 | "Held back: this area involves people's personal data or jobs" appears 3 times, and "Almost ready" + "Score: 100%" sits next to it. | The text repeats in the hero, in "Start with this one" (as both its title and action 1), and in the flag box. "100%" with "Almost ready" looks contradictory unless the hold is explained in one line. | Show it once in the hero: "Almost ready: everything is in place, but this area needs an adviser's view first." Show the flag box once. Make action 1 "Ask an adviser before a pilot" (owner: GM), not the hold text again. The other actions follow as usual. If nothing else is open, say "Nothing else to fix." | Medium |
| B5 | "Complex judgement: No" shows under "Worth exploring" with "Met". | Q1 is asked in reverse ("Can each case be fixed with an if-this-then-that rule?"), so No is the good answer. The badge shows the raw answer next to a label that means the opposite. | Show the condition, not the raw answer: badge "Met" or "Not met" or "To find out", with "Your answer: No, rules cannot do it" underneath. Or rename the label to "Rules can do it", which makes No mean Met. Add a test that Q1 = No shows Met. | Medium |
| B6 | "Start a new check" keeps the hotel name. | Keeping the hotel profile is useful for someone checking several use cases for the same hotel. Doing it silently is confusing, and wrong if the user is checking a different hotel. | Ask: "New check for the same hotel (Test Hotel B) or a different hotel?" Same hotel keeps step 1 and clears steps 2 to 5. Different hotel clears everything. | Low |
| B7 | A check is listed as "No use case chosen yet" even though the user picked one; saved checks disappear while unfinished ones are kept. | For a check that stopped at step 2 (Q1 Yes) the label is technically right, because step 4 was never reached, but it reads as a bug. Checks disappearing is probably browser storage in the sandboxed frame being cleared or partitioned. That needs checking in code. | Name checks "<hotel> · <use case or what they typed> · <date>", and for step-2 stops use "Stopped at step 2: not suitable for AI". Save a check the moment the user picks a use case. Use window.storage (artifact storage) when available, then localStorage, then memory with a warning banner. Never delete a check automatically, and mark unfinished ones "Not finished: step N". Add a test: create 3 checks, reload, all 3 are still there. | High |
| B8 | Step 2 uses "Not sure"; steps 3 and 5 use "Don't know yet". | Two words for the same thing. | Use "Don't know yet" everywhere: answer buttons, badges, result text, PDF and help. Old saves keep their meaning (map Not sure to Don't know yet). | Low |
| B9 | The text says "90 use cases" but the list has 99 (98 if lg-2 is removed). | Stale hard-coded number. | Work the count out from the data, or drop the number ("about 100 common hotel uses"). | Low |
| B10 | "C-R-I-S-P" shows up in places. | GMs don't know the acronym. | Use "Should this problem be solved by AI?" with the five plain names (Needs judgement, Return, Information to learn from, Safety net, Proof). Drop the letters. | Low |
| B11 | Action lines turn questions into odd commands: "Finish: Has a supervisor agreed…?", "Make this a Yes: Do you know…?". | The plan glues a fixed prefix onto the question text. It reads badly and isn't an instruction. | Give every step-5 question an action text: imperative, at most 15 words, with an owner (e.g. "Agree with a supervisor to check every change the assistant makes."). Keep "Planned" items as "Finish by <date>: <action>" and "Don't know yet" items as "Find out: <short question without the question mark>". Store the texts in data/actions_questions_only.json, one per question id, and test that none ends with "?". | High |
| B12 | fb-6 and it-3 names are cut at the colon. | Possibly deliberate short titles, but the spec says to show the names verbatim. | Show the full name, or the short name with the rest as a subtitle. | Low |

## 4. Per-use-case findings

Only questions that need a change are listed; all others are OK. "Add" = missing question. Full table: `live_review.xlsx` (sheet "Live questions", one row per question). Corrected data: `usecase_questions_fixed.json`.

### Revenue Management

**rm-1: Demand forecasting for rooms (by day, guest type and room type)** (7 questions → 7)
- Q6 **Fix** (two ideas in one): "Is it written who may change a forecast by hand, and must they note why?" Two questions in one (who may change it + must they note why); grammar. → "Is it written who may change a forecast by hand?"

**rm-2: Dynamic room pricing, including automatic rate publishing** (8 questions → 9)
- Q1 **Fix** (grammar): "Have the owner or general manager set the lowest and highest price the tool may publish?" "Have the owner or general manager set" is ungrammatical; it is a governance rule, not People. → "Has the owner or general manager set the lowest and highest price the tool may publish?" [tag: Organisation & governance · Owner]
- Q6 **Fix** (wrong pillar): "Does the tool receive competitor rates every day?" A data feed is a technology question. → "Does the pricing tool receive competitor rates automatically every day?" [tag: Technology infrastructure · IT]
- Q7 **Fix** (wrong answerer): "In a managed or franchised hotel, has the owner agreed in writing to automatic pricing?" The owner, not the GM, knows whether they agreed. [tag: Organisation & governance · Owner]
- **Add** [People · GM] "Has the revenue manager agreed to own the pricing tool day to day?" (Automatic prices need one person watching them daily.)

**rm-3: Competitor rate tracking and market insight with machine learning** (6 questions → 6): all OK.

**rm-4: AI assistants for revenue questions, reports and price explanations** (6 questions → 7)
- Q6 **Fix** (wrong pillar): "Can the assistant show which report or number each answer comes from?" A product feature (showing sources) is technology, not governance. [tag: Technology infrastructure · IT]
- **Add** [Organisation & governance · GM] "Is it agreed who corrects the assistant when it gives a wrong figure?" (Wrong figures repeated in meetings lead to wrong price decisions.)

**rm-5: AI agents that watch revenue, recommend and act** (8 questions → 8)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Can that person set what the agents may do and review what they did?" "That person" makes no sense on its own in the action plan. → "Can the senior revenue person set what the agents may do and review what they did?"

**rm-6: Total revenue and budget forecasting, including function space** (6 questions → 6): all OK.

**rm-7: Price optimisation for upsells and extras** (7 questions → 7): all OK.

**rm-8: Spa and wellness yield management and demand-based treatment prices** (7 questions → 7): all OK.

**rm-9: Rate parity checks (same price on all channels) and automatic matching** (8 questions → 8)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that person know the price terms agreed with each booking site?" "That person" makes no sense on its own. → "Does the revenue manager know the price terms agreed with each booking site?"

### Reservations & Distribution

**res-1: AI voice agents for reservation and front-desk calls (hotel and central lines)** (11 questions → 10)
- Q7 **Remove** (legal or data-protection framing): "Does the agent tell callers at the start that they are speaking to a computer?" Telling callers they speak to a computer comes from AI disclosure rules; Ludo wants no legal content. Guest hand-off is already covered by Q11.

**res-2: AI handling of reservation emails and offers** (7 questions → 7): all OK.

**res-3: AI channel management (sending rates and availability to booking channels)** (6 questions → 8)
- Q1 **Fix** (wrong pillar): "Does someone decide which rooms and rates go to each booking site?" Deciding the distribution mix is ownership (People), not a skill. → "Is one person named to decide which rooms and rates go to each booking site?" [tag: People · GM]
- Q6 **Fix** (hard to answer Yes/No): "Has the vendor shown what the tool does automatically beyond sending rates?" "Beyond sending rates" is vague; a GM cannot answer it. → "Has the vendor shown which changes the tool makes by itself, such as closing sales on a site?" [tag: Organisation & governance · IT]
- **Add** [People · GM] "Is one person named to act on channel-manager alerts every day?" (Channel errors sell rooms at the wrong price within hours.)
- **Add** [Skills · Department head] "Can the revenue team spot a booking site showing a wrong price or closed rooms?" (Channel errors are cheap if caught the same day.)

**res-4: AI assistant and personalisation in the website booking engine** (7 questions → 8)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Can that person read how many visitors book, and where others leave?" "That person" makes no sense on its own. → "Can the online sales manager see how many visitors book and where others leave?"
- **Add** [Organisation & governance · GM] "Is it written which offers and extras the booking assistant may suggest?" (Stops the assistant pushing offers you do not want to sell.)

**res-5: Predicting cancellations and no-shows to set overbooking** (6 questions → 6): all OK.

**res-6: AI for group rooming lists, rate loading and reservation tasks** (6 questions → 6)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that person know your group contracts and rate codes well?" "That person" makes no sense on its own. → "Does the group coordinator know your group contracts and rate codes well?"

**res-7: Bookable hotel apps inside AI assistants (such as ChatGPT apps)** (9 questions → 8)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that person understand how guests can book through AI assistants such as ChatGPT?" "That person" makes no sense on its own. → "Does the distribution lead understand how guests book through AI assistants such as ChatGPT?"
- Q6 **Remove** (duplicate within the use case): "Are your brand and pricing rules for new sales channels written down?" Same rule as Q8 (which rates and rooms AI assistants may sell).

**res-8: AI scoring and analysis of reservation calls** (8 questions → 8): all OK.

### Sales & Marketing

**sm-1: AI-written marketing text and translation** (7 questions → 7)
- Q4 **Rewrite** (design choice, not readiness): "Have you decided whether the tool should publish straight to your website?" "Have you decided whether it should publish straight to your website" is a design choice, not readiness, and Yes/No does not show readiness. → "Can staff put approved texts and translations on your website without help from an agency?"

**sm-2: Handling group and event enquiries and requests for proposals** (7 questions → 7)
- Q7 **Rewrite** (duplicate within the use case): "Does a person approve every price before a proposal goes out?" Overlaps Q1 (sales manager reviews every proposal). → "Does the tool hold meeting rooms only after a person confirms the booking?"

**sm-3: Guest grouping, predictive targeting, loyalty and personalised email campaigns** (6 questions → 7)
- Q6 **Remove** (legal or data-protection framing): "Is it recorded which guests have agreed to marketing emails?" Recording who agreed to marketing emails is a consent (data-protection law) item.
- **Add** [Organisation & governance · GM] "Does a person approve every campaign before it is sent?" (A wrong guest group or offer reaches thousands at once.)
- **Add** [Data · Department head] "Do you know your email open and booking rates today, to compare against?" (Without a starting figure you cannot show the tool helped.)

**sm-4: AI-made images and video for marketing** (6 questions → 6)
- Q4 **Rewrite** (legal or data-protection framing): "Do you own the rights to every photo you feed into the tool?" Photo "rights" is copyright framing. Keep the practical need: real photos to start from. → "Do you have recent, good-quality photos of your hotel to feed into the tool?"
- Q6 **Remove** (legal or data-protection framing): "Have you agreed how you will mark images that are AI-made?" Marking AI-made images comes from AI labelling rules. Q5 already guards against misleading images.
- **Add** [Technology infrastructure · IT] "Can the image tool deliver the sizes your website and social channels need?" (Otherwise staff redo every image by hand.)

**sm-5: Optimising paid ads, metasearch and automated ad buying** (6 questions → 6)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Can that person read how much booking revenue each ad brings in?" "That person" makes no sense on its own. → "Can the digital marketing manager see how much booking revenue each ad brings in?"

**sm-6: Visibility in search engines and AI assistants (SEO, GEO)** (6 questions → 6)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that person know what makes a hotel appear in AI search answers?" "That person" makes no sense on its own. → "Does the online sales lead know what makes a hotel appear in AI search answers?"

**sm-7: Finding, qualifying and scoring sales leads (groups, events, companies)** (6 questions → 6)
- Q6 **Rewrite** (legal or data-protection framing): "Has the vendor told you where its company contact data comes from?" "Where its contact data comes from" is a data-protection question; ask about quality instead. → "Has the vendor shown how current and accurate its company contact data is?"

### Front Office

**fo-1: Digital check-in with ID document scan (online, mobile or kiosk)** (6 questions → 7)
- Q5 **Rewrite** (legal or data-protection framing): "Does the tool send guest registration details to the reporting system you use today?" Sending registration details to "the reporting system" is a legal registration duty. Keep it as plain systems. → "Does the tool fill in the guest registration form you use today?"
- Q6 **Remove** (legal or data-protection framing): "Is it decided how long ID scans are kept and who can see them?" ID-scan retention is data-protection law (Ludo flagged it).
- **Add** [Data · Department head] "Are guest names and booking details correct before arrival, so scans match them?" (Wrong booking names make every scan fail at the desk.)
- **Add** [Organisation & governance · GM] "Is it agreed what desk staff do when an ID scan does not match the booking?" (Guests should not wait while staff improvise.)

**fo-2: AI room assignment** (6 questions → 7)
- **Add** [People · GM] "Has the front-office manager agreed to own the room-assignment rules?" (Someone must keep the rules in line with sales and upgrade policy.)

**fo-3: Biometric face check at check-in (selfie matched to ID photo)** (6 questions → 6)
- Q5 **Remove** (legal or data-protection framing): "Is it agreed that face images are deleted right after the check?" Face-image deletion is data-protection law (Ludo flagged it).
- Q6 **Fix** (two ideas in one): "Does the face check work equally well for guests of every age and skin tone, and with glasses?" Three conditions in one; the IT lead cannot know this without the vendor. → "Has the vendor shown the face check works equally well for guests of every age and skin tone?"
- **Add** [Organisation & governance · GM] "Is one person named to handle guests who complain about the face check?" (Complaints about face checks escalate fast if nobody owns them.)

**fo-4: AI assistants and agents for the front desk and property management system** (8 questions → 8): all OK.

**fo-5: Upselling at check-in (desk, kiosk, before arrival)** (7 questions → 8)
- Q1 **Rewrite** (design choice, not readiness): "Do desk staff earn a reward for upgrades they sell?" Whether staff earn a reward is a pay design, and No is not a readiness gap in itself. → "Is it agreed how desk staff are rewarded for the upgrades they sell?" [tag: Organisation & governance · GM]
- **Add** [People · GM] "Has the front-office manager agreed to own upsell offers and their results?" (Offers go stale without an owner.)

**fo-6: Guest risk scoring before arrival (ID, behaviour, past stays)** (6 questions → 6)
- Q1 **Fix** (two ideas in one): "Does a manager review every flagged booking, with staff, not the score, deciding?" Two ideas (review + who decides); Q6 already covers "not the score alone". → "Does a manager review every flagged booking before anything happens?"

**fo-7: AI avatar or hologram receptionist (check-in kiosk)** (12 questions → 11)
- Q8 **Remove** (legal or data-protection framing): "Does the avatar tell guests at the start that they are talking to a computer?" AI disclosure rule; Q10 (call staff from the kiosk) covers the guest-trust part.

**fo-8: Lost-and-found logging and matching guest claims** (9 questions → 8)
- Q3 **Remove** (duplicate within the use case): "Does a person check every match before an item is released?" Same as Q8 (one person confirms matches and releases items).
- Q7 **Remove** (legal or data-protection framing): "Is it decided how long photos and guest claims are kept?" How long photos and guest claims are kept is a data-retention (legal) item.
- Q9 **Fix** (wrong answerer): "Is it agreed what happens to items nobody claims?" Finance is the wrong person to answer; the GM decides what happens to unclaimed items. [tag: Organisation & governance · GM]
- **Add** [Organisation & governance · GM] "Is it agreed how guests report a lost item and get updates?" (Guests chase reception if they hear nothing.)

### Guest Experience & Customer Service

**gx-1: Review and guest-feedback analysis (including positive or negative tone)** (6 questions → 6): all OK.

**gx-2: AI chat assistant for guests in several languages, before booking and during the stay (website, WhatsApp, booking-site inbox)** (12 questions → 12)
- Q6 **Remove** (legal or data-protection framing): "Does the assistant tell guests at the start that they are chatting with a computer?" AI disclosure rule; Q12 covers reaching staff. Frees a slot for the missing Financial question.
- Q11 **Fix** (duplicate within the use case): "Has a person checked the assistant's answers about prices, opening times and policies?" Close to Q5 (answers written down and current); make it about the test before launch. → "Has a person tested the assistant with real guest questions before it goes live?"
- **Add** [Financial investment · Finance] "Do you know the monthly fee and any price per conversation?" (Costs grow with guest numbers and channels.)

**gx-3: Guest review replies drafted by AI** (7 questions → 7)
- Q6 **Rewrite** (duplicate within the use case): "Does a person approve each reply before it is posted?" Same as Q1 (a manager approves replies). → "Is there an agreed time to reply to every review, such as within two days?"

**gx-4: Guest personalisation using one combined guest profile** (7 questions → 7)
- Q2 **Fix** (hard to answer Yes/No): "Can staff use guest preferences without making guests feel watched?" "Without making guests feel watched" cannot be answered Yes/No. → "Have staff been shown how to use guest preferences without quoting the profile to the guest?"
- Q6 **Remove** (legal or data-protection framing): "Can a guest ask to see or delete their preferences, and is someone named to do it?" Seeing or deleting their data is a data-protection right (Ludo flagged it).
- **Add** [Organisation & governance · GM] "Is one person named to decide which preferences are recorded about guests?" (Keeps profiles useful and stops staff recording remarks about guests.)

**gx-5: Digital concierge and recommendations during the stay** (9 questions → 9)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Can that person choose and update the places the tool recommends?" "That person" makes no sense on its own. → "Can the concierge lead choose and update the places the tool recommends?"
- Q6 **Remove** (legal or data-protection framing): "Does the tool tell guests at the start that they are using a computer assistant?" AI disclosure rule; Q9 covers reaching a person.
- **Add** [Organisation & governance · GM] "Is one person named to update recommendations when a partner closes or changes?" (Out-of-date recommendations send guests to closed places.)

**gx-6: In-room voice assistant** (11 questions → 10)
- Q9 **Remove** (legal or data-protection framing): "Does the device tell guests it is a computer assistant when they first use it?" AI disclosure rule; Q11 covers reaching reception.

### Food & Beverage service

**fb-1: AI for event and banqueting sales (enquiries, proposals, contracts)** (6 questions → 6): all OK.

**fb-2: Room-service and restaurant or bar ordering through chat or voice assistants** (9 questions → 8)
- Q1 **Rewrite** (wrong pillar): "Do restaurant and bar staff receive the orders the assistant takes?" Receiving orders is technology; People needs an owner. → "Has the room-service or restaurant manager agreed to own the orders the assistant takes?"
- Q6 **Remove** (duplicate within the use case): "Does the kitchen check allergen details before the assistant uses them?" Same as Q8 (kitchen checked what the assistant tells guests about dishes).
- Q7 **Remove** (legal or data-protection framing): "Does the assistant tell guests they are ordering through a computer?" AI disclosure rule.
- **Add** [Organisation & governance · GM] "Is it agreed what the assistant does when the kitchen is closed or an item is sold out?" (Guests should not order what the kitchen cannot make.)

**fb-3: Improving menus and food and drink prices (menu engineering)** (6 questions → 6): all OK.

**fb-4: QR code or mobile ordering, with AI suggestions of extra items and automatic menu price changes** (8 questions → 9)
- Q7 **Rewrite** (duplicate within the use case): "Has a person checked the digital menu's dish descriptions and prices?" Overlaps Q5 (menus and prices current). Make it the allergen check. → "Has the kitchen checked the allergen details shown on the digital menu?"
- **Add** [Organisation & governance · GM] "Is it written how far and when the tool may change menu prices?" (Price jumps during a meal annoy guests.)

**fb-5: Robots that deliver and serve (amenities, room service, restaurants and bars)** (11 questions → 11)
- Q9 **Fix** (feature check: better asked of the vendor): "Do the robots slow down and give way to guests in corridors and lifts?" A department head cannot know this until the vendor shows it. → "Has the vendor shown that the robots slow down and give way to guests in corridors and lifts?" [tag: Technology infrastructure · Department head]

**fb-6: Restaurant table bookings: AI that answers calls and AI table planning** (11 questions → 11)
- Use case: The name shows as "Restaurant table bookings" in the step-4 list; the spec name is "Restaurant table bookings: AI that answers calls and AI table planning". Show the full name, or a short name plus the subtitle.
- Q6 **Remove** (legal or data-protection framing): "Does the tool tell callers at the start that they are speaking to a computer?" AI disclosure rule; Q11 covers reaching staff.
- **Add** [People · GM] "Has the restaurant manager agreed to own the AI booking line and table plan?" (Someone must fix wrong bookings before service starts.)

### Housekeeping

**hk-1: Staff tasks and messages in several languages (voice or chat turned into tasks, translation)** (7 questions → 7)
- Q7 **Fix** (wrong pillar): "Do all housekeeping staff have a phone or device to use the app?" Devices are technology, not skills. [tag: Technology infrastructure · IT]

**hk-2: Self-driving floor-cleaning robots** (9 questions → 10)
- Q3 **Fix** (grammar): "For several floors, can the robots use the lift?" Awkward start ("For several floors"). → "Can the robots use the lifts to reach every floor they clean?"
- Q7 **Fix** (feature check: better asked of the vendor): "Do the robots stop safely when a guest, child or bag is in the way?" Ask the vendor to show it. → "Has the vendor shown the robots stop safely when a guest, child or bag is in the way?" [tag: Technology infrastructure · Department head]
- **Add** [People · GM] "Has a public-areas supervisor agreed to own the robots day to day?" (Robots need someone who notices when they stop.)

**hk-3: Linen and amenity forecasting, or linen tracking with RFID (radio) tags** (6 questions → 8)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Can that person use forecasts to set how much stock to keep?" "That person" makes no sense on its own. → "Can the housekeeping manager use forecasts to set how much stock to keep?"
- Q3 **Fix** (wrong pillar): "Does the tool receive your occupancy forecast?" A data feed between systems is technology. → "Does the tool receive your occupancy forecast from your booking system?" [tag: Technology infrastructure · IT]
- Q6 **Fix** (wrong pillar): "Do you know how much linen you lose or replace each year today?" A baseline figure is Data, not Financial investment (cost of the tool is missing; see missing questions). [tag: Data · Department head]
- **Add** [Financial investment · Finance] "Do you know the cost of the tool and, if used, the RFID tags and readers?" (Tags and readers are often most of the cost.)
- **Add** [Technology infrastructure · IT] "If you use RFID tags, can your laundry read them at pick-up and delivery?" (Tags only help if both sides can read them.)

**hk-4: Cleaning and room status based on sensors that detect if a room is occupied** (6 questions → 7)
- Q4 **Remove** (legal or data-protection framing): "Have you decided how guests are told the room has presence sensors?" Telling guests about sensors is a privacy-notice item; Q6 keeps the practical guest-trust part.
- **Add** [People · GM] "Has the executive housekeeper agreed to own the sensor-based cleaning plan?" (Supervisors need one person to settle sensor questions.)
- **Add** [Financial investment · Finance] "Do you know the monthly software cost on top of the sensors?" (Sensors are only part of the cost.)

**hk-5: Room inspection with image recognition (computer vision)** (8 questions → 8): all OK.

**hk-6: Planning room-cleaning order, staff assignments and workloads** (8 questions → 8): all OK.

**hk-7: Bed-bug monitoring sensors with image recognition** (9 questions → 8)
- Q3 **Fix** (needs the previous question to make sense ("that person")): "Can that manager read an alert and its photo?" "That manager" makes no sense on its own. → "Can the duty manager read a bed-bug alert and its photo?"
- Q4 **Fix** (wrong pillar): "Is there a written procedure to close, check and treat a room after an alert?" A written procedure is governance. [tag: Organisation & governance · GM]
- Q7 **Remove** (legal or data-protection framing): "Is it decided how long alert records and photos are kept?" Retention of records and photos is a data-retention item.
- Q9 **Fix** (wrong pillar): "Does the tool block the room in your booking system after an alert?" A system link is technology; ask whether it can, not whether it does. → "Can the tool block the room in your booking system after an alert?" [tag: Technology infrastructure · IT]

### Maintenance & Engineering

**me-1: AI tuning of central heating, cooling and ventilation (building management system), with energy analysis** (8 questions → 8): all OK.

**me-2: Sorting and creating repair requests, and the equipment register** (7 questions → 8)
- Q1 **Fix** (wrong pillar): "Have engineers been shown how to use the repair app?" Being shown the app is a skill; People needs an owner (see missing). [tag: Skills · Department head]
- **Add** [People · GM] "Has the chief engineer agreed to own the repair-request list?" (Requests pile up when nobody owns the list.)

**me-3: Digital twins (a live virtual model of the building)** (7 questions → 7): all OK.

**me-4: Guest-room energy management (heating, cooling and lighting adjusted to whether the room is occupied)** (8 questions → 9)
- Q1 **Rewrite** (duplicate within the use case): "Can engineering set how far heating or cooling may drop in empty rooms?" Same as Q7 (how far temperature may drop in empty rooms). → "Can engineering see each room's settings and energy use on one screen?"
- Q8 **Remove** (duplicate within the use case): "Can engineering switch a room back to manual control when a guest complains?" Same as Q5 (fixing a guest comfort complaint quickly).
- **Add** [People · GM] "Has the chief engineer agreed to own room energy settings?" (Someone must answer for comfort and savings together.)
- **Add** [Financial investment · Finance] "Do you know the yearly software or service fee on top of the equipment?" (Running costs decide whether the savings are real.)

**me-5: Predictive maintenance by the equipment maker (lifts, escalators, doors)** (6 questions → 6)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Can that person hold the maker to the response times in the service contract?" "That person" makes no sense on its own. → "Can the engineering manager hold the maker to the response times in the service contract?"

**me-6: Predictive maintenance run by the hotel (heating, ventilation and air conditioning, kitchen, technical devices)** (7 questions → 8)
- **Add** [Financial investment · Finance] "Do you know the data partner's yearly fee?" (Running costs come on top of sensors.)

**me-7: Water leak and fault detection** (6 questions → 8)
- Q6 **Rewrite** (feature check: better asked of the vendor): "Does every alert say where to shut off the water?" A feature check the engineer cannot answer; ask whether staff know. → "Do engineers know where to shut off the water in every area a sensor covers?"
- **Add** [People · GM] "Is one engineer named to own the leak sensors and their alerts?" (Unowned alerts get ignored at night.)
- **Add** [Financial investment · Finance] "Do you know the monthly monitoring fee?" (Monitoring often costs more than the sensors over time.)

### Kitchen & Culinary Operations

**kc-1: Measuring food waste with cameras (computer vision)** (6 questions → 8)
- **Add** [Skills · Department head] "Can the chef turn waste reports into changes to portions or menus?" (Measuring waste saves nothing without changes.)
- **Add** [Financial investment · Finance] "Do you know the monthly subscription on top of the hardware?" (Subscriptions run for years.)

**kc-2: Allergen handling and menu labelling** (6 questions → 6): all OK.

**kc-3: Smart cooking equipment (ovens that recognise the food)** (6 questions → 7)
- **Add** [People · GM] "Has the head chef agreed to own the cooking programmes on the new equipment?" (Programmes go out of date when menus change.)

**kc-4: Forecasting kitchen production, guest numbers (covers) and breakfast buffet, including purchase quantities** (8 questions → 8): all OK.

**kc-5: Recipe and menu creation with generative AI** (6 questions → 7)
- **Add** [Technology infrastructure · IT] "Is a business version of the AI tool set up for the kitchen team?" (Free accounts mix recipes with personal use and leave no shared record.)

**kc-6: Robotic cooking stations** (10 questions → 11)
- Q4 **Fix** (wrong pillar): "Do you have a maintenance contract with a fast response time?" A service contract is governance, not technology. [tag: Organisation & governance · GM]
- **Add** [Financial investment · Finance] "Do you know the yearly service and ingredient-cartridge cost?" (Running costs decide whether the robot pays back.)

### Procurement & Purchasing

**pr-1: Automatic purchase suggestions and reordering** (7 questions → 7): all OK.

**pr-2: Forecasting demand and stock for purchasing** (7 questions → 7)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Can they turn a forecast into order quantities?" "They" makes no sense on its own. → "Can the purchasing manager turn a forecast into order quantities?"

**pr-3: Checking invoices against purchase orders (two- or three-way) and spotting invoice errors** (6 questions → 6)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that person know how to settle a price or quantity difference with a supplier?" "That person" makes no sense on its own. → "Does the accounts payable clerk know how to settle a price or quantity difference with a supplier?"

**pr-4: Spend analysis and detection of stock differences and losses (shrinkage)** (6 questions → 7)
- **Add** [People · GM] "Has the financial controller agreed to own stock-loss reviews?" (Loss findings need an owner who is not the person being checked.)

**pr-5: Supplier price comparison, market benchmarks and checks on agreed contract prices** (6 questions → 7)
- **Add** [People · GM] "Has the purchasing manager agreed to review price gaps each month?" (Price gaps only pay off when someone acts on them.)

**pr-6: Forecasting supplier prices to prepare negotiations** (6 questions → 6)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that person plan negotiations around expected price changes?" "That person" makes no sense on its own; also nearly the same as Q1. → "Can the purchasing manager tell when a forecast is too uncertain to use in a negotiation?"

### Finance & Accounting

**fa-1: Scanning supplier invoices and coding them to the general ledger** (7 questions → 7): all OK.

**fa-2: Spotting fraud and unusual patterns in payments** (7 questions → 7): all OK.

**fa-3: Automatic reconciliation of bank, card, booking-site commission, PMS and supplier statements** (6 questions → 6): all OK.

**fa-4: Forecasting cash flow and profit and loss (P&L), and budgeting** (6 questions → 7)
- **Add** [Organisation & governance · GM] "Is it agreed how often the forecast is updated, such as weekly?" (A stale cash forecast misleads.)

**fa-5: Generative AI assistants for finance and agents for supplier invoices** (10 questions → 8)
- Q1 **Rewrite** (duplicate within the use case): "Does the finance team approve what the AI agents do before it counts?" Same as Q6 (every entry approved before posting). People needs an owner. → "Has the financial controller agreed to own what the AI agents do?"
- Q6 **Remove** (duplicate within the use case): "Is every entry approved by a person before it is posted?" Same idea as Q1 and contradicts Q9 (a limit above which agents must ask).
- Q7 **Remove** (duplicate within the use case): "Is every agent action recorded and kept?" Same as Q2 (record of every action the agents took).

**fa-6: Automating the night audit (end-of-day closing)** (7 questions → 7)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Can that person review items the tool cannot close?" "That person" makes no sense on its own. → "Can the night auditor review the items the tool cannot close?"

**fa-7: Automatic handling of chargeback disputes (guests reversing card payments)** (7 questions → 7): all OK.

### Human Resources

**hr-1: Forecasting staff needs and scheduling shifts (all departments, including room attendants)** (12 questions → 12)
- Q1 **Remove** (duplicate within the use case): "Do department heads approve every rota before it is published?" Same as Q11 (a manager makes the final decision on each person's shifts).
- Q9 **Fix** (duplicate within the use case): "Can you enter each person's contract hours and rest rules into the tool?" Overlaps Q7 (contract hours in one system); make it the tool check. → "Can the tool apply each person's rest times and days off when it plans?" [tag: Technology infrastructure · IT]
- **Add** [Financial investment · Finance] "Do you know the monthly cost per employee of the scheduling tool?" (Usually priced per employee, so cost grows with staff numbers.)

**hr-2: Recruiting with AI: chatting with applicants, screening and matching** (8 questions → 8)
- Q8 **Remove** (duplicate within the use case): "Can HR explain to an applicant why the tool ranked them as it did?" Same as Q2 (HR can check why the tool ranked an applicant).
- **Add** [Data · Department head] "Do you know how many applicants you get per role today, to compare against?" (Shows whether the tool saves time.)

**hr-3: Staff induction and training (AI-made courses, AI coaching, short lessons)** (7 questions → 7)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Can that person check that AI-made lessons are correct and clear?" "That person" makes no sense on its own. → "Can the training manager check that AI-made lessons are correct and clear?"

**hr-4: Predicting which staff may leave, and analysing staff engagement** (9 questions → 9)
- Q8 **Remove** (duplicate within the use case): "Does a person make every final decision about a person?" Same as Q6 (predictions never used alone for promotion or dismissal).
- **Add** [People · GM] "Has the HR manager agreed to own the engagement results?" (Results need an owner who acts on them.)

**hr-5: Matching seasonal staff to hotels** (8 questions → 7)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Can that person spot a match that ignores a person's wishes or limits?" "That person" makes no sense on its own. → "Can the cluster manager spot a match that ignores a person's wishes or limits?"
- Q7 **Fix** (wrong pillar): "Is housing or travel for seasonal staff arranged with each match?" Housing and travel are an organisation item. [tag: Organisation & governance · GM]
- Q8 **Remove** (duplicate within the use case): "Can the cluster manager explain why a person was matched to a hotel?" Same as Q6 (staff can see why they were matched).

**hr-6: Face or fingerprint time clocks for staff attendance** (8 questions → 8)
- Q3 **Rewrite** (legal or data-protection framing): "Does IT know how to delete a person's face or fingerprint pattern when they leave?" Deleting biometric patterns is data-protection framing (Ludo flagged face-image deletion). → "Can IT remove a leaver from the time clocks on their last day?"
- Q6 **Remove** (legal or data-protection framing): "Have you written down why a card or PIN alone is not enough?" "Why a card or PIN alone is not enough" is a legal necessity test.
- **Add** [Organisation & governance · GM] "Is it agreed what staff do when the clock does not recognise them?" (Staff must still be able to clock in.)

### General Management & Administration

**gm-1: Business performance dashboards (KPIs) with AI analysis** (6 questions → 7)
- **Add** [Data · Department head] "Do your booking, finance and till systems use the same outlet and department names?" (Mismatched names break the dashboard figures.)

**gm-2: Generative AI assistants for managers and head-office staff** (6 questions → 8)
- Q5 **Fix** (wrong pillar): "Have you listed the first tasks managers will use the assistant for, such as reports or emails?" Listing first tasks is a plan (governance), not People. [tag: Organisation & governance · GM]
- **Add** [People · GM] "Has the GM agreed to sponsor the assistant and use it themselves?" (Managers follow what the GM uses.)
- **Add** [Organisation & governance · IT] "Is one person named to manage the assistant's licences and settings?" (Licences sprawl and settings drift without an owner.)

**gm-3: Meeting, briefing and report automation** (6 questions → 7)
- Q5 **Rewrite** (legal or data-protection framing): "Is it agreed which meetings may be recorded for summaries?" "Which meetings may be recorded" reads as a recording-consent rule; make it practical. → "Is it agreed which meetings the tool joins and summarises?"
- **Add** [People · GM] "Has one manager agreed to own the automated briefings and reports?" (Someone must fix a wrong briefing before it spreads.)

**gm-4: Company-wide AI and data platforms in hotel groups** (7 questions → 7): all OK.

**gm-5: Reporting to owners and asset managers** (7 questions → 7)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that person know the report format each owner expects?" "That person" makes no sense on its own. → "Does the asset manager know the report format each owner expects?"

**gm-6: Assistant answering frontline staff questions on handbooks and procedures** (6 questions → 8)
- Q5 **Fix** (wrong pillar): "Does the assistant show which handbook page each answer comes from?" A product feature is technology. [tag: Technology infrastructure · IT]
- Q6 **Fix** (wrong pillar): "Can staff ask questions in their own language?" A product feature is technology. → "Can staff ask the assistant questions in their own language?" [tag: Technology infrastructure · IT]
- **Add** [Skills · Department head] "Do staff know to ask a supervisor when an answer seems wrong?" (Wrong procedures repeated by staff cause real mistakes.)
- **Add** [Organisation & governance · GM] "Is one person named to approve handbook changes before the assistant uses them?" (The assistant is only as good as the handbook.)

**gm-7: Internal tools built with AI coding assistants** (9 questions → 9): all OK.

### IT & Security

**it-1: AI threat detection and automatic response (network, email, computers and phones)** (9 questions → 9)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that team know how to respond when an attack is detected?" "That team" makes no sense on its own. → "Does the security team know how to respond when an attack is detected?"

**it-2: AI help desk for IT problems** (6 questions → 7)
- Q6 **Fix** (grammar): "Must a person approve password resets and access changes the AI suggests?" "Must a person approve" reads as a rule, not a readiness check. → "Does a person approve every password reset and access change the AI suggests?"
- **Add** [Organisation & governance · GM] "Can staff reach a person on the IT team when the AI cannot help?" (Stuck staff stop working.)

**it-3: Detecting booking fraud: fake reservations, criminals posing as booking sites, online card fraud** (7 questions → 7): all OK.

**it-4: AI analysis of security camera video** (7 questions → 8)
- Q6 **Remove** (legal or data-protection framing): "Is it decided how long video and alerts are kept, and who can see them?" Video retention and access is a data-retention item.
- **Add** [Organisation & governance · GM] "Is it agreed that the tool is not used to watch how staff work?" (Keeps the tool on safety, not monitoring staff.)
- **Add** [Data · Department head] "Are camera positions and the areas each one covers recorded?" (Alerts are useless if nobody knows where the camera is.)

**it-5: AI network management for guest and staff Wi-Fi** (7 questions → 7)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that team know how to read Wi-Fi performance reports?" "That team" makes no sense on its own. → "Can the IT team read Wi-Fi performance reports?"

### Sustainability & Governance

**lg-1: Collecting and reporting sustainability (ESG) and carbon data** (6 questions → 6)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that person know which sustainability reports your owner, brand or lenders ask for?" "That person" makes no sense on its own. → "Does the sustainability lead know which reports your owner, brand or lenders ask for?"

**lg-2: Tools for handling guests' requests about their personal data** (6 questions → 0)
- Use case: Remove the use case from the step-4 list (it is a data-protection duty by nature). Keep its id so old saved checks still open, then show "This use case is no longer in the list" and continue as "None fits". Alternative if Ludo wants to keep it: rename to "Finding all of one guest's records across your systems" with the practical questions only.

**lg-3: Generative AI for reviewing contracts** (6 questions → 7)
- Q2 **Fix** (needs the previous question to make sense ("that person")): "Does that person know your contract terms well enough to check the AI's review?" "That person" makes no sense on its own. → "Does the contracts lead know your contract terms well enough to check the AI's review?"
- **Add** [Technology infrastructure · IT] "Is a business version of the AI tool set up for contract work?" (Contracts should not go into personal AI accounts.)

**lg-4: Rules and oversight for using AI** (8 questions → 8)
- Q3 **Fix** (hard to answer Yes/No): "Can the owner write short, clear rules staff will read?" "The owner" can be read as the hotel owner. → "Can the person who owns the AI rules write short rules staff will read?"

## 5. Sources

Checked: **303 source entries (248 unique URLs) across 99 use cases**, plus 21 text-only citations in the landing page and steps 2 and 3. Every URL was checked with curl. Pages that block bots were sampled with a second fetcher (4 of 4 opened). The rule used: 404 or a dead redirect = broken; 403, 429 or a timeout = unverified, not broken.

- **Links (unique URLs):** 190 live, 7 DOIs resolve (publisher blocks bots), 3 redirected to a different page, **3 broken**, 45 unverified (403/429 bot blocks, mostly hospitalitynet.org and hoteltechreport.com; the sampled ones were live).
- **Broken:** Oracle Barceló customer page (fo-5, 404), Justt hospitality page (fa-7, 404, its only source), Juniper/HPE citizenM case study (it-5; redirects to a general HPE page, its only source).
- **Does the source support what the tool says for that use case?** Yes 197, partly 91, no 15. Most "partly" are honestly labelled in the text already ("no AI stated", "announced", "not a hotel"). The 15 "no" are listed below.
- **Source types:** vendor pages and case studies 130, trade press that mostly reprints vendor releases 85, independent trade or business journalism 19, academic 38, government or intergovernmental 12, hotel companies' own publications 9, other 10.
- **Credibility:** 44 of 303 entries (14%) score 7 or more. My scale: peer-reviewed journal 8, government statistics 9, conference paper 7, HES-SO survey reports 7, working paper or school report 6, independent press 6, hotel's own release 6, trade press reprinting a vendor release 5, vendor page 4. Theses and working papers are not counted as peer-reviewed. This approximates Ludo's codebook (credible = 7+); please map it to the exact codebook if it differs. The descriptions are honest: vendor claims are labelled as such, and all 7 DOIs resolve. Authors and dates were not each re-checked against the publications.

### Top source problems

1. **Use cases with no working source (4):**
   - Night audit (fa-6) and Generative AI for reviewing contracts (lg-3) list nothing.
   - Chargeback disputes (fa-7) and Wi-Fi network management (it-5) list only a broken link.
   - Verified, live replacements:
     - fa-6: Stayflexi "Night Auditor" AI agent (stayflexi.com/agents/night-auditor); eZee "Enhanced Night Audit Flow" (no AI stated).
     - lg-3: Legora customer story with Accor's legal team (legora.com/customers/accor); Thomson Reuters case study with Swire Hotels (CoCounsel).
     - it-5: HPE press release of 22 Sep 2026, Aethos London Shoreditch with the HPE Self-Driving Network. All of these are vendor sources.
     - fa-7: needs a source.
2. **Off-topic sources:**
   - Room-status sensors (hk-4): 8 of its 10 sources are about smoking sensors and wrongful smoking fees, not occupancy-based cleaning. The Minut entry says "see the Minut entry below", which does not exist.
   - Seasonal staff matching (hr-5): its only source is a Club Med data/AI award release that never mentions staff matching.
   - Company-wide AI platforms (gm-4): cites IHG's guest travel planner.
   - Lead scoring (sm-7): cites hivr.ai, a phone agent.
   - Voice agents (res-1): cites the IAB task study.
3. **Thin evidence (44 use cases have at most one source that fully supports them).** The worst cases:
   - front-desk AI agents (fo-4): only Oracle's own release;
   - supplier price forecasting (pr-6): only the Club Med release;
   - stock-loss detection (pr-4): only a generic purchase-to-pay page;
   - invoice matching (pr-3): two generic repeats. Phacet/Astotel, listed under pr-5, actually fits pr-3;
   - staff attrition (hr-4): one 2020 release;
   - owner reporting (gm-5): AI not shown.
4. **Predictive maintenance run by the hotel (me-6)** cites a review that says no source shows this in hotels. That is fine as evidence for a "Very low" rating, but say so: "No hotel example found; included because vendors offer it."
5. **Legal-type sources (against Ludo's rule):**
   - ICO enforcement order (hr-6): remove.
   - ISO 20380 scope on a reseller page (it-4): remove; it also has the internal note "to confirm against the ISO text".
   - OneTrust data-governance vendor (lg-2): remove with the use case.
   - KITRO "new regulatory push" headline (kc-1): swap for the Orbisk/Winnow sources already listed.
   - Menutech "14 EU allergens" wording (kc-2): reword to "common allergens".
   - The EU CORDIS project page is a funding record, not legal content: keep or drop.
6. **Internal audit notes shown to users:** "to confirm against the ISO text" (it-4), "PDF not re-opened in the audit" (fb-5, OECD), and step 2's "Later that day question 1 was turned round and questions 3 and 4 replaced (owner; Brynjolfsson & Mitchell)". Delete all three.
7. **Duplicate entry:** the EyeFeelIt link is listed twice for the avatar receptionist (fo-7).
8. **Steps 1–3: 21 text-only citations with no link.** All except the team's own analysis now have a verified URL (see sheet "Text citations").
   - Loose evidence: Eurostat's "lack of expertise 70%" is used for MH8 "staff told and able to report errors", and Britz & Schegg's "9% have a formal AI strategy" for MH9 "rules for staff on AI tools".
   - The OECD survey behind MH3 covers manufacturing and ICT firms only, not hotels.
   - The State of Hotel AI 14%/34% figures were not checked against the full report.
9. **Version and count mismatches:** the title says v2.7 while the rules text says v2.6 and v2.5. "n of 90 use cases" sits next to "99 use cases" (the 90 is explained only inside a fold).
10. **Redirected links to fix:** Lighthouse rate-insight now goes to /pricing, Zenchef call-ai to /ai-concierge, and hotelkit /en/ai to an AI-security page.

### Off-topic or non-supporting sources (Supports = N)

| Use case | Source | Why | Fix |
|---|---|---|---|
| res-1 | (repeat) Grienberger et al. (2024) IAB-Kurzbericht 5/2024 | Repeat of the IAB study about assistant hotel managers; nothing on voice agents. | Remove from this use case. |
| sm-7 | (repeat) hivr.ai | hivr.ai is a phone agent for venue enquiries, not lead scoring. | Remove from this use case. |
| hk-4 | Minut: sensors alert hotels and aparthotels to noise, smoking and unauthorised parties, wi | Noise/smoking sensors, not occupancy for room status. The text refers to "the Minut entry below", which does not exist. | Remove, or move to a smoking-sensor note; delete the dangling reference. |
| hk-4 | Consumers' Checkbook (US consumer organisation, Jun 2026): guests "are charged cleaning fe | About false smoking fees, not occupancy-based cleaning. | Remove from this use case. |
| hk-4 | The Points Guy (15 Feb 2026): The Strat charged a couple "a $396 smoking fee at checkout"; | About smoking fees. | Remove. |
| hk-4 | ABC15 (Phoenix TV, 5 Aug 2026): two guests say the Holiday Inn & Suites Phoenix Airport No | About smoking fees. | Remove. |
| hk-4 | ABC7 New York (13 May 2024): guests of the NoMo SoHo say they were wrongly charged a $500  | About smoking fees. | Remove. |
| hk-4 | Rest (US): a "proprietary algorithm evaluates multiple environmental indicators" (vendor p | Smoking-sensor vendor. | Remove. |
| hk-4 | Rest: an alert is sent "When a change in air quality meets defined thresholds"; "Rest does | Smoking-sensor vendor. | Remove. |
| hk-4 | Wynd Sentry (US): "Powered by advanced AI" (vendor page; no date; an unverified vendor cla | Smoking-sensor vendor. | Remove. |
| me-6 | Konstantopoulos, Giannarakis, Xenaki & Garefalakis (2026), AI maturity in back-of-house ho | Says no source shows hotel-run predictive maintenance in use; it supports the "rare" rating, not that the use case is happening. | Keep only as evidence for the rating, and say so; add a real example or mark the use case "no hotel example found". |
| pr-4 | (repeat) Access Group: purchase-to-pay for hotels (generic page) | Generic purchase-to-pay page only; nothing on stock-loss detection. | Needs a source. |
| hr-5 | (repeat) Club Med (journaldespalaces) only — a Club Med data/AI award press release, no cl | Club Med award release; no link to seasonal staff matching. | Needs a source. |
| gm-4 | Hotel IHG: Generative AI travel planner built on Google Cloud Vertex AI (vendor, Apr 2024) | A guest-facing travel planner, not a company-wide AI and data platform. | Remove from this use case. |
| it-4 | ISO 20380:2017, the test standard for camera systems that detect drowning, "does not apply | A standard's scope read on a reseller copy, with the unfinished note "to confirm against the ISO text"; standards/compliance content. | Remove. |

### Text-only citations (steps 1–3)

| Where | Citation | Supports | Issue | Fix (verified URL) |
|---|---|---|---|---|
| Landing | Eurostat ICT usage survey 2025, isoc_eb_ain2 | Y | No link. | Add the Eurostat data browser link. https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ain2/default/table?lang=en |
| Step 2 · Where this comes from | UK Government (DSIT), AI Playbook for the UK Government (10 Feb 2025) | Y | No link. | Add the link. https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government |
| Step 2 | GOV.UK, Assessing if artificial intelligence is the right solution (10 Jun 2019) | Y | No link. | Add the link. https://www.gov.uk/guidance/assessing-if-artificial-intelligence-is-the-right-solution |
| Step 2 | NIST AI RMF 1.0, NIST AI 100-1 (Jan 2023) | partial | No link. A risk framework, only loosely about "is AI the right tool". | Add the link. https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf |
| Step 2 | Google PAIR, People + AI Guidebook, "User Needs + Defining Success" | Y | No link. | Add the link. https://pair.withgoogle.com/chapter/user-needs/ |
| Step 2 | Brynjolfsson & Mitchell (2017), Science 358(6370), 1530–1534 | Y | No link. | Add the DOI link. https://doi.org/10.1126/science.aap8062 |
| Step 2 | "Later that day question 1 was turned round and questions 3 and 4 replaced (owner; Brynjolfsson & Mitchell)." | — | An internal changelog shown to users; means nothing to a GM. | Delete the sentence. Keep: "The five questions and examples are the project team's, based on these sources (Nov 2026)."  |
| Step 3 · MH1 owner | NIST AI RMF 1.0, GOVERN 2.1 (quote) | Y | No link. | Add the link (page with GOVERN 2.1). https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf |
| Step 3 · MH2 budget | Eurostat isoc_eb_ain2: costs too high 41% | Y | No link. | Add the link. https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ain2/default/table?lang=en |
| Step 3 · MH2 budget | HES-SO Valais-Wallis survey news (9 Jul 2025): 35% high set-up costs; 1,500+ hotels, 6 countries | Y | No link. Figure confirmed on the page (35%, over 1,500 hotels, Jan–Apr 2025). | Add the link. https://www.hevs.ch/en/news/how-ai-is-and-isn-t-transforming-european-hospitality-212299 |
| Step 3 · MH3 approved number | OECD (May 2025), The Adoption of AI in Firms: "lack of senior management buy-in" | partial | The survey covers 840 manufacturing and ICT firms in G7 countries, not hotels; the quote was not re-checked. | Add the link and say "manufacturing and ICT firms, not hotels", or drop it. https://www.oecd.org/en/publications/the-adoption-of-artificial-intelligence-in-firms_f9ef33c3-en.html |
| Step 3 · MH3 | State of Hotel AI, Fall 2026 (Destination AI; research by Josiah Mackenzie): 14% executive mandates vs 34% experimentation | partial | No link. Report confirmed (107 hotel company leaders, Aug–Sep 2026); the 14%/34% figures were not checked against the full report. | Add the link; check the figures in the full report or drop them. https://stateofhotelai.com/ |
| Step 3 · MH4 systems | Eurostat isoc_eb_ain2: incompatibility 46% | Y | No link. | Add the link. https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ain2/default/table?lang=en |
| Step 3 · MH4 | State of Hotel AI: 29% systems integration as a barrier | Y | No link. The public page names integration among the main barriers. | Add the link. https://stateofhotelai.com/ |
| Step 3 · MH5 personal data | Eurostat isoc_eb_ain2: data protection and privacy concerns 52% | partial | A barrier statistic framed as data protection; borderline under the no-legal rule. | Keep the number but word it as "concerns about personal data" with no legal framing, or drop it. https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ain2/default/table?lang=en |
| Step 3 · MH7 data | Eurostat: data availability or quality 43%; State of Hotel AI: 42% confident / 48% not | Y | No links. | Add both links. https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ain2/default/table?lang=en |
| Step 3 · MH8 staff told | Eurostat: lack of relevant expertise 70% | N | Loose fit: lack of expertise is about skills, not about telling staff or reporting errors. | Move it to the skills or training evidence. For MH8 use State of Hotel AI (change management named as a main barrier) alone, or "needs a source". https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ain2/default/table?lang=en |
| Step 3 · MH8 | State of Hotel AI: 35% change management as the top barrier | partial | No link. Change management is close but not the same as "staff told". | Add the link. https://stateofhotelai.com/ |
| Step 3 · MH9 staff AI rules | Britz & Schegg (Oct 2025), From Awareness to Action: only 9% have a formal AI strategy document | partial | 9% is confirmed in the PDF, but it is about a formal AI strategy, not rules on what staff may type into AI tools. | Add the link and reword: "Only 9% of hotels surveyed had a formal AI strategy, a sign that written AI rules are rare too". https://www.hevs.ch/media/document/22/britz-schegg-2025-ai-readiness-in-hotels.pdf |
| Step 3 · Where this comes from | "needed for n of 90 use cases"; "covers 90 of the catalogue's 99 use cases" | — | "90" next to "99" elsewhere reads as an error (the explanation is hidden in the fold). | Write "needed for n of the 90 use cases analysed (of 99)" everywhere, or recount on 99 (98 if lg-2 is removed).  |
| Results · How this was worked out | "Rules v2.6 (24 Nov 2026)", "rules v2.5" | — | The page title says v2.7, the rules text says v2.6 and v2.5. | Show one version: "Tool v2.7 (rules unchanged since v2.6)". Drop the v2.5 mention.  |

Every source row, with its HTTP status, type, credibility, whether it supports the claim, the issue and the fix, is in `live_review.xlsx`, sheets "Sources", "Sources per use case" and "Text citations (steps 1-3)".

## 6. Files

- `live_review.md`: this file
- `live_review.xlsx`: Live questions (723 rows), Missing questions, Spec deviations, Bugs and UX, Final list (after fixes), Sources, Sources per use case, Text citations (steps 1-3)
- `sources_fixes.json`: every source change (remove, replace, add, edit text, needs a source)
- `usecase_questions_fixed.json`: corrected question data, ready for Claude Code
- `fix_prompt_for_claude.md`: prompt to apply everything to the new artifact
- `url_status.tsv`: raw HTTP check of every URL
- Scripts: `parse_sources.py`, `check_urls.sh`, `judge_sources.py`, `text_citations.py`, `md_sources.py`, `parse_live.py`, `diff_live.py`, `review_data.py`, `logic_ux.py`, `build_review.py`, `make_files.py`, `make_md.py`