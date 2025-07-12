import { Command } from '@commander-js/extra-typings';
import { buildAll } from '../build/all.js';
import { buildHtml, buildSingleBundleDocs } from '../build/docs/index.js';
import { formatResult, formatResultObject } from '../build/formatter.js';
import { buildManifest, resolveAllBundles, resolveEitherBundleOrTab, resolveSingleBundle , resolveSingleTab } from '../build/manifest.js';
import { buildBundle, buildTab } from '../build/modules/index.js';
import { getBundlesDir, getOutDir } from '../getGitRoot.js';
import { runBuilderWithPrebuild } from '../prebuild/index.js';
import { Severity } from '../types.js';
import { lintOption, logCommandErrorAndExit, logLevelOption, processResult, tscOption } from './commandUtils.js';

const outDir = await getOutDir();
const bundlesDir = await getBundlesDir();

// Commands that are specific to a tab or bundle

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
      logCommandErrorAndExit(result);
    }

    const results = await runBuilderWithPrebuild(buildBundle, opts, result.bundle, outDir, 'bundle');
    console.log(formatResultObject(results));
    processResult(results, opts.ci);
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
    console.log(formatResultObject(results));
    processResult(results, opts.ci);
  });

export const getBuildDocsCommand = () => new Command('docs')
  .description('Build the documentation for the given bundle')
  .argument('[bundle]', 'Directory in which the bundle\'s source files are located', process.cwd())
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .addOption(logLevelOption)
  .action(async (directory, { ci, logLevel }) => {
    const manifestResult = await resolveSingleBundle(directory);
    if (manifestResult === undefined) {
      logCommandErrorAndExit(`No bundle found at ${directory}!`);
    } else if (manifestResult.severity === 'success') {
      const docResult = await buildSingleBundleDocs(manifestResult.bundle, outDir, logLevel);
      console.log(formatResultObject({ docs: docResult }));
      processResult({ results: docResult }, ci);
    } else {
      logCommandErrorAndExit(manifestResult);
    }
  });

export const getBuildAllCommand = () => new Command('all')
  .description('Build all assets for the given bundle/tab')
  .argument('[directory]', 'Directory in which the source files are located', process.cwd())
  .addOption(tscOption)
  .addOption(lintOption)
  .addOption(logLevelOption)
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .action(async (directory, opts) => {
    const resolvedResult = await resolveEitherBundleOrTab(directory);
    if (resolvedResult.severity === 'error') {
      if (resolvedResult.errors.length === 0) {
        logCommandErrorAndExit(`Could not locate tab/bundle at ${directory}`);
      } else {
        const errStr = resolvedResult.errors.join('\n');
        logCommandErrorAndExit(`Error while resolving ${directory}: ${errStr}`);
      }
    }

    const result = await buildAll(resolvedResult.asset, opts, outDir, opts.logLevel);
    console.log(formatResultObject(result));
    processResult(result, opts.ci);
  });

export const getBuildCommand = () => new Command('build')
  .addCommand(getBuildAllCommand(), { isDefault: true })
  .addCommand(getBuildBundleCommand())
  .addCommand(getBuildTabCommand())
  .addCommand(getBuildDocsCommand());

// Commands that should be run from the root repository
export const getManifestCommand = () => new Command('manifest')
  .description('Build the combined modules manifest')
  .action(async () => {
    const resolveResult = await resolveAllBundles(bundlesDir);
    if (resolveResult.severity === Severity.ERROR) {
      logCommandErrorAndExit(resolveResult);
    }

    const manifestResult = await buildManifest(resolveResult.bundles, outDir);
    console.log(formatResult(manifestResult));
  });

export const getBuildHtmlCommand = () => new Command('html')
  .description('Builds the HTML documentation. The JSON documentation of each bundle must first have been built')
  .addOption(logLevelOption)
  .action(async ({ logLevel }) => {
    const resolveResult = await resolveAllBundles(bundlesDir);
    if (resolveResult.severity === Severity.ERROR) {
      logCommandErrorAndExit(resolveResult);
    }

    const htmlResult = await buildHtml(resolveResult.bundles, outDir, logLevel);
    console.log(formatResult(htmlResult, 'html'));
    processResult({ results: htmlResult }, false);
  });
