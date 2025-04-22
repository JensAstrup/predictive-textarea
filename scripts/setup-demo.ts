import { execSync } from 'child_process'
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

  // Install the library in the demo directory using direct file reference
  console.log('Installing library in demo...')
  execSync('yarn add predictive-textarea@file:..', { stdio: 'inherit', cwd: demoDir })

  console.log('Demo setup complete!')
}

try {
  setupDemo()
}
catch (error) {
  console.error('Error setting up demo:', error)
  process.exit(1)
}
