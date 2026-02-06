# Documentation Sync Guide

This guide explains how to manage documentation across public, private, and docs repositories.

## Repository Overview

| Repository | Type | Purpose | Who Edits |
|------------|------|---------|-----------|
| `delight-ai-agent` | Public | External-facing SDK documentation on GitHub | Engineers |
| `delight-ai-docs` | Docs | GitBook-connected documentation | TW (Technical Writers) |
| `ai-agent-android` | Private | Android SDK source + internal docs | Engineers |
| `ai-agent-ios` | Private | iOS SDK source + internal docs | Engineers |
| `ai-agent-js` | Private | JavaScript SDK source + internal docs | Engineers |

## Sync Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   PRIVATE REPOS              PUBLIC REPO              DOCS REPO         │
│   (ai-agent-*)            (delight-ai-agent)      (delight-ai-docs)     │
│                                                                         │
│   ┌───────────┐            ┌───────────┐           ┌───────────┐       │
│   │  Android  │            │           │           │           │       │
│   │   iOS     │ ────────▶  │  Public   │ ────────▶ │  GitBook  │       │
│   │    JS     │  (manual)  │   Docs    │ (forward) │   Docs    │       │
│   └───────────┘            └───────────┘           └───────────┘       │
│        ▲                                                 │             │
│        │                                                 │             │
│        └─────────────────────────────────────────────────┘             │
│                         (backward sync)                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Sync Directions

### 1. Forward Sync: Public → Docs (Automatic)

**Trigger:** Push to `delight-ai-agent` main branch

**Flow:**
1. Engineer updates docs in `delight-ai-agent`
2. GitHub Action detects changed `.md` files
3. `sync-sdk-docs.yml` workflow runs
4. Markdown is converted to GitBook syntax (using Claude AI)
5. Files are written to `delight-ai-docs` with path mapping
6. PR is created automatically

**Workflow:** `.github/workflows/sync-sdk-docs.yml`

### 2. Backward Sync: Docs → Private (Automatic)

**Trigger:** Push to `delight-ai-docs` develop branch (sdk-docs/**/*.md)

**Flow:**
1. TW edits documentation in GitBook
2. GitBook commits to `delight-ai-docs` develop branch
3. `sync-back.yml` workflow runs
4. Multi-agent pipeline processes each file:
   - Classifier checks eligibility
   - Comparator detects semantic differences
   - Converter transforms GitBook → Markdown (with style guide)
   - Validator checks quality (retries up to 2x on failure)
5. PRs are created in respective private repos

**Workflow:** `.github/workflows/sync-back.yml`

### 3. Private → Public (Manual)

Engineers manually copy/update docs from private repos to `delight-ai-agent` when releasing new SDK features.

---

## Who Should Edit What?

### Engineers

**Edit in:** `delight-ai-agent` (public) or private repos

**When:**
- Adding documentation for new SDK features
- Updating code examples
- Fixing technical inaccuracies

**Do NOT edit:** `delight-ai-docs` directly (it's managed by GitBook sync)

### Technical Writers (TW)

**Edit in:** GitBook (connected to `delight-ai-docs`)

**When:**
- Improving documentation clarity
- Fixing grammar/style issues
- Reorganizing content structure
- Adding GitBook-specific formatting (hints, tabs, etc.)

**Do NOT edit:** `delight-ai-agent` or private repos directly

---

## File Mapping

Files are mapped between repositories using pattern-based rules. See `mapping-table.json` for details.

### Example Mappings

| Public Repo | Docs Repo | Private Repo |
|-------------|-----------|--------------|
| `android/docs/conversations.md` | `sdk-docs/android/features/conversations.md` | `ai-agent-android/docs/conversations.md` |
| `android/README.md` | `sdk-docs/android/quickstart-guide-messenger.md` | `ai-agent-android/README.md` |
| `js/react/docs/messages.md` | `sdk-docs/react-npm/features/messages.md` | `ai-agent-js/packages/messenger-react/docs/messages.md` |

### Adding New Files

1. Add the file to the public repo (`delight-ai-agent`)
2. If the path follows existing patterns, it will be auto-mapped
3. If not, add an override in `mapping-table.json`

---

## Common Scenarios

### Scenario 1: Engineer adds new feature documentation

1. Engineer writes docs in `delight-ai-agent`
2. Push to main branch
3. Forward sync creates PR in `delight-ai-docs`
4. PR is auto-approved and merged
5. GitBook updates automatically

### Scenario 2: TW improves existing documentation

1. TW edits in GitBook
2. GitBook commits to `delight-ai-docs` develop
3. Backward sync creates PRs in private repos
4. Engineers review and merge PRs

### Scenario 3: Engineer updates private repo docs

1. Engineer updates docs in private repo
2. Manually copy changes to `delight-ai-agent`
3. Push to main branch
4. Forward sync updates `delight-ai-docs`

---

## Troubleshooting

### Forward sync PR not created

- Check if the file path is mapped in `mapping-table.json`
- Check GitHub Actions logs for errors
- Verify the file has `.md` extension

### Backward sync PR not created

- Check if the file has a `privatePath` mapping
- Check classification cache — file may be marked `syncBack=false`
- Check if content is semantically identical (Comparator found no diff)
- Check if conversion failed validation after all retries
- Check GitHub Actions logs for Claude API errors

### Infinite loop concern

Both sync directions use **agent-based semantic comparison** — the Comparator agent (powered by Claude Haiku) understands that GitBook syntax and Markdown syntax can represent the same content, preventing false positives.

**How comparison works:**
```
┌─────────────────────────────────────────────────────────┐
│  Backward sync (docs → private)                         │
│                                                         │
│  [Comparator] docs GitBook content                      │
│         vs                                              │
│  [Comparator] private Markdown content                  │
│         ↓                                               │
│  Same? → Skip (no sync needed)                          │
│  Different? → Convert + Validate → Create PR            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Forward sync (public → docs)                           │
│                                                         │
│  [Comparator] public Markdown content                   │
│         vs                                              │
│  [Comparator] docs GitBook content                      │
│         ↓                                               │
│  Same? → Skip (no sync needed)                          │
│  Different? → Convert Markdown → GitBook → Create PR    │
│              (uses existing docs file as structural      │
│               reference to preserve {% tags %})          │
└─────────────────────────────────────────────────────────┘
```

This prevents infinite loops because after a sync completes, the opposite direction sees "same content" and skips.

---

## Scripts Structure

```
scripts/
├── mapping-table.json       # Path mappings between repos
├── classification-cache.json # Classifier results cache
├── agents/
│   ├── call-claude.js       # Shared Claude API caller
│   ├── classifier.js        # Agent 1: file eligibility classification
│   ├── comparator.js        # Agent 2: semantic content comparison
│   ├── converter.js         # Agent 3: GitBook ↔ Markdown conversion
│   └── validator.js         # Agent 4: conversion quality validation
├── normalizer.js            # Legacy: syntax normalization (kept for reference)
├── claude-converter.js      # Legacy: monolithic converter (kept for reference)
├── MAPPING-REFERENCE.md     # Detailed mapping reference
├── sync/
│   └── sync.js              # Forward sync script
└── sync-back/
    └── sync-back.js         # Backward sync script
```

---

## Quick Reference

### When Engineer Updates Documentation

```
1. Engineer updates docs in private repo (ai-agent-*)
2. Engineer manually copies to public repo (delight-ai-agent)
3. Push to public repo triggers forward sync
4. PR created in docs repo (delight-ai-docs)
5. Merge PR → GitBook updates automatically
```

### When TW Updates Documentation

```
1. TW edits in GitBook
2. GitBook commits to docs repo (delight-ai-docs)
3. Push triggers backward sync (multi-agent pipeline)
4. PR created in private repos (ai-agent-*)
5. Engineer reviews and merges PR
```

### Why No Infinite Loop?

Both syncs use semantic comparison via Claude — the Comparator agent understands that different syntax can represent the same content:
- Backward sync: Comparator(docs GitBook) vs Comparator(private Markdown) → skip if same meaning
- Forward sync: Comparator(public Markdown) vs Comparator(docs GitBook) → skip if same meaning

So when backward sync pushes converted Markdown to private → propagates to public → forward sync compares → same content → **skips**.
