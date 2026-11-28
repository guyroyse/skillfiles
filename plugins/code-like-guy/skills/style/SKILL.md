---
name: style
description: >-
  Guy Royse's general coding style — how code reads in any language: his rule of
  three for arguments, steps, and dependencies; naming; comments; and file
  layout. Use this skill whenever writing, editing, refactoring, or reviewing
  code for Guy, in any language. For a language with its own skill, such as
  code-like-guy:typescript, use both; the language skill covers syntax and
  idioms. When designing or restructuring how pieces fit together, also use
  code-like-guy:design. Inspired by Clean Code, but these are Guy's versions of
  the ideas, not the book's.
---

# Guy's Coding Style

This skill covers how Guy's code reads in any language: how big functions and
classes get, how things are named, and what deserves a comment. The syntax and
idioms of a specific language live in its own skill —
**code-like-guy:typescript** for TypeScript. How the pieces of a codebase fit
together — dependencies, duplication, abstraction, and architecture — lives in
**code-like-guy:design**.

These principles come from _Clean Code_, filtered through Guy's experience.
Where this skill and the book disagree, this skill wins.

Code is read by people — Guy, his reviewers, whoever maintains it next — and by
agents that start every session knowing nothing about the codebase. Write for
those readers. A large context window is no reason to write larger functions or
classes.

## The rule of three

Most people can reason about three things at once. Guy sizes code to fit:

- **No more than three arguments** to a function. Needing more is a sign that
  the function does too much, or that some of the arguments belong together as
  one thing.
- **No more than three dependencies** for a function or class — the other
  functions or classes it has to know about to do its job. A class uses at most
  three other classes.
- **About three steps per function**: a beginning, a middle, and an end — set
  up, do the work, produce the result. This is what Clean Code's "three to five
  lines" really means. Count steps, not lines. When a function has more steps
  than that, pull some of them out into well-named functions.

```ts
/* Yes: three steps */
function placeOrder(cart: Cart, customer: Customer): Order {
  const order = createOrder(cart, customer)
  chargeCustomer(customer, order.total)
  return saveOrder(order)
}
```

Three is a guide, not a hard limit. Exceed it only when splitting would make the
code harder to follow, not just to save effort.

Splitting a function up is not the same as removing duplication across it. For
when to pull repeated code into a shared abstraction, see code-like-guy:design.

## Naming

- **Names do the explaining.** A name should say what a thing is for, so the
  reader doesn't need anything else.
- **No abbreviations.** `object`, not `obj`; `error`, not `err`; `request`, not
  `req`; `response`, not `res`. The few characters saved aren't worth the effort
  of decoding them.
- **The abbreviation test: would it take a period in prose?** "Obj." and "req."
  would, so they're out. `config`, `app`, `arg`, and `param` wouldn't — they're
  words in their own right, so they're fine. Acronyms like `tcp`, `http`, and
  `url` are fine too. They aren't abbreviations of words; they _are_ the words.
- **Booleans need no `is` or `has` prefix.** Sometimes one reads well, sometimes
  a plain noun phrase does. Use whichever reads more clearly.
- **Name every regular expression.** Assign it to a variable named for what it
  matches or what it's for, never inline it in a call. If you can't think of a
  good name, the regex is doing too much.
- **Names from outside code are used as-is.** Names that come from a platform,
  library, or external API are never rewritten to fit these rules. The rules
  apply to the names you choose, not the ones you consume.

## Comments

- **Comments should be rare.** When you find yourself reaching for a comment,
  take it as a sign that the thing it describes is poorly named. Rename it
  instead. Pull an unclear expression out into a well-named variable, or an
  unclear block out into a well-named function.
- **Comment only what no name can carry:** the _why_ behind a hidden constraint,
  a subtle invariant, or a workaround for a known issue.
- **Never narrate what the code does,** and don't mention the current task or
  pull request. That belongs in the commit message.

```ts
/* Yes */
const isEligibleForDiscount = user.age >= 65 || user.isVeteran
if (isEligibleForDiscount) applyDiscount(order)

/* No */
/* seniors and veterans get a discount */
if (user.age >= 65 || user.isVeteran) applyDiscount(order)
```

## Files

- **Lay files out top-down,** by what the reader cares about first: imports,
  types, constants, the main implementation (the thing the file is about), then
  the helpers it uses.
- **Group by cohesion, not by mechanical rules.** A small type used by only one
  function belongs in that function's file. When a file grows large or starts
  serving distinct concerns, split it.

## Money

Never hold money in a binary floating-point type. Values like `0.58` can't be
represented exactly, so arithmetic on them drifts, and rounding turns the drift
into wrong cents. Use the language's decimal type, a money library, or integers
in the currency's smallest unit, such as cents. The language skill says which.

## IDs

Generate unique IDs as [ULIDs](https://github.com/ulid/spec), not UUIDs. ULIDs
sort by creation time and read more compactly. When a project or an external
system already uses UUIDs, stick with them.
