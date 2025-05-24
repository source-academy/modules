import fs from 'fs/promises';
import { resolve } from 'path';
import { beforeEach, vi, test, expect } from 'vitest';
import { buildBundle } from '../bundle';
import { buildTab } from '../tab';

const testMocksDir = resolve(import.meta.dirname, '../../../', '__test_mocks__');

const written = [];
vi.spyOn(fs, 'open').mockResolvedValue({
  createWriteStream: () => ({
    write: data => {
      written.push(data);
    }
  }),
  close: vi.fn()
} as any);

beforeEach(() => {
  written.splice(0, written.length);
});

test('build bundle', async () => {
  await buildBundle({
    manifest: {},
    name: 'test0',
    directory: `${testMocksDir}/bundles/test0`,
    entryPoint: `${testMocksDir}/bundles/test0/index.ts`,
  }, '/build');

  expect(fs.open).toHaveBeenCalledWith('/build/bundles/test0.js', 'w');

  const data = written.join('');

  // Trim the export default
  const trimmed = (data as string).slice('export default'.length);
  const provider = vi.fn((p: string) => {
    if (p === 'js-slang/context') {
      return {
        moduleContexts: {
          test0: {
            state: {
              data: 'foo'
            }
          }
        }
      };
    }

    throw new Error(`Dynamic require of ${p} is not supported!`);
  });

  const bundle = eval(trimmed)(provider);

  expect(provider).toHaveBeenCalledTimes(1);
  expect(bundle.test_function2()).toEqual('foo');
});

test('build tab', async () => {
  await buildTab(`${testMocksDir}/tabs/tab0`, '/build');
  expect(fs.open).toHaveBeenCalledWith('/build/tabs/tab0.js', 'w');

  const data = written.join('');
  const trimmed = (data as string).slice('export default'.length);

  const { default: tab } = eval(trimmed)(() => {});
  expect(tab.body(0)).toEqual(0);
  expect(tab.toSpawn()).toEqual(true);
});
