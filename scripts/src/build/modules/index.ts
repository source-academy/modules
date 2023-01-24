import chalk from 'chalk';
import { type OutputFile, build as esbuild } from 'esbuild';
import fs from 'fs/promises';
import pathlib from 'path';

import { createBuildCommand, logResult, retrieveBundlesAndTabs } from '../buildUtils.js';
import type { AssetInfo, BuildCommandInputs, UnreducedResult } from '../types';

import { outputBundle } from './bundle.js';
import { esbuildOptions } from './moduleUtils.js';
import { outputTab } from './tab.js';

export const processOutputFiles = async (outputFiles: OutputFile[], outDir: string, startTime: number) => Promise.all(
  outputFiles.map(async ({ path, text }) => {
    const [rawType, name] = path.split(pathlib.sep)
      .slice(-3, -1);
    const type = rawType.slice(0, -1);

    if (type !== 'bundle' && type !== 'tab') {
      throw new Error(`Unknown type found for: ${type}: ${path}`);
    }

    const result = await (type === 'bundle' ? outputBundle : outputTab)(name, text, outDir);
    const endTime = performance.now() - startTime;

    return [type, name, {
      elapsed: endTime,
      ...result,
    }] as UnreducedResult;
  }),
);

export const buildModules = async (buildOpts: BuildCommandInputs, { bundles, tabs }: AssetInfo) => {
  const startPromises: Promise<string>[] = [];
  if (bundles.length > 0) {
    startPromises.push(fs.mkdir(`${buildOpts.outDir}/bundles`, { recursive: true }));
  }

  if (tabs.length > 0) {
    startPromises.push(fs.mkdir(`${buildOpts.outDir}/tabs`, { recursive: true }));
  }

  await Promise.all(startPromises);
  const startTime = performance.now();
  const config = {
    ...esbuildOptions,
    entryPoints: [
      ...bundles.map((bundle) => `${buildOpts.srcDir}/bundles/${bundle}/index.ts`),
      ...tabs.map((tabName) => `${buildOpts.srcDir}/tabs/${tabName}/index.tsx`),
    ],
    outbase: buildOpts.outDir,
    outdir: buildOpts.outDir,
  };

  const [{ outputFiles }] = await Promise.all([
    esbuild(config),
    fs.copyFile(buildOpts.manifest, `${buildOpts.outDir}/${buildOpts.manifest}`),
  ]);

  return processOutputFiles(outputFiles, buildOpts.outDir, startTime);
};

const buildModulesCommand = createBuildCommand('modules')
  .argument('[modules...]', 'Manually specify which modules to build', null)
  .description('Build modules and their tabs')
  .action(async (modules: string[] | null, opts: BuildCommandInputs) => {
    const assets = await retrieveBundlesAndTabs(opts.manifest, modules, null);

    console.log(`${chalk.cyanBright('Building bundles and tabs for the following bundles:')}\n${
      assets.bundles.map((bundle, i) => `${i + 1}. ${bundle}`)
        .join('\n')
    }\n`);

    const results = await buildModules(opts, assets);
    logResult(results, opts.verbose);
  })
  .description('Build only bundles and tabs');

export { default as buildTabsCommand } from './tab.js';
export default buildModulesCommand;
