# Strings, Expressions, and Comments

Detailed examples for the string, ID, regex, property-access, destructuring,
`if`, ternary, and comment-syntax rules in [SKILL.md](../SKILL.md).

## Contents

- Strings
- IDs
- Regular expressions
- Property access
- Destructuring
- Small syntactic preferences
- Comments

## Strings

The quoting rule, in priority order:

1. **Use template literals (backticks) whenever you need interpolation or
   multi-line content.** Don't concatenate with `+`; interpolate. This is the
   preferred way to build any non-trivial string.
2. **Single quotes** for static string literals — per the Prettier config.
3. **Double quotes** only when the string contains an apostrophe, so you don't
   have to escape it.

```ts
/* Yes */
const greeting = `hello, ${name}`
const path = 'src/index.ts'
const message = "don't worry about it"

/* No */
const greeting = 'hello, ' + name
```

### Multi-line strings use `dedent`

For a multi-line string, tag the template literal with the
[`dedent`](https://www.npmjs.com/package/dedent) library. Indent the content to
match the surrounding code, and `dedent` strips the shared indentation and the
leading and trailing blank lines. Don't push the content flush against the left
margin, and don't build it from an array of lines joined with `\n`.

```ts
/* Yes */
import dedent from 'dedent'

const message = dedent`
  Hello, ${name}.
  Your order has shipped.
`

/* No */
const message = `Hello, ${name}.
Your order has shipped.`

const message = [`Hello, ${name}.`, 'Your order has shipped.'].join('\n')
```

`dedent` only has a default export, so it's imported as a default.

## IDs

code-like-guy:style says to use ULIDs. In TypeScript, generate them with the
[`ulid`](https://www.npmjs.com/package/ulid) package.

```ts
/* Yes */
import { ulid } from 'ulid'
const id = ulid()

/* No */
import { randomUUID } from 'crypto'
const id = randomUUID()
```

## Regular expressions

code-like-guy:style says to name every regex rather than inlining it in a
`.match()`, `.test()`, or `.replace()` call.

At module level, a regex is a C-style constant and gets yelly case. Inside a
function, it's camelCase.

```ts
/* Yes, at module level */
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isEmail(input: string) {
  return VALID_EMAIL.test(input)
}

/* Yes, inside a function */
const trailingWhitespace = /\s+$/
const trimmed = line.replace(trailingWhitespace, '')

/* No */
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) { ... }
const trimmed = line.replace(/\s+$/, '')
```

## Property access

Use dot access whenever the property name is a valid identifier. Reach for
bracket access only when the key is dynamic, contains characters that aren't
valid in an identifier, or belongs to an index signature (such as a
`Record<string, ...>`) in a project with `noPropertyAccessFromIndexSignature`
on, which forces brackets.

```ts
/* Yes */
const email = object.email
const value = object.apiKey

/* No */
const email = object['email']
const value = object['apiKey']
```

If you find yourself bracket-accessing a known field on a
`Record<string, unknown>`, prefer narrowing or casting once at the top so the
rest of the code reads naturally.

## Destructuring

Destructure when pulling multiple fields off an object, or when accepting
options-style arguments. It reads cleanly and signals intent.

```ts
/* Yes */
const { maxAttempts, baseDelay } = { ...DEFAULT_OPTIONS, ...options }

function createUser({ id, name, email }: User) { ... }

/* Often unnecessary */
const maxAttempts = options.maxAttempts ?? DEFAULT_OPTIONS.maxAttempts
const baseDelay = options.baseDelay ?? DEFAULT_OPTIONS.baseDelay
```

The same applies to imports (use named imports — see [modules.md](modules.md))
and array unpacking when it improves clarity.

## Small syntactic preferences

### One-line `if` without braces

A single-statement `if` is written on one line, no braces. This is a deliberate
stylistic choice — it keeps short guards visually compact.

```ts
/* Yes */
if (!user) throw new Error('no user')
if (count === 0) return []

/* No (for a single statement) */
if (!user) {
  throw new Error('no user')
}
```

**When a one-line `if` body wraps to a second line, follow it with a blank
line.** A one-line if where the body had to break (because of the 80-char limit)
visually blends into whatever statement comes next — another `if` or anything
else — without a blank line between them.

```ts
/* Yes */
if (typeof object.email !== 'string')
  throw new Error('missing or invalid field: email')

if (!VALID_EMAIL.test(object.email))
  throw new Error(`invalid email: ${object.email}`)

return object.email

/* No */
if (typeof object.email !== 'string')
  throw new Error('missing or invalid field: email')
if (!VALID_EMAIL.test(object.email))
  throw new Error(`invalid email: ${object.email}`)
return object.email
```

**Exception: `if`/`else` always uses braces on both branches.** The moment
there's an `else`, both branches get a block. Asymmetric brace styling across
the two arms reads poorly.

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

For straightforward value assignment or returns, prefer a ternary over an
`if`/`else` block. "Simple" means a single condition with two short expressions
— not nested ternaries, not multi-line monsters.

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

How often to comment, and what about, is covered by code-like-guy:style. This
section covers syntax.

**Use `/* ... */`, not `//`.** Block-comment syntax for everything — inline,
end-of-line, multi-line, doc-style. Single-line `//` comments are out.

```ts
/* Yes */
/* fallback to legacy parser because the new one chokes on CR-only line endings */
const result = legacyParse(input)

/* No */
// fallback to legacy parser because the new one chokes on CR-only line endings
const result = legacyParse(input)
```
