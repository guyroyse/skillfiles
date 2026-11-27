---
name: mutation-check
description: Run mutation testing against a single unit of code and its tests, then report which mutants survived and what each survivor means. Use this whenever a caller (an orchestrating agent or a human) wants to know whether a unit's tests actually verify its behavior, not just execute it, such as after writing characterization tests, after implementing a change, or when auditing an existing test suite. Uses the project's mutation testing tool when a tool command is supplied, and otherwise generates mutants with an independent subagent. Never writes tests and never leaves changes in the repository.
---

# Mutation Check

Mutation testing tests the tests. Small, deliberate faults (mutants) are introduced into a unit's code one at a time, and the unit's tests are run against each. If a test fails, the mutant is _killed_ and the tests did their job. If every test still passes, the mutant _survived_, which means the code's behavior changed and nothing noticed.

This skill runs that process for one unit and produces a report. The report tells the caller where the tests are weak and why, in enough detail that the caller can write the missing tests without re-deriving the problem.

## What this skill does not do

- **It does not write or fix tests.** Acting on the report is the caller's job. This keeps the skill single-purpose and lets it run safely on code someone else is actively working on.
- **It does not change the repository.** All mutation happens in an isolated copy. When the skill finishes, the working tree is exactly as it was.
- **It does not judge pass or fail.** It reports a score and the survivors. Whether that's good enough is the caller's decision. (`assess-tests`, for example, treats zero non-equivalent survivors as a pass.)
- **It does not discover inputs.** The caller says what the unit is and how to run its tests. If that information is missing or wrong, the skill reports `invalid_input` rather than guessing.

## Inputs

Required:

- **Unit:** the source file, plus either a symbol (function, class, method) or a line range identifying the unit within it.
- **Test command:** a command that runs the tests covering the unit and exits with status 0 when they pass. It should be scoped to the unit. Running a whole suite per mutant is slow, and noisy in parallel setups.

Optional:

- **Tool command:** a mutation testing tool invocation, with `{file}` and `{lines}` placeholders for the unit's file and line range (for example, `npx stryker run --mutate "{file}:{lines}"`). If present, use the tool path. If absent, use the agent path.
- **Tool report path:** where the tool writes its machine-readable report. If absent, check the defaults listed under _Tool path_ below.
- **Readable context:** additional files the mutator may read to understand types and collaborators.
- **Budget:** a maximum mutant count and/or wall-clock time. For the agent path, default to 25 mutants. For the tool path, there's no default cap on mutant count, but honor a time limit if one is given.
- **Known equivalents:** mutants a previous run already classified as `equivalent`, each given as a location plus original and replacement text. Callers that run this skill in a loop pass these so the same mutant isn't argued over every round (see _Triage_).

## Workflow

### 1. Validate

Confirm the required inputs are present, the file exists, and the symbol or line range can be located in it. Resolve a symbol to its line range now, since everything after works in terms of lines.

On the agent path, **do not open the unit's test files yet.** You may need to generate mutants yourself (see step 4b), and mutants are only useful when they're generated without knowledge of the tests. Reading the tests comes later, in triage.

If anything is missing or doesn't resolve, stop and produce an `invalid_input` report that says exactly what was wrong.

### 2. Isolate

Create a scratch copy of the project that reflects the **current working tree, including uncommitted changes**. Callers frequently run this skill right after modifying code, so a checkout of `HEAD` alone would test the wrong version. One approach with git:

```bash
git worktree add --detach /tmp/mutation-check-<id> HEAD
git diff HEAD | git -C /tmp/mutation-check-<id> apply
# copy any untracked files the unit or its tests depend on
```

The copy also needs the project's dependencies (installed packages, build outputs). Symlinking dependency directories is usually fastest. Reinstalling works too.

Isolate even on the tool path. Mutation tools write sandboxes, caches, and reports into the project directory, and these collide when several runs share a directory. Some tools also modify files in place.

### 3. Baseline

Run the test command in the isolated copy against unmutated code. Record how long it takes.

If it fails, stop and produce a `baseline_failed` report that includes the relevant part of the output. Mutation results are meaningless when the tests don't pass to begin with.

Set the per-mutant timeout to about three times the baseline duration plus a few seconds of slack. A mutant that runs past the timeout has most likely caused an infinite loop or a hang.

### 4a. Tool path

Substitute the unit's file and line range into the tool command and run it in the isolated copy. Then find its report and read the result for each mutant.

If the tool fails to run, produce an `error` report with an excerpt of its output. Don't silently fall back to the agent path. The caller chose the tool, and may be relying on its systematic, repeatable behavior.

Map tool statuses to these common statuses:

| Common status   | Meaning                          | StrykerJS / Stryker.NET | PIT                     | cargo-mutants | mutmut              |
| --------------- | -------------------------------- | ----------------------- | ----------------------- | ------------- | ------------------- |
| `killed`        | a test failed                    | Killed                  | KILLED                  | caught        | killed              |
| `survived`      | all tests passed                 | Survived                | SURVIVED                | missed        | survived            |
| `no_coverage`   | no test reached the mutated code | NoCoverage              | NO_COVERAGE             | —             | no tests            |
| `timeout`       | the test run hung                | Timeout                 | TIMED_OUT, MEMORY_ERROR | timeout       | timeout, suspicious |
| `compile_error` | the mutant didn't build or load  | CompileError            | NON_VIABLE              | unviable      | —                   |
| `excluded`      | not run or not meaningful        | Ignored, RuntimeError   | RUN_ERROR               | —             | skipped, segfault   |

For tools not listed, map by meaning.

Default report locations, when no report path is given (these depend on reporter configuration, so confirm the file exists):

- **StrykerJS:** `reports/mutation/mutation.json` (needs the `json` reporter)
- **Stryker.NET:** `StrykerOutput/<timestamp>/reports/mutation-report.json` (needs the `json` reporter)
- **PIT:** `target/pit-reports/mutations.xml` (Maven) or `build/reports/pitest/mutations.xml` (Gradle), with the XML output format enabled
- **cargo-mutants:** `mutants.out/outcomes.json`
- **mutmut:** no report file; read results from `mutmut results` and `mutmut show <id>`

Most tools can't scope as precisely as a line range, so **filter results to mutants whose location falls inside the unit's range** before counting anything.

### 4b. Agent path

Generate mutants with a subagent, then run each one yourself.

**Generate.** Spawn a subagent with a fresh context. Give it the full contents of `mutator-agent.md` (in this skill's directory) as its instructions, along with:

- the unit's file path and line range
- the unit's source (the whole file, so it has local context, with the unit's range identified)
- the readable context files, if any
- the number of mutants to produce (the budget)

Do not give it the tests, test file paths, or the test command. The value of mutation testing comes from the mutator not sharing the test author's assumptions. A mutator that has seen the tests drifts toward mutating what's already tested.

If your environment can't spawn subagents, generate the mutants yourself by following `mutator-agent.md`, before reading any tests. Note in the report that generation was not independent.

**Run.** For each mutant the subagent returns:

1. Check that its original text appears exactly once in the file, within the unit's range. If not, discard it and note it as invalid. Don't try to repair it.
2. Apply the replacement in the isolated copy.
3. Run the test command with the per-mutant timeout.
4. Classify the result:
   - Exit status 0: `survived`.
   - Test failures: `killed`. Read the failure output first, though. If the run failed because the code didn't parse, compile, type-check, or import, rather than because a test assertion failed, classify it as `compile_error`. In interpreted languages a broken mutant looks just like a kill, and counting it as one inflates the score.
   - Timeout: `timeout`.
5. Restore the file before applying the next mutant.

Mutants can run in parallel if you create a separate isolated copy for each concurrent run.

The agent path has no coverage data, so it never produces `no_coverage`. A survivor in code no test reaches shows up as `survived` and is triaged as a missing test.

### 5. Triage

Now read the tests. For every `survived` and `no_coverage` mutant, decide what it means:

- **`missing_test`:** no test exercises the behavior the mutant changed. Describe the specific behavior or input condition that is unverified.
- **`weak_assertion`:** a test reaches the mutated code, but its assertions aren't tight enough to notice the change (a truthiness check where an exact value was needed, an unchecked side effect, an error asserted without its type). Name the test and what it fails to check.
- **`equivalent`:** the mutant doesn't change observable behavior, so no test could kill it. Give a concrete reason. Be skeptical here. Calling a mutant equivalent hides it from the caller, so when in doubt, it isn't equivalent.

If a survivor matches a known equivalent (same location, same original and replacement text), classify it as `equivalent` without re-arguing it, and note in the report that it was carried over. If the code at that location has changed since, the match no longer holds, so triage it fresh.

Triage is analysis only. Don't write tests, and don't rerun mutants.

### 6. Report and clean up

Write the report (format below). Remove the isolated copy (for example, `git worktree remove --force <path>`), and confirm the original working tree is unchanged.

## Score

Score = (killed + timeout) ÷ (all mutants − compile_error − excluded), as a percentage.

Timeouts count as detected, since the mutant changed behavior enough to hang the tests. Equivalent mutants stay in the denominator but are listed separately, so the caller can see how much of the gap they account for.

## Report format

Always use this structure, so callers can rely on finding the same facts in the same places.

```markdown
# Mutation check: <file>#<symbol or lines>

**Status:** completed | invalid_input | baseline_failed | error
**Method:** tool (<tool name>) | agent | agent (not independent)

## Summary

Two to four sentences: the score, how many survivors point to real gaps,
and the most important gap.

## Counts

<total> mutants: <killed> killed, <survived> survived, <no_coverage> no coverage,
<timeout> timed out, <compile_error> compile errors, <excluded> excluded.
Score: <score>%.

## Survivors

### <id>: <disposition>

`<file>:<line>`: `<original>` → `<replacement>`
<One or two sentences on the unverified behavior, the weak assertion,
or why the mutant is equivalent.>

(repeat for each survivor; list missing_test and weak_assertion before equivalent)

## Notes

Anything else the caller should know: discarded or invalid mutants, a budget
that was hit, tool warnings, or reduced independence on the agent path.
Omit this section if there's nothing to say.
```

For `invalid_input`, `baseline_failed`, and `error`, include only the title, status, method (if known), and a **Reason** section explaining what went wrong, with relevant output.

### Example

```markdown
# Mutation check: src/pricing/applyDiscount.ts#applyDiscount

**Status:** completed
**Method:** agent

## Summary

Score is 87%. Two survivors point to real gaps: no test covers a discount
exactly equal to the subtotal, and the clamp to zero is reached but not
verified. One survivor is equivalent.

## Counts

24 mutants: 19 killed, 3 survived, 0 no coverage, 1 timed out, 1 compile error, 0 excluded.
Score: 87%.

## Survivors

### m7: missing_test

`applyDiscount.ts:42`: `discount >= subtotal` → `discount > subtotal`
No test uses a discount exactly equal to the subtotal, so the boundary of
the cap is unverified.

### m12: weak_assertion

`applyDiscount.ts:51`: `Math.max(0, total)` → `total`
"handles oversized discounts" reaches this line but only asserts that the
result is a number, not that it is zero.

### m19: equivalent

`applyDiscount.ts:38`: `i < items.length` → `i != items.length`
The loop starts at zero and increments by exactly one, so both conditions
stop at the same point.
```
