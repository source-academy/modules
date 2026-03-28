import fs from 'fs/promises';
import pathlib from 'path';
import { bundlesDir, outDir, tabsDir } from '@sourceacademy/modules-repotools/getGitRoot';
import type { ResolvedBundle } from '@sourceacademy/modules-repotools/types';
import { beforeEach, expect, test, vi } from 'vitest';
import { buildBundle, buildTab } from '../index.js';
import { buildManifest } from '../manifest.js';

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
  await buildBundle(outDir, {
    type: 'bundle',
    manifest: {},
    name: 'test0',
    directory: pathlib.join(bundlesDir, 'test0'),
  }, false);

  expect(fs.open).toHaveBeenCalledExactlyOnceWith(pathlib.join(outDir, 'bundles', 'test0.js'), 'w');

  const data = written.join('');
  expect(data.startsWith('export default')).toEqual(true);

  // Trim the export default
  const trimmed = data.slice('export default'.length);
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
  await buildTab(outDir, {
    type: 'tab',
    directory: pathlib.join(tabsDir, 'tab0'),
    name: 'tab0',
    entryPoint: pathlib.join(tabsDir, 'tab0', 'src', 'index.tsx'),
  }, false);
  expect(fs.open).toHaveBeenCalledExactlyOnceWith(pathlib.join(outDir, 'tabs', 'tab0.js'), 'w');

  function mockRequire(path: string) {
    if (path === '@sourceacademy/modules-lib/tabs/utils') {
      return {
        defineTab: (x: any) => x
      };
    }

    return {};
  }

  const data = written.join('');
  const trimmed = data.slice('export default'.length);

  const { default: tab } = eval(trimmed)(mockRequire);
  expect(tab.body(0)).toEqual(0);
  expect(tab.toSpawn()).toEqual(true);
});

test('build manifest', async () => {
  const sampleManifests: Record<string, ResolvedBundle> = {
    bundle0: {
      type: 'bundle',
      name: 'bundle0',
      directory: './bundle0',
      manifest: {
        requires: 1
      }
    },
    bundle1: {
      type: 'bundle',
      name: 'bundle1',
      directory: './bundle1',
      manifest: {
        version: '1.0.0'
      }
    }
  };

  await buildManifest(sampleManifests, outDir);

  expect(fs.mkdir).toHaveBeenCalledExactlyOnceWith(outDir, { recursive: true });
  expect(fs.writeFile).toHaveBeenCalledOnce();
  const [[path, output]] = vi.mocked(fs.writeFile).mock.calls;

  expect(path).toEqual(pathlib.join(outDir, 'modules.json'));
  expect(JSON.parse(output as string)).toMatchObject({
    bundle0: {
      requires: 1
    },
    bundle1: {
      version: '1.0.0'
    }
  });
});
