# Forward Sync

Syncs documentation from delight-ai-agent (public) to delight-ai-docs, using a multi-agent orchestration pipeline.

## Flow Diagram

```
delight-ai-agent (public)
        ↓
Changes detected in public repo
        ↓
Forward sync Action triggers
   1. Detect changed md files
   2. Map public paths to docs paths
   3. Classify file eligibility (Agent)
   4. Semantic content comparison (Agent)
   5. If different → Convert Markdown → GitBook (Agent) + Validate (Agent)
      If identical → Skip
        ↓
Write to docs repo, create PR
```

## Pipeline Architecture

Each file goes through an 8-step pipeline with 4 Claude-powered agents:

```
Step 1: [Script]    Mapping lookup
Step 2: [Script]    Read source file
Step 3: [Agent 1]   Classify — should this file be published? (Haiku)
Step 4: [Script]    Read target file (if exists)
Step 5: [Agent 2]   Compare — semantic content comparison (Haiku)
Step 6: [Agent 3]   Convert — Markdown → GitBook (Sonnet)
Step 7: [Agent 4]   Validate — check conversion quality (Sonnet)
        ↳ Fail? → Use original content as fallback
Step 8: [Script]    Write file + save classification to cache
```

### Agent Details

| Agent | Module | Model | Purpose |
|-------|--------|-------|---------|
| Classifier | `agents/classifier.js` | Haiku | Determines if file should be published to docs |
| Comparator | `agents/comparator.js` | Haiku | Semantic content comparison (ignores syntax diffs) |
| Converter | `agents/converter.js` | Sonnet | Markdown → GitBook conversion (uses existing docs file as structural reference) |
| Validator | `agents/validator.js` | Sonnet | Quality check: content loss, broken code/links, structure |

### Validation

Validation is **direction-aware**: for Markdown→GitBook, adding `{% hint %}`, `{% tabs %}` etc. is recognized as expected behavior.

On validation failure, forward sync uses the **original content as fallback** (unlike backward sync which retries).

## File Structure

```
scripts/
├── mapping-table.json       # Shared: Path mappings
├── classification-cache.json # Cache: classifier results per file
├── agents/
│   ├── call-claude.js       # Shared Claude API caller
│   ├── classifier.js        # Agent 1: file eligibility classification
│   ├── comparator.js        # Agent 2: semantic content comparison
│   ├── converter.js         # Agent 3: GitBook ↔ Markdown conversion
│   └── validator.js         # Agent 4: conversion quality validation
├── sync/
│   ├── sync.js              # Main execution script
│   ├── package.json
│   └── README.md
└── sync-back/
    ├── sync-back.js         # Backward sync script
    └── ...
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude agent pipeline | Yes |
| `AGENT_REPO_PATH` | Path to delight-ai-agent checkout | No (default: `delight-ai-agent`) |
| `DOCS_REPO_PATH` | Path to docs repo root | No (default: `.`) |
| `CHANGED_FILES_PATH` | Path to changed files list | No (default: `changed_source_files.txt`) |
| `SYNCED_FILES_PATH` | Path to output synced files list | No (default: `synced_files.txt`) |
| `DRY_RUN` | If true, don't actually copy files | No |

## Usage

### Local Testing

```bash
cd scripts/sync

# Prepare test environment
echo "android/docs/conversations.md" > ../../changed_source_files.txt

# Dry run
DRY_RUN=true ANTHROPIC_API_KEY=xxx AGENT_REPO_PATH=../../delight-ai-agent node sync.js

# Actual run
ANTHROPIC_API_KEY=xxx AGENT_REPO_PATH=../../delight-ai-agent node sync.js
```

### GitHub Action

The workflow in `.github/workflows/sync-sdk-docs.yml` runs this script automatically when changes are pushed to delight-ai-agent.
