# AGENTS.md

`skillfiles` is a personal collection of [Agent Skills](https://agentskills.io/). Each skill is a self-contained directory under `skills/` and follows the open Agent Skills spec.

## Adding a skill

- Create `skills/<skill-name>/SKILL.md` with YAML frontmatter (`name` and `description` are required; `name` must be lowercase kebab-case, ≤64 chars, and match the directory name).
- Keep `SKILL.md` under 500 lines. Move detailed reference material to `skills/<skill-name>/references/`.
- Add the new skill to the Skills list in `README.md`.

## Formatting

Files in this repo are formatted with Prettier (config at `.prettierrc`). The config applies to Markdown too — Prettier wraps lines at 80 chars.
