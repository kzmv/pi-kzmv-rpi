---
name: detail-plan
description: Detail Plan Step — splits a large plan into structured phase files
---
# Detail Plan Workflow

Called when a `/gen-specs` plan is estimated to exceed ~10,000 tokens. Converts the monolithic plan into a lean index file plus individual phase detail files.

## Step 1: Locate Input Files

Determine `{working-dir}` and `{spec-name}` from context. If ambiguous, ask the user.

Read:
- `{working-dir}/specification/{spec-name}/{spec-name}_plan.md` — the existing plan to be split (required)
- `{working-dir}/specification/{spec-name}/{spec-name}_analysis.md` — for scope and acceptance criteria context (read if present)

If `{spec-name}_plan.md` does not exist, stop and ask the user to run `/gen-specs` first.

## Step 2: Identify Phases

Read the full plan and group the implementation steps into logical phases. Aim for 3–7 phases. A phase should represent a coherent unit of work that can be executed independently or handed off to a separate agent.

Criteria for phase boundaries:
- A natural milestone or deliverable
- A change in the component or layer being modified
- A dependency boundary (phase N must complete before phase N+1 can start)
- Steps that could be parallelised belong in separate phases

List the proposed phases and confirm with the user before writing any files.

```
Proposed phases:
1. [Phase name] — [One-line description]
2. [Phase name] — [One-line description]
...

Proceed with this breakdown? (yes / adjust)
```

**Stop and wait for confirmation.**

## Step 3: Rewrite Plan as Index

Update `{working-dir}/specification/{spec-name}/{spec-name}_plan.md` in place. Replace the detailed step content with a high-level index. Keep the references and scope sections intact.

```markdown
# {Spec Name} — Implementation Plan (Index)

## Summary
[2-3 sentences: what this plan covers. Unchanged from original.]

## References
| Source | Link / Path | Summary |
|---|---|---|
| [Name] | [URL or file path] | [One-line summary] |

## Approach
[2–4 sentences describing the general implementation strategy and any key architectural decisions.]

## Phase Breakdown
| Phase | File | Description |
|---|---|---|
| 1 | `plan/01-{phase-name}.md` | [What this phase covers] |
| 2 | `plan/02-{phase-name}.md` | [What this phase covers] |
| ... | ... | ... |

## Dependency Order
[Note any phases that must be completed before others can start, or phases that can run in parallel.]

## Rollout Notes
[Migration steps, feature flags, or deployment considerations if applicable.]
```

## Step 4: Generate Phase Detail Files

Create the directory `{working-dir}/specification/{spec-name}/plan/` if it doesn't exist.

Create one file per phase in that directory.

File naming: `{zero-padded-index}-{phase-name}.md` (e.g., `01-data-model.md`, `02-api-layer.md`).

**Code conventions for phase detail files:**
- Snippets must cover edge cases and error handling patterns, not just the happy path.
- Data models must be detailed; prefer JSON.
- CLI commands must include all flags required to run them; reference official docs before specifying flags.
- Always link to official documentation before describing how a tool or API works.

**Testing approach:**
- Each step has a `Tests` field for step-level verification — unit tests, assertions, or smoke checks run immediately after that step to confirm it is correct before moving on.
- `## Testing Requirements` at the end covers integration and acceptance-level tests that span the full phase or verify end-to-end behaviour. These run after all steps in the phase are complete.

Each file follows this template:

```markdown
# {Spec Name} — Phase {N}: {Phase Name}

## Context
[1–2 sentences describing where this phase fits in the overall plan and what must be true before it starts.]

## References
> Subset of references from `{spec-name}_analysis.md` and `{spec-name}_plan.md` relevant to this phase only.

| Source | Link / Path | Summary |
|---|---|---|
| [Name] | [URL or file path] | [One-line summary] |

## Goal
[What this phase delivers. Should map to one or more acceptance criteria from `__analysis.md`.]

## Prerequisites
- [Phase or condition that must be complete before starting]

## Steps

### 1. [Step Name]
- **Goal:** [What this step achieves]
- **Files:** [Files to create or modify]
- **Notes:** [Anything relevant]
- **Code:** *(optional)* [Snippet covering key logic, edge case, or error handling. Detailed data models in JSON. CLI calls include all required flags.]
- **Tests:** [Step-level verification: unit tests, assertions, or smoke checks to run immediately after this step]

### 2. [Step Name]
...

## Testing Requirements
> Integration and acceptance-level tests run after all steps in this phase are complete. These span multiple steps or verify end-to-end behaviour against acceptance criteria in `{spec-name}_analysis.md`.
- [ ] [Test case specific to this phase]

## Done Criteria
- [ ] [Verifiable condition indicating this phase is complete]
```

## Step 5: Quality Checklist

Before finalising:
- [ ] `{spec-name}_plan.md` is a lean index — no implementation detail, only summary, references, phase table, and approach
- [ ] Every phase in the index has a corresponding detail file
- [ ] Each detail file is self-contained enough for an agent to execute without reading the full plan
- [ ] References in each detail file are the subset relevant to that phase only
- [ ] Phase dependency order is documented in the index
- [ ] Done criteria in each detail file map to acceptance criteria in `{spec-name}_analysis.md`
- [ ] File names are zero-padded and kebab-cased

## Step 6: Output Summary

Report to the user:
1. **Files updated:**
   - `{working-dir}/specification/{spec-name}/{spec-name}_plan.md` (converted to index)
2. **Phase files created:**
   - `{working-dir}/specification/{spec-name}/plan/01-{phase}.md`
   - `{working-dir}/specification/{spec-name}/plan/02-{phase}.md`
   - *(list all)*
3. **Dependency order:** restate any sequencing constraints
4. **Next step:** use `/impl-specs` referencing the index or individual phase files

**Do not implement.** Stop after generating all plan files.
