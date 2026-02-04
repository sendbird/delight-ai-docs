# Sync Back

A system that automatically syncs changes made by TW in GitBook backward to private repos.

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
   2. Normalize content (remove GitBook syntax)
   3. Compare with private repo files
   4. If actually different → Create PR
      If same → Ignore (prevent infinite loop)
        ↓
Create PR in private repo
```

## File Structure

```
scripts/
├── mapping-table.json    # Shared: docs ↔ private repo file mapping
├── normalizer.js         # Shared: GitBook/markdown syntax normalization
├── claude-converter.js   # Shared: GitBook → Markdown conversion using Claude API
├── sync-back/
│   ├── sync-back.js      # Main execution script
│   ├── package.json
│   └── README.md
└── sync/
    ├── sync.js           # Forward sync script
    ├── package.json
    └── README.md
```

## Infinite Loop Prevention Logic

Uses **normalized content comparison**:

1. Change occurs in docs repo
2. Read the docs file content
3. Read the corresponding file in private repo
4. Normalize both (extract pure text, remove GitBook/Markdown syntax)
5. Compare normalized content
   - If different → TW actually modified it → Execute backward sync
   - If identical → No change needed → Skip

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
GITHUB_TOKEN=xxx DRY_RUN=true node sync-back.js

# Actual execution
GITHUB_TOKEN=xxx node sync-back.js
```

### GitHub Action

Automatically runs when `sdk-docs/**/*.md` files are changed in the develop branch.

Manual execution:
1. Go to Actions tab → Select "Sync Back to Private Repos"
2. Click "Run workflow"
3. dry_run option available

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | PAT for private repo access | Yes |
| `BASE_SHA` | Base commit SHA for comparison | Optional (default: HEAD~1) |
| `HEAD_SHA` | Current commit SHA | Optional (default: HEAD) |
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

Need to add `PRIVATE_REPO_TOKEN` secret:

1. GitHub → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `PRIVATE_REPO_TOKEN`
4. Value: PAT with private repo access permission
   - Required permissions: `repo` (full control of private repositories)
