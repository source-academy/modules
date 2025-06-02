import { build as esbuild } from 'esbuild';
import { collateResults, type BuildResult } from '../../utils';
import { resolvePaths, type ResolvedBundle } from '../manifest';
import { commonEsbuildOptions, outputBundleOrTab } from './commons';

export function getBundleEntryPoint(bundleDir: string) {
  return resolvePaths(
    `${bundleDir}/src/index.ts`,
    `${bundleDir}/index.ts`,
  );
}

/**
 * Build the given resolved bundle
 */
export async function buildBundle(bundle: ResolvedBundle, outDir: string): Promise<BuildResult> {
  const { outputFiles: [result] } = await esbuild({
    ...commonEsbuildOptions,
    entryPoints: [bundle.entryPoint],
    tsconfig: `${bundle.directory}/tsconfig.json`,
    outfile: `/bundle/${bundle.name}`,
  });

  return outputBundleOrTab(result, bundle.name, 'bundle', outDir);
}

export async function buildBundles(resolvedBundles: Record<string, ResolvedBundle>, outDir: string): Promise<BuildResult> {
  const results = await Promise.all(Object.values(resolvedBundles).map(bundle => buildBundle(bundle, outDir)));
  return collateResults(results);
}
