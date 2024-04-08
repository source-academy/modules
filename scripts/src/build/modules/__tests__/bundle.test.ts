import type { MockedFunction } from 'jest-mock';
import { testBuildCommand } from '@src/build/__tests__/testingUtils';
import * as bundles from '../bundles';

jest.spyOn(bundles, 'bundleBundles');

jest.mock('esbuild', () => ({
  build: jest.fn()
    .mockResolvedValue({ outputFiles: [] })
}));

testBuildCommand(
  'buildBundles',
  bundles.getBuildBundlesCommand,
  [bundles.bundleBundles]
);

test('Normal command', async () => {
  await bundles.getBuildBundlesCommand()
    .parseAsync(['-b', 'test0'], { from: 'user' });

  expect(bundles.bundleBundles)
    .toHaveBeenCalledTimes(1);

  const [args] = (bundles.bundleBundles as MockedFunction<typeof bundles.bundleBundles>).mock.calls[0];
  expect(args)
    .toMatchObject({
      bundles: ['test0'],
      tabs: ['tab0'],
      modulesSpecified: true
    });
});
