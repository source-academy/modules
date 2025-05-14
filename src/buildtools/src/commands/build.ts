import fs from 'fs/promises'
import pathlib from 'path'
import { Command } from "@commander-js/extra-typings";
import { buildBundle } from "../build/modules/bundle";
import { getBundleManifests } from "../build/modules/manifest";
import { buildTab } from '../build/modules/tab';
import { getGitRoot } from '../utils';

const gitRoot = await getGitRoot()
const bundlesDir = pathlib.join(gitRoot, 'src', 'bundles')
const outDir = pathlib.join(gitRoot, 'build')

export const getBuildBundleCommand = () => new Command('bundle')
  .argument('<bundle>', 'Directory in which the bundle\'s source files are located')
  .action(async bundleDir => {
    await buildBundle(bundleDir, outDir)
  })

export const getBuildTabCommand = () => new Command('tab')
  .argument('<tab>', 'Directory in which the tab\'s source files are located')
  .action(async tabDir => {
    await buildTab(tabDir, outDir)
  })

export const getBuildManifestCommand = () => new Command('manifest')
  .action(async () => {
    const manifest = await getBundleManifests(bundlesDir)
    await fs.mkdir(outDir, { recursive: true })
    await fs.writeFile(`${outDir}/modules.json`, JSON.stringify(manifest, null, 2))
  })

export const getBuildCommand = () => new Command('build')
  .addCommand(getBuildBundleCommand())
  .addCommand(getBuildTabCommand())
  .addCommand(getBuildManifestCommand())
