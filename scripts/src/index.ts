import { Command } from '@commander-js/extra-typings'
import getBuildCommand from './build'
import { getLintCommand } from './build/prebuild/lint'
import { getTscCommand } from './build/prebuild/tsc'
import getCreateCommand from './templates'
import getTestCommand from './testing'

await new Command('scripts')
  .addCommand(getBuildCommand())
  .addCommand(getLintCommand())
  .addCommand(getTestCommand())
  .addCommand(getTscCommand())
  .addCommand(getCreateCommand())
  .parseAsync()
