import { promises as fs, type Dirent } from 'fs';
import pathlib from 'path';
import chalk from 'chalk';
import { ESLint } from 'eslint';
import { getGitRoot } from '../getGitRoot.js';
import { Severity, type InputAsset } from '../types.js';
import { findSeverity, flatMapAsync, isNodeError } from '../utils.js';

export interface LintResult {
  formatted: string
  severity: Severity
  input: InputAsset
}

function severityFinder({ warningCount, errorCount, fatalErrorCount, fixableWarningCount }: ESLint.LintResult, fix: boolean): Severity {
  if (fatalErrorCount > 0) return Severity.ERROR;
  if (!fix && errorCount > 0) return Severity.ERROR;

  if (warningCount > 0) {
    if (fix && fixableWarningCount === warningCount) {
      return Severity.SUCCESS;
    }
    return Severity.WARN;
  }
  return Severity.SUCCESS;
}

async function timePromise<T>(f: () => Promise<T>) {
  const start = performance.now();
  const result = await f();
  return {
    elapsed: performance.now() - start,
    result
  };
}

export async function runEslint(input: InputAsset, fix: boolean, stats: boolean): Promise<LintResult> {
  const gitRoot = await getGitRoot();
  const linter = new ESLint({
    fix,
    stats,
    cwd: gitRoot
  });

  try {
    const linterResults = await linter.lintFiles(input.directory);
    if (fix) {
      await ESLint.outputFixes(linterResults);
    }

    if (stats) {
      await fs.mkdir(`${gitRoot}/lintstats`, { recursive: true });

      const statsFormatter = await linter.loadFormatter('json');
      const statsFormatted = await statsFormatter.format(linterResults);
      const stringified = JSON.stringify(JSON.parse(statsFormatted), null, 2);

      await fs.writeFile(`${gitRoot}/lintstats/${input.type}-${input.name}.json`, stringified);
    }

    const outputFormatter = await linter.loadFormatter('stylish');
    const formatted = await outputFormatter.format(linterResults);

    const severity = findSeverity(linterResults, each => severityFinder(each, fix));

    return {
      formatted,
      severity,
      input
    };
  } catch (error) {
    return {
      severity: Severity.ERROR,
      formatted: `${error}`,
      input
    };
  }
}
export function formatLintResult({severity, formatted, input}: LintResult): string {
  const prefix = `${chalk.blueBright(`[${input.type} ${input.name}]:`)} ${chalk.cyanBright('Linting completed')}`;

  switch (severity) {
    case Severity.ERROR:
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.redBright('errors')}:\n${formatted}`;
    case Severity.WARN:
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.yellowBright('warnings')}:\n${formatted}`;
    case Severity.SUCCESS:
      return `${prefix} ${chalk.greenBright('successfully')}`;
  }
}

interface LintGlobalResults {
  severity: Severity
  formatted: string
  fixElapsed: number | undefined
  lintElapsed: number
  filesElapsed: number
}

/**
 * Function for linting the source directory excluding bundles and tabs. Since linting bundles and tabs
 * all together causes ESLint to run out of memory, we have this function that lints everything else
 * so that the bundles and tabs can be linted separately.
 */
export async function lintGlobal(fix: boolean): Promise<LintGlobalResults> {
  const gitRoot = await getGitRoot();

  const linter = new ESLint({ fix, cwd: gitRoot });

  /**
   * Recursively determine what files to to lint. Just supplying folder paths
   * doesn't quite work (they are still considered ignored) so we have to recurse
   * into every subfolder to get the full path of every file and check if it is
   * ignored
   *
   * @param filterSrc Filter out paths that contain `'src'`. Only necessary for the root directory.
   * Subsequent recursive calls are allowed to recurse into src directories
   */
  async function getFiles(dir: string, filterSrc: boolean): Promise<string[]> {
    let files: Dirent[];
    try {
      files = await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (!isNodeError(error) || error.code !== 'ENOTDIR') throw error;
      return [];
    }

    return flatMapAsync(files, async each => {
      if (filterSrc && each.name === 'src') return [];

      const fullPath = pathlib.join(dir, each.name);
      if (each.isFile()) {
        const isIgnored = await linter.isPathIgnored(fullPath);
        return isIgnored ? [] : [fullPath];
      }

      if (each.isDirectory()) {
        return getFiles(fullPath, false);
      }

      return [];
    });
  }

  const { result: toLint, elapsed: filesElapsed } = await timePromise(() => getFiles(gitRoot, true));
  const { result: lintResults, elapsed: lintElapsed } = await timePromise(() => flatMapAsync(toLint, each => linter.lintFiles(each)));

  let fixElapsed: number | undefined = undefined;
  if (fix) {
    ;({ elapsed: fixElapsed } = await timePromise(() => ESLint.outputFixes(lintResults)));
  }

  const formatter = await linter.loadFormatter('stylish');
  const formatted = await formatter.format(lintResults);

  const severity = findSeverity(lintResults, each => severityFinder(each, fix));

  return {
    formatted,
    severity,
    fixElapsed,
    lintElapsed,
    filesElapsed
  };
}
