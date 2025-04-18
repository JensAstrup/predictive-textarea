import { Issue, LinearClient } from '@linear/sdk'
import { config } from 'dotenv'
import { execa } from 'execa'
import { Octokit } from 'octokit'
import OpenAI from 'openai'
import ora from 'ora'

import { getNewVersion } from './utils/get-new-version'


config({ path: '.env.local' })


/**
 * Creates a GitHub PR from develop to main with release notes
 */
async function createPullRequest(): Promise<string> {
  const version = await getNewVersion()
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN!,
  })
  const repo = process.env.GITHUB_REPO_NAME!
  const pullRequest = await octokit.rest.pulls.create({
    owner: process.env.GITHUB_REPO_OWNER!,
    repo,
    title: `${version}`,
    body: '',
    head: 'develop',
    base: 'main',
  })
  return pullRequest.data.html_url
}

async function updateDevelopBranch(): Promise<void> {
  await execa('git', ['checkout', 'develop'])
  await execa('git', ['pull', 'origin', 'develop'])
}

/**
 * Main function to create a release
 */
async function createRelease(): Promise<void> {
  const spinner = ora('Starting release process').start()

  try {
    spinner.text = 'Updating develop branch'
    await updateDevelopBranch()

    spinner.text = 'Creating pull request'
    const pullRequestUrl = await createPullRequest()

    spinner.succeed(`Release PR created: ${pullRequestUrl}`)
  }
  catch (error) {
    spinner.fail(error instanceof Error ? error.message : 'Unknown error occurred')
    process.exit(1)
  }
}

// Execute if called directly
if (require.main === module) {
  createRelease()
}

export { createRelease, createPullRequest }
