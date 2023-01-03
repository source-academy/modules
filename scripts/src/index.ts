import chalk from 'chalk';
import { Command } from 'commander';

import { buildAll } from './build';
import createCommand from './templates';

async function main() {
  const parser = new Command()
    .argument('<command>')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--outDir <outdir>', 'Output directory', 'build')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .enablePositionalOptions(true)
    .passThroughOptions(true)
    .action(async (command, buildOpts) => {
      const result = {
        build: () => buildAll(buildOpts),
        // watch: () => watchAll(buildOpts), watch command doesn't yet work :(
        create: () => createCommand(buildOpts),
      }[command];

      if (!command) {
        console.log(chalk.redBright(`Unknown command ${command}`));
      } else {
        await result();
      }
    });

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
