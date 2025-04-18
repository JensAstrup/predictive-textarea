import { Command } from 'commander'
import { config } from 'dotenv'

import { createRelease } from './create-release'
import { prepareVersion } from './prepare-version'


config({ path: '.env.local' })

if (require.main === module) {
  const program = new Command()

  program
    .name('release-branch')
    .description('Commands for managing releases')
    .version('1.0.1')

  program
    .command('prepare-version')
    .description('Create a version bump branch and PR to develop')
    .argument('<type>', 'Version increment type: major, minor, or patch')
    .action((type) => {
      process.argv = [...process.argv.slice(0, 2), type]
      prepareVersion()
    })

  program
    .command('create-release')
    .description('Create a release branch and PR to main')
    .action(() => {
      createRelease()
    })

  program.parse()
}

export {
  prepareVersion,
  createRelease
}
