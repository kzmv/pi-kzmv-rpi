---
name: research-and-analyse
description: Research and Analysis Step — deep dive into technical details and clarification
---
# Research and Analysis Workflow

Focuses on deep diving into a topic, figuring out documentation, clarifying concepts, and ensuring shared technical understanding. This step transforms a high-level idea into detailed analysis ready for planning.

## Step 1: Locate Starting Context

Determine `{working-dir}` and `{spec-name}` from workspace context. If ambiguous, ask the user.

Check for `{working-dir}/specification/{spec-name}/{spec-name}_idea.md`:
- If found, read it as the starting point.
- If not found, **stop and ask the user** to run `/idea-plan` first or provide the high-level concept.

## Step 2: Deep Dive into Technical Details (Q&A Loop)

Ask focused questions to dive deeper into technical details and clarify the approach. Limit to 3–5 questions per round. After each round of answers, assess whether you have enough clarity. Continue until the user confirms the technical direction is understood.

Focus areas:
1. **Technical approach** — What technologies, libraries, or patterns should be used?
2. **Existing systems** — What codebases, services, or APIs are involved?
3. **Documentation** — What official docs, specs, or standards apply?
4. **Constraints** — Performance, security, compatibility limits?
5. **Language and terminology** — Are we using terms consistently? Do we speak the same technical language?

Format:
```markdown
## Research Questions — Round {N}

### Q1: [Topic]
[Question]

### Q2: [Topic]
[Question]
```

**Stop and wait for answers. Repeat rounds until the user confirms the technical direction is clear.**

## Step 3: Curate Sources and References

Gather and organise relevant technical context. For each source, capture:
- What it is
- Why it is relevant
- Where to find it (URL, file path, repo, or reference)

Source types to consider:
- External documentation (APIs, libraries, standards, specs)
- Internal code references (files, modules, services, interfaces)
- Prior art or comparable implementations (external repos, articles)
- Architecture diagrams or decision records

Store any downloaded or generated reference files (diagrams, exported docs, screenshots) in `{working-dir}/specification/{spec-name}/attachments/`.

## Step 4: Generate Analysis Document

**Code conventions for this document:**
- Snippets may be pseudo-code; they do not need to compile or run.
- Keep snippets short — enough to communicate the technical approach, not a full implementation.
- Data model definitions prefer JSON over class or type syntax.
- CLI commands: show intent and general shape; include key flags but not necessarily all.
- Always link to official documentation before describing how a tool or API works.

Create `{working-dir}/specification/{spec-name}/{spec-name}_analysis.md`:

```markdown
# {Spec Name} — Analysis

## Summary
[2–3 sentences: the problem space and the technical approach chosen.]

## Technical Direction
[Clear statement of the chosen technical direction. What approach is being taken and why? What technologies, patterns, or architectures apply?]

## Terminology and Concepts
[Define technical terms and concepts to ensure shared understanding. Clarify any domain-specific language.]

### [Term or Concept]
[Definition and how it applies to this work.]

## Key Sources and References

### Internal Code References
| Reference | Path / Location | Relevance |
|---|---|---|
| [Name] | [file path or module] | [Why relevant] |

### External Documentation
| Reference | URL or source | Relevance |
|---|---|---|
| [Name] | [URL] | [Why relevant] |

### Attachments
| File | Description |
|---|---|
| `attachments/{filename}` | [What it contains] |

## Technical Sketches
[Optional. Pseudo-code, JSON shapes, or short snippets that communicate the technical approach. Does not need to compile. Link to relevant docs from Key Sources above before describing any tool or API.]

## Alternatives Considered
### [Alternative A]
- **Summary:** [Brief description]
- **Reason not chosen:** [Why rejected or deferred]

## Design Decisions
### [Decision Title]
- **Decision:** [What was decided]
- **Rationale:** [Why this approach was chosen]
- **Trade-offs:** [What was gained and what was sacrificed]

## Constraints and Requirements
[Technical constraints, performance requirements, compatibility needs, security considerations.]
- [Constraint or requirement]

## Dependencies
[External libraries, services, or systems this work depends on.]
- [Dependency and version if applicable]

## Open Questions
- [ ] [Unresolved technical question to address in planning]
- [ ] [Unresolved question]
```

## Step 5: Attachments

Place supporting files in `{working-dir}/specification/{spec-name}/attachments/`:
- Architecture diagrams (`.excalidraw.svg`, `.svg`, `.png`)
- Screenshots or reference images
- Exported documentation or external specs

Reference all attachments from the analysis document using relative paths (e.g., `attachments/diagram.svg`).

## Step 6: Output Summary

Report to the user:
1. **Files created:**
   - `{working-dir}/specification/{spec-name}/{spec-name}_analysis.md`
2. **Attachments:** list any files placed in `attachments/`
3. **Open questions:** list unresolved technical items for the next step
4. **Next step:** run `/gen-specs` to break down the analysis into an executable implementation plan

**Do not produce implementation plans here.** Planning is handled by `/gen-specs`.
