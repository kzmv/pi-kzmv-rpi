---
name: research-and-analyse
description: Research and Analysis Step
---
# Research and Analysis Workflow

## Step 1: Locate Starting Context

Determine `{working-dir}` from workspace context (the project root where `specification/` lives). If ambiguous, ask the user.

Check for `{spec-name}__idea.md` in `{working-dir}/specification/`:
- If found, read it as the starting point.
- If not found, **stop and ask the user** to describe the high-level idea. Do not proceed with assumptions.

## Step 2: Understand the Problem Space (Q&A Loop)

Ask focused questions to build a shared understanding of the problem space. Limit to 3–5 questions per round. After each round of answers, assess whether the direction is clear. Continue until the user confirms the direction is understood.

Focus areas:
1. **Problem** — What is being solved? For whom?
2. **Context** — What existing systems, codebases, or services are involved?
3. **External references** — Relevant documentation, repos, libraries, or APIs?
4. **Constraints** — Technical, organisational, or timeline limits?
5. **Success criteria** — How is the right direction identified?

Format:
```markdown
## Research Questions

### Q1: [Topic]
[Question]

### Q2: [Topic]
[Question]
```

**Stop and wait for answers. Repeat rounds until the user confirms the direction is clear.**

## Step 3: Curate Sources and References

Gather and organise relevant context. For each source, capture:
- What it is
- Why it is relevant
- Where to find it (URL, file path, repo, or reference)

Source types to consider:
- External documentation (APIs, libraries, standards, specs)
- Internal code references (files, modules, services, interfaces)
- Prior art or comparable implementations (external repos, articles)
- Architecture diagrams or decision records already in the project

Store any downloaded or generated reference files (diagrams, exported docs, screenshots) in `{working-dir}/specification/attachments/`.

## Step 4: Generate Research Document

**Code conventions for this document:**
- Snippets may be pseudo-code; they do not need to compile or run.
- Keep snippets short — enough to communicate the idea, not a full implementation.
- Data model definitions prefer JSON over class or type syntax.
- CLI commands: show intent and general shape only; not all flags need to be included.
- Always link to official documentation before describing how a tool or API works.

Create `{working-dir}/specification/{spec-name}__research.md`:

```markdown
# {Spec Name} — Research

## Summary
[2–3 sentences: the problem space and the scope of this research.]

## Direction Decision
[Clear statement of the chosen general direction. What approach is being taken and why.]

## Key Sources and References

### Internal Code References
| Reference | Path / Location | Relevance |
|---|---|---|
| [Name] | [file path or module] | [Why relevant] |

### External References
| Reference | URL or source | Relevance |
|---|---|---|
| [Name] | [URL] | [Why relevant] |

### Attachments
| File | Description |
|---|---|
| `attachments/{filename}` | [What it contains] |

## Technical Sketches
[Optional. Pseudo-code, JSON shapes, or short snippets that communicate the core idea. Does not need to compile. Link to relevant docs from Key Sources above before describing any tool or API.]

## Alternatives Considered
### [Alternative A]
- **Summary:** [Brief description]
- **Reason not chosen:** [Why rejected or deferred]

## Context to Carry Forward
[Knowledge, decisions, and constraints that /gen-specs should use.]
- [Item]
- [Item]

## General Idea Summary
[1–2 paragraphs: plain-language description of what is being built and the chosen approach. Written as a brief for the specification step.]

## Open Questions
- [ ] [Unresolved item for /gen-specs to address]
```

## Step 5: Attachments

Place supporting files in `{working-dir}/specification/attachments/`:
- Architecture diagrams (`.excalidraw.svg`, `.svg`, `.png`)
- Screenshots or reference images
- Exported documentation or external specs

Reference all attachments from the research document using relative paths.

## Step 6: Output Summary

Report to the user:
1. **Files created:**
   - `{working-dir}/specification/{spec-name}__research.md`
2. **Attachments:** list any files placed in `attachments/`
3. **Open questions:** list unresolved items for the next step
4. **Next step:** run `/gen-specs` to produce the detailed analysis and implementation plan

**Do not produce implementation plans or detailed specifications here.** Detailed planning is handled by `/gen-specs`.
