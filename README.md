# Skillfiles

My personal collection of skills. Built on the [Agent Skills](https://agentskills.io/) open spec, of course. Installable into Claude, Codex, Cursor, Gemini, Copilot, and all sorts of other compatible tools.

## Skills

- **[guys-typescript-style](skills/guys-typescript-style)**: My TypeScript coding style including naming conventions, module structure, type-system idioms, class conventions, and syntactic preferences.

## Installation

I recommend installing with the [GitHub CLI](https://cli.github.com/).

Install all the skills for all the tools:

```sh
gh skill install guyroyse/skillfiles
```

Install a specific skill for a single tool:

```sh
gh skill install guyroyse/skillfiles guys-typescript-style --agent claude-code --scope user
```

To preview before installing a skill to check for malware. There isn't any but why should you trust me?

```sh
gh skill preview guyroyse/skillfiles
```

### Make sure the skill actually triggers

Agents tend to ignore personal-style skills as they just assume they can handle code generation on their own. This is annoying. To force the issue, add a line to your agent-instructions file (i.e. `AGENTS.md` or `CLAUDE.md`) telling the agent to apply the skill on TypeScript work.

It doesn't need to be fancy. This will do:

```markdown
When generating or editing TypeScript, apply the guys-typescript-style skill.
```

The location of your agent-instruction file can vary depending on the tool you use and the scope you want:

**Project-level**

Drop `AGENTS.md` at the repo root. This is probably the easiest as most tools read these automatically. I also like to import the `AGENTS.md` into `CLAUDE.md` so that it just works with Claude Code as well. See the [`CLAUDE.md`](CLAUDE.md) file in this repo for how to do that.

**User-global**

As of the time of this commit, this tends to be tool-specific and not all tools support it. But this is a handy option so you don't have to constantly tell each project how to write your code.

Some common file locations according to AI:

- Claude Code: `~/.claude/CLAUDE.md`
- Codex: `~/.codex/AGENTS.md`
- Gemini CLI: `~/.gemini/GEMINI.md`

Cursor and GitHub Copilot don't have global files to edit so use project-level files instead.
