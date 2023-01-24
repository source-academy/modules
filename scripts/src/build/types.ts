export type Severity = 'success' | 'error' | 'warn';

export const Assets = ['bundle', 'tab', 'json'] as const;

/**
 * Type of assets that can be built
 */
export type AssetTypes = typeof Assets[number];

export type BuildResult = {
  elapsed?: number;
  fileSize?: number;
  severity: Severity;
  error?: any
};

export type OverallResult = {
  severity: Severity;
  results: Record<string, BuildResult>;
};

export type UnreducedResult = [AssetTypes, string, BuildResult];

export type BuildCommandInputs = {
  srcDir: string;
  outDir: string;
  manifest: string;
  verbose: boolean;
};

export type AssetInfo = {
  bundles: string[];
  tabs: string[];
  modulesSpecified: boolean;
};
