import chalk from 'chalk';
import { Table } from 'console-table-printer';
import fs, { promises as fsPromises } from 'fs';
import memoize from 'lodash/memoize';
import type { Low } from 'lowdb/lib';
import { performance } from 'perf_hooks';
import { rollup } from 'rollup';

import { BUILD_PATH, SOURCE_PATH } from '../../constants';
import { CommandInfo, createCommand, joinArrays, modules } from '../../utilities';
import {
  BuildLog,
  BuildResult,
  checkForUnknowns,
  DBType,
  EntriesWithReasons,
  getDb,
  isFolderModified,
  removeDuplicates,
} from '../buildUtils';
import copy from '../misc';

import commandInfo from './command.json' assert { type: 'json' };
import { defaultConfig } from './utils';

type Config = {
  bundlesWithReason: EntriesWithReasons;
  tabsWithReason: EntriesWithReasons;
};

type ModulesCommandOptions = Partial<{
  bundles: string | string[];
  tabs: string | string[];
  verbose: boolean;
  force: boolean;
}>;

/**
 * Determine which bundles and tabs to build
 */
export const getBundlesAndTabs = async (db: Low<DBType>, opts: ModulesCommandOptions) => {
  const getBundles = async (): Promise<EntriesWithReasons> => {
    const shouldBuildBundle = (bundleName: string): false | string => {
      if (!fs.existsSync(`${BUILD_PATH}/bundles/${bundleName}.js`)) {
        return 'Bundle file missing from build folder';
      }

      // Folder was modified
      const timestamp = db.data.bundles[bundleName] ?? 0;
      if (!timestamp || isFolderModified(`${SOURCE_PATH}/bundles/${bundleName}`, timestamp)) {
        return 'Outdated build';
      }
      return false;
    };

    const bundleNames = Object.keys(modules);

    const bundleNamesWithReason = (reason: string) => bundleNames.reduce((prev, bundleName) => ({
      ...prev,
      [bundleName]: reason,
    }), {});

    if (opts.force) {
      return bundleNamesWithReason('--force specified');
    }

    if (opts.bundles) {
      const optsBundles = typeof opts.bundles === 'string' ? [opts.bundles] : opts.bundles;
      const unknowns = checkForUnknowns(optsBundles, bundleNames);
      if (unknowns.length > 0) {
        throw new Error(`Unknown modules: ${unknowns.join(', ')}`);
      }

      return optsBundles.reduce((prev, bundle) => ({
        ...prev,
        [bundle]: 'Specified by --module',
      }), {});
    }

    try {
      // Bundles build directory is empty or doesn't exist
      const bundlesDir = await fsPromises.readdir(`${BUILD_PATH}/bundles`);
      if (bundlesDir.length === 0) {
        return bundleNamesWithReason('Bundles build directory is empty');
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fsPromises.mkdir(`${BUILD_PATH}/bundles`);
        return bundleNamesWithReason('Bundles build directory missing');
      }
      throw error;
    }

    return bundleNames.reduce((prev, bundleName) => {
      const result = shouldBuildBundle(bundleName);
      return result === false
        ? prev
        : {
          ...prev,
          [bundleName]: result,
        };
    }, {});
  };

  const bundlesWithReason = await getBundles();

  const getTabs = async (): Promise<EntriesWithReasons> => {
    // Use lodash to memoize so we don't have to keep performing this tab calculation
    const getAllTabs = memoize(() => removeDuplicates(Object.values(modules)
      .flatMap((bundle) => bundle.tabs)));

    // If forcing, just get all tabs
    if (opts.force) {
      return getAllTabs()
        .reduce((prev, tabName) => ({
          ...prev,
          [tabName]: '--force specified',
        }), {});
    }

    try {
      const tabBuildDir = await fsPromises.readdir(`${BUILD_PATH}/tabs`);

      // If the tab build directory is empty, build all tabs
      if (tabBuildDir.length === 0) {
        return getAllTabs()
          .reduce((prev, tabName) => ({
            ...prev,
            [tabName]: 'Tabs build directory is empty',
          }), {});
      }
    } catch (error) {
      // If the tab build directory doesn't exist, build all tabs
      if (error.code === 'ENOENT') {
        await fsPromises.mkdir(`${BUILD_PATH}/tabs`);
        return getAllTabs()
          .reduce((prev, tabName) => ({
            ...prev,
            [tabName]: 'Tabs build directory is missing',
          }), {});
      }
      throw error;
    }

    const tabNames = {} as { [name: string]: string };

    // If tab was specified to be rebuilt, then rebuild
    if (opts.tabs) {
      const optsTabs = typeof opts.tabs === 'string' ? [opts.tabs] : opts.tabs;
      const unknowns = checkForUnknowns(optsTabs, getAllTabs());

      if (unknowns.length > 0) throw new Error(`Unknown tabs: ${unknowns.join('\n')}`);
      optsTabs.forEach((tabName) => {
        tabNames[tabName] = 'Specified by --tab';
      });
    }

    // Add tabs for bundles that we are rebuilding
    Object.keys(bundlesWithReason)
      .forEach((bundleName) => {
        modules[bundleName].tabs.forEach((tabName) => {
          if (!tabNames[tabName]) tabNames[tabName] = `${bundleName} bundle is being rebuilt`;
        });
      });

    getAllTabs()
      .forEach((tabName) => {
        if (tabNames[tabName]) return;

        if (!fs.existsSync(`${BUILD_PATH}/tabs/${tabName}.js`)) {
          tabNames[tabName] = 'Tab file missing from build folder';
          return;
        }

        const timestamp = db.data.tabs[tabName] ?? 0;
        if (!timestamp || isFolderModified(`${SOURCE_PATH}/tabs/${tabName}`, timestamp)) {
          tabNames[tabName] = 'Outdated buiid';
        }
      });

    return tabNames;
  };

  const tabsWithReason = await getTabs();

  const startLogs: string[] = [];

  const bundlesReason = Object.entries(bundlesWithReason);
  if (bundlesReason.length === 0) {
    startLogs.push(chalk.greenBright('All bundles up to date'));
  } else {
    startLogs.push(chalk.cyanBright('Building the following bundles:'));
    if (opts.verbose) {
      bundlesReason.forEach(([bundle, reason]) => startLogs.push(`• ${chalk.blueBright(bundle)}: ${reason}`));
    } else {
      bundlesReason.forEach(([bundle]) => startLogs.push(`• ${chalk.blueBright(bundle)}`));
    }
  }

  if (startLogs.length > 0) startLogs.push('');
  const tabsReason = Object.entries(tabsWithReason);

  if (tabsReason.length === 0) {
    startLogs.push(chalk.greenBright('All tabs up to date'));
  } else {
    startLogs.push(chalk.cyanBright('Building the following tabs:'));
    if (opts.verbose) {
      tabsReason.forEach(([tabName, reason]) => startLogs.push(`• ${chalk.blueBright(tabName)}: ${reason}`));
    } else {
      tabsReason.forEach(([tabName]) => startLogs.push(`• ${chalk.blueBright(tabName)}`));
    }
  }

  return {
    bundlesWithReason,
    tabsWithReason,
    logs: startLogs,
  };
};


const buildBundles = async (db: Low<DBType>, bundlesReason: EntriesWithReasons, buildTime: number): Promise<BuildResult> => {
  const bundlePromises = Object.keys(bundlesReason)
    .map(async (bundle): Promise<BuildLog> => {
      try {
        const startTime = performance.now();
        const rollupBundle = await rollup({
          ...defaultConfig('bundle'),
          input: `${SOURCE_PATH}/bundles/${bundle}/index.ts`,
          external: ['js-slang/moduleHelpers'],
        });

        const bundleFile = `${BUILD_PATH}/bundles/${bundle}.js`;
        try {
          // Remove previous bundle file if it still exists
          await fsPromises.rm(bundleFile);
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }

        await rollupBundle.write({
          file: bundleFile,
          format: 'iife',
          globals: {
            'js-slang/moduleHelpers': 'ctx',
          },
        });

        await rollupBundle.close();
        const { size } = await fsPromises.stat(bundleFile);

        db.data.bundles[bundle] = buildTime;
        const endTime = performance.now();
        return {
          result: 'success',
          name: bundle,
          fileSize: size,
          elapsed: (endTime - startTime) / 1000,
        };
      } catch (error) {
        return {
          result: 'error',
          name: bundle,
          error,
        };
      }
    });

  const buildResults = await Promise.all(bundlePromises);
  const finalResult = buildResults.find(({ result }) => result === 'error') ? 'error' : 'success';

  return {
    result: finalResult,
    logs: buildResults,
  };
};

const buildTabs = async (db: Low<DBType>, tabReasons: EntriesWithReasons, buildTime: number): Promise<BuildResult> => {
  const tabPromises = Object.keys(tabReasons)
    .map(async (tabName): Promise<BuildLog> => {
      try {
        const startTime = performance.now();
        const rollupBundle = await rollup({
          ...defaultConfig('tab'),
          input: `${SOURCE_PATH}/tabs/${tabName}/index.tsx`,
          external: ['react', 'react-dom'],
        });

        const tabFile = `${BUILD_PATH}/tabs/${tabName}.js`;
        try {
          // Remove previous tab file if it still exists
          await fsPromises.rm(tabFile);
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }

        // Only one chunk should be generated
        await rollupBundle.write({
          file: tabFile,
          format: 'iife',
          globals: {
            'react': 'React',
            'react-dom': 'ReactDom',
          },
        });
        await rollupBundle.close();
        const { size } = await fsPromises.stat(tabFile);

        db.data.tabs[tabName] = buildTime;
        const endTime = performance.now();

        return {
          name: tabName,
          result: 'success',
          fileSize: size,
          elapsed: ((endTime - startTime) / 1000),
        };
      } catch (error) {
        return {
          name: tabName,
          fileSize: 0,
          elapsed: 0,
          result: 'error',
          error,
        };
      }
    });

  const buildResults = await Promise.all(tabPromises);
  const finalResult = buildResults.find(({ result }) => result === 'error') ? 'error' : 'success';

  return {
    result: finalResult,
    logs: buildResults,
  };
};

export const logBuildResults = (bundlesResult: BuildResult, tabResult: BuildResult) => {
  const bundleLogs: string[] = [];
  if (bundlesResult.logs.length > 0) {
    if (bundlesResult.result === 'error') {
      bundleLogs.push(`${chalk.blueBright('Bundles finished with')} ${chalk.redBright('errors')}`);
    } else {
      bundleLogs.push(`${chalk.blueBright('Bundles finished')} ${chalk.greenBright('successfully')}`);
    }

    const bundlesTable = new Table();

    bundlesResult.logs.forEach(({ result, name, fileSize, error, elapsed }) => {
      const entry = {
        'Bundle': name,
        'Result': result === 'success' ? 'Success' : 'Error',
        'File Size': fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : '-',
        'Elapsed (s)': elapsed?.toFixed(2) ?? '-',
        'Errors': error?.toString() ?? '-',
      };

      const color = result === 'error' ? 'red' : 'green';

      bundlesTable.addRow(entry, { color });
    });
    bundleLogs.push(bundlesTable.render());
  }

  const tabLogs: string[] = [];

  if (tabResult.logs.length > 0) {
    if (tabResult.result === 'error') {
      tabLogs.push(`${chalk.cyanBright('Tabs finished with')} ${chalk.redBright('errors')}`);
    } else {
      tabLogs.push(`${chalk.cyanBright('Tabs finished')} ${chalk.greenBright('successfully')}`);
    }

    const tabsTable = new Table();
    tabResult.logs.forEach(({ result, name, fileSize, error, elapsed }) => {
      tabsTable.addRow({
        'Tab': name,
        'Result': result === 'success' ? 'Success' : 'Error',
        'File Size': fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : '-',
        'Elapsed (s)': elapsed?.toFixed(2) ?? '-',
        'Errors': error ?? '-',
      }, { color: result === 'error' ? 'red' : 'green' });
    });
    tabLogs.push(tabsTable.render());
  }

  return joinArrays('', bundleLogs, tabLogs);
};

/**
 * Use rollup to rebuild bundles and tabs
 */
export const buildBundlesAndTabs = async (db: Low<DBType>, {
  bundlesWithReason,
  tabsWithReason,
}: Config) => {
  const buildTime = new Date()
    .getTime();

  const results = await Promise.all([
    buildBundles(db, bundlesWithReason, buildTime),
    buildTabs(db, tabsWithReason, buildTime),
  ]);
  await db.write();
  return results;
};

export default createCommand(commandInfo as CommandInfo,
  async (opts: ModulesCommandOptions) => {
    const db = await getDb();
    const {
      logs: startLogs,
      ...parsedOpts
    } = await getBundlesAndTabs(db, opts);
    console.log(`${startLogs.join('\n')}\n`);

    const [bundlesResult, tabsResult] = await buildBundlesAndTabs(db, parsedOpts);
    console.log(logBuildResults(bundlesResult, tabsResult)
      .join('\n'));
    await copy();
  });
