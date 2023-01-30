import chalk from 'chalk';
import { Command, Option } from 'commander';
import { build as esbuild } from 'esbuild';
import fs from 'fs/promises';
import pathlib from 'path';
import { printList } from '../../scriptUtils.js';
import { expandBundleName, expandTabName, retrieveBundlesAndTabs } from '../buildUtils.js';
import { logLintResult } from '../prebuild/eslint.js';
import { preBuild } from '../prebuild/index.js';
import { logTscResults } from '../prebuild/tsc.js';
import { logBundleResults, outputBundle } from './bundle.js';
import { esbuildOptions } from './moduleUtils.js';
import { logTabResults, outputTab } from './tab.js';
export const reduceOutputFiles = (outputFiles, outDir, startTime) => Promise.all(outputFiles.map(async ({ path, text }) => {
    const [type, name] = path.split(pathlib.sep)
        .slice(-3, -1);
    if (type !== 'bundles' && type !== 'tabs') {
        throw new Error(`Unknown type found for: ${type}: ${path}`);
    }
    const result = await (type === 'bundles' ? outputBundle : outputTab)(name, text, outDir);
    const endTime = performance.now() - startTime;
    return [type, name, {
            elapsed: endTime,
            ...result,
        }];
}));
export const reduceModuleResults = (results) => results.reduce((res, [type, name, entry]) => {
    if (entry.severity === 'error')
        res[type].severity = 'error';
    else if (entry.severity === 'warn' && res[type].severity === 'success')
        res[type].severity = 'warn';
    res[type].results[name] = entry;
    return res;
}, {
    bundles: {
        severity: 'success',
        results: {},
    },
    tabs: {
        severity: 'success',
        results: {},
    },
    jsons: {
        severity: 'success',
        results: {},
    },
});
export const buildModules = async (opts, { bundles, tabs }) => {
    const startPromises = [];
    if (bundles.length > 0) {
        startPromises.push(fs.mkdir(`${opts.outDir}/bundles`, { recursive: true }));
    }
    if (tabs.length > 0) {
        startPromises.push(fs.mkdir(`${opts.outDir}/tabs`, { recursive: true }));
    }
    await Promise.all(startPromises);
    const startTime = performance.now();
    const config = {
        ...esbuildOptions,
        entryPoints: [
            ...bundles.map(expandBundleName(opts.srcDir)),
            ...tabs.map(expandTabName(opts.srcDir)),
        ],
        outbase: opts.outDir,
        outdir: opts.outDir,
    };
    const { outputFiles } = await esbuild(config);
    const buildResults = await reduceOutputFiles(outputFiles, opts.outDir, startTime);
    return reduceModuleResults(buildResults);
};
const buildModulesCommand = new Command('modules')
    .option('--fix', 'Ask eslint to autofix linting errors', false)
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--outDir <outdir>', 'Source directory for files', 'build')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .option('-v, --verbose', 'Display more information about the build results', false)
    .option('--no-tsc', 'Don\'t run tsc before building')
    .addOption(new Option('--no-lint', 'Don\t run eslint before building')
    .conflicts('fix'))
    .argument('[modules...]', 'Manually specify which modules to build', null)
    .action(async (modules, { manifest, ...opts }) => {
    const assets = await retrieveBundlesAndTabs(manifest, modules, []);
    printList(`${chalk.cyanBright('Building bundles and tabs for the following bundles:')}\n`, assets.bundles);
    const { lintResult, tscResult } = await preBuild(opts, assets);
    logLintResult(lintResult);
    logTscResults(tscResult, opts.srcDir);
    const [results] = await Promise.all([
        buildModules(opts, assets),
        fs.copyFile(manifest, `${opts.outDir}/${manifest}`),
    ]);
    logBundleResults(results.bundles, opts.verbose);
    logTabResults(results.tabs, opts.verbose);
})
    .description('Build only bundles and tabs');
export { logBundleResults } from './bundle.js';
export { default as buildTabsCommand, logTabResults } from './tab.js';
export default buildModulesCommand;
