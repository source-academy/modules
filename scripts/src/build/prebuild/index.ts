import {
  findSeverity,
  type BuildOptions,
  type Severity
} from '@src/build/utils';
import { promiseAll } from '@src/commandUtils';
import { eslintResultsLogger, runEslint } from './lint';
import { runTsc, tscResultsLogger } from './tsc';

interface PrebuildResult {
  lint?: Awaited<ReturnType<typeof runEslint>>;
  tsc?: Awaited<ReturnType<typeof runTsc>>;
  severity: Severity;
}

export default async function prebuild(
  bundles: string[],
  tabs: string[],
  { tsc, lint, ...opts }: Pick<BuildOptions, 'fix' | 'lint' | 'srcDir' | 'tsc'>
): Promise<PrebuildResult | null> {
  const combinedOpts = {
    ...opts,
    bundles,
    tabs
  };

  if (tsc) {
    if (!lint) {
      const tsc = await runTsc(combinedOpts);
      return {
        tsc,
        severity: tsc.result.severity
      };
    }

    const [tscResult, lintResult] = await promiseAll(
      runTsc(combinedOpts),
      runEslint(combinedOpts)
    );

    const overallSev = findSeverity(
      [tscResult, lintResult],
      ({ result: { severity } }) => severity
    );

    return {
      tsc: tscResult,
      lint: lintResult,
      severity: overallSev
    };
  }

  if (lint) {
    const lintResult = await runEslint(combinedOpts);
    return {
      lint: lintResult,
      severity: lintResult.result.severity
    };
  }
  return null;
}

export function formatPrebuildResults(results: PrebuildResult) {
  const output: string[] = [];
  if (results.tsc) {
    output.push(tscResultsLogger(results.tsc));
  }

  if (results.lint) {
    const lintResult = eslintResultsLogger(results.lint);
    output.push(lintResult);
  }

  return output.length > 0 ? output.join('\n') : null;
}
