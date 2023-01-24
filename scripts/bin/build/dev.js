import chalk from 'chalk';
import { InvalidArgumentError } from 'commander';
import { context as esbuild } from 'esbuild';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { retrieveManifest } from '../scriptUtils.js';
import { buildHtml, buildJsons, initTypedoc, logHtmlResult } from './docs/index.js';
import { processOutputFiles } from './modules/index.js';
import { esbuildOptions } from './modules/moduleUtils.js';
import { createBuildCommand, divideAndRound, logResult } from './buildUtils.js';
/**
 * Wait until the user presses 'ctrl+c' on the keyboard
 */
const waitForQuit = () => new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.on('data', (data) => {
        const byteArray = [...data];
        if (byteArray.length > 0 && byteArray[0] === 3) {
            console.log('^C');
            process.stdin.setRawMode(false);
            resolve();
        }
    });
});
const devCommand = createBuildCommand('dev')
    .description('Use this command to leverage esbuild\'s automatic rebuilding capapbilities.'
    + ' Use --watch to rebuild every time the file system detects changes and'
    + ' --serve to serve modules using a special HTTP server that rebuilds on each request.'
    + ' If neither is specified then --serve is assumed')
    .option('--no-docs', 'Don\'t rebuild documentation')
    .option('-w, --watch', 'Rebuild on file system changes', false)
    .option('-s, --serve', 'Run the HTTP server, and rebuild on every request', false)
    .option('-i, --ip', 'Host interface to bind to', null)
    .option('-p, --port', 'Port to bind for the server to bind to', (value) => {
    const parsedInt = parseInt(value);
    if (isNaN(parsedInt) || parsedInt < 1 || parsedInt > 65535) {
        throw new InvalidArgumentError(`Expected port to be a valid number between 1-65535, got ${value}!`);
    }
    return parsedInt;
}, null)
    .action(async ({ verbose, ...opts }) => {
    const shouldWatch = opts.watch;
    const shouldServe = opts.serve || !opts.watch;
    if (!shouldServe) {
        if (opts.ip)
            console.log(chalk.yellowBright('--ip option specified without --serve!'));
        if (opts.port)
            console.log(chalk.yellowBright('--port option specified without --serve!'));
    }
    const [manifest] = await Promise.all([
        retrieveManifest(opts.manifest),
        fsPromises.mkdir(`${opts.outDir}/bundles/`, { recursive: true }),
        fsPromises.mkdir(`${opts.outDir}/tabs/`, { recursive: true }),
        fsPromises.mkdir(`${opts.outDir}/jsons/`, { recursive: true }),
        fsPromises.copyFile(opts.manifest, `${opts.outDir}/${opts.manifest}`),
    ]);
    let app = null;
    if (opts.docs) {
        ({ result: [app] } = await initTypedoc({
            srcDir: opts.srcDir,
            bundles: Object.keys(manifest),
            verbose,
        }, true));
    }
    let typedocProj = null;
    const buildDocs = async () => {
        if (!opts.docs)
            return [];
        typedocProj = app.convert();
        return buildJsons(typedocProj, {
            bundles: Object.keys(manifest),
            outDir: opts.outDir,
        });
    };
    const context = await esbuild({
        ...esbuildOptions,
        outbase: opts.outDir,
        outdir: opts.outDir,
        entryPoints: Object.entries(manifest)
            .flatMap(([bundle, { tabs }]) => [
            path.join(opts.srcDir, 'bundles', bundle, 'index.ts'),
            ...tabs.map((tabName) => path.join(opts.srcDir, 'tabs', tabName, 'index.tsx')),
        ]),
        plugins: [{
                name: 'Source Module Compiler',
                setup(pluginBuild) {
                    let startTime;
                    pluginBuild.onStart(() => {
                        console.log(chalk.magentaBright('Beginning build...'));
                        startTime = performance.now();
                    });
                    pluginBuild.onEnd(async ({ outputFiles }) => {
                        const [mainResults, jsonResults] = await Promise.all([
                            processOutputFiles(outputFiles, opts.outDir, startTime),
                            buildDocs(),
                        ]);
                        logResult(mainResults.concat(jsonResults), false);
                        console.log(chalk.gray(`Took ${divideAndRound(performance.now() - startTime, 1000, 2)}s to complete\n`));
                    });
                },
            }],
    });
    if (shouldWatch) {
        console.log(chalk.yellowBright(`Watching ${chalk.cyanBright(`./${opts.srcDir}`)} for changes`));
        await context.watch();
    }
    if (shouldServe) {
        const { port: servePort, host: serveHost } = await context.serve({
            servedir: opts.outDir,
            port: opts.port || 8022,
            host: opts.ip || '0.0.0.0',
            onRequest: ({ method, path: urlPath, remoteAddress, timeInMS }) => console.log(`[${new Date()
                .toISOString()}] ${chalk.gray(remoteAddress)} "${chalk.cyan(`${method} ${urlPath}`)}": Response Time: ${chalk.magentaBright(`${divideAndRound(timeInMS, 1000, 2)}s`)}`),
        });
        console.log(`${chalk.greenBright(`Serving ${chalk.cyanBright(`./${opts.outDir}`)} at`)} ${chalk.yellowBright(`${serveHost}:${servePort}`)}`);
    }
    console.log(chalk.yellowBright('Press CTRL + C to stop'));
    await waitForQuit();
    console.log(chalk.yellowBright('Stopping...'));
    const [htmlResult] = await Promise.all([
        opts.docs
            ? buildHtml(app, typedocProj, {
                outDir: opts.outDir,
                modulesSpecified: false,
            })
            : Promise.resolve(null),
        context.cancel(),
    ]);
    logHtmlResult(htmlResult);
    await context.dispose();
});
export default devCommand;
