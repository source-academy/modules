import { Command } from "@commander-js/extra-typings";
import { resolveAllBundles, resolveSingleBundle } from "../build/manifest";
import { getBundlesDir } from "../utils";
import chalk from "chalk";

export const getListBundlesCommand = () => new Command('bundle')
  .description('Lists all the bundles present or the information for a specific bundle in a given directory')
  .argument('[directory]')
  .action(async directory => {
    if (directory === undefined) {
      const bundlesDir = await getBundlesDir()
      const manifest = await resolveAllBundles(bundlesDir)
      const bundleNames = Object.keys(manifest)

      if (bundleNames.length > 0 ) {
        const bundlesStr = bundleNames.map((each, i) => `${i+1}. ${each}`).join('\n')
        console.log(`${chalk.magentaBright(`Detected ${bundleNames.length} bundles in ${directory}:`)}\n${bundlesStr}`)
      } else {
        console.log(chalk.redBright(`No bundles in ${directory}`))
      }
    } else {
      const manifest = await resolveSingleBundle(directory)
      console.log(chalk.magentaBright(`Bundle '${manifest.name}' found in ${directory}`))
    }
  })

export const getListCommand = () => new Command('list')
  .addCommand(getListBundlesCommand())