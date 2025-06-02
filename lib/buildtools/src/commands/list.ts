import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { resolveAllBundles, resolveSingleBundle } from '../build/manifest';
import { resolveAllTabs, resolveSingleTab } from '../build/modules/tab';
import { getBundlesDir, getTabsDir } from '../getGitRoot';

export const getListBundlesCommand = () => new Command('bundle')
  .description('Lists all the bundles present or the information for a specific bundle in a given directory')
  .argument('[directory]')
  .action(async directory => {
    if (directory === undefined) {
      const bundlesDir = await getBundlesDir();
      const manifest = await resolveAllBundles(bundlesDir);
      const bundleNames = Object.keys(manifest);

      if (bundleNames.length > 0 ) {
        const bundlesStr = bundleNames.map((each, i) => `${i+1}. ${each}`).join('\n');
        console.log(`${chalk.magentaBright(`Detected ${bundleNames.length} bundles in ${bundlesDir}:`)}\n${bundlesStr}`);
      } else {
        console.log(chalk.redBright(`No bundles in ${bundlesDir}`));
      }
    } else {
      const manifest = await resolveSingleBundle(directory);
      if (!manifest) {
        throw new Error(`No bundle found at ${directory}!`);
      } else {
        console.log(chalk.magentaBright(`Bundle '${manifest.name}' found in ${directory}`));
      }
    }
  });

export const getListTabsCommand = () => new Command('tabs')
  .description('Lists all the tabs present or the information for a specific tab in a given directory')
  .argument('[directory]')
  .action(async directory => {
    if (directory === undefined) {
      const [bundlesDir, tabsDir] = await Promise.all([
        getBundlesDir(),
        getTabsDir()
      ]);

      const tabsManifest = await resolveAllTabs(bundlesDir, tabsDir);
      const tabNames = Object.keys(tabsManifest);

      if (tabNames.length > 0) {
        const tabsStr = tabNames.map((each, i) => `${i+1}. ${each}`).join('\n');
        console.log(`${chalk.magentaBright(`Detected ${tabNames.length} bundles in ${tabsDir}:`)}\n${tabsStr}`);
      } else {
        console.log(chalk.redBright(`No tabs in ${tabsDir}`));
      }
    } else {
      const resolvedTab = await resolveSingleTab(directory);
      console.log(chalk.magentaBright(`Tab '${resolvedTab.name}' found in ${directory}`));
    }
  });

export const getListCommand = () => new Command('list')
  .addCommand(getListBundlesCommand())
  .addCommand(getListTabsCommand());
