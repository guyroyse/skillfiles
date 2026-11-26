# Naming

Detailed examples for the naming rules in [SKILL.md](../SKILL.md).

## Naming

The base conventions are standard:

- **Variables, functions, parameters, properties**: `camelCase`
- **Classes, types, enum names**: `PascalCase`
- **True constants and enum members**: `SCREAMING_SNAKE_CASE` ("yelly case")
- **File names**: `kebab-case`, always lowercase, no exceptions
  (`tcp-processor.ts`, not `TCPProcessor.ts` or `tcpProcessor.ts`)

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

### Booleans

No mandatory prefix. Sometimes `is`/`has` reads well, sometimes a natural
noun-phrase does. Pick whichever reads more clearly in context.

### No abbreviations

Spell identifiers out. `object`, not `obj`. `record`, not `rec`. `error`, not
`err`. `request`, not `req`. `response`, not `res`. The few characters saved
aren't worth the cognitive tax of decoding short forms — and modern editors
autocomplete the full word in a keystroke or two anyway. Use established
acronyms (`tcp`, `http`, `url`, `id`) — those aren't abbreviations of words,
they _are_ the words.
