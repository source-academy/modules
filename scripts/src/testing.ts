import { Command } from 'commander';
import jest from 'jest';
import * as pathlib from 'path';

type TestCommandOptions = {
  srcDir: string
  verbose: boolean
  watch: boolean
};

const testCommand = new Command('test')
  .description('Run jest')
  .argument('[patterns...]', null)
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--verbose, -v', 'Source directory for files', false)
  .option('-w, --watch', 'Run jest in watch mode', false)
  .action(async (patterns: string[] | null, { srcDir, verbose, watch }: TestCommandOptions) => {
    // A wrapper around running jest to convert windows paths to posix paths
    // since jest doesn't know how to match windows paths
    const jestArgs = patterns === null
      ? null
      : patterns.map((pattern) => pattern.split(pathlib.sep)
        .join(pathlib.posix.sep));

    if (verbose) jestArgs.push('--verbose');
    if (watch) jestArgs.push('--watch');

    await jest.run(jestArgs, pathlib.join(srcDir, 'jest.config.js'));
  });

export default testCommand;
