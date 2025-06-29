import fs from 'fs/promises';
import { Command } from '@commander-js/extra-typings';
import { initTypedocForSingleBundle } from '../build/docs/docsUtils.js';
import { buildDocs, buildJson } from '../build/docs/index.js';
import buildAll from '../build/index.js';
import { formatResolveBundleErrors } from '../build/manifest/formatters.js';
import { resolveAllBundles, resolveSingleBundle , resolveSingleTab, writeManifest } from '../build/manifest/index.js';
import { buildBundle, buildTab } from '../build/modules/index.js';
import { getBundlesDir, getOutDir } from '../getGitRoot.js';
import { runBuilderWithPrebuild } from '../prebuild/index.js';
import type { FullResult, ResolvedBundle, ResultEntry } from '../types.js';
import { getResultString, lintOption, logCommandErrorAndExit, resultsProcessor, tscOption } from './commandUtils.js';

const outDir = await getOutDir();
const bundlesDir = await getBundlesDir();

export const getBuildBundleCommand = () => new Command('bundle')
  .description('Build the bundle at the given directory')
  .argument('[bundle]', 'Directory in which the bundle\'s source files are located', process.cwd())
  .addOption(tscOption)
  .addOption(lintOption)
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .action(async (bundleDir, opts) => {
    const result = await resolveSingleBundle(bundleDir);
    if (result === undefined) logCommandErrorAndExit(`No bundle found at ${bundleDir}!`);
    else if (result.severity === 'error') {
      logCommandErrorAndExit(formatResolveBundleErrors(result));
    }

    const results = await runBuilderWithPrebuild(buildBundle, opts, result.bundle, outDir, 'bundle');
    console.log(getResultString(results));
    resultsProcessor(results, opts.ci);
  });

export const getBuildTabCommand = () => new Command('tab')
  .description('Build the tab at the given directory')
  .argument('[tab]', 'Directory in which the tab\'s source files are located', process.cwd())
  .addOption(tscOption)
  .addOption(lintOption)
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .action(async (tabDir, opts) => {
    const tab = await resolveSingleTab(tabDir);
    if (!tab) logCommandErrorAndExit(`No tab found at ${tabDir}`);

    const results = await runBuilderWithPrebuild(buildTab, opts, tab, outDir, 'tab');
    console.log(getResultString(results));
    resultsProcessor(results, opts.ci);
  });

export const getBuildJsonCommand = () => new Command('json')
  .description('Build the JSON documentation for the bundle at the given directory')
  .argument('[bundle]', 'Directory in which the bundle\'s source files are located', process.cwd())
  .addOption(tscOption)
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .action(async (bundleDir, opts) => {
    const result = await resolveSingleBundle(bundleDir);
    if (!result) logCommandErrorAndExit(`No bundle found at ${bundleDir}!`);
    else if (result.severity === 'error') {
      logCommandErrorAndExit(formatResolveBundleErrors(result));
    }

    const results = await runBuilderWithPrebuild(
      async (outDir, bundle: ResolvedBundle) => {
        const reflection = await initTypedocForSingleBundle(bundle);
        return buildJson(outDir, bundle, reflection);
      },
      opts,
      result.bundle,
      outDir,
      'json'
    );

    console.log(getResultString(results));
    resultsProcessor(results, opts.ci);
  });

export const getBuildDocsCommand = () => new Command('docs')
  .description('Build all documentation for all bundles')
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .action(async ({ ci }) => {
    const manifestResult = await resolveAllBundles(bundlesDir);
    if (manifestResult.severity === 'success') {
      await fs.mkdir(`${outDir}/jsons`, { recursive: true });
      const results = await buildDocs(manifestResult.bundles, outDir);
      console.log(getResultString({ results }));
      resultsProcessor({ results }, ci);
    } else {
      logCommandErrorAndExit(formatResolveBundleErrors(manifestResult));
    }
  });

export const getBuildManifestCommand = () => new Command('manifest')
  .description('Write the module manifest to the output directory')
  .action(async () => {
    const manifestResult = await resolveAllBundles(bundlesDir);
    if (manifestResult.severity === 'success') {
      await fs.mkdir(outDir, { recursive: true });
      const results = await writeManifest(outDir, manifestResult.bundles);
      console.log(getResultString({ results }));
      resultsProcessor({ results }, false);
    } else {
      logCommandErrorAndExit(formatResolveBundleErrors(manifestResult));
    }
  });

export const getBuildAllCommand = () => new Command('all')
  .description('Build all bundles, tabs and documentation')
  .addOption(tscOption)
  .addOption(lintOption)
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .action(async opts => {
    const manifestResult = await resolveAllBundles(bundlesDir);
    if (manifestResult.severity === 'error') {
      logCommandErrorAndExit(formatResolveBundleErrors(manifestResult));
    }

    const [manifest, [html, ...json], bundles, tabs] = await buildAll(manifestResult.bundles, opts, outDir);
    const results: FullResult<ResultEntry>[] = [
      { results: manifest },
      { results: html },
      ...json.map(each => ({ results: each })),
      ...bundles,
      ...tabs
    ];

    console.log(results.map(getResultString).join('\n'));
    results.forEach(each => resultsProcessor(each, opts.ci));
  });

export const getBuildCommand = () => new Command('build')
  .addCommand(getBuildAllCommand())
  .addCommand(getBuildBundleCommand())
  .addCommand(getBuildTabCommand())
  .addCommand(getBuildJsonCommand())
  .addCommand(getBuildDocsCommand())
  .addCommand(getBuildManifestCommand());
