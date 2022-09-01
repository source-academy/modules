import fs from 'fs';
import fsPromises from 'fs/promises';
import {
  checkForUnknowns,
  DBType,
  defaultConfig,
  EntryWithReason,
  getDb,
  isFolderModified,
  Opts,
  removeDuplicates,
} from './buildUtils';
import { modules } from '../utilities';
import { BUILD_PATH, SOURCE_PATH } from '../constants';
import chalk from 'chalk';
import { rollup } from 'rollup';
import memoize from 'lodash/memoize';
import type { Low } from 'lowdb/lib';
import copy from './misc';
import { minify } from 'terser';

type Config = {
  bundlesWithReason: EntryWithReason[];
  tabsWithReason: EntryWithReason[];
};

/**
 * Determine which bundles and tabs to build
 */
export const getBundlesAndTabs = async (db: Low<DBType>, opts: Opts): Promise<Config> => {
  const getBundles = async (): Promise<EntryWithReason[]> => {
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

    if (opts.force) {
      return bundleNames.map((bundle) => [bundle, '--force specified']);
    }

    if (opts.modules) {
      const unknowns = checkForUnknowns(opts.modules, bundleNames);
      if (unknowns.length > 0) {
        throw new Error(`Unknown modules: ${unknowns.join(', ')}`);
      }

      return opts.modules.map((bundle) => [bundle, 'Specified by --module']);
    }

    try {
      // Bundles build directory is empty or doesn't exist
      const bundlesDir = await fsPromises.readdir(`${BUILD_PATH}/bundles`);
      if (bundlesDir.length === 0) return bundleNames.map((bundle) => [bundle, 'Bundles build directory is empty']);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fsPromises.mkdir(`${BUILD_PATH}/bundles`);
        return bundleNames.map((bundle) => [bundle, 'Bundles build directory missing']);
      }
      throw error;
    }

    return bundleNames.map((bundleName) => {
      const result = shouldBuildBundle(bundleName);
      return result === false ? result : [bundleName, result];
    })
      .filter((x) => x !== false) as EntryWithReason[];
  };

  const bundlesWithReason = await getBundles();

  const getTabs = async (): Promise<EntryWithReason[]> => {
    // Use lodash to memoize so we don't have to keep performing this tab calculation
    const getAllTabs = memoize(() => removeDuplicates(Object.values(modules)
      .flatMap((bundle) => bundle.tabs)));

    // If forcing, just get all tabs
    if (opts.force) {
      return getAllTabs()
        .map((tabName) => [tabName, '--force specified']);
    }

    try {
      const tabBuildDir = await fsPromises.readdir(`${BUILD_PATH}/tabs`);

      // If the tab build directory is empty, build all tabs
      if (tabBuildDir.length === 0) {
        return getAllTabs()
          .map((tabName) => [tabName, 'Tabs build directory is empty']);
      }
    } catch (error) {
      // If the tab build directory doesn't exist, build all tabs
      if (error.code === 'ENOENT') {
        await fsPromises.mkdir(`${BUILD_PATH}/tabs`);
        return getAllTabs()
          .map((tabName) => [tabName, 'Tabs build directory is missing']);
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
    bundlesWithReason.forEach(([bundleName]) => {
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

    return Object.entries(tabNames);
  };

  const tabsWithReason = await getTabs();

  return {
    bundlesWithReason,
    tabsWithReason,
  };
};

/**
 * Use rollup to rebuild bundles and tabs
 */
export const buildBundlesAndTabs = async (db: Low<DBType>, {
  bundlesWithReason,
  tabsWithReason,
}: Config, verbose: boolean) => {
  if (bundlesWithReason.length === 0) {
    console.log(chalk.greenBright('All bundles up to date'));
  } else {
    console.log('Building the following bundles:');
    if (verbose) {
      console.log(bundlesWithReason.map(([bundle, reason]) => `• ${chalk.blueBright(bundle)}: ${reason}`)
        .join('\n'));
    } else {
      console.log(bundlesWithReason.map(([bundle]) => `• ${chalk.blueBright(bundle)}`)
        .join('\n'));
    }
  }

  const bundlesToBuild = bundlesWithReason.map(([bundle]) => bundle);
  console.log();

  if (tabsWithReason.length === 0) {
    console.log(chalk.greenBright('All tabs up to date'));
  } else {
    console.log('Building the following tabs:');
    if (verbose) {
      console.log(tabsWithReason.map(([tabName, reason]) => `• ${chalk.blueBright(tabName)}: ${reason}`)
        .join('\n'));
    } else {
      console.log(tabsWithReason.map(([tabName]) => `• ${chalk.blueBright(tabName)}`)
        .join('\n'));
    }
  }

  const tabsToBuild = tabsWithReason.map(([tabName]) => tabName);
  const buildTime = new Date()
    .getTime();

  const bundlePromises = bundlesToBuild.map(async (bundle) => {
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

    const { output: [{ code }] } = await rollupBundle.generate({
      file: bundleFile,
      format: 'iife',
      globals: {
        'js-slang/moduleHelpers': 'ctx',
      },
    });
    await rollupBundle.close();

    const { code: bundleCode } = await minify(code, {
      module: true,
      ecma: 5,
      compress: {
        side_effects: false,
      },
    });

    await fsPromises.writeFile(bundleFile, bundleCode);

    db.data.bundles[bundle] = buildTime;
  });

  const tabPromises = tabsToBuild.map(async (tabName) => {
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
    const { output: [{ code }] } = await rollupBundle.generate({
      file: tabFile,
      format: 'iife',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDom',
      },
    });
    await rollupBundle.close();

    const { code: minified } = await minify(code, {
      compress: {
        side_effects: false,
      },
    });
    await fsPromises.writeFile(tabFile, minified);
    db.data.tabs[tabName] = buildTime;
  });

  await Promise.all(bundlePromises.concat(tabPromises));
  await db.write();
};

export default async (opts: Opts) => {
  const db = await getDb();
  const parsedOpts = await getBundlesAndTabs(db, opts);

  await buildBundlesAndTabs(db, parsedOpts, opts.verbose);
  await copy();
};
