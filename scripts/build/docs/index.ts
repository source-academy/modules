import { constants as fsConstants, promises as fs } from 'fs';
import * as typedoc from 'typedoc';
import chalk from 'chalk';
import drawdown from './drawdown';
import {
  isFolderModified,
  getDb,
  shouldBuildAll,
  BuildTask,
} from '../buildUtils';
import { cjsDirname, modules as manifest } from '../../utilities';
import { BUILD_PATH, SOURCE_PATH } from '../constants';

/**
 * Convert each element type (e.g. variable, function) to its respective HTML docstring
 * to be displayed to users
 */
const parsers: {
  [name: string]: (element: any, bundle: string) => string
} = {
  Variable(element, bundle) {
    let desc: string;
    if (element.comment && element.comment.shortText) {
      desc = drawdown(element.comment.shortText);
    } else {
      desc = element.name;
      console.warn(
        `${chalk.yellow('Warning:')} ${bundle}: No description found for ${
          element.name
        }`,
      );
    }

    const typeStr
      = element.type.name && element.type.name ? `:${element.type.name}` : '';

    return `<div><h4>${element.name}${typeStr}</h4><div class="description">${desc}</div></div>`;
  },
  Function(element, bundle) {
    if (!element.signatures || element.signatures[0] === undefined) {
      throw new Error(
        `Error: ${bundle}: Unable to find a signature for function ${element.name}!`,
      );
    }

    // In source all functions should only have one signature
    const signature = element.signatures[0];

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

    let desc: string;
    if (signature.comment && signature.comment.shortText) {
      desc = drawdown(signature.comment.shortText);
    } else {
      desc = element.name;
      console.warn(
        `${chalk.yellow('Warning:')} ${bundle}: No description found for ${
          element.name
        }`,
      );
    }

    return `<div><h4>${element.name}${paramStr} → {${resultStr}}</h4><div class="description">${desc}</div></div>`;
  },
};

/**
 * Build the json documentation for the specified modules
 */
export const buildJsons: BuildTask = async (db) => {
  const isBundleModifed = (bundle: string) => {
    const timestamp = db.data.jsons[bundle] ?? 0;
    return isFolderModified(`src/bundles/${bundle}`, timestamp);
  };

  const bundleNames = Object.keys(manifest);
  const filteredBundles = shouldBuildAll('jsons')
    ? bundleNames
    : bundleNames.filter(isBundleModifed);

  if (filteredBundles.length === 0) {
    console.log('Documentation up to date');
    return;
  }

  console.log(
    chalk.greenBright('Building documentation for the following bundles:'),
  );
  console.log(
    filteredBundles.map((bundle) => `• ${chalk.blueBright(bundle)}`)
      .join('\n'),
  );

  try {
    await fs.access('build/jsons', fsConstants.F_OK);
  } catch (_error) {
    await fs.mkdir('build/jsons');
  }

  const buildTime = new Date()
    .getTime();

  const docsFile = await fs.readFile('build/docs.json', 'utf-8');
  const parsedJSON = JSON.parse(docsFile).children;

  if (!parsedJSON) {
    throw new Error('Failed to parse docs.json');
  }

  const bundles: [string, any][] = Object.keys(manifest)
    .map((bundle) => {
      const moduleDocs = parsedJSON.find((x) => x.name === bundle);

      if (!moduleDocs || !moduleDocs.children) {
        console.warn(
          `${chalk.yellow('Warning:')} No documentation found for ${bundle}`,
        );
        return [bundle, undefined];
      }

      return [bundle, moduleDocs.children];
    });

  await Promise.all(
    bundles.map(async ([bundle, docs]) => {
      if (!docs) return;

      // Run through each item in the bundle and run its parser
      const output: { [name: string]: string } = {};
      docs.forEach((element: any) => {
        if (parsers[element.kindString]) {
          output[element.name] = parsers[element.kindString](element, bundle);
        } else {
          console.warn(
            `${chalk.yellow('Warning:')} ${bundle}: No parser found for ${
              element.name
            } of type ${element.type}`,
          );
        }
      });

      // Then write that output to the bundles' respective json files
      await fs.writeFile(
        `${BUILD_PATH}/jsons/${bundle}.json`,
        JSON.stringify(output, null, 2),
      );

      db.data.jsons[bundle] = buildTime
    }),
  );

  await db.write();
};

/**
 * Build the HTML documentation for all modules.\
 * \
 * TypeDoc always clears the directory after each build, so if you leave some modules out
 * their documentation won't be properly included. Hence all modules have to be built at
 * the same time.
 */
export const buildDocs: BuildTask = async (db) => {
  const app = new typedoc.Application();
  app.options.addReader(new typedoc.TSConfigReader());
  app.options.addReader(new typedoc.TypeDocReader());

  app.bootstrap({
    entryPoints: Object.keys(manifest)
      .map(
        (bundle) => `${SOURCE_PATH}/bundles/${bundle}/functions.ts`,
      ),
    tsconfig: 'src/tsconfig.json',
    theme: 'typedoc-modules-theme',
    excludeInternal: true,
    categorizeByGroup: true,
    name: 'Source Academy Modules',
  });

  const project = app.convert();
  if (project) {
    const docsTask = app.generateDocs(project, 'build/documentation');
    const jsonTask = app.generateJson(project, 'build/docs.json');
    await Promise.all([docsTask, jsonTask]);

    // For some reason typedoc's not working, so do a manual copy
    await fs.copyFile(
      `${cjsDirname(import.meta.url)}/README.md`,
      `${BUILD_PATH}/documentation/README.md`,
    );

    db.data.docs = new Date()
      .getTime()
    await db.write();
  }
};

/**
 * Build both JSONS and HTML documentation
 */
export default async () => {
  const db = await getDb();
  await buildDocs(db);
  await buildJsons(db);
};
