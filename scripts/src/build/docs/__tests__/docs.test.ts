import type { MockedFunction } from 'jest-mock';
import { getBuildDocsCommand } from '..';
import { initTypedoc } from '../docUtils';
import * as jsonModule from '../json';
import * as htmlModule from '../html';
import fs from 'fs/promises';

jest.mock('../../prebuild/tsc');

jest.spyOn(jsonModule, 'buildJsons');
jest.spyOn(htmlModule, 'buildHtml');

const mockBuildJson = jsonModule.buildJsons as MockedFunction<typeof jsonModule.buildJsons>

beforeEach(() => {
  mockBuildJson.mockReset()
})

const runCommand = (...args: string[]) => getBuildDocsCommand().parseAsync(args, { from: 'user' });
describe('test the docs command', () => {
  it('should create the output directories and call all doc build functions', async () => {
    await runCommand();

    expect(fs.mkdir)
      .toBeCalledWith('build', { recursive: true })

    expect(jsonModule.buildJsons)
      .toHaveBeenCalledTimes(1);
    
    expect(htmlModule.buildHtml)
      .toHaveBeenCalledTimes(1);

    expect(initTypedoc)
      .toHaveBeenCalledTimes(1);
  });

  it('should exit with code 1 if tsc returns with an error', async () => {
    await runCommand('--tsc'); 

    expect(jsonModule.buildJsons)
      .toHaveBeenCalledTimes(0);

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  });

  it("should exit with code 1 when there are errors", async () => {
    mockBuildJson.mockResolvedValueOnce([['json', 'test0', { severity: 'error' }]])

    await runCommand();

    expect(jsonModule.buildJsons)
      .toHaveBeenCalledTimes(1);

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  })
});
