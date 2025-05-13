import fs from 'fs/promises';
import pathlib from 'path';
import { buildBundle } from './bundle';
import { getBundleManifests } from './manifest';

/**
 * Search the given directory for valid bundles, then build and write
 * them to the given output directory, along with the modules manifest
 */
export async function buildBundles(directory: string, outDir: string) {
  const manifests = await getBundleManifests(directory)
  await Promise.all(Object.values(manifests).map(async manifest => {
    const fullPath = pathlib.join(directory, manifest.name)
    await buildBundle(fullPath, manifest, outDir);
  }))

  await fs.writeFile(`${outDir}/modules.json`, JSON.stringify(manifests));
}

export { buildBundle };
export { buildTab } from './tab';