# Explorer acceptance check — 12 Nov 2026

File tested: `ai-act-explorer.html` (after the 12 Nov change to `meta.links`), opened from `file://` in headless Chrome at 1280 px and 375 px. Criteria from `CLAUDE-CODE-PROMPT.md`.

## Passed

| Criterion | Result |
| --- | --- |
| Opens from file:// with no console errors and no network requests | Pass: 0 errors, 0 requests |
| No external scripts, fonts or images; no fetch, localStorage or telemetry | Pass |
| Embedded JSON block identical to `ai-act-data.json` | Pass (checked after the edit) |
| No August 2026 high-risk application date in the UI code | Pass; high-risk shows 2 Dec 2027 and 2 Aug 2028 |
| Opens on the Overview; four views and 12 topics reachable | Pass |
| All 13 scenarios present (D1–D7, P1–P6) | Pass |
| Wizard: vendor chatbot, no HR use, no synthetic content, guest personal data → transparency, deployer, Art. 50(1), GDPR processor contract and lawful basis, matches D1 | Pass |
| Wizard: general chatbot used to rank applicants → provider via route D, high risk, Annex III 4(a) shown verbatim, 2 Dec 2027, Tier 2, shadow-AI flag | Pass |
| Wizard: staff emotion recognition from voice → stops at Q4, prohibited, 2 Feb 2025, Tier 1 EUR 35m/7% | Pass |
| Transparency stacking: minimal-tier chatbot still shows the Art. 50(1) duty | Pass |
| q6 "Not sure" → lowest confidence reported as Draft guidance | Pass |
| No horizontal scroll at 375 px on any of the four views | Pass |
| Keyboard focus visible (3 px outline) | Pass on first tab stops |

## Not tested here

- Greyscale check of the confidence badges.
- A full keyboard-only run through the wizard.
- Every count in the acceptance list (glossary 31, corrections 18, etc.) item by item.
- PDF page links opening at the right page (they depend on the browser's PDF viewer).

## One thing to look at

The chatbot outcome (D1 path) lists open item OI5 (Art. 2(13), Annex I relief) under "Open items that touch this outcome". OI5 affects only Annex I high-risk systems, so it probably should not show on a transparency-tier outcome. Its `affects` list names whole sections (`tiers`, `obligationsByRoleAndTier`), which is likely why it attaches to every outcome.

## Change made on 12 Nov 2026

`meta.links.doNotUse` no longer lists artificialintelligenceact.eu: the site carries the amended text (Art. 4 checked 12 Nov 2026, paras 2–3 marked amended and new). It now sits under the new key `meta.links.secondaryTextSources` as a secondary source, with EUR-Lex and the Commission Service Desk as primary. Same change in the embedded copy in the Explorer and in line 206 of `CLAUDE-CODE-PROMPT.md`. The Explorer code does not read `meta.links.doNotUse`, so nothing visible changes.
