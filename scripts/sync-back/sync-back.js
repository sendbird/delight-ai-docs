#!/usr/bin/env node

/**
 * Reverse Sync Main Script
 *
 * Detects changes in docs repo and creates PRs to private repos
 * Uses Claude API for GitBook → Markdown conversion and validation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
// Shared modules
const { normalize } = require('../normalizer');
const { convertAndValidate } = require('../claude-converter');
const mappingTable = require('../mapping-table.json');

/**
 * Get list of changed files
 */
function getChangedFiles(baseSha, headSha) {
  try {
    const output = execSync(
      `git diff --name-only ${baseSha} ${headSha} -- 'sdk-docs/**/*.md'`,
      { encoding: 'utf-8' }
    );
    return output.split('\n').filter(f => f.trim().length > 0);
  } catch (error) {
    console.error('Failed to get changed files:', error.message);
    return [];
  }
}

/**
 * Find mapping info from mapping table
 * Supports pattern-based mapping - auto sync when new files are added
 */
function findMapping(docsPath) {
  // 1. Check overrides first (exact path matching)
  if (mappingTable.overrides && mappingTable.overrides[docsPath]) {
    const override = mappingTable.overrides[docsPath];
    // Ignore $comment field
    if (override.repo && override.privatePath) {
      const repoInfo = mappingTable.repositories[override.repo];
      if (repoInfo) {
        return {
          owner: repoInfo.owner,
          repo: repoInfo.repo,
          fullPath: override.privatePath,
          repoKey: override.repo,
          defaultBranch: repoInfo.defaultBranch || 'main',
        };
      }
    }
  }

  // 2. Iterate patterns (prefix matching - more specific patterns defined first)
  if (mappingTable.patterns) {
    for (const pattern of mappingTable.patterns) {
      if (docsPath.startsWith(pattern.docsPrefix)) {
        const repoInfo = mappingTable.repositories[pattern.repo];
        if (!repoInfo) {
          continue;
        }

        const filename = docsPath.slice(pattern.docsPrefix.length);
        const privatePath = pattern.privateBase + filename;

        return {
          owner: repoInfo.owner,
          repo: repoInfo.repo,
          fullPath: privatePath,
          repoKey: pattern.repo,
          defaultBranch: repoInfo.defaultBranch || 'main',
        };
      }
    }
  }

  // 3. Legacy mappings support (backward compatibility)
  if (mappingTable.mappings && mappingTable.mappings[docsPath]) {
    const mapping = mappingTable.mappings[docsPath];
    if (mapping.privatePath) {
      const repoInfo = mappingTable.repositories[mapping.repo];
      if (repoInfo) {
        return {
          owner: repoInfo.owner,
          repo: repoInfo.repo,
          fullPath: mapping.privatePath,
          repoKey: mapping.repo,
          defaultBranch: repoInfo.defaultBranch || 'main',
        };
      }
    }
  }

  return null;
}

/**
 * Get private repo file content via GitHub API
 */
async function getPrivateRepoContent(owner, repo, filePath, branch, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`  File not found in private repo: ${filePath}`);
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return content;
  } catch (error) {
    console.error(`Failed to fetch ${owner}/${repo}/${filePath}:`, error.message);
    return null;
  }
}

/**
 * Create branch in private repo
 */
async function createBranch(owner, repo, branchName, baseBranch, token) {
  const refUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${baseBranch}`;
  const refResponse = await fetch(refUrl, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!refResponse.ok) {
    console.error(`Failed to get base branch ref: ${await refResponse.text()}`);
    return false;
  }

  const refData = await refResponse.json();
  const sha = refData.object.sha;

  const createUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs`;
  const createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: sha,
    }),
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    if (errorText.includes('Reference already exists')) {
      console.log(`  Branch ${branchName} already exists`);
      return true;
    }
    console.error(`Failed to create branch: ${errorText}`);
    return false;
  }

  console.log(`  Created branch: ${branchName}`);
  return true;
}

/**
 * Update file in private repo
 */
async function updateFile(owner, repo, filePath, content, branch, message, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  let sha = null;
  const getResponse = await fetch(`${url}?ref=${branch}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (getResponse.ok) {
    const data = await getResponse.json();
    sha = data.sha;
  }

  const body = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error(`Failed to update file: ${await response.text()}`);
    return false;
  }

  console.log(`  Updated file: ${filePath}`);
  return true;
}

/**
 * Create pull request
 */
async function createPullRequest(owner, repo, title, body, head, base, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      body,
      head,
      base,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (errorText.includes('A pull request already exists')) {
      console.log(`  PR already exists for ${head}`);
      return null;
    }
    console.error(`Failed to create PR: ${errorText}`);
    return null;
  }

  const data = await response.json();
  console.log(`  Created PR: ${data.html_url}`);
  return data.html_url;
}

/**
 * Main execution function
 */
async function main() {
  const githubToken = process.env.GITHUB_TOKEN;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!githubToken) {
    console.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  if (!anthropicKey) {
    console.error('ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  const baseSha = process.env.BASE_SHA || 'HEAD~1';
  const headSha = process.env.HEAD_SHA || 'HEAD';
  const dryRun = process.env.DRY_RUN === 'true';

  console.log('=== Sync Back: docs → private repos ===');
  console.log(`Base SHA: ${baseSha}`);
  console.log(`Head SHA: ${headSha}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // 1. Extract changed files list
  const manualFiles = process.env.MANUAL_FILES;
  const changedFiles = manualFiles
    ? manualFiles.split(',').map(f => f.trim()).filter(f => f.length > 0)
    : getChangedFiles(baseSha, headSha);
  console.log(`Changed files: ${changedFiles.length}${manualFiles ? ' (manual)' : ''}`);
  changedFiles.forEach(f => console.log(`  - ${f}`));
  console.log('');

  // 2. Process each file
  const results = {
    synced: [],
    skipped: [],
    notMapped: [],
    validationFailed: [],
    errors: [],
  };

  for (const docsPath of changedFiles) {
    console.log(`\nProcessing: ${docsPath}`);

    // Find mapping
    const mapping = findMapping(docsPath);
    if (!mapping) {
      console.log('  → Not mapped, skipping');
      results.notMapped.push(docsPath);
      continue;
    }

    console.log(`  → Maps to: ${mapping.owner}/${mapping.repo}/${mapping.fullPath}`);
    console.log(`  → Base branch: ${mapping.defaultBranch}`);

    // Read docs repo file
    const docsFullPath = path.join(process.cwd(), docsPath);
    if (!fs.existsSync(docsFullPath)) {
      console.log('  → File deleted in docs repo, skipping');
      results.skipped.push({ path: docsPath, reason: 'deleted' });
      continue;
    }

    const docsContent = fs.readFileSync(docsFullPath, 'utf-8');

    // Get private repo file
    const privateContent = await getPrivateRepoContent(
      mapping.owner,
      mapping.repo,
      mapping.fullPath,
      mapping.defaultBranch,
      githubToken
    );

    // Compare normalized content (extract text, ignore syntax differences)
    if (privateContent !== null) {
      const normalizedDocs = normalize(docsContent);
      const normalizedPrivate = normalize(privateContent);

      if (normalizedDocs === normalizedPrivate) {
        console.log('  → Content is identical (after normalization), skipping');
        results.skipped.push({ path: docsPath, reason: 'identical content' });
        continue;
      }
      console.log('  → Content differs, will sync');
    } else {
      console.log('  → File not found in private repo, will create new');
    }

    // Dry run check
    if (dryRun) {
      console.log('  → [DRY RUN] Would convert and create PR');
      results.synced.push({ path: docsPath, dryRun: true });
      continue;
    }

    // Convert and validate with Claude
    try {
      const conversionResult = await convertAndValidate(anthropicKey, docsContent);

      if (!conversionResult.success) {
        console.log('  → Validation failed, skipping PR creation');
        results.validationFailed.push({
          path: docsPath,
          issues: conversionResult.issues,
        });
        continue;
      }

      const convertedContent = conversionResult.content;

      // PR creation logic
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const branchName = `sync-back/${timestamp}/${path.basename(docsPath, '.md')}`;

      // Create branch
      const branchCreated = await createBranch(
        mapping.owner,
        mapping.repo,
        branchName,
        mapping.defaultBranch,
        githubToken
      );

      if (!branchCreated) {
        results.errors.push({ path: docsPath, error: 'Failed to create branch' });
        continue;
      }

      // Update file
      const fileUpdated = await updateFile(
        mapping.owner,
        mapping.repo,
        mapping.fullPath,
        convertedContent,
        branchName,
        `docs: sync from docs repo (${docsPath})`,
        githubToken
      );

      if (!fileUpdated) {
        results.errors.push({ path: docsPath, error: 'Failed to update file' });
        continue;
      }

      // Create PR
      const prUrl = await createPullRequest(
        mapping.owner,
        mapping.repo,
        `[Sync Back] Update ${path.basename(docsPath)} from docs repo`,
        `## Summary

This PR syncs changes from the docs repo back to the private repo.

**Source file:** \`${docsPath}\` (docs repo)
**Target file:** \`${mapping.fullPath}\` (this repo)

### Changes

Content was modified by TW in GitBook and synced to the docs repo.
This PR brings those changes back to the private repo.

### Conversion

- ✅ GitBook syntax converted to pure Markdown using Claude AI
- ✅ Conversion validated (content integrity verified)

---

🤖 This PR was automatically created by the sync-back workflow.`,
        branchName,
        mapping.defaultBranch,
        githubToken
      );

      if (prUrl) {
        results.synced.push({ path: docsPath, prUrl });
      } else {
        results.synced.push({ path: docsPath, note: 'PR may already exist' });
      }
    } catch (error) {
      console.error(`  Error: ${error.message}`);
      results.errors.push({ path: docsPath, error: error.message });
    }
  }

  // 3. Output results
  console.log('\n=== Results ===');

  console.log(`\nSynced: ${results.synced.length}`);
  results.synced.forEach(r => console.log(`  ✓ ${r.path} ${r.prUrl || r.note || '[DRY RUN]'}`));

  console.log(`\nSkipped (identical content): ${results.skipped.length}`);
  results.skipped.forEach(r => console.log(`  - ${r.path}`));

  console.log(`\nNot mapped: ${results.notMapped.length}`);
  results.notMapped.forEach(p => console.log(`  - ${p}`));

  console.log(`\nValidation failed: ${results.validationFailed.length}`);
  results.validationFailed.forEach(v => {
    console.log(`  ⚠ ${v.path}`);
    v.issues.forEach(i => console.log(`    - ${i}`));
  });

  console.log(`\nErrors: ${results.errors.length}`);
  results.errors.forEach(e => console.log(`  ✗ ${e.path}: ${e.error}`));

  // GitHub Actions output
  if (process.env.GITHUB_OUTPUT) {
    const output = [
      `synced_count=${results.synced.length}`,
      `skipped_count=${results.skipped.length}`,
      `validation_failed_count=${results.validationFailed.length}`,
      `error_count=${results.errors.length}`,
    ].join('\n');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, output);
  }

  // Exit with failure if validation failed or errors occurred
  if (results.errors.length > 0 || results.validationFailed.length > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
