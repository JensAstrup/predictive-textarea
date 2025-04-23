import { Command } from 'commander'
import { config } from 'dotenv'
import { execa } from 'execa'
import { Octokit } from 'octokit'
import ora from 'ora'

import { updateDemoVersion } from './update-demo-version'
import { getNewVersion } from './utils/get-new-version'


config({ path: '.env.local' })

type VersionType = 'major' | 'minor' | 'patch' | 'premajor' | 'preminor' | 'prepatch' | 'prerelease'

/**
 * Creates a new branch for version bump and pushes it
 */
async function bumpVersion(versionType: string, preId?: string): Promise<string> {
  const { stdout: status } = await execa('git', ['status', '--porcelain'])
  if (status) {
    throw new Error('bumpVersion: Working directory is not clean. Please commit or stash changes.')
  }

  // Create version branch from develop
  await execa('git', ['fetch', 'origin', 'develop'])
  await execa('git', ['checkout', 'develop'])
  await execa('git', ['pull', 'origin', 'develop'])

  // Get the new version before creating the branch
  const versionArgs = ['version', versionType]

  // Add prerelease identifier if provided
  if (preId) {
    versionArgs.push('--preid', preId)
  }

  await execa('yarn', versionArgs)
  const version = await getNewVersion()
  const versionBranch = `v${version}`

  // Delete local branch if it exists
  try {
    await execa('git', ['branch', '-D', versionBranch])
    // eslint-disable-next-line no-console
    console.log(`Deleted existing local branch: ${versionBranch}`)
  }
  catch {
    // Branch doesn't exist locally, continue
    // eslint-disable-next-line no-console
    console.log(`No existing local branch: ${versionBranch}`)
  }

  // Check if branch exists remotely and delete it
  try {
    const { stdout } = await execa('git', ['ls-remote', '--heads', 'origin', versionBranch])
    if (stdout) {
      // Branch exists, delete it remotely
      await execa('git', ['push', 'origin', '--delete', versionBranch])
      // eslint-disable-next-line no-console
      console.log(`Deleted existing remote branch: ${versionBranch}`)
    }
  }
  catch {
    // Branch doesn't exist or error checking, continue
    // eslint-disable-next-line no-console
    console.log(`No existing remote branch: ${versionBranch}`)
  }

  // Update demo to use the GitHub repo link
  updateDemoVersion()

  // Create new branch and commit version bump
  await execa('git', ['checkout', '-b', versionBranch])
  await execa('git', ['add', 'package.json', 'demo/package.json'])
  await execa('git', ['commit', '-m', `chore: bump version to ${version} and update demo dependency`])
  await execa('git', ['push', 'origin', versionBranch])

  return version
}

/**
 * Creates a PR for the version bump
 */
async function createVersionPullRequest(version: string): Promise<string> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN!,
  })
  const repo = process.env.GITHUB_REPO_NAME!
  const pullRequest = await octokit.rest.pulls.create({
    owner: process.env.GITHUB_REPO_OWNER!,
    repo,
    title: `Bump version to ${version}`,
    body: `Version bump to ${version}`,
    head: `v${version}`,
    base: 'develop',
  })
  return pullRequest.data.html_url
}

/**
 * Main function to prepare a version bump
 */
async function prepareVersion(): Promise<void> {
  const program = new Command()

  program
    .version('1.0.0')
    .option('--alpha', 'Use alpha prerelease tag')
    .option('--beta', 'Use beta prerelease tag')
    .option('--rc', 'Use release candidate tag')
    .option('--preid <identifier>', 'Custom prerelease identifier')
    .parse(process.argv)

  const versionType = program.args[0] as VersionType
  const validBaseTypes = ['major', 'minor', 'patch']

  // Validate base version type
  if (!validBaseTypes.includes(versionType)) {
    process.stderr.write(`Version type must be one of: ${validBaseTypes.join(', ')}\n`)
    process.exit(1)
  }

  // Handle prerelease options
  const opts = program.opts()
  let preId: string | undefined
  let preVersionType = versionType

  if (opts.alpha) {
    preId = 'alpha'
    preVersionType = `pre${versionType}` as VersionType
  }
  else if (opts.beta) {
    preId = 'beta'
    preVersionType = `pre${versionType}` as VersionType
  }
  else if (opts.rc) {
    preId = 'rc'
    preVersionType = `pre${versionType}` as VersionType
  }
  else if (opts.preid) {
    preId = opts.preid
    preVersionType = `pre${versionType}` as VersionType
  }

  const spinner = ora('Starting version bump process').start()

  try {
    spinner.text = 'Creating version branch'
    const version = await bumpVersion(preVersionType, preId)

    spinner.text = 'Creating pull request to develop'
    const pullRequestUrl = await createVersionPullRequest(version)

    spinner.succeed(`Version bump PR created: ${pullRequestUrl}`)
  }
  catch (error) {
    spinner.fail(error instanceof Error ? error.message : 'Unknown error occurred')
    process.exit(1)
  }
}

// Execute if called directly
if (process.argv[1] === import.meta.url) {
  prepareVersion()
}

export {
  prepareVersion,
  bumpVersion,
  createVersionPullRequest
}
