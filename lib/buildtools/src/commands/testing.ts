import { resolve } from 'path';
import { Command, Option } from '@commander-js/extra-typings';
import type { VitestRunMode } from 'vitest/node';
import runVitest from '../testing';

export const getTestCommand = () => new Command('test')
  .argument('[directory]', 'Directory to search for tests, or if not provided, assumes the current working directory')
  .addOption(
    new Option('--mode <mode>', 'Vitest Run Mode. See https://vitest.dev/guide/cli.html#mode')
      .choices(['test', 'benchmark'] as VitestRunMode[])
      .default('test')
  )
  .option('-w, --watch')
  .action(async (directory, { mode, watch }) => {
    const fullyResolved = resolve(directory ?? process.cwd());
    const vitest = await runVitest(mode, fullyResolved, !!watch);
    console.log('config', vitest.config);
    await vitest.close();
  });
