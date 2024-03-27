import { testBuildCommand } from '@src/build/__tests__/testingUtils';
import type { MockedFunction } from 'jest-mock';
import * as tabs from '../tabs';

jest.mock('esbuild', () => ({
  build: jest.fn().mockResolvedValue({ outputFiles: [] })
}));

jest.spyOn(tabs, 'bundleTabs');

testBuildCommand('buildTabs', tabs.getBuildTabsCommand, [tabs.bundleTabs]);

test('Normal command', async () => {
  await tabs.getBuildTabsCommand().parseAsync(['-t', 'tab0'], { from: 'user' });

  expect(tabs.bundleTabs).toHaveBeenCalledTimes(1);

  const [args] = (tabs.bundleTabs as MockedFunction<typeof tabs.bundleTabs>)
    .mock.calls[0];
  expect(args).toMatchObject({
    bundles: [],
    tabs: ['tab0'],
    modulesSpecified: true
  });
});
