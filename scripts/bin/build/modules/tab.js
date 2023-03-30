import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import { build as esbuild, } from 'esbuild';
import fs from 'fs/promises';
import pathlib from 'path';
import { printList } from '../../scriptUtils.js';
import { copyManifest, createBuildCommand, exitOnError, logResult, retrieveTabs, tabNameExpander, } from '../buildUtils.js';
import { prebuild } from '../prebuild/index.js';
import { esbuildOptions } from './moduleUtils.js';
const outputTab = async (tabName, text, outDir) => {
    try {
        const parsed = parse(text, { ecmaVersion: 6 });
        const declStatement = parsed.body[1];
        const newTab = {
            type: 'ArrowFunctionExpression',
            body: {
                type: 'MemberExpression',
                object: declStatement.declarations[0].init,
                property: {
                    type: 'Literal',
                    value: 'default',
                },
                computed: true,
            },
            params: [{
                    type: 'Identifier',
                    name: 'require',
                }],
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
export const tabOptions = {
    ...esbuildOptions,
    jsx: 'transform',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
};
export const buildTabs = async (tabs, { srcDir, outDir }) => {
    const nameExpander = tabNameExpander(srcDir);
    const { outputFiles } = await esbuild({
        ...tabOptions,
        entryPoints: tabs.map(nameExpander),
        outbase: outDir,
        outdir: outDir,
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
const getBuildTabsCommand = () => createBuildCommand('tabs', true)
    .argument('[tabs...]', 'Manually specify which tabs to build', null)
    .description('Build only tabs')
    .action(async (tabsOpt, { manifest, ...opts }) => {
    const tabs = await retrieveTabs(manifest, tabsOpt);
    await prebuild(opts, {
        tabs,
        bundles: [],
    });
    printList(`${chalk.magentaBright('Building the following tabs:')}\n`, tabs);
    const startTime = performance.now();
    const [reducedRes] = await Promise.all([
        buildTabs(tabs, opts)
            .then((results) => reduceTabOutputFiles(results, startTime, opts.outDir)),
        copyManifest({
            outDir: opts.outDir,
            manifest,
        }),
    ]);
    logResult(reducedRes, opts.verbose);
    exitOnError(reducedRes);
});
export default getBuildTabsCommand;
