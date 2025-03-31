import type { Area, Test } from './types';

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
    // Store status in a variable
    let success: boolean;

    switch(test.type) {
      case 'area':
        success = test.test(areaLog);
        break;
      default:
        success = true;
    }

    // If the test fails, return false
    if (!success) return false;
  }

  // If all tests pass, return true
  return true;
}
