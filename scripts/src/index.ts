import { Command } from '@commander-js/extra-typings'
import templateCommand from './templates'
import getBuildCommand from './build'
import getTestCommand from './testing'
import { getLintCommand } from './build/prebuild/lint'
import { getTscCommand } from './build/prebuild/tsc'

await new Command('scripts')
  .addCommand(getBuildCommand())
  .addCommand(getLintCommand())
  .addCommand(getTestCommand())
  .addCommand(getTscCommand())
  .addCommand(templateCommand)
  .parseAsync()

process.exit(0)
