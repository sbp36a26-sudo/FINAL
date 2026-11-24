**Read first: this is a text-only copy.** The launcher `scripts/impeccable` and everything behind it are not installed, so no `"${CLAUDE_SKILL_DIR}/scripts/impeccable" ...` command works: `context`, `shot`, `detect`, `motion-capture`, `critique-storage`, `audit-storage`, `concept-seed`, `surface-brief`, `build-phase`, `comp-spec`, `pin`, and the `live`, `generate`, `hooks`, `doctor`, `foundations` and `init` commands. Follow the "Launcher unavailable" paragraph in `SKILL.md`: read the project context directly, then use the reference files as design guidance and check the rendered page yourself.

Source: github.com/pbakaus/impeccable, folder `plugin/skills/impeccable`, commit b49177d32788f2dc585c42831d845dacf1ebed2c, installed 24 Nov 2026 (Apache-2.0, see `LICENSE` and `NOTICE.md`). `SKILL.md` and the installed reference files are unmodified.

Left out, and why:
- `scripts/` (1.7 MB): the launcher downloads and runs a platform binary on first use, unsandboxed and with network access; plus the live-browser scripts and a font index.
- The plugin's `hooks/hooks.json` (SessionStart, PostToolUse and Stop hooks that run the launcher) and `agents/`.
- `reference/hooks.md`: installs hooks into `.claude/settings.local.json` and other agents' settings files.
- `reference/init.md`: tells the agent to ask the user to run `npx impeccable login` so critiques and audits are kept in an Impeccable account.
- `reference/doctor.md` (`npx impeccable update`), `reference/foundations.md` (repo set-up: secrets, CI, error tracking; not design).
- `reference/live.md`, `live-setup.md`, `generate.md`: a local server that injects scripts into the page.
- `reference/component-review.md`, `region-map.md`, `visualize.md`, `new-work-comp.md`, `degraded/asset-producer.md`, `degraded/manual-edit-applier.md`: steps that only exist as script commands.

`SKILL.md` still links to the files left out; those links are dead on purpose. `critique.md`, `audit.md`, `polish.md`, `new-work.md`, `new-work-world.md` and `routing.md` contain script steps too: skip those steps.

Project rules in `CLAUDE.md` win over this skill. This repo's tools are "Operate" surfaces in the skill's terms (`reference/operate.md`).
