import { Command } from 'commander';
import { watchCommand } from './build/dev.js';
import buildAllCommand from './build/index.js';
import prebuildCommand, { lintCommand, tscCommand } from './build/prebuild/index.js';
import createCommand from './templates/index.js';
const parser = new Command()
    .addCommand(buildAllCommand)
    .addCommand(createCommand)
    .addCommand(lintCommand)
    .addCommand(prebuildCommand)
    .addCommand(tscCommand)
    .addCommand(watchCommand);
await parser.parseAsync();
process.exit();
