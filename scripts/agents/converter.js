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

const MARKDOWN_STYLE_GUIDE = `
Markdown Style Guide (follow this for all output):
- # (H1): Page title only
- ## (H2): Major sections
- ### (H3): Subsections
- #### (H4): Detailed breakdowns (use sparingly). Do NOT use H5 or H6.
- Backticks for: code elements, property/method names, file names, values (true, false, null)
- Bold for: UI text displayed to users, dashboard paths, product names in UI context, important terms on first use
- Bold+Code (**\`term\`**) for highlighting specific code terms in sentences
- Italic: use rarely, only for subtle emphasis
- Fenced code blocks with language identifier (kotlin, swift, javascript, json, xml, bash, etc.)
- Single line break between paragraphs, double line break before/after code blocks
- Horizontal rules (---) are used as section dividers between major sections — preserve them exactly where they appear
`;

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

${MARKDOWN_STYLE_GUIDE}

Conversion rules:
1. Remove GitBook-specific syntax while preserving the content meaning
2. Convert GitBook hints to appropriate markdown:
   - {% hint style="info" %} → > **Note:** or > ℹ️
   - {% hint style="warning" %} → > **Warning:** or > ⚠️
   - {% hint style="danger" %} → > **Danger:** or > 🚨
   - {% hint style="success" %} → > **Tip:** or > ✅
3. Convert {% tabs %}/{% tab %} blocks: remove the tab syntax and keep each tab's inner content as-is. If the heading hierarchy allows (max H4), use the tab title as a subheading one level below the parent. Otherwise, use **bold text** as a visual separator for each tab section. Do NOT duplicate or summarize tab content — just unwrap it.
4. Remove {% include %}, {% file %}, {% embed %} tags completely
5. Preserve all code blocks exactly as they are
6. Preserve all links and images exactly as they are
7. Preserve the document structure (headers, lists, horizontal rules/dividers, etc.)
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

The input markdown follows this style guide — understand it to produce accurate GitBook output:
${MARKDOWN_STYLE_GUIDE}

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

/**
 * Retry GitBook→Markdown conversion with validation feedback
 * @param {string} apiKey - Anthropic API key
 * @param {string} gitbookContent - Original GitBook content
 * @param {string} previousAttempt - Previous conversion result that failed validation
 * @param {string[]} issues - Validation issues from the previous attempt
 * @returns {Promise<string>} - Improved pure markdown
 */
async function retryGitBookToMarkdown(apiKey, gitbookContent, previousAttempt, issues) {
  const systemPrompt = `You are a technical documentation converter. Your task is to fix a GitBook-to-Markdown conversion that failed quality validation.

${MARKDOWN_STYLE_GUIDE}

Conversion rules:
1. Remove GitBook-specific syntax while preserving the content meaning
2. Convert GitBook hints to appropriate markdown:
   - {% hint style="info" %} → > **Note:** or > ℹ️
   - {% hint style="warning" %} → > **Warning:** or > ⚠️
   - {% hint style="danger" %} → > **Danger:** or > 🚨
   - {% hint style="success" %} → > **Tip:** or > ✅
3. Convert {% tabs %}/{% tab %} blocks: remove the tab syntax and keep each tab's inner content as-is. If the heading hierarchy allows (max H4), use the tab title as a subheading one level below the parent. Otherwise, use **bold text** as a visual separator for each tab section. Do NOT duplicate or summarize tab content — just unwrap it.
4. Remove {% include %}, {% file %}, {% embed %} tags completely
5. Preserve all code blocks exactly as they are
6. Preserve all links and images exactly as they are
7. Preserve the document structure (headers, lists, horizontal rules/dividers, etc.)
8. Do NOT add any explanations - output ONLY the converted markdown`;

  const userPrompt = `A previous conversion attempt had these validation issues:
${issues.map(i => `- ${i}`).join('\n')}

=== ORIGINAL (GitBook) ===
${gitbookContent}

=== PREVIOUS ATTEMPT (failed validation) ===
${previousAttempt}

Fix the issues listed above and output ONLY the corrected markdown, nothing else.`;

  return await callClaude(apiKey, systemPrompt, userPrompt, MODEL);
}

/**
 * Retry Markdown→GitBook conversion with validation feedback
 * @param {string} apiKey - Anthropic API key
 * @param {string} markdownContent - Original Markdown content
 * @param {string} previousAttempt - Previous conversion result that failed validation
 * @param {string[]} issues - Validation issues from the previous attempt
 * @param {string|null} referenceGitBook - Existing GitBook file for structural reference
 * @returns {Promise<string>} - Improved GitBook markdown
 */
async function retryMarkdownToGitBook(apiKey, markdownContent, previousAttempt, issues, referenceGitBook = null) {
  let systemPrompt = `You are a technical documentation converter. Your task is to fix a Markdown-to-GitBook conversion that failed quality validation.

The input markdown follows this style guide — understand it to produce accurate GitBook output:
${MARKDOWN_STYLE_GUIDE}

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

  let userPrompt = `A previous conversion attempt had these validation issues:
${issues.map(i => `- ${i}`).join('\n')}

=== ORIGINAL (Markdown) ===
${markdownContent}

=== PREVIOUS ATTEMPT (failed validation) ===
${previousAttempt}`;

  if (referenceGitBook) {
    userPrompt += `

=== REFERENCE (existing GitBook file) ===
${referenceGitBook}`;
  }

  userPrompt += `

Fix the issues listed above and output ONLY the corrected GitBook markdown, nothing else.`;

  return await callClaude(apiKey, systemPrompt, userPrompt, MODEL);
}

module.exports = { convertGitBookToMarkdown, convertMarkdownToGitBook, retryGitBookToMarkdown, retryMarkdownToGitBook };
