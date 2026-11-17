# EU AI Act hospitality explorer (D7)

| File | What it is |
|---|---|
| `ai-act-explorer.html` | Single self-contained explorer: Overview, Topics, Hotel scenarios, Check a system (wizard). Opens by double-click; no network. |
| `ai-act-data.json` | Data layer v1.1 (37 sections, facts verified 10 Nov 2026). Single source of truth; the explorer embeds an identical copy (checked 17 Nov 2026). |
| `CLAUDE-CODE-PROMPT.md` | The build spec and acceptance criteria. |
| `EXPLORER-ACCEPTANCE-CHECK.md` | Acceptance check of 12 Nov 2026. |
| `EU AI Act June 2024.pdf` | Regulation (EU) 2024/1689, OJ 12.7.2024 (144 pages; page map checked 17 Nov 2026: Art. 9 p.56, Art. 25 p.67, Art. 50 p.82, Annex III p.127). Do not rename. |
| `Digital Omnibus July 2026.pdf` | Regulation (EU) 2026/1744, citation target for amended and new articles. Do not rename. |

If you edit `ai-act-data.json`, update the embedded block in `ai-act-explorer.html` (`<script type="application/json" id="ai-act-data">`) to match.
