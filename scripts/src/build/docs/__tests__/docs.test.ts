import type { MockedFunction } from 'jest-mock';
import * as docUtils from '../docsUtils';
import * as html from '../html';
import fs from 'fs/promises';
import { getBuildDocsCommand } from '..';
import * as json from '../json';

jest.mock('../../prebuild/tsc');
jest.mock('../docsUtils')

jest.spyOn(json, 'buildJsons')

const asMock = <T extends (...any: any[]) => any>(func: T) => func as MockedFunction<T>;
const mockBuildJson = asMock(json.buildJsons);

const runCommand = (...args: string[]) => getBuildDocsCommand()
	.parseAsync(args, { from: 'user' });
describe('test the docs command', () => {
	it('should create the output directories and call all doc build functions', async () => {
		await runCommand();

		expect(fs.mkdir)
			.toBeCalledWith('build', { recursive: true })

		expect(json.buildJsons)
			.toHaveBeenCalledTimes(1);

		expect(html.buildHtml)
			.toHaveBeenCalledTimes(1);

		expect(docUtils.initTypedoc)
			.toHaveBeenCalledTimes(1);
	});

	it('should only build the documentation for specified modules', async () => {
		await runCommand('test0', 'test1')

		expect(json.buildJsons)
			.toHaveBeenCalledTimes(1);

		const buildJsonCall = mockBuildJson.mock.calls[0];
		expect(buildJsonCall[1])
			.toMatchObject({
				outDir: 'build',
				bundles: ['test0', 'test1']
			})

		expect(html.buildHtml)
			.toHaveBeenCalledTimes(1);

		expect(html.buildHtml)
			.toReturnWith(Promise.resolve({
				elapsed: 0,
				result: {
					severity: 'warn'
				}
			}))
	});

	it('should exit with code 1 if tsc returns with an error', async () => {
		try {
			await runCommand('--tsc');
		} catch (error) {
			expect(error)
				.toEqual(new Error('process.exit called with 1'))
		}

		expect(json.buildJsons)
			.toHaveBeenCalledTimes(0);

		expect(process.exit)
			.toHaveBeenCalledWith(1);
	});

	it('should exit with code 1 when there are errors', async () => {
		mockBuildJson.mockResolvedValueOnce({ jsons:
			[{
				name: 'test0',
				error: {},
				severity: 'error'
			}],
		})

		try {
			await runCommand();
		} catch (error) {
			expect(error)
				.toEqual(new Error('process.exit called with 1'))
		}

		expect(json.buildJsons)
			.toHaveBeenCalledTimes(1);

		expect(process.exit)
			.toHaveBeenCalledWith(1);
	})
});
