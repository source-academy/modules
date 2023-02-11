import chalk from 'chalk';
import { context as esbuild } from 'esbuild';
import fs from 'fs/promises';
import type { Application } from 'typedoc';

import { buildHtml, buildJsons, initTypedoc, logHtmlResult } from './docs/index.js';
import { reduceBundleOutputFiles } from './modules/bundle.js';
import { esbuildOptions } from './modules/moduleUtils.js';
import { reduceTabOutputFiles } from './modules/tab.js';
import { bundleNameExpander, copyManifest, createBuildCommand, divideAndRound, logResult, retrieveBundlesAndTabs, tabNameExpander } from './buildUtils.js';
import type { BuildCommandInputs, UnreducedResult } from './types.js';

/**
 * Wait until the user presses 'ctrl+c' on the keyboard
 */
const waitForQuit = () => new Promise<void>((resolve, reject) => {
  process.stdin.setRawMode(true);
  process.stdin.on('data', (data) => {
    const byteArray = [...data];
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C');
      process.stdin.setRawMode(false);
      resolve();
    }
  });
  process.stdin.on('error', reject);
});

type ContextOptions = Record<'srcDir' | 'outDir', string>;
const getBundleContext = ({ srcDir, outDir }: ContextOptions, bundles: string[], app?: Application) => esbuild({
  ...esbuildOptions,
  outbase: outDir,
  outdir: outDir,
  entryPoints: bundles.map(bundleNameExpander(srcDir)),
  external: ['js-slang/moduleHelpers'],
  plugins: [{
    name: 'Bundle Compiler',
    async setup(pluginBuild) {
      let jsonPromise: Promise<UnreducedResult[]> | null = null;
      if (app) {
        app.convertAndWatch(async (project) => {
          console.log(chalk.magentaBright('Beginning jsons build...'));
          jsonPromise = buildJsons(project, {
            outDir,
            bundles,
          });
        });
      }

      let startTime: number;
      pluginBuild.onStart(() => {
        console.log(chalk.magentaBright('Beginning bundles build...'));
        startTime = performance.now();
      });

      pluginBuild.onEnd(async ({ outputFiles }) => {
        const [mainResults, jsonResults] = await Promise.all([
          reduceBundleOutputFiles(outputFiles, startTime, outDir),
          jsonPromise || Promise.resolve([]),
        ]);
        logResult(mainResults.concat(jsonResults), false);

        console.log(chalk.gray(`Bundles took ${divideAndRound(performance.now() - startTime, 1000, 2)}s to complete\n`));
      });
    },
  }],
});

const getTabContext = ({ srcDir, outDir }: ContextOptions, tabs: string[]) => esbuild({
  ...esbuildOptions,
  outbase: outDir,
  outdir: outDir,
  entryPoints: tabs.map(tabNameExpander(srcDir)),
  external: ['react', 'react-dom'],
  plugins: [{
    name: 'Tab Compiler',
    setup(pluginBuild) {
      let startTime: number;
      pluginBuild.onStart(() => {
        console.log(chalk.magentaBright('Beginning tabs build...'));
        startTime = performance.now();
      });

      pluginBuild.onEnd(async ({ outputFiles }) => {
        const mainResults = await reduceTabOutputFiles(outputFiles, startTime, outDir);
        logResult(mainResults, false);

        console.log(chalk.gray(`Tabs took ${divideAndRound(performance.now() - startTime, 1000, 2)}s to complete\n`));
      });
    },
  }],
});

// const serveContext = async (context: Awaited<ReturnType<typeof esbuild>>) => {
//   const { port } = await context.serve({
//     host: '127.0.0.2',
//     onRequest: ({ method, path: urlPath, remoteAddress, timeInMS }) => console.log(`[${new Date()
//       .toISOString()}] ${chalk.gray(remoteAddress)} "${chalk.cyan(`${method} ${urlPath}`)}": Response Time: ${
//       chalk.magentaBright(`${divideAndRound(timeInMS, 1000, 2)}s`)}`),
//   });

//   return port;
// };

type WatchCommandInputs = {
  docs: boolean;
} & BuildCommandInputs;

export const watchCommand = createBuildCommand('watch', false)
  .description('Run esbuild in watch mode, rebuilding on every detected file system change')
  .option('--no-docs', 'Don\'t rebuild documentation')
  .action(async (opts: WatchCommandInputs) => {
    const [{ bundles, tabs }] = await Promise.all([
      retrieveBundlesAndTabs(opts.manifest, null, null),
      fs.mkdir(`${opts.outDir}/bundles/`, { recursive: true }),
      fs.mkdir(`${opts.outDir}/tabs/`, { recursive: true }),
      fs.mkdir(`${opts.outDir}/jsons/`, { recursive: true }),
      fs.copyFile(opts.manifest, `${opts.outDir}/${opts.manifest}`),
    ]);

    let app: Application | null = null;
    if (opts.docs) {
      ({ result: [app] } = await initTypedoc({
        srcDir: opts.srcDir,
        bundles,
        verbose: false,
      }, true));
    }

    const [bundlesContext, tabsContext] = await Promise.all([
      getBundleContext(opts, bundles, app),
      getTabContext(opts, tabs),
    ]);

    console.log(chalk.yellowBright(`Watching ${chalk.cyanBright(`./${opts.srcDir}`)} for changes\nPress CTRL + C to stop`));
    await Promise.all([bundlesContext.watch(), tabsContext.watch()]);
    await waitForQuit();
    console.log(chalk.yellowBright('Stopping...'));

    const [htmlResult] = await Promise.all([
      opts.docs
        ? buildHtml(app, app.convert(), {
          outDir: opts.outDir,
          modulesSpecified: false,
        })
        : Promise.resolve(null),
      bundlesContext.cancel()
        .then(() => bundlesContext.dispose()),
      tabsContext.cancel()
        .then(() => tabsContext.dispose()),
      copyManifest(opts),
    ]);
    logHtmlResult(htmlResult);
  });

/*
type DevCommandInputs = {
  docs: boolean;

  ip: string | null;
  port: number | null;

  watch: boolean;
  serve: boolean;
} & BuildCommandInputs;

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
  .action(async ({ verbose, ...opts }: DevCommandInputs) => {
    const shouldWatch = opts.watch;
    const shouldServe = opts.serve || !opts.watch;

    if (!shouldServe) {
      if (opts.ip) console.log(chalk.yellowBright('--ip option specified without --serve!'));
      if (opts.port) console.log(chalk.yellowBright('--port option specified without --serve!'));
    }

    const [{ bundles, tabs }] = await Promise.all([
      retrieveBundlesAndTabs(opts.manifest, null, null),
      fsPromises.mkdir(`${opts.outDir}/bundles/`, { recursive: true }),
      fsPromises.mkdir(`${opts.outDir}/tabs/`, { recursive: true }),
      fsPromises.mkdir(`${opts.outDir}/jsons/`, { recursive: true }),
      fsPromises.copyFile(opts.manifest, `${opts.outDir}/${opts.manifest}`),
    ]);


    const [bundlesContext, tabsContext] = await Promise.all([
      getBundleContext(opts, bundles),
      getTabContext(opts, tabs),
    ]);

    await Promise.all([
      bundlesContext.watch(),
      tabsContext.watch(),
    ]);

    await Promise.all([
      bundlesContext.cancel()
        .then(() => bundlesContext.dispose()),
      tabsContext.cancel()
        .then(() => tabsContext.dispose()),
    ]);

    await waitForQuit();


    if (opts.watch) {
      await Promise.all([
        bundlesContext.watch(),
        tabsContext.watch(),
      ]);
    }

    let httpServer: http.Server | null = null;
    if (opts.serve) {
      const [bundlesPort, tabsPort] = await Promise.all([
        serveContext(bundlesContext),
        serveContext(tabsContext),
      ]);

      httpServer = http.createServer((req, res) => {
        const urlSegments = req.url.split('/');
        if (urlSegments.length === 3) {
          const [, assetType, name] = urlSegments;

          if (assetType === 'jsons') {
            const filePath = path.join(opts.outDir, 'jsons', name);
            if (!fsSync.existsSync(filePath)) {
              res.writeHead(404, 'No such json file');
              res.end();
              return;
            }

            const readStream = fsSync.createReadStream(filePath);
            readStream.on('data', (data) => res.write(data));
            readStream.on('end', () => {
              res.writeHead(200);
              res.end();
            });
            readStream.on('error', (err) => {
              res.writeHead(500, `Error Occurred: ${err}`);
              res.end();
            });
          } else if (assetType === 'tabs') {
            const proxyReq = http.request({
              host: '127.0.0.2',
              port: tabsPort,
              path: req.url,
              method: req.method,
              headers: req.headers,
            }, (proxyRes) => {
              // Forward each incoming request to esbuild
              res.writeHead(proxyRes.statusCode, proxyRes.headers);
              proxyRes.pipe(res, { end: true });
            });
            // Forward the body of the request to esbuild
            req.pipe(proxyReq, { end: true });
          } else if (assetType === 'bundles') {
            const proxyReq = http.request({
              host: '127.0.0.2',
              port: bundlesPort,
              path: req.url,
              method: req.method,
              headers: req.headers,
            }, (proxyRes) => {
              // Forward each incoming request to esbuild
              res.writeHead(proxyRes.statusCode, proxyRes.headers);
              proxyRes.pipe(res, { end: true });
            });
            // Forward the body of the request to esbuild
            req.pipe(proxyReq, { end: true });
          } else {
            res.writeHead(400);
            res.end();
          }
        }
      });
      httpServer.listen(opts.port, opts.ip);

      await new Promise<void>((resolve) => httpServer.once('listening', () => resolve()));
      console.log(`${
        chalk.greenBright(`Serving ${
          chalk.cyanBright(`./${opts.outDir}`)
        } at`)} ${
        chalk.yellowBright(`${opts.ip}:${opts.port}`)
      }`);
    }

    await waitForQuit();

    if (httpServer) {
      httpServer.close();
    }

    await Promise.all([
      bundlesContext.cancel()
        .then(() => bundlesContext.dispose()),
      tabsContext.cancel()
        .then(() => tabsContext.dispose()),
    ]);

    let app: Application | null = null;
    if (opts.docs) {
      ({ result: [app] } = await initTypedoc({
        srcDir: opts.srcDir,
        bundles: Object.keys(manifest),
        verbose,
      }, true));
    }

    let typedocProj: ProjectReflection | null = null;
    const buildDocs = async () => {
      if (!opts.docs) return [];
      typedocProj = app.convert();
      return buildJsons(typedocProj, {
        bundles: Object.keys(manifest),
        outDir: opts.outDir,
      });
    };

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
          .toISOString()}] ${chalk.gray(remoteAddress)} "${chalk.cyan(`${method} ${urlPath}`)}": Response Time: ${
          chalk.magentaBright(`${divideAndRound(timeInMS, 1000, 2)}s`)}`),
      });
      console.log(`${
        chalk.greenBright(`Serving ${
          chalk.cyanBright(`./${opts.outDir}`)
        } at`)} ${
        chalk.yellowBright(`${serveHost}:${servePort}`)
      }`);
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
*/
