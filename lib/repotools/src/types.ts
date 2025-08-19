export const severity = {
  ERROR: 'error',
  WARN: 'warn',
  SUCCESS: 'success'
} as const;

export type Severity = (typeof severity)[keyof typeof severity];

export interface BundleManifest {
  requires?: number;
  version?: string;
  tabs?: string[];
}

export type ModulesManifest = {
  [name: string]: BundleManifest;
};

// #region ResolvedBundle
export interface ResolvedBundle {
  type: 'bundle';
  name: string;
  manifest: BundleManifest;
  directory: string;
}
// #endregion ResolvedBundle

// #region ResolvedTab
export interface ResolvedTab {
  type: 'tab';
  directory: string;
  entryPoint: string;
  name: string;
}
// #endregion ResolvedTab

export interface ErrorResult {
  severity: 'error';
  errors: string[];
}

export type WarningResult<T = { path: string }> = {
  severity: 'warn';
  warnings: string[];
} & T;

export type SuccessResult<T = { path: string }> = {
  severity: 'success';
} & T;

export type InputAsset = ResolvedBundle | ResolvedTab;

export type ResultType<T = { path: string }> = ErrorResult | SuccessResult<T>;

export type ResultTypeWithWarn<T = { path: string }> = ResultType<T> | WarningResult<T>;

export type TabResult = ResultType & {
  type: 'tab';
  input: ResolvedTab;
};

export type BundleResult = ResultType & {
  type: 'bundle';
  input: ResolvedBundle;
};

export type DocsResult = ResultTypeWithWarn & {
  type: 'docs';
  input: ResolvedBundle;
};

export type BuildResult = BundleResult | DocsResult | TabResult;

export interface ResolutionFailure {
  severity: 'error';
  type: 'bundle' | 'tab';
  path: string;
  error?: string;
}
