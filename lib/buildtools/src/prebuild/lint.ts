import { promises as fs, type Dirent } from 'fs';
import pathlib from 'path';
import { bundlesDir, gitRoot, outDir, tabsDir } from '@sourceacademy/modules-repotools/getGitRoot';
import type { InputAsset, Severity } from '@sourceacademy/modules-repotools/types';
import { findSeverity, flatMapAsync, isNodeError } from '@sourceacademy/modules-repotools/utils';
import chalk from 'chalk';
import { ESLint } from 'eslint';

export interface LintResult {
  formatted: string
  severity: Severity
  input: InputAsset
}

function severityFinder({ warningCount, errorCount, fatalErrorCount, fixableWarningCount }: ESLint.LintResult, fix: boolean): Severity {
  if (fatalErrorCount > 0) return 'error';
  if (!fix && errorCount > 0) return 'error';

  if (warningCount > 0) {
    if (fix && fixableWarningCount === warningCount) {
      return 'success';
    }
    return 'warn';
  }
  return 'success';
}

async function timePromise<T>(f: () => Promise<T>) {
  const start = performance.now();
  const result = await f();
  return {
    elapsed: performance.now() - start,
    result
  };
}

// #region runEslint
export async function runEslint(input: InputAsset, fix: boolean, stats: boolean): Promise<LintResult> {
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
      const lintstatsDir = pathlib.join(outDir, 'lintstats');
      await fs.mkdir(lintstatsDir, { recursive: true });

      const csvFormatter = await linter.loadFormatter(pathlib.join(import.meta.dirname, '../../lintplugin/dist/formatter.js'));
      const csvFormatted = await csvFormatter.format(linterResults);
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(pathlib.join(lintstatsDir, `${input.type}-${input.name}.csv`), csvFormatted);
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
      severity: 'error',
      formatted: `${error}`,
      input
    };
  }
}
// #endregion runEslint

export function formatLintResult({ severity, formatted, input }: LintResult): string {
  const prefix = `${chalk.blueBright(`[${input.type} ${input.name}]:`)} ${chalk.cyanBright('Linting completed')}`;

  switch (severity) {
    case 'error':
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.redBright('errors')}:\n${formatted}`;
    case 'warn':
      return `${prefix} ${chalk.cyanBright('with')} ${chalk.yellowBright('warnings')}:\n${formatted}`;
    case 'success':
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
export async function lintGlobal(fix: boolean, stats: boolean): Promise<LintGlobalResults> {
  const linter = new ESLint({ fix, stats, cwd: gitRoot });

  /**
   * Recursively determine what files to to lint. Just supplying folder paths
   * doesn't quite work (they are still considered ignored) so we have to recurse
   * into every subfolder to get the full path of every file and check if it is
   * ignored
   */
  async function getFiles(dir: string, noRecurse: boolean): Promise<string[]> {
    let files: Dirent[];
    try {
      files = await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (!isNodeError(error) || error.code !== 'ENOTDIR') throw error;
      return [];
    }

    return flatMapAsync(files, async each => {
      const fullPath = pathlib.join(dir, each.name);

      if (each.isFile()) {
        const isIgnored = await linter.isPathIgnored(fullPath);
        return isIgnored ? [] : [fullPath];
      }

      if (each.isDirectory() && !noRecurse) {
        // If we're in the tabs or bundles directory, then we're only allowed
        // to lint files. No recursing into directories
        if (fullPath === bundlesDir || fullPath === tabsDir) {
          return getFiles(fullPath, true);
        }
        return getFiles(fullPath, false);
      }

      return [];
    });
  }

  const { result: toLint, elapsed: filesElapsed } = await timePromise(() => getFiles(gitRoot, false));
  const { result: lintResults, elapsed: lintElapsed } = await timePromise(() => flatMapAsync(toLint, each => linter.lintFiles(each)));

  let fixElapsed: number | undefined = undefined;
  if (fix) {
    ;({ elapsed: fixElapsed } = await timePromise(() => ESLint.outputFixes(lintResults)));
  }

  const formatter = await linter.loadFormatter('stylish');
  const formatted = await formatter.format(lintResults);

  if (stats) {
    const csvFormatter = await linter.loadFormatter(pathlib.join(import.meta.dirname, '../../lintplugin/dist/formatter.js'));
    const csvFormatted = await csvFormatter.format(lintResults);
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(pathlib.join(outDir, 'lintstats.csv'), csvFormatted);
  }

  const severity = findSeverity(lintResults, each => severityFinder(each, fix));

  return {
    formatted,
    severity,
    fixElapsed,
    lintElapsed,
    filesElapsed
  };
}
