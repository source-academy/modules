import fs from 'fs/promises';
import { beforeEach, expect, test, vi } from 'vitest';
import { testMocksDir } from '../../../__tests__/fixtures.js';
import { buildBundle, buildTab } from '../index.js';

const written: string[] = [];
vi.spyOn(fs, 'open').mockResolvedValue({
  createWriteStream: () => ({
    write: (data: string) => {
      written.push(data);
    }
  }),
  close: vi.fn()
} as any);

vi.mock(import('esbuild'), async importOriginal => {
  // Add modules-lib to the list of external packages since it might
  // not be installed during a buildtools test run
  const original = await importOriginal();
  return {
    ...original,
    build: options => {
      options.external!.push('@sourceacademy/modules-lib');
      return original.build(options);
    },
    context: options => {
      options.external!.push('@sourceacademy/modules-lib');
      return original.context(options);
    }
  };
});

beforeEach(() => {
  written.splice(0, written.length);
});

test('build bundle', async () => {
  await buildBundle('/build', {
    type: 'bundle',
    manifest: {},
    name: 'test0',
    directory: `${testMocksDir}/bundles/test0`,
  });

  expect(fs.open).toHaveBeenCalledWith('/build/bundles/test0.js', 'w');

  const data = written.join('');
  expect(data.startsWith('export default')).toEqual(true);

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
  await buildTab('/build', {
    type: 'tab',
    directory: `${testMocksDir}/tabs/tab0`,
    name: 'tab0',
    entryPoint: `${testMocksDir}/tabs/tab0/src/index.tsx`,
  });
  expect(fs.open).toHaveBeenCalledWith('/build/tabs/tab0.js', 'w');

  function mockRequire(path: string) {
    console.log(path);
    if (path === '@sourceacademy/modules-lib/tabs/utils') {
      return {
        defineTab: (x: any) => x
      };
    }

    return {};
  }

  const data = written.join('');
  const trimmed = (data as string).slice('export default'.length);

  const { default: tab } = eval(trimmed)(mockRequire);
  expect(tab.body(0)).toEqual(0);
  expect(tab.toSpawn()).toEqual(true);
});
