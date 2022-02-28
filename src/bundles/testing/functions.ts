import { TestContext, TestSuite, Test } from './types';

const handleErr = (err: any) => {
  if (err.error && err.error.message) {
    return (err.error as Error).message;
  }
  if (err.message) {
    return (err as Error).message;
  }
  throw err;
};

export const context: TestContext = {
  describe: (msg: string, suite: TestSuite) => {
    const starttime = performance.now();
    context.suiteResults = {
      name: msg,
      results: [],
      total: 0,
      passed: 0,
    };

    suite();

    context.allResults.results.push(context.suiteResults);

    const endtime = performance.now();
    context.runtime += endtime - starttime;
    return context.allResults;
  },

  it: (msg: string, test: Test) => {
    const name = `${msg}`;
    let error = '';
    context.suiteResults.total += 1;

    try {
      test();
      context.suiteResults.passed += 1;
    } catch (err: any) {
      error = handleErr(err);
    }

    context.suiteResults.results.push({
      name,
      error,
    });
  },

  suiteResults: {
    name: '',
    results: [],
    total: 0,
    passed: 0,
  },

  allResults: {
    results: [],
    toReplString: () =>
      `${context.allResults.results.length} suites completed in ${context.runtime} ms.`,
  },

  runtime: 0,
};

/**
 * Defines a single test.
 * @param str Description for this test.
 * @param func Function containing tests.
 */
export function it(msg: string, func: Test) {
  context.it(msg, func);
}

/**
 * Describes a test suite.
 * @param str Description for this test.
 * @param func Function containing tests.
 */
export function describe(msg: string, func: TestSuite) {
  return context.describe(msg, func);
}
