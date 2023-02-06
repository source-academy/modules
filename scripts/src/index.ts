import { Command } from 'commander';

import { watchCommand } from './build/dev.js';
import buildAllCommand from './build/index.js';
import createCommand from './templates/index.js';

const parser = new Command()
  .addCommand(watchCommand)
  .addCommand(buildAllCommand)
  .addCommand(createCommand);

await parser.parseAsync();
process.exit();
