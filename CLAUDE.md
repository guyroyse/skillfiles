# CLAUDE.md

`skillfiles` is a personal collection of Claude Code plugins, published as a
plugin marketplace (`.claude-plugin/marketplace.json`). Each plugin lives in its
own directory under `plugins/`:

```
plugins/<plugin>/
├── .claude-plugin/plugin.json   # manifest: name, description, author, ...
├── skills/<skill-name>/SKILL.md # skills, following the Agent Skills spec
├── agents/<agent-name>.md       # subagents (optional)
└── hooks/hooks.json             # hooks (optional)
```

## Adding a skill

- Create `plugins/<plugin>/skills/<skill-name>/SKILL.md` with YAML frontmatter
  (`name` and `description` are required; `name` must be lowercase kebab-case,
  ≤64 chars, and match the directory name).
- Keep `SKILL.md` under 500 lines. Move detailed reference material to
  `plugins/<plugin>/skills/<skill-name>/references/`.
- Add the new skill to the Skills list in `README.md`.

## Adding a plugin

- Create `plugins/<plugin>/.claude-plugin/plugin.json` with at least a `name`.
- Add an entry to `.claude-plugin/marketplace.json` with `source` set to
  `./plugins/<plugin>`.
- Add a section for it to the Skills list in `README.md`.

## Formatting

Files in this repo are formatted with Prettier (config at `.prettierrc`). The
config applies to Markdown too — Prettier wraps lines at 80 chars. A
`PostToolUse` hook in `.claude/settings.json` runs Prettier on any Markdown file
Claude writes or edits.
