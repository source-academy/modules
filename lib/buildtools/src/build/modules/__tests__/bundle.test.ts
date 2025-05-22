import fs from 'fs/promises';
import { vi, test, expect } from 'vitest';
import { buildBundle } from '../bundle';

const testMocksDir = `${__dirname}/../../__test_mocks__`;

const written = [];
vi.spyOn(fs, 'open').mockResolvedValue({
  createWriteStream: () => ({
    write: data => {
      written.push(data);
    }
  }),
  close: vi.fn()
} as any);

test('esbuild transpilation', async () => {
  await buildBundle({
    manifest: {},
    name: 'test0',
    directory: `${testMocksDir}/bundles/test0`,
    entryPoint: `${testMocksDir}/bundles/test0/index.ts`,
  }, 'build');

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
