export const tscResultsLogger = jest.fn(() => Promise.resolve(''));

export const runTsc = jest.fn()
	.mockResolvedValue({
		elapsed: 0,
		result: {
			severity: 'error',
			results: []
		}
	})
