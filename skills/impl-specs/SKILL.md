---
name: impl-specs
description: Implementation Step — executes a specification plan
---
# Implementation Workflow

Executes the steps defined in a plan file. Updates the plan with progress after each step and after the plan or phase is fully complete.

## Step 1: Locate Plan

Determine `{working-dir}` and `{spec-name}` from context. If ambiguous, ask the user.

Identify the target plan file:
- If a specific phase file path was provided, use that directly.
- If `{working-dir}/specification/{spec-name}/{spec-name}_plan.md` exists:
  - Check whether it is an index (contains a `## Phase Breakdown` table linking to phase files).
  - If index: list the phases and their current status, then ask the user which phase(s) to execute.
  - If single flat plan: execute it directly.

Also read if present:
- `{working-dir}/specification/{spec-name}/{spec-name}_analysis.md` — acceptance criteria and technical context

If no plan file is found, stop and ask the user to run `/gen-specs` first.

## Step 2: Pre-flight Check

Before executing, verify:
- All prerequisites listed in the plan are met. If any are unmet, stop and report which ones before asking how to proceed.
- There are no unresolved open questions in `{spec-name}_analysis.md` that block this work. If there are, surface them and wait for the user to resolve them.

If checks pass, confirm with the user before starting:

```
Plan: {plan or phase name}
Steps: {count}
Prerequisites: {met / list of unmet items}

Proceed? (yes / no)
```

**Stop and wait for confirmation.**

## Step 3: Execute Steps

Work through each step in the plan sequentially. For each step:

1. Announce the step being started.
2. Implement it — create or modify the files listed in the step.
3. Verify the outcome against the step goal and any relevant acceptance criteria from `{spec-name}_analysis.md`.
4. **Immediately update the plan file** — mark the completed step done by checking its checkbox or appending `✓` to the step heading.
5. If a step cannot be completed or produces an unexpected result, **stop immediately**, report the issue and the current state, and wait for user instruction before continuing.

Do not move to the next step until the current one is verified complete.

## Step 4: Update Plan on Completion

When all steps in the plan or phase are complete, add or update a `## Progress` section directly below the document title:

```markdown
## Progress
- **Status:** Complete
- **Completed:** {date}
- **Notes:** [Any deviations from the plan, skipped steps, or follow-up items discovered during implementation.]
```

If executing a phase file and an index (`{spec-name}_plan.md`) exists, update the Phase Breakdown table in the index to mark that phase done. Add a `Status` column to the table if not already present:

```markdown
| Phase | File | Description | Status |
|---|---|---|---|
| 1 | `plan/01-{phase-name}.md` | [Description] | ✓ Done |
| 2 | `plan/02-{phase-name}.md` | [Description] | — |
```

## Step 5: Quality Checks

After implementation:
- [ ] All steps in the plan or phase are marked complete
- [ ] Every file stated in the plan was created or modified at the correct path
- [ ] Acceptance criteria from `{spec-name}_analysis.md` are met for this plan or phase
- [ ] Plan file (and index if applicable) reflects current progress status
- [ ] Deviations from the plan are documented in the `## Progress` section

## Step 6: Output Summary

Report to the user:
1. **Steps completed:** list each step and its outcome
2. **Files created or modified:** list all affected files
3. **Plan updated:** confirm which plan file(s) were updated with progress
4. **Acceptance criteria met:** list which criteria from `{spec-name}_analysis.md` are now satisfied
5. **Remaining phases:** if executing from an index, list phases not yet started
6. **Follow-up items:** deviations, blockers encountered, or items to revisit
