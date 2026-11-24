import { Command } from '@commander-js/extra-typings';
import { bundlesDir, outDir } from '@sourceacademy/modules-repotools/getGitRoot';
import { resolveAllBundles, resolveEitherBundleOrTab, resolveSingleBundle, resolveSingleTab } from '@sourceacademy/modules-repotools/manifest';
import chalk from 'chalk';
import { buildAll } from '../build/all.js';
import { buildHtml, buildSingleBundleDocs } from '../build/docs/index.js';
import { formatResult, formatResultObject } from '../build/formatter.js';
import { buildBundle, buildTab } from '../build/modules/index.js';
import { buildManifest } from '../build/modules/manifest.js';
import { formatTscResult, runTscCompile } from '../build/modules/tsc.js';
import { runBuilderWithPrebuild } from '../prebuild/index.js';
import * as cmdUtils from './commandUtils.js';

// Commands that are specific to a tab or bundle
export const getBuildBundleCommand = () => new Command('bundle')
  .description('Build the bundle at the given directory')
  .argument('[bundle]', 'Directory in which the bundle\'s source files are located', process.cwd())
  .addOption(cmdUtils.tscOption)
  .addOption(cmdUtils.lintOption)
  .addOption(cmdUtils.watchOption)
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .action(async (bundleDir, { watch, ...opts }) => {
    const result = await resolveSingleBundle(bundleDir);
    if (result === undefined) cmdUtils.logCommandErrorAndExit(`No bundle found at ${bundleDir}!`);
    else if (result.severity === 'error') {
      cmdUtils.logCommandErrorAndExit(result);
    }

    if (watch) {
      if (opts.lint) {
        console.warn(chalk.yellowBright('--lint was specified with --watch, ignoring...'));
      }
      if (opts.tsc) {
        console.warn(chalk.yellowBright('--tsc was specified with --watch, ignoring...'));
      }

      await buildBundle(outDir, result.bundle, true);
      return;
    }

    const results = await runBuilderWithPrebuild(buildBundle, opts, result.bundle, outDir, 'bundle', false);
    console.log(formatResultObject(results));
    cmdUtils.processResult(results, opts.ci);
  });

export const getBuildTabCommand = () => new Command('tab')
  .description('Build the tab at the given directory')
  .argument('[tab]', 'Directory in which the tab\'s source files are located', process.cwd())
  .addOption(cmdUtils.tscOption)
  .addOption(cmdUtils.lintOption)
  .addOption(cmdUtils.watchOption)
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .action(async (tabDir, { watch, ...opts }) => {
    const tab = await resolveSingleTab(tabDir);
    if (!tab) cmdUtils.logCommandErrorAndExit(`No tab found at ${tabDir}`);

    if (watch) {
      if (opts.lint) {
        console.warn(chalk.yellowBright('--lint was specified with --watch, ignoring...'));
      }
      if (opts.tsc) {
        console.warn(chalk.yellowBright('--tsc was specified with --watch, ignoring...'));
      }

      await buildTab(outDir, tab, true);
      return;
    }

    const results = await runBuilderWithPrebuild(buildTab, opts, tab, outDir, 'tab', false);
    console.log(formatResultObject(results));
    cmdUtils.processResult(results, opts.ci);
  });

export const getBuildDocsCommand = () => new Command('docs')
  .description('Build the documentation for the given bundle')
  .argument('[bundle]', 'Directory in which the bundle\'s source files are located', process.cwd())
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .addOption(cmdUtils.logLevelOption)
  .action(async (directory, { ci, logLevel }) => {
    const manifestResult = await resolveSingleBundle(directory);
    if (manifestResult === undefined) {
      cmdUtils.logCommandErrorAndExit(`No bundle found at ${directory}!`);
    } else if (manifestResult.severity === 'success') {
      const docResult = await buildSingleBundleDocs(manifestResult.bundle, outDir, logLevel);
      console.log(formatResultObject({ docs: docResult }));
      cmdUtils.processResult({ results: docResult }, ci);
    } else {
      cmdUtils.logCommandErrorAndExit(manifestResult);
    }
  });

export const getBuildAllCommand = () => new Command('all')
  .description('Build all assets for the given bundle/tab')
  .argument('[directory]', 'Directory in which the source files are located', process.cwd())
  .addOption(cmdUtils.tscOption)
  .addOption(cmdUtils.lintOption)
  .addOption(cmdUtils.logLevelOption)
  .option('--ci', 'Run in CI mode', !!process.env.CI)
  .action(async (directory, opts) => {
    const resolvedResult = await resolveEitherBundleOrTab(directory);
    if (resolvedResult.severity === 'error') {
      if (resolvedResult.errors.length === 0) {
        cmdUtils.logCommandErrorAndExit(`Could not locate tab/bundle at ${directory}`);
      } else {
        const errStr = resolvedResult.errors.join('\n');
        cmdUtils.logCommandErrorAndExit(`Error while resolving ${directory}: ${errStr}`);
      }
    }

    const result = await buildAll(resolvedResult.asset, opts, outDir, opts.logLevel);
    console.log(formatResultObject(result));
    cmdUtils.processResult(result, opts.ci);
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
    if (resolveResult.severity === 'error') {
      cmdUtils.logCommandErrorAndExit(resolveResult);
    }

    const manifestResult = await buildManifest(resolveResult.bundles, outDir);
    console.log(formatResult(manifestResult));
  });

export const getBuildHtmlCommand = () => new Command('html')
  .description('Builds the HTML documentation. The JSON documentation of each bundle must first have been built')
  .addOption(cmdUtils.logLevelOption)
  .action(async ({ logLevel }) => {
    const resolveResult = await resolveAllBundles(bundlesDir);
    if (resolveResult.severity === 'error') {
      cmdUtils.logCommandErrorAndExit(resolveResult);
    }

    const htmlResult = await buildHtml(resolveResult.bundles, outDir, logLevel);
    console.log(formatResult(htmlResult, 'html'));
    cmdUtils.processResult(htmlResult, false);
  });

export const getCompileCommand = () => new Command('compile')
  .description('Compiles the bundle at the given directory using tsc')
  .argument('[bundle]', 'Directory in which the bundle\'s source files are located', process.cwd())
  .action(async directory => {
    const bundle = await resolveSingleBundle(directory);
    if (!bundle) {
      cmdUtils.logCommandErrorAndExit(`No bundle was found at ${directory}`);
    }

    if (bundle.severity === 'error') {
      cmdUtils.logCommandErrorAndExit(bundle);
    }

    const compileResult = await runTscCompile(bundle.bundle);
    if (compileResult.severity === 'error') {
      cmdUtils.logCommandErrorAndExit(formatTscResult(compileResult));
    }

    console.log(chalk.greenBright(`Finished compiling ${bundle.bundle.name}`));
  });
