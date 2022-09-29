import chalk from 'chalk';
import { Command } from 'commander';
import { constants as fsConstants, promises as fs } from 'fs';

import { BUILD_PATH } from '../constants';
import { joinArrays } from '../utilities';

import { buildHtml, logHtmlResult, logHtmlStart, shouldBuildHtml } from './docs/html';
import { buildJsons, getJsonsToBuild, logJsonResult, logJsonStart } from './docs/jsons';
import { initTypedoc } from './docs/utils';
import { buildBundles, getBundles, logBundleResult, logBundleStart } from './modules/bundle';
import { buildTabs, getTabs, logTabResult, logTabStart } from './modules/tab';
import { getDb } from './buildUtils';
import docCommand, { htmlCommand, jsonCommand } from './docs';
import copy from './misc';
import { tabCommand } from './modules';

type BuildAllCommandOptions = Partial<{
  bundles: string | string[];
  tabs: string | string[];
  jsons: string | string[];
  html: boolean;
  verbose: boolean;
  force: boolean;
}>;

const modulesCommand = new Command('modules')
  .description(chalk.greenBright('Build all outputs (bundles, tabs, jsons and html)'))
  .addHelpText('after', chalk.yellow('Use --help on each subcommand to understand how they work'))
  .option('-f, --force', 'Force all files to be rebuilt')
  .option('-v, --verbose', 'Enable verbose information')
  .option('-b, --bundles <bundles...>', 'Specify bundles to be rebuilt')
  .option('-t, --tabs <tabs...>', 'Specify tabs to be rebuilt')
  .option('-j, --jsons <jsons...>', 'Specify jsons of which bundles to be rebuild')
  .option('--no-html', 'Skip building HTML documentation')
  .action(async (opts: BuildAllCommandOptions) => {
    const db = await getDb();

    const [bundleOpts, htmlOpts] = await Promise.all([getBundles(db, opts), shouldBuildHtml(db, opts)]);
    const [tabOpts, jsonOpts] = await Promise.all([getTabs(db, opts, bundleOpts), getJsonsToBuild(db, {
      ...opts,
      bundles: opts.jsons,
    }, bundleOpts)]);

    console.log(joinArrays('',
      logBundleStart(bundleOpts, opts.verbose),
      logTabStart(tabOpts, opts.verbose),
      logHtmlStart(htmlOpts, opts.verbose),
      logJsonStart(jsonOpts, opts.verbose))
      .join('\n'));

    try {
      const typedocProj = initTypedoc();
      const [bundleResult, tabResult, htmlResult, jsonResult] = await Promise.all([
        buildBundles(db, bundleOpts, typedocProj.buildTime),
        buildTabs(db, tabOpts, typedocProj.buildTime),
        buildHtml(db, typedocProj),
        buildJsons(db, typedocProj, jsonOpts),
      ]);

      console.log(joinArrays('',
        logBundleResult(bundleResult),
        logTabResult(tabResult),
        logHtmlResult(htmlResult),
        logJsonResult(jsonResult))
        .join('\n'));

      await db.write();
      await copy();
    } catch (error) {
      console.log(error);
    }
  });

export default new Command('build')
  .hook('preAction', async (_, command) => {
    try {
    // Create the build folder if it doesn't already exist
      await fs.access(BUILD_PATH, fsConstants.F_OK);
    } catch (error) {
      await fs.mkdir(BUILD_PATH);
    }
    console.log(chalk.magentaBright(`Executing ${command.name()} command...\n`));
  })
  .allowUnknownOption(false)
  .addCommand(modulesCommand, { isDefault: true })
  .addCommand(tabCommand)
  .addCommand(docCommand)
  .addCommand(htmlCommand)
  .addCommand(jsonCommand);
