**Read first: this is a text-only copy.** `SKILL.md` and `references/` point to `assets/`, `library/` and `scripts/` (the starter page, CSS/JS kit, photo and icon fetchers, the checker and the finish gate). None of that is installed here, so every `node <skill>/...` command and every "copy from assets/..." step will not work. Use the files as written design guidance only.

Source: github.com/leonxlnx/taste-skill, folder `skills/taste-skill`, commit 6c0b5c78f5d31776e2210305abaa210cdc0030bf, installed 24 Nov 2026 (MIT, see `LICENSE`).

Changed against upstream:
- Frontmatter `name:` is `taste-skill` (upstream: `design-taste-frontend`) so it matches this folder.
- Frontmatter `hooks:` block removed. It registered a Stop hook that ran `scripts/gate.mjs` at the end of every turn. The body of `SKILL.md` is unchanged.
- `references/gate.md` left out: it documents that gate script and how to add it as a hook in `.claude/settings.json`.
- Not installed: `assets/` (38 MB), `library/`, `scripts/` (1.6 MB of executable code, some of which downloads photographs and icons).

Project fit: the skill is written for marketing and company websites (heroes, photographs, scroll moments). For this repo's tools, only `references/system.md` (forms, access), `references/motion.md` (hover, press, focus, reduced motion) and the "Never" lists apply. Project rules in `CLAUDE.md` win over it.
