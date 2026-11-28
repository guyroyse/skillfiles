---
name: build-unit
description:
  Builds or changes one unit of code (a class or function) test-first, by
  running the code-like-guy unit agents in order — characterize an existing unit
  until the project's coverage and mutation check passes, specify the
  requirements as tests, implement them, and loop between specifying and
  implementing until the check passes with no gaps. Routes every agent status to
  its next step, and gathers the decisions only a person can make. Use it
  whenever Guy asks to build, add to, change, or fix a unit of code from
  requirements, test-first, or asks for a unit built "the workshop way," and
  whenever another agent builds a unit on his behalf.
---

# Build a Unit

This skill builds or changes one unit of code from requirements. It doesn't
write tests or code itself. It runs three agents, each in its own context, and
decides what happens after each one reports:

- **code-like-guy:unit-characterizer** pins down what an existing unit does
  today.
- **code-like-guy:unit-specifier** turns requirements into tests.
- **code-like-guy:unit-implementer** makes the tests pass, and reports any
  behavior the check finds that no test pins down.

Every agent ends with one status, and every status has exactly one next step.
This skill is that routing. Don't improvise around it. If an agent reports
something the routing doesn't cover, stop and report it.

One unit per run. Building several units, or a system, means running this skill
once per unit, in dependency order, or in parallel worktrees for units that
don't depend on each other.

## Asking a person

Some decisions belong to a person: approving seams, answering questions about
requirements, accepting equivalent mutants. When you can ask the user, ask, and
batch the questions so they're answered together. When you can't, because this
skill is running inside an agent, stop and report `needs_answers` with every
open question. The caller answers them and runs the skill again, and the work
picks up where it stopped.

Never answer a person's question yourself, even when the answer looks obvious.

## Inputs

Required:

- **Requirements:** plain text describing what the unit must do, or what to add
  to or change about what it does.
- **Unit:** the source file, plus a symbol, or "new" with the name the unit will
  have.
- **Test file:** where the unit's tests live, or will.

Optional:

- **Writable paths:** passed to every agent. Defaults to the test file and the
  unit's source file.
- **Readable context:** passed to every agent.
- **Decision review:** `review` (the default) to show the user the specifier's
  decisions before implementing, or `accept` to accept them and carry on.
- **Commands:** the test, build, suite, and check commands. Each one the caller
  gives wins over what you find.
- **Cycle cap:** how many specify-and-implement cycles to run before giving up.
  Defaults to 5.
- **Round cap** and **seam policy:** passed to the characterizer. See its inputs
  for their defaults.
- **Answers:** in a rerun, the answers to an earlier run's questions.

## Workflow

Keep a log as you go: each agent run, its status, and what you did next. It goes
in the final report.

### 1. Find the commands

Find each command the caller didn't give, from the project's build files,
scripts, and existing tests, and the instructions in its `CLAUDE.md` or
`AGENTS.md`:

- **Test command:** runs one unit's tests and exits 0 when they pass. Required.
  If the project has no way to run tests, stop, with the status `stopped`.
  Nothing here works without one, and choosing a test framework is the project's
  call, not this skill's.
- **Suite command:** runs every test in the project. Usually the test command
  without a file. Required.
- **Build command:** runs the compiler or type checker. Optional.
- **Check command:** runs a unit's tests with coverage or mutation testing,
  failing when the project's thresholds aren't met. Optional. Most legacy code
  has none. Without one, skip every step that runs it, and say in the report
  that nothing measured how well the tests pin the unit.

Run the test command once to make sure it works. Then run the suite command, and
note which tests already fail. Later, only tests that passed here and fail then
count against this run. Tell the user which commands you found, and pass them to
every agent, so none of them has to look again.

### 2. Make sure the unit meets the check

For a new unit, skip to step 3.

For an existing unit with a check command, run it. If it passes, go to step 3.
Without a check command, there's no way to know how well the existing tests pin
the unit, so always characterize it.

To characterize, run the **unit-characterizer** with the unit, the test file,
the writable paths, and any approved seams. Route its status:

- **`completed`:** if it made seams, run the suite command. A test that passed
  in step 1 and fails now means a seam changed behavior that a caller relies on.
  Revert the seams, and ask the user how to go on, or stop. Otherwise, go to
  step 3.
- **`needs_approval`:** ask the user about each proposed seam and extraction.
  Run the characterizer again with the approved seams. An extraction means a new
  unit: stop and report it, since that unit is built first, by its own run.
- **`insufficient`:** ask the user about each survivor and uncovered line the
  characterizer believes is equivalent or unreachable. See _Accepting what no
  test can reach_. If gaps remain that it couldn't close, stop and report them.
- **`unsuitable`, `baseline_failed`, `invalid_input`, `error`:** stop and
  report.
- **`blocked`:** ask the user whether to widen the writable paths. If they do,
  run it again. Otherwise stop.

Then run the check command yourself, if there is one. It must pass before going
on. Every later gap is measured against this.

### 3. Specify

Run the **unit-specifier** with the requirements, the unit, the test file, the
writable paths, and any existing tests elsewhere. Route its status:

- **`completed`:** go to the decision review below.
- **`needs_clarification`:** ask the user the questions. Run the specifier again
  with the answers added to the requirements.
- **`unsuitable`:** stop and report how the specifier suggests dividing the
  work.
- **`baseline_failed`, `invalid_input`, `error`:** stop and report.
- **`blocked`:** ask the user whether to widen the writable paths. If they do,
  run it again. Otherwise stop.

**Decision review.** With `review`, show the user the specifier's decisions and
behavior changes, and ask whether to accept them. Turn any correction into
requirements and run the specifier again. With `accept`, carry on, and list the
decisions in the final report.

### 4. Implement

Run the **unit-implementer** with the unit, the test files, the specifier's
_Changed tests_ list, the requirements with the specifier's decisions, and the
writable paths. Route its status:

- **`completed`:** go to step 5.
- **`needs_tests`:** see _Closing gaps_.
- **`insufficient`:** see _Accepting what no test can reach_. Rejected mutants
  become `untested` gaps.
- **`already_passing`:** if any test passes for the wrong reason, run the
  specifier with a revision: those tests, and the implementer's findings.
  Otherwise the requirements were already met. Go to step 5.
- **`not_runnable`, `unexpected_results`, `disputed`:** run the specifier with a
  revision: its last changed tests, and the implementer's report. Then run the
  implementer again. If the specifier answers a dispute with "stands," and the
  implementer disputes it again, ask the user.
- **`unexpected_gaps`:** stop and report. Step 2 confirmed the unit met the
  check, so either the check isn't deterministic or something outside this run
  changed the unit.
- **`blocked`:** ask the user whether to widen the writable paths. If they do,
  run it again. Otherwise stop.
- **`baseline_failed`, `invalid_input`, `error`:** stop and report.

Each specifier and implementer pair is one cycle. When a cycle ends with
something other than `completed`, start another. After the cycle cap, stop and
report `insufficient`, with what's left open.

### 5. Confirm

Don't take the agents' word for the result. Run the check command yourself, if
there is one, and check that only the writable paths changed.

Then run the suite command. If a test that passed in step 1 now fails, stop and
report it. That's a failure, even when the requirements asked for the change
that caused it. It usually means the work was done in the wrong order: a unit
that depends on this one needed to change first, in its own run, so that it no
longer relies on the old behavior. Ask the user whether to keep or revert this
run's changes.

Then write the report.

## Closing gaps

The implementer describes each gap as a behavior, the condition it happens
under, and the requirement it serves, without an expected value. Route each one
by its kind:

- **`untested`:** the requirements call for the behavior, but no test pins it
  down. Collect these, and run the specifier with them as its requirements,
  along with the original requirements, so it takes expected values from the
  original wording, not from the gap.
- **`unsettled`:** nobody decided whether the behavior should exist. Ask the
  user. If it should, the answer is a new requirement for the specifier. If it
  shouldn't, add that to the requirements, and run the implementer again with no
  changed tests. It sorts the code as unrequested, and deletes it.

Then run the implementer again with the specifier's new changed tests. Most of
them will already pass. The implementer expects that, because it's told.

## Accepting what no test can reach

The agents never suppress a mutant or exclude code from coverage. That decision
is a person's. For each equivalent mutant or unreachable line an agent reports,
show the user the agent's reasoning, and ask:

- **Accept it:** mark it with whatever the project's coverage or mutation tool
  provides for this, such as an ignore comment or a configuration entry, with
  the agent's reason beside it. The check should then pass without it.
- **Reject it:** it's a real gap. For the characterizer, run it again, saying
  the survivor isn't equivalent. For the implementer, treat it as an `untested`
  gap.
- **Delete it:** for unreachable code the user decides is dead. That's a change
  to the unit, so it becomes a requirement for the specifier.

## Report

Always use this structure, whether you finished or stopped.

```markdown
# Build: <unit>

**Status:** completed | needs_answers | insufficient | stopped

## Summary

Two to four sentences: what was built or changed, whether the check and suite
pass, and what the caller most needs to know.

## Questions

- <the question, which agent raised it, and the options>

## Stopped at

- <the agent and the status it reported, and why that stops the run>

## Decisions

- <each decision the specifier made, and whether it was reviewed or accepted>

## Accepted survivors

- <mutant or line, at `<file>:<line>`>: <the reason it was accepted>

## Changes

- <file>: <what changed>

## Log

1. <agent>: <status>. <what happened next>
```

Omit sections that are empty. `needs_answers` means a person's decision is
needed and you couldn't ask. Include the questions, and enough of the log for a
rerun to pick up where this one stopped. `stopped` means an agent reported a
status that ends the run. Include where it stopped, and the agent's reason.
