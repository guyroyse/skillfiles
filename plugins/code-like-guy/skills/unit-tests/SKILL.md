---
name: unit-tests
description:
  Guy Royse's approach to unit tests — what to test (the permutations, with
  zero, one, and many, where three is the smallest many), arrange/act/assert
  with one conceptual assertion per test, names that read as sentences
  (describe, context, it; never "should"; underscores between words), test
  doubles for dependencies, and named constants for test data. Use this skill
  whenever writing, editing, or reviewing unit tests for Guy in any language or
  framework, including when an agent writes tests on his behalf. Use it together
  with code-like-guy:style and the skill for the language, if there is one.
---

# Guy's Unit Tests

This skill covers how Guy writes unit tests in any language. Everything here
holds whatever the language and framework. Map each idea onto the tools the
project uses.

**Call them what the framework calls them.** In RSpec-style frameworks, they're
specs. Elsewhere, they're tests. This skill says "tests" throughout, but in
code, file names, and reports, use the framework's word.

How the code in a test reads — names, comments, layout — comes from
**code-like-guy:style** and the skill for the language. This skill covers what a
test checks and how it's put together.

## The project decides the tools

Use the test framework, file layout, and helpers the project already has. Find
them from the existing tests and build files. Don't introduce a new framework or
move existing tests to match a preference. If there are no tests and no
framework at all, as in some legacy code, say so instead of picking one.

When the project hasn't chosen, Guy has two preferences:

- **RSpec-style syntax,** where a framework for it exists: nested blocks that
  describe the subject and its context, as in _Naming specs_ below.
- **Tests kept apart from the source,** in their own files or directory tree,
  unless the language's convention puts unit tests next to the code. Then follow
  the convention.

## What to test

**Test the permutations.** Before writing tests, list what varies a unit's
behavior: each argument, each distinct thing a dependency can return or throw,
and any state left by earlier calls. Each of those has a handful of cases that
matter. Test each case, and where cases from different dimensions affect each
other, test their combinations.

When the combinations grow too many to test, the unit is doing too much. Say so,
rather than testing a sample and hoping. See code-like-guy:design.

**Zero, one, and many.** For anything that can vary in count — a collection, a
repetition, a number of calls — test zero, one, and many. **Three is the
smallest many.** Two can hide bugs that treat "the first" and "the last" as the
only cases.

Cover the rest of each dimension too:

- **Boundaries.** For every comparison, test the boundary itself and the values
  on either side of it.
- **Empty, missing, and malformed input.** Null or none, empty strings and
  collections, zero, negative numbers, the wrong shape.
- **Errors.** What's raised, thrown, or returned on failure, and exactly when.
  Error values and result types count as much as exceptions do.
- **Side effects.** What gets written, sent, or called, and also when it
  _doesn't_ happen.
- **State.** How earlier calls change what later calls do.

**Test behavior through the public interface.** Tests call what callers call and
check what callers can see: return values, errors, and calls to dependencies.
Never reach into private state. A refactor that keeps behavior the same
shouldn't break a test. Being able to see private code from a test is no reason
to use it.

## The shape of a test

**Arrange, act, assert.** Each test sets up, does one thing, and checks the
result, in that order, each once. A blank line between the phases makes them
easy to see.

```
test "caps the discount at the subtotal"
  order = create order with AN_ITEM

  discounted = apply discount of 150 to order

  expect discounted total to equal 0
```

**One conceptual assertion per test.** A test checks one behavior, but that
behavior may take more than one line to check. Asserting both the `x` and the
`y` of a returned coordinate is one assertion. So is comparing a returned data
structure against an example of what it should be, as long as the whole
structure is the behavior under test. Two unrelated outcomes, like a return
value and a separate side effect, are two tests.

**Assert exactly.** Exact values, specific error kinds, the relevant parts of
messages. A truthiness or type check passes for most wrong answers too.

**Keep logic out of tests.** No loops or conditionals. A test with logic can be
wrong in ways nobody tests. To run one behavior over several inputs, use the
framework's parameterized tests. If it has none, write separate tests.

## Naming tests

**A test's name reads like a sentence** about what the subject does: "it reads
the data," "it returns zero." Name the behavior, not the method ("test
cartTotal") and not a hope ("works").

**Never use "should."** "It should return zero" hedges about something the test
proves. "It returns zero" states it.

**Describe the subject, give it a context, list what it does.** Where tests can
nest, the outer block names the subject, each context puts it in a state, and
the tests inside list what it does in that state:

```
describe cart
  context when_it_is_empty
    it returns_zero_as_its_total
    it has_no_items
  context when_it_holds_three_items
    it returns_the_sum_of_their_prices
    it lists_them_in_the_order_they_were_added
```

Read from the outside in, each test is a sentence: "cart, when it is empty,
returns zero as its total." Read down a context, the tests are a list of what
the subject does in that state. Start contexts with "when," "with," or
"without," and start tests with a verb.

**When the names can't nest,** carry the same sentence some other way. Use
nested classes or modules for the subject and context if the framework allows
them. Otherwise, put the context at the front of the test's name, followed by
what the subject does:

```
When_The_Cart_Is_Empty_It_Has_No_Items
When_The_Cart_Is_Empty_It_Returns_Zero_As_Its_Total
When_The_Cart_Holds_Three_Items_It_Lists_Them_In_The_Order_They_Were_Added
When_The_Cart_Holds_Three_Items_It_Returns_The_Sum_Of_Their_Prices
```

A simple unit may have no contexts at all. Then the name starts with what the
subject does: `It_Returns_The_Sum_Of_Its_Arguments`.

Keep the tests for each context together in the file, so they sit next to each
other visually. With the context at the front, they also stay together in test
output and anywhere else names are sorted.

**Separate the words with underscores** whenever a name has to be an identifier,
even where the language's convention is camel case or Pascal case.
`It_Reads_The_Data` is far easier to read than `ItReadsTheData`, and test names
are long. This is the one place where Guy breaks a language's naming convention
on purpose. Capitalization follows the language: `It_Reads_The_Data` where names
are usually capitalized, `it_reads_the_data` where they're usually lowercase.
Names that are strings are written as plain sentences: `it('reads the data')`.

## Test doubles

**Favor test doubles for a unit's dependencies.** Stubs, fakes, and mocks keep
the test about the unit, not about the code it calls, and keep it fast and
deterministic. A test can only replace a dependency the unit lets it replace, so
how the unit gets its dependencies is a design question as much as a testing
one. See code-like-guy:design. A hand-written fake is often the simplest double.

**Base a double's behavior on the real dependency.** What a stub returns is an
input to the test, and it should be one the real dependency can produce. Read
the dependency's code or its tests to find out what it returns and throws. A
double that does something the real one never would tests a situation that can't
happen.

**Spy on calls, but don't call through.** Checking what a unit sent to a
dependency is good. Letting the spy run the real dependency isn't: the test
stops being a unit test, and picks up the dependency's side effects and
failures. Some spies call the original by default, so check which kind the
framework gives you and give the spy its own behavior.

## Test data

**Define test data in the test file, named for what it is.** Guy's naming
pattern reads like prose: `A_USER`, `ANOTHER_USER`, `A_THIRD_USER`,
`AN_EMPTY_USER`. The casing follows the language's convention for constants.
Where a value can't be a constant, use a function with the same name that
returns a fresh value.

The pattern pairs naturally with zero, one, and many: an empty collection, one
holding `A_USER`, and one holding `A_USER`, `ANOTHER_USER`, and `A_THIRD_USER`.

**Never change shared test data.** A test that mutates shared data breaks every
test that runs after it. Copy it first, make it immutable where the language
allows, or use a function that returns a fresh value.

## Deterministic and independent

- **Control time and randomness.** Fake the clock, seed the random number
  generator, or pass the values in.
- **No real network, filesystem, database, or hardware.** Those belong in
  integration tests.
- **No reliance on order.** Every test sets up what it needs and passes when run
  alone.

## Property-based tests

Use them only if the project already does. They generate many inputs from rules
and check that a property holds for all of them, which is good for invariants
("sorting never changes the length") and poor for specific outcomes.

- **Fix the seed,** so every run tries the same inputs. Random runs find bugs at
  random times, often in someone else's build.
- **Keep the example tests.** A property test adds to the zero, one, and many
  cases. It doesn't replace them.
- **When a property test finds a failure,** add the failing input as an ordinary
  example test, so it's tested every run no matter what seed is used.
