---
name: typescript
description:
  Guy's personal TypeScript coding style — naming conventions, module structure,
  type-system idioms, class conventions, and small syntactic preferences. Use
  this skill whenever generating, writing, or editing TypeScript code (.ts/.tsx)
  for Guy, even if he doesn't explicitly mention style. This includes new files,
  edits to existing files, code reviews where you'd suggest replacement code,
  and any TypeScript snippet shown in conversation. The goal is to produce
  TypeScript that looks like Guy wrote it himself.
---

# Guy's TypeScript Style

The goal of this skill is to make generated TypeScript indistinguishable from
code Guy would write by hand. The rules below are the ones that distinguish his
code from generic TypeScript — follow every one of them. Where this skill is
silent, fall back to idiomatic modern TypeScript.

Every rule is stated here. Each section links to a reference file with fuller
examples and edge cases; read it when a rule's application isn't obvious.

## Naming

Details: [references/naming.md](references/naming.md)

- `camelCase` for variables, functions, parameters, and properties. `PascalCase`
  for classes, types, and enum names. `SCREAMING_SNAKE_CASE` for true constants
  and enum members.
- File names are `kebab-case`, always lowercase: `tcp-processor.ts`.
- **No abbreviations.** `object`, not `obj`; `error`, not `err`; `request`, not
  `req`. Established acronyms (`tcp`, `http`, `url`, `id`) are fine — they _are_
  the words.
- Booleans need no `is`/`has` prefix; use whatever reads most clearly.
- **The acronym rule.** An acronym followed by another capitalized word gets an
  underscore after it, so the reader can see where it ends. At the start of a
  camelCase identifier it's lowercased instead, and at the end of an identifier
  nothing follows it.

  ```ts
  const myTCP_Port = 8080 /* middle: underscore */
  const tcpAddress = '10.0.0.1' /* start of camelCase: lowercase */
  class TCP_PacketProcessor {} /* start of PascalCase: underscore */
  const hostNameTCP = 'localhost' /* end: no underscore */
  const myHTTP_URL_Handler = handler /* back to back: underscore after each */
  ```

## Comments

Details: [references/expressions.md](references/expressions.md), "Comments"

- **Comments should be rare.** Names do the explaining. Reaching for a comment
  is a sign that something is poorly named — rename it, or pull the unclear
  expression or block out into a well-named variable or function.
- Comment only the _why_ no name can carry: a hidden constraint, a subtle
  invariant, a workaround. Never narrate the code or mention the current task.
- Use `/* ... */` for every comment. Never `//`.

## Control flow

Details: [references/expressions.md](references/expressions.md), "Small
syntactic preferences"

- A single-statement `if` goes on one line with no braces:
  `if (!user) throw new Error('no user')`.
- When such an `if` wraps onto a second line, put a blank line between it and
  the next `if`.
- An `if` with an `else` gets braces on both branches.
- Prefer a simple ternary to `if`/`else` for choosing a value. No nested
  ternaries.

## Strings

Details: [references/expressions.md](references/expressions.md), "Strings"

- Interpolate with template literals. Never concatenate with `+`.
- Single quotes for static strings; double quotes only to avoid escaping an
  apostrophe.
- Multi-line strings use the `dedent` library: `dedent` tagged template, content
  indented to match the surrounding code. `import dedent from 'dedent'` — it
  only has a default export.

## Modules and functions

Details: [references/modules.md](references/modules.md)

- Named exports, with `export` on the declaration itself — never an
  `export { ... }` list at the bottom. `export default` only for a file's one
  obvious primary export.
- Named imports (`import { createServer } from 'net'`), not namespace or default
  imports. Alias at the import site on a name conflict:
  `import { Server as TCP_Server } from 'net'`.
- `import type { ... }` when importing only types.
- Imports that go _up_ the tree use a path alias (`@foo`, not `@/foo`, in new
  configs). Siblings and children stay relative.
- `index.ts` barrels only at module or package boundaries.
- File layout, top-down: imports, types, constants, the main implementation,
  then helpers.
- Group code by cohesion; split a file when it starts serving distinct concerns.
- Module-level functions are `function` declarations, not arrow functions
  assigned to `const`. Arrows are for callbacks and short closures.

## Types and classes

Details: [references/types-and-classes.md](references/types-and-classes.md)

- `type`, not `interface`, unless you need declaration merging.
- `unknown` for data crossing a trust boundary; narrow before use. `any` only as
  a deliberate escape hatch. `never` for exhaustiveness.
- Use discriminated unions, `as const`, `satisfies`, and the like when they're
  the right tool — no type-level pyrotechnics.
- Class-private members use `#`, not `private`.
- Declare fields in the class body and assign them in the constructor. No
  parameter properties.
- `null` for a deliberate absence — a function that couldn't produce a value
  returns `null`, not `undefined`. Leave `undefined` for missing or optional
  things.
- Throw exceptions and use `try`/`catch`. No `Result`/`Either` types unless the
  codebase already has them.

## Everything else

Details: [references/expressions.md](references/expressions.md)

- Assign every regex to a variable named for what it matches, then use it:
  `const trailingWhitespace = /\s+$/`.
- Dot access for properties with valid identifier names. Brackets only for
  dynamic keys, odd characters, or where `Record` indexing forces it.
- Destructure when pulling several fields off an object or accepting options.
- Generate IDs as ULIDs with the `ulid` package (`import { ulid } from 'ulid'`),
  not UUIDs — unless the project or an external system already uses UUIDs.

## Formatting

Guy's projects use Prettier with this `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "proseWrap": "always"
}
```

Use it when setting up a new project, and follow it in code shown in
conversation, where Prettier never runs. When a project has its own Prettier
config, that config wins.
