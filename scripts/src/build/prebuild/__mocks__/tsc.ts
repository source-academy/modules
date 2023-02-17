export const logTscResults = jest.fn();
export const runTsc = jest.fn().mockResolvedValue({
  elapsed: 0,
  result: {
    severity: 'error',
    results: [],
  }
})