import fs from 'fs/promises';
import { build as esbuild } from 'esbuild';
import { commonEsbuildOptions, outputBundleOrTab } from './commons';
import type { BundleManifest } from './manifest';

export async function getBundleEntryPoint(bundleDir: string) {
  let bundlePath = `${bundleDir}/src/index.ts`

  try {
    await fs.access(bundlePath, fs.constants.R_OK)
    return bundlePath
  } catch (error) {
    bundlePath = `${bundleDir}/index.ts`
    await fs.access(bundlePath, fs.constants.R_OK)
    return bundlePath
  }
}

/**
 * Build a bundle at the given directory
 */
export async function buildBundle(bundleDir: string, manifest: BundleManifest, outDir: string) {
  const entryPoint = await getBundleEntryPoint(bundleDir)
  const { outputFiles: [result] } = await esbuild({
    ...commonEsbuildOptions,
    entryPoints: [entryPoint],
    tsconfig: `${bundleDir}/tsconfig.json`,
    outfile: `/bundle/${manifest.name}`,
  });

  await outputBundleOrTab(result, outDir);
}
