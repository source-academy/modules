import { build as esbuild, type Plugin as ESBuildPlugin } from 'esbuild';
import type { ResolvedBundle, ResolvedTab } from '../../types.js';
import { commonEsbuildOptions, outputBundleOrTab } from './commons.js';

/**
 * Use ESBuild to compile a single bundle and write its output to the
 * build directory.
 */
export async function buildBundle(outDir: string, bundle: ResolvedBundle) {
  const { outputFiles: [result] } = await esbuild({
    ...commonEsbuildOptions,
    entryPoints: [`${bundle.directory}/src/index.ts`],
    tsconfig: `${bundle.directory}/tsconfig.json`,
    outfile: `/bundle/${bundle.name}`,
  });

  return outputBundleOrTab(result, bundle, outDir);
}

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

/**
 * Use ESBuild to compile a single tab and write its output to the
 * build directory.
 */
export async function buildTab(outDir: string, tab: ResolvedTab) {
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

  return outputBundleOrTab(result, tab, outDir);
}
