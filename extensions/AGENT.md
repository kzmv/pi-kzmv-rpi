# Agent Extension Development Guidelines

This document provides guidance for developing extensions that integrate CLI tools with Pi.

## Architecture Principle: Separation of Concerns

When developing CLI-like tools for Pi, follow this separation:

### 1. **Core Implementation** (Standalone)
The actual business logic should be implemented as a **standalone executable** that can run independently of Pi:

- **Shell Scripts**: Use `tools/{tool-name}.sh` for bash-based implementations
- **TypeScript Tools**: Use `tools/{tool-name}.ts` for complex logic that benefits from TypeScript

These should:
- Be independently testable
- Work without Pi installed
- Accept arguments via CLI
- Return results via stdout/stderr
- Exit with appropriate status codes

### 2. **Pi Integration Layer** (Extension)
The extension file `extensions/{tool-name}.ts` should **only** be responsible for:

- Registering the tool with Pi's extension system
- Defining the tool's schema (parameters, descriptions)
- Calling the standalone tool implementation
- Formatting results for Pi's context

## Example Structure

```
pi-package/
├── tools/                    # Standalone implementations
│   ├── export-context.sh     # Bash script doing the work
│   └── validate-specs.ts     # TypeScript tool doing the work
├── extensions/               # Pi integration layer
│   ├── export-context.ts     # Wraps tools/export-context.sh
│   └── validate-specs.ts     # Wraps tools/validate-specs.ts
```

## Benefits

- **Reusability**: Tools can be used outside of Pi
- **Testing**: Easier to test standalone scripts
- **Maintenance**: Clear separation of tool logic vs. Pi integration
- **Portability**: Tools can be ported to other environments
- **Debugging**: Can test tools directly without Pi overhead

## Example: export-context

**Standalone Tool**: `export-context.sh`
```bash
#!/bin/bash
# Pure business logic - no Pi dependencies
TARGET=$1
SCOPE=$2
OUTPUT_DIR=$3
# ... actual export logic ...
```

**Pi Extension**: `extensions/export-context.ts`
```typescript
// Only Pi integration - calls the standalone tool
import { tool } from "@mariozechner/pi-coding-agent";
import { exec } from "child_process";

export const exportContext = tool({
  name: "export_context",
  description: "Export prompts/skills to target format",
  parameters: { /* schema */ },
  execute: async (params) => {
    // Call the standalone tool
    const scriptPath = path.join(__dirname, "../export-context.sh");
    return exec(`bash ${scriptPath} ${params.target} ${params.scope}`);
  }
});
```

## When to Deviate

Use a single `.ts` file in extensions when:
- The tool is trivial (< 50 lines)
- The logic is Pi-specific (e.g., inspecting Pi's internal state)
- No standalone use case exists
