/* [Imports] */
import {
  bundleNamesToConfigs,
  getRollupBundleNames,
  tabNamesToConfigs,
} from './utilities.js';

/* [Exports] */
export default function (commandLineArguments) {
  let rollupBundleNames = getRollupBundleNames(
    Boolean(commandLineArguments.quick)
  );
  let { bundleNames, tabNames } = rollupBundleNames;

  //NOTE When using this rollup config, optionally specify extra command line
  // arguments, eg in npm scripts
  let buildBundles = !commandLineArguments.skipBundles;
  let buildTabs = !commandLineArguments.skipTabs;

  // Delete so rollup ignores the custom argument and doesn't log a warning
  delete commandLineArguments.quick;
  delete commandLineArguments.skipBundles;
  delete commandLineArguments.skipTabs;

  let bundleConfigs = buildBundles ? bundleNamesToConfigs(bundleNames) : [];
  let tabConfigs = buildTabs ? tabNamesToConfigs(tabNames) : [];

  // Rollup bundle configs, for module bundles and/or module tabs
  let rollupBundleConfigs = [...bundleConfigs, ...tabConfigs];
  if (rollupBundleConfigs.length === 0)
    throw new Error('(Nothing new to build)');

  return rollupBundleConfigs;
}
