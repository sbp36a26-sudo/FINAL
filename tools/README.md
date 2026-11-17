# HFTP tools

The team's working tools, one folder each. They are kept separate for now and may be merged later.

| Section | Folder | What it is |
|---|---|---|
| AI Assessment Tool | `assessment/` | Interview scoring on the 8 framework categories, LOW / MEDIUM / HIGH bucket. See `assessment/README.md`. |
| Hotel AI Use-Case Catalogue | `use-case-catalogue/` | D4: use cases by department, adoption, gaps, example vendors. |
| Hotel AI Readiness Tool | `readiness/` | D4 × D6: resources per use case and the readiness check. `text-outline.md` is a plain-text outline of the page. |
| Hotel AI Register (prototype) | `register/` | D7: a hotel's list of its AI tools with labels, items to check, watch list and exports. See `register/README.md`. |

`index.html` is the published hub page. It is GENERATED: it is the AI Assessment Tool with the hub bar (`hub/hub-bar.html`) on top, and the other two tools open as tabs. The Assessment Tool has to be the main page because saving only works on an artifact's main page. After editing `assessment/index.html` or `hub/hub-bar.html`, run `node tools/build-hub.mjs`.

## Open it

```bash
cd tools && python3 -m http.server 8765
```

Then open http://127.0.0.1:8765.

## Notes

- Each tool is a single self-contained HTML file. Edit `index.html` in its folder.
- The AI Assessment Tool saves interviews only on claude.ai (hub artifact https://claude.ai/artifact/MWMGc2VKc6zniRn8um27eH). Opened locally it shows a "Saving is not available" banner and keeps nothing.
- The live claude.ai copies are not updated automatically from this repo. Republish a tool after changing it here.
