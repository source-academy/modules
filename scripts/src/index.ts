import { Command } from 'commander';

import buildAllCommand from './build';
import createCommand from './templates';

async function main() {
  const parser = new Command()
    .addCommand(buildAllCommand)
    .addCommand(createCommand);

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
