import { rollup } from 'rollup';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import {
  isFolderModified,
  getDb,
  removeDuplicates,
  defaultConfig,
  shouldBuildAll,
  BuildTask,
} from './buildUtils';
import copy from './misc';
import { modules } from '../utilities';

export const convertRawTab = (rawTab: string) => {
  const lastBracket = rawTab.lastIndexOf('(');
  return `${rawTab.substring(0, lastBracket)})`;
};

/**
 * Transpile tabs to the build folder
 */
export const buildTabs: BuildTask = async (db) => {
  const isTabModifed = (tabName: string) => {
    if (process.argv[3] === '--force') return true;
    const timestamp = db.data.tabs[tabName] ?? 0;
    return isFolderModified(`src/tabs/${tabName}`, timestamp);
  };

  const tabNames = removeDuplicates(
    Object.values(modules)
      .flatMap((x) => x.tabs),
  );

  const filteredTabs = shouldBuildAll('tabs')
    ? tabNames
    : tabNames.filter(isTabModifed);

  if (filteredTabs.length === 0) {
    console.log(chalk.greenBright('All tabs up to date'));
    return;
  }

  console.log(chalk.greenBright('Building the following tabs:'));
  console.log(filteredTabs.map((x) => `• ${chalk.blue(x)}`)
    .join('\n'));

  const buildTime = new Date()
    .getTime();

  const processTab = async (tabName: string) => {
    const result = await rollup({
      ...defaultConfig,
      input: `src/tabs/${tabName}/index.tsx`,
      external: ['react', 'react-dom'],
    });

    const tabFile = `build/tabs/${tabName}.js`;
    const { output: rollupOutput } = await result.generate({
      file: tabFile,
      format: 'iife',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDom',
      },
    });

    const rawTab = rollupOutput[0].code;
    await fs.writeFile(tabFile, convertRawTab(rawTab));

    db.data.tabs[tabName] = buildTime
  };

  await Promise.all(filteredTabs.map(processTab));
  await db.write();
};

export default async () => {
  const db = await getDb();
  await buildTabs(db);
  await copy();
};
