import { Command } from 'commander';
import fs from 'fs/promises';
import type {
  DeclarationReflection,
  IntrinsicType,
  ProjectReflection,
  ReferenceType,
  SomeType,
} from 'typedoc';

import { wrapWithTimer } from '../../scriptUtils.js';
import {
  createBuildLogger,
  retrieveBundlesAndTabs,
} from '../buildUtils.js';
import { reduceModuleResults } from '../modules/index.js';
import type { BuildOverallResult, BuildResult, CommandInputs, Severity } from '../types';

import { initTypedoc, logTypedocTime } from './docUtils.js';
import drawdown from './drawdown.js';

const typeToName = (type?: SomeType, alt : string = 'unknown') => (type ? (type as ReferenceType | IntrinsicType).name : alt);

/**
 * Parsers to convert typedoc elements into strings
 */
const parsers: Record<string, (docs: DeclarationReflection) => string> = {
  Variable(element) {
    let desc: string;
    if (!element.comment) desc = 'No description available';
    else {
      desc = drawdown(element.comment.summary.map(({ text }) => text)
        .join(''));
    }
    return `<div><h4>${element.name}: ${typeToName(element.type)}</h4><div class="description">${desc}</div></div>`;
  },
  Function({ name: elementName, signatures: [signature] }) {
    // Form the parameter string for the function
    let paramStr: string;
    if (!signature.parameters) paramStr = '()';
    else {
      paramStr = `(${signature.parameters
        .map(({ type, name }) => {
          const typeStr = typeToName(type);
          return `${name}: ${typeStr}`;
        })
        .join(', ')})`;
    }
    const resultStr = typeToName(signature.type, 'void');
    let desc: string;
    if (!signature.comment) desc = 'No description available';
    else {
      desc = drawdown(signature.comment.summary.map(({ text }) => text)
        .join(''));
    }
    const header = `${elementName}${paramStr} → {${resultStr}}`;
    return `<div><h4>${header}</h4><div class="description">${desc}</div></div>`;
  },
};

/**
 * Build a single json
 */
export const buildJson = wrapWithTimer(async (
  bundle: string,
  moduleDocs: DeclarationReflection | undefined,
  outDir: string,
): Promise<BuildResult> => {
  try {
    if (!moduleDocs) {
      return {
        severity: 'error',
        error: `Could not find generated docs for ${bundle}`,
      };
    }

    const [sevRes, result] = moduleDocs.children.reduce(([{ severity, errors }, decls], decl) => {
      try {
        const parser = parsers[decl.kindString];
        if (!parser) {
          return [{
            severity: 'warn' as Severity,
            errors: [...errors, `${decl.name}: Could not find parser for type ${decl.kindString}`],
          }, decls];
        }

        return [{
          severity,
          errors,
        }, {
          ...decls,
          [decl.name]: parser(decl),
        }];
      } catch (error) {
        return [{
          severity: 'warn' as Severity,
          errors: [...errors, `Could not parse declaration for ${decl.name}: ${error}`],
        }];
      }
    }, [
      {
        severity: 'success',
        errors: [],
      },
      {},
    ] as [
      {
        severity: Severity,
        errors: any[]
      },
      Record<string, string>,
      // Record<string, ({
      //   description: string;
      // } & ({
      //   kind: 'function',
      //   returnType: string;
      //   parameters: {
      //     name: string;
      //     type: string;
      //   }[],
      // } | {
      //   kind: 'variable',
      //   type: string;
      // }))>,
    ]);

    let size: number;
    if (result) {
      const outFile = `${outDir}/jsons/${bundle}.json`;
      await fs.writeFile(outFile, JSON.stringify(result, null, 2));
      ({ size } = await fs.stat(outFile));
    } else {
      if (sevRes.severity !== 'error') sevRes.severity = 'warn';
      sevRes.errors.push(`No json generated for ${bundle}`);
      size = 0;
    }

    const errorStr = sevRes.errors.length > 1 ? `${sevRes.errors[0]} +${sevRes.errors.length - 1}` : sevRes.errors[0];

    return {
      severity: sevRes.severity,
      fileSize: size,
      error: errorStr,
    };
  } catch (error) {
    return {
      severity: 'error',
      error,
    };
  }
});

type BuildJsonOpts = {
  bundles: string[];
  outDir: string;
};

type JsonCommandInputs = CommandInputs & {
  outDir: string;
};

/**
 * Build all specified jsons
 */
export const buildJsons = async (project: ProjectReflection, { outDir, bundles }: BuildJsonOpts): Promise<BuildOverallResult> => {
  await fs.mkdir(`${outDir}/jsons`, { recursive: true });
  if (bundles.length === 1) {
    // If only 1 bundle is provided, typedoc's output is different in structure
    // So this new parser is used instead.
    const [bundle] = bundles;
    const { elapsed, result } = await buildJson(bundle, project as any, outDir);
    return {
      results: {
        [bundle]: {
          ...result,
          elapsed,
        },
      },
      severity: result.severity,
      error: result.error,
    };
  }

  const results = await Promise.all(
    bundles.map(async (bundle) => {
      const { elapsed, result } = await buildJson(bundle, project.getChildByName(bundle) as DeclarationReflection, outDir);
      return [
        'jsons',
        bundle,
        {
          ...result,
          elapsed,
        },
      ] as ['jsons', string, BuildResult];
    }),
  );

  return reduceModuleResults(results).jsons;
};


/**
 * Log output from `buildJsons`
 * @see {buildJsons}
 */
export const logJsonResults = createBuildLogger('json');
// (jsonResults: Record<string, BuildResult> | false, verbose: boolean) => {
//   if (typeof jsonResults === 'boolean') return;

//   const entries = Object.entries(jsonResults);
//   if (entries.length === 0) return;

//   if (!verbose) {
//     const erroreds = entries.filter(([, { severity }]) => severity === 'error');
//     const warneds = entries.filter(([, { severity }]) => severity === 'warn');

//     if (erroreds.length === 0 && warneds.length === 0) {
//       console.log(chalk.greenBright('Successfully built all jsons!\n'));
//       return;
//     }

//     let errStr: string;
//     if (erroreds.length > 0) {
//       errStr = chalk.redBright('failed') + chalk.cyanBright('with errors');
//     } else {
//       errStr = chalk.yellowBright('succeeded with warnings');
//     }

//     console.log(chalk.cyanBright(`JSON building ${errStr}:\n${
//       erroreds.length > 0
//         ? `${chalk.redBright('Errors')}:\n${erroreds
//           .map(([bundle, { error }], i) => chalk.redBright(`${i + 1}. ${bundle}: ${error}`))
//           .join('\n')}\n`
//         : ''
//     }${warneds.length > 0
//       ? `${chalk.yellowBright('Warnings')}:\n${warneds
//         .map(([bundle, { error }], i) => chalk.yellowBright(`${i + 1}. ${bundle}: ${error}`))
//         .join('\n')}\n`
//       : ''
//     }\n`));

//     return;
//   }

//   const jsonTable = new Table({
//     columns: [
//       {
//         name: 'bundle',
//         title: 'Bundle',
//       },
//       {
//         name: 'jsonSeverity',
//         title: 'Status',
//       },
//       {
//         name: 'fileSize',
//         title: 'File Size',
//       },
//       {
//         name: 'jsonTime',
//         title: 'Build Time(s)',
//       },
//       {
//         name: 'jsonError',
//         title: 'Errors',
//       },
//     ],
//   });

//   let jsonSeverity: Severity = 'success';
//   entries.forEach(([moduleName, { elapsed, severity, error, fileSize }]) => {
//     if (severity === 'error') {
//       jsonSeverity = 'error';
//       jsonTable.addRow({
//         jsonSeverity: 'Error',
//         jsonTime: '-',
//         jsonError: error,
//         fileSize: '-',
//       }, { color: 'red' });
//     } else {
//       if (jsonSeverity === 'success' && severity === 'warn') jsonSeverity = 'warn';
//       const timeStr = elapsed < 10 ? '<0.01s' : `${divideAndRound(elapsed, 1000)}s`;

//       jsonTable.addRow({
//         bundle: moduleName,
//         jsonSeverity: severity === 'warn' ? 'Warning' : 'Success',
//         jsonTime: timeStr,
//         jsonError: error || '-',
//         fileSize: fileSizeFormatter(fileSize),
//       }, { color: severity === 'warn' ? 'yellow' : 'green' });
//     }
//   });

//   if (jsonSeverity === 'success') {
//     console.log(`${chalk.cyanBright('JSONS built')} ${chalk.greenBright('successfully')}:\n${jsonTable.render()}\n`);
//   } else if (jsonSeverity === 'warn') {
//     console.log(`${chalk.cyanBright('JSONS built with')} ${chalk.yellowBright('warnings')}:\n${jsonTable.render()}\n`);
//   } else {
//     console.log(`${chalk.cyanBright('JSONS failed with')} ${chalk.redBright('errors')}:\n${jsonTable.render()}\n`);
//   }
// });

/**
 * Console command for building jsons
 */
const jsonCommand = new Command('jsons')
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--outDir <outdir>', 'Source directory for files', 'build')
  .option('--manifest <file>', 'Manifest file', 'modules.json')
  .option('-v, --verbose', 'Display more information about the build results', false)
  .argument('[modules...]', 'Modules to build jsons for', null)
  .description('Build only jsons')
  .action(async (modules: string[] | null, opts: JsonCommandInputs) => {
    const { bundles } = await retrieveBundlesAndTabs(opts.manifest, modules, []);
    if (bundles.length === 0) return;

    const { elapsed: typedocTime, result: [, project] } = await initTypedoc({
      srcDir: opts.srcDir,
      bundles,
      verbose: opts.verbose,
    });

    logTypedocTime(typedocTime);
    const jsonResults = await buildJsons(project, {
      bundles,
      outDir: opts.outDir,
    });
    logJsonResults(jsonResults, opts.verbose);
  });

export default jsonCommand;
