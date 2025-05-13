import pathlib from 'path'
import { Command } from "@commander-js/extra-typings";
import { buildBundle } from "../build/modules/bundle";
import { getBundleManifest } from "../build/modules/manifest";
import { buildTab } from '../build/modules/tab';
import { getGitRoot } from '../utils';

const outDir = pathlib.join(await getGitRoot(), 'build')
export const getBuildBundleCommand = () => new Command('bundle')
  .argument('<bundle>', 'Directory in which the bundle\'s source files are located')
  .action(async bundleDir => {
    const manifest = await getBundleManifest(`${bundleDir}/manifest.json`)
    await buildBundle(bundleDir, manifest, outDir)
  })

export const getBuildTabCommand = () => new Command('tab')
  .argument('<tab>', 'Directory in which the tab\'s source files are located')
  .action(async tabDir => {
    await buildTab(tabDir, outDir)
  })

export const getBuildCommand = () => new Command('build')
  .addCommand(getBuildBundleCommand())
  .addCommand(getBuildTabCommand())