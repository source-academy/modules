import pathlib from 'path';
import { build as esbuild, type Plugin as ESBuildPlugin } from 'esbuild';
import uniq from 'lodash/uniq.js';
import type { PrebuildOptions } from '../../prebuild/index.js';
import { runBuilderWithPrebuild } from '../../prebuild/index.js';
import type { FullResult, ResolvedBundle, ResolvedTab, TabResultEntry } from '../../types.js';
import { createBuilder } from '../buildUtils.js';
import { resolveAllBundles, resolvePaths } from '../manifest.js';
import { commonEsbuildOptions, outputBundleOrTab } from './commons.js';

const tabContextPlugin: ESBuildPlugin = {
  name: 'Tab Context',
  setup(build) {
    build.onResolve({ filter: /^js-slang\/context/ }, () => ({
      errors: [{
        text: 'If you see this message, it means that your tab code is importing js-slang/context directly or indirectly. Do not do this'
      }]
    }));
  }
};

export async function resolveSingleTab(tabDir: string): Promise<ResolvedTab | undefined> {
  const fullyResolved = pathlib.resolve(tabDir);
  const tabPath = await resolvePaths(
    `${fullyResolved}/src/index.tsx`,
    `${fullyResolved}/index.tsx`
  );

  if (tabPath === undefined) return undefined;

  return {
    directory: fullyResolved,
    entryPoint: tabPath,
    name: pathlib.basename(fullyResolved)
  };
}

export async function resolveAllTabs(bundlesDir: string, tabsDir: string) {
  const bundlesManifest = await resolveAllBundles(bundlesDir);
  const tabNames = uniq(Object.values(bundlesManifest).flatMap(({ manifest: { tabs} }) => tabs ?? []));

  const resolvedTabs = await Promise.all(tabNames.map(tabName => resolveSingleTab(`${tabsDir}/${tabName}`)));

  return resolvedTabs.reduce((res, tab) => tab === undefined
    ? res
    : {
      ...res,
      [tab.name]: tab
    }, {} as Record<string, ResolvedTab>);
}

/**
 * Build a tab at the given directory
 */
export const {
  builder: buildTab,
  formatter: formatTabResult
} = createBuilder<[tab: ResolvedTab], TabResultEntry>(async (outDir, tab) => {
  const { outputFiles: [result]} = await esbuild({
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
    tsconfig: `${tab.directory}/tsconfig.json`,
    plugins: [tabContextPlugin],
  });
  const resultEntry = await outputBundleOrTab(result, tab.name, 'tab', outDir);
  return [resultEntry];
});

/**
 * Find all the tabs within the given directory and build them all at once
 */
export function buildTabs(resolvedBundles: Record<string, ResolvedBundle>, tabsDir: string, prebuildOpts: PrebuildOptions, outDir: string) {
  const tabNames = uniq(Object.values(resolvedBundles).flatMap(({ manifest: { tabs } }) => tabs ?? []));
  return Promise.all(
    tabNames.map(async (tabName): Promise<FullResult> => {
      const tab = await resolveSingleTab(`${tabsDir}/${tabName}`);
      if (!tab) {
        return [
          [{
            severity: 'error',
            assetType: 'tab',
            inputName: tabName,
            message: `Could not find tab at ${tabsDir}/${tabName}!`
          }],
          {}
        ];
      }

      return runBuilderWithPrebuild(buildTab, prebuildOpts, tab, outDir);
    }));
}
