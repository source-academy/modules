import chalk from 'chalk';
import { build as esbuild } from 'esbuild';
import fs from 'fs/promises';
import pathlib from 'path';
import { createBuildCommand } from '../buildUtils.js';
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
});
export const buildModules = async (buildOpts) => {
    const { bundles, tabs } = buildOpts;
    const startPromises = [];
    if (bundles.length > 0) {
        startPromises.push(fs.mkdir(`${buildOpts.outDir}/bundles`, { recursive: true }));
    }
    if (tabs.length > 0) {
        startPromises.push(fs.mkdir(`${buildOpts.outDir}/tabs`, { recursive: true }));
    }
    await Promise.all(startPromises);
    const startTime = performance.now();
    const config = {
        ...esbuildOptions,
        entryPoints: [
            ...bundles.map((bundle) => `${buildOpts.srcDir}/bundles/${bundle}/index.ts`),
            ...tabs.map((tabName) => `${buildOpts.srcDir}/tabs/${tabName}/index.tsx`),
        ],
        outbase: buildOpts.outDir,
        outdir: buildOpts.outDir,
    };
    const [{ outputFiles }] = await Promise.all([
        esbuild(config),
        fs.copyFile(buildOpts.manifest, `${buildOpts.outDir}/${buildOpts.manifest}`),
    ]);
    const buildResults = await reduceOutputFiles(outputFiles, buildOpts.outDir, startTime);
    return reduceModuleResults(buildResults);
};
const buildModulesCommand = createBuildCommand('modules', async (buildOpts) => {
    console.log(`${chalk.cyanBright('Building bundles and tabs for the following bundles:')}\n${buildOpts.bundles.map((bundle, i) => `${i + 1}. ${bundle}`)
        .join('\n')}\n`);
    await Promise.all([
        fs.mkdir(`${buildOpts.outDir}/bundles`, { recursive: true }),
        fs.mkdir(`${buildOpts.outDir}/tabs`, { recursive: true }),
    ]);
    const results = await buildModules(buildOpts);
    logBundleResults(results.bundles, buildOpts.verbose);
    logTabResults(results.tabs, buildOpts.verbose);
})
    .description('Build only bundles and tabs');
export { logBundleResults } from './bundle.js';
export { default as buildTabsCommand, logTabResults } from './tab.js';
export default buildModulesCommand;
