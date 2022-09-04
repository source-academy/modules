import { Command } from 'commander';

import { addNew as addNewModule } from './module';
import { askQuestion, error as _error, info, rl, warn } from './print';
import { addNew as addNewTab } from './tab';

async function askMode() {
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const mode = await askQuestion(
      'What would you like to create? (module/tab)',
    );
    if (mode !== 'module' && mode !== 'tab') {
      warn("Please answer with only 'module' or 'tab'.");
    } else {
      return mode;
    }
  }
}

export default new Command('create')
  .description('Interactive script for creating modules and tabs')
  .action(
    async () => {
      try {
        const mode = await askMode();
        if (mode === 'module') await addNewModule();
        else if (mode === 'tab') await addNewTab();
      } catch (error) {
        _error(`ERROR: ${error.message}`);
        info('Terminating module app...');
      } finally {
        rl.close();
      }
    },
  );
