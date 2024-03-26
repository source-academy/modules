import fs from 'fs/promises';
import { build as esbuild, type Plugin as ESBuildPlugin } from 'esbuild';
import { bundlesOption, promiseAll } from '@src/commandUtils';
import { expandBundleNames, type BuildTask, createBuildCommandHandler, createBuildCommand } from '../utils';
import { commonEsbuildOptions, outputBundleOrTab, jsSlangExportCheckingPlugin } from './commons';

const assertPolyfillPlugin: ESBuildPlugin = {
  name: 'Assert Polyfill',
  setup(build) {
    // Polyfill the NodeJS assert module
    build.onResolve({ filter: /^assert/u }, () => ({
      path: 'assert',
      namespace: 'bundleAssert'
    }));

    build.onLoad({
      filter: /^assert/u,
      namespace: 'bundleAssert'
    }, () => ({
      contents: `
      export default function assert(condition, message) {
        if (condition) return;

        if (typeof message === 'string' || message === undefined) {
          throw new Error(message);
        }

        throw message;
      }
      `
    }));
  }
};

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

const bundlesCommandHandler = createBuildCommandHandler((...args) => bundleBundles(...args), true);

export const getBuildBundlesCommand = () => createBuildCommand(
  'bundles',
  'Build bundles'
)
  .addOption(bundlesOption)
  .action(opts => bundlesCommandHandler({ ...opts, tabs: [] }));
