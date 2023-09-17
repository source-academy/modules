import { Command } from 'commander';
import jest from 'jest';
import * as pathlib from 'path';

type TestCommandOptions = {
  srcDir: string
  verbose: boolean
  watch: boolean
  update: boolean
};

const testCommand = new Command('test')
  .description('Run jest')
  .allowUnknownOption()
  .argument('[patterns...]', null)
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('-v, --verbose', 'Run Jest in verbose mode', false)
  .option('-w, --watch', 'Run jest in watch mode', false)
  .option('-u, --updateSnapshot', 'Update snapshots', false)
  .allowUnknownOption()
  .action(async (patterns: string[] | null, { srcDir, ...others }: TestCommandOptions) => {
    // A wrapper around running jest to convert windows paths to posix paths
    // since jest doesn't know how to match windows paths
    const jestArgs = patterns === null
      ? null
      : patterns.map((pattern) => pattern.split(pathlib.sep)
        .join(pathlib.posix.sep));

    Object.entries(others)
      .forEach(([optName, value]) => {
        if (value) jestArgs.push(`--${optName}`);
      });

    await jest.run(jestArgs, pathlib.join(srcDir, 'jest.config.js'));
  });

export default testCommand;
