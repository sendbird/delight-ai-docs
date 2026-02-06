/**
 * Shared Claude API caller
 *
 * Extracted from claude-converter.js for use by all agent modules.
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Call Claude API
 * @param {string} apiKey - Anthropic API key
 * @param {string} systemPrompt - System prompt
 * @param {string} userPrompt - User prompt
 * @param {string} model - Model ID (default: Sonnet)
 * @param {number} maxTokens - Max tokens (default: 8192)
 * @returns {Promise<string>} - Response text
 */
async function callClaude(apiKey, systemPrompt, userPrompt, model = 'claude-sonnet-4-20250514', maxTokens = 8192) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * Call Claude and parse JSON response
 * @param {string} apiKey - Anthropic API key
 * @param {string} systemPrompt - System prompt
 * @param {string} userPrompt - User prompt
 * @param {string} model - Model ID
 * @param {number} maxTokens - Max tokens
 * @returns {Promise<object>} - Parsed JSON object
 */
async function callClaudeJSON(apiKey, systemPrompt, userPrompt, model = 'claude-sonnet-4-20250514', maxTokens = 4096) {
  const text = await callClaude(apiKey, systemPrompt, userPrompt, model, maxTokens);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No JSON found in response: ${text.slice(0, 200)}`);
  }

  return JSON.parse(jsonMatch[0]);
}

module.exports = { callClaude, callClaudeJSON };
