---
name: develop-unit
description: Build or modify a single unit of code (a class, function, or module) from a spec, test first, and hand back a fully tested unit ready for human review. Orchestrates the chiastic workflow, dispatching separate agents for each phase. It makes the existing tests sufficient, writes failing tests from the spec, implements to green, then makes the tests sufficient again. Use this whenever a caller (an orchestrating agent or a human) hands over a spec for one unit, whether a new unit or a change to an existing one, and wants it implemented with a trustworthy test suite. Works inside strict file boundaries so it can run in parallel with other units, and reports back rather than asking questions mid-task.
---

# Develop Unit

This skill takes a spec for one unit of code and delivers the implementation, with tests that verify every requirement and every other behavior the unit has. It's test-driven development with a sufficiency gate on both sides:

```
A   make the existing tests sufficient     (assess-tests ⇄ characterize-unit)
B   write failing tests from the spec      (specify-unit)
B′  implement until the tests pass         (implement-unit)
A′  make the tests sufficient again        (assess-tests ⇄ specify-unit / characterize-unit)
```

The shape is chiastic. The same gate opens and closes the work, and the red/green pair sits in the middle. The opening gate means every behavior change is deliberate and visible. The closing gate means the tests would actually notice if the new code were wrong.

This skill orchestrates. It doesn't write tests or code itself. Each phase is its own skill, run in its own subagent, and this skill decides what runs next based on the reports that come back.

## Preconditions

The caller has already defined the unit, sized it appropriately, and written the spec. This skill works within the spec as given. It doesn't resize the unit, explore beyond the files it's told about, or reinterpret the requirements.

It may be running alongside other instances working on other units. That's why the file boundaries are strict, and why problems are reported rather than worked around.

## The spec

The spec describes one change to one unit. It's written by a human or an upstream agent. _Unit_, _Intent_, and _Requirements_ are required. The others are optional.

```markdown
# <Short title for the change>

## Unit

<Source file>, <symbol or line range>. Say "new" if the unit doesn't exist yet.

## Intent

<Why this change is being made, in a few sentences.>

## Requirements

- **R1** <one testable behavior>
- **R2** <one testable behavior>

## Examples

- <input> → <expected result>

## Contracts

<Interfaces that are fixed and must not change: types, signatures,
collaborators' APIs. Code against these as written.>

## Out of scope

- <things not to touch, even if they look related>

## Files

- Writable: <files that may be modified>
- Readable: <files that may be read for context>

## Tests

- Test file: <where tests for this unit go>
- Existing tests: <other test files that already cover the unit>
```

Defaults when optional sections are missing:

- **Writable:** the unit's source file and the test file.
- **Readable:** the unit's source file and the test files.
- **Test file:** derived from the profile's test file convention.

### Example spec

```markdown
# Cap discounts at the order subtotal

## Unit

src/pricing/applyDiscount.ts, `applyDiscount`

## Intent

Discounts can currently exceed the order subtotal, producing negative totals.

## Requirements

- **R1** The discount applied never exceeds the order subtotal.
- **R2** When a discount is capped, `order.discountCapped` is set to `true`;
  otherwise it's `false`.
- **R3** Discounts at or below the subtotal behave exactly as they do today.

## Examples

- subtotal 100, discount 30 → total 70, discountCapped false
- subtotal 100, discount 150 → total 0, discountCapped true

## Contracts

`Order` and `Customer` in src/pricing/types.ts are fixed. Don't change their
shape.

## Out of scope

- Discount stacking rules
- Currency rounding (handled by `roundCurrency`)

## Files

- Readable: src/pricing/types.ts
```

## The project profile

How to run tests, coverage, and mutation testing is a property of the repository, not of the change, so it lives in a profile that's written once per repo. Look for it in `chiastic.md` at the repository root, then in a `## Chiastic coding` section of the root `AGENTS.md` or `CLAUDE.md`. If the spec repeats a field, the spec wins.

```markdown
## Chiastic coding

- Test file convention: src/**/X.ts → src/**/X.spec.ts
- Test command: npx vitest run {test_file}
- Coverage command: npx vitest run {test_file} --coverage --coverage.reporter=json
- Coverage report: coverage/coverage-final.json
- Mutation tool command: npx stryker run --mutate "{file}:{lines}"
- Example test file: src/pricing/calculateTax.spec.ts
- Characterization marking: describe block named "characterization"
- Round cap: 3
```

_Test command_ is required. Everything else is optional:

- **Coverage command:** without it, `assess-tests` skips the coverage check.
- **Mutation tool command:** without it, `mutation-check` uses its agent path.
- **Example test file:** without it, follow the existing tests, or the language's common conventions.
- **Round cap:** how many assess-and-fix rounds each gate gets. Defaults to 3.

## Ground rules

- **Stay inside the writable files.** If the change can't be made without touching another file, stop and report `blocked`. Pass the writable list to every phase, and narrow it where the phase calls for it: `implement-unit` never gets test files, and `characterize-unit` gets the source only for seams.
- **Don't fix what the spec doesn't ask you to fix.** Phases report suspected bugs and things outside scope. Carry them into the final report. Don't act on them.
- **Never weaken a test to make it pass.** No phase edits a test to match the code, except `specify-unit` reconciling characterization tests to what the spec requires.
- **Don't ask questions mid-task.** The caller may be an agent that can't answer. When you need an answer, stop and report `needs_clarification` with specific questions.

## Running the phases

Run each phase in a **fresh subagent**. Tell it to use the named skill, give it the inputs listed below, and wait for its report. Separate contexts are the point: the test author never sees an implementation it might bend toward, the implementer can't reshape the tests, and the assessor isn't grading its own work.

If your environment can't spawn subagents, run the phases yourself, in order, and note in the report that phases weren't independent.

Keep a running record as you go: every report, the known equivalent mutants, and a snapshot of the unit's source as it was before any phase ran (for an existing unit). The final report draws on all of it.

## Workflow

### 1. Validate

Read the spec and the profile. Check that the required spec sections and the profile's test command are present, that the listed files exist (except the unit's file, if it's new, and the test file, if it doesn't exist yet), and that the unit's symbol or range resolves. Resolve the test file and substitute it into the test and coverage commands.

If anything is missing or wrong, report `invalid_input` and say exactly what. Don't fill gaps by exploring the repository.

### 2. Baseline

If the unit exists **and** has at least one test, run the test command. If it fails, stop and report `baseline_failed` with the relevant output. Building on failing tests makes every later signal meaningless, and a human needs to know.

If the unit is new, or exists without tests, there's nothing to run. Move on.

### 3. Gate A: make the existing tests sufficient

Skip this step for a new unit.

Repeat, up to the round cap:

1. Run **`assess-tests`** with the unit, the test command, the test files, the coverage command and report, the mutation tool command, the readable files, and the known equivalents. Don't pass the requirements. This gate is about the code as it is today.
2. If the verdict is `sufficient`, the gate is open. Go to step 4.
3. Otherwise, run **`characterize-unit`** with the unit, the test file, the test command, the gap list, the existing tests, and the readable files. Writable paths are the test file, plus the source file if the spec makes it writable (for seams).
4. Add any equivalent mutants from the assessment to the known equivalents.

If the round cap is reached without a `sufficient` verdict, stop and report `insufficient` with the remaining gaps. Changing a unit whose behavior isn't pinned means changing it blind.

Handling other results: `characterize-unit` `blocked` → stop and report `blocked`, including its reason and the tests it wrote. Any `invalid_input`, `baseline_failed`, or `error` → stop and report `error` with the phase's reason.

### 4. Red

Run **`specify-unit`** in red mode with the spec (requirements, intent, examples, contracts, out of scope), the unit, the test file, the test command, the example test file, the characterization tests from gate A, and the readable files. Writable paths are the test files and, for stubs, the unit's source file.

- `completed`: carry the behavior changes, red results, and stubs into the final report.
- `needs_clarification`: stop and report `needs_clarification` with its questions and the work done so far.
- `blocked`, `invalid_input`, or `error`: stop and report `blocked` or `error` with its reason.

### 5. Green

Run **`implement-unit`** with the spec, the unit, the test command, the test files (read-only), the writable source files, and the readable files.

- `completed`: move on.
- `test_dispute`: run `specify-unit` once more, in red mode, with the dispute, and ask it to check the disputed test against the spec. If it corrects the test, run `implement-unit` again. If it upholds the test, or the dispute comes back a second time, stop and report `needs_clarification`, with the dispute stated as a question.
- `blocked` or `error`: stop and report it, with its reason and the changes made so far.

### 6. Gate A′: make the tests sufficient again

Repeat, up to the round cap:

1. Run **`assess-tests`** as in gate A, but this time **pass the requirements** as well, along with all the test files, including the new ones.
2. If the verdict is `sufficient`, the gate is open. Go to step 7.
3. Otherwise, route each gap:
   - **The gap is tied to a requirement,** or lies in behavior the spec determines → `specify-unit` in gaps mode. Expected values come from the spec.
   - **The gap lies in pre-existing behavior the change didn't touch** (compare against the source snapshot) → `characterize-unit` with label `characterization`.
   - **The gap lies in new behavior the spec doesn't determine** → `characterize-unit` with label `unspecified`. The behavior gets pinned so the gate can close, and it's listed under _Spec gaps_ so a human decides whether it should exist.
4. If `specify-unit` reports failing tests, the implementation disagrees with the spec. Run `implement-unit` with those failing tests, then continue the loop.
5. Add any equivalent mutants to the known equivalents.

If the round cap is reached without a `sufficient` verdict, stop and report `insufficient` with the remaining gaps. Everything written so far stays in place, and the report says where the work stands.

### 7. Finish

Run the test command twice. Both runs must pass. Tests that pass once and fail the next time are pinning something nondeterministic, and a phase needs to fix them before the work is done. Confirm that only writable files changed, and that no scratch files are left behind. Then write the report. The unit is now ready for human review.

## Report format

Always use this structure.

```markdown
# Unit development: <spec title>

**Status:** completed | invalid_input | baseline_failed | insufficient | needs_clarification | blocked | error

## Summary

Two to four sentences: what was built or changed, whether every requirement
is covered, the final gate result, and anything the reviewer most needs to know.

## Requirements

- **R1:** <test names that verify it>

## Changes

- <file>: <what changed, in a sentence or two>

## Behavior changes

- <reconciled test>: was <old behavior>, now <new behavior> (R<n>)

## Gate A

Rounds: <n>. <n> characterization tests added. Final: <behaviors, coverage,
mutation from the last assessment>.

## Suspected bugs

- <test name>: <what the code does, and why it looks wrong>

## Seam changes

- <file:line>: <the change, and why>

## Gate A′

Rounds: <n>. Final: <behaviors, coverage, mutation from the last assessment>.

## Equivalent mutants

- <id> `<file>:<line>`: `<original>` → `<replacement>`. <reason>

## Remaining gaps

- G<n>: <behavior that's still unverified> (only for `insufficient`)

## Spec gaps

- <unspecified behavior pinned, or a question the spec didn't settle, and where it came up>

## Questions

- <specific question the caller needs to answer>

## Notes

Anything else: phases that weren't independent, requirements already satisfied
before the change, test disputes and how they were resolved, things noticed
outside scope.
```

Omit sections that are empty. For a new unit, omit _Behavior changes_, _Gate A_, _Suspected bugs_, and _Seam changes_.

For `needs_clarification` and `insufficient`, include everything done so far, so the caller can answer or fill in and re-dispatch without starting over. For `invalid_input`, `baseline_failed`, `blocked`, and `error`, include the title, the status, and a **Reason** section. For `blocked`, also list anything written before the block, so the caller can keep it.
