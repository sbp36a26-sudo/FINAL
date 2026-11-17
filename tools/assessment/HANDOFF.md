# Handoff: AI Assessment Tool → team "hub" on a new account

## Goal

Create a new Claude artifact (the "hub") on a different account, so the HFTP SBP Group 36 team can score and browse interviews there. The source is in `app/`. The current tool (owned by Alexis, https://claude.ai/artifact/1jvE6hjkHCWHwqzDiJr5au) cannot be shared to the new account, so the hub starts as a copy and the existing interviews must be imported.

## What is in this folder

- `app/index.html`, `app/engine.js`, `app/report.js`, `app/lib/` – the complete tool as published. Read `README.md` first for how the scoring works.
- `README.md` – team-facing guide (scoring rules, sharing, backups, technical notes).

## Steps

1. **Publish the artifact** on the new account from `app/` as a Claude artifact, with the declared capabilities from the README:
   ```json
   {"db":{"rules":[{"path":"frameworks","read":"view","write":"owner"}]},"user":{"scopes":["profile"]},"downloads":{}}
   ```
   The `frameworks` rule is what makes framework changes owner-only. Do not change it.

2. **Import the existing interviews.** The tool has no import button. Add one (or a one-off restore step) that reads a JSON backup file made by "Overview → Back up (JSON)" and writes each record to `assessments/<id>` (and `transcripts/<id>` if present), then writes the framework versions to `frameworks/v<N>` if they are missing. Skip records whose id already exists, and show a count of imported and skipped records. The backup file must come from Alexis: export it from her live tool and send it over. Do not ask her to share the tool itself.

3. **Test on the hub before the team uses it.** Check: a new interview saves; the overview and company page show it; the PDF downloads; a non-editor sees a read-only banner. The existing test files in `tests/` (described in the README) can be re-run against the hub.

4. **Share.** Use the artifact's Share button and invite as **Editors**: Alban, Nicolás, Annabel and Alexis (add the other team members too if they should score). Do **not** turn on public link sharing, because it stops teammates from saving.

## Decisions still open (confirm before step 4)

1. **Data source.** The hub is the single place to score from now on. Alexis must agree to stop scoring in her current tool once the import is done. Otherwise the two databases diverge.
2. **Framework ownership.** Right now only the owner of the artifact can change the framework. The hub owner is whoever publishes it. Confirm that is the person who should own it, and that the team accepts this.
3. **Old tool.** Keep it read-only as an archive, or delete it after the hub is verified. Deleting it deletes its data, so keep a fresh backup first.

## Notes

- The tool works only in claude.ai, online and signed in.
- Storage belongs to the artifact that holds it. Anything saved in Alexis's tool stays there, and the hub only gets what is imported.
- Scores are entered by people, not by AI. Do not add AI analysis of transcripts (group decision).
- Notion sync is planned for later. It is not part of this handoff.
