import type { ValidationError } from 'jsonschema';
import type { BundleManifest, ResolvedBundle, ResolvedTab } from '../../types.js';

export interface GetBundleManifestError {
  severity: 'error';
  errors: (ValidationError | unknown)[];
}

export interface GetBundleManifestSuccess {
  severity: 'success';
  manifest: BundleManifest;
}

export type GetBundleManifestResult = GetBundleManifestError | GetBundleManifestSuccess | undefined;

interface ResolveSingleBundleSuccess {
  severity: 'success';
  bundle: ResolvedBundle;
}

export type ResolveSingleBundleError = GetBundleManifestError;

export type ResolveSingleBundleResult = ResolveSingleBundleError | ResolveSingleBundleSuccess | undefined;

export type ResolveAllBundlesError = GetBundleManifestError;

interface ResolveAllBundlesSuccess {
  severity: 'success',
  bundles: Record<string, ResolvedBundle>
}

export type ResolveAllBundlesResult = ResolveAllBundlesError | ResolveAllBundlesSuccess;

interface ResolveAllTabsSuccess {
  severity: 'success'
  tabs: Record<string, ResolvedTab>
}

export type ResolveAllTabsError = GetBundleManifestError;
export type ResolveAllTabsResult = ResolveAllTabsError | ResolveAllTabsSuccess;

export class MissingTabError extends Error {
  constructor(public readonly name: string) { super(); }

  [Symbol.toStringTag]() {
    return `Failed to find tab with name ${this.name}`;
  }
}

export class MissingEntryPointError extends Error {
  constructor(
    public readonly assetType: 'bundle' | 'tab',
    public readonly name: string
  ) { super(); }

  [Symbol.toStringTag]() {
    return `Failed to find entry point for ${this.assetType} ${this.name}`;
  }
}
