---
name: gen-specs
description: Specification Generation Step — breaks down analysis into executable plan
---
# Specification Generation Workflow

Transforms analysis into an executable implementation plan with concrete, actionable steps.

## Step 1: Locate Starting Context

Determine `{working-dir}` and `{spec-name}` from workspace context. If ambiguous, ask the user.

Read the following files:
- `{working-dir}/specification/{spec-name}/{spec-name}_analysis.md` — **required**, technical direction and decisions
- `{working-dir}/specification/{spec-name}/{spec-name}_idea.md` — optional, high-level context

If `{spec-name}_analysis.md` does not exist, **stop and ask the user** to run `/research-and-analyse` first.

## Step 2: Clarify Before Planning

Review the analysis for any unresolved `## Open Questions`. If present, address them before generating the plan. Ask up to 5 per round.

Additional clarification areas if needed:
1. **Implementation details** — Specific files, modules, or functions to modify?
2. **Data structures** — Are all data models fully specified?
3. **Testing strategy** — What level of testing is expected?
4. **Deployment** — Any migration or rollout considerations?
5. **Edge cases** — Are all error paths and boundary conditions clear?

Format:
```markdown
## Clarifying Questions

### Q1: [Category]
[Question]

### Q2: [Category]
[Question]
```

**Stop and wait for responses before continuing.**

## Step 3: Generate Implementation Plan

Before writing, estimate whether the full plan content will exceed ~10,000 tokens. If it will, write only the index structure (scope, references, phase breakdown) and **stop**, instructing the user to run `/detail-plan` to produce the detail files. Do not write a monolithic plan file when the plan is large.

**Testing approach:**
- Each step has a `Tests` field for step-level verification — unit tests, assertions, or smoke checks run immediately after that step to confirm it is correct before moving on.
- `## Testing Requirements` at the end covers integration and acceptance-level tests that span multiple steps or verify end-to-end behaviour. These run after all steps are complete.

**Code conventions for the plan:**
- Snippets must cover edge cases and error handling patterns, not just the happy path.
- Data models must be detailed; prefer JSON.
- CLI commands must include all flags required to run them; reference official docs before specifying flags.
- Always link to official documentation before describing how a tool or API works.

Create `{working-dir}/specification/{spec-name}/{spec-name}_plan.md`:

```markdown
# {Spec Name} — Implementation Plan

## Summary
[2-3 sentences: what this plan implements and the approach taken.]

## References
> Carry forward from `{spec-name}_analysis.md`. Include only the sources directly relevant to implementation.

| Source | Link / Path | Summary |
|---|---|---|
| [Name] | [URL or file path] | [One-line summary of what it provides] |

## Prerequisites
- [Any dependency or setup required before starting]

## Implementation Steps

### 1. [Step Name]
- **Goal:** [What this step achieves]
- **Files:** [Files to create or modify]
- **Notes:** [Anything relevant]
- **Code:** *(optional)* [Snippet covering key logic, edge case, or error handling. Detailed data models in JSON. CLI calls include all required flags.]
- **Tests:** [Step-level verification: unit tests, assertions, or smoke checks to run immediately after this step]

### 2. [Step Name]
...

## Testing Requirements
> Integration and acceptance-level tests run after all steps are complete. These span multiple steps or verify end-to-end behaviour against acceptance criteria in `__analysis.md`.
- [ ] [Test case]
- [ ] [Test case]

## Rollout Notes
[Migration steps, feature flags, or deployment considerations if applicable.]

```

## Step 4: Quality Checklist

Before finalising, verify:
- [ ] `{spec-name}_analysis.md` was used as the primary input
- [ ] All open questions from analysis are resolved
- [ ] Plan steps are specific and actionable
- [ ] Each step has clear files to create/modify
- [ ] Step-level tests are defined for each step
- [ ] Integration tests are defined at the end
- [ ] References section is populated from `_analysis.md`
- [ ] If plan exceeds ~10,000 tokens, stop and instruct user to run `/detail-plan`

## Step 5: Output Summary

Report to the user:
1. **Files created:**
   - `{working-dir}/specification/{spec-name}/{spec-name}_plan.md`
2. **Steps:** [count]
3. **Large plan:** if plan is large, note that user should run `/detail-plan` next
4. **Next step:** 
   - If plan is manageable size: run `/impl-specs` to execute
   - If plan is large: run `/detail-plan` to split into phases first

**Do not implement.** Stop after generating the plan file.
