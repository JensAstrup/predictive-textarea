import { fileURLToPath } from 'url'

import { Command } from 'commander'
import { config } from 'dotenv'

import { createRelease } from './create-release'
import { prepareVersion } from './prepare-version'


config({ path: '.env.local' })

// ESM equivalent of __filename and __dirname
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url)

if (isMainModule) {
  const program = new Command()

  program
    .name('release-branch')
    .description('Commands for managing releases')
    .version('1.0.1')

  program
    .command('prepare-version <type>')
    .description('Create a version bump branch and PR to develop. Type: major, minor, or patch')
    .option('--alpha', 'Create alpha prerelease')
    .option('--beta', 'Create beta prerelease')
    .option('--rc', 'Create release candidate')
    .option('--preid <identifier>', 'Custom prerelease identifier')
    .action((type: 'major' | 'minor' | 'patch', options) => {
      // Create new argv that preserves all original options
      const newArgv: string[] = []

      // Add the node executable and script path if they exist
      if (process.argv[0]) newArgv.push(process.argv[0])
      if (process.argv[1]) newArgv.push(process.argv[1])

      // Add the version type and options
      newArgv.push(type)

      if (options.alpha) newArgv.push('--alpha')
      if (options.beta) newArgv.push('--beta')
      if (options.rc) newArgv.push('--rc')
      if (options.preid) newArgv.push('--preid', String(options.preid))

      process.argv = newArgv
      prepareVersion()
    })

  program
    .command('create-release')
    .description('Create a release branch and PR to main')
    .action(() => {
      createRelease()
    })

  program.parse(process.argv)
}

export {
  prepareVersion,
  createRelease
}
