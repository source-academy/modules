/**
 * Represents a function that when called, should either execute successfully
 * or throw an assertion error
 */
export type Test = () => void;

/**
 * Represents a function that when called, executes any number of {@link Test|tests}
 */
export type TestSuite = () => void;

/**
 * Represents a collection of tests or nested suites
 */
export interface Suite {
  /**
   * Name of the suite. `undefined` if this is the 'root' suite (i.e. the suite
   * to contain top level calls to test without a call to describe)
   */
  name?: string;
  results: (TestResult | SuiteResult)[];
  startTime?: number;
}

/**
 * Represents the results of running the suite
 */
export interface SuiteResult {
  /**
   * Name of the suite. Can't be `undefined` as the root suite does not
   * produce a SuiteResult
   */
  name: string;
  results: (TestResult | SuiteResult)[];
  runtime: number;
  passCount: number;
  passed: boolean;
}

export interface TestSuccess {
  passed: true;
  name: string;
};

export interface TestFailure {
  passed: false;
  name: string;
  error: string;
};

export type TestResult = TestSuccess | TestFailure;

export interface UnittestModuleState {
  suiteResults: SuiteResult[];
}

/**
 * These errors represent errors that shouldn't be handled as if they were thrown
 * by the assertion functions
 */
export class UnitestBundleInternalError extends Error {
};
