---
name: design
description: >-
  Guy Royse's approach to software design — how the pieces of a codebase fit
  together: dependency limits, when to remove duplication and when an
  abstraction is wrong, objects versus data structures, SOLID, and keeping I/O
  out of business logic. Use this skill whenever designing, structuring, or
  restructuring code for Guy in any language: creating modules, classes, or
  services; extracting shared code; choosing how components depend on each
  other; planning a refactor; or reviewing a design. Use it together with
  code-like-guy:style, which covers how the code itself reads.
---

# Guy's Software Design

This skill covers how Guy fits the pieces of a codebase together: what depends
on what, when to abstract, and where the I/O goes. How the code itself reads —
naming, comments, function size — lives in **code-like-guy:style**. Use both.

These principles come from _Clean Code_ and the ideas around it, filtered
through Guy's experience. Where this skill and the book disagree, this skill
wins.

## The rule of three, at scale

Most people can reason about three things at once. Code-like-guy:style applies
that to functions; it applies to design too:

- **A class uses no more than three other classes.**
- **A module or service depends on no more than three others.**

When something needs more, the problem is usually a boundary in the wrong place,
not just a unit that needs splitting. Look for collaborators that always travel
together and belong behind one boundary, or for a responsibility that belongs
somewhere else.

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

## SOLID

Apply SOLID where practical:

- **Single responsibility, open/closed, and Liskov substitution matter most.**
- **Interface segregation** rarely comes up.
- **Dependency inversion depends on the language.** It's worth it in Java, C#,
  and similar languages, and in large or complex JavaScript and TypeScript
  codebases. Elsewhere, a factory or a singleton is fine. Create singletons
  lazily, on first use rather than at import time, and give tests a way to reset
  them.

## Changing existing code

Keep every change scoped to the work being done. When fixing a bug or adding a
feature to existing code, especially legacy code, change only what the work
needs, even when the code around it breaks every rule here. A refactor nobody
asked for makes the change harder to review, and puts behavior at risk that the
work never meant to touch.

Restructuring is its own piece of work, done when it's the stated goal, with
tests in place first. When code needs it, say so, and leave the decision to
whoever owns the code.

## Architecture

### Functional core, imperative shell

Where code has real business logic, keep the decisions pure and push the I/O to
the edges:

- **The core** takes data and returns data. It makes the decisions — what to
  charge, whether an order is valid, what to send — and never touches a
  database, the network, the clock, or a random number generator.
- **The shell** is thin. It gathers the inputs, calls the core, and carries out
  what the core decided. It makes as few decisions as possible.

```ts
/* core: pure, nothing to inject or mock */
export function planOrder(
  cart: Cart,
  customer: Customer,
  stock: Stock
): OrderPlan {
  ...
}

/* shell: fetch, decide, act */
export async function placeOrder(cart: Cart, customer: Customer) {
  const stock = await loadStock(cart)
  const plan = planOrder(cart, customer, stock)
  return carryOut(plan)
}
```

The core is tested with plain data in and data out. The shell has few branches
and needs only a handful of integration tests. Because the core never does I/O,
it can't depend on infrastructure, which gets most of what dependency inversion
offers without the wiring.

When a decision needs I/O partway through, split the core into two pure steps
with the I/O between them in the shell. If that keeps happening, or the code is
mostly I/O with little logic in it — a CRUD endpoint, a sync job — don't force a
core. That's just another layer.

### Ports and adapters

Hexagonal architecture — ports and adapters — lets the core call out through
interfaces it owns, with adapters plugged in from outside. It's the step up from
a functional core when a codebase is big enough that dependency inversion pays
off. Below that size, a functional core gets most of the separation for less.

### Building the object graph

When you do inject dependencies, build everything in one place at startup — the
entry point, such as `main`. Read config there, create the infrastructure, then
create each component and hand it what it needs. Nothing else knows about config
or concrete classes. When the entry point gets long, split it by feature, not by
layer.
