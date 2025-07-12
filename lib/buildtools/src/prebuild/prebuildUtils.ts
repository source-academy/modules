import type { ResolvedBundle, ResolvedTab } from '../types.js';
import type { LintResult } from './lint.js';
import type { TscResult } from './tsc.js';

/**
 * Type helper for prebuild functions
 */
export function createPrebuilder<TResult extends LintResult | TscResult, TArgs extends any[] = []>(
  builder: (input: ResolvedBundle | ResolvedTab, ...args: TArgs) => Promise<TResult>,
  formatter: (result: TResult) => string
) {
  return { builder, formatter };
}
