---
name: typescript
description: >-
  Guy's personal TypeScript coding style — naming conventions, module structure,
  type-system idioms, class conventions, and small syntactic preferences. Use
  this skill whenever generating, writing, or editing TypeScript code (.ts/.tsx)
  for Guy, even if he doesn't explicitly mention style. This includes new files,
  edits to existing files, code reviews where you'd suggest replacement code,
  and any TypeScript snippet shown in conversation. The goal is to produce
  TypeScript that looks like Guy wrote it himself. Always use it together with
  code-like-guy:style, which covers the principles that hold in any language.
---

# Guy's TypeScript Style

The goal of this skill is to make generated TypeScript indistinguishable from
code Guy would write by hand. The rules below are the ones that distinguish his
code from generic TypeScript — follow every one of them. Where this skill is
silent, fall back to idiomatic modern TypeScript.

The principles that hold in any language — the rule of three, naming, comments,
and file layout — come from **code-like-guy:style**. Load it first; this skill
assumes it and covers only what's specific to TypeScript. Design and
architecture come from **code-like-guy:design**.

Every rule is stated here. Each section links to a reference file with fuller
examples and edge cases; read it when a rule's application isn't obvious.

## Naming

Details: [references/naming.md](references/naming.md)

- `camelCase` for variables, functions, parameters, and properties. `PascalCase`
  for classes, types, enum names, and React components. `SCREAMING_SNAKE_CASE`
  for enum members and for C-style constants: a `const` outside any class or
  function that holds a fixed value, such as a literal, a regex, or a lookup
  table. Inside a class or function, the ordinary rules apply.
- Code examples in this skill are inside a function unless they say otherwise.
- File names are `kebab-case`, always lowercase: `tcp-processor.ts`,
  `user-card.tsx`.
- **The acronym rule.** An acronym followed by another capitalized word gets an
  underscore after it, so the reader can see where it ends. At the start of a
  camelCase identifier it's lowercased instead, and at the end of an identifier
  nothing follows it. `ID` is written like an acronym.

  ```ts
  const myTCP_Port = 8080 /* middle: underscore */
  const tcpAddress = '10.0.0.1' /* start of camelCase: lowercase */
  class TCP_PacketProcessor {} /* start of PascalCase: underscore */
  const hostNameTCP = 'localhost' /* end: no underscore */
  const myHTTP_URL_Handler = handler /* back to back: underscore after each */
  const userID = ulid() /* ID, not Id */
  ```

## Comments

Details: [references/expressions.md](references/expressions.md), "Comments"

- Use `/* ... */` for every comment — inline, end-of-line, multi-line, and
  doc-style. Never `//`.

## Control flow

Details: [references/expressions.md](references/expressions.md), "Small
syntactic preferences"

- A single-statement `if` goes on one line with no braces:
  `if (!user) throw new Error('no user')`.
- When such an `if` wraps onto a second line, put a blank line after it, before
  whatever statement comes next.
- An `if` with an `else` gets braces on both branches.
- Prefer a simple ternary to `if`/`else` for choosing a value. No nested
  ternaries.

## Strings

Details: [references/expressions.md](references/expressions.md), "Strings"

- Interpolate with template literals. Never concatenate with `+`.
- Single quotes for static strings; double quotes only to avoid escaping an
  apostrophe.
- Multi-line strings use the `dedent` library: `dedent` tagged template, content
  indented to match the surrounding code: `import dedent from 'dedent'`.

## Modules and functions

Details: [references/modules.md](references/modules.md)

- Named exports, with `export` on the declaration itself — never an
  `export { ... }` list at the bottom. `export default` only for a file's one
  obvious primary export.
- Named imports (`import { createServer } from 'net'`), not namespace imports.
  Default imports only when the module has nothing else to import — a
  default-only package like `dedent` or `express`, or a file's own
  `export default`. Alias at the import site on a name conflict:
  `import { Server as TCP_Server } from 'net'`.
- Import types with `import type { ... }`. When a module supplies both types and
  values, use two statements — `import type` for the types, a plain `import` for
  the values — not inline `type` modifiers.
- Imports that go _up_ the tree use a path alias (`@foo`, not `@/foo`, in new
  configs). If the project uses aliases but has none for the target, add one. If
  it isn't set up for aliases at all, use `../`. Siblings and children stay
  relative.
- `index.ts` barrels only at module or package boundaries.
- Module-level functions are `function` declarations, not arrow functions
  assigned to `const`. Arrows are for callbacks and short closures.

## Types and classes

Details: [references/types-and-classes.md](references/types-and-classes.md)

- `type`, not `interface`, unless you need declaration merging.
- `unknown` for data crossing a trust boundary; narrow before use. `any` only as
  a deliberate escape hatch. `never` for exhaustiveness.
- Use discriminated unions, `as const`, `satisfies`, and the like when they're
  the right tool — no type-level pyrotechnics.
- Class-private members use `#`, not `private` — unless `#` can't work: a
  compile target below ES2015, an object wrapped in a `Proxy`, or a framework
  that needs to see the field.
- Declare every field in the class body. Give it an initializer there or assign
  it in the constructor. No parameter properties.
- `null` for a deliberate absence — a function that couldn't produce a value
  returns `null`, not `undefined`. Leave `undefined` for missing or optional
  things, and don't convert a built-in's `undefined` (`Array.find`, `Map.get`)
  to `null`.
- Throw exceptions and use `try`/`catch`. No `Result`/`Either` types unless the
  codebase already has them.

## Everything else

Details: [references/expressions.md](references/expressions.md)

- A named regex is yelly case at module level
  (`const TRAILING_WHITESPACE = /\s+$/`) and camelCase inside a function.
- Dot access for properties with valid identifier names. Brackets only for
  dynamic keys, odd characters, or index signatures under
  `noPropertyAccessFromIndexSignature`.
- Destructure when pulling several fields off an object or accepting options.
- Generate ULIDs with the `ulid` package: `import { ulid } from 'ulid'`.

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
