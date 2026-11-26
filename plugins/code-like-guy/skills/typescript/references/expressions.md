# Strings, Expressions, and Comments

Detailed examples for the string, ID, regex, property-access, destructuring,
`if`, ternary, and comment rules in [SKILL.md](../SKILL.md).

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

`dedent` only has a default export, so it's an exception to the named-imports
rule.

## IDs

Generate unique IDs as [ULIDs](https://github.com/ulid/spec), not UUIDs. ULIDs
sort by creation time and read more compactly. Use the
[`ulid`](https://www.npmjs.com/package/ulid) package.

```ts
/* Yes */
import { ulid } from 'ulid'
const id = ulid()

/* No */
import { randomUUID } from 'crypto'
const id = randomUUID()
```

When a project or an external system already uses UUIDs, stick with them.

## Regular expressions

Always assign regexes to a named variable before using them. An inline regex in
a `.match()` / `.test()` / `.replace()` call forces the reader to decode the
pattern in their head. A named variable communicates _intent_.

```ts
/* Yes */
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (validEmail.test(input)) { ... }

const trailingWhitespace = /\s+$/
const trimmed = line.replace(trailingWhitespace, '')

/* No */
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) { ... }
const trimmed = line.replace(/\s+$/, '')
```

The variable name should describe what the pattern _matches_ or what it's _for_,
not the regex syntax. If you can't think of a good name, that's a signal the
regex itself is doing too much.

## Property access

Use dot access whenever the property name is a valid identifier. Reach for
bracket access only when the key is dynamic, contains characters that aren't
valid in an identifier, or comes from a `Record<string, ...>` where TypeScript's
strict index-access rules force it.

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

The same applies to imports (use named imports — see above) and array unpacking
when it improves clarity.

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

**When a one-line `if` body wraps to a second line, separate consecutive ifs
with a blank line.** A one-line if where the body had to break (because of the
80-char limit) visually blends into the next statement without a blank line
between them.

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

Two rules here:

**Style: use `/* ... */`, not `//`.** Block-comment syntax for everything —
inline, end-of-line, multi-line, doc-style. Single-line `//` comments are out.

```ts
/* Yes */
/* fallback to legacy parser because the new one chokes on CR-only line endings */
const result = legacyParse(input)

/* No */
// fallback to legacy parser because the new one chokes on CR-only line endings
const result = legacyParse(input)
```

**Content: comments should be rare.** Let names do the explaining — of
variables, functions, classes, modules, and files. When you find yourself
reaching for a comment, take it as a sign that the thing it describes is poorly
named, and rename it instead. Pull an unclear expression out into a well-named
variable, or an unclear block out into a well-named function.

```ts
/* Yes */
const isEligibleForDiscount = user.age >= 65 || user.isVeteran
if (isEligibleForDiscount) applyDiscount(order)

/* No */
/* seniors and veterans get a discount */
if (user.age >= 65 || user.isVeteran) applyDiscount(order)
```

Write a comment only for what no name can carry: the _why_ behind a hidden
constraint, a subtle invariant, or a workaround for a known issue. Never narrate
what the code does, and don't reference the current task or PR (that belongs in
commit messages).
