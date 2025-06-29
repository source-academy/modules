import type { ResolveAllBundlesError, ResolveSingleBundleError } from './types.js';

export function formatResolveBundleErrors(
  result: ResolveAllBundlesError | ResolveSingleBundleError
): string {
  const strings = result.errors.map(each => `${each}`);
  return strings.join('\n');
}
