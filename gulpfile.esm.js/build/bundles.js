import chalk from 'chalk';
import gulp from 'gulp';
import { rollup } from 'gulp-rollup-2';
import modules from '../../modules.json';
import copy from './copyfile';
import { bundleNameToConfig, getDb, isFolderModified } from './utilities';

export const buildBundles = (db) => {
  const isBundleModifed = (bundle) => {
    if (process.argv[3] === '--force') return true;
    const timestamp = db.get(`bundles.${bundle}`).value() || 0;
    return isFolderModified(`src/bundles/${bundle}`, timestamp);
  };

  const moduleNames = Object.keys(modules).filter(isBundleModifed);

  if (moduleNames.length === 0) {
    console.log('All bundles up to date');
    return null;
  }

  console.log(chalk.greenBright('Building bundles for the following modules:'));
  console.log(
    moduleNames.map((bundle) => `• ${chalk.blueBright(bundle)}`).join('\n')
  );

  const buildTime = new Date().getTime();

  const promises = moduleNames.map(
    (bundle) =>
      new Promise((resolve, reject) =>
        // eslint-disable-next-line no-promise-executor-return
        gulp
          .src(`src/bundles/${bundle}/index.ts`)
          .pipe(rollup(bundleNameToConfig(bundle)))
          .on('error', reject)
          .pipe(gulp.dest('build/bundles/'))
          .on('end', () => {
            db.set(`bundles.${bundle}`, buildTime).write();
            resolve();
          })
      )
  );

  return Promise.all(promises);
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
