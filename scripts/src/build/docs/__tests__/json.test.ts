import type { MockedFunction } from 'jest-mock';
import fs from 'fs/promises';
import * as json from '../json';

jest.spyOn(json, 'buildJsons');
jest.mock('../docsUtils')

const mockBuildJson = json.buildJsons as MockedFunction<typeof json.buildJsons>;
const runCommand = (...args: string[]) => json.getBuildJsonsCommand()
	.parseAsync(args, { from: 'user' });

describe('test json command', () => {
	test('normal function', async () => {
		await runCommand();

		expect(fs.mkdir)
			.toBeCalledWith('build/jsons', { recursive: true })

		expect(json.buildJsons)
			.toHaveBeenCalledTimes(1);
	})

	it('should only build the jsons for specified modules', async () => {
		await runCommand('test0', 'test1')

		expect(json.buildJsons)
			.toHaveBeenCalledTimes(1);

		const buildJsonCall = mockBuildJson.mock.calls[0];
		expect(buildJsonCall[1])
			.toMatchObject({
				outDir: 'build',
				bundles: ['test0', 'test1']
			})
	});

	it('should exit with code 1 if tsc returns with an error', async () => {
		try {
			await runCommand('--tsc');
		} catch (error) {
			expect(error)
				.toEqual(new Error('process.exit called with 1'));
		}

		expect(json.buildJsons)
			.toHaveBeenCalledTimes(0);

		expect(process.exit)
			.toHaveBeenCalledWith(1);
	});

	it('should exit with code 1 if buildJsons returns with an error', async () => {
		mockBuildJson.mockResolvedValueOnce({
			jsons: [{
				name: 'test0',
				error: {},
				severity: 'error'
			}],
		})
		try {
			await runCommand();
		} catch (error) {
			expect(error)
				.toEqual(new Error('process.exit called with 1'));
		}

		expect(json.buildJsons)
			.toHaveBeenCalledTimes(1);

		expect(process.exit)
			.toHaveBeenCalledWith(1);
	})
});
