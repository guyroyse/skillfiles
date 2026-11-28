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

This skill builds or changes one unit of code from requirements. It runs three
agents, each in its own context, and decides what happens after each one
reports:

- **code-like-guy:unit-characterizer** pins down what an existing unit does
  today.
- **code-like-guy:unit-specifier** turns requirements into tests.
- **code-like-guy:unit-implementer** makes the tests pass, and reports any
  behavior the check finds that no test pins down.

You don't write tests or code yourself. The one exception is marking a mutant or
a line a person has accepted, described in _Accepting what no test can reach_.

Every agent ends with one status, and every status has a defined route. This
skill is that routing. Don't improvise around it. If an agent reports something
the routing doesn't cover, stop, with the status `stopped`.

One unit per run. Building several units, or a system, means running this skill
once per unit, in dependency order, or in parallel worktrees for units that
don't depend on each other.

## Asking a person

Some decisions belong to a person: approving seams, answering questions about
requirements, reviewing the specifier's decisions, accepting equivalent mutants.
When you can ask the user, ask, and batch the questions so they're answered
together. When you can't, because this skill is running inside an agent, stop
with the status `needs_answers`, listing every open question, and a _Resume_
section so a rerun can pick up where this one stopped.

Never answer a person's question yourself, even when the answer looks obvious.

A caller running this skill unattended should pass `accept` for the decision
review. Otherwise every run stops after the first specifier run, waiting for a
review nobody can give.

## Inputs

Required:

- **Requirements:** plain text describing what the unit must do, or what to add
  to or change about what it does.
- **Unit:** the source file, plus a symbol, or "new" with the name the unit will
  have and the source file it will live in.
- **Test file:** where the unit's tests live, or will.

Optional:

- **Writable paths:** passed to every agent. Defaults to the test file and the
  unit's source file.
- **Decision review:** `review` (the default) to show the user the specifier's
  decisions before implementing, or `accept` to accept them and carry on.
- **Commands:** the test, build, suite, and check commands. Each one the caller
  gives wins over what you find.
- **Cycle cap:** how many times to run the implementer before giving up.
  Defaults to 5.
- **Round cap** and **seam policy:** passed to the characterizer. See its inputs
  for their defaults.
- **Answers** and **Resume:** in a rerun, the answers to an earlier run's
  questions, and that run's _Resume_ section. See _Resuming_.

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
  without a file. Required. If there's none, stop, with the status `stopped`.
- **Build command:** runs the compiler or type checker. Optional. You don't run
  it yourself, but you pass it to every agent.
- **Check command:** runs a unit's tests with coverage or mutation testing,
  failing when the project's thresholds aren't met. Optional. Most legacy code
  has none. Without one, skip every step that runs it, and say in the report
  that nothing measured how well the tests pin the unit. Never make one up.

For an existing unit, run the test command once to make sure it works. Then, for
any unit, run the suite command, and record which tests already fail. Later,
only tests that passed here and fail then count against this run.

Find the unit's existing tests too: test files other than the test file that
refer to the unit. They're passed to the specifier and the implementer.

Tell the user which commands you found, and pass them to every agent, so none of
them has to look again. Don't wait for confirmation. They go in the report
either way.

### 2. Make sure the unit meets the check

For a new unit, skip to step 3.

For an existing unit with a check command, run it. If it passes, go to step 3.
Without a check command, there's no way to know how well the existing tests pin
the unit, so always characterize it.

To characterize, run the **unit-characterizer** with the unit, the test file,
the writable paths, and any approved seams and accepted limitations. Run it at
most three times in one build. Route its status:

- **`completed`:** if it made seams, run the suite command. A test that passed
  in step 1 and fails now means a seam changed behavior that a caller relies on.
  Revert the seams with version control, and ask the user whether to approve a
  different seam, which means running the characterizer again, or to stop. If
  nothing broke, or no seams were made, go on below.
- **`needs_approval`:** ask the user about each proposed seam and extraction.
  Run the characterizer again, passing each approved seam as its full entry from
  the report. An approved extraction means a new unit that has to be built
  first, in its own run, so stop, with the status `stopped`, and list it under
  _Prerequisite units_.
- **`unsuitable`:** if the report says the stable properties could be pinned,
  ask the user whether to accept that. If they do, run it again with those as
  accepted limitations. Otherwise stop, with the status `stopped`.
- **`insufficient`:** for each item the characterizer believes is equivalent or
  unreachable, follow _Accepting what no test can reach_. If any are rejected,
  or real gaps remain, run the characterizer again.
- **`blocked`:** ask the user whether to widen the writable paths. If they do,
  run it again. Otherwise stop, with the status `stopped`.
- **`baseline_failed`, `invalid_input`, `error`:** stop, with the status
  `stopped`.

Then run the check command yourself, if there is one. It must pass before going
on, because every later gap is measured against it. If it fails, and the
characterizer can still run, run it again. Otherwise stop, with the status
`insufficient`, listing what's left under _Open gaps_.

### 3. Specify

Run the **unit-specifier** with the requirements, the unit, the test file, the
existing tests, and the writable paths. In later rounds, also pass any gaps or
revision. The specifier can run at most three times in a row without an
implementer run between them. Route its status:

- **`completed`:** go to the decision review below.
- **`needs_clarification`:** ask the user the questions. Run the specifier again
  with the answers added to the requirements.
- **`unsuitable`:** for `needs_seam`, ask the user how the unit should get what
  it needs, add the answer to the requirements, and run the specifier again. For
  `multiple_units` and `combinatorial`, stop, with the status `stopped`, and
  list the suggested division under _Prerequisite units_.
- **`blocked`:** ask the user whether to widen the writable paths. If they do,
  run it again. Otherwise stop, with the status `stopped`.
- **`baseline_failed`, `invalid_input`, `error`:** stop, with the status
  `stopped`.

**Decision review.** With `review`, show the user the specifier's decisions and
behavior changes, every round, and ask whether to accept them. Turn any
correction into requirements and run the specifier again. With `accept`, carry
on, and list the decisions in the final report.

### 4. Implement

Run the **unit-implementer** with the unit, the test file and existing tests,
the specifier's _Changed tests_ list, the requirements with the specifier's
decisions, and the writable paths. Each implementer run is one cycle. Route its
status:

- **`completed`:** go to step 5.
- **`needs_tests`:** see _Closing gaps_. Follow _Accepting what no test can
  reach_ for any equivalent mutants it also lists.
- **`insufficient`:** see _Accepting what no test can reach_. Then run the
  implementer again with an empty changed tests list. Rejected mutants become
  `untested` gaps.
- **`already_passing`:** the requirements were already met. Go to step 5.
- **`not_runnable`, `unexpected_results`:** run the specifier with a revision:
  its last changed tests, and the implementer's report. Then run the implementer
  again.
- **`disputed`:** run the specifier with a revision, as above. If the specifier
  answers that the test stands, and the implementer disputes it again, ask the
  user who's right. If the test is right, add the user's answer to the
  requirements and run the implementer again. If it's wrong, run the specifier
  with a revision that includes the answer.
- **`unexpected_gaps`:** for an existing unit, step 2 confirmed the unit met the
  check, so either a modified test no longer pins existing code, or the check
  isn't deterministic. Run the specifier with a revision, naming the gaps and
  the modified tests near them. If the next implementer run reports
  `unexpected_gaps` again, stop, with the status `stopped`.
- **`blocked`:** ask the user whether to widen the writable paths. If they do,
  run it again. Otherwise stop, with the status `stopped`.
- **`baseline_failed`, `invalid_input`, `error`:** stop, with the status
  `stopped`.

After the cycle cap, stop, with the status `insufficient`, and list what's left
under _Open gaps_.

### 5. Confirm

Don't take the agents' word for the result.

1. Run the check command, if there is one. If it fails, run the implementer once
   more with an empty changed tests list, and route its status. If it fails
   again after that, stop, with the status `insufficient`.
2. Check that only the writable paths changed, apart from the registration
   entries the agents listed and the marks you made for accepted items. Anything
   else is a boundary violation. Stop, with the status `stopped`, and list the
   files.
3. Run the suite command. If a test that passed in step 1 now fails, stop, with
   the status `stopped`. That's a failure, even when the requirements asked for
   the change that caused it. It usually means the work was done in the wrong
   order: a unit that depends on this one needed to change first, in its own
   run, so that it no longer relies on the old behavior. List that unit under
   _Prerequisite units_, and ask the user whether to keep or revert this run's
   changes.

Then write the report, with the status `completed`.

## Closing gaps

The implementer describes each gap as a behavior, the condition it happens
under, and the requirement it serves, without an expected value. Handle a round
of gaps in this order:

1. **`unsettled` gaps first:** nobody decided whether the behavior should exist.
   Ask the user about all of them at once.
2. **Then the specifier, once,** with the `untested` gaps and the `unsettled`
   ones the user said should exist, as its gaps, and the original requirements,
   plus the user's answers. It takes expected values from the requirements, not
   from the gaps.
3. **Then the implementer, once,** with the specifier's new changed tests, and
   the requirements, plus a note of each behavior the user said shouldn't exist.
   It deletes that code as unrequested.

If there are only `unsettled` gaps the user said shouldn't exist, skip step 2,
and run the implementer with an empty changed tests list.

## Accepting what no test can reach

The agents never suppress a mutant or exclude code from coverage. That decision
is a person's. For each equivalent mutant or unreachable line an agent reports,
show the user the agent's reasoning, and ask:

- **Accept it:** you mark it with whatever the project's coverage or mutation
  tool provides, such as an ignore comment or an entry in the tool's
  configuration file, with the agent's reason beside it. This is the only code
  you write. List each mark under _Changes_ and _Accepted survivors_.
- **Reject it:** it's a real gap. For the characterizer, run it again, saying
  the survivor isn't equivalent. For the implementer, treat it as an `untested`
  gap.
- **Delete it:** for unreachable code the user decides is dead. That's a change
  to the unit, so it becomes a requirement for the specifier.

## Resuming

A run that stops with `needs_answers` ends with a _Resume_ section. A rerun
given answers and that section:

- uses the recorded commands and baseline failures, and doesn't run step 1 again
- keeps the recorded counts of cycles and agent runs
- treats the recorded approved seams, accepted limitations, accepted decisions,
  and accepted survivors as already approved
- passes the answers to the agent named in the section, and carries on from the
  step it records

The working tree still holds the stopped run's changes, so a rerun must start
from the same tree. If it doesn't, start over without the _Resume_ section.

## Report

Always use this structure, whether you finished or stopped. The status is one
of:

- **`completed`:** step 5 passed.
- **`needs_answers`:** a person's decision is needed, and you couldn't ask.
- **`insufficient`:** a cap was reached with the check still failing or gaps
  still open.
- **`stopped`:** an agent reported a status that ends the run, or a step here
  said to stop.

```markdown
# Build: <unit>

**Status:** completed | needs_answers | insufficient | stopped

## Summary

Two to four sentences: what was built or changed, whether the check and suite
pass, and what the caller most needs to know.

## Verification

- **Commands:** <test, suite, build, check, and which were found>
- **Check:** <passed | failed: the figures | not run: no check command, so
  nothing measured how well the tests pin the unit>
- **Suite:** <passed | new failures: the tests | not run>

## Questions

- <the question, which agent raised it, and the options>

## Stopped at

- <the agent and the status it reported, or the step, and why that stops the
  run>

## Prerequisite units

- <a unit that has to be built or changed first, and why>

## Open gaps

- <each gap or failing check item left when a cap was reached>

## Decisions

- <each decision the specifier made, and whether it was reviewed or accepted>

## Accepted survivors

- <mutant or line, at `<file>:<line>`>: <the reason it was accepted>

## Changes

- <file>: <what changed>

## Log

1. <agent>: <status>. <what happened next>

## Resume

- **Step:** <the step to carry on from, and the agent to pass the answers to>
- **Counts:** <cycles, characterizer runs, specifier runs in a row>
- **Commands:** <each command>
- **Baseline failures:** <the suite tests that failed in step 1>
- **Approved:** <seams, as full entries; accepted limitations; accepted
  decisions; accepted survivors>
```

Omit sections that are empty. Always include the summary, the verification, and
the log. Include _Resume_ only with `needs_answers`.
