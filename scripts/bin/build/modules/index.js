import chalk from 'chalk';
import { build as esbuild } from 'esbuild';
import fs from 'fs/promises';
import pathlib from 'path';
import { esbuildOptions } from '../buildUtils';
import { logBundleResults, outputBundle } from './bundle';
import { logTabResults, outputTab } from './tab';
export const buildModules = async (buildOpts) => {
    const { modules: bundles, tabs } = buildOpts;
    const startPromises = [];
    if (bundles.length > 0) {
        startPromises.push(fs.mkdir(`${buildOpts.outDir}/bundles`, { recursive: true }));
    }
    if (tabs.length > 0) {
        startPromises.push(fs.mkdir(`${buildOpts.outDir}/tabs`, { recursive: true }));
    }
    await Promise.all(startPromises);
    const startTime = performance.now();
    const stats = {
        bundles: {
            time: 0,
            buildCount: 0,
            totalCount: bundles.length,
        },
        tabs: {
            time: 0,
            buildCount: 0,
            totalCount: tabs.length,
        },
    };
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
        fs.copyFile(buildOpts.manifest, `${buildOpts.outDir}/modules.json`),
    ]);
    const buildResults = await Promise.all(outputFiles.map(async (outputFile) => {
        const { dir: sourceDir } = pathlib.parse(outputFile.path);
        const name = pathlib.basename(sourceDir);
        const { dir: typeDir } = pathlib.parse(sourceDir);
        const type = pathlib.basename(typeDir);
        if (type !== 'bundles' && type !== 'tabs') {
            throw new Error(`Unknown type found for: ${type}: ${outputFile.path}`);
        }
        const result = await (type === 'bundles' ? outputBundle : outputTab)(name, outputFile.text, buildOpts);
        const endTime = performance.now() - startTime;
        stats[type].buildCount++;
        if (stats[type].buildCount === stats[type].totalCount)
            stats[type].time = endTime;
        return {
            name,
            elapsed: endTime,
            type,
            ...result,
        };
    }));
    const { bundles: bundleResults, tabs: tabResults } = buildResults.reduce((res, entry) => {
        if (entry.severity === 'error')
            res[entry.type].severity = 'error';
        res[entry.type].results[entry.name] = entry;
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
    return {
        bundles: {
            elapsed: stats.bundles.time,
            ...bundleResults,
        },
        tabs: {
            elapsed: stats.tabs.time,
            ...tabResults,
        },
    };
};
/**
 * Build bundles and tabs only
 */
export default async (buildOpts) => {
    const bundlesToBuild = buildOpts.modules;
    console.log(`${chalk.cyanBright('Building bundles and tabs for the following bundles:')}\n${bundlesToBuild.map((bundle, i) => `${i + 1}. ${bundle}`)
        .join('\n')}\n`);
    await Promise.all([
        fs.mkdir(`${buildOpts.outDir}/bundles`, { recursive: true }),
        fs.mkdir(`${buildOpts.outDir}/tabs`, { recursive: true }),
    ]);
    const results = await buildModules(buildOpts);
    logBundleResults(results.bundles);
    logTabResults(results.tabs);
    // if (results.serveResult) {
    //   console.log(chalk.greenBright(`Now serving modules at ${results.serveResult.host}:${results.serveResult.port}`));
    //   await results.serveResult.wait;
    // }
};
export { logBundleResults } from './bundle';
export { default as buildTabCommand, logTabResults } from './tab';
