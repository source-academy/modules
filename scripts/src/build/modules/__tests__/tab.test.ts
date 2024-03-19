import fs from 'fs/promises'
import pathlib from 'path'
import * as tabs from "../tabs";

jest.mock('esbuild', () => ({
	build: jest.fn()
		.mockResolvedValue({ outputFiles: [] })
}));

jest.spyOn(tabs, 'bundleTabs')

const runCommand = (...args: string[]) => tabs.getBuildTabsCommand()
	.parseAsync(args, { from: 'user' });

describe('test tab command', () => {
	it('should create the output directories, and copy the manifest', async () => {
	  await runCommand();

	  expect(fs.copyFile)
	    .toBeCalledWith('modules.json', pathlib.join('build', 'modules.json'));
	})

	it('should only build specific tabs when manually specified', async () => {
		await runCommand('tab0');

		expect(tabs.bundleTabs)
			.toHaveBeenCalledTimes(1);

		const buildModulesCall = (tabs.bundleTabs as jest.MockedFunction<typeof tabs.bundleTabs>).mock.calls[0];
		expect(buildModulesCall[0])
			.toEqual(['tab0']);
	});
});
