import chalk from 'chalk';
import { Command } from 'commander';
import { Table } from 'console-table-printer';
import fs, { promises as fsPromises } from 'fs';

import { BUILD_PATH, SOURCE_PATH } from '../../constants';
import { modules as manifest, wrapWithTimer } from '../../utilities';
import { BuildLog, checkForUnknowns, DBType, EntriesWithReasons, getDb, isFolderModified } from '../buildUtils';
import copy from '../misc';

import drawdown from './drawdown';
import { DocsProject, initTypedoc } from './utils';


type JSONBuildLog = {
  result: 'error' | 'success' | 'warn'
} & Omit<BuildLog, 'result'>;

type JSONBuildResult = {
  result: 'success' | 'error' | 'warn'
  error?: any;
  logs: JSONBuildLog[];
};

type JSONCommandOpts = {
  force?: boolean;
  bundles?: string | string[];
};

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

export const getJsonsToBuild = async (db: DBType, opts: JSONCommandOpts, bundles?: EntriesWithReasons): Promise<EntriesWithReasons> => {
  const bundleNames = Object.keys(manifest);
  const bundleNamesWithReason = (reason: string, names: string[] = null) => (names ?? bundleNames).reduce((prev, bundle) => ({
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

  const output = {} as EntriesWithReasons;

  if (bundles) {
    Object.keys(bundles)
      .forEach((bundle) => {
        if (!output[bundle]) output[bundle] = `${bundle} is being rebuilt`;
      });
  }

  bundleNames.forEach((bundleName) => {
    if (output[bundleName]) return;

    if (!fs.existsSync(`${BUILD_PATH}/jsons/${bundleName}.json`)) {
      output[bundleName] = 'JSON missing from JSONS build directory';
      return;
    }

    const timestamp = db.data.jsons[bundleName];
    if (!timestamp || isFolderModified(`${SOURCE_PATH}/bundles/${bundleName}`, timestamp)) {
      output[bundleName] = 'Outdated Build';
    }
  }, {});

  return output;
};

export const logJsonStart = (jsons: EntriesWithReasons, verbose?: boolean) => {
  const jsonsWithReasons = Object.entries(jsons);

  if (jsonsWithReasons.length === 0) {
    return [chalk.greenBright('All JSONS up to date')];
  }

  return [chalk.cyanBright('Building JSON documentation for:')].concat(jsonsWithReasons.map(([bundle, reason]) => {
    if (verbose) return `• ${chalk.blueBright(bundle)}: ${reason}`;
    return `• ${chalk.blueBright(bundle)}`;
  }));
};

export const buildJson = wrapWithTimer(async (parsedJSON: any, bundle: string): Promise<JSONBuildLog> => {
  const warnLogs: string[] = [];

  let status: JSONBuildLog['result'] = 'success';
  let fileSize: number | undefined;
  const warner = (msg: string) => {
    status = 'warn';
    return warnLogs.push(msg);
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
      const jsonFile = `${BUILD_PATH}/jsons/${bundle}.json`;
      await fsPromises.writeFile(
        jsonFile,
        JSON.stringify(output, null, 2),
      );

      ({ size: fileSize } = await fsPromises.stat(jsonFile));
    }

    let warnString: string | null;
    if (warnLogs.length === 0) warnString = null;
    else if (warnLogs.length > 1) warnString = `${warnLogs[0]} +${warnLogs.length - 1}`;
    else warnString = warnLogs[0];

    return {
      name: bundle,
      result: status,
      fileSize,
      error: warnString,
    };
  } catch (error) {
    return {
      name: bundle,
      result: 'error',
      error,
    };
  }
});

export const buildJsons = async (
  db: DBType,
  {
    buildTime,
    app,
    project,
  }: DocsProject,
  toBuild: EntriesWithReasons,
): Promise<JSONBuildResult> => {
  const bundles = Object.keys(toBuild);

  if (bundles.length === 0) {
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

    const wrapper = async (bundle: string) => {
      const { elapsed, result } = await buildJson(parsedJSON, bundle);

      if (result.result !== 'error') db.data.jsons[bundle] = buildTime;

      return {
        ...result,
        elapsed,
      };
    };

    const jsonResults = await Promise.all(bundles.map((bundle) => wrapper(bundle)));

    const finalStatus = jsonResults.reduce((out, { result }) => {
      if (out === 'error' || result === 'error') return 'error';
      if (result === 'warn') return 'warn';
      return out;
    }, 'success' as JSONBuildResult['result']);

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
};

export const logJsonResult = (jsonsResult: JSONBuildResult) => {
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
      elapsed: elapsed < 0.01 ? '<0.00' : elapsed.toFixed(2),
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
  return jsonLogs;
};

export const jsonCommand = new Command('jsons')
  .option('-f, --force')
  .option('-v, --verbose')
  .option('-b, --bundles <...bundles>')
  .description(chalk.greenBright('Build jsons only'))
  .action(async (opts) => {
    const db = await getDb();
    const toBuild = await getJsonsToBuild(db, opts);
    console.log(logJsonStart(toBuild, opts.verbose)
      .join('\n'));

    const project = initTypedoc();
    const result = await buildJsons(db, project, toBuild);
    console.log(logJsonResult(result)
      .join('\n'));

    await db.write();
    await copy();
  });
