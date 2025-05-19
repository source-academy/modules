import fs from 'fs/promises';
import pathlib from 'path';
import { validate } from 'jsonschema';
import manifestSchema from './modules/manifest.schema.json' with { type: 'json' };
import { getBundleEntryPoint } from './modules/bundle';

export interface BundleManifest {
  version?: string
  tabs?: string[]
}

export type ModulesManifest = {
  [name: string]: BundleManifest
}

/**
 * Checks that the given bundle manifest was correctly specified
 */
export async function getBundleManifest(manifestFile: string, tabCheck?: boolean): Promise<BundleManifest | undefined> {
  let rawManifest: string

  try {
    rawManifest = await fs.readFile(manifestFile, 'utf-8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      return undefined
    }
    throw error
  }

  const data = JSON.parse(rawManifest) as BundleManifest;
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

/**
 * Get all bundle manifests
 */
export async function getBundleManifests(bundlesDir: string): Promise<ModulesManifest> {
  const subdirs = await fs.readdir(bundlesDir)
  const manifests = await Promise.all(subdirs.map(async fileName => {
    const fullPath = pathlib.join(bundlesDir, fileName);
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      const manifest = await getBundleManifest(`${fullPath}/manifest.json`);
      if (manifest === undefined) return undefined
      return [fileName, manifest] as [string, BundleManifest];
    }

    return undefined
  }))

   return manifests.reduce((res, entry) => {
    if (entry === undefined) return res;

    const [name, manifest] = entry

    return {
      ...res,
      [name]: manifest
    };
  }, {} as Record<string, BundleManifest>);
}

export interface ResolvedBundle {
  name: string
  manifest: BundleManifest
  entryPoint: string
  directory: string
}

export async function resolveSingleBundle(bundleDir: string): Promise<ResolvedBundle | undefined> {
  const fullyResolved = pathlib.resolve(bundleDir)

  const stats = await fs.stat(fullyResolved)
  if (!stats.isDirectory()) return undefined

  const manifest = await getBundleManifest(`${fullyResolved}/manifest.json`)
  if (!manifest) return undefined

  const bundleName = pathlib.basename(fullyResolved)
  const entryPoint = await getBundleEntryPoint(fullyResolved)

  return {
    name: bundleName,
    manifest,
    entryPoint,
    directory: fullyResolved
  }
}

export async function resolveAllBundles(bundlesDir: string) {
  const subdirs = await fs.readdir(bundlesDir)
  const manifests = await Promise.all(subdirs.map(subdir => {
    const fullPath = pathlib.join(bundlesDir, subdir)
    return resolveSingleBundle(fullPath)
  }))

  return manifests.reduce((res, entry) => {
    if (entry === undefined) return res

    return {
      ...res,
      [entry.name]: entry
    }
  }, {} as Record<string, ResolvedBundle>)
}
export async function resolvePaths(...paths: string[]) {
  for (const path of paths) {
    try {
      await fs.access(path, fs.constants.R_OK);
      return path
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  return undefined;
}
