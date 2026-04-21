import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { StringEnum, Type } from "@mariozechner/pi-ai";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

type Target = "windsurf" | "claude" | "gemini" | "agent";
type Scope = "prompts" | "skills" | "both";

const EXCLUDED = new Set(["export-context"]);

interface PromptEntry {
	name: string;
	description: string;
	body: string;
}

interface SkillEntry {
	dirName: string;
	name: string;
	description: string;
	body: string;
}

function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { meta: {}, body: content.trim() };
	const meta: Record<string, string> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const colon = line.indexOf(": ");
		if (colon !== -1) meta[line.slice(0, colon).trim()] = line.slice(colon + 2).trim();
	}
	return { meta, body: match[2].trim() };
}

async function loadPackage(): Promise<{ prompts: PromptEntry[]; skills: SkillEntry[] }> {
	const promptsDir = join(packageRoot, "prompts");
	const skillsDir = join(packageRoot, "skills");

	const promptFiles = (await readdir(promptsDir)).filter((f: string) => f.endsWith(".md"));
	const allPrompts: PromptEntry[] = await Promise.all(
		promptFiles.map(async (file: string) => {
			const raw = await readFile(join(promptsDir, file), "utf-8");
			const { meta, body } = parseFrontmatter(raw);
			return { name: meta.name ?? file.replace(/\.md$/, ""), description: meta.description ?? "", body };
		}),
	);
	const prompts = allPrompts.filter((p) => !EXCLUDED.has(p.name));

	const entries = await readdir(skillsDir, { withFileTypes: true });
	const allSkills: (SkillEntry | null)[] = await Promise.all(
		entries
			.filter((d: { isDirectory(): boolean }) => d.isDirectory())
			.map(async (d: { name: string }) => {
				try {
					const raw = await readFile(join(skillsDir, d.name, "SKILL.md"), "utf-8");
					const { meta, body } = parseFrontmatter(raw);
					return { dirName: d.name, name: meta.name ?? d.name, description: meta.description ?? "", body };
				} catch {
					return null;
				}
			}),
	);
	const skills = allSkills
		.filter((s: SkillEntry | null): s is SkillEntry => s !== null)
		.filter((s: SkillEntry) => !EXCLUDED.has(s.dirName) && !EXCLUDED.has(s.name));

	return { prompts, skills };
}

// --- Format helpers ---

function windsurfFm(description: string, body: string): string {
	return `---\ndescription: ${description}\n---\n${body}\n`;
}

function markdownDoc(title: string, body: string): string {
	return `# ${title}\n\n${body}\n`;
}

// --- Export targets ---

async function exportWindsurf(outputDir: string, scope: Scope, prompts: PromptEntry[], skills: SkillEntry[]): Promise<string[]> {
	const written: string[] = [];

	if (scope === "prompts" || scope === "both") {
		const dir = join(outputDir, ".windsurf", "workflows");
		await mkdir(dir, { recursive: true });
		for (const p of prompts) {
			const outPath = join(dir, `${p.name}.md`);
			await writeFile(outPath, windsurfFm(p.description, p.body), "utf-8");
			written.push(outPath);
		}
	}

	if (scope === "skills" || scope === "both") {
		const dir = join(outputDir, ".windsurf", "skills");
		await mkdir(dir, { recursive: true });
		for (const s of skills) {
			const outPath = join(dir, `${s.name}.md`);
			await writeFile(outPath, windsurfFm(s.description, s.body), "utf-8");
			written.push(outPath);
		}
	}

	return written;
}

async function exportClaude(outputDir: string, scope: Scope, prompts: PromptEntry[], skills: SkillEntry[]): Promise<string[]> {
	const written: string[] = [];

	if (scope === "prompts" || scope === "both") {
		const dir = join(outputDir, ".claude", "commands");
		await mkdir(dir, { recursive: true });
		for (const p of prompts) {
			const outPath = join(dir, `${p.name}.md`);
			await writeFile(outPath, markdownDoc(p.description || p.name, p.body), "utf-8");
			written.push(outPath);
		}
	}

	if (scope === "skills" || scope === "both") {
		const dir = join(outputDir, ".claude", "skills");
		await mkdir(dir, { recursive: true });
		for (const s of skills) {
			const outPath = join(dir, `${s.name}.md`);
			await writeFile(outPath, markdownDoc(s.description || s.name, s.body), "utf-8");
			written.push(outPath);
		}
	}

	return written;
}

async function exportGemini(outputDir: string, scope: Scope, prompts: PromptEntry[], skills: SkillEntry[]): Promise<string[]> {
	const written: string[] = [];

	if (scope === "prompts" || scope === "both") {
		const dir = join(outputDir, ".gemini", "commands");
		await mkdir(dir, { recursive: true });
		for (const p of prompts) {
			const outPath = join(dir, `${p.name}.md`);
			await writeFile(outPath, markdownDoc(p.description || p.name, p.body), "utf-8");
			written.push(outPath);
		}
	}

	if (scope === "skills" || scope === "both") {
		const dir = join(outputDir, ".gemini", "skills");
		await mkdir(dir, { recursive: true });
		for (const s of skills) {
			const outPath = join(dir, `${s.name}.md`);
			await writeFile(outPath, markdownDoc(s.description || s.name, s.body), "utf-8");
			written.push(outPath);
		}
	}

	return written;
}

async function exportAgent(outputDir: string, scope: Scope, prompts: PromptEntry[], skills: SkillEntry[]): Promise<string[]> {
	const written: string[] = [];

	if (scope === "prompts" || scope === "both") {
		const dir = join(outputDir, ".agent", "prompts");
		await mkdir(dir, { recursive: true });
		for (const p of prompts) {
			const outPath = join(dir, `${p.name}.md`);
			await writeFile(outPath, markdownDoc(p.description || p.name, p.body), "utf-8");
			written.push(outPath);
		}
	}

	if (scope === "skills" || scope === "both") {
		const dir = join(outputDir, ".agent", "skills");
		await mkdir(dir, { recursive: true });
		for (const s of skills) {
			const outPath = join(dir, `${s.name}.md`);
			await writeFile(outPath, markdownDoc(s.description || s.name, s.body), "utf-8");
			written.push(outPath);
		}
	}

	return written;
}

async function runExport(
	target: Target,
	scope: Scope,
	outputDir: string,
): Promise<{ written: string[]; summary: string }> {
	const { prompts, skills } = await loadPackage();

	let written: string[];
	let label: string;

	switch (target) {
		case "windsurf":
			written = await exportWindsurf(outputDir, scope, prompts, skills);
			label = "Windsurf (.windsurf/workflows/ | .windsurf/skills/)";
			break;
		case "claude":
			written = await exportClaude(outputDir, scope, prompts, skills);
			label = "Claude (.claude/commands/ | .claude/skills/)";
			break;
		case "gemini":
			written = await exportGemini(outputDir, scope, prompts, skills);
			label = "Gemini (.gemini/commands/ | .gemini/skills/)";
			break;
		case "agent":
			written = await exportAgent(outputDir, scope, prompts, skills);
			label = "Agent (.agent/prompts/ | .agent/skills/)";
			break;
		default:
			throw new Error(`Unknown target: ${target}`);
	}

	const counts = [
		scope !== "skills" ? `${prompts.length} prompt(s)` : null,
		scope !== "prompts" ? `${skills.length} skill(s)` : null,
	]
		.filter(Boolean)
		.join(" and ");

	const summary = [
		`Exported ${counts} → ${label}`,
		`Output: ${outputDir}`,
		`Files written (${written.length}):`,
		...written.map((f) => `  ${f}`),
	].join("\n");

	return { written, summary };
}

// --- Extension entry point ---

export default function (pi: ExtensionAPI) {
	pi.registerTool({
		name: "export_context",
		label: "Export Context",
		description:
			"Export prompts and/or skills from this pi package into the format expected by a target agentic environment. Ask the user which scope (prompts, skills, or both) and which target (windsurf, claude, gemini, or agent) they want.",
		promptSnippet: "Export prompts/skills to windsurf, claude, gemini, or agent format",
		parameters: Type.Object({
			target: StringEnum(["windsurf", "claude", "gemini", "agent"] as const),
			scope: StringEnum(["prompts", "skills", "both"] as const),
			output_dir: Type.Optional(
				Type.String({
					description: "Output directory path. Defaults to the current working directory.",
				}),
			),
		}),
		async execute(_toolCallId, params, _signal, onUpdate, ctx) {
			const outputDir = params.output_dir ? resolve(ctx.cwd, params.output_dir) : ctx.cwd;

			onUpdate?.({
				content: [{ type: "text", text: `Exporting [${params.scope}] to ${params.target}...` }],
				details: {},
			});

			const { written, summary } = await runExport(
				params.target as Target,
				params.scope as Scope,
				outputDir,
			);

			return {
				content: [{ type: "text", text: summary }],
				details: { target: params.target, scope: params.scope, outputDir, written },
			};
		},
	});

	pi.registerCommand("export-context", {
		description: "Export prompts/skills to windsurf | claude | gemini | agent",
		handler: async (args, ctx) => {
			const parts = (args ?? "").trim().split(/\s+/).filter(Boolean);
			const target = parts[0] as Target | undefined;
			const scope = (parts[1] as Scope | undefined) ?? "both";
			const outputDir = parts[2] ? resolve(ctx.cwd, parts[2]) : ctx.cwd;

			const validTargets: Target[] = ["windsurf", "claude", "gemini", "agent"];
			const validScopes: Scope[] = ["prompts", "skills", "both"];

			if (!target || !validTargets.includes(target)) {
				ctx.ui.notify(
					`Usage: /export-context <target> [scope] [output-dir]\nTargets: windsurf, claude, gemini, agent\nScopes: prompts, skills, both (default: both)`,
					"error",
				);
				return;
			}

			if (!validScopes.includes(scope)) {
				ctx.ui.notify(`Invalid scope "${scope}". Must be: prompts, skills, both`, "error");
				return;
			}

			ctx.ui.notify(`Exporting [${scope}] to ${target}...`, "info");
			try {
				const { summary } = await runExport(target, scope, outputDir);
				ctx.ui.notify(summary, "info");
			} catch (err) {
				ctx.ui.notify(`Export failed: ${String(err)}`, "error");
			}
		},
	});
}
