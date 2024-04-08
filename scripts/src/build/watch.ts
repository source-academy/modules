import fs from 'fs/promises';
import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { context as esbuild, type BuildContext } from 'esbuild';
import { manifestOption, outDirOption, promiseAll, retrieveBundlesAndTabs, srcDirOption } from '@src/commandUtils';
import { buildHtml, buildJsons } from './docs';
import { initTypedoc } from './docs/docsUtils';
import { assertPolyfillPlugin, commonEsbuildOptions, jsSlangExportCheckingPlugin, outputBundleOrTab } from './modules/commons';
import { tabContextPlugin } from './modules/tabs';
import { expandBundleNames, expandTabNames, logInputs, processResults } from './utils';

/**
 * Wait until the user presses 'ctrl+c' on the keyboard
 */
const waitForQuit = () => new Promise<void>((resolve, reject) => {
  process.stdin.setRawMode(true);
  process.stdin.on('data', data => {
    const byteArray = [...data];
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C');
      process.stdin.setRawMode(false);
      resolve();
    }
  });
  process.stdin.on('error', reject);
});

export default function getWatchCommand() {
  return new Command('watch')
    .description('Watch the source directory and rebuild on changes')
    .addOption(srcDirOption)
    .addOption(outDirOption)
    .addOption(manifestOption)
    .option('-v, --verbose')
    .action(async opts => {
      const [inputs] = await promiseAll(
        retrieveBundlesAndTabs(opts.manifest, null, null),
        fs.mkdir(opts.outDir).then(() => fs.copyFile(opts.manifest, `${opts.outDir}/modules.json`))
      );
      console.log(logInputs(inputs, {}));

      let bundlesContext: BuildContext | null = null;
      let tabsContext: BuildContext | null = null;

      try {
        await promiseAll(
          fs.mkdir(`${opts.outDir}/bundles`),
          fs.mkdir(`${opts.outDir}/tabs`),
          fs.mkdir(`${opts.outDir}/jsons`),
        )

        ;([bundlesContext, tabsContext] = await promiseAll(
          esbuild({
            ...commonEsbuildOptions,
            entryPoints: expandBundleNames(opts.srcDir, inputs.bundles),
            outbase: opts.outDir,
            outdir: opts.outDir,
            plugins: [
              assertPolyfillPlugin,
              jsSlangExportCheckingPlugin,
              {
                name: 'Bundles output',
                setup(build) {
                  build.onStart(() => {
                    console.log(chalk.magentaBright('Beginning bundles build...'));
                  });
                  build.onEnd(async ({ outputFiles }) => {
                    const rawResults = await Promise.all(outputFiles.map(file => outputBundleOrTab(file, opts.outDir)));
                    processResults({ bundles: rawResults }, opts.verbose, false);
                  });
                }
              }
            ],
            tsconfig: `${opts.srcDir}/tsconfig.json`
          }),
          esbuild({
            ...commonEsbuildOptions,
            entryPoints: expandTabNames(opts.srcDir, inputs.tabs),
            outbase: opts.outDir,
            outdir: opts.outDir,
            plugins: [
              tabContextPlugin,
              jsSlangExportCheckingPlugin,
              {
                name: 'Tabs output',
                setup(build) {
                  build.onStart(() => {
                    console.log(chalk.magentaBright('Beginning tabs build...'));
                  });

                  build.onEnd(async ({ outputFiles }) => {
                    const rawResults = await Promise.all(outputFiles.map(file => outputBundleOrTab(file, opts.outDir)));
                    processResults({ tabs: rawResults }, opts.verbose, false);
                  });
                },
              }],
            tsconfig: `${opts.srcDir}/tsconfig.json`
          }),
          initTypedoc(inputs.bundles, opts.srcDir, opts.verbose, true).then(([, app]) => {
            app.convertAndWatch(async proj => {
              const [jsonResults, htmlResult] = await promiseAll(
                buildJsons(inputs, opts.outDir, proj),
                buildHtml(inputs, opts.outDir, [proj, app])
              );

              processResults({
                ...jsonResults,
                html: htmlResult
              }, opts.verbose, false);
            });
          })));

        console.log(chalk.yellowBright(`Watching ${chalk.cyanBright(`./${opts.srcDir}`)} for changes\nPress CTRL + C to stop`));
        await waitForQuit();

        console.log(chalk.yellowBright('Quitting!'));
        await promiseAll(
          bundlesContext.cancel(),
          tabsContext.cancel(),
        );
      } finally {
        await promiseAll(
          bundlesContext?.dispose(),
          tabsContext?.dispose(),
        );
      }
      // So that the typedoc watcher stops running
      process.exit();
    });
}
