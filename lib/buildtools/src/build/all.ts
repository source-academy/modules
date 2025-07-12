import type { LogLevel } from 'typedoc';
import type { PrebuildOptions } from '../prebuild/index.js';
import { runEslint, type LintResult } from '../prebuild/lint.js';
import { runTsc, type TscResult } from '../prebuild/tsc.js';
import { Severity, type BuildResult, type InputAsset } from '../types.js';
import { compareSeverity } from '../utils.js';
import { buildSingleBundleDocs } from './docs/index.js';
import { buildBundle, buildTab } from './modules/index.js';

interface BuildAllPrebuildError {
  severity: Severity.ERROR

  tsc: TscResult | undefined
  lint: LintResult | undefined
}

interface BuildAllBundleResult {
  severity: Severity
  results: BuildResult
  docs: BuildResult

  tsc: TscResult | undefined
  lint: LintResult | undefined
}

interface BuildAllTabResult {
  severity: Severity
  results: BuildResult

  tsc: TscResult | undefined
  lint: LintResult | undefined
}

export type BuildAllResult = BuildAllPrebuildError | BuildAllBundleResult | BuildAllTabResult;

/**
 * For a bundle, builds both the bundle itself and its JSON documentation\
 * For a tab, build just the tab
 */
export async function buildAll(input: InputAsset, prebuild: PrebuildOptions, outDir: string, logLevel: LogLevel): Promise<BuildAllResult> {
  const [tscResult, lintResult] = await Promise.all([
    prebuild.tsc ? runTsc(input, true) : Promise.resolve(undefined),
    prebuild.lint ? runEslint(input, false, false) : Promise.resolve(undefined)
  ]);

  if (tscResult?.severity === Severity.ERROR || lintResult?.severity === Severity.ERROR) {
    return {
      severity: Severity.ERROR,
      lint: lintResult,
      tsc: tscResult
    };
  }

  if (input.type === 'bundle') {
    const [bundleResult, docsResult] = await Promise.all([
      buildBundle(outDir, input),
      buildSingleBundleDocs(input, outDir, logLevel)
    ]);

    return {
      severity: compareSeverity(bundleResult.severity, docsResult.severity),
      results: bundleResult,
      docs: docsResult,
      lint: lintResult,
      tsc: tscResult,
    };
  } else {
    const tabResult = await buildTab(outDir, input);
    return {
      severity: tabResult.severity,
      results: tabResult,
      lint: lintResult,
      tsc: tscResult,
    };
  }
}
