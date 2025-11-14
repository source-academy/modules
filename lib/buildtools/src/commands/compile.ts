import { Command } from '@commander-js/extra-typings';
import { resolveSingleBundle } from '@sourceacademy/modules-repotools/manifest';
import { formatTscResult, getTsconfig, runTscCompile } from '../../../repotools/src/tsc.js';
import { logCommandErrorAndExit } from './commandUtils.js';

// TODO: Possibly look into supporting watch mode

export const getCompileCommand = () => new Command('compile')
  .description('Compiles the bundle at the given directory')
  .argument('[bundle]', 'Directory in which the bundle\'s source files are located', process.cwd())
  .action(async directory => {
    const result = await resolveSingleBundle(directory);
    if (result === undefined) logCommandErrorAndExit(`No bundle found at ${directory}!`);
    else if (result.severity === 'error') {
      logCommandErrorAndExit(result);
    }

    const { bundle } = result;
    const tsconfigResult = await getTsconfig(bundle.directory);
    if (tsconfigResult.severity === 'error') {
      return;
    }

    const { tsconfig, fileNames } = tsconfigResult;
    const compileResult = runTscCompile(tsconfig, fileNames);
    console.log(formatTscResult(compileResult as any));
  });
