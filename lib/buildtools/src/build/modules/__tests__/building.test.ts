import fs from 'fs/promises';
import { beforeEach, expect, test, vi } from 'vitest';
import { testMocksDir } from '../../../__tests__/fixtures.js';
import { writeManifest } from '../../manifest/index.js';
import { buildBundle } from '../bundle.js';
import { buildTab } from '../tab.js';

const written: string[] = [];
vi.spyOn(fs, 'open').mockResolvedValue({
  createWriteStream: () => ({
    write: (data: string) => {
      written.push(data);
    }
  }),
  close: vi.fn()
} as any);

vi.mock(import('../../../getGitRoot.js'));

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

  const data = written.join('');
  const trimmed = (data as string).slice('export default'.length);

  const { default: tab } = eval(trimmed)(() => {});
  expect(tab.body(0)).toEqual(0);
  expect(tab.toSpawn()).toEqual(true);
});

vi.spyOn(fs, 'writeFile').mockResolvedValue();

test('writing manifest', async () => {
  await writeManifest('/build', {
    test0: {
      manifest: {
        tabs: ['tab0']
      }
    },
    test1: {
      manifest: {}
    }
  } as any);

  expect(fs.writeFile).toHaveBeenCalledTimes(1);
  const [[path, data]] = vi.mocked(fs.writeFile).mock.calls;

  expect(path).toEqual('/build/modules.json');
  expect(JSON.parse(data as string)).toMatchObject({
    test0: { tabs: ['tab0'] },
    test1: {}
  });
});
