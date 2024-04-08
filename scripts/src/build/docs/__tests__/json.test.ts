import fs from 'fs/promises';
import type { MockedFunction } from 'jest-mock';
import { testBuildCommand } from '@src/build/__tests__/testingUtils';
import * as json from '../json';

jest.spyOn(json, 'buildJsons');
jest.mock('../docsUtils');

const mockBuildJson = json.buildJsons as MockedFunction<typeof json.buildJsons>;
const runCommand = (...args: string[]) => json.getBuildJsonsCommand()
  .parseAsync(args, { from: 'user' });

describe('test json command', () => {
  testBuildCommand(
    'buildJsons',
    json.getBuildJsonsCommand,
    [json.buildJsons]
  );

  test('normal function', async () => {
    await runCommand();

    expect(fs.mkdir)
      .toBeCalledWith('build/jsons', { recursive: true });

    expect(json.buildJsons)
      .toHaveBeenCalledTimes(1);
  });

  it('should only build the jsons for specified modules', async () => {
    await runCommand('-b', 'test0', 'test1');

    expect(json.buildJsons)
      .toHaveBeenCalledTimes(1);

    const buildJsonCall = mockBuildJson.mock.calls[0];
    expect(buildJsonCall[0])
      .toMatchObject({
        bundles: ['test0', 'test1']
      });
  });
});
