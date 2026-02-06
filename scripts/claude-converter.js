/**
 * Bidirectional conversion between GitBook and Markdown using Claude API
 *
 * - GitBook → Markdown: For backward sync (docs → private)
 * - Markdown → GitBook: For forward sync (public → docs)
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Call Claude API
 */
async function callClaude(apiKey, systemPrompt, userPrompt, model = 'claude-sonnet-4-20250514') {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
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
 * Convert GitBook syntax to pure markdown
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

  return await callClaude(apiKey, systemPrompt, userPrompt);
}

/**
 * Convert pure markdown to GitBook syntax
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

  return await callClaude(apiKey, systemPrompt, userPrompt);
}

/**
 * Validate conversion result
 * @param {string} apiKey - Anthropic API key
 * @param {string} original - Original content
 * @param {string} converted - Converted content
 * @param {string} direction - 'gitbook-to-markdown' or 'markdown-to-gitbook'
 * @returns {Promise<{passed: boolean, issues: string[]}>}
 */
async function validateConversion(apiKey, original, converted, direction = 'gitbook-to-markdown') {
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

  const response = await callClaude(apiKey, systemPrompt, userPrompt, 'claude-sonnet-4-20250514');

  try {
    // Attempt to parse JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (e) {
    console.error('Failed to parse validation response:', response);
    return { passed: false, issues: ['PARSE_ERROR: Could not parse validation response'] };
  }
}

/**
 * GitBook → Markdown conversion + validation pipeline
 * @param {string} apiKey - Anthropic API key
 * @param {string} gitbookContent - Markdown with GitBook syntax
 * @returns {Promise<{success: boolean, content: string, issues: string[]}>}
 */
async function convertAndValidate(apiKey, gitbookContent) {
  console.log('  [Claude] Converting GitBook to Markdown...');

  // 1. Convert
  const converted = await convertGitBookToMarkdown(apiKey, gitbookContent);

  console.log('  [Claude] Validating conversion...');

  // 2. Validate
  const validation = await validateConversion(apiKey, gitbookContent, converted, 'gitbook-to-markdown');

  if (validation.passed) {
    console.log('  [Claude] Validation passed ✓');
    return { success: true, content: converted, issues: [] };
  } else {
    console.log('  [Claude] Validation failed ✗');
    validation.issues.forEach(issue => console.log(`    - ${issue}`));
    return { success: false, content: converted, issues: validation.issues };
  }
}

/**
 * Markdown → GitBook conversion + validation pipeline
 * @param {string} apiKey - Anthropic API key
 * @param {string} markdownContent - Pure GitHub-flavored markdown
 * @param {string|null} referenceGitBook - Existing GitBook file for structural reference
 * @returns {Promise<{success: boolean, content: string, issues: string[]}>}
 */
async function convertToGitBookAndValidate(apiKey, markdownContent, referenceGitBook = null) {
  console.log('  [Claude] Converting Markdown to GitBook...');
  if (referenceGitBook) {
    console.log('  [Claude] Using existing GitBook file as structural reference');
  }

  // 1. Convert
  const converted = await convertMarkdownToGitBook(apiKey, markdownContent, referenceGitBook);

  console.log('  [Claude] Validating conversion...');

  // 2. Validate (forward direction: Markdown → GitBook)
  const validation = await validateConversion(apiKey, markdownContent, converted, 'markdown-to-gitbook');

  if (validation.passed) {
    console.log('  [Claude] Validation passed ✓');
    return { success: true, content: converted, issues: [] };
  } else {
    console.log('  [Claude] Validation failed ✗');
    validation.issues.forEach(issue => console.log(`    - ${issue}`));
    return { success: false, content: converted, issues: validation.issues };
  }
}

module.exports = {
  // GitBook → Markdown (backward sync)
  convertGitBookToMarkdown,
  convertAndValidate,
  // Markdown → GitBook (forward sync)
  convertMarkdownToGitBook,
  convertToGitBookAndValidate,
  // Utilities
  validateConversion,
  callClaude,
};
