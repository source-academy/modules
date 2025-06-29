import type { LintResults } from './prebuild/lint.js';
import type { TscResult } from './prebuild/tsc.js';
import type { Severity } from './utils.js';

export interface BundleManifest {
  version?: string;
  tabs?: string[];
}

export type ModulesManifest = {
  [name: string]: BundleManifest;
};

// #region ResolvedBundle
export interface ResolvedBundle {
  type: 'bundle'
  name: string;
  manifest: BundleManifest;
  directory: string;
}
// #endregion ResolvedBundle

// #region ResolvedTab
export interface ResolvedTab {
  type: 'tab'
  directory: string;
  entryPoint: string;
  name: string;
}
// #endregion ResolvedTab

interface BaseResult<T = string> {
  message: T,
  severity: Severity
}

export interface HTMLResult extends BaseResult {
  assetType: 'html'
}

export interface ManifestResult extends BaseResult {
  assetType: 'manifest'
}

interface ModuleResult<T = string> extends BaseResult<T> {
  inputName: string
}

export interface BundleResultEntry extends ModuleResult {
  assetType: 'bundle'
}

export interface TabResultEntry extends ModuleResult {
  assetType: 'tab'
}

export interface JsonResultEntry extends ModuleResult {
  assetType: 'json'
}

export interface ManifestResultEntry extends ModuleResult {
  assetType: 'manifest'
}

export type ModuleResultEntry = BundleResultEntry | JsonResultEntry | ManifestResultEntry | TabResultEntry;

export type ResultEntry = HTMLResult | ManifestResult | ModuleResultEntry;

export type ResultFormatter<T extends ResultEntry, U extends any[] = []> = (entry: T, ...args: U) => string;

export interface FullResult<T extends (ResultEntry | ResultEntry[])> {
  results?: T;
  tsc?: TscResult;
  lint?: LintResults
}
