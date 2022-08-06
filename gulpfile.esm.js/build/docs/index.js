import fs from 'fs';
import * as typedoc from 'typedoc';
import chalk from 'chalk';
import drawdown from './drawdown';
import {
  isFolderModified,
  getDb,
  cjsDirname,
  shouldBuildAll,
} from '../utilities';
import modules from '../../../modules.json';

/**
 * Convert each element type (e.g. variable, function) to its respective HTML docstring
 * to be displayed to users
 */
const parsers = {
  Variable: (element, bundle) => {
    let desc;
    if (element.comment && element.comment.shortText) {
      desc = drawdown(element.comment.shortText);
    } else {
      desc = element.name;
      console.warn(
        `${chalk.yellow('Warning:')} ${bundle}: No description found for ${
          element.name
        }`
      );
    }

    const typeStr =
      element.type.name && element.type.name ? `:${element.type.name}` : '';

    return `<div><h4>${element.name}${typeStr}</h4><div class="description">${desc}</div></div>`;
  },
  Function: (element, bundle) => {
    if (!element.signatures || element.signatures[0] === undefined)
      throw new Error(
        `Error: ${bundle}: Unable to find a signature for function ${element.name}!`
      );

    // In source all functions should only have one signature
    const signature = element.signatures[0];

    // Form the parameter string for the function
    let paramStr;
    if (!signature.parameters) paramStr = `()`;
    else
      paramStr = `(${signature.parameters
        .map((param) => {
          const typeStr = param.type ? param.type.name : 'unknown';
          return `${param.name}: ${typeStr}`;
        })
        .join(', ')})`;

    // Form the result representation for the function
    let resultStr;
    if (!signature.type) resultStr = `void`;
    else resultStr = signature.type.name;

    let desc;
    if (signature.comment && signature.comment.shortText) {
      desc = drawdown(signature.comment.shortText);
    } else {
      desc = element.name;
      console.warn(
        `${chalk.yellow('Warning:')} ${bundle}: No description found for ${
          element.name
        }`
      );
    }

    return `<div><h4>${element.name}${paramStr} → {${resultStr}}</h4><div class="description">${desc}</div></div>`;
  },
};

/**
 * Build the json documentation for the specified modules
 */
export const buildJsons = async (db) => {
  const isBundleModifed = (bundle) => {
    const timestamp = db.get(`docs.${bundle}`).value() || 0;
    return isFolderModified(`src/bundles/${bundle}`, timestamp);
  };

  const bundleNames = Object.keys(modules);
  const filteredBundles = shouldBuildAll('jsons')
    ? bundleNames
    : bundleNames.filter(isBundleModifed);

  if (filteredBundles.length === 0) {
    console.log('Documentation up to date');
    return;
  }

  console.log(
    chalk.greenBright('Building documentation for the following bundles:')
  );
  console.log(
    filteredBundles.map((bundle) => `• ${chalk.blueBright(bundle)}`).join('\n')
  );

  const errHandler = (err) => {
    if (err) console.error(err);
  };

  if (!fs.existsSync('build/jsons')) fs.mkdirSync(`build/jsons`, {});

  const buildTime = new Date().getTime();

  // Read from the TypeDoc output and retrieve the JSON relevant to the each module
  fs.readFile('build/docs.json', 'utf-8', (err, data) => {
    if (err) throw err;

    const parsedJSON = JSON.parse(data).children;

    if (!parsedJSON) {
      throw new Error('Failed to parse docs.json');
    }

    const bundles = Object.keys(modules);

    for (const bundle of bundles) {
      const moduleDocs = parsedJSON.find((x) => x.name === bundle);

      const output = {};
      if (!moduleDocs || !moduleDocs.children) {
        console.warn(
          `${chalk.yellow('Warning:')} No documentation found for ${bundle}`
        );
        continue;
      }

      moduleDocs.children.forEach((element) => {
        if (parsers[element.kindString]) {
          output[element.name] = parsers[element.kindString](element, bundle);
        } else {
          console.warn(
            `${chalk.yellow('Warning:')} ${bundle}: No parser found for ${
              element.name
            } of type ${element.type}`
          );
        }
      });

      fs.writeFile(
        `build/jsons/${bundle}.json`,
        JSON.stringify(output, null, 2),
        (error) => {
          if (error) console.error(error);
          else {
            db.set(`docs.${bundle}`, buildTime).write();
          }
        }
      );
    }
    fs.rm('build/jsons/output', { recursive: true, force: true }, errHandler);
  });
};

/**
 * Build the HTML documentation for all modules.\
 * \
 * TypeDoc always clears the directory after each build, so if you leave some modules out
 * their documentation won't be properly included. Hence all modules have to be built at
 * the same time.
 */
export const buildDocs = async () => {
  const app = new typedoc.Application();
  app.options.addReader(new typedoc.TSConfigReader());
  app.options.addReader(new typedoc.TypeDocReader());

  app.bootstrap({
    entryPoints: Object.keys(modules).map(
      (bundle) => `src/bundles/${bundle}/functions.ts`
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
    fs.copyFileSync(
      `${cjsDirname()}/docs/README.md`,
      'build/documentation/README.md'
    );
  }
};

/**
 * Build both JSONS and HTML documentation
 */
export default async () => {
  await buildDocs();

  const db = await getDb();
  await buildJsons(db);
};
