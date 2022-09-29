import chalk from 'chalk';
import { Table } from 'console-table-printer';
import fs, { promises as fsPromises } from 'fs';
import { rollup } from 'rollup';

import { BUILD_PATH, SOURCE_PATH } from '../../constants';
import { cjsDirname, modules, wrapWithTimer } from '../../utilities';
import { BuildLog, BuildResult, checkForUnknowns, DBType, EntriesWithReasons, isFolderModified } from '../buildUtils';

import { defaultConfig, runWorker } from './utils';

type BundleOpts = {
  force?: boolean;
  bundles?: string | string[];
};

export const getBundles = async (db: DBType, opts: BundleOpts): Promise<EntriesWithReasons> => {
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

export const logBundleStart = (bundles: EntriesWithReasons, verbose?: boolean) => {
  const bundleWithReasons = Object.entries(bundles);

  if (bundleWithReasons.length === 0) {
    return [chalk.greenBright('All bundles up to date')];
  }

  return [chalk.cyanBright('Building the following bundles:')].concat(bundleWithReasons
    .map(([bundle, reason]) => {
      if (verbose) return `• ${chalk.blueBright(bundle)}: ${reason}`;
      return `• ${chalk.blueBright(bundle)}`;
    }));
};

export const buildBundle = wrapWithTimer(async (bundle: string): Promise<BuildLog> => {
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
    const { size } = await fsPromises.stat(bundleFile);

    return {
      result: 'success',
      name: bundle,
      fileSize: size,
    };
  } catch (error) {
    return {
      result: 'error',
      name: bundle,
      error,
    };
  }
});

export const buildBundles = async (db: DBType, bundlesReason: EntriesWithReasons, buildTime: number): Promise<BuildResult> => {
  try {
    const wrapper = async (bundle: string) => {
      try {
        const result = await runWorker<BuildLog>(`${cjsDirname(import.meta.url)}/bundleWorker.ts`, bundle);

        if (result.result !== 'error') db.data.bundles[bundle] = buildTime;
        return result;
      } catch (error) {
        return {
          result: 'error',
          error,
        } as BuildLog;
      }
    };

    const bundlePromises = Object.keys(bundlesReason)
      .map((bundle) => wrapper(bundle));
    const buildResults = await Promise.all(bundlePromises);
    const finalResult = buildResults.find(({ result }) => result === 'error') ? 'error' : 'success';

    console.log('Bundles completed');

    return {
      result: finalResult,
      logs: buildResults,
    };
  } catch (error) {
    console.log('Bundles errored');
    return {
      result: 'error',
      error,
      logs: [],
    };
  }
};

export const logBundleResult = (bundlesResult: BuildResult) => {
  const bundleLogs: string[] = [];
  if (bundlesResult.logs.length > 0) {
    if (bundlesResult.result === 'error') {
      bundleLogs.push(`${chalk.cyanBright('Bundles finished with')} ${chalk.redBright('errors')}`);
    } else {
      bundleLogs.push(`${chalk.cyanBright('Bundles finished')} ${chalk.greenBright('successfully')}`);
    }

    const bundlesTable = new Table();

    bundlesResult.logs.forEach(({ result, name, fileSize, error, elapsed }) => {
      const entry = {
        'Bundle': name,
        'Result': result === 'success' ? 'Success' : 'Error',
        'File Size': fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : '-',
        'Elapsed (s)': elapsed ? (elapsed / 1000)?.toFixed(2) : '-',
        'Errors': error?.toString() ?? '-',
      };

      const color = result === 'error' ? 'red' : 'green';

      bundlesTable.addRow(entry, { color });
    });
    bundleLogs.push(bundlesTable.render());
  }

  return bundleLogs;
};
