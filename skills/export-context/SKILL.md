---
name: export-context
description: Export context engineering prompts and skills to a target agentic environment
---
# Export Context Workflow

Exports the prompts and skills from this pi package into the format expected by a target agentic environment. Uses the `export_context` tool registered by the `extensions/export-context.ts` extension.

## Supported Targets

| Target | Output location | Format |
|---|---|---|
| `windsurf` | `.windsurf/workflows/` | One `.md` workflow file per prompt/skill, frontmatter `description:` |
| `claude` | `.claude/commands/` | One `.md` slash-command file per prompt/skill, `# Title` heading |
| `gemini` | `GEMINI.md` + `.gemini/instructions/` | Individual instruction files `@`-referenced from `GEMINI.md` |
| `agent-skills` | `prompts/` + `skills/` | Pi/agentskills.io open format — preserves the original file structure |

### Skill resolution
Prompts that reference a skill via `Read \`skills/{name}/SKILL.md\`` are automatically expanded: the full skill body is inlined into the exported file so the target environment receives complete, self-contained instructions.

Skills that are already covered by a linked prompt are not exported as separate files. Skills without a linked prompt are exported as standalone entries.

## Step 1: Confirm Parameters

Ask the user:
1. **Target** — which environment to export to (`windsurf`, `claude`, `gemini`, or `agent-skills`)
2. **Output directory** — where to write the exported files (defaults to the current working directory if omitted)

## Step 2: Invoke the Tool

Call the `export_context` tool with the confirmed parameters:

```
export_context(target: "<target>", output_dir: "<path>")
```

The tool reads all prompts from `prompts/` and all skills from `skills/*/SKILL.md`, applies the appropriate transformation, and writes files to the output directory.

## Step 3: Report Output

After the tool completes, report to the user:
1. **Files written** — list each file and its path
2. **Target format** — what was produced and where
3. **Next steps** — e.g. commit the exported files to the target project, or copy them to the relevant config directory

## Notes

- Running the export again overwrites previously exported files.
- The `/export-context` command can also be used directly in pi: `/export-context <target> [output-dir]`
- The `agent-skills` target is useful for sharing or publishing the package in the open agentskills.io format.
