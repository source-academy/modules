/* [Imports] */
import chalk from 'chalk';
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
  if (rollupBundleConfigs.length === 0) {
    console.log(chalk.yellowBright('(Nothing new to build)\n'));
    //NOTE Lack of any config for something real to transpile means the copy
    // plugin will also not run on modules.json
    process.exit();
  }

  return rollupBundleConfigs;
}
