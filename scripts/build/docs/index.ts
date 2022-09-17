import chalk from 'chalk';
import fs, { promises as fsPromises } from 'fs';
import type { Low } from 'lowdb/lib';
import * as typedoc from 'typedoc';

import { BUILD_PATH, SOURCE_PATH } from '../../constants';
import { cjsDirname, CommandInfo, createCommand, Logger, modules as manifest } from '../../utilities';
import {
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
  const logger = new Logger();

  if (!shouldBuildHTML) {
    if (opts.verbose) logger.log(chalk.yellow(`Not building HTML documentation: ${chalk.yellow(htmlReason)}`));
    else logger.log(chalk.yellow('Not building HTML documentation'));
  } else {
    // eslint-disable-next-line no-lonely-if
    if (opts.verbose) logger.log(chalk.cyanBright(`Building HTML documentation: ${chalk.yellow(htmlReason)}`));
    else logger.log(chalk.cyanBright('Building HTML documentation'));
  }

  logger.log('');

  const bundlesWithReason = Object.entries(toBuild);
  if (bundlesWithReason.length === 0) {
    logger.log(chalk.greenBright('No jsons to build.'));
  } else {
    logger.log(
      chalk.cyanBright('Building documentation for the following bundles:'),
    );

    if (opts.verbose) {
      bundlesWithReason.forEach(([bundle, reason]) => logger.log(`• ${chalk.blueBright(bundle)}: ${reason}`));
    } else {
      bundlesWithReason.forEach(([bundle]) => logger.log(`• ${chalk.blueBright(bundle)}`));
    }
  }
  return {
    toBuild,
    shouldBuildHTML,
    logs: logger.contents,
  };
};

type Config = {
  toBuild: EntriesWithReasons;
  shouldBuildHTML: boolean;
};

export const buildDocsAndJsons = async (db: Low<DBType>, { toBuild, shouldBuildHTML }: Config) => {
  const bundlesWithReason = Object.entries(toBuild);

  // If nothing needs to be built forego initializing typedoc
  if (!shouldBuildHTML && bundlesWithReason.length === 0) return [];

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
  if (!project) return [chalk.redBright('Docs Error: Failed to initialize Typedoc project')];

  const buildTime = new Date()
    .getTime();

  const docsTask = (async (): Promise<string[]> => {
    if (!shouldBuildHTML) return [];

    try {
      await app.generateDocs(project, `${BUILD_PATH}/documentation`);

      // For some reason typedoc's not working, so do a manual copy
      await fsPromises.copyFile(
        `${cjsDirname(import.meta.url)}/README.md`,
        `${BUILD_PATH}/documentation/README.md`,
      );
      db.data.html = buildTime;
      return [`${chalk.cyanBright('HTML Documentation built')} ${chalk.greenBright('succesfully')}`];
    } catch (error) {
      return [`${chalk.cyanBright('HTML Documentation')} ${chalk.redBright('errored:')} ${error}`];
    }
  })();

  const jsonTask = (async (): Promise<string[]> => {
    if (bundlesWithReason.length === 0) return [];

    const jsonsLogger = new Logger();

    try {
      await app.generateJson(project, `${BUILD_PATH}/docs.json`);

      const docsFile = await fsPromises.readFile(`${BUILD_PATH}/docs.json`, 'utf-8');
      const parsedJSON = JSON.parse(docsFile)?.children;

      if (!parsedJSON) {
        return [chalk.redBright('ERROR: Failed to parse docs.json')];
      }

      const jsonResults = await Promise.all(
        bundlesWithReason.map(async ([bundle]) => {
          const jsonLogger = new Logger();

          let status = 'success';
          const warner = (msg: string) => {
            status = 'warn';
            return jsonLogger.log(msg);
          };

          try {
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
              await fsPromises.writeFile(
                `${BUILD_PATH}/jsons/${bundle}.json`,
                JSON.stringify(output, null, 2),
              );
            }

            db.data.jsons[bundle] = buildTime;

            return {
              bundle,
              status,
              logs: jsonLogger.contents,
            };
          } catch (error) {
            return {
              bundle,
              status: 'error',
              logs: [`Error: ${error}`],
            };
          }
        }),
      );

      if (jsonResults.find(({ status }) => status === 'error')) jsonsLogger.log(`${chalk.cyanBright('Jsons finished with')} ${chalk.redBright('errors')}`);
      else if (jsonResults.find(({ status }) => status === 'warn')) jsonsLogger.log(`${chalk.cyanBright('Jsons finished with')} ${chalk.yellow('warnings')}`);
      else jsonsLogger.log(`${chalk.cyanBright('Jsons finished')} ${chalk.greenBright('successfully')}`);

      jsonResults.forEach(({ bundle, status, logs }) => {
        switch (status) {
          case 'error': {
            jsonsLogger.log(`• ${chalk.blueBright(bundle)} ${chalk.redBright('errored')}: ${logs[0]}`);
            break;
          }
          case 'warn': {
            jsonsLogger.log(`• ${chalk.blueBright(bundle)}: Built with ${chalk.yellow('warnings')}:`);
            logs.forEach((x) => jsonsLogger.log(`\t${x}`));
            break;
          }
          case 'success': {
            jsonsLogger.log(`• ${chalk.blueBright(bundle)}: Build ${chalk.greenBright('successful')}`);
            break;
          }
        }
      });

      return jsonsLogger.contents;
    } catch (error) {
      return [chalk.redBright(`JSON Task errored: ${error}`)];
    }
  })();

  const [docsResult, jsonsResult] = await Promise.all([docsTask, jsonTask]);
  await db.write();

  return [...docsResult, '', ...jsonsResult];
};

export default createCommand(commandInfo as CommandInfo,
  async (opts: DocsCommandOptions) => {
    const db = await getDb();
    const {
      logs: startLogs,
      ...docsBuildOpts
    } = await getDocsToBuild(db, opts);
    console.log(startLogs.join('\n'));

    const endLogs = await buildDocsAndJsons(db, docsBuildOpts);
    console.log(endLogs.join('\n'));
    await copy();
  });
