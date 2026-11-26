# Types, Classes, and Errors

Detailed examples for the type-system, class, error-handling, and `null` rules
in [SKILL.md](../SKILL.md).

## Contents

- Type system
- Classes
- `null` over `undefined`
- Error handling

## Type system

### `type` over `interface`

Prefer `type` for almost everything — object shapes, unions, intersections,
aliases, mapped types. Use `interface` only when you genuinely need declaration
merging (rare). A consistent `type X = ...` form reads more uniformly than
mixing the two for shallow reasons.

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

- **`unknown`** for data crossing a trust boundary (parsed JSON, third-party
  callbacks, error catches). Narrow before use.
- **`any`** is rare. Reach for it only as a deliberate escape hatch where the
  alternative is fighting the type system for no real safety gain. When you do
  use it, a comment explaining why is welcome.
- **`never`** for exhaustiveness checks and impossible states, as standard.

### Type-system idioms

Use whatever idiom fits the situation — discriminated unions, `as const`,
`satisfies`, branded types, conditional types. Don't force any of these as a
house style; reach for them when they're the right tool. Idiomatic, readable
TypeScript is the goal, not type-level pyrotechnics.

## Classes

### Private members use `#`, not `private`

The `#name` private-field syntax is the preferred way to declare class-private
state. The `private` keyword is a compile-time-only check; `#` is genuine
runtime privacy and reads cleaner. Reserve `private` for cases where `#` can't
work:

- The compile target is below ES2015, which TypeScript can't downlevel `#` to.
- The object gets wrapped in a `Proxy`. Methods called through the proxy can't
  reach `#` fields and throw.
- A framework or library needs to see the field, such as a decorator, an ORM, or
  a serializer that reflects on properties.

```ts
/* Yes */
class Connection {
  #socket: Socket
  #isOpen = false

  constructor(socket: Socket) {
    this.#socket = socket
  }

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

### Declare fields in the class body

Don't use TypeScript's parameter property shorthand (where the constructor
signature declares fields by adding modifiers). It's compact but it hides the
field list. Declaring members in the class body makes the shape of the class
obvious at a glance.

A field with a fixed starting value gets an initializer on its declaration
(`#isOpen = false`). A field whose value comes from the caller is assigned
explicitly in the constructor.

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

## `null` over `undefined`

`null` is the preferred way to represent "intentionally nothing." `undefined`
means "missing" or "not yet set" — a different semantic.

- Return `null` from a function that explicitly _could not produce a value_.
- Leave `undefined` for things like uninitialized fields, missing optional
  parameters, or optional object properties.

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

When the language forces `undefined` (optional parameters, optional properties),
that's fine — don't fight it. The rule is about _deliberate_ absences in return
values and assignments.

The same goes for built-ins that return `undefined` when nothing is found, like
`Array.find` and `Map.get`. Not found is what `undefined` means, so pass the
result through as-is rather than converting it with `?? null`.

```ts
/* Yes */
function findActiveUser(users: User[]): User | undefined {
  return users.find(user => user.isActive)
}

/* No */
function findActiveUser(users: User[]): User | null {
  return users.find(user => user.isActive) ?? null
}
```

## Error handling

Throw exceptions. Use standard `try`/`catch`. Don't introduce `Result`/`Either`
types or other functional error-handling machinery unless the codebase already
uses them.

```ts
function parseConfig(raw: string): Config {
  const config: unknown = JSON.parse(raw)
  if (!isValidConfig(config)) throw new Error('invalid config')
  return config
}
```
