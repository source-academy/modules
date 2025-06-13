import fs from 'fs/promises';
import pathlib from 'path';
import { validate } from 'jsonschema';
import { getTabsDir } from '../getGitRoot.js';
import type { BundleManifest, ManifestResult, ModulesManifest, ResolvedBundle } from '../types.js';
import { isNodeError } from '../utils.js';
import { createBuilder } from './buildUtils.js';
import manifestSchema from './modules/manifest.schema.json' with { type: 'json' };
import { resolveSingleTab } from './modules/tab.js';

/**
 * Checks that the given bundle manifest was correctly specified
 */
export async function getBundleManifest(manifestFile: string, tabCheck?: boolean): Promise<BundleManifest | undefined> {
  let rawManifest: string;

  try {
    rawManifest = await fs.readFile(manifestFile, 'utf-8');
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }

  const data = JSON.parse(rawManifest) as BundleManifest;
  validate(data, manifestSchema.schema, { throwError: true });

  // Make sure that all the tabs specified exist
  if (tabCheck && data.tabs) {
    const tabsDir = await getTabsDir();
    await Promise.all(data.tabs.map(async tabName => {
      const resolvedTab = await resolveSingleTab(`${tabsDir}/${tabName}`);
      if (resolvedTab === undefined) throw new Error(`Failed to find tab with name '${tabName}'!`);
    }));
  }

  return data;
}

/**
 * Get all bundle manifests
 */
export async function getBundleManifests(bundlesDir: string): Promise<ModulesManifest> {
  let subdirs: string[] | null = null;
  try {
    subdirs = await fs.readdir(bundlesDir);
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return {};
    }

    throw error;
  }

  const manifests = await Promise.all(subdirs.map(async fileName => {
    const fullPath = pathlib.join(bundlesDir, fileName);
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      const manifest = await getBundleManifest(`${fullPath}/manifest.json`);
      if (manifest === undefined) return undefined;
      return [fileName, manifest] as [string, BundleManifest];
    }

    return undefined;
  }));

  return manifests.reduce((res, entry) => {
    if (entry === undefined) return res;

    const [name, manifest] = entry;

    return {
      ...res,
      [name]: manifest
    };
  }, {} as Record<string, BundleManifest>);
}

export async function resolveSingleBundle(bundleDir: string): Promise<ResolvedBundle | undefined> {
  const fullyResolved = pathlib.resolve(bundleDir);

  const stats = await fs.stat(fullyResolved);
  if (!stats.isDirectory()) return undefined;

  const manifest = await getBundleManifest(`${fullyResolved}/manifest.json`);
  if (!manifest) return undefined;

  try {
    const entryPoint = `${fullyResolved}/src/index.ts`;
    await fs.access(entryPoint, fs.constants.R_OK);
  } catch (error) {
    if (!isNodeError(error) || error.code !== 'ENOENT') throw error;
    return undefined;
  }

  const bundleName = pathlib.basename(fullyResolved);
  return {
    name: bundleName,
    manifest,
    directory: fullyResolved
  };
}

export async function resolveAllBundles(bundlesDir: string) {
  const subdirs = await fs.readdir(bundlesDir);
  const manifests = await Promise.all(subdirs.map(subdir => {
    const fullPath = pathlib.join(bundlesDir, subdir);
    return resolveSingleBundle(fullPath);
  }));

  return manifests.reduce((res, entry) => {
    if (entry === undefined) return res;

    return {
      ...res,
      [entry.name]: entry
    };
  }, {} as Record<string, ResolvedBundle>);
}

export async function resolvePaths(...paths: string[]) {
  for (const path of paths) {
    try {
      await fs.access(path, fs.constants.R_OK);
      return path;
    } catch (error) {
      if (isNodeError(error) && error.code !== 'ENOENT') throw error;
    }
  }

  return undefined;
}

export const {
  builder: writeManifest,
  formatter: formatManifestResult
} = createBuilder<[bundles: Record<string, ResolvedBundle>], ManifestResult>(async (outDir, resolvedBundles) => {
  try {
    const toWrite = Object.entries(resolvedBundles).reduce((res, [key, { manifest }]) => ({
      ...res,
      [key]: manifest
    }), {});
    const outpath = `${outDir}/modules.json`;
    await fs.writeFile(outpath, JSON.stringify(toWrite, null, 2));
    return [{
      severity: 'success',
      assetType: 'manifest',
      message: `Manifest written to ${outpath}`
    }];
  } catch (error) {
    return [{
      severity: 'error',
      assetType: 'manifest',
      message: `${error}`
    }];
  }
});
