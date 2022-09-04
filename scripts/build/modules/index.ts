import chalk from 'chalk';
import fs, { promises as fsPromises } from 'fs';
import memoize from 'lodash/memoize';
import type { Low } from 'lowdb/lib';
import { rollup } from 'rollup';

import { BUILD_PATH, SOURCE_PATH } from '../../constants';
import { CommandInfo, createCommand, modules } from '../../utilities';
import {
  checkForUnknowns,
  DBType,
  defaultConfig,
  EntriesWithReasons,
  getDb,
  isFolderModified,
  removeDuplicates,
} from '../buildUtils';
import copy from '../misc';

import commandInfo from './command.json' assert { type: 'json' };

type Config = {
  bundlesWithReason: EntriesWithReasons;
  tabsWithReason: EntriesWithReasons;
};

type ModulesCommandOptions = Partial<{
  bundles: string[];
  tabs: string[];
  verbose: boolean;
  force: boolean;
}>;


type ModulesActionsOptions = Partial<{
  verbose: boolean;
  force: boolean;
  terserify: boolean;
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
      const unknowns = checkForUnknowns(opts.bundles, bundleNames);
      if (unknowns.length > 0) {
        throw new Error(`Unknown modules: ${unknowns.join(', ')}`);
      }

      return opts.bundles.reduce((prev, bundle) => ({
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
      const unknowns = checkForUnknowns(opts.tabs, getAllTabs());

      if (unknowns.length > 0) throw new Error(`Unknown tabs: ${unknowns.join('\n')}`);
      opts.tabs.forEach((tabName) => {
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

  return {
    bundlesWithReason,
    tabsWithReason,
  };
};

const buildBundles = async (db: Low<DBType>, bundlesReason: EntriesWithReasons, buildTime: number, opts: ModulesActionsOptions) => {
  const bundlesWithReason = Object.entries(bundlesReason);

  if (bundlesWithReason.length === 0) {
    console.log(chalk.greenBright('All bundles up to date'));
  } else {
    console.log('Building the following bundles:');
    if (opts.verbose) {
      console.log(bundlesWithReason.map(([bundle, reason]) => `• ${chalk.blueBright(bundle)}: ${reason}`)
        .join('\n'));
    } else {
      console.log(bundlesWithReason.map(([bundle]) => `• ${chalk.blueBright(bundle)}`)
        .join('\n'));
    }
  }

  const bundlePromises = bundlesWithReason.map(async ([bundle]) => {
    try {
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

      db.data.bundles[bundle] = buildTime;
    } catch (error) {
      console.log(chalk.redBright(`Failed to build tab '${bundle}': ${error}`));
    }
  });

  await Promise.all(bundlePromises);
};

const buildTabs = async (db: Low<DBType>, tabReasons: EntriesWithReasons, buildTime: number, opts: ModulesActionsOptions) => {
  const tabsWithReason = Object.entries(tabReasons);

  if (tabsWithReason.length === 0) {
    console.log(chalk.greenBright('All tabs up to date'));
  } else {
    console.log('Building the following tabs:');
    if (opts.verbose) {
      console.log(tabsWithReason.map(([tabName, reason]) => `• ${chalk.blueBright(tabName)}: ${reason}`)
        .join('\n'));
    } else {
      console.log(tabsWithReason.map(([tabName]) => `• ${chalk.blueBright(tabName)}`)
        .join('\n'));
    }
  }

  const tabPromises = tabsWithReason.map(async ([tabName]) => {
    try {
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

      db.data.tabs[tabName] = buildTime;
    } catch (error) {
      console.log(chalk.redBright(`Failed to build tab '${tabName}': ${error}`));
    }
  });

  await Promise.all(tabPromises);
};


/**
 * Use rollup to rebuild bundles and tabs
 */
export const buildBundlesAndTabs = async (db: Low<DBType>, {
  bundlesWithReason,
  tabsWithReason,
}: Config, opts: ModulesActionsOptions) => {
  const buildTime = new Date()
    .getTime();

  await Promise.all([
    buildBundles(db, bundlesWithReason, buildTime, opts),
    buildTabs(db, tabsWithReason, buildTime, opts),
  ]);
  await db.write();
};

export default createCommand(commandInfo as CommandInfo,
  async (opts: ModulesCommandOptions) => {
    const db = await getDb();
    const parsedOpts = await getBundlesAndTabs(db, opts);

    await buildBundlesAndTabs(db, parsedOpts, opts);
    await copy();
  });
