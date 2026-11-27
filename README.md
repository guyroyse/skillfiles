# Skillfiles

My personal collection of skills. Built on the [Agent Skills](https://agentskills.io/) open spec, so they work with Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, and most other AI coding tools.

## Skills

### TTRPG Tools

Skills for tabletop role-playing game enthusiasts.

- **[ttrpg-campaign-generator](skills/ttrpg-tools/ttrpg-campaign-generator)**:
  Generates creative campaign ideas by randomly combining player types, plot
  structures, villain archetypes, and settings inspired by famous books,
  movies, and shows.

### Be Like Guy

Skills that encode my personal style for writing and coding.

- **[code-typescript-like-guy](skills/be-like-guy/code-typescript-like-guy)**:
  My TypeScript coding style — naming conventions, module structure,
  type-system idioms, class conventions, and syntactic preferences.
- **[write-like-guy](skills/be-like-guy/write-like-guy)**: Writes social media
  posts and short promotional copy in my voice — plainspoken and casual with
  precise technical authority.
- **[use-obsidian-like-guy](skills/be-like-guy/use-obsidian-like-guy)**:
  Operates within my Obsidian vault (Datacore) — reading, writing, routing,
  and maintaining notes the way I like them.

### Chiastic Coding

Skills for building or changing one unit of code (a class or function) from a
spec, test first. The tests have to prove they're sufficient both before and
after the change: every behavior verified, coverage as near 100% as practical,
and mutation testing passed.

- **[develop-unit](skills/chiastic-coding/develop-unit)**: The orchestrator.
  Takes a spec and runs the whole workflow, dispatching the skills below.
- **[assess-tests](skills/chiastic-coding/assess-tests)**: Decides whether a
  unit's tests are sufficient and lists the gaps if they aren't.
- **[characterize-unit](skills/chiastic-coding/characterize-unit)**: Pins down
  what existing code currently does with characterization tests.
- **[specify-unit](skills/chiastic-coding/specify-unit)**: Writes failing tests
  from a spec's requirements.
- **[implement-unit](skills/chiastic-coding/implement-unit)**: Makes failing
  tests pass without touching them.
- **[mutation-check](skills/chiastic-coding/mutation-check)**: Runs mutation
  testing against a unit and explains each surviving mutant.

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
gh skill install guyroyse/skillfiles ttrpg-campaign-generator --agent claude-code --scope user
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
npx skills add guyroyse/skillfiles --skill ttrpg-campaign-generator
```

### Claude Code Plugin Marketplace

Add the marketplace, then install whichever plugins you want:

```sh
claude plugin marketplace add guyroyse/skillfiles
claude plugin install ttrpg-tools@guys-skills
claude plugin install be-like-guy@guys-skills
claude plugin install chiastic-coding@guys-skills
```

Or from inside Claude Code:

```
/plugin marketplace add guyroyse/skillfiles
/plugin install ttrpg-tools@guys-skills
/plugin install be-like-guy@guys-skills
/plugin install chiastic-coding@guys-skills
```

Skills installed via the plugin marketplace are namespaced, so you invoke them
as `/ttrpg-tools:ttrpg-campaign-generator` and `/be-like-guy:write-like-guy`.

## Making Skills Trigger Automatically

Agents tend to ignore personal-style skills and assume they can handle things
on their own. To force the issue, add a line to your agent-instructions file
(`AGENTS.md`, `CLAUDE.md`, etc.) telling the agent when to apply the skill.

It doesn't need to be fancy:

```markdown
When generating or editing TypeScript, apply the code-typescript-like-guy
skill.
```

The location of your agent-instructions file varies by tool and scope:

**Project-level** — drop `AGENTS.md` at the repo root. Most tools pick this
up automatically. For Claude Code, you can import it from `CLAUDE.md` with
`@AGENTS.md`.

**User-global** — handy so you don't have to configure every project
separately. Common locations:

- Claude Code: `~/.claude/CLAUDE.md`
- Codex: `~/.codex/AGENTS.md`
- Gemini CLI: `~/.gemini/GEMINI.md`

Cursor and GitHub Copilot don't have global instruction files — use
project-level files for those.
