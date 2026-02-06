#!/usr/bin/env node

/**
 * Forward Sync Main Script
 *
 * Syncs documentation from delight-ai-agent (public) to delight-ai-docs
 */

const fs = require('fs');
const path = require('path');

// Shared modules
const { normalize } = require('../normalizer');
const { convertToGitBookAndValidate } = require('../claude-converter');
const mappingTable = require('../mapping-table.json');

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
  const agentRepoPath = process.env.AGENT_REPO_PATH || 'delight-ai-agent';
  const docsRepoPath = process.env.DOCS_REPO_PATH || '.';
  const changedFilesPath = process.env.CHANGED_FILES_PATH || 'changed_source_files.txt';
  const dryRun = process.env.DRY_RUN === 'true';
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicKey) {
    console.error('ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('=== Forward Sync: public → docs ===');
  console.log(`Agent repo path: ${agentRepoPath}`);
  console.log(`Docs repo path: ${docsRepoPath}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // 1. Read changed files
  const changedFiles = readChangedFiles(changedFilesPath);
  console.log(`Changed files in public repo: ${changedFiles.length}`);
  changedFiles.forEach(f => console.log(`  - ${f}`));
  console.log('');

  // 2. Process each file
  const results = {
    synced: [],
    skipped: [],
    notMapped: [],
    conversionFailed: [],
    errors: [],
  };

  for (const publicPath of changedFiles) {
    console.log(`\nProcessing: ${publicPath}`);

    // Find mapping
    const mapping = findPublicToDocsMapping(publicPath);
    if (!mapping) {
      console.log('  → Not mapped, skipping');
      results.notMapped.push(publicPath);
      continue;
    }

    console.log(`  → Maps to: ${mapping.docsPath}`);

    // Read source file from public repo
    const srcFullPath = path.join(agentRepoPath, publicPath);
    if (!fs.existsSync(srcFullPath)) {
      console.log('  → Source file not found, skipping');
      results.errors.push({ path: publicPath, error: 'Source file not found' });
      continue;
    }

    const srcContent = fs.readFileSync(srcFullPath, 'utf-8');

    // Read target file from docs repo (if exists)
    const dstFullPath = path.join(docsRepoPath, mapping.docsPath);
    let dstContent = null;

    if (fs.existsSync(dstFullPath)) {
      dstContent = fs.readFileSync(dstFullPath, 'utf-8');

      // Compare normalized content (extract text, ignore syntax differences)
      const normalizedSrc = normalize(srcContent);
      const normalizedDst = normalize(dstContent);

      if (normalizedSrc === normalizedDst) {
        console.log('  → Content is identical (after normalization), skipping');
        results.skipped.push({
          path: publicPath,
          docsPath: mapping.docsPath,
          reason: 'identical content',
        });
        continue;
      }
      console.log('  → Content differs, will sync');
    } else {
      console.log('  → Target file not found in docs repo, will create new');
    }

    // Dry run check
    if (dryRun) {
      console.log('  → [DRY RUN] Would convert and copy file');
      results.synced.push({ path: publicPath, docsPath: mapping.docsPath, dryRun: true });
      continue;
    }

    // Convert Markdown to GitBook and write file
    try {
      // Convert using Claude (pass existing GitBook file as structural reference)
      const conversionResult = await convertToGitBookAndValidate(anthropicKey, srcContent, dstContent);

      if (!conversionResult.success) {
        console.log('  → Conversion validation failed, using original content');
        results.conversionFailed.push({
          path: publicPath,
          issues: conversionResult.issues,
        });
      }

      const contentToWrite = conversionResult.success ? conversionResult.content : srcContent;

      // Ensure directory exists
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

  // 3. Output results
  console.log('\n=== Results ===');

  console.log(`\nSynced: ${results.synced.length}`);
  results.synced.forEach(r =>
    console.log(`  ✓ ${r.path} → ${r.docsPath}${r.dryRun ? ' [DRY RUN]' : ''}`)
  );

  console.log(`\nSkipped (identical content): ${results.skipped.length}`);
  results.skipped.forEach(r =>
    console.log(`  - ${r.path}`)
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
  const syncedFilesPath = process.env.SYNCED_FILES_PATH || 'synced_files.txt';
  if (results.synced.length > 0 && !dryRun) {
    const syncedList = results.synced.map(r => r.docsPath).join('\n') + '\n';
    fs.writeFileSync(syncedFilesPath, syncedList, 'utf-8');
    console.log(`\nWrote synced files list to: ${syncedFilesPath}`);
  } else {
    fs.writeFileSync(syncedFilesPath, '', 'utf-8');
  }

  // GitHub Actions output
  if (process.env.GITHUB_OUTPUT) {
    const output = [
      `synced_count=${results.synced.length}`,
      `skipped_count=${results.skipped.length}`,
      `not_mapped_count=${results.notMapped.length}`,
      `error_count=${results.errors.length}`,
    ].join('\n');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, output + '\n');
  }

  // Return summary for workflow
  return {
    syncedCount: results.synced.length,
    skippedCount: results.skipped.length,
    syncedFiles: results.synced.map(r => r.docsPath),
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
