import type { Area, Test } from '../types';

/**
 * Run the stored tests in state
 *
 * @returns if all tests pass
 */
export function run_tests({
  areaLog,
  tests
}: {
  areaLog: Area[],
  tests: Test[]
}) : boolean {
  // Run each test in order
  for (const test of tests) {
    // Can replace with a switch statement when more success conditions appear
    if (test.type === 'area' && !test.test(areaLog)) return false;
  }

  // If all tests pass, return true
  return true;
}
