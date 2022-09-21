import chalk from 'chalk';
import { Command } from 'commander';
import { Table } from 'console-table-printer';
import fs, { promises as fsPromises } from 'fs';
import memoize from 'lodash/memoize';
import { rollup } from 'rollup';

import { BUILD_PATH, SOURCE_PATH } from '../../constants';
import { cjsDirname, modules } from '../../utilities';
import { BuildLog, BuildResult, checkForUnknowns, DBType, EntriesWithReasons, getDb, isFolderModified, removeDuplicates } from '../buildUtils';
import copy from '../misc';

import { defaultConfig, runWorker } from './utils';

type Args = {
  db: DBType;
  buildTime: number;
  tabName: string;
};

type TabOpts = {
  force?: boolean;
  tabs?: string | string[];
};

export const getTabs = async (db: DBType, opts: TabOpts, bundles?: EntriesWithReasons): Promise<EntriesWithReasons> => {
  const getAllTabs = memoize(() => removeDuplicates(Object.values(modules)
    .flatMap((bundle) => bundle.tabs)));

  // If forcing, just get all tabs
  if (opts.force) {
    return getAllTabs()
      .reduce((prev, tabName) => ({
        ...prev,
        [tabName]: '--force specified',
      }), {});
  }

  try {
    const tabBuildDir = await fsPromises.readdir(`${BUILD_PATH}/tabs`);

    // If the tab build directory is empty, build all tabs
    if (tabBuildDir.length === 0) {
      return getAllTabs()
        .reduce((prev, tabName) => ({
          ...prev,
          [tabName]: 'Tabs build directory is empty',
        }), {});
    }
  } catch (error) {
    // If the tab build directory doesn't exist, build all tabs
    if (error.code === 'ENOENT') {
      await fsPromises.mkdir(`${BUILD_PATH}/tabs`);
      return getAllTabs()
        .reduce((prev, tabName) => ({
          ...prev,
          [tabName]: 'Tabs build directory is missing',
        }), {});
    }
    throw error;
  }

  const tabNames = {} as { [name: string]: string };

  // If tab was specified to be rebuilt, then rebuild
  if (opts.tabs) {
    const optsTabs = typeof opts.tabs === 'string' ? [opts.tabs] : opts.tabs;
    const unknowns = checkForUnknowns(optsTabs, getAllTabs());

    if (unknowns.length > 0) throw new Error(`Unknown tabs: ${unknowns.join('\n')}`);
    optsTabs.forEach((tabName) => {
      tabNames[tabName] = 'Specified by --tab';
    });
  }

  if (bundles) {
  // Add tabs for bundles that we are rebuilding
    Object.keys(bundles)
      .forEach((bundleName) => {
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
  }

  return tabNames;
};

export const logTabStart = (toBuild: EntriesWithReasons, verbose?: boolean) => {
  const tabs = Object.entries(toBuild);

  if (tabs.length === 0) {
    return [chalk.greenBright('All tabs up to date')];
  }

  return [chalk.cyanBright('Building the following tabs:')].concat(tabs.map(([tab, reason]) => {
    if (verbose) return `• ${chalk.blueBright(tab)}: ${reason}`;
    return `• ${chalk.blueBright(tab)}`;
  }));
};

export const buildTab = async ({ db, buildTime, tabName }: Args): Promise<BuildLog> => {
  try {
    const startTime = performance.now();
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
    await rollupBundle.write({
      file: tabFile,
      format: 'iife',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDom',
      },
    });
    await rollupBundle.close();
    const { size } = await fsPromises.stat(tabFile);

    db.data.tabs[tabName] = buildTime;
    const endTime = performance.now();

    return {
      name: tabName,
      result: 'success',
      fileSize: size,
      elapsed: ((endTime - startTime) / 1000),
    };
  } catch (error) {
    return {
      name: tabName,
      fileSize: 0,
      elapsed: 0,
      result: 'error',
      error,
    };
  }
};

export const buildTabs = async (db: DBType, toBuild: EntriesWithReasons, buildTime: number): Promise<BuildResult> => {
  const tabPromises = Object.keys(toBuild)
    .map((tabName) => runWorker<BuildLog>(`${cjsDirname(import.meta.url)}/tabWorker.ts`, {
      db,
      buildTime,
      tabName,
    }));

  const buildResults = await Promise.all(tabPromises);
  const finalResult = buildResults.find(({ result }) => result === 'error') ? 'error' : 'success';

  return {
    result: finalResult,
    logs: buildResults,
  };
};

export const logTabResult = (tabResult: BuildResult) => {
  const tabLogs: string[] = [];

  if (tabResult.logs.length > 0) {
    if (tabResult.result === 'error') {
      tabLogs.push(`${chalk.cyanBright('Tabs finished with')} ${chalk.redBright('errors')}`);
    } else {
      tabLogs.push(`${chalk.cyanBright('Tabs finished')} ${chalk.greenBright('successfully')}`);
    }

    const tabsTable = new Table({
      columns: [
        {
          name: 'tab',
          title: 'Tab',
        },
        {
          name: 'result',
          title: 'Result',
        },
        {
          name: 'fileSize',
          title: 'File Size',
        },
        {
          name: 'elapsed',
          title: 'Elapsed (s)',
        },
        {
          name: 'error',
          title: 'Errors',
        },
      ],
    });

    tabResult.logs.forEach(({ result, name, fileSize, error, elapsed }) => tabsTable.addRow({
      tab: name,
      result: result === 'success' ? 'Success' : 'Error',
      fileSize: fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : '-',
      elapsed: elapsed?.toFixed(2) ?? '-',
      error: error ?? '-',
    }, { color: result === 'error' ? 'red' : 'green' }));
    tabLogs.push(tabsTable.render());
  }

  return tabLogs;
};

export const tabCommand = new Command('tabs')
  .option('-t, --t <...tabs>')
  .option('-f, --force')
  .option('-v, --verbose')
  .description('Build tabs')
  .action(async (opts) => {
    const db = await getDb();
    const tabs = await getTabs(db, opts);
    console.log(logTabStart(tabs, opts.verbose)
      .join('\n'));
    const buildTime = new Date()
      .getTime();
    const result = await buildTabs(db, tabs, buildTime);

    console.log(logTabResult(result)
      .join('\n'));

    await db.write();
    await copy();
  });
