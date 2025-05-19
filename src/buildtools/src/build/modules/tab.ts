import fs from 'fs/promises';
import pathlib from 'path'
import { build as esbuild, type Plugin as ESBuildPlugin } from 'esbuild';
import { commonEsbuildOptions, outputBundleOrTab } from './commons';
import { resolvePaths, type ResolvedBundle } from '../manifest';

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

export async function getTabEntryPoint(tabDir: string) {
  let tabPath = `${tabDir}/src/index.tsx`
  try {
    await fs.access(tabPath, fs.constants.R_OK)
    return tabPath
  } catch {
    tabPath = `${tabPath}/index.tsx`
    await fs.access(tabPath, fs.constants.R_OK)
    return tabPath
  }
}

interface ResolvedTab {
  directory: string
  entryPoint: string
  name: string
}

export async function resolveSingleTab(tabDir: string): Promise<ResolvedTab> {
  const fullyResolved = pathlib.resolve(tabDir)

  const tabPath = await resolvePaths(
    `${fullyResolved}/src/index.tsx`,
    `${fullyResolved}/index.tsx`
  )

  if (tabPath === undefined) {
    throw new Error(`No tab found at ${fullyResolved}!`)
  }

  return {
    directory: fullyResolved,
    entryPoint: tabPath,
    name: pathlib.basename(fullyResolved)
  }
}

/**
 * Build a tab at the given directory
 */
export async function buildTab(tabDir: string, outDir: string) {
  const tab = await resolveSingleTab(tabDir)

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
        await buildTab(tabName, outDir)
      }))
    }
  }))
}
