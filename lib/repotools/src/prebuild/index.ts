import fs from 'fs/promises';
import pathlib from 'path';
import { runEslint, type LintResult } from './lint.js';
import { runTypecheckingFromTsconfig } from '../build/tsc/index.js';
import type { InputAsset } from '../types.js';
import { compareSeverity } from '../utils.js';

export interface PrebuildOptions {
  tsc?: boolean;
  lint?: boolean;
  ci?: boolean;
}

type TypecheckResult = Awaited<ReturnType<typeof runTypecheckingFromTsconfig>> | undefined;

export interface RunPrebuildResult<T> {
  tsc: TypecheckResult;
  lint: LintResult | undefined;
  results?: T;
}

/**
 * Calls the provided builder alongside with the prebuild functions (tsc and linting)
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
  const promises: [Promise<TypecheckResult>, Promise<LintResult | undefined>] = [
    !tsc ? Promise.resolve(undefined) : runTypecheckingFromTsconfig(asset.directory),
    !lint ? Promise.resolve(undefined) : runEslint(asset),
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
    await fs.mkdir(pathlib.join(outDir, `${outputType}s`), { recursive: true });
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
export async function runPrebuild(asset: InputAsset) {
  const [tscResult, lintResult] = await Promise.all([
    runTypecheckingFromTsconfig(asset.directory),
    runEslint(asset)
  ]);

  return {
    tsc: tscResult,
    lint: lintResult
  };
}
