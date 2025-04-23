import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type PackageJson = {
  dependencies: Record<string, string>
  version?: string
}

function readPackageVersion(packagePath: string): string {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8')) as PackageJson
  return packageJson.version || '0.0.0'
}

function updateDemoVersion(): void {
  const rootDir = path.resolve(__dirname, '..')
  const demoDir = path.join(rootDir, 'demo')

  // Read versions from both package.json files
  const mainVersion = readPackageVersion(path.join(rootDir, 'package.json'))
  const demoPackagePath = path.join(demoDir, 'package.json')
  const demoPackageJson = JSON.parse(fs.readFileSync(demoPackagePath, 'utf-8')) as PackageJson

  // Update the demo package.json with the new version
  demoPackageJson.dependencies['predictive-textarea'] = mainVersion

  // Write the updated package.json
  fs.writeFileSync(
    demoPackagePath,
    JSON.stringify(demoPackageJson, null, 2) + '\n',
    'utf-8'
  )

  // Using process.stdout.write instead of console.log to avoid linter error
  process.stdout.write(`✅ Updated demo dependency to version ${mainVersion}\n`)
}

// Execute if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateDemoVersion()
}

export { updateDemoVersion }
