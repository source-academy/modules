import type { MockedFunction } from 'jest-mock';
import { testBuildCommand } from '@src/build/__tests__/testingUtils';
import { getBuildDocsCommand } from '..';
import * as html from '../html';
import * as json from '../json';

jest.mock('../docsUtils');

jest.spyOn(json, 'buildJsons');
jest.spyOn(html, 'buildHtml');

const asMock = <T extends (...any: any[]) => any>(func: T) => func as MockedFunction<T>;
const mockBuildJson = asMock(json.buildJsons);

const runCommand = (...args: string[]) => getBuildDocsCommand()
  .parseAsync(args, { from: 'user' });

describe('test the docs command', () => {
  testBuildCommand(
    'buildDocs',
    getBuildDocsCommand,
    [json.buildJsons, html.buildHtml]
  );

  it('should only build the documentation for specified modules', async () => {
    await runCommand('-b', 'test0', 'test1');

    expect(json.buildJsons)
      .toHaveBeenCalledTimes(1);

    const buildJsonCall = mockBuildJson.mock.calls[0];
    expect(buildJsonCall[0])
      .toEqual({
        bundles: ['test0', 'test1'],
        modulesSpecified: true
      });

    expect(html.buildHtml)
      .toHaveBeenCalledTimes(1);

    expect(html.buildHtml)
      .toReturnWith(Promise.resolve({
        elapsed: 0,
        result: {
          severity: 'warn'
        }
      }));
  });
});
