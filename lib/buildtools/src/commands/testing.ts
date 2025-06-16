import { resolve } from 'path';
import { Command, Option } from '@commander-js/extra-typings';
import type { VitestRunMode } from 'vitest/node';
import runVitest from '../testing.js';

export const getTestCommand = () => new Command('test')
  .argument('[testPattern]', 'Pattern to filter tests')
  .addOption(
    new Option('--mode <mode>', 'Vitest Run Mode. See https://vitest.dev/guide/cli.html#mode')
      .choices(['test', 'benchmark'] as VitestRunMode[])
      .default('test')
  )
  .addOption(
    new Option('-w, --watch')
      .default(false)
  )
  .option('--coverage')
  .option('-u, --update', 'Update snapshots')
  .action(async (testPattern, { mode, ...options }) => {
    const fullyResolved = resolve(testPattern ?? process.cwd());
    const vitest = await runVitest(mode, fullyResolved, options);
    await vitest.close();
  });
