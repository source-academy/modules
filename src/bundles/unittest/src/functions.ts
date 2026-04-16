import { isFunctionOfLength } from '@sourceacademy/modules-lib/utilities';
import context from 'js-slang/context';

import {
  UnittestBundleInternalError,
  type Suite,
  type SuiteResult,
  type Test,
  type TestResult,
  type TestSuite
} from './types';

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
export const topLevelSuiteResults: SuiteResult[] = [];

export let currentSuite: Suite | null = null;
export let currentTest: string | null = null;

function handleErr(err: any) {
  if (err.error && err.error.message) {
    return (err.error as Error).message;
  }
  if (err.message) {
    return (err as Error).message;
  }
  throw err;
}

function runTest(name: string, funcName: string, func: Test) {
  if (!isFunctionOfLength(func, 0)) {
    throw new UnittestBundleInternalError(`${funcName}: A test must be a nullary function!`);
  }

  if (currentSuite === null) {
    throw new UnittestBundleInternalError(`${funcName} must be called from within a test suite!`);
  }

  if (currentTest !== null) {
    throw new UnittestBundleInternalError(`${funcName} cannot be called from within another test!`);
  }

  try {
    currentTest = name;
    func();
    currentSuite.results.push({
      name,
      passed: true,
    });
  } catch (err) {
    if (err instanceof UnittestBundleInternalError) {
      throw err;
    }

    const error = handleErr(err);
    currentSuite.results.push({
      name,
      passed: false,
      error,
    });
  } finally {
    currentTest = null;
  }
}

/**
 * Defines a single test.
 * @param name Description for this test.
 * @param func Function containing assertions.
 */
export function it(name: string, func: Test): void {
  runTest(name, it.name, func);
}

/**
 * Defines a single test.
 * @param msg Description for this test.
 * @param func Function containing assertions.
 */
export function test(msg: string, func: Test): void {
  runTest(msg, test.name, func);
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
export function describe(msg: string, func: TestSuite): void {
  if (!isFunctionOfLength(func, 0)) {
    throw new UnittestBundleInternalError(`${describe.name}: A test suite must be a nullary function!`);
  }

  const parentSuite = currentSuite;
  const newSuite = getNewSuite(msg);

  currentSuite = newSuite;
  newSuite.startTime = performance.now();

  try {
    func();
  } finally {
    currentSuite = parentSuite;
  }

  const passCount = determinePassCount(newSuite.results);
  const suiteResult: SuiteResult = {
    name: msg,
    results: newSuite.results,
    passCount,
    passed: passCount === newSuite.results.length,
    runtime: performance.now() - newSuite.startTime
  };

  if (parentSuite !== null) {
    parentSuite.results.push(suiteResult);
  } else {
    topLevelSuiteResults.push(suiteResult);
  }
}

context.moduleContexts.unittest.state = {
  suiteResults: topLevelSuiteResults
};
