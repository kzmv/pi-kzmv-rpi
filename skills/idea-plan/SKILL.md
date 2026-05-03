---
name: idea-plan
description: Idea Plan Step — captures high-level concepts and north star direction
---
# Idea Plan Workflow

Use this workflow to capture a high-level idea with a clear north star vision. The idea document explains concepts, provides breakdowns, points to relevant documentation, and defines the direction to move towards. This becomes the starting point for deeper research and analysis.

## Step 1: Locate or Create Idea Context

Determine `{working-dir}` from workspace context (the project root). If ambiguous, ask the user.

Check for existing idea files in `{working-dir}/specification/{spec-name}/`:
- If the user references an existing spec name, read `{working-dir}/specification/{spec-name}/{spec-name}_idea.md`
- If this is a new idea, prepare to create a new idea file

If the user hasn't specified a spec name, ask for:
1. A short, kebab-cased name for this spec (e.g., `ai-powered-search`, `multi-tenant-auth`)
2. A one-sentence description of the north star vision

## Step 2: Capture the High-Level Concept (Q&A Loop)

Ask focused questions to understand and document the high-level concept and north star. Limit to 3–5 questions per round. After each round of answers, summarize what you've learned. Continue until you have enough to write a clear idea statement.

Focus areas:
1. **North Star** — What is the ultimate vision? What does success look like?
2. **Problems solved** — What pain points, inefficiencies, or opportunities does this address?
3. **Key concepts** — What are the main concepts or components involved?
4. **Documentation pointers** — What external docs, APIs, libraries, or standards are relevant?
5. **Scope boundaries** — What is explicitly in scope vs. out of scope?
6. **Breakdown** — What are the main parts or phases of this work?

Format:
```markdown
## Vision Questions — Round {N}

### Q1: [Topic]
[Question]

### Q2: [Topic]
[Question]
```

**Stop and wait for answers. Repeat rounds until you can articulate the vision clearly.**

After gathering answers, present a draft concept summary:

```
Draft Concept Summary:
[2–4 paragraphs capturing the north star, key concepts, and high-level breakdown]

Does this capture the essence of the idea? (yes / adjust)
```

**Stop and wait for confirmation.**

## Step 3: Identify High-Level Breakdown

Based on the concept, identify 3–8 high-level areas or phases that form the breakdown. These should be:
- **Conceptual** — describes what needs to happen, not how to implement it
- **Logical groupings** — related concerns or components grouped together
- **Ordered** — roughly sequenced based on dependencies or logical flow
- **Linked to north star** — each area clearly contributes to the vision

Breakdown areas might include:
- Key technical components or layers
- User-facing features or capabilities
- Infrastructure or foundational work
- Integration points or external dependencies
- Data models or core abstractions

Present the proposed breakdown to the user:

```
Proposed Breakdown:
1. [Area name] — [One-line description of what this covers]
2. [Area name] — [One-line description]
...

Does this breakdown make sense? (yes / adjust)
```

**Stop and wait for confirmation.**

## Step 4: Generate Idea File

Create `{working-dir}/specification/{spec-name}/{spec-name}_idea.md`:

```markdown
# {Spec Name} — Idea

## North Star
[2–4 paragraphs: the high-level vision and direction. What does success look like? Why does this matter? What is the ultimate goal?]

## Problems Solved
- [Pain point or opportunity addressed]
- [Pain point or opportunity addressed]

## Key Concepts
[Define the main concepts, components, or abstractions involved. Use plain language to establish a shared vocabulary.]

### [Concept Name]
[Brief explanation of what this concept means in the context of this idea.]

### [Concept Name]
[Brief explanation.]

## Documentation References
[Point to relevant external documentation, APIs, libraries, standards, or prior art.]

| Reference | Link | Relevance |
|---|---|---|
| [Name] | [URL or path] | [Why this matters for this idea] |

## Scope
### In Scope
- [What this idea includes]
- [What this idea includes]

### Out of Scope
- [What is explicitly deferred or excluded]
- [What is explicitly deferred or excluded]

## High-Level Breakdown
[The main areas or phases identified, in logical order.]

### 1. [Area Name]
[What this area covers and why it's important.]

### 2. [Area Name]
[What this area covers and why it's important.]

## Success Criteria
[How will you know when this is complete? High-level measurable outcomes.]
- [Criterion]
- [Criterion]

## Open Questions
- [ ] [Unresolved question to address in research/analysis]
- [ ] [Unresolved question]

## Next Action
Run `/research-and-analyse` to dive deeper into the technical details and clarify the approach.
```

## Step 5: Create Specification Directory Structure

Create the directory structure:
- `{working-dir}/specification/{spec-name}/`
- `{working-dir}/specification/{spec-name}/attachments/`

Place the idea file in `{working-dir}/specification/{spec-name}/`.

## Step 6: Optional Attachments

If the user has provided any diagrams, mockups, or reference materials during the Q&A, save them to `{working-dir}/specification/{spec-name}/attachments/` and reference them in the idea document.

## Step 7: Output Summary

Report to the user:
1. **Idea file created:**
   - `{working-dir}/specification/{spec-name}/{spec-name}_idea.md`
2. **Breakdown areas:** [count]
3. **Attachments:** *(if applicable)* list files in `attachments/`
4. **Next step:** Run `/research-and-analyse` to dive deeper into technical details and clarify the implementation approach

**Do not proceed with research or analysis.** Stop after generating the idea file.

---

## Updating an Existing Idea

When the user references an existing idea to revise or expand:

1. Read the existing idea file
2. Present the current state (north star, concepts, breakdown)
3. Ask what the user wants to change:
   - Refine the north star or vision?
   - Add or revise concepts?
   - Update scope boundaries?
   - Adjust the breakdown?
4. Make the requested updates
5. Report the changes made

**The idea document should remain high-level.** Detailed technical decisions belong in analysis and plan documents.
