# Skillfiles

My personal collection of skills for Claude Code, published as a plugin
marketplace. Think dotfiles, but for skills. They're built on the
[Agent Skills](https://agentskills.io/) open spec.

## Skills

### Be Like Guy

Skills that encode my personal style for note-taking.

- **[use-obsidian-like-guy](plugins/be-like-guy/skills/use-obsidian-like-guy)**:
  Operates within my Obsidian vault (Datacore) — reading, writing, routing, and
  maintaining notes the way I like them.

### Code Like Guy

Skills for writing code in my style.

- **[style](plugins/code-like-guy/skills/style)**: My coding style in any
  language — the rule of three, when to remove duplication, objects versus data
  structures, naming, and comments. The language skills build on it.
- **[typescript](plugins/code-like-guy/skills/typescript)**: My TypeScript
  coding style — naming conventions, module structure, type-system idioms, class
  conventions, and syntactic preferences.

### Write Like Guy

Skills for writing in my voice.

- **[voice](plugins/write-like-guy/skills/voice)**: My writing voice —
  plainspoken and casual with precise technical authority. The other writing
  skills build on it.
- **[social-post](plugins/write-like-guy/skills/social-post)**: The shape of a
  social media post — hook, tl;dr, link, and a close that lands.
- **[blog-post](plugins/write-like-guy/skills/blog-post)**: The shape of a blog
  post — hook, a real lesson, examples, and a close that lands.

## Installation

Add the marketplace, then install whichever plugins you want:

```sh
claude plugin marketplace add guyroyse/skillfiles
claude plugin install be-like-guy@guys-skills
claude plugin install code-like-guy@guys-skills
claude plugin install write-like-guy@guys-skills
```

Or from inside Claude Code:

```
/plugin marketplace add guyroyse/skillfiles
/plugin install be-like-guy@guys-skills
/plugin install code-like-guy@guys-skills
/plugin install write-like-guy@guys-skills
```

Skills are namespaced by plugin, so their full names look like
`write-like-guy:social-post`. Claude loads them when a task matches, or you can
invoke one directly with `/write-like-guy:social-post`.

## Updating

Pull the latest version of the marketplace and its plugins:

```
/plugin marketplace update guys-skills
```

If a skill that was renamed or removed still shows up, reinstall the plugin that
held it.

## Making Skills Trigger Automatically

Claude tends to ignore personal-style skills and assume it can handle things on
its own. To force the issue, add a line to a `CLAUDE.md` file telling Claude
when to use the skill, by its full name.

It doesn't need to be fancy:

```markdown
When writing or editing code for me, use the code-like-guy:style skill. For
TypeScript, use it along with code-like-guy:typescript.

When writing a social media post or blog post for me, use the
write-like-guy:voice skill along with write-like-guy:social-post or
write-like-guy:blog-post.
```

Put it in `~/.claude/CLAUDE.md` to apply it everywhere, or in a `CLAUDE.md` at
the root of a repo to apply it to just that project.
