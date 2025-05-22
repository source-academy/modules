import fs from 'fs/promises';
import type { MockedFunction } from 'jest-mock';
import type { ProjectReflection } from 'typedoc';
import { initTypedoc, initTypedocForSingleBundle } from '../docsUtils';
import * as json from '../json';

jest.mock('../json', () => ({
  buildJson: jest.fn()
}));

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

function matchObj<T>(raw: string, expected: T) {
  expect(JSON.parse(raw)).toMatchObject(expected);
}

const testMocksDir = `${__dirname}/../../__test_mocks__`;

test('Building the json documentation for a single bundle', async () => {
  const project = await initTypedocForSingleBundle({
    name: 'test0',
    manifest: {},
    directory: `${testMocksDir}/bundles/test0`,
    entryPoint: `${testMocksDir}/bundles/test0/index.ts`,
  });
  await json.buildJson('test0', project, 'build');

  expect(json.buildJson).toHaveBeenCalledTimes(1);
  const [[, test0str]] = mockedWriteFile.mock.calls;
  matchObj(test0str as string, test0Obj);
});

test('initTypedoc for muiltiple bundles', async () => {
  const [project,] = await initTypedoc({
    test0: {
      name: 'test0',
      manifest: {},
      directory: `${testMocksDir}/bundles/test0`,
      entryPoint: `${testMocksDir}/bundles/test0/index.ts`,
    },
    test1: {
      name: 'test1',
      manifest: {},
      directory: `${testMocksDir}/bundles/test1`,
      entryPoint: `${testMocksDir}/bundles/test1/index.ts`,
    }
  });

  const test0Reflection = project.getChildByName('test0') as ProjectReflection;
  await json.buildJson('test0', test0Reflection, 'build');

  const test1Reflection = project.getChildByName('test1') as ProjectReflection;
  await json.buildJson('test1', test1Reflection, 'build');

  expect(json.buildJson).toHaveBeenCalledTimes(2);
  const [[, test0str], [, test1str]] = mockedWriteFile.mock.calls;
  matchObj(test0str as string, test0Obj);
  matchObj(test1str as string, test1Obj);
});
