---
name: grill
description: Grill Step — validates and challenges concepts across the specification process
---
# Grill Workflow

Reads one or more specification documents (idea, analysis, or plan), identifies ambiguities, contradictions, and gaps, then resolves them through a structured Q&A loop. For each question, a recommended answer is provided — the user confirms, corrects, or rejects it. Resolved answers are written back across all affected documents.

This skill can be used at any stage to validate and challenge concepts, ensuring clarity before moving forward.

## Step 1: Locate Documents

Determine `{working-dir}` and `{spec-name}` from context. If ambiguous, ask the user.

Read all present spec files for this spec:
- `{working-dir}/specification/{spec-name}/{spec-name}_idea.md`
- `{working-dir}/specification/{spec-name}/{spec-name}_analysis.md`
- `{working-dir}/specification/{spec-name}/{spec-name}_plan.md`
- `{working-dir}/specification/{spec-name}/plan/*.md` (phase files if present)

If none of these exist, stop and ask the user what to grill.

## Step 2: Identify Issues

Scan all documents and catalogue every ambiguity, gap, or inconsistency. Classify each as:

- **Blocking** — cannot implement correctly without resolving this
- **Risk** — likely to cause rework or misalignment if left open
- **Minor** — wording or edge case that should be clarified but is not blocking

Look for:
- Open questions in any document
- Terms used inconsistently across documents
- Concepts defined in idea but not carried through to analysis
- Technical decisions in analysis without clear rationale
- Contradictions between documents (e.g., scope in idea differs from plan)
- Assumptions stated as facts without justification
- Steps in the plan with no clear done criteria or testable outcome
- Data models that are underspecified or differ between documents
- Missing references or documentation pointers

## Step 3: Grill Loop

Present issues in priority order: Blocking first, then Risk, then Minor. Ask 3–5 questions per round.

For each question, provide a recommended answer derived from context in the existing documents. The user only needs to confirm, correct, or reject.

Format:

```
## Round {N}

### Q{N}.1: [Blocking|Risk|Minor] — [Short issue title]
**Issue:** [One sentence describing the ambiguity or gap.]
**Found in:** [`{spec-name}_idea.md` / `{spec-name}_analysis.md` / `{spec-name}_plan.md` / etc.]
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
- Remove resolved open questions entirely.
- If an answer affects the same concept in multiple documents, update all of them in the same pass.

Repeat rounds until one of:
- All Blocking and Risk items are resolved.
- The user states they are done.

## Step 4: Cross-Document Consistency Pass

After the Q&A loop, check that all documents are mutually consistent:

- Terminology: the same concept uses the same name everywhere.
- Concepts: key concepts from `_idea.md` are properly elaborated in `_analysis.md`.
- Data models: field names, types, and shapes match across analysis and plan.
- Scope: nothing in the plan contradicts the scope boundaries in the idea or analysis.
- Technical decisions: decisions in analysis are reflected in the plan implementation.

Update any document where inconsistencies are found. List every change made.

## Step 5: Output Summary

Report to the user:
1. **Issues resolved:** list each item with the answer applied
2. **Documents updated:** list every file that was modified and what changed
3. **Remaining open items:** list any Minor issues the user chose to defer
4. **Next step:** if grilling is complete, the spec is ready for the next workflow stage (`/gen-specs`, `/detail-plan`, or `/impl-specs`)
