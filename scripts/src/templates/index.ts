import { Command } from '@commander-js/extra-typings'

import { manifestOption, srcDirOption } from '@src/commandUtils'
import { addNew as addNewModule } from './module'
import { askQuestion, error as _error, info, rl, warn } from './print'
import { addNew as addNewTab } from './tab'

async function askMode() {
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const mode = await askQuestion(
      'What would you like to create? (module/tab)'
    )
    if (mode !== 'module' && mode !== 'tab') {
      warn('Please answer with only \'module\' or \'tab\'.')
    } else {
      return mode
    }
  }
}

export default function getCreateCommand() {
  return new Command('create')
    .addOption(srcDirOption)
    .addOption(manifestOption)
    .description('Interactively create a new module or tab')
    .action(async (buildOpts) => {
      try {
        const mode = await askMode()
        if (mode === 'module') await addNewModule(buildOpts)
        else if (mode === 'tab') await addNewTab(buildOpts)
      } catch (error) {
        _error(`ERROR: ${error.message}`)
        info('Terminating module app...')
      } finally {
        rl.close()
      }
    })
}
