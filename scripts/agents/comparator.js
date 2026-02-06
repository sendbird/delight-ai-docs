/**
 * Agent 2: Comparator
 *
 * Semantic content comparison that replaces the regex-based normalizer.
 * Uses Haiku to compare two documents, ignoring syntax differences
 * (GitBook vs Markdown) but catching real content changes.
 *
 * Fail-open: if comparison fails, treats as different (proceeds to conversion).
 */

const { callClaudeJSON } = require('./call-claude');

const MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `You are a technical documentation comparator. Given two versions of the same document (possibly in different formats — one may use GitBook syntax, the other plain Markdown), determine if they have the same **content**.

Ignore these differences (they are NOT real changes):
- GitBook syntax tags: {% hint %}, {% tabs %}, {% tab %}, {% endhint %}, {% endtab %}, {% endtabs %}
- Hint/callout format differences: {% hint style="info" %} vs > **Note:**
- Heading level differences (## vs ###)
- Whitespace, blank lines, trailing spaces
- Markdown formatting differences (bold syntax, list markers - vs *)
- Code fence language label differences (e.g., \`\`\`kotlin vs \`\`\`java only if same code)
- HTML tags used for formatting (<br />, <div>, <figure>, etc.)
- Link format differences (relative vs absolute paths to same target)

Flag these as REAL changes:
- Added, removed, or reworded paragraphs
- Changed code examples (different code content, not just formatting)
- Added or removed sections
- Changed parameter names, types, or descriptions
- Changed step-by-step instructions
- Different default values or configuration options

Respond in JSON format ONLY:
{
  "identical": true/false,
  "reason": "brief explanation of what differs (or 'content is identical')"
}`;

/**
 * Compare two document contents semantically
 * @param {string} apiKey - Anthropic API key
 * @param {string} contentA - Source content
 * @param {string} contentB - Target content
 * @param {string} labelA - Label for content A (e.g., "Markdown (public repo)")
 * @param {string} labelB - Label for content B (e.g., "GitBook (docs repo)")
 * @returns {Promise<{identical: boolean, reason: string}>}
 */
async function compare(apiKey, contentA, contentB, labelA = 'Document A', labelB = 'Document B') {
  const userPrompt = `Compare these two documents for content differences:

=== ${labelA} ===
${contentA}

=== ${labelB} ===
${contentB}

Are they the same content (ignoring format/syntax differences)?`;

  try {
    const result = await callClaudeJSON(apiKey, SYSTEM_PROMPT, userPrompt, MODEL, 512);
    return {
      identical: Boolean(result.identical),
      reason: result.reason || '',
    };
  } catch (error) {
    // Fail-open: if comparison fails, treat as different (proceed to conversion)
    console.error(`  [Comparator] Failed: ${error.message}`);
    return { identical: false, reason: 'comparison failed - fail-open (treating as different)' };
  }
}

module.exports = { compare };
