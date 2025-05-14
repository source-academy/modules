import fs from 'fs/promises';
import pathlib from 'path'
import { build as esbuild, type Plugin as ESBuildPlugin } from 'esbuild';
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

/**
 * Build a tab at the given directory
 */
export async function buildTab(tabDir: string, outDir: string) {
  let tabPath = await getTabEntryPoint(tabDir)
  const fullyResolved = pathlib.resolve(tabDir)
  const tabName = pathlib.basename(fullyResolved)

  const { outputFiles: [result]} = await esbuild({
    ...commonEsbuildOptions,
    entryPoints: [tabPath],
    external: [
      ...commonEsbuildOptions.external,
      'react',
      'react-ace',
      'react-dom',
      'react/jsx-runtime',
      '@blueprintjs/*'
    ],
    outfile:`/tabs/${tabName}`,
    tsconfig: `${fullyResolved}/tsconfig.json`,
    plugins: [tabContextPlugin]
  });
  await outputBundleOrTab(result, tabName, 'tab', outDir);
}
