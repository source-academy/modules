import fs from 'fs/promises';
import { Command } from 'commander';
import copy from './misc';
import { BuildTask, defaultConfig, getDb, isFolderModified, removeDuplicates } from './buildUtils';
import { modules } from '../utilities';
import { BUILD_PATH, SOURCE_PATH } from '../constants';
import chalk from 'chalk';
import { rollup } from 'rollup';
import { buildDocs } from './docs';

const getArgs = () => {
  const argparser = new Command();

  argparser.option('-f, --force', 'Build all bundles regardless of build status')
  argparser.option('-m, --module <modules...>', 'Build specified bundles regardless of build status')
  
  return argparser.parse().opts();
}

export const convertRawTab = (rawTab: string) => {
  const lastBracket = rawTab.lastIndexOf('(');
  return `${rawTab.substring(0, lastBracket)})`;
};

export const build: BuildTask = async (db) => {
  const opts = getArgs();

  const getBundles = async (): Promise<[string, string][]> => {
    const shouldBuildBundle = (bundleName: string): false | string => {
      // Folder was modified
      const timestamp = db.data.bundles[bundleName] ?? 0;
      if( !timestamp || isFolderModified(`${SOURCE_PATH}/bundles/${bundleName}`, timestamp)) {
        return 'Outdated build'
      }
      return false;
    }
    const bundleNames = Object.keys(modules);

    if (opts.force) return bundleNames.map(bundle => [bundle, '--force specified']);

    if (opts.module) {
      const unknowns = opts.module.filter(bundleName => !bundleNames.includes(bundleName));
      if (unknowns.length > 0) {
        throw new Error(`Unknown modules: ${unknowns.join(', ')}`);
      }

      return opts.module.map(bundle => [bundle, 'Specified by --module']) as [string, string][];
    }

    try {
      // Bundles build directory is empty or doesn't exist
      const bundlesDir = await fs.readdir(`${BUILD_PATH}/bundles`);
      if (bundlesDir.length === 0) return bundleNames.map(bundle => [bundle, 'Bundles build directory is empty']);
    } catch (error) {
      if (error.code === 'ENOENT') return bundleNames.map(bundle => [bundle, 'Bundles build directory missing']);
      throw error;
    }

    return bundleNames.map(bundleName => {
      const result = shouldBuildBundle(bundleName);
      return result === false ? result : [bundleName, result];
    }).filter(x => x !== false) as unknown as [string, string][];
  }
  
  const bundlesWithReason = await getBundles();

  if (bundlesWithReason.length === 0) {
    console.log(chalk.greenBright('All bundles up to date'));
  } else {
    console.log('Building the following bundles:')
    console.log(bundlesWithReason.map(([bundle, reason]) => `• ${chalk.blueBright(bundle)}: ${reason}`).join('\n'));
  }

  const bundlesToBuild = bundlesWithReason.map(([bundle]) => bundle);

  const getTabs = async (): Promise<[string, string][]> => {
    const getAllTabs = (reason: string): [string, string][] => removeDuplicates(Object.values(modules).flatMap(x => x.tabs)).map(tab => [tab, reason]);

    // If forcing, just get all tabs
    if (opts.force) return getAllTabs('--force specified');

    try {
      const tabBuildDir = await fs.readdir(`${BUILD_PATH}/tabs`);
      
      // If the tab build directory is empty, build all tabs
      if (tabBuildDir.length === 0) return getAllTabs('Tabs build directory is empty');
    } catch (error) {

      // If the tab build directory doesn't exist, build all tabs
      if (error.code === 'ENOENT') return getAllTabs('Tabs build directory is missing');
      throw error;
    }

    const tabNames = {} as { [name: string]: string };

    // Add tabs for bundles that we are rebuilding
    bundlesToBuild.forEach((bundleName) => modules[bundleName].tabs.forEach(tabName => { tabNames[tabName] = `${bundleName} bundle is being rebuilt`; }));

    getAllTabs('').forEach(([tabName]) => {
      if (tabNames[tabName]) return;

      const timestamp = db.data.tabs[tabName] ?? 0;
      if (!timestamp || isFolderModified(`${SOURCE_PATH}/tabs/${tabName}`, timestamp)) {
        tabNames[tabName] = 'Outdated buiid';
      }
    })

    return Object.entries(tabNames);
  }

  console.log();

  const tabsWithReason = await getTabs();
  if (tabsWithReason.length === 0) {
    console.log(chalk.greenBright('All tabs up to date'));
  } else {
    console.log('Building the following tabs:')
    console.log(tabsWithReason.map(([tabName, reason]) => `• ${chalk.blueBright(tabName)}: ${reason}`).join('\n'));
  }

  const tabsToBuild = tabsWithReason.map(([tabName]) => tabName);
  const buildTime = new Date().getTime();

  const bundlePromises = bundlesToBuild.map(async bundle => {
    const rollupBundle = await rollup({
      ...defaultConfig,
      input: `${SOURCE_PATH}/bundles/${bundle}/index.ts`,
    })

    await rollupBundle.write({
      file: `${BUILD_PATH}/bundles/${bundle}.js`,
      format: 'iife',
    })
    await rollupBundle.close();

    db.data.bundles[bundle] = buildTime;
  });

  const tabPromises = tabsToBuild.map(async tabName => {
    const rollupBundle = await rollup({
      ...defaultConfig,
      input: `${SOURCE_PATH}/tabs/${tabName}/index.tsx`,
      external: ['react', 'react-dom'],
    });

    const tabFile = `${BUILD_PATH}/tabs/${tabName}.js`;
    const { output: rollupOutput } = await rollupBundle.generate({
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
    await rollupBundle.close();

    db.data.tabs[tabName] = buildTime
  })

  await Promise.all(bundlePromises.concat(tabPromises));
  await copy();
  await db.write();
}

export default async () => {
  const db = await getDb();
  await Promise.all([build(db), buildDocs(db)]);
}