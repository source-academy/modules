import chalk from 'chalk';
import { promises as fs } from 'fs';

import { printList } from '../../scriptUtils.js';
import {
  copyManifest,
  createBuildCommand,
  createOutDir,
  exitOnError,
  logResult,
  retrieveBundlesAndTabs,
} from '../buildUtils.js';
import { prebuild } from '../prebuild/index.js';
import type { LintCommandInputs } from '../prebuild/lint.js';
import type { AssetInfo, BuildCommandInputs, BuildOptions } from '../types';

import { buildBundles, reduceBundleOutputFiles } from './bundle.js';
import { buildTabs, reduceTabOutputFiles } from './tab.js';

export const buildModules = async (opts: BuildOptions, { bundles, tabs }: AssetInfo) => {
  const startPromises: Promise<string>[] = [];
  if (bundles.length > 0) {
    startPromises.push(fs.mkdir(`${opts.outDir}/bundles`, { recursive: true }));
  }

  if (tabs.length > 0) {
    startPromises.push(fs.mkdir(`${opts.outDir}/tabs`, { recursive: true }));
  }

  await Promise.all(startPromises);
  const startTime = performance.now();
  const [bundleResults, tabResults] = await Promise.all([
    buildBundles(bundles, opts)
      .then((outputFiles) => reduceBundleOutputFiles(outputFiles, startTime, opts.outDir)),
    buildTabs(tabs, opts)
      .then((outputFiles) => reduceTabOutputFiles(outputFiles, startTime, opts.outDir)),
  ]);

  return bundleResults.concat(tabResults);
};

const getBuildModulesCommand = () => createBuildCommand('modules', true)
  .argument('[modules...]', 'Manually specify which modules to build', null)
  .description('Build modules and their tabs')
  .action(async (modules: string[] | null, { manifest, ...opts }: BuildCommandInputs & LintCommandInputs) => {
    const [assets] = await Promise.all([
      retrieveBundlesAndTabs(manifest, modules, []),
      createOutDir(opts.outDir),
    ]);

    await prebuild(opts, assets);

    printList(`${chalk.magentaBright('Building bundles and tabs for the following bundles:')}\n`, assets.bundles);

    const [results] = await Promise.all([
      buildModules(opts, assets),
      copyManifest({
        manifest,
        outDir: opts.outDir,
      }),
    ]);
    logResult(results, opts.verbose);
    exitOnError(results);
  })
  .description('Build only bundles and tabs');

export { default as getBuildTabsCommand } from './tab.js';
export default getBuildModulesCommand;
