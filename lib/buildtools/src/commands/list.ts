import { Command } from '@commander-js/extra-typings';
import { bundlesDir, tabsDir } from '@sourceacademy/modules-repotools/getGitRoot';
import { resolveAllBundles, resolveAllTabs, resolveSingleBundle, resolveSingleTab } from '@sourceacademy/modules-repotools/manifest';
import chalk from 'chalk';
import { omit } from 'es-toolkit';
import { logCommandErrorAndExit } from './commandUtils.js';

export const getListBundlesCommand = () => new Command('bundle')
  .description('Lists all the bundles present in a given directory')
  .option('--raw', 'Output just the names of bundles')
  .argument('[directory]', 'Directory to check', bundlesDir)
  .action(async (directory, { raw }) => {
    const manifestResult = await resolveAllBundles(directory);
    if (manifestResult.severity === 'error') {
      logCommandErrorAndExit(manifestResult);
    }

    const bundleNames = Object.keys(manifestResult.bundles);

    if (bundleNames.length > 0) {
      if (raw) {
        console.log(bundleNames.join('\n'));
        return;
      }

      const bundlesStr = bundleNames.map((each, i) => `${i + 1}. ${each}`).join('\n');
      console.log(`${chalk.magentaBright(`Detected ${bundleNames.length} bundles in ${bundlesDir}:`)}\n${bundlesStr}`);
    } else {
      logCommandErrorAndExit(`No bundles in ${bundlesDir}!`);
    }
  });

export const getListTabsCommand = () => new Command('tabs')
  .description('Lists all the tabs present or the information for a specific tab in a given directory')
  .option('--raw', 'Output just the names of tabs')
  .argument('[directory]')
  .action(async (directory, { raw }) => {
    if (directory === undefined) {
      const tabsManifest = await resolveAllTabs(bundlesDir, tabsDir);
      if (tabsManifest.severity === 'error') {
        logCommandErrorAndExit(tabsManifest);
      }

      const tabNames = Object.keys(tabsManifest.tabs);

      if (tabNames.length > 0) {
        if (raw) {
          console.log(tabNames.join('\n'));
          return;
        }

        const tabsStr = tabNames.map((each, i) => `${i + 1}. ${each}`).join('\n');
        console.log(`${chalk.magentaBright(`Detected ${tabNames.length} tabs in ${tabsDir}:`)}\n${tabsStr}`);
      } else {
        logCommandErrorAndExit(`No tabs in ${tabsDir}`);
      }
    } else {
      const resolvedTab = await resolveSingleTab(directory);
      if (!resolvedTab) {
        logCommandErrorAndExit(`No tab found in ${directory}`);
      }
      console.log(chalk.magentaBright(`Tab '${resolvedTab.name}' found in ${directory}`));
    }
  });

export const getValidateCommand = () => new Command('validate')
  .description('Validate the bundle at the given directory')
  .argument('<directory>')
  .action(async directory => {
    const manifestResult = await resolveSingleBundle(directory);
    if (!manifestResult) {
      logCommandErrorAndExit(`No bundle found at ${directory}!`);
    } else if (manifestResult.severity === 'error') {
      logCommandErrorAndExit(manifestResult);
    } else {
      const bundle = omit(manifestResult.bundle, 'type');
      const manifestStr = JSON.stringify(bundle, null, 2);
      console.log(`${chalk.magentaBright(`Bundle '${manifestResult.bundle.name}' found in ${directory}`)}:\n${manifestStr}`);
    }
  });

export const getListCommand = () => new Command('list')
  .addCommand(getListBundlesCommand())
  .addCommand(getListTabsCommand());
