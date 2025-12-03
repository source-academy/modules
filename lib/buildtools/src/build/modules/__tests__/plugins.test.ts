import pathlib from 'path';
import { bundlesDir, tabsDir } from '@sourceacademy/modules-repotools/getGitRoot';
import type { InputAsset, ResolvedBundle } from '@sourceacademy/modules-repotools/types';
import type { OnResolveResult, PluginBuild } from 'esbuild';
import { describe, expect, test } from 'vitest';
import { getContextPlugin } from '../commons.js';

function testPlugin(importerPath: string, asset: InputAsset) {
  const plugin = getContextPlugin(asset);

  return new Promise<OnResolveResult | null | undefined>(resolve => {
    const pluginBuild: Pick<PluginBuild, 'onResolve'> = {
      async onResolve(filter, callback) {
        const result = await callback({ importer: importerPath } as any);
        resolve(result);
      },
    };

    plugin.setup(pluginBuild as PluginBuild);
  });
}

describe('Context plugin', () => {
  const bundle0: ResolvedBundle = {
    type: 'bundle',
    name: 'bundle0',
    directory: pathlib.join(bundlesDir, 'bundle0'),
    manifest: {}
    // entryPoint: pathlib.join(bundlesDir, 'bundle0', 'src', 'index.ts')
  };

  test('allows importing js-slang/context within the same bundle', () => {
    return expect(testPlugin(pathlib.join(bundlesDir, 'bundle0'), bundle0)).resolves.toBeUndefined();
  });

  test('blocks importing js-slang/context from a different bundle', () => {
    return expect(testPlugin(pathlib.join(bundlesDir, 'bundle1'), bundle0)).resolves.toEqual({
      errors: [{
        text: 'bundle0 bundle is attempting to import js-slang/context via bundle1 bundle, which is not allowed.'
      }]
    });
  });

  test('blocks importing js-slang/context from outside bundles', () => {
    return expect(testPlugin('/some/other/path/file.ts', bundle0)).resolves.toEqual({
      errors: [{
        text: 'js-slang/context can only be imported by bundles.'
      }]
    });
  });

  const tab0: InputAsset = {
    type: 'tab',
    name: 'tab0',
    directory: pathlib.join(tabsDir, 'tab0'),
    entryPoint: pathlib.join(tabsDir, 'tab0', 'src', 'index.tsx')
  };

  test('blocks importing js-slang/context from a tab', () => {
    return expect(testPlugin(pathlib.join(bundlesDir, 'bundle0'), tab0)).resolves.toEqual({
      errors: [{
        text: 'tab0 tab is attempting to import js-slang/context via bundle0 bundle, which is not allowed.'
      }]
    });
  });
});
