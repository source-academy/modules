import context from 'js-slang/context';

import type { Test, TestContext, TestSuite } from './types';

const handleErr = (err: any) => {
  if (err.error && err.error.message) {
    return (err.error as Error).message;
  }
  if (err.message) {
    return (err as Error).message;
  }
  throw err;
};

export const testContext: TestContext = {
  called: false,
  describe(msg: string, suite: TestSuite) {
    if (this.called) {
      throw new Error(`${describe.name} can only be called once per program!`);
    }

    this.called = true;

    const starttime = performance.now();
    this.suiteResults = {
      name: msg,
      results: [],
      total: 0,
      passed: 0,
    };

    suite();

    this.allResults.results.push(this.suiteResults);

    const endtime = performance.now();
    this.runtime += endtime - starttime;
    return this.allResults;
  },

  it(msg: string, test: Test) {
    const name = `${msg}`;
    let error = '';
    this.suiteResults.total += 1;

    try {
      test();
      this.suiteResults.passed += 1;
    } catch (err: any) {
      error = handleErr(err);
    }

    this.suiteResults.results.push({
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
      `${testContext.allResults.results.length} suites completed in ${testContext.runtime} ms.`,
  },

  runtime: 0,
};

context.moduleContexts.unittest.state = testContext;

/**
 * Defines a single test.
 * @param str Description for this test.
 * @param func Function containing tests.
 */
export function it(msg: string, func: Test) {
  testContext.it(msg, func);
}

/**
 * Describes a test suite.
 * @param str Description for this test.
 * @param func Function containing tests.
 */
export function describe(msg: string, func: TestSuite) {
  return testContext.describe(msg, func);
}
