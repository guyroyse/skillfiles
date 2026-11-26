# Naming

Detailed examples for the naming rules in [SKILL.md](../SKILL.md).

## Contents

- Naming: the base conventions
- C-style constants
- The acronym rule
- `ID`
- Names from outside code
- Booleans
- No abbreviations

## Naming

The base conventions are standard:

- **Variables, functions, parameters, properties**: `camelCase`
- **Classes, types, enum names, React components**: `PascalCase`
- **C-style constants and enum members**: `SCREAMING_SNAKE_CASE` ("yelly case")
- **File names**: `kebab-case`, always lowercase, no exceptions
  (`tcp-processor.ts`, not `TCPProcessor.ts` or `tcpProcessor.ts`). React
  component files too: `UserCard` lives in `user-card.tsx`.

Code examples in this skill are inside a function unless they say otherwise.

### C-style constants

A `const` outside any class or function that holds a fixed value — a literal, a
regex, a lookup table — is yelly case. Inside a class or function, a `const`
follows the ordinary rules, even when it holds the same kind of value.

```ts
/* Yes */
const MAX_ATTEMPTS = 3
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_OPTIONS = { maxAttempts: MAX_ATTEMPTS, baseDelay: 100 }

function retry(task: () => Promise<void>) {
  const startTime = Date.now()
  ...
}

/* No */
const maxAttempts = 3 /* module level: should be MAX_ATTEMPTS */

function retry(task: () => Promise<void>) {
  const START_TIME = Date.now() /* inside a function: should be startTime */
  ...
}
```

### The acronym rule (the distinctive one)

When a run of uppercase letters from an acronym sits **inside** an identifier
and is followed by another word that starts with an uppercase letter, separate
them with an underscore. This disambiguates where the acronym ends and the next
word begins.

The rule has four positional cases:

**1. Acronym in the middle, followed by another capitalized word → trailing
underscore**

```ts
const myTCP_Port = 8080
class CustomTCP_Processor {}
const myHTTP_URL_Handler = ... /* two acronyms back-to-back: underscores between each */
```

**2. Acronym at the start of a camelCase identifier → all lowercase, no
underscore**

Because the identifier starts lowercase, there's no ambiguity to resolve.

```ts
const tcpAddress = '10.0.0.1'
const httpURL_Handler = ... /* first acronym lowercased; second is mid-identifier so gets the underscore */
function tcpConnect() {}
```

**3. Acronym at the start of a PascalCase identifier (class/type/enum) →
uppercase, underscore before next word**

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

### `ID`

When it means "identification" — the word that's written ID in English — `ID`
follows the acronym rule.

```ts
/* Yes */
const userID = ulid()
const userID_Map = new Map<string, User>()
const idGenerator = createGenerator()
class ID_Generator {}

/* No */
const userId = ulid()
class IdGenerator {}
```

A bare `id`, such as a field or parameter, stays lowercase — it's a camelCase
identifier that starts with the acronym.

### Names from outside code

Names that come from a platform, library, or external API (`innerHTML`,
`toJSON`, `XMLHttpRequest`, a JSON field named `user_id`) are used exactly as
they are. These rules apply to the names you choose, not the ones you consume.

### Booleans

No mandatory prefix. Sometimes `is`/`has` reads well, sometimes a natural
noun-phrase does. Pick whichever reads more clearly in context.

### No abbreviations

Spell identifiers out. `object`, not `obj`. `record`, not `rec`. `error`, not
`err`. `request`, not `req`. `response`, not `res`. The few characters saved
aren't worth the cognitive tax of decoding short forms — and modern editors
autocomplete the full word in a keystroke or two anyway.

The test for an abbreviation: would it take a period in prose? "Obj." and "req."
would, so they're out. `config`, `app`, `arg`, and `param` wouldn't — they're
words in their own right, so they're fine. Established acronyms (`tcp`, `http`,
`url`, `ID`) are fine too — those aren't abbreviations of words, they _are_ the
words.
