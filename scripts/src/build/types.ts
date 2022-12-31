import type { BuildIncremental, Metafile } from 'esbuild';
import type { Low } from 'lowdb';

export type Severity = 'success' | 'error' | 'warn';

export const Assets = ['bundle', 'tab', 'json'] as const;

/**
 * Type of assets that can be built
 */
export type AssetTypes = (typeof Assets)[number];

type AssetRecord<T> = { html: T } & Record<`${AssetTypes}s`, Record<string, T>>;

export type DBData = AssetRecord<number>;

export type DBType = Low<DBData>;

export type ESBuildOutput = BuildIncremental & { metafile: Metafile };

export type BuildResult = {
  severity: Severity;
  error?: any;
  fileSize?: number;
};
