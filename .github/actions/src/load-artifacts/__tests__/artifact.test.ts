import { ArtifactNotFoundError } from '@actions/artifact';
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
    endGroup: () => { }
  };
});
const mockedResolveAllTabs = vi.spyOn(manifest, 'resolveAllTabs');

const mockedGetArtifact = vi.fn();
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

const mockedExec = vi.spyOn(exec, 'exec').mockResolvedValue(0);

test('tab resolution errors cause setFailed to be called', async () => {
  mockedResolveAllTabs.mockResolvedValueOnce({
    severity: 'error',
    errors: ['error1']
  });

  await main();

  expect(mockedResolveAllTabs).toHaveBeenCalledOnce();
  expect(core.error).toHaveBeenCalledExactlyOnceWith('error1');
  expect(core.setFailed).toHaveBeenCalledExactlyOnceWith('Tab resolution failed with errors');
});

test('tabs that can\'t be found are built', async () => {
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

  mockedGetArtifact.mockImplementation(name => {
    if (name === 'Tab0-tab') {
      return { artifact: { id: 0 } };
    }
    throw new ArtifactNotFoundError();
  });

  await main();

  expect(mockedGetArtifact).toHaveBeenCalledTimes(2);
  expect(mockedResolveAllTabs).toHaveBeenCalledOnce();

  const [[artifactCall0], [artifactCall1]] = mockedGetArtifact.mock.calls;
  expect(artifactCall0).toEqual('Tab0-tab');
  expect(artifactCall1).toEqual('Tab1-tab');

  expect(exec.exec).toHaveBeenCalledTimes(2);
  const [[execCmd0, execCall0], [execCmd1, execCall1]] = vi.mocked(exec.exec).mock.calls;

  expect(execCmd0).toEqual('yarn workspaces focus');
  expect(execCall0).toContain('@sourceacademy/tab-Tab1');
  expect(execCall0).not.toContain('@sourceacademy/tab-Tab0');

  expect(execCmd1).toEqual('yarn workspaces foreach -pA');
  expect(execCall1).toContain('@sourceacademy/tab-Tab1');
  expect(execCall1).not.toContain('@sourceacademy/tab-Tab0');
});

test('install failure means build doesn\'t happen', async () => {
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
  mockedExec.mockResolvedValueOnce(1);

  await main();

  expect(mockedGetArtifact).toHaveBeenCalledOnce();
  expect(exec.exec).toHaveBeenCalledOnce();
  expect(core.setFailed).toHaveBeenCalledExactlyOnceWith('yarn workspace focus failed');
});
