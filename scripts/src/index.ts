import { Command } from 'commander';

import { watchCommand } from './build/dev.js';
import buildAllCommand from './build/index.js';
import getPrebuildCommand, { getLintCommand, getTscCommand } from './build/prebuild/index.js';
import devserverCommand from './devserver/index.js';
import createCommand from './templates/index.js';
import getTestCommand from './testing/index.js';

const parser = new Command()
  .addCommand(buildAllCommand)
  .addCommand(createCommand)
  .addCommand(getLintCommand())
  .addCommand(getPrebuildCommand())
  .addCommand(getTscCommand())
  .addCommand(getTestCommand())
  .addCommand(watchCommand)
  .addCommand(devserverCommand);

await parser.parseAsync();
process.exit();
