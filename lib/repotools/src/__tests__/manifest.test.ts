import pathlib from 'path';
import { describe, expect, it, test, vi } from 'vitest';
import { resolveAllTabs, resolveSingleTab } from '../manifest.js';

const testMocksDir = pathlib.resolve(import.meta.dirname, '../../../__test_mocks__');
vi.mock(import('../getGitRoot.js'));

function expectSuccess(obj: unknown): asserts obj is 'success' {
  expect(obj).toEqual('success');
}

describe('Test resolveSingleTab', () => {
  it('properly detects a tab with the src/index.tsx entrypoint', async () => {
    const resolved = await resolveSingleTab(pathlib.join(testMocksDir, 'tabs', 'tab0'));

    expect(resolved).not.toBeUndefined();
    expect(resolved).toMatchObject({
      entryPoint: pathlib.join(testMocksDir, 'tabs', 'tab0', 'src', 'index.tsx'),
      directory: pathlib.join(testMocksDir, 'tabs', 'tab0'),
      name: 'tab0'
    });
  });

  it('properly detects a bundle with the index.tsx entrypoint', async () => {
    const resolved = await resolveSingleTab(`${testMocksDir}/tabs/tab1`);

    expect(resolved).not.toBeUndefined();
    expect(resolved).toMatchObject({
      entryPoint: pathlib.join(testMocksDir, 'tabs', 'tab1', 'index.tsx'),
      directory: pathlib.join(testMocksDir, 'tabs', 'tab1'),
      name: 'tab1'
    });
  });
});

test('resolveAllTabs', async () => {
  const resolved = await resolveAllTabs(pathlib.join(testMocksDir, 'bundles'), pathlib.join(testMocksDir, 'tabs'));
  expectSuccess(resolved.severity);

  const { tabs } = resolved;

  expect(tabs).toHaveProperty('tab0');
  expect(tabs.tab0).toMatchObject({
    entryPoint: pathlib.join(testMocksDir, 'tabs', 'tab0', 'src', 'index.tsx'),
    directory: pathlib.join(testMocksDir, 'tabs', 'tab0'),
    name: 'tab0'
  });

  expect(tabs).toHaveProperty('tab1');
  expect(tabs.tab1).toMatchObject({
    entryPoint: pathlib.join(testMocksDir, 'tabs', 'tab1', 'index.tsx'),
    directory: pathlib.join(testMocksDir, 'tabs', 'tab1'),
    name: 'tab1'
  });
});
