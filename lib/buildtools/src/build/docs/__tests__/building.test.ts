import fs from 'fs/promises';
import { resolve } from 'path';
import type { ProjectReflection } from 'typedoc';
import { expect, test, vi, type MockedFunction } from 'vitest';
import { initTypedoc, initTypedocForSingleBundle } from '../docsUtils';
import { buildJson } from '../json';

vi.mock(import('../../../utils'));

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

function expectObj<T>(raw: string, expected: T) {
  expect(JSON.parse(raw)).toMatchObject(expected as any);
}

const testMocksDir = resolve(import.meta.dirname, '../../../__test_mocks__');

test('Building the json documentation for a single bundle', async () => {
  const project = await initTypedocForSingleBundle({
    name: 'test0',
    manifest: {},
    directory: `${testMocksDir}/bundles/test0`,
    entryPoint: `${testMocksDir}/bundles/test0/index.ts`,
  });
  await buildJson('test0', project, '/build');

  const [[test0Path, test0str]] = mockedWriteFile.mock.calls;
  expectObj(test0str as string, test0Obj);
  expect(test0Path).toEqual('/build/jsons/test0.json');
});

test('initTypedoc for muiltiple bundles', async () => {
  // This test will complain that the README can't be found, which is fine
  // since it's not present inside the mock folder

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
  await buildJson('test0', test0Reflection, '/build');

  const test1Reflection = project.getChildByName('test1') as ProjectReflection;
  await buildJson('test1', test1Reflection, '/build');

  const [[test0Path, test0str], [test1Path, test1str]] = mockedWriteFile.mock.calls;
  expectObj(test0str as string, test0Obj);
  expect(test0Path).toEqual('/build/jsons/test0.json');

  expectObj(test1str as string, test1Obj);
  expect(test1Path).toEqual('/build/jsons/test1.json');
});
