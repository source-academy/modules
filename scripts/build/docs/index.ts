import fs, { promises as fsPromises } from 'fs';
import * as typedoc from 'typedoc';
import chalk from 'chalk';
import drawdown from './drawdown';
import {
  isFolderModified,
  getDb,
  DBType,
  checkForUnknowns,
  EntryWithReason,
  Opts,
} from '../buildUtils';
import { cjsDirname, modules as manifest } from '../../utilities';
import { BUILD_PATH, SOURCE_PATH } from '../../constants';
import type { Low } from 'lowdb/lib';

const warner = (msg: string, bundle: string) => console.log(`${chalk.yellow('Warning:')} ${bundle}: ${msg}`);

/**
 * Convert each element type (e.g. variable, function) to its respective HTML docstring
 * to be displayed to users
 */
const parsers: {
  [name: string]: (element: any, bundle: string) => {
    header: string;
    desc: string;
  }
} = {
  Variable(element, bundle) {
    const getDesc = () => {
      try {
        const { comment: { summary: [{ text }] } } = element;
        return drawdown(text);
      } catch (_error) {
        warner(`Could not get description for ${element.name}`, bundle);
        return element.name;
      }
    };

    if (!element.type?.name) {
      warner(`Could not determine type for ${element.name}`, bundle);
    }

    return {
      header: `${element.name}: ${element.type.name || 'unknown'}`,
      desc: getDesc(),
    };
  },
  Function(element, bundle) {
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
        console.warn(
          `${chalk.yellow('Warning:')} ${bundle}: Could not get description for ${
            element.name
          }`,
        );
        return element.name;
      }
    };

    return {
      header: getHeader(),
      desc: getDesc(),
    };
  },
};

type JsonOpts = {
  force?: boolean;
  jsons: string[];
};

/**
 * Determine which json files to build
 */
export const getJsonsToBuild = async (db: Low<DBType>, opts: JsonOpts): Promise<EntryWithReason[]> => {
  const bundleNames = Object.keys(manifest);

  try {
    const docsDir = await fsPromises.readdir(`${BUILD_PATH}/jsons`);
    if (docsDir.length === 0) return bundleNames.map((bundleName) => [bundleName, 'JSONs build directory empty']);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fsPromises.mkdir(`${BUILD_PATH}/jsons`);
      return bundleNames.map((bundleName) => [bundleName, 'JSONs build directory missing']);
    }
    throw error;
  }

  if (opts.force) {
    return bundleNames.map((bundleName) => [bundleName, '--force specified']);
  }

  if (opts.jsons) {
    const unknowns = checkForUnknowns(opts.jsons, bundleNames);
    if (unknowns.length > 0) throw new Error(`Unknown modules: ${unknowns.join(', ')}`);

    return opts.jsons.map((bundleName) => [bundleName, 'Specified by --module']);
  }

  return bundleNames.map((bundleName) => {
    if (!fs.existsSync(`${BUILD_PATH}/jsons/${bundleName}.json`)) {
      return [bundleName, 'JSON missing from JSONS build directory'];
    }

    const timestamp = db.data.jsons[bundleName];
    if (!timestamp || isFolderModified(`${SOURCE_PATH}/bundles/${bundleName}`, timestamp)) {
      return [bundleName, 'Outdated build'];
    }

    return false;
  })
    .filter((x) => x !== false) as EntryWithReason[];
};

export const buildDocsAndJsons = async (db: Low<DBType>, bundlesWithReason: EntryWithReason[], verbose: boolean) => {
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
  });

  const project = app.convert();
  if (!project) throw new Error('Failed to initialize Typedoc project');

  const docsTask = (async () => {
    await app.generateDocs(project, `${BUILD_PATH}/documentation`);

    // For some reason typedoc's not working, so do a manual copy
    await fsPromises.copyFile(
      `${cjsDirname(import.meta.url)}/README.md`,
      `${BUILD_PATH}/documentation/README.md`,
    );
    db.data.docs = new Date()
      .getTime();
  })();

  const jsonTask = (async () => {
    if (bundlesWithReason.length === 0) {
      console.log(chalk.greenBright('No jsons to build.'));
      return;
    }
    console.log(
      chalk.greenBright('Building documentation for the following bundles:'),
    );

    if (verbose) {
      console.log(
        bundlesWithReason.map(([bundle, reason]) => `• ${chalk.blueBright(bundle)}: ${reason}`)
          .join('\n'),
      );
    } else {
      console.log(bundlesWithReason.map(([bundle]) => `• ${chalk.blueBright(bundle)}`)
        .join('\n'));
    }
    await app.generateJson(project, `${BUILD_PATH}/docs.json`);

    const bundleNames = bundlesWithReason.map(([bundle]) => bundle);
    const buildTime = new Date()
      .getTime();

    const docsFile = await fsPromises.readFile(`${BUILD_PATH}/docs.json`, 'utf-8');
    const parsedJSON = JSON.parse(docsFile)?.children;

    if (!parsedJSON) {
      throw new Error('Failed to parse docs.json');
    }

    await Promise.all(
      bundleNames.map(async (bundle) => {
        const docs = parsedJSON.find((x) => x.name === bundle)?.children;

        if (!docs) {
          console.warn(
            `${chalk.yellow('Warning:')} No documentation found for ${bundle}`,
          );
        } else {
        // Run through each item in the bundle and run its parser
          const output: { [name: string]: string } = {};
          docs.forEach((element) => {
            if (parsers[element.kindString]) {
              const { header, desc } = parsers[element.kindString](element, bundle);
              output[element.name] = `<div><h4>${header}</h4><div class="description">${desc}</div></div>`;
            } else {
              console.warn(
                `${chalk.yellow('Warning:')} ${bundle}: No parser found for ${
                  element.name
                } of type ${element.type}`,
              );
            }
          });

          // Then write that output to the bundles' respective json files
          await fsPromises.writeFile(
            `${BUILD_PATH}/jsons/${bundle}.json`,
            JSON.stringify(output, null, 2),
          );
        }

        db.data.jsons[bundle] = buildTime;
      }),
    );
  })();

  await Promise.all([docsTask, jsonTask]);
  await db.write();
};

/**
 * Build both JSONS and HTML documentation
 */
export default async ({ verbose, jsons, force }: Opts) => {
  const db = await getDb();
  const jsonsToBuild = await getJsonsToBuild(db, {
    jsons,
    force,
  });

  await buildDocsAndJsons(db, jsonsToBuild, verbose);
};
