import chalk from 'chalk';
import { rollup } from 'rollup';
import { modules } from '../utilities';
import copy from './misc';
import {
  BuildTask,
  defaultConfig,
  getDb,
  isFolderModified,
  shouldBuildAll,
} from './buildUtils';

/**
 * Transpile bundles to the build folder
 */
export const buildBundles: BuildTask = async (db) => {
  const isBundleModifed = (bundle: string) => {
    if (process.argv[3] === '--force') return true;
    const timestamp = db.data.bundles[bundle] ?? 0;
    return isFolderModified(`src/bundles/${bundle}`, timestamp);
  };

  const bundleNames = Object.keys(modules);
  const filteredBundles = shouldBuildAll('bundles')
    ? bundleNames
    : bundleNames.filter(isBundleModifed);

  if (filteredBundles.length === 0) {
    console.log('All bundles up to date');
    return null;
  }

  console.log(chalk.greenBright('Building bundles for the following modules:'));
  console.log(
    filteredBundles.map((bundle) => `• ${chalk.blueBright(bundle)}`)
      .join('\n'),
  );

  const buildTime = new Date()
    .getTime();

  const processBundle = async (bundle: string) => {
    const result = await rollup({
      ...defaultConfig,
      input: `src/bundles/${bundle}/index.ts`,
    });

    await result.write({
      file: `build/bundles/${bundle}.js`,
      format: 'iife',
    });

    db.data.bundles[bundle] = buildTime
  };

  await Promise.all(filteredBundles.map(processBundle));
  await db.write();
};

export default async () => {
  const db = await getDb();
  await buildBundles(db);
  await copy();
};
