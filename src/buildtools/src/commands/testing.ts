import pathlib from 'path';
import { Command } from '@commander-js/extra-typings';

import { runJest } from '../testing/runner';

const getTestCommand = () => new Command('test')
  .description('Run jest')
  .allowUnknownOption()
  .argument('[patterns...]')
  .action((patterns, args: Record<string, any>) => {
    const jestArgs = [
      ...Object.entries(args).flat(),
      ...patterns.map(pattern => pattern.split(pathlib.sep).join(pathlib.posix.sep))
    ]
    return runJest(jestArgs);
  });

export default getTestCommand;
