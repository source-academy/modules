import type { MockedFunction } from 'jest-mock';
import getBuildDocsCommand from '..';
import * as docs from '../docsUtils';
import * as buildHtml from '../html';
import fs from 'fs/promises';

jest.mock('../../prebuild/tsc');

jest.spyOn(docs, 'buildJsons');
jest.spyOn(docs, 'buildHtml');

const asMock = <T extends (...any: any[]) => any>(func: T) => func as MockedFunction<typeof func>;
const mockBuildJson = asMock(docs.buildJsons);

const runCommand = (...args: string[]) => getBuildDocsCommand()
	.parseAsync(args, { from: 'user' });
describe('test the docs command', () => {
	it('should create the output directories and call all doc build functions', async () => {
		await runCommand();

		expect(fs.mkdir)
			.toBeCalledWith('build', { recursive: true })

		expect(docs.buildJsons)
			.toHaveBeenCalledTimes(1);

		expect(buildHtml.buildHtml)
			.toHaveBeenCalledTimes(1);

		expect(docs.initTypedoc)
			.toHaveBeenCalledTimes(1);
	});

	it('should only build the documentation for specified modules', async () => {
		await runCommand('test0', 'test1')

		expect(docs.buildJsons)
			.toHaveBeenCalledTimes(1);

		const buildJsonCall = mockBuildJson.mock.calls[0];
		expect(buildJsonCall[1])
			.toMatchObject({
				outDir: 'build',
				bundles: ['test0', 'test1']
			})

		expect(buildHtml.buildHtml)
			.toHaveBeenCalledTimes(1);

		expect(buildHtml.buildHtml)
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

		expect(docs.buildJsons)
			.toHaveBeenCalledTimes(0);

		expect(process.exit)
			.toHaveBeenCalledWith(1);
	});

	it('should exit with code 1 when there are errors', async () => {
		mockBuildJson.mockResolvedValueOnce({
			results: [{
				name: 'test0',
				error: {},
				severity: 'error'
			}],
			severity: 'error'
		})

		try {
			await runCommand();
		} catch (error) {
			expect(error)
				.toEqual(new Error('process.exit called with 1'))
		}

		expect(docs.buildJsons)
			.toHaveBeenCalledTimes(1);

		expect(process.exit)
			.toHaveBeenCalledWith(1);
	})
});
