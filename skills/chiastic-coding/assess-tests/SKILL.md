---
name: assess-tests
description: Decide whether a single unit of code's tests are sufficient, and if not, list exactly what's missing. Checks three things in order of cost (every behavior the code exhibits is verified by a test, code coverage is as near 100% as practical, and mutation testing finds no meaningful survivors) and returns a verdict plus a deduplicated gap list. Use this whenever a caller (an orchestrating agent or a human) needs a go/no-go answer on a unit's test suite, such as before changing existing code, after implementing a change, or when auditing legacy tests. Never writes tests and never leaves changes in the repository.
---

# Assess Tests

This skill answers one question about one unit: **are its tests sufficient?** The tests are sufficient when all of these are true:

- **Every behavior is verified.** Each behavior the unit can exhibit is exercised by a test that asserts its outcome exactly.
- **Coverage is as near 100% as practical.** Every line and branch in the unit is executed by the tests, or there's a concrete reason it can't be.
- **Mutation testing passes.** No mutant survives except ones that are genuinely equivalent.

The answer is a verdict, `sufficient` or `insufficient`, plus a list of gaps. Each gap describes a specific behavior that isn't verified, in enough detail that whoever closes it (usually `characterize-unit` or `specify-unit`) can write the test without re-deriving the problem.

## What this skill does not do

- **It does not write or fix tests.** Closing gaps is the caller's job. Like `mutation-check`, this skill is analysis only, so it's safe to run on code someone else is working on.
- **It does not change the repository.** Coverage and mutation runs happen in an isolated copy or are cleaned up afterward. When the skill finishes, the working tree is exactly as it was.
- **It does not decide expected values.** A gap says _what_ is unverified ("a discount exactly equal to the subtotal"), not what the right answer is. That depends on whether the caller is characterizing or specifying.
- **It does not discover inputs.** If the unit or test command is missing or doesn't resolve, it reports `invalid_input` rather than guessing.

## Inputs

Required:

- **Unit:** the source file, plus either a symbol (function, class, method) or a line range.
- **Test command:** a command that runs the tests covering the unit and exits with status 0 when they pass.

Optional:

- **Test files:** the files containing the unit's tests. If none are given, or none exist yet, the unit has no tests.
- **Requirements:** a list of requirements (for example, `R1`–`R5` from a spec) that the tests must also verify. Pass these when assessing a unit after a spec-driven change.
- **Coverage command:** a command that runs the tests with coverage enabled, plus where it writes its report and in what format (for example, `lcov`, `cobertura`, `json-summary`). If absent, skip the coverage check and say so in the report.
- **Mutation tool command** and **readable context:** passed through to `mutation-check` unchanged.
- **Known equivalents:** mutants already accepted as equivalent in an earlier round. Passed through to `mutation-check`.

## Workflow

### 1. Validate

Confirm the required inputs are present, the file exists, and the symbol or line range resolves. Resolve a symbol to its line range now. If anything is missing or doesn't resolve, stop and report `invalid_input`, saying exactly what was wrong.

**Don't open the test files yet.** The behavior inventory in step 3 has to be made without knowledge of the tests.

### 2. Baseline

If the unit has at least one test, run the test command. If it fails, stop and report `baseline_failed` with the relevant output. Sufficiency is meaningless when the tests don't pass.

If the unit has no tests, skip the baseline. The verdict will be `insufficient`, but still do step 3 so the caller gets a complete list of behaviors to pin. Then skip to step 7.

### 3. Behavior inventory

**Generate.** Spawn a subagent with a fresh context. Give it the full contents of `behavior-agent.md` (in this skill's directory) as its instructions, along with:

- the unit's file path and line range
- the unit's source (the whole file, with the unit's range identified)
- the readable context files, if any

Don't give it the tests, the test file paths, or the requirements. An inventory written by someone who has seen the tests drifts toward listing what's already tested, and an inventory written from the requirements lists what the code _should_ do rather than what it _does_. Behavior the code has but nobody asked for is exactly what this step needs to catch.

If your environment can't spawn subagents, write the inventory yourself by following `behavior-agent.md`, before reading any tests. Note in the report that the inventory was not independent.

**Add requirements.** If requirements were given, add each one to the inventory as its own behavior, keeping its ID (`R1`, `R2`, …). Where a requirement and an inventoried behavior describe the same thing, link them rather than listing both.

**Map.** Now read the tests. For each behavior, find the tests that verify it. A behavior is verified only when a test both sets up its condition _and_ asserts its outcome precisely. Exact values, specific error types, checked side effects. Classify each unverified behavior:

- **`untested_behavior`:** no test sets up the condition.
- **`weak_assertion`:** a test sets up the condition but doesn't check the outcome tightly enough to notice if it changed. Name the test and what it fails to check.

### 4. Coverage

If a coverage command was given, run it in an isolated copy of the project (the same way `mutation-check` isolates, including uncommitted changes), or delete everything the run creates. Coverage tools write output directories and caches, and those must not be left behind.

Read the report, and filter it to lines and branches inside the unit's range. For each uncovered line or branch:

- If it belongs to a behavior already listed as a gap, attach it to that gap.
- If it doesn't, it's behavior the inventory missed. Add an **`uncovered_code`** gap describing what the code there does and what condition reaches it.
- If it genuinely can't be reached through the unit's public interface (defensive code for a state the type system rules out, a platform-specific branch that can't run here), mark it **justified** and give the concrete reason. Be skeptical. "Hard to reach" isn't "unreachable," and a justified line is hidden from the caller.

If the coverage command fails to run, report `error` with an excerpt of its output. Don't silently skip the check, because the caller configured it on purpose.

### 5. Short-circuit

If steps 3 and 4 found any gaps, skip mutation testing and go to step 7. Every known gap would just show up again as surviving mutants, at many times the cost. Note in the report that mutation testing was deferred.

### 6. Mutation

Invoke the `mutation-check` skill with the unit, the test command, and the mutation tool command, readable context, and known equivalents, if you have them.

For each survivor:

- **`missing_test`** or **`weak_assertion`:** add a gap (as `untested_behavior` or `weak_assertion`), using the survivor's note to describe the unverified behavior. Reference the mutant ID.
- **`equivalent`:** not a gap. List it under _Equivalent mutants_ in the report so the caller can pass it back as a known equivalent next round.

If `mutation-check` reports `baseline_failed` or `error`, stop and report `error`, including its reason.

### 7. Verdict

Merge gaps that describe the same behavior, even when they came from different checks. An uncovered branch, a surviving mutant on that branch, and an untested behavior about that condition are one gap, not three. Keep the references from every check that found it.

The verdict is `sufficient` only if there are no gaps **and** mutation testing ran. Otherwise it's `insufficient`.

Clean up any isolated copies, and confirm the working tree is unchanged.

## Report format

Always use this structure.

```markdown
# Test assessment: <file>#<symbol or lines>

**Status:** completed | invalid_input | baseline_failed | error
**Verdict:** sufficient | insufficient

## Summary

Two to four sentences: the verdict, how many gaps, and the most important one.

## Checks

- **Behaviors:** <verified>/<total> verified. Inventory: independent | not independent.
- **Coverage:** <line>% lines, <branch>% branches in the unit. <n> uncovered, <n> justified. | not configured
- **Mutation:** <score>% (<method>), <n> survivors, <n> equivalent. | deferred (gaps found earlier) | no tests

## Gaps

### G1: <untested_behavior | weak_assertion | uncovered_code>

**Behavior:** <entry point, condition or input, and the outcome that isn't verified>
**Location:** `<file>:<lines>`
**Requirement:** R<n> | none
**Found by:** <B3, coverage L42–44, mutant m7>
**Detail:** <for weak_assertion: the test and what it fails to check>

(repeat for each gap)

## Justified uncovered code

- `<file>:<line>`: <why it can't be reached>

## Equivalent mutants

- <id> `<file>:<line>`: `<original>` → `<replacement>`. <reason>

## Notes

Anything else: an inventory that wasn't independent, a coverage report that
needed interpretation, mutation deferred, budget limits hit.
```

Omit sections that are empty. For `invalid_input`, `baseline_failed`, and `error`, include only the title, the status, and a **Reason** section with relevant output.
