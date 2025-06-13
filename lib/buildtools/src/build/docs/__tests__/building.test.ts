import fs from 'fs/promises';
import type { ProjectReflection } from 'typedoc';
import { expect, test, vi } from 'vitest';
import { testMocksDir } from '../../../__tests__/fixtures.js';
import { initTypedoc, initTypedocForSingleBundle } from '../docsUtils.js';
import { buildJson } from '../json.js';

vi.mock(import('../../../getGitRoot.js'));

const mockedWriteFile = vi.mocked(fs.writeFile);

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

test('Building the json documentation for a single bundle', async () => {
  const bundle = {
    name: 'test0',
    manifest: {},
    directory: `${testMocksDir}/bundles/test0`,
  };

  const project = await initTypedocForSingleBundle(bundle);

  await buildJson('/build', bundle, project);

  const [[test0Path, test0str]] = mockedWriteFile.mock.calls;
  expectObj(test0str as string, test0Obj);
  expect(test0Path).toEqual('/build/jsons/test0.json');
});

test('initTypedoc for muiltiple bundles', async () => {
  // This test will complain that the README can't be found, which is fine
  // since it's not present inside the mock folder

  const bundles = {
    test0: {
      name: 'test0',
      manifest: {},
      directory: `${testMocksDir}/bundles/test0`,
    },
    test1: {
      name: 'test1',
      manifest: {},
      directory: `${testMocksDir}/bundles/test1`,
    }
  };

  const [project,] = await initTypedoc(bundles);

  const test0Reflection = project.getChildByName('test0') as ProjectReflection;
  await buildJson('/build', bundles.test0, test0Reflection);

  const test1Reflection = project.getChildByName('test1') as ProjectReflection;
  await buildJson('/build', bundles.test1, test1Reflection);

  const [[test0Path, test0str], [test1Path, test1str]] = mockedWriteFile.mock.calls;
  expectObj(test0str as string, test0Obj);
  expect(test0Path).toEqual('/build/jsons/test0.json');

  expectObj(test1str as string, test1Obj);
  expect(test1Path).toEqual('/build/jsons/test1.json');
});
