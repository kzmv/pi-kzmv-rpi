#!/bin/bash

# Usage: ./export-context.sh <target> [scope] [output-dir]
# Targets: windsurf, claude, gemini, agent
# Scopes: prompts, skills, both (default: both)
#
# Based on the export-context skill specification:
# - Skills referenced by prompts are inlined into the prompt export
# - Skills without a linked prompt are exported separately
# - Each target has its own format and output location

set -e

TARGET=$1
SCOPE=${2:-both}
OUTPUT_DIR=${3:-$(pwd)}

if [[ -z "$TARGET" ]]; then
    echo "Usage: $0 <target> [scope] [output-dir]"
    echo "Targets: windsurf, claude, gemini, agent"
    echo "Scopes: prompts, skills, both (default: both)"
    exit 1
fi

# Map target to output directories and formats
case "$TARGET" in
    windsurf)
        PROMPT_DIR=".windsurf/workflows"
        SKILL_DIR=".windsurf/workflows"
        FORMAT="windsurf"
        ;;
    claude)
        PROMPT_DIR=".claude/commands"
        SKILL_DIR=".claude/commands"
        FORMAT="claude"
        ;;
    gemini)
        PROMPT_DIR=".gemini/instructions"
        SKILL_DIR=".gemini/instructions"
        FORMAT="gemini"
        USE_INDEX=1
        ;;
    agent)
        PROMPT_DIR="prompts"
        SKILL_DIR="skills"
        FORMAT="agent"
        ;;
    *)
        echo "Unknown target: $TARGET"
        exit 1
        ;;
esac

EXCLUDED="export-context"

# Track which skills have been referenced by prompts
declare -A REFERENCED_SKILLS

# Function to inline skill content
inline_skill() {
    local skill_path=$1
    if [[ -f "$skill_path" ]]; then
        # Strip frontmatter from skill (both opening and closing ---)
        awk 'BEGIN{p=0} /^---$/{if(p==0){p=1;next}else{p=2;next}} p==2{print}' "$skill_path"
    else
        echo "[Skill not found: $skill_path]"
    fi
}

# Function to export a prompt
export_prompt() {
    local src=$1
    local dest_dir=$2
    local filename=$(basename "$src")
    local name="${filename%.*}"

    # Skip excluded
    if [[ "$name" == "$EXCLUDED" ]]; then return; fi

    mkdir -p "$dest_dir"

    local content=$(cat "$src")
    
    # Extract frontmatter fields
    local description=$(echo "$content" | grep "^description: " | head -n 1 | sed 's/^description: //')
    local meta_name=$(echo "$content" | grep "^name: " | head -n 1 | sed 's/^name: //')
    
    if [[ -n "$meta_name" ]]; then name="$meta_name"; fi
    
    # Strip frontmatter for body
    local body=$(echo "$content" | sed '1{/^---$/{:a;n;/^---$/!ba;d}}')

    # Check if body references a skill using the pattern: Read `skills/{name}/SKILL.md`
    local skill_ref=$(echo "$body" | grep -oP 'Read `skills/\K[^/]+(?=/SKILL\.md)' | head -n 1)
    
    if [[ -n "$skill_ref" ]]; then
        # Mark this skill as referenced
        REFERENCED_SKILLS["$skill_ref"]=1
        
        # Inline the skill content
        local skill_path="skills/$skill_ref/SKILL.md"
        if [[ -f "$skill_path" ]]; then
            body=$(inline_skill "$skill_path")
        fi
    fi

    local out_path="$dest_dir/$name.md"
    
    case "$FORMAT" in
        windsurf)
            {
                echo "---"
                echo "description: ${description:-$name}"
                echo "---"
                echo "$body"
            } > "$out_path"
            ;;
        claude)
            {
                echo "# ${description:-$name}"
                echo ""
                echo "$body"
            } > "$out_path"
            ;;
        gemini)
            {
                echo "# ${description:-$name}"
                echo ""
                echo "$body"
            } > "$out_path"
            ;;
        agent)
            # Preserve original format
            cat "$src" > "$out_path"
            ;;
    esac
    
    echo "  $out_path"
}

# Function to export a skill
export_skill() {
    local src=$1
    local dest_dir=$2
    local skill_name=$(basename $(dirname "$src"))

    # Skip excluded
    if [[ "$skill_name" == "$EXCLUDED" ]]; then return; fi
    
    # Skip if already referenced by a prompt (except for agent format which preserves structure)
    if [[ -n "${REFERENCED_SKILLS[$skill_name]}" && "$FORMAT" != "agent" ]]; then
        echo "  (skipped $skill_name - inlined in prompt)"
        return
    fi

    mkdir -p "$dest_dir"

    local content=$(cat "$src")
    
    # Extract frontmatter fields
    local description=$(echo "$content" | grep "^description: " | head -n 1 | sed 's/^description: //')
    local meta_name=$(echo "$content" | grep "^name: " | head -n 1 | sed 's/^name: //')
    
    if [[ -n "$meta_name" ]]; then skill_name="$meta_name"; fi
    
    # Strip frontmatter for body
    local body=$(echo "$content" | sed '1{/^---$/{:a;n;/^---$/!ba;d}}')

    local out_path="$dest_dir/$skill_name.md"
    
    case "$FORMAT" in
        windsurf)
            {
                echo "---"
                echo "description: ${description:-$skill_name}"
                echo "---"
                echo "$body"
            } > "$out_path"
            ;;
        claude)
            {
                echo "# ${description:-$skill_name}"
                echo ""
                echo "$body"
            } > "$out_path"
            ;;
        gemini)
            {
                echo "# ${description:-$skill_name}"
                echo ""
                echo "$body"
            } > "$out_path"
            ;;
        agent)
            # Preserve directory structure
            local skill_dir="$dest_dir/$skill_name"
            mkdir -p "$skill_dir"
            cp -r "$(dirname "$src")"/* "$skill_dir/"
            out_path="$skill_dir/SKILL.md"
            ;;
    esac
    
    echo "  $out_path"
}

echo "Exporting [$SCOPE] to $TARGET..."

# First pass: export prompts (this will mark which skills are referenced)
if [[ "$SCOPE" == "prompts" || "$SCOPE" == "both" ]]; then
    if [[ -d "prompts" ]]; then
        for f in prompts/*.md; do
            [ -e "$f" ] || continue
            export_prompt "$f" "$OUTPUT_DIR/$PROMPT_DIR"
        done
    fi
fi

# Second pass: export unreferenced skills
if [[ "$SCOPE" == "skills" || "$SCOPE" == "both" ]]; then
    if [[ -d "skills" ]]; then
        for d in skills/*/; do
            [ -e "${d}SKILL.md" ] || continue
            export_skill "${d}SKILL.md" "$OUTPUT_DIR/$SKILL_DIR"
        done
    fi
fi

# For Gemini, create the index file
if [[ "$FORMAT" == "gemini" && -n "$USE_INDEX" ]]; then
    GEMINI_INDEX="$OUTPUT_DIR/GEMINI.md"
    {
        echo "# Custom Instructions"
        echo ""
        echo "This file references custom instructions for the Gemini coding agent."
        echo ""
        echo "## Prompts and Skills"
        echo ""
        for f in "$OUTPUT_DIR/$PROMPT_DIR"/*.md; do
            [ -e "$f" ] || continue
            name=$(basename "$f" .md)
            echo "- @.gemini/instructions/$name.md"
        done
    } > "$GEMINI_INDEX"
    echo "  $GEMINI_INDEX"
fi

echo "Done."
