import { build as esbuild } from 'esbuild';
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

    return outputBundleOrTab(result, bundle.name, 'bundle', outDir);
  }
);
