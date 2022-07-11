/* [Imports] */
import chalk from 'chalk';
import {
  bundleNamesToConfigs,
  getFinalPlugins,
  getRollupBundleNames,
  tabNamesToConfigs,
} from './utilities.js';

/* [Exports] */
export default function (commandLineArguments) {
  let rollupBundleNames = getRollupBundleNames(
    Boolean(commandLineArguments.quick)
  );
  let { bundleNames, tabNames } = rollupBundleNames;

  // Delete so rollup ignores the custom argument and doesn't log a warning
  delete commandLineArguments.quick;

  let bundleConfigs = bundleNamesToConfigs(bundleNames);
  let tabConfigs = tabNamesToConfigs(tabNames);

  // Rollup bundle configs, for module bundles and/or module tabs
  let rollupBundleConfigs = [...bundleConfigs, ...tabConfigs];
  if (rollupBundleConfigs.length === 0) {
    console.log(chalk.yellowBright('(Nothing new to build)\n'));
    //NOTE The lack of any config for something real to transpile also means the
    // final plugins below don't get the chance to run
    process.exit();
  }

  let lastConfig = rollupBundleConfigs[rollupBundleConfigs.length - 1];
  lastConfig.plugins = [...lastConfig.plugins, ...getFinalPlugins()];
  return rollupBundleConfigs;
}
