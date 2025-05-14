import fs from 'fs/promises';
import { build as esbuild } from 'esbuild';
import { commonEsbuildOptions, outputBundleOrTab } from './commons';
import pathlib from 'path';
import { getBundleManifest } from './manifest';

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
export async function buildBundle(bundleDir: string, outDir: string) {
  const fullyResolved = pathlib.resolve(bundleDir)
  const manifest = await getBundleManifest(fullyResolved)
  if (manifest === undefined) {
    throw new Error(`Could not find a bundle at ${fullyResolved}`)
  }

  const entryPoint = await getBundleEntryPoint(fullyResolved)
  const bundleName = pathlib.basename(fullyResolved)

  const { outputFiles: [result] } = await esbuild({
    ...commonEsbuildOptions,
    entryPoints: [entryPoint],
    tsconfig: `${fullyResolved}/tsconfig.json`,
    outfile: `/bundle/${bundleName}`,
  });

  await outputBundleOrTab(result, bundleName, 'bundle', outDir);
}
