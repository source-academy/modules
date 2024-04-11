import { bundlesOption, tabsOption } from '@src/commandUtils';
import { createBuildCommand, type BuildTask, createBuildCommandHandler } from '../utils';
import { bundleBundles } from './bundles';
import { bundleTabs } from './tabs';

export const buildModules: BuildTask = async (inputs, opts) => {
  const [bundlesResult, tabsResult] = await Promise.all([
    bundleBundles(inputs, opts),
    bundleTabs(inputs, opts)
  ]);

  return {
    ...bundlesResult,
    ...tabsResult
  };
};

const modulesCommandHandler = createBuildCommandHandler(buildModules);

export const getBuildModulesCommand = () => createBuildCommand('modules', 'Build bundles and tabs')
  .addOption(bundlesOption)
  .addOption(tabsOption)
  .action(modulesCommandHandler);

export { getBuildBundlesCommand } from './bundles';
export { getBuildTabsCommand } from './tabs';
