---
name: gen-specs
description: Specification Generation Step
---
# Specification Generation Workflow

## Step 1: Locate Starting Context

Determine `{working-dir}` from workspace context (the project root where `specification/` lives). If ambiguous, ask the user.

Check for `{spec-name}__idea.md` in `{working-dir}/specification/`:
- If found, read it as the primary input.
- If not found, **stop and ask the user** to describe the feature or task in enough detail. Do not proceed with assumptions.

Also read if present:
- `{working-dir}/specification/{spec-name}__research.md` — context from the `/research-and-analyse` step

## Step 2: Clarify Before Proceeding

Identify open questions before generating any documents. Ask up to 5 per round; chunk further questions into follow-up rounds.

Focus areas:
1. **Scope** — What problem does this solve? What is explicitly out of scope?
2. **Actors** — Who uses this? What are their goals?
3. **Data** — What is created, read, updated, or deleted?
4. **Constraints** — Performance, security, compatibility, or integration limits.
5. **Edge Cases** — Failure modes, boundary conditions, error paths.

Format:
```markdown
## Clarifying Questions

### Q1: [Category]
[Question]

### Q2: [Category]
[Question]
```

**Stop and wait for responses before continuing.**

## Step 3: Generate Analysis Document

**Code conventions for this document:**
- Snippets should illustrate design patterns, API shape, and concept reuse — not implementation detail or edge cases.
- Data models must be detailed; prefer JSON.
- CLI commands must include all flags required to run them in sequence; reference official docs before specifying flags.
- Always link to official documentation before describing how a tool or API works.

Create `{working-dir}/specification/{spec-name}__analysis.md`:

```markdown
# {Spec Name} — Analysis

## Overview
[One paragraph: the problem being solved and the proposed solution approach.]

## User Stories
- As a [role], I want to [action] so that [outcome].
- As a [role], I want to [action] so that [outcome].

## Acceptance Criteria
- [ ] [Testable criterion]
- [ ] [Testable criterion]

## Edge Cases
| Scenario | Expected Behaviour |
|---|---|
| [Edge case] | [What should happen] |
| [Edge case] | [What should happen] |

## Design Decisions
### [Decision Title]
- **Choice:** [What was decided]
- **Rationale:** [Why]
- **Alternatives:** [Other options considered]

## Technical Requirements
1. [Requirement]
2. [Requirement]

## Code Patterns
[Snippets that document design patterns, API contracts, and structural conventions. Detailed JSON data models go here. CLI sequences must include all required flags and reference linked docs.]

## Out of Scope
- [Excluded item]

## [NEEDS CLARIFICATION]
- [ ] [Open question or ambiguity to resolve before implementation]

```

Place any supporting diagrams or reference files in `{working-dir}/specification/attachments/` and reference them with relative paths in the document.

## Step 4: Generate Implementation Plan

Before writing, estimate whether the full plan content will exceed ~10,000 tokens. If it will, write only the index structure (scope, references, phase breakdown) and call `/detail-plan` to produce the detail files. Do not write a monolithic plan file when the plan is large.

**Testing approach:**
- Each step has a `Tests` field for step-level verification — unit tests, assertions, or smoke checks run immediately after that step to confirm it is correct before moving on.
- `## Testing Requirements` at the end covers integration and acceptance-level tests that span multiple steps or verify end-to-end behaviour. These run after all steps are complete.

Create `{working-dir}/specification/{spec-name}__plan.md`:

```markdown
# {Spec Name} — Implementation Plan

## Scope
[Summary of what this plan covers.]

## References
> Carry forward from `{spec-name}__research.md`. Include only the sources directly relevant to implementation. This section gives any executing agent the minimum context needed without re-reading all prior documents.

| Source | Link / Path | Summary |
|---|---|---|
| [Name] | [URL or file path] | [One-line summary of what it provides] |

## Prerequisites
- [Any dependency or setup required before starting.]

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

## Step 5: Quality Checklist

Before finalising, verify:
- [ ] `{spec-name}__idea.md` or equivalent user input was used as context
- [ ] Every user story has at least one acceptance criterion
- [ ] Edge cases are documented in the analysis
- [ ] `[NEEDS CLARIFICATION]` items are flagged for any remaining ambiguities
- [ ] No project-specific assumptions are hardcoded without basis in provided context
- [ ] Attachments referenced in documents exist in `{working-dir}/specification/attachments/`
- [ ] Plan references section is populated from `__research.md` (links + summaries)
- [ ] Plan steps are specific and actionable
- [ ] If plan exceeds ~10,000 tokens, `/detail-plan` was called instead of writing a monolithic file

## Step 6: Output Summary

Report to the user:
1. **Files created:**
   - `{working-dir}/specification/{spec-name}__analysis.md`
   - `{working-dir}/specification/{spec-name}__plan.md` (or index + detail files if `/detail-plan` was called)
2. **Attachments:** list any files placed in `attachments/`
3. **Open items:** list any `[NEEDS CLARIFICATION]` entries
4. **Next step:** use `/impl-specs` to execute the implementation plan

**Do not implement.** Stop after generating specification files.
