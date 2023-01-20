import chalk from 'chalk';
import { Command } from 'commander';
import { context as esbuild } from 'esbuild';
import fs from 'fs/promises';
import pathlib from 'path';

import { retrieveManifest } from '../../scriptUtils';
import { buildHtml, initTypedoc, logHtmlResult } from '../docs';
import { buildJson } from '../docs/json';
import { outputBundle } from '../modules/bundle';
import { esbuildOptions } from '../modules/moduleUtils';
import { outputTab } from '../modules/tab';

import { waitForQuit } from './watchUtils';

// const runTsc = (tscProgram: ts.Program, entry: string) => {
//   const file = tscProgram.getSourceFileByPath(entry as ts.Path);
//   const { diagnostics } = tscProgram.emit(file);
//   const preEmitDiagnostics = ts.getPreEmitDiagnostics(tscProgram)
//     .concat(diagnostics);

//   if (preEmitDiagnostics.length > 0) {
//     console.log(chalk.redBright('Type checking produced errors:'));

//     const parsedDiagnostics = preEmitDiagnostics.map((diagnostic) => {
//       const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
//       const msg = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

//       // Simulate tsc's output
//       return `${chalk.cyan(entry)}:${chalk.yellow(line)}:${chalk.yellow(character)} - ${chalk.red('error')} ${chalk.gray(`TS${diagnostic.code}`)}: ${msg}`;
//     });

//     console.log(`${parsedDiagnostics.join('\n')}\n`);
//     return false;
//   }
//   return true;
// };

type WatchOptions = {
  srcDir: string;
  outDir: string;
  manifest: string;
  docs: boolean;
  typecheck: boolean;
  verbose: boolean;
};

const watchCommand = new Command('watch')
  .description('Watch the source directory and rebuild whenever there are changes')
  .option('--outDir <outdir>', 'Output directory', 'build')
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--manifest <file>', 'Manifest file', 'modules.json')
  .option('--no-docs', 'Don\'t build HTML documentation')
  .option('--no-typecheck', 'Don\'t run tsc before building each asset')
  .option('-v, --verbose', 'Display more information about the build results', false)
  .action(async (opts: WatchOptions) => {
    const [manifest] = await Promise.all([
      retrieveManifest(opts.manifest),
      fs.mkdir(`${opts.outDir}/bundles/`, { recursive: true }),
      fs.mkdir(`${opts.outDir}/tabs/`, { recursive: true }),
      fs.mkdir(`${opts.outDir}/jsons/`, { recursive: true }),
      fs.copyFile(opts.manifest, `${opts.outDir}/${opts.manifest}`),
    ]);

    console.log(`Watching source directory ${chalk.yellowBright(`./${opts.srcDir}`)} for changes\nPress CTRL+C to quit at any time\n`);

    const abortController = new AbortController();
    const buildPromises = Object.entries(manifest)
      .flatMap(([bundle, { tabs }]) => [
        (async () => {
          const bundleDir = pathlib.join(opts.srcDir, 'bundles', bundle);
          const bundleEntry = pathlib.join(bundleDir, 'index.ts');
          const [ctx, { result: [app] }] = await Promise.all([esbuild({
            ...esbuildOptions,
            outbase: opts.outDir,
            outdir: opts.outDir,
            entryPoints: [bundleEntry],
          }),
          initTypedoc({
            srcDir: opts.srcDir,
            bundles: [bundle],
            verbose: opts.verbose,
          }, true)]);

          app.convertAndWatch(async (project) => {
            const { result: { severity, error } } = await buildJson(bundle, project as any, opts.outDir);
            if (severity === 'error') {
              console.log(chalk.redBright(`Rebuild json for '${bundle}' failed: ${error}`));
            } else if (severity === 'warn') {
              console.log(chalk.yellowBright(`Rebuilt json for '${bundle}' with warnings: ${error}`));
            } else {
              console.log(chalk.greenBright(`Successfully rebuilt json for '${bundle}'`));
            }
          });

          try {
            // eslint-disable-next-line no-empty-pattern
            for await (const {} of fs.watch(bundleDir, {
              recursive: true,
              signal: abortController.signal,
            })) {
              console.log(chalk.magentaBright(`Bundle ${bundle} changed, rebuilding...`));
              const { outputFiles: [{ text }] } = await ctx.rebuild();

              // const [bundleResult, jsonResult] = await Promise.all([
              //   outputBundle(bundle, text, opts.outDir),
              //   initTypedoc({
              //     ...opts,
              //     bundles: [bundle],
              //   })
              //     .then(
              //       ({ result: [, project] }) => buildJson(bundle,
              //         project as any,
              //         opts.outDir),
              //     ),
              // ]);

              const bundleResult = await outputBundle(bundle, text, opts.outDir);

              if (bundleResult.severity === 'error') {
                console.log(chalk.redBright(`Rebuild for '${bundle}' failed: ${bundleResult.error}`));
              } else {
                console.log(chalk.greenBright(`Successfully rebuilt '${bundle}`));
              }

              // if (jsonResult.result.severity === 'error') {
              //   console.log(chalk.redBright(`Rebuild json for '${bundle}' failed: ${jsonResult.result.error}`));
              // } else if (jsonResult.result.severity === 'warn') {
              //   console.log(chalk.yellowBright(`Rebuilt json for '${bundle}' with warnings: ${jsonResult.result.error}`));
              // } else {
              //   console.log(chalk.greenBright(`Successfully rebuilt json for '${bundle}'`));
              // }
            }
          } catch (error) {

          } finally {
            await ctx.dispose();
          }
        })(),
        ...tabs.map(async (tabName) => {
          const tabDir = pathlib.join(opts.srcDir, 'tabs', tabName);
          const ctx = await esbuild({
            ...esbuildOptions,
            outbase: opts.outDir,
            outdir: opts.outDir,
            entryPoints: [pathlib.join(tabDir, 'index.tsx')],
          });

          try {
            // eslint-disable-next-line no-empty-pattern
            for await (const {} of fs.watch(tabDir, {
              recursive: true,
              signal: abortController.signal,
            })) {
              console.log(chalk.magentaBright(`Tab '${tabName}' changed, rebuilding...`));
              const { outputFiles: [{ text }] } = await ctx.rebuild();

              const result = await outputTab(tabName, text, opts.outDir);
              if (result.severity === 'error') {
                console.log(chalk.redBright(`Rebuild for '${tabName}' failed: ${result.error}`));
              } else {
                console.log(chalk.greenBright(`Successfully rebuilt '${tabName}`));
              }
            }
          } catch (error) {

          } finally {
            await ctx.dispose();
          }
        }),
      ]);

    await waitForQuit();
    abortController.abort();

    await Promise.all(buildPromises);

    console.log(chalk.magentaBright('Running final tasks...'));
    if (opts.docs) {
      const { result: [app, project] } = await initTypedoc({
        bundles: Object.keys(manifest),
        srcDir: opts.srcDir,
        verbose: opts.verbose,
      });
      const htmlResult = await buildHtml(app, project, {
        modulesSpecified: false,
        outDir: opts.outDir,
      });
      logHtmlResult(htmlResult);
    }
  });


export default watchCommand;
export { default as serveCommand } from './serve';

/* An implementation using fs.watch but watching only the source directory
  const contextPromises = Object.entries(manifest)
    .flatMap(([bundle, { tabs }]) => [
      [
        'bundle',
        bundle,
        esbuild({
          ...esbuildOptions,
          outbase: buildOpts.outDir,
          outdir: buildOpts.outDir,
          entryPoints: [pathlib.join(buildOpts.srcDir, 'bundles', bundle, 'index.ts')],
        }),
      ],
      ...tabs.map((tabName) => [
        'tab',
        tabName,
        esbuild({
          ...esbuildOptions,
          outbase: buildOpts.outDir,
          outdir: buildOpts.outDir,
          entryPoints: [pathlib.join(buildOpts.srcDir, 'tabs', tabName, 'index.tsx')],
        }),
      ]),
    ], [] as ['bundle' | 'tab', string, ReturnType<typeof esbuild>][]);

  const rawContexts = await Promise.all(contextPromises.map(async ([type, name, promise]) => [type, name, await promise] as ['bundle' | 'tab', string, Awaited<ReturnType<typeof esbuild>>]));

  const contexts: Record<'bundles' | 'tabs', Record<string, Awaited<ReturnType<typeof esbuild>>>> = rawContexts
    .reduce((res, [type, name, context]) => {
      res[type][name] = context;
      return res;
    }, {
      bundles: {},
      tabs: {},
    });

  try {
    for await (const { filename } of fs.watch(buildOpts.srcDir, {
      recursive: true,
      signal: abortController.signal,
    })) {
      const [,type, name] = pathlib.relative('src', filename)
        .split(pathlib.sep);

      if (type !== 'tabs' && type !== 'bundles') {
        // do something
        return;
      }

      if (type === 'tabs') {
        const context = contexts.tabs[name];
        const { outputFiles: [{ text }] } = await context.rebuild();
        const { severity, error } = await outputTab(name, text, buildOpts);

        if (severity === 'error') {
          console.log(chalk.redBright(`Failed to rebuild tab '${name}': ${error}`));
        } else {
          console.log(chalk.greenBright(`Successfully rebuilt tab '${name}'`));
        }
      } else if (type === 'bundles') {
        console.log(chalk.yellowBright(`Bundle '${name}' changed, rebuilding...`));
        const context = contexts.bundles[name];
        const { outputFiles: [{ text }] } = await context.rebuild();
        const { severity, error } = await outputBundle(name, text, buildOpts);

        if (severity === 'error') {
          console.log(chalk.redBright(`Failed to rebuild bundle '${name}': ${error}`));
        } else {
          console.log(chalk.greenBright(`Successfully rebuilt bundle '${name}'`));
        }
      }
    }
  } catch (error) {

  } finally {
    await Promise.all(rawContexts.map(([,, context]) => context.dispose()));
  }
  */

/* An implementation with esbuild's serve
  const context = await esbuild({
    ...esbuildOptions,
    outbase: buildOpts.outDir,
    outdir: buildOpts.outDir,
    entryPoints: buildOpts.bundles.map((bundle) => `${buildOpts.srcDir}/bundles/${bundle}/index.ts`)
      .concat(buildOpts.tabs.map((tabName) => `${buildOpts.srcDir}/tabs/${tabName}/index.tsx`)),
    plugins: [{
      name: 'Sourceror',
      setup(pluginBuild) {
        let startTime: number;
        pluginBuild.onStart(() => {
          startTime = performance.now();
        });

        pluginBuild.onEnd(async ({ outputFiles }) => {
          const results = await reduceOutputFiles(outputFiles, buildOpts, startTime);
          const { bundles: bundleResults, tabs: tabResults } = reduceModuleResults(results);

          logBundleResults(bundleResults);
          logTabResults(tabResults);

          const docOpts = {
            ...buildOpts,
            bundles: Object.keys(bundleResults.results),
          };

          const { result: [,project] } = await initTypedoc(docOpts);

          const [jsonsResult] = await Promise.all([
            buildJsons(project, docOpts),
            fs.copyFile(buildOpts.manifest, `${buildOpts.outDir}/${buildOpts.manifest}`),
          ]);

          logJsonResults(jsonsResult);
        });
      },
    }],
  });
  const { host, port } = await context.serve({
    servedir: buildOpts.outDir,
    port: 8022,
  });
  console.log(chalk.greenBright(`Serving modules at ${host}:${port}`));
  await quitPromise;
  await context.dispose();
*/
