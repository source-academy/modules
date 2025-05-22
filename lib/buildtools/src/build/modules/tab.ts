import pathlib from 'path';
import { build as esbuild, type Plugin as ESBuildPlugin } from 'esbuild';
import { resolveAllBundles, resolvePaths, type ResolvedBundle } from '../manifest';
import { commonEsbuildOptions, outputBundleOrTab } from './commons';

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

interface ResolvedTab {
  directory: string
  entryPoint: string
  name: string
}

export async function resolveSingleTab(tabDir: string): Promise<ResolvedTab> {
  const fullyResolved = pathlib.resolve(tabDir);

  const tabPath = await resolvePaths(
    `${fullyResolved}/src/index.tsx`,
    `${fullyResolved}/index.tsx`
  );

  if (tabPath === undefined) {
    throw new Error(`No tab found at ${fullyResolved}!`);
  }

  return {
    directory: fullyResolved,
    entryPoint: tabPath,
    name: pathlib.basename(fullyResolved)
  };
}

export async function resolveAllTabs(bundlesDir: string, tabsDir: string) {
  const bundlesManifest = await resolveAllBundles(bundlesDir);

  const rawTabs = await Promise.all(
    Object.values(bundlesManifest).map(async ({ manifest }) => {
      if (manifest.tabs) {
        return Promise.all(manifest.tabs.map(async tabName => {
          const resolvedTab = await resolveSingleTab(pathlib.join(tabsDir, tabName));
          return resolvedTab;
        }));
      }

      return [];
    }));

  return rawTabs.reduce((res, tabs) => {
    return tabs.reduce((res, tab) => ({
      ...res,
      [tab.name]: tab
    }), res);
  }, {} as Record<string, ResolvedTab>);
}

/**
 * Build a tab at the given directory
 */
export async function buildTab(tabDir: string, outDir: string) {
  const tab = await resolveSingleTab(tabDir);

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
  await outputBundleOrTab(result, tab.name, 'tab', outDir);
}

export async function buildTabs(manifest: Record<string, ResolvedBundle>, outDir: string) {
  await Promise.all(Object.values(manifest).map(async ({ manifest: { tabs } }) => {
    if (tabs) {
      await Promise.all(tabs.map(async tabName => {
        await buildTab(tabName, outDir);
      }));
    }
  }));
}
