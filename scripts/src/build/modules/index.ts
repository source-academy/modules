import chalk from 'chalk';
import { promises as fs } from 'fs';

import { printList } from '../../scriptUtils.js';
import { createBuildCommand, logResult, retrieveBundlesAndTabs } from '../buildUtils.js';
import { logLintResult } from '../prebuild/eslint.js';
import { preBuild } from '../prebuild/index.js';
import { logTscResults } from '../prebuild/tsc.js';
import type { AssetInfo, BuildCommandInputs, BuildOptions } from '../types';

import { buildBundles, reduceBundleOutputFiles } from './bundle.js';
import { buildTabs, reduceTabOutputFiles } from './tab.js';

// export const processOutputFiles = async (outputFiles: OutputFile[], outDir: string, startTime: number) => Promise.all(
//   outputFiles.map(async ({ path, text }) => {
//     const [rawType, name] = path.split(pathlib.sep)
//       .slice(-3, -1);
//     const type = rawType.slice(0, -1);

//     if (type !== 'bundle' && type !== 'tab') {
//       throw new Error(`Unknown type found for: ${type}: ${path}`);
//     }

//     const result = await (type === 'bundle' ? outputBundle : outputTab)(name, text, outDir);
//     const endTime = performance.now() - startTime;

//     return [type, name, {
//       elapsed: endTime,
//       ...result,
//     }] as UnreducedResult;
//   }),
// );

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
    fs.copyFile(opts.manifest, `${opts.outDir}/${opts.manifest}`),
  ]);

  return bundleResults.concat(tabResults);
};

const buildModulesCommand = createBuildCommand('modules')
  .argument('[modules...]', 'Manually specify which modules to build', null)
  .description('Build modules and their tabs')
  .action(async (modules: string[] | null, { manifest, ...opts }: BuildCommandInputs) => {
    const assets = await retrieveBundlesAndTabs(manifest, modules, []);

    printList(`${chalk.cyanBright('Building bundles and tabs for the following bundles:')}\n`, assets.bundles);

    const { lintResult, tscResult } = await preBuild(opts, assets);
    logLintResult(lintResult);
    logTscResults(tscResult, opts.srcDir);

    const [results] = await Promise.all([
      buildModules(opts, assets),
      fs.copyFile(manifest, `${opts.outDir}/${manifest}`),
    ]);
    logResult(results, opts.verbose);
  })
  .description('Build only bundles and tabs');

export { default as buildTabsCommand } from './tab.js';
export default buildModulesCommand;
