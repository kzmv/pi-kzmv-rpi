---
name: grill
description: Grill Step — removes ambiguity from idea, research, analysis, or plan documents through targeted Q&A
---
# Grill Workflow

Reads one or more specification documents, identifies ambiguities, contradictions, and gaps, then resolves them through a structured Q&A loop. For each question, a recommended answer is provided — the user confirms, corrects, or rejects it. Resolved answers are written back across all affected documents.

## Step 1: Locate Documents

Determine `{working-dir}` and `{spec-name}` from context. If ambiguous, ask the user.

Read all present spec files for this spec:
- `{working-dir}/specification/{spec-name}__idea.md`
- `{working-dir}/specification/{spec-name}__research.md`
- `{working-dir}/specification/{spec-name}__analysis.md`
- `{working-dir}/specification/{spec-name}__plan.md`
- `{working-dir}/specification/{spec-name}/plan/*.md` (phase files if present)

If none of these exist, stop and ask the user what to grill.

## Step 2: Identify Issues

Scan all documents and catalogue every ambiguity, gap, or inconsistency. Classify each as:

- **Blocking** — cannot implement correctly without resolving this
- **Risk** — likely to cause rework or misalignment if left open
- **Minor** — wording or edge case that should be clarified but is not blocking

Look for:
- `[NEEDS CLARIFICATION]` items in any document
- Terms used inconsistently across documents
- Acceptance criteria that are not testable (too vague)
- User stories missing a clear actor, action, or outcome
- Edge cases described in one document but not handled in the plan
- Contradictions between documents (e.g. data model in research differs from plan)
- Assumptions stated as decisions without rationale
- Steps in the plan with no clear done criteria or testable outcome
- Data models that are underspecified or differ between documents

## Step 3: Grill Loop

Present issues in priority order: Blocking first, then Risk, then Minor. Ask 3–5 questions per round.

For each question, provide a recommended answer derived from context in the existing documents. The user only needs to confirm, correct, or reject.

Format:

```
## Round {N}

### Q{N}.1: [Blocking|Risk|Minor] — [Short issue title]
**Issue:** [One sentence describing the ambiguity or gap.]
**Found in:** [`__analysis.md` / `__plan.md` / etc.]
**Recommended answer:** [Your best answer given the available context. Be specific.]

---

### Q{N}.2: [Blocking|Risk|Minor] — [Short issue title]
**Issue:** [One sentence.]
**Found in:** [document]
**Recommended answer:** [Specific recommendation.]
```

**Stop and wait for user responses to the full round before making any changes.**

Once all responses for the round are received, update every affected document to reflect the resolved answers:
- Edit the existing content in place — rewrite the relevant section, sentence, or value to match the agreed answer.
- Do not add decision logs, resolution notes, or commentary sections. The document should read as if it was always written this way.
- Remove resolved `[NEEDS CLARIFICATION]` items entirely.
- If an answer affects the same concept in multiple documents, update all of them in the same pass.

Repeat rounds until one of:
- All Blocking and Risk items are resolved.
- The user states they are done.

## Step 4: Cross-Document Consistency Pass

After the Q&A loop, check that all documents are mutually consistent:

- Terminology: the same concept uses the same name everywhere.
- Data models: field names, types, and shapes match across research, analysis, and plan.
- Scope: nothing in the plan contradicts the Out of Scope section of the analysis.
- Acceptance criteria: every criterion in `__analysis.md` is addressed by at least one step or test in the plan.

Update any document where inconsistencies are found. List every change made.

## Step 5: Output Summary

Report to the user:
1. **Issues resolved:** list each item with the answer applied
2. **Documents updated:** list every file that was modified and what changed
3. **Remaining open items:** list any Minor issues the user chose to defer
4. **Next step:** if grilling is complete, the spec is ready for the next workflow stage (`/gen-specs`, `/detail-plan`, or `/impl-specs`)
