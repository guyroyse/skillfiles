# Modules, Imports, and Functions

Detailed examples for the file, module, import, and function rules in
[SKILL.md](../SKILL.md).

## Contents

- Files, modules, and exports
- Functions

## Files, modules, and exports

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

### File granularity

Group by cohesion, not by mechanical rules. A small type alias used only by one
function belongs in that function's file. When a file grows large or its
contents start serving distinct concerns, split it.

### Imports

- **Use specific named imports.** `import { createServer, Server } from 'net'`,
  not `import * as net from 'net'` or `import net from 'net'`. Namespace imports
  hide what's actually used; named imports make the file's real dependencies
  obvious from the top of the file.

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
- Prefer `@foo` style aliases over `@/foo` style. The leading-slash variant is
  fine when a project's tsconfig already uses it, but new configs should drop
  the slash.
- Use `import type { ... }` when importing only types — it's a small thing but
  it's the right signal.

### Within-file layout

Top-down, by what the reader cares about first:

```
imports
↓
types
↓
constants
↓
main implementation (the thing the file is about)
↓
helpers below
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
