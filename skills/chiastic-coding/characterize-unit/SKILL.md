---
name: characterize-unit
description: Write characterization tests that pin down the current behavior of an existing unit of code. Use this whenever a caller (an orchestrating agent or a human) needs a safety net around existing code before modifying, refactoring, migrating, or upgrading it, wants to cover legacy or under-tested code, or has a gap list from `assess-tests` to close. Works from a gap list when given one, and otherwise surveys the whole unit. Records what the code does, not what it should do, observes every expected value by running the code, and flags suspected bugs without fixing them.
---

# Characterize Unit

A characterization test records what code _currently does_, so that any later change in behavior makes a test fail. It makes no claim that the behavior is correct. That distinction drives everything in this skill: you are documenting the code as it is, including its bugs, so that whoever changes it next knows exactly what they changed.

This skill writes the tests. It doesn't decide whether the tests are now sufficient. That's what `assess-tests` is for, and a caller that wants sufficient tests runs the two in a loop: assess, characterize the gaps, assess again.

## Preconditions

The caller has already defined the unit and sized it appropriately. Don't narrow the scope, and don't second-guess the unit's boundaries.

## Inputs

Required:

- **Unit:** the source file, plus either a symbol (function, class, module) or a line range.
- **Test file:** where the characterization tests go. It can be an existing test file or a new one.
- **Test command:** a command that runs the unit's tests, including the test file above, and exits with status 0 when they pass.

Optional:

- **Gaps:** a gap list from `assess-tests` (or a caller-written list in the same shape). If given, pin exactly these behaviors. If absent, survey the whole unit.
- **Existing tests:** test files that already cover the unit. Read them to learn the project's conventions and to avoid duplicating behavior that's already pinned.
- **Label:** how to mark the tests. `characterization` (the default) for behavior that predates the current change. `unspecified` for new behavior that a spec didn't determine, pinned so it's visible to a human reviewer rather than silently untested.
- **Writable paths:** the files this skill may modify. Defaults to the test file only. The unit's source is writable only if it's explicitly listed (see _Seams_).
- **Readable context:** additional files to read for understanding types and collaborators.

If a required input is missing, or a path or symbol doesn't resolve, stop and report `invalid_input`. Don't go looking for substitutes.

## Workflow

### 1. Baseline

If the unit has at least one test (the test file exists and has tests, or existing tests were given), run the test command before writing anything. If it fails, stop and report `baseline_failed` with the relevant output. Characterizing on top of failing tests produces a safety net with holes you can't see.

If there are no tests yet, skip this step. Many test runners exit non-zero when they find nothing to run, and that isn't a failure.

### 2. Decide what to pin

**With a gap list:** each gap is one behavior to pin. Read the unit and the existing tests to understand the condition the gap describes. For a `weak_assertion` gap, the fix is a new test that pins the behavior exactly, not an edit to the existing test. Existing tests belong to someone else.

**Without a gap list:** read the unit and any existing tests, then list the behaviors to pin. Cover the unit's entire public surface:

- every public function, method, or entry point
- every branch you can reach through that surface
- boundaries: zero, one, many, empty, maximum, and the values on either side of every comparison
- null, missing, and malformed input
- error paths: what's thrown or returned, and under which conditions
- side effects on collaborators: what gets written, sent, called, or mutated

Note which of these the existing tests already pin, and skip them.

Either way, reading the code tells you _what to probe_. It doesn't tell you _what the answer is_. That comes from the next step.

### 3. Probe and pin

For each behavior, find out what the code actually does by **running it**, never by predicting the result from reading the source. Agents and humans both misread code, and a characterization test built on a misreading pins a behavior the code doesn't have. That's worse than no test, because it looks like coverage.

The standard technique:

1. Write the test with a deliberately wrong expected value.
2. Run it.
3. Read the actual value from the failure message.
4. Put the actual value in the assertion, and run it again to see it pass.

For thrown errors, observe the error type and message the same way. For complex output, it's fine to probe with a scratch script or REPL first, but the final assertion must come from observed output, and scratch files must not be left behind.

If the project already uses snapshot or approval testing, it suits large or complex outputs (generated documents, big structures). Otherwise, assert on the specific values.

### 4. Flag suspected bugs

Sometimes the observed behavior looks wrong: a negative discount that raises the total, an off-by-one in a range, an error swallowed silently. **Pin it anyway, and don't fix it.** Fixing a bug changes behavior, and whether to change behavior is a decision for whoever owns the spec, not for this skill.

Name the test after what the code actually does ("adds to the total when the discount is negative"), add a short comment marking it as a suspected bug, and list it in the report.

### 5. Verify

Run the test command until everything passes. Then run it a second time. Characterization tests that pass on one run and fail on the next are pinning something nondeterministic (see _Seams_), and they'll erode trust in the safety net.

### 6. Report

Write the report (format below), and confirm that only writable paths changed and no scratch files remain.

## Seams

Some behavior can't be pinned until the test controls an outside influence: the current time, randomness, the filesystem, the network, environment variables, or a slow or stateful collaborator.

Work through these options in order:

1. **Use what the unit already offers.** Constructor parameters, injected dependencies, optional arguments, configuration.
2. **Use the test framework's tools.** Fake timers, module mocking, seeded randomness, temp directories. These require no source changes.
3. **Make a minimal seam in the source**, only if the source file is in the writable paths. Keep it to the smallest behavior-preserving change, such as extracting a parameter with a default that preserves the current behavior, or wrapping a static call. Confirm the baseline tests still pass afterward, and list the change in the report.
4. **Otherwise, report `blocked`.** Explain which behavior couldn't be pinned and what seam would be needed. Don't change files outside the writable paths, and don't quietly skip the behavior.

If a behavior is inherently nondeterministic and can't be controlled, pin the properties that _are_ stable (a value's range, a result's shape, an ordering guarantee) and note the limitation.

## Writing the tests

- **Match the project.** Use the framework, file structure, naming, and helpers of the existing tests. If there are no existing tests, follow the language's common conventions.
- **Mark them by label,** using the project's convention if there is one. Otherwise, group them under a block or tag named for the label ("characterization" or "unspecified behavior"). Future readers need to know these record current behavior, not intent.
- **Test through the public interface.** Assert on return values, thrown errors, and effects on collaborators, never on private state or internal structure. A refactor that preserves behavior shouldn't break these tests.
- **One behavior per test,** named as a statement of fact about current behavior ("returns an empty list when no items match"). Parameterized tests are fine for one behavior across many inputs.
- **Assert exactly.** Exact values, specific error types, the relevant parts of messages. Truthiness checks and type checks let mutants survive.
- **Keep tests deterministic and independent.** No real network or wall-clock time, and no reliance on test order.
- **Use real collaborators when they're cheap and deterministic,** and test doubles at I/O boundaries. Verify interactions only when the interaction itself is the behavior.
- **Keep logic out of tests.** Loops and conditionals in tests can be wrong too.

## Report format

Always use this structure.

```markdown
# Characterization: <file>#<symbol or lines>

**Status:** completed | invalid_input | baseline_failed | blocked | error

## Summary

Two to four sentences: how many tests were added, whether every gap was
closed, and anything the caller most needs to know (suspected bugs, blockers).

## Tests added

In <test file>:

- <test name> (G<n>, if working from gaps): <behavior pinned>

## Gaps not closed

- G<n>: <why it couldn't be pinned>

## Suspected bugs

- <test name>: <what the code does, and why it looks wrong>

## Seam changes

- <file:line>: <the change, and why it was needed>

## Notes

Anything else: behaviors pinned only partially, limitations from
nondeterminism, gaps that turned out to be already pinned.
```

Omit sections that are empty. For `invalid_input`, `baseline_failed`, `blocked`, and `error`, include the title, the status, and a **Reason** section. For `blocked`, also include the tests that were written before the block, so the caller can keep them.
