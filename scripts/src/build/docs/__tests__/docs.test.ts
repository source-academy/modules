import type { MockedFunction } from 'jest-mock';
import * as html from '../html';
import { getBuildDocsCommand } from '..';
import * as json from '../json';
import { testBuildCommand } from '@src/build/__tests__/testingUtils';

jest.mock('../docsUtils')

jest.spyOn(json, 'buildJsons')
jest.spyOn(html, 'buildHtml')

const asMock = <T extends (...any: any[]) => any>(func: T) => func as MockedFunction<T>;
const mockBuildJson = asMock(json.buildJsons);

const runCommand = (...args: string[]) => getBuildDocsCommand()
	.parseAsync(args, { from: 'user' });

describe('test the docs command', () => {
	testBuildCommand(
		'buildDocs',
		getBuildDocsCommand,
		[json.buildJsons, html.buildHtml]
	)

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
});
