import pathlib from 'path'
import { Command } from '@commander-js/extra-typings'
import { srcDirOption } from '@src/commandUtils'
import lodash from 'lodash'

import { runJest } from './runner'

export type TestCommandOptions = {
  srcDir: string
}

const getTestCommand = () => new Command('test')
  .description('Run jest')
  .addOption(srcDirOption)
  .allowUnknownOption()
  .action(({ srcDir }, command) => {
    const [args, filePatterns] = lodash.partition(command.args, arg => arg.startsWith('-'))

    // command.args automatically includes the source directory option
    // which is not supported by Jest, so we need to remove it
    const toRemove = args.findIndex(arg => arg.startsWith('--srcDir'))
    if (toRemove !== -1) {
      args.splice(toRemove, 1)
    }

    const jestArgs = args.concat(filePatterns.map(pattern => pattern.split(pathlib.win32.sep)
      .join(pathlib.posix.sep)))
    return runJest(jestArgs, srcDir)
  })

export default getTestCommand
