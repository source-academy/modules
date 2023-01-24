export type Severity = 'success' | 'error' | 'warn';

export const Assets = ['bundle', 'tab', 'json'] as const;

/**
 * Type of assets that can be built
 */
export type AssetTypes = (typeof Assets)[number];

/**
 * Represents the result of doing an operation on a single asset
 */
export type OperationResult = {
  elapsed?: number;
  severity: Severity;
  error?: any;
};

/**
 * For Operation results that output files. Includes the size of the file written to disk
 */
export type BuildResult = {
  fileSize?: number;
} & OperationResult;

/**
 * Represents the result of a command's execution
 */
export type OverallResult<T> = {
  severity: Severity;
  results: T,
  error?: any;
};

/**
 * Represents the result of a build command's execution
 */
export type BuildOverallResult<T extends BuildResult = BuildResult> = OverallResult<Record<string, T>>;

/**
 * Represents the options the user can specify via options
 */
export type CommandInputs = {
  srcDir: string;
  manifest: string;
  modules?: string[];
  tabs?: string[];
  verbose: boolean;
};

/**
 * Represents the options the user can specify for build subcommands
 */
export type BuildCommandInputs = {
  outDir: string;
  tsc: boolean;
  lint: boolean;
} & CommandInputs;

/**
 * Specifiers to determine which bundles or tabs to build
 */
export type AssetParams = {
  modulesSpecified: boolean;
  bundles: string[];
  tabs: string[];
  manifest: string;
};

/**
 * Represents options passed to build subcommands without the asset specifiers
 */
export type BuildOpts = Omit<BuildCommandInputs, 'manifest' | 'modules' | 'tabs'>;

export type CommandHandler<U, T> = (opts: U, conf: AssetParams) => Promise<T>;
