export type ErrorLogger = (
  error: string[] | string,
  isSlangError?: boolean
) => void;
export type Test = () => void;
export type TestSuite = () => void;
export type TestContext = {
  describe: (msg: string, tests: TestSuite) => Results;
  it: (msg: string, test: Test) => void;
  // This holds the result of a single suite and is cleared on every run
  suiteResults: SuiteResult;
  // This holds the results of the entire suite
  allResults: Results;
  runtime: number;
};
export type TestResult = {
  name: string;
  error: string;
};
export type SuiteResult = {
  name: string;
  results: TestResult[];
  total: number;
  passed: number;
};
export type Results = {
  results: SuiteResult[];
  toReplString: () => string;
};
