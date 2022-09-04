import { Command } from 'commander';
import { constants as fsConstants, promises as fs } from 'fs';

import { BUILD_PATH } from '../constants';

import { getDb } from './buildUtils';
import docsCommand, { buildDocsAndJsons, getJsonsToBuild } from './docs';
import copy from './misc';
import modulesCommand, { buildBundlesAndTabs, getBundlesAndTabs } from './modules';

type BuildAllCommandOptions = Partial<{
  bundles: string[];
  tabs: string[];
  jsons: string[];
  html: boolean;
  verbose: boolean;
  force: boolean;
}>;

const allCommand = new Command('all')
  .option('-f, --force', 'Force all files to be rebuilt')
  .option('-v, --verbose', 'Enable verbose information')
  .option('-b, --bundles <bundles...>', 'Specify bundles to be rebuilt')
  .option('-t, --tabs <tabs...>', 'Specify tabs to be rebuilt')
  .option('-j, --jsons <jsons...>', 'Specify jsons of which bundles to be rebuilt')
  .option('--no-html', 'Skip building HTML documentation')
  .action(async (opts: BuildAllCommandOptions) => {
    const db = await getDb();

    const [jsonOpts, bundleOpts] = await Promise.all([
      getJsonsToBuild(db, {
        ...opts,
        bundles: opts.jsons,
      }),
      getBundlesAndTabs(db, opts),
    ]);

    // If its parent bundle is being rebuilt, rebuild the JSON
    Object.keys(bundleOpts)
      .forEach((bundle) => {
        if (!jsonOpts[bundle]) jsonOpts[bundle] = `${bundle} is being rebuilt`;
      });

    await Promise.all([
      buildBundlesAndTabs(db, bundleOpts, opts),
      buildDocsAndJsons(db, jsonOpts, opts),
    ]);
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
