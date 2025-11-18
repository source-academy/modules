import type { LogLevel } from "typedoc";
import type { InputAsset, ResolvedBundle, ResolvedTab, Severity } from "../types.js";
import { buildBundle, buildTab } from "./modules/index.js";
import { buildSingleBundleDocs } from "./docs/index.js";
import { compareSeverity } from "../utils.js";
import { runTypecheckingFromTsconfig } from "./tsc/index.js";
import { runEslint, type LintResult } from "../prebuild/lint.js";
import type { PrebuildOptions } from "../prebuild/index.js";

type TypecheckResult = Awaited<ReturnType<typeof runTypecheckingFromTsconfig>>;

interface BuildAllTabResult {
  diagnostics: Awaited<ReturnType<typeof buildTab>>;
}

interface BuildAllBundleResult {
  diagnostics: Awaited<ReturnType<typeof buildBundle>>;
  docs: Awaited<ReturnType<typeof buildSingleBundleDocs>>;
}

export type BuildAllResult<
  TResult extends BuildAllBundleResult | BuildAllTabResult = BuildAllBundleResult | BuildAllTabResult
> = {
  severity: Severity;
  lint: LintResult | undefined;
  tsc: TypecheckResult | undefined;
} & ({
  diagnostics: undefined
} | TResult);

/**
 * For a bundle, builds both the bundle itself and its JSON documentation\
 * For a tab, build just the tab
 */
export async function buildAll(input: ResolvedBundle, prebuild: PrebuildOptions, outDir: string, logLevel: LogLevel): Promise<BuildAllResult<BuildAllBundleResult>>
export async function buildAll(input: ResolvedTab, prebuild: PrebuildOptions, outDir: string, logLevel: LogLevel): Promise<BuildAllResult<BuildAllTabResult>>
export async function buildAll(input: InputAsset, prebuild: PrebuildOptions, outDir: string, logLevel: LogLevel): Promise<BuildAllResult>
export async function buildAll(input: InputAsset, prebuild: PrebuildOptions, outDir: string, logLevel: LogLevel): Promise<BuildAllResult> {
  const [tscResult, lintResult] = await Promise.all([
    prebuild.tsc ? runTypecheckingFromTsconfig(input.directory) : Promise.resolve(undefined),
    prebuild.lint ? runEslint(input) : Promise.resolve(undefined)
  ]);

  if (tscResult?.severity === 'error' || lintResult?.severity === 'error') {
    return {
      severity: 'error',
      lint: lintResult,
      tsc: tscResult,
      diagnostics: undefined
    };
  }

  if (input.type === 'bundle') {
    const [bundleResult, docsResult] = await Promise.all([
      buildBundle(outDir, input, false),
      buildSingleBundleDocs(input, outDir, logLevel)
    ]);

    return {
      severity: compareSeverity(bundleResult.severity, docsResult.severity),
      diagnostics: bundleResult,
      docs: docsResult,
      lint: lintResult,
      tsc: tscResult,
    };
  } else {
    const tabResult = await buildTab(outDir, input, false);
    return {
      severity: tabResult.severity,
      diagnostics: tabResult,
      lint: lintResult,
      tsc: tscResult,
    };
  }
}