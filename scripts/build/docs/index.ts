import chalk from 'chalk';
import { Table } from 'console-table-printer';
import fs, { promises as fsPromises } from 'fs';
import type { Low } from 'lowdb/lib';
import { performance } from 'perf_hooks';
import * as typedoc from 'typedoc';

import { BUILD_PATH, SOURCE_PATH } from '../../constants';
import { cjsDirname, CommandInfo, createCommand, joinArrays, modules as manifest } from '../../utilities';
import {
  BuildLog,
  checkForUnknowns,
  DBType,
  EntriesWithReasons,
  getDb,
  isFolderModified,
} from '../buildUtils';
import copy from '../misc';

import commandInfo from './command.json' assert { type: 'json'};
import drawdown from './drawdown';


/**
 * Convert each element type (e.g. variable, function) to its respective HTML docstring
 * to be displayed to users
 */
const parsers: {
  [name: string]: (element: any, warner: (str: string) => void) => {
    header: string;
    desc: string;
  }
} = {
  Variable(element, warner) {
    const getDesc = () => {
      try {
        const { comment: { summary: [{ text }] } } = element;
        return drawdown(text);
      } catch (_error) {
        warner(`Could not get description for ${element.name}`);
        return element.name;
      }
    };

    if (!element.type?.name) {
      warner(`Could not determine type for ${element.name}`);
    }

    return {
      header: `${element.name}: ${element.type.name || 'unknown'}`,
      desc: getDesc(),
    };
  },
  Function(element, warner) {
    // In source all functions should only have one signature
    const { signatures: [signature] } = element;

    const getHeader = () => {
      // Form the parameter string for the function
      let paramStr: string;
      if (!signature.parameters) paramStr = '()';
      else {
        paramStr = `(${signature.parameters
          .map((param) => {
            const typeStr = param.type ? param.type.name : 'unknown';
            return `${param.name}: ${typeStr}`;
          })
          .join(', ')})`;
      }

      // Form the result representation for the function
      const resultStr = !signature.type ? 'void' : signature.type.name;

      return `${element.name}${paramStr} → {${resultStr}}`;
    };

    const getDesc = () => {
      try {
        const { comment: { summary: [{ text }] } } = signature;
        return drawdown(text);
      } catch (_error) {
        warner(`Could not get description for ${element.name}`);
        return element.name;
      }
    };

    return {
      header: getHeader(),
      desc: getDesc(),
    };
  },
};

type DocsCommandOptions = Partial<{
  bundles: string | string[];
  html: boolean;
  verbose: boolean;
  force: boolean;
}>;

/**
 * Determine which json files to build
 */
export const getDocsToBuild = async (db: Low<DBType>, opts: DocsCommandOptions) => {
  const getJsons = async () => {
    const bundleNames = Object.keys(manifest);
    const bundleNamesWithReason = (reason: string, names?: string[]) => (names ?? bundleNames).reduce((prev, bundle) => ({
      ...prev,
      [bundle]: reason,
    }), {});

    try {
      const docsDir = await fsPromises.readdir(`${BUILD_PATH}/jsons`);
      if (docsDir.length === 0) {
        return bundleNamesWithReason('JSONs build directory empty');
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fsPromises.mkdir(`${BUILD_PATH}/jsons`);
        return bundleNamesWithReason('JSONs build directory missing');
      }
      throw error;
    }

    if (opts.force) {
      return bundleNamesWithReason('--force specified');
    }

    if (opts.bundles) {
      const optsBundles = typeof opts.bundles === 'string' ? [opts.bundles] : opts.bundles;
      const unknowns = checkForUnknowns(optsBundles, bundleNames);
      if (unknowns.length > 0) throw new Error(`Unknown modules: ${unknowns.join(', ')}`);

      return bundleNamesWithReason('Specified by --module', optsBundles);
    }

    return bundleNames.reduce((prev, bundleName) => {
      if (!fs.existsSync(`${BUILD_PATH}/jsons/${bundleName}.json`)) {
        return {
          ...prev,
          [bundleName]: 'JSON missing from JSONS build directory',
        };
      }

      const timestamp = db.data.jsons[bundleName];
      if (!timestamp || isFolderModified(`${SOURCE_PATH}/bundles/${bundleName}`, timestamp)) {
        return {
          ...prev,
          [bundleName]: 'Outdated build',
        };
      }

      return prev;
    }, {});
  };

  const toBuild = await getJsons() as EntriesWithReasons;

  const getHtml = async (): Promise<[boolean, string]> => {
    if (opts.force) return [true, '--force specified'];

    if (Object.keys(manifest)
      .find((moduleName) => isFolderModified(`${SOURCE_PATH}/bundles/${moduleName}`, db.data.html))) {
      return opts.html ? [true, 'Modified bundles present'] : [false, '--no-html specified'];
    }

    try {
      const dir = await fsPromises.readdir(`${BUILD_PATH}/documentation`);
      if (dir.length === 0) return [true, 'HTML Build directory empty'];
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      return [true, 'HTML Build directory missing'];
    }

    return [false, 'HTML Documentation rebuild not required'];
  };

  const [shouldBuildHTML, htmlReason] = await getHtml();
  const logs: string[] = [];

  if (!shouldBuildHTML) {
    if (opts.verbose) logs.push(chalk.yellow(`Not building HTML documentation: ${chalk.yellow(htmlReason)}`));
    else logs.push(chalk.yellow('Not building HTML documentation'));
  } else {
    // eslint-disable-next-line no-lonely-if
    if (opts.verbose) logs.push(chalk.cyanBright(`Building HTML documentation: ${chalk.yellow(htmlReason)}`));
    else logs.push(chalk.cyanBright('Building HTML documentation'));
  }

  logs.push('');

  const bundlesWithReason = Object.entries(toBuild);
  if (bundlesWithReason.length === 0) {
    logs.push(chalk.greenBright('No jsons to build.'));
  } else {
    logs.push(
      chalk.cyanBright('Building documentation for the following bundles:'),
    );

    if (opts.verbose) {
      bundlesWithReason.forEach(([bundle, reason]) => logs.push(`• ${chalk.blueBright(bundle)}: ${reason}`));
    } else {
      bundlesWithReason.forEach(([bundle]) => logs.push(`• ${chalk.blueBright(bundle)}`));
    }
  }
  return {
    toBuild,
    shouldBuildHTML,
    logs,
  };
};

type Config = {
  toBuild: EntriesWithReasons;
  shouldBuildHTML: boolean;
};

type JSONBuildLog = {
  result: 'error' | 'success' | 'warn'
} & Omit<BuildLog, 'result'>;

type JSONBuildResult = {
  result: 'success' | 'error' | 'warn'
  error?: any;
  logs: JSONBuildLog[];
};

type DocsResult = {
  result: 'error' | 'success'
  error?: any
};

export const buildDocsAndJsons = async (db: Low<DBType>, { toBuild, shouldBuildHTML }: Config): Promise<{
  docs: DocsResult | null,
  jsons: JSONBuildResult,
} | null> => {
  const bundlesWithReason = Object.entries(toBuild);

  // If nothing needs to be built forego initializing typedoc
  if (!shouldBuildHTML && bundlesWithReason.length === 0) {
    return null;
  }

  const app = new typedoc.Application();
  app.options.addReader(new typedoc.TSConfigReader());
  app.options.addReader(new typedoc.TypeDocReader());

  app.bootstrap({
    entryPoints: Object.keys(manifest)
      .map(
        (bundle) => `${SOURCE_PATH}/bundles/${bundle}/functions.ts`,
      ),
    tsconfig: 'src/tsconfig.json',
    theme: 'default',
    excludeInternal: true,
    categorizeByGroup: true,
    name: 'Source Academy Modules',
    logger: 'none',
  });

  const project = app.convert();
  if (!project) {
    throw new Error('Docs Error: Failed to initialize Typedoc project');
  }

  const buildTime = new Date()
    .getTime();

  const docsTask = (async (): Promise<DocsResult | null> => {
    if (!shouldBuildHTML) return null;

    try {
      await app.generateDocs(project, `${BUILD_PATH}/documentation`);

      // For some reason typedoc's not working, so do a manual copy
      await fsPromises.copyFile(
        `${cjsDirname(import.meta.url)}/README.md`,
        `${BUILD_PATH}/documentation/README.md`,
      );
      db.data.html = buildTime;
      return {
        result: 'success',
      };
    } catch (error) {
      return {
        result: 'error',
        error,
      };
    }
  })();

  const jsonTask = (async (): Promise<JSONBuildResult> => {
    if (bundlesWithReason.length === 0) {
      return {
        result: 'success',
        logs: [],
      };
    }

    try {
      await app.generateJson(project, `${BUILD_PATH}/docs.json`);

      const docsFile = await fsPromises.readFile(`${BUILD_PATH}/docs.json`, 'utf-8');
      const parsedJSON = JSON.parse(docsFile)?.children;

      if (!parsedJSON) {
        return {
          result: 'error',
          logs: [],
          error: 'Failed to parse docs.json',
        };
      }

      const jsonResults = await Promise.all(
        bundlesWithReason.map(async ([bundle]): Promise<JSONBuildLog> => {
          const warnLogs: string[] = [];

          let status: JSONBuildLog['result'] = 'success';
          let fileSize: number | undefined;
          const warner = (msg: string) => {
            status = 'warn';
            return warnLogs.push(msg);
          };

          try {
            const startTime = performance.now();
            const docs = parsedJSON.find((x) => x.name === bundle)?.children;

            if (!docs) {
              warner('No documentation found for bundle');
            } else {
            // Run through each item in the bundle and run its parser
              const output: { [name: string]: string } = {};
              docs.forEach((element) => {
                if (parsers[element.kindString]) {
                  const { header, desc } = parsers[element.kindString](element, warner);
                  output[element.name] = `<div><h4>${header}</h4><div class="description">${desc}</div></div>`;
                } else {
                  warner(`No parser found for ${element.name} of type ${element.type}`);
                }
              });

              // Then write that output to the bundles' respective json files
              const jsonFile = `${BUILD_PATH}/jsons/${bundle}.json`;
              await fsPromises.writeFile(
                jsonFile,
                JSON.stringify(output, null, 2),
              );

              ({ size: fileSize } = await fsPromises.stat(jsonFile));
            }

            db.data.jsons[bundle] = buildTime;

            const endTime = performance.now();

            let warnString: string | null;
            if (warnLogs.length === 0) warnString = null;
            else if (warnLogs.length > 1) warnString = `${warnLogs[0]} +${warnLogs.length - 1}`;
            else warnString = warnLogs[0];

            return {
              name: bundle,
              result: status,
              fileSize,
              elapsed: (endTime - startTime) / 1000,
              error: warnString,
            };
          } catch (error) {
            return {
              name: bundle,
              result: 'error',
              error,
            };
          }
        }),
      );

      let finalStatus: JSONBuildResult['result'];
      if (jsonResults.find(({ result }) => result === 'error')) finalStatus = 'error';
      else if (jsonResults.find(({ result }) => result === 'warn')) finalStatus = 'warn';
      else finalStatus = 'success';

      return {
        result: finalStatus,
        logs: jsonResults,

      };
    } catch (error) {
      return {
        result: 'error',
        error,
        logs: [],
      };
    }
  })();

  const [docsResult, jsonsResult] = await Promise.all([docsTask, jsonTask]);
  await db.write();
  return {
    docs: docsResult,
    jsons: jsonsResult,
  };
};

export const logResultDocs = ({ docs: docsResult, jsons: jsonsResult }: {
  docs: DocsResult | null
  jsons: JSONBuildResult
}) => {
  const docsLogs: string[] = [];
  if (docsResult) {
    if (docsResult.error) docsLogs.push(`${chalk.cyanBright('HTML documentation finished with')} ${chalk.redBright('errors')}`);
    else docsLogs.push(`${chalk.cyanBright('HTML documentation built')} ${chalk.greenBright('successfully')}`);
  }

  const jsonLogs: string[] = [];

  if (jsonsResult.error) {
    jsonLogs.push(`${chalk.redBright('JSONS errored:')} ${jsonsResult.error}`);
  }

  if (jsonsResult.logs.length > 0) {
    jsonLogs.push('\n');
    switch (jsonsResult.result) {
      case 'error': {
        jsonLogs.push(`${chalk.cyanBright('JSONS built with')} ${chalk.redBright('errors')}`);
        break;
      }
      case 'warn': {
        jsonLogs.push(`${chalk.cyanBright('JSONS built with')} ${chalk.yellow('warnings')}`);
        break;
      }
      case 'success': {
        jsonLogs.push(`${chalk.cyanBright('JSONS built')} ${chalk.greenBright('successfully')}`);
        break;
      }
    }

    const resultTable = new Table({
      columns: [
        {
          name: 'bundle',
          title: 'Bundle',
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
          title: 'Error',
        },
      ],
    });
    jsonsResult.logs.forEach(({ name, fileSize, elapsed, result, error }) => resultTable.addRow({
      bundle: name,
      result,
      fileSize: isNaN(fileSize) ? '-' : `${(fileSize / 1024).toFixed(2)} KB`,
      elapsed: elapsed < 0.01 ? '>0.00' : elapsed.toFixed(2),
      error: error || '-',
    }, {
      color: {
        error: 'red',
        warn: 'yellow',
        success: 'green',
      }[result],
    }));

    jsonLogs.push(resultTable.render());
  }

  return joinArrays('', docsLogs, jsonLogs);
};

export default createCommand(commandInfo as CommandInfo,
  async (opts: DocsCommandOptions) => {
    const db = await getDb();
    const {
      logs: startLogs,
      ...docsBuildOpts
    } = await getDocsToBuild(db, opts);

    if (startLogs.length > 0) console.log(`${startLogs.join('\n')}\n`);

    const endLogs = await buildDocsAndJsons(db, docsBuildOpts);
    console.log(logResultDocs(endLogs)
      .join('\n'));
    await copy();
  });
