import pathlib from 'path';
import { endBuildPlugin } from '@sourceacademy/modules-repotools/builder';
import type { BuildResult, ResolvedBundle, ResolvedTab } from '@sourceacademy/modules-repotools/types';
import * as esbuild from 'esbuild';
import { builderPlugin, commonEsbuildOptions, getBundleContextPlugin, outputBundleOrTab } from './commons.js';

/**
 * Use ESBuild to compile a single bundle and write its output to the
 * build directory.
 */
export async function buildBundle(outDir: string, bundle: ResolvedBundle, watch: true): Promise<void>;
export async function buildBundle(outDir: string, bundle: ResolvedBundle, watch: false): Promise<BuildResult>;
export async function buildBundle(outDir: string, bundle: ResolvedBundle, watch: boolean) {
  const bundleOptions = {
    ...commonEsbuildOptions,
    entryPoints: [pathlib.join(bundle.directory, 'src', 'index.ts')],
    tsconfig: pathlib.join(bundle.directory, 'tsconfig.json'),
    outfile: pathlib.join(outDir, 'bundles', `${bundle.name}.js`),
    plugins: [getBundleContextPlugin(bundle.name)]
  } satisfies esbuild.BuildOptions;

  if (watch) {
    const buildContext = await esbuild.context({
      ...bundleOptions,
      plugins: [
        builderPlugin(bundle, outDir),
        endBuildPlugin
      ]
    });
    return buildContext.watch();
  }

  const { outputFiles: [result] } = await esbuild.build(bundleOptions);
  return outputBundleOrTab(result, bundle, outDir);
}

const tabContextPlugin: esbuild.Plugin = {
  name: 'Tab Context',
  setup(build) {
    build.onResolve({ filter: /^js-slang\/context/ }, () => ({
      errors: [{
        text: 'If you see this message, it means that your tab code is importing js-slang/context directly or indirectly. Do not do this'
      }]
    }));
  }
};

/**
 * Use ESBuild to compile a single tab and write its output to the
 * build directory.
 */
export async function buildTab(outDir: string, tab: ResolvedTab, watch: true): Promise<void>;
export async function buildTab(outDir: string, tab: ResolvedTab, watch: false): Promise<BuildResult>;
export async function buildTab(outDir: string, tab: ResolvedTab, watch: boolean) {
  const tabOptions = {
    ...commonEsbuildOptions,
    entryPoints: [tab.entryPoint],
    external: [
      ...commonEsbuildOptions.external,
      'react',
      'react-ace',
      'react-dom',
      'react/jsx-runtime',
      '@blueprintjs/*'
    ],
    tsconfig: pathlib.join(tab.directory, 'tsconfig.json'),
    outfile: pathlib.join(outDir, 'tabs', `${tab.name}.js`),
    plugins: [tabContextPlugin],
  } satisfies esbuild.BuildOptions;

  if (watch) {
    tabOptions.plugins.push(builderPlugin(tab, outDir));
    tabOptions.plugins.push(endBuildPlugin);

    const buildContext = await esbuild.context(tabOptions);
    return buildContext.watch();
  } else {
    const { outputFiles: [result] } = await esbuild.build(tabOptions);
    return outputBundleOrTab(result, tab, outDir);
  }
}
