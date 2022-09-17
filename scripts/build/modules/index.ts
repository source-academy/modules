import chalk from 'chalk';
import fs, { promises as fsPromises } from 'fs';
import memoize from 'lodash/memoize';
import type { Low } from 'lowdb/lib';
import { performance } from 'perf_hooks';
import { rollup } from 'rollup';

import { BUILD_PATH, SOURCE_PATH } from '../../constants';
import { CommandInfo, createCommand, Logger, modules } from '../../utilities';
import {
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

  const startLogger = new Logger();

  const bundlesReason = Object.entries(bundlesWithReason);
  if (bundlesReason.length === 0) {
    startLogger.log(chalk.greenBright('All bundles up to date'));
  } else {
    startLogger.log(chalk.cyanBright('Building the following bundles:'));
    if (opts.verbose) {
      bundlesReason.forEach(([bundle, reason]) => startLogger.log(`• ${chalk.blueBright(bundle)}: ${reason}`));
    } else {
      bundlesReason.forEach(([bundle]) => startLogger.log(`• ${chalk.blueBright(bundle)}`));
    }
  }

  startLogger.log('');
  const tabsReason = Object.entries(tabsWithReason);

  if (tabsReason.length === 0) {
    startLogger.log(chalk.greenBright('All tabs up to date'));
  } else {
    startLogger.log(chalk.cyanBright('Building the following tabs:'));
    if (opts.verbose) {
      tabsReason.forEach(([tabName, reason]) => startLogger.log(`• ${chalk.blueBright(tabName)}: ${reason}`));
    } else {
      tabsReason.forEach(([tabName]) => startLogger.log(`• ${chalk.blueBright(tabName)}`));
    }
  }

  startLogger.log('');

  return {
    bundlesWithReason,
    tabsWithReason,
    logs: startLogger.contents,
  };
};

const buildBundles = async (db: Low<DBType>, bundlesReason: EntriesWithReasons, buildTime: number) => {
  const bundlePromises = Object.keys(bundlesReason)
    .map(async (bundle) => {
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
        return ['success', bundle, `${(size / 1024).toFixed(2)} KB`, endTime - startTime];
      } catch (error) {
        return ['error', bundle, error, 0];
        // (`Failed to build tab '${bundle}': ${error}`));
      }
    });

  const buildLogger = new Logger();
  const buildResults = await Promise.all(bundlePromises);
  if (buildResults.find(([status]) => status === 'error')) buildLogger.log(`${chalk.cyanBright('Bundles finished with')} ${chalk.redBright('errors:')}`);
  else buildLogger.log(`${chalk.cyanBright('Bundles finished')} ${chalk.greenBright('successfully:')}`);

  buildResults.forEach(([status, bundle, info, time]) => {
    if (status === 'success') buildLogger.log(`• ${chalk.blueBright(bundle)}: Build ${chalk.greenBright('successful')} (${info})`);
    else buildLogger.log(`• ${chalk.blueBright(bundle)}: ${chalk.redBright(info)} ${time / 1000}s`);
  });

  return buildLogger.contents;
};

const buildTabs = async (db: Low<DBType>, tabReasons: EntriesWithReasons, buildTime: number) => {
  const tabPromises = Object.keys(tabReasons)
    .map(async (tabName) => {
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

        return ['success', tabName, `${(size / 1024).toFixed(2)} KB`, endTime - startTime];
      } catch (error) {
        return ['error', tabName, error, 0];
      }
    });

  const buildLogger = new Logger();
  const buildResults = await Promise.all(tabPromises);
  if (buildResults.find(([status]) => status === 'error')) buildLogger.log(`${chalk.cyanBright('Tabs finished with')} ${chalk.redBright('errors:')}`);
  else buildLogger.log(`${chalk.cyanBright('Tabs finished')} ${chalk.greenBright('successfully:')}`);

  buildResults.forEach(([status, tabName, info, time]) => {
    if (status === 'success') buildLogger.log(`• ${chalk.blueBright(tabName)}: Build ${chalk.greenBright('successful')} (${info})`);
    else buildLogger.log(`• ${chalk.blueBright(tabName)}: ${chalk.redBright(info)} ${time / 1000}s`);
  });

  return buildLogger.contents;
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

  const [bundleLogs, tabsLogs] = await Promise.all([
    buildBundles(db, bundlesWithReason, buildTime),
    buildTabs(db, tabsWithReason, buildTime),
  ]);
  await db.write();

  return [...bundleLogs, '', ...tabsLogs];
};

export default createCommand(commandInfo as CommandInfo,
  async (opts: ModulesCommandOptions) => {
    const db = await getDb();
    const {
      logs: startLogs,
      ...parsedOpts
    } = await getBundlesAndTabs(db, opts);
    console.log(startLogs.join('\n'));

    const endLogs = await buildBundlesAndTabs(db, parsedOpts);
    console.log(endLogs.join('\n'));
    await copy();
  });
