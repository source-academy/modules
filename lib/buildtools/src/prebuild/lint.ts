import { ESLint } from 'eslint';
import { findSeverity, getGitRoot, type Severity } from '../utils';

interface LintResults {
  formatted: string
  severity: Severity
}

export async function runEslint(directory: string, fix: boolean): Promise<LintResults> {
  const linter = new ESLint({
    fix,
    cwd: await getGitRoot()
  });

  try {
    const linterResults = await linter.lintFiles(directory);
    if (fix) {
      await ESLint.outputFixes(linterResults);
    }

    const outputFormatter = await linter.loadFormatter('stylish');
    const formatted = await outputFormatter.format(linterResults);

    const severity = findSeverity(linterResults, ({ warningCount, errorCount, fatalErrorCount, fixableWarningCount }) => {

      if (fatalErrorCount > 0) return 'error';
      if (!fix && errorCount > 0) return 'error';

      if (warningCount > 0) {
        if (fix && fixableWarningCount === warningCount) {
          return 'success';
        }
        return 'warn';
      }
      return 'success';
    });

    return {
      formatted,
      severity
    };
  } catch (error) {
    return {
      severity: 'error',
      formatted: error.toString()
    };
  }
}
