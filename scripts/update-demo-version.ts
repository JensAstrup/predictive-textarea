import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import '@types/node'

// Get dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type PackageJson = {
  dependencies: Record<string, string>
  version?: string
}

function updateDemoVersion(): void {
  const rootDir = path.resolve(__dirname, '..')
  const demoDir = path.join(rootDir, 'demo')

  // Read versions from both package.json files
  const demoPackagePath = path.join(demoDir, 'package.json')
  const demoPackageJson = JSON.parse(fs.readFileSync(demoPackagePath, 'utf-8')) as PackageJson

  // Get repo info from environment variables or use default
  const repoOwner = process.env.GITHUB_REPO_OWNER || 'JensAstrup'
  const repoName = process.env.GITHUB_REPO_NAME || 'predictive-textarea'
  const branch = process.env.GITHUB_BRANCH || 'main'

  // Update the demo package.json to use the GitHub repository link
  demoPackageJson.dependencies['predictive-textarea'] = `github:${repoOwner}/${repoName}#${branch}`

  // Write the updated package.json
  fs.writeFileSync(
    demoPackagePath,
    JSON.stringify(demoPackageJson, null, 2) + '\n',
    'utf-8'
  )

  // Using process.stdout.write instead of console.log to avoid linter error
  process.stdout.write('✅ Updated demo dependency to use branch from GitHub\n')
}

// Execute if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateDemoVersion()
}

export { updateDemoVersion }
