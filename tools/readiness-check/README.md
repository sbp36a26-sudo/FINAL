# AI readiness check (prototype) and team results

Two pages, one set of rules (v2, 18 Nov 2026):

| Page | Hub tab | What it does |
|---|---|---|
| `index.html` | Readiness check | Client flow: hotel details → pick one AI tool (plain words + short legend) → six steps, one per area → score 0–100, verdict, area bars, must-haves not met, next gaps → PDF report or copied summary. |
| `team.html` | **Team: readiness results** (red, right end of the hub bar) | Every saved check: client details, every question with why it was asked, the answer, proof and points, area totals, must-haves, caps, score and verdict, step by step. Recomputes with the current rules and flags any change from the saved result. Links to the full research tool (`../readiness/index.html`). |

**Saving.** When a client reaches the result, the check is saved to the hub's shared database (collection `readiness`) through the hub bar's bridge (only the hub's main page can use the database). Opened outside the hub, both pages fall back to the browser's own storage.

**Rules v2** (from `reports/Hotel AI readiness check design.md`):
- Only the questions that matter for the tool (core): must-haves, check-first, needed by every tool of its type, risk add-ons, resource needs; 18–31 per tool.
- Answers Yes 2 · Partly 1 · No 0 · Not sure 0 · Does not apply (not offered on must-haves). Unanswered counts as Not sure.
- A must-have counts as met only with Yes plus a short proof note.
- Must-have changes: two-way data link not required for Light tools; human override (P5) required when the tool acts alone; risk review incl. DPIA (G2) required with sensitive data; new must-have XG (staff representatives) for staff tools. New questions X1 (staff acceptance, all tools) and X2 (guest acceptance, guest-facing tools).
- Verdict: any must-have not met or an area below 40% → Build foundations first; an area below 75% → Ready to pilot; else Ready to scale.
- Score: average of the six areas, capped at 39 (foundations) or 74 (pilot).

```bash
node tools/readiness-check/build.mjs
```

```bash
node tools/readiness-check/tests/logic.test.mjs
```

Prototype: the hub is private, so only people it is shared with can submit or see results. A separate client-facing version comes later.
