# CLAUDE.md

`skillfiles` is a personal collection of
[Agent Skills](https://agentskills.io/), published as a Claude Code plugin
marketplace. Skills are grouped into plugins: each plugin is a directory under
`skills/`, and each skill is a self-contained directory inside it that follows
the open Agent Skills spec.

## Adding a skill

- Create `skills/<plugin>/<skill-name>/SKILL.md` with YAML frontmatter (`name`
  and `description` are required; `name` must be lowercase kebab-case, ≤64
  chars, and match the directory name).
- Keep `SKILL.md` under 500 lines. Move detailed reference material to
  `skills/<plugin>/<skill-name>/references/`.
- Add the new skill to the Skills list in `README.md`.
- For a new plugin, also add an entry to `.claude-plugin/marketplace.json`.

## Formatting

Files in this repo are formatted with Prettier (config at `.prettierrc`). The
config applies to Markdown too — Prettier wraps lines at 80 chars. A
`PostToolUse` hook in `.claude/settings.json` runs Prettier on any Markdown file
Claude writes or edits.
