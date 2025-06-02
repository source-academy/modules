import chalk from 'chalk';

export type AwaitedReturn<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

export interface BuildResult {
  severity: Severity;
  warnings: string[]
  errors: string[]
}

export type Severity = 'error' | 'success' | 'warn';

export function findSeverity<T>(items: T[], mapper: (each: T) => Severity): Severity {
  let output: Severity = 'success';
  for (const item of items) {
    const severity = mapper(item);
    if (severity === 'error') return 'error';
    if (severity === 'warn') {
      output = 'warn';
    }
  }

  return output;
}

export function compareSeverity(lhs: Severity, rhs: Severity) {
  switch (lhs) {
    case 'success':
      return rhs;
    case 'warn':
      return rhs === 'error' ? 'error' : 'warn';
    case 'error':
      return 'error';
  }
}

export function collateResults(results: BuildResult[]): BuildResult {
  return results.reduce((res, result) => ({
    severity: compareSeverity(res.severity, result.severity),
    warnings: [...res.warnings, ...result.warnings],
    errors: [...res.errors, ...result.errors]
  }), {
    severity: 'success',
    warnings: [],
    errors: []
  } as BuildResult);
}

export const divideAndRound = (n: number, divisor: number) => (n / divisor).toFixed(2);

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

export function resultLogger({ severity, errors, warnings }: BuildResult, prefix: string, successMsg: string) {
  const formattedPrefix = chalk.blueBright(`[${prefix}]`);

  switch (severity) {
    case 'error':
      return errors.map(error => `${formattedPrefix}: ${chalk.redBright(error)}`).join('\n');
    case 'warn':
      return [
        ...warnings.map(warning => `${formattedPrefix}: ${chalk.yellowBright(warning)}`),
        `${formattedPrefix}: ${chalk.greenBright(successMsg)}`
      ].join('\n');
    case 'success':
      return `${formattedPrefix}: ${chalk.greenBright(successMsg)}`;
  }

}
