import { Command } from 'commander';
import lodash from 'lodash';
import pathlib from 'path';

import { runJest } from './runner.js';

export type TestCommandOptions = {
  srcDir: string
};

const getTestCommand = () => new Command('test')
  .description('Run jest')
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .allowUnknownOption()
  .action(({ srcDir }: TestCommandOptions, command: Command) => {
    const [args, filePatterns] = lodash.partition(command.args, (arg) => arg.startsWith('-'));

    // command.args automatically includes the source directory option
    // which is not supported by Jest, so we need to remove it
    const toRemove = args.findIndex((arg) => arg.startsWith('--srcDir'));
    if (toRemove !== -1) {
      args.splice(toRemove, 1);
    }

    const jestArgs = args.concat(filePatterns.map((pattern) => pattern.split(pathlib.win32.sep)
      .join(pathlib.posix.sep)));
    return runJest(jestArgs, srcDir);
  });

export default getTestCommand;
