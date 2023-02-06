import chalk from 'chalk';
import fs from 'fs/promises';
import { printList, wrapWithTimer } from '../../scriptUtils.js';
import { createBuildCommand, logResult, retrieveBundlesAndTabs, } from '../buildUtils.js';
import { logTscResults, runTsc } from '../prebuild/tsc.js';
import { initTypedoc, logTypedocTime } from './docUtils.js';
import drawdown from './drawdown.js';
const typeToName = (type, alt = 'unknown') => (type ? type.name : alt);
/**
 * Parsers to convert typedoc elements into strings
 */
const parsers = {
    Variable(element) {
        let desc;
        if (!element.comment)
            desc = 'No description available';
        else {
            desc = drawdown(element.comment.summary.map(({ text }) => text)
                .join(''));
        }
        return `<div><h4>${element.name}: ${typeToName(element.type)}</h4><div class="description">${desc}</div></div>`;
    },
    Function({ name: elementName, signatures: [signature] }) {
        // Form the parameter string for the function
        let paramStr;
        if (!signature.parameters)
            paramStr = '()';
        else {
            paramStr = `(${signature.parameters
                .map(({ type, name }) => {
                const typeStr = typeToName(type);
                return `${name}: ${typeStr}`;
            })
                .join(', ')})`;
        }
        const resultStr = typeToName(signature.type, 'void');
        let desc;
        if (!signature.comment)
            desc = 'No description available';
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
const buildJson = wrapWithTimer(async (bundle, moduleDocs, outDir) => {
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
                            severity: 'warn',
                            errors: [...errors, `Symbol '${decl.name}': Could not find parser for type ${decl.kindString}`],
                        }, decls];
                }
                return [{
                        severity,
                        errors,
                    }, {
                        ...decls,
                        [decl.name]: parser(decl),
                    }];
            }
            catch (error) {
                return [{
                        severity: 'warn',
                        errors: [...errors, `Could not parse declaration for ${decl.name}: ${error}`],
                    }];
            }
        }, [
            {
                severity: 'success',
                errors: [],
            },
            {},
        ]);
        let size;
        if (result) {
            const outFile = `${outDir}/jsons/${bundle}.json`;
            await fs.writeFile(outFile, JSON.stringify(result, null, 2));
            ({ size } = await fs.stat(outFile));
        }
        else {
            if (sevRes.severity !== 'error')
                sevRes.severity = 'warn';
            sevRes.errors.push(`No json generated for ${bundle}`);
        }
        const errorStr = sevRes.errors.length > 1 ? `${sevRes.errors[0]} +${sevRes.errors.length - 1}` : sevRes.errors[0];
        return {
            severity: sevRes.severity,
            fileSize: size,
            error: errorStr,
        };
    }
    catch (error) {
        return {
            severity: 'error',
            error,
        };
    }
});
/**
 * Build all specified jsons
 */
export const buildJsons = async (project, { outDir, bundles }) => {
    await fs.mkdir(`${outDir}/jsons`, { recursive: true });
    if (bundles.length === 1) {
        // If only 1 bundle is provided, typedoc's output is different in structure
        // So this new parser is used instead.
        const [bundle] = bundles;
        const { elapsed, result } = await buildJson(bundle, project, outDir);
        return [['json', bundle, {
                    ...result,
                    elapsed,
                }]];
    }
    return Promise.all(bundles.map(async (bundle) => {
        const { elapsed, result } = await buildJson(bundle, project.getChildByName(bundle), outDir);
        return ['json', bundle, {
                ...result,
                elapsed,
            }];
    }));
};
/**
 * Console command for building jsons
 */
const jsonCommand = createBuildCommand('jsons', false)
    .option('--no-tsc', 'Don\'t run tsc before building')
    .argument('[modules...]', 'Manually specify which modules to build jsons for', null)
    .action(async (modules, { manifest, srcDir, outDir, verbose, tsc }) => {
    const { bundles } = await retrieveBundlesAndTabs(manifest, modules, [], false);
    if (bundles.length === 0)
        return;
    if (tsc) {
        const tscResult = await runTsc(srcDir, {
            bundles,
            tabs: [],
        });
        logTscResults(tscResult, srcDir);
        if (tscResult.result.severity === 'error')
            return;
    }
    const { elapsed: typedocTime, result: [, project] } = await initTypedoc({
        bundles,
        srcDir,
        verbose,
    });
    logTypedocTime(typedocTime);
    printList(chalk.magentaBright('Building jsons for the following modules:\n'), bundles);
    const jsonResults = await buildJsons(project, {
        bundles,
        outDir,
    });
    logResult(jsonResults, verbose);
})
    .description('Build only jsons');
export default jsonCommand;
