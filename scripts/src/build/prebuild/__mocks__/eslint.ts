export const runEslint = jest.fn().mockImplementation(() => ({
  elapsed: 0,
  result: {
    formatted: '',
    results: [],
    severity: 'error',
  }
}))

export const logLintResult = jest.fn();