import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import { build as esbuild } from 'esbuild';
import { promises as fs } from 'fs';
import pathlib from 'path';
import { createBuildCommand, logResult, retrieveBundlesAndTabs } from '../buildUtils.js';
import { esbuildOptions, requireCreator } from './moduleUtils.js';
/**
 * Imports that are provided at runtime
 */
const externals = {
    'react': '_react',
    'react-dom': 'ReactDOM',
};
const outputTab = async (tabName, text, outDir) => {
    try {
        const parsed = parse(text, { ecmaVersion: 6 });
        const declStatement = parsed.body[1];
        const newTab = {
            type: 'ExpressionStatement',
            expression: {
                type: 'FunctionExpression',
                params: Object.values(externals)
                    .map((name) => ({
                    type: 'Identifier',
                    name,
                })),
                body: {
                    type: 'BlockStatement',
                    body: [
                        requireCreator(externals),
                        {
                            type: 'ReturnStatement',
                            argument: {
                                type: 'MemberExpression',
                                object: declStatement.declarations[0].init,
                                property: {
                                    type: 'Literal',
                                    value: 'default',
                                },
                                computed: true,
                            },
                        },
                    ],
                },
            },
        };
        let newCode = generate(newTab);
        if (newCode.endsWith(';'))
            newCode = newCode.slice(0, -1);
        const outFile = `${outDir}/tabs/${tabName}.js`;
        await fs.writeFile(outFile, newCode);
        const { size } = await fs.stat(outFile);
        return {
            severity: 'success',
            fileSize: size,
        };
    }
    catch (error) {
        return {
            severity: 'error',
            error,
        };
    }
};
export const buildTabs = async (tabs, opts) => {
    const { outputFiles } = await esbuild({
        ...esbuildOptions,
        entryPoints: tabs.map((tabName) => `${opts.srcDir}/tabs/${tabName}/index.tsx`),
        outbase: opts.outDir,
        outdir: opts.outDir,
        external: ['react', 'react-dom'],
    });
    return outputFiles;
};
export const reduceTabOutputFiles = (outputFiles, startTime, outDir) => Promise.all(outputFiles.map(async ({ path, text }) => {
    const [rawType, name] = path.split(pathlib.sep)
        .slice(-3, -1);
    if (rawType !== 'tabs') {
        throw new Error(`Expected only tabs, got ${rawType}`);
    }
    const result = await outputTab(name, text, outDir);
    return ['tab', name, {
            elapsed: performance.now() - startTime,
            ...result,
        }];
}));
const buildTabsCommand = createBuildCommand('tabs')
    .argument('[tabs...]', 'Manually specify which tabs to build', null)
    .description('Build only tabs')
    .action(async (tabs, opts) => {
    const assets = await retrieveBundlesAndTabs(opts.manifest, [], tabs);
    console.log(`${chalk.cyanBright('Building the following tabs:')}\n${assets.tabs.map((tabName, i) => `${i + 1}. ${tabName}`)
        .join('\n')}\n`);
    const startTime = performance.now();
    const results = await buildTabs(assets.tabs, opts);
    const reducedRes = await reduceTabOutputFiles(results, startTime, opts.outDir);
    logResult(reducedRes, opts.verbose);
});
export default buildTabsCommand;