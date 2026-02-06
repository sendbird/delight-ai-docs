# Sync System: Issues and Fixes

This document tracks the concerns found in the bidirectional sync system and how they were resolved.

Date: 2026-02-06
Branch: `sagan/auto-sync-back`
Repo: `sendbird/delight-ai-docs`

---

## Issue 1: Sync-back not detecting changed files

**Severity**: Critical
**Affected**: Backward sync (docs → private)

### Problem

The `getChangedFiles()` function in `sync-back.js` used `'*.md'` as the git diff glob pattern. In git pathspecs, `*` does not match `/`, so this only matches `.md` files at the repository root — not files in subdirectories like `sdk-docs/android/features/messages.md`.

The workflow trigger (`sync-back.yml`) correctly used `'sdk-docs/**/*.md'`, so the action would trigger but the script would find 0 files.

### Evidence

GitHub Actions run [#21736635414](https://github.com/sendbird/delight-ai-docs/actions/runs/21736635414/job/62702931201):
- Workflow step: `Changed sdk-docs md files: 1`
- Script output: `Changed files: 0`

### Fix

`scripts/sync-back/sync-back.js` line 24:
```diff
- `git diff --name-only ${baseSha} ${headSha} -- '*.md'`
+ `git diff --name-only ${baseSha} ${headSha} -- 'sdk-docs/**/*.md'`
```

---

## Issue 2: No way to manually trigger sync for specific files

**Severity**: High
**Affected**: Both sync directions (primarily backward sync)

### Problem

The `workflow_dispatch` trigger only supported a `dry_run` option. When triggered manually, it used `HEAD~1` as the base SHA, meaning it only processed files changed in the last commit. There was no way to force-sync a specific file.

### Fix

Added `files` input to `workflow_dispatch` in `sync-back.yml` and `MANUAL_FILES` env var support in `sync-back.js`.

**Workflow** (`sync-back.yml`):
```yaml
workflow_dispatch:
  inputs:
    files:
      description: 'Comma-separated file paths to sync'
      required: false
      type: string
```

**Script** (`sync-back.js`):
```javascript
const manualFiles = process.env.MANUAL_FILES;
const changedFiles = manualFiles
  ? manualFiles.split(',').map(f => f.trim()).filter(f => f.length > 0)
  : getChangedFiles(baseSha, headSha);
```

### Usage

Actions → Sync Back to Private Repos → Run workflow → enter file paths in `files` field.

---

## Issue 3: Normalizer too aggressive — hides meaningful changes

**Severity**: Medium
**Affected**: Both sync directions

### Problem

The `normalize()` function in `normalizer.js` had 4 steps:
1. Remove GitBook syntax
2. Remove Markdown syntax
3. Normalize whitespace (collapse all spaces/newlines)
4. Convert to lowercase

Steps 3-4 were too aggressive. They caused the normalizer to treat the following as identical:
- `"This guide covers:"` vs `"This guide explains:"` — caught (different words)
- `"Text Message"` vs `"Text message"` — **missed** (case collapsed)
- Intentional indentation changes — **missed** (whitespace collapsed)

### Fix

Removed full whitespace normalization and lowercase. Kept light whitespace cleanup to prevent false triggers from Claude conversions:

```javascript
// 3. Light whitespace cleanup (absorb trivial differences from conversions)
result = result.split('\n').map(line => line.trimEnd()).join('\n');
result = result.replace(/\n{3,}/g, '\n\n');
result = result.trim();
```

This preserves:
- Case differences (`"Message"` vs `"message"`)
- Intentional whitespace (indentation, single blank lines)

While absorbing:
- Trailing spaces per line
- Excessive blank lines (3+ → 2)

---

## Issue 4: GitBook structure lost in round-trip sync

**Severity**: Medium
**Affected**: Forward sync (public/private → docs)

### Problem

When backward sync converts GitBook to Markdown, structural syntax is lost:

```
Docs (GitBook):     {% tabs %}{% tab title="X" %}...{% endtab %}{% endtabs %}
        ↓ backward sync (GitBook → Markdown)
Private (Markdown): **X**\n\n...
        ↓ forward sync (Markdown → GitBook)
Docs (GitBook):     **X**\n\n...   ← tabs structure LOST
```

The forward sync's Claude prompt had no knowledge of the original GitBook structure, so it couldn't reconstruct tabs, hints, or other GitBook-specific patterns.

This applies to ALL GitBook syntax, not just specific patterns:
- `{% tabs %}` / `{% tab %}` — tab groups
- `{% hint %}` — info/warning boxes
- `{% include %}` — file includes
- `{% embed %}` — external embeds
- `{% file %}` — file attachments
- `{% code %}` — code wrappers
- `{% content-ref %}` — content references
- Any future `{% ... %}` patterns

### Fix

Pass the existing docs repo file (GitBook version) as a structural reference to Claude during forward sync conversion.

**`claude-converter.js`** — added `referenceGitBook` parameter:
```javascript
async function convertMarkdownToGitBook(apiKey, markdownContent, referenceGitBook = null)
```

When a reference is provided, the prompt instructs Claude to:
- Preserve ALL `{% ... %}` syntax from the reference
- Map sections by content to determine which GitBook patterns to apply
- NOT invent new GitBook syntax that doesn't exist in the reference

The prompt is intentionally generic — it does not list specific GitBook patterns, so it automatically covers any new patterns without prompt updates.

**`sync.js`** — passes existing docs content:
```javascript
const conversionResult = await convertToGitBookAndValidate(anthropicKey, srcContent, dstContent);
```

When no existing file exists (new file), the conversion runs without reference — same as before.

---

## Issue 5: Infinite loop risk from normalizer change

**Severity**: Low (mitigated)
**Affected**: Both sync directions

### Problem

With the normalizer preserving more detail (case, whitespace), there's a higher chance that Claude conversions introduce subtle differences that trigger unnecessary syncs.

### Mitigation

1. **Light whitespace cleanup** — trailing spaces and excessive blank lines are normalized, absorbing the most common conversion artifacts
2. **Structural reference** — forward sync now uses the existing GitBook file as reference, reducing divergence in round-trips
3. **Syntax-only comparison** — the normalizer still strips all GitBook and Markdown syntax, so formatting-only changes (e.g., `- item` vs `* item`) don't trigger syncs

### Remaining risk

If Claude's conversion introduces a case change or meaningful whitespace change that wasn't in the original, it could trigger an unnecessary sync in the opposite direction. This is acceptable because:
- Such changes would still be valid documentation improvements
- The sync would stabilize after one round-trip (both sides would have the same content)
- The alternative (collapsing case/whitespace) hides real editorial changes

---

## Issue 6: Normalizer does not strip HTML tags (figure, img, figcaption)

**Severity**: Critical
**Affected**: Both sync directions (loop prevention)

### Problem

The `normalize()` pipeline had 4 steps: GitBook syntax → Markdown syntax → Whitespace → Lowercase. It never stripped HTML tags. GitBook docs use `<figure>/<img>/<figcaption>` for images, while the Claude-converted GFM uses `![alt](url)`.

```
Docs:    <figure><img src="url" alt="screenshot" width="375"><figcaption></figcaption></figure>
GFM:     ![screenshot](url)

normalize(docs)  → "screenshot"  (after markdown strip, HTML tags survive as literal text)  ✗ WRONG
normalize(gfm)   → "screenshot"  (image regex strips ![alt](url) → alt)                    ✓
```

In practice, the HTML tags were NOT being stripped, causing a ~1,400 char difference between the two normalized outputs. This would trigger unnecessary forward syncs and risk infinite loops.

### Fix

`scripts/normalizer.js` — Added `HTML_PATTERNS` constant and `removeHtmlSyntax()` function:

```javascript
const HTML_PATTERNS = {
  imgWithAlt: /<img\s[^>]*?alt="([^"]*)"[^>]*\/?>/gi,   // <img alt="x"> → "x"
  img: /<img[^>]*\/?>/gi,                                 // remaining <img> → ""
  anchor: /<a\s[^>]*>([\s\S]*?)<\/a>/gi,                  // <a>text</a> → "text"
  figcaption: /<figcaption[^>]*>[\s\S]*?<\/figcaption>/gi, // <figcaption> → ""
  genericTag: /<[^>]+>/g,                                  // all other tags → ""
};
```

Inserted as step 3 in the normalize pipeline (between markdown removal and whitespace normalization).

---

## Issue 7: Validation labels swapped in forward sync

**Severity**: Medium
**Affected**: Forward sync (Markdown → GitBook validation)

### Problem

`validateConversion()` in `claude-converter.js` always labeled the first argument as "ORIGINAL (GitBook)" and the second as "CONVERTED (Markdown)". For backward sync (GitBook→Markdown) this was correct. But for forward sync (Markdown→GitBook), the labels were backwards:

```
Forward sync calls: validateConversion(apiKey, markdownContent, convertedGitBook)
Claude sees:        ORIGINAL (GitBook) = markdownContent        ← WRONG
                    CONVERTED (Markdown) = convertedGitBook     ← WRONG
```

This caused Claude's validation to apply wrong expectations (e.g., expecting GitBook syntax in the markdown original).

### Fix

`scripts/claude-converter.js` — Added `direction` parameter:

```javascript
async function validateConversion(apiKey, original, converted, direction = 'gitbook-to-markdown') {
  const isForward = direction === 'markdown-to-gitbook';
  const originalLabel = isForward ? 'Markdown' : 'GitBook';
  const convertedLabel = isForward ? 'GitBook' : 'Markdown';
  // ...
}
```

Updated callers:
- `convertAndValidate()` passes `'gitbook-to-markdown'`
- `convertToGitBookAndValidate()` passes `'markdown-to-gitbook'`

---

## Issue 8: Markdown image regex leaves stray `!`

**Severity**: Medium
**Affected**: Both sync directions (normalization accuracy)

### Problem

In `removeMarkdownSyntax()`, the links regex ran BEFORE the images regex:

```javascript
// Links [text](url) — ran first
result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
// Images ![alt](url) — ran second
result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
```

Since `![alt](url)` contains `[alt](url)` as a substring, the links regex consumed the inner part first:
```
![cascade](url)  →  links regex matches [cascade](url) → "!cascade"
                 →  images regex finds nothing left
Result: "!cascade" instead of "cascade"
```

### Fix

`scripts/normalizer.js` — Reordered: images regex BEFORE links regex:

```javascript
// Images BEFORE links (![alt](url) contains [alt](url) as substring)
result = result.replace(MARKDOWN_PATTERNS.images, '$1');
// Links (keep text only)
result = result.replace(MARKDOWN_PATTERNS.links, '$1');
```

---

## Issue 9: Whitespace normalization order creates ghost blank lines

**Severity**: Medium
**Affected**: Both sync directions (loop prevention)

### Problem

`normalizeWhitespace()` collapsed consecutive newlines BEFORE trimming lines:

```javascript
// Step 1: Collapse \n{2+} → \n
result = result.replace(/\n{2,}/g, '\n');
// Step 2: Trim each line
result = result.split('\n').map(line => line.trim()).join('\n');
```

After HTML stripping, `<figure>` blocks leave behind lines with only whitespace:
```
\n  \n  \n    ← spaces between stripped tags (NOT consecutive \n)
```

Step 1 doesn't collapse these (they have spaces between newlines). Step 2 trims spaces, creating `\n\n\n`. But Step 1 already ran — these new consecutive newlines are never collapsed.

Result: 16 extra blank lines in docs normalization vs GFM normalization.

### Fix

`scripts/normalizer.js` — Reordered: trim lines FIRST, then collapse newlines:

```javascript
function normalizeWhitespace(content) {
  let result = content;
  result = result.replace(/[ \t]+/g, ' ');             // collapse spaces
  result = result.split('\n').map(l => l.trim()).join('\n'); // trim lines FIRST
  result = result.replace(/\n{2,}/g, '\n');            // THEN collapse blank lines
  result = result.trim();
  return result;
}
```

---

## Issue 10: Hint prefix asymmetry between GitBook and Markdown

**Severity**: Medium
**Affected**: Forward sync (loop prevention for files with `{% hint %}`)

### Problem

GitBook hints encode the label in the `style` attribute, not in the content:
```
{% hint style="info" %}Content here{% endhint %}
```

Claude converts this to markdown with an explicit text prefix:
```
> **Note:** Content here
```

After normalization:
- GitBook: `"content here"` (hint tags stripped, "info" style attribute discarded)
- Markdown: `"note: content here"` (bold stripped, but "Note:" text remains)

These differ → forward sync triggers unnecessarily.

**Affected files**: 43 files in the repo use `{% hint %}`, including synced files like `sdk-docs/react-npm/features/messages.md`.

### Fix

`scripts/normalizer.js` — Added hint prefix patterns to `MARKDOWN_PATTERNS`:

```javascript
// Hint-style prefixes: markdown equivalents of {% hint style="..." %}
hintPrefix: /^>\s*(?:\*\*)?(?:Note|Warning|Danger|Tip|Info)(?::?\s*)?(?:\*\*)?\s*/gim,
hintEmoji: /[ℹ️⚠️🚨✅]/g,
```

Applied in `removeMarkdownSyntax()` after bold removal, before blockquote removal:
```javascript
result = result.replace(MARKDOWN_PATTERNS.hintPrefix, '');
result = result.replace(MARKDOWN_PATTERNS.hintEmoji, '');
```

This strips hint prefixes (both text and emoji variants) that are structurally equivalent to the `style` attribute in GitBook hints. Regular blockquote content and "note" appearing mid-sentence are NOT affected.

---

## Validation

All issues verified with 48 automated tests across 7 test suites:

| Suite | Tests | Description |
|-------|-------|-------------|
| 1. HTML ↔ Markdown image symmetry | 8 | `<figure>/<img>` produces same normalized output as `![alt](url)` |
| 2. Full document round-trip | 3 | Phase 4 simulation with `sdk-docs/android/features/messages.md` — confirms no infinite loop |
| 3. `removeHtmlSyntax` unit tests | 12 | All HTML tag types: img, figure, figcaption, anchor, br, self-closing |
| 4. Markdown image regex ordering | 6 | No stray `!`, images before links, both work correctly |
| 5. Mixed content normalization | 1 | GitBook hint+figure vs Markdown blockquote+image |
| 6. Regression checks | 11 | Existing behavior preserved: tabs, bold, italic, code, headers, etc. |
| 7. Converter validation direction | 7 | Source code verification of direction parameter and label logic |

**Result**: 48/48 passed.

**Critical test**: Phase 4 round-trip simulation confirms `normalize(GFM_of_docs) === normalize(docs)` (9,592 chars each), meaning forward sync would SKIP after a sync-back — **no infinite loop**.

---

## Files Changed

| File | Changes |
|------|---------|
| `.github/workflows/sync-back.yml` | Fixed glob, added `files` input, `MANUAL_FILES` passthrough, env var safety |
| `scripts/sync-back/sync-back.js` | Fixed glob pattern, added `MANUAL_FILES` support |
| `scripts/normalizer.js` | Added HTML stripping (Issue 6), fixed image regex ordering (Issue 8), fixed whitespace normalization order (Issue 9), added hint prefix stripping (Issue 10) |
| `scripts/claude-converter.js` | Added `referenceGitBook` param (Issue 4), fixed validation direction labels (Issue 7) |
| `scripts/sync/sync.js` | Passes existing docs file as reference to Claude conversion |
| `scripts/README.md` | Updated normalization description |
| `scripts/sync/README.md` | Updated normalization and comparison descriptions |
| `scripts/sync-back/README.md` | Updated manual trigger docs, env vars, secrets (org-level) |

---

## Secrets (Org-level)

| Secret | Description |
|--------|-------------|
| `SDK_GH_BOT1_TOKEN` | PAT with private repo access (`repo` scope) |
| `SDK_GH_BOT2_TOKEN` | Secondary PAT for private repo access |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude conversions |
