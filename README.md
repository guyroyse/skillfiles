# Skillfiles

My personal collection of skills. Built on the
[Agent Skills](https://agentskills.io/) open spec, so they work with Claude
Code, Codex, Cursor, Gemini CLI, GitHub Copilot, and most other AI coding tools.

## Skills

### Be Like Guy

Skills that encode my personal style for coding and note-taking.

- **[code-typescript-like-guy](skills/be-like-guy/code-typescript-like-guy)**:
  My TypeScript coding style — naming conventions, module structure, type-system
  idioms, class conventions, and syntactic preferences.
- **[use-obsidian-like-guy](skills/be-like-guy/use-obsidian-like-guy)**:
  Operates within my Obsidian vault (Datacore) — reading, writing, routing, and
  maintaining notes the way I like them.

### Write Like Guy

Skills for writing in my voice.

- **[voice](skills/write-like-guy/voice)**: My writing voice — plainspoken and
  casual with precise technical authority. The other writing skills build on it.
- **[social-post](skills/write-like-guy/social-post)**: The shape of a social
  media post — hook, tl;dr, link, and a close that lands.
- **[blog-post](skills/write-like-guy/blog-post)**: The shape of a blog post —
  hook, a real lesson, examples, and a close that lands.

## Installation

Skills can be installed using the GitHub CLI, the `npx skills` CLI, or the
Claude Code plugin marketplace. Pick whichever you have handy.

### GitHub CLI (`gh skill`)

Install everything:

```sh
gh skill install guyroyse/skillfiles
```

Install a specific skill:

```sh
gh skill install guyroyse/skillfiles social-post --agent claude-code --scope user
```

Preview before installing (always a good idea):

```sh
gh skill preview guyroyse/skillfiles
```

### npx skills

Install everything:

```sh
npx skills add guyroyse/skillfiles
```

Install a specific skill:

```sh
npx skills add guyroyse/skillfiles --skill social-post
```

### Claude Code Plugin Marketplace

Add the marketplace, then install one or both plugins:

```sh
claude plugin marketplace add guyroyse/skillfiles
claude plugin install be-like-guy@guys-skills
claude plugin install write-like-guy@guys-skills
```

Or from inside Claude Code:

```
/plugin marketplace add guyroyse/skillfiles
/plugin install be-like-guy@guys-skills
/plugin install write-like-guy@guys-skills
```

Skills installed via the plugin marketplace are namespaced, so you invoke them
as `/write-like-guy:social-post`.

## Making Skills Trigger Automatically

Agents tend to ignore personal-style skills and assume they can handle things on
their own. To force the issue, add a line to your agent-instructions file
(`AGENTS.md`, `CLAUDE.md`, etc.) telling the agent when to apply the skill.

It doesn't need to be fancy:

```markdown
When generating or editing TypeScript, apply the code-typescript-like-guy skill.
```

The location of your agent-instructions file varies by tool and scope:

**Project-level** — drop `AGENTS.md` at the repo root. Most tools pick this up
automatically. For Claude Code, you can import it from `CLAUDE.md` with
`@AGENTS.md`.

**User-global** — handy so you don't have to configure every project separately.
Common locations:

- Claude Code: `~/.claude/CLAUDE.md`
- Codex: `~/.codex/AGENTS.md`
- Gemini CLI: `~/.gemini/GEMINI.md`

Cursor and GitHub Copilot don't have global instruction files — use
project-level files for those.
