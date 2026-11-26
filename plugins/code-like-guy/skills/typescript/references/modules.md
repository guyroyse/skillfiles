# Modules, Imports, and Functions

Detailed examples for the module, import, and function rules in
[SKILL.md](../SKILL.md). File layout and granularity are covered by
code-like-guy:style.

## Contents

- Modules and exports
- Functions

## Modules and exports

### Exports

Prefer **named exports**, and put the `export` modifier directly on the
declaration. Don't aggregate `export { ... }` lists at the bottom of the file —
that forces the reader to scroll to know what's public, and it duplicates the
symbol's name.

```ts
/* Yes */
export class TCP_Server { ... }
export function parseRequest(input: string): Request { ... }
export type User = { ... }

/* No */
class TCP_Server { ... }
function parseRequest(input: string): Request { ... }
type User = { ... }
export { TCP_Server, parseRequest }
export type { User }
```

Use `export default` only when a file has one obvious primary export and a
default reads more naturally at the call site. Don't sprinkle defaults around
for the sake of it.

### Barrel files

Use `index.ts` barrels only at **module or package boundaries** — the public
surface of a logical unit. Inside a module, import directly from the file. Don't
barrel everything; it slows tree-shaking and invites circular imports.

### Imports

- **Use specific named imports.** `import { createServer, Server } from 'net'`,
  not `import * as net from 'net'` or `import net from 'net'`. Namespace imports
  hide what's actually used; named imports make the file's real dependencies
  obvious from the top of the file.

  Use a default import only when the module has nothing else to import: a
  default-only package (`import dedent from 'dedent'`,
  `import express from 'express'`) or a local file whose primary export is
  `export default`. Don't invent named imports a module doesn't have.

  ```ts
  /* Yes */
  import { createServer, Server } from 'net'
  const server = createServer()

  /* No */
  import * as net from 'net'
  const server = net.createServer()
  ```

- **Alias on conflict.** When two modules export the same symbol, alias at the
  import site rather than fully qualifying every reference inside the file.

  ```ts
  import { Server as TCP_Server } from 'net'
  import { Server as UDP_Server } from 'dgram'
  ```

- **Path aliases (`@foo`) when going _up_ the hierarchy.** When the import would
  otherwise need `../` (one or more), use a path alias instead. Siblings and
  descendants stay relative (`./sibling`, `./child/thing`).
- If the project uses path aliases but has none for the directory you're
  importing from, add one — to `tsconfig.json`'s `paths` and to whatever
  resolves them at runtime (the bundler config, or `imports` in `package.json`).
  If the project isn't set up for path aliases at all, use `../`.
- Prefer `@foo` style aliases over `@/foo` style. The leading-slash variant is
  fine when a project's tsconfig already uses it, but new configs should drop
  the slash.
- Use `import type { ... }` when importing only types — it's a small thing but
  it's the right signal. When a module supplies both types and values, write two
  statements rather than inline `type` modifiers.

  ```ts
  /* Yes */
  import type { Server, Socket } from 'net'
  import { createServer } from 'net'

  /* No */
  import { createServer, type Server, type Socket } from 'net'
  ```

## Functions

For module-level functions, use **`function` declarations**, not arrow functions
assigned to `const`. Arrow functions are for callbacks, inline usage, and short
closures.

```ts
/* Yes */
export function parseRequest(input: string): Request { ... }

/* No, for top-level */
export const parseRequest = (input: string): Request => { ... }
```
