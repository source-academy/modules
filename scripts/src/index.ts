import { Command } from 'commander';

import buildAllCommand from './build/index.js';
import prebuildCommand, { lintCommand, tscCommand } from './build/prebuild/index.js';
import { serveCommand, serveWatchCommand, watchCommand } from './build/serve.js';
import createCommand from './templates/index.js';

const commandList = [
  buildAllCommand,
  createCommand,
  serveCommand,
  serveWatchCommand,
  watchCommand,
  tscCommand,
  lintCommand,
  prebuildCommand,
];

async function main() {
  const parser = new Command();
  commandList.forEach((cmd) => parser.addCommand(cmd));

  try {
    await parser.parseAsync();
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(() => process.exit(0));
// Something is keeping the process alive after it should die
// but I haven't found how to close it so process.exit will have to do
