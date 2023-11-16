import chalk from 'chalk';
import { Command, Option } from 'commander';
import { Table } from 'console-table-printer';
import fs from 'fs/promises';
import path from 'path';

import { retrieveManifest } from '../scriptUtils.js';

import {
  type AssetTypes,
  type BuildResult,
  type OperationResult,
  type OverallResult,
  type UnreducedResult,
  Assets,
} from './types.js';

export const divideAndRound = (dividend: number, divisor: number, round: number = 2) => (dividend / divisor).toFixed(round);

export const fileSizeFormatter = (size?: number) => {
  if (typeof size !== 'number') return '-';

  size /= 1000;
  if (size < 0.01) return '<0.01 KB';
  if (size >= 100) return `${divideAndRound(size, 1000)} MB`;
  return `${size.toFixed(2)} KB`;
};

export const logResult = (
  unreduced: UnreducedResult[],
  verbose: boolean,
) => {
  const overallResult = unreduced.reduce((res, [type, name, entry]) => {
    if (!res[type]) {
      res[type] = {
        severity: 'success',
        results: {},
      };
    }

    if (entry.severity === 'error') res[type].severity = 'error';
    else if (res[type].severity === 'success' && entry.severity === 'warn') res[type].severity = 'warn';

    res[type].results[name] = entry;
    return res;
  }, {} as Partial<Record<AssetTypes, OverallResult<BuildResult>>>);
  return console.log(Object.entries(overallResult)
    .map(([label, toLog]) => {
      if (!toLog) return null;

      const upperCaseLabel = label[0].toUpperCase() + label.slice(1);
      const { severity: overallSev, results } = toLog;
      const entries = Object.entries(results);
      if (entries.length === 0) return '';

      if (!verbose) {
        if (overallSev === 'success') {
          return `${chalk.cyanBright(`${upperCaseLabel}s built`)} ${chalk.greenBright('successfully')}\n`;
        }
        if (overallSev === 'warn') {
          return chalk.cyanBright(`${upperCaseLabel}s built with ${chalk.yellowBright('warnings')}:\n${
            entries
              .filter(([, { severity }]) => severity === 'warn')
              .map(([bundle, { error }], i) => chalk.yellowBright(`${i + 1}. ${bundle}: ${error}`))
              .join('\n')}\n`);
        }

        return chalk.cyanBright(`${upperCaseLabel}s build ${chalk.redBright('failed')} with errors:\n${
          entries
            .filter(([, { severity }]) => severity !== 'success')
            .map(([bundle, { error, severity }], i) => (severity === 'error'
              ? chalk.redBright(`${i + 1}. Error ${bundle}: ${error}`)
              : chalk.yellowBright(`${i + 1}. Warning ${bundle}: +${error}`)))
            .join('\n')}\n`);
      }

      const outputTable = new Table({
        columns: [{
          name: 'name',
          title: upperCaseLabel,
        },
        {
          name: 'severity',
          title: 'Status',
        },
        {
          name: 'elapsed',
          title: 'Elapsed (s)',
        },
        {
          name: 'fileSize',
          title: 'File Size',
        },
        {
          name: 'error',
          title: 'Errors',
        }],
      });

      entries.forEach(([name, { elapsed, severity, error, fileSize }]) => {
        if (severity === 'error') {
          outputTable.addRow({
            name,
            elapsed: '-',
            error,
            fileSize: '-',
            severity: 'Error',
          }, { color: 'red' });
        } else if (severity === 'warn') {
          outputTable.addRow({
            name,
            elapsed: divideAndRound(elapsed, 1000, 2),
            error,
            fileSize: fileSizeFormatter(fileSize),
            severity: 'Warning',
          }, { color: 'yellow' });
        } else {
          outputTable.addRow({
            name,
            elapsed: divideAndRound(elapsed, 1000, 2),
            error: '-',
            fileSize: fileSizeFormatter(fileSize),
            severity: 'Success',
          }, { color: 'green' });
        }
      });

      if (overallSev === 'success') {
        return `${chalk.cyanBright(`${upperCaseLabel}s built`)} ${chalk.greenBright('successfully')}:\n${outputTable.render()}\n`;
      }
      if (overallSev === 'warn') {
        return `${chalk.cyanBright(`${upperCaseLabel}s built`)} with ${chalk.yellowBright('warnings')}:\n${outputTable.render()}\n`;
      }
      return `${chalk.cyanBright(`${upperCaseLabel}s build ${chalk.redBright('failed')} with errors`)}:\n${outputTable.render()}\n`;
    })
    .filter((str) => str !== null)
    .join('\n'));
};

/**
 * Call this function to exit with code 1 when there are errors with the build command that ran
 */
export const exitOnError = (
  results: (UnreducedResult | OperationResult | null)[],
  ...others: (UnreducedResult | OperationResult | null)[]
) => {
  results.concat(others)
    .forEach((entry) => {
      if (!entry) return;

      if (Array.isArray(entry)) {
        const [,,{ severity }] = entry;
        if (severity === 'error') process.exit(1);
      } else if (entry.severity === 'error') process.exit(1);
    });
};

export const retrieveTabs = async (manifestFile: string, tabs: string[] | null) => {
  const manifest = await retrieveManifest(manifestFile);
  const knownTabs = Object.values(manifest)
    .flatMap((x) => x.tabs);

  if (tabs === null) {
    tabs = knownTabs;
  } else {
    const unknownTabs = tabs.filter((t) => !knownTabs.includes(t));

    if (unknownTabs.length > 0) {
      throw new Error(`Unknown tabs: ${unknownTabs.join(', ')}`);
    }
  }

  return tabs;
};

export const retrieveBundles = async (manifestFile: string, modules: string[] | null) => {
  const manifest = await retrieveManifest(manifestFile);
  const knownBundles = Object.keys(manifest);

  if (modules !== null) {
    // Some modules were specified
    const unknownModules = modules.filter((m) => !knownBundles.includes(m));

    if (unknownModules.length > 0) {
      throw new Error(`Unknown modules: ${unknownModules.join(', ')}`);
    }
    return modules;
  }
  return knownBundles;
};

export const bundleNameExpander = (srcdir: string) => (name: string) => path.join(srcdir, 'bundles', name, 'index.ts');
export const tabNameExpander = (srcdir: string) => (name: string) => path.join(srcdir, 'tabs', name, 'index.tsx');

export const createBuildCommand = (label: string, addLint: boolean) => {
  const cmd = new Command(label)
    .option('--outDir <outdir>', 'Output directory', 'build')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .option('-v, --verbose', 'Display more information about the build results', false);

  if (addLint) {
    cmd.option('--tsc', 'Run tsc before building')
      .option('--lint', 'Run eslint before building')
      .addOption(new Option('--fix', 'Ask eslint to autofix linting errors')
        .implies({ lint: true }));
  }

  return cmd;
};

/**
 * Create the output directory's root folder
 */
export const createOutDir = (outDir: string) => fs.mkdir(outDir, { recursive: true });

/**
 * Copy the manifest to the output folder. The root output folder will be created
 * if it does not already exist.
 */
export const copyManifest = ({ manifest, outDir }: { manifest: string, outDir: string }) => createOutDir(outDir)
  .then(() => fs.copyFile(
    manifest, path.join(outDir, manifest),
  ));

/**
 * Create the output directories for each type of asset.
 */
export const createBuildDirs = (outDir: string) => Promise.all(
  Assets.map((asset) => fs.mkdir(path.join(outDir, `${asset}s`), { recursive: true })),
);

/**
 * Determines which bundles and tabs to build based on the user's input.
 *
 * If no modules and no tabs are specified, it is assumed the user wants to
 * build everything.
 *
 * If modules but no tabs are specified, it is assumed the user only wants to
 * build those bundles (and possibly those modules' tabs based on
 * shouldAddModuleTabs).
 *
 * If tabs but no modules are specified, it is assumed the user only wants to
 * build those tabs.
 *
 * If both modules and tabs are specified, both of the above apply and are
 * combined.
 *
 * @param modules module names specified by the user
 * @param tabOptions tab names specified by the user
 * @param shouldAddModuleTabs whether to also automatically include the tabs of
 * specified modules
 */
export const retrieveBundlesAndTabs = async (
  manifestFile: string,
  modules: string[] | null,
  tabOptions: string[] | null,
  shouldAddModuleTabs: boolean = true,
) => {
  const manifest = await retrieveManifest(manifestFile);
  const knownBundles = Object.keys(manifest);
  const knownTabs = Object
    .values(manifest)
    .flatMap((x) => x.tabs);

  let bundles: string[] = [];
  let tabs: string[] = [];

  function addSpecificModules() {
    // If unknown modules were specified, error
    const unknownModules = modules.filter((m) => !knownBundles.includes(m));
    if (unknownModules.length > 0) {
      throw new Error(`Unknown modules: ${unknownModules.join(', ')}`);
    }

    bundles = bundles.concat(modules);

    if (shouldAddModuleTabs) {
      // Add the modules' tabs too
      tabs = [...tabs, ...modules.flatMap((bundle) => manifest[bundle].tabs)];
    }
  }
  function addSpecificTabs() {
    // If unknown tabs were specified, error
    const unknownTabs = tabOptions.filter((t) => !knownTabs.includes(t));
    if (unknownTabs.length > 0) {
      throw new Error(`Unknown tabs: ${unknownTabs.join(', ')}`);
    }

    tabs = tabs.concat(tabOptions);
  }
  function addAllBundles() {
    bundles = bundles.concat(knownBundles);
  }
  function addAllTabs() {
    tabs = tabs.concat(knownTabs);
  }

  if (modules === null && tabOptions === null) {
    addAllBundles();
    addAllTabs();
  } else {
    if (modules !== null) addSpecificModules();
    if (tabOptions !== null) addSpecificTabs();
  }

  return {
    bundles: [...new Set(bundles)],
    tabs: [...new Set(tabs)],
    modulesSpecified: modules !== null,
  };
};
