import chalk from 'chalk';
import { build as esbuild } from 'esbuild';
import fs from 'fs/promises';
import pathlib from 'path';

import { type BuildOptions, type ModuleManifest, retrieveManifest } from '../../scriptUtils';
import { esbuildOptions } from '../buildUtils';
import type { BuildResult, Severity } from '../types';

import { logBundleResults, outputBundle } from './bundle';
import { logTabResults, outputTab } from './tab';

export const buildModules = async (buildOpts: BuildOptions, manifest: ModuleManifest) => {
  const bundles = Object.keys(manifest);
  const tabs = Object.values(manifest)
    .flatMap((x) => x.tabs);

  const startPromises: Promise<string>[] = [];
  if (bundles.length > 0) {
    startPromises.push(fs.mkdir(`${buildOpts.outDir}/bundles`, { recursive: true }));
  }

  if (tabs.length > 0) {
    startPromises.push(fs.mkdir(`${buildOpts.outDir}/tabs`, { recursive: true }));
  }

  await Promise.all(startPromises);
  const startTime = performance.now();

  const results = {
    bundles: {
      results: {},
      severity: 'success',
      totalCount: 0,
      currentCount: 0,
      elapsed: 0,
    },
    tabs: {
      results: {},
      severity: 'success',
      totalCount: 0,
      currentCount: 0,
      elapsed: 0,
    },
  } as Record<'bundles' | 'tabs', {
    severity: Severity,
    results: Record<string, BuildResult>,
    totalCount: number,
    currentCount: number,
    elapsed: number,
  }>;

  results.bundles.totalCount = bundles.length;
  results.tabs.totalCount = tabs.length;

  await esbuild({
    ...esbuildOptions,
    entryPoints: [
      ...bundles.map((bundle) => `${buildOpts.srcDir}/bundles/${bundle}/index.ts`),
      ...tabs.map((tabName) => `${buildOpts.srcDir}/tabs/${tabName}/index.tsx`),
    ],
    outdir: buildOpts.outDir,
    plugins: [
      {
        name: 'endPlugin',
        setup: (pluginBuild) => pluginBuild.onEnd(({ outputFiles }) => Promise.all(outputFiles.map(async (outputFile) => {
          const { dir: sourceDir } = pathlib.parse(outputFile.path);
          const name = pathlib.basename(sourceDir);

          const { dir: typeDir } = pathlib.parse(sourceDir);
          const type = pathlib.basename(typeDir);

          if (type !== 'bundles' && type !== 'tabs') {
            throw new Error(`Unknown type found for: ${type}`);
          }

          const result = await (type === 'bundles' ? outputBundle : outputTab)(name, outputFile.text, buildOpts);
          results[type].currentCount++;
          if (results[type].currentCount === results[type].totalCount) {
            results[type].elapsed = performance.now() - startTime;
          }

          results[type].results[name] = result;
          if (result.severity === 'error') results[type].severity = 'error';
        })) as unknown as Promise<void>),
      },
    ],
  });

  await fs.copyFile(buildOpts.manifest, `${buildOpts.outDir}/modules.json`);

  return {
    bundles: {
      elapsed: results.bundles.elapsed,
      severity: results.bundles.severity,
      results: results.bundles.results,
    },
    tabs: {
      elapsed: results.bundles.elapsed,
      severity: results.bundles.severity,
      results: results.bundles.results,
    },
  };
};

/**
 * Build bundles and tabs only
 */
export default async (buildOpts: BuildOptions) => {
  const manifest = await retrieveManifest(buildOpts);
  const bundlesToBuild = Object.keys(manifest);
  console.log(`${chalk.cyanBright('Building bundles and tabs for the following bundles:')}\n${
    bundlesToBuild.map((bundle, i) => `${i + 1}. ${bundle}`)
      .join('\n')
  }\n`);

  await Promise.all([
    fs.mkdir(`${buildOpts.outDir}/bundles`, { recursive: true }),
    fs.mkdir(`${buildOpts.outDir}/tabs`, { recursive: true }),
  ]);

  const results = await buildModules(buildOpts, manifest);
  logBundleResults(results.bundles);
  logTabResults(results.tabs);
};

export { logBundleResults } from './bundle';
export { logTabResults } from './tab';
