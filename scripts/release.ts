#!/usr/bin/env node
/**
 * Release script for creating GitHub releases
 *
 * This script is called by the changesets action after version PRs are merged.
 * It creates GitHub releases for each app (admin, shipper) with changelog content.
 *
 * Usage: node --experimental-strip-types ./scripts/release.ts
 *
 * Environment variables:
 * - GITHUB_TOKEN: GitHub token with repo permissions (required)
 * - GITHUB_REPOSITORY: Repository in format owner/repo (required)
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Octokit } from '@octokit/rest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Apps to create releases for
const APPS = ['api', 'db', 'web'] as const;

interface PackageJson {
  name: string;
  version: string;
}

/**
 * Read package.json for an app
 */
function getPackageVersion(appName: string): string {
  const pkgPath = join(__dirname, '..', 'apps', appName, 'package.json');
  const pkg: PackageJson = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  return pkg.version;
}

/**
 * Extract changelog section for a specific version
 */
function getChangelogForVersion(appName: string, version: string): string {
  const changelogPath = join(__dirname, '..', 'apps', appName, 'CHANGELOG.md');

  try {
    const changelog = readFileSync(changelogPath, 'utf-8');

    // Find the section for this version
    const versionHeader = `## ${version}`;
    const startIndex = changelog.indexOf(versionHeader);

    if (startIndex === -1) {
      console.log(`⚠️  No changelog entry found for ${appName}@${version}`);
      return `Release ${version}`;
    }

    // Find the next version header (or end of file)
    const nextVersionIndex = changelog.indexOf('\n## ', startIndex + versionHeader.length);
    const endIndex = nextVersionIndex === -1 ? changelog.length : nextVersionIndex;

    // Extract and clean the section
    let section = changelog.substring(startIndex + versionHeader.length, endIndex).trim();

    // Add the version header back
    return `## ${version}\n\n${section}`;
  } catch (error) {
    console.log(`⚠️  Could not read changelog for ${appName}: ${error}`);
    return `Release ${version}`;
  }
}

/**
 * Check if a release already exists
 */
async function releaseExists(
  octokit: Octokit,
  owner: string,
  repo: string,
  tag: string
): Promise<boolean> {
  try {
    await octokit.repos.getReleaseByTag({
      owner,
      repo,
      tag,
    });
    return true;
  } catch (error: any) {
    if (error.status === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Create a GitHub release
 */
async function createRelease(
  octokit: Octokit,
  owner: string,
  repo: string,
  appName: string,
  version: string,
  changelog: string
): Promise<void> {
  const tag = `${appName}@${version}`;

  console.log(`📦 Creating release for ${tag}...`);

  try {
    await octokit.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: tag,
      body: changelog,
      target_commitish: 'main',
      draft: false,
      prerelease: false,
    });

    console.log(`✅ Release created: ${tag}`);
  } catch (error: any) {
    console.error(`❌ Failed to create release for ${tag}:`, error.message);
    throw error;
  }
}

/**
 * Main release function
 */
async function main() {
  // Validate environment
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  if (!repository) {
    throw new Error('GITHUB_REPOSITORY environment variable is required');
  }

  const [owner, repo] = repository.split('/');

  if (!owner || !repo) {
    throw new Error(`Invalid GITHUB_REPOSITORY format: ${repository} (expected: owner/repo)`);
  }

  console.log(`🚀 Creating GitHub releases for ${repository}\n`);

  // Initialize Octokit
  const octokit = new Octokit({ auth: token });

  // Process each app
  for (const app of APPS) {
    try {
      const version = getPackageVersion(app);
      const tag = `${app}@${version}`;

      console.log(`\n📍 Processing ${app}@${version}`);

      // Check if release already exists
      const exists = await releaseExists(octokit, owner, repo, tag);

      if (exists) {
        console.log(`  ℹ️  Release ${tag} already exists, skipping`);
        continue;
      }

      // Get changelog content
      const changelog = getChangelogForVersion(app, version);

      // Create the release
      await createRelease(octokit, owner, repo, app, version, changelog);

    } catch (error: any) {
      console.error(`\n❌ Error processing ${app}:`, error.message);
      // Continue with other apps even if one fails
    }
  }

  console.log('\n✨ Release process completed!');
}

// Run the script
main().catch((error) => {
  console.error('\n💥 Release script failed:', error);
  process.exit(1);
});
