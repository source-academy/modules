import chalk from 'chalk';
import { Table } from 'console-table-printer';
import fs from 'fs/promises';
import { createBuildCommand, divideAndRound, fileSizeFormatter, wrapWithTimer, } from '../buildUtils';
import { initTypedoc, logTypedocTime } from './docUtils';
import drawdown from './drawdown';
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
const buildJson = wrapWithTimer(async (bundle, moduleDocs, buildOpts) => {
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
                            errors: [...errors, `Could not find parser for type ${decl.kindString}`],
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
            const outFile = `${buildOpts.outDir}/jsons/${bundle}.json`;
            await fs.writeFile(outFile, JSON.stringify(result, null, 2));
            ({ size } = await fs.stat(outFile));
        }
        else {
            if (sevRes.severity !== 'error')
                sevRes.severity = 'warn';
            sevRes.errors.push(`No json generated for ${bundle}`);
            size = 0;
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
export const buildJsons = wrapWithTimer(async (project, buildOpts) => {
    await fs.mkdir(`${buildOpts.outDir}/jsons`, { recursive: true });
    if (buildOpts.bundles.length === 1) {
        // If only 1 bundle is provided, typedoc's output is different in structure
        // So this new parser is used instead.
        const [bundle] = buildOpts.bundles;
        const result = await buildJson(bundle, project, buildOpts);
        return {
            [bundle]: result,
        };
    }
    const results = await Promise.all(buildOpts.bundles.map(async (bundle) => [bundle, await buildJson(bundle, project.getChildByName(bundle), buildOpts)]));
    return results.reduce((res, [bundle, result]) => ({
        ...res,
        [bundle]: result,
    }), {});
});
/**
 * Log output from `buildJsons`
 * @see {buildJsons}
 */
export const logJsonResults = (jsonResults) => {
    if (typeof jsonResults === 'boolean')
        return;
    const { elapsed: jsonTime, results } = jsonResults;
    const entries = Object.entries(results);
    if (entries.length === 0)
        return;
    const jsonTable = new Table({
        columns: [
            {
                name: 'bundle',
                title: 'Bundle',
            },
            {
                name: 'jsonSeverity',
                title: 'Status',
            },
            {
                name: 'fileSize',
                title: 'File Size',
            },
            {
                name: 'jsonTime',
                title: 'Build Time(s)',
            },
            {
                name: 'jsonError',
                title: 'Errors',
            },
        ],
    });
    let jsonSeverity = 'success';
    entries.forEach(([moduleName, { elapsed, result: { severity, error, fileSize } }]) => {
        if (severity === 'error') {
            jsonSeverity = 'error';
            jsonTable.addRow({
                jsonSeverity: 'Error',
                jsonTime: '-',
                jsonError: error,
                fileSize: '-',
            }, { color: 'red' });
        }
        else {
            if (jsonSeverity === 'success' && severity === 'warn')
                jsonSeverity = 'warn';
            jsonTable.addRow({
                bundle: moduleName,
                jsonSeverity: severity === 'warn' ? 'Warning' : 'Success',
                jsonTime: divideAndRound(elapsed, 1000, 2),
                jsonError: error || '-',
                fileSize: fileSizeFormatter(fileSize),
            }, { color: severity === 'warn' ? 'yellow' : 'green' });
        }
    });
    const jsonTimeStr = `${divideAndRound(jsonTime, 1000, 2)}s`;
    if (jsonSeverity === 'success') {
        console.log(`${chalk.cyanBright('JSONS built')} ${chalk.greenBright('successfully')} in ${jsonTimeStr}:\n${jsonTable.render()}\n`);
    }
    else if (jsonSeverity === 'warn') {
        console.log(`${chalk.cyanBright('JSONS built with')} ${chalk.yellowBright('warnings')} in ${jsonTimeStr}:\n${jsonTable.render()}\n`);
    }
    else {
        console.log(`${chalk.cyanBright('JSONS failed with')} ${chalk.redBright('errors')}:\n${jsonTable.render()}\n`);
    }
};
/**
 * Console command for building jsons
 */
const jsonCommand = createBuildCommand('jsons', async (buildOpts) => {
    if (buildOpts.bundles.length === 0)
        return;
    const { elapsed: typedocTime, result: [, project] } = await initTypedoc(buildOpts);
    logTypedocTime(typedocTime);
    const { elapsed: jsonTotalTime, result } = await buildJsons(project, buildOpts);
    logJsonResults({
        results: result,
        elapsed: jsonTotalTime,
    });
})
    .description('Build only jsons');
export default jsonCommand;
