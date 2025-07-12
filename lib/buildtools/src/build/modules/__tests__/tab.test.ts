import { describe, expect, it, test, vi } from 'vitest';
import { expectIsSuccess, testMocksDir } from '../../../__tests__/fixtures.js';
import { resolveAllTabs, resolveSingleTab } from '../../manifest.js';

vi.mock(import('../../../getGitRoot.js'));

describe('Test resolveSingleTab', () => {
  it('properly detects a tab with the src/index.tsx entrypoint', async () => {
    const resolved = await resolveSingleTab(`${testMocksDir}/tabs/tab0`);

    expect(resolved).not.toBeUndefined();
    expect(resolved).toMatchObject({
      entryPoint: `${testMocksDir}/tabs/tab0/src/index.tsx`,
      directory: `${testMocksDir}/tabs/tab0`,
      name: 'tab0'
    });
  });

  it('properly detects a bundle with the index.tsx entrypoint', async () => {
    const resolved = await resolveSingleTab(`${testMocksDir}/tabs/tab1`);

    expect(resolved).not.toBeUndefined();
    expect(resolved).toMatchObject({
      entryPoint: `${testMocksDir}/tabs/tab1/index.tsx`,
      directory: `${testMocksDir}/tabs/tab1`,
      name: 'tab1'
    });
  });
});

test('resolveAllTabs', async () => {
  const resolved = await resolveAllTabs(`${testMocksDir}/bundles`, `${testMocksDir}/tabs`);

  expectIsSuccess(resolved.severity);
  const { tabs } = resolved;

  expect(tabs).toHaveProperty('tab0');
  expect(tabs.tab0).toMatchObject({
    entryPoint: `${testMocksDir}/tabs/tab0/src/index.tsx`,
    directory: `${testMocksDir}/tabs/tab0`,
    name: 'tab0'
  });

  expect(tabs).toHaveProperty('tab1');
  expect(tabs.tab1).toMatchObject({
    entryPoint: `${testMocksDir}/tabs/tab1/index.tsx`,
    directory: `${testMocksDir}/tabs/tab1`,
    name: 'tab1'
  });
});
