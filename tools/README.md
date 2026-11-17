# HFTP tools

The team's working tools, one folder each. They are kept separate for now and may be merged later.

| Section | Folder | What it is |
|---|---|---|
| AI Assessment Tool | `assessment/` | Interview scoring on the 8 framework categories, LOW / MEDIUM / HIGH bucket. See `assessment/README.md`. |
| Hotel AI Use-Case Catalogue | `use-case-catalogue/` | D4: use cases by department, adoption, gaps, example vendors. |
| Hotel AI Readiness Tool | `readiness/` | D4 × D6: resources per use case and the readiness check. `text-outline.md` is a plain-text outline of the page. |

`index.html` is a hub that shows each tool in its own tab.

## Open it

```bash
cd tools && python3 -m http.server 8765
```

Then open http://127.0.0.1:8765.

## Notes

- Each tool is a single self-contained HTML file. Edit `index.html` in its folder.
- The AI Assessment Tool saves interviews only when it runs as a claude.ai artifact (Alexis's live copy holds the team's data). Opened here it shows a "Saving is not available" banner and keeps nothing.
- The live claude.ai copies are not updated automatically from this repo. Republish a tool after changing it here.
