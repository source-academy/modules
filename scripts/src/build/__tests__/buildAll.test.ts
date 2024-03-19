import getBuildAllCommand from '..';
import * as lintModule from '../prebuild/lint';
import * as tscModule from '../prebuild/tsc';
import * as jsonModule from '../docs/json'
import * as htmlModule from '../docs/html'
import type { MockedFunction } from 'jest-mock';

import fs from 'fs/promises';
import pathlib from 'path';

jest.mock('../prebuild/tsc');
jest.mock('../prebuild/lint');
jest.mock('../docs/docsUtils')

jest.mock('esbuild', () => ({
	build: jest.fn()
		.mockResolvedValue({ outputFiles: [] })
}));

jest.spyOn(jsonModule, 'buildJsons');
jest.spyOn(htmlModule, 'buildHtml');

const asMock = <T extends (...any: any[]) => any>(func: T) => func as MockedFunction<typeof func>;
const runCommand = (...args: string[]) => getBuildAllCommand()
	.parseAsync(args, { from: 'user' });

describe('test build all command', () => {
	it('should create the output directories, copy the manifest, and call all build functions', async () => {
		await runCommand();

		expect(fs.copyFile)
			.toBeCalledWith('modules.json', pathlib.join('build', 'modules.json'));

		// expect(docsModule.initTypedoc)
		//   .toHaveBeenCalledTimes(1);

		expect(jsonModule.buildJsons)
			.toHaveBeenCalledTimes(1);

		expect(htmlModule.buildHtml)
			.toHaveBeenCalledTimes(1);

		// expect(modules.buildModules)
		//   .toHaveBeenCalledTimes(1);
	});

	it('should exit with code 1 if tsc returns with an error', async () => {
		try {
			await runCommand('--tsc');
		} catch (error) {
			expect(error)
				.toEqual(new Error('process.exit called with 1'));
		}

		expect(process.exit)
			.toHaveBeenCalledWith(1);

		expect(tscModule.runTsc)
			.toHaveBeenCalledTimes(1);
	});

	it('should exit with code 1 if eslint returns with an error', async () => {
		try {
			await runCommand('--lint');
		} catch (error) {
			expect(error)
				.toEqual(new Error('process.exit called with 1'));
		}

		expect(lintModule.runEslint)
			.toHaveBeenCalledTimes(1);

		expect(process.exit)
			.toHaveBeenCalledWith(1);
	});

	it('should exit with code 1 if buildJsons returns with an error', async () => {
		asMock(jsonModule.buildJsons)
			.mockResolvedValueOnce({
				jsons: [{
					severity: 'error',
					name: 'test0',
					error: {}
				}],
			})
		try {
			await runCommand();
		} catch (error) {
			expect(error)
				.toEqual(new Error('process.exit called with 1'));
		}

		expect(process.exit)
			.toHaveBeenCalledWith(1);
	})


	it('should exit with code 1 if buildHtml returns with an error', async () => {
		asMock(htmlModule.buildHtml)
			.mockResolvedValueOnce({
				elapsed: 0,
				result: {
					severity: 'error',
					error: {}
				}
			});

		try {
			await runCommand();
		} catch (error) {
			expect(error)
				.toEqual(new Error('process.exit called with 1'))
		}

		expect(process.exit)
			.toHaveBeenCalledWith(1);

		expect(htmlModule.buildHtml)
			.toHaveBeenCalledTimes(1);
	});
});
