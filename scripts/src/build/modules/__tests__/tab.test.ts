import * as builders from '../commons';
import fs from 'fs/promises';
import pathlib from 'path';
import { getBuildTabCommand } from '..';

jest.spyOn(builders, 'buildTabs');

jest.mock('esbuild', () => ({
	build: jest.fn()
		.mockResolvedValue({ outputFiles: [] })
}));

const runCommand = (...args: string[]) => getBuildTabCommand()
	.parseAsync(args, { from: 'user' });

describe('test tab command', () => {
	// it('should create the output directories, and copy the manifest', async () => {
	//   await runCommand();

	//   expect(fs.mkdir)
	//     .toBeCalledWith('build', { recursive: true })

	//   expect(fs.copyFile)
	//     .toBeCalledWith('modules.json', pathlib.join('build', 'modules.json'));
	// })

	it('should only build specific tabs when manually specified', async () => {
		await runCommand('tab0');

		expect(builders.buildTabs)
			.toHaveBeenCalledTimes(1);

		const buildModulesCall = (builders.buildTabs as jest.MockedFunction<typeof builders.buildTabs>).mock.calls[0];
		expect(buildModulesCall[0])
			.toEqual(['tab0']);
	});
});
