import context from 'js-slang/context';

import type { Suite, SuiteResult, Test, TestResult } from './types';

function getNewSuite(name?: string): Suite {
  return {
    name,
    results: [],
  };
}

/**
 * If describe was called multiple times from the root level, we need somewhere
 * to collect those Suite Results since none of them will have a parent suite
 */
export const suiteResults: SuiteResult[] = [];
let currentSuite: Suite | null = null;

function handleErr(err: any) {
  if (err.error && err.error.message) {
    return (err.error as Error).message;
  }
  if (err.message) {
    return (err as Error).message;
  }
  throw err;
}

/**
 * Defines a single test.
 * @param name Description for this test.
 * @param func Function containing assertions.
 */
export function it(name: string, func: Test): void {
  if (currentSuite === null) {
    throw new Error(`'${it.name}' must be called from within a test suite!`);
  }

  try {
    func();
    currentSuite.results.push({
      name,
      passed: true,
    });
  } catch (err) {
    const error = handleErr(err);
    currentSuite.results.push({
      name,
      passed: false,
      error,
    });
  }
}

/**
 * Defines a single test.
 * @param msg Description for this test.
 * @param func Function containing assertions.
 */
export function test(msg: string, func: Test): void {
  if (currentSuite === null) {
    throw new Error(`${test.name} must be called from within a test suite!`);
  }
  it(msg, func);
}

function determinePassCount(results: (TestResult | SuiteResult)[]): number {
  const passedItems = results.filter(each => {
    if ('results' in each) {
      const passCount = determinePassCount(each.results);
      each.passed = passCount === each.results.length;
    }

    return each.passed;
  });

  return passedItems.length;
}

/**
 * Describes a test suite.
 * @param msg Description for this test suite.
 * @param func Function containing tests.
 */
export function describe(msg: string, func: Test): void {
  const oldSuite = currentSuite;
  const newSuite = getNewSuite(msg);

  currentSuite = newSuite;
  newSuite.startTime = performance.now();
  func();
  currentSuite = oldSuite;

  const passCount = determinePassCount(newSuite.results);
  const suiteResult: SuiteResult = {
    name: msg,
    results: newSuite.results,
    passCount,
    passed: passCount === newSuite.results.length,
    runtime: performance.now() - newSuite.startTime
  };

  if (oldSuite !== null) {
    oldSuite.results.push(suiteResult);
  } else {
    suiteResults.push(suiteResult);
  }
}

context.moduleContexts.unittest.state = {
  suiteResults
};
