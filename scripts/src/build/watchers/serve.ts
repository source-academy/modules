import chalk from 'chalk';
import { Command, InvalidArgumentError } from 'commander';
import { context as esbuild } from 'esbuild';
import fs from 'fs/promises';
import path from 'path';

import { retrieveManifest } from '../../scriptUtils';
import { divideAndRound } from '../buildUtils';
import { buildJsons, initTypedoc, logJsonResults } from '../docs';
import { logBundleResults, logTabResults, reduceModuleResults, reduceOutputFiles } from '../modules';
import { esbuildOptions } from '../modules/moduleUtils';

import { waitForQuit } from './watchUtils';

type ServeOpts = {
  srcDir: string;
  outDir: string;
  manifest: string;
  docs: boolean;
  typecheck: boolean;
  port: number;
  verbose: boolean;
  ip: string;
};

const serveCommand = new Command('serve')
  .description('Use esbuild\'s internal http server to serve modules.'
  + ' All assets are rebuilt every time a http request is made.'
  + ' If this is too slow for you, use the watch command with yarn serve instead')
  .option('--outDir <outdir>', 'Output directory', 'build')
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--manifest <file>', 'Manifest file', 'modules.json')
  .option('--no-docs', 'Don\'t build HTML documentation')
  .option('--no-typecheck', 'Don\'t run tsc before building each asset')
  .option('-v, --verbose', 'Display more information about the build results', false)
  .option('-i, --ip', 'Host interface to bind to', '0.0.0.0')
  .option('-p, --port', 'Port to bind for the server to bind to', (value) => {
    const parsedInt = parseInt(value);
    if (isNaN(parsedInt) || parsedInt < 1 || parsedInt > 65535) {
      throw new InvalidArgumentError(`Expected port to be a valid number between 1-65535, got ${value}!`);
    }
    return parsedInt;
  }, 8022)
  .action(async ({ verbose, ...opts }: ServeOpts) => {
    const [manifest] = await Promise.all([
      retrieveManifest(opts.manifest),
      fs.mkdir(`${opts.outDir}/bundles/`, { recursive: true }),
      fs.mkdir(`${opts.outDir}/tabs/`, { recursive: true }),
      fs.mkdir(`${opts.outDir}/jsons/`, { recursive: true }),
      fs.copyFile(opts.manifest, `${opts.outDir}/${opts.manifest}`),
    ]);

    // const { result: [app] } = await initTypedoc({
    //   bundles: Object.keys(manifest),
    //   srcDir: opts.srcDir,
    //   verbose,
    // }, true);

    // app.convertAndWatch(async (project) => {
    //   const jsonsResult = await buildJsons(project, {
    //     bundles: Object.keys(manifest),
    //     outDir: opts.outDir,
    //   });

    //   logJsonResults(jsonsResult, verbose);
    // });

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
          let startTime: number;
          pluginBuild.onStart(() => {
            console.log(chalk.magentaBright('Beginning build...'));
            startTime = performance.now();
          });

          pluginBuild.onEnd(async ({ outputFiles }) => {
            const results = await reduceOutputFiles(outputFiles, opts.outDir, startTime);
            const { bundles: bundleResults, tabs: tabResults } = reduceModuleResults(results);

            logBundleResults(bundleResults, verbose);
            logTabResults(tabResults, verbose);

            const { result: [,project] } = await initTypedoc({
              srcDir: opts.srcDir,
              bundles: Object.keys(bundleResults.results),
              verbose,
            });

            const jsonsResult = await buildJsons(project, {
              bundles: Object.keys(bundleResults.results),
              outDir: opts.outDir,
            });

            logJsonResults(jsonsResult, verbose);
            console.log(chalk.gray('Build Complete\n'));
          });
        },
      }],
    });

    await context.watch();

    const { host, port: servePort } = await context.serve({
      servedir: opts.outDir,
      port: opts.port,
      host: opts.ip,
      onRequest: ({ method, path: urlPath, remoteAddress, timeInMS }) => console.log(`[${new Date()
        .toISOString()}] ${chalk.gray(remoteAddress)} "${chalk.cyan(`${method} ${urlPath}`)}": Response Time: ${
        chalk.magentaBright(`${divideAndRound(timeInMS, 1000, 2)}s`)}`),
    });
    console.log(`${
      chalk.greenBright(`Serving ${
        chalk.cyanBright(`./${opts.outDir}`)
      } at`)} ${
      chalk.yellowBright(`${host}:${servePort}`)
    }\nPress CTRL+C to stop\n`);
    await waitForQuit();

    console.log(chalk.yellowBright('Stopping server...'));
    await context.dispose();
  });

export default serveCommand;
