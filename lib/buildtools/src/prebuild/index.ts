import fs from 'fs/promises';
import { Severity, type InputAsset, type ResolvedBundle, type ResolvedTab } from '../types.js';
import { compareSeverity } from '../utils.js';
import { runEslint, type LintResult } from './lint.js';
import { runTsc, type TscResult } from './tsc.js';

export type PrebuildOptions = {
  tsc?: boolean,
  lint?: boolean
  ci?: boolean
};

export interface RunPrebuildResult<T> {
  tsc: TscResult | undefined
  lint: LintResult | undefined
  results?: T
}

/**
 * Returns a function that calls the provider builder, alongside with the prebuild functions (tsc and linting)
 * if the corresponding prebuild options are provided.
 */
export async function runBuilderWithPrebuild<T extends InputAsset, U extends any[], V>(
  builder: (outDir: string, asset: T, ...args: U) => Promise<V>,
  { tsc, lint, ci }: PrebuildOptions,
  asset: T,
  outDir: string,
  outputType: 'bundle' | 'tab',
  ...args: U
): Promise<RunPrebuildResult<V>> {
  const promises: [Promise<TscResult | undefined>, Promise<LintResult | undefined>] = [
    !tsc ? Promise.resolve(undefined) : runTsc(asset, false),
    !lint ? Promise.resolve(undefined) : runEslint(asset, false, false),
  ];

  const [tscResult, lintResult] = await Promise.all(promises);
  const prebuildSeverity = compareSeverity(tscResult?.severity ?? Severity.SUCCESS, lintResult?.severity ?? Severity.SUCCESS);

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

/**
 * Run just tsc and ESLint simultaneously without running any build tasks
 */
export async function runPrebuild(asset: ResolvedBundle | ResolvedTab) {
  const [tscResult, lintResult] = await Promise.all([
    runTsc(asset, false),
    runEslint(asset, false, false)
  ]);

  return {
    tsc: tscResult,
    lint: lintResult
  };
}
