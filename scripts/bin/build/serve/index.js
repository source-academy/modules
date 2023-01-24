import chalk from 'chalk';
import { Command, InvalidArgumentError } from 'commander';
import { context as esbuild } from 'esbuild';
import fs, { promises as fsPromises } from 'fs';
import http from 'http';
import path from 'path';
import { retrieveManifest } from '../../scriptUtils.js';
import { divideAndRound } from '../buildUtils.js';
import { buildJsons, initTypedoc, logJsonResults } from '../docs/index.js';
import { logBundleResults, logTabResults, reduceModuleResults, reduceOutputFiles } from '../modules/index.js';
import { esbuildOptions } from '../modules/moduleUtils.js';
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
const incrementalBuilder = async ({ verbose, ...opts }) => {
    const [manifest] = await Promise.all([
        retrieveManifest(opts.manifest),
        fsPromises.mkdir(`${opts.outDir}/bundles/`, { recursive: true }),
        fsPromises.mkdir(`${opts.outDir}/tabs/`, { recursive: true }),
        fsPromises.mkdir(`${opts.outDir}/jsons/`, { recursive: true }),
        fsPromises.copyFile(opts.manifest, `${opts.outDir}/${opts.manifest}`),
    ]);
    const { result: [app] } = await initTypedoc({
        srcDir: opts.srcDir,
        bundles: Object.keys(manifest),
        verbose,
    }, true);
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
                        const buildDocs = () => {
                            if (!opts.docs)
                                return Promise.resolve(false);
                            return buildJsons(app.convert(), {
                                bundles: Object.keys(manifest),
                                outDir: opts.outDir,
                            });
                        };
                        const [{ bundles: bundleResults, tabs: tabResults }, jsonResults] = await Promise.all([
                            reduceOutputFiles(outputFiles, opts.outDir, startTime)
                                .then((results) => reduceModuleResults(results)),
                            buildDocs(),
                        ]);
                        logBundleResults(bundleResults, verbose);
                        logTabResults(tabResults, verbose);
                        logJsonResults(jsonResults, verbose);
                        console.log(chalk.gray(`Took ${divideAndRound(performance.now() - startTime, 1000, 2)}s to complete\n`));
                    });
                },
            }],
    });
    await context.rebuild();
    if (opts.watch) {
        await context.watch();
        console.log(chalk.greenBright(`Watching source directory ${chalk.cyanBright(`./${opts.srcDir}`)} for changes\n`));
    }
    if (opts.serve) {
        const { port: servePort, host: serveHost } = await context.serve({
            servedir: opts.outDir,
            port: opts.port,
            host: opts.ip,
            onRequest: ({ method, path: urlPath, remoteAddress, timeInMS }) => console.log(`[${new Date()
                .toISOString()}] ${chalk.gray(remoteAddress)} "${chalk.cyan(`${method} ${urlPath}`)}": Response Time: ${chalk.magentaBright(`${divideAndRound(timeInMS, 1000, 2)}s`)}`),
        });
        console.log(`${chalk.greenBright(`Serving ${chalk.cyanBright(`./${opts.outDir}`)} at`)} ${chalk.yellowBright(`${serveHost}:${servePort}`)}\n`);
    }
    console.log(chalk.yellowBright('Press CTRL+C to stop'));
    await waitForQuit();
    console.log(chalk.yellowBright('Stopping...'));
    await context.dispose();
};
const createServeCommand = (name, action) => new Command(name)
    .option('--outDir <outdir>', 'Output directory', 'build')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .option('--no-docs', 'Don\'t rebuild documentation')
    .option('-v, --verbose', 'Display more information about the build results', false)
    .option('-i, --ip', 'Host interface to bind to', '0.0.0.0')
    .option('-p, --port', 'Port to bind for the server to bind to', (value) => {
    const parsedInt = parseInt(value);
    if (isNaN(parsedInt) || parsedInt < 1 || parsedInt > 65535) {
        throw new InvalidArgumentError(`Expected port to be a valid number between 1-65535, got ${value}!`);
    }
    return parsedInt;
}, 8022)
    .action((opts) => action(opts));
export const serveCommand = createServeCommand('serve', (opts) => incrementalBuilder({
    ...opts,
    serve: true,
}))
    .description('In serve mode, all assets are rebuilt whenever a HTTP request for a tracked file'
    + ' is made. esbuild will automatically serve the modules over a HTTP server.'
    + ' Use the configuration options to customize its behaviour');
export const watchCommand = createServeCommand('watch', async (opts) => {
    const buildPromise = incrementalBuilder({
        ...opts,
        watch: true,
    });
    // Run the HTTP server programmatically
    const server = http.createServer((req, res) => {
        console.log(`[${new Date()
            .toISOString()}] ${chalk.gray(req.headers.host)} "${chalk.cyan(`${req.method} ${req.url}`)}"`);
        const filePath = path.join(opts.outDir, `.${req.url}`);
        if (!fs.existsSync(filePath)) {
            res.writeHead(404);
            res.end();
            return;
        }
        const stream = fs.createReadStream(filePath);
        stream.on('data', (data) => res.write(data));
        stream.on('end', () => {
            res.writeHead(200);
            res.end();
        });
        stream.on('error', (err) => {
            res.writeHead(500, `Error Occurred: ${err}`);
            res.end();
        });
    })
        .listen(opts.port, opts.ip);
    await new Promise((resolve) => server.on('listening', () => resolve()));
    console.log(`${chalk.greenBright(`Serving ${chalk.cyanBright(`./${opts.outDir}`)} at`)} ${chalk.yellowBright(`${opts.ip}:${opts.port}`)}\n`);
    await buildPromise;
    server.close();
})
    .description('In watch mode, all assets are rebuilt whenever there are changes detected'
    + ' the source directory. esbuild will not serve the modules automatically, so you will still'
    + ' need to combine this with yarn serve');
export const serveWatchCommand = createServeCommand('serve_watch', (opts) => incrementalBuilder({
    ...opts,
    serve: true,
    watch: true,
}))
    .description('In serve and watch mode, esbuild will rebuild all assets whenever a change in the file system'
    + ' is detected, or when a HTTP request is made. esbuild will automatically serve modules.');
