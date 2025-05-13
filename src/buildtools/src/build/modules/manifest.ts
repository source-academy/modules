import fs from 'fs/promises';
import pathlib from 'path';
import { validate } from 'jsonschema';
import manifestSchema from './manifest.schema.json' with { type: 'json' };

export interface BundleManifest {
  name: string
  version?: string
  tabs?: string[]
}

export type ModulesManifest = {
  [name: string]: BundleManifest
}

/**
 * Checks that the given bundle manifest was correctly specified
 */
export async function getBundleManifest(manifestFile: string, tabCheck?: boolean): Promise<BundleManifest> {
  const data = JSON.parse(await fs.readFile(manifestFile, 'utf-8')) as BundleManifest;
  const { valid, errors } = validate(data, manifestSchema);

  if (!valid) throw errors;

  // Make sure that all the tabs specified exist
  if (tabCheck && data.tabs) {
    await Promise.all(data.tabs.map(async tabName => {
      try {
        await fs.access(`./src/tabs/${tabName}`, fs.constants.R_OK);
      } catch {
        throw new Error(`Failed to find tab with name '${tabName}'!`);
      }
    }));
  }

  return data;
}

export function getEmptyManifest(bundleName: string): BundleManifest {
  return { name: bundleName };
}

export async function getBundleManifests(bundlesDir: string): Promise<ModulesManifest> {
  const subdirs = await fs.readdir(bundlesDir)
  const manifests = await Promise.all(subdirs.map(async fileName => {
    const fullPath = pathlib.join(bundlesDir, fileName);
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      const manifest = await getBundleManifest(`${fullPath}/manifest.json`);
      return manifest;
    }

    return undefined
  }))

   return manifests.reduce((res, manifest) => {
    if (manifest === undefined) return res;

    return {
      ...res,
      [manifest.name]: manifest
    };
  }, {} as Record<string, BundleManifest>);
}