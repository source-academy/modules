import gulp from 'gulp';
import { rollup } from 'gulp-rollup-2';
import chalk from 'chalk';
import {
  isFolderModified,
  getDb,
  removeDuplicates,
  tabNameToConfig,
} from './utilities';
import copy from './copyfile';
import modules from '../../modules.json';

export const buildTabs = (db) => {
  const isTabModifed = (tabName) => {
    const timestamp = db.get(`tabs.${tabName}`).value() || 0;
    return isFolderModified(`src/tabs/${tabName}`, timestamp);
  };

  const tabNames = removeDuplicates(
    Object.values(modules).flatMap((x) => x.tabs)
  ).filter(isTabModifed);

  if (tabNames.length === 0) {
    return null;
  }

  console.log('Building the following tabs:');
  console.log(tabNames.map(chalk.blue).join('\n'));

  const buildTime = new Date().getTime();

  const promises = tabNames.map(
    (tabName) =>
      new Promise((resolve, reject) =>
        // eslint-disable-next-line no-promise-executor-return
        gulp
          .src(`src/tabs/${tabName}/index.tsx`)
          .pipe(rollup(tabNameToConfig(tabName)))
          .on('error', reject)
          .pipe(gulp.dest('build/tabs/'))
          .on('end', () => {
            db.set(`tabs.${tabName}`, buildTime).write();
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
      return buildTabs(db);
    },
    {
      displayName: 'buildTabs',
    }
  ),
  copy
);
