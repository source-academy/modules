import { build as esbuild } from 'esbuild';
import type { PrebuildOptions } from '../../prebuild/index.js';
import { runBuilderWithPrebuild } from '../../prebuild/index.js';
import type { BundleResultEntry, ResolvedBundle } from '../../types.js';
import { createBuilder } from '../buildUtils.js';
import { commonEsbuildOptions, outputBundleOrTab } from './commons.js';

export const {
  builder: buildBundle,
  formatter: formatBundleResult,
} = createBuilder<[bundle: ResolvedBundle], BundleResultEntry>(
  async (outDir, bundle) => {
    const { outputFiles: [result] } = await esbuild({
      ...commonEsbuildOptions,
      entryPoints: [`${bundle.directory}/src/index.ts`],
      tsconfig: `${bundle.directory}/tsconfig.json`,
      outfile: `/bundle/${bundle.name}`,
    });

    const resultEntry = await outputBundleOrTab(result, bundle.name, 'bundle', outDir);
    return [resultEntry];
  }
);

export function buildBundles(resolvedBundles: Record<string, ResolvedBundle>, options: PrebuildOptions, outDir: string) {
  return Promise.all(Object.values(resolvedBundles).map(bundle => runBuilderWithPrebuild(buildBundle, options, bundle, outDir, undefined)));
}
