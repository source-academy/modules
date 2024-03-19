export const initTypedoc = jest.fn(() => {
	const proj = {
		getChildByName: () => ({
			children: []
		}),
		path: ''
	} as any;

	const app = {
		convert: jest.fn().mockReturnValue(proj),
		generateDocs: jest.fn(() => Promise.resolve())
	}

	return Promise.resolve([proj, app])
});
