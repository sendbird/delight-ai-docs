/**
 * Agent 4: Validator
 *
 * Validates that a conversion didn't lose content or break structure.
 * Refactored from claude-converter.js — same validation logic, clean module interface.
 *
 * Fail behavior:
 * - Forward sync: use original content as fallback
 * - Backward sync: skip PR creation
 */

const { callClaudeJSON } = require('./call-claude');

const MODEL = 'claude-sonnet-4-20250514';

/**
 * Validate a conversion result
 * @param {string} apiKey - Anthropic API key
 * @param {string} original - Original content
 * @param {string} converted - Converted content
 * @param {string} direction - 'gitbook-to-markdown' or 'markdown-to-gitbook'
 * @returns {Promise<{passed: boolean, issues: string[]}>}
 */
async function validate(apiKey, original, converted, direction = 'gitbook-to-markdown') {
  const isForward = direction === 'markdown-to-gitbook';
  const originalLabel = isForward ? 'Markdown' : 'GitBook';
  const convertedLabel = isForward ? 'GitBook' : 'Markdown';
  const conversionDesc = isForward
    ? 'a Markdown-to-GitBook conversion'
    : 'a GitBook-to-Markdown conversion';

  const systemPrompt = `You are a technical documentation QA reviewer. Your task is to validate that ${conversionDesc} was done correctly.

Check for these issues:
1. CONTENT_LOSS: Important content from original is missing
2. CODE_BLOCK_CORRUPTED: Code blocks were modified or corrupted
3. LINK_BROKEN: Links or images were removed or modified incorrectly
4. MEANING_CHANGED: The meaning of text was altered
5. STRUCTURE_BROKEN: Document structure (headers, lists) was damaged

Respond in JSON format ONLY:
{
  "passed": true/false,
  "issues": ["ISSUE_TYPE: description", ...]
}

If all checks pass, respond with: {"passed": true, "issues": []}`;

  const userPrompt = `Validate this conversion:

=== ORIGINAL (${originalLabel}) ===
${original}

=== CONVERTED (${convertedLabel}) ===
${converted}

Respond with JSON only.`;

  try {
    const result = await callClaudeJSON(apiKey, systemPrompt, userPrompt, MODEL);
    return {
      passed: Boolean(result.passed),
      issues: Array.isArray(result.issues) ? result.issues : [],
    };
  } catch (error) {
    console.error(`  [Validator] Failed: ${error.message}`);
    return { passed: false, issues: ['PARSE_ERROR: Could not parse validation response'] };
  }
}

module.exports = { validate };
