export type ErrorLogger = (
  error: string[] | string,
  isSlangError?: boolean
) => void;

/**
 * Represents a function that when called, should either execute successfully
 * or throw an assertion error
 */
export type Test = () => void;

/**
 * Represents a function that when called, executes any number of {@link Test|tests}
 */
export type TestSuite = () => void;

export interface Suite {
  name?: string
  results: (TestResult | SuiteResult)[]
  startTime?: number,
}

export interface SuiteResult {
  name: string,
  results: (TestResult | SuiteResult)[]
  runtime: number;
  passCount: number
  passed: boolean
}

export type TestSuccess = {
  passed: true
  name: string
};

export type TestFailure = {
  passed: false
  name: string
  error: string
};

export type TestResult = TestSuccess | TestFailure;

export interface UnittestModuleState {
  suiteResults: SuiteResult[]
}
