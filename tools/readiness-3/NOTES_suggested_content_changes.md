# Suggested content changes (not applied)

Every string in `spec/usecase_questions_v3.json` is used verbatim. Where the data looks wrong or incomplete it is listed here
for the owner instead of being edited. Ids refer to `spec/usecase_questions_v3.json`.

| Where | Issue | Suggestion |
|---|---|---|
| `must_haves[*]` | Must-haves have no `owner`, but §4 asks for every top action to carry an owner. The code uses "General manager" for must-have actions. | Add an `owner` key per must-have (for example m2 Finance, m4 IT, m8 and m11 Department head). |
| `gate_library.*.options[].effects.action`, custom gate actions | Gate actions have no owner. The code uses "General manager". | Add an owner per gate action, or confirm General manager. |
| `step2` (s3 to s5) | No action text is given for a step-2 cap; the code applies the §4 rule ("Make sure: …" / "Find out: …" on the step-2 question). This reads oddly ("Make sure: Do you know which number should improve, and what it is today"). | Add an `action` text per step-2 question. |
| `counts.acronyms` | Lists "Wi-Fi" (12 uses), which has no glossary entry. It is a common word rather than an acronym, so nothing is shown for it. | Confirm no glossary entry is wanted for Wi-Fi. |
| `usecase_questions_v3.schema.json` | `use_cases[].original_questions` is required, but the runtime file drops it by design, so the runtime file cannot pass the schema as written. The build validates the runtime file with only that requirement lifted (and checks it equals the full file minus change-log fields). | Make `original_questions` optional in the schema, or ship a runtime schema. |
| `step2[s1]`, `step2[s2]` | On the soft stop the §4 rule turns the step-2 question into the top action ("Make sure: Does each case need judgement that fixed "if this, then that" rules can't handle"), which reads oddly beside "Simpler options to try first". | Add a `stop_action` text per soft-stop question. |
| sensitive reason | When the flag holds the verdict, the rules' reason sentence was the flag's first sentence, so the result said it twice. The page now says "Held at Almost ready: this use case involves people's personal data or jobs." (UI wording, not data). | Confirm the wording, or add a `sensitive_reason` text. |
