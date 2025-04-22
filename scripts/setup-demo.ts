import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function setupDemo(): void {
  const rootDir = path.resolve(__dirname, '..')
  const demoDir = path.join(rootDir, 'demo')
  const isVercel = process.env.VERCEL === '1'

  console.log('Setting up demo environment...')

  // In Vercel, we need to install dependencies in the root directory first
  if (isVercel) {
    console.log('Installing root project dependencies...')
    execSync('yarn install', { stdio: 'inherit', cwd: rootDir })
  }

  // Build the library
  console.log('Building library...')
  execSync('yarn build', { stdio: 'inherit', cwd: rootDir })

  // Create a tarball of the built library
  console.log('Creating library tarball...')
  execSync('yarn pack', { stdio: 'inherit', cwd: rootDir })

  // Get the tarball filename
  const files = fs.readdirSync(rootDir)
  const tarball = files.find(file => file === 'package.tgz')

  if (!tarball) {
    throw new Error('Could not find library tarball (package.tgz)')
  }

  // Install the tarball in the demo directory
  console.log('Installing library in demo...')
  execSync(`yarn add predictive-textarea@file:../${tarball}`, { stdio: 'inherit', cwd: demoDir })

  console.log('Demo setup complete!')
}

try {
  setupDemo()
}
catch (error) {
  console.error('Error setting up demo:', error)
  process.exit(1)
}
