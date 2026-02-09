#!/usr/bin/env node

/**
 * Forward Sync Main Script (Orchestrated)
 *
 * Syncs documentation from delight-ai-agent (public) to delight-ai-docs
 *
 * Pipeline per file:
 * 1. [Script]  Mapping lookup
 * 2. [Script]  Read source file
 * 3. [Agent 1] Classify — should this file be published?
 * 4. [Script]  Read target file (if exists)
 * 5. [Agent 2] Compare — semantic content comparison
 * 6. [Agent 3] Convert — Markdown → GitBook
 * 7. [Agent 4] Validate — check conversion quality
 * 8. [Script]  Write file + save classification to cache
 */

const fs = require('fs');
const path = require('path');

// Agent modules
const { classify } = require('../agents/classifier');
const { compare } = require('../agents/comparator');
const { convertMarkdownToGitBook } = require('../agents/converter');
const { validate } = require('../agents/validator');

// Script modules
const mappingTable = require('../mapping-table.json');

/**
 * Classification cache helpers
 */
const CACHE_PATH = path.resolve(__dirname, '..', 'classification-cache.json');

function loadClassificationCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to load classification cache:', e.message);
  }
  return { entries: {} };
}

function saveClassificationCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf-8');
}

/**
 * Find mapping for public repo path → docs repo path
 * @param {string} publicPath - Path in public repo (e.g., "android/docs/conversations.md")
 * @returns {object|null} - Mapping info or null
 */
function findPublicToDocsMapping(publicPath) {
  // 1. Check overrides first
  if (mappingTable.overrides) {
    for (const [docsPath, override] of Object.entries(mappingTable.overrides)) {
      if (override.publicAgentPath === publicPath) {
        return {
          publicPath,
          docsPath,
        };
      }
    }
  }

  // 2. Check patterns
  if (mappingTable.patterns) {
    for (const pattern of mappingTable.patterns) {
      if (!pattern.publicBase) continue;

      if (publicPath.startsWith(pattern.publicBase)) {
        const filename = publicPath.slice(pattern.publicBase.length);
        const docsPath = pattern.docsPrefix + filename;

        return {
          publicPath,
          docsPath,
        };
      }
    }
  }

  return null;
}

/**
 * Read changed files from the changed_source_files.txt
 * @param {string} filePath - Path to the file list
 * @returns {string[]} - Array of changed file paths
 */
function readChangedFiles(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('No changed_source_files.txt found');
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.endsWith('.md'));
}

/**
 * Main execution function
 */
async function main() {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const agentRepoPath = path.resolve(repoRoot, process.env.AGENT_REPO_PATH || 'delight-ai-agent');
  const docsRepoPath = path.resolve(repoRoot, process.env.DOCS_REPO_PATH || '.');
  const changedFilesPath = path.resolve(repoRoot, process.env.CHANGED_FILES_PATH || 'changed_source_files.txt');
  const dryRun = process.env.DRY_RUN === 'true';
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicKey) {
    console.error('ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('=== Forward Sync: public → docs (orchestrated) ===');
  console.log(`Agent repo path: ${agentRepoPath}`);
  console.log(`Docs repo path: ${docsRepoPath}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // Load classification cache
  const classificationCache = loadClassificationCache();

  // 1. Read changed files
  const changedFiles = readChangedFiles(changedFilesPath);
  console.log(`Changed files in public repo: ${changedFiles.length}`);
  changedFiles.forEach(f => console.log(`  - ${f}`));
  console.log('');

  // 2. Process each file
  const results = {
    synced: [],
    deleted: [],
    skipped: [],
    notMapped: [],
    classified: [],
    conversionFailed: [],
    errors: [],
  };

  for (const publicPath of changedFiles) {
    console.log(`\nProcessing: ${publicPath}`);

    // Step 1: [Script] Mapping lookup
    const mapping = findPublicToDocsMapping(publicPath);
    if (!mapping) {
      console.log('  → Not mapped, skipping');
      results.notMapped.push(publicPath);
      continue;
    }

    console.log(`  → Maps to: ${mapping.docsPath}`);

    // Step 2: [Script] Read source file
    const srcFullPath = path.join(agentRepoPath, publicPath);
    if (!fs.existsSync(srcFullPath)) {
      // Source deleted — if the mapped docs file exists, delete it
      const dstFullPath = path.join(docsRepoPath, mapping.docsPath);
      if (fs.existsSync(dstFullPath)) {
        if (!dryRun) {
          fs.unlinkSync(dstFullPath);
        }
        console.log(`  → Source deleted, ${dryRun ? 'would delete' : 'deleted'} docs file: ${mapping.docsPath}`);
        results.deleted.push({ path: publicPath, docsPath: mapping.docsPath, dryRun: dryRun || undefined });
      } else {
        console.log('  → Source file not found and docs file does not exist, skipping');
      }
      continue;
    }

    const srcContent = fs.readFileSync(srcFullPath, 'utf-8');

    // Step 3: [Agent 1] Classify
    console.log('  [Classifier] Checking file eligibility...');
    const contentSnippet = srcContent.slice(0, 500);
    const classification = await classify(anthropicKey, publicPath, contentSnippet);

    // Save classification to cache
    classificationCache.entries[publicPath] = {
      ...classification,
      classifiedAt: new Date().toISOString(),
    };

    if (!classification.publish) {
      console.log(`  → Classified as not publishable: ${classification.reason}`);
      results.classified.push({
        path: publicPath,
        reason: classification.reason,
      });
      continue;
    }

    console.log(`  → Classified as publishable (syncBack: ${classification.syncBack})`);

    // Step 4: [Script] Read target file (if exists)
    const dstFullPath = path.join(docsRepoPath, mapping.docsPath);
    let dstContent = null;

    if (fs.existsSync(dstFullPath)) {
      dstContent = fs.readFileSync(dstFullPath, 'utf-8');

      // Step 5: [Agent 2] Compare semantically
      console.log('  [Comparator] Checking for content differences...');
      const comparison = await compare(
        anthropicKey,
        srcContent,
        dstContent,
        'Markdown (public repo)',
        'GitBook (docs repo)',
      );

      if (comparison.identical) {
        console.log(`  → Content is identical: ${comparison.reason}`);
        results.skipped.push({
          path: publicPath,
          docsPath: mapping.docsPath,
          reason: comparison.reason,
        });
        continue;
      }
      console.log(`  → Content differs: ${comparison.reason}`);
    } else {
      console.log('  → Target file not found in docs repo, will create new');
    }

    // Dry run check
    if (dryRun) {
      console.log('  → [DRY RUN] Would convert and copy file');
      results.synced.push({ path: publicPath, docsPath: mapping.docsPath, dryRun: true });
      continue;
    }

    // Step 6+7: [Agent 3] Convert + [Agent 4] Validate
    try {
      console.log('  [Converter] Converting Markdown → GitBook...');
      if (dstContent) {
        console.log('  [Converter] Using existing GitBook file as structural reference');
      }

      const converted = await convertMarkdownToGitBook(anthropicKey, srcContent, dstContent);

      console.log('  [Validator] Checking conversion quality...');
      const validation = await validate(anthropicKey, srcContent, converted, 'markdown-to-gitbook');

      if (!validation.passed) {
        console.log('  → Conversion validation failed, using original content');
        validation.issues.forEach(issue => console.log(`    - ${issue}`));
        results.conversionFailed.push({
          path: publicPath,
          issues: validation.issues,
        });
      }

      const contentToWrite = validation.passed ? converted : srcContent;

      // Step 8: [Script] Write file
      const dstDir = path.dirname(dstFullPath);
      if (!fs.existsSync(dstDir)) {
        fs.mkdirSync(dstDir, { recursive: true });
      }

      fs.writeFileSync(dstFullPath, contentToWrite, 'utf-8');
      console.log(`  → Converted and written to: ${mapping.docsPath}`);
      results.synced.push({ path: publicPath, docsPath: mapping.docsPath });
    } catch (error) {
      console.error(`  Error: ${error.message}`);
      results.errors.push({ path: publicPath, error: error.message });
    }
  }

  // Save classification cache
  saveClassificationCache(classificationCache);
  console.log(`\nClassification cache saved (${Object.keys(classificationCache.entries).length} entries)`);

  // 3. Output results
  console.log('\n=== Results ===');

  console.log(`\nSynced: ${results.synced.length}`);
  results.synced.forEach(r =>
    console.log(`  ✓ ${r.path} → ${r.docsPath}${r.dryRun ? ' [DRY RUN]' : ''}`)
  );

  console.log(`\nDeleted: ${results.deleted.length}`);
  results.deleted.forEach(r =>
    console.log(`  ✗ ${r.path} → ${r.docsPath}${r.dryRun ? ' [DRY RUN]' : ''}`)
  );

  console.log(`\nSkipped (identical content): ${results.skipped.length}`);
  results.skipped.forEach(r =>
    console.log(`  - ${r.path} (${r.reason})`)
  );

  console.log(`\nClassified as not publishable: ${results.classified.length}`);
  results.classified.forEach(r =>
    console.log(`  - ${r.path} (${r.reason})`)
  );

  console.log(`\nNot mapped: ${results.notMapped.length}`);
  results.notMapped.forEach(p => console.log(`  - ${p}`));

  console.log(`\nConversion validation failed (used original): ${results.conversionFailed.length}`);
  results.conversionFailed.forEach(v => {
    console.log(`  ⚠ ${v.path}`);
    v.issues.forEach(i => console.log(`    - ${i}`));
  });

  console.log(`\nErrors: ${results.errors.length}`);
  results.errors.forEach(e => console.log(`  ✗ ${e.path}: ${e.error}`));

  // 4. Write synced files list for commit step
  const syncedFilesPath = path.resolve(repoRoot, process.env.SYNCED_FILES_PATH || 'synced_files.txt');
  const hasChanges = (results.synced.length > 0 || results.deleted.length > 0) && !dryRun;
  if (hasChanges) {
    const syncedList = results.synced.map(r => r.docsPath);
    const deletedList = results.deleted.map(r => `D:${r.docsPath}`);
    const allFiles = [...syncedList, ...deletedList].join('\n') + '\n';
    fs.writeFileSync(syncedFilesPath, allFiles, 'utf-8');
    console.log(`\nWrote synced files list to: ${syncedFilesPath}`);
  } else {
    fs.writeFileSync(syncedFilesPath, '', 'utf-8');
  }

  // GitHub Actions output
  if (process.env.GITHUB_OUTPUT) {
    const output = [
      `synced_count=${results.synced.length}`,
      `deleted_count=${results.deleted.length}`,
      `skipped_count=${results.skipped.length}`,
      `classified_count=${results.classified.length}`,
      `not_mapped_count=${results.notMapped.length}`,
      `error_count=${results.errors.length}`,
    ].join('\n');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, output + '\n');
  }

  // Return summary for workflow
  return {
    syncedCount: results.synced.length,
    deletedCount: results.deleted.length,
    skippedCount: results.skipped.length,
    classifiedCount: results.classified.length,
    syncedFiles: results.synced.map(r => r.docsPath),
    deletedFiles: results.deleted.map(r => r.docsPath),
  };
}

main()
  .then(result => {
    console.log('\n=== Sync Complete ===');
    if (result.syncedCount === 0) {
      console.log('No files were synced.');
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
