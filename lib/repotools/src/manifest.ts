import type { Dirent } from 'fs';
import fs from 'fs/promises';
import pathlib from 'path';
import { uniq } from 'es-toolkit';
import { validate } from 'jsonschema';
import { tabsDir } from './getGitRoot.js';
import manifestSchema from './manifest.schema.json' with { type: 'json' };
import type { BundleManifest, InputAsset, ResolvedBundle, ResolvedTab, ResultType } from './types.js';
import { filterAsync, isNodeError, mapAsync } from './utils.js';

export type GetBundleManifestResult = ResultType<{ manifest: BundleManifest }>;

const packageNameRegex = /^@sourceacademy\/(bundle|tab)-(.+)$/u;

/**
 * Checks that the given directory has contains a bundle and that it has the correct
 * format and structures. Returns `undefined` if no bundle was detected.
 */
export async function getBundleManifest(directory: string, tabCheck?: boolean): Promise<GetBundleManifestResult | undefined> {
  let manifestStr: string;
  const manifestPath = pathlib.join(directory, 'manifest.json');
  const bundleName = pathlib.basename(directory);

  try {
    manifestStr = await fs.readFile(manifestPath, 'utf-8');
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return undefined;
    }
    return { severity: 'error', errors: [`${error}`] };
  }

  const rawManifest = JSON.parse(manifestStr) as BundleManifest;
  const validateResult = validate(rawManifest, manifestSchema, { throwError: false });

  if (validateResult.errors.length > 0) {
    return {
      severity: 'error',
      errors: validateResult.errors.map(each => `${bundleName}: ${each.toString()}`)
    };
  }

  let versionStr: string | undefined;
  try {
    let packageName: string;
    const rawPackageJson = await fs.readFile(pathlib.join(directory, 'package.json'), 'utf-8')
      ; ({ version: versionStr, name: packageName } = JSON.parse(rawPackageJson));

    if (!packageNameRegex.test(packageName)) {
      return {
        severity: 'error',
        errors: [`${bundleName}: The package name "${packageName}" does not follow the correct format!`]
      };
    }

  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return undefined;
    }
    return { severity: 'error', errors: [`${error}`] };
  }

  const manifest: BundleManifest = {
    ...rawManifest,
    tabs: !rawManifest.tabs ? rawManifest.tabs : rawManifest.tabs.map(each => each.trim()),
    version: versionStr,
  };

  // Make sure that all the tabs specified exist
  if (tabCheck && manifest.tabs) {
    const unknownTabs = await filterAsync(manifest.tabs, async tabName => {
      const resolvedTab = await resolveSingleTab(pathlib.join(tabsDir, tabName));
      return resolvedTab === undefined;
    });

    if (unknownTabs.length > 0) {
      return {
        severity: 'error',
        errors: unknownTabs.map(each => `${bundleName}: Unknown tab "${each}"`)
      };
    }
  }

  return {
    severity: 'success',
    manifest
  };
}

export type GetAllBundleManifestsResult = ResultType<{ manifests: Record<string, BundleManifest> }>;

/**
 * Get all bundle manifests
 */
export async function getBundleManifests(bundlesDir: string, tabCheck?: boolean): Promise<GetAllBundleManifestsResult> {
  let subdirs: Dirent[];
  try {
    subdirs = await fs.readdir(bundlesDir, { withFileTypes: true });
  } catch (error) {
    return {
      severity: 'error',
      errors: [`${error}`]
    };
  }

  const manifests = await Promise.all(subdirs.map(async each => {
    const fullPath = pathlib.join(bundlesDir, each.name);
    if (each.isDirectory()) {
      const manifest = await getBundleManifest(fullPath, tabCheck);
      if (manifest === undefined) return undefined;
      return [each.name, manifest] as [string, typeof manifest];
    }

    return undefined;
  }));

  const [combinedManifests, errors] = manifests.reduce<[
    Record<string, BundleManifest>,
    string[]
  ]>(([res, errors], entry) => {
    if (entry === undefined) return [res, errors];
    const [name, manifest] = entry;

    if (manifest.severity === 'error') {
      return [
        res,
        [
          ...errors,
          ...manifest.errors
        ]
      ];
    }

    return [
      {
        ...res,
        [name]: manifest.manifest,
      },
      errors
    ];

  }, [{}, []]);

  if (errors.length > 0) {
    return {
      severity: 'error',
      errors,
    };
  }

  return {
    severity: 'success',
    manifests: combinedManifests
  };
}

type ResolveSingleBundleResult = ResultType<{ bundle: ResolvedBundle }>;

/**
 * Attempts to resolve the information at the given directory as a bundle. Returns `undefined` if no bundle was detected
 * at the given directory. Otherwise returns with either the manifest of the bundle or corresponding errors.
 */
export async function resolveSingleBundle(bundleDir: string): Promise<ResolveSingleBundleResult | undefined> {
  const fullyResolved = pathlib.resolve(bundleDir);
  const bundleName = pathlib.basename(fullyResolved);

  try {
    const stats = await fs.stat(fullyResolved);
    if (!stats.isDirectory()) {
      return {
        severity: 'error',
        errors: [`${fullyResolved} is not a directory!`]
      };
    }
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return {
        severity: 'error',
        errors: [`${fullyResolved} does not exist!`]
      };
    };

    return {
      severity: 'error',
      errors: [`An error occurred while trying to read from ${fullyResolved}: ${error}`]
    };
  }

  const manifest = await getBundleManifest(fullyResolved);
  if (!manifest || manifest.severity === 'error') return manifest;

  try {
    const entryPoint = pathlib.join(fullyResolved, 'src', 'index.ts');
    const entryStats = await fs.stat(entryPoint);

    if (!entryStats.isFile()) {
      return {
        severity: 'error',
        errors: [`${entryPoint} is not a file!`]
      };
    }
  } catch (error) {
    if (!isNodeError(error) || error.code !== 'ENOENT') throw error;
    return {
      severity: 'error',
      errors: ['Could not find entrypoint!']
    };
  }

  return {
    severity: 'success',
    bundle: {
      type: 'bundle',
      name: bundleName,
      manifest: manifest.manifest,
      directory: fullyResolved
    }
  };
}

type ResolveAllBundlesResult = ResultType<{ bundles: Record<string, ResolvedBundle> }>;

/**
 * Find all the bundles within the given directory and returns their
 * resolved information
 */
export async function resolveAllBundles(bundleDir: string): Promise<ResolveAllBundlesResult> {
  const subdirs = await fs.readdir(bundleDir, { withFileTypes: true });
  const manifests = await mapAsync(subdirs, async each => {
    if (!each.isDirectory()) return undefined;

    const fullPath = pathlib.join(bundleDir, each.name);
    return resolveSingleBundle(fullPath);
  });

  const [combinedManifests, errors] = manifests.reduce<[Record<string, ResolvedBundle>, any[]]>(([res, errors], entry) => {
    if (entry === undefined) return [res, errors];

    if (entry.severity === 'error') {
      return [
        res,
        [
          ...errors,
          ...entry.errors
        ]
      ];
    }

    return [
      {
        ...res,
        [entry.bundle.name]: entry.bundle
      },
      errors
    ];
  }, [{}, []]);

  if (errors.length > 0) {
    return {
      severity: 'error',
      errors
    };
  }

  return {
    severity: 'success',
    bundles: combinedManifests
  };
}

/**
 * From the array of given paths, return the first path that exists and
 * refers to either a directory or file depending on the `isDir` parameter
 *
 * @param isDir Set this to `true` to resolve to a directory. `false` resolves
 * to any file.
 * @returns `undefined` if the path resolved. Returns the path otherwise.
 */
async function resolvePaths(isDir: boolean, ...paths: string[]) {
  for (const path of paths) {
    try {
      const stat = await fs.stat(path);
      if (isDir && stat.isDirectory()) return path;
      if (!isDir && stat.isFile()) return path;
    } catch (error) {
      if (isNodeError(error) && error.code !== 'ENOENT') throw error;
    }
  }

  return undefined;
}

/**
 * Attempts to resolve the information at the given directory as a tab. Returns `undefined` if no tab was detected
 * at the given directory.
 */
export async function resolveSingleTab(tabDir: string): Promise<ResolvedTab | undefined> {
  const fullyResolved = pathlib.resolve(tabDir);

  try {
    const dirStats = await fs.stat(fullyResolved);
    if (!dirStats.isDirectory()) {
      return undefined;
    }
  } catch (error) {
    if (!isNodeError(error) || error.code !== 'ENOENT') throw error;

    return undefined;
  }

  const tabPath = await resolvePaths(
    false,
    pathlib.join(fullyResolved, 'src', 'index.tsx'),
    pathlib.join(fullyResolved, 'index.tsx')
  );

  if (tabPath === undefined) return undefined;

  return {
    type: 'tab',
    directory: fullyResolved,
    entryPoint: tabPath,
    name: pathlib.basename(fullyResolved)
  };
}

type ResolveAllTabsResult = ResultType<{ tabs: Record<string, ResolvedTab> }>;

/**
 * Find all the tabs within the given directory and returns their
 * resolved information
 */
export async function resolveAllTabs(bundlesDir: string, tabsDir: string): Promise<ResolveAllTabsResult> {
  const bundlesManifest = await resolveAllBundles(bundlesDir);
  if (bundlesManifest.severity === 'error') {
    return bundlesManifest;
  }

  const tabNames = uniq(Object.values(bundlesManifest.bundles).flatMap(({ manifest: { tabs } }) => tabs ?? []));

  const resolvedTabs = await Promise.all(tabNames.map(tabName => resolveSingleTab(pathlib.join(tabsDir, tabName))));

  const tabsManifest = resolvedTabs.reduce((res, tab) => tab === undefined
    ? res
    : {
      ...res,
      [tab.name]: tab
    }, {} as Record<string, ResolvedTab>);

  return {
    severity: 'success',
    tabs: tabsManifest
  };
}

type ResolveEitherResult = ResultType<{ asset: InputAsset }>;

/**
 * Attempts to resolve the given directory as a bundle or a tab. Returns an object with `asset: undefined`
 * if it was unable to do either. Otherwise, it returns the error(s) associated with resolving the bundle or tab
 */
export async function resolveEitherBundleOrTab(directory: string): Promise<ResolveEitherResult> {
  const bundle = await resolveSingleBundle(directory);
  if (!bundle) {
    const tab = await resolveSingleTab(directory);
    if (tab === undefined) {
      return {
        severity: 'error',
        errors: [],
      };
    }

    return {
      severity: 'success',
      asset: tab
    };
  }

  if (bundle.severity === 'error') {
    return {
      severity: 'error',
      errors: bundle.errors,
    };
  }

  return {
    severity: 'success',
    asset: bundle.bundle
  };
}
