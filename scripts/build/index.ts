import chalk from 'chalk';
import { Command } from 'commander';
import { constants as fsConstants, promises as fs } from 'fs';

import { BUILD_PATH } from '../constants';
import { joinArrays } from '../utilities';

import { getDb } from './buildUtils';
import docsCommand, { buildDocsAndJsons, getDocsToBuild, logResultDocs } from './docs';
import copy from './misc';
import modulesCommand, { buildBundlesAndTabs, getBundlesAndTabs, logBuildResults } from './modules';

type BuildAllCommandOptions = Partial<{
  bundles: string | string[];
  tabs: string | string[];
  jsons: string | string[];
  html: boolean;
  verbose: boolean;
  force: boolean;
}>;

const allCommand = new Command('all')
  .description(chalk.greenBright('Run both the build modules and build docs subcommands'))
  .addHelpText('after', chalk.yellow('Use --help on each subcommand to understand how they work'))
  .option('-f, --force', 'Force all files to be rebuilt')
  .option('-v, --verbose', 'Enable verbose information')
  .option('-b, --bundles <bundles...>', 'Specify bundles to be rebuilt')
  .option('-t, --tabs <tabs...>', 'Specify tabs to be rebuilt')
  .option('-j, --jsons <jsons...>', 'Specify jsons of which bundles to be rebuild')
  .option('--no-html', 'Skip building HTML documentation')
  .action(async (opts: BuildAllCommandOptions) => {
    const db = await getDb();

    const [{
      logs: docsStartLogs,
      ...jsonOpts
    }, {
      logs: moduleStartLogs,
      ...moduleOpts
    }] = await Promise.all([
      getDocsToBuild(db, {
        force: opts.force,
        verbose: opts.verbose,
        html: opts.html,
        bundles: opts.jsons,
      }),
      getBundlesAndTabs(db, {
        force: opts.force,
        verbose: opts.verbose,
        tabs: opts.tabs,
        bundles: opts.bundles,
      }),
    ]);

    const startLogs = joinArrays('', moduleStartLogs, docsStartLogs);
    console.log(`${startLogs.join('\n')}\n`);

    // If its parent bundle is being rebuilt, rebuild the JSON
    Object.keys(moduleOpts)
      .forEach((bundle) => {
        if (!jsonOpts[bundle]) jsonOpts[bundle] = `${bundle} is being rebuilt`;
      });

    const [moduleEndLogs, docsEndLogs] = await Promise.all([
      buildBundlesAndTabs(db, moduleOpts),
      buildDocsAndJsons(db, jsonOpts),
    ]);

    const allLogs = joinArrays('', logBuildResults(...moduleEndLogs), logResultDocs(docsEndLogs));
    console.log(allLogs.join('\n'));
    await copy();
  });

export default new Command('build')
  .hook('preAction', async () => {
    try {
    // Create the build folder if it doesn't already exist
      await fs.access(BUILD_PATH, fsConstants.F_OK);
    } catch (error) {
      await fs.mkdir(BUILD_PATH);
    }
  })
  .addCommand(allCommand, { isDefault: true })
  .addCommand(modulesCommand)
  .addCommand(docsCommand);
