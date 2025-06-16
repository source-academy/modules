import fs from 'fs/promises';
import type { ResolvedTab, ResolvedBundle, ResultEntry, ModuleResultEntry, FullResult } from '../types.js';
import { compareSeverity } from '../utils.js';
import { runEslint, type LintResults } from './lint.js';
import { runTsc, type TscResult } from './tsc.js';

export type PrebuildOptions = {
  tsc?: boolean,
  lint?: boolean
  ci?: boolean
};

/**
 * Returns a function that calls the provider builder, alongside with the prebuild functions (tsc and linting)
 * if the corresponding prebuild options are provided.
 */
export async function runBuilderWithPrebuild<T extends ResolvedBundle | ResolvedTab, U extends any[], V extends (ResultEntry | ResultEntry[])>(
  builder: (outDir: string, asset: T, ...args: U) => Promise<V>,
  { tsc, lint, ci }: PrebuildOptions,
  asset: T,
  outDir: string,
  outputType: ModuleResultEntry['assetType'] | undefined,
  ...args: U
): Promise<FullResult<V>> {
  const promises: [Promise<TscResult | undefined>, Promise<LintResults | undefined>] = [
    !tsc ? Promise.resolve(undefined) : runTsc(asset),
    !lint ? Promise.resolve(undefined) : runEslint(asset, false),
  ];

  const [tscResult, lintResult] = await Promise.all(promises);
  const prebuildSeverity = compareSeverity(tscResult?.severity ?? 'success', lintResult?.severity ?? 'success');

  if (prebuildSeverity === 'error' || (ci && prebuildSeverity !== 'success')) {
    // If prebuild had errors don't run the builder function after
    return {
      tsc: tscResult,
      lint: lintResult
    };
  }

  if (outputType !== undefined) {
    await fs.mkdir(`${outDir}/${outputType}s`, { recursive: true });
  }

  const results = await builder(outDir, asset, ...args);

  return {
    results,
    tsc: tscResult,
    lint: lintResult
  };
}
