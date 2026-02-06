/**
 * GitBook Syntax Normalization Utility
 *
 * Removes GitBook-specific syntax and extracts pure text content
 * for content comparison
 */

/**
 * GitBook syntax pattern definitions
 */
const GITBOOK_PATTERNS = {
  // {% hint style="..." %}...{% endhint %}
  hint: /\{%\s*hint\s+style="[^"]*"\s*%\}([\s\S]*?)\{%\s*endhint\s*%\}/g,

  // {% tabs %}...{% endtabs %}
  tabs: /\{%\s*tabs\s*%\}([\s\S]*?)\{%\s*endtabs\s*%\}/g,

  // {% tab title="..." %}...{% endtab %}
  tab: /\{%\s*tab\s+title="[^"]*"\s*%\}([\s\S]*?)\{%\s*endtab\s*%\}/g,

  // {% include "..." %}
  include: /\{%\s*include\s+"[^"]*"\s*%\}/g,

  // {% file src="..." %}...{% endfile %}
  file: /\{%\s*file\s+src="[^"]*"\s*%\}[\s\S]*?\{%\s*endfile\s*%\}/g,

  // {% if %}...{% endif %}
  conditional: /\{%\s*if\s+[^%]*%\}([\s\S]*?)\{%\s*endif\s*%\}/g,

  // {% embed url="..." %}
  embed: /\{%\s*embed\s+url="[^"]*"\s*%\}/g,

  // {% code ... %}...{% endcode %}
  code: /\{%\s*code[^%]*%\}([\s\S]*?)\{%\s*endcode\s*%\}/g,

  // {% content-ref %}...{% endcontent-ref %}
  contentRef: /\{%\s*content-ref[^%]*%\}[\s\S]*?\{%\s*endcontent-ref\s*%\}/g,

  // Remaining {% ... %} tags (catch-all)
  genericTag: /\{%[^%]*%\}/g,
};

/**
 * HTML syntax pattern definitions
 * Used by GitBook for images (<figure>/<img>) and other formatting
 */
const HTML_PATTERNS = {
  // <img> tags with alt attribute - extract alt text (parallel to ![alt](url))
  imgWithAlt: /<img\s[^>]*?alt="([^"]*)"[^>]*\/?>/gi,

  // <img> tags without alt or after alt extraction
  img: /<img[^>]*\/?>/gi,

  // <a> tags - extract inner text (parallel to [text](url))
  anchor: /<a\s[^>]*>([\s\S]*?)<\/a>/gi,

  // <figcaption> with content - remove entirely
  figcaption: /<figcaption[^>]*>[\s\S]*?<\/figcaption>/gi,

  // All remaining HTML tags (figure, br, div, p, span, etc.)
  genericTag: /<[^>]+>/g,
};

/**
 * Markdown syntax pattern definitions
 */
const MARKDOWN_PATTERNS = {
  // Headers (# ~ ######)
  headers: /^#{1,6}\s+/gm,

  // Bold (**text** or __text__)
  bold: /(\*\*|__)(.*?)\1/g,

  // Italic (*text* or _text_)
  italic: /(\*|_)([^*_]+)\1/g,

  // Inline code (`code`)
  inlineCode: /`([^`]+)`/g,

  // Code blocks (```...```)
  codeBlock: /```[\s\S]*?```/g,

  // Links [text](url)
  links: /\[([^\]]+)\]\([^)]+\)/g,

  // Images ![alt](url)
  images: /!\[([^\]]*)\]\([^)]+\)/g,

  // Bullet lists (-, *, +)
  bulletList: /^[\s]*[-*+]\s+/gm,

  // Numbered lists
  numberedList: /^[\s]*\d+\.\s+/gm,

  // Hint-style prefixes: markdown equivalents of {% hint style="..." %}
  // Claude converts: info→"Note:", warning→"Warning:", danger→"Danger:", success→"Tip:"
  // Also handles emoji variants: ℹ️, ⚠️, 🚨, ✅
  hintPrefix: /^>\s*(?:\*\*)?(?:Note|Warning|Danger|Tip|Info)(?::?\s*)?(?:\*\*)?\s*/gim,
  hintEmoji: /[ℹ️⚠️🚨✅]/g,

  // Blockquotes (>)
  blockquote: /^>\s*/gm,

  // Horizontal rules (---, ***, ___)
  horizontalRule: /^[-*_]{3,}$/gm,

  // Table delimiters (|---|)
  tableDelimiter: /\|[\s-:]+\|/g,

  // Table pipes
  tablePipe: /\|/g,
};

/**
 * Remove GitBook syntax and extract inner content
 * @param {string} content - Original markdown content
 * @returns {string} - Content with GitBook syntax removed
 */
function removeGitBookSyntax(content) {
  let result = content;

  // hint, tabs, tab, conditional, code: remove tags, keep inner content
  result = result.replace(GITBOOK_PATTERNS.hint, '$1');
  result = result.replace(GITBOOK_PATTERNS.tabs, '$1');
  result = result.replace(GITBOOK_PATTERNS.tab, '$1');
  result = result.replace(GITBOOK_PATTERNS.conditional, '$1');
  result = result.replace(GITBOOK_PATTERNS.code, '$1');

  // include, file, embed, contentRef: remove completely
  result = result.replace(GITBOOK_PATTERNS.include, '');
  result = result.replace(GITBOOK_PATTERNS.file, '');
  result = result.replace(GITBOOK_PATTERNS.embed, '');
  result = result.replace(GITBOOK_PATTERNS.contentRef, '');

  // Remove remaining {% ... %} tags
  result = result.replace(GITBOOK_PATTERNS.genericTag, '');

  return result;
}

/**
 * Remove markdown syntax and extract pure text
 * @param {string} content - Markdown content
 * @returns {string} - Pure text
 */
function removeMarkdownSyntax(content) {
  let result = content;

  // Remove code blocks (including content)
  result = result.replace(MARKDOWN_PATTERNS.codeBlock, '');

  // Remove header markdown (keep text)
  result = result.replace(MARKDOWN_PATTERNS.headers, '');

  // Bold (keep text)
  result = result.replace(MARKDOWN_PATTERNS.bold, '$2');

  // Italic (keep text)
  result = result.replace(MARKDOWN_PATTERNS.italic, '$2');

  // Inline code (keep text)
  result = result.replace(MARKDOWN_PATTERNS.inlineCode, '$1');

  // Images BEFORE links (![alt](url) contains [alt](url) as substring)
  result = result.replace(MARKDOWN_PATTERNS.images, '$1');

  // Links (keep text only)
  result = result.replace(MARKDOWN_PATTERNS.links, '$1');

  // Remove bullet/numbered list markdown
  result = result.replace(MARKDOWN_PATTERNS.bulletList, '');
  result = result.replace(MARKDOWN_PATTERNS.numberedList, '');

  // Strip hint-style prefixes BEFORE blockquotes (> Note:, > Warning:, etc.)
  // These are markdown equivalents of {% hint style="..." %} attributes
  result = result.replace(MARKDOWN_PATTERNS.hintPrefix, '');
  result = result.replace(MARKDOWN_PATTERNS.hintEmoji, '');

  // Remove blockquote markdown
  result = result.replace(MARKDOWN_PATTERNS.blockquote, '');

  // Remove horizontal rules
  result = result.replace(MARKDOWN_PATTERNS.horizontalRule, '');

  // Remove table delimiters and pipes
  result = result.replace(MARKDOWN_PATTERNS.tableDelimiter, '');
  result = result.replace(MARKDOWN_PATTERNS.tablePipe, ' ');

  return result;
}

/**
 * Remove HTML tags and extract meaningful text
 * Handles <figure>/<img>/<figcaption> and other HTML used in GitBook docs
 * @param {string} content - Content with possible HTML tags
 * @returns {string} - Content with HTML removed, alt/link text preserved
 */
function removeHtmlSyntax(content) {
  let result = content;

  // <img> with alt: extract alt text (same as ![alt](url) → alt)
  result = result.replace(HTML_PATTERNS.imgWithAlt, '$1');

  // <img> without alt or remaining after alt extraction
  result = result.replace(HTML_PATTERNS.img, '');

  // <a href="...">text</a> → text (same as [text](url) → text)
  result = result.replace(HTML_PATTERNS.anchor, '$1');

  // <figcaption>...</figcaption> → remove entirely
  result = result.replace(HTML_PATTERNS.figcaption, '');

  // All remaining HTML tags (figure, br, div, span, etc.)
  result = result.replace(HTML_PATTERNS.genericTag, '');

  return result;
}

/**
 * Normalize whitespace and line breaks
 * @param {string} content - Text content
 * @returns {string} - Normalized text
 */
function normalizeWhitespace(content) {
  let result = content;

  // Collapse consecutive spaces to single space
  result = result.replace(/[ \t]+/g, ' ');

  // Trim each line first (so whitespace-only lines become empty)
  result = result.split('\n').map(line => line.trim()).join('\n');

  // THEN collapse consecutive line breaks (including newly-empty lines)
  result = result.replace(/\n{2,}/g, '\n');

  // Trim overall
  result = result.trim();

  return result;
}

/**
 * Content normalization (full pipeline)
 * Remove GitBook syntax → Remove markdown syntax → Light whitespace cleanup
 *
 * Case differences are preserved to detect meaningful expression changes.
 * Only trivial whitespace differences (trailing spaces, excessive blank lines)
 * are normalized to prevent false sync triggers from Claude conversions.
 *
 * @param {string} content - Original markdown content
 * @returns {string} - Normalized pure text
 */
function normalize(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let result = content;

  // 1. Remove GitBook syntax
  result = removeGitBookSyntax(result);

  // 2. Remove markdown syntax
  result = removeMarkdownSyntax(result);

  // 3. Remove HTML syntax (figure, img, figcaption, etc.)
  result = removeHtmlSyntax(result);

  // 4. Light whitespace cleanup (absorb trivial differences from conversions)
  // Full trim per line — after all syntax stripping, leading whitespace is artifact
  result = result.split('\n').map(line => line.trim()).join('\n');
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.trim();

  return result;
}

module.exports = {
  normalize,
  removeGitBookSyntax,
  removeMarkdownSyntax,
  removeHtmlSyntax,
  normalizeWhitespace,
  GITBOOK_PATTERNS,
  HTML_PATTERNS,
  MARKDOWN_PATTERNS,
};
