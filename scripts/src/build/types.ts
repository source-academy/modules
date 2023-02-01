export type Severity = 'success' | 'error' | 'warn';

export const Assets = ['bundle', 'tab', 'json'] as const;

/**
 * Type of assets that can be built
 */
export type AssetTypes = typeof Assets[number];

/**
 * Represents the result of a single operation (like building a single bundle)
 */
export type OperationResult = {
  /**
   * Overall success of operation
   */
  severity: Severity;

  /**
   * Any warning or error messages
   */
  error?: any;
};

/**
 * Represents the result of an operation that results in a file written to disk
 */
export type BuildResult = {
  /**
   * Time taken (im milliseconds) for the operation to complete
   */
  elapsed?: number;

  /**
   * Size (in bytes) of the file written to disk
   */
  fileSize?: number;
} & OperationResult;

/**
 * Represents the collective result of a number of operations (like `buildJsons`)
 */
export type OverallResult<T extends OperationResult = OperationResult> = {
  severity: Severity;
  results: Record<string, T>;
} | null;

/**
 * A different form of `buildResult` with the associated asset type and name.
 */
export type UnreducedResult = [AssetTypes, string, BuildResult];

/**
 * Options common to all commands
 */
export type CommandInputs = {
  /**
   * Directory containing source files
   */
  srcDir: string;

  /**
   * Enable verbose logging
   */
  verbose: boolean;

  /**
   * Location of the manifest file
   */
  manifest: string;

  /**
   * String array containing the modules the user specified, or `null` if they specified none
   */
  modules: string[] | null;

  /**
   * String array containing the tabs the user specified, or `null` if they specified none
   */
  tabs: string[] | null;
};

/**
 * Options specific to commands that output files
 */
export type BuildCommandInputs = {
  outDir: string;
  tsc: boolean;
} & CommandInputs;

/**
 * Options that are passed to command handlers
 */
export type BuildOptions = Omit<BuildCommandInputs, 'lint' | 'tsc' | 'manifest' | 'verbose'>;

/**
 * Specifies which bundles and tabs are to be built
 */
export type AssetInfo = {
  bundles: string[];
  tabs: string[];
  modulesSpecified: boolean;
};
