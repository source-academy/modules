import fs from 'fs/promises';
import { build as esbuild } from 'esbuild';
import { bundlesOption, promiseAll } from '@src/commandUtils';
import { expandBundleNames, type BuildTask, createBuildCommandHandler, createBuildCommand } from '../utils';
import { commonEsbuildOptions, outputBundleOrTab, jsSlangExportCheckingPlugin, assertPolyfillPlugin } from './commons';

export const bundleBundles: BuildTask = async ({ bundles }, { srcDir, outDir }) => {
  const [{ outputFiles }] = await promiseAll(esbuild({
    ...commonEsbuildOptions,
    entryPoints: expandBundleNames(srcDir, bundles),
    outbase: outDir,
    outdir: outDir,
    plugins: [
      assertPolyfillPlugin,
      jsSlangExportCheckingPlugin
    ],
    tsconfig: `${srcDir}/tsconfig.json`
  }), fs.mkdir(`${outDir}/bundles`, { recursive: true }));

  const results = await Promise.all(outputFiles.map(file => outputBundleOrTab(file, outDir)));
  return { bundles: results };
};

const bundlesCommandHandler = createBuildCommandHandler((...args) => bundleBundles(...args));

export const getBuildBundlesCommand = () => createBuildCommand(
  'bundles',
  'Build bundles'
)
  .addOption(bundlesOption)
  .action(opts => bundlesCommandHandler({ ...opts, tabs: [] }));
