import { promises as fs, constants as fsConstants } from 'fs';
import build from './build';
import buildDocs from './build/docs';
import buildBundlesAndTabs from './build/build';
import create from './templates';
import type { Opts } from './build/buildUtils';
import { Command } from 'commander';
import { BUILD_PATH } from './constants';
import chalk from 'chalk';
import { minify } from 'terser';

const buildTasks: { [name: string]: (opts: Opts) => Promise<void> } = {
  docs: buildDocs,
  modules: buildBundlesAndTabs,
};

async function main() {
  const parser = new Command();

  parser.command('create', 'Interactive script for creating modules and tabs')
    .action(create);

  parser.command('test')
    .action(async () => {
      const output = await minify('(function() { return 3 + 2; })()');
      console.log(output.code, {
        module: true,
        ecma: 5,
        toplevel: true,
      });
    });

  parser.command('build')
    .argument('[script]', 'Build task to execute')
    .option('-f, --force', 'Force all files to be rebuilt')
    .option('-m, --modules <modules...>', 'Specify bundles to be rebuilt')
    .option('-t, --tabs <tabs...>', 'Specify tabs to be rebuilt')
    .option('-j, --jsons <jsons...>', 'Specify jsons to be rebuilt')
    .option('-v, --verbose', 'Enable verbose information')
    .action(async (script: string, options: Opts) => {
      if (script !== undefined && !buildTasks[script]) {
        console.error(chalk.redBright(`Unknown task: ${script}`));
        return;
      }

      try {
        // Create the build folder if it doesn't already exist
        await fs.access(BUILD_PATH, fsConstants.F_OK);
      } catch (error) {
        await fs.mkdir(BUILD_PATH);
      }

      if (script === undefined) await build(options);
      else await buildTasks[script](options);
    });

  await parser.parseAsync();
}

main()
  .then(() => process.exit(0));
// Something is keeping the process alive after it should die
// but I haven't found how to close it so process.exit will have to do
