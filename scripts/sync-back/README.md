# Sync Back

A system that automatically syncs changes made by TW in GitBook backward to private repos, using a multi-agent orchestration pipeline.

## Flow Diagram

```
docs repo (develop) ← GitBook
        ↓
TW edits/merges in GitBook
        ↓
Reflected in docs repo develop
        ↓
Backward sync Action triggers
   1. Detect changed md files
   2. Classification cache check (syncBack eligible?)
   3. Agent-based semantic comparison
   4. If actually different → Convert + Validate (with retry) → Create PR
      If same → Skip
        ↓
Create PR in private repo
```

## Pipeline Architecture

Each file goes through an 8-step pipeline with 4 Claude-powered agents:

```
Step 1: [Script]    Mapping lookup
Step 2: [Script]    Classification cache check (syncBack=false → SKIP)
Step 3: [Script]    Read docs file
Step 4: [Script]    Fetch private repo file (GitHub API)
Step 5: [Agent 2]   Compare — semantic content comparison (Haiku)
Step 6: [Agent 3]   Convert — GitBook → Markdown (Sonnet)
Step 7: [Agent 4]   Validate — check conversion quality (Sonnet)
        ↳ Fail? → Feed issues back to Converter, retry (max 2 retries)
Step 8: [Script]    Create branch + update file + create PR (GitHub API)
```

### Agent Details

| Agent | Module | Model | Purpose |
|-------|--------|-------|---------|
| Classifier | `agents/classifier.js` | Haiku | Determines if file is eligible for syncBack |
| Comparator | `agents/comparator.js` | Haiku | Semantic content comparison (ignores syntax diffs) |
| Converter | `agents/converter.js` | Sonnet | GitBook → Markdown conversion with style guide |
| Validator | `agents/validator.js` | Sonnet | Quality check: content loss, broken code/links, structure |

### Validation & Retry

The Validator checks for 5 issue types:
- **CONTENT_LOSS**: Important text content missing
- **CODE_BLOCK_CORRUPTED**: Code blocks modified or corrupted
- **LINK_BROKEN**: Links or images removed/modified incorrectly
- **MEANING_CHANGED**: Text meaning altered
- **STRUCTURE_BROKEN**: Actual document structure damaged (not format-specific syntax conversion)

Validation is **direction-aware**: for GitBook→Markdown, removing `{% tabs %}`, `{% hint %}` etc. is recognized as expected behavior, not flagged as errors.

On validation failure, the pipeline **retries up to 2 times** by feeding validation issues back to the Converter agent before giving up.

### Markdown Style Guide

The Converter follows an embedded style guide for output:
- `#` (H1): Page title only
- `##` (H2): Major sections
- `###` (H3): Subsections
- `####` (H4): Detailed breakdowns (use sparingly). No H5 or H6.
- Backticks for code elements, property/method names, file names, values
- Bold for UI text, dashboard paths, product names, important terms
- Fenced code blocks with language identifier

Tab conversion specifically respects heading depth — uses subheadings when hierarchy allows (max H4), otherwise **bold text** as visual separators.

## File Structure

```
scripts/
├── mapping-table.json       # Shared: docs ↔ private repo file mapping
├── classification-cache.json # Cache: classifier results per file
├── agents/
│   ├── call-claude.js       # Shared Claude API caller
│   ├── classifier.js        # Agent 1: file eligibility classification
│   ├── comparator.js        # Agent 2: semantic content comparison
│   ├── converter.js         # Agent 3: GitBook ↔ Markdown conversion
│   └── validator.js         # Agent 4: conversion quality validation
├── sync-back/
│   ├── sync-back.js         # Main execution script
│   ├── package.json
│   └── README.md
└── sync/
    ├── sync.js              # Forward sync script
    ├── package.json
    └── README.md
```

## GitBook Syntax List

| Pattern | Description |
|---------|-------------|
| `{% hint style="..." %}...{% endhint %}` | Info/warning box |
| `{% tabs %}...{% endtabs %}` | Tab group |
| `{% tab title="..." %}...{% endtab %}` | Individual tab |
| `{% include "..." %}` | Include other md file |
| `{% file src="..." %}...{% endfile %}` | File attachment |
| `{% embed url="..." %}` | Embed external content |

### hint Styles
- `info` - Information
- `success` - Success/tip
- `warning` - Warning
- `danger` - Caution/danger

## Usage

### Local Testing

```bash
cd scripts/sync-back

# Run tests
npm test

# Dry run (doesn't create actual PR)
GITHUB_TOKEN=xxx ANTHROPIC_API_KEY=xxx DRY_RUN=true node sync-back.js

# Actual execution
GITHUB_TOKEN=xxx ANTHROPIC_API_KEY=xxx node sync-back.js
```

### GitHub Action

Automatically runs when `sdk-docs/**/*.md` files are changed in the develop branch.

Manual execution:
1. Go to Actions tab → Select "Sync Back to Private Repos"
2. Click "Run workflow"
3. Options:
   - **dry_run**: If checked, no actual PR is created
   - **files**: Comma-separated file paths to sync (e.g. `sdk-docs/android/features/messages.md`). If empty, uses git diff from last commit.

When `files` is specified, the script skips git diff detection and directly processes the listed files. This is useful for syncing specific files that were missed or need re-syncing.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | PAT for private repo access | Yes |
| `ANTHROPIC_API_KEY` | API key for Claude (agent pipeline) | Yes |
| `BASE_SHA` | Base commit SHA for comparison | Optional (default: HEAD~1) |
| `HEAD_SHA` | Current commit SHA | Optional (default: HEAD) |
| `MANUAL_FILES` | Comma-separated file paths to sync (bypasses git diff) | No |
| `DRY_RUN` | If true, don't create PR | No |

## Modifying the Mapping Table

Manage the mapping between docs repo files and private repo files in `mapping-table.json`.

When adding a new file:

```json
{
  "mappings": {
    "sdk-docs/android/new-file.md": {
      "target": "android",
      "path": "new-file.md"
    }
  }
}
```

When adding a new repo:

```json
{
  "repositories": {
    "new-platform": {
      "owner": "sendbird",
      "repo": "ai-agent-new-platform",
      "basePath": "docs"
    }
  }
}
```

## GitHub Secrets Setup

The following secrets are managed at the **organization level** (not per-repository):

| Secret | Description |
|--------|-------------|
| `SDK_GH_BOT1_TOKEN` | PAT with private repo access permission (`repo` scope) |
| `SDK_GH_BOT2_TOKEN` | Secondary PAT for private repo access |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude agent pipeline |
