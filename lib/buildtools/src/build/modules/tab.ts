import { build as esbuild, type Plugin as ESBuildPlugin } from 'esbuild';
import type { ResolvedTab, TabResultEntry } from '../../types.js';
import { createBuilder } from '../buildUtils.js';
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
  return outputBundleOrTab(result, tab.name, 'tab', outDir);
});
