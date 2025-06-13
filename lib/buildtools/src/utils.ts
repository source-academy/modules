export type AwaitedReturn<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

export type Severity = 'error' | 'success' | 'warn';

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

export function findSeverity<T>(items: T[], mapper: (each: T) => Severity): Severity {
  let output: Severity = 'success';
  for (const item of items) {
    const severity = mapper(item);
    output = compareSeverity(output, severity);
    if (output === 'error') return 'error';
  }

  return output;
}

export const divideAndRound = (n: number, divisor: number) => (n / divisor).toFixed(2);

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}
