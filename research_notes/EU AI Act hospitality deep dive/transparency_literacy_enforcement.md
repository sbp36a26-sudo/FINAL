# EU AI Act for hotels: transparency (Art. 50), AI literacy (Art. 4), general-purpose AI, penalties and enforcement

State of the law: 17 November 2026. Hotels and accommodation businesses with F&B inside.

**How to read these notes**

- Tags on every statement: **[text]** = read by me in the regulation PDFs; **[team data]** = from `ai-act-data.json`, the booklet or the revision list, not re-verified against the original document; **[secondary]** = web search summary only (the session could not open any web page, so no law-firm article, Commission page or national gazette was read in full); **[my inference]** = my own reasoning.
- "Act p." = page of `/home/user/final/tools/ai-act-explorer/EU AI Act June 2024.pdf` (Regulation (EU) 2024/1689). "Omnibus p." = page of `/home/user/final/tools/ai-act-explorer/Digital Omnibus July 2026.pdf` (Regulation (EU) 2026/1744). Current law = the 2024 text as changed by the Omnibus.
- Verdicts on exceptions: **SAFE** (the text clearly supports it), **CONDITIONAL** (works only if stated conditions are met and documented), **FALSE** (a regulator or court would likely reject it).
- What the Omnibus changed in my scope, checked point by point **[text]**: Art. 4 replaced (Omnibus p.16); Art. 50(7) replaced, Art. 50(1)–(6) untouched (p.22); Art. 70(8) (p.26); Art. 75(1) replaced, 75(1a)–(1e), (2a) added, Arts. 75a–75d inserted (pp.26–32); Art. 77(1) replaced, (1a), (1b) added (p.33); Art. 99(1) replaced, 99(4)(da) and 99(6a) inserted (p.35); Art. 111(4) added (p.35); Art. 113 dates (p.35). **Art. 99(6) (SME cap) was NOT amended**; the brief listed it as amended, but only (1), (4)(da) and (6a) changed.

---

## 1. Art. 50(1): chatbots, voice agents and other AI that talks to guests

### Takeaway
The legal duty to make an AI system announce itself sits on the **provider** (the maker), not on the hotel that deploys a vendor's bot; the hotel carries the duty itself only where it is the provider (built or commissioned the system and runs it under its own name). The "it is obvious" exception is real in the text but the Commission reads it narrowly, and consumer law applies whether or not it is met.

### Cited Findings

**The rule**
- [text] "Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system, unless this is obvious from the point of view of a natural person who is reasonably well-informed, observant and circumspect, taking into account the circumstances and the context of use." Only other exception: systems authorised by law for criminal-offence detection — [Art. 50(1), Act p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- [text] Timing and form: information "in a clear and distinguishable manner at the latest at the time of the first interaction or exposure", conforming to accessibility requirements — [Art. 50(5), Act p.83](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=83)
- [text] Vulnerable groups (age, disability) must be taken into account where the system is intended to interact with them too — [Recital 132, Act p.33](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=33)
- [text] Art. 50 is "without prejudice to other transparency obligations laid down in Union or national law for deployers"; complying with Art. 50 does not make the use lawful under other law — [Art. 50(6), Act p.83](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=83); [Recital 137, Act p.35](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=35)
- [text] No deployer duty appears anywhere in Art. 50(1). Art. 26 (deployer duties) covers high-risk systems only — [Art. 50, Act p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- [text] Provider = whoever "develops an AI system … or has an AI system … developed and places it on the market or puts the AI system into service under its own name or trademark". "Putting into service" includes supply "for own use" — [Art. 3(3), 3(11), Act pp.46–47](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=46)
- [text] Application date: Art. 50 applies from 2 August 2026 (general date, not moved by the Omnibus) — [Art. 113, Act p.123](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=123); [Omnibus Art. 113 changes, p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [text] Older systems: the "already on the market" grace rule in Art. 111(2) is limited to high-risk systems; nothing in Art. 111 exempts older chatbots from Art. 50(1) — [Art. 111, Act p.121](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=121); [Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)

**What the Commission guidelines add (non-binding)**
- [team data] A company that builds an interactive system in-house and uses it under its own name is the provider; the deployer is whoever decides to deploy and how it is used, technical control not needed, including in group structures (guidelines paras 11, 12, 14) — [ai-act-data.json, transparencyGuidelines t1](../../tools/ai-act-explorer/ai-act-data.json)
- [secondary] A deployer that only places a supplier's chatbot on its site does not carry the Art. 50(1) duty itself, "but its configuration must not remove the disclosure" (commentary citing guidelines points 11–12) — [praxikon.com](https://www.praxikon.com/en/ai-act/artikel/50); [hlc.com](https://www.hlc.com/en/publications/the-ai-acts-transparency-obligations-in-light-of-the-eu-commissions-final-version-of-the-guidelines)
- [team data] Staff using AI assistance to communicate is "indirect interaction", outside Art. 50(1); blended services need disclosure for AI outputs "unless these are properly reviewed and sent by humans as the main interlocutors" (para 30(iii)) — [ai-act-data.json t2](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] AI agents that make bookings, manage correspondence or conclude contracts must disclose that they are AI and on whose behalf they act (para 31) — [ai-act-data.json t3](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] How: first-turn text disclosure; spoken statement at the start of calls with reminders in longer interactions; persistent labels; tones alone insufficient; terms and conditions, URLs or documentation alone insufficient (paras 34–38) — [ai-act-data.json t4](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] Obvious-interaction exception "interpreted restrictively": covers internal assistants for trained, AI-literate staff; does not cover customer or helpdesk chatbots, realistic avatars or human-like voices (para 45) — [ai-act-data.json t5](../../tools/ai-act-explorer/ai-act-data.json)
- [secondary] Where the system can be accessed by the general public or consumers including vulnerable persons, the exception cannot be relied on for those users — [natlawreview.com](https://natlawreview.com/article/eu-ai-act-final-guidelines-transparency-obligations-under-article-50)
- [team data] Outside Art. 50(1): recommenders, spam filters, translation and transcription tools, search without content generation, authentication and biometric recognition, product visualisation incl. room staging. In scope: interacting (humanoid) robots and cobots — [ai-act-data.json t6](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] Consumer law (Unfair Commercial Practices Directive, Consumer Rights Directive) applies "regardless of whether the AI interaction is obvious" (para 50) — [ai-act-data.json t7](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] Art. 50 applies to all in-scope systems whatever their launch date (paras 153–154) — [ai-act-data.json t11](../../tools/ai-act-explorer/ai-act-data.json)

### Inferences (hotel cases and verdicts; all [my inference] built on the findings above)

| Hotel case | In scope of 50(1)? | Who owes the notice | What the hotel should do | Exception relied on and verdict |
|---|---|---|---|---|
| Vendor website chatbot | Yes | Vendor (provider) | Check the notice is on, in the first message, in the guest's language; do not switch it off or bury it; keep the vendor's written confirmation | "Everyone knows a web chat is a bot": **FALSE** under the guidelines (para 45); arguable in court, but not worth the risk |
| WhatsApp / messaging bot | Yes | Vendor; the hotel if it built the flow itself on an API | Notice in the first message of each conversation, not only in the profile name or business description | "The profile says virtual assistant": **CONDITIONAL**; a profile line is closer to "documentation" than to a first-turn notice |
| Phone reservation agent (voice AI) | Yes | Vendor; hotel if built in-house | Spoken statement at call start; repeat in long calls and after hand-backs from a human | "A beep or tone signals it": **FALSE** (guidelines para 34–38). "Human-like voice is obviously AI": **FALSE** |
| In-room voice assistant (smart speaker) | Yes | Device/skill provider | In-room card plus first-use spoken notice | "A speaker with a wake word is obviously a machine": **CONDITIONAL**. Strong on the text of 50(1) (context of use), but the guidelines exclude "human-like voices" from the exception |
| Restaurant ordering kiosk | Touch menu with recommendations: no (recommender). Conversational voice/chat ordering: yes | Kiosk provider | Label on screen at start | "A kiosk is obviously a machine": **CONDITIONAL**; obvious that it is a machine, less obvious that it is AI rather than a scripted menu. Cheap to label |
| Service or delivery robot | Yes if it converses (guidelines list interacting robots in scope) | Robot provider | Sticker or screen label; spoken notice if it talks | "It is visibly a robot": **CONDITIONAL**; the best case for the exception on the text (recital 132 is about impersonation), untested |
| AI-drafted email a human reads, edits and sends | No (indirect interaction) | Nobody | Keep the review real; rule that staff read before sending | **SAFE** if a human genuinely reviews and sends. **FALSE** if the "human" is a signature block on an auto-sent reply ("Maria, Reservations") |
| AI auto-replies to guest reviews | Unclear: public, asynchronous text. Not clearly "direct interaction"; not "public interest" text unless it makes health, safety or sustainability claims | Tool provider for 50(1)/(2); hotel for 50(4) text if in scope | Human approves each reply, or label replies as AI-assisted | "A human approved it": **CONDITIONAL** (must be real review). Fully automatic posting under a manager's name: grey under the AI Act, risky under consumer law |
| AI booking agent acting for the hotel (calls or emails suppliers, guests) | Yes | Provider of the agent; hotel if built in-house | Agent states it is AI and that it acts for Hotel X | No exception |
| Internal staff assistant (e.g. policy Q&A bot) | Yes, but obvious-exception fits | n/a | Train staff (Art. 4) | **SAFE** for trained staff (guidelines para 45) |

- [my inference] "We are only the deployer" is a **CONDITIONAL** defence. It holds under the AI Act text for an unmodified vendor bot. It fails when (a) the hotel group built the bot or had it built and put it into service under its own name (Art. 3(3)), (b) the hotel disables or hides the vendor's notice and the regulator treats the reconfigured system as the hotel's own, or (c) the complaint is brought under consumer law instead.
- [my inference] White-label bots ("Sophie, your Hotel X concierge") are a grey area. Art. 25(1)(a) (putting your name on a system makes you provider) applies to high-risk systems only. For a non-high-risk chatbot the only route is Art. 3(3): did the hotel "have the system developed" and put it into service under its own name? A configured standard product points to the vendor staying provider; a bespoke build points to the hotel.
- [my inference] Art. 99(4)(g) fines "transparency obligations for providers and deployers pursuant to Article 50". Because a deployer has no obligation under 50(1), a fine on a pure deployer for a missing chatbot notice has no clear legal basis. This is a real gap in the text, not a safe harbour: the same facts are a misleading omission under consumer law.

### Gaps
- I could not read the guidelines themselves. All paragraph numbers come from team data; verify them against the formally adopted version (see section 4 on the document reference conflict).
- Whether the guidelines say anything on in-room smart speakers, kiosks, review replies or white-label branding is unknown.
- No court or authority decision on the "obvious" exception exists that I could find.

---

## 2. Art. 50(2) marking and Art. 50(4) deep fakes and public-interest text

### Takeaway
Machine-readable marking is a provider duty; visible labelling of deep fakes and of unreviewed AI text on matters of public interest is a deployer duty that falls directly on the hotel. A deep fake is defined by resemblance to real people, places or objects plus false authenticity, so realistic AI pictures of the actual property, cloned staff voices, staff avatars and lip-synced translated videos are all caught; consent does not remove the label, and a label does not cure misleading advertising.

### Cited Findings

**Art. 50(2): marking (provider)**
- [text] "Providers of AI systems, including general-purpose AI systems, generating synthetic audio, image, video or text content, shall ensure that the outputs of the AI system are marked in a machine-readable format and detectable as artificially generated or manipulated", as far as technically feasible. Exceptions: "to the extent the AI systems perform an assistive function for standard editing or do not substantially alter the input data provided by the deployer or the semantics thereof", or law-enforcement authorisation — [Art. 50(2), Act p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- [text] Marking can be implemented at model level, "thereby facilitating fulfilment of this obligation by the downstream provider of the AI system"; exception aimed at systems "performing primarily an assistive function for standard editing" — [Recital 133, Act p.34](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=34)
- [text] Transition: "Providers of AI systems … generating synthetic audio, image, video or text content, that have been placed on the market before 2 August 2026 shall take the necessary steps in order to comply with Article 50(2) by 2 December 2026" — [Art. 111(4), Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35); reason: four months "for providers who have already placed their systems on the market" — [Omnibus recital 38, p.12](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=12)
- [team data] A chain that builds its own guest assistant on an LLM API (scenario P1) or fine-tunes an open model for marketing copy (P5) owes Art. 50(2) marking as provider — [ai-act-data.json scenarios P1, P5](../../tools/ai-act-explorer/ai-act-data.json)

**Art. 50(4): deep fakes and public-interest text (deployer)**
- [text] "Deployers of an AI system that generates or manipulates image, audio or video content constituting a deep fake, shall disclose that the content has been artificially generated or manipulated." For "evidently artistic, creative, satirical, fictional or analogous work or programme" the duty is "limited to disclosure of the existence of such generated or manipulated content in an appropriate manner that does not hamper the display or enjoyment of the work" — [Art. 50(4) first subparagraph, Act p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- [text] Deep fake = "AI-generated or manipulated image, audio or video content that resembles existing persons, objects, places, entities or events and would falsely appear to a person to be authentic or truthful" — [Art. 3(60), Act p.50](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=50)
- [text] Text: deployers of a system generating or manipulating "text which is published with the purpose of informing the public on matters of public interest shall disclose that the text has been artificially generated or manipulated", except "where the AI-generated content has undergone a process of human review or editorial control and where a natural or legal person holds editorial responsibility for the publication" — [Art. 50(4) second subparagraph, Act p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- [text] Deployer = anyone "using an AI system under its authority" except personal non-professional use — [Art. 3(4), Act p.46](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=46)
- [team data] A company that commissions an advertising agency without deciding how it uses AI is not the deployer (guidelines para 14) — [ai-act-data.json t1](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] An AI product image "that misleads as to the product's actual appearance, characteristics or use is a deep fake"; a real product on an AI background is not, if not misleading; colour correction, background extension, removing passers-by are not deep fakes (para 116; examples p.36 of the guidelines) — [ai-act-data.json t9](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] Ad copy and product descriptions are outside the text duty "except claims related to health, consumer safety or sustainability"; corporate reports on a listed company's website are in scope. The exception needs substantive human review including fact-checking and a person holding editorial responsibility; spell-checks, policies or cursory approval do not qualify; AI changes after sign-off void it (paras 131, 133–136) — [ai-act-data.json t10](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] Content generated before 2 Aug 2026 need not be labelled retroactively, but older public-interest text published after that date must be (paras 153–154, fn 50) — [ai-act-data.json t11](../../tools/ai-act-explorer/ai-act-data.json)
- [secondary] Internal corporate communications are not "published" and fall outside the text duty; the deployer's duty is a perceptible disclosure to a person and "cannot be met by pointing to the provider's machine-readable mark" — [zartis.com](https://www.zartis.com/you-are-a-deployer-the-ai-act-transparency-rules-for-your-own-content)
- [secondary] German commentary treats Art. 50 as a probable "market conduct rule" under § 3a UWG, so competitors and associations could send warning letters and sue for injunctions over missing labels; no court ruling yet — [heuking.de, 14 Jul 2026](https://www.heuking.de/de/news-events/newsletter-fachbeitraege/artikel/wer-kennzeichnen-muss-und-welche-risiken-drohen.html); [ZAW Handreichung, 20 Jul 2026](https://zaw.de/app/uploads/2026/07/Handreichung_KI-VO_Stand_20Juli2026.pdf)

### Inferences (hotel cases and verdicts; all [my inference])

| Hotel content | Deep fake / in scope? | Duty | Exception and verdict |
|---|---|---|---|
| AI-generated or AI-enhanced photo of the hotel's own rooms, view, pool | Yes if it shows the real place differently from reality | Hotel labels visibly at first exposure | "Standard editing" (colour, crop, remove passers-by): **SAFE**. Adding a sea view, larger room, empty beach: **FALSE**, and misleading advertising even when labelled |
| AI food photos on menus, delivery apps, room-service tablets | Likely yes when presented as the dish actually served and it looks different; generic illustration is greyer ("resembles existing objects") | Label ("AI-generated image", "serving suggestion" is not an AI label) | "It is only illustrative": **CONDITIONAL**; depends on whether a guest would take it for a photo of the real dish |
| Virtual tour built from real scans/photos | No (not AI-generated content) unless AI fills in or alters spaces | None | **SAFE** if faithful |
| AI rendering of a renovation not yet built | Resembles the existing hotel and can appear authentic | Label as rendering / AI-generated | "Artist's impression" tradition helps; label anyway: **CONDITIONAL** |
| Avatar of a real staff member (e.g. GM welcome video) | Yes (existing person, appears authentic) | Label; plus Art. 50(1) notice if interactive | "The employee consented": **FALSE** as a labelling exception (consent matters for GDPR and image rights, not for Art. 50(4)) |
| AI voice cloned from an employee for phone menus or announcements | Yes (audio deep fake) | Disclose; Art. 50(1) notice for interactive use | Same: consent is not an exception |
| Translated / lip-synced video of a real person | Yes: manipulated video making a real person appear to say words in a language they did not speak | Label ("AI-translated voice") | "Meaning is unchanged, so it does not substantially alter": that phrase belongs to the provider's marking exception in 50(2), not to the deployer's 50(4) duty: **FALSE** |
| Fully synthetic avatar or voice resembling no real person | Not a deep fake | No 50(4) label; 50(1) notice if it interacts; provider marks output | **SAFE** on 50(4), provided it cannot be mistaken for a real employee |
| Obviously fantastical campaign image (hotel in the clouds) | Not a deep fake (would not falsely appear authentic) | None | **SAFE** |
| Realistic marketing image defended as "creative work" | Deep fake | Label | "Artistic/creative exception": **FALSE** as an escape. The exception only softens how to disclose for evidently artistic or fictional works; advertising a real property is not one |
| AI-written sustainability claims, ESG report, press statement on a safety incident | In scope as public-interest text (guidelines) | Label, unless reviewed | "Human review and editorial responsibility": **CONDITIONAL**; needs a named person, real fact-checking and a record; later AI edits reopen the duty |
| AI-written allergen or food-safety information published to guests | Plausibly "consumer safety" text per the guidelines | Label or human review | **CONDITIONAL**; the bigger exposure is food-information law, which requires accuracy regardless of labels |
| Ordinary AI-written room descriptions, offers, newsletters | Outside 50(4) text duty | None under the AI Act | **SAFE** (guidelines para 131), consumer law still applies |
| Images made by an agency that decides its own AI use | Agency is deployer | Agency labels | "The agency did it": **CONDITIONAL**; fails if the hotel briefs the agency to use AI or approves the AI workflow, and the hotel still publishes misleading content under consumer law |

- [my inference] Art. 111(4) says "placed on the market". A hotel group's in-house generative system is "put into service" for own use, never "placed on the market". Read literally, the 2 December 2026 transition does not cover it, so its Art. 50(2) duty started on 2 August 2026. Grey area; I found nothing addressing it.
- [my inference] The Act puts no duty on a deployer to keep the provider's watermark or metadata. Resizing, screenshots or uploading to booking platforms and social media can strip it. This is a real gap for 50(2); it does not affect the hotel's separate visible-label duty under 50(4).
- [my inference] Whether machine translation of text falls under the 50(2) exception ("do not substantially alter … the semantics") is plausible but unconfirmed.
- [my inference] In Germany and Austria the first realistic "enforcer" for unlabelled AI images is a competitor or trade association using unfair-competition law, not the market surveillance authority.

### Gaps
- No source seen on how the guidelines treat voice clones, dubbing, avatars or food imagery specifically; the verdicts above rest on the Art. 3(60) definition.
- Unknown whether "resembles existing objects" covers a generic AI dish or room that copies no specific real one.
- No decided case on Art. 50(4) anywhere in the EU that I could find.

---

## 3. Art. 50(3): emotion recognition and biometric categorisation notices

### Takeaway
Any hotel that deploys a tool inferring emotions or sorting people into categories from face, voice or body must tell the people exposed, from 2 August 2026, whatever the tool's risk tier. For staff the notice is irrelevant because the use itself is banned; analysing the text of reviews is not covered at all.

### Cited Findings
- [text] "Deployers of an emotion recognition system or a biometric categorisation system shall inform the natural persons exposed thereto of the operation of the system, and shall process the personal data in accordance with" the GDPR. Only exception: systems permitted by law for criminal-offence detection — [Art. 50(3), Act p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- [text] Emotion recognition system = AI "for the purpose of identifying or inferring emotions or intentions of natural persons on the basis of their biometric data". Biometric categorisation = assigning persons to categories on the basis of biometric data "unless it is ancillary to another commercial service and strictly necessary for objective technical reasons" — [Art. 3(39), 3(40), Act p.48](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=48)
- [text] Categories can include "sex, age, hair colour, eye colour, tattoos, personal traits, ethnic origin, personal preferences and interests"; notices in accessible formats — [Recital 132, Act p.33](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=33)
- [text] Inferring emotions "in the areas of workplace and education institutions" is prohibited, except for medical or safety reasons — [Art. 5(1)(f), Act p.51](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=51)
- [team data] Deployers must inform all persons exposed, including children, at the latest at first exposure, e.g. notices at entrances or onboarding messages (guidelines paras 105–108) — [ai-act-data.json t8](../../tools/ai-act-explorer/ai-act-data.json)

### Inferences
- [my inference] Hotel cases. Call-centre voice analytics scoring **callers'** mood: notice at call start (plus high-risk duties from 2 Dec 2027). The same tool scoring **agents'** mood: prohibited, a notice does not save it. Lobby or restaurant cameras estimating guest mood, age or gender for marketing: notice at the entrance, and a GDPR legal basis that will be hard to find. Age estimation at a self-service bar or minibar kiosk: biometric categorisation by age, so notice required.
- [my inference] "It is ancillary to another service" (Art. 3(40)): **CONDITIONAL** and narrow; it needs strict technical necessity. A marketing or analytics purpose does not qualify.
- [my inference] "We only analyse text" (review sentiment, chat tone): **SAFE**; both definitions require biometric data. "We only analyse the voice": **FALSE**; voice is biometric data.
- [my inference] A notice under 50(3) is not GDPR consent and not a legal basis.

### Gaps
- Whether age estimation counts as high-risk biometric categorisation (Annex III) is outside my scope; see the team's draft classification guideline notes.

---

## 4. The Commission transparency guidelines and the Code of Practice: what they say and what they leave open

### Takeaway
Both instruments exist in final form and both are non-binding: the guidelines were published on 20 July 2026 and the Code of Practice on 10 June 2026 (assessed as adequate on 9 July 2026). Authorities will follow them, but only the Court of Justice can settle the open points, and the team's citation of the guidelines conflicts with what web sources report.

### Cited Findings
- [secondary] The Commission approved the content of the guidelines on 20 July 2026 by Communication C(2026) 5054 final, stating they "would be formally adopted at a later date, when all language versions are available" — [Commission library page](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems); [stephensonharwood.com](https://www.stephensonharwood.com/post/102nfqh/eu-ai-act-update-european-commission-adopts-guidelines-on-article-50-transparency-obligations/)
- [secondary, weak] Official Journal publication reported as C/2026/6005 (CELEX 52026XC06005), dated 12 November 2026 by one unusual source — [casrai.org](https://casrai.org/news/eu-ai-act-article50-transparency-guidelines-2026); [ppc.land](https://ppc.land/non-eu-advertisers-face-3-eu-fines-for-unlabelled-ai-deep-fake-ads/)
- [team data] The team cites the guidelines as "C(2026) 7702 final", adopted 5 November 2026, with a local PDF outside this repository — [ai-act-data.json transparencyGuidelines](../../tools/ai-act-explorer/ai-act-data.json); booklet reference 2. My search found no source for "C(2026) 7702". **Conflict not resolved**: plausibly 20 July = content approval, 5 November = formal adoption, 12 November = OJ publication, but I could confirm none of the November facts.
- [team data] Status: "Not binding; only the CJEU gives the authoritative reading (para 5)" — [ai-act-data.json](../../tools/ai-act-explorer/ai-act-data.json)
- [text] Legal basis for the guidelines: Art. 96(1)(d) — [Act p.114](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=114)
- [text] Code of practice after the Omnibus: the Commission "shall assess whether adherence to those codes of practice is adequate to ensure compliance with the obligations laid down in paragraphs 2 and 4"; if inadequate it "may adopt an implementing act specifying common rules" — [Art. 50(7) as replaced, Omnibus p.22](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=22)
- [text] Codes under Art. 50(7) "have limited legal effect, and in particular do not grant a presumption of conformity" — [Omnibus recital 41, p.13](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=13)
- [secondary] Final Code of Practice on marking and labelling AI-generated content published 10 June 2026; voluntary; Section 1 for providers (marking, detection), Section 2 for deployers ("rules for labelling of deepfakes and AI-generated and manipulated text") — [Commission news](https://digital-strategy.ec.europa.eu/en/news/commission-publishes-code-practice-marking-and-labelling-ai-generated-content); [jonesday.com](https://www.jonesday.com/en/insights/2026/06/european-commission-publishes-final-code-of-practice-on-marking-and-labelling-aigenerated-content)
- [secondary] Provider side uses provenance credentials of the C2PA type plus imperceptible watermarking; deployer side gives guidance on how and where to show labels, "including through the use of the publicly available EU icon or equivalent labels" — [scl.org](https://www.scl.org/european-commission-publishes-code-of-practice-on-marking-and-labelling-ai-generated-content/)
- [secondary] Commission opinion of 9 July 2026: the Code is an adequate tool for Art. 50 marking and labelling; the assessment does not make it binding — [reedsmith.com](https://www.reedsmith.com/our-insights/blogs/viewpoints/102nbz0/transparency-obligations-for-ai-generated-content-the-code-of-practice-adequacy/); [faegredrinker.com](https://www.faegredrinker.com/en/insights/publications/2026/7/eu-ai-act-commission-confirms-transparency-code-of-practice-as-adequate-and-publishes-final-version-of-its-guidelines-on-transparency-obligations)
- [secondary] Signatories: initial list 31 July 2026, about 190 organisations per one source; the Commission page showed 95 Section 1 signatories at an unknown date — [Commission signing FAQ](https://digital-strategy.ec.europa.eu/en/faqs/signing-code-practice-transparency-ai-generated-content); [bratby.law](https://bratby.law/ai-transparency-code-of-practice-adequacy/)
- [secondary] The second draft removed the taxonomy separating "AI-generated" from "AI-assisted" content; I could not confirm whether the final text restored it — [scl.org second draft](https://www.scl.org/european-commission-publishes-second-draft-of-code-of-practice-on-marking-and-labelling-of-ai-generated-content/)
- [secondary] Authorities are "likely to ask non-signatories for more detailed information" (secondary report of a Commission statement) — [bratby.law](https://bratby.law/ai-transparency-code-of-practice-adequacy/)

### Inferences
- [my inference] For a hotel the Code matters in two ways: as a vendor question ("have you signed Section 1?") and as the practical template for its own labels (the EU icon). Signing Section 2 is optional and gives no presumption of conformity.
- [my inference] Left open by both instruments, as far as I can tell: the exact line between "edited photo" and "deep fake" for hospitality imagery; generic AI food images; review replies; white-label provider status; in-house systems and the Art. 111(4) transition; stripping of marks by platforms; whether translation is "assistive".

### Gaps
- Neither document was read. The team holds a local copy of the guidelines; it is not in this repository.
- Formal adoption date, document number and OJ reference of the guidelines need checking on EUR-Lex.
- Deployer-section details of the Code (label wording, placement rules for audio and video, SME reliefs) are unknown.

---

## 5. Art. 4 AI literacy after the Omnibus

### Takeaway
The duty survived the Omnibus as a softened duty of effort: every hotel that uses AI must "take measures to support" the AI literacy of staff and of others who operate AI on its behalf, with no level guaranteed for any individual. No EU-level fine attaches to it, Germany's national law reportedly sets none either, and its practical weight is as evidence in other proceedings.

### Cited Findings
- [text] Current wording: "Providers and deployers of AI systems shall take measures to support the development of AI literacy of their staff and other persons dealing with the operation and use of AI systems on their behalf, taking into account their technical knowledge, experience, education and training and the context the AI systems are to be used in, and considering the persons or groups of persons on whom the AI systems are to be used. This obligation does not require providers or deployers to guarantee any specific level of AI literacy of any individual." — [Art. 4(1), Omnibus p.16](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=16)
- [text] Old wording (2 Feb 2025 to 26 Jul 2026): "take measures to ensure, to their best extent, a sufficient level of AI literacy" — [Art. 4, Act p.51](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=51)
- [text] New paragraphs: Commission and Member States "shall support and facilitate" operators, "in particular SMEs", and the Commission publishes practical examples; the Board adopts recommendations with common objectives — [Art. 4(2)–(3), Omnibus p.16](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=16)
- [text] Why: stringent obligations "would not be suitable for all types of providers and deployers"; literacy "should be a strategic priority, regardless of regulatory obligations and potential sanctions" — [Omnibus recital 8, p.3](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=3)
- [text] Definition: "skills, knowledge and understanding that allow providers, deployers and affected persons … to make an informed deployment of AI systems, as well as to gain awareness about the opportunities and risks of AI and possible harm it can cause" — [Art. 3(56), Act p.49](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=49)
- [text] Applies since 2 February 2025 (Chapter I) — [Art. 113(a), Act p.123](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=123)
- [text] Art. 4 is not in the Art. 99(4) list of provisions carrying the EUR 15m / 3% fine — [Art. 99(4), Act p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115); [Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [text] Member States must lay down penalties and other enforcement measures "applicable to any infringement of this Regulation", which "may also include administrative fines, warnings and non-monetary measures" — [Art. 99(1) as replaced, Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [text] For operators supervised by the AI Office (not hotels), fines can cover "infringement of any applicable provision of this Regulation, including those not listed in Article 99(4)" — [Art. 75c(4)(a), Omnibus p.31](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=31)
- [text] Fine-setting criteria include "the degree of responsibility of the operator taking into account the technical and organisational measures implemented by it" — [Art. 99(7)(g), Act p.116](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=116)
- [secondary] Commission Q&A: supervision by national market surveillance authorities, not the AI Office; no certificate required; internal records of training or guidance suggested; "other persons" can include contractors, service providers and clients; private enforcement possible under national law where someone suffers harm — [hunton.com](https://www.hunton.com/privacy-and-cybersecurity-law-blog/european-commission-publishes-q-a-on-ai-literacy); [ropesgray.com](https://www.ropesgray.com/en/insights/viewpoints/102kbn5/five-takeaways-from-the-eu-commissions-ai-literacy-qas). These summaries date from 2025, before the Omnibus.
- [team data] The Commission's Q&A (version cited by the team: 20 Oct 2026) asks for four steps: basic understanding of AI, knowing whether you are maker or user, knowing the risks of your tools, training fitted to staff and tool; an internal record is enough — booklet section A2, [AI_Governance_for_European_Hotels.pdf](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf). One web source says the Q&A was updated in July 2026; I could not confirm an October version.
- [secondary] Germany: Art. 4 appears neither in Art. 99 nor in § 15 KI-MIG (the national fine catalogue, which reportedly covers Arts. 21, 27, 45 and 86 up to EUR 50,000); the Bundesnetzagentur can still request evidence of measures under its general powers (§ 11 KI-MIG); literacy can weigh in fines for other breaches — [ki-syndikat.de](https://www.ki-syndikat.de/blog/202609/ki-schulung-pflicht-kein-bussgeld-haftung/); [computerwoche.de](https://www.computerwoche.de/article/4021676/so-vermeiden-sie-ki-inkompetenz-im-unternehmen.html); [Bundesnetzagentur AI literacy page](https://www.bundesnetzagentur.de/DE/Fachthemen/Digitales/KI/7_Kompetenz/artikel.html?nn=686258)
- [secondary] An Irish regulator official suggested a literacy failure would more likely be an aggravating or mitigating factor than a standalone offence; the Commission's answer on penalties for past non-compliance was "unclear" — [ropesgray.com](https://www.ropesgray.com/en/insights/viewpoints/102kbn5/five-takeaways-from-the-eu-commissions-ai-literacy-qas)

### Inferences
- [my inference] Who owes it: every hotel entity that is a deployer or provider of any AI system, including minimal-risk tools such as revenue management or a staff chatbot. There is no SME exemption; SMEs only get more support (Art. 4(2)).
- [my inference] Contractors and agency staff: yes where they "deal with the operation and use of AI systems on [the hotel's] behalf", e.g. temp reception staff using the hotel's chatbot console, an outsourced reservations call centre, a marketing agency running the hotel's AI tools. The hotel can meet this by requiring the supplier to train its people and keeping proof. Guests are not covered.
- [my inference] Is it enforceable? As a duty of effort, yes in principle: doing nothing at all is still a breach, and an authority can ask what measures exist. As a fineable duty, largely no: not in Art. 99(4), reportedly not in the German catalogue, and I found no fine anywhere. "Art. 4 has no penalty" is therefore **CONDITIONAL**: true for EU-level fines; untrue as a general statement because national law may add measures (Art. 99(1) covers "any infringement"), because it colours every other fine (Art. 99(7)(g)), and because untrained staff are the usual cause of the breaches that are fined (prohibited uses, repurposing a chatbot for HR, unlabelled content).
- [my inference] "The Omnibus abolished the training duty": **FALSE**. The duty to take measures remains binding.
- [my inference] Evidence a hotel should keep: (1) list of AI tools and who uses them; (2) a short role-based training plan (front office, reservations, HR, marketing, F&B, management); (3) attendance or completion records, including for agency staff and outsourced teams; (4) the acceptable-use policy and signed acknowledgements; (5) materials used and dates; (6) vendor training or instructions for each tool; (7) a yearly review note. None of this is prescribed by the text; it is what answers an authority's request and supports Art. 99(7)(g).

### Gaps
- The current Commission Q&A text was not read; whether it was revised after the Omnibus, and how, is unconfirmed.
- No national law other than Germany's was checked for an Art. 4 sanction (Italy's Decree 179/2026 and Greece's Law 5321/2026 in particular).
- The Board recommendations under Art. 4(3) and the Commission's practical examples under Art. 4(2): existence and content unknown.

---

## 6. General-purpose AI (Arts. 51–56): do any duties reach a hotel?

### Takeaway
Chapter V binds the makers of models, not their users: a hotel using ChatGPT, Copilot or Gemini, or building a chatbot on an API, has no Chapter V duty. A hotel group would become a model provider only by modifying a model on a scale no hotel reaches; the realistic routes into provider status are building its own system and repurposing a general tool for a high-risk job.

### Cited Findings
- [text] Art. 53 duties (technical documentation, information for downstream system providers, copyright policy, training-content summary) are addressed to "providers of general-purpose AI models" — [Art. 53(1), Act p.84](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=84)
- [text] A model is not a system: "AI models require the addition of further components, such as for example a user interface, to become AI systems." Model duties "should in any case not apply when an own model is used for purely internal processes that are not essential for providing a product or a service to third parties and the rights of natural persons are not affected" — [Recital 97, Act p.26](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=26)
- [text] "In the case of a modification or fine-tuning of a model, the obligations for providers of general-purpose AI models should be limited to that modification or fine-tuning" — [Recital 109, Act p.28](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=28)
- [text] Downstream provider = provider of an AI system that integrates a model, whether its own or "provided by another entity based on contractual relations" — [Art. 3(68), Act p.50](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=50)
- [text] Model providers must give system builders information enabling them "to have a good understanding of the capabilities and limitations of the general-purpose AI model and to comply with their obligations" — [Art. 53(1)(b), Act p.84](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=84)
- [text] A deployer that modifies the intended purpose of a system, "including a general-purpose AI system", so that it becomes high-risk is treated as provider of a high-risk system — [Art. 25(1)(c), Act p.67](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=67)
- [text] Commission fines on model providers: up to 3% or EUR 15m — [Art. 101, Act p.117](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=117)
- [secondary] Commission guidelines on general-purpose AI models (July 2025): a downstream modifier becomes provider of the modified model where the modification compute exceeds one third of the original model's training compute; obligations then limited to the modification; critics note fine-tuning far below that threshold can still change a model materially, and the original compute is often unknown — [artificialintelligenceact.eu overview](https://artificialintelligenceact.eu/gpai-guidelines-overview/); [twobirds.com](https://cm.twobirds.com/en/insights/2025/taking-the-eu-ai-act-to-practice-how-the-final-gpai-guidelines-shape-the-ai-regulatory-landscape); [cdt.org](https://cdt.org/insights/eu-ai-act-brief-pt-5-general-purpose-ai-models/)
- [team data] Same threshold recorded as route E, with "few modifications currently meet it" — [ai-act-data.json providerSwitchRoutes E](../../tools/ai-act-explorer/ai-act-data.json)
- [text] AI Office exclusive competence covers systems "based on general-purpose AI models where the model and the system are developed by the same provider, or by providers forming part of the same undertaking" — [Art. 75(1)(a), Omnibus p.26](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=26)

### Inferences (all [my inference])

| Hotel situation | Role | Chapter V duties? | What does apply |
|---|---|---|---|
| Staff use ChatGPT, Copilot, Gemini as sold | Deployer of a general-purpose AI system | None | Art. 4; Art. 50(4) if publishing deep fakes or public-interest text; Art. 25(1)(c) if used for a high-risk purpose such as ranking applicants |
| Custom GPT / configured assistant with hotel prompts and documents | Deployer; arguably provider of a new system if it is put into service under the hotel's name for guests | None | Art. 50(1) if the hotel is provider. Grey: how much configuration makes a "new system" |
| Group builds a guest assistant on an LLM API | Provider of a system (downstream provider) | None | Art. 50(1), 50(2); entitled to Art. 53(1)(b) information from the model maker |
| Group fine-tunes an open model for brand voice | Provider of the system; model provider only above the one-third compute threshold | Practically none | Art. 50(2) |
| Group trains or heavily modifies a model and builds its own system on it | Model provider and system provider | Yes, limited to the modification | Would also move under the AI Office's exclusive competence (Art. 75(1)(a)); not realistic for hotels today |

- "We only use the API, so we are a mere user": **FALSE**. Building a system on an API and putting it into service under your own name makes you its provider.
- "Fine-tuning makes us a model provider with heavy duties": **FALSE** in practice, per the one-third threshold; but the threshold is guidance, not law.
- The systems hotels buy from the large model makers (ChatGPT, Copilot, Gemini) are supervised by the AI Office, not by national authorities. A hotel's complaint about a missing notice or missing marking in those products goes to the AI Office.

### Gaps
- The model guidelines and the Service Desk FAQ were not read; the one-third figure rests on secondary summaries and team data.
- No guidance found on when prompt-and-knowledge-base configuration turns a deployer into a provider of a new system.

---

## 7. Penalties (Art. 99 as amended) and national penalty laws

### Takeaway
A hotel's realistic maximum for a transparency breach is 3% of turnover or EUR 15m, with the **lower** figure applying to SMEs and small mid-caps, so an independent hotel's ceiling is a few hundred thousand euros, not millions. Fines need a national law and a designated authority: of the countries checked, Germany, Italy and Greece have them; France, Spain and Austria reportedly do not yet.

### Cited Findings

**EU tiers**
- [text] Prohibited practices (Art. 5): up to EUR 35m or 7% of worldwide annual turnover, whichever is higher — [Art. 99(3), Act p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- [text] EUR 15m or 3%, whichever is higher, for: provider duties (Art. 16), authorised representatives (22), importers (23), distributors (24), deployer duties for high-risk systems (26), notified bodies (31, 33, 34), "transparency obligations for providers and deployers pursuant to Article 50", and new point (da) "obligations of providers and operators pursuant to Article 25(2) and (4)" — [Art. 99(4), Act p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115); [Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [text] Incorrect, incomplete or misleading information to authorities: up to EUR 7.5m or 1% — [Art. 99(5), Act p.116](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=116)
- [text] SMEs including start-ups: each fine is up to the percentage or the amount in paragraphs 3, 4 and 5, "whichever thereof is lower" (unchanged by the Omnibus) — [Art. 99(6), Act p.116](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=116)
- [text] Small mid-caps: lower-of rule for paragraphs 4 and 5 only, not for prohibited practices — [Art. 99(6a), Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [text] SME = Recommendation 2003/361/EC; SMC = Recommendation (EU) 2025/1099 — [Art. 3(14a), (14b), Omnibus p.16](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=16)
- [text] Art. 99(1) now: penalties and other enforcement measures "which may also include administrative fines, warnings and non-monetary measures, applicable to any infringement of this Regulation by operators"; Member States "shall take into account the interests of SMEs, including start-ups, and SMCs, and their economic viability when imposing penalties". The 2024 text already said "may also include warnings and non-monetary measures" — [Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35); [Act p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- [text] Criteria for whether and how much to fine: nature, gravity, duration, number of affected persons and damage; fines already imposed by other authorities for the same infringement or under other law for the same conduct; size, turnover and market share; financial benefit; cooperation; technical and organisational measures; self-reporting; intent or negligence; mitigation — [Art. 99(7), Act p.116](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=116)
- [text] Member States decide whether public bodies can be fined; fines may be imposed by courts in some systems; procedural safeguards and judicial remedy required; annual reporting of fines to the Commission — [Art. 99(8)–(11), Act p.116](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=116)
- [text] Timing: Chapter XII (penalties) has applied since 2 August 2025, except Art. 101; Member States had to notify penalty rules "at the latest by the date of entry into application" — [Art. 113(b), Act p.123](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=123); [Art. 99(2), Act p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- [text] "Undertaking" is not defined in Art. 3, and no recital explains it; the recitals on penalties say only that upper limits are harmonised and ne bis in idem must be respected — [Recital 168, Act p.42](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=42) (full-text search of the Act for "undertaking")
- [team data] Under the GDPR the same word follows EU competition law and can cover a whole group; whether AI Act authorities will read it that way "has not been tested" — booklet section A4, [AI_Governance_for_European_Hotels.pdf](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf)
- [secondary] Several commentators assume group-level turnover by analogy with competition law and the GDPR — [activemind.legal](https://www.activemind.legal/legislation/ai-act/article-99/)

**Not fined under Art. 99(3)–(5) [text, by reading the list]**
- Art. 4 (AI literacy); Art. 27 (fundamental rights impact assessment); Art. 86 (right to explanation); Art. 6(4) documentation of a "not high-risk" self-assessment, except through Art. 16 for providers. For these, any sanction depends on national law under Art. 99(1) — [Art. 99(4), Act p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)

**National penalty laws and authorities, November 2026**

| Country | Authority for hotels' Art. 50 matters | National law and penalty rules | Status and tag |
|---|---|---|---|
| Germany | Bundesnetzagentur (market surveillance, single point of contact, complaints) | KI-MIG in force 29 Jul 2026. § 15 reportedly adds national fines up to EUR 50,000 for Arts. 21, 27, 45, 86; Art. 4 not included | In force. [team data] [ai-act-data.json nationalLayer](../../tools/ai-act-explorer/ai-act-data.json); [secondary] [hlc.com](https://www.hlc.com/en/publications/eu-ai-act-german-implementation-act-enters-into-force); [ki-syndikat.de](https://www.ki-syndikat.de/blog/202609/ki-schulung-pflicht-kein-bussgeld-haftung/). One source could not confirm promulgation: [casrai.org](https://casrai.org/guides/germany-ki-mig-ai-implementation-act) |
| France | Planned: DGCCRF with Arcom for Art. 50; CNIL for most Annex III; DGCCRF coordinator and single point of contact | DDADUE bill: Senate first reading 18 Feb 2026; still in committee at the Assemblée nationale in October 2026; no confirmed penalty scale | Not adopted. [team data] nationalLayer; [secondary] [ai-regulation.com](https://ai-regulation.com/eu-ai-act-implementation-france-still-without-designated-national-competent-authorities/); [banquedesterritoires.fr](https://www.banquedesterritoires.fr/le-senat-valide-une-regulation-de-lia-en-mode-puzzle) |
| Spain | AESIA (operational, notified) | Organic bill approved by the Council of Ministers May 2026, published in Congress 12 Jun 2026, with fines up to EUR 35m / 7% and warnings. The team records that it lapsed when the Cortes were dissolved on 6 Oct 2026 | No penalty law. [team data] nationalLayer (dissolution not confirmed by my search); [secondary] [linklaters.com](https://techinsights.linklaters.com/post/102mwzx/spain-approves-draft-ai-governance-law-what-you-need-to-know); [osborneclarke.com](https://www.osborneclarke.com/es/insights/espana-avanza-en-la-regulacion-de-la-ia-claves-de-la-nueva-ley-organica-de-gobernanza) |
| Italy | ACN (market surveillance, single point of contact); AgID (notifying authority); financial regulators for their sectors; Garante narrower role | Law 132/2025 in force 10 Oct 2025. Legislative Decree 179/2026 of 7 Oct 2026, in force 23 Oct 2026, sets powers and penalties (Arts. 20–21), including up to EUR 35m / 7% and non-monetary measures | In force. [secondary] [clearygottlieb.com](https://www.clearygottlieb.com/news-and-insights/publication-listing/italy-ai-regulation-new-rules-and-risks-for-businesses); [noze.it](https://www.noze.it/en/insights/ai-decree-179-2026-gazette/) |
| Austria | None designated; RTR's AI Service Desk (since 2024) is advisory | Implementing law still being drafted | Not in place. [secondary, thin] [knowlee.ai](https://www.knowlee.ai/at/blog/eu-ai-act-oesterreich-zustaendigkeit); [orf.at](https://orf.at/stories/3437724/); [RTR](https://www.rtr.at/rtr/service/ki-servicestelle/ai-act/AI_Act.en.html) |
| Greece | Hellenic Data Protection Authority for prohibited practices, Annex III systems and Art. 50; sectoral authorities for their products; EETT notifying authority | Law 5321/2026, Government Gazette A' 114, 20 Jul 2026: warnings, compliance orders, reprimands; Art. 23 creates a criminal offence (content not seen) | In force. [secondary] [ey.com](https://www.ey.com/en_gr/technical/tax/tax-alerts/ai-act-greek-legal-framework-for-the-supervision-of-artificial-intelligence-systems); [dpa.gr](https://www.dpa.gr/en/enimerwtiko/press-releases/hellenic-dpa-takes-leading-role-implementing-eu-ai-act-greece); [iapp.org](https://iapp.org/news/a/inside-greece-s-new-ai-act-framework) |
| Sweden | PTS under an interim mandate to 31 Dec 2026 | Supplementary act pending | Interim. [team data] nationalLayer |

- [secondary] EU-wide counts differ by method: 16 of 27 Member States missed the deadline, six with no market surveillance authority and ten provisional (one November 2026 article); five without an authority (MLex, October 2026); 9 designated / 12 partial / 6 unclear (June 2026 tracker) — [captaincompliance.com](https://captaincompliance.com/?p=15795); [mlex.com](https://www.mlex.com/mlex/articles/2535649); [artificialintelligenceact.eu national implementation plans](https://artificialintelligenceact.eu/es/national-implementation-plans)
- [secondary] Finland was reported as the first Member State with fully operational AI Act enforcement powers, from 1 January 2026 — [vorplabs.com](https://vorplabs.com/ai-regulatory-updates/eu-enforcement)
- [secondary] No source confirms that the Commission has opened infringement proceedings against late Member States — [ai-regulation.com](https://ai-regulation.com/designation-of-national-competent-authorities-under-the-eu-ai-act/)

### Inferences
- [my inference, arithmetic on Art. 99(4), (6), (6a)] Worked ceilings for an Art. 50 breach: independent hotel company, EUR 8m turnover, SME: lower of EUR 15m and 3% = **EUR 240,000**. Small mid-cap group, EUR 120m turnover: lower of the two = **EUR 3.6m**. Large group, EUR 5bn turnover: higher of the two = **EUR 150m**. These are ceilings; Art. 99(7) and the SME viability clause push real fines far lower.
- [my inference] SME status is assessed with linked and partner enterprises under Recommendation 2003/361/EC (my background knowledge of that recommendation, not checked in this session). A small hotel company owned by a large group or fund is unlikely to count as an SME. "Each hotel is its own small company" is therefore a **FALSE** loophole for owned hotels, and **CONDITIONAL** for genuinely independent franchisees.
- [my inference] Group turnover: because "undertaking" is undefined, an authority can argue the competition-law meaning (whole economic unit). Plan on group turnover; treat entity-only turnover as an argument for court.
- [my inference] Hotel in a country with no penalty law (France, Spain, Austria today): the duties bind directly, but no authority can lawfully fine under the AI Act until national law names it and sets the procedure. This is **not a safe harbour**: (a) continuing breaches can be sanctioned once the law arrives; (b) the same facts are reachable now by data protection and consumer authorities; (c) civil courts and competitors can act on a directly applicable regulation; (d) group-level contracts and brand standards apply regardless. Whether conduct that ended before the national law can be fined later is unsettled (the Commission's own answer on "historic non-compliance" was reported as unclear).
- [my inference] Double fining: Art. 99(7)(b)–(c) makes earlier fines for the same conduct a factor, not a bar. A hotel can be fined under the GDPR and the AI Act for the same camera or chatbot.

### Gaps
- No national act was read in the original. The German § 15 catalogue, the Italian penalty articles and the Greek sanctions rest on secondary summaries.
- SMC thresholds (Recommendation 2025/1099) were not verified in this session.
- Spain: I could not confirm the dissolution of the Cortes or the bill's lapse; this rests on team data.
- Commission guidelines on penalties under Art. 96 / 99(1): none found.

---

## 8. Enforcement: who can act against a hotel, and how likely it is

### Takeaway
For a hotel the AI Office is not the enforcer; national market surveillance authorities are, and most are still being set up. The realistic pressure in 2026–2028 comes from other channels that already work: data protection authorities, consumer and unfair-competition law, works councils, guest and staff complaints, and brand or owner contracts. I found no confirmed fine under the AI Act against anyone as of November 2026.

### Cited Findings
- [text] Each Member State designates at least one market surveillance authority and a single point of contact; contact details public by 2 August 2025 — [Art. 70(1)–(2), Act p.99](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=99)
- [text] Market surveillance runs under Regulation (EU) 2019/1020, with "economic operator" read as all AI Act operators, deployers included — [Art. 74(1), Act p.102](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=102)
- [text] Where a system presents a risk, the authority evaluates it and can require "all appropriate corrective actions", withdrawal or recall, within at most 15 working days — [Art. 79(1)–(2), Act p.106](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=106)
- [text] Complaints: "any natural or legal person having grounds to consider that there has been an infringement … may submit complaints to the relevant market surveillance authority"; they "shall be taken into account for the purpose of conducting market surveillance activities". The article gives no right to a decision or a deadline — [Art. 85, Act p.110](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=110)
- [text] Whistleblower protection: Directive (EU) 2019/1937 applies to reporting AI Act infringements — [Art. 87, Act p.110](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=110)
- [text] Collective consumer actions: the AI Act is added to Annex I of the Representative Actions Directive (EU) 2020/1828 — [Art. 110, Act p.121](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=121)
- [text] AI Office exclusive competence: systems built on a general-purpose model by the same provider or undertaking, and systems that are or are integrated into very large online platforms or search engines; it "shall apply to the providers of those systems. It shall apply to the deployers of those systems only when they are also the provider or form part of the same undertaking as the provider" — [Art. 75(1), Omnibus pp.26–27](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=26)
- [text] A national authority can ask the AI Office to assess such a system; reply within four months — [Art. 75(2a), Omnibus p.28](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=28)
- [text] The AI Office may act "on its own initiative or following a complaint received pursuant to Article 85" — [Art. 75a(2), Omnibus p.28](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=28)
- [text] Fundamental-rights authorities (equality bodies, data protection authorities where listed) can obtain AI Act documentation through the market surveillance authority, which may request it "from the provider or the deployer"; mutual assistance duty — [Art. 77(1), (1a), (1b), Omnibus p.33](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=33)
- [text] Workers' representatives: duty to inform them and affected workers before using a **high-risk** system at work (applies with the high-risk rules, 2 Dec 2027) — [Art. 26(7), Act p.68](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=68); [Art. 113(c) as replaced, Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
- [text] The GDPR is unaffected by the AI Act — [Art. 2(7) as replaced, Omnibus p.15](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=15)
- [team data] National labour law is the sharper constraint: German works councils co-determine monitoring-capable systems and can obtain injunctions; in France the staff committee must be consulted before new technology is introduced, and the Paris Court of Appeal (21 May 2026) held a pilot is not exempt; Spain's works councils have a right to algorithm information — [ai-act-data.json nationalLayer](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] Spain's data protection authority has said it can already act against prohibited AI involving personal data — [ai-act-data.json nationalLayer, Spain](../../tools/ai-act-explorer/ai-act-data.json)
- [secondary] Greece made its data protection authority the market surveillance authority for Art. 50 — [dpa.gr](https://www.dpa.gr/en/enimerwtiko/press-releases/hellenic-dpa-takes-leading-role-implementing-eu-ai-act-greece)

**Cases so far**
- [secondary] Careful trackers: every fine recorded so far was imposed under existing law, chiefly the GDPR; no named AI Act enforcement action had followed by 6 August 2026 — [vorplabs.com](https://vorplabs.com/ai-regulatory-updates/eu-enforcement)
- [secondary, single weak source] The Commission's Executive Vice-President said on 14 October 2026 that first enforcement steps had been taken, in the form of requests for information from the AI Office — [unite.ai](https://unite.ai/eu-announces-first-ai-act-enforcement-actions-after-ai-agent-incidents)
- [secondary, rejected] A newsletter claims three Commission AI Act decisions with EUR 18.4m in fines on 14 February 2026. This predates the Commission's fining powers and is uncorroborated; do not use — [praesum-ai](https://praesum-ai.pages.dev/en/insights/artikelen/week-09.html)
- [secondary] Adjacent, chatbots under the GDPR: Italy's Garante fined Luka Inc. (Replika) EUR 5m (decision 10 Apr 2025, announced 19 May 2025) for no legal basis, an inadequate privacy notice and no age verification — [edpb.europa.eu](https://www.edpb.europa.eu/news/national-news/2025/ai-italian-supervisory-authority-fines-company-behind-chatbot-replika_sv)
- [secondary, single source] Garante fined Character Technologies (Character.AI) EUR 158,000 on 3 July 2026 for child-safety and information failures — [oecd.ai incident record](https://oecd.ai/en/incidents/2026-07-09-06ea)
- [secondary] The Court of Rome annulled the Garante's EUR 15m fine on OpenAI on 18 March 2026 on jurisdiction grounds (one-stop-shop after OpenAI's Irish establishment), not on the merits — [advant-nctm.com](https://www.advant-nctm.com/en/news/why-did-the-court-of-rome-annul-the-data-protection-authoritys-order-on-openai); [wsgr.com](https://www.wsgr.com/en/insights/openai-prevails-in-landmark-italian-ai-and-gdpr-enforcement-case.html)
- [team data] Hospitality-adjacent data protection cases (Amazon France Logistique EUR 15m after appeal; Serco Leisure biometric clock-in order; Foodinho EUR 2.6m and EUR 5m; Spanish hotel camera fines of EUR 400–600; Hungarian hotel EUR 8,000) — booklet section A7, [AI_Governance_for_European_Hotels.pdf](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf)

### Inferences (all [my inference])
- Do the AI Office's powers reach hotels? Not as a hotel deploying vendor tools or building on a third-party model. Two edge cases: a group that develops both model and system; and a hotel company that belongs to the same undertaking as an AI provider. Indirectly, the AI Office supervises the big assistants hotels buy.
- Who can start trouble for a hotel, in rough order of likelihood 2026–2028:
  1. **Data protection authority** after a guest or staff complaint (cameras, biometrics, chatbot data, staff monitoring). Established, staffed, with a fining record in hospitality.
  2. **Works council or union** under national labour law, able to stop a rollout by injunction in Germany and France.
  3. **Competitors and trade or consumer associations** under unfair-competition law (Germany, Austria) for missing AI labels; consumer associations by representative action (Art. 110).
  4. **Consumer authority** for misleading AI imagery or a bot posing as a person.
  5. **Market surveillance authority** acting on an Art. 85 complaint: possible in Germany, Italy, Greece now; more likely to start with information requests and corrective orders than fines.
  6. **Staff whistleblowers** (Art. 87) feeding any of the above.
- Realistic risk view: low probability of an AI Act fine against a hotel before 2028; moderate probability of an information request or corrective order after a complaint in countries with working authorities; meaningful and already present risk through the GDPR, labour law and consumer law for the same facts. The high-impact tail is a prohibited practice (emotion recognition on staff), where the 7% tier and public attention combine.
- "Nobody is enforcing yet": **FALSE** as a planning basis. The duty has applied since 2 August 2026; missing national machinery delays the fine, not the breach, and the other channels are live.
- Art. 85 gives complainants no right to a decision. A guest cannot force the authority to act, which makes representative actions and data protection complaints the stronger tools.

### Gaps
- No confirmed AI Act decision, fine, court ruling or published complaint against any hotel or any deployer was found. Absence in my searches is not proof of absence.
- The Commission's list of market surveillance authorities (updated 9 Nov 2026 per team data) could not be opened.
- Staffing and stated priorities of the Bundesnetzagentur, ACN and the Hellenic authority for 2027 are unknown.

---

## 9. Gaps in the system: duties with no fine, no authority, or no national law

### Takeaway
The AI Act has four structural gaps relevant to hotels: the chatbot notice binds only providers, AI literacy has no EU fine, several countries have no authority or penalty law yet, and complainants have no right to a decision. Each is narrower than it looks because other laws cover the same conduct.

### Cited Findings
- [text] Deployers have no obligation under Art. 50(1); the fine provision refers to obligations "for providers and deployers pursuant to Article 50" — [Act pp.82, 115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
- [text] Art. 4, Art. 27 and Art. 86 are absent from Art. 99(4) — [Act p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115)
- [text] Art. 86 (right to explanation) covers only decisions based on Annex III high-risk systems and applies "only to the extent that the right … is not otherwise provided for under Union law" — [Art. 86, Act p.110](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=110)
- [text] No Art. 50 duty for natural persons using AI in "a purely personal non-professional activity" — [Art. 2(10), Act p.46](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=46)
- [secondary] Authority and penalty-law status by country: see section 7 table.

### Inferences (consolidated list of exceptions and grey areas; all verdicts [my inference])

| # | Claimed exception or gap | Provision | Verdict |
|---|---|---|---|
| 1 | "The vendor owes the chatbot notice, not us" | Art. 50(1) | CONDITIONAL: true for unmodified vendor bots; false once the hotel is provider or hides the notice; consumer law applies anyway |
| 2 | "It is obvious it is a bot" | Art. 50(1) | FALSE for guest-facing chat and voice per the guidelines; SAFE for internal tools used by trained staff; open for robots and kiosks |
| 3 | "A human sends the AI-drafted message" | Guidelines para 30(iii) | SAFE with genuine review; FALSE for auto-send under a human name |
| 4 | "Our tool only edits" (assistive / standard editing) | Art. 50(2) | SAFE for retouching, grammar, cropping; FALSE for generated scenes; it is a provider exception, not a deployer one |
| 5 | "Legacy system, we have until 2 Dec 2026" | Art. 111(4) | CONDITIONAL: only Art. 50(2) marking, only systems "placed on the market" before 2 Aug 2026; chatbots' 50(1) notice and deep-fake labels have no transition; in-house systems arguably not covered at all |
| 6 | "Not a deep fake, it is our real hotel, just improved" | Art. 3(60) | FALSE if a guest would take it as authentic and it differs from reality |
| 7 | "The employee agreed to the avatar / voice clone" | Art. 50(4) | FALSE as a labelling exception |
| 8 | "It is creative advertising" | Art. 50(4) | FALSE as an escape; the exception only changes how to disclose for evidently artistic or fictional works |
| 9 | "A human reviewed the AI text" | Art. 50(4) second subparagraph | CONDITIONAL: substantive review, fact-check, named responsible person, record; no later AI edits |
| 10 | "Marketing copy is not public interest" | Art. 50(4); guidelines para 131 | SAFE for ordinary copy; FALSE for health, consumer-safety and sustainability claims per the guidelines |
| 11 | "The agency made it" | Guidelines para 14 | CONDITIONAL: only if the agency decides its own AI use |
| 12 | "Text sentiment is not emotion recognition" | Art. 3(39) | SAFE; voice or face analysis is not |
| 13 | "AI literacy carries no fine" | Art. 99(4) | CONDITIONAL: no EU-tier fine; still a binding duty, an aggravating factor and open to national measures |
| 14 | "We use a general-purpose model, so the model maker is responsible" | Arts. 53, 25(1)(c), 50 | FALSE for the hotel's own duties as deployer or system provider |
| 15 | "Each hotel entity is an SME" | Art. 99(6); Art. 3(14a) | CONDITIONAL for independents; FALSE for group-owned entities; "undertaking" may be read as the group |
| 16 | "No national penalty law, so no risk" | Art. 99(1) | FALSE as a planning basis; true only for AI Act fines today |
| 17 | "We are Swiss/UK, the Act does not apply" | Art. 2(1)(c) | CONDITIONAL: see section 10 |
| 18 | "The complaint will go nowhere" | Art. 85 | CONDITIONAL: no right to a decision under the AI Act, but representative actions, data protection complaints and competitor suits do not depend on it |

### Gaps
- None of these verdicts has been tested before a court or authority.

---

## 10. Switzerland and the United Kingdom: what differs

### Takeaway
Neither country has an AI Act equivalent or an AI labelling duty today, but a Swiss or UK hotel is pulled into the EU rules when its AI output is used in the EU, and local data protection and consumer law already cover the same conduct.

### Cited Findings
- [text] The Act applies to "providers and deployers of AI systems that have their place of establishment or are located in a third country, where the output produced by the AI system is used in the Union" — [Art. 2(1)(c), Act p.45](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=45)
- [team data] Switzerland: no AI act; consultation on a draft scheduled for spring 2027 (Federal Council, 28 Oct 2026); Data Protection Act art. 21 requires informing a person of a solely automated decision with significant effects and allows human review; OFCOM published a voluntary AI code-of-conduct guide on 26 Oct 2026 — [ai-act-data.json nationalLayer, Switzerland](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] Swiss data protection fines fall on the responsible individual, up to CHF 250,000 for listed wilful breaches — booklet section A7, [AI_Governance_for_European_Hotels.pdf](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf)
- [team data] UK: no AI statute; the Data (Use and Access) Act 2025 allows solely automated significant decisions with safeguards from 5 Feb 2026; the ICO leads through data protection law — [ai-act-data.json nationalLayer, UK](../../tools/ai-act-explorer/ai-act-data.json)
- [team data] UK consumer law: the competition regulator can fine up to GBP 300,000 or 10% of global turnover — booklet (UK section), [AI_Governance_for_European_Hotels.pdf](../../docs/d7-governance/AI_Governance_for_European_Hotels.pdf)

### Inferences
- [my inference] A Zermatt or London hotel whose booking chatbot answers a guest sitting in Paris, or whose AI images are shown to EU consumers, arguably has "output used in the Union". Whether marketing merely accessible from the EU is enough is a grey area with no guidance found. A group with EU properties should apply one standard everywhere.
- [my inference] For purely domestic use there is no Art. 50-style duty in either country today; a bot posing as a human or a misleading AI image is handled by unfair-competition and consumer law. AI literacy has no Swiss or UK equivalent.
- [my inference] No EU national authority has an obvious practical way to fine a Swiss or UK hotel company with no EU establishment; the exposure is commercial (EU distribution partners, brands) more than regulatory.

### Gaps
- No Swiss or UK primary source was read in this session; all country facts are team data.

---

## 11. Where the team's material looks wrong, incomplete or over-confident

### Takeaway
The team's reading of the regulation is accurate on the main points I checked. I found one factual error in the revision list, one unresolved citation conflict, several omissions (Code of Practice, collective actions, whistleblowing, competitor suits, three countries) and a few statements that present Commission guidance as settled law.

### Cited Findings
1. **Revision list error on Art. 99(1).** `OMNIBUS-REVISION-LIST.md` (section 1.5) and `ai-act-data.json` (`penalties.omnibusCorrection`) present "warnings and non-monetary measures" as an Omnibus addition. [text] The 2024 text already read "which may also include warnings and non-monetary measures". What the Omnibus changed: it added "administrative fines" to that list, widened "infringements" to "any infringement", added SMCs, and turned the SME clause into a duty on Member States "when imposing penalties" — [Act p.115](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=115); [Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35); [OMNIBUS-REVISION-LIST.md](../../docs/d7-governance/OMNIBUS-REVISION-LIST.md)
2. **Guidelines citation conflict.** Team: "C(2026) 7702 final", adopted 5 Nov 2026, status "Final". [secondary] Web sources: content approved and published 20 July 2026 under C(2026) 5054 final, formal adoption deferred; OJ reference C/2026/6005 reported for 12 November 2026. No source found for "7702". The data file should record the July publication date as well, because the guidance was public before Art. 50 applied — [Commission library page](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems); [ai-act-data.json](../../tools/ai-act-explorer/ai-act-data.json)
3. **Code of Practice missing.** `ai-act-data.json` and the booklet contain no mention of the Code of Practice on marking and labelling (10 June 2026; adequacy opinion 9 July 2026), although it is the practical template for the hotel's own labels and a vendor question (full-text search of both files: zero hits) — [Commission news](https://digital-strategy.ec.europa.eu/en/news/commission-publishes-code-practice-marking-and-labelling-ai-generated-content)
4. **Enforcement channels missing.** No mention of Art. 110 (representative actions), Art. 87 (whistleblowers) or competitor and association suits under unfair-competition law (search of the data file: zero hits for each) — [Act pp.110, 121](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=110)
5. **Countries.** `nationalLayer` covers Germany, France, Spain, Sweden, UK and Switzerland. Italy, Austria and Greece are absent, and no country entry records the national penalty rules (e.g. Germany's reported § 15 KI-MIG catalogue) — [ai-act-data.json nationalLayer](../../tools/ai-act-explorer/ai-act-data.json)
6. **Timeline wording.** "2 Aug 2026 … Enforcement starts" is imprecise: [text] the penalties chapter has applied since 2 August 2025 (Art. 113(b)), so prohibited practices have been finable since then where national law exists. The 2 Aug 2025 entry lists only model rules and governance — [Act p.123](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=123)
7. **Over-confident wording on the obvious exception.** `hospitalityProvisions` says customer and helpdesk chatbots "never qualify as obvious", and the booklet says they "do not count as obviously AI". [text] The Act sets a contextual test; the restrictive reading is the Commission's non-binding view. Sound advice, but it should be marked as guidance — [Art. 50(1), Act p.82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
8. **Booklet transparency box is image-only.** Section A2 says "the hotel labels realistic AI images it publishes if they could mislead". [text] Art. 50(4) also covers audio and video deep fakes (voice clones, avatars, dubbed videos) and public-interest text; and the Act's test is resemblance plus false authenticity, not "could mislead" — [Act pp.50, 82](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=82)
9. **Booklet, group chatbot.** The "Becoming the maker" note (booklet p.11) says a group building its own chatbot "owes the 'you are talking to AI' notice". It omits the Art. 50(2) marking duty that the data file correctly lists for scenarios P1 and P5 — [ai-act-data.json scenarios](../../tools/ai-act-explorer/ai-act-data.json)
10. **Art. 111(4) nuance missing.** The timeline treats 2 Dec 2026 as the marking deadline for generators "already on the market". [text] The provision covers systems "placed on the market"; in-house systems only put into service are not clearly covered — [Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)
11. **`gpai.hospitalityNote`** says hotels are affected only if they "substantially modify" a model. "Substantial modification" is a defined term for high-risk systems (Art. 3(23)); the model test is the compute threshold the file itself gives under route E. The note also omits that a hotel building on an API has system-provider duties under Art. 50 — [Act p.47](../../tools/ai-act-explorer/EU%20AI%20Act%20June%202024.pdf#page=47)
12. **`enforcementStructure` marked "settled".** Correct for the normal hotel. It could add: the assistants hotels buy from model makers are AI Office-supervised, and Art. 75c(4)(a) lets the AI Office fine any provision, including Art. 4, for operators in its remit — [Omnibus pp.26, 31](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=31)
13. **D1 scenario "consequences".** "AI Act Tier 2 for transparency breaches, falling on whoever holds the duty" is right but hides the key point for the reader: for a vendor bot the hotel holds no Art. 50(1) duty — [ai-act-data.json scenario D1](../../tools/ai-act-explorer/ai-act-data.json)
14. **Fine table "AI literacy: set by each EU country".** Defensible; more precise would be "no EU fine; national law may add measures; Germany reportedly none" — [ki-syndikat.de](https://www.ki-syndikat.de/blog/202609/ki-schulung-pflicht-kein-bussgeld-haftung/)
15. **The brief given to me** listed Art. 99(6) as amended by the Omnibus. [text] It was not; only (1), (4)(da) and (6a) — [Omnibus p.35](../../tools/ai-act-explorer/Digital%20Omnibus%20July%202026.pdf#page=35)

**Checked and found correct [text]:** Art. 4 replaced in full with the "no specific level" sentence; SMC lower-of rule limited to Art. 99(4) and (5), so prohibited practices keep "whichever is higher" for SMCs; Art. 99(4)(da); Art. 50(1)–(6) unchanged; Art. 50 has no grandfathering beyond Art. 111(4); AI Office exclusive competence and its limits; Art. 75(2a) referral with a four-month reply; new prohibitions from 2 Dec 2026; "undertaking" untested.

### Inferences
- [my inference] Items 1, 2, 3 and 8 are the ones worth fixing before the booklet is final; the rest are refinements.

### Gaps
- The team's guideline paragraph numbers could not be audited because the guidelines PDF is not in this repository.
- I did not audit the booklet page by page; only the passages on transparency, literacy, fines and enforcement.
