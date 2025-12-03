import pathlib from 'path';
import { bundlesDir } from '@sourceacademy/modules-repotools/getGitRoot';
import type { OnResolveResult, PluginBuild } from 'esbuild';
import { describe, expect, test } from 'vitest';
import { getBundleContextPlugin } from '../commons.js';

function testPlugin(importerPath: string, currentBundle: string) {
  const plugin = getBundleContextPlugin(currentBundle);

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

describe('Bundle context plugin', () => {
  test('allows importing js-slang/context within the same bundle', () => {
    return expect(testPlugin(pathlib.join(bundlesDir, 'bundle0'), 'bundle0')).resolves.toBeUndefined();
  });

  test('blocks importing js-slang/context from a different bundle', () => {
    return expect(testPlugin(pathlib.join(bundlesDir, 'bundle1'), 'bundle0')).resolves.toEqual({
      errors: [{
        text: 'Bundle "bundle1" is attempting to import js-slang/context via bundle "bundle0", which is not allowed.'
      }]
    });
  });

  test('blocks importing js-slang/context from outside bundles', () => {
    return expect(testPlugin('/some/other/path/file.ts', 'bundle0')).resolves.toEqual({
      errors: [{
        text: 'js-slang/context can only be imported by bundles.'
      }]
    });
  });
});
