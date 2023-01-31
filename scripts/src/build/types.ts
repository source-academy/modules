export type Severity = 'success' | 'error' | 'warn';

export const Assets = ['bundle', 'tab', 'json'] as const;

/**
 * Type of assets that can be built
 */
export type AssetTypes = typeof Assets[number];

export type OperationResult = {
  severity: Severity;
  error?: any;
};

export type BuildResult = {
  elapsed?: number;
  fileSize?: number;
} & OperationResult;

export type OverallResult<T extends OperationResult = OperationResult> = {
  severity: Severity;
  results: Record<string, T>;
} | null;

export type UnreducedResult = [AssetTypes, string, BuildResult];

export type CommandInputs = {
  srcDir: string;
  verbose: boolean;
  manifest: string;
  modules: string[] | null;
  tabs: string[] | null;
};

export type BuildCommandInputs = {
  outDir: string;
  tsc: boolean;
  lint: boolean;
} & CommandInputs;



export type BuildOptions = Omit<BuildCommandInputs, 'lint' | 'tsc' | 'manifest' | 'verbose'>;

export type AssetInfo = {
  bundles: string[];
  tabs: string[];
  modulesSpecified: boolean;
};
