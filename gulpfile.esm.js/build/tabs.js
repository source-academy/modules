import gulp from 'gulp';
import { rollup } from 'rollup';
import chalk from 'chalk';
import fs from 'fs';
import {
  isFolderModified,
  getDb,
  removeDuplicates,
  defaultConfig,
} from './utilities';
import copy from './misc';
import modules from '../../modules.json';

/**
 * Transpile tabs to the build folder
 */
export const buildTabs = (db) => {
  const isTabModifed = (tabName) => {
    if (process.argv[3] === '--force') return true;
    const timestamp = db.get(`tabs.${tabName}`).value() || 0;
    return isFolderModified(`src/tabs/${tabName}`, timestamp);
  };

  const tabNames = removeDuplicates(
    Object.values(modules).flatMap((x) => x.tabs)
  ).filter(isTabModifed);

  if (tabNames.length === 0) {
    return null;
  }

  console.log(chalk.greenBright('Building the following tabs:'));
  console.log(tabNames.map((x) => `• ${chalk.blue(x)}`).join('\n'));

  const buildTime = new Date().getTime();

  const processTab = async (tabName) => {
    const result = await rollup({
      ...defaultConfig,
      input: `src/tabs/${tabName}/index.tsx`,
      external: ['react', 'react-dom'],
    });

    const tabFile = `build/tabs/${tabName}.js`;
    await result.write({
      file: tabFile,
      format: 'iife',
      globals: {
        react: 'React',
        'react-dom': 'ReactDom',
      },
    });

    const rawTab = fs.readFileSync(tabFile, 'utf-8');
    const lastBracket = rawTab.lastIndexOf('(');
    fs.writeFileSync(tabFile, `${rawTab.substring(0, lastBracket)})`);

    db.set(`tabs.${tabName}`, buildTime).write();
  };

  return Promise.all(tabNames.map(processTab));
};

export default gulp.series(
  Object.assign(
    async () => {
      const db = await getDb();
      await buildTabs(db);
    },
    {
      displayName: 'buildTabs',
    }
  ),
  copy
);
