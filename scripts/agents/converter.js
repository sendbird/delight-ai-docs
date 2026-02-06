/**
 * Agent 3: Converter
 *
 * Bidirectional conversion between GitBook and Markdown using Claude.
 * Refactored from claude-converter.js — same prompts, clean module interface.
 *
 * Fail behavior:
 * - Forward sync: returns original content as fallback
 * - Backward sync: caller should skip PR creation
 */

const { callClaude } = require('./call-claude');

const MODEL = 'claude-sonnet-4-20250514';

/**
 * Convert GitBook syntax to pure Markdown
 * Used by backward sync (docs → private repos)
 *
 * @param {string} apiKey - Anthropic API key
 * @param {string} gitbookContent - Markdown with GitBook syntax
 * @returns {Promise<string>} - Pure markdown
 */
async function convertGitBookToMarkdown(apiKey, gitbookContent) {
  const systemPrompt = `You are a technical documentation converter. Your task is to convert GitBook-flavored markdown to pure GitHub-flavored markdown.

Rules:
1. Remove GitBook-specific syntax while preserving the content meaning
2. Convert GitBook hints to appropriate markdown:
   - {% hint style="info" %} → > **Note:** or > ℹ️
   - {% hint style="warning" %} → > **Warning:** or > ⚠️
   - {% hint style="danger" %} → > **Danger:** or > 🚨
   - {% hint style="success" %} → > **Tip:** or > ✅
3. Convert {% tabs %}/{% tab %} to clear section headers
4. Remove {% include %}, {% file %}, {% embed %} tags completely
5. Preserve all code blocks exactly as they are
6. Preserve all links and images exactly as they are
7. Preserve the document structure (headers, lists, etc.)
8. Do NOT add any explanations - output ONLY the converted markdown`;

  const userPrompt = `Convert this GitBook markdown to pure GitHub-flavored markdown:

---
${gitbookContent}
---

Output ONLY the converted markdown, nothing else.`;

  return await callClaude(apiKey, systemPrompt, userPrompt, MODEL);
}

/**
 * Convert pure Markdown to GitBook syntax
 * Used by forward sync (public → docs)
 *
 * @param {string} apiKey - Anthropic API key
 * @param {string} markdownContent - Pure GitHub-flavored markdown
 * @param {string|null} referenceGitBook - Existing GitBook file for structural reference
 * @returns {Promise<string>} - Markdown with GitBook syntax
 */
async function convertMarkdownToGitBook(apiKey, markdownContent, referenceGitBook = null) {
  let systemPrompt = `You are a technical documentation converter. Your task is to convert pure GitHub-flavored markdown to GitBook-flavored markdown.

Rules:
1. Convert note/warning/tip blockquotes to GitBook hints:
   - > **Note:** or > ℹ️ → {% hint style="info" %}...{% endhint %}
   - > **Warning:** or > ⚠️ → {% hint style="warning" %}...{% endhint %}
   - > **Danger:** or > 🚨 → {% hint style="danger" %}...{% endhint %}
   - > **Tip:** or > ✅ → {% hint style="success" %}...{% endhint %}
2. Regular blockquotes (without Note/Warning/Tip prefix) should remain as blockquotes
3. Preserve all code blocks exactly as they are
4. Preserve all links and images exactly as they are
5. Preserve the document structure (headers, lists, etc.)
6. Do NOT add any explanations - output ONLY the converted markdown
7. If there's nothing to convert, return the original content as-is`;

  if (referenceGitBook) {
    systemPrompt += `
8. A REFERENCE GitBook file is provided. Preserve ALL GitBook-specific syntax ({% ... %} tags) from the reference where the content maps to the same sections. Use the reference to determine which sections should use which GitBook syntax. Common GitBook patterns include but are not limited to: hints, tabs, includes, embeds, files, code wrappers, and content-refs. Do NOT invent new GitBook syntax that doesn't exist in the reference.`;
  }

  let userPrompt;
  if (referenceGitBook) {
    userPrompt = `Convert this GitHub-flavored markdown to GitBook-flavored markdown, using the reference file to preserve GitBook structures:

=== NEW CONTENT (Markdown) ===
${markdownContent}

=== REFERENCE (existing GitBook file) ===
${referenceGitBook}

Output ONLY the converted markdown, nothing else.`;
  } else {
    userPrompt = `Convert this GitHub-flavored markdown to GitBook-flavored markdown:

---
${markdownContent}
---

Output ONLY the converted markdown, nothing else.`;
  }

  return await callClaude(apiKey, systemPrompt, userPrompt, MODEL);
}

module.exports = { convertGitBookToMarkdown, convertMarkdownToGitBook };
