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

export interface ResolvedBundle {
  name: string;
  manifest: BundleManifest;
  directory: string;
}

export interface ResolvedTab {
  directory: string;
  entryPoint: string;
  name: string;
}

interface BaseResult {
  message: string,
  severity: Severity
}

export interface HTMLResult extends BaseResult {
  assetType: 'html'
}

export interface ManifestResult extends BaseResult {
  assetType: 'manifest'
}

interface ModuleResult extends BaseResult {
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

export type ModuleResultEntry = BundleResultEntry | JsonResultEntry | TabResultEntry;

export type ResultEntry = HTMLResult | ManifestResult | ModuleResultEntry;

export type ResultFormatter<T extends ResultEntry, U extends any[] = []> = (entry: T, ...args: U) => string;

export interface FullResult<T extends (ResultEntry | ResultEntry[])> {
  results?: T;
  tsc?: TscResult;
  lint?: LintResults
}
