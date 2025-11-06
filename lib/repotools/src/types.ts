export const severity = {
  ERROR: 'error',
  WARN: 'warn',
  SUCCESS: 'success'
} as const;

export type Severity = (typeof severity)[keyof typeof severity];

<<<<<<< HEAD
=======
/**
 * A bundle manifest, including the `version` field from `package.json`
 */
>>>>>>> workspaces-fix
export interface BundleManifest {
  requires?: number;
  version?: string;
  tabs?: string[];
}

<<<<<<< HEAD
export type ModulesManifest = {
=======
/**
 * The combined modules manifest. Keys are bundle names and values are their
 * corresponding {@link BundleManifest}.
 */
export interface ModulesManifest {
>>>>>>> workspaces-fix
  [name: string]: BundleManifest;
};

// #region ResolvedBundle
<<<<<<< HEAD
export interface ResolvedBundle {
  type: 'bundle';
  name: string;
  manifest: BundleManifest;
=======
/**
 * Represents all the information about a bundle.
 */
export interface ResolvedBundle {
  type: 'bundle';
  /**
   * The name of this bundle
   */
  name: string;

  /**
   * The {@link BundleManifest} corresponding to this bundle
   */
  manifest: BundleManifest;

  /**
   * The path to the directory that contains the bundle
   */
>>>>>>> workspaces-fix
  directory: string;
}
// #endregion ResolvedBundle

// #region ResolvedTab
/**
 * Represents all the information about a tab
 */
export interface ResolvedTab {
  type: 'tab';

  /**
   * The path to the directory that contains the tab
   */
  directory: string;

  /**
   * The path to the entry point file of the tab. This is either a `index.tsx` or `src/index.tsx`
   * file that is located in the tab's directory.
   */
  entryPoint: string;

  /**
   * Name of the tab
   */
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

/**
 * Represents the result of building a tab
 */
export type TabResult = ResultType & {
  type: 'tab';
  input: ResolvedTab;
};

/**
 * Represents the result of building a bundle
 */
export type BundleResult = ResultType & {
  type: 'bundle';
  input: ResolvedBundle;
};

/**
 * Represents the result of building JSON documentation
 */
export type DocsResult = ResultTypeWithWarn & {
  type: 'docs';
  input: ResolvedBundle;
};

export type BuildResult = BundleResult | DocsResult | TabResult;
