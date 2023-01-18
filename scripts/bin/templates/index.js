import { Command } from 'commander';
import { addNew as addNewModule } from './module';
import { askQuestion, error as _error, info, rl, warn } from './print';
import { addNew as addNewTab } from './tab';
async function askMode() {
    while (true) {
        // eslint-disable-next-line no-await-in-loop
        const mode = await askQuestion('What would you like to create? (module/tab)');
        if (mode !== 'module' && mode !== 'tab') {
            warn("Please answer with only 'module' or 'tab'.");
        }
        else {
            return mode;
        }
    }
}
export default new Command('create')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .description('Interactively create a new module or tab')
    .action(async (buildOpts) => {
    try {
        const mode = await askMode();
        if (mode === 'module')
            await addNewModule(buildOpts);
        else if (mode === 'tab')
            await addNewTab(buildOpts);
    }
    catch (error) {
        _error(`ERROR: ${error.message}`);
        info('Terminating module app...');
    }
    finally {
        rl.close();
    }
});
