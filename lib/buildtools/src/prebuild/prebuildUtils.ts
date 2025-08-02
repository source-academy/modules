import type { InputAsset } from '@sourceacademy/modules-repotools/types';
import type { LintResult } from './lint.js';
import type { TscResult } from './tsc.js';

/**
 * Type helper for prebuild functions
 */
export function createPrebuilder<TResult extends LintResult | TscResult, TArgs extends any[] = []>(
  builder: (input: InputAsset, ...args: TArgs) => Promise<TResult>,
  formatter: (result: TResult) => string
) {
  return { builder, formatter };
}
