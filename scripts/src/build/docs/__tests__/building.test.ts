import fs from 'fs/promises';
import type { MockedFunction } from 'jest-mock';
import { initTypedoc } from '../docsUtils';
import * as json from '../json';

jest.spyOn(json, 'buildJson');

const mockedWriteFile = fs.writeFile as MockedFunction<typeof fs.writeFile>;

const test0Obj = {
  test_function: {
    kind: 'function',
    params: [['_param0', 'string']],
    description: '<p>This is just some test function</p>',
    retType: 'number'
  }
};

const test1Obj = {
  test_variable: {
    kind: 'variable',
    type: 'number',
    description: '<p>Test variable</p>'
  }
};

const workingDir = __dirname + '/test_mocks';

function matchObj<T>(raw: string, expected: T) {
  expect(JSON.parse(raw)).toMatchObject(expected);
}

describe('Check that buildJsons can handle building different numbers of bundles', () => {
  test('Building the json documentation for a single bundle', async () => {
    const [project,] = await initTypedoc(['test0'], workingDir, false, false);
    await json.buildJsons({ bundles: ['test0'] }, workingDir, project);

    expect(json.buildJson).toHaveBeenCalledTimes(1);
    const [[, test0str]] = mockedWriteFile.mock.calls;
    matchObj(test0str as string, test0Obj);
  });

  test('Building the json documentation for multiple bundles', async () => {
    const [project,] = await initTypedoc(['test0', 'test1'], workingDir, false, false);
    await json.buildJsons({ bundles: ['test0', 'test1'] }, workingDir, project);

    expect(json.buildJson).toHaveBeenCalledTimes(2);
    const [[, test0Str], [, test1Str]] = mockedWriteFile.mock.calls;
    matchObj(test0Str as string, test0Obj);
    matchObj(test1Str as string, test1Obj);
  });
});
