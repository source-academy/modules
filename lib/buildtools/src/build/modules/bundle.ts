import fs from 'fs/promises';
import { build as esbuild } from 'esbuild';
import type { ResolvedBundle } from '../manifest';
import { commonEsbuildOptions, outputBundleOrTab } from './commons';

export async function getBundleEntryPoint(bundleDir: string) {
  let bundlePath = `${bundleDir}/src/index.ts`;

  try {
    await fs.access(bundlePath, fs.constants.R_OK);
    return bundlePath;
  } catch {
    bundlePath = `${bundleDir}/index.ts`;
    await fs.access(bundlePath, fs.constants.R_OK);
    return bundlePath;
  }
}

/**
 * Build the given resolved bundle
 */
export async function buildBundle(bundle: ResolvedBundle, outDir: string) {
  const { outputFiles: [result] } = await esbuild({
    ...commonEsbuildOptions,
    entryPoints: [bundle.entryPoint],
    tsconfig: `${bundle.directory}/tsconfig.json`,
    outfile: `/bundle/${bundle.name}`,
  });

  await outputBundleOrTab(result, bundle.name, 'bundle', outDir);
}
