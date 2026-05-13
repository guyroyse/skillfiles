---
name: guys-typescript-style
description: Guy's personal TypeScript coding style — naming conventions, module structure, type-system idioms, class conventions, and small syntactic preferences. Use this skill whenever generating, writing, or editing TypeScript code (.ts/.tsx) for Guy, even if he doesn't explicitly mention style. This includes new files, edits to existing files, code reviews where you'd suggest replacement code, and any TypeScript snippet shown in conversation. The goal is to produce TypeScript that looks like Guy wrote it himself.
---

# Guy's TypeScript Style

The goal of this skill is to make generated TypeScript indistinguishable from code Guy would write by hand. The rules below are the ones that actually distinguish his code from generic TypeScript — follow them faithfully. Where this skill is silent, fall back to idiomatic modern TypeScript.

## Formatting

Guy's `.prettierrc` is:

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

Generated TypeScript must follow this whether or not Prettier is wired up in the project:

- **No semicolons.** Newlines are statement terminators. Only use a leading `;` where ASI would genuinely misparse (rare).
- **Single quotes** for string literals by default.
- **No trailing commas** in arrays, objects, function arguments, or type lists.
- **Bracket spacing on:** `{ foo }`, not `{foo}`.
- **Arrow parens avoided** for single-parameter arrows: `x => x * 2`, not `(x) => x * 2`. Multi-parameter or typed arrows keep parens as the syntax requires.
- **2 spaces** for indentation, never tabs.
- **80 char** line width target.

## Strings

The quoting rule, in priority order:

1. **Use template literals (backticks) whenever you need interpolation or multi-line content.** Don't concatenate with `+`; interpolate. This is the preferred way to build any non-trivial string.
2. **Single quotes** for static string literals — per the Prettier config.
3. **Double quotes** only when the string contains an apostrophe, so you don't have to escape it.

```ts
/* Yes */
const greeting = `hello, ${name}`
const path = 'src/index.ts'
const message = "don't worry about it"

/* No */
const greeting = 'hello, ' + name
const message = 'don\'t worry about it'
```

## Naming

The base conventions are standard:

- **Variables, functions, parameters, properties**: `camelCase`
- **Classes, types, enum names**: `PascalCase`
- **True constants and enum members**: `SCREAMING_SNAKE_CASE` ("yelly case")
- **File names**: `kebab-case`, always lowercase, no exceptions (`tcp-processor.ts`, not `TCPProcessor.ts` or `tcpProcessor.ts`)

### The acronym rule (the distinctive one)

When a run of uppercase letters from an acronym sits **inside** an identifier and is followed by another word that starts with an uppercase letter, separate them with an underscore. This disambiguates where the acronym ends and the next word begins.

The rule has four positional cases:

**1. Acronym in the middle, followed by another capitalized word → trailing underscore**

```ts
const myTCP_Port = 8080
class CustomTCP_Processor {}
const myHTTP_URL_Handler = ... /* two acronyms back-to-back: underscores between each */
```

**2. Acronym at the start of a camelCase identifier → all lowercase, no underscore**

Because the identifier starts lowercase, there's no ambiguity to resolve.

```ts
const tcpAddress = '10.0.0.1'
const httpURL_Handler = ... /* first acronym lowercased; second is mid-identifier so gets the underscore */
function tcpConnect() {}
```

**3. Acronym at the start of a PascalCase identifier (class/type/enum) → uppercase, underscore before next word**

```ts
class TCP_PacketProcessor {}
type HTTP_Response = ...
```

**4. Acronym at the end → no trailing underscore**

Nothing follows, so nothing to disambiguate.

```ts
const hostNameTCP = 'localhost'
class ProcessesTCP {}
```

### Booleans

No mandatory prefix. Sometimes `is`/`has` reads well, sometimes a natural noun-phrase does. Pick whichever reads more clearly in context.

### No abbreviations

Spell identifiers out. `object`, not `obj`. `record`, not `rec`. `error`, not `err`. `request`, not `req`. `response`, not `res`. The few characters saved aren't worth the cognitive tax of decoding short forms — and modern editors autocomplete the full word in a keystroke or two anyway. Use established acronyms (`tcp`, `http`, `url`, `id`) — those aren't abbreviations of words, they *are* the words.

## Files, modules, and exports

### Exports

Prefer **named exports**, and put the `export` modifier directly on the declaration. Don't aggregate `export { ... }` lists at the bottom of the file — that forces the reader to scroll to know what's public, and it duplicates the symbol's name.

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

Use `export default` only when a file has one obvious primary export and a default reads more naturally at the call site. Don't sprinkle defaults around for the sake of it.

### Barrel files

Use `index.ts` barrels only at **module or package boundaries** — the public surface of a logical unit. Inside a module, import directly from the file. Don't barrel everything; it slows tree-shaking and invites circular imports.

### File granularity

Group by cohesion, not by mechanical rules. A small type alias used only by one function belongs in that function's file. When a file grows large or its contents start serving distinct concerns, split it.

### Imports

- **Use specific named imports.** `import { createServer, Server } from 'net'`, not `import * as net from 'net'` or `import net from 'net'`. Namespace imports hide what's actually used; named imports make the file's real dependencies obvious from the top of the file.

  ```ts
  /* Yes */
  import { createServer, Server } from 'net'
  const server = createServer()

  /* No */
  import * as net from 'net'
  const server = net.createServer()
  ```

- **Alias on conflict.** When two modules export the same symbol, alias at the import site rather than fully qualifying every reference inside the file.

  ```ts
  import { Server as TCP_Server } from 'net'
  import { Server as UDP_Server } from 'dgram'
  ```

- **Path aliases (`@foo`) when going *up* the hierarchy.** When the import would otherwise need `../` (one or more), use a path alias instead. Siblings and descendants stay relative (`./sibling`, `./child/thing`).
- Prefer `@foo` style aliases over `@/foo` style. The leading-slash variant is fine when a project's tsconfig already uses it, but new configs should drop the slash.
- Use `import type { ... }` when importing only types — it's a small thing but it's the right signal.

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

For module-level functions, use **`function` declarations**, not arrow functions assigned to `const`. Arrow functions are for callbacks, inline usage, and short closures.

```ts
/* Yes */
export function parseRequest(input: string): Request { ... }

/* No, for top-level */
export const parseRequest = (input: string): Request => { ... }
```

## Classes

### Private members use `#`, not `private`

The `#name` private-field syntax is the preferred way to declare class-private state. The `private` keyword is a compile-time-only check; `#` is genuine runtime privacy and reads cleaner. Reserve `private` for cases where you specifically need declaration merging or compatibility with code that can't use `#`.

```ts
/* Yes */
class Connection {
  #socket: Socket
  #isOpen: boolean

  open() {
    this.#socket.connect()
    this.#isOpen = true
  }
}

/* No */
class Connection {
  private socket: Socket
  private isOpen: boolean
}
```

### Declare fields in the class body, assign explicitly in the constructor

Don't use TypeScript's parameter property shorthand (where the constructor signature declares fields by adding modifiers). It's compact but it hides the field list. Declaring members in the class body makes the shape of the class obvious at a glance.

```ts
/* Yes */
class User {
  #id: string
  name: string
  email: string

  constructor(id: string, name: string, email: string) {
    this.#id = id
    this.name = name
    this.email = email
  }
}

/* No */
class User {
  constructor(
    private id: string,
    public name: string,
    public email: string
  ) {}
}
```

## Type system

### `type` over `interface`

Prefer `type` for almost everything — object shapes, unions, intersections, aliases, mapped types. Use `interface` only when you genuinely need declaration merging (rare). A consistent `type X = ...` form reads more uniformly than mixing the two for shallow reasons.

```ts
/* Yes */
type User = {
  id: string
  name: string
}

/* No (without a specific declaration-merging reason) */
interface User {
  id: string
  name: string
}
```

### `any` vs `unknown` vs `never`

- **`unknown`** for data crossing a trust boundary (parsed JSON, third-party callbacks, error catches). Narrow before use.
- **`any`** is rare. Reach for it only as a deliberate escape hatch where the alternative is fighting the type system for no real safety gain. When you do use it, a comment explaining why is welcome.
- **`never`** for exhaustiveness checks and impossible states, as standard.

### Type-system idioms

Use whatever idiom fits the situation — discriminated unions, `as const`, `satisfies`, branded types, conditional types. Don't force any of these as a house style; reach for them when they're the right tool. Idiomatic, readable TypeScript is the goal, not type-level pyrotechnics.

## Error handling

Throw exceptions. Use standard `try`/`catch`. Don't introduce `Result`/`Either` types or other functional error-handling machinery unless the codebase already uses them.

```ts
function parseConfig(raw: string): Config {
  const obj = JSON.parse(raw)
  if (!isValidConfig(obj)) throw new Error('invalid config')
  return obj
}
```

## `null` over `undefined`

`null` is the preferred way to represent "intentionally nothing." `undefined` means "missing" or "not yet set" — a different semantic.

- Return `null` from a function that explicitly *could not produce a value*.
- Leave `undefined` for things like uninitialized fields, missing optional parameters, or optional object properties.

```ts
/* Yes */
function findUser(id: string): User | null {
  ...
  return null
}

/* No */
function findUser(id: string): User | undefined {
  ...
  return undefined
}
```

When the language forces `undefined` (optional parameters, optional properties), that's fine — don't fight it. The rule is about *deliberate* absences in return values and assignments.

## Regular expressions

Always assign regexes to a named variable before using them. An inline regex in a `.match()` / `.test()` / `.replace()` call forces the reader to decode the pattern in their head. A named variable communicates *intent*.

```ts
/* Yes */
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (isValidEmail.test(input)) { ... }

const trailingWhitespace = /\s+$/
const trimmed = line.replace(trailingWhitespace, '')

/* No */
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) { ... }
const trimmed = line.replace(/\s+$/, '')
```

The variable name should describe what the pattern *matches* or what it's *for*, not the regex syntax. If you can't think of a good name, that's a signal the regex itself is doing too much.

## Property access

Use dot access whenever the property name is a valid identifier. Reach for bracket access only when the key is dynamic, contains characters that aren't valid in an identifier, or comes from a `Record<string, ...>` where TypeScript's strict index-access rules force it.

```ts
/* Yes */
const email = object.email
const value = object.apiKey

/* No */
const email = object['email']
const value = object['apiKey']
```

If you find yourself bracket-accessing a known field on a `Record<string, unknown>`, prefer narrowing or casting once at the top so the rest of the code reads naturally.

## Destructuring

Destructure when pulling multiple fields off an object, or when accepting options-style arguments. It reads cleanly and signals intent.

```ts
/* Yes */
const { maxAttempts, baseDelay } = { ...DEFAULT_OPTIONS, ...options }

function createUser({ id, name, email }: User) { ... }

/* Often unnecessary */
const maxAttempts = options.maxAttempts ?? DEFAULT_OPTIONS.maxAttempts
const baseDelay = options.baseDelay ?? DEFAULT_OPTIONS.baseDelay
```

The same applies to imports (use named imports — see above) and array unpacking when it improves clarity.

## Small syntactic preferences

### One-line `if` without braces

A single-statement `if` is written on one line, no braces. This is a deliberate stylistic choice — it keeps short guards visually compact.

```ts
/* Yes */
if (!user) throw new Error('no user')
if (count === 0) return []

/* No (for a single statement) */
if (!user) {
  throw new Error('no user')
}
```

**When a one-line `if` body wraps to a second line, separate consecutive ifs with a blank line.** A one-line if where the body had to break (because of the 80-char limit) visually blends into the next statement without a blank line between them.

```ts
/* Yes */
if (typeof object.email !== 'string')
  throw new Error('missing or invalid field: email')

if (!validEmail.test(object.email))
  throw new Error(`invalid email: ${object.email}`)

/* No */
if (typeof object.email !== 'string')
  throw new Error('missing or invalid field: email')
if (!validEmail.test(object.email))
  throw new Error(`invalid email: ${object.email}`)
```

**Exception: `if`/`else` always uses braces on both branches.** The moment there's an `else`, both branches get a block. Asymmetric brace styling across the two arms reads poorly.

```ts
/* Yes */
if (user.isAdmin) {
  grantAccess()
} else {
  denyAccess()
}

/* No */
if (user.isAdmin) grantAccess()
else denyAccess()
```

### Simple ternaries

For straightforward value assignment or returns, prefer a ternary over an `if`/`else` block. "Simple" means a single condition with two short expressions — not nested ternaries, not multi-line monsters.

```ts
/* Yes */
const label = isActive ? 'active' : 'inactive'
return count > 0 ? items : null

/* No (when a ternary fits) */
let label: string
if (isActive) {
  label = 'active'
} else {
  label = 'inactive'
}
```

If the branches grow, or the condition is complex, fall back to `if`/`else`.

## Comments

Two rules here:

**Style: use `/* ... */`, not `//`.** Block-comment syntax for everything — inline, end-of-line, multi-line, doc-style. Single-line `//` comments are out.

```ts
/* Yes */
/* fallback to legacy parser because the new one chokes on CR-only line endings */
const result = legacyParse(input)

/* No */
// fallback to legacy parser because the new one chokes on CR-only line endings
const result = legacyParse(input)
```

**Content: default to no comments.** Add one only when the *why* is non-obvious — a hidden constraint, a subtle invariant, a workaround for a known issue. Don't narrate what the code does; well-named identifiers handle that. Don't reference the current task or PR (that belongs in commit messages).

---

## Quick checklist before finalizing TypeScript output

- Formatting matches the Prettier config: no semis, single quotes, no trailing commas, 2-space indent, `x => x` arrows, `{ foo }` bracket spacing
- Template literals for interpolation; double quotes only when the string contains an apostrophe
- Identifiers are spelled out, no abbreviations (`object` not `obj`, `error` not `err`)
- Acronym rule applied correctly at every position (start camelCase / start PascalCase / middle / end)
- File names are kebab-case
- `export` modifier placed on the declaration itself, not aggregated at the bottom of the file
- Named imports (`import { x } from '...'`); namespace imports only with strong reason; alias on conflict
- Module-level functions use `function` declarations
- Classes: `#` for privacy (not `private`); fields declared in the body and assigned in the constructor body (no parameter properties)
- Types use `type` (not `interface`) unless declaration merging is needed
- `null` used for intentional absences in returns/assignments; `undefined` for "missing"
- Property access uses dot notation; bracket access only when truly needed
- Destructuring used when pulling multiple fields or unpacking options
- Regexes assigned to a named variable, not inlined
- Single-statement `if` is one line without braces; `if`/`else` uses braces on both arms; blank line between consecutive ifs whose bodies wrap
- Simple value-producing branches use ternaries
- Imports going up the hierarchy use `@foo` aliases; siblings stay relative
- Top-down file layout: imports, types, constants, main, helpers
- Comments use `/* ... */`, written only when the *why* is non-obvious
