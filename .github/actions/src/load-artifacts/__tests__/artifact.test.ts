import { ArtifactNotFoundError, type DefaultArtifactClient } from '@actions/artifact';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as manifest from '@sourceacademy/modules-repotools/manifest';
import { expect, test, vi } from 'vitest';
import { main } from '../index.js';

vi.mock(import('@actions/core'), async importOriginal => {
  const original = await importOriginal();
  return {
    ...original,
    // Mock these functions to remove stdout output
    error: vi.fn(),
    info: () => { },
    startGroup: () => { },
    setFailed: vi.fn(),
    getInput: vi.fn(),
    endGroup: () => { }
  };
});

vi.mock(import('@actions/artifact'), async importOriginal => {
  const original = await importOriginal();

  return {
    ...original,
    DefaultArtifactClient: class extends original.DefaultArtifactClient {
      override getArtifact = mockedGetArtifact;
      override downloadArtifact = () => Promise.resolve({});
    }
  };
});

vi.mock(import('../../gitRoot.js'), () => ({
  gitRoot: 'root'
}));

const mockedResolveAllTabs = vi.spyOn(manifest, 'resolveAllTabs');
const mockedResolveAllBundles = vi.spyOn(manifest, 'resolveAllBundles');
const mockedGetArtifact = vi.fn<DefaultArtifactClient['getArtifact']>(async name => {
  if (name === 'Tab0-tab') {
    return { artifact: { id: 0, size: 0, name } };
  }

  if (name === 'bundle0-bundle') {
    return { artifact: { id: 1, size: 0, name } };
  }

  if (name === 'manifest') {
    return { artifact: { id: 2, size: 0, name } };
  }

  throw new ArtifactNotFoundError();
});
const mockedGetInput = vi.mocked(core.getInput);
const mockedExec = vi.spyOn(exec, 'exec').mockResolvedValue(0);

function testCase(
  this: 'skip' | 'only' | void,
  desc: string,
  input: { loadBundles?: boolean, loadTabs?: boolean, loadManifest?: boolean },
  testFn: () => Promise<void>
) {
  let fn: typeof test | typeof test.skip | typeof test.only;
  if (this === 'skip') {
    fn = test.skip;
  } else if (this === 'only') {
    fn = test.only;
  } else {
    fn = test;
  }

  fn(desc, async () => {
    mockedGetInput.mockImplementation((name: string) => {
      if (name === 'load-bundles') {
        return input.loadBundles ? 'true' : 'false';
      } else if (name === 'load-tabs') {
        return input.loadTabs ? 'true' : 'false';
      } else if (name === 'load-manifest') {
        return input.loadManifest ? 'true' : 'false';
      }
      return '';
    });

    await testFn();
  });
}

testCase.only = testCase.bind('only');
testCase.skip = testCase.bind('skip');

testCase(
  'bundle resolution errors cause setFailed to be called',
  { loadBundles: true },
  async () => {
    mockedResolveAllBundles.mockResolvedValueOnce({
      severity: 'error',
      errors: ['error1']
    });

    await main();

    expect(mockedResolveAllBundles).toHaveBeenCalledOnce();
    expect(core.error).toHaveBeenCalledExactlyOnceWith('error1');
    expect(core.setFailed).toHaveBeenCalledExactlyOnceWith('Bundle resolution failed with errors');
  }
);

testCase(
  'tab resolution errors cause setFailed to be called',
  { loadTabs: true },
  async () => {
    mockedResolveAllTabs.mockResolvedValueOnce({
      severity: 'error',
      errors: ['error1']
    });

    await main();

    expect(mockedResolveAllTabs).toHaveBeenCalledOnce();
    expect(core.error).toHaveBeenCalledExactlyOnceWith('error1');
    expect(core.setFailed).toHaveBeenCalledExactlyOnceWith('Tab resolution failed with errors');
  }
);

testCase(
  'assets that can\'t be found are built',
  { loadBundles: true, loadTabs: true, loadManifest: true },
  async () => {
    mockedResolveAllTabs.mockResolvedValueOnce({
      severity: 'success',
      tabs: {
        Tab0: {
          type: 'tab',
          directory: 'tab0',
          name: 'Tab0',
          entryPoint: 'tab0/index.tsx',
        },
        Tab1: {
          type: 'tab',
          directory: 'tab1',
          name: 'Tab1',
          entryPoint: 'tab1/index.tsx',
        },
      }
    });

    mockedResolveAllBundles.mockResolvedValueOnce({
      severity: 'success',
      bundles: {
        bundle0: {
          type: 'bundle',
          directory: 'bundle0',
          name: 'bundle0',
          manifest: {}
        },
        bundle1: {
          type: 'bundle',
          directory: 'bundle1',
          name: 'bundle1',
          manifest: {}
        },
      }
    });

    await expect(main()).resolves.not.toThrow();

    expect(mockedResolveAllTabs).toHaveBeenCalledOnce();
    expect(mockedResolveAllBundles).toHaveBeenCalledOnce();

    expect(mockedGetArtifact).toHaveBeenCalledTimes(5);
    const [
      [artifactCall0],
      [artifactCall1],
      [artifactCall2],
      [artifactCall3],
      [artifactCall4],
    ] = mockedGetArtifact.mock.calls;

    expect(artifactCall0).toEqual('Tab0-tab');
    expect(artifactCall1).toEqual('Tab1-tab');
    expect(artifactCall2).toEqual('bundle0-bundle');
    expect(artifactCall3).toEqual('bundle1-bundle');
    expect(artifactCall4).toEqual('manifest');

    expect(exec.exec).toHaveBeenCalledTimes(2);
    const [[execCmd0, execCall0], [execCmd1, execCall1]] = vi.mocked(exec.exec).mock.calls;

    expect(execCmd0).toEqual('yarn workspaces focus');
    expect(execCall0).not.toContain('@sourceacademy/tab-Tab0');
    expect(execCall0).toContain('@sourceacademy/tab-Tab1');
    expect(execCall0).not.toContain('@sourceacademy/bundle-bundle0');
    expect(execCall0).toContain('@sourceacademy/bundle-bundle1');

    expect(execCmd1).toEqual('yarn workspaces foreach -pA');
    expect(execCall1).not.toContain('@sourceacademy/tab-Tab0');
    expect(execCall1).toContain('@sourceacademy/tab-Tab1');
    expect(execCall1).not.toContain('@sourceacademy/bundle-bundle0');
    expect(execCall1).toContain('@sourceacademy/bundle-bundle1');
  }
);

testCase(
  'load-bundles only means tabs don\'t get resolved',
  { loadBundles: true },
  async () => {
    mockedResolveAllBundles.mockResolvedValueOnce({
      severity: 'success',
      bundles: {}
    });

    await main();

    expect(mockedResolveAllTabs).not.toHaveBeenCalled();
    expect(mockedResolveAllBundles).toHaveBeenCalledOnce();
  }
);

testCase(
  'load-tabs only means bundles don\'t get resolved',
  { loadTabs: true },
  async () => {
    mockedResolveAllTabs.mockResolvedValueOnce({
      severity: 'success',
      tabs: {}
    });

    await main();

    expect(mockedResolveAllTabs).toHaveBeenCalledOnce();
    expect(mockedResolveAllBundles).not.toHaveBeenCalled();
  }
);

testCase(
  'install failure means build doesn\'t happen',
  { loadTabs: true },
  async () => {
    mockedResolveAllTabs.mockResolvedValueOnce({
      severity: 'success',
      tabs: {
        Tab0: {
          type: 'tab',
          directory: 'tab0',
          name: 'Tab0',
          entryPoint: 'tab0/index.tsx',
        },
      }
    });

    mockedGetArtifact.mockRejectedValueOnce(new ArtifactNotFoundError());
    mockedExec.mockRejectedValueOnce(new Error('yarn workspace focus failed'));

    await expect(main()).rejects.toThrow('yarn workspace focus failed');

    expect(mockedResolveAllTabs).toHaveBeenCalledOnce();
    expect(mockedGetArtifact).toHaveBeenCalledOnce();
    expect(exec.exec).toHaveBeenCalledOnce();
  }
);
