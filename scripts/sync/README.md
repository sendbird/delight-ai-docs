# Forward Sync

Syncs documentation from delight-ai-agent (public) to delight-ai-docs.

## Flow Diagram

```
delight-ai-agent (public)
        ↓
Changes detected in public repo
        ↓
Forward sync Action triggers
   1. Detect changed md files
   2. Map public paths to docs paths
   3. Normalize content (extract text only)
   4. Compare normalized content
   5. If different → Convert Markdown to GitBook (Claude AI)
      If identical → Skip
        ↓
Create PR in docs repo
```

## How It Works

1. **Mapping**: Uses `../mapping-table.json` to map public repo paths → docs repo paths
2. **Normalization**: Strips all syntax from both sides to extract pure text content:
   - GitBook syntax: `{% hint %}`, `{% tabs %}`, `{% tab %}`, `{% include %}`, etc.
   - Markdown syntax: `**bold**`, `# headers`, `[links](url)`, `![images](url)`, `> blockquotes`, etc.
   - HTML tags: `<figure>`, `<img>`, `<figcaption>`, `<a>`, `<br>`, etc.
   - Hint-equivalent prefixes: `> **Note:**`, `> **Warning:**`, etc.
3. **Comparison**: `normalize(public Markdown)` vs `normalize(docs GitBook)` — compares pure text only (case and whitespace preserved)
4. **Conversion** (only if different): Converts Markdown → GitBook syntax using Claude AI, with the existing docs file as a structural reference to preserve `{% tags %}`
5. **Write**: Writes converted content to docs repo, creates PR

## File Structure

```
scripts/
├── mapping-table.json    # Shared: Path mappings
├── normalizer.js         # Shared: GitBook/markdown syntax normalization
├── claude-converter.js   # Shared: GitBook → Markdown conversion
├── sync/
│   ├── sync.js           # Main execution script
│   ├── package.json
│   └── README.md
└── sync-back/
    ├── sync-back.js      # Backward sync script
    └── ...
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude conversion | Yes |
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
DRY_RUN=true AGENT_REPO_PATH=../../delight-ai-agent node sync.js

# Actual run
AGENT_REPO_PATH=../../delight-ai-agent node sync.js
```

### GitHub Action

The workflow in `.github/workflows/sync-sdk-docs.yml` runs this script automatically when changes are pushed to delight-ai-agent.
