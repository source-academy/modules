import { Command } from '@commander-js/extra-typings';

import { runJest } from '../testing/runner';

const getTestCommand = () => new Command('test')
  .description('Run jest')
  .allowUnknownOption()
  .argument('[patterns...]')
  .action((patterns, args: Record<string, any>) => {
    return runJest(
      Object.entries(args).flat(),
      patterns
    );
  });

export default getTestCommand;
