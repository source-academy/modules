export const runEslint = jest.fn()
	.mockImplementation(() => ({
		elapsed: 0,
		result: {
			formatted: "",
			severity: "error"
		}
	}));

export const eslintResultsLogger = jest.fn(() => "");
