import type { Severity } from './types';

export const wrapWithTimer = <T extends (...params: any[]) => Promise<any>>(func: T) => async (...params: Parameters<T>): Promise<{
  elapsed: number,
  result: Awaited<ReturnType<T>>
}> => {
  const startTime = performance.now();
  const result = await func(...params);
  const endTime = performance.now();

  return {
    elapsed: endTime - startTime,
    result,
  };
};

export const divideAndRound = (dividend: number, divisor: number, round: number) => (dividend / divisor).toFixed(round);

export const findSeverity = <T>(items: T[], processor: (each: T) => Severity): Severity => {
  let severity: Severity = 'success';

  for (const item of items) {
    const itemSev = processor(item);
    if (itemSev === 'error') return 'error';
    if (itemSev === 'warn' && severity === 'success') severity = 'warn';
  }

  return severity;
};

export const fileSizeFormatter = (size: number) => {
  size /= 1000;
  if (size < 0.01) return '<0.01 KB';
  if (size >= 100) return `${divideAndRound(size, 1000, 2)} MB`;
  return `${size.toFixed(2)} KB`;
};
