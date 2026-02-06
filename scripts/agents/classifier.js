/**
 * Agent 1: Classifier
 *
 * Determines whether a file should be published to docs and/or synced back.
 * Uses Haiku for fast, cheap classification.
 *
 * Fail-open: if classification fails, defaults to { publish: true, syncBack: true }
 */

const { callClaudeJSON } = require('./call-claude');

const MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `You are a documentation file classifier. Given a file path and a content snippet, determine:

1. **publish**: Should this file be published to the docs site? (true/false)
2. **syncBack**: Should edits to this file in docs sync back to private repos? (true/false)

Classification rules:
- CHANGELOG.md, CHANGES.md, HISTORY.md → publish: false (auto-generated, not user-facing docs)
- README.md at repo root → publish: false (repo meta, not product docs)
- LICENSE, CONTRIBUTING, CODE_OF_CONDUCT → publish: false
- .github/, .ci/, config files → publish: false
- SDK feature guides (e.g., messages.md, conversations.md) → publish: true, syncBack: true
- SDK getting started / quickstart → publish: true, syncBack: true
- API reference docs → publish: true, syncBack: true
- Internal dev notes, TODOs → publish: false

Respond in JSON format ONLY:
{
  "publish": true/false,
  "syncBack": true/false,
  "reason": "brief explanation"
}`;

/**
 * Classify a file for sync eligibility
 * @param {string} apiKey - Anthropic API key
 * @param {string} filePath - Relative file path (e.g., "android/docs/messages.md")
 * @param {string} contentSnippet - First ~500 chars of file content
 * @returns {Promise<{publish: boolean, syncBack: boolean, reason: string}>}
 */
async function classify(apiKey, filePath, contentSnippet) {
  const userPrompt = `File: ${filePath}\n\nContent preview:\n${contentSnippet}`;

  try {
    const result = await callClaudeJSON(apiKey, SYSTEM_PROMPT, userPrompt, MODEL, 256);
    return {
      publish: Boolean(result.publish),
      syncBack: Boolean(result.syncBack),
      reason: result.reason || '',
    };
  } catch (error) {
    // Fail-open: if classification fails, allow the file through
    console.error(`  [Classifier] Failed for ${filePath}: ${error.message}`);
    return { publish: true, syncBack: true, reason: 'classification failed - fail-open' };
  }
}

module.exports = { classify };
