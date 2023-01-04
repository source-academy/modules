import chalk from 'chalk';
import { Command } from 'commander';

import { buildAll, buildDocs, buildModules } from './build';
import type { BuildOptions } from './scriptUtils';
import createCommand from './templates';

async function main() {
  const parser = new Command()
    .argument('<command>')
    .argument('[subcommand]', 'Build subcommands: "all, modules, docs"', 'all')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--outDir <outdir>', 'Output directory', 'build')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .action(async (command: string, subcommand: string, buildOpts: BuildOptions) => {
      const result = {
        async build() {
          const subfunc = {
            all: buildAll,
            modules: buildModules,
            docs: buildDocs,
          }[subcommand];
          if (!subcommand) console.log(chalk.redBright(`Unknown build ${command}`));
          else await subfunc(buildOpts);
        },
        // watch: () => watchAll(buildOpts),
        create: () => createCommand(buildOpts),
      }[command];

      if (!command) console.log(chalk.redBright(`Unknown command ${command}`));
      else await result();
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
