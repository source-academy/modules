import chalk from 'chalk';
import { Command } from 'commander';
import { build as esbuild } from 'esbuild';
import fs from 'fs/promises';
import { retrieveManifest } from '../../scriptUtils';
import { initTypedoc } from '../docs';
import { logTypedocTime } from '../docs/docUtils';
import { buildJson } from '../docs/json';
import { outputBundle } from '../modules/bundle';
import { esbuildOptions } from '../modules/moduleUtils';
import { outputTab } from '../modules/tab';
const watchThings = async (buildOpts) => {
    const [{ elapsed: typedocTime, result: [app, project] }] = await Promise.all([
        initTypedoc(buildOpts),
        fs.mkdir(`${buildOpts.outDir}/bundles/`, { recursive: true }),
        fs.mkdir(`${buildOpts.outDir}/tabs/`, { recursive: true }),
        fs.mkdir(`${buildOpts.outDir}/jsons/`, { recursive: true }),
    ]);
    logTypedocTime(typedocTime);
    console.log(`Watching ${buildOpts.srcDir}`);
    const config = {
        ...esbuildOptions,
        incremental: true,
        outbase: buildOpts.outDir,
        outdir: buildOpts.outDir,
    };
    const bundlePromises = buildOpts.bundles.map(async (bundle) => {
        const entry = `${buildOpts.srcDir}/bundles/${bundle}/index.ts`;
        const incremental = await esbuild({
            ...config,
            entryPoints: [entry],
        });
        for await (const {} of fs.watch(`${buildOpts.srcDir}/bundles/${bundle}`, {
            recursive: true,
        })) {
            console.log(`Bundle '${bundle}' changed, rebuilding...`);
            const { outputFiles: [{ text }] } = await incremental.rebuild();
            const [bundleResult, { result: jsonResult }] = await Promise.all([
                outputBundle(bundle, text, buildOpts),
                buildJson(bundle, project.getChildByName(bundle), buildOpts),
            ]);
            if (bundleResult.severity === 'error') {
                console.log(chalk.redBright(`Build for '${bundle}' failed: ${bundleResult.error}`));
            }
            else {
                console.log(chalk.greenBright(`Rebuilt bundle for '${bundle}' succesfully.`));
            }
            if (jsonResult.severity === 'error') {
                console.log(chalk.redBright(`Build for '${bundle}' json failed: ${jsonResult.error}`));
            }
            else if (jsonResult.severity === 'warn') {
                console.log(chalk.yellowBright(`Built json for '${bundle}' with warnings: ${jsonResult.error}`));
            }
            else {
                console.log(chalk.greenBright(`Rebuilt json for '${bundle}' succesfully.`));
            }
        }
    });
    const tabPromises = buildOpts.tabs.map(async (tabName) => {
        const entry = `${buildOpts.srcDir}/tabs/${tabName}/index.tsx`;
        const incremental = await esbuild({
            ...config,
            entryPoints: [entry],
        });
        for await (const {} of fs.watch(`${buildOpts.srcDir}/tabs/${tabName}`, {
            recursive: true,
        })) {
            console.log(`Tab '${tabName}' changed, rebuilding...`);
            const { outputFiles: [{ text }] } = await incremental.rebuild();
            const tabResult = await outputTab(tabName, text, buildOpts);
            if (tabResult.severity === 'error') {
                console.log(chalk.redBright(`Build for '${tabName}' failed: ${tabResult.error}`));
            }
            else {
                console.log(chalk.greenBright(`Rebuilt '${tabName}' succesfully.`));
            }
        }
    });
    await Promise.all([...bundlePromises, ...tabPromises]);
    const finalPromises = [
        fs.copyFile(`${buildOpts.srcDir}/${buildOpts.manifest}`, `${buildOpts.outDir}/${buildOpts.manifest}`),
    ];
    if (buildOpts.docs)
        finalPromises.push(app.generateDocs(project, `${buildOpts.outDir}/documentation`));
    await Promise.all(finalPromises);
};
const watchCommand = new Command('watch')
    .option('--outDir <outdir>', 'Output directory', 'build')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .option('--no-docs', 'Don\'t build HTML documentation')
    .action(async (opts) => {
    const manifest = await retrieveManifest(opts.manifest);
    await watchThings({
        bundles: Object.keys(manifest),
        tabs: Object.values(manifest)
            .flatMap((x) => x.tabs),
        ...opts,
        modulesSpecified: false,
    });
});
export default watchCommand;
