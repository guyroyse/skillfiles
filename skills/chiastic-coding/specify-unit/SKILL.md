---
name: specify-unit
description: Turn a spec's requirements for a single unit of code into tests, with every expected value taken from the spec and never from running the code. In red mode it writes failing tests for new or changed behavior, updates characterization tests the spec intentionally changes, stubs any new signatures, and confirms each test fails for the right reason. In gaps mode it closes spec-determined gaps from `assess-tests` after implementation. Use this whenever a caller (an orchestrating agent or a human) has a spec for a unit and needs the tests that define "done" before or after someone implements it. Never implements behavior, and reports questions rather than guessing.
---

# Specify Unit

This skill writes the tests that say what a unit _should_ do. It's the opposite of characterization. Characterization observes the code and records what it does. Specification reads the spec and states what the code must do, whether or not the code does it yet.

It never implements behavior. Someone else (usually `implement-unit`, in a separate context) makes the tests pass. Keeping the two apart means the tests aren't shaped by an implementation, and the implementation can't quietly reshape the tests.

## Inputs

Required:

- **Unit:** the source file, plus a symbol or line range, or "new" if the unit doesn't exist yet.
- **Test file:** where the new tests go.
- **Test command:** a command that runs the unit's tests and exits with status 0 when they pass.
- **Requirements:** the spec's requirements, each with an ID (`R1`, `R2`, …).

Optional:

- **Mode:** `red` (the default) or `gaps`. See _Workflow_.
- **Intent, Examples, Contracts, Out of scope:** the rest of the spec. Read all of it. Expected values come from here as much as from the requirements.
- **Characterization tests:** tests written to pin the unit's behavior before the change. Needed in red mode to reconcile them.
- **Gaps:** in gaps mode, the gaps to close, each tied to a requirement.
- **Example test file:** an existing test file whose style to follow.
- **Writable paths:** defaults to the test file. In red mode, the unit's source file is also writable, but only for stubs (see step 3).
- **Readable context:** additional files to read for types and collaborators.

If a required input is missing, or a path or symbol doesn't resolve, stop and report `invalid_input`.

## Ground rules

- **Expected values come from the spec.** The requirements, examples, intent, and contracts. Never derive an expected value by running the code or by reading the implementation. If the spec doesn't settle a value, that's a question, not a judgment call.
- **Don't implement.** Stubs have no behavior. If you find yourself making a test pass, stop.
- **Don't ask questions mid-task.** The caller may be an agent that can't answer. When you need an answer, stop and report `needs_clarification` with specific questions and whatever you've written so far.
- **Stay inside the writable paths.** If a test can't be written without touching another file, report `blocked`.

## Workflow

### Red mode

#### 1. Reconcile

Some requirements intentionally change behavior that characterization pinned. Find the characterization tests that assert behavior a requirement changes. Those tests are about to become wrong, on purpose.

Update each one to assert the new behavior the spec requires, and remove its characterization marking, since it now records intent rather than history. Every updated test must trace to a requirement. List each one in the report, with the old and new expected behavior, so the behavior change is visible to whoever reviews it.

Leave every other characterization test as it is. Those are the safety net for the behavior that isn't supposed to change.

If a suspected bug from characterization lies in behavior a requirement touches, note it in the report. Update its test only if a requirement actually calls for the fixed behavior.

#### 2. Specify

Write tests for every requirement. For each requirement:

- Test the behavior it describes, including the spec's examples.
- Derive edge cases from the requirement's own boundaries. If R1 says "never exceeds the subtotal," test just below, exactly at, and just above.
- Name each test after the behavior it verifies, and trace it to its requirement in whatever way fits the project's conventions (the test name, a describe block, a tag, or a comment).

Requirements that preserve behavior ("discounts at or below the subtotal behave exactly as they do today") may already be covered by characterization tests. Reference those instead of duplicating them.

If writing a test requires deciding something the spec doesn't settle (what happens at a boundary, which error to throw, how to handle an input the requirements don't mention), stop and report `needs_clarification`.

#### 3. Stub

The tests need to load before they can fail on their assertions. If the unit is new, or the tests call signatures that don't exist yet, add stubs to the source: the declared signatures, matching the contracts, with bodies that do nothing meaningful (throw "not implemented," or return a placeholder that no requirement accepts). Touch nothing else in the source.

#### 4. Red

Run the test command and confirm the tests fail **for the right reason**: an assertion failure showing the behavior is missing. A compile error, import error, or missing symbol is the wrong reason. It means the tests are failing before they've checked anything. Fix the test or the stub until every failure is an assertion failure.

Check each group of tests:

- **Tests for new or changed behavior** (including reconciled characterization tests) should fail. If one passes, the behavior may already exist, or the test may be too weak to fail. Look at which it is. Strengthen a weak test, or note in the report that the requirement was already satisfied.
- **Tests for preserved behavior** and untouched characterization tests should pass. If one fails, a stub broke something. Fix the stub.

### Gaps mode

After implementation, `assess-tests` may find behavior that a requirement determines but no test verifies. For each gap:

1. Work out the expected outcome from the spec, never from the implementation.
2. Write the test, traced to its requirement, following the same rules as red mode.
3. Run it.

These tests are expected to pass, because the implementation should already do what the spec says. A test that fails here is a **defect**: the implementation disagrees with the spec. Don't change the test to match the code. List it under _Failing tests_ so the caller can send it back to the implementer.

If a gap turns out not to be determined by the spec after all, don't write a test for it. List it under _Spec gaps_.

## Writing the tests

- **Match the project.** Use the example test file's framework, structure, naming, and helpers.
- **Test through the public interface.** Assert on return values, thrown errors, and effects on collaborators, never on private state or internal structure.
- **One behavior per test,** named for the behavior ("caps the discount at the subtotal"), not the method. Parameterized tests are fine for one behavior across many inputs.
- **Assert exactly.** Exact values, specific error types, the relevant parts of messages. Truthiness and type checks let mutants survive.
- **Keep tests deterministic and independent.** Control time and randomness. No real network or filesystem, and no reliance on test order.
- **Use real collaborators when they're cheap and deterministic,** and test doubles at I/O boundaries. Verify interactions only when the interaction itself is the requirement.
- **Keep logic out of tests.** Loops and conditionals in tests can be wrong too.
- **Use property-based tests only where a requirement states an invariant,** and only if the project already uses a property-testing library. Don't introduce one.

## Report format

Always use this structure.

```markdown
# Specification: <spec title or file#symbol>

**Status:** completed | invalid_input | needs_clarification | blocked | error
**Mode:** red | gaps

## Summary

Two to four sentences: how many tests were written, whether every
requirement is covered, and anything the caller most needs to know.

## Requirements

- **R1:** <test names that verify it>

## Behavior changes

- <reconciled test>: was <old behavior>, now <new behavior> (R<n>)

## Red results

- Failing for the right reason: <n> tests
- Already passing: <test name>: <requirement already satisfied | strengthened>

## Stubs

- <file>: <signatures added>

## Failing tests

- <test name> (R<n>, G<n>): <what the spec requires, and what the code does instead>

## Spec gaps

- <behavior the spec doesn't determine, and where it came up>

## Questions

- <specific question the caller needs to answer>

## Notes

Anything else: suspected bugs in touched behavior, things noticed outside scope.
```

Omit sections that are empty. _Red results_ and _Stubs_ apply only to red mode, and _Failing tests_ only to gaps mode. For `needs_clarification`, include _Questions_ plus the tests written so far, so the caller can answer and re-dispatch without starting over. For `invalid_input`, `blocked`, and `error`, include the title, the status, and a **Reason** section.
