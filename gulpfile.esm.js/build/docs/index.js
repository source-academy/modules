import fs from 'fs';
import gulp from 'gulp';
import typedoc from 'gulp-typedoc';
import chalk from 'chalk';
import drawdown from './drawdown';
import { isFolderModified, getDb, expandPath } from '../utilities';
import modules from '../../../modules.json';

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
        .map((param) => param.name)
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
export async function buildJsons() {
  const errHandler = (err) => {
    if (err) console.error(err);
  };

  if (!fs.existsSync('build/jsons')) fs.mkdirSync(`build/jsons`, {});

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
      } else {
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
      }

      fs.writeFile(
        `build/jsons/${bundle}.json`,
        JSON.stringify(output, null, 2),
        errHandler
      );
    }
    fs.rm('build/jsons/output', { recursive: true, force: true }, errHandler);
  });
}

export const buildDocs = async (db) => {
  const isBundleModifed = (bundle) => {
    if (process.argv[3] === '--force') return true;

    const timestamp = db.get(`bundles.${bundle}`).value() || 0;
    return isFolderModified(`src/bundles/${bundle}`, timestamp);
  };

  const bundleNames = Object.keys(modules).filter(isBundleModifed);
  if (bundleNames.length === 0) {
    console.log('Documentation up to date');
    return null;
  }

  console.log(
    chalk.greenBright('Building documentation for the following modules:')
  );
  console.log(
    bundleNames.map((bundle) => `• ${chalk.blueBright(bundle)}`).join('\n')
  );

  return gulp
    .src(
      bundleNames.map((bundle) => `src/bundles/${bundle}/functions.ts`),
      { allowEmpty: true }
    )
    .pipe(
      typedoc({
        out: 'build/documentation',
        json: 'build/docs.json',
        tsconfig: 'src/tsconfig.json',
        theme: 'typedoc-modules-theme',
        readme: `${expandPath()}/README.md`,
        excludeInternal: true,
        categorizeByGroup: true,
        name: 'Source Academy Modules',
      })
    );
};

export default async () => {
  const db = await getDb();
  await buildDocs(db);
  await buildJsons();
};
