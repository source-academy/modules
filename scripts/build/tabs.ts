import { rollup } from 'rollup';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import {
  isFolderModified,
  getDb,
  removeDuplicates,
  defaultConfig,
  BuildTask,
} from './buildUtils';
import copy from './misc';
import { modules } from '../utilities';
import { BUILD_PATH, SOURCE_PATH } from '../constants';

export const convertRawTab = (rawTab: string) => {
  const lastBracket = rawTab.lastIndexOf('(');
  return `${rawTab.substring(0, lastBracket)})`;
};

/**
 * Transpile tabs to the build folder
 */
export const buildTabs: BuildTask = async (db) => {
  const getTabs = async () => {
    const getAllTabs = () => removeDuplicates(Object.values(modules).flatMap(x => x.tabs));

    // If forcing, just get all tabs
    if (process.argv[3] === '--force') return getAllTabs();

    try {
      const tabBuildDir = await fs.readdir(`${BUILD_PATH}/tabs`);
      
      // If the tab build directory is empty, build all tabs
      if (tabBuildDir.length === 0) return getAllTabs();
    } catch (error) {

      // If the tab build directory doesn't exist, build all tabs
      if (error.code === 'ENOENT') return getAllTabs();
      throw error;
    }

    const tabNames = new Set<string>();

    Object.entries(modules).forEach(([bundle, { tabs }]) => {
      const bundleTimestamp = db.data.bundles[bundle] ?? 0;

      // If bundle has no tabs, skip it
      if (tabs.length === 0) return;

      // For each bundle, if it was modified, its tabs need to be rebuilt
      if (!bundleTimestamp || isFolderModified(`${SOURCE_PATH}/bundles/${bundle}`, bundleTimestamp)) {
        console.log(`${chalk.blue(bundle)} was modified, rebuilding it's tabs`);
        tabs.forEach(tabName => tabNames.add(tabName));

        return;
      }
    
      tabs.forEach(tabName => {
        // Check if the tab itself was modified
        const tabTimestamp = db.data.tabs[tabName];
        if (!tabTimestamp || isFolderModified(`${SOURCE_PATH}/tabs/${tabName}`, tabTimestamp)) {
          tabNames.add(tabName);
        }
      })
    })
    
    return [...tabNames];
  }

  const filteredTabs = await getTabs();
  
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
      input: `${SOURCE_PATH}/tabs/${tabName}/index.tsx`,
      external: ['react', 'react-dom'],
    });

    const tabFile = `${BUILD_PATH}/tabs/${tabName}.js`;
    const { output: rollupOutput } = await result.generate({
      file: tabFile,
      format: 'iife',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDom',
      },
    });
    
    // Only one chunk should be generated
    const rawTab = rollupOutput[0].code;
    await fs.writeFile(tabFile, convertRawTab(rawTab));
    await result.close();

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
