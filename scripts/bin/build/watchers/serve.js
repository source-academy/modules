import chalk from 'chalk';
import { Command, InvalidArgumentError } from 'commander';
import { context as esbuild } from 'esbuild';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { retrieveManifest } from '../../scriptUtils.js';
import { divideAndRound } from '../buildUtils.js';
import { buildJsons, initTypedoc, logJsonResults } from '../docs/index.js';
import { logBundleResults, logTabResults, reduceModuleResults, reduceOutputFiles } from '../modules/index.js';
import { esbuildOptions } from '../modules/moduleUtils.js';
import { waitForQuit } from './watchUtils.js';
const serveCommand = new Command('serve')
    .description('Use esbuild\'s internal http server to serve modules.'
    + ' All assets are rebuilt every time a http request is made.'
    + ' If this is too slow for you, use the watch command with yarn serve instead')
    .option('--outDir <outdir>', 'Output directory', 'build')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .option('--no-docs', 'Don\'t rebuild documentation')
    // .option('--no-typecheck', 'Don\'t run tsc before building each asset')
    .option('-v, --verbose', 'Display more information about the build results', false)
    .option('-i, --ip', 'Host interface to bind to', '0.0.0.0')
    .option('-p, --port', 'Port to bind for the server to bind to', (value) => {
    const parsedInt = parseInt(value);
    if (isNaN(parsedInt) || parsedInt < 1 || parsedInt > 65535) {
        throw new InvalidArgumentError(`Expected port to be a valid number between 1-65535, got ${value}!`);
    }
    return parsedInt;
}, 8022)
    .action(async ({ verbose, ...opts }) => {
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
    await context.watch();
    const { port: servePort, host: serveHost } = await context.serve({
        servedir: opts.outDir,
        port: opts.port,
        host: opts.ip,
        onRequest: ({ method, path: urlPath, remoteAddress, timeInMS }) => console.log(`[${new Date()
            .toISOString()}] ${chalk.gray(remoteAddress)} "${chalk.cyan(`${method} ${urlPath}`)}": Response Time: ${chalk.magentaBright(`${divideAndRound(timeInMS, 1000, 2)}s`)}`),
    });
    /* esbuild serve http proxy
    // const httpServer = http.createServer((req, res) => {
    //   // const urlSegments = req.url.split('/');

    //   // if (urlSegments.length === 3) {
    //   //   const [,, name] = urlSegments;
    //   //   const filePath = path.join(opts.outDir, 'jsons', name);

    //   //   if (!fs.existsSync(filePath)) {
    //   //     res.writeHead(404, 'No such json file');
    //   //     res.end();
    //   //     return;
    //   //   }
    //   //   // initTypedoc({
    //   //   //   bundles: [name],
    //   //   //   srcDir: opts.srcDir,
    //   //   //   verbose,
    //   //   // }).then(({ result: [, project]}) => {

    //   //   // })

    //   //   const readStream = fs.createReadStream(filePath);
    //   //   readStream.on('data', (data) => res.write(data));
    //   //   readStream.on('end', () => {
    //   //     res.writeHead(200);
    //   //     res.end();
    //   //   });
    //   //   readStream.on('error', (err) => {
    //   //     res.writeHead(500, `Error Occurred: ${err}`);
    //   //     res.end();
    //   //   });
    //   //   return;
    //   // }

    //   const proxyReq = http.request({
    //     host: '127.0.0.1',
    //     port: servePort,
    //     path: req.url,
    //     method: req.method,
    //     headers: req.headers,
    //   }, proxyRes => {
    //     // Forward each incoming request to esbuild
    //     res.writeHead(proxyRes.statusCode, proxyRes.headers);
    //     proxyRes.pipe(res, { end: true });
    //   });

    //   // Forward the body of the request to esbuild
    //   req.pipe(proxyReq, { end: true });
    // });

    // httpServer.listen(opts.port, opts.ip);
    // await new Promise<void>((resolve) => httpServer.on('listening', () => resolve()));
    // const { port: httpPort, address: httpAddress } = httpServer.address() as AddressInfo;
    console.log(`${
      chalk.greenBright(`Serving ${
        chalk.cyanBright(`./${opts.outDir}`)
      } at`)} ${
      chalk.yellowBright(`${httpAddress}:${httpPort}`)
    }\nPress CTRL+C to stop\n`);
    await waitForQuit();

    httpServer.close();
  */
    console.log(`${chalk.greenBright(`Serving ${chalk.cyanBright(`./${opts.outDir}`)} at`)} ${chalk.yellowBright(`${serveHost}:${servePort}`)}\nPress CTRL+C to stop\n`);
    await waitForQuit();
    console.log(chalk.yellowBright('Stopping server...'));
    await context.dispose();
});
export default serveCommand;
