import { Command } from '@commander-js/extra-typings';
import { runTscCompileFromTsconfig } from '@sourceacademy/modules-repotools/tsc';
import { formatTscResult } from '../build/formatter.js';
import { logCommandErrorAndExit } from './commandUtils.js';

// TODO: Possibly look into supporting watch mode

export const getCompileCommand = () => new Command('compile')
  .description('Compiles the bundle at the given directory')
  .argument('[bundle]', 'Directory in which the bundle\'s source files are located', process.cwd())
  .action(async directory => {
    const result = await runTscCompileFromTsconfig(directory);

    if (result === undefined) logCommandErrorAndExit(`No bundle found at ${directory}!`);
    else if (result.severity === 'error') {
      logCommandErrorAndExit(result);
    }

    console.log(formatTscResult(result as any));
  });
