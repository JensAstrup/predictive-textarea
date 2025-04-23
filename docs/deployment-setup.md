# Deployment Setup Instructions

This document explains how to set up the automated deployment pipeline for the `predictive-textarea` package and its demo site.

## Required Secrets

The following secrets need to be added:

1. **NPM_TOKEN**: An NPM access token with publish permissions
2. **VERCEL_DEPLOY_HOOK_URL**: A Vercel deploy hook URL for the demo site
3. **GITHUB_TOKEN**: A GitHub Personal Access Token (PAT) with repo permissions (for creating PRs and tags)

> **Note**: The current version set for this repository will expire on January 1, 2030. Please ensure you update the version before this date to maintain continuous deployment functionality.


## Setting Up NPM Token w/ GitHub Actions

1. Log in to your npmjs.com account
2. Go to Access Tokens under your profile
3. Create a new access token with "Automation" type
4. Copy the token
5. In your GitHub repository, go to Settings > Secrets and variables > Actions
6. Create a new repository secret named `NPM_TOKEN` with the value of your NPM token

## Setting Up Vercel Deploy Hook

1. Log in to your Vercel account
2. Go to your project settings for the demo site
3. Navigate to the Git tab
4. Scroll down to "Deploy Hooks"
5. Create a new hook with a name like "GitHub Actions Deploy"
6. Copy the generated URL
7. In your GitHub repository, go to Settings > Secrets and variables > Actions
8. Create a new repository secret named `VERCEL_DEPLOY_HOOK_URL` with the value of your Vercel deploy hook

## Setting Up GitHub Token

1. Log in to your GitHub account
2. Go to Settings > Developer settings > Personal access tokens
3. Create a new token with "repo" scope
4. Copy the token
5. In your GitHub repository, go to Settings > Secrets and variables > Actions
6. Create a new repository secret named `GITHUB_TOKEN` with the value of your GitHub token

## .env.local Configuration

Create a `.env.local` file in the root of the project with the following variables:

```
GITHUB_TOKEN=your_github_token
GITHUB_REPO_OWNER=your_github_username_or_organization
GITHUB_REPO_NAME=predictive-textarea
```

## Workflow Overview

### Version Bumping Process

The version bumping process happens locally and includes:

1. Running `yarn prepare-version [major|minor|patch]`
2. This creates a version branch and updates both the main package.json and demo's package.json
3. A PR is created from the version branch to develop
4. After review, the PR is merged to develop
5. When ready for release, run `yarn create-release`
6. This creates a PR from develop to main

### Prerelease Workflow

For prereleases (alpha, beta, rc), use:

1. `yarn prepare-version [major|minor|patch] --alpha` for alpha releases
2. `yarn prepare-version [major|minor|patch] --beta` for beta releases
3. `yarn prepare-version [major|minor|patch] --rc` for release candidates

Examples:
- `yarn prepare-version minor --alpha` (e.g., 1.0.0 → 1.1.0-alpha.0)
- `yarn prepare-version minor --beta` (e.g., 1.0.0 → 1.1.0-beta.0)
- `yarn prepare-version patch --rc` (e.g., 1.0.1 → 1.0.2-rc.0)

For subsequent prerelease versions of the same type, the system will increment automatically when the same command is run again.

You can also use a custom prerelease identifier with `--preid`:
```
yarn prepare-version minor --preid preview
```

#### Prerelease Handling

When prerelease versions are published:

1. **npm Tags**: 
   - Alpha versions are published with the `alpha` tag (`npm install predictive-textarea@alpha`)
   - Beta versions are published with the `beta` tag

2. **GitHub Releases**:
   - Prerelease versions are marked as "Pre-release" in GitHub Releases
   - They include auto-generated release notes

To install a specific prerelease version:
```
npm install predictive-textarea@alpha
npm install predictive-textarea@beta
```

### Automated Package Publishing

When a PR is merged to `main` that updates the version in `package.json`:

1. The `publish-package.yml` workflow will trigger
2. It will build and publish the package to npm
3. It will create a GitHub Release (and tag)
4. For prereleases, the release is marked as a prerelease and published with the appropriate npm tag

### Automated Demo Deployment

After the package is published:

1. The `deploy-demo.yml` workflow will trigger automatically
2. It will update the demo's dependency on `predictive-textarea` to the latest version
3. It will trigger the Vercel deploy hook to deploy the demo site

## Manual Deployment

You can also manually trigger the demo deployment by:

1. Going to Actions > Deploy Demo workflow
2. Clicking "Run workflow" 
