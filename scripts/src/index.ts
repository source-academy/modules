import { Command } from 'commander';

import { watchCommand } from './build/dev.js';
import buildAllCommand from './build/index.js';
import getPrebuildCommand, { getLintCommand, getTscCommand } from './build/prebuild/index.js';
import createCommand from './templates/index.js';

const parser = new Command()
  .addCommand(buildAllCommand)
  .addCommand(createCommand)
  .addCommand(getLintCommand())
  .addCommand(getPrebuildCommand())
  .addCommand(getTscCommand())
  .addCommand(watchCommand);

await parser.parseAsync();
process.exit();
