---
name: implement-unit
description: Make a single unit of code's failing tests pass, then refactor, without ever touching the tests. Use this whenever a caller (an orchestrating agent or a human) has a set of failing tests, usually from `specify-unit`, plus the spec they came from, and wants the unit implemented to green. Treats every test file as read-only, codes against the declared contracts, stays inside the writable source files, and reports a dispute rather than working around a test it thinks is wrong.
---

# Implement Unit

This skill takes a unit with failing tests and makes them pass. The tests are the definition of done. They were written from the spec, in a separate context, by someone who couldn't see the implementation. Your job is to satisfy them, not to second-guess them.

That's why **test files are read-only.** Not "edit carefully," but never edit. If a test looks wrong, that's a dispute, and disputes go back to the caller.

## Inputs

Required:

- **Unit:** the source file, plus a symbol or line range.
- **Test command:** a command that runs the unit's tests and exits with status 0 when they pass.
- **Test files:** the files containing the unit's tests. Read them. Never modify them.

Optional:

- **Spec:** the intent, requirements, examples, contracts, and out-of-scope list the tests came from. Read it for context. When the tests and the spec disagree, that's a dispute.
- **Failing tests:** in a fix-up round, the specific tests to make pass, with the reason they fail.
- **Writable paths:** the source files you may modify. Defaults to the unit's source file. Test files are read-only even if they're listed here.
- **Readable context:** additional files to read for types and collaborators.

If a required input is missing, or a path or symbol doesn't resolve, stop and report `invalid_input`.

## Ground rules

- **Never modify a test file.** Not to fix a typo, not to update an import, not to skip a test.
- **Stay inside the writable paths.** If the change can't be made without touching another file, stop and report `blocked` with an explanation. Never edit outside the boundary, even for a one-line fix. Another instance may own that file right now.
- **Code against the contracts as written.** Collaborators may be changing in parallel, so what's on disk may not match what the spec declares. The spec wins. If the contracts make the tests impossible to pass, report `blocked`.
- **Build what the tests need.** No speculative features, no handling for cases nothing asks for, no unrelated refactoring, nothing listed as out of scope. Behavior you add beyond what's tested will be found later, and someone will have to decide whether it should exist.
- **Don't ask questions mid-task.** The caller may be an agent that can't answer. Report instead.

## Workflow

### 1. Read

Read the spec, the tests, and the unit. Run the test command to see the current failures. Note which tests are failing and why.

### 2. Green

Implement the change. Run the test command until everything passes: the new tests, the reconciled tests, and every characterization test.

A failing characterization test means the change altered behavior the spec didn't ask to change. Fix the implementation, not the test.

If a test can't pass, decide why before doing anything else:

- **The implementation is wrong.** Keep going.
- **The test contradicts the spec, the contracts, or another test.** Stop and report `test_dispute`. Name the test, quote the part of the spec it conflicts with, and say what you'd expect instead. Don't work around it with special-case code that recognizes the test's inputs.
- **The test can't pass without changes outside the writable paths.** Report `blocked`.

### 3. Refactor

With everything passing, clean up the implementation if it needs it. Stay within the unit, and run the tests after each change. Skip this step if the code is already clear.

### 4. Finish

Run the test command twice. Both runs must pass. Confirm that only writable source files changed, that no test file changed, and that no scratch files are left behind. Then write the report.

## Report format

Always use this structure.

```markdown
# Implementation: <spec title or file#symbol>

**Status:** completed | invalid_input | test_dispute | blocked | error

## Summary

Two to three sentences: what was implemented and whether everything passes.

## Changes

- <file>: <what changed, in a sentence or two>

## Disputes

- <test name>: <what it asserts, what the spec says, what you'd expect instead>

## Notes

Anything else: refactoring done, behavior added that the tests didn't
strictly require, things noticed outside scope.
```

Omit sections that are empty. For `invalid_input`, `blocked`, and `error`, include the title, the status, and a **Reason** section. For `test_dispute` and `blocked`, also list the changes made so far, so the caller can keep or discard them.
