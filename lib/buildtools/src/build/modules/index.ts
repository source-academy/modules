import fs from 'fs/promises';
import { buildBundle } from './bundle';
import type { ResolvedBundle } from '../manifest';

/**
 * Writes the module manifest to the output directory
 */
export async function writeManifest(manifests: Record<string, ResolvedBundle>, outDir: string) {
  const toWrite = Object.entries(manifests).reduce((res, [key, { manifest }]) => ({
    ...res,
    [key]: manifest
  }), {})
  await fs.writeFile(`${outDir}/modules.json`, JSON.stringify(toWrite, null, 2))
}

/**
 * Search the given directory for valid bundles, then build and write
 * them to the given output directory,
 */
export async function buildBundles(manifests: Record<string, ResolvedBundle>, outDir: string) {
  await Promise.all(Object.values(manifests).map(async bundle => {
    await buildBundle(bundle, outDir);
  }))
}

export { buildBundle };
export { buildTab, buildTabs } from './tab';