---
name: style
description: >-
  Guy Royse's general coding style — the principles that hold in any language:
  his rule of three, how much duplication to tolerate and when to abstract,
  objects versus data structures, naming, comments, and file layout. Use this
  skill whenever writing, editing, refactoring, designing, or reviewing code for
  Guy, in any language. For a language with its own skill, such as
  code-like-guy:typescript, use both; the language skill covers syntax and
  idioms. Inspired by Clean Code, but these are Guy's versions of the ideas, not
  the book's.
---

# Guy's Coding Style

This skill covers how Guy shapes code in any language: how big things get, when
to remove duplication, how to name things, and what deserves a comment. The
syntax and idioms of a specific language live in its own skill —
**code-like-guy:typescript** for TypeScript. When a language skill exists, use
both.

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
- **No more than three dependencies** for a function, class, or module — the
  collaborators it has to know about to do its job.
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

## Duplication and abstraction

- **Tolerate a little duplication.** Wait for three examples before removing it.
  Two examples aren't enough to show what the pattern actually is. The third
  shows what really varies and what stays the same.
- **Bad abstractions are far worse than duplicated code.** Duplication costs
  some typing and some care when changing things. A wrong abstraction bends
  every caller to fit it and is hard to back out of.
- **Don't write ARID code.** ARID stands for "ARID Really Isn't DRY": code
  that's been de-duplicated so hard it's unintelligible. When removing
  duplication makes the code harder to read, put the duplication back.
- **Don't abstract away the performance.** Layers of indirection have a cost.
  When abstraction makes code meaningfully slower, the abstraction is wrong.
- **Look before you write.** Before writing a helper, search the codebase for
  one that already exists. Duplicating code you didn't know about isn't the same
  as tolerating duplication on purpose.

## Objects and data structures

There are two different ways to model things, and they solve different problems:

- **Objects** hide their data and expose behavior. Adding a new kind of thing is
  easy; adding a new operation across all of them is hard.
- **Data structures** expose their data and have no behavior. Functions operate
  on them. Adding a new operation is easy; adding a new kind of thing is hard.

Pick the one that fits the problem, and don't mix the two in one type. An object
with getters and setters for all its data is a data structure pretending to be
an object.

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

## IDs

Generate unique IDs as [ULIDs](https://github.com/ulid/spec), not UUIDs. ULIDs
sort by creation time and read more compactly. When a project or an external
system already uses UUIDs, stick with them.
