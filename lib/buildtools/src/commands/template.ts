import type { Interface } from 'readline/promises';
import { Command } from '@commander-js/extra-typings';

import { getBundlesDir, getTabsDir } from '../getGitRoot.js';
import { addNew as addNewModule } from '../templates/bundle.js';
import { error as _error, askQuestion, getRl, info, warn } from '../templates/print.js';
import { addNew as addNewTab } from '../templates/tab.js';
import { isNodeError } from '../utils.js';

async function askMode(rl: Interface) {
  while (true) {
    const mode = await askQuestion('What would you like to create? (module/tab)', rl);
    if (mode !== 'module' && mode !== 'tab') {
      warn("Please answer with only 'module' or 'tab'.");
    } else {
      return mode;
    }
  }
}

export default function getTemplateCommand() {
  return new Command('template')
    .description('Interactively create a new module or tab')
    .action(async () => {
      const [bundlesDir, tabsDir] = await Promise.all([
        getBundlesDir(),
        getTabsDir()
      ]);

      const rl = getRl();
      try {
        const mode = await askMode(rl);
        if (mode === 'module') await addNewModule(bundlesDir, rl);
        else if (mode === 'tab') await addNewTab(bundlesDir, tabsDir, rl);
      } catch (error) {
        if (isNodeError(error)) {
          _error(`ERROR: ${error.message}`);
        } else {
          _error(`ERROR: ${error}`);
        }
        info('Terminating module app...');
      } finally {
        rl.close();
      }
    });
}
