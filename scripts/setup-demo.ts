import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'


// Get dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type PackageJson = {
  dependencies: Record<string, string>
  version: string
}

function readPackageVersion(packagePath: string): string {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8')) as PackageJson
  return packageJson.version
}

function checkDemoVersion(): void {
  const rootDir = path.resolve(__dirname, '..')
  const demoDir = path.join(rootDir, 'demo')

  // Read versions from both package.json files
  const mainVersion = readPackageVersion(path.join(rootDir, 'package.json'))
  const demoPackagePath = path.join(demoDir, 'package.json')
  const demoPackageJson = JSON.parse(fs.readFileSync(demoPackagePath, 'utf-8'))

  // Check if predictive-textarea is in dependencies with a valid version number
  const demoVersion = demoPackageJson.dependencies?.['predictive-textarea']

  if (!demoVersion) {
    throw new Error('predictive-textarea not found in demo dependencies')
  }

  if (demoVersion !== mainVersion) {
    throw new Error(`Version mismatch: main package is ${mainVersion} but demo depends on ${demoVersion}`)
  }

  // If we get here, versions match
  console.log('✅ Version check passed:', mainVersion)
}

try {
  checkDemoVersion()
}
catch (error) {
  console.error('❌ Version check failed:', error)
  process.exit(1)
}
