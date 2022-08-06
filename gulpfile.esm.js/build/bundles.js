import chalk from 'chalk';
import gulp from 'gulp';
import { rollup } from 'rollup';
import modules from '../../modules.json';
import copy from './misc';
import {
  defaultConfig,
  getDb,
  isFolderModified,
  shouldBuildAll,
} from './utilities';

/**
 * Transpile bundles to the build folder
 */
export const buildBundles = (db) => {
  const isBundleModifed = (bundle) => {
    if (process.argv[3] === '--force') return true;
    const timestamp = db.get(`bundles.${bundle}`).value() || 0;
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
    filteredBundles.map((bundle) => `• ${chalk.blueBright(bundle)}`).join('\n')
  );

  const buildTime = new Date().getTime();

  const processBundle = async (bundle) => {
    const result = await rollup({
      ...defaultConfig,
      input: `src/bundles/${bundle}/index.ts`,
    });

    await result.write({
      file: `build/bundles/${bundle}.js`,
      format: 'iife',
    });

    db.set(`bundle.${bundle}`, buildTime).write();
  };

  return Promise.all(filteredBundles.map(processBundle));
};

export default gulp.series(
  Object.assign(
    async () => {
      const db = await getDb();
      await buildBundles(db);
    },
    {
      displayName: 'buildBundles',
    }
  ),
  copy
);
