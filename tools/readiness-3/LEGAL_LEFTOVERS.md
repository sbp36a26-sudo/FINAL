# Legal items not removed (spec/MASTER_PROMPT.md §5)

The banned-term grep (`lib/banned.mjs`, run by `build.mjs` and `tests/banned.test.mjs`) finds **0** matches in the page, the PDF
text, every export and every v3 source. This file lists what the grep does not look at, and why. It names legal terms, so the grep
skips this file, `CHANGELOG.md` and `REVIEW_RESPONSE.md`.

## 1. Inside the page, not legal content

| File : line | Text | Why it stays |
|---|---|---|
| `index.html:565` (the `<script id="r3-jspdf">` block; source `tools/assessment/lib/jspdf.umd.min.js:325`, col 725) | `eu:"Basque"` | jsPDF's table of language codes (ISO 639-1 "eu" = Basque). Vendored, minified third-party code; editing it would fork the library. Not legal content. |
| `index.html:565`, cols 10339, 12079, 13975, 15998, 17688, 19443, 21394, 23180 (same block; source line 325) | `}eu{4qu5ou…` and the like | Keys of jsPDF's compressed kerning tables for its built-in fonts (the PDF uses the inlined font instead). Not words. |
| `index.html:239` (`<script type="application/json" id="r3-font">`) | base64 of the PDF font | No match today. Blanked before the scan all the same, because base64 is random letters and a later font could produce a false match. |

The grep blanks only these two blocks (`pageText()` in `lib/banned.mjs`); `tests/banned.test.mjs` checks that every raw match in the
page lies inside them (9 today).

## 2. Outside the scan by rule

| Where | Matches | Why |
|---|---|---|
| `spec/` (the owner's files: `usecase_questions_v3.json` 130, its `.md` 73, `originals.json` 123, `orig_compact.txt` 127, `MASTER_PROMPT*.md` 36 each, `content_src.py` 12, `build_v3.py` 3, `core_src.py` 1) | change-log fields (`original_questions`, `reason`, `review_verdict`, `treatment`), the spec itself | §5 excludes `spec/` and the change-log fields. Read only; nothing from them reaches the page: the build inlines the runtime JSON (0 matches) and, from the full JSON, only the question-id mapping. |
| `CHANGELOG.md`, `LEGAL_LEFTOVERS.md`, `REVIEW_RESPONSE.md` | names of what was removed | Change log and reports. |
| `tools/readiness-2/data/usecase-questions.json` (read by `build.mjs`) | v2 question texts | Read only for each use case's question-set signature (`sig`), so old answers given to another question set are not carried. No text is copied. |

## 3. Removed from the v3 copy of `data/explain.json` (cut, nothing added)

| Use case | Removed |
|---|---|
| fo-1 | " required by law" (after "the police report") |
| fo-6 | "high-risk " (before "guests") |
| kc-2 | "EU " and " (EU Regulation 1169/2011, Annex II)" around "14 allergens" |
| it-4 | "Face recognition is limited by EU law; " (the next word capitalised) |
| lg-2 | "manages consent, " |

The hub's catalogue and `tools/readiness-2/data/explain.json` are unchanged.

## 4. Sources left out of v3 (banned terms)

Step 4 shows, for the chosen use case, the examples and sources of the hub's use-case catalogue (`tools/use-case-catalogue/index.html`,
read only; built by `catalogueModel` in `build.mjs`, owner decision of 25 Nov 2026). A source whose name, note or address would hit
the banned-term grep is left out of v3 (the grep and its allowlist are unchanged). **32** of 325 catalogue
sources are left out; 293 are shown. The catalogue itself is unchanged and still lists them. `tests/build.test.mjs` checks that this
list names every source left out. "Matched" gives the grep's terms and where they stand (several are only in the web address).

| Use case | Source (name as in the catalogue) | Matched |
|---|---|---|
| res-4 | Hotelchamp: abandoned-booking e-mail goes out one hour after the guest leaves the check-out step, only with consent; 79.2% open rate and 34.7% click rate (measured by the vendor, weighted average of a sample of its hotels, number not given, May 2021; fixed rule, no AI stated) | consent (name) |
| sm-3 | Salesforce | eu (address) |
| sm-3 | Palladium Hotel Group | article (address) |
| sm-4 | Eurostat (2025), AI use in enterprises, isoc_eb_ain2, NACE I55 accommodation, EU27 | eu (note, address) |
| sm-7 | Salesforce | eu (address) |
| fo-4 | apaleo | article (address) |
| fo-8 | NBC News: Chargerback "is used by Austin-Bergstrom International Airport in Texas, Alaska Airlines, hotels, parks and lodges" (general press, 25 Jan 2023; an article about airports, no hotel named) | article (name) |
| gx-1 | HOTELS: after departure, AI virtual assistants "can also prompt guests to leave online reviews" (trade press, Jan 2024; general article, no hotel named) | article (name) |
| fb-5 | Robotise | eu (address) |
| fb-5 | Eurostat (2025), AI use in enterprises, isoc_eb_ain2, NACE I55 accommodation, EU27 | eu (note, address) |
| hk-2 | Eurostat (2025), AI use in enterprises, isoc_eb_ain2, NACE I55 accommodation, EU27 | eu (note, address) |
| hk-3 | HID vendor article on RFID linen tracking (RFID only, no AI) | article (name) |
| hk-4 | Minut | gdpr (note, address) |
| hk-7 | Daily Mail: Bankside Hotel, London (Marriott Autograph Collection) "has installed 225 Spotta 'bed pods'"; bed bugs are identified using "advanced image recognition algorithms"; maintenance manager Andras Goldsbrough: "Spotta's devices are the only way we can monitor the situation 24/7" (general press built on the vendor's material, 12 Dec 2023; one hotel; a count of devices, not a result) | article (address) |
| me-1 | Meliá Hotels International | article (address) |
| kc-1 | Sigala, Gerwin, Chroni, Abeliotis, Strotmann & Lasaridi (2025), Reducing food waste in the HORECA sector using AI-based waste-tracking devices, Waste Management 198, 77–86 | article (note) |
| kc-1 | Goossens, Leverenz & Kuntscher (2022), Resources, Conservation & Recycling Advances 15, 200112 | article (address) |
| kc-2 | Menutech | eu (note) |
| kc-2 | EU-funded Menutech project (CORDIS) | eu (name, address) |
| kc-6 | goodBytz | eu (address) |
| pr-1 | Eurostat (2025), AI use in enterprises, isoc_eb_ain2, NACE I55 accommodation, EU27 | eu (note, address) |
| pr-2 | Eurostat (2025), AI use in enterprises, isoc_eb_ain2, NACE I55 accommodation, EU27 | eu (note, address) |
| fa-1 | PurchasePlus | article (note) |
| fa-3 | Docyt | article (address) |
| fa-6 | Docyt | article (address) |
| hr-2 | Iberostar | article (address) |
| it-1 | Eurostat (2025), AI use in enterprises, isoc_eb_ain2, NACE I55 accommodation, EU27 | eu (note, address) |
| it-4 | Iveda | eu, ai act (note, address) |
| it-4 | Lewis Silkin: AI Act bans workplace emotion recognition from Feb 2025 | ai act, eu, prohibited (name, address) |
| it-4 | Vaidio | ai act (note) |
| it-4 | KölnBäder, Cologne (municipal public pool, not a hotel): Lynxight at the Ossendorfbad with "a total of 17 cameras" that "record exclusively the water surfaces"; investment "around 80,000 euros"; "the AI does not replace personnel" (stated by the operator, EAP magazine, 26 Jan 2026; one public pool, context only) | article (address) |
| lg-4 | TUI Hotels & Resorts | works council (note) |
